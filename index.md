---
layout: default
title: "Estrutura de Dados e Algoritmos"
description: "Curso completo de estruturas de dados e algoritmos com exemplos práticos"
---

# Estrutura de Dados e Algoritmos

Bem-vindo ao curso completo de **Estrutura de Dados e Algoritmos**! 

## 📚 Sobre o Curso

Este curso oferece uma abordagem completa e prática para o aprendizado de estruturas de dados e algoritmos, com foco em implementações reais e aplicações práticas.

## 🎯 Módulos do Curso

{% for module in site.data.new_course_structure.modules %}
<div class="module-card">
  <h3><a href="{{ module.path | relative_url }}">{{ module.id | upcase }}: {{ module.title }}</a></h3>
  <div class="module-links">
    <a href="{{ module.lessons_path | relative_url }}" class="btn btn-primary">Aulas</a>
    <a href="{{ module.exercises_path | relative_url }}" class="btn btn-secondary">Exercícios</a>
    <a href="{{ module.examples_path | relative_url }}" class="btn btn-info">Exemplos</a>
  </div>
</div>
{% endfor %}

## 🚀 Como Usar

1. **Navegue pelos módulos** na ordem sugerida
2. **Assista as aulas** com áudio explicativo
3. **Pratique com exercícios** de diferentes níveis
4. **Estude os exemplos** de código fornecidos
5. **Use os recursos** adicionais para aprofundar

## 📖 Recursos Adicionais

- [Documentação do Curso](docs/)
- [Exemplos de Código](examples/)
- [Exercícios Práticos](exercises/)

---

*Curso criado e mantido como projeto open source.*
