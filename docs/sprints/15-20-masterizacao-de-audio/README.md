# Grupo 15-20 — Masterização de áudio

Agente profissional independente para diagnóstico técnico e melhoria não destrutiva de arquivos de áudio.

## Escopo do grupo

- `SPRINT-15-20` — contrato do agente, fluxo de pedido, diagnóstico, plano de processamento, aprovação e entrega de versões.
- `SPRINT-15-20-SVC-01` — tool/MCP privada de áudio, com adapter do Deskverse e workers CPU.

## Estado

- Status: planejada.
- Fase: 15 — Agentes futuros.
- Bloqueia o MVP/Gate A0: não.
- Não habilita interpretação semântica de música, vídeo ou áudio.

## Direção técnica

A primeira prova de conceito deve priorizar `@libraz/libsonare` em JavaScript/TypeScript + WASM. `@audio/dynamics` e `loudness-worklet` são alternativas/complementos para DSP e medição. FFmpeg/`ffmpeg.wasm` fica atrás do adapter para decode, probe, conversão e renderização quando necessário. O motor só será promovido depois de benchmark contra arquivos de referência e auditoria de licenças.

## Dependências

- SPRINT-07-02 e SPRINT-08-02 para referência anexada, storage, versões, permissões e acesso controlado.
- SPRINT-09-03 a SPRINT-09-08 para tools, filas, cancelamento, idempotência, workers e observabilidade.
- SPRINT-14-01 a SPRINT-14-08 para segurança, limites, supply chain, release e operação.

## Fora do escopo

Interpretação semântica de música, transcrição, composição, mixagem criativa de stems, promessa de restauração de clipping já impresso e sobrescrita do arquivo original.
