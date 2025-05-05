/**
 * Implementação do Sistema de Ordenação Externa de Logs
 * Solução para o Exercício 2 do Módulo 4
 * 
 * Simula o processo de ordenação externa para arquivos grandes
 * usando a abordagem de dividir em chunks, ordenar cada chunk
 * e fazer o merge dos resultados
 */

// Implementação de Min-Heap para o k-way merge
class MinHeap {
    constructor() {
        this.heap = [];
    }
    
    getParentIndex(i) {
        return Math.floor((i - 1) / 2);
    }
    
    getLeftChildIndex(i) {
        return 2 * i + 1;
    }
    
    getRightChildIndex(i) {
        return 2 * i + 2;
    }
    
    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }
    
    insert(item) {
        this.heap.push(item);
        this.siftUp(this.heap.length - 1);
    }
    
    siftUp(i) {
        let parentIndex = this.getParentIndex(i);
        
        while (i > 0 && 
               new Date(this.heap[i].value.timestamp) < new Date(this.heap[parentIndex].value.timestamp)) {
            this.swap(i, parentIndex);
            i = parentIndex;
            parentIndex = this.getParentIndex(i);
        }
    }
    
    extractMin() {
        if (this.isEmpty()) {
            return null;
        }
        
        const min = this.heap[0];
        const last = this.heap.pop();
        
        if (this.heap.length > 0) {
            this.heap[0] = last;
            this.siftDown(0);
        }
        
        return min;
    }
    
    siftDown(i) {
        let minIndex = i;
        const leftIndex = this.getLeftChildIndex(i);
        const rightIndex = this.getRightChildIndex(i);
        
        if (leftIndex < this.heap.length && 
            new Date(this.heap[leftIndex].value.timestamp) < new Date(this.heap[minIndex].value.timestamp)) {
            minIndex = leftIndex;
        }
        
        if (rightIndex < this.heap.length && 
            new Date(this.heap[rightIndex].value.timestamp) < new Date(this.heap[minIndex].value.timestamp)) {
            minIndex = rightIndex;
        }
        
        if (i !== minIndex) {
            this.swap(i, minIndex);
            this.siftDown(minIndex);
        }
    }
    
    isEmpty() {
        return this.heap.length === 0;
    }
    
    size() {
        return this.heap.length;
    }
}

class LogSorter {
    constructor(maxMemory = 1000000) { // 1MB de memória simulada
        this.maxMemory = maxMemory;
        this.estimatedLogSize = 200; // Estimativa de bytes por log (para simulação)
    }
    
    /**
     * Processa um arquivo grande de logs e produz um arquivo ordenado
     * Implementa ordenação externa para lidar com arquivos maiores que a memória
     * @param {Array} inputLogs - Array simulando arquivo de entrada
     * @param {boolean} verbose - Se deve mostrar detalhes da execução
     * @returns {Array} - Logs ordenados por timestamp
     */
    sortLargeFile(inputLogs, verbose = false) {
        if (verbose) console.log(`Iniciando ordenação de ${inputLogs.length} logs...`);
        
        // 1. Calcular quantos logs podem ser processados por chunk
        const logsPerChunk = Math.floor(this.maxMemory / this.estimatedLogSize);
        if (verbose) console.log(`Cada chunk pode conter até ${logsPerChunk} logs`);
        
        // 2. Dividir o arquivo em chunks
        const chunks = this.splitIntoChunks(inputLogs, logsPerChunk);
        if (verbose) console.log(`Arquivo dividido em ${chunks.length} chunks`);
        
        // 3. Ordenar cada chunk individualmente
        const sortedChunks = chunks.map((chunk, index) => {
            if (verbose) console.log(`Ordenando chunk ${index + 1}/${chunks.length}...`);
            return this.sortChunk(chunk);
        });
        
        // 4. Realizar o k-way merge dos chunks ordenados
        if (verbose) console.log(`Executando k-way merge de ${sortedChunks.length} chunks...`);
        const result = this.kWayMerge(sortedChunks);
        
        if (verbose) console.log(`Ordenação concluída: ${result.length} logs ordenados`);
        return result;
    }
    
    /**
     * Divide o arquivo de entrada em chunks menores
     * @param {Array} logs - Array completo de logs
     * @param {number} chunkSize - Tamanho máximo de cada chunk
     * @returns {Array} - Array de chunks
     */
    splitIntoChunks(logs, chunkSize) {
        const chunks = [];
        
        for (let i = 0; i < logs.length; i += chunkSize) {
            chunks.push(logs.slice(i, i + chunkSize));
        }
        
        return chunks;
    }
    
    /**
     * Ordena um chunk individual usando algoritmo apropriado
     * Escolhe entre algoritmos com base no padrão dos dados
     * @param {Array} chunk - Chunk a ser ordenado
     * @returns {Array} - Chunk ordenado
     */
    sortChunk(chunk) {
        // Analisar os dados para escolher o melhor algoritmo
        const isTimestampISO = this.checkIfTimestampISO(chunk);
        
        if (isTimestampISO) {
            // Para timestamps ISO, podemos usar o native sort do JavaScript
            // que é uma implementação eficiente de TimSort (híbrido)
            return chunk.sort((a, b) => 
                new Date(a.timestamp) - new Date(b.timestamp)
            );
        } else {
            // Se forem números, Radix Sort seria melhor
            return this.radixSortTimestamps(chunk);
        }
    }
    
    /**
     * Verifica se os timestamps são no formato ISO
     * @param {Array} chunk - Amostra de logs
     * @returns {boolean} - True se estiverem no formato ISO
     */
    checkIfTimestampISO(chunk) {
        if (chunk.length === 0) return true;
        
        // Verificar o primeiro elemento como amostra
        const timestamp = chunk[0].timestamp;
        return typeof timestamp === 'string' && 
               /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(timestamp);
    }
    
    /**
     * Implementação de Radix Sort para timestamps numéricos
     * @param {Array} chunk - Chunk a ser ordenado
     * @returns {Array} - Chunk ordenado
     */
    radixSortTimestamps(chunk) {
        // Implementação simplificada para simulação
        // Em um cenário real, seria necessário decompor os timestamps
        return chunk.sort((a, b) => a.timestamp - b.timestamp);
    }
    
    /**
     * Implementa o k-way merge usando MinHeap
     * @param {Array} sortedChunks - Array de chunks já ordenados
     * @returns {Array} - Resultado final ordenado
     */
    kWayMerge(sortedChunks) {
        // Eliminar chunks vazios
        const nonEmptyChunks = sortedChunks.filter(chunk => chunk.length > 0);
        
        // Se não houver chunks não-vazios, retorne um array vazio
        if (nonEmptyChunks.length === 0) {
            return [];
        }
        
        // Se houver apenas um chunk, retorne-o diretamente
        if (nonEmptyChunks.length === 1) {
            return nonEmptyChunks[0];
        }
        
        // Criar uma min-heap para manter o próximo elemento de cada chunk
        const heap = new MinHeap();
        const chunkPointers = new Array(nonEmptyChunks.length).fill(0);
        
        // Inicializar a heap com o primeiro elemento de cada chunk
        for (let i = 0; i < nonEmptyChunks.length; i++) {
            heap.insert({
                value: nonEmptyChunks[i][0],
                chunkIndex: i
            });
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
            if (chunkPointers[chunkIndex] < nonEmptyChunks[chunkIndex].length) {
                heap.insert({
                    value: nonEmptyChunks[chunkIndex][chunkPointers[chunkIndex]],
                    chunkIndex
                });
            }
        }
        
        return result;
    }
    
    /**
     * Função para visualizar o processo de ordenação
     * @param {Array} logs - Logs a serem visualizados
     * @param {number} limit - Limite de logs a mostrar
     */
    visualizeLogSorting(logs, limit = 5) {
        const displayLogs = logs.slice(0, limit);
        let output = "Logs:\n";
        
        for (const log of displayLogs) {
            output += `[${log.timestamp}] ${log.level}: ${log.message} (${log.source})\n`;
        }
        
        if (logs.length > limit) {
            output += `... e mais ${logs.length - limit} logs\n`;
        }
        
        console.log(output);
    }
}

// Função de demonstração
function demonstrateLogSorting() {
    // Criar dados de exemplo
    const generateRandomLogs = (count) => {
        const logs = [];
        const levels = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
        const sources = ['auth-service', 'user-service', 'payment-service', 'api-gateway'];
        const messages = [
            'Request received', 'User login successful', 'Payment processed',
            'Database query completed', 'Cache miss', 'Rate limit exceeded'
        ];
        
        const now = new Date();
        
        for (let i = 0; i < count; i++) {
            // Gerar timestamp aleatório dentro de 1 dia
            const timestamp = new Date(now - Math.random() * 24 * 60 * 60 * 1000);
            
            logs.push({
                timestamp: timestamp.toISOString(),
                level: levels[Math.floor(Math.random() * levels.length)],
                message: messages[Math.floor(Math.random() * messages.length)],
                source: sources[Math.floor(Math.random() * sources.length)]
            });
        }
        
        return logs;
    };
    
    // Gerar 100 logs aleatórios para teste
    const logs = generateRandomLogs(100);
    
    console.log("===== DEMONSTRAÇÃO DE ORDENAÇÃO EXTERNA DE LOGS =====");
    
    // Criar instância com limite pequeno para forçar múltiplos chunks
    const sorter = new LogSorter(2000); // 2KB simulados (=10 logs)
    
    console.log("\nLogs antes da ordenação:");
    sorter.visualizeLogSorting(logs);
    
    // Ordenar os logs
    const sortedLogs = sorter.sortLargeFile(logs, true);
    
    console.log("\nLogs após ordenação:");
    sorter.visualizeLogSorting(sortedLogs);
    
    // Verificar se está ordenado
    let isOrdered = true;
    for (let i = 1; i < sortedLogs.length; i++) {
        if (new Date(sortedLogs[i].timestamp) < new Date(sortedLogs[i-1].timestamp)) {
            isOrdered = false;
            break;
        }
    }
    
    console.log(`\nOrdenação correta: ${isOrdered ? 'SIM ✅' : 'NÃO ❌'}`);
}

// Executar a demonstração
// demonstrateLogSorting();

// Exportar classes para uso em outros arquivos
module.exports = { LogSorter, MinHeap }; 