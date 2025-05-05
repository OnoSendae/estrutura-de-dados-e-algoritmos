// ==========================================
// EXEMPLOS DE SINTAXE BÁSICA EM JAVASCRIPT
// ==========================================

// 1. DECLARAÇÃO E ATRIBUIÇÃO DE VARIÁVEIS
// ---------------------------------------

// Usando let (variáveis que podem mudar)
let nome = "Ana";
let idade = 25;
let salario = 3500.50;
let estaChovendo = false;

// Usando const (valores constantes)
const PI = 3.14159;
const DIAS_DA_SEMANA = 7;
const MEU_NOME = "Carlos";

// Usando var (forma antiga, evite usar)
var contador = 0;

// Declarar sem atribuir (undefined)
let valorNaoDefinido;
console.log("Valor não definido:", valorNaoDefinido);

// 2. TIPOS DE DADOS PRIMITIVOS
// ---------------------------

// String (texto)
let mensagem = "Olá, mundo!";
let aspasSimples = 'Também funciona';
let templateString = `${nome} tem ${idade} anos`; // Template string (ES6+)

// Number (números)
let inteiro = 42;
let decimal = 3.14;
let negativo = -10;
let exponencial = 1.25e6; // 1.25 * 10^6 = 1250000

// Boolean (verdadeiro/falso)
let ativo = true;
let maiorDeIdade = idade >= 18;

// undefined e null
let naoDefinido; // undefined (valor não atribuído)
let valorNulo = null; // ausência intencional de valor

// Symbol (valor único)
const simbolo = Symbol('descrição');
const outroSimbolo = Symbol('descrição'); // Mesmo que o anterior, mas são diferentes
console.log("Símbolos são iguais?", simbolo === outroSimbolo); // false

// BigInt (números inteiros grandes)
const numeroGrande = 9007199254740991n; // o 'n' ao final define um BigInt

// 3. OPERADORES
// ------------

// Operadores aritméticos
let soma = 5 + 3;         // 8
let subtracao = 10 - 4;   // 6
let multiplicacao = 3 * 4; // 12
let divisao = 10 / 2;     // 5
let resto = 10 % 3;       // 1 (resto da divisão)
let potencia = 2 ** 3;    // 8 (2 elevado a 3)

// Operadores de incremento/decremento
let x = 5;
x++; // x = x + 1 (pós-incremento)
console.log("x após incremento:", x); // 6

let y = 8;
--y; // y = y - 1 (pré-decremento)
console.log("y após decremento:", y); // 7

// Operadores de atribuição combinada
let z = 10;
z += 5; // z = z + 5
console.log("z após +=:", z); // 15

// Operadores de comparação
let a = 5;
let b = "5";

console.log("a == b:", a == b);   // true (compara valor, ignora tipo)
console.log("a === b:", a === b); // false (compara valor E tipo)
console.log("a != b:", a != b);   // false
console.log("a !== b:", a !== b); // true
console.log("a > 3:", a > 3);     // true
console.log("a <= 5:", a <= 5);   // true

// Operadores lógicos
let temDinheiro = true;
let temTempo = false;

console.log("AND lógico:", temDinheiro && temTempo); // false (ambos precisam ser true)
console.log("OR lógico:", temDinheiro || temTempo);  // true (pelo menos um precisa ser true)
console.log("NOT lógico:", !temDinheiro);            // false (inverte o valor)

// 4. CONVERSÃO ENTRE TIPOS
// -----------------------

// String para Number
let numeroTexto = "42";
let numeroConvertido = Number(numeroTexto); // 42
let numeroParseInt = parseInt(numeroTexto); // 42
let numeroParseFloat = parseFloat("3.14"); // 3.14

// Number para String
let num = 100;
let numComoString = String(num); // "100"
let numToString = num.toString(); // "100"

// Para Boolean
console.log("Boolean(0):", Boolean(0)); // false
console.log("Boolean(1):", Boolean(1)); // true
console.log("Boolean(''):", Boolean("")); // false
console.log("Boolean('texto'):", Boolean("texto")); // true

// 5. EXEMPLOS DE EXPRESSÕES E DECLARAÇÕES
// -------------------------------------

// Expressões (produzem um valor)
let resultado = 10 + 5 * 2; // 20
let nomeCompleto = nome + " Silva"; // "Ana Silva"
let ehAdulto = idade >= 18; // true

// Função como expressão
let quadrado = function(n) { return n * n; };
console.log("O quadrado de 4 é:", quadrado(4)); // 16

// Declarações (executam uma ação)
if (idade >= 18) {
    console.log(nome + " é maior de idade.");
} else {
    console.log(nome + " é menor de idade.");
}

// 6. DEMONSTRAÇÃO DE ESCOPO
// -----------------------

function demonstrarEscopo() {
    let variavelLocal = "Só visível dentro da função";
    
    if (true) {
        let blocoVar = "Visível apenas neste bloco";
        var funcaoVar = "Visível em toda a função";
        
        console.log(blocoVar); // Funciona
        console.log(variavelLocal); // Funciona
    }
    
    console.log(funcaoVar); // Funciona (var tem escopo de função)
    // console.log(blocoVar); // Erro (fora do escopo)
}

demonstrarEscopo();

// 7. EXERCÍCIO PRÁTICO RESOLVIDO
// ----------------------------

// Exercício: Calcular IMC (Índice de Massa Corporal)
function calcularIMC(peso, altura) {
    // Fórmula: IMC = peso / (altura * altura)
    const imc = peso / (altura * altura);
    
    let classificacao;
    
    if (imc < 18.5) {
        classificacao = "Abaixo do peso";
    } else if (imc < 25) {
        classificacao = "Peso normal";
    } else if (imc < 30) {
        classificacao = "Sobrepeso";
    } else if (imc < 35) {
        classificacao = "Obesidade Grau I";
    } else if (imc < 40) {
        classificacao = "Obesidade Grau II";
    } else {
        classificacao = "Obesidade Grau III";
    }
    
    return {
        imc: imc.toFixed(2),
        classificacao: classificacao
    };
}

const resultadoIMC = calcularIMC(70, 1.75);
console.log(`IMC: ${resultadoIMC.imc} - Classificação: ${resultadoIMC.classificacao}`);

// Saída esperada: "IMC: 22.86 - Classificação: Peso normal" 