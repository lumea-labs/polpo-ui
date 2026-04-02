# @polpo-ai/chat

Composable chat UI components for [Polpo](https://polpo.sh) AI agents. Built on top of `@polpo-ai/sdk` and `@polpo-ai/react`.

Three levels of composition — from zero-config to full control.

## Install

```bash
npm install @polpo-ai/chat
```

Peer dependencies:

```bash
npm install @polpo-ai/sdk @polpo-ai/react react react-virtuoso lucide-react
```

## Quick Start

### Level 1 — Zero Config

```tsx
import { Chat } from "@polpo-ai/chat";

function ChatPage() {
  return <Chat sessionId="session_abc" agent="coder" />;
}
```

That's it. Messages, streaming, scroll-to-bottom, tool calls, typing dots, skeleton loading — all included.

### Level 2 — Compose

```tsx
import { Chat, useChatContext } from "@polpo-ai/chat";

function ChatInput() {
  const { sendMessage, isStreaming, abort } = useChatContext();

  return (
    <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}>
      <textarea />
      {isStreaming ? <button onClick={abort}>Stop</button> : <button type="submit">Send</button>}
    </form>
  );
}

function ChatPage() {
  return (
    <Chat sessionId="session_abc" agent="coder" avatar={<Avatar />} agentName="Coder">
      <ChatInput />
    </Chat>
  );
}
```

Children render below the message list. Use `useChatContext()` to access chat state from any child.

### Level 3 — Primitives

```tsx
import { useChat } from "@polpo-ai/react";
import { ChatMessage, ToolCallChip, ChatSkeleton } from "@polpo-ai/chat";

function MyChat() {
  const { messages, sendMessage, isStreaming } = useChat({ agent: "coder" });

  return (
    <div>
      {messages.map((msg, i) => (
        <ChatMessage key={msg.id} msg={msg} isLast={i === messages.length - 1} isStreaming={isStreaming} />
      ))}
    </div>
  );
}
```

Use individual components and hooks to build completely custom layouts.

## Components

### `<Chat>`

Root compound component. Wraps `ChatProvider` + `ChatMessages` + `ChatScrollButton`.

```tsx
<Chat
  sessionId="session_abc"     // Existing session ID (omit for new chats)
  agent="coder"               // Agent name
  onSessionCreated={(id) => {}} // Called when server creates a new session
  avatar={<Avatar />}         // ReactNode for assistant messages
  agentName="Coder"           // Display name for assistant
  streamdownComponents={...}  // Custom code block renderer
  skeletonCount={3}           // Loading skeleton count
  className="flex-1"          // Outer container class
>
  {children}                  {/* Rendered below messages (e.g. input bar) */}
</Chat>
```

### `<ChatMessage>`

Renders a single message. Dispatches to `ChatUserMessage` or `ChatAssistantMessage` based on role.

```tsx
<ChatMessage
  msg={message}               // ChatMessageItemData
  isLast={true}               // Is this the last message?
  isStreaming={false}          // Is the chat currently streaming?
  avatar={<Avatar />}         // Assistant avatar (ReactNode)
  agentName="Coder"           // Assistant display name
  streamdownComponents={...}  // Markdown renderer override
/>
```

### `<ChatMessages>`

Virtuoso-powered scrollable message list with auto-scroll, scroll-to-bottom button, and skeleton loading.

```tsx
<ChatMessages
  renderItem={(msg, index, isLast, isStreaming) => <ChatMessage msg={msg} ... />}
  skeletonCount={3}
  className="flex-1"
/>
```

Uses `useChatContext()` internally. Must be inside a `<ChatProvider>`.

### `<ChatScrollButton>`

Scroll-to-bottom button with new message indicator.

```tsx
<ChatScrollButton isAtBottom={false} showNewMessage={true} onClick={scrollToBottom} />
```

### `<ChatSkeleton>`

Loading skeleton matching the message layout.

```tsx
<ChatSkeleton count={3} />
```

### `<ChatTyping>`

Animated typing dots.

```tsx
<ChatTyping className="text-gray-400" />
```

## Tool Calls

Built-in renderers for common Polpo tools:

| Tool | Renderer | What it shows |
|------|----------|--------------|
| `read` | `ToolRead` | File path + content with line numbers |
| `write` / `edit` | `ToolWrite` | File path + content preview in green |
| `bash` | `ToolBash` | Command with `$` prompt + dark terminal output |
| `grep` / `glob` | `ToolSearch` | Pattern + matched results list |
| `http_fetch` / `search_web` | `ToolHttp` | URL + response preview |
| `email_send` | `ToolEmail` | To, subject, body preview |
| `ask_user_question` | `ToolAskUser` | Questions with answered state |
| (any other) | `ToolCallShell` | Generic with expand/collapse |

### Custom Tool Renderers

```tsx
import { ToolCallShell } from "@polpo-ai/chat/tools";
import { Database } from "lucide-react";

function ToolDatabaseQuery({ tool }) {
  const query = tool.arguments?.query;
  return (
    <ToolCallShell tool={tool} icon={Database} label="Query" summary={query}>
      <pre>{tool.result}</pre>
    </ToolCallShell>
  );
}
```

## Hooks

### `useSubmitHandler(sendMessage, uploadFile)`

Handles file uploads and sends messages with `ContentPart[]`.

```tsx
import { useSubmitHandler } from "@polpo-ai/chat/hooks";

const handleSubmit = useSubmitHandler(sendMessage, uploadFile);
// handleSubmit({ text: "Analyze this", files: [...] })
```

### `useDocumentDrag()`

Tracks document-level drag state for drop overlay feedback.

```tsx
import { useDocumentDrag } from "@polpo-ai/chat/hooks";

const dragging = useDocumentDrag();
// dragging: boolean — true when files are being dragged over the page
```

## Utilities

### `getTextContent(content)`

Extracts text from `string | ContentPart[]`.

### `relativeTime(isoString)`

Formats timestamps as "Just now", "2m ago", "An hour ago", or full date.

## Styling

The package uses Tailwind utility classes. Colors reference CSS custom properties:

```css
:root {
  --bg: #FAFAF7;
  --surface: #FFFFFF;
  --ink: #0F0F0F;
  --ink-2: #555;
  --ink-3: #999;
  --p-accent: #E2733D;
  --accent-light: #FDF0E8;
  --green: #1A7F52;
  --green-light: #E8F5EE;
  --warm: #F3F0EB;
  --line: #E5E1DA;
}
```

Override these in your `globals.css` to match your brand. No CSS is shipped — everything is Tailwind inline.

## Keyframe Animations

Add these to your Tailwind config or `globals.css`:

```css
@keyframes typing-dot {
  0%, 60%, 100% { opacity: .3; transform: translateY(0); }
  30% { opacity: 1; transform: translateY(-3px); }
}
```

## License

MIT
