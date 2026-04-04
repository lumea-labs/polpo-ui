"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAgents } from "@polpo-ai/react";
import { Chat, ChatAgentSelector, ChatInput } from "@polpo-ai/chat";

function LandingView({
  agents,
  selectedAgent,
  onAgentChange,
}: {
  agents: ReturnType<typeof useAgents>["agents"];
  selectedAgent: string | undefined;
  onAgentChange: (name: string) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">New workspace</h1>
        <p className="text-sm text-[var(--ink-3)] mb-8">Describe what you want to work on.</p>

        <div className="flex justify-center mb-4">
          <ChatAgentSelector
            agents={agents}
            selected={selectedAgent}
            onSelect={onAgentChange}
            fallbackLabel="Auto (Orchestrator)"
          />
        </div>

        <ChatInput placeholder="What are you working on?" />
      </div>
    </div>
  );
}

function ConversationView() {
  return <ChatInput placeholder="Type a message..." />;
}

function NewChatInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { agents } = useAgents();
  const agentFromUrl = searchParams.get("agent") || undefined;
  const [selectedAgent, setSelectedAgent] = useState<string | undefined>(agentFromUrl);
  const activeAgent = selectedAgent ?? agentFromUrl ?? agents?.[0]?.name;

  return (
    <Chat
      agent={activeAgent}
      onSessionCreated={(id) => router.replace(`/chat/${id}`)}
      className="h-screen"
    >
      {({ hasMessages }) =>
        hasMessages ? (
          <ConversationView />
        ) : (
          <LandingView
            agents={agents}
            selectedAgent={selectedAgent}
            onAgentChange={setSelectedAgent}
          />
        )
      }
    </Chat>
  );
}

export default function NewChatPage() {
  return (
    <Suspense>
      <NewChatInner />
    </Suspense>
  );
}
