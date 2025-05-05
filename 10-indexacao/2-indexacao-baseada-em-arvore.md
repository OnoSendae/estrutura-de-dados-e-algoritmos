# Indexação Baseada em Árvore

## Introdução

Olá, estudante! Nesta aula, vamos explorar a **Indexação Baseada em Árvore**, uma abordagem poderosa para organizar e acessar grandes volumes de dados de forma eficiente. Após conhecer a indexação linear no tópico anterior, veremos como as estruturas hierárquicas em forma de árvore podem superar muitas de suas limitações.

## Conceito Fundamental

A indexação baseada em árvore organiza as chaves de busca em uma estrutura hierárquica que permite localizar, inserir e remover dados com alta eficiência, mesmo quando a coleção de dados cresce significativamente. Diferentemente da indexação linear, as árvores distribuem as chaves em múltiplos níveis, reduzindo drasticamente o espaço de busca a cada nível percorrido.

### Características Principais

1. **Estrutura Hierárquica**: Organização em múltiplos níveis
2. **Balanceamento**: Muitas estruturas arbóreas mantêm-se automaticamente balanceadas
3. **Operações Eficientes**: Busca, inserção e remoção em tempo logarítmico
4. **Adaptabilidade**: Ajusta-se automaticamente ao volume de dados
5. **Suporte a Operações por Intervalo**: Facilita buscas por intervalo de valores

## Tipos de Indexação Baseada em Árvore

### 1. Árvores B e B+

As árvores B e suas variantes (especialmente B+) são as estruturas de indexação mais comuns em sistemas de gerenciamento de banco de dados e sistemas de arquivos.

#### Árvore B

Uma árvore B de ordem m tem as seguintes propriedades:
- Cada nó pode ter até m filhos
- Cada nó (exceto a raiz) tem pelo menos ⌈m/2⌉ filhos
- Todos os nós folha estão no mesmo nível
- Um nó com k filhos contém k-1 chaves

```
               [30, 60]
              /   |   \
             /    |    \
     [10, 20]  [40, 50]  [70, 80, 90]
    /  |  \    / |  \    /  |  \   \
   1   15  25 35  45 55 65  75  85  95
```

#### Árvore B+

A árvore B+ é uma variação da árvore B com duas diferenças importantes:
- Todas as chaves estão presentes nas folhas
- As folhas são ligadas entre si formando uma lista encadeada

```
               [30, 60]
              /   |   \
             /    |    \
     [10, 20]  [40, 50]  [70, 80]
    /  |  \    / |  \    / |  \
   ┌─────────────────────────────┐
   │ 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 ├──→
   └─────────────────────────────┘
```

### 2. Árvores Binárias de Busca Balanceadas

Várias estruturas de árvores binárias balanceadas também são usadas para indexação:

#### Árvore AVL

Mantém o balanceamento garantindo que a diferença de altura entre subárvores esquerda e direita de qualquer nó não exceda 1.

```
       50
     /    \
   30      70
  /  \    /  \
 20  40  60  80
```

#### Árvore Rubro-Negra

Utiliza cores (vermelho e preto) nos nós para garantir balanceamento com regras específicas de recoloração e rotação.

```
       50(B)
     /      \
   30(R)    70(R)
  /  \      /  \
20(B) 40(B) 60(B) 80(B)
```

### 3. Árvores para Dados Multidimensionais

Para buscas em múltiplas dimensões, existem estruturas especializadas:

#### Árvore Quadtree/Octree

Divide o espaço em quatro (2D) ou oito (3D) regiões recursivamente.

```
┌───────┬───────┐
│       │       │
│   1   │   2   │
│       │       │
├───────┼───────┤
│       │       │
│   3   │   4   │
│       │       │
└───────┴───────┘
```

#### Árvore R

Organiza dados espaciais em retângulos delimitadores (MBRs - Minimum Bounding Rectangles).

## Foco na Implementação: Árvore B+

Vamos implementar uma versão simplificada de uma árvore B+ em TypeScript, que é a estrutura mais comum em sistemas reais de indexação.

```typescript
class BPlusTreeNode<K, V> {
  keys: K[];
  children: BPlusTreeNode<K, V>[] | null;
  values: V[] | null;
  next: BPlusTreeNode<K, V> | null;
  
  constructor(isLeaf: boolean) {
    this.keys = [];
    this.children = isLeaf ? null : [];
    this.values = isLeaf ? [] : null;
    this.next = null; // Ponteiro para o próximo nó folha (para travessia sequencial)
  }
  
  isLeaf(): boolean {
    return this.children === null;
  }
}

class BPlusTree<K, V> {
  private root: BPlusTreeNode<K, V>;
  private order: number; // Ordem da árvore (máximo de filhos por nó)
  private minKeys: number; // Mínimo de chaves por nó
  private comparator: (a: K, b: K) => number;
  
  constructor(order = 4, comparator = (a: any, b: any) => a < b ? -1 : a > b ? 1 : 0) {
    this.order = Math.max(3, order); // Ordem mínima é 3
    this.minKeys = Math.floor(this.order / 2) - 1;
    this.comparator = comparator;
    this.root = new BPlusTreeNode<K, V>(true); // Inicia com nó folha
  }
  
  // Inserir um par chave-valor
  insert(key: K, value: V): void {
    // Localizar folha onde a chave deve ser inserida
    const leaf = this.findLeafNode(key);
    
    // Determinar a posição de inserção para manter a ordem
    let insertionPoint = 0;
    while (insertionPoint < leaf.keys.length && 
           this.comparator(leaf.keys[insertionPoint], key) < 0) {
      insertionPoint++;
    }
    
    // Verificar se a chave já existe
    if (insertionPoint < leaf.keys.length && 
        this.comparator(leaf.keys[insertionPoint], key) === 0) {
      // Atualizar valor existente
      leaf.values![insertionPoint] = value;
      return;
    }
    
    // Inserir a nova chave e valor na folha
    leaf.keys.splice(insertionPoint, 0, key);
    leaf.values!.splice(insertionPoint, 0, value);
    
    // Verificar se é necessário dividir o nó
    if (leaf.keys.length >= this.order) {
      this.splitLeafNode(leaf);
    }
  }
  
  // Dividir um nó folha que está com excesso de chaves
  private splitLeafNode(node: BPlusTreeNode<K, V>): void {
    // Criar novo nó folha
    const newNode = new BPlusTreeNode<K, V>(true);
    
    // Ponto médio onde dividir as chaves
    const mid = Math.floor(node.keys.length / 2);
    
    // Transferir metade das chaves e valores para o novo nó
    newNode.keys = node.keys.splice(mid);
    newNode.values = node.values!.splice(mid);
    
    // Manter a lista encadeada de folhas
    newNode.next = node.next;
    node.next = newNode;
    
    // A chave mediana será promovida para o pai
    const medianKey = newNode.keys[0]; // Na B+, cópia da primeira chave do novo nó
    
    // Se este é o nó raiz, criar uma nova raiz
    if (node === this.root) {
      const newRoot = new BPlusTreeNode<K, V>(false);
      newRoot.keys = [medianKey];
      newRoot.children = [node, newNode];
      this.root = newRoot;
    } else {
      // Caso contrário, inserir no pai
      this.insertInParent(node, medianKey, newNode);
    }
  }
  
  // Inserir nova chave e filho no nó pai
  private insertInParent(node: BPlusTreeNode<K, V>, key: K, newNode: BPlusTreeNode<K, V>): void {
    // Encontrar o pai do nó
    const parent = this.findParent(this.root, node);
    
    // Encontrar a posição onde inserir no pai
    let insertionPoint = 0;
    while (insertionPoint < parent.keys.length && 
           this.comparator(parent.keys[insertionPoint], key) < 0) {
      insertionPoint++;
    }
    
    // Inserir a chave e o novo filho no pai
    parent.keys.splice(insertionPoint, 0, key);
    parent.children!.splice(insertionPoint + 1, 0, newNode);
    
    // Verificar se o pai precisa ser dividido
    if (parent.keys.length >= this.order) {
      this.splitInternalNode(parent);
    }
  }
  
  // Dividir um nó interno (não-folha)
  private splitInternalNode(node: BPlusTreeNode<K, V>): void {
    // Criar novo nó interno
    const newNode = new BPlusTreeNode<K, V>(false);
    
    // Ponto médio onde dividir as chaves
    const mid = Math.floor(node.keys.length / 2);
    
    // Chave que será promovida para o pai
    const medianKey = node.keys[mid];
    
    // Transferir metade das chaves e filhos para o novo nó
    newNode.keys = node.keys.splice(mid + 1); // Exclui a chave mediana
    newNode.children = node.children!.splice(mid + 1);
    
    // Remover a chave mediana do nó original
    node.keys.splice(mid, 1);
    
    // Se este é o nó raiz, criar uma nova raiz
    if (node === this.root) {
      const newRoot = new BPlusTreeNode<K, V>(false);
      newRoot.keys = [medianKey];
      newRoot.children = [node, newNode];
      this.root = newRoot;
    } else {
      // Caso contrário, inserir no pai
      this.insertInParent(node, medianKey, newNode);
    }
  }
  
  // Encontrar o nó folha onde uma chave deveria estar
  private findLeafNode(key: K): BPlusTreeNode<K, V> {
    let current = this.root;
    
    while (!current.isLeaf()) {
      let childIndex = current.keys.length;
      
      for (let i = 0; i < current.keys.length; i++) {
        if (this.comparator(key, current.keys[i]) < 0) {
          childIndex = i;
          break;
        }
      }
      
      current = current.children![childIndex];
    }
    
    return current;
  }
  
  // Encontrar o pai de um nó específico
  private findParent(root: BPlusTreeNode<K, V>, node: BPlusTreeNode<K, V>): BPlusTreeNode<K, V> {
    if (root === node || root.isLeaf()) {
      return null!; // Não encontrado ou o nó é a raiz
    }
    
    // Verificar se algum filho é o nó buscado
    for (let i = 0; i < root.children!.length; i++) {
      if (root.children![i] === node) {
        return root;
      }
    }
    
    // Buscar recursivamente nos filhos
    for (let i = 0; i < root.children!.length; i++) {
      const parent = this.findParent(root.children![i], node);
      if (parent) {
        return parent;
      }
    }
    
    return null!; // Não encontrado
  }
  
  // Buscar um valor pela chave
  search(key: K): V | null {
    const leaf = this.findLeafNode(key);
    
    for (let i = 0; i < leaf.keys.length; i++) {
      if (this.comparator(leaf.keys[i], key) === 0) {
        return leaf.values![i];
      }
    }
    
    return null; // Chave não encontrada
  }
  
  // Buscar valores em um intervalo de chaves
  rangeSearch(startKey: K, endKey: K): V[] {
    const result: V[] = [];
    
    // Encontrar a folha contendo a chave inicial
    let leaf = this.findLeafNode(startKey);
    
    // Percorrer as folhas até encontrar uma chave maior que a chave final
    let done = false;
    
    while (!done && leaf) {
      for (let i = 0; i < leaf.keys.length; i++) {
        if (this.comparator(leaf.keys[i], startKey) >= 0 && 
            this.comparator(leaf.keys[i], endKey) <= 0) {
          result.push(leaf.values![i]);
        }
        
        if (this.comparator(leaf.keys[i], endKey) > 0) {
          done = true;
          break;
        }
      }
      
      if (!done) {
        leaf = leaf.next;
      }
    }
    
    return result;
  }
  
  // Visualizar a estrutura da árvore (para fins didáticos)
  toString(): string {
    const result: string[] = [];
    this.printNode(this.root, "", true, result);
    return result.join("\n");
  }
  
  private printNode(node: BPlusTreeNode<K, V>, prefix: string, isTail: boolean, result: string[]): void {
    const nodeType = node.isLeaf() ? "Leaf" : "Internal";
    const keys = node.keys.join(", ");
    result.push(`${prefix}${isTail ? "└── " : "├── "}[${nodeType}: ${keys}]`);
    
    if (!node.isLeaf()) {
      for (let i = 0; i < node.children!.length - 1; i++) {
        this.printNode(node.children![i], prefix + (isTail ? "    " : "│   "), false, result);
      }
      if (node.children!.length > 0) {
        this.printNode(node.children![node.children!.length - 1], 
                     prefix + (isTail ? "    " : "│   "), true, result);
      }
    }
  }
}

// Exemplo de uso
const indexTree = new BPlusTree<number, string>();

// Inserir alguns registros
indexTree.insert(10, "Ana");
indexTree.insert(5, "Bruno");
indexTree.insert(15, "Carlos");
indexTree.insert(3, "Daniela");
indexTree.insert(7, "Eduardo");
indexTree.insert(12, "Fernanda");
indexTree.insert(18, "Gabriel");

// Buscar um valor
console.log(indexTree.search(7)); // "Eduardo"

// Buscar em intervalo
console.log(indexTree.rangeSearch(5, 15)); 
// ["Bruno", "Eduardo", "Carlos", "Fernanda"]

// Visualizar a estrutura
console.log(indexTree.toString());
```

## Análise de Complexidade

| Operação       | Árvore B/B+     | Árvore AVL/Rubro-Negra |
|----------------|-----------------|------------------------|
| Busca          | O(log_m n)      | O(log_2 n)             |
| Inserção       | O(log_m n)      | O(log_2 n)             |
| Remoção        | O(log_m n)      | O(log_2 n)             |
| Busca por Intervalo | O(log_m n + k) | O(log_2 n + k)     |

Onde:
- n: número total de chaves
- m: ordem da árvore (B/B+)
- k: número de elementos no intervalo buscado

### Fatores Importantes

1. **Ordem da Árvore B/B+**: 
   - Valores maiores reduzem a altura da árvore
   - Valores ótimos dependem do tamanho dos blocos de armazenamento

2. **Custo de I/O**:
   - Árvores B/B+ são otimizadas para minimizar operações de I/O
   - Nós maiores reduzem o número de acessos a disco

3. **Cache Efficiency**:
   - Árvores binárias balanceadas podem ter melhor eficiência de cache para nós na memória
   - Árvores B+ têm melhor localidade de referência para folhas

## Comparação com Outras Estruturas

### Árvores vs. Indexação Linear

| Aspecto | Árvores | Índices Lineares |
|---------|---------|------------------|
| Escala  | Excelente para grandes conjuntos | Limitada para volumes pequenos/médios |
| Manutenção | Auto-balanceamento | Pode requerer reorganização |
| Espaço  | Overhead maior (ponteiros) | Mais compacto |
| Eficiência em Disco | Otimizada (poucos acessos) | Pode requerer vários acessos |

### Árvores vs. Tabelas Hash

| Aspecto | Árvores | Tabelas Hash |
|---------|---------|--------------|
| Busca por Chave | O(log n) | O(1) - melhor caso |
| Busca por Intervalo | Eficiente | Não suportada nativamente |
| Ordem dos Dados | Mantém ordem | Sem ordenação |
| Pior Caso | Garantidamente logarítmico | Potencialmente linear (colisões) |

## Aplicações Práticas

### 1. Sistemas de Gerenciamento de Banco de Dados (SGBD)

As árvores B+ são a espinha dorsal dos índices em praticamente todos os SGBDs relacionais:
- MySQL/InnoDB: Usa árvores B+ para índices primários e secundários
- PostgreSQL: Implementa B-Trees para índices padrão
- Oracle: Utiliza árvores B+ para índices

Exemplo no MySQL:
```sql
CREATE TABLE usuarios (
  id INT PRIMARY KEY,
  nome VARCHAR(100),
  email VARCHAR(100)
);

-- Criar índice usando B-Tree (implícito)
CREATE INDEX idx_nome ON usuarios(nome);
```

### 2. Sistemas de Arquivos

Muitos sistemas de arquivos usam árvores para organizar diretórios e arquivos:
- NTFS: Usa árvores B+ para o Master File Table
- ext4: Utiliza árvores B para diretórios grandes
- HFS+: Implementa árvores B+ para o catálogo de arquivos

### 3. Sistemas de Informação Geográfica (GIS)

Árvores especializadas são usadas para indexação espacial:
- R-Trees: Para indexar regiões espaciais (como em PostGIS)
- Quadtrees: Para divisão adaptativa do espaço

### 4. Motores de Busca

Índices invertidos combinados com árvores B+ são fundamentais para motores de busca:
- Elasticsearch: Usa índices invertidos com árvores B+ para organização
- Apache Lucene: Implementa estruturas baseadas em árvores para índices

## Exercícios Práticos

### Exercício 1: Implementação de Busca por Prefixo

Estenda a implementação da árvore B+ para suportar busca por prefixo em strings. Por exemplo, a busca pelo prefixo "car" deve retornar palavras como "carro", "carruagem", "carta", etc.

Dica: Utilize a propriedade de percurso sequencial das folhas para encontrar todas as strings que começam com o prefixo dado.

```typescript
// Adicione este método à classe BPlusTree
prefixSearch(prefix: string): V[] {
  // Sua implementação aqui!
}
```

### Exercício 2: Remoção em Árvore B+

Implemente a operação de remoção para a árvore B+. A remoção deve manter as propriedades da árvore, incluindo:
1. Número mínimo de chaves por nó
2. Balanceamento
3. Propriedades especiais das folhas e nós internos

Lembre-se de lidar com os casos especiais como mesclagem de nós e redistribuição de chaves.

### Exercício 3: Comparação de Desempenho

Crie um benchmark para comparar o desempenho de operações entre:
1. Índice Linear (denso)
2. Árvore B+
3. Árvore AVL

Operações a testar:
- Inserção em massa
- Busca pontual
- Busca por intervalo
- Remoção

Use datasets de diferentes tamanhos (100, 1.000, 10.000, 100.000 entradas) e analise os resultados.

## Visualização Conceitual: Percurso em Árvore B+

Uma das vantagens mais importantes da árvore B+ é a facilidade de percorrer os dados em ordem. Vamos visualizar como isso funciona:

```
    Árvore B+ (ordem 3)
        [7]
       /   \
    [3]     [10]
   /  \     /  \
[1,2] [3,5] [7,8] [10,15]
  ↓     ↓     ↓     ↓
  →→→→→→→→→→→→→→→→→→→→→→
```

Percorrendo as folhas sequencialmente (através dos ponteiros "next"), podemos facilmente listar todos os elementos em ordem: 1, 2, 3, 5, 7, 8, 10, 15.

## Considerações de Implementação

### Ajuste da Ordem da Árvore

A ordem da árvore B/B+ tem grande impacto no desempenho:

1. **Memória Principal**: 
   - Ordens menores (3-7) para minimizar comparações
   - Favorece eficiência de cache

2. **Armazenamento Secundário (disco)**:
   - Ordens maiores (100-1000) alinhadas com tamanho de página/bloco
   - Minimiza número de I/Os

### Cache e Paginação

Sistemas reais implementam:
- Buffer pool para páginas da árvore
- Prefetching de nós adjacentes
- Estratégias de substituição de páginas (LRU, etc.)

## Conclusão

A indexação baseada em árvore representa um avanço significativo sobre métodos lineares, especialmente para grandes volumes de dados. As estruturas como árvores B+ combinam o melhor dos dois mundos: acessos rápidos (logarítmicos) a registros individuais e travessia eficiente em ordem sequencial.

A escolha entre diferentes tipos de árvores depende das necessidades específicas da aplicação, como a proporção entre operações de leitura e escrita, restrições de espaço, e necessidade de buscas por intervalo ou prefixo.

Nos sistemas modernos de banco de dados, a indexação baseada em árvore permanece como tecnologia fundamental, mesmo com o surgimento de alternativas NoSQL e baseadas em memória.

## Leitura Complementar

- "Database System Concepts" de Silberschatz, Korth, e Sudarshan
- "Introduction to Algorithms" de Cormen, Leiserson, Rivest, e Stein
- "Fundamentals of Database Systems" de Elmasri e Navathe
- "Database Management Systems" de Ramakrishnan e Gehrke

## Próximos Passos

No próximo módulo, exploraremos técnicas avançadas de resolução de problemas, incluindo algoritmos randomizados, que complementam seu conhecimento sobre estruturas de dados e proporcionam ferramentas poderosas para problemas complexos. 