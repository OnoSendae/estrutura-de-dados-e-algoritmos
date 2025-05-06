# Algoritmos e Estrutura de Dados na Prática

## Módulo 6: Algoritmos Gulosos e Programação Dinâmica

### 3. Transição de Algoritmos Gulosos para Programação Dinâmica

Neste tópico, vamos explorar a ponte conceitual entre os algoritmos gulosos e a programação dinâmica. Veremos quando cada abordagem é mais adequada e analisaremos um mesmo problema resolvido por ambas as técnicas.

#### Recapitulando as Abordagens

```
                Algoritmo Guloso              Programação Dinâmica
               +----------------+            +------------------+
Processo    →  | Escolha local  |            | Considera TODAS  |
               | ótima em cada  |            | as possibilidades|
               | etapa          |            | e subproblemas   |
               +----------------+            +------------------+

Decisões    →  | Nunca reconsi- |            | Armazena soluções|
               | dera decisões  |            | de subproblemas  |
               | passadas       |            | para decisão final|
               +----------------+            +------------------+

Aplicações  →  | Único caminho  |            | Múltiplos caminhos|
               | "bom" possível |            | possivelmente    |
               |                |            | ótimos           |
               +----------------+            +------------------+
```

#### Quando os Algoritmos Gulosos Falham?

Os algoritmos gulosos são rápidos e simples, mas podem falhar quando:

1. **A escolha local ótima não leva à solução global ótima**
2. **Decisões passadas afetam significativamente as futuras opções**
3. **Existem múltiplos critérios conflitantes para a escolha gulosa**

#### Exemplo Comparativo: Problema da Mochila

##### Versão Fracionária (Adequada para Algoritmo Guloso)

Na versão fracionária, podemos pegar partes dos itens. A estratégia gulosa funciona porque:
- Sempre podemos escolher itens com maior valor/peso
- Não há conflito de decisões: itens de alta densidade são sempre melhores
- Se não couber inteiro, pegamos uma fração

```javascript
function knapsackFractional(capacity, items) {
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
    
    console.log("\n=== Mochila Fracionária (Abordagem Gulosa) ===");
    
    for (let item of itemsWithDensity) {
        if (remainingCapacity >= item.weight) {
            // Pega o item inteiro
            totalValue += item.value;
            remainingCapacity -= item.weight;
            takenItems.push({item: item.name, fraction: 1});
            console.log(`Pega ${item.name} inteiro`);
        } else if (remainingCapacity > 0) {
            // Pega fração do item
            const fraction = remainingCapacity / item.weight;
            totalValue += item.value * fraction;
            takenItems.push({item: item.name, fraction: fraction});
            console.log(`Pega ${(fraction * 100).toFixed(1)}% de ${item.name}`);
            remainingCapacity = 0;
            break;
        }
    }
    
    console.log(`Valor total: ${totalValue.toFixed(2)}`);
    return totalValue;
}
```

##### Versão 0/1 (Requer Programação Dinâmica)

Na versão 0/1, cada item só pode ser escolhido inteiramente ou não. A estratégia gulosa falha porque:
- Uma escolha inicial aparentemente boa pode bloquear combinações melhores no futuro
- Precisamos considerar todas as combinações possíveis
- Há subproblemas sobrepostos, ideais para memoização

```javascript
// Abordagem gulosa (incorreta para o problema da mochila 0/1)
function knapsack01Greedy(capacity, items) {
    const itemsWithDensity = items.map(item => ({
        ...item,
        density: item.value / item.weight
    }));
    
    // Mesma estratégia da versão fracionária (não será ótima)
    itemsWithDensity.sort((a, b) => b.density - a.density);
    
    let totalValue = 0;
    let remainingCapacity = capacity;
    const takenItems = [];
    
    console.log("\n=== Mochila 0/1 (Abordagem Gulosa - Não Ótima) ===");
    
    for (let item of itemsWithDensity) {
        if (remainingCapacity >= item.weight) {
            // Só podemos pegar o item inteiro
            totalValue += item.value;
            remainingCapacity -= item.weight;
            takenItems.push(item.name);
            console.log(`Pega ${item.name}`);
        }
    }
    
    console.log(`Valor total: ${totalValue}`);
    return { totalValue, takenItems };
}

// Abordagem com programação dinâmica (ótima)
function knapsack01DP(capacity, items) {
    const n = items.length;
    
    // Cria matriz DP[i][w] onde i é o item e w é o peso
    const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
    
    console.log("\n=== Mochila 0/1 (Abordagem DP - Ótima) ===");
    
    // Constrói a tabela DP bottom-up
    for (let i = 1; i <= n; i++) {
        const item = items[i - 1];
        
        for (let w = 0; w <= capacity; w++) {
            if (item.weight > w) {
                // Item não cabe: mantém valor anterior
                dp[i][w] = dp[i - 1][w];
            } else {
                // Decide entre incluir ou não o item atual
                dp[i][w] = Math.max(
                    dp[i - 1][w],                         // Não inclui
                    dp[i - 1][w - item.weight] + item.value  // Inclui
                );
            }
        }
    }
    
    // Reconstrói a solução
    const selectedItems = [];
    let w = capacity;
    
    for (let i = n; i > 0; i--) {
        // Se o valor mudou, o item foi incluído
        if (dp[i][w] !== dp[i - 1][w]) {
            selectedItems.push(items[i - 1].name);
            w -= items[i - 1].weight;
        }
    }
    
    console.log("Tabela DP final:");
    dp.forEach((row, i) => {
        if (i === 0) return; // Pula primeira linha
        console.log(`Item ${i} (${items[i-1].name}): [${row.slice(0, capacity+1).join(', ')}]`);
    });
    
    console.log(`\nItens selecionados: ${selectedItems.reverse().join(', ')}`);
    console.log(`Valor total: ${dp[n][capacity]}`);
    
    return { totalValue: dp[n][capacity], selectedItems };
}
```

#### Comparação com um Exemplo Concreto

Vamos ver um exemplo onde a abordagem gulosa falha para a mochila 0/1:

```javascript
// Exemplo onde a abordagem gulosa falha
const items = [
    { name: "Item A", weight: 10, value: 60 },  // Densidade: 6
    { name: "Item B", weight: 20, value: 100 }, // Densidade: 5
    { name: "Item C", weight: 30, value: 120 }  // Densidade: 4
];

const capacity = 50;

// Executando ambas as abordagens
const greedyResult = knapsack01Greedy(capacity, items);
const dpResult = knapsack01DP(capacity, items);

console.log("\n=== Comparação dos Resultados ===");
console.log(`Abordagem Gulosa: Valor ${greedyResult.totalValue}`);
console.log(`Programação Dinâmica: Valor ${dpResult.totalValue}`);
```

Neste exemplo:
- A abordagem gulosa escolhe os itens A e B (densidade maior), resultando em valor total 160
- A abordagem DP encontra a combinação ótima de itens B e C, resultando em valor total 220

#### Outros Problemas de Transição

Existem outros problemas que marcam a transição entre algoritmos gulosos e programação dinâmica:

1. **Caminhos Mínimos:**
   - Single-source: Dijkstra (guloso) funciona para pesos positivos
   - All-pairs: Floyd-Warshall (DP) é necessário para casos gerais

2. **Scheduling de Tarefas:**
   - Minimizar número de tarefas atrasadas: Guloso funciona
   - Minimizar atraso total ponderado: Geralmente requer DP

3. **Árvores de Decisão:**
   - Classificadores como árvores de decisão usam escolhas gulosas
   - Redes neurais e modelos complexos usam princípios de DP

#### Visualização do Espaço de Soluções

```
Algoritmos Gulosos                      Programação Dinâmica
+------------------------+              +------------------------+
|                        |              |                        |
|       O                |              |       O                |
|      /|                |              |      /|\               |
|     / |                |              |     / | \              |
|    /  |                |              |    /  |  \             |
|   /   |                |              |   /   |   \            |
|  O    |                |              |  O    O    O           |
|  |    |                |              |  |\  /|\  /|           |
|  |    |                |              |  | \/ | \/ |           |
|  |    |                |              |  | /\ | /\ |           |
|  O    |                |              |  |/  \|/  \|           |
|  |    |                |              |  O    O    O           |
|  |    |                |              |  |\  /|\  /|           |
|  |    |                |              |  | \/ | \/ |           |
|  O    O                |              |  | /\ | /\ |           |
|  |   /                 |              |  |/  \|/  \|           |
|  |  /                  |              |  O    O    O           |
|  | /                   |              |   \   |   /            |
|  |/                    |              |    \  |  /             |
|  O                     |              |     \ | /              |
|                        |              |      \|/               |
|                        |              |       O                |
+------------------------+              +------------------------+
   - Explora um caminho                    - Explora muitos caminhos
   - Decisão única por nível               - Considera múltiplas opções
   - Sem backtracking                      - Constrói solução ótima
```

#### Regra Prática: Quando Usar Cada Um?

**Use Algoritmos Gulosos quando:**
- Puder provar que a estratégia gulosa leva à solução ótima
- O problema tiver "propriedade gulosa" (escolha local ótima leva à global)
- Eficiência for muito crítica e aproximações forem aceitáveis

**Use Programação Dinâmica quando:**
- Houver subproblemas sobrepostos (cálculos repetidos)
- O problema tiver subestrutura ótima
- As decisões em um estágio afetarem estágios futuros
- O espaço de busca for muito grande e precisar ser otimizado

#### Conclusão

A transição de algoritmos gulosos para programação dinâmica ocorre quando percebemos que escolhas localmente ótimas nem sempre levam à solução globalmente ótima. Enquanto os algoritmos gulosos são mais simples e geralmente mais eficientes, a programação dinâmica nos permite encontrar garantidamente soluções ótimas para uma classe maior de problemas, ao custo de maior complexidade de implementação e, às vezes, maior uso de memória.

#### Exercício de Transição

Identifique quais dos problemas abaixo são melhor resolvidos com algoritmos gulosos e quais exigem programação dinâmica:

1. Encontrar o caminho mais curto em um grafo com pesos positivos
2. Encontrar a subsequência crescente mais longa em um array
3. Minimizar o número de moedas para dar um troco
4. Problema da mochila 0/1
5. Codificação de Huffman 