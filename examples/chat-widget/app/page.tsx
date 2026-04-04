"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageCircle, X, ArrowLeft, Plus, Headphones, Home as HomeIcon, Clock, Sun, Moon, Maximize2, Minimize2 } from "lucide-react";
import { useSessions } from "@polpo-ai/react";
import {
  Chat,
  ChatInput,
  ChatSessionList,
  useChatContext,
} from "@polpo-ai/chat";

const AGENT = "assistant";
const AGENT_DISPLAY = "AI Assistant";

function useTheme() {
  const [theme, setThemeState] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    if (stored) {
      setThemeState(stored);
      document.documentElement.setAttribute("data-theme", stored);
    }
  }, []);

  const toggle = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setThemeState(next);
  }, [theme]);

  return { theme, toggle };
}

/* ── Views ────────────────────────────────────────────── */

type WidgetTab = "home" | "sessions";
type ChatView = { type: "new" } | { type: "session"; sessionId: string } | null;
type WidgetSize = "default" | "large" | "fullscreen";

const sizeClasses: Record<WidgetSize, string> = {
  default: "fixed bottom-24 right-6 w-[420px] h-[620px] rounded-2xl",
  large: "fixed bottom-24 right-6 w-[520px] h-[720px] rounded-2xl",
  fullscreen: "fixed inset-4 w-auto h-auto rounded-2xl",
};

/* ── New chat welcome ─────────────────────────────────── */

function NewChatWelcome() {
  const { messages, sendMessage } = useChatContext();
  if (messages.length > 0) return null;

  const quickQuestions = [
    "How do I get started?",
    "What are your pricing plans?",
    "I need help with my account",
    "How do I integrate the API?",
  ];

  return (
    <div className="flex-1 flex flex-col px-5 py-8">
      <h3 className="text-base font-semibold mb-1">{AGENT_DISPLAY}</h3>
      <p className="text-sm text-[var(--c-ink-3)] mb-6">Ask me anything — I usually reply instantly.</p>
      <div className="space-y-1.5">
        {quickQuestions.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => sendMessage(q)}
            className="flex items-center w-full px-3.5 py-2.5 rounded-lg border border-[var(--c-border)] text-sm text-[var(--c-ink-2)] text-left hover:bg-[var(--c-bg-subtle)] hover:text-[var(--c-ink)] transition-colors"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Chat input ───────────────────────────────────────── */

function WidgetInput() {
  return (
    <ChatInput
      placeholder={`Message ${AGENT_DISPLAY}...`}
      allowAttachments={false}
      className="[&>div]:px-3 [&>div]:py-2 [&>div>div]:max-w-none"
    />
  );
}

/* ── Home tab ─────────────────────────────────────────── */

function HomeTab({ onNewChat }: { onNewChat: () => void }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Welcome banner */}
      <div className="px-5 pt-6 pb-5 bg-[var(--c-accent)] text-white">
        <h2 className="text-lg font-bold mb-1">Hi there 👋</h2>
        <p className="text-sm text-white/80">
          Ask us anything — we usually reply instantly.
        </p>
      </div>

      {/* New conversation */}
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

/* ── Sessions tab ─────────────────────────────────────── */

function SessionsTab({ onSelectSession }: { onSelectSession: (id: string) => void }) {
  const { sessions, isLoading } = useSessions();

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--c-ink-3)]">
          Your conversations
        </p>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <ChatSessionList
          sessions={sessions}
          isLoading={isLoading}
          onSelect={onSelectSession}
          emptyMessage="No conversations yet"
        />
      </div>
    </div>
  );
}

/* ── Widget ───────────────────────────────────────────── */

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<WidgetTab>("home");
  const [chatView, setChatView] = useState<ChatView>(null);
  const [size, setSize] = useState<WidgetSize>("default");

  const cycleSize = useCallback(() => {
    setSize((s) => s === "default" ? "large" : s === "large" ? "fullscreen" : "default");
  }, []);

  const { theme, toggle: toggleTheme } = useTheme();
  const openNewChat = useCallback(() => setChatView({ type: "new" }), []);
  const openSession = useCallback((id: string) => setChatView({ type: "session", sessionId: id }), []);
  const goBack = useCallback(() => setChatView(null), []);

  const inChat = chatView !== null;

  return (
    <>
      {/* Panel */}
      {open && (
        <div className={`z-50 ${sizeClasses[size]} border border-[var(--c-border)] bg-[var(--c-bg)] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden animate-slide-up`}>
          {/* Header */}
          <div className="flex items-center gap-2 px-4 h-14 border-b border-[var(--c-border)] shrink-0">
            {inChat && (
              <button
                onClick={goBack}
                className="size-8 rounded-lg flex items-center justify-center text-[var(--c-ink-3)] hover:text-[var(--c-ink)] hover:bg-[var(--c-bg-subtle)] transition-colors"
              >
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
              <button
                onClick={openNewChat}
                className="size-8 rounded-lg flex items-center justify-center text-[var(--c-ink-3)] hover:text-[var(--c-ink)] hover:bg-[var(--c-bg-subtle)] transition-colors"
              >
                <Plus className="size-4" />
              </button>
            )}
            <button
              onClick={cycleSize}
              className="size-8 rounded-lg flex items-center justify-center text-[var(--c-ink-3)] hover:text-[var(--c-ink)] hover:bg-[var(--c-bg-subtle)] transition-colors"
              aria-label="Resize"
            >
              {size === "fullscreen" ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="size-8 rounded-lg flex items-center justify-center text-[var(--c-ink-3)] hover:text-[var(--c-ink)] hover:bg-[var(--c-bg-subtle)] transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Body */}
          {inChat ? (
            chatView.type === "new" ? (
              <Chat
                agent={AGENT}
                onSessionCreated={(id) => setChatView({ type: "session", sessionId: id })}
                className="flex-1 min-h-0"
              >
                {({ hasMessages }) => (
                  <>
                    {!hasMessages && <NewChatWelcome />}
                    <WidgetInput />
                  </>
                )}
              </Chat>
            ) : (
              <Chat
                sessionId={chatView.sessionId}
                agent={AGENT}
                agentName={AGENT_DISPLAY}
                className="flex-1 min-h-0"
              >
                <WidgetInput />
              </Chat>
            )
          ) : (
            <>
              {tab === "home" ? (
                <HomeTab onNewChat={openNewChat} />
              ) : (
                <SessionsTab onSelectSession={openSession} />
              )}
            </>
          )}

          {/* Bottom navbar (only when not in chat) */}
          {!inChat && (
            <div className="flex border-t border-[var(--c-border)] shrink-0">
              <button
                onClick={() => setTab("home")}
                className={`flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors ${
                  tab === "home" ? "text-[var(--c-accent)]" : "text-[var(--c-ink-3)] hover:text-[var(--c-ink-2)]"
                }`}
              >
                <HomeIcon className="size-4" />
                Home
              </button>
              <button
                onClick={() => setTab("sessions")}
                className={`flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors ${
                  tab === "sessions" ? "text-[var(--c-accent)]" : "text-[var(--c-ink-3)] hover:text-[var(--c-ink-2)]"
                }`}
              >
                <Clock className="size-4" />
                Messages
              </button>
              <button
                onClick={toggleTheme}
                className="flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-medium text-[var(--c-ink-3)] hover:text-[var(--c-ink-2)] transition-colors"
              >
                {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
                Theme
              </button>
            </div>
          )}
        </div>
      )}

      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-50 rounded-full shadow-[0_8px_32px_rgba(20,184,166,0.35)] transition-all flex items-center justify-center ${
          open
            ? "size-12 bg-[var(--c-ink-3)] hover:bg-[var(--c-ink-2)]"
            : "size-14 bg-[var(--c-accent)] hover:scale-105 hover:shadow-[0_12px_40px_rgba(20,184,166,0.45)]"
        }`}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? (
          <X className="size-5 text-white" />
        ) : (
          <MessageCircle className="size-6 text-white" />
        )}
      </button>
    </>
  );
}

/* ── Page (simple landing) ────────────────────────────── */

/* ── Direct widget (no home/sessions, just chat) ─────── */

function DirectWidget() {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<WidgetSize>("default");

  const cycleSize = useCallback(() => {
    setSize((s) => s === "default" ? "large" : s === "large" ? "fullscreen" : "default");
  }, []);

  return (
    <>
      {open && (
        <div className={`z-50 ${sizeClasses[size]} border border-[var(--c-border)] bg-[var(--c-bg)] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden animate-slide-up`}>
          <div className="flex items-center gap-2 px-4 h-14 border-b border-[var(--c-border)] shrink-0">
            <div className="size-8 rounded-lg bg-[var(--c-accent)] flex items-center justify-center">
              <Headphones className="size-4 text-white" />
            </div>
            <span className="text-sm font-semibold flex-1">{AGENT_DISPLAY}</span>
            <button onClick={cycleSize} className="size-8 rounded-lg flex items-center justify-center text-[var(--c-ink-3)] hover:text-[var(--c-ink)] hover:bg-[var(--c-bg-subtle)] transition-colors">
              {size === "fullscreen" ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
            </button>
            <button onClick={() => { setOpen(false); setSize("default"); }} className="size-8 rounded-lg flex items-center justify-center text-[var(--c-ink-3)] hover:text-[var(--c-ink)] hover:bg-[var(--c-bg-subtle)] transition-colors">
              <X className="size-4" />
            </button>
          </div>
          <Chat agent={AGENT} agentName={AGENT_DISPLAY} className="flex-1 min-h-0">
            {({ hasMessages }) => (
              <>
                {!hasMessages && <NewChatWelcome />}
                <WidgetInput />
              </>
            )}
          </Chat>
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

/* ── Page ─────────────────────────────────────────────── */

export default function Home() {
  const [variant, setVariant] = useState<"direct" | "history" | "embedded">("direct");
  const [embeddedOpen, setEmbeddedOpen] = useState(true);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-8 transition-all ${variant === "embedded" && embeddedOpen ? "mr-[420px]" : ""}`}>
      <div className="max-w-lg text-center">
        <p className="text-xs font-medium text-[var(--c-accent)] uppercase tracking-widest mb-4">@polpo-ai/chat example</p>
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Support Widget
        </h1>
        <p className="text-base text-[var(--c-ink-2)] leading-relaxed mb-8">
          Three ways to embed AI support into your product.
        </p>

        {/* Variant selector */}
        <div className="flex justify-center gap-1 rounded-full bg-[var(--c-bg-subtle)] p-1 border border-[var(--c-border)] mx-auto w-fit">
          {([
            { key: "direct", label: "Floating Widget" },
            { key: "history", label: "Widget + History" },
            { key: "embedded", label: "Embedded Panel" },
          ] as const).map((v) => (
            <button
              key={v.key}
              onClick={() => { setVariant(v.key); if (v.key === "embedded") setEmbeddedOpen(true); }}
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
      {variant === "embedded" && embeddedOpen && (
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
          <Chat agent={AGENT} agentName={AGENT_DISPLAY} className="flex-1 min-h-0">
            {({ hasMessages }) => (
              <>
                {!hasMessages && <NewChatWelcome />}
                <WidgetInput />
              </>
            )}
          </Chat>
        </div>
      )}
    </div>
  );
}
