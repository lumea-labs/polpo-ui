"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type KeyboardEvent,
  type ChangeEvent,
  type DragEvent,
  type ReactNode,
} from "react";
import { ArrowUp, Square, Plus, X, Upload } from "lucide-react";
import { useChatContext } from "./chat-provider";
import { useSubmitHandler } from "../hooks/use-submit-handler";
import { useDocumentDrag } from "../hooks/use-document-drag";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface PendingFile {
  id: string;
  file: File;
  url: string;
}

export interface ChatInputProps {
  /** Placeholder text for the textarea */
  placeholder?: string;
  /** Hint text below the input */
  hint?: string;
  /** Whether file attachments are enabled (default: true) */
  allowAttachments?: boolean;
  /** Additional className on the outer wrapper */
  className?: string;
  /** Custom submit button renderer */
  renderSubmit?: (props: { isStreaming: boolean; onStop: () => void }) => ReactNode;
}


/* ------------------------------------------------------------------ */
/*  Shared input logic                                                 */
/* ------------------------------------------------------------------ */

function useChatInputState() {
  const { sendMessage, isStreaming, abort, uploadFile } = useChatContext();
  const handleSubmit = useSubmitHandler(sendMessage, uploadFile);
  const dragging = useDocumentDrag();

  const [text, setText] = useState("");
  const [files, setFiles] = useState<PendingFile[]>([]);
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const filesRef = useRef(files);
  filesRef.current = files;
  const textRef = useRef(text);
  textRef.current = text;

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [text]);

  // Add files helper
  const addFiles = useCallback((incoming: FileList | File[]) => {
    const arr = Array.from(incoming);
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.file.name));
      const fresh = arr.filter((f) => !existing.has(f.name));
      return [
        ...prev,
        ...fresh.map((file) => ({
          id: Math.random().toString(36).slice(2),
          file,
          url: URL.createObjectURL(file),
        })),
      ];
    });
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const f = prev.find((p) => p.id === id);
      if (f) URL.revokeObjectURL(f.url);
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  // Cleanup blob URLs on unmount via ref (avoids stale closure)
  useEffect(
    () => () => {
      filesRef.current.forEach((f) => URL.revokeObjectURL(f.url));
    },
    [],
  );

  // Submit — reads from refs for stable callback
  const submit = useCallback(async () => {
    if (isSending) return;
    const trimmed = textRef.current.trim();
    const currentFiles = filesRef.current;
    if (!trimmed && currentFiles.length === 0) return;

    setIsSending(true);
    try {
      await handleSubmit({
        text: trimmed,
        files: currentFiles.map((f) => ({ url: f.url, filename: f.file.name })),
      });
      setText("");
      setFiles([]);
    } finally {
      setIsSending(false);
    }

    setTimeout(() => textareaRef.current?.focus(), 0);
  }, [handleSubmit, isSending]);

  // Keyboard: Enter to send, Shift+Enter for newline
  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        submit();
      }
    },
    [submit],
  );

  // File input change
  const onFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) addFiles(e.target.files);
      e.target.value = "";
    },
    [addFiles],
  );

  // Drop handler
  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles],
  );

  return { text, setText, files, isSending, isStreaming, abort, dragging, textareaRef, fileInputRef, submit, onKeyDown, onFileChange, onDrop, removeFile, addFiles };
}

/* ------------------------------------------------------------------ */
/*  Pending files display                                              */
/* ------------------------------------------------------------------ */

function PendingFiles({ files, removeFile }: { files: PendingFile[]; removeFile: (id: string) => void }) {
  if (files.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 px-4 pt-3">
      {files.map((f) => {
        const isImage = f.file.type.startsWith("image/");
        return (
          <div
            key={f.id}
            className="relative flex items-center gap-2 bg-muted/50 border border-border rounded-lg px-2.5 py-1.5 text-xs"
          >
            {isImage ? (
              <img src={f.url} alt={f.file.name} className="size-8 rounded object-cover" />
            ) : (
              <div className="size-8 rounded bg-accent flex items-center justify-center text-muted-foreground text-[10px] font-mono uppercase">
                {f.file.name.split(".").pop()?.slice(0, 4)}
              </div>
            )}
            <span className="truncate max-w-[120px]">{f.file.name}</span>
            <button
              type="button"
              onClick={() => removeFile(f.id)}
              className="size-4 rounded-full bg-border/50 flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              <X className="size-2.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ChatInput — standard (padded, centered, max-w-3xl)                 */
/* ------------------------------------------------------------------ */

export function ChatInput({
  placeholder = "Type a message…",
  hint,
  allowAttachments = true,
  className,
  renderSubmit,
}: ChatInputProps) {
  const s = useChatInputState();

  return (
    <div className={`shrink-0 ${className || ""}`}>
      <div className="w-full px-6 py-3">
        <div className="max-w-3xl mx-auto relative">
          {allowAttachments && s.dragging && (
            <div className="absolute inset-0 z-10 bg-primary/5 border-2 border-dashed border-primary rounded-2xl flex items-center justify-center gap-2 text-primary text-sm font-medium pointer-events-none">
              <Upload className="size-4" /> Drop files to attach
            </div>
          )}
          <div
            className="rounded-2xl border border-border shadow-sm focus-within:border-primary focus-within:shadow-md transition-all bg-muted/50"
            onDrop={allowAttachments ? s.onDrop : undefined}
            onDragOver={allowAttachments ? (e) => e.preventDefault() : undefined}
          >
            <PendingFiles files={s.files} removeFile={s.removeFile} />
            <textarea
              ref={s.textareaRef}
              value={s.text}
              onChange={(e) => s.setText(e.target.value)}
              onKeyDown={s.onKeyDown}
              placeholder={placeholder}
              aria-label={placeholder}
              rows={1}
              className="w-full resize-none bg-transparent px-5 pt-4 pb-2 text-sm outline-none placeholder:text-muted-foreground"
            />
            <div className="flex items-center justify-between px-3 pb-3">
              {allowAttachments ? (
                <button type="button" onClick={() => s.fileInputRef.current?.click()} className="flex items-center justify-center size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" aria-label="Attach file">
                  <Plus className="size-4" />
                </button>
              ) : <div />}
              {renderSubmit ? renderSubmit({ isStreaming: s.isStreaming, onStop: s.abort }) : (
                <button type="button" onClick={s.isStreaming ? s.abort : s.submit} disabled={s.isSending && !s.isStreaming} className="flex items-center justify-center size-8 rounded-lg bg-foreground text-background hover:bg-foreground/90 disabled:opacity-40 transition-colors" aria-label={s.isStreaming ? "Stop" : "Send"}>
                  {s.isStreaming ? <Square className="size-3.5" /> : <ArrowUp className="size-4" />}
                </button>
              )}
            </div>
          </div>
          {allowAttachments && <input ref={s.fileInputRef} type="file" multiple onChange={s.onFileChange} className="hidden" />}
          {hint && <p className="text-center text-xs text-muted-foreground mt-2">{hint}</p>}
        </div>
      </div>
    </div>
  );
}

