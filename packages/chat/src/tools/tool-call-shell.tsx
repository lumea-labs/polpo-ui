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
    <div className={`flex flex-col rounded-lg bg-gray-100 border border-gray-200 text-[13px] text-gray-600 overflow-hidden ${isError ? "border-red-200 bg-red-50" : ""}`}>
      <button
        className={`flex items-center gap-2 px-3 py-2 border-none bg-transparent font-inherit text-inherit text-left w-full ${hasContent ? "cursor-pointer" : "cursor-default"}`}
        onClick={() => hasContent && setExpanded(!expanded)}
      >
        <Icon size={14} className="shrink-0" />
        <span className="font-medium text-gray-900 whitespace-nowrap">{label}</span>
        {summary ? <span className="text-gray-400 text-xs overflow-hidden text-ellipsis whitespace-nowrap max-w-[300px]">{summary}</span> : null}
        {isPending ? <Loader2 size={14} className="animate-spin text-blue-500 shrink-0" /> : null}
        {isDone ? <Check size={14} className="text-green-600 shrink-0" /> : null}
        {isError ? <AlertCircle size={14} className="text-red-500 shrink-0" /> : null}
        {hasContent ? (
          <ChevronRight size={12} className={`ml-auto text-gray-400 shrink-0 transition-transform duration-150 ${expanded ? "rotate-90" : ""}`} />
        ) : null}
      </button>
      {expanded ? (
        <div className="border-t border-gray-200">
          {children || (
            <pre className="m-0 px-2.5 py-2 text-[11px] leading-normal font-mono text-gray-600 bg-gray-50 whitespace-pre-wrap break-all max-h-[180px] overflow-y-auto">
              {tool.result}
            </pre>
          )}
        </div>
      ) : null}
    </div>
  );
}
