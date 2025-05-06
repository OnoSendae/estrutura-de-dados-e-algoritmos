# Algoritmos e Estrutura de Dados na Prática

## Módulo 6: Algoritmos Gulosos e Programação Dinâmica

### 5. Problemas Clássicos de Programação Dinâmica

Nesta aula, exploraremos implementações detalhadas de problemas clássicos que são resolvidos de forma eficiente utilizando programação dinâmica.

#### Problema da Mochila 0/1 (Knapsack Problem)

O problema da mochila 0/1 é mais desafiador que a versão fracionária, pois cada item deve ser incluído inteiramente ou deixado de fora - não podemos pegar frações.

##### Definição do Problema:
- Temos n itens, cada um com peso `w[i]` e valor `v[i]`
- Uma mochila com capacidade máxima W
- Queremos maximizar o valor total dos itens na mochila sem exceder a capacidade

##### Solução com Programação Dinâmica:

1. **Estado**: `dp[i][w]` representa o valor máximo que podemos obter considerando os primeiros `i` itens e peso máximo `w`
2. **Transição**: Para cada item, temos duas opções: incluir ou não incluir
   - `dp[i][w] = max(dp[i-1][w], dp[i-1][w-w[i]] + v[i])`
3. **Resultado final**: `dp[n][W]`

```
Visualização da tabela DP para mochila:

Itens: [{ peso: 2, valor: 3 }, { peso: 3, valor: 4 }, { peso: 4, valor: 5 }, { peso: 5, valor: 6 }]
Capacidade: 8

Tabela DP:
         Capacidade (peso)
       | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
------+---+---+---+---+---+---+---+---+---+
Itens  | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | Item 0 (base)
------+---+---+---+---+---+---+---+---+---+
Item 1 | 0 | 0 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | w=2, v=3
------+---+---+---+---+---+---+---+---+---+
Item 2 | 0 | 0 | 3 | 4 | 4 | 7 | 7 | 7 | 7 | w=3, v=4 
------+---+---+---+---+---+---+---+---+---+
Item 3 | 0 | 0 | 3 | 4 | 5 | 7 | 8 | 9 | 9 | w=4, v=5
------+---+---+---+---+---+---+---+---+---+
Item 4 | 0 | 0 | 3 | 4 | 5 | 7 | 8 | 9 | 10| w=5, v=6
------+---+---+---+---+---+---+---+---+---+
                                        ^ Resultado final: 10

Caminho da solução (rastreando a tabela de trás para frente):
1. dp[4][8] = 10 ≠ dp[3][8] = 9 → Incluir Item 4, Capacidade restante: 8-5 = 3
2. dp[3][3] = 4 = dp[2][3] = 4 → Não incluir Item 3, Capacidade: 3
3. dp[2][3] = 4 ≠ dp[1][3] = 3 → Incluir Item 2, Capacidade restante: 3-3 = 0
4. dp[1][0] = 0 = dp[0][0] = 0 → Não incluir Item 1, Capacidade: 0

Resultado: Itens 2 e 4, Valor total: 10
```

```javascript
function knapsack01(weights, values, capacity) {
    const n = weights.length;
    
    // Cria matriz dp[i][w] onde i é o item e w é o peso
    const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
    
    // Rastreamento de quais itens são escolhidos
    const itemsIncluded = Array(n + 1).fill().map(() => Array(capacity + 1).fill(false));
    
    console.log("\n=== Problema da Mochila 0/1 ===");
    console.log("Item\tPeso\tValor");
    
    for (let i = 0; i < n; i++) {
        console.log(`${i+1}\t${weights[i]}\t${values[i]}`);
    }
    
    console.log("\nResolvendo com programação dinâmica...");
    console.log("Tabela DP: [linhas=itens, colunas=pesos]");
    
    // Construção da tabela DP
    for (let i = 1; i <= n; i++) {
        for (let w = 0; w <= capacity; w++) {
            // Se o item atual for pesado demais para a capacidade atual
            if (weights[i-1] > w) {
                dp[i][w] = dp[i-1][w]; // Pegamos o valor do item anterior
            } else {
                // Decidimos se é melhor incluir o item atual ou não
                const withoutCurrent = dp[i-1][w];
                const withCurrent = dp[i-1][w - weights[i-1]] + values[i-1];
                
                if (withCurrent > withoutCurrent) {
                    dp[i][w] = withCurrent;
                    itemsIncluded[i][w] = true;
                } else {
                    dp[i][w] = withoutCurrent;
                }
            }
        }
        
        // Visualização do progresso após processar cada item
        console.log(`\nApós processar item ${i} (peso=${weights[i-1]}, valor=${values[i-1]}):`);
        for (let row = 0; row <= i; row++) {
            console.log(`[${dp[row].slice(0, capacity + 1).join(', ')}]`);
        }
    }
    
    // Imprime a tabela DP (formatada para legibilidade)
    console.log("\nTabela DP final:");
    
    // Cabeçalho da tabela (pesos)
    let header = "Item/Peso";
    for (let w = 0; w <= capacity; w++) {
        header += `\t${w}`;
    }
    console.log(header);
    
    // Conteúdo da tabela
    for (let i = 0; i <= n; i++) {
        let row = `${i}`;
        for (let w = 0; w <= capacity; w++) {
            row += `\t${dp[i][w]}`;
        }
        console.log(row);
    }
    
    // Reconstrução da solução
    let remainingCapacity = capacity;
    const selectedItems = [];
    
    console.log("\nReconstrução da solução (rastreando a tabela):");
    
    for (let i = n; i > 0; i--) {
        if (itemsIncluded[i][remainingCapacity]) {
            console.log(`dp[${i}][${remainingCapacity}] = ${dp[i][remainingCapacity]} ≠ dp[${i-1}][${remainingCapacity}] = ${dp[i-1][remainingCapacity]} → Incluir Item ${i}`);
            selectedItems.push(i-1);
            remainingCapacity -= weights[i-1];
        } else {
            console.log(`dp[${i}][${remainingCapacity}] = ${dp[i][remainingCapacity]} = dp[${i-1}][${remainingCapacity}] = ${dp[i-1][remainingCapacity]} → Não incluir Item ${i}`);
        }
    }
    
    console.log("\nItens selecionados:");
    selectedItems.reverse().forEach(idx => {
        console.log(`Item ${idx+1}: Peso=${weights[idx]}, Valor=${values[idx]}`);
    });
    
    console.log(`\nValor total: ${dp[n][capacity]}`);
    console.log(`Peso total: ${weights.filter((_, i) => selectedItems.includes(i)).reduce((a, b) => a + b, 0)}`);
    
    return {
        maxValue: dp[n][capacity],
        selectedItems: selectedItems.map(i => ({ index: i, weight: weights[i], value: values[i] }))
    };
}

// Exemplo de uso
const weights = [2, 3, 4, 5];
const values = [3, 4, 5, 6];
const capacity = 8;

knapsack01(weights, values, capacity);
```

##### Otimização de Espaço:

Podemos otimizar o espaço utilizando apenas uma linha da tabela DP, já que cada estado depende apenas da linha anterior.

```javascript
function knapsack01Optimized(weights, values, capacity) {
    const n = weights.length;
    
    // Usamos apenas um array 1D
    const dp = Array(capacity + 1).fill(0);
    
    console.log("\n=== Versão Otimizada (Espaço O(W)) ===");
    
    // Construção da tabela DP
    for (let i = 0; i < n; i++) {
        console.log(`\nProcessando item ${i+1} (Peso=${weights[i]}, Valor=${values[i]}):`);
        
        // Percorremos a tabela de trás para frente para evitar reutilizar o mesmo item
        for (let w = capacity; w >= weights[i]; w--) {
            // Decidir entre incluir ou não o item atual
            dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
        }
        
        // Imprime estado atual da tabela
        let state = "Capacidade:";
        for (let w = 0; w <= capacity; w++) {
            state += `\t${w}`;
        }
        console.log(state);
        
        state = "Valor máx:";
        for (let w = 0; w <= capacity; w++) {
            state += `\t${dp[w]}`;
        }
        console.log(state);
    }
    
    console.log(`\nValor máximo otimizado: ${dp[capacity]}`);
    return dp[capacity];
}

// Exemplo com os mesmos dados
knapsack01Optimized(weights, values, capacity);
```

#### Maior Subsequência Comum (LCS)

A Maior Subsequência Comum é um problema clássico que consiste em encontrar a maior subsequência comum a duas sequências.

##### Definição do Problema:
- Dadas duas sequências X e Y
- Encontrar a maior subsequência comum Z, onde Z é uma subsequência tanto de X quanto de Y

```
Exemplo visual:
X = "ABCBDAB"
Y = "BDCABA"

Subsequência Comum: "BDAB" (comprimento 4)

Etapas da construção da tabela DP:
     |   | B | D | C | A | B | A |
-----+---+---+---+---+---+---+---+
     | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
-----+---+---+---+---+---+---+---+
A    | 0 | 0 | 0 | 0 | 1 | 1 | 1 |
-----+---+---+---+---+---+---+---+
B    | 0 | 1 | 1 | 1 | 1 | 2 | 2 |
-----+---+---+---+---+---+---+---+
C    | 0 | 1 | 1 | 2 | 2 | 2 | 2 |
-----+---+---+---+---+---+---+---+
B    | 0 | 1 | 1 | 2 | 2 | 3 | 3 |
-----+---+---+---+---+---+---+---+
D    | 0 | 1 | 2 | 2 | 2 | 3 | 3 |
-----+---+---+---+---+---+---+---+
A    | 0 | 1 | 2 | 2 | 3 | 3 | 4 |
-----+---+---+---+---+---+---+---+
B    | 0 | 1 | 2 | 2 | 3 | 4 | 4 |
-----+---+---+---+---+---+---+---+
                              ^ Resultado final: 4
```

```javascript
function longestCommonSubsequence(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    
    // Cria uma matriz (m+1) x (n+1)
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    
    console.log("\n=== Maior Subsequência Comum (LCS) ===");
    console.log(`String 1: "${str1}"`);
    console.log(`String 2: "${str2}"`);
    
    // Constrói a tabela DP
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                // Se caracteres atuais são iguais, estende a LCS
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                // Caso contrário, pega o máximo das outras opções
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
        
        // Visualiza o estado após processar cada linha
        console.log(`\nApós processar '${str1[i-1]}' (linha ${i}):`);
        
        // Cabeçalho
        let header = "    |   ";
        for (let j = 0; j < n; j++) {
            header += `| ${str2[j]} `;
        }
        console.log(header);
        
        // Linha separadora
        console.log("----+---" + "-+--".repeat(n));
        
        // Primeira linha (base)
        let firstRow = "    | 0 ";
        for (let j = 1; j <= n; j++) {
            firstRow += `| ${dp[0][j]} `;
        }
        
        // Imprime linhas processadas até agora
        if (i === 1) {
            console.log(firstRow);
        }
        
        for (let k = 1; k <= i; k++) {
            let row = "";
            if (k === 1) {
                row = "    ";
            } else {
                row = `${str1[k-1]} `;
            }
            row += `| ${dp[k][0]} `;
            
            for (let j = 1; j <= n; j++) {
                row += `| ${dp[k][j]} `;
            }
            console.log(row);
        }
    }
    
    // Reconstrói a LCS
    let i = m, j = n;
    const lcs = [];
    
    while (i > 0 && j > 0) {
        if (str1[i - 1] === str2[j - 1]) {
            lcs.push(str1[i - 1]);
            i--;
            j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }
    
    lcs.reverse();
    
    console.log(`\nMaior subsequência comum: "${lcs.join('')}" (comprimento ${dp[m][n]})`);
    return {
        length: dp[m][n],
        subsequence: lcs.join('')
    };
}

// Exemplo
const str1 = "ABCBDAB";
const str2 = "BDCABA";
longestCommonSubsequence(str1, str2);
```

#### Sequência de Fibonacci com Programação Dinâmica

Já vimos exemplos básicos da sequência de Fibonacci, mas vamos explorar isso mais profundamente e comparar diferentes abordagens.

##### Definição:
- F(0) = 0
- F(1) = 1
- F(n) = F(n-1) + F(n-2) para n > 1

##### Implementações:

```javascript
console.log("\n=== Comparação de Abordagens para Fibonacci ===");

// 1. Recursivo (ineficiente)
function fibRecursive(n) {
    if (n <= 1) return n;
    return fibRecursive(n-1) + fibRecursive(n-2);
}

// 2. Memoização (top-down)
function fibMemoization(n, memo = {}) {
    if (n in memo) return memo[n];
    if (n <= 1) return n;
    
    memo[n] = fibMemoization(n-1, memo) + fibMemoization(n-2, memo);
    return memo[n];
}

// 3. Tabulação (bottom-up)
function fibTabulation(n) {
    if (n <= 1) return n;
    
    const dp = Array(n+1).fill(0);
    dp[1] = 1;
    
    console.log("\nConstrução da tabela para Fibonacci:");
    console.log(`Inicialmente: [${dp.slice(0, Math.min(n+1, 10)).join(', ')}${n > 10 ? ', ...' : ''}]`);
    
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
        if (i < 10 || i === n) {
            console.log(`Após F(${i}): [${dp.slice(0, Math.min(i+1, 10)).join(', ')}${i > 10 ? ', ..., ' + dp[i] : ''}]`);
        } else if (i === 10) {
            console.log("...");
        }
    }
    
    return dp[n];
}

// 4. Otimização de espaço
function fibOptimized(n) {
    if (n <= 1) return n;
    
    let prev = 0;
    let current = 1;
    
    console.log("\nFibonacci com espaço otimizado:");
    console.log(`F(0) = ${prev}, F(1) = ${current}`);
    
    for (let i = 2; i <= n; i++) {
        const next = prev + current;
        prev = current;
        current = next;
        
        if (i < 10 || i === n) {
            console.log(`F(${i}) = ${current}`);
        } else if (i === 10) {
            console.log("...");
        }
    }
    
    return current;
}

// Função para medir performance
function measurePerformance(fn, ...args) {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    return { result, time: end - start };
}

// Teste com valores incrementalmente maiores
const testValues = [10, 20, 30, 40];

for (const n of testValues) {
    console.log(`\nCalculando Fibonacci(${n}):`);
    
    // Recursivo (só testar para valores pequenos)
    if (n <= 30) {
        const recursiveResult = measurePerformance(fibRecursive, n);
        console.log(`Recursivo: ${recursiveResult.result} (${recursiveResult.time.toFixed(2)}ms)`);
    } else {
        console.log("Recursivo: [Muito lento para este valor]");
    }
    
    // Memoização
    const memoResult = measurePerformance(fibMemoization, n);
    console.log(`Memoização: ${memoResult.result} (${memoResult.time.toFixed(2)}ms)`);
    
    // Tabulação
    const tabResult = measurePerformance(fibTabulation, n);
    console.log(`Tabulação: ${tabResult.result} (${tabResult.time.toFixed(2)}ms)`);
    
    // Otimizado
    const optResult = measurePerformance(fibOptimized, n);
    console.log(`Otimizado: ${optResult.result} (${optResult.time.toFixed(2)}ms)`);
}
```

#### Subproblema Adicional: Soma de Subconjunto

O problema da Soma de Subconjunto consiste em determinar se um subconjunto de um conjunto dado tem soma igual a um valor alvo.

```
Exemplo Visual:
Conjunto: [3, 34, 4, 12, 5, 2]
Soma alvo: 9

Construção da tabela DP:
     |  0|  1|  2|  3|  4|  5|  6|  7|  8|  9| <- Somas alvo
-----+---+---+---+---+---+---+---+---+---+---+
Vazio| ✓ |   |   |   |   |   |   |   |   |   | Base: Podemos formar soma 0 com conjunto vazio
-----+---+---+---+---+---+---+---+---+---+---+
3    | ✓ |   |   | ✓ |   |   |   |   |   |   | Após considerar elemento 3
-----+---+---+---+---+---+---+---+---+---+---+
34   | ✓ |   |   | ✓ |   |   |   |   |   |   | 34 > 9, nenhuma mudança
-----+---+---+---+---+---+---+---+---+---+---+
4    | ✓ |   |   | ✓ | ✓ |   |   | ✓ |   |   | Após considerar elemento 4
-----+---+---+---+---+---+---+---+---+---+---+
12   | ✓ |   |   | ✓ | ✓ |   |   | ✓ |   |   | 12 > 9, nenhuma mudança
-----+---+---+---+---+---+---+---+---+---+---+
5    | ✓ |   |   | ✓ | ✓ | ✓ |   | ✓ | ✓ | ✓ | Após considerar elemento 5
-----+---+---+---+---+---+---+---+---+---+---+
2    | ✓ |   | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Após considerar elemento 2
-----+---+---+---+---+---+---+---+---+---+---+
                                      ^ Resultado: Possível (✓)
```

```javascript
function subsetSum(nums, target) {
    const n = nums.length;
    
    // Cria uma tabela DP de tamanho (n+1) x (target+1)
    const dp = Array(n + 1).fill().map(() => Array(target + 1).fill(false));
    
    // Caso base: podemos sempre formar a soma 0 com um conjunto vazio
    for (let i = 0; i <= n; i++) {
        dp[i][0] = true;
    }
    
    console.log("\n=== Problema da Soma de Subconjunto ===");
    console.log(`Conjunto: [${nums.join(', ')}]`);
    console.log(`Soma alvo: ${target}`);
    
    // Preenche a tabela DP
    for (let i = 1; i <= n; i++) {
        const num = nums[i - 1];
        
        for (let j = 1; j <= target; j++) {
            if (num > j) {
                // Se o número atual é maior que a soma, não o incluímos
                dp[i][j] = dp[i - 1][j];
            } else {
                // Caso contrário, verificamos se podemos formar a soma com ou sem o número atual
                dp[i][j] = dp[i - 1][j] || dp[i - 1][j - num];
            }
        }
        
        // Visualização após processar cada elemento
        console.log(`\nApós considerar elemento ${num}:`);
        
        // Imprime cabeçalho
        let header = "     |";
        for (let j = 0; j <= target; j++) {
            header += ` ${j.toString().padStart(2)}|`;
        }
        console.log(header);
        
        // Imprime separador
        let separator = "-----+";
        for (let j = 0; j <= target; j++) {
            separator += "---+";
        }
        console.log(separator);
        
        // Imprime cada linha até o elemento atual
        for (let k = 0; k <= i; k++) {
            let row = "";
            if (k === 0) {
                row = "Vazio";
            } else {
                row = nums[k - 1].toString().padStart(5);
            }
            row += "|";
            
            for (let j = 0; j <= target; j++) {
                row += ` ${dp[k][j] ? '✓' : ' '} |`;
            }
            console.log(row);
            console.log(separator);
        }
    }
    
    // Verifica se é possível formar a soma alvo
    const result = dp[n][target];
    console.log(`\nResultado: ${result ? 'Possível formar a soma' : 'Impossível formar a soma'}`);
    
    // Se for possível, encontra um dos subconjuntos que forma a soma
    if (result) {
        const subset = [];
        let i = n, j = target;
        
        while (i > 0 && j > 0) {
            if (dp[i][j] !== dp[i - 1][j]) {
                subset.push(nums[i - 1]);
                j -= nums[i - 1];
            }
            i--;
        }
        
        console.log(`Um subconjunto possível: [${subset.join(', ')}]`);
    }
    
    return result;
}

// Exemplo
const nums = [3, 34, 4, 12, 5, 2];
const target = 9;
subsetSum(nums, target);
```

### Comparação Visual: Recursão vs. Programação Dinâmica

Para ilustrar a diferença de eficiência entre uma solução recursiva ingênua e uma solução de programação dinâmica, vamos visualizar as chamadas para calcular Fibonacci:

```
Fibonacci Recursivo (sem DP):
                    fib(5)
                /           \
            fib(4)          fib(3)
           /      \        /     \
       fib(3)     fib(2) fib(2)   fib(1)
      /     \     /    \  /    \
  fib(2)  fib(1) f(1) f(0) f(1) f(0)
 /     \
f(1)  f(0)

Observe as chamadas duplicadas: fib(3) calculado 2x, fib(2) calculado 3x!


Fibonacci com Memoização:
                    fib(5) [Calcula]
                /           \
            fib(4) [Calcula] fib(3) [Já calculado, retorna resultado]
           /      \         
       fib(3) [Calcula]     fib(2) [Já calculado, retorna resultado]
      /     \     
  fib(2) [Calcula]  fib(1) [Base]
 /     \
f(1)   f(0)
[Base] [Base]

Cada subproblema é calculado apenas uma vez!
```

#### Conclusão

A programação dinâmica é uma técnica poderosa para resolver problemas com subproblemas sobrepostos e subestrutura ótima. Ela pode transformar soluções exponenciais em polinomiais, como vimos nos exemplos acima.

### Exercícios Práticos

1. Implemente o algoritmo para encontrar a sequência de Fibonacci utilizando as três abordagens discutidas (recursiva, memoização e tabulação), e compare seus desempenhos.

2. Resolva o problema da distância de edição (Levenshtein distance) entre duas strings usando programação dinâmica.

3. Implemente uma solução para o problema do caminho de peso mínimo em um grafo direcionado acíclico. 