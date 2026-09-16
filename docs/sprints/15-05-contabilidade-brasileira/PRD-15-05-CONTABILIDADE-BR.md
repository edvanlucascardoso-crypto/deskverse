# PRD — Agente de contabilidade brasileira

**Capability:** `accounting.br`
**Tipo:** `SpecialistAgent` com revisão humana obrigatória em atos fiscais
**Bloqueia MVP/Gate A0:** não

## Resultado

Classificar documentos, extrair campos, apontar inconsistências e preparar rascunhos de documentos fiscais/contábeis com base legal e confiança. O agente não substitui contador, não assina certificado e não transmite documento automaticamente.

## Fluxo e tools

`document.ingest` → `field.extract` → `classification.suggest` → `tax.validate` → `exception.explain` → `draft.prepare` → `human.review` → `export/upload`.

PDF/XML e certificado entram por referências de asset; OCR e parser rodam em worker isolado. A tool fiscal versiona UF, município, schema, vigência, regra aplicada e origem. Assinatura/transmissão ficam em tool protegida, com approval e credencial fora do LLM.

## Open source recomendado

- [sped-nfe](https://github.com/nfephp-org/sped-nfe): adapter fiscal para NF-e e comunicação com SEFAZ, após validar versão, certificado, ambiente e cobertura da operação.
- [NFePHP](https://nfephp-org.github.io/nfephp/): referência histórica; o repositório `nfephp` antigo está marcado como deprecated, portanto não deve ser adotado como dependência principal.

## Aceite específico

- Nenhum campo fiscal ausente é inventado; a pendência vira ressalva.
- O agente mostra regra, versão e confiança de cada classificação.
- Documentos assinados/transmitidos só após aprovação de profissional autorizado.
- XML, relatório e trilha de auditoria ficam versionados no UploadThing/banco.
