# Algoritmos de Árvore Geradora Mínima: Prim e Kruskal

## Introdução

Olá, estudante! Hoje vamos explorar um tópico fascinante da teoria dos grafos: as Árvores Geradoras Mínimas (Minimum Spanning Trees - MST) e os principais algoritmos para encontrá-las: **Prim** e **Kruskal**.

Estes algoritmos são essenciais para resolver problemas de otimização de rede, como conectar várias localidades com o menor custo possível de cabos, tubulações ou estradas.

## O Problema da Árvore Geradora Mínima

Vamos entender o problema:

> Dado um grafo conexo, não-direcionado e com pesos nas arestas G(V, E), uma árvore geradora mínima é um subconjunto de arestas que forma uma árvore conectando todos os vértices, onde a soma total dos pesos das arestas é minimizada.

Visualmente, podemos representar um grafo e sua MST assim:

```
Grafo original:
       6
   A ----- B
   |      /|\
   |     / | \
 4 |    /  |  \ 2
   |   /5  |7  \
   |  /    |    \
   C ----- D --- E
      3     1     
      
Árvore Geradora Mínima:
       
   A       B
   |       |
   |       |
 4 |       | 2
   |       |
   |       |
   C ----- D --- E
      3     1     
      
Custo total = 4 + 3 + 1 + 2 = 10
```

Propriedades importantes de uma MST:
- Contém exatamente V-1 arestas (onde V é o número de vértices)
- Não possui ciclos
- Conecta todos os vértices do grafo
- Tem a menor soma possível de pesos das arestas

## Algoritmo de Prim

### Conceito Fundamental

O algoritmo de Prim é uma estratégia gulosa que constrói a MST começando de um vértice arbitrário e expandindo a árvore um vértice por vez, sempre adicionando a aresta de menor peso que conecta a árvore atual a um vértice ainda não incluído.

### Analogia

Imagine que você está construindo uma rede elétrica para conectar várias casas:

1. Você começa a partir de uma casa qualquer
2. A cada passo, procura a conexão mais barata entre uma casa já conectada à rede e uma casa ainda não conectada
3. Adiciona essa conexão à rede
4. Repete até que todas as casas estejam conectadas

No final, você terá uma rede que conecta todas as casas com o menor custo total possível.

### O Algoritmo em Detalhes

1. Inicialize um conjunto vazio A que conterá as arestas da MST
2. Escolha um vértice arbitrário s como ponto de partida
3. Inicialize um conjunto de vértices visitados contendo apenas s
4. Enquanto não visitou todos os vértices:
   - Encontre a aresta de menor peso (u,v) onde u está no conjunto de vértices visitados e v não está
   - Adicione v ao conjunto de vértices visitados
   - Adicione a aresta (u,v) ao conjunto A
5. Retorne o conjunto A, que contém as arestas da MST

### Complexidade
- Tempo: O(V²) com matriz de adjacência, ou O(E log V) com fila de prioridade
- Espaço: O(V + E)

### Implementação em TypeScript

```typescript
// Implementação do algoritmo de Prim com fila de prioridades
class PriorityQueue<T> {
  private items: { element: T; priority: number }[] = [];

  enqueue(element: T, priority: number): void {
    const item = { element, priority };
    let added = false;

    for (let i = 0; i < this.items.length; i++) {
      if (item.priority < this.items[i].priority) {
        this.items.splice(i, 0, item);
        added = true;
        break;
      }
    }

    if (!added) {
      this.items.push(item);
    }
  }

  dequeue(): T | null {
    if (this.isEmpty()) return null;
    return this.items.shift()!.element;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

interface Edge {
  to: number;
  weight: number;
}

interface WeightedEdge {
  from: number;
  to: number;
  weight: number;
}

interface Graph {
  adjacencyList: Edge[][];
}

function createGraph(vertices: number): Graph {
  const adjacencyList: Edge[][] = Array.from({ length: vertices }, () => []);
  return { adjacencyList };
}

function addEdge(graph: Graph, from: number, to: number, weight: number): void {
  // Para grafo não-direcionado, adicionamos arestas em ambas as direções
  graph.adjacencyList[from].push({ to, weight });
  graph.adjacencyList[to].push({ to: from, weight });
}

function prim(graph: Graph, start: number = 0): WeightedEdge[] {
  const vertices = graph.adjacencyList.length;
  const visited: boolean[] = Array(vertices).fill(false);
  const mst: WeightedEdge[] = [];
  const pq = new PriorityQueue<WeightedEdge>();
  
  // Começamos com o vértice inicial
  visited[start] = true;
  
  // Adicionamos todas as arestas do vértice inicial à fila de prioridade
  for (const edge of graph.adjacencyList[start]) {
    pq.enqueue({ from: start, to: edge.to, weight: edge.weight }, edge.weight);
  }
  
  // Enquanto a fila não estiver vazia e ainda não tivermos V-1 arestas
  while (!pq.isEmpty() && mst.length < vertices - 1) {
    const edge = pq.dequeue()!;
    
    // Se o vértice de destino já foi visitado, ignoramos esta aresta
    if (visited[edge.to]) continue;
    
    // Adicionamos a aresta à MST
    mst.push(edge);
    visited[edge.to] = true;
    
    // Adicionamos todas as arestas do novo vértice à fila de prioridade
    for (const nextEdge of graph.adjacencyList[edge.to]) {
      if (!visited[nextEdge.to]) {
        pq.enqueue(
          { from: edge.to, to: nextEdge.to, weight: nextEdge.weight },
          nextEdge.weight
        );
      }
    }
  }
  
  return mst;
}

// Exemplo de uso
const graph = createGraph(5); // Vértices 0-4 (A-E)

// Adicionar arestas conforme o exemplo visual
addEdge(graph, 0, 1, 6); // A-B
addEdge(graph, 0, 2, 4); // A-C
addEdge(graph, 1, 2, 5); // B-C
addEdge(graph, 1, 3, 7); // B-D
addEdge(graph, 1, 4, 2); // B-E
addEdge(graph, 2, 3, 3); // C-D
addEdge(graph, 3, 4, 1); // D-E

const mst = prim(graph);

console.log("Arestas da Árvore Geradora Mínima (algoritmo de Prim):");
let totalWeight = 0;
for (const edge of mst) {
  console.log(`${String.fromCharCode(65 + edge.from)} - ${String.fromCharCode(65 + edge.to)}: ${edge.weight}`);
  totalWeight += edge.weight;
}
console.log(`Peso total: ${totalWeight}`);
```

## Algoritmo de Kruskal

### Conceito Fundamental

O algoritmo de Kruskal também é uma estratégia gulosa, mas em vez de crescer a partir de um único vértice, ele considera todas as arestas do grafo ordenadas por peso e adiciona arestas à MST, desde que não formem ciclos.

### Analogia

Imagine que você está planejando conectar várias ilhas através de pontes:

1. Você lista todas as possíveis conexões de pontes entre as ilhas, ordenadas do menor para o maior custo
2. Começa a construir a ponte mais barata
3. Continua adicionando a próxima ponte mais barata, mas apenas se ela conectar ilhas que ainda não estão conectadas por outras pontes (direta ou indiretamente)
4. Para quando todas as ilhas estiverem conectadas

### O Algoritmo em Detalhes

1. Crie um conjunto disjunto (union-find) para cada vértice
2. Ordene todas as arestas em ordem não-decrescente de peso
3. Inicialize um conjunto vazio A que conterá as arestas da MST
4. Para cada aresta (u,v) na lista ordenada:
   - Se u e v estiverem em conjuntos disjuntos (ou seja, ainda não conectados na MST atual):
     - Adicione a aresta (u,v) ao conjunto A
     - Una os conjuntos contendo u e v
5. Retorne o conjunto A, que contém as arestas da MST

### Complexidade
- Tempo: O(E log E) para ordenação das arestas, que é equivalente a O(E log V)
- Espaço: O(V + E)

### Implementação em TypeScript

```typescript
// Implementação do algoritmo de Kruskal com Union-Find
class UnionFind {
  private parent: number[];
  private rank: number[];

  constructor(size: number) {
    this.parent = Array.from({ length: size }, (_, i) => i); // Cada elemento é seu próprio pai inicialmente
    this.rank = Array(size).fill(0); // Altura inicial de cada árvore é 0
  }

  // Encontra o representante (raiz) do conjunto que contém o elemento x
  find(x: number): number {
    if (this.parent[x] !== x) {
      // Compressão de caminho: faz todos os nós ao longo do caminho apontarem diretamente para a raiz
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  // Une os conjuntos que contêm os elementos x e y
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

interface Edge {
  from: number;
  to: number;
  weight: number;
}

function kruskal(vertices: number, edges: Edge[]): Edge[] {
  // Ordenar arestas por peso
  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
  
  const uf = new UnionFind(vertices);
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

// Exemplo de uso
const vertices = 5; // Vértices 0-4 (A-E)
const edges: Edge[] = [
  { from: 0, to: 1, weight: 6 }, // A-B
  { from: 0, to: 2, weight: 4 }, // A-C
  { from: 1, to: 2, weight: 5 }, // B-C
  { from: 1, to: 3, weight: 7 }, // B-D
  { from: 1, to: 4, weight: 2 }, // B-E
  { from: 2, to: 3, weight: 3 }, // C-D
  { from: 3, to: 4, weight: 1 }  // D-E
];

const mst = kruskal(vertices, edges);

console.log("Arestas da Árvore Geradora Mínima (algoritmo de Kruskal):");
let totalWeight = 0;
for (const edge of mst) {
  console.log(`${String.fromCharCode(65 + edge.from)} - ${String.fromCharCode(65 + edge.to)}: ${edge.weight}`);
  totalWeight += edge.weight;
}
console.log(`Peso total: ${totalWeight}`);
```

### Visualização do processo de Kruskal

```
Grafo original:
       6
   A ----- B
   |      /|\
   |     / | \
 4 |    /5 |7 \ 2
   |   /   |   \
   |  /    |    \
   C ----- D --- E
      3     1     

Arestas ordenadas por peso:
1. D-E (peso 1)
2. B-E (peso 2)
3. C-D (peso 3)
4. A-C (peso 4)
5. B-C (peso 5)
6. A-B (peso 6)
7. B-D (peso 7)

Passo a passo do algoritmo de Kruskal:

1. Adicionamos D-E à MST
   MST parcial: D---E (peso 1)

2. Adicionamos B-E à MST
   MST parcial: 
      B
      |
      |2
      |
   D---E (peso 1+2=3)

3. Adicionamos C-D à MST
   MST parcial:
      B
      |
      |2
      |
   C---D---E (peso 1+2+3=6)

4. Adicionamos A-C à MST
   MST parcial:
   A
   |
   |4
   |
   C---D---B
       |   |
       |3  |2
       |   |
       E   E (peso 1+2+3+4=10)

5. Arestas B-C, A-B e B-D formam ciclos, então não são adicionadas.

MST final:
   A
   |
   |4
   |
   C---D---E
       |   |
       |3  |1
           |
           B
           |
           |2

Peso total = 4 + 3 + 1 + 2 = 10
```

## Comparação entre Prim e Kruskal

| Característica           | Prim                        | Kruskal                     |
|--------------------------|-----------------------------|-----------------------------|
| Estratégia               | Cresce a partir de um vértice| Considera arestas globalmente|
| Melhor para              | Grafos densos               | Grafos esparsos             |
| Complexidade de tempo    | O(V²) ou O(E log V)         | O(E log E) ≈ O(E log V)     |
| Estrutura de dados       | Fila de prioridade          | Union-Find + ordenação      |
| Implementação            | Geralmente mais simples     | Requer Union-Find           |

## Propriedades Matemáticas das MSTs

1. **Propriedade de corte**: Para qualquer corte no grafo, a aresta de menor peso que cruza o corte pertence a alguma MST.

2. **Propriedade de ciclo**: Para qualquer ciclo no grafo, a aresta de maior peso nesse ciclo não pertence a nenhuma MST (a menos que todas as arestas tenham o mesmo peso).

3. **Unicidade**: Se todos os pesos das arestas forem diferentes, então existe uma única MST.

## Aplicações Práticas

### Aplicações Diretas
- Planejamento de redes de telecomunicações
- Projeto de redes elétricas
- Planejamento de rotas de transporte
- Redes de distribuição de água, gás ou petróleo
- Algoritmos de clustering (agrupamento)

### Exemplo: Rede de Água para uma Cidade

Imagine que você precisa projetar um sistema de abastecimento de água para uma cidade:
- Vértices representam bairros ou reservatórios
- Arestas representam possíveis tubulações
- Pesos das arestas representam custos de instalação

Uma MST encontrará a forma mais econômica de conectar todos os bairros ao sistema de abastecimento.

### Exemplo: Clustering

Podemos usar o algoritmo de Kruskal "invertido" para clustering:
1. Construa a MST completa
2. Remova as k-1 arestas de maior peso para formar k clusters

## Variações e Extensões

1. **Árvore Geradora de Custo Máximo**: Encontre a árvore geradora com a maior soma de pesos (útil em alguns problemas de otimização).

2. **Árvore Geradora de Grau Restrito**: Encontre uma MST onde nenhum vértice tem mais do que k conexões.

3. **Árvore Geradora de Diâmetro Mínimo**: Encontre uma árvore geradora onde o caminho mais longo entre quaisquer dois vértices é minimizado.

4. **Árvore de Steiner**: Variação onde nem todos os vértices precisam ser incluídos, apenas um subconjunto específico.

## Exercícios

1. Implemente uma função que verifica se um determinado conjunto de arestas forma uma MST válida.

2. Modifique o algoritmo de Prim para encontrar a árvore geradora de custo máximo.

3. Implemente um algoritmo de clustering usando o método de Kruskal invertido mencionado acima.

4. Escreva uma função que determine se um grafo tem uma MST única, e caso contrário, encontre todas as possíveis MSTs.

5. Considere um grafo onde os pesos das arestas representam probabilidades de falha (entre 0 e 1). Encontre a árvore geradora com a menor probabilidade de falha total.

## Conclusão

Os algoritmos de Prim e Kruskal são ferramentas poderosas para resolver problemas de otimização de rede. Ambos garantem a solução ótima, mas suas diferentes abordagens os tornam mais eficientes em diferentes cenários. A escolha entre eles depende das características específicas do grafo em questão.

Na próxima aula, exploraremos estruturas de dados especializadas, começando com Disjoint Set (Union-Find), que já vimos em ação no algoritmo de Kruskal.

## Leituras Complementares

- "Introduction to Algorithms" por Cormen, Leiserson, Rivest e Stein (CLRS)
- "Algorithm Design Manual" por Steven Skiena
- "Algorithms" por Robert Sedgewick e Kevin Wayne 