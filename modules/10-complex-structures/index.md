---
layout: module
title: "Complex Data Structures"
module_id: 10-complex-structures
description: "Módulo 10-complex-structures do curso de Estrutura de Dados e Algoritmos"
---

# Complex Data Structures

## 📖 Sobre este Módulo

Este módulo aborda os conceitos fundamentais de **Complex Data Structures**.

## 📚 Conteúdo

### Aulas
{% assign lessons = site.pages | where: "module_id", "10-complex-structures" | where: "content_type", "lesson" %}
{% for lesson in lessons %}
- [{{ lesson.title }}]({{ lesson.url | relative_url }})
{% endfor %}

### Exercícios
{% assign exercises = site.pages | where: "module_id", "10-complex-structures" | where: "content_type", "exercise" %}
{% for exercise in exercises %}
- [{{ exercise.title }}]({{ exercise.url | relative_url }})
{% endfor %}

### Exemplos
{% assign examples = site.pages | where: "module_id", "10-complex-structures" | where: "content_type", "example" %}
{% for example in examples %}
- [{{ example.title }}]({{ example.url | relative_url }})
{% endfor %}

## 🎧 Recursos de Áudio

Os áudios deste módulo estão disponíveis em: `assets/audio/10-complex-structures/`

---

[← Voltar ao Curso]({{ site.baseurl }}/) | [Próximo Módulo →]()
