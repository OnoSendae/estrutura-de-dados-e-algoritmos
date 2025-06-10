# Listas Skip (Skip Lists)

## Conceitos Fundamentais

### Introdução às Listas Skip

A lista skip é uma estrutura de dados probabilística que permite buscas eficientes, semelhantes a uma árvore binária de busca, mas com implementação mais simples. Inventada por William Pugh em 1989, ela oferece uma alternativa interessante às árvores balanceadas.

### Problema a ser Resolvido

Em uma **lista encadeada comum**, a busca é uma operação O(n) - para encontrar um elemento, precisamos percorrer a lista linearmente do início até encontrar o valor desejado.

```
1 -> 3 -> 7 -> 9 -> 12 -> 15 -> 20 -> 26
```

Para encontrar o valor 20 na lista acima, precisamos examinar 7 nós.

### A Ideia Básica: Adicionar "Atalhos"

A ideia por trás das listas skip é adicionar "atalhos" ou "níveis superiores" que nos permitem pular vários elementos durante a busca.

```
Nível 2:  1 ----------------> 12 ----------------> 26
                              |                     |
Nível 1:  1 -------> 7 -------> 12 -------> 20 -------> 26
                     |          |           |          |
Nível 0:  1 -> 3 -> 7 -> 9 -> 12 -> 15 -> 20 -> 26
```

Com esta estrutura multinível, para encontrar o elemento 20:
1. Começamos no topo esquerdo (nível 2, elemento 1)
2. Verificamos o próximo elemento no nível 2 (elemento 12)
3. Como 12 < 20, continuamos no nível 2
4. O próximo elemento é 26, que é > 20, então descemos para o nível 1
5. No nível 1, o próximo elemento após 12 é 20
6. Encontramos o elemento 20!

Este processo examinou apenas 4 nós, em vez dos 7 da lista encadeada comum.

### Analogia com Elevadores em um Prédio

Uma analogia útil é pensar na lista skip como um prédio com andares:
- O térreo (nível 0) tem portas para todos os apartamentos (elementos)
- O 1º andar (nível 1) tem portas apenas para alguns apartamentos
- O 2º andar (nível 2) tem ainda menos portas
- E assim por diante...

Para chegar a um apartamento específico, você:
1. Começa no andar mais alto
2. Segue até o ponto mais próximo do seu destino naquele andar
3. Desce um andar e repete o processo
4. Eventualmente, chega ao térreo exatamente onde precisa

### Estrutura de Dados

#### Nó da Lista Skip

Cada nó em uma lista skip contém:
1. Um valor
2. Um array de referências para os próximos nós em cada nível

```javascript
class SkipNode {
    constructor(value, level) {
        this.value = value;
        // Array de ponteiros "forward" para cada nível
        this.forward = new Array(level + 1).fill(null);
    }
}
```

#### A Lista Skip

A estrutura principal mantém:
1. Um nó de cabeça (sentinel)
2. O nível máximo atual da lista
3. Uma probabilidade para determinar a altura dos nós

```javascript
class SkipList {
    constructor(maxLevel = 16, p = 0.5) {
        // Nível máximo permitido
        this.maxLevel = maxLevel;
        
        // Probabilidade de subir de nível (0.5 = 50% de chance)
        this.p = p;
        
        // Nível atual da lista (começa em 0)
        this.level = 0;
        
        // Nó cabeça com ponteiros para cada nível
        this.header = new SkipNode(null, this.maxLevel);
    }
    
    // Outros métodos...
}
```

### O Elemento de Aleatoriedade

A característica única da lista skip é como ela determina quais elementos devem ter referências nos níveis superiores. Isto é feito probabilisticamente:

1. Todos os elementos estão no nível 0 (a lista base)
2. Aproximadamente 1/2 dos elementos tem referências no nível 1
3. Aproximadamente 1/4 dos elementos tem referências no nível 2
4. Aproximadamente 1/8 dos elementos tem referências no nível 3
5. E assim por diante...

Esta distribuição é conseguida lançando uma "moeda" (ou gerando um número aleatório) quando um novo elemento é inserido:

```javascript
// Gera um nível aleatório para um novo nó
randomLevel() {
    let level = 0;
    // Enquanto random() < p E não ultrapassamos o maxLevel
    while (Math.random() < this.p && level < this.maxLevel) {
        level++;
    }
    return level;
}
```

### Operações Básicas

#### 1. Busca

Para buscar um elemento na lista skip:

1. Comece do nível mais alto do nó cabeça
2. Enquanto não chegar ao nível 0:
   a. Avance horizontalmente enquanto o próximo valor for menor que o valor buscado
   b. Quando não puder mais avançar, desça um nível
3. No nível 0, avance até o elemento correto ou seu predecessor

```javascript
search(value) {
    let current = this.header;
    
    // Começa do nível mais alto e vai descendo
    for (let i = this.level; i >= 0; i--) {
        // Avança horizontalmente enquanto possível
        while (current.forward[i] && current.forward[i].value < value) {
            current = current.forward[i];
        }
    }
    
    // Agora estamos no nível 0, no elemento anterior ou igual ao buscado
    current = current.forward[0];
    
    // Verifica se o elemento foi encontrado
    if (current && current.value === value) {
        return current;
    }
    return null;
}
```

#### 2. Inserção

Para inserir um elemento:

1. Realize uma busca para encontrar a posição adequada em cada nível
2. Armazene os nós predecessores em cada nível
3. Gere um nível aleatório para o novo nó
4. Insira o nó, atualizando os ponteiros dos predecessores

```javascript
insert(value) {
    // Array para armazenar os nós predecessores em cada nível
    const update = new Array(this.maxLevel + 1).fill(null);
    let current = this.header;
    
    // Similar à busca, mas armazenando os predecessores
    for (let i = this.level; i >= 0; i--) {
        while (current.forward[i] && current.forward[i].value < value) {
            current = current.forward[i];
        }
        update[i] = current;
    }
    
    // Move para o próximo nó no nível 0
    current = current.forward[0];
    
    // Se o elemento já existe, não insere
    if (current && current.value === value) {
        return false;
    }
    
    // Gera nível aleatório para o novo nó
    const newLevel = this.randomLevel();
    
    // Se o novo nível é maior que o nível atual da lista
    if (newLevel > this.level) {
        for (let i = this.level + 1; i <= newLevel; i++) {
            update[i] = this.header;
        }
        this.level = newLevel;
    }
    
    // Cria o novo nó
    const newNode = new SkipNode(value, newLevel);
    
    // Insere o nó em todos os níveis até newLevel
    for (let i = 0; i <= newLevel; i++) {
        newNode.forward[i] = update[i].forward[i];
        update[i].forward[i] = newNode;
    }
    
    return true;
}
```

#### 3. Remoção

Para remover um elemento:

1. Similar à inserção, encontre os predecessores em cada nível
2. Se o elemento existe, atualize os ponteiros para pular o nó
3. Ajuste o nível atual da lista se necessário

```javascript
delete(value) {
    const update = new Array(this.maxLevel + 1).fill(null);
    let current = this.header;
    
    // Encontra os predecessores em cada nível
    for (let i = this.level; i >= 0; i--) {
        while (current.forward[i] && current.forward[i].value < value) {
            current = current.forward[i];
        }
        update[i] = current;
    }
    
    current = current.forward[0];
    
    // Se o elemento não existe, retorna false
    if (!current || current.value !== value) {
        return false;
    }
    
    // Remove o nó de todos os níveis
    for (let i = 0; i <= this.level; i++) {
        if (update[i].forward[i] !== current) {
            break;
        }
        update[i].forward[i] = current.forward[i];
    }
    
    // Ajusta o nível da lista se necessário
    while (this.level > 0 && !this.header.forward[this.level]) {
        this.level--;
    }
    
    return true;
}
```

## Análise de Complexidade

### Complexidade de Tempo

Em média, as operações nas listas skip têm:

| Operação | Complexidade Média | Complexidade de Pior Caso |
|----------|-------------------|--------------------------|
| Busca    | O(log n)          | O(n)                     |
| Inserção | O(log n)          | O(n)                     |
| Remoção  | O(log n)          | O(n)                     |

### Por que O(log n)?

Com aproximadamente metade dos nós em cada nível superior:
- Nível 0: n nós
- Nível 1: n/2 nós
- Nível 2: n/4 nós
- ...
- Nível log(n): 1 nó

O número esperado de comparações é proporcional a log(n).

### Análise do Pior Caso

O pior caso O(n) ocorre quando:
- Temos má sorte na distribuição dos níveis
- Todos os nós acabam apenas no nível 0
- A lista se comporta como uma lista encadeada comum

Na prática, a probabilidade disto acontecer é extremamente baixa.

### Espaço Adicional

A lista skip requer espaço adicional para armazenar os ponteiros em níveis superiores:
- Se temos n nós, precisamos de aproximadamente 2n ponteiros no total
- Isso leva a um uso de espaço O(n)

## Implementação Completa

### Implementação em JavaScript

Abaixo está uma implementação completa da lista skip:

```javascript
class SkipNode {
    constructor(value, level) {
        this.value = value;
        this.forward = new Array(level + 1).fill(null);
    }
}

class SkipList {
    constructor(maxLevel = 16, p = 0.5) {
        this.maxLevel = maxLevel;
        this.p = p;
        this.level = 0;
        this.header = new SkipNode(null, this.maxLevel);
    }
    
    // Gera um nível aleatório para um novo nó
    randomLevel() {
        let level = 0;
        while (Math.random() < this.p && level < this.maxLevel) {
            level++;
        }
        return level;
    }
    
    // Insere um valor na lista
    insert(value) {
        const update = new Array(this.maxLevel + 1).fill(null);
        let current = this.header;
        
        // Encontra a posição para inserção em cada nível
        for (let i = this.level; i >= 0; i--) {
            while (current.forward[i] && current.forward[i].value < value) {
                current = current.forward[i];
            }
            update[i] = current;
        }
        
        current = current.forward[0];
        
        // Se o valor já existe, não insere
        if (current && current.value === value) {
            return false;
        }
        
        // Gera um nível aleatório para o novo nó
        const newLevel = this.randomLevel();
        
        // Se o novo nível é maior que o nível atual
        if (newLevel > this.level) {
            for (let i = this.level + 1; i <= newLevel; i++) {
                update[i] = this.header;
            }
            this.level = newLevel;
        }
        
        // Cria o novo nó
        const newNode = new SkipNode(value, newLevel);
        
        // Insere o nó em todos os níveis
        for (let i = 0; i <= newLevel; i++) {
            newNode.forward[i] = update[i].forward[i];
            update[i].forward[i] = newNode;
        }
        
        return true;
    }
    
    // Busca um valor na lista
    search(value) {
        let current = this.header;
        
        // Começa do nível mais alto
        for (let i = this.level; i >= 0; i--) {
            while (current.forward[i] && current.forward[i].value < value) {
                current = current.forward[i];
            }
        }
        
        // Avança para o primeiro nó no nível 0
        current = current.forward[0];
        
        // Verifica se encontramos o valor
        if (current && current.value === value) {
            return current;
        }
        return null;
    }
    
    // Remove um valor da lista
    delete(value) {
        const update = new Array(this.maxLevel + 1).fill(null);
        let current = this.header;
        
        // Encontra os predecessores em cada nível
        for (let i = this.level; i >= 0; i--) {
            while (current.forward[i] && current.forward[i].value < value) {
                current = current.forward[i];
            }
            update[i] = current;
        }
        
        current = current.forward[0];
        
        // Se o valor não existe, retorna false
        if (!current || current.value !== value) {
            return false;
        }
        
        // Remove o nó de todos os níveis
        for (let i = 0; i <= this.level; i++) {
            if (update[i].forward[i] !== current) {
                break;
            }
            update[i].forward[i] = current.forward[i];
        }
        
        // Ajusta o nível da lista se necessário
        while (this.level > 0 && !this.header.forward[this.level]) {
            this.level--;
        }
        
        return true;
    }
    
    // Imprime os valores da lista em cada nível
    printList() {
        console.log("\n**** Skip List ****");
        for (let i = 0; i <= this.level; i++) {
            let result = `Level ${i}: `;
            let node = this.header.forward[i];
            while (node) {
                result += node.value + " ";
                node = node.forward[i];
            }
            console.log(result);
        }
    }
}

// Exemplo de uso
const list = new SkipList();
list.insert(3);
list.insert(6);
list.insert(7);
list.insert(9);
list.insert(12);
list.insert(19);
list.insert(17);
list.insert(26);
list.insert(21);
list.insert(25);
list.printList();

console.log("Search 19: ", list.search(19) ? "Found" : "Not Found");
console.log("Search 18: ", list.search(18) ? "Found" : "Not Found");

list.delete(19);
list.printList();
console.log("Search 19 após remoção: ", list.search(19) ? "Found" : "Not Found");
```

### Implementação com Dados Genéricos

A implementação anterior é para valores primitivos. Podemos estendê-la para suportar qualquer tipo de dado, usando uma função de comparação:

```javascript
class SkipList {
    constructor(comparator = (a, b) => a - b, maxLevel = 16, p = 0.5) {
        this.maxLevel = maxLevel;
        this.p = p;
        this.level = 0;
        this.header = new SkipNode(null, this.maxLevel);
        this.comparator = comparator;
    }
    
    // Métodos modificados para usar o comparator
    search(value) {
        let current = this.header;
        
        for (let i = this.level; i >= 0; i--) {
            while (current.forward[i] && this.comparator(current.forward[i].value, value) < 0) {
                current = current.forward[i];
            }
        }
        
        current = current.forward[0];
        
        if (current && this.comparator(current.value, value) === 0) {
            return current;
        }
        return null;
    }
    
    // Outros métodos modificados de forma similar...
}

// Exemplo: Skip list para objetos de pessoas ordenados por idade
const ageComparator = (a, b) => a.age - b.age;
const personList = new SkipList(ageComparator);

personList.insert({name: "Alice", age: 30});
personList.insert({name: "Bob", age: 25});
personList.insert({name: "Charlie", age: 35});
```

## Variações e Otimizações

### 1. Lista Skip Determinística

Algumas variações removem a aleatoriedade, determinando o nível de cada nó com base em sua posição:
- Nós nas posições múltiplas de 2 têm nível ≥ 1
- Nós nas posições múltiplas de 4 têm nível ≥ 2
- E assim por diante

### 2. Lista Skip com Cauda

Adiciona um nó de cauda (similar ao cabeça) para simplificar operações e facilitar percursos reversos.

### 3. Lista Skip Indexada

Mantém informações de índice em cada nó, permitindo acesso por posição em O(log n).

```javascript
class IndexedSkipNode extends SkipNode {
    constructor(value, level) {
        super(value, level);
        this.span = new Array(level + 1).fill(1);
    }
}
```

### 4. Lista Skip com Finger Search

Otimiza buscas sequenciais armazenando posições recentemente acessadas.

## Aplicações Práticas

### 1. Implementações de Dicionários e Conjuntos

As listas skip são usadas em implementações de dicionários e conjuntos onde precisamos de busca, inserção e remoção rápidas.

### 2. Bancos de Dados

Várias tecnologias de banco de dados usam listas skip para indexação:
- Redis usa listas skip para implementar conjuntos ordenados
- LevelDB usa uma variação de lista skip para gerenciar índices

### 3. Processamento de Texto

Sistemas de busca e indexação de texto usam listas skip para acelerar operações.

### 4. Implementação de Algoritmos de Mesclagem

Algoritmos para mesclar múltiplas sequências ordenadas podem usar listas skip.

### 5. Cache com Expirações

Sistemas de cache com itens que expiram em tempos diferentes podem ser implementados eficientemente com listas skip.

## Comparação com Outras Estruturas

### Árvore Binária de Busca vs. Lista Skip

| Aspecto                   | Árvore Binária de Busca | Lista Skip             |
|---------------------------|-------------------------|------------------------|
| Complexidade Média        | O(log n)                | O(log n)               |
| Complexidade de Pior Caso | O(n) (desbalanceada)    | O(n) (probabilistico)  |
| Implementação             | Mais complexa           | Relativamente simples  |
| Balanceamento             | Requer algoritmos       | Intrínseco (aleatório) |
| Travessia Ordenada        | Simples (in-order)      | Simples (nível 0)      |
| Uso de Memória            | Menor                   | Maior                  |

### Lista Skip vs. Árvores Balanceadas (AVL, Vermelho-Preto)

| Aspecto                   | Árvores Balanceadas     | Lista Skip             |
|---------------------------|-------------------------|------------------------|
| Complexidade Garantida    | O(log n) (garantido)    | O(log n) (em média)    |
| Código de Balanceamento   | Complexo                | Não necessário         |
| Operações Parciais        | Difícil                 | Natural                |
| Desempenho Prático        | Consistente             | Geralmente bom         |
| Debugging                 | Difícil                 | Relativamente fácil    |

## Considerações Práticas

### Quando Usar Listas Skip

Listas skip são ideais quando:
1. Precisamos de operações ordenadas (busca, inserção, remoção) em O(log n)
2. Queremos uma implementação mais simples que árvores balanceadas
3. Podemos tolerar um fator de uso de memória maior
4. A garantia de pior caso O(log n) não é crítica

### Quando Evitar Listas Skip

Listas skip não são a melhor escolha quando:
1. O espaço é extremamente limitado
2. Precisamos de garantias absolutas de desempenho O(log n)
3. Não queremos aleatoriedade no comportamento
4. Acesso aleatório por índice é a operação mais comum

### Escolhendo Parâmetros

1. **Probabilidade (p)**: 
   - Geralmente 0.5 (50%) funciona bem
   - Valores menores reduzem o uso de memória mas aumentam o tempo de busca
   - Valores maiores fazem o oposto

2. **Nível Máximo (maxLevel)**:
   - Uma regra prática é maxLevel = log₁/ₚ(n)
   - Para p = 0.5 e n = 1 milhão, maxLevel ≈ 20
   - Para a maioria das aplicações, 16-32 é suficiente

## Conclusão

As listas skip são uma estrutura de dados elegante que oferece uma alternativa mais simples às árvores balanceadas para muitas aplicações. Com boa performance média, facilidade de implementação e comportamento adaptativo, elas representam um excelente compromisso entre complexidade e eficiência.

Embora não forneçam as mesmas garantias rígidas de árvores balanceadas como AVL ou vermelho-preto, seu desempenho prático e simplicidade fazem das listas skip uma escolha popular para muitas aplicações reais, de bancos de dados a sistemas de cache. 