# SPRINT-15-12-SVC-01 — Serviço de vídeo headless

**Depende de:** fundação de filas, storage, assets e segurança concluída.  
**Não bloqueia:** nenhuma sprint do MVP.

## Objetivo

Implantar no Northflank o API/MCP privado do engine de vídeo, com workers CPU/GPU para FFmpeg, proxy, preview e render final. O agente envia operações estruturadas; o engine as executa.

## Aceite

- Ingestão, preview e render usam URLs assinadas e são canceláveis/idempotentes.
- GPU é acionada somente pelo scheduler, nos workers do Northflank, atrás de `WorkerExecutionProvider`.
- Projetos, versões e lineage persistem mesmo se worker cair.
