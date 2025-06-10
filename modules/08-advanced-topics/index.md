---
layout: module
title: "Advanced Topics & Applications"
module_id: 08-advanced-topics
description: "Módulo 08-advanced-topics do curso de Estrutura de Dados e Algoritmos"
---

# Advanced Topics & Applications

## 📖 Sobre este Módulo

Este módulo aborda os conceitos fundamentais de **Advanced Topics & Applications**.

## 📚 Conteúdo

### Aulas
{% assign lessons = site.pages | where: "module_id", "08-advanced-topics" | where: "content_type", "lesson" %}
{% for lesson in lessons %}
- [{{ lesson.title }}]({{ lesson.url | relative_url }})
{% endfor %}

### Exercícios
{% assign exercises = site.pages | where: "module_id", "08-advanced-topics" | where: "content_type", "exercise" %}
{% for exercise in exercises %}
- [{{ exercise.title }}]({{ exercise.url | relative_url }})
{% endfor %}

### Exemplos
{% assign examples = site.pages | where: "module_id", "08-advanced-topics" | where: "content_type", "example" %}
{% for example in examples %}
- [{{ example.title }}]({{ example.url | relative_url }})
{% endfor %}

## 🎧 Recursos de Áudio

Os áudios deste módulo estão disponíveis em: `assets/audio/08-advanced-topics/`

---

[← Voltar ao Curso]({{ site.baseurl }}/) | [Próximo Módulo →]()
