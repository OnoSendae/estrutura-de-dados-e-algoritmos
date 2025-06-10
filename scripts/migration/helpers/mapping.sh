#!/bin/bash

# =============================================================================
# MAPPING FUNCTIONS - Mapeamento da estrutura antiga para nova
# Compatible with bash 3.2 (macOS default)
# =============================================================================

# Mapping from old module names to new standardized names
get_new_module_name() {
    local old_name="$1"
    
    case "$old_name" in
        "0-fundamentos-da-programacao")
            echo "01-foundations"
            ;;
        "1-analise-de-algoritmos-e-complexidade")
            echo "02-complexity-analysis"
            ;;
        "2-estruturas-de-dados-lineares-avancadas")
            echo "03-linear-structures"
            ;;
        "3-arvores-e-grafos")
            echo "04-trees-graphs"
            ;;
        "4-algoritmos-de-ordenacao-e-busca-avancados")
            echo "05-sorting-searching"
            ;;
        "5-tabelas-hash-e-funcoes-hash")
            echo "06-hash-tables"
            ;;
        "6-algoritmos-gulosos-e-programacao-dinamica")
            echo "07-greedy-dynamic"
            ;;
        "7-topicos-avancados-e-aplicacoes")
            echo "08-advanced-topics"
            ;;
        "8-estruturas-de-dados-persistentes")
            echo "09-persistent-structures"
            ;;
        "9-estruturas-de-dados-complexas")
            echo "10-complex-structures"
            ;;
        "10-indexacao")
            echo "11-indexing"
            ;;
        "11-tecnicas-de-resolucao-de-problemas")
            echo "12-problem-solving"
            ;;
        # Special subdirectories
        "exercicios-extras")
            echo "extra-exercises"
            ;;
        "solucoes")
            echo "solutions"
            ;;
        "exemplos")
            echo "examples"
            ;;
        "examples")
            echo "examples"
            ;;
        "modulos-treinamento")
            echo "modules"
            ;;
        *)
            # Return empty string for unknown mappings
            echo ""
            ;;
    esac
}

# Module titles in English
get_module_title_en() {
    local module_id="$1"
    
    case "$module_id" in
        "01-foundations")
            echo "Programming Foundations"
            ;;
        "02-complexity-analysis")
            echo "Algorithm Analysis & Complexity"
            ;;
        "03-linear-structures")
            echo "Advanced Linear Data Structures"
            ;;
        "04-trees-graphs")
            echo "Trees and Graphs"
            ;;
        "05-sorting-searching")
            echo "Advanced Sorting & Searching Algorithms"
            ;;
        "06-hash-tables")
            echo "Hash Tables & Hash Functions"
            ;;
        "07-greedy-dynamic")
            echo "Greedy Algorithms & Dynamic Programming"
            ;;
        "08-advanced-topics")
            echo "Advanced Topics & Applications"
            ;;
        "09-persistent-structures")
            echo "Persistent Data Structures"
            ;;
        "10-complex-structures")
            echo "Complex Data Structures"
            ;;
        "11-indexing")
            echo "Indexing Techniques"
            ;;
        "12-problem-solving")
            echo "Problem Solving Techniques"
            ;;
        *)
            echo "$module_id"
            ;;
    esac
}

# Module titles in Portuguese
get_module_title_pt() {
    local module_id="$1"
    
    case "$module_id" in
        "01-foundations")
            echo "Fundamentos da Programação"
            ;;
        "02-complexity-analysis")
            echo "Análise de Algoritmos e Complexidade"
            ;;
        "03-linear-structures")
            echo "Estruturas de Dados Lineares Avançadas"
            ;;
        "04-trees-graphs")
            echo "Árvores e Grafos"
            ;;
        "05-sorting-searching")
            echo "Algoritmos de Ordenação e Busca Avançados"
            ;;
        "06-hash-tables")
            echo "Tabelas Hash e Funções Hash"
            ;;
        "07-greedy-dynamic")
            echo "Algoritmos Gulosos e Programação Dinâmica"
            ;;
        "08-advanced-topics")
            echo "Tópicos Avançados e Aplicações"
            ;;
        "09-persistent-structures")
            echo "Estruturas de Dados Persistentes"
            ;;
        "10-complex-structures")
            echo "Estruturas de Dados Complexas"
            ;;
        "11-indexing")
            echo "Indexação"
            ;;
        "12-problem-solving")
            echo "Técnicas de Resolução de Problemas"
            ;;
        *)
            echo "$module_id"
            ;;
    esac
}

# Get module title (with language selection)
get_module_title() {
    local module_id="$1"
    local language="${2:-en}"
    
    if [[ "$language" == "pt" ]]; then
        get_module_title_pt "$module_id"
    else
        get_module_title_en "$module_id"
    fi
}

# Get new module info (id and title) from old module name
get_new_module_info() {
    local old_name="$1"
    local new_id=$(get_new_module_name "$old_name")
    
    if [[ "$new_id" == "$old_name" ]]; then
        # No mapping found
        return 1
    fi
    
    local new_title=$(get_module_title_en "$new_id")
    echo "$new_id|$new_title"
    return 0
}

# Get all module mappings for iteration
get_all_module_mappings() {
    echo "0-fundamentos-da-programacao|01-foundations|Programming Foundations"
    echo "1-analise-de-algoritmos-e-complexidade|02-complexity-analysis|Algorithm Analysis & Complexity"
    echo "2-estruturas-de-dados-lineares-avancadas|03-linear-structures|Advanced Linear Data Structures"
    echo "3-arvores-e-grafos|04-trees-graphs|Trees and Graphs"
    echo "4-algoritmos-de-ordenacao-e-busca-avancados|05-sorting-searching|Advanced Sorting & Searching Algorithms"
    echo "5-tabelas-hash-e-funcoes-hash|06-hash-tables|Hash Tables & Hash Functions"
    echo "6-algoritmos-gulosos-e-programacao-dinamica|07-greedy-dynamic|Greedy Algorithms & Dynamic Programming"
    echo "7-topicos-avancados-e-aplicacoes|08-advanced-topics|Advanced Topics & Applications"
    echo "8-estruturas-de-dados-persistentes|09-persistent-structures|Persistent Data Structures"
    echo "9-estruturas-de-dados-complexas|10-complex-structures|Complex Data Structures"
    echo "10-indexacao|11-indexing|Indexing Techniques"
    echo "11-tecnicas-de-resolucao-de-problemas|12-problem-solving|Problem Solving Techniques"
}

get_old_modules() {
    if [[ -z "${PROJECT_ROOT:-}" ]]; then
        PROJECT_ROOT="."
    fi
    
    local modules_dir="$PROJECT_ROOT/src/modulos-treinamento"
    
    if [[ ! -d "$modules_dir" ]]; then
        # Don't use log_error here as it might not be available
        echo "# Diretório de módulos não encontrado: $modules_dir" >&2
        return 1
    fi
    
    find "$modules_dir" -maxdepth 1 -type d -name "[0-9]*" 2>/dev/null | sort -V
}

# =============================================================================
# PATH MAPPING FUNCTIONS
# =============================================================================

map_audio_path() {
    local old_path="$1"
    local old_module=$(echo "$old_path" | sed 's|.*/modulos-treinamento/\([^/]*\)/.*|\1|')
    local filename=$(basename "$old_path")
    local new_module=$(get_new_module_name "$old_module")
    
    echo "assets/audio/$new_module/$filename"
}

map_content_path() {
    local old_path="$1"
    local old_module=$(echo "$old_path" | sed 's|.*/modulos-treinamento/\([^/]*\)/.*|\1|')
    local filename=$(basename "$old_path")
    local new_module=$(get_new_module_name "$old_module")
    
    # Determine subdirectory based on file type
    local subdir="lessons"
    if [[ "$filename" == *"exercise"* ]] || [[ "$filename" == *"exercicio"* ]]; then
        subdir="exercises"
    elif [[ "$filename" == *"example"* ]] || [[ "$filename" == *"exemplo"* ]]; then
        subdir="examples"
    elif [[ "$filename" == "README.md" ]] || [[ "$filename" == *"overview"* ]]; then
        subdir="."
    fi
    
    if [[ "$subdir" == "." ]]; then
        echo "modules/$new_module/$filename"
    else
        echo "modules/$new_module/$subdir/$filename"
    fi
}

map_lesson_filename() {
    local old_filename="$1"
    local new_filename="$old_filename"
    
    # Standardize lesson numbering (ensure two digits)
    if [[ "$new_filename" =~ ^[0-9]-.*\.md$ ]]; then
        new_filename=$(echo "$new_filename" | sed 's/^/0/')
    fi
    
    # Convert Portuguese terms to English
    new_filename=$(echo "$new_filename" | sed 's/introducao/introduction/g')
    new_filename=$(echo "$new_filename" | sed 's/exercicios/exercises/g') 
    new_filename=$(echo "$new_filename" | sed 's/exemplos/examples/g')
    new_filename=$(echo "$new_filename" | sed 's/fundamentos/foundations/g')
    
    echo "$new_filename"
}

# =============================================================================
# ANALYSIS FUNCTIONS
# =============================================================================

generate_mapping_report() {
    local output_file="$1"
    
    log_info "📊 Gerando relatório de mapeamento..."
    
    cat > "$output_file" << 'EOF'
# RELATÓRIO DE MAPEAMENTO DE MÓDULOS

## Mapeamento Estrutura Antiga → Nova

| Estrutura Antiga | Estrutura Nova | Título |
|------------------|----------------|--------|
EOF
    
    get_all_module_mappings | while IFS='|' read -r old_name new_id new_title; do
        local title_pt=$(get_module_title_pt "$new_id")
        echo "| \`$old_name\` | \`$new_id\` | $title_pt |" >> "$output_file"
    done
    
    cat >> "$output_file" << 'EOF'

## Estatísticas Detalhadas

EOF
    
    # Generate detailed statistics
    generate_statistics_report "$output_file"
    
    log_success "✅ Relatório gerado: $output_file"
}

generate_statistics_report() {
    local output_file="$1"
    
    local total_modules=0
    local total_md=0
    local total_mp3=0
    local total_wav=0
    
    cat >> "$output_file" << 'EOF'
### Por Módulo:

EOF
    
    get_all_module_mappings | while IFS='|' read -r old_name new_id new_title; do
        local old_path="src/modulos-treinamento/$old_name"
        
        if [[ -d "$old_path" ]]; then
            local md_count=$(find "$old_path" -name "*.md" 2>/dev/null | wc -l)
            local mp3_count=$(find "$old_path" -name "*.mp3" 2>/dev/null | wc -l)
            local wav_count=$(find "$old_path" -name "*.wav" 2>/dev/null | wc -l)
            
            echo "**$new_id:** $md_count MD, $mp3_count MP3, $wav_count WAV" >> "$output_file"
            
            total_modules=$((total_modules + 1))
            total_md=$((total_md + md_count))
            total_mp3=$((total_mp3 + mp3_count))
            total_wav=$((total_wav + wav_count))
        fi
    done
    
    cat >> "$output_file" << EOF

### Totais:
- **Módulos:** $total_modules
- **Arquivos MD:** $total_md
- **Arquivos MP3:** $total_mp3
- **Arquivos WAV:** $total_wav
EOF
}

# =============================================================================
# VALIDATION FUNCTIONS  
# =============================================================================

validate_module_mapping() {
    local errors=0
    
    log_info "🔍 Validando mapeamento de módulos..."
    
    # Check if all old modules have mappings
    local old_modules
    old_modules=$(get_old_modules)
    
    while read -r old_module; do
        if [[ -n "$old_module" ]]; then
            local old_name=$(basename "$old_module")
            local new_name=$(get_new_module_name "$old_name")
            
            if [[ "$new_name" == "$old_name" ]]; then
                log_warning "⚠️  Módulo sem mapeamento: $old_name"
                ((errors++))
            fi
        fi
    done <<< "$old_modules"
    
    # Check for duplicate mappings
    local new_names=()
    for old_name in "${!MODULE_MAPPING[@]}"; do
        new_names+=("${MODULE_MAPPING[$old_name]}")
    done
    
    local unique_names=($(printf '%s\n' "${new_names[@]}" | sort -u))
    
    if [[ ${#new_names[@]} -ne ${#unique_names[@]} ]]; then
        log_warning "⚠️  Mapeamentos duplicados detectados"
        ((errors++))
    fi
    
    if [[ $errors -eq 0 ]]; then
        log_success "✅ Mapeamento de módulos validado"
        return 0
    else
        log_error "❌ Mapeamento tem $errors problema(s)"
        return 1
    fi
}

# =============================================================================
# EXPORT FUNCTIONS
# =============================================================================

export -f get_new_module_name get_module_title get_old_modules
export -f map_audio_path map_content_path map_lesson_filename
export -f generate_mapping_report generate_statistics_report
export -f validate_module_mapping 