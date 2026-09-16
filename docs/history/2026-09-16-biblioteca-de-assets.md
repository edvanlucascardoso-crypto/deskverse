# Biblioteca de Assets do workspace antes da criação dos agentes

## Data e escopo

- Data: 16/09/2026
- Escopo: biblioteca compartilhada de assets, descrições de uso, referências para agentes, storage vigente e ordem da Fase 08.
- Origem: solicitação de produto para que o usuário monte uma biblioteca reutilizável antes da criação dos agentes.

## Estado anterior

- O roadmap exigia storage e uma tela de consulta de arquivos/entregas antes da Fase 10, mas não tinha uma superfície para o usuário cadastrar assets próprios.
- O histórico de 16/09/2026 definia referências anexadas ao pedido e estados de compreensão, mas não especificava uma biblioteca persistente de workspace com descrição de uso.
- A SPRINT-08-01 era a primeira sprint da Fase 08 e a SPRINT-08-02 permanecia responsável pela tela de arquivos dos trabalhos dos agentes.

## Novo estado

- A SPRINT-08-00 — Biblioteca de Assets do workspace foi inserida antes de `SPRINT-08-01` e `SPRINT-08-02`.
- A Fase 08 passa a ter 9 sprints. A SPRINT-08-00 é requisito obrigatório antes da criação dos agentes da Fase 10 e do Gate A0.
- O usuário pode cadastrar áudio, vídeo, imagem, documento, planilha, texto e outros formatos suportados no UploadThing vigente.
- Cada asset exige descrição escrita pelo usuário, incluindo finalidade e orientação de como/quando usar. A descrição entra no contexto do agente como informação autoral e rastreável.
- A biblioteca é compartilhada no escopo do workspace para agentes e membros autorizados; não é uma publicação na internet.
- O asset é reutilizado por referência e versão, sem duplicar bytes. Arquivo, descrição, permissões, processamento, compreensão e alterações permanecem rastreáveis no banco e no histórico.
- A SPRINT-08-02 continua sendo uma tela de consulta das entregas dos agentes; upload e edição do usuário ficam na SPRINT-08-00.

## Impacto no produto e arquitetura

- `AssetStorage`/`AssetRepository` continuam sendo as fronteiras de acesso; UploadThing permanece como storage atual.
- O modelo persistente deverá suportar `workspaceId`, descrição, finalidade, versão, checksum, origem, permissão, estado de compreensão e vínculo com pedido/tarefa/agente, com migration Prisma quando implementado.
- O contexto dos agentes deve distinguir descrição do usuário, metadados, conteúdo compreendido, conteúdo apenas armazenado e falha de processamento.
- A biblioteca não cria um segundo tipo de agente, não muda o modelo `SOLO`/`COLLABORATION` e não torna qualquer agente proprietário do asset.

## Decisões em aberto

- Allowlist final de MIME, limites por arquivo, retenção e política para versões revogadas.
- Permissões exatas de membros, agentes e tarefas para leitura, edição da descrição e criação de versão.
- Formatos que terão compreensão automática no primeiro gate, além de PDF, DOCX, TXT, CSV e XLSX.
- Se o usuário poderá informar tags estruturadas além da descrição obrigatória.

## Fora do escopo

- Publicação externa, compartilhamento entre workspaces e novo provedor de armazenamento.
- Interpretação semântica de áudio, vídeo ou música.
- Implementação de runtime nesta alteração documental.

## Relações

- Complementa [2026-09-16-modelo-de-agentes-e-referencias.md](2026-09-16-modelo-de-agentes-e-referencias.md).
- Relaciona-se à [SPRINT-08-00](../sprints/08-work-and-human-loop/SPRINT-08-00.md), à [SPRINT-08-02](../sprints/08-work-and-human-loop/SPRINT-08-02.md) e aos contratos de storage das SPRINT-07-02 e SPRINT-07-04.
