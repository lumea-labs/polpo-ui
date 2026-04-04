"use client";

import { useState } from "react";
import { ChatAgentSelector } from "@polpo-ai/chat";

const mockAgents = [
  { name: "coder", role: "Full-stack developer", identity: { displayName: "Coder" } },
  { name: "writer", role: "Technical writer", identity: { displayName: "Writer" } },
  { name: "reviewer", role: "Code reviewer", identity: { displayName: "Reviewer" } },
  { name: "devops", role: "Infrastructure engineer", identity: { displayName: "DevOps" } },
] as any[];

export default function ChatAgentSelectorExample() {
  const [selected, setSelected] = useState<string>("coder");

  return (
    <div className="p-4">
      <p className="text-xs font-medium text-gray-500 mb-3">
        Click to open the agent dropdown
      </p>
      <ChatAgentSelector
        agents={mockAgents}
        selected={selected}
        onSelect={(name) => setSelected(name)}
      />
      <p className="mt-3 text-xs text-gray-400">
        Selected: <span className="font-medium text-gray-600">{selected}</span>
      </p>
    </div>
  );
}
