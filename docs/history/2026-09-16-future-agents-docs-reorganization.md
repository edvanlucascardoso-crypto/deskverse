# Reorganizacao da documentacao de agentes futuros

## Data e escopo

16/09/2026. Reorganizacao do catalogo de recomendacoes open source dos agentes futuros e remocao do pacote de documentacao que duplicava a estrutura ativa de sprints.

## Motivo e contexto

As recomendacoes de open source precisavam permanecer consultaveis sem aparentar ser uma sprint ativa ou um requisito do MVP. A documentacao removida descrevia servicos e defaults de uma fase futura fora da prioridade atual.

## Estado anterior

- O catalogo open source, o README da Fase 15 e o mapa de servicos ficavam agrupados em `docs/sprints/15-future-agents`.
- A localizacao podia sugerir que a Fase 15 era uma frente executavel ou dependencia do MVP.

## Novo estado

- O catalogo open source fica em `docs/sprints/OPEN_SOURCE_RECOMMENDATIONS.md` como referencia transversal.
- Os documentos gerais removidos da Fase 15 deixam de ser tratados como plano ativo de execucao.

## Impacto em produto, arquitetura e roadmap

- Produto e arquitetura: nenhuma integracao e ativada; o catalogo continua apenas como referencia para spikes futuros.
- Roadmap: reduz a aparencia de dependencia da Fase 15 sobre o MVP e preserva a prioridade declarada nas fases ativas.

## Arquivos e contratos afetados

- Catalogo de recomendacoes open source e documentos gerais de `docs/sprints/15-future-agents`.

## Evidencias

- O catalogo continua acessivel no novo caminho e nao altera codigo de runtime.

## Riscos e integracoes pendentes

- Cada spike futuro ainda deve revalidar licenca, seguranca, custo e multi-tenancy antes de incorporar qualquer servico.

## Fora do escopo

Instalacao de dependencias, ativacao de workers, criacao de MCPs e implementacao de qualquer agente futuro.

## Decisao tomada e decisao em aberto

Decisao tomada: recomendacoes transversais nao sao apresentadas como uma fase executavel do roadmap atual.

Decisao em aberto: definir a estrutura documental de cada agente futuro quando sua sprint for priorizada.

## Relacao com registros anteriores

Complementa [2026-09-16-modelo-de-agentes-e-referencias.md](2026-09-16-modelo-de-agentes-e-referencias.md), mantendo a regra de nao antecipar agentes do MVP.
