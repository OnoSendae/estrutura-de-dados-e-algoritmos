# Soluções para Desafios de Pensamento

## Desafio 1: Escolha do Algoritmo Ideal

### 1. Ordenar 1 bilhão de números inteiros de 32 bits

**Algoritmo escolhido: Radix Sort**

**Justificativa:**
- Os números têm tamanho fixo (32 bits), o que torna o Radix Sort ideal
- Complexidade O(n·w) onde w é o número de bits (32)
- Pode ser paralelizado facilmente
- Não requer comparações entre elementos
- Funciona bem para grandes volumes de dados

**Outras considerações:**
- External Merge Sort seria necessário se não couber na memória principal
- Quick Sort com pivô otimizado seria uma alternativa razoável, mas com complexidade pior O(n log n)
- Heap Sort garantiria O(n log n) no pior caso, mas com performance prática mais lenta

**Implementação prática:**
```javascript
// Radix Sort otimizado para inteiros de 32 bits
function radixSort32Bit(arr) {
    // Use 4 passagens com 8 bits cada (total 32 bits)
    for (let i = 0; i < 4; i++) {
        const buckets = Array.from({ length: 256 }, () => []);
        const shift = i * 8;
        
        // Distribuir
        for (const num of arr) {
            const bucketIndex = (num >> shift) & 0xFF;
            buckets[bucketIndex].push(num);
        }
        
        // Coletar
        let index = 0;
        for (const bucket of buckets) {
            for (const num of bucket) {
                arr[index++] = num;
            }
        }
    }
    
    return arr;
}
```

### 2. Ordenar lista de telefones (strings)

**Algoritmo escolhido: MSD Radix Sort**

**Justificativa:**
- Telefones têm comprimento fixo ou quase fixo
- MSD (Most Significant Digit) Radix Sort é eficiente para strings
- Complexidade O(n·k) onde k é o comprimento das strings
- Evita comparações complexas entre strings inteiras

**Outras considerações:**
- Quick Sort com Insertion Sort para partições pequenas também seria eficiente
- Se os telefones seguirem formato padronizado (ex: +XX-XXX-XXX-XXXX), podemos tratar como inteiros
- Para telefones internacionais de comprimentos variados, Timsort seria uma boa alternativa

**Implementação prática:**
```javascript
// MSD Radix Sort para strings
function msdRadixSort(arr, lo = 0, hi = arr.length - 1, d = 0) {
    const R = 256; // ASCII
    
    // Usar insertion sort para arrays pequenos
    if (hi <= lo + 15) {
        insertionSort(arr, lo, hi, d);
        return;
    }
    
    // Contar frequências
    const count = new Array(R + 2).fill(0);
    for (let i = lo; i <= hi; i++) {
        const c = charAt(arr[i], d) + 1;
        count[c]++;
    }
    
    // Calcular índices iniciais
    for (let r = 0; r < R + 1; r++) {
        count[r + 1] += count[r];
    }
    
    // Distribuir
    const aux = new Array(hi - lo + 1);
    for (let i = lo; i <= hi; i++) {
        const c = charAt(arr[i], d) + 1;
        aux[count[c]++] = arr[i];
    }
    
    // Copiar de volta
    for (let i = lo; i <= hi; i++) {
        arr[i] = aux[i - lo];
    }
    
    // Ordenar recursivamente cada grupo
    for (let r = 0; r < R; r++) {
        msdRadixSort(arr, lo + count[r], lo + count[r+1] - 1, d + 1);
    }
}

// Função helper para obter caractere na posição d
function charAt(s, d) {
    if (d < s.length) return s.charCodeAt(d);
    return -1;
}
```

### 3. Encontrar as top 100 palavras mais frequentes em um texto

**Algoritmo escolhido: Heap Sort (Min-Heap de tamanho 100)**

**Justificativa:**
- Problema de "top K" é ideal para heap
- Min-heap de tamanho 100 permite processar o texto em uma única passagem
- Complexidade O(n log k) onde k = 100 (muito melhor que O(n log n))
- Economiza memória mantendo apenas as 100 palavras mais frequentes

**Outras considerações:**
- Hash map para contagem de frequências é necessário
- Bucket sort seria eficiente se conhecêssemos o intervalo de frequências
- QuickSelect poderia ser usado como alternativa ao heap

**Implementação prática:**
```javascript
function findTopKWords(text, k = 100) {
    // Tokenizar o texto e contar frequências
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const frequencies = new Map();
    
    for (const word of words) {
        frequencies.set(word, (frequencies.get(word) || 0) + 1);
    }
    
    // Usar min-heap para manter as k palavras mais frequentes
    const minHeap = [];
    
    for (const [word, freq] of frequencies.entries()) {
        if (minHeap.length < k) {
            // Heap ainda não está cheio, adicionar diretamente
            minHeap.push({word, freq});
            if (minHeap.length === k) {
                buildMinHeap(minHeap);
            }
        } else if (freq > minHeap[0].freq) {
            // Substituir a palavra menos frequente
            minHeap[0] = {word, freq};
            heapify(minHeap, 0);
        }
    }
    
    // Ordenar o resultado final por frequência (decrescente)
    return minHeap.sort((a, b) => b.freq - a.freq);
}
```

### 4. Ordenar uma lista que está 90% ordenada

**Algoritmo escolhido: TimSort ou Insertion Sort adaptativo**

**Justificativa:**
- Insertion Sort é O(n) para arrays quase ordenados
- TimSort (híbrido de Merge e Insertion) detecta e aproveita sequências já ordenadas
- Complexidade prática próxima de O(n) para dados quase ordenados
- Ideal para atualizar coleções já ordenadas com poucas mudanças

**Outras considerações:**
- Bubble Sort com flag de troca também seria eficiente neste caso
- Merge Sort adaptativo que detecta runs já ordenadas
- Evitar Quick Sort que pode degradar para O(n²) em dados parcialmente ordenados

**Implementação prática:**
```javascript
function adaptiveInsertionSort(arr) {
    let swaps = 0;
    
    for (let i = 1; i < arr.length; i++) {
        const current = arr[i];
        
        // Verificar se já está na posição correta
        if (current >= arr[i-1]) {
            continue; // Já ordenado, pular
        }
        
        // Insertion sort clássico para os elementos fora de ordem
        let j = i - 1;
        while (j >= 0 && arr[j] > current) {
            arr[j+1] = arr[j];
            j--;
            swaps++;
        }
        arr[j+1] = current;
    }
    
    console.log(`Elementos fora de ordem: aproximadamente ${swaps}`);
    return arr;
}
```

### 5. Buscar padrão em DNA de 3 bilhões de pares de bases

**Algoritmo escolhido: Boyer-Moore com tabelas otimizadas**

**Justificativa:**
- O alfabeto de DNA é pequeno (apenas A, C, G, T)
- Boyer-Moore com bad character rule e good suffix rule é ideal
- Pode pular múltiplos caracteres, o que o torna sublinear na prática
- Excelente para buscar padrões longos em textos grandes

**Outras considerações:**
- Para múltiplas buscas, um índice de sufixo ou árvore de sufixo
- KMP seria mais lento, pois avança apenas um caractere por vez
- Para busca aproximada, algoritmos como Smith-Waterman ou BLAST

**Implementação prática:**
```javascript
function boyerMooreDNA(text, pattern) {
    // Otimização: pré-computar tabelas para o pequeno alfabeto de DNA
    const badCharTable = new Map([
        ['A', -1], ['C', -1], ['G', -1], ['T', -1]
    ]);
    
    // Construir tabela de bad character
    for (let i = 0; i < pattern.length; i++) {
        badCharTable.set(pattern[i], i);
    }
    
    // Buscar no texto
    let i = pattern.length - 1; // Índice no texto
    while (i < text.length) {
        let j = pattern.length - 1; // Índice no padrão
        
        // Comparar de trás para frente
        while (j >= 0 && text[i - (pattern.length - 1 - j)] === pattern[j]) {
            j--;
        }
        
        if (j < 0) {
            // Padrão encontrado
            return i - (pattern.length - 1);
        }
        
        // Calcular deslocamento usando a bad character rule
        const badChar = text[i - (pattern.length - 1 - j)];
        const lastPos = badCharTable.get(badChar) || -1;
        
        const shift = Math.max(1, j - lastPos);
        i += shift;
    }
    
    return -1; // Padrão não encontrado
}
```

## Desafio 2: Otimização de Pipeline

### Pipeline de Processamento de Dados

**Solução proposta:**

1. **Leitura de Arquivos CSV Grandes**
   - Usar leitura em stream para processar o arquivo em chunks
   - Implementar parser CSV otimizado para memória com previsão de tipos

2. **Ordenação por Múltiplas Colunas**
   - Para arquivos que cabem na memória: TimSort estável com função de comparação customizada
   - Para arquivos que não cabem na memória: External Merge Sort com sort parcial por chunk
   - Aplicar indexação parcial para colunas frequentemente utilizadas

3. **Remoção de Duplicatas**
   - Após ordenação, usar algoritmo linear de remoção de adjacentes duplicados
   - Para dados não-ordenados, usar Bloom Filter para detecção rápida
   - Manter índice de hash para chaves de unicidade

4. **Agregações**
   - Implementar agregações em uma única passagem quando possível
   - Usar estruturas otimizadas como Max/Min Heap para cálculos específicos
   - Paralelizar operações de agregação por particionamento de dados

5. **Salvar em Formato Parquet**
   - Comprimir dados usando codificação por dicionário para strings repetidas
   - Implementar particionamento inteligente baseado nas colunas mais filtradas
   - Otimizar layout de colunas para consultas frequentes

**Algoritmos e estruturas de dados chave:**

```
Leitura CSV → External Merge Sort → Hash-based Deduplication → 
Parallel Aggregation → Dictionary Encoding → Parquet Output
```

**Otimizações de implementação:**

1. **Predição de Tipos**
   - Analisar amostra do arquivo para detectar tipos de dados automaticamente
   - Usar representações otimizadas (inteiros vs. strings)

2. **Ordenação Adaptativa**
   - Detectar padrões parciais de ordenação nos dados
   - Aproveitar runs já ordenados

3. **Deduplicação em Fases**
   - Fase 1: Bloom filter para descartar óbvios não-duplicados
   - Fase 2: Hash table para verificação precisa

4. **Agregações Incrementais**
   - Manter estados intermediários para agregações (ex: soma e contagem para média)
   - Usar algoritmos numéricos estáveis

5. **Compressão Inteligente**
   - Aplicar diferentes estratégias de compressão por coluna
   - Usar Run-Length Encoding para sequências repetidas

**Justificativa da abordagem:**
Este pipeline combina algoritmos especializados para cada fase, com foco em eficiência de memória e processamento. A ordenação externa é crucial para dados que não cabem na memória, enquanto as otimizações de deduplicação em múltiplas fases reduzem drasticamente o overhead. A paralelização das agregações aproveita múltiplos cores, e a codificação por dicionário para o formato Parquet reduz significativamente o tamanho final dos dados.

## Desafio 3: Sistema de Recomendação

### Sistema de Recomendação com Atualização em Tempo Real

**Arquitetura proposta:**

1. **Processamento de Logs de Navegação**
   - Algoritmo: Stream Processing com Sliding Window
   - Estrutura: Fila circular limitada por tempo/tamanho
   - Otimização: Sampling adaptativo baseado em atividade do usuário

2. **Encontrar Itens Similares**
   - Algoritmo: Locality-Sensitive Hashing (LSH) para similaridade aproximada
   - Estrutura: Matriz esparsa de interações usuário-item
   - Otimização: MinHash para redução de dimensionalidade

3. **Rankeamento de Sugestões**
   - Algoritmo: Weighted Scoring com decaimento temporal
   - Estrutura: Max-Heap de tamanho limitado (top-K)
   - Otimização: Cálculo incremental de scores

4. **Atualização em Tempo Real**
   - Algoritmo: Lambda Architecture (batch + speed layer)
   - Estrutura: Índice invertido para atualizações
   - Otimização: Write-behind cache com invalidação seletiva

**Implementação detalhada:**

1. **Módulo de Processamento de Logs**
```javascript
class LogProcessor {
    constructor(windowSize = 1000) {
        this.recentEvents = new CircularBuffer(windowSize);
        this.userProfiles = new Map(); // Perfis de usuário
    }
    
    processEvent(event) {
        // Adicionar evento à janela deslizante
        this.recentEvents.add(event);
        
        // Atualizar perfil do usuário incrementalmente
        this.updateUserProfile(event);
        
        // Trigger para atualização de recomendações
        if (this.shouldUpdateRecommendations(event)) {
            this.triggerRecommendationUpdate(event.userId);
        }
    }
    
    // Outras funções do processamento de logs...
}
```

2. **Módulo de Similaridade**
```javascript
class SimilarityEngine {
    constructor(dimensions = 100, bands = 20) {
        this.itemFeatures = new Map(); // Características dos itens
        this.minhashSignatures = new Map(); // Assinaturas LSH
        this.similarItems = new Map(); // Cache de itens similares
    }
    
    findSimilarItems(itemId, count = 10) {
        // Check cache first
        if (this.similarItems.has(itemId)) {
            return this.similarItems.get(itemId);
        }
        
        // Use LSH para busca eficiente
        const candidates = this.lshSearch(itemId);
        
        // Calcular similaridade exata apenas para candidatos
        const similarities = candidates.map(candidate => ({
            id: candidate,
            score: this.calculateCosineSimilarity(itemId, candidate)
        }));
        
        // Ordenar e limitar
        const result = similarities
            .sort((a, b) => b.score - a.score)
            .slice(0, count);
            
        // Cache result
        this.similarItems.set(itemId, result);
        
        return result;
    }
    
    // Outras funções de similaridade...
}
```

3. **Módulo de Ranking**
```javascript
class RecommendationRanker {
    constructor() {
        this.recencyWeight = 0.5;
        this.similarityWeight = 0.3;
        this.popularityWeight = 0.2;
        this.recencyDecay = 0.95; // Fator de decaimento temporal
    }
    
    rankRecommendations(userId, candidateItems) {
        const userProfile = this.getUserProfile(userId);
        const recentItems = this.getRecentItems(userId);
        
        // Calcular scores com múltiplos fatores
        const scoredItems = candidateItems.map(item => ({
            item,
            score: this.calculateCombinedScore(item, userProfile, recentItems)
        }));
        
        // Usar heap para manter os top K itens
        return this.getTopK(scoredItems, 10);
    }
    
    calculateCombinedScore(item, userProfile, recentItems) {
        const recencyScore = this.calculateRecencyScore(item, recentItems);
        const similarityScore = this.calculateSimilarityScore(item, userProfile);
        const popularityScore = this.getPopularityScore(item);
        
        return (recencyScore * this.recencyWeight) +
               (similarityScore * this.similarityWeight) +
               (popularityScore * this.popularityWeight);
    }
    
    // Outras funções de ranking...
}
```

4. **Módulo de Atualização Real-Time**
```javascript
class RealTimeUpdater {
    constructor() {
        this.batchUpdateInterval = 3600000; // 1 hora
        this.dirtyItems = new Set(); // Itens que precisam ser atualizados
        this.updateQueue = new PriorityQueue(); // Fila de atualizações
    }
    
    scheduleUpdate(itemId, priority) {
        this.dirtyItems.add(itemId);
        this.updateQueue.enqueue(itemId, priority);
        
        // Se a fila estiver muito grande, processar imediatamente
        if (this.updateQueue.size() > THRESHOLD) {
            this.processUpdateBatch();
        }
    }
    
    processUpdateBatch() {
        // Processar até MAX_BATCH_SIZE itens da fila
        const batch = this.updateQueue.dequeueMany(MAX_BATCH_SIZE);
        
        // Atualizar similaridades e recomendações
        for (const itemId of batch) {
            this.similarityEngine.updateItemSimilarity(itemId);
            this.dirtyItems.delete(itemId);
        }
        
        // Invalidar caches afetados
        this.invalidateAffectedCaches(batch);
    }
    
    // Outras funções de atualização...
}
```

**Justificativa da escolha de algoritmos:**

1. **LSH para Similaridade**
   - Complexidade: O(1) para busca aproximada vs O(n) para busca exaustiva
   - Reduz drasticamente o espaço de busca para itens similares
   - Sacrifica precisão perfeita por velocidade (aceitável para recomendações)

2. **Min-Heap para Top-K**
   - Complexidade: O(n log k) vs O(n log n) para ordenação completa
   - Mantém apenas os k melhores itens na memória
   - Suporta atualizações incrementais eficientes

3. **Lambda Architecture**
   - Permite atualizações em tempo real enquanto mantém consistência
   - Camada de velocidade (speed layer) para atualizações imediatas
   - Camada de lote (batch layer) para recomputação periódica completa

4. **Índices Invertidos**
   - Acelera drasticamente buscas por usuários afetados por mudanças em itens
   - Permite invalidação seletiva de cache
   - Estrutura compacta e eficiente para atualizações

Este sistema de recomendação combina algoritmos eficientes de aproximação (LSH), estruturas de dados otimizadas (heaps, índices invertidos) e técnicas de computação incremental para atingir alta performance em tempo real, mantendo a relevância das recomendações.

O uso de técnicas como amostragem adaptativa, decaimento temporal e invalidação seletiva de cache permite escalar para milhões de usuários e itens, mantendo latência baixa e atualizações em tempo real. 