# Checkpoint 1 — Fase 07 Onboarding e Conhecimento

**Data de corte:** 16/09/2026
**Escopo:** Fase 07, SPRINT-07-01 a SPRINT-07-07, incluindo o ciclo de vida explícito do RAG.
**Status consolidado:** `COMPLETE_WITH_INTEGRATION_REQUIREMENTS`
**Próxima prioridade:** `SPRINT-08-00 — Biblioteca de Assets do workspace`

## Leitura executiva

A Fase 07 entregou o primeiro caminho de contexto do Deskverse: o usuário envia um original, acompanha a conversão, responde ao onboarding, revisa conflitos e consulta apenas evidências autorizadas. A conversão ocorre antes do RAG: PDF e DOCX viram Markdown, XLSX/XLS viram CSV por planilha e Markdown tabular, e áudio só vira fonte depois de Whisper + revisão pelo `gpt-5.6-luna` com raciocínio `medium`.

O RAG agora tem ciclo de vida explícito por workspace. A pessoa autorizada pode apagar chunks/embeddings e criar uma nova geração com confirmação obrigatória, apagar completamente o índice preservando os arquivos de origem, ou substituir apenas a indexação de um arquivo pronto. Os estados e a auditoria deixam claro quando a busca está disponível, construindo, vazia ou bloqueada por falha.

## Entregas por sprint

### SPRINT-07-01 — Filas de trabalho e jobs assíncronos

Entregou o contrato de fila, leases, heartbeat, retry, espera humana, dead-letter, cancelamento em cascata e jobs de conhecimento. A cadeia de áudio agora inclui `DOCUMENT_TRANSCRIBE` e `DOCUMENT_POLISH` antes de normalização; o adapter local permanece uma demonstração determinística.

### SPRINT-07-02 — Upload e armazenamento de arquivos

Entregou upload autenticado, metadados, checksum, versionamento, armazenamento privado no UploadThing e remoção protegida. O original nunca é substituído pelo Markdown/CSV derivado e continua separado do índice vetorial.

### SPRINT-07-03 — Fluxo de onboarding

Entregou perguntas curtas, progresso, retomada, resumo inicial, persistência em `OnboardingSession` e auditoria das respostas, sem transformar o onboarding em pipeline obrigatório de agentes.

### SPRINT-07-04 — Ingestão de documentos

Entregou os conversores e traces de PDF, DOCX, XLSX/XLS e texto, além dos adapters de Whisper e revisão via InferenceGateway. `WAITING_USER` é explícito quando falta a chave da OpenAI; nenhum áudio pendente gera evidência.

### SPRINT-07-05 — Busca semântica da base de conhecimento

Entregou chunks estruturais, embeddings por adapter, busca híbrida autorizada em PostgreSQL/pgvector, ausência de evidência e `RagIndex` com reconstrução, limpeza total e substituição por arquivo.

### SPRINT-07-06 — Conflitos e confiança das informações

Entregou fatos, conflitos, confiança, revisão humana e auditoria de decisões, mantendo fatos não verificados fora da camada de verdade confirmada.

### SPRINT-07-07 — Perfil da marca e contexto de trabalho

Entregou `BrandProfile`, readiness, regras verificadas e composição do contexto derivado do onboarding e das decisões revisadas.

## Evidências de validação

- `yarn test`: 15 arquivos e 46 testes aprovados.
- `yarn lint`: aprovado.
- `yarn typecheck`: aprovado com geração do Prisma Client.
- `yarn db:validate`: schema Prisma válido.
- `yarn next build` com valores locais de `BETTER_AUTH_URL`/`BETTER_AUTH_SECRET`: build Next 16.3.4/Turbopack aprovado, incluindo as rotas de conhecimento e RAG.
- `yarn test:e2e --grep "onboarding and knowledge"`: 2 testes aprovados, Chromium desktop e mobile; a execução completa anterior do projeto também terminou com 22 testes aprovados.
- Conversores e pipeline cobrem PDF, DOCX, XLSX/XLS, Whisper fake, revisão Luna `medium`, bloqueio de áudio sem chave, chunks e confirmações destrutivas.

## Integrações pendentes e riscos

1. Aplicar em banco limpo e no Neon as migrations `20260916130000_onboarding_knowledge` e `20260916150000_rag_index_lifecycle`. `yarn db:status`/`yarn build` com deploy de migration foram impedidos pelo erro Windows `P1011: Error opening a TLS connection: Credenciais não disponíveis no pacote de segurança (os error -2146893042)`.
2. Executar smoke de UploadThing com token, ACL privada, URL assinada e remoção; o SDK está instalado, mas não foi criado arquivo real no storage externo.
3. Configurar Redis/worker, checkpoints, OCR de PDF escaneado e embeddings produtivos atrás de adapters.
4. Configurar `OPENAI_API_KEY` e validar Whisper + InferenceGateway em ambiente controlado; a exceção solicitada pelo usuário para não testar áudio sem chave foi respeitada.
5. Validar dois workspaces, restore, concorrência de rebuild, idempotência, dimensões de vetor, custo e recall.

## Explicitamente fora deste checkpoint

Interpretação semântica de vídeo/música, publicação externa, billing, agentes do MVP, Eve em produção, notificações realtime, canais sociais, convites e biblioteca de assets da SPRINT-08-00. O RAG não substitui os arquivos originais e a limpeza do índice não remove material de origem.

## Documentos-fonte

- [AGENTS.md](../../AGENTS.md)
- [README do produto](../../README.md)
- [Status das sprints](../SPRINT_STATUS.md)
- [Manifesto de sprints](../00-meta/SPRINT_MANIFEST.json)
- [Instruções do Supervisor](../00-meta/SUPERVISOR_PROMPT.md)
- [README da Fase 07](../07-onboarding-knowledge/README.md)
- [Requisitos de integração da Fase 07](../07-onboarding-knowledge/INTEGRATION_REQUIREMENTS.md)
- [Serviços externos da Fase 07](../07-onboarding-knowledge/EXTERNAL_SERVICES.md)
- [Relatório da SPRINT-07-05](../07-onboarding-knowledge/SPRINT-07-05-COMPLETION.md)
