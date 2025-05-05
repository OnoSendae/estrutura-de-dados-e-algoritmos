// =================================================
// EXEMPLOS DE PSEUDOCÓDIGO E IMPLEMENTAÇÕES EM JS
// =================================================

// Este arquivo contém exemplos de pseudocódigo seguidos
// pelas suas implementações correspondentes em JavaScript

// ===================================================
// EXEMPLO 1: CALCULANDO A MÉDIA DE TRÊS NÚMEROS
// ===================================================

/*
PSEUDOCÓDIGO:

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
*/

// IMPLEMENTAÇÃO EM JAVASCRIPT:
function calcularMedia() {
    console.log("=== CALCULANDO A MÉDIA DE TRÊS NÚMEROS ===");
    
    // Em um ambiente real, usaríamos prompt() ou input de formulário
    // Aqui vamos simular a entrada para fins de demonstração
    const num1 = 7.5;
    const num2 = 8.0;
    const num3 = 6.5;
    
    console.log(`Primeiro número: ${num1}`);
    console.log(`Segundo número: ${num2}`);
    console.log(`Terceiro número: ${num3}`);
    
    // Processamento
    const media = (num1 + num2 + num3) / 3;
    
    // Saída
    console.log(`A média é: ${media.toFixed(2)}`);
    
    return media;
}

// Executar a função
calcularMedia();

// ===================================================
// EXEMPLO 2: VERIFICANDO SE UM NÚMERO É PRIMO
// ===================================================

/*
PSEUDOCÓDIGO:

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
*/

// IMPLEMENTAÇÃO EM JAVASCRIPT:
function verificarPrimo(numero) {
    console.log("\n=== VERIFICANDO SE UM NÚMERO É PRIMO ===");
    console.log(`Número a verificar: ${numero}`);
    
    // Processamento
    let ehPrimo = true;
    
    if (numero <= 1) {
        ehPrimo = false;
    } else {
        for (let i = 2; i <= Math.sqrt(numero); i++) {
            if (numero % i === 0) {
                ehPrimo = false;
                break; // Sai do loop
            }
        }
    }
    
    // Saída
    if (ehPrimo) {
        console.log(`${numero} é primo`);
    } else {
        console.log(`${numero} não é primo`);
    }
    
    return ehPrimo;
}

// Testar com diferentes números
verificarPrimo(7);   // Deve ser primo
verificarPrimo(10);  // Não deve ser primo
verificarPrimo(13);  // Deve ser primo
verificarPrimo(1);   // Não deve ser primo por definição

// ===================================================
// EXEMPLO 3: ORDENANDO UM ARRAY (BUBBLE SORT)
// ===================================================

/*
PSEUDOCÓDIGO:

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
*/

// IMPLEMENTAÇÃO EM JAVASCRIPT:
function bubbleSort(array) {
    console.log("\n=== ORDENANDO UM ARRAY COM BUBBLE SORT ===");
    console.log("Array original:", array);
    
    // Clone o array para não modificar o original
    const arr = [...array];
    const n = arr.length;
    
    // Algoritmo Bubble Sort
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                // Troca os elementos (usando destructuring assignment do ES6)
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    
    console.log("Array ordenado:", arr);
    return arr;
}

// Testar com um array
const arrayDesordenado = [64, 25, 12, 22, 11];
bubbleSort(arrayDesordenado);

// ===================================================
// EXEMPLO 4: CONVERSOR DE TEMPERATURA
// ===================================================

/*
PSEUDOCÓDIGO:

ALGORITMO ConversorTemperatura
    // Declarações
    DECLARE temperatura, resultado COMO real
    DECLARE unidade COMO caractere
    
    // Entrada
    ESCREVA "Digite a temperatura: "
    LEIA temperatura
    ESCREVA "Digite a unidade (C para Celsius, F para Fahrenheit): "
    LEIA unidade
    
    // Processamento
    SE unidade = "C" ENTÃO
        resultado ← temperatura * 9/5 + 32
        ESCREVA temperatura, "°C é igual a ", resultado, "°F"
    SENÃO SE unidade = "F" ENTÃO
        resultado ← (temperatura - 32) * 5/9
        ESCREVA temperatura, "°F é igual a ", resultado, "°C"
    SENÃO
        ESCREVA "Unidade inválida. Use C para Celsius ou F para Fahrenheit."
    FIM-SE
FIM-ALGORITMO
*/

// IMPLEMENTAÇÃO EM JAVASCRIPT:
function conversorTemperatura(temperatura, unidade) {
    console.log("\n=== CONVERSOR DE TEMPERATURA ===");
    console.log(`Temperatura: ${temperatura}`);
    console.log(`Unidade: ${unidade}`);
    
    let resultado;
    
    // Processamento
    if (unidade.toUpperCase() === "C") {
        resultado = temperatura * 9/5 + 32;
        console.log(`${temperatura}°C é igual a ${resultado.toFixed(2)}°F`);
    } else if (unidade.toUpperCase() === "F") {
        resultado = (temperatura - 32) * 5/9;
        console.log(`${temperatura}°F é igual a ${resultado.toFixed(2)}°C`);
    } else {
        console.log("Unidade inválida. Use C para Celsius ou F para Fahrenheit.");
        return null;
    }
    
    return resultado;
}

// Testar conversões
conversorTemperatura(32, "F"); // Deve ser 0°C
conversorTemperatura(100, "C"); // Deve ser 212°F
conversorTemperatura(25, "X"); // Deve mostrar erro

// ===================================================
// EXEMPLO 5: CALCULADORA DE FATORIAL
// ===================================================

/*
PSEUDOCÓDIGO:

ALGORITMO CalcularFatorial
    // Declarações
    DECLARE numero, fatorial, i COMO inteiro
    
    // Entrada
    ESCREVA "Digite um número não-negativo: "
    LEIA numero
    
    // Validação
    SE numero < 0 ENTÃO
        ESCREVA "Erro: O número não pode ser negativo."
        RETORNAR
    FIM-SE
    
    // Processamento
    fatorial ← 1
    
    // Caso especial: 0! = 1
    SE numero > 0 ENTÃO
        PARA i DE 1 ATÉ numero FAÇA
            fatorial ← fatorial * i
        FIM-PARA
    FIM-SE
    
    // Saída
    ESCREVA numero, "! = ", fatorial
FIM-ALGORITMO
*/

// IMPLEMENTAÇÃO EM JAVASCRIPT:
function calcularFatorial(numero) {
    console.log("\n=== CALCULADORA DE FATORIAL ===");
    console.log(`Número: ${numero}`);
    
    // Validação
    if (numero < 0) {
        console.log("Erro: O número não pode ser negativo.");
        return null;
    }
    
    // Processamento
    let fatorial = 1;
    
    // Caso especial: 0! = 1 (já está inicializado como 1)
    if (numero > 0) {
        for (let i = 1; i <= numero; i++) {
            fatorial *= i;
        }
    }
    
    console.log(`${numero}! = ${fatorial}`);
    return fatorial;
}

// Testar fatorial
calcularFatorial(5);  // Deve ser 120
calcularFatorial(0);  // Deve ser 1
calcularFatorial(1);  // Deve ser 1
calcularFatorial(-1); // Deve mostrar erro

// ===================================================
// EXEMPLO 6: SISTEMA DE LOGIN SIMPLES
// ===================================================

/*
PSEUDOCÓDIGO:

ALGORITMO SistemaDeLogin
    // Declarações
    DECLARE usuarioCorreto, senhaCorreta COMO texto
    DECLARE usuario, senha COMO texto
    DECLARE tentativas, maxTentativas COMO inteiro
    DECLARE loginSucesso COMO booleano
    
    // Inicialização
    usuarioCorreto ← "admin"
    senhaCorreta ← "senha123"
    tentativas ← 0
    maxTentativas ← 3
    loginSucesso ← FALSO
    
    // Processo de login
    ENQUANTO tentativas < maxTentativas E NÃO loginSucesso FAÇA
        // Entrada
        ESCREVA "Digite o nome de usuário: "
        LEIA usuario
        ESCREVA "Digite a senha: "
        LEIA senha
        
        // Verificação
        SE usuario = usuarioCorreto E senha = senhaCorreta ENTÃO
            loginSucesso ← VERDADEIRO
            ESCREVA "Login bem-sucedido! Bem-vindo, ", usuario, "!"
        SENÃO
            tentativas ← tentativas + 1
            ESCREVA "Credenciais inválidas. Tentativas restantes: ", (maxTentativas - tentativas)
        FIM-SE
    FIM-ENQUANTO
    
    // Verificação final
    SE NÃO loginSucesso ENTÃO
        ESCREVA "Número máximo de tentativas excedido. Conta bloqueada."
    FIM-SE
FIM-ALGORITMO
*/

// IMPLEMENTAÇÃO EM JAVASCRIPT:
function sistemaDeLogin() {
    console.log("\n=== SISTEMA DE LOGIN ===");
    
    // Declarações e inicialização
    const usuarioCorreto = "admin";
    const senhaCorreta = "senha123";
    let tentativas = 0;
    const maxTentativas = 3;
    let loginSucesso = false;
    
    // Simulação de entrada para demonstração
    const entradas = [
        { usuario: "admin", senha: "senha456" }, // Tentativa 1 - Senha incorreta
        { usuario: "administrador", senha: "senha123" }, // Tentativa 2 - Usuário incorreto
        { usuario: "admin", senha: "senha123" }  // Tentativa 3 - Correto
    ];
    
    // Processo de login
    while (tentativas < maxTentativas && !loginSucesso) {
        // Obter entrada simulada
        const entrada = entradas[tentativas];
        console.log(`Tentativa ${tentativas + 1}:`);
        console.log(`Nome de usuário: ${entrada.usuario}`);
        console.log(`Senha: ${"*".repeat(entrada.senha.length)}`);
        
        // Verificação
        if (entrada.usuario === usuarioCorreto && entrada.senha === senhaCorreta) {
            loginSucesso = true;
            console.log(`Login bem-sucedido! Bem-vindo, ${entrada.usuario}!`);
        } else {
            tentativas++;
            console.log(`Credenciais inválidas. Tentativas restantes: ${maxTentativas - tentativas}`);
        }
    }
    
    // Verificação final
    if (!loginSucesso) {
        console.log("Número máximo de tentativas excedido. Conta bloqueada.");
    }
    
    return loginSucesso;
}

// Executar o sistema de login
sistemaDeLogin();

// ===================================================
// EXEMPLO 7: VERIFICADOR DE PALÍNDROMO
// ===================================================

/*
PSEUDOCÓDIGO:

ALGORITMO VerificarPalindromo
    // Declarações
    DECLARE texto, textoLimpo, textoInvertido COMO texto
    DECLARE i COMO inteiro
    DECLARE ehPalindromo COMO booleano
    
    // Entrada
    ESCREVA "Digite um texto para verificar se é palíndromo: "
    LEIA texto
    
    // Pré-processamento (remover espaços, pontuação e converter para minúsculas)
    textoLimpo ← ""
    PARA i DE 0 ATÉ TAMANHO(texto) - 1 FAÇA
        SE texto[i] É UMA LETRA OU NÚMERO ENTÃO
            textoLimpo ← textoLimpo + MINUSCULA(texto[i])
        FIM-SE
    FIM-PARA
    
    // Inverter o texto limpo
    textoInvertido ← ""
    PARA i DE TAMANHO(textoLimpo) - 1 ATÉ 0 PASSO -1 FAÇA
        textoInvertido ← textoInvertido + textoLimpo[i]
    FIM-PARA
    
    // Verificar se é palíndromo
    ehPalindromo ← (textoLimpo = textoInvertido)
    
    // Saída
    SE ehPalindromo ENTÃO
        ESCREVA "\"", texto, "\" é um palíndromo!"
    SENÃO
        ESCREVA "\"", texto, "\" não é um palíndromo."
    FIM-SE
FIM-ALGORITMO
*/

// IMPLEMENTAÇÃO EM JAVASCRIPT:
function verificarPalindromo(texto) {
    console.log("\n=== VERIFICADOR DE PALÍNDROMO ===");
    console.log(`Texto original: "${texto}"`);
    
    // Pré-processamento (remover espaços, pontuação e converter para minúsculas)
    const textoLimpo = texto.toLowerCase().replace(/[^a-z0-9]/g, "");
    
    // Inverter o texto limpo
    const textoInvertido = textoLimpo.split("").reverse().join("");
    
    // Verificar se é palíndromo
    const ehPalindromo = textoLimpo === textoInvertido;
    
    // Saída
    if (ehPalindromo) {
        console.log(`"${texto}" é um palíndromo!`);
    } else {
        console.log(`"${texto}" não é um palíndromo.`);
    }
    
    return ehPalindromo;
}

// Testar palíndromos
verificarPalindromo("Ana"); // Deve ser palíndromo
verificarPalindromo("arara"); // Deve ser palíndromo
verificarPalindromo("Socorram-me, subi no ônibus em Marrocos"); // Deve ser palíndromo
verificarPalindromo("JavaScript"); // Não deve ser palíndromo 