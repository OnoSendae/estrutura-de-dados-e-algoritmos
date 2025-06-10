# Pseudocódigo

O pseudocódigo é uma forma de escrever algoritmos usando uma linguagem informal e intuitiva, que combina elementos da linguagem natural com estruturas de programação. É uma ferramenta valiosa para planejar a lógica de um programa antes de implementá-lo em uma linguagem de programação específica.

## 1. Fundamentos de Pseudocódigo

### O que é Pseudocódigo?

Pseudocódigo é uma descrição de alto nível de um algoritmo que usa uma mistura de linguagem natural e estruturas básicas de programação para representar a lógica. Não é uma linguagem formal, então não existe um padrão único - cada pessoa ou organização pode ter seu próprio estilo.

**Analogia:** O pseudocódigo é como o esboço de um artista antes de criar a obra final. Não é a pintura acabada, mas contém todos os elementos essenciais que guiarão o trabalho completo.

### Vantagens do Pseudocódigo

1. **Foco na lógica**: Permite concentrar-se na solução do problema sem se preocupar com a sintaxe específica de uma linguagem.
2. **Independência de linguagem**: O mesmo pseudocódigo pode ser traduzido para diferentes linguagens de programação.
3. **Comunicação**: Facilita a comunicação entre programadores e não programadores.
4. **Planejamento**: Ajuda a organizar o pensamento antes de começar a codificar.

### Quando Usar Pseudocódigo

- Ao planejar algoritmos complexos
- Quando estiver aprendendo a programar
- Para documentar a lógica de um programa
- Para comunicar ideias a outros desenvolvedores
- Antes de implementar código em uma linguagem específica

## 2. Elementos Básicos do Pseudocódigo

### Declarações e Atribuições

```
// Declaração de variáveis
DECLARE nome COMO texto
DECLARE idade COMO inteiro
DECLARE preco COMO real

// Atribuição de valores
nome ← "Maria"
idade ← 25
preco ← 19.99
```

### Entrada e Saída

```
// Entrada de dados
ESCREVA "Digite seu nome: "
LEIA nome

// Saída de dados
ESCREVA "Olá, ", nome, "!"
```

### Operações Aritméticas

```
soma ← a + b
diferenca ← a - b
produto ← a * b
quociente ← a / b
resto ← a % b
```

### Estruturas Condicionais

```
// Condição simples
SE idade >= 18 ENTÃO
    ESCREVA "Maior de idade"
SENÃO
    ESCREVA "Menor de idade"
FIM-SE

// Condição múltipla
SE nota >= 90 ENTÃO
    ESCREVA "A"
SENÃO SE nota >= 80 ENTÃO
    ESCREVA "B"
SENÃO SE nota >= 70 ENTÃO
    ESCREVA "C"
SENÃO
    ESCREVA "D"
FIM-SE
```

### Estruturas de Repetição

```
// Loop com contador
PARA i DE 1 ATÉ 10 PASSO 1 FAÇA
    ESCREVA i
FIM-PARA

// Loop condicional (pré-teste)
ENQUANTO contador < 5 FAÇA
    ESCREVA contador
    contador ← contador + 1
FIM-ENQUANTO

// Loop condicional (pós-teste)
FAÇA
    ESCREVA contador
    contador ← contador + 1
ENQUANTO contador < 5
```

### Funções e Procedimentos

```
// Procedimento (não retorna valor)
PROCEDIMENTO saudacao(nome)
    ESCREVA "Olá, ", nome, "!"
FIM-PROCEDIMENTO

// Função (retorna valor)
FUNÇÃO calcularArea(base, altura)
    RETORNAR base * altura
FIM-FUNÇÃO

// Chamada
saudacao("João")
area ← calcularArea(5, 10)
```

## 3. Representação de Algoritmos

Vejamos alguns exemplos de algoritmos comuns representados em pseudocódigo:

### Calculando a Média de Três Números

```
ALGORITMO CalcularMedia
    // Declarações
    DECLARE num1, num2, num3, media COMO real
    
    // Entrada
    ESCREVA "Digite o primeiro número: "
    LEIA num1
    ESCREVA "Digite o segundo número: "
    LEIA num2
    ESCREVA "Digite o terceiro número: "
    LEIA num3
    
    // Processamento
    media ← (num1 + num2 + num3) / 3
    
    // Saída
    ESCREVA "A média é: ", media
FIM-ALGORITMO
```

### Verificando se um Número é Primo

```
ALGORITMO VerificarPrimo
    // Declarações
    DECLARE numero, i COMO inteiro
    DECLARE ehPrimo COMO booleano
    
    // Entrada
    ESCREVA "Digite um número: "
    LEIA numero
    
    // Processamento
    ehPrimo ← VERDADEIRO
    
    SE numero <= 1 ENTÃO
        ehPrimo ← FALSO
    SENÃO
        PARA i DE 2 ATÉ RAIZ_QUADRADA(numero) FAÇA
            SE numero % i = 0 ENTÃO
                ehPrimo ← FALSO
                SAIR // Sai do loop
            FIM-SE
        FIM-PARA
    FIM-SE
    
    // Saída
    SE ehPrimo ENTÃO
        ESCREVA numero, " é primo"
    SENÃO
        ESCREVA numero, " não é primo"
    FIM-SE
FIM-ALGORITMO
```

### Ordenando um Array (Algoritmo Bubble Sort)

```
ALGORITMO BubbleSort
    // Declarações
    DECLARE array[n] COMO inteiro
    DECLARE i, j, temp COMO inteiro
    
    // Entrada de dados
    PARA i DE 0 ATÉ n-1 FAÇA
        ESCREVA "Digite o elemento ", i, ": "
        LEIA array[i]
    FIM-PARA
    
    // Algoritmo de ordenação Bubble Sort
    PARA i DE 0 ATÉ n-2 FAÇA
        PARA j DE 0 ATÉ n-2-i FAÇA
            SE array[j] > array[j+1] ENTÃO
                // Troca os elementos
                temp ← array[j]
                array[j] ← array[j+1]
                array[j+1] ← temp
            FIM-SE
        FIM-PARA
    FIM-PARA
    
    // Saída
    ESCREVA "Array ordenado: "
    PARA i DE 0 ATÉ n-1 FAÇA
        ESCREVA array[i], " "
    FIM-PARA
FIM-ALGORITMO
```

## 4. Transição do Pseudocódigo para Código Real

Vamos ver como transformar pseudocódigo em JavaScript:

### Exemplo 1: Cálculo de Média

**Pseudocódigo:**
```
ALGORITMO CalcularMedia
    DECLARE num1, num2, num3, media COMO real
    
    ESCREVA "Digite o primeiro número: "
    LEIA num1
    ESCREVA "Digite o segundo número: "
    LEIA num2
    ESCREVA "Digite o terceiro número: "
    LEIA num3
    
    media ← (num1 + num2 + num3) / 3
    
    ESCREVA "A média é: ", media
FIM-ALGORITMO
```

**JavaScript:**
```javascript
function calcularMedia() {
  // Em um ambiente real, usaríamos prompt() ou input de formulário
  const num1 = parseFloat(prompt("Digite o primeiro número:"));
  const num2 = parseFloat(prompt("Digite o segundo número:"));
  const num3 = parseFloat(prompt("Digite o terceiro número:"));
  
  const media = (num1 + num2 + num3) / 3;
  
  console.log(`A média é: ${media.toFixed(2)}`);
  // Ou: alert(`A média é: ${media.toFixed(2)}`);
}

calcularMedia();
```

### Exemplo 2: Verificação de Número Primo

**Pseudocódigo:**
```
ALGORITMO VerificarPrimo
    DECLARE numero, i COMO inteiro
    DECLARE ehPrimo COMO booleano
    
    ESCREVA "Digite um número: "
    LEIA numero
    
    ehPrimo ← VERDADEIRO
    
    SE numero <= 1 ENTÃO
        ehPrimo ← FALSO
    SENÃO
        PARA i DE 2 ATÉ RAIZ_QUADRADA(numero) FAÇA
            SE numero % i = 0 ENTÃO
                ehPrimo ← FALSO
                SAIR
            FIM-SE
        FIM-PARA
    FIM-SE
    
    SE ehPrimo ENTÃO
        ESCREVA numero, " é primo"
    SENÃO
        ESCREVA numero, " não é primo"
    FIM-SE
FIM-ALGORITMO
```

**JavaScript:**
```javascript
function verificarPrimo() {
  const numero = parseInt(prompt("Digite um número:"));
  let ehPrimo = true;
  
  if (numero <= 1) {
    ehPrimo = false;
  } else {
    for (let i = 2; i <= Math.sqrt(numero); i++) {
      if (numero % i === 0) {
        ehPrimo = false;
        break;
      }
    }
  }
  
  if (ehPrimo) {
    console.log(`${numero} é primo`);
  } else {
    console.log(`${numero} não é primo`);
  }
}

verificarPrimo();
```

## 5. Técnicas Avançadas de Pseudocódigo

### Abstração e Refinamento Progressivo

Uma técnica poderosa é começar com um pseudocódigo de alto nível e refiná-lo progressivamente:

**Nível 1 (muito abstrato):**
```
ALGORITMO ResolverProblemaDasMochilas
    OBTER itens e capacidades
    ENCONTRAR melhor combinação de itens
    MOSTRAR resultado
FIM-ALGORITMO
```

**Nível 2 (mais detalhado):**
```
ALGORITMO ResolverProblemaDasMochilas
    OBTER lista de itens com pesos e valores
    OBTER capacidade máxima da mochila
    PARA cada possível combinação de itens FAÇA
        SE peso_total <= capacidade E valor_total é máximo ENTÃO
            GUARDAR como melhor combinação
        FIM-SE
    FIM-PARA
    MOSTRAR melhor combinação e valor total
FIM-ALGORITMO
```

**Nível 3 (quase código):**
```
ALGORITMO ResolverProblemaDasMochilas
    DECLARE itens[n] COMO registro {peso, valor}
    DECLARE capacidade, melhor_valor COMO inteiro
    DECLARE melhor_combo[n] COMO booleano
    
    // Leitura dos dados
    LEIA n
    PARA i DE 0 ATÉ n-1 FAÇA
        LEIA itens[i].peso, itens[i].valor
    FIM-PARA
    LEIA capacidade
    
    melhor_valor ← 0
    
    // Algoritmo de força bruta
    PARA cada subconjunto S de {0, 1, ..., n-1} FAÇA
        peso_total ← 0
        valor_total ← 0
        
        PARA cada i EM S FAÇA
            peso_total ← peso_total + itens[i].peso
            valor_total ← valor_total + itens[i].valor
        FIM-PARA
        
        SE peso_total <= capacidade E valor_total > melhor_valor ENTÃO
            melhor_valor ← valor_total
            PARA j DE 0 ATÉ n-1 FAÇA
                melhor_combo[j] ← (j ESTÁ EM S)
            FIM-PARA
        FIM-SE
    FIM-PARA
    
    // Mostrar resultado
    ESCREVA "Valor máximo:", melhor_valor
    ESCREVA "Itens selecionados:"
    PARA i DE 0 ATÉ n-1 FAÇA
        SE melhor_combo[i] ENTÃO
            ESCREVA i, " (peso: ", itens[i].peso, ", valor: ", itens[i].valor, ")"
        FIM-SE
    FIM-PARA
FIM-ALGORITMO
```

### Uso de Comentários e Anotações

Comentários ajudam a explicar intenções e detalhes não cobertos pelo pseudocódigo:

```
ALGORITMO CalcularPagamento
    // Este algoritmo calcula o salário líquido considerando:
    // - Horas trabalhadas (normais e extras)
    // - Taxa horária básica
    // - Adicional de 50% para horas extras
    // - Descontos de impostos (fixo em 15%)
    
    DECLARE horas_normais, horas_extras, taxa_horaria COMO real
    DECLARE salario_bruto, salario_liquido, imposto COMO real
    
    // Entrada de dados
    LEIA horas_normais, horas_extras, taxa_horaria
    
    // Cálculo do salário bruto
    salario_bruto ← (horas_normais * taxa_horaria) + 
                    (horas_extras * taxa_horaria * 1.5)
    
    // Cálculo do imposto (15% do salário bruto)
    imposto ← salario_bruto * 0.15
    
    // Cálculo do salário líquido
    salario_liquido ← salario_bruto - imposto
    
    // Saída
    ESCREVA "Salário bruto: ", salario_bruto
    ESCREVA "Imposto: ", imposto
    ESCREVA "Salário líquido: ", salario_liquido
FIM-ALGORITMO
```

### Modularização

Dividir algoritmos complexos em módulos menores e mais gerenciáveis:

```
ALGORITMO SistemaDeGerenciamentoDeBiblioteca
    // Algoritmo principal que coordena as operações
    ENQUANTO opcao != SAIR FAÇA
        opcao ← MostrarMenu()
        
        CASO opcao SEJA
            1: CadastrarLivro()
            2: CadastrarUsuario()
            3: EmprestarLivro()
            4: DevolverLivro()
            5: PesquisarLivro()
            6: GerarRelatorios()
            0: ESCREVA "Saindo do sistema..."
            OUTRO: ESCREVA "Opção inválida!"
        FIM-CASO
    FIM-ENQUANTO
FIM-ALGORITMO

FUNÇÃO MostrarMenu()
    ESCREVA "===== SISTEMA DE BIBLIOTECA ====="
    ESCREVA "1. Cadastrar Livro"
    ESCREVA "2. Cadastrar Usuário"
    ESCREVA "3. Emprestar Livro"
    ESCREVA "4. Devolver Livro"
    ESCREVA "5. Pesquisar Livro"
    ESCREVA "6. Gerar Relatórios"
    ESCREVA "0. Sair"
    ESCREVA "Escolha uma opção: "
    
    LEIA opcao
    RETORNAR opcao
FIM-FUNÇÃO

PROCEDIMENTO CadastrarLivro()
    // Detalhes do cadastro de livro
    DECLARE titulo, autor, isbn COMO texto
    DECLARE ano COMO inteiro
    
    ESCREVA "==== CADASTRO DE LIVRO ===="
    ESCREVA "Título: "
    LEIA titulo
    // ... mais código ...
    
    AdicionarLivroAoBancoDeDados(titulo, autor, isbn, ano)
    ESCREVA "Livro cadastrado com sucesso!"
FIM-PROCEDIMENTO

// Outros procedimentos e funções seguiriam o mesmo padrão
```

## Exercícios Práticos

### Exercício 1: Conversor de Temperatura

Escreva um pseudocódigo para um programa que converte temperatura entre Celsius e Fahrenheit. O programa deve:
1. Perguntar ao usuário qual direção de conversão (C para F ou F para C)
2. Solicitar a temperatura a ser convertida
3. Mostrar o resultado com uma mensagem apropriada

Fórmulas:
- F = C * 9/5 + 32
- C = (F - 32) * 5/9

### Exercício 2: Calculadora de Fatorial

Crie um pseudocódigo para calcular o fatorial de um número inteiro não-negativo. Lembre-se que:
- 0! = 1
- n! = n * (n-1) * (n-2) * ... * 1

O programa deve validar a entrada (garantir que é não-negativo) e informar um erro se a entrada for inválida.

### Exercício 3: Sistema de Login Simples

Escreva um pseudocódigo para um sistema de login simples que:
1. Tem um nome de usuário e senha predefinidos
2. Solicita ao usuário um nome de usuário e senha
3. Verifica se correspondem aos valores predefinidos
4. Permite apenas 3 tentativas antes de bloquear o acesso
5. Fornece feedback adequado em cada situação

### Exercício 4: Verificador de Palíndromo

Crie um pseudocódigo para verificar se uma palavra ou frase é um palíndromo (lê-se igual de trás para frente, ignorando espaços e pontuação). Por exemplo, "Ana", "Socorram-me, subi no ônibus em Marrocos" são palíndromos.

## Resumo

- **Pseudocódigo** é uma representação de alto nível de um algoritmo usando uma mistura de linguagem natural e estruturas de programação.
- Ele é **independente de linguagem**, permitindo que você se concentre na lógica antes de se preocupar com a sintaxe específica.
- Os **elementos básicos** incluem declarações, entrada/saída, estruturas condicionais, loops e funções.
- A **transição para código real** é um processo de tradução, adaptando o pseudocódigo para a sintaxe específica da linguagem escolhida.
- **Técnicas avançadas** como abstração, refinamento progressivo, comentários e modularização ajudam a lidar com problemas complexos.

O pseudocódigo é uma ferramenta valiosa no arsenal de qualquer programador, ajudando a planejar e comunicar ideias algorítmicas de forma clara e eficaz antes de mergulhar no código propriamente dito.

---

Com isto, concluímos o módulo de Fundamentos da Programação. Cada um dos tópicos abordados serve como base para os estudos mais avançados de estruturas de dados e algoritmos que virão nos próximos módulos. Continue praticando os conceitos aprendidos através dos exercícios para fortalecer seus conhecimentos!

Não se esqueça de revisar regularmente estes conceitos fundamentais, pois eles serão constantemente utilizados à medida que você avança em sua jornada de programação. 