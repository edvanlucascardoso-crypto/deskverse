# PRD — Agente de fechamento comercial

**Capability:** `sales.closing`
**Tipo:** `SpecialistAgent` compartilhado
**Bloqueia MVP/Gate A0:** não

## Resultado

Comparar proposta com escopo aprovado, mapear objeções, preparar alternativas comerciais e organizar o fechamento. O agente não concede desconto, aceita termo jurídico, assina contrato ou cobra sem approval.

## Fluxo e tools

`opportunity.inspect` → `scope.check` → `objection.classify` → `proposal.draft` → `commercial_option.compare` → `approval.request` → `crm.update` → `billing.handoff`.

Valores devem vir de catálogo/billing autorizado. O draft registra moeda, impostos, validade, versão de escopo e responsável. O billing oficial continua sendo Abacate Pay quando a operação chegar a cobrança.

## Open source recomendado

- [SuiteCRM](https://github.com/SuiteCRM/SuiteCRM) com [API V8](https://docs.suitecrm.com/developer/integration-api/v8/endpoints/): connector para oportunidade, proposta e histórico usando OAuth2 e scopes mínimos.
- [EspoCRM](https://github.com/espocrm/espocrm): alternativa REST mais simples para instalação piloto; não sincronizar duas fontes sem regra de ownership.

## Aceite específico

- Toda proposta aponta para o escopo e preço autorizados.
- Desconto, contrato, assinatura e cobrança entram em `WAITING_APPROVAL`.
- Falha de CRM não duplica oportunidade nem altera o estado local confirmado.
