# Visualizações para Exercícios do Módulo 4

## 🎬 Visualizações de Ordenação

### Visualização: Merge Sort na Ordenação de Ranking

```
Ordenação multicritério para ranking de jogadores:

Entrada: [jogadores não ordenados]
│
├─ Jogador A: {score: 1500, level: 25, winRate: 70%}
├─ Jogador B: {score: 1200, level: 30, winRate: 65%}
├─ Jogador C: {score: 1500, level: 20, winRate: 80%}
├─ Jogador D: {score: 1350, level: 25, winRate: 60%}
└─ Jogador E: {score: 1500, level: 25, winRate: 75%}

Processo de ordenação multicritério (level, winRate, score):

1. Começamos pelo critério menos importante (score):
   [B, D, A, C, E] ← ordenado por score
   
2. Depois pelo segundo critério (winRate):
   [D, B, A, E, C] ← ordenado por winRate mantendo estabilidade
   
3. Finalmente pelo critério mais importante (level):
   [C, A, E, D, B] ← ordenado por level mantendo estabilidade

Resultado final (ordem decrescente por level):
│
├─ Jogador B: {score: 1200, level: 30, winRate: 65%}
├─ Jogador A: {score: 1500, level: 25, winRate: 70%}
├─ Jogador E: {score: 1500, level: 25, winRate: 75%}
├─ Jogador D: {score: 1350, level: 25, winRate: 60%}
└─ Jogador C: {score: 1500, level: 20, winRate: 80%}
```

### Visualização: Ordenação Externa com K-Way Merge

```
Ordenação de logs usando merge externo:

1. Dividindo arquivo grande em chunks:
   ┌───────────────────────────────────┐
   │ Arquivo grande (> 1 GB)           │
   └─┬─────────┬──────────┬───────────┬┘
     │         │          │           │
   ┌─▼───┐  ┌─▼───┐   ┌─▼───┐    ┌─▼───┐
   │Chunk│  │Chunk│   │Chunk│    │Chunk│
   │  1  │  │  2  │   │  3  │    │  4  │
   └─────┘  └─────┘   └─────┘    └─────┘

2. Ordenando cada chunk na memória:
   [Chunk 1 ordenado] [Chunk 2 ordenado] [Chunk 3 ordenado] [Chunk 4 ordenado]

3. K-Way Merge usando Min-Heap:
   
   ┌────────────────────────┐
   │      Min-Heap          │
   │    ┌───┐               │
   │    │ A │               │
   │    └─┬─┘               │
   │    ┌─▼─┐    ┌───┐      │
   │    │ B │    │ C │      │
   │    └───┘    └───┘      │
   └────────────────────────┘
   
   Onde A, B, C são os menores elementos de cada chunk
   
   Iteração 1:
   - Extrair A (menor)
   - Adicionar próximo elemento do chunk de A à heap
   
   Iteração 2:
   - Extrair B (novo menor)
   - Adicionar próximo elemento do chunk de B à heap
   
   ... continua até todos os elementos serem processados
   
   ┌─────────────────────────────────────┐
   │ Arquivo final ordenado               │
   └─────────────────────────────────────┘
```

### Visualização: Radix Sort para Ordenação de Strings

```
Ordenação de strings alfanuméricas com Radix Sort:

Entrada: ["file10.txt", "file2.txt", "file1.txt", "file100.txt"]

Passo 1: Tokenização
   file10.txt  -> ["file", "10", ".txt"]
   file2.txt   -> ["file", "2", ".txt"]
   file1.txt   -> ["file", "1", ".txt"]
   file100.txt -> ["file", "100", ".txt"]

Passo 2: Conversão de tokens numéricos
   ["file", "10", ".txt"]  -> ["file", "000010", ".txt"]
   ["file", "2", ".txt"]   -> ["file", "000002", ".txt"]
   ["file", "1", ".txt"]   -> ["file", "000001", ".txt"]
   ["file", "100", ".txt"] -> ["file", "000100", ".txt"]

Passo 3: Recombinação para ordenação lexicográfica
   ["file", "000001", ".txt"] -> "file1.txt"
   ["file", "000002", ".txt"] -> "file2.txt"
   ["file", "000010", ".txt"] -> "file10.txt"
   ["file", "000100", ".txt"] -> "file100.txt"

Resultado final ordenado:
- file1.txt
- file2.txt
- file10.txt
- file100.txt
```

## 🔍 Visualizações de Busca

### Visualização: Sistema de Trie para Autocompletar

```
Estrutura de Trie para autocompletar:

                  (root)
                /   |   \
               p    c    a
              /     |     \
             r      a      l
            /       |       \
           o        s        g
          /         |       / \
         g          a      o   e
        /           |     /     \
       r            r    r       b
      /                         /
     a                         r
    /                         /
   m                         a
 /   \
a     i
|     |
r     n
      |
      g

Busca por prefixo "pro":

    (root) → p → r → o → [sugestões: program, programming]
    
Para cada nó, armazenamos um mapa de frequências:
- program: 120
- programming: 95

Retorno para getSuggestions("pro", 2):
1. program (freq: 120)
2. programming (freq: 95)
```

### Visualização: Busca de Código Duplicado com Rolling Hash

```
Detecção de código duplicado usando rolling hash (Rabin-Karp):

Código 1:
function calculateTotal(items) {
    let sum = 0;
    for (let i = 0; i < items.length; i++) {
        sum += items[i].price;
    }
    return sum;
}

Código 2:
function getCartTotal(cart) {
    let sum = 0;
    for (let i = 0; i < cart.length; i++) {
        sum += cart[i].price;
    }
    return sum;
}

Processo:
1. Tokenização
   Código 1: [FUNC, ID, PAREN, ID, PAREN, BRACE, VAR, ID, NUM, SEMICOLON, ...]
   Código 2: [FUNC, ID, PAREN, ID, PAREN, BRACE, VAR, ID, NUM, SEMICOLON, ...]

2. Cálculo de rolling hash para janelas de tamanho k=10:
   
   Código 1, janela 1:
   [FUNC, ID, PAREN, ID, PAREN, BRACE, VAR, ID, NUM, SEMICOLON]
   Hash: 27492

   Código 2, janela 1:
   [FUNC, ID, PAREN, ID, PAREN, BRACE, VAR, ID, NUM, SEMICOLON]
   Hash: 27492 (MATCH!)

3. Verificação de matches:
   ┌───────────────────────────────────────────────┐
   │ Duplicação encontrada:                        │
   │ let sum = 0;                                  │
   │ for (let i = 0; i < items.length; i++) {      │
   │     sum += items[i].price;                    │
   │ }                                             │
   │ return sum;                                   │
   └───────────────────────────────────────────────┘
```

## 🚀 Visualizações Avançadas

### Visualização: Comparação de Algoritmos de Join

```
Comparação visual de algoritmos de Join:

1. Nested Loop Join (O(n*m))
   ┌───────────────────────────────────────────────┐
   │ for cada linha em Tabela A:                   │
   │   for cada linha em Tabela B:                 │
   │     if join_condition:                        │
   │       adicionar ao resultado                  │
   └───────────────────────────────────────────────┘
   
   Ideal para: 
   - Tabelas pequenas
   - Índices não disponíveis
   - Condições complexas de join

2. Hash Join (O(n+m))
   ┌───────────────────────────────────────────────┐
   │ 1. Construir hash table da tabela menor       │
   │                                               │
   │ 2. Para cada linha da tabela maior:           │
   │    - Calcular hash da coluna de join          │
   │    - Buscar matches na hash table             │
   │    - Adicionar resultados encontrados         │
   └───────────────────────────────────────────────┘
   
   Ideal para:
   - Joins de igualdade
   - Tabelas de tamanhos diferentes
   - Memória suficiente para hash table

3. Sort-Merge Join (O(n log n + m log m))
   ┌───────────────────────────────────────────────┐
   │ 1. Ordenar ambas as tabelas pela coluna join  │
   │                                               │
   │ 2. Percorrer ambas as tabelas com 2 ponteiros │
   │    - Avançar o ponteiro da tabela com valor   │
   │      menor                                    │
   │    - Ao encontrar valores iguais, juntar      │
   │      todos os matches                         │
   └───────────────────────────────────────────────┘
   
   Ideal para:
   - Dados já ordenados
   - Tabelas de tamanho similar
   - Memória limitada
```

### Visualização: Sistema de Indexação com TF-IDF

```
Processo de indexação e busca de documentos:

1. Indexação de documentos
   
   Documento 1: "O algoritmo de ordenação quick sort é eficiente"
   Documento 2: "Merge sort tem complexidade O(n log n)"
   Documento 3: "Algoritmos de ordenação são essenciais para ciência de dados"
   
   Índice invertido:
   ┌──────────┬───────────────────────────────┐
   │ Termo    │ {doc_id: frequência}          │
   ├──────────┼───────────────────────────────┤
   │ algoritmo│ {1: 1, 3: 1}                  │
   │ ordenação│ {1: 1, 3: 1}                  │
   │ quick    │ {1: 1}                        │
   │ sort     │ {1: 1, 2: 1}                  │
   │ eficiente│ {1: 1}                        │
   │ merge    │ {2: 1}                        │
   │ ...      │ ...                           │
   └──────────┴───────────────────────────────┘

2. Cálculo de TF-IDF para query "algoritmos de ordenação"
   
   TF(algoritmo, doc1) = 1/7
   IDF(algoritmo) = log(3/2) = 0.176
   TF-IDF(algoritmo, doc1) = 0.025
   
   TF(ordenação, doc1) = 1/7
   IDF(ordenação) = log(3/2) = 0.176
   TF-IDF(ordenação, doc1) = 0.025
   
   Score(doc1) = 0.025 + 0.025 = 0.05
   
   ... [cálculos similares para docs 2 e 3]
   
   Ranking final:
   1. Documento 3: 0.08
   2. Documento 1: 0.05
   3. Documento 2: 0.02
```

## 📊 Visualizações de Otimizações

### Visualização: Cache-Aware Sorting

```
Otimização para cache (exemplo com Merge Sort):

Merge Sort tradicional vs. Cache-Aware:

1. Merge Sort tradicional
   ┌───────────────────────────────────────────────┐
   │ Divisão recursiva até tamanho 1               │
   │ [1,5,3,8,6,4,7,2]                             │
   │    /           \                              │
   │ [1,5,3,8]    [6,4,7,2]                        │
   │   /   \       /    \                          │
   │ [1,5] [3,8] [6,4] [7,2]                       │
   │  / \   / \   / \   / \                        │
   │ [1][5][3][8][6][4][7][2]                      │
   └───────────────────────────────────────────────┘

2. Cache-Aware Merge Sort
   ┌───────────────────────────────────────────────┐
   │ Divisão até tamanho de bloco de cache         │
   │ [1,5,3,8,6,4,7,2]                             │
   │    /           \                              │
   │ [1,5,3,8]    [6,4,7,2]                        │
   │                                               │
   │ Insertion Sort em cada bloco (fit em L1)      │
   │ [1,3,5,8]    [2,4,6,7]                        │
   │                                               │
   │ Merge final                                   │
   │ [1,2,3,4,5,6,7,8]                             │
   └───────────────────────────────────────────────┘

Padrão de acesso à memória:
- Cache miss: ❌
- Cache hit: ✅

Merge tradicional:
[❌,❌,❌,❌,❌,❌,❌,❌] → muitos cache misses durante recursão

Cache-Aware:
[❌,✅,✅,✅,❌,✅,✅,✅] → melhor utilização de cache
```

### Visualização: Ordenação Paralela e Distribuída

```
Ordenação distribuída em 4 workers:

Dados originais: [... 10 milhões de elementos ...]

1. Particionamento:
   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
   │Parte1│ │Parte2│ │Parte3│ │Parte4│
   └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘
      │        │        │        │
      ▼        ▼        ▼        ▼
   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
   │Worker│ │Worker│ │Worker│ │Worker│
   │  1   │ │  2   │ │  3   │ │  4   │
   └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘
      │        │        │        │
      ▼        ▼        ▼        ▼
   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
   │Parte1│ │Parte2│ │Parte3│ │Parte4│
   │sorted│ │sorted│ │sorted│ │sorted│
   └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘
      │        │        │        │
      └────────┼────────┼────────┘
               │        │
           ┌───▼────────▼───┐
           │  Merge Final   │
           └────────────────┘

Tempo com 1 worker: 100 segundos
Tempo com 4 workers: ~28 segundos (speedup ~3.6x)
``` 