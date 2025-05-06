import fs from 'fs-extra';
import path from 'path';

/**
 * Função para percorrer diretórios recursivamente e encontrar arquivos MP3
 * @param {string} directory - Diretório para iniciar a busca
 * @param {Array} mp3Files - Array para acumular os arquivos encontrados
 * @returns {Promise<Array>} - Lista de caminhos completos de arquivos MP3
 */
async function searchDirectories(directory, mp3Files = []) {
  const items = await fs.readdir(directory);
  
  for (const item of items) {
    const fullPath = path.join(directory, item);
    const stat = await fs.stat(fullPath);
    
    if (stat.isDirectory()) {
      // Se for um diretório, percorre recursivamente
      await searchDirectories(fullPath, mp3Files);
    } else if (stat.isFile() && path.extname(item).toLowerCase() === '.mp3') {
      // Se for um arquivo .mp3, adiciona à lista
      mp3Files.push(fullPath);
    }
  }
  
  return mp3Files;
}

/**
 * Remove um arquivo MP3
 * @param {string} filePath - Caminho completo do arquivo a ser removido
 * @returns {Promise<boolean>} - Sucesso da operação
 */
async function removeFile(filePath) {
  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    console.error(`Erro ao remover ${path.basename(filePath)}:`, error.message);
    return false;
  }
}

/**
 * Função principal para remover todos os arquivos MP3 em um diretório
 * @param {string} baseDirectory - Diretório base para iniciar a procura
 * @param {Object} options - Opções adicionais
 * @param {boolean} options.simulate - Se true, apenas simula a remoção sem excluir arquivos
 * @returns {Promise<string>} - Mensagem de resultado
 */
export async function removeMp3Files(baseDirectory, options = {}) {
  const { simulate = false } = options;
  
  try {
    console.log('Iniciando busca por arquivos MP3...');
    const mp3Files = await searchDirectories(baseDirectory);
    
    if (mp3Files.length === 0) {
      console.log('Nenhum arquivo MP3 encontrado.');
      return 'Nenhum arquivo MP3 encontrado';
    }
    
    console.log(`Encontrados ${mp3Files.length} arquivos MP3.`);
    
    if (simulate) {
      console.log('Modo simulação: nenhum arquivo será removido.');
      mp3Files.forEach(file => {
        console.log(`Simulando remoção: ${path.basename(file)}`);
      });
      return `Simulação concluída: ${mp3Files.length} arquivos seriam removidos`;
    }
    
    console.log('Iniciando remoção dos arquivos...');
    
    let successfullyRemoved = 0;
    let failures = 0;
    
    for (let i = 0; i < mp3Files.length; i++) {
      const file = mp3Files[i];
      console.log(`Removendo [${i+1}/${mp3Files.length}]: ${path.basename(file)}`);
      
      const success = await removeFile(file);
      if (success) {
        successfullyRemoved++;
      } else {
        failures++;
      }
    }
    
    console.log('Processo concluído!');
    return `Remoção concluída: ${successfullyRemoved} arquivos removidos com sucesso, ${failures} falhas`;
  } catch (error) {
    console.error('Erro durante o processamento:', error);
    return `Erro: ${error.message}`;
  }
}

// Exemplo de uso:
// import { removeMp3Files } from './remove-mp3-files.js';
// 
// // Para apenas simular a remoção (listar arquivos sem remover)
// removeMp3Files('./src/modulos-treinamento', { simulate: true });
// 
// // Para remover efetivamente
// removeMp3Files('./src/modulos-treinamento'); 