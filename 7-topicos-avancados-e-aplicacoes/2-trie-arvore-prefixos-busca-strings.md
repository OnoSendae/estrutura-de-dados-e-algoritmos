# Algoritmos e Estrutura de Dados na Prática

## Módulo 7: Tópicos Avançados e Aplicações

### 2. Trie (Árvore de Prefixos)

A Trie, ou Árvore de Prefixos, é uma estrutura de dados especializada em armazenar e buscar strings de forma eficiente. Ela se destaca quando precisamos fazer operações relacionadas a prefixos de palavras, como autocompletar, verificar se uma palavra existe em um dicionário, ou encontrar palavras com prefixos específicos.

#### Comparação com Estruturas Anteriores

| Estrutura | Busca | Inserção | Operações com prefixos | Uso de memória |
|-----------|-------|----------|------------------------|----------------|
| **Array** (Módulo 2) | O(n) | O(1) no final | O(n) | Baixo |
| **BST** (Módulo 3) | O(log n) em média | O(log n) | Ineficiente | Médio |
| **Tabela Hash** (Módulo 5) | O(1) em média | O(1) em média | Não suporta nativamente | Alto |
| **Trie** | O(m) onde m = tamanho da string | O(m) | O(m) + O(k) onde k = # de resultados | Alto, mas otimizado para prefixos |

A Trie combina a eficiência de busca das tabelas hash com a capacidade de organização hierárquica das árvores, sendo ideal para operações com prefixos.

#### Analogia: Sistema de Arquivos 📂

Imagine um sistema de arquivos em um computador:
- Cada pasta pode conter outras pastas ou arquivos
- Para alcançar um arquivo, seguimos um caminho específico
- Nomes de arquivos com início comum compartilham o mesmo caminho parcial

Por exemplo, para os arquivos:
```
/documentos/trabalho/relatorio2023.pdf
/documentos/trabalho/apresentacao.pptx
/documentos/pessoal/fotos/viagem.jpg
```

Não precisamos armazenar "/documentos/" repetidamente para cada arquivo; a estrutura de diretórios permite compartilhar esses prefixos comuns. A Trie funciona de maneira semelhante para strings!

### Conceito Básico

Uma Trie é uma árvore ordenada onde:
- Cada nó representa um caractere ou está vazio (raiz)
- O caminho da raiz até qualquer nó forma uma string (prefixo)
- Os valores geralmente são associados às folhas ou a nós específicos (fim de palavra)
- Cada nó pode ter vários filhos (tipicamente até 26 para letras do alfabeto inglês)

### Representação Visual

Imagine uma Trie contendo as palavras: "a", "an", "and", "ant", "at", "ate":

```
                (raiz)
                  |
                  a*
                 /|\
              n*  t*  l
             /|    |
          d*  t*   e*
         /
        -*
        
Legenda: 
* - fim de palavra
a* - "a" é uma palavra completa
n* - "an" é uma palavra completa
etc.
```

Onde * indica que existe uma palavra terminando naquele nó.

### Operações Principais

1. **Inserção**: Adiciona uma palavra à Trie, criando novos nós conforme necessário
2. **Busca**: Verifica se uma palavra existe na Trie
3. **Prefixo**: Verifica se existe alguma palavra com um prefixo específico
4. **Remoção**: Remove uma palavra da Trie (opcional)
5. **Autocompletar**: Sugere palavras com base em um prefixo

### Implementação Básica

Vamos implementar uma Trie que suporte as operações fundamentais:

```javascript
class TrieNode {
    constructor() {
        // Mapa de caracteres para nós filhos
        this.children = new Map();
        // Indica se uma palavra termina neste nó
        this.isEndOfWord = false;
        // Para fins didáticos, armazenamos a palavra que termina aqui (opcional)
        this.word = null;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }
    
    // Inserir uma palavra na Trie
    insert(word) {
        let currentNode = this.root;
        
        for (const char of word) {
            if (!currentNode.children.has(char)) {
                currentNode.children.set(char, new TrieNode());
            }
            currentNode = currentNode.children.get(char);
        }
        
        // Marca como fim de palavra
        currentNode.isEndOfWord = true;
        currentNode.word = word;
        
        return this; // Para encadear chamadas
    }
    
    // Verificar se uma palavra existe na Trie
    search(word) {
        let currentNode = this.root;
        
        for (const char of word) {
            if (!currentNode.children.has(char)) {
                return false;
            }
            currentNode = currentNode.children.get(char);
        }
        
        return currentNode.isEndOfWord;
    }
    
    // Verificar se existe alguma palavra com o prefixo dado
    startsWith(prefix) {
        let currentNode = this.root;
        
        for (const char of prefix) {
            if (!currentNode.children.has(char)) {
                return false;
            }
            currentNode = currentNode.children.get(char);
        }
        
        return true;
    }
    
    // Retorna todas as palavras com um prefixo específico (autocompletar)
    findWordsWithPrefix(prefix) {
        const results = [];
        let currentNode = this.root;
        
        // Navegar até o nó que representa o fim do prefixo
        for (const char of prefix) {
            if (!currentNode.children.has(char)) {
                return results; // Prefixo não encontrado
            }
            currentNode = currentNode.children.get(char);
        }
        
        // Função auxiliar para DFS a partir do nó final do prefixo
        const findAllWords = (node, words) => {
            if (node.isEndOfWord) {
                words.push(node.word);
            }
            
            for (const [char, childNode] of node.children) {
                findAllWords(childNode, words);
            }
        };
        
        findAllWords(currentNode, results);
        return results;
    }
    
    // Remover uma palavra da Trie
    delete(word) {
        // Função auxiliar recursiva para remoção
        const deleteHelper = (node, word, index) => {
            // Caso base: fim da palavra
            if (index === word.length) {
                // Se não era fim de palavra, não há nada para remover
                if (!node.isEndOfWord) {
                    return false;
                }
                
                // Marca que não termina mais uma palavra aqui
                node.isEndOfWord = false;
                node.word = null;
                
                // Retorna true se este nó não tem mais filhos
                return node.children.size === 0;
            }
            
            const char = word[index];
            if (!node.children.has(char)) {
                return false; // A palavra não existe na Trie
            }
            
            const childNode = node.children.get(char);
            const shouldDeleteChild = deleteHelper(childNode, word, index + 1);
            
            // Se devemos excluir o filho e este nó não é fim de outra palavra
            if (shouldDeleteChild && !childNode.isEndOfWord) {
                node.children.delete(char);
                return node.children.size === 0;
            }
            
            return false;
        };
        
        deleteHelper(this.root, word, 0);
        return this;
    }
    
    // Visualizar a estrutura da Trie (para fins didáticos)
    printTrie() {
        const printHelper = (node, prefix, isLast, indent) => {
            // Imprimir caractere atual
            process.stdout.write(indent);
            
            if (prefix) {
                if (isLast) {
                    process.stdout.write("└── ");
                    indent += "    ";
                } else {
                    process.stdout.write("├── ");
                    indent += "│   ";
                }
                process.stdout.write(prefix);
                if (node.isEndOfWord) {
                    process.stdout.write("*");
                }
                process.stdout.write("\n");
            } else {
                process.stdout.write("(root)\n");
            }
            
            // Obter todos os caracteres filhos
            const keys = Array.from(node.children.keys());
            
            // Imprimir cada filho
            for (let i = 0; i < keys.length; i++) {
                const char = keys[i];
                const childNode = node.children.get(char);
                printHelper(childNode, char, i === keys.length - 1, indent);
            }
        };
        
        console.log("\nEstrutura da Trie:");
        printHelper(this.root, "", false, "");
    }
}

// Exemplo de uso
const trie = new Trie();

// Inserir palavras
trie.insert("apple")
    .insert("app")
    .insert("application")
    .insert("banana")
    .insert("ball")
    .insert("bat");

// Visualizar a estrutura
trie.printTrie();

// Buscar palavras
console.log("\nBusca de palavras:");
console.log(`"apple" existe? ${trie.search("apple")}`);
console.log(`"app" existe? ${trie.search("app")}`);
console.log(`"orange" existe? ${trie.search("orange")}`);

// Verificar prefixos
console.log("\nVerificação de prefixos:");
console.log(`Prefixo "ap" existe? ${trie.startsWith("ap")}`);
console.log(`Prefixo "ora" existe? ${trie.startsWith("ora")}`);

// Autocompletar
console.log("\nAutocompletar:");
console.log(`Palavras com prefixo "ap": ${trie.findWordsWithPrefix("ap").join(", ")}`);
console.log(`Palavras com prefixo "ba": ${trie.findWordsWithPrefix("ba").join(", ")}`);

// Remoção
console.log("\nRemoção:");
trie.delete("app");
console.log(`"app" após remoção: ${trie.search("app")}`);
console.log(`"apple" após remoção de "app": ${trie.search("apple")}`);
trie.printTrie();
```

### Otimizações e Variações

#### 1. Trie Compacta (Compressed Trie)

Em uma Trie tradicional, muitos nós podem ter apenas um filho, resultando em caminhos longos. A Trie Compacta soluciona isso combinando esses caminhos em um único nó.

```javascript
class CompactTrieNode {
    constructor() {
        this.children = new Map();
        this.isEndOfWord = false;
        this.word = null;
        this.prefix = ""; // Armazena o prefixo deste nó
    }
}

class CompactTrie {
    constructor() {
        this.root = new CompactTrieNode();
    }
    
    insert(word) {
        const insertHelper = (node, word, startIndex) => {
            // Se chegamos ao fim da palavra
            if (startIndex === word.length) {
                node.isEndOfWord = true;
                node.word = word;
                return;
            }
            
            // Encontrar o maior prefixo comum com algum filho
            for (const [edgeLabel, childNode] of node.children) {
                let i = 0;
                while (i < edgeLabel.length && startIndex + i < word.length && 
                       edgeLabel[i] === word[startIndex + i]) {
                    i++;
                }
                
                // Se encontramos um prefixo comum
                if (i > 0) {
                    // Se o prefixo é toda a aresta
                    if (i === edgeLabel.length) {
                        insertHelper(childNode, word, startIndex + i);
                    } else {
                        // Dividir o nó
                        const midNode = new CompactTrieNode();
                        const newEdgePrefix = edgeLabel.substring(0, i);
                        const oldEdgeSuffix = edgeLabel.substring(i);
                        
                        // Ajustar as arestas
                        node.children.delete(edgeLabel);
                        node.children.set(newEdgePrefix, midNode);
                        midNode.children.set(oldEdgeSuffix, childNode);
                        
                        // Inserir o resto da palavra
                        insertHelper(midNode, word, startIndex + i);
                    }
                    return;
                }
            }
            
            // Nenhum prefixo comum encontrado, criar um novo nó
            const newNode = new CompactTrieNode();
            newNode.isEndOfWord = true;
            newNode.word = word;
            node.children.set(word.substring(startIndex), newNode);
        };
        
        insertHelper(this.root, word, 0);
        return this;
    }
    
    search(word) {
        const searchHelper = (node, word, startIndex) => {
            if (startIndex === word.length) {
                return node.isEndOfWord;
            }
            
            for (const [edgeLabel, childNode] of node.children) {
                if (word.substring(startIndex).startsWith(edgeLabel)) {
                    return searchHelper(childNode, word, startIndex + edgeLabel.length);
                }
            }
            
            return false;
        };
        
        return searchHelper(this.root, word, 0);
    }
    
    // Visualizador simplificado para uma Trie compacta
    printTrie() {
        const printHelper = (node, indent, isLast) => {
            // Imprimir o nó atual
            process.stdout.write(indent);
            
            if (isLast) {
                process.stdout.write("└── ");
                indent += "    ";
            } else {
                process.stdout.write("├── ");
                indent += "│   ";
            }
            
            if (node === this.root) {
                process.stdout.write("(root)\n");
            } else {
                process.stdout.write(node.prefix);
                if (node.isEndOfWord) {
                    process.stdout.write("*");
                }
                process.stdout.write("\n");
            }
            
            // Obter todos os caracteres filhos
            const edges = Array.from(node.children.keys());
            
            // Imprimir cada aresta
            for (let i = 0; i < edges.length; i++) {
                const edge = edges[i];
                const childNode = node.children.get(edge);
                
                // Armazenar o prefixo no nó para visualização
                childNode.prefix = edge;
                
                printHelper(childNode, indent, i === edges.length - 1);
            }
        };
        
        console.log("\nEstrutura da Trie Compacta:");
        printHelper(this.root, "", true);
    }
}

// Exemplo
const compactTrie = new CompactTrie();
compactTrie.insert("romane")
          .insert("romanus")
          .insert("romulus")
          .insert("rubens")
          .insert("ruber")
          .insert("rubicon");

compactTrie.printTrie();
console.log(`"romane" existe? ${compactTrie.search("romane")}`);
console.log(`"romulus" existe? ${compactTrie.search("romulus")}`);
console.log(`"romario" existe? ${compactTrie.search("romario")}`);
```

#### 2. Ternary Search Trie

Uma variação eficiente em termos de memória, onde cada nó tem no máximo três filhos: menor, igual e maior.

```javascript
class TSTNode {
    constructor(char) {
        this.char = char;
        this.isEndOfWord = false;
        this.left = null;    // Caracteres menores
        this.equal = null;   // Próximo caractere na palavra
        this.right = null;   // Caracteres maiores
        this.word = null;    // A palavra completa (se este nó for fim de palavra)
    }
}

class TernarySearchTrie {
    constructor() {
        this.root = null;
    }
    
    insert(word) {
        if (!word || word.length === 0) return this;
        
        const insertHelper = (node, word, pos) => {
            const char = word[pos];
            
            if (node === null) {
                node = new TSTNode(char);
            }
            
            if (char < node.char) {
                node.left = insertHelper(node.left, word, pos);
            } else if (char > node.char) {
                node.right = insertHelper(node.right, word, pos);
            } else {
                if (pos < word.length - 1) {
                    node.equal = insertHelper(node.equal, word, pos + 1);
                } else {
                    node.isEndOfWord = true;
                    node.word = word;
                }
            }
            
            return node;
        };
        
        this.root = insertHelper(this.root, word, 0);
        return this;
    }
    
    search(word) {
        if (!word || word.length === 0) return false;
        
        let currentNode = this.root;
        let i = 0;
        
        while (currentNode !== null) {
            if (word[i] < currentNode.char) {
                currentNode = currentNode.left;
            } else if (word[i] > currentNode.char) {
                currentNode = currentNode.right;
            } else {
                i++;
                if (i === word.length) {
                    return currentNode.isEndOfWord;
                }
                currentNode = currentNode.equal;
            }
        }
        
        return false;
    }
    
    // Encontra todas as palavras com um prefixo específico
    findWordsWithPrefix(prefix) {
        const results = [];
        
        if (!prefix || prefix.length === 0) return results;
        
        // Encontrar o nó que corresponde ao último caractere do prefixo
        const findPrefixNode = (node, pos) => {
            if (node === null) return null;
            
            if (prefix[pos] < node.char) {
                return findPrefixNode(node.left, pos);
            } else if (prefix[pos] > node.char) {
                return findPrefixNode(node.right, pos);
            } else {
                if (pos === prefix.length - 1) {
                    return node;
                }
                return findPrefixNode(node.equal, pos + 1);
            }
        };
        
        // Coletar todas as palavras a partir de um nó
        const collectWords = (node, words) => {
            if (node === null) return;
            
            if (node.isEndOfWord) {
                words.push(node.word);
            }
            
            collectWords(node.left, words);
            collectWords(node.equal, words);
            collectWords(node.right, words);
        };
        
        const prefixNode = findPrefixNode(this.root, 0);
        
        if (prefixNode !== null) {
            if (prefixNode.isEndOfWord) {
                results.push(prefixNode.word);
            }
            collectWords(prefixNode.equal, results);
        }
        
        return results;
    }
}

// Exemplo
const tstTrie = new TernarySearchTrie();
tstTrie.insert("apple")
       .insert("application")
       .insert("banana")
       .insert("bat")
       .insert("behavior");

console.log("\nTernary Search Trie:");
console.log(`"apple" existe? ${tstTrie.search("apple")}`);
console.log(`"application" existe? ${tstTrie.search("application")}`);
console.log(`"app" existe? ${tstTrie.search("app")}`);

console.log("\nPalavras com prefixo 'ba':", tstTrie.findWordsWithPrefix("ba"));
```

### Complexidade

| Operação          | Complexidade de Tempo               |
|-------------------|-------------------------------------|
| Inserção          | O(m), onde m é o comprimento da palavra |
| Busca             | O(m), onde m é o comprimento da palavra |
| Prefixo           | O(p), onde p é o comprimento do prefixo |
| Exclusão          | O(m), onde m é o comprimento da palavra |
| Espaço            | O(n * m), onde n é o número de palavras e m é o comprimento médio |

### Aplicações Práticas

1. **Autocompletar**
   - Sugestões de pesquisa em motores de busca
   - Preenchimento automático em formulários

2. **Verificação ortográfica**
   - Dicionários
   - Corretores ortográficos

3. **Roteamento IP**
   - Tabelas de roteamento de prefixos mais longos

4. **Processamento de linguagem natural**
   - Análise de texto
   - Extração de entidades

5. **Jogos**
   - Validação de palavras (ex: Scrabble)
   - Busca em árvores de jogos

### Exemplo Prático: Sistema de Autocompletar

```javascript
class AutocompleteSystem {
    constructor(sentences, times) {
        this.trie = new Trie();
        this.currentInput = "";
        this.MAX_SUGGESTIONS = 3;
        
        // Inicializar com frases existentes e suas frequências
        for (let i = 0; i < sentences.length; i++) {
            this.trie.insert(sentences[i], times[i]);
        }
    }
    
    input(c) {
        // Caso especial: fim da entrada
        if (c === '#') {
            this.trie.insert(this.currentInput, 1); // Incrementa ou adiciona
            this.currentInput = "";
            return [];
        }
        
        // Adiciona o caractere à entrada atual
        this.currentInput += c;
        
        // Encontra todas as sugestões para a entrada atual
        return this.getSuggestions();
    }
    
    getSuggestions() {
        const candidates = this.trie.findWordsWithPrefix(this.currentInput);
        
        // Ordena por frequência (maior primeiro) e depois lexicograficamente
        candidates.sort((a, b) => {
            if (a.frequency !== b.frequency) {
                return b.frequency - a.frequency;
            }
            return a.word.localeCompare(b.word);
        });
        
        // Retorna apenas as TOP sugestões
        return candidates.slice(0, this.MAX_SUGGESTIONS).map(item => item.word);
    }
}

// Extensão da Trie para suportar frequências
class TrieNodeWithFreq extends TrieNode {
    constructor() {
        super();
        this.frequency = 0;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNodeWithFreq();
    }
    
    insert(word, frequency = 1) {
        let currentNode = this.root;
        
        for (const char of word) {
            if (!currentNode.children.has(char)) {
                currentNode.children.set(char, new TrieNodeWithFreq());
            }
            currentNode = currentNode.children.get(char);
        }
        
        currentNode.isEndOfWord = true;
        currentNode.word = word;
        currentNode.frequency += frequency;
        
        return this;
    }
    
    findWordsWithPrefix(prefix) {
        const results = [];
        let currentNode = this.root;
        
        // Navegar até o nó que representa o fim do prefixo
        for (const char of prefix) {
            if (!currentNode.children.has(char)) {
                return results;
            }
            currentNode = currentNode.children.get(char);
        }
        
        // Função auxiliar para DFS
        const findAllWords = (node, words) => {
            if (node.isEndOfWord) {
                words.push({
                    word: node.word,
                    frequency: node.frequency
                });
            }
            
            for (const [char, childNode] of node.children) {
                findAllWords(childNode, words);
            }
        };
        
        findAllWords(currentNode, results);
        return results;
    }
}

// Exemplo
const sentences = ["i love you", "island", "ironman", "i love leetcode"];
const times = [5, 3, 2, 2];
const autocomplete = new AutocompleteSystem(sentences, times);

console.log("\nSistema de Autocompletar:");
console.log(`Sugestões para 'i': ${autocomplete.input('i')}`);
console.log(`Sugestões para 'is': ${autocomplete.input('s')}`);
console.log(`Sugestões para 'isl': ${autocomplete.input('l')}`);
autocomplete.input('#'); // Finaliza a entrada
console.log(`Sugestões para 'i' após adição: ${autocomplete.input('i')}`);
```

### Exercícios Práticos

1. **Básico:** Implemente uma função que retorne o número de palavras na Trie que começam com um prefixo específico.

2. **Intermediário:** Modifique a Trie para armazenar não apenas palavras, mas também suas definições (como um dicionário).

3. **Avançado:** Implemente uma função de correção ortográfica que sugira palavras semelhantes quando uma palavra não é encontrada na Trie (usando distância de Levenshtein).

### Considerações de Desempenho

1. **Consumo de memória**
   - Uma Trie tradicional pode consumir muita memória para armazenar palavras com poucos prefixos comuns
   - Use Trie Compacta ou Ternary Search Trie para economizar memória

2. **Tamanho do alfabeto**
   - Se o alfabeto é grande (ex: Unicode), use um Map ou objeto em vez de um array fixo para filhos

3. **Inserção e busca**
   - Embora a complexidade seja O(m), a constante de tempo pode ser alta dependendo da implementação

### Conclusão

A Trie é uma estrutura de dados poderosa e especializada para operações com strings, particularmente quando precisamos fazer consultas eficientes de prefixos. Suas aplicações vão desde simples verificações de dicionário até sistemas de autocompletar sofisticados.

No próximo módulo, exploraremos como usar a Trie em um caso prático: a implementação de um sistema de busca com autocompletar. 