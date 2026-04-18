"use client";

import { useState, useMemo, memo } from "react";
import { ChevronDown } from "lucide-react";
import type { AgentConfig } from "@polpo-ai/sdk";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ChatAgentSelectorProps {
  /** Agents list (from useAgents().agents) */
  agents: AgentConfig[] | undefined;
  /** Currently selected agent name */
  selected: string | undefined;
  /** Called when an agent is selected */
  onSelect: (agentName: string) => void;
  /** Label shown when no agent is selected */
  fallbackLabel?: string;
  /** Custom avatar renderer */
  renderAvatar?: (agent: AgentConfig, size: number) => React.ReactNode;
  /** Additional className */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const ChatAgentSelector = memo(function ChatAgentSelector({
  agents,
  selected,
  onSelect,
  fallbackLabel = "Select agent",
  renderAvatar,
  className,
}: ChatAgentSelectorProps) {
  const [open, setOpen] = useState(false);

  const items = useMemo(
    () =>
      agents?.map((a) => ({
        agent: a,
        displayName: a.identity?.displayName || a.name,
        letter: (a.identity?.displayName || a.name).charAt(0).toUpperCase(),
      })) ?? [],
    [agents],
  );

  const selectedItem = selected
    ? items.find((i) => i.agent.name === selected)
    : items[0] || null;

  return (
    <div className={`relative ${className || ""}`}>
      <button
        type="button"
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:bg-accent transition-colors"
        onClick={() => setOpen(!open)}
      >
        {selectedItem ? (
          <>
            {renderAvatar ? (
              renderAvatar(selectedItem.agent, 20)
            ) : (
              <span className="flex items-center justify-center size-5 rounded bg-accent text-[10px] font-semibold text-muted-foreground">
                {selectedItem.letter}
              </span>
            )}
            {selectedItem.displayName}
          </>
        ) : (
          fallbackLabel
        )}
        <ChevronDown className="size-3" />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          {/* Dropdown */}
          <div className="absolute bottom-full left-0 mb-1 bg-muted/50 border border-border rounded-xl shadow-lg py-1 min-w-[180px] z-50">
            {items.map((item) => (
              <button
                key={item.agent.name}
                type="button"
                className={`flex items-center gap-2 w-full px-3 py-2 text-xs text-left hover:bg-muted/50 transition-colors ${
                  selected === item.agent.name ? "bg-muted/50 font-semibold" : ""
                }`}
                onClick={() => {
                  onSelect(item.agent.name);
                  setOpen(false);
                }}
              >
                {renderAvatar ? (
                  renderAvatar(item.agent, 20)
                ) : (
                  <span className="flex items-center justify-center size-5 rounded bg-accent text-[10px] font-semibold text-muted-foreground">
                    {item.letter}
                  </span>
                )}
                {item.displayName}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
});
