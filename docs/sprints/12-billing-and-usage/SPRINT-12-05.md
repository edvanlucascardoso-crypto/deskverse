# SPRINT-12-05 — Preferências de inteligência por função

**Fase:** 12 — Cobrança e Uso  
**Status inicial:** PLANNED  
**Dependências:** SPRINT-12-04  
**Superfície principal:** senioridade, autonomia, custo e overrides

## Objetivo

Dar ao usuário controle simples sobre inteligência e custo sem obrigá-lo a conhecer fornecedores de LLM.

## UI principal

Para cada função, permitir escolher:

- Júnior
- Pleno
- Sênior
- Especialista

Mostrar impacto relativo de custo/latência e descrição de autonomia cognitiva. Modelo físico fica em área avançada; defaults vêm da fase do agente e do benchmark.

Permitir ajustes por especialidade (ex.: Mídias Sociais usa Pesquisa Júnior e Texto Sênior) e limites mensais por função.

## Regras

- Senioridade controla reasoning/budget/contexto/iterações, não permissões.
- OpenAI e Anthropic nunca recebem `max`.
- Outros modelos podem receber `max` apenas se suportado e permitido pelo profile.
- Usuário pode fixar um modelo em modo avançado, mas recebe aviso de possível impacto em custo/qualidade e ainda passa pelo Vercel AI Gateway.


## Limites de capacidade

O plano pode definir tetos para execuções simultâneas por workspace e classe (`LLM`, navegador, CPU, GPU e render), além da capacidade dos especialistas. Esses tetos sobrescrevem os defaults da Fase 09 sem alterar prioridade/fairness. A UI chama isso de **Capacidade**, não `concurrency`. Upgrade pode aumentar capacidade; downgrade nunca cancela trabalho já em execução, apenas reduz novos despachos até voltar ao limite.

## Critérios de aceite

- Alterar senioridade por função e especialidade.
- Exibir nível de raciocínio solicitado/efetivo em detalhes técnicos.
- Estimativa usa dados reais recentes quando disponíveis.
- Preferência de modelo não ignora políticas, limites ou gateway.
