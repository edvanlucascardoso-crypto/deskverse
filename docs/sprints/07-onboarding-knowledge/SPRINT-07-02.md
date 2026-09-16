# SPRINT-07-02 — Upload e armazenamento de arquivos

**Fase:** 07 — Onboarding e Conhecimento
**Status inicial:** PLANNED
**Dependências:** SPRINT-07-01
**Superfície principal:** upload, validação, armazenamento, acesso e remoção

## Objetivo

Entregar upload, validação, armazenamento, acesso e remoção como uma fatia utilizável do produto. A implementação deve ligar o comportamento à experiência do workspace, deixando explícitos os estados que o usuário pode observar e as decisões que pertencem a outra fase.

## Arquivo-fonte do conhecimento

O arquivo original enviado pela pessoa usuária fica no UploadThing e nunca é substituído pelo conteúdo extraído. Cada upload cria `Document` e `DocumentVersion` isolados por `workspaceId`, com hash, MIME type, tamanho, origem, data e estado de processamento. O upload confirmado apenas inicia a fila de conhecimento; ele não significa que o documento já está disponível para busca pelos agentes.

O arquivo pode ser removido da lista e do storage somente com autorização do workspace. Essa remoção é independente do ciclo de vida do RAG: apagar o RAG não apaga os originais nem as conversões versionadas, que continuam disponíveis para uma nova indexação explícita.

## Formatos e conversão obrigatória

O upload deve preservar o original e iniciar um adapter de conversão conforme o formato. Nenhum arquivo entra no RAG diretamente:

- PDF é convertido para Markdown canônico, preservando página, títulos, listas, tabelas, links, imagens referenciadas e confiança de OCR quando aplicável.
- Word `.docx` é convertido para Markdown canônico, preservando títulos, listas, tabelas e links. `.doc` sem conversor compatível fica em falha recuperável, sem fingir que foi compreendido.
- XLSX/XLS é convertido primeiro para CSV versionado por planilha e também para uma representação Markdown tabular usada no chunking. A grafia aceita no contrato é `XLSX`.
- TXT, CSV, HTML, Markdown e JSON entram por normalização textual determinística.
- Áudio é apenas armazenado nesta etapa e encaminhado para o fluxo de transcrição da SPRINT-07-04; o original nunca é sobrescrito.

O estado `READY` só pode ser atribuído depois da conversão e normalização confirmadas. Um arquivo apenas armazenado permanece distinguido de um arquivo compreendido.

## Trabalho

1. Modelar o caminho principal de upload, validação, armazenamento, acesso e remoção com dados mínimos e estados nomeados.
2. Implementar o caminho feliz, loading, empty, error e success, incluindo recuperação.
3. Exibir origem, responsável, última atualização e próximo passo quando esses dados existirem.
4. Manter regras próximas da feature, com tipos locais e fixtures pequenas, sem criar uma abstração transversal prematura.
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
- PDF, DOCX e XLSX demonstram a criação de artefato derivado antes de qualquer chunk ou embedding; áudio permanece com estado explícito até a transcrição.
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
