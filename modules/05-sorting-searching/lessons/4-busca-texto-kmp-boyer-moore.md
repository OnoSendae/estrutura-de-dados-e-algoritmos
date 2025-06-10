# Algoritmos de Busca em Textos: KMP e Boyer-Moore

## 🎯 Objetivos de Aprendizagem

- Compreender o problema de busca de padrões em texto
- Implementar o algoritmo KMP (Knuth-Morris-Pratt)
- Implementar o algoritmo Boyer-Moore
- Comparar diferentes abordagens de busca em texto
- Aplicar algoritmos de busca em problemas reais
- Entender as conexões com algoritmos de ordenação

## 📚 Introdução à Busca de Padrões

A busca de padrões (pattern matching) é fundamental em processamento de texto, com aplicações em editores, motores de busca, análise de DNA e muito mais.

### Contexto e Importância

Após estudarmos algoritmos de ordenação nos capítulos anteriores, agora nos concentramos em algoritmos eficientes para busca em texto. Enquanto os algoritmos de ordenação preparam os dados para busca rápida, os algoritmos de busca em texto lidam com o problema específico de encontrar padrões em grandes volumes de texto.

### Comparação com Busca Binária

| Busca Binária | Busca em Texto |
|---------------|---------------|
| Requer dados ordenados | Trabalha com texto não processado |
| Complexidade O(log n) | Complexidade varia de O(n+m) a O(n·m) |
| Encontra valores exatos | Encontra padrões dentro de textos |
| Usada em arrays | Usada em strings e documentos |

## 🔍 Algoritmo Ingênuo (Força Bruta)

O método mais simples para busca de padrões é verificar cada posição possível no texto.

### Implementação

```javascript
function naiveSearch(text, pattern) {
    const n = text.length;
    const m = pattern.length;
    const positions = [];
    
    for (let i = 0; i <= n - m; i++) {
        let j;
        
        for (j = 0; j < m; j++) {
            if (text[i + j] !== pattern[j]) {
                break;
            }
        }
        
        if (j === m) {
            positions.push(i);
        }
    }
    
    return positions;
}

// Exemplo de uso
const text = "ABABDABACDABABCABAB";
const pattern = "ABABC";
console.log(naiveSearch(text, pattern)); // [10]
```

### Visualização do Algoritmo Ingênuo

```
Texto:   ABABDABACDABABCABAB
Padrão:  ABABC

Tentativa 1, posição 0:
ABABDABACDABABCABAB
ABABC
^^^^^
Comparações: 5 (falhou no último caractere)

Tentativa 2, posição 1:
ABABDABACDABABCABAB
 ABABC
 ^
Comparações: 1 (falhou no primeiro caractere)

...

Tentativa 11, posição 10:
ABABDABACDABABCABAB
          ABABC
          ^^^^^
Comparações: 5 (match completo)

Total: 35 comparações
```

### Complexidade
- **Tempo**: O(n·m) no pior caso
- **Espaço**: O(1) (excluindo o armazenamento dos resultados)

## 🔄 Algoritmo KMP (Knuth-Morris-Pratt)

### Ideia Principal

O KMP evita comparações redundantes usando uma tabela de prefixos que indica onde continuar a busca após um mismatch.

### Vantagens:
- Elimina retrocesso no texto
- Aproveita informações sobre o padrão para pular posições
- Complexidade linear O(n+m)

### Tabela de Prefixos (Parte Crucial)

A tabela de prefixos (também chamada função de falha) armazena o tamanho do maior prefixo que é também sufixo para cada posição do padrão. Ela é usada para determinar onde recomeçar a busca após um mismatch.

```javascript
function computePrefixFunction(pattern) {
    const m = pattern.length;
    const prefix = new Array(m).fill(0);
    let k = 0;
    
    for (let q = 1; q < m; q++) {
        while (k > 0 && pattern[k] !== pattern[q]) {
            k = prefix[k - 1];
        }
        
        if (pattern[k] === pattern[q]) {
            k++;
        }
        
        prefix[q] = k;
    }
    
    return prefix;
}
```

### Visualização da Construção da Tabela de Prefixos

```
Padrão: "ABABCABAB"

Iteração 1: q=1 (B)
  pattern[0] = 'A', pattern[1] = 'B' (não são iguais)
  prefix[1] = 0

Iteração 2: q=2 (A)
  k=0, pattern[0] = 'A', pattern[2] = 'A' (são iguais)
  k++ = 1
  prefix[2] = 1

Iteração 3: q=3 (B)
  k=1, pattern[1] = 'B', pattern[3] = 'B' (são iguais)
  k++ = 2
  prefix[3] = 2

Iteração 4: q=4 (C)
  k=2, pattern[2] = 'A', pattern[4] = 'C' (não são iguais)
  k = prefix[1] = 0
  pattern[0] = 'A', pattern[4] = 'C' (não são iguais)
  prefix[4] = 0

Iteração 5: q=5 (A)
  k=0, pattern[0] = 'A', pattern[5] = 'A' (são iguais)
  k++ = 1
  prefix[5] = 1

Iteração 6: q=6 (B)
  k=1, pattern[1] = 'B', pattern[6] = 'B' (são iguais)
  k++ = 2
  prefix[6] = 2

Iteração 7: q=7 (A)
  k=2, pattern[2] = 'A', pattern[7] = 'A' (são iguais)
  k++ = 3
  prefix[7] = 3

Iteração 8: q=8 (B)
  k=3, pattern[3] = 'B', pattern[8] = 'B' (são iguais)
  k++ = 4
  prefix[8] = 4

Tabela de prefixos: [0, 0, 1, 2, 0, 1, 2, 3, 4]
```

### Implementação do KMP

```javascript
function kmpSearch(text, pattern) {
    const n = text.length;
    const m = pattern.length;
    const prefixTable = computePrefixFunction(pattern);
    const positions = [];
    let q = 0; // número de caracteres matched
    
    for (let i = 0; i < n; i++) {
        while (q > 0 && pattern[q] !== text[i]) {
            q = prefixTable[q - 1];
        }
        
        if (pattern[q] === text[i]) {
            q++;
        }
        
        if (q === m) {
            positions.push(i - m + 1);
            q = prefixTable[q - 1];
        }
    }
    
    return positions;
}

// Exemplo de uso
const text = "ABABDABACDABABCABAB";
const pattern = "ABABC";
console.log(kmpSearch(text, pattern)); // [10]
```

### Rastreamento do KMP

```
Texto:    ABABDABACDABABCABAB
Padrão:   ABABC
Prefixo:  [0,0,1,2,0]

Inicialização: q = 0

i=0 (A): pattern[0] = 'A', text[0] = 'A' (match)
   q++ = 1

i=1 (B): pattern[1] = 'B', text[1] = 'B' (match)
   q++ = 2

i=2 (A): pattern[2] = 'A', text[2] = 'A' (match)
   q++ = 3

i=3 (B): pattern[3] = 'B', text[3] = 'B' (match)
   q++ = 4

i=4 (D): pattern[4] = 'C', text[4] = 'D' (mismatch)
   q = prefixTable[q-1] = prefixTable[3] = 2
   pattern[2] = 'A', text[4] = 'D' (mismatch)
   q = prefixTable[q-1] = prefixTable[1] = 0
   pattern[0] = 'A', text[4] = 'D' (mismatch)
   q permanece 0

...

i=10 (A): pattern[0] = 'A', text[10] = 'A' (match)
   q++ = 1

i=11 (B): pattern[1] = 'B', text[11] = 'B' (match)
   q++ = 2

i=12 (A): pattern[2] = 'A', text[12] = 'A' (match)
   q++ = 3

i=13 (B): pattern[3] = 'B', text[13] = 'B' (match)
   q++ = 4

i=14 (C): pattern[4] = 'C', text[14] = 'C' (match)
   q++ = 5 (igual ao comprimento do padrão)
   Encontrou uma correspondência na posição i-m+1 = 14-5+1 = 10
   q = prefixTable[q-1] = prefixTable[4] = 0
```

### Por que o KMP é eficiente?

O algoritmo KMP nunca retrocede no texto principal. Quando ocorre um mismatch, ele utiliza a tabela de prefixos para determinar quantos caracteres pode pular, evitando recomparar caracteres já verificados. Isso permite alcançar uma complexidade de O(n+m).

## 🚀 Algoritmo Boyer-Moore

### Conceito Principal

O Boyer-Moore usa duas heurísticas para pular posições:

1. **Bad Character Rule**: Quando ocorre um mismatch, alinha o padrão de modo que o caractere problemático corresponda à sua ocorrência mais à direita no padrão.

2. **Good Suffix Rule**: Quando parte do padrão corresponde, tenta realinhar o padrão de modo que essa correspondência parcial continue válida.

### Vantagens:
- Na prática, é geralmente mais rápido que o KMP
- Pode pular várias posições de uma vez
- Funciona melhor quanto maior for o alfabeto

### Bad Character Rule

```javascript
function precomputeBadCharacterTable(pattern) {
    const badChar = new Map();
    const m = pattern.length;
    
    // -1 indica que o caractere não existe no padrão
    for (let i = 0; i < 256; i++) {
        badChar.set(String.fromCharCode(i), -1);
    }
    
    // Armazena a última ocorrência de cada caractere
    for (let i = 0; i < m - 1; i++) {
        badChar.set(pattern[i], i);
    }
    
    return badChar;
}
```

### Visualização da Bad Character Rule

```
Padrão: "EXAMPLE"

Tabela de Bad Characters:
E -> 4  (última ocorrência de 'E' é na posição 4)
X -> 1  (última ocorrência de 'X' é na posição 1)
A -> 2  (última ocorrência de 'A' é na posição 2)
M -> 3  (última ocorrência de 'M' é na posição 3)
P -> 5  (última ocorrência de 'P' é na posição 5)
L -> 6  (última ocorrência de 'L' é na posição 6)
* -> -1 (para todos os outros caracteres)

Texto:  "HERE IS A SIMPLE EXAMPLE"
Padrão: "EXAMPLE"

Comparação inicia da direita para a esquerda:
Posição 10:
HERE IS A SIMPLE EXAMPLE
          EXAMPLE
               ^ mismatch ('P' vs 'I')
               
Bad character 'I' não está no padrão, então desloca completamente:
HERE IS A SIMPLE EXAMPLE
                EXAMPLE
```

### Good Suffix Rule

```javascript
function precomputeGoodSuffix(pattern) {
    const m = pattern.length;
    const goodSuffix = new Array(m + 1).fill(0);
    const suffixArray = new Array(m + 1).fill(0);
    
    // Cálculo do array de sufixos
    let i = m;
    let j = m + 1;
    suffixArray[i] = j;
    
    while (i > 0) {
        while (j <= m && pattern[i - 1] !== pattern[j - 1]) {
            if (goodSuffix[j] === 0) {
                goodSuffix[j] = j - i;
            }
            j = suffixArray[j];
        }
        i--;
        j--;
        suffixArray[i] = j;
    }
    
    j = suffixArray[0];
    for (i = 0; i <= m; i++) {
        if (goodSuffix[i] === 0) {
            goodSuffix[i] = j;
        }
        if (i === j) {
            j = suffixArray[j];
        }
    }
    
    return goodSuffix;
}
```

### Implementação do Boyer-Moore

```javascript
function boyerMooreSearch(text, pattern) {
    const n = text.length;
    const m = pattern.length;
    const badChar = precomputeBadCharacterTable(pattern);
    const goodSuffix = precomputeGoodSuffix(pattern);
    const positions = [];
    
    let shift = 0;
    
    while (shift <= n - m) {
        let j = m - 1;
        
        // Compara de trás para frente
        while (j >= 0 && pattern[j] === text[shift + j]) {
            j--;
        }
        
        if (j < 0) {
            // Padrão encontrado
            positions.push(shift);
            shift += goodSuffix[0];
        } else {
            // Calcula o salto usando ambas as regras
            const badCharShift = Math.max(1, j - badChar.get(text[shift + j]));
            const goodSuffixShift = goodSuffix[j + 1];
            shift += Math.max(badCharShift, goodSuffixShift);
        }
    }
    
    return positions;
}

// Exemplo de uso
const text = "HERE IS A SIMPLE EXAMPLE";
const pattern = "EXAMPLE";
console.log(boyerMooreSearch(text, pattern)); // [17]
```

### Visualização do Boyer-Moore

```
Texto:  "HERE IS A SIMPLE EXAMPLE"
Padrão: "EXAMPLE"

Posição 0:
HERE IS A SIMPLE EXAMPLE
EXAMPLE
     ^ mismatch ('L' vs ' ')
     
Bad character ' ' não está no padrão, deslocamento = 7
Good suffix não se aplica, deslocamento = 1
Usa o maior: deslocamento = 7

Posição 7:
HERE IS A SIMPLE EXAMPLE
       EXAMPLE
       ^ mismatch ('E' vs 'A')
       
Bad character 'A' está na posição 2, deslocamento = 0 - 2 = -2 (inválido)
Usa deslocamento mínimo = 1

Posição 8:
HERE IS A SIMPLE EXAMPLE
        EXAMPLE
              ^ mismatch ('E' vs ' ')
              
Deslocamento = 7

Posição 15:
HERE IS A SIMPLE EXAMPLE
                 EXAMPLE
                    ^ mismatch ('E' vs 'P')
                    
Deslocamento = 2

Posição 17:
HERE IS A SIMPLE EXAMPLE
                 EXAMPLE
                 ^^^^^^^ match completo
                 
Encontrado na posição 17
```

### Complexidade do Boyer-Moore
- **Tempo**: 
  - Melhor caso: O(n/m) (sub-linear)
  - Caso médio: O(n)
  - Pior caso: O(n·m)
- **Espaço**: O(k), onde k é o tamanho do alfabeto
- **Preparo**: O(m + k) para construir as tabelas

## 🔄 Algoritmo Rabin-Karp: Hashing para Busca

### Conceito Principal

O Rabin-Karp usa hashing para comparar padrões, permitindo verificação em O(1) para cada posição no texto.

### Vantagens:
- Eficiente para busca de múltiplos padrões
- Complexidade média de O(n+m)
- Simples de implementar

### Implementação

```javascript
function rabinKarpSearch(text, pattern) {
    const n = text.length;
    const m = pattern.length;
    const positions = [];
    
    // Parâmetros para hash
    const prime = 101; // Número primo para evitar colisões
    const d = 256;     // Tamanho do alfabeto
    
    // Calcular hash do padrão
    let patternHash = 0;
    let textHash = 0;
    let h = 1;
    
    // Valor do h = d^(m-1) % prime
    for (let i = 0; i < m - 1; i++) {
        h = (h * d) % prime;
    }
    
    // Calcular hash inicial do padrão e do primeiro segmento do texto
    for (let i = 0; i < m; i++) {
        patternHash = (d * patternHash + pattern.charCodeAt(i)) % prime;
        textHash = (d * textHash + text.charCodeAt(i)) % prime;
    }
    
    // Percorrer o texto
    for (let i = 0; i <= n - m; i++) {
        // Se hashes são iguais
        if (patternHash === textHash) {
            // Verificar caractere por caractere para evitar colisões
            let j;
            for (j = 0; j < m; j++) {
                if (text[i + j] !== pattern[j]) {
                    break;
                }
            }
            
            if (j === m) {
                positions.push(i);
            }
        }
        
        // Calcular hash para próxima janela
        if (i < n - m) {
            textHash = (d * (textHash - text.charCodeAt(i) * h) + 
                          text.charCodeAt(i + m)) % prime;
            
            // Garantir que o hash é positivo
            if (textHash < 0) {
                textHash += prime;
            }
        }
    }
    
    return positions;
}

// Exemplo de uso
const text = "ABABABABCA";
const pattern = "ABABC";
console.log(rabinKarpSearch(text, pattern)); // [5]
```

### Rabin-Karp para Múltiplos Padrões

```javascript
function multiPatternRabinKarp(text, patterns) {
    const results = {};
    
    // Inicializa resultados para cada padrão
    for (const pattern of patterns) {
        results[pattern] = [];
    }
    
    // Parâmetros para hash
    const prime = 101;
    const d = 256;
    
    // Pré-calcular hashes de todos os padrões
    const patternHashes = new Map();
    const patternLengths = new Map();
    
    for (const pattern of patterns) {
        let hash = 0;
        for (let i = 0; i < pattern.length; i++) {
            hash = (d * hash + pattern.charCodeAt(i)) % prime;
        }
        patternHashes.set(hash, [...(patternHashes.get(hash) || []), pattern]);
        patternLengths.set(pattern, pattern.length);
    }
    
    // Para cada possível comprimento de padrão
    const uniqueLengths = [...new Set(patterns.map(p => p.length))];
    
    for (const m of uniqueLengths) {
        // Comprimento atual do padrão
        const h = Math.pow(d, m - 1) % prime;
        let textHash = 0;
        
        // Calcular hash inicial da janela do texto
        for (let i = 0; i < m; i++) {
            textHash = (d * textHash + text.charCodeAt(i)) % prime;
        }
        
        // Percorrer o texto para esse comprimento
        for (let i = 0; i <= text.length - m; i++) {
            // Verificar possíveis padrões com este hash
            if (patternHashes.has(textHash)) {
                const possiblePatterns = patternHashes.get(textHash);
                for (const pattern of possiblePatterns) {
                    if (patternLengths.get(pattern) === m) {
                        // Verificar se é uma correspondência real
                        let isMatch = true;
                        for (let j = 0; j < m; j++) {
                            if (text[i + j] !== pattern[j]) {
                                isMatch = false;
                                break;
                            }
                        }
                        
                        if (isMatch) {
                            results[pattern].push(i);
                        }
                    }
                }
            }
            
            // Atualizar hash para próxima janela
            if (i < text.length - m) {
                textHash = (d * (textHash - text.charCodeAt(i) * h) + 
                            text.charCodeAt(i + m)) % prime;
                
                // Garantir que hash seja positivo
                if (textHash < 0) {
                    textHash += prime;
                }
            }
        }
    }
    
    return results;
}
```

## 📊 Comparação de Algoritmos de Busca em Texto

| Algoritmo | Tempo Médio | Tempo Pior Caso | Espaço | Pré-processamento |
|-----------|-------------|-----------------|--------|-------------------|
| Busca Ingênua | O(n·m) | O(n·m) | O(1) | Nenhum |
| KMP | O(n+m) | O(n+m) | O(m) | Tabela de prefixos |
| Boyer-Moore | O(n/m) a O(n) | O(n·m) | O(k+m) | Tabelas BC e GS |
| Rabin-Karp | O(n+m) | O(n·m) | O(1) | Hash do padrão |

### Escolha do Algoritmo

- **Busca Ingênua**: 
  - Para padrões e textos muito pequenos
  - Quando simplicidade é mais importante que performance

- **KMP**: 
  - Garantia de tempo linear
  - Para alfabetos pequenos
  - Quando necessário encontrar todas as ocorrências

- **Boyer-Moore**: 
  - Alfabetos grandes
  - Padrões longos
  - Melhor performance prática na maioria dos casos

- **Rabin-Karp**: 
  - Busca por múltiplos padrões
  - Detecção de plágio
  - Análise de similaridade de texto

## 🌐 Aplicações Práticas

### 1. Motor de Busca Básico

```javascript
class TextSearchEngine {
    constructor(documents) {
        this.documents = documents;
        this.index = this.buildIndex();
    }
    
    buildIndex() {
        const index = new Map();
        
        this.documents.forEach((doc, docId) => {
            // Tokenizar o documento em palavras
            const words = doc.toLowerCase().match(/\w+/g) || [];
            
            // Adicionar cada palavra ao índice invertido
            words.forEach(word => {
                if (!index.has(word)) {
                    index.set(word, new Set());
                }
                index.get(word).add(docId);
            });
        });
        
        return index;
    }
    
    search(query) {
        // Tokenizar a consulta
        const terms = query.toLowerCase().match(/\w+/g) || [];
        
        if (terms.length === 0) {
            return [];
        }
        
        // Encontrar documentos que contêm todos os termos
        let result = new Set(this.index.get(terms[0]) || []);
        
        for (let i = 1; i < terms.length; i++) {
            const term = terms[i];
            const termDocs = this.index.get(term) || new Set();
            
            // Interseção dos conjuntos de documentos
            result = new Set([...result].filter(docId => termDocs.has(docId)));
            
            if (result.size === 0) {
                break;
            }
        }
        
        return [...result];
    }
    
    searchExactPhrase(phrase) {
        const results = [];
        
        // Primeiro, encontrar documentos que contêm todas as palavras
        const candidates = this.search(phrase);
        
        // Verificar a frase exata em cada documento candidato
        for (const docId of candidates) {
            const doc = this.documents[docId];
            if (boyerMooreSearch(doc, phrase).length > 0) {
                results.push(docId);
            }
        }
        
        return results;
    }
}

// Exemplo de uso
const documents = [
    "O algoritmo KMP é eficiente para busca de padrões.",
    "Boyer-Moore é outro algoritmo de busca em texto.",
    "Algoritmos de busca em texto são importantes em muitas aplicações."
];

const engine = new TextSearchEngine(documents);
console.log(engine.search("algoritmo")); // [0, 1, 2]
console.log(engine.search("busca texto")); // [1, 2]
console.log(engine.searchExactPhrase("busca em texto")); // [1, 2]
```

### 2. Análise de DNA

```javascript
function findPatternInDNA(dnaSequence, pattern) {
    // Usar Boyer-Moore para encontrar padrões em sequências de DNA
    const positions = boyerMooreSearch(dnaSequence, pattern);
    
    return {
        count: positions.length,
        positions: positions,
        present: positions.length > 0
    };
}

// Exemplo: Buscar uma sequência específica no DNA
const dna = "ACGTACGTACGTACGTACGTACGTACGTACGTACGT";
const genePattern = "ACGTACGT";
console.log(findPatternInDNA(dna, genePattern));
```

### 3. Detector de Plágio

```javascript
function plagiarismDetector(originalText, suspectText, minMatchLength = 10) {
    const matches = [];
    
    // Para cada posição possível no texto original
    for (let i = 0; i <= originalText.length - minMatchLength; i++) {
        // Extrair substring de tamanho crescente
        for (let length = minMatchLength; 
             i + length <= originalText.length; 
             length++) {
            
            const pattern = originalText.substring(i, i + length);
            const positions = boyerMooreSearch(suspectText, pattern);
            
            if (positions.length > 0) {
                // Continuar expandindo enquanto houver correspondência
                continue;
            } else {
                // Armazenar a maior correspondência encontrada
                if (length > minMatchLength) {
                    matches.push({
                        originalPosition: i,
                        suspectPositions: boyerMooreSearch(suspectText, 
                                             originalText.substring(i, i + length - 1)),
                        text: originalText.substring(i, i + length - 1),
                        length: length - 1
                    });
                }
                break;
            }
        }
    }
    
    // Consolidar e filtrar resultados sobrepostos
    return filterOverlappingMatches(matches);
}

function filterOverlappingMatches(matches) {
    // Ordenar por comprimento (descendente)
    matches.sort((a, b) => b.length - a.length);
    
    const filtered = [];
    const covered = new Set();
    
    for (const match of matches) {
        let include = true;
        
        // Verificar se esta correspondência já está coberta por outra maior
        for (let i = match.originalPosition; 
             i < match.originalPosition + match.length; 
             i++) {
            if (covered.has(i)) {
                include = false;
                break;
            }
        }
        
        if (include) {
            filtered.push(match);
            
            // Marcar posições como cobertas
            for (let i = match.originalPosition; 
                 i < match.originalPosition + match.length; 
                 i++) {
                covered.add(i);
            }
        }
    }
    
    return filtered;
}
```

## 🛠️ Exercícios Práticos

### Exercício 1: Encontre todas ocorrências com contexto

```javascript
function findWithContext(text, pattern, contextSize = 10) {
    const positions = kmpSearch(text, pattern);
    const results = [];
    
    positions.forEach(pos => {
        const startContext = Math.max(0, pos - contextSize);
        const endContext = Math.min(text.length, pos + pattern.length + contextSize);
        
        results.push({
            position: pos,
            context: text.substring(startContext, endContext),
            highlightStart: pos - startContext,
            highlightEnd: pos - startContext + pattern.length
        });
    });
    
    return results;
}
```

### Exercício 2: Implementar Fuzzy Search

```javascript
function fuzzySearch(text, pattern, maxErrors = 1) {
    const n = text.length;
    const m = pattern.length;
    const positions = [];
    
    // Para cada posição possível
    for (let i = 0; i <= n - m; i++) {
        let errors = 0;
        
        // Contar erros/diferenças
        for (let j = 0; j < m; j++) {
            if (text[i + j] !== pattern[j]) {
                errors++;
                if (errors > maxErrors) {
                    break;
                }
            }
        }
        
        if (errors <= maxErrors) {
            positions.push({
                position: i,
                errors: errors
            });
        }
    }
    
    return positions;
}
```

### Exercício 3: Algoritmo Híbrido

```javascript
function smartPatternSearch(text, pattern) {
    // Escolher algoritmo baseado nas características
    const n = text.length;
    const m = pattern.length;
    
    if (m <= 3) {
        // Para padrões muito curtos, busca ingênua é suficiente
        return naiveSearch(text, pattern);
    } else if (m > n / 2) {
        // Para padrões muito longos em relação ao texto
        return kmpSearch(text, pattern);
    } else {
        // Para caso geral, Boyer-Moore geralmente é mais eficiente
        return boyerMooreSearch(text, pattern);
    }
}
```

## 🧠 O que aprendemos
- Algoritmos eficientes de busca em texto são cruciais para muitas aplicações
- O algoritmo KMP utiliza uma tabela de prefixos para evitar retroceder no texto
- Boyer-Moore combina duas heurísticas para pular várias posições de uma vez
- Rabin-Karp usa hashing para verificação eficiente de padrões
- A escolha do algoritmo depende das características do texto, padrão e requisitos
- Estes algoritmos são fundamentais para motores de busca, análise de DNA e detecção de plágio

No próximo capítulo, aplicaremos estes conhecimentos em exercícios práticos integrados, combinando algoritmos de ordenação e busca para resolver problemas complexos do mundo real.