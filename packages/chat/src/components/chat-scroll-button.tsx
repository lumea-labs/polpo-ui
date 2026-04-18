"use client";

import { ArrowDown } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Scroll-to-bottom button with optional new-message indicator        */
/* ------------------------------------------------------------------ */

interface ChatScrollButtonProps {
  isAtBottom: boolean;
  showNewMessage?: boolean;
  onClick: () => void;
  className?: string;
}

export function ChatScrollButton({
  isAtBottom,
  showNewMessage,
  onClick,
  className,
}: ChatScrollButtonProps) {
  if (isAtBottom) return null;

  return (
    <button
      type="button"
      aria-label="Scroll to bottom"
      onClick={onClick}
      className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-muted/50 shadow-md transition-colors hover:bg-accent ${className ?? ""}`}
    >
      <ArrowDown className="h-4 w-4 text-muted-foreground" />

      {showNewMessage && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
        </span>
      )}
    </button>
  );
}
