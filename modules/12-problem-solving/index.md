---
layout: module
title: "Problem Solving Techniques"
module_id: 12-problem-solving
description: "Módulo 12-problem-solving do curso de Estrutura de Dados e Algoritmos"
---

# Problem Solving Techniques

## 📖 Sobre este Módulo

Este módulo aborda os conceitos fundamentais de **Problem Solving Techniques**.

## 📚 Conteúdo

### Aulas
{% assign lessons = site.pages | where: "module_id", "12-problem-solving" | where: "content_type", "lesson" %}
{% for lesson in lessons %}
- [{{ lesson.title }}]({{ lesson.url | relative_url }})
{% endfor %}

### Exercícios
{% assign exercises = site.pages | where: "module_id", "12-problem-solving" | where: "content_type", "exercise" %}
{% for exercise in exercises %}
- [{{ exercise.title }}]({{ exercise.url | relative_url }})
{% endfor %}

### Exemplos
{% assign examples = site.pages | where: "module_id", "12-problem-solving" | where: "content_type", "example" %}
{% for example in examples %}
- [{{ example.title }}]({{ example.url | relative_url }})
{% endfor %}

## 🎧 Recursos de Áudio

Os áudios deste módulo estão disponíveis em: `assets/audio/12-problem-solving/`

---

[← Voltar ao Curso]({{ site.baseurl }}/) | [Próximo Módulo →]()
