

## Módulo 5: Tabelas Hash e Funções Hash

### 1. Tabelas Hash: Conceitos e Implementações

Uma tabela hash é como uma biblioteca onde cada livro tem seu lugar exato na prateleira. Imagine um sistema onde você pode encontrar qualquer livro em segundos, apenas sabendo seu nome. Isso é exatamente o que uma tabela hash faz com dados!

#### Analogia: A Biblioteca Mágica 📚

Pense em uma biblioteca com milhões de livros:
- **Método tradicional**: Percorrer prateleira por prateleira (busca linear - O(n))
- **Método organizado**: Usar o catálogo de fichas (busca binária - O(log n))
- **Método mágico**: Ter um sistema que te leva diretamente ao livro (hash table - O(1))

#### Visualização: Comparação de Métodos de Busca

```
Busca Linear em Lista:
[A]→[B]→[C]→[D]→[E]→[F]→[G]→...→[Z]
  ↑   ↑   ↑   ↑   ↑   ...percorrendo cada elemento

Busca Binária em Árvore:
          [M]
         /   \
      [G]     [T]
     /  \     /  \
   [C]  [J]  [P]  [X]
  ...escolhendo um caminho

Busca em Hash Table:
  hash("Maçã") = 3
  ┌───┬───────────────────┐
  │ 0 │                   │
  │ 1 │                   │
  │ 2 │                   │
  │ 3 │  "Maçã" → valor   │ ← acesso direto!
  │ 4 │                   │
  └───┴───────────────────┘
```

#### Conceitos Fundamentais:

**O que é uma Tabela Hash?**
- Uma estrutura de dados que mapeia chaves a valores
- Permite acesso rápido aos dados usando uma função matemática
- Também conhecida como "hash map" ou "dicionário"

**Componentes principais:**
1. **Array base**: onde os dados são armazenados
2. **Função hash**: converte chaves em índices
3. **Política de colisão**: resolve conflitos quando duas chaves geram o mesmo índice

#### Comparação com Estruturas Anteriores:

| Característica | Lista Encadeada | Árvore Binária | Tabela Hash |
|----------------|----------------|----------------|-------------|
| Acesso direto a elementos | Não | Não | Sim |
| Operações O(1) | Apenas inserção no início | Não | Busca, inserção e remoção |
| Ordenação | Pode ser ordenada | Naturalmente ordenada | Não ordenada |
| Uso de memória | Eficiente, apenas o necessário | Moderado | Pode desperdiçar espaço |
| Implementação | Simples | Moderada | Moderada |
| Lida bem com colisões | N/A | N/A | Requer estratégias específicas |

### Exemplo prático:

```javascript
// Exemplo 1: Implementação básica de uma tabela hash
class HashTable {
    constructor(size = 10) {
        this.size = size;
        this.table = new Array(size);
        this.count = 0;
    }
    
    // Função hash simples (método da divisão)
    hash(key) {
        // Converte a chave em um número se for string
        let hash = 0;
        if (typeof key === 'string') {
            for (let i = 0; i < key.length; i++) {
                hash += key.charCodeAt(i);
            }
        } else {
            hash = key;
        }
        return hash % this.size;
    }
    
    // Inserir um par chave-valor
    set(key, value) {
        const index = this.hash(key);
        
        // Tratamento básico de colisão: sobrescreve valor existente
        if (this.table[index] && this.table[index].key !== key) {
            console.log(`Colisão detectada para chave ${key}!`);
        }
        
        this.table[index] = { key, value };
        this.count++;
    }
    
    // Recuperar um valor pela chave
    get(key) {
        const index = this.hash(key);
        const item = this.table[index];
        return item ? item.value : undefined;
    }
    
    // Visualizar a tabela hash (representação ASCII)
    visualize() {
        console.log("┌─────────┬─────────────────────┐");
        console.log("│ Índice  │ Conteúdo            │");
        console.log("├─────────┼─────────────────────┤");
        
        for (let i = 0; i < this.size; i++) {
            const content = this.table[i] 
                ? `${this.table[i].key}: ${this.table[i].value}` 
                : "vazio";
            console.log(`│ ${i.toString().padStart(7)} │ ${content.padEnd(19)} │`);
        }
        
        console.log("└─────────┴─────────────────────┘");
    }
}

// Usando a tabela hash
const agenda = new HashTable(5);
agenda.set("Maria", "555-1234");
agenda.set("João", "555-5678");
agenda.set("Ana", "555-9012");

console.log(agenda.get("Maria")); // "555-1234"
console.log(agenda.get("Pedro")); // undefined

// Visualizando a tabela
agenda.visualize();
```

### Casos de Uso Reais:

1. **Dicionários de Linguagens**: Implementação de objetos/dicionários em linguagens como JavaScript e Python.

2. **Cache de Resultados**: Armazenar resultados de consultas ou cálculos pesados:
```javascript
const cacheResultados = new HashTable(100);

function calculoComplexo(x, y) {
    const chave = `${x}-${y}`;
    
    // Verifica se já calculamos isso antes
    if (cacheResultados.get(chave)) {
        console.log("Resultado obtido do cache!");
        return cacheResultados.get(chave);
    }
    
    // Simulação de cálculo pesado
    console.log("Calculando...");
    const resultado = Math.pow(x, y) / (x + y); // apenas um exemplo
    
    // Armazenar para uso futuro
    cacheResultados.set(chave, resultado);
    return resultado;
}
```

3. **Índices de Banco de Dados**: Acelerar buscas em tabelas.

4. **Detecção de Duplicatas**: Verificar rapidamente se um elemento já foi processado.

### Exercício Prático 1: Construa sua própria agenda 📞

Implemente uma agenda telefônica usando a classe HashTable acima:

```javascript
// Complete este código
const minhaAgenda = new HashTable(10);

// Adicione 5 contatos diferentes
// TODO: adicionar contatos

// Teste a recuperação de um contato
// TODO: buscar um contato

// Tente adicionar um contato que cause colisão
// Dica: use nomes que gerem o mesmo hash
// TODO: provocar colisão
```

### Anatomia de uma Operação Hash:

```javascript
// Visualização passo a passo de uma inserção
function visualizeInsertion(hashTable, key, value) {
    console.log(`\n=== Inserindo ${key}: ${value} ===`);
    
    // Passo 1: Calcular hash
    const hashValue = hashTable.hash(key);
    console.log(`1. Hash(${key}) = ${hashValue}`);
    
    // Passo 2: Determinar índice
    const index = hashValue % hashTable.size;
    console.log(`2. Índice = ${hashValue} % ${hashTable.size} = ${index}`);
    
    // Passo 3: Verificar disponibilidade
    if (hashTable.table[index]) {
        console.log(`3. Posição ${index} ocupada! (Colisão)`);
    } else {
        console.log(`3. Posição ${index} livre!`);
    }
    
    // Passo 4: Inserir
    hashTable.set(key, value);
    console.log(`4. Item inserido na posição ${index}`);
    
    // Visualização
    console.log("\nEstado da tabela após inserção:");
    hashTable.visualize();
}

// Teste a visualização
const demo = new HashTable(5);
visualizeInsertion(demo, "gato", "miau");
visualizeInsertion(demo, "cão", "au au");
```

### Análise de Complexidade:

| Operação | Complexidade Média | Complexidade Pior Caso |
|----------|-------------------|------------------------|
| Inserção | O(1)             | O(n)                   |
| Busca    | O(1)             | O(n)                   |
| Remoção  | O(1)             | O(n)                   |

**🤔 Pergunta para reflexão**: Por que o pior caso é O(n)?

**Resposta**: O pior caso ocorre quando todas as chaves colidem no mesmo índice, resultando em uma estrutura semelhante a uma lista encadeada não balanceada, onde precisamos percorrer todos os elementos para encontrar o desejado.

```
Pior caso (muitas colisões no mesmo índice):

┌─────────┬───────────────────────────────────────────┐
│ Índice  │ Conteúdo                                  │
├─────────┼───────────────────────────────────────────┤
│ 0       │ [key1:val1] → [key2:val2] → ... → [keyN:valN] │
│ 1       │ vazio                                     │
│ 2       │ vazio                                     │
│ ...     │ ...                                       │
└─────────┴───────────────────────────────────────────┘
```

### Exercício Prático 2: Analisando Performance

```javascript
// Compare diferentes tamanhos de tabela hash
function compareSizes() {
    const sizes = [10, 100, 1000];
    const itemCount = 1000;
    
    sizes.forEach(size => {
        const table = new HashTable(size);
        let collisions = 0;
        let startTime = performance.now();
        
        // Inserir dados
        for (let i = 0; i < itemCount; i++) {
            const key = `key${i}`;
            const originalConsoleLog = console.log;
            console.log = (msg) => {
                if (msg.includes('Colisão')) collisions++;
            };
            table.set(key, i);
            console.log = originalConsoleLog;
        }
        
        let endTime = performance.now();
        console.log(`Tamanho ${size}: ${endTime - startTime}ms, ${collisions} colisões`);
    });
}

// Execute e observe os resultados
compareSizes();
```

### Analogia: Hash como Sistema de Arquivos 🗄️

Imagine um escritório com um sistema de arquivamento:
- **Sem organização**: Documentos empilhados aleatoriamente (Array sem ordem)
- **Alfabético**: Documentos ordenados por nome (Array ordenado)
- **Por gavetas numeradas**: Cada documento vai para uma gaveta específica baseada em uma regra (Hash Table)

```javascript
// Analogia em código
class OfficeFileSystem {
    constructor() {
        this.drawers = new Array(26); // 26 gavetas (A-Z)
    }
    
    // Função hash baseada na primeira letra
    getDrawerNumber(fileName) {
        return fileName.charAt(0).toUpperCase().charCodeAt(0) - 65;
    }
    
    file(fileName, content) {
        const drawer = this.getDrawerNumber(fileName);
        if (!this.drawers[drawer]) {
            this.drawers[drawer] = [];
        }
        this.drawers[drawer].push({ fileName, content });
    }
    
    find(fileName) {
        const drawer = this.getDrawerNumber(fileName);
        const documents = this.drawers[drawer] || [];
        return documents.find(doc => doc.fileName === fileName);
    }
    
    // Visualizar o sistema de arquivos
    visualize() {
        console.log("┌─────────┬───────────────────────────────┐");
        console.log("│ Gaveta  │ Documentos                    │");
        console.log("├─────────┼───────────────────────────────┤");
        
        for (let i = 0; i < 26; i++) {
            const letter = String.fromCharCode(65 + i);
            const files = this.drawers[i] || [];
            const fileNames = files.length ? files.map(f => f.fileName).join(", ") : "vazia";
            console.log(`│    ${letter}    │ ${fileNames.substring(0, 30).padEnd(30)} │`);
        }
        
        console.log("└─────────┴───────────────────────────────┘");
    }
}

// Usando o sistema de arquivos
const office = new OfficeFileSystem();
office.file("Contract_2024.pdf", "Contrato...");
office.file("Report_Annual.docx", "Relatório...");
office.file("Contract_2023.pdf", "Contrato antigo...");
console.log(office.find("Contract_2024.pdf"));
office.visualize();
```

### Exercício Prático 3: Sistema de Cache

Implemente um sistema de cache usando tabela hash:

```javascript
// Cache para armazenar resultados de cálculos caros
class CalculationCache {
    constructor(size = 100) {
        // TODO: implementar usando HashTable
    }
    
    // Armazena ou recupera resultado do cache
    getOrCalculate(x, y, operation) {
        // TODO: verificar se resultado está em cache
        // TODO: se não estiver, calcular e armazenar
        // TODO: retornar resultado
    }
}

// Teste o cache
const cache = new CalculationCache();
console.time("Primeiro cálculo");
console.log(cache.getOrCalculate(1000, 2000, (a, b) => {
    // Simula cálculo pesado
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
        result += Math.sqrt(a + b);
    }
    return result;
}));
console.timeEnd("Primeiro cálculo");
```

### Resumo da Aula:

**Três pontos-chave:**
1. Tabelas hash transformam chaves em índices para acesso O(1)
2. A função hash é crucial para distribuir dados uniformemente
3. Colisões são inevitáveis e precisam ser tratadas

**Pergunta de verificação:**
Em que situações você usaria uma tabela hash em vez de um array ou lista?

**Próxima aula:** Funções Hash - como criar a fórmula mágica que distribui dados perfeitamente!
