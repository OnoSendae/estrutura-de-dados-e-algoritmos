# Processo de Migração

## Visão Geral

Este documento descreve o processo de migração da estrutura antiga para a nova estrutura padronizada.

## Fases da Migração

### Fase 1: Análise
- Mapeamento da estrutura atual
- Identificação de problemas
- Geração de relatórios

### Fase 2: Backup
- Backup completo do projeto
- Backup seletivo por categoria
- Verificação de integridade

### Fase 3: Criação da Estrutura
- Criação de diretórios padronizados
- Templates de arquivos
- Estrutura de documentação

### Fase 4: Migração de Conteúdo
- Movimentação de arquivos .md
- Padronização de nomenclatura
- Organização por subdiretórios

### Fase 5: Migração de Mídia
- Centralização de arquivos de áudio
- Organização por módulo
- Otimização de formatos

### Fase 6: Atualização de Configurações
- Novo arquivo modules.yml
- Atualização do _config.yml
- Ajustes no frontend

### Fase 7: Validação
- Verificação de integridade
- Testes de funcionalidade
- Relatório final

## Rollback

Em caso de problemas, utilize:

```bash
scripts/migration/migrate.sh --rollback=BACKUP_ID
```

## Suporte

Para questões sobre a migração, consulte os logs em `_backup/`.
