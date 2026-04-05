"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { useChat, type UseChatReturn } from "@polpo-ai/react";
import { useFiles } from "@polpo-ai/react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ChatProviderProps {
  /** Resume an existing session by ID. */
  sessionId?: string;
  /** Target a specific agent for direct conversation. */
  agent?: string;
  /** Called when a new session is created (first message). */
  onSessionCreated?: (id: string) => void;
  /** Called after each stream update (e.g. scroll-to-bottom). */
  onUpdate?: () => void;
  children: ReactNode;
}

export interface ChatContextValue extends UseChatReturn {
  /** Upload a file attachment (delegates to useFiles). */
  uploadFile: (
    destPath: string,
    file: File | Blob,
    filename: string,
  ) => Promise<{ uploaded: { name: string; size: number }[]; count: number }>;
  /** Whether a file upload is in progress. */
  isUploading: boolean;
}

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

export const ChatContext = createContext<ChatContextValue | null>(null);

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function ChatProvider({
  sessionId,
  agent,
  onSessionCreated,
  onUpdate,
  children,
}: ChatProviderProps) {
  const chat = useChat({
    sessionId,
    agent,
    onSessionCreated,
    onUpdate,
  });

  const { uploadFile, isUploading } = useFiles();

  const value: ChatContextValue = {
    ...chat,
    uploadFile,
    isUploading,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

/* ------------------------------------------------------------------ */
/*  Consumer hook                                                      */
/* ------------------------------------------------------------------ */

export function useChatContext(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChatContext must be used within a <ChatProvider>");
  }
  return ctx;
}
