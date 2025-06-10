#!/bin/bash

# =============================================================================
# MIGRATION SCRIPT - Estrutura de Dados e Algoritmos
# Reorganiza completamente a estrutura do curso de forma segura e modular
# =============================================================================

set -euo pipefail  # Exit on error, undefined vars, pipe failures

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
BACKUP_DIR="$PROJECT_ROOT/_backup"
LOG_FILE="$BACKUP_DIR/migration-$(date +%Y%m%d-%H%M%S).log"

# Import helper functions
source "$SCRIPT_DIR/helpers/utils.sh"
source "$SCRIPT_DIR/helpers/mapping.sh"
source "$SCRIPT_DIR/helpers/validation.sh"

# =============================================================================
# MAIN FUNCTION
# =============================================================================

main() {
    # Parse command line arguments
    local dry_run=false
    local phase="all"
    local rollback_id=""
    local verbose=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --dry-run)
                dry_run=true
                shift
                ;;
            --phase=*)
                phase="${1#*=}"
                shift
                ;;
            --rollback=*)
                rollback_id="${1#*=}"
                shift
                ;;
            --verbose|-v)
                verbose=true
                shift
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            *)
                log_error "Opção desconhecida: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # Set debug mode if verbose
    if [[ "$verbose" == true ]]; then
        export DEBUG=true
    fi
    
    # Initialize logging
    initialize_logging
    
    # Handle rollback request
    if [[ -n "$rollback_id" ]]; then
        perform_rollback "$rollback_id"
        exit $?
    fi
    
    # Show header
    show_migration_header "$dry_run" "$phase"
    
    # Execute migration phases
    case "$phase" in
        "all")
            execute_all_phases "$dry_run"
            ;;
        "1"|"analyze")
            execute_phase "01-analyze.sh" "$dry_run"
            ;;
        "2"|"backup")
            execute_phase "02-backup.sh" "$dry_run"
            ;;
        "3"|"structure")
            execute_phase "03-create-structure.sh" "$dry_run"
            ;;
        "4"|"content")
            execute_phase "04-content-migration.sh" "$dry_run"
            ;;
        "5"|"media")
            execute_phase "05-media-migration.sh" "$dry_run"
            ;;
        "6"|"config")
            execute_phase "06-config-updates.sh" "$dry_run"
            ;;
        "7"|"validate")
            execute_phase "07-final-validation.sh" "$dry_run"
            ;;
        *)
            log_error "Fase inválida: $phase"
            show_help
            exit 1
            ;;
    esac
}

# =============================================================================
# EXECUTION FUNCTIONS
# =============================================================================

execute_all_phases() {
    local dry_run=$1
    
    log_info "🚀 INICIANDO MIGRAÇÃO COMPLETA"
    
    log_info ""
    log_info "═══════════════════════════════════════════════════════"
    log_info "📍 FASE 1/7: Análise da Estrutura Atual"
    log_info "═══════════════════════════════════════════════════════"
    execute_phase "01-analyze.sh" "$dry_run"
    
    log_info ""
    log_info "═══════════════════════════════════════════════════════"
    log_info "📍 FASE 2/7: Backup Completo"
    log_info "═══════════════════════════════════════════════════════"
    execute_phase "02-backup.sh" "$dry_run"
    
    log_info ""
    log_info "═══════════════════════════════════════════════════════"
    log_info "📍 FASE 3/7: Criação da Nova Estrutura"
    log_info "═══════════════════════════════════════════════════════"
    execute_phase "03-create-structure.sh" "$dry_run"
    
    log_info ""
    log_info "═══════════════════════════════════════════════════════"
    log_info "📍 FASE 4/7: Migração de Conteúdo"
    log_info "═══════════════════════════════════════════════════════"
    execute_phase "04-content-migration.sh" "$dry_run"
    
    log_info ""
    log_info "═══════════════════════════════════════════════════════"
    log_info "📍 FASE 5/7: Migração de Mídia"
    log_info "═══════════════════════════════════════════════════════"
    execute_phase "05-media-migration.sh" "$dry_run"
    
    log_info ""
    log_info "═══════════════════════════════════════════════════════"
    log_info "📍 FASE 6/7: Atualização de Configurações"
    log_info "═══════════════════════════════════════════════════════"
    execute_phase "06-config-updates.sh" "$dry_run"
    
    log_info ""
    log_info "═══════════════════════════════════════════════════════"
    log_info "📍 FASE 7/7: Validação Final"
    log_info "═══════════════════════════════════════════════════════"
    execute_phase "07-final-validation.sh" "$dry_run"
    
    # Final success message
    show_migration_success "$dry_run"
}

execute_phase() {
    local phase_script=$1
    local dry_run=$2
    
    local phase_path="$SCRIPT_DIR/phases/$phase_script"
    
    if [[ ! -f "$phase_path" ]]; then
        log_error "❌ Script da fase não encontrado: $phase_script"
        return 1
    fi
    
    if [[ ! -x "$phase_path" ]]; then
        log_error "❌ Script da fase não é executável: $phase_script"
        return 1
    fi
    
    # Execute phase with proper arguments
    local phase_args=""
    if [[ "$dry_run" == true ]]; then
        phase_args="--dry-run"
    fi
    
    if "$phase_path" $phase_args; then
        return 0
    else
        return 1
    fi
}

# =============================================================================
# ROLLBACK FUNCTIONS
# =============================================================================

perform_rollback() {
    local backup_id=$1
    
    log_info "🔄 INICIANDO ROLLBACK: $backup_id"
    
    local backup_path="$BACKUP_DIR/$backup_id"
    
    # Validate backup exists
    if [[ ! -d "$backup_path" ]]; then
        log_error "❌ Backup não encontrado: $backup_id"
        list_available_backups
        exit 1
    fi
    
    # Validate backup integrity before rollback
    if ! validate_rollback_integrity "$backup_path" "$PROJECT_ROOT"; then
        log_error "❌ Backup tem problemas de integridade"
        exit 1
    fi
    
    # Ask for confirmation
    if ! confirm_rollback "$backup_id"; then
        log_info "❌ Rollback cancelado pelo usuário"
        exit 0
    fi
    
    # Perform rollback
    execute_rollback "$backup_path"
}

confirm_rollback() {
    local backup_id=$1
    
    echo ""
    log_warning "⚠️  ATENÇÃO: Esta operação irá:"
    echo "   • Substituir TODA a estrutura atual pelo backup"
    echo "   • Perder TODAS as alterações feitas após o backup"
    echo "   • Restaurar o estado exato do backup $backup_id"
    echo ""
    
    read -p "Tem certeza que deseja continuar? (Digite 'CONFIRMO' para prosseguir): " confirmation
    
    if [[ "$confirmation" == "CONFIRMO" ]]; then
        return 0
    else
        return 1
    fi
}

execute_rollback() {
    local backup_path=$1
    
    log_info "📦 Executando rollback..."
    
    # Create a safety backup before rollback
    local safety_backup="$BACKUP_DIR/pre-rollback-$(get_timestamp)"
    log_info "💾 Criando backup de segurança em: $(basename "$safety_backup")"
    
    if ! rsync -av --exclude="_backup" "$PROJECT_ROOT/" "$safety_backup/"; then
        log_error "❌ Falha ao criar backup de segurança"
        exit 1
    fi
    
    # Perform the rollback
    log_info "🔄 Restaurando arquivos do backup..."
    
    if rsync -av --delete --exclude="_backup" "$backup_path/" "$PROJECT_ROOT/"; then
        log_success "✅ Rollback executado com sucesso"
        log_info "💾 Backup de segurança salvo em: $(basename "$safety_backup")"
        
        # Test Jekyll after rollback
        test_jekyll_after_rollback
        
    else
        log_error "❌ Falha durante o rollback"
        log_info "💾 Estado anterior preservado em: $(basename "$safety_backup")"
        exit 1
    fi
}

test_jekyll_after_rollback() {
    log_info "🧪 Testando Jekyll após rollback..."
    
    cd "$PROJECT_ROOT" || return 1
    
    if command -v bundle &> /dev/null; then
        if bundle exec jekyll build --dry-run &> /dev/null; then
            log_success "✅ Jekyll funcional após rollback"
        else
            log_warning "⚠️  Jekyll pode ter problemas após rollback"
        fi
    else
        log_info "ℹ️  Bundle não disponível para teste"
    fi
}

list_available_backups() {
    log_info "📋 Backups disponíveis:"
    
    if [[ -d "$BACKUP_DIR" ]]; then
        find "$BACKUP_DIR" -maxdepth 1 -type d -name "backup-*" | sort -r | while read -r backup_dir; do
            if [[ -n "$backup_dir" ]]; then
                local backup_id=$(basename "$backup_dir")
                local backup_date=$(echo "$backup_id" | sed 's/backup-//')
                local backup_size=$(get_total_size "$backup_dir")
                local readable_size=$(get_human_readable_size "$backup_size")
                
                echo "   • $backup_id ($readable_size)"
            fi
        done
    else
        log_info "   Nenhum backup encontrado"
    fi
}

# =============================================================================
# ERROR HANDLING
# =============================================================================

handle_phase_failure() {
    local phase_number=$1
    local phase_script=$2
    
    echo ""
    log_warning "⚠️  OPÇÕES DISPONÍVEIS:"
    echo "   1. Tentar novamente a fase atual"
    echo "   2. Pular esta fase e continuar"
    echo "   3. Fazer rollback para backup anterior"
    echo "   4. Cancelar migração"
    echo ""
    
    read -p "Escolha uma opção (1-4): " choice
    
    case "$choice" in
        1)
            log_info "🔄 Tentando novamente a fase $phase_number..."
            if execute_phase "$phase_script" false; then
                log_success "✅ Fase $phase_number concluída na segunda tentativa"
                return 0
            else
                log_error "❌ Fase $phase_number falhou novamente"
                exit 1
            fi
            ;;
        2)
            log_warning "⚠️  Pulando fase $phase_number (pode causar problemas)"
            return 0
            ;;
        3)
            list_available_backups
            read -p "Digite o ID do backup para rollback: " backup_id
            perform_rollback "$backup_id"
            exit 0
            ;;
        4|*)
            log_info "❌ Migração cancelada pelo usuário"
            exit 1
            ;;
    esac
}

# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

show_help() {
    cat << EOF
SISTEMA DE MIGRAÇÃO - Estrutura de Dados e Algoritmos

Usage: $0 [OPÇÕES]

OPÇÕES:
  --dry-run           Simula a migração sem fazer alterações
  --phase=FASE        Executa apenas uma fase específica
  --rollback=ID       Faz rollback para um backup específico
  --verbose, -v       Modo verboso (mais detalhes)
  --help, -h          Mostra esta ajuda

FASES DISPONÍVEIS:
  all, 1, analyze     Análise da estrutura atual
  2, backup           Backup completo
  3, structure        Criação da nova estrutura
  4, content          Migração de conteúdo
  5, media            Migração de mídia
  6, config           Atualização de configurações
  7, validate         Validação final

EXEMPLOS:
  $0                           # Migração completa
  $0 --dry-run                 # Simulação completa
  $0 --phase=1                 # Apenas análise
  $0 --phase=backup --verbose  # Backup com detalhes
  $0 --rollback=backup-20231201-143022  # Rollback

ROLLBACK:
  Para fazer rollback, use o ID do backup (ex: backup-20231201-143022).
  Liste backups disponíveis com: find _backup -name "backup-*" -type d

LOGS:
  Logs detalhados são salvos em: _backup/migration-TIMESTAMP.log
EOF
}

show_migration_header() {
    local dry_run=$1
    local phase=$2
    
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo -e "${BLUE}🚀 SISTEMA DE MIGRAÇÃO - ESTRUTURA DE DADOS E ALGORITMOS${NC}"
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    
    if [[ "$dry_run" == true ]]; then
        echo -e "${YELLOW}🔍 MODO: DRY-RUN (Simulação)${NC}"
    else
        echo -e "${GREEN}⚡ MODO: EXECUÇÃO REAL${NC}"
    fi
    
    echo -e "${BLUE}📋 FASE: $phase${NC}"
    echo -e "${BLUE}📁 PROJETO: $PROJECT_ROOT${NC}"
    echo -e "${BLUE}📅 DATA: $(date)${NC}"
    echo ""
    
    if [[ "$dry_run" == false ]]; then
        echo -e "${YELLOW}⚠️  ATENÇÃO: Esta operação irá modificar a estrutura do projeto!${NC}"
        echo ""
        
        read -p "Pressione ENTER para continuar ou Ctrl+C para cancelar..."
        echo ""
    fi
}

show_migration_success() {
    local dry_run=$1
    
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    
    if [[ "$dry_run" == true ]]; then
        echo -e "${GREEN}🎉 SIMULAÇÃO CONCLUÍDA COM SUCESSO!${NC}"
        echo ""
        echo "✅ Todas as fases foram validadas"
        echo "✅ Estrutura está pronta para migração real"
        echo ""
        echo "Para executar a migração real:"
        echo "   $0"
    else
        echo -e "${GREEN}🎉 MIGRAÇÃO CONCLUÍDA COM SUCESSO!${NC}"
        echo ""
        echo "✅ Nova estrutura criada e validada"
        echo "✅ Conteúdo migrado com segurança"
        echo "✅ Backup completo disponível"
        echo ""
        echo "PRÓXIMOS PASSOS:"
        echo "1. Teste o site Jekyll: bundle exec jekyll serve"
        echo "2. Verifique se tudo está funcionando"
        echo "3. Commit das alterações no Git"
        echo ""
        echo "ROLLBACK (se necessário):"
        
        local latest_backup=$(find "$BACKUP_DIR" -maxdepth 1 -type d -name "backup-*" | sort -r | head -1)
        if [[ -n "$latest_backup" ]]; then
            echo "   $0 --rollback=$(basename "$latest_backup")"
        fi
    fi
    
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
}

get_phase_name() {
    local phase_script=$1
    
    case "$phase_script" in
        "01-analyze.sh")
            echo "Análise da Estrutura Atual"
            ;;
        "02-backup.sh")
            echo "Backup Completo"
            ;;
        "03-create-structure.sh")
            echo "Criação da Nova Estrutura"
            ;;
        "04-content-migration.sh")
            echo "Migração de Conteúdo"
            ;;
        "05-media-migration.sh")
            echo "Migração de Mídia"
            ;;
        "06-config-updates.sh")
            echo "Atualização de Configurações"
            ;;
        "07-final-validation.sh")
            echo "Validação Final"
            ;;
        *)
            echo "Fase Desconhecida"
            ;;
    esac
}

initialize_logging() {
    # Create backup directory if it doesn't exist
    safe_mkdir "$BACKUP_DIR"
    
    # Initialize log file
    {
        echo "MIGRATION LOG - $(date)"
        echo "Project: $PROJECT_ROOT"
        echo "Script: $0"
        echo "Arguments: $*"
        echo "═══════════════════════════════════════════════════════════════"
        echo ""
    } > "$LOG_FILE"
    
    log_info "📄 Log inicializado: $(basename "$LOG_FILE")"
}

# =============================================================================
# SIGNAL HANDLING
# =============================================================================

cleanup() {
    log_warning "🛑 Migração interrompida pelo usuário"
    
    # Add cleanup logic here if needed
    
    exit 130
}

# Trap Ctrl+C
trap cleanup SIGINT

# =============================================================================
# SCRIPT EXECUTION
# =============================================================================

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi 