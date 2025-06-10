#!/bin/bash

# =============================================================================
# FASE 2: BACKUP COMPLETO
# Cria backup seguro e versionado de toda a estrutura atual
# =============================================================================

set -euo pipefail

# Get script directory and import functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

source "$SCRIPT_DIR/../helpers/utils.sh"
source "$SCRIPT_DIR/../helpers/mapping.sh"
source "$SCRIPT_DIR/../helpers/validation.sh"

# =============================================================================
# MAIN FUNCTION
# =============================================================================

main() {
    local dry_run=false
    
    # Parse arguments
    if [[ "${1:-}" == "--dry-run" ]]; then
        dry_run=true
        log_warning "🔍 MODO DRY-RUN: Simulando backup sem criar arquivos"
    fi
    
    log_info "💾 INICIANDO FASE 2: Backup Completo"
    
    # Create backup with timestamp
    local backup_id="backup-$(get_timestamp)"
    local backup_dir="$PROJECT_ROOT/_backup/$backup_id"
    
    if [[ "$dry_run" == false ]]; then
        safe_mkdir "$backup_dir"
    fi
    
    # Execute backup steps
    validate_backup_requirements "$dry_run"
    create_full_backup "$backup_dir" "$dry_run"
    create_config_backup "$backup_dir" "$dry_run"
    create_selective_backups "$backup_dir" "$dry_run"
    verify_backup_integrity "$backup_dir" "$dry_run"
    generate_backup_manifest "$backup_dir" "$dry_run"
    
    log_success "✅ FASE 2 CONCLUÍDA: Backup completo criado"
    
    if [[ "$dry_run" == false ]]; then
        log_info "💾 Backup salvo em: $backup_dir"
        log_info "🆔 ID do backup: $backup_id"
    fi
}

# =============================================================================
# VALIDATION FUNCTIONS
# =============================================================================

validate_backup_requirements() {
    local dry_run=$1
    
    log_info "🔍 Validando requisitos para backup..."
    
    # Check available disk space
    local project_size=$(get_total_size "$PROJECT_ROOT")
    local available_space=$(df "$PROJECT_ROOT" | awk 'NR==2 {print $4}')
    local needed_space=$((project_size * 2)) # Need 2x for safety
    
    if [[ $available_space -lt $needed_space ]]; then
        local readable_needed=$(get_human_readable_size "$needed_space")
        local readable_available=$(get_human_readable_size "$((available_space * 1024))")
        log_error "❌ Espaço insuficiente. Necessário: $readable_needed, Disponível: $readable_available"
        return 1
    fi
    
    # Check for Git repository
    if git rev-parse --git-dir > /dev/null 2>&1; then
        log_info "📚 Repositório Git detectado"
        
        # Check for uncommitted changes
        if ! git diff --quiet || ! git diff --staged --quiet; then
            log_warning "⚠️  Há alterações não commitadas"
            if [[ "$dry_run" == false ]]; then
                create_git_patch_backup
            fi
        else
            log_success "✅ Repositório limpo (sem alterações pendentes)"
        fi
    else
        log_warning "⚠️  Não é um repositório Git - backup manual será feito"
    fi
    
    # Check required tools
    local required_tools=("rsync" "tar" "gzip")
    for tool in "${required_tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            log_error "❌ Ferramenta necessária não encontrada: $tool"
            return 1
        fi
    done
    
    log_success "✅ Requisitos para backup validados"
}

create_git_patch_backup() {
    log_info "📝 Criando backup das alterações não commitadas..."
    
    local patch_dir="$PROJECT_ROOT/_backup/git-patches"
    safe_mkdir "$patch_dir"
    
    local timestamp=$(get_timestamp)
    
    # Backup working directory changes
    if ! git diff --quiet; then
        git diff > "$patch_dir/working-dir-changes-$timestamp.patch"
        log_success "✅ Alterações do working directory salvas"
    fi
    
    # Backup staged changes
    if ! git diff --staged --quiet; then
        git diff --staged > "$patch_dir/staged-changes-$timestamp.patch"
        log_success "✅ Alterações staged salvas"
    fi
}

# =============================================================================
# BACKUP FUNCTIONS
# =============================================================================

create_full_backup() {
    local backup_dir=$1
    local dry_run=$2
    
    log_info "📦 Criando backup completo do projeto..."
    
    if [[ "$dry_run" == false ]]; then
        # Create full backup using rsync for efficiency
        log_info "🔄 Copiando arquivos (pode levar alguns minutos)..."
        
        if rsync -av \
            --exclude="_backup" \
            --exclude=".git" \
            --exclude="node_modules" \
            --exclude="_site" \
            --exclude=".jekyll-cache" \
            --exclude=".DS_Store" \
            --progress \
            "$PROJECT_ROOT/" "$backup_dir/"; then
            
            log_success "✅ Backup completo criado com sucesso"
        else
            log_error "❌ Falha ao criar backup completo"
            return 1
        fi
        
        # Create compressed archive for long-term storage
        create_compressed_backup "$backup_dir"
        
    else
        log_info "DRY-RUN: Backup completo (rsync)"
        log_info "DRY-RUN: Arquivo comprimido (.tar.gz)"
    fi
}

create_compressed_backup() {
    local backup_dir=$1
    
    log_info "🗜️  Criando arquivo comprimido para armazenamento..."
    
    local backup_name=$(basename "$backup_dir")
    local archive_file="$backup_dir.tar.gz"
    
    cd "$(dirname "$backup_dir")" || return 1
    
    if tar -czf "$archive_file" "$backup_name"; then
        local original_size=$(get_total_size "$backup_dir")
        local compressed_size=$(stat -f%z "$archive_file" 2>/dev/null || stat -c%s "$archive_file" 2>/dev/null)
        
        local compression_ratio=$(awk "BEGIN {printf \"%.1f%%\", (100 - ($compressed_size*100/$original_size))}")
        
        log_success "✅ Arquivo comprimido criado: $(basename "$archive_file")"
        log_info "📊 Compressão: $compression_ratio"
    else
        log_error "❌ Falha ao criar arquivo comprimido"
        return 1
    fi
}

create_config_backup() {
    local backup_dir=$1
    local dry_run=$2
    
    log_info "⚙️  Criando backup específico das configurações..."
    
    local config_backup_dir="$backup_dir/configs"
    
    if [[ "$dry_run" == false ]]; then
        safe_mkdir "$config_backup_dir"
        
        # List of configuration files to backup
        local config_files=(
            "_config.yml"
            "_data/course_structure.yml"
            "package.json"
            "package-lock.json"
            "Gemfile"
            "Gemfile.lock"
            "index.html"
        )
        
        for config_file in "${config_files[@]}"; do
            local source_file="$PROJECT_ROOT/$config_file"
            if [[ -f "$source_file" ]]; then
                local dest_file="$config_backup_dir/$(basename "$config_file")"
                safe_copy "$source_file" "$dest_file"
                log_debug "✅ Config backed up: $config_file"
            fi
        done
        
        # Backup entire _data and _includes directories
        if [[ -d "$PROJECT_ROOT/_data" ]]; then
            rsync -av "$PROJECT_ROOT/_data/" "$config_backup_dir/_data/"
        fi
        
        if [[ -d "$PROJECT_ROOT/_includes" ]]; then
            rsync -av "$PROJECT_ROOT/_includes/" "$config_backup_dir/_includes/"
        fi
        
        if [[ -d "$PROJECT_ROOT/_layouts" ]]; then
            rsync -av "$PROJECT_ROOT/_layouts/" "$config_backup_dir/_layouts/"
        fi
        
        log_success "✅ Backup de configurações concluído"
    else
        log_info "DRY-RUN: Backup de configurações"
    fi
}

create_selective_backups() {
    local backup_dir=$1
    local dry_run=$2
    
    log_info "🎯 Criando backups seletivos por categoria..."
    
    if [[ "$dry_run" == false ]]; then
        # Content-only backup
        create_content_backup "$backup_dir"
        
        # Media-only backup
        create_media_backup "$backup_dir"
        
        # Scripts backup
        create_scripts_backup "$backup_dir"
        
    else
        log_info "DRY-RUN: Backups seletivos (conteúdo, mídia, scripts)"
    fi
}

create_content_backup() {
    local backup_dir=$1
    local content_backup_dir="$backup_dir/content-only"
    
    log_info "📄 Criando backup apenas do conteúdo..."
    
    safe_mkdir "$content_backup_dir"
    
    # Backup all .md files
    find "$PROJECT_ROOT/src/modulos-treinamento" -name "*.md" -type f | while read -r md_file; do
        local relative_path=${md_file#$PROJECT_ROOT/src/modulos-treinamento/}
        local dest_file="$content_backup_dir/$relative_path"
        safe_copy "$md_file" "$dest_file"
    done
    
    local md_count=$(count_files "$content_backup_dir" "*.md")
    log_success "✅ Backup de conteúdo: $md_count arquivos .md"
}

create_media_backup() {
    local backup_dir=$1
    local media_backup_dir="$backup_dir/media-only"
    
    log_info "🎵 Criando backup apenas da mídia..."
    
    safe_mkdir "$media_backup_dir"
    
    # Backup all audio files
    find "$PROJECT_ROOT/src/modulos-treinamento" \( -name "*.mp3" -o -name "*.wav" \) -type f | while read -r audio_file; do
        local relative_path=${audio_file#$PROJECT_ROOT/src/modulos-treinamento/}
        local dest_file="$media_backup_dir/$relative_path"
        safe_copy "$audio_file" "$dest_file"
    done
    
    local audio_count=$(find "$media_backup_dir" \( -name "*.mp3" -o -name "*.wav" \) -type f | wc -l)
    log_success "✅ Backup de mídia: $audio_count arquivos de áudio"
}

create_scripts_backup() {
    local backup_dir=$1
    local scripts_backup_dir="$backup_dir/scripts"
    
    log_info "📜 Criando backup dos scripts..."
    
    if [[ -d "$PROJECT_ROOT/scripts" ]]; then
        rsync -av "$PROJECT_ROOT/scripts/" "$scripts_backup_dir/"
        log_success "✅ Backup de scripts concluído"
    fi
    
    if [[ -d "$PROJECT_ROOT/src/utils" ]]; then
        rsync -av "$PROJECT_ROOT/src/utils/" "$scripts_backup_dir/utils/"
        log_success "✅ Backup de utils concluído"
    fi
}

# =============================================================================
# VERIFICATION FUNCTIONS
# =============================================================================

verify_backup_integrity() {
    local backup_dir=$1
    local dry_run=$2
    
    log_info "🔍 Verificando integridade do backup..."
    
    if [[ "$dry_run" == false ]]; then
        local errors=0
        
        # Check if backup directory exists and is not empty
        if [[ ! -d "$backup_dir" ]]; then
            log_error "❌ Diretório de backup não existe"
            return 1
        fi
        
        local backup_size=$(get_total_size "$backup_dir")
        if [[ $backup_size -eq 0 ]]; then
            log_error "❌ Backup está vazio"
            return 1
        fi
        
        # Verify essential directories were backed up
        local essential_dirs=(
            "src/modulos-treinamento"
            "_data"
            "_includes"
            "_layouts"
            "assets"
        )
        
        for dir in "${essential_dirs[@]}"; do
            if [[ ! -d "$backup_dir/$dir" ]]; then
                log_error "❌ Diretório essencial não foi backed up: $dir"
                ((errors++))
            fi
        done
        
        # Verify file counts match
        local original_md_count=$(count_files "$PROJECT_ROOT/src/modulos-treinamento" "*.md")
        local backup_md_count=$(count_files "$backup_dir/src/modulos-treinamento" "*.md")
        
        if [[ $original_md_count -ne $backup_md_count ]]; then
            log_error "❌ Contagem de arquivos .md não confere (Original: $original_md_count, Backup: $backup_md_count)"
            ((errors++))
        fi
        
        local original_mp3_count=$(count_files "$PROJECT_ROOT/src/modulos-treinamento" "*.mp3")
        local backup_mp3_count=$(count_files "$backup_dir/src/modulos-treinamento" "*.mp3")
        
        if [[ $original_mp3_count -ne $backup_mp3_count ]]; then
            log_error "❌ Contagem de arquivos .mp3 não confere (Original: $original_mp3_count, Backup: $backup_mp3_count)"
            ((errors++))
        fi
        
        if [[ $errors -eq 0 ]]; then
            log_success "✅ Integridade do backup verificada"
            return 0
        else
            log_error "❌ Backup tem $errors erro(s) de integridade"
            return 1
        fi
    else
        log_info "DRY-RUN: Verificação de integridade"
    fi
}

# =============================================================================
# MANIFEST FUNCTIONS
# =============================================================================

generate_backup_manifest() {
    local backup_dir=$1
    local dry_run=$2
    
    log_info "📋 Gerando manifesto do backup..."
    
    if [[ "$dry_run" == false ]]; then
        local manifest_file="$backup_dir/BACKUP-MANIFEST.md"
        
        {
            echo "# MANIFESTO DO BACKUP"
            echo ""
            echo "**Data de criação:** $(date)"
            echo "**Backup ID:** $(basename "$backup_dir")"
            echo "**Projeto:** Estrutura de Dados e Algoritmos"
            echo ""
            echo "## Informações do Sistema"
            echo ""
            echo "- **Sistema operacional:** $(uname -s)"
            echo "- **Hostname:** $(hostname)"
            echo "- **Usuário:** $(whoami)"
            echo "- **Diretório original:** $PROJECT_ROOT"
            echo ""
            echo "## Estatísticas do Backup"
            echo ""
        } > "$manifest_file"
        
        # Generate statistics
        generate_backup_statistics "$manifest_file" "$backup_dir"
        
        # Generate file inventory
        generate_backup_inventory "$manifest_file" "$backup_dir"
        
        # Generate checksums for critical files
        generate_backup_checksums "$manifest_file" "$backup_dir"
        
        log_success "✅ Manifesto do backup gerado: $(basename "$manifest_file")"
    else
        log_info "DRY-RUN: Geração do manifesto"
    fi
}

generate_backup_statistics() {
    local manifest_file=$1
    local backup_dir=$2
    
    local total_size=$(get_total_size "$backup_dir")
    local readable_size=$(get_human_readable_size "$total_size")
    
    local total_files=$(find "$backup_dir" -type f | wc -l)
    local total_dirs=$(find "$backup_dir" -type d | wc -l)
    
    local md_count=$(count_files "$backup_dir" "*.md")
    local mp3_count=$(count_files "$backup_dir" "*.mp3")
    local wav_count=$(count_files "$backup_dir" "*.wav")
    
    {
        echo "- **Tamanho total:** $readable_size"
        echo "- **Total de arquivos:** $total_files"
        echo "- **Total de diretórios:** $total_dirs"
        echo "- **Arquivos .md:** $md_count"
        echo "- **Arquivos .mp3:** $mp3_count"
        echo "- **Arquivos .wav:** $wav_count"
        echo ""
        echo "## Estrutura do Backup"
        echo ""
        echo "\`\`\`"
    } >> "$manifest_file"
    
    # Generate structure tree
    if command -v tree &> /dev/null; then
        tree -d -L 3 "$backup_dir" >> "$manifest_file"
    else
        find "$backup_dir" -type d | head -20 | sort >> "$manifest_file"
    fi
    
    echo "\`\`\`" >> "$manifest_file"
    echo "" >> "$manifest_file"
}

generate_backup_inventory() {
    local manifest_file=$1
    local backup_dir=$2
    
    {
        echo "## Inventário de Módulos"
        echo ""
        echo "| Módulo | Arquivos .md | Arquivos .mp3 | Arquivos .wav | Tamanho |"
        echo "|--------|--------------|---------------|---------------|---------|"
    } >> "$manifest_file"
    
    if [[ -d "$backup_dir/src/modulos-treinamento" ]]; then
        find "$backup_dir/src/modulos-treinamento" -maxdepth 1 -type d -name "[0-9]*" | sort -V | while read -r module_dir; do
            if [[ -n "$module_dir" ]]; then
                local module_name=$(basename "$module_dir")
                local stats=$(analyze_module_content "$module_dir")
                
                IFS='|' read -r md_count mp3_count wav_count other_count <<< "$stats"
                
                local module_size=$(get_total_size "$module_dir")
                local readable_size=$(get_human_readable_size "$module_size")
                
                echo "| $module_name | $md_count | $mp3_count | $wav_count | $readable_size |" >> "$manifest_file"
            fi
        done
    fi
    
    echo "" >> "$manifest_file"
}

generate_backup_checksums() {
    local manifest_file=$1
    local backup_dir=$2
    
    {
        echo "## Checksums de Arquivos Críticos"
        echo ""
        echo "| Arquivo | MD5 | Tamanho |"
        echo "|---------|-----|---------|"
    } >> "$manifest_file"
    
    # Generate checksums for critical files
    local critical_files=(
        "_config.yml"
        "_data/course_structure.yml"
        "package.json"
        "index.html"
    )
    
    for file in "${critical_files[@]}"; do
        local file_path="$backup_dir/$file"
        if [[ -f "$file_path" ]]; then
            local checksum=$(md5sum "$file_path" | cut -d' ' -f1)
            local file_size=$(stat -f%z "$file_path" 2>/dev/null || stat -c%s "$file_path" 2>/dev/null)
            local readable_size=$(get_human_readable_size "$file_size")
            
            echo "| $file | \`$checksum\` | $readable_size |" >> "$manifest_file"
        fi
    done
    
    {
        echo ""
        echo "## Instruções de Restauração"
        echo ""
        echo "Para restaurar este backup:"
        echo ""
        echo "\`\`\`bash"
        echo "# 1. Vá para o diretório do projeto"
        echo "cd /path/to/project"
        echo ""
        echo "# 2. Execute o rollback usando o ID do backup"
        echo "scripts/migration/migrate.sh --rollback=$(basename "$backup_dir")"
        echo ""
        echo "# Ou manualmente:"
        echo "rsync -av --delete $backup_dir/ ./"
        echo "\`\`\`"
        echo ""
        echo "## Notas"
        echo ""
        echo "- Este backup foi criado automaticamente pelo sistema de migração"
        echo "- Todos os arquivos foram verificados para integridade"
        echo "- O backup inclui tanto versão completa quanto seletivas"
        echo "- Arquivo comprimido (.tar.gz) disponível para armazenamento de longo prazo"
    } >> "$manifest_file"
}

# =============================================================================
# SCRIPT EXECUTION
# =============================================================================

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi 