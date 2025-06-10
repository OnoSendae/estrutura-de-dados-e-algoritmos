import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { load } from 'js-yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectBasePath = dirname(__dirname);

function validateStructure() {
    console.log('🔍 Validando estrutura unificada...\n');

    try {
        // Load course structure
        const courseStructurePath = join(projectBasePath, '_data', 'course_structure.yml');
        const courseData = load(readFileSync(courseStructurePath, 'utf8'));

        // Validate course metadata
        console.log('📊 Metadados do Curso:');
        console.log(`   • Título: ${courseData.course.title}`);
        console.log(`   • Versão: ${courseData.course.version}`);
        console.log(`   • Última atualização: ${courseData.course.last_updated}\n`);

        // Validate modules structure
        console.log('📚 Estrutura dos Módulos:');

        let totalLessons = 0;
        let modulesWithAudio = 0;
        let lessonsWithAudio = 0;

        for (const module of courseData.modules) {
            const hasRequiredFields = module.id && module.id_prefix && module.title && module.title_en && module.emoji;
            const hasPathFields = module.path && module.lessons_path && module.audio_path;

            if (!hasRequiredFields) {
                console.error(`❌ Módulo ${module.id || 'UNKNOWN'} está faltando campos obrigatórios`);
                continue;
            }

            if (!hasPathFields) {
                console.error(`❌ Módulo ${module.id} está faltando campos de path`);
                continue;
            }

            // Count lessons and audio
            const moduleAudioCount = module.lessons.filter(lesson => lesson.mp3_path).length;
            totalLessons += module.lessons.length;

            if (moduleAudioCount > 0) {
                modulesWithAudio++;
                lessonsWithAudio += moduleAudioCount;
            }

            console.log(`   ✅ ${module.id}: "${module.title}" (${module.lessons.length} aulas, ${moduleAudioCount} com áudio)`);

            // Validate compatibility with both old and new structure
            const hasOldCompatibility = module.id_prefix && module.emoji;
            const hasNewCompatibility = module.path && module.title_en;

            if (!hasOldCompatibility || !hasNewCompatibility) {
                console.warn(`⚠️  Módulo ${module.id} pode ter problemas de compatibilidade`);
            }
        }

        console.log('\n📈 Estatísticas:');
        console.log(`   • Total de módulos: ${courseData.modules.length}`);
        console.log(`   • Total de aulas: ${totalLessons}`);
        console.log(`   • Módulos com áudio: ${modulesWithAudio}/${courseData.modules.length}`);
        console.log(`   • Aulas com áudio: ${lessonsWithAudio}/${totalLessons} (${Math.round(lessonsWithAudio / totalLessons * 100)}%)`);

        // Test template compatibility
        console.log('\n🧪 Testes de Compatibilidade:');

        // Test old structure access
        const firstModule = courseData.modules[0];
        const oldStyleAccess = firstModule.id_prefix && firstModule.emoji && firstModule.lessons;
        console.log(`   ${oldStyleAccess ? '✅' : '❌'} Compatibilidade com estrutura antiga (sidebar_playlist.html)`);

        // Test new structure access  
        const newStyleAccess = firstModule.path && firstModule.title_en && firstModule.lessons_path;
        console.log(`   ${newStyleAccess ? '✅' : '❌'} Compatibilidade com estrutura nova (module_navigation.html)`);

        // Test lesson structure
        const hasLessons = firstModule.lessons && firstModule.lessons.length > 0;
        const firstLesson = hasLessons ? firstModule.lessons[0] : null;
        const lessonStructure = firstLesson && firstLesson.id && firstLesson.title && firstLesson.md_path;
        console.log(`   ${lessonStructure ? '✅' : '❌'} Estrutura de aulas válida`);

        console.log('\n🎉 Validação concluída com sucesso!');
        return true;

    } catch (error) {
        console.error('❌ Erro na validação:', error.message);
        return false;
    }
}

// Run validation
const success = validateStructure();
process.exit(success ? 0 : 1); 