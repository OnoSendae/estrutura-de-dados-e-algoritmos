#!/bin/bash

# Phase 4: Content Migration (.md files)
# Migrates markdown content from old structure to new structure

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HELPERS_DIR="$(dirname "$SCRIPT_DIR")/helpers"

# Source helper functions
source "$HELPERS_DIR/utils.sh"
source "$HELPERS_DIR/mapping.sh"
source "$HELPERS_DIR/validation.sh"

phase4_content_migration() {
    local dry_run="${1:-false}"
    
    log_info "=== Phase 4: Content Migration ==="
    
    if [[ "$dry_run" == "true" ]]; then
        log_info "🔍 DRY RUN MODE - No files will be moved"
    fi
    
    local total_files=0
    local migrated_files=0
    local skipped_files=0
    local error_files=0
    
    # Count total .md files first
    log_info "Scanning for content files..."
    while read -r old_path; do
        [[ -f "$old_path" ]] && ((total_files++))
    done < <(find src/modulos-treinamento -name "*.md" 2>/dev/null || true)
    
    log_info "Found $total_files markdown files to migrate"
    
    # Process each .md file
    while read -r old_path; do
        [[ ! -f "$old_path" ]] && continue
        
        local filename=$(basename "$old_path")
        
        # Extract module path components
        local relative_path="${old_path#src/modulos-treinamento/}"
        local path_parts=(${relative_path//\// })
        local old_module_name="${path_parts[0]}"
        
        # Handle subdirectories like exercicios-extras, examples, etc.
        local subdirectory=""
        if [[ ${#path_parts[@]} -gt 2 ]]; then
            subdirectory="${path_parts[1]}"
        fi
        
        # Get new module info using mapping
        local new_module_name=$(get_new_module_name "$old_module_name")
        
        if [[ -z "$new_module_name" ]]; then
            log_error "No mapping found for module: $old_module_name"
            ((error_files++))
            continue
        fi
        
        # Determine content type and new path
        local content_type="lessons"
        local new_filename="$filename"
        
        # Handle special subdirectories
        if [[ -n "$subdirectory" ]]; then
            case "$subdirectory" in
                "exercicios-extras"|"exercises"|"exercicios")
                    content_type="exercises"
                    ;;
                "examples"|"exemplos")
                    content_type="examples"
                    ;;
                "solucoes"|"solutions")
                    content_type="solutions"
                    ;;
                *)
                    # For unknown subdirectories, create them under resources
                    content_type="resources"
                    ;;
            esac
        else
            # Categorize content based on filename patterns
            if [[ "$filename" =~ ^[0-9]+.*exercicio.*\.md$ ]] || [[ "$filename" =~ .*exercicio.*\.md$ ]]; then
                content_type="exercises"
            elif [[ "$filename" =~ ^[0-9]+.*example.*\.md$ ]] || [[ "$filename" =~ .*exemplo.*\.md$ ]]; then
                content_type="examples"
            fi
        fi
        
        # Standardize filename (convert to English if needed)
        new_filename=$(standardize_filename "$filename")
        
        local new_path="modules/$new_module_name/$content_type/$new_filename"
        
        # Check if target already exists
        if [[ -f "$new_path" ]]; then
            log_warning "Target already exists, skipping: $new_path"
            ((skipped_files++))
            continue
        fi
        
        # Ensure target directory exists
        if [[ "$dry_run" == "false" ]]; then
            mkdir -p "$(dirname "$new_path")"
        fi
        
        # Migrate the file
        if [[ "$dry_run" == "true" ]]; then
            log_info "WOULD MIGRATE: $old_path -> $new_path"
            ((migrated_files++))
        else
            if cp "$old_path" "$new_path"; then
                log_success "Migrated: $old_path -> $new_path"
                
                # Update internal links and references in the migrated file
                update_content_references "$new_path" "$new_module_name"
                
                ((migrated_files++))
            else
                log_error "Failed to migrate: $old_path"
                ((error_files++))
            fi
        fi
        
        # Progress indicator
        local current=$((migrated_files + skipped_files + error_files))
        if ((current % 10 == 0)) || ((current == total_files)); then
            log_info "Progress: $current/$total_files files processed"
        fi
        
    done < <(find src/modulos-treinamento -name "*.md" 2>/dev/null || true)
    
    # Summary
    log_info "Content Migration Summary:"
    log_info "  Total files found: $total_files"
    log_info "  Successfully migrated: $migrated_files"
    log_info "  Skipped (already exists): $skipped_files"
    log_info "  Errors: $error_files"
    
    if [[ "$dry_run" == "false" ]]; then
        # Create migration manifest
        create_content_migration_manifest
        
        if ((error_files > 0)); then
            log_warning "Phase 4 completed with $error_files errors"
            return 1
        else
            log_success "Phase 4: Content Migration completed successfully!"
        fi
    else
        log_info "Phase 4: Content Migration dry run completed!"
    fi
    
    return 0
}

# Update internal references within migrated content
update_content_references() {
    local file_path="$1"
    local module_id="$2"
    
    # Update Jekyll front matter if present
    if grep -q "^---$" "$file_path"; then
        # Add module information to front matter
        local temp_file=$(mktemp)
        local in_frontmatter=false
        local frontmatter_ended=false
        
        while IFS= read -r line; do
            if [[ "$line" == "---" ]]; then
                if [[ "$in_frontmatter" == "false" ]]; then
                    in_frontmatter=true
                    echo "$line" >> "$temp_file"
                else
                    # Add module info before closing front matter
                    echo "module_id: $module_id" >> "$temp_file"
                    echo "course: estrutura-de-dados-e-algoritmos" >> "$temp_file"
                    echo "$line" >> "$temp_file"
                    frontmatter_ended=true
                fi
            else
                echo "$line" >> "$temp_file"
            fi
        done < "$file_path"
        
        mv "$temp_file" "$file_path"
    fi
    
    # Update relative paths in markdown links
    # This is a basic implementation - could be expanded
    sed -i.bak 's|src/modulos-treinamento/|modules/|g' "$file_path" 2>/dev/null || true
    rm -f "$file_path.bak" 2>/dev/null || true
}

# Standardize filename to English conventions
standardize_filename() {
    local filename="$1"
    
    # Basic Portuguese to English translations for common terms
    filename="${filename//exercicio/exercise}"
    filename="${filename//exercicios/exercises}"
    filename="${filename//exemplo/example}"
    filename="${filename//exemplos/examples}"
    filename="${filename//visao-geral/overview}"
    filename="${filename//introducao/introduction}"
    filename="${filename//fundamentos/fundamentals}"
    filename="${filename//conceitos/concepts}"
    filename="${filename//praticos/practical}"
    
    echo "$filename"
}

# Create manifest of migrated content
create_content_migration_manifest() {
    local manifest_file="backups/content-migration-$(date +%Y%m%d_%H%M%S).manifest"
    
    log_info "Creating content migration manifest: $manifest_file"
    
    echo "# Content Migration Manifest" > "$manifest_file"
    echo "# Generated on: $(date)" >> "$manifest_file"
    echo "" >> "$manifest_file"
    
    # List all migrated files
    find modules -name "*.md" -type f | while read -r file; do
        echo "$file|$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)|$(date -r "$file" +%Y-%m-%d_%H:%M:%S)" >> "$manifest_file"
    done
    
    log_success "Content migration manifest created: $manifest_file"
}

# Rollback content migration
rollback_phase4() {
    local backup_id="$1"
    
    log_info "Rolling back Phase 4: Content Migration (Backup ID: $backup_id)"
    
    # Remove migrated content
    if [[ -d "modules" ]]; then
        find modules -name "*.md" -type f -delete 2>/dev/null || true
        log_info "Removed migrated markdown files"
    fi
    
    log_success "Phase 4 rollback completed"
}

# Main execution (if script is run directly)
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    DRY_RUN="${1:-false}"
    phase4_content_migration "$DRY_RUN"
fi 