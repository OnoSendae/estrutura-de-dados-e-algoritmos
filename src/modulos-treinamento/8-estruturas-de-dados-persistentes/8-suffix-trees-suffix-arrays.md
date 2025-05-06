# Suffix Trees e Suffix Arrays

## Introdução

Olá, estudante! Hoje vamos explorar duas estruturas de dados avançadas para processamento de strings: **Suffix Trees** e **Suffix Arrays**. Estas estruturas são fundamentais para resolver problemas complexos de busca em textos, análise de padrões, e vários problemas de bioinformática.

Embora possam parecer intimidantes à primeira vista, estas estruturas têm aplicações fascinantes e resolvem problemas que seriam extremamente ineficientes com abordagens mais simples.

## Conceitos Fundamentais

Antes de entrarmos nas estruturas específicas, vamos estabelecer alguns conceitos básicos:

- **String**: Uma sequência de caracteres. Exemplo: "banana"
- **Substring**: Uma sequência contígua de caracteres dentro de uma string. Exemplo: "ana" é uma substring de "banana"
- **Sufixo**: Uma substring que vai do caractere na posição i até o final da string. Exemplo: Sufixos de "banana" são "banana", "anana", "nana", "ana", "na", "a"
- **Prefixo**: Uma substring que começa no início da string e vai até o caractere na posição i. Exemplo: Prefixos de "banana" são "b", "ba", "ban", "bana", "banan", "banana"

## Suffix Trees

### Conceito

Um Suffix Tree para uma string S é uma árvore compactada onde:

1. Cada sufixo de S corresponde a um caminho da raiz até uma folha
2. Cada aresta é rotulada com uma substring não-vazia de S
3. Nenhum nó, exceto possivelmente a raiz, tem apenas um filho
4. As arestas que saem de um mesmo nó têm rótulos que começam com caracteres diferentes

Para garantir que todos os sufixos terminem em folhas, geralmente adicionamos um caractere especial ("$" ou "#") ao final da string original.

### Representação Visual

Vamos construir um Suffix Tree para a string "banana$":

```
             (raiz)
            /  |   \
           /   |    \
          /    |     \
         /     |      \
        /      |       \
       /       |        \
     "a"      "b"       "n"
    / | \      |        / \
   /  |  \     |       /   \
  $  "na$" "na$" "anana$" "ana$"
     /           
   "na$"         
```

Nesta representação simplificada, cada aresta é rotulada com uma substring. Por exemplo, "anana$" representa a aresta rotulada com a string completa "anana$".

### Aplicações

Suffix Trees são extremamente poderosos e permitem resolver vários problemas em tempo linear (O(n)) após a construção da árvore:

1. **Busca de padrão**: Verificar se uma string P é uma substring de S em tempo O(|P|)
2. **Substring comum mais longa** entre duas strings
3. **Quantidade de ocorrências** de um padrão P em S
4. **Substrings repetidas** mais longas
5. **Palíndromos** mais longos

### Algoritmo de Construção: Ukkonen

O algoritmo de Ukkonen é um método eficiente para construir um Suffix Tree em tempo linear (O(n)) para alfabetos de tamanho constante.

A ideia básica do algoritmo é construir o Suffix Tree de forma incremental, adicionando os caracteres da string um por um e atualizando a árvore a cada passo.

Embora a implementação completa do algoritmo de Ukkonen seja complexa, vamos apresentar uma versão simplificada em TypeScript para entender os conceitos principais:

```typescript
class Node {
  // Um mapa de arestas, onde a chave é o primeiro caractere da aresta
  edges: Map<string, { target: Node; start: number; end: number | { value: number } }>;
  suffixLink: Node | null;
  
  constructor() {
    this.edges = new Map();
    this.suffixLink = null;
  }
}

class SuffixTree {
  private root: Node;
  private text: string;
  private activeNode: Node;
  private activeEdge: number;
  private activeLength: number;
  private remainder: number;
  private currentEnd: { value: number };
  
  constructor(text: string) {
    this.text = text + '$'; // Adiciona um marcador de fim
    this.root = new Node();
    this.activeNode = this.root;
    this.activeEdge = -1;
    this.activeLength = 0;
    this.remainder = 0;
    this.currentEnd = { value: -1 };
    
    this.buildSuffixTree();
  }
  
  private buildSuffixTree(): void {
    const n = this.text.length;
    this.currentEnd.value = 0;
    
    // Adicionar caracteres um por um
    for (let i = 0; i < n; i++) {
      this.extendSuffixTree(i);
    }
  }
  
  private extendSuffixTree(pos: number): void {
    // Incrementa o final atual para todas as arestas existentes
    this.currentEnd.value = pos;
    
    // Incrementa o número de sufixos que precisamos inserir
    this.remainder++;
    
    let lastNewNode: Node | null = null;
    
    while (this.remainder > 0) {
      // Se activeLength é 0, começamos com o próximo caractere
      if (this.activeLength === 0) {
        this.activeEdge = pos;
      }
      
      const startChar = this.text[this.activeEdge];
      
      if (!this.activeNode.edges.has(startChar)) {
        // Nenhuma aresta a partir do ativo, cria uma nova aresta
        const leaf = new Node();
        this.activeNode.edges.set(startChar, {
          target: leaf,
          start: pos,
          end: this.currentEnd
        });
        
        // Estabelecer link de sufixo se necessário
        if (lastNewNode) {
          lastNewNode.suffixLink = this.activeNode;
          lastNewNode = null;
        }
      } else {
        // Existe uma aresta, vamos segui-la
        const nextEdge = this.activeNode.edges.get(startChar)!;
        
        // Calcular o comprimento da aresta
        const edgeLength = this.edgeLength(nextEdge);
        
        // Se podemos percorrer mais na aresta
        if (this.activeLength >= edgeLength) {
          this.activeEdge += edgeLength;
          this.activeLength -= edgeLength;
          this.activeNode = nextEdge.target;
          continue; // Continuar com o novo activeNode
        }
        
        // Se o próximo caractere já está na árvore
        if (this.text[nextEdge.start + this.activeLength] === this.text[pos]) {
          // Já está lá, apenas incrementa activeLength
          this.activeLength++;
          
          // Estabelecer link de sufixo se necessário
          if (lastNewNode) {
            lastNewNode.suffixLink = this.activeNode;
            lastNewNode = null;
          }
          
          break; // Acabamos por agora
        }
        
        // Precisamos dividir a aresta
        const split = new Node();
        const leaf = new Node();
        
        // Atualizar a aresta antiga para apontar para o novo nó split
        const oldEdge = {
          target: split,
          start: nextEdge.start,
          end: { value: nextEdge.start + this.activeLength - 1 }
        };
        this.activeNode.edges.set(startChar, oldEdge);
        
        // Criar uma nova aresta do split para a folha
        split.edges.set(this.text[pos], {
          target: leaf,
          start: pos,
          end: this.currentEnd
        });
        
        // Também criar uma aresta do split para o nó alvo original
        split.edges.set(this.text[nextEdge.start + this.activeLength], {
          target: nextEdge.target,
          start: nextEdge.start + this.activeLength,
          end: nextEdge.end
        });
        
        if (lastNewNode) {
          lastNewNode.suffixLink = split;
        }
        lastNewNode = split;
      }
      
      this.remainder--;
      
      // Se estamos na raiz, apenas reduzimos activeLength e incrementamos activeEdge
      if (this.activeNode === this.root && this.activeLength > 0) {
        this.activeLength--;
        this.activeEdge = pos - this.remainder + 1;
      } else if (this.activeNode !== this.root) {
        // Seguimos o link de sufixo se possível
        this.activeNode = this.activeNode.suffixLink || this.root;
      }
    }
  }
  
  private edgeLength(edge: { start: number; end: number | { value: number } }): number {
    const end = typeof edge.end === 'number' ? edge.end : edge.end.value;
    return end - edge.start + 1;
  }
  
  // Método para verificar se uma string é uma substring do texto
  search(pattern: string): boolean {
    if (!pattern || pattern.length === 0) return true;
    
    let currentNode = this.root;
    let i = 0;
    
    while (i < pattern.length) {
      const firstChar = pattern[i];
      if (!currentNode.edges.has(firstChar)) {
        return false; // Não há aresta começando com este caractere
      }
      
      const edge = currentNode.edges.get(firstChar)!;
      const edgeString = this.text.substring(edge.start, 
        typeof edge.end === 'number' ? edge.end + 1 : edge.end.value + 1);
      
      let j = 0;
      while (i < pattern.length && j < edgeString.length) {
        if (pattern[i] !== edgeString[j]) {
          return false; // Diferença encontrada
        }
        i++;
        j++;
      }
      
      if (j === edgeString.length) {
        currentNode = edge.target;
      } else {
        // Parou no meio da aresta, mas percorreu todo o padrão
        return i === pattern.length;
      }
    }
    
    return true; // Chegou ao final do padrão
  }
}

// Exemplo de uso
const text = "banana";
const suffixTree = new SuffixTree(text);

console.log(`"na" é substring? ${suffixTree.search("na")}`);  // true
console.log(`"nan" é substring? ${suffixTree.search("nan")}`); // true
console.log(`"nanan" é substring? ${suffixTree.search("nanan")}`); // false
```

Este código é uma simplificação, e um algoritmo de Ukkonen completo incluiria mais otimizações.

### Limitações

Apesar de seu poder, Suffix Trees têm algumas limitações:

1. **Consumo de memória**: Podem consumir de 10 a 20 vezes mais espaço do que o tamanho da string original
2. **Complexidade de implementação**: O algoritmo de Ukkonen é complexo e suscetível a bugs
3. **Desempenho prático**: As constantes escondidas no O(n) podem ser altas

## Suffix Arrays

### Conceito

Um Suffix Array é uma alternativa mais econômica em termos de memória para Suffix Trees. Em vez de armazenar uma árvore complexa, armazenamos apenas um array de inteiros que representa a ordenação lexicográfica de todos os sufixos da string.

Formalmente, para uma string S de comprimento n, o Suffix Array SA é um array de inteiros onde:
- SA[i] = j significa que o j-ésimo sufixo de S é o i-ésimo em ordem lexicográfica
- Os valores em SA são índices de início dos sufixos em S

### Exemplo Visual

Para a string "banana$":
- Sufixos em ordem lexicográfica:
  1. "$" (começa no índice 6)
  2. "a$" (começa no índice 5)
  3. "ana$" (começa no índice 3)
  4. "anana$" (começa no índice 1)
  5. "banana$" (começa no índice 0)
  6. "na$" (começa no índice 4)
  7. "nana$" (começa no índice 2)

Portanto, o Suffix Array é: [6, 5, 3, 1, 0, 4, 2]

### Array de LCP (Longest Common Prefix)

Um complemento útil para o Suffix Array é o array LCP (Longest Common Prefix), que armazena o comprimento do prefixo comum mais longo entre sufixos adjacentes na ordenação.

Para o nosso exemplo:
- LCP[0] = 0 (nada em comum entre "$" e "a$")
- LCP[1] = 0 (nada em comum entre "a$" e "ana$")
- LCP[2] = 1 (prefixo comum "a" entre "ana$" e "anana$")
- LCP[3] = 0 (nada em comum entre "anana$" e "banana$")
- LCP[4] = 0 (nada em comum entre "banana$" e "na$")
- LCP[5] = 2 (prefixo comum "na" entre "na$" e "nana$")

Portanto, o array LCP é: [0, 0, 1, 0, 0, 2]

### Implementação

Existem vários algoritmos para construir Suffix Arrays, desde os ingênuos O(n² log n) até os eficientes O(n). Vamos implementar uma versão simples usando o algoritmo de ordenação de sufixos:

```typescript
function createSuffixArray(text: string): number[] {
  const n = text.length;
  
  // Estrutura para representar um sufixo
  type Suffix = { index: number, suffix: string };
  
  // Criar array de todos os sufixos
  const suffixes: Suffix[] = [];
  for (let i = 0; i < n; i++) {
    suffixes.push({ index: i, suffix: text.substring(i) });
  }
  
  // Ordenar os sufixos lexicograficamente
  suffixes.sort((a, b) => a.suffix.localeCompare(b.suffix));
  
  // Extrair apenas os índices para formar o suffix array
  return suffixes.map(s => s.index);
}

// Exemplo de uso
const text = "banana$";
const suffixArray = createSuffixArray(text);
console.log("Suffix Array:", suffixArray);  // [6, 5, 3, 1, 0, 4, 2]
```

Esta implementação é simples, mas não eficiente para strings muito grandes. Para strings maiores, algoritmos como SA-IS (Suffix Array - Induced Sorting) são recomendados.

### Calculando o Array LCP

O array LCP pode ser calculado em tempo linear após a construção do Suffix Array:

```typescript
function createLCPArray(text: string, suffixArray: number[]): number[] {
  const n = text.length;
  
  // Array inverso do suffix array
  const rank: number[] = Array(n);
  for (let i = 0; i < n; i++) {
    rank[suffixArray[i]] = i;
  }
  
  const lcp: number[] = Array(n - 1).fill(0);
  let h = 0; // Comprimento do prefixo comum atual
  
  for (let i = 0; i < n; i++) {
    if (rank[i] > 0) {
      let j = suffixArray[rank[i] - 1]; // Sufixo anterior na ordenação
      
      // Calcular o LCP
      while (i + h < n && j + h < n && text[i + h] === text[j + h]) {
        h++;
      }
      
      lcp[rank[i] - 1] = h; // LCP entre sufixo atual e anterior
      
      // Se h > 0, podemos decrementar para o próximo cálculo
      if (h > 0) h--;
    }
  }
  
  return lcp;
}

// Exemplo de uso
const text = "banana$";
const suffixArray = createSuffixArray(text);
const lcpArray = createLCPArray(text, suffixArray);
console.log("LCP Array:", lcpArray);  // [0, 0, 1, 0, 0, 2]
```

### Aplicações dos Suffix Arrays

1. **Busca de padrão**: Com busca binária, podemos encontrar todas as ocorrências de um padrão em O(m log n), onde m é o comprimento do padrão e n é o comprimento do texto.

2. **Substring comum mais longa**: Usando o array LCP, podemos encontrar a substring comum mais longa entre duas strings em tempo linear.

3. **Quantidade de substrings distintas**: Pode ser calculada em O(n) usando o array LCP.

4. **Substring repetida mais longa**: Pode ser encontrada usando o valor máximo no array LCP.

### Implementação de Busca de Padrão com Suffix Array

```typescript
function searchPattern(text: string, pattern: string, suffixArray: number[]): number[] {
  const n = text.length;
  const m = pattern.length;
  const occurrences: number[] = [];
  
  // Busca binária pelo limite inferior
  let left = 0;
  let right = n - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const suffix = text.substring(suffixArray[mid]);
    const prefixOfSuffix = suffix.substring(0, Math.min(m, suffix.length));
    const result = pattern.localeCompare(prefixOfSuffix);
    
    if (result === 0) {
      // Encontrou uma correspondência, agora procurar todas as ocorrências
      // Verificar à esquerda
      let i = mid;
      while (i >= 0) {
        const currentSuffix = text.substring(suffixArray[i]);
        const prefix = currentSuffix.substring(0, Math.min(m, currentSuffix.length));
        
        if (pattern === prefix) {
          occurrences.push(suffixArray[i]);
          i--;
        } else {
          break;
        }
      }
      
      // Verificar à direita
      i = mid + 1;
      while (i < n) {
        const currentSuffix = text.substring(suffixArray[i]);
        const prefix = currentSuffix.substring(0, Math.min(m, currentSuffix.length));
        
        if (pattern === prefix) {
          occurrences.push(suffixArray[i]);
          i++;
        } else {
          break;
        }
      }
      
      break;
    } else if (result < 0) {
      // pattern vem antes do sufixo atual
      right = mid - 1;
    } else {
      // pattern vem depois do sufixo atual
      left = mid + 1;
    }
  }
  
  return occurrences.sort((a, b) => a - b); // Ordenar por posição
}

// Exemplo de uso
const text = "banana$";
const pattern = "na";
const suffixArray = createSuffixArray(text);
const occurrences = searchPattern(text, pattern, suffixArray);
console.log(`Ocorrências de "${pattern}": ${occurrences}`);  // [2, 4]
```

## Comparação entre Suffix Trees e Suffix Arrays

| Característica       | Suffix Tree                     | Suffix Array                 |
|----------------------|--------------------------------|------------------------------|
| Espaço               | O(n) mas com constantes grandes | O(n) com constantes pequenas |
| Tempo de construção  | O(n)                           | O(n) para alfabeto pequeno  |
| Busca de padrão      | O(m) onde m é o tamanho do padrão | O(m log n + k) onde k é o número de ocorrências |
| Implementação        | Complexa                       | Relativamente simples        |
| Estrutura auxiliar   | Não requer                     | Muitas vezes usa LCP Array   |
| Aplicações avançadas | Mais diretas                   | Exigem algoritmos adicionais |

## Algoritmos Eficientes de Construção

### SA-IS (Suffix Array - Induced Sorting)

O algoritmo SA-IS é um dos métodos mais eficientes para construir Suffix Arrays em tempo linear (O(n)). Ele utiliza uma abordagem de ordenação induzida para classificar os sufixos.

A ideia principal é dividir os sufixos em dois tipos (S e L) com base em comparações lexicográficas e usar essas informações para induzir a ordenação.

### Algoritmo de Farach

O algoritmo de Farach é outro método de construção linear que usa técnica de divisão e conquista. Ele divide a string em posições pares e ímpares, resolve recursivamente e depois mescla os resultados.

## Aplicações Práticas

### 1. Bioinformática

Suffix Trees e Arrays são fundamentais na bioinformática para:
- Alinhamento de sequências de DNA
- Encontrar padrões de repetição em genomas
- Montagem de fragmentos de sequenciamento

### 2. Compressão de Dados

- Algoritmos como LZ77 usam estruturas similares para compressão
- Identificação de repetições para compressão eficiente

### 3. Processamento de Linguagem Natural

- Extração de n-gramas
- Análise de concordância
- Construção de índices de pesquisa de texto completo

### 4. Busca em Textos

- Motores de busca de texto completo
- Pesquisa aproximada e tolerante a erros
- Índices de palavras-chave em contexto

## Implementações Avançadas

### Compressed Suffix Array

Para economizar ainda mais espaço, podemos usar versões comprimidas de Suffix Arrays que usam menos do que os O(n log n) bits de espaço da implementação padrão.

```typescript
class CompressedSuffixArray {
  private text: string;
  private sampledPositions: Map<number, number>;
  private samplingRate: number;
  
  constructor(text: string, samplingRate: number = 4) {
    this.text = text;
    this.samplingRate = samplingRate;
    this.sampledPositions = new Map();
    
    const suffixArray = createSuffixArray(text);
    
    // Amostrar apenas algumas posições do suffix array
    for (let i = 0; i < suffixArray.length; i++) {
      if (suffixArray[i] % samplingRate === 0) {
        this.sampledPositions.set(i, suffixArray[i]);
      }
    }
  }
  
  // Reconstruir posição não-amostrada
  getPosition(index: number): number {
    // Se a posição está amostrada, retornar diretamente
    if (this.sampledPositions.has(index)) {
      return this.sampledPositions.get(index)!;
    }
    
    // Caso contrário, avançamos até encontrar uma posição amostrada
    let steps = 0;
    let currentIndex = index;
    
    while (!this.sampledPositions.has(currentIndex)) {
      currentIndex = (currentIndex + 1) % this.text.length;
      steps++;
      
      if (steps > this.text.length) {
        throw new Error("Loop infinito detectado");
      }
    }
    
    // Calcular a posição original
    const sampledPosition = this.sampledPositions.get(currentIndex)!;
    return (sampledPosition - steps + this.text.length) % this.text.length;
  }
}
```

Esta é uma simplificação conceitual; implementações reais usam técnicas mais sofisticadas.

### FM-Index (Full-text index in Minute space)

O FM-Index combina a transformada de Burrows-Wheeler (BWT) com outras estruturas para permitir busca eficiente em texto comprimido, usando ainda menos espaço do que Suffix Arrays comprimidos.

## Exercícios

1. Implemente um algoritmo para encontrar a substring repetida mais longa em um texto usando Suffix Arrays e o array LCP.

2. Desenvolva uma função que encontre todas as ocorrências de um padrão em um texto usando Suffix Array sem usar `substring()` para extrações, apenas índices (para maior eficiência).

3. Modifique o algoritmo de construção de Suffix Array para trabalhar com grandes textos, usando ordenação por partes em vez de carregar todos os sufixos na memória ao mesmo tempo.

4. Implemente um algoritmo para encontrar a substring comum mais longa entre duas strings usando Suffix Arrays.

5. Desenvolva uma versão do Suffix Tree que permita inserções e deleções de caracteres na string original, mantendo a árvore atualizada eficientemente.

## Conclusão

Suffix Trees e Suffix Arrays são estruturas de dados poderosas para processamento de strings, cada uma com suas vantagens e desvantagens. Suffix Trees oferecem operações mais rápidas à custa de maior uso de memória, enquanto Suffix Arrays são mais econômicos em termos de espaço, mas um pouco mais lentos para certas operações.

A escolha entre eles depende das restrições específicas da aplicação e do problema a ser resolvido. Com algoritmos modernos de construção, ambos podem ser construídos em tempo linear, tornando-os ferramentas viáveis mesmo para grandes volumes de dados.

Na próxima aula, exploraremos mais aplicações práticas dessas estruturas em problemas do mundo real, especialmente em bioinformática e processamento de linguagem natural.

## Leituras Complementares

- "Algorithms on Strings, Trees, and Sequences" por Dan Gusfield
- "Suffix Arrays: A New Method for On-Line String Searches" por U. Manber e G. Myers
- "Linear Work Suffix Array Construction" por Kärkkäinen e Sanders
- "Data Compression Explained" por Matt Mahoney
- "Introduction to Algorithms" por Cormen, Leiserson, Rivest e Stein (CLRS) 