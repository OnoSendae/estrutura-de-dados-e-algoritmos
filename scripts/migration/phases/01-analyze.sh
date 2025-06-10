#!/bin/bash

# =============================================================================
# FASE 1: ANÁLISE DA ESTRUTURA ATUAL
# Mapeia e analisa a estrutura existente antes da migração
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
        log_warning "🔍 MODO DRY-RUN: Apenas análise, sem alterações"
    fi
    
    log_info "🔍 INICIANDO FASE 1: Análise da Estrutura Atual"
    
    # Create analysis directory
    local analysis_dir="$PROJECT_ROOT/_backup/analysis-$(get_timestamp)"
    if [[ "$dry_run" == false ]]; then
        safe_mkdir "$analysis_dir"
    fi
    
    # Run analysis steps
    analyze_project_structure "$analysis_dir" "$dry_run"
    analyze_module_structure "$analysis_dir" "$dry_run"
    analyze_content_distribution "$analysis_dir" "$dry_run"
    analyze_media_files "$analysis_dir" "$dry_run"
    analyze_dependencies "$analysis_dir" "$dry_run"
    
    # Generate comprehensive report
    generate_analysis_report "$analysis_dir" "$dry_run"
    
    # Validate current structure
    validate_source_structure "$PROJECT_ROOT"
    
    log_success "✅ FASE 1 CONCLUÍDA: Análise da estrutura atual"
    
    if [[ "$dry_run" == false ]]; then
        log_info "📄 Relatórios salvos em: $analysis_dir"
    fi
}

# =============================================================================
# ANALYSIS FUNCTIONS
# =============================================================================

analyze_project_structure() {
    local analysis_dir=$1
    local dry_run=$2
    
    log_info "📊 Analisando estrutura geral do projeto..."
    
    local structure_file="$analysis_dir/project-structure.txt"
    
    if [[ "$dry_run" == false ]]; then
        # Generate project tree
        {
            echo "ESTRUTURA ATUAL DO PROJETO"
            echo "=========================="
            echo "Gerado em: $(date)"
            echo ""
            
            if command -v tree &> /dev/null; then
                tree -a -I '.git|node_modules|_site|.jekyll-cache' "$PROJECT_ROOT"
            else
                find "$PROJECT_ROOT" -type f -not -path "*/\.git/*" -not -path "*/node_modules/*" \
                     -not -path "*/_site/*" -not -path "*/.jekyll-cache/*" | \
                     head -100 | sort
            fi
        } > "$structure_file"
        
        log_success "✅ Estrutura do projeto mapeada"
    else
        log_info "DRY-RUN: Mapeamento da estrutura do projeto"
    fi
}

analyze_module_structure() {
    local analysis_dir=$1
    local dry_run=$2
    
    log_info "📚 Analisando estrutura dos módulos..."
    
    local modules_file="$analysis_dir/modules-analysis.md"
    
    if [[ "$dry_run" == false ]]; then
        {
            echo "# ANÁLISE DOS MÓDULOS"
            echo ""
            echo "Gerado em: $(date)"
            echo ""
            echo "## Módulos Encontrados"
            echo ""
            echo "| Módulo | Arquivos .md | Arquivos .mp3 | Arquivos .wav | Tamanho | Status |"
            echo "|--------|--------------|---------------|---------------|---------|--------|"
        } > "$modules_file"
        
        local total_modules=0
        local total_md=0
        local total_mp3=0
        local total_wav=0
        local total_size=0
        
        while read -r module_dir; do
            if [[ -n "$module_dir" && -d "$module_dir" ]]; then
                local module_name=$(basename "$module_dir")
                local stats=$(analyze_module_content "$module_dir")
                
                IFS='|' read -r md_count mp3_count wav_count other_count <<< "$stats"
                
                local module_size=$(get_total_size "$module_dir")
                local readable_size=$(get_human_readable_size "$module_size")
                
                # Determine status
                local status="✅ OK"
                if [[ $md_count -eq 0 ]]; then
                    status="⚠️ Sem conteúdo"
                elif [[ $mp3_count -eq 0 ]]; then
                    status="⚠️ Sem áudio"
                fi
                
                echo "| $module_name | $md_count | $mp3_count | $wav_count | $readable_size | $status |" >> "$modules_file"
                
                ((total_modules++))
                ((total_md += md_count))
                ((total_mp3 += mp3_count))
                ((total_wav += wav_count))
                ((total_size += module_size))
            fi
        done < <(get_old_modules)
        
        local total_readable_size=$(get_human_readable_size "$total_size")
        
        {
            echo ""
            echo "## Resumo Estatístico"
            echo ""
            echo "- **Total de módulos:** $total_modules"
            echo "- **Total de arquivos .md:** $total_md"
            echo "- **Total de arquivos .mp3:** $total_mp3"
            echo "- **Total de arquivos .wav:** $total_wav"
            echo "- **Tamanho total:** $total_readable_size"
            echo ""
            echo "## Problemas Identificados"
            echo ""
        } >> "$modules_file"
        
        # Identify problems
        analyze_module_problems "$modules_file"
        
        log_success "✅ Análise dos módulos concluída ($total_modules módulos)"
    else
        log_info "DRY-RUN: Análise dos módulos"
    fi
}

analyze_module_problems() {
    local output_file=$1
    local problems_found=false
    
    # Check for naming inconsistencies
    while read -r module_dir; do
        if [[ -n "$module_dir" && -d "$module_dir" ]]; then
            local module_name=$(basename "$module_dir")
            
            # Check naming pattern
            if [[ ! "$module_name" =~ ^[0-9]+-.*$ ]]; then
                echo "- ❌ **Naming inconsistency:** $module_name (não segue padrão número-nome)" >> "$output_file"
                problems_found=true
            fi
            
            # Check for mixed numbering
            if [[ "$module_name" =~ ^[0-9]{2,}-.*$ ]]; then
                local number=$(echo "$module_name" | grep -o '^[0-9]\+')
                if [[ ${#number} -ne 2 ]] && [[ $number -lt 10 ]]; then
                    echo "- ⚠️ **Numbering inconsistency:** $module_name (mistura de 1 e 2 dígitos)" >> "$output_file"
                    problems_found=true
                fi
            fi
            
            # Check for empty modules
            local stats=$(analyze_module_content "$module_dir")
            IFS='|' read -r md_count mp3_count wav_count other_count <<< "$stats"
            
            if [[ $md_count -eq 0 ]]; then
                echo "- ❌ **Empty module:** $module_name (sem arquivos .md)" >> "$output_file"
                problems_found=true
            fi
            
            # Check for duplicate audio formats
            if [[ $mp3_count -gt 0 && $wav_count -gt 0 ]]; then
                echo "- ⚠️ **Duplicate audio:** $module_name (tem .mp3 e .wav)" >> "$output_file"
                problems_found=true
            fi
        fi
    done < <(get_old_modules)
    
    if [[ "$problems_found" == false ]]; then
        echo "- ✅ Nenhum problema crítico encontrado" >> "$output_file"
    fi
}

analyze_content_distribution() {
    local analysis_dir=$1
    local dry_run=$2
    
    log_info "📄 Analisando distribuição de conteúdo..."
    
    local content_file="$analysis_dir/content-distribution.md"
    
    if [[ "$dry_run" == false ]]; then
        {
            echo "# ANÁLISE DE DISTRIBUIÇÃO DE CONTEÚDO"
            echo ""
            echo "Gerado em: $(date)"
            echo ""
            echo "## Distribuição por Tipo de Arquivo"
            echo ""
        } > "$content_file"
        
        # Analyze file types
        local modules_dir="$PROJECT_ROOT/src/modulos-treinamento"
        
        echo "| Tipo | Quantidade | Tamanho Total | Localização |" >> "$content_file"
        echo "|------|------------|---------------|-------------|" >> "$content_file"
        
        # Markdown files
        local md_count=$(count_files "$modules_dir" "*.md")
        local md_size=$(find "$modules_dir" -name "*.md" -type f -exec du -cb {} + 2>/dev/null | tail -1 | cut -f1)
        local md_readable=$(get_human_readable_size "$md_size")
        echo "| Markdown (.md) | $md_count | $md_readable | Conteúdo das lições |" >> "$content_file"
        
        # MP3 files
        local mp3_count=$(count_files "$modules_dir" "*.mp3")
        local mp3_size=$(find "$modules_dir" -name "*.mp3" -type f -exec du -cb {} + 2>/dev/null | tail -1 | cut -f1)
        local mp3_readable=$(get_human_readable_size "$mp3_size")
        echo "| Audio MP3 (.mp3) | $mp3_count | $mp3_readable | Áudio das lições |" >> "$content_file"
        
        # WAV files
        local wav_count=$(count_files "$modules_dir" "*.wav")
        local wav_size=$(find "$modules_dir" -name "*.wav" -type f -exec du -cb {} + 2>/dev/null | tail -1 | cut -f1)
        local wav_readable=$(get_human_readable_size "$wav_size")
        echo "| Audio WAV (.wav) | $wav_count | $wav_readable | Arquivos originais |" >> "$content_file"
        
        # Other files
        local other_count=$(find "$modules_dir" -type f ! -name "*.md" ! -name "*.mp3" ! -name "*.wav" ! -name ".DS_Store" 2>/dev/null | wc -l)
        echo "| Outros | $other_count | - | Diversos |" >> "$content_file"
        
        {
            echo ""
            echo "## Padrões de Nomenclatura"
            echo ""
            echo "### Arquivos Markdown"
            echo ""
        } >> "$content_file"
        
        # Analyze naming patterns
        find "$modules_dir" -name "*.md" -type f | while read -r file; do
            local filename=$(basename "$file")
            echo "- $filename" >> "$content_file"
        done | head -20 >> "$content_file"
        
        log_success "✅ Análise de distribuição de conteúdo concluída"
    else
        log_info "DRY-RUN: Análise de distribuição de conteúdo"
    fi
}

analyze_media_files() {
    local analysis_dir=$1
    local dry_run=$2
    
    log_info "🎵 Analisando arquivos de mídia..."
    
    local media_file="$analysis_dir/media-analysis.md"
    
    if [[ "$dry_run" == false ]]; then
        {
            echo "# ANÁLISE DE ARQUIVOS DE MÍDIA"
            echo ""
            echo "Gerado em: $(date)"
            echo ""
            echo "## Resumo de Mídia por Módulo"
            echo ""
            echo "| Módulo | MP3 | WAV | Tamanho MP3 | Tamanho WAV | Ratio |"
            echo "|--------|-----|-----|-------------|-------------|-------|"
        } > "$media_file"
        
        while read -r module_dir; do
            if [[ -n "$module_dir" && -d "$module_dir" ]]; then
                local module_name=$(basename "$module_dir")
                
                local mp3_count=$(count_files "$module_dir" "*.mp3")
                local wav_count=$(count_files "$module_dir" "*.wav")
                
                local mp3_size=0
                local wav_size=0
                
                if [[ $mp3_count -gt 0 ]]; then
                    mp3_size=$(find "$module_dir" -name "*.mp3" -type f -exec du -cb {} + 2>/dev/null | tail -1 | cut -f1)
                fi
                
                if [[ $wav_count -gt 0 ]]; then
                    wav_size=$(find "$module_dir" -name "*.wav" -type f -exec du -cb {} + 2>/dev/null | tail -1 | cut -f1)
                fi
                
                local mp3_readable=$(get_human_readable_size "$mp3_size")
                local wav_readable=$(get_human_readable_size "$wav_size")
                
                local ratio="-"
                if [[ $wav_size -gt 0 && $mp3_size -gt 0 ]]; then
                    ratio=$(awk "BEGIN {printf \"%.1f%%\", ($mp3_size/$wav_size)*100}")
                fi
                
                echo "| $module_name | $mp3_count | $wav_count | $mp3_readable | $wav_readable | $ratio |" >> "$media_file"
            fi
        done < <(get_old_modules)
        
        {
            echo ""
            echo "## Problemas de Mídia Identificados"
            echo ""
        } >> "$media_file"
        
        # Check for media problems
        analyze_media_problems "$media_file"
        
        log_success "✅ Análise de arquivos de mídia concluída"
    else
        log_info "DRY-RUN: Análise de arquivos de mídia"
    fi
}

analyze_media_problems() {
    local output_file=$1
    local problems_found=false
    
    while read -r module_dir; do
        if [[ -n "$module_dir" && -d "$module_dir" ]]; then
            local module_name=$(basename "$module_dir")
            
            # Check for missing audio
            local mp3_count=$(count_files "$module_dir" "*.mp3")
            local wav_count=$(count_files "$module_dir" "*.wav")
            local md_count=$(count_files "$module_dir" "*.md")
            
            if [[ $md_count -gt 0 && $mp3_count -eq 0 && $wav_count -eq 0 ]]; then
                echo "- ❌ **Missing audio:** $module_name (tem conteúdo mas sem áudio)" >> "$output_file"
                problems_found=true
            fi
            
            # Check for orphaned audio
            if [[ $md_count -eq 0 && ($mp3_count -gt 0 || $wav_count -gt 0) ]]; then
                echo "- ⚠️ **Orphaned audio:** $module_name (tem áudio mas sem conteúdo)" >> "$output_file"
                problems_found=true
            fi
            
            # Check for inconsistent audio formats
            if [[ $mp3_count -ne $wav_count && $wav_count -gt 0 ]]; then
                echo "- ⚠️ **Audio mismatch:** $module_name (MP3: $mp3_count, WAV: $wav_count)" >> "$output_file"
                problems_found=true
            fi
        fi
    done < <(get_old_modules)
    
    if [[ "$problems_found" == false ]]; then
        echo "- ✅ Nenhum problema de mídia encontrado" >> "$output_file"
    fi
}

analyze_dependencies() {
    local analysis_dir=$1
    local dry_run=$2
    
    log_info "🔗 Analisando dependências do projeto..."
    
    local deps_file="$analysis_dir/dependencies-analysis.md"
    
    if [[ "$dry_run" == false ]]; then
        {
            echo "# ANÁLISE DE DEPENDÊNCIAS"
            echo ""
            echo "Gerado em: $(date)"
            echo ""
            echo "## Jekyll Configuration"
            echo ""
        } > "$deps_file"
        
        # Analyze Jekyll config
        if [[ -f "$PROJECT_ROOT/_config.yml" ]]; then
            echo "\`\`\`yaml" >> "$deps_file"
            cat "$PROJECT_ROOT/_config.yml" >> "$deps_file"
            echo "\`\`\`" >> "$deps_file"
        fi
        
        {
            echo ""
            echo "## Package Dependencies"
            echo ""
        } >> "$deps_file"
        
        # Analyze package.json
        if [[ -f "$PROJECT_ROOT/package.json" ]]; then
            echo "### Node.js (package.json)" >> "$deps_file"
            echo "\`\`\`json" >> "$deps_file"
            cat "$PROJECT_ROOT/package.json" >> "$deps_file"
            echo "\`\`\`" >> "$deps_file"
            echo "" >> "$deps_file"
        fi
        
        # Analyze Gemfile
        if [[ -f "$PROJECT_ROOT/Gemfile" ]]; then
            echo "### Ruby (Gemfile)" >> "$deps_file"
            echo "\`\`\`ruby" >> "$deps_file"
            cat "$PROJECT_ROOT/Gemfile" >> "$deps_file"
            echo "\`\`\`" >> "$deps_file"
        fi
        
        log_success "✅ Análise de dependências concluída"
    else
        log_info "DRY-RUN: Análise de dependências"
    fi
}

generate_analysis_report() {
    local analysis_dir=$1
    local dry_run=$2
    
    log_info "📊 Gerando relatório de análise consolidado..."
    
    if [[ "$dry_run" == false ]]; then
        local report_file="$analysis_dir/ANALYSIS-REPORT.md"
        
        {
            echo "# RELATÓRIO DE ANÁLISE - ESTRUTURA ATUAL"
            echo ""
            echo "**Data:** $(date)"
            echo "**Projeto:** Estrutura de Dados e Algoritmos"
            echo ""
            echo "## Resumo Executivo"
            echo ""
        } > "$report_file"
        
        # Generate executive summary
        generate_executive_summary "$report_file"
        
        # Generate mapping report
        generate_mapping_report "$analysis_dir/mapping-report.md"
        
        # Link to other reports
        {
            echo ""
            echo "## Relatórios Detalhados"
            echo ""
            echo "- [📊 Estrutura do Projeto](project-structure.txt)"
            echo "- [📚 Análise dos Módulos](modules-analysis.md)"
            echo "- [📄 Distribuição de Conteúdo](content-distribution.md)"
            echo "- [🎵 Análise de Mídia](media-analysis.md)"
            echo "- [🔗 Dependências](dependencies-analysis.md)"
            echo "- [🗺️ Mapeamento de Migração](mapping-report.md)"
            echo ""
            echo "## Próximos Passos"
            echo ""
            echo "1. **Backup:** Criar backup completo antes da migração"
            echo "2. **Estrutura:** Criar nova estrutura de diretórios"
            echo "3. **Conteúdo:** Migrar arquivos .md para nova estrutura"
            echo "4. **Mídia:** Organizar arquivos de áudio centralizadamente"
            echo "5. **Configuração:** Atualizar arquivos de configuração Jekyll"
            echo "6. **Validação:** Verificar integridade da migração"
            echo ""
        } >> "$report_file"
        
        log_success "✅ Relatório de análise consolidado gerado"
        log_info "📄 Relatório principal: $report_file"
    else
        log_info "DRY-RUN: Geração do relatório consolidado"
    fi
}

generate_executive_summary() {
    local report_file=$1
    
    # Count modules and files
    local module_count=$(get_old_modules | wc -l)
    local total_md=$(count_files "$PROJECT_ROOT/src/modulos-treinamento" "*.md")
    local total_mp3=$(count_files "$PROJECT_ROOT/src/modulos-treinamento" "*.mp3")
    local total_wav=$(count_files "$PROJECT_ROOT/src/modulos-treinamento" "*.wav")
    local total_size=$(get_total_size "$PROJECT_ROOT/src/modulos-treinamento")
    local readable_size=$(get_human_readable_size "$total_size")
    
    {
        echo "### Estatísticas Gerais"
        echo ""
        echo "- **Módulos encontrados:** $module_count"
        echo "- **Arquivos de conteúdo (.md):** $total_md"
        echo "- **Arquivos de áudio (.mp3):** $total_mp3"
        echo "- **Arquivos originais (.wav):** $total_wav"
        echo "- **Tamanho total do conteúdo:** $readable_size"
        echo ""
        echo "### Principais Descobertas"
        echo ""
    } >> "$report_file"
    
    # Analyze and report key findings
    if [[ $total_mp3 -lt $module_count ]]; then
        echo "- ⚠️ **Audio incompleto:** Nem todos os módulos têm arquivos MP3" >> "$report_file"
    else
        echo "- ✅ **Audio completo:** Todos os módulos têm arquivos de áudio" >> "$report_file"
    fi
    
    if [[ $total_wav -gt 0 ]]; then
        echo "- 📁 **Arquivos WAV:** $total_wav arquivos originais podem ser movidos para backup" >> "$report_file"
    fi
    
    if [[ $module_count -ge 10 ]]; then
        echo "- 📚 **Curso abrangente:** $module_count módulos cobrem o currículo completo" >> "$report_file"
    fi
    
    echo "- 🔄 **Migração recomendada:** Estrutura atual pode ser melhorada significativamente" >> "$report_file"
}

# =============================================================================
# SCRIPT EXECUTION
# =============================================================================

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi 