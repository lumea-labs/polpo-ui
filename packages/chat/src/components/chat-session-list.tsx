"use client";

import { memo, useMemo, useCallback } from "react";
import { Trash2, MessageSquare } from "lucide-react";
import type { ChatSession, AgentConfig } from "@polpo-ai/sdk";
import { relativeTime } from "../lib/relative-time";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ChatSessionListProps {
  /** Session list (from useSessions().sessions) */
  sessions: ChatSession[];
  /** Agents list (from useAgents().agents) — used to show agent names */
  agents?: AgentConfig[];
  /** Currently active session ID (highlighted) */
  activeSessionId?: string | null;
  /** Called when a session is selected */
  onSelect: (sessionId: string) => void;
  /** Called when delete is requested. Omit to hide delete buttons. */
  onDelete?: (sessionId: string) => void;
  /** Whether the list is loading */
  isLoading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Additional className on the outer container */
  className?: string;
  /** Custom avatar renderer for an agent */
  renderAvatar?: (agent: AgentConfig | undefined, agentName: string) => React.ReactNode;
}

/* ------------------------------------------------------------------ */
/*  Session item                                                       */
/* ------------------------------------------------------------------ */

const SessionItem = memo(function SessionItem({
  session,
  agentMap,
  isActive,
  onSelect,
  onDelete,
  renderAvatar,
}: {
  session: ChatSession;
  agentMap: Map<string, AgentConfig>;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete?: (id: string) => void;
  renderAvatar?: (agent: AgentConfig | undefined, name: string) => React.ReactNode;
}) {
  const agentName = session.agent || "assistant";
  const agent = agentMap.get(agentName);
  const displayName = agent?.identity?.displayName || agent?.name || agentName;

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete?.(session.id);
    },
    [onDelete, session.id],
  );

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(session.id)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(session.id); } }}
      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer group ${
        isActive
          ? "bg-muted"
          : "hover:bg-muted/50"
      }`}
    >
      {/* Avatar */}
      {renderAvatar ? (
        renderAvatar(agent, agentName)
      ) : (
        <div className="flex items-center justify-center size-8 rounded-lg bg-accent text-muted-foreground text-xs font-semibold shrink-0">
          {displayName.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground truncate">
          {session.title || session.id.slice(0, 24)}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-xs text-muted-foreground truncate">{displayName}</span>
          {session.updatedAt && (
            <>
              <span className="text-muted-foreground/60">·</span>
              <span className="text-[11px] text-muted-foreground shrink-0">
                {relativeTime(session.updatedAt)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Delete */}
      {onDelete && (
        <button
          type="button"
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
          aria-label="Delete session"
        >
          <Trash2 className="size-3.5" />
        </button>
      )}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function ChatSessionList({
  sessions,
  agents,
  activeSessionId,
  onSelect,
  onDelete,
  isLoading,
  emptyMessage = "No conversations yet",
  className,
  renderAvatar,
}: ChatSessionListProps) {
  const agentMap = useMemo(() => {
    const map = new Map<string, AgentConfig>();
    if (agents) for (const a of agents) map.set(a.name, a);
    return map;
  }, [agents]);

  if (isLoading) {
    return (
      <div className={`flex flex-col gap-1 ${className || ""}`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2.5">
            <div className="size-8 rounded-lg bg-muted animate-pulse" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-3/4 rounded bg-muted animate-pulse" />
              <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 ${className || ""}`}>
        <MessageSquare className="size-8 text-muted-foreground/60 mb-3" />
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-0.5 ${className || ""}`}>
      {sessions.map((s) => (
        <SessionItem
          key={s.id}
          session={s}
          agentMap={agentMap}
          isActive={s.id === activeSessionId}
          onSelect={onSelect}
          onDelete={onDelete}
          renderAvatar={renderAvatar}
        />
      ))}
    </div>
  );
}
