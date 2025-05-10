# ISAM - Método de Acesso Sequencial Indexado

## Introdução

Olá, estudante! Hoje vamos explorar o **ISAM (Indexed Sequential Access Method)**, uma estrutura de dados híbrida que combina os benefícios do acesso sequencial e do acesso indexado. Esta é uma técnica clássica de organização de dados, originalmente desenvolvida pela IBM para sistemas de armazenamento em disco, mas que estabeleceu conceitos fundamentais para o desenvolvimento de estruturas de indexação modernas como B-Trees e sistemas de banco de dados.

## Conceito Fundamental

O ISAM representa uma abordagem para organizar dados que permite tanto:
1. **Acesso sequencial**: percorrer todos os registros em ordem
2. **Acesso direto**: encontrar um registro específico rapidamente

A ideia principal é dividir os dados em blocos sequenciais ordenados e criar índices hierárquicos que apontam para esses blocos, permitindo localizar rapidamente onde um dado registro deve estar.

## Anatomia de uma Estrutura ISAM

A estrutura ISAM é composta por três níveis principais:

1. **Índice Mestre (Master Index)**: O nível superior que aponta para índices de cilindro
2. **Índices de Cilindro (Cylinder Indexes)**: Nível intermediário que aponta para as áreas de dados
3. **Área de Dados (Data Area)**: Onde os registros reais são armazenados em ordem

Visualmente, podemos representar esta estrutura da seguinte forma:

```
         ┌───────────────── ÍNDICE MESTRE ─────────────────┐
         │ Chave1 → Cil1 | Chave50 → Cil2 | Chave100 → Cil3│
         └───────────────────────┬───────────────────────┬─┘
                                 │                       │
           ┌───────────────────┐ │ ┌───────────────────┐ │
           │   ÍNDICE CILINDRO 1  │ │   ÍNDICE CILINDRO 2│
           │ Chave1 → Pag1     │ │ │ Chave50 → Pag5    │ │
           │ Chave10 → Pag2    │ │ │ Chave60 → Pag6    │ │
           │ ...               │ │ │ ...               │ │
           └────────┬──────────┘ │ └────────┬──────────┘ │
                    │            │          │            │
      ┌─────────────┼────────────┘          │            │
      │             │                       │            │
┌─────▼──────┐┌─────▼──────┐         ┌──────▼─────┐┌─────▼──────┐
│  PÁGINA 1  ││  PÁGINA 2  │   ...   │  PÁGINA 5  ││  PÁGINA 6  │  ...
│ (Registros)││ (Registros)│         │ (Registros)││ (Registros)│
└────────────┘└────────────┘         └────────────┘└────────────┘
```

### Características Principais

1. **Estrutura Estática**: Ao contrário de árvores B, a estrutura ISAM é relativamente estática
2. **Ordenação**: Os registros são mantidos em ordem sequencial física
3. **Área de Overflow**: Para lidar com inserções após a criação inicial
4. **Busca Eficiente**: Logarítmica em condições ideais (sem muito overflow)

## Analogia

Imagine uma grande biblioteca onde:

- Os livros estão organizados em diferentes salas (cilindros)
- Cada sala contém estantes (páginas)
- Na entrada há um diretório principal (índice mestre) que indica em qual sala estão os livros com determinadas iniciais
- Em cada sala há um diretório secundário (índice de cilindro) que detalha em qual estante está cada intervalo de livros

Quando você procura um livro específico:
1. Consulta o diretório principal para saber qual sala visitar
2. Vai até essa sala e consulta o diretório secundário para saber qual estante
3. Examina a estante para encontrar o livro específico

Esta organização permite que você encontre rapidamente um livro específico sem percorrer toda a biblioteca, mas também permite percorrer todos os livros em ordem alfabética se necessário.

## Operações Básicas

### Busca de um Registro

1. Consultar o índice mestre para encontrar o cilindro correto
2. Dentro do cilindro, consultar o índice de cilindro para encontrar a página correta
3. Procurar sequencialmente dentro da página
4. Se não encontrado, verificar a área de overflow

```typescript
interface Record {
  key: number;
  data: any;
}

interface IndexEntry {
  key: number;
  pointer: number; // Ponteiro para cilindro, página ou posição
}

class ISAM {
  masterIndex: IndexEntry[];
  cylinderIndexes: IndexEntry[][];
  dataPages: Record[][];
  overflowArea: Record[];
  
  constructor(records: Record[], cylinderSize: number, pageSize: number) {
    // Ordenar registros por chave
    records.sort((a, b) => a.key - b.key);
    
    // Criar estrutura de dados
    this.dataPages = [];
    this.cylinderIndexes = [];
    this.masterIndex = [];
    this.overflowArea = [];
    
    // Distribuir registros em páginas e cilindros
    this.initializeStructure(records, cylinderSize, pageSize);
  }
  
  private initializeStructure(records: Record[], cylinderSize: number, pageSize: number): void {
    // Criar páginas
    for (let i = 0; i < records.length; i += pageSize) {
      const page = records.slice(i, i + pageSize);
      this.dataPages.push(page);
    }
    
    // Criar índices de cilindro
    for (let i = 0; i < this.dataPages.length; i += cylinderSize) {
      const cylinderPages = this.dataPages.slice(i, i + cylinderSize);
      const cylinderIndex: IndexEntry[] = [];
      
      for (let j = 0; j < cylinderPages.length; j++) {
        if (cylinderPages[j].length > 0) {
          cylinderIndex.push({
            key: cylinderPages[j][0].key,
            pointer: i + j
          });
        }
      }
      
      this.cylinderIndexes.push(cylinderIndex);
    }
    
    // Criar índice mestre
    for (let i = 0; i < this.cylinderIndexes.length; i++) {
      if (this.cylinderIndexes[i].length > 0) {
        this.masterIndex.push({
          key: this.cylinderIndexes[i][0].key,
          pointer: i
        });
      }
    }
  }
  
  search(key: number): Record | null {
    // Buscar no índice mestre
    let cylinderIndex = 0;
    for (let i = 0; i < this.masterIndex.length; i++) {
      if (i === this.masterIndex.length - 1 || key < this.masterIndex[i + 1].key) {
        cylinderIndex = this.masterIndex[i].pointer;
        break;
      }
    }
    
    // Buscar no índice de cilindro
    let pageIndex = 0;
    const cylinder = this.cylinderIndexes[cylinderIndex];
    for (let i = 0; i < cylinder.length; i++) {
      if (i === cylinder.length - 1 || key < cylinder[i + 1].key) {
        pageIndex = cylinder[i].pointer;
        break;
      }
    }
    
    // Buscar na página
    const page = this.dataPages[pageIndex];
    for (const record of page) {
      if (record.key === key) {
        return record;
      }
    }
    
    // Verificar área de overflow
    for (const record of this.overflowArea) {
      if (record.key === key) {
        return record;
      }
    }
    
    return null; // Registro não encontrado
  }
  
  insert(record: Record): void {
    // Encontrar a posição correta
    let cylinderIndex = 0;
    for (let i = 0; i < this.masterIndex.length; i++) {
      if (i === this.masterIndex.length - 1 || record.key < this.masterIndex[i + 1].key) {
        cylinderIndex = this.masterIndex[i].pointer;
        break;
      }
    }
    
    // Tentar inserir na página correta
    let pageIndex = 0;
    const cylinder = this.cylinderIndexes[cylinderIndex];
    for (let i = 0; i < cylinder.length; i++) {
      if (i === cylinder.length - 1 || record.key < cylinder[i + 1].key) {
        pageIndex = cylinder[i].pointer;
        break;
      }
    }
    
    const page = this.dataPages[pageIndex];
    
    // Verificar se há espaço na página
    // Em um ISAM real, as páginas teriam tamanho fixo
    // Aqui estamos simplificando para fins didáticos
    if (page.length < 10) { // Assumindo que cada página pode ter até 10 registros
      // Encontrar posição correta na página
      let pos = 0;
      while (pos < page.length && page[pos].key < record.key) {
        pos++;
      }
      
      // Inserir o registro
      page.splice(pos, 0, record);
    } else {
      // Adicionar à área de overflow
      this.overflowArea.push(record);
      // Em uma implementação real, poderíamos ordenar a área de overflow
      this.overflowArea.sort((a, b) => a.key - b.key);
    }
  }
  
  // Método para percorrer todos os registros em ordem
  traverse(): Record[] {
    const result: Record[] = [];
    
    // Percorrer todas as páginas
    for (const page of this.dataPages) {
      for (const record of page) {
        result.push(record);
      }
    }
    
    // Adicionar registros da área de overflow (já ordenados)
    for (const record of this.overflowArea) {
      result.push(record);
    }
    
    // Ordenar tudo novamente para garantir a ordem
    return result.sort((a, b) => a.key - b.key);
  }
}

// Exemplo de uso
const records: Record[] = [
  { key: 10, data: "Registro 10" },
  { key: 5, data: "Registro 5" },
  { key: 20, data: "Registro 20" },
  { key: 15, data: "Registro 15" },
  { key: 30, data: "Registro 30" },
  // ... mais registros
];

const isam = new ISAM(records, 2, 3); // 2 páginas por cilindro, 3 registros por página
console.log(isam.search(15)); // Deve encontrar o registro com chave 15
isam.insert({ key: 12, data: "Registro 12" });
console.log(isam.traverse()); // Deve listar todos os registros ordenados
```

## O Problema de Overflow

Uma das limitações principais do ISAM é o gerenciamento de inserções após a estrutura inicial ser criada.

### Estratégias para Lidar com Overflow:

1. **Área de Overflow Separada**: Registros novos que não cabem em sua página original são colocados em uma área separada
2. **Encadeamento de Registros de Overflow**: Cada página pode ter um ponteiro para registros de overflow relacionados
3. **Reorganização Periódica**: Quando a área de overflow fica muito grande, a estrutura inteira é reorganizada

```
┌──────────────────┐     ┌────────────────┐
│ PÁGINA ORIGINAL  │     │ ÁREA OVERFLOW  │
│ Registros 1-5    │────►│ Registro 3.5   │
└──────────────────┘     │ Registro 4.2   │
                         └────────────────┘
```

Essa limitação levou ao desenvolvimento de estruturas mais dinâmicas como as árvores B e B+.

## Comparação com Outras Estruturas

| Característica | ISAM | Árvores B | Hash Tables |
|----------------|------|-----------|------------|
| Busca | O(log n) com degradação | O(log n) estável | O(1) em média |
| Inserção | Cara (overflow) | Eficiente | Eficiente |
| Ordenação | Mantém ordem | Mantém ordem | Não mantém ordem |
| Complexidade | Média | Alta | Baixa |
| Uso de memória | Eficiente | Moderado | Varia |
| Acesso sequencial | Eficiente | Eficiente | Ineficiente |

## Aplicações Históricas e Modernas

### Aplicações Históricas
- **Sistemas Mainframe da IBM**: O ISAM original foi desenvolvido para o IBM System/360
- **Sistemas de Arquivos**: Versões iniciais do VSAM (Virtual Storage Access Method)
- **Bancos de Dados Legados**: Sistemas anteriores ao modelo relacional

### Conceitos Derivados
- **Índices em Bancos de Dados**: Embora os bancos modernos usem B-Trees, o conceito de índices vem do ISAM
- **Arquivos Indexados**: Em linguagens como COBOL
- **Bibliotecas Java e .NET**: Algumas implementam variações do ISAM para acesso a dados

## Implementação em TypeScript com Exemplo Prático

Vamos criar uma implementação simplificada e mais prática do ISAM:

```typescript
class ISAMDatabase {
  private records: Map<number, string[]>;
  private masterIndex: number[];
  private pageSize: number;
  private cylinders: Map<number, number[]>;
  
  constructor(pageSize: number = 10) {
    this.records = new Map();
    this.masterIndex = [];
    this.pageSize = pageSize;
    this.cylinders = new Map();
  }
  
  // Constrói a estrutura ISAM a partir de registros iniciais
  buildFromData(data: [number, string][]): void {
    // Ordenar os registros pela chave
    data.sort((a, b) => a[0] - b[0]);
    
    // Armazenar registros
    for (const [key, value] of data) {
      if (!this.records.has(key)) {
        this.records.set(key, []);
      }
      this.records.get(key)!.push(value);
    }
    
    // Criar índices
    const keys = Array.from(this.records.keys()).sort((a, b) => a - b);
    
    // Criar índice mestre (um para cada cilindro/bloco de páginas)
    const cylinderSize = 3; // Número de páginas por cilindro
    for (let i = 0; i < keys.length; i += this.pageSize * cylinderSize) {
      this.masterIndex.push(keys[i]);
      
      // Criar índice de cilindro
      const cylinderKeys: number[] = [];
      for (let j = i; j < i + this.pageSize * cylinderSize && j < keys.length; j += this.pageSize) {
        cylinderKeys.push(keys[j]);
      }
      this.cylinders.set(keys[i], cylinderKeys);
    }
  }
  
  // Busca um valor pela chave
  search(key: number): string[] | null {
    // Encontrar o cilindro correto
    let cylinderKey = this.masterIndex[0];
    for (let i = 0; i < this.masterIndex.length; i++) {
      if (key >= this.masterIndex[i]) {
        cylinderKey = this.masterIndex[i];
      } else {
        break;
      }
    }
    
    // Encontrar a página correta dentro do cilindro
    const cylinderIndex = this.cylinders.get(cylinderKey)!;
    let pageKey = cylinderIndex[0];
    for (let i = 0; i < cylinderIndex.length; i++) {
      if (key >= cylinderIndex[i]) {
        pageKey = cylinderIndex[i];
      } else {
        break;
      }
    }
    
    // Percorrer a página para encontrar o registro
    for (let i = 0; i < this.pageSize; i++) {
      const currentKey = pageKey + i;
      if (currentKey === key && this.records.has(currentKey)) {
        return this.records.get(currentKey)!;
      }
    }
    
    return null; // Registro não encontrado
  }
  
  // Insere um novo registro
  insert(key: number, value: string): void {
    // Se o registro já existe, apenas adicionar o valor
    if (this.records.has(key)) {
      this.records.get(key)!.push(value);
      return;
    }
    
    // Caso contrário, criar novo registro
    this.records.set(key, [value]);
    
    // Em um ISAM real, teríamos que lidar com overflow e reorganização
    // Esta é uma simplificação onde apenas adicionamos à estrutura existente
    
    // Se necessário, poderíamos implementar uma reorganização periódica
    if (this.records.size > this.pageSize * this.cylinders.size * 3) {
      this.reorganize();
    }
  }
  
  // Reorganiza a estrutura
  private reorganize(): void {
    const allData: [number, string][] = [];
    
    // Coletar todos os dados
    for (const [key, values] of this.records.entries()) {
      for (const value of values) {
        allData.push([key, value]);
      }
    }
    
    // Limpar estrutura atual
    this.records.clear();
    this.masterIndex = [];
    this.cylinders.clear();
    
    // Reconstruir
    this.buildFromData(allData);
  }
  
  // Retorna todos os registros em ordem
  getAllRecords(): [number, string[]][] {
    return Array.from(this.records.entries())
      .sort((a, b) => a[0] - b[0]);
  }
  
  // Para fins de debug/visualização
  printStructure(): void {
    console.log("Índice Mestre:", this.masterIndex);
    
    for (const cylinder of this.masterIndex) {
      console.log(`Índice Cilindro ${cylinder}:`, this.cylinders.get(cylinder));
      
      // Mostrar páginas no cilindro
      const cylinderIndex = this.cylinders.get(cylinder)!;
      for (const page of cylinderIndex) {
        console.log(`  Página ${page}:`);
        for (let i = 0; i < this.pageSize; i++) {
          const key = page + i;
          if (this.records.has(key)) {
            console.log(`    Registro ${key}:`, this.records.get(key));
          }
        }
      }
    }
  }
}

// Exemplo de uso
const db = new ISAMDatabase(5); // 5 registros por página

// Dados de exemplo: [id, nome]
const initialData: [number, string][] = [
  [1, "Alice"],
  [5, "Bob"],
  [10, "Charlie"],
  [15, "Dave"],
  [20, "Eve"],
  [25, "Frank"],
  [30, "Grace"],
  [35, "Heidi"],
  [40, "Ivan"],
  [45, "Judy"],
  [50, "Mallory"],
  [55, "Niaj"],
  [60, "Oscar"],
  [65, "Peggy"],
  [70, "Rupert"]
];

db.buildFromData(initialData);
db.printStructure();

// Buscar um registro
console.log("Busca pela chave 30:", db.search(30));

// Inserir um novo registro
db.insert(33, "Hannah");
console.log("Busca pela chave 33 (recém-inserida):", db.search(33));

// Listar todos os registros
console.log("Todos os registros:", db.getAllRecords());
```

## Críticas e Limitações

1. **Estrutura Estática**: Dificuldade para acomodar crescimento de dados
2. **Degradação de Desempenho**: Com muitas inserções, a área de overflow cresce e as buscas ficam mais lentas
3. **Reorganização Custosa**: Reconstruir a estrutura é uma operação cara
4. **Deleções Ineficientes**: Pode criar espaço vazio nas páginas que é difícil de reutilizar

Estas limitações levaram ao desenvolvimento de estruturas mais dinâmicas como B-Trees, que veremos em aulas posteriores.

## Exercícios

1. **Implementação Básica**: Estenda a implementação acima para suportar a exclusão de registros.

2. **Análise de Desempenho**: Compare o desempenho de busca em um ISAM com uma árvore binária de busca padrão para diferentes volumes de dados.

3. **Gerenciamento de Overflow**: Implemente um sistema mais sofisticado para gerenciar registros de overflow, como encadeamento de blocos.

4. **Simulação de Banco de Dados**: Crie um pequeno banco de dados ISAM que permita operações básicas de CRUD (Create, Read, Update, Delete) em registros de clientes.

5. **Visualização**: Desenvolva uma função que mostre visualmente a estrutura ISAM, destacando índices, páginas e áreas de overflow.

## Aplicação Prática: Sistema de Índice de Biblioteca

Implemente um sistema simplificado de catálogo de biblioteca usando ISAM:

```typescript
interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  location: string; // localização física na biblioteca
}

class LibraryCatalog {
  private isam: ISAMDatabase;
  private bookDetails: Map<number, Book>;
  
  constructor() {
    this.isam = new ISAMDatabase(10);
    this.bookDetails = new Map();
  }
  
  // Inicializa o catálogo com livros
  initializeCatalog(books: Book[]): void {
    const data: [number, string][] = books.map(book => [book.id, book.title]);
    
    // Armazenar detalhes completos
    for (const book of books) {
      this.bookDetails.set(book.id, book);
    }
    
    // Construir o índice ISAM
    this.isam.buildFromData(data);
  }
  
  // Buscar livro pelo ID
  findBookById(id: number): Book | null {
    if (this.bookDetails.has(id)) {
      return this.bookDetails.get(id)!;
    }
    return null;
  }
  
  // Buscar livros pelo título (pode retornar vários)
  findBooksByTitle(title: string): Book[] {
    const allRecords = this.isam.getAllRecords();
    const matchingBooks: Book[] = [];
    
    for (const [id, titles] of allRecords) {
      for (const bookTitle of titles) {
        if (bookTitle.toLowerCase().includes(title.toLowerCase())) {
          const book = this.bookDetails.get(id);
          if (book) {
            matchingBooks.push(book);
          }
        }
      }
    }
    
    return matchingBooks;
  }
  
  // Adicionar um novo livro
  addBook(book: Book): void {
    // Adicionar ao índice ISAM
    this.isam.insert(book.id, book.title);
    
    // Armazenar detalhes completos
    this.bookDetails.set(book.id, book);
  }
  
  // Listar todos os livros ordenados por ID
  getAllBooks(): Book[] {
    return Array.from(this.bookDetails.values())
      .sort((a, b) => a.id - b.id);
  }
}

// Exemplo de uso
const catalog = new LibraryCatalog();

const books: Book[] = [
  { id: 101, title: "O Senhor dos Anéis", author: "J.R.R. Tolkien", year: 1954, location: "Prateleira A1" },
  { id: 205, title: "1984", author: "George Orwell", year: 1949, location: "Prateleira B3" },
  { id: 310, title: "Dom Quixote", author: "Miguel de Cervantes", year: 1605, location: "Prateleira C2" },
  // ... mais livros
];

catalog.initializeCatalog(books);

// Buscar um livro pelo ID
console.log(catalog.findBookById(205));

// Buscar livros pelo título
console.log(catalog.findBooksByTitle("Senhor"));

// Adicionar um novo livro
catalog.addBook({
  id: 420,
  title: "O Pequeno Príncipe",
  author: "Antoine de Saint-Exupéry",
  year: 1943,
  location: "Prateleira D4"
});

// Listar todos os livros
console.log(catalog.getAllBooks());
```

## Conclusão

O ISAM é uma estrutura de dados histórica, mas seus conceitos fundamentais de indexação hierárquica e acesso combinado (sequencial e direto) ainda são relevantes hoje. Embora tenha sido substituído em grande parte por estruturas mais dinâmicas como B-Trees, suas limitações e soluções proporcionaram insights importantes para o desenvolvimento das estruturas de dados modernas utilizadas em sistemas de arquivos e bancos de dados.

Na próxima aula, exploraremos as 2-3 Trees, que são uma evolução que resolve muitos dos problemas enfrentados pelo ISAM, mantendo a capacidade de acesso eficiente e ordenado aos dados.

## Leituras Complementares

- "Database System Concepts" por Abraham Silberschatz, Henry F. Korth, e S. Sudarshan
- "Introduction to Algorithms" por Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, e Clifford Stein
- "File Structures: An Object-Oriented Approach with C++" por Michael J. Folk, Bill Zoellick, e Greg Riccardi
- "IBM System/360 and System/370 File Organization and Access Methods" (documentação histórica) 