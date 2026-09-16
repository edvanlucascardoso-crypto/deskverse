# Compatibilidade de skills e modelos

Esta pasta define como uma skill externa é usada por diferentes modelos sem copiar suas instruções para cada IA.

## Princípio

Uma skill tem uma única fonte canônica. A compatibilidade é resolvida em tempo de execução por três artefatos:

1. `skill-requirements.json` — contrato declarativo da tarefa: modalidades, capabilities de modelo, capabilities de worker, contrato de saída, side effects e fallback.
2. `model-profiles.json` — snapshot inicial das capabilities das famílias/modelos permitidos pelo Deskverse. O catálogo real do Vercel AI Gateway deve prevalecer em runtime.
3. `resolve-skill.mjs` — adaptador de referência que faz a interseção dos dois catálogos e gera um plano neutro de execução.

O adaptador de referência não transporta requisições, autentica provider, publica conteúdo, grava arquivos ou executa scripts. Essas responsabilidades pertencem, respectivamente, ao `InferenceGateway` e às tools autorizadas do Deskverse.

## Contrato de execução

```text
AgentPolicy + TaskPolicy
        ↓
SkillRequirements + tarefa atual
        ↓
ModelCapabilityProfile efetivo
        ↓
SkillAdapter: reasoning, contexto, modalidade, tools e saída
        ↓
InferenceGateway: request/provider/failover técnico
        ↓
resultado normalizado + trace
```

O resultado do resolver precisa ser tratado como plano, não como autorização. A camada de permissão ainda decide se uma tool pode ser chamada, se uma escrita exige aprovação e se um asset pode ser enviado ao UploadThing.

## Regras de promoção

- Não criar um `SKILL.md` por modelo.
- Não colocar sintaxe de provider ou nomes de modelos na skill canônica.
- Não considerar uma capacidade apenas porque o modelo “parece” suportá-la: confirme no catálogo efetivo e no benchmark.
- `max` nunca é inferido da senioridade. Ele exige profile, provider efetivo e benchmark conforme `SPRINT-09-02`.
- Uma skill `reference_only` pode orientar a adaptação, mas não pode ser ativada diretamente.
- `vision` significa que o modelo analisa uma imagem já preparada por uma tool/worker; não concede acesso a câmera, arquivo ou credencial.
- `video` separa extração de frames/transcrição (worker) da interpretação visual (LLM).
- Tools e scripts recebem argumentos neutros ao provider, validados na borda e filtrados por capability, conexão, autonomia e workspace.
- Toda resolução deve registrar skill, revisão, profile, modelo, provider, reasoning pedido/efetivo e motivo de fallback.

## Exemplo de uso futuro

```js
import { resolveSkill } from "./resolve-skill.mjs";

const plan = resolveSkill({
  skillId: "vision",
  modelId: "gpt-5.6-luna",
  seniority: "senior",
  requestedReasoning: "high",
  profileAllowsMax: false,
  benchmarkAllowsMax: false,
  availableWorkerCapabilities: [],
});

// O AgentRuntime usa plan.loadPlan e plan.modalityPolicy.
// O InferenceGateway transforma o plano em request do provider.
// Nenhuma chave ou chamada externa passa pela skill.
```
