# Indexação Linear

## Introdução

Olá, estudante! Nesta aula, vamos explorar os conceitos e implementações da **Indexação Linear**, uma das abordagens fundamentais para acelerar o acesso e a recuperação de dados. A indexação é uma técnica essencial em sistemas de armazenamento e recuperação de informações, desde bancos de dados até mecanismos de busca de texto.

## Conceito Fundamental

A indexação linear refere-se a técnicas que organizam dados ou ponteiros para dados em uma estrutura sequencial, permitindo acessos mais eficientes do que a busca sequencial pura, mas mantendo uma organização relativamente simples, sem a complexidade das estruturas hierárquicas como árvores.

### Características Principais

1. **Organização Sequencial**: Os índices são armazenados em sequência (por exemplo, em arrays ou listas)
2. **Mapeamento Direto**: Estabelece uma correspondência entre chaves de busca e posições nos dados
3. **Acesso Facilitado**: Permite saltos diretos ou busca binária para localizar registros
4. **Otimização para Leitura**: Geralmente mais eficiente para operações de leitura do que de escrita

## Tipos de Indexação Linear

### 1. Índice Denso

Em um índice denso, cada registro de dados possui uma entrada correspondente no índice.

```
ÍNDICE DENSO:
┌─────┬───────┐
│ 10  │ Ptr1  │ 
├─────┼───────┤ 
│ 20  │ Ptr2  │ 
├─────┼───────┤
│ 30  │ Ptr3  │ 
├─────┼───────┤
│ 40  │ Ptr4  │ 
└─────┴───────┘
      │      
DADOS:│      
┌─────▼───────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ ID: 10      │  │ ID: 20      │  │ ID: 30      │  │ ID: 40      │
│ Nome: Ana   │  │ Nome: Bruno │  │ Nome: Carlos│  │ Nome: Daniel│
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
```

**Vantagens**:
- Acesso mais rápido aos registros individuais
- Suporta busca binária eficiente no índice

**Desvantagens**:
- Consome mais espaço
- Manutenção mais cara em atualizações frequentes

### 2. Índice Esparso

Em um índice esparso, apenas alguns registros selecionados têm entradas no índice (geralmente o primeiro registro de cada bloco).

```
ÍNDICE ESPARSO:
┌─────┬───────┐
│ 10  │ Bloco1│ 
├─────┼───────┤ 
│ 30  │ Bloco2│ 
└─────┴───────┘
      │      
DADOS:│      
┌─────▼───────┐  ┌─────────────┐  ┌─────▼───────┐  ┌─────────────┐
│ ID: 10      │  │ ID: 20      │  │ ID: 30      │  │ ID: 40      │
│ Nome: Ana   │  │ Nome: Bruno │  │ Nome: Carlos│  │ Nome: Daniel│
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
    Bloco 1          Bloco 1          Bloco 2          Bloco 2
```

**Vantagens**:
- Índice menor (economiza espaço)
- Manutenção mais simples 

**Desvantagens**:
- Acesso menos direto
- Pode requerer busca linear dentro do bloco

### 3. Índice Multinível

Cria níveis hierárquicos de índices lineares para reduzir o espaço de busca progressivamente.

```
ÍNDICE NÍVEL 1:
┌─────┬───────┐
│ 10  │ IndA  │ 
├─────┼───────┤ 
│ 30  │ IndB  │ 
└─────┴───────┘
      │
      │
ÍNDICE│NÍVEL 2A:       ÍNDICE NÍVEL 2B:
┌─────▼───────┐        ┌─────────────┐
│ 10  │ Ptr1  │        │ 30  │ Ptr3  │
├─────┼───────┤        ├─────┼───────┤
│ 20  │ Ptr2  │        │ 40  │ Ptr4  │
└─────┴───────┘        └─────┴───────┘
```

## Aplicação Prática: Implementação de Índice Denso

Vejamos uma implementação básica de um índice denso em TypeScript:

```typescript
interface Record {
  id: number;
  data: string;
}

class DenseIndex {
  private index: Array<{ key: number; position: number }>;
  private dataStore: Record[];
  
  constructor() {
    this.index = [];
    this.dataStore = [];
  }
  
  // Inserir um novo registro e atualizar o índice
  insert(record: Record): void {
    // Inserimos no final do array de dados
    const position = this.dataStore.length;
    this.dataStore.push(record);
    
    // Adicionamos uma entrada no índice
    this.index.push({ key: record.id, position });
    
    // Mantemos o índice ordenado por chave
    this.index.sort((a, b) => a.key - b.key);
  }
  
  // Buscar um registro usando o índice
  search(id: number): Record | null {
    // Aplicamos busca binária no índice
    let left = 0;
    let right = this.index.length - 1;
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      
      if (this.index[mid].key === id) {
        // Encontramos a chave, recuperamos o registro usando a posição
        return this.dataStore[this.index[mid].position];
      }
      
      if (this.index[mid].key < id) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    
    return null; // Registro não encontrado
  }
  
  // Remover um registro
  delete(id: number): boolean {
    // Encontrar a entrada no índice
    const indexEntry = this.index.findIndex(entry => entry.key === id);
    if (indexEntry === -1) {
      return false; // Registro não encontrado
    }
    
    // Nesta implementação simplificada, apenas marcamos o registro como excluído
    // Em sistemas reais, precisaríamos reorganizar o armazenamento
    const position = this.index[indexEntry].position;
    this.dataStore[position] = { id: -1, data: "[DELETED]" };
    
    // Remover do índice
    this.index.splice(indexEntry, 1);
    
    return true;
  }
  
  // Listar todos os registros em ordem de chave
  listAll(): Record[] {
    // Usar o índice para retornar dados ordenados
    return this.index.map(entry => this.dataStore[entry.position]);
  }
}

// Exemplo de uso
const database = new DenseIndex();

// Inserir alguns registros
database.insert({ id: 30, data: "Carlos" });
database.insert({ id: 10, data: "Ana" });
database.insert({ id: 20, data: "Bruno" });
database.insert({ id: 40, data: "Daniela" });

// Buscar um registro
console.log(database.search(20)); // { id: 20, data: "Bruno" }

// Listar todos em ordem
console.log(database.listAll());
// Saída: [{ id: 10, data: "Ana" }, { id: 20, data: "Bruno" }, ...]
```

## Implementação de Índice Esparso

Agora, vejamos como implementar um índice esparso:

```typescript
interface Record {
  id: number;
  data: string;
}

class SparseIndex {
  private index: Array<{ key: number; blockId: number }>;
  private blocks: Record[][];
  private blockSize: number;
  
  constructor(blockSize = 2) {
    this.index = [];
    this.blocks = [];
    this.blockSize = blockSize;
  }
  
  // Inserir novo registro e atualizar índice quando necessário
  insert(record: Record): void {
    // Determinar em qual bloco o registro deve ser inserido
    let targetBlock = -1;
    for (let i = 0; i < this.index.length; i++) {
      if (i === this.index.length - 1 || record.id < this.index[i + 1].key) {
        targetBlock = this.index[i].blockId;
        break;
      }
    }
    
    // Caso especial: primeiro registro ou menor que todos
    if (targetBlock === -1) {
      if (this.blocks.length === 0) {
        // Primeiro registro: criar novo bloco
        this.blocks.push([record]);
        this.index.push({ key: record.id, blockId: 0 });
      } else {
        // Menor que todos: inserir no primeiro bloco
        const block = this.blocks[0];
        this.insertIntoBlock(block, record);
        
        // Atualizar índice se necessário
        if (record.id < this.index[0].key) {
          this.index[0].key = record.id;
        }
      }
      return;
    }
    
    // Inserir no bloco encontrado
    const block = this.blocks[targetBlock];
    this.insertIntoBlock(block, record);
    
    // Verificar se o bloco está cheio e precisa ser dividido
    if (block.length > this.blockSize) {
      this.splitBlock(targetBlock);
    }
  }
  
  private insertIntoBlock(block: Record[], record: Record): void {
    // Inserir mantendo a ordem
    let insertIndex = 0;
    while (insertIndex < block.length && block[insertIndex].id < record.id) {
      insertIndex++;
    }
    block.splice(insertIndex, 0, record);
  }
  
  private splitBlock(blockId: number): void {
    const block = this.blocks[blockId];
    const midIndex = Math.floor(block.length / 2);
    
    // Criar novo bloco com a segunda metade
    const newBlockId = this.blocks.length;
    const newBlock = block.splice(midIndex);
    this.blocks.push(newBlock);
    
    // Atualizar índice
    this.index.push({ key: newBlock[0].id, blockId: newBlockId });
    
    // Reordenar índice
    this.index.sort((a, b) => a.key - b.key);
  }
  
  // Buscar um registro
  search(id: number): Record | null {
    // Encontrar o bloco correto
    let targetBlock = -1;
    for (let i = 0; i < this.index.length; i++) {
      if (i === this.index.length - 1 || id < this.index[i + 1].key) {
        targetBlock = this.index[i].blockId;
        break;
      }
    }
    
    if (targetBlock === -1) {
      return null; // Não encontrado
    }
    
    // Buscar linearmente dentro do bloco
    const block = this.blocks[targetBlock];
    for (const record of block) {
      if (record.id === id) {
        return record;
      }
    }
    
    return null; // Não encontrado no bloco
  }
  
  // Listar todos os registros
  listAll(): Record[] {
    const result: Record[] = [];
    
    // Percorrer os blocos na ordem do índice
    for (const entry of this.index) {
      result.push(...this.blocks[entry.blockId]);
    }
    
    return result;
  }
}

// Exemplo de uso
const sparseDb = new SparseIndex(2); // Blocos de 2 registros

// Inserir registros
sparseDb.insert({ id: 30, data: "Carlos" });
sparseDb.insert({ id: 10, data: "Ana" });
sparseDb.insert({ id: 20, data: "Bruno" });
sparseDb.insert({ id: 40, data: "Daniela" });

// Buscar
console.log(sparseDb.search(20)); // { id: 20, data: "Bruno" }
```

## Análise de Complexidade

| Operação | Índice Denso | Índice Esparso |
|----------|--------------|---------------|
| Busca    | O(log n)     | O(log b + r)  |
| Inserção | O(n)         | O(log b + r)  |
| Remoção  | O(n)         | O(log b + r)  |

Onde:
- n: número total de registros
- b: número de blocos (no índice esparso)
- r: número de registros por bloco

## Comparação com Outras Estruturas

A indexação linear oferece um equilíbrio interessante entre simplicidade e desempenho:

1. **vs. Acesso Sequencial Puro**:
   - Muito mais rápida para buscas
   - Mais complexa de manter

2. **vs. Árvores (B-Trees, Árvores AVL)**:
   - Mais simples de implementar
   - Menor sobrecarga de memória
   - Porém, geralmente menos eficiente para grandes conjuntos de dados

3. **vs. Tabelas Hash**:
   - Suporta naturalmente buscas por intervalo e ordem
   - Mais previsível, sem problemas de colisão
   - Geralmente mais lenta para buscas pontuais

## Aplicações Práticas

A indexação linear é amplamente utilizada em:

1. **Bancos de Dados**:
   - Índices de colunas frequentemente consultadas
   - Otimização de consultas de intervalo

2. **Sistemas de Arquivos**:
   - Diretórios e tabelas de arquivos
   - FAT (File Allocation Table)

3. **Livros e Documentos**:
   - Índices alfabéticos no final de livros
   - Índices de termos técnicos

4. **Sistemas de Recuperação de Informação**:
   - Índices invertidos em mecanismos de busca
   - Índices de texto para busca rápida

## Exercícios Práticos

### Exercício 1: Implementação de Índice Invertido

Implemente um índice invertido simples para busca de texto. O sistema deve permitir:
1. Indexar documentos (mapear palavras-chave para documentos)
2. Pesquisar documentos que contenham uma palavra específica
3. Realizar buscas booleanas simples (AND/OR de palavras)

```typescript
// Estrutura para o exercício de índice invertido
interface Document {
  id: number;
  title: string;
  content: string;
}

// Sua implementação aqui!
```

### Exercício 2: Otimização de Busca Binária

Modifique a implementação de índice denso para usar busca interpolada em vez de busca binária quando apropriado. Compare o desempenho das duas abordagens com diferentes distribuições de dados.

### Exercício 3: Índice Multinível

Implemente um índice linear multinível que utilize dois ou mais níveis de indexação para melhorar a eficiência de busca em grandes conjuntos de dados.

## Conclusão

A indexação linear é uma técnica fundamental que equilibra eficiência e simplicidade. Embora estruturas mais complexas como árvores B e tabelas hash possam oferecer melhor desempenho em certos cenários, a indexação linear continua sendo uma escolha prática para muitas aplicações devido à sua facilidade de implementação e baixo overhead.

Nos próximos tópicos, exploraremos a indexação baseada em árvores, que resolve algumas das limitações da indexação linear para grandes volumes de dados.

## Leitura Complementar

- "Database System Concepts" de Silberschatz, Korth, e Sudarshan
- "Introduction to Algorithms" de Cormen, Leiserson, Rivest, e Stein
- "Information Retrieval: Algorithms and Heuristics" de Grossman e Frieder

## Próximos Passos

Avance para o próximo tópico sobre "Indexação Baseada em Árvore" para entender como estruturas hierárquicas podem melhorar ainda mais a eficiência de indexação. 