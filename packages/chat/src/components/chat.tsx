"use client";

import { useCallback, type ReactNode } from "react";
import { ChatProvider } from "./chat-provider";
import { useChatContext } from "./chat-provider";
import { ChatMessages, type ChatMessagesHandle } from "./chat-messages";
import { ChatMessage, type ChatMessageProps } from "./chat-message";
import { ChatInput } from "./chat-input";
import { streamdownComponents as defaultStreamdownComponents } from "./streamdown-code";

// ── Props ──

export interface ChatRenderContext {
  hasMessages: boolean;
}

export interface ChatProps {
  /** Session ID — omit for new chats */
  sessionId?: string;
  /** Agent name for completions */
  agent?: string;
  /** Called when a new session is created (first message). Note: fires mid-stream.
   *  If you want to navigate on new-session creation, prefer `onFinish` so the
   *  stream completes before the route (and component tree) changes. */
  onSessionCreated?: (sessionId: string) => void;
  /** Called when the assistant stream finishes. Safer than `onSessionCreated`
   *  for post-stream navigation — the component stays mounted for the full
   *  response. */
  onFinish?: (result: unknown) => void;
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
  /** Placeholder text for the default input */
  inputPlaceholder?: string;
  /** Hint text below the default input */
  inputHint?: string;
  /** Whether file attachments are enabled on the default input (default: true) */
  allowAttachments?: boolean;
  /** Children rendered after the message list — replaces the default ChatInput.
   *  Can be a render function receiving `{ hasMessages }` for conditional rendering. */
  children?: ReactNode | ((ctx: ChatRenderContext) => ReactNode);
  /** Additional className on the outer container */
  className?: string;
}

// ── Inner component (needs context) ──

function ChatInner({
  ref,
  renderMessage,
  avatar,
  agentName,
  streamdownComponents,
  skeletonCount,
  inputPlaceholder,
  inputHint,
  allowAttachments,
  children,
  className,
}: Omit<ChatProps, "sessionId" | "agent" | "onSessionCreated" | "onFinish" | "onUpdate"> & {
  ref?: React.Ref<ChatMessagesHandle>;
}) {
  const { messages } = useChatContext();
  const hasMessages = messages.length > 0;
  const hasChildren = children !== undefined && children !== null;
  const isRenderFunction = typeof children === "function";

  const defaultRender = useCallback(
    (msg: ChatMessageProps["msg"], _index: number, isLast: boolean, isStreaming: boolean) => (
      <ChatMessage
        msg={msg}
        isLast={isLast}
        isStreaming={isStreaming}
        avatar={avatar}
        agentName={agentName}
        streamdownComponents={(streamdownComponents ?? defaultStreamdownComponents) as Record<string, unknown>}
      />
    ),
    [avatar, agentName, streamdownComponents],
  );

  // Resolve children content
  let content: ReactNode;
  if (isRenderFunction) {
    content = children({ hasMessages });
  } else if (hasChildren) {
    content = children;
  } else {
    content = (
      <ChatInput
        placeholder={inputPlaceholder}
        hint={inputHint}
        allowAttachments={allowAttachments}
      />
    );
  }

  // When using render function and no messages yet, skip the message list
  // (landing page pattern)
  if (isRenderFunction && !hasMessages) {
    return (
      <div className={`flex flex-col min-w-0 min-h-0 ${className || ""}`}>
        {content}
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-w-0 min-h-0 ${className || ""}`}>
      <ChatMessages
        ref={ref}
        renderItem={renderMessage || defaultRender}
        skeletonCount={skeletonCount}
        className="flex-1"
      />
      {content}
    </div>
  );
}

// ── Public component ──

export function Chat({
  sessionId,
  agent,
  onSessionCreated,
  onFinish,
  onUpdate,
  ref,
  ...rest
}: ChatProps & { ref?: React.Ref<ChatMessagesHandle> }) {
  return (
    <ChatProvider
      sessionId={sessionId}
      agent={agent}
      onSessionCreated={onSessionCreated}
      onFinish={onFinish}
      onUpdate={onUpdate}
    >
      <ChatInner ref={ref} {...rest} />
    </ChatProvider>
  );
}
