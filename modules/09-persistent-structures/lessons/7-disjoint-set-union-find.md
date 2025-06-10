# Disjoint Set (Union-Find)

## Introdução

Olá, estudante! Hoje vamos explorar uma estrutura de dados extremamente útil e elegante: o **Disjoint Set**, também conhecido como **Union-Find**. Esta estrutura é fundamental para resolver problemas que envolvem particionamento de elementos em conjuntos disjuntos e verificação eficiente de conectividade.

Você já foi apresentado brevemente a esta estrutura quando estudamos o algoritmo de Kruskal para Árvores Geradoras Mínimas, mas agora vamos aprofundar nosso entendimento e explorar todas as suas nuances.

## Conceito Fundamental

O Disjoint Set é uma estrutura de dados que mantém uma coleção de conjuntos disjuntos de elementos. "Disjuntos" significa que nenhum elemento pode pertencer a mais de um conjunto simultaneamente.

A estrutura suporta três operações principais:
1. **MakeSet(x)**: Cria um novo conjunto contendo apenas o elemento x
2. **Find(x)**: Determina a qual conjunto o elemento x pertence (geralmente retornando um representante do conjunto)
3. **Union(x, y)**: Une os conjuntos que contêm os elementos x e y

## Analogia

Imagine uma escola com vários alunos e clubes. Cada aluno pode pertencer a apenas um clube. Inicialmente, cada aluno forma seu próprio "clube individual". Com o tempo:

1. Dois clubes podem se fundir (Union)
2. Um aluno pode perguntar "a qual clube pertenço?" (Find)
3. Um novo aluno pode criar seu próprio clube (MakeSet)

Quando dois clubes se fundem, um dos presidentes de clube se torna o presidente do clube combinado (o "representante").

## Representação Visual

```
Conjuntos iniciais (cada elemento em seu próprio conjunto):

[1]  [2]  [3]  [4]  [5]  [6]  [7]  [8]

Após algumas operações Union (representadas como árvores):

  [1]     [2]       [6]
  / \     / \       / \
[3] [4]  [5] [8]   [7] 
```

## Implementações

Existem várias formas de implementar um Disjoint Set, e vamos explorar as mais comuns, desde a mais básica até a mais otimizada.

### 1. Implementação com Lista Encadeada

Esta é a implementação mais simples, mas não a mais eficiente.

```typescript
class ListNode {
  value: number;
  next: ListNode | null;
  
  constructor(value: number) {
    this.value = value;
    this.next = null;
  }
}

class DisjointSetList {
  representatives: Map<number, ListNode>;
  
  constructor(elements: number[]) {
    this.representatives = new Map();
    
    // MakeSet para cada elemento
    for (const element of elements) {
      const node = new ListNode(element);
      this.representatives.set(element, node);
    }
  }
  
  // Encontra o representante do conjunto que contém x
  find(x: number): number {
    const node = this.representatives.get(x);
    if (!node) throw new Error(`Element ${x} not found`);
    return node.value;
  }
  
  // Une os conjuntos que contêm x e y
  union(x: number, y: number): void {
    const repX = this.find(x);
    const repY = this.find(y);
    
    if (repX === repY) return; // Já estão no mesmo conjunto
    
    // Encontrar o último nó da lista de repX
    let nodeX = this.representatives.get(repX)!;
    while (nodeX.next) {
      nodeX = nodeX.next;
    }
    
    // Anexar a lista de repY ao final da lista de repX
    nodeX.next = this.representatives.get(repY)!;
    
    // Atualizar o representante para todos os elementos da lista de repY
    let nodeY = this.representatives.get(repY)!;
    while (nodeY) {
      this.representatives.set(nodeY.value, this.representatives.get(repX)!);
      nodeY = nodeY.next;
    }
  }
}
```

Esta implementação é simples de entender, mas sofre de problemas de desempenho. A operação `union` pode ter complexidade de tempo O(n).

### 2. Implementação baseada em Floresta (Árvores)

Esta é a implementação mais comum e eficiente, usando um array para representar uma floresta de árvores. Cada conjunto é representado como uma árvore, e cada elemento aponta para seu pai na árvore.

```typescript
class DisjointSetForest {
  parent: number[];
  
  constructor(size: number) {
    this.parent = Array.from({ length: size }, (_, i) => i); // Cada elemento é seu próprio pai inicialmente
  }
  
  // Encontra o representante (raiz) do conjunto que contém x
  find(x: number): number {
    if (this.parent[x] !== x) {
      return this.find(this.parent[x]); // Recursivamente encontra a raiz
    }
    return x;
  }
  
  // Une os conjuntos que contêm x e y
  union(x: number, y: number): void {
    const rootX = this.find(x);
    const rootY = this.find(y);
    
    if (rootX === rootY) return; // Já estão no mesmo conjunto
    
    // Faz rootY apontar para rootX
    this.parent[rootY] = rootX;
  }
}
```

Esta implementação é muito melhor, mas ainda pode ser otimizada.

### 3. Otimizações: Union by Rank e Path Compression

Para melhorar ainda mais o desempenho, podemos aplicar duas otimizações importantes:

1. **Union by Rank**: Anexamos a árvore mais curta à árvore mais alta, em vez de sempre anexar a segunda árvore à primeira.
2. **Path Compression**: Durante o `find`, fazemos todos os nós ao longo do caminho apontarem diretamente para a raiz.

```typescript
class DisjointSetOptimized {
  parent: number[];
  rank: number[];

  constructor(size: number) {
    this.parent = Array.from({ length: size }, (_, i) => i); // Cada elemento é seu próprio pai inicialmente
    this.rank = Array(size).fill(0); // Altura inicial de cada árvore é 0
  }

  // Encontra o representante (raiz) do conjunto que contém x com compressão de caminho
  find(x: number): number {
    if (this.parent[x] !== x) {
      // Compressão de caminho: faz todos os nós ao longo do caminho apontarem diretamente para a raiz
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  // Une os conjuntos que contêm x e y usando union by rank
  union(x: number, y: number): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);

    // Se já estão no mesmo conjunto, não fazemos nada
    if (rootX === rootY) return false;

    // Union by rank: anexamos a árvore mais curta à árvore mais alta
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      // Se as árvores têm a mesma altura, escolhemos arbitrariamente e incrementamos a altura
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }

    return true; // União foi realizada com sucesso
  }
}
```

## Complexidade

Com as otimizações de "union by rank" e "path compression":

- **MakeSet**: O(1)
- **Find**: O(α(n)) (alfa de Ackermann, que é quase constante para todos os propósitos práticos)
- **Union**: O(α(n))

Onde α(n) é a função inversa de Ackermann, que cresce extremamente devagar. Para fins práticos, podemos considerar α(n) ≈ 4 para valores de n muito grandes (como 2^65536).

Este é um dos poucos casos em teoria dos algoritmos onde temos uma estrutura de dados com complexidade "quase constante", mas não exatamente constante.

## Visualização da Compressão de Caminho

Considere a seguinte árvore:

```
     1
    /
   2
  /
 3
/ \
4  5
```

Quando fazemos `find(4)`, a árvore se transforma em:

```
    1
   /|\
  2 4 5
 /
3
```

E se depois fizermos `find(3)`, a árvore se torna:

```
   1
 /|\|\
2 3 4 5
```

Essa compressão de caminho torna as operações subsequentes muito mais rápidas.

## Aplicações Práticas

O Disjoint Set é essencial em diversos algoritmos e aplicações:

### 1. Árvore Geradora Mínima (Algoritmo de Kruskal)

Como vimos na aula anterior, o Disjoint Set é fundamental para o algoritmo de Kruskal:

```typescript
function kruskal(vertices: number, edges: Edge[]): Edge[] {
  // Ordenar arestas por peso
  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
  
  const uf = new DisjointSetOptimized(vertices);
  const mst: Edge[] = [];
  
  for (const edge of sortedEdges) {
    // Se a adição da aresta não formar ciclo, adicionamos à MST
    if (uf.union(edge.from, edge.to)) {
      mst.push(edge);
    }
    
    // Se já temos V-1 arestas, terminamos
    if (mst.length === vertices - 1) break;
  }
  
  return mst;
}
```

### 2. Detecção de Ciclos em Grafos não-direcionados

```typescript
function hasCycle(vertices: number, edges: Edge[]): boolean {
  const uf = new DisjointSetOptimized(vertices);
  
  for (const { from, to } of edges) {
    // Se os vértices já estão no mesmo conjunto, encontramos um ciclo
    if (uf.find(from) === uf.find(to)) {
      return true;
    }
    
    uf.union(from, to);
  }
  
  return false;
}
```

### 3. Componentes Conexos em Grafos não-direcionados

```typescript
function connectedComponents(vertices: number, edges: Edge[]): number {
  const uf = new DisjointSetOptimized(vertices);
  
  // Unir vértices conectados por arestas
  for (const { from, to } of edges) {
    uf.union(from, to);
  }
  
  // Contar representantes únicos
  const representatives = new Set();
  for (let i = 0; i < vertices; i++) {
    representatives.add(uf.find(i));
  }
  
  return representatives.size;
}
```

### 4. Grid Percolation

Um problema clássico em simulações físicas e modelagem: determinar se existe um caminho contínuo de células abertas de um lado ao outro de uma grade.

```typescript
class Percolation {
  private grid: boolean[][];
  private uf: DisjointSetOptimized;
  private size: number;
  private topVirtual: number;
  private bottomVirtual: number;
  
  constructor(n: number) {
    this.size = n;
    this.grid = Array.from({ length: n }, () => Array(n).fill(false));
    
    // +2 para os vértices virtuais superior e inferior
    this.uf = new DisjointSetOptimized(n * n + 2);
    
    this.topVirtual = n * n;
    this.bottomVirtual = n * n + 1;
  }
  
  private xyTo1D(row: number, col: number): number {
    return row * this.size + col;
  }
  
  open(row: number, col: number): void {
    if (this.isOpen(row, col)) return;
    
    this.grid[row][col] = true;
    const index = this.xyTo1D(row, col);
    
    // Conectar à primeira linha ao vértice virtual superior
    if (row === 0) {
      this.uf.union(index, this.topVirtual);
    }
    
    // Conectar à última linha ao vértice virtual inferior
    if (row === this.size - 1) {
      this.uf.union(index, this.bottomVirtual);
    }
    
    // Conectar aos vizinhos abertos
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // cima, baixo, esquerda, direita
    
    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;
      
      if (newRow >= 0 && newRow < this.size && newCol >= 0 && newCol < this.size && this.isOpen(newRow, newCol)) {
        this.uf.union(index, this.xyTo1D(newRow, newCol));
      }
    }
  }
  
  isOpen(row: number, col: number): boolean {
    return this.grid[row][col];
  }
  
  percolates(): boolean {
    return this.uf.find(this.topVirtual) === this.uf.find(this.bottomVirtual);
  }
}
```

### 5. Equações de Equivalência

Determinar se um conjunto de equações como a=b, b=c, e d=e implica em outras relações (como a=e).

```typescript
function areEqual(equations: string[], a: string, b: string): boolean {
  const variables = new Set<string>();
  
  // Coletar todas as variáveis
  for (const eq of equations) {
    const [left, right] = eq.split('=');
    variables.add(left);
    variables.add(right);
  }
  
  // Mapear variáveis para índices
  const varToIndex = new Map<string, number>();
  let index = 0;
  for (const variable of variables) {
    varToIndex.set(variable, index++);
  }
  
  const uf = new DisjointSetOptimized(variables.size);
  
  // Processar equações
  for (const eq of equations) {
    const [left, right] = eq.split('=');
    uf.union(varToIndex.get(left)!, varToIndex.get(right)!);
  }
  
  // Verificar se a e b estão no mesmo conjunto
  return uf.find(varToIndex.get(a)!) === uf.find(varToIndex.get(b)!);
}
```

## Variações e Extensões

### 1. Union-Find com Dados Associados

Podemos estender a estrutura para armazenar dados associados a cada conjunto:

```typescript
class DisjointSetWithData<T> {
  parent: number[];
  rank: number[];
  data: T[];

  constructor(size: number, initialData: T[]) {
    this.parent = Array.from({ length: size }, (_, i) => i);
    this.rank = Array(size).fill(0);
    this.data = [...initialData];
  }

  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x: number, y: number, mergeData: (data1: T, data2: T) => T): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return false;

    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
      this.data[rootY] = mergeData(this.data[rootY], this.data[rootX]);
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
      this.data[rootX] = mergeData(this.data[rootX], this.data[rootY]);
    } else {
      this.parent[rootY] = rootX;
      this.data[rootX] = mergeData(this.data[rootX], this.data[rootY]);
      this.rank[rootX]++;
    }

    return true;
  }

  getData(x: number): T {
    return this.data[this.find(x)];
  }
}
```

### 2. Union-Find com Rollback (Desfazer Operações)

Uma versão mais avançada que permite desfazer operações:

```typescript
class DisjointSetWithRollback {
  parent: number[];
  rank: number[];
  history: { type: 'union' | 'find', x: number, y: number, oldParent?: number, oldRank?: number }[];

  constructor(size: number) {
    this.parent = Array.from({ length: size }, (_, i) => i);
    this.rank = Array(size).fill(0);
    this.history = [];
  }

  find(x: number): number {
    if (this.parent[x] !== x) {
      const oldParent = this.parent[x];
      this.history.push({ type: 'find', x, y: oldParent });
      this.parent[x] = this.find(oldParent);
    }
    return this.parent[x];
  }

  union(x: number, y: number): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return false;

    if (this.rank[rootX] < this.rank[rootY]) {
      this.history.push({ type: 'union', x: rootX, y: rootY, oldParent: this.parent[rootX], oldRank: this.rank[rootX] });
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.history.push({ type: 'union', x: rootY, y: rootX, oldParent: this.parent[rootY], oldRank: this.rank[rootY] });
      this.parent[rootY] = rootX;
    } else {
      this.history.push({ type: 'union', x: rootY, y: rootX, oldParent: this.parent[rootY], oldRank: this.rank[rootY] });
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }

    return true;
  }

  rollback(): void {
    if (this.history.length === 0) return;
    
    const lastOperation = this.history.pop()!;
    
    if (lastOperation.type === 'union') {
      const { x, oldParent, oldRank } = lastOperation;
      this.parent[x] = oldParent!;
      if (oldRank !== undefined) {
        this.rank[this.parent[x]] = oldRank;
      }
    } else if (lastOperation.type === 'find') {
      const { x, y } = lastOperation;
      this.parent[x] = y;
    }
  }
}
```

## Exercícios

1. Implemente uma versão online de um algoritmo para contar o número de componentes conexos em um grafo, onde as arestas são adicionadas uma por uma.

2. Modifique o Disjoint Set para rastrear o tamanho de cada conjunto e implementar uma função `getSize(x)` que retorna o número de elementos no conjunto que contém x.

3. Implemente o problema clássico dos "Amigos e Inimigos": dadas relações de amizade e inimizade entre pessoas, determine se é possível dividir todas as pessoas em dois grupos de modo que amigos estejam no mesmo grupo e inimigos em grupos diferentes.

4. Utilize o Disjoint Set para resolver o problema de coloração de um mapa, onde regiões adjacentes não podem ter a mesma cor.

5. Implemente um algoritmo eficiente para detectar se uma série de consultas "isConnected(x, y)" retornariam verdadeiro ou falso, dada uma sequência de operações "connect(x, y)" entre as consultas.

## Conclusão

O Disjoint Set (Union-Find) é uma estrutura de dados excepcionalmente eficiente e versátil. Suas aplicações vão desde algoritmos em grafos até simulações físicas e processamento de consultas de conectividade.

A combinação das otimizações "union by rank" e "path compression" resulta em operações quase constantes, tornando esta estrutura ideal para problemas que envolvem particionamento dinâmico de conjuntos e detecção de conectividade.

Na próxima aula, exploraremos outra estrutura de dados avançada: Suffix Trees e Suffix Arrays, ferramentas poderosas para processamento e busca em strings.

## Leituras Complementares

- "Introduction to Algorithms" por Cormen, Leiserson, Rivest e Stein (CLRS)
- "Data Structures and Algorithms" por Mark Allen Weiss
- "Algorithms, 4th Edition" por Robert Sedgewick e Kevin Wayne 