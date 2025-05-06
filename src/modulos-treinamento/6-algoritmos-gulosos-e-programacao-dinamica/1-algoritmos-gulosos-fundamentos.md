# Algoritmos e Estrutura de Dados na Prática

## Módulo 6: Algoritmos Gulosos e Programação Dinâmica

### 1. Algoritmos Gulosos: Fundamentos e Aplicações

Algoritmos gulosos são como aquela pessoa que sempre pega o maior pedaço de bolo primeiro, sem pensar nas consequências. Às vezes funciona perfeitamente, às vezes... bem, nem tanto! 🍰

#### Analogia: Expedição na Selva 🌲

Imagine que você está em uma expedição na selva, decidindo qual caminho seguir a cada bifurcação:

**Algoritmo Gananciosa (Greedy):**
- Escolhe sempre o caminho que parece mais fácil **agora**
- Não volta atrás, não planeja o futuro
- Pode levar a becos sem saída

**Pergunta provocativa:** Um viajante gananciosa sempre encontra o tesouro?

### Características Fundamentais:

**1. Escolha Gananciosa:**
- Em cada passo, faz a escolha que parece melhor no momento
- Nunca reconsidera decisões anteriores
- Constrói a solução incrementalmente

**2. Subproblemas Greedy-Choice:**
- A escolha ótima local deve levar à solução ótima global
- Não há necessidade de "olhar para frente"

**3. Propriedade da Maturidade:**
- Uma vez feita uma escolha, ela nunca é desfeita

### Visualização do Processo Guloso

```
Algoritmo Guloso (escolha local ótima):
          [Start]
             |
             v
    +-------------------+
    | Considerar opções |<-----+
    | disponíveis       |      |
    +-------------------+      |
             |                 |
             v                 |
    +-------------------+      |
    | Escolher a melhor |      |
    | opção AGORA       |      |
    +-------------------+      |
             |                 |
             v                 |
    +-------------------+      |
    | Atualizar estado  |      |
    | do problema       |------+
    +-------------------+
             |
             v
    +-------------------+
    | Solução completa? |--Não-->+
    +-------------------+        |
             |                   |
            Sim                  |
             |                   |
             v                   |
          [Fim]                  |
                                 |
                                 v
                          [Próxima iteração]
```

### Critérios para Identificar Problemas "Gulosos"

Um problema pode ser resolvido com algoritmo guloso se possuir:

1. **Estrutura Gulosa (Greedy-choice property)**: A escolha local ótima leva à solução global ótima.

2. **Subestrutura Ótima**: A solução ótima do problema contém soluções ótimas para seus subproblemas.

3. **Ausência de Dependência Futura**: A escolha atual não depende de escolhas futuras.

4. **Irreversibilidade**: Escolhas feitas não precisam ser reconsideradas.

### Exemplo Clássico: Troco de Moedas

```javascript
// Sistema monetário americano: [25, 10, 5, 1] centavos
function makeChange(amount, coins = [25, 10, 5, 1]) {
    const result = [];
    let remaining = amount;
    
    // Ordena moedas em ordem decrescente
    coins.sort((a, b) => b - a);
    
    console.log(`\n=== Dando troco para ${amount} centavos ===`);
    
    for (let coin of coins) {
        while (remaining >= coin) {
            result.push(coin);
            remaining -= coin;
            console.log(`Uso moeda de ${coin}¢. Restam ${remaining}¢`);
        }
    }
    
    console.log(`Resultado: ${result.length} moedas: ${result}`);
    return result;
}

// Testando o algoritmo
makeChange(67);
// Esperado: [25, 25, 10, 5, 1, 1]
```

### Quando Algoritmos Gulosos FUNCIONAM: Exemplo de Agendamento de Tarefas

```javascript
class TaskScheduler {
    constructor() {
        this.tasks = [];
    }
    
    addTask(name, duration, deadline) {
        this.tasks.push({
            name,
            duration,
            deadline,
            priority: deadline // Prioridade = deadline mais próximo
        });
    }
    
    scheduleGreedy() {
        // Ordena por deadline mais próximo (greedy choice)
        const scheduled = [...this.tasks].sort((a, b) => a.priority - b.priority);
        
        let currentTime = 0;
        const schedule = [];
        
        console.log("\n=== Agendamento Gananciosa de Tarefas ===");
        
        for (let task of scheduled) {
            schedule.push({
                task: task.name,
                start: currentTime,
                end: currentTime + task.duration,
                onTime: currentTime + task.duration <= task.deadline
            });
            
            console.log(`Tarefa "${task.name}": ${currentTime} → ${currentTime + task.duration}`);
            console.log(`  Prazo: ${task.deadline} | ${schedule[schedule.length-1].onTime ? '✅ No prazo' : '❌ Atrasado'}`);
            
            currentTime += task.duration;
        }
        
        return schedule;
    }
    
    visualize(schedule) {
        console.log("\n=== Linha do Tempo ===");
        let timeline = "";
        let timeMarkers = "";
        let currentPosition = 0;
        
        for (let item of schedule) {
            const taskLength = Math.max(3, item.task.length);
            const status = item.onTime ? '✓' : '✗';
            
            timeline += `[${item.task.padEnd(taskLength)}${status}]`;
            timeMarkers += item.start.toString().padEnd(taskLength + 3);
            
            currentPosition += taskLength + 3;
        }
        
        console.log(timeline);
        console.log(timeMarkers + item.end);
    }
}

// Demonstração
const scheduler = new TaskScheduler();
scheduler.addTask("Report", 3, 10);
scheduler.addTask("Emails", 1, 5);
scheduler.addTask("Meeting", 2, 15);
scheduler.addTask("Code", 4, 20);

const schedule = scheduler.scheduleGreedy();
scheduler.visualize(schedule);
```

### Quando Algoritmos Gulosos FALHAM: O Problema da Mochila Fracionária

```javascript
function fractionalKnapsack(capacity, items) {
    // Calcula densidade de valor (valor/peso)
    const itemsWithDensity = items.map(item => ({
        ...item,
        density: item.value / item.weight
    }));
    
    // Ordena por densidade (decisão gananciosa)
    itemsWithDensity.sort((a, b) => b.density - a.density);
    
    let totalValue = 0;
    let remainingCapacity = capacity;
    const takenItems = [];
    
    console.log("\n=== Mochila Fracionária - Algoritmo Gananciosa ===");
    console.log("Item\t\tPeso\tValor\tDensidade");
    console.log("----------------------------------------");
    
    for (let item of itemsWithDensity) {
        console.log(`${item.name.padEnd(12)}\t${item.weight}\t${item.value}\t${item.density.toFixed(2)}`);
        
        if (remainingCapacity >= item.weight) {
            // Pega o item inteiro
            totalValue += item.value;
            remainingCapacity -= item.weight;
            takenItems.push({item: item.name, fraction: 1});
            console.log(`  ↳ Pega tudo`);
        } else if (remainingCapacity > 0) {
            // Pega fração do item
            const fraction = remainingCapacity / item.weight;
            totalValue += item.value * fraction;
            takenItems.push({item: item.name, fraction: fraction});
            console.log(`  ↳ Pega ${(fraction * 100).toFixed(1)}%`);
            remainingCapacity = 0;
            break;
        }
    }
    
    console.log(`\nValor total: ${totalValue}`);
    return { totalValue, takenItems };
}

// Testando com diferentes conjuntos de itens
const items = [
    { name: "Anel", weight: 1, value: 5 },
    { name: "Colar", weight: 3, value: 7 },
    { name: "Relógio", weight: 4, value: 8 },
    { name: "Bracelete", weight: 2, value: 4 }
];

fractionalKnapsack(8, items);
```

### Analogia: Chef Gananciosa vs Chef Planejador 👨‍🍳

```javascript
class GreedyChef {
    constructor() {
        this.ingredients = [];
        this.dishes = [];
    }
    
    addIngredient(name, quantity, expiryDays) {
        this.ingredients.push({
            name,
            quantity,
            expiryDays,
            added: Date.now()
        });
    }
    
    // Sempre usa o ingrediente que expira primeiro
    cookGreedy() {
        const dish = [];
        console.log("\n=== Chef Gananciosa em Ação ===");
        
        while (this.ingredients.length > 0) {
            // Ordena por expiração mais próxima
            this.ingredients.sort((a, b) => a.expiryDays - b.expiryDays);
            
            const ingredient = this.ingredients.shift();
            dish.push(ingredient.name);
            
            console.log(`Usa ${ingredient.name} (expira em ${ingredient.expiryDays} dias)`);
            
            // Se criou um prato, para
            if (dish.length === 3) break;
        }
        
        this.dishes.push(dish);
        console.log(`Prato criado: ${dish.join(", ")}`);
        console.log(`Ingredientes restantes: ${this.ingredients.length}`);
    }
}

// Simulação
const chef = new GreedyChef();
chef.addIngredient("Tomate", 5, 2);
chef.addIngredient("Queijo", 200, 7);
chef.addIngredient("Manjericão", 50, 1);
chef.addIngredient("Massa", 500, 30);

chef.cookGreedy();
```

### Recap: Quando usar Algoritmos Gulosos?

- Quando a escolha localmente ótima leva à solução globalmente ótima
- Quando não precisamos revisar decisões anteriores
- Quando queremos soluções rápidas e "boas o suficiente"
- Exemplos clássicos: agendamento, Huffman, Prim, Kruskal, troco de moedas

### Exercício Prático: Sistema de Compressão

```javascript
// Implemente um codificador gananciosa (Huffman simplificado)
class GreedyEncoder {
    constructor() {
        this.frequencies = new Map();
        this.codes = new Map();
    }
    
    analyzeText(text) {
        // TODO: Contar frequência de cada caractere
        // Use decisão gananciosa para atribuir códigos
        // Caractere mais frequente = código mais curto
    }
    
    encode(text) {
        // TODO: Codificar texto usando os códigos atribuídos
    }
    
    decode(encoded) {
        // TODO: Decodificar texto comprimido
    }
    
    getCompressionRate() {
        // TODO: Calcular taxa de compressão
    }
}

// Teste o codificador
const encoder = new GreedyEncoder();
const text = "banana";
encoder.analyzeText(text);
console.log("Códigos atribuídos:", encoder.codes);
```

### Características de Problemas que Aceitam Soluções Gananciosas:

**1. Máximo/Mínimo de algo:**
- Menor número de moedas
- Maior lucro possível
- Mínima distância

**2. Escolhas Irrevogáveis:**
- Uma vez feita uma escolha, não podemos voltar atrás
- A escolha atual não depende de escolhas futuras

**3. Propriedade Greedy-Choice:**
- A escolha ótima local leva à solução ótima global

### Armadilhas Comuns:

**1. Nem Sempre é Ótimo:**
```javascript
// Contra-exemplo: Moedas [1, 3, 4], valor = 6
// Gananciosa: [4, 1, 1] = 3 moedas ❌
// Ótimo: [3, 3] = 2 moedas ✓
```

**2. Ordem das Escolhas Importa:**
```javascript
// Mudando a ordem de processamento pode mudar o resultado
// Exemplo: Agendamento de tarefas com diferentes critérios
```

**3. Miopia Local:**
```javascript
// Focar apenas no presente pode prejudicar o futuro
// Exemplo: Investimentos de curto prazo vs longo prazo
```

### Quiz Rápido:

**1. Qual destes problemas PODE ser resolvido com algoritmo gananciosa?**
- A) Encontrar o caminho mais curto entre dois pontos
- B) Dividir um conjunto de números em dois grupos com soma igual
- C) Agendar tarefas para minimizar tempo de espera médio
- D) Encontrar a substring comum mais longa

**2. O algoritmo gananciosa é apropriado quando:**
- A) Precisamos da solução perfeita sempre
- B) A escolha ótima local garante ótimo global
- C) Temos tempo ilimitado para computar
- D) O problema tem muitos subproblemas sobrepostos

### Resumo da Aula:

**Pontos-chave:**
1. Algoritmos gulosos fazem escolhas localmente ótimas
2. Nem sempre produzem solução globalmente ótima
3. São simples e eficientes quando aplicáveis
4. Requerem prova de otimalidade

**Pergunta de verificação:**
Você consegue identificar situações do seu dia-a-dia onde aplicamos naturalmente uma estratégia gananciosa?

**Próxima aula:** Problemas Clássicos de Algoritmos Gulosos - vamos resolver alguns dos mais famosos!
