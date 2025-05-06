# Algoritmos e Estrutura de Dados na Prática

## Módulo 6: Algoritmos Gulosos e Programação Dinâmica

### 6. Case Study: Otimização de Rotas de Entrega usando Programação Dinâmica

Neste estudo de caso, vamos aplicar os conceitos de programação dinâmica para resolver um problema prático de otimização de rotas de entrega, similar ao famoso Problema do Caixeiro Viajante (TSP).

#### Contexto do Problema

Uma empresa de logística precisa otimizar suas rotas de entrega. Um motorista deve visitar várias localizações (clientes) e retornar ao ponto de partida, minimizando a distância total percorrida.

Este é um problema NP-difícil, o que significa que não existe um algoritmo polinomial eficiente para resolvê-lo para todos os casos. No entanto, para um número gerenciável de localizações, a programação dinâmica oferece uma solução viável.

#### Formulação do Problema

**Entrada:**
- Um conjunto de n localizações (incluindo o depósito)
- Uma matriz de distâncias n x n, onde `distancia[i][j]` representa a distância da localização i para a localização j

**Saída:**
- A ordem de visita que minimiza a distância total
- A distância mínima total

#### Solução com Programação Dinâmica

A abordagem utiliza o algoritmo de Held-Karp, que é uma aplicação da programação dinâmica para o TSP:

1. Representamos subproblemas usando um estado de bits (quais cidades já foram visitadas) e a última cidade visitada
2. Para cada estado, calculamos a menor distância para completar o percurso
3. Reconstruímos o caminho a partir da tabela DP

```javascript
class TSPSolver {
    constructor(distances) {
        this.distances = distances;
        this.n = distances.length;
        this.memo = {};
    }
    
    // Função principal para resolver o TSP
    solve() {
        console.log("\n=== Otimização de Rotas de Entrega ===");
        console.log(`Número de localizações: ${this.n}`);
        
        console.log("\nMatriz de distâncias:");
        this.distances.forEach((row, i) => {
            console.log(`[${row.join(', ')}]`);
        });
        
        // Começamos no vértice 0 (depósito)
        const startTime = performance.now();
        
        // Chamamos a função recursiva com memoização
        const result = this.tsp(1, 0); // 1 representa o conjunto de bits {0}
        
        const endTime = performance.now();
        console.log(`\nTempo de execução: ${(endTime - startTime).toFixed(2)}ms`);
        
        // Reconstruir o caminho
        const path = this.reconstructPath();
        
        console.log("\nRota ótima encontrada:");
        console.log(`${path.join(' → ')} → ${path[0]}`);
        console.log(`Distância total: ${result}`);
        
        return {
            distance: result,
            path: path
        };
    }
    
    // Função recursiva principal com memoização
    tsp(mask, pos) {
        // Se já visitamos todas as cidades, retornamos ao depósito
        if (mask === (1 << this.n) - 1) {
            return this.distances[pos][0];
        }
        
        // Verificamos se já calculamos este estado
        const key = `${mask}|${pos}`;
        if (key in this.memo) {
            return this.memo[key];
        }
        
        let ans = Infinity;
        
        // Tenta visitar cada cidade que ainda não foi visitada
        for (let city = 0; city < this.n; city++) {
            if ((mask & (1 << city)) === 0) { // Se a cidade não foi visitada
                const newMask = mask | (1 << city);
                const subproblem = this.distances[pos][city] + this.tsp(newMask, city);
                ans = Math.min(ans, subproblem);
            }
        }
        
        // Armazenamos o resultado na memoização
        this.memo[key] = ans;
        return ans;
    }
    
    // Reconstruir o caminho a partir dos resultados memoizados
    reconstructPath() {
        let mask = 1; // Começamos apenas com o depósito visitado
        let pos = 0;  // Posição atual é o depósito
        const path = [0]; // O caminho começa no depósito
        
        // Enquanto não visitarmos todas as cidades
        while (mask !== (1 << this.n) - 1) {
            let bestCity = -1;
            let bestDist = Infinity;
            
            // Encontra a próxima cidade não visitada que minimiza a distância
            for (let city = 0; city < this.n; city++) {
                if ((mask & (1 << city)) === 0) { // Se a cidade não foi visitada
                    const newMask = mask | (1 << city);
                    const key = `${newMask}|${city}`;
                    
                    if (this.memo[key] !== undefined && 
                        this.distances[pos][city] + this.memo[key] < bestDist) {
                        bestDist = this.distances[pos][city] + this.memo[key];
                        bestCity = city;
                    }
                }
            }
            
            if (bestCity === -1) break; // Se não encontrarmos uma cidade válida
            
            path.push(bestCity);
            mask |= (1 << bestCity);
            pos = bestCity;
        }
        
        return path;
    }
    
    // Visualizar a execução para um caso pequeno (apenas para fins didáticos)
    visualizeMemoization() {
        console.log("\n=== Tabela de Memoização ===");
        console.log("Formato: {mask}|{lastCity} => distância");
        
        const entries = Object.entries(this.memo);
        entries.sort((a, b) => {
            const [keyA] = a;
            const [keyB] = b;
            const [maskA, posA] = keyA.split('|').map(Number);
            const [maskB, posB] = keyB.split('|').map(Number);
            
            return maskA - maskB || posA - posB;
        });
        
        for (const [key, value] of entries) {
            const [mask, pos] = key.split('|');
            const binaryMask = parseInt(mask).toString(2).padStart(this.n, '0');
            console.log(`{${binaryMask}}|${pos} => ${value}`);
        }
    }
}

// Exemplo com 5 localizações (incluindo o depósito)
const distances = [
    [0, 10, 15, 20, 25],
    [10, 0, 35, 25, 30],
    [15, 35, 0, 30, 20],
    [20, 25, 30, 0, 15],
    [25, 30, 20, 15, 0]
];

const tspSolver = new TSPSolver(distances);
tspSolver.solve();

// Para casos pequenos, podemos visualizar a tabela de memoização
if (distances.length <= 5) {
    tspSolver.visualizeMemoization();
}
```

#### Abordagem Alternativa: Algoritmo Guloso para o TSP

Para fins de comparação, vamos implementar uma aproximação gulosa (conhecida como "vizinho mais próximo"):

```javascript
function nearestNeighborTSP(distances) {
    const n = distances.length;
    const visited = Array(n).fill(false);
    const path = [0]; // Começamos no depósito (vértice 0)
    visited[0] = true;
    
    let totalDistance = 0;
    
    console.log("\n=== Algoritmo Guloso (Vizinho Mais Próximo) ===");
    console.log("Rota sendo construída:");
    console.log(`Ponto inicial: 0`);
    
    for (let i = 0; i < n - 1; i++) {
        const current = path[path.length - 1];
        let nearestCity = -1;
        let shortestDistance = Infinity;
        
        // Encontrar o vizinho mais próximo não visitado
        for (let city = 0; city < n; city++) {
            if (!visited[city] && distances[current][city] < shortestDistance) {
                nearestCity = city;
                shortestDistance = distances[current][city];
            }
        }
        
        if (nearestCity !== -1) {
            console.log(`De ${current} para ${nearestCity}: distância ${shortestDistance}`);
            path.push(nearestCity);
            visited[nearestCity] = true;
            totalDistance += shortestDistance;
        }
    }
    
    // Retornar ao depósito
    const lastCity = path[path.length - 1];
    totalDistance += distances[lastCity][0];
    console.log(`De ${lastCity} de volta ao depósito 0: distância ${distances[lastCity][0]}`);
    
    console.log("\nRota gulosa encontrada:");
    console.log(`${path.join(' → ')} → 0`);
    console.log(`Distância total: ${totalDistance}`);
    
    return {
        distance: totalDistance,
        path: path
    };
}

// Comparar as duas abordagens
console.log("\n=== Comparação das Abordagens ===");
const greedyResult = nearestNeighborTSP(distances);
const dpResult = tspSolver.solve();

console.log("\nResultados:");
console.log(`Programação Dinâmica: ${dpResult.distance}`);
console.log(`Algoritmo Guloso: ${greedyResult.distance}`);
console.log(`Diferença: ${((greedyResult.distance / dpResult.distance - 1) * 100).toFixed(2)}%`);
```

#### Estudo de Caso: Empresa de Entregas Rápidas

Vamos aplicar os conceitos a um caso real de uma empresa de entregas que precisa otimizar suas rotas diárias.

```javascript
function simulateDeliveryCompany() {
    console.log("\n=== Empresa de Entregas Rápidas - Simulação ===");
    
    // Gera localizações aleatórias no plano cartesiano
    function generateRandomLocations(n, maxCoord = 100) {
        const locations = [];
        for (let i = 0; i < n; i++) {
            locations.push({
                id: i,
                name: i === 0 ? "Depósito" : `Cliente ${i}`,
                x: Math.floor(Math.random() * maxCoord),
                y: Math.floor(Math.random() * maxCoord)
            });
        }
        return locations;
    }
    
    // Calcula matriz de distâncias (distância euclidiana)
    function calculateDistances(locations) {
        const n = locations.length;
        const distances = Array(n).fill().map(() => Array(n).fill(0));
        
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (i !== j) {
                    const dx = locations[i].x - locations[j].x;
                    const dy = locations[i].y - locations[j].y;
                    distances[i][j] = Math.sqrt(dx * dx + dy * dy);
                }
            }
        }
        
        return distances;
    }
    
    // Gerar caso de teste
    const numLocations = 8; // 7 clientes + 1 depósito
    const locations = generateRandomLocations(numLocations);
    const distances = calculateDistances(locations);
    
    console.log("Localizações geradas:");
    locations.forEach(loc => {
        console.log(`${loc.name}: (${loc.x}, ${loc.y})`);
    });
    
    console.log("\nResolver usando algoritmo guloso (rápido, aproximado):");
    const startGreedy = performance.now();
    const greedyResult = nearestNeighborTSP([...distances]);
    const endGreedy = performance.now();
    
    console.log(`Tempo de execução: ${(endGreedy - startGreedy).toFixed(2)}ms`);
    
    // Para problemas maiores, a programação dinâmica pode ser muito lenta
    // Por isso, limitamos a casos com no máximo 12 localização
    if (numLocations <= 12) {
        console.log("\nResolver usando programação dinâmica (exato):");
        const tspSolver = new TSPSolver([...distances]);
        const startDP = performance.now();
        const dpResult = tspSolver.solve();
        const endDP = performance.now();
        
        console.log(`Tempo de execução: ${(endDP - startDP).toFixed(2)}ms`);
        
        // Comparar resultados
        const improvement = ((greedyResult.distance / dpResult.distance - 1) * 100).toFixed(2);
        console.log(`\nMelhoria com PD: ${improvement}%`);
        
        // Calcular economia
        const costPerKm = 2.5; // Custo fictício por km
        const dailySavings = (greedyResult.distance - dpResult.distance) * costPerKm;
        const yearlySavings = dailySavings * 365;
        
        console.log("\n=== Análise de Economia ===");
        console.log(`Custo por km: R$${costPerKm}`);
        console.log(`Economia diária: R$${dailySavings.toFixed(2)}`);
        console.log(`Economia anual estimada: R$${yearlySavings.toFixed(2)}`);
    } else {
        console.log("\nProgramação Dinâmica não aplicada - número de localizações muito grande.");
        console.log("Para casos grandes, algoritmos de aproximação ou heurísticas são preferíveis.");
    }
    
    // Visualizar a rota (código simplificado para ilustração)
    console.log("\n=== Visualização da Rota (ASCII) ===");
    
    const size = 30;
    const grid = Array(size).fill().map(() => Array(size).fill(' '));
    
    // Normalizar as coordenadas para o tamanho da grade
    const normalizedLocations = locations.map(loc => ({
        ...loc,
        gridX: Math.floor(loc.x / 100 * (size - 1)),
        gridY: Math.floor(loc.y / 100 * (size - 1))
    }));
    
    // Marcar as localizações
    normalizedLocations.forEach(loc => {
        const char = loc.id === 0 ? 'D' : loc.id.toString();
        grid[loc.gridY][loc.gridX] = char;
    });
    
    // Imprimir a grade
    console.log(' ' + '-'.repeat(size * 2 - 1));
    for (let i = 0; i < size; i++) {
        console.log('|' + grid[i].join(' ') + '|');
    }
    console.log(' ' + '-'.repeat(size * 2 - 1));
    
    console.log("\nLegenda: D = Depósito, 1-7 = Clientes");
    
    return {
        greedyResult,
        dpResult: numLocations <= 12 ? dpResult : null
    };
}

// Executar a simulação
simulateDeliveryCompany();
```

#### Extensões e Melhorias para o Mundo Real

**Restrições Adicionais:**
- Janelas de tempo para entregas
- Capacidade limitada do veículo
- Múltiplos veículos
- Prioridades de entregas

**Algoritmos Avançados:**
- Algoritmos genéticos
- Otimização por colônia de formigas
- Busca local e meta-heurísticas

**Implementação Prática:**
```javascript
function realWorldConsiderations() {
    console.log("\n=== Considerações do Mundo Real ===");
    
    console.log("\n1. Janelas de Tempo:");
    console.log("   - Cada cliente possui um intervalo específico para entrega");
    console.log("   - A solução deve respeitar essas restrições temporais");
    
    console.log("\n2. Capacidade do Veículo:");
    console.log("   - Cada entrega tem um volume/peso");
    console.log("   - Múltiplas viagens podem ser necessárias");
    
    console.log("\n3. Trânsito Dinâmico:");
    console.log("   - As distâncias/tempos variam com a hora do dia");
    console.log("   - Replanejamento em tempo real pode ser necessário");
    
    console.log("\n4. Priorização de Clientes:");
    console.log("   - Alguns clientes têm maior prioridade");
    console.log("   - Equilibrar eficiência e satisfação do cliente");
    
    console.log("\nConclusão: O problema real é significativamente mais complexo");
    console.log("e geralmente requer uma combinação de técnicas.");
}

realWorldConsiderations();
```

### Conclusão

Neste estudo de caso, exploramos como a programação dinâmica pode ser aplicada para resolver o problema de otimização de rotas. Embora a abordagem exata seja computacionalmente intensiva para casos grandes, ela fornece a solução ótima para problemas de tamanho moderado.

Para casos práticos com muitas localizações, algoritmos aproximados (como o do vizinho mais próximo) ou meta-heurísticas são mais adequados. O importante é entender as vantagens e limitações de cada abordagem e escolher a mais adequada para cada situação.

A otimização de rotas é uma aplicação prática que demonstra o poder dos algoritmos que estudamos neste módulo, com impactos significativos em eficiência, custo e sustentabilidade nas operações logísticas do mundo real. 