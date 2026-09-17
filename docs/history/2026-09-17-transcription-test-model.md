# Modelo gratuito nos testes de transcrição da Fase 07

## Data e escopo

17/09/2026. Ajuste da cobertura unitária de transcrição para validar o modelo fish-audio/transcribe-1-free pelo Vercel AI Gateway.

## Motivo e contexto

O usuário informou que o modelo está disponível gratuitamente no AI Gateway e solicitou sua utilização nos testes de transcrição. O ambiente atual não possui credencial do Gateway nem um arquivo de áudio para um smoke externo.

## Estado anterior

- O teste de sucesso exercitava o override ausente e validava apenas o fallback openai/whisper-1.
- O smoke real do AI Gateway permanecia pendente por falta de credencial.

## Novo estado

- O teste de sucesso usa explicitamente AI_GATEWAY_TRANSCRIPTION_MODEL=fish-audio/transcribe-1-free e confirma que o modelo chega ao provider do Gateway.
- Um teste separado preserva a verificação de que o fallback de produção continua sendo openai/whisper-1 quando não há override.
- Não houve mudança no modelo padrão de produção nem chamada direta a provider de áudio.

## Impacto em produto, arquitetura e roadmap

- Produto: a cobertura local representa o modelo gratuito escolhido para o teste.
- Arquitetura: o modelo continua configurável apenas no adapter do AI Gateway.
- Roadmap: a validação externa real continua pendente e não altera o fechamento da Fase 07.

## Arquivos afetados

- src/features/knowledge/audio-transcription.test.ts

## Evidências e pendências

- O teste específico passou: 4 testes em 1 arquivo.
- A suíte completa passou: 16 arquivos e 50 testes.
- Lint e typecheck do repositório ficaram bloqueados por tests/e2e/workspace.spec.ts, alteração preexistente em formato inválido para TypeScript; o arquivo não foi alterado neste trabalho.
- Pendente: smoke real com AI_GATEWAY_API_KEY ou OIDC, arquivo de áudio autorizado e validação da resposta do modelo no projeto Vercel.

## Fora do escopo

Alterar o modelo de revisão gpt-5.6-luna, alterar o default de produção, modificar o pipeline RAG ou provisionar credenciais.

## Relação com registros anteriores

Complementa docs/history/2026-09-16-vercel-ai-gateway-transcription.md e docs/history/2026-09-16-vercel-ai-gateway-whisper.md.
