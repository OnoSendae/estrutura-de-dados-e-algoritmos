

## Módulo 5: Tabelas Hash e Funções Hash

### 3. Tratamento de Colisões: Encadeamento Separado e Endereçamento Aberto

Colisões são como dois carros querendo estacionar na mesma vaga - inevitáveis quando temos muitos dados e espaço limitado. Vamos aprender estratégias para resolver esses conflitos de forma elegante!

#### Analogia: Estacionamento Inteligente 🚗

Imagine um estacionamento com vagas numeradas:
- **Colisão**: Dois carros querem a mesma vaga
- **Encadeamento**: Criar uma fila de carros na vaga
- **Endereçamento Aberto**: Procurar outra vaga disponível

#### Comparação Visual dos Métodos de Tratamento de Colisões

```
1. Sem tratamento (colisão não resolvida):
┌─────┬───────────────────┐
│  0  │                   │
├─────┼───────────────────┤
│  1  │                   │
├─────┼───────────────────┤
│  2  │  "a" sobrescreve  │  ← "a" e "b" colidem, "b" é perdido!
│     │    └───────┘      │
├─────┼───────────────────┤
│  3  │                   │
└─────┴───────────────────┘

2. Encadeamento Separado:
┌─────┬───────────────────────────────┐
│  0  │                               │
├─────┼───────────────────────────────┤
│  1  │                               │
├─────┼───────────────────────────────┤
│  2  │  ["a"]─→["b"]─→["c"]          │  ← Vários itens na mesma posição
│     │                               │
├─────┼───────────────────────────────┤
│  3  │                               │
└─────┴───────────────────────────────┘

3. Endereçamento Aberto (Linear Probing):
┌─────┬───────────────────┐
│  0  │                   │
├─────┼───────────────────┤
│  1  │                   │
├─────┼───────────────────┤
│  2  │ "a" (posição hash)│  ← "a" fica na posição original
├─────┼───────────────────┤
│  3  │ "b" (movido +1)   │  ← "b" colidiu com "a", então move +1
├─────┼───────────────────┤
│  4  │ "c" (movido +2)   │  ← "c" colidiu com "a", então move +2
└─────┴───────────────────┘
```

#### O que são Colisões?

```javascript
// Demonstração de colisão
function demonstrateCollision() {
    const tableSize = 10;
    
    // Função hash simples
    const hash = (key) => {
        let sum = 0;
        for(let char of key) {
            sum += char.charCodeAt(0);
        }
        return sum % tableSize;
    };
    
    // Chaves que colidem
    const keys = ["listen", "silent", "enlist"];
    
    console.log("Demonstração de Colisão:");
    keys.forEach(key => {
        const index = hash(key);
        console.log(`${key} → hash: ${index}`);
    });
    
    // Todas vão para o mesmo índice!
}

demonstrateCollision();
```

### 1. Encadeamento Separado (Chaining)

```javascript
class HashTableWithChaining {
    constructor(size = 10) {
        this.size = size;
        this.table = new Array(size);
        this.count = 0;
        
        // Inicializa cada posição com uma lista vazia
        for(let i = 0; i < size; i++) {
            this.table[i] = [];
        }
    }
    
    hash(key) {
        let hash = 0;
        for(let i = 0; i < key.length; i++) {
            hash += key.charCodeAt(i);
        }
        return hash % this.size;
    }
    
    set(key, value) {
        const index = this.hash(key);
        const chain = this.table[index];
        
        // Procura se a chave já existe
        for(let i = 0; i < chain.length; i++) {
            if(chain[i].key === key) {
                chain[i].value = value;
                return;
            }
        }
        
        // Se não existe, adiciona à cadeia
        chain.push({ key, value });
        this.count++;
        
        console.log(`Adicionado: ${key} na posição ${index} (tamanho da cadeia: ${chain.length})`);
    }
    
    get(key) {
        const index = this.hash(key);
        const chain = this.table[index];
        
        for(let item of chain) {
            if(item.key === key) {
                return item.value;
            }
        }
        return undefined;
    }
    
    // Visualização da tabela
    visualize() {
        console.log("\n=== Visualização da Tabela Hash ===");
        for(let i = 0; i < this.size; i++) {
            const chain = this.table[i];
            const chainDisplay = chain.length > 0 
                ? chain.map(item => `[${item.key}:${item.value}]`).join('→')
                : 'vazio';
            console.log(`Índice ${i}: ${chainDisplay}`);
        }
    }
}

// Testando encadeamento
const chainingHash = new HashTableWithChaining(5);
chainingHash.set("apple", "maçã");
chainingHash.set("banana", "banana");
chainingHash.set("grape", "uva");
chainingHash.set("melon", "melão");  // Pode colidir!
chainingHash.visualize();
```

### 2. Endereçamento Aberto

#### 2.1. Linear Probing

```javascript
class HashTableLinearProbing {
    constructor(size = 10) {
        this.size = size;
        this.keys = new Array(size).fill(null);
        this.values = new Array(size).fill(null);
        this.count = 0;
    }
    
    hash(key) {
        let hash = 0;
        for(let i = 0; i < key.length; i++) {
            hash += key.charCodeAt(i);
        }
        return hash % this.size;
    }
    
    set(key, value) {
        if(this.count >= this.size * 0.75) {
            console.log("Tabela muito cheia, redimensionamento necessário!");
            return false;
        }
        
        let index = this.hash(key);
        let probes = 0;
        
        // Linear probing: procura próxima posição livre
        while(this.keys[index] !== null && this.keys[index] !== key) {
            index = (index + 1) % this.size;
            probes++;
            
            if(probes >= this.size) {
                console.log("Tabela cheia!");
                return false;
            }
        }
        
        // Se a chave não existia, incrementa contador
        if(this.keys[index] === null) {
            this.count++;
        }
        
        this.keys[index] = key;
        this.values[index] = value;
        
        console.log(`${key} inserido na posição ${index} (${probes} probes)`);
        return true;
    }
    
    get(key) {
        let index = this.hash(key);
        let probes = 0;
        
        while(this.keys[index] !== null && probes < this.size) {
            if(this.keys[index] === key) {
                return this.values[index];
            }
            index = (index + 1) % this.size;
            probes++;
        }
        
        return undefined;
    }
    
    visualize() {
        console.log("\n=== Visualização da Tabela Hash (Linear Probing) ===");
        for(let i = 0; i < this.size; i++) {
            let cellContent = this.keys[i] ? `[${this.keys[i]}:${this.values[i]}]` : "□";
            
            // Mostra o hash original se a chave não estiver em sua posição hash
            if(this.keys[i]) {
                const originalPosition = this.hash(this.keys[i]);
                if(originalPosition !== i) {
                    cellContent += ` (movido de ${originalPosition})`;
                }
            }
            
            console.log(`Índice ${i}: ${cellContent}`);
        }
    }
}

// Testando linear probing
const linearProbingHash = new HashTableLinearProbing(10);
linearProbingHash.set("cat", "gato");
linearProbingHash.set("act", "ato");  // Provoca colisão com cat!
linearProbingHash.set("tap", "torneira");
linearProbingHash.visualize();
```

#### 2.2. Quadratic Probing

Uma variação do endereçamento aberto que reduz o agrupamento de colisões:

```javascript
class HashTableQuadraticProbing {
    constructor(size = 10) {
        this.size = size;
        this.keys = new Array(size).fill(null);
        this.values = new Array(size).fill(null);
        this.count = 0;
    }
    
    hash(key) {
        let hash = 0;
        for(let i = 0; i < key.length; i++) {
            hash += key.charCodeAt(i);
        }
        return hash % this.size;
    }
    
    set(key, value) {
        if(this.count >= this.size * 0.5) {  // Limite menor para quadratic probing
            console.log("Tabela muito cheia, redimensionamento necessário!");
            return false;
        }
        
        let index = this.hash(key);
        let i = 0;  // Contador para quadratic probing
        
        // fórmula: (hash(key) + i² + i) % size
        while(this.keys[index] !== null && this.keys[index] !== key) {
            i++;
            index = (this.hash(key) + i*i + i) % this.size;
            
            if(i >= this.size) {
                console.log("Tabela cheia ou ciclo de colisões!");
                return false;
            }
        }
        
        // Se a chave não existia, incrementa contador
        if(this.keys[index] === null) {
            this.count++;
        }
        
        this.keys[index] = key;
        this.values[index] = value;
        
        console.log(`${key} inserido na posição ${index} (salto: ${i})`);
        return true;
    }
    
    get(key) {
        let index = this.hash(key);
        let i = 0;
        
        while(this.keys[index] !== null && i < this.size) {
            if(this.keys[index] === key) {
                return this.values[index];
            }
            i++;
            index = (this.hash(key) + i*i + i) % this.size;
        }
        
        return undefined;
    }
    
    visualize() {
        console.log("\n=== Visualização da Tabela Hash (Quadratic Probing) ===");
        for(let i = 0; i < this.size; i++) {
            console.log(`Índice ${i}: ${this.keys[i] ? `[${this.keys[i]}:${this.values[i]}]` : "□"}`);
        }
    }
}

// Testando quadratic probing
const quadraticHash = new HashTableQuadraticProbing(10);
quadraticHash.set("cat", "gato");
quadraticHash.set("act", "ato");  // Colisão!
quadraticHash.set("tac", "taco"); // Outra colisão!
quadraticHash.visualize();
```

### Comparação dos Métodos de Tratamento de Colisões

| Característica | Encadeamento Separado | Linear Probing | Quadratic Probing |
|----------------|----------------------|----------------|-------------------|
| **Facilidade de implementação** | Alta | Média | Média |
| **Uso de memória adicional** | Maior (listas) | Nenhum | Nenhum |
| **Comportamento com tabela cheia** | Suporta bem | Degrada rapidamente | Melhor que linear |
| **Localidade de cache** | Baixa | Alta | Média |
| **Sensibilidade à função hash** | Baixa | Alta | Média |
| **Eficiência na busca** | O(1+α) | O(1) quando não cheio | O(1) quando não cheio |
| **Agrupamento primário** | Não afetado | Alto | Baixo |

*α = fator de carga (n/m)*

#### Visualização Comparativa

```
Linear Probing - Agrupamento Primário:
┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐
│ 0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │ 9 │
└───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘
  ↑   ↑   ↑   ↑   ↑
 [A] [B] [C] [D] [E]   ← Elementos se agrupam sequencialmente
  
Quadratic Probing - Redução de Agrupamento:
┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐
│ 0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │ 9 │
└───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘
  ↑       ↑           ↑       ↑
 [A]     [B]         [C]     [D]   ← Elementos mais distribuídos

Encadeamento - Sem Agrupamento:
┌───┬───┬───┬───┬───┐
│ 0 │ 1 │ 2 │ 3 │ 4 │
└─┬─┴───┴─┬─┴─┬─┴───┘
  │       │   │
 [A]     [B] [D]
  │       │
 [C]     [E]   ← Elementos organizados em listas
```

### Exercício Prático: Implementar um Sistema de Cache com Endereçamento Aberto

```javascript
// Sistema de cache usando endereçamento aberto
class CacheSystem {
    constructor(size = 16) {
        // TODO: implementar usando endereçamento aberto
        // 1. Inicialize arrays para chaves, valores e timestamps
        // 2. Implemente métodos put e get
        // 3. Implemente política de despejar o menos usado recentemente
    }
    
    // Inserir na cache
    put(key, value) {
        // TODO: implementar
    }
    
    // Recuperar da cache
    get(key) {
        // TODO: implementar
    }
    
    // Visualizar estado da cache
    visualize() {
        // TODO: implementar
    }
}

// Teste o sistema
const cache = new CacheSystem(8);
// TODO: Adicione itens e teste colisões
```

### Questões para Reflexão

1. Em quais cenários o encadeamento separado é preferível ao endereçamento aberto?

2. Como a escolha da função hash influencia o comportamento das colisões?

3. Qual é o impacto do fator de carga na eficiência de cada método de tratamento de colisões?
