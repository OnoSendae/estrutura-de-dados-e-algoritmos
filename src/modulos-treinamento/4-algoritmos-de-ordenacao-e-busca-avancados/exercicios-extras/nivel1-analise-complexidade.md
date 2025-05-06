# Nível 1: Análise de Complexidade

## 🎯 Objetivo
Praticar a análise de complexidade temporal e espacial de algoritmos, identificando os componentes que contribuem para a complexidade final.

## 📝 Exercício 1: Analisando Quick Sort

Analise a complexidade dos seguintes cenários:

```javascript
function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const pivotIndex = partition(arr, left, right);
    quickSort(arr, left, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, right);
  }
  return arr;
}

function partition(arr, left, right) {
  const pivot = arr[right];
  let i = left - 1;
  
  for (let j = left; j < right; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
  return i + 1;
}
```

**Questões:**
1. Qual a complexidade temporal no melhor caso?
2. Qual a complexidade temporal no pior caso?
3. Qual a complexidade temporal no caso médio?
4. Qual a complexidade espacial? Por quê?
5. Como o pivô escolhido afeta a complexidade?

## 📝 Exercício 2: Analisando Merge Sort

```javascript
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  let result = [];
  let leftIdx = 0, rightIdx = 0;
  
  while (leftIdx < left.length && rightIdx < right.length) {
    if (left[leftIdx] < right[rightIdx]) {
      result.push(left[leftIdx]);
      leftIdx++;
    } else {
      result.push(right[rightIdx]);
      rightIdx++;
    }
  }
  
  return result
    .concat(left.slice(leftIdx))
    .concat(right.slice(rightIdx));
}
```

**Questões:**
1. Analise a recorrência T(n) = 2T(n/2) + O(n)
2. Use o Master Theorem para determinar a complexidade
3. Qual o impacto do `slice()` na complexidade espacial?
4. Como podemos otimizar o uso de memória?

## 📝 Exercício 3: Comparando Heap Sort e Quick Sort

```javascript
// Heap Sort
function heapSort(arr) {
  const n = arr.length;
  
  // Build heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  
  // Extract elements
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  
  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  let left = 2 * i + 1;
  let right = 2 * i + 2;
  
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }
  
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }
  
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}
```

**Questões:**
1. Compare as complexidades de Heap Sort e Quick Sort
2. Em que cenários Heap Sort é preferível?
3. Qual a complexidade espacial de cada algoritmo?
4. Qual algoritmo tem melhor cache locality?

## 📝 Exercício 4: Analisando Radix Sort

```javascript
function radixSort(arr) {
  const max = Math.max(...arr);
  
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSort(arr, exp);
  }
  
  return arr;
}

function countingSort(arr, exp) {
  const n = arr.length;
  const output = new Array(n);
  const count = new Array(10).fill(0);
  
  for (let i = 0; i < n; i++) {
    count[Math.floor(arr[i] / exp) % 10]++;
  }
  
  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }
  
  for (let i = n - 1; i >= 0; i--) {
    const index = Math.floor(arr[i] / exp) % 10;
    output[count[index] - 1] = arr[i];
    count[index]--;
  }
  
  for (let i = 0; i < n; i++) {
    arr[i] = output[i];
  }
}
```

**Questões:**
1. Calcule a complexidade temporal de Radix Sort
2. O que `d` representa na complexidade O(d × (n + k))?
3. Como o range dos números afeta a performance?
4. Compare com algoritmos baseados em comparação

## 📝 Exercício 5: Analisando KMP

```javascript
function computePrefixFunction(pattern) {
  const m = pattern.length;
  const prefix = new Array(m).fill(0);
  let k = 0;
  
  for (let q = 1; q < m; q++) {
    while (k > 0 && pattern[k] !== pattern[q]) {
      k = prefix[k - 1];
    }
    
    if (pattern[k] === pattern[q]) {
      k++;
    }
    
    prefix[q] = k;
  }
  
  return prefix;
}

function kmpSearch(text, pattern) {
  const n = text.length;
  const m = pattern.length;
  const prefix = computePrefixFunction(pattern);
  let q = 0;
  
  for (let i = 0; i < n; i++) {
    while (q > 0 && pattern[q] !== text[i]) {
      q = prefix[q - 1];
    }
    
    if (pattern[q] === text[i]) {
      q++;
    }
    
    if (q === m) {
      return i - m + 1;
    }
  }
  
  return -1;
}
```

**Questões:**
1. Analise a complexidade da construção da tabela de prefixos
2. Por que KMP tem complexidade O(n + m)?
3. Como a tabela de prefixos evita comparações redundantes?
4. Compare com o algoritmo ingênuo O(n × m)

## 📝 Exercício 6: Analisando Boyer-Moore

```javascript
function boyerMooreSearch(text, pattern) {
  const n = text.length;
  const m = pattern.length;
  const badChar = buildBadCharTable(pattern);
  
  let shift = 0;
  
  while (shift <= n - m) {
    let j = m - 1;
    
    while (j >= 0 && pattern[j] === text[shift + j]) {
      j--;
    }
    
    if (j < 0) {
      return shift;
    } else {
      shift += Math.max(1, j - badChar[text[shift + j]]);
    }
  }
  
  return -1;
}
```

**Questões:**
1. Qual a complexidade no melhor caso? Por quê?
2. Qual a complexidade no pior caso?
3. Como a bad character rule funciona?
4. Quando Boyer-Moore é mais eficiente que KMP?

## 📝 Exercício 7: Análise Amortizada

Analise a seguinte estrutura de dados dinâmica:

```javascript
class DynamicArray {
  constructor() {
    this.size = 0;
    this.capacity = 1;
    this.data = new Array(this.capacity);
  }
  
  push(item) {
    if (this.size === this.capacity) {
      this.resize();
    }
    
    this.data[this.size] = item;
    this.size++;
  }
  
  resize() {
    this.capacity *= 2;
    const newData = new Array(this.capacity);
    
    for (let i = 0; i < this.size; i++) {
      newData[i] = this.data[i];
    }
    
    this.data = newData;
  }
}
```

**Questões:**
1. Qual a complexidade de uma operação `push` individual?
2. Qual a complexidade amortizada de `push`?
3. Como o fator de redimensionamento afeta a complexidade?
4. Calcule o custo total de n operações push

## 📝 Exercício 8: Trade-offs de Complexidade

Analise os trade-offs entre tempo e espaço nos seguintes casos:

```javascript
// Versão 1: Time-optimized
function fibonacci1(n, memo = {}) {
  if (n <= 1) return n;
  if (memo[n]) return memo[n];
  
  memo[n] = fibonacci1(n - 1, memo) + fibonacci1(n - 2, memo);
  return memo[n];
}

// Versão 2: Space-optimized
function fibonacci2(n) {
  if (n <= 1) return n;
  
  let prev = 0, curr = 1;
  
  for (let i = 2; i <= n; i++) {
    let next = prev + curr;
    prev = curr;
    curr = next;
  }
  
  return curr;
}
```

**Questões:**
1. Compare as complexidades temporal e espacial
2. Em que cenários escolher cada abordagem?
3. Como implementar uma solução balanceada?

## 📝 Exercício 9: Complexidade em Diferentes Modelos

Analise a complexidade considerando diferentes modelos de máquina:

```javascript
// Contando número de divisões
function countDivisions(n) {
  let count = 0;
  while (n > 1) {
    n = Math.floor(n / 2);
    count++;
  }
  return count;
}

// Busca binária
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  
  return -1;
}
```

**Questões:**
1. Analise usando o RAM model
2. Como operações de divisão afetam a complexidade?
3. Compare com o modelo de árvore de decisão
4. Considere o impacto de cache misses

## 📝 Exercício 10: Exercício Integrado

Analise o seguinte código que combina múltiplos conceitos:

```javascript
function hybridSort(arr) {
  if (arr.length <= 10) {
    return insertionSort(arr);
  }
  
  const mid = Math.floor(arr.length / 2);
  const left = hybridSort(arr.slice(0, mid));
  const right = hybridSort(arr.slice(mid));
  
  return merge(left, right);
}

function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let current = arr[i];
    let j = i - 1;
    
    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j];
      j--;
    }
    
    arr[j + 1] = current;
  }
  
  return arr;
}
```

**Questões:**
1. Analise a complexidade total do algoritmo híbrido
2. Como o threshold (10) afeta a performance?
3. Compare com merge sort puro
4. Qual o trade-off entre complexidade do código e performance?

## 🎯 Desafio Final

Crie uma análise comparativa completa de todos os algoritmos estudados, considerando:

1. Complexidade temporal (melhor, médio, pior caso)
2. Complexidade espacial
3. Estabilidade
4. In-place ou não
5. Paralelizabilidade
6. Cache-friendliness

Organize seus resultados em uma tabela e justifique quando usar cada algoritmo.