# Algoritmos e Estrutura de Dados na Prática

## Módulo 7: Tópicos Avançados e Aplicações

### 4. Algoritmos de Geometria Computacional: Envoltória Convexa

A geometria computacional é uma área fascinante que combina conceitos matemáticos de geometria com técnicas algorítmicas para resolver problemas espaciais. Nesta aula, focaremos em um dos problemas fundamentais da geometria computacional: a determinação da **Envoltória Convexa** (Convex Hull) de um conjunto de pontos.

#### Conexão com Algoritmos Anteriores

Os algoritmos de envoltória convexa aplicam diversos paradigmas que já estudamos:
- O algoritmo QuickHull utiliza o paradigma **dividir e conquistar** (similar ao QuickSort do Módulo 4)
- O Graham Scan implementa uma estratégia semelhante a **algoritmos gulosos** (Módulo 6)
- O Jarvis March usa uma abordagem incremental similar à construção de **árvores geradoras mínimas** (Módulo 3)

#### Analogia: Elástico em Torno de Pinos 📌

Imagine um quadro com pinos (pontos) espalhados e um elástico ao redor. Quando você solta o elástico, ele se contrai e envolve apenas os pinos mais externos, formando uma forma convexa. Os pinos tocados pelo elástico formam a "envoltória convexa" do conjunto.

Esta analogia ilustra perfeitamente o conceito: a envoltória convexa é o menor polígono convexo que contém todos os pontos do conjunto.

### Conceitos Fundamentais da Geometria Computacional

Antes de mergulharmos nos algoritmos de envoltória convexa, vamos revisar alguns conceitos importantes:

#### 1. Polígono Convexo vs. Não-Convexo

- **Polígono Convexo**: Para quaisquer dois pontos dentro do polígono, o segmento de linha que os conecta está inteiramente contido no polígono.
- **Polígono Não-Convexo**: Existem pares de pontos dentro do polígono para os quais o segmento de linha que os conecta passa fora do polígono.

#### 2. Orientação de Três Pontos

A orientação de três pontos (p, q, r) pode ser:
- **Horária (Clockwise - CW)**: Os pontos formam uma curva à direita
- **Anti-horária (Counterclockwise - CCW)**: Os pontos formam uma curva à esquerda
- **Colinear**: Os pontos estão em linha reta

Podemos determinar a orientação matematicamente usando o produto vetorial:
- Se (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x) > 0: CCW
- Se < 0: CW
- Se = 0: Colinear

Esta função de orientação será crucial para nossos algoritmos.

### Envoltória Convexa: Definição e Propriedades

A envoltória convexa de um conjunto de pontos P é o menor polígono convexo que contém todos os pontos de P. Algumas propriedades importantes:

1. Todos os vértices da envoltória convexa são pontos do conjunto original
2. A envoltória convexa é única para um dado conjunto de pontos
3. Os pontos internos (não na envoltória) não afetam a forma final

#### Visualização de uma Envoltória Convexa

Para um conjunto de pontos como: (1,1), (2,5), (4,2), (5,6), (7,3), (3,8), (6,1)

```
    |
8   |      *
    |
7   |
    |
6   |    *
    |
5   |  *
    |
4   |
    |
3   |        *
    |
2   |     *
    |
1   |*        *
    |
    +------------------
       1 2 3 4 5 6 7

Envoltória convexa: (1,1) → (6,1) → (7,3) → (5,6) → (3,8) → (2,5) → (1,1)
```

O polígono formado pelos pontos externos é a envoltória convexa.

### Algoritmos para Encontrar a Envoltória Convexa

Existem vários algoritmos para determinar a envoltória convexa. Vamos explorar três dos mais populares:

#### 1. Algoritmo de Jarvis March (Gift Wrapping)

Este algoritmo simula a ação de "embrulhar" os pontos, como se estivéssemos embrulhando um presente:

1. Encontre o ponto mais à esquerda (menor coordenada x)
2. Começando deste ponto, selecione iterativamente o próximo ponto que resulta na orientação mais à esquerda (CCW)
3. Continue até voltar ao ponto inicial

**Complexidade**: O(nh), onde n é o número de pontos e h é o número de pontos na envoltória.

#### 2. Algoritmo de Graham Scan

Um dos algoritmos mais eficientes e populares:

1. Encontre o ponto mais baixo (menor coordenada y, desempate pelo menor x)
2. Ordene os pontos restantes pelo ângulo polar (ou usando orientação CCW) em relação ao ponto encontrado
3. Percorra os pontos ordenados, mantendo uma pilha dos pontos da envoltória:
   - Se o próximo ponto forma uma curva à direita com os dois últimos pontos da pilha, remova o último ponto da pilha
   - Caso contrário, adicione o próximo ponto à pilha

**Complexidade**: O(n log n), principalmente devido à ordenação.

#### 3. Algoritmo Quickhull

Uma abordagem dividir-e-conquistar:

1. Encontre os pontos com coordenadas x mínima e máxima, eles pertencem à envoltória
2. Use a linha formada por esses dois pontos para dividir o conjunto em dois subconjuntos
3. Para cada subconjunto, encontre o ponto mais distante da linha
4. Recursivamente, processe os subconjuntos formados pelas novas linhas

**Complexidade**: Caso médio O(n log n), pior caso O(n²).

### Implementação do Algoritmo de Graham Scan

Vamos implementar o Graham Scan em JavaScript, um dos algoritmos mais eficientes para encontrar a envoltória convexa:

```javascript
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    
    // Distância ao quadrado entre dois pontos
    static distanceSquared(p1, p2) {
        return (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;
    }
    
    // Determina a orientação de três pontos
    // Retorna:
    // 0 -> Colinear
    // 1 -> Sentido horário (CW)
    // 2 -> Sentido anti-horário (CCW)
    static orientation(p1, p2, p3) {
        const val = (p2.y - p1.y) * (p3.x - p2.x) - (p2.x - p1.x) * (p3.y - p2.y);
        
        if (val === 0) return 0;  // Colinear
        return (val > 0) ? 1 : 2; // Horário ou Anti-horário
    }
    
    // Para ordenar pontos pelo ângulo polar
    static polarAngleComparator(p0) {
        return (p1, p2) => {
            const orientation = Point.orientation(p0, p1, p2);
            if (orientation === 0) {
                // Se colineares, o mais próximo vem primeiro
                return Point.distanceSquared(p0, p1) - Point.distanceSquared(p0, p2);
            }
            
            return orientation === 2 ? -1 : 1;
        };
    }
}

class ConvexHull {
    // Algoritmo Graham Scan para encontrar a envoltória convexa
    static grahamScan(points) {
        const n = points.length;
        
        // Precisamos de pelo menos 3 pontos para formar um polígono
        if (n < 3) return points;
        
        // Encontrar o ponto mais baixo (menor y, desempate pelo menor x)
        let lowest = 0;
        for (let i = 1; i < n; i++) {
            if (points[i].y < points[lowest].y || 
                (points[i].y === points[lowest].y && points[i].x < points[lowest].x)) {
                lowest = i;
            }
        }
        
        // Colocar o ponto mais baixo na primeira posição
        [points[0], points[lowest]] = [points[lowest], points[0]];
        const p0 = points[0];
        
        // Ordenar os pontos restantes pelo ângulo polar em relação ao ponto mais baixo
        points.sort(Point.polarAngleComparator(p0));
        
        // Remover pontos colineares, mantendo apenas o mais distante
        let m = 1;  // Tamanho da lista de pontos após remover colineares
        for (let i = 1; i < n; i++) {
            // Enquanto tivermos pontos e o atual for colinear com o último mantido
            while (i < n - 1 && Point.orientation(p0, points[i], points[i + 1]) === 0) {
                i++;
            }
            
            points[m] = points[i];
            m++;
        }
        
        // Se temos menos de 3 pontos, não podemos formar um polígono
        if (m < 3) return points.slice(0, m);
        
        // Inicializar a pilha com os primeiros três pontos
        const hull = [points[0], points[1], points[2]];
        
        // Processar os pontos restantes
        for (let i = 3; i < m; i++) {
            // Remover pontos que não formam uma curva à esquerda
            while (hull.length > 1 && 
                   Point.orientation(hull[hull.length - 2], hull[hull.length - 1], points[i]) !== 2) {
                hull.pop();
            }
            
            hull.push(points[i]);
        }
        
        return hull;
    }
    
    // Algoritmo de Jarvis March (Gift Wrapping)
    static jarvisMarch(points) {
        const n = points.length;
        
        // Precisamos de pelo menos 3 pontos para formar um polígono
        if (n < 3) return points;
        
        // Inicializar array para armazenar pontos da envoltória
        const hull = [];
        
        // Encontrar o ponto mais à esquerda
        let leftmost = 0;
        for (let i = 1; i < n; i++) {
            if (points[i].x < points[leftmost].x) {
                leftmost = i;
            }
        }
        
        // Iniciar do ponto mais à esquerda e percorrer no sentido anti-horário
        let p = leftmost, q;
        do {
            // Adicionar o ponto atual à envoltória
            hull.push(points[p]);
            
            // Procurar o próximo ponto q tal que para qualquer outro ponto r,
            // a orientação(p, q, r) é no sentido horário
            q = (p + 1) % n;
            for (let r = 0; r < n; r++) {
                if (Point.orientation(points[p], points[q], points[r]) === 2) {
                    q = r;
                }
            }
            
            // Agora q é o próximo ponto da envoltória
            p = q;
            
        } while (p !== leftmost);  // Continuar até voltar ao primeiro ponto
        
        return hull;
    }
    
    // Implementação básica do QuickHull
    static quickHull(points) {
        const n = points.length;
        
        // Precisamos de pelo menos 3 pontos para formar um polígono
        if (n < 3) return points;
        
        // Inicializar array para armazenar pontos da envoltória
        const hull = new Set();
        
        // Encontrar pontos com x mínimo e máximo
        let minX = 0, maxX = 0;
        for (let i = 1; i < n; i++) {
            if (points[i].x < points[minX].x) minX = i;
            if (points[i].x > points[maxX].x) maxX = i;
        }
        
        // Adicionar os pontos extremos à envoltória
        hull.add(points[minX]);
        hull.add(points[maxX]);
        
        // Dividir os pontos em dois lados da linha formada por minX e maxX
        const leftSide = [];
        const rightSide = [];
        
        for (let i = 0; i < n; i++) {
            const orientation = Point.orientation(points[minX], points[maxX], points[i]);
            
            // Pular pontos na linha
            if (orientation === 0) continue;
            
            // Adicionar ao lado apropriado
            if (orientation === 2) {
                leftSide.push(points[i]);
            } else {
                rightSide.push(points[i]);
            }
        }
        
        // Recursivamente encontrar pontos da envoltória em cada lado
        this._findHull(leftSide, points[minX], points[maxX], hull);
        this._findHull(rightSide, points[maxX], points[minX], hull);
        
        return Array.from(hull);
    }
    
    // Função auxiliar para QuickHull
    static _findHull(points, p1, p2, hull) {
        const n = points.length;
        
        if (n === 0) return;
        
        // Encontrar o ponto mais distante da linha formada por p1 e p2
        let maxDist = 0;
        let maxIdx = -1;
        
        for (let i = 0; i < n; i++) {
            const dist = this._distanceFromLine(points[i], p1, p2);
            if (dist > maxDist) {
                maxDist = dist;
                maxIdx = i;
            }
        }
        
        // Se não encontrarmos nenhum ponto, retornar
        if (maxIdx === -1) return;
        
        const maxPoint = points[maxIdx];
        hull.add(maxPoint);
        
        // Dividir os pontos em dois conjuntos pelas novas linhas
        const side1 = [];
        const side2 = [];
        
        for (let i = 0; i < n; i++) {
            // Pular o ponto máximo já adicionado à envoltória
            if (i === maxIdx) continue;
            
            const orientation1 = Point.orientation(p1, maxPoint, points[i]);
            const orientation2 = Point.orientation(maxPoint, p2, points[i]);
            
            // Pontos externos à área triangular
            if (orientation1 === 2) {
                side1.push(points[i]);
            }
            else if (orientation2 === 2) {
                side2.push(points[i]);
            }
        }
        
        // Recursivamente processar os dois novos conjuntos
        this._findHull(side1, p1, maxPoint, hull);
        this._findHull(side2, maxPoint, p2, hull);
    }
    
    // Calcular distância de um ponto a uma linha
    static _distanceFromLine(p, a, b) {
        const area = Math.abs((a.x * (b.y - p.y) + b.x * (p.y - a.y) + p.x * (a.y - b.y)) / 2);
        const base = Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
        return (2 * area) / base;
    }
}

// Exemplo de uso
function generateRandomPoints(n = 20, maxCoord = 100) {
    const points = [];
    for (let i = 0; i < n; i++) {
        const x = Math.floor(Math.random() * maxCoord);
        const y = Math.floor(Math.random() * maxCoord);
        points.push(new Point(x, y));
    }
    return points;
}

// Gerar pontos aleatórios
const points = generateRandomPoints(30);

console.log("Pontos originais:");
points.forEach(p => console.log(`(${p.x}, ${p.y})`));

// Comparar os três algoritmos
console.time("Graham Scan");
const grahamHull = ConvexHull.grahamScan([...points]);
console.timeEnd("Graham Scan");

console.time("Jarvis March");
const jarvisHull = ConvexHull.jarvisMarch([...points]);
console.timeEnd("Jarvis March");

console.time("QuickHull");
const quickHull = ConvexHull.quickHull([...points]);
console.timeEnd("QuickHull");

console.log("\nEnvoltória Convexa (Graham Scan):");
grahamHull.forEach(p => console.log(`(${p.x}, ${p.y})`));
console.log(`Total de pontos na envoltória: ${grahamHull.length}`);
```

### Aplicações Práticas da Envoltória Convexa

A envoltória convexa tem inúmeras aplicações em diversos campos:

1. **Computação Gráfica**:
   - Detecção de colisão entre objetos
   - Cálculo de sombras e iluminação
   - Simplificação de formas complexas

2. **Processamento de Imagem**:
   - Reconhecimento de formas
   - Segmentação de imagens
   - Análise de padrões

3. **Robótica**:
   - Planejamento de trajetória
   - Mapeamento de ambientes
   - Detecção de obstáculos

4. **Geomática**:
   - Análise de dados geoespaciais
   - Detecção de agrupamentos em mapas
   - Delimitação de áreas urbanas

5. **Outros campos**:
   - Análise estatística de dados
   - Reconhecimento de padrões
   - Otimização de embalagens

### Análise Comparativa dos Algoritmos

| Algoritmo     | Complexidade Temporal | Quando Usar |
|---------------|----------------------|-------------|
| Jarvis March  | O(nh)                | Conjuntos pequenos ou quando h << n |
| Graham Scan   | O(n log n)           | Caso geral, conjunto médio a grande |
| QuickHull     | O(n log n) em média, O(n²) no pior caso | Bom para conjuntos com muitos pontos internos |

Onde:
- n: número total de pontos
- h: número de pontos na envoltória convexa

### Outros Algoritmos de Geometria Computacional

Além da envoltória convexa, existem outros algoritmos importantes em geometria computacional:

1. **Par de Pontos Mais Próximos**: Encontrar o par de pontos com a menor distância entre si

2. **Diagrama de Voronoi**: Dividir o plano em regiões baseadas na proximidade a pontos específicos

3. **Triangulação de Delaunay**: Maximizar o menor ângulo de todos os triângulos

4. **Problema do Círculo Mínimo**: Encontrar o menor círculo que contém todos os pontos

5. **Interseção de Segmentos de Linha**: Detectar eficientemente interseções entre múltiplos segmentos

### Exercícios Propostos

1. **Implementação Comparativa**: Implemente os três algoritmos de envoltória convexa apresentados e compare seus desempenhos para diferentes conjuntos de pontos.

2. **Visualização Interativa**: Crie uma visualização que mostre as etapas incrementais de um algoritmo de envoltória convexa (por exemplo, Graham Scan).

3. **Otimização**: Modifique o algoritmo Graham Scan para lidar eficientemente com pontos colineares.

4. **Aplicação Prática**: Implemente um detector de colisão entre polígonos convexos usando suas envoltórias.

5. **Extensão 3D**: Pesquise e implemente um algoritmo para encontrar a envoltória convexa em 3D.

### Conclusão

Os algoritmos de envoltória convexa são fundamentais em geometria computacional e têm aplicações práticas em diversos campos. O entendimento destes algoritmos não só fornece ferramentas para resolver problemas específicos, mas também desenvolve o raciocínio geométrico e algorítmico.

Na próxima aula, exploraremos exercícios práticos que integram todos os tópicos avançados que discutimos até agora, permitindo consolidar os conhecimentos adquiridos e aplicá-los em cenários próximos aos encontrados no mundo real. 