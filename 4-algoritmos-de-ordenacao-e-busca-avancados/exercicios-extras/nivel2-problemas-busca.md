# Nível 2: Problemas de Busca

## 🎯 Objetivo
Aplicar algoritmos de busca para resolver problemas práticos, desenvolvendo habilidade para implementar e otimizar diferentes técnicas de busca em texto.

## 📝 Problema 1: Sistema de Autocompletar

Implemente um sistema inteligente de autocompletar para uma barra de pesquisa:

```javascript
class AutocompleteSystem {
  constructor() {
    this.dictionary = [];
    this.frequencyMap = new Map();
  }
  
  // Adicionar palavras ao dicionário
  addWords(words) {
    // Processe e armazene as palavras
    
    // Sua implementação aqui
  }
  
  // Buscar sugestões para um prefixo
  getSuggestions(prefix, limit = 5) {
    // Use um algoritmo eficiente para encontrar palavras com o prefixo
    // Ordene por frequência
    
    // Sua implementação aqui
  }
  
  // Atualizar frequência quando uma palavra é selecionada
  onWordSelected(word) {
    // Aumente a frequência da palavra selecionada
    
    // Sua implementação aqui
  }
  
  // Busca fuzzy (tolerância a erros)
  getFuzzySuggestions(query, maxDistance = 2) {
    // Implemente busca com tolerância a erros de digitação
    
    // Sua implementação aqui
  }
}
```

**Desafios:**
1. Como implementar busca de prefixo eficientemente? (Trie? Binary Search?)
2. Como balancear frequência com relevância de prefixo?
3. Como implementar busca fuzzy eficientemente?

## 📝 Problema 2: Motor de Busca Simples

Crie um motor de busca que indexa e busca em documentos:

```javascript
class Document {
  constructor(id, title, content) {
    this.id = id;
    this.title = title;
    this.content = content;
  }
}

class SearchEngine {
  constructor() {
    this.documents = new Map();
    this.invertedIndex = new Map();
  }
  
  // Indexar documento
  indexDocument(document) {
    // Tokenize o documento
    // Crie índice invertido
    
    // Sua implementação aqui
  }
  
  // Buscar por termos
  search(query) {
    // Implemente busca usando KMP ou Boyer-Moore
    // Rankeie resultados por relevância
    
    // Sua implementação aqui
  }
  
  // Busca com operadores booleanos
  searchWithOperators(query) {
    // Exemplo: "programming AND java NOT python"
    
    // Sua implementação aqui
  }
  
  // Ranking TF-IDF
  rankByTFIDF(documents, query) {
    // Implemente algoritmo TF-IDF
    
    // Sua implementação aqui
  }
}
```

**Desafios:**
1. Como tokenizar texto eficientemente?
2. Qual algoritmo de busca é melhor para índices invertidos?
3. Como implementar ranking TF-IDF corretamente?

## 📝 Problema 3: Detector de Plágio

Implemente um sistema para detectar plágio em textos:

```javascript
class PlagiarismDetector {
  constructor(threshold = 80) {
    this.threshold = threshold; // Porcentagem de similaridade
    this.database = [];
  }
  
  // Adicionar documento à base
  addToDatabase(document) {
    // Armazene documento para comparação
    
    // Sua implementação aqui
  }
  
  // Detectar plágio
  detectPlagiarism(text) {
    // Compare com todos os documentos
    // Encontre trechos similares
    
    // Sua implementação aqui
  }
  
  // Comparar dois textos
  compareTexts(text1, text2) {
    // Use algoritmos de similaridade de texto
    // Retorne porcentagem de similaridade
    
    // Sua implementação aqui
  }
  
  // Encontrar partes copiadas
  findCopiedSections(originalText, suspectText) {
    // Identifique seções específicas que foram copiadas
    
    // Sua implementação aqui
  }
}
```

**Desafios:**
1. Como comparar textos eficientemente com Rabin-Karp?
2. Como determinar a porcentagem de similaridade?
3. Como identificar parafrasear vs cópia direta?

## 📝 Problema 4: Sistema de Matching de Padrões Genéticos

Trabalhe com sequências de DNA:

```javascript
class DNASequenceMatcher {
  constructor() {
    this.genome = "";
    this.patterns = [];
  }
  
  // Carregar sequência de DNA
  loadGenome(sequence) {
    // Carregue e valide sequência de DNA
    
    // Sua implementação aqui
  }
  
  // Encontrar sequência específica
  findSequence(pattern) {
    // Use Boyer-Moore ou KMP
    // DNA tem apenas 4 caracteres (A, T, G, C)
    
    // Sua implementação aqui
  }
  
  // Encontrar mutações
  findMutations(referenceSequence, testSequence) {
    // Compare duas sequências
    // Identifique pontos de mutação
    
    // Sua implementação aqui
  }
  
  // Buscar padrões aproximados
  findApproximatePattern(pattern, maxMismatches) {
    // Permita alguns erros na busca
    
    // Sua implementação aqui
  }
}
```

**Desafios:**
1. Como adaptar boyer-Moore para alfabeto pequeno (4 caracteres)?
2. Como detectar inserções e deleções?
3. Como implementar busca aproximada eficientemente?

## 📝 Problema 5: Sistema de Log Analysis

Analise logs de sistema para encontrar padrões:

```javascript
class LogAnalyzer {
  constructor() {
    this.logs = [];
    this.patterns = [];
  }
  
  // Carregar logs
  loadLogs(logFile) {
    // Leia e processe arquivo de log
    
    // Sua implementação aqui
  }
  
  // Encontrar padrões de erro
  findErrorPatterns() {
    // Identifique padrões comuns de erro
    
    // Sua implementação aqui
  }
  
  // Detectar anomalias
  detectAnomalies() {
    // Encontre logs incomuns
    
    // Sua implementação aqui
  }
  
  // Correlacionar eventos
  correlateEvents(pattern, timeWindow) {
    // Encontre eventos relacionados dentro de uma janela de tempo
    
    // Sua implementação aqui
  }
}
```

**Desafios:**
1. Como buscar eficientemente em logs de múltiplas linhas?
2. Como detectar padrões recorrentes?
3. Como correlacionar eventos em grandes volumes de dados?

## 📝 Problema 6: Sistema de Sugestão de Correção

Implemente um corretor ortográfico:

```javascript
class SpellChecker {
  constructor() {
    this.dictionary = new Set();
    this.trie = null;
  }
  
  // Carregar dicionário
  loadDictionary(words) {
    // Carregue palavras do dicionário
    
    // Sua implementação aqui
  }
  
  // Verificar palavra
  checkWord(word) {
    // Verifique se palavra existe
    
    // Sua implementação aqui
  }
  
  // Sugerir correções
  suggest(word, maxSuggestions = 5) {
    // Encontre palavras similares
    // Use distância de edição
    
    // Sua implementação aqui
  }
  
  // Calcular distância de Levenshtein
  levenshteinDistance(word1, word2) {
    // Implemente algoritmo de distância de edição
    
    // Sua implementação aqui
  }
}
```

**Desafios:**
1. Como implementar distância de edição eficientemente?
2. Como limitar sugestões a palavras mais prováveis?
3. Como lidar com diferentes idiomas e regras gramaticais?

## 📝 Problema 7: Sistema de Busca com Highlighting

Crie um sistema que destaca termos encontrados:

```javascript
class SearchHighlighter {
  constructor() {
    this.content = "";
  }
  
  // Buscar e destacar
  searchAndHighlight(pattern, options = {}) {
    // options: caseSensitive, wholeWord, maxResults
    
    // Sua implementação aqui
  }
  
  // Contextualizar resultados
  getContext(position, contextSize = 50) {
    // Retorne texto ao redor da posição encontrada
    
    // Sua implementação aqui
  }
  
  // Contagem de ocorrências
  countOccurrences(pattern) {
    // Conte todas as ocorrências
    
    // Sua implementação aqui
  }
  
  // Substituir padrões
  replacePattern(pattern, replacement) {
    // Substitua todas as ocorrências
    
    // Sua implementação aqui
  }
}
```

**Desafios:**
1. Como implementar case-insensitive search?
2. Como detectar word boundaries?
3. Como performance varia com tamanho do texto?

## 📝 Problema 8: Sistema de Busca em Tempo Real

Implemente busca em streaming de dados:

```javascript
class RealtimeSearch {
  constructor() {
    this.buffer = "";
    this.patterns = new Map();
  }
  
  // Adicionar padrão para buscar
  addPattern(pattern, callback) {
    // Registre padrão para busca
    
    // Sua implementação aqui
  }
  
  // Processar novo chunk de dados
  processChunk(chunk) {
    // Processe novo chunk
    // Verifique padrões
    // Notifique callbacks
    
    // Sua implementação aqui
  }
  
  // Gerenciar buffer circular
  manageBuffer(data) {
    // Mantenha buffer para padrões que cruzam chunks
    
    // Sua implementação aqui
  }
  
  // Limpar padrões antigos
  clearPattern(pattern) {
    // Remova padrão da busca
    
    // Sua implementação aqui
  }
}
```

**Desafios:**
1. Como lidar com padrões que atravessam chunks?
2. Como otimizar múltiplas buscas simultaneamente?
3. Como gerenciar memória em streaming infinito?

## 🎯 Desafio Integrado: Sistema de Análise de Texto Completo

Combine múltiplos conceitos em um sistema integrado:

```javascript
class TextAnalysisSystem {
  constructor() {
    this.searchEngine = new SearchEngine();
    this.autoComplete = new AutocompleteSystem();
    this.spellChecker = new SpellChecker();
    this.plagiarismDetector = new PlagiarismDetector();
  }
  
  // Processar documento completo
  processDocument(document) {
    // Indexe no motor de busca
    // Adicione palavras ao autocompletar
    // Verifique ortografia
    // Detecte plágio
    
    // Sua implementação aqui
  }
  
  // Análise completa de texto
  analyzeText(text) {
    // Combine todas as funcionalidades
    
    // Sua implementação aqui
  }
  
  // Gerar relatório
  generateReport() {
    // Crie um relatório detalhado de análise
    
    // Sua implementação aqui
  }
}
```

**Desafios:**
1. Como integrar múltiplos sistemas de busca?
2. Como otimizar para processar o mesmo texto múltiplas vezes?
3. Como apresentar resultados de forma clara e útil?

## ✅ Checklist de Resolução

Para cada problema, verifique:
- [ ] Algoritmo de busca escolhido é apropriado
- [ ] Complexidade temporal é otimizada
- [ ] Edge cases são tratados
- [ ] Testes com diferentes tamanhos de entrada
- [ ] Comparação com algoritmos alternativos
- [ ] Documentação clara do código

## 🔍 Testes de Performance

Use estes datasets para testar suas implementações:

```javascript
// Datasets de teste
const testData = {
  short: "quick brown fox jumps over lazy dog",
  medium: generateRandomText(1000),
  long: generateRandomText(100000),
  withDuplicates: "word word word different word word",
  dna: "ATCGATCGTAGCTAGCTAGCTA",
  code: "function example() { return true; }"
};

// Medidas de performance
function measurePerformance(algorithm, dataset) {
  const start = performance.now();
  const result = algorithm(dataset);
  const end = performance.now();
  
  return {
    time: end - start,
    memory: process.memoryUsage().heapUsed,
    result: result
  };
}
```