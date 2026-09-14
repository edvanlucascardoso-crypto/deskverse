# Fase 05 — Experiência do Escritório

Transformar o canvas em uma experiência de escritório observável, com estado local, atividade e um simulador seguro para desenvolver a interface antes do runtime real.

Configuração de serviços: [EXTERNAL_SERVICES.md](EXTERNAL_SERVICES.md).

## Ordem

1. SPRINT-05-01 — Estado local do escritório
2. SPRINT-05-02 — Fluxo de atividade e atualização da tela
3. SPRINT-05-03 — Simulador de agentes para desenvolvimento
4. SPRINT-05-04 — Escritório persistente e painéis laterais
5. SPRINT-05-05 — Loop completo do produto

A fase é executada na ordem indicada. Cada sprint entrega comportamento observável, usa dados mínimos necessários e registra integrações pendentes para o Supervisor.

Atividade entre agentes deve ser percebida no grid por animações fluidas, suaves e rápidas, sem deslocamentos aleatórios ou espera artificial.

## Limites

A experiência continua baseada em DOM, canvas full-screen com grade espacial de tiles e estados explícitos. Não entram engine 3D, modelos legados, runtime de jogo ou uma camada de contratos compartilhados.
