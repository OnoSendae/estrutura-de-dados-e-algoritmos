/**
 * SortedSet - Implementação de um conjunto ordenado usando Lista Skip
 * 
 * Esta classe implementa um conjunto ordenado (elementos únicos em ordem)
 * que suporta inserção, remoção e pesquisa em O(log n) tempo médio.
 * 
 * Casos de uso comuns:
 * - Manter uma coleção ordenada de elementos únicos
 * - Busca eficiente por intervalo
 * - Encontrar elemento mais próximo de um valor
 * - Scoreboard (ranking)
 */

class SkipNode {
    constructor(value, level) {
        this.value = value;
        this.forward = new Array(level + 1).fill(null);
    }
}

class SortedSet {
    constructor(maxLevel = 16, p = 0.5) {
        // Nível máximo da lista skip (log₂n para n elementos é um bom valor)
        this.maxLevel = maxLevel;
        
        // Probabilidade de um nó subir para o próximo nível
        this.p = p;
        
        // Nível atual da lista
        this.level = 0;
        
        // Nó cabeça (sentinela)
        this.header = new SkipNode(null, maxLevel);
        
        // Número de elementos no conjunto
        this.size = 0;
    }

    // Gera um nível aleatório para um novo nó baseado na probabilidade p
    randomLevel() {
        let level = 0;
        while (Math.random() < this.p && level < this.maxLevel) {
            level++;
        }
        return level;
    }

    // Adiciona um valor ao conjunto (se não existir)
    add(value) {
        // Array para armazenar os nós predecessores em cada nível
        const update = new Array(this.maxLevel + 1).fill(null);
        let current = this.header;
        
        // Começando pelo nível mais alto, procuramos a posição de inserção
        // armazenando os predecessores em cada nível
        for (let i = this.level; i >= 0; i--) {
            while (current.forward[i] !== null && current.forward[i].value < value) {
                current = current.forward[i];
            }
            update[i] = current;
        }
        
        // Agora current.forward[0] aponta para o primeiro nó >= value ou null
        current = current.forward[0];
        
        // Se o valor já existe, não inserimos (é um conjunto)
        if (current !== null && current.value === value) {
            return false;
        }
        
        // O valor não existe, vamos inserir
        
        // Gera um nível aleatório para o novo nó
        const newLevel = this.randomLevel();
        
        // Se o novo nível é maior que o nível atual da lista
        if (newLevel > this.level) {
            for (let i = this.level + 1; i <= newLevel; i++) {
                update[i] = this.header;
            }
            this.level = newLevel;
        }
        
        // Cria o novo nó
        const newNode = new SkipNode(value, newLevel);
        
        // Insere o nó em todos os níveis até newLevel
        for (let i = 0; i <= newLevel; i++) {
            newNode.forward[i] = update[i].forward[i];
            update[i].forward[i] = newNode;
        }
        
        this.size++;
        return true;
    }

    // Remove um valor do conjunto (se existir)
    remove(value) {
        const update = new Array(this.maxLevel + 1).fill(null);
        let current = this.header;
        
        // Similar ao método add, encontra os predecessores
        for (let i = this.level; i >= 0; i--) {
            while (current.forward[i] !== null && current.forward[i].value < value) {
                current = current.forward[i];
            }
            update[i] = current;
        }
        
        current = current.forward[0];
        
        // Se o valor não existe, não faz nada
        if (current === null || current.value !== value) {
            return false;
        }
        
        // O valor existe, vamos removê-lo
        
        // Atualiza os ponteiros para pular o nó removido
        for (let i = 0; i <= this.level; i++) {
            if (update[i].forward[i] !== current) {
                break;
            }
            update[i].forward[i] = current.forward[i];
        }
        
        // Ajusta o nível da lista se necessário
        while (this.level > 0 && this.header.forward[this.level] === null) {
            this.level--;
        }
        
        this.size--;
        return true;
    }

    // Verifica se um valor existe no conjunto
    has(value) {
        let current = this.header;
        
        // Busca rápida começando do nível mais alto
        for (let i = this.level; i >= 0; i--) {
            while (current.forward[i] !== null && current.forward[i].value < value) {
                current = current.forward[i];
            }
        }
        
        current = current.forward[0];
        
        // Verifica se encontramos o valor
        return current !== null && current.value === value;
    }

    // Retorna todos os elementos em um intervalo [min, max] inclusive
    range(min, max) {
        const result = [];
        let current = this.header;
        
        // Busca o primeiro valor >= min
        for (let i = this.level; i >= 0; i--) {
            while (current.forward[i] !== null && current.forward[i].value < min) {
                current = current.forward[i];
            }
        }
        
        // Avança para o primeiro elemento que pode estar no intervalo
        current = current.forward[0];
        
        // Coleta todos os elementos até max
        while (current !== null && current.value <= max) {
            result.push(current.value);
            current = current.forward[0];
        }
        
        return result;
    }

    // Encontra o elemento mais próximo (igual ou maior) a um valor
    ceiling(value) {
        let current = this.header;
        
        // Busca similar
        for (let i = this.level; i >= 0; i--) {
            while (current.forward[i] !== null && current.forward[i].value < value) {
                current = current.forward[i];
            }
        }
        
        current = current.forward[0];
        
        // Retorna o elemento encontrado (se houver)
        return current !== null ? current.value : null;
    }

    // Encontra o elemento mais próximo (igual ou menor) a um valor
    floor(value) {
        let current = this.header;
        let result = null;
        
        for (let i = this.level; i >= 0; i--) {
            while (current.forward[i] !== null && current.forward[i].value <= value) {
                current = current.forward[i];
                // Se encontramos um valor igual, podemos retornar imediatamente
                if (current.value === value) {
                    return value;
                }
                // Armazena o último valor que vimos (será o floor)
                result = current.value;
            }
        }
        
        return result;
    }

    // Retorna o primeiro elemento do conjunto
    first() {
        return this.header.forward[0] !== null ? this.header.forward[0].value : null;
    }

    // Retorna o último elemento do conjunto
    last() {
        let current = this.header;
        let i = this.level;
        
        // Primeiro descemos para o nível 0 usando atalhos
        while (i >= 0) {
            while (current.forward[i] !== null) {
                current = current.forward[i];
            }
            i--;
        }
        
        // Se atual não é o cabeçalho, retorna seu valor
        return current !== this.header ? current.value : null;
    }

    // Retorna o número de elementos no conjunto
    getSize() {
        return this.size;
    }

    // Verifica se o conjunto está vazio
    isEmpty() {
        return this.size === 0;
    }

    // Retorna todos os elementos como um array ordenado
    toArray() {
        const result = [];
        let current = this.header.forward[0];
        
        while (current !== null) {
            result.push(current.value);
            current = current.forward[0];
        }
        
        return result;
    }

    // Torna o conjunto iterável (permite usar for...of)
    [Symbol.iterator]() {
        let current = this.header.forward[0];
        return {
            next() {
                if (current === null) {
                    return { done: true };
                }
                
                const value = current.value;
                current = current.forward[0];
                return { done: false, value };
            }
        };
    }

    // Método para depuração - mostra a estrutura interna da lista skip
    _debug() {
        const levelStructure = [];
        
        for (let i = 0; i <= this.level; i++) {
            const values = [];
            let current = this.header.forward[i];
            
            while (current !== null) {
                values.push(current.value);
                current = current.forward[i];
            }
            
            levelStructure.push(`Level ${i}: ${values.join(' -> ')}`);
        }
        
        return levelStructure.join('\n');
    }
}

// Demonstração de uso
function demonstrateLeaderboard() {
    console.log("=== Implementação de um Leaderboard (Ranking) ===");
    
    // Estrutura para armazenar informações dos jogadores
    const playerInfo = new Map();
    
    // SortedSet para manter as pontuações em ordem (do maior para o menor)
    const leaderboard = new SortedSet();
    
    // Função para adicionar pontuação de um jogador
    function addScore(playerId, playerName, score) {
        // Removemos qualquer pontuação anterior deste jogador
        const prevScore = playerInfo.get(playerId)?.score;
        if (prevScore !== undefined) {
            leaderboard.remove(-prevScore); // Usamos negativo para ordenar decrescente
        }
        
        // Armazenamos as informações do jogador
        playerInfo.set(playerId, { name: playerName, score, id: playerId });
        
        // Adicionamos a pontuação no leaderboard (com sinal negativo para ordem decrescente)
        leaderboard.add(-score);
        
        console.log(`${playerName} marcou ${score} pontos`);
    }
    
    // Função para obter o ranking
    function getTopPlayers(limit = 10) {
        const topScores = [];
        let count = 0;
        
        // Iteramos pela lista skip
        for (const negScore of leaderboard) {
            // Para cada pontuação, encontramos o jogador correspondente
            const score = -negScore; // Convertemos de volta para positivo
            
            // Procuramos qual jogador tem esta pontuação
            let foundPlayer = null;
            for (const player of playerInfo.values()) {
                if (player.score === score) {
                    foundPlayer = player;
                    break;
                }
            }
            
            if (foundPlayer) {
                topScores.push({
                    rank: count + 1,
                    name: foundPlayer.name,
                    score: foundPlayer.score,
                    id: foundPlayer.id
                });
                
                count++;
                if (count >= limit) break;
            }
        }
        
        return topScores;
    }
    
    // Adiciona algumas pontuações
    addScore("player1", "Alice", 1000);
    addScore("player2", "Bob", 850);
    addScore("player3", "Charlie", 1200);
    addScore("player4", "Diana", 950);
    addScore("player5", "Eve", 750);
    addScore("player6", "Frank", 1100);
    
    // Exibe o ranking inicial
    console.log("\nLeaderboard Inicial:");
    console.table(getTopPlayers(10));
    
    // Alguns jogadores melhoram suas pontuações
    console.log("\nAtualizações de pontuação:");
    addScore("player2", "Bob", 1050);
    addScore("player5", "Eve", 1300);
    
    // Exibe o ranking atualizado
    console.log("\nLeaderboard Atualizado:");
    console.table(getTopPlayers(10));
    
    // Mostra a estrutura interna da lista skip (para fins educacionais)
    console.log("\nEstrutura interna da Lista Skip:");
    console.log(leaderboard._debug());
}

// Demonstração de um dicionário ordenado
function demonstrateDictionary() {
    console.log("\n=== Implementação de um Dicionário Ordenado ===");
    
    // Cria uma classe que usa o SortedSet para implementar um dicionário ordenado
    class OrderedDictionary {
        constructor() {
            this.set = new SortedSet();
            this.keyToValue = new Map();
        }
        
        // Adiciona ou atualiza um par chave-valor
        set(key, value) {
            this.set.add(key);
            this.keyToValue.set(key, value);
        }
        
        // Obtém um valor pela chave
        get(key) {
            return this.keyToValue.get(key);
        }
        
        // Remove uma chave e seu valor
        delete(key) {
            this.set.remove(key);
            return this.keyToValue.delete(key);
        }
        
        // Verifica se uma chave existe
        has(key) {
            return this.set.has(key);
        }
        
        // Retorna todas as chaves em ordem
        keys() {
            return this.set.toArray();
        }
        
        // Retorna todos os valores em ordem de chave
        values() {
            return this.set.toArray().map(key => this.keyToValue.get(key));
        }
        
        // Retorna todos os pares [chave, valor] em ordem de chave
        entries() {
            return this.set.toArray().map(key => [key, this.keyToValue.get(key)]);
        }
        
        // Retorna o número de entradas
        size() {
            return this.set.getSize();
        }
    }
    
    // Demonstração de uso
    const dict = new OrderedDictionary();
    
    // Adiciona algumas entradas
    dict.set("apple", { color: "red", price: 1.2 });
    dict.set("orange", { color: "orange", price: 0.95 });
    dict.set("banana", { color: "yellow", price: 0.5 });
    dict.set("grape", { color: "purple", price: 2.5 });
    dict.set("kiwi", { color: "brown", price: 1.8 });
    
    // Exibe as chaves em ordem
    console.log("Chaves em ordem alfabética:", dict.keys());
    
    // Busca alguns valores
    console.log("\nInformações da banana:", dict.get("banana"));
    console.log("Informações do kiwi:", dict.get("kiwi"));
    
    // Demonstra busca por intervalo usando o SortedSet subjacente
    console.log("\nFrutas de 'banana' a 'kiwi':", dict.set.range("banana", "kiwi"));
    
    // Atualiza um valor
    dict.set("apple", { color: "green", price: 1.5 });
    console.log("\nInformações da maçã após atualização:", dict.get("apple"));
    
    // Remove uma entrada
    dict.delete("orange");
    console.log("\nApós remover 'orange', chaves:", dict.keys());
    
    // Exibe todos os pares chave-valor em ordem
    console.log("\nTodas as entradas:");
    dict.entries().forEach(([key, value]) => {
        console.log(`${key}: ${value.color}, $${value.price}`);
    });
}

// Executa as demonstrações
demonstrateLeaderboard();
demonstrateDictionary();

/**
 * Benefícios do SortedSet implementado com Lista Skip:
 * 
 * 1. Desempenho:
 *    - Inserção, remoção e busca: O(log n) em caso médio
 *    - Busca por intervalo: O(log n + k) onde k é o número de elementos no intervalo
 * 
 * 2. Simplicidade:
 *    - Implementação mais simples que árvores balanceadas (como árvores rubro-negras)
 *    - Código mais fácil de entender e manter
 * 
 * 3. Funcionalidade:
 *    - Oferece operações ceil/floor para encontrar elementos mais próximos
 *    - Suporte eficiente para busca por intervalo
 *    - Facilmente adaptável para diferentes tipos de dados
 * 
 * Aplicações no mundo real:
 * - Redis usa listas skip para seus sorted sets
 * - Sistemas de tempo real que precisam de estruturas ordenadas e eficientes
 * - Implementações de índices em bancos de dados
 * - Sistemas de busca e gerenciamento de intervalo
 */ 