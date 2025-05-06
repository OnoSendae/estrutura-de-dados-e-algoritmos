const { processarArquivosWav } = require('./utils/converter-wav-para-mp3');

// Caminho base para buscar os arquivos WAV
const diretorioBase = path.resolve('./modulos-treinamento');

// Iniciar o processamento
const resultado = await processarArquivosWav(diretorioBase)
console.log(resultado)