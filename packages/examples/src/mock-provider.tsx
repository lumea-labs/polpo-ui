"use client";

import { useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import { ChatContext, type ChatContextValue } from "@polpo-ai/chat";
import type { ChatMessageItemData } from "@polpo-ai/chat";

/**
 * MockChatProvider — drop-in for ChatProvider. Uses the REAL ChatContext
 * so all package components (ChatInput, ChatMessages, Chat) work as-is.
 * No backend, no PolpoProvider, no API key needed.
 */

interface MockChatProviderProps {
  initialMessages?: ChatMessageItemData[];
  mockReply?: (userText: string) => ChatMessageItemData;
  replyDelay?: number;
  /** Called when the first message is sent (like onSessionCreated in real Chat) */
  onFirstMessage?: (text: string) => void;
  children: ReactNode;
}

const defaultMockReply = (_userText: string): ChatMessageItemData => ({
  id: "a-" + Date.now(),
  role: "assistant",
  content: "Done! I've updated the file and ran the tests.\n\n```ts\nexport function hello() {\n  return 'world';\n}\n```",
  ts: new Date().toISOString(),
  toolCalls: [
    { id: "t-" + Date.now(), name: "write", state: "completed", arguments: { path: "src/index.ts" } } as any,
    { id: "t2-" + Date.now(), name: "bash", state: "completed", arguments: { command: "npm test" }, result: "All tests passed" } as any,
  ],
});

export function MockChatProvider({
  initialMessages = [],
  mockReply = defaultMockReply,
  replyDelay = 800,
  onFirstMessage,
  children,
}: MockChatProviderProps) {
  const [messages, setMessages] = useState<ChatMessageItemData[]>(initialMessages);
  const [status, setStatus] = useState<"idle" | "streaming">("idle");
  const didAutoReply = useRef(false);

  // Auto-reply if initialMessages ends with a user message (navigation from landing)
  useEffect(() => {
    if (didAutoReply.current) return;
    const last = initialMessages[initialMessages.length - 1];
    if (last?.role === "user") {
      didAutoReply.current = true;
      setStatus("streaming");
      const text = typeof last.content === "string" ? last.content : "";
      setTimeout(() => {
        setMessages((prev: ChatMessageItemData[]) => [...prev, mockReply(text)]);
        setStatus("idle");
      }, replyDelay);
    }
  }, []);

  const sendMessage = useCallback(async (content: string | any[]) => {
    const text = typeof content === "string" ? content : (content as any[]).filter((p) => p.type === "text").map((p) => p.text).join("");
    if (!text.trim()) return;

    const userMsg: ChatMessageItemData = {
      id: "u-" + Date.now(),
      role: "user",
      content: text,
      ts: new Date().toISOString(),
    };

    setMessages((prev: ChatMessageItemData[]) => {
      if (prev.length === 0 && onFirstMessage) onFirstMessage(text);
      return [...prev, userMsg];
    });
    setStatus("streaming");

    setTimeout(() => {
      setMessages((prev: ChatMessageItemData[]) => [...prev, mockReply(text)]);
      setStatus("idle");
    }, replyDelay);
  }, [mockReply, replyDelay]);

  const value = {
    messages,
    sendMessage,
    sendToolResult: async () => {},
    sessionId: "mock-session",
    setSessionId: async () => {},
    newSession: () => { setMessages([]); setStatus("idle"); },
    status,
    error: null,
    isStreaming: status === "streaming",
    pendingToolCall: null,
    abort: () => setStatus("idle"),
    uploadFile: async () => ({ uploaded: [], count: 0 }),
    isUploading: false,
  } as ChatContextValue;

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export type { MockChatProviderProps };
