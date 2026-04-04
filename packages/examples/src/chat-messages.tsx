"use client";

import {
  ChatUserMessage,
  ChatAssistantMessage,
  ChatTyping,
  ChatSkeleton,
} from "@polpo-ai/chat";
import type { ChatMessageItemData } from "@polpo-ai/chat";

const messages: ChatMessageItemData[] = [
  { id: "u1", role: "user", content: "Can you refactor the auth middleware?", ts: new Date(Date.now() - 120000).toISOString() },
  {
    id: "a1", role: "assistant",
    content: "I'll refactor the auth middleware to use a cleaner pattern with early returns and proper error handling. Let me update the file.",
    ts: new Date(Date.now() - 60000).toISOString(),
    toolCalls: [
      { id: "t1", name: "write", state: "completed", arguments: { path: "src/middleware/auth.ts" } } as any,
    ],
  },
  { id: "u2", role: "user", content: "Looks good, now add rate limiting", ts: new Date(Date.now() - 30000).toISOString() },
];

export default function ChatMessagesExample() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium text-gray-400 mb-2 px-2">Messages</p>
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <ChatUserMessage msg={messages[0]} />
          <ChatAssistantMessage msg={messages[1]} agentName="Coder" />
          <ChatUserMessage msg={messages[2]} />
          <div className="px-6 pt-4 pb-6">
            <ChatTyping />
          </div>
        </div>
      </div>
      <div>
        <p className="text-xs font-medium text-gray-400 mb-2 px-2">Loading state</p>
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <ChatSkeleton count={2} />
        </div>
      </div>
    </div>
  );
}
