# SPRINT-08-08 — Políticas de autonomia e escalonamento

**Fase:** 08 — Trabalho e Loop Humano
**Status inicial:** PLANNED
**Dependências:** SPRINT-08-07
**Superfície principal:** limites, takeover humano e escalonamento

## Objetivo

Entregar limites, takeover humano e escalonamento como uma fatia utilizável do produto. A implementação deve ligar o comportamento à experiência do workspace, deixando explícitos os estados que o usuário pode observar e as decisões que pertencem a outra fase.

## Trabalho

1. Modelar o caminho principal de limites, takeover humano e escalonamento com dados mínimos e estados nomeados.
2. Implementar o caminho feliz, loading, empty, error e success, incluindo recuperação.
3. Exibir origem, responsável, última atualização e próximo passo quando esses dados existirem.
4. Manter regras próximas da feature, com tipos locais e fixtures pequenas, sem criar uma abstração transversal prematura.
5. Registrar em integration-requirements dependências, decisões ou mocks que precisem de integração posterior.

## Regras essenciais

- Políticas definem o que pode ser feito automaticamente, o que exige aprovação e quando escalar.
- Takeover humano interrompe novos envios e mostra o estado de controle.
- Escalonamento tem destino, motivo e fallback humano; não cria recursão.
- Toda permissão solicitada por um agente gera uma notificação em tempo real e feedback visual no card do agente até ser permitida, recusada, expirada ou cancelada.
- Alteração da própria configuração do agente nunca é aplicada silenciosamente: passa por tool, política de autorização, notificação e decisão registrada.

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
- Um pedido de permissão aparece em tempo real na central de notificações e no card do agente, com contexto suficiente para decidir.
- Permitir, recusar, expirar ou cancelar altera o estado do agente e do trabalho sem simular sucesso.
- A alteração de configuração de um agente só acontece após a permissão adequada e fica registrada no histórico.
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
