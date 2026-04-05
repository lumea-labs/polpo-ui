"use client";

import { useState, useCallback } from "react";
import {
  ChatSessionList,
  ChatUserMessage,
  ChatAssistantMessage,
  type ChatMessageItemData,
} from "@polpo-ai/chat";
import {
  MessageCircle,
  X,
  ArrowLeft,
  Plus,
  Headphones,
  Home as HomeIcon,
  Clock,
  Sun,
  Moon,
  Maximize2,
  Minimize2,
  ArrowUp,
} from "lucide-react";

/* ── CSS vars ────────────────────────────────────────── */

const cssVars: Record<string, string> = {
  "--c-bg": "#FAFAF7", "--c-bg-subtle": "#F2F0EB", "--c-border": "#E5E1DA",
  "--c-ink-3": "#999999", "--c-ink-2": "#555555", "--c-ink": "#111111",
  "--c-surface": "#FFFFFF", "--c-accent": "#E85D3A",
};

/* ── Mock data ───────────────────────────────────────── */

const AGENT_DISPLAY = "AI Assistant";

const mockSessions = [
  { id: "s1", title: "How do I get started?", agent: "assistant", createdAt: "2026-04-03T10:00:00Z", updatedAt: "2026-04-03T14:30:00Z", messageCount: 4 },
  { id: "s2", title: "API integration help", agent: "assistant", createdAt: "2026-04-02T09:00:00Z", updatedAt: "2026-04-02T16:00:00Z", messageCount: 6 },
];

const mockMessages: ChatMessageItemData[] = [
  { id: "m1", role: "user", content: "How do I get started?" },
  { id: "m2", role: "assistant", content: "Welcome! Here's how to get started:\n\n1. **Install the SDK** — `npm install @polpo-ai/chat`\n2. **Add your API key** — set `POLPO_API_KEY` in your `.env`\n3. **Drop in the Chat component** — wrap your app with `<Chat>`\n\nWould you like me to walk you through any of these steps?" },
  { id: "m3", role: "user", content: "Show me the Chat component setup." },
  { id: "m4", role: "assistant", content: "Here's a minimal setup:\n\n```tsx\nimport { Chat, ChatInput } from '@polpo-ai/chat';\n\nexport default function App() {\n  return (\n    <Chat agent=\"assistant\">\n      <ChatInput placeholder=\"Ask anything...\" />\n    </Chat>\n  );\n}\n```\n\nThe `<Chat>` component handles message history, streaming, and state management automatically." },
];

const quickQuestions = [
  "How do I get started?",
  "What are your pricing plans?",
  "I need help with my account",
  "How do I integrate the API?",
];

/* ── Mock input ──────────────────────────────────────── */

function MockWidgetInput() {
  return (
    <div className="shrink-0 px-3 py-2">
      <div className="flex items-end gap-2 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)] px-3 py-2">
        <textarea rows={1} placeholder={`Message ${AGENT_DISPLAY}...`} className="flex-1 resize-none bg-transparent text-sm text-[var(--c-ink)] placeholder:text-[var(--c-ink-3)] outline-none" readOnly />
        <button className="flex items-center justify-center size-7 rounded-lg bg-[var(--c-accent)] text-white shrink-0"><ArrowUp className="size-3.5" /></button>
      </div>
    </div>
  );
}

/* ── Size classes ────────────────────────────────────── */

type WidgetSize = "default" | "large" | "fullscreen";
type WidgetTab = "home" | "sessions";
type ChatView = { type: "new" } | { type: "session"; sessionId: string } | null;

const sizeClasses: Record<WidgetSize, string> = {
  default: "fixed bottom-24 right-6 w-[420px] h-[620px] rounded-2xl",
  large: "fixed bottom-24 right-6 w-[520px] h-[720px] rounded-2xl",
  fullscreen: "fixed inset-4 w-auto h-auto rounded-2xl",
};

/* ── Welcome view ────────────────────────────────────── */

function NewChatWelcome({ onQuestion }: { onQuestion: (q: string) => void }) {
  return (
    <div className="flex-1 flex flex-col px-5 py-8">
      <h3 className="text-base font-semibold mb-1">{AGENT_DISPLAY}</h3>
      <p className="text-sm text-[var(--c-ink-3)] mb-6">Ask me anything — I usually reply instantly.</p>
      <div className="space-y-1.5">
        {quickQuestions.map((q) => (
          <button key={q} type="button" onClick={() => onQuestion(q)}
            className="flex items-center w-full px-3.5 py-2.5 rounded-lg border border-[var(--c-border)] text-sm text-[var(--c-ink-2)] text-left hover:bg-[var(--c-bg-subtle)] hover:text-[var(--c-ink)] transition-colors">{q}</button>
        ))}
      </div>
    </div>
  );
}

function ConversationMessages() {
  return (
    <div className="flex-1 overflow-y-auto">
      {mockMessages.map((msg) => msg.role === "user"
        ? <ChatUserMessage key={msg.id} msg={msg} />
        : <ChatAssistantMessage key={msg.id} msg={msg} agentName={AGENT_DISPLAY} />
      )}
    </div>
  );
}

/* ── Home tab ────────────────────────────────────────── */

function HomeTab({ onNewChat }: { onNewChat: () => void }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-5 pt-6 pb-5 bg-[var(--c-accent)] text-white">
        <h2 className="text-lg font-bold mb-1">Hi there</h2>
        <p className="text-sm text-white/80">Ask us anything — we usually reply instantly.</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5 py-8">
        <div className="size-12 rounded-2xl bg-[var(--c-accent)]/10 flex items-center justify-center mb-4">
          <MessageCircle className="size-6 text-[var(--c-accent)]" />
        </div>
        <p className="text-sm text-[var(--c-ink-2)] mb-5 text-center">Start a new conversation with our AI assistant</p>
        <button
          onClick={onNewChat}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--c-accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="size-4" /> New conversation
        </button>
      </div>
    </div>
  );
}

/* ── Sessions tab ────────────────────────────────────── */

function SessionsTab({ onSelectSession }: { onSelectSession: (id: string) => void }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--c-ink-3)]">
          Your conversations
        </p>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <ChatSessionList
          sessions={mockSessions as any}
          onSelect={onSelectSession}
          emptyMessage="No conversations yet"
        />
      </div>
    </div>
  );
}

/* ── Direct widget ───────────────────────────────────── */

function DirectWidget() {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<WidgetSize>("default");
  const [showConversation, setShowConversation] = useState(false);

  const cycleSize = useCallback(() => {
    setSize((s) => s === "default" ? "large" : s === "large" ? "fullscreen" : "default");
  }, []);

  return (
    <>
      {open && (
        <div className={`z-50 ${sizeClasses[size]} border border-[var(--c-border)] bg-[var(--c-bg)] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden`}>
          <div className="flex items-center gap-2 px-4 h-14 border-b border-[var(--c-border)] shrink-0">
            <div className="size-8 rounded-lg bg-[var(--c-accent)] flex items-center justify-center">
              <Headphones className="size-4 text-white" />
            </div>
            <span className="text-sm font-semibold flex-1">{AGENT_DISPLAY}</span>
            <button onClick={cycleSize} className="size-8 rounded-lg flex items-center justify-center text-[var(--c-ink-3)] hover:text-[var(--c-ink)] hover:bg-[var(--c-bg-subtle)] transition-colors">
              {size === "fullscreen" ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
            </button>
            <button onClick={() => { setOpen(false); setSize("default"); setShowConversation(false); }} className="size-8 rounded-lg flex items-center justify-center text-[var(--c-ink-3)] hover:text-[var(--c-ink)] hover:bg-[var(--c-bg-subtle)] transition-colors">
              <X className="size-4" />
            </button>
          </div>
          {showConversation ? (
            <div className="flex-1 min-h-0 flex flex-col">
              <ConversationMessages />
              <MockWidgetInput />
            </div>
          ) : (
            <NewChatWelcome onQuestion={() => setShowConversation(true)} />
          )}
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-50 rounded-full shadow-[0_8px_32px_rgba(20,184,166,0.35)] transition-all flex items-center justify-center ${
          open
            ? "size-12 bg-[var(--c-ink-3)] hover:bg-[var(--c-ink-2)]"
            : "size-14 bg-[var(--c-accent)] hover:scale-105 hover:shadow-[0_12px_40px_rgba(20,184,166,0.45)]"
        }`}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? <X className="size-5 text-white" /> : <MessageCircle className="size-6 text-white" />}
      </button>
    </>
  );
}

/* ── Full widget (with history) ──────────────────────── */

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<WidgetTab>("home");
  const [chatView, setChatView] = useState<ChatView>(null);
  const [size, setSize] = useState<WidgetSize>("default");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const cycleSize = useCallback(() => {
    setSize((s) => s === "default" ? "large" : s === "large" ? "fullscreen" : "default");
  }, []);

  const openNewChat = useCallback(() => setChatView({ type: "new" }), []);
  const openSession = useCallback((id: string) => setChatView({ type: "session", sessionId: id }), []);
  const goBack = useCallback(() => setChatView(null), []);

  const inChat = chatView !== null;

  return (
    <>
      {open && (
        <div className={`z-50 ${sizeClasses[size]} border border-[var(--c-border)] bg-[var(--c-bg)] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden`}>
          <div className="flex items-center gap-2 px-4 h-14 border-b border-[var(--c-border)] shrink-0">
            {inChat && (
              <button onClick={goBack} className="size-8 rounded-lg flex items-center justify-center text-[var(--c-ink-3)] hover:text-[var(--c-ink)] hover:bg-[var(--c-bg-subtle)] transition-colors">
                <ArrowLeft className="size-4" />
              </button>
            )}
            {!inChat && (
              <div className="size-8 rounded-lg bg-[var(--c-accent)] flex items-center justify-center">
                <Headphones className="size-4 text-white" />
              </div>
            )}
            <span className="text-sm font-semibold flex-1">
              {inChat ? AGENT_DISPLAY : tab === "home" ? "Support" : "Messages"}
            </span>
            {!inChat && (
              <button onClick={openNewChat} className="size-8 rounded-lg flex items-center justify-center text-[var(--c-ink-3)] hover:text-[var(--c-ink)] hover:bg-[var(--c-bg-subtle)] transition-colors">
                <Plus className="size-4" />
              </button>
            )}
            <button onClick={cycleSize} className="size-8 rounded-lg flex items-center justify-center text-[var(--c-ink-3)] hover:text-[var(--c-ink)] hover:bg-[var(--c-bg-subtle)] transition-colors" aria-label="Resize">
              {size === "fullscreen" ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
            </button>
            <button onClick={() => setOpen(false)} className="size-8 rounded-lg flex items-center justify-center text-[var(--c-ink-3)] hover:text-[var(--c-ink)] hover:bg-[var(--c-bg-subtle)] transition-colors">
              <X className="size-4" />
            </button>
          </div>

          {inChat ? (
            <div className="flex-1 min-h-0 flex flex-col">
              <ConversationMessages />
              <MockWidgetInput />
            </div>
          ) : (
            <>
              {tab === "home" ? (
                <HomeTab onNewChat={openNewChat} />
              ) : (
                <SessionsTab onSelectSession={openSession} />
              )}
            </>
          )}

          {!inChat && (
            <div className="flex border-t border-[var(--c-border)] shrink-0">
              {([["home", HomeIcon, "Home"], ["sessions", Clock, "Messages"]] as const).map(([key, Icon, label]) => (
                <button key={key} onClick={() => setTab(key as WidgetTab)}
                  className={`flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors ${tab === key ? "text-[var(--c-accent)]" : "text-[var(--c-ink-3)] hover:text-[var(--c-ink-2)]"}`}>
                  <Icon className="size-4" />{label}
                </button>
              ))}
              <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-medium text-[var(--c-ink-3)] hover:text-[var(--c-ink-2)] transition-colors">
                {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}Theme
              </button>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-50 rounded-full shadow-[0_8px_32px_rgba(20,184,166,0.35)] transition-all flex items-center justify-center ${
          open
            ? "size-12 bg-[var(--c-ink-3)] hover:bg-[var(--c-ink-2)]"
            : "size-14 bg-[var(--c-accent)] hover:scale-105 hover:shadow-[0_12px_40px_rgba(20,184,166,0.45)]"
        }`}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? <X className="size-5 text-white" /> : <MessageCircle className="size-6 text-white" />}
      </button>
    </>
  );
}

/* ── Page ────────────────────────────────────────────── */

export default function ExamplesChatWidget() {
  const [variant, setVariant] = useState<"direct" | "history" | "embedded">("direct");
  const [embeddedShowConversation, setEmbeddedShowConversation] = useState(false);

  return (
    <div style={cssVars as React.CSSProperties} className="font-sans" >
      <div
        className={`min-h-screen flex flex-col items-center justify-center px-8 transition-all ${variant === "embedded" ? "mr-[420px]" : ""}`}
        style={{ background: "var(--c-bg)", color: "var(--c-ink)" }}
      >
        <div className="max-w-lg text-center">
          <p className="text-xs font-medium text-[var(--c-accent)] uppercase tracking-widest mb-4">@polpo-ai/chat example</p>
          <h1 className="text-4xl font-bold tracking-tight mb-3">Support Widget</h1>
          <p className="text-base text-[var(--c-ink-2)] leading-relaxed mb-8">
            Three ways to embed AI support into your product.
          </p>

          <div className="flex justify-center gap-1 rounded-full bg-[var(--c-bg-subtle)] p-1 border border-[var(--c-border)] mx-auto w-fit">
            {([
              { key: "direct", label: "Floating Widget" },
              { key: "history", label: "Widget + History" },
              { key: "embedded", label: "Embedded Panel" },
            ] as const).map((v) => (
              <button
                key={v.key}
                onClick={() => { setVariant(v.key); setEmbeddedShowConversation(false); }}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  variant === v.key
                    ? "bg-[var(--c-accent)] text-white shadow-sm"
                    : "text-[var(--c-ink-3)] hover:text-[var(--c-ink)]"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {variant === "direct" && <DirectWidget />}
        {variant === "history" && <ChatWidget />}
        {variant === "embedded" && (
          <div className="fixed top-0 right-0 w-[420px] h-screen border-l border-[var(--c-border)] bg-[var(--c-bg)] z-50 flex flex-col">
            <div className="flex items-center gap-2 px-4 h-14 border-b border-[var(--c-border)] shrink-0">
              <div className="size-8 rounded-lg bg-[var(--c-accent)] flex items-center justify-center">
                <Headphones className="size-4 text-white" />
              </div>
              <span className="text-sm font-semibold flex-1">{AGENT_DISPLAY}</span>
              <button onClick={() => setVariant("direct")} className="size-8 rounded-lg flex items-center justify-center text-[var(--c-ink-3)] hover:text-[var(--c-ink)] hover:bg-[var(--c-bg-subtle)] transition-colors" aria-label="Close panel">
                <X className="size-4" />
              </button>
            </div>
            {embeddedShowConversation ? (
              <div className="flex-1 min-h-0 flex flex-col">
                <ConversationMessages />
                <MockWidgetInput />
              </div>
            ) : (
              <NewChatWelcome onQuestion={() => setEmbeddedShowConversation(true)} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
