# Status das Sprints

## Fonte de verdade

SPRINT_MANIFEST.json define a ordem, as dependências e o ambiente. Este arquivo registra a leitura operacional atual, sem substituir o manifesto.

## Estado atual

- Fase 00 — Direção visual: concluída e arquivada em `docs/sprints/completed/00-user-visual-concepts/`; não é dependência do runtime web atual.
- Fase 01 — Fundação Web: COMPLETE_WITH_INTEGRATION_REQUIREMENTS. A base local, shell, canvas de cards e fixtures foram entregues; integrações de plataforma seguem registradas na fase.
- Fase 02 — Fundamento do Canvas: COMPLETE_WITH_INTEGRATION_REQUIREMENTS. O canvas local entrega grupos, tipos, modos de foco, densidade e responsividade; persistência de layout permanece pendente.
- Fase 03 — Interações do Canvas: COMPLETE_WITH_INTEGRATION_REQUIREMENTS. O canvas local entrega zoom limitado, foco, multiseleção, arranjo por arraste/teclado, filtros e Drawer móvel; preferências e posição ainda não persistem.
- Fase 04 — Pessoas e atividade: COMPLETE_WITH_INTEGRATION_REQUIREMENTS. Cards locais de identidade e presença, todos os estados de trabalho, chat global, chat privado, reunião local, comunicação espacial sequencial e linha do tempo acionável foram entregues; fonte autenticada de presença, atividade persistida e transporte em tempo real permanecem como integração futura.
- Fases 05–16: PLANNED, reescritas para a dinâmica de canvas em grid de cards. A Fase 15 é pós-MVP e seus agentes são independentes entre si; nunca bloqueiam a entrega dos agentes já estabelecidos da Fase 10.
- Antes de iniciar a criação dos agentes da Fase 10, a SPRINT-08-02 deve entregar a tela de arquivos dos projetos com UploadThing, Data Table paginada com busca no desktop e lista de cards no mobile.
- Próxima sprint obrigatória: SPRINT-06-01 — Estrutura final da aplicação e limites de responsabilidade. A sequência 06-01 a 06-07 é o override de plataforma que deve preceder a Sprint 05-01.

O roadmap é validado por dependências, não apenas pelo número da fase. O Designer do MVP não depende de pipeline próprio de imagem: usa a API de imagens da OpenAI e UploadThing. A plataforma própria de imagem fica na SPRINT-15-19, posterior ao MVP.

## Ordem obrigatória do MVP de agentes

1. SPRINT-10-01 — Mídias Sociais
2. SPRINT-10-02 — Redator
3. SPRINT-10-03 — Designer
4. SPRINT-10-04 — fluxo Mídias Sociais → Redator → Designer
5. SPRINT-10-05 — canvas de líderes e especialistas
6. SPRINT-10-06 — primeiro fluxo pós-onboarding
7. SPRINT-10-07 — experiência local integrada

Essa ordem preserva o Gate A0, agora com Social Media como `LeaderAgent` e Copy/Designer como especialistas compartilháveis. O Gate A0 é plano social → copy → design opcional → aprovação humana → entrega; sem Designer, o fallback é Social → Copy. A senioridade é Júnior/Pleno/Sênior/Especialista e não altera permissões.

## Decisões incorporadas

- Eve será o runtime padrão atrás de `AgentRuntime`.
- Vercel AI Gateway será o gateway primário atrás de `InferenceGateway`.
- Model routing semântico pertence ao Deskverse; provider routing/failover técnico pertence ao gateway.
- Especialistas são compartilhados entre líderes; workers são efêmeros.
- A fila separa sessão do líder, especialidade compartilhada e classe física, com prioridade, FIFO por faixa, aging, fairness, limites de concorrência, backpressure, lease/heartbeat, retry técnico idempotente, deduplicação quando aplicável, dead-letter e cancelamento em cascata.
- `cost_per_successful_task` é o critério econômico primário para promover um modelo/profile; preço por token é apenas uma dimensão do trace.
- O Designer do MVP usa um orquestrador com API de imagens da OpenAI e UploadThing. Qwen-Image, FLUX.2 Klein e Image Editing Tool própria entram na plataforma de mídia posterior, com master aprovada e recomposição determinística.
- Neon é o banco transacional; Northflank hospeda serviços e workers próprios posteriores; Redis, storage e GPU ficam atrás de interfaces do Deskverse conforme `docs/GUIA_DE_INFRAESTRUTURA.md`.
- PRDs soltos de acesso, imagem e vídeo foram absorvidos nas sprints responsáveis e removidos para manter uma fonte operacional única.

## Colaboração

Convites não fazem parte da experiência inicial. A entrada de colaboradores pertence à SPRINT-16-01: ela só inicia depois da criação dos agentes do MVP, mas é uma sprint independente que pode ser implementada a qualquer momento depois disso.

## Motion

Comunicação entre agentes deve mover o card emissor para um slot adjacente ao destinatário e reacomodar os demais cards com animação fluida, suave e rápida, sem espera artificial.

## Regra de conclusão

Uma sprint só muda para COMPLETE após critérios, testes e evidências. Integrações pendentes ficam registradas e bloqueios não são escondidos movendo a sprint para completed.
