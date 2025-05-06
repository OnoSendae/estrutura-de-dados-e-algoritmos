/**
 * Implementação de Sistema de Ordenação de Strings Complexas
 * Solução para Exercício 3 do Módulo 4
 * 
 * Implementa diferentes estratégias de ordenação para strings:
 * - Alfanumérica (natural sort)
 * - Ordenação com suporte a locale (internacionalização)
 * - Ordenação por similaridade com outra string
 */

class ComplexStringSort {
    /**
     * Ordena strings alfanuméricas de forma natural
     * (Ex: "file1.txt", "file2.txt", "file10.txt" em vez de "file1.txt", "file10.txt", "file2.txt")
     * @param {Array} strings - Array de strings para ordenar
     * @returns {Array} - Array ordenado
     */
    sortAlphanumeric(strings) {
        // Implementação do algoritmo de ordenação natural
        return [...strings].sort((a, b) => {
            // Dividir as strings em partes numéricas e não numéricas
            const aParts = this.tokenizeString(a);
            const bParts = this.tokenizeString(b);
            
            // Comparar parte por parte
            const minLength = Math.min(aParts.length, bParts.length);
            
            for (let i = 0; i < minLength; i++) {
                // Se ambos forem números, comparar como números
                if (!isNaN(aParts[i]) && !isNaN(bParts[i])) {
                    const numA = parseInt(aParts[i], 10);
                    const numB = parseInt(bParts[i], 10);
                    if (numA !== numB) {
                        return numA - numB;
                    }
                } 
                // Caso contrário, comparar como strings
                else if (aParts[i] !== bParts[i]) {
                    return aParts[i].localeCompare(bParts[i]);
                }
            }
            
            // Se todas as partes até agora são iguais, a string mais curta vem primeiro
            return aParts.length - bParts.length;
        });
    }
    
    /**
     * Divide uma string em tokens alfanuméricos
     * @param {string} str - String a ser tokenizada
     * @returns {Array} - Array de tokens
     */
    tokenizeString(str) {
        // Dividir a string em partes numéricas e não numéricas
        return str.split(/(\d+)/).filter(part => part.length > 0);
    }
    
    /**
     * Ordena strings respeitando as regras de um locale específico
     * (Considera acentos, caracteres especiais, etc.)
     * @param {Array} strings - Array de strings para ordenar
     * @param {string} locale - Código do locale (ex: 'pt-BR', 'en-US')
     * @returns {Array} - Array ordenado
     */
    sortWithLocale(strings, locale = 'pt-BR') {
        // Usamos o Intl.Collator para garantir ordenação correta por locale
        const collator = new Intl.Collator(locale, {
            sensitivity: 'base',    // Ignorar letras maiúsculas/minúsculas mas respeitar acentos
            ignorePunctuation: true // Ignorar pontuação
        });
        
        return [...strings].sort((a, b) => collator.compare(a, b));
    }
    
    /**
     * Ordena strings pela similaridade com uma string de referência
     * Usa a distância de Levenshtein para calcular a similaridade
     * @param {Array} strings - Array de strings para ordenar
     * @param {string} reference - String de referência
     * @returns {Array} - Array ordenado por similaridade (mais similar primeiro)
     */
    sortBySimilarity(strings, reference) {
        return [...strings].sort((a, b) => {
            const distA = this.levenshteinDistance(a, reference);
            const distB = this.levenshteinDistance(b, reference);
            return distA - distB; // Menor distância = maior similaridade
        });
    }
    
    /**
     * Calcula a distância de edição (Levenshtein) entre duas strings
     * Menor distância = strings mais similares
     * @param {string} a - Primeira string
     * @param {string} b - Segunda string
     * @returns {number} - Distância de Levenshtein
     */
    levenshteinDistance(a, b) {
        // Matriz para programação dinâmica
        const matrix = [];
        
        // Inicializar a primeira linha
        for (let i = 0; i <= b.length; i++) {
            matrix[0] = [i];
        }
        
        // Inicializar a primeira coluna
        for (let i = 0; i <= a.length; i++) {
            matrix[i] = [i];
        }
        
        // Preencher a matriz
        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                if (a.charAt(i - 1) === b.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // substituição
                        matrix[i][j - 1] + 1,     // inserção
                        matrix[i - 1][j] + 1      // remoção
                    );
                }
            }
        }
        
        return matrix[a.length][b.length];
    }
    
    /**
     * Versão otimizada da distância de Levenshtein que economiza memória
     * usando apenas duas linhas da matriz em vez da matriz completa
     * @param {string} a - Primeira string
     * @param {string} b - Segunda string
     * @returns {number} - Distância de Levenshtein
     */
    levenshteinDistanceOptimized(a, b) {
        // Se uma das strings é vazia, a distância é o comprimento da outra
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;
        
        // Usar apenas duas linhas da matriz para economizar memória
        let prevRow = Array(b.length + 1).fill().map((_, i) => i);
        let currRow = Array(b.length + 1).fill(0);
        
        // Preencher a matriz linha por linha
        for (let i = 0; i < a.length; i++) {
            currRow[0] = i + 1;
            
            for (let j = 0; j < b.length; j++) {
                const substitutionCost = a[i] === b[j] ? 0 : 1;
                currRow[j + 1] = Math.min(
                    currRow[j] + 1,                     // inserção
                    prevRow[j + 1] + 1,                 // remoção
                    prevRow[j] + substitutionCost       // substituição
                );
            }
            
            // Trocar as linhas para a próxima iteração
            [prevRow, currRow] = [currRow, prevRow];
        }
        
        // O resultado está na última célula preenchida da linha anterior
        return prevRow[b.length];
    }
}

// Função de demonstração
function demonstrateStringSorting() {
    const sorter = new ComplexStringSort();
    
    console.log("===== DEMONSTRAÇÃO DE ORDENAÇÃO DE STRINGS COMPLEXAS =====");
    
    // Teste de ordenação alfanumérica
    const filenames = [
        "file10.txt", "file2.txt", "file1.txt", "file100.txt", "file20.txt"
    ];
    
    console.log("\nOrdenação Alfanumérica (Natural Sort):");
    console.log("Original:", filenames);
    console.log("Ordenação padrão:", [...filenames].sort());
    console.log("Ordenação natural:", sorter.sortAlphanumeric(filenames));
    
    // Teste de ordenação com locale
    const palavras = [
        "café", "cache", "único", "universidade", "açaí", "agua", "ácido", "zebra"
    ];
    
    console.log("\nOrdenação com Locale:");
    console.log("Original:", palavras);
    console.log("Ordenação padrão:", [...palavras].sort());
    console.log("Ordenação pt-BR:", sorter.sortWithLocale(palavras, 'pt-BR'));
    
    // Teste de ordenação por similaridade
    const termos = [
        "algoritmo", "logaritmo", "ritmo", "algarismo", "algodão", "alergia"
    ];
    const referencia = "algoritmo";
    
    console.log("\nOrdenação por Similaridade:");
    console.log(`Termos ordenados por similaridade com "${referencia}":`);
    console.log(sorter.sortBySimilarity(termos, referencia));
    
    // Mostrar as distâncias para referência
    console.log("\nDistâncias de Levenshtein:");
    for (const termo of termos) {
        console.log(`"${termo}" → ${sorter.levenshteinDistance(termo, referencia)}`);
    }
}

// Executar a demonstração
// demonstrateStringSorting();

// Exportar a classe para uso em outros arquivos
module.exports = { ComplexStringSort }; 