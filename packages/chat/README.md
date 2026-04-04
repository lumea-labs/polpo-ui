# @polpo-ai/chat

Composable chat UI components for [Polpo](https://polpo.sh) AI agents. Built on top of `@polpo-ai/sdk` and `@polpo-ai/react`.

Three levels of composition — from zero-config to full control.

## Install

```bash
npm install @polpo-ai/chat
```

Peer dependencies:

```bash
npm install @polpo-ai/sdk @polpo-ai/react react react-virtuoso lucide-react streamdown
```

Or install individual components via shadcn:

```bash
npx shadcn add @polpo-ai/chat
```

## Quick Start

### Level 1 — Zero Config

```tsx
import { Chat } from "@polpo-ai/chat";

function ChatPage() {
  return <Chat sessionId="session_abc" agent="coder" />;
}
```

That's it. Messages, streaming, input with file attachments, scroll-to-bottom, tool calls, typing dots, skeleton loading — all included.

### Level 2 — Compose

```tsx
import { Chat, useChatContext } from "@polpo-ai/chat";

function MyCustomInput() {
  const { sendMessage, isStreaming, abort } = useChatContext();
  // Build your own input UI...
}

function ChatPage() {
  return (
    <Chat sessionId="session_abc" agent="coder" avatar={<Avatar />} agentName="Coder">
      <MyCustomInput />
    </Chat>
  );
}
```

Children replace the default `ChatInput`. Use `useChatContext()` to access chat state from any child.

#### Render Function Pattern

Use a render function for conditional rendering (e.g. landing page → conversation transition):

```tsx
<Chat agent="coder" onSessionCreated={(id) => router.push(`/chat/${id}`)}>
  {({ hasMessages }) =>
    hasMessages ? <ConversationInput /> : <LandingPage />
  }
</Chat>
```

When `hasMessages` is false and children is a render function, the message list is hidden automatically.

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

Root compound component. Wraps `ChatProvider` + `ChatMessages` + default `ChatInput`.

```tsx
<Chat
  sessionId="session_abc"       // Existing session ID (omit for new chats)
  agent="coder"                 // Agent name
  onSessionCreated={(id) => {}} // Called when server creates a new session
  avatar={<Avatar />}           // ReactNode for assistant messages
  agentName="Coder"             // Display name for assistant
  streamdownComponents={...}    // Custom code block renderer
  skeletonCount={3}             // Loading skeleton count
  inputPlaceholder="Ask me..."  // Default input placeholder
  inputHint="Enter to send"     // Hint text below default input
  allowAttachments={true}       // Enable file attachments on default input
  className="flex-1"            // Outer container class
  ref={chatMessagesRef}         // Ref to ChatMessagesHandle (scrollToBottom)
>
  {children}                    {/* Replaces default ChatInput */}
</Chat>
```

#### Session Navigation

The package does not handle routing — it's framework-agnostic. Use `onSessionCreated` to navigate when the first message creates a session:

```tsx
// Next.js App Router
import { useRouter } from "next/navigation";

const router = useRouter();
<Chat agent="coder" onSessionCreated={(id) => router.push(`/chat/${id}`)} />
```

```tsx
// React Router
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();
<Chat agent="coder" onSessionCreated={(id) => navigate(`/chat/${id}`)} />
```

### `<ChatInput>`

Default input with textarea, submit/stop button, file attachments, and drag & drop. Reads from `useChatContext()` — must be inside a `<ChatProvider>` or `<Chat>`.

```tsx
<ChatInput
  placeholder="Type a message..."
  hint="Enter to send, Shift+Enter for newline"
  allowAttachments={true}
  renderSubmit={({ isStreaming, onStop }) => <MyButton />}
  className="..."
/>
```

Included automatically in `<Chat>` when no children are provided. Pass children to `<Chat>` to replace it.

### `<ChatLanding>`

Full "new chat" landing page with greeting, input, and suggestions. Wraps its own `ChatProvider`.

```tsx
<ChatLanding
  agent="coder"
  onSessionCreated={(id) => router.push(`/chat/${id}`)}
  greeting="How can I help you?"
  subtitle="Ask anything about your codebase"
  suggestions={[
    { icon: <Zap size={14} />, text: "Automate a task" },
    { icon: <UserPlus size={14} />, text: "Create an agent" },
  ]}
  suggestionColumns={2}
  inputPlaceholder="Ask me anything..."
  inputHint="AI may make mistakes"
  allowAttachments={true}
  header={<Logo />}
/>
```

### `<ChatSuggestions>`

Configurable suggestion button grid.

```tsx
<ChatSuggestions
  suggestions={[
    { icon: <Zap size={14} />, text: "Automate a task" },
    { icon: <BarChart3 size={14} />, text: "Generate a report" },
  ]}
  onSelect={(text) => sendMessage(text)}
  columns={2}        // 1, 2, or 3
  className="mt-4"
/>
```

### `<ChatAgentSelector>`

Dropdown to pick an agent. Works standalone — no context required.

```tsx
<ChatAgentSelector
  agents={agents}                    // From useAgents().agents
  selected={selectedAgent}
  onSelect={setSelectedAgent}
  fallbackLabel="Select agent"
  renderAvatar={(agent, size) => <AgentAvatar agent={agent} size={size} />}
/>
```

### `<ChatSessionList>`

Flat list of chat sessions with select, delete, loading skeleton, and empty state.

```tsx
<ChatSessionList
  sessions={sessions}                // From useSessions().sessions
  agents={agents}                    // From useAgents().agents (for display names)
  activeSessionId={currentId}        // Highlighted session
  onSelect={(id) => router.push(`/chat/${id}`)}
  onDelete={deleteSession}           // Omit to hide delete buttons
  isLoading={isLoading}
  emptyMessage="No conversations yet"
  renderAvatar={(agent, name) => <AgentAvatar agent={agent} />}
/>
```

### `<ChatSessionsByAgent>`

Sessions grouped by agent, sorted by last activity, with session count badges.

```tsx
<ChatSessionsByAgent
  sessions={sessions}
  agents={agents}
  onSelect={(agentName) => router.push(`/chat/agent/${agentName}`)}
  isLoading={isLoading}
  renderAvatar={(agent, name) => <AgentAvatar agent={agent} />}
/>
```

### `<ChatMessage>`

Renders a single message. Dispatches to `ChatUserMessage` or `ChatAssistantMessage` based on role.

```tsx
<ChatMessage
  msg={message}
  isLast={true}
  isStreaming={false}
  avatar={<Avatar />}
  agentName="Coder"
  streamdownComponents={...}
/>
```

### `<ChatMessages>`

Virtuoso-powered scrollable message list with auto-scroll, scroll-to-bottom button, and skeleton loading.

```tsx
<ChatMessages
  renderItem={(msg, index, isLast, isStreaming) => <ChatMessage msg={msg} ... />}
  skeletonCount={3}
  className="flex-1"
  ref={ref}           // ChatMessagesHandle — { scrollToBottom() }
/>
```

Must be inside a `<ChatProvider>`.

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

## Context

### `<ChatProvider>`

Wraps `useChat` + `useFiles` from the SDK. All components that read chat state must be inside this provider (or inside `<Chat>`, which wraps it).

```tsx
<ChatProvider
  sessionId="session_abc"
  agent="coder"
  onSessionCreated={(id) => {}}
  onUpdate={() => {}}
>
  {children}
</ChatProvider>
```

### `useChatContext()`

Access chat state from any child of `<ChatProvider>`:

```tsx
const {
  messages,          // ChatMessage[]
  isStreaming,       // boolean
  status,            // "idle" | "streaming" | "loading" | "error"
  sendMessage,       // (content: string | ContentPart[]) => Promise<void>
  abort,             // () => void
  uploadFile,        // (dest, file, name) => Promise<...>
  isUploading,       // boolean
  pendingToolCall,   // ToolCallEvent | null
  sendToolResult,    // (toolCallId, result) => void
} = useChatContext();
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

Handles file uploads via SDK and sends messages with `ContentPart[]`.

```tsx
import { useSubmitHandler } from "@polpo-ai/chat/hooks";

const handleSubmit = useSubmitHandler(sendMessage, uploadFile);
// handleSubmit({ text: "Analyze this", files: [{ url, filename }] })
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

### `createStreamdownComponents(CodeBlockComponent?)`

Creates a Streamdown `components` override for fenced code blocks. Pass your own `CodeBlock` component for syntax highlighting:

```tsx
import { createStreamdownComponents } from "@polpo-ai/chat";
import { CodeBlock } from "@/components/ai-elements/code-block";

const streamdownComponents = createStreamdownComponents(CodeBlock);

<Chat streamdownComponents={streamdownComponents} ... />
```

## Full App Assembly Guide

Here's how to assemble a complete chat application using all the pieces. This mirrors a real production setup.

### 1. Prerequisites

```tsx
// layout.tsx — wrap your app with PolpoProvider
import { PolpoProvider } from "@polpo-ai/react";

export default function Layout({ children }) {
  return (
    <PolpoProvider
      baseUrl="https://api.polpo.sh"  // SDK appends /v1/ internally — do NOT add it
      apiKey={process.env.NEXT_PUBLIC_POLPO_API_KEY}
    >
      {children}
    </PolpoProvider>
  );
}
```

> **Important:** `baseUrl` is the root URL without `/v1/` or `/api/v1/`. The SDK appends the API version path internally. For self-hosted: `http://localhost:3000`.

### 2. Session list page

```tsx
import { useSessions, useAgents } from "@polpo-ai/react";
import { ChatSessionList, ChatSessionsByAgent } from "@polpo-ai/chat";

function SessionsPage() {
  const { sessions, isLoading, deleteSession } = useSessions();
  const { agents } = useAgents();
  const [view, setView] = useState<"all" | "byAgent">("all");

  return (
    <div>
      <header>
        <button onClick={() => setView("all")}>All</button>
        <button onClick={() => setView("byAgent")}>By Agent</button>
        <button onClick={() => router.push("/chat/new")}>New Chat</button>
      </header>

      {view === "all" ? (
        <ChatSessionList
          sessions={sessions}
          agents={agents}
          isLoading={isLoading}
          onSelect={(id) => router.push(`/chat/${id}`)}
          onDelete={deleteSession}
        />
      ) : (
        <ChatSessionsByAgent
          sessions={sessions}
          agents={agents}
          isLoading={isLoading}
          onSelect={(agent) => router.push(`/chat/agent/${agent}`)}
        />
      )}
    </div>
  );
}
```

### 3. New chat page (landing → conversation)

```tsx
import { useAgents } from "@polpo-ai/react";
import { Chat, ChatSuggestions, ChatAgentSelector, useChatContext } from "@polpo-ai/chat";

function NewChatPage() {
  const { agents } = useAgents();
  const [agent, setAgent] = useState(agents?.[0]?.name);

  return (
    <Chat agent={agent} onSessionCreated={(id) => router.replace(`/chat/${id}`)}>
      {({ hasMessages }) =>
        hasMessages ? (
          <MyInput />
        ) : (
          <Landing agents={agents} agent={agent} onAgentChange={setAgent} />
        )
      }
    </Chat>
  );
}

function Landing({ agents, agent, onAgentChange }) {
  const { sendMessage } = useChatContext();
  return (
    <div>
      <h1>How can I help?</h1>
      <MyInput />
      <ChatAgentSelector agents={agents} selected={agent} onSelect={onAgentChange} />
      <ChatSuggestions
        suggestions={[
          { icon: <Zap size={14} />, text: "Automate a workflow" },
          { icon: <BarChart3 size={14} />, text: "Generate a report" },
        ]}
        onSelect={(text) => sendMessage(text)}
      />
    </div>
  );
}
```

### 4. Chat conversation page

```tsx
import { Chat } from "@polpo-ai/chat";

// Level 1 — zero config
function ChatPage({ sessionId }) {
  return <Chat sessionId={sessionId} agent="coder" />;
}

// Level 2 — custom input, ask-user-question handling
function ChatPage({ sessionId }) {
  return (
    <Chat sessionId={sessionId} agent="coder" avatar={<MyAvatar />} agentName="Coder">
      <ChatInputWithAskUser />
    </Chat>
  );
}

function ChatInputWithAskUser() {
  const { pendingToolCall, sendMessage } = useChatContext();

  if (pendingToolCall?.toolName === "ask_user_question") {
    return (
      <ChatAskUser
        questions={pendingToolCall.arguments.questions}
        onSubmit={(answers) => sendMessage(JSON.stringify({ answers }))}
      />
    );
  }

  return <ChatInput placeholder="Ask anything..." />;
}
```

### 5. Styling override

Every component accepts `className`. For deeper customization, override Tailwind's gray palette in your CSS:

```css
/* globals.css — map your brand to Tailwind grays */
@theme inline {
  --color-gray-50: var(--bg);
  --color-gray-100: var(--warm);
  --color-gray-200: var(--line);
  --color-gray-400: var(--ink-3);
  --color-gray-600: var(--ink-2);
  --color-gray-900: var(--ink);
  --color-blue-500: var(--accent);
  --color-green-600: var(--green);
}
```

This maps the package's neutral grays to your brand colors — zero component changes needed.

## Styling

The package uses Tailwind utility classes with neutral gray colors by default. All components inherit fonts, colors, and sizing from the parent — the package ships **zero CSS**.

### Fonts

Components use `inherit` for all font properties. Set your fonts on the `<body>` or a parent wrapper:

```css
/* globals.css */
body {
  font-family: 'Inter', sans-serif;
}

/* Optional: heading/display font for agent names */
.font-display {
  font-family: 'Bricolage Grotesque', sans-serif;
}
```

The agent name in `ChatAssistantMessage` uses `text-[13px] font-semibold` — it inherits your body font. To use a display font, pass a styled `agentName` via the `avatar` slot or use `renderMessage` (Level 2).

### Colors

Override Tailwind's gray scale to match your brand:

```css
@theme inline {
  --color-gray-50: var(--bg);        /* backgrounds */
  --color-gray-100: var(--warm);     /* hover, cards */
  --color-gray-200: var(--line);     /* borders */
  --color-gray-400: var(--ink-3);    /* muted text */
  --color-gray-600: var(--ink-2);    /* secondary text */
  --color-gray-900: var(--ink);      /* primary text */
  --color-blue-500: var(--accent);   /* accent, focus rings */
  --color-green-600: var(--green);   /* success states */
}
```

### Font size

The package uses Tailwind's default scale (`text-xs`, `text-sm`, `text-[13px]`). To adjust message text size globally:

```css
/* Make all chat message text 15px */
.chat-wrapper {
  font-size: 15px;
}
```

Or use `className` on individual components for targeted overrides.

### Spacing and radius

Components use fixed Tailwind spacing (`px-6`, `py-3`, `rounded-2xl`, etc.). Override via `className` prop:

```tsx
<ChatInput className="px-4 py-2" />
<Chat className="max-w-4xl mx-auto" />
```

### CSS custom properties (no Tailwind)

If you don't use Tailwind, the components still work — define the gray/blue/green colors as plain CSS:

```css
:root {
  /* The package references Tailwind classes like bg-gray-100, text-gray-900 etc.
     With Tailwind installed, just override the palette as shown above.
     Without Tailwind, you'll need to provide the utility classes yourself
     or use Level 3 primitives with your own styling. */
}
```

## Keyframe Animations

Add to your `globals.css` for the typing indicator:

```css
@keyframes typing-dot {
  0%, 60%, 100% { opacity: .3; transform: translateY(0); }
  30% { opacity: 1; transform: translateY(-3px); }
}
```

## License

MIT
