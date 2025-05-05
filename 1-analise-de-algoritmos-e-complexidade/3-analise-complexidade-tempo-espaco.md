# Análise de Complexidade de Tempo e Espaço

A análise de complexidade vai além da notação Big O, examinando dois aspectos fundamentais do desempenho de algoritmos:

## Complexidade de Tempo

A complexidade de tempo mede quantas operações primitivas (comparações, atribuições, operações aritméticas) um algoritmo executa em função do tamanho da entrada.

### Princípios da análise de complexidade de tempo:

1. **Identifique as operações básicas**: Determine quais são as operações fundamentais do algoritmo.
2. **Conte as execuções**: Calcule quantas vezes cada operação é executada.
3. **Considere a estrutura de controle**: Loops, condicionais e recursão afetam a contagem.
4. **Expresse em função do tamanho da entrada**: Represente a contagem em termos de n.
5. **Simplifique para a ordem dominante**: Mantenha apenas o termo de maior crescimento.

**Exemplo de análise:**

```javascript
function sumArray(arr) {
    let sum = 0;                // 1 operação (atribuição)
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];          // n operações (soma e atribuição)
    }
    return sum;                 // 1 operação (retorno)
}
```

Total: 1 + n + 1 = n + 2 operações ≈ O(n)

## Complexidade de Espaço

A complexidade de espaço mede quanta memória adicional um algoritmo utiliza, além da entrada original.

### Componentes da complexidade de espaço:

1. **Espaço Auxiliar**: Memória temporária usada durante a execução (variáveis, estruturas de dados).
2. **Espaço de Pilha**: Memória usada para chamadas de função (importante para algoritmos recursivos).

**Exemplo de análise:**

```javascript
function createMatrix(n) {
    const matrix = [];              // 1 estrutura de dados
    
    for (let i = 0; i < n; i++) {
        matrix[i] = [];             // n arrays
        for (let j = 0; j < n; j++) {
            matrix[i][j] = i * j;   // n² valores
        }
    }
    
    return matrix;
}
```

Espaço auxiliar: O(n²) - criamos uma matriz n×n

**Exemplo de recursão e uso de pilha:**

```javascript
function factorial(n) {
    // Caso base
    if (n <= 1) return 1;
    
    // Recursão
    return n * factorial(n - 1);
}
```

Complexidade de tempo: O(n)
Complexidade de espaço: O(n) - devido às n chamadas recursivas na pilha

## Análise Amortizada

A análise amortizada estuda o custo médio de uma operação em uma sequência de operações, mesmo quando algumas operações individuais podem ser caras.

### Por que a análise amortizada é importante:

- **Operações ocasionalmente caras**: Algumas estruturas de dados têm operações que ocasionalmente são caras, mas raramente ocorrem
- **Custo diluído**: O custo elevado é diluído entre várias operações de baixo custo
- **Visão realista**: Fornece uma visão mais realista da performance prática de um algoritmo

### Exemplo: ArrayList com redimensionamento

```javascript
class DynamicArray {
    constructor() {
        this.array = new Array(1);
        this.size = 0;
    }
    
    add(element) {
        // Se o array estiver cheio, redimensione
        if (this.size === this.array.length) {
            this.resize(2 * this.array.length);
        }
        
        // Adiciona o elemento
        this.array[this.size] = element;
        this.size++;
    }
    
    resize(newCapacity) {
        const newArray = new Array(newCapacity);
        
        // Copia elementos para o novo array
        for (let i = 0; i < this.size; i++) {
            newArray[i] = this.array[i];
        }
        
        this.array = newArray;
    }
}
```

**Análise:**
- A operação `add()` normalmente é O(1), mas ocasionalmente é O(n) quando ocorre redimensionamento
- Embora o redimensionamento seja caro (O(n)), ele ocorre com frequência cada vez menor
- Análise amortizada mostra que o custo de n operações `add()` é O(n), assim cada operação tem custo amortizado O(1)

### Técnicas de análise amortizada:
- **Método contábil**: Algumas operações "pagam" por operações futuras mais caras
- **Método potencial**: Usa uma função potencial para medir o "estado" da estrutura de dados
- **Método agregado**: Calcula o custo total de n operações e divide por n

## Otimização de Tempo vs. Espaço

Frequentemente enfrentamos um compromisso (trade-off) entre tempo e espaço:

**Exemplo: Cálculo de Fibonacci**

Abordagem recursiva simples:
```javascript
function fibRecursive(n) {
    if (n <= 1) return n;
    return fibRecursive(n-1) + fibRecursive(n-2);
}
```
- Tempo: O(2ⁿ) - exponencial!
- Espaço: O(n) - profundidade da recursão

Abordagem com memorização:
```javascript
function fibMemoized(n, memo = {}) {
    if (n in memo) return memo[n];
    if (n <= 1) return n;
    
    memo[n] = fibMemoized(n-1, memo) + fibMemoized(n-2, memo);
    return memo[n];
}
```
- Tempo: O(n) - calculamos cada número apenas uma vez
- Espaço: O(n) - armazenamos n resultados no objeto memo

Abordagem iterativa:
```javascript
function fibIterative(n) {
    if (n <= 1) return n;
    
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
        const temp = a + b;
        a = b;
        b = temp;
    }
    
    return b;
}
```
- Tempo: O(n) - um único loop
- Espaço: O(1) - apenas algumas variáveis, independente de n
