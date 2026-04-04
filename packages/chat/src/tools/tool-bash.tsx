"use client";

import type { ToolCallEvent } from "@polpo-ai/sdk";
import { Terminal } from "lucide-react";
import { ToolCallShell } from "./tool-call-shell";

/** Bash tool — shows command and output */
export function ToolBash({ tool }: { tool: ToolCallEvent }) {
  const command = (tool.arguments?.command) as string | undefined;
  const lines = tool.result?.split("\n") || [];
  const maxLines = 10;
  const truncated = lines.length > maxLines;

  return (
    <ToolCallShell tool={tool} icon={Terminal} label="Bash" summary={command?.slice(0, 60)}>
      <div className="bg-[#1a1a1a] max-h-[220px] overflow-y-auto">
        {command && (
          <div className="px-3 py-1.5 text-[11px] font-mono text-emerald-400 border-b border-white/10">
            <span className="text-gray-500 select-none">$ </span>{command}
          </div>
        )}
        {tool.result && (
          <pre className="m-0 px-3 py-1.5 text-[11px] leading-normal font-mono text-neutral-300 whitespace-pre-wrap break-all">
            {lines.slice(0, maxLines).join("\n")}
            {truncated ? `\n… +${lines.length - maxLines} lines` : ""}
          </pre>
        )}
      </div>
    </ToolCallShell>
  );
}
