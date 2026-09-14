# SPRINT-09-01 — Cadastro, tipos, capacidades e senioridade

**Fase:** 09 — Execução de Agentes  
**Status inicial:** PLANNED  
**Dependências:** nenhuma  
**Superfície principal:** catálogo declarativo de agentes e capacidades

## Objetivo

Criar o catálogo que define o que cada agente é, sabe fazer e pode solicitar, sem acoplar regra de negócio a um modelo específico.

## Modelo mínimo

Cada `AgentDefinition` deve declarar:

- `kind`: `leader | specialist | worker`;
- `displayNamePtBR` curto e obrigatório para qualquer nome visível ao usuário;
- papel, instruções e capacidades;
- tools possíveis e política de autorização;
- senioridade padrão e níveis permitidos;
- `InferenceProfile` padrão, fallback e limites de custo;
- superior/escalonamento, quando existir;
- estilos configuráveis quando aplicável.

Criar `CapabilityDefinition` e `SpecialistRegistry`. Líderes pedem `delegate({ capability, task, seniority })`; o runtime resolve o especialista/worker. Não codificar `callAgent("researcher-04")` como regra de produto.

## Senioridade

Suportar **Júnior, Pleno, Sênior e Especialista**. O nível escolhido pelo usuário é persistido por função e pode ter overrides por capacidade. Senioridade controla reasoning/budget/iterações/contexto, nunca scopes ou ações sensíveis.

## Regras

- Catálogo e descoberta são determinísticos por workspace.
- `Agent Core` contém objetivo, estado, memória, tools, permissões e critério de sucesso; não conhece SDK de fornecedor.
- Especialistas são lógicos e compartilhados; workers podem escalar horizontalmente sem criar novos cards persistentes.
- Pessoas usuárias podem criar líderes personalizados e configurar suas capacidades de apoio (incluindo perfis de subagentes). Essas configurações pertencem ao líder; os subagentes/worker continuam lógicos e não surgem como cards persistentes no canvas.
- Estilos de Mídias Sociais, Design e Vídeo continuam selecionáveis e independentes da senioridade.
- Nome técnico, `kind`, capability e IDs podem permanecer em inglês no código; a interface usa `displayNamePtBR` e o glossário oficial da Fase 13.

## Critérios de aceite

- Cadastrar e listar líderes, especialistas e workers com `displayNamePtBR` válido.
- Alterar senioridade de uma função sem alterar permissões.
- Um líder delega por capability e o registry resolve um especialista elegível.
- O mesmo especialista lógico pode atender dois líderes e expor fila/concorrência sem duplicar identidade.
- Lint, typecheck, build e testes passam.
