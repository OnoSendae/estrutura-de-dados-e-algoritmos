// =================================
// EXEMPLOS DE FUNÇÕES EM JAVASCRIPT
// =================================

// 1. DECLARAÇÃO E CHAMADA DE FUNÇÕES
// --------------------------------

// Declaração de função (Function Declaration)
function saudacao() {
    console.log("Olá, mundo!");
}

// Chamada de função
saudacao(); // Output: Olá, mundo!

// Função com parâmetros
function saudarPessoa(nome) {
    console.log(`Olá, ${nome}!`);
}

saudarPessoa("Maria"); // Output: Olá, Maria!

// Função com retorno
function soma(a, b) {
    return a + b;
}

const resultado = soma(5, 3);
console.log("Soma:", resultado); // Output: Soma: 8

// Expressão de função (Function Expression)
const multiplicar = function(a, b) {
    return a * b;
};

console.log("Multiplicação:", multiplicar(4, 6)); // Output: Multiplicação: 24

// Arrow Function (ES6+)
const subtrair = (a, b) => a - b;
console.log("Subtração:", subtrair(10, 4)); // Output: Subtração: 6

// Arrow Function com múltiplas linhas
const calcularArea = (base, altura) => {
    const area = base * altura;
    return area;
};

console.log("Área:", calcularArea(5, 8)); // Output: Área: 40

// Demonstração de hoisting (içamento)
// As declarações de função são "içadas" para o topo
console.log("\nDemonstração de hoisting:");

console.log("Chamando antes da declaração:", quadrado(4)); // Funciona!

function quadrado(n) {
    return n * n;
}

// Function Expression não tem hoisting
// console.log(cubo(3)); // Isso causaria erro
const cubo = function(n) {
    return n * n * n;
};

console.log("Chamando depois da declaração:", cubo(3)); // Funciona

// 2. PARÂMETROS E ARGUMENTOS
// -----------------------

// Parâmetros básicos
function dividir(a, b) {
    if (b === 0) {
        return "Não é possível dividir por zero";
    }
    return a / b;
}

console.log("\nParâmetros e Argumentos:");
console.log("Dividir:", dividir(10, 2)); // Output: Dividir: 5
console.log("Dividir por zero:", dividir(10, 0)); // Output: Dividir por zero: Não é possível dividir por zero

// Parâmetros padrão (default parameters)
function potencia(base, expoente = 2) {
    return Math.pow(base, expoente);
}

console.log("Potência (padrão):", potencia(3)); // Output: Potência (padrão): 9
console.log("Potência (personalizada):", potencia(2, 3)); // Output: Potência (personalizada): 8

// Parâmetros Rest (Rest Parameters)
function somarTodos(...numeros) {
    return numeros.reduce((total, num) => total + num, 0);
}

console.log("Soma vários números:", somarTodos(1, 2, 3, 4, 5)); // Output: Soma vários números: 15

// Parâmetro rest com outros parâmetros
function registrarVendas(data, vendedor, ...produtos) {
    console.log(`Data: ${data}`);
    console.log(`Vendedor: ${vendedor}`);
    console.log("Produtos vendidos:", produtos);
    console.log("Total de produtos:", produtos.length);
}

registrarVendas("2023-05-15", "Carlos", "Laptop", "Mouse", "Teclado");

// Desestruturação de parâmetros (objeto)
function processarPessoa({ nome, idade, profissao = "Não informada" }) {
    console.log(`Nome: ${nome}, Idade: ${idade}, Profissão: ${profissao}`);
}

const pessoa = {
    nome: "João",
    idade: 32,
    cidade: "São Paulo"
};

processarPessoa(pessoa); // Output: Nome: João, Idade: 32, Profissão: Não informada

// Desestruturação de parâmetros (array)
function processarCoordenadas([x, y, z = 0]) {
    console.log(`X: ${x}, Y: ${y}, Z: ${z}`);
}

processarCoordenadas([10, 20]); // Output: X: 10, Y: 20, Z: 0

// 3. RETORNO DE VALORES
// ------------------

// Básico
function ehPar(numero) {
    return numero % 2 === 0;
}

console.log("\nRetorno de valores:");
console.log("5 é par?", ehPar(5)); // Output: 5 é par? false
console.log("8 é par?", ehPar(8)); // Output: 8 é par? true

// Retorno múltiplo via array
function calcularCirculo(raio) {
    const area = Math.PI * raio * raio;
    const perimetro = 2 * Math.PI * raio;
    return [area, perimetro];
}

const [area, perimetro] = calcularCirculo(5);
console.log(`Área: ${area.toFixed(2)}, Perímetro: ${perimetro.toFixed(2)}`);
// Output: Área: 78.54, Perímetro: 31.42

// Retorno múltiplo via objeto
function calcularCirculo2(raio) {
    const area = Math.PI * raio * raio;
    const perimetro = 2 * Math.PI * raio;
    return { area, perimetro }; // Shorthand para { area: area, perimetro: perimetro }
}

const resultado2 = calcularCirculo2(5);
console.log(`Área: ${resultado2.area.toFixed(2)}, Perímetro: ${resultado2.perimetro.toFixed(2)}`);
// Output: Área: 78.54, Perímetro: 31.42

// Retorno implícito em arrow functions
const dobro = x => x * 2;
console.log("Dobro de 7:", dobro(7)); // Output: Dobro de 7: 14

// Sem return explícito (retorna undefined)
function semRetorno() {
    console.log("Esta função não retorna valor");
}

const valorRetornado = semRetorno();
console.log("Valor retornado:", valorRetornado); // Output: Valor retornado: undefined

// Retorno antecipado (early return)
function verificarIdade(idade) {
    if (idade < 0) {
        return "Idade inválida";
    }
    
    if (idade < 18) {
        return "Menor de idade";
    }
    
    if (idade < 60) {
        return "Adulto";
    }
    
    return "Idoso";
}

console.log("Verificação de idade:", verificarIdade(25)); // Output: Verificação de idade: Adulto

// 4. ESCOPO E CLOSURE
// ----------------

// Escopo Global vs. Local
const globalVar = "Sou global";

function exemploEscopo() {
    const localVar = "Sou local";
    console.log(globalVar); // Acessível
    console.log(localVar); // Acessível
}

console.log("\nEscopo Global vs. Local:");
exemploEscopo();
console.log(globalVar); // Acessível
// console.log(localVar); // Erro: localVar não está definido

// Escopo de Bloco (let e const)
function exemploEscopoBloco() {
    if (true) {
        var varDentroIf = "var dentro do if";
        let letDentroIf = "let dentro do if";
        const constDentroIf = "const dentro do if";
        
        console.log(varDentroIf); // Acessível
        console.log(letDentroIf); // Acessível
        console.log(constDentroIf); // Acessível
    }
    
    console.log(varDentroIf); // Acessível (escopo de função)
    // console.log(letDentroIf); // Erro (escopo de bloco)
    // console.log(constDentroIf); // Erro (escopo de bloco)
}

exemploEscopoBloco();

// Exemplo básico de Closure
function criarContador() {
    let contador = 0;
    
    return function() {
        contador++;
        return contador;
    };
}

console.log("\nExemplo de Closure:");
const meuContador = criarContador();
console.log(meuContador()); // Output: 1
console.log(meuContador()); // Output: 2
console.log(meuContador()); // Output: 3

// A variável 'contador' está protegida no closure

// Outro contador independente
const outroContador = criarContador();
console.log(outroContador()); // Output: 1 (não 4, é independente do primeiro)

// Closure para dados privados
function criarConta(saldoInicial) {
    let saldo = saldoInicial;
    
    return {
        depositar: function(valor) {
            if (valor <= 0) {
                return "Valor inválido para depósito";
            }
            saldo += valor;
            return `Depósito de R$ ${valor.toFixed(2)} realizado. Novo saldo: R$ ${saldo.toFixed(2)}`;
        },
        sacar: function(valor) {
            if (valor <= 0) {
                return "Valor inválido para saque";
            }
            if (valor > saldo) {
                return "Saldo insuficiente";
            }
            saldo -= valor;
            return `Saque de R$ ${valor.toFixed(2)} realizado. Novo saldo: R$ ${saldo.toFixed(2)}`;
        },
        consultarSaldo: function() {
            return `Saldo atual: R$ ${saldo.toFixed(2)}`;
        }
    };
}

console.log("\nExemplo de Conta com Closure:");
const minhaConta = criarConta(1000);
console.log(minhaConta.consultarSaldo()); // Output: Saldo atual: R$ 1000.00
console.log(minhaConta.depositar(500));   // Output: Depósito de R$ 500.00 realizado. Novo saldo: R$ 1500.00
console.log(minhaConta.sacar(200));       // Output: Saque de R$ 200.00 realizado. Novo saldo: R$ 1300.00
console.log(minhaConta.sacar(2000));      // Output: Saldo insuficiente

// Function Factory com Closure
function criarSaudacao(saudacao) {
    return function(nome) {
        return `${saudacao}, ${nome}!`;
    };
}

console.log("\nFunction Factory com Closure:");
const dizerOla = criarSaudacao("Olá");
const dizerOi = criarSaudacao("Oi");
const dizerBomDia = criarSaudacao("Bom dia");

console.log(dizerOla("Maria"));     // Output: Olá, Maria!
console.log(dizerOi("João"));       // Output: Oi, João!
console.log(dizerBomDia("Pedro"));  // Output: Bom dia, Pedro!

// 5. ARROW FUNCTIONS E CALLBACKS
// --------------------------

// Sintaxe concisa
console.log("\nArrow Functions:");
// Tradicional
const dobraPadrao = function(x) {
    return x * 2;
};

// Arrow Function
const dobraArrow = x => x * 2;

console.log("Função tradicional:", dobraPadrao(10)); // Output: Função tradicional: 20
console.log("Arrow function:", dobraArrow(10));      // Output: Arrow function: 20

// Arrow function com múltiplos parâmetros
const somaArrow = (a, b) => a + b;
console.log("Soma com arrow:", somaArrow(5, 7)); // Output: Soma com arrow: 12

// Arrow function sem parâmetros
const saudacaoArrow = () => "Olá!";
console.log(saudacaoArrow()); // Output: Olá!

// Exemplo de 'this' em arrow functions vs funções tradicionais
function ExemploPessoa() {
    this.idade = 0;
    
    // Utilizando arrow function - 'this' refere-se à instância de ExemploPessoa
    setInterval(() => {
        this.idade++;
        console.log(`Arrow: ${this.idade}`);
    }, 1000);
    
    // Esta parte é comentada para não afetar a execução do exemplo,
    // mas mostra a diferença no comportamento do 'this'
    /*
    // Utilizando função tradicional - 'this' seria redefinido
    setInterval(function() {
        this.idade++; // 'this' aqui NÃO se refere à instância ExemploPessoa
        console.log(`Tradicional: ${this.idade}`); // Resultaria em NaN
    }, 1000);
    */
}

// new ExemploPessoa(); // Descomente para testar (cuidado: vai executar indefinidamente)

// Callbacks simples
function processarDados(dados, callback) {
    // Simula processamento
    const resultado = dados.map(item => item * 2);
    // Chama o callback com o resultado
    callback(resultado);
}

console.log("\nExemplo de Callback:");
processarDados([1, 2, 3, 4], function(resultado) {
    console.log("Processamento concluído:", resultado);
});

// Com arrow function
processarDados([5, 6, 7, 8], resultado => {
    console.log("Outro processamento concluído:", resultado);
});

// Callback com temporizador
function operacaoAssincrona(callback) {
    console.log("Iniciando operação assíncrona...");
    
    setTimeout(() => {
        const resultado = "Operação concluída!";
        callback(resultado);
    }, 2000); // Simula uma operação que leva 2 segundos
    
    console.log("Operação assíncrona iniciada, aguardando resultado...");
}

// operacaoAssincrona(resultado => {
//     console.log("Resultado recebido:", resultado);
// });

// Simulação de Callback Hell (problema de aninhamento excessivo)
function buscarUsuario(id, callback) {
    setTimeout(() => {
        const usuario = { id: id, nome: "João", email: "joao@exemplo.com" };
        callback(usuario);
    }, 1000);
}

function buscarPedidos(userId, callback) {
    setTimeout(() => {
        const pedidos = [
            { id: 1, userId: userId, produto: "Laptop" },
            { id: 2, userId: userId, produto: "Mouse" }
        ];
        callback(pedidos);
    }, 1000);
}

function buscarDetalhes(pedidoId, callback) {
    setTimeout(() => {
        const detalhes = { id: pedidoId, status: "Enviado", enderecoId: 123 };
        callback(detalhes);
    }, 1000);
}

// Exemplo de Callback Hell (comentado para não afetar a execução)
/*
console.log("\nCallback Hell (demonstração):");
buscarUsuario(1, (usuario) => {
    console.log("Usuário:", usuario);
    buscarPedidos(usuario.id, (pedidos) => {
        console.log("Pedidos:", pedidos);
        buscarDetalhes(pedidos[0].id, (detalhes) => {
            console.log("Detalhes:", detalhes);
            // Poderia continuar aninhando...
        });
    });
});
*/

// 6. EXERCÍCIO PRÁTICO: CONVERSOR DE TEMPERATURA
// ------------------------------------------

console.log("\nExercício - Conversor de Temperatura:");

function celsiusParaFahrenheit(celsius) {
    return celsius * 9/5 + 32;
}

function fahrenheitParaCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5/9;
}

function converterTemperatura(temperatura, unidade) {
    if (unidade.toUpperCase() === 'C') {
        const fahrenheit = celsiusParaFahrenheit(temperatura);
        return `${temperatura}°C = ${fahrenheit.toFixed(1)}°F`;
    } else if (unidade.toUpperCase() === 'F') {
        const celsius = fahrenheitParaCelsius(temperatura);
        return `${temperatura}°F = ${celsius.toFixed(1)}°C`;
    } else {
        return "Unidade inválida. Use 'C' para Celsius ou 'F' para Fahrenheit.";
    }
}

console.log(converterTemperatura(25, 'C')); // Output: 25°C = 77.0°F
console.log(converterTemperatura(98.6, 'F')); // Output: 98.6°F = 37.0°C
console.log(converterTemperatura(30, 'X')); // Output: Unidade inválida. Use 'C' para Celsius ou 'F' para Fahrenheit. 