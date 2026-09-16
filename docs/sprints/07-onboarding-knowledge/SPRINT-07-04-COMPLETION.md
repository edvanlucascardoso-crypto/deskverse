# SPRINT-07-04 — Relatório de conclusão

## Estado

`COMPLETE_WITH_INTEGRATION_REQUIREMENTS`

## Corte

16/09/2026.

## Entrega

- PDF textual → Markdown canônico com marcação de página; PDF sem texto não é apresentado como compreendido e aguarda OCR integrado.
- DOCX → Markdown canônico preservando títulos, listas, links, tabelas e entidades; `.doc` retorna falha recuperável explícita.
- XLSX/XLS → CSV separado por planilha e Markdown tabular canônico para chunking e busca.
- TXT, CSV, HTML, JSON e Markdown passam por normalização textual determinística.
- Áudio → OpenAI Whisper por `AudioTranscriptionProvider` → revisão/correção via `InferenceGateway` com `gpt-5.6-luna` e raciocínio solicitado `medium` → Markdown canônico. O texto bruto não entra diretamente no RAG.
- Cada versão preserva trace, checksum, confiança, estado e referências. Somente versão `READY` com Markdown canônico é elegível para indexação.

## Evidências

- `src/features/knowledge/node-document-converters.test.ts` valida PDF, DOCX, XLSX/XLS e falha recuperável de `.doc` com artefatos reais/mínimos.
- `src/features/knowledge/document-pipeline.test.ts` valida a ordem de normalização, Whisper fake, revisão Luna `medium` e bloqueio de áudio sem providers.
- `yarn test`: 15 arquivos e 46 testes aprovados; o teste de áudio usa providers fake e não chama a OpenAI.
- `yarn lint`, `yarn typecheck`, `yarn db:validate` e build Next 16/Turbopack com variáveis locais: aprovados.
- E2E do drawer: estado `WAITING_USER` de áudio sem chave e mensagem de conversão antes da busca demonstrados em desktop/mobile.

## Integrações pendentes

- Configurar `OPENAI_API_KEY` e executar smoke controlado de Whisper.
- Validar o endpoint real do `InferenceGateway` e o profile/modelo `gpt-5.6-luna` com reasoning efetivo `medium`.
- Conectar OCR para PDF escaneado e mover a execução para worker CPU com checkpoints.

## Próxima prioridade

`SPRINT-07-05 — Busca semântica da base de conhecimento`.
