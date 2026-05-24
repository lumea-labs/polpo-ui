---
name: feature-spec-template
description: Standard feature spec template every PM writes against. Engineer + reviewer read against it. Skips = blockers.
allowed-tools:
  - read
  - write
  - edit
---

# Feature Spec Template

Every feature shipped by the team uses this template. `product-manager` writes it,
`backend-engineer` reads it before designing, `reviewer` checks the PR against it.

## Sections (in order, all required)

### 1. Problem statement (1–2 sentences)
What user pain are we solving? Be concrete.

> *Bad*: "Improve the experience of bulk operations."
> *Good*: "Customers can't export more than 1 record at a time, so they're scripting against our public API to bulk-export. 3 enterprise accounts reported this in the last 30 days."

### 2. User story
> As a `<role>`, I want to `<action>`, so that `<outcome>`.

Single user story per spec. If you have more than one, split into separate specs.

### 3. Acceptance criteria
Numbered, testable, no ambiguity. Each AC will become at least one test.

```
1. User can select up to 1000 records and trigger export.
2. Export runs async; user sees a "preparing" state.
3. User receives an email with the download link within 5 minutes.
4. Export honors current filters and column visibility.
```

### 4. Out-of-scope
Explicit list of things the engineer might assume are in but are not.

```
- Streaming export (we'll do batched for v1).
- Custom column ordering on the export (defer to v2).
- Scheduled recurring exports.
```

### 5. Rollout plan
Who sees it first, when, and what gates it.

```
- Beta cohort: 5 enterprise customers who asked. Week of <date>.
- All paid customers: 1 week after beta if zero incidents.
- Flag: `bulk_export.enabled` (default false).
```

### 6. Why now (1 line)
The clock that makes this the right week to ship it.

> *Bad*: "It would be valuable."
> *Good*: "$5k MRR at risk — 2 customers said they'd churn at renewal without it."

## Anti-patterns
- Skipping "Why now" — anything without it waits.
- Acceptance criteria that aren't testable ("should feel fast").
- Out-of-scope as an afterthought — fill it before handing to eng.
- Rollout plan as "ship to all" — always name a cohort.
