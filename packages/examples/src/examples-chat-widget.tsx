"use client";

import { useState, useCallback } from "react";
import { ChatInput, ChatSessionList, ChatSuggestions, ChatUserMessage, ChatAssistantMessage, streamdownComponents, useChatContext, type ChatMessageItemData } from "@polpo-ai/chat";
import { MockChatProvider } from "./mock-provider";
import { MessageCircle, X, ArrowLeft, Plus, Headphones, Home as HomeIcon, Clock, Sun, Moon, Maximize2, Minimize2 } from "lucide-react";

/* ── CSS vars (teal palette) ────────────────────────── */

const cssVars: Record<string, string> = {
  "--c-bg": "#F8FAFB", "--c-bg-subtle": "#F0F3F5", "--c-border": "#E2E8F0",
  "--c-border-2": "#CBD5E1", "--c-ink-3": "#94A3B8", "--c-ink-2-5": "#64748B",
  "--c-ink-2": "#475569", "--c-ink": "#0F172A", "--c-surface": "#FFFFFF",
  "--c-accent-soft": "#F0FDFA", "--c-accent-light": "#5EEAD4",
  "--c-accent": "#14B8A6", "--c-accent-dark": "#0D9488",
  "--c-accent-darker": "#0F766E", "--c-green": "#16A34A",
  "--c-green-dark": "#15803D", "--c-red-soft": "#FEF2F2",
  "--c-red-light": "#FCA5A5", "--c-red": "#EF4444",
};

/* ── Constants & mock data ──────────────────────────── */

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
  { text: "How do I get started?" },
  { text: "What are your pricing plans?" },
  { text: "I need help with my account" },
  { text: "How do I integrate the API?" },
];

/* ── Size classes ───────────────────────────────────── */

type WidgetSize = "default" | "large" | "fullscreen";
type WidgetTab = "home" | "sessions";
type ChatView = { type: "new" } | { type: "session"; sessionId: string } | null;

const sizeClasses: Record<WidgetSize, string> = {
  default: "fixed bottom-24 right-6 w-[420px] h-[620px] rounded-2xl",
  large: "fixed bottom-24 right-6 w-[520px] h-[720px] rounded-2xl",
  fullscreen: "fixed inset-4 w-auto h-auto rounded-2xl",
};

/* ── Shared inner components (consume ChatContext) ──── */

function ConversationView() {
  const { messages } = useChatContext();
  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((msg) => msg.role === "user"
        ? <ChatUserMessage key={msg.id} msg={msg} />
        : <ChatAssistantMessage key={msg.id} msg={msg} streamdownComponents={streamdownComponents} agentName={AGENT_DISPLAY} />
      )}
    </div>
  );
}

function NewChatWelcome() {
  const { messages, sendMessage } = useChatContext();
  if (messages.length > 0) return null;
  return (
    <div className="flex-1 flex flex-col px-5 py-8">
      <h3 className="text-base font-semibold mb-1">{AGENT_DISPLAY}</h3>
      <p className="text-sm mb-6" style={{ color: "var(--c-ink-3)" }}>Ask me anything — I usually reply instantly.</p>
      <ChatSuggestions suggestions={quickQuestions} onSelect={(text) => sendMessage(text)} columns={1} />
    </div>
  );
}

function WidgetInput() {
  return (
    <ChatInput placeholder={`Message ${AGENT_DISPLAY}...`} allowAttachments={false} className="[&>div]:px-3 [&>div]:py-2 [&>div>div]:max-w-none" />
  );
}

function ChatBody() {
  const { messages } = useChatContext();
  return (
    <div className="flex-1 min-h-0 flex flex-col">
      {messages.length === 0 ? <NewChatWelcome /> : <ConversationView />}
      <WidgetInput />
    </div>
  );
}

/* ── Home & Sessions tabs ───────────────────────────── */

function HomeTab({ onNewChat }: { onNewChat: () => void }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-5 pt-6 pb-5 text-white" style={{ backgroundColor: "var(--c-accent)" }}>
        <h2 className="text-lg font-bold mb-1">Hi there 👋</h2>
        <p className="text-sm text-white/80">Ask us anything — we usually reply instantly.</p>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-8">
        <div className="size-12 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: "color-mix(in srgb, var(--c-accent) 10%, transparent)" }}>
          <MessageCircle className="size-6" style={{ color: "var(--c-accent)" }} />
        </div>
        <p className="text-sm mb-5 text-center" style={{ color: "var(--c-ink-2)" }}>Start a new conversation with our AI assistant</p>
        <button onClick={onNewChat} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium hover:opacity-90 transition-opacity" style={{ backgroundColor: "var(--c-accent)" }}>
          <Plus className="size-4" /> New conversation
        </button>
      </div>
    </div>
  );
}

function SessionsTab({ onSelectSession }: { onSelectSession: (id: string) => void }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--c-ink-3)" }}>Your conversations</p>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <ChatSessionList sessions={mockSessions as any} onSelect={onSelectSession} emptyMessage="No conversations yet" />
      </div>
    </div>
  );
}

/* ── Direct widget (floating, no home/sessions) ─────── */

function DirectWidget() {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<WidgetSize>("default");

  const cycleSize = useCallback(() => {
    setSize((s) => s === "default" ? "large" : s === "large" ? "fullscreen" : "default");
  }, []);

  return (
    <>
      {open && (
        <div
          className={`z-50 animate-slide-up ${sizeClasses[size]} border flex flex-col overflow-hidden`}
          style={{ borderColor: "var(--c-border)", backgroundColor: "var(--c-bg)", boxShadow: "0 24px 80px -12px rgba(0,0,0,0.2)" }}
        >
          <div className="flex items-center gap-2 px-4 h-14 border-b shrink-0" style={{ borderColor: "var(--c-border)" }}>
            <div className="size-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--c-accent)" }}>
              <Headphones className="size-4 text-white" />
            </div>
            <span className="text-sm font-semibold flex-1">{AGENT_DISPLAY}</span>
            <button onClick={cycleSize} className="size-8 rounded-lg flex items-center justify-center widget-icon-btn transition-colors">
              {size === "fullscreen" ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
            </button>
            <button onClick={() => { setOpen(false); setSize("default"); }} className="size-8 rounded-lg flex items-center justify-center widget-icon-btn transition-colors">
              <X className="size-4" />
            </button>
          </div>
          <MockChatProvider initialMessages={mockMessages}>
            <ChatBody />
          </MockChatProvider>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-50 rounded-full shadow-[0_8px_32px_rgba(20,184,166,0.35)] transition-all flex items-center justify-center ${
          open ? "size-12 fab-close-btn" : "size-14 fab-open-btn hover:scale-105 hover:shadow-[0_12px_40px_rgba(20,184,166,0.45)]"
        }`}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? <X className="size-5 text-white" /> : <MessageCircle className="size-6 text-white" />}
      </button>
    </>
  );
}

/* ── Full widget (with home + history tabs) ──────────── */

function FullWidget() {
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
        <div
          className={`z-50 animate-slide-up ${sizeClasses[size]} border flex flex-col overflow-hidden`}
          style={{ borderColor: "var(--c-border)", backgroundColor: "var(--c-bg)", boxShadow: "0 24px 80px -12px rgba(0,0,0,0.2)" }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 px-4 h-14 border-b shrink-0" style={{ borderColor: "var(--c-border)" }}>
            {inChat && (
              <button onClick={goBack} className="size-8 rounded-lg flex items-center justify-center widget-icon-btn transition-colors">
                <ArrowLeft className="size-4" />
              </button>
            )}
            {!inChat && (
              <div className="size-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--c-accent)" }}>
                <Headphones className="size-4 text-white" />
              </div>
            )}
            <span className="text-sm font-semibold flex-1">
              {inChat ? AGENT_DISPLAY : tab === "home" ? "Support" : "Messages"}
            </span>
            {!inChat && (
              <button onClick={openNewChat} className="size-8 rounded-lg flex items-center justify-center widget-icon-btn transition-colors">
                <Plus className="size-4" />
              </button>
            )}
            <button onClick={cycleSize} className="size-8 rounded-lg flex items-center justify-center widget-icon-btn transition-colors" aria-label="Resize">
              {size === "fullscreen" ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
            </button>
            <button onClick={() => setOpen(false)} className="size-8 rounded-lg flex items-center justify-center widget-icon-btn transition-colors">
              <X className="size-4" />
            </button>
          </div>

          {/* Body */}
          {inChat ? (
            <MockChatProvider
              key={chatView.type === "session" ? chatView.sessionId : "new"}
              initialMessages={chatView.type === "session" ? mockMessages : []}
            >
              <ChatBody />
            </MockChatProvider>
          ) : (
            <>
              {tab === "home" ? (
                <HomeTab onNewChat={openNewChat} />
              ) : (
                <SessionsTab onSelectSession={openSession} />
              )}
            </>
          )}

          {/* Bottom navbar */}
          {!inChat && (
            <div className="flex border-t shrink-0" style={{ borderColor: "var(--c-border)" }}>
              {([["home", HomeIcon, "Home"], ["sessions", Clock, "Messages"]] as const).map(([key, Icon, label]) => (
                <button
                  key={key}
                  onClick={() => setTab(key as WidgetTab)}
                  className={`flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors ${tab === key ? "tab-active" : "tab-inactive"}`}
                >
                  <Icon className="size-4" />{label}
                </button>
              ))}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-medium tab-inactive transition-colors"
              >
                {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}Theme
              </button>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-50 rounded-full shadow-[0_8px_32px_rgba(20,184,166,0.35)] transition-all flex items-center justify-center ${
          open ? "size-12 fab-close-btn" : "size-14 fab-open-btn hover:scale-105 hover:shadow-[0_12px_40px_rgba(20,184,166,0.45)]"
        }`}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? <X className="size-5 text-white" /> : <MessageCircle className="size-6 text-white" />}
      </button>
    </>
  );
}

/* ── Embedded panel ─────────────────────────────────── */

function EmbeddedPanel({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed top-0 right-0 w-[420px] h-screen border-l z-50 flex flex-col"
      style={{ borderColor: "var(--c-border)", backgroundColor: "var(--c-bg)" }}
    >
      <div className="flex items-center gap-2 px-4 h-14 border-b shrink-0" style={{ borderColor: "var(--c-border)" }}>
        <div className="size-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--c-accent)" }}>
          <Headphones className="size-4 text-white" />
        </div>
        <span className="text-sm font-semibold flex-1">{AGENT_DISPLAY}</span>
        <button onClick={onClose} className="size-8 rounded-lg flex items-center justify-center widget-icon-btn transition-colors" aria-label="Close panel">
          <X className="size-4" />
        </button>
      </div>
      <MockChatProvider initialMessages={mockMessages}>
        <ChatBody />
      </MockChatProvider>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────── */

export default function ExamplesChatWidget() {
  const [variant, setVariant] = useState<"direct" | "history" | "embedded">("direct");

  return (
    <div style={cssVars as React.CSSProperties} className="font-sans">
      <style>{`@keyframes slide-up{from{opacity:0;transform:translateY(16px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}.animate-slide-up{animation:slide-up .35s ease-out both}.widget-icon-btn{color:var(--c-ink-3)}.widget-icon-btn:hover{color:var(--c-ink);background:var(--c-bg-subtle)}.fab-open-btn{background:var(--c-accent)}.fab-close-btn{background:var(--c-ink-3)}.fab-close-btn:hover{background:var(--c-ink-2)}.tab-active{color:var(--c-accent)}.tab-inactive{color:var(--c-ink-3)}.tab-inactive:hover{color:var(--c-ink-2)}.variant-active-btn{background:var(--c-accent)}.variant-inactive-btn{color:var(--c-ink-3)}.variant-inactive-btn:hover{color:var(--c-ink)}`}</style>
      <div
        className={`min-h-screen flex flex-col items-center justify-center px-8 transition-all ${variant === "embedded" ? "mr-[420px]" : ""}`}
        style={{ background: "var(--c-bg)", color: "var(--c-ink)" }}
      >
        <div className="max-w-lg text-center">
          <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: "var(--c-accent)" }}>
            @polpo-ai/chat example
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-3">Support Widget</h1>
          <p className="text-base leading-relaxed mb-8" style={{ color: "var(--c-ink-2)" }}>
            Three ways to embed AI support into your product.
          </p>

          <div
            className="flex justify-center gap-1 rounded-full p-1 border mx-auto w-fit"
            style={{ backgroundColor: "var(--c-bg-subtle)", borderColor: "var(--c-border)" }}
          >
            {([
              { key: "direct", label: "Floating Widget" },
              { key: "history", label: "Widget + History" },
              { key: "embedded", label: "Embedded Panel" },
            ] as const).map((v) => (
              <button
                key={v.key}
                onClick={() => setVariant(v.key)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  variant === v.key
                    ? "text-white shadow-sm variant-active-btn"
                    : "variant-inactive-btn"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {variant === "direct" && <DirectWidget />}
        {variant === "history" && <FullWidget />}
        {variant === "embedded" && <EmbeddedPanel onClose={() => setVariant("direct")} />}
      </div>
    </div>
  );
}
