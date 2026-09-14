# SPRINT-09-07 — Memória de trabalho dos agentes

**Fase:** 09 — Execução de Agentes
**Status inicial:** PLANNED
**Dependências:** SPRINT-09-06
**Superfície principal:** contexto, fatos, histórico e descarte seguro

## Objetivo

Entregar contexto, fatos, histórico e descarte seguro como uma fatia utilizável do produto usando PostgreSQL com pgvector como a base única de memória dos agentes. A implementação deve ligar o comportamento à experiência do workspace, deixando explícitos os estados que o usuário pode observar e as decisões que pertencem a outra fase.

## Memória única com pgvector

Todas as memórias dos agentes devem ser armazenadas no PostgreSQL com a extensão pgvector. Isso inclui memória compartilhada do workspace/projeto, memória individual de cada agente, fatos verificados, decisões, preferências, tarefas concluídas, instruções confirmadas, histórico útil e mensagens elegíveis do chat global. Não usar outro banco, cache ou serviço como fonte de memória persistente.

O corpus RAG de documentos do onboarding também usa PostgreSQL com pgvector, mas permanece separado logicamente da memória do agente: chunks preservam documento, versão, página/seção, origem e permissões; memória registra fatos e decisões derivados. Um agente não deve promover conteúdo de documento a fato confirmado sem origem e política apropriada.

Cada registro de memória deve preservar conteúdo, embedding, escopo, origem, agente que registrou, data, confiança, validade quando aplicável e relação com projeto, tarefa ou conversa. Memória privada não pode vazar para o chat global ou para outro agente sem permissão; memória compartilhada deve ser recuperável por todos os agentes autorizados.

Preferências alteradas, tarefas realizadas, decisões confirmadas e fatos importantes devem poder gerar uma gravação de memória. Na próxima execução, o agente deve recuperar somente o contexto relevante, informar conflitos ou desatualização e pedir confirmação quando a memória não for suficiente.

## Trabalho

1. Modelar o caminho principal de contexto, fatos, histórico e descarte seguro com dados mínimos e estados nomeados.
2. Implementar o caminho feliz, loading, empty, error e success, incluindo recuperação.
3. Exibir origem, responsável, última atualização e próximo passo quando esses dados existirem.
4. Manter regras próximas da feature, com tipos locais e fixtures pequenas, sem criar uma abstração transversal prematura.
5. Registrar em integration-requirements dependências, decisões ou mocks que precisem de integração posterior.

## Regras essenciais

- A memória separa contexto de execução, fatos verificados, histórico útil e descarte.
- O agente recebe somente o contexto necessário para a tarefa.
- Memória ausente, conflitante ou vencida vira pedido de confirmação.
- A extensão pgvector e as tabelas de memória são criadas ou alteradas por migrations Prisma versionadas.
- O chat global pode contribuir para a memória compartilhada; chats privados permanecem no escopo autorizado.
- Escritas repetidas da mesma preferência, tarefa ou decisão são idempotentes e mantêm origem e versão.

## Incluído

- Código funcional na superfície indicada.
- Fixtures locais ou persistência mínima necessária para demonstrar a sprint.
- Feedback de foco, seleção, erro, espera e conclusão.
- Relatório de conclusão com evidências e pendências.

## Não incluído

Escopo de fases posteriores, publicação externa, cobrança, dados inventados, engine visual paralela ou mudança silenciosa de produto.

## Entregáveis

Implementação, testes proporcionais ao risco, roteiro de demonstração e instruções para executar a validação local.

## Critérios de aceite

- O fluxo principal funciona do início ao fim.
- Todas as categorias de memória usam PostgreSQL com pgvector, sem armazenamento paralelo de memória.
- Um agente consegue lembrar uma preferência alterada, uma tarefa concluída e uma decisão confirmada em uma execução posterior, respeitando escopo e autorização.
- Todos os agentes autorizados conseguem recuperar memória compartilhada relevante derivada do chat global.
- Conflito, expiração, baixa confiança ou ausência de contexto geram aviso/notificação e pedido de confirmação, com feedback no card quando a execução ficar bloqueada.
- O schema de memória e a extensão pgvector são reproduzíveis por migrations Prisma em banco local limpo.
- Estados vazio, carregando, erro e sucesso são compreensíveis.
- A tela permanece utilizável com teclado e viewport estreita.
- Falhas parciais não apagam dados válidos nem deixam a interface travada.
- Não há dependência de WebGL, engine 3D, modelos legados, Stem ou jogo.
- Lint, typecheck e build passam.
- O relatório lista integrações pendentes e limites da entrega.

## Verificação

Executar instalação e scripts de qualidade, percorrer o fluxo no navegador e testar fixtures vazias, completas e com falha. Registrar a evidência no relatório da sprint.

## Critério de conclusão

## Motion e imersão

As transições devem ser fluidas, suaves e rápidas: comunicar causa, destino e estado sem criar espera artificial. O movimento deve preservar o contexto espacial e respeitar prefers-reduced-motion.

Usar COMPLETE quando todos os critérios forem demonstrados. Usar COMPLETE_WITH_INTEGRATION_REQUIREMENTS quando só restarem integrações registradas; manter bloqueios visíveis quando dependerem de uma decisão externa.
