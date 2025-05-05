# Algoritmos e Estrutura de Dados na Prática

## Módulo 5: Tabelas Hash e Funções Hash

### 0. Introdução às Tabelas Hash: Visão Geral e Comparação com Estruturas Anteriores

As tabelas hash representam um salto significativo na forma como armazenamos e acessamos dados. Após explorarmos diversas estruturas lineares e hierárquicas, chegamos a uma estrutura que nos oferece acesso quase instantâneo aos dados - um verdadeiro superpoder da computação!

#### Do Linear ao Aleatório: Nossa Jornada até Aqui

Vamos relembrar nossa jornada:

**Módulo 2: Estruturas Lineares**
- Listas encadeadas (acesso sequencial - O(n))
- Pilhas e filas (acesso limitado, mas eficiente - O(1) para extremidades)
- Deques (flexíveis, mas ainda lineares)

**Módulo 3: Estruturas Hierárquicas**
- Árvores binárias de busca (acesso em O(log n))
- Árvores balanceadas (garantia de O(log n))
- Grafos (estrutura de relações complexas)

**Agora no Módulo 5: Tabelas Hash**
- Acesso direto em O(1) na média!
- Mapeamento chave-valor altamente eficiente
- Troca de espaço por velocidade

#### Quando Usar Tabelas Hash?

Tabelas hash são ideais quando:

1. **Precisa de busca rápida**: Recuperar dados por uma chave específica
2. **Verificação de existência**: Determinar rapidamente se um elemento existe
3. **Eliminação de duplicatas**: Rastrear itens já vistos em um conjunto
4. **Caching**: Armazenar resultados de operações custosas
5. **Indexação**: Implementar índices para bancos de dados
6. **Contagem de frequência**: Contar ocorrências de elementos

#### Comparação com Estruturas Anteriores

```
┌────────────────┬────────────┬────────────┬────────────┬────────────┐
│ Estrutura      │  Busca     │  Inserção  │  Remoção   │  Ordenado  │
├────────────────┼────────────┼────────────┼────────────┼────────────┤
│ Array          │  O(n)      │  O(1)*     │  O(n)      │  Sim*      │
│ Lista Encad.   │  O(n)      │  O(1)      │  O(n)      │  Não       │
│ Árvore Busca   │  O(log n)  │  O(log n)  │  O(log n)  │  Sim       │
│ Tabela Hash    │  O(1)      │  O(1)      │  O(1)      │  Não       │
└────────────────┴────────────┴────────────┴────────────┴────────────┘
* Com condições específicas
```

#### Anatomia de uma Tabela Hash

```
┌──────────────┐
│  CHAVE       │──┐
└──────────────┘  │
                  ▼
         ┌──────────────┐
         │ FUNÇÃO HASH  │
         └──────┬───────┘
                │
                ▼
┌───────┬───────────────────────────┐
│Índice │          Valores          │
├───────┼───────────────────────────┤
│   0   │                           │
├───────┼───────────────────────────┤
│   1   │ ┌─────────┐               │
│       │ │chave:val│               │
│       │ └─────────┘               │
├───────┼───────────────────────────┤
│   2   │                           │
├───────┼───────────────────────────┤
│   3   │ ┌─────────┐  ┌─────────┐  │
│       │ │chave:val│->│chave:val│  │
│       │ └─────────┘  └─────────┘  │
├───────┼───────────────────────────┤
│   4   │                           │
└───────┴───────────────────────────┘
```

#### O Desafio das Colisões

O principal desafio das tabelas hash é lidar com colisões - quando duas chaves diferentes apontam para o mesmo índice. Este módulo explorará diferentes estratégias para resolver esse problema, garantindo eficiência mesmo com muitos dados.

#### O Que Você Aprenderá Neste Módulo

1. **Fundamentos de tabelas hash** - Como funcionam e como implementá-las
2. **Funções hash** - O coração da eficiência de uma tabela hash
3. **Tratamento de colisões** - Estratégias para resolver conflitos
4. **Rehashing e fatores de carga** - Otimizando o desempenho
5. **Aplicações práticas** - Resolvendo problemas reais
6. **Case study** - Implementação completa de um sistema

Vamos começar nossa jornada no fascinante mundo das tabelas hash! 