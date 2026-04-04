"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSessions, useAgents } from "@polpo-ai/react";
import { useRouter, usePathname } from "next/navigation";
import type { ChatSession, AgentConfig } from "@polpo-ai/sdk";
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

type SidebarVariant = "default" | "coding";

/* ── Theme hook ───────────────────────────────────────── */

function useTheme() {
  const [theme, setThemeState] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    if (stored) {
      setThemeState(stored);
      document.documentElement.setAttribute("data-theme", stored);
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggle = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setThemeState(next);
  }, [theme]);

  return { theme, toggle };
}

/* ── Resolve avatar URL ────────────────────────────────── */

const POLPO_BASE = process.env.NEXT_PUBLIC_POLPO_URL || "https://api.polpo.sh";

function resolveAvatar(agent: AgentConfig | undefined): string | undefined {
  const avatar = agent?.identity?.avatar;
  const avatarUrl = agent?.identity?.avatarUrl;
  // Direct http URL (e.g. unsplash)
  if (avatar?.startsWith("http")) return avatar;
  // Server-relative path — proxy through our API to avoid CORS + add auth
  if (avatarUrl) {
    const serverPath = avatarUrl.replace(/^\/api\/v1/, "/v1");
    return `/api/avatar?url=${encodeURIComponent(serverPath)}`;
  }
  return undefined;
}

/* ── Fake git stats for coding variant ────────────────── */

function fakeStats(sessionId: string) {
  // Deterministic fake stats from session ID hash
  let h = 0;
  for (let i = 0; i < sessionId.length; i++) h = ((h << 5) - h + sessionId.charCodeAt(i)) | 0;
  const abs = Math.abs(h);
  const added = (abs % 800) + 10;
  const removed = ((abs >> 8) % 500) + 5;
  const branches = ["main", "feat/auth", "fix/layout", "refactor/api", "dev", "staging"];
  const branch = branches[abs % branches.length];
  const statuses = ["Ready to merge", "In progress", "Draft", "Review"];
  const status = statuses[(abs >> 4) % statuses.length];
  return { added, removed, branch, status };
}

/* ── Default session item ─────────────────────────────── */

function DefaultSessionItem({
  session,
  isActive,
  onSelect,
  onDelete,
}: {
  session: ChatSession;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(session.id)}
      onKeyDown={(e) => { if (e.key === "Enter") onSelect(session.id); }}
      className={`group flex items-center gap-2 w-full pl-4 pr-2 py-1.5 text-[12px] cursor-pointer transition-colors text-[var(--ink-3)] hover:text-[var(--ink-2)] ${
        isActive ? "bg-[var(--surface)]" : "hover:bg-[var(--surface)]/50"
      }`}
    >
      <span className="truncate flex-1">{session.title || session.id.slice(0, 20)}</span>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(session.id); }}
        className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-[var(--ink-3)] hover:text-[var(--c-red)] transition-all"
      >
        <Trash2 className="size-3" />
      </button>
    </div>
  );
}

/* ── Coding session item (conductor-style) ────────────── */

function CodingSessionItem({
  session,
  isActive,
  onSelect,
  onDelete,
}: {
  session: ChatSession;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const stats = fakeStats(session.id);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(session.id)}
      onKeyDown={(e) => { if (e.key === "Enter") onSelect(session.id); }}
      className={`group flex flex-col w-full pl-4 pr-2 py-3 cursor-pointer transition-colors text-[var(--ink-3)] hover:text-[var(--ink-2)] ${
        isActive ? "bg-[var(--surface)]" : "hover:bg-[var(--surface)]/50"
      }`}
    >
      {/* Title row */}
      <div className="flex items-center gap-2">
        <span className="truncate flex-1 text-[13px] font-medium">
          {session.title || session.id.slice(0, 20)}
        </span>
        <span className="shrink-0 text-[11px] font-mono">
          <span className="text-[var(--c-green)]">+{stats.added}</span>
          {" "}
          <span className="text-[var(--c-red)]">-{stats.removed}</span>
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(session.id); }}
          className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-[var(--ink-3)] hover:text-[var(--c-red)] transition-all"
        >
          <MoreHorizontal className="size-3" />
        </button>
      </div>
      {/* Branch + status */}
      <div className="flex items-center gap-2 mt-1">
        <div className="flex items-center gap-1 text-[10px] text-[var(--ink-2)]">
          <GitBranch className="size-2.5" />
          {stats.branch}
        </div>
        <span className="text-[10px] text-[var(--ink-3)]">·</span>
        <span className="text-[10px] text-[var(--ink-3)]">{stats.status}</span>
      </div>
    </div>
  );
}

/* ── Agent group ──────────────────────────────────────── */

function AgentGroup({
  agentName,
  displayName,
  avatarUrl,
  sessions,
  activeSessionId,
  onSelect,
  onDelete,
  onNewChat,
  variant,
}: {
  agentName: string;
  displayName: string;
  avatarUrl?: string;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNewChat: (agent: string) => void;
  variant: SidebarVariant;
}) {
  const [expanded, setExpanded] = useState(true);
  const SessionItem = variant === "coding" ? CodingSessionItem : DefaultSessionItem;
  const letter = displayName.charAt(0).toUpperCase();

  return (
    <div className="mb-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="group flex items-center gap-2 w-full px-3 py-2 text-[14px] font-semibold text-[var(--ink)] hover:text-[var(--ink)] transition-colors"
      >
        <ChevronDown className={`size-3 text-[var(--ink-3)] transition-transform shrink-0 ${expanded ? "" : "-rotate-90"}`} />
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="size-5 rounded-md object-cover shrink-0" />
        ) : (
          <div className="size-5 rounded-md bg-[var(--border)] flex items-center justify-center text-[9px] font-bold text-[var(--ink-2)] shrink-0">
            {letter}
          </div>
        )}
        {displayName}
        <span className="ml-auto flex items-center gap-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); onNewChat(agentName); }}
            className="size-5 rounded flex items-center justify-center text-[var(--ink-3)] hover:text-[var(--ink)] hover:bg-[var(--surface)] transition-colors opacity-0 group-hover:opacity-100"
          >
            <Plus className="size-3" />
          </button>
          <span className="text-[var(--ink-3)] text-[11px]">{sessions.length}</span>
        </span>
      </button>

      {expanded && (
        <div className="ml-2 border-l border-[var(--border)]">
          {sessions.map((s) => (
            <SessionItem
              key={s.id}
              session={s}
              isActive={s.id === activeSessionId}
              onSelect={onSelect}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Settings popover ─────────────────────────────────── */

function SettingsPopover({
  variant,
  onVariantChange,
}: {
  variant: SidebarVariant;
  onVariantChange: (v: SidebarVariant) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="size-7 rounded-md flex items-center justify-center text-[var(--ink-3)] hover:text-[var(--ink)] hover:bg-[var(--surface)] transition-colors"
      >
        <Settings className="size-3.5" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full right-0 mb-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-xl py-1.5 min-w-[160px] z-50">
            <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">
              Sidebar style
            </p>
            <button
              onClick={() => { onVariantChange("default"); setOpen(false); }}
              className={`flex items-center gap-2 w-full px-3 py-1.5 text-[12px] transition-colors ${
                variant === "default" ? "text-[var(--accent)]" : "text-[var(--ink-2)] hover:text-[var(--ink)]"
              }`}
            >
              <span className={`size-1.5 rounded-full ${variant === "default" ? "bg-[var(--accent)]" : "bg-[var(--ink-3)]"}`} />
              Default
            </button>
            <button
              onClick={() => { onVariantChange("coding"); setOpen(false); }}
              className={`flex items-center gap-2 w-full px-3 py-1.5 text-[12px] transition-colors ${
                variant === "coding" ? "text-[var(--accent)]" : "text-[var(--ink-2)] hover:text-[var(--ink)]"
              }`}
            >
              <span className={`size-1.5 rounded-full ${variant === "coding" ? "bg-[var(--accent)]" : "bg-[var(--ink-3)]"}`} />
              Coding (Conductor)
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Layout ───────────────────────────────────────────── */

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { sessions, isLoading, deleteSession } = useSessions();
  const { agents } = useAgents();
  const [collapsed, setCollapsed] = useState(false);
  const { theme, toggle: toggleTheme } = useTheme();
  const [sidebarVariant, setSidebarVariant] = useState<SidebarVariant>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("sidebar-variant") as SidebarVariant) || "default";
    }
    return "default";
  });

  const handleVariantChange = useCallback((v: SidebarVariant) => {
    setSidebarVariant(v);
    localStorage.setItem("sidebar-variant", v);
  }, []);

  const activeSessionId = pathname.match(/\/chat\/(?!new)(.+)/)?.[1] || null;

  const groups = useMemo(() => {
    const map = new Map<string, { agent: AgentConfig | undefined; sessions: ChatSession[] }>();
    for (const s of sessions) {
      const name = s.agent || "default";
      if (!map.has(name)) {
        const agent = agents?.find((a) => a.name === name);
        map.set(name, { agent, sessions: [] });
      }
      map.get(name)!.sessions.push(s);
    }
    return Array.from(map.entries()).sort((a, b) => {
      const aDate = a[1].sessions[0]?.updatedAt || "";
      const bDate = b[1].sessions[0]?.updatedAt || "";
      return bDate.localeCompare(aDate);
    });
  }, [sessions, agents]);

  const handleNewChat = useCallback(
    (agent?: string) => {
      router.push(agent ? `/chat/new?agent=${agent}` : "/chat/new");
    },
    [router],
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`shrink-0 bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] flex flex-col transition-all duration-300 ease-in-out ${
          collapsed ? "w-0 border-r-0 overflow-hidden" : "w-[320px]"
        }`}
      >
        {/* Top */}
        <div className="flex items-center justify-between px-3 h-12">
          <button
            onClick={() => router.push("/chat/new")}
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
          {isLoading ? (
            <div className="space-y-3 px-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 rounded bg-[var(--border)] animate-pulse" style={{ width: `${60 + i * 10}%` }} />
              ))}
            </div>
          ) : groups.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <p className="text-[12px] text-[var(--ink-3)] mb-3">No workspaces yet</p>
              <button onClick={() => handleNewChat()} className="text-[12px] text-[var(--accent)] hover:underline">
                Create one
              </button>
            </div>
          ) : (
            groups.map(([agentName, { agent, sessions: agentSessions }]) => (
              <AgentGroup
                key={agentName}
                agentName={agentName}
                displayName={agent?.identity?.displayName || agent?.name || agentName}
                avatarUrl={resolveAvatar(agent)}
                sessions={agentSessions}
                activeSessionId={activeSessionId}
                onSelect={(id) => router.push(`/chat/${id}`)}
                onDelete={deleteSession}
                onNewChat={handleNewChat}
                variant={sidebarVariant}
              />
            ))
          )}
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
              onClick={toggleTheme}
              className="size-7 rounded-md flex items-center justify-center text-[var(--ink-3)] hover:text-[var(--ink)] hover:bg-[var(--surface)] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
            </button>
            <SettingsPopover variant={sidebarVariant} onVariantChange={handleVariantChange} />
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 relative bg-[var(--bg)]">
        {collapsed && (
          <div className="absolute top-2 left-2 z-20 flex items-center gap-1 animate-fade-in">
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
        {children}
      </main>
    </div>
  );
}
