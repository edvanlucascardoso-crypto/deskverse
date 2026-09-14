# Serviços externos — Fase 13

## Mapa por sprint

| Sprint | Serviço necessário | Estado |
|---|---|---|
| 13-01 | Nenhum novo | Style guide e arquitetura locais |
| 13-02 | Vercel + domínio/DNS | Publicação da landing |
| 13-03 | Vercel | Guia e conteúdo público |
| 13-04 | Analytics/consentimento | Provider ainda não escolhido |

## Vercel

Usar o projeto Vercel já associado ao app público, com domínio e variáveis separadas por ambiente. O site não deve expor segredos de Neon, Redis, UploadThing, Gateway ou providers de IA.

## Analytics e conversão

A SPRINT-13-04 exige eventos, consentimento e funil, mas não escolhe fornecedor. Antes de instalar SDK externo, registrar a decisão de produto sobre:

- provider e região de processamento;
- eventos permitidos e dados pessoais excluídos;
- consentimento, opt-out e retenção;
- domínio de envio e bloqueio antes do consentimento;
- ambiente de teste separado da produção.

Até essa decisão, usar um adapter de analytics e fixtures locais. Não enviar identificadores de workspace, conversa, prompt ou conteúdo de agente para analytics público.

## Validação

- Metadata, sitemap e robots não dependem de analytics.
- O funil permanece funcional com analytics indisponível.
- Eventos não duplicam em retry.
- Nenhum script externo roda antes do consentimento exigido.
