> **Status: RETIRED / NON-EXECUTABLE (2026-09-11).** A integração Stem de autoria, navegação e animação foi removida; atores e gameplay foram reescopados na nova Fase 04.
+
# SPRINT-04-10 — Tradutor de export Stem para room contracts

## ROLE
Você é o agente responsável por esta sprint do Deskverse: execute-a até seus critérios de aceite e não assuma responsabilidade por outras sprints.

## EXECUÇÃO
Executada diretamente pelo agente de engenharia responsável, sem roteamento por modelo/fornecedor específico. Registre tentativas, falhas e escalonamentos no relatório final.

## EXECUTION ENVIRONMENT
- **LOCAL_OR_STANDARD_DEV_MACHINE**
- Nenhuma GPU alugada é necessária.

## OBJECTIVE
Converter deterministicamente um projeto `.stemscript.json` exportado pelo editor em `replay.json` e `OfficeTemplate` válidos, sem JSON de cena escrito à mão.

## GLOBAL CONTEXT TO READ FIRST
1. `../00-meta/STEM_EDITOR_INTEGRATION_STRATEGY.md`
2. `../00-meta/STEM_ENGINE_FORK_POLICY.md`
3. `../00-meta/SPRINT_EXECUTION_CONTRACT.md`
4. `../00-meta/contracts/office-template.schema.json`
5. `../../engine/LOCAL_EDITOR.md`
6. `SPRINT-04-11-stem-commands-tool-bridge.md`

## REQUIREMENTS
- Ler o formato real de array plano do Stem, incluindo `metadata.generator`, transforms e `parentUuid`.
- Resolver hierarquia e preservar IDs estáveis, asset references, posição, rotação, escala, luzes e settings suportados.
- Produzir saída estável e git-diffable; mesma entrada gera bytes semanticamente equivalentes.
- Generalizar/reutilizar `parseInitialRecipe`, `validateAssembly`, `parseOfficeTemplate` e schema AJV; não criar validador concorrente.
- Falhar explicitamente para asset sem mapping, parent ausente, ID duplicado, transform inválido ou serializer desconhecido relevante.
- Behaviors/Lambdas do projeto são preservados como referência/proveniência de protótipo; não são traduzidos automaticamente para lógica operacional.
- O runtime continua lendo somente `replay.json`/`OfficeTemplate`, nunca o formato interno do editor.

## ALLOWED CHANGES
- `tooling/engine/authoring/**`
- `packages/office-contracts/room/**`
- `packages/office-rooms/authoring/**`
- fixtures/testes próprios sob esses módulos

## FORBIDDEN CHANGES
- `vendor/stem-studio/**`
- conteúdo de salas aprovadas, exceto fixtures isoladas
- gameplay/atores/HUD
- editor ou ponte proprietária do Stem

## DEPENDENCIES / EXPECTED INPUTS
- Hard prerequisites: `SPRINT-03-01`, `SPRINT-03-02`, `SPRINT-04-00`, `SPRINT-04-11`.

## REQUIRED OUTPUTS
- parser tipado do export Stem
- conversor para replay/OfficeTemplate
- mapping explícito de assets/serializers
- CLI/documentação e fixtures reais

## ACCEPTANCE / TESTS
- fixture real exportada pelo editor converte deterministicamente
- fixture é obtida por save/export através da bridge, sem JSON autoral manual
- hierarquia `parentUuid`, transforms e luzes preservadas
- saída passa AJV, `parseOfficeTemplate`, `parseInitialRecipe` generalizado e `validateAssembly`
- saída carrega no Player real
- erros relevantes são fail-closed e acionáveis
- behavior de protótipo não vira gameplay silenciosamente

## INTEGRATION DISCIPLINE
Mudança de contrato compartilhado exige CCR. Lacuna fora do ownership exige IR.

## COMPLETION REPORT
Produza o relatório canônico com status, arquivos, testes, IRs/CCRs, limitações, execução utilizada e handoff ao Supervisor.
