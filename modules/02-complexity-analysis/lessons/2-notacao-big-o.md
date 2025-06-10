# Notação Big O, Big Omega e Big Theta

Estas notações formais nos ajudam a classificar algoritmos quanto à sua eficiência:

## Notação Big O (O)
- Representa o **limite superior** do crescimento de um algoritmo
- Denota o "pior caso" ou o crescimento máximo possível
- Exemplo: quando dizemos que um algoritmo é O(n²), significa que ele nunca cresce mais rápido que n²

## Notação Big Omega (Ω)
- Representa o **limite inferior** do crescimento de um algoritmo
- Denota o "melhor caso" ou o crescimento mínimo possível
- Exemplo: quando dizemos que um algoritmo é Ω(n), significa que ele sempre cresce pelo menos tão rápido quanto n

## Notação Big Theta (Θ)
- Representa o **crescimento exato** de um algoritmo
- Usado quando os limites superior e inferior são iguais
- Exemplo: quando dizemos que um algoritmo é Θ(n²), significa que ele cresce exatamente na proporção de n²

## Tabela Visual de Complexidades Comuns

| Complexidade | Nome | Exemplo | Para n=100 | Para n=1000 |
|--------------|------|---------|------------|-------------|
| O(1) | Constante | Acesso a array | 1 operação | 1 operação |
| O(log n) | Logarítmica | Busca binária | ~7 operações | ~10 operações |
| O(n) | Linear | Busca linear | 100 operações | 1.000 operações |
| O(n log n) | Log-linear | Merge Sort | ~700 operações | ~10.000 operações |
| O(n²) | Quadrática | Bubble Sort | 10.000 operações | 1.000.000 operações |
| O(2ⁿ) | Exponencial | Fibonacci recursivo | 2¹⁰⁰ (impossível) | 2¹⁰⁰⁰ (impossível) |

## Armadilhas Comuns na Análise Big O

1. **Confundir melhor caso com complexidade real**: A complexidade Big O refere-se ao limite superior (pior caso), não ao desempenho típico.

2. **Ignorar constantes prematuramente**: Embora simplifiquemos O(2n) para O(n), as constantes importam em contextos práticos.

3. **Esquecer complexidade de espaço**: Análise de complexidade não é só sobre tempo, mas também sobre uso de memória.

4. **Negligenciar operações ocultas**: Operações como `array.includes()` podem esconder complexidades O(n).

5. **Focar apenas em código explícito**: Algumas linguagens e frameworks incluem otimizações ou penalidades que afetam a complexidade real.

## Categorias Comuns de Complexidade

Em ordem crescente de complexidade:

1. **O(1)** - Complexidade constante
   - Tempo de execução não depende do tamanho da entrada
   - Exemplo: acessar um elemento de array por índice

2. **O(log n)** - Complexidade logarítmica
   - Cresce muito lentamente conforme a entrada aumenta
   - Exemplo: busca binária em um array ordenado

3. **O(n)** - Complexidade linear
   - Tempo de execução cresce proporcionalmente ao tamanho da entrada
   - Exemplo: percorrer um array uma vez

4. **O(n log n)** - Complexidade linearítmica
   - Exemplo: algoritmos de ordenação eficientes como Merge Sort e Quick Sort

5. **O(n²)** - Complexidade quadrática
   - Exemplo: loops aninhados, algoritmos de ordenação simples (Bubble Sort)

6. **O(2^n)** - Complexidade exponencial
   - Cresce extremamente rápido
   - Exemplo: solução recursiva para o problema de Fibonacci sem memorização

## Exemplo de Análise:

```javascript
function sumAllPairs(arr) {
    const n = arr.length;
    let sum = 0;
    
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            sum += arr[i] * arr[j];
        }
    }
    
    return sum;
}
```

Este algoritmo tem complexidade O(n²) porque:
1. Temos dois loops aninhados, onde ambos executam `n` vezes
2. A operação básica (multiplicação e adição) dentro do loop interno é executada `n × n = n²` vezes
3. Independentemente dos valores no array, sempre executamos esse número fixo de operações
4. O tempo de execução cresce quadraticamente com o tamanho da entrada
