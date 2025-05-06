# Estruturas de Controle

As estruturas de controle são como o "cérebro" de qualquer programa: elas determinam qual caminho o código deve seguir baseado em condições e permitem que ações sejam repetidas. Sem estruturas de controle, os programas seriam lineares e limitados, executando sempre as mesmas instruções na mesma ordem.

## 1. Estruturas Condicionais

### if / else

A estrutura `if/else` permite executar diferentes blocos de código dependendo de uma condição:

```javascript
let temperatura = 30;

if (temperatura > 30) {
  console.log("Está muito quente!");
} else if (temperatura > 20) {
  console.log("Está agradável.");
} else {
  console.log("Está frio.");
}
```

**Analogia:** O `if/else` funciona como uma bifurcação em uma estrada. Dependendo da condição (sinalização), você segue por um caminho ou outro.

### Operador Ternário

Uma forma concisa de escrever condicionais simples:

```javascript
let idade = 19;
let status = idade >= 18 ? "Adulto" : "Menor de idade";
// Equivalente a:
// if (idade >= 18) {
//   status = "Adulto";
// } else {
//   status = "Menor de idade";
// }
```

**Analogia:** O operador ternário é como um interruptor de duas posições: dependendo da condição, ele seleciona um dos dois valores possíveis.

### Switch

Quando temos várias condições para verificar o mesmo valor, o `switch` pode ser mais legível:

```javascript
let diaDaSemana = 3;
let nomeDoDia;

switch (diaDaSemana) {
  case 1:
    nomeDoDia = "Domingo";
    break;
  case 2:
    nomeDoDia = "Segunda-feira";
    break;
  case 3:
    nomeDoDia = "Terça-feira";
    break;
  case 4:
    nomeDoDia = "Quarta-feira";
    break;
  case 5:
    nomeDoDia = "Quinta-feira";
    break;
  case 6:
    nomeDoDia = "Sexta-feira";
    break;
  case 7:
    nomeDoDia = "Sábado";
    break;
  default:
    nomeDoDia = "Dia inválido";
}

console.log(nomeDoDia); // Terça-feira
```

**Importante:** Não esqueça o `break` em cada caso, ou a execução continuará para os casos seguintes!

**Analogia:** O `switch` é como um painel de controle com vários botões numerados. Você pressiona um número e a máquina executa a ação correspondente.

### Truthy e Falsy

Em JavaScript, valores não booleanos são convertidos implicitamente para `true` ou `false` quando usados em contextos booleanos:

```javascript
// Valores Falsy (avaliados como false):
if (0) { /* não executa */ }
if ("") { /* não executa */ }
if (null) { /* não executa */ }
if (undefined) { /* não executa */ }
if (NaN) { /* não executa */ }
if (false) { /* não executa */ }

// Valores Truthy (avaliados como true):
if (1) { /* executa */ }
if ("texto") { /* executa */ }
if ([]) { /* executa */ }
if ({}) { /* executa */ }
if (function(){}) { /* executa */ }
if (true) { /* executa */ }
```

**Analogia:** Em português, quando alguém pergunta "Tem açúcar?", responder "Um pouco" significa "sim" (truthy), enquanto responder "Nenhum" significa "não" (falsy).

## 2. Estruturas de Repetição (Loops)

### Loop for

O loop `for` é usado quando sabemos antecipadamente quantas vezes queremos repetir um bloco de código:

```javascript
// Estrutura: for (inicialização; condição; incremento)
for (let i = 0; i < 5; i++) {
  console.log(`Iteração ${i}`);
}
// Saída:
// Iteração 0
// Iteração 1
// Iteração 2
// Iteração 3
// Iteração 4
```

**Anatomia do loop for:**
1. **Inicialização:** `let i = 0` - executa uma vez no início
2. **Condição:** `i < 5` - verificada antes de cada iteração
3. **Incremento:** `i++` - executa após cada iteração
4. **Corpo:** o código dentro das chaves

**Analogia:** O loop `for` é como contar até um número específico: você começa em um valor inicial, verifica se já chegou ao final, executa uma ação e então avança para o próximo número.

### Loop while

O loop `while` é usado quando não sabemos exatamente quantas repetições serão necessárias, mas sabemos a condição para continuar:

```javascript
let contador = 0;

while (contador < 5) {
  console.log(`Contador: ${contador}`);
  contador++;
}
```

**Analogia:** O loop `while` é como uma roleta russa: você verifica se há uma condição para continuar (a arma não disparou), executa uma ação (puxar o gatilho), e repete até que a condição se torne falsa (a arma dispara).

### Loop do-while

Similar ao `while`, mas garante que o bloco de código seja executado pelo menos uma vez, já que a condição é verificada apenas no final:

```javascript
let numero = 10;

do {
  console.log(`Número: ${numero}`);
  numero--;
} while (numero > 0);
```

**Analogia:** O loop `do-while` é como experimentar um novo restaurante: primeiro você come (executa o código), depois decide se volta novamente (verifica a condição).

### Loop for...of

Introduzido no ES6, é uma forma simplificada de iterar sobre elementos de uma coleção (arrays, strings, etc.):

```javascript
const frutas = ["maçã", "banana", "laranja"];

for (const fruta of frutas) {
  console.log(`Eu gosto de ${fruta}`);
}
// Saída:
// Eu gosto de maçã
// Eu gosto de banana
// Eu gosto de laranja
```

**Analogia:** O `for...of` é como pegar itens de uma cesta um por um: você não se preocupa com a posição ou contagem, apenas trabalha com cada item individualmente.

### Loop for...in

Usado para iterar sobre as propriedades enumeráveis de um objeto:

```javascript
const pessoa = {
  nome: "Carlos",
  idade: 28,
  profissao: "Desenvolvedor"
};

for (const propriedade in pessoa) {
  console.log(`${propriedade}: ${pessoa[propriedade]}`);
}
// Saída:
// nome: Carlos
// idade: 28
// profissao: Desenvolvedor
```

**Analogia:** O `for...in` é como revistar os bolsos de um casaco procurando o que está em cada um: você verifica cada compartimento (propriedade) e o que ele contém (valor).

## 3. Controle de Fluxo em Loops

### break

O comando `break` interrompe completamente a execução de um loop:

```javascript
for (let i = 0; i < 10; i++) {
  if (i === 5) {
    console.log("Encontrei o 5! Saindo do loop...");
    break;
  }
  console.log(`Número: ${i}`);
}
// Saída:
// Número: 0
// Número: 1
// Número: 2
// Número: 3
// Número: 4
// Encontrei o 5! Saindo do loop...
```

**Analogia:** O `break` é como um botão de emergência que para uma máquina imediatamente.

### continue

O comando `continue` pula a iteração atual e avança para a próxima:

```javascript
for (let i = 0; i < 5; i++) {
  if (i === 2) {
    console.log("Pulando o número 2...");
    continue;
  }
  console.log(`Número: ${i}`);
}
// Saída:
// Número: 0
// Número: 1
// Pulando o número 2...
// Número: 3
// Número: 4
```

**Analogia:** O `continue` é como encontrar uma página rasgada em um livro: você a pula e continua lendo a partir da próxima.

## 4. Aninhamento de Estruturas

É possível colocar estruturas de controle dentro de outras, criando lógicas mais complexas:

### Condicionais Aninhadas

```javascript
let temperatura = 28;
let umidade = 80;

if (temperatura > 25) {
  if (umidade > 70) {
    console.log("Está quente e úmido!");
  } else {
    console.log("Está quente, mas a umidade está ok.");
  }
} else {
  if (umidade > 70) {
    console.log("A temperatura está agradável, mas está úmido.");
  } else {
    console.log("Clima perfeito!");
  }
}
```

### Loops Aninhados

```javascript
// Padrão de triângulo
for (let linha = 1; linha <= 5; linha++) {
  let padrao = "";
  for (let coluna = 1; coluna <= linha; coluna++) {
    padrao += "* ";
  }
  console.log(padrao);
}
// Saída:
// * 
// * * 
// * * * 
// * * * * 
// * * * * * 
```

**Analogia:** Estruturas aninhadas são como caixas dentro de caixas. Para chegar ao conteúdo mais interno, você precisa abrir uma caixa, depois outra dentro dela, e assim por diante.

## 5. Guard Clauses

Uma técnica para melhorar a legibilidade do código e reduzir o aninhamento é usar "cláusulas de guarda" - retornos ou saídas antecipados:

```javascript
// Abordagem com aninhamento profundo
function verificarAcesso(usuario) {
  if (usuario) {
    if (usuario.ativo) {
      if (usuario.permissoes.includes('admin')) {
        return "Acesso concedido";
      } else {
        return "Acesso negado: precisa de permissão de administrador";
      }
    } else {
      return "Acesso negado: usuário inativo";
    }
  } else {
    return "Acesso negado: usuário não encontrado";
  }
}

// Mesmo código com guard clauses
function verificarAcessoMelhorado(usuario) {
  if (!usuario) {
    return "Acesso negado: usuário não encontrado";
  }
  
  if (!usuario.ativo) {
    return "Acesso negado: usuário inativo";
  }
  
  if (!usuario.permissoes.includes('admin')) {
    return "Acesso negado: precisa de permissão de administrador";
  }
  
  return "Acesso concedido";
}
```

**Analogia:** Guard clauses são como verificar os pré-requisitos para entrar em um clube exclusivo: em vez de verificar todas as condições para entrada, você elimina rapidamente quem não atende a cada requisito, deixando apenas os verdadeiramente elegíveis seguirem adiante.

## Exercícios Práticos

### Exercício 1: Básico - Verificador de Números

Escreva um programa que recebe um número e verifica:
- Se é positivo, negativo ou zero
- Se é par ou ímpar 
- Se é primo (divisível apenas por 1 e por ele mesmo)

```javascript
// Comece com:
function analisarNumero(numero) {
  // Seu código aqui
}

// Teste com:
analisarNumero(7);
analisarNumero(10);
analisarNumero(0);
analisarNumero(-5);
```

### Exercício 2: Intermediário - Padrão de Asteriscos

Crie uma função que desenhe os seguintes padrões baseados no número de linhas (n):

1. Triângulo retângulo à esquerda
```
*
**
***
****
*****
```

2. Triângulo retângulo à direita
```
    *
   **
  ***
 ****
*****
```

3. Pirâmide
```
    *
   ***
  *****
 *******
*********
```

### Exercício 3: Avançado - Jogo de Adivinhação

Implemente um jogo onde o computador "pensa" em um número entre 1 e 100, e você tenta adivinhar. O programa deve dar dicas se o palpite está alto ou baixo, e contar quantas tentativas foram necessárias.

```javascript
function jogoAdivinhacao() {
  // Gere um número aleatório entre 1 e 100
  const numeroSecreto = Math.floor(Math.random() * 100) + 1;
  let tentativas = 0;
  let acertou = false;
  
  // Simule os palpites (em um programa real, usaríamos input do usuário)
  while (!acertou) {
    // Seu código aqui
  }
  
  return `Parabéns! Você acertou em ${tentativas} tentativas.`;
}
```

## Resumo

- **Estruturas Condicionais** (if/else, switch, operador ternário) permitem que seu código tome decisões.
- **Estruturas de Repetição** (for, while, do-while, for...of, for...in) permitem executar um bloco de código várias vezes.
- **Controle de Fluxo** (break, continue) dá mais flexibilidade ao controle de loops.
- **Aninhamento de Estruturas** permite criar lógicas mais complexas combinando condicionais e loops.
- **Guard Clauses** ajudam a melhorar a legibilidade e manutenção do código.

As estruturas de controle são ferramentas fundamentais que você usará constantemente em sua jornada de programação, independentemente da linguagem ou paradigma que escolher.

---

No [próximo tópico](./03-funcoes.md), veremos como organizar nosso código em funções reutilizáveis que ajudam a modularizar nosso programa e torná-lo mais manutenível. 