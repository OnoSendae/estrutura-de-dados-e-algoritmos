import fs from 'fs-extra';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';

// Configurar o caminho para o binário do ffmpeg
ffmpeg.setFfmpegPath(ffmpegPath);

// Função para percorrer diretórios recursivamente e encontrar arquivos WAV
async function searchDirectories(directory, wavFiles = []) {
  const items = await fs.readdir(directory);
  
  for (const item of items) {
    const fullPath = path.join(directory, item);
    const stat = await fs.stat(fullPath);
    
    if (stat.isDirectory()) {
      // Se for um diretório, percorre recursivamente
      await searchDirectories(fullPath, wavFiles);
    } else if (stat.isFile() && path.extname(item).toLowerCase() === '.wav') {
      // Se for um arquivo .wav, adiciona à lista
      wavFiles.push(fullPath);
    }
  }
  
  return wavFiles;
}

// Função para converter WAV para MP3 com opções avançadas de compressão
function convertWavToMp3(wavPath, options = {}) {
  return new Promise((resolve, reject) => {
    const {
      quality = 'medium',  // low, medium, high
      mono = false,
      sampleRate = null, // null = manter original
      customBitrate = null
    } = options;
    
    const mp3Path = wavPath.replace('.wav', '.mp3');
    const command = ffmpeg(wavPath);
    
    // Configurações baseadas no nível de qualidade
    if (customBitrate) {
      command.outputOptions('-ab', customBitrate);
    } else {
      // Usar VBR (Variable Bit Rate) para melhor compressão com qualidade
      switch (quality) {
        case 'low':
          command.outputOptions('-q:a', '5'); // VBR qualidade ~80-96kbps
          break;
        case 'medium': 
          command.outputOptions('-q:a', '3'); // VBR qualidade ~112-128kbps
          break;
        case 'high':
          command.outputOptions('-q:a', '1'); // VBR qualidade ~190-250kbps
          break;
      }
    }
    
    // Converter para mono se especificado
    if (mono) {
      command.outputOptions('-ac', '1');
    }
    
    // Ajustar taxa de amostragem se especificada
    if (sampleRate) {
      command.outputOptions('-ar', sampleRate);
    }
    
    command
      .save(mp3Path)
      .on('end', () => {
        console.log(`Convertido: ${path.basename(wavPath)} -> ${path.basename(mp3Path)}`);
        resolve(mp3Path);
      })
      .on('error', (err) => {
        console.error(`Erro ao converter ${path.basename(wavPath)}:`, err.message);
        reject(err);
      });
  });
}

// Função principal para processar todos os arquivos WAV
export async function processWavFiles(baseDirectory, conversionOptions = {}) {
  try {
    console.log('Iniciando busca por arquivos WAV...');
    const wavFiles = await searchDirectories(baseDirectory);
    
    if (wavFiles.length === 0) {
      console.log('Nenhum arquivo WAV encontrado.');
      return 'Nenhum arquivo WAV encontrado';
    }
    
    console.log(`Encontrados ${wavFiles.length} arquivos WAV. Iniciando conversão...`);
    
    const convertedFiles = [];
    for (let i = 0; i < wavFiles.length; i++) {
      const file = wavFiles[i];
      console.log(`Convertendo [${i+1}/${wavFiles.length}]: ${path.basename(file)}`);
      const mp3File = await convertWavToMp3(file, conversionOptions);
      convertedFiles.push(mp3File);
    }
    
    console.log('Processo concluído com sucesso!');
    return `Conversão concluída: ${convertedFiles.length} arquivos convertidos`;
  } catch (error) {
    console.error('Erro durante o processamento:', error);
    return `Erro: ${error.message}`;
  }
}