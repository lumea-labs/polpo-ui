"use client";

import { useState } from "react";
import { ChatSessionList } from "@polpo-ai/chat";

const mockSessions = [
  {
    id: "s1",
    title: "Add users table to Prisma schema",
    agent: "coder",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "s2",
    title: "Debug authentication middleware",
    agent: "coder",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "s3",
    title: "Write API documentation",
    agent: "writer",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: "s4",
    title: "Review pull request #42",
    agent: "reviewer",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
] as any[];

const mockAgents = [
  { name: "coder", role: "Full-stack developer", identity: { displayName: "Coder" } },
  { name: "writer", role: "Technical writer", identity: { displayName: "Writer" } },
  { name: "reviewer", role: "Code reviewer", identity: { displayName: "Reviewer" } },
] as any[];

export default function ChatSessionListExample() {
  const [activeId, setActiveId] = useState<string>("s1");

  return (
    <div className="max-w-sm">
      <ChatSessionList
        sessions={mockSessions}
        agents={mockAgents}
        activeSessionId={activeId}
        onSelect={(id) => setActiveId(id)}
        onDelete={(id) => alert(`Delete session: ${id}`)}
      />
    </div>
  );
}
