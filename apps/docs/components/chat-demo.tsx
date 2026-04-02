"use client";

import {
  ChatUserMessage,
  ChatAssistantMessage,
} from "@polpo-ai/chat";
import { ToolCallChip } from "@polpo-ai/chat/tools";

const mockToolCalls = [
  { id: "tc1", name: "write", state: "completed", arguments: { path: "src/index.ts" } },
  { id: "tc2", name: "write", state: "completed", arguments: { path: "src/routes/todos.ts" } },
  { id: "tc3", name: "write", state: "completed", arguments: { path: "src/middleware/validate.ts" } },
  { id: "tc4", name: "bash", state: "completed", arguments: { command: "npm test" } },
];

export function ChatDemo() {
  return (
    <div className="border border-fd-border bg-fd-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-fd-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-fd-primary" />
          <span className="font-mono text-xs text-fd-muted-foreground">coder</span>
        </div>
        <span className="font-mono text-[10px] text-fd-muted-foreground/40">session_abc</span>
      </div>

      {/* Messages */}
      <div className="divide-y divide-fd-border/50 p-4 space-y-4">
        <div>
          <ChatUserMessage
            data={{
              id: "msg1",
              role: "user",
              content: "Create a REST API for a todo app with Express and TypeScript",
              ts: new Date().toISOString(),
            }}
          />
        </div>

        <div className="pt-4">
          <ChatAssistantMessage
            data={{
              id: "msg2",
              role: "assistant",
              content: "I'll create a complete Express + TypeScript REST API with CRUD endpoints, validation, and error handling.",
              ts: new Date().toISOString(),
              toolCalls: mockToolCalls,
            }}
            agentName="coder"
          />
        </div>
      </div>

      {/* Input mock */}
      <div className="border-t border-fd-border px-4 py-2.5">
        <span className="text-xs text-fd-muted-foreground/30">Message coder...</span>
      </div>
    </div>
  );
}
