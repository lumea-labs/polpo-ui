"use client";

import type { ReactNode } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ChatSuggestion {
  /** Icon component rendered before the text */
  icon?: ReactNode;
  /** Suggestion text — also used as the message sent on click */
  text: string;
}

export interface ChatSuggestionsProps {
  /** List of suggestions to display */
  suggestions: ChatSuggestion[];
  /** Called when a suggestion is clicked */
  onSelect: (text: string) => void;
  /** Grid columns (default: 2) */
  columns?: 1 | 2 | 3;
  /** Additional className */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const gridCols = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
} as const;

export function ChatSuggestions({
  suggestions,
  onSelect,
  columns = 2,
  className,
}: ChatSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className={`grid ${gridCols[columns]} gap-2 ${className || ""}`}>
      {suggestions.map((s) => (
        <button
          key={s.text}
          type="button"
          className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-transparent text-xs text-muted-foreground text-left hover:bg-muted/50 hover:border-border transition-colors"
          onClick={() => onSelect(s.text)}
        >
          {s.icon && (
            <span className="shrink-0 text-muted-foreground">{s.icon}</span>
          )}
          {s.text}
        </button>
      ))}
    </div>
  );
}
