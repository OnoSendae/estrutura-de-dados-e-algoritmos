# Algoritmos e Estrutura de Dados na Prática

## Módulo 6: Algoritmos Gulosos e Programação Dinâmica

### 4. Programação Dinâmica: Fundamentos e Aplicações

A Programação Dinâmica (PD) é uma técnica poderosa para resolver problemas complexos decompostos em subproblemas mais simples. Diferente dos algoritmos gulosos, a PD **considera todas as possibilidades** antes de escolher a melhor solução.

#### Analogia: O Explorador Cauteloso 🧭

Imagine um explorador em uma caverna com múltiplos caminhos:

**Algoritmo Guloso:**
- Escolhe sempre o caminho que parece melhor no momento (mais iluminado, mais amplo)
- Nunca volta atrás

**Programação Dinâmica:**
- Explora **todos** os caminhos possíveis
- Registra o melhor caminho para cada ponto visitado
- Usa esse conhecimento para encontrar a solução ótima global

#### Elementos Fundamentais da Programação Dinâmica

**1. Subestrutura Ótima:**
- A solução ótima do problema contém soluções ótimas dos subproblemas

**2. Sobreposição de Subproblemas:**
- Os mesmos subproblemas são resolvidos repetidamente
- Usamos **memoização** ou **tabelas** para armazenar resultados

#### Vizualização da Subestrutura Ótima

```
Problema: Encontrar o caminho mais curto de A→Z

      B---10---D---8---F
     /         /       \
A--5           15       3--Z
     \         /       /
      C---7---E---4---G

Subestrutura ótima significa:
- Se o caminho ótimo A→Z passa por E, então 
  a parte E→Z deve ser o caminho ótimo de E→Z
- Se o melhor caminho A→Z é A→C→E→G→Z, então:
  - C→E→G→Z deve ser o melhor caminho de C→Z
  - E→G→Z deve ser o melhor caminho de E→Z
  - G→Z deve ser o melhor caminho de G→Z
```

#### Memoização vs. Tabulação

```
Tabulação (bottom-up):
      
      [0, 1, 1, 2, 3, 5, 8, 13, 21, ...]
       ^  ^  ^  ^  ^  ^  ^  ^   ^
       |  |  |  |  |  |  |  |   |
      f0 f1 f2 f3 f4 f5 f6 f7  f8
            ↑  ↑
            |  |
            +--+-- f4 = f3 + f2

Memoização (top-down):
                   f5
                  /  \
                f4    f3
               / \   / \
             f3  f2 f2  f1
            / \  |
          f2  f1 f1 f0
         / \
       f1  f0
```

```javascript
// MEMOIZAÇÃO (Top-down): Começar do problema completo, resolver recursivamente
function fibonacciMemo(n, memo = {}) {
    // Verifica se já calculamos este valor
    if (n in memo) return memo[n];
    
    // Casos base
    if (n <= 1) return n;
    
    // Calcula e armazena o resultado
    memo[n] = fibonacciMemo(n-1, memo) + fibonacciMemo(n-2, memo);
    return memo[n];
}

// TABULAÇÃO (Bottom-up): Começar dos casos base, construir iterativamente
function fibonacciTab(n) {
    // Casos base
    if (n <= 1) return n;
    
    // Inicializa a tabela
    const table = [0, 1];
    
    // Preenche a tabela iterativamente
    for (let i = 2; i <= n; i++) {
        table[i] = table[i-1] + table[i-2];
    }
    
    return table[n];
}

// Demonstração de desempenho
console.log("\n=== Desempenho: Fibonacci ===");

function timeFunction(fn, ...args) {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    return { result, time: end - start };
}

// Teste com um número razoavelmente grande
const n = 40;

console.log(`Fibonacci(${n}) com Memoização:`);
const memoResult = timeFunction(fibonacciMemo, n);
console.log(`Resultado: ${memoResult.result}`);
console.log(`Tempo: ${memoResult.time.toFixed(2)}ms`);

console.log(`\nFibonacci(${n}) com Tabulação:`);
const tabResult = timeFunction(fibonacciTab, n);
console.log(`Resultado: ${tabResult.result}`);
console.log(`Tempo: ${tabResult.time.toFixed(2)}ms`);
```

#### Comparação entre Memoização e Tabulação

| Aspecto               | Memoização (Top-down)                     | Tabulação (Bottom-up)                 |
|-----------------------|-------------------------------------------|---------------------------------------|
| Direção               | Do problema completo para subproblemas     | Dos subproblemas para o problema completo |
| Implementação         | Recursiva com armazenamento                | Iterativa com tabela                  |
| Subproblemas          | Calcula apenas os necessários              | Calcula todos os subproblemas         |
| Uso de memória        | Potencialmente menor (lazy)                | Pré-aloca toda a tabela              |
| Stack overflow        | Possível em problemas grandes              | Não ocorre                            |
| Rastreamento solução  | Mais complicado                            | Mais fácil                            |
| Melhor para           | Quando nem todos os estados são necessários | Quando todos os estados são necessários |

#### Exemplos Cotidianos de Programação Dinâmica

1. **Sistema GPS de Navegação**
   - Encontra o caminho mais rápido considerando todas as rotas possíveis
   - Armazena distâncias ótimas parciais (como uma tabela DP)
   - Reutiliza cálculos para segmentos comuns

2. **Sugestão de Texto Preditivo**
   - Usa DP para calcular a distância de edição entre palavras
   - Sugere correções baseadas em palavras próximas
   - Memoriza resultados para consultas frequentes

3. **Jogo de Xadrez (IA)**
   - Avalia posições usando minimax com poda alfa-beta
   - Armazena posições já avaliadas (tabela de transposição)
   - Reutiliza cálculos para sequências de movimentos comuns

#### Passos para Resolver Problemas com Programação Dinâmica

1. **Identificar a subestrutura ótima**
   - Definir a relação de recorrência (como subproblemas se relacionam)

2. **Definir a função de estado**
   - O que precisamos armazenar?
   - Quais dimensões da tabela ou chaves do mapa de memoização?

3. **Estabelecer a relação de recorrência**
   - Como calculamos a solução de um estado a partir de estados anteriores?

4. **Definir os casos base**
   - Quais são os estados mais simples cujas soluções conhecemos?

5. **Implementar a solução**
   - Top-down (memoização) ou Bottom-up (tabulação)

6. **Calcular a complexidade**
   - Tempo: geralmente, estados x trabalho por estado
   - Espaço: número de estados armazenados

#### Exemplo: Problema do Caminho de Peso Mínimo

```javascript
function minPathSum(grid) {
    if (!grid || grid.length === 0 || grid[0].length === 0) return 0;
    
    const rows = grid.length;
    const cols = grid[0].length;
    
    // Inicializa a matriz DP (podemos reutilizar a própria grid para economizar espaço)
    const dp = Array(rows).fill().map((_, i) => Array(cols).fill(0));
    
    // Caso base: célula (0,0)
    dp[0][0] = grid[0][0];
    
    // Preenche a primeira coluna
    for (let i = 1; i < rows; i++) {
        dp[i][0] = dp[i-1][0] + grid[i][0];
    }
    
    // Preenche a primeira linha
    for (let j = 1; j < cols; j++) {
        dp[0][j] = dp[0][j-1] + grid[0][j];
    }
    
    console.log("\n=== Matriz de Programação Dinâmica ===");
    console.log("Estado inicial:");
    dp.forEach(row => console.log(row.join('\t')));
    
    // Preenche o resto da matriz
    for (let i = 1; i < rows; i++) {
        for (let j = 1; j < cols; j++) {
            // Escolhe o mínimo entre vir de cima ou da esquerda
            dp[i][j] = grid[i][j] + Math.min(dp[i-1][j], dp[i][j-1]);
            
            console.log(`\nApós processar (${i},${j}):`);
            dp.forEach(row => console.log(row.join('\t')));
        }
    }
    
    // Reconstrói o caminho
    let i = rows - 1;
    let j = cols - 1;
    const path = [[i, j]];
    
    while (i > 0 || j > 0) {
        if (i === 0) {
            j--;
        } else if (j === 0) {
            i--;
        } else {
            // Escolhe o caminho de onde viemos (o menor valor)
            if (dp[i-1][j] < dp[i][j-1]) {
                i--;
            } else {
                j--;
            }
        }
        path.push([i, j]);
    }
    
    console.log("\n=== Caminho Mínimo ===");
    console.log(path.reverse().map(p => `(${p[0]},${p[1]})`).join(' → '));
    
    return dp[rows-1][cols-1];
}

// Exemplo
const grid = [
    [1, 3, 1],
    [1, 5, 1],
    [4, 2, 1]
];

console.log("\n=== Problema do Caminho de Peso Mínimo ===");
console.log("Matriz original:");
grid.forEach(row => console.log(row.join('\t')));

const minSum = minPathSum(grid);
console.log(`\nSoma do caminho mínimo: ${minSum}`);
```

#### Análise de Complexidade em Programação Dinâmica

```
Problema: Fibonacci usando DP

Complexidade de tempo:
- Recursiva sem memoização: O(2^n) ❌
- DP com memoização: O(n) ✅
- DP com tabulação: O(n) ✅

Complexidade de espaço:
- Recursiva sem memoização: O(n) (pilha)
- DP com memoização: O(n) (tabela hash)
- DP com tabulação: O(n) (array)
- DP com tabulação otimizada: O(1) ⭐ (só armazena 2 valores)
```

```
Problema: Caminho mínimo em matriz

Complexidade de tempo:
- Força bruta (todas as rotas): O(2^(n+m)) ❌
- DP: O(n*m) ✅ (onde n = linhas, m = colunas)

Complexidade de espaço:
- DP padrão: O(n*m) (toda a matriz)
- DP otimizada: O(min(n,m)) (apenas uma linha ou coluna)
```

#### Subproblemas Sobrepostos vs. Independentes

```javascript
console.log("\n=== Exemplo de Subproblemas Sobrepostos: Fibonacci ===");

function fibRecursive(n) {
    // Casos base
    if (n <= 1) return n;
    
    // Recursão simples (ineficiente)
    return fibRecursive(n-1) + fibRecursive(n-2);
}

// Contador de chamadas para ilustrar a sobreposição
let calls = 0;

function fibCount(n) {
    calls++;
    
    if (n <= 1) return n;
    return fibCount(n-1) + fibCount(n-2);
}

// Exemplo com n pequeno para não travar o programa
const testN = 10;
calls = 0;
console.log(`Fibonacci(${testN}) = ${fibCount(testN)}`);
console.log(`Número de chamadas recursivas: ${calls}`);

// Reseta contador
calls = 0;

// Versão com memoização
function fibMemoCount(n, memo = {}) {
    calls++;
    
    if (n in memo) return memo[n];
    if (n <= 1) return n;
    
    memo[n] = fibMemoCount(n-1, memo) + fibMemoCount(n-2, memo);
    return memo[n];
}

console.log(`\nFibonacci(${testN}) com memoização = ${fibMemoCount(testN)}`);
console.log(`Número de chamadas recursivas: ${calls}`);
```

#### Quando Usar Programação Dinâmica?

Procure estas características no problema:

1. **Sobreposição de subproblemas**
   - O mesmo cálculo é feito repetidamente

2. **Subestrutura ótima**
   - A solução ótima pode ser construída a partir de soluções ótimas de subproblemas

3. **Decisões interdependentes**
   - Cada decisão afeta as possibilidades futuras

#### Comparação com Algoritmos Vistos Anteriormente

A programação dinâmica se relaciona com diversos algoritmos e estruturas que estudamos:

1. **Relação com Recursão**:
   - DP é essencialmente recursão otimizada
   - Converte árvores de chamadas recursivas em estruturas mais eficientes (DAGs)

2. **Relação com Divisão e Conquista**:
   - Divisão e Conquista: divide o problema e combina resultados (subproblemas disjuntos)
   - DP: resolve e memoriza subproblemas sobrepostos

3. **Relação com Grafos**:
   - Muitos algoritmos de grafos usam DP (Floyd-Warshall, Bellman-Ford)
   - A tabela DP pode ser vista como um grafo de dependências

#### Recapitulando

1. Identifique subproblemas menores no problema original
2. Defina relação recursiva entre subproblemas
3. Resolva-os do menor para o maior (bottom-up) ou memoize (top-down)
4. Construa a solução a partir dos resultados armazenados

#### Exercício de Pensamento

Como você aplicaria programação dinâmica para resolver:
1. Encontrar a subsequência comum mais longa entre duas strings?
2. Calcular todas as maneiras de dar troco com determinadas moedas?
3. Determinar se um conjunto pode ser dividido em dois com a mesma soma? 