# Listas Encadeadas

## Conceitos Básicos

### O que são Listas Encadeadas?

Uma lista encadeada é uma estrutura de dados linear composta por uma sequência de **nós**, onde cada nó contém:
1. Um valor ou dado 
2. Uma referência (ou ponteiro) para o próximo nó da sequência

Diferente dos arrays, os elementos não são armazenados em posições contíguas de memória, mas sim ligados através de ponteiros.

### Visualização Básica

```
+------+    +------+    +------+    +------+
| Dado |    | Dado |    | Dado |    | Dado |
|  A   |--->|  B   |--->|  C   |--->|  D   |---> null
+------+    +------+    +------+    +------+
```

### Tipos de Listas Encadeadas

#### 1. Lista Encadeada Simples

- Cada nó possui referência apenas para o próximo nó
- Percurso em uma única direção (do início para o fim)
- Operações no início são O(1), no fim são O(n)

#### 2. Lista Duplamente Encadeada

- Cada nó possui referência para o próximo e para o anterior
- Permite percurso em ambas as direções
- Facilita algumas operações, como remoção direta de um nó

```
+------+    +------+    +------+
|      |<-->|      |<-->|      |
| Dado |    | Dado |    | Dado |
|  A   |--->|  B   |--->|  C   |---> null
+------+    +------+    +------+
```

#### 3. Lista Circular

- O último nó aponta de volta para o primeiro, formando um ciclo
- Permite percurso contínuo e infinito pela lista
- Útil em aplicações que precisam de acesso cíclico aos dados

```
  +------+    +------+    +------+
  | Dado |    | Dado |    | Dado |
  |  A   |--->|  B   |--->|  C   |---+
  +------+    +------+    +------+   |
     ^                               |
     |                               |
     +-------------------------------+
```

### Vantagens e Desvantagens

#### Vantagens:
- Tamanho dinâmico (cresce conforme necessário)
- Facilidade de inserção/remoção (sem necessidade de realocação)
- Eficiente para inserções no início O(1)
- Não precisa de alocação contígua de memória

#### Desvantagens:
- Acesso sequencial (não é possível acesso direto por índice)
- Maior uso de memória (armazena dados + ponteiros)
- Cache menos eficiente (elementos dispersos na memória)
- Operações no fim da lista são O(n) em listas simples

### Aplicações no Mundo Real

1. **Sistemas de Navegação**: Histórico de navegadores web
2. **Implementação de Pilhas e Filas**: Base para outras estruturas
3. **Gerenciamento de Memória**: Listas de blocos livres
4. **Editores de Texto**: Facilita inserção e remoção de caracteres
5. **Sistemas de Playlists**: Músicas encadeadas em sequência
6. **Implementação de Gráficos**: Listas de adjacência

### Comparativo com Arrays

| Característica       | Lista Encadeada | Array            |
|----------------------|----------------|------------------|
| Acesso direto        | O(n)           | O(1)             |
| Inserção no início   | O(1)           | O(n)             |
| Inserção no fim      | O(n)*          | O(1)**           |
| Remoção no início    | O(1)           | O(n)             |
| Uso de memória       | Maior          | Menor            |
| Alocação de memória  | Dinâmica       | Geralmente fixa  |

\* O(1) se mantiver referência ao último nó  
\** Considerando arrays dinâmicos com espaço disponível 

## Implementações de Listas Encadeadas

### Implementação Básica de Lista Encadeada Simples

```javascript
class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }
    
    // Adiciona um elemento no final da lista
    append(data) {
        const newNode = new Node(data);
        
        // Se a lista estiver vazia
        if (!this.head) {
            this.head = newNode;
        } else {
            // Navega até o final da lista
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
        
        this.size++;
    }
    
    // Adiciona um elemento no início da lista
    prepend(data) {
        const newNode = new Node(data);
        newNode.next = this.head;
        this.head = newNode;
        this.size++;
    }
    
    // Remove um elemento com o valor especificado
    delete(data) {
        if (!this.head) return;
        
        // Caso especial: remoção da cabeça
        if (this.head.data === data) {
            this.head = this.head.next;
            this.size--;
            return;
        }
        
        let current = this.head;
        
        // Encontra o nó anterior ao que será removido
        while (current.next && current.next.data !== data) {
            current = current.next;
        }
        
        // Se encontrou o nó a ser removido
        if (current.next) {
            current.next = current.next.next; // Pula o nó a ser removido
            this.size--;
        }
    }
    
    // Insere um elemento em uma posição específica
    insertAt(data, index) {
        // Validações
        if (index < 0 || index > this.size) {
            return false;
        }
        
        // Inserção no início
        if (index === 0) {
            this.prepend(data);
            return true;
        }
        
        const newNode = new Node(data);
        let current = this.head;
        let position = 0;
        
        // Navega até a posição anterior ao ponto de inserção
        while (position < index - 1) {
            current = current.next;
            position++;
        }
        
        // Insere o novo nó
        newNode.next = current.next;
        current.next = newNode;
        this.size++;
        
        return true;
    }
    
    // Verifica se a lista contém um valor
    contains(data) {
        let current = this.head;
        
        while (current) {
            if (current.data === data) {
                return true;
            }
            current = current.next;
        }
        
        return false;
    }
    
    // Retorna o tamanho da lista
    getSize() {
        return this.size;
    }
    
    // Imprime a lista
    print() {
        const values = [];
        let current = this.head;
        
        while (current) {
            values.push(current.data);
            current = current.next;
        }
        
        return values.join(' -> ');
    }
}

// Exemplo de uso
const list = new LinkedList();
list.append(10);
list.append(20);
list.prepend(5);
list.append(30);
console.log(list.print()); // "5 -> 10 -> 20 -> 30"
list.delete(20);
console.log(list.print()); // "5 -> 10 -> 30"
console.log(list.contains(10)); // true
console.log(list.getSize()); // 3
```

### Implementação de Lista Duplamente Encadeada

```javascript
class DoublyNode {
    constructor(data) {
        this.data = data;
        this.next = null;
        this.prev = null;
    }
}

class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }
    
    // Adiciona um elemento no final da lista
    append(data) {
        const newNode = new DoublyNode(data);
        
        if (!this.head) {
            // Lista vazia
            this.head = newNode;
            this.tail = newNode;
        } else {
            // Adiciona no final e atualiza ponteiros
            newNode.prev = this.tail;
            this.tail.next = newNode;
            this.tail = newNode;
        }
        
        this.size++;
    }
    
    // Adiciona um elemento no início da lista
    prepend(data) {
        const newNode = new DoublyNode(data);
        
        if (!this.head) {
            // Lista vazia
            this.head = newNode;
            this.tail = newNode;
        } else {
            // Adiciona no início e atualiza ponteiros
            newNode.next = this.head;
            this.head.prev = newNode;
            this.head = newNode;
        }
        
        this.size++;
    }
    
    // Remove um elemento com o valor especificado
    delete(data) {
        if (!this.head) return;
        
        let current = this.head;
        
        // Percorre a lista
        while (current) {
            if (current.data === data) {
                // Caso 1: Nó é a cabeça
                if (current === this.head) {
                    this.head = current.next;
                    if (this.head) {
                        this.head.prev = null;
                    } else {
                        // Lista ficou vazia
                        this.tail = null;
                    }
                }
                // Caso 2: Nó é a cauda
                else if (current === this.tail) {
                    this.tail = current.prev;
                    this.tail.next = null;
                }
                // Caso 3: Nó está no meio
                else {
                    current.prev.next = current.next;
                    current.next.prev = current.prev;
                }
                
                this.size--;
                return true;
            }
            
            current = current.next;
        }
        
        return false;
    }
    
    // Imprime a lista do início ao fim
    printForward() {
        const values = [];
        let current = this.head;
        
        while (current) {
            values.push(current.data);
            current = current.next;
        }
        
        return values.join(' <-> ');
    }
    
    // Imprime a lista do fim ao início
    printBackward() {
        const values = [];
        let current = this.tail;
        
        while (current) {
            values.push(current.data);
            current = current.prev;
        }
        
        return values.join(' <-> ');
    }
}

// Exemplo de uso
const doublyList = new DoublyLinkedList();
doublyList.append(10);
doublyList.append(20);
doublyList.prepend(5);
console.log(doublyList.printForward()); // "5 <-> 10 <-> 20"
console.log(doublyList.printBackward()); // "20 <-> 10 <-> 5"
doublyList.delete(10);
console.log(doublyList.printForward()); // "5 <-> 20"
```

## Variantes Avançadas de Listas Encadeadas

### 1. Lista com Nó Cabeça (Sentinel Node)

Uma lista com nó cabeça ou sentinela contém um nó especial no início que não armazena dados, simplificando muitas operações.

#### Vantagens:
- Simplifica o código (menos casos especiais)
- Evita verificações de lista vazia
- Facilita operações como inserção e remoção

```javascript
class SentinelLinkedList {
    constructor() {
        this.sentinel = new Node(null); // Nó cabeça não armazena dados
        this.size = 0;
    }
    
    append(data) {
        let current = this.sentinel;
        while (current.next) {
            current = current.next;
        }
        current.next = new Node(data);
        this.size++;
    }
    
    // Outras operações são simplificadas pois sempre há um nó inicial
}
```

### 2. Lista com Referência à Cauda (Tail Reference)

Manter uma referência direta ao último nó permite operações O(1) no final da lista.

#### Vantagens:
- Inserção no final em O(1) em vez de O(n)
- Concatenação de listas mais eficiente
- Implementação mais eficiente para filas

```javascript
class TailedLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }
    
    append(data) {
        const newNode = new Node(data);
        
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            this.tail = newNode;
        }
        
        this.size++;
    }
    
    // O método append agora é O(1) em vez de O(n)
}
```

### 3. Lista com Skip (Skip List)

Uma técnica de otimização que adiciona "atalhos" para tornar a busca mais eficiente, aproximando-se de O(log n).

```
Nível 2:  1 ------------> 9 ----------------> 30
                           |                   |
Nível 1:  1 ------> 5 ---> 9 ------> 20 ----> 30
                     |     |          |        |
Nível 0:  1 -> 3 -> 5 -> 7 -> 9 -> 15 -> 20 -> 30
```

### 4. Lista XOR (Lista Duplamente Encadeada com Economia de Memória)

Uma variação de lista duplamente encadeada que usa uma única referência por nó, economizando memória.

```
Em uma lista duplamente encadeada normal:
Nó: [Prev | Dado | Next]

Em uma lista XOR:
Nó: [Dado | Prev XOR Next]
```

Para XOR entre ponteiros, usamos o operador bitwise XOR (^):
- Para avançar: next = prevPrev ^ current.link
- Para voltar: prev = current.link ^ next

Esta implementação é extremamente eficiente em memória, mas difícil de implementar em JavaScript por causa das limitações com ponteiros. É mais comum em C/C++.

### 5. Lista Auto-organizável (Self-organizing List)

Lista que reorganiza seus elementos baseada em padrões de acesso para melhorar a eficiência.

#### Estratégias comuns:
- **Move to Front**: Move o nó acessado para o início da lista
- **Transpose**: Troca o nó acessado com o anterior
- **Count**: Mantém contador de acessos e organiza por frequência

```javascript
class SelfOrganizingList {
    constructor() {
        this.head = null;
    }
    
    // Busca com política "Move to Front"
    find(data) {
        if (!this.head) return null;
        
        // Caso especial: elemento já está na frente
        if (this.head.data === data) return this.head;
        
        let prev = this.head;
        let current = this.head.next;
        
        while (current) {
            if (current.data === data) {
                // Move o nó para o início (Move to Front)
                prev.next = current.next;
                current.next = this.head;
                this.head = current;
                return current;
            }
            
            prev = current;
            current = current.next;
        }
        
        return null;
    }
}
```

### 6. Lista de Salto (Linked Skip List)

Uma implementação híbrida que combina lista encadeada com estrutura em camadas.

```javascript
class SkipNode {
    constructor(data, level) {
        this.data = data;
        // Array de ponteiros "next" para diferentes níveis
        this.forward = new Array(level).fill(null);
    }
}

// Veja implementação completa no módulo de listas skip
```

### 7. Lista Circular Duplamente Encadeada

Combina as vantagens de listas circulares e duplamente encadeadas:
- Navegação nos dois sentidos
- Acesso ao primeiro elemento a partir do último (e vice-versa)
- Eficiente para implementação de estruturas como deques

```javascript
class CircularDoublyLinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }
    
    append(data) {
        const newNode = new DoublyNode(data);
        
        if (!this.head) {
            this.head = newNode;
            newNode.next = newNode;
            newNode.prev = newNode;
        } else {
            const last = this.head.prev;
            
            // Inserção entre último e primeiro
            newNode.next = this.head;
            newNode.prev = last;
            last.next = newNode;
            this.head.prev = newNode;
        }
        
        this.size++;
    }
}
```

### 8. Lista Unrolled (Unrolled Linked List)

Armazena arrays de elementos em cada nó, combinando benefícios de listas encadeadas e arrays.

```
[Nó1: [1,2,3,4,5]] -> [Nó2: [6,7,8,9,10]] -> [Nó3: [11,12,13,14,15]]
```

#### Vantagens:
- Melhor uso de cache
- Menor uso de memória para ponteiros
- Acesso mais rápido a elementos sequenciais

```javascript
class UnrolledNode {
    constructor(capacity = 5) {
        this.elements = new Array(capacity);
        this.numElements = 0;
        this.next = null;
    }
}

class UnrolledLinkedList {
    constructor(nodeCapacity = 5) {
        this.head = new UnrolledNode(nodeCapacity);
        this.nodeCapacity = nodeCapacity;
        this.size = 0;
    }
    
    // Implementa operações adaptadas para blocos de elementos
}
```

## Aplicações Avançadas

1. **Cache LRU** (Least Recently Used): Lista duplamente encadeada + HashMap
2. **Gerenciador de memória**: Lista encadeada para rastrear blocos livres
3. **Sistema de Undo/Redo**: Pilha de estados implementada com listas
4. **Indexador de Texto**: Skip lists para busca eficiente
5. **Estruturas de dados persistentes**: Listas com versões históricas

## Otimizações de Desempenho

1. **Alocação em bloco**: Pré-aloca vários nós para reduzir overhead
2. **Pool de objetos**: Reutiliza nós ao invés de criar/destruir
3. **Técnicas de cache-friendly**: Organiza nós próximos na memória
4. **Compactação de ponteiros**: Reduz tamanho dos ponteiros em listas grandes
5. **Lazy deletion**: Marca nós como excluídos sem remover imediatamente 