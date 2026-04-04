"use client";

import { useState, useRef, useCallback } from "react";
import {
  ChatUserMessage,
  ChatAssistantMessage,
  ChatSessionList,
  ChatSuggestions,
} from "@polpo-ai/chat";
import type { ChatMessageItemData } from "@polpo-ai/chat";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const ts = (minAgo: number) => new Date(Date.now() - minAgo * 60_000).toISOString();

// --- Chat example ------------------------------------------------- */

const chatConversations: Record<string, ChatMessageItemData[]> = {
  s1: [
    { id: "u1", role: "user", content: "Can you add a users table with email and role fields?", ts: ts(12) },
    { id: "a1", role: "assistant", content: "I've created the `users` table with the following schema:\n\n```sql\nCREATE TABLE users (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  email TEXT UNIQUE NOT NULL,\n  role TEXT NOT NULL DEFAULT 'member',\n  created_at TIMESTAMPTZ DEFAULT now()\n);\n```\n\nThe migration has been applied. You can now query it via the API.", ts: ts(11) },
    { id: "u2", role: "user", content: "Add an index on the email column", ts: ts(5) },
    { id: "a2", role: "assistant", content: "Done. I've added a unique index on `email`:\n\n```sql\nCREATE UNIQUE INDEX idx_users_email ON users (email);\n```", ts: ts(4) },
  ],
  s2: [
    { id: "u3", role: "user", content: "Write a function that sends a welcome email after signup", ts: ts(60) },
    { id: "a3", role: "assistant", content: "Here's a `sendWelcomeEmail` function using Resend:\n\n```ts\nimport { Resend } from 'resend';\n\nconst resend = new Resend(process.env.RESEND_API_KEY);\n\nexport async function sendWelcomeEmail(to: string, name: string) {\n  await resend.emails.send({\n    from: 'hello@acme.com',\n    to,\n    subject: `Welcome, ${name}!`,\n    html: `<p>Thanks for signing up.</p>`,\n  });\n}\n```\n\nCall it from your signup handler after inserting the user.", ts: ts(58) },
  ],
  s3: [
    { id: "u4", role: "user", content: "How do I deploy this to Vercel?", ts: ts(120) },
    { id: "a4", role: "assistant", content: "Push your repo to GitHub, then:\n\n1. Go to vercel.com/new\n2. Import your repository\n3. Set the environment variables (`DATABASE_URL`, `RESEND_API_KEY`)\n4. Click Deploy\n\nVercel will auto-detect the Next.js framework and build it.", ts: ts(119) },
  ],
  s4: [
    { id: "u5", role: "user", content: "Generate TypeScript types from my schema", ts: ts(200) },
    { id: "a5", role: "assistant", content: "Based on your schema, here are the generated types:\n\n```ts\nexport interface User {\n  id: string;\n  email: string;\n  role: 'admin' | 'member';\n  createdAt: Date;\n}\n```", ts: ts(198) },
  ],
};

const chatSessions = [
  { id: "s1", title: "Users table migration", agent: "assistant", updatedAt: ts(4) },
  { id: "s2", title: "Welcome email function", agent: "assistant", updatedAt: ts(58) },
  { id: "s3", title: "Vercel deployment", agent: "assistant", updatedAt: ts(119) },
  { id: "s4", title: "Schema type generation", agent: "assistant", updatedAt: ts(198) },
] as any[];

// --- Widget example ----------------------------------------------- */

const widgetSuggestions = [
  { text: "What are your pricing plans?" },
  { text: "How do I reset my password?" },
  { text: "Talk to a human" },
];

const widgetConversation: ChatMessageItemData[] = [
  { id: "w1", role: "user", content: "What are your pricing plans?", ts: ts(2) },
  { id: "w2", role: "assistant", content: "We offer three plans:\n\n- **Starter** -- Free, up to 1k messages/mo\n- **Pro** -- $29/mo, unlimited messages, priority support\n- **Enterprise** -- Custom pricing, SLA, dedicated infra\n\nWould you like to start a free trial?", ts: ts(1) },
];

// --- Multi-agent example ------------------------------------------ */

const multiAgentConversations: Record<string, { agent: string; msgs: ChatMessageItemData[] }> = {
  ma1: {
    agent: "marco_rossi",
    msgs: [
      { id: "m1", role: "user", content: "Marco, review the Q4 revenue report", ts: ts(30) },
      { id: "m2", role: "assistant", content: "I've reviewed the Q4 report. Key findings:\n\n- Revenue up **18%** QoQ ($2.4M to $2.8M)\n- Churn decreased from 4.2% to 3.1%\n- Top growth segment: Enterprise (+32%)\n\nI recommend focusing expansion efforts on the Enterprise tier.", ts: ts(28) },
    ],
  },
  ma2: {
    agent: "marco_rossi",
    msgs: [
      { id: "m3", role: "user", content: "Draft a summary for the board meeting", ts: ts(90) },
      { id: "m4", role: "assistant", content: "Here's a draft executive summary:\n\n> Q4 showed strong momentum across all segments. We closed 12 new Enterprise deals and reduced churn by 1.1 points. The product roadmap for Q1 focuses on AI features and self-serve onboarding.\n\nShall I expand any section?", ts: ts(88) },
    ],
  },
  ma3: {
    agent: "assistant",
    msgs: [
      { id: "m5", role: "user", content: "Schedule a follow-up with the design team next Tuesday", ts: ts(150) },
      { id: "m6", role: "assistant", content: "I've added a 30-minute meeting with the design team for next Tuesday at 10:00 AM. I sent calendar invites to Sara, Luca, and Francesca.\n\nWant me to attach the Q4 report to the invite?", ts: ts(148) },
    ],
  },
};

const multiAgentSessions = [
  { id: "ma1", title: "Q4 revenue review", agent: "marco_rossi", updatedAt: ts(28) },
  { id: "ma2", title: "Board meeting summary", agent: "marco_rossi", updatedAt: ts(88) },
  { id: "ma3", title: "Design team follow-up", agent: "assistant", updatedAt: ts(148) },
] as any[];

/* ------------------------------------------------------------------ */
/*  Examples config                                                    */
/* ------------------------------------------------------------------ */

const examples = [
  {
    slug: "chat",
    title: "Chat",
    description: "Full-page chat with sidebar, session history, and markdown rendering.",
    sourceUrl: "https://github.com/lumea-labs/polpo-ui/tree/main/examples/chat",
    command: "npx create-polpo-app --template chat -y",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
  },
  {
    slug: "chat-widget",
    title: "Chat Widget",
    description: "Floating chat bubble that opens a compact widget panel.",
    sourceUrl: "https://github.com/lumea-labs/polpo-ui/tree/main/examples/chat-widget",
    command: "npx create-polpo-app --template chat-widget -y",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
      </svg>
    ),
  },
  {
    slug: "multi-agent",
    title: "Multi-Agent",
    description: "Conductor-style layout with grouped agents and session switching.",
    sourceUrl: "https://github.com/lumea-labs/polpo-ui/tree/main/examples/multi-agent",
    command: "npx create-polpo-app --template multi-agent -y",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  Shared mock input bar                                              */
/* ------------------------------------------------------------------ */

function MockInput({ dark }: { dark?: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-4 py-3 border-t ${dark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"}`}>
      <div className={`flex-1 rounded-xl px-4 py-2.5 text-sm ${dark ? "bg-gray-800 text-gray-500" : "bg-gray-100 text-gray-400"}`}>
        Type a message...
      </div>
      <div className={`flex items-center justify-center size-8 rounded-lg ${dark ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-500"}`}>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Example 1: Chat preview                                            */
/* ------------------------------------------------------------------ */

function ChatPreview() {
  const [activeSession, setActiveSession] = useState("s1");
  const msgs = chatConversations[activeSession] || [];

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 bg-gray-50 flex flex-col shrink-0">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Chats</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <ChatSessionList
            sessions={chatSessions}
            activeSessionId={activeSession}
            onSelect={setActiveSession}
          />
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <div className="flex-1 overflow-y-auto">
          {msgs.map((m) => (
            m.role === "user"
              ? <ChatUserMessage key={m.id} msg={m} />
              : <ChatAssistantMessage key={m.id} msg={m} />
          ))}
        </div>
        <MockInput />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Example 2: Chat Widget preview                                     */
/* ------------------------------------------------------------------ */

function WidgetPreview() {
  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);

  const handleSuggestion = useCallback(() => setStarted(true), []);

  return (
    <div className="relative h-full bg-gray-50 flex items-center justify-center">
      {/* Page content */}
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Acme.</h2>
        <p className="mt-2 text-sm text-gray-500">Your all-in-one platform</p>
      </div>

      {/* Bubble */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="absolute bottom-4 right-4 flex items-center justify-center size-12 rounded-full bg-gray-900 text-white shadow-lg hover:scale-105 transition-transform"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        </button>
      )}

      {/* Widget panel */}
      {open && (
        <div className="absolute bottom-4 right-4 w-[380px] h-[460px] rounded-2xl border border-gray-200 bg-white shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-gray-900 text-white flex items-center justify-center text-xs font-bold">A</div>
              <span className="text-sm font-semibold text-gray-900">Acme Support</span>
            </div>
            <button onClick={() => { setOpen(false); setStarted(false); }} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            {!started ? (
              <div className="flex flex-col items-center justify-center h-full px-6">
                <div className="size-10 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">Hi there!</p>
                <p className="text-xs text-gray-500 mb-5 text-center">How can we help you today?</p>
                <ChatSuggestions
                  suggestions={widgetSuggestions}
                  onSelect={handleSuggestion}
                  columns={1}
                />
              </div>
            ) : (
              <div>
                {widgetConversation.map((m) => (
                  m.role === "user"
                    ? <ChatUserMessage key={m.id} msg={m} />
                    : <ChatAssistantMessage key={m.id} msg={m} />
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <MockInput />
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Example 3: Multi-Agent preview                                     */
/* ------------------------------------------------------------------ */

function MultiAgentSidebar({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const toggle = (name: string) => setCollapsed((p) => ({ ...p, [name]: !p[name] }));

  const groups = [
    {
      name: "Marco Rossi",
      letter: "M",
      sessions: multiAgentSessions.filter((s: any) => s.agent === "marco_rossi"),
    },
    {
      name: "Assistant",
      letter: "A",
      sessions: multiAgentSessions.filter((s: any) => s.agent === "assistant"),
    },
  ];

  return (
    <div className="w-72 border-r border-gray-700 bg-gray-900 flex flex-col shrink-0">
      <div className="px-4 py-3 border-b border-gray-700">
        <h3 className="text-sm font-semibold text-gray-200">Agents</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {groups.map((g) => (
          <div key={g.name}>
            <button
              onClick={() => toggle(g.name)}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-left text-xs font-semibold text-gray-400 hover:text-gray-200 transition-colors"
            >
              <div className="size-6 rounded-md bg-gray-700 text-gray-300 flex items-center justify-center text-[10px] font-bold">
                {g.letter}
              </div>
              <span className="flex-1">{g.name}</span>
              <svg
                className={`h-3 w-3 transition-transform ${collapsed[g.name] ? "-rotate-90" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {!collapsed[g.name] && (
              <div className="ml-2 space-y-0.5">
                {g.sessions.map((s: any) => (
                  <button
                    key={s.id}
                    onClick={() => onSelect(s.id)}
                    className={`flex items-center w-full px-3 py-2 rounded-lg text-xs text-left transition-colors ${
                      s.id === activeId
                        ? "bg-gray-800 text-gray-100"
                        : "text-gray-500 hover:bg-gray-800/50 hover:text-gray-300"
                    }`}
                  >
                    <span className="truncate">{s.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MultiAgentPreview() {
  const [activeSession, setActiveSession] = useState("ma1");
  const conv = multiAgentConversations[activeSession];
  const msgs = conv?.msgs || [];
  const agentName = conv?.agent === "marco_rossi" ? "Marco Rossi" : "Assistant";

  return (
    <div className="flex h-full">
      <MultiAgentSidebar activeId={activeSession} onSelect={setActiveSession} />
      <div className="flex-1 flex flex-col min-w-0 bg-gray-950">
        <div className="flex-1 overflow-y-auto">
          {msgs.map((m) => (
            m.role === "user"
              ? <ChatUserMessage key={m.id} msg={m} className="[&_*]:!text-gray-300 [&_.bg-gray-100]:!bg-gray-800" />
              : <ChatAssistantMessage key={m.id} msg={m} agentName={agentName} className="[&_*]:!text-gray-300 [&_.text-gray-900]:!text-gray-200" />
          ))}
        </div>
        <MockInput dark />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Preview renderers                                                  */
/* ------------------------------------------------------------------ */

const previewComponents: Record<string, () => React.ReactNode> = {
  chat: ChatPreview,
  "chat-widget": WidgetPreview,
  "multi-agent": MultiAgentPreview,
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ExamplesPage() {
  const [active, setActive] = useState(0);
  const [showInstall, setShowInstall] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const ex = examples[active];

  const selectTab = (i: number) => {
    setActive(i);
    setShowInstall(false);
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const Preview = previewComponents[ex.slug];

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 py-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-fd-primary">
        Examples
      </p>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">
        Starter projects
      </h1>
      <p className="mt-3 text-sm text-fd-muted-foreground">
        Clone a full project, set your API key, and run. Each example is a standalone Next.js app you can deploy anywhere.
      </p>

      {/* Horizontal tabs */}
      <div ref={cardRef} className="mt-10 flex gap-2 overflow-x-auto pb-1 scroll-mt-20">
        {examples.map((item, i) => (
          <button
            key={item.title}
            onClick={() => selectTab(i)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              i === active
                ? "bg-fd-primary/10 text-fd-foreground"
                : "text-fd-muted-foreground hover:bg-fd-muted/30 hover:text-fd-foreground"
            }`}
          >
            <span className={i === active ? "text-fd-primary" : ""}>{item.icon}</span>
            {item.title}
          </button>
        ))}
      </div>

      {/* Selected example */}
      <div className="mt-4">
        <div className="rounded-xl border border-fd-border bg-fd-card overflow-hidden">
          {/* Info bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-fd-border/50">
            <div className="flex items-center gap-2">
              <div className="text-fd-primary">{ex.icon}</div>
              <h2 className="text-sm font-bold">{ex.title}</h2>
              <span className="text-xs text-fd-muted-foreground">{ex.description}</span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={ex.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-fd-muted-foreground hover:text-fd-foreground transition-colors"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Source
              </a>
              <button
                onClick={() => setShowInstall(!showInstall)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-fd-foreground text-fd-background px-3 py-1.5 text-xs font-medium hover:opacity-80 transition-opacity"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Clone
              </button>
            </div>
          </div>

          {/* Preview area */}
          <div className="bg-fd-muted/20 h-[480px] overflow-hidden relative">
            {Preview && <Preview />}

            {/* Install overlay */}
            {showInstall && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-fd-background/90 backdrop-blur-sm">
                <div className="text-center mx-auto">
                  <p className="text-xs text-fd-muted-foreground mb-3">Run this command to clone the project:</p>
                  <div className="flex items-center gap-3 rounded-xl border border-fd-border bg-fd-card px-5 py-3">
                    <code className="font-mono text-sm text-fd-primary text-left pr-4">
                      {ex.command}
                    </code>
                    <button
                      onClick={async () => {
                        try { await navigator.clipboard.writeText(ex.command); } catch {}
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
