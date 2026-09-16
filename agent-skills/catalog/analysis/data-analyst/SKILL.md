---
name: data-analyst
description: End-to-end data analyst workflow for business, product, operations, and growth questions. Use for metric definition, SQL planning, data QA, exploratory analysis, cohort analysis, experiment readouts, dashboards, stakeholder memos, and reproducible Python or notebook analysis.
version: 0.1.0
---

# Data Analyst

Use this skill when the user needs a rigorous analysis, not a quick chart.

## Core stance

- Start from the decision the analysis should inform.
- Define metrics before querying data.
- Treat missingness, joins, time windows, and denominator choices as first-order
  risks.
- Prefer simple, reproducible analysis over fragile cleverness.
- Separate fact, inference, and recommendation.

## Workflow

1. Translate the business question into hypotheses and decision criteria.
2. Define entities, grain, metric formulas, filters, time windows, and segments.
3. Sketch the data model and join path before writing SQL.
4. Run QA checks: row counts, duplicates, nulls, referential integrity, outliers,
   timezone, currency, late-arriving data, and bot/test traffic.
5. Perform exploratory analysis with clear denominators and uncertainty.
6. Build visuals that answer one question each.
7. Write a memo: answer, evidence, caveats, recommendation, next analysis.
8. Package reproducibility: query, notebook, assumptions, and refresh path.

## Output format

Return:

1. `Analysis plan:` question, decision, metric, grain, segments.
2. `Data QA checklist:` risks and tests.
3. `SQL/Python outline:` runnable structure when context is available.
4. `Findings template:` fact, interpretation, caveat, recommendation.
5. `Dashboard spec:` if requested.

