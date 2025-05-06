# Algoritmos e Estrutura de Dados na Prática

## Módulo 5: Tabelas Hash e Funções Hash

### 7. Tabelas Hash vs Outras Estruturas: Análise Comparativa

Neste ponto da nossa jornada, já exploramos diversas estruturas de dados: listas encadeadas, pilhas, filas, árvores binárias de busca e, agora, tabelas hash. Cada uma dessas estruturas tem suas características próprias, vantagens e desvantagens. Vamos analisar como as tabelas hash se comparam com as outras estruturas que estudamos.

#### Tabela Comparativa: Complexidade de Operações

```
┌────────────────────┬──────────────┬────────────────┬──────────────┬──────────────┐
│ Estrutura de Dados │ Busca        │ Inserção       │ Remoção      │ Ordenado     │
├────────────────────┼──────────────┼────────────────┼──────────────┼──────────────┤
│ Array              │ O(n)         │ O(1) no final  │ O(n)         │ Não          │
│                    │              │ O(n) no início │              │              │
├────────────────────┼──────────────┼────────────────┼──────────────┼──────────────┤
│ Lista Encadeada    │ O(n)         │ O(1) início/fim│ O(1)* / O(n) │ Não          │
├────────────────────┼──────────────┼────────────────┼──────────────┼──────────────┤
│ Pilha              │ O(n)         │ O(1) no topo   │ O(1) no topo │ Não          │
├────────────────────┼──────────────┼────────────────┼──────────────┼──────────────┤
│ Fila               │ O(n)         │ O(1) no final  │ O(1) início  │ Não          │
├────────────────────┼──────────────┼────────────────┼──────────────┼──────────────┤
│ BST não balanceada │ O(n) pior    │ O(n) pior      │ O(n) pior    │ Sim          │
│                    │ O(log n) méd.│ O(log n) méd.  │ O(log n) méd.│              │
├────────────────────┼──────────────┼────────────────┼──────────────┼──────────────┤
│ BST balanceada     │ O(log n)     │ O(log n)       │ O(log n)     │ Sim          │
├────────────────────┼──────────────┼────────────────┼──────────────┼──────────────┤
│ Tabela Hash        │ O(1) médio   │ O(1) médio     │ O(1) médio   │ Não          │
│                    │ O(n) pior    │ O(n) pior      │ O(n) pior    │              │
└────────────────────┴──────────────┴────────────────┴──────────────┴──────────────┘
* Se tivermos referência direta ao nó
```

#### Comparação de Uso de Memória

```
┌────────────────────┬──────────────────────────────────┐
│ Estrutura de Dados │ Uso de Memória                   │
├────────────────────┼──────────────────────────────────┤
│ Array              │ Contíguo, eficiente, fixo        │
├────────────────────┼──────────────────────────────────┤
│ Lista Encadeada    │ Ponteiros extras, fragmentado    │
├────────────────────┼──────────────────────────────────┤
│ Pilha              │ Depende da implementação         │
├────────────────────┼──────────────────────────────────┤
│ Fila               │ Depende da implementação         │
├────────────────────┼──────────────────────────────────┤
│ BST                │ Ponteiros para filhos, balanceado│
├────────────────────┼──────────────────────────────────┤
│ Tabela Hash        │ Pode desperdiçar espaço,         │
│                    │ alto com fator de carga baixo    │
└────────────────────┴──────────────────────────────────┘
```

#### Quando Usar Cada Estrutura

##### Tabelas Hash
**Use quando:**
- Precisa de acesso rápido (O(1)) por chave
- Operações frequentes de busca, inserção e remoção
- Não precisa manter uma ordem específica
- Precisa implementar um dicionário ou mapa
- Deduplicação de elementos
- Cache de resultados

**Evite quando:**
- Precisa de dados ordenados
- Memória é extremamente limitada
- Iteração ordenada é frequente

##### Listas Encadeadas
**Use quando:**
- Tamanho da coleção é altamente variável
- Inserções/remoções frequentes no início
- Implementando outras estruturas (pilhas, filas)
- Memória fragmentada é uma preocupação

**Evite quando:**
- Precisa de acesso aleatório rápido
- Operações de busca são frequentes

##### Pilhas
**Use quando:**
- Precisa de processamento LIFO (último a entrar, primeiro a sair)
- Implementando recursão (implícita ou explícita)
- Desfazer/refazer operações
- Avaliação de expressões e parsing

**Evite quando:**
- Precisa acessar elementos no meio da estrutura
- Ordem de processamento é importante (não LIFO)

##### Filas
**Use quando:**
- Precisa de processamento FIFO (primeiro a entrar, primeiro a sair)
- Agendamento de tarefas
- Buffers
- BFS (busca em largura)

**Evite quando:**
- Precisa acessar elementos no meio da estrutura
- Processamento de pilha é mais adequado

##### Árvores Binárias de Busca
**Use quando:**
- Precisa manter dados ordenados
- Operações frequentes de busca, inserção, remoção
- Precisa encontrar mín/máx rapidamente
- Precisa de busca por intervalo

**Evite quando:**
- Chaves são altamente dinâmicas/aleatórias
- Tempo constante (O(1)) é crítico para todas operações

#### Visualização das Diferenças

```
Acesso a um Elemento:

Lista: [1] -> [2] -> [3] -> [4] -> [5] -> ... -> [n]
                                             ▲
                                             └── O(n) passos para acessar

Árvore:             [4]
                   /   \
                [2]     [6]
               /  \    /  \
             [1]  [3] [5] [7]
                                             ▲
                                             └── O(log n) passos para acessar

Hash:        hash("chave") = 3
       ┌───┬───┬───┬───┬───┬───┬───┐
       │   │   │   │[X]│   │   │   │
       └───┴───┴───┴───┴───┴───┴───┘
                     ▲
                     └── O(1) acesso direto
```

#### Casos de Uso Práticos

**Sistema de Login:**
- Tabela Hash: `{username → password_hash}` para autenticação rápida

**Navegação em Árvore de Diretórios:**
- Árvore: Estrutura hierárquica natural para pastas e arquivos

**Histórico de Navegador:**
- Pilha: Para implementar os botões de avançar/voltar

**Sistema de Impressão:**
- Fila: Para gerenciar trabalhos de impressão em ordem de chegada

**Sistema de Cache:**
- Tabela Hash: Para lookup rápido de recursos já carregados

#### Integrando Estruturas: Soluções Híbridas

Muitas vezes, as melhores soluções combinam diferentes estruturas:

**Tabela Hash + Lista Encadeada:**
- Usado em Encadeamento Separado para tratamento de colisões
- Implementação de LRU Cache (Least Recently Used)

**Tabela Hash + Árvore:**
- HashMaps com TreeMaps para colisões (Java LinkedHashMap)
- Índices em banco de dados (hash para localização rápida, árvore para range queries)

**Árvore + Fila:**
- Busca em Largura (BFS) em uma árvore ou grafo

#### Exemplos de Código: Usando a Estrutura Apropriada

```javascript
// Problema: Verificar se uma string tem caracteres únicos

// Solução com Array (O(n²))
function temCaracteresUnicosArray(str) {
    for (let i = 0; i < str.length; i++) {
        for (let j = i + 1; j < str.length; j++) {
            if (str[i] === str[j]) return false;
        }
    }
    return true;
}

// Solução com Tabela Hash (O(n))
function temCaracteresUnicosHash(str) {
    const chars = {};
    for (let char of str) {
        if (chars[char]) return false;
        chars[char] = true;
    }
    return true;
}

// Problema: Encontrar o n-ésimo número da sequência Fibonacci

// Solução com recursão (exponencial)
function fibRecursivo(n) {
    if (n <= 1) return n;
    return fibRecursivo(n - 1) + fibRecursivo(n - 2);
}

// Solução com programação dinâmica e cache hash (O(n))
function fibComCache(n, cache = {}) {
    if (n <= 1) return n;
    if (cache[n]) return cache[n];
    
    cache[n] = fibComCache(n - 1, cache) + fibComCache(n - 2, cache);
    return cache[n];
}
```

#### Benchmark Prático

Vamos ver um benchmark comparativo para busca em diferentes estruturas:

```javascript
// Função de benchmark
function benchmarkBusca(nome, funcBusca, repeticoes = 1000) {
    console.time(nome);
    for (let i = 0; i < repeticoes; i++) {
        funcBusca();
    }
    console.timeEnd(nome);
}

// Dados de teste
const tamanho = 10000;
const elementos = Array.from({length: tamanho}, (_, i) => i);
const elementosBusca = Array.from({length: 100}, () => Math.floor(Math.random() * tamanho));

// Estruturas
const array = [...elementos];
const hashMap = {};
elementos.forEach(e => hashMap[e] = e);

// Busca em array
benchmarkBusca("Busca em Array", () => {
    elementosBusca.forEach(e => array.includes(e));
});

// Busca em hash
benchmarkBusca("Busca em Hash", () => {
    elementosBusca.forEach(e => hashMap[e] !== undefined);
});

// Experimente implementar a busca em árvore binária e lista encadeada 
// para completar o benchmark
```

#### Dicas para Escolher a Estrutura Correta

1. **Entenda o problema:** Quais operações são críticas? Inserção, remoção, busca?
   
2. **Considere a frequência:** Quais operações são mais frequentes?
   
3. **Analise os padrões de acesso:** Aleatório, sequencial, LIFO, FIFO?
   
4. **Avalie restrições de memória:** Espaço é um fator crítico?
   
5. **Pense na ordenação:** Precisa manter os dados ordenados?

6. **Faça um teste prático:** Um pequeno benchmark pode revelar o melhor para seu caso

#### Exercício Prático: Escolhendo a Estrutura Ideal

Para cada cenário, determine qual estrutura de dados seria mais adequada:

1. Implementar um corretor ortográfico que precisa verificar rapidamente se uma palavra é válida
   
2. Rastrear o caminho mais curto em um mapa do metrô
   
3. Implementar o botão "Voltar" em um navegador web
   
4. Validar expressões matemáticas com parênteses balanceados
   
5. Implementar uma agenda telefônica que busca por nome
   
6. Manter uma lista de processos de um sistema operacional por prioridade

#### Conclusão

As tabelas hash oferecem uma vantagem significativa para operações de busca, inserção e remoção em tempo constante (na média). No entanto, não são uma solução universal - cada estrutura de dados tem seu lugar ideal.

A escolha da estrutura correta pode ser a diferença entre um sistema eficiente e um que falha sob carga. Compreender as características de cada estrutura é fundamental para desenvolver algoritmos eficientes e escaláveis.

Lembre-se da regra de ouro: não existe "melhor" estrutura de dados, apenas a estrutura mais adequada para o problema específico que você está resolvendo. 