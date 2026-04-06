# Contributing to Polpo UI

Thanks for your interest in contributing! Here's how to get started.

## Setup

```bash
git clone https://github.com/lumea-labs/polpo-ui.git
cd polpo-ui
pnpm install
```

## Development

```bash
# Run docs site
pnpm dev:docs

# Run an example
pnpm dev:example-chat
pnpm dev:example-chat-widget
pnpm dev:example-multi-agent

# Build the chat package
pnpm turbo build --filter=@polpo-ai/chat
```

## Project structure

```
polpo-ui/
├── packages/chat/       # @polpo-ai/chat — React components
├── packages/cli/        # @polpo-ai/ui — shadcn-style CLI
├── packages/create-app/ # create-polpo-app — project scaffolder
├── packages/examples/   # Component preview examples
├── examples/            # Starter templates (chat, chat-widget, multi-agent)
└── apps/docs/           # Documentation site (Fumadocs)
```

## Making changes

1. Fork the repo and create a branch from `main`
2. Make your changes
3. Ensure the build passes: `pnpm turbo build`
4. Open a pull request

## Component guidelines

- Use Tailwind utility classes with neutral gray tokens (`gray-50` through `gray-900`)
- No hardcoded colors — consumers map tokens via `@theme inline`
- Components must work in both light and dark mode
- Export props interfaces alongside components

## Commit conventions

Use conventional commits:

```
feat: add new component
fix: resolve dark mode issue
docs: update setup guide
```
