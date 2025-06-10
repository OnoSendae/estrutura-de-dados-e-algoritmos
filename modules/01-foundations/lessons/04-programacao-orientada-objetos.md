# Conceitos Básicos de Programação Orientada a Objetos (OOP)

A Programação Orientada a Objetos (OOP) é um paradigma de programação que organiza o código em torno de "objetos" em vez de funções e lógica. É uma forma poderosa de estruturar código complexo, tornando-o mais modular, reutilizável e fácil de manter.

## 1. Classes e Objetos

### Objetos Literais

No JavaScript, a maneira mais simples de criar um objeto é usando a notação literal:

```javascript
const pessoa = {
  nome: "Ana",
  idade: 28,
  profissao: "Desenvolvedora",
  apresentar: function() {
    return `Olá, meu nome é ${this.nome}, tenho ${this.idade} anos e sou ${this.profissao}.`;
  }
};

console.log(pessoa.nome); // Ana
console.log(pessoa.apresentar()); // Olá, meu nome é Ana, tenho 28 anos e sou Desenvolvedora.
```

**Analogia:** Um objeto é como um prontuário médico que contém diferentes informações relacionadas a um paciente (propriedades) e também ações que podem ser realizadas (métodos).

### Classes em JavaScript (ES6+)

Classes são "moldes" para criar objetos com propriedades e métodos predefinidos:

```javascript
class Pessoa {
  // O construtor é executado quando um objeto é criado
  constructor(nome, idade, profissao) {
    this.nome = nome;
    this.idade = idade;
    this.profissao = profissao;
  }
  
  // Método da classe
  apresentar() {
    return `Olá, meu nome é ${this.nome}, tenho ${this.idade} anos e sou ${this.profissao}.`;
  }
  
  // Método que altera propriedades
  fazerAniversario() {
    this.idade++;
    return `${this.nome} agora tem ${this.idade} anos.`;
  }
}

// Criando objetos a partir da classe (instanciação)
const pessoa1 = new Pessoa("Carlos", 30, "Engenheiro");
const pessoa2 = new Pessoa("Maria", 25, "Médica");

console.log(pessoa1.apresentar()); // Olá, meu nome é Carlos, tenho 30 anos e sou Engenheiro.
console.log(pessoa2.fazerAniversario()); // Maria agora tem 26 anos.
```

**Analogia:** Uma classe é como uma planta (blueprint) de uma casa. A planta define como a casa será construída, mas não é a casa em si. Usando a mesma planta, você pode construir várias casas similares (objetos), cada uma com suas características específicas (valores de propriedades).

### Propriedades e Métodos Estáticos

Propriedades e métodos estáticos pertencem à classe, não às instâncias:

```javascript
class Matemática {
  // Propriedade estática
  static PI = 3.14159;
  
  // Método estático
  static calcularAreaCirculo(raio) {
    return this.PI * raio * raio;
  }
}

// Não precisamos criar uma instância para usar métodos estáticos
console.log(Matemática.PI); // 3.14159
console.log(Matemática.calcularAreaCirculo(5)); // 78.53975
```

**Analogia:** Métodos estáticos são como funções utilitárias de uma fábrica, que não dependem de um produto específico, mas fornecem serviços gerais relacionados à fábrica.

## 2. Propriedades e Métodos

### Getters e Setters

Getters e setters permitem controlar o acesso às propriedades de um objeto:

```javascript
class ContaBancaria {
  constructor(titular, saldoInicial) {
    this._titular = titular; // Convenção: propriedade "privada"
    this._saldo = saldoInicial;
  }
  
  // Getter
  get saldo() {
    return `R$ ${this._saldo.toFixed(2)}`;
  }
  
  // Setter
  set saldo(valor) {
    if (valor < 0) {
      console.error("Não é possível definir um saldo negativo");
      return;
    }
    this._saldo = valor;
  }
  
  // Métodos regulares
  depositar(valor) {
    if (valor <= 0) {
      return "Valor inválido para depósito";
    }
    this._saldo += valor;
    return `Depósito de R$ ${valor.toFixed(2)} realizado. Novo saldo: ${this.saldo}`;
  }
  
  sacar(valor) {
    if (valor > this._saldo) {
      return "Saldo insuficiente";
    }
    this._saldo -= valor;
    return `Saque de R$ ${valor.toFixed(2)} realizado. Novo saldo: ${this.saldo}`;
  }
}

const conta = new ContaBancaria("João Silva", 1000);
console.log(conta.saldo); // R$ 1000.00
conta.saldo = 1500; // Usa o setter
console.log(conta.saldo); // R$ 1500.00
conta.saldo = -500; // Erro: Não é possível definir um saldo negativo
console.log(conta.depositar(250)); // Depósito de R$ 250.00 realizado. Novo saldo: R$ 1750.00
```

**Analogia:** Getters e setters são como recepcionistas de um prédio. Quando você quer visitar alguém (acessar uma propriedade), o recepcionista verifica se você tem permissão e pode até formatar a informação antes de entregá-la. Quando quer deixar algo (modificar uma propriedade), o recepcionista verifica se o que você está enviando é adequado.

### Campos Privados (ES2022+)

JavaScript agora suporta campos verdadeiramente privados com o prefixo `#`:

```javascript
class ContaBancaria {
  // Campos privados
  #saldo;
  #titular;
  
  constructor(titular, saldoInicial) {
    this.#titular = titular;
    this.#saldo = saldoInicial;
  }
  
  get saldo() {
    return `R$ ${this.#saldo.toFixed(2)}`;
  }
  
  depositar(valor) {
    if (valor <= 0) return "Valor inválido";
    this.#saldo += valor;
    return `Novo saldo: ${this.saldo}`;
  }
  
  // Método privado
  #validarSaldo(valor) {
    return this.#saldo >= valor;
  }
  
  sacar(valor) {
    if (!this.#validarSaldo(valor)) {
      return "Saldo insuficiente";
    }
    this.#saldo -= valor;
    return `Saque realizado. Novo saldo: ${this.saldo}`;
  }
}

const conta = new ContaBancaria("Maria", 500);
console.log(conta.saldo); // R$ 500.00
// console.log(conta.#saldo); // Erro: Campo privado
```

**Analogia:** Campos privados são como cofres dentro de um banco aos quais somente funcionários autorizados têm acesso. Clientes (código externo) só podem interagir com esse cofre através de procedimentos específicos (métodos públicos).

## 3. Herança Básica

A herança permite que uma classe herde propriedades e métodos de outra:

```javascript
// Classe base (ou classe pai)
class Animal {
  constructor(nome) {
    this.nome = nome;
  }
  
  fazerSom() {
    return "Som genérico de animal";
  }
  
  apresentar() {
    return `Este animal é ${this.nome} e faz ${this.fazerSom()}`;
  }
}

// Classe derivada (ou classe filha)
class Gato extends Animal {
  constructor(nome, cor) {
    // 'super' chama o construtor da classe pai
    super(nome);
    this.cor = cor;
  }
  
  // Sobrescreve o método da classe pai
  fazerSom() {
    return "Miau!";
  }
  
  arranhar() {
    return `${this.nome} está arranhando o sofá!`;
  }
}

// Outra classe derivada
class Cachorro extends Animal {
  constructor(nome, raca) {
    super(nome);
    this.raca = raca;
  }
  
  fazerSom() {
    return "Au au!";
  }
  
  buscar() {
    return `${this.nome} está buscando a bolinha!`;
  }
}

const animal = new Animal("Criatura");
const gato = new Gato("Whiskers", "Cinza");
const cachorro = new Cachorro("Rex", "Labrador");

console.log(animal.apresentar()); // Este animal é Criatura e faz Som genérico de animal
console.log(gato.apresentar()); // Este animal é Whiskers e faz Miau!
console.log(cachorro.apresentar()); // Este animal é Rex e faz Au au!
console.log(gato.arranhar()); // Whiskers está arranhando o sofá!
console.log(cachorro.buscar()); // Rex está buscando a bolinha!
```

**Analogia:** A herança é como a relação familiar entre pais e filhos. Os filhos herdam características dos pais, mas também têm suas próprias características únicas e podem fazer coisas de maneira diferente dos pais.

### super

A palavra-chave `super` é usada para:
1. Chamar o construtor da classe pai (`super()`)
2. Acessar métodos da classe pai (`super.metodo()`)

```javascript
class Veiculo {
  constructor(marca, modelo, ano) {
    this.marca = marca;
    this.modelo = modelo;
    this.ano = ano;
    this.ligado = false;
  }
  
  ligar() {
    this.ligado = true;
    return `${this.marca} ${this.modelo} está ligado!`;
  }
  
  desligar() {
    this.ligado = false;
    return `${this.marca} ${this.modelo} está desligado!`;
  }
  
  informacoes() {
    return `Veículo: ${this.marca} ${this.modelo} (${this.ano})`;
  }
}

class Carro extends Veiculo {
  constructor(marca, modelo, ano, portas) {
    // Chama o construtor da classe pai
    super(marca, modelo, ano);
    this.portas = portas;
    this.velocidade = 0;
  }
  
  acelerar(incremento) {
    if (!this.ligado) {
      return "Não é possível acelerar um carro desligado";
    }
    this.velocidade += incremento;
    return `${this.marca} ${this.modelo} acelerou para ${this.velocidade} km/h`;
  }
  
  // Sobrescreve o método da classe pai, mas também utiliza sua implementação
  informacoes() {
    // Chama o método da classe pai
    const infoBase = super.informacoes();
    return `${infoBase} - ${this.portas} portas, ${this.velocidade} km/h`;
  }
}

const carro = new Carro("Toyota", "Corolla", 2022, 4);
console.log(carro.ligar()); // Toyota Corolla está ligado!
console.log(carro.acelerar(60)); // Toyota Corolla acelerou para 60 km/h
console.log(carro.informacoes()); // Veículo: Toyota Corolla (2022) - 4 portas, 60 km/h
```

## 4. Encapsulamento

Encapsulamento é o conceito de limitar o acesso direto aos componentes de um objeto, protegendo os dados internos.

### Por Convenção (Pré-ES2022)

Antes dos campos privados, usávamos convenções como o underscore `_`:

```javascript
class Pessoa {
  constructor(nome, idade) {
    this._nome = nome;
    this._idade = idade;
  }
  
  get nome() {
    return this._nome;
  }
  
  set nome(novoNome) {
    if (typeof novoNome !== 'string' || novoNome.length < 2) {
      throw new Error("Nome inválido");
    }
    this._nome = novoNome;
  }
  
  get idade() {
    return this._idade;
  }
  
  // Método "privado" por convenção
  _validarIdade(idade) {
    return idade >= 0 && idade <= 120;
  }
}
```

### Com Campos Privados (ES2022+)

Usando os campos privados oficiais:

```javascript
class Pessoa {
  #nome;
  #idade;
  
  constructor(nome, idade) {
    this.#validarDados(nome, idade);
    this.#nome = nome;
    this.#idade = idade;
  }
  
  // Método privado
  #validarDados(nome, idade) {
    if (typeof nome !== 'string' || nome.length < 2) {
      throw new Error("Nome inválido");
    }
    if (idade < 0 || idade > 120) {
      throw new Error("Idade inválida");
    }
  }
  
  // Interface pública
  apresentar() {
    return `Olá, sou ${this.#nome} e tenho ${this.#idade} anos.`;
  }
  
  fazerAniversario() {
    this.#idade++;
    return `${this.#nome} agora tem ${this.#idade} anos.`;
  }
}

const pessoa = new Pessoa("João", 30);
console.log(pessoa.apresentar()); // Olá, sou João e tenho 30 anos.
console.log(pessoa.fazerAniversario()); // João agora tem 31 anos.
// console.log(pessoa.#nome); // Erro: propriedade privada
```

**Analogia:** Encapsulamento é como a caixa preta de um avião. O exterior fornece botões e interfaces para interagir com a caixa, mas os componentes internos ficam escondidos e protegidos. Isso garante que ninguém manipule diretamente os mecanismos delicados dentro da caixa.

## 5. Polimorfismo

Polimorfismo permite que objetos de diferentes classes sejam tratados como objetos de uma classe comum.

### Polimorfismo por Sobrescrita (Override)

```javascript
class Forma {
  calcularArea() {
    return 0; // Implementação base
  }
  
  descricao() {
    return `Esta forma tem área de ${this.calcularArea()} unidades quadradas.`;
  }
}

class Retangulo extends Forma {
  constructor(largura, altura) {
    super();
    this.largura = largura;
    this.altura = altura;
  }
  
  calcularArea() {
    return this.largura * this.altura;
  }
}

class Circulo extends Forma {
  constructor(raio) {
    super();
    this.raio = raio;
  }
  
  calcularArea() {
    return Math.PI * this.raio * this.raio;
  }
}

// Função que demonstra polimorfismo
function mostrarAreaDaForma(forma) {
  // A mesma chamada de método comporta-se diferentemente
  // dependendo do tipo real do objeto
  console.log(forma.descricao());
}

const retangulo = new Retangulo(5, 4);
const circulo = new Circulo(3);

mostrarAreaDaForma(retangulo); // Esta forma tem área de 20 unidades quadradas.
mostrarAreaDaForma(circulo); // Esta forma tem área de 28.27433388230814 unidades quadradas.
```

**Analogia:** Polimorfismo é como um controle remoto universal. O mesmo botão "ligar" funciona de forma diferente dependendo do dispositivo conectado (TV, DVD, etc.), mas o usuário não precisa se preocupar com essas diferenças - ele simplesmente pressiona o botão.

### Interfaces em TypeScript

TypeScript adiciona suporte a interfaces, que são contratos que as classes devem seguir:

```typescript
// Definição da interface
interface Reprodutivel {
  reproduzir(): string;
  pausar(): string;
  parar(): string;
}

// Classe que implementa a interface
class MusicaMP3 implements Reprodutivel {
  constructor(public titulo: string, public artista: string) {}
  
  reproduzir(): string {
    return `Reproduzindo música: ${this.titulo} - ${this.artista}`;
  }
  
  pausar(): string {
    return `Música ${this.titulo} pausada`;
  }
  
  parar(): string {
    return `Música ${this.titulo} parada`;
  }
}

class Video implements Reprodutivel {
  constructor(public titulo: string, public duracao: number) {}
  
  reproduzir(): string {
    return `Reproduzindo vídeo: ${this.titulo} (${this.duracao} minutos)`;
  }
  
  pausar(): string {
    return `Vídeo ${this.titulo} pausado`;
  }
  
  parar(): string {
    return `Vídeo ${this.titulo} parado`;
  }
}

// Função que demonstra polimorfismo através da interface
function controlarMidia(midia: Reprodutivel) {
  console.log(midia.reproduzir());
  console.log(midia.pausar());
  console.log(midia.parar());
}

const musica = new MusicaMP3("Bohemian Rhapsody", "Queen");
const video = new Video("Tutorial JavaScript", 45);

controlarMidia(musica);
controlarMidia(video);
```

## Exercícios Práticos

### Exercício 1: Básico - Sistema de Biblioteca

Crie uma classe `Livro` e uma classe `Biblioteca` para gerenciar um conjunto de livros:

```javascript
// Implemente as classes aqui
class Livro {
  // Propriedades: título, autor, ano, disponível (boolean)
  // Métodos: emprestar(), devolver(), informacoes()
}

class Biblioteca {
  // Propriedades: nome, livros (array de Livros)
  // Métodos: adicionarLivro(), buscarPorTitulo(), buscarPorAutor(), emprestarLivro(), devolverLivro()
}

// Teste
const biblioteca = new Biblioteca("Biblioteca Municipal");
biblioteca.adicionarLivro(new Livro("O Senhor dos Anéis", "J.R.R. Tolkien", 1954));
biblioteca.adicionarLivro(new Livro("Harry Potter", "J.K. Rowling", 1997));
biblioteca.adicionarLivro(new Livro("1984", "George Orwell", 1949));

console.log(biblioteca.buscarPorAutor("Tolkien"));
console.log(biblioteca.emprestarLivro("1984"));
console.log(biblioteca.emprestarLivro("1984")); // Deve mostrar que não está disponível
console.log(biblioteca.devolverLivro("1984"));
```

### Exercício 2: Intermediário - Sistema Bancário

Crie um sistema bancário com herança, utilizando classes como `Conta`, `ContaCorrente` e `ContaPoupanca`:

```javascript
class Conta {
  // Implemente aqui as propriedades e métodos comuns
}

class ContaCorrente extends Conta {
  // Adicione propriedades específicas como limite e taxas
  // Sobrescreva métodos como sacar() para considerar o limite
}

class ContaPoupanca extends Conta {
  // Adicione métodos específicos como calcularRendimento()
}

// Teste
const contaCorrente = new ContaCorrente("123-4", "Carlos", 1000, 500);
const contaPoupanca = new ContaPoupanca("456-7", "Ana", 2000, 0.05);

console.log(contaCorrente.sacar(1200)); // Deve permitir (usando o limite)
console.log(contaPoupanca.sacar(2500)); // Deve recusar (saldo insuficiente)
console.log(contaPoupanca.calcularRendimento(3)); // Calcula rendimento para 3 meses
```

### Exercício 3: Avançado - Loja Virtual com Polimorfismo

Crie um sistema de loja virtual com produtos diferentes que compartilham funcionalidades comuns:

```javascript
// Implemente uma estrutura de classes que permita:
// - Diferentes tipos de produtos (físico, digital, assinatura)
// - Diferentes métodos de pagamento
// - Cálculo de frete e impostos conforme o tipo do produto
// - Permita adicionar produtos a um carrinho e calcular o total

class Produto {
  // Propriedades e métodos comuns a todos os produtos
}

class ProdutoFisico extends Produto {
  // Implementação específica para produtos físicos
}

class ProdutoDigital extends Produto {
  // Implementação específica para produtos digitais
}

class Carrinho {
  // Métodos para gerenciar os produtos e calcular totais
}

// Teste
const carrinho = new Carrinho();
carrinho.adicionarProduto(new ProdutoFisico("Notebook", 3500, 2.5));
carrinho.adicionarProduto(new ProdutoDigital("E-book", 29.90));
console.log(carrinho.calcularTotal());
console.log(carrinho.calcularFrete());
```

## Resumo

- **Classes e Objetos** são os blocos fundamentais da OOP, onde classes são moldes e objetos são instâncias.
- **Propriedades e Métodos** armazenam dados e definem comportamentos nos objetos.
- **Herança** permite que uma classe herde características de outra, promovendo reutilização de código.
- **Encapsulamento** protege os dados internos de um objeto, limitando acesso direto.
- **Polimorfismo** permite que objetos de diferentes classes sejam tratados de maneira uniforme.

A Programação Orientada a Objetos ajuda a modelar o código de forma que reflita mais naturalmente o mundo real, facilitando o desenvolvimento e a manutenção de sistemas complexos.

---

No [próximo tópico](./05-pseudocodigo.md), exploraremos o pseudocódigo, uma ferramenta para planejar e expressar algoritmos de forma independente de linguagem de programação. 