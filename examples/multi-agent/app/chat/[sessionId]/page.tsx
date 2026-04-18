"use client";

import { use } from "react";
import { useSessions, useAgents } from "@polpo-ai/react";
import { Chat, ChatInput, ChatAskUser, useChatContext } from "@polpo-ai/chat";

function ChatInputWithAskUser() {
  const { pendingToolCall, sendMessage } = useChatContext();

  if (
    pendingToolCall &&
    pendingToolCall.toolName === "ask_user_question" &&
    (pendingToolCall.arguments?.questions as unknown[])?.length > 0
  ) {
    return (
      <div className="shrink-0 px-6 py-3">
        <div className="max-w-3xl mx-auto animate-fade-in">
          <ChatAskUser
            questions={pendingToolCall.arguments.questions as any}
            onSubmit={(answers) => {
              sendMessage(JSON.stringify({ answers }));
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <ChatInput
      placeholder="Type a message..."
      className="[&>div>div]:border-[var(--border)] [&>div>div]:focus-within:border-[var(--accent)]"
    />
  );
}

export default function ChatPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);
  const { sessions } = useSessions();
  const { agents } = useAgents();
  const agentName = sessions?.find((s) => s.id === sessionId)?.agent;
  const agent = agentName ? agents?.find((a) => a.name === agentName) : undefined;
  const displayName = agent?.identity?.displayName || agent?.name || agentName || "Assistant";

  return (
    <Chat
      sessionId={sessionId}
      agent={agentName}
      agentName={displayName}
      className="h-screen"
    >
      <ChatInputWithAskUser />
    </Chat>
  );
}
