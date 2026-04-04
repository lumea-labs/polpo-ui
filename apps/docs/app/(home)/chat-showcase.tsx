"use client";

import { useState } from "react";

export function ChatShowcase() {
  const [tab, setTab] = useState<"preview" | "code">("preview");

  return (
    <div className="grid items-start gap-10 md:grid-cols-[1fr_1.2fr]">
      {/* Left — text */}
      <div className="flex flex-col justify-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-fd-primary">
          Components
        </p>
        <h2 className="mt-4 text-2xl font-extrabold tracking-tight md:text-3xl">
          Agents that work
          <span className="text-fd-muted-foreground">, instantly.</span>
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-fd-muted-foreground">
          A full conversational interface with streaming, tool call rendering,
          and session persistence. One import.
        </p>
      </div>

      {/* Right — tabs + content */}
      <div>
        {/* Tabs */}
        <div className="flex gap-1 rounded-lg bg-fd-muted/40 p-1 w-fit mb-4">
          <button
            onClick={() => setTab("preview")}
            className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors ${
              tab === "preview"
                ? "bg-fd-card text-fd-foreground shadow-sm"
                : "text-fd-muted-foreground hover:text-fd-foreground"
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setTab("code")}
            className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors ${
              tab === "code"
                ? "bg-fd-card text-fd-foreground shadow-sm"
                : "text-fd-muted-foreground hover:text-fd-foreground"
            }`}
          >
            Code
          </button>
        </div>

        {tab === "preview" ? (
          <div className="overflow-hidden rounded-2xl border border-fd-border bg-fd-card shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 bg-fd-card/80 backdrop-blur border-b border-fd-border/50">
              <div className="flex items-center gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-fd-primary/10 text-fd-primary">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                </div>
                <span className="font-mono text-xs text-fd-muted-foreground">coder</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </div>
              <span className="font-mono text-[10px] text-fd-muted-foreground/40">session_abc</span>
            </div>

            {/* Messages */}
            <div className="flex flex-col gap-4 px-5 py-5">
              {/* User message */}
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-br-md bg-fd-primary/10 px-4 py-3">
                  <p className="text-sm">Create a REST API for a todo app with Express and TypeScript</p>
                </div>
              </div>

              {/* Agent message */}
              <div className="flex gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-fd-muted/60">
                  <svg className="h-3.5 w-3.5 text-fd-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-fd-muted-foreground">I&apos;ll create a complete Express + TypeScript REST API with CRUD endpoints, validation, and error handling.</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {[
                      { name: "write", arg: "src/index.ts" },
                      { name: "write", arg: "src/routes/todos.ts" },
                      { name: "write", arg: "src/middleware/validate.ts" },
                      { name: "bash", arg: "npm test" },
                    ].map((tool, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-fd-muted/50 px-2.5 py-1 font-mono text-[11px]">
                        <span className="h-1 w-1 rounded-full bg-fd-primary" />
                        <span className="text-fd-muted-foreground">{tool.name}</span>
                        <span className="text-fd-muted-foreground/50">{tool.arg}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="px-4 pb-4">
              <div className="flex items-center rounded-xl border border-fd-border/60 bg-fd-background px-4 py-2.5">
                <span className="text-xs text-fd-muted-foreground/40">Message coder...</span>
                <div className="ml-auto flex h-6 w-6 items-center justify-center rounded-lg bg-fd-primary/10 text-fd-primary">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-fd-border bg-fd-card shadow-sm">
            <div className="p-5 overflow-x-auto">
              <pre className="font-mono text-sm leading-7"><code>
<span className="text-[#c586c0]">import</span> <span className="text-fd-foreground">{"{ Chat }"}</span> <span className="text-[#c586c0]">from</span> <span className="text-[#ce9178]">&quot;@polpo-ai/chat&quot;</span>{"\n"}<span className="text-[#c586c0]">import</span> <span className="text-fd-foreground">{"{ PolpoProvider }"}</span> <span className="text-[#c586c0]">from</span> <span className="text-[#ce9178]">&quot;@polpo-ai/react&quot;</span>
{"\n\n"}<span className="text-[#6a9955]">{"// Full chat with streaming + tools."}</span>
{"\n"}<span className="text-[#808080]">&lt;</span><span className="text-[#4ec9b0]">PolpoProvider</span> <span className="text-[#9cdcfe]">baseUrl</span><span className="text-fd-foreground">=</span><span className="text-[#ce9178]">&quot;https://api.polpo.sh&quot;</span><span className="text-[#808080]">&gt;</span>
{"\n"}{"  "}<span className="text-[#808080]">&lt;</span><span className="text-[#4ec9b0]">Chat</span> <span className="text-[#9cdcfe]">agent</span><span className="text-fd-foreground">=</span><span className="text-[#ce9178]">&quot;coder&quot;</span> <span className="text-[#9cdcfe]">sessionId</span><span className="text-fd-foreground">=</span><span className="text-[#ce9178]">&quot;session_abc&quot;</span> <span className="text-[#808080]">/&gt;</span>
{"\n"}<span className="text-[#808080]">&lt;/</span><span className="text-[#4ec9b0]">PolpoProvider</span><span className="text-[#808080]">&gt;</span></code></pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
