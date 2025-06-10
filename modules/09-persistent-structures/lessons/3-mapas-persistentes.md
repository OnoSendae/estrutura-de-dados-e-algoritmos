# Mapas Persistentes (Dicionários Imutáveis)

## 🔄 Conexão com Conceitos Anteriores

Antes de aprofundarmos nos mapas persistentes, vamos relembrar os conceitos de mapas/dicionários que vimos anteriormente e como eles se relacionam com árvores de busca:

```ascii
Mapa/Dicionário em JavaScript:
{
  "chave1": valor1,
  "chave2": valor2,
  "chave3": valor3
}

Representação em Árvore de Busca:
           chave2
          /      \
     chave1      chave3
     /    \      /    \
   ...    ...  ...    ...
```

Os mapas tradicionais permitem operações como inserção, remoção e busca, mas sempre modificam a estrutura original. Mapas persistentes, por outro lado, preservam todas as versões anteriores.

## 🎯 Objetivos de Aprendizagem

- Compreender o conceito de mapas persistentes e seus casos de uso
- Implementar um mapa persistente baseado em árvore binária de busca
- Explorar otimizações específicas para mapas imutáveis
- Analisar a complexidade de tempo e espaço de mapas persistentes
- Aplicar mapas persistentes em casos práticos reais

## 📚 Fundamentos de Mapas Persistentes

Um mapa persistente (ou dicionário imutável) é uma estrutura de dados que associa chaves a valores, sem modificar versões anteriores durante operações como inserção, atualização ou remoção.

### Características Principais:

1. **Imutabilidade**: Nenhuma operação modifica a estrutura existente
2. **Eficiência**: Compartilhamento de estrutura para economizar memória
3. **Histórico**: Mantém versões anteriores acessíveis
4. **Previsibilidade**: Comportamento consistente em ambientes concorrentes

## 🌳 Implementação de um Mapa Persistente

Vamos implementar um mapa persistente baseado em árvore binária de busca:

```typescript
interface MapNode<K, V> {
    key: K;
    value: V;
    left: MapNode<K, V> | null;
    right: MapNode<K, V> | null;
}

class PersistentMap<K, V> {
    private root: MapNode<K, V> | null;
    private compare: (a: K, b: K) => number;
    
    constructor(
        root: MapNode<K, V> | null = null,
        compare: (a: K, b: K) => number = (a: any, b: any) => 
            a < b ? -1 : (a > b ? 1 : 0)
    ) {
        this.root = root;
        this.compare = compare;
    }
    
    // Busca um valor pela chave
    get(key: K): V | undefined {
        let current = this.root;
        
        while (current !== null) {
            const cmp = this.compare(key, current.key);
            
            if (cmp === 0) {
                return current.value;
            } else if (cmp < 0) {
                current = current.left;
            } else {
                current = current.right;
            }
        }
        
        return undefined;
    }
    
    // Insere ou atualiza um valor e retorna um novo mapa
    set(key: K, value: V): PersistentMap<K, V> {
        const newRoot = this.setNode(this.root, key, value);
        return new PersistentMap<K, V>(newRoot, this.compare);
    }
    
    private setNode(node: MapNode<K, V> | null, key: K, value: V): MapNode<K, V> {
        // Se o nó é nulo, cria um novo nó
        if (node === null) {
            return { key, value, left: null, right: null };
        }
        
        const cmp = this.compare(key, node.key);
        
        // Cria uma cópia do nó atual
        const newNode: MapNode<K, V> = { ...node };
        
        if (cmp === 0) {
            // Atualizar valor no nó atual
            newNode.value = value;
        } else if (cmp < 0) {
            // Inserir na subárvore esquerda
            newNode.left = this.setNode(node.left, key, value);
        } else {
            // Inserir na subárvore direita
            newNode.right = this.setNode(node.right, key, value);
        }
        
        return newNode;
    }
    
    // Remove um valor e retorna um novo mapa
    delete(key: K): PersistentMap<K, V> {
        const newRoot = this.deleteNode(this.root, key);
        return new PersistentMap<K, V>(newRoot, this.compare);
    }
    
    private deleteNode(node: MapNode<K, V> | null, key: K): MapNode<K, V> | null {
        if (node === null) {
            return null;
        }
        
        const cmp = this.compare(key, node.key);
        
        if (cmp === 0) {
            // Caso 1: Nó folha
            if (node.left === null && node.right === null) {
                return null;
            }
            
            // Caso 2: Nó com apenas um filho
            if (node.left === null) {
                return node.right;
            }
            if (node.right === null) {
                return node.left;
            }
            
            // Caso 3: Nó com dois filhos
            // Encontrar o sucessor (menor valor na subárvore direita)
            const successor = this.findMin(node.right);
            
            // Criar um novo nó com o valor do sucessor
            const newNode: MapNode<K, V> = {
                key: successor.key,
                value: successor.value,
                left: node.left,
                right: this.deleteNode(node.right, successor.key)
            };
            
            return newNode;
        } else if (cmp < 0) {
            // Buscar na subárvore esquerda
            const newLeft = this.deleteNode(node.left, key);
            if (newLeft === node.left) {
                return node; // Nada mudou
            }
            return {
                ...node,
                left: newLeft
            };
        } else {
            // Buscar na subárvore direita
            const newRight = this.deleteNode(node.right, key);
            if (newRight === node.right) {
                return node; // Nada mudou
            }
            return {
                ...node,
                right: newRight
            };
        }
    }
    
    private findMin(node: MapNode<K, V>): MapNode<K, V> {
        let current = node;
        while (current.left !== null) {
            current = current.left;
        }
        return current;
    }
    
    // Verifica se uma chave existe no mapa
    has(key: K): boolean {
        return this.get(key) !== undefined;
    }
    
    // Retorna um array de todas as chaves
    keys(): K[] {
        const result: K[] = [];
        this.traverseInOrder(this.root, (k, _) => result.push(k));
        return result;
    }
    
    // Retorna um array de todos os valores
    values(): V[] {
        const result: V[] = [];
        this.traverseInOrder(this.root, (_, v) => result.push(v));
        return result;
    }
    
    // Retorna um array de pares [chave, valor]
    entries(): [K, V][] {
        const result: [K, V][] = [];
        this.traverseInOrder(this.root, (k, v) => result.push([k, v]));
        return result;
    }
    
    // Percorre a árvore em ordem
    private traverseInOrder(
        node: MapNode<K, V> | null, 
        callback: (key: K, value: V) => void
    ): void {
        if (node === null) return;
        
        this.traverseInOrder(node.left, callback);
        callback(node.key, node.value);
        this.traverseInOrder(node.right, callback);
    }
    
    // Retorna o tamanho do mapa
    size(): number {
        let count = 0;
        this.traverseInOrder(this.root, () => count++);
        return count;
    }
    
    // Retorna um novo mapa contendo apenas os pares que satisfazem o predicado
    filter(predicate: (key: K, value: V) => boolean): PersistentMap<K, V> {
        let result = new PersistentMap<K, V>(null, this.compare);
        
        this.traverseInOrder(this.root, (k, v) => {
            if (predicate(k, v)) {
                result = result.set(k, v);
            }
        });
        
        return result;
    }
    
    // Transforma todos os valores no mapa
    map<U>(transform: (value: V, key: K) => U): PersistentMap<K, U> {
        let result = new PersistentMap<K, U>(null, this.compare);
        
        this.traverseInOrder(this.root, (k, v) => {
            result = result.set(k, transform(v, k));
        });
        
        return result;
    }
}
```

### Exemplo de Uso

```typescript
// Criar um mapa vazio
const emptyMap = new PersistentMap<string, number>();

// Adicionar elementos
const map1 = emptyMap.set("um", 1);
const map2 = map1.set("dois", 2);
const map3 = map2.set("três", 3);

// Atualizar um valor existente
const map4 = map3.set("dois", 22);

// Remover uma chave
const map5 = map4.delete("um");

// Verificar valores em diferentes versões
console.log(map1.get("um"));    // 1
console.log(map1.get("dois"));  // undefined (ainda não existe em map1)
console.log(map3.get("dois"));  // 2
console.log(map4.get("dois"));  // 22
console.log(map5.get("um"));    // undefined (foi removido)
console.log(map5.get("dois"));  // 22

// Operações funcionais
const doubled = map5.map(value => value * 2);
console.log(doubled.get("dois"));  // 44
console.log(doubled.get("três")); // 6

// Filtrar valores pares
const evenOnly = map5.filter((_, value) => value % 2 === 0);
console.log(evenOnly.size());      // 1
console.log(evenOnly.has("dois")); // true
console.log(evenOnly.has("três")); // false
```

### Visualização das Operações

```ascii
1. map1 = set("um", 1)
   
   "um":1
    / \
  null null

2. map2 = set("dois", 2)
   
   "um":1
    / \
  null "dois":2

3. map3 = set("três", 3)
   
        "um":1
        /   \
      null  "dois":2
              /  \
            null "três":3

4. map4 = set("dois", 22)
   
        "um":1*
        /   \
      null  "dois":22*
              /  \
            null "três":3
            
5. map5 = delete("um")
   
   "dois":22
    /   \
  null  "três":3
```

## 🚀 Otimizações para Mapas Persistentes

### 1. Árvores Balanceadas

Para garantir operações em O(log n), devemos usar árvores balanceadas. Podemos adaptar árvores AVL ou Red-Black para persistência:

```typescript
interface AVLMapNode<K, V> {
    key: K;
    value: V;
    height: number;
    left: AVLMapNode<K, V> | null;
    right: AVLMapNode<K, V> | null;
}

class PersistentAVLMap<K, V> {
    // Implementação similar à PersistentMap, mas com balanceamento
    
    // Calcula a altura do nó
    private height(node: AVLMapNode<K, V> | null): number {
        return node === null ? -1 : node.height;
    }
    
    // Calcula o fator de balanceamento
    private balanceFactor(node: AVLMapNode<K, V>): number {
        return this.height(node.left) - this.height(node.right);
    }
    
    // Rotação simples à direita (cria novos nós)
    private rotateRight(y: AVLMapNode<K, V>): AVLMapNode<K, V> {
        const x = y.left!;
        const T2 = x.right;
        
        const newX: AVLMapNode<K, V> = {
            ...x,
            right: {
                ...y,
                left: T2
            }
        };
        
        // Atualiza as alturas
        newX.right.height = Math.max(this.height(newX.right.left), this.height(newX.right.right)) + 1;
        newX.height = Math.max(this.height(newX.left), this.height(newX.right)) + 1;
        
        return newX;
    }
    
    // Rotação simples à esquerda (similar à rotateRight)
    
    // Balanceia um nó
    private balance(node: AVLMapNode<K, V>): AVLMapNode<K, V> {
        // Implementação do balanceamento AVL com rotações
        // usando cópias em vez de modificar os nós existentes
    }
}
```

### 2. Tries e Hash Array Mapped Tries (HAMT)

Para chaves que podem ser transformadas em sequências de bits, podemos usar Tries ou HAMTs:

```ascii
Hash Array Mapped Trie (HAMT):

        Root
       /    \
      /      \
    Node1    Node2
   /  |  \     
 A    B   C    
```

```typescript
class PersistentHAMT<K, V> {
    private root: any;
    private hashFn: (key: K) => number;
    
    constructor(root = null, hashFn = (key: any) => {
        // Implementação de hash padrão
        return String(key).split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
    }) {
        this.root = root;
        this.hashFn = hashFn;
    }
    
    // Implementação de operações...
}
```

### 3. Uso de Compartilhamento Estrutural

Podemos usar técnicas como compartilhamento estrutural para reduzir o consumo de memória:

```typescript
// Exemplo de compartilhamento estrutural em operação set
private setWithStructuralSharing(
    node: MapNode<K, V> | null, 
    key: K, 
    value: V, 
    path: number[] = []
): MapNode<K, V> {
    // Se chegamos a um nó nulo, criamos um novo
    if (node === null) {
        return { key, value, left: null, right: null };
    }
    
    const cmp = this.compare(key, node.key);
    
    if (cmp === 0) {
        // Se o valor é o mesmo, retorna o nó original (compartilhamento máximo)
        if (node.value === value) {
            return node;
        }
        
        // Caso contrário, cria apenas um novo nó com o valor atualizado
        return { ...node, value };
    } else if (cmp < 0) {
        const newLeft = this.setWithStructuralSharing(node.left, key, value, [...path, 0]);
        
        // Se a subárvore esquerda não mudou, reutiliza o nó atual
        if (newLeft === node.left) {
            return node;
        }
        
        return { ...node, left: newLeft };
    } else {
        const newRight = this.setWithStructuralSharing(node.right, key, value, [...path, 1]);
        
        // Se a subárvore direita não mudou, reutiliza o nó atual
        if (newRight === node.right) {
            return node;
        }
        
        return { ...node, right: newRight };
    }
}
```

## 📈 Análise de Complexidade

As complexidades para um mapa persistente baseado em BST são:

| Operação    | Complexidade (Tempo) | Complexidade (Espaço) |
|-------------|----------------------|-----------------------|
| get         | O(log n)             | O(1)                  |
| set         | O(log n)             | O(log n)              |
| delete      | O(log n)             | O(log n)              |
| has         | O(log n)             | O(1)                  |
| size        | O(n)                 | O(1)                  |
| keys/values | O(n)                 | O(n)                  |

Onde n é o número de elementos no mapa.

Para um mapa persistente balanceado, todas as operações de consulta/modificação garantem O(log n).

## 🌟 Aplicações Práticas

### 1. Gerenciamento de Estado em Front-end

Os mapas persistentes são amplamente utilizados em bibliotecas de gerenciamento de estado:

```typescript
class StoreState {
    private state: PersistentMap<string, any>;
    private listeners: Set<() => void> = new Set();
    private history: PersistentMap<string, any>[] = [];
    private historyIndex = 0;
    
    constructor(initialState: Record<string, any> = {}) {
        this.state = new PersistentMap<string, any>();
        
        // Popula o estado inicial
        Object.entries(initialState).forEach(([key, value]) => {
            this.state = this.state.set(key, value);
        });
        
        this.history.push(this.state);
    }
    
    getState(): Record<string, any> {
        const result: Record<string, any> = {};
        this.state.entries().forEach(([key, value]) => {
            result[key] = value;
        });
        return result;
    }
    
    setState(key: string, value: any): void {
        const newState = this.state.set(key, value);
        
        // Se o estado realmente mudou
        if (newState !== this.state) {
            this.state = newState;
            
            // Adiciona ao histórico e remove histórico "futuro"
            this.history = this.history.slice(0, this.historyIndex + 1);
            this.history.push(this.state);
            this.historyIndex = this.history.length - 1;
            
            // Notifica os ouvintes
            this.notifyListeners();
        }
    }
    
    subscribe(listener: () => void): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
    
    private notifyListeners(): void {
        this.listeners.forEach(listener => listener());
    }
    
    undo(): boolean {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.state = this.history[this.historyIndex];
            this.notifyListeners();
            return true;
        }
        return false;
    }
    
    redo(): boolean {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.state = this.history[this.historyIndex];
            this.notifyListeners();
            return true;
        }
        return false;
    }
}
```

### 2. Memoização de Consultas em Bancos de Dados

Podemos usar mapas persistentes para memoizar resultados de consultas:

```typescript
class QueryCache {
    private cache: PersistentMap<string, any>;
    
    constructor() {
        this.cache = new PersistentMap<string, any>();
    }
    
    async query(queryString: string, params: any[]): Promise<any> {
        const cacheKey = this.getCacheKey(queryString, params);
        
        // Verifica se já temos o resultado em cache
        const cachedResult = this.cache.get(cacheKey);
        if (cachedResult !== undefined) {
            return cachedResult;
        }
        
        // Executa a consulta
        const result = await this.executeQuery(queryString, params);
        
        // Armazena em cache
        this.cache = this.cache.set(cacheKey, result);
        
        return result;
    }
    
    private getCacheKey(queryString: string, params: any[]): string {
        return `${queryString}:${JSON.stringify(params)}`;
    }
    
    private async executeQuery(queryString: string, params: any[]): Promise<any> {
        // Implementação da execução da consulta
    }
    
    // Invalidar entradas específicas do cache
    invalidate(predicate: (key: string) => boolean): void {
        this.cache = this.cache.filter((key, _) => !predicate(key));
    }
}
```

## 🎯 Exercícios Práticos

### Exercícios Básicos

1. Implemente o método `merge` que combina dois mapas persistentes.
2. Adicione um método `forEach` que executa uma função para cada par chave-valor.
3. Crie o método `isEmpty` para verificar se o mapa está vazio.

### Exercícios Intermediários

4. Implemente uma versão balanceada do mapa persistente usando a técnica AVL.
5. Crie um método `diff` que retorna as diferenças entre dois mapas persistentes.
6. Adicione suporte para operações em lote (batch) para melhorar a eficiência.

### Exercícios Avançados

7. Implemente um mapa persistente usando HAMT (Hash Array Mapped Trie).
8. Crie um sistema de caching para consultas com invalidação inteligente usando mapas persistentes.
9. Construa um pequeno framework de gerenciamento de estado usando mapas persistentes.

## ❓ Perguntas Frequentes

1. **Qual é a diferença entre um mapa persistente e um objeto JavaScript comum?**
   - Um mapa persistente mantém todas as versões anteriores, enquanto um objeto JavaScript é mutável.

2. **Os mapas persistentes sempre têm pior desempenho que os mapas mutáveis?**
   - Não necessariamente. Para operações de leitura, o desempenho é similar, e em ambientes concorrentes, mapas persistentes podem ser mais eficientes por não exigirem sincronização.

3. **Como escolher entre as diferentes implementações de mapas persistentes?**
   - Árvores balanceadas são adequadas para uso geral, tries são melhores para conjuntos grandes de dados com chaves que podem ser facilmente convertidas em caminhos.

4. **Os mapas persistentes são adequados para dados que mudam frequentemente?**
   - Sim, mas com ressalvas. Para dados que mudam extremamente frequentemente, considere usar implementações otimizadas ou estruturas hibridamente mutáveis com pontos de imutabilidade.

## 🔗 Recursos Adicionais

- [Immutable.js](https://immutable-js.com/) - Biblioteca popular para estruturas de dados imutáveis em JavaScript
- [Hash Array Mapped Tries](https://lampwww.epfl.ch/papers/idealhashtrees.pdf) - Paper sobre HAMTs
- [Clojure's Persistent Map Implementation](https://blog.higher-order.com/blog/2009/09/08/understanding-clojures-persistenthashmap-deftwice/) - Detalhes da implementação em Clojure
- [Persistent Data Structures for JavaScript](https://github.com/mattbierner/persistent-hash-trie) - Implementações de exemplo

---

Na próxima aula, exploraremos como usar bibliotecas existentes como Immutable.js para trabalhar com estruturas de dados persistentes de forma eficiente em aplicações JavaScript. 