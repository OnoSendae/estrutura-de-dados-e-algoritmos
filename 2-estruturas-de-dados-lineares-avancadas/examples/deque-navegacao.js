/**
 * Sistema de Navegação de Histórico usando Deque
 * 
 * Este exemplo implementa a funcionalidade de navegação "voltar/avançar" de um navegador web,
 * usando deques para gerenciar o histórico de navegação.
 */

// Implementação de Deque baseada em Lista Duplamente Encadeada
class Node {
    constructor(data) {
        this.data = data;
        this.prev = null;
        this.next = null;
    }
}

class Deque {
    constructor() {
        this.front = null;
        this.rear = null;
        this.size = 0;
    }
    
    // Adiciona elemento no início
    addFront(data) {
        const newNode = new Node(data);
        
        if (this.isEmpty()) {
            this.front = newNode;
            this.rear = newNode;
        } else {
            newNode.next = this.front;
            this.front.prev = newNode;
            this.front = newNode;
        }
        
        this.size++;
    }
    
    // Adiciona elemento no final
    addRear(data) {
        const newNode = new Node(data);
        
        if (this.isEmpty()) {
            this.front = newNode;
            this.rear = newNode;
        } else {
            this.rear.next = newNode;
            newNode.prev = this.rear;
            this.rear = newNode;
        }
        
        this.size++;
    }
    
    // Remove e retorna elemento do início
    removeFront() {
        if (this.isEmpty()) {
            return null;
        }
        
        const data = this.front.data;
        
        if (this.front === this.rear) {
            this.front = null;
            this.rear = null;
        } else {
            this.front = this.front.next;
            this.front.prev = null;
        }
        
        this.size--;
        return data;
    }
    
    // Remove e retorna elemento do final
    removeRear() {
        if (this.isEmpty()) {
            return null;
        }
        
        const data = this.rear.data;
        
        if (this.front === this.rear) {
            this.front = null;
            this.rear = null;
        } else {
            this.rear = this.rear.prev;
            this.rear.next = null;
        }
        
        this.size--;
        return data;
    }
    
    // Consulta elemento do início sem remover
    peekFront() {
        return this.isEmpty() ? null : this.front.data;
    }
    
    // Consulta elemento do final sem remover
    peekRear() {
        return this.isEmpty() ? null : this.rear.data;
    }
    
    // Verifica se o deque está vazio
    isEmpty() {
        return this.size === 0;
    }
    
    // Retorna o tamanho do deque
    getSize() {
        return this.size;
    }
    
    // Limpa o deque
    clear() {
        this.front = null;
        this.rear = null;
        this.size = 0;
    }
    
    // Converte o deque em array
    toArray() {
        const result = [];
        let current = this.front;
        
        while (current) {
            result.push(current.data);
            current = current.next;
        }
        
        return result;
    }
}

/**
 * Implementação de um sistema de navegação web
 */
class BrowserHistory {
    constructor(homePage) {
        // Histórico de navegação para trás
        this.backHistory = new Deque();
        
        // Histórico de navegação para frente
        this.forwardHistory = new Deque();
        
        // Página atual
        this.currentPage = homePage;
        
        console.log(`Iniciando navegação em: ${homePage}`);
    }
    
    // Navega para uma nova página
    navigate(url) {
        // Salva a página atual no histórico de "voltar"
        this.backHistory.addRear(this.currentPage);
        
        // Atualiza a página atual
        this.currentPage = url;
        
        // Limpa o histórico de "avançar"
        this.forwardHistory.clear();
        
        console.log(`Navegando para: ${url}`);
    }
    
    // Volta para a página anterior
    back() {
        if (this.backHistory.isEmpty()) {
            console.log("Não é possível voltar: início do histórico");
            return false;
        }
        
        // Salva a página atual no histórico de "avançar"
        this.forwardHistory.addFront(this.currentPage);
        
        // Atualiza a página atual com a última do histórico de "voltar"
        this.currentPage = this.backHistory.removeRear();
        
        console.log(`Voltando para: ${this.currentPage}`);
        return true;
    }
    
    // Avança para a próxima página
    forward() {
        if (this.forwardHistory.isEmpty()) {
            console.log("Não é possível avançar: fim do histórico");
            return false;
        }
        
        // Salva a página atual no histórico de "voltar"
        this.backHistory.addRear(this.currentPage);
        
        // Atualiza a página atual com a primeira do histórico de "avançar"
        this.currentPage = this.forwardHistory.removeFront();
        
        console.log(`Avançando para: ${this.currentPage}`);
        return true;
    }
    
    // Retorna a página atual
    getCurrentPage() {
        return this.currentPage;
    }
    
    // Retorna o histórico de navegação
    getHistory() {
        return {
            back: this.backHistory.toArray(),
            current: this.currentPage,
            forward: this.forwardHistory.toArray()
        };
    }
    
    // Exibe o estado atual da navegação
    displayState() {
        const history = this.getHistory();
        
        console.log("\n=== Estado da Navegação ===");
        console.log("Histórico para trás:", history.back.length ? history.back.join(" <- ") : "(vazio)");
        console.log("Página atual:", history.current);
        console.log("Histórico para frente:", history.forward.length ? history.forward.join(" -> ") : "(vazio)");
        console.log("===========================\n");
    }
}

// Exemplo de uso
function demoNavigation() {
    const browser = new BrowserHistory("https://www.home.com");
    browser.displayState();
    
    // Navega para algumas páginas
    browser.navigate("https://www.search.com");
    browser.displayState();
    
    browser.navigate("https://www.blog.com");
    browser.displayState();
    
    browser.navigate("https://www.article.com");
    browser.displayState();
    
    // Volta duas páginas
    browser.back();
    browser.displayState();
    
    browser.back();
    browser.displayState();
    
    // Avança uma página
    browser.forward();
    browser.displayState();
    
    // Navega para uma nova página (isso limpa o histórico para frente)
    browser.navigate("https://www.news.com");
    browser.displayState();
    
    // Tenta avançar (não deve ser possível)
    browser.forward();
    browser.displayState();
    
    // Volta para a página inicial
    browser.back();
    browser.back();
    browser.displayState();
}

// Executa a demonstração
demoNavigation();

/**
 * Este exemplo demonstra como um deque pode ser usado para implementar
 * a navegação de histórico de um navegador:
 * 
 * 1. Usamos dois deques:
 *    - backHistory: armazena páginas visitadas (para o comando "voltar")
 *    - forwardHistory: armazena páginas avançadas (para o comando "avançar")
 * 
 * 2. Quando o usuário navega para uma nova página:
 *    - A página atual é adicionada ao backHistory
 *    - forwardHistory é limpo (pois não há mais "para frente")
 * 
 * 3. Quando o usuário volta uma página:
 *    - A página atual é adicionada ao forwardHistory
 *    - A última página do backHistory se torna a página atual
 * 
 * 4. Quando o usuário avança uma página:
 *    - A página atual é adicionada ao backHistory
 *    - A primeira página do forwardHistory se torna a página atual
 * 
 * Esta implementação captura a essência de como navegadores web
 * gerenciam seu histórico de navegação.
 */ 