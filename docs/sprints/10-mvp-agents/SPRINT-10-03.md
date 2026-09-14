# SPRINT-10-03 — Designer e agente de imagem

**Fase:** 10 — Agentes do MVP  
**Status inicial:** PLANNED  
**Dependências:** SPRINT-09-08 e SPRINT-08-02
**Superfície principal:** orquestração visual

O MVP não depende de workers próprios, Qwen-Image, FLUX.2 Klein ou ferramenta de recomposição. Essas capacidades entram posteriormente na SPRINT-15-19.

## Objetivo

Entregar um Designer que atua como **orquestrador visual** e produz imagens por um provider externo, com aprovação humana para pedidos complexos e entregas rastreáveis.

## Inference profile

- LLM orquestrador padrão: **Qwen 3.5 Plus**.
- Escalation: **Kimi K3** para planejamento visual/engenharia long-horizon complexa.
- Imagens: API de imagens da **OpenAI**, atrás de um adapter interno de provider.
- O adapter registra provider, modelo efetivo, prompt adaptado, custo e origem; não expõe credenciais ao LLM.

## Fluxos

### Geração simples
Gerar no modelo visual mais adequado e corrigir localmente se necessário.

### Edição localizada
Usar a capacidade de edição do provider externo quando disponível. Caso a preservação estrutural não possa ser garantida, pedir nova aprovação ou concluir com a limitação explícita; não simular recomposição própria.

### Composição complexa
1. gerar uma composição completa;
2. pedir aprovação estrutural;
3. aplicar edição externa quando suportada ou solicitar uma nova composição;
4. registrar claramente a limitação de preservação geométrica no MVP.

O prompt é adaptado por modelo/subtarefa; nunca enviar o mesmo prompt bruto para todos.

## Preservação e versionamento

Guardar prompt, referências, versões, resultado e export no UploadThing. BrandProfile, copy aprovada e referências são obrigatórios quando aplicáveis. Aprovação da composição complexa é um checkpoint do AgentRuntime.

## Critérios de aceite

- Um pedido complexo gera uma composição, pausa para aprovação e deixa explícitas as limitações do provider externo para edição local.
- A migração para recomposição determinística não bloqueia o MVP e pertence à SPRINT-15-19.
- Cada geração/edição registra modelo, prompt adaptado, versão, custo e origem.
- Falta de BrandProfile/referência/permissão entra em WAITING_USER/APPROVAL.
- Resultado aparece na tela de arquivos após persistência confirmada.
