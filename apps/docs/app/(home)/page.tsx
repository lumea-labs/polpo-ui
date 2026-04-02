import Link from "next/link";
import { ChatDemo } from "@/components/chat-demo";

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
          <Link
            href="/docs"
            className="bg-fd-foreground text-fd-background px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
          >
            Get Started
          </Link>
          <a
            href="https://github.com/lumea-labs/polpo-ui"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-fd-border px-5 py-2.5 text-sm font-medium text-fd-muted-foreground transition-colors hover:text-fd-foreground"
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

        {/* Live chat demo using real @polpo-ai/chat components */}
        <div className="mt-10">
          <ChatDemo />
        </div>

        {/* Code */}
        <div className="mt-4 border border-fd-border bg-fd-card p-5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-fd-muted-foreground/40">Usage</p>
          <pre className="mt-3 font-mono text-sm">
            <span className="text-fd-primary">import</span>
            {" { "}Chat{" } "}
            <span className="text-fd-primary">from</span>
            <span className="text-fd-muted-foreground">{' "@polpo-ai/chat"'}</span>
            {"\n\n"}
            <span className="text-fd-muted-foreground">{"<"}</span>
            Chat
            <span className="text-fd-primary"> agent</span>
            <span className="text-fd-muted-foreground">=</span>
            <span className="text-fd-muted-foreground">{'"coder"'}</span>
            <span className="text-fd-primary"> sessionId</span>
            <span className="text-fd-muted-foreground">=</span>
            <span className="text-fd-muted-foreground">{'"session_abc"'}</span>
            <span className="text-fd-muted-foreground">{" />"}</span>
          </pre>
        </div>
      </section>

      {/* Install CTA */}
      <section className="relative z-10 mx-auto max-w-[1100px] px-6 pb-24">
        <div className="border border-fd-primary/20 bg-fd-primary/[0.03] p-8 text-center">
          <h2 className="text-xl font-extrabold tracking-tight">Start building</h2>
          <p className="mt-2 text-sm text-fd-muted-foreground">
            Add chat components to your project in one command.
          </p>
          <div className="mx-auto mt-6 w-fit border border-fd-border bg-fd-background px-6 py-3">
            <code className="font-mono text-sm text-fd-primary">
              npx @polpo-ai/ui add chat
            </code>
          </div>
        </div>
      </section>
    </div>
  );
}
