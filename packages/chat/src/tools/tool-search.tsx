"use client";

import type { ToolCallEvent } from "@polpo-ai/sdk";
import { Search, FolderSearch } from "lucide-react";
import { ToolCallShell } from "./tool-call-shell";

/** Grep/Glob/Search tool — shows query/pattern and matched results */
export function ToolSearch({ tool }: { tool: ToolCallEvent }) {
  const isGlob = tool.name === "glob";
  const pattern = (tool.arguments?.pattern || tool.arguments?.query || tool.arguments?.q) as string | undefined;
  const path = (tool.arguments?.path || tool.arguments?.root) as string | undefined;
  const summary = pattern ? `${pattern}${path ? ` in ${path}` : ""}` : path;

  const lines = tool.result?.split("\n").filter(Boolean) || [];
  const maxItems = 8;
  const truncated = lines.length > maxItems;

  return (
    <ToolCallShell tool={tool} icon={isGlob ? FolderSearch : Search} label={isGlob ? "Glob" : tool.name === "grep" ? "Grep" : "Search"} summary={summary}>
      {lines.length > 0 && (
        <div className="bg-p-bg max-h-[200px] overflow-y-auto">
          <ul className="list-none m-0 p-0">
            {lines.slice(0, maxItems).map((line, i) => (
              <li key={i} className="px-2.5 py-0.5 text-xs font-mono text-p-ink-2 border-b border-p-line/50 last:border-b-0 hover:bg-p-warm/50 truncate">
                {line}
              </li>
            ))}
          </ul>
          {truncated && (
            <div className="px-2.5 py-1 text-[10px] text-p-ink-3 border-t border-p-line">
              +{lines.length - maxItems} more results
            </div>
          )}
        </div>
      )}
    </ToolCallShell>
  );
}
