import { processWavFiles, removeMp3Files } from './utils/index.js';
import path from 'path';

// Caminho base para buscar os arquivos WAV
const diretorioBase = path.resolve('./src/modulos-treinamento');

// Iniciar o processamento
const iniciar = async () => {
// Opção 1: Modo simulação (apenas lista os arquivos sem remover)
// removeMp3Files(diretorioBase)//, { simular: true });

  const resultado = await processWavFiles(diretorioBase, {
                      quality: 'high',
                      mono: true,
                      sampleRate: 22050
                    });
                    
  console.log(resultado);
};

iniciar();