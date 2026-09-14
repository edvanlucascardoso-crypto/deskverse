# Integration requirements — Fase 05

Status: `COMPLETE_WITH_INTEGRATION_REQUIREMENTS`.

## Entregue

- Store local do escritório com restauração por workspace/usuário, estados `loading`, `empty`, `working`, `WAITING_USER`, `WAITING_APPROVAL`, `success` e `error`.
- Máquina de estados com checkpoint, origem, responsável, atualização, próximo passo, impacto e histórico de eventos.
- Drawer responsivo com stepper Entrada → Trabalho → Decisão → Entrega, ações de retomar, aprovar, revisar, retry e concluir.
- Cenários repetíveis de fluxo feliz, pergunta ao usuário, aprovação humana e falha técnica.
- Persistência local tolerante a falhas e preservação do snapshot válido em erro.
- Integração com o canvas existente por ação de fluxo na navbar e drawer sob demanda; nenhuma coluna permanente foi criada.
- Testes unitários do estado do escritório e dos caminhos de recuperação.

## Pendências de integração

1. Substituir o repositório local pela persistência de `OfficeRun`, `Approval` e `ActivityEvent` via Prisma quando a execução real estiver habilitada.
2. Ligar notificações em tempo real às mudanças de estado, mantendo `WAITING_USER` e `WAITING_APPROVAL` como checkpoints persistidos.
3. Conectar os eventos de agentes, fila e entrega ao feed global e ao reflow visual do canvas, preservando a ordem de um handoff por vez.
4. Ligar a entrega ao `AssetStorage`/UploadThing somente após o artefato estar confirmado e autorizado.
5. Repetir o roteiro de interface em navegador/CUA. A sessão não disponibilizou navegador; a cobertura local foi feita por smoke HTTP e testes unitários.

## Limites

O simulador não chama LLM, Eve, Redis, UploadThing, WhatsApp ou Instagram. Ele é deliberadamente local para validar a experiência antes da integração operacional.
