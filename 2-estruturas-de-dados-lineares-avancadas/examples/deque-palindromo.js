/**
 * Verificador de Palíndromos usando Deque
 * 
 * Um palíndromo é uma palavra, frase ou número que permanece igual quando lido de trás para frente.
 * Exemplos: "radar", "ovo", "Socorram-me, subi no ônibus em Marrocos"
 * 
 * Esta implementação usa um deque para verificar se uma string é um palíndromo.
 */

// Implementação simples de Deque
class Deque {
    constructor() {
        this.items = [];
    }
    
    // Adiciona elemento no início
    addFront(item) {
        this.items.unshift(item);
    }
    
    // Adiciona elemento no final
    addRear(item) {
        this.items.push(item);
    }
    
    // Remove e retorna elemento do início
    removeFront() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.shift();
    }
    
    // Remove e retorna elemento do final
    removeRear() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.pop();
    }
    
    // Retorna elemento do início sem remover
    peekFront() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[0];
    }
    
    // Retorna elemento do final sem remover
    peekRear() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[this.items.length - 1];
    }
    
    // Verifica se o deque está vazio
    isEmpty() {
        return this.items.length === 0;
    }
    
    // Retorna o tamanho do deque
    size() {
        return this.items.length;
    }
}

/**
 * Verifica se uma string é um palíndromo usando um deque.
 * @param {string} str - A string a ser verificada
 * @returns {boolean} - Verdadeiro se for um palíndromo, falso caso contrário
 */
function isPalindrome(str) {
    // Normaliza a string: remove espaços, pontuação e converte para minúsculas
    const normalizedStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Cria um deque e adiciona cada caractere
    const deque = new Deque();
    for (let char of normalizedStr) {
        deque.addRear(char);
    }
    
    // Compara caracteres das duas extremidades até o meio
    while (deque.size() > 1) {
        const first = deque.removeFront();
        const last = deque.removeRear();
        
        if (first !== last) {
            return false;
        }
    }
    
    return true;
}

/**
 * Versão otimizada que não precisa criar o deque completo antes de começar a verificar
 */
function isPalindromeOptimized(str) {
    // Normaliza a string: remove espaços, pontuação e converte para minúsculas
    const normalizedStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Uso de dois ponteiros em vez de um deque completo
    let left = 0;
    let right = normalizedStr.length - 1;
    
    while (left < right) {
        if (normalizedStr[left] !== normalizedStr[right]) {
            return false;
        }
        left++;
        right--;
    }
    
    return true;
}

// Demonstrações de uso
const testCases = [
    "radar",
    "A man, a plan, a canal: Panama",
    "No lemon, no melon",
    "Was it a car or a cat I saw?",
    "Socorram-me, subi no ônibus em Marrocos",
    "Anotaram a data da maratona",
    "Hello World",
    "JavaScript",
    "Algoritmos e Estruturas de Dados"
];

console.log("=== Verificação de Palíndromos usando Deque ===");
console.log("Algoritmo 1: Usando Deque completo\n");

for (const test of testCases) {
    console.log(`"${test}" ${isPalindrome(test) ? 'É' : 'NÃO é'} um palíndromo`);
}

console.log("\nAlgoritmo 2: Versão otimizada (ponteiros)\n");

for (const test of testCases) {
    console.log(`"${test}" ${isPalindromeOptimized(test) ? 'É' : 'NÃO é'} um palíndromo`);
}

/**
 * Este exemplo mostra duas abordagens para verificar palíndromos:
 * 
 * 1. Usando um deque:
 *    - Cada caractere é adicionado ao deque
 *    - Comparamos os caracteres removidos das duas extremidades
 *    - Se todos coincidirem, é um palíndromo
 * 
 * 2. Usando ponteiros (mais eficiente):
 *    - Não usa memória adicional para um deque
 *    - Compara diretamente os caracteres nas posições left e right
 * 
 * Ambos os algoritmos têm complexidade de tempo O(n), mas o segundo usa menos memória.
 * Este exemplo demonstra como deques são úteis para problemas que envolvem 
 * comparação de elementos de ambas as extremidades de uma sequência.
 */ 