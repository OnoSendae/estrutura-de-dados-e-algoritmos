

## Módulo 5: Tabelas Hash e Funções Hash

### 2. Funções Hash: Características e Tipos

Uma função hash é como uma impressão digital digital - ela transforma qualquer dado em um identificador único e de tamanho fixo. Imagine um chef experiente que pode identificar todos os ingredientes de um prato apenas pelo aroma!

#### Analogia: O Chef Sommelier 👨‍🍳

Pense em um sommelier que pode identificar vinhos:
- **Vinho complexo**: Dados de entrada (qualquer tamanho)
- **Aroma único**: Valor hash (tamanho fixo)
- **Identificação instantânea**: Transformação rápida e determinística

#### Propriedades de Boas Funções Hash:

**1. Determinística**
- A mesma entrada sempre gera a mesma saída
- Como uma receita de bolo: mesmos ingredientes = mesmo resultado

**2. Uniformidade**
- Distribui valores pelo espaço disponível
- Como semear um jardim: espalhar sementes igualmente

**3. Eficiência**
- Rápida de calcular
- Como uma calculadora: resposta instantânea

**4. Sensibilidade**
- Pequenas mudanças na entrada causam grandes mudanças na saída
- Como pegadas na areia: cada pisada é única

### Tipos de Funções Hash:

#### 1. Método da Divisão

```javascript
function divisionHash(key, tableSize) {
    // Converte chave para número
    if (typeof key === 'string') {
        let numericKey = 0;
        for (let i = 0; i < key.length; i++) {
            numericKey += key.charCodeAt(i);
        }
        return numericKey % tableSize;
    }
    return key % tableSize;
}

// Testando o método da divisão
console.log(divisionHash("gato", 10));  // Exemplo: 3
console.log(divisionHash("cão", 10));   // Exemplo: 7
console.log(divisionHash(42, 10));      // 2
```

#### 2. Método da Multiplicação

```javascript
function multiplicationHash(key, tableSize) {
    const A = 0.618033988749895; // (√5 - 1) / 2 (proporção áurea)
    let numericKey = 0;
    
    if (typeof key === 'string') {
        for (let i = 0; i < key.length; i++) {
            numericKey += key.charCodeAt(i);
        }
    } else {
        numericKey = key;
    }
    
    const fractionalPart = (numericKey * A) % 1;
    return Math.floor(tableSize * fractionalPart);
}

// Testando o método da multiplicação
console.log(multiplicationHash("hello", 1000));
console.log(multiplicationHash("world", 1000));
```

#### 3. Função Hash Universal

```javascript
class UniversalHash {
    constructor(tableSize) {
        this.tableSize = tableSize;
        this.prime = this.findLargePrime(tableSize);
        this.a = Math.floor(Math.random() * (this.prime - 1)) + 1;
        this.b = Math.floor(Math.random() * this.prime);
    }
    
    hash(key) {
        // Converter string para número
        let numericKey = 0;
        if (typeof key === 'string') {
            for (let i = 0; i < key.length; i++) {
                numericKey += key.charCodeAt(i) * Math.pow(31, i);
            }
        } else {
            numericKey = key;
        }
        
        return ((this.a * numericKey + this.b) % this.prime) % this.tableSize;
    }
    
    findLargePrime(n) {
        let prime = n * 2;
        while (!this.isPrime(prime)) {
            prime++;
        }
        return prime;
    }
    
    isPrime(num) {
        for (let i = 2; i <= Math.sqrt(num); i++) {
            if (num % i === 0) return false;
        }
        return num > 1;
    }
}

// Testando função hash universal
const universalHash = new UniversalHash(100);
console.log(universalHash.hash("javascript"));
console.log(universalHash.hash("python"));
```

### Exercício Prático 1: Teste de Distribuição

```javascript
// Analisar distribuição de uma função hash
function analyzeDistribution(hashFunction, testKeys, tableSize) {
    const distribution = new Array(tableSize).fill(0);
    
    testKeys.forEach(key => {
        const index = hashFunction(key, tableSize);
        distribution[index]++;
    });
    
    // Calcular desvio padrão (mede uniformidade)
    const mean = testKeys.length / tableSize;
    const variance = distribution.reduce((acc, count) => 
        acc + Math.pow(count - mean, 2), 0) / tableSize;
    const stdDev = Math.sqrt(variance);
    
    return {
        distribution,
        standardDeviation: stdDev,
        uniformity: 1 - (stdDev / mean) // 1 = perfeito, 0 = terrível
    };
}

// Gerar dados de teste
const generateTestKeys = (count) => {
    const keys = [];
    for (let i = 0; i < count; i++) {
        keys.push(`key${i}_${Math.random().toString(36).substr(2, 9)}`);
    }
    return keys;
};

// Testar diferentes funções hash
const testKeys = generateTestKeys(1000);
console.log("Divisão:", analyzeDistribution(divisionHash, testKeys, 100));
console.log("Multiplicação:", analyzeDistribution(multiplicationHash, testKeys, 100));
```

### Analogia: Funções Hash como Códigos Postais 📫

```javascript
// Sistema de endereçamento postal
class PostalSystem {
    constructor(regions) {
        this.regions = regions;
    }
    
    // Hash baseado em CEP
    getRegion(address) {
        const zip = address.match(/\d{5}-?\d{3}/)?.[0] || '';
        const numeric = zip.replace(/\D/g, '');
        const regionCode = parseInt(numeric.slice(0, 1));
        return this.regions[regionCode] || 'Região Desconhecida';
    }
}

const brasil = new PostalSystem([
    'São Paulo',      // 0xxxx-xxx
    'Rio de Janeiro', // 1xxxx-xxx
    'Brasília',       // 2xxxx-xxx
    'Minas Gerais',   // 3xxxx-xxx
    'Paraná',         // 4xxxx-xxx
    'Sul',            // 5xxxx-xxx
    'Nordeste',       // 6xxxx-xxx
    'Centro-Oeste',   // 7xxxx-xxx
    'Norte',          // 8xxxx-xxx
    'Especial'        // 9xxxx-xxx
]);

console.log(brasil.getRegion("01234-567")); // São Paulo
console.log(brasil.getRegion("22000-000")); // Rio de Janeiro
```

### Exercício Prático 2: Construa sua própria função hash

```javascript
// Desafio: Criar uma função hash para senhas
// Requisitos:
// 1. Sensível a maiúsculas/minúsculas
// 2. Considera todos os caracteres
// 3. Produz saída de 8 dígitos

function passwordHash(password) {
    // TODO: Implementar sua função hash
    // Dicas:
    // - Use charCodeAt() para pegar valor ASCII
    // - Multiplicadores diferentes para cada posição
    // - Combine operações matemáticas (soma, multiplicação, XOR)
    
    return "12345678"; // Substitua pela sua implementação
}

// Teste sua função
const passwords = [
    "password123",
    "Password123",
    "passwoRd123",
    "123password",
];

console.log("=== Teste de Senhas ===");
passwords.forEach(pwd => {
    console.log(`${pwd}: ${passwordHash(pwd)}`);
});

// Verifique:
// 1. Senhas diferentes geram hashes diferentes?
// 2. Pequenas mudanças causam grandes diferenças no hash?
```

### Funções Hash em Ação: Real-world Examples

```javascript
// 1. Sistema de cache de banco de dados
class DatabaseCache {
    constructor() {
        this.cache = new Map();
    }
    
    generateQueryHash(sql, params) {
        const combined = sql + JSON.stringify(params);
        return this.simpleHash(combined);
    }
    
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString(36);
    }
    
    query(sql, params) {
        const queryHash = this.generateQueryHash(sql, params);
        if (this.cache.has(queryHash)) {
            console.log("Cache hit!");
            return this.cache.get(queryHash);
        }
        
        // Simular consulta ao banco
        console.log("Cache miss - querying database...");
        const result = { data: `Result for ${sql}` };
        this.cache.set(queryHash, result);
        return result;
    }
}

// Testando o cache
const dbCache = new DatabaseCache();
dbCache.query("SELECT * FROM users WHERE id = ?", [1]);
dbCache.query("SELECT * FROM users WHERE id = ?", [1]); // Cache hit!
dbCache.query("SELECT * FROM users WHERE id = ?", [2]); // Cache miss
```

### Desafio: Detector de Plágio

```javascript
// Implemente um detector de plágio usando funções hash
class PlagiarismDetector {
    constructor() {
        this.documents = new Map();
    }
    
    // Adiciona documento ao sistema
    addDocument(title, content) {
        const fingerprint = this.generateFingerprint(content);
        this.documents.set(title, fingerprint);
    }
    
    // Gera impressão digital do documento
    generateFingerprint(content) {
        // TODO: Implementar
        // Dicas:
        // 1. Normalize o texto (lowercase, remove pontuação)
        // 2. Crie uma lista de sentenças únicas
        // 3. Gere hash para cada sentença
        // 4. Retorne um Set de hashes
    }
    
    // Verifica similaridade entre documentos
    checkSimilarity(content1, content2) {
        const fp1 = this.generateFingerprint(content1);
        const fp2 = this.generateFingerprint(content2);
        
        // TODO: Calcular similaridade
        // Dica: Use interseção de conjuntos
    }
}

// Teste o detector
const detector = new PlagiarismDetector();
const text1 = "A função hash é uma ferramenta fundamental. Ela transforma dados em índices.";
const text2 = "Uma função hash é crucial. Transforma dados em índices eficientemente.";
const text3 = "JavaScript é uma linguagem de programação popular.";

// Adicionar e comparar textos
```

### Performance Comparison:

```javascript
// Comparar performance de diferentes funções hash
function benchmarkHashFunctions() {
    const testData = generateTestKeys(10000);
    const tableSize = 1000;
    
    const functions = {
        Division: divisionHash,
        Multiplication: multiplicationHash,
        // Adicione outras funções aqui
    };
    
    Object.entries(functions).forEach(([name, func]) => {
        console.time(name);
        testData.forEach(key => func(key, tableSize));
        console.timeEnd(name);
    });
}

benchmarkHashFunctions();
```

### Resumo da Aula:

**Pontos-chave:**
1. Boas funções hash são determinísticas, uniformes e eficientes
2. Diferentes métodos servem para diferentes propósitos
3. A escolha da função hash impacta diretamente o desempenho

**Pergunta de verificação:**
Qual função hash você escolheria para um sistema de cache? Por quê?

**Próxima aula:** Tratamento de Colisões - quando duas chaves querem o mesmo lugar!
