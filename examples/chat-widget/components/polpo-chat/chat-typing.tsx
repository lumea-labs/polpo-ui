"use client";

/* ------------------------------------------------------------------ */
/*  Typing indicator (three animated dots)                             */
/* ------------------------------------------------------------------ */

const dotBase =
  "inline-block h-1.5 w-1.5 rounded-full bg-current opacity-40 animate-[typing-dot_1.4s_ease-in-out_infinite]";

export function ChatTyping({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Typing"
      className={`inline-flex items-center gap-1 ${className ?? ""}`}
    >
      <span className={dotBase} style={{ animationDelay: "0ms" }} />
      <span className={dotBase} style={{ animationDelay: "200ms" }} />
      <span className={dotBase} style={{ animationDelay: "400ms" }} />
    </span>
  );
}
