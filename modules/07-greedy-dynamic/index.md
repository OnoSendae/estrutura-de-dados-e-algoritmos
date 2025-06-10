---
layout: module
title: "Greedy Algorithms & Dynamic Programming"
module_id: 07-greedy-dynamic
description: "Módulo 07-greedy-dynamic do curso de Estrutura de Dados e Algoritmos"
---

# Greedy Algorithms & Dynamic Programming

## 📖 Sobre este Módulo

Este módulo aborda os conceitos fundamentais de **Greedy Algorithms & Dynamic Programming**.

## 📚 Conteúdo

### Aulas
{% assign lessons = site.pages | where: "module_id", "07-greedy-dynamic" | where: "content_type", "lesson" %}
{% for lesson in lessons %}
- [{{ lesson.title }}]({{ lesson.url | relative_url }})
{% endfor %}

### Exercícios
{% assign exercises = site.pages | where: "module_id", "07-greedy-dynamic" | where: "content_type", "exercise" %}
{% for exercise in exercises %}
- [{{ exercise.title }}]({{ exercise.url | relative_url }})
{% endfor %}

### Exemplos
{% assign examples = site.pages | where: "module_id", "07-greedy-dynamic" | where: "content_type", "example" %}
{% for example in examples %}
- [{{ example.title }}]({{ example.url | relative_url }})
{% endfor %}

## 🎧 Recursos de Áudio

Os áudios deste módulo estão disponíveis em: `assets/audio/07-greedy-dynamic/`

---

[← Voltar ao Curso]({{ site.baseurl }}/) | [Próximo Módulo →]()
