# Exercícios Práticos de Análise de Complexidade

## Classificação por Nível:
- 🟢 Básico: Conceitos fundamentais e aplicações diretas
- 🟡 Intermediário: Combinação de conceitos e análise mais detalhada
- 🔴 Avançado: Problemas complexos que exigem análise profunda e criatividade

## 🟢 Exercício 1: Comparação de Algoritmos de Busca

**Contexto:** Você está desenvolvendo um sistema de busca para uma loja online. Dependendo do tipo de busca (produtos, categorias, usuários), você precisa escolher o algoritmo mais adequado.

**Problema:** Analise cada algoritmo abaixo e identifique sua complexidade de tempo e espaço:

```javascript
// Algoritmo A: Busca em uma lista não ordenada
function searchAlgorithmA(array, target) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === target) return i;
    }
    return -1;
}

// Algoritmo B: Busca em uma lista ordenada
function searchAlgorithmB(array, target) {
    let left = 0;
    let right = array.length - 1;
    
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        if (array[mid] === target) return mid;
        if (array[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

// Algoritmo C: Busca com tabela hash
function searchAlgorithmC(hashMap, target) {
    if (hashMap.has(target)) {
        return hashMap.get(target);
    }
    return -1;
}
```

**Questões:**
1. Qual a complexidade de tempo (melhor, pior e caso médio) para cada algoritmo?
2. Qual a complexidade de espaço para cada algoritmo?
3. Para cada cenário abaixo, qual algoritmo você escolheria e por quê?
   - Busca em uma pequena lista de produtos (10-20 itens) que raramente muda
   - Busca em um grande catálogo de produtos (100.000+ itens) ordenados por ID
   - Busca frequente em uma lista de usuários ativos (que muda constantemente)

**Dicas estratégicas:**
- Nem sempre o algoritmo teoricamente mais rápido é a melhor escolha
- Considere o overhead de manter estruturas de dados ordenadas
- Considere a frequência de operações de busca versus inserção/remoção

## 🟡 Exercício 2: Análise de Complexidade em Problemas Reais

**Contexto:** Você está otimizando um sistema de análise de dados de uma rede social.

**Problema:** Analise a complexidade de tempo e espaço dos seguintes algoritmos:

```javascript
// Algoritmo D: Encontrar conexões comuns entre dois usuários
function findCommonConnections(user1Connections, user2Connections) {
    const common = [];
    
    for (const connection of user1Connections) {
        if (user2Connections.includes(connection)) {
            common.push(connection);
        }
    }
    
    return common;
}

// Algoritmo E: Versão otimizada do algoritmo D
function findCommonConnectionsOptimized(user1Connections, user2Connections) {
    const user2Set = new Set(user2Connections);
    const common = [];
    
    for (const connection of user1Connections) {
        if (user2Set.has(connection)) {
            common.push(connection);
        }
    }
    
    return common;
}

// Algoritmo F: Encontrar o caminho mais curto na rede social
function findShortestPath(graph, startUser, targetUser) {
    const queue = [[startUser]];
    const visited = new Set([startUser]);
    
    while (queue.length > 0) {
        const path = queue.shift();
        const currentUser = path[path.length - 1];
        
        if (currentUser === targetUser) {
            return path;
        }
        
        for (const friend of graph[currentUser]) {
            if (!visited.has(friend)) {
                visited.add(friend);
                queue.push([...path, friend]);
            }
        }
    }
    
    return null; // Nenhum caminho encontrado
}
```

**Questões:**
1. Qual a complexidade de tempo e espaço do Algoritmo D?
2. Como e por que o Algoritmo E melhora o Algoritmo D? Qual a nova complexidade?
3. Qual a complexidade de tempo e espaço do Algoritmo F? Como ela se relaciona com o tamanho da rede social?
4. Se a rede social tiver 1 milhão de usuários, mas cada usuário tiver em média apenas 150 conexões, como isso afeta a análise?

**Dicas estratégicas:**
- Em grafos esparsos (com poucas conexões), a análise baseada apenas no número de nós pode ser enganosa
- A escolha da estrutura de dados correta pode transformar um algoritmo inviável em um eficiente
- Busque sempre identificar operações que podem estar "escondidas" em funções como `includes()` ou `indexOf()`

## 🟡 Exercício 3: Identificando Padrões de Complexidade

**Contexto:** Você está revisando código legado e precisa identificar potenciais gargalos.

**Problema:** Para cada trecho de código abaixo, identifique o padrão de complexidade e explique:

```javascript
// Trecho G
function processData(data) {
    let result = 0;
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data.length; j++) {
            if (i !== j && data[i] === data[j]) {
                result++;
            }
        }
    }
    return result / 2; // Dividir por 2 porque cada par é contado duas vezes
}

// Trecho H
function processTree(node, depth = 0) {
    if (!node) return 0;
    
    let result = depth;
    for (const child of node.children || []) {
        result += processTree(child, depth + 1);
    }
    return result;
}

// Trecho I
function processSorted(arr) {
    const n = arr.length;
    let result = 0;
    
    for (let i = 0; i < n; i++) {
        let left = i + 1;
        let right = n - 1;
        
        while (left < right) {
            const sum = arr[i] + arr[left] + arr[right];
            
            if (sum === 0) {
                result++;
                left++;
                right--;
            } else if (sum < 0) {
                left++;
            } else {
                right--;
            }
        }
    }
    
    return result;
}
```

**Questões:**
1. Qual a complexidade de tempo do Trecho G? Existe uma forma mais eficiente de resolver o mesmo problema?
2. Qual a complexidade do Trecho H em termos do número de nós na árvore e sua profundidade máxima?
3. O Trecho I tem uma condição especial para funcionar corretamente. Qual é ela e como isso afeta sua complexidade?
4. Em qual desses trechos a otimização traria o maior ganho de desempenho para entradas grandes?

**Dicas estratégicas:**
- Algoritmos quadráticos (O(n²)) são frequentemente os primeiros candidatos para otimização
- Muitas vezes, pré-processamento e estruturas de dados adequadas podem reduzir drasticamente a complexidade
- Algoritmos que funcionam em dados ordenados geralmente têm complexidade menor que a versão para dados não ordenados
- A travessia de árvores tem características de complexidade únicas que dependem da estrutura da árvore

## 🔴 Exercício 4: Escolhendo Algoritmos para Requisitos Específicos

**Contexto:** Você está desenvolvendo um aplicativo de roteirização para entregas urbanas.

**Problema:** Para cada requisito abaixo, escolha o algoritmo mais adequado entre as opções dadas:

1. **Requisito A**: Encontrar o trajeto mais curto entre dois pontos em um mapa.
   - Opção 1: Busca em Largura (BFS)
   - Opção 2: Algoritmo de Dijkstra
   - Opção 3: Algoritmo A*

2. **Requisito B**: Otimizar a ordem de entregas para minimizar a distância total percorrida (problema do caixeiro viajante).
   - Opção 1: Força bruta (testar todas as permutações)
   - Opção 2: Algoritmo guloso (sempre ir para o ponto mais próximo)
   - Opção 3: Algoritmo genético ou programação dinâmica aproximada

3. **Requisito C**: Identificar agrupamentos naturais de endereços de entrega para dividir entre entregadores.
   - Opção 1: K-means clustering
   - Opção 2: Classificação hierárquica
   - Opção 3: DBSCAN (Density-Based Spatial Clustering)

**Questões:**
1. Para cada requisito, qual opção você escolheria e por quê?
2. Qual a complexidade de tempo e espaço da sua escolha para cada requisito?
3. Como o tamanho da cidade (número de ruas e intersecções) afeta suas escolhas?
4. Se houvesse restrições de tempo (ex: resposta em tempo real para milhares de entregas), como suas escolhas mudariam?
