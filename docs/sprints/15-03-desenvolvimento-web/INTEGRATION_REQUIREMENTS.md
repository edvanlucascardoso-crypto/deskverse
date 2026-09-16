# Requisitos de integração — SPRINT-15-03

- Confirmar sandbox efêmero, limites de CPU/memória/tempo e política de filesystem.
- Integrar Git provider por token mínimo; merge, push, secrets, migration e deploy exigem approval.
- Isolar Playwright MCP e desabilitar JavaScript arbitrário/RCE; allowlist de origens.
- Integrar OpenHands somente atrás de adapter do `AgentRuntime`, sem runtime ou memória paralela.
- Evidenciar diff, comandos, testes, screenshots/trace e estado de recuperação.
