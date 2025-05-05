# Algoritmos e Estrutura de Dados na Prática

## Módulo 7: Tópicos Avançados e Aplicações

### 5. Exercícios Práticos com Tópicos Avançados

Nesta aula, vamos consolidar e aplicar os conhecimentos adquiridos nas aulas anteriores do Módulo 7 através de exercícios práticos. Abordaremos problemas que integram os conceitos de Árvores de Segmentos, Árvores de Fenwick, Tries, Algoritmos de Compressão e Geometria Computacional.

#### Estrutura da Aula

Para cada exercício, apresentaremos:
1. Um problema desafiador
2. Orientações para a solução
3. Uma implementação detalhada
4. Análise de complexidade
5. Possíveis variações e extensões

#### Níveis de Dificuldade

Os exercícios estão organizados em três níveis de dificuldade:

- **Nível Iniciante**: Compreensão básica das estruturas e algoritmos apresentados
- **Nível Intermediário**: Aplicação em problemas mais complexos, integrando múltiplas estruturas
- **Nível Avançado**: Problemas desafiadores que exigem otimizações e insights profundos

### Exercícios Nível Iniciante

#### Exercício 1.1: Sistema de Consultas em Intervalos

**Problema:** Desenvolva um sistema que gerencie uma sequência de números e suporte eficientemente consultas de soma e mínimo em intervalos, além de atualizações em intervalos.

**Solução usando Árvore de Segmentos:**

```javascript
class SegmentTree {
    constructor(array) {
        this.n = array.length;
        this.array = [...array];
        this.sumTree = new Array(4 * this.n).fill(0);
        this.minTree = new Array(4 * this.n).fill(Infinity);
        
        if (this.n > 0) {
            this.build(1, 0, this.n - 1);
        }
    }
    
    build(node, start, end) {
        if (start === end) {
            this.sumTree[node] = this.array[start];
            this.minTree[node] = this.array[start];
            return;
        }
        
        const mid = Math.floor((start + end) / 2);
        this.build(2 * node, start, mid);
        this.build(2 * node + 1, mid + 1, end);
        
        this.sumTree[node] = this.sumTree[2 * node] + this.sumTree[2 * node + 1];
        this.minTree[node] = Math.min(this.minTree[2 * node], this.minTree[2 * node + 1]);
    }
    
    update(index, newValue, node = 1, start = 0, end = this.n - 1) {
        if (start === end) {
            this.array[index] = newValue;
            this.sumTree[node] = newValue;
            this.minTree[node] = newValue;
            return;
        }
        
        const mid = Math.floor((start + end) / 2);
        
        if (index <= mid) {
            this.update(index, newValue, 2 * node, start, mid);
        } else {
            this.update(index, newValue, 2 * node + 1, mid + 1, end);
        }
        
        this.sumTree[node] = this.sumTree[2 * node] + this.sumTree[2 * node + 1];
        this.minTree[node] = Math.min(this.minTree[2 * node], this.minTree[2 * node + 1]);
    }
    
    querySum(left, right, node = 1, start = 0, end = this.n - 1) {
        if (right < start || left > end) {
            return 0;
        }
        
        if (left <= start && end <= right) {
            return this.sumTree[node];
        }
        
        const mid = Math.floor((start + end) / 2);
        const leftSum = this.querySum(left, right, 2 * node, start, mid);
        const rightSum = this.querySum(left, right, 2 * node + 1, mid + 1, end);
        
        return leftSum + rightSum;
    }
    
    queryMin(left, right, node = 1, start = 0, end = this.n - 1) {
        if (right < start || left > end) {
            return Infinity;
        }
        
        if (left <= start && end <= right) {
            return this.minTree[node];
        }
        
        const mid = Math.floor((start + end) / 2);
        const leftMin = this.queryMin(left, right, 2 * node, start, mid);
        const rightMin = this.queryMin(left, right, 2 * node + 1, mid + 1, end);
        
        return Math.min(leftMin, rightMin);
    }
}

// Exemplo de uso
const array = [1, 3, 5, 7, 9, 11];
const segTree = new SegmentTree(array);

console.log("Soma do intervalo [1, 4]:", segTree.querySum(1, 4)); // 3+5+7+9=24
console.log("Mínimo do intervalo [1, 4]:", segTree.queryMin(1, 4)); // 3

segTree.update(2, 10); // Atualiza o elemento no índice 2 para 10
console.log("Soma após atualização:", segTree.querySum(1, 4)); // 3+10+7+9=29
```

**Análise de Complexidade:**
- Construção: O(n)
- Consultas e atualizações: O(log n)
- Espaço: O(n)

#### Exercício 1.2: Sistema de Autocompletar Básico

**Problema:** Implemente um sistema de autocompletar que sugira palavras baseado em um prefixo, com suporte para classificação por frequência.

**Solução usando Trie:**

```javascript
class TrieNode {
    constructor() {
        this.children = new Map();
        this.isEndOfWord = false;
        this.word = null;
        this.frequency = 0;
    }
}

class Autocomplete {
    constructor() {
        this.root = new TrieNode();
    }
    
    addWord(word, frequency = 1) {
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
    }
    
    getSuggestions(prefix, limit = 5) {
        let current = this.root;
        
        // Navegar até o nó do prefixo
        for (const char of prefix) {
            if (!current.children.has(char)) {
                return []; // Prefixo não encontrado
            }
            current = current.children.get(char);
        }
        
        // Coletar todas as palavras que começam com o prefixo
        const suggestions = [];
        this._collectWords(current, suggestions);
        
        // Ordenar por frequência (decrescente)
        suggestions.sort((a, b) => b.frequency - a.frequency);
        return suggestions.slice(0, limit);
    }
    
    _collectWords(node, suggestions) {
        if (node.isEndOfWord) {
            suggestions.push({
                word: node.word,
                frequency: node.frequency
            });
        }
        
        for (const [_, childNode] of node.children) {
            this._collectWords(childNode, suggestions);
        }
    }
}

// Exemplo de uso
const autocomplete = new Autocomplete();

// Adicionar palavras com frequências
autocomplete.addWord("programação", 100);
autocomplete.addWord("programa", 80);
autocomplete.addWord("programador", 75);
autocomplete.addWord("projeto", 90);

// Buscar sugestões
console.log("Sugestões para 'pro':");
console.table(autocomplete.getSuggestions("pro"));
```

**Análise de Complexidade:**
- Inserção: O(m), onde m é o comprimento da palavra
- Busca: O(p + k log k), onde p é o comprimento do prefixo e k é o número de palavras com o prefixo

### Exercícios Nível Intermediário

#### Exercício 2.1: Compressor de Arquivos de Texto

**Problema:** Implemente um compressor/descompressor de arquivos de texto usando o algoritmo de Huffman. O sistema deve reportar a taxa de compressão alcançada.

**Orientações:**
1. Calcule a frequência de cada caractere no texto
2. Construa a árvore de Huffman
3. Gere os códigos para cada caractere
4. Comprima o texto substituindo caracteres pelos códigos correspondentes
5. Armazene a tabela de codificação junto com o texto comprimido para permitir descompressão

**Solução Parcial:**

```javascript
class HuffmanCompressor {
    constructor() {
        this.huffman = new HuffmanCoding();
    }
    
    compress(text) {
        // Construir a árvore e gerar códigos
        this.huffman.buildTree(text);
        
        // Codificar o texto
        const encodedText = this.huffman.encode(text);
        
        // Calcular taxa de compressão
        const originalSize = text.length * 8; // Assumindo 8 bits por caractere
        const compressedSize = encodedText.length;
        const compressionRatio = (1 - compressedSize / originalSize) * 100;
        
        return {
            encodedText,
            codes: this.huffman.codes,
            originalSize,
            compressedSize,
            compressionRatio: compressionRatio.toFixed(2) + '%'
        };
    }
    
    decompress(encodedText, codes) {
        // Reconstruir a árvore de Huffman a partir dos códigos
        this.huffman.reconstructTreeFromCodes(codes);
        
        // Decodificar o texto
        return this.huffman.decode(encodedText);
    }
}
```

#### Exercício 2.2: Detector de Padrões em Imagens (Geometria Computacional)

**Problema:** Implemente um algoritmo que encontre a envoltória convexa de um conjunto de pontos representando pixels em uma imagem, e determine se um novo ponto está dentro ou fora dessa envoltória.

### Exercícios Nível Avançado

#### Exercício 3.1: Banco de Dados com Índices Eficientes

**Problema:** Implemente um sistema de banco de dados simplificado que utilize Tries para indexar campos de texto e Árvores de Fenwick para realizar consultas estatísticas eficientes em campos numéricos.

**Requisitos:**
- Suporte a inserção, exclusão e atualização de registros
- Busca por texto utilizando prefixos (via Trie)
- Consultas estatísticas (soma, média, contagem) em intervalos (via Fenwick Tree)
- Combinação de ambas as consultas

**Exemplo de Interface:**

```javascript
const db = new AdvancedDatabase();

// Adicionar registros
db.insert({ id: 1, name: "João", age: 25, salary: 3500 });
db.insert({ id: 2, name: "Maria", age: 30, salary: 4200 });
// ...

// Consultas de texto
const namesWithJ = db.searchByPrefix("name", "J");

// Consultas estatísticas
const avgSalaryRange = db.queryRange("salary", 3000, 5000, "avg");
const countInAgeRange = db.queryRange("age", 20, 40, "count");

// Consulta combinada
const result = db.combinedQuery()
  .withPrefix("name", "M")
  .inRange("age", 25, 35)
  .select(["id", "name", "salary"])
  .execute();
```

#### Exercício 3.2: Sistema de Recomendação de Texto Preditivo

**Problema:** Desenvolva um sistema de recomendação de texto que combine Tries para autocompletar com um algoritmo de análise contextual para sugerir as próximas palavras com base nas palavras anteriores.

**Desafio adicional:** Implemente uma versão que aprenda com as escolhas do usuário, ajustando as frequências das sugestões ao longo do tempo.

### Exercício Integrativo Final

**Problema:** Sistema de Análise de Logs com Compressão e Consultas Eficientes

Desenvolva um sistema completo que:

1. Comprime logs usando Huffman Coding para economia de armazenamento
2. Indexa timestamps dos logs usando Árvores de Fenwick para consultas temporais eficientes
3. Indexa mensagens de erro/informação usando Tries para busca rápida por texto
4. Permite consultas complexas combinando intervalos de tempo e padrões de texto
5. Gera visualizações estatísticas (como histogramas de ocorrências) usando algoritmos de geometria computacional

Este exercício final integra todos os conhecimentos adquiridos no módulo e serve como uma aplicação prática e realista das estruturas e algoritmos avançados que estudamos.

### Conclusão

Os exercícios práticos apresentados nesta aula consolidam os tópicos avançados que estudamos no Módulo 7. Estes algoritmos e estruturas de dados têm aplicações significativas em problemas do mundo real e são frequentemente utilizados em sistemas de alto desempenho.

Na próxima aula, exploraremos um estudo de caso completo que integrará estes conceitos em uma aplicação prática: a implementação de um sistema de busca autocompletar. 