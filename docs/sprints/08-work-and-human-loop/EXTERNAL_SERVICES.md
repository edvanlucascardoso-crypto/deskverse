# Serviços externos — Fase 08

## Serviços reutilizados

Esta fase usa Neon, Redis Northflank e UploadThing preparados nas Fases 06 e 07. UploadThing é o storage do MVP; Pydio Cells hospedado no Northflank é uma migração posterior de gerenciamento de arquivos. Não há um provedor obrigatório novo para o loop humano.

A base local do escritório já define o contrato de evento, aprovação e idempotência, mas ainda não escolhe nem adiciona um provedor de transporte. O sink de eventos será ligado ao Neon/Prisma e ao transporte em tempo real apenas nas sprints de integração correspondentes.

## Mapa por sprint

| Sprint | Serviço necessário | Observação |
|---|---|---|
| 08-01 | Neon | Projetos, planos, tarefas e histórico somente leitura |
| 08-02 | UploadThing + Neon | Tela de arquivos; conteúdo no storage e metadados no banco |
| 08-03 | Neon | Entregas, revisão e versões |
| 08-04 | Neon + notificações | Pedidos humanos e brief refinado |
| 08-05 | Neon | Caixa de entrada e priorização |
| 08-06 | Neon + transporte em tempo real | Provider ainda não definido; histórico deve funcionar sem tempo real |
| 08-07 | Neon | Aprovação, rejeição, pausa e retomada |
| 08-08 | Neon + transporte em tempo real | Takeover e escalonamento |

## Storage na SPRINT-08-02

Usar o token do ambiente correto:

```env
UPLOADTHING_TOKEN=
DATABASE_URL=
```

Somente tools autorizadas dos agentes enviam arquivos. O usuário consulta, mas não faz upload, edição ou exclusão pela tela de arquivos.

A tela deve depender de `AssetRepository`/`AssetStorage`, não de detalhes do UploadThing. Na migração pós-MVP, o Pydio Cells será executado em serviço privado no Northflank; referências, versões, autorização, lineage e metadados continuam no Neon. Não iniciar a migração dentro da SPRINT-08-02 nem exigir Pydio para o Gate A0.

## Notificações em tempo real

O contrato deve separar:

1. persistência confirmada no Neon;
2. entrega em tempo real;
3. fallback por consulta cursor-based.

Ainda não há fornecedor aprovado para WebSocket, SSE ou serviço de eventos. Não adicionar uma dependência externa silenciosamente. A escolha deve considerar o runtime da Vercel, reconexão, ordenação, deduplicação e custo.

Eventos operacionais não devem abrir uma conversa por padrão. `conversationId` é uma correlação opcional para casos que exigem pergunta, refinamento, colaboração ou revisão; a notificação continua sendo o canal de roteamento do evento.

## Validação

- Um evento confirmado aparece no card e no histórico.
- Queda do transporte não apaga notificações persistidas.
- Reconexão e eventos duplicados são idempotentes.
- Upload só aparece após confirmação do backend.
- Nenhum fluxo de aprovação mostra sucesso antes da confirmação durável.
- Aprovações múltiplas são itens independentes: cada uma tem `approvalId`, material/versão, motivo, estado e decisão; a ação protegida só é liberada quando todas as aprovações obrigatórias estiverem confirmadas.

Redis real só é necessário quando o fluxo usar jobs assíncronos; a interface deve continuar demonstrável com fixtures durante a implementação da fase.
