# Algoritmos e Estrutura de Dados na Prática

## Módulo 5: Tabelas Hash e Funções Hash

### 6. Case Study: Implementação de um Dicionário usando Tabelas Hash

Vamos construir um dicionário profissional do zero! Este projeto integrará todos os conceitos aprendidos: função hash, tratamento de colisões, rehashing e operações eficientes.

#### Analogia: Construindo uma Nova York Digital 🏙️

Imagine que estamos construindo uma cidade digital:
- **Planejamento**: Definir requisitos e arquitetura
- **Infraestrutura**: Implementar a estrutura básica
- **População**: Adicionar dados e funcionalidades
- **Manutenção**: Otimizar e escalar

### Especificação do Projeto

**Requisitos do Dicionário:**
1. Operações básicas O(1): get, set, delete
2. Suporte a diferentes tipos de dados
3. Persistência de dados (serialização)
4. Estatísticas de performance
5. Auto-otimização dinâmica

### Fase 1: Arquitetura Base

```javascript
class Dictionary {
    constructor(options = {}) {
        this.options = {
            initialCapacity: options.initialCapacity || 16,
            loadFactorThreshold: options.loadFactorThreshold || 0.75,
            hashFunction: options.hashFunction || this.defaultHash,
            resizeStrategy: options.resizeStrategy || 'prime'
        };
        
        this.capacity = this.options.initialCapacity;
        this.size = 0;
        this.buckets = new Array(this.capacity);
        this.stats = {
            collisions: 0,
            resizes: 0,
            operations: {
                get: 0,
                set: 0,
                delete: 0
            },
            performanceMetrics: {
                avgGetTime: 0,
                avgSetTime: 0,
                avgDeleteTime: 0
            }
        };
        
        this.initializeBuckets();
    }
    
    // Função hash padrão (DJB2 modificada)
    defaultHash(key) {
        let hash = 5381;
        const str = String(key);
        
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) + hash) + str.charCodeAt(i);
        }
        
        return hash >>> 0; // Converte para unsigned 32-bit integer
    }
    
    // Inicializa buckets com encadeamento
    initializeBuckets() {
        for (let i = 0; i < this.capacity; i++) {
            this.buckets[i] = [];
        }
    }
}
```

### Fase 2: Operações Fundamentais

```javascript
// Continuação da classe Dictionary
class Dictionary {
    // ... código anterior ...
    
    set(key, value) {
        const startTime = performance.now();
        this.stats.operations.set++;
        
        const index = this.getIndex(key);
        const bucket = this.buckets[index];
        
        // Procura por chave existente
        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i].key === key) {
                bucket[i].value = value;
                bucket[i].timestamp = Date.now();
                this.updatePerformanceMetric('set', startTime);
                return;
            }
        }
        
        // Adiciona nova entrada
        bucket.push({
            key,
            value,
            timestamp: Date.now()
        });
        
        this.size++;
        
        // Registra colisão se bucket não estava vazio
        if (bucket.length > 1) {
            this.stats.collisions++;
        }
        
        // Verifica se precisa redimensionar
        if (this.getLoadFactor() > this.options.loadFactorThreshold) {
            this.resize();
        }
        
        this.updatePerformanceMetric('set', startTime);
    }
    
    get(key) {
        const startTime = performance.now();
        this.stats.operations.get++;
        
        const index = this.getIndex(key);
        const bucket = this.buckets[index];
        
        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i].key === key) {
                this.updatePerformanceMetric('get', startTime);
                return bucket[i].value;
            }
        }
        
        this.updatePerformanceMetric('get', startTime);
        return undefined;
    }
    
    delete(key) {
        const startTime = performance.now();
        this.stats.operations.delete++;
        
        const index = this.getIndex(key);
        const bucket = this.buckets[index];
        
        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i].key === key) {
                bucket.splice(i, 1);
                this.size--;
                this.updatePerformanceMetric('delete', startTime);
                return true;
            }
        }
        
        this.updatePerformanceMetric('delete', startTime);
        return false;
    }
    
    // Métodos auxiliares
    getIndex(key) {
        return this.options.hashFunction(key) % this.capacity;
    }
    
    getLoadFactor() {
        return this.size / this.capacity;
    }
    
    updatePerformanceMetric(operation, startTime) {
        const duration = performance.now() - startTime;
        const ops = this.stats.operations[operation];
        const currentAvg = this.stats.performanceMetrics[`avg${operation.charAt(0).toUpperCase() + operation.slice(1)}Time`];
        
        // Média móvel para performance
        this.stats.performanceMetrics[`avg${operation.charAt(0).toUpperCase() + operation.slice(1)}Time`] = 
            (currentAvg * (ops - 1) + duration) / ops;
    }
}
```

### Fase 3: Redimensionamento Inteligente

```javascript
// Continuação da classe Dictionary
class Dictionary {
    // ... código anterior ...
    
    resize() {
        this.stats.resizes++;
        console.log(`🔄 Redimensionando: ${this.capacity} → `, end='');
        
        const oldBuckets = this.buckets;
        const oldCapacity = this.capacity;
        
        // Determina nova capacidade baseado na estratégia
        this.capacity = this.calculateNewCapacity();
        console.log(this.capacity);
        
        // Reinicializa buckets
        this.buckets = new Array(this.capacity);
        this.initializeBuckets();
        
        // Reinserir todos os elementos
        this.size = 0;
        let reinsertedEntries = 0;
        
        for (let i = 0; i < oldCapacity; i++) {
            for (let j = 0; j < oldBuckets[i].length; j++) {
                const entry = oldBuckets[i][j];
                this.set(entry.key, entry.value);
                reinsertedEntries++;
            }
        }
        
        console.log(`✅ Redimensionamento completo. ${reinsertedEntries} entradas reinseridas`);
    }
    
    calculateNewCapacity() {
        if (this.options.resizeStrategy === 'double') {
            return this.capacity * 2;
        } else if (this.options.resizeStrategy === 'prime') {
            return this.findNextPrime(this.capacity * 2);
        } else {
            // Estratégia personalizada
            return this.options.resizeStrategy(this.capacity);
        }
    }
    
    findNextPrime(n) {
        let num = n;
        while (!this.isPrime(num)) {
            num++;
        }
        return num;
    }
    
    isPrime(n) {
        if (n < 2) return false;
        for (let i = 2; i <= Math.sqrt(n); i++) {
            if (n % i === 0) return false;
        }
        return true;
    }
}
```

### Fase 4: Funcionalidades Avançadas

```javascript
// Continuação da classe Dictionary
class Dictionary {
    // ... código anterior ...
    
    // Iteração e visualização
    *entries() {
        for (let i = 0; i < this.capacity; i++) {
            for (let j = 0; j < this.buckets[i].length; j++) {
                const entry = this.buckets[i][j];
                yield [entry.key, entry.value];
            }
        }
    }
    
    keys() {
        return Array.from(this.entries()).map(([key]) => key);
    }
    
    values() {
        return Array.from(this.entries()).map(([, value]) => value);
    }
    
    // Serialização e persistência
    toJSON() {
        return {
            capacity: this.capacity,
            size: this.size,
            data: Array.from(this.entries()),
            stats: this.stats,
            options: this.options
        };
    }
    
    static fromJSON(json) {
        const dict = new Dictionary(json.options);
        json.data.forEach(([key, value]) => dict.set(key, value));
        dict.stats = json.stats;
        return dict;
    }
    
    // Persistência em localStorage
    save(key = 'dictionary') {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(this.toJSON()));
        }
    }
    
    static load(key = 'dictionary') {
        if (typeof localStorage !== 'undefined') {
            const stored = localStorage.getItem(key);
            if (stored) {
                return Dictionary.fromJSON(JSON.parse(stored));
            }
        }
        return new Dictionary();
    }
    
    // Análise de performance
    analyze() {
        const analysis = {
            efficiency: this.calculateEfficiency(),
            distribution: this.analyzeDistribution(),
            collisionRate: this.stats.collisions / this.stats.operations.set,
            recommendedActions: this.generateRecommendations()
        };
        
        return analysis;
    }
    
    calculateEfficiency() {
        const avgBucketLength = this.size / this.capacity;
        const worstCaseDepth = Math.max(...this.buckets.map(b => b.length));
        
        return {
            loadFactor: this.getLoadFactor(),
            avgChainLength: avgBucketLength,
            worstChainLength: worstCaseDepth,
            efficiencyScore: (1 - (avgBucketLength - 1)) * 100 // percentage
        };
    }
    
    analyzeDistribution() {
        const distribution = new Array(this.capacity).fill(0);
        this.buckets.forEach((bucket, index) => {
            distribution[index] = bucket.length;
        });
        
        return {
            histogram: distribution,
            standardDeviation: this.calculateStdDev(distribution),
            isUniform: this.checkUniformity(distribution)
        };
    }
    
    calculateStdDev(arr) {
        const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
        const variance = arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length;
        return Math.sqrt(variance);
    }
    
    checkUniformity(distribution) {
        const mean = distribution.reduce((a, b) => a + b, 0) / distribution.length;
        const stdDev = this.calculateStdDev(distribution);
        return stdDev / mean < 0.2; // 20% é considerado uniforme
    }
    
    generateRecommendations() {
        const recommendations = [];
        const efficiency = this.calculateEfficiency();
        
        if (efficiency.worstChainLength > 5) {
            recommendations.push("Considere aumentar o tamanho da tabela ou mudar a função hash");
        }
        
        if (this.stats.collisions / this.stats.operations.set > 0.3) {
            recommendations.push("Taxa de colisão alta. Revise a função hash");
        }
        
        if (!this.analyzeDistribution().isUniform) {
            recommendations.push("Distribuição não uniforme. Ajuste a função hash");
        }
        
        if (this.stats.performanceMetrics.avgSetTime > 1) {
            recommendations.push("Operações de inserção lentas. Verifique o tamanho da tabela");
        }
        
        return recommendations;
    }
    
    // Visualização no console
    visualize() {
        console.log('\n=== Dicionário Hash ===');
        console.log(`Tamanho: ${this.size} | Capacidade: ${this.capacity}`);
        console.log(`Fator de carga: ${this.getLoadFactor().toFixed(3)}`);
        console.log(`Colisões: ${this.stats.collisions}`);
        
        console.log('\nDistribuição dos Buckets:');
        this.buckets.forEach((bucket, index) => {
            const visual = '█'.repeat(bucket.length);
            const status = bucket.length > 2 ? ' ⚠️' : '';
            console.log(`B${index.toString().padStart(2)}: ${visual.padEnd(10)} (${bucket.length})${status}`);
        });
        
        console.log('\nPerformance Média (ms):');
        console.log(`GET: ${this.stats.performanceMetrics.avgGetTime.toFixed(4)}`);
        console.log(`SET: ${this.stats.performanceMetrics.avgSetTime.toFixed(4)}`);
        console.log(`DEL: ${this.stats.performanceMetrics.avgDeleteTime.toFixed(4)}`);
    }
}
```

### Fase 5: Sistema de Controle de Versão

```javascript
// Expandindo o Dictionary com versionamento
class VersionedDictionary extends Dictionary {
    constructor(options = {}) {
        super(options);
        this.versions = new Map(); // key -> versão atual
        this.history = new Map(); // key -> array de versões
        this.currentVersion = 0;
    }
    
    set(key, value) {
        const oldValue = this.get(key);
        super.set(key, value);
        
        this.currentVersion++;
        this.versions.set(key, this.currentVersion);
        
        if (!this.history.has(key)) {
            this.history.set(key, []);
        }
        
        this.history.get(key).push({
            version: this.currentVersion,
            value: value,
            oldValue: oldValue,
            timestamp: Date.now()
        });
    }
    
    getHistory(key) {
        return this.history.get(key) || [];
    }
    
    rollback(key, version) {
        const keyHistory = this.history.get(key);
        if (!keyHistory) return false;
        
        const targetVersion = keyHistory.find(v => v.version === version);
        if (!targetVersion) return false;
        
        super.set(key, targetVersion.value);
        return true;
    }
    
    diff(key, version1, version2) {
        const history = this.getHistory(key);
        const v1 = history.find(v => v.version === version1);
        const v2 = history.find(v => v.version === version2);
        
        if (!v1 || !v2) return null;
        
        return {
            key,
            version1: version1,
            version2: version2,
            value1: v1.value,
            value2: v2.value,
            changed: v1.value !== v2.value
        };
    }
}
```

### Demonstração Completa

```javascript
// Testando o dicionário completo
console.log('=== Case Study: Dicionário Hash Profissional ===\n');

// Criação com opções personalizadas
const dict = new Dictionary({
    initialCapacity: 8,
    loadFactorThreshold: 0.7,
    resizeStrategy: 'prime'
});

// Simulando uso realista
console.log('1. Adicionando dados de contatos...');
const contacts = [
    { name: 'Alice', phone: '555-0101', email: 'alice@email.com' },
    { name: 'Bob', phone: '555-0102', email: 'bob@email.com' },
    { name: 'Charlie', phone: '555-0103', email: 'charlie@email.com' },
    { name: 'David', phone: '555-0104', email: 'david@email.com' },
    { name: 'Eva', phone: '555-0105', email: 'eva@email.com' },
    { name: 'Frank', phone: '555-0106', email: 'frank@email.com' },
    { name: 'Grace', phone: '555-0107', email: 'grace@email.com' },
    { name: 'Henry', phone: '555-0108', email: 'henry@email.com' }
];

contacts.forEach(contact => {
    dict.set(contact.name, contact);
});

console.log('\n2. Verificando dados inseridos:');
console.log('Alice:', dict.get('Alice'));
console.log('Inexistente:', dict.get('Inexistente'));

console.log('\n3. Atualizando dados:');
dict.set('Alice', { ...dict.get('Alice'), phone: '555-9999' });
console.log('Alice atualizada:', dict.get('Alice'));

console.log('\n4. Removendo entrada:');
dict.delete('Frank');
console.log('Frank removido:', dict.get('Frank'));

// Visualização do estado
dict.visualize();

// Análise de performance
console.log('\n5. Análise de Performance:');
const analysis = dict.analyze();
console.log('Eficiência:', analysis.efficiency);
console.log('Recomendações:', analysis.recommendedActions);

// Testando iteração
console.log('\n6. Iterando sobre entradas:');
for (const [key, value] of dict.entries()) {
    console.log(`${key}: ${value.email}`);
}

// Testando persistência
console.log('\n7. Testando persistência:');
dict.save('contactsDictionary');
const loadedDict = Dictionary.load('contactsDictionary');
console.log('Dicionário carregado:', loadedDict.get('Alice'));

// Estressando o sistema
console.log('\n8. Teste de carga:');
const bigDict = new Dictionary();
console.time('Inserção de 10.000 elementos');
for (let i = 0; i < 10000; i++) {
    bigDict.set(`key${i}`, `value${i}`);
}
console.timeEnd('Inserção de 10.000 elementos');

bigDict.visualize();
console.log('Estado final:', bigDict.analyze());
```

### Exemplo de Sistema Real: Cache Distribuído

```javascript
// Implementação de um cache distribuído usando nosso Dictionary
class DistributedCache {
    constructor(nodes = 3) {
        this.nodes = [];
        for (let i = 0; i < nodes; i++) {
            this.nodes.push(new Dictionary());
        }
        this.nodeCount = nodes;
    }
    
    getNode(key) {
        // Consistent hashing simples
        const hash = this.hash(key);
        return this.nodes[hash % this.nodeCount];
    }
    
    hash(key) {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = ((hash << 5) - hash) + key.charCodeAt(i);
        }
        return hash >>> 0;
    }
    
    set(key, value, ttl = Infinity) {
        const node = this.getNode(key);
        node.set(key, {
            value: value,
            expires: Date.now() + ttl
        });
    }
    
    get(key) {
        const node = this.getNode(key);
        const entry = node.get(key);
        
        if (!entry) return undefined;
        
        if (Date.now() > entry.expires) {
            node.delete(key);
            return undefined;
        }
        
        return entry.value;
    }
    
    // Visualização do cluster
    visualizeCluster() {
        console.log('\n=== Cluster de Cache Distribuído ===');
        this.nodes.forEach((node, index) => {
            console.log(`\nNó ${index} - Tamanho: ${node.size}`);
            console.log(`Fator de carga: ${node.getLoadFactor().toFixed(3)}`);
        });
    }
}

// Testando cache distribuído
const cache = new DistributedCache();
cache.set('user:123', { name: 'João', age: 30 }, 5000); // 5 segundos
cache.set('product:456', { name: 'Notebook', price: 2000 });
cache.set('session:789', { token: 'abc123' });

console.log('Usuário:', cache.get('user:123'));
setTimeout(() => {
    console.log('Usuário após TTL:', cache.get('user:123')); // undefined
}, 6000);

cache.visualizeCluster();
```

### Resumo do Case Study:

**Conceitos Aplicados:**
1. ✓ Design de estrutura de dados profissional
2. ✓ Implementação de todas as operações fundamentais
3. ✓ Redimensionamento inteligente e automático
4. ✓ Monitoramento de performance
5. ✓ Serialização e persistência
6. ✓ Análise e recomendações automáticas
7. ✓ Visualização para debugging
8. ✓ Extensão para sistemas distribuídos

**Lições Aprendidas:**
- Decisões de design afetam diretamente a performance
- Monitoramento é essencial para sistemas de produção
- Visualização ajuda muito no debugging
- Flexibilidade permite adaptação a diferentes necessidades

**Desafios Propostos:**
1. Implementar um mecanismo de travamento (locks) para concorrência
2. Adicionar compressão para valores grandes
3. Implementar sharding automático para escala horizontal
4. Criar um sistema de logging para auditoria

**Pergunta Final:**
Quais otimizações você adicionaria para um sistema de produção com milhões de acessos por segundo?

### Conclusão do Módulo 5:

Você agora domina:
- Fundamentos de tabelas hash
- Diferentes estratégias de hashing
- Tratamento eficiente de colisões
- Redimensionamento dinâmico
- Aplicações práticas em sistemas reais

**Próximo passo:** Aplicar esse conhecimento em problemas reais de engenharia de software!
