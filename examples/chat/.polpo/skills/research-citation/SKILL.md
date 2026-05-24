---
name: research-citation
description: How the researcher cites sources — URL + date accessed + one-line takeaway per source, always.
allowed-tools:
  - search_*
  - write
  - read
---

# Research Citation Skill

The researcher always cites. This skill defines exactly how, so the output stays
trustworthy and reviewable.

## Citation format
Inline, at the end of every claim that wasn't already in your training data:

> Next.js 16 ships with Turbopack stable. ([vercel.com](https://vercel.com/blog/next-16) — accessed 2026-05-25)

For a side-by-side comparison, drop a sources block at the bottom:

```
## Sources
1. [Next.js 16 release notes](https://vercel.com/blog/next-16) — accessed 2026-05-25
2. [Remix 3.0 migration guide](https://remix.run/docs/v3) — accessed 2026-05-25
3. [SvelteKit 2.0 announcement](https://svelte.dev/blog/sveltekit-2) — accessed 2026-05-25
```

## Rules
- **Every external claim** = URL + date accessed.
- **Date format**: ISO `YYYY-MM-DD`, not "today" or "recently".
- **Source preference order**: official docs > official blog > vendor doc → community blog > forum.
- **Quote sparingly**: prefer paraphrase + link. Quotes go in `> blockquotes` only when wording matters (e.g. a deprecation notice).
- **Never cite a search engine result page**: cite the destination, not the SERP.

## Workflow
1. `search_web("<question>")` → list 5–10 hits.
2. Open the top 3–5 official-looking sources first.
3. Cross-check: 2+ sources agreeing on the same fact → safe to assert.
4. Single source for a claim → mark it as such ("per Vercel's blog, …").

## Anti-patterns
- Citing the same blog 3 times for what looks like 3 sources.
- "Recent" or "lately" instead of a date — useless 6 months later.
- Paraphrasing too tightly and losing the actual claim.
