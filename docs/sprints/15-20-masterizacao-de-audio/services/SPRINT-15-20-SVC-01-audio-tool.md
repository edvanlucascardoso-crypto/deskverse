# SPRINT-15-20-SVC-01 — Tool/MCP de áudio

**Depende de:** storage/referências, filas, workers CPU, segurança e supply chain das Fases 07–09 e 14.
**Runtime:** Railway + CPU
**Não bloqueia:** MVP/Gate A0

## Objetivo

Construir um serviço privado, headless e reproduzível que exponha operações de análise e processamento de áudio ao Deskverse. A fronteira do serviço é uma tool/MCP interna; o agente não executa comandos arbitrários nem escolhe binários por conta própria.

## API conceitual

```text
audio.probe(inputAssetRef)
audio.inspect(inputAssetRef, purposeProfile)
audio.suggest(analysisRef, goal, optionalReferenceAssetRef)
audio.preview(inputAssetRef, processingPlan)
audio.render(inputAssetRef, processingPlan, deliveryProfile)
audio.compare(beforeAssetRef, afterAssetRef, comparisonProfile)
audio.cancel(runId)
```

Cada operação recebe referências internas autorizadas, limite de recursos e `idempotencyKey`. A resposta carrega `analysisRef`/`assetVersionRef`, versão do engine, checksums, métricas e limitações. O MCP/HTTP é transporte; a política, autorização, custo, contexto e semântica pertencem ao Deskverse.

## Projetos avaliados

### Candidato principal para POC

[`@libraz/libsonare`](https://github.com/libraz/libsonare) declara API JavaScript/TypeScript + WASM, análise de loudness, true peak, dinâmica, EQ, multibanda, maximizer, reference matching e runtime Node/browser, sob Apache-2.0. Deve ser avaliado como engine único, mas só poderá ser promovido após benchmark, revisão de atividade, compatibilidade de codecs, estabilidade do pacote e validação de saída.

### Componentes complementares

- [`@audio/dynamics`](https://github.com/audiojs/dynamics): compressor, limiter lookahead, softclip, de-esser e multibanda em JavaScript; útil para uma cadeia declarativa própria e testes unitários de DSP.
- [`loudness-worklet`](https://github.com/lcweden/loudness-worklet): medição AudioWorklet de loudness momentary/short-term/integrated, LRA e true peak; útil para preview e comparação de medição.
- [`ffmpeg.wasm`](https://github.com/ffmpegwasm/ffmpeg.wasm): JS/WASM para decode, encode, conversão e streaming; pode ficar atrás do adapter para formatos não cobertos pelo engine principal. O wrapper se declara MIT, mas a distribuição deve inventariar a licença dos componentes e da build usada.
- [`Tone.js`](https://github.com/Tonejs/Tone.js): biblioteca MIT com primitives Web Audio, EQ, compressor, limiter e `OfflineAudioContext`; adequada para preview/browser e prototipação, não deve ser a autoridade do render final sem benchmark.

### Referências úteis, não dependências automáticas

- [`Web-Audio-Mastering`](https://github.com/eas4ai/Web-Audio-Mastering), [`Suno-Song-Remaster`](https://github.com/SUP3RMASS1VE/Suno-Song-Remaster) e [`noisyloop/mastering`](https://github.com/noisyloop/mastering) demonstram cadeias JavaScript com LUFS, true peak, EQ, compressão, limiter, A/B e exportação. Servem para comparar UX e heurísticas, não para declarar qualidade de produção.
- [`Matchering`](https://github.com/sergree/matchering) oferece matching/mastering por target + reference em Python/Docker, mas está sob GPL-3.0. Se aprovado, deve rodar como processo isolado e versionado, com revisão jurídica e benchmark; não pode entrar no bundle Next.js.
- [`audaMcp`](https://github.com/Dream-Pixels-Forge/audacity-mcp) demonstra uma superfície MCP para análise, reparo e mastering, mas é Python e deve ser tratado como referência de contrato/arquitetura até passar por auditoria.

## Segurança e isolamento

- Aceitar somente `assetRef` autorizada; resolver bytes no serviço de assets com URL curta/assinada.
- Executar probe e processamento em sandbox sem rede de saída, com limite de CPU, memória, duração, canais e tamanho.
- Fixar imagem/container, binários, pacotes, WASM, modelos e codecs; armazenar SBOM, licença, checksum e versão do engine.
- Bloquear shell arbitrário, caminhos fornecidos pelo usuário, overwrite, acesso entre workspaces e inclusão de plugins não allowlisted.
- Emitir logs estruturados sem conteúdo sensível e gravar lineage no PostgreSQL.

## Pipeline de referência

```text
assetRef → probe/decodificação → análise baseline → plano estruturado
       → preview opcional → aprovação → render → reanálise → AssetVersion
```

A sugestão pode ser produzida por LLM, mas parâmetros inválidos ou perigosos são rejeitados pelo schema/engine. A saída só é considerada compatível com o perfil depois de reanalisada.

## Aceite do serviço

- As operações retornam contratos versionados, erros tipados, progresso, cancelamento e idempotência.
- Nenhuma operação altera o original ou expõe binário ao LLM.
- A medição baseline e pós-render é reproduzível e comparável por fixture.
- A tool informa quando um problema é detectável, corrigível ou provavelmente irrecuperável.
- A licença e o checksum de cada componente efetivamente empacotado aparecem no artefato de build.
