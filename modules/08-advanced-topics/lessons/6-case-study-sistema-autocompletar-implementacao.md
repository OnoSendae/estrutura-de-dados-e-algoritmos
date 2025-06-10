

## Módulo 7: Tópicos Avançados e Aplicações

### 6. Case Study: Implementação de um Sistema de Busca Autocompletar usando Trie

Nesta aula, aplicaremos os conhecimentos adquiridos ao longo do curso, com foco especial na estrutura de dados Trie (Árvore de Prefixos), para desenvolver um sistema de busca com autocompletar completo e funcional. Este é um estudo de caso prático que representa um problema real encontrado em muitas aplicações modernas.

#### Conexão com o Aprendizado Anterior

Este case study aplica diretamente os conceitos que estudamos na aula sobre **Tries (Módulo 7.2)**, mas também integra diversos outros conhecimentos:

- **Conceitos de Árvore** (Módulo 3): A Trie é uma árvore especializada onde cada nível representa uma posição na string
- **Complexidade Algorítmica** (Módulo 1): Analisaremos o desempenho das operações da Trie
- **Estruturas Lineares** (Módulo 2): Utilizamos filas e listas para armazenar resultados de busca
- **Tabelas Hash** (Módulo 5): Compararemos o desempenho da Trie com abordagens baseadas em hash

#### Comparação de Performance: Trie vs. Outras Estruturas

| Operação | Trie | Array | Tabela Hash | Árvore Binária |
|----------|------|-------|------------|---------------|
| Busca exata | O(m)* | O(n×m) | O(m) | O(m×log n) |
| Busca por prefixo | O(m+k)** | O(n×m) | Não eficiente | O(n×m) |
| Inserção | O(m) | O(1) ou O(n) | O(m) | O(m×log n) |
| Remoção | O(m) | O(n) | O(m) | O(m×log n) |
| Uso de memória | Alto | Baixo | Alto | Médio |

*m = tamanho da string, n = número de strings, k = número de resultados
**O(m) para encontrar o nó do prefixo + O(k) para coletar k resultados

**Quando usar Trie:**
- Quando operações de prefixo são frequentes (autocompletar, sugestões)
- Quando a memória não é uma limitação crítica
- Quando o conjunto de caracteres possíveis é limitado

**Quando preferir outras estruturas:**
- Tabela Hash: para busca exata sem necessidade de operações de prefixo
- Array ordenado com busca binária: quando a memória é limitada
- Árvore Binária de Busca: quando o conjunto de dados é altamente dinâmico

#### Contexto do Problema

Os sistemas de autocompletar são componentes essenciais em:
- Motores de busca
- Editores de texto
- E-commerce (busca de produtos)
- Interfaces de linha de comando
- Aplicativos de navegação
- Formulários e campos de busca em geral

O desafio central é proporcionar uma experiência de usuário ágil e intuitiva, oferecendo sugestões relevantes em tempo real enquanto o usuário digita, mesmo com grandes volumes de dados.

#### Requisitos do Sistema

Nosso sistema de autocompletar deverá:

1. **Funcionalidade básica**:
   - Adicionar palavras/frases ao dicionário, com pesos/frequências
   - Buscar sugestões baseadas em prefixos
   - Classificar sugestões por relevância

2. **Recursos avançados**:
   - Tolerância a erros (sugestões para palavras com erros de digitação)
   - Aprendizagem adaptativa (ajuste de frequências com base no uso)
   - Sugestões contextuais (baseadas em histórico recente)
   - Cache para consultas frequentes

3. **Desempenho**:
   - Resposta rápida mesmo com milhões de termos
   - Uso eficiente de memória
   - Escalabilidade para adição de novos termos

#### Analogia: Um Bibliotecário Eficiente 📚

Imagine um bibliotecário extremamente eficiente que:
- Organizou os livros de forma que todos com título iniciando com a mesma sequência de letras estão na mesma seção
- Sabe exatamente quantas vezes cada livro foi solicitado
- Consegue instantaneamente sugerir livros baseados nas primeiras letras do título que você menciona
- E ainda sugere títulos similares caso você tenha errado a ortografia

Nossa implementação de Trie com recursos avançados funciona exatamente como este bibliotecário.

### Implementação

Vamos construir nossa solução passo a passo, começando com a implementação básica e adicionando recursos mais avançados gradualmente.

#### Etapa 1: Estrutura Básica da Trie com Ranking por Frequência

```javascript
class TrieNode {
    constructor() {
        this.children = new Map(); // Mapa de caracteres para nós filhos
        this.isEndOfWord = false;  // Indica se o nó representa o fim de uma palavra
        this.word = null;          // A palavra completa que termina neste nó
        this.frequency = 0;        // Frequência/popularidade da palavra
        this.lastAccessed = 0;     // Timestamp da última vez que a palavra foi acessada
    }
}

class Autocomplete {
    constructor(options = {}) {
        this.root = new TrieNode();
        this.maxSuggestions = options.maxSuggestions || 10;
        this.minCharacters = options.minCharacters || 1;
        this.cache = new Map(); // Cache para consultas frequentes
        this.cacheTimeout = options.cacheTimeout || 300000; // 5 minutos em ms
        this.recentSearches = []; // Histórico de buscas recentes
        this.maxRecentSearches = options.maxRecentSearches || 20;
    }
    
    // Adiciona uma palavra ao dicionário com uma frequência inicial
    addWord(word, frequency = 1) {
        if (!word || typeof word !== 'string') return this;
        
        word = word.toLowerCase(); // Normalizar para minúsculas
        let current = this.root;
        
        for (const char of word) {
            if (!current.children.has(char)) {
                current.children.set(char, new TrieNode());
            }
            current = current.children.get(char);
        }
        
        current.isEndOfWord = true;
        current.word = word;
        current.frequency += frequency;
        current.lastAccessed = Date.now();
        
        // Limpar cache relacionado a esta palavra
        this._invalidateRelatedCache(word);
        
        return this;
    }
    
    // Adiciona várias palavras de uma vez
    addWords(wordsArray) {
        if (!Array.isArray(wordsArray)) return this;
        
        for (const item of wordsArray) {
            if (typeof item === 'string') {
                this.addWord(item);
            } else if (Array.isArray(item) && item.length >= 2) {
                this.addWord(item[0], item[1]); // [palavra, frequência]
            }
        }
        
        return this;
    }
    
    // Incrementa a frequência de uma palavra existente
    incrementFrequency(word, amount = 1) {
        if (!word || typeof word !== 'string') return false;
        
        word = word.toLowerCase();
        let current = this.root;
        
        for (const char of word) {
            if (!current.children.has(char)) {
                return false; // Palavra não encontrada
            }
            current = current.children.get(char);
        }
        
        if (!current.isEndOfWord) return false;
        
        current.frequency += amount;
        current.lastAccessed = Date.now();
        
        // Limpar cache relacionado
        this._invalidateRelatedCache(word);
        
        return true;
    }
    
    // Registra que uma palavra foi selecionada pelo usuário
    selectWord(word) {
        if (!word || typeof word !== 'string') return false;
        
        word = word.toLowerCase();
        
        // Incrementar frequência
        const success = this.incrementFrequency(word, 1);
        
        // Adicionar ao histórico de buscas recentes
        if (success) {
            this._addToRecentSearches(word);
        }
        
        return success;
    }
    
    // Obtém sugestões para um prefixo
    getSuggestions(prefix, options = {}) {
        if (!prefix || typeof prefix !== 'string') return [];
        
        prefix = prefix.toLowerCase();
        
        // Verificar tamanho mínimo do prefixo
        if (prefix.length < this.minCharacters) {
            return [];
        }
        
        // Verificar cache
        const cacheKey = `${prefix}:${options.limit || this.maxSuggestions}`;
        if (this.cache.has(cacheKey)) {
            const cachedResult = this.cache.get(cacheKey);
            if (Date.now() - cachedResult.timestamp < this.cacheTimeout) {
                return cachedResult.suggestions;
            } else {
                this.cache.delete(cacheKey); // Cache expirado
            }
        }
        
        // Navegar até o nó do prefixo
        let current = this.root;
        for (const char of prefix) {
            if (!current.children.has(char)) {
                // Se não encontrar o prefixo exato, tente sugestões com tolerância a erros
                if (options.fuzzy) {
                    return this._getFuzzyMatches(prefix, options.limit || this.maxSuggestions);
                }
                return [];
            }
            current = current.children.get(char);
        }
        
        // Coletar palavras que começam com o prefixo
        const suggestions = [];
        this._collectWords(current, suggestions);
        
        // Incluir sugestões do histórico recente se relevantes
        this._addRecentSuggestionsIfRelevant(prefix, suggestions);
        
        // Ranking e limitação de resultados
        suggestions.sort((a, b) => {
            // Priorizar palavras completas que correspondem exatamente ao prefixo
            if (a.word === prefix && b.word !== prefix) return -1;
            if (a.word !== prefix && b.word === prefix) return 1;
            
            // Em seguida, classificar por frequência
            return b.frequency - a.frequency;
        });
        
        const limit = options.limit || this.maxSuggestions;
        const results = suggestions.slice(0, limit).map(item => ({
            word: item.word,
            frequency: item.frequency
        }));
        
        // Armazenar em cache
        this.cache.set(cacheKey, {
            suggestions: results,
            timestamp: Date.now()
        });
        
        return results;
    }
    
    // Função auxiliar para coletar palavras recursivamente
    _collectWords(node, suggestions) {
        if (node.isEndOfWord) {
            suggestions.push({
                word: node.word,
                frequency: node.frequency,
                lastAccessed: node.lastAccessed
            });
        }
        
        for (const [_, childNode] of node.children) {
            this._collectWords(childNode, suggestions);
        }
    }
    
    // Limpa entradas de cache relacionadas a uma palavra
    _invalidateRelatedCache(word) {
        for (let i = 1; i <= word.length; i++) {
            const prefix = word.substring(0, i);
            for (const [key, _] of this.cache) {
                if (key.startsWith(`${prefix}:`)) {
                    this.cache.delete(key);
                }
            }
        }
    }
    
    // Adiciona uma palavra ao histórico de buscas recentes
    _addToRecentSearches(word) {
        // Remover a palavra se já estiver na lista
        this.recentSearches = this.recentSearches.filter(item => item.word !== word);
        
        // Adicionar no início da lista
        this.recentSearches.unshift({
            word,
            timestamp: Date.now()
        });
        
        // Limitar o tamanho da lista
        if (this.recentSearches.length > this.maxRecentSearches) {
            this.recentSearches.pop();
        }
    }
    
    // Adiciona sugestões do histórico recente
    _addRecentSuggestionsIfRelevant(prefix, suggestions) {
        for (const recent of this.recentSearches) {
            if (recent.word.startsWith(prefix)) {
                // Verificar se já está nas sugestões
                const exists = suggestions.some(s => s.word === recent.word);
                if (!exists) {
                    // Obter a frequência da palavra na Trie
                    let freq = 0;
                    let node = this.root;
                    
                    for (const char of recent.word) {
                        if (!node.children.has(char)) break;
                        node = node.children.get(char);
                    }
                    
                    if (node.isEndOfWord && node.word === recent.word) {
                        freq = node.frequency;
                    }
                    
                    // Adicionar com um bônus de recência
                    suggestions.push({
                        word: recent.word,
                        frequency: freq * 1.2, // Bônus de 20% para buscas recentes
                        lastAccessed: recent.timestamp
                    });
                }
            }
        }
    }
    
    // Implementação básica de tolerância a erros
    _getFuzzyMatches(prefix, limit) {
        const maxDistance = Math.min(2, Math.floor(prefix.length / 3));
        const results = [];
        
        // Função recursiva para buscar palavras com distância de edição limitada
        const searchWithTolerance = (node, currentPrefix, distance) => {
            if (distance > maxDistance) return;
            
            if (node.isEndOfWord) {
                results.push({
                    word: node.word,
                    frequency: node.frequency,
                    distance: distance
                });
            }
            
            for (const [char, childNode] of node.children) {
                // Continuar com o mesmo caractere (sem erro)
                if (prefix[currentPrefix.length] === char) {
                    searchWithTolerance(childNode, currentPrefix + char, distance);
                } else {
                    // Substituição de caractere
                    searchWithTolerance(childNode, currentPrefix + char, distance + 1);
                }
                
                // Inserção de caractere (pular este caractere no prefixo)
                searchWithTolerance(childNode, currentPrefix, distance + 1);
            }
            
            // Deleção de caractere (pular este caractere no nó)
            if (currentPrefix.length < prefix.length) {
                searchWithTolerance(node, currentPrefix + prefix[currentPrefix.length], distance + 1);
            }
        };
        
        searchWithTolerance(this.root, "", 0);
        
        // Classificar resultados por distância e frequência
        results.sort((a, b) => {
            if (a.distance !== b.distance) {
                return a.distance - b.distance;
            }
            return b.frequency - a.frequency;
        });
        
        return results.slice(0, limit).map(item => ({
            word: item.word,
            frequency: item.frequency,
            distance: item.distance
        }));
    }
    
    // Remove palavras não utilizadas há muito tempo
    pruneUnusedWords(thresholdDays = 180) {
        const thresholdMs = thresholdDays * 24 * 60 * 60 * 1000;
        const now = Date.now();
        
        const pruneRecursive = (node, parentMap, char) => {
            // Verificar todos os filhos primeiro
            for (const [childChar, childNode] of node.children) {
                pruneRecursive(childNode, node.children, childChar);
            }
            
            // Se este nó não é fim de palavra e não tem filhos, podemos removê-lo
            if (!node.isEndOfWord && node.children.size === 0) {
                if (parentMap) {
                    parentMap.delete(char);
                }
                return;
            }
            
            // Se é fim de palavra mas não foi acessado recentemente, talvez desmarque como fim de palavra
            if (node.isEndOfWord && (now - node.lastAccessed > thresholdMs)) {
                // Manter se tiver alta frequência mesmo sem uso recente
                if (node.frequency < 5) {
                    node.isEndOfWord = false;
                    node.word = null;
                }
            }
        };
        
        pruneRecursive(this.root);
        
        // Limpar cache por completo
        this.cache.clear();
        
        return this;
    }
}
```

#### Etapa 2: Front-end Básico para o Sistema de Autocompletar

```javascript
class AutocompleteUI {
    constructor(autocompleteSystem, options = {}) {
        this.autocomplete = autocompleteSystem;
        this.options = Object.assign({
            inputSelector: '#autocomplete-input',
            suggestionsSelector: '#suggestions-container',
            minChars: 1,
            debounceTime: 200,
            highlightClass: 'highlight',
            loadingClass: 'loading',
            suggestionsClass: 'suggestions',
            suggestionClass: 'suggestion-item',
            activeClass: 'active',
            fuzzy: true,
            onSelect: null
        }, options);
        
        this.inputElement = document.querySelector(this.options.inputSelector);
        this.suggestionsElement = document.querySelector(this.options.suggestionsSelector);
        
        this.debounceTimer = null;
        this.activeIndex = -1;
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Input changes
        this.inputElement.addEventListener('input', () => {
            this.suggestionsElement.classList.add(this.options.loadingClass);
            clearTimeout(this.debounceTimer);
            
            this.debounceTimer = setTimeout(() => {
                this.updateSuggestions();
            }, this.options.debounceTime);
        });
        
        // Keyboard navigation
        this.inputElement.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    this.navigateSuggestions(1);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.navigateSuggestions(-1);
                    break;
                case 'Enter':
                    if (this.activeIndex >= 0) {
                        this.selectSuggestion(this.activeIndex);
                        e.preventDefault();
                    }
                    break;
                case 'Escape':
                    this.hideSuggestions();
                    break;
            }
        });
        
        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.inputElement.contains(e.target) && 
                !this.suggestionsElement.contains(e.target)) {
                this.hideSuggestions();
            }
        });
    }
    
    updateSuggestions() {
        const query = this.inputElement.value.trim();
        
        if (query.length < this.options.minChars) {
            this.hideSuggestions();
            return;
        }
        
        const suggestions = this.autocomplete.getSuggestions(query, {
            fuzzy: this.options.fuzzy
        });
        
        this.renderSuggestions(suggestions, query);
    }
    
    renderSuggestions(suggestions, query) {
        this.suggestionsElement.innerHTML = '';
        this.suggestionsElement.classList.remove(this.options.loadingClass);
        this.activeIndex = -1;
        
        if (suggestions.length === 0) {
            this.hideSuggestions();
            return;
        }
        
        for (let i = 0; i < suggestions.length; i++) {
            const suggestion = suggestions[i];
            const item = document.createElement('div');
            item.className = this.options.suggestionClass;
            
            // Destacar o prefixo correspondente
            const highlightedText = this.highlightMatch(suggestion.word, query);
            item.innerHTML = highlightedText;
            
            // Adicionar informação de frequência se desejado
            if (this.options.showFrequency) {
                const freqSpan = document.createElement('span');
                freqSpan.className = 'frequency';
                freqSpan.textContent = `(${suggestion.frequency})`;
                item.appendChild(freqSpan);
            }
            
            item.addEventListener('click', () => {
                this.selectSuggestion(i);
            });
            
            this.suggestionsElement.appendChild(item);
        }
        
        this.showSuggestions();
    }
    
    highlightMatch(text, query) {
        const lowerText = text.toLowerCase();
        const lowerQuery = query.toLowerCase();
        
        if (lowerText.startsWith(lowerQuery)) {
            return `<span class="${this.options.highlightClass}">${text.substring(0, query.length)}</span>${text.substring(query.length)}`;
        }
        
        return text;
    }
    
    navigateSuggestions(direction) {
        const suggestionItems = this.suggestionsElement.querySelectorAll(`.${this.options.suggestionClass}`);
        if (suggestionItems.length === 0) return;
        
        // Remover classe ativa do item atual
        if (this.activeIndex >= 0 && this.activeIndex < suggestionItems.length) {
            suggestionItems[this.activeIndex].classList.remove(this.options.activeClass);
        }
        
        // Calcular novo índice
        this.activeIndex += direction;
        
        // Verificar limites
        if (this.activeIndex < 0) {
            this.activeIndex = suggestionItems.length - 1;
        } else if (this.activeIndex >= suggestionItems.length) {
            this.activeIndex = 0;
        }
        
        // Adicionar classe ativa ao novo item
        suggestionItems[this.activeIndex].classList.add(this.options.activeClass);
        suggestionItems[this.activeIndex].scrollIntoView({ block: 'nearest' });
    }
    
    selectSuggestion(index) {
        const suggestionItems = this.suggestionsElement.querySelectorAll(`.${this.options.suggestionClass}`);
        if (index < 0 || index >= suggestionItems.length) return;
        
        const selectedText = suggestionItems[index].textContent.replace(/\(\d+\)$/, '').trim();
        
        // Atualizar input
        this.inputElement.value = selectedText;
        
        // Registrar seleção no sistema de autocompletar
        this.autocomplete.selectWord(selectedText);
        
        // Esconder sugestões
        this.hideSuggestions();
        
        // Callback personalizado
        if (typeof this.options.onSelect === 'function') {
            this.options.onSelect(selectedText);
        }
        
        // Focar no input
        this.inputElement.focus();
    }
    
    showSuggestions() {
        this.suggestionsElement.classList.add(this.options.suggestionsClass);
    }
    
    hideSuggestions() {
        this.suggestionsElement.classList.remove(this.options.suggestionsClass);
        this.activeIndex = -1;
    }
}
```

#### Etapa 3: Demonstração Completa

```javascript
// HTML necessário para a demonstração
/*
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Autocompletar</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .search-container {
            position: relative;
            margin-bottom: 30px;
        }
        
        input[type="text"] {
            width: 100%;
            padding: 12px;
            font-size: 16px;
            border: 2px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        
        #suggestions-container {
            position: absolute;
            width: 100%;
            max-height: 300px;
            overflow-y: auto;
            background: white;
            border: 1px solid #ddd;
            border-top: none;
            border-radius: 0 0 4px 4px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            z-index: 1000;
            display: none;
        }
        
        #suggestions-container.suggestions {
            display: block;
        }
        
        .suggestion-item {
            padding: 10px 15px;
            cursor: pointer;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .suggestion-item:hover, .suggestion-item.active {
            background-color: #f8f8f8;
        }
        
        .highlight {
            font-weight: bold;
            color: #0066cc;
        }
        
        .frequency {
            font-size: 0.8em;
            color: #888;
            margin-left: 10px;
        }
        
        .stats {
            margin-top: 20px;
            padding: 15px;
            background-color: #f8f8f8;
            border-radius: 4px;
        }
        
        .loading::after {
            content: "Carregando...";
            padding: 10px 15px;
            display: block;
            color: #888;
        }
        
        button {
            padding: 8px 16px;
            margin: 0 5px 5px 0;
            background-color: #0066cc;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        
        button:hover {
            background-color: #0055aa;
        }
    </style>
</head>
<body>
    <h1>Sistema de Autocompletar</h1>
    
    <div class="search-container">
        <input type="text" id="autocomplete-input" placeholder="Digite para pesquisar...">
        <div id="suggestions-container"></div>
    </div>
    
    <div class="controls">
        <button id="add-words-btn">Adicionar Palavras de Exemplo</button>
        <button id="clear-btn">Limpar Dicionário</button>
        <button id="show-stats-btn">Mostrar Estatísticas</button>
    </div>
    
    <div id="stats-container" class="stats" style="display: none;">
        <h3>Estatísticas</h3>
        <div id="stats-content"></div>
    </div>
    
    <script src="autocomplete.js"></script>
    <script src="autocomplete-ui.js"></script>
    <script src="demo.js"></script>
</body>
</html>
*/

// demo.js
document.addEventListener('DOMContentLoaded', function() {
    // Conjunto de dados de exemplo
    const sampleWords = [
        ["algoritmo", 100],
        ["algoritmos", 95],
        ["estrutura", 90],
        ["estruturas", 85],
        ["estrutura de dados", 92],
        ["programação", 98],
        ["programação dinâmica", 75],
        ["programador", 80],
        ["árvore", 85],
        ["árvore binária", 82],
        ["árvore de busca", 78],
        ["árvore avl", 70],
        ["grafo", 88],
        ["grafos", 86],
        ["busca em largura", 65],
        ["busca em profundidade", 63],
        ["hash", 72],
        ["tabela hash", 70],
        ["lista", 75],
        ["lista encadeada", 73],
        ["pilha", 80],
        ["fila", 78],
        ["ordenação", 85],
        ["quick sort", 70],
        ["merge sort", 68],
        ["heap sort", 65],
        ["complexidade", 83],
        ["big o", 75],
        ["recursão", 78],
        ["javascript", 90],
        ["python", 88],
        ["java", 86],
        ["c++", 82],
        ["aplicação", 79],
        ["implementação", 77],
        ["código", 85],
    ];

    // Inicializar o sistema de autocompletar
    const autocomplete = new Autocomplete({
        maxSuggestions: 8,
        minCharacters: 1
    });

    // Inicializar a UI
    const autocompleteUI = new AutocompleteUI(autocomplete, {
        showFrequency: true,
        onSelect: (word) => {
            console.log(`Selecionado: ${word}`);
            updateStats();
        }
    });

    // Adicionar palavras de exemplo
    document.getElementById('add-words-btn').addEventListener('click', function() {
        autocomplete.addWords(sampleWords);
        alert(`${sampleWords.length} palavras adicionadas ao dicionário!`);
        updateStats();
    });

    // Limpar dicionário
    document.getElementById('clear-btn').addEventListener('click', function() {
        // Como não temos um método específico para limpar, vamos recriar o objeto
        autocompleteUI.autocomplete = new Autocomplete({
            maxSuggestions: 8,
            minCharacters: 1
        });
        alert('Dicionário limpo!');
        updateStats();
    });

    // Mostrar estatísticas
    document.getElementById('show-stats-btn').addEventListener('click', function() {
        const statsContainer = document.getElementById('stats-container');
        if (statsContainer.style.display === 'none') {
            statsContainer.style.display = 'block';
            updateStats();
        } else {
            statsContainer.style.display = 'none';
        }
    });

    function updateStats() {
        // Esta é uma função simplificada que não tem acesso aos detalhes internos
        // Em uma implementação real, adicionaríamos métodos à classe Autocomplete para obter estatísticas
        const statsContent = document.getElementById('stats-content');
        
        // Simulação de estatísticas
        statsContent.innerHTML = `
            <p><strong>Buscas recentes:</strong> ${autocomplete.recentSearches.length}</p>
            <p><strong>Entradas em cache:</strong> ${autocomplete.cache.size}</p>
            <p><strong>Últimas buscas:</strong></p>
            <ul>
                ${autocomplete.recentSearches.map(item => 
                    `<li>${item.word} <small>(${new Date(item.timestamp).toLocaleTimeString()})</small></li>`
                ).join('')}
            </ul>
        `;
    }

    // Adicionar algumas palavras iniciais
    autocomplete.addWords(sampleWords.slice(0, 10));
});
```

### Análise de Complexidade e Otimizações

#### Complexidade Temporal

- **Inserção**: O(L), onde L é o comprimento da palavra
- **Busca exata**: O(L), onde L é o comprimento do prefixo
- **Coleta de sugestões**: O(N), onde N é o número de palavras com o prefixo dado
- **Ordenação de sugestões**: O(K log K), onde K é o número de sugestões encontradas

#### Otimizações Implementadas

1. **Cache de consultas**: Evita recalcular sugestões para o mesmo prefixo repetidamente
2. **Priorização de buscas recentes**: Melhora a relevância contextualizando por uso recente
3. **Tolerância a erros limitada**: Implementada de forma controlada para não prejudicar o desempenho
4. **Limpeza periódica de dados não utilizados**: Evita crescimento desenfreado da estrutura

#### Possíveis Melhorias Futuras

1. **Compressão da Trie**: Implementar uma Trie compacta para reduzir uso de memória
2. **Paralelização**: Dividir buscas complexas em threads/workers para melhor desempenho
3. **Sugestões por similaridade semântica**: Incorporar vetores de palavras para sugestões contextuais
4. **Índice invertido**: Para buscas de termos em documentos inteiros
5. **Persistência**: Salvar e carregar a estrutura de/para armazenamento permanente

### Aplicações Práticas

Este sistema pode ser adaptado para diversas aplicações:

1. **Campo de Busca em E-commerce**: 
   - Adicionar metadados como categoria e preço aos nós
   - Implementar filtros por atributos

2. **Editor de Texto Inteligente**:
   - Estender para sugerir frases completas
   - Incorporar correção gramatical

3. **Interface de Linha de Comando**:
   - Adaptar para comandos e parâmetros 
   - Incluir documentação inline nas sugestões

4. **Sistema de Navegação**:
   - Adicionar coordenadas geográficas aos nós
   - Implementar sugestões baseadas em localização atual

### Conclusão

Desenvolvemos um sistema de autocompletar completo usando Trie, demonstrando como esta estrutura de dados pode ser aplicada em um problema real e de alta utilidade. O sistema implementado é eficiente, escalável e facilmente adaptável para diferentes contextos.

Os conceitos aprendidos neste estudo de caso englobam:
- Tries e sua aplicação prática
- Estratégias de otimização de desempenho
- Técnicas de ranking e relevância
- Interface de usuário para autocompletar
- Tolerância a erros em algoritmos de busca

Este projeto exemplifica como os algoritmos e estruturas de dados que estudamos ao longo do curso são aplicados na prática para criar sistemas interativos e funcionais que melhoram significativamente a experiência do usuário. 