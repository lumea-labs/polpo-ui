"use client";

import { useState } from "react";
import {
  ChatSessionList,
  ChatSuggestions,
  ChatAgentSelector,
  ChatUserMessage,
  ChatAssistantMessage,
  type ChatMessageItemData,
  type ChatSuggestion,
} from "@polpo-ai/chat";
import {
  Plus,
  PanelLeftClose,
  PanelLeft,
  Sun,
  Moon,
  Sparkles,
  Workflow,
  CalendarCheck,
  FileBarChart,
  ArrowUp,
} from "lucide-react";

/* ── CSS vars (inline on root) ───────────────────────── */

const lightVars: Record<string, string> = {
  "--c-bg": "#FAFAF7",
  "--c-bg-subtle": "#F2F0EB",
  "--c-border": "#E5E1DA",
  "--c-border-2": "#D1CEC6",
  "--c-ink-3": "#999999",
  "--c-ink-2": "#555555",
  "--c-ink": "#111111",
  "--c-surface": "#FFFFFF",
  "--c-accent-soft": "#FEF0EC",
  "--c-accent": "#E85D3A",
  "--c-ink-2-5": "#777777",
  "--c-accent-light": "#EC7A5C",
  "--c-accent-dark": "#D14E2D",
  "--c-accent-darker": "#B8421F",
  "--c-green": "#2D9B5E",
  "--c-green-dark": "#1E7A47",
  "--c-red-soft": "#FEF2F2",
  "--c-red-light": "#FCA5A5",
  "--c-red": "#E53E3E",
  "--sidebar-bg": "#F2F0EB",
  "--sidebar-border": "#E5E1DA",
  "--accent": "#E85D3A",
  "--accent-soft": "#FEF0EC",
  "--ink": "#111111",
  "--ink-2": "#555555",
  "--ink-3": "#999999",
  "--border": "#E5E1DA",
  "--bg": "#FAFAF7",
  "--surface": "#FFFFFF",
};

const darkVars: Record<string, string> = {
  "--c-bg": "#0F0F0F",
  "--c-bg-subtle": "#171717",
  "--c-border": "#2A2A2A",
  "--c-border-2": "#333333",
  "--c-ink-3": "#666666",
  "--c-ink-2": "#A3A3A3",
  "--c-ink": "#EEEEEE",
  "--c-surface": "#1C1C1C",
  "--c-accent-soft": "#2A1510",
  "--c-accent": "#F07052",
  "--c-ink-2-5": "#888888",
  "--c-accent-light": "#F08A70",
  "--c-accent-dark": "#E85D3A",
  "--c-accent-darker": "#D14E2D",
  "--c-green": "#4ADE80",
  "--c-green-dark": "#22C55E",
  "--c-red-soft": "#2A1010",
  "--c-red-light": "#F87171",
  "--c-red": "#EF4444",
  "--sidebar-bg": "#171717",
  "--sidebar-border": "#2A2A2A",
  "--accent": "#F07052",
  "--accent-soft": "#2A1510",
  "--ink": "#EEEEEE",
  "--ink-2": "#A3A3A3",
  "--ink-3": "#666666",
  "--border": "#2A2A2A",
  "--bg": "#0F0F0F",
  "--surface": "#1C1C1C",
};

/* ── Mock data ───────────────────────────────────────── */

const mockSessions = [
  { id: "s1", title: "Add users table to Prisma schema", agent: "coder", createdAt: "2026-04-03T10:00:00Z", updatedAt: "2026-04-03T14:30:00Z", messageCount: 12 },
  { id: "s2", title: "Debug authentication middleware", agent: "coder", createdAt: "2026-04-02T09:00:00Z", updatedAt: "2026-04-02T16:00:00Z", messageCount: 8 },
  { id: "s3", title: "Write API documentation", agent: "writer", createdAt: "2026-04-01T11:00:00Z", updatedAt: "2026-04-01T18:00:00Z", messageCount: 15 },
  { id: "s4", title: "Review pull request #42", agent: "reviewer", createdAt: "2026-03-31T08:00:00Z", updatedAt: "2026-03-31T12:00:00Z", messageCount: 6 },
];

const mockAgents = [
  { name: "coder", role: "Full-stack developer", identity: { displayName: "Marco Rossi" } },
  { name: "writer", role: "Technical writer", identity: { displayName: "Writer" } },
  { name: "reviewer", role: "Code reviewer", identity: { displayName: "Reviewer" } },
];

const suggestions: ChatSuggestion[] = [
  { icon: <Sparkles size={14} />, text: "Automate a repetitive task" },
  { icon: <Workflow size={14} />, text: "Build an agent workflow" },
  { icon: <CalendarCheck size={14} />, text: "Plan this week's sprint" },
  { icon: <FileBarChart size={14} />, text: "Generate a performance report" },
];

const mockConversations: Record<string, ChatMessageItemData[]> = {
  s1: [
    { id: "m1", role: "user", content: "Add a users table to the Prisma schema with email, name, and role fields." },
    { id: "m2", role: "assistant", content: "I'll add the `User` model to your Prisma schema with those fields. Here's what I'm setting up:\n\n```prisma\nmodel User {\n  id    String @id @default(cuid())\n  email String @unique\n  name  String\n  role  Role   @default(USER)\n}\n```\n\nI've also added the `Role` enum with `USER` and `ADMIN` values.", toolCalls: [{ id: "tc1", name: "edit_file", state: "completed", arguments: { path: "prisma/schema.prisma" } }] },
    { id: "m3", role: "user", content: "Can you also add a createdAt and updatedAt field?" },
    { id: "m4", role: "assistant", content: "Done! I've added `createdAt` with `@default(now())` and `updatedAt` with `@updatedAt`. The schema is ready for `npx prisma migrate dev`.", toolCalls: [{ id: "tc2", name: "edit_file", state: "completed", arguments: { path: "prisma/schema.prisma" } }] },
  ],
  s2: [
    { id: "m5", role: "user", content: "The auth middleware is returning 401 even for valid tokens. Can you help debug?" },
    { id: "m6", role: "assistant", content: "Let me look at the middleware. The issue is that the token verification is using `HS256` but your JWT secret is configured for `RS256`. I'll fix the algorithm mismatch.", toolCalls: [{ id: "tc3", name: "read_file", state: "completed", arguments: { path: "src/middleware/auth.ts" } }, { id: "tc4", name: "edit_file", state: "completed", arguments: { path: "src/middleware/auth.ts" } }] },
  ],
  s3: [
    { id: "m7", role: "user", content: "Write documentation for the /api/users endpoints." },
    { id: "m8", role: "assistant", content: "Here's the API documentation for the users endpoints:\n\n## `GET /api/users`\n\nReturns a paginated list of users.\n\n**Query Parameters:**\n- `page` (number, default: 1)\n- `limit` (number, default: 20)\n\n## `POST /api/users`\n\nCreates a new user.\n\n**Body:** `{ email, name, role? }`\n\n## `GET /api/users/:id`\n\nReturns a single user by ID." },
  ],
  s4: [
    { id: "m9", role: "user", content: "Review the changes in PR #42." },
    { id: "m10", role: "assistant", content: "I've reviewed PR #42. Overall it looks solid. A few notes:\n\n1. **Line 42**: The error handler swallows the original error message. Consider logging it.\n2. **Line 78**: This query could be optimized with an index on `created_at`.\n3. **Line 105**: Good use of the builder pattern here.\n\nApproved with minor suggestions.", toolCalls: [{ id: "tc5", name: "read_file", state: "completed", arguments: { path: "src/api/orders.ts" } }] },
  ],
};

/* ── Mock input ──────────────────────────────────────── */

function MockChatInput({ onSend, placeholder = "Type a message...", large }: { onSend?: (text: string) => void; placeholder?: string; large?: boolean }) {
  const [text, setText] = useState("");
  const handleSend = () => { const t = text.trim(); if (!t || !onSend) return; onSend(t); setText(""); };

  return (
    <div className="shrink-0">
      <div className="w-full px-6 py-3">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-gray-200 shadow-sm focus-within:border-blue-400 focus-within:shadow-md transition-all bg-gray-50">
            <textarea
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={placeholder}
              className={large
                ? "w-full resize-none bg-transparent px-6 pt-5 pb-3 text-base outline-none placeholder:text-gray-400"
                : "w-full resize-none bg-transparent px-5 pt-4 pb-2 text-sm outline-none placeholder:text-gray-400"
              }
            />
            <div className="flex items-center justify-between px-3 pb-3">
              <button type="button" className="flex items-center justify-center size-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors" aria-label="Attach file">
                <Plus className="size-4" />
              </button>
              <button type="button" onClick={handleSend} className="flex items-center justify-center size-8 rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors" aria-label="Send">
                <ArrowUp className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Landing view ────────────────────────────────────── */

function LandingView({
  selectedAgent,
  onAgentChange,
  onSend,
}: {
  selectedAgent: string | undefined;
  onAgentChange: (name: string) => void;
  onSend: (text: string) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="max-w-3xl w-full text-center stagger-children">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] text-xs font-medium mb-6">
          <Sparkles className="size-3" />
          Built with @polpo-ai/chat
        </div>

        <h1 className="text-5xl font-bold tracking-tight mb-3 whitespace-nowrap">
          What can I help with<span className="text-[var(--accent)]">?</span>
        </h1>

        <p className="text-[var(--ink-3)] text-base mb-8 max-w-md mx-auto leading-relaxed">
          Your AI team is ready.
        </p>

        <div className="flex justify-center mb-5">
          <ChatAgentSelector
            agents={mockAgents as any}
            selected={selectedAgent}
            onSelect={onAgentChange}
            fallbackLabel="Auto (Orchestrator)"
          />
        </div>

        <MockChatInput onSend={onSend} placeholder="Describe what you need..." large />

        <ChatSuggestions
          suggestions={suggestions}
          onSelect={(text) => onSend(text)}
          columns={2}
          className="mt-5 max-w-md mx-auto [&_button]:px-3 [&_button]:py-2 [&_button]:text-[11px] [&_button]:rounded-lg [&_button]:gap-1.5"
        />
      </div>
    </div>
  );
}

/* ── Conversation view ───────────────────────────────── */

function ConversationView({ messages, agentName, onSend }: { messages: ChatMessageItemData[]; agentName: string; onSend: (text: string) => void }) {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto">
        {messages.map((msg, i) =>
          msg.role === "user" ? (
            <ChatUserMessage key={msg.id} msg={msg} />
          ) : (
            <ChatAssistantMessage key={msg.id} msg={msg} agentName={agentName} />
          ),
        )}
      </div>
      <MockChatInput onSend={onSend} />
    </div>
  );
}

/* ── Main ────────────────────────────────────────────── */

export default function ExamplesChat() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [collapsed, setCollapsed] = useState(true);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<string | undefined>();
  const [liveMessages, setLiveMessages] = useState<Record<string, ChatMessageItemData[]>>({ ...mockConversations });
  const [adHocMessages, setAdHocMessages] = useState<ChatMessageItemData[] | null>(null);

  const isDark = theme === "dark";
  const vars = isDark ? darkVars : lightVars;
  const activeSession = mockSessions.find((s) => s.id === activeSessionId);
  const activeMessages = adHocMessages
    ? adHocMessages
    : activeSessionId
      ? liveMessages[activeSessionId] || []
      : [];
  const activeAgent = activeSession
    ? mockAgents.find((a) => a.name === activeSession.agent)
    : undefined;

  const handleSend = (text: string) => {
    const userMsg: ChatMessageItemData = { id: "u-" + Date.now(), role: "user", content: text, ts: new Date().toISOString() };
    const makeMockReply = (): ChatMessageItemData => ({
      id: "a-" + Date.now(),
      role: "assistant",
      content: "Done! I've updated the file and ran the tests. Everything passes.",
      ts: new Date().toISOString(),
      toolCalls: [
        { id: "t-" + Date.now(), name: "write", state: "completed", arguments: { path: "src/index.ts" } } as any,
        { id: "t2-" + Date.now(), name: "bash", state: "completed", arguments: { command: "npm test" }, result: "All tests passed" } as any,
      ],
    });

    if (adHocMessages) {
      const next = [...adHocMessages, userMsg];
      setAdHocMessages(next);
      setTimeout(() => {
        setAdHocMessages((prev) => prev ? [...prev, makeMockReply()] : prev);
      }, 800);
    } else if (activeSessionId) {
      const prev = liveMessages[activeSessionId] || [];
      setLiveMessages({ ...liveMessages, [activeSessionId]: [...prev, userMsg] });
      setTimeout(() => {
        setLiveMessages((cur) => ({ ...cur, [activeSessionId]: [...(cur[activeSessionId] || []), makeMockReply()] }));
      }, 800);
    }
  };

  const handleLandingSend = (text: string) => {
    const userMsg: ChatMessageItemData = { id: "u-" + Date.now(), role: "user", content: text, ts: new Date().toISOString() };
    const initial = [userMsg];
    setAdHocMessages(initial);
    setActiveSessionId("__adhoc__");
    setTimeout(() => {
      const mockReply: ChatMessageItemData = {
        id: "a-" + Date.now(),
        role: "assistant",
        content: "Done! I've updated the file and ran the tests. Everything passes.",
        ts: new Date().toISOString(),
        toolCalls: [
          { id: "t-" + Date.now(), name: "write", state: "completed", arguments: { path: "src/index.ts" } } as any,
          { id: "t2-" + Date.now(), name: "bash", state: "completed", arguments: { command: "npm test" }, result: "All tests passed" } as any,
        ],
      };
      setAdHocMessages((prev) => prev ? [...prev, mockReply] : prev);
    }, 800);
  };

  return (
    <>
    <style>{`
      @keyframes fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      .animate-fade-in { animation: fade-in 0.4s ease-out both; }
      .stagger-children > * { animation: fade-in 0.35s ease-out both; }
      .stagger-children > *:nth-child(1) { animation-delay: 0ms; }
      .stagger-children > *:nth-child(2) { animation-delay: 60ms; }
      .stagger-children > *:nth-child(3) { animation-delay: 120ms; }
      .stagger-children > *:nth-child(4) { animation-delay: 180ms; }
      .stagger-children > *:nth-child(5) { animation-delay: 240ms; }
    `}</style>
    <div style={vars as React.CSSProperties} className="font-sans">
      <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg)", color: "var(--ink)" }}>
        {/* Sidebar */}
        <aside
          className={`shrink-0 bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] flex flex-col transition-all duration-300 ease-in-out ${
            collapsed ? "w-0 border-r-0 overflow-hidden" : "w-64"
          }`}
        >
          <div className="flex items-center justify-between px-4 h-14 border-b border-[var(--sidebar-border)]">
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-3)]">
              Chats
            </span>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="flex items-center justify-center size-7 rounded-lg text-[var(--ink-3)] hover:text-[var(--ink)] hover:bg-[var(--border)]/50 transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
              </button>
              <button
                onClick={() => { setAdHocMessages(null); setActiveSessionId(null); }}
                className="flex items-center justify-center size-7 rounded-lg text-[var(--ink-3)] hover:text-[var(--ink)] hover:bg-[var(--border)]/50 transition-colors"
                aria-label="New chat"
              >
                <Plus className="size-4" />
              </button>
              <button
                onClick={() => setCollapsed(true)}
                className="flex items-center justify-center size-7 rounded-lg text-[var(--ink-3)] hover:text-[var(--ink)] hover:bg-[var(--border)]/50 transition-colors"
                aria-label="Close sidebar"
              >
                <PanelLeftClose className="size-3.5" />
              </button>
            </div>
          </div>

          <div className="px-4 pt-4 pb-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--ink-3)]">
              Recent
            </span>
          </div>

          <div className="flex-1 overflow-y-auto px-2 pb-2">
            <ChatSessionList
              sessions={mockSessions as any}
              agents={mockAgents as any}
              activeSessionId={activeSessionId}
              onSelect={(id) => { setAdHocMessages(null); setActiveSessionId(id); }}
              onDelete={() => {}}
              emptyMessage="No chats yet"
            />
          </div>
        </aside>

        {/* Main area */}
        <main className="flex-1 min-w-0 relative bg-[var(--bg)]">
          {collapsed && (
            <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 animate-fade-in">
              <button
                onClick={() => setCollapsed(false)}
                className="flex items-center justify-center size-9 rounded-lg border border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-sm text-[var(--ink-3)] hover:text-[var(--ink)] hover:border-[var(--ink-3)] transition-all shadow-sm"
                aria-label="Open sidebar"
              >
                <PanelLeft className="size-4" />
              </button>
              <button
                onClick={() => { setAdHocMessages(null); setActiveSessionId(null); }}
                className="flex items-center justify-center size-9 rounded-lg border border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-sm text-[var(--ink-3)] hover:text-[var(--ink)] hover:border-[var(--ink-3)] transition-all shadow-sm"
                aria-label="New chat"
              >
                <Plus className="size-4" />
              </button>
            </div>
          )}

          {activeSessionId && activeMessages.length > 0 ? (
            <ConversationView
              messages={activeMessages}
              agentName={activeAgent?.identity?.displayName || activeAgent?.name || "Assistant"}
              onSend={handleSend}
            />
          ) : (
            <LandingView
              selectedAgent={selectedAgent}
              onAgentChange={setSelectedAgent}
              onSend={handleLandingSend}
            />
          )}
        </main>
      </div>
    </div>
    </>
  );
}
