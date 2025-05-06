# Case Study: Sistema de Benchmark de Algoritmos de Ordenação

## 🎯 Objetivo do Projeto

Desenvolver um sistema completo de benchmark que compare o desempenho de diferentes algoritmos de ordenação em diversos cenários, fornecendo análise estatística e visualização dos resultados.

## 📋 Contexto do Problema

Uma equipe de desenvolvimento precisa tomar decisões informadas sobre qual algoritmo de ordenação usar em diferentes situações. O sistema deve:

1. Testar algoritmos em diferentes tipos de dados
2. Medir tempo de execução e uso de memória
3. Analisar performance em diferentes tamanhos de entrada
4. Fornecer recomendações baseadas em características dos dados
5. Visualizar resultados de forma clara

## 🏗️ Arquitetura do Sistema

```javascript
class BenchmarkSystem {
    constructor() {
        this.algorithms = new Map();
        this.datasets = new Map();
        this.results = [];
        this.dataGenerator = new DataGenerator();
        this.analyzer = new PerformanceAnalyzer();
        this.visualizer = new ResultVisualizer();
    }
    
    // Registrar algoritmos para teste
    registerAlgorithm(name, algorithm, category) {
        this.algorithms.set(name, {
            function: algorithm,
            category: category,
            complexity: this.estimateComplexity(algorithm)
        });
    }
    
    // Gerar conjunto de testes
    generateTestSuite() {
        const testSuite = [];
        
        // Diferentes tamanhos
        const sizes = [100, 1000, 10000, 100000];
        
        // Diferentes tipos de dados
        const dataTypes = [
            'random',
            'nearly_sorted', 
            'reverse_sorted',
            'many_duplicates',
            'small_range'
        ];
        
        sizes.forEach(size => {
            dataTypes.forEach(type => {
                testSuite.push({
                    name: `${type}_${size}`,
                    size: size,
                    type: type,
                    data: this.dataGenerator.generate(type, size)
                });
            });
        });
        
        return testSuite;
    }
    
    // Executar benchmarks
    async runBenchmarks() {
        const testSuite = this.generateTestSuite();
        
        for (let [name, algo] of this.algorithms) {
            console.log(`Testing ${name}...`);
            
            for (let test of testSuite) {
                const result = await this.benchmarkAlgorithm(
                    algo.function,
                    test.data,
                    test.name
                );
                
                this.results.push({
                    algorithm: name,
                    testCase: test.name,
                    size: test.size,
                    type: test.type,
                    ...result
                });
            }
        }
        
        return this.analyzer.analyze(this.results);
    }
    
    // Benchmark individual
    async benchmarkAlgorithm(algorithm, data, testName) {
        const iterations = this.calculateIterations(data.length);
        const measurements = [];
        
        for (let i = 0; i < iterations; i++) {
            const testData = [...data];
            const start = performance.now();
            const memoryBefore = process.memoryUsage().heapUsed;
            
            try {
                algorithm(testData);
                
                const end = performance.now();
                const memoryAfter = process.memoryUsage().heapUsed;
                
                measurements.push({
                    time: end - start,
                    memory: memoryAfter - memoryBefore
                });
            } catch (error) {
                console.error(`Error in ${testName}:`, error);
                return { error: error.message };
            }
        }
        
        return this.calculateStatistics(measurements);
    }
    
    calculateStatistics(measurements) {
        const times = measurements.map(m => m.time);
        const memories = measurements.map(m => m.memory);
        
        return {
            timeStats: {
                mean: this.mean(times),
                median: this.median(times),
                stdDev: this.standardDeviation(times),
                min: Math.min(...times),
                max: Math.max(...times)
            },
            memoryStats: {
                mean: this.mean(memories),
                median: this.median(memories),
                stdDev: this.standardDeviation(memories)
            }
        };
    }
}
```

## 📊 Gerador de Datasets

```javascript
class DataGenerator {
    generate(type, size) {
        switch (type) {
            case 'random':
                return this.generateRandom(size);
            case 'nearly_sorted':
                return this.generateNearlySorted(size);
            case 'reverse_sorted':
                return this.generateReverseSorted(size);
            case 'many_duplicates':
                return this.generateManyDuplicates(size);
            case 'small_range':
                return this.generateSmallRange(size);
            default:
                throw new Error(`Unknown data type: ${type}`);
        }
    }
    
    generateRandom(size) {
        return Array.from({ length: size }, () => 
            Math.floor(Math.random() * size * 10)
        );
    }
    
    generateNearlySorted(size) {
        const arr = Array.from({ length: size }, (_, i) => i);
        // Fazer algumas trocas (5% do array)
        const swaps = Math.floor(size * 0.05);
        for (let i = 0; i < swaps; i++) {
            const idx1 = Math.floor(Math.random() * size);
            const idx2 = Math.floor(Math.random() * size);
            [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
        }
        return arr;
    }
    
    generateReverseSorted(size) {
        return Array.from({ length: size }, (_, i) => size - i);
    }
    
    generateManyDuplicates(size) {
        // 90% de duplicatas
        const uniqueValues = Math.floor(size * 0.1);
        return Array.from({ length: size }, () => 
            Math.floor(Math.random() * uniqueValues)
        );
    }
    
    generateSmallRange(size) {
        // Range de valores muito menor que tamanho do array
        const range = Math.min(100, Math.floor(size / 100));
        return Array.from({ length: size }, () => 
            Math.floor(Math.random() * range)
        );
    }
}
```

## 📈 Analisador de Performance

```javascript
class PerformanceAnalyzer {
    analyze(results) {
        const analysis = {
            trends: this.analyzeTrends(results),
            recommendations: this.generateRecommendations(results),
            complexityValidation: this.validateComplexity(results),
            bestPerformers: this.identifyBestPerformers(results)
        };
        
        return analysis;
    }
    
    analyzeTrends(results) {
        const trendsByAlgorithm = new Map();
        
        results.forEach(result => {
            if (!trendsByAlgorithm.has(result.algorithm)) {
                trendsByAlgorithm.set(result.algorithm, []);
            }
            
            trendsByAlgorithm.get(result.algorithm).push({
                size: result.size,
                time: result.timeStats.mean,
                type: result.type
            });
        });
        
        const trends = {};
        
        trendsByAlgorithm.forEach((data, algorithm) => {
            trends[algorithm] = this.calculateTrendLine(data);
        });
        
        return trends;
    }
    
    calculateTrendLine(data) {
        // Regressão linear simples para estimar crescimento
        const x = data.map(d => Math.log(d.size));
        const y = data.map(d => Math.log(d.time));
        
        const n = x.length;
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        
        return {
            slope: slope,
            intercept: intercept,
            estimatedComplexity: this.interpretSlope(slope)
        };
    }
    
    interpretSlope(slope) {
        if (slope < 0.5) return 'O(1) ou O(log n)';
        if (slope < 1.5) return 'O(n)';
        if (slope < 2.5) return 'O(n log n)';
        if (slope < 3.5) return 'O(n²)';
        return 'O(n³) ou pior';
    }
    
    generateRecommendations(results) {
        const recommendations = {};
        
        ['random', 'nearly_sorted', 'reverse_sorted', 'many_duplicates', 'small_range']
            .forEach(dataType => {
                const bestForType = this.findBestForType(results, dataType);
                recommendations[dataType] = bestForType;
            });
        
        return recommendations;
    }
    
    findBestForType(results, dataType) {
        const resultsForType = results.filter(r => r.type === dataType);
        const performanceMap = new Map();
        
        resultsForType.forEach(result => {
            if (!performanceMap.has(result.algorithm)) {
                performanceMap.set(result.algorithm, []);
            }
            performanceMap.get(result.algorithm).push(result.timeStats.mean);
        });
        
        const avgPerformance = new Map();
        performanceMap.forEach((times, algorithm) => {
            const avg = times.reduce((a, b) => a + b, 0) / times.length;
            avgPerformance.set(algorithm, avg);
        });
        
        const best = Array.from(avgPerformance.entries())
            .sort((a, b) => a[1] - b[1])[0];
        
        return best ? best[0] : 'Nenhum';
    }
}
```

## 📊 Visualizador de Resultados

```javascript
class ResultVisualizer {
    generateHTML(analysis) {
        return `
<!DOCTYPE html>
<html>
<head>
    <title>Benchmark Results</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.0/chart.min.js"></script>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .chart-container { width: 45%; display: inline-block; margin: 10px; }
        .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .table th, .table td { border: 1px solid #ddd; padding: 8px; }
        .table th { background-color: #f2f2f2; }
        .recommendation { background-color: #e8f5e9; padding: 15px; margin: 20px 0; }
    </style>
</head>
<body>
    <h1>Performance Benchmark Results</h1>
    
    ${this.generatePerformanceCharts(analysis)}
    ${this.generateComplexityTable(analysis)}
    ${this.generateRecommendations(analysis)}
    ${this.generateDetailedTable(analysis.rawResults)}
    
    <script>
        ${this.generateChartScripts(analysis)}
    </script>
</body>
</html>
        `;
    }
    
    generatePerformanceCharts(analysis) {
        return `
        <h2>Performance Trends</h2>
        <div class="chart-container">
            <canvas id="performanceChart"></canvas>
        </div>
        <div class="chart-container">
            <canvas id="memoryChart"></canvas>
        </div>
        `;
    }
    
    generateComplexityTable(analysis) {
        let html = `
        <h2>Complexity Analysis</h2>
        <table class="table">
            <thead>
                <tr>
                    <th>Algorithm</th>
                    <th>Theoretical</th>
                    <th>Measured</th>
                    <th>Match</th>
                </tr>
            </thead>
            <tbody>
        `;
        
        Object.entries(analysis.complexityValidation).forEach(([algo, data]) => {
            html += `
                <tr>
                    <td>${algo}</td>
                    <td>${data.theoretical}</td>
                    <td>${data.measured}</td>
                    <td>${data.match ? '✅' : '❌'}</td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        return html;
    }
    
    generateRecommendations(analysis) {
        let html = '<h2>Recommendations</h2>';
        
        Object.entries(analysis.recommendations).forEach(([type, algorithm]) => {
            html += `
            <div class="recommendation">
                <h3>${type.replace('_', ' ')}</h3>
                <p>Best algorithm: <strong>${algorithm}</strong></p>
            </div>
            `;
        });
        
        return html;
    }
}
```

## 🚀 Sistema de Auto-tuning

```javascript
class AutoTuningSystem {
    constructor(benchmarkSystem) {
        this.benchmark = benchmarkSystem;
        this.profiles = new Map();
    }
    
    // Criar perfil de performance para tipos de dados
    async createPerformanceProfile() {
        const results = await this.benchmark.runBenchmarks();
        
        // Analisar resultados e criar árvore de decisão
        this.buildDecisionTree(results);
        
        return this.profiles;
    }
    
    // Recomendar algoritmo baseado em características dos dados
    recommendAlgorithm(data) {
        const characteristics = this.analyzeDataCharacteristics(data);
        
        // Usar árvore de decisão para escolher algoritmo
        return this.traverseDecisionTree(characteristics);
    }
    
    analyzeDataCharacteristics(data) {
        const size = data.length;
        const uniqueValues = new Set(data).size;
        const sortedness = this.calculateSortedness(data);
        const distribution = this.analyzeDistribution(data);
        
        return {
            size,
            uniqueRatio: uniqueValues / size,
            sortedness,
            distribution
        };
    }
    
    calculateSortedness(data) {
        let inversions = 0;
        for (let i = 0; i < data.length - 1; i++) {
            for (let j = i + 1; j < data.length; j++) {
                if (data[i] > data[j]) inversions++;
            }
        }
        const maxInversions = (data.length * (data.length - 1)) / 2;
        return 1 - (inversions / maxInversions);
    }
    
    traverseDecisionTree(characteristics) {
        // Lógica de decisão baseada em perfil de performance
        if (characteristics.size < 50) {
            return 'Insertion Sort';
        }
        
        if (characteristics.uniqueRatio < 0.1) {
            return 'Three-way Quick Sort';
        }
        
        if (characteristics.sortedness > 0.9) {
            return 'Adaptive Insertion Sort';
        }
        
        if (characteristics.distribution === 'uniform') {
            return 'Bucket Sort';
        }
        
        if (characteristics.size < 1000) {
            return 'Quick Sort';
        }
        
        return 'Timsort';
    }
}
```

## 📊 Implementação Completa

```javascript
// Exemplo de uso do sistema
const system = new BenchmarkSystem();

// Registrar algoritmos
system.registerAlgorithm('Quick Sort', quickSort, 'comparison');
system.registerAlgorithm('Merge Sort', mergeSort, 'comparison');
system.registerAlgorithm('Heap Sort', heapSort, 'comparison');
system.registerAlgorithm('Radix Sort', radixSort, 'non-comparison');
system.registerAlgorithm('Bucket Sort', bucketSort, 'non-comparison');
system.registerAlgorithm('Timsort', timsort, 'hybrid');

// Executar benchmarks
system.runBenchmarks().then(analysis => {
    // Gerar relatório
    const html = system.visualizer.generateHTML(analysis);
    require('fs').writeFileSync('benchmark-report.html', html);
    
    // Sistema de auto-tuning
    const autoTuner = new AutoTuningSystem(system);
    autoTuner.createPerformanceProfile().then(profiles => {
        console.log('Performance profiles created!');
    });
});
```

## 📊 Análise de Escalabilidade

```javascript
class ScalabilityAnalyzer {
    analyzeScalability(results) {
        const scalabilityReport = {
            linearScaling: {},
            memoryEfficiency: {},
            parallelizationPotential: {}
        };
        
        // Analisar como cada algoritmo escala
        Object.keys(results.trends).forEach(algorithm => {
            const trend = results.trends[algorithm];
            
            scalabilityReport.linearScaling[algorithm] = {
                scalingFactor: trend.slope,
                efficiency: this.calculateEfficiency(trend),
                predictedPerformance: this.predictPerformance(trend)
            };
        });
        
        return scalabilityReport;
    }
    
    calculateEfficiency(trend) {
        // Comparar com complexidade teórica
        const theoreticalSlope = this.getTheoreticalSlope(trend.estimatedComplexity);
        return theoreticalSlope / trend.slope;
    }
    
    predictPerformance(trend, futureSize = 10000000) {
        const logSize = Math.log(futureSize);
        const logTime = trend.intercept + trend.slope * logSize;
        return Math.exp(logTime);
    }
}
```

## 🎯 Conclusões e Insights

### Principais Descobertas

1. **Nenhum algoritmo é perfeito**: Cada algoritmo tem seu nicho ideal
2. **Características dos dados importam**: A distribuição dos dados pode mudar drasticamente a performance
3. **Tamanho importa**: Algoritmos simples podem superar os "melhores" para dados pequenos
4. **Memória vs Tempo**: Trade-offs importantes em sistemas com restrições de recursos

### Recomendações Finais

```javascript
const finalRecommendations = {
    'Arrays pequenos (<50)': 'Insertion Sort',
    'Array quase ordenado': 'Insertion Sort ou Timsort',
    'Muitas duplicatas': 'Three-way Quick Sort',
    'Distribuição uniforme': 'Bucket Sort',
    'Inteiros com range pequeno': 'Counting Sort',
    'Strings': 'Radix Sort',
    'Geral para arrays grandes': 'Quick Sort ou Timsort',
    'Estabilidade necessária': 'Merge Sort ou Timsort',
    'Memória limitada': 'Quick Sort ou Heap Sort'
};
```

## 🤔 Quer explorar mais?

Com base nos resultados do benchmark, podemos:
- Ajustar parâmetros de algoritmos específicos
- Criar versões híbridas otimizadas
- Desenvolver algoritmos adaptativos
- Implementar caching de resultados
- Criar sistema de profiling automático

O que você gostaria de aprofundar neste case study?