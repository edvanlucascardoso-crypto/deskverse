---
name: metric-definition
description: Define business, product, growth, finance, and operations metrics with grain, denominator, filters, time window, edge cases, owner, and decision use.
version: 0.1.0
---

# Metric Definition

Use this skill before writing SQL or building a dashboard.

## Workflow

1. Define decision, metric name, entity, grain, numerator, denominator, filters,
   time window, timezone, and exclusions.
2. Identify edge cases: refunds, test users, bots, cancellations, late data,
   duplicated events, currency, and cohort rules.
3. Create examples and anti-examples.

## Output

Return `Metric spec`, `Edge cases`, `SQL-ready definition`, `QA checks`, and
`Stakeholder wording`.

