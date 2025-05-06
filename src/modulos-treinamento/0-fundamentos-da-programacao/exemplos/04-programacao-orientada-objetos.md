// =================================================
// EXEMPLOS DE PROGRAMAÇÃO ORIENTADA A OBJETOS EM JS
// =================================================

// 1. OBJETOS LITERAIS
// ----------------

console.log("=== OBJETOS LITERAIS ===");

// Objeto literal básico
const pessoa = {
    nome: "Ana Silva",
    idade: 28,
    profissao: "Desenvolvedora",
    
    // Método dentro do objeto
    apresentar: function() {
        return `Olá, meu nome é ${this.nome}, tenho ${this.idade} anos e sou ${this.profissao}.`;
    },
    
    // Sintaxe de método abreviada (ES6+)
    fazerAniversario() {
        this.idade++;
        return `Agora tenho ${this.idade} anos!`;
    }
};

// Acessando propriedades
console.log(pessoa.nome); // Ana Silva
console.log(pessoa["profissao"]); // Desenvolvedora

// Chamando métodos
console.log(pessoa.apresentar()); // Olá, meu nome é Ana Silva, tenho 28 anos e sou Desenvolvedora.
console.log(pessoa.fazerAniversario()); // Agora tenho 29 anos!

// Adicionando novas propriedades
pessoa.email = "ana.silva@exemplo.com";
console.log(pessoa.email); // ana.silva@exemplo.com

// Alterando propriedades
pessoa.profissao = "Engenheira de Software";
console.log(pessoa.profissao); // Engenheira de Software

// Removendo propriedades
delete pessoa.email;
console.log(pessoa.email); // undefined

// 2. CLASSES EM JAVASCRIPT (ES6+)
// ----------------------------

console.log("\n=== CLASSES ===");

// Definição de classe
class Pessoa {
    // Método construtor - executado ao criar uma instância
    constructor(nome, idade, profissao) {
        this.nome = nome;
        this.idade = idade;
        this.profissao = profissao;
    }
    
    // Métodos da classe
    apresentar() {
        return `Olá, meu nome é ${this.nome}, tenho ${this.idade} anos e sou ${this.profissao}.`;
    }
    
    fazerAniversario() {
        this.idade++;
        return `${this.nome} agora tem ${this.idade} anos.`;
    }
    
    // Método com parâmetros
    mudarProfissao(novaProfissao) {
        this.profissao = novaProfissao;
        return `${this.nome} agora é ${this.profissao}.`;
    }
}

// Criando objetos (instâncias) a partir da classe
const pessoa1 = new Pessoa("Carlos", 30, "Engenheiro");
const pessoa2 = new Pessoa("Maria", 25, "Médica");

// Usando métodos da classe
console.log(pessoa1.apresentar()); // Olá, meu nome é Carlos, tenho 30 anos e sou Engenheiro.
console.log(pessoa2.apresentar()); // Olá, meu nome é Maria, tenho 25 anos e sou Médica.

console.log(pessoa1.fazerAniversario()); // Carlos agora tem 31 anos.
console.log(pessoa2.mudarProfissao("Cirurgiã")); // Maria agora é Cirurgiã.

// 3. PROPRIEDADES E MÉTODOS ESTÁTICOS
// --------------------------------

console.log("\n=== PROPRIEDADES E MÉTODOS ESTÁTICOS ===");

class Matematica {
    // Propriedade estática
    static PI = 3.14159;
    
    // Método estático
    static calcularAreaCirculo(raio) {
        return this.PI * raio * raio;
    }
    
    static calcularCircunferencia(raio) {
        return 2 * this.PI * raio;
    }
    
    static somar(a, b) {
        return a + b;
    }
}

// Acessando propriedades e métodos estáticos
console.log(`Valor de PI: ${Matematica.PI}`); // Valor de PI: 3.14159
console.log(`Área do círculo com raio 5: ${Matematica.calcularAreaCirculo(5).toFixed(2)}`); // 78.54
console.log(`Circunferência com raio 5: ${Matematica.calcularCircunferencia(5).toFixed(2)}`); // 31.42
console.log(`Soma de 10 + 5: ${Matematica.somar(10, 5)}`); // 15

// 4. GETTERS E SETTERS
// -----------------

console.log("\n=== GETTERS E SETTERS ===");

class ContaBancaria {
    constructor(titular, saldoInicial) {
        this._titular = titular; // Convenção: propriedade "privada"
        this._saldo = saldoInicial;
        this._ativa = true;
    }
    
    // Getter
    get saldo() {
        if (!this._ativa) {
            return "Conta inativa";
        }
        return `R$ ${this._saldo.toFixed(2)}`;
    }
    
    // Setter
    set saldo(valor) {
        if (!this._ativa) {
            console.log("Conta inativa. Operação não realizada.");
            return;
        }
        
        if (valor < 0) {
            console.log("Não é possível definir um saldo negativo");
            return;
        }
        
        this._saldo = valor;
        console.log(`Saldo alterado para: R$ ${this._saldo.toFixed(2)}`);
    }
    
    // Getter
    get titular() {
        return this._titular;
    }
    
    // Setter
    set titular(novoTitular) {
        if (novoTitular.length < 3) {
            console.log("Nome do titular muito curto");
            return;
        }
        this._titular = novoTitular;
        console.log(`Titular alterado para: ${this._titular}`);
    }
    
    // Métodos regulares
    depositar(valor) {
        if (!this._ativa) {
            return "Conta inativa. Operação não realizada.";
        }
        
        if (valor <= 0) {
            return "Valor inválido para depósito";
        }
        
        this._saldo += valor;
        return `Depósito de R$ ${valor.toFixed(2)} realizado. Novo saldo: ${this.saldo}`;
    }
    
    sacar(valor) {
        if (!this._ativa) {
            return "Conta inativa. Operação não realizada.";
        }
        
        if (valor <= 0) {
            return "Valor inválido para saque";
        }
        
        if (valor > this._saldo) {
            return "Saldo insuficiente";
        }
        
        this._saldo -= valor;
        return `Saque de R$ ${valor.toFixed(2)} realizado. Novo saldo: ${this.saldo}`;
    }
    
    desativar() {
        this._ativa = false;
        return "Conta desativada";
    }
    
    reativar() {
        this._ativa = true;
        return "Conta reativada";
    }
}

// Criando uma conta
const conta = new ContaBancaria("João Silva", 1000);

// Utilizando getters
console.log(`Titular: ${conta.titular}`); // Titular: João Silva
console.log(`Saldo atual: ${conta.saldo}`); // Saldo atual: R$ 1000.00

// Utilizando setters
conta.saldo = 1500; // Saldo alterado para: R$ 1500.00
conta.saldo = -500; // Não é possível definir um saldo negativo

conta.titular = "João Oliveira Silva"; // Titular alterado para: João Oliveira Silva
conta.titular = "Jo"; // Nome do titular muito curto

// Utilizando métodos
console.log(conta.depositar(250)); // Depósito de R$ 250.00 realizado. Novo saldo: R$ 1750.00
console.log(conta.sacar(500)); // Saque de R$ 500.00 realizado. Novo saldo: R$ 1250.00
console.log(conta.sacar(2000)); // Saldo insuficiente

// Desativando a conta
console.log(conta.desativar()); // Conta desativada
console.log(conta.depositar(100)); // Conta inativa. Operação não realizada.
console.log(conta.saldo); // Conta inativa

// Reativando a conta
console.log(conta.reativar()); // Conta reativada
console.log(conta.saldo); // R$ 1250.00

// 5. CAMPOS PRIVADOS (ES2022+)
// -------------------------

console.log("\n=== CAMPOS PRIVADOS ===");

class ContaBancariaSeguran {
    // Campos verdadeiramente privados
    #saldo;
    #titular;
    #ativa;
    
    constructor(titular, saldoInicial) {
        this.#titular = titular;
        this.#saldo = saldoInicial;
        this.#ativa = true;
    }
    
    get saldo() {
        if (!this.#ativa) {
            return "Conta inativa";
        }
        return `R$ ${this.#saldo.toFixed(2)}`;
    }
    
    get titular() {
        return this.#titular;
    }
    
    // Método privado
    #validarOperacao(valor) {
        if (!this.#ativa) {
            return false;
        }
        
        if (valor <= 0) {
            return false;
        }
        
        return true;
    }
    
    depositar(valor) {
        if (!this.#validarOperacao(valor)) {
            return "Operação inválida";
        }
        
        this.#saldo += valor;
        return `Depósito de R$ ${valor.toFixed(2)} realizado. Novo saldo: ${this.saldo}`;
    }
    
    sacar(valor) {
        if (!this.#validarOperacao(valor)) {
            return "Operação inválida";
        }
        
        if (valor > this.#saldo) {
            return "Saldo insuficiente";
        }
        
        this.#saldo -= valor;
        return `Saque de R$ ${valor.toFixed(2)} realizado. Novo saldo: ${this.saldo}`;
    }
}

// Criando uma conta com campos privados
const contaSegura = new ContaBancariaSeguran("Maria Oliveira", 2000);

console.log(`Titular: ${contaSegura.titular}`); // Titular: Maria Oliveira
console.log(`Saldo: ${contaSegura.saldo}`); // Saldo: R$ 2000.00

console.log(contaSegura.depositar(300)); // Depósito de R$ 300.00 realizado. Novo saldo: R$ 2300.00
console.log(contaSegura.sacar(100)); // Saque de R$ 100.00 realizado. Novo saldo: R$ 2200.00

// Tentativa de acessar campo privado (causaria erro se não estivesse comentado)
// console.log(contaSegura.#saldo); // SyntaxError: Private field '#saldo' must be declared in an enclosing class

// 6. HERANÇA BÁSICA
// --------------

console.log("\n=== HERANÇA ===");

// Classe base (ou classe pai)
class Animal {
    constructor(nome) {
        this.nome = nome;
    }
    
    emitirSom() {
        return "Som genérico de animal";
    }
    
    mover() {
        return `${this.nome} está se movendo.`;
    }
    
    apresentar() {
        return `Este animal é ${this.nome} e faz "${this.emitirSom()}"`;
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
    emitirSom() {
        return "Miau!";
    }
    
    // Método específico da classe filha
    arranhar() {
        return `${this.nome} está arranhando o sofá!`;
    }
    
    // Sobrescreve e estende o método apresentar
    apresentar() {
        return `${super.apresentar()} e é um gato de cor ${this.cor}.`;
    }
}

// Outra classe derivada
class Cachorro extends Animal {
    constructor(nome, raca) {
        super(nome);
        this.raca = raca;
    }
    
    emitirSom() {
        return "Au au!";
    }
    
    buscar() {
        return `${this.nome} está buscando a bolinha!`;
    }
    
    apresentar() {
        return `${super.apresentar()} e é um cachorro da raça ${this.raca}.`;
    }
}

// Criando instâncias
const animal = new Animal("Criatura");
const gato = new Gato("Whiskers", "Cinza");
const cachorro = new Cachorro("Rex", "Labrador");

// Testando métodos e herança
console.log(animal.apresentar()); // Este animal é Criatura e faz "Som genérico de animal"
console.log(gato.apresentar()); // Este animal é Whiskers e faz "Miau!" e é um gato de cor Cinza.
console.log(cachorro.apresentar()); // Este animal é Rex e faz "Au au!" e é um cachorro da raça Labrador.

// Métodos específicos das classes filhas
console.log(gato.arranhar()); // Whiskers está arranhando o sofá!
console.log(cachorro.buscar()); // Rex está buscando a bolinha!

// Método da classe pai (herdado)
console.log(gato.mover()); // Whiskers está se movendo.
console.log(cachorro.mover()); // Rex está se movendo.

// 7. POLIMORFISMO
// -----------

console.log("\n=== POLIMORFISMO ===");

class Forma {
    constructor() {
        // Verifica se estamos instanciando a classe abstrata diretamente
        if (this.constructor === Forma) {
            throw new Error("Forma é uma classe abstrata e não pode ser instanciada diretamente.");
        }
    }
    
    calcularArea() {
        // Método a ser sobrescrito pelas classes filhas
        throw new Error("Método calcularArea() deve ser implementado pelas classes filhas.");
    }
    
    descricao() {
        return `Esta forma tem área de ${this.calcularArea().toFixed(2)} unidades quadradas.`;
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
    
    // Método específico
    calcularPerimetro() {
        return 2 * (this.largura + this.altura);
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
    
    // Método específico
    calcularCircunferencia() {
        return 2 * Math.PI * this.raio;
    }
}

class Triangulo extends Forma {
    constructor(base, altura) {
        super();
        this.base = base;
        this.altura = altura;
    }
    
    calcularArea() {
        return (this.base * this.altura) / 2;
    }
}

// Função que demonstra polimorfismo
function mostrarAreaDaForma(forma) {
    if (!(forma instanceof Forma)) {
        return "Isso não é uma forma geométrica válida.";
    }
    
    // A mesma chamada de método comporta-se diferentemente
    // dependendo do tipo real do objeto
    return forma.descricao();
}

// Criando instâncias
// const formaAbstrata = new Forma(); // Erro: Forma é uma classe abstrata
const retangulo = new Retangulo(5, 4);
const circulo = new Circulo(3);
const triangulo = new Triangulo(6, 8);

// Testando polimorfismo
console.log(mostrarAreaDaForma(retangulo)); // Esta forma tem área de 20.00 unidades quadradas.
console.log(mostrarAreaDaForma(circulo)); // Esta forma tem área de 28.27 unidades quadradas.
console.log(mostrarAreaDaForma(triangulo)); // Esta forma tem área de 24.00 unidades quadradas.

// Métodos específicos das subclasses
console.log(`Perímetro do retângulo: ${retangulo.calcularPerimetro()}`); // 18
console.log(`Circunferência do círculo: ${circulo.calcularCircunferencia().toFixed(2)}`); // 18.85

// 8. EXERCÍCIO PRÁTICO: SISTEMA DE BIBLIOTECA
// --------------------------------------

console.log("\n=== SISTEMA DE BIBLIOTECA ===");

class Livro {
    constructor(titulo, autor, anoPublicacao) {
        this.titulo = titulo;
        this.autor = autor;
        this.anoPublicacao = anoPublicacao;
        this.disponivel = true;
    }
    
    emprestar() {
        if (!this.disponivel) {
            return `O livro "${this.titulo}" já está emprestado.`;
        }
        this.disponivel = false;
        return `O livro "${this.titulo}" foi emprestado com sucesso.`;
    }
    
    devolver() {
        if (this.disponivel) {
            return `O livro "${this.titulo}" não estava emprestado.`;
        }
        this.disponivel = true;
        return `O livro "${this.titulo}" foi devolvido com sucesso.`;
    }
    
    informacoes() {
        return `"${this.titulo}" por ${this.autor} (${this.anoPublicacao}) - ${this.disponivel ? 'Disponível' : 'Emprestado'}`;
    }
}

class Biblioteca {
    constructor(nome) {
        this.nome = nome;
        this.livros = [];
    }
    
    adicionarLivro(livro) {
        if (!(livro instanceof Livro)) {
            return "Só é possível adicionar objetos do tipo Livro.";
        }
        this.livros.push(livro);
        return `Livro "${livro.titulo}" adicionado com sucesso à biblioteca ${this.nome}.`;
    }
    
    buscarPorTitulo(titulo) {
        const tituloLower = titulo.toLowerCase();
        const livrosEncontrados = this.livros.filter(
            livro => livro.titulo.toLowerCase().includes(tituloLower)
        );
        
        if (livrosEncontrados.length === 0) {
            return `Nenhum livro encontrado com o título "${titulo}".`;
        }
        
        return livrosEncontrados.map(livro => livro.informacoes()).join('\n');
    }
    
    buscarPorAutor(autor) {
        const autorLower = autor.toLowerCase();
        const livrosEncontrados = this.livros.filter(
            livro => livro.autor.toLowerCase().includes(autorLower)
        );
        
        if (livrosEncontrados.length === 0) {
            return `Nenhum livro encontrado do autor "${autor}".`;
        }
        
        return livrosEncontrados.map(livro => livro.informacoes()).join('\n');
    }
    
    emprestarLivro(titulo) {
        const livro = this.livros.find(
            livro => livro.titulo.toLowerCase() === titulo.toLowerCase()
        );
        
        if (!livro) {
            return `Livro "${titulo}" não encontrado.`;
        }
        
        return livro.emprestar();
    }
    
    devolverLivro(titulo) {
        const livro = this.livros.find(
            livro => livro.titulo.toLowerCase() === titulo.toLowerCase()
        );
        
        if (!livro) {
            return `Livro "${titulo}" não encontrado.`;
        }
        
        return livro.devolver();
    }
    
    listarLivros() {
        if (this.livros.length === 0) {
            return "A biblioteca não possui livros.";
        }
        
        return `Livros na biblioteca ${this.nome}:\n` + 
            this.livros.map(livro => livro.informacoes()).join('\n');
    }
}

// Testando o sistema
const biblioteca = new Biblioteca("Biblioteca Municipal");

// Adicionando livros
console.log(biblioteca.adicionarLivro(new Livro("O Senhor dos Anéis", "J.R.R. Tolkien", 1954)));
console.log(biblioteca.adicionarLivro(new Livro("Harry Potter e a Pedra Filosofal", "J.K. Rowling", 1997)));
console.log(biblioteca.adicionarLivro(new Livro("1984", "George Orwell", 1949)));
console.log(biblioteca.adicionarLivro(new Livro("O Hobbit", "J.R.R. Tolkien", 1937)));

// Listando livros
console.log("\nListando todos os livros:");
console.log(biblioteca.listarLivros());

// Buscando livros
console.log("\nBuscando por autor:");
console.log(biblioteca.buscarPorAutor("Tolkien"));

console.log("\nBuscando por título:");
console.log(biblioteca.buscarPorTitulo("Harry"));

// Emprestando e devolvendo livros
console.log("\nOperações de empréstimo e devolução:");
console.log(biblioteca.emprestarLivro("1984"));
console.log(biblioteca.emprestarLivro("1984")); // Deve mostrar que não está disponível
console.log(biblioteca.devolverLivro("1984"));
console.log(biblioteca.devolverLivro("1984")); // Deve mostrar que não estava emprestado

// Listando livros novamente para verificar atualizações
console.log("\nListando livros após operações:");
console.log(biblioteca.listarLivros()); 