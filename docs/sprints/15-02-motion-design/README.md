# Grupo técnico — Motion Design e Motion MCP

Este grupo detalha a implementação técnica da `SPRINT-15-02` e tem como fonte de produto o [PRD-15-02-MOTION-MCP](PRD-15-02-MOTION-MCP.md). Não cria um novo agente, uma nova fila, um novo storage ou uma nova arquitetura de autenticação.

Os registros de integração compartilhados ficam em [INTEGRATION_REQUIREMENTS.md](INTEGRATION_REQUIREMENTS.md). Cada sprint deve apontar evidências e pendências nesse arquivo antes de mudar de estado.

## Ordem

1. `SPRINT-15-02-SPIKE-01` — Premation boundary, licença e execução headless.
2. `SPRINT-15-02-01` — Documento canônico e adapter mínimo da engine.
3. `SPRINT-15-02-02` — MCP, resources, transactions e histórico.
4. `SPRINT-15-02-SVC-01` — Serviço privado de MCP no Railway, com jobs GPU/RENDER despachados ao RunPod Serverless.
5. `SPRINT-15-02-03` — Preview, render, assets e eventos operacionais.
6. `SPRINT-15-02-04` — Especialista, loop visual, aprovação e PoC.

## Dependências e posição no roadmap

- O Spike é atemporal: pode começar após a disponibilidade da base de plataforma e do checkout fixado do Premation. Ele não bloqueia o Gate A0.
- As sprints de implementação são pós-MVP e dependem das Fases 07, 08, 09 e 14 conforme indicado em cada documento. A SVC é o contrato operacional do gateway MCP e deve estar pronta antes do render remoto de `SPRINT-15-02-03`.
- `SPRINT-15-02` continua sendo a sprint funcional canônica do agente futuro. Este grupo separa o risco técnico sem renumerar fases nem alterar a ordem da Fase 10.
- A SVC é subordinada à sprint funcional e não duplica critérios de produto. Ela define apenas deploy, segurança, contrato operacional e observabilidade.

## Contratos preservados

- `AgentRuntime`/Eve, `InferenceGateway`/Vercel AI Gateway e `WorkerExecutionProvider` continuam interfaces do Deskverse.
- UploadThing continua o storage de artefatos do MVP; PostgreSQL/Prisma continua fonte de metadados, versões, lineage e autorização.
- Redis/scheduler transporta filas; a política de prioridade, fairness, lease, retry e cancelamento pertence ao Deskverse.
- O MCP é interno ao agente e não ganha painel público no canvas.
