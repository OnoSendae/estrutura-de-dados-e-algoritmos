---
layout: module
title: "Algorithm Analysis & Complexity"
module_id: 02-complexity-analysis
description: "Módulo 02-complexity-analysis do curso de Estrutura de Dados e Algoritmos"
---

# Algorithm Analysis & Complexity

## 📖 Sobre este Módulo

Este módulo aborda os conceitos fundamentais de **Algorithm Analysis & Complexity**.

## 📚 Conteúdo

### Aulas
{% assign lessons = site.pages | where: "module_id", "02-complexity-analysis" | where: "content_type", "lesson" %}
{% for lesson in lessons %}
- [{{ lesson.title }}]({{ lesson.url | relative_url }})
{% endfor %}

### Exercícios
{% assign exercises = site.pages | where: "module_id", "02-complexity-analysis" | where: "content_type", "exercise" %}
{% for exercise in exercises %}
- [{{ exercise.title }}]({{ exercise.url | relative_url }})
{% endfor %}

### Exemplos
{% assign examples = site.pages | where: "module_id", "02-complexity-analysis" | where: "content_type", "example" %}
{% for example in examples %}
- [{{ example.title }}]({{ example.url | relative_url }})
{% endfor %}

## 🎧 Recursos de Áudio

Os áudios deste módulo estão disponíveis em: `assets/audio/02-complexity-analysis/`

---

[← Voltar ao Curso]({{ site.baseurl }}/) | [Próximo Módulo →]()
