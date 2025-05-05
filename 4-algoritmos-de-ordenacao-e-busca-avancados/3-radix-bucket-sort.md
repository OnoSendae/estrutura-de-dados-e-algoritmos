# Radix Sort e Bucket Sort: Algoritmos de Ordenação Não Comparativos

## 🎯 Objetivos de Aprendizagem

- Entender o conceito de ordenação não-comparativa
- Implementar Counting Sort, Radix Sort e Bucket Sort
- Identificar cenários ideais para cada algoritmo
- Analisar complexidade temporal e espacial
- Comparar com algoritmos baseados em comparação

## 📚 Introdução à Ordenação Não-Comparativa

Enquanto algoritmos como Quick Sort e Merge Sort dependem de comparações entre elementos, os algoritmos não-comparativos usam informações sobre a estrutura dos dados para ordenar mais eficientemente.

### Limite Teórico
- Algoritmos baseados em comparação: Ω(n log n)
- Algoritmos não-comparativos: Podem quebrar esse limite!

### Comparação com Algoritmos Anteriores

| Algoritmo      | Base da Ordenação   | Complexidade     | Espaço     | Estável  |
|----------------|---------------------|------------------|------------|----------|
| Merge Sort     | Comparações         | O(n log n)       | O(n)       | Sim      |
| Quick Sort     | Comparações         | O(n log n) ~ O(n²)| O(log n) | Não      |
| Heap Sort      | Comparações         | O(n log n)       | O(1)       | Não      |
| Counting Sort  | Contagem            | O(n + k)         | O(n + k)   | Sim      |
| Radix Sort     | Dígitos             | O(d(n + k))      | O(n + k)   | Sim      |
| Bucket Sort    | Distribuição        | O(n + k)         | O(n + k)   | Sim      |

## 🔢 Counting Sort (Base para Radix Sort)

### Conceito
Conta a frequência de cada elemento e usa essa informação para posicioná-los.

### Funcionamento Visual

```
Array: [4, 2, 2, 8, 3, 3, 1]
Range: 1 a 9

1. Contador de frequência:
   Índice:  0  1  2  3  4  5  6  7  8  9
   Contagem: 0  1  2  2  1  0  0  0  1  0

2. Contador cumulativo (posição final):
   Índice:  0  1  2  3  4  5  6  7  8  9
   Contagem: 0  1  3  5  6  6  6  6  7  7

3. Construção do array ordenado:
   Entrada: [4, 2, 2, 8, 3, 3, 1]
   
   Elemento 1: posição 0 (contagem[1]-1 = 0)
   Saída: [1, _, _, _, _, _, _]
   
   Elemento 3: posição 4 (contagem[3]-1 = 4)
   Saída: [1, _, _, _, 3, _, _]
   
   Elemento 3: posição 3 (contagem[3]-1 = 3)
   Saída: [1, _, _, 3, 3, _, _]
   
   ...

   Resultado final: [1, 2, 2, 3, 3, 4, 8]
```

### Implementação

```javascript
function countingSort(arr, maxValue = null) {
    if (arr.length <= 1) return arr;
    
    if (maxValue === null) {
        maxValue = Math.max(...arr);
    }
    
    // Criar array de contagem
    const count = new Array(maxValue + 1).fill(0);
    
    // Contar frequência de cada elemento
    for (let i = 0; i < arr.length; i++) {
        count[arr[i]]++;
    }
    
    // Modificar count[i] para armazenar posição atual
    for (let i = 1; i <= maxValue; i++) {
        count[i] += count[i - 1];
    }
    
    // Construir array de saída
    const output = new Array(arr.length);
    for (let i = arr.length - 1; i >= 0; i--) {
        output[count[arr[i]] - 1] = arr[i];
        count[arr[i]]--;
    }
    
    // Copiar output para arr
    for (let i = 0; i < arr.length; i++) {
        arr[i] = output[i];
    }
    
    return arr;
}

// Exemplo de uso
const array = [4, 2, 2, 8, 3, 3, 1];
console.log(countingSort(array)); // [1, 2, 2, 3, 3, 4, 8]
```

### Versão Estável para uso com Radix Sort

```javascript
function stableCountingSort(arr, exp) {
    const n = arr.length;
    const output = new Array(n);
    const count = new Array(10).fill(0);
    
    // Armazenar contagem de ocorrências em count[]
    for (let i = 0; i < n; i++) {
        count[Math.floor(arr[i] / exp) % 10]++;
    }
    
    // Mudar count[i] para que contenha a posição atual do dígito
    for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }
    
    // Construir o array de saída
    for (let i = n - 1; i >= 0; i--) {
        const index = Math.floor(arr[i] / exp) % 10;
        output[count[index] - 1] = arr[i];
        count[index]--;
    }
    
    // Copiar array de saída para arr[]
    for (let i = 0; i < n; i++) {
        arr[i] = output[i];
    }
    
    return arr;
}
```

### Análise de Complexidade
- **Tempo**: O(n + k), onde k é o range de valores
- **Espaço**: O(k + n)
- **Estabilidade**: Estável (mantém ordem relativa de elementos iguais)
- **Requisitos**: Só funciona com valores inteiros (ou mapeáveis para inteiros)

## 🌟 Radix Sort

### Conceito
Ordena elementos processando dígito por dígito, da posição menos significativa (LSD) para a mais significativa (MSD), ou vice-versa.

### Vantagens
- Complexidade O(d × (n + k)), onde d é o número de dígitos
- Pode ser mais rápido que O(n log n) para números com poucos dígitos
- Mantém a estabilidade

### LSD Radix Sort (Least Significant Digit)

```javascript
function radixSortLSD(arr) {
    if (arr.length <= 1) return arr;
    
    // Encontrar o maior número para saber número de dígitos
    const maxNum = Math.max(...arr);
    
    // Fazer counting sort para cada dígito
    for (let exp = 1; Math.floor(maxNum / exp) > 0; exp *= 10) {
        stableCountingSort(arr, exp);
    }
    
    return arr;
}

// Exemplo de uso
const numbers = [170, 45, 75, 90, 2, 802, 24, 66];
console.log(radixSortLSD(numbers)); // [2, 24, 45, 66, 75, 90, 170, 802]
```

### Visualização do LSD Radix Sort

```
Array: [170, 45, 75, 90, 2, 802, 24, 66]

Passo 1: Ordenar por unidades (exp = 1)
Dígitos:    [0,  5,  5,  0,  2,   2,  4,  6]
Resultado:  [170, 90, 2, 802, 24, 45, 75, 66]

Passo 2: Ordenar por dezenas (exp = 10)
Dígitos:    [7,  9,  0,  0,  2,   4,  7,  6]
Resultado:  [2, 802, 24, 45, 66, 170, 75, 90]

Passo 3: Ordenar por centenas (exp = 100)
Dígitos:    [1,  0,  0,  0,  0,   1,  0,  0]
Resultado:  [2, 24, 45, 66, 75, 90, 170, 802]

Passo 4: Ordenar por milhares (exp = 1000)
Dígitos:    [0,  0,  0,  0,  0,   0,  0,  0]
Resultado:  [2, 24, 45, 66, 75, 90, 170, 802]

Array final: [2, 24, 45, 66, 75, 90, 170, 802]
```

### MSD Radix Sort (Most Significant Digit)

```javascript
function radixSortMSD(arr, left = 0, right = arr.length - 1, digit = 0) {
    if (left >= right) return;
    
    const maxDigits = getMaxDigits(arr, left, right);
    if (digit >= maxDigits) return;
    
    // Particionar array baseado no dígito atual
    const buckets = Array(10).fill().map(() => []);
    
    for (let i = left; i <= right; i++) {
        const digitValue = getDigit(arr[i], digit);
        buckets[digitValue].push(arr[i]);
    }
    
    // Mover elementos de volta para o array principal
    let index = left;
    for (let i = 0; i < 10; i++) {
        if (buckets[i].length > 0) {
            for (let j = 0; j < buckets[i].length; j++) {
                arr[index++] = buckets[i][j];
            }
            
            // Recursivamente ordenar cada bucket
            radixSortMSD(arr, index - buckets[i].length, index - 1, digit + 1);
        }
    }
}

function getDigit(num, position) {
    return Math.floor(Math.abs(num) / Math.pow(10, position)) % 10;
}

function getMaxDigits(arr, left, right) {
    let max = 0;
    for (let i = left; i <= right; i++) {
        max = Math.max(max, Math.floor(Math.log10(Math.abs(arr[i] || 1))) + 1);
    }
    return max;
}
```

### Visualização do MSD Radix Sort

```
Array: [170, 45, 75, 90, 2, 802, 24, 66]

Passo 1: Ordenar por dígito mais significativo
Partições por primeiro dígito:
  Dígito 0: [2, 24, 45, 66, 75, 90]
  Dígito 1: [170]
  Dígito 8: [802]

Passo 2: Ordenar recursivamente cada partição
  Para dígito 0:
    Ordenar por segundo dígito: [2, 24, 45, 66, 75, 90]
  Para dígito 1:
    Só contém 170, já ordenado
  Para dígito 8:
    Só contém 802, já ordenado

Passo 3: Combinar partições
  Resultado: [2, 24, 45, 66, 75, 90, 170, 802]
```

### Radix Sort para Strings

```javascript
function radixSortStrings(arr) {
    if (arr.length <= 1) return arr;
    
    // Encontrar o comprimento máximo da string
    const maxLength = Math.max(...arr.map(str => str.length));
    
    // Preencher strings menores com espaços para torná-las do mesmo tamanho
    const paddedArr = arr.map(str => str.padEnd(maxLength, ' '));
    
    // Processar cada posição da direita para a esquerda
    for (let pos = maxLength - 1; pos >= 0; pos--) {
        countingSortByCharacter(paddedArr, pos);
    }
    
    // Remover padding
    return paddedArr.map(str => str.trim());
}

function countingSortByCharacter(arr, position) {
    const n = arr.length;
    const output = new Array(n);
    const count = new Array(256).fill(0); // ASCII characters
    
    // Contar ocorrências
    for (let i = 0; i < n; i++) {
        count[arr[i].charCodeAt(position)]++;
    }
    
    // Transformar em posições
    for (let i = 1; i < 256; i++) {
        count[i] += count[i - 1];
    }
    
    // Construir output
    for (let i = n - 1; i >= 0; i--) {
        const charCode = arr[i].charCodeAt(position);
        output[count[charCode] - 1] = arr[i];
        count[charCode]--;
    }
    
    // Copiar de volta
    for (let i = 0; i < n; i++) {
        arr[i] = output[i];
    }
}

// Exemplo de uso
const strings = ["apple", "banana", "cat", "dog", "elephant"];
console.log(radixSortStrings(strings)); // ["apple", "banana", "cat", "dog", "elephant"]
```

### Análise de Complexidade - Radix Sort
- **Tempo**: O(d × (n + k))
  - d = número de dígitos
  - n = número de elementos
  - k = range de cada dígito (10 para decimal)
- **Espaço**: O(n + k)
- **Estabilidade**: Estável

## 🪣 Bucket Sort

### Conceito
Distribui elementos em buckets e então os ordena individualmente.

### Vantagens
- Ideal para distribuição uniforme
- Pode utilizar qualquer algoritmo para ordenar os buckets
- Paralelizável (cada bucket pode ser ordenado independentemente)

### Implementação Básica

```javascript
function bucketSort(arr, bucketSize = 5) {
    if (arr.length <= 1) return arr;
    
    // Encontrar valor mínimo e máximo
    let min = arr[0], max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < min) min = arr[i];
        if (arr[i] > max) max = arr[i];
    }
    
    // Calcular número de buckets
    const bucketCount = Math.floor((max - min) / bucketSize) + 1;
    const buckets = Array(bucketCount).fill().map(() => []);
    
    // Distribuir elementos nos buckets
    for (let i = 0; i < arr.length; i++) {
        const bucketIndex = Math.floor((arr[i] - min) / bucketSize);
        buckets[bucketIndex].push(arr[i]);
    }
    
    // Ordenar cada bucket e concatenar resultados
    const result = [];
    for (let i = 0; i < bucketCount; i++) {
        // Usar insertion sort para cada bucket
        insertionSort(buckets[i]);
        result.push(...buckets[i]);
    }
    
    return result;
}

function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        const current = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > current) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = current;
    }
    return arr;
}

// Exemplo de uso
const array = [0.42, 0.32, 0.33, 0.52, 0.37, 0.47, 0.51];
console.log(bucketSort(array)); // [0.32, 0.33, 0.37, 0.42, 0.47, 0.51, 0.52]
```

### Visualização do Bucket Sort

```
Array: [0.42, 0.32, 0.33, 0.52, 0.37, 0.47, 0.51]
Buckets (tamanho 0.1):

Bucket 0 (0.3-0.4): [0.32, 0.33, 0.37]
Bucket 1 (0.4-0.5): [0.42, 0.47]
Bucket 2 (0.5-0.6): [0.52, 0.51]

Após ordenar cada bucket:
Bucket 0: [0.32, 0.33, 0.37]
Bucket 1: [0.42, 0.47]
Bucket 2: [0.51, 0.52]

Concatenando: [0.32, 0.33, 0.37, 0.42, 0.47, 0.51, 0.52]
```

### Otimização: Bucket Sort Adaptativo

```javascript
function adaptiveBucketSort(arr) {
    if (arr.length <= 1) return arr;
    
    // Encontrar min e max
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const range = max - min;
    
    // Adaptar número de buckets baseado no tamanho e range
    const n = arr.length;
    const bucketCount = Math.ceil(Math.sqrt(n));
    const bucketSize = range / bucketCount;
    
    if (bucketSize === 0) return arr;  // Todos valores iguais
    
    const buckets = Array(bucketCount).fill().map(() => []);
    
    // Distribuir nos buckets
    for (let i = 0; i < n; i++) {
        const bucketIndex = Math.min(
            Math.floor((arr[i] - min) / bucketSize),
            bucketCount - 1
        );
        buckets[bucketIndex].push(arr[i]);
    }
    
    // Escolher algoritmo por tamanho do bucket
    const result = [];
    for (let i = 0; i < bucketCount; i++) {
        const bucket = buckets[i];
        if (bucket.length <= 0) continue;
        
        if (bucket.length > 10) {
            // Para buckets grandes, quick sort ou outro algoritmo eficiente
            quickSort(bucket);
        } else {
            // Para buckets pequenos, insertion sort
            insertionSort(bucket);
        }
        
        result.push(...bucket);
    }
    
    return result;
}

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

## 📊 Comparação Detalhada

### Cenários Ideais para Cada Algoritmo

| Algoritmo     | Quando Usar                                      | Quando Evitar                           |
|---------------|--------------------------------------------------|----------------------------------------|
| Counting Sort | Pequeno range de valores inteiros                | Grande range, valores não inteiros      |
| Radix Sort    | Números inteiros grandes, strings de tamanho fixo | Valores com muitos dígitos, floats complexos |
| Bucket Sort   | Distribuição uniforme de dados, paralelizável    | Dados altamente agrupados, distribuição desigual |
| Quick Sort    | Uso geral, pouca memória extra                   | Requisito de estabilidade              |
| Merge Sort    | Estabilidade necessária, dados externos          | Limitação de memória                   |
| Heap Sort     | Garantia de pior caso, memória limitada          | Necessidade de estabilidade            |

### Análise Comparativa de Complexidades

```
               n       n log n                          n²
               |          |                             |
Counting Sort: +----|
Radix Sort:    +-----|
Bucket Sort:   +------|         |                       +------
Merge Sort:    |       +--------|
Quick Sort:    |       +--------|                       +------
Heap Sort:     |       +--------|
```

## 🧠 Escolhendo o Algoritmo Certo

### Fluxograma de Decisão

```
                      ┌─────────────────┐
                      │  Começar aqui   │
                      └────────┬────────┘
                               │
                ┌──────────────┴─────────────┐
                │  Qual o tipo de dados?     │
                └──────────────┬─────────────┘
                               │
            ┌─────────────────┬┴────────────────┐
            │                 │                 │
  ┌─────────▼─────────┐ ┌─────▼──────────┐ ┌────▼────────────┐
  │    Números        │ │   Strings      │ │ Objetos/Records │
  │ inteiros pequenos │ │                │ │                 │
  └─────────┬─────────┘ └─────┬──────────┘ └────┬────────────┘
            │                 │                 │
  ┌─────────▼─────────┐ ┌─────▼──────────┐ ┌────▼────────────┐
  │  Counting Sort    │ │  Radix Sort    │ │   Compare Key   │
  │  ou Radix Sort    │ │  para strings  │ │   Quick/Merge   │
  └───────────────────┘ └────────────────┘ └─────────────────┘
```

### Heurísticas para Seleção

1. **Se o range de valores é conhecido e pequeno em relação ao tamanho da entrada:**
   - Use Counting Sort

2. **Se os dados são inteiros com número limitado de dígitos:**
   - Use Radix Sort

3. **Se os dados são uniformemente distribuídos em um intervalo:**
   - Use Bucket Sort

4. **Se a estabilidade é necessária e memória extra é aceitável:**
   - Use Merge Sort

5. **Se a memória é limitada e pior caso O(n²) é aceitável:**
   - Use Quick Sort com boas heurísticas de pivô

6. **Se garantia de O(n log n) é necessária com memória limitada:**
   - Use Heap Sort

## 🔄 Algoritmo Híbrido: IntroSort++

```javascript
function introSortPlus(arr) {
    // Analisa os dados para decidir a estratégia
    const maxValue = Math.max(...arr);
    const n = arr.length;
    
    // Se range é pequeno comparado ao tamanho, usar counting/radix
    if (maxValue < n * 10 && isIntegerArray(arr)) {
        if (maxValue < n) {
            return countingSort(arr);
        } else {
            return radixSortLSD([...arr]);
        }
    }
    
    // Verifica distribuição
    const sample = getSample(arr, Math.min(100, n));
    if (isUniformlyDistributed(sample)) {
        return bucketSort([...arr]);
    }
    
    // Caso contrário, recorre ao IntroSort
    const maxDepth = Math.floor(2 * Math.log2(n));
    return introsort([...arr], 0, n - 1, maxDepth);
}

function isIntegerArray(arr) {
    for (let i = 0; i < Math.min(100, arr.length); i++) {
        if (!Number.isInteger(arr[i])) return false;
    }
    return true;
}

function isUniformlyDistributed(sample) {
    // Implementação de teste estatístico para uniformidade
    // Simplificado por brevidade
    return true;
}
```

## 🛠️ Exercícios Práticos

### Exercício 1: Sistema de Classificação de Notas
Implemente um sistema que classifique notas de alunos usando o algoritmo mais apropriado.

```javascript
function gradeClassifier(grades) {
    // Classificar usando counting sort (notas geralmente entre 0-100)
    const sortedGrades = countingSort(grades);
    
    // Atribuir conceitos
    const graded = sortedGrades.map(grade => {
        if (grade >= 90) return 'A';
        if (grade >= 80) return 'B';
        if (grade >= 70) return 'C';
        if (grade >= 60) return 'D';
        return 'F';
    });
    
    return {
        sortedGrades,
        graded,
        stats: calculateStats(sortedGrades)
    };
}

function calculateStats(grades) {
    // TODO: Calcular média, mediana, moda, percentis, etc.
}
```

### Exercício 2: Ordenação de Log de Rede
Implemente um sistema para ordenar logs de rede por diferentes campos.

```javascript
function sortNetworkLogs(logs, field) {
    switch (field) {
        case 'timestamp':
            // Use radix sort para timestamps (são números sequenciais)
            return sortByTimestamp(logs);
        case 'ip':
            // Use radix sort especializado para IPs
            return sortByIP(logs);
        case 'status':
            // Use counting sort para códigos HTTP (range pequeno)
            return sortByStatus(logs);
        default:
            // Use algoritmo geral para outros campos
            return sortByGeneral(logs, field);
    }
}
```

### Exercício 3: Algoritmo Híbrido
Implemente seu próprio algoritmo de ordenação híbrido que escolha automaticamente entre diferentes algoritmos baseado nas características dos dados.

```javascript
function smartSort(arr) {
    // TODO: Analisar características e escolher algoritmo
    // Dica: Considere tamanho, tipo de dado, distribuição e range
}
```

## 🧠 O que aprendemos
- Algoritmos não-comparativos usam características dos dados para ordenar
- Counting Sort é ideal para ranges pequenos e conhecidos
- Radix Sort processa os dados dígito por dígito
- Bucket Sort distribui elementos em buckets para ordenação
- A escolha do algoritmo correto depende das características dos dados
- Em cenários ideais, estes algoritmos superam o limite de O(n log n)

No próximo capítulo, exploraremos algoritmos avançados de busca em texto, incluindo KMP e Boyer-Moore, que são essenciais para processamento de strings e buscas eficientes.