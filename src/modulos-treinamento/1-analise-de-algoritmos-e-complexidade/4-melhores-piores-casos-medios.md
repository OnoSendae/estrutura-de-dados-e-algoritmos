# Melhores, Piores e Casos Médios

Ao analisar algoritmos, é importante considerar seu desempenho em diferentes cenários, pois um algoritmo pode se comportar de forma muito diferente dependendo da entrada.

## Os Três Casos Importantes:

### 1. Melhor Caso (Best Case)
- Representa o cenário mais favorável possível
- A entrada que resulta no menor número de operações
- Denotado usando a notação Big Omega (Ω)

### 2. Pior Caso (Worst Case)
- Representa o cenário mais desfavorável possível
- A entrada que resulta no maior número de operações
- Denotado usando a notação Big O (O)
- Geralmente é o foco principal da análise, pois representa o limite superior de tempo/espaço

### 3. Caso Médio (Average Case)
- Representa o comportamento esperado para uma entrada típica ou aleatória
- Requer uma análise probabilística das possíveis entradas
- Denotado frequentemente usando a notação Big Theta (Θ)

## Exemplo Prático: Busca Linear vs. Binária

**Busca Linear em um Array:**
```javascript
function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) return i;
    }
    return -1;
}
```

Análise:
- Melhor caso (Ω(1)): O elemento procurado está na primeira posição
- Pior caso (O(n)): O elemento não está no array ou está na última posição
- Caso médio (Θ(n/2) ≈ Θ(n)): Em média, precisamos verificar metade dos elementos

**Busca Binária em um Array Ordenado:**
```javascript
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) return mid;
        
        if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}
```

Análise:
- Melhor caso (Ω(1)): O elemento está exatamente no meio do array
- Pior caso (O(log n)): O elemento não está no array ou está nas extremidades
- Caso médio (Θ(log n)): Muito próximo do pior caso

## Exemplo Detalhado: Quick Sort

O algoritmo Quick Sort é um excelente exemplo onde os diferentes casos têm complexidades drasticamente diferentes:

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
    const pivot = arr[right]; // Escolhendo o último elemento como pivô
    let i = left - 1;
    
    for (let j = left; j < right; j++) {
        if (arr[j] <= pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]]; // Troca
        }
    }
    
    [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]]; // Coloca o pivô na posição correta
    return i + 1;
}
```

Análise:
- Melhor caso (Ω(n log n)): O pivô sempre divide o array em duas partes iguais
- Pior caso (O(n²)): O pivô sempre é o menor ou maior elemento (array já ordenado com escolha de pivô ruim)
- Caso médio (Θ(n log n)): Com pivôs aleatórios ou escolha de pivô mais sofisticada

## Importância da Análise de Casos

1. **Previsibilidade**: Precisamos saber como o algoritmo se comportará em diferentes situações
2. **Garantias de Desempenho**: O pior caso define o limite superior do tempo de execução
3. **Escolha Informada**: Diferentes algoritmos podem ser melhores em cenários específicos
4. **Otimização**: Podemos focar em melhorar o caso que é mais relevante para nossa aplicação

## Tabela Comparativa: Algoritmos de Ordenação

| Algoritmo | Melhor Caso | Caso Médio | Pior Caso | Espaço |
|-----------|-------------|------------|-----------|--------|
| Bubble Sort | Ω(n) | Θ(n²) | O(n²) | O(1) |
| Insertion Sort | Ω(n) | Θ(n²) | O(n²) | O(1) |
| Selection Sort | Ω(n²) | Θ(n²) | O(n²) | O(1) |
| Merge Sort | Ω(n log n) | Θ(n log n) | O(n log n) | O(n) |
| Quick Sort | Ω(n log n) | Θ(n log n) | O(n²) | O(log n) |
| Heap Sort | Ω(n log n) | Θ(n log n) | O(n log n) | O(1) |

Na prática, apesar do Quick Sort ter um pior caso O(n²), ele frequentemente supera o Merge Sort em aplicações reais devido a fatores como localidade de referência e baixa constante multiplicativa.
