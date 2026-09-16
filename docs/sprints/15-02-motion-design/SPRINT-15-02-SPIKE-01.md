# SPRINT-15-02-SPIKE-01 — Spike Premation, licença e headless

**Fase:** 15 — Agentes Futuros
**Grupo:** Motion Design e Motion MCP
**Status inicial:** PLANNED
**Dependências:** checkout fixado do Premation; acesso ao ambiente de estudo
**Superfície principal:** investigação técnica reproduzível e decisão de arquitetura
**Bloqueia o MVP de agentes:** não

## Objetivo

Validar na prática se os módulos do Premation podem formar um adapter de engine de documento do Deskverse, quais limites existem e qual caminho de preview/render headless é tecnicamente seguro. O Spike não implementa a feature de motion para usuários.

## Tarefas

1. Fixar commit, submódulos, dependências e inventário de licença/SPDX.
2. Executar e registrar como o Premation representa projeto, composition, layer, asset, track e keyframe.
3. Capturar e restaurar documento completo, bundle `.motion` e versões, incluindo round-trip.
4. Verificar IDs, renomeação, parent/child, composição aninhada, tempo em frames e easing.
5. Rastrear como uma alteração chega ao snapshot e ao renderer.
6. Verificar CommandSystem, history global, history da timeline e transações de IA.
7. Testar `TextureProvider`, fontes, imagem, vídeo e áudio com assets locais de fixture.
8. Separar conceitualmente a engine da UI e identificar módulos fortemente acoplados ao React/store.
9. Testar execução headless em Node, browser worker, Chromium headless e Electron utility process.
10. Testar preview de frame e intervalo curto sem abrir a UI inteira.
11. Testar render final/export, encode e cancelamento com timestep fixo.
12. Medir dependências de DOM, `HTMLImageElement`, `HTMLVideoElement`, WebGPU/WebGL2, Canvas2D e FFmpeg.
13. Construir um caso mínimo de criação de texto, transform, keyframes e export e produzir a matriz `reutilizar/adaptar/isolar/substituir/reimplementar` com recomendação de arquitetura.

## Arquitetura envolvida

- Premation `@motion/scene`, `@motion/animation`, `@motion/timeline`, `@motion/renderer` e `@motion/ai-tools`.
- Limite entre editor UI, engine, renderer e processo privilegiado.
- Futuras interfaces `motion-contracts`, `motion-document`, `motion-engine-adapter` e `motion-render`.
- Nenhuma integração produtiva com Next, Prisma, UploadThing, Railway ou RunPod Serverless é afirmada neste Spike.

## Arquivos/módulos prováveis

- `PRD-15-02-MOTION-MCP.md` — atualização das decisões se o resultado contradizer a hipótese.
- Diretório de estudo externo do Premation, fora do worktree Deskverse.
- Relatório do Spike, matriz de licença e fixtures reprodutíveis.
- Testes de round-trip/headless no repositório de estudo ou em um adapter descartável, sem copiar código AGPL.

## Dependências

- Não depende de `SPRINT-15-01` para iniciar a investigação técnica.
- Deve considerar as interfaces de plataforma da Fase 09, mas pode rodar antes da implementação completa do runtime.
- A aprovação jurídica é necessária antes de promover qualquer pacote Premation a dependência do Deskverse.

## Critérios de aceite

- O relatório responde explicitamente aos 13 itens do Spike definidos no PRD.
- Há um caso executado de criação, serialização, restauração e render/preview, ou uma falha reproduzível com causa e fallback.
- O relatório identifica módulos acoplados ao Electron/DOM e módulos executáveis em Node/browser/worker.
- O relatório diferencia licença do monorepo AGPL de packages declarados MIT e lista dependências transitivas relevantes.
- A recomendação escolhe: adapter Premation, reimplementação mínima ou combinação, com evidência.
- Nenhuma capability é marcada como headless, determinística ou licenciada apenas por inspeção textual.

## Testes e verificação

- Testes de round-trip de cada chunk e documento completo.
- Teste de IDs estáveis após rename/reload.
- Teste de interpolação/easing em frames conhecidos.
- Teste de preview/render com asset ausente, fonte ausente, backend indisponível e cancelamento.
- Teste de licença/SBOM e revisão manual de dependências.
- Roteiro executável em ambiente limpo, com versões e comandos registrados.

## Definition of Done

- Relatório versionado, evidências de execução e decisão técnica publicada.
- Limitações e incompatibilidades registradas em `integration-requirements` da sprint funcional.
- Nenhum código de produção do Deskverse depende de uma hipótese não validada.
- Status fica `COMPLETE_WITH_INTEGRATION_REQUIREMENTS` quando só faltarem aprovação jurídica/infra; fica `FAILED_ACCEPTANCE` se o caso mínimo não puder ser explicado ou reproduzido.

## Explicitamente fora desta sprint

MCP produtivo, migration Prisma, editor visual, render service, UploadThing, agente de Motion Design, efeitos avançados, UI Electron, fork do Premation e qualquer cópia de código AGPL sem aprovação.
