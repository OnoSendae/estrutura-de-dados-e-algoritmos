document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const audioPlayer = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const progressBar = document.querySelector('.progress-bar .progress'); // Corrected selector
    const progressContainer = document.querySelector('.progress-bar');
    
    const currentLessonTitleEl = document.getElementById('current-title');
    const currentModuleTitleEl = document.getElementById('current-module');
    const miniLessonTitleEl = document.getElementById('mini-title');
    const miniModuleTitleEl = document.getElementById('mini-module');
    
    const readingMaterialDiv = document.getElementById('reading-material');
    const materialLink = document.getElementById('material-link');

    const lessons = document.querySelectorAll('.playlist .lesson');
    let currentLessonIndex = -1;
    let isPlaying = false;

    // Base URL para carregar arquivos .md - importante para GitHub Pages
    // Jekyll injeta site.baseurl. Se não estiver disponível, assume raiz.
    // const baseurl = window.JEKYLL_BASEURL || ''; // Comentado/Removido pois os caminhos já vêm com baseurl do Liquid

    function loadAndPlayLesson(index) {
        if (index < 0 || index >= lessons.length) return;

        const lessonElement = lessons[index];
        currentLessonIndex = index;

        const audioSrc = lessonElement.dataset.audioSrc;
        const mdPath = lessonElement.dataset.mdPath;
        const lessonTitle = lessonElement.dataset.lessonTitle;
        const moduleTitle = lessonElement.dataset.moduleTitle;

        // Atualiza informações da interface
        currentLessonTitleEl.textContent = lessonTitle;
        currentModuleTitleEl.textContent = moduleTitle;
        miniLessonTitleEl.textContent = lessonTitle;
        miniModuleTitleEl.textContent = moduleTitle;

        // Carrega e exibe material Markdown
        if (mdPath && mdPath !== 'null' && mdPath !== 'undefined') {
            materialLink.href = mdPath;
            materialLink.classList.remove('hidden');
            
            fetch(mdPath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(markdownContent => {
                    if (typeof marked !== 'undefined') {
                        readingMaterialDiv.innerHTML = marked.parse(markdownContent);
                    } else {
                        const pre = document.createElement('pre');
                        pre.textContent = markdownContent;
                        readingMaterialDiv.innerHTML = '';
                        readingMaterialDiv.appendChild(pre);
                    }
                    // Re-append o link caso o innerHTML o tenha removido
                    if (!readingMaterialDiv.contains(materialLink)) {
                        readingMaterialDiv.appendChild(materialLink);
                    }
                })
                .catch(error => {
                    console.error("Erro ao carregar material .md:", error);
                    readingMaterialDiv.innerHTML = '<p>Erro ao carregar o material de leitura.</p>';
                    if (!readingMaterialDiv.contains(materialLink)) {
                         readingMaterialDiv.appendChild(materialLink);
                    }
                });
        } else {
            readingMaterialDiv.innerHTML = '<p>Esta aula não possui material de leitura associado.</p>';
            materialLink.classList.add('hidden');
        }

        // Carrega e toca áudio
        if (audioSrc && audioSrc !== 'null' && audioSrc !== 'undefined') {
            audioPlayer.src = audioSrc;
            audioPlayer.play();
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            isPlaying = true;
        } else {
            // Se não tiver áudio, para o player e reseta o botão
            audioPlayer.pause();
            audioPlayer.src = '';
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            isPlaying = false;
            currentTimeEl.textContent = '0:00';
            durationEl.textContent = '0:00';
            if(progressBar) progressBar.style.width = '0%';
        }

        // Atualiza destaque na playlist
        lessons.forEach(l => l.classList.remove('active'));
        lessonElement.classList.add('active');
    }

    playBtn.addEventListener('click', () => {
        if (!audioPlayer.src || audioPlayer.src === window.location.href) { // Verifica se tem source válido
             if (lessons.length > 0 && currentLessonIndex === -1) loadAndPlayLesson(0); // Toca a primeira se nenhuma foi tocada
             return;
        }
        if (isPlaying) {
            audioPlayer.pause();
        } else {
            audioPlayer.play();
        }
    });

    audioPlayer.addEventListener('play', () => {
        isPlaying = true;
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    });

    audioPlayer.addEventListener('pause', () => {
        isPlaying = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    });

    nextBtn.addEventListener('click', () => {
        loadAndPlayLesson(currentLessonIndex + 1);
    });

    prevBtn.addEventListener('click', () => {
        loadAndPlayLesson(currentLessonIndex - 1);
    });

    lessons.forEach((lesson, index) => {
        lesson.addEventListener('click', () => {
            loadAndPlayLesson(index);
        });
    });

    audioPlayer.addEventListener('timeupdate', () => {
        if (!audioPlayer.duration) return;
        const { currentTime, duration } = audioPlayer;
        const progressPercent = (currentTime / duration) * 100;
        if(progressBar) progressBar.style.width = `${progressPercent}%`;
        currentTimeEl.textContent = formatTime(currentTime);
        durationEl.textContent = formatTime(duration);
    });

    progressContainer.addEventListener('click', (e) => {
        if (!audioPlayer.duration) return;
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        audioPlayer.currentTime = (clickX / width) * audioPlayer.duration;
    });

    audioPlayer.addEventListener('ended', () => {
        // Toca a próxima automaticamente
        if (currentLessonIndex < lessons.length - 1) {
            loadAndPlayLesson(currentLessonIndex + 1);
        } else {
            isPlaying = false;
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            // Opcional: resetar para a primeira aula ou parar
        }
    });

    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    }
    
    // Expandir/recolher módulos na playlist
    const moduleTitles = document.querySelectorAll('.playlist-module > .module-title');
    moduleTitles.forEach(title => {
        title.addEventListener('click', function() {
            this.parentElement.classList.toggle('expanded');
        });
    });

    // Para passar o baseurl do Jekyll para o JavaScript, você pode adicionar no seu layout default.html:
    // <script>
    //   window.JEKYLL_BASEURL = "{{ site.baseurl }}";
    // </script>
    // ANTES de carregar este script player.js
}); 