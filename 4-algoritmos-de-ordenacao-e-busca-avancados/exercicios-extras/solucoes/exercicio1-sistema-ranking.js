/**
 * Implementação completa do Sistema de Ranking
 * Solução para o Exercício 1 do Módulo 4
 */

class GameRanking {
    constructor() {
        this.players = [];
        this.lastRankingCriteria = null;
    }
    
    /**
     * Adiciona um jogador ao sistema de ranking
     * @param {Object} player - Objeto com dados do jogador
     */
    addPlayer(player) {
        // Garantir que winRate seja calculado
        if (player.wins !== undefined && player.losses !== undefined) {
            player.winRate = player.wins / (player.wins + player.losses);
        }
        
        this.players.push(player);
    }
    
    /**
     * Ordena jogadores por múltiplos critérios
     * Usa algoritmo estável (Merge Sort) para preservar ordenações anteriores
     * @param {Array} criteria - Array com critérios na ordem de prioridade
     * @returns {Array} - Array de jogadores ordenado
     */
    rankBy(criteria = ['score']) {
        // Armazenar critérios para busca posterior
        this.lastRankingCriteria = [...criteria];
        
        // Ordenar do critério menos importante para o mais importante
        // Isso garante que critérios mais importantes sejam priorizados
        for (let i = criteria.length - 1; i >= 0; i--) {
            const criterion = criteria[i];
            this.players = this.mergeSort(this.players, criterion);
        }
        
        return this.players;
    }
    
    /**
     * Implementação de Merge Sort estável para garantir 
     * que a ordem relativa seja mantida para elementos iguais
     */
    mergeSort(array, criterion) {
        // Caso base: array de 0 ou 1 elemento já está ordenado
        if (array.length <= 1) {
            return array;
        }
        
        // Dividir o array ao meio
        const middle = Math.floor(array.length / 2);
        const left = array.slice(0, middle);
        const right = array.slice(middle);
        
        // Recursivamente ordenar as duas metades
        const leftSorted = this.mergeSort(left, criterion);
        const rightSorted = this.mergeSort(right, criterion);
        
        // Combinar as duas metades ordenadas
        return this.merge(leftSorted, rightSorted, criterion);
    }
    
    /**
     * Função helper para combinar dois arrays ordenados
     */
    merge(left, right, criterion) {
        const result = [];
        let leftIndex = 0;
        let rightIndex = 0;
        
        // Comparar elementos e adicionar na ordem correta
        while (leftIndex < left.length && rightIndex < right.length) {
            // Verificar se é o winRate que está sendo comparado
            if (criterion === 'winRate') {
                // Pré-calculado no método addPlayer, mas caso não esteja:
                const leftWinRate = left[leftIndex].winRate || 
                    (left[leftIndex].wins / (left[leftIndex].wins + left[leftIndex].losses));
                const rightWinRate = right[rightIndex].winRate ||
                    (right[rightIndex].wins / (right[rightIndex].wins + right[rightIndex].losses));
                
                // Para ordem decrescente, inverta a comparação
                if (leftWinRate >= rightWinRate) {
                    result.push(left[leftIndex]);
                    leftIndex++;
                } else {
                    result.push(right[rightIndex]);
                    rightIndex++;
                }
            } else {
                // Para outros critérios, comparamos diretamente o valor
                // Ordem decrescente (maior para menor)
                if (left[leftIndex][criterion] >= right[rightIndex][criterion]) {
                    result.push(left[leftIndex]);
                    leftIndex++;
                } else {
                    result.push(right[rightIndex]);
                    rightIndex++;
                }
            }
        }
        
        // Adicionar elementos restantes
        return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
    }
    
    /**
     * Encontra a posição (rank) de um jogador pelo ID
     * @param {string} playerId - ID do jogador
     * @returns {number} - Posição no ranking (1-indexed) ou -1 se não encontrado
     */
    findPlayerRank(playerId) {
        // Se não tiver um ranking definido, use o padrão
        if (!this.lastRankingCriteria) {
            this.rankBy(['score']);
        }
        
        // Buscar a posição do jogador
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].id === playerId) {
                // Retorna posição 1-indexed (o primeiro é 1, não 0)
                return i + 1;
            }
        }
        
        return -1; // Jogador não encontrado
    }
    
    /**
     * Obtém os top K jogadores do ranking
     * Usa um heap para eficiência em grandes datasets
     * @param {number} k - Número de jogadores a retornar
     * @returns {Array} - Top K jogadores
     */
    getTopK(k) {
        // Se não houver ranking, aplique o padrão
        if (!this.lastRankingCriteria) {
            this.rankBy(['score']);
        }
        
        // Se k for maior que o número de jogadores, retorne todos
        if (k >= this.players.length) {
            return [...this.players];
        }
        
        // Retorna os primeiros k jogadores
        // Já estão ordenados pelo último rankBy
        return this.players.slice(0, k);
    }
    
    /**
     * Método para visualizar o ranking atual
     * @param {number} limit - Número máximo de jogadores a mostrar
     * @returns {string} - Representação textual do ranking
     */
    displayRanking(limit = 10) {
        const count = Math.min(limit, this.players.length);
        let result = "🏆 RANKING DE JOGADORES 🏆\n";
        
        for (let i = 0; i < count; i++) {
            const player = this.players[i];
            result += `${i+1}. ${player.name} - Score: ${player.score}, Level: ${player.level}`;
            
            if (player.winRate !== undefined) {
                result += `, Win Rate: ${(player.winRate * 100).toFixed(1)}%`;
            }
            
            result += "\n";
        }
        
        return result;
    }
}

// Função para demonstrar o uso da classe
function demonstrateRanking() {
    const ranking = new GameRanking();
    
    // Adicionar alguns jogadores
    ranking.addPlayer({
        id: 'p1',
        name: 'Alice',
        score: 1500,
        level: 25,
        wins: 42,
        losses: 18
    });
    
    ranking.addPlayer({
        id: 'p2',
        name: 'Bob',
        score: 1200,
        level: 30,
        wins: 30,
        losses: 15
    });
    
    ranking.addPlayer({
        id: 'p3',
        name: 'Charlie',
        score: 1500,
        level: 20,
        wins: 48,
        losses: 12
    });
    
    ranking.addPlayer({
        id: 'p4',
        name: 'Diana',
        score: 1350,
        level: 25,
        wins: 36,
        losses: 24
    });
    
    ranking.addPlayer({
        id: 'p5',
        name: 'Evan',
        score: 1500,
        level: 25,
        wins: 45,
        losses: 15
    });
    
    // Testar diferentes ordenações
    console.log("Ranking por score:");
    ranking.rankBy(['score']);
    console.log(ranking.displayRanking());
    
    console.log("\nRanking por level, depois score:");
    ranking.rankBy(['score', 'level']);
    console.log(ranking.displayRanking());
    
    console.log("\nRanking por winRate:");
    ranking.rankBy(['winRate']);
    console.log(ranking.displayRanking());
    
    // Demonstrar busca de posição
    const playerToFind = 'p3';
    console.log(`\nPosição do jogador ${playerToFind}: ${ranking.findPlayerRank(playerToFind)}`);
    
    // Demonstrar getTopK
    console.log("\nTop 3 jogadores:");
    const top3 = ranking.getTopK(3);
    console.log(top3.map(p => p.name).join(', '));
}

// Executar a demonstração
// demonstrateRanking();

// Exportar a classe para uso em outros arquivos
module.exports = { GameRanking }; 