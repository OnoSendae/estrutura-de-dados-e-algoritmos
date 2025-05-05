/**
 * Implementação de Detector de Código Duplicado
 * Solução para o Exercício 5 do Módulo 4
 * 
 * Usa o algoritmo de Rolling Hash (Rabin-Karp) para encontrar
 * sequências de código duplicadas entre diferentes arquivos
 */

class CodeDuplicationDetector {
    constructor(minTokens = 50) {
        this.minTokens = minTokens;
        this.BASE = 256;  // Base para o rolling hash
        this.PRIME = 101; // Número primo para evitar colisões
    }
    
    /**
     * Encontra duplicações de código entre arquivos
     * @param {Array} codeFiles - Array de objetos {name, content}
     * @returns {Array} - Array de duplicações encontradas
     */
    findDuplicates(codeFiles) {
        const duplications = [];
        
        // Tokenizar cada arquivo
        const tokenizedFiles = codeFiles.map(file => ({
            name: file.name,
            tokens: this.tokenize(file.content)
        }));
        
        // Para cada par de arquivos
        for (let i = 0; i < tokenizedFiles.length; i++) {
            for (let j = i + 1; j < tokenizedFiles.length; j++) {
                const file1 = tokenizedFiles[i];
                const file2 = tokenizedFiles[j];
                
                // Buscar duplicações entre estes dois arquivos
                const duplicationsFound = this.findDuplicationsBetweenFiles(
                    file1.name, file1.tokens, 
                    file2.name, file2.tokens
                );
                
                // Adicionar à lista de duplicações
                duplications.push(...duplicationsFound);
            }
        }
        
        return duplications;
    }
    
    /**
     * Tokeniza o código, normalizando identificadores e mantendo a estrutura
     * @param {string} code - Código fonte a ser tokenizado
     * @returns {Array} - Array de tokens
     */
    tokenize(code) {
        // Dividir o código em tokens significativos
        // Remover comentários, espaços em branco excessivos, etc.
        // Normalizar identificadores (substituir por placeholders)
        
        // Regex para diferentes tipos de tokens
        const tokenRegexes = [
            { type: 'KEYWORD', regex: /\b(function|class|if|else|for|while|return|var|let|const|import|export|try|catch|switch|case|break|continue|new|this|null|undefined|true|false)\b/g },
            { type: 'PUNCTUATION', regex: /[{}()\[\],:;]/g },
            { type: 'OPERATOR', regex: /[=+\-*/%<>!&|^~?]/g },
            { type: 'STRING', regex: /(["'])(\\?.)*?\1/g },
            { type: 'NUMBER', regex: /\b\d+(\.\d+)?\b/g },
            { type: 'IDENTIFIER', regex: /\b[a-zA-Z_]\w*\b/g }
        ];
        
        // Substituir literais de string e números por tokens genéricos
        let normalizedCode = code
            .replace(/\/\/.*$/gm, '') // Remover comentários de linha
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remover comentários de bloco
            .replace(/\s+/g, ' ') // Normalizar espaços
            .trim();
        
        // Identificar tokens
        let tokens = [];
        let identifierMap = new Map(); // Mapear identificadores para tokens genéricos
        let identifierCount = 0;
        
        for (const {type, regex} of tokenRegexes) {
            let match;
            
            // Criar uma cópia para manipular durante a iteração
            let codeToProcess = normalizedCode;
            normalizedCode = '';
            let lastIndex = 0;
            
            regex.lastIndex = 0; // Reset regex state
            
            while ((match = regex.exec(codeToProcess)) !== null) {
                const matchedText = match[0];
                const startPos = match.index;
                
                // Adicionar texto anterior ao match
                normalizedCode += codeToProcess.substring(lastIndex, startPos);
                
                // Para identificadores, substituir por um placeholder
                if (type === 'IDENTIFIER') {
                    if (!identifierMap.has(matchedText)) {
                        identifierMap.set(matchedText, `ID_${identifierCount++}`);
                    }
                    
                    const placeholder = identifierMap.get(matchedText);
                    normalizedCode += placeholder;
                    tokens.push(placeholder);
                } else {
                    normalizedCode += matchedText;
                    tokens.push(type);
                }
                
                lastIndex = startPos + matchedText.length;
            }
            
            // Adicionar o resto do texto
            normalizedCode += codeToProcess.substring(lastIndex);
        }
        
        return tokens;
    }
    
    /**
     * Encontra duplicações entre dois arquivos usando Rolling Hash
     * @param {string} fileName1 - Nome do primeiro arquivo
     * @param {Array} tokens1 - Tokens do primeiro arquivo
     * @param {string} fileName2 - Nome do segundo arquivo
     * @param {Array} tokens2 - Tokens do segundo arquivo
     * @returns {Array} - Duplicações encontradas
     */
    findDuplicationsBetweenFiles(fileName1, tokens1, fileName2, tokens2) {
        const duplications = [];
        
        if (tokens1.length < this.minTokens || tokens2.length < this.minTokens) {
            return duplications;
        }
        
        // Calcular hashes para sequências no primeiro arquivo
        const hashesToPositions1 = this.calculateRollingHashes(tokens1);
        
        // Calcular rolling hash para o segundo arquivo e verificar correspondências
        const hashesToPositions2 = this.calculateRollingHashes(tokens2);
        
        // Verificar correspondências de hash
        for (const [hash, positions1] of Object.entries(hashesToPositions1)) {
            if (hashesToPositions2[hash]) {
                const positions2 = hashesToPositions2[hash];
                
                // Para cada posição no primeiro arquivo
                for (const pos1 of positions1) {
                    // Para cada posição no segundo arquivo
                    for (const pos2 of positions2) {
                        // Verificar se é uma correspondência real (evitar colisões de hash)
                        const maxLen = this.findMaxMatchLength(
                            tokens1, pos1, 
                            tokens2, pos2
                        );
                        
                        if (maxLen >= this.minTokens) {
                            duplications.push({
                                file1: fileName1,
                                startPos1: pos1,
                                file2: fileName2,
                                startPos2: pos2,
                                length: maxLen,
                                // Para visualização, extraímos os tokens em vez do texto original
                                tokens: tokens1.slice(pos1, pos1 + maxLen)
                            });
                            
                            // Pular para depois desta correspondência
                            // para evitar sobreposições
                            break;
                        }
                    }
                }
            }
        }
        
        // Filtrar duplicações sobrepostas
        return this.filterOverlappingDuplications(duplications);
    }
    
    /**
     * Calcula rolling hashes para todas as subsequências de tamanho minTokens
     * @param {Array} tokens - Array de tokens
     * @returns {Object} - Mapa de hash para posições
     */
    calculateRollingHashes(tokens) {
        const hashesToPositions = {};
        
        if (tokens.length < this.minTokens) {
            return hashesToPositions;
        }
        
        // Calcular hash inicial
        let currentHash = 0;
        for (let i = 0; i < this.minTokens; i++) {
            currentHash = (currentHash * this.BASE + this.getTokenValue(tokens[i])) % this.PRIME;
        }
        
        // Armazenar o primeiro hash
        if (!hashesToPositions[currentHash]) {
            hashesToPositions[currentHash] = [];
        }
        hashesToPositions[currentHash].push(0);
        
        // Calcular potência para remoção do primeiro caractere
        const basePower = Math.pow(this.BASE, this.minTokens - 1) % this.PRIME;
        
        // Calcular hashes para as subsequências restantes
        for (let i = this.minTokens; i < tokens.length; i++) {
            // Remover a contribuição do primeiro token da janela anterior
            currentHash = (currentHash - (this.getTokenValue(tokens[i - this.minTokens]) * basePower) % this.PRIME + this.PRIME) % this.PRIME;
            
            // Adicionar a contribuição do novo token
            currentHash = (currentHash * this.BASE + this.getTokenValue(tokens[i])) % this.PRIME;
            
            // Armazenar o hash
            const pos = i - this.minTokens + 1;
            if (!hashesToPositions[currentHash]) {
                hashesToPositions[currentHash] = [];
            }
            hashesToPositions[currentHash].push(pos);
        }
        
        return hashesToPositions;
    }
    
    /**
     * Converte um token em um valor numérico para o hash
     * @param {string} token - Token para converter
     * @returns {number} - Valor numérico
     */
    getTokenValue(token) {
        // Soma simples dos códigos ASCII
        let value = 0;
        for (let i = 0; i < token.length; i++) {
            value += token.charCodeAt(i);
        }
        return value % this.PRIME;
    }
    
    /**
     * Encontra o comprimento máximo da correspondência entre duas sequências
     * @param {Array} tokens1 - Tokens do primeiro arquivo
     * @param {number} start1 - Posição inicial no primeiro arquivo
     * @param {Array} tokens2 - Tokens do segundo arquivo
     * @param {number} start2 - Posição inicial no segundo arquivo
     * @returns {number} - Comprimento máximo da correspondência
     */
    findMaxMatchLength(tokens1, start1, tokens2, start2) {
        let length = 0;
        
        while (
            start1 + length < tokens1.length &&
            start2 + length < tokens2.length &&
            tokens1[start1 + length] === tokens2[start2 + length]
        ) {
            length++;
        }
        
        return length;
    }
    
    /**
     * Filtra duplicações sobrepostas, mantendo as maiores
     * @param {Array} duplications - Array de duplicações
     * @returns {Array} - Duplicações filtradas
     */
    filterOverlappingDuplications(duplications) {
        // Ordenar por comprimento (maior para menor)
        duplications.sort((a, b) => b.length - a.length);
        
        // Filtrar duplicações sobrepostas
        const filtered = [];
        const covered = new Set();
        
        for (const dup of duplications) {
            const key1 = `${dup.file1}:${dup.startPos1}`;
            const key2 = `${dup.file2}:${dup.startPos2}`;
            
            // Verificar se esta duplicação já está coberta
            let isCovered = false;
            
            for (let i = dup.startPos1; i < dup.startPos1 + dup.length; i++) {
                if (covered.has(`${dup.file1}:${i}`)) {
                    isCovered = true;
                    break;
                }
            }
            
            if (!isCovered) {
                for (let i = dup.startPos2; i < dup.startPos2 + dup.length; i++) {
                    if (covered.has(`${dup.file2}:${i}`)) {
                        isCovered = true;
                        break;
                    }
                }
            }
            
            if (!isCovered) {
                filtered.push(dup);
                
                // Marcar posições como cobertas
                for (let i = dup.startPos1; i < dup.startPos1 + dup.length; i++) {
                    covered.add(`${dup.file1}:${i}`);
                }
                
                for (let i = dup.startPos2; i < dup.startPos2 + dup.length; i++) {
                    covered.add(`${dup.file2}:${i}`);
                }
            }
        }
        
        return filtered;
    }
    
    /**
     * Calcula a similaridade entre duas sequências de tokens
     * @param {Array} tokens1 - Primeira sequência
     * @param {Array} tokens2 - Segunda sequência
     * @returns {number} - Similaridade (0-1)
     */
    calculateSimilarity(tokens1, tokens2) {
        // Se um dos arrays é vazio, não há similaridade
        if (tokens1.length === 0 || tokens2.length === 0) {
            return 0;
        }
        
        // Contar tokens comuns
        let commonTokens = 0;
        const set1 = new Set(tokens1);
        
        for (const token of tokens2) {
            if (set1.has(token)) {
                commonTokens++;
                set1.delete(token); // Para não contar duas vezes
            }
        }
        
        // Calcular similaridade de Jaccard
        return commonTokens / (tokens1.length + tokens2.length - commonTokens);
    }
    
    /**
     * Formata as duplicações para visualização
     * @param {Array} duplications - Array de duplicações
     * @returns {string} - Texto formatado
     */
    formatDuplications(duplications) {
        if (duplications.length === 0) {
            return "Nenhuma duplicação encontrada.";
        }
        
        let result = `Encontradas ${duplications.length} duplicações:\n\n`;
        
        for (let i = 0; i < duplications.length; i++) {
            const dup = duplications[i];
            
            result += `Duplicação #${i+1}:\n`;
            result += `Arquivo 1: ${dup.file1}, Posição: ${dup.startPos1}\n`;
            result += `Arquivo 2: ${dup.file2}, Posição: ${dup.startPos2}\n`;
            result += `Comprimento: ${dup.length} tokens\n`;
            
            // Mostrar uma amostra dos tokens duplicados
            const maxPreview = 10;
            const tokensPreview = dup.tokens.slice(0, maxPreview);
            
            result += `Amostra: ${tokensPreview.join(', ')}`;
            
            if (dup.tokens.length > maxPreview) {
                result += `, ... (mais ${dup.tokens.length - maxPreview} tokens)`;
            }
            
            result += '\n\n';
        }
        
        return result;
    }
}

// Função de demonstração
function demonstrateCodeDuplication() {
    const detector = new CodeDuplicationDetector(5); // Usar um minTokens menor para o exemplo
    
    // Exemplo de arquivos de código
    const codeFiles = [
        {
            name: 'calculator.js',
            content: `
                function add(a, b) {
                    return a + b;
                }
                
                function subtract(a, b) {
                    return a - b;
                }
                
                function multiply(a, b) {
                    return a * b;
                }
                
                function divide(a, b) {
                    if (b === 0) {
                        throw new Error("Division by zero");
                    }
                    return a / b;
                }
                
                function calculate(operation, a, b) {
                    switch(operation) {
                        case 'add': return add(a, b);
                        case 'subtract': return subtract(a, b);
                        case 'multiply': return multiply(a, b);
                        case 'divide': return divide(a, b);
                        default: throw new Error("Unknown operation");
                    }
                }
            `
        },
        {
            name: 'math_utils.js',
            content: `
                // Funções matemáticas básicas
                
                function sum(a, b) {
                    return a + b;
                }
                
                function difference(a, b) {
                    return a - b;
                }
                
                function product(a, b) {
                    return a * b;
                }
                
                function quotient(a, b) {
                    if (b === 0) {
                        throw new Error("Cannot divide by zero");
                    }
                    return a / b;
                }
                
                // Outras funções matemáticas
                function square(x) {
                    return x * x;
                }
                
                function cube(x) {
                    return x * x * x;
                }
            `
        },
        {
            name: 'utils.js',
            content: `
                function formatNumber(num) {
                    return num.toFixed(2);
                }
                
                function isEven(num) {
                    return num % 2 === 0;
                }
                
                function isOdd(num) {
                    return num % 2 !== 0;
                }
                
                function generateRandomNumber(min, max) {
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                }
            `
        }
    ];
    
    console.log("===== DEMONSTRAÇÃO DE DETECTOR DE CÓDIGO DUPLICADO =====\n");
    
    // Tokenizar para demonstração
    console.log("Exemplo de tokenização:");
    const tokens = detector.tokenize(codeFiles[0].content.substring(0, 200));
    console.log(tokens.slice(0, 20));
    console.log("\n");
    
    // Encontrar duplicações
    const duplications = detector.findDuplicates(codeFiles);
    
    // Mostrar resultados formatados
    console.log(detector.formatDuplications(duplications));
}

// Executar a demonstração
// demonstrateCodeDuplication();

// Exportar a classe para uso em outros arquivos
module.exports = { CodeDuplicationDetector }; 