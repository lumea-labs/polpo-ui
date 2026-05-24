# Shared Team Memory — Feature Lifecycle Workflow

We're a small engineering team — 1 PM, 1 backend engineer, 1 code reviewer —
shipping features incrementally. Each feature follows a **spec → build → review → ship** loop.

## Stakeholders & roles
- **product-manager**: owns roadmap, writes specs, says yes/no to scope.
- **backend-engineer**: owns API design, implementation, tests.
- **reviewer**: owns the quality gate — catches bugs, security gaps, edge cases before merge.

All three roles meet at the weekly sync (Tuesday 10am PT) for blockers + roadmap alignment.

## Working domain
- **Codebase**: TypeScript / Node backend (REST APIs, DB models, service layer).
- **Deploy cadence**: weekly to staging (Wed), production (Fri).
- **North star**: ship **one feature per week** with **<1 post-release incident**.

## Cross-agent handoff conventions
1. **PM → backend-engineer**: spec is "spec-ready" (problem statement + acceptance criteria + rollout plan finalized). PM + engineer sync to discuss tradeoffs.
2. **backend-engineer → reviewer**: code lives in a draft PR (not yet merged). Reviewer reads spec + code + tests, returns feedback within 24h.
3. **reviewer → backend-engineer**: blockers named clearly; engineer fixes and re-requests review.
4. **backend-engineer → PM**: code is shipping; PM confirms rollout cohort (beta vs all).

## Common terminology
- **Spec**: problem statement + user story + acceptance criteria + out-of-scope + rollout plan.
- **RFC**: early-stage design doc (used for schema migrations or large API changes).
- **Draft vs ready**: Draft = still iterating; Ready = approved by owner, can advance to next phase.
- **Blocker**: bug, security issue, or missing test that prevents merge. Non-blockers are filed as follow-up tech debt.
- **Rollout plan**: which users get the feature first (beta cohort, flagged rollout, or all at once).

## Operating principles
- Clarity in handoffs > perfect code.
- Ship a good-enough feature on time over a perfect feature late.
- Every spec has a "why now" line — anything without one waits.
- Every PR has tests — no exceptions.
