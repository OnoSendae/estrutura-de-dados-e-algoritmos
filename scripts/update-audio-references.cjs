#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Mapeamento entre pastas src/modulos-treinamento e assets/audio
const MODULE_MAPPING = {
    '0-fundamentos-da-programacao': '01-foundations',
    '1-analise-de-algoritmos-e-complexidade': '02-complexity-analysis',
    '2-estruturas-de-dados-lineares-avancadas': '03-linear-structures',
    '3-arvores-e-grafos': '04-trees-graphs',
    '4-algoritmos-de-ordenacao-e-busca-avancados': '05-sorting-searching',
    '5-tabelas-hash-e-funcoes-hash': '06-hash-tables',
    '6-algoritmos-gulosos-e-programacao-dinamica': '07-greedy-dynamic',
    '7-topicos-avancados-e-aplicacoes': '08-advanced-topics',
    '8-estruturas-de-dados-persistentes': '09-persistent-structures',
    '9-estruturas-de-dados-complexas': '10-complex-structures',
    '10-indexacao': '11-indexing',
    '11-tecnicas-de-resolucao-de-problemas': '12-problem-solving'
};

function updateReferences() {
    console.log('🔄 Atualizando referências de áudio...');

    // Função para atualizar arquivo
    function updateFile(filePath) {
        if (!fs.existsSync(filePath)) return;

        let content = fs.readFileSync(filePath, 'utf8');
        let updated = false;

        // Atualizar referências para cada módulo
        Object.entries(MODULE_MAPPING).forEach(([oldModule, newModule]) => {
            const oldPattern = new RegExp(`src/modulos-treinamento/${oldModule}/([^)]+\\.(mp3|wav))`, 'g');
            const newPath = `assets/audio/${newModule}/$1`;

            if (content.match(oldPattern)) {
                content = content.replace(oldPattern, newPath);
                updated = true;
            }
        });

        if (updated) {
            fs.writeFileSync(filePath, content);
            console.log(`✅ Atualizado: ${filePath}`);
        }
    }

    // Função para percorrer diretórios
    function walkDirectory(dir, extensions = ['.md', '.html', '.yml', '.js']) {
        const items = fs.readdirSync(dir);

        items.forEach(item => {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
                walkDirectory(fullPath, extensions);
            } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
                updateFile(fullPath);
            }
        });
    }

    // Executar atualização
    walkDirectory('.');

    console.log('🎉 Referências atualizadas com sucesso!');
}

// Executar se chamado diretamente
if (require.main === module) {
    updateReferences();
}

module.exports = { updateReferences, MODULE_MAPPING }; 