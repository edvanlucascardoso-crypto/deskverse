# Serviços externos — Fase 12

## Provedor obrigatório

Abacate Pay é o provedor oficial de billing. Nenhum checkout, assinatura ou entitlement deve ser implementado com Stripe ou outro substituto.

## Mapa por sprint

| Sprint | Serviço necessário |
|---|---|
| 12-01 | Abacate Pay + Neon + endpoint de webhook na Vercel |
| 12-02 | Neon | Entitlements e limites derivados do estado confirmado |
| 12-03 | Abacate Pay + Neon | Add-ons e alteração de capacidade |
| 12-04 | Neon + traces do Gateway | Ledger, custo e uso |
| 12-05 | Vercel AI Gateway + Neon | Preferências de modelo sem bypass de policy |

## Variáveis lógicas

Os nomes finais devem seguir o SDK/contrato adotado, mas o inventário deve conter pelo menos:

```env
ABACATE_PAY_API_KEY=
ABACATE_PAY_WEBHOOK_SECRET=
ABACATE_PAY_ENVIRONMENT=
DATABASE_URL=
```

Manter todas as credenciais somente no servidor. O checkout deve ser criado pelo backend e o cliente nunca é autoridade para plano, pagamento ou entitlement.

## Webhook e reconciliação

- Endpoint público apenas na API da Vercel, com validação de assinatura.
- Persistir evento recebido e chave de idempotência antes de aplicar a transição.
- Aceitar retries, duplicados e eventos fora de ordem sem conceder acesso indevido.
- Rodar reconciliação assíncrona pelo scheduler/worker CPU no Railway. RunPod Serverless não é necessário para reconciliação financeira.
- Registrar divergência, estado anterior, novo estado e próximo passo.

## Validação

Testar checkout cancelado, pagamento pendente, renovação, cancelamento, webhook duplicado, webhook inválido, falha do provider e retorno interrompido. Não usar credenciais reais em fixtures ou testes automatizados.
