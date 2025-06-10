---
layout: module
title: "Programming Foundations"
module_id: 01-foundations
description: "Módulo 01-foundations do curso de Estrutura de Dados e Algoritmos"
---

# Programming Foundations

## 📖 Sobre este Módulo

Este módulo aborda os conceitos fundamentais de **Programming Foundations**.

## 📚 Conteúdo

### Aulas
{% assign lessons = site.pages | where: "module_id", "01-foundations" | where: "content_type", "lesson" %}
{% for lesson in lessons %}
- [{{ lesson.title }}]({{ lesson.url | relative_url }})
{% endfor %}

### Exercícios
{% assign exercises = site.pages | where: "module_id", "01-foundations" | where: "content_type", "exercise" %}
{% for exercise in exercises %}
- [{{ exercise.title }}]({{ exercise.url | relative_url }})
{% endfor %}

### Exemplos
{% assign examples = site.pages | where: "module_id", "01-foundations" | where: "content_type", "example" %}
{% for example in examples %}
- [{{ example.title }}]({{ example.url | relative_url }})
{% endfor %}

## 🎧 Recursos de Áudio

Os áudios deste módulo estão disponíveis em: `assets/audio/01-foundations/`

---

[← Voltar ao Curso]({{ site.baseurl }}/) | [Próximo Módulo →]()
