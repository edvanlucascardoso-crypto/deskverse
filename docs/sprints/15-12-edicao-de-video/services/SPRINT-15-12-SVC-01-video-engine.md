# SPRINT-15-12-SVC-01 — Serviço de vídeo headless

**Depende de:** fundação de filas, storage, assets e segurança concluída.
**Não bloqueia:** nenhuma sprint do MVP.

## Objetivo

Implantar no Railway o API/MCP privado do engine de vídeo, com workers CPU para FFmpeg, proxy e preview; jobs GPU/RENDER são despachados a endpoints RunPod Serverless. O agente envia operações estruturadas; o engine as executa.

## Aceite

- Ingestão, preview e render usam URLs assinadas e são canceláveis/idempotentes.
- GPU é acionada somente pelo scheduler, em endpoint RunPod Serverless, atrás de `WorkerExecutionProvider`; o Railway mantém a tarefa, lease, orçamento e reconciliação.
- Projetos, versões e lineage persistem mesmo se worker cair.
