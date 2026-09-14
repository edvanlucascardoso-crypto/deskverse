# SPRINT-07-05 — Busca semântica da base de conhecimento

**Fase:** 07 — Onboarding e Conhecimento
**Status inicial:** PLANNED
**Dependências:** SPRINT-07-04
**Superfície principal:** indexação, consulta, resultados e ausência de evidência

## Objetivo

Entregar o RAG do workspace: indexação de Markdown normalizado, consulta, resultados com evidência e ausência de evidência. A base usa PostgreSQL com pgvector e respeita isolamento por workspace e permissões de recurso.

## RAG de documentos

`Markdown confirmado → chunks estruturais → embeddings → pgvector → recuperação com fontes → contexto mínimo do agente`

- Dividir pelo contexto estrutural primeiro — título, subtítulo, página, lista e tabela — e só então por tamanho; nunca separar linha de tabela, item de lista ou bloco de código sem preservar continuidade.
- Usar alvo de 600 tokens por chunk, faixa de 350–900 tokens e sobreposição de até 100 tokens apenas quando a divisão não for naturalmente semântica.
- Cada chunk registra `workspaceId`, documento/versão, página, caminho de títulos, offsets, conteúdo, checksum, embedding, confiança da extração e permissões herdadas do arquivo.
- Recuperar por busca híbrida: filtro obrigatório de workspace/permissão, busca textual e similaridade vetorial; reranking só atua nos candidatos já autorizados.
- O agente recebe somente os trechos necessários, com título do documento e referência de página/seção. Quando não houver evidência suficiente, deve informar isso e pedir contexto, nunca inventar um fato.
- Reindexação por nova versão é idempotente e não mistura chunks antigos com a versão ativa.

## Trabalho

1. Criar chunks somente a partir do Markdown canônico confirmado.
2. Gerar embeddings e indexar no PostgreSQL com pgvector.
3. Recuperar trechos autorizados com fonte/página/seção e ausência de evidência explícita.
4. Implementar o caminho feliz, loading, empty, error e success, incluindo recuperação.
5. Registrar em integration-requirements dependências, decisões ou mocks que precisem de integração posterior.

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
- Uma pergunta respondida por documento retorna os chunks utilizados e suas referências de página/seção.
- Uma pergunta sem base suficiente retorna ausência de evidência, sem resposta inventada.
- Busca de um workspace nunca recupera chunk ou metadado de outro workspace.
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
