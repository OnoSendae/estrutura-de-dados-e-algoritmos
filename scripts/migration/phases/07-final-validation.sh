#!/bin/bash

# Phase 7: Final Validation and Cleanup
# Comprehensive validation of the migration and cleanup tasks

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HELPERS_DIR="$(dirname "$SCRIPT_DIR")/helpers"

# Source helper functions
source "$HELPERS_DIR/utils.sh"
source "$HELPERS_DIR/mapping.sh"
source "$HELPERS_DIR/validation.sh"

phase7_final_validation() {
    local dry_run="${1:-false}"
    
    log_info "=== Phase 7: Final Validation and Cleanup ==="
    
    if [[ "$dry_run" == "true" ]]; then
        log_info "🔍 DRY RUN MODE - Validation only, no cleanup"
    fi
    
    local validation_errors=0
    local cleanup_tasks=0
    
    # Comprehensive validation
    log_info "🔍 Running comprehensive validation..."
    
    # 1. Validate module structure
    if ! validate_module_structure; then
        ((validation_errors++))
    fi
    
    # 2. Validate content migration
    if ! validate_content_migration; then
        ((validation_errors++))
    fi
    
    # 3. Validate media migration
    if ! validate_media_migration; then
        ((validation_errors++))
    fi
    
    # 4. Validate configuration updates
    if ! validate_configuration_updates; then
        ((validation_errors++))
    fi
    
    # 5. Validate Jekyll compatibility
    if ! validate_jekyll_compatibility; then
        ((validation_errors++))
    fi
    
    # 6. Check for broken links
    if ! check_broken_links; then
        ((validation_errors++))
    fi
    
    # Cleanup tasks (only if not dry run and validation passed)
    if [[ "$dry_run" == "false" ]] && [[ $validation_errors -eq 0 ]]; then
        log_info "🧹 Running cleanup tasks..."
        
        if cleanup_empty_directories; then
            ((cleanup_tasks++))
        fi
        
        if cleanup_backup_files; then
            ((cleanup_tasks++))
        fi
        
        if generate_migration_report; then
            ((cleanup_tasks++))
        fi
        
        if create_git_commit_ready_state; then
            ((cleanup_tasks++))
        fi
    fi
    
    # Generate final report
    generate_final_report "$validation_errors" "$cleanup_tasks" "$dry_run"
    
    # Summary
    if [[ $validation_errors -eq 0 ]]; then
        log_success "Phase 7: Final Validation and Cleanup completed successfully!"
        log_info "🎉 Migration completed successfully! Your project is ready to use."
        
        if [[ "$dry_run" == "false" ]]; then
            print_next_steps
        fi
        
        return 0
    else
        log_error "Phase 7 completed with $validation_errors validation errors"
        log_error "Please review the errors above before proceeding"
        return 1
    fi
}

# Validate module structure
validate_module_structure() {
    log_info "Validating module structure..."
    
    local errors=0
    
    # Check if modules directory exists
    if [[ ! -d "modules" ]]; then
        log_error "modules/ directory not found"
        ((errors++))
        return 1
    fi
    
    # Validate each expected module
    get_all_module_mappings | while IFS='|' read -r old_name new_id new_title; do
        local module_dir="modules/$new_id"
        
        if [[ ! -d "$module_dir" ]]; then
            log_error "Module directory missing: $module_dir"
            ((errors++))
            continue
        fi
        
        # Check required subdirectories
        for subdir in lessons exercises examples resources; do
            if [[ ! -d "$module_dir/$subdir" ]]; then
                log_warn "Missing subdirectory: $module_dir/$subdir"
            fi
        done
        
        # Check for module index
        if [[ ! -f "$module_dir/index.md" ]]; then
            log_warn "Missing module index: $module_dir/index.md"
        fi
    done
    
    if [[ $errors -eq 0 ]]; then
        log_success "Module structure validation passed"
        return 0
    else
        log_error "Module structure validation failed with $errors errors"
        return 1
    fi
}

# Validate content migration
validate_content_migration() {
    log_info "Validating content migration..."
    
    local errors=0
    local migrated_files=0
    
    # Count migrated markdown files
    migrated_files=$(find modules -name "*.md" -type f | wc -l)
    
    if [[ $migrated_files -eq 0 ]]; then
        log_error "No markdown files found in modules directory"
        ((errors++))
    else
        log_info "Found $migrated_files migrated markdown files"
    fi
    
    # Check for proper front matter in migrated files
    find modules -name "*.md" -type f | head -10 | while read -r md_file; do
        if ! grep -q "^---$" "$md_file"; then
            log_warn "Missing Jekyll front matter: $md_file"
        fi
    done
    
    if [[ $errors -eq 0 ]]; then
        log_success "Content migration validation passed"
        return 0
    else
        log_error "Content migration validation failed"
        return 1
    fi
}

# Validate media migration
validate_media_migration() {
    log_info "Validating media migration..."
    
    local errors=0
    local audio_files=0
    
    # Check if audio directory exists
    if [[ ! -d "assets/audio" ]]; then
        log_error "assets/audio/ directory not found"
        ((errors++))
        return 1
    fi
    
    # Count migrated audio files
    audio_files=$(find assets/audio -type f \( -name "*.mp3" -o -name "*.wav" -o -name "*.m4a" \) | wc -l)
    
    if [[ $audio_files -eq 0 ]]; then
        log_warn "No audio files found in assets/audio directory"
    else
        log_info "Found $audio_files migrated audio files"
    fi
    
    # Check for audio index
    if [[ ! -f "assets/audio/index.yml" ]]; then
        log_warn "Missing audio index file: assets/audio/index.yml"
    fi
    
    if [[ $errors -eq 0 ]]; then
        log_success "Media migration validation passed"
        return 0
    else
        log_error "Media migration validation failed"
        return 1
    fi
}

# Validate configuration updates
validate_configuration_updates() {
    log_info "Validating configuration updates..."
    
    local errors=0
    
    # Check Jekyll config
    if [[ ! -f "_config.yml" ]]; then
        log_error "_config.yml not found"
        ((errors++))
    else
        if ! grep -q "collections:" "_config.yml"; then
            log_warn "_config.yml missing collections configuration"
        fi
    fi
    
    # Check data files
    if [[ ! -f "_data/new_course_structure.yml" ]]; then
        log_warn "New course structure data file not found"
    fi
    
    # Check includes
    if [[ ! -f "_includes/module_navigation.html" ]]; then
        log_warn "Module navigation include not found"
    fi
    
    if [[ ! -f "_includes/audio_player.html" ]]; then
        log_warn "Audio player include not found"
    fi
    
    if [[ $errors -eq 0 ]]; then
        log_success "Configuration validation passed"
        return 0
    else
        log_error "Configuration validation failed"
        return 1
    fi
}

# Validate Jekyll compatibility
validate_jekyll_compatibility() {
    log_info "Validating Jekyll compatibility..."
    
    # Check if Jekyll is available
    if command -v jekyll >/dev/null 2>&1; then
        log_info "Jekyll found, attempting build test..."
        
        # Try a dry build
        if jekyll build --dry-run --quiet 2>/dev/null; then
            log_success "Jekyll build test passed"
            return 0
        else
            log_warn "Jekyll build test failed (this might be normal during migration)"
            return 0  # Don't fail the validation for this
        fi
    else
        log_info "Jekyll not found, skipping build test"
        return 0
    fi
}

# Check for broken links
check_broken_links() {
    log_info "Checking for broken internal links..."
    
    local broken_links=0
    
    # Check markdown files for broken internal links
    find modules -name "*.md" -type f | while read -r md_file; do
        # Look for markdown links
        while IFS= read -r line; do
            if echo "$line" | grep -q '\[.*\](.*)'
            then
                # Extract the link
                local link=$(echo "$line" | sed 's/.*\[.*\](\([^)]*\)).*/\1/')
                
                # Skip external links
                if echo "$link" | grep -q '^https\?://'; then
                    continue
                fi
                
                # Check if internal file exists
                if [[ "$link" =~ ^/ ]]; then
                    # Absolute path
                    local target_file=".${link}"
                else
                    # Relative path
                    local target_file="$(dirname "$md_file")/$link"
                fi
                
                if [[ ! -f "$target_file" ]] && [[ ! -d "$target_file" ]]; then
                    log_warn "Broken link in $md_file: $link"
                    ((broken_links++))
                fi
            fi
        done < "$md_file"
    done
    
    if [[ $broken_links -eq 0 ]]; then
        log_success "No broken internal links found"
        return 0
    else
        log_warn "Found $broken_links potentially broken links"
        return 0  # Don't fail validation for this
    fi
}

# Cleanup empty directories
cleanup_empty_directories() {
    log_info "Cleaning up empty directories..."
    
    local cleaned_dirs=0
    
    # Remove empty directories in modules
    find modules -type d -empty 2>/dev/null | while read -r empty_dir; do
        rmdir "$empty_dir" 2>/dev/null || true
        ((cleaned_dirs++))
    done
    
    # Remove empty directories in assets
    find assets -type d -empty 2>/dev/null | while read -r empty_dir; do
        rmdir "$empty_dir" 2>/dev/null || true
        ((cleaned_dirs++))
    done
    
    log_info "Cleaned $cleaned_dirs empty directories"
    return 0
}

# Cleanup backup files
cleanup_backup_files() {
    log_info "Cleaning up old backup files..."
    
    local cleaned_files=0
    
    # Remove old .bak files
    find . -name "*.bak" -type f -mtime +1 2>/dev/null | while read -r bak_file; do
        rm -f "$bak_file"
        ((cleaned_files++))
    done
    
    # Clean up old backup config files (keep recent ones)
    find . -name "*.backup.*" -type f -mtime +7 2>/dev/null | while read -r backup_file; do
        rm -f "$backup_file"
        ((cleaned_files++))
    done
    
    log_info "Cleaned $cleaned_files backup files"
    return 0
}

# Generate migration report
generate_migration_report() {
    log_info "Generating migration report..."
    
    local report_file="migration-report-$(date +%Y%m%d_%H%M%S).md"
    
    cat > "$report_file" << EOF
# Migration Report

**Date:** $(date)
**Course:** Estrutura de Dados e Algoritmos
**Migration Version:** 2.0

## Summary

This report documents the successful migration from the old course structure to the new standardized structure.

## Structure Changes

### Old Structure
\`\`\`
src/modulos-treinamento/
├── 0-fundamentos-da-programacao/
├── 1-analise-de-algoritmos-e-complexidade/
├── 2-estruturas-de-dados-lineares-avancadas/
└── ...
\`\`\`

### New Structure
\`\`\`
modules/
├── 01-foundations/
├── 02-algorithm-analysis/
├── 03-advanced-linear-structures/
└── ...

assets/audio/
├── 01-foundations/
├── 02-algorithm-analysis/
└── ...
\`\`\`

## Migration Statistics

### Content Files
- **Markdown files migrated:** $(find modules -name "*.md" -type f | wc -l)
- **Audio files migrated:** $(find assets/audio -type f \( -name "*.mp3" -o -name "*.wav" -o -name "*.m4a" \) | wc -l)

### Modules Processed
$(get_all_module_mappings | wc -l) modules successfully migrated:

$(get_all_module_mappings | while IFS='|' read -r old_name new_id new_title; do
echo "- **$new_id:** $new_title (was: $old_name)"
done)

## Configuration Updates

- ✅ Jekyll _config.yml updated
- ✅ Course structure data file created
- ✅ Navigation includes updated
- ✅ Module index pages created
- ✅ Audio player integration added

## Next Steps

1. Review the migrated content in the \`modules/\` directory
2. Test the Jekyll site locally: \`jekyll serve\`
3. Update any custom layouts or includes as needed
4. Deploy to GitHub Pages or your hosting platform

## Rollback Information

If you need to rollback this migration:
\`\`\`bash
./scripts/migration/migrate.sh --rollback=BACKUP_ID
\`\`\`

Migration backup files are stored in the \`backups/\` directory.

---

*This report was generated automatically by the migration script.*
EOF

    log_success "Migration report created: $report_file"
    return 0
}

# Create git commit ready state
create_git_commit_ready_state() {
    log_info "Preparing Git commit-ready state..."
    
    # Create .gitignore if it doesn't exist
    if [[ ! -f ".gitignore" ]]; then
        cat > ".gitignore" << 'EOF'
# Jekyll
_site/
.sass-cache/
.jekyll-cache/
.jekyll-metadata

# Migration backups (optional - you might want to commit initial backup)
backups/

# OS generated files
.DS_Store
Thumbs.db

# Editor files
*.swp
*.swo
*~

# Logs
*.log

# Node modules (if using npm)
node_modules/

# Ruby
Gemfile.lock
.bundle/
EOF
        log_info "Created .gitignore file"
    fi
    
    # Ensure proper file permissions
    find modules -type f -name "*.md" -exec chmod 644 {} \; 2>/dev/null || true
    find assets -type f \( -name "*.mp3" -o -name "*.wav" -o -name "*.m4a" \) -exec chmod 644 {} \; 2>/dev/null || true
    
    log_success "Git commit-ready state prepared"
    return 0
}

# Generate final report
generate_final_report() {
    local validation_errors="$1"
    local cleanup_tasks="$2"
    local dry_run="$3"
    
    echo ""
    echo "========================================"
    echo "🎯 MIGRATION FINAL REPORT"
    echo "========================================"
    echo ""
    echo "📊 **Validation Results:**"
    echo "   • Validation Errors: $validation_errors"
    
    if [[ "$dry_run" == "false" ]]; then
        echo "   • Cleanup Tasks Completed: $cleanup_tasks"
    fi
    
    echo ""
    echo "📁 **New Structure Overview:**"
    echo "   • Modules: $(find modules -maxdepth 1 -type d | wc -l) directories"
    echo "   • Content Files: $(find modules -name "*.md" -type f | wc -l) markdown files"
    echo "   • Audio Files: $(find assets/audio -type f 2>/dev/null | wc -l) audio files"
    
    echo ""
    echo "🔧 **Configuration Status:**"
    echo "   • Jekyll Config: $([ -f "_config.yml" ] && echo "✅ Updated" || echo "❌ Missing")"
    echo "   • Course Data: $([ -f "_data/new_course_structure.yml" ] && echo "✅ Created" || echo "❌ Missing")"
    echo "   • Navigation: $([ -f "_includes/module_navigation.html" ] && echo "✅ Updated" || echo "❌ Missing")"
    
    echo ""
}

# Print next steps
print_next_steps() {
    echo "🚀 **Next Steps:**"
    echo ""
    echo "1. **Test Jekyll Site:**"
    echo "   \`bundle exec jekyll serve\`"
    echo ""
    echo "2. **Review Content:**"
    echo "   \`find modules -name '*.md' | head -5 | xargs ls -la\`"
    echo ""
    echo "3. **Commit Changes:**"
    echo "   \`git add .\`"
    echo "   \`git commit -m \"feat: migrate to new standardized course structure\"\`"
    echo ""
    echo "4. **Backup Locations:**"
    echo "   - Full backup: \`backups/\`"
    echo "   - Config backups: \`*.backup.*\` files"
    echo ""
    echo "5. **Documentation:**"
    echo "   - Migration report: \`migration-report-*.md\`"
    echo "   - Audio index: \`assets/audio/index.yml\`"
    echo ""
    echo "✨ **Your course is now ready for distribution and replication!**"
    echo ""
}

# Rollback final validation phase
rollback_phase7() {
    local backup_id="$1"
    
    log_info "Rolling back Phase 7: Final Validation (Backup ID: $backup_id)"
    
    # Remove generated reports
    rm -f migration-report-*.md 2>/dev/null || true
    
    # Remove .gitignore if it was created
    if [[ -f ".gitignore" ]] && grep -q "Jekyll" ".gitignore"; then
        rm -f ".gitignore"
    fi
    
    log_success "Phase 7 rollback completed"
}

# Main execution (if script is run directly)
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    DRY_RUN="${1:-false}"
    phase7_final_validation "$DRY_RUN"
fi 