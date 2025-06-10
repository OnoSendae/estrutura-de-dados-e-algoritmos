import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { load } from 'js-yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectBasePath = dirname(__dirname);

function testAudioPaths() {
    console.log('🎵 Testando caminhos de áudio...\n');

    try {
        // Load course structure
        const courseStructurePath = join(projectBasePath, '_data', 'course_structure.yml');
        const courseData = load(readFileSync(courseStructurePath, 'utf8'));

        let totalLessons = 0;
        let lessonsWithAudio = 0;
        let validAudioPaths = 0;
        let invalidAudioPaths = 0;
        const invalidPaths = [];

        courseData.modules.forEach(module => {
            console.log(`📁 ${module.id}: ${module.title}`);

            module.lessons.forEach(lesson => {
                totalLessons++;

                if (lesson.mp3_path && lesson.mp3_path !== 'null') {
                    lessonsWithAudio++;

                    // Remove leading slash and baseurl to get file path
                    let audioPath = lesson.mp3_path;
                    if (audioPath.startsWith('/assets/')) {
                        audioPath = audioPath.substring(1); // Remove leading /
                    }

                    const fullPath = join(projectBasePath, audioPath);

                    if (existsSync(fullPath)) {
                        validAudioPaths++;
                        console.log(`   ✅ ${lesson.title}: ${audioPath}`);
                    } else {
                        invalidAudioPaths++;
                        invalidPaths.push({
                            lesson: lesson.title,
                            path: audioPath,
                            fullPath: fullPath
                        });
                        console.log(`   ❌ ${lesson.title}: ${audioPath} (NÃO ENCONTRADO)`);
                    }
                } else {
                    console.log(`   📚 ${lesson.title}: (apenas leitura)`);
                }
            });
            console.log('');
        });

        console.log('\n📊 RELATÓRIO FINAL:');
        console.log(`   • Total de aulas: ${totalLessons}`);
        console.log(`   • Aulas com áudio: ${lessonsWithAudio}`);
        console.log(`   • Arquivos de áudio válidos: ${validAudioPaths}`);
        console.log(`   • Arquivos de áudio inválidos: ${invalidAudioPaths}`);

        if (invalidPaths.length > 0) {
            console.log('\n❌ ARQUIVOS NÃO ENCONTRADOS:');
            invalidPaths.forEach(item => {
                console.log(`   • ${item.lesson}: ${item.path}`);
                console.log(`     Caminho completo: ${item.fullPath}`);
            });
        }

        if (invalidAudioPaths === 0) {
            console.log('\n🎉 Todos os arquivos de áudio foram encontrados!');
        }

    } catch (error) {
        console.error('❌ Erro ao testar caminhos de áudio:', error);
    }
}

testAudioPaths(); 