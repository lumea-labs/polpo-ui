"use client";

import { memo, useMemo } from "react";
import { Users } from "lucide-react";
import type { ChatSession, AgentConfig } from "@polpo-ai/sdk";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface AgentSessionGroup {
  agentName: string;
  agent: AgentConfig | undefined;
  displayName: string;
  sessions: ChatSession[];
}

export interface ChatSessionsByAgentProps {
  /** Session list (from useSessions().sessions) */
  sessions: ChatSession[];
  /** Agents list (from useAgents().agents) */
  agents?: AgentConfig[];
  /** Called when an agent group is selected */
  onSelect: (agentName: string) => void;
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
/*  Agent group item                                                   */
/* ------------------------------------------------------------------ */

const AgentGroupItem = memo(function AgentGroupItem({
  group,
  onSelect,
  renderAvatar,
}: {
  group: AgentSessionGroup;
  onSelect: (agentName: string) => void;
  renderAvatar?: (agent: AgentConfig | undefined, name: string) => React.ReactNode;
}) {
  const role = group.agent?.role;

  return (
    <button
      type="button"
      onClick={() => onSelect(group.agentName)}
      className="flex items-center gap-3.5 w-full px-4 py-3.5 rounded-xl text-left transition-all duration-150 hover:bg-gray-50 group"
    >
      {/* Avatar */}
      {renderAvatar ? (
        renderAvatar(group.agent, group.agentName)
      ) : (
        <div className="flex items-center justify-center size-9 rounded-lg bg-gray-200 text-gray-600 text-sm font-semibold shrink-0">
          {group.displayName.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 truncate">
          {group.displayName}
        </div>
        {role && (
          <div className="text-xs text-gray-500 mt-0.5 truncate">{role}</div>
        )}
      </div>

      {/* Session count badge */}
      <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full shrink-0">
        {group.sessions.length}
      </span>
    </button>
  );
});

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function ChatSessionsByAgent({
  sessions,
  agents,
  onSelect,
  isLoading,
  emptyMessage = "No conversations yet",
  className,
  renderAvatar,
}: ChatSessionsByAgentProps) {
  const agentMap = useMemo(() => {
    const map = new Map<string, AgentConfig>();
    if (agents) for (const a of agents) map.set(a.name, a);
    return map;
  }, [agents]);

  const groups = useMemo<AgentSessionGroup[]>(() => {
    const map = new Map<string, ChatSession[]>();
    for (const s of sessions) {
      const name = s.agent || "assistant";
      if (!map.has(name)) map.set(name, []);
      map.get(name)!.push(s);
    }
    return Array.from(map.entries())
      .sort((a, b) => {
        const aLatest = a[1][0]?.updatedAt || "";
        const bLatest = b[1][0]?.updatedAt || "";
        return bLatest.localeCompare(aLatest);
      })
      .map(([agentName, agentSessions]) => {
        const agent = agentMap.get(agentName);
        return {
          agentName,
          agent,
          displayName: agent?.identity?.displayName || agent?.name || agentName,
          sessions: agentSessions,
        };
      });
  }, [sessions, agentMap]);

  if (isLoading) {
    return (
      <div className={`flex flex-col gap-1 ${className || ""}`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3.5 px-4 py-3.5">
            <div className="size-9 rounded-lg bg-gray-100 animate-pulse" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-1/2 rounded bg-gray-100 animate-pulse" />
              <div className="h-3 w-1/3 rounded bg-gray-100 animate-pulse" />
            </div>
            <div className="h-5 w-8 rounded-full bg-gray-100 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 ${className || ""}`}>
        <Users className="size-8 text-gray-300 mb-3" />
        <p className="text-sm text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-0.5 ${className || ""}`}>
      {groups.map((g) => (
        <AgentGroupItem
          key={g.agentName}
          group={g}
          onSelect={onSelect}
          renderAvatar={renderAvatar}
        />
      ))}
    </div>
  );
}
