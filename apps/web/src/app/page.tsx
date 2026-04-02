export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Dot grid background */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,.025) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Nav */}
      <nav className="relative z-10 mx-auto flex max-w-[1100px] items-center justify-between px-6 py-6">
        <a href="/" className="flex items-center gap-3">
          <div className="flex flex-col gap-[3px]">
            <div className="h-[14px] w-[14px] bg-[#ededed]" />
            <div className="ml-[17px] h-[14px] w-[14px] bg-[#ededed]" />
          </div>
          <span className="font-mono text-sm font-bold tracking-[0.18em] text-[#ededed]">
            POLPO UI
          </span>
        </a>

        <div className="flex items-center gap-8">
          <a
            href="/docs"
            className="text-xs text-[#6b7280] transition-colors hover:text-[#ededed]"
          >
            Docs
          </a>
          <a
            href="#components"
            className="text-xs text-[#6b7280] transition-colors hover:text-[#ededed]"
          >
            Components
          </a>
          <a
            href="https://github.com/lumea-labs/polpo-ui"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#6b7280] transition-colors hover:text-[#ededed]"
          >
            GitHub
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-[1100px] px-6 pt-24 pb-20 md:pt-32">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#3ecf8e]">
          @polpo-ai/ui
        </p>

        <h1 className="mt-5 text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
          UI components
          <br />
          <span className="text-[#6b7280]">for AI agents.</span>
        </h1>

        <p className="mt-6 max-w-lg text-base leading-relaxed text-[#6b7280]">
          Composable React components for chat interfaces, task views, tool
          renderers, and more. Built on{" "}
          <span className="text-[#ededed]">@polpo-ai/sdk</span> +{" "}
          <span className="text-[#ededed]">shadcn/ui</span>.
        </p>

        <div className="mt-10 flex items-center gap-4">
          <a
            href="/docs"
            className="bg-[#ededed] px-5 py-2.5 text-sm font-semibold text-[#090d11] transition-opacity hover:opacity-90"
          >
            Get Started
          </a>
          <a
            href="https://github.com/lumea-labs/polpo-ui"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-[#1e2530] px-5 py-2.5 text-sm font-medium text-[#6b7280] transition-colors hover:border-[#3ecf8e]/40 hover:text-[#ededed]"
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
              className="border border-[#1e2530] bg-[#0c1017] p-6"
            >
              <h3 className="text-sm font-bold tracking-tight">
                {card.title}
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-[#6b7280]">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Chat showcase */}
      <section
        id="components"
        className="relative z-10 mx-auto max-w-[1100px] px-6 pb-24"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#3ecf8e]">
          Components
        </p>
        <h2 className="mt-4 text-2xl font-extrabold tracking-tight md:text-3xl">
          Chat that works<span className="text-[#6b7280]">, instantly.</span>
        </h2>
        <p className="mt-3 max-w-md text-sm text-[#6b7280]">
          A full conversational interface with streaming, tool call rendering,
          and session persistence. One import.
        </p>

        {/* Mock chat UI */}
        <div className="mt-10 border border-[#1e2530] bg-[#0c1017]">
          {/* Chat header */}
          <div className="flex items-center justify-between border-b border-[#1e2530] px-5 py-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#3ecf8e]" />
              <span className="font-mono text-xs text-[#6b7280]">coder</span>
            </div>
            <span className="font-mono text-[10px] text-[#3a3f47]">
              session_abc
            </span>
          </div>

          {/* Messages */}
          <div className="space-y-0 divide-y divide-[#1e2530]/50">
            {/* User */}
            <div className="px-5 py-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#3a3f47]">
                you
              </p>
              <p className="mt-2 text-sm text-[#ededed]">
                Create a REST API for a todo app with Express and TypeScript
              </p>
            </div>

            {/* Assistant */}
            <div className="px-5 py-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#3ecf8e]/60">
                coder
              </p>
              <p className="mt-2 text-sm text-[#9ca3af]">
                I&apos;ll create a complete Express + TypeScript REST API with
                CRUD endpoints, validation, and error handling.
              </p>

              {/* Tool calls */}
              <div className="mt-3 space-y-1.5">
                {[
                  { name: "write", arg: "src/index.ts", done: true },
                  { name: "write", arg: "src/routes/todos.ts", done: true },
                  {
                    name: "write",
                    arg: "src/middleware/validate.ts",
                    done: true,
                  },
                  { name: "bash", arg: "npm test", done: true },
                ].map((tool, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 font-mono text-xs"
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        tool.done ? "bg-[#3ecf8e]" : "bg-[#3a3f47]"
                      }`}
                    />
                    <span className="text-[#6b7280]">{tool.name}</span>
                    <span className="text-[#3a3f47]">{tool.arg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-[#1e2530] px-5 py-3">
            <div className="flex items-center gap-3">
              <span className="flex-1 text-xs text-[#3a3f47]">
                Message coder...
              </span>
              <div className="flex h-6 w-6 items-center justify-center border border-[#1e2530]">
                <svg
                  className="h-3 w-3 text-[#3a3f47]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Code snippet */}
        <div className="mt-4 border border-[#1e2530] bg-[#0c1017] p-5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-[#3a3f47]">
            Usage
          </p>
          <pre className="mt-3 font-mono text-sm">
            <span className="text-[#3ecf8e]">import</span>
            <span className="text-[#ededed]">{" { "}</span>
            <span className="text-[#ededed]">Chat</span>
            <span className="text-[#ededed]">{" } "}</span>
            <span className="text-[#3ecf8e]">from</span>
            <span className="text-[#6b7280]">{' "@polpo-ai/chat"'}</span>
            <br />
            <br />
            <span className="text-[#6b7280]">{"<"}</span>
            <span className="text-[#ededed]">Chat</span>
            <span className="text-[#3ecf8e]"> agent</span>
            <span className="text-[#6b7280]">=</span>
            <span className="text-[#6b7280]">{'"coder"'}</span>
            <span className="text-[#3ecf8e]"> sessionId</span>
            <span className="text-[#6b7280]">=</span>
            <span className="text-[#6b7280]">{'"session_abc"'}</span>
            <span className="text-[#6b7280]">{" />"}</span>
          </pre>
        </div>
      </section>

      {/* Install */}
      <section className="relative z-10 mx-auto max-w-[1100px] px-6 pb-24">
        <div className="border border-[#3ecf8e]/20 bg-[#3ecf8e]/[0.03] p-8 text-center">
          <h2 className="text-xl font-extrabold tracking-tight">
            Start building
          </h2>
          <p className="mt-2 text-sm text-[#6b7280]">
            Add chat components to your project in one command.
          </p>
          <div className="mx-auto mt-6 w-fit border border-[#1e2530] bg-[#090d11] px-6 py-3">
            <code className="font-mono text-sm text-[#3ecf8e]">
              npx @polpo-ai/ui add chat
            </code>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#1e2530]">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-[2px]">
              <div className="h-[8px] w-[8px] bg-[#3a3f47]" />
              <div className="ml-[10px] h-[8px] w-[8px] bg-[#3a3f47]" />
            </div>
            <span className="font-mono text-[10px] tracking-[0.15em] text-[#3a3f47]">
              POLPO UI
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://polpo.sh"
              className="text-[10px] text-[#3a3f47] transition-colors hover:text-[#6b7280]"
            >
              polpo.sh
            </a>
            <a
              href="https://github.com/lumea-labs/polpo-ui"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-[#3a3f47] transition-colors hover:text-[#6b7280]"
            >
              GitHub
            </a>
            <a
              href="https://docs.polpo.sh"
              className="text-[10px] text-[#3a3f47] transition-colors hover:text-[#6b7280]"
            >
              Docs
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
