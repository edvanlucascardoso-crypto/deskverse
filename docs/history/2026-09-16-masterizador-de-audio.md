# Inclusão do Masterizador de Áudio no roadmap

## Data e escopo

- Data: 16/09/2026
- Escopo: novo agente futuro, análise técnica de áudio, processamento de sinal, tool/MCP derivada de open source e Fase 15.
- Origem: solicitação de produto para incluir um profissional independente capaz de avaliar e melhorar a qualidade de arquivos de áudio.

## Motivo

O conjunto de profissionais do Deskverse deve poder receber tarefas de áudio sem depender de um pipeline de marketing. O Masterizador de Áudio será acionado diretamente em modo `SOLO` ou participará de uma `COLLABORATION` explícita quando outro profissional precisar de uma entrega técnica de áudio.

## Estado anterior

- A Fase 15 tinha 19 diretórios de agentes e não possuía uma sprint de masterização de áudio.
- Áudio, vídeo e música estavam definidos apenas como referências armazenáveis, sem interpretação semântica.
- Não havia uma decisão registrada sobre a divisão entre diagnóstico técnico de sinal, processamento e interpretação semântica de música.

## Novo estado

- A SPRINT-15-20 — Masterização de Áudio foi adicionada à Fase 15, com `blocksMvp: false`.
- O agente recebe arquivo(s) de áudio e propósito de uso; mede, entre outros sinais, loudness/LUFS, true peak, clipping, dinâmica, ruído, equilíbrio espectral, fase e compatibilidade mono/estéreo.
- O agente pode propor ou executar EQ, compressão, limitação, ganho/normalização e outras etapas aprovadas, sempre preservando o original, criando uma versão e registrando parâmetros e evidências antes/depois.
- A análise técnica de um arquivo não é interpretação semântica de música. Reconhecer significado, intenção artística ou conteúdo musical continua fora do escopo desta decisão.
- O serviço será uma tool/MCP privada atrás de um adapter do Deskverse, preferencialmente em worker CPU no Railway. O LLM recebe metadados, diagnóstico e plano estruturado; os bytes permanecem no pipeline de assets.

## Pesquisa técnica que fundamenta a decomposição

- [`@libraz/libsonare`](https://github.com/libraz/libsonare) é o candidato principal para uma prova de conceito JS/TS + WASM, pois declara análise, loudness, true peak, EQ, dinâmica, multibanda, maximizer e reference matching no mesmo engine, sob Apache-2.0.
- [`@audio/dynamics`](https://github.com/audiojs/dynamics) fornece primitivas JS para compressor, limiter lookahead, softclip, de-esser e multibanda; a licença publicada no repositório é MIT.
- [`loudness-worklet`](https://github.com/lcweden/loudness-worklet) oferece medição em AudioWorklet de momentary/short-term/integrated loudness, LRA e true peak, sob MIT, e pode servir como referência para medição no preview.
- [`ffmpeg.wasm`](https://github.com/ffmpegwasm/ffmpeg.wasm) fornece a ponte JS/WASM para codecs, conversão e streaming de áudio; o wrapper se declara MIT, mas os componentes/flags do FFmpeg ainda exigem inventário de licença no serviço distribuído.
- [`Web-Audio-Mastering`](https://github.com/eas4ai/Web-Audio-Mastering) e [`noisyloop/mastering`](https://github.com/noisyloop/mastering) são referências de cadeia browser-side em JavaScript para EQ, compressão, limiter, LUFS, true peak, A/B e exportação.
- [`Matchering`](https://github.com/sergree/matchering) é uma opção de referência baseada em target/reference, com Docker/Python e GPL-3.0; não entra diretamente no bundle Next.js. Só poderá ser usado em serviço isolado após decisão jurídica e benchmark.

O padrão de loudness deverá ser definido por perfil de uso e validado durante a implementação; a recomendação [EBU R 128](https://tech.ebu.ch/publications/r128) é uma referência técnica, não um alvo universal para todo conteúdo.

## Impacto

- `AGENTS.md`, manifesto, status, README e Supervisor Prompt passam a reconhecer o Masterizador de Áudio como agente futuro e distinguem processamento técnico de interpretação semântica.
- A Fase 15 passa a ter 20 sprints e inclui `SPRINT-15-20-SVC-01` para a tool/MCP privada.
- A criação dos agentes do MVP e o Gate A0 não são bloqueados por esta sprint.

## Riscos, pendências e fora do escopo

- A qualidade percebida não pode ser reduzida a um único número; propósito, gênero, mídia de destino e referência precisam ser informados ou refinados.
- Clipping já impresso, distorção e perdas de codec podem ser diagnosticados, mas não necessariamente recuperados. O agente deve declarar limites e não prometer restauração.
- Ficam pendentes o motor final, formatos/limites, perfis de loudness, política de retenção, benchmark, SBOM, licenças de dependências e decisão sobre Matchering/GPL.
- Fora do escopo: interpretação semântica de música, transcrição, composição, mixagem criativa de stems e implementação de código de runtime nesta alteração documental.

## Relações

- Complementa [2026-09-16-modelo-de-agentes-e-referencias.md](2026-09-16-modelo-de-agentes-e-referencias.md).
- Documentos da sprint: [SPRINT-15-20](../sprints/15-20-masterizacao-de-audio/SPRINT-15-20.md), [PRD](../sprints/15-20-masterizacao-de-audio/PRD-15-20-MASTERIZACAO-DE-AUDIO.md) e [serviço](../sprints/15-20-masterizacao-de-audio/services/SPRINT-15-20-SVC-01-audio-tool.md).
