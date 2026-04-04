"use client";

import { useState, type ReactNode } from "react";
import type { ToolCallEvent } from "@polpo-ai/sdk";
import { ChevronRight, Loader2, Check, AlertCircle, type LucideIcon } from "lucide-react";

// ── Shell props ──

export interface ToolCallShellProps {
  tool: ToolCallEvent;
  icon: LucideIcon;
  label: string;
  /** One-line summary shown next to the label */
  summary?: string | null;
  /** Custom expanded content — replaces default raw result */
  children?: ReactNode;
}

// ── Shell ──

export function ToolCallShell({ tool, icon: Icon, label, summary, children }: ToolCallShellProps) {
  const [expanded, setExpanded] = useState(false);
  const isPending = tool.state === "calling" || tool.state === "preparing";
  const isError = tool.state === "error";
  const isDone = tool.state === "completed";
  const hasContent = isDone && (children || tool.result);

  return (
    <div className={`flex flex-col rounded-lg bg-p-warm border border-p-line text-[13px] text-p-ink-2 overflow-hidden ${isError ? "border-destructive/20 bg-destructive/5" : ""}`}>
      <button
        className={`flex items-center gap-2 px-3 py-2 border-none bg-transparent font-inherit text-inherit text-left w-full ${hasContent ? "cursor-pointer" : "cursor-default"}`}
        onClick={() => hasContent && setExpanded(!expanded)}
      >
        <Icon size={14} className="shrink-0" />
        <span className="font-medium text-p-ink whitespace-nowrap">{label}</span>
        {summary ? <span className="text-p-ink-3 text-xs overflow-hidden text-ellipsis whitespace-nowrap max-w-[300px]">{summary}</span> : null}
        {isPending ? <Loader2 size={14} className="animate-spin text-p-accent shrink-0" /> : null}
        {isDone ? <Check size={14} className="text-p-green shrink-0" /> : null}
        {isError ? <AlertCircle size={14} className="text-destructive shrink-0" /> : null}
        {hasContent ? (
          <ChevronRight size={12} className={`ml-auto text-p-ink-3 shrink-0 transition-transform duration-150 ${expanded ? "rotate-90" : ""}`} />
        ) : null}
      </button>
      {expanded ? (
        <div className="border-t border-p-line">
          {children || (
            <pre className="m-0 px-2.5 py-2 text-[11px] leading-normal font-mono text-p-ink-2 bg-p-bg whitespace-pre-wrap break-all max-h-[180px] overflow-y-auto">
              {tool.result}
            </pre>
          )}
        </div>
      ) : null}
    </div>
  );
}
