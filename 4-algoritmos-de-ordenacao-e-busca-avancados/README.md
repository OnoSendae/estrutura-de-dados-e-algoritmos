# Módulo 4: Algoritmos de Ordenação Avançados e Busca em Texto

## 📚 Visão Geral do Módulo

Este módulo foca em algoritmos avançados de ordenação e busca em texto, aprofundando os conceitos do Módulo 3 e introduzindo técnicas mais eficientes e especializadas.

![Mapa de Aprendizado](https://via.placeholder.com/800x400?text=Mapa+de+Aprendizado+Modulo+4)

## 🗺️ Jornada de Aprendizado

1. **Algoritmos de Ordenação Avançados**
   - Merge Sort e suas otimizações
   - Quick Sort e implementações adaptativas
   - Heap Sort e aplicações em filas de prioridade
   - Algoritmos de ordenação em casos especiais (Radix e Bucket Sort)

2. **Algoritmos de Busca em Texto**
   - Algoritmo de busca ingênuo e suas limitações
   - Algoritmo de Knuth-Morris-Pratt (KMP)
   - Algoritmo de Boyer-Moore
   - Comparação e casos de uso

3. **Aplicações Práticas e Otimizações**
   - Ordenação de grandes conjuntos de dados
   - Técnicas de otimização para diferentes tipos de dados
   - Implementações em casos reais
   - Análise de performance

## 📑 Conteúdo do Módulo

### [0. Introdução e Visão Geral](0-introducao-visao-geral.md)
Apresentação do módulo, mapa de aprendizado e conexões com os módulos anteriores.

### [1. Merge Sort e Quick Sort: Otimizações](1-merge-sort-quick-sort-otimizacoes.md)
Aprofundamento no funcionamento destes algoritmos com foco em otimizações práticas.

### [2. Heap Sort e suas Aplicações](2-heap-sort-aplicacoes.md)
Estudo do Heap Sort e sua relação com a estrutura de dados Heap e filas de prioridade.

### [3. Radix Sort e Bucket Sort](3-radix-bucket-sort.md)
Algoritmos de ordenação não-comparativos para casos especiais com alta eficiência.

### [4. Algoritmos de Busca em Texto: KMP e Boyer-Moore](4-busca-texto-kmp-boyer-moore.md)
Técnicas avançadas para busca de padrões em texto, superando as limitações da busca ingênua.

### [5. Exercícios Práticos](5-exercicios-praticos.md)
Conjunto de exercícios para aplicação dos conceitos aprendidos, com diferentes níveis de dificuldade.

### [6. Case Study: Benchmark de Sistemas](6-case-study-benchmark-sistema.md)
Estudo de caso aplicando os algoritmos em um cenário real de benchmark de sistemas.

## 🧰 Recursos Adicionais

### [Visualizações](exercicios-extras/visualizacoes.md)
Diagramas e visualizações ASCII do funcionamento interno dos algoritmos.

### [Exercícios Extras](exercicios-extras/README.md)
Exercícios complementares organizados por nível de dificuldade.

### [Soluções](exercicios-extras/solucoes)
Implementações detalhadas das soluções para os exercícios práticos.

## 📊 Tabelas Comparativas

### Complexidade de Algoritmos de Ordenação

| Algoritmo    | Melhor Caso | Caso Médio    | Pior Caso     | Estável | In-Place | Observações                               |
|--------------|-------------|---------------|---------------|---------|----------|-------------------------------------------|
| Merge Sort   | O(n log n)  | O(n log n)    | O(n log n)    | Sim     | Não      | Usa O(n) espaço adicional                 |
| Quick Sort   | O(n log n)  | O(n log n)    | O(n²)         | Não     | Sim      | Muito eficiente na prática                |
| Heap Sort    | O(n log n)  | O(n log n)    | O(n log n)    | Não     | Sim      | Útil para top K elementos                 |
| Radix Sort   | O(nk)       | O(nk)         | O(nk)         | Sim     | Não      | k = número máximo de dígitos              |
| Bucket Sort  | O(n+k)      | O(n+k)        | O(n²)         | Sim     | Não      | k = número de buckets                     |

### Complexidade de Algoritmos de Busca em Texto

| Algoritmo    | Pré-processamento | Busca        | Espaço Adicional | Melhor para                                |
|--------------|-------------------|--------------|------------------|-------------------------------------------|
| Ingênuo      | Nenhum           | O((n-m+1)m)  | O(1)             | Padrões curtos ou busca única             |
| KMP          | O(m)             | O(n)         | O(m)             | Busca múltipla do mesmo padrão            |
| Boyer-Moore  | O(m+σ)           | O(n/m) a O(nm)| O(m+σ)          | Alfabetos grandes, padrões longos         |

*Onde n = tamanho do texto, m = tamanho do padrão, σ = tamanho do alfabeto*

## 🔄 Conexões com Outros Módulos

- **Módulo 3**: Estende os algoritmos de ordenação básicos com técnicas mais sofisticadas
- **Módulo 5**: Prepara para o estudo de algoritmos de compressão e indexação
- **Módulo 6**: Fornece base para algoritmos em grafos e busca de caminhos

## 👨‍💻 Prepare-se para o Próximo Módulo

No Módulo 5, aplicaremos os conhecimentos adquiridos para desenvolver técnicas de compressão de dados e introduzir conceitos de criptografia algorítmica. Tenha em mente:

- Compreensão sólida dos algoritmos de busca em texto será fundamental
- Familiaridade com complexidade de tempo e espaço será aplicada em novos contextos
- As técnicas de otimização estudadas neste módulo serão estendidas 