# Listas Encadeadas Persistentes

## 🔄 Revisitando Listas Encadeadas

Antes de prosseguirmos com listas encadeadas persistentes, vamos relembrar as listas encadeadas tradicionais que estudamos no Módulo 2:

```ascii
Lista Encadeada Simples:
head → [A] → [B] → [C] → [D] → null

Lista Duplamente Encadeada:
head ⇄ [A] ⇄ [B] ⇄ [C] ⇄ [D] ⇄ null
```

Em listas encadeadas tradicionais, as operações como inserção, remoção e modificação alteram a estrutura existente. Em contraste, listas encadeadas persistentes preservam todas as versões anteriores.

## 🎯 Objetivos de Aprendizagem

- Entender como aplicar os conceitos de persistência em estruturas lineares
- Implementar operações básicas em listas encadeadas persistentes
- Comparar o desempenho de listas persistentes com listas mutáveis tradicionais
- Aplicar listas persistentes em cenários práticos
- Explorar otimizações específicas para listas encadeadas persistentes

## 📚 Estrutura de uma Lista Encadeada Persistente

Em uma lista encadeada persistente, cada operação cria uma nova "cabeça" (head) da lista, mas reutiliza a maior parte da estrutura anterior:

```ascii
Versão 1: head₁ → [A] → [B] → [C] → null
                    ↗
Versão 2: head₂ → [X] 
```

### Implementação em TypeScript

Vamos implementar uma lista encadeada simples persistente:

```typescript
interface ListNode<T> {
    value: T;
    next: ListNode<T> | null;
}

class PersistentList<T> {
    private head: ListNode<T> | null;
    
    constructor(head: ListNode<T> | null = null) {
        this.head = head;
    }
    
    // Retorna uma nova lista com o valor adicionado no início
    prepend(value: T): PersistentList<T> {
        const newHead: ListNode<T> = {
            value,
            next: this.head
        };
        
        return new PersistentList<T>(newHead);
    }
    
    // Retorna uma nova lista com o valor adicionado no final
    append(value: T): PersistentList<T> {
        if (this.head === null) {
            return this.prepend(value);
        }
        
        // Criamos um novo nó para o valor
        const newNode: ListNode<T> = {
            value,
            next: null
        };
        
        // Clonamos toda a lista até o final
        const newHead = this.cloneList(this.head, node => {
            if (node.next === null) {
                node.next = newNode;
                return true; // Sinal que terminamos
            }
            return false;
        });
        
        return new PersistentList<T>(newHead);
    }
    
    // Helper para clonar a lista até um ponto específico
    private cloneList(
        node: ListNode<T>, 
        updateFn: (node: ListNode<T>) => boolean
    ): ListNode<T> {
        // Cria um clone do nó atual
        const newNode: ListNode<T> = { ...node };
        
        // Se a função de atualização diz que terminamos, retorna o nó
        if (updateFn(newNode)) {
            return newNode;
        }
        
        // Se o nó tem um próximo, processa-o recursivamente
        if (newNode.next !== null) {
            newNode.next = this.cloneList(newNode.next, updateFn);
        }
        
        return newNode;
    }
    
    // Retorna uma nova lista com o elemento no índice especificado removido
    removeAt(index: number): PersistentList<T> {
        if (this.head === null || index < 0) {
            return this; // Se a lista está vazia ou índice inválido, retorna a lista atual
        }
        
        // Caso especial: remover o primeiro elemento
        if (index === 0) {
            return new PersistentList<T>(this.head.next);
        }
        
        let currentIndex = 0;
        const newHead = this.cloneList(this.head, node => {
            if (currentIndex === index - 1) {
                // Estamos no nó anterior ao que queremos remover
                if (node.next !== null) {
                    node.next = node.next.next;
                }
                return true;
            }
            currentIndex++;
            return false;
        });
        
        return new PersistentList<T>(newHead);
    }
    
    // Retorna uma nova lista com o valor no índice especificado atualizado
    updateAt(index: number, value: T): PersistentList<T> {
        if (this.head === null || index < 0) {
            return this;
        }
        
        let currentIndex = 0;
        const newHead = this.cloneList(this.head, node => {
            if (currentIndex === index) {
                node.value = value;
                return true;
            }
            currentIndex++;
            return false;
        });
        
        return new PersistentList<T>(newHead);
    }
    
    // Retorna o valor no índice especificado
    get(index: number): T | undefined {
        let current = this.head;
        let currentIndex = 0;
        
        while (current !== null && currentIndex < index) {
            current = current.next;
            currentIndex++;
        }
        
        return current !== null ? current.value : undefined;
    }
    
    // Converte a lista para um array
    toArray(): T[] {
        const result: T[] = [];
        let current = this.head;
        
        while (current !== null) {
            result.push(current.value);
            current = current.next;
        }
        
        return result;
    }
    
    // Retorna o tamanho da lista
    size(): number {
        let count = 0;
        let current = this.head;
        
        while (current !== null) {
            count++;
            current = current.next;
        }
        
        return count;
    }
}
```

### Exemplo de Uso

```typescript
// Criar uma lista vazia
const emptyList = new PersistentList<string>();

// Adicionar elementos no início (mais eficiente)
const list1 = emptyList.prepend("C");
const list2 = list1.prepend("B");
const list3 = list2.prepend("A");

// Adicionar elemento no final
const list4 = list3.append("D");

// Remover o segundo elemento (B)
const list5 = list4.removeAt(1);

// Atualizar o primeiro elemento
const list6 = list5.updateAt(0, "X");

// Todas as versões são preservadas
console.log("list1:", list1.toArray()); // ["C"]
console.log("list2:", list2.toArray()); // ["B", "C"]
console.log("list3:", list3.toArray()); // ["A", "B", "C"]
console.log("list4:", list4.toArray()); // ["A", "B", "C", "D"]
console.log("list5:", list5.toArray()); // ["A", "C", "D"]
console.log("list6:", list6.toArray()); // ["X", "C", "D"]
```

### Visualização das Operações

```ascii
// Progressão das versões

1. list1 = prepend("C")
   head₁ → [C] → null

2. list2 = prepend("B")
   head₂ → [B] → [C] → null
             ↗
   head₁ → [C] → null

3. list3 = prepend("A")
   head₃ → [A] → [B] → [C] → null
             ↗
   head₂ → [B] → [C] → null
             ↗
   head₁ → [C] → null

4. list4 = append("D")
   head₄ → [A*] → [B*] → [C*] → [D] → null
               ↗       ↗       ↗
   head₃ → [A] → [B] → [C] → null

5. list5 = removeAt(1)
   head₅ → [A*] → [C] → [D] → null
               ↘     ↗       ↗
   head₄ → [A*] → [B*] → [C*] → [D] → null

6. list6 = updateAt(0, "X")
   head₆ → [X] → [C] → [D] → null
               ↗       ↗
   head₅ → [A*] → [C] → [D] → null
```

## 🚀 Otimizações para Listas Encadeadas Persistentes

### 1. Compartilhamento de Estrutura

A principal otimização é o compartilhamento de estrutura, onde reutilizamos partes não modificadas das versões anteriores:

```ascii
Original:   head → [A] → [B] → [C] → [D] → null

Após update(1, "X"):

Nova:       head* → [A] → [X] → [C] → [D] → null
                      ↗        ↗
Original:   head  → [A] → [B] → [C] → [D] → null
```

### 2. Uso de Path Copying Sofisticado

Para operações como `append`, podemos otimizar a criação de nós:

```typescript
// Versão otimizada de append
append(value: T): PersistentList<T> {
    if (this.head === null) {
        return this.prepend(value);
    }
    
    // Criamos um novo nó para o valor
    const newNode: ListNode<T> = {
        value,
        next: null
    };
    
    // Ponteiro para o novo início da lista
    let newHead: ListNode<T> | null = null;
    // Ponteiro para o último nó adicionado à nova lista
    let current: ListNode<T> | null = null;
    
    // Percorremos a lista original
    let originalNode = this.head;
    
    while (originalNode !== null) {
        // Criamos um novo nó baseado no original
        const clonedNode: ListNode<T> = {
            value: originalNode.value,
            next: null
        };
        
        if (newHead === null) {
            // Primeiro nó da nova lista
            newHead = clonedNode;
            current = clonedNode;
        } else if (current !== null) {
            // Adicionar à nova lista
            current.next = clonedNode;
            current = clonedNode;
        }
        
        // Avançar na lista original
        originalNode = originalNode.next;
    }
    
    // Adicionar o novo valor no final
    if (current !== null) {
        current.next = newNode;
    }
    
    return new PersistentList<T>(newHead);
}
```

### 3. Lazy Evaluation (Avaliação Preguiçosa)

Podemos usar avaliação preguiçosa para adiar operações custosas até que sejam realmente necessárias:

```typescript
class LazyPersistentList<T> {
    private head: ListNode<T> | null;
    private operations: Array<(head: ListNode<T> | null) => ListNode<T> | null>;
    private evaluatedHead: ListNode<T> | null;
    
    constructor(head: ListNode<T> | null = null) {
        this.head = head;
        this.operations = [];
        this.evaluatedHead = null;
    }
    
    // Adiciona uma operação à lista
    private addOperation(op: (head: ListNode<T> | null) => ListNode<T> | null): LazyPersistentList<T> {
        const newList = new LazyPersistentList<T>(this.head);
        newList.operations = [...this.operations, op];
        return newList;
    }
    
    // Avalia todas as operações pendentes
    private evaluate(): ListNode<T> | null {
        if (this.evaluatedHead !== null) {
            return this.evaluatedHead;
        }
        
        let result = this.head;
        for (const op of this.operations) {
            result = op(result);
        }
        
        this.evaluatedHead = result;
        return result;
    }
    
    // Adiciona um elemento no início
    prepend(value: T): LazyPersistentList<T> {
        return this.addOperation(head => ({
            value,
            next: head
        }));
    }
    
    // Outras operações seguem o mesmo padrão...
    
    // Converte para array, forçando a avaliação
    toArray(): T[] {
        const result: T[] = [];
        let current = this.evaluate();
        
        while (current !== null) {
            result.push(current.value);
            current = current.next;
        }
        
        return result;
    }
}
```

## 📈 Análise de Complexidade

| Operação | Lista Encadeada Tradicional | Lista Encadeada Persistente |
|----------|------------------------------|------------------------------|
| `prepend` | O(1) | O(1) |
| `append` | O(n) | O(n) |
| `removeAt` | O(n) | O(n) |
| `updateAt` | O(n) | O(n) |
| `get` | O(n) | O(n) |
| Memória | O(n) | O(n + m*k) |

Onde:
- n = número de elementos
- m = número de operações de modificação
- k = número médio de elementos afetados por modificação

## 🌟 Aplicações Práticas

### 1. Histórico de Navegação em Aplicações Web

```typescript
class BrowserHistory {
    private currentPage: string;
    private history: PersistentList<string>;
    private historyVersions: PersistentList<string>[] = [];
    private currentVersion = 0;
    
    constructor(initialPage: string) {
        this.currentPage = initialPage;
        this.history = new PersistentList<string>().prepend(initialPage);
        this.historyVersions.push(this.history);
    }
    
    navigate(page: string) {
        this.history = this.history.prepend(page);
        this.currentPage = page;
        
        // Elimina histórico "futuro" se voltamos e navegamos novamente
        this.historyVersions = this.historyVersions.slice(0, this.currentVersion + 1);
        this.historyVersions.push(this.history);
        this.currentVersion = this.historyVersions.length - 1;
    }
    
    back(): string | null {
        if (this.currentVersion > 0) {
            this.currentVersion--;
            this.history = this.historyVersions[this.currentVersion];
            this.currentPage = this.history.get(0) || '';
            return this.currentPage;
        }
        return null;
    }
    
    forward(): string | null {
        if (this.currentVersion < this.historyVersions.length - 1) {
            this.currentVersion++;
            this.history = this.historyVersions[this.currentVersion];
            this.currentPage = this.history.get(0) || '';
            return this.currentPage;
        }
        return null;
    }
    
    getCurrentPage(): string {
        return this.currentPage;
    }
    
    getHistory(): string[] {
        return this.history.toArray();
    }
}
```

### 2. Gerenciamento de Estado em UIs

```typescript
interface AppState {
    users: PersistentList<User>;
    selectedUserId: number | null;
    isLoading: boolean;
    // ... outros campos
}

class StateManager {
    private stateHistory: AppState[] = [];
    private currentStateIndex = 0;
    
    constructor(initialState: AppState) {
        this.stateHistory.push(initialState);
    }
    
    getCurrentState(): AppState {
        return this.stateHistory[this.currentStateIndex];
    }
    
    updateState(updater: (state: AppState) => AppState): void {
        const currentState = this.getCurrentState();
        const newState = updater(currentState);
        
        // Adiciona o novo estado e remove estados "futuros"
        this.stateHistory = this.stateHistory.slice(0, this.currentStateIndex + 1);
        this.stateHistory.push(newState);
        this.currentStateIndex++;
        
        // Notificaria os observadores aqui
    }
    
    undo(): boolean {
        if (this.currentStateIndex > 0) {
            this.currentStateIndex--;
            return true;
        }
        return false;
    }
    
    redo(): boolean {
        if (this.currentStateIndex < this.stateHistory.length - 1) {
            this.currentStateIndex++;
            return true;
        }
        return false;
    }
}
```

## 🎯 Exercícios Práticos

### Exercícios Básicos

1. Implemente o método `insertAt(index, value)` para a lista encadeada persistente.
2. Adicione um método `concat` que mescla duas listas persistentes.
3. Implemente um método `filter` que retorna uma nova lista contendo apenas os elementos que satisfazem um determinado predicado.

### Exercícios Intermediários

4. Crie uma lista duplamente encadeada persistente.
5. Implemente uma versão "lazy" (com avaliação preguiçosa) de uma lista encadeada persistente.
6. Adicione métodos funcionais como `map`, `reduce` e `forEach` à lista persistente.

### Exercícios Avançados

7. Construa um editor de texto de linha de comando simples usando listas persistentes.
8. Implemente um controlador de desfazer/refazer para manipulação de lista.
9. Compare o desempenho de listas persistentes e tradicionais para diferentes tamanhos e operações.

## ❓ Perguntas Frequentes

1. **Quando devo escolher uma lista persistente em vez de um array ou lista encadeada tradicional?**
   - Use listas persistentes quando precisar manter um histórico de alterações ou trabalhar em um ambiente concorrente.

2. **Qual é o custo de memória real de usar listas persistentes?**
   - Para listas grandes com poucas modificações, o custo adicional é pequeno. Para muitas modificações pequenas, o custo pode ser significativo.

3. **Como posso otimizar o desempenho de listas persistentes?**
   - Use operações como `prepend` que não requerem copiar toda a lista, considere implementações com avaliação preguiçosa, e empregue técnicas de garbage collection específicas.

## 🔗 Recursos Adicionais

- [Purely Functional Data Structures](https://www.cs.cmu.edu/~rwh/theses/okasaki.pdf) - O livro de Chris Okasaki é uma referência fundamental
- [Immutable.js List API](https://immutable-js.com/docs/v4.3.0/List/) - Uma implementação prática de lista persistente
- [Introduction to Persistent Data Structures](https://medium.com/@dtinth/immutable-js-persistent-data-structures-and-structural-sharing-6d163fbd73d2)

---

