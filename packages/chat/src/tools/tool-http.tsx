"use client";

import type { ToolCallEvent } from "@polpo-ai/sdk";
import { Globe } from "lucide-react";
import { ToolCallShell } from "./tool-call-shell";

/** HTTP fetch/download/search_web tool — shows URL and response preview */
export function ToolHttp({ tool }: { tool: ToolCallEvent }) {
  const url = (tool.arguments?.url) as string | undefined;
  const method = (tool.arguments?.method as string)?.toUpperCase() || "GET";
  const summary = url ? `${method} ${url}` : null;

  return (
    <ToolCallShell tool={tool} icon={Globe} label={tool.name === "search_web" ? "Search Web" : "HTTP"} summary={summary}>
      {tool.result && (
        <pre className="m-0 px-2.5 py-2 text-[11px] leading-normal font-mono text-gray-600 bg-gray-50 whitespace-pre-wrap break-all max-h-[180px] overflow-y-auto">
          {tool.result.slice(0, 500)}{tool.result.length > 500 ? "\n…" : ""}
        </pre>
      )}
    </ToolCallShell>
  );
}
