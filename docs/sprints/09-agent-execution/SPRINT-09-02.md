# SPRINT-09-02 — AI Gateway, routing e model adapters

**Fase:** 09 — Execução de Agentes  
**Status inicial:** PLANNED  
**Dependências:** SPRINT-09-01  
**Superfície principal:** escolha de modelo, reasoning, custo e provider routing

## Objetivo

Implementar uma camada única de inferência via **Vercel AI Gateway**, mantendo routing de inteligência no Deskverse e provider routing no gateway.

## Skills externas e neutralidade de modelo

Skills externas não serão copiadas por modelo nem colocadas integralmente no prompt mestre. A skill canônica permanece única; seus requisitos ficam em `agent-skills/compatibility/skill-requirements.json`, os profiles ficam em `agent-skills/compatibility/model-profiles.json` e o resolver de referência fica em `agent-skills/compatibility/resolve-skill.mjs`.

Na implementação desta sprint, o `ModelAdapter` deve incorporar esse contrato e produzir um plano normalizado antes de chamar o `InferenceGateway`. O plano cobre reasoning pedido/efetivo, contexto, modalidade, saída estruturada, compactação de resultados de tools, capabilities de worker, tools exigidas e fallback. Sintaxe de provider, autenticação, failover técnico e chamadas externas continuam exclusivamente no Gateway ou nas tools autorizadas.

Uma skill `reference_only` não pode ser ativada diretamente. No caso de análise de vídeo, extração de frames/transcrição pertence ao worker e a interpretação das imagens pertence ao modelo com capability `vision`; isso permite trocar Claude, GPT ou outra família sem duplicar a skill ou prometer compatibilidade inexistente.

## Contratos

Criar:

```ts
interface InferenceGateway {
  generate(input: InferenceRequest): Promise<InferenceResult>
  stream(input: InferenceRequest): AsyncIterable<InferenceEvent>
  listModels(): Promise<ModelCatalog>
}
```

Implementação MVP: `VercelAIGateway`. Manter a interface para futura troca por outro gateway.

Criar `ModelCapabilityProfile` e adapters para **Muse Spark, Kimi, OpenAI GPT-5.6, Anthropic Claude, Gemini, DeepSeek e Qwen**. Adapter define apenas comportamento: reasoning mapping, prompt/context policy, tool-result compression, max iterations/output, cache hints, multimodalidade e fallback semântico. Transporte, auth e provider failover ficam no gateway.

## Ordem correta de decisão

```text
pedido -> Agent/State/TaskPolicy -> Seniority -> InferenceProfile -> ModelAdapter -> Vercel AI Gateway -> provider
```

Nunca escolher modelo/provedor antes de classificar agente, estado e tarefa.

## Senioridade e reasoning

| Nível | Alvo |
|---|---|
| Júnior | low |
| Pleno | medium |
| Sênior | high |
| Especialista | xhigh/equivalente |

- OpenAI: somente GPT-5.6 Luna pode ter `maxAllowed` quando o `ModelCapabilityProfile`, o provider efetivo e o benchmark autorizarem; GPT-5.6 Sol e os demais modelos OpenAI permanecem com `maxAllowed=false`. Anthropic permanece com `maxAllowed=false`; Especialista termina em `xhigh` ou maior nível abaixo de max quando aplicável.
- Muse Spark 1.3/Kimi: `max` pode ser permitido no `ModelCapabilityProfile` para Especialista e tarefas long-horizon quando a capacidade real do caminho escolhido suportar e o benchmark justificar. DeepSeek V4.1 Flash segue a mesma regra por profile explícito. Se o Gateway traduzir `max` para `xhigh`, registrar essa tradução no `effective_reasoning`; outras famílias permanecem proibidas até haver profile explícito.
- Se o modelo não oferecer o nível pedido, registrar downgrade explícito em `effective_reasoning`.
- Kimi K3 tem thinking sempre ativo; senioridade deve controlar budget, contexto, iterações e output mesmo quando o thinking não puder ser desligado.

## Perfis pesquisados e defaults

Valores são **snapshot**, nunca hardcode de billing; consultar o catálogo do Gateway em runtime/admin.

| Modelo | Preço de referência US$/1M in/out | Uso Deskverse | Diretriz do adapter |
|---|---:|---|---|
| DeepSeek V4.1 Flash | 0.15 / 0.60 | generalista agentic econômico/alto volume | medium/high por padrão; tools, multimodalidade e tarefas de complexidade média; `max` com profile/provider/benchmark; escalar por risco, não apenas por tamanho |
| GPT-5.6 Luna | 0.20 / 1.20 | classificação/transformação | structured output estrito, baixa iteração; `max` somente com profile e benchmark |
| Qwen 3.5 Plus | 0.40 / 2.40 | multimodal/visual/copy/análise | aproveitar tools + visão; bom default econômico especializado |
| Muse Spark 1.3 | 1.25 / 4.25 | agente generalista/agentic/long-horizon | default de muitos líderes; `max` para tarefas difíceis quando suportado; manter plano/estado, tool filtering e cache |
| Claude Sonnet 5 | 2 / 10 | engenharia de software | contexto de repositório seletivo, ferramentas de código, revisão estruturada |
| Gemini 3.1 Pro | 2 / 12 | planilhas/financeiro/multimodal pesado | contexto multimodal seletivo, structured output e tools |
| Kimi K3 | 3 / 12.75+ | long-horizon/visual/engenharia | thinking always-on; compaction/checkpoints e budgets rígidos |
| GPT-5.6 Sol | 2 / 10 promocional no Gateway | último recurso frontier/alto risco | somente após falha ou benchmark sem paridade de perfil mais barato; structured tools; nunca `max` |

Também suportar Muse Spark Contributor **somente por opt-in para dados não sensíveis**, pois o preço reduzido implica política de uso de dados distinta; nunca rotear conteúdo confidencial automaticamente.

## Estratégia de harness por família

- **Muse Spark:** tratar 1.3 como generalista agentic, não como simples escalonador; usar `max` no caminho suportado para tarefas long-horizon difíceis, manter plano/checkpoint persistente, tool set pequeno por estado, prefixo estável para cache e revisão somente quando o risco justificar.
- **Kimi K3:** thinking é sempre ativo; evitar despejar 1M de contexto só porque cabe. Usar retrieval + compaction/checkpoints, limitar output/iterações e reservar para long-horizon/multimodal difícil.
- **OpenAI GPT-5.6:** structured outputs/function tools estritos, schemas pequenos, reasoning proporcional à senioridade; Sol é último recurso, Luna é worker barato e pode usar `max` somente com profile/provider/benchmark autorizados.
- **Anthropic Claude:** manter system/tool prefix estável, habilitar caching automático do Gateway quando elegível, contexto de repositório seletivo e tool results compactados. `max` bloqueado.
- **Gemini:** enviar mídia somente quando necessária, preferir structured output e contexto multimodal seletivo; usar níveis altos para planilhas/financeiro/visão complexa, não como default global.
- **DeepSeek:** generalista econômico com alto volume; permitir tarefas de complexidade média, tools e multimodalidade com budgets controlados; usar `max` quando o profile/provider suportar e escalar por risco, falha semântica ou necessidade de contexto/execução superior.
- **Qwen:** default econômico para visão, copy e análise; schemas de tool claros, entradas multimodais reduzidas e decomposição de tarefas visuais antes de escalar para Kimi.

Essas regras são hipóteses iniciais derivadas das capacidades documentadas e devem ser calibradas pelo Deskverse Agent Benchmark.

## Provider routing

- Por padrão `providerOptions.gateway.sort = "cost"` para workloads não sensíveis à latência.
- Usar `providerOptions.gateway.caching = "auto"` quando o provider/modelo suportar e o prefixo for cacheável.
- Permitir `ttft`/`tps` por perfil interativo.
- `zeroDataRetention=true` quando política do workspace exigir.
- Provider fallback é técnico. Model fallback/escalation por qualidade é decisão do Deskverse.
- Preservar afinidade de modelo durante uma sessão para coerência/cache.
- A lista de modelos, capacidades, preços e suporte a reasoning deve ser consultada no catálogo do Gateway em runtime/admin. A tabela desta sprint é somente um snapshot de planejamento e nunca pode alimentar cobrança ou regra de autorização.

## Critérios de aceite

- Trocar modelo via configuração sem alterar Agent Core.
- Um mesmo model ID pode mudar de provider sem conhecimento do agente.
- Trace mostra agente, senioridade, model, provider final, reasoning pedido/efetivo, tokens, cache, custo e fallback.
- Resolver de skills escolhe a skill canônica apenas após capability match, bloqueia model/worker/tool ausente e registra skill, revisão, profile, modelo e provider no trace.
- Teste cobre GPT-5.6 Luna, Muse Spark 1.3 e DeepSeek V4.1 Flash com capability-aware `max`, GPT-5.6 Sol/outros OpenAI e Anthropic sem `max`, além de Kimi com capability-aware `max`.
- Model catalog/preços não dependem de constantes antigas.

## Referências pesquisadas

- https://vercel.com/docs/ai-gateway/models-and-providers/provider-options
- https://vercel.com/ai-gateway/models/muse-spark-1.3
- https://vercel.com/ai-gateway/models/kimi-k3
- https://vercel.com/ai-gateway/models/gpt-5.6-sol
- https://vercel.com/ai-gateway/models/claude-sonnet-5
- https://vercel.com/ai-gateway/models/gemini-3.1-pro-preview
- https://vercel.com/ai-gateway/models/deepseek-v4.1-flash
- https://vercel.com/ai-gateway/models/qwen3.5-plus
