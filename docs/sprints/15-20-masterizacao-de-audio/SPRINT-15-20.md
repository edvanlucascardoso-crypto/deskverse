# SPRINT-15-20 — Masterização de áudio

**Status:** PLANNED
**Bloqueia MVP/Gate A0:** não
**Capability:** `audio.inspect_master`
**Modo físico esperado:** `CPU`
**Agente:** profissional independente, acionável em `SOLO` ou em `COLLABORATION` explícita

## Objetivo

Permitir que o Masterizador de Áudio receba uma referência de áudio, entenda o propósito de uso informado pela pessoa usuária e entregue um diagnóstico técnico confiável. Quando autorizado, ele deve propor ou executar uma cadeia não destrutiva para equalizar e masterizar o arquivo, produzir uma nova versão e comparar o resultado com o original.

“Entender” nesta sprint significa medir e interpretar propriedades do sinal. Não significa interpretar semanticamente a música, reconhecer intenção artística ou afirmar que o resultado é artisticamente melhor sem evidência e aprovação.

## Entrada do pedido

- Um ou mais `assetRef` de áudio com nome, MIME, tamanho, checksum, versão, origem, permissão e estado de compreensão.
- Propósito de uso obrigatório ou refinado: por exemplo, podcast, vídeo, streaming, apresentação, arquivo técnico ou outro contexto descrito pela pessoa.
- Objetivo desejado: diagnosticar, sugerir correções, gerar preview ou renderizar uma versão aprovada.
- Perfil de entrega e restrições conhecidas: formato, sample rate, bit depth, mono/estéreo, prazo e necessidade de referência sonora.
- Referência opcional para comparação de tonalidade/dinâmica. A referência deve ser autorizada e não deve ser tratada como cópia artística automática.
- Modo `SOLO` ou `COLLABORATION`, agente responsável, participantes e motivo da colaboração quando aplicável.

Se o propósito, o perfil ou a autorização de processamento estiverem ausentes, o agente entra em `WAITING_USER` e faz perguntas curtas. Não inventa alvo de loudness, formato de entrega ou promessa de qualidade.

## Diagnóstico mínimo

O relatório deve separar medição, interpretação, confiança e limitação:

- loudness integrado, momentâneo e short-term, LRA e alvo/perfil aplicado;
- sample peak, true peak/dBTP, inter-sample overs e ocorrência de clipping;
- RMS, crest factor, PLR, headroom e dinâmica ao longo do arquivo;
- espectro, equilíbrio tonal, energia de subgrave, médios e agudos, ressonâncias e possíveis excessos;
- ruído, silêncio, DC offset, dropouts e artefatos detectáveis;
- balanço L/R, correlação de fase, compatibilidade mono e largura estéreo;
- duração, canais, sample rate, bit depth, codec, perdas prováveis e metadados;
- adequação ao propósito escolhido, com regra explicável e nível de confiança;
- problemas que podem ser tratados, problemas apenas observáveis e problemas possivelmente irrecuperáveis.

O agente não declara “bem equalizado” como verdade universal. Ele informa se o sinal está dentro do perfil escolhido e quais desvios sustentam a conclusão.

## Processamento permitido

Quando a Task Policy e a permissão autorizarem:

- EQ corretivo ou tonal com parâmetros explícitos;
- filtro de subgrave, quando justificado pela medição;
- compressão, multibanda ou de-esser quando a evidência indicar necessidade;
- ganho/normalização e limitação com teto declarado;
- controle de estéreo apenas como sugestão ou etapa opt-in, com verificação de mono;
- exportação de preview e master em nova `AssetVersion`.

Cada cadeia deve ser serializável, reproduzível e reprocessável. O original permanece imutável. O agente deve medir novamente a saída e apresentar A/B com level match quando possível.

## Fluxo e estados

1. `RECEIVED`: valida referência, permissão, formato, checksum e propósito.
2. `ANALYZING`: executa probe e diagnóstico técnico em worker CPU.
3. `WAITING_USER`: pede propósito, perfil, autorização ou referência que esteja faltando.
4. `SUGGESTION_READY`: mostra problemas, evidências e plano proposto sem alterar o original.
5. `WAITING_APPROVAL`: aguarda autorização para aplicar ou publicar o processamento quando a Task Policy exigir.
6. `PROCESSING`: executa preview/render idempotente, com progresso e cancelamento seguro.
7. `SUCCESS`: disponibiliza nova versão, relatório antes/depois, parâmetros, lineage e limitações.
8. `ERROR`: diferencia arquivo inválido, falha técnica, falha de ferramenta, falha semântica e qualidade insuficiente.
9. `CANCELLED`: interrompe novos passos e preserva diagnóstico, tentativa e estado do asset.

## Critérios de aceite

- Um pedido com áudio e propósito produz relatório técnico rastreável sem passar bytes pelo LLM.
- Clipping, true peak acima do teto, loudness fora do perfil, desequilíbrio espectral, ruído e risco de fase aparecem como evidências, não como texto genérico.
- O agente sugere uma cadeia adequada ao propósito e explica cada alteração; quando a correção não for confiável, recomenda não processar.
- Um render autorizado cria uma versão nova, mede novamente a saída e mantém o original disponível.
- Preview e render usam a mesma cadeia declarativa ou registram claramente qualquer diferença.
- A tarefa pode ser executada sozinha ou em colaboração explícita com outro profissional, sem criar uma cadeia automática.
- Cancelamento, retry técnico, idempotência, timeout, limite de tamanho/duração e dead-letter são observáveis.
- Testes com fixtures de silêncio, tom, clipping, ruído, mono, fora de fase, mix comprimido e arquivos com codecs suportados cobrem diagnóstico e regressões.

## Fora do escopo

- compreensão semântica de música, vídeo ou fala;
- transcrição, identificação de artista ou avaliação estética autônoma;
- restauração garantida de clipping, codec lossy ou distorção já impressa;
- mixagem multifaixa criativa ou substituição de um engenheiro de masterização humano;
- definição definitiva dos alvos por plataforma antes de uma decisão documentada e benchmark.
