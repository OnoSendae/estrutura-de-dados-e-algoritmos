/**
 * Implementação de Sistema de Busca Autocompletar
 * Solução para o Exercício 4 do Módulo 4
 * 
 * Usa estrutura de dados Trie para busca eficiente por prefixo
 * e mantém controle de frequência para sugestões mais relevantes
 */

// Classe que representa um nó na Trie
class TrieNode {
    constructor() {
        this.children = new Map(); // Mapa de caracteres para nós filhos
        this.isEndOfWord = false;  // Marca o fim de uma palavra
        this.frequency = 0;        // Frequência da palavra (se for fim de palavra)
        this.word = null;          // Palavra completa armazenada neste nó (se for fim de palavra)
    }
}

// Implementação da estrutura de dados Trie
class Trie {
    constructor() {
        this.root = new TrieNode();
    }
    
    /**
     * Insere uma palavra na Trie
     * @param {string} word - Palavra a ser inserida
     * @param {number} frequency - Frequência inicial da palavra
     */
    insert(word, frequency = 1) {
        let current = this.root;
        
        // Percorrer cada caractere da palavra
        for (const char of word) {
            // Se o caractere não existir como filho, criar novo nó
            if (!current.children.has(char)) {
                current.children.set(char, new TrieNode());
            }
            
            // Avançar para o próximo nó
            current = current.children.get(char);
        }
        
        // Marcar o nó atual como fim de palavra
        current.isEndOfWord = true;
        // Definir ou incrementar a frequência
        current.frequency = current.frequency || 0;
        current.frequency += frequency;
        // Armazenar a palavra completa para recuperação rápida
        current.word = word;
    }
    
    /**
     * Incrementa a frequência de uma palavra existente
     * @param {string} word - Palavra a incrementar
     * @param {number} increment - Valor a incrementar
     */
    incrementFrequency(word, increment = 1) {
        let current = this.root;
        
        // Percorrer cada caractere da palavra
        for (const char of word) {
            // Se o caractere não existir, a palavra não está na Trie
            if (!current.children.has(char)) {
                return false;
            }
            
            // Avançar para o próximo nó
            current = current.children.get(char);
        }
        
        // Se não for fim de palavra, a palavra não está na Trie
        if (!current.isEndOfWord) {
            return false;
        }
        
        // Incrementar a frequência
        current.frequency += increment;
        return true;
    }
    
    /**
     * Busca palavras que começam com um prefixo
     * @param {string} prefix - Prefixo a buscar
     * @returns {Array} - Lista de objetos {word, frequency}
     */
    findWordsWithPrefix(prefix) {
        const result = [];
        let current = this.root;
        
        // Navegar até o nó que representa o prefixo
        for (const char of prefix) {
            if (!current.children.has(char)) {
                return result; // Prefixo não encontrado
            }
            current = current.children.get(char);
        }
        
        // Coletar todas as palavras a partir deste nó
        this.collectWords(current, result);
        return result;
    }
    
    /**
     * Função auxiliar recursiva para coletar palavras a partir de um nó
     * @param {TrieNode} node - Nó atual
     * @param {Array} result - Array para armazenar resultados
     */
    collectWords(node, result) {
        // Se for fim de palavra, adicionar aos resultados
        if (node.isEndOfWord) {
            result.push({
                word: node.word,
                frequency: node.frequency
            });
        }
        
        // Percorrer todos os filhos recursivamente
        for (const [char, childNode] of node.children) {
            this.collectWords(childNode, result);
        }
    }
}

class Autocomplete {
    constructor() {
        this.trie = new Trie();
        this.suggestions = new Map();
    }
    
    /**
     * Adiciona uma palavra ao sistema com sua frequência
     * @param {string} word - Palavra a adicionar
     * @param {number} frequency - Frequência inicial
     */
    addWord(word, frequency = 1) {
        this.trie.insert(word, frequency);
    }
    
    /**
     * Adiciona múltiplas palavras ao sistema de uma vez
     * @param {Array} wordsWithFrequency - Array de objetos {word, frequency}
     */
    addWords(wordsWithFrequency) {
        for (const { word, frequency } of wordsWithFrequency) {
            this.addWord(word, frequency);
        }
    }
    
    /**
     * Busca sugestões para um prefixo
     * @param {string} prefix - Prefixo para buscar sugestões
     * @param {number} limit - Número máximo de sugestões
     * @returns {Array} - Lista das palavras mais frequentes que começam com o prefixo
     */
    getSuggestions(prefix, limit = 5) {
        // Buscar palavras que começam com o prefixo
        const matches = this.trie.findWordsWithPrefix(prefix);
        
        // Ordenar por frequência (maior para menor)
        matches.sort((a, b) => b.frequency - a.frequency);
        
        // Retornar apenas as top N sugestões
        return matches.slice(0, limit).map(match => match.word);
    }
    
    /**
     * Atualiza a frequência de uma palavra quando selecionada
     * @param {string} word - Palavra selecionada
     * @param {number} increment - Valor a incrementar (default: 1)
     */
    updateFrequency(word, increment = 1) {
        return this.trie.incrementFrequency(word, increment);
    }
    
    /**
     * Visualiza a estrutura interna da Trie para debuggig
     * @returns {string} - Representação textual da Trie
     */
    visualizeTrie() {
        let result = "Estrutura da Trie:\n";
        
        // Função recursiva para visualizar os nós
        const visualizeNode = (node, prefix = "", depth = 0) => {
            const indent = "  ".repeat(depth);
            
            if (depth === 0) {
                result += `${indent}(root)\n`;
            }
            
            // Ordenar as chaves para visualização mais clara
            const sortedKeys = [...node.children.keys()].sort();
            
            for (const char of sortedKeys) {
                const childNode = node.children.get(char);
                const currentPath = prefix + char;
                
                if (childNode.isEndOfWord) {
                    result += `${indent}└─ ${char} (${childNode.frequency}) -> "${childNode.word}"\n`;
                } else {
                    result += `${indent}├─ ${char}\n`;
                }
                
                // Recursivamente visualizar os filhos
                visualizeNode(childNode, currentPath, depth + 1);
            }
        };
        
        visualizeNode(this.trie.root);
        return result;
    }
}

// Função de demonstração
function demonstrateAutocomplete() {
    console.log("===== DEMONSTRAÇÃO DO SISTEMA DE AUTOCOMPLETE =====");
    
    const autocomplete = new Autocomplete();
    
    // Adicionar termos de programação com suas frequências
    const programmingTerms = [
        { word: "javascript", frequency: 100 },
        { word: "java", frequency: 90 },
        { word: "python", frequency: 85 },
        { word: "programming", frequency: 80 },
        { word: "typescript", frequency: 75 },
        { word: "algorithm", frequency: 60 },
        { word: "function", frequency: 55 },
        { word: "variable", frequency: 50 },
        { word: "class", frequency: 48 },
        { word: "object", frequency: 45 },
        { word: "array", frequency: 42 },
        { word: "framework", frequency: 40 },
        { word: "library", frequency: 38 },
        { word: "compiler", frequency: 35 },
        { word: "database", frequency: 32 },
        { word: "react", frequency: 30 },
        { word: "node", frequency: 28 },
        { word: "angular", frequency: 25 },
        { word: "vue", frequency: 22 }
    ];
    
    autocomplete.addWords(programmingTerms);
    
    // Testar algumas consultas
    const prefixesToTest = ["ja", "p", "a", "pro", "type"];
    
    for (const prefix of prefixesToTest) {
        const suggestions = autocomplete.getSuggestions(prefix, 3);
        console.log(`\nSugestões para "${prefix}":`);
        suggestions.forEach((word, index) => {
            console.log(`${index + 1}. ${word}`);
        });
    }
    
    // Simular seleção de uma sugestão
    console.log("\nSelecionando 'javascript' da lista...");
    autocomplete.updateFrequency("javascript", 5);
    
    // Verificar se a frequência foi atualizada
    const updatedSuggestions = autocomplete.getSuggestions("ja", 3);
    console.log("\nSugestões atualizadas para 'ja':");
    updatedSuggestions.forEach((word, index) => {
        console.log(`${index + 1}. ${word}`);
    });
    
    // Visualizar a estrutura da Trie
    console.log("\n" + autocomplete.visualizeTrie());
}

// Executar a demonstração
// demonstrateAutocomplete();

// Exportar classes para uso em outros arquivos
module.exports = { Autocomplete, Trie, TrieNode }; 