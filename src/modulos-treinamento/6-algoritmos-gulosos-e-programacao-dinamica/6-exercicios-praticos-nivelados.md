# Algoritmos e Estrutura de Dados na Prática

## Módulo 6: Algoritmos Gulosos e Programação Dinâmica

### 6. Exercícios Práticos Nivelados

Nesta aula, vamos praticar os conceitos aprendidos aplicando-os em problemas concretos. Os exercícios estão organizados por níveis de dificuldade, desde iniciante até avançado, para permitir uma progressão gradual no aprendizado.

#### Nível Iniciante

##### Exercício 1: Maior Subsequência Crescente (LIS)

Dada uma sequência de números, encontre o comprimento da maior subsequência crescente.

```javascript
console.log("\n=== Exercício 1 (Iniciante): Maior Subsequência Crescente ===");

function longestIncreasingSubsequence(nums) {
    if (nums.length === 0) return 0;
    
    const n = nums.length;
    // dp[i] = comprimento da LIS terminando em nums[i]
    const dp = Array(n).fill(1);
    
    // Para cada posição, verificamos todas as posições anteriores
    for (let i = 1; i < n; i++) {
        for (let j = 0; j < i; j++) {
            // Se o elemento atual for maior que o anterior, podemos estender a subsequência
            if (nums[i] > nums[j]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
    }
    
    // Encontrar o maior valor na tabela DP
    const maxLength = Math.max(...dp);
    
    // Reconstruir a subsequência
    const result = [];
    let currentLength = maxLength;
    let currentIndex = dp.indexOf(maxLength);
    
    result.push(nums[currentIndex]);
    
    for (let i = currentIndex - 1; i >= 0; i--) {
        if (dp[i] === currentLength - 1 && nums[i] < nums[currentIndex]) {
            result.push(nums[i]);
            currentLength = dp[i];
            currentIndex = i;
        }
    }
    
    result.reverse();
    
    console.log(`Sequência original: [${nums.join(', ')}]`);
    console.log(`Valores DP: [${dp.join(', ')}]`);
    console.log(`Maior subsequência crescente: [${result.join(', ')}]`);
    console.log(`Comprimento: ${maxLength}`);
    
    return {
        length: maxLength,
        subsequence: result
    };
}

// Exemplos
const sequence1 = [10, 9, 2, 5, 3, 7, 101, 18];
const sequence2 = [0, 1, 0, 3, 2, 3];

longestIncreasingSubsequence(sequence1);
longestIncreasingSubsequence(sequence2);

// Pergunta reflexiva: Como a abordagem DP é mais eficiente que verificar todas as subsequências?
// Resposta: A abordagem DP tem complexidade O(n²), enquanto verificar todas as subsequências seria O(2^n).
```

##### Exercício 2: Problema de Agendamento de Tarefas (Algoritmo Guloso)

Você tem um conjunto de tarefas, cada uma com um prazo e um valor de recompensa. Cada tarefa leva uma unidade de tempo para ser concluída. Encontre a sequência de tarefas que maximiza a recompensa total.

```javascript
console.log("\n=== Exercício 2 (Iniciante): Agendamento de Tarefas Guloso ===");

function scheduleJobs(jobs) {
    // Ordenar tarefas por valor (estratégia gulosa)
    jobs.sort((a, b) => b.profit - a.profit);
    
    // Encontrar o maior prazo
    const maxDeadline = Math.max(...jobs.map(job => job.deadline));
    
    // Array de slots de tempo disponíveis (inicialmente, todos disponíveis)
    const timeSlots = Array(maxDeadline).fill(false);
    
    // Resultado (tarefas agendadas e lucro total)
    const scheduledJobs = [];
    let totalProfit = 0;
    
    console.log("Tarefas ordenadas por valor:");
    jobs.forEach(job => {
        console.log(`Tarefa ${job.id}: Prazo=${job.deadline}, Valor=${job.profit}`);
    });
    
    // Para cada tarefa, tentamos agendá-la no último slot disponível antes do prazo
    for (const job of jobs) {
        // Encontrar o último slot disponível antes do prazo
        for (let i = Math.min(maxDeadline - 1, job.deadline - 1); i >= 0; i--) {
            if (!timeSlots[i]) {
                timeSlots[i] = true;
                scheduledJobs.push(job);
                totalProfit += job.profit;
                console.log(`Agendando Tarefa ${job.id} no slot ${i+1}`);
                break;
            }
        }
    }
    
    console.log("\nEstado final dos slots:");
    timeSlots.forEach((occupied, i) => {
        console.log(`Slot ${i+1}: ${occupied ? 'Ocupado' : 'Livre'}`);
    });
    
    console.log("\nTarefas agendadas:");
    scheduledJobs.forEach(job => {
        console.log(`Tarefa ${job.id} (Valor=${job.profit})`);
    });
    
    console.log(`Valor total: ${totalProfit}`);
    
    return {
        scheduledJobs,
        totalProfit
    };
}

// Exemplo
const jobs = [
    { id: 1, deadline: 4, profit: 20 },
    { id: 2, deadline: 1, profit: 10 },
    { id: 3, deadline: 1, profit: 40 },
    { id: 4, deadline: 1, profit: 30 },
    { id: 5, deadline: 3, profit: 50 }
];

scheduleJobs(jobs);

// Pergunta reflexiva: Por que ordenar por valor e não por prazo neste problema?
// Resposta: A estratégia gulosa prioriza valor porque queremos maximizar o lucro total,
// e depois tentamos encaixar cada tarefa no último slot possível antes do prazo.
```

#### Nível Intermediário

##### Exercício 3: Problema de Corte de Hastes (Programação Dinâmica)

Dada uma haste de comprimento n e uma tabela de preços para diferentes comprimentos, determine o valor máximo que pode ser obtido cortando a haste e vendendo os pedaços.

```javascript
console.log("\n=== Exercício 3 (Intermediário): Problema de Corte de Hastes ===");

function rodCutting(prices, n) {
    // Cria tabela DP de tamanho n+1
    const dp = Array(n + 1).fill(0);
    // Rastreia os cortes
    const cuts = Array(n + 1).fill(0);
    
    console.log("Preços por comprimento:");
    prices.forEach((price, len) => {
        if (len > 0) {
            console.log(`Comprimento ${len}: R$${price}`);
        }
    });
    
    // Visualização da evolução da tabela DP
    console.log("\nConstrução da tabela DP:");
    
    // Para cada comprimento de 1 a n
    for (let i = 1; i <= n; i++) {
        let maxRevenue = -Infinity;
        
        // Tentar todos os possíveis cortes
        for (let j = 1; j <= i; j++) {
            const currentRevenue = prices[j] + dp[i - j];
            
            if (currentRevenue > maxRevenue) {
                maxRevenue = currentRevenue;
                cuts[i] = j; // Registra o melhor primeiro corte
            }
        }
        
        dp[i] = maxRevenue;
        
        console.log(`Para comprimento ${i}: Valor máximo = R$${dp[i]}, Primeiro corte = ${cuts[i]}`);
    }
    
    console.log("\nTabela DP completa (valores máximos):");
    console.log(`[${dp.join(', ')}]`);
    
    // Reconstruir a solução
    const solution = [];
    let remainingLength = n;
    
    while (remainingLength > 0) {
        solution.push(cuts[remainingLength]);
        remainingLength -= cuts[remainingLength];
    }
    
    console.log("\nMelhor estratégia de corte:");
    console.log(`Para uma haste de comprimento ${n}, cortar em: ${solution.join(', ')}`);
    console.log(`Valor máximo: R$${dp[n]}`);
    
    // Visualização gráfica dos cortes
    let rodVisual = "|" + "-".repeat(n) + "|";
    let cutMarks = " ";
    let currentPos = 0;
    
    for (let cut of solution) {
        currentPos += cut;
        if (currentPos < n) {
            cutMarks += " ".repeat(cut-1) + "✂" + " ";
        }
    }
    
    console.log("\nVisualização dos cortes:");
    console.log(rodVisual);
    console.log(cutMarks);
    
    return {
        maxValue: dp[n],
        cuts: solution
    };
}

// Exemplo (preços indexados pelo comprimento)
const prices = [0, 1, 5, 8, 9, 10, 17, 17, 20, 24];
const rodLength = 8;

rodCutting(prices, rodLength);

// Pergunta reflexiva: Como você analisaria a diferença entre a estratégia gulosa (cortar pelo maior valor/comprimento) 
// e a programação dinâmica para este problema?
// Resposta: A estratégia gulosa poderia escolher sempre o pedaço com maior valor/comprimento, 
// mas isso nem sempre leva à solução ótima, pois múltiplos cortes menores podem resultar em valor maior.
```

##### Exercício 4: Distância de Edição (Programação Dinâmica)

Dadas duas strings, calcule o número mínimo de operações (inserção, exclusão, substituição) necessárias para transformar uma string na outra.

```javascript
console.log("\n=== Exercício 4 (Intermediário): Distância de Edição ===");

function editDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    
    // Cria matriz DP de tamanho (m+1) x (n+1)
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    
    // Preenche a primeira linha e coluna
    for (let i = 0; i <= m; i++) {
        dp[i][0] = i; // Custo para deletar i caracteres
    }
    
    for (let j = 0; j <= n; j++) {
        dp[0][j] = j; // Custo para inserir j caracteres
    }
    
    // Operações de rastreamento
    const operations = Array(m + 1).fill().map(() => Array(n + 1).fill(''));
    
    console.log(`Calculando distância de edição entre "${str1}" e "${str2}"`);
    console.log("\nEstado inicial da tabela DP:");
    printEditDistanceMatrix(dp, str1, str2);
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            // Se os caracteres são iguais, nenhuma operação necessária
            if (str1[i - 1] === str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
                operations[i][j] = 'match';
            } else {
                // Escolhe a operação de menor custo
                const insert = dp[i][j - 1] + 1;
                const remove = dp[i - 1][j] + 1;
                const replace = dp[i - 1][j - 1] + 1;
                
                dp[i][j] = Math.min(insert, remove, replace);
                
                if (dp[i][j] === insert) {
                    operations[i][j] = 'insert';
                } else if (dp[i][j] === remove) {
                    operations[i][j] = 'remove';
                } else {
                    operations[i][j] = 'replace';
                }
            }
        }
        
        console.log(`\nApós processar linha ${i} (caractere '${str1[i-1]}'):`);
        printEditDistanceMatrix(dp, str1, str2);
    }
    
    // Reconstruir a sequência de operações
    let i = m, j = n;
    const steps = [];
    
    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && str1[i - 1] === str2[j - 1]) {
            steps.push(`Manter '${str1[i - 1]}'`);
            i--;
            j--;
        } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
            steps.push(`Substituir '${str1[i - 1]}' por '${str2[j - 1]}'`);
            i--;
            j--;
        } else if (j > 0 && dp[i][j] === dp[i][j - 1] + 1) {
            steps.push(`Inserir '${str2[j - 1]}'`);
            j--;
        } else {
            steps.push(`Deletar '${str1[i - 1]}'`);
            i--;
        }
    }
    
    steps.reverse();
    
    console.log("\nSequência de operações:");
    steps.forEach((step, index) => {
        console.log(`${index + 1}. ${step}`);
    });
    
    console.log(`\nDistância de edição: ${dp[m][n]}`);
    return dp[m][n];
}

// Função auxiliar para visualizar a matriz de distância
function printEditDistanceMatrix(dp, str1, str2) {
    let header = "    ";
    for (let j = 0; j < str2.length; j++) {
        header += ` ${str2[j]} `;
    }
    console.log(header);
    
    for (let i = 0; i <= str1.length; i++) {
        let row = i === 0 ? "  " : `${str1[i - 1]} `;
        for (let j = 0; j <= str2.length; j++) {
            row += `${dp[i][j]} `;
        }
        console.log(row);
    }
}

// Exemplos
editDistance("kitten", "sitting");
editDistance("algoritmo", "logaritmo");

// Pergunta reflexiva: Como a distância de edição se relaciona com outros problemas de programação dinâmica 
// que vimos, como a maior subsequência comum?
// Resposta: Ambos usam matrizes DP preenchidas de forma semelhante, mas a LCS procura maximizar correspondências,
// enquanto a distância de edição minimiza operações. São abordagens complementares para comparar strings.
```

#### Nível Avançado

##### Exercício 5: Combinação das Abordagens - Mochila com Limitações Adicionais

Neste exercício avançado, vamos resolver uma variante do problema da mochila que combina características gulosas e de programação dinâmica.

```javascript
console.log("\n=== Exercício 5 (Avançado): Mochila com Limitações Adicionais ===");

function advancedKnapsack(items, capacity, maxItems) {
    const n = items.length;
    
    // Abordagem 1: Tentar solução gulosa primeiro
    console.log("Tentando solução gulosa primeiro (por densidade de valor)...");
    
    // Calcular densidade de valor
    const itemsWithDensity = items.map((item, idx) => ({
        ...item,
        density: item.value / item.weight,
        index: idx
    }));
    
    // Ordenar por densidade
    itemsWithDensity.sort((a, b) => b.density - a.density);
    
    let totalWeight = 0;
    let totalValue = 0;
    const selectedGreedy = [];
    
    for (const item of itemsWithDensity) {
        if (selectedGreedy.length >= maxItems) break;
        
        if (totalWeight + item.weight <= capacity) {
            selectedGreedy.push(item.index);
            totalWeight += item.weight;
            totalValue += item.value;
            console.log(`Selecionado item ${item.index} (peso=${item.weight}, valor=${item.value})`);
        }
    }
    
    console.log(`\nResultado guloso: ${selectedGreedy.length} itens, valor total ${totalValue}`);
    
    // Abordagem 2: Solução com programação dinâmica
    console.log("\nAgora usando programação dinâmica com restrição de itens...");
    
    // Criar tabela DP tridimensional [i][w][k] onde:
    // i = número de itens considerados
    // w = capacidade atual
    // k = número máximo de itens restantes
    const dp = Array(n + 1).fill().map(() => 
        Array(capacity + 1).fill().map(() => 
            Array(maxItems + 1).fill(0)
        )
    );
    
    // Preencher a tabela
    for (let i = 1; i <= n; i++) {
        const item = items[i - 1];
        
        for (let w = 0; w <= capacity; w++) {
            for (let k = 0; k <= maxItems; k++) {
                // Se não podemos incluir mais itens ou o item atual não cabe
                if (k === 0 || item.weight > w) {
                    dp[i][w][k] = dp[i - 1][w][k];
                } else {
                    // Decidir entre incluir ou não o item atual
                    dp[i][w][k] = Math.max(
                        dp[i - 1][w][k], // Não incluir
                        dp[i - 1][w - item.weight][k - 1] + item.value // Incluir
                    );
                }
            }
        }
    }
    
    // Reconstruir a solução
    const selectedDP = [];
    let w = capacity;
    let k = maxItems;
    
    for (let i = n; i > 0; i--) {
        if (k > 0 && dp[i][w][k] !== dp[i - 1][w][k]) {
            selectedDP.push(i - 1);
            w -= items[i - 1].weight;
            k--;
        }
    }
    
    // Calcular o valor total da solução DP
    const dpValue = selectedDP.reduce((sum, idx) => sum + items[idx].value, 0);
    
    console.log(`\nTabela DP final (valor ótimo): ${dp[n][capacity][maxItems]}`);
    console.log(`Solução DP: ${selectedDP.length} itens, valor total ${dpValue}`);
    
    // Comparar as duas abordagens
    console.log("\nComparação das abordagens:");
    console.log(`Gulosa: ${totalValue} (${(totalValue / dp[n][capacity][maxItems] * 100).toFixed(2)}% do ótimo)`);
    console.log(`DP: ${dpValue} (ótimo)`);
    
    return {
        greedySolution: { items: selectedGreedy, value: totalValue },
        dpSolution: { items: selectedDP, value: dpValue }
    };
}

// Exemplo
const knapsackItems = [
    { name: "Item 1", weight: 2, value: 10 },
    { name: "Item 2", weight: 5, value: 20 },
    { name: "Item 3", weight: 10, value: 30 },
    { name: "Item 4", weight: 5, value: 50 },
    { name: "Item 5", weight: 3, value: 15 },
    { name: "Item 6", weight: 1, value: 10 },
    { name: "Item 7", weight: 4, value: 25 },
    { name: "Item 8", weight: 7, value: 40 }
];

const knapsackCapacity = 15;
const maxItems = 3;

advancedKnapsack(knapsackItems, knapsackCapacity, maxItems);

// Pergunta reflexiva: Quando vale a pena usar uma abordagem híbrida (gulosa + DP) em vez de apenas DP?
// Resposta: Abordagens híbridas podem ser úteis quando o espaço de estados da DP é muito grande (maldição da dimensionalidade),
// ou quando queremos uma solução aproximada rápida antes de calcular a solução ótima completa.
```

##### Exercício 6: Algoritmo de Prim vs. Algoritmo de Kruskal (Comparação Experimental)

Compare experimentalmente os algoritmos de Prim e Kruskal para encontrar a árvore geradora mínima (MST) em grafos com diferentes características.

```javascript
console.log("\n=== Exercício 6 (Avançado): Prim vs. Kruskal ===");

// Classes e funções auxiliares
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

// Implementação do algoritmo de Kruskal
function kruskalMST(vertices, edges) {
    const startTime = performance.now();
    
    // Ordena arestas por peso (estratégia gulosa)
    edges.sort((a, b) => a.weight - b.weight);
    
    const disjointSet = new DisjointSet(vertices);
    const mst = [];
    let totalWeight = 0;
    
    for (let edge of edges) {
        if (disjointSet.union(edge.from, edge.to)) {
            mst.push(edge);
            totalWeight += edge.weight;
            
            // Se MST está completa
            if (mst.length === vertices - 1) break;
        }
    }
    
    const endTime = performance.now();
    
    return { 
        mst, 
        totalWeight,
        executionTime: endTime - startTime
    };
}

// Implementação do algoritmo de Prim
function primMST(vertices, adjacencyList) {
    const startTime = performance.now();
    
    const visited = Array(vertices).fill(false);
    const key = Array(vertices).fill(Infinity);
    const parent = Array(vertices).fill(-1);
    
    // Começa do vértice 0
    key[0] = 0;
    
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
    
    const endTime = performance.now();
    
    return { 
        mst, 
        totalWeight,
        executionTime: endTime - startTime
    };
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

// Gerador de grafos aleatórios para teste
function generateRandomGraph(vertices, density) {
    const edges = [];
    const maxEdges = vertices * (vertices - 1) / 2;
    const edgesToGenerate = Math.floor(maxEdges * density);
    
    // Gerar árvore conectando todos os vértices para garantir conectividade
    for (let i = 1; i < vertices; i++) {
        const from = Math.floor(Math.random() * i);
        const weight = Math.floor(Math.random() * 100) + 1;
        edges.push({ from, to: i, weight });
    }
    
    // Adicionar arestas adicionais aleatórias
    while (edges.length < edgesToGenerate) {
        const from = Math.floor(Math.random() * vertices);
        const to = Math.floor(Math.random() * vertices);
        
        if (from !== to && !edges.some(e => 
            (e.from === from && e.to === to) || 
            (e.from === to && e.to === from))) {
            const weight = Math.floor(Math.random() * 100) + 1;
            edges.push({ from, to, weight });
        }
    }
    
    return edges;
}

// Executar testes comparativos
function compareMSTAlgorithms() {
    const testCases = [
        { vertices: 10, density: 0.3, description: "Grafo pequeno e esparso" },
        { vertices: 10, density: 0.9, description: "Grafo pequeno e denso" },
        { vertices: 50, density: 0.1, description: "Grafo médio e esparso" },
        { vertices: 50, density: 0.5, description: "Grafo médio e denso" },
        { vertices: 100, density: 0.05, description: "Grafo grande e esparso" },
        { vertices: 100, density: 0.3, description: "Grafo grande e denso" }
    ];
    
    console.log("Comparando Prim vs Kruskal em diferentes tipos de grafos:\n");
    
    testCases.forEach(testCase => {
        console.log(`\n---- ${testCase.description} (V=${testCase.vertices}, densidade=${testCase.density}) ----`);
        
        const edges = generateRandomGraph(testCase.vertices, testCase.density);
        console.log(`Número de arestas: ${edges.length}`);
        
        // Executar Kruskal
        const kruskalResult = kruskalMST(testCase.vertices, edges);
        
        // Executar Prim
        const adjList = edgesToAdjacencyList(testCase.vertices, edges);
        const primResult = primMST(testCase.vertices, adjList);
        
        // Verificar resultados
        console.log(`\nKruskal: Peso total = ${kruskalResult.totalWeight}, Tempo = ${kruskalResult.executionTime.toFixed(4)}ms`);
        console.log(`Prim: Peso total = ${primResult.totalWeight}, Tempo = ${primResult.executionTime.toFixed(4)}ms`);
        
        // Determinar o mais rápido
        const faster = kruskalResult.executionTime < primResult.executionTime ? "Kruskal" : "Prim";
        const speedup = Math.max(kruskalResult.executionTime, primResult.executionTime) / 
                        Math.min(kruskalResult.executionTime, primResult.executionTime);
        
        console.log(`\nAlgoritmo mais rápido: ${faster} (${speedup.toFixed(2)}x mais rápido)`);
        
        // Verificar se os resultados são consistentes
        if (Math.abs(kruskalResult.totalWeight - primResult.totalWeight) > 0.001) {
            console.log("AVISO: Os pesos totais não coincidem!");
        }
    });
}

compareMSTAlgorithms();

// Pergunta reflexiva: Com base nos resultados experimentais, que fatores influenciam mais 
// a escolha entre Prim e Kruskal para diferentes tipos de grafos?
// Resposta: A densidade do grafo é o fator mais importante. Kruskal tende a ser melhor 
// para grafos esparsos, enquanto Prim com filas de prioridade eficientes é melhor para grafos densos.
// O número de vértices também influencia: quanto mais vértices, mais Prim com heap binário ganha vantagem.
```

### Projeto Integrador

Para aplicar todos os conceitos aprendidos neste módulo, desenvolva um sistema de roteamento que combine algoritmos gulosos e programação dinâmica para encontrar o melhor caminho entre cidades, considerando múltiplos fatores como distância, tempo, custo e preferências do usuário.

```javascript
// Esboço do Projeto Integrador:
// 1. Crie uma rede de cidades conectadas por estradas
// 2. Implemente diversas métricas (tempo, distância, pedágios, etc.)
// 3. Use algoritmo guloso para uma primeira aproximação rápida
// 4. Refine com programação dinâmica considerando múltiplos fatores
// 5. Compare os resultados com algoritmos puros (Dijkstra, Floyd-Warshall)
```

### Conclusão

Neste módulo, exploramos dois paradigmas poderosos para resolução de problemas: algoritmos gulosos e programação dinâmica. Vimos que algoritmos gulosos são mais simples e eficientes quando a escolha local ótima leva à solução global ótima. Já a programação dinâmica é mais adequada para problemas com subproblemas sobrepostos e subestrutura ótima, permitindo encontrar soluções garantidamente ótimas para uma classe maior de problemas.

Para se aprofundar mais nestes tópicos, recomendamos:

1. Implementar os exercícios em linguagens diferentes para comparar desempenho
2. Explorar variantes dos problemas clássicos (como mochila com repetição, mochila com restrições adicionais)
3. Estudar aplicações práticas em áreas como compressão de dados, bioinformática e logística

No próximo módulo, exploraremos algoritmos avançados que combinam as técnicas aprendidas até aqui para resolver problemas ainda mais complexos do mundo real. 