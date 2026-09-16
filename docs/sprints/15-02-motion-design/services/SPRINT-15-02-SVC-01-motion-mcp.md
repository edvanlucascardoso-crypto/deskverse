# SPRINT-15-02-SVC-01 — Serviço privado de Motion MCP e render

**Serviço:** `deskverse-mcp-media` ou nome final aprovado pelo Supervisor
**Owner:** `SPRINT-15-02`
**Fase:** 15 — Agentes Futuros
**Status inicial:** PLANNED
**Runtime:** Railway para gateway/API e workers CPU; RunPod Serverless para jobs GPU/RENDER
**Classes físicas:** `CPU` para probe/thumbnail/encode leve; `RENDER` para composição; `GPU` somente após profile aprovado
**Bloqueia o MVP de agentes:** não
**Ordem:** contrato/gateway antes do render remoto de `SPRINT-15-02-03`

## Objetivo

Definir o contrato operacional do serviço externo que hospeda o MCP privado e o worker de preview/render, sem duplicar regras de produto, autenticação, storage ou fila do Deskverse.

## Dependências e fallback

- Requer `SPRINT-15-02-SPIKE-01` para escolher o runtime headless.
- Requer `SPRINT-09-03`, `09-04`, `09-05`, `09-06`, `SPRINT-07-02`, `SPRINT-08-02` e segurança da Fase 14 para produção.
- Não entra no Gate A0 e não bloqueia os agentes do MVP.
- Enquanto indisponível, o editor pode oferecer preview local/fixture e o job remoto deve entrar em `RETRY_SCHEDULED` com código `RENDER_SERVICE_UNAVAILABLE`, ou `FAILED` após o limite; nunca simular output confirmado.

O serviço deve ser desenhado como capability compartilhável para `SPRINT-15-12` e `SPRINT-15-13` quando seus contratos forem compatíveis. O owner inicial não autoriza criar um segundo MCP de mídia para vídeo ou VFX.

## Contrato de tool/API

O serviço aceita somente requests autenticados pelo audience próprio, com token delegado, `workspaceId` derivado do token, `projectId`, `revisionId`, `compositionId`, signed input URLs, renderer profile, output policy, budget, `traceId`, `taskId` e `idempotencyKey`.

Tools e resources expostos ao Deskverse são todos os definidos na sprint funcional, incluindo inspeção, `motion.document.apply`, transactions, preview, render e jobs. O serviço encaminha mutações de documento para a Motion Application API autenticada; o worker de render não acessa Neon diretamente. O serviço não expõe shell, filesystem, provider credential, database credential ou tool genérica de FFmpeg.

## Autorização e isolamento

- Validar issuer, audience, expiração, scopes, delegation, workspace, ownership, project/revision e budget.
- Permitir somente assets de URLs assinadas e outputs em destino assinado pelo Deskverse.
- Container sem privilégio, filesystem temporário, limite de tamanho, CPU, memória, tempo e processos filhos.
- Rede de saída bloqueada por padrão; permitir somente storage/telemetria necessários.
- Não persistir segredo no payload, log, trace ou resultado.
- Sanitizar SVG, fontes e metadata antes de entregar ao renderer.

## Fila e confiabilidade

- O serviço consome o QueueBackend/scheduler autenticado; não cria uma fila de negócio paralela.
- Cada job tem lease, heartbeat, timeout, attempt, idempotency key, checkpoint, cancelamento e dead-letter.
- Retry somente em falha técnica classificada; documento inválido, asset ausente e policy negada retornam falha semântica.
- Worker devolve `executionId`, progresso agregado, output refs, checksum, probe e renderer profile.
- Perda de heartbeat não confirma output; o scheduler decide retry/requeue.

## Storage e artefatos

- Inputs são URLs assinadas e referências `assetId/assetVersionId`.
- Outputs temporários ficam no volume efêmero do job.
- Outputs confirmados usam UploadThing no MVP por adapter autorizado; R2 é uma evolução para mídia pesada e não é habilitado nesta SVC sem decisão.
- O serviço devolve referência; Neon mantém metadata, lineage, versão, autorização e estado.

## Healthcheck e observabilidade

Healthcheck deve distinguir processo vivo de capacidade do renderer, storage e fila. Métricas mínimas:

- jobs recebidos, concluídos, falhos, cancelados e dead-letter;
- tempo em fila, execução, render por frame e upload;
- backend efetivo WebGPU/WebGL2/Canvas/Null;
- memória/CPU/GPU, timeout, retry, output verification e erro por capability;
- `workspaceId`, `runId`, `taskId`, `traceId`, `revisionId` e `idempotencyKey` correlacionados, com redaction.

## Critérios de aceite operacionais

- Deploy reproduzível por imagem versionada, healthcheck e configuração por ambiente.
- Um token de workspace A não acessa projeto/asset/job de workspace B.
- Replay da mesma idempotency key não gera dois outputs confirmados.
- Lease expirado e cancelamento não deixam processo órfão nem marcam sucesso.
- Output vazio, checksum divergente ou probe inválido são falhas explícitas.
- Não existe chamada direta do browser ao worker; toda tarefa passa por app/scheduler autorizado.
- Logs não contêm tokens, URLs assinadas completas ou binários.
- Rollback para a versão anterior do container não perde revisões do documento.

## Definition of Done

- Contrato aprovado pelo Supervisor e alinhado ao `WorkerExecutionProvider`.
- Container, variáveis, healthcheck, alertas, custos e runbook documentados.
- Testes de isolamento, auth, queue, retry, cancel, idempotência e output verification executados em staging.
- `blocksMvp: false` permanece registrado no manifesto.

## Estados e verificação de operação

Healthcheck e dashboards distinguem `loading`, `empty` (sem jobs), `error`, `success`, `WAITING_USER`, `WAITING_APPROVAL`, `RETRY_SCHEDULED`, cancelamento e `DEAD_LETTER`. Indisponibilidade do serviço é traduzida para estado geral de retry/falha com mensagem em pt-BR; não se cria um estado ad hoc fora do contrato de fila. O serviço não reporta pronto quando fila, renderer ou storage obrigatório estiver indisponível.

## Explicitamente fora desta SVC

GPU permanente, render farm, R2 obrigatório, editor visual público, modelo de inferência, storage de memória, autenticação própria, publicação em canais e suporte universal a codecs/efeitos.
