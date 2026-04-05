"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAgents } from "@polpo-ai/react";
import {
  Chat,
  ChatSuggestions,
  ChatAgentSelector,
  ChatInput,
  useChatContext,
} from "@polpo-ai/chat";
import { Sparkles, Workflow, CalendarCheck, FileBarChart } from "lucide-react";
import type { ChatSuggestion } from "@polpo-ai/chat";

const suggestions: ChatSuggestion[] = [
  { icon: <Sparkles size={14} />, text: "Automate a repetitive task" },
  { icon: <Workflow size={14} />, text: "Build an agent workflow" },
  { icon: <CalendarCheck size={14} />, text: "Plan this week's sprint" },
  { icon: <FileBarChart size={14} />, text: "Generate a performance report" },
];

function LandingView({
  agents,
  selectedAgent,
  onAgentChange,
}: {
  agents: ReturnType<typeof useAgents>["agents"];
  selectedAgent: string | undefined;
  onAgentChange: (name: string) => void;
}) {
  const { sendMessage } = useChatContext();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="max-w-3xl w-full text-center stagger-children">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] text-xs font-medium mb-6">
          <Sparkles className="size-3" />
          Built with @polpo-ai/chat
        </div>

        {/* Heading */}
        <h1 className="text-5xl font-bold tracking-tight mb-3 whitespace-nowrap">
          What can I help with<span className="text-[var(--accent)]">?</span>
        </h1>

        <p className="text-[var(--ink-3)] text-base mb-8 max-w-md mx-auto leading-relaxed">
          Your AI team is ready.
        </p>

        {/* Agent selector */}
        <div className="flex justify-center mb-5">
          <ChatAgentSelector
            agents={agents}
            selected={selectedAgent}
            onSelect={onAgentChange}
            fallbackLabel="Auto (Orchestrator)"
          />
        </div>

        {/* Input */}
        <ChatInput
          placeholder="Describe what you need..."
          className="[&_textarea]:text-base [&_textarea]:px-6 [&_textarea]:pt-5 [&_textarea]:pb-3"
        />

        {/* Suggestions */}
        <ChatSuggestions
          suggestions={suggestions}
          onSelect={(text) => sendMessage(text)}
          columns={2}
          className="mt-5 max-w-md mx-auto [&_button]:px-3 [&_button]:py-2 [&_button]:text-[11px] [&_button]:rounded-lg [&_button]:gap-1.5"
        />
      </div>
    </div>
  );
}

function ConversationView() {
  return <ChatInput placeholder="Type a message..." hint="AI can make mistakes. Review important information." />;
}

export default function NewChatPage() {
  const router = useRouter();
  const { agents } = useAgents();
  const [selectedAgent, setSelectedAgent] = useState<string | undefined>();
  const activeAgent = selectedAgent || agents?.[0]?.name;

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
