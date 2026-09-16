# Serviços externos — Fase 05

## Decisão

A Fase 05 não cria nem exige um serviço externo próprio. Estado local, fixtures, simulador e eventos controlados são suficientes para desenvolver e demonstrar as cinco sprints.

O manifesto, porém, exige que a fundação da Fase 06 seja executada antes da SPRINT-05-01. Quando o escritório for ligado ao produto integrado, ele reutiliza os contratos e ambientes preparados na Fase 06.

## Mapa por sprint

| Sprint | Serviço novo | Configuração |
|---|---|---|
| 05-01 | Nenhum | Store e layout locais |
| 05-02 | Nenhum | Eventos locais/simulados |
| 05-03 | Nenhum | Simulador local de agentes |
| 05-04 | Nenhum | Adaptador persistente da Fase 06 quando integrado |
| 05-05 | Nenhum | Runtime real somente em fases posteriores |

## Quando executar a versão integrada

Reutilizar, sem duplicar credenciais:

- `DATABASE_URL` do Neon para dados persistidos;
- `REDIS_URL` do Redis no Railway somente quando houver fila real;
- `BETTER_AUTH_SECRET` e `BETTER_AUTH_URL` para o shell autenticado;
- `UPLOADTHING_TOKEN` somente para fluxos que já tenham artefatos confirmados.

O canvas não deve chamar fornecedor externo diretamente. A experiência pode continuar com fixtures enquanto os adaptadores de persistência, fila e runtime não estiverem prontos.

## Validação

- Desenvolver e demonstrar a fase sem credenciais externas.
- Testar loading, empty, error, success e `WAITING_USER` com fixtures.
- Confirmar que uma falha de integração preserva o último snapshot válido.

Não provisionar OpenAI, Eve, GPU, R2, canais ou billing para esta fase.
