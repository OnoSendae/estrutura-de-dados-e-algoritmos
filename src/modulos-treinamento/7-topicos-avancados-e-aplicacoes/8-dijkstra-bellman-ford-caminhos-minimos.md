# Algoritmos de Caminho Mínimo: Dijkstra e Bellman-Ford

## Introdução

Olá, estudante! Hoje vamos explorar dois algoritmos fundamentais para encontrar caminhos mínimos em grafos: **Dijkstra** e **Bellman-Ford**. Estes algoritmos são essenciais em diversas aplicações práticas, desde sistemas de navegação GPS até roteamento de pacotes na internet.

## O Problema do Caminho Mínimo

Antes de mergulharmos nos algoritmos, vamos entender o problema:

> Dado um grafo ponderado G(V, E), onde V é o conjunto de vértices e E o conjunto de arestas, e dois vértices específicos s (origem) e t (destino), queremos encontrar o caminho de s para t com a menor soma possível dos pesos das arestas.

Visualmente, podemos representar um grafo ponderado assim:

```
    6       1
(A)----(B)----(C)
 |      /\      |
 |     /  \     |
3|    /2   \8   |2
 |   /      \   |
 v  v        v  v
(D)----(E)----(F)
    1       4
```

## Algoritmo de Dijkstra

### Conceito Fundamental

O algoritmo de Dijkstra é uma estratégia gulosa (greedy) para encontrar o caminho mais curto entre um vértice de origem e todos os outros vértices em um grafo ponderado com pesos não-negativos.

### Analogia 

Imagine que você está explorando um labirinto com várias salas interconectadas. Cada porta entre salas tem um "custo" para atravessar (tempo, energia, etc.). Você quer encontrar o caminho menos custoso da entrada até a saída:

1. Você marca a distância da entrada como 0 e todas as outras salas como "infinito"
2. Começando pela entrada, você examina todas as portas que saem dela
3. Para cada sala conectada, calcula: (distância até sala atual + custo da porta)
4. Se este valor for menor que a distância conhecida até aquela sala, você atualiza a distância
5. Depois, escolhe a sala não visitada com menor distância conhecida e repete o processo
6. Continua até visitar todas as salas ou encontrar a saída

### O Algoritmo em Detalhes

1. Inicialize as distâncias de todos os vértices como infinito, exceto o vértice de origem que recebe distância 0
2. Crie um conjunto de vértices não visitados
3. Enquanto houver vértices não visitados:
   - Selecione o vértice u com a menor distância
   - Marque u como visitado
   - Para cada vizinho v de u:
     - Calcule a distância tentativa = distância[u] + peso(u,v)
     - Se a distância tentativa for menor que a distância[v], atualize distância[v]
4. Retorne as distâncias calculadas

### Complexidade
- Tempo: O(V²) com matriz de adjacência, ou O((V+E)log V) com fila de prioridade
- Espaço: O(V)

### Implementação em TypeScript

```typescript
// Implementação do algoritmo de Dijkstra com fila de prioridades
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

interface Graph {
  adjacencyList: Edge[][];
}

function createGraph(vertices: number): Graph {
  const adjacencyList: Edge[][] = Array.from({ length: vertices }, () => []);
  return { adjacencyList };
}

function addEdge(graph: Graph, from: number, to: number, weight: number): void {
  graph.adjacencyList[from].push({ to, weight });
}

function dijkstra(graph: Graph, start: number): { distances: number[], previous: number[] } {
  const vertices = graph.adjacencyList.length;
  const distances: number[] = Array(vertices).fill(Infinity);
  const previous: number[] = Array(vertices).fill(-1);
  const visited: boolean[] = Array(vertices).fill(false);
  const queue = new PriorityQueue<number>();
  
  distances[start] = 0;
  queue.enqueue(start, 0);
  
  while (!queue.isEmpty()) {
    const current = queue.dequeue()!;
    
    if (visited[current]) continue;
    visited[current] = true;
    
    for (const edge of graph.adjacencyList[current]) {
      if (visited[edge.to]) continue;
      
      const distance = distances[current] + edge.weight;
      
      if (distance < distances[edge.to]) {
        distances[edge.to] = distance;
        previous[edge.to] = current;
        queue.enqueue(edge.to, distance);
      }
    }
  }
  
  return { distances, previous };
}

// Função para reconstruir o caminho
function getPath(previous: number[], end: number): number[] {
  const path: number[] = [];
  let current = end;
  
  while (current !== -1) {
    path.unshift(current);
    current = previous[current];
  }
  
  return path;
}

// Exemplo de uso
const graph = createGraph(6); // Vértices 0-5 (A-F)

// Adicionar arestas conforme o exemplo visual
addEdge(graph, 0, 1, 6); // A -> B
addEdge(graph, 0, 3, 3); // A -> D
addEdge(graph, 1, 2, 1); // B -> C
addEdge(graph, 1, 3, 2); // B -> D
addEdge(graph, 1, 5, 8); // B -> F
addEdge(graph, 2, 5, 2); // C -> F
addEdge(graph, 3, 4, 1); // D -> E
addEdge(graph, 4, 5, 4); // E -> F

const start = 0; // A
const { distances, previous } = dijkstra(graph, start);

console.log("Distâncias do vértice inicial:");
distances.forEach((distance, i) => {
  console.log(`Até ${String.fromCharCode(65 + i)}: ${distance}`);
});

// Caminho até F (vértice 5)
const endVertex = 5;
const path = getPath(previous, endVertex);
console.log(`Caminho até ${String.fromCharCode(65 + endVertex)}: ${path.map(v => String.fromCharCode(65 + v)).join(" -> ")}`);
```

### Limitações do Dijkstra
- Não funciona com arestas de peso negativo
- Pode ser ineficiente para grafos muito grandes

## Algoritmo de Bellman-Ford

### Conceito Fundamental

Enquanto Dijkstra é uma estratégia gulosa que não suporta pesos negativos, Bellman-Ford utiliza programação dinâmica e pode lidar com arestas de peso negativo, além de detectar ciclos negativos.

### Analogia

Imagine um sistema de câmbio monetário entre diferentes moedas. Cada taxa de câmbio é como uma aresta no grafo:

- Vértices são moedas diferentes (USD, EUR, GBP, etc.)
- Arestas são taxas de câmbio entre moedas
- Pesos das arestas são os logaritmos das taxas de câmbio

Se você encontrar um ciclo onde pode começar com certa quantidade de uma moeda, fazer uma série de trocas e terminar com mais da mesma moeda, isso é um "ciclo negativo" - uma oportunidade de arbitragem! Bellman-Ford pode detectar tais situações.

### O Algoritmo em Detalhes

1. Inicialize as distâncias de todos os vértices como infinito, exceto o vértice de origem que recebe distância 0
2. Execute V-1 iterações (onde V é o número de vértices)
3. Em cada iteração, percorra todas as arestas (u,v) com peso w:
   - Se distância[u] + w < distância[v], atualize distância[v] = distância[u] + w
4. Verificação de ciclo negativo (opcional): 
   - Faça mais uma iteração pelas arestas
   - Se alguma distância puder ser reduzida ainda mais, existe um ciclo negativo

### Complexidade
- Tempo: O(V × E)
- Espaço: O(V)

### Implementação em TypeScript

```typescript
interface Edge {
  from: number;
  to: number;
  weight: number;
}

function bellmanFord(vertices: number, edges: Edge[], start: number): { distances: number[], previous: number[], hasNegativeCycle: boolean } {
  const distances: number[] = Array(vertices).fill(Infinity);
  const previous: number[] = Array(vertices).fill(-1);
  
  distances[start] = 0;
  
  // Relaxamento das arestas (V-1) vezes
  for (let i = 0; i < vertices - 1; i++) {
    for (const { from, to, weight } of edges) {
      if (distances[from] === Infinity) continue;
      
      if (distances[from] + weight < distances[to]) {
        distances[to] = distances[from] + weight;
        previous[to] = from;
      }
    }
  }
  
  // Verificação de ciclo negativo
  let hasNegativeCycle = false;
  for (const { from, to, weight } of edges) {
    if (distances[from] === Infinity) continue;
    
    if (distances[from] + weight < distances[to]) {
      hasNegativeCycle = true;
      break;
    }
  }
  
  return { distances, previous, hasNegativeCycle };
}

// Exemplo de uso
const vertices = 5;
const edges: Edge[] = [
  { from: 0, to: 1, weight: -1 },
  { from: 0, to: 2, weight: 4 },
  { from: 1, to: 2, weight: 3 },
  { from: 1, to: 3, weight: 2 },
  { from: 1, to: 4, weight: 2 },
  { from: 3, to: 2, weight: 5 },
  { from: 3, to: 1, weight: 1 },
  { from: 4, to: 3, weight: -3 }
];

const start = 0;
const { distances, previous, hasNegativeCycle } = bellmanFord(vertices, edges, start);

if (hasNegativeCycle) {
  console.log("O grafo contém um ciclo negativo!");
} else {
  console.log("Distâncias do vértice inicial:");
  distances.forEach((distance, i) => {
    console.log(`Até ${i}: ${distance}`);
  });
  
  // Reconstruir caminho para o vértice 2
  const end = 2;
  const path: number[] = [];
  let current = end;
  
  while (current !== -1) {
    path.unshift(current);
    current = previous[current];
  }
  
  console.log(`Caminho até ${end}: ${path.join(" -> ")}`);
}
```

### Comparação Visual entre Dijkstra e Bellman-Ford

```
Processamento ao longo do tempo:

Dijkstra (com fila de prioridade):
[A] --> [B,D] --> [D,C,F] --> [C,F,E] --> [F,E] --> [E] --> []
  ↑       ↑         ↑           ↑          ↑       ↑
Visitado  Visitado  Visitado   Visitado   Visitado Visitado

Bellman-Ford:
Iteração 1: Examina todas as arestas -> Algumas distâncias atualizadas
Iteração 2: Examina todas as arestas -> Mais distâncias atualizadas
...
Iteração V-1: Examina todas as arestas -> Solução final
Verificação: Examina todas as arestas novamente -> Detecta ciclos negativos
```

## Comparação entre Dijkstra e Bellman-Ford

| Característica           | Dijkstra                    | Bellman-Ford               |
|--------------------------|-----------------------------|-----------------------------|
| Estratégia               | Gulosa                      | Programação Dinâmica        |
| Complexidade de tempo    | O(V²) ou O((V+E)log V)      | O(V × E)                    |
| Arestas de peso negativo | Não suporta                 | Suporta                     |
| Detecção de ciclo negativo| Não consegue                | Consegue                    |
| Melhor uso               | Grafos esparsos e densos sem pesos negativos | Grafos com pesos negativos |

## Aplicações Práticas

### Dijkstra
- Sistemas de navegação GPS
- Roteamento de redes (Protocolo OSPF)
- Planejamento de rotas em jogos
- Robótica e planejamento de movimento

### Bellman-Ford
- Roteamento de redes (Protocolo RIP)
- Detecção de arbitragem em mercados financeiros
- Sistemas com restrições complexas que podem envolver "custos negativos"

## Exercícios

1. Implemente uma variação do algoritmo de Dijkstra que encontre o caminho mais curto entre todos os pares de vértices (hint: execute o algoritmo para cada vértice).

2. Modifique o algoritmo de Bellman-Ford para não apenas detectar um ciclo negativo, mas também retornar o ciclo específico.

3. Implemente uma função que determine se é melhor usar Dijkstra ou Bellman-Ford para um grafo específico, com base nas características do grafo.

4. Resolva o problema do "caminho mais confiável": em um grafo onde os pesos das arestas representam a probabilidade de sucesso (entre 0 e 1), encontre o caminho com a maior probabilidade de sucesso total (dica: trabalhe com logaritmos).

## Conclusão

Os algoritmos de caminho mínimo são fundamentais em diversos domínios da computação. Dijkstra é eficiente para casos sem pesos negativos, enquanto Bellman-Ford oferece maior flexibilidade ao custo de desempenho. A escolha entre eles depende das características específicas do problema a ser resolvido.

Na próxima aula, exploraremos os algoritmos de Árvore Geradora Mínima, que têm uma relação próxima com os algoritmos que acabamos de estudar.

## Leituras Complementares

- "Introduction to Algorithms" por Cormen, Leiserson, Rivest e Stein (CLRS)
- "Graph Algorithms" por Shimon Even
- "Algorithm Design Manual" por Steven Skiena 