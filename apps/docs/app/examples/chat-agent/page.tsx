import { ChatAgentDemo } from "./demo";
import { CopyButton } from "./copy-button";
import Link from "next/link";

const INSTALL_COMMANDS = [
  { label: "Install component", cmd: "npx shadcn add @polpo-ai/chat" },
  { label: "Install SDK", cmd: "npm install @polpo-ai/react @polpo-ai/sdk" },
];

export default function ChatAgentExamplePage() {
  return (
    <div className="mx-auto w-full max-w-[var(--fd-layout-width)] px-6 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-fd-muted-foreground mb-6">
        <Link href="/examples" className="hover:text-fd-foreground transition-colors">
          Examples
        </Link>
        <span>/</span>
        <span className="text-fd-foreground">Chat Agent</span>
      </div>

      <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.5fr]">
        {/* Left — info */}
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Chat Agent</h1>
          <p className="mt-3 text-sm leading-relaxed text-fd-muted-foreground">
            Full-page chat interface connected to a Polpo agent. Supports
            streaming responses, tool call rendering, session persistence,
            and file uploads.
          </p>

          {/* Install commands */}
          <div className="mt-6 space-y-2">
            {INSTALL_COMMANDS.map(({ label, cmd }) => (
              <div key={cmd}>
                <span className="text-[10px] font-mono uppercase tracking-wider text-fd-muted-foreground/50">
                  {label}
                </span>
                <div className="mt-1 flex items-center gap-3 rounded-lg border border-fd-border bg-fd-card px-4 py-2.5">
                  <code className="flex-1 font-mono text-xs text-fd-primary truncate">
                    {cmd}
                  </code>
                  <CopyButton text={cmd} />
                </div>
              </div>
            ))}
          </div>

          {/* Code */}
          <div className="mt-6 overflow-hidden rounded-xl border border-fd-border bg-fd-card shadow-sm">
            <div className="border-b border-fd-border/50 px-4 py-2">
              <span className="font-mono text-[10px] text-fd-muted-foreground/60">page.tsx</span>
            </div>
            <div className="p-4 overflow-x-auto">
              <pre className="font-mono text-sm leading-7"><code>
<span className="text-[#c586c0]">import</span> <span className="text-fd-foreground">{"{ Chat }"}</span> <span className="text-[#c586c0]">from</span> <span className="text-[#ce9178]">&quot;@polpo-ai/chat&quot;</span>{"\n"}<span className="text-[#c586c0]">import</span> <span className="text-fd-foreground">{"{ PolpoProvider }"}</span> <span className="text-[#c586c0]">from</span> <span className="text-[#ce9178]">&quot;@polpo-ai/react&quot;</span>
{"\n\n"}<span className="text-[#c586c0]">export default</span> <span className="text-[#dcdcaa]">function</span> <span className="text-[#4ec9b0]"> ChatPage</span><span className="text-fd-foreground">() {"{"}</span>
{"\n"}{"  "}<span className="text-[#c586c0]">return</span> <span className="text-fd-foreground">(</span>
{"\n"}{"    "}<span className="text-[#808080]">&lt;</span><span className="text-[#4ec9b0]">PolpoProvider</span> <span className="text-[#9cdcfe]">baseUrl</span><span className="text-fd-foreground">=</span><span className="text-[#ce9178]">&quot;https://api.polpo.sh&quot;</span><span className="text-[#808080]">&gt;</span>
{"\n"}{"      "}<span className="text-[#808080]">&lt;</span><span className="text-[#569cd6]">div</span> <span className="text-[#9cdcfe]">className</span><span className="text-fd-foreground">=</span><span className="text-[#ce9178]">&quot;h-screen&quot;</span><span className="text-[#808080]">&gt;</span>
{"\n"}{"        "}<span className="text-[#808080]">&lt;</span><span className="text-[#4ec9b0]">Chat</span> <span className="text-[#9cdcfe]">agent</span><span className="text-fd-foreground">=</span><span className="text-[#ce9178]">&quot;coder&quot;</span> <span className="text-[#808080]">/&gt;</span>
{"\n"}{"      "}<span className="text-[#808080]">&lt;/</span><span className="text-[#569cd6]">div</span><span className="text-[#808080]">&gt;</span>
{"\n"}{"    "}<span className="text-[#808080]">&lt;/</span><span className="text-[#4ec9b0]">PolpoProvider</span><span className="text-[#808080]">&gt;</span>
{"\n"}{"  "}<span className="text-fd-foreground">)</span>
{"\n"}<span className="text-fd-foreground">{"}"}</span></code></pre>
            </div>
          </div>

          {/* Features */}
          <div className="mt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-fd-muted-foreground/60 mb-3">
              Features
            </h3>
            <ul className="space-y-2 text-sm text-fd-muted-foreground">
              {[
                "Streaming responses with live markdown",
                "Tool call chips (bash, write, read, search)",
                "Session persistence across reloads",
                "Auto-scroll with scroll-to-bottom",
                "Keyboard shortcuts (Enter / Shift+Enter)",
                "File drag-and-drop",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-fd-primary shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div className="mt-6 flex flex-col gap-2">
            <Link
              href="/docs/examples/chat-agent"
              className="inline-flex items-center gap-2 text-sm font-medium text-fd-primary hover:underline"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              Read the docs
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 text-sm text-fd-muted-foreground hover:text-fd-foreground transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
              </svg>
              API reference
            </Link>
          </div>
        </div>

        {/* Right — interactive demo */}
        <div className="sticky top-20">
          <ChatAgentDemo />
        </div>
      </div>
    </div>
  );
}
