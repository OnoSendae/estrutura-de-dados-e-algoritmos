# Estudo de Caso: Sistema de Controle de Versão com Estruturas Persistentes

## 🔄 Revisitando Conceitos Aplicados

Neste estudo de caso, aplicaremos os conceitos de estruturas de dados persistentes que estudamos nas aulas anteriores para construir um sistema simplificado de controle de versão, semelhante ao Git. Este exemplo integra conceitos de:

1. Árvores persistentes para representar o histórico de versões
2. Mapas imutáveis para armazenar o conteúdo dos arquivos
3. Listas persistentes para gerenciar conjuntos de alterações
4. Compartilhamento estrutural para eficiência de memória

## 🎯 Objetivos de Aprendizagem

- Integrar diferentes estruturas de dados persistentes em um único sistema
- Aplicar conceitos de compartilhamento estrutural em um caso real
- Desenvolver um sistema que mantém histórico completo de alterações
- Implementar operações comuns de sistemas de controle de versão
- Entender os benefícios práticos da persistência em sistemas complexos

## 🏗️ Arquitetura do Sistema

Nosso sistema de controle de versão simplificado, que chamaremos de "PersistentVCS", terá a seguinte arquitetura:

```ascii
┌─────────────────────┐
│    Repositório      │
│                     │
│  ┌───────────────┐  │
│  │  Histórico    │  │
│  │ (Árvore de    │  │
│  │  Commits)     │  │
│  └───────────────┘  │
│                     │
│  ┌───────────────┐  │
│  │  Workspace    │  │
│  │ (Arquivos     │  │
│  │  Atuais)      │  │
│  └───────────────┘  │
│                     │
│  ┌───────────────┐  │
│  │   Staging     │  │
│  │  (Alterações  │  │
│  │   Pendentes)  │  │
│  └───────────────┘  │
└─────────────────────┘
```

### Componentes Principais:

1. **Commit**: Uma versão imutável do estado do repositório
2. **Blob**: Representa o conteúdo de um arquivo
3. **Tree**: Diretório que aponta para blobs ou outras árvores
4. **Repository**: Contém todo o histórico de versões
5. **Branch**: Referência para um commit específico
6. **Workspace**: Arquivos de trabalho atual
7. **Staging Area**: Alterações preparadas para o próximo commit

## 📝 Implementação do Sistema

Vamos implementar este sistema usando TypeScript e as bibliotecas imutáveis que estudamos:

```typescript
import { Map, List } from 'immutable';

// Tipos básicos
type Hash = string;
type Path = string;
type Content = string;

// Blob - Conteúdo imutável de um arquivo
interface Blob {
    type: 'blob';
    hash: Hash;
    content: Content;
}

// Tree - Diretório que aponta para blobs e outras árvores
interface Tree {
    type: 'tree';
    hash: Hash;
    entries: Map<string, Hash>; // nome -> hash
}

// Commit - Versão imutável do repositório
interface Commit {
    hash: Hash;
    message: string;
    timestamp: number;
    rootTree: Hash;
    parent: Hash | null;
}

// Modelo básico de um repositório
class Repository {
    private objects: Map<Hash, Blob | Tree | Commit>;
    private branches: Map<string, Hash>;
    private HEAD: string; // Nome do branch atual ou hash do commit
    private staging: Map<Path, Content | null>; // null indica remoção
    private workspace: Map<Path, Content>;
    
    constructor() {
        this.objects = Map();
        this.branches = Map().set('main', '');
        this.HEAD = 'main';
        this.staging = Map();
        this.workspace = Map();
    }
    
    // Calcula um hash simples (em um sistema real seria SHA-1/SHA-256)
    private calculateHash(data: any): Hash {
        let str = JSON.stringify(data);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0; // Converte para inteiro de 32 bits
        }
        return hash.toString(16).padStart(8, '0');
    }
    
    // Cria e armazena um blob
    private createBlob(content: Content): Hash {
        const blob: Blob = {
            type: 'blob',
            content,
            hash: ''
        };
        blob.hash = this.calculateHash(blob.content);
        this.objects = this.objects.set(blob.hash, blob);
        return blob.hash;
    }
    
    // Cria e armazena uma árvore
    private createTree(entries: Map<string, Hash>): Hash {
        const tree: Tree = {
            type: 'tree',
            entries,
            hash: ''
        };
        tree.hash = this.calculateHash(tree.entries.toJS());
        this.objects = this.objects.set(tree.hash, tree);
        return tree.hash;
    }
    
    // Cria um commit com as alterações atuais
    commit(message: string): Hash | null {
        // Verifica se há alterações para commit
        if (this.staging.size === 0) {
            return null;
        }
        
        // Obtém o último commit, se existir
        let parentHash = null;
        if (this.branches.get(this.HEAD)) {
            parentHash = this.branches.get(this.HEAD) || null;
        }
        
        // Captura o estado atual da árvore
        let currentTree = parentHash 
            ? (this.objects.get(
                (this.objects.get(parentHash) as Commit).rootTree
              ) as Tree).entries
            : Map<string, Hash>();
            
        // Aplica as alterações do staging
        this.staging.forEach((content, path) => {
            if (content === null) {
                // Remoção de arquivo
                currentTree = currentTree.remove(path);
            } else {
                // Adição ou modificação de arquivo
                const blobHash = this.createBlob(content);
                currentTree = currentTree.set(path, blobHash);
            }
        });
        
        // Cria a nova árvore raiz
        const rootTreeHash = this.createTree(currentTree);
        
        // Cria o commit
        const commit: Commit = {
            hash: '',
            message,
            timestamp: Date.now(),
            rootTree: rootTreeHash,
            parent: parentHash
        };
        
        commit.hash = this.calculateHash(
            commit.message + commit.timestamp + commit.rootTree + commit.parent
        );
        
        // Armazena o commit
        this.objects = this.objects.set(commit.hash, commit);
        
        // Atualiza o branch atual
        this.branches = this.branches.set(this.HEAD, commit.hash);
        
        // Limpa a área de staging
        this.staging = this.staging.clear();
        
        return commit.hash;
    }
    
    // Adiciona um arquivo ao staging
    add(path: Path, content: Content): void {
        this.workspace = this.workspace.set(path, content);
        this.staging = this.staging.set(path, content);
    }
    
    // Remove um arquivo
    remove(path: Path): void {
        this.workspace = this.workspace.remove(path);
        this.staging = this.staging.set(path, null);
    }
    
    // Cria um novo branch
    createBranch(name: string): boolean {
        if (this.branches.has(name)) {
            return false;
        }
        
        const currentCommitHash = this.branches.get(this.HEAD);
        if (!currentCommitHash) {
            return false;
        }
        
        this.branches = this.branches.set(name, currentCommitHash);
        return true;
    }
    
    // Muda para outro branch
    checkout(branchName: string): boolean {
        if (!this.branches.has(branchName)) {
            return false;
        }
        
        // Atualiza o HEAD
        this.HEAD = branchName;
        
        // Atualiza o workspace com o conteúdo do commit atual
        const commitHash = this.branches.get(branchName);
        if (commitHash) {
            const commit = this.objects.get(commitHash) as Commit;
            const rootTree = this.objects.get(commit.rootTree) as Tree;
            
            // Limpa o workspace e o preenche com os arquivos do commit
            this.workspace = this.workspace.clear();
            rootTree.entries.forEach((hash, path) => {
                const blob = this.objects.get(hash) as Blob;
                this.workspace = this.workspace.set(path, blob.content);
            });
            
            // Limpa a área de staging
            this.staging = this.staging.clear();
        }
        
        return true;
    }
    
    // Obtém o histórico de commits
    log(): Commit[] {
        const commits: Commit[] = [];
        let currentHash = this.branches.get(this.HEAD);
        
        while (currentHash) {
            const commit = this.objects.get(currentHash) as Commit;
            commits.push(commit);
            currentHash = commit.parent;
        }
        
        return commits;
    }
    
    // Obtém o conteúdo de um arquivo em um commit específico
    getFileAtCommit(path: Path, commitHash: Hash): Content | null {
        const commit = this.objects.get(commitHash) as Commit;
        if (!commit) return null;
        
        const rootTree = this.objects.get(commit.rootTree) as Tree;
        if (!rootTree) return null;
        
        const blobHash = rootTree.entries.get(path);
        if (!blobHash) return null;
        
        const blob = this.objects.get(blobHash) as Blob;
        return blob ? blob.content : null;
    }
    
    // Obtém as diferenças entre dois commits
    diff(commitHash1: Hash, commitHash2: Hash): Map<Path, [Content | null, Content | null]> {
        const commit1 = this.objects.get(commitHash1) as Commit;
        const commit2 = this.objects.get(commitHash2) as Commit;
        
        if (!commit1 || !commit2) return Map();
        
        const tree1 = this.objects.get(commit1.rootTree) as Tree;
        const tree2 = this.objects.get(commit2.rootTree) as Tree;
        
        // Coleta todos os caminhos em ambas as árvores
        const allPaths = Set([
            ...tree1.entries.keys(),
            ...tree2.entries.keys()
        ]);
        
        let differences = Map<Path, [Content | null, Content | null]>();
        
        allPaths.forEach(path => {
            const hash1 = tree1.entries.get(path);
            const hash2 = tree2.entries.get(path);
            
            let content1: Content | null = null;
            let content2: Content | null = null;
            
            if (hash1) {
                content1 = (this.objects.get(hash1) as Blob).content;
            }
            
            if (hash2) {
                content2 = (this.objects.get(hash2) as Blob).content;
            }
            
            // Se os conteúdos são diferentes, registra a diferença
            if (content1 !== content2) {
                differences = differences.set(path, [content1, content2]);
            }
        });
        
        return differences;
    }
    
    // Mescla um branch no branch atual
    merge(branchName: string, message: string): Hash | null {
        if (!this.branches.has(branchName)) {
            return null;
        }
        
        const currentCommitHash = this.branches.get(this.HEAD);
        const targetCommitHash = this.branches.get(branchName);
        
        if (!currentCommitHash || !targetCommitHash) {
            return null;
        }
        
        // Aqui implementaríamos a lógica complexa de mesclagem
        // Esta é uma versão simplificada que apenas aplica as alterações do outro branch
        const differences = this.diff(currentCommitHash, targetCommitHash);
        
        // Aplica as diferenças ao workspace e staging
        differences.forEach(([_, contentInTarget], path) => {
            if (contentInTarget === null) {
                this.remove(path);
            } else {
                this.add(path, contentInTarget);
            }
        });
        
        // Cria um commit de mesclagem com dois pais
        // Nota: Nossa implementação simples não suporta múltiplos pais, 
        // mas um sistema real como Git suportaria
        return this.commit(`Merge '${branchName}' into '${this.HEAD}': ${message}`);
    }
    
    // Obtém o estado atual do workspace
    getWorkspace(): Map<Path, Content> {
        return this.workspace;
    }
    
    // Obtém o estado atual do staging
    getStaging(): Map<Path, Content | null> {
        return this.staging;
    }
    
    // Obtém todos os branches
    getBranches(): Map<string, Hash> {
        return this.branches;
    }
    
    // Obtém o branch atual
    getCurrentBranch(): string {
        return this.HEAD;
    }
}
```

## 🚀 Exemplo de Uso do Sistema

Vamos demonstrar como o sistema funcionaria em um caso de uso real:

```typescript
// Criar um repositório
const repo = new Repository();

// Adicionar alguns arquivos
repo.add('README.md', '# Projeto Exemplo\nEste é um projeto de exemplo.');
repo.add('src/index.js', 'console.log("Hello World!");');

// Fazer o primeiro commit
const commit1 = repo.commit('Commit inicial');
console.log('Commit 1:', commit1);

// Modificar um arquivo e adicionar outro
repo.add('README.md', '# Projeto Exemplo\nEste é um projeto de exemplo.\n\n## Como usar\nExecute `node src/index.js`.');
repo.add('package.json', '{\n  "name": "exemplo",\n  "version": "1.0.0"\n}');

// Segundo commit
const commit2 = repo.commit('Adiciona instruções e package.json');
console.log('Commit 2:', commit2);

// Criar um branch para uma feature
repo.createBranch('feature/nova-funcionalidade');
repo.checkout('feature/nova-funcionalidade');

// Adicionar uma nova funcionalidade
repo.add('src/utils.js', 'function helper() {\n  return "Helper function";\n}');
repo.add('src/index.js', 'const helper = require("./utils");\nconsole.log("Hello World with", helper());');

// Commit na feature
const commit3 = repo.commit('Adiciona funcionalidade helper');
console.log('Commit 3:', commit3);

// Voltar ao branch principal
repo.checkout('main');

// Ver o conteúdo atual (deve ser o do commit2)
console.log('Workspace depois de voltar ao main:', repo.getWorkspace().toJS());

// Mesclar a feature
const mergeCommit = repo.merge('feature/nova-funcionalidade', 'Adiciona helper');
console.log('Commit de merge:', mergeCommit);

// Ver o log de commits
console.log('Log de commits:');
repo.log().forEach(commit => {
    console.log(`${commit.hash} - ${commit.message} (${new Date(commit.timestamp).toISOString()})`);
});

// Ver diferenças entre o primeiro e último commit
const diffs = repo.diff(commit1 || '', mergeCommit || '');
console.log('Diferenças entre o primeiro e último commit:');
diffs.forEach((contents, path) => {
    console.log(`Arquivo: ${path}`);
    console.log(`- Original: ${contents[0] || '(Não existia)'}`);
    console.log(`+ Atual: ${contents[1] || '(Removido)'}`);
    console.log('---');
});
```

## 🔍 Análise do Sistema

### Vantagens da Abordagem Persistente

1. **Histórico Completo**: Todas as versões são preservadas automaticamente
2. **Eficiência de Espaço**: O compartilhamento estrutural economiza memória
3. **Operações Concorrentes**: Múltiplas operações podem ocorrer sem conflitos
4. **Simplicidade Conceitual**: O modelo é mais fácil de entender e depurar
5. **Rastreabilidade**: Qualquer estado pode ser inspecionado a qualquer momento

### Desafios e Limitações

1. **Complexidade de Implementação**: Especialmente para operações como merge
2. **Sobrecarga Inicial**: Há overhead na conversão de estruturas mutáveis para imutáveis
3. **Integração com Sistemas Existentes**: Pode exigir adaptadores para APIs tradicionais
4. **Curva de Aprendizado**: Pensar em termos imutáveis requer mudança de mentalidade

### Comparação com Sistemas Reais

Sistemas reais como Git têm implementações mais sofisticadas, incluindo:

1. **Algoritmos de Mesclagem Avançados**: Para resolver conflitos automaticamente
2. **Compressão de Objetos**: Para minimizar o uso de disco
3. **Estratégias de Garbage Collection**: Para remover objetos inacessíveis
4. **Índices Otimizados**: Para rápida busca e recuperação de objetos

## 🎯 Extensões e Exercícios

### Exercícios Básicos

1. Implemente um método `status()` que mostra arquivos modificados, adicionados e removidos.
2. Adicione um método `reset()` que descarta as alterações no staging.
3. Crie uma função para listar todos os arquivos em um commit específico.

### Exercícios Intermediários

4. Implemente um sistema de tags para marcar commits específicos.
5. Adicione suporte para lidar com subdiretórios (caminhos aninhados).
6. Crie um método de `revert()` que desfaz um commit específico.

### Exercícios Avançados

7. Implemente um algoritmo de mesclagem de três vias (three-way merge).
8. Adicione suporte para operações de "rebase" que reaplica commits.
9. Implemente um mecanismo para visualizar diferenças de linha por linha entre versões de arquivos.

## 🔗 Recursos Adicionais

- [Pro Git Book](https://git-scm.com/book/en/v2) - Uma referência completa sobre Git
- [Designing Data-Intensive Applications](https://dataintensive.net/) - Contém capítulos sobre sistemas de versão
- [Building Git](https://shop.jcoglan.com/building-git/) - Um guia para construir um sistema de controle de versão do zero
- [Immutable.js](https://immutable-js.com/) - A biblioteca que usamos nos exemplos

---

