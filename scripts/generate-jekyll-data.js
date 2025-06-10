import { readdirSync, statSync, writeFileSync, readFileSync, mkdirSync, existsSync } from 'fs';
import { join, basename, extname, dirname, relative } from 'path';
import { dump } from 'js-yaml';

// Helper: Ensure __dirname is available in ES Modules
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectBasePath = dirname(__dirname); // Goes up one level from scripts/ to project root

// Updated paths for new structure
const modulesPath = join(projectBasePath, 'modules');
const audioPath = join(projectBasePath, 'assets', 'audio');
const dataPath = join(projectBasePath, '_data');
const outputPath = join(dataPath, 'course_structure.yml');

// Mapping from module IDs to proper titles, emojis, and English titles
const moduleInfo = {
    '01-foundations': {
        title: 'Fundamentos da Programação',
        title_en: 'Programming Foundations',
        emoji: '🏁'
    },
    '02-complexity-analysis': {
        title: 'Análise de Algoritmos e Complexidade',
        title_en: 'Algorithm Analysis & Complexity',
        emoji: '🛠️'
    },
    '03-linear-structures': {
        title: 'Estruturas de Dados Lineares Avançadas',
        title_en: 'Advanced Linear Data Structures',
        emoji: '📚'
    },
    '04-trees-graphs': {
        title: 'Árvores e Grafos',
        title_en: 'Trees and Graphs',
        emoji: '🌳'
    },
    '05-sorting-searching': {
        title: 'Algoritmos de Ordenação e Busca Avançados',
        title_en: 'Advanced Sorting & Searching Algorithms',
        emoji: '🔍'
    },
    '06-hash-tables': {
        title: 'Tabelas Hash e Funções Hash',
        title_en: 'Hash Tables & Hash Functions',
        emoji: '🗂️'
    },
    '07-greedy-dynamic': {
        title: 'Algoritmos Gulosos e Programação Dinâmica',
        title_en: 'Greedy Algorithms & Dynamic Programming',
        emoji: '🧩'
    },
    '08-advanced-topics': {
        title: 'Tópicos Avançados e Aplicações',
        title_en: 'Advanced Topics & Applications',
        emoji: '🚀'
    },
    '09-persistent-structures': {
        title: 'Estruturas de Dados Persistentes',
        title_en: 'Persistent Data Structures',
        emoji: '💾'
    },
    '10-complex-structures': {
        title: 'Estruturas de Dados Complexas',
        title_en: 'Complex Data Structures',
        emoji: '🏗️'
    },
    '11-indexing': {
        title: 'Indexação',
        title_en: 'Indexing Techniques',
        emoji: '📇'
    },
    '12-problem-solving': {
        title: 'Técnicas de Resolução de Problemas',
        title_en: 'Problem Solving Techniques',
        emoji: '🎯'
    }
};

// Function to generate lesson title from filename
function generateLessonTitle(fileName) {
    const baseNameWithoutExt = basename(fileName, extname(fileName));

    // Remove leading numbers and hyphens
    const cleanName = baseNameWithoutExt.replace(/^[\d\.-]+/, '');

    // Split by hyphens and capitalize
    const words = cleanName.split('-')
        .filter(word => word.length > 0)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1));

    // Apply special character restoration
    const title = words.join(' ')
        .replace(/\bE\b/g, 'e')
        .replace(/\bDa\b/g, 'da')
        .replace(/\bDe\b/g, 'de')
        .replace(/\bDo\b/g, 'do')
        .replace(/\bEm\b/g, 'em')
        .replace(/\bPara\b/g, 'para')
        .replace(/Programacao/g, 'Programação')
        .replace(/Analise/g, 'Análise')
        .replace(/Funcoes/g, 'Funções')
        .replace(/Orientada/g, 'Orientada')
        .replace(/Objetos/g, 'Objetos')
        .replace(/Pseudocodigo/g, 'Pseudocódigo')
        .replace(/Estruturas/g, 'Estruturas')
        .replace(/Controle/g, 'Controle');

    return title;
}

// Function to find corresponding audio file
function findAudioFile(moduleId, lessonFileName) {
    const audioModulePath = join(audioPath, moduleId);

    if (!existsSync(audioModulePath)) {
        return null;
    }

    const baseName = basename(lessonFileName, extname(lessonFileName));
    const audioFiles = readdirSync(audioModulePath);

    // Look for MP3 file first, then WAV
    const extensions = ['.mp3', '.wav'];

    for (const ext of extensions) {
        // Try exact match first
        const exactMatch = audioFiles.find(file =>
            basename(file, extname(file)) === baseName && extname(file) === ext
        );

        if (exactMatch) {
            return `/assets/audio/${moduleId}/${exactMatch}`;
        }

        // Try fuzzy match (remove special characters and normalize)
        const normalizedBaseName = baseName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const fuzzyMatch = audioFiles.find(file => {
            const normalizedFileName = basename(file, extname(file))
                .replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            return normalizedFileName.includes(normalizedBaseName) && extname(file) === ext;
        });

        if (fuzzyMatch) {
            return `/assets/audio/${moduleId}/${fuzzyMatch}`;
        }
    }

    return null;
}

function generateJekyllData() {
    const courseData = {
        course: {
            title: "Estrutura de Dados e Algoritmos",
            description: "Curso completo de estruturas de dados e algoritmos",
            version: "2.0",
            last_updated: new Date().toISOString().split('T')[0]
        },
        modules: []
    };

    try {
        if (!existsSync(modulesPath)) {
            console.error(`❌ Diretório de módulos não encontrado: ${modulesPath}`);
            return;
        }

        const moduleDirs = readdirSync(modulesPath)
            .map(name => ({ name, path: join(modulesPath, name) }))
            .filter(item => statSync(item.path).isDirectory())
            .sort((a, b) => {
                // Sort by module number
                const numA = parseInt(a.name.split('-')[0]);
                const numB = parseInt(b.name.split('-')[0]);
                return numA - numB;
            });

        console.log(`📚 Processando ${moduleDirs.length} módulos...`);

        for (const moduleDir of moduleDirs) {
            const moduleId = moduleDir.name;
            const moduleData = moduleInfo[moduleId];

            if (!moduleData) {
                console.warn(`⚠️  Informações não encontradas para módulo: ${moduleId}`);
                continue;
            }

            const currentModuleData = {
                id: moduleId,
                id_prefix: moduleId,
                title: moduleData.title,
                title_en: moduleData.title_en,
                emoji: moduleData.emoji,
                path: `modules/${moduleId}`,
                lessons_path: `modules/${moduleId}/lessons`,
                exercises_path: `modules/${moduleId}/exercises`,
                examples_path: `modules/${moduleId}/examples`,
                resources_path: `modules/${moduleId}/resources`,
                audio_path: `assets/audio/${moduleId}`,
                lessons: []
            };

            // Look for lessons in the lessons/ subdirectory
            const lessonsPath = join(moduleDir.path, 'lessons');

            if (existsSync(lessonsPath)) {
                const lessonFiles = readdirSync(lessonsPath)
                    .filter(file => extname(file) === '.md')
                    .sort();

                console.log(`  📖 Módulo ${moduleId}: ${lessonFiles.length} aulas encontradas`);

                for (const lessonFile of lessonFiles) {
                    const lessonTitle = generateLessonTitle(lessonFile);
                    const mdPath = `/modules/${moduleId}/lessons/${lessonFile}`;
                    const audioPath = findAudioFile(moduleId, lessonFile);

                    const lesson = {
                        id: `${moduleId}-${basename(lessonFile, '.md').replace(/[^a-zA-Z0-9-_]/g, '')}`,
                        title: lessonTitle,
                        mp3_path: audioPath,
                        md_path: mdPath
                    };

                    currentModuleData.lessons.push(lesson);
                }
            } else {
                console.warn(`⚠️  Diretório de aulas não encontrado: ${lessonsPath}`);
            }

            if (currentModuleData.lessons.length > 0) {
                courseData.modules.push(currentModuleData);
                console.log(`✅ Módulo ${moduleId} processado: ${currentModuleData.lessons.length} aulas`);
            }
        }

        if (!existsSync(dataPath)) {
            mkdirSync(dataPath, { recursive: true });
            console.log(`📁 Diretório _data criado em: ${dataPath}`);
        }

        writeFileSync(outputPath, dump(courseData), 'utf8');

        const totalLessons = courseData.modules.reduce((sum, module) => sum + module.lessons.length, 0);
        console.log(`\n🎉 Dados para Jekyll gerados com sucesso!`);
        console.log(`📊 Estatísticas:`);
        console.log(`   • ${courseData.modules.length} módulos processados`);
        console.log(`   • ${totalLessons} aulas totais`);
        console.log(`📄 Arquivo gerado: ${outputPath}`);

    } catch (error) {
        console.error("❌ Erro ao gerar dados para Jekyll:", error);
    }
}

generateJekyllData(); 