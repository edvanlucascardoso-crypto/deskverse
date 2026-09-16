# PRD — Agente de controle financeiro

**Capability:** `finance.control`
**Tipo:** `SpecialistAgent` com approval para atos financeiros
**Bloqueia MVP/Gate A0:** não

## Resultado

Consolidar fluxo de caixa, categorias, alertas e conciliação sugerida com origem, período e confiança. O agente não faz transferência, pagamento ou alteração bancária irreversível.

## Fluxo e tools

`account.read` → `transaction.import` → `categorize.suggest` → `reconcile.propose` → `cashflow.forecast` → `alert.create` → `human.review` → `export`.

Valores monetários usam decimal/currency explícitos, nunca float no domínio. Importação é idempotente por external ID/fingerprint. A tool de escrita exige approval, policy, conexão e confirmação do provider.

## Open source recomendado

- [Firefly III](https://github.com/firefly-iii/firefly-iii): connector de leitura/importação e relatórios; a licença AGPL e a compatibilidade dos módulos devem ser avaliadas antes de self-host/incorporação.
- [Firefly III API](https://github.com/firefly-iii/firefly-iii/tree/main/docs): usar API/adapter, sem acessar banco externo diretamente.

## Aceite específico

- Saldo, forecast e alerta mostram data de corte e origem.
- Duplicata, transação pendente e moeda desconhecida não viram lançamento confirmado.
- Nenhuma tool chama Abacate Pay fora do fluxo oficial de billing.
