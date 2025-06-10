# Fundamentos de Estruturas de Dados Persistentes e Imutáveis

## 🔄 Revisão de Conceitos Fundamentais

Antes de mergulharmos nas estruturas de dados persistentes, vamos revisar brevemente os conceitos fundamentais de árvores que já estudamos:

```ascii
Árvore Binária Básica       Árvore Binária de Busca
      A                           50
     / \                         /  \
    B   C                       30   70
   / \                         / \   / \
  D   E                       20 40 60  80
```

Nas estruturas de dados tradicionais (mutáveis), quando realizamos operações como inserção ou remoção, modificamos a estrutura original. Isso pode causar problemas em ambientes concorrentes ou quando precisamos manter o histórico de alterações.

## 🎯 Objetivos de Aprendizagem

- Compreender os fundamentos teóricos de estruturas de dados persistentes e imutáveis
- Entender o valor da imutabilidade em contextos de programação funcional e concorrente
- Implementar versões persistentes de árvores binárias de busca
- Aplicar árvores persistentes em cenários que requerem histórico de versões
- Analisar a complexidade de tempo e espaço dessas estruturas
- Comparar estruturas persistentes com suas contrapartes mutáveis

## 📚 Introdução às Estruturas Persistentes

As estruturas de dados persistentes representam um paradigma poderoso que permite manter o histórico completo de modificações, onde cada operação cria uma nova versão da estrutura sem modificar as versões anteriores.

### Conceito de Persistência

```ascii
               Original
                  │
        ┌─────────┴─────────┐
        │                   │
  Versão após      Versão após
  adicionar 5     remover 10
        │                   │
   ┌────┴───┐          ┌────┴───┐
   │        │          │        │
   ▼        ▼          ▼        ▼
  ...      ...        ...      ...
```

A persistência em estruturas de dados pode ser classificada em diferentes níveis:

1. **Persistência Parcial**: Permite consultar qualquer versão anterior, mas só permite modificações na versão mais recente.
2. **Persistência Total**: Permite consultas e modificações em qualquer versão.
3. **Persistência Confluente**: Além da persistência total, permite combinar diferentes versões.
4. **Persistência Funcional**: Todas as operações criam novas versões sem modificar as existentes.

### Comparação com Estruturas Mutáveis

| Característica | Estrutura Mutável | Estrutura Persistente |
|----------------|-------------------|------------------------|
| Estado | Único estado que muda | Múltiplos estados imutáveis |
| Histórico | Não mantém | Preserva todas as versões |
| Concorrência | Precisa de locks | Naturalmente thread-safe |
| Memória | Mais eficiente | Requer mais espaço |
| Depuração | Mais complexa | Mais simples |

### Por que Usar Estruturas Persistentes?

- **Desfazer/Refazer**: Facilita implementação de operações de desfazer/refazer em editores.
- **Depuração**: Permite examinar o estado anterior quando um problema ocorre.
- **Concorrência**: Simplifica o raciocínio sobre código concorrente eliminando estados compartilhados mutáveis.
- **Algoritmos Incrementais**: Permite testar diferentes caminhos sem duplicar toda a estrutura.
- **Programação Funcional**: Fundamental para linguagens funcionais puras.

## 🌳 Árvores Binárias de Busca Persistentes

Uma árvore binária de busca persistente permite que você acesse qualquer versão anterior após inserções, exclusões ou atualizações.

### Implementação Básica

Vamos implementar uma BST persistente simples em TypeScript:

```typescript
interface TreeNode<T> {
    value: T;
    left: TreeNode<T> | null;
    right: TreeNode<T> | null;
}

class PersistentBST<T> {
    root: TreeNode<T> | null;
    
    constructor(root: TreeNode<T> | null = null) {
        this.root = root;
    }
    
    // Insere um valor e retorna uma nova árvore
    insert(value: T): PersistentBST<T> {
        const newRoot = this.insertNode(this.root, value);
        return new PersistentBST(newRoot);
    }
    
    private insertNode(node: TreeNode<T> | null, value: T): TreeNode<T> {
        // Se o nó é nulo, cria um novo nó
        if (node === null) {
            return { value, left: null, right: null };
        }
        
        // Cria um novo nó com os mesmos valores
        const newNode: TreeNode<T> = { ...node };
        
        // Decide em qual subárvore inserir
        if (value < node.value) {
            newNode.left = this.insertNode(node.left, value);
        } else if (value > node.value) {
            newNode.right = this.insertNode(node.right, value);
        }
        
        // Retorna o novo nó (raiz da subárvore)
        return newNode;
    }
    
    // Encontra um valor
    find(value: T): boolean {
        return this.findInNode(this.root, value);
    }
    
    private findInNode(node: TreeNode<T> | null, value: T): boolean {
        if (node === null) return false;
        if (node.value === value) return true;
        
        if (value < node.value) {
            return this.findInNode(node.left, value);
        } else {
            return this.findInNode(node.right, value);
        }
    }
    
    // Remove um valor e retorna uma nova árvore
    remove(value: T): PersistentBST<T> {
        const newRoot = this.removeNode(this.root, value);
        return new PersistentBST(newRoot);
    }
    
    private removeNode(node: TreeNode<T> | null, value: T): TreeNode<T> | null {
        if (node === null) return null;
        
        // Cria um novo nó para preservar o original
        let newNode: TreeNode<T> = { ...node };
        
        if (value < node.value) {
            newNode.left = this.removeNode(node.left, value);
        } else if (value > node.value) {
            newNode.right = this.removeNode(node.right, value);
        } else {
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
            newNode.value = successor.value;
            
            // Remover o sucessor da subárvore direita
            newNode.right = this.removeNode(node.right, successor.value);
        }
        
        return newNode;
    }
    
    private findMin(node: TreeNode<T>): TreeNode<T> {
        let current = node;
        while (current.left !== null) {
            current = current.left;
        }
        return current;
    }

    // Método adicional para percorrer a árvore em ordem
    inOrderTraversal(): T[] {
        const result: T[] = [];
        this.inOrderTraversalNode(this.root, result);
        return result;
    }
    
    private inOrderTraversalNode(node: TreeNode<T> | null, result: T[]): void {
        if (node === null) return;
        
        this.inOrderTraversalNode(node.left, result);
        result.push(node.value);
        this.inOrderTraversalNode(node.right, result);
    }
}
```

### Exemplo de Uso

```typescript
// Criar uma árvore vazia
const emptyTree = new PersistentBST<number>();

// Inserir elementos e criar novas versões
const version1 = emptyTree.insert(10);
const version2 = version1.insert(5);
const version3 = version2.insert(15);
const version4 = version3.insert(3);

// Versão alternativa derivada de version3
const altVersion = version3.insert(7);

// Remover um elemento
const version5 = version4.remove(5);

// Podemos acessar todas as versões
console.log("version1 contém 5?", version1.find(5)); // false
console.log("version2 contém 5?", version2.find(5)); // true
console.log("version5 contém 5?", version5.find(5)); // false (removido)
console.log("altVersion contém 7?", altVersion.find(7)); // true

// Visualização da evolução
console.log("version1:", version1.inOrderTraversal()); // [10]
console.log("version2:", version2.inOrderTraversal()); // [5, 10]
console.log("version3:", version3.inOrderTraversal()); // [5, 10, 15]
console.log("version4:", version4.inOrderTraversal()); // [3, 5, 10, 15]
console.log("version5:", version5.inOrderTraversal()); // [3, 10, 15]
console.log("altVersion:", altVersion.inOrderTraversal()); // [5, 7, 10, 15]
```

### Visualização da Evolução das Versões

```ascii
version1:         version2:         version3:         version4:         version5:
   10                10                10                10                10
                    /                 / \               / \               / \
                   5                 5   15            5   15            3   15
                                                     /
                                                    3

altVersion:
    10
   /  \
  5    15
   \
    7
```

## 🚀 Técnicas de Otimização para Persistência

### Path Copying (Cópia de Caminho)

A técnica que usamos acima é chamada "path copying", onde somente o caminho da raiz até o nó modificado é copiado.

```ascii
         Original               Nova Versão
            10                      10*
           /  \                    /  \
          5   15        →         5*  15
         / \                     / \
        3   7                   3   8*
```

No diagrama acima, apenas os nós marcados com asterisco (*) são novos. Isso economiza espaço significativo em comparação com duplicar toda a árvore.

#### Exemplo Detalhado de Path Copying - Inserção do valor 8

```ascii
Passo 1: Estado original
         10
        /  \
       5    15
      / \
     3   7

Passo 2: Começa a inserção, cria cópia da raiz
         10*
        /  \
       5    15
      / \
     3   7

Passo 3: Desce para o nó 5, cria cópia
         10*
        /  \
       5*   15
      / \
     3   7

Passo 4: Desce para o nó 7, cria cópia e insere 8
         10*
        /  \
       5*   15
      / \
     3   7*
          \
           8

Resultado final: Apenas os nós no caminho foram copiados (10*, 5*, 7*)
```

### Fat Nodes (Nós Gordos)

Uma abordagem alternativa para estruturas persistentes é usar "fat nodes", onde cada nó mantém um histórico de modificações:

```typescript
interface Version {
    id: number;
    timestamp: number;
}

interface FatNode<T> {
    value: T;
    versions: Version[];
    left: Map<number, FatNode<T> | null>;  // versão -> nó esquerdo
    right: Map<number, FatNode<T> | null>; // versão -> nó direito
}

class FatNodeBST<T> {
    private root: FatNode<T> | null;
    private currentVersion: number;
    
    constructor() {
        this.root = null;
        this.currentVersion = 0;
    }
    
    // Cria uma nova versão e retorna seu ID
    private createNewVersion(): number {
        return ++this.currentVersion;
    }
    
    // Insere um valor na versão atual e retorna a nova versão
    insert(value: T): number {
        const newVersion = this.createNewVersion();
        this.root = this.insertNode(this.root, value, newVersion);
        return newVersion;
    }
    
    private insertNode(node: FatNode<T> | null, value: T, version: number): FatNode<T> {
        if (node === null) {
            // Cria um novo nó
            return {
                value,
                versions: [{ id: version, timestamp: Date.now() }],
                left: new Map(),
                right: new Map()
            };
        }
        
        if (value < node.value) {
            // Adiciona filho à esquerda para esta versão
            const leftChild = this.insertNode(
                node.left.get(this.getLatestVersionBefore(node.left, version)) || null,
                value,
                version
            );
            node.left.set(version, leftChild);
        } else if (value > node.value) {
            // Adiciona filho à direita para esta versão
            const rightChild = this.insertNode(
                node.right.get(this.getLatestVersionBefore(node.right, version)) || null,
                value,
                version
            );
            node.right.set(version, rightChild);
        }
        
        // Registra esta versão no nó
        node.versions.push({ id: version, timestamp: Date.now() });
        return node;
    }
    
    // Obtém a versão mais recente menor ou igual à versão especificada
    private getLatestVersionBefore(versionMap: Map<number, any>, version: number): number {
        let latestVersion = -1;
        for (const v of versionMap.keys()) {
            if (v <= version && v > latestVersion) {
                latestVersion = v;
            }
        }
        return latestVersion;
    }
    
    // Encontra um valor em uma versão específica
    find(value: T, version: number): boolean {
        return this.findInNode(this.root, value, version);
    }
    
    private findInNode(node: FatNode<T> | null, value: T, version: number): boolean {
        if (node === null) return false;
        
        // Verifica se o nó existia na versão especificada
        const nodeVersion = node.versions.find(v => v.id <= version);
        if (!nodeVersion) return false;
        
        if (node.value === value) return true;
        
        if (value < node.value) {
            const leftChildVersion = this.getLatestVersionBefore(node.left, version);
            if (leftChildVersion === -1) return false;
            return this.findInNode(node.left.get(leftChildVersion) || null, value, version);
        } else {
            const rightChildVersion = this.getLatestVersionBefore(node.right, version);
            if (rightChildVersion === -1) return false;
            return this.findInNode(node.right.get(rightChildVersion) || null, value, version);
        }
    }
}
```

#### Visualização do Conceito de Fat Nodes

```ascii
Fat Node (mantém valores para várias versões):

┌───────────────────────────────┐
│ Valor: 10                     │
│                               │
│ Versões:                      │
│  - v1 (timestamp: 1001)       │
│  - v2 (timestamp: 1005)       │
│  - v4 (timestamp: 1015)       │
│                               │
│ Esquerda:                     │
│  - v1 → null                  │
│  - v2 → Nó[5]                 │
│  - v4 → Nó[5]                 │
│                               │
│ Direita:                      │
│  - v1 → null                  │
│  - v2 → null                  │
│  - v4 → Nó[15]                │
└───────────────────────────────┘
```

### Análise de Complexidade

- **Espaço com Path Copying**: O(log n) adicional por operação
- **Espaço com Fat Nodes**: O(n + m) onde n é o número de nós e m o número de modificações
- **Tempo para Path Copying**: O(log n) para operações padrão da BST
- **Tempo para Fat Nodes**: O(log n + log v) onde v é o número de versões

## 🌟 Aplicações Práticas

### 1. Controle de Versão em Editores de Texto

Os editores de texto modernos usam estruturas persistentes para manter o histórico de edições:

```typescript
class TextEditor {
    private versions: PersistentBST<string>[] = [];
    private currentVersion = 0;
    
    constructor(initialText: string) {
        const lines = initialText.split('\n');
        let tree = new PersistentBST<string>();
        
        // Inserir cada linha na árvore com o número da linha como chave
        for (let i = 0; i < lines.length; i++) {
            tree = tree.insert(lines[i]);
        }
        
        this.versions.push(tree);
    }
    
    editLine(lineNumber: number, newText: string) {
        // Cria uma nova versão a partir da atual
        const newTree = this.versions[this.currentVersion].remove(lineNumber);
        const updatedTree = newTree.insert(newText);
        
        // Adiciona a nova versão e atualiza o ponteiro
        this.versions.push(updatedTree);
        this.currentVersion++;
    }
    
    undo() {
        if (this.currentVersion > 0) {
            this.currentVersion--;
        }
    }
    
    redo() {
        if (this.currentVersion < this.versions.length - 1) {
            this.currentVersion++;
        }
    }
}
```

### 2. Estruturas Funcionais para Programação Concorrente

As estruturas persistentes são ideais para sistemas concorrentes, pois eliminam a necessidade de bloqueios:

```typescript
// Worker thread processar dados sem bloqueios
function processDataConcurrently(data: PersistentBST<number>) {
    // Cada thread pode criar sua própria versão
    const localVersion = data.insert(threadLocalValue);
    
    // Processa usando a versão local
    const result = process(localVersion);
    
    // Combina resultados sem conflitos
    return mergeResults(result);
}
```

### 3. Exploração de Espaço de Estados em IA

Algoritmos de busca em IA podem usar estruturas persistentes para explorar diferentes caminhos:

```typescript
function alphaBetaPruning(gameState: PersistentGameTree, depth: number): number {
    if (depth === 0) return evaluate(gameState);
    
    const possibleMoves = gameState.getValidMoves();
    
    let bestValue = -Infinity;
    for (const move of possibleMoves) {
        // Cria um novo estado sem modificar o original
        const newState = gameState.applyMove(move);
        
        const value = -alphaBetaPruning(newState, depth - 1);
        bestValue = Math.max(bestValue, value);
    }
    
    return bestValue;
}
```

## 📈 Considerações sobre Performance

### Vantagens
- Operações desfazer/refazer em tempo constante
- Facilita concorrência e paralelismo
- Simplifica o raciocínio sobre o código

### Desvantagens
- Maior consumo de memória (apesar das otimizações)
- Possível overhead em operações simples
- Complexidade da implementação

### Benchmarking

Comparação de desempenho entre BST mutável e persistente em diferentes operações:

```ascii
                  │ Inserção   │ Busca      │ Remoção    │ Memória
──────────────────┼────────────┼────────────┼────────────┼────────────
BST Mutável       │ O(log n)   │ O(log n)   │ O(log n)   │ O(n)
BST Persistente   │ O(log n)   │ O(log n)   │ O(log n)   │ O(n + v log n)
(Path Copying)    │            │            │            │
BST Persistente   │ O(log n)   │ O(log n+v) │ O(log n)   │ O(n + m)
(Fat Nodes)       │            │            │            │

onde:
  n = número de elementos
  v = número de versões
  m = número de modificações
```

## 🔄 Comparação com Estruturas Mutáveis

| Aspecto | Estruturas Persistentes | Estruturas Tradicionais |
|---------|-------------------------|-------------------------|
| Memória | Maior uso | Menor uso |
| Concorrência | Excelente | Requer sincronização |
| Histórico | Nativo | Necessita implementação extra |
| Complexidade | Maior | Menor |
| Debug | Mais fácil | Mais difícil |
| Raciocínio | Mais simples | Mais complexo |
| Reutilização | Alta | Baixa |

## 🎯 Exercícios Práticos

### Exercícios Básicos
1. Implemente uma função que verifica se duas versões diferentes de uma BST persistente são iguais.
2. Adicione um método para calcular a altura de uma BST persistente em uma versão específica.
3. Modifique a implementação para contar quantos nós foram realmente criados durante uma operação de inserção.

### Exercícios Intermediários
4. Implemente um método que combina duas versões diferentes de uma BST persistente.
5. Adicione balanceamento (AVL ou Red-Black) à nossa BST persistente.
6. Crie uma tabela hash persistente baseada em árvores.

### Exercícios Avançados
7. Construa um editor de texto simples com histórico usando estruturas persistentes.
8. Implemente um sistema de controle de versão simplificado para arquivos.
9. Compare o desempenho de árvores persistentes vs. tradicionais em diferentes cenários.

## ❓ Perguntas Frequentes

1. **Quando devo usar estruturas persistentes em vez de estruturas mutáveis?**
   - Use estruturas persistentes quando precisar manter histórico de alterações, trabalhar em ambiente concorrente, ou implementar funcionalidades de desfazer/refazer.

2. **As estruturas persistentes são sempre mais lentas?**
   - Não necessariamente. Embora existam overheads, em cenários concorrentes elas podem ser mais rápidas por eliminarem a necessidade de locks.

3. **Como escolher entre Path Copying e Fat Nodes?**
   - Use Path Copying para melhor desempenho em operações comuns e menor overhead de memória por operação. Use Fat Nodes quando o número de versões for muito alto.

4. **As estruturas persistentes são usadas em sistemas reais?**
   - Sim! Sistemas como Git, bancos de dados como Datomic, bibliotecas como Immutable.js, e frameworks como React usam conceitos de persistência.

## 🔗 Recursos Adicionais

- [Purely Functional Data Structures](https://www.cs.cmu.edu/~rwh/theses/okasaki.pdf) por Chris Okasaki
- [Making Data Structures Persistent](https://www.cs.cmu.edu/~sleator/papers/making-data-structures-persistent.pdf) por Driscoll et al.
- Bibliotecas: Immutable.js, Immer para JavaScript/TypeScript
- [Persistent Data Structures in JavaScript](https://github.com/funkia/list) - Implementação de lista funcional
- [Understanding Persistence](https://medium.com/@dtinth/immutable-js-persistent-data-structures-and-structural-sharing-6d163fbd73d2) - Artigo sobre compartilhamento estrutural

---

