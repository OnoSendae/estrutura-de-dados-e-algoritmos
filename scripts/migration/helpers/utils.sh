#!/bin/bash

# =============================================================================
# UTILITY FUNCTIONS - Helper functions para migração
# =============================================================================

# Colors (redefinidas para garantir disponibilidade)
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# =============================================================================
# LOGGING FUNCTIONS
# =============================================================================

log_info() {
    echo -e "${BLUE}ℹ️  [$(date '+%H:%M:%S')] $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ [$(date '+%H:%M:%S')] $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  [$(date '+%H:%M:%S')] $1${NC}"
}

log_error() {
    echo -e "${RED}❌ [$(date '+%H:%M:%S')] $1${NC}" >&2
}

log_debug() {
    if [[ "${DEBUG:-false}" == "true" ]]; then
        echo -e "${PURPLE}🔍 [$(date '+%H:%M:%S')] DEBUG: $1${NC}"
    fi
}

# =============================================================================
# PROGRESS FUNCTIONS
# =============================================================================

show_progress() {
    local current=$1
    local total=$2
    local description=${3:-"Processando"}
    local width=40
    local percentage=$((current * 100 / total))
    local filled=$((current * width / total))
    
    printf "\r%s [" "$description"
    printf "%*s" "$filled" | tr ' ' '█'
    printf "%*s" $((width - filled)) | tr ' ' '░'
    printf "] %d%% (%d/%d)" "$percentage" "$current" "$total"
    
    if [[ $current -eq $total ]]; then
        echo
    fi
}

show_spinner() {
    local pid=$1
    local delay=0.1
    local spinstr='|/-\'
    
    while [ "$(ps a | awk '{print $1}' | grep $pid)" ]; do
        local temp=${spinstr#?}
        printf " [%c]  " "$spinstr"
        local spinstr=$temp${spinstr%"$temp"}
        sleep $delay
        printf "\b\b\b\b\b\b"
    done
    printf "    \b\b\b\b"
}

# =============================================================================
# FILE OPERATIONS
# =============================================================================

safe_copy() {
    local src=$1
    local dest=$2
    local dry_run=${3:-false}
    
    if [[ "$dry_run" == true ]]; then
        log_debug "DRY-RUN: cp '$src' -> '$dest'"
        return 0
    fi
    
    if [[ ! -f "$src" ]]; then
        log_error "Arquivo fonte não existe: $src"
        return 1
    fi
    
    mkdir -p "$(dirname "$dest")"
    
    if cp "$src" "$dest"; then
        log_debug "Copiado: $(basename "$src")"
        return 0
    else
        log_error "Falha ao copiar: $src -> $dest"
        return 1
    fi
}

safe_move() {
    local src=$1
    local dest=$2
    local dry_run=${3:-false}
    
    if [[ "$dry_run" == true ]]; then
        log_debug "DRY-RUN: mv '$src' -> '$dest'"
        return 0
    fi
    
    if [[ ! -e "$src" ]]; then
        log_error "Arquivo/diretório fonte não existe: $src"
        return 1
    fi
    
    mkdir -p "$(dirname "$dest")"
    
    if mv "$src" "$dest"; then
        log_debug "Movido: $(basename "$src")"
        return 0
    else
        log_error "Falha ao mover: $src -> $dest"
        return 1
    fi
}

safe_mkdir() {
    local dir=$1
    local dry_run=${2:-false}
    
    if [[ "$dry_run" == true ]]; then
        log_debug "DRY-RUN: mkdir -p '$dir'"
        return 0
    fi
    
    if mkdir -p "$dir"; then
        log_debug "Diretório criado: $dir"
        return 0
    else
        log_error "Falha ao criar diretório: $dir"
        return 1
    fi
}

# =============================================================================
# STRUCTURE FUNCTIONS
# =============================================================================

create_directory_structure() {
    local base_dir=$1
    local dry_run=${2:-false}
    
    local dirs=(
        "modules"
        "assets/audio"
        "assets/images"
        "assets/documents"
        "scripts/generators"
        "scripts/validators"
        "_backup"
        "_temp"
    )
    
    log_info "🏗️  Criando estrutura de diretórios..."
    
    local count=0
    local total=${#dirs[@]}
    
    for dir in "${dirs[@]}"; do
        local full_path="$base_dir/$dir"
        
        if safe_mkdir "$full_path" "$dry_run"; then
            ((count++))
            show_progress "$count" "$total" "Criando diretórios"
        else
            return 1
        fi
    done
    
    log_success "✅ Estrutura de diretórios criada"
    return 0
}

# =============================================================================
# VALIDATION FUNCTIONS
# =============================================================================

validate_file_integrity() {
    local file=$1
    
    if [[ ! -f "$file" ]]; then
        log_error "Arquivo não existe: $file"
        return 1
    fi
    
    if [[ ! -r "$file" ]]; then
        log_error "Arquivo não é legível: $file"
        return 1
    fi
    
    # Check if file is not empty
    if [[ ! -s "$file" ]]; then
        log_warning "Arquivo está vazio: $file"
        return 1
    fi
    
    return 0
}

check_jekyll_compatibility() {
    local project_dir=$1
    
    cd "$project_dir" || return 1
    
    # Check for required Jekyll files
    local required_files=(
        "_config.yml"
        "Gemfile"
    )
    
    for file in "${required_files[@]}"; do
        if [[ ! -f "$file" ]]; then
            log_error "Arquivo Jekyll necessário não encontrado: $file"
            return 1
        fi
    done
    
    # Test Jekyll build if bundle is available
    if command -v bundle &> /dev/null; then
        log_info "🧪 Testando build do Jekyll..."
        
        if bundle exec jekyll build --dry-run &> /dev/null; then
            log_success "✅ Jekyll build test passou"
            return 0
        else
            log_error "❌ Jekyll build test falhou"
            return 1
        fi
    else
        log_warning "⚠️  Bundle não encontrado, pulando teste Jekyll"
        return 0
    fi
}

# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

get_timestamp() {
    date +%Y%m%d-%H%M%S
}

get_human_readable_size() {
    local size_bytes=$1
    
    if command -v numfmt &> /dev/null; then
        numfmt --to=iec-i --suffix=B "$size_bytes"
    else
        # Fallback for systems without numfmt
        if [[ $size_bytes -lt 1024 ]]; then
            echo "${size_bytes}B"
        elif [[ $size_bytes -lt 1048576 ]]; then
            echo "$((size_bytes / 1024))KB"
        elif [[ $size_bytes -lt 1073741824 ]]; then
            echo "$((size_bytes / 1048576))MB"
        else
            echo "$((size_bytes / 1073741824))GB"
        fi
    fi
}

count_files() {
    local dir=$1
    local pattern=${2:-"*"}
    
    find "$dir" -name "$pattern" -type f 2>/dev/null | wc -l
}

count_directories() {
    local dir=$1
    
    find "$dir" -type d 2>/dev/null | wc -l
}

get_total_size() {
    local dir=$1
    
    du -sb "$dir" 2>/dev/null | awk '{print $1}'
}

# =============================================================================
# MODULE ANALYSIS FUNCTIONS
# =============================================================================

extract_module_info() {
    local module_dir=$1
    local module_name=$(basename "$module_dir")
    
    # Extract number and clean name
    local number=$(echo "$module_name" | grep -o '^[0-9]\+')
    local clean_name=$(echo "$module_name" | sed 's/^[0-9]\+-//' | sed 's/-/ /g')
    
    echo "$number|$clean_name|$module_name"
}

analyze_module_content() {
    local module_dir=$1
    
    if [[ ! -d "$module_dir" ]]; then
        echo "0|0|0|0"
        return
    fi
    
    local md_count=$(count_files "$module_dir" "*.md")
    local mp3_count=$(count_files "$module_dir" "*.mp3")
    local wav_count=$(count_files "$module_dir" "*.wav")
    local other_count=$(find "$module_dir" -type f ! -name "*.md" ! -name "*.mp3" ! -name "*.wav" ! -name ".DS_Store" 2>/dev/null | wc -l)
    
    echo "$md_count|$mp3_count|$wav_count|$other_count"
}

# =============================================================================
# BACKUP FUNCTIONS
# =============================================================================

create_backup() {
    local source_dir=$1
    local backup_dir=$2
    local backup_name=${3:-"backup-$(get_timestamp)"}
    
    local full_backup_path="$backup_dir/$backup_name"
    
    log_info "💾 Criando backup em: $full_backup_path"
    
    if safe_mkdir "$backup_dir"; then
        if rsync -av --exclude="_backup" --exclude=".git" "$source_dir/" "$full_backup_path/"; then
            log_success "✅ Backup criado com sucesso"
            echo "$backup_name"
            return 0
        else
            log_error "❌ Falha ao criar backup"
            return 1
        fi
    else
        return 1
    fi
}

# =============================================================================
# CONFIGURATION FUNCTIONS
# =============================================================================

backup_config_files() {
    local project_dir=$1
    local backup_dir=$2
    local dry_run=${3:-false}
    
    local config_files=(
        "_config.yml"
        "_data/course_structure.yml"
        "package.json"
        "Gemfile"
    )
    
    log_info "📋 Fazendo backup dos arquivos de configuração..."
    
    for config_file in "${config_files[@]}"; do
        local source="$project_dir/$config_file"
        local dest="$backup_dir/configs/$(basename "$config_file")"
        
        if [[ -f "$source" ]]; then
            safe_copy "$source" "$dest" "$dry_run"
        fi
    done
}

# =============================================================================
# ERROR HANDLING
# =============================================================================

cleanup_on_error() {
    local temp_dir=${1:-""}
    
    log_warning "🧹 Limpando arquivos temporários..."
    
    if [[ -n "$temp_dir" ]] && [[ -d "$temp_dir" ]]; then
        rm -rf "$temp_dir"
        log_info "Removido diretório temporário: $temp_dir"
    fi
}

# Set up error trap
trap 'cleanup_on_error "$TEMP_DIR"' ERR

# =============================================================================
# EXPORT FUNCTIONS
# =============================================================================

# Make functions available to other scripts
export -f log_info log_success log_warning log_error log_debug
export -f show_progress show_spinner
export -f safe_copy safe_move safe_mkdir
export -f create_directory_structure
export -f validate_file_integrity check_jekyll_compatibility
export -f get_timestamp get_human_readable_size
export -f count_files count_directories get_total_size
export -f extract_module_info analyze_module_content
export -f create_backup backup_config_files
export -f cleanup_on_error 