

## Módulo 7: Tópicos Avançados e Aplicações

### 1. Árvores de Segmentos e Árvores de Fenwick

Nesta aula, exploraremos duas estruturas de dados avançadas projetadas para resolver problemas de consulta e atualização em intervalos de forma eficiente: **Árvores de Segmentos (Segment Trees)** e **Árvores de Fenwick (Binary Indexed Trees)**. Estas estruturas são essenciais em competições de programação e em aplicações reais que envolvem processamento de dados em grandes conjuntos.

#### Conexão com Estruturas Anteriores

As Árvores de Segmentos e Fenwick expandem conceitos que já estudamos:
- Utilizam princípios recursivos como as **árvores binárias** (Módulo 3)
- Resolvem problemas de intervalo que seriam ineficientes com **arrays** simples (Módulo 2)
- Oferecem operações de consulta eficientes similares às **tabelas hash** (Módulo 5)

#### Analogia Introdutória: Sistema de Gerenciamento de Território 🏙️

Imagine um prefeito que precisa obter rapidamente informações (como população total, receita média, etc.) sobre qualquer região da cidade, e também atualizar esses dados quando necessário.

**Abordagem Ingênua:**
- Manter um grande banco de dados com informações de cada bairro
- Para consultar uma região: somar/agregar dados de todos os bairros daquela região
- Para atualizar: modificar o registro de um bairro específico

**Problema:** Consultar uma região grande é muito lento (complexidade O(n))

**Solução Eficiente:**
- **Árvore de Segmentos:** Pré-calcular e armazenar informações para diferentes níveis de regiões, permitindo consultas e atualizações rápidas
- **Árvore de Fenwick:** Uma versão mais compacta que também permite operações rápidas, utilizando propriedades de representação binária

## Parte 1: Árvores de Segmentos

### Conceito Básico

Uma Árvore de Segmentos é uma estrutura de dados em forma de árvore que permite:
- Consultar valores agregados (soma, mínimo, máximo, etc.) em qualquer intervalo do array
- Atualizar elementos individuais e propagar as mudanças automaticamente

Sua principal característica é a capacidade de realizar ambas as operações em tempo **O(log n)**.

### Representação Visual

Considere o array `[1, 5, 3, 5, 4, 6, 5, 7]`, a árvore de segmentos correspondente seria:

```
                    [0-7] (Soma: 36)
                    /         \
          [0-3] (Soma: 14)     [4-7] (Soma: 22)
           /        \             /        \
    [0-1] (6)    [2-3] (8)   [4-5] (10)   [6-7] (12)
     /    \       /    \       /    \       /    \
  [0](1) [1](5) [2](3) [3](5) [4](4) [5](6) [6](5) [7](7)
```

Cada nó representa um intervalo [i-j] e armazena a soma dos elementos neste intervalo.

### Implementação

```javascript
class SegmentTree {
    constructor(array) {
        this.n = array.length;
        // O tamanho da árvore é aproximadamente 4 vezes o tamanho do array original
        this.tree = new Array(4 * this.n).fill(0);
        if (this.n > 0) {
            this.build(array, 1, 0, this.n - 1);
        }
    }
    
    // Constrói a árvore de segmentos
    build(array, node, start, end) {
        // Caso base: folha
        if (start === end) {
            this.tree[node] = array[start];
            return;
        }
        
        // Dividir o intervalo ao meio
        const mid = Math.floor((start + end) / 2);
        
        // Construir recursivamente as subárvores esquerda e direita
        this.build(array, 2 * node, start, mid);
        this.build(array, 2 * node + 1, mid + 1, end);
        
        // O valor do nó atual é a soma dos valores dos filhos
        this.tree[node] = this.tree[2 * node] + this.tree[2 * node + 1];
    }
    
    // Atualiza um valor no array original e propaga a mudança na árvore
    update(index, newValue, node = 1, start = 0, end = this.n - 1) {
        // Caso base: folha correspondente ao índice
        if (start === end) {
            this.tree[node] = newValue;
            return;
        }
        
        const mid = Math.floor((start + end) / 2);
        
        // Atualizar a subárvore apropriada
        if (index <= mid) {
            this.update(index, newValue, 2 * node, start, mid);
        } else {
            this.update(index, newValue, 2 * node + 1, mid + 1, end);
        }
        
        // Atualizar o valor do nó atual após as mudanças nos filhos
        this.tree[node] = this.tree[2 * node] + this.tree[2 * node + 1];
    }
    
    // Consulta a soma em um intervalo [left, right]
    querySum(left, right, node = 1, start = 0, end = this.n - 1) {
        // Caso 1: Intervalo completamente fora do nó atual
        if (right < start || left > end) {
            return 0;
        }
        
        // Caso 2: Intervalo atual completamente contido no intervalo da consulta
        if (left <= start && end <= right) {
            return this.tree[node];
        }
        
        // Caso 3: Sobreposição parcial, precisamos consultar ambas as subárvores
        const mid = Math.floor((start + end) / 2);
        const leftSum = this.querySum(left, right, 2 * node, start, mid);
        const rightSum = this.querySum(left, right, 2 * node + 1, mid + 1, end);
        
        return leftSum + rightSum;
    }
    
    // Método para visualizar a árvore (para fins didáticos)
    printTree() {
        console.log("Representação da Árvore de Segmentos:");
        
        let level = 1;
        let nodesAtLevel = 1;
        
        for (let i = 1; i < this.tree.length; i++) {
            if (this.tree[i] !== 0 || i <= 2 * this.n) {
                process.stdout.write(`[${this.tree[i]}] `);
            }
            
            if (i === nodesAtLevel) {
                console.log(); // Nova linha
                level++;
                nodesAtLevel += Math.pow(2, level - 1);
            }
        }
    }
}

// Exemplo de uso
const array = [1, 5, 3, 5, 4, 6, 5, 7];
const segTree = new SegmentTree(array);

console.log("Array original:", array);
console.log("Soma do intervalo [1, 3]:", segTree.querySum(1, 3)); // Deve retornar 13 (5+3+5)
segTree.update(2, 10); // Atualiza o elemento no índice 2 para 10
console.log("Soma do intervalo [1, 3] após atualização:", segTree.querySum(1, 3)); // Deve retornar 20 (5+10+5)

// Visualizar a estrutura da árvore
segTree.printTree();
```

### Variação: Árvore de Segmentos para Mínimo/Máximo

Podemos facilmente adaptar a árvore de segmentos para encontrar o mínimo ou máximo em um intervalo:

```javascript
// Exemplo para encontrar o mínimo em um intervalo
class MinSegmentTree {
    constructor(array) {
        this.n = array.length;
        this.tree = new Array(4 * this.n).fill(Infinity);
        if (this.n > 0) {
            this.build(array, 1, 0, this.n - 1);
        }
    }
    
    build(array, node, start, end) {
        if (start === end) {
            this.tree[node] = array[start];
            return;
        }
        
        const mid = Math.floor((start + end) / 2);
        this.build(array, 2 * node, start, mid);
        this.build(array, 2 * node + 1, mid + 1, end);
        
        // O valor do nó é o mínimo dos valores dos filhos
        this.tree[node] = Math.min(this.tree[2 * node], this.tree[2 * node + 1]);
    }
    
    update(index, newValue, node = 1, start = 0, end = this.n - 1) {
        if (start === end) {
            this.tree[node] = newValue;
            return;
        }
        
        const mid = Math.floor((start + end) / 2);
        
        if (index <= mid) {
            this.update(index, newValue, 2 * node, start, mid);
        } else {
            this.update(index, newValue, 2 * node + 1, mid + 1, end);
        }
        
        this.tree[node] = Math.min(this.tree[2 * node], this.tree[2 * node + 1]);
    }
    
    queryMin(left, right, node = 1, start = 0, end = this.n - 1) {
        if (right < start || left > end) {
            return Infinity;
        }
        
        if (left <= start && end <= right) {
            return this.tree[node];
        }
        
        const mid = Math.floor((start + end) / 2);
        const leftMin = this.queryMin(left, right, 2 * node, start, mid);
        const rightMin = this.queryMin(left, right, 2 * node + 1, mid + 1, end);
        
        return Math.min(leftMin, rightMin);
    }
}

// Exemplo de uso
const arr = [3, 1, 4, 1, 5, 9, 2, 6];
const minTree = new MinSegmentTree(arr);

console.log("\nArray para MinSegmentTree:", arr);
console.log("Mínimo no intervalo [2, 5]:", minTree.queryMin(2, 5)); // Deve retornar 1
minTree.update(3, 8); // Atualiza o elemento no índice 3 para 8
console.log("Mínimo no intervalo [2, 5] após atualização:", minTree.queryMin(2, 5)); // Deve retornar 4
```

### Complexidade

- **Construção da árvore:** O(n)
- **Consulta:** O(log n)
- **Atualização:** O(log n)
- **Espaço:** O(n)

## Parte 2: Árvores de Fenwick (Binary Indexed Trees)

### Conceito

A Árvore de Fenwick (também conhecida como Binary Indexed Tree ou BIT) é uma estrutura de dados que:
- Suporta consultas de soma prefixada eficientes
- Permite atualizações eficientes de elementos individuais
- Utiliza muito menos espaço que uma Árvore de Segmentos

A principal vantagem da BIT é sua simplicidade e eficiência de memória, enquanto mantém operações em O(log n).

### Como Funciona

A BIT aproveita a representação binária dos índices para determinar quais intervalos cada nó cobre:
- Cada índice `i` é responsável por armazenar a soma de elementos em um intervalo específico
- O tamanho desse intervalo é determinado pelo último bit 1 na representação binária de `i`

Por exemplo, para o índice 6 (110 em binário):
- O último bit 1 está na posição 2 (contando da direita)
- Portanto, o nó 6 armazena a soma dos 2 elementos: A[5] + A[6]

### Operações Importantes

1. **LSB (Least Significant Bit)**: Encontra o bit 1 menos significativo
2. **Soma Prefixada**: Calcula a soma de A[1] até A[i]
3. **Atualização**: Adiciona um valor a A[i] e atualiza todos os nós afetados

### Implementação

```javascript
class FenwickTree {
    constructor(size) {
        // Usamos índices 1-based para simplificar o cálculo do LSB
        this.size = size;
        this.tree = new Array(size + 1).fill(0);
    }
    
    // Método auxiliar para encontrar o bit menos significativo
    lsb(i) {
        return i & -i;
    }
    
    // Constrói a árvore a partir de um array
    buildFromArray(array) {
        // Assumimos que array é 0-based, mas a BIT é 1-based
        for (let i = 0; i < array.length; i++) {
            this.update(i + 1, array[i]);
        }
    }
    
    // Adiciona 'value' ao elemento no índice 'i'
    update(i, value) {
        while (i <= this.size) {
            this.tree[i] += value;
            i += this.lsb(i);
        }
    }
    
    // Retorna a soma dos elementos de 1 até i
    prefixSum(i) {
        let sum = 0;
        while (i > 0) {
            sum += this.tree[i];
            i -= this.lsb(i);
        }
        return sum;
    }
    
    // Calcula a soma no intervalo [left, right]
    rangeSum(left, right) {
        return this.prefixSum(right) - this.prefixSum(left - 1);
    }
    
    // Para fins didáticos: mostra a estrutura interna da árvore
    printTree() {
        console.log("Árvore de Fenwick (valores dos nós):");
        for (let i = 1; i <= this.size; i++) {
            const binaryRep = i.toString(2).padStart(4, '0');
            const interval = this.calculateResponsibility(i);
            console.log(`Nó ${i} (${binaryRep}): ${this.tree[i]} (responsável por índices ${interval.join(', ')})`);
        }
    }
    
    // Calcula por quais índices cada nó é responsável (apenas para visualização)
    calculateResponsibility(i) {
        const len = this.lsb(i);
        return Array.from({length: len}, (_, k) => i - len + 1 + k);
    }
}

// Exemplo de uso
const originalArray = [3, 2, 5, 1, 7, 9, 4];
const bitTree = new FenwickTree(originalArray.length);
bitTree.buildFromArray(originalArray);

console.log("\nArray original:", originalArray);
console.log("Soma dos primeiros 4 elementos:", bitTree.prefixSum(4)); // Deve retornar 11 (3+2+5+1)
console.log("Soma do intervalo [3, 5]:", bitTree.rangeSum(3, 5)); // Deve retornar 13 (5+1+7)

// Atualizar um valor
bitTree.update(3, 3); // Adiciona 3 ao elemento no índice 3 (tornando-o 8)
console.log("Soma do intervalo [3, 5] após atualização:", bitTree.rangeSum(3, 5)); // Deve retornar 16 (8+1+7)

// Visualizar a estrutura da árvore
bitTree.printTree();
```

### Complexidade

- **Construção da árvore:** O(n log n)
- **Consulta de soma prefixada:** O(log n)
- **Atualização:** O(log n)
- **Espaço:** O(n)

## Comparação: Árvore de Segmentos vs. Árvore de Fenwick

| Característica       | Árvore de Segmentos     | Árvore de Fenwick        |
|----------------------|-------------------------|--------------------------|
| Consulta de intervalo | O(log n)               | O(log n)                 |
| Atualização ponto    | O(log n)               | O(log n)                 |
| Espaço               | O(n)                    | O(n)                     |
| Flexibilidade        | Alta (min, max, soma)   | Limitada (principalmente soma) |
| Implementação        | Mais complexa           | Mais simples             |
| Constante de tempo   | Maior                   | Menor                    |
| Aplicações ideais    | Diversos tipos de consultas | Consultas de soma eficientes |

## Aplicações Práticas

### Árvore de Segmentos

1. **Consultas estatísticas em intervalos**
   - Soma, mínimo, máximo, GCD, frequência, etc.

2. **Problemas de computação geométrica**
   - Encontrar pontos ou segmentos que se interceptam

3. **Algoritmos avançados**
   - Algoritmo de Mo
   - Sweepline

### Árvore de Fenwick

1. **Cálculo eficiente de histograma**
   - Contagem de inversões em array

2. **Problemas de soma cumulativa**
   - Soma de frequências
   - Consultas de soma em arrays 2D

3. **Cenários com muitas atualizações**
   - Algoritmos de ordenação
   - Banco de dados analíticos

## Exemplo de Problema: Inversões em um Array

Um problema clássico que pode ser resolvido eficientemente com uma Árvore de Fenwick:

> **Problema:** Dado um array, encontre o número de pares (i, j) tais que i < j e A[i] > A[j]

```javascript
function countInversions(array) {
    const n = array.length;
    // Cria uma cópia do array para ordenação
    const sortedArray = [...array].sort((a, b) => a - b);
    
    // Mapeia cada valor do array para sua posição no array ordenado (rank)
    const rank = new Map();
    for (let i = 0; i < n; i++) {
        rank.set(sortedArray[i], i + 1); // +1 porque BIT é 1-based
    }
    
    // Usa BIT para contar inversões
    const bit = new FenwickTree(n);
    let inversions = 0;
    
    for (let i = n - 1; i >= 0; i--) {
        // Conta elementos menores já processados
        inversions += bit.prefixSum(rank.get(array[i]) - 1);
        // Atualiza a BIT
        bit.update(rank.get(array[i]), 1);
    }
    
    return inversions;
}

const testArray = [8, 4, 2, 1];
console.log("\nArray para contagem de inversões:", testArray);
console.log("Número de inversões:", countInversions(testArray)); // Deve retornar 6
// Inversões: (8,4), (8,2), (8,1), (4,2), (4,1), (2,1)
```

## Considerações de Desempenho

1. **Tamanho do array:**
   - Para arrays muito grandes (10^6 ou mais), a Árvore de Fenwick pode ser preferível devido à sua menor sobrecarga de memória

2. **Tipos de consultas:**
   - Apenas somas prefixadas: Árvore de Fenwick
   - Consultas diversas (min, max, etc.): Árvore de Segmentos

3. **Constantes de tempo:**
   - Árvore de Fenwick geralmente executa mais rapidamente devido à sua simplicidade

## Exercícios Práticos

1. **Básico:** Implemente uma Árvore de Segmentos para encontrar o máximo em um intervalo

2. **Intermediário:** Modifique a Árvore de Segmentos para suportar atualizações em intervalos (lazy propagation)

3. **Avançado:** Implemente uma Árvore de Fenwick 2D para consultas de soma em uma matriz

## Dicas para Implementação Eficiente

1. **Use arrays para representar as árvores** em vez de estruturas de nós, para melhor desempenho

2. **Entenda a indexação** (0-based vs 1-based) - Árvores de Fenwick são mais simples com indexação 1-based

3. **Para Árvore de Segmentos**, dimensione o array com 4*n para garantir espaço suficiente

4. **Para operações com intervalos grandes**, considere técnicas como lazy propagation

## Desafio Final

Implemente uma Árvore de Segmentos com propagação preguiçosa (lazy propagation) para suportar atualizações eficientes em intervalos. Isto é especialmente útil quando precisamos atualizar muitos elementos de uma só vez. 