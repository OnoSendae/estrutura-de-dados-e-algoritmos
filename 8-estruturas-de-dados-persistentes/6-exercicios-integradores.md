# Exercícios Integradores de Estruturas Persistentes

Esta seção contém uma série de exercícios práticos integradores que aplicam todos os conceitos de estruturas de dados persistentes que estudamos neste módulo. Os exercícios estão organizados por nível de dificuldade, permitindo uma progressão gradual na compreensão e aplicação dos conceitos.

## 🏗️ Exercícios Nível Iniciante

### Exercício 1: Gerenciador de Histórico de Texto

**Objetivo**: Criar um editor de texto simples com funcionalidades de desfazer/refazer.

**Requisitos**:
- Implementar um editor que mantém o histórico de todas as alterações
- Permitir adição, remoção e modificação de linhas
- Implementar as operações de desfazer (undo) e refazer (redo)
- Permitir visualizar o conteúdo em qualquer ponto do histórico

**Dicas**:
- Use listas encadeadas persistentes para armazenar as linhas de texto
- Cada operação deve criar uma nova versão da lista
- Mantenha um ponteiro para a versão atual no histórico

**Template Inicial**:

```typescript
import { List } from 'immutable';

class TextEditor {
    private text: List<string>;
    private history: List<string>[];
    private currentVersion: number;
    
    constructor(initialText: string = '') {
        // Implementar
    }
    
    // Adiciona uma linha no índice especificado
    insertLine(index: number, content: string): void {
        // Implementar
    }
    
    // Remove a linha no índice especificado
    removeLine(index: number): void {
        // Implementar
    }
    
    // Atualiza o conteúdo de uma linha existente
    updateLine(index: number, newContent: string): void {
        // Implementar
    }
    
    // Desfaz a última operação
    undo(): boolean {
        // Implementar
    }
    
    // Refaz a última operação desfeita
    redo(): boolean {
        // Implementar
    }
    
    // Retorna o texto atual
    getText(): string {
        // Implementar
    }
    
    // Retorna uma versão específica do texto
    getVersionText(version: number): string | null {
        // Implementar
    }
}

// Teste sua implementação
function testTextEditor() {
    const editor = new TextEditor();
    editor.insertLine(0, "Linha 1");
    editor.insertLine(1, "Linha 3");
    editor.insertLine(1, "Linha 2");
    console.log(editor.getText());
    
    editor.updateLine(2, "Linha 3 modificada");
    console.log(editor.getText());
    
    editor.undo();
    console.log(editor.getText());
    
    editor.redo();
    console.log(editor.getText());
}
```

### Exercício 2: Lista de Compras Colaborativa

**Objetivo**: Implementar uma lista de compras que pode ser modificada por vários usuários e mantém o histórico de alterações.

**Requisitos**:
- Permitir adicionar, remover e marcar itens como comprados
- Cada usuário tem sua própria visão da lista
- Qualquer usuário pode desfazer suas próprias ações
- Todas as versões são preservadas

**Template Inicial**:

```typescript
import { Map, List } from 'immutable';

interface ShoppingItem {
    name: string;
    quantity: number;
    purchased: boolean;
}

class CollaborativeShoppingList {
    private masterList: Map<string, ShoppingItem>; // id -> item
    private userVersions: Map<string, number>; // userId -> version
    private history: Map<string, ShoppingItem>[]; // todas as versões
    
    constructor() {
        // Implementar
    }
    
    // Adiciona um item à lista
    addItem(userId: string, itemId: string, name: string, quantity: number): void {
        // Implementar
    }
    
    // Remove um item da lista
    removeItem(userId: string, itemId: string): void {
        // Implementar
    }
    
    // Marca um item como comprado
    markAsPurchased(userId: string, itemId: string, purchased: boolean = true): void {
        // Implementar
    }
    
    // Desfaz a última ação do usuário
    undoUserAction(userId: string): boolean {
        // Implementar
    }
    
    // Retorna a lista atual para um usuário
    getUserList(userId: string): ShoppingItem[] {
        // Implementar
    }
    
    // Retorna um relatório de todas as ações realizadas
    getActionHistory(): string[] {
        // Implementar
    }
}
```

## 🏗️ Exercícios Nível Intermediário

### Exercício 3: Sistema de Gestão de Documentos

**Objetivo**: Criar um sistema que gerencia documentos com controle de versões e permissões de acesso.

**Requisitos**:
- Permitir criar, editar e excluir documentos
- Manter o histórico completo de revisões de cada documento
- Suportar ramificações (branches) para documentos em revisão
- Implementar mesclagem (merge) de diferentes versões
- Controlar permissões de leitura/escrita por usuário

**Template Inicial**:

```typescript
import { Map, List, Set } from 'immutable';

enum Permission { READ, WRITE, ADMIN }

interface Document {
    id: string;
    content: string;
    metadata: Map<string, any>;
}

class DocumentManagementSystem {
    private documents: Map<string, Map<string, Document>>; // docId -> (branchName -> Document)
    private documentHistory: Map<string, List<Document>>; // docId -> história de versões
    private userPermissions: Map<string, Map<string, Set<Permission>>>; // userId -> (docId -> permissões)
    
    constructor() {
        // Implementar
    }
    
    // Cria um novo documento
    createDocument(userId: string, docId: string, initialContent: string, metadata?: Map<string, any>): boolean {
        // Implementar
    }
    
    // Edita um documento existente
    editDocument(userId: string, docId: string, newContent: string, branch: string = 'main'): boolean {
        // Implementar
    }
    
    // Cria um novo branch do documento
    createBranch(userId: string, docId: string, branchName: string, baseBranch: string = 'main'): boolean {
        // Implementar
    }
    
    // Mescla um branch de volta ao branch principal
    mergeBranch(userId: string, docId: string, sourceBranch: string, targetBranch: string = 'main'): boolean {
        // Implementar
    }
    
    // Recupera uma versão específica do documento
    getDocumentVersion(userId: string, docId: string, version: number): Document | null {
        // Implementar
    }
    
    // Concede permissão a um usuário
    grantPermission(adminId: string, userId: string, docId: string, permission: Permission): boolean {
        // Implementar
    }
}
```

### Exercício 4: Cache Inteligente com Invalidação

**Objetivo**: Implementar um sistema de cache que mantém múltiplas versões e realiza invalidação seletiva.

**Requisitos**:
- Armazenar dados em cache com suporte a múltiplas versões
- Implementar políticas de expiração por tempo e por memória
- Permitir invalidação seletiva baseada em tags ou padrões
- Fornecer rollback para versões anteriores em caso de falha

**Template Inicial**:

```typescript
import { Map, Set } from 'immutable';

interface CacheEntry<T> {
    value: T;
    timestamp: number;
    expiresAt: number;
    tags: Set<string>;
    version: number;
}

class VersionedCache<T> {
    private cache: Map<string, CacheEntry<T>>;
    private keyVersions: Map<string, number[]>; // key -> versões disponíveis
    private tagToKeys: Map<string, Set<string>>; // tag -> keys
    private memoryLimit: number; // em número de entradas
    private currentMemoryUsage: number;
    
    constructor(memoryLimit: number = 100) {
        // Implementar
    }
    
    // Adiciona ou atualiza um valor no cache
    set(key: string, value: T, ttlMs: number = 3600000, tags: string[] = []): void {
        // Implementar
    }
    
    // Obtém um valor do cache
    get(key: string, version?: number): T | undefined {
        // Implementar
    }
    
    // Invalida entradas baseadas em tags
    invalidateByTags(tags: string[]): number {
        // Implementar
    }
    
    // Invalida entradas baseadas em padrão de chave
    invalidateByPattern(pattern: RegExp): number {
        // Implementar
    }
    
    // Faz rollback para uma versão específica de uma chave
    rollbackToVersion(key: string, version: number): boolean {
        // Implementar
    }
    
    // Limpa entradas expiradas
    purgeExpired(): number {
        // Implementar
    }
    
    // Reduz o uso de memória quando necessário
    private enforceMemoryLimit(): void {
        // Implementar
    }
}
```

## 🏗️ Exercícios Nível Avançado

### Exercício 5: Planilha Colaborativa com Fórmulas

**Objetivo**: Implementar uma planilha que suporta edição colaborativa e fórmulas com dependências.

**Requisitos**:
- Células podem conter valores ou fórmulas
- As fórmulas são recalculadas automaticamente quando suas dependências mudam
- Suporte para múltiplos usuários editando simultaneamente
- Histórico completo de alterações com possibilidade de reverter para qualquer estado
- Detecção e resolução de conflitos

**Template Inicial**:

```typescript
import { Map, List, Set } from 'immutable';

type CellValue = string | number | null;
type CellAddress = [number, number]; // [row, column]

interface CellData {
    value: CellValue;
    formula?: string;
    calculatedValue?: CellValue;
    dependsOn: Set<string>; // células das quais esta depende
    dependedBy: Set<string>; // células que dependem desta
}

type SheetData = Map<string, CellData>; // ex: "A1" -> CellData

class CollaborativeSpreadsheet {
    private sheets: Map<string, SheetData>; // sheetName -> SheetData
    private history: Map<string, List<SheetData>>; // sheetName -> histórico
    private userVersions: Map<string, Map<string, number>>; // userId -> (sheetName -> versão)
    private lastChangeBy: Map<string, Map<string, string>>; // sheetName -> (cellId -> userId)
    
    constructor() {
        // Implementar
    }
    
    // Converte [row, col] para "A1" notation
    private addressToId(address: CellAddress): string {
        // Implementar
    }
    
    // Converte "A1" para [row, col]
    private idToAddress(id: string): CellAddress {
        // Implementar
    }
    
    // Cria uma nova planilha
    createSheet(userId: string, sheetName: string): boolean {
        // Implementar
    }
    
    // Define o valor de uma célula
    setCellValue(userId: string, sheetName: string, cellAddress: CellAddress, value: CellValue): boolean {
        // Implementar
    }
    
    // Define uma fórmula para uma célula
    setCellFormula(userId: string, sheetName: string, cellAddress: CellAddress, formula: string): boolean {
        // Implementar
    }
    
    // Obtém o valor calculado de uma célula
    getCellValue(sheetName: string, cellAddress: CellAddress): CellValue {
        // Implementar
    }
    
    // Recalcula todas as células que dependem da célula especificada
    private recalculateDependents(sheetName: string, cellId: string): void {
        // Implementar
    }
    
    // Calcula o valor de uma fórmula
    private evaluateFormula(sheetName: string, formula: string): CellValue {
        // Implementar
    }
    
    // Analisa uma fórmula para encontrar dependências
    private extractDependencies(formula: string): Set<string> {
        // Implementar
    }
    
    // Desfaz a última ação de um usuário
    undoUserAction(userId: string, sheetName: string): boolean {
        // Implementar
    }
    
    // Detecta e resolve conflitos entre edições simultâneas
    private resolveConflicts(sheetName: string, cellId: string): void {
        // Implementar
    }
}
```

### Exercício 6: Sistema de Banco de Dados com MVCC

**Objetivo**: Implementar um simples banco de dados em memória com suporte a Multi-Version Concurrency Control (MVCC).

**Requisitos**:
- Suportar transações ACID com isolamento
- Implementar MVCC para permitir leituras consistentes durante escritas
- Suportar consultas temporais (time-travel queries)
- Implementar um mecanismo de controle de bloqueio otimista
- Fornecer mecanismo de recuperação em caso de falha

**Template Inicial**:

```typescript
import { Map, List, Set } from 'immutable';

interface Record {
    id: string;
    fields: Map<string, any>;
    version: number;
    createdAt: number;
    deletedAt?: number;
}

interface Transaction {
    id: string;
    startTimestamp: number;
    commitTimestamp?: number;
    reads: Set<string>; // IDs de registros lidos
    writes: Map<string, Record>; // ID -> novo Record
    deletes: Set<string>; // IDs de registros excluídos
    status: 'active' | 'committed' | 'aborted';
}

class MVCCDatabase {
    private tables: Map<string, Map<string, List<Record>>>; // tableName -> (recordId -> versions)
    private transactions: Map<string, Transaction>; // txId -> Transaction
    private lastCommitTimestamp: number;
    
    constructor() {
        // Implementar
    }
    
    // Cria uma nova transação
    beginTransaction(): string {
        // Implementar
    }
    
    // Confirma uma transação
    commitTransaction(txId: string): boolean {
        // Implementar
    }
    
    // Aborta uma transação
    abortTransaction(txId: string): boolean {
        // Implementar
    }
    
    // Cria uma nova tabela
    createTable(tableName: string): boolean {
        // Implementar
    }
    
    // Insere um registro
    insert(txId: string, tableName: string, record: Record): boolean {
        // Implementar
    }
    
    // Atualiza um registro
    update(txId: string, tableName: string, id: string, fields: Map<string, any>): boolean {
        // Implementar
    }
    
    // Exclui um registro
    delete(txId: string, tableName: string, id: string): boolean {
        // Implementar
    }
    
    // Lê um registro na versão visível para a transação
    read(txId: string, tableName: string, id: string): Record | null {
        // Implementar
    }
    
    // Lê um registro em um ponto específico no tempo
    readAsOf(tableName: string, id: string, timestamp: number): Record | null {
        // Implementar
    }
    
    // Verifica se há conflitos de escrita
    private checkForConflicts(txId: string): boolean {
        // Implementar
    }
    
    // Obtém a versão visível de um registro para uma transação
    private getVisibleRecord(tableName: string, id: string, txId: string): Record | null {
        // Implementar
    }
}
```

## 🎯 Projeto Final: Design Document Store

**Objetivo**: Criar um banco de dados de documentos (similar ao MongoDB) que utiliza estruturas de dados persistentes para armazenamento eficiente e consultas através do tempo.

**Requisitos**:
- Documentos são objetos JSON armazenados em coleções
- As operações de inserção, atualização e exclusão mantém todas as versões
- Suporte para índices para busca rápida, inclusive em versões anteriores
- API para consultas temporais que permitem analisar os dados em qualquer ponto do tempo
- Implementação de algum nível de persistência em disco
- Interface básica para operações CRUD e consultas
- Suporte para transações multi-documento

**Template Inicial**:

```typescript
import { Map, List, Set } from 'immutable';

// Simplificação da estrutura. Em um projeto real, teríamos validações e tipos mais detalhados.
type DocumentId = string;
type Document = Map<string, any>;
type Timestamp = number;

class DocumentStore {
    private collections: Map<string, Map<DocumentId, List<[Document, Timestamp]>>>;
    private indexes: Map<string, Map<string, Map<any, Set<DocumentId>>>>;
    
    constructor() {
        // Implementar
    }
    
    // Cria uma nova coleção
    createCollection(name: string): boolean {
        // Implementar
    }
    
    // Insere um documento
    insertDocument(collection: string, doc: Document): DocumentId {
        // Implementar
    }
    
    // Atualiza um documento
    updateDocument(collection: string, id: DocumentId, updates: Document): boolean {
        // Implementar
    }
    
    // Remove um documento
    deleteDocument(collection: string, id: DocumentId): boolean {
        // Implementar
    }
    
    // Busca um documento pelo ID
    findById(collection: string, id: DocumentId, asOf?: Timestamp): Document | null {
        // Implementar
    }
    
    // Consulta documentos com filtros
    query(collection: string, filter: Document, asOf?: Timestamp): List<Document> {
        // Implementar
    }
    
    // Cria um índice em uma coleção
    createIndex(collection: string, field: string): boolean {
        // Implementar
    }
    
    // Inicia uma transação
    beginTransaction(): string {
        // Implementar
    }
    
    // Confirma uma transação
    commitTransaction(txId: string): boolean {
        // Implementar
    }
    
    // Aborta uma transação
    abortTransaction(txId: string): boolean {
        // Implementar
    }
    
    // Busca o histórico de um documento
    getDocumentHistory(collection: string, id: DocumentId): List<[Document, Timestamp]> {
        // Implementar
    }
    
    // Persiste os dados em disco
    persist(filePath: string): boolean {
        // Implementar
    }
    
    // Carrega dados do disco
    load(filePath: string): boolean {
        // Implementar
    }
}
```

## 📋 Critérios de Avaliação

Os exercícios serão avaliados com base nos seguintes critérios:

1. **Corretude**: A solução funciona conforme especificado?
2. **Eficiência**: São utilizadas estruturas de dados persistentes de forma otimizada?
3. **Legibilidade**: O código é claro e bem organizado?
4. **Robustez**: A solução lida com casos extremos e entradas inválidas?
5. **Testes**: Existem testes adequados que validam o comportamento esperado?

## 🔍 Recursos para Resolução

- Revise os conceitos de árvores persistentes, mapas persistentes e listas encadeadas persistentes
- Consulte a documentação do Immutable.js para implementações eficientes
- Utilize diagramas para visualizar as estruturas de dados complexas
- Implemente incrementalmente, testando cada componente antes de avançar

## 📥 Entrega

Para entregar a solução, crie um arquivo para cada exercício com a implementação completa. Inclua também:

1. Um arquivo README.md explicando sua abordagem
2. Testes unitários demonstrando o funcionamento correto
3. Análise de complexidade de tempo e espaço das operações principais
4. Quaisquer considerações adicionais sobre otimizações ou limitações

---

Bons estudos e boa programação! Lembre-se de que as estruturas de dados persistentes são ferramentas poderosas para problemas que envolvem controle de versão, concorrência e integridade de dados. 