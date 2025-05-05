# Exercícios Práticos: Algoritmos de Ordenação e Busca

## 🎯 Objetivos

- Aplicar algoritmos de ordenação em problemas reais
- Praticar algoritmos de busca em texto
- Integrar diferentes algoritmos para soluções otimizadas
- Analisar performance e escolher algoritmos apropriados
- Desenvolver intuição sobre quando usar cada algoritmo

## 📝 Estrutura dos Exercícios

Os exercícios estão organizados por dificuldade e tema:
- **Nível Básico**: Entendimento e implementação direta dos algoritmos
- **Nível Intermediário**: Adaptação e otimização de algoritmos para casos específicos
- **Nível Avançado**: Integração de múltiplos algoritmos e resolução de problemas complexos

Para cada exercício, sugerimos:
1. Tentar resolver sem olhar a solução
2. Analisar a complexidade da sua solução
3. Comparar com a abordagem sugerida

## 📚 Exercícios de Ordenação

### Exercício 1: Sistema de Ranking
Crie um sistema de ranking para um jogo online que ordena jogadores por diferentes critérios.

#### Descrição do Problema
Você precisa implementar um sistema que permita ordenar jogadores por:
- Pontuação total (score)
- Nível (level)
- Taxa de vitórias (winRate)
- Combinações desses critérios (ex: primeiro por score, depois por level)

#### Esqueleto de Código

```javascript
class GameRanking {
    constructor() {
        this.players = [];
    }
    
    addPlayer(player) {
        this.players.push(player);
    }
    
    // TODO: Implemente ordenação por múltiplos critérios
    rankBy(criteria) {
        // criteria pode ser: ['score', 'level', 'winRate']
        // Use um algoritmo estável para múltiplos critérios
    }
    
    // TODO: Implemente busca de posição do jogador
    findPlayerRank(playerId) {
        // Encontre a posição do jogador no ranking
    }
    
    // TODO: Implemente top K jogadores
    getTopK(k) {
        // Retorne os top K jogadores mais eficientemente
    }
}

// Estrutura de dados do player
const playerExample = {
    id: 'p1',
    name: 'Player1',
    score: 1500,
    level: 25,
    wins: 42,
    losses: 18,
    // winRate é calculado como wins/(wins+losses)
};
```

#### Abordagem Sugerida
1. Para `rankBy`, use Merge Sort por ser estável e garantir O(n log n)
2. Para ordenar por múltiplos critérios, ordene primeiro pelo critério menos importante, depois pelo mais importante
3. Para `getTopK`, você pode usar um Heap de tamanho K para manter os maiores elementos

```javascript
// Exemplo de implementação para rankBy
rankBy(criteria = ['score']) {
    // Começando do critério menos importante
    for (let i = criteria.length - 1; i >= 0; i--) {
        const criterion = criteria[i];
        
        // Usando uma implementação de Merge Sort estável
        this.players = mergeSort(this.players, (a, b) => {
            // Se for winRate, precisamos calcular
            if (criterion === 'winRate') {
                const rateA = a.wins / (a.wins + a.losses);
                const rateB = b.wins / (b.wins + b.losses);
                return rateA - rateB;
            }
            return a[criterion] - b[criterion];
        });
    }
    
    return this.players;
}
```

#### Visualização
```
Players iniciais: 
[
  {id: 'p1', name: 'Alice', score: 1500, level: 25},
  {id: 'p2', name: 'Bob', score: 1200, level: 30},
  {id: 'p3', name: 'Charlie', score: 1500, level: 20}
]

Ordenação por ['level', 'score']:
Passo 1 (por score): 
[
  {id: 'p2', name: 'Bob', score: 1200, level: 30},
  {id: 'p3', name: 'Charlie', score: 1500, level: 20},
  {id: 'p1', name: 'Alice', score: 1500, level: 25}
]

Passo 2 (por level): 
[
  {id: 'p3', name: 'Charlie', score: 1500, level: 20},
  {id: 'p1', name: 'Alice', score: 1500, level: 25},
  {id: 'p2', name: 'Bob', score: 1200, level: 30}
]
```

### Exercício 2: Ordenação Externa de Logs
Implemente um sistema de ordenação externa para grandes arquivos de log.

#### Descrição do Problema
Você precisa ordenar um arquivo de log muito grande (que não cabe inteiramente na memória) por timestamp.

#### Esqueleto de Código

```javascript
class LogSorter {
    constructor(maxMemory = 1000000) { // 1MB de memória
        this.maxMemory = maxMemory;
    }
    
    // TODO: Implemente sort externo
    async sortLargeFile(inputFile, outputFile) {
        // 1. Dividir arquivo em chunks menores
        // 2. Ordenar cada chunk na memória
        // 3. Fazer merge dos chunks ordenados
        // 4. Salvar resultado no arquivo de saída
    }
    
    // TODO: Escolha o algoritmo apropriado para chunks
    sortChunk(chunk) {
        // Analise as características do chunk e escolha:
        // - Quick Sort
        // - Radix Sort
        // - Bucket Sort
    }
    
    // TODO: Implemente k-way merge
    kWayMerge(sortedChunks) {
        // Use uma heap para merge eficiente
    }
}

// Formato do log
const logEntryExample = {
    timestamp: '2023-05-12T15:32:45Z',  // ISO format
    level: 'INFO',      // DEBUG, INFO, WARN, ERROR
    message: 'User login successful',
    source: 'auth-service'
};
```

#### Abordagem Sugerida
1. Use divisão em chunks baseado na memória máxima disponível
2. Para timestamps, Radix Sort ou Merge Sort são boas escolhas
3. Para o k-way merge, use um Min-Heap que mantém o menor elemento de cada chunk

```javascript
// Parte da implementação para k-way merge
kWayMerge(sortedChunks) {
    // Cria uma min-heap para manter o próximo elemento de cada chunk
    const heap = new MinHeap();
    const chunkPointers = new Array(sortedChunks.length).fill(0);
    
    // Inicializa a heap com o primeiro elemento de cada chunk
    for (let i = 0; i < sortedChunks.length; i++) {
        if (sortedChunks[i].length > 0) {
            heap.insert({
                value: sortedChunks[i][0],
                chunkIndex: i
            });
        }
    }
    
    const result = [];
    
    // Enquanto houver elementos na heap
    while (!heap.isEmpty()) {
        // Remove o menor elemento
        const { value, chunkIndex } = heap.extractMin();
        result.push(value);
        
        // Incrementa o ponteiro do chunk
        chunkPointers[chunkIndex]++;
        
        // Se ainda há elementos no chunk, insere o próximo
        if (chunkPointers[chunkIndex] < sortedChunks[chunkIndex].length) {
            heap.insert({
                value: sortedChunks[chunkIndex][chunkPointers[chunkIndex]],
                chunkIndex
            });
        }
    }
    
    return result;
}
```

#### Visualização
```
Arquivo grande: [log1, log2, log3, ... log1000000]

Dividir em chunks:
Chunk 1: [log1, log2, ..., log1000]
Chunk 2: [log1001, log1002, ..., log2000]
...

Ordenar cada chunk (usando algoritmo apropriado)
Chunk 1 ordenado: [log_ordenado1, log_ordenado2, ...]
Chunk 2 ordenado: [log_ordenado1001, log_ordenado1002, ...]
...

k-way merge:
Heap inicial: [{valor: log_ordenado1, chunk: 0}, {valor: log_ordenado1001, chunk: 1}, ...]
Resultado: [menor_log, segundo_menor_log, ...]
```

### Exercício 3: Ordenação de Strings Complexas
Crie um sistema de ordenação para strings com regras especiais.

```javascript
class ComplexStringSort {
    // TODO: Implemente ordenação de strings com números
    sortAlphanumeric(strings) {
        // Exemplo: ["file10.txt", "file2.txt", "file1.txt"]
        // Resultado: ["file1.txt", "file2.txt", "file10.txt"]
    }
    
    // TODO: Ordenação com locale específico
    sortWithLocale(strings, locale = 'pt-BR') {
        // Considere acentos e caracteres especiais
    }
    
    // TODO: Ordenação por similaridade
    sortBySimilarity(strings, reference) {
        // Ordene strings pela similaridade com uma string de referência
        // Use algoritmos de distância de strings
    }
}
```

## 🔍 Exercícios de Busca

### Exercício 4: Sistema de Busca Autocompletar
Implemente um sistema de autocompletar eficiente.

```javascript
class Autocomplete {
    constructor() {
        this.trie = new Trie();
        this.suggestions = new Map();
    }
    
    // TODO: Adicionar palavras ao sistema
    addWord(word, frequency = 1) {
        // Armazene palavras com sua frequência
    }
    
    // TODO: Buscar sugestões
    getSuggestions(prefix, limit = 5) {
        // Encontre palavras que começam com o prefixo
        // Retorne as mais frequentes
    }
    
    // TODO: Atualizar frequências
    updateFrequency(word) {
        // Aumente a frequência quando uma palavra for selecionada
    }
}

// Estrutura da Trie para autocompletar
class Trie {
    // TODO: Implemente métodos necessários
}
```

### Exercício 5: Detector de Código Duplicado
Crie um detector de código duplicado usando algoritmos de busca.

```javascript
class CodeDuplicationDetector {
    constructor(minTokens = 50) {
        this.minTokens = minTokens;
    }
    
    // TODO: Encontrar código duplicado
    findDuplicates(codeFiles) {
        // 1. Tokenize o código
        // 2. Use rolling hash para encontrar sequências similares
        // 3. Verifique duplicatas reais
    }
    
    // TODO: Tokenizar código
    tokenize(code) {
        // Converta código em tokens
        // Normalize identificadores
    }
    
    // TODO: Calcular similaridade
    calculateSimilarity(tokens1, tokens2) {
        // Use algoritmos de string matching
        // Considere estrutura do código
    }
}
```

## 🚀 Exercícios Avançados

### Exercício 6: Otimizador de Queries de Banco de Dados
Simule um otimizador de queries que escolhe algoritmos de join.

```javascript
class QueryOptimizer {
    constructor() {
        this.statistics = new Map();
    }
    
    // TODO: Otimizar query de join
    optimizeJoin(leftTable, rightTable, joinColumn) {
        // Analise tamanho das tabelas e distribuição de dados
        // Escolha entre:
        // - Nested Loop Join
        // - Hash Join
        // - Sort-Merge Join
    }
    
    // TODO: Estimar custo
    estimateCost(algorithm, table1Size, table2Size) {
        // Calcule custo estimado para cada algoritmo
    }
    
    // TODO: Implementar joins
    nestedLoopJoin(left, right, joinColumn) {}
    hashJoin(left, right, joinColumn) {}
    sortMergeJoin(left, right, joinColumn) {}
}
```

### Exercício 7: Sistema de Indexação
Implemente um sistema de indexação para busca rápida em documentos.

```javascript
class DocumentIndexer {
    constructor() {
        this.invertedIndex = new Map();
        this.documentStats = new Map();
    }
    
    // TODO: Indexar documento
    indexDocument(docId, content) {
        // 1. Tokenize o conteúdo
        // 2. Remova stop words
        // 3. Crie índice invertido
    }
    
    // TODO: Buscar documentos
    search(query) {
        // 1. Tokenize a query
        // 2. Use índice invertido
        // 3. Ordene por relevância (TF-IDF)
    }
    
    // TODO: Ranking de documentos
    rankDocuments(queryTerms, matchingDocs) {
        // Implemente TF-IDF ou BM25
    }
}
```

## 🧠 Desafios de Pensamento

### Desafio 1: Escolha do Algoritmo Ideal
Para cada cenário, escolha o algoritmo mais apropriado e justifique:

1. Ordenar 1 bilhão de números inteiros de 32 bits
2. Ordenar lista de telefones (strings)
3. Encontrar as top 100 palavras mais frequentes em um texto
4. Ordenar uma lista que está 90% ordenada
5. Buscar padrão em DNA de 3 bilhões de pares de bases

### Desafio 2: Otimização de Pipeline
Projete um pipeline de processamento de dados que:
1. Leia arquivos CSV grandes
2. Ordene por múltiplas colunas
3. Remova duplicatas
4. Faça agregações
5. Salve em formato Parquet

Qual sequência de algoritmos você usaria? Por quê?

### Desafio 3: Sistema de Recomendação
Projete um sistema de recomendação que:
1. Processe logs de navegação
2. Encontre itens similares
3. Rankeie sugestões
4. Atualize em tempo real

Que estruturas de dados e algoritmos você combinaria?

## 📊 Problemas de Performance

### Problema 1: Ordenação Distribuída
```javascript
class DistributedSort {
    // TODO: Implemente sort distribuído
    async distributedSort(data, numWorkers) {
        // 1. Particione os dados
        // 2. Ordene cada partição
        // 3. Faça merge distribuído
    }
    
    // TODO: Particionamento inteligente
    partition(data, numPartitions) {
        // Garanta balanceamento de carga
    }
    
    // TODO: Merge distribuído
    distributedMerge(sortedPartitions) {
        // Combine resultados eficientemente
    }
}
```

### Problema 2: Cache-Aware Sorting
```javascript
class CacheAwareSort {
    // TODO: Implemente sort otimizado para cache
    cacheOptimizedSort(arr) {
        // Considere:
        // - Tamanho do cache L1/L2
        // - Padrões de acesso à memória
        // - Block size
    }
    
    // TODO: Análise de localidade
    analyzeLocality(algorithm, dataPattern) {
        // Avalie eficiência de cache
    }
}
```

## ✅ Checklist de Prática

### Ordenação
- [ ] Implementa Quick Sort otimizado
- [ ] Implementa Merge Sort in-place
- [ ] Implementa Radix Sort para strings
- [ ] Implementa Bucket Sort para distribuição uniforme
- [ ] Escolhe algoritmo baseado em características dos dados

### Busca
- [ ] Implementa KMP corretamente
- [ ] Implementa Boyer-Moore com ambas as regras
- [ ] Implementa Rabin-Karp com rolling hash
- [ ] Cria estruturas de dados para busca eficiente
- [ ] Otimiza busca para casos específicos

### Integração
- [ ] Combina múltiplos algoritmos
- [ ] Aplica paralelismo quando apropriado
- [ ] Considera limitações de memória
- [ ] Analisa trade-offs de tempo vs espaço

## 🤝 Revisão de Conceitos

Antes de avançar, verifique se você consegue:
1. Explicar a diferença entre estável e instável
2. Calcular complexidade de algoritmos híbridos
3. Justificar escolha de algoritmos
4. Otimizar para diferentes tipos de dados
5. Considerar limitações de hardware

## 💬 Quer discutir suas soluções?

Escolha um dos exercícios e vamos revisar juntos:
- Sua implementação está correta?
- Existem otimizações possíveis?
- A escolha do algoritmo foi adequada?
- Como você testou sua solução?

Ou prefere avançar para o Case Study final do módulo?