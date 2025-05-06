# Pilhas e Filas

## Pilhas (Stacks): Fundamentos e Aplicações

### O que é uma Pilha?

Uma pilha é uma estrutura de dados linear que segue o princípio **LIFO** (Last-In-First-Out), ou seja, o último elemento inserido é o primeiro a ser removido. Imagine uma pilha de pratos: você adiciona e remove pratos sempre do topo.

### Representação Visual

```
       ┌───────┐
       │   D   │ ← Topo (último elemento adicionado)
       ├───────┤
       │   C   │
       ├───────┤
       │   B   │
       ├───────┤
       │   A   │ ← Base (primeiro elemento adicionado)
       └───────┘
```

### Operações Fundamentais

1. **push(elemento)**: Adiciona um elemento no topo da pilha
2. **pop()**: Remove e retorna o elemento do topo da pilha
3. **peek()** ou **top()**: Retorna o elemento do topo sem removê-lo
4. **isEmpty()**: Verifica se a pilha está vazia
5. **size()**: Retorna o número de elementos na pilha

### Análise de Complexidade

| Operação | Complexidade de Tempo |
|----------|----------------------|
| Push     | O(1)                 |
| Pop      | O(1)                 |
| Peek     | O(1)                 |
| isEmpty  | O(1)                 |
| Size     | O(1)                 |

### Implementações de Pilha

#### 1. Implementação com Array

```javascript
class ArrayStack {
    constructor() {
        this.items = [];
    }
    
    // Adiciona elemento no topo
    push(element) {
        this.items.push(element);
    }
    
    // Remove e retorna o elemento do topo
    pop() {
        if (this.isEmpty()) {
            return "Underflow - Pilha vazia";
        }
        return this.items.pop();
    }
    
    // Retorna o elemento do topo sem remover
    peek() {
        if (this.isEmpty()) {
            return "Pilha vazia";
        }
        return this.items[this.items.length - 1];
    }
    
    // Verifica se a pilha está vazia
    isEmpty() {
        return this.items.length === 0;
    }
    
    // Retorna o tamanho da pilha
    size() {
        return this.items.length;
    }
    
    // Limpa a pilha
    clear() {
        this.items = [];
    }
    
    // Imprime a pilha (do topo para a base)
    print() {
        let str = "";
        for (let i = this.items.length - 1; i >= 0; i--) {
            str += this.items[i] + " ";
        }
        return str;
    }
}
```

#### 2. Implementação com Lista Encadeada

```javascript
class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class LinkedStack {
    constructor() {
        this.top = null;
        this.size = 0;
    }
    
    // Adiciona elemento no topo
    push(data) {
        const newNode = new Node(data);
        newNode.next = this.top;
        this.top = newNode;
        this.size++;
    }
    
    // Remove e retorna o elemento do topo
    pop() {
        if (this.isEmpty()) {
            return "Underflow - Pilha vazia";
        }
        
        const data = this.top.data;
        this.top = this.top.next;
        this.size--;
        return data;
    }
    
    // Retorna o elemento do topo sem remover
    peek() {
        if (this.isEmpty()) {
            return "Pilha vazia";
        }
        return this.top.data;
    }
    
    // Verifica se a pilha está vazia
    isEmpty() {
        return this.top === null;
    }
    
    // Retorna o tamanho da pilha
    getSize() {
        return this.size;
    }
    
    // Imprime a pilha (do topo para a base)
    print() {
        if (this.isEmpty()) {
            return "Pilha vazia";
        }
        
        let current = this.top;
        let result = "";
        
        while (current) {
            result += current.data + " → ";
            current = current.next;
        }
        
        return result + "null";
    }
}
```

### Comparação entre Implementações

| Aspecto                | Array                          | Lista Encadeada                |
|------------------------| ------------------------------- | ------------------------------- |
| Uso de Memória         | Menor uso de memória por item   | Maior (armazena dados + ponteiros) |
| Realocação de Memória  | Pode necessitar realocação      | Sem realocação                  |
| Complexidade de Push   | O(1) amortizado*               | O(1) constante                  |
| Complexidade de Pop    | O(1)                           | O(1)                            |
| Acesso Aleatório       | Possível (mas raramente usado)  | Não possível                    |
| Tamanho Máximo         | Geralmente limitado             | Limitado apenas pela memória    |

\* Na maioria dos casos é O(1), mas quando o array precisa ser redimensionado, torna-se O(n).

### Aplicações Práticas de Pilhas

#### 1. Avaliação de Expressões e Conversão de Notações

Pilhas são essenciais para:
- Conversão de expressões infixas para pós-fixas (notação polonesa reversa)
- Avaliação de expressões pós-fixas
- Validação de expressões aritméticas

```javascript
// Avaliação de expressão pós-fixa (RPN)
function evaluatePostfix(expression) {
    const stack = new ArrayStack();
    const tokens = expression.split(" ");
    
    for (let token of tokens) {
        if (!isNaN(token)) {
            stack.push(parseFloat(token));
        } else {
            const b = stack.pop();
            const a = stack.pop();
            
            switch(token) {
                case '+': stack.push(a + b); break;
                case '-': stack.push(a - b); break;
                case '*': stack.push(a * b); break;
                case '/': stack.push(a / b); break;
                case '^': stack.push(Math.pow(a, b)); break;
            }
        }
    }
    
    return stack.pop();
}

// Exemplo: "3 4 + 2 *" = (3 + 4) * 2 = 14
console.log(evaluatePostfix("3 4 + 2 *"));
```

#### 2. Verificação de Parênteses Balanceados

Um uso clássico de pilhas é verificar se expressões têm parênteses, colchetes e chaves balanceados.

```javascript
function isBalanced(expression) {
    const stack = new ArrayStack();
    
    for (let i = 0; i < expression.length; i++) {
        const char = expression[i];
        
        if (char === '(' || char === '[' || char === '{') {
            stack.push(char);
            continue;
        }
        
        if (char === ')' || char === ']' || char === '}') {
            if (stack.isEmpty()) {
                return false; // Fechamento sem abertura
            }
            
            const top = stack.pop();
            
            if ((char === ')' && top !== '(') || 
                (char === ']' && top !== '[') || 
                (char === '}' && top !== '{')) {
                return false; // Incompatibilidade
            }
        }
    }
    
    return stack.isEmpty(); // Deve estar vazia no final
}

// Exemplos
console.log(isBalanced("({[]})")); // true
console.log(isBalanced("({[})")); // false
```

#### 3. Navegação e Histórico

- Implementação de funcionalidades "voltar" e "avançar" em navegadores
- Gerenciamento de histórico de comandos (undo/redo) em editores

```javascript
class BrowserHistory {
    constructor(homePage) {
        this.backStack = new ArrayStack();
        this.forwardStack = new ArrayStack();
        this.currentPage = homePage;
    }
    
    // Navega para uma nova página
    visit(url) {
        this.backStack.push(this.currentPage);
        this.currentPage = url;
        this.forwardStack = new ArrayStack(); // Limpa o histórico de avanço
    }
    
    // Volta para a página anterior
    back() {
        if (this.backStack.isEmpty()) {
            return "Não há páginas para voltar";
        }
        
        this.forwardStack.push(this.currentPage);
        this.currentPage = this.backStack.pop();
        return this.currentPage;
    }
    
    // Avança para a próxima página
    forward() {
        if (this.forwardStack.isEmpty()) {
            return "Não há páginas para avançar";
        }
        
        this.backStack.push(this.currentPage);
        this.currentPage = this.forwardStack.pop();
        return this.currentPage;
    }
    
    // Retorna a página atual
    getCurrentPage() {
        return this.currentPage;
    }
}
```

#### 4. Gerenciamento de Memória

- Rastreamento de chamadas de função (call stack)
- Alocação e desalocação de memória
- Implementação de recursão e backtracking

#### 5. Algoritmos de Análise Sintática

- Compiladores e interpretadores
- Validação de sintaxe e transformação de expressões
- Algoritmos de parsing (como o Shunting-yard)

## Filas (Queues): Fundamentos e Aplicações

### O que é uma Fila?

Uma fila é uma estrutura de dados linear que segue o princípio **FIFO** (First-In-First-Out), ou seja, o primeiro elemento adicionado é o primeiro a ser removido. Pense em uma fila de pessoas: quem chega primeiro é atendido primeiro.

### Representação Visual

```
   Frente                              Fim
   (Dequeue)                         (Enqueue)
  ↓                                      ↓
┌───────┬───────┬───────┬───────┬───────┐
│   A   │   B   │   C   │   D   │   E   │
└───────┴───────┴───────┴───────┴───────┘
  Primeiro                         Último
  elemento                        elemento
  inserido                        inserido
```

### Operações Fundamentais

1. **enqueue(elemento)**: Adiciona um elemento no final da fila
2. **dequeue()**: Remove e retorna o elemento do início da fila
3. **front()** ou **peek()**: Retorna o elemento do início sem removê-lo
4. **isEmpty()**: Verifica se a fila está vazia
5. **size()**: Retorna o número de elementos na fila

### Análise de Complexidade

| Operação | Array (Ineficiente) | Array (Circular) | Lista Encadeada |
|----------|---------------------|------------------|-----------------|
| Enqueue  | O(1)                | O(1)             | O(1)            |
| Dequeue  | O(n)                | O(1)             | O(1)            |
| Front    | O(1)                | O(1)             | O(1)            |
| isEmpty  | O(1)                | O(1)             | O(1)            |
| Size     | O(1)                | O(1)             | O(1)            |

### Implementações de Fila

#### 1. Implementação com Array (Ineficiente)

```javascript
class SimpleQueue {
    constructor() {
        this.items = [];
    }
    
    // Adiciona elemento no final da fila
    enqueue(element) {
        this.items.push(element);
    }
    
    // Remove e retorna o elemento do início da fila
    dequeue() {
        if (this.isEmpty()) {
            return "Underflow - Fila vazia";
        }
        return this.items.shift(); // shift() tem complexidade O(n)
    }
    
    // Retorna o elemento do início sem remover
    front() {
        if (this.isEmpty()) {
            return "Fila vazia";
        }
        return this.items[0];
    }
    
    // Verifica se a fila está vazia
    isEmpty() {
        return this.items.length === 0;
    }
    
    // Retorna o tamanho da fila
    size() {
        return this.items.length;
    }
    
    // Imprime a fila
    print() {
        return this.items.join(' <- ');
    }
}
```

O problema desta implementação é que o método `dequeue()` usa `shift()`, que tem complexidade O(n) pois precisa reindexar todos os elementos restantes.

#### 2. Implementação com Array Circular (Eficiente)

```javascript
class CircularQueue {
    constructor(capacity = 10) {
        this.capacity = capacity;
        this.items = new Array(capacity);
        this.front = 0;
        this.rear = 0;
        this.size = 0;
    }
    
    // Adiciona elemento no final da fila
    enqueue(element) {
        if (this.isFull()) {
            return "Overflow - Fila cheia";
        }
        
        this.items[this.rear] = element;
        this.rear = (this.rear + 1) % this.capacity; // Circular
        this.size++;
        return true;
    }
    
    // Remove e retorna o elemento do início da fila
    dequeue() {
        if (this.isEmpty()) {
            return "Underflow - Fila vazia";
        }
        
        const element = this.items[this.front];
        this.items[this.front] = null; // Limpa a posição
        this.front = (this.front + 1) % this.capacity; // Circular
        this.size--;
        return element;
    }
    
    // Retorna o elemento do início sem remover
    peek() {
        if (this.isEmpty()) {
            return "Fila vazia";
        }
        return this.items[this.front];
    }
    
    // Verifica se a fila está vazia
    isEmpty() {
        return this.size === 0;
    }
    
    // Verifica se a fila está cheia
    isFull() {
        return this.size === this.capacity;
    }
    
    // Retorna o tamanho da fila
    getSize() {
        return this.size;
    }
    
    // Imprime a fila em ordem
    print() {
        if (this.isEmpty()) {
            return "Fila vazia";
        }
        
        let result = [];
        let i = this.front;
        let count = 0;
        
        while (count < this.size) {
            result.push(this.items[i]);
            i = (i + 1) % this.capacity;
            count++;
        }
        
        return result.join(' <- ');
    }
}
```

#### 3. Implementação com Lista Encadeada

```javascript
class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class LinkedQueue {
    constructor() {
        this.front = null;
        this.rear = null;
        this.size = 0;
    }
    
    // Adiciona elemento no final da fila
    enqueue(data) {
        const newNode = new Node(data);
        
        if (this.isEmpty()) {
            this.front = newNode;
            this.rear = newNode;
        } else {
            this.rear.next = newNode;
            this.rear = newNode;
        }
        
        this.size++;
    }
    
    // Remove e retorna o elemento do início da fila
    dequeue() {
        if (this.isEmpty()) {
            return "Underflow - Fila vazia";
        }
        
        const data = this.front.data;
        this.front = this.front.next;
        
        // Se a fila ficou vazia, atualizamos também o rear
        if (!this.front) {
            this.rear = null;
        }
        
        this.size--;
        return data;
    }
    
    // Retorna o elemento do início sem remover
    peek() {
        if (this.isEmpty()) {
            return "Fila vazia";
        }
        return this.front.data;
    }
    
    // Verifica se a fila está vazia
    isEmpty() {
        return this.front === null;
    }
    
    // Retorna o tamanho da fila
    getSize() {
        return this.size;
    }
    
    // Imprime a fila
    print() {
        if (this.isEmpty()) {
            return "Fila vazia";
        }
        
        let current = this.front;
        let result = [];
        
        while (current) {
            result.push(current.data);
            current = current.next;
        }
        
        return result.join(' <- ');
    }
}
```

### Aplicações Práticas de Filas

#### 1. Processamento Assíncrono e Agendamento

- Filas de processamento em sistemas distribuídos
- Agendamento de tarefas em sistemas operacionais
- Gestão de recursos compartilhados

```javascript
class TaskScheduler {
    constructor() {
        this.taskQueue = new LinkedQueue();
        this.isProcessing = false;
    }
    
    // Adiciona uma tarefa à fila
    addTask(task) {
        this.taskQueue.enqueue(task);
        console.log(`Tarefa "${task.name}" adicionada à fila`);
        
        if (!this.isProcessing) {
            this.processNextTask();
        }
    }
    
    // Processa a próxima tarefa
    processNextTask() {
        if (this.taskQueue.isEmpty()) {
            this.isProcessing = false;
            console.log("Todas as tarefas concluídas");
            return;
        }
        
        this.isProcessing = true;
        const task = this.taskQueue.dequeue();
        console.log(`Processando tarefa: ${task.name}`);
        
        // Simulando processamento assíncrono
        setTimeout(() => {
            console.log(`Tarefa "${task.name}" concluída`);
            this.processNextTask();
        }, task.duration);
    }
}

// Exemplo de uso
const scheduler = new TaskScheduler();
scheduler.addTask({name: "Comprimir imagens", duration: 2000});
scheduler.addTask({name: "Gerar relatório", duration: 3000});
scheduler.addTask({name: "Enviar emails", duration: 1500});
```

#### 2. Controle de Fluxo e Buffering

- Buffers de E/S em sistemas operacionais
- Transferência de dados entre processos
- Streaming de mídia

#### 3. Algoritmos de Busca em Largura (BFS)

- Exploração de grafos e árvores
- Encontrar o caminho mais curto em grafos não ponderados
- Resolução de problemas como labirintos

```javascript
function bfs(graph, startNode) {
    const queue = new LinkedQueue();
    const visited = new Set();
    const result = [];
    
    queue.enqueue(startNode);
    visited.add(startNode);
    
    while (!queue.isEmpty()) {
        const current = queue.dequeue();
        result.push(current);
        
        // Adiciona todos os vizinhos não visitados à fila
        for (let neighbor of graph[current]) {
            if (!visited.has(neighbor)) {
                queue.enqueue(neighbor);
                visited.add(neighbor);
            }
        }
    }
    
    return result;
}

// Exemplo: Grafo representado como lista de adjacência
const graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
};

console.log(bfs(graph, 'A')); // ['A', 'B', 'C', 'D', 'E', 'F']
```

#### 4. Simulação e Modelagem

- Sistemas de filas em simulações
- Modelagem de eventos discretos
- Simulações de tráfego e atendimento

#### 5. Cache e Gerenciamento de Memória

- Implementação de cache LRU (Least Recently Used)
- Gerenciamento de páginas em memória virtual
- Otimização de acesso a recursos

### Variações de Filas

#### 1. Fila de Prioridade

Uma fila onde os elementos têm prioridades associadas e são atendidos de acordo com sua prioridade, não apenas pela ordem de chegada.

```javascript
class PriorityQueue {
    constructor() {
        this.items = [];
    }
    
    // Adiciona elemento com prioridade (menor número = maior prioridade)
    enqueue(element, priority) {
        const queueElement = { element, priority };
        
        // Se a fila estiver vazia
        if (this.isEmpty()) {
            this.items.push(queueElement);
        } else {
            let added = false;
            
            // Encontra a posição correta baseada na prioridade
            for (let i = 0; i < this.items.length; i++) {
                if (queueElement.priority < this.items[i].priority) {
                    this.items.splice(i, 0, queueElement);
                    added = true;
                    break;
                }
            }
            
            // Se não encontrou posição, adiciona no final
            if (!added) {
                this.items.push(queueElement);
            }
        }
    }
    
    // Outros métodos são semelhantes à fila regular
    dequeue() {
        if (this.isEmpty()) {
            return "Underflow - Fila vazia";
        }
        return this.items.shift().element;
    }
    
    front() {
        if (this.isEmpty()) {
            return "Fila vazia";
        }
        return this.items[0].element;
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
    
    size() {
        return this.items.length;
    }
    
    print() {
        let result = "";
        for (let item of this.items) {
            result += `{${item.element}: ${item.priority}} `;
        }
        return result;
    }
}

// Exemplo: Sistema de triagem hospitalar
const emergencyQueue = new PriorityQueue();
emergencyQueue.enqueue("Corte superficial", 5);
emergencyQueue.enqueue("Ataque cardíaco", 1);
emergencyQueue.enqueue("Febre alta", 3);
emergencyQueue.enqueue("Trauma craniano", 1);
console.log(emergencyQueue.print()); // Ataque cardíaco e Trauma primeiro
```

#### 2. Fila de Duas Pontas (Deque)

Uma variação que permite adicionar e remover elementos de ambas as extremidades.

#### 3. Fila Circular

Uma implementação eficiente que reutiliza espaços vazios.

#### 4. Fila Sincronizada (Thread-safe)

Implementação concorrente que permite uso seguro em ambientes multi-thread.

### Conclusão

As filas são estruturas de dados fundamentais que modelam naturalmente muitos problemas do mundo real onde a ordem de chegada é importante. Suas aplicações variam desde sistemas operacionais até inteligência artificial, passando por redes, bancos de dados e praticamente todas as áreas da computação. 