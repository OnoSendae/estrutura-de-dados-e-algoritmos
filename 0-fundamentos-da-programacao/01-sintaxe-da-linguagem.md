# Sintaxe da Linguagem JavaScript/TypeScript

A sintaxe de uma linguagem de programação pode ser comparada à gramática de um idioma: ela define as regras sobre como escrever código que o computador possa entender. Nesta aula, aprenderemos os fundamentos da sintaxe do JavaScript/TypeScript.

## 1. Variáveis e Tipos de Dados

### Declarando Variáveis

Em JavaScript/TypeScript, podemos declarar variáveis de três formas:

```javascript
// usando var (forma antiga, evite usar)
var idade = 25;

// usando let (recomendado para variáveis que mudam de valor)
let nome = "Maria";

// usando const (para valores constantes que não mudam)
const PI = 3.14159;
```

**Analogia:** Pense em variáveis como caixas etiquetadas onde você guarda informações. O nome da variável é a etiqueta, e o valor é o que está dentro da caixa.

### Tipos de Dados Primitivos

JavaScript possui os seguintes tipos de dados primitivos:

```javascript
// String - textos
let mensagem = "Olá, mundo!";

// Number - números (inteiros e decimais)
let inteiro = 42;
let decimal = 3.14;

// Boolean - valores lógicos (verdadeiro ou falso)
let estaChovendo = false;
let solBrilhando = true;

// Undefined - valor não definido
let valorNaoAtribuido;

// Null - valor nulo (ausência intencional de valor)
let dadoVazio = null;

// Symbol - valor único e imutável
const simbolo = Symbol('descricao');

// BigInt - para números inteiros muito grandes
const numeroGrande = 9007199254740991n;
```

### TypeScript: Tipagem Estática

TypeScript adiciona tipagem estática ao JavaScript:

```typescript
// Declaração com tipo explícito
let nome: string = "João";
let idade: number = 30;
let ativo: boolean = true;

// Arrays tipados
let numeros: number[] = [1, 2, 3, 4, 5];
let nomes: Array<string> = ["Ana", "Bruno", "Carlos"];

// União de tipos
let identificador: string | number = 123;
identificador = "ABC123"; // válido

// Tipo any (evite quando possível)
let qualquerCoisa: any = 42;
qualquerCoisa = "texto"; // válido
```

**Analogia:** Se as variáveis são caixas, os tipos são como etiquetas que definem o que pode ser colocado dentro dessas caixas. Uma caixa do tipo "string" só pode conter textos, assim como uma caixa de sapatos não deve ser usada para guardar líquidos.

## 2. Operadores

### Operadores Aritméticos

```javascript
let a = 10;
let b = 3;

// Adição
let soma = a + b; // 13

// Subtração
let diferenca = a - b; // 7

// Multiplicação
let produto = a * b; // 30

// Divisão
let quociente = a / b; // 3.33...

// Módulo (resto da divisão)
let resto = a % b; // 1

// Exponenciação
let potencia = a ** b; // 1000

// Incremento
a++; // a = a + 1

// Decremento
b--; // b = b - 1
```

### Operadores de Comparação

```javascript
let x = 5;
let y = "5";

// Igualdade (verifica apenas valor)
console.log(x == y); // true

// Igualdade estrita (verifica valor e tipo)
console.log(x === y); // false

// Desigualdade
console.log(x != y); // false

// Desigualdade estrita
console.log(x !== y); // true

// Maior que
console.log(x > 3); // true

// Menor que
console.log(x < 10); // true

// Maior ou igual a
console.log(x >= 5); // true

// Menor ou igual a
console.log(x <= 4); // false
```

**Analogia:** Os operadores de comparação são como perguntas que fazemos sobre os valores. "Este número é maior que aquele?" ou "Estes dois valores são exatamente iguais?". A resposta sempre será verdadeira (true) ou falsa (false).

### Operadores Lógicos

```javascript
let chovendo = true;
let temGuardaChuva = false;

// E lógico (AND) - true apenas se ambos forem true
let vaiSeMolhar = chovendo && !temGuardaChuva; // true

// OU lógico (OR) - false apenas se ambos forem false
let ficaEmCasa = chovendo || estaCansado; // true

// NÃO lógico (NOT) - inverte o valor
let naoEstaChovendo = !chovendo; // false
```

**Analogia:** Operadores lógicos são como tomada de decisões condicionais:
- AND (&&): Só vou ao parque SE estiver ensolarado E SE eu tiver tempo livre.
- OR (||): Vou ficar em casa SE estiver chovendo OU SE eu estiver cansado.
- NOT (!): Se NÃO estiver chovendo, então vamos à praia.

## 3. Expressões e Declarações

### Expressões

Uma expressão é qualquer código válido que produz um valor:

```javascript
// Expressões aritméticas
let resultado = 5 + 3 * 2; // 11

// Expressões de string
let nomeCompleto = "Maria " + "Silva"; // "Maria Silva"

// Expressões de comparação
let maiorDeIdade = idade >= 18; // true ou false

// Expressões de função
let dobro = (x) => x * 2; // função que retorna o dobro
```

### Declarações

Declarações são instruções que executam ações (não produzem valores):

```javascript
// Declaração de variável
let contador;

// Declaração de atribuição
contador = 1;

// Declaração condicional
if (contador > 0) {
  console.log("Contador positivo");
}

// Declaração de loop
for (let i = 0; i < 5; i++) {
  console.log(i);
}
```

**Analogia:** Se o código fosse uma receita de bolo, as expressões seriam como "2 + 3 colheres de açúcar" (um cálculo que produz um valor), enquanto as declarações seriam como "Pré-aqueça o forno" ou "Misture os ingredientes" (ações a serem executadas).

## 4. Comentários e Boas Práticas

### Comentários

```javascript
// Comentário de linha única

/*
  Comentário de
  múltiplas linhas
*/

/**
 * Comentário de documentação (JSDoc)
 * @param {string} nome - Nome da pessoa
 * @returns {string} Mensagem de saudação
 */
function saudacao(nome) {
  return `Olá, ${nome}!`;
}
```

### Convenções de Nomenclatura

```javascript
// camelCase para variáveis e funções
let nomeCompleto = "João Silva";
function calcularMedia() { }

// PascalCase para classes
class ContaBancaria { }

// SNAKE_CASE_MAIÚSCULO para constantes
const TAXA_DE_JUROS = 0.05;

// Nomes descritivos
let idadeDoUsuario = 25; // Bom
let x = 25; // Ruim
```

### Indentação e Formato

```javascript
// Boa indentação
function calcularAreaRetangulo(largura, altura) {
  if (largura > 0 && altura > 0) {
    let area = largura * altura;
    return area;
  } else {
    return 0;
  }
}
```

**Analogia:** Boas práticas de codificação são como regras de etiqueta: elas não são obrigatórias para que o código funcione, mas tornam a vida de todos mais fácil, especialmente quando várias pessoas trabalham juntas.

## Exercícios Práticos

1. **Exercício Básico:** Declare variáveis para armazenar seu nome, idade, e se você está estudando programação (use os tipos apropriados).

2. **Exercício Intermediário:** Escreva expressões para calcular:
   - A área de um círculo com raio 5
   - O volume de um cubo com lado 3
   - A média de três notas: 7, 8 e 9

3. **Exercício Avançado:** Refatore o seguinte código seguindo boas práticas:

```javascript
var x = 10;
var y = "20";
var z = x + parseInt(y);
if(z>25) { console.log("maior");} else {console.log("menor");}
```

## Resumo

- Variáveis são declaradas com `let`, `const` ou `var`
- JavaScript tem tipos primitivos como string, number, boolean
- TypeScript adiciona tipagem estática opcional
- Operadores permitem realizar cálculos e comparações
- Expressões produzem valores, declarações executam ações
- Boas práticas de codificação tornam o código mais legível e manutenível

---

No [próximo tópico](./02-estruturas-de-controle.md), aprenderemos sobre estruturas de controle como condicionais e loops, que nos permitirão criar lógicas mais complexas em nossos programas. 