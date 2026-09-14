# Fase 15 — Agentes Futuros

Adicionar funções sobre a mesma fundação da Fase 09. Todo agente futuro declara `kind`, capabilities, senioridade e `InferenceProfile`; especialistas devem ser reutilizados pela área compartilhada de Especialistas antes de criar capacidades duplicadas.

Configuração de serviços: [EXTERNAL_SERVICES.md](EXTERNAL_SERVICES.md).

## Regra de prioridade

Esta fase é um **catálogo pós-MVP**, não uma sequência bloqueante. O MVP é exclusivamente Mídias Sociais, Redator e Designer (Fase 10), mais seus gates técnicos já declarados. Nenhuma sprint 15-xx pode ser requisito, gate ou dependência implícita do MVP, da Fase 11 ou de release.

Cada agente futuro entra de forma independente após a fundação necessária estar concluída. Onde houver serviço próprio, a pasta `agents/<sprint>-<nome>/` agrupa a sprint funcional canônica e as sprints de MCP/API/worker no Northflank. Serviços compartilhados são reutilizados; não criar uma cópia por agente.

## Defaults de modelo por função

Defaults priorizam custo-benefício; o Deskverse Agent Benchmark pode substituí-los.

| Sprint / função | Modelo primário | Escalation/especialista |
|---|---|---|
| 15-01 Growth | Muse Spark 1.3 | Muse Spark 1.3 (`max`) |
| 15-02 Motion Design | Qwen 3.5 Plus | Kimi K3 |
| 15-03 Desenvolvimento Web | Claude Sonnet 5 | Muse Spark 1.3 (`max`) |
| 15-04 Tráfego | Muse Spark 1.3 | Muse Spark 1.3 (`max`) |
| 15-05 Contabilidade BR | Gemini 3.1 Pro | Muse Spark 1.3 (`max`) + aprovação humana; GPT-5.6 Sol somente último recurso |
| 15-06 Gestão | Muse Spark 1.3 | Muse Spark 1.3 (`max`) |
| 15-07 Pré-vendas/SDR | Muse Spark 1.3 | Muse Spark 1.3 (`max`) |
| 15-08 Fechamento | Muse Spark 1.3 | Muse Spark 1.3 (`max`) |
| 15-09 Pós-vendas | Muse Spark 1.3 | Muse Spark 1.3 (`max`) |
| 15-10 Atendimento | DeepSeek V4.1 Flash | Muse Spark 1.3 |
| 15-11 Gestão de Projetos | Muse Spark 1.3 | Muse Spark 1.3 (`max`) |
| 15-12 Edição de Vídeo | Qwen 3.5 Plus | Kimi K3 |
| 15-13 Efeitos Visuais | Qwen 3.5 Plus | Kimi K3 |
| 15-14 Controle Financeiro | Qwen 3.5 Plus | Gemini 3.1 Pro |
| 15-15 Dados e BI | Qwen 3.5 Plus | Gemini 3.1 Pro |
| 15-16 Inteligência de Mercado | Muse Spark 1.3 | Kimi K3 |
| 15-17 Observador humano | sem LLM obrigatório | — |
| 15-18 Liderança multi-grupo | Muse Spark 1.3 | Muse Spark 1.3 (`max`) |
| 15-19 Plataforma própria de imagem | — | — |

DeepSeek V4.1 Flash e Luna continuam elegíveis para classificação e transformação, mas o DeepSeek também pode assumir tarefas agentic de complexidade média e alto volume. Não promover modelo caro apenas por senioridade; primeiro aumentar reasoning/budget dentro do profile quando isso for mais eficiente.

## Arquivos e mídias

Artefatos persistentes são enviados ao storage por tool autorizada, vinculados a projeto/tarefa/run/versão/origem/agente e ficam consultáveis na tela de arquivos.

## Shared workforce

Especialistas como Pesquisa, Texto, Design, Análise de Dados, Revisão e Navegação são compartilhados por especialidade. Líderes mantêm preferência de senioridade por especialidade; workers físicos são efêmeros.

## Ordem de prioridade pós-MVP

1. Priorizar pelo valor validado e pela fundação disponível; a lista não cria dependência entre agentes.
2. Vídeo e VFX têm grupo de serviço próprio em `agents/15-12-edicao-de-video/` e `agents/15-13-efeitos-visuais/`.
3. SDR, Fechamento, Pós-vendas e Atendimento reutilizam o MCP de canais da Fase 11; não criam outro conector de WhatsApp.
4. A SPRINT-15-19 substitui gradualmente a API de imagens externa do MVP por Qwen-Image, FLUX.2 Klein e a Image Editing Tool própria, sem interromper os três primeiros agentes.
