# Algoritmos e Estrutura de Dados na Prática

## Módulo 7: Tópicos Avançados e Aplicações

### 3. Algoritmos de Compressão de Dados: Huffman Coding

A compressão de dados é uma área fundamental da ciência da computação que busca reduzir o tamanho dos dados sem perder informações essenciais. Nesta aula, exploraremos o **Algoritmo de Huffman**, uma técnica de compressão sem perdas que utiliza codificação de comprimento variável para representar caracteres de forma mais eficiente.

#### Conexão com Estruturas Anteriores

O algoritmo de Huffman integra diversos conceitos que já estudamos:
- Utiliza **árvores binárias** (Módulo 3) para representar a codificação
- Emprega uma **fila de prioridade** (Módulo 2) na construção da árvore
- Implementa aspectos de algoritmos **gulosos** (Módulo 6) ao selecionar os nós de menor frequência

#### Analogia: Sistema Postal Eficiente 📬

Imagine um serviço postal onde:
- Cartas para destinos frequentes recebem códigos postais curtos (ex: "1", "01")
- Destinos raramente visitados recebem códigos postais mais longos (ex: "00110101")
- Cada código é único e não pode ser confundido com outro (não ambíguo)

Esta é essencialmente a ideia por trás do algoritmo de Huffman:
- Caracteres frequentes recebem códigos binários curtos
- Caracteres raros recebem códigos binários mais longos
- Nenhum código é prefixo de outro (garantindo decodificação sem ambiguidade)

### Fundamentos da Compressão de Dados

Antes de mergulharmos nos detalhes do algoritmo de Huffman, vamos entender alguns conceitos básicos:

#### 1. Por que comprimir dados?

- **Economia de armazenamento**: Reduz o espaço necessário para armazenar dados
- **Economia de largura de banda**: Transmissão mais rápida através de redes
- **Otimização de recursos**: Carregamento mais rápido de dados em aplicações

#### 2. Tipos de compressão:

- **Sem perdas (lossless)**: Permite recuperar exatamente os dados originais
- **Com perdas (lossy)**: Descarta algumas informações para maior taxa de compressão

O algoritmo de Huffman é um método de compressão sem perdas.

#### 3. Codificação de comprimento fixo vs. variável:

- **Comprimento fixo**: Cada símbolo usa a mesma quantidade de bits (ex: ASCII - 8 bits por caractere)
- **Comprimento variável**: Símbolos diferentes podem usar quantidades diferentes de bits

### Algoritmo de Huffman: Conceito

O algoritmo de Huffman cria códigos de comprimento variável baseados na frequência de ocorrência dos símbolos no dados:

1. Determina a frequência de cada símbolo
2. Constrói uma árvore binária (árvore de Huffman) a partir dessas frequências
3. Atribui códigos binários a cada símbolo baseado em seu caminho na árvore

### Construção da Árvore de Huffman

A construção da árvore segue estes passos:

1. Para cada símbolo, crie um nó folha com o símbolo e sua frequência
2. Organize esses nós em uma fila de prioridade (min-heap)
3. Enquanto houver mais de um nó na fila:
   - Remova os dois nós com menor frequência
   - Crie um novo nó pai com frequência igual à soma das frequências dos filhos
   - Adicione os dois nós como filhos do novo nó (à esquerda e à direita)
   - Insira o novo nó pai na fila
4. O nó restante é a raiz da árvore de Huffman

#### Visualização do Processo

Exemplo com as frequências: a:5, b:2, c:1, d:3

```
Passo 1: Criar nós folha e ordenar por frequência
c:1  b:2  d:3  a:5

Passo 2: Remover os dois menores (c:1 e b:2) e criar novo nó
     [3]
    /   \
  c:1   b:2
  
  Fila: [3], d:3, a:5

Passo 3: Remover os dois menores ([3] e d:3) e criar novo nó
      [6]
     /   \
   [3]   d:3
  /   \
c:1   b:2

  Fila: [6], a:5

Passo 4: Remover os dois menores ([6] e a:5) e criar novo nó
       [11]
      /    \
    [6]    a:5
   /   \
 [3]   d:3
/   \
c:1 b:2

  Fila: [11]  (árvore finalizada)
```

Os códigos resultantes seriam:
- a: 1 (mais frequente, código mais curto)
- b: 001
- c: 000
- d: 01

### Atribuição de Códigos

Depois de construir a árvore:
- Percorra da raiz até cada folha
- Atribua '0' para cada ramificação à esquerda
- Atribua '1' para cada ramificação à direita
- O código de cada símbolo é a sequência de bits no caminho da raiz até o símbolo

### Implementação do Algoritmo de Huffman

Vamos implementar o algoritmo de Huffman em JavaScript:

```javascript
class HuffmanNode {
    constructor(symbol, frequency, left = null, right = null) {
        this.symbol = symbol;      // Símbolo (caractere)
        this.frequency = frequency; // Frequência de ocorrência
        this.left = left;          // Filho esquerdo
        this.right = right;        // Filho direito
        this.code = '';            // Código Huffman para este nó (usado nas folhas)
    }
    
    // Verificar se é um nó folha
    isLeaf() {
        return this.left === null && this.right === null;
    }
}

class HuffmanCoding {
    constructor() {
        this.root = null;
        this.codes = new Map(); // Mapa de símbolos para códigos
    }
    
    // Calcular frequência de cada caractere no texto
    calculateFrequency(text) {
        const frequency = new Map();
        
        for (const char of text) {
            if (!frequency.has(char)) {
                frequency.set(char, 0);
            }
            frequency.set(char, frequency.get(char) + 1);
        }
        
        return frequency;
    }
    
    // Construir a árvore de Huffman
    buildTree(text) {
        // Calcular frequência dos caracteres
        const frequency = this.calculateFrequency(text);
        
        // Criar nós folha para cada caractere
        const priorityQueue = [];
        for (const [symbol, freq] of frequency.entries()) {
            priorityQueue.push(new HuffmanNode(symbol, freq));
        }
        
        // Ordenar por frequência (simula uma fila de prioridade)
        priorityQueue.sort((a, b) => a.frequency - b.frequency);
        
        // Construir a árvore
        while (priorityQueue.length > 1) {
            // Remover os dois nós com menor frequência
            const left = priorityQueue.shift();
            const right = priorityQueue.shift();
            
            // Criar um novo nó interno com frequência combinada
            const sum = left.frequency + right.frequency;
            const newNode = new HuffmanNode(null, sum, left, right);
            
            // Adicionar o novo nó de volta à fila
            priorityQueue.push(newNode);
            
            // Reordenar a fila
            priorityQueue.sort((a, b) => a.frequency - b.frequency);
        }
        
        // O último nó é a raiz da árvore
        this.root = priorityQueue[0] || new HuffmanNode(null, 0);
        
        // Gerar códigos para cada símbolo
        this.generateCodes(this.root, '');
        
        return this.root;
    }
    
    // Gerar códigos Huffman para cada símbolo
    generateCodes(node, code) {
        if (node === null) return;
        
        // Se for um nó folha, armazenar o código
        if (node.isLeaf()) {
            node.code = code;
            this.codes.set(node.symbol, code);
            return;
        }
        
        // Recursivamente gerar códigos para subárvores
        this.generateCodes(node.left, code + '0');
        this.generateCodes(node.right, code + '1');
    }
    
    // Codificar um texto usando a árvore de Huffman
    encode(text) {
        if (!this.root) {
            this.buildTree(text);
        }
        
        let encodedText = '';
        for (const char of text) {
            encodedText += this.codes.get(char);
        }
        
        return encodedText;
    }
    
    // Decodificar texto comprimido usando a árvore de Huffman
    decode(encodedText) {
        if (!this.root || this.root.isLeaf()) {
            return this.root ? this.root.symbol.repeat(encodedText.length) : '';
        }
        
        let current = this.root;
        let decodedText = '';
        
        for (const bit of encodedText) {
            // Navegar para a esquerda (0) ou direita (1)
            current = bit === '0' ? current.left : current.right;
            
            // Se chegar a uma folha, adicionar o símbolo e voltar à raiz
            if (current.isLeaf()) {
                decodedText += current.symbol;
                current = this.root;
            }
        }
        
        return decodedText;
    }
    
    // Visualizar a árvore de Huffman (para fins didáticos)
    printTree() {
        const printNode = (node, prefix = '', isLeft = true) => {
            if (node === null) return;
            
            const nodeType = node.isLeaf() ? 'Folha' : 'Interno';
            const symbolStr = node.isLeaf() ? `'${node.symbol}'` : '';
            const codeStr = node.isLeaf() ? `(código: ${node.code})` : '';
            
            console.log(`${prefix}${isLeft ? '├── ' : '└── '}[${nodeType}] Freq: ${node.frequency} ${symbolStr} ${codeStr}`);
            
            // Imprimir subárvores
            printNode(node.left, prefix + (isLeft ? '│   ' : '    '), true);
            printNode(node.right, prefix + (isLeft ? '│   ' : '    '), false);
        };
        
        console.log('Árvore de Huffman:');
        printNode(this.root, '', false);
    }
    
    // Calcular taxa de compressão
    calculateCompressionRatio(originalText, encodedText) {
        const originalSize = originalText.length * 8; // Assumindo 8 bits por caractere no texto original
        const compressedSize = encodedText.length;
        
        return {
            originalSize,
            compressedSize,
            ratio: compressedSize / originalSize,
            percentage: (1 - compressedSize / originalSize) * 100
        };
    }
    
    // Obter a tabela de códigos
    getCodesTable() {
        return Object.fromEntries(this.codes);
    }
}

// Exemplo de uso
const huffman = new HuffmanCoding();
const text = "beabeefeab"; // Um exemplo simples com repetições

// Construir a árvore e codificar
const encodedText = huffman.encode(text);

console.log(`Texto original: "${text}"`);
console.log(`Texto codificado: ${encodedText}`);

// Decodificar para verificar
const decodedText = huffman.decode(encodedText);
console.log(`Texto decodificado: "${decodedText}"`);

// Mostrar tabela de códigos
console.log("\nTabela de códigos Huffman:");
console.table(huffman.getCodesTable());

// Mostrar estatísticas de compressão
const stats = huffman.calculateCompressionRatio(text, encodedText);
console.log("\nEstatísticas de compressão:");
console.log(`Tamanho original: ${stats.originalSize} bits`);
console.log(`Tamanho comprimido: ${stats.compressedSize} bits`);
console.log(`Taxa de compressão: ${stats.ratio.toFixed(2)}`);
console.log(`Economia de espaço: ${stats.percentage.toFixed(2)}%`);

// Visualizar a árvore
huffman.printTree();
```

### Análise de Complexidade

- **Tempo de construção da árvore**: O(n log n), onde n é o número de símbolos distintos
  - Cálculo de frequência: O(N), onde N é o tamanho do texto
  - Ordenação da fila de prioridade: O(n log n)
  - Construção da árvore: O(n log n)

- **Espaço**: O(n), onde n é o número de símbolos distintos

- **Tempo de codificação/decodificação**: 
  - Codificação: O(N), onde N é o tamanho do texto original
  - Decodificação: O(M), onde M é o tamanho do texto codificado

### Aplicações Práticas

O algoritmo de Huffman é usado em várias aplicações:

1. **Formatos de compressão**: Parte dos algoritmos usados em ZIP, GZIP, JPEG, MP3
2. **Transmissão de dados**: Redução do volume de dados em comunicações
3. **Armazenamento eficiente**: Otimização de espaço em bancos de dados e sistemas de arquivos
4. **Processamento de imagens**: Componente de vários algoritmos de compressão de imagem

### Limitações do Algoritmo de Huffman

1. **Conhecimento prévio**: Requer conhecer a frequência dos símbolos antecipadamente
2. **Overhead da árvore**: A estrutura da árvore precisa ser transmitida junto com os dados codificados
3. **Eficiência limitada**: Existem algoritmos mais modernos com taxas de compressão superiores

### Variações e Melhorias

1. **Huffman Adaptativo**: Constrói a árvore enquanto processa os dados, sem necessidade de duas passagens
2. **Huffman Canônico**: Uma representação padronizada que facilita a descompressão
3. **Huffman com Dicionário**: Usa um dicionário pré-calculado para símbolos comuns

### Exercícios Propostos

1. **Implementação Básica**: Implemente o algoritmo de Huffman para comprimir e descomprimir uma string.

2. **Compressão de Arquivo**: Modifique o código para ler um arquivo, comprimi-lo e salvar o resultado.

3. **Análise Comparativa**: Compare a taxa de compressão do algoritmo de Huffman com outros algoritmos (como o LZW) para diferentes tipos de dados.

4. **Huffman Adaptativo**: Implemente uma versão adaptativa do algoritmo que não requer duas passagens pelos dados.

5. **Visualização**: Crie uma visualização que mostre como a árvore de Huffman é construída passo a passo.

### Conclusão

O algoritmo de Huffman é um excelente exemplo de como princípios simples podem levar a soluções elegantes e eficientes em ciência da computação. Apesar de existirem métodos de compressão mais avançados hoje, Huffman continua sendo relevante e amplamente utilizado, seja diretamente ou como componente de algoritmos mais complexos.

A compreensão do algoritmo de Huffman também proporciona insights valiosos sobre:
- Árvores binárias e sua utilidade prática
- Filas de prioridade e sua aplicação
- Codificação de dados eficiente
- O equilíbrio entre frequência e comprimento de código

Na próxima aula, exploraremos algoritmos de geometria computacional, outra área fascinante com aplicações práticas significativas. 