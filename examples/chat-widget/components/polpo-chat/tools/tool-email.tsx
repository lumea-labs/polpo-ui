"use client";

import type { ToolCallEvent } from "@polpo-ai/sdk";
import { Mail } from "lucide-react";
import { ToolCallShell } from "./tool-call-shell";

/** Email send tool — shows recipient, subject, and body preview */
export function ToolEmail({ tool }: { tool: ToolCallEvent }) {
  const to = (tool.arguments?.to || tool.arguments?.recipient) as string | undefined;
  const subject = (tool.arguments?.subject) as string | undefined;
  const body = (tool.arguments?.body || tool.arguments?.content) as string | undefined;
  const summary = to ? `→ ${to}` : null;

  return (
    <ToolCallShell tool={tool} icon={Mail} label="Email" summary={summary}>
      <div className="bg-p-bg px-2.5 py-2 text-xs max-h-[180px] overflow-y-auto">
        {subject && (
          <div className="mb-1">
            <span className="text-p-ink-3">Subject: </span>
            <span className="text-p-ink font-medium">{subject}</span>
          </div>
        )}
        {to && (
          <div className="mb-1.5">
            <span className="text-p-ink-3">To: </span>
            <span className="text-p-ink-2">{to}</span>
          </div>
        )}
        {body && (
          <p className="m-0 text-p-ink-2 leading-relaxed whitespace-pre-wrap">
            {body.slice(0, 300)}{body.length > 300 ? "…" : ""}
          </p>
        )}
      </div>
    </ToolCallShell>
  );
}
