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

// Re-implementing helper functions (ideally, these would be in a shared utils.js)
function getModuleTitle(moduleDirName) {
    const parts = moduleDirName.split('-');
    if (parts.length > 1 && !isNaN(parseInt(parts[0]))) {
         return parts.slice(1).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').replace(/ E /g, ' e ');
    }
    return moduleDirName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').replace(/ E /g, ' e ');
}

function getAulaTitle(fileName) {
    const baseNameWithoutExt = basename(fileName, extname(fileName));
    const parts = baseNameWithoutExt.split('-');
    if (parts.length > 1 && !isNaN(parseInt(parts[0]))) {
        return parts.slice(1).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').replace(/ E /g, ' e ');
    }
    return parts.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').replace(/ E /g, ' e ');
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