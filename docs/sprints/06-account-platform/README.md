# Fase 06 — Conta e Plataforma

## Prioridade de execução

Esta fase é a fundação operacional do MVP e, por override no manifesto, executa integralmente antes da Sprint 05-01. A Sprint 06-06 fecha a configuração de Neon, Redis, storage e contratos de serviços; os MCPs/workers concretos permanecem nas sprints funcionais e SVC que os requerem.

Construir a base de conta, organização e workspace que permite separar dados e controlar acesso sem contaminar o canvas com regras de infraestrutura.

Configuração de serviços: [EXTERNAL_SERVICES.md](EXTERNAL_SERVICES.md).

## Ordem

1. SPRINT-06-01 — Estrutura final da aplicação e limites de responsabilidade
2. SPRINT-06-02 — Banco de dados multi-tenant
3. SPRINT-06-03 — Autenticação e sessão
4. SPRINT-06-04 — Organizações workspaces e membros
5. SPRINT-06-05 — Permissões por função
6. SPRINT-06-06 — Configuração operacional da plataforma
7. SPRINT-06-07 — Shell autenticado e navegação

Convites e entrada de colaboradores não fazem parte da primeira entrega da plataforma. A SPRINT-16-01 só pode iniciar depois que os agentes do MVP existirem, mas é independente e não precisa aguardar o fim do roadmap.

A fase é executada na ordem indicada. Cada sprint entrega comportamento observável, usa dados mínimos necessários e registra integrações pendentes para o Supervisor.

## Limites

A experiência continua baseada em DOM, canvas full-screen com grade espacial de tiles e estados explícitos. Não entram engine 3D, modelos legados, runtime de jogo ou uma camada de contratos compartilhados.
