#!/bin/bash

# =============================================================================
# FASE 3: CRIAÇÃO DA NOVA ESTRUTURA
# Cria a nova estrutura de diretórios padronizada e organizada
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
        log_warning "🔍 MODO DRY-RUN: Simulando criação sem fazer alterações"
    fi
    
    log_info "🏗️ INICIANDO FASE 3: Criação da Nova Estrutura"
    
    # Execute structure creation steps
    create_base_directories "$dry_run"
    create_module_directories "$dry_run"
    create_asset_directories "$dry_run"
    create_script_directories "$dry_run"
    create_template_files "$dry_run"
    create_documentation_structure "$dry_run"
    validate_new_structure_creation "$dry_run"
    
    log_success "✅ FASE 3 CONCLUÍDA: Nova estrutura criada"
}

# =============================================================================
# BASE STRUCTURE CREATION
# =============================================================================

create_base_directories() {
    local dry_run=$1
    
    log_info "📁 Criando diretórios base da nova estrutura..."
    
    local base_dirs=(
        "modules"
        "assets"
        "scripts"
        "docs"
        "_backup"
        "_temp"
    )
    
    local count=0
    local total=${#base_dirs[@]}
    
    for dir in "${base_dirs[@]}"; do
        local full_path="$PROJECT_ROOT/$dir"
        
        if safe_mkdir "$full_path" "$dry_run"; then
            ((count++))
            show_progress "$count" "$total" "Criando estrutura base"
        else
            log_error "❌ Falha ao criar diretório base: $dir"
            return 1
        fi
    done
    
    log_success "✅ Diretórios base criados ($count/$total)"
}

create_module_directories() {
    local dry_run=$1
    
    log_info "📚 Criando estrutura de módulos padronizada..."
    
    # Get module mapping
    local old_modules
    old_modules=$(get_old_modules)
    
    if [[ $? -ne 0 ]]; then
        log_error "❌ Falha ao obter lista de módulos antigos"
        return 1
    fi
    
    local module_count=0
    local total_modules=$(echo "$old_modules" | wc -l)
    
    while read -r old_module_dir; do
        if [[ -n "$old_module_dir" && -d "$old_module_dir" ]]; then
            local old_module_name=$(basename "$old_module_dir")
            local new_module_name=$(get_new_module_name "$old_module_name")
            
            ((module_count++))
            show_progress "$module_count" "$total_modules" "Criando módulos"
            
            create_single_module_structure "$new_module_name" "$dry_run"
        fi
    done <<< "$old_modules"
    
    log_success "✅ Estrutura de módulos criada ($module_count módulos)"
}

create_single_module_structure() {
    local module_name=$1
    local dry_run=$2
    
    log_debug "📁 Criando módulo: $module_name"
    
    local module_base="$PROJECT_ROOT/modules/$module_name"
    
    # Create main module directory
    safe_mkdir "$module_base" "$dry_run"
    
    # Create module subdirectories
    local module_subdirs=(
        "lessons"
        "exercises" 
        "examples"
        "resources"
        "assets"
    )
    
    for subdir in "${module_subdirs[@]}"; do
        safe_mkdir "$module_base/$subdir" "$dry_run"
    done
    
    # Create module README template
    create_module_readme_template "$module_base" "$module_name" "$dry_run"
}

create_module_readme_template() {
    local module_dir=$1
    local module_name=$2
    local dry_run=$3
    
    local readme_file="$module_dir/README.md"
    local module_title=$(get_module_title "$module_name" "pt")
    
    if [[ "$dry_run" == false ]]; then
        cat > "$readme_file" << EOF
# $module_title

## Visão Geral

Este módulo aborda...

## Objetivos de Aprendizagem

Ao completar este módulo, você será capaz de:

- [ ] Objetivo 1
- [ ] Objetivo 2
- [ ] Objetivo 3

## Estrutura do Módulo

### Lições
- **lessons/**: Conteúdo principal das lições
- **exercises/**: Exercícios práticos
- **examples/**: Exemplos de código
- **resources/**: Recursos adicionais

### Pré-requisitos

- Módulo anterior concluído
- Conceitos fundamentais

### Tempo Estimado

X horas

## Recursos

### Lições
<!-- Lista de lições será preenchida automaticamente -->

### Exercícios
<!-- Lista de exercícios será preenchida automaticamente -->

### Exemplos
<!-- Lista de exemplos será preenchida automaticamente -->

## Próximos Passos

Após completar este módulo, continue para...

---

*Este módulo faz parte do curso **Estrutura de Dados e Algoritmos***
EOF
        log_debug "✅ README criado para: $module_name"
    fi
}

# =============================================================================
# ASSET STRUCTURE CREATION
# =============================================================================

create_asset_directories() {
    local dry_run=$1
    
    log_info "🎵 Criando estrutura de assets..."
    
    # Create main asset categories
    local asset_dirs=(
        "assets/audio"
        "assets/images"
        "assets/documents"
        "assets/downloads"
        "assets/shared"
    )
    
    for dir in "${asset_dirs[@]}"; do
        safe_mkdir "$PROJECT_ROOT/$dir" "$dry_run"
    done
    
    # Create audio subdirectories for each module
    create_audio_structure "$dry_run"
    
    # Create shared asset directories
    create_shared_asset_structure "$dry_run"
    
    log_success "✅ Estrutura de assets criada"
}

create_audio_structure() {
    local dry_run=$1
    
    log_info "🎧 Criando estrutura de áudio por módulo..."
    
    local old_modules
    old_modules=$(get_old_modules)
    
    while read -r old_module_dir; do
        if [[ -n "$old_module_dir" && -d "$old_module_dir" ]]; then
            local old_module_name=$(basename "$old_module_dir")
            local new_module_name=$(get_new_module_name "$old_module_name")
            
            # Create audio directory for this module
            safe_mkdir "$PROJECT_ROOT/assets/audio/$new_module_name" "$dry_run"
        fi
    done <<< "$old_modules"
}

create_shared_asset_structure() {
    local dry_run=$1
    
    log_info "🗂️ Criando estrutura de assets compartilhados..."
    
    local shared_dirs=(
        "assets/shared/icons"
        "assets/shared/logos"
        "assets/shared/templates"
        "assets/shared/styles"
    )
    
    for dir in "${shared_dirs[@]}"; do
        safe_mkdir "$PROJECT_ROOT/$dir" "$dry_run"
    done
    
    # Create .gitkeep files to preserve empty directories
    if [[ "$dry_run" == false ]]; then
        for dir in "${shared_dirs[@]}"; do
            touch "$PROJECT_ROOT/$dir/.gitkeep"
        done
    fi
}

# =============================================================================
# SCRIPT STRUCTURE CREATION
# =============================================================================

create_script_directories() {
    local dry_run=$1
    
    log_info "📜 Criando estrutura de scripts..."
    
    local script_dirs=(
        "scripts/generators"
        "scripts/validators"
        "scripts/converters"
        "scripts/maintenance"
        "scripts/deployment"
    )
    
    for dir in "${script_dirs[@]}"; do
        safe_mkdir "$PROJECT_ROOT/$dir" "$dry_run"
    done
    
    # Create script templates
    create_script_templates "$dry_run"
    
    log_success "✅ Estrutura de scripts criada"
}

create_script_templates() {
    local dry_run=$1
    
    if [[ "$dry_run" == false ]]; then
        # Create module generator template
        create_module_generator_template
        
        # Create content validator template
        create_content_validator_template
        
        # Create audio converter template
        create_audio_converter_template
    fi
}

create_module_generator_template() {
    local generator_file="$PROJECT_ROOT/scripts/generators/new-module.sh"
    
    cat > "$generator_file" << 'EOF'
#!/bin/bash

# =============================================================================
# MODULE GENERATOR - Cria novo módulo com estrutura padrão
# Usage: ./new-module.sh <module-id> <module-title>
# =============================================================================

set -euo pipefail

if [[ $# -lt 2 ]]; then
    echo "Usage: $0 <module-id> <module-title>"
    echo "Example: $0 13-advanced-algorithms 'Advanced Algorithms'"
    exit 1
fi

MODULE_ID=$1
MODULE_TITLE=$2
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

echo "Creating new module: $MODULE_ID"

# Create module structure
mkdir -p "$PROJECT_ROOT/modules/$MODULE_ID"/{lessons,exercises,examples,resources,assets}

# Create audio directory
mkdir -p "$PROJECT_ROOT/assets/audio/$MODULE_ID"

# Create README
# (Template content would go here)

echo "✅ Module $MODULE_ID created successfully"
EOF
    
    chmod +x "$generator_file"
    log_debug "✅ Gerador de módulos criado"
}

create_content_validator_template() {
    local validator_file="$PROJECT_ROOT/scripts/validators/validate-content.sh"
    
    cat > "$validator_file" << 'EOF'
#!/bin/bash

# =============================================================================
# CONTENT VALIDATOR - Valida conteúdo dos módulos
# =============================================================================

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

echo "🔍 Validating module content..."

# Validation logic would go here

echo "✅ Content validation completed"
EOF
    
    chmod +x "$validator_file"
    log_debug "✅ Validador de conteúdo criado"
}

create_audio_converter_template() {
    local converter_file="$PROJECT_ROOT/scripts/converters/convert-audio.sh"
    
    cat > "$converter_file" << 'EOF'
#!/bin/bash

# =============================================================================
# AUDIO CONVERTER - Converte e otimiza arquivos de áudio
# =============================================================================

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

echo "🎵 Audio conversion tools..."

# Conversion logic would go here

echo "✅ Audio processing completed"
EOF
    
    chmod +x "$converter_file"
    log_debug "✅ Conversor de áudio criado"
}

# =============================================================================
# TEMPLATE FILES CREATION
# =============================================================================

create_template_files() {
    local dry_run=$1
    
    log_info "📄 Criando arquivos template..."
    
    if [[ "$dry_run" == false ]]; then
        create_lesson_template
        create_exercise_template
        create_example_template
        create_gitignore_updates
    else
        log_info "DRY-RUN: Criação de templates"
    fi
    
    log_success "✅ Templates criados"
}

create_lesson_template() {
    local template_file="$PROJECT_ROOT/assets/shared/templates/lesson-template.md"
    
    safe_mkdir "$(dirname "$template_file")"
    
    cat > "$template_file" << 'EOF'
# [Número] - [Título da Lição]

## 🎯 Objetivos

Ao final desta lição, você será capaz de:

- [ ] Objetivo específico 1
- [ ] Objetivo específico 2
- [ ] Objetivo específico 3

## 📚 Conteúdo

### Introdução

[Introdução ao tópico]

### Conceitos Principais

#### Conceito 1

[Explicação detalhada]

```javascript
// Exemplo de código
function example() {
    return "Hello World";
}
```

#### Conceito 2

[Explicação detalhada]

### Aplicações Práticas

[Exemplos do mundo real]

## 🔗 Recursos Adicionais

- [Link 1](url)
- [Link 2](url)

## ✅ Checkpoint

- [ ] Entendi o conceito principal
- [ ] Consegui executar os exemplos
- [ ] Estou pronto para os exercícios

---

**Próxima lição:** [Link para próxima lição]
EOF
    
    log_debug "✅ Template de lição criado"
}

create_exercise_template() {
    local template_file="$PROJECT_ROOT/assets/shared/templates/exercise-template.md"
    
    cat > "$template_file" << 'EOF'
# Exercício [Número]: [Título]

## 📋 Descrição

[Descrição clara do que deve ser implementado]

## 🎯 Objetivos

- [ ] Objetivo 1
- [ ] Objetivo 2

## 📥 Input

[Descrição dos dados de entrada]

## 📤 Output

[Descrição da saída esperada]

## 💡 Dicas

- Dica 1
- Dica 2

## 🧪 Exemplos

### Exemplo 1

**Input:**
```
[input example]
```

**Output:**
```
[output example]
```

### Exemplo 2

**Input:**
```
[input example]
```

**Output:**
```
[output example]
```

## ⚡ Desafio Extra

[Versão mais avançada do exercício]

## 📊 Análise de Complexidade

- **Tempo:** O(?)
- **Espaço:** O(?)

---

**Solução:** [Link para solução, se disponível]
EOF
    
    log_debug "✅ Template de exercício criado"
}

create_example_template() {
    local template_file="$PROJECT_ROOT/assets/shared/templates/example-template.md"
    
    cat > "$template_file" << 'EOF'
# Exemplo: [Título]

## 📝 Descrição

[Breve descrição do exemplo]

## 🏗️ Implementação

```javascript
// [Nome do arquivo]: example.js

/**
 * [Descrição da função]
 * @param {type} param - Descrição do parâmetro
 * @returns {type} Descrição do retorno
 */
function exampleFunction(param) {
    // Implementação
}

// Exemplo de uso
const result = exampleFunction("test");
console.log(result);
```

## 🚀 Como Executar

```bash
node example.js
```

## 📊 Análise

- **Complexidade de Tempo:** O(?)
- **Complexidade de Espaço:** O(?)

## 🔍 Pontos Importantes

- Ponto 1
- Ponto 2

## 🔗 Relacionado

- [Conceito relacionado](link)
- [Exercício relacionado](link)
EOF
    
    log_debug "✅ Template de exemplo criado"
}

create_gitignore_updates() {
    local gitignore_file="$PROJECT_ROOT/.gitignore"
    
    # Add new entries to .gitignore if they don't exist
    local new_entries=(
        ""
        "# Migration and backup files"
        "_backup/"
        "_temp/"
        "*.backup"
        "*.tmp"
        ""
        "# Audio processing temp files"
        "*.wav.tmp"
        "*.mp3.tmp"
        ""
        "# Generated documentation"
        "/docs/generated/"
    )
    
    if [[ -f "$gitignore_file" ]]; then
        for entry in "${new_entries[@]}"; do
            if ! grep -Fxq "$entry" "$gitignore_file" 2>/dev/null; then
                echo "$entry" >> "$gitignore_file"
            fi
        done
    else
        printf '%s\n' "${new_entries[@]}" > "$gitignore_file"
    fi
    
    log_debug "✅ .gitignore atualizado"
}

# =============================================================================
# DOCUMENTATION STRUCTURE
# =============================================================================

create_documentation_structure() {
    local dry_run=$1
    
    log_info "📖 Criando estrutura de documentação..."
    
    local doc_dirs=(
        "docs/guides"
        "docs/api"
        "docs/migration"
        "docs/development"
    )
    
    for dir in "${doc_dirs[@]}"; do
        safe_mkdir "$PROJECT_ROOT/$dir" "$dry_run"
    done
    
    if [[ "$dry_run" == false ]]; then
        create_documentation_index
        create_migration_docs
    fi
    
    log_success "✅ Estrutura de documentação criada"
}

create_documentation_index() {
    local doc_index="$PROJECT_ROOT/docs/README.md"
    
    cat > "$doc_index" << 'EOF'
# Documentação - Estrutura de Dados e Algoritmos

## 📚 Guides

- [Getting Started](guides/getting-started.md)
- [Module Structure](guides/module-structure.md)
- [Content Guidelines](guides/content-guidelines.md)

## 🔄 Migration

- [Migration Process](migration/migration-process.md)
- [Rollback Guide](migration/rollback-guide.md)

## 👨‍💻 Development

- [Development Setup](development/setup.md)
- [Contributing](development/contributing.md)
- [Coding Standards](development/coding-standards.md)

## 🚀 Deployment

- [Jekyll Setup](deployment/jekyll.md)
- [GitHub Pages](deployment/github-pages.md)
EOF
    
    log_debug "✅ Índice de documentação criado"
}

create_migration_docs() {
    local migration_doc="$PROJECT_ROOT/docs/migration/migration-process.md"
    
    safe_mkdir "$(dirname "$migration_doc")"
    
    cat > "$migration_doc" << 'EOF'
# Processo de Migração

## Visão Geral

Este documento descreve o processo de migração da estrutura antiga para a nova estrutura padronizada.

## Fases da Migração

### Fase 1: Análise
- Mapeamento da estrutura atual
- Identificação de problemas
- Geração de relatórios

### Fase 2: Backup
- Backup completo do projeto
- Backup seletivo por categoria
- Verificação de integridade

### Fase 3: Criação da Estrutura
- Criação de diretórios padronizados
- Templates de arquivos
- Estrutura de documentação

### Fase 4: Migração de Conteúdo
- Movimentação de arquivos .md
- Padronização de nomenclatura
- Organização por subdiretórios

### Fase 5: Migração de Mídia
- Centralização de arquivos de áudio
- Organização por módulo
- Otimização de formatos

### Fase 6: Atualização de Configurações
- Novo arquivo modules.yml
- Atualização do _config.yml
- Ajustes no frontend

### Fase 7: Validação
- Verificação de integridade
- Testes de funcionalidade
- Relatório final

## Rollback

Em caso de problemas, utilize:

```bash
scripts/migration/migrate.sh --rollback=BACKUP_ID
```

## Suporte

Para questões sobre a migração, consulte os logs em `_backup/`.
EOF
    
    log_debug "✅ Documentação de migração criada"
}

# =============================================================================
# VALIDATION
# =============================================================================

validate_new_structure_creation() {
    local dry_run=$1
    
    log_info "🔍 Validando criação da nova estrutura..."
    
    if [[ "$dry_run" == false ]]; then
        local errors=0
        
        # Check essential directories
        local required_dirs=(
            "modules"
            "assets/audio"
            "assets/images"
            "scripts/generators"
            "docs"
        )
        
        for dir in "${required_dirs[@]}"; do
            if [[ ! -d "$PROJECT_ROOT/$dir" ]]; then
                log_error "❌ Diretório obrigatório não foi criado: $dir"
                ((errors++))
            fi
        done
        
        # Check module directories
        local old_modules
        old_modules=$(get_old_modules)
        
        while read -r old_module_dir; do
            if [[ -n "$old_module_dir" && -d "$old_module_dir" ]]; then
                local old_module_name=$(basename "$old_module_dir")
                local new_module_name=$(get_new_module_name "$old_module_name")
                local module_path="$PROJECT_ROOT/modules/$new_module_name"
                
                if [[ ! -d "$module_path" ]]; then
                    log_error "❌ Módulo não foi criado: $new_module_name"
                    ((errors++))
                fi
            fi
        done <<< "$old_modules"
        
        if [[ $errors -eq 0 ]]; then
            log_success "✅ Nova estrutura validada com sucesso"
            return 0
        else
            log_error "❌ Nova estrutura tem $errors erro(s)"
            return 1
        fi
    else
        log_info "DRY-RUN: Validação da nova estrutura"
        return 0
    fi
}

# =============================================================================
# SCRIPT EXECUTION
# =============================================================================

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi 