# Requisitos de integração — SPRINT-15-16

- Operar SearXNG/Scrapy com robots, terms, rate limit, cache, user-agent e allowlist de domínio.
- Definir política de copyright, retenção e tamanho de trechos; não copiar páginas inteiras.
- Registrar URL, título, author, timestamp, consulta, engine, snapshot e confiança.
- Separar job de coleta do LLM; retry respeita backoff e não repete crawler sem necessidade.
- Cobrir fonte inacessível, conflito, paywall, conteúdo alterado e baixa evidência.
