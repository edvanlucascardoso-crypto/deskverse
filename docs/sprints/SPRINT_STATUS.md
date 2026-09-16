# Status das Sprints

## Fonte de verdade

SPRINT_MANIFEST.json define a ordem, as dependências e o ambiente. Este arquivo registra a leitura operacional atual, sem substituir o manifesto.

## Estado atual

- Fase 00 — Direção visual: concluída e arquivada em `docs/sprints/completed/00-user-visual-concepts/`; não é dependência do runtime web atual.
- Fase 01 — Fundação Web: COMPLETE_WITH_INTEGRATION_REQUIREMENTS. A base local, shell, canvas de cards e fixtures foram entregues; integrações de plataforma seguem registradas na fase.
- Fase 02 — Fundamento do Canvas: COMPLETE_WITH_INTEGRATION_REQUIREMENTS. O canvas local entrega grupos, tipos, modos de foco, densidade e responsividade; persistência de layout permanece pendente.
- Fase 03 — Interações do Canvas: COMPLETE_WITH_INTEGRATION_REQUIREMENTS. O canvas local entrega zoom limitado, foco, multiseleção, arranjo por arraste/teclado, filtros e Drawer móvel; preferências e posição ainda não persistem.
- Fase 04 — Pessoas e atividade: COMPLETE_WITH_INTEGRATION_REQUIREMENTS. Cards locais de identidade e presença, todos os estados de trabalho, chat global, chat privado, reunião local, comunicação espacial sequencial e linha do tempo acionável foram entregues; fonte autenticada de presença, atividade persistida e transporte em tempo real permanecem como integração futura.
- Fase 05 — Experiência do Escritório: COMPLETE_WITH_INTEGRATION_REQUIREMENTS. Store local, atividade incremental, simulador, checkpoints, aprovação humana, recuperação e loop até entrega foram entregues; runtime real e evidência visual CUA aguardam ambiente integrado.
- Fase 06 — Conta e Plataforma: COMPLETE_WITH_INTEGRATION_REQUIREMENTS. Limites de aplicação, schema multi-tenant, migration pgvector, Better Auth, workspaces, membros, RBAC, contratos operacionais, healthcheck e shell protegido foram entregues; deploy da migration, serviços externos e evidência visual CUA aguardam ambiente integrado.
- Fase 07 — IN_PROGRESS. A SPRINT-07-01 está `COMPLETE_WITH_INTEGRATION_REQUIREMENTS`; as sprints seguintes permanecem planejadas. Fases 08–16 seguem PLANNED, reescritas para a dinâmica de canvas em grid de cards. A Fase 15 é pós-MVP e suas sprints não criam bloqueio implícito entre agentes nem bloqueiam a Fase 10; `SPRINT-15-02-SPIKE-01` é independente de `SPRINT-15-01`. A SPRINT-15-20 adiciona o agente futuro Masterizador de Áudio e seu serviço privado de análise/masterização em CPU.
- A SPRINT-08-00 — Biblioteca de Assets do workspace deve vir antes de `SPRINT-08-01`, `SPRINT-08-02` e de toda a Fase 10. Ela permite ao usuário armazenar assets no UploadThing vigente, inserir descrição de finalidade/uso e disponibilizar referências versionadas aos agentes autorizados do workspace.
- Antes de iniciar a criação dos agentes da Fase 10, a SPRINT-08-00 deve entregar a biblioteca criada pelo usuário e a SPRINT-08-02 deve entregar a tela de arquivos dos projetos com UploadThing, Data Table paginada com busca no desktop e lista de cards no mobile. A direção de 16/09/2026 acrescenta um gate anterior de referências no pedido: armazenamento, vínculo, permissão, compreensão de imagens/documentos e estado explícito para áudio/vídeo ainda não interpretados.
- Próxima sprint obrigatória: SPRINT-07-02 — Upload e armazenamento de arquivos. A SPRINT-07-01 entregou o contrato local de filas, jobs assíncronos, observação e pipeline de conhecimento; as integrações pendentes permanecem visíveis no relatório da sprint.
- O PRD e o grupo técnico da SPRINT-15-02 ficam na Fase 15 como trabalho pós-MVP. O Spike pode ser atemporal; nenhuma etapa de Motion MCP é requisito do Gate A0 ou da criação dos agentes da Fase 10.

O roadmap é validado por dependências, não apenas pelo número da fase. O Designer do MVP não depende de pipeline próprio de imagem: usa a API de imagens da OpenAI e UploadThing. A plataforma própria de imagem fica na SPRINT-15-19, posterior ao MVP. A SPRINT-15-20 também é posterior ao MVP e trata análise técnica e processamento de sinal; não habilita interpretação semântica de música.

## Ordem obrigatória do MVP de agentes

1. SPRINT-10-01 — Mídias Sociais
2. SPRINT-10-02 — Redator
3. SPRINT-10-03 — Designer
4. SPRINT-10-04 — colaboração opcional entre Mídias Sociais, Redator e Designer
5. SPRINT-10-05 — presença dos três no escritório
6. SPRINT-10-06 — primeira tarefa independente e primeira colaboração pós-onboarding
7. SPRINT-10-07 — experiência local integrada

Essa ordem registra a construção inicial, não um fluxo obrigatório. O Gate A0 precisa ser revisado para permitir tarefa `SOLO` ou `COLLABORATION`, com agente responsável escolhido, participantes e motivo rastreáveis. Mídias Sociais, Redator e Designer podem colaborar, mas nenhum é etapa obrigatória de toda tarefa. A senioridade é Júnior/Pleno/Sênior/Especialista e não altera permissões.

## Decisões incorporadas

- Eve será o runtime padrão atrás de `AgentRuntime`.
- Vercel AI Gateway será o gateway primário atrás de `InferenceGateway`.
- Model routing semântico pertence ao Deskverse; provider routing/failover técnico pertence ao gateway.
- Especialistas são compartilhados entre líderes; workers são efêmeros.
- A fila separa sessão do líder, especialidade compartilhada e classe física, com prioridade, FIFO por faixa, aging, fairness, limites de concorrência, backpressure, lease/heartbeat, retry técnico idempotente, deduplicação quando aplicável, dead-letter e cancelamento em cascata.
- `cost_per_successful_task` é o critério econômico primário para promover um modelo/profile; preço por token é apenas uma dimensão do trace.
- GPT-5.6 Luna é a única exceção OpenAI para `max`, condicionada a profile, provider efetivo e benchmark; GPT-5.6 Sol, os demais modelos OpenAI e Anthropic permanecem sem `max`.
- A revisão de neutralidade de fornecedor elevou Muse Spark 1.3 (`max`, quando suportado pelo caminho efetivo) a escalonador padrão dos agentes generalistas; DeepSeek V4.1 Flash deixou de ser restrito a microtarefas. GPT-5.6 Sol permanece apenas como último recurso quando não houver paridade comprovada ou o risco exigir.
- O Designer do MVP usa um orquestrador com API de imagens da OpenAI e UploadThing. Qwen-Image, FLUX.2 Klein e Image Editing Tool própria entram na plataforma de mídia posterior, com master aprovada e recomposição determinística.
- Neon é o banco transacional; Railway hospeda serviços, scheduler, Redis e workers CPU; RunPod Serverless hospeda jobs com GPU/RENDER; storage e execução ficam atrás de interfaces do Deskverse conforme `docs/GUIA_DE_INFRAESTRUTURA.md`.
- PRDs soltos de acesso, imagem e vídeo foram absorvidos nas sprints responsáveis e removidos para manter uma fonte operacional única.
- O Deskverse não é uma agência de marketing digital virtual: agentes são profissionais independentes, recebem tarefas próprias e colaboram apenas quando a tarefa pedir ou quando uma proposta de colaboração for aceita.
- A interpretação de áudio, vídeo e música é futura. Antes da Fase 10, imagens e documentos suportados devem ter base de acesso, extração/normalização, entendimento e montagem de contexto para agentes. A decisão e o histórico completo estão em [docs/history/2026-09-16-modelo-de-agentes-e-referencias.md](../history/2026-09-16-modelo-de-agentes-e-referencias.md).
- O Masterizador de Áudio entra como agente futuro na SPRINT-15-20. Sua competência é técnica: medir loudness/LUFS, true peak, clipping, dinâmica, ruído, espectro e estéreo, sugerir/realizar EQ, compressão, limitação e ganho e entregar versões comparáveis. A decisão é condicionada a benchmark e auditoria das licenças dos projetos open source; não é interpretação semântica de música.

## Colaboração

Convites não fazem parte da experiência inicial. A entrada de colaboradores pertence à SPRINT-16-01: ela só inicia depois da criação dos agentes do MVP, mas é uma sprint independente que pode ser implementada a qualquer momento depois disso.

## Motion

Comunicação entre agentes deve mover o card emissor para um slot adjacente ao destinatário e reacomodar os demais cards com animação fluida, suave e rápida, sem espera artificial.

## Regra de conclusão

Uma sprint só muda para COMPLETE após critérios, testes e evidências. Integrações pendentes ficam registradas e bloqueios não são escondidos movendo a sprint para completed.
