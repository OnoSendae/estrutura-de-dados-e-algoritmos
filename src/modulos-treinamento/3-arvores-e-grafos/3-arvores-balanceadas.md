# Árvores Balanceadas

## 🤔 Por que Precisamos de Árvores Balanceadas?

Vimos que as BSTs convencionais têm complexidade O(log n) no caso médio, mas podem degenerar para O(n) no pior caso. Isto acontece quando os dados são inseridos em ordem crescente ou decrescente:

```
Inserção na ordem: 10, 20, 30, 40, 50
    
    10
     \
     20
       \
       30
         \
         40
           \
           50
```

Esta árvore degenerada se comporta como uma lista encadeada, perdendo todas as vantagens de busca eficiente das árvores binárias.

## 🔍 AVL Trees: A Primeira Árvore Auto-Balanceada

Criada em 1962 pelos matemáticos soviéticos Adelson-Velsky e Landis, a **AVL Tree** é uma BST que mantém o balanceamento automaticamente após cada inserção e remoção.

### Definição

Uma árvore AVL garante que para qualquer nó, a diferença de altura entre suas subárvores esquerda e direita não excede 1.

### Fator de Balanceamento

```
Fator de Balanceamento (FB) = altura(subárvore esquerda) - altura(subárvore direita)
Valores permitidos: -1, 0, 1
```

### Visualização de uma AVL

```
        50 (FB: 0)
       /  \
   30 (FB: 0)   70 (FB: 0)
   /  \         /  \
20 40 (FB: 0) 60  80 (FB: 0)
```

## 💻 Implementação AVL

### Classe do Nó AVL

```javascript
class AVLNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1; // Altura inicial é 1
    }
}
```

### Classe da Árvore AVL

```javascript
class AVLTree {
    constructor() {
        this.root = null;
    }
    
    // Obtém a altura de um nó
    getHeight(node) {
        if (node === null) {
            return 0;
        }
        return node.height;
    }
    
    // Calcula o fator de balanceamento
    getBalanceFactor(node) {
        if (node === null) {
            return 0;
        }
        return this.getHeight(node.left) - this.getHeight(node.right);
    }
    
    // Atualiza a altura de um nó
    updateHeight(node) {
        if (node === null) {
            return;
        }
        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    }
}
```

## 🔄 Rotações: Restaurando o Balanceamento

Quando uma inserção ou remoção causa um desequilíbrio (FB fora do intervalo [-1, 1]), a árvore AVL utiliza **rotações** para restaurar o balanceamento.

### 1. Rotação Simples à Direita (Caso LL)

Aplicada quando o desequilíbrio ocorre na subárvore esquerda da subárvore esquerda.

```javascript
// Rotação à direita
rightRotate(y) {
    const x = y.left;
    const T2 = x.right;
    
    // Realiza a rotação
    x.right = y;
    y.left = T2;
    
    // Atualiza as alturas
    this.updateHeight(y);
    this.updateHeight(x);
    
    return x;
}
```

Visualização da rotação à direita:
```
     y                x
    / \              / \
   x   C    →       A   y
  / \                  / \
 A   B                B   C
```

### 2. Rotação Simples à Esquerda (Caso RR)

Aplicada quando o desequilíbrio ocorre na subárvore direita da subárvore direita.

```javascript
// Rotação à esquerda
leftRotate(x) {
    const y = x.right;
    const T2 = y.left;
    
    // Realiza a rotação
    y.left = x;
    x.right = T2;
    
    // Atualiza as alturas
    this.updateHeight(x);
    this.updateHeight(y);
    
    return y;
}
```

Visualização da rotação à esquerda:
```
   x                  y
  / \                / \
 A   y      →       x   C
    / \            / \
   B   C          A   B
```

### 3. Rotação Dupla Esquerda-Direita (Caso LR)

Aplicada quando o desequilíbrio ocorre na subárvore direita da subárvore esquerda.

```javascript
// Rotação esquerda-direita
leftRightRotate(node) {
    node.left = this.leftRotate(node.left);
    return this.rightRotate(node);
}
```

Visualização da rotação esquerda-direita:
```
     z                z                  y
    / \              / \                / \
   x   D    →       y   D     →       x    z
  / \              / \                / \  / \
 A   y            x   C              A  B C  D
    / \          / \
   B   C        A   B
```

### 4. Rotação Dupla Direita-Esquerda (Caso RL)

Aplicada quando o desequilíbrio ocorre na subárvore esquerda da subárvore direita.

```javascript
// Rotação direita-esquerda
rightLeftRotate(node) {
    node.right = this.rightRotate(node.right);
    return this.leftRotate(node);
}
```

Visualização da rotação direita-esquerda:
```
   x                 x                  y
  / \               / \                / \
 A   z     →       A   y      →      x   z
    / \               / \            / \ / \
   y   D             B   z          A  B C D
  / \                   / \
 B   C                 C   D
```

## 🚀 Inserção em AVL

O processo de inserção é similar à BST, mas com verificação e correção de balanceamento em cada nível durante o retorno da recursão.

```javascript
insert(value) {
    this.root = this._insertRec(this.root, value);
}

_insertRec(node, value) {
    // 1. Inserção normal de BST
    if (node === null) {
        return new AVLNode(value);
    }
    
    if (value < node.value) {
        node.left = this._insertRec(node.left, value);
    } else if (value > node.value) {
        node.right = this._insertRec(node.right, value);
    } else {
        return node; // Duplicatas não são permitidas
    }
    
    // 2. Atualiza a altura do nó ancestral
    this.updateHeight(node);
    
    // 3. Obtém o fator de balanceamento
    const balance = this.getBalanceFactor(node);
    
    // 4. Se o nó está desbalanceado, há 4 casos
    
    // Caso Esquerda-Esquerda (LL)
    if (balance > 1 && value < node.left.value) {
        return this.rightRotate(node);
    }
    
    // Caso Direita-Direita (RR)
    if (balance < -1 && value > node.right.value) {
        return this.leftRotate(node);
    }
    
    // Caso Esquerda-Direita (LR)
    if (balance > 1 && value > node.left.value) {
        return this.leftRightRotate(node);
    }
    
    // Caso Direita-Esquerda (RL)
    if (balance < -1 && value < node.right.value) {
        return this.rightLeftRotate(node);
    }
    
    // Retorna o ponteiro do nó (não modificado)
    return node;
}
```

## 🔄 Exemplo Passo a Passo

Vamos inserir os valores 10, 20, 30, 40, 50 em uma árvore AVL e ver o balanceamento:

### Inserção do 10:
```
10 (FB: 0)
```

### Inserção do 20:
```
10 (FB: -1)
  \
  20 (FB: 0)
```

### Inserção do 30 (causa desequilíbrio, rotação LL):
```
Antes do balanceamento:    Após a rotação:
10 (FB: -2)                 20 (FB: 0)
  \                        /  \
  20 (FB: -1)      →     10   30
    \                   (FB:0) (FB:0)
    30 (FB: 0)
```

### Inserção do 40:
```
    20 (FB: -1)
   /  \
10    30 (FB: -1)
        \
        40 (FB: 0)
```

### Inserção do 50 (causa desequilíbrio, rotação RL):
```
Antes do balanceamento:      Após a rotação:
    20 (FB: -2)                 30 (FB: 0)
   /  \                        /  \
10    30 (FB: -2)      →    20    40 (FB: -1)
        \                  /  \     \
        40 (FB: -1)      10   ✕     50
          \                        (FB: 0)
          50 (FB: 0)
```

## 📊 Análise de Complexidade

| Operação | Complexidade |
|----------|------------|
| Busca    | O(log n)   |
| Inserção | O(log n)   |
| Remoção  | O(log n)   |
| Espaço   | O(n)       |

A árvore AVL garante o balanceamento a cada operação, resultando em operações de busca, inserção e remoção com complexidade O(log n) **mesmo no pior caso**.

## 🔄 Comparação com BST Regular

| Característica    | BST Regular   | AVL Tree     |
|-------------------|---------------|--------------|
| Busca (média)     | O(log n)      | O(log n)     |
| Busca (pior)      | O(n)          | O(log n)     |
| Inserção (média)  | O(log n)      | O(log n)     |
| Inserção (pior)   | O(n)          | O(log n)     |
| Custo adicional   | Nenhum        | Fator de balanceamento e rotações |
| Altura garantida  | Não           | Sim (≤ 1.44 log n) |

## 💡 Quando Usar AVL Trees?

AVL Trees são ideais quando:

1. As operações de **busca são frequentes** e precisam ser eficientes
2. A árvore não muda com muita frequência (inserções/remoções são menos frequentes)
3. A garantia de balanceamento estrito é necessária

## 🔍 Introdução às Red-Black Trees

Enquanto as árvores AVL mantêm um balanceamento muito estrito (diferença de altura máxima de 1), as **Red-Black Trees** oferecem um balanceamento mais relaxado, mas ainda garantem operações em O(log n) no pior caso.

Red-Black Trees são árvores binárias de busca que usam um "bit" adicional por nó para indicar a cor (vermelho ou preto), garantindo que a árvore permaneça aproximadamente balanceada.

## 🎯 Propriedades das Red-Black Trees

Uma árvore Red-Black válida deve satisfazer as seguintes propriedades:

1. **Todo nó é vermelho ou preto**
2. **A raiz é sempre preta**
3. **Todo nó folha NULL é preto**
4. **Se um nó é vermelho, seus filhos devem ser pretos** (não pode haver dois nós vermelhos em sequência)
5. **Todo caminho da raiz até qualquer folha NULL deve conter o mesmo número de nós pretos** (altura preta)

Visualização de uma Red-Black Tree:

```
      7(B)
     /   \
   3(R)   18(R)
  /  \    /  \
2(B) 5(B) 11(B) 19(B)
         /  \
       9(R) 14(R)
```

## 💻 Implementação Básica

### Classe do Nó

```javascript
class RBNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.color = 'RED'; // Novo nó sempre começa vermelho
        this.parent = null;
    }
}
```

### Classe da Árvore Red-Black

```javascript
class RedBlackTree {
    constructor() {
        this.NIL = new RBNode(null); // Nó sentinela para folhas NULL
        this.NIL.color = 'BLACK';
        this.NIL.left = null;
        this.NIL.right = null;
        this.root = this.NIL;
    }
    
    // Rotação à esquerda
    leftRotate(x) {
        const y = x.right;
        x.right = y.left;
        
        if (y.left !== this.NIL) {
            y.left.parent = x;
        }
        
        y.parent = x.parent;
        
        if (x.parent === null) {
            this.root = y;
        } else if (x === x.parent.left) {
            x.parent.left = y;
        } else {
            x.parent.right = y;
        }
        
        y.left = x;
        x.parent = y;
    }
    
    // Rotação à direita
    rightRotate(y) {
        const x = y.left;
        y.left = x.right;
        
        if (x.right !== this.NIL) {
            x.right.parent = y;
        }
        
        x.parent = y.parent;
        
        if (y.parent === null) {
            this.root = x;
        } else if (y === y.parent.left) {
            y.parent.left = x;
        } else {
            y.parent.right = x;
        }
        
        x.right = y;
        y.parent = x;
    }
}
```

## 🚀 Operações Fundamentais

### 1. Inserção

O processo de inserção tem duas fases:
1. Inserção padrão de BST (como nó vermelho)
2. Recoloração e/ou rotações para restaurar as propriedades Red-Black

```javascript
insert(value) {
    const node = new RBNode(value);
    node.left = this.NIL;
    node.right = this.NIL;
    
    let y = null;
    let x = this.root;
    
    // Encontra o lugar para inserir
    while (x !== this.NIL) {
        y = x;
        if (node.value < x.value) {
            x = x.left;
        } else {
            x = x.right;
        }
    }
    
    node.parent = y;
    
    if (y === null) {
        this.root = node; // Árvore estava vazia
    } else if (node.value < y.value) {
        y.left = node;
    } else {
        y.right = node;
    }
    
    // Se a árvore estava vazia, o novo nó será a raiz e deve ser preto
    if (node.parent === null) {
        node.color = 'BLACK';
        return;
    }
    
    // Se o pai do novo nó é raiz, não precisamos fazer nada
    if (node.parent.parent === null) {
        return;
    }
    
    // Corrige as violações Red-Black
    this._fixInsert(node);
}

// Corrige violações após inserção
_fixInsert(k) {
    while (k.parent && k.parent.color === 'RED') {
        if (k.parent === k.parent.parent.right) {
            // Casos simétricos quando o pai é o filho direito do avô
            // Código omitido para brevidade
        } else {
            // Pai é filho esquerdo do avô
            const u = k.parent.parent.right; // Tio
            
            // Caso 1: Tio é vermelho - apenas recoloração
            if (u.color === 'RED') {
                k.parent.color = 'BLACK';
                u.color = 'BLACK';
                k.parent.parent.color = 'RED';
                k = k.parent.parent;
            } else {
                // Caso 2: Tio é preto e k é filho direito - rotação à esquerda
                if (k === k.parent.right) {
                    k = k.parent;
                    this.leftRotate(k);
                }
                
                // Caso 3: Tio é preto e k é filho esquerdo - rotação à direita
                k.parent.color = 'BLACK';
                k.parent.parent.color = 'RED';
                this.rightRotate(k.parent.parent);
            }
        }
        
        // Se chegamos à raiz
        if (k === this.root) {
            break;
        }
    }
    
    // A raiz sempre é preta
    this.root.color = 'BLACK';
}
```

### Visualização de um Caso de Inserção

Inserindo o valor 15 na árvore abaixo:

```
Antes da Inserção:
      10(B)
     /    \
   5(R)   20(R)
  / \     /  \
 3(B) 7(B) 15(B) 30(B)

Inserindo 15 (inicialmente vermelho):
      10(B)
     /    \
   5(R)   20(R)
  / \     /  \
 3(B) 7(B) 17(R) 30(B)
         /
       15(R)  <-- Violação: dois vermelhos em sequência

Após _fixInsert (rotação direita em 17, recoloração):
      10(B)
     /    \
   5(R)   20(R)
  / \     /  \
 3(B) 7(B) 15(B) 30(B)
           \
           17(R)
```

## 🔄 Remoção

A remoção em Red-Black Trees é mais complexa que a inserção e segue um processo similar:
1. Remoção padrão de BST
2. Correção das propriedades violadas

```javascript
// Substituir um nó por outro na árvore
_transplant(u, v) {
    if (u.parent === null) {
        this.root = v;
    } else if (u === u.parent.left) {
        u.parent.left = v;
    } else {
        u.parent.right = v;
    }
    v.parent = u.parent;
}

// Remoção de um nó
remove(value) {
    let z = this.root;
    // Encontra o nó a ser removido
    while (z !== this.NIL) {
        if (z.value === value) {
            break;
        } else if (value < z.value) {
            z = z.left;
        } else {
            z = z.right;
        }
    }
    
    if (z === this.NIL) {
        return; // Valor não encontrado
    }
    
    let y = z;
    let y_original_color = y.color;
    let x;
    
    if (z.left === this.NIL) {
        x = z.right;
        this._transplant(z, z.right);
    } else if (z.right === this.NIL) {
        x = z.left;
        this._transplant(z, z.left);
    } else {
        // Nó com dois filhos - encontra o sucessor in-order
        y = this._minimum(z.right);
        y_original_color = y.color;
        x = y.right;
        
        if (y.parent === z) {
            x.parent = y;
        } else {
            this._transplant(y, y.right);
            y.right = z.right;
            y.right.parent = y;
        }
        
        this._transplant(z, y);
        y.left = z.left;
        y.left.parent = y;
        y.color = z.color;
    }
    
    // Se a cor original era preta, precisamos corrigir violações
    if (y_original_color === 'BLACK') {
        this._fixRemove(x);
    }
}

// Encontra o nó com valor mínimo
_minimum(node) {
    while (node.left !== this.NIL) {
        node = node.left;
    }
    return node;
}

// Corrige violações após remoção
_fixRemove(x) {
    // Algoritmo para corrigir violações após remoção
    // (Código omitido para brevidade devido à complexidade)
}
```

## 📊 Análise de Complexidade

| Operação | Complexidade |
|----------|------------|
| Busca    | O(log n)   |
| Inserção | O(log n)   |
| Remoção  | O(log n)   |
| Espaço   | O(n)       |

Embora a altura de uma Red-Black Tree possa ser até 2 × log(n) nós (em contraste com os 1.44 × log(n) das árvores AVL), esta ainda garante operações em O(log n).

## 🔄 Comparativo: AVL vs Red-Black Trees

| Característica       | AVL Tree                 | Red-Black Tree                |
|----------------------|--------------------------|-------------------------------|
| Balanceamento        | Estrito (diferença ≤ 1)  | Relaxado (até 2× o caminho mínimo) |
| Altura máxima        | 1.44 × log(n)            | 2 × log(n)                    |
| Rotações por inserção| Até 2                    | No máximo 2                   |
| Rotações por remoção | Até log(n)               | No máximo 3                   |
| Espaço extra         | 1 int por nó (altura)    | 1 bit por nó (cor)            |
| Melhor para          | Muitas buscas            | Muitas inserções/remoções     |
| Implementação        | Mais simples             | Mais complexa                 |
| Uso em bibliotecas   | Menos comum              | Muito comum (C++ STL, Java, etc.) |

## 💡 Aplicações Reais

Red-Black Trees são amplamente utilizadas em:

1. **Bibliotecas de Linguagens de Programação**:
   - Java: TreeMap e TreeSet
   - C++: map, set, multimap, multiset

2. **Banco de Dados**:
   - MySQL utiliza Red-Black Trees em índices

3. **Sistemas de Arquivos Linux**:
   - Diretórios e arquivos

4. **Kernel Linux**:
   - Para gerenciamento de processos

## 🧩 Comparação Estrutural

```
BST Desbalanceada:           AVL Tree:           Red-Black Tree:

       10                       20                     20(B)
        \                      /  \                   /   \
        20                   10    30               10(B)  30(R)
         \                  / \    / \             / \    / \
         30                5   15 25  40         5(R) 15(R) 25(B) 40(B)
          \
          40
```

## 🔑 Quando Usar Red-Black Trees?

Red-Black Trees são ideais quando:

1. Você precisa de garantias de pior caso para operações (ao contrário das BSTs regulares)
2. As operações de **modificação (inserção/remoção) são frequentes**
3. Você pode tolerar um balanceamento um pouco menos estrito que AVL em troca de menos rotações
4. Precisa suportar uma estrutura de dados de mapa/conjunto ordenado

## 📊 Comparativo Entre Árvores Balanceadas

Após estudarmos as principais estruturas de árvores balanceadas (AVL e Red-Black), podemos compará-las lado a lado para entender quando cada uma é mais adequada.

### Resumo Comparativo

| Característica | BST | AVL | Red-Black | B-Tree |
|----------------|-----|-----|-----------|--------|
| **Definição** | Árvore binária com ordenação | BST com diferença de altura ≤ 1 | BST com coloração e 5 propriedades | Árvore m-ária balanceada |
| **Altura** | O(n) no pior caso | 1.44 × log₂(n) | 2 × log₂(n) | log₂(n) |
| **Busca** | O(h) = O(n) no pior | O(log n) | O(log n) | O(log n) |
| **Inserção** | O(h) | O(log n) + rotações | O(log n) + máx. 2 rotações | O(log n) + divisão de nós |
| **Remoção** | O(h) | O(log n) + rotações | O(log n) + máx. 3 rotações | O(log n) + fusão de nós |
| **Balanceamento** | Nenhum | Estrito | Relaxado | Baseado em ocupação de nós |
| **Espaço extra** | Nenhum | 1 int (altura) | 1 bit (cor) | Referências a múltiplos filhos |
| **Complexidade** | Simples | Moderada | Alta | Alta |
| **Uso principal** | Implementação simples | Buscas frequentes | Muitas inserções/remoções | Armazenamento em disco |

### Visualização Comparativa

```
1. BST Não-Balanceada (Pior Caso):
   1
    \
     2
      \
       3
        \
         4
          \
           5

2. AVL (Estritamente Balanceada):
       3
     /   \
    1     4
     \     \
      2     5

3. Red-Black (Balanceamento Relaxado):
       3(B)
     /     \
   1(B)    4(B)
     \       \
    2(R)     5(R)

4. B-Tree (Ordem 3):
    [2, 4]
   /  |   \
 [1] [3] [5]
```

## 🔄 Casos de Uso

### Quando Usar BST Regular

- **Conjuntos de dados pequenos** onde o balanceamento é menos crítico
- **Implementações educacionais** para entender os conceitos base de árvores
- **Inserções aleatórias** que naturalmente mantêm a árvore aproximadamente balanceada
- **Priorização de simplicidade** sobre performance garantida

### Quando Usar AVL Tree

- **Buscas frequentes** e operações de leitura predominantes
- **Dados estáticos** ou com poucas mudanças
- **Casos onde altura mínima é crucial** para performance
- **Aplicações em tempo real** com necessidade de tempo garantido de busca

### Quando Usar Red-Black Tree

- **Muitas inserções e remoções** em dados dinâmicos
- **Implementações de conjuntos e mapas** em bibliotecas de linguagens
- **Casos onde o equilíbrio entre balanceamento e eficiência é importante**
- **Sistemas operacionais** e outras aplicações de baixo nível

### Quando Usar B-Trees (e variantes como B+ Trees)

- **Armazenamento em disco** e bancos de dados
- **Sistemas de arquivos**
- **Índices em bancos de dados** (B+ Trees)
- **Conjuntos de dados muito grandes** que não cabem em memória

## 💡 Aplicações no Mundo Real

### AVL Trees

1. **Bancos de Dados**:
   - Índices em alguns SGBDs para buscas eficientes

2. **Sistemas Embarcados**:
   - Aplicações com requisitos de tempo real e previsibilidade

3. **Algoritmos de Roteamento**:
   - Tabelas de rotas em redes

### Red-Black Trees

1. **Linguagens de Programação**:
   - Java: `TreeMap` e `TreeSet`
   - C++: `std::map`, `std::set`
   - .NET: `SortedDictionary`

2. **Sistemas Operacionais**:
   - Linux: Scheduler do kernel (completamente justo)
   - Gerenciamento de memória virtual

3. **Gráficos por Computador**:
   - Estruturas de particionamento espacial

### B-Trees e B+ Trees

1. **Sistemas de Gerenciamento de Banco de Dados**:
   - MySQL (InnoDB), PostgreSQL, Oracle, SQLite
   - MongoDB para índices

2. **Sistemas de Arquivos**:
   - NTFS (Windows)
   - HFS+ (macOS)
   - Ext4 (Linux)

3. **Armazenamento em Nuvem**:
   - Sistemas de armazenamento distribuído

## 🧪 Implementações Específicas

### Exemplo: Implementação de um Cache com Red-Black Tree

```javascript
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.map = new Map(); // Para acesso O(1)
        this.tree = new RedBlackTree(); // Para ordenar por acesso
        this.currentTime = 0;
    }
    
    get(key) {
        if (!this.map.has(key)) {
            return -1;
        }
        
        const entry = this.map.get(key);
        // Atualiza o timestamp e reposiciona no Red-Black Tree
        this.tree.remove(entry.treeNode);
        entry.lastAccessed = ++this.currentTime;
        entry.treeNode = this.tree.insert({
            time: entry.lastAccessed,
            key: key
        });
        
        return entry.value;
    }
    
    put(key, value) {
        if (this.capacity <= 0) return;
        
        // Se a chave já existe, atualiza
        if (this.map.has(key)) {
            const entry = this.map.get(key);
            entry.value = value;
            // Atualiza posição no tree (como no get)
            this.tree.remove(entry.treeNode);
            entry.lastAccessed = ++this.currentTime;
            entry.treeNode = this.tree.insert({
                time: entry.lastAccessed,
                key: key
            });
            return;
        }
        
        // Se atingiu capacidade, remove o menos recente
        if (this.map.size >= this.capacity) {
            const oldest = this.tree.getMinimum(); // O(log n)
            this.map.delete(oldest.key);
            this.tree.remove(oldest);
        }
        
        // Insere novo item
        const lastAccessed = ++this.currentTime;
        const treeNode = this.tree.insert({
            time: lastAccessed,
            key: key
        });
        
        this.map.set(key, {
            value: value,
            lastAccessed: lastAccessed,
            treeNode: treeNode
        });
    }
}
```

### Exemplo: Implementação de um Índice em Banco de Dados com B+ Tree

```javascript
class BPlusTreeIndex {
    constructor(order) {
        this.root = new LeafNode();
        this.order = order;
    }
    
    // Insere um registro com sua chave
    insert(key, recordPointer) {
        const [newNode, newKey] = this.root.insert(key, recordPointer, this.order);
        
        if (newNode !== null) {
            // A raiz foi dividida, cria nova raiz
            const newRoot = new InternalNode();
            newRoot.keys.push(newKey);
            newRoot.children.push(this.root);
            newRoot.children.push(newNode);
            this.root = newRoot;
        }
    }
    
    // Busca registros por chave
    search(key) {
        return this.root.search(key);
    }
    
    // Busca registros em um intervalo de chaves
    rangeSearch(startKey, endKey) {
        const results = [];
        
        // Encontra folha com startKey
        let leaf = this.root.findLeaf(startKey);
        
        // Percorre as folhas, coletando registros no intervalo
        while (leaf !== null) {
            for (let i = 0; i < leaf.keys.length; i++) {
                if (leaf.keys[i] >= startKey && leaf.keys[i] <= endKey) {
                    results.push(leaf.values[i]);
                }
                
                if (leaf.keys[i] > endKey) {
                    return results;
                }
            }
            
            leaf = leaf.next; // As folhas são encadeadas para acesso sequencial
        }
        
        return results;
    }
}
```

## 🔗 Conexão com Estruturas Vistas Anteriormente

1. **Relação com Listas Encadeadas**: 
   - Uma BST desbalanceada pode degenerar para uma lista encadeada
   - B+ Trees conectam as folhas como uma lista para facilitar percurso sequencial

2. **Relação com Pilhas**: 
   - A travessia de árvores usa implicitamente uma pilha (recursão)

3. **Relação com Filas**: 
   - A travessia por níveis (level-order) usa uma fila

## 📚 Próximos Passos: Estruturas Avançadas

Após dominar as árvores balanceadas, você estará preparado para explorar estruturas mais avançadas:

1. **Árvores de Segmentos** (Segment Trees)
2. **Árvores de Fenwick** (Binary Indexed Trees)
3. **Tries** para busca de strings
4. **Quad Trees** e **Octrees** para divisão espacial
5. **Grafos**, que abordaremos nos próximos tópicos

No próximo módulo, avançaremos para os grafos, estruturas ainda mais gerais que permitem modelar relações complexas entre elementos. 