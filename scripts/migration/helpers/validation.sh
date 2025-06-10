#!/bin/bash

# =============================================================================
# VALIDATION FUNCTIONS - Sistema de validação da migração
# =============================================================================

# =============================================================================
# PRE-MIGRATION VALIDATION
# =============================================================================

validate_source_structure() {
    local project_dir=$1
    local errors=0
    
    log_info "🔍 Validando estrutura fonte..."
    
    # Check essential directories
    local required_dirs=(
        "src/modulos-treinamento"
        "_data"
        "_includes"
        "_layouts"
        "assets"
    )
    
    for dir in "${required_dirs[@]}"; do
        local full_path="$project_dir/$dir"
        if [[ ! -d "$full_path" ]]; then
            log_error "❌ Diretório necessário não encontrado: $dir"
            ((errors++))
        else
            log_debug "✅ Diretório encontrado: $dir"
        fi
    done
    
    # Check essential files
    local required_files=(
        "_config.yml"
        "_data/course_structure.yml"
        "index.html"
    )
    
    for file in "${required_files[@]}"; do
        local full_path="$project_dir/$file"
        if [[ ! -f "$full_path" ]]; then
            log_error "❌ Arquivo necessário não encontrado: $file"
            ((errors++))
        else
            log_debug "✅ Arquivo encontrado: $file"
        fi
    done
    
    # Validate module structure
    validate_modules_structure "$project_dir/src/modulos-treinamento" || ((errors++))
    
    if [[ $errors -eq 0 ]]; then
        log_success "✅ Estrutura fonte validada com sucesso"
        return 0
    else
        log_error "❌ Estrutura fonte tem $errors erro(s)"
        return 1
    fi
}

validate_modules_structure() {
    local modules_dir=$1
    local errors=0
    
    log_info "📚 Validando estrutura dos módulos..."
    
    if [[ ! -d "$modules_dir" ]]; then
        log_error "❌ Diretório de módulos não existe: $modules_dir"
        return 1
    fi
    
    local module_count=0
    local empty_modules=0
    
    while read -r module_dir; do
        if [[ -n "$module_dir" && -d "$module_dir" ]]; then
            local module_name=$(basename "$module_dir")
            ((module_count++))
            
            # Check if module has content
            local md_count=$(count_files "$module_dir" "*.md")
            local audio_count=$(count_files "$module_dir" "*.mp3")
            
            if [[ $md_count -eq 0 ]]; then
                log_warning "⚠️  Módulo sem conteúdo .md: $module_name"
                ((empty_modules++))
            fi
            
            if [[ $audio_count -eq 0 ]]; then
                log_warning "⚠️  Módulo sem áudio .mp3: $module_name"
            fi
            
            log_debug "📁 $module_name: $md_count .md, $audio_count .mp3"
        fi
    done < <(find "$modules_dir" -maxdepth 1 -type d -name "[0-9]*" | sort -V)
    
    log_info "📊 Total de módulos encontrados: $module_count"
    
    if [[ $empty_modules -gt 0 ]]; then
        log_warning "⚠️  $empty_modules módulo(s) sem conteúdo .md"
    fi
    
    if [[ $module_count -eq 0 ]]; then
        log_error "❌ Nenhum módulo encontrado"
        return 1
    fi
    
    return 0
}

# =============================================================================
# POST-MIGRATION VALIDATION
# =============================================================================

validate_migration_success() {
    local project_dir=$1
    local errors=0
    
    log_info "🔍 Validando sucesso da migração..."
    
    # Validate new structure
    validate_new_structure "$project_dir" || ((errors++))
    
    # Validate content integrity
    validate_content_integrity "$project_dir" || ((errors++))
    
    # Validate media files
    validate_media_migration "$project_dir" || ((errors++))
    
    # Validate configuration files
    validate_config_updates "$project_dir" || ((errors++))
    
    # Test Jekyll compatibility
    test_jekyll_build_after_migration "$project_dir" || ((errors++))
    
    if [[ $errors -eq 0 ]]; then
        log_success "✅ Migração validada com sucesso"
        return 0
    else
        log_error "❌ Migração tem $errors erro(s)"
        return 1
    fi
}

validate_new_structure() {
    local project_dir=$1
    local errors=0
    
    log_info "🏗️  Validando nova estrutura..."
    
    # Check new directories
    local new_dirs=(
        "modules"
        "assets/audio"
        "assets/images"
        "scripts/generators"
    )
    
    for dir in "${new_dirs[@]}"; do
        local full_path="$project_dir/$dir"
        if [[ ! -d "$full_path" ]]; then
            log_error "❌ Nova estrutura não criada: $dir"
            ((errors++))
        else
            log_debug "✅ Nova estrutura criada: $dir"
        fi
    done
    
    # Check that old structure is removed or moved
    if [[ -d "$project_dir/src/modulos-treinamento" ]]; then
        log_warning "⚠️  Estrutura antiga ainda existe: src/modulos-treinamento"
    fi
    
    # Validate module directories
    local expected_modules=(
        "01-foundations"
        "02-complexity-analysis"
        "03-linear-structures"
        "04-trees-graphs"
        "05-sorting-searching"
        "06-hash-tables"
        "07-greedy-dynamic"
        "08-advanced-topics"
        "09-persistent-structures"
        "10-complex-structures"
        "11-indexing"
        "12-problem-solving"
    )
    
    for module in "${expected_modules[@]}"; do
        local module_path="$project_dir/modules/$module"
        if [[ -d "$module_path" ]]; then
            log_debug "✅ Módulo migrado: $module"
            
            # Check module subdirectories
            local subdirs=("lessons" "exercises" "examples")
            for subdir in "${subdirs[@]}"; do
                if [[ -d "$module_path/$subdir" ]]; then
                    log_debug "  ✅ Subdiretório: $module/$subdir"
                fi
            done
        fi
    done
    
    return $errors
}

validate_content_integrity() {
    local project_dir=$1
    local errors=0
    
    log_info "📄 Validando integridade do conteúdo..."
    
    # Count content files in new structure
    local new_md_count=$(count_files "$project_dir/modules" "*.md")
    
    # Count content files in backup (original structure)
    local backup_dir=$(find "$project_dir/_backup" -maxdepth 1 -type d -name "backup-*" | head -1)
    if [[ -n "$backup_dir" && -d "$backup_dir" ]]; then
        local original_md_count=$(count_files "$backup_dir/src/modulos-treinamento" "*.md")
        
        log_info "📊 Comparação de arquivos .md:"
        log_info "   Original: $original_md_count"
        log_info "   Migrado: $new_md_count"
        
        if [[ $new_md_count -ne $original_md_count ]]; then
            log_warning "⚠️  Contagem de arquivos .md diferente após migração"
            ((errors++))
        else
            log_success "✅ Contagem de arquivos .md consistente"
        fi
    else
        log_warning "⚠️  Backup não encontrado para comparação"
    fi
    
    # Validate individual module content
    for module_dir in "$project_dir/modules"/*; do
        if [[ -d "$module_dir" ]]; then
            local module_name=$(basename "$module_dir")
            validate_module_content "$module_dir" "$module_name" || ((errors++))
        fi
    done
    
    return $errors
}

validate_module_content() {
    local module_dir=$1
    local module_name=$2
    local errors=0
    
    log_debug "🔍 Validando módulo: $module_name"
    
    # Check for required files
    if [[ -f "$module_dir/README.md" ]]; then
        log_debug "  ✅ README.md presente"
    else
        log_warning "  ⚠️  README.md ausente em $module_name"
    fi
    
    # Check lessons directory
    if [[ -d "$module_dir/lessons" ]]; then
        local lesson_count=$(count_files "$module_dir/lessons" "*.md")
        if [[ $lesson_count -gt 0 ]]; then
            log_debug "  ✅ $lesson_count lição(ões) encontrada(s)"
        else
            log_warning "  ⚠️  Nenhuma lição encontrada em $module_name"
            ((errors++))
        fi
    fi
    
    # Validate file integrity
    while read -r file; do
        if [[ -n "$file" ]]; then
            if ! validate_file_integrity "$file"; then
                log_error "  ❌ Arquivo corrompido: $(basename "$file")"
                ((errors++))
            fi
        fi
    done < <(find "$module_dir" -name "*.md" -type f)
    
    return $errors
}

validate_media_migration() {
    local project_dir=$1
    local errors=0
    
    log_info "🎵 Validando migração de mídia..."
    
    # Count audio files in new structure
    local new_audio_count=$(count_files "$project_dir/assets/audio" "*.mp3")
    
    # Count audio files in backup
    local backup_dir=$(find "$project_dir/_backup" -maxdepth 1 -type d -name "backup-*" | head -1)
    if [[ -n "$backup_dir" && -d "$backup_dir" ]]; then
        local original_audio_count=$(count_files "$backup_dir/src/modulos-treinamento" "*.mp3")
        
        log_info "📊 Comparação de arquivos de áudio:"
        log_info "   Original: $original_audio_count"
        log_info "   Migrado: $new_audio_count"
        
        if [[ $new_audio_count -ne $original_audio_count ]]; then
            log_warning "⚠️  Contagem de arquivos de áudio diferente após migração"
            ((errors++))
        else
            log_success "✅ Contagem de arquivos de áudio consistente"
        fi
    fi
    
    # Check audio organization by module
    for audio_dir in "$project_dir/assets/audio"/*; do
        if [[ -d "$audio_dir" ]]; then
            local module_name=$(basename "$audio_dir")
            local audio_count=$(count_files "$audio_dir" "*.mp3")
            
            if [[ $audio_count -gt 0 ]]; then
                log_debug "✅ $module_name: $audio_count arquivo(s) de áudio"
            else
                log_warning "⚠️  Nenhum áudio em $module_name"
            fi
        fi
    done
    
    return $errors
}

validate_config_updates() {
    local project_dir=$1
    local errors=0
    
    log_info "⚙️  Validando atualizações de configuração..."
    
    # Check if new config files exist
    local new_configs=(
        "_data/course.yml"
        "_data/modules.yml"
    )
    
    for config in "${new_configs[@]}"; do
        local config_path="$project_dir/$config"
        if [[ -f "$config_path" ]]; then
            log_debug "✅ Nova configuração criada: $config"
            
            # Validate YAML syntax
            if command -v ruby &> /dev/null; then
                if ruby -e "require 'yaml'; YAML.load_file('$config_path')" &> /dev/null; then
                    log_debug "  ✅ YAML válido"
                else
                    log_error "  ❌ YAML inválido: $config"
                    ((errors++))
                fi
            fi
        else
            log_error "❌ Configuração não criada: $config"
            ((errors++))
        fi
    done
    
    # Check if old config is backed up
    local backup_dir=$(find "$project_dir/_backup" -maxdepth 1 -type d -name "backup-*" | head -1)
    if [[ -n "$backup_dir" && -f "$backup_dir/_data/course_structure.yml" ]]; then
        log_debug "✅ Configuração original preservada no backup"
    else
        log_warning "⚠️  Configuração original não encontrada no backup"
    fi
    
    return $errors
}

test_jekyll_build_after_migration() {
    local project_dir=$1
    
    log_info "🧪 Testando build do Jekyll após migração..."
    
    cd "$project_dir" || return 1
    
    if ! command -v bundle &> /dev/null; then
        log_warning "⚠️  Bundle não disponível, pulando teste Jekyll"
        return 0
    fi
    
    # Test dry run first
    if bundle exec jekyll build --dry-run &> /dev/null; then
        log_success "✅ Jekyll dry-run passou"
        
        # Test actual build in a temporary directory
        local temp_site_dir=$(mktemp -d)
        if bundle exec jekyll build --destination "$temp_site_dir" &> /dev/null; then
            log_success "✅ Jekyll build completo passou"
            rm -rf "$temp_site_dir"
            return 0
        else
            log_error "❌ Jekyll build completo falhou"
            rm -rf "$temp_site_dir"
            return 1
        fi
    else
        log_error "❌ Jekyll dry-run falhou"
        return 1
    fi
}

# =============================================================================
# SPECIFIC VALIDATION FUNCTIONS
# =============================================================================

validate_audio_file_integrity() {
    local audio_file=$1
    
    # Check if file exists and is readable
    if [[ ! -f "$audio_file" ]] || [[ ! -r "$audio_file" ]]; then
        return 1
    fi
    
    # Check file size (audio files should not be empty)
    if [[ ! -s "$audio_file" ]]; then
        return 1
    fi
    
    # Basic MP3 header validation
    if [[ "$audio_file" == *.mp3 ]]; then
        local header=$(hexdump -C "$audio_file" 2>/dev/null | head -1 | cut -d' ' -f2-4)
        if [[ "$header" =~ ^(ff\ fb|ff\ fa|49\ 44\ 33) ]]; then
            return 0
        else
            return 1
        fi
    fi
    
    return 0
}

validate_markdown_syntax() {
    local md_file=$1
    
    # Check basic markdown syntax
    local errors=0
    
    # Check for malformed headers
    if grep -q "^#\{7,\}" "$md_file"; then
        log_warning "  ⚠️  Headers com muitos # em $(basename "$md_file")"
        ((errors++))
    fi
    
    # Check for unclosed code blocks
    local code_block_count=$(grep -c '^```' "$md_file")
    if [[ $((code_block_count % 2)) -ne 0 ]]; then
        log_warning "  ⚠️  Blocos de código não fechados em $(basename "$md_file")"
        ((errors++))
    fi
    
    return $errors
}

# =============================================================================
# ROLLBACK VALIDATION
# =============================================================================

validate_rollback_integrity() {
    local backup_dir=$1
    local project_dir=$2
    
    log_info "🔄 Validando integridade do rollback..."
    
    if [[ ! -d "$backup_dir" ]]; then
        log_error "❌ Diretório de backup não existe: $backup_dir"
        return 1
    fi
    
    # Check that backup has the expected structure
    local required_backup_items=(
        "src/modulos-treinamento"
        "_data/course_structure.yml"
        "_config.yml"
    )
    
    local errors=0
    for item in "${required_backup_items[@]}"; do
        if [[ ! -e "$backup_dir/$item" ]]; then
            log_error "❌ Item necessário ausente no backup: $item"
            ((errors++))
        fi
    done
    
    if [[ $errors -eq 0 ]]; then
        log_success "✅ Backup válido para rollback"
        return 0
    else
        return 1
    fi
}

# =============================================================================
# COMPREHENSIVE VALIDATION REPORT
# =============================================================================

generate_validation_report() {
    local project_dir=$1
    local report_file="$project_dir/_backup/validation-report-$(get_timestamp).md"
    
    log_info "📊 Gerando relatório de validação..."
    
    cat > "$report_file" << EOF
# RELATÓRIO DE VALIDAÇÃO DA MIGRAÇÃO

Gerado em: $(date)

## Resumo Executivo

EOF
    
    # Run all validations and capture results
    local total_errors=0
    
    # Structure validation
    echo "## Validação da Estrutura" >> "$report_file"
    if validate_new_structure "$project_dir" >> "$report_file" 2>&1; then
        echo "✅ **PASSOU** - Nova estrutura válida" >> "$report_file"
    else
        echo "❌ **FALHOU** - Problemas na nova estrutura" >> "$report_file"
        ((total_errors++))
    fi
    echo "" >> "$report_file"
    
    # Content validation
    echo "## Validação do Conteúdo" >> "$report_file"
    if validate_content_integrity "$project_dir" >> "$report_file" 2>&1; then
        echo "✅ **PASSOU** - Conteúdo íntegro" >> "$report_file"
    else
        echo "❌ **FALHOU** - Problemas no conteúdo" >> "$report_file"
        ((total_errors++))
    fi
    echo "" >> "$report_file"
    
    # Media validation
    echo "## Validação da Mídia" >> "$report_file"
    if validate_media_migration "$project_dir" >> "$report_file" 2>&1; then
        echo "✅ **PASSOU** - Mídia migrada corretamente" >> "$report_file"
    else
        echo "❌ **FALHOU** - Problemas na migração da mídia" >> "$report_file"
        ((total_errors++))
    fi
    echo "" >> "$report_file"
    
    # Jekyll validation
    echo "## Validação do Jekyll" >> "$report_file"
    if test_jekyll_build_after_migration "$project_dir" >> "$report_file" 2>&1; then
        echo "✅ **PASSOU** - Jekyll funcional" >> "$report_file"
    else
        echo "❌ **FALHOU** - Problemas no Jekyll" >> "$report_file"
        ((total_errors++))
    fi
    echo "" >> "$report_file"
    
    # Final summary
    cat >> "$report_file" << 'EOF'

## Resultado Final

EOF
    
    if [[ $total_errors -eq 0 ]]; then
        echo "🎉 **MIGRAÇÃO BEM-SUCEDIDA** - Todas as validações passaram" >> "$report_file"
        log_success "✅ Todas as validações passaram"
    else
        echo "⚠️ **MIGRAÇÃO COM PROBLEMAS** - $total_errors validação(ões) falharam" >> "$report_file"
        log_warning "⚠️  $total_errors validação(ões) falharam"
    fi
    
    log_success "📄 Relatório de validação salvo: $report_file"
    return $total_errors
} 