#!/bin/bash

# Phase 5: Media Migration (audio files)
# Migrates audio files from old structure to new centralized structure

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HELPERS_DIR="$(dirname "$SCRIPT_DIR")/helpers"

# Source helper functions
source "$HELPERS_DIR/utils.sh"
source "$HELPERS_DIR/mapping.sh"
source "$HELPERS_DIR/validation.sh"

phase5_media_migration() {
    local dry_run="${1:-false}"
    
    log_info "=== Phase 5: Media Migration ==="
    
    if [[ "$dry_run" == "true" ]]; then
        log_info "🔍 DRY RUN MODE - No files will be moved"
    fi
    
    local total_files=0
    local migrated_files=0
    local skipped_files=0
    local error_files=0
    
    # Supported audio formats
    local audio_extensions=("mp3" "wav" "m4a" "ogg" "flac")
    
    # Count total audio files first
    log_info "Scanning for audio files..."
    for ext in "${audio_extensions[@]}"; do
        while read -r old_path; do
            [[ -f "$old_path" ]] && ((total_files++))
        done < <(find src/modulos-treinamento -name "*.$ext" 2>/dev/null || true)
    done
    
    log_info "Found $total_files audio files to migrate"
    
    # Create centralized audio directory structure
    if [[ "$dry_run" == "false" ]]; then
        mkdir -p assets/audio
    fi
    
    # Process each audio file
    for ext in "${audio_extensions[@]}"; do
        while read -r old_path; do
            [[ ! -f "$old_path" ]] && continue
            
            local filename=$(basename "$old_path")
            local old_module_dir=$(dirname "$old_path")
            local old_module_name=$(basename "$old_module_dir")
            
            # Get new module info using mapping
            local new_module_info
            if ! new_module_info=$(get_new_module_info "$old_module_name"); then
                log_error "No mapping found for module: $old_module_name"
                ((error_files++))
                continue
            fi
            
            local new_module_id=$(echo "$new_module_info" | cut -d'|' -f1)
            
            # Standardize filename
            local new_filename=$(standardize_audio_filename "$filename")
            
            # New centralized path: assets/audio/MODULE_ID/filename
            local new_path="assets/audio/$new_module_id/$new_filename"
            
            # Check if target already exists
            if [[ -f "$new_path" ]]; then
                # If sizes are different, it might be a different file
                local old_size=$(stat -f%z "$old_path" 2>/dev/null || stat -c%s "$old_path" 2>/dev/null || echo "0")
                local new_size=$(stat -f%z "$new_path" 2>/dev/null || stat -c%s "$new_path" 2>/dev/null || echo "0")
                
                if [[ "$old_size" != "$new_size" ]]; then
                    log_warn "Size mismatch for existing file: $new_path"
                    local backup_name="${new_filename%.*}_conflict_$(date +%s).${new_filename##*.}"
                    new_path="assets/audio/$new_module_id/$backup_name"
                    log_info "Using alternative name: $backup_name"
                else
                    log_warn "Target already exists with same size, skipping: $new_path"
                    ((skipped_files++))
                    continue
                fi
            fi
            
            # Ensure target directory exists
            if [[ "$dry_run" == "false" ]]; then
                mkdir -p "$(dirname "$new_path")"
            fi
            
            # Migrate the file
            if [[ "$dry_run" == "true" ]]; then
                log_info "WOULD MIGRATE: $old_path -> $new_path"
            else
                if copy_with_verification "$old_path" "$new_path"; then
                    log_success "Migrated: $old_path -> $new_path"
                    ((migrated_files++))
                else
                    log_error "Failed to migrate: $old_path"
                    ((error_files++))
                fi
            fi
            
            # Progress indicator
            local current=$((migrated_files + skipped_files + error_files))
            if ((current % 5 == 0)) || ((current == total_files)); then
                log_info "Progress: $current/$total_files audio files processed"
            fi
            
        done < <(find src/modulos-treinamento -name "*.$ext" 2>/dev/null || true)
    done
    
    # Create audio index for easy reference
    if [[ "$dry_run" == "false" ]]; then
        create_audio_index
    fi
    
    # Summary
    log_info "Media Migration Summary:"
    log_info "  Total files found: $total_files"
    log_info "  Successfully migrated: $migrated_files"
    log_info "  Skipped (already exists): $skipped_files"
    log_info "  Errors: $error_files"
    
    if [[ "$dry_run" == "false" ]]; then
        # Create migration manifest
        create_media_migration_manifest
        
        if ((error_files > 0)); then
            log_warn "Phase 5 completed with $error_files errors"
            return 1
        else
            log_success "Phase 5: Media Migration completed successfully!"
        fi
    else
        log_info "Phase 5: Media Migration dry run completed!"
    fi
    
    return 0
}

# Copy file with integrity verification
copy_with_verification() {
    local source="$1"
    local target="$2"
    
    # Copy the file
    if ! cp "$source" "$target"; then
        return 1
    fi
    
    # Verify file sizes match
    local source_size=$(stat -f%z "$source" 2>/dev/null || stat -c%s "$source" 2>/dev/null || echo "0")
    local target_size=$(stat -f%z "$target" 2>/dev/null || stat -c%s "$target" 2>/dev/null || echo "0")
    
    if [[ "$source_size" != "$target_size" ]]; then
        log_error "Size verification failed: $source ($source_size) vs $target ($target_size)"
        rm -f "$target" 2>/dev/null || true
        return 1
    fi
    
    return 0
}

# Standardize audio filename to English conventions
standardize_audio_filename() {
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
    filename="${filename//analise/analysis}"
    filename="${filename//algoritmos/algorithms}"
    filename="${filename//estruturas/structures}"
    filename="${filename//programacao/programming}"
    filename="${filename//dinamica/dynamic}"
    filename="${filename//gulosos/greedy}"
    filename="${filename//avancados/advanced}"
    filename="${filename//aplicacoes/applications}"
    filename="${filename//topicos/topics}"
    filename="${filename//tecnicas/techniques}"
    filename="${filename//resolucao/resolution}"
    filename="${filename//problemas/problems}"
    
    echo "$filename"
}

# Create audio index file for easy reference
create_audio_index() {
    local index_file="assets/audio/index.yml"
    
    log_info "Creating audio index: $index_file"
    
    echo "# Audio Files Index" > "$index_file"
    echo "# Generated on: $(date)" >> "$index_file"
    echo "# Course: Estrutura de Dados e Algoritmos" >> "$index_file"
    echo "" >> "$index_file"
    echo "modules:" >> "$index_file"
    
    # Process each module directory
    for module_dir in assets/audio/*/; do
        [[ ! -d "$module_dir" ]] && continue
        
        local module_id=$(basename "$module_dir")
        echo "  $module_id:" >> "$index_file"
        echo "    files:" >> "$index_file"
        
        # List all audio files in this module
        find "$module_dir" -type f \( -name "*.mp3" -o -name "*.wav" -o -name "*.m4a" -o -name "*.ogg" -o -name "*.flac" \) | sort | while read -r audio_file; do
            local relative_path=${audio_file#assets/audio/}
            local filename=$(basename "$audio_file")
            local size=$(stat -f%z "$audio_file" 2>/dev/null || stat -c%s "$audio_file" 2>/dev/null || echo "0")
            local duration=$(get_audio_duration "$audio_file" 2>/dev/null || echo "unknown")
            
            echo "      - filename: $filename" >> "$index_file"
            echo "        path: $relative_path" >> "$index_file"
            echo "        size: $size" >> "$index_file"
            echo "        duration: $duration" >> "$index_file"
        done
    done
    
    log_success "Audio index created: $index_file"
}

# Get audio duration (if ffprobe is available)
get_audio_duration() {
    local file="$1"
    
    if command -v ffprobe >/dev/null 2>&1; then
        ffprobe -v quiet -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$file" 2>/dev/null || echo "unknown"
    else
        echo "unknown"
    fi
}

# Create manifest of migrated media
create_media_migration_manifest() {
    local manifest_file="backups/media-migration-$(date +%Y%m%d_%H%M%S).manifest"
    
    log_info "Creating media migration manifest: $manifest_file"
    
    echo "# Media Migration Manifest" > "$manifest_file"
    echo "# Generated on: $(date)" >> "$manifest_file"
    echo "" >> "$manifest_file"
    
    # List all migrated audio files with checksums if possible
    find assets/audio -type f \( -name "*.mp3" -o -name "*.wav" -o -name "*.m4a" -o -name "*.ogg" -o -name "*.flac" \) | while read -r file; do
        local size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo "0")
        local checksum=$(md5sum "$file" 2>/dev/null | cut -d' ' -f1 || echo "unknown")
        echo "$file|$size|$checksum|$(date -r "$file" +%Y-%m-%d_%H:%M:%S)" >> "$manifest_file"
    done
    
    log_success "Media migration manifest created: $manifest_file"
}

# Rollback media migration
rollback_phase5() {
    local backup_id="$1"
    
    log_info "Rolling back Phase 5: Media Migration (Backup ID: $backup_id)"
    
    # Remove migrated audio files
    if [[ -d "assets/audio" ]]; then
        rm -rf assets/audio
        log_info "Removed assets/audio directory"
    fi
    
    log_success "Phase 5 rollback completed"
}

# Main execution (if script is run directly)
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    DRY_RUN="${1:-false}"
    phase5_media_migration "$DRY_RUN"
fi 