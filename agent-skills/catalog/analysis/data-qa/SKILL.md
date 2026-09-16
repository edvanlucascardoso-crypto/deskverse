---
name: data-qa
description: Audit data quality for analysis, dashboards, or models, checking duplicates, nulls, outliers, joins, freshness, timezone, units, currencies, late-arriving data, schema drift, and source-of-truth conflicts.
version: 0.1.0
---

# Data QA

Use this skill before trusting a dataset or metric.

## Workflow

1. Identify dataset grain, source, owner, refresh schedule, and downstream use.
2. Check row counts, uniqueness, missingness, outliers, referential integrity,
   freshness, timezone, units, and schema changes.
3. Prioritize issues by decision impact.
4. Create reproducible QA queries or notebook checks.

## Output

Return `QA checklist`, `Test queries`, `Issue severity`, `Fix recommendations`,
and `Trust level`.

