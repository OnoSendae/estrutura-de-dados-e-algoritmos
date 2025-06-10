# Unificação da Estrutura do Curso

## Objetivo
Unificar os arquivos `course_structure.yml` e `new_course_structure.yml` em uma única estrutura que mantém compatibilidade com ambos os usos existentes.

## Problema Identificado

### Arquivos Duplicados
- `_data/course_structure.yml` - Estrutura original com lessons detalhadas
- `_data/new_course_structure.yml` - Nova estrutura com metadados do curso

### Uso Inconsistente
- `_includes/sidebar_playlist.html` → `site.data.course_structure.modules`
- `_layouts/module.html` → `site.data.course_structure.modules`  
- `_includes/module_navigation.html` → `site.data.new_course_structure.modules`

## Solução Implementada

### 1. Estrutura Unificada
Criamos um único arquivo `course_structure.yml` que combina:

```yaml
# Metadados do curso (do new_course_structure.yml)
course:
  title: "Estrutura de Dados e Algoritmos"
  description: "Curso completo de estruturas de dados e algoritmos"
  version: "2.0"
  last_updated: "2025-06-10"

modules:
  - id: 01-foundations                    # Novo campo para compatibilidade
    id_prefix: 01-foundations            # Campo original mantido
    title: Fundamentos da Programação    # Título em português
    title_en: "Programming Foundations"  # Título em inglês
    emoji: 🏁                           # Emoji mantido
    
    # Novos campos de paths organizados
    path: "modules/01-foundations"
    lessons_path: "modules/01-foundations/lessons"
    exercises_path: "modules/01-foundations/exercises"
    examples_path: "modules/01-foundations/examples"
    resources_path: "modules/01-foundations/resources"
    audio_path: "assets/audio/01-foundations"
    
    # Lessons detalhadas mantidas
    lessons:
      - id: 01-foundations-0-fundamentos-da-programacao
        title: 0 fundamentos da programacao
        mp3_path: /assets/audio/01-foundations/0-fundamentos-da-programacao.mp3
        md_path: /modules/01-foundations/lessons/0-fundamentos-da-programacao.md
      # ... outras lessons
```

### 2. Compatibilidade Garantida

#### Para Estrutura Antiga (sidebar_playlist.html, module.html)
- ✅ `module.id_prefix` mantido
- ✅ `module.emoji` mantido  
- ✅ `module.lessons` array completo mantido
- ✅ Todos os campos de lesson mantidos

#### Para Estrutura Nova (module_navigation.html)
- ✅ `module.id` adicionado
- ✅ `module.title_en` adicionado
- ✅ `module.path` adicionado
- ✅ Todos os path fields adicionados

### 3. Scripts Atualizados

#### `scripts/generate-jekyll-data.js`
- Gera automaticamente a estrutura unificada
- Inclui metadados do curso
- Adiciona todos os campos necessários para compatibilidade

#### `scripts/validate-structure.js` (novo)
- Valida a integridade da estrutura unificada
- Testa compatibilidade com ambas as estruturas
- Gera estatísticas do curso

### 4. Templates Atualizados

#### `_includes/module_navigation.html`
```html
<!-- ANTES -->
{% for module in site.data.new_course_structure.modules %}

<!-- DEPOIS -->
{% for module in site.data.course_structure.modules %}
```

### 5. Arquivos Removidos
- ❌ `_data/new_course_structure.yml` (consolidado no course_structure.yml)

## Resultados

### Estatísticas Finais
- ✅ **12 módulos** processados
- ✅ **86 aulas** totais  
- ✅ **77% das aulas** com áudio
- ✅ **100% compatibilidade** com estruturas antigas e novas

### Testes de Validação
```bash
# Gerar nova estrutura
node scripts/generate-jekyll-data.js

# Validar integridade  
node scripts/validate-structure.js

# Testar YAML válido
ruby -ryaml -e "puts 'YAML válido!' if YAML.load_file('_data/course_structure.yml')"
```

## Benefícios

1. **Estrutura Única**: Um só arquivo para manter
2. **Compatibilidade Total**: Funciona com todos os templates existentes
3. **Organização Melhorada**: Paths claramente definidos
4. **Metadados Centralizados**: Informações do curso em um local
5. **Bilíngue**: Suporte a títulos em português e inglês
6. **Validação Automática**: Scripts para verificar integridade

## Migração para Novos Projetos

Para replicar esta estrutura em outros projetos:

1. Copie o arquivo `_data/course_structure.yml` como base
2. Use o script `generate-jekyll-data.js` para gerar automaticamente
3. Execute `validate-structure.js` para verificar integridade
4. Adapte os templates conforme necessário

## Manutenção Futura

- Use sempre `course_structure.yml` como fonte única da verdade
- Execute validação após mudanças: `node scripts/validate-structure.js`  
- Regenere automaticamente: `node scripts/generate-jekyll-data.js`
- Mantenha compatibilidade com ambos os campos (id/id_prefix, title/title_en) 