"use client";

import { useState, useMemo, useCallback } from "react";
import {
  ChatUserMessage,
  ChatAssistantMessage,
  ChatAgentSelector,
  type ChatMessageItemData,
} from "@polpo-ai/chat";
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
  ArrowUp,
} from "lucide-react";

/* ── CSS vars (inline) ───────────────────────────────── */

const darkVars: Record<string, string> = {
  "--c-bg": "#1B1B1F", "--c-bg-subtle": "#141417", "--c-border": "#2A2A2F",
  "--c-ink-3": "#5A5A65", "--c-ink-2": "#B0B0BA", "--c-ink": "#E8E8ED",
  "--c-surface": "#222226", "--c-accent": "#4A90E2", "--c-green": "#4ADE80", "--c-red": "#EF4444",
  "--sidebar-bg": "#141417", "--sidebar-border": "#2A2A2F",
  "--ink": "#E8E8ED", "--ink-2": "#B0B0BA", "--ink-3": "#5A5A65",
  "--border": "#2A2A2F", "--bg": "#1B1B1F", "--surface": "#222226", "--accent": "#4A90E2",
};

const lightVars: Record<string, string> = {
  "--c-bg": "#FAFAFA", "--c-bg-subtle": "#F0F0F2", "--c-border": "#E0E0E5",
  "--c-ink-3": "#9090A0", "--c-ink-2": "#505060", "--c-ink": "#1A1A2E",
  "--c-surface": "#FFFFFF", "--c-accent": "#3B7DD8", "--c-green": "#16A34A", "--c-red": "#EF4444",
  "--sidebar-bg": "#F0F0F2", "--sidebar-border": "#E0E0E5",
  "--ink": "#1A1A2E", "--ink-2": "#505060", "--ink-3": "#9090A0",
  "--border": "#E0E0E5", "--bg": "#FAFAFA", "--surface": "#FFFFFF", "--accent": "#3B7DD8",
};

/* ── Mock data ───────────────────────────────────────── */

type SidebarVariant = "default" | "coding";
interface MockSession { id: string; title: string; agent: string; createdAt: string; updatedAt: string; messageCount: number; }

const mockSessions: MockSession[] = [
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

const mockConversations: Record<string, ChatMessageItemData[]> = {
  s1: [
    { id: "m1", role: "user", content: "Add a users table to the Prisma schema with email, name, and role fields." },
    { id: "m2", role: "assistant", content: "I'll add the `User` model to your Prisma schema. Here's the migration:\n\n```prisma\nmodel User {\n  id    String @id @default(cuid())\n  email String @unique\n  name  String\n  role  Role   @default(USER)\n}\n```", toolCalls: [{ id: "tc1", name: "edit_file", state: "completed", arguments: { path: "prisma/schema.prisma" } }] },
  ],
  s2: [
    { id: "m3", role: "user", content: "The auth middleware returns 401 for valid tokens. Help?" },
    { id: "m4", role: "assistant", content: "Found the issue — algorithm mismatch between `HS256` and `RS256`. Fixed.", toolCalls: [{ id: "tc2", name: "read_file", state: "completed", arguments: { path: "src/middleware/auth.ts" } }, { id: "tc3", name: "edit_file", state: "completed", arguments: { path: "src/middleware/auth.ts" } }] },
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
    branch: ["main", "feat/auth", "fix/layout", "refactor/api", "dev"][a % 5],
    status: ["Ready to merge", "In progress", "Draft", "Review"][(a >> 4) % 4],
  };
}

/* ── Session items ───────────────────────────────────── */

type SessionItemProps = { session: MockSession; isActive: boolean; onSelect: (id: string) => void; onDelete: (id: string) => void };

function DefaultSessionItem({ session, isActive, onSelect, onDelete }: SessionItemProps) {
  return (
    <div role="button" tabIndex={0} onClick={() => onSelect(session.id)} onKeyDown={(e) => { if (e.key === "Enter") onSelect(session.id); }}
      className={`group flex items-center gap-2 w-full pl-4 pr-2 py-1.5 text-[12px] cursor-pointer transition-colors text-[var(--ink-3)] hover:text-[var(--ink-2)] ${isActive ? "bg-[var(--surface)]" : "hover:bg-[var(--surface)]/50"}`}>
      <span className="truncate flex-1">{session.title}</span>
      <button onClick={(e) => { e.stopPropagation(); onDelete(session.id); }} className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-[var(--ink-3)] hover:text-[var(--c-red)] transition-all">
        <Trash2 className="size-3" />
      </button>
    </div>
  );
}

function CodingSessionItem({ session, isActive, onSelect, onDelete }: SessionItemProps) {
  const stats = fakeStats(session.id);
  return (
    <div role="button" tabIndex={0} onClick={() => onSelect(session.id)} onKeyDown={(e) => { if (e.key === "Enter") onSelect(session.id); }}
      className={`group flex flex-col w-full pl-4 pr-2 py-3 cursor-pointer transition-colors text-[var(--ink-3)] hover:text-[var(--ink-2)] ${isActive ? "bg-[var(--surface)]" : "hover:bg-[var(--surface)]/50"}`}>
      <div className="flex items-center gap-2">
        <span className="truncate flex-1 text-[13px] font-medium">{session.title}</span>
        <span className="shrink-0 text-[11px] font-mono"><span className="text-[var(--c-green)]">+{stats.added}</span> <span className="text-[var(--c-red)]">-{stats.removed}</span></span>
        <button onClick={(e) => { e.stopPropagation(); onDelete(session.id); }} className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-[var(--ink-3)] hover:text-[var(--c-red)] transition-all"><MoreHorizontal className="size-3" /></button>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <div className="flex items-center gap-1 text-[10px] text-[var(--ink-2)]"><GitBranch className="size-2.5" />{stats.branch}</div>
        <span className="text-[10px] text-[var(--ink-3)]">·</span>
        <span className="text-[10px] text-[var(--ink-3)]">{stats.status}</span>
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
      <button onClick={() => setExpanded(!expanded)} className="group flex items-center gap-2 w-full px-3 py-2 text-[14px] font-semibold text-[var(--ink)] hover:text-[var(--ink)] transition-colors">
        <ChevronDown className={`size-3 text-[var(--ink-3)] transition-transform shrink-0 ${expanded ? "" : "-rotate-90"}`} />
        <div className="size-5 rounded-md bg-[var(--border)] flex items-center justify-center text-[9px] font-bold text-[var(--ink-2)] shrink-0">{displayName.charAt(0).toUpperCase()}</div>
        {displayName}
        <span className="ml-auto flex items-center gap-1.5">
          <button onClick={(e) => { e.stopPropagation(); onNewChat(agentName); }} className="size-5 rounded flex items-center justify-center text-[var(--ink-3)] hover:text-[var(--ink)] hover:bg-[var(--surface)] transition-colors opacity-0 group-hover:opacity-100"><Plus className="size-3" /></button>
          <span className="text-[var(--ink-3)] text-[11px]">{sessions.length}</span>
        </span>
      </button>
      {expanded && (
        <div className="ml-2 border-l border-[var(--border)]">
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
      className={`flex items-center gap-2 w-full px-3 py-1.5 text-[12px] transition-colors ${variant === v ? "text-[var(--accent)]" : "text-[var(--ink-2)] hover:text-[var(--ink)]"}`}>
      <span className={`size-1.5 rounded-full ${variant === v ? "bg-[var(--accent)]" : "bg-[var(--ink-3)]"}`} />{label}
    </button>
  );
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="size-7 rounded-md flex items-center justify-center text-[var(--ink-3)] hover:text-[var(--ink)] hover:bg-[var(--surface)] transition-colors">
        <Settings className="size-3.5" />
      </button>
      {open && (<>
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
        <div className="absolute bottom-full right-0 mb-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-xl py-1.5 min-w-[160px] z-50">
          <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">Sidebar style</p>
          {opt("default", "Default")}{opt("coding", "Coding (Conductor)")}
        </div>
      </>)}
    </div>
  );
}

/* ── Shared mock input ────────────────────────────────── */

function MockInput({ placeholder = "Type a message...", wrap = true, onSend }: { placeholder?: string; wrap?: boolean; onSend?: (text: string) => void }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || !onSend) return;
    onSend(trimmed);
    setText("");
  };

  const inner = (
    <div className="flex items-end gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
      <textarea
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
        placeholder={placeholder}
        className="flex-1 resize-none bg-transparent text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] outline-none"
      />
      <button onClick={handleSend} className="flex items-center justify-center size-8 rounded-lg bg-[var(--accent)] text-white shrink-0"><ArrowUp className="size-4" /></button>
    </div>
  );
  if (!wrap) return inner;
  return <div className="shrink-0 px-6 py-3"><div className="max-w-3xl mx-auto">{inner}</div></div>;
}

/* ── Landing view ────────────────────────────────────── */

function LandingView({ selectedAgent, onAgentChange, onSend }: { selectedAgent: string | undefined; onAgentChange: (name: string) => void; onSend: (text: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">New workspace</h1>
        <p className="text-sm text-[var(--ink-3)] mb-8">Describe what you want to work on.</p>
        <div className="flex justify-center mb-4">
          <ChatAgentSelector agents={mockAgents as any} selected={selectedAgent} onSelect={onAgentChange} fallbackLabel="Auto (Orchestrator)" />
        </div>
        <MockInput placeholder="What are you working on?" wrap={false} onSend={onSend} />
      </div>
    </div>
  );
}

/* ── Conversation view ───────────────────────────────── */

function ConversationView({ messages, agentName, onSend }: { messages: ChatMessageItemData[]; agentName: string; onSend: (text: string) => void }) {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto">
        {messages.map((msg) => msg.role === "user"
          ? <ChatUserMessage key={msg.id} msg={msg} />
          : <ChatAssistantMessage key={msg.id} msg={msg} agentName={agentName} />
        )}
      </div>
      <MockInput onSend={onSend} />
    </div>
  );
}

/* ── Main ────────────────────────────────────────────── */

export default function ExamplesMultiAgent() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [collapsed, setCollapsed] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<string | undefined>();
  const [sidebarVariant, setSidebarVariant] = useState<SidebarVariant>("default");
  const [liveMessages, setLiveMessages] = useState<Record<string, ChatMessageItemData[]>>({ ...mockConversations });
  const [adHocMessages, setAdHocMessages] = useState<ChatMessageItemData[] | null>(null);

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
    setAdHocMessages(null);
    setActiveSessionId(null);
    if (agent) setSelectedAgent(agent);
  }, []);

  const activeSession = mockSessions.find((s) => s.id === activeSessionId);
  const activeMessages = adHocMessages
    ? adHocMessages
    : activeSessionId
      ? liveMessages[activeSessionId] || []
      : [];
  const activeAgent = activeSession ? mockAgents.find((a) => a.name === activeSession.agent) : undefined;

  const handleSend = useCallback((text: string) => {
    const userMsg: ChatMessageItemData = { id: "u-" + Date.now(), role: "user", content: text, ts: new Date().toISOString() };
    if (adHocMessages) {
      setAdHocMessages((prev) => prev ? [...prev, userMsg] : [userMsg]);
      setTimeout(() => {
        setAdHocMessages((prev) => prev ? [...prev, { id: "a-" + Date.now(), role: "assistant", content: "I'll help you with that. Let me look into it and get back to you with a solution.", ts: new Date().toISOString() }] : prev);
      }, 800);
    } else if (activeSessionId) {
      setLiveMessages((cur) => ({ ...cur, [activeSessionId]: [...(cur[activeSessionId] || []), userMsg] }));
      setTimeout(() => {
        setLiveMessages((cur) => ({ ...cur, [activeSessionId]: [...(cur[activeSessionId] || []), { id: "a-" + Date.now(), role: "assistant", content: "I'll help you with that. Let me look into it and get back to you with a solution.", ts: new Date().toISOString() }] }));
      }, 800);
    }
  }, [adHocMessages, activeSessionId]);

  const handleLandingSend = useCallback((text: string) => {
    const userMsg: ChatMessageItemData = { id: "u-" + Date.now(), role: "user", content: text, ts: new Date().toISOString() };
    setAdHocMessages([userMsg]);
    setActiveSessionId("__adhoc__");
    setTimeout(() => {
      setAdHocMessages((prev) => prev ? [...prev, { id: "a-" + Date.now(), role: "assistant", content: "I'll help you with that. Let me look into it and get back to you with a solution.", ts: new Date().toISOString() }] : prev);
    }, 800);
  }, []);

  return (
    <div style={vars as React.CSSProperties} className="font-sans">
      <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg)", color: "var(--ink)" }}>
        {/* Sidebar */}
        <aside
          className={`shrink-0 bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] flex flex-col transition-all duration-300 ease-in-out ${
            collapsed ? "w-0 border-r-0 overflow-hidden" : "w-[320px]"
          }`}
        >
          {/* Top */}
          <div className="flex items-center justify-between px-3 h-12">
            <button
              onClick={() => setActiveSessionId(null)}
              className="flex items-center gap-2 px-2 py-1 rounded-md text-[13px] text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--surface)] transition-colors"
            >
              <Home className="size-3.5" /> Home
            </button>
            <button
              onClick={() => setCollapsed(true)}
              className="size-7 rounded-md flex items-center justify-center text-[var(--ink-3)] hover:text-[var(--ink)] hover:bg-[var(--surface)] transition-colors"
            >
              <PanelLeft className="size-3.5" />
            </button>
          </div>

          {/* Agent groups */}
          <div className="flex-1 overflow-y-auto px-1 py-2">
            {groups.map(([agentName, { agent, sessions }]) => (
              <AgentGroup
                key={agentName}
                agentName={agentName}
                displayName={agent?.identity?.displayName || agent?.name || agentName}
                sessions={sessions}
                activeSessionId={activeSessionId}
                onSelect={(id) => { setAdHocMessages(null); setActiveSessionId(id); }}
                onDelete={() => {}}
                onNewChat={handleNewChat}
                variant={sidebarVariant}
              />
            ))}
          </div>

          {/* Bottom */}
          <div className="px-3 py-2 border-t border-[var(--sidebar-border)] flex items-center justify-between">
            <button
              onClick={() => handleNewChat()}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[12px] text-[var(--ink-3)] hover:text-[var(--ink)] hover:bg-[var(--surface)] transition-colors"
            >
              <Plus className="size-3.5" /> New workspace
            </button>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="size-7 rounded-md flex items-center justify-center text-[var(--ink-3)] hover:text-[var(--ink)] hover:bg-[var(--surface)] transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
              </button>
              <SettingsPopover variant={sidebarVariant} onVariantChange={setSidebarVariant} />
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 relative bg-[var(--bg)]">
          {collapsed && (
            <div className="absolute top-2 left-2 z-20 flex items-center gap-1">
              <button
                onClick={() => setCollapsed(false)}
                className="size-8 rounded-md flex items-center justify-center bg-[var(--surface)] border border-[var(--border)] text-[var(--ink-3)] hover:text-[var(--ink)] transition-colors"
              >
                <PanelLeft className="size-3.5" />
              </button>
              <button
                onClick={() => handleNewChat()}
                className="size-8 rounded-md flex items-center justify-center bg-[var(--surface)] border border-[var(--border)] text-[var(--ink-3)] hover:text-[var(--ink)] transition-colors"
              >
                <Plus className="size-3.5" />
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
  );
}
