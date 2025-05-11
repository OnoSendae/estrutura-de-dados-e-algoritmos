

## Módulo 5: Tabelas Hash e Funções Hash

### 4. Rehashing e Fatores de Carga

O fator de carga é como o nível de água em uma piscina - muito baixo desperdiça espaço, muito alto pode causar transbordamento. Rehashing é como esvaziar e encher uma piscina maior quando ela fica muito cheia!

#### Analogia: Sala de Aula Dinâmica 🏫

Imagine uma sala de aula:
- **Fator de carga**: Número de alunos / Número de cadeiras
- **Rehashing**: Mudar para uma sala maior quando fica muito cheia
- **Redistribuição**: Rearranjar os alunos na nova sala

#### O que é Fator de Carga?

```javascript
// Demonstração do conceito de fator de carga
class LoadFactorDemo {
    constructor(size) {
        this.size = size;
        this.count = 0;
        this.data = new Array(size).fill(null);
    }
    
    add(item) {
        if (this.count < this.size) {
            this.data[this.count] = item;
            this.count++;
        }
        this.showLoadFactor();
    }
    
    remove() {
        if (this.count > 0) {
            this.data[this.count - 1] = null;
            this.count--;
        }
        this.showLoadFactor();
    }
    
    showLoadFactor() {
        const loadFactor = this.count / this.size;
        console.log(`Fator de carga: ${loadFactor.toFixed(2)} (${this.count}/${this.size})`);
        console.log(`Status: ${this.getStatus(loadFactor)}\n`);
    }
    
    getStatus(loadFactor) {
        if (loadFactor < 0.25) return "Subutilizado 📉";
        if (loadFactor < 0.75) return "Ideal ✅";
        if (loadFactor < 0.9) return "Pesado ⚠️";
        return "Crítico 🚨";
    }
}

// Demonstração
const room = new LoadFactorDemo(10);
console.log("Adicionando itens...");
for (let i = 1; i <= 12; i++) {
    room.add(`Aluno ${i}`);
}
```

### Implementação de Hash Table com Rehashing

```javascript
class DynamicHashTable {
    constructor(initialSize = 8) {
        this.size = initialSize;
        this.count = 0;
        this.keys = new Array(this.size).fill(null);
        this.values = new Array(this.size).fill(null);
        this.resizeThreshold = 0.75; // Fator de carga máximo
        this.resizeCount = 0;
    }
    
    hash(key) {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = (hash + key.charCodeAt(i) * i) % this.size;
        }
        return hash;
    }
    
    set(key, value) {
        // Verifica se precisa redimensionar
        if (this.getLoadFactor() >= this.resizeThreshold) {
            console.log(`\n🔄 Fator de carga crítico (${this.getLoadFactor().toFixed(2)}). Iniciando rehashing...`);
            this.resize();
        }
        
        let index = this.hash(key);
        let originalIndex = index;
        let i = 0;
        
        // Linear probing para encontrar posição
        while (this.keys[index] !== null && this.keys[index] !== key) {
            i++;
            index = (originalIndex + i) % this.size;
            
            // Evita loop infinito
            if (i >= this.size) {
                console.log("Erro: Tabela cheia!");
                return false;
            }
        }
        
        // Se é uma chave nova, incrementa contador
        if (this.keys[index] === null) {
            this.count++;
        }
        
        this.keys[index] = key;
        this.values[index] = value;
        
        console.log(`✅ ${key} → posição ${index} | Fator de carga: ${this.getLoadFactor().toFixed(2)}`);
        return true;
    }
    
    get(key) {
        let index = this.hash(key);
        let originalIndex = index;
        let i = 0;
        
        while (this.keys[index] !== null && i < this.size) {
            if (this.keys[index] === key) {
                return this.values[index];
            }
            i++;
            index = (originalIndex + i) % this.size;
        }
        
        return undefined;
    }
    
    resize() {
        const oldKeys = this.keys;
        const oldValues = this.values;
        const oldSize = this.size;
        
        // Dobra o tamanho
        this.size = oldSize * 2;
        this.keys = new Array(this.size).fill(null);
        this.values = new Array(this.size).fill(null);
        this.count = 0;
        this.resizeCount++;
        
        console.log(`📈 Redimensionando de ${oldSize} para ${this.size} posições`);
        
        // Reinserir todos os elementos
        for (let i = 0; i < oldSize; i++) {
            if (oldKeys[i] !== null) {
                console.log(`   Reinserindo ${oldKeys[i]}...`);
                this.set(oldKeys[i], oldValues[i]);
            }
        }
        
        console.log(`✨ Rehashing completo! Novo fator de carga: ${this.getLoadFactor().toFixed(2)}\n`);
    }
    
    getLoadFactor() {
        return this.count / this.size;
    }
    
    getStats() {
        return {
            size: this.size,
            count: this.count,
            loadFactor: this.getLoadFactor(),
            resizeCount: this.resizeCount
        };
    }
    
    visualize() {
        console.log("\n=== Visualização da Tabela Hash ===");
        console.log(`Tamanho: ${this.size} | Elementos: ${this.count} | Fator de carga: ${this.getLoadFactor().toFixed(2)}`);
        console.log(`Redimensionamentos: ${this.resizeCount}\n`);
        
        let visualString = "";
        for (let i = 0; i < this.size; i++) {
            const status = this.keys[i] ? "■" : "□";
            visualString += status;
            if ((i + 1) % 20 === 0) visualString += "\n";
        }
        console.log(visualString);
    }
}

// Demonstração de rehashing em ação
const hashTable = new DynamicHashTable(4);

// Adiciona elementos até forçar rehashing
console.log("=== Testando Rehashing Dinâmico ===\n");
const testKeys = [
    "apple", "banana", "cherry", "date", "elderberry",
    "fig", "grape", "honeydew", "kiwi", "lemon"
];

testKeys.forEach(key => {
    hashTable.set(key, `valor_${key}`);
});

hashTable.visualize();
```

### Estratégias de Redimensionamento

```javascript
class ResizingStrategies {
    // Estratégia 1: Duplicar tamanho
    static doubleSize(currentSize) {
        return currentSize * 2;
    }
    
    // Estratégia 2: Redimensionamento gradual
    static gradualResize(currentSize) {
        return Math.floor(currentSize * 1.5);
    }
    
    // Estratégia 3: Baseado em números primos
    static primeResize(currentSize) {
        let newSize = currentSize * 2;
        while (!this.isPrime(newSize)) {
            newSize++;
        }
        return newSize;
    }
    
    static isPrime(num) {
        if (num <= 1) return false;
        for (let i = 2; i <= Math.sqrt(num); i++) {
            if (num % i === 0) return false;
        }
        return true;
    }
}

// Comparando estratégias
class StrategyComparison {
    static compare(initialSize, iterations) {
        console.log("\n=== Comparação de Estratégias de Redimensionamento ===\n");
        
        const strategies = {
            "Duplicar": ResizingStrategies.doubleSize,
            "Gradual": ResizingStrategies.gradualResize,
            "Primos": ResizingStrategies.primeResize
        };
        
        Object.entries(strategies).forEach(([name, strategy]) => {
            let size = initialSize;
            console.log(`${name}:`);
            console.log(`Inicial: ${size}`);
            
            for (let i = 0; i < iterations; i++) {
                size = strategy(size);
                console.log(`   → ${size}`);
            }
        });
    }
}

StrategyComparison.compare(8, 5);
```

### Analogia: Sistema de Biblioteca 📚

```javascript
class DynamicLibrary {
    constructor(initialShelves) {
        this.shelves = new Array(initialShelves).fill(null).map(() => []);
        this.totalBooks = 0;
        this.shelfLimit = 5; // máximo de livros por prateleira
    }
    
    addBook(book) {
        const shelfIndex = this.hash(book.title);
        const shelf = this.shelves[shelfIndex];
        
        shelf.push(book);
        this.totalBooks++;
        
        console.log(`📚 ${book.title} adicionado à prateleira ${shelfIndex}`);
        
        // Verifica se a biblioteca está lotada
        if (this.needsExpansion()) {
            console.log("\n🏗️ Biblioteca lotada! Construindo novo andar...");
            this.expand();
        }
    }
    
    needsExpansion() {
        // Verifica se alguma prateleira está sobrecarregada
        return this.shelves.some(shelf => shelf.length > this.shelfLimit);
    }
    
    expand() {
        // Dobra o número de prateleiras
        const oldShelves = this.shelves;
        this.shelves = new Array(oldShelves.length * 2).fill(null).map(() => []);
        this.totalBooks = 0;
        
        // Redistribui todos os livros
        oldShelves.forEach(shelf => {
            shelf.forEach(book => {
                const newShelfIndex = this.hash(book.title);
                this.shelves[newShelfIndex].push(book);
                this.totalBooks++;
            });
        });
        
        console.log(`✨ Biblioteca expandida para ${this.shelves.length} prateleiras`);
    }
    
    hash(title) {
        let hash = 0;
        for (let i = 0; i < title.length; i++) {
            hash += title.charCodeAt(i);
        }
        return hash % this.shelves.length;
    }
    
    visualize() {
        console.log("\n=== Estado da Biblioteca ===");
        this.shelves.forEach((shelf, index) => {
            console.log(`Prateleira ${index}: ${shelf.length} livros ${
                shelf.length > this.shelfLimit ? "🚨" : "✅"
            }`);
        });
        console.log(`Total de livros: ${this.totalBooks}`);
    }
}

// Testando a biblioteca dinâmica
const library = new DynamicLibrary(4);
const books = [
    { title: "JavaScript", author: "MDN" },
    { title: "Python", author: "Guido" },
    { title: "Java", author: "Oracle" },
    { title: "C++", author: "Stroustrup" },
    { title: "Ruby", author: "Matz" },
    { title: "PHP", author: "Lerdorf" },
    { title: "Go", author: "Google" },
    { title: "Rust", author: "Mozilla" },
];

books.forEach(book => library.addBook(book));
library.visualize();
```

### Exercício Prático 1: Monitor de Performance

```javascript
// Implemente um monitor que avisa quando o fator de carga está crítico
class HashTableMonitor {
    constructor(table) {
        this.table = table;
        this.alerts = [];
        this.metrics = {
            insertions: 0,
            resizes: 0,
            collisions: 0
        };
    }
    
    trackInsertion(key, value) {
        const beforeLoadFactor = this.table.getLoadFactor();
        this.table.set(key, value);
        const afterLoadFactor = this.table.getLoadFactor();
        
        this.metrics.insertions++;
        
        // Detecta resize
        if (afterLoadFactor < beforeLoadFactor) {
            this.metrics.resizes++;
            this.alerts.push({
                type: "RESIZE",
                timestamp: new Date(),
                loadFactorBefore: beforeLoadFactor,
                loadFactorAfter: afterLoadFactor
            });
        }
        
        // Verifica fator de carga
        this.checkLoadFactor(afterLoadFactor);
    }
    
    checkLoadFactor(loadFactor) {
        if (loadFactor > 0.9) {
            this.alerts.push({
                type: "CRITICAL_LOAD",
                timestamp: new Date(),
                loadFactor: loadFactor
            });
        } else if (loadFactor > 0.75) {
            this.alerts.push({
                type: "HIGH_LOAD",
                timestamp: new Date(),
                loadFactor: loadFactor
            });
        }
    }
    
    getReport() {
        return {
            metrics: this.metrics,
            alerts: this.alerts,
            currentLoadFactor: this.table.getLoadFactor(),
            suggestions: this.generateSuggestions()
        };
    }
    
    generateSuggestions() {
        const suggestions = [];
        const loadFactor = this.table.getLoadFactor();
        
        if (loadFactor > 0.9) {
            suggestions.push("Considere aumentar o tamanho inicial da tabela");
        }
        if (this.metrics.resizes > 3) {
            suggestions.push("Muitos redimensionamentos - verifique a função hash");
        }
        if (this.alerts.filter(a => a.type === "CRITICAL_LOAD").length > 0) {
            suggestions.push("Implemente rehashing automático mais agressivo");
        }
        
        return suggestions;
    }
}

// Usando o monitor
const monitoredTable = new DynamicHashTable(8);
const monitor = new HashTableMonitor(monitoredTable);

// Simula carga pesada
for (let i = 0; i < 30; i++) {
    monitor.trackInsertion(`key${i}`, `value${i}`);
}

console.log("\n=== Relatório do Monitor ===");
console.log(monitor.getReport());
```

### Exercício Prático 2: Simulador de Sistemas

```javascript
// Simule um sistema com diferentes estratégias de rehashing
class SystemSimulator {
    static simulate(config) {
        console.log(`\n=== Simulação: ${config.name} ===`);
        
        const table = new DynamicHashTable(config.initialSize);
        table.resizeThreshold = config.threshold;
        
        const operations = config.operations;
        const startTime = Date.now();
        
        operations.forEach((op, index) => {
            if (op.type === 'insert') {
                table.set(op.key, op.value);
            } else if (op.type === 'read') {
                table.get(op.key);
            }
            
            // Registra estado a cada 10 operações
            if (index % 10 === 0) {
                console.log(`Op ${index}: LF=${table.getLoadFactor().toFixed(2)}, Size=${table.size}`);
            }
        });
        
        const duration = Date.now() - startTime;
        const stats = table.getStats();
        
        return {
            duration,
            finalLoadFactor: stats.loadFactor,
            totalResizes: stats.resizeCount,
            finalSize: stats.size
        };
    }
}

// Configurações de teste
const simulations = [
    {
        name: "Sistema de Cache",
        initialSize: 16,
        threshold: 0.8,
        operations: Array(100).fill().map((_, i) => ({
            type: 'insert',
            key: `cache_${i}`,
            value: `data_${i}`
        }))
    },
    {
        name: "Sistema de Sessão",
        initialSize: 8,
        threshold: 0.6,
        operations: Array(50).fill().map((_, i) => ({
            type: 'insert',
            key: `session_${i}`,
            value: `user_${i}`
        }))
    }
];

// Executa simulações
simulations.forEach(config => {
    const result = SystemSimulator.simulate(config);
    console.log(`\nResultado para ${config.name}:`);
    console.log(`Tempo total: ${result.duration}ms`);
    console.log(`Redimensionamentos: ${result.totalResizes}`);
    console.log(`Tamanho final: ${result.finalSize}`);
    console.log(`Fator de carga final: ${result.finalLoadFactor.toFixed(2)}`);
});
```

### Métricas de Performance

```javascript
// Análise de performance com diferentes fatores de carga
function analyzePerformance() {
    const loadFactors = [0.3, 0.5, 0.7, 0.9];
    const results = [];
    
    loadFactors.forEach(targetLF => {
        const table = new DynamicHashTable(100);
        const itemCount = Math.floor(table.size * targetLF);
        
        // Preenche a tabela
        for (let i = 0; i < itemCount; i++) {
            table.set(`key${i}`, `value${i}`);
        }
        
        // Mede performance de inserção
        const insertStart = performance.now();
        table.set("test_key", "test_value");
        const insertTime = performance.now() - insertStart;
        
        // Mede performance de busca
        const searchStart = performance.now();
        table.get("key50");
        const searchTime = performance.now() - searchStart;
        
        results.push({
            loadFactor: targetLF,
            insertTime,
            searchTime,
            size: table.size
        });
    });
    
    console.log("\n=== Análise de Performance ===");
    console.table(results);
}

analyzePerformance();
```

### Resumo da Aula:

**Conceitos-chave:**
1. Fator de carga determina a eficiência da tabela hash
2. Rehashing mantém performance ao expandir a tabela
3. Diferentes estratégias de redimensionamento têm tradeoffs

**Pergunta de verificação:**
Qual fator de carga você escolheria para um sistema de cache em tempo real? Justifique sua resposta considerando performance vs. uso de memória.

**Próxima aula:** Exercícios Práticos com Tabelas Hash - aplicando conhecimentos!
