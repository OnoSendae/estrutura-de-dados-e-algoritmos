# Heap Sort: Implementação e Aplicações

## 🎯 Objetivos de Aprendizagem

- Compreender a estrutura de dados Heap
- Implementar Heap Sort eficientemente
- Aplicar Heaps em problemas práticos
- Criar uma Priority Queue usando Heap
- Conectar conhecimentos de árvores binárias do módulo 3

## 📚 Revisão: Árvores Binárias Completas

Relembrando do Módulo 3, uma árvore binária completa é uma árvore onde:
- Todos os níveis, exceto possivelmente o último, estão completamente preenchidos
- Os nós do último nível estão alinhados à esquerda

```
Árvore Binária Completa:
        A
       / \
      B   C
     / \  /
    D  E F

Árvore Binária Não-Completa:
        A
       / \
      B   C
         / \
        D   E
```

O Heap é um tipo especial de árvore binária completa.

## 🔍 Conceitos Fundamentais de Heap

### O que é um Heap?

Um heap é uma árvore binária completa que satisfaz a propriedade de heap:
- **Max-Heap**: Cada nó pai é maior ou igual a seus filhos
- **Min-Heap**: Cada nó pai é menor ou igual a seus filhos

### Visualização de Heaps

```
Max-Heap:            Min-Heap:
      90                  10
     /  \                /  \
   70    80            30    20
  / \    /            / \    /
 40 60  50           35 40  25

Array representação:      Array representação:
[90, 70, 80, 40, 60, 50]  [10, 30, 20, 35, 40, 25]
```

### Fórmulas de Acesso em Array

Para um nó na posição `i` (base 0):
- **Pai**: `Math.floor((i - 1) / 2)`
- **Filho esquerdo**: `(2 * i) + 1`
- **Filho direito**: `(2 * i) + 2`

### Implementação Básica

```javascript
class Heap {
    constructor(comparator = (a, b) => a - b) {
        this.heap = [];
        this.comparator = comparator;
    }
    
    getParentIndex(index) {
        return Math.floor((index - 1) / 2);
    }
    
    getLeftChildIndex(index) {
        return (2 * index) + 1;
    }
    
    getRightChildIndex(index) {
        return (2 * index) + 2;
    }
    
    // Verifica se índice tem filho esquerdo
    hasLeftChild(index) {
        return this.getLeftChildIndex(index) < this.heap.length;
    }
    
    // Verifica se índice tem filho direito
    hasRightChild(index) {
        return this.getRightChildIndex(index) < this.heap.length;
    }
    
    // Verifica se índice tem pai
    hasParent(index) {
        return this.getParentIndex(index) >= 0;
    }
    
    // Obtém o valor do pai
    parent(index) {
        return this.heap[this.getParentIndex(index)];
    }
    
    // Obtém o valor do filho esquerdo
    leftChild(index) {
        return this.heap[this.getLeftChildIndex(index)];
    }
    
    // Obtém o valor do filho direito
    rightChild(index) {
        return this.heap[this.getRightChildIndex(index)];
    }
    
    // Troca elementos
    swap(indexA, indexB) {
        [this.heap[indexA], this.heap[indexB]] = 
        [this.heap[indexB], this.heap[indexA]];
    }
}
```

## 🔧 Operações Fundamentais

### 1. Heapify Up (Bubble Up)

Mantém a propriedade do heap quando inserimos um novo elemento.

```javascript
heapifyUp() {
    let index = this.heap.length - 1;
    
    // Min-heap implementation
    while (this.hasParent(index) && 
           this.comparator(this.heap[index], this.parent(index)) < 0) {
        const parentIndex = this.getParentIndex(index);
        this.swap(parentIndex, index);
        index = parentIndex;
    }
}
```

#### Visualização de Heapify Up

```
Inserindo 25 em um min-heap:

      10                   10
     /  \                 /  \
   30    20     →       25    20
  / \                  / \
 35 40                35 40
  \                    \
  25                   30

Passos:
1. Inserir 25 como última folha
2. Comparar com pai (30): 25 < 30, trocar
3. Comparar com novo pai (10): 25 > 10, parar
```

### 2. Heapify Down (Sink Down)

Mantém a propriedade do heap quando removemos o elemento raiz.

```javascript
heapifyDown(index = 0) {
    let current = index;
    let smallest = current;
    
    while (true) {
        // Verifica filho esquerdo
        if (this.hasLeftChild(current) && 
            this.comparator(this.leftChild(current), this.heap[smallest]) < 0) {
            smallest = this.getLeftChildIndex(current);
        }
        
        // Verifica filho direito
        if (this.hasRightChild(current) && 
            this.comparator(this.rightChild(current), this.heap[smallest]) < 0) {
            smallest = this.getRightChildIndex(current);
        }
        
        // Se o menor não é o atual, troca
        if (smallest !== current) {
            this.swap(current, smallest);
            current = smallest;
        } else {
            break;
        }
    }
}
```

#### Visualização de Heapify Down

```
Removendo o topo de um min-heap:

      10                   40                   20
     /  \                 /  \                 /  \
   20    30     →       20    30     →       35    30
  / \                  / \                  /
 35 40                35                   40

Passos:
1. Remover 10 (topo)
2. Mover 40 (último) para o topo
3. Compare 40 com filhos (20, 30): 20 < 40, trocar com 20
4. Compare 40 com filhos (35): 35 < 40, trocar com 35
5. Não tem mais filhos, parar
```

### 3. Inserção e Remoção

```javascript
// Inserir elemento
insert(item) {
    this.heap.push(item);
    this.heapifyUp();
    return this;
}

// Remover elemento raiz (min/max)
poll() {
    if (this.heap.length === 0) return null;
    
    const item = this.heap[0];
    const lastItem = this.heap.pop();
    
    if (this.heap.length > 0) {
        this.heap[0] = lastItem;
        this.heapifyDown();
    }
    
    return item;
}

// Ver elemento raiz sem remover
peek() {
    if (this.heap.length === 0) return null;
    return this.heap[0];
}

// Tamanho do heap
size() {
    return this.heap.length;
}

// Verificar se está vazio
isEmpty() {
    return this.heap.length === 0;
}
```

## 🚀 Heap Sort: Implementação e Rastreamento

### Algoritmo Heap Sort

1. Construir um max-heap a partir do array
2. Trocar o elemento raiz (máximo) com o último elemento
3. Reduzir o tamanho do heap e heapificar a raiz
4. Repetir passos 2-3 até o heap estar vazio

### Implementação Completa

```javascript
function heapSort(arr) {
    const n = arr.length;
    
    // Construir heap (reorganizar array)
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }
    
    // Extrair elementos um por um do heap
    for (let i = n - 1; i > 0; i--) {
        // Move raiz atual para o final
        [arr[0], arr[i]] = [arr[i], arr[0]];
        
        // Chama heapify na heap reduzida
        heapify(arr, i, 0);
    }
    
    return arr;
}

// Heapify uma subárvore com raiz em i
function heapify(arr, heapSize, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    // Se filho esquerdo é maior que raiz
    if (left < heapSize && arr[left] > arr[largest]) {
        largest = left;
    }
    
    // Se filho direito é maior que o maior atual
    if (right < heapSize && arr[right] > arr[largest]) {
        largest = right;
    }
    
    // Se maior não é raiz
    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        
        // Recursivamente heapify a subárvore afetada
        heapify(arr, heapSize, largest);
    }
}

// Exemplo de uso
const array = [12, 11, 13, 5, 6, 7];
console.log("Array original:", array);
console.log("Array ordenado:", heapSort(array));
```

### Rastreamento do Heap Sort

```
Array: [4, 10, 3, 5, 1]

Construção do heap:
Inicialmente: [4, 10, 3, 5, 1]

heapify(arr, 5, 1): 
  - i=1, [4, 10, 3, 5, 1]
  - Filho esquerdo não existe, filho direito não existe
  - Não há mudanças

heapify(arr, 5, 0):
  - i=0, [4, 10, 3, 5, 1]
  - Filho esquerdo (10) > 4, largest = 1
  - [10, 4, 3, 5, 1]
  - Recursão: heapify(arr, 5, 1) - sem mudanças

Heap construído: [10, 5, 3, 4, 1]

Extração:
1. Troca [10, 5, 3, 4, 1] → [1, 5, 3, 4, 10]
   heapify(arr, 4, 0):
      - Filho esquerdo (5) > 1, largest = 1
      - [5, 1, 3, 4, 10]
      - Recursão para subárvore afetada

2. Troca [5, 1, 3, 4, 10] → [4, 1, 3, 5, 10]
   heapify(arr, 3, 0):
      - Filho direito (3) > 4? Não
      - Continua

3. Troca [4, 1, 3, 5, 10] → [3, 1, 4, 5, 10]
   heapify(arr, 2, 0):
      ...

4. Final: [1, 3, 4, 5, 10]
```

## 📊 Análise de Complexidade

### Tempo
- **Construção do Heap**: O(n)
- **Heapify Down**: O(log n)
- **Heap Sort Total**: O(n log n)

### Espaço
- **Heap Sort**: O(1) - in-place
- **Priority Queue**: O(n)

### Comparação com Outros Algoritmos

| Algoritmo   | Melhor Caso | Caso Médio  | Pior Caso  | Espaço | Estável |
|-------------|-------------|-------------|------------|--------|---------|
| Heap Sort   | O(n log n)  | O(n log n)  | O(n log n) | O(1)   | Não     |
| Quick Sort  | O(n log n)  | O(n log n)  | O(n²)      | O(log n)| Não    |
| Merge Sort  | O(n log n)  | O(n log n)  | O(n log n) | O(n)   | Sim     |

## 🏆 Aplicações Práticas da Estrutura Heap

### 1. Priority Queue (Fila de Prioridade)

```javascript
class PriorityQueue {
    constructor(comparator = (a, b) => a.priority - b.priority) {
        this.heap = new Heap(comparator);
    }
    
    // Adicionar elemento com prioridade
    enqueue(item, priority) {
        this.heap.insert({ item, priority });
        return this;
    }
    
    // Remover elemento com maior prioridade
    dequeue() {
        const top = this.heap.poll();
        return top ? top.item : null;
    }
    
    // Ver próximo elemento sem remover
    peek() {
        const top = this.heap.peek();
        return top ? top.item : null;
    }
    
    size() {
        return this.heap.size();
    }
    
    isEmpty() {
        return this.heap.isEmpty();
    }
}

// Exemplo de uso:
const taskQueue = new PriorityQueue((a, b) => b.priority - a.priority);
taskQueue.enqueue("Tarefa de baixa prioridade", 1);
taskQueue.enqueue("Tarefa crítica", 10);
taskQueue.enqueue("Tarefa regular", 5);

console.log(taskQueue.dequeue()); // "Tarefa crítica"
console.log(taskQueue.dequeue()); // "Tarefa regular"
```

### 2. Algoritmo de Dijkstra (Conexão com Módulo 3)

Usando Priority Queue para encontrar o caminho mais curto em um grafo:

```javascript
function dijkstra(graph, start) {
    const distances = {};
    const pq = new PriorityQueue((a, b) => a.priority - b.priority);
    const previous = {};
    
    // Inicializar distâncias
    for (let vertex in graph) {
        distances[vertex] = vertex === start ? 0 : Infinity;
    }
    
    pq.enqueue(start, 0);
    
    while (!pq.isEmpty()) {
        const current = pq.dequeue();
        
        for (let [neighbor, weight] of graph[current]) {
            const distance = distances[current] + weight;
            
            if (distance < distances[neighbor]) {
                distances[neighbor] = distance;
                previous[neighbor] = current;
                pq.enqueue(neighbor, distance);
            }
        }
    }
    
    return { distances, previous };
}
```

### 3. Top K Elements (Heap parcial)

Encontrar os K maiores elementos em um array:

```javascript
function findTopKElements(arr, k) {
    if (k <= 0 || arr.length === 0) return [];
    
    // Usar um min-heap de tamanho k
    const minHeap = new Heap();
    
    for (let i = 0; i < arr.length; i++) {
        if (minHeap.size() < k) {
            minHeap.insert(arr[i]);
        } else if (arr[i] > minHeap.peek()) {
            minHeap.poll();
            minHeap.insert(arr[i]);
        }
    }
    
    // Extrair resultados
    const result = [];
    while (!minHeap.isEmpty()) {
        result.unshift(minHeap.poll());
    }
    
    return result;
}

// Exemplo: [3, 1, 5, 12, 2, 11], k=3 → [5, 11, 12]
```

### 4. Ordenação Contínua de Streams de Dados

```javascript
class StreamSorter {
    constructor() {
        this.minHeap = new Heap();
    }
    
    // Adicionar novo valor ao stream
    add(value) {
        this.minHeap.insert(value);
        return this;
    }
    
    // Obter todos valores ordenados até agora
    getSorted() {
        const tempHeap = new Heap();
        const result = [];
        
        // Copiar heap atual
        while (!this.minHeap.isEmpty()) {
            const value = this.minHeap.poll();
            result.push(value);
            tempHeap.insert(value);
        }
        
        // Restaurar heap original
        this.minHeap = tempHeap;
        
        return result;
    }
    
    // Obter mediana atual
    getMedian() {
        const sorted = this.getSorted();
        const mid = Math.floor(sorted.length / 2);
        
        if (sorted.length % 2 === 0) {
            return (sorted[mid - 1] + sorted[mid]) / 2;
        } else {
            return sorted[mid];
        }
    }
}
```

## 🧠 Conexão com Módulo 3: Árvores

O Heap é uma implementação especializada de Árvore Binária Completa (vista no Módulo 3). Algumas conexões:

1. **Árvore Binária de Busca vs Heap**:
   - BST: Ordenada horizontalmente (esquerda < nó < direita)
   - Heap: Ordenada verticalmente (pai > ou < filhos)

2. **Operações em comum**:
   - Inserção
   - Remoção
   - Travessia (percorre a árvore)

3. **Diferenças chave**:
   - BST permite busca eficiente
   - Heap é ideal para encontrar min/max rapidamente
   - Heap garante forma completa, BST pode ser desbalanceada

## 🛠️ Exercícios Práticos

### Exercício 1: Implementar uma Merge Queue
Crie uma estrutura que mescle várias filas de prioridade mantendo a ordenação.

### Exercício 2: Heap Mediano
Implemente uma estrutura que mantenha continuamente a mediana de um stream de números.

```javascript
class MedianFinder {
    constructor() {
        // MaxHeap para metade inferior
        this.lowerHalf = new Heap((a, b) => b - a);
        // MinHeap para metade superior
        this.upperHalf = new Heap((a, b) => a - b);
    }
    
    // TODO: Adicionar um número ao stream
    addNum(num) {
        // Dica: Balancear os dois heaps para manter a mediana
    }
    
    // TODO: Retornar a mediana atual
    findMedian() {
        // Dica: Se heaps tem mesmo tamanho, mediana é média dos topos
        // Caso contrário, é o topo do heap maior
    }
}
```

### Exercício 3: K-Way Merge
Implemente um algoritmo que mescle K arrays ordenados usando um heap.

```javascript
function mergeKSortedArrays(arrays) {
    // TODO: Usar min-heap para mesclar K arrays eficientemente
    // Dica: Cada elemento do heap deve conter valor, índice do array e posição
}
```

## 🚂 Projeto: Sistema de Agendamento de Tarefas

Aplique seus conhecimentos de heap para criar um sistema de agendamento que:
1. Enfileira tarefas com prioridades diferentes
2. Executa tarefas de acordo com prioridade e deadlines
3. Permite reagendar e cancelar tarefas
4. Fornece estatísticas de desempenho

## 🧠 O que aprendemos
- Heap é uma estrutura de dados em árvore com propriedades especiais
- Heap Sort oferece ordenação garantida O(n log n) com espaço O(1)
- Priority Queue é uma aplicação poderosa do heap
- Heaps são ideais para problemas de Top-K e ordenação parcial
- A estrutura heap conecta nosso conhecimento de árvores (Módulo 3) com algoritmos eficientes de ordenação

No próximo capítulo, exploraremos algoritmos não-comparativos como Radix Sort e Bucket Sort, que podem superar o limite teórico de O(n log n) para algoritmos baseados em comparação.