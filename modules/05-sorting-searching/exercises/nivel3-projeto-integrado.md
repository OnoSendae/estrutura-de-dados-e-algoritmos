# Nível 3: Projeto Integrado - Sistema de Análise de Dados

## 🎯 Objetivo
Desenvolver um sistema completo que combine todos os algoritmos estudados para processar e analisar grandes volumes de dados em tempo real.

## 📋 Visão Geral do Projeto

Você criará um sistema que:
1. Indexa grandes volumes de dados eficientemente
2. Processa queries complexas em tempo real
3. Gera relatórios e visualizações
4. Adapta-se dinamicamente aos dados

## 🛠️ Arquitetura do Sistema

```javascript
class DataAnalysisSystem {
  constructor() {
    this.dataStore = new DataStore();
    this.queryProcessor = new QueryProcessor();
    this.indexManager = new IndexManager();
    this.sortEngine = new AdaptiveSortEngine();
    this.searchEngine = new PatternSearchEngine();
    this.analyzer = new DataAnalyzer();
  }
  
  // Pipeline principal
  async processData(inputData, query) {
    // 1. Indexação inicial
    const indexed = await this.indexManager.index(inputData);
    
    // 2. Processamento da query
    const filtered = await this.queryProcessor.process(query, indexed);
    
    // 3. Análise e agregação
    const analyzed = await this.analyzer.analyze(filtered);
    
    // 4. Geração de resultados
    return this.generateResults(analyzed);
  }
}
```

## 📝 Parte 1: Sistema de Indexação

Implemente um sistema multi-index eficiente:

```javascript
class IndexManager {
  constructor() {
    this.indexes = {
      primary: new PrimaryIndex(),
      secondary: new Map(),
      fullText: new TextIndex(),
      numeric: new NumericIndex()
    };
  }
  
  // Adicionar documento ao índice
  async addDocument(document) {
    // 1. Indexar campos principais
    this.indexes.primary.add(document.id, document);
    
    // 2. Indexar campos secundários
    for (let [key, value] of Object.entries(document)) {
      if (key !== 'id') {
        this.indexSecondaryField(key, value, document.id);
      }
    }
    
    // 3. Indexar texto completo
    if (document.content) {
      this.indexes.fullText.add(document.id, document.content);
    }
    
    // 4. Indexar campos numéricos
    this.indexNumericFields(document);
  }
  
  // Busca multi-índice
  search(query) {
    const results = new Set();
    
    // Use diferentes índices baseado na query
    if (query.text) {
      const textResults = this.indexes.fullText.search(query.text);
      textResults.forEach(id => results.add(id));
    }
    
    if (query.range) {
      const rangeResults = this.indexes.numeric.rangeQuery(query.range);
      rangeResults.forEach(id => results.add(id));
    }
    
    // Sua implementação para outros tipos de query
    
    return Array.from(results);
  }
}

// Índice de texto completo
class TextIndex {
  constructor() {
    this.invertedIndex = new Map();
    this.documentStats = new Map();
  }
  
  // Adicionar documento
  add(docId, content) {
    const tokens = this.tokenize(content);
    
    tokens.forEach(token => {
      if (!this.invertedIndex.has(token)) {
        this.invertedIndex.set(token, new Set());
      }
      this.invertedIndex.get(token).add(docId);
    });
    
    this.documentStats.set(docId, {
      tokenCount: tokens.length,
      uniqueTokens: new Set(tokens).size
    });
  }
  
  // Busca por texto
  search(query) {
    const tokens = this.tokenize(query);
    const results = new Map(); // docId -> score
    
    tokens.forEach(token => {
      if (this.invertedIndex.has(token)) {
        const docs = this.invertedIndex.get(token);
        docs.forEach(docId => {
          if (!results.has(docId)) {
            results.set(docId, 0);
          }
          // TF-IDF scoring
          const score = this.calculateTFIDF(token, docId);
          results.set(docId, results.get(docId) + score);
        });
      }
    });
    
    // Ordenar resultados por score
    return this.rankResults(results);
  }
  
  // Tokenização
  tokenize(text) {
    // Implementar tokenização eficiente
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(token => token.length > 2);
  }
}
```

## 📝 Parte 2: Motor de Ordenação Adaptativa

Implemente um engine que escolhe o melhor algoritmo:

```javascript
class AdaptiveSortEngine {
  constructor() {
    this.algorithms = new Map();
    this.setupAlgorithms();
    this.statistics = new Map();
  }
  
  setupAlgorithms() {
    this.algorithms.set('quickSort', {
      impl: this.quickSort,
      bestFor: ['random', 'general'],
      complexity: 'O(n log n)'
    });
    
    this.algorithms.set('mergeSort', {
      impl: this.mergeSort,
      bestFor: ['stability_required', 'large'],
      complexity: 'O(n log n)'
    });
    
    this.algorithms.set('radixSort', {
      impl: this.radixSort,
      bestFor: ['integers', 'strings'],
      complexity: 'O(nk)'
    });
    
    this.algorithms.set('bucketSort', {
      impl: this.bucketSort,
      bestFor: ['uniform_distribution'],
      complexity: 'O(n)'
    });
  }
  
  // Ordenar adaptivamente
  sort(data, options = {}) {
    const profile = this.profileData(data);
    const algorithm = this.selectAlgorithm(profile, options);
    
    const start = performance.now();
    const result = algorithm.impl(data);
    const time = performance.now() - start;
    
    this.updateStatistics(algorithm.name, time, data.length);
    
    return result;
  }
  
  // Perfil dos dados
  profileData(data) {
    return {
      size: data.length,
      type: this.detectDataType(data),
      distribution: this.analyzeDistribution(data),
      sortedness: this.calculateSortedness(data),
      uniqueness: this.calculateUniqueness(data)
    };
  }
  
  // Seleção de algoritmo
  selectAlgorithm(profile, options) {
    let bestAlgorithm = null;
    let bestScore = -Infinity;
    
    this.algorithms.forEach(algo => {
      const score = this.calculateScore(algo, profile, options);
      if (score > bestScore) {
        bestScore = score;
        bestAlgorithm = algo;
      }
    });
    
    return bestAlgorithm;
  }
}
```

## 📝 Parte 3: Motor de Busca de Padrões

Implemente um engine de pattern matching inteligente:

```javascript
class PatternSearchEngine {
  constructor() {
    this.algorithms = {
      kmp: new KMPSearch(),
      boyerMoore: new BoyerMooreSearch(),
      rabinKarp: new RabinKarpSearch()
    };
  }
  
  // Busca adaptativa
  search(text, pattern, options = {}) {
    const algorithm = this.selectSearchAlgorithm(text, pattern);
    return algorithm.search(text, pattern, options);
  }
  
  // Busca de múltiplos padrões
  multiSearch(text, patterns) {
    // Implementar busca eficiente de múltiplos padrões
    // Sua implementação aqui
  }
  
  // Seleção de algoritmo
  selectSearchAlgorithm(text, pattern) {
    // KMP para padrões longos
    if (pattern.length > 100) return this.algorithms.kmp;
    
    // Boyer-Moore para textos longos
    if (text.length > 10000) return this.algorithms.boyerMoore;
    
    // Rabin-Karp para múltiplos padrões pequenos
    if (pattern.length < 10) return this.algorithms.rabinKarp;
    
    // Default KMP
    return this.algorithms.kmp;
  }
}
```

## 📝 Parte 4: Processador de Queries

Implemente um sistema de consultas SQL-like:

```javascript
class QueryProcessor {
  constructor(engine) {
    this.engine = engine;
    this.queryParser = new QueryParser();
    this.queryOptimizer = new QueryOptimizer();
  }
  
  // Processar query
  async process(queryString, data) {
    // 1. Parse da query
    const parsedQuery = this.queryParser.parse(queryString);
    
    // 2. Otimizar plano de execução
    const optimizedPlan = this.queryOptimizer.optimize(parsedQuery, data);
    
    // 3. Executar plano
    const results = await this.executePlan(optimizedPlan, data);
    
    return results;
  }
  
  // Executar plano de query
  async executePlan(plan, data) {
    let currentData = data;
    
    for (let step of plan) {
      switch (step.operation) {
        case 'FILTER':
          currentData = await this.filter(currentData, step.condition);
          break;
        case 'SORT':
          currentData = await this.engine.sortEngine.sort(currentData, step.criteria);
          break;
        case 'GROUP':
          currentData = await this.groupBy(currentData, step.field);
          break;
        case 'AGGREGATE':
          currentData = await this.aggregate(currentData, step.function);
          break;
      }
    }
    
    return currentData;
  }
}

// Parser de queries
class QueryParser {
  parse(queryString) {
    // Implementar parser para queries tipo:
    // "SELECT * FROM data WHERE category = 'tech' ORDER BY date DESC"
    
    // Sua implementação aqui
  }
}
```

## 📝 Parte 5: Análise e Relatórios

Implemente um sistema de análise de dados:

```javascript
class DataAnalyzer {
  constructor() {
    this.aggregators = new Map();
    this.setupAggregators();
  }
  
  // Analisar dados
  analyze(data, config) {
    const analysis = {
      summary: this.generateSummary(data),
      distributions: this.analyzeDistributions(data),
      correlations: this.findCorrelations(data),
      patterns: this.detectPatterns(data),
      anomalies: this.detectAnomalies(data)
    };
    
    return analysis;
  }
  
  // Gerar resumo estatístico
  generateSummary(data) {
    if (!Array.isArray(data)) return {};
    
    return {
      count: data.length,
      mean: this.calculateMean(data),
      median: this.calculateMedian(data),
      mode: this.calculateMode(data),
      stdDev: this.calculateStdDev(data),
      min: Math.min(...data),
      max: Math.max(...data)
    };
  }
  
  // Detectar padrões
  detectPatterns(data) {
    // Implementar detecção de padrões:
    // - Séries temporais
    // - Clustering
    // - Tendências
    
    // Sua implementação aqui
  }
  
  // Visualização de dados
  generateVisualizations(analysis) {
    const visualizations = [];
    
    // Gráfico de barras
    if (analysis.distributions) {
      visualizations.push({
        type: 'bar',
        data: this.prepareBarChartData(analysis.distributions)
      });
    }
    
    // Gráfico de linha para séries temporais
    if (analysis.timeSeries) {
      visualizations.push({
        type: 'line',
        data: this.prepareLineChartData(analysis.timeSeries)
      });
    }
    
    return visualizations;
  }
}
```

## 🧪 Parte 6: Testes e Benchmark

Implemente um sistema completo de testes:

```javascript
class SystemBenchmark {
  constructor(system) {
    this.system = system;
    this.testCases = [];
    this.results = [];
  }
  
  // Configurar casos de teste
  setupTestCases() {
    // Dataset pequeno
    this.addTestCase('small', this.generateData(1000));
    
    // Dataset médio
    this.addTestCase('medium', this.generateData(100000));
    
    // Dataset grande
    this.addTestCase('large', this.generateData(1000000));
    
    // Casos especiais
    this.addTestCase('nearly_sorted', this.generateNearlySorted(50000));
    this.addTestCase('many_duplicates', this.generateDuplicates(50000));
  }
  
  // Executar benchmark completo
  async runFullBenchmark() {
    for (let testCase of this.testCases) {
      console.log(`Running test: ${testCase.name}`);
      
      const result = await this.benchmarkTest(testCase);
      this.results.push(result);
    }
    
    return this.generateReport();
  }
  
  // Benchmark individual
  async benchmarkTest(testCase) {
    const metrics = {
      name: testCase.name,
      dataSize: testCase.data.length,
      operations: {}
    };
    
    // Indexação
    const indexTime = await this.measureOperation(() => 
      this.system.indexManager.addDocument(testCase.data)
    );
    metrics.operations.indexing = indexTime;
    
    // Ordenação
    const sortTime = await this.measureOperation(() =>
      this.system.sortEngine.sort(testCase.data)
    );
    metrics.operations.sorting = sortTime;
    
    // Busca
    const searchTime = await this.measureOperation(() =>
      this.system.searchEngine.search(testCase.data[0].content, 'pattern')
    );
    metrics.operations.searching = searchTime;
    
    return metrics;
  }
  
  // Gerar relatório
  generateReport() {
    const report = {
      executedAt: new Date().toISOString(),
      totalTests: this.results.length,
      summary: this.summarizeResults(),
      details: this.results,
      recommendations: this.generateRecommendations()
    };
    
    return report;
  }
}
```

## 🎯 Integração Final

```javascript
// Exemplo de uso do sistema completo
async function demonstrateSystem() {
  const system = new DataAnalysisSystem();
  
  // Carregar dados
  const rawData = await loadDataset('large_dataset.json');
  
  // Processar query complexa
  const query = `
    SELECT category, COUNT(*) as count, AVG(value) as avg_value
    FROM data
    WHERE date >= '2023-01-01' AND status = 'active'
    GROUP BY category
    ORDER BY count DESC
    LIMIT 10
  `;
  
  // Executar e obter resultados
  const results = await system.processData(rawData, query);
  
  // Gerar relatório
  const report = system.analyzer.analyze(results);
  
  // Visualizar
  const visualizations = system.analyzer.generateVisualizations(report);
  
  return {
    results,
    report,
    visualizations
  };
}
```

## ✅ Critérios de Avaliação

Para completar este projeto, certifique-se de:

1. **Implementar todos os algoritmos corretamente**
   - Quick Sort, Merge Sort, Heap Sort
   - Radix Sort, Bucket Sort
   - KMP, Boyer-Moore, Rabin-Karp

2. **Criar um sistema integrado funcional**
   - Indexação multi-campo
   - Query processing
   - Análise de dados

3. **Demonstrar adaptabilidade**
   - Seleção automática de algoritmos
   - Performance otimizada
   - Escalabilidade

4. **Documentar e testar**
   - Código comentado
   - Testes unitários
   - Benchmark completo

## 🚀 Entrega do Projeto

Seu projeto deve incluir:

1. **Código-fonte completo**
   - Organizado em módulos
   - Bem documentado
   - Com tipos e interfaces claras

2. **Suite de testes**
   - Testes unitários
   - Testes de integração
   - Casos de uso reais

3. **Documentação**
   - README detalhado
   - Exemplos de uso
   - Guia de configuração

4. **Relatório de performance**
   - Benchmark results
   - Análise de complexidade
   - Recomendações de uso

Este projeto integra todos os conceitos do módulo e prepara você para enfrentar desafios reais de algoritmos e estruturas de dados!