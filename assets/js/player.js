document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed.'); // DEBUG: Início do script

    const JEKYLL_BASEURL = window.JEKYLL_BASEURL || ''; // Pega o baseurl

    // Elementos do DOM
    const audioPlayer = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const progressBar = document.querySelector('.progress-bar .progress');
    const progressContainer = document.querySelector('.progress-bar');

    const currentLessonTitleEl = document.getElementById('current-title');
    const currentModuleTitleEl = document.getElementById('current-module');
    const miniLessonTitleEl = document.getElementById('mini-title');
    const miniModuleTitleEl = document.getElementById('mini-module');

    const readingMaterialDiv = document.getElementById('reading-material');
    const materialLink = document.getElementById('material-link');

    // Novos elementos para controle de volume e mudo
    const muteBtn = document.getElementById('mute-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeBarVisual = document.querySelector('.volume-bar .volume'); // A barra visual dentro do container

    const lessons = document.querySelectorAll('.playlist .lesson');
    let currentLessonIndex = -1;
    let isPlaying = false;

    // Ícones para os módulos (atualizado para nova estrutura)
    const moduleIcons = {
        'foundations': '🏁',
        'complexity-analysis': '🛠️',
        'linear-structures': '📚',
        'trees-graphs': '🌳',
        'sorting-searching': '🔍',
        'hash-tables': '🗂️',
        'greedy-dynamic': '🧩',
        'advanced-topics': '🚀',
        'persistent-structures': '💾',
        'complex-structures': '🏗️',
        'indexing': '📇',
        'problem-solving': '🎯'
    };

    function loadAndPlayLesson(index) {
        console.log(`loadAndPlayLesson called with index: ${index}`); // DEBUG: Início da função de carregar/tocar
        if (index < 0 || index >= lessons.length) {
            console.warn(`Invalid lesson index: ${index}`); // DEBUG: Índice inválido
            return;
        }

        const lessonElement = lessons[index];
        currentLessonIndex = index;

        const audioSrc = lessonElement.dataset.audioSrc;
        const mdPath = lessonElement.dataset.mdPath;
        const lessonTitle = lessonElement.dataset.lessonTitle;
        const moduleTitle = lessonElement.dataset.moduleTitle;
        const lessonId = lessonElement.dataset.lessonId;

        console.log(`📄 Dados da aula:`);
        console.log(`  📁 mdPath: "${mdPath}"`);
        console.log(`  🎵 audioSrc: "${audioSrc}"`);
        console.log(`  📚 lessonTitle: "${lessonTitle}"`);
        console.log(`  📖 moduleTitle: "${moduleTitle}"`);
        console.log(`  🆔 lessonId: "${lessonId}"`);

        // Encontra o módulo pai e expande-o se ainda não estiver expandido
        const parentModule = lessonElement.closest('.playlist-module');
        if (parentModule && !parentModule.classList.contains('expanded')) {
            parentModule.classList.add('expanded');
        }

        // Atualiza informações da interface
        currentLessonTitleEl.textContent = lessonTitle;
        currentModuleTitleEl.textContent = moduleTitle;
        miniLessonTitleEl.textContent = lessonTitle;
        miniModuleTitleEl.textContent = moduleTitle;

        // Atualiza o ícone/cover da aula atual se existir para o módulo
        // const moduleId = lessonId.split('-')[0] + '-' + lessonId.split('-')[1] + '-' + lessonId.split('-')[2] + '-' + lessonId.split('-')[3];
        // const moduleKey = moduleId.substring(2); // Remove o número do início

        // Nova lógica mais robusta para extrair moduleKey usando regex
        const match = lessonId.match(/^(\d{2}-[a-z0-9-]+)-/);
        const moduleId = match && match[1] ? match[1] : null;
        const moduleKey = moduleId ? moduleId.substring(3) : null; // Remove "XX-" do início

        const icon = moduleKey && moduleIcons[moduleKey] ? moduleIcons[moduleKey] : '📚';
        const lessonCovers = document.querySelectorAll('.lesson-cover');
        lessonCovers.forEach(cover => {
            cover.innerHTML = `<span style="font-size: 36px;">${icon}</span>`;
        });

        const miniCoverContentElement = document.getElementById('mini-cover-content');
        if (miniCoverContentElement) {
            // Define o emoji no mini-cover, similar ao lesson-cover
            // Usamos um tamanho de fonte ligeiramente menor para o mini-cover
            miniCoverContentElement.innerHTML = `<span style="font-size: 24px;">${icon}</span>`; // Ajuste '24px' conforme necessário
        }

        // Carrega e exibe material Markdown
        if (mdPath && mdPath !== 'null' && mdPath !== 'undefined') {
            console.log(`📄 Carregando markdown: ${mdPath}`);
            materialLink.href = mdPath;
            materialLink.classList.remove('hidden');

            fetch(mdPath)
                .then(response => {
                    console.log(`📡 Resposta do fetch: ${response.status} - ${response.statusText}`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(markdownContent => {
                    console.log(`📝 Markdown carregado. Tamanho: ${markdownContent.length} chars`);
                    console.log(`📝 Início do conteúdo: ${markdownContent.substring(0, 200)}...`);

                    // Função para processar com marked.js
                    const processWithMarked = () => {
                        console.log(`🔧 marked.js disponível. Processando markdown...`);
                        readingMaterialDiv.innerHTML = marked.parse(markdownContent);
                        console.log(`✅ HTML gerado pelo marked.js!`);

                        // Debug: verifica o que foi gerado
                        const allElements = document.querySelectorAll('#reading-material *');
                        console.log(`📊 Elementos HTML gerados: ${allElements.length}`);

                        const preElements = document.querySelectorAll('#reading-material pre');
                        const codeElements = document.querySelectorAll('#reading-material code');
                        console.log(`📊 <pre> encontrados: ${preElements.length}, <code> encontrados: ${codeElements.length}`);

                        enhanceCodeBlocks();

                        // Força uma nova verificação após o DOM atualizar
                        setTimeout(() => {
                            console.log(`🔄 Tentativa 2 após 200ms...`);
                            enhanceCodeBlocks();
                        }, 200);

                        // E mais uma verificação para garantir
                        setTimeout(() => {
                            console.log(`🔄 Tentativa 3 após 500ms...`);
                            const codeElements = document.querySelectorAll('#reading-material pre, #reading-material code');
                            console.log(`🔍 Verificação final: ${codeElements.length} elementos de código encontrados`);
                            enhanceCodeBlocks();
                        }, 500);
                    };

                    if (typeof marked !== 'undefined') {
                        processWithMarked();
                    } else {
                        console.log(`⏳ marked.js ainda não carregado. Aguardando...`);

                        // Tenta aguardar o marked.js carregar
                        let attempts = 0;
                        const checkMarked = setInterval(() => {
                            attempts++;
                            console.log(`🔍 Tentativa ${attempts}: Verificando marked.js...`);

                            if (typeof marked !== 'undefined') {
                                console.log(`✅ marked.js carregado na tentativa ${attempts}!`);
                                clearInterval(checkMarked);
                                processWithMarked();
                            } else if (attempts >= 10) {
                                console.log(`❌ marked.js não carregou após ${attempts} tentativas. Usando fallback.`);
                                clearInterval(checkMarked);

                                // Fallback: processa manualmente os blocos ```javascript
                                processMarkdownManually(markdownContent);
                            }
                        }, 100);
                    }

                    // Adiciona botão de compartilhamento
                    addShareButton();

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
        } else { // Se mdPath for null, 'null', undefined, ou uma string vazia
            const nextLessonButton = document.createElement('button');
            nextLessonButton.textContent = 'Avançar para a próxima aula';
            nextLessonButton.className = 'btn-next-material'; // Para estilização opcional
            nextLessonButton.onclick = () => {
                // Garante que não tentemos avançar além da última aula
                if (currentLessonIndex < lessons.length - 1) {
                    loadAndPlayLesson(currentLessonIndex + 1);
                } else {
                    // Opcional: feedback se já estiver na última aula e não houver próxima
                    console.log("Já está na última aula.");
                }
            };

            readingMaterialDiv.innerHTML = '<p>Para avançar para a próxima aula, clique no botão abaixo ou utilize os controles do player.</p>';
            readingMaterialDiv.appendChild(nextLessonButton);

            materialLink.classList.add('hidden'); // Esconde o link "Abrir Material Completo"
        }

        // Carrega e toca áudio
        if (audioSrc && audioSrc !== 'null' && audioSrc !== 'undefined') {
            console.log('Loading audio source:', audioSrc); // DEBUG
            audioPlayer.src = audioSrc;
            // A UI (botão play/pause e isPlaying) será atualizada pelos listeners de 'play' e 'pause'
            audioPlayer.play().catch(error => {
                console.error('Error attempting to play audio:', error); // DEBUG: Erro ao tentar tocar
                // Isso pode acontecer se a reprodução automática for bloqueada pelo navegador
                // Pode ser necessário que o usuário interaja primeiro
                // Certifica-se de que a UI reflita que não está tocando se o autoplay falhar
                isPlaying = false; // Garante que o estado interno esteja correto
                playBtn.innerHTML = '<i class="fas fa-play"></i>'; // Mostra botão play
            });
        } else {
            console.log('No valid audio source found for this lesson.', lessonId); // DEBUG
            // Se não tiver áudio, para o player e reseta o botão
            audioPlayer.pause();
            audioPlayer.src = '';
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            isPlaying = false;
            currentTimeEl.textContent = '0:00';
            durationEl.textContent = '0:00';
            if (progressBar) progressBar.style.width = '0%';
        }

        // Atualiza destaque na playlist
        lessons.forEach(l => l.classList.remove('active'));
        lessonElement.classList.add('active');

        // Atualiza o fragmento da URL com o ID da aula atual
        if (lessonId) {
            // Usamos replaceState para não poluir o histórico do navegador com cada clique de aula interna.
            // Se o objetivo fosse permitir que o botão "voltar" do navegador navegasse entre as aulas tocadas,
            // poderíamos usar history.pushState aqui.
            if (history.replaceState) {
                history.replaceState(null, null, '#' + lessonId);
            } else {
                // Fallback para navegadores mais antigos que não suportam history.replaceState
                window.location.hash = '#' + lessonId;
            }
        }
    }

    // Função ROBUSTA para highlighting profissional de códigos MARKDOWN
    function enhanceCodeBlocks() {
        console.log('🎯 Iniciando enhanceCodeBlocks...');

        // Aguarda um pouco para garantir que o marked.js terminou
        setTimeout(() => {
            // Testa TODOS os seletores possíveis
            const allSelectors = [
                '#reading-material pre code',
                '#reading-material pre',
                '#reading-material code',
                'pre code',
                'pre',
                'code'
            ];

            let totalBlocks = 0;
            allSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                console.log(`🔍 Seletor "${selector}": ${elements.length} elementos`);
                totalBlocks += elements.length;
            });

            // Procura especificamente por blocos de código do marked.js
            const codeBlocks = document.querySelectorAll('#reading-material pre code, #reading-material pre, #reading-material code');
            console.log(`📊 TOTAL encontrados: ${codeBlocks.length} blocos de código`);

            // Se não encontrou nada, força busca global
            if (codeBlocks.length === 0) {
                console.log('🚨 NENHUM BLOCO ENCONTRADO! Fazendo busca global...');
                const globalBlocks = document.querySelectorAll('pre, code');
                console.log(`🌍 Busca global: ${globalBlocks.length} elementos`);

                globalBlocks.forEach((element, index) => {
                    console.log(`🔍 Elemento ${index + 1}: tagName="${element.tagName}", className="${element.className}", texto="${element.textContent.substring(0, 30)}..."`);
                });
            }

            codeBlocks.forEach((element, index) => {
                let preElement, codeElement;

                if (element.tagName === 'PRE') {
                    preElement = element;
                    codeElement = element.querySelector('code') || element;
                } else {
                    codeElement = element;
                    preElement = element.closest('pre') || element;
                }

                // Não processa se já foi processado
                if (preElement.classList.contains('enhanced-code')) {
                    console.log(`⏭️ Bloco ${index + 1} já processado`);
                    return;
                }

                console.log(`🔧 Processando bloco ${index + 1}`);
                console.log(`📝 TagName: ${element.tagName}, Classes: "${element.className}"`);

                // Marca como processado
                preElement.classList.add('enhanced-code');

                // Identifica a linguagem
                let language = '';
                if (codeElement.className) {
                    const languageMatch = codeElement.className.match(/language-(\w+)/);
                    if (languageMatch) {
                        language = languageMatch[1];
                        console.log(`🏷️ Linguagem detectada: ${language}`);
                    }
                }

                // Pega o código
                const codeText = codeElement.textContent || preElement.textContent;
                console.log(`📄 Conteúdo (primeiras 100 chars): "${codeText.substring(0, 100)}..."`);

                // APLICA HIGHLIGHTING EM QUALQUER CÓDIGO QUE PAREÇA JAVASCRIPT
                const looksLikeJS = codeText && (
                    language === 'javascript' || language === 'js' ||
                    language === 'typescript' || language === 'ts' ||
                    codeText.includes('let ') ||
                    codeText.includes('const ') ||
                    codeText.includes('var ') ||
                    codeText.includes('function') ||
                    codeText.includes('=>') ||
                    codeText.includes('console.log') ||
                    codeText.includes('if (') ||
                    codeText.includes('for (') ||
                    codeText.includes('{') ||
                    codeText.includes('}')
                );

                if (looksLikeJS && codeText.trim()) {
                    console.log(`✨ APLICANDO HIGHLIGHTING! Motivo: ${language || 'detectado automaticamente'}`);
                    applyProfessionalHighlighting(preElement, codeText);
                } else {
                    console.log(`⚠️ Ignorando - Linguagem: "${language}", Parece JS: ${looksLikeJS}, Texto: "${codeText.substring(0, 30)}..."`);
                }
            });
        }, 100);
    }

    // Função de highlighting SIMPLIFICADO e LIMPO
    function applyProfessionalHighlighting(preElement, codeText) {
        const lines = codeText.split('\n');

        // Aplica estilo CSS diretamente no elemento
        preElement.style.cssText = `
            background: #1e1e1e !important;
            color: #d4d4d4 !important;
            font-family: 'Monaco', 'Menlo', 'Consolas', 'Courier New', monospace !important;
            font-size: 14px !important;
            line-height: 1.5 !important;
            padding: 20px !important;
            border-radius: 8px !important;
            overflow-x: auto !important;
            margin: 16px 0 !important;
            border: 1px solid #333 !important;
            position: relative !important;
        `;

        // Adiciona estilos CSS para as classes de highlighting
        if (!document.getElementById('code-highlighting-styles')) {
            const style = document.createElement('style');
            style.id = 'code-highlighting-styles';
            style.textContent = `
                .hl-comment { color: #6a9955 !important; }
                .hl-string { color: #ce9178 !important; }
                .hl-keyword { color: #569cd6 !important; font-weight: bold; }
                .hl-number { color: #b5cea8 !important; }
                .hl-function { color: #dcdcaa !important; }
            `;
            document.head.appendChild(style);
        }

        // Cria HTML simples e limpo
        let html = '';

        lines.forEach((line, index) => {
            const lineNumber = (index + 1).toString().padStart(2, ' ');

            // Aplica highlighting simples e direto
            let processedLine = line
                // 1. Comentários primeiro (antes de escapar HTML)
                .replace(/(\/\/.*$)/gm, '{{COMMENT}}$1{{/COMMENT}}')

                // 2. Strings
                .replace(/("[^"]*")/g, '{{STRING}}$1{{/STRING}}')
                .replace(/('[^']*')/g, '{{STRING}}$1{{/STRING}}')
                .replace(/(`[^`]*`)/g, '{{STRING}}$1{{/STRING}}')

                // 3. Keywords
                .replace(/\b(let|const|var|function|if|else|for|while|return|class|new|this|true|false|null|undefined)\b/g, '{{KEYWORD}}$1{{/KEYWORD}}')

                // 4. Números
                .replace(/\b(\d+\.?\d*)\b/g, '{{NUMBER}}$1{{/NUMBER}}')

                // 5. Funções
                .replace(/\b([a-zA-Z_$][\w$]*)\s*(?=\()/g, '{{FUNCTION}}$1{{/FUNCTION}}');

            // Escapa HTML
            processedLine = escapeHtml(processedLine);

            // Converte marcadores para HTML (depois do escape)
            processedLine = processedLine
                .replace(/\{\{COMMENT\}\}(.*?)\{\{\/COMMENT\}\}/g, '<span class="code-comment">$1</span>')
                .replace(/\{\{STRING\}\}(.*?)\{\{\/STRING\}\}/g, '<span class="code-string">$1</span>')
                .replace(/\{\{KEYWORD\}\}(.*?)\{\{\/KEYWORD\}\}/g, '<span class="code-keyword">$1</span>')
                .replace(/\{\{NUMBER\}\}(.*?)\{\{\/NUMBER\}\}/g, '<span class="code-number">$1</span>')
                .replace(/\{\{FUNCTION\}\}(.*?)\{\{\/FUNCTION\}\}/g, '<span class="code-function">$1</span>');

            html += `<div style="color: #d4d4d4; margin: 0; padding: 0;">` +
                `<span style="color: #858585; margin-right: 16px; user-select: none; display: inline-block; width: 30px;">${lineNumber}</span>` +
                `${processedLine}</div>`;
        });

        preElement.innerHTML = html;
        console.log('✅ Highlighting limpo aplicado!');
    }

    // Função auxiliar para escapar HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Função fallback para processar markdown manualmente
    function processMarkdownManually(markdownContent) {
        console.log(`🔧 Processando markdown manualmente...`);

        // Converte markdown básico para HTML
        let html = markdownContent
            // Headers
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')

            // Parágrafos
            .replace(/\n\n/g, '</p><p>')

            // Blocos de código
            .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, language, code) => {
                const lang = language || 'javascript';
                return `<pre><code class="language-${lang}">${escapeHtml(code.trim())}</code></pre>`;
            });

        // Envolve em parágrafos
        html = '<p>' + html + '</p>';

        // Limpa parágrafos vazios
        html = html.replace(/<p><\/p>/g, '');

        readingMaterialDiv.innerHTML = html;

        console.log(`✅ Markdown processado manualmente!`);

        // Aplica highlighting
        setTimeout(() => {
            enhanceCodeBlocks();
        }, 100);
    }

    // Função para envolver blocos de código em um container com título
    function wrapCodeBlock(codeElement, title, language) {
        // Não envolve se já estiver em um container .code-example
        if (codeElement.parentElement.classList.contains('code-example')) {
            return;
        }

        // Cria o container
        const container = document.createElement('div');
        container.className = 'code-example';

        // Cria a barra de título
        const titleBar = document.createElement('div');
        titleBar.className = 'code-example-title';
        titleBar.innerHTML = `
            <span>${title}</span>
            <span class="code-language">${language.toUpperCase()}</span>
        `;

        // Insere o container no lugar do elemento de código
        codeElement.parentNode.insertBefore(container, codeElement);
        container.appendChild(titleBar);
        container.appendChild(codeElement);

        // Adiciona botão de copiar código
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-btn';
        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
        copyButton.title = 'Copiar código';
        titleBar.appendChild(copyButton);

        // Adiciona funcionalidade de cópia
        copyButton.addEventListener('click', () => {
            const code = codeElement.querySelector('code').textContent;
            navigator.clipboard.writeText(code).then(() => {
                copyButton.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                }, 2000);
            }).catch(err => {
                console.error('Erro ao copiar código:', err);
            });
        });
    }

    // Função para adicionar um botão de compartilhamento (no material de leitura)
    function addShareButton() {
        const shareContainer = document.createElement('div');
        shareContainer.className = 'share-container';
        shareContainer.innerHTML = `
            <button class="share-btn">
                <i class="fas fa-share-alt"></i> Compartilhar
            </button>
        `;

        readingMaterialDiv.insertAdjacentElement('afterbegin', shareContainer);

        // Adiciona o evento de compartilhamento
        const shareBtn = shareContainer.querySelector('.share-btn');
        if (shareBtn) { // Adiciona verificação
            shareBtn.addEventListener('click', () => {
                // Lógica de copiar URL para a área de transferência (sem Web Share API)
                const urlToCopy = window.location.href;
                navigator.clipboard.writeText(urlToCopy).then(() => {
                    showToast('Link do material copiado!'); // Usa a função toast
                }).catch(err => {
                    console.error('Erro ao copiar link do material:', err);
                    // Fallback para métodos antigos, se necessário, embora writeText seja amplamente suportado
                });
            });
        }
    }

    playBtn.addEventListener('click', () => {
        console.log('Play button clicked.'); // DEBUG
        // Simplifica a lógica do botão play: apenas pausa/toca o que estiver carregado
        // A carga inicial baseada no hash é feita pela loadLessonFromUrlHash no DOMContentLoaded
        if (audioPlayer.src && audioPlayer.src !== window.location.href) { // Verifica se tem source válida
            console.log('Audio source exists, toggling play/pause.'); // DEBUG
            if (isPlaying) {
                audioPlayer.pause();
            } else {
                audioPlayer.play().catch(error => {
                    console.error('Error attempting to play audio from play button:', error); // DEBUG
                });
            }
        } else {
            console.log('Play button clicked, but no valid audio source is loaded.');
            // Opcional: Mostrar mensagem para o usuário selecionar uma aula
        }
    });

    // Event listeners para atualizar a UI com base nos eventos reais do player
    audioPlayer.addEventListener('play', () => {
        console.log('Audio player started playing.'); // DEBUG
        isPlaying = true;
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    });

    audioPlayer.addEventListener('pause', () => {
        console.log('Audio player paused.'); // DEBUG
        isPlaying = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    });

    audioPlayer.addEventListener('error', (e) => {
        console.error('Audio player error:', e); // DEBUG: Adiciona log de erro no player
    });

    nextBtn.addEventListener('click', () => {
        loadAndPlayLesson(currentLessonIndex + 1);
    });

    prevBtn.addEventListener('click', () => {
        loadAndPlayLesson(currentLessonIndex - 1);
    });

    lessons.forEach((lesson, index) => {
        lesson.addEventListener('click', (event) => {
            event.preventDefault();
            loadAndPlayLesson(index);
        });
    });

    audioPlayer.addEventListener('timeupdate', () => {
        if (!audioPlayer.duration) return;
        const { currentTime, duration } = audioPlayer;
        const progressPercent = (currentTime / duration) * 100;
        if (progressBar) progressBar.style.width = `${progressPercent}%`;
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
        title.addEventListener('click', function () {
            const module = this.parentElement;
            module.classList.toggle('expanded');

            // Quando expandir um módulo, recolhe os outros para um visual mais limpo
            if (module.classList.contains('expanded')) {
                moduleTitles.forEach(otherTitle => {
                    const otherModule = otherTitle.parentElement;
                    if (otherModule !== module) {
                        otherModule.classList.remove('expanded');
                    }
                });
            }
        });
    });

    // Função para carregar a aula com base no ID do fragmento da URL
    function loadLessonFromUrlHash() {
        console.log('Attempting to load lesson from URL hash...');
        const lessonIdFromHash = window.location.hash.substring(1); // Remove o # inicial

        if (lessonIdFromHash) {
            console.log('URL hash found:', lessonIdFromHash);
            let lessonToLoadIndex = -1;
            lessons.forEach((lesson, index) => {
                console.log(`Checking lesson ${index}: ID = ${lesson.dataset.lessonId}`); // DEBUG: Verifica cada lesson id
                if (lesson.dataset.lessonId === lessonIdFromHash) {
                    lessonToLoadIndex = index;
                }
            });

            if (lessonToLoadIndex !== -1) {
                console.log('Matching lesson found at index:', lessonToLoadIndex);
                loadAndPlayLesson(lessonToLoadIndex);
            } else {
                console.warn('Lesson ID from URL hash not found in playlist:', lessonIdFromHash);
            }
        } else {
            console.log('No URL hash found.');
        }
    }

    // Adicionar suporte para toggle do menu em dispositivos móveis
    const createMobileMenuToggle = () => {
        // Verifica se o botão já existe
        if (!document.querySelector('.menu-toggle')) {
            const menuToggle = document.createElement('button');
            menuToggle.className = 'menu-toggle control-btn'; // Mantemos control-btn para herdar alguns estilos base
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            menuToggle.setAttribute('aria-label', 'Abrir menu');
            menuToggle.setAttribute('aria-expanded', 'false');

            // const navigation = document.querySelector('.navigation'); // Linha original comentada
            const mainHeader = document.querySelector('.main-header'); // Novo seletor

            if (mainHeader) { // Verifica se o .main-header existe
                mainHeader.prepend(menuToggle);

                menuToggle.addEventListener('click', () => {
                    const sidebar = document.querySelector('.sidebar');
                    const isOpen = sidebar.classList.toggle('open');
                    menuToggle.setAttribute('aria-expanded', isOpen.toString());

                    // Adiciona overlay quando o menu estiver aberto
                    let overlay = document.querySelector('.sidebar-overlay');
                    if (sidebar.classList.contains('open')) {
                        if (!overlay) {
                            overlay = document.createElement('div');
                            overlay.className = 'sidebar-overlay';
                            document.body.appendChild(overlay);

                            overlay.addEventListener('click', () => {
                                sidebar.classList.remove('open');
                                menuToggle.setAttribute('aria-expanded', 'false');
                                overlay.remove();
                            });
                        }
                        document.body.style.overflow = 'hidden'; // Impede o scroll do body quando o menu está aberto
                    } else if (overlay) {
                        overlay.remove();
                        document.body.style.overflow = ''; // Restaura o scroll do body
                    }
                });
            } else {
                console.warn('.main-header element not found for menu toggle.');
            }
        }
    };

    // Detectar se é dispositivo móvel e adicionar o toggle
    const checkMobileView = () => {
        const sidebar = document.querySelector('.sidebar');
        const menuToggle = document.querySelector('.menu-toggle');

        if (window.innerWidth <= 768) {
            createMobileMenuToggle(); // Garante que o botão seja criado se não existir
            // A visibilidade do botão é controlada pelo CSS

            // Adiciona evento de fechamento do menu ao clicar em uma aula em dispositivo móvel
            lessons.forEach(lesson => {
                lesson.addEventListener('click', () => {
                    if (sidebar && sidebar.classList.contains('open')) {
                        sidebar.classList.remove('open');
                        if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
                        const overlay = document.querySelector('.sidebar-overlay');
                        if (overlay) overlay.remove();
                        document.body.style.overflow = ''; // Restaura o scroll do body
                    }
                });
            });
        } else {
            // Se a tela for maior que 768px e o menu estiver aberto, feche-o
            if (sidebar && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
                const overlay = document.querySelector('.sidebar-overlay');
                if (overlay) overlay.remove();
                document.body.style.overflow = ''; // Restaura o scroll do body
            }
        }
    };

    // Verifica na inicialização e ao redimensionar
    checkMobileView();
    window.addEventListener('resize', checkMobileView);

    // Tenta carregar uma aula a partir do hash da URL na inicialização
    loadLessonFromUrlHash();

    // Adiciona um listener para o evento hashchange
    window.addEventListener('hashchange', loadLessonFromUrlHash);

    // Após a tentativa de carregar via hash, verifica se é preciso carregar o README
    setTimeout(() => {
        // Só carrega o README se nenhuma aula foi carregada via hash E não há áudio no player
        if (currentLessonIndex === -1 && (!audioPlayer.currentSrc || audioPlayer.currentSrc === window.location.href)) {
            loadReadmeAsDefault();
        }
    }, 50); // Pequeno delay para garantir que o carregamento via hash tente primeiro

    // Função para carregar o README.md como conteúdo padrão
    function loadReadmeAsDefault() {
        console.log("No lesson loaded via hash, attempting to load README.md as default content.");

        // Atualiza a UI para indicar "Bem-vindo" ou "README"
        currentLessonTitleEl.textContent = "Bem-vindo ao Algorithm Player!";
        currentModuleTitleEl.textContent = "Visão Geral do Projeto";
        miniLessonTitleEl.textContent = "Bem-vindo!";
        miniModuleTitleEl.textContent = "Projeto";

        // Atualiza o ícone/cover padrão
        const defaultIcon = '👋'; // Ícone de boas-vindas
        const lessonCovers = document.querySelectorAll('.lesson-cover');
        lessonCovers.forEach(cover => {
            cover.innerHTML = `<span style="font-size: 48px;">${defaultIcon}</span>`;
        });

        // Limpa o estado do player de áudio
        if (audioPlayer) {
            audioPlayer.pause();
            audioPlayer.src = ''; // Remove a fonte do áudio
            if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i>';
            isPlaying = false;
            if (currentTimeEl) currentTimeEl.textContent = '0:00';
            if (durationEl) durationEl.textContent = '0:00';
            if (progressBar) progressBar.style.width = '0%';
        }

        const readmePath = JEKYLL_BASEURL + '/README.md';

        fetch(readmePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch README.md: ${response.statusText} (URL: ${response.url})`);
                }
                return response.text();
            })
            .then(markdownContent => {
                if (typeof marked !== 'undefined') {
                    readingMaterialDiv.innerHTML = marked.parse(markdownContent);
                    enhanceCodeBlocks(); // Se o README tiver blocos de código
                } else {
                    const pre = document.createElement('pre');
                    pre.textContent = markdownContent;
                    readingMaterialDiv.innerHTML = ''; // Limpa conteúdo anterior
                    readingMaterialDiv.appendChild(pre);
                }
                materialLink.classList.add('hidden'); // Esconde link de material específico
            })
            .catch(error => {
                console.error("Error loading README.md:", error);
                readingMaterialDiv.innerHTML = "<p>Conteúdo inicial não pôde ser carregado. Por favor, selecione uma aula na playlist para começar.</p>";
            });
    }

    // Expandir o primeiro módulo por padrão
    if (moduleTitles.length > 0) {
        moduleTitles[0].parentElement.classList.add('expanded');
    }

    // Código para adicionar botão de compartilhamento no player
    const playerRight = document.querySelector('.player-right');
    if (playerRight) {
        const shareButton = document.createElement('button');
        // Adiciona uma classe mais específica para o botão de compartilhar do player
        shareButton.className = 'control-btn player-share-action-btn';
        shareButton.innerHTML = '<i class="fas fa-share-alt"></i>';
        shareButton.title = 'Compartilhar aula'; // Adiciona um tooltip

        shareButton.addEventListener('click', () => {
            // Lógica de copiar URL para a área de transferência (sem Web Share API)
            const urlToCopy = window.location.href;
            navigator.clipboard.writeText(urlToCopy).then(() => {
                showToast('Link da aula copiado!'); // Usa a função toast
            }).catch(err => {
                console.error('Erro ao copiar link da aula:', err);
                // Fallback para métodos antigos, se necessário
                // Exemplo de fallback antigo:
                // const tempInput = document.createElement('input');
                // tempInput.value = window.location.href;
                // document.body.appendChild(tempInput);
                // tempInput.select();
                // document.execCommand('copy');
                // document.body.removeChild(tempInput);
                // showToast('Link copiado para a área de transferência!');
            });
        });

        // Insere antes do controle de volume
        const volumeControl = playerRight.querySelector('.control-btn#mute-btn'); // Usa o ID para ser mais específico
        if (volumeControl) {
            playerRight.insertBefore(shareButton, volumeControl);
        } else {
            // Adiciona ao final se o botão de mudo não for encontrado (improvável, mas seguro)
            playerRight.appendChild(shareButton);
        }
    }

    // Função para exibir uma notificação toast
    function showToast(message) {
        // Remove toasts existentes para evitar sobreposição
        const existingToasts = document.querySelectorAll('.toast-notification');
        existingToasts.forEach(toast => toast.remove());

        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        document.body.appendChild(toast);

        // Força reflow para garantir que a transição CSS funcione
        void toast.offsetWidth;

        // Adiciona classe para iniciar a animação (aparecer)
        toast.classList.add('show');

        // Remove o toast após alguns segundos
        setTimeout(() => {
            toast.classList.remove('show');
            // Remove o elemento do DOM após a transição (tempo da transição + um pequeno delay)
            toast.addEventListener('transitionend', () => toast.remove());
        }, 3000); // Mantém o toast visível por 3 segundos
    }

    // Adiciona estilos CSS necessários para o overlay, toast E highlighting de código aprimorado
    const style = document.createElement('style');
    style.textContent = `
        /* Estilos existentes para overlay, share-container, share-btn, btn-next-material */
        .sidebar-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 999;
        }
        
        /* Estilos para o botão de compartilhar no material */
        .share-container {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 16px;
        }
        
        /* Estilos para os botões de compartilhar */
        .share-btn {
            background-color: rgba(40, 40, 40, 0.7);
            color: var(--text-secondary);
            border: none;
            border-radius: 20px;
            padding: 8px 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s ease;
        }
        
        .share-btn:hover {
            background-color: var(--primary-color);
            color: var(--dark-bg);
        }
        
        /* Estilos para o botão de próxima aula no material */
        .btn-next-material {
            background-color: var(--primary-color);
            color: var(--dark-bg);
            border: none;
            border-radius: 20px;
            padding: 10px 20px;
            cursor: pointer;
            font-weight: 500;
            margin-top: 16px;
            transition: all 0.2s ease;
        }
        
        .btn-next-material:hover {
            background-color: #4df287;
            transform: scale(1.05);
        }

        /* ESTILOS PROFISSIONAIS PARA HIGHLIGHTING DE CÓDIGO */
        .code-keyword {
            color: #ff79c6;
            font-weight: 700;
        }
        
        .code-string {
            color: #50fa7b;
            font-weight: 500;
        }
        
        .code-template {
            color: #f1fa8c;
            font-weight: 500;
        }
        
        .code-comment {
            color: #6272a4;
            font-style: italic;
            opacity: 0.9;
        }
        
        .code-function {
            color: #8be9fd;
            font-weight: 600;
        }
        
        .code-property {
            color: #ffb86c;
            font-weight: 500;
        }
        
        .code-number {
            color: #bd93f9;
            font-weight: 600;
        }
        
        .code-hex {
            color: #ff5555;
            font-weight: 600;
        }
        
        .code-operator {
            color: #ff5555;
            font-weight: 700;
        }
        
        .code-bracket {
            color: #f8f8f2;
            font-weight: 700;
        }

        /* NUMERAÇÃO DE LINHAS E LAYOUT PROFISSIONAL */
        .code-container {
            display: flex;
            background: #282a36;
            border-radius: 6px;
            overflow: hidden;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
            font-size: 14px;
            line-height: 1.5;
        }

        .line-numbers {
            background: #21222c;
            color: #6272a4;
            padding: 16px 12px 16px 16px;
            text-align: right;
            border-right: 1px solid #44475a;
            user-select: none;
            min-width: 40px;
        }

        .line-number {
            display: block;
            font-size: 12px;
            font-weight: 500;
            line-height: 1.5;
        }

        .code-content {
            flex: 1;
            padding: 16px;
            overflow-x: auto;
            background: #282a36;
        }

        .code-line {
            white-space: pre;
            line-height: 1.5;
            min-height: 21px;
        }

        .code-line:empty {
            min-height: 21px;
        }

        /* Melhoria nos containers de código */
        .code-example {
            margin: 20px 0;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .code-example-title {
            background: linear-gradient(135deg, #282a36 0%, #44475a 100%);
            padding: 12px 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .code-example-title span:first-child {
            font-weight: 600;
            color: #f8f8f2;
        }

        .code-language {
            background-color: rgba(80, 250, 123, 0.2);
            color: #50fa7b;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .copy-code-btn {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: #f8f8f2;
            padding: 6px 8px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .copy-code-btn:hover {
            background-color: var(--primary-color);
            color: var(--dark-bg);
        }

        /* Melhoria no estilo do código propriamente dito */
        .code-example pre {
            margin: 0;
            background: #282a36;
            padding: 16px;
            overflow-x: auto;
            line-height: 1.5;
        }

        .code-example code {
            color: #f8f8f2;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 14px;
        }

        /* NOVOS ESTILOS PARA O TOAST */
        .toast-notification {
            position: fixed;
            bottom: 110px; /* Acima do player */
            left: 50%;
            transform: translateX(-50%);
            background-color: var(--primary-color);
            color: var(--dark-bg);
            padding: 12px 20px;
            border-radius: 4px;
            z-index: 1000; /* Acima de outros elementos */
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
            font-size: 14px;
        }

        .toast-notification.show {
            opacity: 1;
            visibility: visible;
        }

        @media (max-width: 576px) {
             .toast-notification {
                 bottom: 140px; /* Ajuste para mobile se o player for mais alto */
                 width: 90%;
                 text-align: center;
             }
        }

        /* Estilo específico para o botão de compartilhar NO PLAYER */
        .player-share-action-btn:active {
            background-color: var(--primary-color) !important; /* Fundo verde no clique */
            color: var(--dark-bg) !important; /* Ícone escuro no clique, !important para sobrescrever .control-btn:active */
        }
    `;
    document.head.appendChild(style);

    // Função para atualizar a barra visual de volume e o ícone do botão de mudo
    function updateVolumeUI() {
        if (!audioPlayer || !volumeSlider || !volumeBarVisual || !muteBtn) return;

        const volume = audioPlayer.volume; // Valor entre 0 e 1
        const isMuted = audioPlayer.muted || volume === 0;

        // Atualiza a barra visual (convertendo volume de 0-1 para 0-100 para a largura)
        volumeBarVisual.style.width = `${volume * 100}%`;

        // Atualiza o ícone do botão de mudo
        if (isMuted) {
            muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else if (volume > 0.5) {
            muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else if (volume > 0) {
            muteBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
        } else {
            muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
        // Garante que o slider reflita o volume correto, mesmo que mudado por outro meio (como mudo)
        if (!audioPlayer.muted) {
            volumeSlider.value = volume * 100;
        }
    }

    // Event Listeners para controle de volume

    // Mudo/Desmudo pelo botão
    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            if (audioPlayer) {
                audioPlayer.muted = !audioPlayer.muted;
                // A UI será atualizada pelo evento 'volumechange' no audioPlayer
            }
        });
    }

    // Controle de volume pelo slider
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            if (audioPlayer) {
                // Converte o valor do slider (0-100) para o volume do áudio (0-1)
                const newVolume = e.target.value / 100;
                audioPlayer.volume = newVolume;

                // Ao mover o slider, desmuta o áudio
                if (audioPlayer.muted && newVolume > 0) {
                    audioPlayer.muted = false;
                }
                // A UI será atualizada pelo evento 'volumechange' no audioPlayer
            }
        });
    }

    // Atualizar a UI quando o volume do áudio mudar (garante sincronia)
    if (audioPlayer) {
        audioPlayer.addEventListener('volumechange', updateVolumeUI);

        // Inicializar a UI de volume/mudo quando a página carregar
        // Use um pequeno delay para garantir que o audioPlayer esteja pronto
        audioPlayer.onloadedmetadata = () => {
            // Define um volume inicial se necessário (opcional, o HTML já tem value=50)
            // audioPlayer.volume = 0.5;
            updateVolumeUI();
        };
        // Fallback caso onloadedmetadata não seja disparado rapidamente (ex: áudio em cache)
        setTimeout(updateVolumeUI, 100);
    }

    // Evento para o ícone do GitHub no player
    const githubPlayerIcon = document.getElementById('github-player-icon');
    if (githubPlayerIcon) {
        const githubUrl = githubPlayerIcon.dataset.url;
        if (githubUrl) {
            githubPlayerIcon.addEventListener('click', () => {
                window.open(githubUrl, '_blank', 'noopener,noreferrer');
                githubPlayerIcon.blur(); // Remove o foco após o clique
            });
            // Adiciona acessibilidade para tecla Enter
            githubPlayerIcon.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    window.open(githubUrl, '_blank', 'noopener,noreferrer');
                    githubPlayerIcon.blur(); // Remove o foco após o Enter
                }
            });
        }
    }
}); 