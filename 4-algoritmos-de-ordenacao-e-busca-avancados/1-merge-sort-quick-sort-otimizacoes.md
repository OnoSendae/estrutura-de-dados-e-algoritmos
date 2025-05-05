# Merge Sort e Quick Sort: Análise Detalhada e Otimizações

## 🎯 Objetivos de Aprendizagem

- Dominar os algoritmos Merge Sort e Quick Sort
- Entender suas complexidades em diferentes cenários
- Implementar otimizações práticas
- Escolher o algoritmo apropriado para cada situação
- Visualizar o processo de funcionamento dos algoritmos

## 📚 Revisão: Estratégia Dividir e Conquistar

A estratégia "dividir e conquistar" consiste em:
1. **Dividir**: Quebrar o problema em subproblemas menores
2. **Conquistar**: Resolver os subproblemas recursivamente
3. **Combinar**: Unir as soluções dos subproblemas

Esta estratégia é a base dos algoritmos Merge Sort e Quick Sort.

## 🔍 Merge Sort - Análise Detalhada

### Conceito Fundamental

Merge Sort é um algoritmo de ordenação que:
- Divide a lista ao meio recursivamente
- Ordena cada metade independentemente
- Combina (merge) as listas ordenadas

### Visualização do Processo

```
Entrada: [7, 3, 5, 1, 6, 2, 4]

Dividir:
          [7, 3, 5, 1, 6, 2, 4]
                /      \
        [7, 3, 5]      [1, 6, 2, 4]
        /    \            /     \
     [7]   [3, 5]      [1, 6]  [2, 4]
            / \          / \     / \
          [3] [5]      [1] [6] [2] [4]

Conquistar e Combinar:
          [3] [5]      [1] [6] [2] [4]
            \ /          \ /     \ /
          [3, 5]        [1, 6]  [2, 4]
             \            /        /
           [3, 5]    [1, 2, 4, 6]
                \     /
             [1, 2, 3, 4, 5, 6, 7]
```

### Complexidade
- **Tempo**: O(n log n) - garantido em todos os casos
- **Espaço**: O(n) - necessita de espaço auxiliar
- **Estabilidade**: É estável (mantém a ordem relativa de elementos iguais)

### Implementação Básica

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
    let leftIndex = 0;
    let rightIndex = 0;
    
    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] < right[rightIndex]) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }
    
    return result
        .concat(left.slice(leftIndex))
        .concat(right.slice(rightIndex));
}

// Exemplo de uso
const array = [7, 3, 5, 1, 6, 2, 4];
console.log(mergeSort(array)); // [1, 2, 3, 4, 5, 6, 7]
```

### Rastreamento com Exemplo
```
mergeSort([7, 3, 5, 1, 6, 2, 4])
  left = mergeSort([7, 3, 5])
    left = mergeSort([7])
      return [7]
    right = mergeSort([3, 5])
      left = mergeSort([3])
        return [3]
      right = mergeSort([5])
        return [5]
      return merge([3], [5]) = [3, 5]
    return merge([7], [3, 5]) = [3, 5, 7]
  right = mergeSort([1, 6, 2, 4])
    left = mergeSort([1, 6])
      left = mergeSort([1])
        return [1]
      right = mergeSort([6])
        return [6]
      return merge([1], [6]) = [1, 6]
    right = mergeSort([2, 4])
      left = mergeSort([2])
        return [2]
      right = mergeSort([4])
        return [4]
      return merge([2], [4]) = [2, 4]
    return merge([1, 6], [2, 4]) = [1, 2, 4, 6]
  return merge([3, 5, 7], [1, 2, 4, 6]) = [1, 2, 3, 4, 5, 6, 7]
```

## 🔄 Otimizações do Merge Sort

### 1. In-Place Merge Sort

Reduz o uso de memória auxiliar através de um merge in-place.

```javascript
function inPlaceMergeSort(arr, left = 0, right = arr.length - 1) {
    if (left >= right) return;
    
    const mid = Math.floor((left + right) / 2);
    inPlaceMergeSort(arr, left, mid);
    inPlaceMergeSort(arr, mid + 1, right);
    
    inPlaceMerge(arr, left, mid, right);
}

function inPlaceMerge(arr, left, mid, right) {
    // Otimização: se já está ordenado
    if (arr[mid] <= arr[mid + 1]) return;
    
    while (left <= mid && mid + 1 <= right) {
        if (arr[left] <= arr[mid + 1]) {
            left++;
        } else {
            const value = arr[mid + 1];
            let index = mid + 1;
            
            // Shift elements
            while (index > left) {
                arr[index] = arr[index - 1];
                index--;
            }
            
            arr[left] = value;
            left++;
            mid++;
        }
    }
}
```

### 2. Merge Sort Híbrido (Merge + Insertion)

Usa Insertion Sort para arrays pequenos, reduzindo overhead recursivo.

```javascript
function hybridMergeSort(arr, threshold = 10) {
    if (arr.length <= threshold) {
        return insertionSort(arr);
    }
    
    if (arr.length <= 1) return arr;
    
    const mid = Math.floor(arr.length / 2);
    const left = hybridMergeSort(arr.slice(0, mid), threshold);
    const right = hybridMergeSort(arr.slice(mid), threshold);
    
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

### 3. Merge Sort Bottom-Up (Iterativo)

Elimina a recursão, economizando espaço de pilha.

```javascript
function bottomUpMergeSort(arr) {
    const n = arr.length;
    // Auxiliar array
    const aux = new Array(n);
    
    // Tamanho das submatrizes a serem mescladas
    // começa com 1 e dobra a cada iteração
    for (let size = 1; size < n; size *= 2) {
        // Índice inicial da esquerda para cada mesclagem
        for (let leftStart = 0; leftStart < n - size; leftStart += 2 * size) {
            const mid = leftStart + size - 1;
            const rightEnd = Math.min(leftStart + 2 * size - 1, n - 1);
            
            // Mescla subarrays arr[leftStart...mid] e arr[mid+1...rightEnd]
            bottomUpMerge(arr, aux, leftStart, mid, rightEnd);
        }
    }
    
    return arr;
}

function bottomUpMerge(arr, aux, leftStart, mid, rightEnd) {
    // Copia os elementos para o array auxiliar
    for (let k = leftStart; k <= rightEnd; k++) {
        aux[k] = arr[k];
    }
    
    let i = leftStart;
    let j = mid + 1;
    
    // Mescla de volta para arr
    for (let k = leftStart; k <= rightEnd; k++) {
        if (i > mid) {
            arr[k] = aux[j++];
        } else if (j > rightEnd) {
            arr[k] = aux[i++];
        } else if (aux[i] <= aux[j]) {
            arr[k] = aux[i++];
        } else {
            arr[k] = aux[j++];
        }
    }
}
```

## 🚀 Quick Sort - Análise Detalhada

### Conceito Fundamental

Quick Sort é um algoritmo de ordenação baseado em:
- Escolher um elemento como pivô
- Particionar o array (menores à esquerda, maiores à direita)
- Aplicar recursivamente às partições

### Visualização do Processo

```
Entrada: [7, 2, 1, 6, 8, 5, 3, 4]
Pivô: 4

Primeira Partição:
[7, 2, 1, 6, 8, 5, 3, 4] → Escolhe 4 como pivô
[2, 1, 3, 4, 8, 5, 7, 6] → Após partição

       4
      / \
 [2,1,3] [8,5,7,6]

Recursão Esquerda (pivô: 2):
[2, 1, 3]
[1, 2, 3]

       2
      / \
    [1] [3]

Recursão Direita (pivô: 6):
[8, 5, 7, 6]
[5, 6, 7, 8]

       6
      / \
    [5] [7,8]

Resultado: [1, 2, 3, 4, 5, 6, 7, 8]
```

#### Complexidade
- **Tempo**: 
  - Melhor caso: O(n log n)
  - Caso médio: O(n log n)
  - Pior caso: O(n²) - quando o pivô divide mal o array
- **Espaço**: O(log n) para a pilha de recursão
- **Estabilidade**: Não é estável

### Implementação Básica

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

// Exemplo de uso
const array = [7, 2, 1, 6, 8, 5, 3, 4];
console.log(quickSort(array)); // [1, 2, 3, 4, 5, 6, 7, 8]
```

### Rastreamento com Exemplo
```
quickSort([7, 2, 1, 6, 8, 5, 3, 4], 0, 7)
  pivotIndex = partition([7, 2, 1, 6, 8, 5, 3, 4], 0, 7) = 3
  array após partição: [2, 1, 3, 4, 8, 5, 7, 6]
  
  quickSort([2, 1, 3, 4, 8, 5, 7, 6], 0, 2)
    pivotIndex = partition([2, 1, 3, 4, 8, 5, 7, 6], 0, 2) = 1
    array após partição: [1, 2, 3, 4, 8, 5, 7, 6]
    
    quickSort([1, 2, 3, 4, 8, 5, 7, 6], 0, 0)
      return [1, 2, 3, 4, 8, 5, 7, 6]
      
    quickSort([1, 2, 3, 4, 8, 5, 7, 6], 2, 2)
      return [1, 2, 3, 4, 8, 5, 7, 6]
  
  quickSort([1, 2, 3, 4, 8, 5, 7, 6], 4, 7)
    pivotIndex = partition([1, 2, 3, 4, 8, 5, 7, 6], 4, 7) = 5
    array após partição: [1, 2, 3, 4, 5, 6, 7, 8]
    
    quickSort([1, 2, 3, 4, 5, 6, 7, 8], 4, 4)
      return [1, 2, 3, 4, 5, 6, 7, 8]
      
    quickSort([1, 2, 3, 4, 5, 6, 7, 8], 6, 7)
      pivotIndex = partition([1, 2, 3, 4, 5, 6, 7, 8], 6, 7) = 6
      array após partição: [1, 2, 3, 4, 5, 6, 7, 8]
      
      quickSort([1, 2, 3, 4, 5, 6, 7, 8], 6, 5)
        return [1, 2, 3, 4, 5, 6, 7, 8]
        
      quickSort([1, 2, 3, 4, 5, 6, 7, 8], 7, 7)
        return [1, 2, 3, 4, 5, 6, 7, 8]
```

## 🔄 Otimizações do Quick Sort

### 1. Escolha de Pivô Otimizada (Mediana de Três)

Melhora a divisão do array, evitando o pior caso.

```javascript
function medianOf3(arr, left, right) {
    const mid = Math.floor((left + right) / 2);
    
    // Ordena manualmente arr[left], arr[mid], arr[right]
    if (arr[mid] < arr[left]) {
        [arr[mid], arr[left]] = [arr[left], arr[mid]];
    }
    
    if (arr[right] < arr[left]) {
        [arr[right], arr[left]] = [arr[left], arr[right]];
    }
    
    if (arr[right] < arr[mid]) {
        [arr[right], arr[mid]] = [arr[mid], arr[right]];
    }
    
    // Coloca o pivô (mediana) no penúltimo elemento
    [arr[mid], arr[right - 1]] = [arr[right - 1], arr[mid]];
    
    return right - 1;
}

function optimizedQuickSort(arr, left = 0, right = arr.length - 1) {
    if (right - left > 10) { // Para arrays grandes
        const pivotIndex = medianOf3(arr, left, right);
        const newPivotIndex = partition(arr, left, right, pivotIndex);
        
        optimizedQuickSort(arr, left, newPivotIndex - 1);
        optimizedQuickSort(arr, newPivotIndex + 1, right);
    } else {
        // Insertion sort para arrays pequenos
        insertionSort(arr, left, right);
    }
    
    return arr;
}

function partition(arr, left, right, pivotIndex) {
    const pivot = arr[pivotIndex];
    
    // Move o pivô para o final
    [arr[pivotIndex], arr[right]] = [arr[right], arr[pivotIndex]];
    
    let i = left;
    
    for (let j = left; j < right; j++) {
        if (arr[j] <= pivot) {
            [arr[i], arr[j]] = [arr[j], arr[i]];
            i++;
        }
    }
    
    [arr[i], arr[right]] = [arr[right], arr[i]];
    return i;
}
```

### 2. Three-Way Partitioning (Dijkstra)

Lida eficientemente com arrays com muitos elementos duplicados.

```javascript
function threeWayQuickSort(arr, left = 0, right = arr.length - 1) {
    if (left >= right) return;
    
    const [lt, gt] = threeWayPartition(arr, left, right);
    threeWayQuickSort(arr, left, lt - 1);
    threeWayQuickSort(arr, gt + 1, right);
    
    return arr;
}

function threeWayPartition(arr, left, right) {
    const pivot = arr[left];
    let lt = left;      // arr[left..lt-1] < pivot
    let gt = right;     // arr[gt+1..right] > pivot
    let i = left + 1;   // arr[lt..i-1] == pivot
    
    while (i <= gt) {
        if (arr[i] < pivot) {
            [arr[lt], arr[i]] = [arr[i], arr[lt]];
            lt++;
            i++;
        } else if (arr[i] > pivot) {
            [arr[gt], arr[i]] = [arr[i], arr[gt]];
            gt--;
        } else {
            i++;
        }
    }
    
    return [lt, gt];
}

// Visualização da partição de 3 vias:
//  [valores < pivô | valores = pivô | não processados | valores > pivô]
//   left...lt-1      lt...i-1        i...gt           gt+1...right
```

### 3. Quick Sort Iterativo

Elimina a recursão, prevenindo estouro de pilha.

```javascript
function iterativeQuickSort(arr) {
    const stack = [];
    stack.push(0);
    stack.push(arr.length - 1);
    
    while (stack.length > 0) {
        const right = stack.pop();
        const left = stack.pop();
        
        if (right <= left) continue;
        
        const pivotIndex = partition(arr, left, right);
        
        // Empilha subarray da esquerda
        if (pivotIndex - 1 > left) {
            stack.push(left);
            stack.push(pivotIndex - 1);
        }
        
        // Empilha subarray da direita
        if (pivotIndex + 1 < right) {
            stack.push(pivotIndex + 1);
            stack.push(right);
        }
    }
    
    return arr;
}
```

## 🔄 Algoritmo Híbrido: Introsort

Combina Quick Sort, Heap Sort e Insertion Sort para obter o melhor desempenho em todos os casos.

```javascript
function introsort(arr) {
    const maxDepth = Math.floor(2 * Math.log2(arr.length));
    return introsortUtil(arr, 0, arr.length - 1, maxDepth);
}

function introsortUtil(arr, left, right, maxDepth) {
    // Se a profundidade máxima for zero, use heapsort
    if (maxDepth === 0) {
        heapSort(arr, left, right);
        return arr;
    }
    
    // Para arrays pequenos, use insertion sort
    if (right - left < 16) {
        insertionSort(arr, left, right);
        return arr;
    }
    
    // Otherwise, use quicksort
    const pivot = medianOf3(arr, left, right);
    const partitionIndex = partition(arr, left, right, pivot);
    
    introsortUtil(arr, left, partitionIndex - 1, maxDepth - 1);
    introsortUtil(arr, partitionIndex + 1, right, maxDepth - 1);
    
    return arr;
}
```

## 📈 Comparação: Merge Sort vs Quick Sort

| Característica          | Merge Sort                    | Quick Sort                   |
|-------------------------|-------------------------------|------------------------------|
| Complexidade (média)    | O(n log n)                    | O(n log n)                   |
| Complexidade (pior)     | O(n log n)                    | O(n²)                        |
| Uso de memória          | O(n)                          | O(log n)                     |
| Estabilidade            | Estável                       | Não estável                  |
| In-place                | Não (típico)                  | Sim                          |
| Casos ideais            | Listas ligadas, dados externos| Arrays, memória limitada     |
| Paralelizável           | Fácil                         | Mais difícil                 |
| Overhead                | Maior constante               | Menor constante              |

### Quando usar cada um?
- **Merge Sort**: Quando estabilidade é importante, tamanho do array é desconhecido, ou trabalhando com estruturas como listas ligadas
- **Quick Sort**: Quando memória é limitada, performance média é importante, ou trabalhando com arrays in-place

## 🔗 Conexões com Outros Algoritmos

- **Merge Sort → Ordenação Externa**: O conceito de merge é fundamental para algoritmos de ordenação de grandes volumes de dados que não cabem na memória.
  
- **Quick Sort → Binary Search Tree**: A estratégia do Quick Sort é similar à construção de uma BST. O pivô é a raiz, elementos menores vão para a esquerda, maiores para a direita.

- **Particionamento → Seleção**: O algoritmo de seleção de k-ésimo menor elemento (Quick Select) usa a mesma ideia de particionamento do Quick Sort.

## 🛠️ Exercícios Práticos

### Exercício 1: Merge Sort para Listas Ligadas
Adapte o Merge Sort para ordenar uma lista ligada, aproveitando sua natureza de "dividir e conquistar".

### Exercício 2: Particionamento Otimizado
Implementar o algoritmo de particionamento dual-pivot usado em Java para Arrays.sort().

### Exercício 3: Análise Comparativa
Criar um benchmark que compare diferentes variações de Quick Sort e Merge Sort em diversos tipos e tamanhos de dados.

## 🧠 O que aprendemos
- A estratégia "dividir e conquistar" é poderosa para algoritmos de ordenação
- Merge Sort garante O(n log n) em todos os casos, mas usa mais memória
- Quick Sort é geralmente mais rápido na prática, mas tem pior caso O(n²)
- Otimizações são essenciais para aplicações práticas desses algoritmos
- A escolha entre Merge Sort e Quick Sort depende das características do problema

No próximo capítulo, veremos o Heap Sort, que combina uma estrutura de dados interessante (heap) com um algoritmo de ordenação eficiente.