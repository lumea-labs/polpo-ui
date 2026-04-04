import Link from "next/link";
import { CopyButton } from "./copy-button";
import { ChatShowcase } from "./chat-showcase";

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
        <ChatShowcase />
      </section>

      {/* Explore */}
      <section className="relative z-10 mx-auto max-w-[1100px] px-6 pb-24">
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/components/chat"
            className="group rounded-xl border border-fd-border bg-fd-card p-6 transition-colors hover:border-fd-primary/30"
          >
            <div className="flex items-center gap-2 mb-3">
              <svg className="h-4 w-4 text-fd-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L12 12.75 6.429 9.75m11.142 0l4.179 2.25L12 17.25 2.25 12l4.179-2.25m11.142 0l4.179 2.25-4.179 2.25m0 0L12 17.25l-5.571-3m11.142 0l4.179 2.25L12 21.75l-9.75-5.25 4.179-2.25" />
              </svg>
              <span className="text-sm font-bold">Components</span>
            </div>
            <p className="text-xs text-fd-muted-foreground leading-relaxed">
              Browse every component from @polpo-ai/chat — messages, tool calls, skeletons, scroll button, typing indicator, and hooks.
            </p>
          </Link>

          <Link
            href="/examples"
            className="group rounded-xl border border-fd-border bg-fd-card p-6 transition-colors hover:border-fd-primary/30"
          >
            <div className="flex items-center gap-2 mb-3">
              <svg className="h-4 w-4 text-fd-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
              <span className="text-sm font-bold">Examples</span>
            </div>
            <p className="text-xs text-fd-muted-foreground leading-relaxed">
              Starter projects you can clone and deploy. Full Next.js apps with everything wired up.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
