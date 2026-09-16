# Grupo 15-13 — Efeitos visuais

Sprint funcional canônica: [SPRINT-15-13](SPRINT-15-13.md). O detalhamento do produto e da integração está no [PRD do agente](PRD-15-13-VFX-HIGGSFIELD-MCP.md). O agente reutiliza o serviço de vídeo, sem novo pipeline paralelo.

## Decisão de integração

O agente usa o MCP oficial hospedado do Higgsfield, por OAuth, atrás de um broker privado do Deskverse. O endpoint oficial é `https://mcp.higgsfield.ai/mcp`; o conector é proprietário, consome créditos da conta Higgsfield em toda geração e não deve ser tratado como código open source incorporável. O agente não chama esse endpoint diretamente a partir do browser ou do LLM.

O broker expõe ao Deskverse somente operações tipadas, aplica workspace, capability, approval, budget, idempotência e auditoria, e transforma os resultados externos em `AssetVersion`/lineage do Deskverse. O usuário consulta os arquivos confirmados na tela de arquivos; não recebe um painel MCP público.

## Serviço associado

- [Extensão VFX](services/SPRINT-15-13-SVC-01-vfx-extension.md), adicionada ao mesmo contrato de vídeo/mídia.
- [Requisitos de integração](INTEGRATION_REQUIREMENTS.md), com riscos, pendências e critérios de liberação.
- [Serviços externos](EXTERNAL_SERVICES.md), com configuração operacional.

## Ordem de trabalho

1. Validar OAuth, catálogo de operações, saldo, custo e retorno de jobs no Spike.
2. Implementar o contrato VFX neutro ao provider e o broker Higgsfield.
3. Conectar assets, referências, preview, aprovação e armazenamento.
4. Validar fallback e ferramentas open source isoladas sem promover dependência sem revisão jurídica.
