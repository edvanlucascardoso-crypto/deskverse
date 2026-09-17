# Recomendações open source — Agentes futuros

Catálogo de pesquisa para orientar skills sob demanda, adapters, MCPs e tools pequenas. A pesquisa foi feita em 16/09/2026; licença e segurança devem ser revalidadas no Spike de cada agente antes de incorporar código ou executar um serviço.

## Como usar

O agente recebe um prompt mestre curto e carrega estas capacidades sob demanda por `skillId`/`capability`. A skill descreve intenção, limites, entradas e saída; o adapter traduz o contrato neutro do Deskverse para o projeto externo. Nenhuma integração recebe `workspaceId`, credenciais ou URLs diretamente do LLM como autoridade.

| Agente | Solução pesquisada | Forma recomendada | Observação |
|---|---|---|---|
| 15-01 Crescimento | [Matomo](https://github.com/matomo-org/matomo) · [Mautic](https://github.com/mautic/mautic) | MCP/API de analytics e automação | Self-hosted, mas exige revisão de multi-tenant, consentimento e LGPD. |
| 15-02 Motion Design | [OpenTimelineIO](https://github.com/AcademySoftwareFoundation/OpenTimelineIO) · [OpenColorIO](https://github.com/AcademySoftwareFoundation/OpenColorIO) | Tools/adapters de intercâmbio e cor | Não substituem o documento canônico; Remotion e o adapter do Premation seguem as decisões do PRD. |
| 15-03 Desenvolvimento Web | [OpenHands SDK](https://github.com/OpenHands/software-agent-sdk/) · [Playwright MCP](https://github.com/microsoft/playwright/blob/main/docs/src/getting-started-mcp.md) | SDK/tool isolada e MCP de browser | Playwright pode executar JavaScript arbitrário: sandbox, allowlist, approval e rede restrita são obrigatórios. |
| 15-04 Tráfego | [Matomo](https://matomo.org/guide/apis/analytics-api/) · [Mautic](https://github.com/mautic/mautic) | MCP/API de métricas e campanhas | Separar leitura de analytics de ações de disparo/publicação. |
| 15-05 Contabilidade Brasileira | [sped-nfe](https://github.com/nfephp-org/sped-nfe) · [documentação NFePHP](https://nfephp-org.github.io/nfephp/) | Tool de emissão/validação fiscal | Rodar em serviço isolado, com certificado e dados fiscais fora do prompt; consultar contador e legislação vigente. |
| 15-06 Gestão | [ERPNext](https://github.com/frappe/erpnext) · [Plane](https://plane.so/open-source) | API/MCP para indicadores e execução autorizada | Integrar por domínio, sem transformar ERP externo em fonte de verdade do Deskverse. |
| 15-07 Pré-vendas | [EspoCRM](https://github.com/espocrm/espocrm) · [Mautic](https://github.com/mautic/mautic) | Adapter REST/MCP para CRM e automação | Dedupe, opt-out e consentimento são requisitos de primeira classe. |
| 15-08 Fechamento Comercial | [SuiteCRM](https://github.com/SuiteCRM/SuiteCRM) · [EspoCRM](https://github.com/espocrm/espocrm) | MCP/API para proposta e CRM | Toda alteração comercial deve ser auditada e aprovação deve preceder efeitos irreversíveis. |
| 15-09 Pós-vendas | [Chatwoot](https://github.com/chatwoot/chatwoot) · [OpenProject](https://www.openproject.org/docs/api/) | Webhooks/API para inbox e tarefas | Takeover humano e coexistência devem permanecer no núcleo neutro de mensagens. |
| 15-10 Atendimento | [Rasa](https://github.com/RasaHQ/rasa) · [Chatwoot](https://github.com/chatwoot/chatwoot) | Adapter REST/OpenAPI e inbox | Rasa é opção de classificação/roteamento; o agente não promete política ausente. |
| 15-11 Gestão de Projetos | [OpenProject](https://www.openproject.org/docs/api/) · [Plane](https://developers.plane.so/api-reference/introduction) | MCP de consulta e tool autorizada de planejamento | A tela de projetos do Deskverse continua somente leitura para a pessoa usuária. |
| 15-12 Edição de Vídeo | [OpenTimelineIO](https://github.com/AcademySoftwareFoundation/OpenTimelineIO) · [FFmpeg](https://ffmpeg.org/) · [OpenCut](https://github.com/OpenCut-app/OpenCut) | Tools de timeline, probe e encode | OTIO/FFmpeg são adjacentes; composição editável, policy e lineage pertencem ao Deskverse. |
| 15-13 Efeitos Visuais | [OpenColorIO](https://github.com/AcademySoftwareFoundation/OpenColorIO) · [Natron](https://github.com/NatronGitHub/Natron) · [ComfyUI](https://github.com/Comfy-Org/ComfyUI) | Adapter de cor; engines opcionais em worker | O caminho padrão é o MCP oficial do Higgsfield; Natron/ComfyUI têm licenças copyleft e exigem isolamento/parecer. |
| 15-14 Controle Financeiro | [Firefly III](https://github.com/firefly-iii/firefly-iii) | API/MCP de leitura e reconciliação | Não substituir Abacate Pay; valores e lançamentos precisam de trilha de auditoria. |
| 15-15 Dados e BI | [Apache Superset](https://github.com/apache/superset) · [DuckDB](https://duckdb.org/) | Tool de consulta/semântica e worker analítico | Limitar consultas por workspace, custo, tempo e volume; resultados devem carregar origem. |
| 15-16 Inteligência de Mercado | [SearXNG](https://github.com/searxng/searxng/blob/master/docs/dev/search_api.rst) · [Scrapy](https://github.com/scrapy/scrapy) | MCP de pesquisa e worker de coleta | Respeitar robots, termos, rate limit, privacidade e direitos autorais; não tratar coleta como verdade sem fonte. |
| 15-17 Observador Humano | [OpenTelemetry JS](https://github.com/open-telemetry/opentelemetry-js) · [Langfuse](https://github.com/langfuse/langfuse) | Tool de traces, avaliação e revisão | OpenTelemetry é a base neutra; Langfuse é opcional e não substitui auditoria do Deskverse. |
| 15-18 Liderança Multi-grupo | [LangGraph](https://github.com/langchain-ai/langgraph) | Runtime/adapter experimental | Usar somente para subgrafos explícitos; política, identidade e autorização continuam no AgentRuntime. |
| 15-19 Plataforma de Imagem | [Diffusers](https://github.com/huggingface/diffusers) · [ComfyUI](https://github.com/Comfy-Org/ComfyUI) | Worker/endpoint GPU e workflows isolados | Qwen-Image/FLUX e pesos exigem allowlist, model card, licença e benchmark; GPU vai para RunPod Serverless. |

## Licenças e fronteiras

- Preferir adapters ou MCPs sobre importar código para o Next. MIT, Apache-2.0, BSD e GPL/AGPL não são intercambiáveis; a licença do projeto, dependências e pesos precisa ser verificada na versão fixada.
- Natron, ComfyUI e outras dependências copyleft ficam em serviços/engines isolados até parecer jurídico. O broker do Deskverse não incorpora código copyleft nem expõe execução arbitrária.
- Higgsfield não é open source: o [MCP oficial](https://higgsfield.ai/mcp) é uma integração externa proprietária, autenticada por OAuth e sujeita a créditos. Ele é recomendado para VFX por capacidade, não por reutilização de código.
- APIs/MCPs, Redis, scheduler e workers CPU são hospedados no Railway. Jobs GPU/RENDER usam endpoints assíncronos em modo Serverless no RunPod; o app nunca chama um worker físico diretamente.

## Fontes de decisão

- [MCP oficial do Higgsfield](https://higgsfield.ai/mcp) e [documentação do Higgsfield](https://docs.higgsfield.ai/).
- [Playwright MCP](https://github.com/microsoft/playwright/blob/main/docs/src/getting-started-mcp.md), como referência de risco para tools de browser.
- [OpenTimelineIO](https://github.com/AcademySoftwareFoundation/OpenTimelineIO) e [OpenColorIO](https://github.com/AcademySoftwareFoundation/OpenColorIO), como base para vídeo/motion/VFX.
- [OpenTelemetry](https://opentelemetry.io/docs/concepts/semantic-conventions/), como referência de semântica de traces.
