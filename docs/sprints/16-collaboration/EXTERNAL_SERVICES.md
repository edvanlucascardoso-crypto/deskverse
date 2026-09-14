# Serviços externos — Fase 16

## Serviço novo condicional

A Fase 16 reutiliza Better Auth, Neon e as políticas da Fase 09. Para convite real por e-mail, porém, será necessário escolher um provedor SMTP ou API transacional; a sprint ainda não fixa qual.

## Mapa

| Necessidade | Serviço | Estado |
|---|---|---|
| Usuário, sessão e contexto | Better Auth + Neon | Reutilizado |
| Convite por e-mail | SMTP/API de e-mail | Provider pendente |
| Auditoria e expiração | Neon | Obrigatório |
| Link de aceite | Vercel/API | Obrigatório no ambiente publicado |

## Configuração do e-mail

Até a decisão do provider, usar um adapter e uma caixa de captura local para testes. Depois da escolha, as variáveis devem ficar somente no servidor e separadas por ambiente:

```env
INVITE_EMAIL_FROM=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
```

O token do convite deve ser de uso único, ter expiração, escopo de organização/workspace/papel e não conceder acesso antes do aceite autenticado. Não registrar token bruto em logs ou analytics.

## Validação

- Envio duplicado usa idempotency key.
- Convite expirado, cancelado, recusado e reenviado é auditável.
- Falha do provedor entra em estado recuperável e não cria acesso.
- Testes locais não enviam e-mail real.

Convites não bloqueiam o primeiro uso nem o MVP; o provider de e-mail pode ser configurado quando a sprint for iniciada.
