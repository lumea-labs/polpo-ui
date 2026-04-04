"use client";

import { useState, useEffect, useCallback } from "react";
import { useSessions, useAgents } from "@polpo-ai/react";
import { useRouter, usePathname } from "next/navigation";
import { ChatSessionList } from "@polpo-ai/chat";
import { Plus, PanelLeftClose, PanelLeft, Sun, Moon } from "lucide-react";

function useTheme() {
  const [theme, setThemeState] = useState<"light" | "dark" | "system">("system");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    if (stored) {
      setThemeState(stored);
      document.documentElement.setAttribute("data-theme", stored);
    }
  }, []);

  const toggle = useCallback(() => {
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark" ||
      (!document.documentElement.getAttribute("data-theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    const next = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setThemeState(next);
  }, []);

  return { theme, toggle };
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { sessions, isLoading, deleteSession } = useSessions();
  const { agents } = useAgents();
  const [collapsed, setCollapsed] = useState(true);
  const { theme, toggle: toggleTheme } = useTheme();

  const activeSessionId = pathname.match(/\/chat\/(?!new)(.+)/)?.[1] || null;
  const isDark = theme === "dark";

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`shrink-0 bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] flex flex-col transition-all duration-300 ease-in-out ${
          collapsed ? "w-0 border-r-0 overflow-hidden" : "w-64"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-[var(--sidebar-border)]">
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-3)]">
            Chats
          </span>
          <div className="flex items-center gap-0.5">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center size-7 rounded-lg text-[var(--ink-3)] hover:text-[var(--ink)] hover:bg-[var(--border)]/50 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
            </button>
            <button
              onClick={() => router.push("/chat/new")}
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

        {/* Label */}
        <div className="px-4 pt-4 pb-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--ink-3)]">
            Recent
          </span>
        </div>

        {/* Session list */}
        <div className="flex-1 overflow-y-auto px-2 pb-2">
          <ChatSessionList
            sessions={sessions}
            agents={agents}
            isLoading={isLoading}
            activeSessionId={activeSessionId}
            onSelect={(id) => router.push(`/chat/${id}`)}
            onDelete={deleteSession}
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
              onClick={() => router.push("/chat/new")}
              className="flex items-center justify-center size-9 rounded-lg border border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-sm text-[var(--ink-3)] hover:text-[var(--ink)] hover:border-[var(--ink-3)] transition-all shadow-sm"
              aria-label="New chat"
            >
              <Plus className="size-4" />
            </button>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
