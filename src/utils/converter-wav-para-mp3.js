const fs = require('fs-extra');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');

// Configurar o caminho para o binário do ffmpeg
ffmpeg.setFfmpegPath(ffmpegPath);

// Função para percorrer diretórios recursivamente e encontrar arquivos WAV
async function percorrerDiretorios(diretorio, arquivosWav = []) {
  const itens = await fs.readdir(diretorio);
  
  for (const item of itens) {
    const caminhoCompleto = path.join(diretorio, item);
    const stat = await fs.stat(caminhoCompleto);
    
    if (stat.isDirectory()) {
      // Se for um diretório, percorre recursivamente
      await percorrerDiretorios(caminhoCompleto, arquivosWav);
    } else if (stat.isFile() && path.extname(item).toLowerCase() === '.wav') {
      // Se for um arquivo .wav, adiciona à lista
      arquivosWav.push(caminhoCompleto);
    }
  }
  
  return arquivosWav;
}

// Função para converter WAV para MP3
function converterWavParaMp3(caminhoWav) {
  return new Promise((resolve, reject) => {
    const caminhoMp3 = caminhoWav.replace('.wav', '.mp3');
    
    ffmpeg(caminhoWav)
      .outputOptions('-ab', '128k') // bitrate de 128k
      .save(caminhoMp3)
      .on('end', () => {
        console.log(`Convertido: ${path.basename(caminhoWav)} -> ${path.basename(caminhoMp3)}`);
        resolve(caminhoMp3);
      })
      .on('error', (err) => {
        console.error(`Erro ao converter ${path.basename(caminhoWav)}:`, err.message);
        reject(err);
      });
  });
}

// Função principal para processar todos os arquivos WAV
async function processarArquivosWav(diretorioBase) {
  try {
    console.log('Iniciando busca por arquivos WAV...');
    const arquivosWav = await percorrerDiretorios(diretorioBase);
    
    if (arquivosWav.length === 0) {
      console.log('Nenhum arquivo WAV encontrado.');
      return;
    }
    
    console.log(`Encontrados ${arquivosWav.length} arquivos WAV. Iniciando conversão...`);
    
    for (let i = 0; i < arquivosWav.length; i++) {
      const arquivo = arquivosWav[i];
      console.log(`Convertendo [${i+1}/${arquivosWav.length}]: ${path.basename(arquivo)}`);
      await converterWavParaMp3(arquivo);
    }
    
    console.log('Processo concluído com sucesso!');
  } catch (erro) {
    console.error('Erro durante o processamento:', erro);
  }
}

module.exports = {
  processarArquivosWav
}