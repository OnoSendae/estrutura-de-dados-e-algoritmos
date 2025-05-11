import { readdirSync, statSync, writeFileSync, readFileSync, mkdirSync, existsSync } from 'fs';
import { join, basename, extname, dirname, relative } from 'path';
import { dump } from 'js-yaml'; // Corrected import for js-yaml

// Helper: Ensure __dirname is available in ES Modules
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectBasePath = dirname(__dirname); // Goes up one level from scripts/ to project root

const modulesPath = join(projectBasePath, 'src', 'modulos-treinamento');
const dataPath = join(projectBasePath, '_data');
const outputPath = join(dataPath, 'course_structure.yml');

// Mapa para restaurar caracteres especiais
const specialCharMap = {
    'Programacao': 'Programação',
    'Analise': 'Análise',
    'Avancadas': 'Avançadas',
    'Avancados': 'Avançados',
    'Ordenacao': 'Ordenação',
    'Funcoes': 'Funções',
    'Introducao': 'Introdução',
    'Visao': 'Visão',
    'Modulo': 'Módulo',
    'Notacao': 'Notação',
    'Espaco': 'Espaço',
    'Medios': 'Médios',
    'Exercicios': 'Exercícios',
    'Praticos': 'Práticos',
    'Reflexao': 'Reflexão',
    'Proximos': 'Próximos',
    'Arvores': 'Árvores',
    'Hierarquicas': 'Hierárquicas',
    'Binarias': 'Binárias',
    'Representacoes': 'Representações',
    'Otimizacoes': 'Otimizações',
    'Aplicacoes': 'Aplicações',
    'Dinamica': 'Dinâmica',
    'Classicos': 'Clássicos',
    'Colisoes': 'Colisões',
    'Topicos': 'Tópicos',
    'Solucao': 'Solução',
    'Tecnicas': 'Técnicas',
    'Indexacao': 'Indexação',
    'Resolucao': 'Resolução',
    'Pseudocodigo': 'Pseudocódigo',
    'Compressao': 'Compressão',
    'Codificacao': 'Codificação',
    'Geometria': 'Geometria',
    'Computacional': 'Computacional',
    'Espaciais': 'Espaciais',
    'Persistentes': 'Persistentes',
    'Imutaveis': 'Imutáveis',
    'Javascript': 'JavaScript',
    'Estudo': 'Estudo',
    'Versao': 'Versão',
    'Isam': 'ISAM',
    'Metodo': 'Método',
    'Controle': 'Controle',
    // Adicionar mais conforme a necessidade, revisando os nomes de arquivos/pastas
    // e como eles são transformados em chaves para este mapa.
    // As chaves devem corresponder exatamente à forma como a palavra
    // aparece após a capitalização feita por:
    // .map(word => word.charAt(0).toUpperCase() + word.slice(1))
};

// Função para restaurar caracteres especiais nos títulos
function restoreSpecialChars(text) {
    if (!text) return '';
    const words = text.split(' ');
    const restoredWords = words.map(word => {
        // Preserva pontuação no final da palavra, se houver
        const punctuationMatch = word.match(/([.,!?;:]+)$/);
        const coreWord = punctuationMatch ? word.slice(0, -punctuationMatch[0].length) : word;
        const restoredCoreWord = specialCharMap[coreWord] || coreWord;
        return punctuationMatch ? restoredCoreWord + punctuationMatch[0] : restoredCoreWord;
    });
    return restoredWords.join(' ');
}

// Re-implementing helper functions (ideally, these would be in a shared utils.js)
function getModuleTitle(moduleDirName) {
    const parts = moduleDirName.split('-');
    let title;
    if (parts.length > 1 && !isNaN(parseInt(parts[0]))) {
         title = parts.slice(1).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').replace(/ E /g, ' e ');
    } else {
        title = moduleDirName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').replace(/ E /g, ' e ');
    }
    return restoreSpecialChars(title); // Aplicar restauração
}

function getAulaTitle(fileName) {
    const baseNameWithoutExt = basename(fileName, extname(fileName));
    const parts = baseNameWithoutExt.split('-');
    let title;
    if (parts.length > 1 && !isNaN(parseInt(parts[0]))) {
        title = parts.slice(1).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').replace(/ E /g, ' e ');
    } else {
        title = parts.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').replace(/ E /g, ' e ');
    }
    return restoreSpecialChars(title); // Aplicar restauração
}

function generateJekyllData() {
    const courseData = { modules: [] };

    try {
        if (!existsSync(modulesPath)) {
            console.error(`❌ Diretório de módulos não encontrado: ${modulesPath}`);
            return;
        }

        const moduleDirs = readdirSync(modulesPath)
            .map(name => ({ name, path: join(modulesPath, name) }))
            .filter(item => statSync(item.path).isDirectory())
            .sort((a, b) => {
                const numA = parseInt(a.name.split('-')[0]);
                const numB = parseInt(b.name.split('-')[0]);
                if (!isNaN(numA) && !isNaN(numB)) {
                    return numA - numB;
                }
                return a.name.localeCompare(b.name);
            });

        for (const moduleDir of moduleDirs) {
            const moduleName = moduleDir.name;
            const moduleTitle = getModuleTitle(moduleName);
            // Simple emoji logic for now, can be expanded
            const emoji = moduleName.startsWith('0-') ? "🏁" : (moduleName.startsWith('1-') ? "🛠️" : "📚"); 

            const currentModuleData = {
                id_prefix: moduleName,
                title: moduleTitle,
                emoji: emoji,
                lessons: []
            };

            const moduleFiles = readdirSync(moduleDir.path);
            const lessonsTemp = {}; // To group .md and .mp3

            moduleFiles.forEach(file => {
                const ext = extname(file);
                const baseName = basename(file, ext);
                // Paths relative to the project root, starting with / for Jekyll
                const relativeFilePath = `/${relative(projectBasePath, join(moduleDir.path, file))}`;

                if (!lessonsTemp[baseName]) {
                    lessonsTemp[baseName] = {
                        id: `${moduleName}-${baseName.replace(/[^a-zA-Z0-9-_]/g, '')}`, // Sanitize ID
                        title: getAulaTitle(file),
                        mp3_path: null,
                        md_path: null
                    };
                }

                if (ext === '.md') {
                    lessonsTemp[baseName].md_path = relativeFilePath;
                } else if (ext === '.mp3') {
                    lessonsTemp[baseName].mp3_path = relativeFilePath;
                }
            });

            const sortedLessonKeys = Object.keys(lessonsTemp).sort();

            for (const lessonKey of sortedLessonKeys) {
                const lesson = lessonsTemp[lessonKey];
                // Only add lesson if it has an MP3 (core content for the player)
                // or at least an MD file.
                if (lesson.mp3_path || lesson.md_path) { 
                    currentModuleData.lessons.push(lesson);
                }
            }
            
            if (currentModuleData.lessons.length > 0) {
                courseData.modules.push(currentModuleData);
            }
        }

        if (!existsSync(dataPath)) {
            mkdirSync(dataPath, { recursive: true });
            console.log(`📁 Diretório _data criado em: ${dataPath}`);
        }

        writeFileSync(outputPath, dump(courseData), 'utf8');
        console.log(`✅ Dados para Jekyll gerados com sucesso em: ${outputPath}`);

    } catch (error) {
        console.error("❌ Erro ao gerar dados para Jekyll:", error);
    }
}

generateJekyllData(); 