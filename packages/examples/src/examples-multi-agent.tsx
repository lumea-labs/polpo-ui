"use client";

import { useState, useMemo, useCallback } from "react";
import {
  ChatInput,
  ChatMessages,
  ChatAgentSelector,
  useChatContext,
  type ChatMessageItemData,
} from "@polpo-ai/chat";
import { MockChatProvider } from "./mock-provider";
import {
  Plus,
  PanelLeft,
  ChevronDown,
  Home,
  Settings,
  Trash2,
  Sun,
  Moon,
  GitBranch,
  MoreHorizontal,
} from "lucide-react";

/* ── CSS vars (inline) ───────────────────────────────── */

const darkVars: Record<string, string> = {
  "--c-bg": "#1B1B1F", "--c-bg-subtle": "#141417", "--c-border": "#2A2A2F",
  "--c-ink-3": "#5A5A65", "--c-ink-2": "#B0B0BA", "--c-ink": "#E8E8ED",
  "--c-surface": "#222226", "--c-accent": "#4A90E2", "--c-green": "#4ADE80", "--c-red": "#EF4444",
  "--c-border-2": "#35353A", "--c-ink-2-5": "#8A8A95",
  "--c-accent-soft": "#1A2535", "--c-accent-light": "#6BA3E8",
  "--c-accent-dark": "#3A7BD0", "--c-accent-darker": "#2D6BBF",
  "--c-green-dark": "#22C55E", "--c-red-soft": "#2A1515", "--c-red-light": "#F87171",
  "--sidebar-bg": "#141417", "--sidebar-border": "#2A2A2F",
  "--ink": "#E8E8ED", "--ink-2": "#B0B0BA", "--ink-3": "#5A5A65",
  "--border": "#2A2A2F", "--bg": "#1B1B1F", "--surface": "#222226", "--accent": "#4A90E2",
};

const lightVars: Record<string, string> = {
  "--c-bg": "#FAFAFA", "--c-bg-subtle": "#F0F0F2", "--c-border": "#E0E0E5",
  "--c-ink-3": "#9090A0", "--c-ink-2": "#505060", "--c-ink": "#1A1A2E",
  "--c-surface": "#FFFFFF", "--c-accent": "#3B7DD8", "--c-green": "#16A34A", "--c-red": "#EF4444",
  "--c-border-2": "#D0D0D5", "--c-ink-2-5": "#707080",
  "--c-accent-soft": "#EBF2FF", "--c-accent-light": "#5B93E0",
  "--c-accent-dark": "#2D6CC5", "--c-accent-darker": "#2060B5",
  "--c-green-dark": "#15803D", "--c-red-soft": "#FEF2F2", "--c-red-light": "#FCA5A5",
  "--sidebar-bg": "#F0F0F2", "--sidebar-border": "#E0E0E5",
  "--ink": "#1A1A2E", "--ink-2": "#505060", "--ink-3": "#9090A0",
  "--border": "#E0E0E5", "--bg": "#FAFAFA", "--surface": "#FFFFFF", "--accent": "#3B7DD8",
};

/* ── Mock data ───────────────────────────────────────── */

type SidebarVariant = "default" | "coding";
interface MockSession { id: string; title: string; agent: string; updatedAt: string; }

const mockSessions: MockSession[] = [
  { id: "s1", title: "Add users table to Prisma schema", agent: "coder", updatedAt: "2026-04-03T14:30:00Z" },
  { id: "s2", title: "Debug authentication middleware", agent: "coder", updatedAt: "2026-04-02T16:00:00Z" },
  { id: "s3", title: "Write API documentation", agent: "writer", updatedAt: "2026-04-01T18:00:00Z" },
  { id: "s4", title: "Review pull request #42", agent: "reviewer", updatedAt: "2026-03-31T12:00:00Z" },
];

const mockAgents = [
  { name: "coder", role: "Full-stack developer", identity: { displayName: "Marco Rossi" } },
  { name: "writer", role: "Technical writer", identity: { displayName: "Writer" } },
  { name: "reviewer", role: "Code reviewer", identity: { displayName: "Reviewer" } },
];

const mockConversations: Record<string, ChatMessageItemData[]> = {
  s1: [
    { id: "m1", role: "user", content: "Add a users table to the Prisma schema with email, name, and role fields." },
    { id: "m2", role: "assistant", content: "I'll add the `User` model to your Prisma schema.\n\n```prisma\nmodel User {\n  id    String @id @default(cuid())\n  email String @unique\n  name  String\n  role  Role   @default(USER)\n}\n```", toolCalls: [{ id: "tc1", name: "edit_file", state: "completed", arguments: { path: "prisma/schema.prisma" } }] },
  ],
  s2: [
    { id: "m3", role: "user", content: "The auth middleware returns 401 for valid tokens. Help?" },
    { id: "m4", role: "assistant", content: "Found the issue -- algorithm mismatch between `HS256` and `RS256`. Fixed.", toolCalls: [{ id: "tc2", name: "read_file", state: "completed", arguments: { path: "src/middleware/auth.ts" } }, { id: "tc3", name: "edit_file", state: "completed", arguments: { path: "src/middleware/auth.ts" } }] },
  ],
  s3: [
    { id: "m5", role: "user", content: "Write documentation for the /api/users endpoints." },
    { id: "m6", role: "assistant", content: "## `GET /api/users`\n\nReturns a paginated list of users.\n\n**Query Parameters:**\n- `page` (number, default: 1)\n- `limit` (number, default: 20)\n\n## `POST /api/users`\n\nCreates a new user. Body: `{ email, name, role? }`" },
  ],
  s4: [
    { id: "m7", role: "user", content: "Review the changes in PR #42." },
    { id: "m8", role: "assistant", content: "Reviewed PR #42. Approved with minor suggestions:\n\n1. **Line 42**: Error handler swallows the original message\n2. **Line 78**: Consider adding an index on `created_at`\n3. **Line 105**: Good use of builder pattern", toolCalls: [{ id: "tc4", name: "read_file", state: "completed", arguments: { path: "src/api/orders.ts" } }] },
  ],
};

/* ── Fake git stats for coding variant ───────────────── */

function fakeStats(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  const a = Math.abs(h);
  return {
    added: (a % 800) + 10, removed: ((a >> 8) % 500) + 5,
    branch: ["main", "feat/auth", "fix/layout", "refactor/api", "dev", "staging"][a % 6],
    status: ["Ready to merge", "In progress", "Draft", "Review"][(a >> 4) % 4],
  };
}

/* ── Session items ───────────────────────────────────── */

type SessionItemProps = { session: MockSession; isActive: boolean; onSelect: (id: string) => void; onDelete: (id: string) => void };

function DefaultSessionItem({ session, isActive, onSelect, onDelete }: SessionItemProps) {
  return (
    <div role="button" tabIndex={0} onClick={() => onSelect(session.id)} onKeyDown={(e) => { if (e.key === "Enter") onSelect(session.id); }}
      className={`group flex items-center gap-2 w-full pl-4 pr-2 py-1.5 text-[12px] cursor-pointer transition-colors ${isActive ? "session-item-active" : "session-item"}`}>
      <span className="truncate flex-1">{session.title}</span>
      <button onClick={(e) => { e.stopPropagation(); onDelete(session.id); }} className="opacity-0 group-hover:opacity-100 p-0.5 rounded delete-btn transition-all">
        <Trash2 className="size-3" />
      </button>
    </div>
  );
}

function CodingSessionItem({ session, isActive, onSelect, onDelete }: SessionItemProps) {
  const stats = fakeStats(session.id);
  return (
    <div role="button" tabIndex={0} onClick={() => onSelect(session.id)} onKeyDown={(e) => { if (e.key === "Enter") onSelect(session.id); }}
      className={`group flex flex-col w-full pl-4 pr-2 py-3 cursor-pointer transition-colors ${isActive ? "session-item-active" : "session-item"}`}>
      <div className="flex items-center gap-2">
        <span className="truncate flex-1 text-[13px] font-medium">{session.title}</span>
        <span className="shrink-0 text-[11px] font-mono"><span style={{ color: "var(--c-green)" }}>+{stats.added}</span> <span style={{ color: "var(--c-red)" }}>-{stats.removed}</span></span>
        <button onClick={(e) => { e.stopPropagation(); onDelete(session.id); }} className="opacity-0 group-hover:opacity-100 p-0.5 rounded delete-btn transition-all"><MoreHorizontal className="size-3" /></button>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <div className="flex items-center gap-1 text-[10px]" style={{ color: "var(--ink-2)" }}><GitBranch className="size-2.5" />{stats.branch}</div>
        <span className="text-[10px]" style={{ color: "var(--ink-3)" }}>·</span>
        <span className="text-[10px]" style={{ color: "var(--ink-3)" }}>{stats.status}</span>
      </div>
    </div>
  );
}

/* ── Agent group ─────────────────────────────────────── */

function AgentGroup({ agentName, displayName, sessions, activeSessionId, onSelect, onDelete, onNewChat, variant }: {
  agentName: string; displayName: string; sessions: MockSession[]; activeSessionId: string | null;
  onSelect: (id: string) => void; onDelete: (id: string) => void; onNewChat: (agent: string) => void; variant: SidebarVariant;
}) {
  const [expanded, setExpanded] = useState(true);
  const Item = variant === "coding" ? CodingSessionItem : DefaultSessionItem;
  return (
    <div className="mb-3">
      <button onClick={() => setExpanded(!expanded)} className="group flex items-center gap-2 w-full px-3 py-2 text-[14px] font-semibold transition-colors" style={{ color: "var(--ink)" }}>
        <ChevronDown className={`size-3 transition-transform shrink-0 ${expanded ? "" : "-rotate-90"}`} style={{ color: "var(--ink-3)" }} />
        <div className="size-5 rounded-md flex items-center justify-center text-[9px] font-bold shrink-0" style={{ backgroundColor: "var(--border)", color: "var(--ink-2)" }}>{displayName.charAt(0).toUpperCase()}</div>
        {displayName}
        <span className="ml-auto flex items-center gap-1.5">
          <button onClick={(e) => { e.stopPropagation(); onNewChat(agentName); }} className="size-5 rounded flex items-center justify-center agent-new-btn transition-colors opacity-0 group-hover:opacity-100"><Plus className="size-3" /></button>
          <span className="text-[11px]" style={{ color: "var(--ink-3)" }}>{sessions.length}</span>
        </span>
      </button>
      {expanded && (
        <div className="ml-2 border-l" style={{ borderColor: "var(--border)" }}>
          {sessions.map((s) => <Item key={s.id} session={s} isActive={s.id === activeSessionId} onSelect={onSelect} onDelete={onDelete} />)}
        </div>
      )}
    </div>
  );
}

/* ── Settings popover ────────────────────────────────── */

function SettingsPopover({ variant, onVariantChange }: { variant: SidebarVariant; onVariantChange: (v: SidebarVariant) => void }) {
  const [open, setOpen] = useState(false);
  const opt = (v: SidebarVariant, label: string) => (
    <button onClick={() => { onVariantChange(v); setOpen(false); }}
      className={`flex items-center gap-2 w-full px-3 py-1.5 text-[12px] transition-colors ${variant === v ? "settings-opt-active" : "settings-opt"}`}>
      <span className="size-1.5 rounded-full" style={{ backgroundColor: variant === v ? "var(--accent)" : "var(--ink-3)" }} />{label}
    </button>
  );
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="size-7 rounded-md flex items-center justify-center sidebar-btn transition-colors">
        <Settings className="size-3.5" />
      </button>
      {open && (<>
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
        <div className="absolute bottom-full right-0 mb-2 border rounded-lg shadow-xl py-1.5 min-w-[160px] z-50" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--ink-3)" }}>Sidebar style</p>
          {opt("default", "Default")}{opt("coding", "Coding (Conductor)")}
        </div>
      </>)}
    </div>
  );
}

/* ── Landing view (uses real ChatInput + ChatAgentSelector) ── */

function LandingView({ selectedAgent, onAgentChange, onSend }: { selectedAgent: string | undefined; onAgentChange: (name: string) => void; onSend?: (text: string) => void }) {
  return (
    <MockChatProvider onFirstMessage={onSend}>
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <div className="max-w-2xl w-full text-center">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">New workspace</h1>
          <p className="text-sm mb-8" style={{ color: "var(--ink-3)" }}>Describe what you want to work on.</p>
          <div className="flex justify-center mb-4">
            <ChatAgentSelector agents={mockAgents as any} selected={selectedAgent} onSelect={onAgentChange} fallbackLabel="Auto (Orchestrator)" />
          </div>
          <ChatInput placeholder="What are you working on?" allowAttachments={false} />
        </div>
      </div>
    </MockChatProvider>
  );
}

/* ── Conversation view (uses real ChatMessages + ChatInput) ── */

function ConversationViewInner() {
  const { messages } = useChatContext();
  if (messages.length === 0) return null;
  return (
    <div className="flex flex-col h-screen">
      <ChatMessages className="flex-1" />
      <ChatInput placeholder="Type a message..." />
    </div>
  );
}

function ConversationView({ initialMessages }: { initialMessages: ChatMessageItemData[] }) {
  return (
    <MockChatProvider initialMessages={initialMessages}>
      <ConversationViewInner />
    </MockChatProvider>
  );
}

/* ── Main ────────────────────────────────────────────── */

export default function ExamplesMultiAgent() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [collapsed, setCollapsed] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<string | undefined>();
  const [sidebarVariant, setSidebarVariant] = useState<SidebarVariant>("default");
  const [newChatText, setNewChatText] = useState<string | null>(null);

  const vars = theme === "dark" ? darkVars : lightVars;

  const groups = useMemo(() => {
    const map = new Map<string, { agent: typeof mockAgents[number] | undefined; sessions: MockSession[] }>();
    for (const s of mockSessions) {
      if (!map.has(s.agent)) map.set(s.agent, { agent: mockAgents.find((a) => a.name === s.agent), sessions: [] });
      map.get(s.agent)!.sessions.push(s);
    }
    return Array.from(map.entries()).sort((a, b) => (b[1].sessions[0]?.updatedAt || "").localeCompare(a[1].sessions[0]?.updatedAt || ""));
  }, []);

  const handleNewChat = useCallback((agent?: string) => {
    setActiveSessionId(null);
    if (agent) setSelectedAgent(agent);
  }, []);

  const activeMessages = activeSessionId ? mockConversations[activeSessionId] || [] : [];

  return (
    <div style={vars as React.CSSProperties} className="font-sans">
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out both; }
        .sidebar-btn { color: var(--ink-3); }
        .sidebar-btn:hover { color: var(--ink); background-color: var(--surface); }
        .sidebar-home-btn { color: var(--ink-2); }
        .sidebar-home-btn:hover { color: var(--ink); background-color: var(--surface); }
        .floating-btn { background-color: var(--surface); border-color: var(--border); color: var(--ink-3); }
        .floating-btn:hover { color: var(--ink); }
        .session-item { color: var(--ink-3); }
        .session-item:hover { color: var(--ink-2); background-color: color-mix(in srgb, var(--surface) 50%, transparent); }
        .session-item-active { color: var(--ink-3); background-color: var(--surface); }
        .session-item-active:hover { color: var(--ink-2); }
        .delete-btn { color: var(--ink-3); }
        .delete-btn:hover { color: var(--c-red); }
        .agent-new-btn { color: var(--ink-3); }
        .agent-new-btn:hover { color: var(--ink); background-color: var(--surface); }
        .settings-opt-active { color: var(--accent); }
        .settings-opt { color: var(--ink-2); }
        .settings-opt:hover { color: var(--ink); }
      `}</style>
      <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg)", color: "var(--ink)" }}>
        {/* Sidebar */}
        <aside
          className={`shrink-0 border-r flex flex-col transition-all duration-300 ease-in-out ${
            collapsed ? "w-0 border-r-0 overflow-hidden" : "w-[320px]"
          }`}
          style={{ backgroundColor: "var(--sidebar-bg)", borderColor: "var(--sidebar-border)" }}
        >
          <div className="flex items-center justify-between px-3 h-12">
            <button onClick={() => setActiveSessionId(null)} className="flex items-center gap-2 px-2 py-1 rounded-md text-[13px] sidebar-home-btn transition-colors">
              <Home className="size-3.5" /> Home
            </button>
            <button onClick={() => setCollapsed(true)} className="size-7 rounded-md flex items-center justify-center sidebar-btn transition-colors">
              <PanelLeft className="size-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-1 py-2">
            {groups.map(([agentName, { agent, sessions }]) => (
              <AgentGroup
                key={agentName}
                agentName={agentName}
                displayName={agent?.identity?.displayName || agent?.name || agentName}
                sessions={sessions}
                activeSessionId={activeSessionId}
                onSelect={(id) => setActiveSessionId(id)}
                onDelete={() => {}}
                onNewChat={handleNewChat}
                variant={sidebarVariant}
              />
            ))}
          </div>

          <div className="px-3 py-2 border-t flex items-center justify-between" style={{ borderColor: "var(--sidebar-border)" }}>
            <button onClick={() => handleNewChat()} className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[12px] sidebar-btn transition-colors">
              <Plus className="size-3.5" /> New workspace
            </button>
            <div className="flex items-center gap-0.5">
              <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="size-7 rounded-md flex items-center justify-center sidebar-btn transition-colors" aria-label="Toggle theme">
                {theme === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
              </button>
              <SettingsPopover variant={sidebarVariant} onVariantChange={setSidebarVariant} />
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 relative" style={{ backgroundColor: "var(--bg)" }}>
          {collapsed && (
            <div className="absolute top-2 left-2 z-20 flex items-center gap-1 animate-fade-in">
              <button onClick={() => setCollapsed(false)} className="size-8 rounded-md flex items-center justify-center border floating-btn transition-colors">
                <PanelLeft className="size-3.5" />
              </button>
              <button onClick={() => handleNewChat()} className="size-8 rounded-md flex items-center justify-center border floating-btn transition-colors">
                <Plus className="size-3.5" />
              </button>
            </div>
          )}

          {activeSessionId ? (
            <ConversationView
              key={activeSessionId}
              initialMessages={
                activeSessionId === "__new__" && newChatText
                  ? [{ id: "u-new", role: "user" as const, content: newChatText, ts: new Date().toISOString() }]
                  : activeMessages
              }
            />
          ) : (
            <LandingView
              selectedAgent={selectedAgent}
              onAgentChange={setSelectedAgent}
              onSend={(text) => { setNewChatText(text); setActiveSessionId("__new__"); }}
            />
          )}
        </main>
      </div>
    </div>
  );
}
