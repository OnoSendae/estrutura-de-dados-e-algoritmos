---
layout: module
title: "Trees and Graphs"
module_id: 04-trees-graphs
description: "Módulo 04-trees-graphs do curso de Estrutura de Dados e Algoritmos"
---

# Trees and Graphs

## 📖 Sobre este Módulo

Este módulo aborda os conceitos fundamentais de **Trees and Graphs**.

## 📚 Conteúdo

### Aulas
{% assign lessons = site.pages | where: "module_id", "04-trees-graphs" | where: "content_type", "lesson" %}
{% for lesson in lessons %}
- [{{ lesson.title }}]({{ lesson.url | relative_url }})
{% endfor %}

### Exercícios
{% assign exercises = site.pages | where: "module_id", "04-trees-graphs" | where: "content_type", "exercise" %}
{% for exercise in exercises %}
- [{{ exercise.title }}]({{ exercise.url | relative_url }})
{% endfor %}

### Exemplos
{% assign examples = site.pages | where: "module_id", "04-trees-graphs" | where: "content_type", "example" %}
{% for example in examples %}
- [{{ example.title }}]({{ example.url | relative_url }})
{% endfor %}

## 🎧 Recursos de Áudio

Os áudios deste módulo estão disponíveis em: `assets/audio/04-trees-graphs/`

---

[← Voltar ao Curso]({{ site.baseurl }}/) | [Próximo Módulo →]()
