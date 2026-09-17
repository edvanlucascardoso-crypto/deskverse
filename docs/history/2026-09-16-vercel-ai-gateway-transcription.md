# Transcricao de audio pelo Vercel AI Gateway

## Data e escopo

16/09/2026. Atualizacao da transcricao de audio da Fase 07 para usar o Vercel AI Gateway com `openai/whisper-1`.

## Motivo e contexto

O fluxo de conhecimento precisava centralizar o transporte da transcricao no gateway autorizado, sem chamada direta do aplicativo ao endpoint de audio da OpenAI e sem transformar uma credencial ausente em texto parcialmente compreendido.

## Estado anterior

- O adapter de audio chamava diretamente a API de transcricoes da OpenAI.
- A configuracao dependia de `OPENAI_API_KEY`, `OPENAI_TRANSCRIPTION_MODEL` e `OPENAI_TRANSCRIPTION_URL`.
- O estado de espera informava a ausencia da chave da OpenAI.

## Novo estado

- `AudioTranscriptionProvider` usa `experimental_transcribe` e `createGateway` com o modelo `openai/whisper-1`.
- A autenticacao aceita `AI_GATEWAY_API_KEY` ou OIDC da Vercel; sem autenticacao, a versao permanece em `WAITING_USER`.
- Falhas do gateway continuam recuperaveis e distintas da ausencia de credencial.
- O provider efetivo, o modelo e as tentativas continuam rastreaveis no contrato de transcricao.

## Impacto em produto, arquitetura e roadmap

- Produto: mensagens, fixtures e estados de audio passam a orientar a configuracao do Vercel AI Gateway.
- Arquitetura: o transporte de audio segue o mesmo limite de gateway/adapters usado pela plataforma e nao chama a API de audio diretamente.
- Roadmap: a Fase 07 passa a documentar o Vercel AI Gateway como requisito de integracao para a transcricao real.

## Arquivos e contratos afetados

- Variaveis e schema de ambiente de plataforma.
- Adapter de transcricao, rota de documentos, fixtures, drawer e testes.
- Dependencias `ai` e `@ai-sdk/gateway`.
- Documentacao e requisitos de integracao da Fase 07.

## Evidencias

- Testes unitarios cobrem sucesso pelo gateway, ausencia de autenticacao e falha recuperavel.
- Validacoes completas do conjunto de trabalho devem ser registradas no relatorio de execucao apos a verificacao.

## Riscos e integracoes pendentes

- Ainda e necessario executar smoke test com credencial real ou OIDC em ambiente controlado.
- O banco, o worker e o gateway de revisao Luna continuam dependentes da validacao integrada ja registrada na Fase 07.

## Fora do escopo

Interpretacao semantica de audio, transcricao de video, troca do modelo de revisao Luna e chamada direta de providers pelo dominio.

## Decisao tomada e decisao em aberto

Decisao tomada: o aplicativo usa o Vercel AI Gateway como transporte da transcricao Whisper.

Decisao em aberto: validar custo, limites, observabilidade e comportamento de retry com credencial produtiva.

## Relacao com registros anteriores

Complementa [2026-09-16-fase-07-onboarding-knowledge.md](2026-09-16-fase-07-onboarding-knowledge.md), sem reescrever o registro anterior.
