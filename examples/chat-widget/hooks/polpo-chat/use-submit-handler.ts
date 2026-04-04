"use client";

import { useCallback } from "react";
import type { ContentPart } from "@polpo-ai/sdk";

/** Shape of the message emitted by the PromptInput component. */
export interface PromptInputMessage {
  text: string;
  files: { url: string; filename?: string }[];
}

/** Shared submit handler — uploads files via SDK then sends ContentPart[] */
export function useSubmitHandler(
  sendMessage: (content: string | ContentPart[]) => Promise<void>,
  uploadFile: (destPath: string, file: Blob, filename: string) => Promise<unknown>,
) {
  return useCallback(async (message: PromptInputMessage) => {
    const text = message.text.trim();
    const files = message.files || [];
    if (!text && files.length === 0) return;

    if (files.length > 0) {
      const parts: ContentPart[] = [];
      if (text) parts.push({ type: "text", text });
      for (const f of files) {
        const name = f.filename || "upload";
        try {
          const res = await fetch(f.url);
          const blob = await res.blob();
          await uploadFile("workspace", blob, name);
          parts.push({ type: "file", file_id: `workspace/${name}` });
        } catch { /* skip failed uploads */ }
      }
      if (parts.length > 0) sendMessage(parts);
    } else {
      sendMessage(text);
    }
  }, [sendMessage, uploadFile]);
}
