"use client";

import { forwardRef, type ReactNode } from "react";
import { ChatProvider } from "./chat-provider";
import { ChatMessages, type ChatMessagesHandle } from "./chat-messages";
import { ChatMessage, type ChatMessageProps } from "./chat-message";

// ── Props ──

export interface ChatProps {
  /** Session ID — omit for new chats */
  sessionId?: string;
  /** Agent name for completions */
  agent?: string;
  /** Called when a new session is created */
  onSessionCreated?: (sessionId: string) => void;
  /** Called on each stream update (useful for external scroll control) */
  onUpdate?: () => void;
  /** Custom message renderer — if omitted, uses ChatMessage with defaults */
  renderMessage?: (msg: ChatMessageProps["msg"], index: number, isLast: boolean, isStreaming: boolean) => ReactNode;
  /** Avatar ReactNode shown on assistant messages */
  avatar?: ReactNode;
  /** Agent display name shown on assistant messages */
  agentName?: string;
  /** Streamdown components override for code blocks etc. */
  streamdownComponents?: Record<string, unknown>;
  /** Number of skeleton items while loading */
  skeletonCount?: number;
  /** Children rendered after the message list (e.g. ChatInput) */
  children?: ReactNode;
  /** Additional className on the outer container */
  className?: string;
}

// ── Component ──

export const Chat = forwardRef<ChatMessagesHandle, ChatProps>(function Chat(
  {
    sessionId,
    agent,
    onSessionCreated,
    onUpdate,
    renderMessage,
    avatar,
    agentName,
    streamdownComponents,
    skeletonCount,
    children,
    className,
  },
  ref,
) {
  const defaultRender = (msg: ChatMessageProps["msg"], _index: number, isLast: boolean, isStreaming: boolean) => (
    <ChatMessage
      msg={msg}
      isLast={isLast}
      isStreaming={isStreaming}
      avatar={avatar}
      agentName={agentName}
      streamdownComponents={streamdownComponents}
    />
  );

  return (
    <ChatProvider
      sessionId={sessionId}
      agent={agent}
      onSessionCreated={onSessionCreated}
      onUpdate={onUpdate}
    >
      <div className={`flex flex-col min-w-0 min-h-0 ${className || ""}`}>
        <ChatMessages
          ref={ref}
          renderItem={renderMessage || defaultRender}
          skeletonCount={skeletonCount}
          className="flex-1"
        />
        {children}
      </div>
    </ChatProvider>
  );
});
