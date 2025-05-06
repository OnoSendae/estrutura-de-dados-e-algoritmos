# Árvores Binárias de Busca (BST)

## 🌳 Introdução: Do Linear ao Hierárquico

Até agora, trabalhamos com estruturas de dados lineares (listas, pilhas, filas). Agora, vamos mergulhar em estruturas hierárquicas - as árvores!

Imagine um sistema de arquivos em seu computador: você tem uma pasta raiz, que contém subpastas, que por sua vez contêm outras subpastas e arquivos. Essa estrutura em níveis é perfeita para organizar dados que possuem uma relação hierárquica.

## 🤔 O que é uma Árvore Binária de Busca?

Uma **Árvore Binária de Busca (BST)** é uma estrutura de dados hierárquica que organiza dados de forma ordenada, permitindo operações eficientes de busca, inserção e remoção.

### Características Principais:

1. **Estrutura Hierárquica**: Organização em níveis (raiz, nós internos, folhas)
2. **Propriedade de Ordem**: Para cada nó:
   - Todos os nós à esquerda têm valores menores
   - Todos os nós à direita têm valores maiores
3. **Binária**: Cada nó tem no máximo dois filhos

### Visualização de uma BST:

```
       50
      /  \
    30    70
   /  \   /  \
  20  40 60  80
```

## 🔍 Terminologia Básica

- **Raiz (Root)**: Nó principal da árvore
- **Folha (Leaf)**: Nó sem filhos
- **Altura**: Número de níveis da árvore
- **Nível (Depth)**: Distância de um nó até a raiz
- **Subárvore**: Uma árvore formada por um nó e seus descendentes
- **Nó Interno**: Nó que tem pelo menos um filho
- **Ancestral**: Um nó no caminho da raiz até outro nó
- **Descendente**: Um nó acessível descendo na árvore
- **Irmão (Sibling)**: Nós que compartilham o mesmo pai

## 🔄 Comparação com Estruturas Lineares

| Operação           | Lista Encadeada   | Árvore BST (média) | Árvore BST (pior) |
|--------------------|-------------------|-------------------|-------------------|
| Busca              | O(n)              | O(log n)          | O(n)              |
| Inserção           | O(1) ou O(n)      | O(log n)          | O(n)              |
| Remoção            | O(1) ou O(n)      | O(log n)          | O(n)              |
| Acesso sequencial  | O(n)              | O(n)              | O(n)              |

## 🌿 Tipos de Árvores Binárias

### 1. Árvore Binária Completa
Cada nível, exceto possivelmente o último, está completamente preenchido.

```
     1
    / \
   2   3
  / \ / \
 4  5 6  7
```

### 2. Árvore Binária Perfeita
Todos os nós internos têm dois filhos e todas as folhas estão no mesmo nível.

```
     1
    / \
   2   3
  / \ / \
 4  5 6  7
```

### 3. Árvore Binária Degenerada
Cada nó tem apenas um filho, essencialmente uma lista encadeada.

```
  1
   \
    2
     \
      3
       \
        4
```

## 💡 Casos de Uso

Árvores Binárias de Busca são usadas em:

1. **Bancos de Dados**: Índices para acelerar buscas
2. **Compiladores**: Árvores de expressão/sintaxe
3. **Sistemas de Arquivos**: Organização de pastas/arquivos
4. **Compressão de Dados**: Árvores de Huffman

## 📊 Vantagens e Desvantagens

### Vantagens:
- Busca, inserção e remoção eficientes (caso médio)
- Mantém os dados ordenados
- Adapta-se bem a conjuntos de dados dinâmicos

### Desvantagens:
- Pode degenerar em uma lista (pior caso)
- Implementação mais complexa que estruturas lineares
- Não garante equilíbrio automático (sem balanceamento)

## 🔄 BST vs Estruturas Lineares: Quando Usar?

Use BST quando:
- Precisar realizar buscas frequentes
- Os dados precisarem ser mantidos ordenados
- Precisar de inserções e remoções eficientes

Use estruturas lineares quando:
- Precisar apenas de acesso sequencial aos dados
- A simplicidade de implementação for mais importante
- O conjunto de dados for pequeno

## 💻 Implementação Básica

### Classe do Nó

```javascript
class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}
```

### Classe da Árvore Binária de Busca

```javascript
class BinarySearchTree {
    constructor() {
        this.root = null;
    }
    
    // Verifica se a árvore está vazia
    isEmpty() {
        return this.root === null;
    }
    
    // Retorna o número de nós na árvore
    size() {
        return this._sizeRec(this.root);
    }
    
    _sizeRec(node) {
        if (node === null) {
            return 0;
        }
        return 1 + this._sizeRec(node.left) + this._sizeRec(node.right);
    }
    
    // Retorna a altura da árvore
    height() {
        return this._heightRec(this.root);
    }
    
    _heightRec(node) {
        if (node === null) {
            return -1;
        }
        const leftHeight = this._heightRec(node.left);
        const rightHeight = this._heightRec(node.right);
        return 1 + Math.max(leftHeight, rightHeight);
    }
}
```

## 🚀 Operações Fundamentais

### 1. Inserção

```javascript
// Método público de inserção
insert(value) {
    this.root = this._insertRec(this.root, value);
}

// Método recursivo privado
_insertRec(node, value) {
    // Se a posição está vazia, cria novo nó
    if (node === null) {
        return new TreeNode(value);
    }
    
    // Insere à esquerda se o valor é menor
    if (value < node.value) {
        node.left = this._insertRec(node.left, value);
    }
    // Insere à direita se o valor é maior
    else if (value > node.value) {
        node.right = this._insertRec(node.right, value);
    }
    // Se o valor já existe, não faz nada
    
    return node;
}
```

#### Visualização da Inserção:

```
Inserindo o valor 40 na árvore:

Passo 1: Árvore inicial
    30
   /  \
  20   50

Passo 2: 40 < 50, vai para a esquerda de 50
    30
   /  \
  20   50
      /
    40

Passo 3: Árvore final
    30
   /  \
  20   50
      /
    40
```

### 2. Busca

```javascript
// Método público de busca
search(value) {
    return this._searchRec(this.root, value);
}

// Método recursivo privado
_searchRec(node, value) {
    // Valor não encontrado
    if (node === null) {
        return false;
    }
    
    // Valor encontrado
    if (value === node.value) {
        return true;
    }
    
    // Busca à esquerda se o valor é menor
    if (value < node.value) {
        return this._searchRec(node.left, value);
    }
    // Busca à direita se o valor é maior
    else {
        return this._searchRec(node.right, value);
    }
}
```

#### Visualização da Busca:

```
Buscando o valor 40 na árvore:

    30              1. Começa na raiz: 40 > 30, vai para a direita
   /  \
  20   50           2. Compara com 50: 40 < 50, vai para a esquerda
      /
    40              3. Compara com 40: 40 == 40, valor encontrado!
```

### 3. Remoção

A remoção é a operação mais complexa. Existem três casos:

1. **Nó folha** (sem filhos)
2. **Nó com um filho**
3. **Nó com dois filhos**

```javascript
// Método público de remoção
remove(value) {
    this.root = this._removeRec(this.root, value);
}

// Método recursivo privado
_removeRec(node, value) {
    if (node === null) {
        return null;
    }
    
    // Encontra o nó a ser removido
    if (value < node.value) {
        node.left = this._removeRec(node.left, value);
    }
    else if (value > node.value) {
        node.right = this._removeRec(node.right, value);
    }
    else {
        // Caso 1: Nó folha ou com um filho
        if (node.left === null) {
            return node.right;
        }
        if (node.right === null) {
            return node.left;
        }
        
        // Caso 2: Nó com dois filhos
        // Encontra o sucessor in-order (menor valor da subárvore direita)
        node.value = this._minValue(node.right);
        
        // Remove o sucessor
        node.right = this._removeRec(node.right, node.value);
    }
    
    return node;
}

// Encontra o menor valor em uma subárvore
_minValue(node) {
    let current = node;
    while (current.left !== null) {
        current = current.left;
    }
    return current.value;
}
```

#### Visualização da Remoção:

```
Remoção de um nó folha (20):
     30             30
    /  \     →     /  \
   20  50         ✕   50
      /               /
     40              40

Remoção de um nó com um filho (50):
     30             30
    /  \     →     /  \
   20  50         20  40
      /
     40

Remoção de um nó com dois filhos (30):
     30             40
    /  \     →     /  \
   20  50         20  50
      /
     40
```

## 🔍 Análise de Complexidade

| Operação | Caso Médio | Pior Caso |
|----------|------------|-----------|
| Busca    | O(log n)   | O(n)      |
| Inserção | O(log n)   | O(n)      |
| Remoção  | O(log n)   | O(n)      |

> **Nota:** O pior caso ocorre quando a árvore está desbalanceada (ex: inserções ordenadas).

## 💡 Aplicação Prática: Sistema de Dicionário

Vamos implementar um simples dicionário usando BST, onde:
- Chave: é a palavra
- Valor: é a definição

```javascript
class DictionaryBST {
    constructor() {
        this.bst = new BinarySearchTree();
    }
    
    // Adiciona uma palavra e sua definição
    addWord(word, definition) {
        this.bst.insert({ word, definition });
    }
    
    // Busca uma definição
    lookupWord(word) {
        return this._lookupWordRec(this.bst.root, word);
    }
    
    _lookupWordRec(node, word) {
        if (node === null) {
            return null; // Palavra não encontrada
        }
        
        if (word === node.value.word) {
            return node.value.definition; // Retorna a definição
        }
        
        if (word < node.value.word) {
            return this._lookupWordRec(node.left, word);
        } else {
            return this._lookupWordRec(node.right, word);
        }
    }
    
    // Remove uma palavra
    removeWord(word) {
        this.bst.root = this._removeWordRec(this.bst.root, word);
    }
    
    _removeWordRec(node, word) {
        // Implementação similar ao método de remoção da BST
    }
}

// Uso:
const dictionary = new DictionaryBST();
dictionary.addWord("algoritmo", "Conjunto de regras para resolver um problema");
dictionary.addWord("estrutura", "Maneira como algo é organizado");
console.log(dictionary.lookupWord("algoritmo")); // "Conjunto de regras para resolver um problema"
```

## 🚀 Conexão com Outras Estruturas

A BST combina vantagens das estruturas lineares (como listas encadeadas) e técnicas de busca eficientes (como busca binária). Em comparação:

1. **vs. Array Ordenado**:
   - BST: Inserção e remoção em O(log n), Busca O(log n)
   - Array: Inserção e remoção em O(n), Busca O(log n)

2. **vs. Lista Encadeada**:
   - BST: Todas operações em O(log n) no caso médio
   - Lista: Todas operações em O(n)

## 🔄 Travessias em Árvores Binárias

**Travessia (ou percurso)** é o processo de visitar todos os nós de uma árvore de maneira sistemática. Diferente das estruturas lineares, que têm apenas uma maneira de percorrer os elementos (do início ao fim), as árvores oferecem múltiplas formas de percurso.

Para a árvore abaixo, usaremos diferentes estratégias de travessia:

```
       50
      /  \
    30    70
   /  \   /  \
  20  40 60  80
```

## 📚 Tipos de Travessias

### 1. In-Order (Em-Ordem)

**Algoritmo**: Esquerda → Raiz → Direita

**Implementação**:
```javascript
inOrder() {
    const result = [];
    this._inOrderRec(this.root, result);
    return result;
}

_inOrderRec(node, result) {
    if (node !== null) {
        this._inOrderRec(node.left, result);
        result.push(node.value);
        this._inOrderRec(node.right, result);
    }
}
```

**Resultado**: [20, 30, 40, 50, 60, 70, 80]

**Visualização**:
```
       50
      /  \
    30    70    Percurso:
   /  \   /  \  1. Subárvore esquerda de 50 (30, 20, 40)
  20  40 60  80  2. Raiz (50)
                  3. Subárvore direita de 50 (70, 60, 80)
```

**Uso**: Em árvores BST, produz elementos em ordem crescente. Útil para:
- Listar elementos ordenados
- Validar se uma árvore é BST
- Encontrar sucessor/predecessor de um nó

### 2. Pre-Order (Pré-Ordem)

**Algoritmo**: Raiz → Esquerda → Direita

**Implementação**:
```javascript
preOrder() {
    const result = [];
    this._preOrderRec(this.root, result);
    return result;
}

_preOrderRec(node, result) {
    if (node !== null) {
        result.push(node.value);
        this._preOrderRec(node.left, result);
        this._preOrderRec(node.right, result);
    }
}
```

**Resultado**: [50, 30, 20, 40, 70, 60, 80]

**Visualização**:
```
       50
      /  \
    30    70    Percurso:
   /  \   /  \  1. Raiz (50)
  20  40 60  80  2. Subárvore esquerda de 50 (30, 20, 40)
                  3. Subárvore direita de 50 (70, 60, 80)
```

**Uso**: Útil para:
- Criar uma cópia da árvore
- Serializar uma árvore
- Avaliar expressões em notação prefixa

### 3. Post-Order (Pós-Ordem)

**Algoritmo**: Esquerda → Direita → Raiz

**Implementação**:
```javascript
postOrder() {
    const result = [];
    this._postOrderRec(this.root, result);
    return result;
}

_postOrderRec(node, result) {
    if (node !== null) {
        this._postOrderRec(node.left, result);
        this._postOrderRec(node.right, result);
        result.push(node.value);
    }
}
```

**Resultado**: [20, 40, 30, 60, 80, 70, 50]

**Visualização**:
```
       50
      /  \
    30    70    Percurso:
   /  \   /  \  1. Subárvore esquerda de 50 (20, 40, 30)
  20  40 60  80  2. Subárvore direita de 50 (60, 80, 70)
                  3. Raiz (50)
```

**Uso**: Útil para:
- Excluir árvores (processando filhos antes da raiz)
- Avaliar expressões em notação pós-fixa
- Cálculo de tamanho/altura de subárvores

### 4. Level-Order (Percurso por Nível)

**Algoritmo**: Percorre a árvore nível por nível, da esquerda para a direita

**Implementação**:
```javascript
levelOrder() {
    if (this.root === null) {
        return [];
    }
    
    const result = [];
    const queue = [this.root];
    
    while (queue.length > 0) {
        const node = queue.shift();
        result.push(node.value);
        
        if (node.left !== null) {
            queue.push(node.left);
        }
        
        if (node.right !== null) {
            queue.push(node.right);
        }
    }
    
    return result;
}
```

**Resultado**: [50, 30, 70, 20, 40, 60, 80]

**Visualização**:
```
  Nível 0:    50      Percurso:
             /  \     1. Nível 0: [50]
  Nível 1:  30    70   2. Nível 1: [30, 70]
           /  \  /  \  3. Nível 2: [20, 40, 60, 80]
  Nível 2: 20 40 60 80
```

**Uso**: Útil para:
- Encontrar o caminho mais curto em árvores
- Visualização de árvores por nível
- Conexão com algoritmos BFS para grafos

## 📊 Comparação de Travessias

| Travessia | Ordem de Visita | Aplicação Principal | Estrutura Usada na Implementação Iterativa |
|-----------|----------------|-------------------|--------------------------------------------|
| In-Order | Esquerda → Raiz → Direita | Listar elementos em ordem | Pilha |
| Pre-Order | Raiz → Esquerda → Direita | Copiar/serializar árvore | Pilha |
| Post-Order | Esquerda → Direita → Raiz | Exclusão de árvore | Pilha (mais complexa) |
| Level-Order | Nível por nível | Menor caminho | Fila |

## 💻 Implementação Iterativa vs. Recursiva

As travessias podem ser implementadas de forma recursiva (como vimos) ou iterativa. A versão iterativa evita o uso excessivo da pilha de chamadas:

### Exemplo: In-Order Iterativo

```javascript
inOrderIterative() {
    const result = [];
    const stack = [];
    let current = this.root;
    
    while (current !== null || stack.length > 0) {
        // Chega ao nó mais à esquerda
        while (current !== null) {
            stack.push(current);
            current = current.left;
        }
        
        // Current é null, então tiramos da pilha
        current = stack.pop();
        result.push(current.value);
        
        // Vamos para o nó à direita
        current = current.right;
    }
    
    return result;
}
```

## 💡 Aplicação Prática: Geração de Expressões

### Exemplo: Converter uma árvore de expressão para notações infixa, prefixa e posfixa

```javascript
// Exemplo de árvore para a expressão (5 + 3) * 2 - 1
//        -
//       / \
//      *   1
//     / \
//    +   2
//   / \
//  5   3

class ExpressionTreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

// Converter para notação infixa (in-order com parênteses)
function toInfix(node) {
    if (node === null) return "";
    
    if (node.left === null && node.right === null) {
        return node.value.toString();
    }
    
    let leftExpr = toInfix(node.left);
    let rightExpr = toInfix(node.right);
    
    return `(${leftExpr} ${node.value} ${rightExpr})`;
}

// Converter para notação prefixa (pre-order)
function toPrefix(node) {
    if (node === null) return "";
    
    if (node.left === null && node.right === null) {
        return node.value.toString();
    }
    
    let leftExpr = toPrefix(node.left);
    let rightExpr = toPrefix(node.right);
    
    return `${node.value} ${leftExpr} ${rightExpr}`;
}

// Converter para notação posfixa (post-order)
function toPostfix(node) {
    if (node === null) return "";
    
    if (node.left === null && node.right === null) {
        return node.value.toString();
    }
    
    let leftExpr = toPostfix(node.left);
    let rightExpr = toPostfix(node.right);
    
    return `${leftExpr} ${rightExpr} ${node.value}`;
}
```

**Saída para a expressão (5 + 3) * 2 - 1**:
- Infixa: ((5 + 3) * 2) - 1
- Prefixa: - * + 5 3 2 1
- Posfixa: 5 3 + 2 * 1 -

## 🔄 Conexão com Estruturas Vistas Anteriormente

- A travessia Level-Order usa uma **fila** (estrutura vista no módulo anterior)
- As travessias In/Pre/Post-Order recursivas usam implicitamente a **pilha** de chamadas
- As versões iterativas dessas travessias usam explicitamente uma **pilha**

No próximo tópico, estudaremos árvores balanceadas, que solucionam o problema da degeneração da BST e garantem operações eficientes mesmo no pior caso. 