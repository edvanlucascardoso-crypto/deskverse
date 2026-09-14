# Convenção de sprints de serviços externos

## Regra

Quando uma sprint funcional precisa de MCP, API, navegador, CPU, GPU, render ou conector hospedado fora da aplicação, criar o grupo abaixo no diretório da fase:

```text
<fase>/
  <sprint>-<agente-ou-integracao>/
    README.md
    services/
      SPRINT-<sprint>-SVC-01-<nome>.md
```

A sprint funcional continua canônica para experiência, regra de negócio e aceite do usuário. A sprint `SVC` define deploy, contrato e operação do serviço externo. Não duplicar requisito de produto entre os dois.

## Conteúdo obrigatório de uma SVC

- dependências e confirmação de que bloqueia ou não o MVP;
- serviço/provedor definido pela sprint, classe física e imagem/container quando aplicável;
- tool schema, autorização por workspace e idempotência;
- fila, lease/heartbeat, timeout, retry técnico, cancelamento e dead-letter;
- storage assinado para binários, segredos, logs/auditoria, healthcheck e custo;
- critérios de aceite operacionais e de isolamento.

## Reuso e limite

MCP é compartilhado por capability, não copiado por agente. `mcp-channels`, por exemplo, atende Mídias Sociais, SDR, Fechamento, Pós-vendas e Atendimento; cada agente só declara sua policy/aprovação.

Serviços de fases futuras são pós-MVP. Eles não entram no Gate A0, salvo gate técnico explicitamente declarado. Quando o fluxo MVP puder continuar com qualidade e segurança, registrar fallback sem a capacidade externa.
