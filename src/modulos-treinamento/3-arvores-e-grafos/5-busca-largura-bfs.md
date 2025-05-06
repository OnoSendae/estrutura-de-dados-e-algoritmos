# Busca em Largura (BFS) em Grafos

## 🌊 Introdução à Busca em Largura

A Busca em Largura (BFS - Breadth-First Search) é um dos algoritmos fundamentais para explorar grafos. Como o nome sugere, o algoritmo explora o grafo "em largura", visitando todos os vizinhos de um vértice antes de avançar para os vizinhos dos vizinhos.

## 🧠 Intuição e Abordagem

Imagine que você está em um labirinto e quer explorar todas as passagens possíveis:

1. Você marca sua posição inicial como visitada
2. Você olha todas as passagens diretamente conectadas à sua posição e as coloca em uma lista
3. Uma a uma, você segue cada passagem na lista, marcando como visitada e adicionando novas passagens não visitadas à sua lista

Essa abordagem garante que você encontre o caminho mais curto (em número de passos) para qualquer ponto do labirinto.

## 🎯 Como o BFS Funciona

O BFS utiliza uma **fila** para controlar a ordem de exploração dos vértices. A propriedade fundamental da fila (FIFO - First In, First Out) garante que os vértices sejam processados em ordem crescente de distância da origem.

### Algoritmo Básico

1. Inicialize uma fila vazia e insira o vértice de origem
2. Marque o vértice de origem como visitado
3. Enquanto a fila não estiver vazia:
   a. Retire um vértice da fila (o "atual")
   b. Processe o vértice atual (e.g., imprima, conte, verifique uma condição)
   c. Obtenha todos os vizinhos não visitados do vértice atual
   d. Marque cada vizinho como visitado e adicione-o à fila

### Visualização Passo a Passo

Para o grafo:
```
    A --- B
   / \    |
  C   D -- E
   \     /
    \   /
     \ /
      F
```

BFS começando do vértice A:

```
Passo 1: Fila = [A], Visitados = {A}
Passo 2: Processar A, Fila = [B, C, D], Visitados = {A, B, C, D}
Passo 3: Processar B, Fila = [C, D, E], Visitados = {A, B, C, D, E}
Passo 4: Processar C, Fila = [D, E, F], Visitados = {A, B, C, D, E, F}
Passo 5: Processar D, Fila = [E, F], Visitados = {A, B, C, D, E, F}
Passo 6: Processar E, Fila = [F], Visitados = {A, B, C, D, E, F}
Passo 7: Processar F, Fila = [], Visitados = {A, B, C, D, E, F}
```

Ordem de visitação: A, B, C, D, E, F

Observe que visitamos todos os vértices à distância 1 de A (B, C, D) antes de qualquer vértice à distância 2 (E, F).

## 💻 Implementação em JavaScript

### BFS Básico

```javascript
function bfs(graph, startVertex) {
    // Estruturas de controle
    const visited = new Set();
    const queue = [startVertex];
    const result = [];
    
    // Marca o vértice inicial como visitado
    visited.add(startVertex);
    
    // Enquanto a fila não estiver vazia
    while (queue.length > 0) {
        // Remove o primeiro vértice da fila
        const currentVertex = queue.shift();
        
        // Processa o vértice atual
        result.push(currentVertex);
        
        // Obtém vizinhos do vértice atual
        const neighbors = graph.getNeighbors(currentVertex);
        
        // Para cada vizinho não visitado
        for (let neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }
    
    return result;
}
```

### BFS para Encontrar o Caminho Mais Curto

```javascript
function shortestPath(graph, startVertex, endVertex) {
    // Se origem e destino são iguais
    if (startVertex === endVertex) {
        return [startVertex];
    }
    
    // Estruturas de controle
    const visited = new Set();
    const queue = [[startVertex, [startVertex]]]; // [vértice, caminho até ele]
    
    visited.add(startVertex);
    
    while (queue.length > 0) {
        const [currentVertex, path] = queue.shift();
        const neighbors = graph.getNeighbors(currentVertex);
        
        for (let neighbor of neighbors) {
            // Se encontramos o destino
            if (neighbor === endVertex) {
                return [...path, neighbor]; // Retorna o caminho completo
            }
            
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push([neighbor, [...path, neighbor]]);
            }
        }
    }
    
    return null; // Não há caminho entre os vértices
}
```

### BFS para Computar Distâncias

```javascript
function distances(graph, startVertex) {
    const visited = new Set();
    const queue = [[startVertex, 0]]; // [vértice, distância]
    const distances = {};
    
    visited.add(startVertex);
    distances[startVertex] = 0;
    
    while (queue.length > 0) {
        const [currentVertex, distance] = queue.shift();
        const neighbors = graph.getNeighbors(currentVertex);
        
        for (let neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                distances[neighbor] = distance + 1;
                queue.push([neighbor, distance + 1]);
            }
        }
    }
    
    return distances;
}
```

### BFS para Verificar Bipartição

Um grafo é bipartido se seus vértices podem ser divididos em dois conjuntos, de forma que todas as arestas conectem vértices de conjuntos diferentes.

```javascript
function isBipartite(graph) {
    const vertices = [...graph.adjacencyList.keys()];
    if (vertices.length === 0) return true;
    
    // Colors: -1 = não visitado, 0 = conjunto A, 1 = conjunto B
    const colors = {};
    vertices.forEach(v => colors[v] = -1);
    
    for (let vertex of vertices) {
        // Se o vértice não foi visitado
        if (colors[vertex] === -1) {
            // Inicializa como conjunto A
            colors[vertex] = 0;
            
            const queue = [vertex];
            
            while (queue.length > 0) {
                const current = queue.shift();
                const neighbors = graph.getNeighbors(current);
                
                for (let neighbor of neighbors) {
                    // Se o vizinho não foi visitado
                    if (colors[neighbor] === -1) {
                        // Atribui a cor oposta
                        colors[neighbor] = 1 - colors[current];
                        queue.push(neighbor);
                    } 
                    // Se o vizinho já foi visitado e tem a mesma cor
                    else if (colors[neighbor] === colors[current]) {
                        return false; // Não é bipartido
                    }
                }
            }
        }
    }
    
    return true;
}
```

## 📊 Análise de Complexidade

| Operação | Complexidade Temporal | Complexidade Espacial |
|----------|----------------------|----------------------|
| BFS básico | O(V + E) | O(V) |
| Caminho mais curto | O(V + E) | O(V) |
| Computar distâncias | O(V + E) | O(V) |
| Verificar bipartição | O(V + E) | O(V) |

Onde V é o número de vértices e E é o número de arestas.

## 🛠️ Aplicações Práticas do BFS

### 1. Redes Sociais

**Problema**: Encontrar todos os usuários dentro de K graus de conexão.

```javascript
function findUsersWithinDegrees(graph, startUser, maxDegrees) {
    const visited = new Set();
    const queue = [[startUser, 0]]; // [usuário, distância]
    const result = [];
    
    visited.add(startUser);
    
    while (queue.length > 0) {
        const [user, degree] = queue.shift();
        
        if (degree <= maxDegrees) {
            result.push(user);
            
            if (degree < maxDegrees) {
                const friends = graph.getNeighbors(user);
                
                for (let friend of friends) {
                    if (!visited.has(friend)) {
                        visited.add(friend);
                        queue.push([friend, degree + 1]);
                    }
                }
            }
        }
    }
    
    return result;
}
```

### 2. Sistemas de Navegação

**Problema**: Encontrar todas as localizações acessíveis dentro de um limite de tempo/distância.

```javascript
function findLocationsWithinDistance(graph, startLocation, maxDistance) {
    const visited = new Set();
    const queue = [[startLocation, 0]]; // [localização, distância]
    const reachableLocations = [];
    
    visited.add(startLocation);
    
    while (queue.length > 0) {
        const [location, distance] = queue.shift();
        
        if (distance <= maxDistance) {
            reachableLocations.push(location);
            
            const neighbors = graph.getNeighbors(location);
            
            for (let [neighbor, weight] of neighbors) {
                const newDistance = distance + weight;
                
                if (!visited.has(neighbor) && newDistance <= maxDistance) {
                    visited.add(neighbor);
                    queue.push([neighbor, newDistance]);
                }
            }
        }
    }
    
    return reachableLocations;
}
```

### 3. Verificação de Conectividade

**Problema**: Verificar se dois componentes de um circuito estão conectados.

```javascript
function isConnected(graph, component1, component2) {
    const visited = new Set();
    const queue = [component1];
    
    visited.add(component1);
    
    while (queue.length > 0) {
        const current = queue.shift();
        
        if (current === component2) {
            return true;
        }
        
        const neighbors = graph.getNeighbors(current);
        
        for (let neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }
    
    return false;
}
```

### 4. Verificação de Bicoloração (Problema de Coloração)

**Problema**: Verificar se um grafo pode ser colorido usando apenas duas cores.

```javascript
function isTwoColorable(graph) {
    return isBipartite(graph); // Este é exatamente o problema de bipartição
}
```

## 🔄 BFS vs. DFS

| Aspecto | BFS | DFS |
|---------|-----|-----|
| Estratégia | Exploração em largura | Exploração em profundidade |
| Estrutura de dados | Fila | Pilha |
| Encontra caminho mais curto | Sim (em grafos não ponderados) | Não |
| Uso de memória | Maior (mantém a fronteira) | Menor (proporcional à profundidade) |
| Bom para | Encontrar distâncias, explorar nível a nível | Percorrer caminhos completos, detecção de ciclos |
| Implementação | Iterativa (geralmente) | Recursiva ou iterativa |

## 🧩 Variações e Otimizações

### 1. BFS Bidirecional

Executa duas BFS simultaneamente: uma da origem e outra do destino, melhorando a eficiência em grafos grandes.

```javascript
function bidirectionalBFS(graph, start, end) {
    if (start === end) return [start];
    
    const forwardVisited = new Map();
    const backwardVisited = new Map();
    
    const forwardQueue = [start];
    const backwardQueue = [end];
    
    forwardVisited.set(start, null); // valor = antecessor
    backwardVisited.set(end, null);
    
    let intersection = null;
    
    while (forwardQueue.length > 0 && backwardQueue.length > 0) {
        // Expande a fronteira para frente
        if (forwardQueue.length <= backwardQueue.length) {
            const current = forwardQueue.shift();
            const neighbors = graph.getNeighbors(current);
            
            for (let neighbor of neighbors) {
                if (!forwardVisited.has(neighbor)) {
                    forwardVisited.set(neighbor, current);
                    forwardQueue.push(neighbor);
                    
                    if (backwardVisited.has(neighbor)) {
                        intersection = neighbor;
                        break;
                    }
                }
            }
        } 
        // Expande a fronteira para trás
        else {
            const current = backwardQueue.shift();
            const neighbors = graph.getNeighbors(current);
            
            for (let neighbor of neighbors) {
                if (!backwardVisited.has(neighbor)) {
                    backwardVisited.set(neighbor, current);
                    backwardQueue.push(neighbor);
                    
                    if (forwardVisited.has(neighbor)) {
                        intersection = neighbor;
                        break;
                    }
                }
            }
        }
        
        if (intersection !== null) {
            // Reconstrói o caminho
            const path = [intersection];
            
            // Adiciona o caminho para frente
            let current = intersection;
            while (forwardVisited.get(current) !== null) {
                current = forwardVisited.get(current);
                path.unshift(current);
            }
            
            // Adiciona o caminho para trás
            current = intersection;
            while (backwardVisited.get(current) !== null) {
                current = backwardVisited.get(current);
                path.push(current);
            }
            
            return path;
        }
    }
    
    return null; // Não há caminho
}
```

### 2. BFS com Prioridade

Uma variação que combina BFS com uma fila de prioridade, útil para grafos ponderados.

```javascript
function priorityBFS(graph, start, end, priorityFunction) {
    const visited = new Set();
    const priorityQueue = new PriorityQueue();
    
    priorityQueue.enqueue([start, [start]], priorityFunction(start));
    visited.add(start);
    
    while (!priorityQueue.isEmpty()) {
        const [current, path] = priorityQueue.dequeue().value;
        
        if (current === end) {
            return path;
        }
        
        const neighbors = graph.getNeighbors(current);
        
        for (let neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                const newPath = [...path, neighbor];
                visited.add(neighbor);
                priorityQueue.enqueue([neighbor, newPath], priorityFunction(neighbor));
            }
        }
    }
    
    return null;
}
```

## 🧠 Ligação com Estruturas Anteriores

A implementação de BFS depende fortemente da estrutura de dados **fila**, que estudamos no módulo anterior sobre estruturas lineares. A fila é perfeita para BFS porque mantém a ordem de processamento dos vértices por níveis.

Na próxima aula, exploraremos a Busca em Profundidade (DFS), que usa a estratégia oposta à BFS e é implementada naturalmente com recursão ou com a estrutura de dados **pilha**. 