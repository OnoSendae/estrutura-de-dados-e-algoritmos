# Árvores 2-3 (2-3 Trees)

## Introdução

Olá, estudante! Hoje vamos explorar as **Árvores 2-3**, uma estrutura de dados fascinante que forma a base para estruturas mais complexas como as Árvores B e as Árvores Vermelho-Preto (Red-Black Trees). As árvores 2-3 são um tipo de árvore de busca balanceada que resolve elegantemente muitos dos problemas encontrados em estruturas mais simples, como as árvores binárias de busca.

## Conceito Fundamental

Uma Árvore 2-3 é uma árvore de busca balanceada em que cada nó interno (não-folha) pode ter dois ou três filhos (daí o nome "2-3"). Esta flexibilidade permite que a árvore mantenha seu equilíbrio mesmo com inserções e remoções frequentes.

### Características Principais

1. **Todos os nós são de dois tipos**:
   - **Nós 2**: têm 1 chave e 2 filhos
   - **Nós 3**: têm 2 chaves e 3 filhos

2. **Balanceamento perfeito**:
   - Todas as folhas estão na mesma profundidade
   - A altura é logarítmica em relação ao número de elementos: O(log n)

3. **Ordenação**:
   - Em um nó 2 com chave K, todos os valores no subárvore esquerda são < K e todos no subárvore direita são > K
   - Em um nó 3 com chaves K1 e K2 (K1 < K2):
     - Todos os valores na subárvore esquerda são < K1
     - Todos os valores na subárvore do meio estão entre K1 e K2
     - Todos os valores na subárvore direita são > K2

## Representação Visual

Uma Árvore 2-3 típica pode ser visualizada assim:

```
          [10, 20]
         /   |    \
        /    |     \
    [5]     [15]    [30]
   /  \     /  \    /  \
 [1,3] [7] [12] [17] [25] [40]
```

Neste exemplo:
- O nó raiz é um nó 3 contendo as chaves 10 e 20
- Os nós internos [5], [15] e [30] são nós 2
- Os nós folha incluem um nó 3 [1,3] e nós 2 [7], [12], [17], [25], [40]

## Analogia

Imagine uma biblioteca com salas de leitura organizadas de forma hierárquica:

- Cada sala (nó) pode ter 1 ou 2 placas de sinalização (chaves)
- Com 1 placa, a sala direciona visitantes para 2 salas menores (filhos)
- Com 2 placas, a sala direciona visitantes para 3 salas menores (filhos)
- As placas sempre dividem os livros em grupos ordenados (por título, por exemplo)
- Todas as salas de leitura final (folhas) estão no mesmo nível do prédio

Quando um novo livro chega, pode ser necessário reorganizar as placas ou adicionar uma nova placa em alguma sala para manter a organização.

## Operações Básicas

### 1. Busca

A operação de busca em uma Árvore 2-3 é bastante direta e similar à busca em uma árvore binária, mas com a possibilidade de ter 3 caminhos:

1. Começa na raiz
2. Em cada nó, compara a chave de busca com as chaves no nó
3. Decide qual caminho seguir com base nas comparações
4. Repete até encontrar a chave ou chegar a uma folha

```typescript
interface Node23<T> {
  keys: T[];  // 1 ou 2 chaves
  children: Node23<T>[] | null;  // null para folhas
  isLeaf(): boolean;
}

function search<T>(root: Node23<T>, key: T): boolean {
  let current = root;
  
  while (true) {
    // Verificar se a chave está no nó atual
    for (const nodeKey of current.keys) {
      if (nodeKey === key) {
        return true; // Chave encontrada
      }
    }
    
    // Se é uma folha e não encontramos a chave, ela não existe na árvore
    if (current.isLeaf()) {
      return false;
    }
    
    // Decidir qual filho visitar
    if (key < current.keys[0]) {
      // Ir para o filho da esquerda
      current = current.children![0];
    } else if (current.keys.length === 1 || key < current.keys[1]) {
      // Ir para o filho do meio (em um nó 3) ou direita (em um nó 2)
      current = current.children![1];
    } else {
      // Ir para o filho da direita (em um nó 3)
      current = current.children![2];
    }
  }
}
```

A complexidade da busca é O(log n), pois a altura da árvore é sempre logarítmica em relação ao número de elementos.

### 2. Inserção

A inserção em uma Árvore 2-3 é mais complexa do que em uma árvore binária comum, pois precisamos manter a propriedade de balanceamento. O processo geral é:

1. Localizar a folha onde a inserção deve ocorrer (como na busca)
2. Adicionar a chave à folha
3. Se a folha ficar com 3 chaves (temporariamente), dividir a folha e propagar a chave do meio para cima

#### Propagação da Divisão

A parte mais importante da inserção é como lidamos com a divisão dos nós quando eles ficam com 3 chaves (o que não é permitido na estrutura final):

1. Um nó temporário com 3 chaves [a,b,c] é dividido em dois nós: [a] e [c]
2. A chave do meio (b) é "empurrada" para o pai
3. Se o pai agora tem 3 chaves, repete-se o processo subindo na árvore
4. Se a divisão chegar à raiz, uma nova raiz é criada e a árvore cresce em altura

Este processo garante que a árvore sempre mantenha seu balanceamento perfeito.

```typescript
class Node23<T> {
  keys: T[];
  children: Node23<T>[] | null;
  
  constructor(keys: T[] = [], children: Node23<T>[] | null = null) {
    this.keys = keys;
    this.children = children;
  }
  
  isLeaf(): boolean {
    return this.children === null;
  }
  
  isNode2(): boolean {
    return this.keys.length === 1;
  }
  
  isNode3(): boolean {
    return this.keys.length === 2;
  }
}

class Tree23<T> {
  root: Node23<T>;
  
  constructor() {
    this.root = new Node23<T>();
  }
  
  insert(key: T): void {
    // Caso especial: árvore vazia
    if (this.root.keys.length === 0) {
      this.root.keys.push(key);
      return;
    }
    
    // Tenta inserir e verifica se houve divisão na raiz
    const result = this._insertHelper(this.root, key);
    if (result) {
      // Se houve divisão na raiz, cria uma nova raiz
      const [middleKey, rightNode] = result;
      const leftNode = this.root;
      this.root = new Node23<T>(
        [middleKey], 
        [leftNode, rightNode]
      );
    }
  }
  
  private _insertHelper(node: Node23<T>, key: T): [T, Node23<T>] | null {
    // Se é folha, insere diretamente
    if (node.isLeaf()) {
      return this._insertIntoLeaf(node, key);
    }
    
    // Decide em qual filho inserir
    let childIndex: number;
    if (key < node.keys[0]) {
      childIndex = 0; // Filho da esquerda
    } else if (node.isNode2() || key < node.keys[1]) {
      childIndex = 1; // Filho do meio (nó 3) ou direita (nó 2)
    } else {
      childIndex = 2; // Filho da direita (nó 3)
    }
    
    // Insere recursivamente no filho apropriado
    const result = this._insertHelper(node.children![childIndex], key);
    
    // Se não houve divisão, retorna
    if (!result) {
      return null;
    }
    
    // Houve divisão, precisa inserir chave no nó atual
    const [middleKey, rightChild] = result;
    return this._insertIntoInternalNode(node, middleKey, childIndex, rightChild);
  }
  
  private _insertIntoLeaf(leaf: Node23<T>, key: T): [T, Node23<T>] | null {
    // Encontra a posição correta e insere a chave
    let pos = 0;
    while (pos < leaf.keys.length && key > leaf.keys[pos]) {
      pos++;
    }
    
    // Se a chave já existe, não faz nada
    if (pos < leaf.keys.length && key === leaf.keys[pos]) {
      return null;
    }
    
    // Insere a chave na posição correta
    leaf.keys.splice(pos, 0, key);
    
    // Se o nó agora tem 3 chaves, precisa dividir
    if (leaf.keys.length === 3) {
      return this._splitNode(leaf);
    }
    
    return null; // Não houve divisão
  }
  
  private _insertIntoInternalNode(
    node: Node23<T>, 
    key: T, 
    childIndex: number, 
    rightChild: Node23<T>
  ): [T, Node23<T>] | null {
    // Encontra a posição correta para a chave
    let pos = 0;
    while (pos < node.keys.length && key > node.keys[pos]) {
      pos++;
    }
    
    // Insere a chave e ajusta os filhos
    node.keys.splice(pos, 0, key);
    node.children!.splice(pos + 1, 0, rightChild);
    
    // Se o nó agora tem 3 chaves, precisa dividir
    if (node.keys.length === 3) {
      return this._splitNode(node);
    }
    
    return null; // Não houve divisão
  }
  
  private _splitNode(node: Node23<T>): [T, Node23<T>] {
    // Pega a chave do meio (que será promovida)
    const middleKey = node.keys[1];
    
    // Cria um novo nó com a chave direita
    const rightNode = new Node23<T>([node.keys[2]]);
    
    // Se não é folha, ajusta os filhos
    if (!node.isLeaf()) {
      rightNode.children = [node.children![2], node.children![3]];
    }
    
    // Ajusta o nó original (se torna o nó esquerdo)
    node.keys = [node.keys[0]];
    if (!node.isLeaf()) {
      node.children = node.children!.slice(0, 2);
    }
    
    // Retorna a chave do meio e o nó direito
    return [middleKey, rightNode];
  }
  
  // Método para busca
  search(key: T): boolean {
    let current = this.root;
    
    while (true) {
      // Verifica se a chave está no nó atual
      for (const nodeKey of current.keys) {
        if (key === nodeKey) {
          return true;
        }
      }
      
      // Se é folha e não encontrou, a chave não existe
      if (current.isLeaf()) {
        return false;
      }
      
      // Decide qual filho visitar
      if (key < current.keys[0]) {
        current = current.children![0];
      } else if (current.keys.length === 1 || key < current.keys[1]) {
        current = current.children![1];
      } else {
        current = current.children![2];
      }
    }
  }
}

// Exemplo de uso
const tree = new Tree23<number>();
[10, 5, 15, 3, 7, 12, 18, 1, 4, 6, 8, 11, 14, 17, 20].forEach(key => {
  tree.insert(key);
  console.log(`Inserido ${key}`);
});

console.log(tree.search(14)); // true
console.log(tree.search(13)); // false
```

### 3. Remoção

A remoção em uma Árvore 2-3 é a operação mais complexa e segue estes passos gerais:

1. Localizar o nó que contém a chave a ser removida
2. Se for uma folha, remover diretamente
3. Se for um nó interno, substituir pela menor chave da subárvore direita ou maior da subárvore esquerda
4. Se a remoção violar a propriedade de nós 2-3 (por criar um nó sem chaves), reequilibrar:
   - Pegar emprestado uma chave de um irmão, ou
   - Fundir com um irmão e puxar uma chave do pai

Esta operação é mais complexa e normalmente implementada em estruturas mais avançadas como B-Trees.

## Exemplo Passo a Passo de Inserção

Vamos ver como ficaria a inserção dos números [5, 10, 3, 15, 7, 12, 1, 9] em uma Árvore 2-3 inicialmente vazia:

1. Inserir 5:
   ```
   [5]
   ```

2. Inserir 10:
   ```
   [5, 10]
   ```

3. Inserir 3:
   ```
     [5]
    /   \
   [3]  [10]
   ```

4. Inserir 15:
   ```
     [5, 10]
    /   |   \
   [3]  [7]  [15]
   ```

5. Inserir 7:
   ```
       [7]
      /   \
     /     \
   [3,5]   [10,15]
   ```

6. Inserir 12:
   ```
       [7, 10]
      /   |   \
     /    |    \
   [3,5]  [9]  [12,15]
   ```

7. Inserir 1:
   ```
          [7]
         /   \
        /     \
      [3]     [10]
     /   \    /  \
   [1]   [5] [9] [12,15]
   ```

8. Inserir 9:
   ```
          [7]
         /   \
        /     \
      [3]     [10]
     /   \    /  \
   [1]   [5] [9] [12,15]
   ```

## Comparação com Outras Estruturas

| Característica | Árvore 2-3 | Árvore Binária | Árvore AVL | Árvore B | 
|----------------|------------|---------------|-----------|----------|
| Fator de ramificação | 2-3 | 2 | 2 | Múltiplo |
| Balanceamento | Perfeito | Potencialmente desbalanceado | Balanceada (altura) | Balanceada |
| Altura máxima | log_2(n) | n | log_2(n) | log_m(n) |
| Complexidade de busca | O(log n) | O(n) no pior caso | O(log n) | O(log n) |
| Complexidade de inserção | O(log n) | O(n) no pior caso | O(log n) | O(log n) |
| Uso de memória | Médio | Baixo | Médio | Alto |
| Implementação | Complexa | Simples | Moderada | Complexa |

## Implementação Completa em TypeScript

Vamos implementar uma Árvore 2-3 com visualização para entender melhor o funcionamento:

```typescript
class Node23<T> {
  keys: T[];
  children: Node23<T>[] | null;
  
  constructor(keys: T[] = [], children: Node23<T>[] | null = null) {
    this.keys = keys;
    this.children = children;
  }
  
  isLeaf(): boolean {
    return this.children === null;
  }
  
  isNode2(): boolean {
    return this.keys.length === 1;
  }
  
  isNode3(): boolean {
    return this.keys.length === 2;
  }
  
  // Para visualização
  toString(): string {
    return `[${this.keys.join(',')}]`;
  }
}

class Tree23<T> {
  root: Node23<T>;
  
  constructor() {
    this.root = new Node23<T>();
  }
  
  // Métodos de inserção e busca conforme implementação anterior...
  
  // Método para visualizar a árvore
  print(): void {
    if (this.root.keys.length === 0) {
      console.log("Árvore vazia");
      return;
    }
    
    const levels: string[][] = [];
    
    // BFS para construir níveis
    const queue: [Node23<T>, number][] = [[this.root, 0]];
    while (queue.length > 0) {
      const [node, level] = queue.shift()!;
      
      if (!levels[level]) {
        levels[level] = [];
      }
      
      levels[level].push(node.toString());
      
      if (!node.isLeaf()) {
        for (const child of node.children!) {
          queue.push([child, level + 1]);
        }
      }
    }
    
    // Imprimir níveis
    for (let i = 0; i < levels.length; i++) {
      const spacing = " ".repeat(Math.pow(2, levels.length - i) - 1);
      console.log(`${spacing}${levels[i].join(spacing)}`);
    }
  }
  
  // Método para percorrer em ordem
  inOrder(): T[] {
    const result: T[] = [];
    this._inOrderHelper(this.root, result);
    return result;
  }
  
  private _inOrderHelper(node: Node23<T>, result: T[]): void {
    if (node.isLeaf()) {
      result.push(...node.keys);
      return;
    }
    
    // Percorre o filho esquerdo
    this._inOrderHelper(node.children![0], result);
    
    // Adiciona a primeira chave
    result.push(node.keys[0]);
    
    // Percorre o filho do meio
    this._inOrderHelper(node.children![1], result);
    
    // Se for um nó 3, adiciona a segunda chave e percorre o filho direito
    if (node.isNode3()) {
      result.push(node.keys[1]);
      this._inOrderHelper(node.children![2], result);
    }
  }
  
  // Método para calcular a altura
  height(): number {
    return this._heightHelper(this.root);
  }
  
  private _heightHelper(node: Node23<T>): number {
    if (node.isLeaf()) {
      return 0;
    }
    
    return 1 + this._heightHelper(node.children![0]);
  }
}

// Exemplo de uso com visualização
const tree = new Tree23<number>();
const values = [5, 10, 3, 15, 7, 12, 1, 9, 18, 20, 13, 6, 2, 4, 8, 17, 11];

for (const value of values) {
  tree.insert(value);
  console.log(`Após inserir ${value}:`);
  tree.print();
  console.log("\n");
}

console.log("Percurso em ordem:", tree.inOrder().join(", "));
console.log("Altura da árvore:", tree.height());
```

## Aplicações Práticas

As Árvores 2-3 são mais frequentemente usadas como base teórica para estruturas mais complexas, mas têm aplicações diretas em:

1. **Bancos de Dados**: Implementação de índices
2. **Sistemas de Arquivos**: Organização de diretórios e arquivos
3. **Dicionários e Conjuntos**: Implementações eficientes
4. **Algoritmos de Compressão**: Codificação de Huffman otimizada

### Exemplo: Índice de Livros

Vamos implementar um simples sistema de índice de livros usando uma Árvore 2-3:

```typescript
interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
}

class BookIndex {
  private tree: Tree23<{ id: number, book: Book }>;
  
  constructor() {
    this.tree = new Tree23<{ id: number, book: Book }>();
  }
  
  addBook(book: Book): void {
    this.tree.insert({ id: book.id, book });
  }
  
  findBook(id: number): Book | null {
    // Implementação simplificada que percorre a árvore
    // Em uma implementação real, usaríamos uma busca mais eficiente
    const allBooks = this.getAllBooks();
    for (const book of allBooks) {
      if (book.id === id) {
        return book;
      }
    }
    return null;
  }
  
  getAllBooks(): Book[] {
    const inOrder = this.tree.inOrder();
    return inOrder.map(item => item.book);
  }
  
  getBooksInOrder(): Book[] {
    return this.getAllBooks().sort((a, b) => a.id - b.id);
  }
}

// Exemplo de uso
const bookIndex = new BookIndex();

const books: Book[] = [
  { id: 101, title: "O Senhor dos Anéis", author: "J.R.R. Tolkien", year: 1954 },
  { id: 205, title: "1984", author: "George Orwell", year: 1949 },
  { id: 310, title: "Dom Quixote", author: "Miguel de Cervantes", year: 1605 },
  { id: 42, title: "O Guia do Mochileiro das Galáxias", author: "Douglas Adams", year: 1979 },
  { id: 512, title: "O Pequeno Príncipe", author: "Antoine de Saint-Exupéry", year: 1943 }
];

for (const book of books) {
  bookIndex.addBook(book);
}

console.log("Livro #205:", bookIndex.findBook(205));
console.log("Todos os livros em ordem:", bookIndex.getBooksInOrder());
```

## Relação com B-Trees e Árvores Vermelho-Preto

As Árvores 2-3 são o fundamento de duas estruturas importantes:

1. **B-Trees**: Uma generalização das Árvores 2-3 onde os nós podem ter mais filhos (útil para armazenamento em disco)
2. **Árvores Vermelho-Preto**: Uma representação binária eficiente das Árvores 2-3 (cada nó 3 é representado por um pequeno subárvore vermelho-preto)

### Transformação de Árvore 2-3 para Árvore Vermelho-Preto

```
Árvore 2-3:
    [10, 20]
   /    |    \
 [5]   [15]  [30]

Árvore Vermelho-Preto equivalente:
     10
    /  \
   5    20
       /  \
     15    30
```

Onde os nós vermelhos representam as chaves adicionais dos nós 3.

## Exercícios

1. **Implementação Básica**: Estenda a implementação da Árvore 2-3 para suportar a operação de remoção.

2. **Visualização Interativa**: Crie uma função que gere uma representação visual da árvore em forma de caracteres ASCII, mostrando claramente as conexões entre nós.

3. **Análise de Desempenho**: Compare o desempenho de busca, inserção e travessia em ordem entre uma Árvore 2-3 e uma Árvore Binária de Busca para diferentes volumes de dados (100, 1000, 10000 elementos).

4. **Transformação para Árvore B**: Implemente uma função que converta uma Árvore 2-3 em uma Árvore B de ordem 4 (2-3-4 Tree).

5. **Aplicação Prática**: Desenvolva um sistema de agenda telefônica usando uma Árvore 2-3 onde os contatos são armazenados por nome e podem ser buscados de forma eficiente.

## Aplicação Detalhada: Sistema de Dicionário

Vamos implementar um dicionário usando Árvores 2-3 que permita:
1. Inserir palavras com suas definições
2. Buscar definições por palavra
3. Listar todas as palavras em ordem alfabética
4. Sugerir correções para palavras digitadas incorretamente

```typescript
interface DictionaryEntry {
  word: string;
  definition: string;
}

class Dictionary {
  private tree: Tree23<DictionaryEntry>;
  
  constructor() {
    this.tree = new Tree23<DictionaryEntry>();
  }
  
  addWord(word: string, definition: string): void {
    const lowerWord = word.toLowerCase();
    this.tree.insert({ word: lowerWord, definition });
  }
  
  lookupWord(word: string): string | null {
    const lowerWord = word.toLowerCase();
    // Implementação simplificada
    const allEntries = this.getAllEntries();
    for (const entry of allEntries) {
      if (entry.word === lowerWord) {
        return entry.definition;
      }
    }
    return null;
  }
  
  getAllEntries(): DictionaryEntry[] {
    return this.tree.inOrder();
  }
  
  getAllWords(): string[] {
    return this.getAllEntries().map(entry => entry.word);
  }
  
  // Sugestão de correções usando distância de Levenshtein
  suggestCorrections(word: string, maxDistance: number = 2): string[] {
    const lowerWord = word.toLowerCase();
    const allWords = this.getAllWords();
    const suggestions: string[] = [];
    
    for (const dictWord of allWords) {
      if (this.levenshteinDistance(lowerWord, dictWord) <= maxDistance) {
        suggestions.push(dictWord);
      }
    }
    
    return suggestions;
  }
  
  private levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];
    
    // Inicializar matriz
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    
    for (let i = 0; i <= a.length; i++) {
      matrix[0][i] = i;
    }
    
    // Preencher matriz
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substituição
            matrix[i][j - 1] + 1,     // inserção
            matrix[i - 1][j] + 1      // deleção
          );
        }
      }
    }
    
    return matrix[b.length][a.length];
  }
}

// Exemplo de uso
const dict = new Dictionary();

// Adicionar algumas palavras
dict.addWord("algorithm", "A step-by-step procedure for solving a problem or accomplishing some end.");
dict.addWord("data", "Factual information, especially information organized for analysis.");
dict.addWord("structure", "The arrangement of and relations between the parts of something complex.");
dict.addWord("tree", "A data structure in which each node has at most two children.");
dict.addWord("binary", "Relating to, using, or denoting a system of numerical notation that has 2 as its base.");

// Buscar uma palavra
console.log("Definição de 'algorithm':", dict.lookupWord("algorithm"));

// Listar todas as palavras
console.log("Todas as palavras:", dict.getAllWords());

// Sugerir correções
console.log("Sugestões para 'tre':", dict.suggestCorrections("tre"));
console.log("Sugestões para 'binari':", dict.suggestCorrections("binari"));
```

## Conclusão

As Árvores 2-3 representam um passo importante na evolução das estruturas de dados balanceadas. Embora sejam menos usadas diretamente na prática do que suas descendentes (B-Trees e Árvores Vermelho-Preto), seu estudo é fundamental para entender os princípios de balanceamento dinâmico e as técnicas de divisão e fusão de nós.

A garantia de estar sempre perfeitamente balanceada, com altura logarítmica, faz com que as operações de busca, inserção e remoção tenham desempenho consistente e previsível, mesmo nos piores casos - uma vantagem significativa sobre as árvores binárias de busca comuns.

Na próxima aula, exploraremos as B-Trees, que estendem o conceito das Árvores 2-3 para permitir um número maior de chaves por nó, tornando-as ideais para sistemas de armazenamento em disco e bancos de dados.

## Leituras Complementares

- "Introduction to Algorithms" por Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, e Clifford Stein
- "Algorithms" por Robert Sedgewick e Kevin Wayne
- "Data Structures and Algorithms in Java" por Michael T. Goodrich e Roberto Tamassia
- "Algorithm Design Manual" por Steven S. Skiena 