# SPRINT-08-02 — Painel de arquivos entregas e histórico de versões

**Fase:** 08 — Trabalho e Loop Humano
**Status inicial:** PLANNED
**Dependências:** SPRINT-08-01
**Superfície principal:** tela de arquivos dos projetos, artefato, versão e origem

## Objetivo

Entregar, antes da criação dos agentes do MVP, a tela dedicada de arquivos dos projetos com artefato, arquivo, versão e origem como uma fatia utilizável do produto. A implementação deve ligar o comportamento à experiência do workspace, deixando explícitos os estados que o usuário pode observar e as decisões que pertencem a outra fase.

## Tela de arquivos dos projetos

A tela deve permitir ao usuário consultar os trabalhos produzidos pelos agentes sem oferecer CRUD, upload manual, edição, exclusão ou alteração de metadados. Preview, abertura, download, busca, filtros, seleção e navegação para o projeto relacionado são operações de leitura.

Em desktop, usar a Data Table do shadcn/ui com paginação e busca. Cada linha deve permitir compreender, no mínimo, o arquivo ou preview, copy ou descrição do trabalho, projeto, tarefa relacionada, agente responsável, tipo, versão, status, tamanho, data de criação, última atualização, origem e próximo passo. A busca e a paginação devem funcionar sobre o conjunto de dados disponível, sem carregar uma coleção ilimitada na tela.

Em mobile, a tabela deve se transformar em uma lista de cards com os mesmos dados essenciais, hierarquia legível e ações de leitura equivalentes. Não usar uma tabela espremida nem exigir rolagem horizontal para acessar arquivo, copy, agente ou data.

## Upload dos trabalhos pelos agentes

Social Media, Copywriter, Designer e agentes posteriores enviam seus trabalhos ao UploadThing exclusivamente por tools autorizadas. A tool deve associar o upload ao projeto, plano ou tarefa, registrar metadados, criar versão quando aplicável e devolver o resultado para a tela somente depois da confirmação do backend.

O banco guarda a referência do arquivo, metadados, versão, origem e estado; o UploadThing guarda o conteúdo. Falhas de upload, arquivo ausente, retry, evento duplicado ou versão incompleta devem permanecer explícitos e recuperáveis, sem substituir silenciosamente um arquivo confirmado.

## Trabalho

1. Modelar o caminho principal de artefato, arquivo, versão e origem com dados mínimos e estados nomeados.
2. Criar a tela de arquivos dos projetos com Data Table do shadcn/ui, paginação, busca e estados de consulta.
3. Implementar a transformação responsiva da tabela em lista de cards no mobile, preservando as informações e ações de leitura.
4. Integrar UploadThing às tools de upload dos agentes, com vínculo ao projeto, metadados, versão, estado e origem.
5. Implementar o caminho feliz, loading, empty, error e success, incluindo recuperação.
6. Exibir origem, responsável, última atualização e próximo passo quando esses dados existirem.
7. Manter regras próximas da feature, com tipos locais e fixtures pequenas, sem criar uma abstração transversal prematura.
8. Registrar em integration-requirements dependências, decisões ou mocks que precisem de integração posterior.

## Regras essenciais

- Entregas apontam para arquivos e versões, mantendo origem, autor, data e motivo da alteração.
- Uma versão anterior pode ser consultada sem sobrescrever silenciosamente a atual.
- Falha de upload e arquivo ausente aparecem como estado recuperável.
- UploadThing é usado como armazenamento dos conteúdos; as referências e os metadados ficam rastreáveis no banco.
- O usuário somente consulta a tela; uploads e alterações de arquivo partem das tools dos agentes.

## Incluído

- Código funcional na superfície indicada.
- Fixtures locais ou persistência mínima necessária para demonstrar a sprint.
- Feedback de foco, seleção, erro, espera e conclusão.
- Relatório de conclusão com evidências e pendências.

## Não incluído

Escopo de fases posteriores, publicação externa, cobrança, dados inventados, engine visual paralela ou mudança silenciosa de produto.

## Entregáveis

Implementação, testes proporcionais ao risco, roteiro de demonstração e instruções para executar a validação local.

## Critérios de aceite

- O fluxo principal funciona do início ao fim.
- O painel de arquivos está disponível antes da criação dos agentes do MVP.
- Em desktop, a Data Table do shadcn/ui apresenta arquivo/preview, copy, projeto, agente, versão, status, datas e demais metadados com busca e paginação.
- Em mobile, a mesma consulta aparece como lista de cards acessível e sem rolagem horizontal.
- Um agente consegue enviar trabalho ao UploadThing por tool, vinculá-lo ao projeto e vê-lo na consulta somente após confirmação do backend.
- Usuários não têm controles de CRUD, upload manual ou edição de metadados nessa tela.
- Estados vazio, carregando, erro e sucesso são compreensíveis.
- A tela permanece utilizável com teclado e viewport estreita.
- Falhas parciais não apagam dados válidos nem deixam a interface travada.
- Não há dependência de WebGL, engine 3D, modelos legados, Stem ou jogo.
- Lint, typecheck e build passam.
- O relatório lista integrações pendentes e limites da entrega.

## Verificação

Executar instalação e scripts de qualidade, percorrer o fluxo no navegador e testar fixtures vazias, completas e com falha. Registrar a evidência no relatório da sprint.

## Critério de conclusão

## Motion e imersão

As transições devem ser fluidas, suaves e rápidas: comunicar causa, destino e estado sem criar espera artificial. O movimento deve preservar o contexto espacial e respeitar prefers-reduced-motion.

Usar COMPLETE quando todos os critérios forem demonstrados. Usar COMPLETE_WITH_INTEGRATION_REQUIREMENTS quando só restarem integrações registradas; manter bloqueios visíveis quando dependerem de uma decisão externa.
