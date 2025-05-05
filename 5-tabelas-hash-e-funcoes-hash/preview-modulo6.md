# Preview: Módulo 6 - Algoritmos Gulosos e Programação Dinâmica

## O Universo da Otimização Aguarda Você! 🌟

### Analogia: Do Organizador ao Estrategista

Se no Módulo 5 você aprendeu a ser um **organizador eficiente** (hash tables), no Módulo 6 você vai se tornar um **estrategista de decisões ótimas**!

### O Mundo que Vamos Explorar:

```ascii
              🎯 PROBLEMAS DE OTIMIZAÇÃO 🎯
                         │
         ┌───────────────┴───────────────┐
         │                               │
    ALGORÍTIMOS                PROGRAMAÇÃO
      GULOSOS                   DINÂMICA
         │                               │
  "Escolha o melhor          "Encontre a MELHOR
   agora e torça"             combinação possível"
         │                               │
    ┌────┴────┐                  ┌────────┴────────┐
    │         │                  │                 │
 Simples   Rápido           Mais Complex     Ótimo
    │         │                  │                 │
    └─────────┘                  └─────────────────┘
```

### Problemas que Vamos Resolver:

#### 1. Algoritmos Gulosos
- 🪙 **Troco de Moedas**: Como dar o menor número de moedas?
- 🗓️ **Agendamento**: Como organizar tarefas no menor tempo?
- 🌳 **Árvores Geradoras**: Como conectar cidades com menor custo?

#### 2. Programação Dinâmica
- 🎒 **Mochila**: O que levar numa viagem com limite de peso?
- 🔄 **Fibonacci**: Como calcular eficientemente?
- 📱 **Sequências**: Como encontrar padrões ótimos?

### Sneak Peek: Problema da Mochila

```javascript
// Problema: Você tem uma mochila com limite de peso
// Itens têm valor e peso - como maximizar o valor total?

// Abordagem GANANCIOSA (Mochila Fracionária)
function knapsackGreedy(capacity, items) {
    // Ordena por valor/peso (densidade de valor)
    items.sort((a, b) => b.value/b.weight - a.value/a.weight);
    
    let totalValue = 0;
    let remainingCapacity = capacity;
    
    for (let item of items) {
        if (item.weight <= remainingCapacity) {
            totalValue += item.value;
            remainingCapacity -= item.weight;
        } else {
            // Pega fração do item
            totalValue += (remainingCapacity / item.weight) * item.value;
            break;
        }
    }
    
    return totalValue;
}

// Abordagem DINÂMICA (Mochila 0/1)
function knapsackDP(capacity, items) {
    // Constrói tabela de soluções ótimas
    const dp = Array(items.length + 1)
        .fill()
        .map(() => Array(capacity + 1).fill(0));
    
    // Para cada item e capacidade, decide: pegar ou não?
    for (let i = 1; i <= items.length; i++) {
        for (let w = 1; w <= capacity; w++) {
            const item = items[i - 1];
            if (item.weight <= w) {
                dp[i][w] = Math.max(
                    dp[i-1][w], // Não pega o item
                    dp[i-1][w-item.weight] + item.value // Pega o item
                );
            } else {
                dp[i][w] = dp[i-1][w];
            }
        }
    }
    
    return dp[items.length][capacity];
}

// Pergunta: Quando cada abordagem é apropriada?
```

### O que Faz Este Módulo Ser Especial:

1. **Elegância Matemática**: Problemas complexos com soluções elegantes
2. **Aplicações Universais**: Desde finanças até inteligência artificial
3. **Mudança de Mindset**: De "como fazer" para "qual a melhor forma"
4. **Ferramentas Poderosas**: Técnicas que resolvem classes inteiras de problemas

### Analogia de Vida: O Plano de Carreira

**Algoritmo Gananciosa:** Sempre aceite o melhor emprego disponível agora  
**Programação Dinâmica:** Planeje sua carreira considerando todas as possibilidades futuras  

Qual abordagem é melhor? Depende da situação! 🤔

### Pergunta para Instigar:

**Se você tivesse que otimizar sua rotina diária, usaria uma abordagem gananciosa ou programação dinâmica?**

### O que Você Vai Ganhar:

- 🧠 **Pensamento Otimizado**: Ver padrões em problemas complexos
- 💡 **Intuição Algorítmica**: Saber quando usar cada técnica
- 🚀 **Performance Superior**: Resolver problemas impossíveis
- 🛠️ **Toolbox Expandido**: Mais ferramentas no seu arsenal

### Prepare-se Para:

1. **Desafios Instigantes**: Quebrar barreiras mentais
2. **Soluções Elegantes**: Encontrar a beleza na matemática
3. **Aplicações Práticas**: Do mundo real aos games
4. **Evolução Profissional**: Subir seu nível como desenvolvedor

### Countdown para o Módulo 6:

```
   3    2    1    🚀
   │    │    │    │
 Revise│ Prepare│ Vamos
   V    V    V    V
 Hash  Mente  Lápis  Programar!
```

**A jornada da otimização começa quando você virar a página...**

---

*"Otimização não é sobre fazer as coisas mais rápido, é sobre fazer as coisas certas da maneira certa."*

**Você está pronto para descobrir como tomar as melhores decisões possíveis?** 🎯
