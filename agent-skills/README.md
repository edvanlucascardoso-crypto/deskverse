# Catálogo de skills dos agentes

Catálogo inicial de skills externas para avaliação e futura adaptação ao Deskverse.

Este diretório é uma área de staging: as skills não estão conectadas ao `AgentRuntime`, não são carregadas automaticamente e nenhum segredo foi configurado. Antes de ativar uma skill, ela deve passar por revisão de licença, segurança, compatibilidade com as tools autorizadas e validação do contrato `AgentPolicy + TaskPolicy + ModelAdapter`.

Como o staging pode conter scripts, exemplos e dependências de workers externos, `agent-skills` fica fora da compilação TypeScript e da descoberta de testes da aplicação até que uma skill seja promovida explicitamente para um módulo do Deskverse.

## Metodologia

O catálogo segue o formato [Agent Skills](https://agentskills.io/specification): cada skill possui `SKILL.md` e pode carregar referências, scripts e assets progressivamente. O agente deve receber somente o resumo de descoberta no registry; o conteúdo completo entra no contexto apenas quando a capability e a tarefa forem compatíveis.

Regras para promoção ao runtime:

1. Validar o `SKILL.md` e manter o nome da pasta igual ao campo `name`.
2. Carregar uma skill por capability/tarefa, sem concatenar todas as skills no prompt mestre.
3. Ler referências e executar scripts somente quando a própria tarefa exigir.
4. Adaptar nomes de tools, estados, permissões, UploadThing, memória pgvector e auditoria para os contratos do Deskverse.
5. Registrar no trace o identificador, a revisão e a versão das skills realmente carregadas.
6. Impedir publicação, alteração de planejamento, acesso a credenciais e outras ações protegidas sem as tools e approvals do Deskverse.

## Skills baixadas

| Skill | Pasta | Uso principal | Situação | Observação |
|---|---|---|---|---|
| `social-post-forge` | `catalog/content/social-post-forge` | posts nativos, reaproveitamento e crítica | candidata | Possui scripts de geração e publicação; não ativar publicação direta. |
| `copywriting` | `catalog/content/copywriting` | copy, SEO, social, voz e revisão | candidata | A pasta também contém subskills especializadas para carregamento sob demanda. |
| `brand-voice` | `catalog/content/brand-voice` | voz, vocabulário, CTA e consistência | candidata | O `voice-guide.md` deve ser substituído por BrandProfile autorizado. |
| `market-researcher` | `catalog/business/market-researcher` | tamanho de mercado, tendências e concorrentes | candidata | Requer pesquisa com fontes e não deve inventar dados. |
| `business-analyst` | `catalog/business/business-analyst` | requisitos, análise e recomendações | candidata | Precisa ser alinhada à rastreabilidade de brief e decisão do Deskverse. |
| `competitor-analyst` | `catalog/business/competitor-analyst` | análise competitiva | candidata | Usar somente com fontes verificáveis. |
| `okr-planner` | `catalog/business/okr-planner` | objetivos, resultados e acompanhamento | candidata | Não substitui as tools autorizadas de planejamento. |
| `product-manager` | `catalog/business/product-manager` | produto, prioridades e decisões | candidata | Referência para o Gestor; a tela do usuário continua somente leitura. |
| `vision` | `catalog/vision/vision` | análise de imagem, OCR, tabela e UI | candidata | Declara compatibilidade com Codex e API OpenAI-compatible; exige `VISION_API_KEY` em ambiente futuro. |
| `video` | `catalog/vision/video` | extração e análise de frames/transcrição | referência | Skill da `ellyseum/claude-vision`; depende de hooks e subagente específicos do Claude Code. |
| `remotion-motion-graphics` | `catalog/media/remotion-motion-graphics` | motion design determinístico com Remotion | candidata | Requer adaptação ao worker/render do Deskverse. |
| `ffmpeg-skill` | `catalog/media/ffmpeg-skill` | edição local, captions, áudio e verificação | candidata | Executa scripts locais e requer FFmpeg; não chamar diretamente pelo LLM sem tool wrapper. |
| `video-editing-skill` | `catalog/media/video-editing-skill` | brief de edição para Rendley | referência | Integração externa específica; não usar no MVP nem substituir `InferenceGateway`. |
| `data-analyst` | `catalog/analysis/data-analyst` | SQL, métricas, estatística e recomendações | candidata | Deve respeitar o escopo de dados e permissões do workspace. |
| `data-qa` | `catalog/analysis/data-qa` | verificação de qualidade de dados | candidata | Compartilhável com BI, financeiro e tráfego. |
| `metric-definition` | `catalog/analysis/metric-definition` | definição e governança de métricas | candidata | Útil para saúde de projeto e `cost_per_successful_task`. |
| `executive-memo` | `catalog/analysis/executive-memo` | síntese executiva baseada em evidências | candidata | Saída deve manter origem e incertezas explícitas. |
| `jupyter-notebook` | `catalog/analysis/jupyter-notebook` | experimentos e análises reproduzíveis | referência | Skill oficial OpenAI; o repositório de origem está deprecated, portanto validar antes de promover. |
| `pdf` | `catalog/analysis/pdf` | leitura, criação e renderização de PDF | referência | Skill oficial OpenAI; usar apenas onde a superfície de arquivos exigir. |

## Mapeamento por agente

As skills são compartilhadas por capability; não existe uma cópia exclusiva por agente.

| Sprint/agente | Skills iniciais a avaliar |
|---|---|
| `SPRINT-10-01` Mídias Sociais | `social-post-forge`, `copywriting`/`social-copywriting`, `brand-voice`, `market-researcher` |
| `SPRINT-10-02` Redator | `copywriting`, `brand-voice` |
| `SPRINT-10-03` Designer | `vision`, `brand-voice` e referências de `remotion-motion-graphics` |
| `SPRINT-10-04` fluxo MVP | skills acima por etapa; carregar somente a skill da etapa atual |
| `SPRINT-15-01` Crescimento | `market-researcher`, `social-post-forge`, `data-analyst`, `metric-definition` |
| `SPRINT-15-02` Motion Design | `remotion-motion-graphics`, `video`, `vision`, `ffmpeg-skill` |
| `SPRINT-15-03` Desenvolvimento Web | `business-analyst`; definir skill nativa de engenharia em sprint própria |
| `SPRINT-15-04` Tráfego | `market-researcher`, `social-post-forge`, `data-analyst`, `metric-definition` |
| `SPRINT-15-05` Contabilidade BR | `data-analyst`, `data-qa`, `jupyter-notebook`, `pdf`; definir skill contábil nativa |
| `SPRINT-15-06` Gestão | `business-analyst`, `okr-planner`, `product-manager`, `executive-memo` |
| `SPRINT-15-07` Pré-vendas | `market-researcher`, `competitor-analyst`, `copywriting`, `brand-voice` |
| `SPRINT-15-08` Fechamento | `copywriting`, `brand-voice`, `business-analyst` |
| `SPRINT-15-09` Pós-vendas | `copywriting`, `brand-voice`, `business-analyst` |
| `SPRINT-15-10` Atendimento | `copywriting`, `brand-voice`, `business-analyst` |
| `SPRINT-15-11` Gestão de Projetos | `product-manager`, `okr-planner`, `business-analyst`, `executive-memo`, `pdf` |
| `SPRINT-15-12` Edição de Vídeo | `ffmpeg-skill`, `video`, `vision`, `remotion-motion-graphics`; `video-editing-skill` somente como referência |
| `SPRINT-15-13` Efeitos Visuais | `vision`, `remotion-motion-graphics`, `ffmpeg-skill` |
| `SPRINT-15-14` Controle Financeiro | `data-analyst`, `data-qa`, `metric-definition`, `jupyter-notebook`, `pdf` |
| `SPRINT-15-15` Dados e BI | `data-analyst`, `data-qa`, `metric-definition`, `jupyter-notebook`, `executive-memo` |
| `SPRINT-15-16` Inteligência de Mercado | `market-researcher`, `competitor-analyst`, `data-analyst`, `executive-memo` |
| `SPRINT-15-17` Observador humano | sem LLM/skill obrigatório; `executive-memo` somente quando solicitado |
| `SPRINT-15-18` Liderança multi-grupo | `product-manager`, `okr-planner`, `business-analyst`, `executive-memo` |
| `SPRINT-15-19` Plataforma própria de imagem | `vision` e referências de `remotion-motion-graphics`; implementação própria continua posterior ao MVP |

## Claude Vision e GPT

O item `catalog/vision/video` é a skill de vídeo do plugin [ellyseum/claude-vision](https://github.com/ellyseum/claude-vision). Ela é interessante para Edição de Vídeo e Motion Design porque analisa frames representativos e transcrição sem inflar a conversa principal, mas seu contrato assume hooks, `Task` e um agente `claude-vision:video-analyzer`. Portanto, ela não é “compatível com GPT” por cópia direta.

O item `catalog/vision/vision` vem de [DLeungDL/vision](https://github.com/DLeungDL/vision) e é a alternativa mais próxima de um adapter reutilizável: aceita um modelo de visão via API OpenAI-compatible e declara suporte a Codex. Ainda assim, no Deskverse deve ser encapsulado por uma tool autorizada e pelo `InferenceGateway`; a chave nunca entra no prompt, trace ou interface.

## Compatibilidade com os modelos

As skills não serão duplicadas por modelo. A estratégia adotada é:

```text
skill canônica -> requisitos de capability -> ModelCapabilityProfile -> ModelAdapter -> InferenceGateway
```

O texto da skill descreve objetivo, método, critérios e formato de trabalho. Ele não deve conter nomes de APIs de fornecedor, parâmetros exclusivos, chaves ou instruções como “use Claude”. O arquivo [`compatibility/skill-requirements.json`](compatibility/skill-requirements.json) declara o que a tarefa precisa — por exemplo, visão, saída estruturada ou um worker de renderização — e [`compatibility/model-profiles.json`](compatibility/model-profiles.json) descreve o que o caminho efetivo do modelo declara suportar.

O adaptador não é um prompt alternativo completo. Ele apenas normaliza:

- reasoning pedido pela senioridade para o reasoning efetivo do modelo, registrando downgrade;
- entrada multimodal, saída estruturada, limite de contexto e compactação de resultado de tool;
- plano de carregamento progressivo da skill, referências e scripts;
- capability ausente, tool autorizada ausente e fallback semântico;
- metadados de auditoria para skill, revisão, profile, modelo e provider final.

O resolver de referência está em [`compatibility/resolve-skill.mjs`](compatibility/resolve-skill.mjs). Ele não chama nenhum fornecedor e não executa scripts das skills. Na SPRINT-09-02, sua lógica deverá ser incorporada ao `ModelAdapter`/`InferenceGateway` real, usando o catálogo de modelos do Gateway em runtime. Os JSONs deste diretório são um snapshot de planejamento, não fonte de cobrança ou autorização.

### Decisão para Claude Vision

O fluxo `video` continua preservado como `reference_only` porque o projeto original pressupõe hooks e um subagente próprio do Claude Code. O Deskverse reaproveita somente a ideia agnóstica: um worker extrai frames e transcrição; a skill canônica pede análise; o `ModelAdapter` envia imagens e texto para qualquer modelo cujo profile confirme `vision`. Isso permite GPT, Claude, Gemini, Kimi, Qwen ou outro modelo elegível sem fingir que a implementação original é portável por cópia.

`vision` é o candidato operacional para análise de imagens. `remotion-motion-graphics` e `ffmpeg-skill` são capacidades de worker, não capacidades exclusivas do LLM: o modelo planeja e verifica, enquanto tools autorizadas renderizam e manipulam mídia. Segredos, publicação e gravação de assets continuam fora do prompt e dependem das tools do Deskverse.

## Proveniência

Os repositórios, caminhos, revisões consultadas, licenças e agentes associados estão em [`registry.json`](registry.json). O catálogo foi baixado em 2026-09-16 e deve ser tratado como snapshot; atualizações futuras precisam renovar a revisão e repetir a auditoria.
