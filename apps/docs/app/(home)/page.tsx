import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Dot grid */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(128,128,128,.06) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-[1100px] px-6 pt-24 pb-20 md:pt-32">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-fd-primary">
          @polpo-ai/ui
        </p>

        <h1 className="mt-5 text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
          UI components
          <br />
          <span className="text-fd-muted-foreground">for AI agents.</span>
        </h1>

        <p className="mt-6 max-w-lg text-base leading-relaxed text-fd-muted-foreground">
          Composable React components for chat interfaces, task views, tool
          renderers, and more. Built on{" "}
          <span className="text-fd-foreground font-medium">@polpo-ai/sdk</span> +{" "}
          <span className="text-fd-foreground font-medium">shadcn/ui</span>.
        </p>

        {/* CTA: install command */}
        <div className="mt-10 flex items-center gap-6">
          <div className="border border-fd-border bg-fd-card px-6 py-3">
            <code className="font-mono text-sm text-fd-primary">npx shadcn add @polpo-ai/chat</code>
          </div>
          <Link
            href="/docs"
            className="text-sm font-medium text-fd-muted-foreground transition-colors hover:text-fd-foreground"
          >
            Docs
          </Link>
        </div>
      </section>

      {/* Feature cards */}
      <section className="relative z-10 mx-auto max-w-[1100px] px-6 pb-24">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Fully Composable",
              desc: "Three levels of control — zero-config, customizable, or headless. Use the full Chat component or build from primitives.",
              icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L12 12.75 6.429 9.75m11.142 0l4.179 2.25L12 17.25 2.25 12l4.179-2.25m11.142 0l4.179 2.25-4.179 2.25m0 0L12 17.25l-5.571-3m11.142 0l4.179 2.25L12 21.75l-9.75-5.25 4.179-2.25" />
                </svg>
              ),
            },
            {
              title: "Polpo SDK Integration",
              desc: "Built on @polpo-ai/react hooks. Streaming, sessions, tool calls, memory — all wired out of the box.",
              icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.614a4.5 4.5 0 00-1.242-7.244l4.5-4.5a4.5 4.5 0 016.364 6.364l-1.757 1.757" />
                </svg>
              ),
            },
            {
              title: "shadcn/ui Foundation",
              desc: "Install to your project with npx. You own the code. Tailwind CSS, fully customizable, no vendor lock-in.",
              icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                </svg>
              ),
            },
          ].map((card) => (
            <div
              key={card.title}
              className="border border-fd-border bg-fd-card p-6"
            >
              <div className="text-fd-primary mb-3">{card.icon}</div>
              <h3 className="text-sm font-bold tracking-tight">
                {card.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-fd-muted-foreground">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Chat showcase */}
      <section className="relative z-10 mx-auto max-w-[1100px] px-6 pb-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-fd-primary">
          Chat
        </p>
        <h2 className="mt-4 text-2xl font-extrabold tracking-tight md:text-3xl">
          Chat that works<span className="text-fd-muted-foreground">, instantly.</span>
        </h2>
        <p className="mt-3 max-w-md text-sm text-fd-muted-foreground">
          A full conversational interface with streaming, tool call rendering,
          and session persistence. One import.
        </p>

        {/* Chat mock */}
        <div className="mt-10 border border-fd-border bg-fd-card">
          <div className="flex items-center justify-between border-b border-fd-border px-5 py-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-fd-primary" />
              <span className="font-mono text-xs text-fd-muted-foreground">coder</span>
            </div>
            <span className="font-mono text-[10px] text-fd-muted-foreground/40">session_abc</span>
          </div>
          <div className="divide-y divide-fd-border/50">
            <div className="px-5 py-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-fd-muted-foreground/40">you</p>
              <p className="mt-2 text-sm">Create a REST API for a todo app with Express and TypeScript</p>
            </div>
            <div className="px-5 py-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-fd-primary/60">coder</p>
              <p className="mt-2 text-sm text-fd-muted-foreground">I&apos;ll create a complete Express + TypeScript REST API with CRUD endpoints, validation, and error handling.</p>
              <div className="mt-3 space-y-1.5">
                {[
                  { name: "write", arg: "src/index.ts" },
                  { name: "write", arg: "src/routes/todos.ts" },
                  { name: "write", arg: "src/middleware/validate.ts" },
                  { name: "bash", arg: "npm test" },
                ].map((tool, i) => (
                  <div key={i} className="flex items-center gap-2 font-mono text-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-fd-primary" />
                    <span className="text-fd-muted-foreground">{tool.name}</span>
                    <span className="text-fd-muted-foreground/40">{tool.arg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-fd-border px-5 py-3">
            <span className="text-xs text-fd-muted-foreground/30">Message coder...</span>
          </div>
        </div>

        {/* Code */}
        <div className="mt-4 border border-fd-border bg-fd-card p-5 overflow-x-auto">
          <pre className="font-mono text-sm leading-7"><code className="text-fd-muted-foreground">{`import { Chat } from "@polpo-ai/chat"
import { PolpoProvider } from "@polpo-ai/react"

// Full chat with streaming + tools.
<PolpoProvider baseUrl="https://api.polpo.sh">
  <Chat agent="coder" sessionId="session_abc" />
</PolpoProvider>`}</code></pre>
        </div>
      </section>

      {/* Start building */}
      <section className="relative z-10 mx-auto max-w-[1100px] px-6 pb-24">
        <div className="border border-fd-primary/20 bg-fd-primary/[0.03] p-8">
          <h2 className="text-xl font-extrabold tracking-tight">Start building</h2>
          <p className="mt-2 text-sm text-fd-muted-foreground">
            Add chat components to your project in one command.
          </p>
          <div className="mt-6 space-y-3">
            <div className="w-fit border border-fd-border bg-fd-background px-5 py-2.5">
              <code className="font-mono text-sm text-fd-primary">npm install @polpo-ai/chat @polpo-ai/sdk @polpo-ai/react</code>
            </div>
            <p className="text-xs text-fd-muted-foreground">Or via shadcn registry:</p>
            <div className="w-fit border border-fd-border bg-fd-background px-5 py-2.5">
              <code className="font-mono text-sm text-fd-primary">npx shadcn add @polpo-ai/chat</code>
            </div>
          </div>

          {/* Examples */}
          <div className="mt-8 pt-6 border-t border-fd-border/50">
            <p className="text-xs font-medium text-fd-muted-foreground uppercase tracking-wider">Examples</p>
            <div className="mt-3 flex gap-3">
              <Link
                href="/docs/examples/chat-agent"
                className="border border-fd-border bg-fd-background px-4 py-2 text-sm font-medium text-fd-muted-foreground transition-colors hover:text-fd-foreground"
              >
                Chat Agent
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
