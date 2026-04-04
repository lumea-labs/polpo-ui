"use client";

import {
  memo,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { ContentPart, ToolCallEvent } from "@polpo-ai/sdk";
import { Copy, Check, FileCode } from "lucide-react";
import { Streamdown } from "streamdown";
import { getTextContent } from "@/lib/polpo-chat/get-text-content";
import { relativeTime } from "@/lib/polpo-chat/relative-time";
import { ToolCallChip } from "@/components/polpo-chat/tools";
import { ChatTyping } from "./chat-typing";

/** Components override accepted by Streamdown — use Record for flexibility. */
type StreamdownComponentsProp = Record<string, unknown>;

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ChatMessageItemData {
  id?: string;
  role: "user" | "assistant";
  content: string | ContentPart[];
  ts?: string;
  toolCalls?: ToolCallEvent[];
}

export interface ChatMessageProps {
  msg: ChatMessageItemData;
  isLast?: boolean;
  isStreaming?: boolean;
  avatar?: ReactNode;
  agentName?: string;
  streamdownComponents?: StreamdownComponentsProp;
}

/* ------------------------------------------------------------------ */
/*  CopyButton                                                         */
/* ------------------------------------------------------------------ */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [text]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy message"
      className="inline-flex items-center justify-center rounded-md p-1 text-[var(--ink-3)] hover:text-[var(--ink)] hover:bg-[var(--warm)] transition-colors"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  File / image content parts                                         */
/* ------------------------------------------------------------------ */

function ContentParts({
  parts,
  align,
}: {
  parts: ContentPart[];
  align: "start" | "end";
}) {
  const nonText = parts.filter((p) => p.type !== "text");
  if (nonText.length === 0) return null;

  return (
    <div
      className={`flex flex-wrap gap-1.5 mb-1 ${align === "end" ? "justify-end" : ""}`}
    >
      {nonText.map((part, i) => {
        if (part.type === "image_url") {
          return (
            <a
              key={i}
              href={(part as { type: "image_url"; image_url: { url: string } }).image_url.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg overflow-hidden max-w-[200px]"
            >
              <img
                src={(part as { type: "image_url"; image_url: { url: string } }).image_url.url}
                alt=""
                className="w-full h-auto block"
              />
            </a>
          );
        }
        if (part.type === "file") {
          const fileId = (part as { type: "file"; file_id: string }).file_id;
          const fn = fileId.split("/").pop() || fileId;
          return (
            <a
              key={i}
              href={`/api/polpo/files/read?path=${encodeURIComponent(fileId)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-[var(--warm)] border border-[var(--line)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--ink)] hover:border-[var(--ink-3)] transition-colors"
            >
              <FileCode size={13} />
              <span className="truncate max-w-[120px]">{fn}</span>
            </a>
          );
        }
        return null;
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ChatUserMessage                                                    */
/* ------------------------------------------------------------------ */

export const ChatUserMessage = memo(
  function ChatUserMessage({
    msg,
    isLast,
    isStreaming,
  }: {
    msg: ChatMessageItemData;
    isLast?: boolean;
    isStreaming?: boolean;
  }) {
    const text = getTextContent(msg.content);

    return (
      <div className="w-full px-6 py-3">
        <div className="max-w-3xl mx-auto">
          <div className="group flex w-full flex-col gap-2 ml-auto justify-end">
            {/* File/image parts */}
            {Array.isArray(msg.content) && (
              <ContentParts parts={msg.content} align="end" />
            )}

            {/* Message bubble */}
            <div className="w-fit max-w-[80%] ml-auto rounded-[18px_18px_4px_18px] bg-[var(--warm)] px-4 py-3">
              {text ? (
                <p className="whitespace-pre-wrap break-words text-[var(--ink)]">
                  {text}
                </p>
              ) : null}
            </div>

            {/* Hover actions: timestamp + copy */}
            {text && (!isLast || !isStreaming) && (
              <div className="flex items-center justify-end gap-1.5 h-6">
                <span className="text-[11px] text-[var(--ink-3)] opacity-0 group-hover:opacity-100 transition-opacity">
                  {msg.ts ? relativeTime(msg.ts) : ""}
                </span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <CopyButton text={text} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
  (prev, next) =>
    prev.isLast === next.isLast &&
    prev.isStreaming === next.isStreaming &&
    prev.msg.id === next.msg.id &&
    prev.msg.content === next.msg.content,
);

/* ------------------------------------------------------------------ */
/*  ChatAssistantMessage                                               */
/* ------------------------------------------------------------------ */

export const ChatAssistantMessage = memo(
  function ChatAssistantMessage({
    msg,
    isLast,
    isStreaming,
    avatar,
    agentName,
    streamdownComponents: components,
  }: {
    msg: ChatMessageItemData;
    isLast?: boolean;
    isStreaming?: boolean;
    avatar?: ReactNode;
    agentName?: string;
    streamdownComponents?: StreamdownComponentsProp;
  }) {
    const text = getTextContent(msg.content);
    const filteredToolCalls = msg.toolCalls?.filter(
      (tc) => tc.name !== "ask_user_question",
    );

    return (
      <div className="w-full px-6 pt-4 pb-6">
        <div className="max-w-3xl mx-auto">
          <div className="group flex w-full flex-col gap-2">
            {/* Avatar + name header */}
            {(avatar || agentName) && (
              <div className="flex items-center gap-2 mb-1">
                {avatar}
                {agentName && (
                  <span className="font-display text-[13px] font-semibold text-[var(--ink)]">
                    {agentName}
                  </span>
                )}
              </div>
            )}

            {/* Tool calls */}
            {filteredToolCalls && filteredToolCalls.length > 0 && (
              <div className="flex flex-col gap-1 mb-1">
                {filteredToolCalls.map((tc) => (
                  <ToolCallChip key={tc.id} tool={tc} />
                ))}
              </div>
            )}

            {/* File/image parts */}
            {Array.isArray(msg.content) && (
              <ContentParts parts={msg.content} align="start" />
            )}

            {/* Text content or typing dots */}
            <div className="w-full text-[var(--ink)]">
              {text ? (
                components ? (
                  <Streamdown
                    className="size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                    components={components as any}
                  >
                    {text}
                  </Streamdown>
                ) : (
                  <p className="whitespace-pre-wrap break-words">{text}</p>
                )
              ) : (
                !filteredToolCalls?.length && <ChatTyping className="pt-1" />
              )}
            </div>

            {/* Hover action: copy */}
            {text && (!isLast || !isStreaming) && (
              <div className="h-6 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <CopyButton text={text} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
  (prev, next) =>
    prev.avatar === next.avatar &&
    prev.agentName === next.agentName &&
    prev.isLast === next.isLast &&
    prev.isStreaming === next.isStreaming &&
    prev.streamdownComponents === next.streamdownComponents &&
    prev.msg.id === next.msg.id &&
    prev.msg.content === next.msg.content &&
    prev.msg.toolCalls?.length === next.msg.toolCalls?.length &&
    JSON.stringify(prev.msg.toolCalls?.map((t) => t.state)) ===
      JSON.stringify(next.msg.toolCalls?.map((t) => t.state)),
);

/* ------------------------------------------------------------------ */
/*  ChatMessage — dispatcher                                           */
/* ------------------------------------------------------------------ */

export const ChatMessage = memo(
  function ChatMessage({
    msg,
    isLast,
    isStreaming,
    avatar,
    agentName,
    streamdownComponents,
  }: ChatMessageProps) {
    if (msg.role === "user") {
      return (
        <ChatUserMessage msg={msg} isLast={isLast} isStreaming={isStreaming} />
      );
    }

    return (
      <ChatAssistantMessage
        msg={msg}
        isLast={isLast}
        isStreaming={isStreaming}
        avatar={avatar}
        agentName={agentName}
        streamdownComponents={streamdownComponents}
      />
    );
  },
  (prev, next) =>
    prev.avatar === next.avatar &&
    prev.agentName === next.agentName &&
    prev.isLast === next.isLast &&
    prev.isStreaming === next.isStreaming &&
    prev.streamdownComponents === next.streamdownComponents &&
    prev.msg.id === next.msg.id &&
    prev.msg.content === next.msg.content &&
    prev.msg.role === next.msg.role &&
    prev.msg.toolCalls?.length === next.msg.toolCalls?.length &&
    JSON.stringify(prev.msg.toolCalls?.map((t) => t.state)) ===
      JSON.stringify(next.msg.toolCalls?.map((t) => t.state)),
);
