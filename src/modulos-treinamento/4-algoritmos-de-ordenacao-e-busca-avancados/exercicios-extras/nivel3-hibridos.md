# Nível 3: Algoritmos Híbridos

## 🎯 Objetivo
Criar e otimizar algoritmos híbridos que combinam múltiplas técnicas para obter o melhor desempenho possível em diferentes cenários.

## 📝 Exercício 1: Introsort (Introspective Sort)

Implemente um algoritmo que combina Quick Sort, Heap Sort e Insertion Sort:

```javascript
// Introsort: combina o melhor de três mundos
class Introsort {
  constructor(options = {}) {
    this.depthLimit = options.depthLimit || null;
    this.insertionThreshold = options.insertionThreshold || 16;
  }
  
  sort(arr) {
    const maxDepth = this.calculateMaxDepth(arr.length);
    this.introsortUtil(arr, 0, arr.length - 1, maxDepth);
    return arr;
  }
  
  introsortUtil(arr, low, high, depthLimit) {
    while (high > low) {
      // Se exceder depth limit, use heap sort
      if (depthLimit === 0) {
        this.heapSort(arr, low, high);
        return;
      }
      
      // Se array pequeno, use insertion sort
      if (high - low + 1 < this.insertionThreshold) {
        this.insertionSort(arr, low, high);
        return;
      }
      
      // Caso contrário, use quicksort
      const p = this.partition(arr, low, high);
      
      // Tail recursion optimization
      if (p - low < high - p) {
        this.introsortUtil(arr, low, p - 1, depthLimit - 1);
        low = p + 1;
      } else {
        this.introsortUtil(arr, p + 1, high, depthLimit - 1);
        high = p - 1;
      }
      
      depthLimit--;
    }
  }
  
  calculateMaxDepth(n) {
    // Sua implementação aqui
  }
  
  partition(arr, low, high) {
    // Sua implementação aqui
  }
  
  heapSort(arr, start, end) {
    // Sua implementação aqui
  }
  
  insertionSort(arr, start, end) {
    // Sua implementação aqui
  }
}
```

**Desafios:**
1. Determinar o limite de profundidade ótimo
2. Ajustar threshold para insertion sort
3. Otimizar transitions entre algoritmos

## 📝 Exercício 2: Timsort

Implemente uma versão simplificada do Timsort (usado em Python e Java):

```javascript
class Timsort {
  constructor(options = {}) {
    this.minRun = options.minRun || 32;
  }
  
  sort(arr) {
    const n = arr.length;
    
    // Ordene pequenos trechos com insertion sort
    for (let i = 0; i < n; i += this.minRun) {
      this.insertionSort(arr, i, Math.min(i + this.minRun - 1, n - 1));
    }
    
    // Merge os runs
    for (let size = this.minRun; size < n; size = 2 * size) {
      for (let left = 0; left < n; left += 2 * size) {
        const mid = left + size - 1;
        const right = Math.min(left + 2 * size - 1, n - 1);
        
        if (mid < right) {
          this.merge(arr, left, mid, right);
        }
      }
    }
    
    return arr;
  }
  
  // Detect runs naturais
  findNaturalRuns(arr) {
    const runs = [];
    let i = 0;
    
    while (i < arr.length) {
      let j = i + 1;
      
      // Verifica se é crescente ou decrescente
      if (j < arr.length && arr[j] < arr[i]) {
        // Decrescente
        while (j < arr.length && arr[j] < arr[j - 1]) {
          j++;
        }
        // Inverte para tornar crescente
        this.reverse(arr, i, j - 1);
      } else {
        // Crescente
        while (j < arr.length && arr[j] >= arr[j - 1]) {
          j++;
        }
      }
      
      runs.push({ start: i, end: j - 1 });
      i = j;
    }
    
    return runs;
  }
  
  // Merge adaptativo de Timsort
  gallop(arr, left, mid, right) {
    // Implementar galoping mode
    // Sua implementação aqui
  }
}
```

**Desafios:**
1. Implementar galoping mode eficientemente
2. Detectar runs naturais corretamente
3. Ajustar minRun para diferentes distribuições

## 📝 Exercício 3: Adaptive Sort

Crie um algoritmo que se adapta às características dos dados:

```javascript
class AdaptiveSort {
  constructor() {
    this.strategies = new Map();
    this.registerStrategies();
  }
  
  registerStrategies() {
    this.strategies.set('nearly_sorted', {
      algorithm: 'insertionSort',
      condition: data => this.isNearlySorted(data),
      complexity: 'O(n)'
    });
    
    this.strategies.set('many_duplicates', {
      algorithm: 'threeWayQuickSort',
      condition: data => this.hasManyDuplicates(data),
      complexity: 'O(n)'
    });
    
    this.strategies.set('small_range', {
      algorithm: 'countingSort',
      condition: data => this.hasSmallRange(data),
      complexity: 'O(n)'
    });
    
    // Adicione mais estratégias
  }
  
  sort(arr) {
    const characteristics = this.analyzeData(arr);
    const strategy = this.selectStrategy(characteristics);
    
    return this.applyStrategy(arr, strategy);
  }
  
  analyzeData(arr) {
    return {
      size: arr.length,
      sortedness: this.calculateSortedness(arr),
      uniqueness: this.calculateUniqueness(arr),
      range: this.calculateRange(arr),
      distribution: this.analyzeDistribution(arr)
    };
  }
  
  selectStrategy(characteristics) {
    for (let [name, strategy] of this.strategies) {
      if (strategy.condition(characteristics)) {
        return strategy;
      }
    }
    
    // Fallback para quicksort
    return { algorithm: 'quickSort', complexity: 'O(n log n)' };
  }
  
  isNearlySorted(data) {
    // Sua implementação aqui
  }
  
  hasManyDuplicates(data) {
    // Sua implementação aqui
  }
  
  hasSmallRange(data) {
    // Sua implementação aqui
  }
}
```

**Desafios:**
1. Criar métricas eficientes para detectar características
2. Minimizar overhead de análise
3. Manter robustez em casos mistos

## 📝 Exercício 4: Parallel Hybrid Sort

Combine paralelismo com algoritmos híbridos:

```javascript
class ParallelHybridSort {
  constructor(workerCount = navigator.hardwareConcurrency) {
    this.workerCount = workerCount;
    this.workers = [];
    this.initializeWorkers();
  }
  
  async sort(arr) {
    const chunkSize = Math.ceil(arr.length / this.workerCount);
    const chunks = [];
    
    // Dividir array em chunks
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    
    // Ordenar chunks em paralelo
    const sortedChunks = await Promise.all(
      chunks.map((chunk, index) => this.sortChunk(chunk, index))
    );
    
    // Merge paralelo
    return this.parallelMerge(sortedChunks);
  }
  
  async sortChunk(chunk, workerId) {
    return new Promise((resolve) => {
      const worker = this.workers[workerId % this.workers.length];
      
      worker.onmessage = (e) => {
        resolve(e.data);
      };
      
      worker.postMessage({
        type: 'SORT',
        data: chunk,
        algorithm: this.selectAlgorithm(chunk)
      });
    });
  }
  
  selectAlgorithm(chunk) {
    // Selecione algoritmo baseado em características do chunk
    if (chunk.length < 100) return 'insertion';
    if (this.calculateSortedness(chunk) > 0.8) return 'adaptive_insertion';
    if (this.hasManyDuplicates(chunk)) return 'three_way_quick';
    return 'quick';
  }
  
  parallelMerge(chunks) {
    // Merge paralelo de chunks ordenados
    // Sua implementação aqui
  }
}
```

**Desafios:**
1. Balancear carga entre workers
2. Minimizar overhead de comunicação
3. Implementar merge paralelo eficiente

## 📝 Exercício 5: Memory-Adaptive Sort

Crie um algoritmo que se adapta à memória disponível:

```javascript
class MemoryAdaptiveSort {
  constructor(options = {}) {
    this.maxMemory = options.maxMemory || this.getAvailableMemory();
    this.monitorMemory = options.monitorMemory || true;
  }
  
  sort(arr) {
    const memoryNeeded = this.estimateMemoryNeeded(arr.length);
    
    if (memoryNeeded <= this.maxMemory) {
      // Algoritmo in-memory
      return this.inMemorySort(arr);
    } else {
      // Algoritmo external
      return this.externalSort(arr);
    }
  }
  
  inMemorySort(arr) {
    const availableMemory = this.getAvailableMemory();
    
    if (availableMemory > arr.length * 4 * 2) {
      // Memória suficiente para merge sort
      return this.mergeSort(arr);
    } else if (availableMemory > arr.length * 4) {
      // Memória justa para quick sort
      return this.quickSort(arr);
    } else {
      // Memória muito limitada, use heap sort
      return this.heapSort(arr);
    }
  }
  
  externalSort(arr) {
    // Implementar external sort com chunks
    const chunkSize = Math.floor(this.maxMemory / 4); // 4 bytes por número
    
    // Sua implementação aqui
  }
  
  getAvailableMemory() {
    // Estimar memória disponível
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const usage = process.memoryUsage();
      return usage.heapTotal - usage.heapUsed;
    }
    return 1024 * 1024 * 100; // Default 100MB
  }
  
  estimateMemoryNeeded(size) {
    // Estimar memória necessária
    return size * 4 * 1.5; // Considerando overhead
  }
}
```

**Desafios:**
1. Monitorar memória em tempo real
2. Adaptar algoritmo dinamicamente
3. Implementar external sort eficiente

## 📝 Exercício 6: Pattern-Aware Sort

Crie um algoritmo que detecta e explora padrões nos dados:

```javascript
class PatternAwareSort {
  constructor() {
    this.patterns = new Map();
    this.initializePatterns();
  }
  
  initializePatterns() {
    this.patterns.set('sorted', {
      detect: arr => this.isSorted(arr),
      action: arr => arr // já está ordenado
    });
    
    this.patterns.set('reverse_sorted', {
      detect: arr => this.isReverseSorted(arr),
      action: arr => arr.reverse()
    });
    
    this.patterns.set('rotated', {
      detect: arr => this.isRotated(arr),
      action: arr => this.unrotate(arr)
    });
    
    this.patterns.set('nearly_sorted', {
      detect: arr => this.isNearlySorted(arr),
      action: arr => this.adaptiveInsertionSort(arr)
    });
    
    this.patterns.set('periodic', {
      detect: arr => this.isPeriodic(arr),
      action: arr => this.periodicSort(arr)
    });
  }
  
  sort(arr) {
    for (let [name, pattern] of this.patterns) {
      if (pattern.detect(arr)) {
        console.log(`Detected pattern: ${name}`);
        return pattern.action(arr);
      }
    }
    
    // Nenhum padrão detectado, use algoritmo geral
    return this.generalSort(arr);
  }
  
  isRotated(arr) {
    // Detecta array ordenado mas rotado
    let rotationPoint = -1;
    
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        if (rotationPoint !== -1) return false;
        rotationPoint = i;
      }
    }
    
    return rotationPoint !== -1;
  }
  
  unrotate(arr) {
    // Encontra ponto de rotação e corrige
    // Sua implementação aqui
  }
  
  isPeriodic(arr) {
    // Detecta padrões periódicos
    // Sua implementação aqui
  }
  
  periodicSort(arr) {
    // Ordena dados periódicos eficientemente
    // Sua implementação aqui
  }
}
```

**Desafios:**
1. Detectar padrões eficientemente
2. Explorar padrões sem overhead excessivo
3. Combinar detecção de padrões com sorting

## 📝 Exercício 7: Multi-Strategy Selector

Implemente um sistema que aprende qual estratégia funciona melhor:

```javascript
class MultiStrategySelector {
  constructor() {
    this.strategies = new Map();
    this.history = [];
    this.weights = new Map();
    this.learningRate = 0.1;
  }
  
  addStrategy(name, algorithm, predictor) {
    this.strategies.set(name, {
      algorithm: algorithm,
      predictor: predictor
    });
    this.weights.set(name, 1.0);
  }
  
  sort(arr) {
    const profile = this.profileData(arr);
    const strategy = this.selectStrategy(profile);
    
    const start = performance.now();
    const result = strategy.algorithm(arr);
    const time = performance.now() - start;
    
    this.recordPerformance(strategy.name, profile, time);
    this.updateWeights();
    
    return result;
  }
  
  selectStrategy(profile) {
    let bestStrategy = null;
    let bestScore = -Infinity;
    
    for (let [name, strategy] of this.strategies) {
      const prediction = strategy.predictor(profile);
      const weight = this.weights.get(name);
      const score = prediction * weight;
      
      if (score > bestScore) {
        bestScore = score;
        bestStrategy = { name, ...strategy };
      }
    }
    
    return bestStrategy;
  }
  
  updateWeights() {
    // Implementar reinforcement learning
    // Sua implementação aqui
  }
  
  recordPerformance(strategyName, profile, time) {
    this.history.push({
      strategy: strategyName,
      profile: profile,
      time: time,
      timestamp: Date.now()
    });
  }
  
  analyzeHistory() {
    // Analise histórico para melhorar predições
    // Sua implementação aqui
  }
}
```

**Desafios:**
1. Implementar sistema de aprendizado eficiente
2. Balancear exploration vs exploitation
3. Adaptar a diferentes ambientes

## 📊 Exercício 8: Benchmark de Híbridos

Crie um sistema para comparar diferentes algoritmos híbridos:

```javascript
class HybridBenchmark {
  constructor() {
    this.algorithms = new Map();
    this.datasets = [];
    this.results = [];
  }
  
  registerAlgorithm(name, algorithm) {
    this.algorithms.set(name, algorithm);
  }
  
  addDataset(name, generator) {
    this.datasets.push({ name, generator });
  }
  
  async runComprehensiveBenchmark() {
    for (let dataset of this.datasets) {
      console.log(`\nTesting dataset: ${dataset.name}`);
      
      for (let [algoName, algorithm] of this.algorithms) {
        const data = dataset.generator();
        const result = await this.benchmarkSingle(algorithm, data);
        
        this.results.push({
          algorithm: algoName,
          dataset: dataset.name,
          ...result
        });
      }
    }
    
    return this.analyzeResults();
  }
  
  async benchmarkSingle(algorithm, data) {
    const metrics = {
      time: 0,
      memory: 0,
      cacheHits: 0,
      cpuCycles: 0
    };
    
    // Warm-up
    algorithm([...data]);
    
    // Measure
    const start = performance.now();
    const memoryBefore = process.memoryUsage().heapUsed;
    
    const result = algorithm([...data]);
    
    const end = performance.now();
    const memoryAfter = process.memoryUsage().heapUsed;
    
    metrics.time = end - start;
    metrics.memory = memoryAfter - memoryBefore;
    
    // Validação
    if (!this.isSorted(result)) {
      console.error('Algorithm failed to sort correctly!');
    }
    
    return metrics;
  }
  
  analyzeResults() {
    // Gerar gráficos e relatórios
    const report = {
      summary: this.generateSummary(),
      recommendations: this.generateRecommendations(),
      visualizations: this.generateVisualizations()
    };
    
    return report;
  }
}
```

**Desafios:**
1. Medir métricas precisas de performance
2. Gerar insights úteis dos resultados
3. Visualizar comparações complexas

## 🎯 Projeto Final: Adaptive Hybrid Framework

Combine todos os conceitos em um framework completo:

```javascript
class AdaptiveHybridFramework {
  constructor() {
    this.hybridAlgorithms = new Map();
    this.adaptationStrategies = new Map();
    this.performanceProfile = new Map();
    this.cache = new LRUCache(1000);
  }
  
  initialize() {
    this.registerHybridAlgorithms();
    this.registerAdaptationStrategies();
    this.loadPerformanceProfile();
  }
  
  async sort(arr) {
    const profile = this.profileData(arr);
    const cacheKey = this.generateCacheKey(profile);
    
    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached) return cached.algorithm(arr);
    
    // Select and execute
    const algorithm = this.selectOptimalHybrid(profile);
    const result = algorithm(arr);
    
    // Update profile
    this.updatePerformanceProfile(profile, algorithm.name);
    this.cache.set(cacheKey, algorithm);
    
    return result;
  }
  
  selectOptimalHybrid(profile) {
    // Conjunto de candidatos
    const candidates = this.getCandidates(profile);
    
    // Simulação rápida
    const simulations = this.runSimulations(candidates, profile);
    
    // Seleção final
    return this.chooseBest(simulations);
  }
  
  adaptToEnvironment() {
    // Adapte baseado em recursos disponíveis
    const resources = this.getSystemResources();
    
    if (resources.memory < THRESHOLD_LOW) {
      this.prioritizeMemoryEfficient();
    }
    
    if (resources.cpu < THRESHOLD_SLOW) {
      this.prioritizeSimpleAlgorithms();
    }
    
    if (resources.cores > 4) {
      this.enableParallelization();
    }
  }
  
  continuousImprovement() {
    // Aprendizado contínuo
    setInterval(() => {
      this.analyzePerformance();
      this.optimizeStrategies();
      this.updateModels();
    }, 3600000); // a cada hora
  }
}

// Exemplo de uso
const framework = new AdaptiveHybridFramework();
framework.initialize();

const data = generateData();
const sorted = await framework.sort(data);
```

**Objetivos do Projeto Final:**
1. Integrar todas as técnicas aprendidas
2. Criar um sistema que aprende e melhora
3. Adaptar a diferentes ambientes e workloads
4. Manter alto desempenho em todos os cenários

## ✅ Avaliação de Híbridos

Para cada algoritmo híbrido, meça:
1. **Versatilidade**: Desempenho em diferentes tipos de dados
2. **Eficiência**: Relação custo-benefício da adaptação
3. **Robustez**: Performance em casos extremos
4. **Escalabilidade**: Comportamento com diferentes tamanhos
5. **Complexidade**: Facilidade de implementação e manutenção

## 🎓 Conclusão

Os algoritmos híbridos representam o estado da arte em sorting e searching, combinando múltiplas técnicas para obter performance ótima. Dominar estes conceitos prepara você para criar sistemas avançados que se adaptam a qualquer desafio computacional.