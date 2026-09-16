# PRD — Agente de inteligência de mercado

**Capability:** `market.intelligence`
**Tipo:** `SpecialistAgent` de pesquisa com workers de coleta
**Bloqueia MVP/Gate A0:** não

## Resultado

Encontrar fontes públicas, extrair fatos, comparar sinais, sintetizar cenários e declarar incerteza. A resposta precisa ligar cada afirmação a uma fonte e data; scraping não dá direito de copiar conteúdo protegido.

## Fluxo e tools

`question.refine` → `source.search` → `source.fetch` → `content.extract` → `evidence.normalize` → `claim.compare` → `uncertainty.score` → `report.publish`.

Search e crawl são jobs com robots.txt, terms, rate limit, cache, user-agent identificável e allowlist de domínios. A tool devolve metadados e trechos mínimos; não despeja páginas inteiras no contexto.

## Open source recomendado

- [SearXNG](https://github.com/searxng/searxng) com [Search API](https://github.com/searxng/searxng/blob/master/docs/dev/search_api.rst): metasearch self-hosted, atrás de um tool que registra engine, timestamp e query.
- [Scrapy](https://github.com/scrapy/scrapy), BSD-3-Clause: worker de coleta estruturada, com spiders por domínio, robots e throttling; nunca um crawler livre comandado por prompt.

## Aceite específico

- Fonte inacessível, conflitante ou desatualizada aparece na síntese.
- Claims distinguem fato, cálculo e inferência.
- Relatório com fontes e anexos é versionado no UploadThing após confirmação.
