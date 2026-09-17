# Fase 07 — Onboarding e Conhecimento

Capturar o contexto de trabalho da empresa, processar arquivos com rastreabilidade e tornar informações úteis para humanos e agentes sem inventar fatos.

Configuração de serviços: [EXTERNAL_SERVICES.md](EXTERNAL_SERVICES.md).

## Estado da execução

`COMPLETE_WITH_INTEGRATION_REQUIREMENTS` no corte de 16/09/2026. As sete sub sprints foram executadas em ordem: upload e storage, onboarding, conversão, RAG em PostgreSQL/pgvector, conflitos e perfil de trabalho.

O caminho obrigatório ficou explícito e implementado: original preservado no UploadThing → extração/transcrição → Whisper `openai/whisper-1` pelo Vercel AI Gateway → correção de áudio no `gpt-5.6-luna` com raciocínio `medium` → Markdown canônico (ou CSV derivado + Markdown tabular para planilhas) → chunks estruturais → embeddings → pgvector. Áudio sem `AI_GATEWAY_API_KEY` e sem OIDC disponível permanece em `WAITING_USER` e não gera evidência de RAG.

O ciclo de vida também está explícito: o workspace pode apagar completamente chunks/embeddings e criar uma nova geração com confirmação obrigatória, ou substituir o RAG de um arquivo pronto sem remover evidências dos demais. Originais, conversões e auditoria não são apagados pela limpeza do índice.

Relatórios: [07-02](SPRINT-07-02-COMPLETION.md), [07-03](SPRINT-07-03-COMPLETION.md), [07-04](SPRINT-07-04-COMPLETION.md), [07-05](SPRINT-07-05-COMPLETION.md), [07-06](SPRINT-07-06-COMPLETION.md) e [07-07](SPRINT-07-07-COMPLETION.md). A atualização da fila da 07-01 está registrada no [relatório da sprint](SPRINT-07-01-COMPLETION.md).

## Ordem

1. SPRINT-07-01 — Filas de trabalho e jobs assíncronos
2. SPRINT-07-02 — Upload e armazenamento de arquivos
3. SPRINT-07-03 — Fluxo de onboarding
4. SPRINT-07-04 — Ingestão de documentos
5. SPRINT-07-05 — Busca semântica da base de conhecimento
6. SPRINT-07-06 — Conflitos e confiança das informações
7. SPRINT-07-07 — Perfil da marca e contexto de trabalho

A fase é executada na ordem indicada. Cada sprint entrega comportamento observável, usa dados mínimos necessários e registra integrações pendentes para o Supervisor.

## Limites

A experiência continua baseada em DOM, canvas full-screen com grade espacial de tiles e estados explícitos. Não entram engine 3D, modelos legados, runtime de jogo ou uma camada de contratos compartilhados.
