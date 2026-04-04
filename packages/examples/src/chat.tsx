"use client";

import {
  ChatUserMessage,
  ChatAssistantMessage,
  ChatTyping,
} from "@polpo-ai/chat";
import type { ChatMessageItemData } from "@polpo-ai/chat";
import { ArrowUp, Plus } from "lucide-react";

/**
 * This preview shows the messages + input composition.
 */

const messages: ChatMessageItemData[] = [
  {
    id: "u1",
    role: "user",
    content: "Set up a REST API with Express and TypeScript",
    ts: new Date(Date.now() - 180000).toISOString(),
  },
  {
    id: "a1",
    role: "assistant",
    content:
      "I'll scaffold an Express + TypeScript project with a proper folder structure, error handling middleware, and a health check endpoint. Let me start by initializing the project.",
    ts: new Date(Date.now() - 120000).toISOString(),
    toolCalls: [
      {
        id: "t1",
        name: "bash",
        state: "completed",
        arguments: { command: "mkdir -p src/routes src/middleware && npm init -y" },
        result: "Wrote to /workspace/package.json",
      } as any,
      {
        id: "t2",
        name: "write",
        state: "completed",
        arguments: { path: "src/index.ts" },
      } as any,
    ],
  },
  {
    id: "u2",
    role: "user",
    content: "Add a /api/users endpoint with CRUD operations",
    ts: new Date(Date.now() - 60000).toISOString(),
  },
  {
    id: "a2",
    role: "assistant",
    content: "",
    ts: new Date(Date.now() - 5000).toISOString(),
    toolCalls: [
      {
        id: "t3",
        name: "write",
        state: "completed",
        arguments: { path: "src/routes/users.ts" },
      } as any,
    ],
  },
];

export default function ChatExample() {
  return (
    <div className="flex flex-col h-[500px] border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
      {/* Note */}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        <ChatUserMessage msg={messages[0]} />
        <ChatAssistantMessage msg={messages[1]} agentName="Coder" />
        <ChatUserMessage msg={messages[2]} />
        <ChatAssistantMessage msg={messages[3]} agentName="Coder" />
        <div className="px-6 pt-4 pb-6">
          <div className="max-w-3xl mx-auto">
            <ChatTyping />
          </div>
        </div>
      </div>

      {/* Static input mock */}
      <div className="shrink-0">
        <div className="w-full px-6 py-3">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl border border-gray-200 shadow-sm bg-gray-50">
              <div className="px-5 pt-4 pb-2">
                <span className="text-sm text-gray-400">Type a message...</span>
              </div>
              <div className="flex items-center justify-between px-3 pb-3">
                <button
                  type="button"
                  className="flex items-center justify-center size-8 rounded-lg text-gray-400"
                  aria-label="Attach file"
                >
                  <Plus className="size-4" />
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center size-8 rounded-lg bg-gray-900 text-white"
                  aria-label="Send"
                >
                  <ArrowUp className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
