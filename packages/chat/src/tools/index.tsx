"use client";

import type { ToolCallEvent } from "@polpo-ai/sdk";
import { Wrench } from "lucide-react";
import { ToolCallShell } from "./tool-call-shell";
import { ToolRead } from "./tool-read";
import { ToolWrite } from "./tool-write";
import { ToolBash } from "./tool-bash";
import { ToolSearch } from "./tool-search";
import { ToolHttp } from "./tool-http";
import { ToolEmail } from "./tool-email";
import { ToolAskUser } from "./tool-ask-user";

// ── Tool name → component map ──

const TOOL_COMPONENTS: Record<string, React.ComponentType<{ tool: ToolCallEvent }>> = {
  ask_user_question: ToolAskUser,
  read: ToolRead,
  read_attachment: ToolRead,
  write: ToolWrite,
  edit: ToolWrite,
  bash: ToolBash,
  grep: ToolSearch,
  glob: ToolSearch,
  search_web: ToolHttp,
  http_fetch: ToolHttp,
  http_download: ToolHttp,
  email_send: ToolEmail,
};

// Prefix-based matching for tools like browser_*, memory_*, etc.
const TOOL_PREFIX_COMPONENTS: { prefix: string; component: React.ComponentType<{ tool: ToolCallEvent }> }[] = [
  { prefix: "browser_", component: ToolHttp },
  { prefix: "email_", component: ToolEmail },
  { prefix: "search_", component: ToolSearch },
];

function getToolLabel(name: string) {
  return name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Dispatcher ──

export function ToolCallChip({ tool }: { tool: ToolCallEvent }) {
  // Exact match
  const Exact = TOOL_COMPONENTS[tool.name];
  if (Exact) return <Exact tool={tool} />;

  // Prefix match
  for (const { prefix, component: Prefixed } of TOOL_PREFIX_COMPONENTS) {
    if (tool.name.startsWith(prefix)) return <Prefixed tool={tool} />;
  }

  // Generic fallback
  const summary = tool.arguments
    ? Object.values(tool.arguments).find((v) => typeof v === "string" && v.length > 0) as string | undefined
    : undefined;

  return (
    <ToolCallShell
      tool={tool}
      icon={Wrench}
      label={getToolLabel(tool.name)}
      summary={summary?.slice(0, 80)}
    />
  );
}

// Re-export shell for custom usage
export { ToolCallShell } from "./tool-call-shell";
