---
layout: module
title: "Advanced Sorting & Searching Algorithms"
module_id: 05-sorting-searching
description: "Módulo 05-sorting-searching do curso de Estrutura de Dados e Algoritmos"
---

# Advanced Sorting & Searching Algorithms

## 📖 Sobre este Módulo

Este módulo aborda os conceitos fundamentais de **Advanced Sorting & Searching Algorithms**.

## 📚 Conteúdo

### Aulas
{% assign lessons = site.pages | where: "module_id", "05-sorting-searching" | where: "content_type", "lesson" %}
{% for lesson in lessons %}
- [{{ lesson.title }}]({{ lesson.url | relative_url }})
{% endfor %}

### Exercícios
{% assign exercises = site.pages | where: "module_id", "05-sorting-searching" | where: "content_type", "exercise" %}
{% for exercise in exercises %}
- [{{ exercise.title }}]({{ exercise.url | relative_url }})
{% endfor %}

### Exemplos
{% assign examples = site.pages | where: "module_id", "05-sorting-searching" | where: "content_type", "example" %}
{% for example in examples %}
- [{{ example.title }}]({{ example.url | relative_url }})
{% endfor %}

## 🎧 Recursos de Áudio

Os áudios deste módulo estão disponíveis em: `assets/audio/05-sorting-searching/`

---

[← Voltar ao Curso]({{ site.baseurl }}/) | [Próximo Módulo →]()
