# Polpo UI

A component library for building AI agent interfaces with [Polpo](https://polpo.sh). Composable chat components, tool renderers, session management — wired to the Polpo SDK.

## Installation

### New project

```bash
npx create-polpo-app
```

### Add to existing project

```bash
npx @polpo-ai/ui add chat
```

Components are copied into your project. You own the code.

### npm package

```bash
npm install @polpo-ai/chat
```

## Quick Start

```tsx
import { PolpoProvider } from "@polpo-ai/react";
import { Chat } from "@polpo-ai/chat";

export default function App() {
  return (
    <PolpoProvider baseUrl="https://api.polpo.sh" apiKey="sk_live_...">
      <Chat agent="coder" />
    </PolpoProvider>
  );
}
```

## Components

| Component | Description |
|-----------|-------------|
| Chat | Full chat interface — messages, input, streaming, tool calls |
| ChatInput | Textarea with file attachments and drag & drop |
| ChatMessage | Message renderer with markdown and code blocks |
| ChatSessionList | Session list with select, delete, loading states |
| ChatSessionsByAgent | Sessions grouped by agent |
| ChatAgentSelector | Agent picker dropdown |
| ChatSuggestions | Configurable suggestion button grid |
| ChatAskUser | Interactive question wizard |
| ChatLanding | Landing page with greeting, input, suggestions |
| ChatSkeleton | Loading skeleton matching message layout |
| ToolCallChip | Auto-dispatching tool call renderer |
| Tasks | *In progress* |

## Starter Templates

```bash
npx create-polpo-app my-app -t chat          # Full-page chat
npx create-polpo-app my-app -t chat-widget   # Support widget
npx create-polpo-app my-app -t multi-agent   # Multi-agent workspace
```

## Prerequisites

- React 18+
- Tailwind CSS 3 or 4
- A [Polpo](https://polpo.sh) account

Works with Next.js, Vite, Remix, React Router, Astro, TanStack.

## Packages

| Package | Description |
|---------|-------------|
| `@polpo-ai/chat` | Chat components and tool renderers |
| `@polpo-ai/ui` | CLI for adding components to your project |
| `create-polpo-app` | Project scaffolder with starter templates |

## Documentation

[ui.polpo.sh](https://ui.polpo.sh)

## Credits

Built with [React](https://react.dev), [React Virtuoso](https://virtuoso.dev), [Lucide](https://lucide.dev), and [Streamdown](https://github.com/nichochar/streamdown).

## License

MIT
