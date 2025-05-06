// ============================================
// EXEMPLOS DE ESTRUTURAS DE CONTROLE EM JAVASCRIPT
// ============================================

// 1. ESTRUTURAS CONDICIONAIS
// -------------------------

// if/else simples
const idade = 17;

if (idade >= 18) {
    console.log("Maior de idade");
} else {
    console.log("Menor de idade");
}

// if/else if/else (múltiplas condições)
const hora = 14;

if (hora < 12) {
    console.log("Bom dia!");
} else if (hora < 18) {
    console.log("Boa tarde!");
} else {
    console.log("Boa noite!");
}

// Condicionais aninhados
const temCarteira = true;
const acompanhadoPais = true;

if (idade >= 18) {
    if (temCarteira) {
        console.log("Pode dirigir");
    } else {
        console.log("Não pode dirigir (precisa de carteira)");
    }
} else {
    if (acompanhadoPais) {
        console.log("Menor de idade, mas pode entrar no evento acompanhado");
    } else {
        console.log("Menor de idade e sem acompanhante. Não pode entrar.");
    }
}

// Operador ternário
const status = idade >= 18 ? "Adulto" : "Menor";
console.log("Status:", status);

// Ternários aninhados (evite quando possível, prejudica legibilidade)
const mensagem = idade >= 18 
    ? temCarteira ? "Pode dirigir" : "Não tem carteira" 
    : "Não pode dirigir (menor de idade)";
console.log(mensagem);

// Estrutura switch
const diaSemana = 3;
let nomeDia;

switch (diaSemana) {
    case 1:
        nomeDia = "Domingo";
        break;
    case 2:
        nomeDia = "Segunda-feira";
        break;
    case 3:
        nomeDia = "Terça-feira";
        break;
    case 4:
        nomeDia = "Quarta-feira";
        break;
    case 5:
        nomeDia = "Quinta-feira";
        break;
    case 6:
        nomeDia = "Sexta-feira";
        break;
    case 7:
        nomeDia = "Sábado";
        break;
    default:
        nomeDia = "Dia inválido";
}

console.log(`Hoje é ${nomeDia}`);

// Switch com agrupamento (sem break)
const mes = 7;
let estacao;

switch (mes) {
    case 12:
    case 1:
    case 2:
        estacao = "Verão";
        break;
    case 3:
    case 4:
    case 5:
        estacao = "Outono";
        break;
    case 6:
    case 7:
    case 8:
        estacao = "Inverno";
        break;
    case 9:
    case 10:
    case 11:
        estacao = "Primavera";
        break;
    default:
        estacao = "Mês inválido";
}

console.log(`Estamos no ${estacao}`);

// Valores Truthy e Falsy
console.log("\nValores Truthy e Falsy:");

// Falsy values
console.log("Boolean(0):", Boolean(0));
console.log("Boolean(''):", Boolean(""));
console.log("Boolean(null):", Boolean(null));
console.log("Boolean(undefined):", Boolean(undefined));
console.log("Boolean(NaN):", Boolean(NaN));
console.log("Boolean(false):", Boolean(false));

// Truthy values
console.log("Boolean(1):", Boolean(1));
console.log("Boolean('texto'):", Boolean("texto"));
console.log("Boolean([]):", Boolean([]));
console.log("Boolean({}):", Boolean({}));
console.log("Boolean(new Date()):", Boolean(new Date()));

// Uso prático de valores truthy/falsy
const nome = "";
const nomeExibicao = nome || "Visitante";
console.log("Olá, " + nomeExibicao);

// 2. ESTRUTURAS DE REPETIÇÃO (LOOPS)
// --------------------------------

// Loop for básico
console.log("\nLoop for básico:");
for (let i = 1; i <= 5; i++) {
    console.log(`Iteração ${i}`);
}

// For com múltiplas expressões
console.log("\nFor com múltiplas expressões:");
for (let i = 0, j = 10; i < 5; i++, j--) {
    console.log(`i = ${i}, j = ${j}`);
}

// Loop while
console.log("\nLoop while:");
let contador = 0;
while (contador < 5) {
    console.log(`Contador: ${contador}`);
    contador++;
}

// Loop do-while (executa pelo menos uma vez)
console.log("\nLoop do-while:");
let numero = 10;
do {
    console.log(`Número: ${numero}`);
    numero--;
} while (numero > 5);

// for...of (para arrays, strings e outros iteráveis)
console.log("\nLoop for...of:");
const frutas = ["maçã", "banana", "laranja", "uva"];

for (const fruta of frutas) {
    console.log(`Fruta: ${fruta}`);
}

// for...in (para propriedades de objetos)
console.log("\nLoop for...in:");
const pessoa = {
    nome: "Carlos",
    idade: 28,
    profissao: "Desenvolvedor"
};

for (const propriedade in pessoa) {
    console.log(`${propriedade}: ${pessoa[propriedade]}`);
}

// 3. CONTROLE DE FLUXO: BREAK E CONTINUE
// ------------------------------------

// break (interrompe o loop)
console.log("\nExemplo de break:");
for (let i = 0; i < 10; i++) {
    if (i === 5) {
        console.log("Encontrei o 5! Saindo do loop...");
        break;
    }
    console.log(`Número: ${i}`);
}

// continue (pula a iteração atual)
console.log("\nExemplo de continue:");
for (let i = 0; i < 10; i++) {
    if (i % 2 === 0) {
        continue; // Pula os números pares
    }
    console.log(`Número ímpar: ${i}`);
}

// 4. LOOPS ANINHADOS
// ----------------
console.log("\nLoops aninhados:");

// Criando um padrão de triângulo com loops aninhados
for (let linha = 1; linha <= 5; linha++) {
    let padrao = '';
    for (let coluna = 1; coluna <= linha; coluna++) {
        padrao += '* ';
    }
    console.log(padrao);
}

// Loop aninhado para criar uma matriz 3x3
console.log("\nMatriz 3x3:");
for (let i = 0; i < 3; i++) {
    let linha = '';
    for (let j = 0; j < 3; j++) {
        linha += `[${i},${j}] `;
    }
    console.log(linha);
}

// 5. GUARD CLAUSES (CLÁUSULAS DE GUARDA)
// -----------------------------------

// Exemplo com aninhamento profundo
function verificarAcessoAninhado(usuario) {
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

// Testando as funções de verificação
const usuario1 = {
    nome: 'Admin',
    ativo: true,
    permissoes: ['user', 'admin']
};

const usuario2 = {
    nome: 'Usuário',
    ativo: true,
    permissoes: ['user']
};

const usuario3 = {
    nome: 'Inativo',
    ativo: false,
    permissoes: ['user']
};

console.log("\nVerificação de acesso:");
console.log("Usuario1:", verificarAcessoMelhorado(usuario1));
console.log("Usuario2:", verificarAcessoMelhorado(usuario2));
console.log("Usuario3:", verificarAcessoMelhorado(usuario3));
console.log("Usuario nulo:", verificarAcessoMelhorado(null));

// 6. EXERCÍCIO PRÁTICO: JOGO DE ADIVINHAÇÃO
// --------------------------------------

function jogoAdivinhacao() {
    // Em um ambiente real, usaríamos prompt() para entrada do usuário
    const numeroSecreto = Math.floor(Math.random() * 100) + 1;
    let tentativas = 0;
    let acertou = false;
    
    console.log("\nJOGO DE ADIVINHAÇÃO");
    console.log("Tente adivinhar o número entre 1 e 100");
    
    // Simulação de entradas do usuário para demonstração
    const palpites = [50, 75, 62, 56, 53, 55, 54]; // Supondo que o número secreto é 54
    
    while (!acertou && tentativas < palpites.length) {
        const palpite = palpites[tentativas];
        tentativas++;
        
        console.log(`Tentativa ${tentativas}: ${palpite}`);
        
        if (palpite < numeroSecreto) {
            console.log("Muito baixo! Tente um número maior.");
        } else if (palpite > numeroSecreto) {
            console.log("Muito alto! Tente um número menor.");
        } else {
            acertou = true;
            console.log(`Parabéns! Você acertou em ${tentativas} tentativas.`);
        }
    }
    
    if (!acertou) {
        console.log(`Você não acertou. O número era ${numeroSecreto}.`);
    }
    
    return tentativas;
}

// Executar o jogo
jogoAdivinhacao(); 