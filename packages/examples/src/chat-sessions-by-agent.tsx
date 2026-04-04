"use client";

import { ChatSessionsByAgent } from "@polpo-ai/chat";

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
  {
    id: "s5",
    title: "Fix CORS headers on /api/upload",
    agent: "coder",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
] as any[];

const mockAgents = [
  { name: "coder", role: "Full-stack developer", identity: { displayName: "Coder" } },
  { name: "writer", role: "Technical writer", identity: { displayName: "Writer" } },
  { name: "reviewer", role: "Code reviewer", identity: { displayName: "Reviewer" } },
] as any[];

export default function ChatSessionsByAgentExample() {
  return (
    <div className="max-w-sm">
      <ChatSessionsByAgent
        sessions={mockSessions}
        agents={mockAgents}
        onSelect={(agentName) => alert(`Selected agent: ${agentName}`)}
      />
    </div>
  );
}
