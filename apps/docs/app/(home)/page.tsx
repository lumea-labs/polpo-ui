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

        <div className="mt-10 flex items-center gap-4">
          <div className="border border-fd-border bg-fd-card px-5 py-2.5">
            <code className="font-mono text-sm text-fd-primary">npm install @polpo-ai/chat</code>
          </div>
          <Link
            href="/docs"
            className="px-5 py-2.5 text-sm font-medium text-fd-muted-foreground transition-colors hover:text-fd-foreground"
          >
            Docs
          </Link>
          <a
            href="https://github.com/lumea-labs/polpo-ui"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-fd-muted-foreground transition-colors hover:text-fd-foreground"
          >
            GitHub
          </a>
        </div>
      </section>

      {/* Feature cards */}
      <section className="relative z-10 mx-auto max-w-[1100px] px-6 pb-24">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Fully Composable",
              desc: "Three levels of control — zero-config, customizable, or headless. Use the full Chat component or build from primitives.",
            },
            {
              title: "Polpo SDK Integration",
              desc: "Built on @polpo-ai/react hooks. Streaming, sessions, tool calls, memory — all wired out of the box.",
            },
            {
              title: "shadcn/ui Foundation",
              desc: "Install to your project with npx. You own the code. Tailwind CSS, fully customizable, no vendor lock-in.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="border border-fd-border bg-fd-card p-6"
            >
              <h3 className="text-sm font-bold tracking-tight">
                {card.title}
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-fd-muted-foreground">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Chat showcase */}
      <section className="relative z-10 mx-auto max-w-[1100px] px-6 pb-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-fd-primary">
          Components
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
          <pre className="font-mono text-sm leading-relaxed"><code><span className="text-purple-400">import</span> {"{ "}<span className="text-fd-foreground">Chat</span>{" }"} <span className="text-purple-400">from</span> <span className="text-green-400">&quot;@polpo-ai/chat&quot;</span>{"\n"}<span className="text-purple-400">import</span> {"{ "}<span className="text-fd-foreground">PolpoProvider</span>{" }"} <span className="text-purple-400">from</span> <span className="text-green-400">&quot;@polpo-ai/react&quot;</span>{"\n\n"}<span className="text-fd-muted-foreground/60">{"// That's it. Full chat with streaming + tools."}</span>{"\n"}<span className="text-blue-400">{"<"}</span><span className="text-fd-foreground">PolpoProvider</span> <span className="text-purple-300">baseUrl</span><span className="text-fd-muted-foreground">=</span><span className="text-green-400">&quot;https://api.polpo.sh&quot;</span><span className="text-blue-400">{">"}</span>{"\n  "}<span className="text-blue-400">{"<"}</span><span className="text-fd-foreground">Chat</span> <span className="text-purple-300">agent</span><span className="text-fd-muted-foreground">=</span><span className="text-green-400">&quot;coder&quot;</span> <span className="text-purple-300">sessionId</span><span className="text-fd-muted-foreground">=</span><span className="text-green-400">&quot;session_abc&quot;</span> <span className="text-blue-400">{"/>"}</span>{"\n"}<span className="text-blue-400">{"</"}</span><span className="text-fd-foreground">PolpoProvider</span><span className="text-blue-400">{">"}</span></code></pre>
        </div>
      </section>

      {/* Install CTA */}
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
        </div>
      </section>
    </div>
  );
}
