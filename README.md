# Deskverse Sprint Pack

Fonte operacional do Deskverse, consolidada em 12/09/2026. O produto atual é um workspace web em canvas DOM para acompanhar profissionais independentes de IA que recebem tarefas próprias e podem colaborar quando isso fizer sentido para o resultado.

## Estado atual

- Fases 01–04: `COMPLETE_WITH_INTEGRATION_REQUIREMENTS` — fundação web, canvas, interações e presença local entregues.
- Fases 05 e 06: `COMPLETE_WITH_INTEGRATION_REQUIREMENTS` — experiência do escritório, conta, plataforma, autenticação, RBAC e contratos operacionais entregues.
- Próxima prioridade: `SPRINT-07-02 — Upload e armazenamento de arquivos`.
- Os materiais antigos de engine 3D/Stem permanecem apenas em `docs/sprints/retired/`; não são runtime paralelo do MVP web atual.

## Fonte de verdade

Leia nesta ordem:

1. `AGENTS.md`;
2. `docs/sprints/SPRINT_STATUS.md`;
3. `docs/sprints/00-meta/SPRINT_MANIFEST.json`;
4. o README e a sprint escolhida.

Cada agente de implementação recebe uma única sprint. Integrações entre sprints são registradas para o Supervisor; não são conectadas silenciosamente pelo agente subordinado.

## Produto e arquitetura

- O usuário escolhe funções e senioridade: Júnior, Pleno, Sênior ou Especialista.
- Líderes persistentes delegam por especialidade; especialistas são compartilhados e workers são execuções efêmeras.
- O Deskverse escolhe modelo, raciocínio, contexto, ferramentas e escalonamento semântico.
- Eve executa atrás de `AgentRuntime`; Vercel AI Gateway transporta a inferência atrás de `InferenceGateway`.
- A métrica econômica principal é `cost_per_successful_task`, não apenas preço por token.
- Permissões, ferramentas sensíveis, orçamento e aprovação são independentes da senioridade.
- O produto é pt-BR por padrão; termos técnicos ficam no código ou em áreas avançadas.

## Ordem do MVP de agentes

`tarefa independente` ou `colaboração explícita entre profissionais` → aprovação humana quando necessária → entrega.

No MVP, qualquer agente pode executar uma tarefa própria. Quando a tarefa pedir colaboração, os participantes e o motivo devem ser explícitos e rastreáveis; a presença de Mídias Sociais, Redator e Designer não cria um pipeline obrigatório. A Biblioteca de Assets da SPRINT-08-00 deve existir antes da criação do primeiro agente: o usuário cadastra áudio, vídeo, imagem, documento e outros formatos no storage vigente, descreve como e quando usar cada item e o disponibiliza aos agentes autorizados do workspace. Áudio, vídeo e música podem ser armazenados com metadados, mas sua interpretação semântica é futura. O Designer usa a API de imagens da OpenAI e o UploadThing; a plataforma própria de mídia entra depois, na SPRINT-15-19. A SPRINT-15-20 adiciona o Masterizador de Áudio para diagnóstico técnico e processamento não destrutivo de referências de áudio.

## Canais e escalação

WhatsApp e Instagram entram como canais nativos atrás de um núcleo de mensagens neutro ao provedor. As contas são autenticadas uma vez por espaço e atribuídas aos agentes com permissões por especialidade. A inbox unificada cobre mensagens, DMs e comentários; takeover humano só ocorre quando houver sinal confiável de coexistência, e a escalação segue agente → superior → humano com motivo e auditoria.

## Fases

| Caminho | Fase | Estado | Sprints |
|---|---|---|---:|
| `docs/sprints/completed/00-user-visual-concepts` | Direção visual histórica | arquivada | 1 |
| `docs/sprints/01-web-foundation` | Fundação Web | completa com integrações | 4 |
| `docs/sprints/02-canvas-foundation` | Fundamento do Canvas | completa com integrações | 4 |
| `docs/sprints/03-canvas-interactions` | Interações do Canvas | completa com integrações | 4 |
| `docs/sprints/04-people-and-activity` | Pessoas e atividade | completa com integrações | 4 |
| `docs/sprints/05-office-experience` | Experiência do Escritório | completa com integrações | 5 |
| `docs/sprints/06-account-platform` | Plataforma da conta | completa com integrações | 7 |
| `docs/sprints/07-onboarding-knowledge` | Onboarding e conhecimento | em execução | 7 |
| `docs/sprints/08-work-and-human-loop` | Trabalho e loop humano | planejada | 9 |
| `docs/sprints/09-agent-execution` | Execução de agentes | planejada | 8 |
| `docs/sprints/10-mvp-agents` | Agentes do MVP | planejada | 7 |
| `docs/sprints/11-integrations-and-planning` | Integrações e planejamento | planejada | 7 |
| `docs/sprints/12-billing-and-usage` | Billing e uso | planejada | 5 |
| `docs/sprints/13-public-site-and-guide` | Site público e guia | planejada | 4 |
| `docs/sprints/14-security-and-release` | Segurança e release | planejada | 8 |
| `docs/sprints/15-future-agents` | Agentes futuros | planejada | 20 |
| `docs/sprints/16-collaboration` | Colaboração | planejada | 1 |

São 103 prompts ativos, além da sprint histórica de conceitos visuais. A ordem dos agentes do MVP é de construção e não de execução. A reorientação do modelo, a Biblioteca de Assets e a inclusão do Masterizador de Áudio estão registradas em [docs/history/2026-09-16-modelo-de-agentes-e-referencias.md](docs/history/2026-09-16-modelo-de-agentes-e-referencias.md), [docs/history/2026-09-16-biblioteca-de-assets.md](docs/history/2026-09-16-biblioteca-de-assets.md) e [docs/history/2026-09-16-masterizador-de-audio.md](docs/history/2026-09-16-masterizador-de-audio.md).
