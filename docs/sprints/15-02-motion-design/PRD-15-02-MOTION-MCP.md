# PRD — MCP de Motion Graphics e Composição Visual

**Produto:** Deskverse
**Fase proprietária:** 15 — Agentes Futuros
**Sprint funcional:** `SPRINT-15-02 — Agente futuro de motion design`
**Estado:** proposta técnica para implementação após o Spike
**Corte da análise:** 16/09/2026
**Fonte canônica:** este documento é anexado à SPRINT-15-02; não substitui o manifesto nem cria um roadmap paralelo.

## Diagnóstico antes do PRD

### Como o Deskverse está arquitetado

O Deskverse atual é uma aplicação Next 16/React com canvas DOM full-screen, drawers contextuais, estado local e uma fundação de conta/plataforma em Prisma/PostgreSQL. As Fases 01 a 06 estão `COMPLETE_WITH_INTEGRATION_REQUIREMENTS`; a Fase 07 está em execução e a próxima prioridade operacional é `SPRINT-07-02`. O código entregue ainda usa adaptadores determinísticos locais para fila, storage, escritório, eventos e notificações. Não há runtime real de agentes, worker físico, MCP de mídia, Remotion ou UploadThing efetivamente conectado no código.

As decisões que afetam este módulo são:

- líderes persistentes delegam por capability a especialistas compartilhados; workers são efêmeros;
- `AgentRuntime` abstrai Eve e `InferenceGateway` abstrai o Vercel AI Gateway;
- senioridade não concede permissão, scope ou autonomia;
- estado, política, orçamento, aprovação, retry, concorrência e cancelamento ficam fora do LLM;
- filas físicas incluem `RENDER`, com lease, heartbeat, retry técnico, dead-letter e cancelamento em cascata;
- Neon/PostgreSQL é a fonte transacional e pgvector é a única base persistente de memória dos agentes;
- UploadThing guarda os conteúdos produzidos no MVP; o banco guarda referência, metadados, autorização, versão e lineage;
- `WAITING_USER` e `WAITING_APPROVAL` salvam checkpoint e liberam o worker;
- a tela de arquivos de `SPRINT-08-02` deve existir antes dos agentes do MVP;
- a ordem e o Gate A0 da Fase 10 não podem depender deste módulo pós-MVP;
- o agente futuro de motion já está reservado em `SPRINT-15-02`, que hoje menciona Remotion e um MCP interno do clone do Figma, sem definir uma engine de documento editável.

O schema atual contém conta, workspace, atividade, runs, aprovações, auditoria, idempotência e memória, mas ainda não contém projetos de motion, revisões, assets persistentes, renders, jobs de mídia ou notificações duráveis. `QueueBackend`, `AssetStorage` e `McpRemoteClient` são contratos; seus adapters atuais são locais e não devem ser apresentados como infraestrutura produtiva.

### Como o Premation funciona

A análise foi feita no repositório `https://github.com/isroil01/premation`, checkout na versão `v0.8.4`, commit `3cb7930d`.

O Premation é um editor desktop Electron/React/TypeScript/Vite. A separação relevante é:

```text
React UI / Zustand
  -> commands e stores
  -> SceneGraph + AnimationEngine + TimelineController
  -> buildSnapshot(frame)
  -> FrameScene plano e ordenado
  -> RenderGraph
  -> WebGPU, WebGL2 ou Null
```

A aplicação possui uma ponte entre o modelo legado e `@motion/scene`; o renderer não conhece React, SceneGraph ou timeline e recebe um `FrameScene`. O documento rico `EditorDocument` combina scene, animation, compositions, timelines, motion blur, guias, color management, swatches, materiais, transições, plugins e tabs. O bundle local `.motion` é um diretório com `manifest.json`, `scene.json`, `animation.json`, `timeline.json`, `meta.json` e blobs/assets separados.

Há suporte amplo a compositions aninhadas, layers de texto/imagem/vídeo/áudio/SVG/shapes/câmera/luz/partículas, transforms 2D/3D, keyframes por frames, Bézier, easing, expressões interpretadas, máscaras, mattes, efeitos, WebCodecs, Web Audio, render fixo por `frame / fps`, WebGPU/WebGL2 e workers de mídia. O histórico global usa comandos undoable e snapshots; a timeline tem histórico local; transações de documento podem juntar uma alteração de IA em uma entrada de Undo.

O repositório não contém um servidor MCP. `@motion/ai-tools` contém vocabulário e schemas puros, com `AiToolDef`, `SceneFacade`, `AnimFacade`, `CompFacade` e um emissor para `tools/list`. Não há transporte JSON-RPC, `tools/call`, autenticação ou autorização MCP implementados.

### O que pode ser reutilizado

**Candidatos à reutilização direta, condicionada ao Spike e à revisão jurídica:** `@motion/scene`, `@motion/animation`, `@motion/timeline`, `@motion/renderer`, partes de `@motion/workspace`, `@motion/audio`, `@motion/ai-tools`, `@motion/technique-library` e `@motion/product-motion`. Eles são declarados MIT individualmente nos respectivos `package.json`; os avisos de copyright e a origem precisam ser preservados.

**Candidatos à adaptação:** renderer e `TextureProvider`, o bundle `.motion`, o mapeamento entre SceneGraph e `@motion/scene`, o carregamento de fontes/assets e o caminho offline de render. O renderer depende de Canvas/DOM em caminhos relevantes e o CLI documenta que render headless ainda precisa de DOM, `HTMLImageElement`, `HTMLVideoElement` e fontes carregadas.

**Candidatos a isolamento ou substituição:** Zustand, React Router, Electron IPC, filesystem local, `motion-back`, updater, stores da UI, plugins nativos, FFmpeg iniciado pelo Electron e o backend de cloud do Premation. Eles não devem entrar no servidor Next nem substituir Better Auth, Prisma, UploadThing, Redis ou os serviços Railway/RunPod Serverless do Deskverse.

**Reimplementação necessária:** autorização, multi-tenancy, lineage, notificações, aprovação, filas, telemetria, custos, persistência PostgreSQL, adapter de assets e o transporte MCP. A UI desktop inteira também não deve ser incorporada: ela é desktop-first e contradiz a superfície mobile-first/drawer-first do Deskverse.

### Principais riscos identificados

- o `.motion` é pré-1.0 e não deve ser tratado como contrato estável;
- `EditorDocument.captureDocument()` registra `1.1.0`, enquanto as migrations chegam a `1.7.0`, indicando drift de versão que precisa ser resolvido no Spike;
- o bundle local usa hash FNV-1a para chunks, adequado para detecção de mudança, mas não para integridade de segurança;
- parte do render depende de DOM, recursos de mídia e fontes carregadas, portanto “headless” não pode ser presumido;
- o caminho de GPU e o caminho Canvas2D têm capacidades diferentes, incluindo limitações de per-glyph text animators;
- o Premation tem muitos efeitos e capacidades que não pertencem ao MVP do Deskverse;
- a licença AGPL-3.0-only cobre o aplicativo/monorepo principal, enquanto alguns pacotes declaram MIT; copiar código sem uma fronteira de licença clara pode criar obrigação de disponibilização de código em um serviço web;
- filas, UploadThing, notificações e AgentRuntime ainda são integrações pendentes no Deskverse;
- concorrência entre editor humano, agente, especialista e render não pode ser resolvida por lock de processo local;
- um MCP que aceita paths, URLs arbitrárias, expressões JavaScript ou comandos FFmpeg brutos criaria uma fronteira de execução indevida.

### Conflitos de fonte reconciliados

- `AGENTS.md` ainda apontava `SPRINT-07-01` como próxima prioridade, enquanto status, manifesto e README apontam `SPRINT-07-02`; a prioridade operacional vigente é `07-02`.
- Relatórios da Fase 06 registram a migration aplicada, mas o guia de infraestrutura ainda registra a operação como pendente; este PRD não usa nenhum dos dois estados como evidência de infraestrutura de motion pronta.
- A decisão operacional consolidada é Railway para gateway/API, Redis, scheduler e CPU; RunPod Serverless para GPU/RENDER. O SVC deve manter essa separação e não introduzir um provedor alternativo.
- Um texto histórico sugere que `SPRINT-11-01` e `11-02` precedem `10-03`, mas o manifesto e os documentos atuais do MVP não fazem esse gate valer para este módulo. Motion permanece pós-MVP e independente do Gate A0.
- `SPRINT-15-02` cita Remotion como composição/render. O PRD preserva Remotion como capability code-first/template, mas define que o MCP de documento editável precisa do motion engine; isso é uma especialização técnica, não a remoção da decisão de usar Remotion no agente futuro.

### Recomendação inicial

Construir uma **engine de documento de motion programaticamente controlável**, com uma interface visual humana fina e um MCP interno autorizado, em vez de incorporar o editor Premation inteiro.

O documento canônico deve ser do Deskverse, versionado, validável, com IDs estáveis e operações estruturadas. Um adapter compatível com os pacotes MIT do Premation pode executar scene, animação e render quando o Spike confirmar que isso é possível sem importar `src/`, Electron ou a UI AGPL. O MCP deve operar sobre o mesmo documento e a mesma engine que o editor humano usa. Remotion permanece útil para templates/código de vídeo da sprint existente; FFmpeg permanece encoder/transcoder; nenhum dos dois vira a fonte de verdade da composição editável.

O MVP deve provar somente a fatia vertical: projeto, composition 2D, texto/imagem, transforms, keyframes/easing, inspeção seletiva, transação, revisão/Undo, preview e render simples. 3D, efeitos complexos, tracking, plugins e colaboração em tempo real ficam fora.

## 0. Escopo, dependências e gates

`SPRINT-15-02` é uma sprint funcional guarda-chuva. O Spike e as sprints filhas são unidades executáveis independentes, com artefatos, testes e evidências próprios; este PRD não transforma o grupo em uma entrega única sem decomposição.

O `SPRINT-15-02-SPIKE-01` pode começar sem `SPRINT-15-01`, usando somente o checkout fixado do Premation e o ambiente de estudo. A implementação produtiva depende das Fases 07, 08, 09 e 14, da revisão jurídica e dos gates descritos nas sprints filhas. A SVC é um gate do caminho remoto, não do estudo local. Nada nesta sprint bloqueia o MVP de agentes ou o Gate A0.

O status da sprint funcional só pode avançar depois que o relatório de integração consolidar os resultados das sprints filhas. Um mock, fixture, adapter local ou preview no browser deve ser identificado como tal e não pode ser contado como serviço produtivo, render remoto ou integração concluída.

## 1. Resumo executivo

O Deskverse precisa permitir que agentes criem e modifiquem motion graphics sem simular mouse e teclado e sem reduzir imediatamente o trabalho a um vídeo rasterizado. Este PRD define um MCP semântico sobre uma engine de documento editável, compartilhada por agentes e pessoas.

O agente chama operações como `motion.document.apply`, `motion.timeline.inspect` e `motion.preview.render`. A engine valida o lote, grava uma nova revisão, atualiza o histórico lógico e produz um snapshot para preview/render. O usuário abre a mesma composição em uma superfície visual fina, inspeciona a timeline, altera propriedades e desfaz a alteração da IA com um único Undo lógico.

O menor caminho sólido é um Spike obrigatório, seguido de um adapter dos módulos MIT do Premation. Nenhuma decisão do PRD declara que o Premation completo pode rodar no servidor antes de essa hipótese ser comprovada.

## 2. Contexto

O Deskverse já definiu o agente de Motion Design como futuro da Fase 15, mas a sprint atual pressupõe Remotion e um MCP visual do clone do Figma sem resolver o documento de motion, IDs, concorrência, inspeção seletiva, transações, render headless ou licença.

O módulo deve coexistir com a fundação operacional, respeitar o Gate A0 e usar os contratos existentes. Ele é pós-MVP de agentes e não bloqueia Social Media, Redator ou Designer.

## 3. Problema

Um agente que controla uma UI por coordenadas é frágil, caro em contexto, difícil de auditar e incapaz de garantir que o resultado continue editável. Um agente que entrega apenas MP4 perde layers, keyframes, fontes, assets e intenção de design. O Deskverse precisa de uma representação semântica, incremental e verificável do documento.

## 4. Objetivo

Entregar uma capability `motion.graphics` que permita:

- criar, abrir, inspecionar, alterar e versionar um documento de motion;
- operar por IDs estáveis e operações declarativas, não por coordenadas de UI;
- editar texto, imagens, transforms, ordem de layers e animações básicas;
- agrupar dezenas de alterações em uma transação atômica;
- gerar preview por frame/intervalo e render simples;
- preservar o documento editável após qualquer render;
- integrar aprovação, fila, storage, auditoria, notificações e AgentRuntime do Deskverse;
- permitir que o editor humano e o agente usem o mesmo documento, engine e histórico.

## 5. Não objetivos

Não fazem parte do MVP:

- substituir After Effects ou oferecer paridade completa com Premation;
- incorporar a UI desktop/Electron do Premation;
- copiar o aplicativo AGPL para um serviço proprietário;
- expor um painel público de MCP no canvas do Deskverse;
- aceitar scripts JavaScript, expressions arbitrárias, shell, paths locais ou filtros FFmpeg livres;
- construir GPU distribuída, render farm ou colaboração em tempo real;
- implementar câmera/luz/3D avançado, partículas, tracking, rotoscopia, plugins, expressions, VFX completo ou áudio profissional;
- transformar operações em vídeo sem documento persistente;
- criar sistema paralelo de agentes, autenticação, storage, fila ou memória;
- tornar este módulo dependência do Gate A0.

## 6. Personas

| Persona | Necessidade |
|---|---|
| Pessoa usuária do workspace | Acompanhar, revisar, abrir e ajustar o resultado sem perder contexto. |
| Líder de agente | Delegar uma tarefa visual por capability e receber estado, preview, custo e entrega. |
| Especialista de Motion Design | Traduzir briefing em operações estruturadas, iterar com preview e pedir aprovação. |
| Especialista de Imagem/Áudio/Vídeo | Produzir ou consumir assets sem duplicar binários e sem conhecer credenciais. |
| Worker de render | Executar uma revisão imutável, reportar progresso e devolver referências de saída. |
| Operador da plataforma | Auditar custo, falha, licença, isolamento, fila e capacidade do serviço. |

## 7. Casos de uso

1. Criar uma abertura de cinco segundos com texto e logo.
2. Alterar o texto de uma composição criada em uma execução anterior usando `layerId`, sem buscar pelo nome.
3. Animar opacity, scale e posição com keyframes e easing.
4. Inspecionar somente a composição e a layer relevantes, sem enviar todo o documento ao LLM.
5. Gerar frame em um timestamp, thumbnail e preview curto para avaliação visual.
6. Corrigir uma composição após o modelo de visão identificar texto fora da área segura.
7. Incorporar uma imagem gerada pelo agente de imagem e uma trilha produzida pelo agente de áudio.
8. Renderizar uma revisão aprovada e disponibilizar o arquivo na tela de arquivos.
9. Reabrir uma revisão anterior ou desfazer uma ação lógica da IA.
10. Recusar uma alteração quando o `baseRevision` estiver desatualizado, sem sobrescrever edição humana.

## 8. User stories

- Como agente, quero criar uma composition com dimensões, FPS e duração para iniciar uma peça editável.
- Como agente, quero receber IDs persistentes para referenciar a mesma layer em chamadas posteriores.
- Como agente, quero consultar apenas propriedades e keyframes de uma layer para economizar contexto.
- Como agente, quero aplicar um lote atômico de alterações e receber o novo número de revisão.
- Como agente, quero ver um preview de um frame antes de pedir um render caro.
- Como pessoa usuária, quero ver e editar a mesma composição visual que o agente alterou.
- Como pessoa usuária, quero desfazer uma alteração da IA em uma ação lógica única.
- Como líder, quero delegar `motion.graphics` a um especialista compartilhado e acompanhar espera, falha, aprovação e entrega.
- Como operador, quero rastrear workspace, run, task, trace, revisão, custo, worker e asset de cada operação.
- Como sistema, quero impedir que uma renderização use uma revisão parcialmente salva ou asset não confirmado.

## 9. Fluxos principais

### 9.1 Criação e edição pelo agente

```text
Brief
  -> refinamento e confirmação, se necessário
  -> líder delega capability motion.graphics
  -> especialista inspeciona projeto/assets
  -> transaction.begin ou apply atômico
  -> validação de schema, policy, budget e baseRevision
  -> commit de uma nova revisão
  -> evento project.updated
  -> preview de frame/intervalo
  -> análise visual seletiva
  -> nova transação, se necessário
  -> aprovação quando a policy exigir
  -> render final
  -> upload confirmado
  -> entrega vinculada a projeto/tarefa/versão/origem
```

### 9.2 Edição humana

O editor carrega a revisão confirmada do mesmo repositório, usa a mesma engine e emite as mesmas operações. A seleção, timeline e inspector são uma projeção visual; não são uma segunda fonte de verdade. Uma edição humana concorrente cria nova revisão e não altera uma revisão já usada por um render.

### 9.3 Preview visual

O agente pede um frame ou intervalo curto. O sistema valida a revisão, enfileira somente se a operação exceder o orçamento interativo, executa com resolução/qualidade limitada e devolve um asset de preview com timestamp, frame, revisão, backend e checksum. O resultado expõe ao agente somente um `assetInputRef` opaco, com escopo, expiração e finalidade; o `InferenceGateway` resolve internamente a entrada para o formato temporário aceito pelo provider. URL assinada, thumbnail ou binário nunca aparece cru no prompt, no resultado da tool, no trace ou no log.

### 9.4 Render final

O agente pede o render de uma revisão imutável. O sistema reserva budget, cria `MotionRenderJob`, envia a classe `RENDER`, usa URLs assinadas para inputs, reporta progresso e grava output somente após verificação. A entrega pode exigir `WAITING_APPROVAL`; falha não marca sucesso nem substitui output anterior.

### 9.5 Conflito

Se `baseRevision` não for a revisão atual, a operação falha com conflito estruturado. O resultado inclui revisão atual, autor, horário, resumo de mudanças e sugestão de nova inspeção. Não há merge automático no MVP. O agente decide rebase, nova pergunta ou escalonamento.

## 10. Arquitetura proposta

```text
LeaderAgent / MotionDesignSpecialist
        |
        v
AgentRuntime + TaskPolicy + AgentPolicy + ModelAdapter
        |
        v
Private Motion MCP gateway (Streamable HTTP, auth, scopes, Zod, idempotency)
        |
        v
Deskverse Motion Application API (audit, transactions, Prisma)
        |
        +--> Motion Document / Operation Validator
        |        |
        |        +--> Canonical JSON document + immutable revisions
        |        +--> Premation MIT adapter, quando habilitado
        |        +--> shared command/history boundary
        |
        +--> PostgreSQL/Prisma + Asset metadata + lineage
        +--> Redis QueueBackend -> Railway CPU ou RunPod Serverless RENDER endpoint
        +--> UploadThing adapter -> confirmed previews/exports
        +--> events -> Activity/Notification/Card/Files projections
        |
        +--> human motion editor -> same application service and engine
```

### Componentes lógicos

| Componente | Responsabilidade | Regra |
|---|---|---|
| `motion-contracts` | Zod, tipos, schemas de operações, errors e resources | Sem React, Electron, banco ou provider. |
| `motion-document` | Documento canônico, IDs, validação, migrations, snapshots e operações | Fonte de verdade editável. |
| `motion-engine-adapter` | Traduz documento/operations para scene, animation, timeline e snapshot | Pode usar módulos MIT do Premation; não importa UI AGPL. |
| `motion-render` | Preview, frame, thumbnail, intervalo e export | Mesmo snapshot e renderer para preview/render quando possível. |
| `motion-mcp` | JSON-RPC/MCP, tools, resources, auth, scopes e idempotência | Gateway privado; sem acesso direto ao banco. |
| `motion-editor` | Canvas, layer tree, inspector, timeline e undo/redo | Host visual fino, responsivo e com estado do servidor. |
| `motion-agent-policy` | Capability, budget, approval, style/skill e fallback | Pertence ao Deskverse, não à engine. |

Os nomes são propostas de módulos, não compromisso de diretório. O Spike pode consolidar ou renomear componentes, mas não pode misturar política de negócio no renderer.

### Topologia de transporte escolhida

O agente chama um endpoint privado `Streamable HTTP` do `motion-mcp` no Railway. `stdio` existe somente para desenvolvimento local. O gateway valida a identidade delegada e encaminha requests para a API de aplicação Motion autenticada do Deskverse; a API é a dona de transações, Prisma, auditoria e revisão. O gateway não acessa Neon diretamente e não recebe credenciais amplas.

Transactions são server-side, com `transactionId`, TTL e workspace/resource na sessão lógica; o transporte não depende de uma conexão HTTP longa. Cancelamento de preview/render ocorre por `motion.job.cancel`; cancelamento de uma transação não confirmada ocorre por rollback/expiração. O serviço MCP expõe resources e todas as tools do contrato, não somente render.

## 11. Integração com a arquitetura atual

- A capability é registrada no `SpecialistRegistry`; o líder pede `motion.graphics`, nunca um worker físico.
- A execução usa `AgentRuntime`/Eve e o LLM usa `InferenceGateway`/Vercel AI Gateway. OpenRouter, se algum adapter futuro o utilizar, fica atrás do gateway aprovado; não há chamada direta do agente.
- Operações MCP recebem `workspaceId`, `runId`, `taskId`, `traceId`, `idempotencyKey` e identidade delegada no contexto de transporte. `workspaceId` é obtido do token e não é confiado no body.
- A classe física inicial para preview/render é `RENDER`; conversão/thumbnail leve pode usar `CPU`. `GPU` só entra depois de profile, scheduler e worker comprovados.
- `WAITING_USER` ocorre quando faltam brief, asset, fonte, licença ou decisão visual. `WAITING_APPROVAL` ocorre antes de entrega protegida, publicação, render acima do budget ou mudança de policy.
- Eventos do módulo passam pela projeção persistente existente/futura e alimentam atividade, notificação, histórico, card do agente e tela de arquivos sem criar canais paralelos.
- Extensões de `McpRemoteClient`, `AssetStorage` e `WorkerExecutionProvider` são atribuídas às sprints donas da plataforma (07/08/09). O módulo Motion pode definir ports mais ricos em seu domínio, mas não acessa Redis, UploadThing, segredos ou banco por fora desses adapters.
- A tela de gerenciamento de projetos continua somente leitura. O editor de motion é uma superfície de autoria do documento visual, não uma tela de CRUD de planejamento.
- A tela de arquivos de `SPRINT-08-02` permanece somente leitura para a pessoa usuária; tools autorizadas criam versões e artefatos.
- O módulo não altera o canvas de agentes, sua geometria, seus tiles ou a semântica de comunicação espacial.

## 12. Análise do Premation

### Mapeamento de capacidades

| Capacidade | Evidência no Premation | Decisão Deskverse |
|---|---|---|
| Scene graph/layers | `packages/scene`, `src/core/scene/SceneGraph.ts` | Reutilizar adapter após validar IDs e hierarquia; documento Deskverse é canônico. |
| Compositions/precomps | `projectStore`, `compInstance.ts`, `precomp.ts` | MVP suporta uma composition; precomp e nesting ficam na fase seguinte. |
| Timeline | `packages/timeline` | Reutilizar conceitos e serialização somente dentro do adapter. |
| Keyframes/easing | `packages/animation`, `interpolate.ts` | Reutilizar scalar tracks e Bézier/easing do MVP; expressões ficam fora. |
| Transforms | `snapshotToFrameScene.ts`, `threeD.ts` | MVP 2D position/scale/rotation/anchor/opacity; 3D posterior. |
| Texto | `src/core/text`, source text e text animators | MVP texto de layer com fonte aprovada; per-glyph posterior e sujeito à capacidade do backend. |
| Shapes | `nodeTypes.ts`, `pathOps.ts` | MVP pode usar retângulo/ellipse simples; path operators posteriores. |
| Imagem/SVG | `AppTextureProvider`, animated SVG pipeline | Imagem e SVG rasterizado/seguro no MVP; conversão vetorial posterior. |
| Vídeo | WebCodecs, demux/decode workers | Metadados e importação controlada depois do Spike; vídeo como input do MVP só se o worker passar o teste. |
| Áudio | `AudioEngine`, mixdown | Referência de asset no MVP; mixagem e sincronização avançada posteriores. |
| Máscaras/mattes | `mask.ts`, `matte.ts` | Fora do MVP; reservar tipos e capability flags. |
| Efeitos | registro de 206 effects e RenderGraph passes | Catálogo read-only primeiro; efeitos selecionados em fase posterior, sem expor 206 tools. |
| Câmeras/luzes/3D | `camera3d.ts`, `light.ts`, `threeD.ts` | Fora do MVP. |
| Partículas | `particleSim.ts` determinístico | Fora do MVP. |
| Undo/redo | `CommandSystem`, `HistoryService`, timeline History | Reaproveitar boundary conceitual; conectar ao histórico do documento Deskverse. |
| Persistência | `EditorDocument`, bundle `.motion`, `VersionStore` | Usar como formato de intercâmbio/adapter; PostgreSQL é fonte produtiva. |
| Preview/render | `buildSnapshot`, `FrameScene`, `offlineRenderer` | Validar execução em worker headless; usar timestep fixo e falhar sem renderer válido. |
| MCP | `AiToolDef` e `toMcpToolList` | Reutilizar vocabulário se licença e schemas forem compatíveis; implementar servidor Deskverse. |

### Reutilização direta, adaptação e substituição

- **Direta:** packages MIT puros, apenas após inventário de dependências, testes de round-trip e confirmação jurídica.
- **Adaptada:** `FrameScene`, `TextureProvider`, `AnimationEngine`, timeline e command/history, com portas para storage, clock, fontes e assets do Deskverse.
- **Isolada:** renderer em processo/serviço de render; nunca carregar Electron ou filesystem privilegiado dentro do Next.
- **Exposta pelo MCP:** apenas capacidades semânticas estáveis, não métodos internos do Premation.
- **Substituída:** stores Zustand, React Router, IPC, backend cloud, local index, updater, upload local e execução de plugin nativo.
- **Reimplementada:** serviço de autorização, persistence repository, event sink, transaction coordinator, render job adapter, UploadThing adapter e editor responsivo.

## 13. Componentes reutilizáveis

1. `@motion/scene` para hierarquia e tipos de node, se o Spike comprovar que a API pública não depende da aplicação.
2. `@motion/animation` para tracks, interpolation e easing básicos.
3. `@motion/timeline` para conceitos de frames, clips, markers e work area, sem assumir que seu histórico local é a fonte do Deskverse.
4. `@motion/renderer` para converter `FrameScene` em WebGPU/WebGL2/Null.
5. `@motion/audio` somente como adapter futuro de waveform/mixdown.
6. `@motion/ai-tools` como referência de `SceneFacade`, `AnimFacade`, schemas e mensagens de erro, sem expor o `ToolContext` diretamente.
7. `@motion/technique-library` para técnicas versionadas e determinísticas, quando a licença e o contrato forem confirmados.
8. Patterns de `agent-skills/catalog/media/remotion-motion-graphics` como instruções de craft, carregadas progressivamente; não são engine nem autorização.

## 14. Componentes que precisam ser adaptados

- `EditorDocument` deve virar uma projeção do documento canônico do Deskverse, não o contrato de banco.
- Scene IDs precisam ser mapeados para IDs persistentes do Deskverse e nunca depender de nome.
- O relógio deve aceitar frames inteiros e uma conversão explícita seconds/frame.
- `TextureProvider` deve resolver `assetId + assetVersionId` para URL assinada, com cache seguro e expiração.
- Fontes devem vir de registry/asset autorizado, com fallback conhecido e erro de fonte ausente.
- `CommandSystem` deve aceitar um `OperationGroup` externo e registrar `IA — <rótulo>` ou `Pessoa — <rótulo>` no histórico compartilhado.
- O renderer deve expor capability flags e erro de inicialização, nunca completar com canvas preto silenciosamente.
- O `offlineRenderer` deve ser encapsulado em worker/serviço que respeite AbortSignal, lease, timeout e cancelamento.
- O bundle `.motion` deve ser import/export opcional, com validação, hash criptográfico de integridade do conteúdo (por exemplo, SHA-256), migração e versionamento; não é persistência principal.

## 15. Modelo de projeto/documento

### Entidades

```text
MotionProject
  projectId, workspaceId, productProjectId, schemaVersion, currentRevision
  metadata, defaultCompositionId, status, createdBy, timestamps

MotionComposition
  compositionId, projectId, name, width, height, fps, durationFrames
  background, colorManagement, rootLayerIds

MotionLayer
  layerId, compositionId, parentLayerId, type, name, order
  inFrame, outFrame, startFrame, visible, locked, content, transform

MotionTrack
  trackId, layerId, propertyPath, valueType, keyframes

MotionKeyframe
  keyframeId, trackId, frame, value, interpolation, easing, tangents

MotionAssetUsage
  projectId, compositionId, layerId, assetId, assetVersionId, role, lineage
```

O documento serializado de uma revisão contém essas entidades em JSONB validado por `schemaVersion`. Projeções indexadas de project/composition/layer podem existir para consulta, mas não substituem o snapshot imutável.

### Regras do documento

- `fps` é racional ou número decimal normalizado; keyframes são inteiros em frames no documento.
- A API pode aceitar segundos, mas devolve frame normalizado e o arredondamento aplicado.
- `transform` distingue local/world e registra parent; o MVP usa transform local simples.
- `content` é discriminado por `type`: `text`, `image`, `shape`, `video`, `audio`, `composition`.
- `effect`, `mask`, `matte`, `camera`, `light`, `expression` e `particle` possuem capability flags e não são aceitos apenas porque existem no JSON.
- Campos desconhecidos são rejeitados no write do MVP e preservados apenas em import/export compatível quando o adapter conseguir round-trip seguro.
- Cada operação tem `clientOperationId`, `actor`, `traceId`, `baseRevision` e resultado determinístico.

### Persistência proposta

Depois de `SPRINT-08-01`, as tabelas devem referenciar o projeto canônico da fase 08, sem criar uma segunda entidade visível de projeto. A extensão mínima prevista é:

- `MotionProject`: vínculo workspace/projeto, schema, revisão atual e status;
- `MotionProjectRevision`: snapshot JSONB imutável, número, parent, checksum, actor, trace e timestamps;
- `MotionOperationGroup`: lote lógico, label de histórico, operações, antes/depois, actor e idempotência;
- `MotionAssetUsage`: relação de uso e lineage entre documento e asset/version;
- `MotionRenderJob`: revisão, composition, tipo, estado, queue job, output e erro;
- `MotionPreview`: frame/intervalo, resolução, revisão, asset confirmado e expiração;
- `MotionCapabilityProfile`: versão do adapter/renderer e capabilities comprovadas, se necessário.

Todos os modelos, enums, índices, relações e constraints exigem migration Prisma versionada, teste em banco local limpo, `prisma migrate status` e estratégia de backfill. `WorkspaceItem` não deve carregar o documento inteiro como payload sem migration e sem uma razão de compatibilidade explícita.

## 16. Arquitetura do MCP

O serviço `motion-mcp` é um Resource Server privado em Streamable HTTP. Ele implementa `tools/list`, `tools/call`, resources, erros estruturados e auditoria. `stdio` é permitido apenas no harness local. O `McpRemoteClient` do Deskverse continua uma interface, não a implementação do servidor.

### Envelope lógico

O contexto autenticado carrega `workspaceId`, `agentId`, `agentRunId`, `taskId`, `traceId`, `audience`, scopes, delegation e budget. O input da tool carrega apenas IDs de recurso, parâmetros de operação, `baseRevision`, `idempotencyKey`, `transactionId` e label. O servidor nunca aceita `workspaceId` do body como autoridade.

### Resultado lógico

```text
ok
code
messageForAgent
data
projectId
revision
operationResults
warnings
nextStep
traceId
contractVersion
retryable
recovery
```

Toda resposta inclui `contractVersion` e, inclusive em falhas parciais rejeitadas, um `code` estável, `retryable`, `recovery` e `nextStep`. O `messageForAgent` explica como corrigir o erro. O resultado para a pessoa usuária é uma projeção em pt-BR; IDs, códigos e schemas podem permanecer em inglês.

## 17. Tools

As tools são agrupadas por tarefa. Não haverá uma tool para cada clique ou campo. A lista inicial é:

### Contrato normativo da tool

Cada item de `tools/list` declara `name`, `contractVersion`, `inputSchema`, `outputSchema`, scopes necessários, capabilities necessárias, efeitos colaterais e política de idempotência. `tools/call` valida o payload com o schema da versão negociada, ignora campos desconhecidos somente quando a política de compatibilidade permitir e rejeita qualquer mutação sem `baseRevision` ou chave de idempotência exigidos.

O envelope comum não autoriza o agente a escolher workspace, provider, fila, worker, URL ou credencial. O servidor deriva esses valores do contexto autenticado e da policy. O lote de `motion.document.apply` tem limite configurável pelo `TaskPolicy`; a resposta identifica cada operação pelo seu índice e nunca converte erro semântico em retry técnico.

| Código | Retry automático | Recuperação esperada |
|---|---:|---|
| `MOTION_SCHEMA_INVALID` | não | Corrigir o payload conforme `inputSchema`. |
| `MOTION_PERMISSION_DENIED` | não | Pedir capability, aprovação ou escopo adequado. |
| `MOTION_REVISION_CONFLICT` | não | Reinspecionar a revisão e replanejar com novo `baseRevision`. |
| `MOTION_ASSET_NOT_READY` | sim, limitado | Aguardar readiness ou pedir outro `assetInputRef`. |
| `MOTION_CAPABILITY_UNAVAILABLE` | não | Usar fallback explícito ou escalar ao líder. |
| `MOTION_BUDGET_EXCEEDED` | não | Reduzir duração/qualidade ou pedir autorização de orçamento. |
| `MOTION_JOB_RETRYABLE` | sim, idempotente | Repetir com a mesma chave dentro da política. |
| `MOTION_IDEMPOTENCY_KEY_REUSED` | não | Reenviar o mesmo payload ou criar nova chave. |
| `MOTION_RENDERER_UNAVAILABLE` | sim, limitado | Aguardar outro worker elegível ou escalar. |

Uma repetição válida com a mesma chave devolve o resultado original e é registrada como replay; não cria uma segunda revisão, render ou cobrança.

### Projeto e inspeção

| Tool | Tipo | Função |
|---|---|---|
| `motion.project.create` | write | Cria documento com settings iniciais e composition opcional. |
| `motion.project.open` | read | Valida acesso e devolve resumo da revisão solicitada; não cria lock de processo. |
| `motion.project.inspect` | read | Retorna metadados, revisões, compositions e capabilities em forma limitada. |
| `motion.composition.create` | write | Cria uma composition em uma revisão transacional. |
| `motion.composition.inspect` | read | Retorna settings, árvore resumida e estatísticas. |

### Documento, layers e animação

| Tool | Tipo | Função |
|---|---|---|
| `motion.document.apply` | write/compose | Aplica lote de operações primitivas e técnicas registradas. |
| `motion.document.undo` | write | Cria revisão inversa de um OperationGroup, respeitando a revisão atual. |
| `motion.layer.inspect` | read | Retorna uma layer e propriedades solicitadas, sem expandir tudo por padrão. |
| `motion.timeline.inspect` | read | Retorna tracks/keyframes paginados de uma composition/layer. |
| `motion.timeline.evaluate` | read | Avalia propriedades em um frame/time específico. |

`motion.document.apply` aceita, no MVP, `createLayer`, `updateLayer`, `deleteLayer`, `duplicateLayer`, `reorderLayer`, `setProperty`, `setText`, `addKeyframes`, `updateKeyframe`, `deleteKeyframes`, `setEasing` e `attachAsset`. `addEffect`, `createMask`, `createMattes`, `createCamera`, `createLight` e expressions são capability-gated posteriores.

### Assets e catálogo

| Tool | Tipo | Função |
|---|---|---|
| `motion.asset.attach` | write | Liga um asset/version já confirmado ao documento; não recebe path local. |
| `motion.asset.inspect` | read | Retorna metadados, checksum, tipo, dimensões, duração, status e lineage permitido. |
| `motion.catalog.list` | read | Lista fontes, easings, técnicas, backends e efeitos habilitados por profile. |

O upload de binários é uma capability compartilhada de assets/UploadThing, não uma segunda tool de upload do motion. `asset.attach` só pode referenciar um asset cujo backend confirmou ownership, MIME, checksum e estado `ready`.

### Vetores e clone do Figma

O MCP interno do clone do Figma previsto em `AGENTS.md`, `SPRINT-11-01` e `SPRINT-15-02` continua sendo uma capability upstream separada. Ele produz um artefato vetorial ou operações normalizadas; o Motion MCP pode importá-los por `motion.asset.attach`/uma operação futura `importVector`, preservando `sourceSystem`, `sourceId` e lineage. A engine Motion não incorpora o clone do Figma e o MVP não depende dele para texto, imagem, sólidos e shapes básicos. Se a capacidade estiver disponível na implementação do agente, ela deve ter um adapter e critérios de aceite próprios; se não estiver, o fallback deve ser explícito.

### Transações e jobs

| Tool | Tipo | Função |
|---|---|---|
| `motion.transaction.begin` | write | Congela baseRevision e abre um contexto transacional com TTL. |
| `motion.transaction.commit` | write | Valida e grava uma única revisão/entrada de histórico. |
| `motion.transaction.rollback` | write | Descarta o contexto não confirmado. |
| `motion.preview.render` | write | Cria frame, thumbnail ou intervalo curto com limites explícitos. |
| `motion.render.start` | write | Agenda render final de uma revisão imutável. |
| `motion.job.inspect` | read | Consulta fila, estado, progresso, erro, revisão e outputs confirmados. |
| `motion.job.cancel` | write | Cancela job permitido, preservando revisão e outputs anteriores. |

Uma chamada `motion.document.apply` fora de transaction já é atômica. Transaction explícita existe para lotes com dependências, não para manter worker ocupado.

## 18. Resources

Resources são snapshots limitados e versionados. Eles não enviam o documento inteiro por padrão.

| URI | Conteúdo padrão |
|---|---|
| `motion://project/{projectId}` | resumo, revisão atual, compositions, status e capabilities |
| `motion://project/{projectId}/revisions` | lista paginada de revisões, actor, label, checksum e datas |
| `motion://project/{projectId}/composition/{compositionId}` | settings e árvore resumida |
| `motion://project/{projectId}/composition/{compositionId}/layers` | layers paginadas, ordem, tipo, nome e IDs |
| `motion://project/{projectId}/layer/{layerId}` | properties selecionadas, parent, asset refs e tracks resumidos |
| `motion://project/{projectId}/layer/{layerId}/animation` | tracks/keyframes paginados |
| `motion://project/{projectId}/assets` | assets usados, versões, status e lineage permitido |
| `motion://catalog/effects` | catálogo habilitado, schemas de params e capability flags |
| `motion://catalog/fonts` | fontes aprovadas, pesos, idiomas e licença |
| `motion://job/{jobId}` | estado, progresso, revisão de entrada, output e próximo passo |

Todos aceitam seleção de campos, limite, cursor e revisão. O servidor inclui `ETag`/checksum e pode devolver `notModified` ou um delta de revisão. Resources de binary preview devolvem `assetInputRef` opaco, não uma URL assinada nem bytes no contexto do LLM. A URL assinada só é materializada, por curta duração, dentro do `InferenceGateway`, do worker ou da superfície autorizada que realmente precisa baixar o asset.

## 19. Sistema de IDs

- IDs são opacos, aleatórios e estáveis; a forma recomendada é ULID/UUIDv7 com prefixo semântico opcional, como `mot_prj_`, `mot_cmp_`, `mot_lyr_`, `mot_ast_`, `mot_kf_`.
- O prefixo é diagnóstico, não autorização.
- IDs são únicos no domínio, nunca são reutilizados e não mudam quando o nome visual muda.
- Uma entidade removida permanece como tombstone no histórico; uma nova entidade recebe outro ID.
- Importações guardam `sourceId`/`sourceSystem` em metadata e mapeamento explícito, sem usar nome como chave.
- Operações podem declarar IDs client-side para dependências do mesmo lote; o servidor rejeita colisão e devolve o mapa de IDs gerados.
- Cada revisão referencia a mesma entidade por ID; alterações de conteúdo não quebram referências de agentes.

## 20. Transações

1. `begin` valida acesso, `baseRevision`, budget, TTL e limite de transações.
2. `apply` valida cada operação contra um working document imutável e coleta resultados; nenhum side effect externo é confirmado.
3. `commit` revalida baseRevision, schema, policy e assets; grava OperationGroup e nova MotionProjectRevision em uma transação PostgreSQL.
4. O backend publica eventos depois do commit, com outbox/idempotência; falha de transporte não desfaz a revisão.
5. `rollback` ou expiração descarta apenas o working document.

Render, upload e publicação não acontecem dentro da transação de documento. Podem ser agendados depois do commit e referenciam a revisão exata. Se uma tool protegida exigir aprovação, o run salva checkpoint antes do commit e entra em `WAITING_APPROVAL`.

## 21. Undo/Redo

- Cada commit de usuário ou IA é um `OperationGroup` e aparece como uma entrada lógica.
- O label visível usa pt-BR, por exemplo `IA — entrada do título` ou `Pessoa — ajustar logo`.
- A inversão é uma nova revisão, não uma mutação destrutiva do passado.
- `motion.document.undo` exige que a revisão atual seja compatível com a revisão que o grupo espera. Se houve edição concorrente, devolve conflito em vez de apagar trabalho de outra pessoa.
- Redo é permitido enquanto não houver nova ramificação incompatível; depois disso o sistema oferece restaurar a revisão anterior como nova revisão.
- O editor humano e o agente chamam o mesmo coordinator. O adapter Premation não pode empurrar diretamente no histórico local sem registrar o grupo do Deskverse.
- O histórico mantém actor, run/task, trace, before/after, inputs, output e motivo.

## 22. Assets

```text
upload ou geração autorizada
  -> Asset + AssetVersion confirmados
  -> metadados/probe/checksum
  -> MotionAssetUsage
  -> layer/composition
  -> preview/render referenciando a revisão
  -> output versionado
```

### Formatos

- **MVP:** PNG/JPEG/WebP, SVG sanitizado como imagem, texto com fontes aprovadas e sólidos/shapes básicos.
- **MVP condicionado ao Spike:** leitura de vídeo MP4/H.264 e áudio WAV/MP3/AAC somente se decode/probe/render reproduzirem o caso de teste; não prometer codec por extensão.
- **Posterior:** Lottie editável, SVG animado convertido em shapes, ProRes/EXR/HDR, glTF/GLB, fontes customizadas com verificação de licença, partículas e assets 3D.

Assets não são duplicados quando agentes colaboram: imagem produz `assetVersionId`, motion referencia esse ID, vídeo referencia o `MotionProjectRevision` ou output confirmado, e áudio mantém sua própria lineage. O binário não passa pelo LLM.

## 23. Preview

Capacidades previstas:

- frame em `time` ou `frame`;
- thumbnail da composition;
- intervalo curto com resolução/qualidade limitada;
- proxy visual para avaliação;
- metadata de backend, renderer, revision, timestamp, duração, dimensions e checksum.

O preview deve ser barato, cancelável e não substituir o documento. A qualidade visual pode ser baixa; a resposta deve declarar isso. O loop de visão é:

```text
apply -> preview -> visão via InferenceGateway -> diagnóstico -> apply corretivo
```

O modelo de visão recebe somente o frame/intervalo necessário, o brief e um `assetInputRef` opaco resolvido pelo `InferenceGateway`. A análise não altera o documento sem uma nova operação autorizada.

## 24. Render

### Interactive preview

O preview interativo do editor pode rodar localmente, usando WebGPU/WebGL2/Canvas fallback comprovado, mas é uma projeção efêmera da revisão e não cria job ou arquivo durável. Quando o agente chama `motion.preview.render`, a execução é sempre um job MCP assíncrono com `executionMode` explícito e classe física registrada: `CPU` para thumbnail/probe e `RENDER` para intervalo que exigir worker. Deve priorizar resposta e manter resolução limitada. O browser não é autoridade para render final.

### Final render

Roda fora da função Vercel, em worker privado Railway ou endpoint RunPod Serverless atrás de `WorkerExecutionProvider` e da fila `RENDER`. O scheduler escolhe Railway para render CPU/browser e RunPod Serverless para render GPU; o worker recebe snapshot/revision e resolve `assetInputRef`s para URLs assinadas de curta duração somente dentro do adapter de execução; o agente e o modelo nunca recebem essas URLs. O worker não recebe credenciais amplas nem conexão direta desnecessária ao banco. O renderer usa timestep fixo `frameIndex / fps` e falha se backend, fonte, mídia ou efeito não puder ser resolvido.

FFmpeg é usado para encode, mux, probe e transcode autorizados. Ele não decide layer order, keyframes ou composição. Remotion continua um caminho code-first/template separado e não converte uma composição editável em fonte de verdade.

O MVP começa com CPU/browser isolado e formatos simples. GPU RunPod Serverless, render distribuído e paralelismo de frames são posteriores e dependem de benchmark; o Railway continua coordenando o job e seus estados. UploadThing é o destino de previews/exports do MVP; R2 entra para mídia pesada quando a estratégia da fase específica for aprovada.

## 25. Workers e filas

- `motion.preview.render` é um job MCP assíncrono: usa `CPU` para thumbnails/probes leves e `RENDER` para intervalo/render remoto, sempre com `executionMode`, classe física, revisão e orçamento explícitos.
- `motion.render.start` cria tarefa durável com `workspaceId`, `runId`, `taskId`, `revisionId`, `compositionId`, input asset refs, profile, priority, budget e idempotency key.
- Scheduler mantém política Deskverse; Redis/BullMQ ou equivalente é transporte, não fonte de regras.
- Worker usa lease/heartbeat, timeout, cancelamento por AbortSignal, retry técnico idempotente e dead-letter. Falha semântica de documento volta ao agente, não repete render cegamente.
- `WAITING_USER`/`WAITING_APPROVAL` libera worker e salva checkpoint.
- Progresso não promete posição fixa; UI mostra estado e estimativa somente quando confiáveis.
- Concorrência inicial respeita limites de `SPRINT-09-04`, com `RENDER` por workspace configurável e budget da Fase 12.

## 26. Persistência

PostgreSQL/Prisma mantém projeto técnico, revisões, operation groups, asset usages, jobs, previews, lineage, auditoria e outputs. UploadThing mantém bytes no MVP. Redis mantém fila/lease transitórios. pgvector mantém memória do agente, brief confirmado, preferências e decisões elegíveis; não é usado para substituir o documento estruturado.

O snapshot da revisão é imutável e possui checksum. O estado atual é um ponteiro em `MotionProject`, atualizado com optimistic concurrency. Uma outbox ou mecanismo equivalente publica eventos depois do commit. Dados de render não podem ser a única cópia do documento.

## 27. Eventos

Eventos mínimos:

```text
motion.project.created
motion.project.updated
motion.composition.updated
motion.layer.updated
motion.revision.created
motion.revision.conflict
motion.asset.attached
motion.preview.started
motion.preview.completed
motion.preview.failed
motion.render.started
motion.render.progress
motion.render.completed
motion.render.failed
motion.render.cancelled
motion.asset.ready
motion.delivery.waiting_approval
motion.delivery.completed
```

Cada evento inclui `eventId`, `workspaceId`, `projectId`, revision/asset/job quando aplicável, `runId`, `taskId`, `traceId`, `idempotencyKey`, actor, occurredAt, before/after resumidos, impacto e próximo passo. Eventos são persistidos/projetados conforme o sistema de notificações da Fase 08. `render.progress` deve ser agregado para não inundar atividade.

O envelope Motion é traduzido para o contrato geral da Fase 08, não para uma tabela de notificação paralela. No mínimo: `project.created/updated`, `revision.created` e `layer.updated` viram atividade de domínio com `metadata.domain = motion`; `preview.*` e `render.*` vinculam `runId`/`jobId` e usam os estados gerais de execução; `delivery.waiting_approval` cria `Approval` e notificação prioritária com `resourceUri`; `asset.ready` atualiza a projeção da tela de arquivos. A migration da Fase 08 deve ampliar enum/metadata/outbox conforme o contrato final, preservando eventos desconhecidos em metadata para não perder rastreabilidade.

O card do especialista mostra apenas estados operacionais relevantes: trabalhando, aguardando resposta, aguardando aprovação, concluído, erro recuperável ou falha. A central de notificações abre o job/revisão exata, não uma conversa genérica.

## 28. Concorrência

Estratégia do MVP: optimistic concurrency com `baseRevision` obrigatório em toda mutação, revisão imutável e ponteiro atômico para a revisão atual.

- Locks de editor são apenas advisory para UX e expiram; nunca são a proteção de integridade.
- Render fixa `revisionId` de entrada e nunca acompanha alterações posteriores.
- Agente, usuário e especialista podem trabalhar em branches de revisão; commit em base antiga é rejeitado.
- Não há merge automático de layers no MVP. Um diff resumido permite replanejamento humano/agente.
- Snapshots e operation log permitem restore, undo e auditoria.
- Colaboração em tempo real, presence e merge operacional ficam posteriores.

## 29. Segurança

### Autenticação e autorização

- Better Auth autentica pessoas; service identity/OAuth Resource Server autentica serviços e agentes quando a Fase 09 entregar esse contrato.
- O token tem audience do `motion-mcp`, scopes por recurso e capability. Exemplos: `motion:project:read`, `motion:project:write`, `motion:asset:read`, `motion:asset:attach`, `motion:preview:render`, `motion:render:final`, `motion:revision:restore`.
- Delegação líder → especialista inclui somente workspace, capability, project/resource, run, budget e expiração curta.
- RBAC, ownership, policy, quota e approval são todos validados; scope não bypassa nenhum deles.
- Senioridade do agente altera reasoning/budget conforme policy, nunca scope.

### Isolamento e input

- Nenhum path local, comando shell, URL arbitrária ou credencial chega à engine.
- Assets entram por IDs e URLs assinadas de curta duração; o worker valida workspace, checksum, MIME e tamanho.
- SVG é sanitizado e limitado; fontes e codecs passam por allowlist; uploads podem passar por scan existente de arquivo.
- Render worker roda sandboxed, com filesystem temporário, usuário não privilegiado, rede mínima e limite de CPU/memória/tempo.
- Expressões, plugins, shaders e effects customizados são bloqueados no MVP.
- Rate limit por workspace/agente/tool, limite de operações por lote, duração/resolução máxima, orçamento e limite de jobs concorrentes.
- Falhas de auth, asset, renderer, fila e documento têm códigos distintos; não há sucesso simulado.

### Auditoria

Tool call, decisão de policy, aprovação, revisão, asset, worker, custo e output registram `workspaceId`, actor, run/task, trace, input redacted, result, timestamps e motivo. Segredos não entram em prompt, trace, tool result ou log.

## 30. Integração com agentes

O agente de Motion Design será um `SpecialistAgent` compartilhado com capability `motion.graphics`, não uma identidade de worker por render. Os defaults documentados são os IDs técnicos `qwen3.5-plus` e `kimi-k3`; o `ModelCapabilityProfile` e o benchmark da Fase 09 podem selecionar outro modelo elegível. O Deskverse resolve inteligência e policy; o `InferenceGateway` resolve transporte e failover do provider.

Harness:

```text
MotionAgentPolicy
  + MotionTaskPolicy
  + ModelAdapter
  -> InferenceGateway
  -> MCP tools autorizadas
```

O agente recebe skills de forma progressiva pelo registry/compatibility de `agent-skills`: `remotion-motion-graphics` como craft/referência, `vision` para análise quando o profile suportar e `ffmpeg-skill` apenas atrás de wrapper autorizado. A skill canônica é agnóstica ao provider; o adapter traduz apenas o formato de entrada/saída exigido pelo modelo efetivo. A skill não pode conceder upload, render, publicação ou credencial.

O ciclo completo é briefing → assets → composition → layers → animação → preview → análise visual → correção → approval → render → entrega. Em falta de contexto, o agente pergunta; em falta de capability, informa o fallback; em erro técnico, aguarda/retry; em resultado semântico ruim, volta ao líder para replanejamento.

## 31. Integração entre agentes

| Origem | Artefato | Consumidor motion |
|---|---|---|
| Imagem | `AssetVersion` confirmado, checksum e metadata | layer `image` por referência, sem duplicar bytes |
| Áudio | `AssetVersion` com probe/waveform | layer `audio` ou referência para vídeo posterior |
| Motion | `MotionProjectRevision` editável + preview/render | vídeo/editor pode importar por adapter ou output |
| Vídeo | projeto/timeline ou asset/proxy confirmado | layer `video` quando capability habilitada |
| Texto/Marca | brief/BrandProfile autorizado | conteúdo e fontes aprovados; conflitos pedem confirmação |

Lineage sempre aponta para `assetId`, `assetVersionId`, `projectId`, `revisionId`, task e agent. Compartilhar referência é o padrão; cópia só ocorre quando um serviço exige formato derivado e a relação de origem é registrada.

## 32. Relação com outros editores e engines

- **Motion engine:** layers, compositing, typography, transforms e animação editável.
- **Editor de vídeo:** montagem editorial, cortes, clipes, timeline narrativa, proxies e entrega longa.
- **Remotion:** código React/template e render programático quando a tarefa é code-first; não é o documento canônico do MCP de motion.
- **FFmpeg:** encode, mux, probe, transcode e operações de arquivo autorizadas; não modela a composição.
- **Image Editing Tool da SPRINT-15-19:** composição raster/layers para imagem e recomposição; não substitui timeline de motion.
- **VFX 15-13:** especialista compartilhado sobre engine de vídeo/motion, sem duplicar storage, ingestão ou render.
- **Audio:** produção/mix de trilha; motion referencia asset e sincroniza somente quando capability disponível.

Interoperabilidade avançada com Lottie, OTIO, FCPXML, MOGRT, AE ou glTF é posterior e depende de adapters versionados.

## 33. Limitações

- O primeiro editor não terá a densidade nem a paridade do After Effects.
- O documento canônico não será o `.motion` local sem uma decisão de compatibilidade de versão.
- Nem todos os 206 efeitos do Premation estarão disponíveis; `catalog.list` sempre informa capability real.
- Headless render pode exigir Chromium/DOM e ter custo operacional relevante.
- WebGPU não é garantido em todos os workers; o backend efetivo será registrado.
- Expressões JavaScript arbitrárias, plugins e shaders não são aceitos no MVP.
- Não haverá merge automático de revisões concorrentes.
- Preview visual não é prova de qualidade editorial; a aprovação permanece humana quando a policy exigir.

## 34. Riscos

| Risco | Probabilidade/impacto | Mitigação |
|---|---|---|
| Premation não roda headless | Alta/alto | Spike com caso real; browser worker isolado ou reimplementação mínima como fallback. |
| Pacote MIT depende de código AGPL | Média/alto | SBOM, grafo de dependências, revisão jurídica e proibição de copiar `src/` antes da aprovação. |
| Drift do formato Premation | Alta/médio | Documento Deskverse versionado, adapter testado e import/export opcional. |
| Render divergente de preview | Média/alto | Mesmo snapshot/renderer, timestep fixo, capability e golden tests. |
| Asset não disponível no worker | Média/alto | asset readiness, URL assinada, checksum, retry e erro explícito. |
| Agente gera loops caros | Média/alto | budget raiz, max operations, preview-first, retry separado e `cost_per_successful_task`. |
| Usuário edita durante render | Alta/médio | render fixa revision e mostra lineage; nunca sobrescreve output. |
| MCP vira superfície de OS | Baixa/crítico | IDs/URLs assinadas, sem paths, shell, JS ou credencial, sandbox e allowlists. |
| Fase 08/09 atrasada | Média/médio | Spike atemporal; implementação não declara integração produtiva até contratos estarem prontos. |
| Dependência indevida do Gate A0 | Baixa/crítico | manifestar `blocksMvp: false` e manter módulo somente na Fase 15. |

## 35. Impacto da licença do Premation

O `package.json` do repositório principal declara `AGPL-3.0-only` e o `LICENSE` contém a obrigação de oferecer o código-fonte correspondente a usuários que interajam remotamente com uma versão modificada através da rede. Isso é incompatível, sem revisão jurídica, com copiar o aplicativo Premation ou módulos AGPL para um serviço proprietário fechado do Deskverse.

Alguns pacotes em `packages/*/package.json` declaram MIT, incluindo scene, animation, renderer e ai-tools. Isso não autoriza presumir que todo o monorepo é MIT: dependências transitivas, arquivos sem cabeçalho, assets, plugins e código em `src/` precisam de inventário. A reutilização permitida deve:

1. fixar commit e origem;
2. gerar SBOM e inventário SPDX;
3. confirmar que o módulo e todas as dependências do bundle são realmente compatíveis;
4. preservar copyright, licença e notices;
5. manter adapter e código AGPL separados se a revisão jurídica aprovar essa topologia;
6. não distribuir ou executar código AGPL modificado como parte de um serviço proprietário sem decisão jurídica documentada;
7. manter uma opção de reimplementação limpa sobre interfaces públicas caso a fronteira não seja segura.

O Spike não é aprovação jurídica. Sem parecer favorável, o Deskverse deve usar apenas especificações públicas e reimplementar o subconjunto necessário.

## 36. MVP

### Escopo funcional

- criar/open/inspect de projeto motion;
- uma composition 2D com width, height, FPS, duration e background;
- attach de imagem já confirmada no storage e criação de layer de imagem;
- criação/edição de texto com fonte aprovada;
- transform de position, scale, rotation, anchor e opacity;
- ordem, visibilidade, lock e duração básica de layers;
- keyframes de propriedades escalares e de transform;
- easing linear, ease-in, ease-out, ease-in-out e cubic Bézier validado;
- inspect seletivo de projeto/composition/layer/timeline/asset;
- operation group transacional, optimistic concurrency, idempotência e revision history;
- Undo lógico de ação da IA no editor e via tool;
- frame, thumbnail e preview curto;
- render simples de vídeo com texto/imagem para formato suportado pelo worker, com output versionado no UploadThing;
- editor visual fino para abrir a composition, ver layers/timeline, alterar propriedades básicas e usar Undo/Redo;
- PoC completa via MCP, sem automação de mouse/teclado.

### Fora do MVP

3D, câmeras, lights, partículas, masks/mattes, efeitos complexos, expressions, plugins, tracking, rotoscopia, Lottie editável, colaboração realtime, render GPU distribuído, import/export After Effects e geração autônoma sofisticada.

### Fallback honesto

Se o Spike não confirmar vídeo/áudio ou um backend headless, o MVP pode demonstrar render de composition text/image e registrar a capability ausente. Não pode marcar como pronto um codec, efeito ou backend que não passou pelo teste.

## 37. Critérios de aceite

### Produto

- O agente cria e reabre uma composition real por tools MCP e nenhum passo usa mouse, teclado ou coordenada.
- Alterar uma layer criada anteriormente funciona pelo `layerId`, mesmo após renomear a layer.
- Uma ação lógica de dezenas de operações aparece como uma entrada de Undo.
- O editor humano abre a mesma revisão e consegue alterar e desfazer o trabalho da IA.
- Conflito de revisão não sobrescreve edição humana.
- Preview e render apontam para revision/asset/checksum confirmados.
- O output aparece na tela de arquivos somente depois da confirmação do backend/storage.
- Visão usa `assetInputRef` com escopo e expiração; nenhuma URL assinada, segredo ou path local aparece no prompt, resultado da tool, trace ou log.
- Composição, preview, inspeção e aprovação funcionam em drawer/sheet em viewport estreita, sem rolagem horizontal essencial, com foco previsível e suporte a `prefers-reduced-motion`.

### Técnica

- `tools/list` e `tools/call` funcionam com schemas versionados e erros acionáveis.
- Cada erro usa código estável, informa `retryable`/`recovery`/`nextStep` e diferencia falha de schema, autorização, asset, revisão, budget, fila e renderer.
- Resources são paginados/selecionáveis e não enviam documento completo por padrão.
- Todas as mutações têm autenticação, policy, scope, workspace, resource ownership, budget e idempotência.
- Fila `RENDER` demonstra lease, heartbeat, retry técnico, cancelamento e dead-letter em testes.
- Render cancelado/falho não cria output falso e preserva a revisão.
- Preview e render usam o mesmo documento e passam por golden/round-trip tests nos casos suportados.
- Migration Prisma reproduz o schema em banco limpo e `prisma migrate status` é verificado.
- Nenhuma execução aceita path arbitrário, shell, expression JS ou credencial bruta.
- Traces registram modelo/provider/reasoning, tool calls, custo, revisão, worker e resultado.
- Trocar entre modelos elegíveis não exige duplicar uma skill; o trace registra perfil, provider efetivo, capabilities aplicadas e eventual rebaixamento pelo adapter.

### UX e acessibilidade

- Estados carregando, vazio, erro, sucesso, `WAITING_USER`, `WAITING_APPROVAL`, conflito e cancelamento são compreensíveis em pt-BR.
- O editor funciona em viewport estreita sem depender de rolagem horizontal para o fluxo essencial.
- Teclado, foco, toque e leitores de tela têm equivalência para inspector, timeline, preview e Undo.
- Drawers não focam inputs automaticamente nem abrem teclado sem ação explícita.
- Movimento respeita `prefers-reduced-motion` e nunca esconde erro ou espera.

## 38. Métricas de sucesso

- taxa de sucesso da PoC MCP ponta a ponta;
- `tool_accuracy` e taxa de operações rejeitadas por schema/policy;
- taxa de round-trip documento → engine → documento;
- divergência preview/final nos golden cases;
- p95 de inspect seletivo e de preview de frame;
- taxa de conflito de revisão e perda de operações, que deve ser zero por sobrescrita silenciosa;
- taxa de render concluído, cancelado e dead-letter;
- tempo em fila separado de tempo de execução;
- custo de preview/render por tarefa;
- `cost_per_successful_task` do agente de Motion Design;
- intervenções humanas, retries e número médio de iterações visuais;
- assets duplicados evitados por lineage;
- bugs de segurança encontrados em fuzzing de tools e inputs de mídia.

O benchmark compara `AgentPolicy x TaskPolicy x ModelAdapter x Seniority`, como na SPRINT-09-08, sem promover modelo por preço/token isolado.

## 39. Roadmap

### Fase A — Spike e decisão de engine

Confirmar representação, serialização, IDs, keyframes, histórico, assets, preview, render, Electron coupling, execução headless e licença. Esta fase não entrega capability de produto.

### Fase B — Documento e adapter mínimo

Criar documento canônico, migrations, IDs, operações 2D, adapter MIT e editor visual fino. Ainda sem render final produtivo.

### Fase C — MCP e controle operacional

Implementar servidor MCP, tools/resources, autorização, transactions, revisions, Undo/Redo, idempotência, audit e inspeção seletiva.

### Fase D — Preview/render

Conectar fila, worker Railway/RunPod Serverless, renderer headless validado, preview, output, UploadThing, eventos e cancelamento.

### Fase E — Especialista e PoC

Conectar `motion.graphics` ao SpecialistRegistry, skills, loop de visão, approval, entrega e interoperabilidade com assets.

### Fase F — Expansão posterior

Precomps, vídeo/áudio robustos, efeitos selecionados, masks/mattes, 3D, câmera/luz, partículas, expressions seguras, Lottie, imports/exports e GPU.

## 40. Dependências

### Obrigatórias para implementação produtiva

- `SPRINT-07-02` para UploadThing/asset metadata;
- `SPRINT-08-01` para projeto/tarefa canônicos;
- `SPRINT-08-02` para tela de arquivos e versões;
- `SPRINT-08-06` para notificações e encaminhamentos;
- `SPRINT-08-07` para approval/revisão;
- `SPRINT-08-08` para policy, takeover e escalonamento;
- `SPRINT-09-01` a `SPRINT-09-08` para AgentRuntime, gateway, identity, queues, memory, cost e benchmark;
- segurança de serviços da Fase 14;
- decisão jurídica sobre pacotes Premation.

### Não dependências

- `SPRINT-10-01` a `SPRINT-10-07` e Gate A0;
- `SPRINT-15-01`; o Spike e o contrato de motion não dependem desse agente futuro;
- `SPRINT-11-02`/`SPRINT-15-19` de imagem própria;
- `SPRINT-15-12` de edição de vídeo, embora o contrato de interoperabilidade deva ser alinhado;
- colaboração `SPRINT-16-01`.

O Spike pode ser **atemporal** e começar após a fundação mínima de plataforma, porque sua função é reduzir risco e não ligar o serviço ao produto. A implementação da Fase 15 continua pós-MVP. O caminho local de documento/preview pode avançar sem o deploy externo; o aceite de render remoto e da PoC completa depende da SVC.

## 41. Sprints de implementação

As novas sprints ficam subordinadas à `SPRINT-15-02`; não renumeram fases, não alteram a ordem do Gate A0 e não aumentam o `sprintCount` canônico da Fase 15. Cada uma possui documento próprio no diretório `docs/sprints/15-02-motion-design/`.

1. `SPRINT-15-02-SPIKE-01` — Premation boundary, license and headless validation.
2. `SPRINT-15-02-01` — Canonical motion document and minimal engine adapter.
3. `SPRINT-15-02-02` — Motion MCP, resources, transactions and revision history.
4. `SPRINT-15-02-SVC-01` — Private Motion MCP gateway on Railway and GPU/RENDER dispatch to RunPod Serverless.
5. `SPRINT-15-02-03` — Preview, render worker, assets and operational events.
6. `SPRINT-15-02-04` — Motion specialist, visual loop, approval and PoC.

`SPRINT-15-02-SPIKE-01` pode ser executada assim que Fase 09 e o ambiente de estudo estiverem disponíveis, sem bloquear o MVP. `SPRINT-15-02-01` e `SPRINT-15-02-02` podem avançar com adapters locais. `SPRINT-15-02-SVC-01` é obrigatória para o caminho remoto definido neste PRD e precede o render remoto de `SPRINT-15-02-03`; se o deploy estiver bloqueado, somente o caminho local/fixture pode ser demonstrado. A PoC completa não pode declarar render remoto concluído sem a SVC.

## 42. Backlog posterior

- precomps, composition instances, nesting e time remap;
- vídeo frame-accurate, audio waveform, sync e mixdown;
- shapes Bézier, trim/repeater/path operators;
- masks, track mattes, adjustment layers e efeitos selecionados;
- motion blur configurável, spring e roving keyframes;
- Lottie import/export e SVG animado editável;
- expressions sandboxed com linguagem declarativa limitada;
- câmeras, lights, 3D, PBR, glTF e partículas;
- tracking, rotoscopia, keying e VFX;
- plugin API sandboxed com permissões e assinatura;
- GPU worker, render distribuído, caching por frame e paralelismo;
- colaboração realtime, presence, comentários e merge semântico;
- import/export OTIO, FCPXML, MOGRT e formatos compatíveis após contrato estável;
- biblioteca de técnicas/skills versionada e avaliação automática de qualidade;
- editor visual completo com graph editor e ferramentas avançadas.

## 43. Questões em aberto

1. O parecer jurídico autoriza usar cada pacote MIT do Premation na topologia escolhida? Se não, qual subconjunto será reimplementado?
2. O Spike deve preferir um Chromium headless em worker CPU no Railway ou um renderer Node/OffscreenCanvas? Um caminho GPU só será avaliado como endpoint RunPod Serverless.
3. `SPRINT-08-01` terá um modelo `Project` próprio ou manterá `WorkspaceItem` como fonte temporária? O motion deve seguir a decisão dessa sprint.
4. UploadThing suportará o tamanho/duração dos previews e exports iniciais ou será necessário usar R2 desde o primeiro render pesado?
5. O render final exige approval sempre ou somente quando exceder budget, alterar entrega ou publicar externamente?
6. Qual conjunto mínimo de fontes licenciadas será oferecido no primeiro workspace?
7. O vídeo/audio entra no MVP após o Spike ou fica explicitamente em `SPRINT-15-02-03`?
8. A ferramenta do clone do Figma permanece necessária para o fluxo visual ou será apenas uma fonte de assets vetoriais consumidos pelo motion engine?
9. Qual serviço de outbox/event transport será escolhido quando `SPRINT-08-06` sair do estado local?
10. Qual política de retenção será aplicada a previews intermediários, snapshots e renders falhos?
11. O editor visual fino deve ser uma rota dedicada ou um drawer de projeto; a decisão deve preservar a regra de canvas e mobile-first.

## 44. Decisões técnicas registradas

### D-01 — Documento canônico próprio do Deskverse

**Decisão:** PostgreSQL/JSONB versionado do Deskverse é a fonte de verdade; `.motion` é intercâmbio opcional.
**Alternativas consideradas:** usar `.motion` como banco; usar Remotion source; armazenar somente MP4.
**Motivo:** `.motion` está pré-1.0 e local; Remotion não modela o mesmo documento semântico; MP4 não é editável.
**Trade-offs:** exige adapter, schema e migrations próprios.
**Impacto no MVP:** mais trabalho inicial, mas permite IDs, revisão, MCP e editor humano coerentes.
**Impacto futuro:** facilita trocar renderer e importar/exportar formatos.

### D-02 — Reusar somente módulos Premation isoláveis e licenciados

**Decisão:** usar packages MIT confirmados atrás de portas; não incorporar UI/Electron/`src/` AGPL sem aprovação.
**Alternativas consideradas:** fork completo; dependência do app desktop; reimplementação integral imediata.
**Motivo:** reduz risco de licença e mantém a arquitetura web/mobile do Deskverse.
**Trade-offs:** pode haver incompatibilidade e manutenção do adapter.
**Impacto no MVP:** o Spike é gate técnico e jurídico.
**Impacto futuro:** renderer/engine podem ser substituídos por capability profile.

### D-03 — MCP semântico com lote de operações

**Decisão:** poucas tools semânticas, principalmente `motion.document.apply`, com operações discriminadas e techniques registradas.
**Alternativas consideradas:** tool por clique/campo; uma tool genérica com prompt livre; dezenas de tools granulares.
**Motivo:** equilíbrio entre ergonomia do agente, validação, token budget e rastreabilidade.
**Trade-offs:** schema de batch é maior e exige mensagens de erro boas.
**Impacto no MVP:** cobre create/update/keyframes em uma API estável.
**Impacto futuro:** techniques e capabilities podem crescer sem mudar o transporte.

### D-04 — Optimistic concurrency e snapshots imutáveis

**Decisão:** `baseRevision` obrigatório, commit atômico, render fixo em revisão e conflito explícito.
**Alternativas consideradas:** lock global; last-write-wins; merge automático.
**Motivo:** locks falham com workers e usuários offline; last-write-wins perde trabalho; merge semântico exige conhecimento que não existe no MVP.
**Trade-offs:** conflitos exigem replanejamento.
**Impacto no MVP:** protege edição humana e simplifica auditoria.
**Impacto futuro:** permite branches e merge assistido.

### D-05 — Preview/render fora da função web

**Decisão:** preview local/worker e render final em `RENDER`, com Railway para CPU/browser e RunPod Serverless para GPU; Vercel apenas orquestra.
**Alternativas consideradas:** render dentro do Next; GPU sempre ligada; Remotion como render universal.
**Motivo:** limitações de tempo/DOM e regra de infraestrutura do Deskverse.
**Trade-offs:** exige serviço, fila, observabilidade e custo operacional.
**Impacto no MVP:** CPU/browser isolado e formatos simples.
**Impacto futuro:** GPU e workers especializados sem mudar o contrato.

### D-06 — Técnicas de alto nível fora do núcleo MCP

**Decisão:** `lower third`, `logo reveal`, `title sequence` e `kinetic typography` são skills/techniques versionadas aplicadas pelo batch, não tools hardcoded individuais.
**Alternativas consideradas:** uma tool por template; deixar o LLM inventar todas as curvas; templates arbitrários no servidor.
**Motivo:** qualidade e reutilização sem inflar a taxonomia nem esconder lógica no prompt.
**Trade-offs:** exige registry, versionamento e benchmark de techniques.
**Impacto no MVP:** nenhuma technique complexa é obrigatória; primitives provam a engine.
**Impacto futuro:** biblioteca de craft pode evoluir independentemente do MCP.

### D-07 — Remotion e FFmpeg como sistemas adjacentes

**Decisão:** Remotion permanece code-first/template; FFmpeg encode/transcode; motion document/renderer é a fonte editável.
**Alternativas consideradas:** usar Remotion para toda composição; usar FFmpeg como engine; duplicar um renderer no agente.
**Motivo:** separa intenção editável de processamento de arquivo e preserva decisões das SPRINT-15-02/15-12.
**Trade-offs:** haverá adapters e mais de um caminho de render no ecossistema.
**Impacto no MVP:** só o caminho motion é validado para PoC.
**Impacto futuro:** interoperabilidade explícita por artefact/revision adapters.

## Referências auditadas

- [AGENTS.md](../../../AGENTS.md)
- [README do produto](../../../README.md)
- [Status das sprints](../SPRINT_STATUS.md)
- [Manifesto](../00-meta/SPRINT_MANIFEST.json)
- [Supervisor](../00-meta/SUPERVISOR_PROMPT.md)
- [Guia de infraestrutura](../../GUIA_DE_INFRAESTRUTURA.md)
- [Fase 07](../07-onboarding-knowledge/README.md)
- [Fase 08](../08-work-and-human-loop/README.md)
- [Fase 09](../09-agent-execution/README.md)
- [Fase 10](../10-mvp-agents/README.md)
- [Fase 11](../11-integrations-and-planning/README.md)
- [Fase 15](../15-future-agents/README.md)
- [SPRINT-15-02](SPRINT-15-02.md)
- [SPRINT-15-12](../15-12-edicao-de-video/SPRINT-15-12.md)
- [SPRINT-15-13](../15-13-efeitos-visuais/SPRINT-15-13.md)
- [SPRINT-15-19](../15-19-plataforma-de-imagem/SPRINT-15-19.md)
- [Catálogo de skills](../../../agent-skills/README.md)
- [Premation](https://github.com/isroil01/premation), `v0.8.4`, `3cb7930d`
