# Algoritmos e Estrutura de Dados na Prática

## Módulo 5: Tabelas Hash e Funções Hash

### 5. Exercícios Práticos com Tabelas Hash

Agora é hora de colocar as mãos na massa! Estes exercícios vão testar e expandir seu entendimento de tabelas hash em situações práticas do mundo real.

#### Analogia: Academia de Programação 💪

Pensar em exercícios é como treinar em uma academia:
- **Aquecimento**: Exercícios básicos para revisar conceitos
- **Treino Principal**: Desafios complexos para fortalecer habilidades
- **Alongamento**: Reflexão sobre o aprendizado

### Exercício 1: Sistema de Cache LRU

Implemente um cache LRU (Least Recently Used) usando tabela hash:

```javascript
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map(); // Usado com JavaScript Map que mantém ordem de inserção
        this.hashTable = {}; // Nosso armazenamento principal
    }
    
    get(key) {
        // TODO: Implementar
        // 1. Verificar se a chave existe
        // 2. Se existir, mover para o final (mais recente)
        // 3. Retornar o valor
        // 4. Se não existir, retornar -1 ou undefined
    }
    
    put(key, value) {
        // TODO: Implementar
        // 1. Se a chave existe, atualizar valor e posição
        // 2. Se não existe e cache está cheio, remover o mais antigo
        // 3. Adicionar novo item
    }
    
    display() {
        // Mostra o estado atual do cache
        console.log("Cache state:");
        console.log("Most Recent → Least Recent");
        console.log([...this.cache.keys()].join(" → "));
    }
}

// Teste o cache
const cache = new LRUCache(3);
cache.put("website1", "https://example1.com");
cache.put("website2", "https://example2.com");
cache.display();
// Adicione mais testes aqui!
```

**Solução do Instrutor:**

```javascript
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
    }
    
    get(key) {
        if (!this.cache.has(key)) {
            return -1;
        }
        
        // Remove e reinsere para atualizar posição
        const value = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, value);
        
        return value;
    }
    
    put(key, value) {
        // Se já existe, remove (para reinserir no final)
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }
        // Se está cheio, remove o primeiro (mais antigo)
        else if (this.cache.size >= this.capacity) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        
        this.cache.set(key, value);
    }
    
    display() {
        console.log("\n=== Cache LRU ===");
        console.log("Most Recent → Least Recent");
        console.log([...this.cache.entries()].reverse().map(([k, v]) => `${k}: ${v}`).join("\n"));
    }
}

// Demonstração completa
const cache = new LRUCache(3);
console.log("Testando Cache LRU:");
cache.put("page1", "conteúdo1");
cache.put("page2", "conteúdo2");
cache.put("page3", "conteúdo3");
cache.display();

console.log("\nAcessando 'page1' (move para mais recente):");
cache.get("page1");
cache.display();

console.log("\nAdicionando 'page4' (remove 'page2'):");
cache.put("page4", "conteúdo4");
cache.display();
```

### Exercício 2: Contador de Frequências

Crie um sistema para contar a frequência de palavras em um texto:

```javascript
class WordFrequencyCounter {
    constructor() {
        this.frequencies = {};
    }
    
    countWords(text) {
        // TODO: Implementar
        // 1. Processar texto (remover pontuação, converter para minúsculas)
        // 2. Contar frequência de cada palavra
        // 3. Armazenar em hash table
    }
    
    getTopWords(n) {
        // TODO: Implementar
        // Retornar as n palavras mais frequentes
    }
    
    getWordFrequency(word) {
        // TODO: Implementar
        // Retornar frequência de uma palavra específica
    }
}

// Teste o contador
const counter = new WordFrequencyCounter();
const sampleText = "O gato gato preto atravessou atravessou a rua rua rua";
// Complete o teste
```

**Solução do Instrutor:**

```javascript
class WordFrequencyCounter {
    constructor() {
        this.frequencies = new Map();
    }
    
    countWords(text) {
        // Limpa e processa o texto
        const words = text.toLowerCase()
            .replace(/[^\w\s\u00C0-\u017F]/g, '') // Remove pontuação, mantém acentos
            .split(/\s+/)
            .filter(word => word.length > 0);
        
        // Conta frequência
        this.frequencies.clear();
        words.forEach(word => {
            this.frequencies.set(word, (this.frequencies.get(word) || 0) + 1);
        });
        
        return this.frequencies;
    }
    
    getTopWords(n) {
        return Array.from(this.frequencies.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, n)
            .map(([word, freq]) => ({ word, frequency: freq }));
    }
    
    getWordFrequency(word) {
        return this.frequencies.get(word.toLowerCase()) || 0;
    }
    
    visualize() {
        console.log("\n=== Análise de Frequência ===");
        const sorted = this.getTopWords(10);
        console.log("Top 10 palavras mais frequentes:");
        sorted.forEach(({word, frequency}, index) => {
            const bar = '█'.repeat(frequency);
            console.log(`${index + 1}. ${word.padEnd(15)} │${bar} ${frequency}`);
        });
    }
}

// Demonstração com texto real
const counter = new WordFrequencyCounter();
const longText = `A programação é uma arte que requer prática constante.
    Quanto mais você pratica programação, melhor programador você se torna.
    A chave para dominar a programação é a persistência e dedicação.`;

counter.countWords(longText);
counter.visualize();
console.log(`\nFrequência de 'programação': ${counter.getWordFrequency('programação')}`);
```

### Exercício 3: Sistema de Detecção de Duplicatas

Implemente um sistema que detecta elementos duplicados em streams de dados:

```javascript
class DuplicateDetector {
    constructor() {
        this.seen = {};
        this.duplicates = [];
    }
    
    processStream(dataStream) {
        // TODO: Implementar
        // 1. Para cada item no stream
        // 2. Verificar se já foi visto
        // 3. Se duplicado, adicionar à lista de duplicatas
        // 4. Atualizar registro de itens vistos
    }
    
    hasDuplicate(item) {
        // TODO: Implementar
        // Verifica se um item específico é duplicata
    }
    
    getStats() {
        // TODO: Implementar
        // Retorna estatísticas do processamento
    }
}

// Teste o detector
const detector = new DuplicateDetector();
const dataStream = [1, 2, 3, 2, 4, 5, 1, 6, 7];
// Complete o teste
```

**Solução do Instrutor:**

```javascript
class DuplicateDetector {
    constructor() {
        this.seen = new Set();
        this.duplicates = new Map(); // item -> contagem de duplicatas
        this.firstOccurrence = new Map();
        this.processedCount = 0;
    }
    
    processSingleItem(item) {
        this.processedCount++;
        
        if (this.seen.has(item)) {
            // É duplicata
            this.duplicates.set(item, (this.duplicates.get(item) || 0) + 1);
            console.log(`⚠️ Duplicata encontrada: ${item} (ocorrência ${this.duplicates.get(item) + 1})`);
            return true;
        } else {
            // Primeira vez que vemos
            this.seen.add(item);
            this.firstOccurrence.set(item, this.processedCount);
            console.log(`✓ Novo item: ${item}`);
            return false;
        }
    }
    
    processStream(dataStream) {
        console.log("\n=== Processando Stream de Dados ===");
        dataStream.forEach(item => this.processSingleItem(item));
        return this.getStats();
    }
    
    hasDuplicate(item) {
        return this.duplicates.has(item);
    }
    
    getStats() {
        const uniqueCount = this.seen.size;
        const duplicateItemsCount = this.duplicates.size;
        const totalDuplicatesCount = Array.from(this.duplicates.values()).reduce((a, b) => a + b, 0);
        
        return {
            totalProcessed: this.processedCount,
            uniqueItems: uniqueCount,
            duplicateItems: duplicateItemsCount,
            totalDuplicates: totalDuplicatesCount,
            duplicateRate: (totalDuplicatesCount / this.processedCount * 100).toFixed(2) + '%'
        };
    }
    
    visualizeReport() {
        console.log("\n=== Relatório de Duplicatas ===");
        const stats = this.getStats();
        console.log(`Items processados: ${stats.totalProcessed}`);
        console.log(`Items únicos: ${stats.uniqueItems}`);
        console.log(`Taxa de duplicação: ${stats.duplicateRate}`);
        
        if (this.duplicates.size > 0) {
            console.log("\nItems duplicados encontrados:");
            this.duplicates.forEach((count, item) => {
                console.log(`  ${item}: ${count} duplicata(s)`);
            });
        }
    }
}

// Demonstração com diferentes streams
const detector = new DuplicateDetector();
const dataStream = [1, 2, 3, 2, 4, 5, 1, 6, 7, 1];
detector.processStream(dataStream);
detector.visualizeReport();
```

### Exercício 4: Sistema de Índice de Palavras

Construa um índice invertido para busca textual:

```javascript
class InvertedIndex {
    constructor() {
        this.index = new Map();
        this.documents = new Map();
    }
    
    addDocument(docId, content) {
        // TODO: Implementar
        // 1. Tokenizar o conteúdo
        // 2. Para cada palavra, adicionar referência ao documento
        // 3. Armazenar documento
    }
    
    search(query) {
        // TODO: Implementar
        // 1. Tokenizar consulta
        // 2. Encontrar documentos que contêm todas as palavras
        // 3. Ranquear por relevância
    }
    
    getTermFrequency(term) {
        // TODO: Implementar
        // Retorna a frequência de um termo no índice
    }
}

// Teste o índice
const index = new InvertedIndex();
index.addDocument("doc1", "O gato gato dormiu no telhado");
index.addDocument("doc2", "O cachorro perseguiu o gato");
// Complete o teste
```

**Solução do Instrutor:**

```javascript
class InvertedIndex {
    constructor() {
        this.index = new Map(); // palavra -> Set de docIds
        this.documents = new Map(); // docId -> conteúdo original
        this.documentFrequency = new Map(); // palavra -> contagem de documentos
    }
    
    tokenize(text) {
        return text.toLowerCase()
            .replace(/[^\w\s\u00C0-\u017F]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 1); // Ignora palavras muito curtas
    }
    
    addDocument(docId, content) {
        this.documents.set(docId, content);
        const words = this.tokenize(content);
        
        // Adiciona palavras ao índice
        const uniqueWords = new Set(words);
        uniqueWords.forEach(word => {
            if (!this.index.has(word)) {
                this.index.set(word, new Set());
                this.documentFrequency.set(word, 0);
            }
            this.index.get(word).add(docId);
            this.documentFrequency.set(word, this.documentFrequency.get(word) + 1);
        });
        
        console.log(`Documento ${docId} indexado com ${uniqueWords.size} palavras únicas`);
    }
    
    search(query) {
        const queryWords = this.tokenize(query);
        
        if (queryWords.length === 0) return [];
        
        // Encontra documentos que contêm todas as palavras
        let results = null;
        queryWords.forEach(word => {
            if (this.index.has(word)) {
                const docsWithWord = this.index.get(word);
                if (results === null) {
                    results = new Set(docsWithWord);
                } else {
                    results = new Set([...results].filter(x => docsWithWord.has(x)));
                }
            } else {
                results = new Set(); // palavra não encontrada, nenhum resultado
            }
        });
        
        // Converte para array e adiciona informações de ranqueamento
        return Array.from(results || []).map(docId => ({
            docId,
            content: this.documents.get(docId),
            relevance: this.calculateRelevance(docId, queryWords)
        })).sort((a, b) => b.relevance - a.relevance);
    }
    
    calculateRelevance(docId, queryWords) {
        let score = 0;
        const docContent = this.documents.get(docId).toLowerCase();
        
        queryWords.forEach(word => {
            // TF-IDF simplificado
            const termFrequency = (docContent.match(new RegExp(word, 'g')) || []).length;
            const inverseDocFrequency = Math.log(this.documents.size / (this.documentFrequency.get(word) || 1));
            score += termFrequency * inverseDocFrequency;
        });
        
        return score;
    }
    
    getTermFrequency(term) {
        return {
            documentCount: this.documentFrequency.get(term) || 0,
            totalDocuments: this.documents.size,
            ratio: (this.documentFrequency.get(term) || 0) / this.documents.size
        };
    }
    
    visualize() {
        console.log("\n=== Índice Invertido ===");
        console.log(`Total de documentos: ${this.documents.size}`);
        console.log(`Total de termos únicos: ${this.index.size}`);
        
        console.log("\nTop 10 termos mais frequentes:");
        const sortedTerms = Array.from(this.documentFrequency.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
        
        sortedTerms.forEach(([term, freq], i) => {
            console.log(`${i + 1}. ${term}: ${freq} documento(s)`);
        });
    }
}

// Demonstração com mini biblioteca
const index = new InvertedIndex();
const documents = [
    { id: "doc1", content: "Java é uma linguagem de programação orientada a objetos" },
    { id: "doc2", content: "JavaScript é uma linguagem de programação para web" },
    { id: "doc3", content: "Python é uma linguagem de programação versátil" },
    { id: "doc4", content: "Java e JavaScript são linguagens diferentes" },
    { id: "doc5", content: "Programação orientada a objetos é importante" }
];

documents.forEach(doc => index.addDocument(doc.id, doc.content));
index.visualize();

console.log("\nBuscando 'programação orientada':");
const results = index.search("programação orientada");
results.forEach(result => {
    console.log(`${result.docId}: ${result.content} (relevância: ${result.relevance.toFixed(2)})`);
});
```

### Exercício 5: Sistema de Tags (Tagging System)

Implemente um sistema de tags para organizar recursos:

```javascript
class TaggingSystem {
    constructor() {
        this.resourceTags = new Map(); // resource -> Set de tags
        this.tagResources = new Map(); // tag -> Set de resources
    }
    
    addTag(resourceId, tag) {
        // TODO: Implementar
        // 1. Adicionar tag ao recurso
        // 2. Adicionar recurso à tag
        // 3. Atualizar contadores
    }
    
    getResourcesByTag(tag) {
        // TODO: Implementar
        // Retornar todos os recursos com determinada tag
    }
    
    getTagsByResource(resourceId) {
        // TODO: Implementar
        // Retornar todas as tags de um recurso
    }
    
    findSimilarResources(resourceId) {
        // TODO: Implementar
        // Encontrar recursos com tags em comum
    }
}

// Teste o sistema
const tagging = new TaggingSystem();
// Adicione tags a recursos e teste os métodos
```

**Solução do Instrutor:**

```javascript
class TaggingSystem {
    constructor() {
        this.resourceTags = new Map(); // resource -> Set de tags
        this.tagResources = new Map(); // tag -> Set de resources
        this.resourceInfo = new Map(); // resource -> informações adicionais
    }
    
    addResource(resourceId, info = {}) {
        if (!this.resourceInfo.has(resourceId)) {
            this.resourceInfo.set(resourceId, info);
            this.resourceTags.set(resourceId, new Set());
        }
    }
    
    addTag(resourceId, tag) {
        // Garantir que o recurso existe
        if (!this.resourceTags.has(resourceId)) {
            this.addResource(resourceId);
        }
        
        // Adicionar tag ao recurso
        this.resourceTags.get(resourceId).add(tag);
        
        // Adicionar recurso à tag
        if (!this.tagResources.has(tag)) {
            this.tagResources.set(tag, new Set());
        }
        this.tagResources.get(tag).add(resourceId);
        
        console.log(`Tag "${tag}" adicionada ao recurso ${resourceId}`);
    }
    
    removeTag(resourceId, tag) {
        if (this.resourceTags.has(resourceId)) {
            this.resourceTags.get(resourceId).delete(tag);
        }
        if (this.tagResources.has(tag)) {
            this.tagResources.get(tag).delete(resourceId);
            // Remove tag se não tiver mais recursos
            if (this.tagResources.get(tag).size === 0) {
                this.tagResources.delete(tag);
            }
        }
    }
    
    getResourcesByTag(tag) {
        return Array.from(this.tagResources.get(tag) || []);
    }
    
    getTagsByResource(resourceId) {
        return Array.from(this.resourceTags.get(resourceId) || []);
    }
    
    findSimilarResources(resourceId, minCommonTags = 1) {
        const resourceTags = this.getTagsByResource(resourceId);
        const similarResources = new Map(); // resourceId -> número de tags em comum
        
        resourceTags.forEach(tag => {
            this.getResourcesByTag(tag).forEach(otherId => {
                if (otherId !== resourceId) {
                    similarResources.set(otherId, (similarResources.get(otherId) || 0) + 1);
                }
            });
        });
        
        // Filtrar e ordenar por similaridade
        return Array.from(similarResources.entries())
            .filter(([_, count]) => count >= minCommonTags)
            .sort((a, b) => b[1] - a[1])
            .map(([id, count]) => ({
                resourceId: id,
                commonTags: count,
                similarity: count / Math.max(resourceTags.length, this.getTagsByResource(id).length)
            }));
    }
    
    getTagCloud() {
        const tagFrequency = new Map();
        this.tagResources.forEach((resources, tag) => {
            tagFrequency.set(tag, resources.size);
        });
        
        return Array.from(tagFrequency.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([tag, frequency]) => ({ tag, frequency }));
    }
    
    visualize() {
        console.log("\n=== Sistema de Tags ===");
        console.log(`Recursos: ${this.resourceInfo.size}`);
        console.log(`Tags únicas: ${this.tagResources.size}`);
        
        console.log("\nNuvem de Tags:");
        const cloud = this.getTagCloud();
        cloud.slice(0, 10).forEach(({tag, frequency}) => {
            const size = Math.ceil(frequency / cloud[0].frequency * 5);
            console.log(`${tag.padEnd(15)} ${'*'.repeat(size)} (${frequency})`);
        });
    }
}

// Demonstração com biblioteca digital
const tagging = new TaggingSystem();

// Adicionando livros com tags
const books = [
    { id: "book1", title: "Clean Code", tags: ["programação", "boas práticas", "software"] },
    { id: "book2", title: "Design Patterns", tags: ["programação", "padrões", "software"] },
    { id: "book3", title: "Banco de Dados", tags: ["banco de dados", "sql", "software"] },
    { id: "book4", title: "Algoritmos", tags: ["programação", "algoritmos", "estruturas de dados"] },
    { id: "book5", title: "JavaScript Guide", tags: ["programação", "web", "javascript"] }
];

books.forEach(book => {
    tagging.addResource(book.id, { title: book.title });
    book.tags.forEach(tag => tagging.addTag(book.id, tag));
});

tagging.visualize();

console.log("\nLivros de programação:");
const programmingBooks = tagging.getResourcesByTag("programação");
programmingBooks.forEach(id => {
    const info = tagging.resourceInfo.get(id);
    console.log(`- ${info.title}`);
});

console.log("\nLivros similares a 'Clean Code':");
const similar = tagging.findSimilarResources("book1");
similar.forEach(({resourceId, commonTags, similarity}) => {
    const info = tagging.resourceInfo.get(resourceId);
    console.log(`- ${info.title} (${commonTags} tags em comum, ${(similarity * 100).toFixed(0)}% similaridade)`);
});
```

### Desafio Final: Sistema de Recomendação Completo

Combine conceitos aprendidos para criar um sistema de recomendação:

```javascript
class RecommendationEngine {
    constructor() {
        this.userProfiles = new Map();
        this.itemFeatures = new Map();
        this.collaborativeFiltering = new Map();
        this.contentBasedFiltering = new Map();
    }
    
    // Sistema de recomendação híbrido
    addUserInteraction(userId, itemId, rating) {
        // TODO: Implementar
        // 1. Atualizar perfil do usuário
        // 2. Atualizar relações colaborativas
        // 3. Considerar características do item
    }
    
    getRecommendations(userId, options = {}) {
        // TODO: Implementar
        // 1. Combinar collaborative filtering e content-based
        // 2. Personalizar para o usuário
        // 3. Retornar top N recomendações
    }
    
    addItemFeatures(itemId, features) {
        // TODO: Implementar
        // Adicionar características do item para content-based filtering
    }
}
```

### Revisão dos Conceitos:

**Checklist de Compreensão:**
- ✓ Consegue implementar uma tabela hash do zero?
- ✓ Entende diferentes métodos de tratamento de colisões?
- ✓ Sabe quando e como fazer rehashing?
- ✓ Consegue aplicar hash tables em problemas reais?
- ✓ Compreende os tradeoffs de diferentes abordagens?

**Pergunta de Reflexão:**
Pensando nos exercícios realizados, qual aplicação de hash table você considerou mais interessante? Por quê?

**Próxima aula:** Case Study - Implementação de um Dicionário usando Tabelas Hash!
