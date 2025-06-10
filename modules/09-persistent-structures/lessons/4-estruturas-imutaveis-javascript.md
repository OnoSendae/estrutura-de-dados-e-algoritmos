# Estruturas Imutáveis em JavaScript com Bibliotecas

## 🔄 Conexão com os Conceitos Anteriores

Até agora, exploramos a implementação manual de estruturas de dados persistentes em TypeScript. Nesta aula, vamos aplicar esses conceitos usando bibliotecas especializadas em JavaScript. Recordemos que as estruturas persistentes:

1. Preservam seu estado anterior quando modificadas
2. Compartilham estrutura para eficiência de memória
3. São ideais para aplicações concorrentes e reativas

## 🎯 Objetivos de Aprendizagem

- Conhecer as principais bibliotecas de estruturas imutáveis para JavaScript
- Aprender a utilizar Immutable.js para criar e manipular coleções persistentes
- Entender padrões e boas práticas no uso de estruturas imutáveis em aplicações reais
- Comparar diferentes abordagens para imutabilidade em JavaScript
- Implementar casos de uso comuns com estruturas imutáveis

## 📚 Principais Bibliotecas de Estruturas Imutáveis

### 1. Immutable.js

[Immutable.js](https://immutable-js.com/), desenvolvida pelo Facebook, é uma das bibliotecas mais populares para estruturas de dados imutáveis em JavaScript. Oferece implementações eficientes de:

- `List`: equivalente a um array
- `Map`: equivalente a um objeto/dicionário
- `Set`: coleção de valores únicos
- `Stack`: pilha com operações LIFO
- `Record`: objeto com forma predefinida
- Outras estruturas especializadas

### 2. Immer.js

[Immer](https://immerjs.github.io/immer/) aborda a imutabilidade de maneira diferente, com uma API que permite escrever código que parece mutável, mas produz estruturas imutáveis.

### 3. Mori

[Mori](https://github.com/swannodette/mori) traz as estruturas de dados persistentes de ClojureScript para JavaScript regular.

### 4. Outras Opções

- `Seamless-immutable`: Para estruturas imutáveis simples com API familiar
- `Icepick`: Utilitários para trabalhar com imutabilidade
- `Estruturas nativas`: O `Object.freeze()` e técnicas de spread de ES6+

## 🚀 Trabalhando com Immutable.js

### Instalação

```bash
npm install immutable
```

### Usando List (equivalente a Arrays)

```typescript
import { List } from 'immutable';

// Criando uma lista imutável
const emptyList = List();
const list1 = List([1, 2, 3, 4]);

// Operações básicas
const list2 = list1.push(5);       // Não modifica list1, retorna uma nova lista
const list3 = list1.unshift(0);    // Adiciona no início
const list4 = list2.pop();         // Remove o último
const list5 = list3.shift();       // Remove o primeiro
const list6 = list1.set(2, 10);    // Define o valor no índice 2 como 10
const list7 = list1.delete(1);     // Remove o item no índice 1

// Acessando elementos
const item = list1.get(2);           // 3
const itemWithDefault = list1.get(10, 'default');  // 'default'

// Verificações
const size = list1.size;           // 4
const includesThree = list1.includes(3);  // true

// Iteração
list1.forEach((value, index) => {
    console.log(`${index}: ${value}`);
});

// Map, filter, reduce (como em arrays)
const doubled = list1.map(x => x * 2);             // List [2, 4, 6, 8]
const evens = list1.filter(x => x % 2 === 0);      // List [2, 4]
const sum = list1.reduce((acc, val) => acc + val, 0);  // 10

// Conversão para JavaScript Array
const jsArray = list1.toArray();  // [1, 2, 3, 4]
```

### Usando Map (equivalente a Objetos/Dicionários)

```typescript
import { Map } from 'immutable';

// Criando mapas imutáveis
const emptyMap = Map();
const map1 = Map({
    name: 'Alice',
    age: 30,
    skills: ['JavaScript', 'TypeScript']
});

// Operações básicas
const map2 = map1.set('location', 'New York');     // Adiciona uma propriedade
const map3 = map1.delete('age');                   // Remove uma propriedade
const map4 = map1.update('age', age => age + 1);   // Modifica usando função

// Operações aninhadas
const map5 = map1.setIn(['skills', 1], 'React');
const map6 = map1.updateIn(['skills'], skills => skills.push('Node.js'));
const map7 = map1.deleteIn(['skills', 0]);

// Acessando valores
const name = map1.get('name');                    // 'Alice'
const unknownWithDefault = map1.get('unknown', 'default');  // 'default'
const skill = map1.getIn(['skills', 0]);          // 'JavaScript'

// Mesclando mapas
const mapA = Map({ a: 1, b: 2 });
const mapB = Map({ b: 3, c: 4 });
const merged = mapA.merge(mapB);  // Map { a: 1, b: 3, c: 4 }
const mergedWith = mapA.mergeWith((oldVal, newVal) => oldVal + newVal, mapB);
                                   // Map { a: 1, b: 5, c: 4 }

// Conversão para objeto JavaScript
const jsObj = map1.toJS();  // { name: 'Alice', age: 30, skills: ['JavaScript', 'TypeScript'] }
```

### Usando Set (Conjuntos)

```typescript
import { Set } from 'immutable';

// Criando conjuntos imutáveis
const emptySet = Set();
const set1 = Set(['red', 'green', 'blue']);

// Operações básicas
const set2 = set1.add('yellow');     // Set ['red', 'green', 'blue', 'yellow']
const set3 = set1.delete('green');   // Set ['red', 'blue']
const set4 = set1.clear();           // Set []

// Verificações
const hasRed = set1.has('red');      // true
const size = set1.size;              // 3

// Operações de conjuntos
const set5 = Set(['green', 'yellow', 'purple']);
const union = set1.union(set5);        // Set ['red', 'green', 'blue', 'yellow', 'purple']
const intersect = set1.intersect(set5); // Set ['green']
const difference = set1.subtract(set5); // Set ['red', 'blue']

// Conversão para array JavaScript
const jsArray = set1.toArray();  // ['red', 'green', 'blue']
```

### Usando Record (Objetos com Estrutura Fixa)

```typescript
import { Record } from 'immutable';

// Definir um tipo de Record (como uma classe)
const PersonRecord = Record({
    name: 'Anônimo',
    age: 0,
    address: {
        city: '',
        country: ''
    }
});

// Criando instâncias
const defaultPerson = new PersonRecord();
const john = new PersonRecord({
    name: 'John Doe',
    age: 28,
    address: {
        city: 'San Francisco',
        country: 'USA'
    }
});

// Acessando propriedades (como objetos normais)
console.log(john.name);  // 'John Doe'
console.log(john.address.city);  // 'San Francisco'

// Modificando (retorna novo Record)
const olderJohn = john.set('age', 29);
const johnInNewYork = john.setIn(['address', 'city'], 'New York');

// Verificando se é instância de um Record específico
console.log(john instanceof PersonRecord);  // true

// Usando como type em TypeScript
type Person = typeof PersonRecord.prototype;
const people: Person[] = [john, olderJohn];
```

## 💡 Padrões e Boas Práticas

### 1. Estruturas Aninhadas

O desafio com estruturas imutáveis é lidar com objetos aninhados:

```typescript
import { fromJS, Map } from 'immutable';

// Criar estrutura aninhada
const nestedData = fromJS({
    user: {
        name: 'Alice',
        contacts: [
            { type: 'email', value: 'alice@example.com' },
            { type: 'phone', value: '555-1234' }
        ]
    }
});

// Acessar e modificar dados aninhados
const email = nestedData.getIn(['user', 'contacts', 0, 'value']);
const updatedData = nestedData.setIn(
    ['user', 'contacts', 1, 'value'],
    '555-5678'
);
```

### 2. Performance com Estruturas Grandes

```typescript
import { Map } from 'immutable';

// Em vez de múltiplas operações separadas
let map = Map();
for (let i = 0; i < 1000; i++) {
    map = map.set(`key${i}`, i);  // Cria 1000 versões!
}

// Use operações em lote
const entries = Array.from({ length: 1000 }, (_, i) => [`key${i}`, i]);
const mapBatch = Map().withMutations(m => {
    entries.forEach(([key, value]) => m.set(key, value));
});
```

### 3. Integração com Bibliotecas React

```typescript
// Em um componente React
import { Map } from 'immutable';
import { useState } from 'react';

function UserProfile() {
    const [userData, setUserData] = useState(Map({
        name: 'Alice',
        isActive: true,
        loginCount: 5
    }));
    
    const handleIncrementLogins = () => {
        // Atualiza o estado de forma imutável
        setUserData(userData.update('loginCount', count => count + 1));
    };
    
    return (
        <div>
            <h1>{userData.get('name')}</h1>
            <p>Logins: {userData.get('loginCount')}</p>
            <button onClick={handleIncrementLogins}>Increment Logins</button>
        </div>
    );
}
```

## 🔄 Comparando Abordagens de Imutabilidade

### 1. Abordagem Manual (ES6+)

```typescript
// Spread operator para objetos simples
const user = { name: 'Alice', age: 30 };
const updatedUser = { ...user, age: 31 };

// Spread aninhado (mais complicado)
const profile = {
    user: {
        name: 'Alice',
        settings: { darkMode: true }
    }
};

const updatedProfile = {
    ...profile,
    user: {
        ...profile.user,
        settings: {
            ...profile.user.settings,
            darkMode: false
        }
    }
};
```

### 2. Utilizando Immer.js

```typescript
import produce from 'immer';

const profile = {
    user: {
        name: 'Alice',
        settings: { darkMode: true }
    }
};

// Parece código mutável mas é imutável!
const updatedProfile = produce(profile, draft => {
    draft.user.settings.darkMode = false;
});
```

### 3. Utilizando Immutable.js

```typescript
import { fromJS } from 'immutable';

const profile = fromJS({
    user: {
        name: 'Alice',
        settings: { darkMode: true }
    }
});

const updatedProfile = profile.setIn(['user', 'settings', 'darkMode'], false);
```

### Comparação de Desempenho

```typescript
import { Map as ImmutableMap } from 'immutable';
import produce from 'immer';

// Dados de teste
const largeObject = {};
for (let i = 0; i < 1000; i++) {
    largeObject[`key${i}`] = i;
}

// Medição de desempenho
console.time('ES6 Spread');
const updatedWithSpread = { ...largeObject, key500: 'modificado' };
console.timeEnd('ES6 Spread');

console.time('Immer');
const updatedWithImmer = produce(largeObject, draft => {
    draft.key500 = 'modificado';
});
console.timeEnd('Immer');

console.time('Immutable.js');
const immutableMap = ImmutableMap(largeObject);
const updatedWithImmutable = immutableMap.set('key500', 'modificado');
console.timeEnd('Immutable.js');
```

## 🌟 Aplicações Práticas

### 1. Gerenciamento de Estado com Redux

```typescript
import { Map } from 'immutable';

// Estado inicial
const initialState = Map({
    users: Map(),
    loading: false,
    error: null
});

// Reducer
function reducer(state = initialState, action) {
    switch (action.type) {
        case 'FETCH_USER_REQUEST':
            return state.set('loading', true);
            
        case 'FETCH_USER_SUCCESS':
            return state
                .set('loading', false)
                .setIn(['users', action.payload.id], action.payload);
                
        case 'FETCH_USER_FAILURE':
            return state
                .set('loading', false)
                .set('error', action.payload);
                
        default:
            return state;
    }
}
```

### 2. Cache com Versões

```typescript
import { Map } from 'immutable';

class VersionedCache {
    private cache: Map<string, any>;
    private versions: Map<string, any>[] = [];
    
    constructor() {
        this.cache = Map();
        this.versions.push(this.cache);
    }
    
    get(key: string): any {
        return this.cache.get(key);
    }
    
    set(key: string, value: any): void {
        this.cache = this.cache.set(key, value);
        this.versions.push(this.cache);
    }
    
    getVersion(version: number): Map<string, any> | undefined {
        return this.versions[version];
    }
    
    getCurrentVersion(): number {
        return this.versions.length - 1;
    }
}

// Uso
const cache = new VersionedCache();
cache.set('user:1', { name: 'Alice' });
cache.set('user:2', { name: 'Bob' });
cache.set('user:1', { name: 'Alice', role: 'Admin' });

// Acessar versões anteriores
console.log(cache.getVersion(1).get('user:1')); // { name: 'Alice' }
```

### 3. Editor de Texto com Histórico

```typescript
import { List } from 'immutable';

class TextEditor {
    private content: List<string>; // Linhas de texto
    private history: List<string>[] = [];
    private currentPosition = 0;
    
    constructor(initialText = '') {
        this.content = List(initialText.split('\n'));
        this.history.push(this.content);
    }
    
    getText(): string {
        return this.content.join('\n');
    }
    
    insertLine(lineNumber: number, text: string): void {
        const newContent = this.content.splice(lineNumber, 0, text);
        this._updateHistory(newContent);
    }
    
    removeLine(lineNumber: number): void {
        const newContent = this.content.delete(lineNumber);
        this._updateHistory(newContent);
    }
    
    updateLine(lineNumber: number, text: string): void {
        const newContent = this.content.set(lineNumber, text);
        this._updateHistory(newContent);
    }
    
    private _updateHistory(newContent: List<string>): void {
        this.content = newContent;
        
        // Remove versões futuras quando editamos a partir de um ponto anterior
        this.history = this.history.slice(0, this.currentPosition + 1);
        this.history.push(this.content);
        this.currentPosition = this.history.length - 1;
    }
    
    undo(): boolean {
        if (this.currentPosition > 0) {
            this.currentPosition--;
            this.content = this.history[this.currentPosition];
            return true;
        }
        return false;
    }
    
    redo(): boolean {
        if (this.currentPosition < this.history.length - 1) {
            this.currentPosition++;
            this.content = this.history[this.currentPosition];
            return true;
        }
        return false;
    }
}
```

## 🎯 Exercícios Práticos

### Exercícios Básicos

1. Crie uma lista imutável com Immutable.js e implemente operações para adicionar, remover e atualizar elementos.
2. Implemente um conjunto imutável para gerenciar tags únicas em um blog, com operações para adicionar e remover tags.
3. Use `Record` para criar um modelo imutável de usuário com validação de campos.

### Exercícios Intermediários

4. Implemente um carrinho de compras usando Immutable.js com funções para adicionar produtos, remover produtos e calcular o total.
5. Crie uma tabela de dados imutável que suporta ordenação por diferentes colunas.
6. Implemente um sistema de cache com tempo de expiração usando mapas imutáveis.

### Exercícios Avançados

7. Desenvolva um editor de texto simples com operações de desfazer/refazer usando Immutable.js.
8. Crie um gerenciador de estado inspirado em Redux usando estruturas imutáveis.
9. Implemente um jogo de tabuleiro (como jogo da velha) onde cada movimento gera um novo estado imutável do jogo.

## ❓ Perguntas Frequentes

1. **Quando devo escolher Immutable.js em vez de objetos JavaScript normais?**
   - Use Immutable.js quando a integridade dos dados é crítica, em aplicações grandes com muitos estados compartilhados, ou quando precisa de estruturas de dados persistentes eficientes.

2. **Qual é o impacto de desempenho de usar Immutable.js?**
   - Para estruturas menores, pode haver overhead. Para estruturas maiores ou com muitas atualizações, Immutable.js pode ser mais eficiente devido ao compartilhamento estrutural.

3. **Como posso usar Immutable.js com TypeScript?**
   - Immutable.js tem definições de tipos disponíveis. Use `npm install @types/immutable` para melhor suporte de tipo.

4. **Immer.js ou Immutable.js: qual devo escolher?**
   - Use Immer.js quando a ergonomia da API é mais importante e você prefere um estilo de programação imperativo. Use Immutable.js quando precisa de estruturas de dados persistentes mais poderosas e operações funcionais.

## 🔗 Recursos Adicionais

- [Documentação oficial do Immutable.js](https://immutable-js.com/)
- [Documentação do Immer.js](https://immerjs.github.io/immer/)
- [Immutable.js no GitHub](https://github.com/immutable-js/immutable-js)
- [Performance de estruturas imutáveis em JS](https://medium.com/@dtinth/immutable-js-persistent-data-structures-and-structural-sharing-6d163fbd73d2)
- [Usando Immutable.js com React e Redux](https://redux.js.org/style-guide/style-guide#use-immutable-data-structures)

---

