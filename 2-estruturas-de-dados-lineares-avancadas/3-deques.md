# Deques (Double-Ended Queues)

## Conceitos Fundamentais

### O que é um Deque?

Um **Deque** (Double-Ended Queue) é uma estrutura de dados linear que permite inserção e remoção de elementos em ambas as extremidades. O nome "deque" é uma abreviação de "double-ended queue".

O deque é uma estrutura versátil que combina características tanto de pilhas quanto de filas:
- Como uma pilha, permite adicionar e remover elementos do início (operações push/pop)
- Como uma fila, permite adicionar e remover elementos do final (operações enqueue/dequeue)

### Representação Visual

```
       ┌─────────────────────────────────┐
       │                                 │
       ▼                                 ▼
  ┌───────┬───────┬───────┬───────┬───────┐
  │   A   │   B   │   C   │   D   │   E   │
  └───────┴───────┴───────┴───────┴───────┘
  ▲                                 ▲
  │                                 │
  └─────────────────────────────────┘

Operações no início      Operações no fim
- addFront                - addRear
- removeFront             - removeRear
```

### Operações Fundamentais

Um deque oferece as seguintes operações básicas:

1. **addFront(elemento)** ou **pushFront(elemento)**: Insere um elemento no início do deque
2. **addRear(elemento)** ou **pushBack(elemento)**: Insere um elemento no final do deque
3. **removeFront()** ou **popFront()**: Remove e retorna o elemento do início do deque
4. **removeRear()** ou **popBack()**: Remove e retorna o elemento do final do deque
5. **peekFront()**: Retorna o elemento do início sem removê-lo
6. **peekRear()**: Retorna o elemento do final sem removê-lo
7. **isEmpty()**: Verifica se o deque está vazio
8. **size()**: Retorna o número de elementos no deque

### Tipos de Deques

#### 1. Deque de Entrada Restrita
Permite inserções apenas em uma extremidade, mas remoções em ambas:
- Inserções apenas no final
- Remoções no início e no final

#### 2. Deque de Saída Restrita
Permite inserções em ambas as extremidades, mas remoções apenas em uma:
- Inserções no início e no final
- Remoções apenas no início

#### 3. Deque Geral
Permite tanto inserções quanto remoções em ambas as extremidades (implementação mais comum).

### Análise de Complexidade

| Operação     | Array (ineficiente) | Array Circular | Lista Duplamente Encadeada |
|--------------|---------------------|----------------|-----------------------------|
| addFront     | O(n)                | O(1)           | O(1)                        |
| addRear      | O(1)                | O(1)           | O(1)                        |
| removeFront  | O(n)                | O(1)           | O(1)                        |
| removeRear   | O(1)                | O(1)           | O(1)                        |
| peekFront    | O(1)                | O(1)           | O(1)                        |
| peekRear     | O(1)                | O(1)           | O(1)                        |

Observações importantes:
- Com arrays simples, operações no início (addFront, removeFront) são O(n) devido à necessidade de deslocar elementos
- Arrays circulares e listas duplamente encadeadas oferecem O(1) para todas operações

### Vantagens e Desvantagens dos Deques

#### Vantagens
- **Versatilidade**: Combina funcionalidades de pilhas e filas
- **Eficiência**: Implementações adequadas garantem operações O(1)
- **Flexibilidade**: Permite processamento de dados em ambas as direções
- **Adaptabilidade**: Ideal para algoritmos que processam dados em dois sentidos

#### Desvantagens
- **Complexidade**: Implementação mais complexa que pilhas e filas simples
- **Sobrecarga de memória**: Algumas implementações (como lista duplamente encadeada) usam mais memória
- **Operações restritas**: Não permite acesso direto a elementos internos (apenas extremidades)

### Comparação com Outras Estruturas Lineares

| Característica           | Pilha (Stack) | Fila (Queue) | Deque         |
|--------------------------|---------------|--------------|---------------|
| Princípio de ordenação   | LIFO          | FIFO         | Ambos         |
| Inserção                 | Uma extremidade | Uma extremidade | Ambas extremidades |
| Remoção                  | Uma extremidade | Uma extremidade | Ambas extremidades |
| Flexibilidade            | Baixa         | Baixa        | Alta          |
| Casos de uso             | Específicos   | Específicos  | Variados      |

## Implementações de Deques

### 1. Implementação com Array Simples

Esta é a implementação mais básica, usando métodos de array JavaScript para operações nas duas extremidades.

```javascript
class ArrayDeque {
    constructor() {
        this.items = [];
    }
    
    // Adiciona elemento no início do deque
    addFront(element) {
        this.items.unshift(element); // O(n) - precisa deslocar todos elementos
    }
    
    // Adiciona elemento no final do deque
    addRear(element) {
        this.items.push(element); // O(1) - exceto quando array precisa ser redimensionado
    }
    
    // Remove e retorna elemento do início do deque
    removeFront() {
        if (this.isEmpty()) {
            return "Underflow";
        }
        return this.items.shift(); // O(n) - precisa deslocar todos elementos
    }
    
    // Remove e retorna elemento do final do deque
    removeRear() {
        if (this.isEmpty()) {
            return "Underflow";
        }
        return this.items.pop(); // O(1)
    }
    
    // Retorna elemento do início sem remover
    peekFront() {
        if (this.isEmpty()) {
            return "Deque vazio";
        }
        return this.items[0];
    }
    
    // Retorna elemento do final sem remover
    peekRear() {
        if (this.isEmpty()) {
            return "Deque vazio";
        }
        return this.items[this.items.length - 1];
    }
    
    // Verifica se o deque está vazio
    isEmpty() {
        return this.items.length === 0;
    }
    
    // Retorna tamanho do deque
    size() {
        return this.items.length;
    }
    
    // Imprime o deque
    print() {
        return this.items.join(' <-> ');
    }
}
```

**Vantagens:**
- Fácil de implementar
- Funciona bem para conjuntos pequenos de dados
- Acesso direto aos elementos através de índice (embora não seja comum em deques)

**Desvantagens:**
- Operações `addFront()` e `removeFront()` são O(n), o que torna esta implementação ineficiente para operações frequentes no início
- Possível realocação de memória no redimensionamento do array

### 2. Implementação com Array Circular

Para superar as limitações da implementação anterior, podemos usar um array circular com índices de front e rear.

```javascript
class CircularDeque {
    constructor(capacity = 10) {
        this.capacity = capacity;
        this.items = new Array(capacity);
        this.front = -1;
        this.rear = -1;
        this.size = 0;
    }
    
    // Adiciona elemento no início do deque
    addFront(element) {
        // Verifica se o deque está cheio
        if (this.isFull()) {
            return "Overflow";
        }
        
        // Se o deque está vazio
        if (this.isEmpty()) {
            this.front = 0;
            this.rear = 0;
        } 
        // Se front está na primeira posição, move para o final do array
        else if (this.front === 0) {
            this.front = this.capacity - 1;
        } 
        // Decrementa o front
        else {
            this.front--;
        }
        
        this.items[this.front] = element;
        this.size++;
        return true;
    }
    
    // Adiciona elemento no final do deque
    addRear(element) {
        // Verifica se o deque está cheio
        if (this.isFull()) {
            return "Overflow";
        }
        
        // Se o deque está vazio
        if (this.isEmpty()) {
            this.front = 0;
            this.rear = 0;
        } 
        // Se rear está na última posição, move para o início do array
        else if (this.rear === this.capacity - 1) {
            this.rear = 0;
        } 
        // Incrementa o rear
        else {
            this.rear++;
        }
        
        this.items[this.rear] = element;
        this.size++;
        return true;
    }
    
    // Remove e retorna elemento do início do deque
    removeFront() {
        // Verifica se o deque está vazio
        if (this.isEmpty()) {
            return "Underflow";
        }
        
        const element = this.items[this.front];
        this.items[this.front] = null; // Limpa a posição
        
        // Se houver apenas um elemento
        if (this.front === this.rear) {
            this.front = -1;
            this.rear = -1;
        }
        // Se front estiver na última posição, move para o início
        else if (this.front === this.capacity - 1) {
            this.front = 0;
        }
        // Incrementa o front normalmente
        else {
            this.front++;
        }
        
        this.size--;
        return element;
    }
    
    // Remove e retorna elemento do final do deque
    removeRear() {
        // Verifica se o deque está vazio
        if (this.isEmpty()) {
            return "Underflow";
        }
        
        const element = this.items[this.rear];
        this.items[this.rear] = null; // Limpa a posição
        
        // Se houver apenas um elemento
        if (this.front === this.rear) {
            this.front = -1;
            this.rear = -1;
        }
        // Se rear estiver na primeira posição, move para o final
        else if (this.rear === 0) {
            this.rear = this.capacity - 1;
        }
        // Decrementa o rear normalmente
        else {
            this.rear--;
        }
        
        this.size--;
        return element;
    }
    
    // Retorna elemento do início sem remover
    peekFront() {
        if (this.isEmpty()) {
            return "Deque vazio";
        }
        return this.items[this.front];
    }
    
    // Retorna elemento do final sem remover
    peekRear() {
        if (this.isEmpty()) {
            return "Deque vazio";
        }
        return this.items[this.rear];
    }
    
    // Verifica se o deque está vazio
    isEmpty() {
        return this.front === -1;
    }
    
    // Verifica se o deque está cheio
    isFull() {
        return (
            (this.front === 0 && this.rear === this.capacity - 1) ||
            (this.front === this.rear + 1)
        );
    }
    
    // Retorna tamanho do deque
    getSize() {
        return this.size;
    }
    
    // Imprime o deque em ordem
    print() {
        if (this.isEmpty()) {
            return "Deque vazio";
        }
        
        let result = [];
        let i = this.front;
        
        if (this.front <= this.rear) {
            // Caso normal (front está antes ou na mesma posição que rear)
            for (i = this.front; i <= this.rear; i++) {
                result.push(this.items[i]);
            }
        } else {
            // Caso circular (front está depois de rear no array)
            // Primeiro, do front até o final do array
            for (i = this.front; i < this.capacity; i++) {
                result.push(this.items[i]);
            }
            // Depois, do início do array até rear
            for (i = 0; i <= this.rear; i++) {
                result.push(this.items[i]);
            }
        }
        
        return result.join(' <-> ');
    }
}
```

**Vantagens:**
- Todas as operações são O(1)
- Uso eficiente de memória (espaço fixo)
- Adequado para aplicações de alto desempenho

**Desvantagens:**
- Tamanho fixo (precisa implementar redimensionamento se necessário)
- Implementação mais complexa e propensa a erros
- Requer gerenciamento cuidadoso dos índices front e rear

### 3. Implementação com Lista Duplamente Encadeada

A lista duplamente encadeada é uma estrutura natural para implementar deques, pois suporta operações eficientes em ambas as extremidades.

```javascript
class DequeNode {
    constructor(data) {
        this.data = data;
        this.prev = null;
        this.next = null;
    }
}

class LinkedDeque {
    constructor() {
        this.front = null;
        this.rear = null;
        this.size = 0;
    }
    
    // Adiciona elemento no início do deque
    addFront(data) {
        const newNode = new DequeNode(data);
        
        if (this.isEmpty()) {
            this.front = newNode;
            this.rear = newNode;
        } else {
            newNode.next = this.front;
            this.front.prev = newNode;
            this.front = newNode;
        }
        
        this.size++;
    }
    
    // Adiciona elemento no final do deque
    addRear(data) {
        const newNode = new DequeNode(data);
        
        if (this.isEmpty()) {
            this.front = newNode;
            this.rear = newNode;
        } else {
            newNode.prev = this.rear;
            this.rear.next = newNode;
            this.rear = newNode;
        }
        
        this.size++;
    }
    
    // Remove e retorna elemento do início do deque
    removeFront() {
        if (this.isEmpty()) {
            return "Underflow";
        }
        
        const data = this.front.data;
        
        if (this.front === this.rear) {
            // Apenas um elemento
            this.front = null;
            this.rear = null;
        } else {
            this.front = this.front.next;
            this.front.prev = null;
        }
        
        this.size--;
        return data;
    }
    
    // Remove e retorna elemento do final do deque
    removeRear() {
        if (this.isEmpty()) {
            return "Underflow";
        }
        
        const data = this.rear.data;
        
        if (this.front === this.rear) {
            // Apenas um elemento
            this.front = null;
            this.rear = null;
        } else {
            this.rear = this.rear.prev;
            this.rear.next = null;
        }
        
        this.size--;
        return data;
    }
    
    // Retorna elemento do início sem remover
    peekFront() {
        if (this.isEmpty()) {
            return "Deque vazio";
        }
        return this.front.data;
    }
    
    // Retorna elemento do final sem remover
    peekRear() {
        if (this.isEmpty()) {
            return "Deque vazio";
        }
        return this.rear.data;
    }
    
    // Verifica se o deque está vazio
    isEmpty() {
        return this.front === null;
    }
    
    // Retorna tamanho do deque
    getSize() {
        return this.size;
    }
    
    // Imprime o deque do início para o fim
    printForward() {
        if (this.isEmpty()) {
            return "Deque vazio";
        }
        
        let current = this.front;
        let result = [];
        
        while (current) {
            result.push(current.data);
            current = current.next;
        }
        
        return result.join(' <-> ');
    }
    
    // Imprime o deque do fim para o início
    printBackward() {
        if (this.isEmpty()) {
            return "Deque vazio";
        }
        
        let current = this.rear;
        let result = [];
        
        while (current) {
            result.push(current.data);
            current = current.prev;
        }
        
        return result.join(' <-> ');
    }
}
```

**Vantagens:**
- Todas as operações são O(1)
- Tamanho dinâmico (cresce conforme necessário)
- Implementação natural e intuitiva para deques

**Desvantagens:**
- Maior uso de memória por elemento (armazena dados + 2 ponteiros)
- Sobrecarga de alocação de memória para cada novo nó
- Não beneficia de localidade de cache como arrays

## Casos de Uso e Aplicações Práticas

### 1. Verificação de Palíndromos

Um palíndromo é uma sequência que lê o mesmo de trás para frente (ex: "radar", "A man, a plan, a canal, Panama!"). Os deques são ideais para verificar palíndromos:

```javascript
function isPalindrome(str) {
    // Remove caracteres não-alfanuméricos e converte para minúsculas
    const cleanStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const deque = new LinkedDeque();
    
    // Adiciona cada caractere ao deque
    for (let char of cleanStr) {
        deque.addRear(char);
    }
    
    // Compara caracteres das duas extremidades
    while (deque.getSize() > 1) {
        if (deque.removeFront() !== deque.removeRear()) {
            return false;
        }
    }
    
    return true;
}

// Exemplos
console.log(isPalindrome("radar")); // true
console.log(isPalindrome("A man, a plan, a canal, Panama")); // true
console.log(isPalindrome("hello")); // false
```

### 2. Buffer Circular para Processamento de Dados

Deques são excelentes para implementar buffers circulares em sistemas de processamento de dados ou fluxos de entrada/saída:

```javascript
class CircularBuffer {
    constructor(capacity) {
        this.deque = new CircularDeque(capacity);
        this.capacity = capacity;
    }
    
    // Adiciona um item ao buffer, removendo o mais antigo se necessário
    write(data) {
        if (this.deque.isFull()) {
            this.deque.removeFront(); // Remove o item mais antigo
        }
        this.deque.addRear(data); // Adiciona o novo item
    }
    
    // Lê o próximo item (mais antigo) do buffer
    read() {
        return this.deque.removeFront();
    }
    
    // Visualiza os próximos 'n' itens sem removê-los
    peek(n = 1) {
        if (this.deque.isEmpty()) {
            return [];
        }
        
        const items = [];
        let current = this.deque.front;
        let count = 0;
        
        while (current !== null && count < n) {
            items.push(this.deque.items[current]);
            current = (current + 1) % this.capacity;
            count++;
            
            if (current === (this.deque.rear + 1) % this.capacity) {
                break;
            }
        }
        
        return items;
    }
    
    // Verifica se o buffer está vazio
    isEmpty() {
        return this.deque.isEmpty();
    }
    
    // Verifica se o buffer está cheio
    isFull() {
        return this.deque.isFull();
    }
    
    // Retorna a quantidade de itens no buffer
    size() {
        return this.deque.getSize();
    }
}

// Exemplo: Buffer de streaming
const streamBuffer = new CircularBuffer(5);
streamBuffer.write("Pacote 1");
streamBuffer.write("Pacote 2");
streamBuffer.write("Pacote 3");

console.log(streamBuffer.read()); // "Pacote 1"
streamBuffer.write("Pacote 4");
streamBuffer.write("Pacote 5");
streamBuffer.write("Pacote 6"); // Buffer cheio, "Pacote 2" é descartado

console.log(streamBuffer.peek(3)); // ["Pacote 3", "Pacote 4", "Pacote 5"]
```

### 3. Algoritmo de Roubo de Trabalho (Work Stealing)

Em sistemas de computação paralela, o algoritmo de roubo de trabalho permite que threads ociosas "roubem" tarefas de threads ocupadas:

```javascript
class WorkStealingScheduler {
    constructor(numThreads) {
        this.queues = new Array(numThreads);
        
        // Inicializa uma deque para cada thread
        for (let i = 0; i < numThreads; i++) {
            this.queues[i] = new LinkedDeque();
        }
    }
    
    // Thread adiciona uma tarefa em sua própria deque
    addTask(threadId, task) {
        this.queues[threadId].addRear(task);
    }
    
    // Thread busca uma tarefa em sua própria deque
    getTask(threadId) {
        if (!this.queues[threadId].isEmpty()) {
            return this.queues[threadId].removeRear(); // LIFO para localidade
        }
        
        // Se não houver tarefas, tentar roubar de outras threads
        return this.stealTask(threadId);
    }
    
    // Thread tenta roubar uma tarefa de outra thread
    stealTask(threadId) {
        for (let i = 0; i < this.queues.length; i++) {
            if (i !== threadId && !this.queues[i].isEmpty()) {
                return this.queues[i].removeFront(); // FIFO para roubo
            }
        }
        
        return null; // Nenhuma tarefa disponível
    }
}

// Exemplo simplificado de uso
const scheduler = new WorkStealingScheduler(3);
scheduler.addTask(0, "Tarefa 1");
scheduler.addTask(0, "Tarefa 2");
scheduler.addTask(1, "Tarefa 3");

console.log(scheduler.getTask(0)); // "Tarefa 2" (própria deque - LIFO)
console.log(scheduler.getTask(2)); // "Tarefa 1" (roubada da thread 0 - FIFO)
console.log(scheduler.getTask(2)); // "Tarefa 3" (roubada da thread 1 - FIFO)
```

### 4. Algoritmo de Deslizamento de Janela (Sliding Window)

Deques são úteis para implementar o padrão de janela deslizante, comum em processamento de streams, análise de série temporal e processamento de imagens:

```javascript
// Encontra o máximo em cada janela de tamanho k em um array
function maxSlidingWindow(nums, k) {
    if (nums.length === 0 || k === 0) {
        return [];
    }
    
    const result = [];
    const deque = new LinkedDeque(); // Armazena índices
    
    for (let i = 0; i < nums.length; i++) {
        // Remove elementos fora da janela atual
        while (!deque.isEmpty() && deque.peekFront() < i - k + 1) {
            deque.removeFront();
        }
        
        // Remove elementos menores que o atual (não podem ser máximos)
        while (!deque.isEmpty() && nums[deque.peekRear()] < nums[i]) {
            deque.removeRear();
        }
        
        // Adiciona o índice atual
        deque.addRear(i);
        
        // Adiciona o máximo atual ao resultado se a janela estiver completa
        if (i >= k - 1) {
            result.push(nums[deque.peekFront()]);
        }
    }
    
    return result;
}

// Exemplo
const array = [1, 3, -1, -3, 5, 3, 6, 7];
console.log(maxSlidingWindow(array, 3)); // [3, 3, 5, 5, 6, 7]
```

### 5. Histórico de Navegação Bidirecional

Implementação de funcionalidades de navegação "avançar" e "voltar":

```javascript
class BrowserHistory {
    constructor(homepage) {
        this.history = new LinkedDeque();
        this.future = new LinkedDeque();
        
        // Inicializa com a página inicial
        this.history.addRear(homepage);
        this.current = homepage;
    }
    
    // Navega para uma nova página
    visit(url) {
        this.history.addRear(url);
        this.current = url;
        
        // Limpa o histórico futuro ao navegar para uma nova página
        while (!this.future.isEmpty()) {
            this.future.removeFront();
        }
    }
    
    // Volta para a página anterior
    back() {
        if (this.history.getSize() <= 1) {
            return this.current; // Não há para onde voltar
        }
        
        const currentPage = this.history.removeRear();
        this.future.addFront(currentPage);
        
        this.current = this.history.peekRear();
        return this.current;
    }
    
    // Avança para a próxima página
    forward() {
        if (this.future.isEmpty()) {
            return this.current; // Não há para onde avançar
        }
        
        const nextPage = this.future.removeFront();
        this.history.addRear(nextPage);
        
        this.current = nextPage;
        return this.current;
    }
    
    // Retorna página atual
    getCurrentPage() {
        return this.current;
    }
    
    // Retorna o histórico de navegação
    getHistory() {
        return this.history.printForward();
    }
}

// Exemplo de uso
const browser = new BrowserHistory("https://www.google.com");
browser.visit("https://www.wikipedia.org");
browser.visit("https://www.github.com");

console.log(browser.back()); // wikipedia.org
console.log(browser.back()); // google.com
console.log(browser.forward()); // wikipedia.org
browser.visit("https://www.stackoverflow.com");
console.log(browser.forward()); // stackoverflow.com (não há para onde avançar)
console.log(browser.getHistory()); // Exibe todo o histórico
```

### 6. Editor de Texto com Operações de Undo/Redo

Deques podem ser usados para implementar funcionalidades de desfazer/refazer em editores:

```javascript
class TextEditor {
    constructor() {
        this.text = "";
        this.undoStack = new LinkedDeque();
        this.redoStack = new LinkedDeque();
    }
    
    // Executa uma operação de texto
    execute(operation) {
        // Salva o estado atual para undo
        this.undoStack.addRear({
            text: this.text,
            operation: operation.type
        });
        
        // Limpa o histórico de redo quando uma nova operação é executada
        while (!this.redoStack.isEmpty()) {
            this.redoStack.removeRear();
        }
        
        // Aplica a operação
        switch (operation.type) {
            case 'insert':
                this.text = this.text.substring(0, operation.position) + 
                           operation.content + 
                           this.text.substring(operation.position);
                break;
            case 'delete':
                this.text = this.text.substring(0, operation.start) + 
                           this.text.substring(operation.end);
                break;
            case 'replace':
                this.text = this.text.substring(0, operation.start) + 
                           operation.content + 
                           this.text.substring(operation.end);
                break;
        }
        
        return this.text;
    }
    
    // Desfaz a última operação
    undo() {
        if (this.undoStack.isEmpty()) {
            return this.text;
        }
        
        const currentState = {
            text: this.text,
            operation: 'current'
        };
        
        this.redoStack.addRear(currentState);
        const previousState = this.undoStack.removeRear();
        this.text = previousState.text;
        
        return this.text;
    }
    
    // Refaz a operação desfeita
    redo() {
        if (this.redoStack.isEmpty()) {
            return this.text;
        }
        
        const currentState = {
            text: this.text,
            operation: 'current'
        };
        
        this.undoStack.addRear(currentState);
        const nextState = this.redoStack.removeRear();
        this.text = nextState.text;
        
        return this.text;
    }
    
    // Retorna o texto atual
    getText() {
        return this.text;
    }
}

// Exemplo de uso
const editor = new TextEditor();
editor.execute({type: 'insert', position: 0, content: 'Hello'});
editor.execute({type: 'insert', position: 5, content: ' World'});
console.log(editor.getText()); // "Hello World"

editor.execute({type: 'replace', start: 0, end: 5, content: 'Hi'});
console.log(editor.getText()); // "Hi World"

console.log(editor.undo()); // "Hello World"
console.log(editor.undo()); // "Hello"

console.log(editor.redo()); // "Hello World"
editor.execute({type: 'delete', start: 5, end: 11});
console.log(editor.getText()); // "Hello"
```

## Considerações de Desempenho e Otimização

### Fatores que Influenciam o Desempenho

1. **Escolha da Implementação**:
   - Array simples: Melhor para deques pequenos com poucas operações no início
   - Array circular: Ótimo para tamanho fixo e balanceamento de operações
   - Lista duplamente encadeada: Ideal para tamanho variável e operações frequentes em ambas as extremidades

2. **Padrão de Acesso**:
   - Predominância de operações em uma extremidade: Considerar pilha ou fila
   - Balanceamento entre operações nas duas extremidades: Deque completo
   - Acesso aleatório frequente: Array com índices

3. **Tamanho dos Dados**:
   - Para conjuntos de dados pequenos: Qualquer implementação funciona bem
   - Para grandes volumes: Considerar otimizações de memória

### Possíveis Otimizações

1. **Deque com Array Dinâmico**:
   Combinando as vantagens de arrays circulares com redimensionamento automático.

2. **Implementação com Blocos (Block Deque)**:
   Usando arrays de tamanho fixo conectados por ponteiros, reduzindo realocações.

3. **Deque thread-safe**:
   Para ambientes de concorrência, implementando mecanismos de sincronização.

4. **Localidade de Cache**:
   Organização de dados para maximizar hits de cache.

## Biblioteca Padrão e Frameworks

### JavaScript e TypeScript

Em JavaScript, não há uma implementação de deque na biblioteca padrão, mas muitas bibliotecas de terceiros oferecem implementações eficientes:

- **Collections.js**: Oferece uma implementação completa de deque
- **Denque**: Biblioteca especializada em deques de alto desempenho
- **TypedArrayDeque**: Implementação baseada em TypedArray para maior eficiência

### Outras Linguagens

Para referência, implementações de deque em outras linguagens:

- **Java**: `ArrayDeque` e `LinkedList` com interface `Deque`
- **C++**: `std::deque` na STL
- **Python**: `collections.deque`
- **C#**: `System.Collections.Generic.LinkedList<T>` com métodos para ambas extremidades

## Conclusão

Deques são estruturas de dados versáteis que oferecem o melhor dos dois mundos: pilhas e filas. Com a capacidade de realizar operações eficientes em ambas as extremidades, são ideais para uma ampla gama de problemas algorítmicos e aplicações práticas.

A escolha da implementação certa depende do caso de uso específico, considerando fatores como padrão de acesso, requisitos de memória e desempenho. Para a maioria das aplicações, a implementação com lista duplamente encadeada oferece um bom equilíbrio entre flexibilidade e eficiência, enquanto o array circular pode ser mais adequado para situações com restrições de memória e tamanho fixo. 