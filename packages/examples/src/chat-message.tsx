"use client";

import {
  ChatUserMessage,
  ChatAssistantMessage,
} from "@polpo-ai/chat";
import type { ChatMessageItemData } from "@polpo-ai/chat";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const userMsg: ChatMessageItemData = {
  id: "u1",
  role: "user",
  content: "Can you add a users table with email and role fields?",
  ts: new Date(Date.now() - 120000).toISOString(),
};

const userMsgWithFile: ChatMessageItemData = {
  id: "u2",
  role: "user",
  content: [
    { type: "text", text: "Here's my schema, please update it" },
    { type: "file", file_id: "workspace/schema.prisma" } as any,
  ],
  ts: new Date(Date.now() - 90000).toISOString(),
};

const assistantMsg: ChatMessageItemData = {
  id: "a1",
  role: "assistant",
  content:
    "I'll add the users table with email validation and a role enum. Let me update your schema and run the migration.",
  ts: new Date(Date.now() - 60000).toISOString(),
  toolCalls: [
    {
      id: "t1",
      name: "write",
      state: "completed",
      arguments: { path: "prisma/schema.prisma" },
    } as any,
    {
      id: "t2",
      name: "bash",
      state: "completed",
      arguments: { command: "npx prisma migrate dev" },
      result:
        "Migration applied: add_users_table\n\nYour database is now in sync.",
    } as any,
  ],
};

const assistantMsgPlain: ChatMessageItemData = {
  id: "a2",
  role: "assistant",
  content:
    "The migration has been applied successfully. Your `users` table now has `id`, `email`, `role`, `createdAt`, and `updatedAt` columns. The `email` field has a unique constraint and the `role` field defaults to `USER`.",
  ts: new Date(Date.now() - 30000).toISOString(),
};

/* ------------------------------------------------------------------ */
/*  Example                                                            */
/* ------------------------------------------------------------------ */

export default function ChatMessageExample() {
  return (
    <div className="space-y-2">
      <ChatUserMessage msg={userMsg} />
      <ChatAssistantMessage
        msg={assistantMsg}
        agentName="Coder"
      />
      <ChatUserMessage msg={userMsgWithFile} />
      <ChatAssistantMessage msg={assistantMsgPlain} />
    </div>
  );
}
