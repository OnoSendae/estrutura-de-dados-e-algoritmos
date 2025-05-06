# Case Study: Otimização de um Algoritmo de Busca

## Contexto do Problema

Imagine que você está desenvolvendo um sistema de análise de texto para um mecanismo de busca, e precisa encontrar todas as ocorrências de palavras-chave em documentos longos. A implementação inicial utiliza uma abordagem simples, mas com o aumento do volume de dados, você percebe a necessidade de otimização.

## Algoritmo Inicial: Busca por Força Bruta

Vamos começar com a abordagem mais direta de busca de texto:

```javascript
function naiveSearch(text, pattern) {
    const occurrences = [];
    const n = text.length;
    const m = pattern.length;
    
    for (let i = 0; i <= n - m; i++) {
        let match = true;
        
        for (let j = 0; j < m; j++) {
            if (text[i + j] !== pattern[j]) {
                match = false;
                break;
            }
        }
        
        if (match) {
            occurrences.push(i);
        }
    }
    
    return occurrences;
}
```

### Análise de Complexidade Inicial

- **Tempo**: O(n × m) onde n é o comprimento do texto e m é o comprimento do padrão
- **Espaço**: O(k) onde k é o número de ocorrências encontradas
- **Problema**: Para textos longos e múltiplas buscas, este algoritmo torna-se ineficiente

## Processo de Otimização

Vamos seguir um processo sistemático para otimizar nosso algoritmo:

### 1. Identificar Gargalos

O principal gargalo é a verificação repetitiva de caracteres. Em casos como `"AAAAAAAAAAB"` com padrão `"AAAAB"`, verificamos os mesmos caracteres múltiplas vezes sem aproveitar informações prévias.

### 2. Escolher uma Estratégia de Otimização

Existem vários algoritmos avançados para busca de padrões em textos. Implementaremos o algoritmo Knuth-Morris-Pratt (KMP), que utiliza um pré-processamento do padrão para evitar comparações desnecessárias.

### 3. Implementar a Solução Otimizada

```javascript
function kmpSearch(text, pattern) {
    const occurrences = [];
    const n = text.length;
    const m = pattern.length;
    
    // Caso especial: padrão vazio
    if (m === 0) return [];
    
    // Pré-processamento: calcular a tabela de prefixos
    const lps = computeLPSArray(pattern);
    
    let i = 0; // índice para o texto
    let j = 0; // índice para o padrão
    
    while (i < n) {
        // Caracteres correspondentes
        if (pattern[j] === text[i]) {
            i++;
            j++;
        }
        
        // Encontrou uma ocorrência completa
        if (j === m) {
            occurrences.push(i - j);
            j = lps[j - 1]; // Usar a tabela LPS para recuar
        } 
        // Caracteres não correspondentes
        else if (i < n && pattern[j] !== text[i]) {
            if (j !== 0) {
                j = lps[j - 1]; // Recuar usando a tabela LPS
            } else {
                i++;
            }
        }
    }
    
    return occurrences;
}

// Função auxiliar para calcular a tabela de prefixos-sufixos
function computeLPSArray(pattern) {
    const m = pattern.length;
    const lps = new Array(m).fill(0);
    
    let len = 0;
    let i = 1;
    
    while (i < m) {
        if (pattern[i] === pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len !== 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
    
    return lps;
}
```

### 4. Análise da Solução Otimizada

- **Tempo**: O(n + m)
  - Pré-processamento do padrão: O(m)
  - Busca no texto: O(n)
- **Espaço**: O(m + k) 
  - Tabela LPS: O(m)
  - Lista de ocorrências: O(k)

### 5. Comparação e Benchmarking

Para entender o impacto da otimização, vamos comparar os dois algoritmos em diferentes cenários:

#### Caso 1: Texto Curto, Padrão Curto
- Texto: 100 caracteres, Padrão: 5 caracteres
- Algoritmo Força Bruta: ~480 comparações (pior caso)
- Algoritmo KMP: ~105 comparações (pior caso)
- **Ganho de desempenho**: ~4.5x

#### Caso 2: Texto Longo, Padrão Longo
- Texto: 1,000,000 caracteres, Padrão: 1,000 caracteres
- Algoritmo Força Bruta: ~1,000,000,000 comparações (pior caso)
- Algoritmo KMP: ~1,001,000 comparações (pior caso)
- **Ganho de desempenho**: ~1000x

#### Caso 3: Múltiplas Buscas
Para 100 buscas diferentes em um texto de 100,000 caracteres:
- Algoritmo Força Bruta: Tempo cresce linearmente com o número de buscas
- Algoritmo KMP: O pré-processamento é feito para cada padrão separadamente, mas ainda mantém vantagem significativa

## Lições Aprendidas

Esta otimização nos ensina vários pontos importantes:

1. **Identificação de operações redundantes**: O KMP evita repetir comparações já feitas.

2. **Importância do pré-processamento**: Investir tempo em pré-processamento (tabela LPS) pode economizar muito tempo na fase de busca.

3. **Trade-off entre complexidade e ganho**: O algoritmo KMP é mais complexo de implementar, mas o ganho de desempenho justifica essa complexidade para textos longos ou múltiplas buscas.

4. **Escolha contextual**: Para textos muito curtos, o algoritmo mais simples pode ser suficiente devido ao menor overhead.

## Estratégias Gerais para Otimização de Algoritmos

Baseado nesse estudo de caso, podemos extrair algumas estratégias gerais:

1. **Evite recalcular**: Armazene e reutilize resultados de cálculos quando possível.

2. **Use conhecimento adicional**: O KMP utiliza o conhecimento da estrutura do próprio padrão.

3. **Pré-processe quando apropriado**: Às vezes, um passo inicial de preparação dos dados pode economizar muito tempo posteriormente.

4. **Considere estruturas de dados especializadas**: Diferentes algoritmos podem se beneficiar de estruturas de dados específicas (como a tabela LPS no KMP).

5. **Analise os casos de uso reais**: A escolha do algoritmo deve considerar a distribuição típica dos dados em sua aplicação.
