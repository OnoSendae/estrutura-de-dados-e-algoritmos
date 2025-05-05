# Algoritmos e Estrutura de Dados na Prática

## Módulo 6: Algoritmos Gulosos e Programação Dinâmica

### 2. Problemas Clássicos de Algoritmos Gulosos

Nesta aula, vamos explorar dois problemas clássicos que podem ser resolvidos eficientemente usando algoritmos gulosos.

#### Problema da Mochila Fracionária

Imagine que você é um ladrão com uma mochila de capacidade limitada. Você encontrou vários itens valiosos, cada um com peso e valor específicos. Diferente do problema da mochila tradicional (0/1), aqui você pode levar frações dos itens.

##### Estratégia Gulosa:
1. Calcular a "densidade de valor" (valor/peso) para cada item
2. Ordenar os itens por densidade de valor (do maior para o menor)
3. Adicionar os itens à mochila, começando pelo de maior densidade
4. Se não puder adicionar um item inteiro, adicione a maior fração possível

```
Visualização do processo:

Itens disponíveis:
+--------+---------+--------+----------+
| Item   | Peso    | Valor  | V/P      |
+--------+---------+--------+----------+
| Ouro   |   10    |  500   |   50.0   |
| Prata  |    8    |  320   |   40.0   |
| Diam.  |    3    |  270   |   90.0   | ← Maior densidade!
| Jade   |    5    |  100   |   20.0   |
| Bronze |    2    |   40   |   20.0   |
+--------+---------+--------+----------+

Escolha gulosa (por densidade V/P):
1. Diamante (completo): +270 valor, 3kg usado, 12kg restante
2. Ouro (completo): +500 valor, 10kg usado, 2kg restante
3. Prata (25% = 2kg): +80 valor, 2kg usado, 0kg restante

Resultado: 850 valor total
```

```javascript
function fractionalKnapsack(capacity, items) {
    // Calcula densidade de valor (valor/peso)
    const itemsWithDensity = items.map(item => ({
        ...item,
        density: item.value / item.weight
    }));
    
    // Ordena por densidade (decisão gulosa)
    itemsWithDensity.sort((a, b) => b.density - a.density);
    
    let totalValue = 0;
    let remainingCapacity = capacity;
    const takenItems = [];
    
    console.log("\n=== Mochila Fracionária - Algoritmo Guloso ===");
    console.log("Item\t\tPeso\tValor\tDensidade");
    console.log("----------------------------------------");
    
    for (let item of itemsWithDensity) {
        console.log(`${item.name.padEnd(12)}\t${item.weight}\t${item.value}\t${item.density.toFixed(2)}`);
        
        if (remainingCapacity >= item.weight) {
            // Pega o item inteiro
            totalValue += item.value;
            remainingCapacity -= item.weight;
            takenItems.push({item: item.name, fraction: 1});
            console.log(`  ↳ Pega tudo`);
        } else if (remainingCapacity > 0) {
            // Pega fração do item
            const fraction = remainingCapacity / item.weight;
            totalValue += item.value * fraction;
            takenItems.push({item: item.name, fraction: fraction});
            console.log(`  ↳ Pega ${(fraction * 100).toFixed(1)}%`);
            remainingCapacity = 0;
            break;
        }
    }
    
    console.log(`\nValor total: ${totalValue.toFixed(2)}`);
    return { totalValue, takenItems };
}

// Exemplo
const items = [
    { name: "Ouro", weight: 10, value: 500 },
    { name: "Prata", weight: 8, value: 320 },
    { name: "Diamante", weight: 3, value: 270 },
    { name: "Jade", weight: 5, value: 100 },
    { name: "Bronze", weight: 2, value: 40 }
];

fractionalKnapsack(15, items);
```

**Por que funciona?** A escolha gulosa (pegar itens com maior densidade de valor primeiro) garante a solução ótima porque podemos pegar frações dos itens. Assim, sempre maximizamos o valor por unidade de peso.

#### Árvore Geradora Mínima (MST)

Uma árvore geradora mínima é uma subárvore de um grafo conectado que inclui todos os vértices com o menor peso total possível.

##### Algoritmo de Kruskal

O algoritmo de Kruskal constrói a MST adicionando arestas em ordem crescente de peso, evitando ciclos.

```
Visualização do algoritmo de Kruskal:

Grafo Original:
    0
   /|\
  / | \
 1--2--4
 |/   /|
 3----5

Arestas ordenadas por peso:
(1,2): 1  (3,5): 2  (0,1): 4  (1,3): 2  (2,3): 4  (2,4): 5  (3,4): 7  (0,2): 3  (4,5): 2

Processo:
1. (1,2): 1  - Incluída ✓
   [1]---[2]

2. (3,5): 2  - Incluída ✓
   [1]---[2]
    
   [3]---[5]

3. (1,3): 2  - Incluída ✓
   [1]---[2]
    |
   [3]---[5]

4. (4,5): 2  - Incluída ✓
   [1]---[2]
    |
   [3]---[5]
          |
         [4]

5. (0,2): 3  - Incluída ✓
   [1]---[2]---[0]
    |
   [3]---[5]
          |
         [4]

Resultado: MST com peso total = 10
```

```javascript
class DisjointSet {
    constructor(size) {
        this.parent = Array(size).fill().map((_, i) => i);
        this.rank = Array(size).fill(0);
    }
    
    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]); // Compressão de caminho
        }
        return this.parent[x];
    }
    
    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        
        if (rootX === rootY) return false;
        
        if (this.rank[rootX] < this.rank[rootY]) {
            this.parent[rootX] = rootY;
        } else if (this.rank[rootX] > this.rank[rootY]) {
            this.parent[rootY] = rootX;
        } else {
            this.parent[rootY] = rootX;
            this.rank[rootX]++;
        }
        
        return true;
    }
}

function kruskalMST(vertices, edges) {
    // Ordena arestas por peso (estratégia gulosa)
    edges.sort((a, b) => a.weight - b.weight);
    
    const disjointSet = new DisjointSet(vertices);
    const mst = [];
    let totalWeight = 0;
    
    console.log("\n=== Algoritmo de Kruskal - MST ===");
    console.log("Aresta\t\tPeso\tIncluída?");
    console.log("----------------------------------------");
    
    for (let edge of edges) {
        console.log(`${edge.from}-${edge.to}\t\t${edge.weight}`);
        
        if (disjointSet.union(edge.from, edge.to)) {
            mst.push(edge);
            totalWeight += edge.weight;
            console.log(`  ↳ Incluída na MST`);
        } else {
            console.log(`  ↳ Rejeitada (formaria ciclo)`);
        }
        
        // Se MST está completa
        if (mst.length === vertices - 1) break;
    }
    
    console.log(`\nPeso total da MST: ${totalWeight}`);
    return { mst, totalWeight };
}

// Exemplo de uso
const vertices = 6; // Vértices rotulados de 0 a 5
const edges = [
    { from: 0, to: 1, weight: 4 },
    { from: 0, to: 2, weight: 3 },
    { from: 1, to: 2, weight: 1 },
    { from: 1, to: 3, weight: 2 },
    { from: 2, to: 3, weight: 4 },
    { from: 2, to: 4, weight: 5 },
    { from: 3, to: 4, weight: 7 },
    { from: 3, to: 5, weight: 6 },
    { from: 4, to: 5, weight: 2 }
];

kruskalMST(vertices, edges);
```

##### Algoritmo de Prim

O algoritmo de Prim constrói a MST começando de um vértice qualquer e adicionando arestas de menor peso que conectam a árvore atual com vértices não incluídos.

```
Visualização do algoritmo de Prim:

Grafo Original (mesmo do exemplo anterior)
Começamos do vértice 0:

Iteração 1:
[0*]   [3]
 |      |
[1]    [5]
 |      |
[2]----[4]

Arestas candidatas: (0,1):4, (0,2):3
Escolha gulosa: (0,2):3 ✓

Iteração 2:
[0*]   [3]
 |      |
[1]    [5]
 |      |
[2*]---[4]

Arestas candidatas: (0,1):4, (2,1):1, (2,3):4, (2,4):5
Escolha gulosa: (2,1):1 ✓

Iteração 3:
[0*]   [3]
 |      |
[1*]   [5]
 |      |
[2*]---[4]

Arestas candidatas: (1,3):2, (2,3):4, (2,4):5
Escolha gulosa: (1,3):2 ✓

Iteração 4:
[0*]   [3*]
 |      |
[1*]   [5]
 |      |
[2*]---[4]

Arestas candidatas: (3,5):2, (2,4):5, (3,4):7
Escolha gulosa: (3,5):2 ✓

Iteração 5:
[0*]   [3*]
 |      |
[1*]   [5*]
 |      |
[2*]---[4]

Arestas candidatas: (2,4):5, (3,4):7, (5,4):2
Escolha gulosa: (5,4):2 ✓

MST Completa com peso total = 10
```

```javascript
function primMST(vertices, adjacencyList) {
    const visited = Array(vertices).fill(false);
    const key = Array(vertices).fill(Infinity);
    const parent = Array(vertices).fill(-1);
    
    // Começa do vértice 0
    key[0] = 0;
    
    console.log("\n=== Algoritmo de Prim - MST ===");
    console.log("Iteração | Vértice | Peso");
    console.log("------------------------");
    
    for (let count = 0; count < vertices; count++) {
        // Encontra o vértice não visitado com menor chave
        let u = -1;
        let minKey = Infinity;
        
        for (let v = 0; v < vertices; v++) {
            if (!visited[v] && key[v] < minKey) {
                minKey = key[v];
                u = v;
            }
        }
        
        if (u === -1) break; // Não conectado
        
        visited[u] = true;
        console.log(`   ${count}    |    ${u}    |  ${key[u]}`);
        
        // Atualiza chaves dos vértices adjacentes
        for (let edge of adjacencyList[u]) {
            const v = edge.to;
            const weight = edge.weight;
            
            if (!visited[v] && weight < key[v]) {
                parent[v] = u;
                key[v] = weight;
            }
        }
    }
    
    // Constrói a MST
    const mst = [];
    let totalWeight = 0;
    
    for (let i = 1; i < vertices; i++) {
        if (parent[i] !== -1) {
            mst.push({ from: parent[i], to: i, weight: key[i] });
            totalWeight += key[i];
        }
    }
    
    console.log(`\nPeso total da MST: ${totalWeight}`);
    return { mst, totalWeight };
}

// Converter arestas para lista de adjacência
function edgesToAdjacencyList(vertices, edges) {
    const adjList = Array(vertices).fill().map(() => []);
    
    for (let edge of edges) {
        adjList[edge.from].push({ to: edge.to, weight: edge.weight });
        adjList[edge.to].push({ to: edge.from, weight: edge.weight }); // Grafo não direcionado
    }
    
    return adjList;
}

// Exemplo de uso
const adjList = edgesToAdjacencyList(vertices, edges);
primMST(vertices, adjList);
```

### Comparação entre Kruskal e Prim

| Algoritmo | Estratégia | Complexidade | Melhor para |
|-----------|------------|--------------|-------------|
| Kruskal | Ordena todas as arestas, adiciona na ordem se não formar ciclo | O(E log E) | Grafos esparsos |
| Prim | Cresce a partir de um único vértice, sempre adicionando a aresta de menor peso | O(E log V) | Grafos densos |

### Conexão com Estruturas de Dados Anteriores

Os algoritmos gulosos para MST utilizam estruturas importantes que vimos anteriormente:

1. **Kruskal e Union-Find (Disjoint Set)**: 
   - Utilizamos a estrutura de conjuntos disjuntos vista no módulo de grafos
   - A operação de "encontrar" usa compressão de caminho para otimização
   - A união por rank otimiza a altura da árvore resultante

2. **Prim e Filas de Prioridade**:
   - Implementações eficientes de Prim usam filas de prioridade (min-heap)
   - Vimos essa estrutura no módulo de estruturas lineares
   - Permite extrair o próximo vértice com menor chave em O(log V)

3. **Representação de Grafos**:
   - Lista de adjacência: melhor para grafos esparsos, usada no Prim
   - Lista de arestas: usada no Kruskal para ordenação

### Exercício Prático: Coloração de Grafos

```javascript
// Implementar uma aproximação gulosa para coloração de grafos
function greedyColoring(graph) {
    const vertices = graph.length;
    const result = Array(vertices).fill(-1);
    
    // Atribui a primeira cor (0) ao primeiro vértice
    result[0] = 0;
    
    // Cores disponíveis
    const available = Array(vertices).fill(true);
    
    // Para cada vértice
    for (let u = 1; u < vertices; u++) {
        // Processa os adjacentes ao vértice atual
        for (let i = 0; i < vertices; i++) {
            if (graph[u][i] && result[i] !== -1) {
                available[result[i]] = false; // Cor não disponível
            }
        }
        
        // Encontra a primeira cor disponível
        let cr;
        for (cr = 0; cr < vertices; cr++) {
            if (available[cr]) break;
        }
        
        // Atribui a cor encontrada
        result[u] = cr;
        
        // Reseta o array de cores disponíveis
        for (let i = 0; i < vertices; i++) {
            available[i] = true;
        }
    }
    
    return result;
}
```

### Exercício

1. **Problema do Escalonamento de Intervalos**: Você tem uma lista de tarefas com tempo de início e término. Selecione o maior número possível de tarefas sem sobreposição.

2. **Problema de Codificação de Huffman**: Implemente o algoritmo de Huffman para compressão de dados.

3. **Desafio**: Implemente uma solução gulosa para o problema do caixeiro viajante (solução aproximada). 