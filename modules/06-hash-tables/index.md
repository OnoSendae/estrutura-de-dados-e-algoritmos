---
layout: module
title: "Hash Tables & Hash Functions"
module_id: 06-hash-tables
description: "Módulo 06-hash-tables do curso de Estrutura de Dados e Algoritmos"
---

# Hash Tables & Hash Functions

## 📖 Sobre este Módulo

Este módulo aborda os conceitos fundamentais de **Hash Tables & Hash Functions**.

## 📚 Conteúdo

### Aulas
{% assign lessons = site.pages | where: "module_id", "06-hash-tables" | where: "content_type", "lesson" %}
{% for lesson in lessons %}
- [{{ lesson.title }}]({{ lesson.url | relative_url }})
{% endfor %}

### Exercícios
{% assign exercises = site.pages | where: "module_id", "06-hash-tables" | where: "content_type", "exercise" %}
{% for exercise in exercises %}
- [{{ exercise.title }}]({{ exercise.url | relative_url }})
{% endfor %}

### Exemplos
{% assign examples = site.pages | where: "module_id", "06-hash-tables" | where: "content_type", "example" %}
{% for example in examples %}
- [{{ example.title }}]({{ example.url | relative_url }})
{% endfor %}

## 🎧 Recursos de Áudio

Os áudios deste módulo estão disponíveis em: `assets/audio/06-hash-tables/`

---

[← Voltar ao Curso]({{ site.baseurl }}/) | [Próximo Módulo →]()
