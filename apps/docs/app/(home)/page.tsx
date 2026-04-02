import Link from "next/link";
import { CopyButton } from "./copy-button";

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
          <div className="flex items-center gap-3 border border-fd-border bg-fd-card px-5 py-2.5">
            <code className="font-mono text-sm text-fd-primary">npx shadcn add @polpo-ai/chat</code>
            <CopyButton text="npx shadcn add @polpo-ai/chat" />
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
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
          <pre className="font-mono text-sm leading-7"><code>
<span className="text-[#c586c0]">import</span> <span className="text-fd-foreground">{"{ Chat }"}</span> <span className="text-[#c586c0]">from</span> <span className="text-[#ce9178]">&quot;@polpo-ai/chat&quot;</span>{"\n"}<span className="text-[#c586c0]">import</span> <span className="text-fd-foreground">{"{ PolpoProvider }"}</span> <span className="text-[#c586c0]">from</span> <span className="text-[#ce9178]">&quot;@polpo-ai/react&quot;</span>
{"\n\n"}<span className="text-[#6a9955]">{"// Full chat with streaming + tools."}</span>
{"\n"}<span className="text-[#808080]">&lt;</span><span className="text-[#4ec9b0]">PolpoProvider</span> <span className="text-[#9cdcfe]">baseUrl</span><span className="text-fd-foreground">=</span><span className="text-[#ce9178]">&quot;https://api.polpo.sh&quot;</span><span className="text-[#808080]">&gt;</span>
{"\n"}{"  "}<span className="text-[#808080]">&lt;</span><span className="text-[#4ec9b0]">Chat</span> <span className="text-[#9cdcfe]">agent</span><span className="text-fd-foreground">=</span><span className="text-[#ce9178]">&quot;coder&quot;</span> <span className="text-[#9cdcfe]">sessionId</span><span className="text-fd-foreground">=</span><span className="text-[#ce9178]">&quot;session_abc&quot;</span> <span className="text-[#808080]">/&gt;</span>
{"\n"}<span className="text-[#808080]">&lt;/</span><span className="text-[#4ec9b0]">PolpoProvider</span><span className="text-[#808080]">&gt;</span></code></pre>
        </div>
      </section>

      {/* Examples */}
      <section className="relative z-10 mx-auto max-w-[1100px] px-6 pb-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-fd-primary">
          Examples
        </p>
        <h2 className="mt-4 text-2xl font-extrabold tracking-tight md:text-3xl">
          See it in action
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Link
            href="/docs/examples/chat-agent"
            className="group border border-fd-border bg-fd-card p-6 transition-colors hover:border-fd-primary/30"
          >
            <div className="flex items-center gap-2 mb-3">
              <svg className="h-4 w-4 text-fd-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
              <span className="text-sm font-bold">Chat Agent</span>
            </div>
            <p className="text-xs text-fd-muted-foreground leading-relaxed">
              Full-page chat interface connected to a Polpo agent with streaming and tool calls.
            </p>
          </Link>

          <div className="border border-fd-border/50 bg-fd-card/50 p-6 opacity-50">
            <div className="flex items-center gap-2 mb-3">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
              <span className="text-sm font-bold">Task Dashboard</span>
            </div>
            <p className="text-xs text-fd-muted-foreground leading-relaxed">
              Task list with status, agent assignment, and output viewer. Coming soon.
            </p>
          </div>

          <div className="border border-fd-border/50 bg-fd-card/50 p-6 opacity-50">
            <div className="flex items-center gap-2 mb-3">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              <span className="text-sm font-bold">Multi-Agent</span>
            </div>
            <p className="text-xs text-fd-muted-foreground leading-relaxed">
              Agent selector with session switching and team views. Coming soon.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
