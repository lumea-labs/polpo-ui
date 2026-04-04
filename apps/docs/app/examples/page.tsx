"use client";

import { useState, useRef } from "react";

const examples = [
  {
    slug: "chat-agent",
    title: "Chat Agent",
    description:
      "Full-page chat app connected to a Polpo agent. Clone it, set your API key, and run.",
    demoUrl: "https://polpo-example-chat.vercel.app",
    repoUrl: "https://github.com/polpo-ai/example-chat",
    commands: [
      "npx create-next-app -e https://github.com/polpo-ai/example-chat",
    ],
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
  },
  {
    slug: "support-agent",
    title: "Support Agent",
    description:
      "Customer support chat with knowledge base, ticket creation, and escalation workflows.",
    demoUrl: "https://polpo-example-support.vercel.app",
    repoUrl: "https://github.com/polpo-ai/example-support",
    commands: [
      "npx create-next-app -e https://github.com/polpo-ai/example-support",
    ],
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.712 4.33a9.027 9.027 0 011.652 1.306c.51.51.944 1.064 1.306 1.652M16.712 4.33l-3.448 4.138m3.448-4.138a9.014 9.014 0 00-9.424 0M19.67 7.288l-4.138 3.448m4.138-3.448a9.014 9.014 0 010 9.424m-4.138-5.976a3.736 3.736 0 00-.88-1.388 3.737 3.737 0 00-1.388-.88m2.268 2.268a3.765 3.765 0 010 2.528m-2.268-4.796a3.765 3.765 0 00-2.528 0m4.796 4.796c-.181.506-.475.982-.88 1.388a3.736 3.736 0 01-1.388.88m2.268-2.268l4.138 3.448m0 0a9.027 9.027 0 01-1.306 1.652 9.027 9.027 0 01-1.652 1.306m0 0l-3.448-4.138m3.448 4.138a9.014 9.014 0 01-9.424 0m5.976-4.138a3.765 3.765 0 01-2.528 0m0 0a3.736 3.736 0 01-1.388-.88 3.737 3.737 0 01-.88-1.388m0 0l-4.138 3.448M7.288 19.67a9.014 9.014 0 010-9.424m4.138 5.976l-3.448 4.138m0 0a9.027 9.027 0 01-1.652-1.306 9.027 9.027 0 01-1.306-1.652m0 0l4.138-3.448M4.33 7.288a9.014 9.014 0 010 9.424M12 12h.008v.008H12V12zm0 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
  {
    slug: "multi-agent",
    title: "Multi-Agent",
    description:
      "Agent selector with session switching and team views.",
    demoUrl: "https://polpo-example-multi-agent.vercel.app",
    repoUrl: "https://github.com/polpo-ai/example-multi-agent",
    commands: [
      "npx create-next-app -e https://github.com/polpo-ai/example-multi-agent",
    ],
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    slug: null,
    title: "Task Dashboard",
    description:
      "Task list with status, agent assignment, and output viewer. Coming soon.",
    demoUrl: null as string | null,
    repoUrl: null as string | null,
    commands: [],
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
  },
];

export default function ExamplesPage() {
  const [active, setActive] = useState(0);
  const [showInstall, setShowInstall] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const ex = examples[active];
  const isAvailable = !!ex.slug;

  const selectTab = (i: number) => {
    setActive(i);
    setShowInstall(false);
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  return (
    <div className="mx-auto w-full max-w-[var(--fd-layout-width)] px-6 py-20">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-fd-primary">
        Examples
      </p>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">
        Starter projects
      </h1>
      <p className="mt-3 max-w-md text-sm text-fd-muted-foreground">
        Clone a full project, set your API key, and run. Each example is a
        standalone Next.js app you can deploy anywhere.
      </p>

      {/* Horizontal tabs */}
      <div ref={cardRef} className="mt-10 flex gap-2 overflow-x-auto pb-1 scroll-mt-20">
        {examples.map((item, i) => {
          const available = !!item.slug;
          return (
            <button
              key={item.title}
              onClick={() => selectTab(i)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                i === active
                  ? "bg-fd-primary/10 text-fd-foreground"
                  : available
                    ? "text-fd-muted-foreground hover:bg-fd-muted/30 hover:text-fd-foreground"
                    : "text-fd-muted-foreground/40 cursor-default"
              }`}
            >
              <span className={i === active ? "text-fd-primary" : ""}>{item.icon}</span>
              {item.title}
              {!available && (
                <span className="text-[10px] font-mono opacity-50">soon</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected example */}
      <div className="mt-4">
        <div
          className={`rounded-xl border bg-fd-card overflow-hidden ${
            isAvailable ? "border-fd-border" : "border-fd-border/50 opacity-60"
          }`}
        >
          {/* Info bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-fd-border/50">
            <div className="flex items-center gap-2">
              <div className="text-fd-primary">{ex.icon}</div>
              <h2 className="text-sm font-bold">{ex.title}</h2>
              <span className="text-xs text-fd-muted-foreground">{ex.description}</span>
            </div>
            <div className="flex items-center gap-3">
              {isAvailable && (
                <>
                  {ex.demoUrl ? (
                    <a
                      href={ex.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-fd-primary hover:underline"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                      Live demo
                    </a>
                  ) : (
                    <span className="text-[10px] font-mono text-fd-muted-foreground/40">
                      demo coming soon
                    </span>
                  )}
                  {ex.repoUrl && (
                    <a
                      href={ex.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-fd-muted-foreground hover:text-fd-foreground transition-colors"
                    >
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      Source
                    </a>
                  )}
                  {ex.commands.length > 0 && (
                    <button
                      onClick={() => setShowInstall(!showInstall)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-fd-foreground text-fd-background px-3 py-1.5 text-xs font-medium hover:opacity-80 transition-opacity"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                      Clone
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Preview area — 16:9 */}
          <div className="bg-fd-muted/20 aspect-video overflow-hidden relative">
            {isAvailable && ex.demoUrl ? (
              <iframe
                src={ex.demoUrl}
                className="w-full h-full border-0"
                loading="lazy"
                allow="clipboard-write"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-xs text-fd-muted-foreground/40">Coming soon</p>
              </div>
            )}

            {/* Install overlay */}
            {showInstall && ex.commands.length > 0 && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-fd-background/90 backdrop-blur-sm">
                <div className="text-center mx-auto">
                  <p className="text-xs text-fd-muted-foreground mb-3">Run this command to clone the project:</p>
                  <div className="flex items-center gap-3 rounded-xl border border-fd-border bg-fd-card px-5 py-3">
                    <code className="font-mono text-sm text-fd-primary text-left pr-4">
                      {ex.commands[0]}
                    </code>
                    <button
                      onClick={async () => {
                        try { await navigator.clipboard.writeText(ex.commands[0]); } catch {}
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="text-fd-muted-foreground/40 hover:text-fd-muted-foreground transition-colors shrink-0"
                    >
                      {copied ? (
                        <svg className="h-4 w-4 text-fd-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <button
                    onClick={() => setShowInstall(false)}
                    className="mt-4 text-xs text-fd-muted-foreground hover:text-fd-foreground transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
