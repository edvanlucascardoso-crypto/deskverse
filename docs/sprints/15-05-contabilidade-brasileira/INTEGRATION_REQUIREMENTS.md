# Requisitos de integração — SPRINT-15-05

- Validar schemas, ambientes homologação/produção e regras UF/município vigentes.
- Confirmar uso de `sped-nfe` e componentes relacionados; não adotar o repositório NFePHP deprecated.
- Implementar certificado em secret manager/HSM ou provider autorizado, nunca no LLM.
- Approval de contador para assinatura, transmissão, cancelamento e carta de correção.
- Cobrir XML inválido, duplicidade, indisponibilidade SEFAZ, rejeição e retificação sem apagar documento anterior.
