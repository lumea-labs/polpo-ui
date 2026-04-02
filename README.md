# @polpo-ai/ui

UI components for building AI agent interfaces with [Polpo](https://polpo.sh).

Built on React + Tailwind CSS. Works with Next.js, Vite, Remix, or any React project.

## Quick Start

```bash
npx @polpo-ai/ui add chat
```

## Components

- **chat** — Message thread, input, streaming responses, tool calls
- **tasks** — Task card, status badge, output viewer
- **agents** — Agent card, agent selector
- **sessions** — Session list, session viewer
- **shared** — Markdown renderer, code block, skeleton, badges

## Philosophy

Same pattern as [shadcn/ui](https://ui.shadcn.com) — components are copied into your project. You own the code, customize freely.

Depends on `@polpo-ai/react` (hooks) and `@polpo-ai/sdk` (client) as peer dependencies.

## License

MIT
