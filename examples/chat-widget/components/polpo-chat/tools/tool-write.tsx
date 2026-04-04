"use client";

import type { ToolCallEvent } from "@polpo-ai/sdk";
import { Pen } from "lucide-react";
import { ToolCallShell } from "./tool-call-shell";

/** Write/Edit tool — shows file path and a diff-like preview */
export function ToolWrite({ tool }: { tool: ToolCallEvent }) {
  const path = (tool.arguments?.path || tool.arguments?.file_path) as string | undefined;
  const content = (tool.arguments?.content || tool.arguments?.new_string) as string | undefined;
  const preview = content?.slice(0, 200);

  return (
    <ToolCallShell tool={tool} icon={Pen} label={tool.name === "edit" ? "Edit" : "Write"} summary={path}>
      {preview && (
        <div className="bg-p-bg max-h-[180px] overflow-y-auto">
          <pre className="m-0 px-2.5 py-2 text-[11px] leading-normal font-mono text-p-green whitespace-pre-wrap break-all">
            {preview}{content && content.length > 200 ? "\n…" : ""}
          </pre>
        </div>
      )}
    </ToolCallShell>
  );
}
