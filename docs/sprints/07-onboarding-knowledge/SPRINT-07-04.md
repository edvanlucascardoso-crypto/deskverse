# SPRINT-07-04 — Ingestão de documentos

**Fase:** 07 — Onboarding e Conhecimento
**Status inicial:** PLANNED
**Dependências:** SPRINT-07-03
**Superfície principal:** extração, normalização, falhas parciais e proveniência

## Objetivo

Entregar extração, normalização, falhas parciais e proveniência como uma fatia utilizável do produto. Documentos são convertidos para Markdown canônico antes de qualquer divisão em chunks ou geração de embeddings.

## Pipeline de normalização

`arquivo original no UploadThing → extração → Markdown canônico → validação → pronto para chunking`

- PDF, DOCX, PPTX, XLSX, TXT e HTML passam por um `DocumentNormalizer` atrás de adapter, sem amarrar o produto a uma biblioteca de conversão.
- Para PDFs, preservar página, título, hierarquia, listas, tabelas, links e imagens com referência; PDF escaneado entra em OCR e mantém a indicação de confiança.
- O Markdown canônico conserva `documentId`, `documentVersionId`, página, seção, offsets e checksum da extração.
- O original continua acessível para auditoria e download; Markdown e metadados são derivados versionados.
- Documento corrompido, protegido, sem texto extraível ou com OCR insuficiente não entra silenciosamente no RAG: fica em falha recuperável, com motivo e opção de reprocessar ou enviar nova versão.

## Trabalho

1. Converter o arquivo para Markdown canônico antes de indexar.
2. Persistir original, Markdown, versão, páginas/seções, checksum, origem e estado.
3. Implementar o caminho feliz, loading, empty, error e success, incluindo recuperação.
4. Exibir origem, responsável, última atualização e próximo passo quando esses dados existirem.
5. Registrar em integration-requirements dependências, decisões ou mocks que precisem de integração posterior.

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
- Um PDF textual e um PDF escaneado podem gerar Markdown rastreável ou uma falha recuperável, sem perder o arquivo original.
- Nenhum chunk ou embedding é criado antes do Markdown normalizado estar confirmado.
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
