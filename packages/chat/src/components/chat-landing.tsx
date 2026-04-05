"use client";

import { type ReactNode } from "react";
import { ChatInput } from "./chat-input";
import { ChatSuggestions, type ChatSuggestion } from "./chat-suggestions";
import { ChatProvider } from "./chat-provider";
import { useChatContext } from "./chat-provider";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ChatLandingProps {
  /** Agent name for new conversations */
  agent?: string;
  /** Called when the first message creates a session */
  onSessionCreated?: (sessionId: string) => void;
  /** Greeting heading */
  greeting?: string;
  /** Subtitle below the greeting */
  subtitle?: string;
  /** Suggestion prompts */
  suggestions?: ChatSuggestion[];
  /** Suggestion grid columns (default: 2) */
  suggestionColumns?: 1 | 2 | 3;
  /** Input placeholder */
  inputPlaceholder?: string;
  /** Input hint text */
  inputHint?: string;
  /** Allow file attachments (default: true) */
  allowAttachments?: boolean;
  /** Custom header content rendered above the input */
  header?: ReactNode;
  /** Additional className on the outer container */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Inner (needs ChatProvider context)                                  */
/* ------------------------------------------------------------------ */

function ChatLandingInner({
  greeting = "How can I help you?",
  subtitle,
  suggestions,
  suggestionColumns,
  inputPlaceholder,
  inputHint,
  allowAttachments,
  header,
  className,
}: Omit<ChatLandingProps, "agent" | "onSessionCreated">) {
  const { sendMessage } = useChatContext();

  return (
    <div className={`flex flex-col items-center justify-center flex-1 px-6 ${className || ""}`}>
      <div className="text-center max-w-3xl w-full">
        {header}

        <h1 className="text-4xl font-semibold tracking-tight mb-2">
          {greeting}
        </h1>

        {subtitle && (
          <p className="text-gray-500 text-sm mb-6">{subtitle}</p>
        )}

        {!subtitle && <div className="mb-7" />}

        <ChatInput
          placeholder={inputPlaceholder}
          hint={inputHint}
          allowAttachments={allowAttachments}
        />

        {suggestions && suggestions.length > 0 && (
          <ChatSuggestions
            suggestions={suggestions}
            onSelect={(text) => sendMessage(text)}
            columns={suggestionColumns}
            className="mt-4 max-w-lg mx-auto"
          />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ChatLanding({
  agent,
  onSessionCreated,
  ...rest
}: ChatLandingProps) {
  return (
    <ChatProvider agent={agent} onSessionCreated={onSessionCreated}>
      <ChatLandingInner {...rest} />
    </ChatProvider>
  );
}
