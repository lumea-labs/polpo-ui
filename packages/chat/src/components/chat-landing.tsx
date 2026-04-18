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
  /** Called when the first message creates a session (fires mid-stream).
   *  If you want to navigate on new-session creation, prefer `onFinish` so the
   *  stream completes before the route (and component tree) changes. */
  onSessionCreated?: (sessionId: string) => void;
  /** Called when the assistant stream finishes. Safer than `onSessionCreated`
   *  for post-stream navigation — the component stays mounted for the full
   *  response. */
  onFinish?: (result: unknown) => void;
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
}: Omit<ChatLandingProps, "agent" | "onSessionCreated" | "onFinish">) {
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
  onFinish,
  ...rest
}: ChatLandingProps) {
  return (
    <ChatProvider agent={agent} onSessionCreated={onSessionCreated} onFinish={onFinish}>
      <ChatLandingInner {...rest} />
    </ChatProvider>
  );
}
