"use client";

import { useState, useRef, useEffect, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ToolCall {
  id: string;
  name: string;
  arg: string;
  state: "calling" | "completed" | "error";
  result?: string;
}

interface Attachment {
  name: string;
  type: "file" | "image";
  url?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  ts: string;
  tools?: ToolCall[];
  attachments?: Attachment[];
}

/* ------------------------------------------------------------------ */
/*  Tool icons                                                         */
/* ------------------------------------------------------------------ */

function ToolIcon({ name }: { name: string }) {
  const cls = "h-3.5 w-3.5 shrink-0";
  switch (name) {
    case "bash":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
      );
    case "write":
    case "edit":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" />
        </svg>
      );
    case "read":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      );
    case "search_web":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A8.966 8.966 0 003 12c0-1.97.633-3.794 1.708-5.282" />
        </svg>
      );
    default:
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.384 3.068A1.25 1.25 0 014.5 17.1V6.9a1.25 1.25 0 011.536-1.138l5.384 3.068a1.25 1.25 0 010 2.276z" />
        </svg>
      );
  }
}

/* ------------------------------------------------------------------ */
/*  ToolChip (expandable like the real ToolCallShell)                   */
/* ------------------------------------------------------------------ */

function ToolChip({ tool }: { tool: ToolCall }) {
  const [expanded, setExpanded] = useState(false);
  const isDone = tool.state === "completed";
  const isPending = tool.state === "calling";
  const isError = tool.state === "error";
  const hasResult = isDone && tool.result;

  return (
    <div
      className={`rounded-lg border text-[13px] overflow-hidden ${
        isError
          ? "border-red-500/20 bg-red-500/5"
          : "border-fd-border bg-fd-muted/30"
      }`}
    >
      <button
        className={`flex items-center gap-2 px-3 py-2 w-full text-left bg-transparent ${
          hasResult ? "cursor-pointer" : "cursor-default"
        }`}
        onClick={() => hasResult && setExpanded(!expanded)}
      >
        <ToolIcon name={tool.name} />
        <span className="font-medium text-fd-foreground whitespace-nowrap">
          {tool.name === "bash" ? "Bash" : tool.name === "write" ? "Write" : tool.name === "edit" ? "Edit" : tool.name === "read" ? "Read" : tool.name.replace(/_/g, " ")}
        </span>
        <span className="text-fd-muted-foreground/60 text-xs truncate max-w-[220px]">
          {tool.arg}
        </span>
        {isPending && (
          <svg className="h-3.5 w-3.5 animate-spin text-fd-primary shrink-0 ml-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {isDone && (
          <svg className="h-3.5 w-3.5 text-emerald-500 shrink-0 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
        {isError && (
          <svg className="h-3.5 w-3.5 text-red-500 shrink-0 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        )}
        {hasResult && (
          <svg
            className={`h-3 w-3 text-fd-muted-foreground/50 shrink-0 transition-transform ${expanded ? "rotate-90" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        )}
      </button>
      {expanded && tool.result && (
        <div className="border-t border-fd-border">
          {tool.name === "bash" ? (
            <div className="bg-[#1a1a1a] max-h-[160px] overflow-y-auto">
              <div className="px-3 py-1.5 text-[11px] font-mono text-emerald-400 border-b border-white/10">
                <span className="text-neutral-500 select-none">$ </span>{tool.arg}
              </div>
              <pre className="m-0 px-3 py-1.5 text-[11px] font-mono text-neutral-300 whitespace-pre-wrap break-all">
                {tool.result}
              </pre>
            </div>
          ) : (
            <pre className="m-0 px-3 py-2 text-[11px] font-mono text-fd-muted-foreground bg-fd-background whitespace-pre-wrap break-all max-h-[160px] overflow-y-auto">
              {tool.result}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  CopyButton (inline, on hover)                                      */
/* ------------------------------------------------------------------ */

function InlineCopy({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); } catch { /* noop */ }
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex items-center justify-center rounded-md p-1 text-fd-muted-foreground/30 hover:text-fd-muted-foreground transition-colors"
    >
      {copied ? (
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

function now() {
  return new Date().toISOString();
}

const SEED_MESSAGES: Message[] = [
  {
    id: "1",
    role: "user",
    text: "Create a REST API for a todo app with Express and TypeScript",
    ts: new Date(Date.now() - 120000).toISOString(),
    attachments: [{ name: "spec.md", type: "file" }],
  },
  {
    id: "2",
    role: "assistant",
    text: "I'll create a complete Express + TypeScript REST API with CRUD endpoints, validation, and error handling.",
    ts: new Date(Date.now() - 90000).toISOString(),
    tools: [
      { id: "t1", name: "write", arg: "src/index.ts", state: "completed", result: 'import express from "express";\nimport { todoRouter } from "./routes/todos";\n\nconst app = express();\napp.use(express.json());\napp.use("/api/todos", todoRouter);\n\napp.listen(3000, () => console.log("Server running on :3000"));' },
      { id: "t2", name: "write", arg: "src/routes/todos.ts", state: "completed", result: 'import { Router } from "express";\n\nexport const todoRouter = Router();\n\ntodoRouter.get("/", (req, res) => {\n  res.json(todos);\n});' },
      { id: "t3", name: "write", arg: "src/middleware/validate.ts", state: "completed" },
      { id: "t4", name: "bash", arg: "npm test", state: "completed", result: "PASS  src/__tests__/todos.test.ts\n  ✓ GET /api/todos returns 200 (12ms)\n  ✓ POST /api/todos creates item (8ms)\n  ✓ DELETE /api/todos/:id removes item (5ms)\n\nTest Suites: 1 passed, 1 total\nTests:       3 passed, 3 total" },
    ],
  },
];

const MOCK_REPLIES: { text: string; tools: Omit<ToolCall, "id">[]; attachments?: Attachment[] }[] = [
  {
    text: "Done! I've added the authentication middleware and updated the routes to require a valid JWT token.",
    tools: [
      { name: "read", arg: "src/config.ts", state: "completed", result: 'export const config = {\n  port: 3000,\n  jwtSecret: process.env.JWT_SECRET || "dev-secret",\n  dbUrl: process.env.DATABASE_URL,\n};' },
      { name: "write", arg: "src/middleware/auth.ts", state: "completed" },
      { name: "edit", arg: "src/routes/todos.ts", state: "completed" },
      { name: "bash", arg: "npm test", state: "completed", result: "PASS  src/__tests__/auth.test.ts\nPASS  src/__tests__/todos.test.ts\n\nTest Suites: 2 passed, 2 total\nTests:       7 passed, 7 total" },
    ],
  },
  {
    text: "I've deployed the API and it's live. Here are the endpoints you can use.",
    tools: [
      { name: "bash", arg: "npm run build", state: "completed", result: "Build completed in 1.2s\nOutput: dist/" },
      { name: "bash", arg: "npm run deploy", state: "completed", result: "Deployed to https://todo-api.example.com\nHealth check: OK" },
      { name: "search_web", arg: "express rate limiting best practices", state: "completed" },
      { name: "write", arg: "src/middleware/rate-limit.ts", state: "completed" },
    ],
  },
  {
    text: "Found the issue — the database connection wasn't being pooled correctly. Fixed it and added retry logic.",
    tools: [
      { name: "read", arg: "src/db/connection.ts", state: "completed", result: 'import { Pool } from "pg";\n\nexport const pool = new Pool({\n  connectionString: config.dbUrl,\n  max: 20,\n  idleTimeoutMillis: 30000,\n});' },
      { name: "edit", arg: "src/db/connection.ts", state: "completed" },
      { name: "bash", arg: "npm test -- --watch", state: "completed", result: "PASS  All test suites passed\nWatching for changes..." },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ChatAgentDemo() {
  const [messages, setMessages] = useState<Message[]>(SEED_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<{ name: string; type: "file" | "image" }[]>([]);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replyIndex = useRef(0);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Track scroll position
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setIsAtBottom(atBottom);
  }, []);

  useEffect(() => {
    if (isAtBottom) scrollToBottom();
  }, [messages, isTyping, isAtBottom, scrollToBottom]);

  // Drag & drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  const handleDragLeave = useCallback(() => setIsDragging(false), []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const newFiles = files.map((f) => ({
      name: f.name,
      type: f.type.startsWith("image/") ? "image" as const : "file" as const,
    }));
    setPendingFiles((prev) => [...prev, ...newFiles]);
  }, []);

  // File input
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = files.map((f) => ({
      name: f.name,
      type: f.type.startsWith("image/") ? "image" as const : "file" as const,
    }));
    setPendingFiles((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  }, []);

  // Simulate streamed tool calls
  const simulateToolCalls = useCallback((tools: Omit<ToolCall, "id">[], msgId: string) => {
    tools.forEach((tool, i) => {
      const toolId = `${msgId}-t${i}`;
      // Add as "calling" first
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msgId
              ? { ...m, tools: [...(m.tools || []), { ...tool, id: toolId, state: "calling" as const }] }
              : m,
          ),
        );
      }, i * 400);
      // Then mark as "completed"
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msgId
              ? {
                  ...m,
                  tools: (m.tools || []).map((t) =>
                    t.id === toolId ? { ...t, state: "completed" as const } : t,
                  ),
                }
              : m,
          ),
        );
      }, i * 400 + 600);
    });
  }, []);

  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text,
      ts: now(),
      attachments: pendingFiles.length > 0 ? pendingFiles.map((f) => ({ ...f })) : undefined,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setPendingFiles([]);
    setIsTyping(true);

    const reply = MOCK_REPLIES[replyIndex.current % MOCK_REPLIES.length];
    replyIndex.current += 1;
    const replyId = (Date.now() + 1).toString();

    // Add empty assistant message first (typing state)
    setTimeout(() => {
      const assistantMsg: Message = {
        id: replyId,
        role: "assistant",
        text: "",
        ts: now(),
        tools: [],
      };
      setMessages((prev) => [...prev, assistantMsg]);

      // Stream tool calls
      simulateToolCalls(reply.tools, replyId);

      // Then add text after tools are done
      const textDelay = reply.tools.length * 400 + 800;
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) => (m.id === replyId ? { ...m, text: reply.text } : m)),
        );
        setIsTyping(false);
      }, textDelay);
    }, 500);
  }, [input, isTyping, pendingFiles, simulateToolCalls]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const relativeTime = (iso: string) => {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (diff < 10) return "Just now";
    if (diff < 60) return `${diff}s ago`;
    const mins = Math.floor(diff / 60);
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  };

  return (
    <div
      className="relative flex flex-col overflow-hidden rounded-2xl border border-fd-border bg-fd-card shadow-sm h-[640px]"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-fd-primary/5 border-2 border-dashed border-fd-primary/30 rounded-2xl backdrop-blur-sm">
          <div className="text-center">
            <svg className="h-8 w-8 text-fd-primary mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="text-sm font-medium text-fd-primary">Drop files here</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-fd-border/50 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-fd-primary/10 text-fd-primary">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <span className="font-mono text-xs text-fd-muted-foreground">coder</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-fd-muted-foreground/40">
            {messages.length} messages
          </span>
          <span className="font-mono text-[10px] text-fd-muted-foreground/30">
            session_demo
          </span>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
      >
        {messages.map((msg, idx) => {
          const isLast = idx === messages.length - 1;

          if (msg.role === "user") {
            return (
              <div key={msg.id} className="w-full px-6 py-3">
                <div className="max-w-xl mx-auto">
                  <div className="group flex flex-col gap-1.5 items-end">
                    {/* Attachments */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 justify-end">
                        {msg.attachments.map((a, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-fd-border bg-fd-muted/30 px-2.5 py-1.5 text-xs text-fd-foreground"
                          >
                            {a.type === "image" ? (
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                              </svg>
                            ) : (
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                              </svg>
                            )}
                            <span className="truncate max-w-[120px]">{a.name}</span>
                          </span>
                        ))}
                      </div>
                    )}
                    {/* Bubble */}
                    <div className="w-fit max-w-[80%] rounded-[18px_18px_4px_18px] bg-fd-primary/10 px-4 py-3">
                      <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                    </div>
                    {/* Hover: time + copy */}
                    <div className="flex items-center gap-1.5 h-5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[11px] text-fd-muted-foreground/40">{relativeTime(msg.ts)}</span>
                      <InlineCopy text={msg.text} />
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Assistant
          return (
            <div key={msg.id} className="w-full px-6 pt-4 pb-5">
              <div className="max-w-xl mx-auto">
                <div className="group flex flex-col gap-2">
                  {/* Agent name */}
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-fd-primary/10 text-fd-primary">
                      <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                      </svg>
                    </div>
                    <span className="text-[13px] font-semibold text-fd-foreground">coder</span>
                  </div>

                  {/* Tool calls */}
                  {msg.tools && msg.tools.length > 0 && (
                    <div className="flex flex-col gap-1.5 mb-1">
                      {msg.tools.map((tool) => (
                        <ToolChip key={tool.id} tool={tool} />
                      ))}
                    </div>
                  )}

                  {/* Text or typing */}
                  <div className="text-sm text-fd-foreground">
                    {msg.text ? (
                      <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                    ) : (
                      isLast && isTyping && !msg.tools?.length && (
                        <span className="inline-flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-fd-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
                          <span className="h-1.5 w-1.5 rounded-full bg-fd-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
                          <span className="h-1.5 w-1.5 rounded-full bg-fd-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
                        </span>
                      )
                    )}
                  </div>

                  {/* Hover: copy */}
                  {msg.text && (
                    <div className="h-5 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <InlineCopy text={msg.text} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Scroll to bottom button */}
      {!isAtBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-[88px] left-1/2 -translate-x-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-fd-border bg-fd-card shadow-md hover:bg-fd-muted/50 transition-colors"
        >
          <svg className="h-4 w-4 text-fd-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
          </svg>
        </button>
      )}

      {/* Input area */}
      <div className="shrink-0 border-t border-fd-border/50 px-4 py-3">
        {/* Pending files */}
        {pendingFiles.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {pendingFiles.map((f, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-lg border border-fd-border bg-fd-muted/30 pl-2.5 pr-1.5 py-1 text-xs"
              >
                {f.type === "image" ? (
                  <svg className="h-3 w-3 text-fd-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                ) : (
                  <svg className="h-3 w-3 text-fd-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                )}
                <span className="truncate max-w-[100px]">{f.name}</span>
                <button
                  onClick={() => setPendingFiles((prev) => prev.filter((_, j) => j !== i))}
                  className="text-fd-muted-foreground/40 hover:text-fd-foreground p-0.5"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 rounded-xl border border-fd-border/60 bg-fd-background px-3 py-2.5">
          {/* Attach button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-fd-muted-foreground/40 hover:text-fd-muted-foreground hover:bg-fd-muted/30 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
            </svg>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message coder..."
            disabled={isTyping}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-fd-muted-foreground/40 disabled:opacity-50"
          />

          {/* Send */}
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-fd-primary/10 text-fd-primary transition-opacity disabled:opacity-30"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
            </svg>
          </button>
        </div>

        <p className="mt-2 text-center font-mono text-[10px] text-fd-muted-foreground/30">
          Demo mode — responses are mocked. Try drag &amp; drop a file!
        </p>
      </div>
    </div>
  );
}
