# Introdução a Algoritmos Avançados de Ordenação e Busca

## 🎯 Objetivos de Aprendizagem

- Compreender algoritmos avançados de ordenação e suas otimizações
- Dominar algoritmos de busca em texto eficientes
- Analisar e comparar a complexidade de diferentes algoritmos
- Aplicar o algoritmo correto para cada cenário de problema
- Implementar soluções híbridas e otimizadas

## 📚 Conexão com Módulos Anteriores

Este módulo expande seu conhecimento de estruturas de dados e algoritmos:

- **Módulo 2 (Estruturas Lineares)**: Utilizaremos arrays, listas, pilhas e filas como base para implementar algoritmos eficientes de ordenação e busca.
  
- **Módulo 3 (Estruturas Hierárquicas)**: Aplicaremos conhecimentos de árvores binárias e heaps para implementar Heap Sort e entender estruturas de indexação.

## 🗺️ Mapa de Aprendizado do Módulo

```
┌─────────────────────────┐
│ 1. Merge Sort/Quick Sort│
│    Dividir e Conquistar │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ 2. Heap Sort/Aplicações │
│    Estruturas Heap      │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ 3. Radix/Bucket Sort    │
│    Ordenação Não-Comp.  │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ 4. Algoritmos de Busca  │
│    KMP e Boyer-Moore    │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ 5. Exercícios Práticos  │
│    Aplicações Integradas│
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ 6. Case Study           │
│    Sistema de Benchmark │
└─────────────────────────┘
```

## 🚀 Comparativo de Algoritmos

| Algoritmo     | Melhor Caso  | Caso Médio    | Pior Caso    | Espaço     | Estável | In-Place |
|---------------|--------------|---------------|--------------|------------|---------|----------|
| Quick Sort    | O(n log n)   | O(n log n)    | O(n²)        | O(log n)   | Não     | Sim      |
| Merge Sort    | O(n log n)   | O(n log n)    | O(n log n)   | O(n)       | Sim     | Não      |
| Heap Sort     | O(n log n)   | O(n log n)    | O(n log n)   | O(1)       | Não     | Sim      |
| Radix Sort    | O(d·(n+k))   | O(d·(n+k))    | O(d·(n+k))   | O(n+k)     | Sim     | Não      |
| Bucket Sort   | O(n+k)       | O(n+k)        | O(n²)        | O(n+k)     | Sim     | Não      |
| KMP           | O(n+m)       | O(n+m)        | O(n+m)       | O(m)       | -       | -        |
| Boyer-Moore   | O(n/m)       | O(n)          | O(n·m)       | O(k)       | -       | -        |

*n = tamanho da entrada, m = tamanho do padrão, d = número de dígitos, k = range de valores*

## 🧠 Quando Usar Cada Algoritmo?

```
┌─────────────┐     Valores Inteiros     ┌───────────────┐
│ Muitos dados├────em intervalo limitado─►│ Radix Sort    │
└─────────────┘                          └───────────────┘
      │
      │ Outros tipos
      ▼
┌─────────────┐     Espaço limitado      ┌───────────────┐
│ Dados quase ├────────────────────────►│ Quick Sort     │
│ ordenados   │                          └───────────────┘
└─────────────┘
      │
      │ Garantia de pior caso
      ▼
┌─────────────┐                          ┌───────────────┐
│ Estabilidade├─────────────────────────►│ Merge Sort    │
│ necessária  │                          └───────────────┘
└─────────────┘
      │
      │ Memória limitada
      ▼
┌─────────────┐                          ┌───────────────┐
│ Performance ├─────────────────────────►│ Heap Sort     │
│ consistente │                          └───────────────┘
└─────────────┘
```

## 📋 Pré-requisitos Recomendados

- Compreensão básica de complexidade de algoritmos (Big O)
- Familiaridade com recursão e funções de ordem superior
- Experiência com implementação de estruturas de dados básicas

## 🛠️ Como Aproveitar Este Módulo

1. **Estude sequencialmente**: Cada tópico se baseia no anterior
2. **Implemente todos os algoritmos**: Pratique digitando o código
3. **Compare as implementações**: Observe as diferenças e trade-offs
4. **Visualize a execução**: Use os exemplos visuais para entender o fluxo
5. **Resolva os exercícios**: Comece com os básicos e avance progressivamente

Vamos começar nossa jornada pelos algoritmos avançados de ordenação e busca! 