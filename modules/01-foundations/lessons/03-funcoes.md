# Funções

Funções são blocos de código reutilizáveis que executam tarefas específicas. Elas são fundamentais para organizar o código, evitar repetição e implementar o princípio "Não Se Repita" (DRY - Don't Repeat Yourself).

## 1. Declaração e Chamada de Funções

### Sintaxe Básica

```javascript
// Declaração de função (Function Declaration)
function saudacao() {
  console.log("Olá, mundo!");
}

// Chamada de função
saudacao(); // Saída: Olá, mundo!
```

**Analogia:** Uma função é como uma receita de bolo. Você escreve as instruções uma vez (declaração) e pode usá-la quantas vezes quiser (chamada).

### Expressão de Função (Function Expression)

```javascript
// Função anônima atribuída a uma variável
const multiplicar = function(a, b) {
  return a * b;
};

console.log(multiplicar(4, 5)); // Saída: 20
```

### Arrow Functions (ES6+)

```javascript
// Versão concisa para funções simples
const somar = (a, b) => a + b;

// Com múltiplas linhas
const calcularArea = (largura, altura) => {
  const area = largura * altura;
  return area;
};

console.log(somar(3, 4)); // Saída: 7
console.log(calcularArea(5, 8)); // Saída: 40
```

**Diferenças entre Function Declaration e Function Expression:**
1. **Hoisting:** Function Declarations são "içadas" (hoisted) para o topo do escopo, permitindo que sejam chamadas antes da declaração.
2. **Anonimato:** Function Expressions podem ser anônimas, Function Declarations exigem um nome.

```javascript
// Isso funciona devido ao hoisting
olaMundo();

function olaMundo() {
  console.log("Olá Mundo!");
}

// Isso causa erro - não há hoisting para expressões de função
// bemVindo(); // Error: bemVindo is not a function

const bemVindo = function() {
  console.log("Bem-vindo!");
};
```

## 2. Parâmetros e Argumentos

### Parâmetros Básicos

```javascript
// a e b são parâmetros
function soma(a, b) {
  return a + b;
}

// 5 e 3 são argumentos
console.log(soma(5, 3)); // Saída: 8
```

**Analogia:** Se a função é como uma máquina, os parâmetros são os slots de entrada onde você insere os materiais (argumentos) para processamento.

### Parâmetros Padrão (Default Parameters)

```javascript
function saudacao(nome = "visitante") {
  return `Olá, ${nome}!`;
}

console.log(saudacao("Maria")); // Saída: Olá, Maria!
console.log(saudacao()); // Saída: Olá, visitante!
```

### Parâmetro Rest (Rest Parameters)

```javascript
function somarTodos(...numeros) {
  return numeros.reduce((total, num) => total + num, 0);
}

console.log(somarTodos(1, 2, 3, 4, 5)); // Saída: 15
console.log(somarTodos(10, 20)); // Saída: 30
```

**Analogia:** O parâmetro rest é como um saco que coleta todos os itens extras e os mantém juntos para você.

### Desestruturação de Parâmetros

```javascript
// Desestruturação de objeto
function processarPessoa({ nome, idade, profissao = "Não informada" }) {
  console.log(`Nome: ${nome}, Idade: ${idade}, Profissão: ${profissao}`);
}

const pessoa = {
  nome: "Carlos",
  idade: 28,
  cidade: "São Paulo"
};

processarPessoa(pessoa); // Saída: Nome: Carlos, Idade: 28, Profissão: Não informada

// Desestruturação de array
function processarCoordenadas([x, y, z = 0]) {
  console.log(`X: ${x}, Y: ${y}, Z: ${z}`);
}

processarCoordenadas([10, 20]); // Saída: X: 10, Y: 20, Z: 0
```

## 3. Retorno de Valores

### Básico

```javascript
function quadrado(numero) {
  return numero * numero;
}

const resultado = quadrado(4);
console.log(resultado); // Saída: 16
```

### Retorno Múltiplo via Array ou Objeto

```javascript
// Via array
function calcularCirculo(raio) {
  const area = Math.PI * raio * raio;
  const perimetro = 2 * Math.PI * raio;
  return [area, perimetro];
}

const [area, perimetro] = calcularCirculo(5);
console.log(`Área: ${area.toFixed(2)}, Perímetro: ${perimetro.toFixed(2)}`);

// Via objeto
function calcularCirculo2(raio) {
  const area = Math.PI * raio * raio;
  const perimetro = 2 * Math.PI * raio;
  return { area, perimetro };
}

const resultado2 = calcularCirculo2(5);
console.log(`Área: ${resultado2.area.toFixed(2)}, Perímetro: ${resultado2.perimetro.toFixed(2)}`);
```

### Retorno Implícito em Arrow Functions

```javascript
// Retorno implícito para expressão única
const dobro = x => x * 2;

// Exige a palavra 'return' quando há mais de uma linha
const areaTriangulo = (base, altura) => {
  const calculo = (base * altura) / 2;
  return calculo;
};
```

**Importante:**
- Uma função sem `return` explícito retorna `undefined`.
- O `return` encerra a execução da função imediatamente.
- O `return` sem valor também retorna `undefined`.

## 4. Escopo e Closure

### Escopo de Variáveis

```javascript
// Escopo Global
const globalVar = "Sou global";

function exemploEscopo() {
  // Escopo Local (ou de função)
  const localVar = "Sou local";
  console.log(globalVar); // Acessível
  console.log(localVar); // Acessível
}

exemploEscopo();
console.log(globalVar); // Acessível
// console.log(localVar); // Erro: localVar is not defined
```

### Escopo de Bloco com let e const

```javascript
function testeEscopoBloco() {
  if (true) {
    var varDentroIf = "var dentro do if";
    let letDentroIf = "let dentro do if";
    const constDentroIf = "const dentro do if";
  }
  console.log(varDentroIf); // Acessível (escopo de função)
  // console.log(letDentroIf); // Erro (escopo de bloco)
  // console.log(constDentroIf); // Erro (escopo de bloco)
}
```

**Analogia:** O escopo é como a visibilidade a partir de um ponto. De dentro de uma casa (função), você vê o que está dentro e o que está na rua (escopo global). Mas da rua, você não consegue ver o que está dentro da casa.

### Closures (Fechamentos)

Closure ocorre quando uma função "lembra" seu escopo léxico, mesmo quando executada fora desse escopo.

```javascript
function criarContador() {
  let contador = 0;
  
  return function() {
    contador++;
    return contador;
  };
}

const meuContador = criarContador();
console.log(meuContador()); // Saída: 1
console.log(meuContador()); // Saída: 2
console.log(meuContador()); // Saída: 3

// A variável 'contador' está encapsulada no closure
// e não pode ser acessada diretamente de fora
```

**Analogia:** Uma closure é como um diário secreto que pertence à função. A função carrega esse diário onde quer que vá, e somente ela pode lê-lo ou modificá-lo.

### Aplicações Práticas de Closures

1. **Encapsulamento de Dados**

```javascript
function criarConta(saldoInicial) {
  let saldo = saldoInicial;
  
  return {
    depositar: function(valor) {
      saldo += valor;
      return `Depósito de ${valor} realizado. Novo saldo: ${saldo}`;
    },
    sacar: function(valor) {
      if (valor > saldo) {
        return "Saldo insuficiente";
      }
      saldo -= valor;
      return `Saque de ${valor} realizado. Novo saldo: ${saldo}`;
    },
    consultarSaldo: function() {
      return `Saldo atual: ${saldo}`;
    }
  };
}

const minhaConta = criarConta(1000);
console.log(minhaConta.consultarSaldo()); // Saldo atual: 1000
console.log(minhaConta.depositar(500));   // Depósito de 500 realizado. Novo saldo: 1500
console.log(minhaConta.sacar(200));       // Saque de 200 realizado. Novo saldo: 1300
// A variável 'saldo' está protegida dentro do closure
```

2. **Funções de Fábrica (Factory Functions)**

```javascript
function criarSaudacao(saudacao) {
  return function(nome) {
    return `${saudacao}, ${nome}!`;
  };
}

const dizerOla = criarSaudacao("Olá");
const dizerOi = criarSaudacao("Oi");
const dizerBomDia = criarSaudacao("Bom dia");

console.log(dizerOla("Maria"));     // Olá, Maria!
console.log(dizerOi("João"));       // Oi, João!
console.log(dizerBomDia("Pedro"));  // Bom dia, Pedro!
```

## 5. Arrow Functions e Callbacks

### Características Especiais das Arrow Functions

1. **Sintaxe Concisa**

```javascript
// Tradicional
const dobrar = function(x) {
  return x * 2;
};

// Arrow Function
const dobrar2 = x => x * 2;
```

2. **Sem this próprio**

```javascript
function Pessoa() {
  this.idade = 0;

  // 'this' dentro dessa função refere-se ao objeto Pessoa
  setInterval(() => {
    this.idade++;
    console.log(this.idade);
  }, 1000);

  // Em uma função tradicional, 'this' se referiria ao objeto global
  // ou undefined (em strict mode)
}

new Pessoa();
```

### Callbacks

Callbacks são funções passadas como argumentos para outras funções, que serão executadas após algum evento ou operação.

```javascript
// Exemplo simples de callback
function processarDados(dados, callback) {
  // Simula processamento
  const resultado = dados.map(item => item * 2);
  // Chama o callback com o resultado
  callback(resultado);
}

processarDados([1, 2, 3, 4], function(resultado) {
  console.log("Processamento concluído:", resultado);
});

// Com arrow function
processarDados([5, 6, 7, 8], resultado => {
  console.log("Outro processamento concluído:", resultado);
});
```

**Analogia:** Um callback é como deixar seu número de telefone para alguém te ligar de volta quando tiver uma informação. Você não fica esperando - continua sua vida, e quando a pessoa tiver a informação, ela te liga.

### Callbacks e Assincronicidade

```javascript
// Simulando uma operação assíncrona (como buscar dados de um servidor)
function buscarDados(id, callback) {
  console.log(`Buscando dados do id ${id}...`);
  
  // setTimeout simula uma operação que leva tempo (como uma requisição HTTP)
  setTimeout(() => {
    const dados = {
      id: id,
      nome: `Produto ${id}`,
      preco: Math.random() * 100
    };
    
    callback(dados);
  }, 1500);
}

buscarDados(123, (dados) => {
  console.log("Dados recuperados:");
  console.log(dados);
});

console.log("Essa linha executa imediatamente, sem esperar os dados!");
```

### Callback Hell e Promessas

Múltiplos callbacks aninhados podem criar o "callback hell" (ou "pyramid of doom"):

```javascript
buscarUsuario(userId, (usuario) => {
  buscarPedidos(usuario.id, (pedidos) => {
    buscarDetalhes(pedidos[0].id, (detalhes) => {
      buscarEndereco(detalhes.enderecoId, (endereco) => {
        console.log(`Endereço de entrega: ${endereco.rua}, ${endereco.cidade}`);
        // E por aí vai...
      });
    });
  });
});
```

Promessas (Promises) e async/await são soluções mais modernas para este problema, que estudaremos em módulos mais avançados.

## Exercícios Práticos

### Exercício 1: Básico - Manipulação de Temperatura

Crie funções para:
1. Converter de Celsius para Fahrenheit: `F = C * 9/5 + 32`
2. Converter de Fahrenheit para Celsius: `C = (F - 32) * 5/9`
3. Uma função de ordem superior que aceita uma temperatura, a unidade atual ('C' ou 'F') e retorna a temperatura convertida.

```javascript
// Comece com:
function celsiusParaFahrenheit(celsius) {
  // Seu código aqui
}

function fahrenheitParaCelsius(fahrenheit) {
  // Seu código aqui
}

function converterTemperatura(temperatura, unidade) {
  // Seu código aqui
}

// Teste:
console.log(converterTemperatura(25, 'C')); // 77°F
console.log(converterTemperatura(98.6, 'F')); // 37°C
```

### Exercício 2: Intermediário - Calculadora Funcional

Crie uma "calculadora funcional" usando closures que:
1. Permite operações básicas (soma, subtração, multiplicação, divisão)
2. Mantém um histórico de operações
3. Permite desfazer a última operação

```javascript
function criarCalculadora() {
  let valor = 0;
  let historico = [];
  
  // Implemente as funções de calculadora aqui
  
  return {
    // Retorne os métodos da calculadora
  };
}

// Teste:
const minhaCalculadora = criarCalculadora();
minhaCalculadora.somar(5);      // 5
minhaCalculadora.multiplicar(2); // 10
minhaCalculadora.subtrair(3);    // 7
minhaCalculadora.verHistorico(); // Lista as operações
minhaCalculadora.desfazer();     // Volta para 10
```

### Exercício 3: Avançado - Sistema de Filtros com Callbacks

Crie um sistema para filtrar e transformar dados de produtos usando funções de ordem superior:

```javascript
const produtos = [
  { id: 1, nome: "Smartphone", preco: 1500, categoria: "Eletrônicos" },
  { id: 2, nome: "Notebook", preco: 3000, categoria: "Eletrônicos" },
  { id: 3, nome: "Camisa", preco: 70, categoria: "Vestuário" },
  { id: 4, nome: "Sapato", preco: 120, categoria: "Vestuário" },
  { id: 5, nome: "Geladeira", preco: 2000, categoria: "Eletrodomésticos" }
];

function filtrarProdutos(produtos, callback) {
  // Implementar filtro usando o callback fornecido
}

function ordenarProdutos(produtos, criterio) {
  // Implementar ordenação por critério
}

function aplicarDesconto(produtos, percentual) {
  // Implementar aplicação de desconto
}

// Teste:
const eletronicos = filtrarProdutos(produtos, produto => produto.categoria === "Eletrônicos");
const ordenadosPorPreco = ordenarProdutos(eletronicos, "preco");
const comDesconto = aplicarDesconto(ordenadosPorPreco, 10);
console.log(comDesconto);
```

## Resumo

- **Funções** são blocos de código reutilizáveis que podem receber entradas (parâmetros) e retornar saídas.
- **Declarações** vs. **Expressões** de função têm diferenças importantes, como hoisting.
- **Parâmetros e Argumentos** permitem passar dados para funções.
- **Retorno de Valores** pode ser explícito (`return`) ou implícito em arrow functions.
- **Escopo e Closure** determinam a visibilidade das variáveis e permitem criar dados privados.
- **Arrow Functions** têm sintaxe concisa e comportamento especial do `this`.
- **Callbacks** são funções passadas como argumentos para outras funções, fundamentais para programação assíncrona.

Funções são pilares da programação em JavaScript e formam a base para conceitos mais avançados como programação funcional, assincronicidade e orientação a objetos.

---

No [próximo tópico](./04-programacao-orientada-objetos.md), exploraremos os conceitos básicos da Programação Orientada a Objetos (OOP), que nos ajudará a organizar nosso código de forma mais estruturada e intuitiva. 