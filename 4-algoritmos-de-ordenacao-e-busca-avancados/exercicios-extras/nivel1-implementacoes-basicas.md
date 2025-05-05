# Nível 1: Implementações Básicas

## 🎯 Objetivo
Implementar todos os algoritmos estudados do zero, sem consultar as implementações prontas. Isso ajudará a consolidar sua compreensão dos conceitos fundamentais.

## 📝 Exercício 1: Quick Sort Completo

Implemente Quick Sort com as seguintes variações:

```javascript
// 1. Quick Sort básico
function quickSort(arr) {
  // Sua implementação aqui
}

// 2. Quick Sort com 3-way partitioning
function threeWayQuickSort(arr) {
  // Sua implementação aqui
}

// 3. Quick Sort com median-of-three
function medianOfThreeQuickSort(arr) {
  // Sua implementação aqui
}

// 4. Quick Sort iterativo
function iterativeQuickSort(arr) {
  // Sua implementação aqui
}

// Testes
const testCases = [
  [5, 2, 8, 1, 9],
  [1, 1, 1, 1, 1],
  [],
  [1],
  Array.from({length: 100}, () => Math.floor(Math.random() * 100))
];

testCases.forEach((test, index) => {
  console.log(`Test ${index}:`, test);
  console.log(`Sorted:`, quickSort([...test]));
});
```

## 📝 Exercício 2: Merge Sort Variações

```javascript
// 1. Merge Sort recursivo
function mergeSort(arr) {
  // Sua implementação aqui
}

// 2. Merge Sort iterativo (bottom-up)
function iterativeMergeSort(arr) {
  // Sua implementação aqui
}

// 3. In-place Merge Sort
function inPlaceMergeSort(arr) {
  // Sua implementação aqui
}

// 4. Merge Sort com limite de recursão
function optimizedMergeSort(arr, threshold = 10) {
  // Sua implementação aqui
}
```

## 📝 Exercício 3: Heap Sort Completo

```javascript
// 1. Heap básico
class Heap {
  constructor(comparator = (a, b) => a - b) {
    this.heap = [];
    this.comparator = comparator;
  }
  
  insert(value) {
    // Sua implementação aqui
  }
  
  extract() {
    // Sua implementação aqui
  }
  
  peek() {
    // Sua implementação aqui
  }
  
  heapifyUp(index) {
    // Sua implementação aqui
  }
  
  heapifyDown(index) {
    // Sua implementação aqui
  }
}

// 2. Heap Sort usando a classe Heap
function heapSort(arr) {
  // Sua implementação aqui
}

// 3. Heap Sort in-place
function inPlaceHeapSort(arr) {
  // Sua implementação aqui
}
```

## 📝 Exercício 4: Radix Sort Completo

```javascript
// 1. Counting Sort (base para Radix)
function countingSort(arr, exp) {
  // Sua implementação aqui
}

// 2. LSD Radix Sort
function radixSortLSD(arr) {
  // Sua implementação aqui
}

// 3. MSD Radix Sort
function radixSortMSD(arr) {
  // Sua implementação aqui
}

// 4. Radix Sort para strings
function radixSortStrings(arr) {
  // Sua implementação aqui
}
```

## 📝 Exercício 5: Bucket Sort Completo

```javascript
// 1. Bucket Sort básico
function bucketSort(arr, bucketSize = 5) {
  // Sua implementação aqui
}

// 2. Bucket Sort para distribuição uniforme
function uniformBucketSort(arr) {
  // Sua implementação aqui
}

// 3. Bucket Sort adaptativo
function adaptiveBucketSort(arr) {
  // Sua implementação aqui
}
```

## 📝 Exercício 6: KMP (Knuth-Morris-Pratt)

```javascript
// 1. Construir tabela de prefixos
function buildPrefixTable(pattern) {
  // Sua implementação aqui
}

// 2. KMP Search
function kmpSearch(text, pattern) {
  // Sua implementação aqui
}

// 3. KMP com contagem de ocorrências
function kmpCount(text, pattern) {
  // Sua implementação aqui
}

// 4. KMP com posições de todas as ocorrências
function kmpFindAll(text, pattern) {
  // Sua implementação aqui
}
```

## 📝 Exercício 7: Boyer-Moore

```javascript
// 1. Bad Character Table
function buildBadCharTable(pattern) {
  // Sua implementação aqui
}

// 2. Good Suffix Table
function buildGoodSuffixTable(pattern) {
  // Sua implementação aqui
}

// 3. Boyer-Moore Search
function boyerMooreSearch(text, pattern) {
  // Sua implementação aqui
}

// 4. Boyer-Moore com contagem
function boyerMooreCount(text, pattern) {
  // Sua implementação aqui
}
```

## 📝 Exercício 8: Rabin-Karp

```javascript
// 1. Rabin-Karp básico
function rabinKarp(text, pattern, prime = 101) {
  // Sua implementação aqui
}

// 2. Rabin-Karp com múltiplos padrões
function multiPatternRabinKarp(text, patterns) {
  // Sua implementação aqui
}

// 3. Rolling hash
function rollingHash(text, windowSize) {
  // Sua implementação aqui
}
```

## ✅ Checklist de Verificação

Para cada implementação, verifique:
- [ ] Funciona corretamente com exemplos simples
- [ ] Trata casos especiais (array vazio, um elemento)
- [ ] Não modifica o array original (quando apropriado)
- [ ] Retorna o tipo de dado correto
- [ ] Tem complexidade temporal esperada
- [ ] Está documentado com comentários

## 🔍 Testes de Validação

Use este conjunto de testes para validar suas implementações:

```javascript
// Test Suite
const testSuite = {
  sorting: [
    {
      input: [5, 2, 8, 1, 9],
      expected: [1, 2, 5, 8, 9],
      name: "Basic array"
    },
    {
      input: [1, 1, 1, 1, 1],
      expected: [1, 1, 1, 1, 1],
      name: "All same elements"
    },
    {
      input: [],
      expected: [],
      name: "Empty array"
    },
    {
      input: [1],
      expected: [1],
      name: "Single element"
    },
    {
      input: [3, 2, 1],
      expected: [1, 2, 3],
      name: "Reverse sorted"
    }
  ],
  search: [
    {
      text: "hello world hello",
      pattern: "hello",
      expected: [0, 12],
      name: "Multiple occurrences"
    },
    {
      text: "abcdef",
      pattern: "xyz",
      expected: [],
      name: "Pattern not found"
    },
    {
      text: "",
      pattern: "a",
      expected: [],
      name: "Empty text"
    },
    {
      text: "a",
      pattern: "",
      expected: [],
      name: "Empty pattern"
    }
  ]
};

// Função de teste genérica
function runTests(algorithm, tests, type = 'sorting') {
  tests.forEach(test => {
    const result = algorithm(test.input || test.text, test.pattern);
    const passed = JSON.stringify(result) === JSON.stringify(test.expected);
    console.log(`${test.name}: ${passed ? '✅' : '❌'}`);
    if (!passed) {
      console.log(`  Expected: ${JSON.stringify(test.expected)}`);
      console.log(`  Got: ${JSON.stringify(result)}`);
    }
  });
}

// Exemplo de uso
runTests(quickSort, testSuite.sorting, 'sorting');
runTests(kmpSearch, testSuite.search, 'search');
```

## 🎯 Desafio Extra

Depois de implementar todos os algoritmos, crie uma classe genérica que encapsule todos eles:

```javascript
class AlgorithmLibrary {
  constructor() {
    this.sorters = {
      quick: (arr) => { /* implementação */ },
      merge: (arr) => { /* implementação */ },
      heap: (arr) => { /* implementação */ },
      radix: (arr) => { /* implementação */ },
      bucket: (arr) => { /* implementação */ }
    };
    
    this.searchers = {
      kmp: (text, pattern) => { /* implementação */ },
      boyerMoore: (text, pattern) => { /* implementação */ },
      rabinKarp: (text, pattern) => { /* implementação */ }
    };
  }
  
  sort(arr, algorithm = 'quick') {
    // Implementação que escolhe o algoritmo
  }
  
  search(text, pattern, algorithm = 'kmp') {
    // Implementação que escolhe o algoritmo
  }
  
  recommendSorter(arr) {
    // Analisa o array e recomenda o melhor algoritmo
  }
  
  benchmark(arr, text, pattern) {
    // Compara todos os algoritmos
  }
}
```