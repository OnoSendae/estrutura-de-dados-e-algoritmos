# Soluções para Exercícios do Módulo 4

Este diretório contém implementações completas e detalhadas para os exercícios práticos do Módulo 4 sobre Algoritmos de Ordenação e Busca.

## Estrutura das Soluções

Cada arquivo contém:
- Implementação completa das classes e algoritmos solicitados
- Documentação detalhada com comentários explicativos
- Funções de demonstração que mostram o funcionamento
- Visualizações quando aplicável

## Exercícios Implementados

### 1. Sistema de Ranking (`exercicio1-sistema-ranking.js`)

Implementação de um sistema de ranking para jogadores com:
- Ordenação por múltiplos critérios usando Merge Sort estável
- Busca eficiente de posição de jogadores
- Obtenção dos top K jogadores
- Visualização formatada do ranking

**Recursos:**
- Merge Sort personalizado para ordenação estável
- Suporte a múltiplos critérios de ordenação
- Cálculo automático de win rate

### 2. Ordenação Externa de Logs (`exercicio2-ordenacao-externa.js`)

Implementação de um sistema de ordenação externa para grandes arquivos de log:
- Divisão do arquivo em chunks gerenciáveis
- Ordenação eficiente de cada chunk
- K-way merge usando min-heap
- Suporte a diferentes formatos de timestamp

**Recursos:**
- Min-Heap otimizada para k-way merge
- Seleção inteligente de algoritmo baseada nos dados
- Simulação de restrições de memória

### 3. Ordenação de Strings Complexas (`exercicio3-ordenacao-strings.js`)

Implementação de sistema de ordenação para strings complexas:
- Natural sort para strings alfanuméricas 
- Ordenação com suporte a locale/internacionalização
- Ordenação baseada em similaridade/distância

**Recursos:**
- Tokenização de strings para natural sort
- Uso de `Intl.Collator` para ordenação correta por locale
- Implementação da distância de Levenshtein
- Versão otimizada de memória para cálculo de distância

### 4. Sistema de Busca Autocompletar (`exercicio4-autocomplete.js`)

Implementação de um sistema de autocompletar eficiente:
- Estrutura de dados Trie para busca por prefixo
- Gerenciamento de frequência para sugestões relevantes
- Visualização da estrutura interna

**Recursos:**
- Implementação completa de Trie
- Suporte a atualização de frequências
- Ordenação de sugestões por frequência
- Visualização da estrutura

## Como Executar

Cada arquivo contém uma função de demonstração que pode ser descomentada para executar:

```javascript
// Executar a demonstração
// demonstrateRanking();
```

Basta remover o comentário da linha que contém a chamada da função de demonstração e executar o arquivo.

## Complexidade de Tempo e Espaço

### Sistema de Ranking
- Ordenação: O(n log n) utilizando Merge Sort estável
- Busca: O(n) para encontrar posição de um jogador
- Espaço: O(n) para armazenamento da cópia durante o merge

### Ordenação Externa
- Complexidade total: O(n log n) onde n é o total de logs
- Complexidade de k-way merge: O(n log k) onde k é o número de chunks
- Espaço: O(m + k) onde m é o tamanho máximo de um chunk e k é o número de chunks

### Ordenação de Strings
- Natural sort: O(n log n) para n strings
- Cálculo de distância de Levenshtein: O(m*n) onde m e n são os comprimentos das strings
- Versão otimizada: O(min(m,n)) de espaço em vez de O(m*n)

### Sistema de Autocompletar
- Inserção: O(m) onde m é o comprimento da palavra
- Busca: O(p + r) onde p é o comprimento do prefixo e r é o número de resultados
- Espaço: O(ALPHABET_SIZE * n * m) onde n é o número de palavras e m é o comprimento médio

## Visualizações

Para visualizações detalhadas dos algoritmos, consulte o arquivo `visualizacoes.md` que contém diagramas ASCII mostrando o funcionamento interno dos algoritmos. 