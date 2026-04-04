"use client";

import { useState } from "react";
import Link from "next/link";
import { highlight } from "sugar-high";
import { PolpoProvider } from "@polpo-ai/react";
import {
  ChatInput,
  ChatInputCompact,
  ChatLanding,
  ChatSessionList,
  ChatSessionsByAgent,
  ChatSuggestions,
  ChatAgentSelector,
  ChatAskUser,
  ChatProvider,
  ChatUserMessage,
  ChatAssistantMessage,
  ChatTyping,
  ChatScrollButton,
  ChatSkeleton,
  MessageSkeleton,
  UserMessageSkeleton,
  ToolCallChip,
  relativeTime,
  getTextContent,
} from "@polpo-ai/chat";
import type { ChatMessageItemData } from "@polpo-ai/chat";

/* ------------------------------------------------------------------ */
/*  Mock data — messages                                               */
/* ------------------------------------------------------------------ */

const userMsg: ChatMessageItemData = {
  id: "u1",
  role: "user",
  content: "Can you add a users table with email and role fields?",
  ts: new Date(Date.now() - 120000).toISOString(),
};

const userMsgWithFile: ChatMessageItemData = {
  id: "u2",
  role: "user",
  content: [
    { type: "text", text: "Here's my schema, please update it" },
    { type: "file", file_id: "workspace/schema.prisma" },
  ],
  ts: new Date(Date.now() - 90000).toISOString(),
};

const assistantMsg: ChatMessageItemData = {
  id: "a1",
  role: "assistant",
  content: "I'll add the users table with email validation and a role enum. Let me update your schema and run the migration.",
  ts: new Date(Date.now() - 60000).toISOString(),
  toolCalls: [
    { id: "t1", name: "write", state: "completed", arguments: { path: "prisma/schema.prisma" } } as any,
    { id: "t2", name: "bash", state: "completed", arguments: { command: "npx prisma migrate dev" }, result: "Migration applied: add_users_table\n\nYour database is now in sync." } as any,
  ],
};

/* ------------------------------------------------------------------ */
/*  Mock data — tool calls                                             */
/* ------------------------------------------------------------------ */

const toolBash = { id: "tb", name: "bash", state: "completed" as const, arguments: { command: "npm test -- --coverage" }, result: "PASS  src/__tests__/todos.test.ts\n  ✓ GET /api/todos (12ms)\n  ✓ POST /api/todos (8ms)\n\nTests: 2 passed, 2 total\nCoverage: 94%" } as any;

const toolWrite = { id: "tw", name: "write", state: "completed" as const, arguments: { path: "src/routes/todos.ts" } } as any;

const toolRead = { id: "tr", name: "read", state: "completed" as const, arguments: { path: "src/config.ts" }, result: 'export const config = {\n  port: 3000,\n  jwtSecret: process.env.JWT_SECRET,\n};' } as any;

const toolPending = { id: "tp", name: "search_web", state: "calling" as const, arguments: { query: "express rate limiting" } } as any;

const toolError = { id: "te", name: "bash", state: "error" as const, arguments: { command: "npm run deploy" }, result: "Error: EACCES permission denied" } as any;

/* ------------------------------------------------------------------ */
/*  Mock data — sessions                                               */
/* ------------------------------------------------------------------ */

const mockSessions = [
  { id: "s1", title: "Add users table to Prisma schema", agent: "coder", createdAt: new Date(Date.now() - 3600000).toISOString(), updatedAt: new Date(Date.now() - 1800000).toISOString() },
  { id: "s2", title: "Debug authentication middleware", agent: "coder", createdAt: new Date(Date.now() - 7200000).toISOString(), updatedAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "s3", title: "Write API documentation", agent: "writer", createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: new Date(Date.now() - 43200000).toISOString() },
  { id: "s4", title: "Review pull request #42", agent: "reviewer", createdAt: new Date(Date.now() - 172800000).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString() },
] as any[];

const mockAgents = [
  { name: "coder", role: "Full-stack developer", identity: { displayName: "Coder" } },
  { name: "writer", role: "Technical writer", identity: { displayName: "Writer" } },
  { name: "reviewer", role: "Code reviewer", identity: { displayName: "Reviewer" } },
] as any[];

/* ------------------------------------------------------------------ */
/*  Mock data — suggestions                                            */
/* ------------------------------------------------------------------ */

const mockSuggestions = [
  { text: "Add a new API endpoint" },
  { text: "Write unit tests" },
  { text: "Refactor this function" },
  { text: "Explain this code" },
];

/* ------------------------------------------------------------------ */
/*  Mock data — ask-user questions                                     */
/* ------------------------------------------------------------------ */

const mockQuestions = [
  {
    id: "q1",
    question: "Which database do you want to use?",
    header: "Database",
    options: [
      { label: "PostgreSQL", description: "Recommended for production" },
      { label: "SQLite", description: "Great for development" },
      { label: "MySQL", description: "Wide compatibility" },
    ],
    custom: true,
  },
];

/* ------------------------------------------------------------------ */
/*  Copy button                                                        */
/* ------------------------------------------------------------------ */

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); } catch { /* noop */ }
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="text-fd-muted-foreground/40 hover:text-fd-muted-foreground transition-colors shrink-0"
    >
      {copied ? (
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Section + CodeBlock                                                */
/* ------------------------------------------------------------------ */

function Code({ filename, code }: { filename: string; code: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-fd-border bg-fd-card shadow-sm">
      <div className="flex items-center justify-between border-b border-fd-border/50 px-4 py-2">
        <span className="font-mono text-[10px] text-fd-muted-foreground/60">{filename}</span>
        <CopyBtn text={code} />
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="font-mono text-[13px] leading-relaxed"><code dangerouslySetInnerHTML={{ __html: highlight(code) }} /></pre>
      </div>
    </div>
  );
}

function Section({ id, label, title, desc, preview, code, codeOnly }: {
  id: string;
  label: string;
  title: string;
  desc: string;
  preview?: React.ReactNode;
  code: { filename: string; code: string };
  codeOnly?: boolean;
}) {
  const [tab, setTab] = useState<"preview" | "code">(codeOnly ? "code" : "preview");

  return (
    <section id={id} className="scroll-mt-20">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-fd-primary">{label}</p>
      <h2 className="mt-2 text-xl font-extrabold tracking-tight md:text-2xl">{title}</h2>
      <p className="mt-2 max-w-lg text-sm text-fd-muted-foreground">{desc}</p>

      <div className="mt-4">
        {/* Tabs */}
        {!codeOnly && (
          <div className="flex gap-1 rounded-lg bg-fd-muted/40 p-1 w-fit mb-4">
            <button
              onClick={() => setTab("preview")}
              className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors ${
                tab === "preview"
                  ? "bg-fd-card text-fd-foreground shadow-sm"
                  : "text-fd-muted-foreground hover:text-fd-foreground"
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setTab("code")}
              className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors ${
                tab === "code"
                  ? "bg-fd-card text-fd-foreground shadow-sm"
                  : "text-fd-muted-foreground hover:text-fd-foreground"
              }`}
            >
              Code
            </button>
          </div>
        )}

        {/* Content */}
        <div className="min-h-[350px]">
          {tab === "preview" && preview ? (
            <div className="rounded-xl border border-fd-border bg-fd-card overflow-hidden p-6 min-h-[350px] flex items-start">
              <div className="w-full">{preview}</div>
            </div>
          ) : (
            <div className="min-h-[350px]">
              <Code filename={code.filename} code={code.code} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Nav                                                                */
/* ------------------------------------------------------------------ */

const NAV = [
  { id: "chat", label: "Chat" },
  { id: "chat-input", label: "ChatInput" },
  { id: "chat-input-compact", label: "ChatInputCompact" },
  { id: "chat-landing", label: "ChatLanding" },
  { id: "messages", label: "Messages" },
  { id: "tool-calls", label: "Tool Calls" },
  { id: "typing", label: "Typing" },
  { id: "scroll-button", label: "Scroll Button" },
  { id: "skeletons", label: "Skeletons" },
  { id: "suggestions", label: "ChatSuggestions" },
  { id: "agent-selector", label: "ChatAgentSelector" },
  { id: "session-list", label: "ChatSessionList" },
  { id: "sessions-by-agent", label: "ChatSessionsByAgent" },
  { id: "ask-user", label: "ChatAskUser" },
  { id: "chat-provider", label: "ChatProvider" },
  { id: "chat-messages", label: "ChatMessages" },
  { id: "tool-call-shell", label: "ToolCallShell" },
  { id: "streamdown", label: "Streamdown" },
  { id: "utilities", label: "Utilities" },
  { id: "hooks", label: "Hooks" },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ChatComponentsPage() {
  const [scrollDemo, setScrollDemo] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>("coder");
  const [askDisabled, setAskDisabled] = useState(false);

  return (
    <PolpoProvider baseUrl="https://api.polpo.sh" autoConnect={false}>
    <div className="mx-auto w-full max-w-[var(--fd-layout-width)] px-6 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-fd-muted-foreground mb-8">
        <Link href="/" className="hover:text-fd-foreground transition-colors">Home</Link>
        <span>/</span>
        <span className="text-fd-foreground">Chat Components</span>
      </div>

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Chat Components</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-fd-muted-foreground">
          Every component from <code className="text-fd-primary">@polpo-ai/chat</code>. These are the real components — what you see here is what ships.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <div className="flex items-center gap-3 rounded-lg border border-fd-border bg-fd-card px-4 py-2.5">
            <code className="font-mono text-xs text-fd-primary">npx shadcn add @polpo-ai/chat</code>
            <CopyBtn text="npx shadcn add @polpo-ai/chat" />
          </div>
          <Link href="/docs/examples/chat-agent" className="inline-flex items-center gap-2 rounded-lg border border-fd-border px-4 py-2.5 text-xs font-medium text-fd-muted-foreground hover:text-fd-foreground transition-colors">
            Docs
          </Link>
        </div>
      </div>

      <div className="grid items-start gap-12 lg:grid-cols-[180px_1fr]">
        {/* Nav */}
        <nav className="hidden lg:block sticky top-20">
          <ul className="space-y-1 border-l border-fd-border pl-4">
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} className="block text-xs text-fd-muted-foreground hover:text-fd-foreground transition-colors py-1">{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content */}
        <div className="space-y-20">

          {/* ─── Chat ─── */}
          <Section
            id="chat"
            label="Components"
            title="Chat"
            desc="Zero-config compound component. Wraps ChatProvider + ChatMessages + ChatInput. Supports render function children for landing-to-conversation transitions."
            codeOnly
            code={{ filename: "zero-config.tsx", code: `import { Chat } from "@polpo-ai/chat"

// Zero config — messages, streaming, input, tool calls, scroll, skeletons
<Chat sessionId="session_abc" agent="coder" />

// With customization
<Chat
  sessionId="session_abc"
  agent="coder"
  avatar={<BotIcon />}
  agentName="Coder"
  skeletonCount={3}
  inputPlaceholder="Ask me anything..."
  inputHint="Enter to send, Shift+Enter for newline"
  allowAttachments={true}
  onSessionCreated={(id) => router.push(\`/chat/\${id}\`)}
  className="flex-1"
/>` }}
          />

          {/* ─── ChatInput ─── */}
          <Section
            id="chat-input"
            label="Components"
            title="ChatInput"
            desc="Default textarea with submit/stop button, file attachments, and drag & drop. Must be inside a ChatProvider or Chat."
            preview={
              <ChatProvider>
                <ChatInput
                  placeholder="Type a message..."
                  hint="Enter to send, Shift+Enter for newline"
                  allowAttachments={true}
                />
              </ChatProvider>
            }
            code={{ filename: "chat-input.tsx", code: `import { ChatInput } from "@polpo-ai/chat"

<ChatInput
  placeholder="Type a message..."
  hint="Enter to send, Shift+Enter for newline"
  allowAttachments={true}
  renderSubmit={({ isStreaming, onStop }) => (
    <button onClick={isStreaming ? onStop : undefined}>
      {isStreaming ? "Stop" : "Send"}
    </button>
  )}
  className="..."
/>` }}
          />

          {/* ─── ChatInputCompact ─── */}
          <Section
            id="chat-input-compact"
            label="Components"
            title="ChatInputCompact"
            desc="Compact variant of ChatInput — minimal padding, no max-width constraint. Ideal for sidebars and dialogs."
            preview={
              <div className="max-w-sm">
                <ChatProvider>
                  <ChatInputCompact
                    placeholder="Quick message..."
                    hint="Compact mode"
                    allowAttachments={true}
                  />
                </ChatProvider>
              </div>
            }
            code={{ filename: "chat-input-compact.tsx", code: `import { ChatInputCompact } from "@polpo-ai/chat"

// Same props as ChatInput — just a smaller layout
<ChatInputCompact
  placeholder="Quick message..."
  hint="Compact mode"
  allowAttachments={true}
  className="..."
/>` }}
          />

          {/* ─── ChatLanding ─── */}
          <Section
            id="chat-landing"
            label="Components"
            title="ChatLanding"
            desc="Full new-chat landing page with greeting, input, and suggestion prompts. Wraps its own ChatProvider internally."
            preview={
              <div className="relative rounded-lg overflow-hidden" style={{ height: 420 }}>
                <div className="absolute inset-0 overflow-auto">
                  <ChatLanding
                    greeting="How can I help you?"
                    subtitle="Ask anything about your codebase"
                    suggestions={mockSuggestions}
                    suggestionColumns={2}
                    inputPlaceholder="Ask me anything..."
                    inputHint="AI may make mistakes"
                  />
                </div>
              </div>
            }
            code={{ filename: "chat-landing.tsx", code: `import { ChatLanding } from "@polpo-ai/chat"

<ChatLanding
  agent="coder"
  onSessionCreated={(id) => router.push(\`/chat/\${id}\`)}
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
  className="min-h-screen"
/>` }}
          />

          {/* ─── Messages ─── */}
          <Section
            id="messages"
            label="Components"
            title="ChatUserMessage & ChatAssistantMessage"
            desc="User messages as right-aligned bubbles. Assistant messages with avatar, agent name, tool calls, and content parts (text, images, files)."
            preview={
              <>
                <ChatUserMessage msg={userMsg} />
                <ChatUserMessage msg={userMsgWithFile} />
                <ChatAssistantMessage
                  msg={assistantMsg}
                  avatar={
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-fd-primary/10 text-fd-primary">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                      </svg>
                    </div>
                  }
                  agentName="coder"
                />
              </>
            }
            code={{ filename: "chat-message.tsx", code: `import { ChatUserMessage, ChatAssistantMessage } from "@polpo-ai/chat"

<ChatUserMessage msg={{ role: "user", content: "Hello!" }} />

<ChatAssistantMessage
  msg={{ role: "assistant", content: "Hi!", toolCalls: [...] }}
  avatar={<BotIcon />}
  agentName="coder"
/>` }}
          />

          {/* ─── Tool Calls ─── */}
          <Section
            id="tool-calls"
            label="Components"
            title="ToolCallChip"
            desc="Expandable tool call chips with state indicators. Built-in renderers for bash, read, write, edit, search, http, email. Click to expand and see output."
            preview={
              <div className="space-y-2 max-w-md">
                <ToolCallChip tool={toolWrite} />
                <ToolCallChip tool={toolBash} />
                <ToolCallChip tool={toolRead} />
                <ToolCallChip tool={toolPending} />
                <ToolCallChip tool={toolError} />
              </div>
            }
            code={{ filename: "tool-call-chip.tsx", code: `import { ToolCallChip } from "@polpo-ai/chat"

// Auto-dispatched — picks the right renderer by tool name
<ToolCallChip tool={toolCallEvent} />

// States: "calling" (spinner), "completed" (check), "error" (alert)
// Built-in: bash, read, write, edit, grep, glob, search_web, http_fetch, email_send` }}
          />

          {/* ─── Typing ─── */}
          <Section
            id="typing"
            label="Components"
            title="ChatTyping"
            desc="Three animated dots shown while the agent is thinking."
            preview={
              <div className="flex items-center gap-3">
                <span className="text-sm text-fd-muted-foreground">Agent is typing</span>
                <ChatTyping />
              </div>
            }
            code={{ filename: "chat-typing.tsx", code: `import { ChatTyping } from "@polpo-ai/chat"

<ChatTyping className="pt-1" />` }}
          />

          {/* ─── Scroll Button ─── */}
          <Section
            id="scroll-button"
            label="Components"
            title="ChatScrollButton"
            desc="Floating button when the user scrolls up. Optional ping badge for new messages."
            preview={
              <div className="relative h-24 flex items-center justify-center">
                <button
                  onClick={() => setScrollDemo(!scrollDemo)}
                  className="text-xs text-fd-muted-foreground hover:text-fd-foreground transition-colors"
                >
                  {scrollDemo ? "Click button to dismiss" : "Click to simulate scroll-up"}
                </button>
                <ChatScrollButton
                  isAtBottom={!scrollDemo}
                  showNewMessage={scrollDemo}
                  onClick={() => setScrollDemo(false)}
                  className=""
                />
              </div>
            }
            code={{ filename: "chat-scroll-button.tsx", code: `import { ChatScrollButton } from "@polpo-ai/chat"

<ChatScrollButton
  isAtBottom={false}
  showNewMessage={true}
  onClick={() => scrollToBottom()}
/>` }}
          />

          {/* ─── Skeletons ─── */}
          <Section
            id="skeletons"
            label="Components"
            title="ChatSkeleton, MessageSkeleton, UserMessageSkeleton"
            desc="Shimmer loaders matching the exact layout of real messages. Three variants."
            preview={
              <div className="space-y-4">
                <p className="font-mono text-[10px] uppercase tracking-wider text-fd-muted-foreground/50">ChatSkeleton (count=2)</p>
                <ChatSkeleton count={2} />
                <div className="border-t border-fd-border/30 pt-4">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-fd-muted-foreground/50 mb-2">Individual</p>
                  <UserMessageSkeleton />
                  <MessageSkeleton lines={2} />
                </div>
              </div>
            }
            code={{ filename: "chat-skeleton.tsx", code: `import { ChatSkeleton, MessageSkeleton, UserMessageSkeleton } from "@polpo-ai/chat"

<ChatSkeleton count={3} />
<MessageSkeleton lines={3} />
<UserMessageSkeleton />` }}
          />

          {/* ─── ChatSuggestions ─── */}
          <Section
            id="suggestions"
            label="Components"
            title="ChatSuggestions"
            desc="Configurable suggestion button grid. Supports icons, 1-3 column layouts, and custom styling."
            preview={
              <div className="max-w-lg mx-auto space-y-4">
                <p className="font-mono text-[10px] uppercase tracking-wider text-fd-muted-foreground/50">2 columns (default)</p>
                <ChatSuggestions
                  suggestions={mockSuggestions}
                  onSelect={(text: string) => alert(`Selected: ${text}`)}
                  columns={2}
                  className=""
                />
                <p className="font-mono text-[10px] uppercase tracking-wider text-fd-muted-foreground/50 pt-2">3 columns</p>
                <ChatSuggestions
                  suggestions={mockSuggestions.slice(0, 3)}
                  onSelect={(text: string) => alert(`Selected: ${text}`)}
                  columns={3}
                  className=""
                />
              </div>
            }
            code={{ filename: "chat-suggestions.tsx", code: `import { ChatSuggestions } from "@polpo-ai/chat"

<ChatSuggestions
  suggestions={[
    { icon: <Zap size={14} />, text: "Automate a task" },
    { icon: <BarChart3 size={14} />, text: "Generate a report" },
  ]}
  onSelect={(text) => sendMessage(text)}
  columns={2}
  className="mt-4"
/>` }}
          />

          {/* ─── ChatAgentSelector ─── */}
          <Section
            id="agent-selector"
            label="Components"
            title="ChatAgentSelector"
            desc="Dropdown to pick an agent. Works standalone — no context required."
            preview={
              <div className="flex items-center gap-4">
                <ChatAgentSelector
                  agents={mockAgents}
                  selected={selectedAgent}
                  onSelect={setSelectedAgent}
                  fallbackLabel="Select agent"
                />
                <span className="text-xs text-fd-muted-foreground">
                  Selected: <code className="text-fd-primary">{selectedAgent}</code>
                </span>
              </div>
            }
            code={{ filename: "chat-agent-selector.tsx", code: `import { ChatAgentSelector } from "@polpo-ai/chat"

<ChatAgentSelector
  agents={agents}           // From useAgents().agents
  selected={selectedAgent}
  onSelect={setSelectedAgent}
  fallbackLabel="Select agent"
  renderAvatar={(agent, size) => <AgentAvatar agent={agent} size={size} />}
  className="..."
/>` }}
          />

          {/* ─── ChatSessionList ─── */}
          <Section
            id="session-list"
            label="Components"
            title="ChatSessionList"
            desc="Flat list of chat sessions with select, delete, loading skeleton, and empty state. Shows agent name and relative time."
            preview={
              <div className="space-y-6">
                <div className="max-w-sm">
                  <ChatSessionList
                    sessions={mockSessions as any}
                    agents={mockAgents as any}
                    activeSessionId="s1"
                    onSelect={(id: string) => alert(`Selected session: ${id}`)}
                    onDelete={(id: string) => alert(`Delete session: ${id}`)}
                    isLoading={false}
                    className=""
                    renderAvatar={undefined}
                  />
                </div>
                <div className="max-w-sm">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-fd-muted-foreground/50 mb-3">Loading state</p>
                  <ChatSessionList
                    sessions={[] as any}
                    agents={[] as any}
                    activeSessionId={null as any}
                    onSelect={() => {}}
                    onDelete={() => {}}
                    isLoading={true}
                    className=""
                    renderAvatar={undefined}
                  />
                </div>
                <div className="max-w-sm">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-fd-muted-foreground/50 mb-3">Empty state</p>
                  <ChatSessionList
                    sessions={[] as any}
                    agents={[] as any}
                    activeSessionId={null as any}
                    onSelect={() => {}}
                    onDelete={() => {}}
                    isLoading={false}
                    emptyMessage="No conversations yet"
                    className=""
                    renderAvatar={undefined}
                  />
                </div>
              </div>
            }
            code={{ filename: "chat-session-list.tsx", code: `import { ChatSessionList } from "@polpo-ai/chat"

<ChatSessionList
  sessions={sessions}          // From useSessions().sessions
  agents={agents}              // From useAgents().agents
  activeSessionId={currentId}
  onSelect={(id) => router.push(\`/chat/\${id}\`)}
  onDelete={deleteSession}     // Omit to hide delete buttons
  isLoading={isLoading}
  emptyMessage="No conversations yet"
  renderAvatar={(agent, name) => <AgentAvatar agent={agent} />}
  className="..."
/>` }}
          />

          {/* ─── ChatSessionsByAgent ─── */}
          <Section
            id="sessions-by-agent"
            label="Components"
            title="ChatSessionsByAgent"
            desc="Sessions grouped by agent, sorted by last activity, with session count badges. Great for multi-agent apps."
            preview={
              <div className="max-w-sm">
                <ChatSessionsByAgent
                  sessions={mockSessions}
                  agents={mockAgents}
                  onSelect={(agentName) => alert(`Selected agent: ${agentName}`)}
                />
              </div>
            }
            code={{ filename: "chat-sessions-by-agent.tsx", code: `import { ChatSessionsByAgent } from "@polpo-ai/chat"

<ChatSessionsByAgent
  sessions={sessions}           // From useSessions().sessions
  agents={agents}               // From useAgents().agents
  onSelect={(agentName) => router.push(\`/chat/agent/\${agentName}\`)}
  isLoading={isLoading}
  emptyMessage="No conversations yet"
  renderAvatar={(agent, name) => <AgentAvatar agent={agent} />}
  className="..."
/>` }}
          />

          {/* ─── ChatAskUser ─── */}
          <Section
            id="ask-user"
            label="Components"
            title="ChatAskUser"
            desc="Interactive tool-call UI. Renders questions with selectable options, multi-select, custom text input, and a wizard mode for multiple questions."
            preview={
              <div className="max-w-md">
                <ChatAskUser
                  questions={mockQuestions}
                  onSubmit={(answers) => {
                    alert(`Answers: ${JSON.stringify(answers)}`);
                    setAskDisabled(true);
                  }}
                  disabled={askDisabled}
                />
                {askDisabled && (
                  <button
                    onClick={() => setAskDisabled(false)}
                    className="mt-3 text-xs text-fd-muted-foreground hover:text-fd-foreground transition-colors"
                  >
                    Reset demo
                  </button>
                )}
              </div>
            }
            code={{ filename: "chat-ask-user.tsx", code: `import { ChatAskUser, useChatContext, ChatInput } from "@polpo-ai/chat"

function ChatInputWithAskUser() {
  const { pendingToolCall, sendMessage } = useChatContext()

  if (pendingToolCall?.toolName === "ask_user_question") {
    return (
      <ChatAskUser
        questions={pendingToolCall.arguments.questions}
        onSubmit={(answers) => sendMessage(JSON.stringify({ answers }))}
      />
    )
  }

  return <ChatInput placeholder="Ask anything..." />
}` }}
          />

          {/* ─── ChatProvider (code-only) ─── */}
          <Section
            id="chat-provider"
            label="Context"
            title="ChatProvider"
            desc="Context wrapper around useChat + useFiles from the SDK. All chat components must be inside this provider (or inside Chat, which wraps it)."
            codeOnly
            code={{ filename: "chat-provider.tsx", code: `import { ChatProvider, useChatContext } from "@polpo-ai/chat"

// Wrap your custom chat UI
<ChatProvider
  sessionId="session_abc"
  agent="coder"
  onSessionCreated={(id) => router.push(\`/chat/\${id}\`)}
  onUpdate={() => scrollToBottom()}
>
  <MyMessages />
  <MyInput />
</ChatProvider>

// Access state from any child
function MyInput() {
  const {
    messages,        // ChatMessage[]
    isStreaming,     // boolean
    status,          // "idle" | "streaming" | "loading" | "error"
    sendMessage,     // (content: string | ContentPart[]) => Promise<void>
    abort,           // () => void
    uploadFile,      // (dest, file, name) => Promise<...>
    isUploading,     // boolean
    pendingToolCall, // ToolCallEvent | null
    sendToolResult,  // (toolCallId, result) => void
  } = useChatContext()
  // ...
}` }}
          />

          {/* ─── ChatMessages (code-only) ─── */}
          <Section
            id="chat-messages"
            label="Components"
            title="ChatMessages"
            desc="Virtuoso-powered scrollable message list with auto-scroll, scroll-to-bottom button, and skeleton loading. Must be inside a ChatProvider."
            codeOnly
            code={{ filename: "chat-messages.tsx", code: `import { ChatMessages, type ChatMessagesHandle } from "@polpo-ai/chat"

const ref = useRef<ChatMessagesHandle>(null)

<ChatMessages
  renderItem={(msg, index, isLast, isStreaming) => (
    <ChatMessage
      msg={msg}
      isLast={isLast}
      isStreaming={isStreaming}
      avatar={<BotIcon />}
      agentName="Coder"
    />
  )}
  skeletonCount={3}
  className="flex-1"
  ref={ref}
/>

// Scroll programmatically
ref.current?.scrollToBottom("smooth")` }}
          />

          {/* ─── ToolCallShell (code-only) ─── */}
          <Section
            id="tool-call-shell"
            label="Components"
            title="ToolCallShell"
            desc="Base shell for building custom tool renderers. Handles expand/collapse, state indicators, icon, label, and summary display."
            codeOnly
            code={{ filename: "custom-tool.tsx", code: `import { ToolCallShell } from "@polpo-ai/chat"
import { Database } from "lucide-react"

function ToolDatabaseQuery({ tool }) {
  const query = tool.arguments?.query
  return (
    <ToolCallShell
      tool={tool}
      icon={Database}
      label="Query"
      summary={query}
    >
      <pre>{tool.result}</pre>
    </ToolCallShell>
  )
}

// Props:
//   tool: ToolCallEvent        — the tool call event from the SDK
//   icon: LucideIcon           — icon component
//   label: string              — display label (e.g. "Query", "Deploy")
//   summary?: string | null    — one-line summary next to the label
//   children?: ReactNode       — custom expanded content (replaces raw result)` }}
          />

          {/* ─── streamdownComponents (code-only) ─── */}
          <Section
            id="streamdown"
            label="Config"
            title="streamdownComponents & createStreamdownComponents"
            desc="Markdown renderer configuration for fenced code blocks. Use the default instance or create a custom one with syntax highlighting."
            codeOnly
            code={{ filename: "tool-call-shell.tsx", code: `import {
  streamdownComponents,
  createStreamdownComponents,
} from "@polpo-ai/chat"

// Default — plain <pre><code> fallback
<Chat streamdownComponents={streamdownComponents} />

// Custom — with your own code block component
import { CodeBlock } from "@/components/code-block"

const myComponents = createStreamdownComponents(CodeBlock)

<Chat streamdownComponents={myComponents} />

// The CodeBlock component receives:
//   code: string     — the raw code content
//   language: string — the fenced language (e.g. "tsx", "bash")` }}
          />

          {/* ─── Utilities ─── */}
          <Section
            id="utilities"
            label="Utilities"
            title="relativeTime & getTextContent"
            desc="Helper functions for formatting timestamps and extracting text from messages."
            preview={
              <div className="space-y-3 text-sm">
                <p className="font-mono text-[10px] uppercase tracking-wider text-fd-muted-foreground/50">relativeTime examples</p>
                <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
                  <code className="text-fd-muted-foreground">5s ago</code>
                  <span className="text-fd-foreground">{relativeTime(new Date("2026-01-01T10:00:00Z").toISOString())}</span>
                  <code className="text-fd-muted-foreground">3m ago</code>
                  <span className="text-fd-foreground">{relativeTime(new Date("2026-01-01T09:57:00Z").toISOString())}</span>
                  <code className="text-fd-muted-foreground">2h ago</code>
                  <span className="text-fd-foreground">{relativeTime(new Date("2026-01-01T08:00:00Z").toISOString())}</span>
                  <code className="text-fd-muted-foreground">2d ago</code>
                  <span className="text-fd-foreground">{relativeTime(new Date("2025-12-30T10:00:00Z").toISOString())}</span>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-fd-muted-foreground/50 pt-2">getTextContent examples</p>
                <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
                  <code className="text-fd-muted-foreground">string</code>
                  <span className="text-fd-foreground">{getTextContent("Hello world")}</span>
                  <code className="text-fd-muted-foreground">ContentPart[]</code>
                  <span className="text-fd-foreground">{getTextContent([{ type: "text", text: "Part 1. " }, { type: "text", text: "Part 2." }])}</span>
                </div>
              </div>
            }
            code={{ filename: "utilities.tsx", code: `import { relativeTime, getTextContent } from "@polpo-ai/chat"

// relativeTime — format ISO timestamps
relativeTime(new Date().toISOString())        // "Just now"
relativeTime("2025-01-01T12:00:00Z")          // "Jan 1, 12:00 PM"

// getTextContent — extract text from string | ContentPart[]
getTextContent("Hello")                        // "Hello"
getTextContent([
  { type: "text", text: "Part 1. " },
  { type: "text", text: "Part 2." },
])                                             // "Part 1. Part 2."` }}
          />

          {/* ─── Hooks ─── */}
          <Section
            id="hooks"
            label="Hooks"
            title="useSubmitHandler & useDocumentDrag"
            desc="Hooks for custom inputs. useSubmitHandler handles text + file uploads, useDocumentDrag tracks drag state for drop zone overlays."
            codeOnly
            code={{ filename: "custom-input.tsx", code: `import { useSubmitHandler, useDocumentDrag, useChatContext } from "@polpo-ai/chat"

function CustomInput() {
  const { sendMessage, uploadFile } = useChatContext()
  const handleSubmit = useSubmitHandler(sendMessage, uploadFile)
  const isDragging = useDocumentDrag()

  return (
    <div className={isDragging ? "ring-2 ring-blue-500" : ""}>
      <form onSubmit={(e) => {
        e.preventDefault()
        handleSubmit({ text: inputValue, files: [] })
      }}>
        <input placeholder="Message..." />
      </form>
    </div>
  )
}` }}
          />

        </div>
      </div>
    </div>
    </PolpoProvider>
  );
}
