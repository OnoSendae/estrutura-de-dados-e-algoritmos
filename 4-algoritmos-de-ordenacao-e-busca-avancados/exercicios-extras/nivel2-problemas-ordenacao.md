# Nível 2: Problemas de Ordenação

## 🎯 Objetivo
Aplicar algoritmos de ordenação para resolver problemas práticos do mundo real, desenvolvendo habilidade para escolher o algoritmo adequado para cada situação.

## 📝 Problema 1: Sistema de Ranking Multi-Critério

Você está desenvolvendo um sistema de ranking para um campeonato de games:

```javascript
class GamePlayer {
  constructor(id, name, stats) {
    this.id = id;
    this.name = name;
    this.wins = stats.wins;
    this.losses = stats.losses;
    this.score = stats.score;
    this.level = stats.level;
    this.kd_ratio = stats.kills / stats.deaths;
  }
}

// Implemente o sistema de ranking
class GameRanking {
  constructor(players) {
    this.players = players;
  }
  
  // Ordenar por múltiplos critérios
  sortByMultipleCriteria(criteria) {
    // criteria: ['score', 'kd_ratio', 'wins', 'level']
    // Ordene os jogadores por múltiplos critérios em ordem de prioridade
    
    // Sua implementação aqui
  }
  
  // Encontrar top K jogadores
  getTopK(k, criterion) {
    // Use um algoritmo eficiente para encontrar os K melhores
    // Heap? Quick Select? Outra abordagem?
    
    // Sua implementação aqui
  }
  
  // Ranking dinâmico (atualização incremental)
  updatePlayerStats(playerId, newStats) {
    // Atualize o ranking sem reordenar tudo
    
    // Sua implementação aqui
  }
}
```

**Desafios:**
1. Qual algoritmo é mais eficiente para ordenação por múltiplos critérios?
2. Como implementar um ranking que atualiza dinamicamente?
3. Como garantir estabilidade quando múltiplos jogadores têm mesma pontuação?

## 📝 Problema 2: Agendamento de Tarefas

Implemente um sistema de agendamento que ordena tarefas por diferentes critérios:

```javascript
class Task {
  constructor(id, priority, deadline, estimatedTime) {
    this.id = id;
    this.priority = priority; // 1-10
    this.deadline = new Date(deadline);
    this.estimatedTime = estimatedTime; // em minutos
  }
}

class TaskScheduler {
  constructor(tasks) {
    this.tasks = tasks;
  }
  
  // Earliest Deadline First
  scheduleEDF() {
    // Ordene tarefas pelo deadline mais próximo
    
    // Sua implementação aqui
  }
  
  // Weighted Shortest Job First
  scheduleWSJF() {
    // Considere prioridade/estimatedTime para ordenar
    
    // Sua implementação aqui
  }
  
  // Maximizar tarefas concluídas
  maximizeCompletedTasks(timeLimit) {
    // Qual algoritmo greedy você usaria?
    
    // Sua implementação aqui
  }
}
```

**Desafios:**
1. Como balancear prioridade versus deadline?
2. Qual algoritmo otimiza o número de tarefas completadas?
3. Como lidar com tarefas que não podem ser interrompidas?

## 📝 Problema 3: Processamento de Logs

Implemente um sistema para processar grandes volumes de logs:

```javascript
class LogEntry {
  constructor(timestamp, level, service, message) {
    this.timestamp = new Date(timestamp);
    this.level = level; // DEBUG, INFO, WARN, ERROR
    this.service = service;
    this.message = message;
  }
}

class LogProcessor {
  constructor() {
    this.logs = [];
  }
  
  // Processar logs em chunks (External Sort)
  async processLargeLogFile(filePath) {
    // Leia arquivo em chunks, ordene e faça merge
    
    // Sua implementação aqui
  }
  
  // Encontrar anomalias (logs de ERRO)
  findAnomaly(timeWindow) {
    // Encontre clusters de erros em uma janela de tempo
    
    // Sua implementação aqui
  }
  
  // Ranking de serviços com mais erros
  serviceErrorRanking() {
    // Use uma estrutura eficiente para contar erros por serviço
    
    // Sua implementação aqui
  }
}
```

**Desafios:**
1. Como processar arquivos maiores que a memória disponível?
2. Qual algoritmo é mais eficiente para encontrar patterns em timestamps?
3. Como otimizar a agregação por serviço?

## 📝 Problema 4: Sistema de Recomendação de Produtos

Ordene produtos por relevância para um usuário:

```javascript
class Product {
  constructor(id, name, price, category, rating, sales) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.category = category;
    this.rating = rating;
    this.sales = sales;
  }
}

class RecommendationEngine {
  constructor(products, userHistory) {
    this.products = products;
    this.userHistory = userHistory;
  }
  
  // Calcular score de similaridade
  calculateSimilarityScore(product, userPreferences) {
    // Considere: categoria, preço, rating
    
    // Sua implementação aqui
  }
  
  // Recomendações personalizadas
  getPersonalizedRecommendations(limit) {
    // Ordene produtos por score de similaridade
    
    // Sua implementação aqui
  }
  
  // Trending products
  getTrendingProducts(timeFrame) {
    // Identifique produtos com crescimento rápido em vendas
    
    // Sua implementação aqui
  }
}
```

**Desafios:**
1. Como balancear múltiplos fatores no score de similaridade?
2. Qual algoritmo é mais eficiente para manter produtos trending?
3. Como atualizar recomendações em tempo real?

## 📝 Problema 5: Sistema de Votação

Implemente um sistema de contagem de votos com diferentes métodos:

```javascript
class Candidate {
  constructor(id, name, party) {
    this.id = id;
    this.name = name;
    this.party = party;
  }
}

class VotingSystem {
  constructor(candidates, votes) {
    this.candidates = candidates;
    this.votes = votes; // Array de voteId -> candidateId
  }
  
  // Contagem simples de votos
  simpleVoteCount() {
    // Qual algoritmo é mais eficiente para contar?
    
    // Sua implementação aqui
  }
  
  // Sistema de votação por ranking
  rankedVoting() {
    // Implemente o método de voto transferível
    
    // Sua implementação aqui
  }
  
  // Detectar fraudes (votos duplicados)
  detectFraud() {
    // Como encontrar eficientemente votos duplicados?
    
    // Sua implementação aqui
  }
}
```

**Desafios:**
1. Qual algoritmo é mais eficiente para contagem de votos grandes?
2. Como implementar votação ranqueada eficientemente?
3. Como detectar e remover votos fraudulentos?

## 📝 Problema 6: Análise de Desempenho de Algoritmos

Crie um sistema para comparar diferentes algoritmos em datasets específicos:

```javascript
class AlgorithmBenchmark {
  constructor() {
    this.results = new Map();
  }
  
  // Gerar datasets com características específicas
  generateDataset(type, size) {
    // Tipos: random, nearly_sorted, reverse, many_duplicates
    
    // Sua implementação aqui
  }
  
  // Escolher algoritmo baseado em características
  chooseOptimalAlgorithm(dataset) {
    // Analise características do dataset
    // Retorne o algoritmo mais apropriado
    
    // Sua implementação aqui
  }
  
  // Comparar múltiplos algoritmos
  compareAlgorithms(algorithms, dataset) {
    // Execute e meça performance
    
    // Sua implementação aqui
  }
  
  // Gerar relatório
  generateReport() {
    // Crie uma análise detalhada dos resultados
    
    // Sua implementação aqui
  }
}
```

**Desafios:**
1. Como escolher automaticamente o melhor algoritmo?
2. Quais métricas são importantes para comparação?
3. Como visualizar os resultados de forma clara?

## 📝 Problema 7: Sistema de Cache com Ordenação

Implemente um cache que mantém os itens mais relevantes:

```javascript
class SmartCache {
  constructor(maxSize, evictionPolicy) {
    this.maxSize = maxSize;
    this.cache = new Map();
    this.accessHistory = new Map();
    this.policy = evictionPolicy; // LRU, LFU, etc.
  }
  
  // Adicionar item ao cache
  add(key, value) {
    // Se cache está cheio, remova o menos relevante
    
    // Sua implementação aqui
  }
  
  // Acessar item
  get(key) {
    // Atualize histórico de acesso
    
    // Sua implementação aqui
  }
  
  // Determinar item para remoção
  findEvictionCandidate() {
    // Com base na política escolhida
    
    // Sua implementação aqui
  }
}
```

**Desafios:**
1. Como implementar eficientemente diferentes políticas de eviction?
2. Qual estrutura de dados mantém a ordem de relevância?
3. Como balancear tempo de acesso com precisão de eviction?

## 📝 Problema 8: Deduplicação de Dados

Remova duplicatas de forma eficiente em diferentes cenários:

```javascript
class DataDeduplicator {
  // Remover duplicatas mantendo primeira ocorrência
  stableDeduplication(data) {
    // Mantenha a ordem dos elementos únicos
    
    // Sua implementação aqui
  }
  
  // Remover duplicatas em stream de dados
  streamDeduplication(dataStream) {
    // Processe dados incrementalmente
    
    // Sua implementação aqui
  }
  
  // Encontrar e agrupar duplicatas
  findDuplicateGroups(data) {
    // Agrupe todos os itens duplicados
    
    // Sua implementação aqui
  }
  
  // Deduplicação fuzzy (similaridade)
  fuzzyDeduplication(data, similarityThreshold) {
    // Remova itens suficientemente similares
    
    // Sua implementação aqui
  }
}
```

**Desafios:**
1. Como manter estabilidade na deduplicação?
2. Qual algoritmo é mais eficiente para stream de dados?
3. Como implementar deduplicação baseada em similaridade?

## 🎯 Desafio Integrado

Crie um sistema completo que combine múltiplos problemas:

```javascript
class DataProcessingPipeline {
  constructor() {
    this.stages = [];
  }
  
  // Adicionar estágio de processamento
  addStage(stage) {
    this.stages.push(stage);
  }
  
  // Processar dados através do pipeline
  async process(inputData) {
    let data = inputData;
    
    for (let stage of this.stages) {
      data = await stage.process(data);
    }
    
    return data;
  }
  
  // Otimizar a ordem dos estágios
  optimizePipeline() {
    // Qual ordem minimiza o tempo total?
    
    // Sua implementação aqui
  }
}

// Exemplo de uso
const pipeline = new DataProcessingPipeline();
pipeline.addStage(new DeduplicationStage());
pipeline.addStage(new SortingStage());
pipeline.addStage(new FilteringStage());
pipeline.addStage(new AggregationStage());

// Como otimizar a ordem dos estágios?
```

**Desafios:**
1. Como determinar a ordem ótima de processamento?
2. Como paralelizar estágios independentes?
3. Como monitorar e otimizar performance do pipeline?

## ✅ Checklist de Resolução

Para cada problema, certifique-se de:
- [ ] Escolher o algoritmo apropriado
- [ ] Considerar edge cases
- [ ] Implementar testes unitários
- [ ] Documentar a complexidade
- [ ] Comparar com abordagens alternativas
- [ ] Otimizar para o caso de uso específico