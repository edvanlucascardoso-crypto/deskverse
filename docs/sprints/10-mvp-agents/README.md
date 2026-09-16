# Fase 10 — Agentes do MVP

Pré-requisitos: Fase 09 completa e tela de arquivos da SPRINT-08-02 disponível. O Designer do MVP usa a API de imagens da OpenAI e não depende da plataforma própria de mídia.

Configuração de serviços: [EXTERNAL_SERVICES.md](EXTERNAL_SERVICES.md).

## Estrutura do MVP

No produto, **Mídias Sociais é o líder**. `Copywriter` e `Designer` continuam como nomes técnicos internos; na interface aparecem como **Redator** e **Designer**, ambos especialistas compartilháveis. O fluxo visível é:

`Mídias Sociais -> Redator -> Designer opcional -> aprovação -> entrega`.

### Nomes do MVP na interface

| Identidade técnica | Nome visível |
|---|---|
| `SocialMediaLead` | **Mídias Sociais** |
| `CopywriterSpecialist` | **Redator** |
| `DesignerSpecialist` | **Designer** |

Não exibir `Lead`, `Specialist`, `Agent`, `Pool` ou nomes de classe ao usuário.

Todo agente usa chat/global privado, notificações, memória pgvector e AgentRuntime da Fase 09.

## Modelos padrão orientados a custo

O modelo é um **default**, não vendor lock-in. O benchmark da SPRINT-09-08 pode promover outro profile.

| Função | Modelo primário | Escalation | Motivo |
|---|---|---|---|
| Mídias Sociais | Muse Spark 1.3 | Muse Spark 1.3 (`max`) | mesmo perfil generalista com maior esforço; GPT-5.6 Sol fica como último recurso |
| Redator | Qwen 3.5 Plus | Muse Spark 1.3 | custo baixo e boa capacidade geral/multimodal |
| Designer | Qwen 3.5 Plus | Kimi K3 | visão + ferramentas baratas; Kimi para tarefas visuais longas/complexas |

DeepSeek V4.1 Flash é um generalista econômico para tarefas agentic de complexidade média e alto volume; GPT-5.6 Luna pode executar transformações estruturadas. Ambos podem usar `max` quando o profile, o provider efetivo e o benchmark permitirem, sem mudar a identidade lógica do agente. Isso se refere aos LLMs de inferência, não aos modelos de imagem da SPRINT-15-19.

## Senioridade

Cada função permite Júnior, Pleno, Sênior e Especialista. O usuário escolhe o nível por função e pode sobrescrever a senioridade de uma capability. Senioridade não altera permissões.

## Ordem

1. Mídias Sociais
2. Redator
3. Designer
4. fluxo Social -> Copy -> Designer
5. presença + Especialistas no canvas
6. primeiro fluxo pós-onboarding
7. experiência local integrada

## Gate A0

Demonstrar delegação por especialidade, aprovação humana, artefato rastreável, especialistas compartilhados e custo/trace completo. Sem Designer, degradar para Mídias Sociais -> Redator.

## Mídia no MVP

Mídias Sociais, Redator e Designer usam serviços externos prontos: UploadThing para arquivos e API de imagens da OpenAI para geração/edição visual. A plataforma própria com Qwen-Image, FLUX.2 Klein, Image Editing Tool, Cloudflare R2, serviços Railway e workers GPU no RunPod Serverless é posterior ao Gate A0 e está registrada na SPRINT-15-19.
