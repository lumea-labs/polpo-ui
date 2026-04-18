"use client";

/* ------------------------------------------------------------------ */
/*  Typing indicator (three animated dots)                             */
/*                                                                     */
/*  Self-contained: uses the Web Animations API (WAAPI) — no CSS       */
/*  keyframes, no external stylesheet, no peer animation library.      */
/*  Consumers can drop this into any React app and the dots just       */
/*  work.                                                              */
/* ------------------------------------------------------------------ */

import { useEffect, useRef } from "react";

const DOT_KEYFRAMES: Keyframe[] = [
  { opacity: 0.3, transform: "translateY(0px)" },
  { opacity: 1, transform: "translateY(-3px)", offset: 0.3 },
  { opacity: 0.3, transform: "translateY(0px)", offset: 0.6 },
  { opacity: 0.3, transform: "translateY(0px)" },
];

const DOT_TIMING: KeyframeAnimationOptions = {
  duration: 1400,
  iterations: Infinity,
  easing: "ease-in-out",
};

function TypingDot({ delay }: { delay: number }) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof node.animate !== "function") return;
    const anim = node.animate(DOT_KEYFRAMES, { ...DOT_TIMING, delay });
    return () => {
      anim.cancel();
    };
  }, [delay]);

  return (
    <span
      ref={ref}
      className="inline-block h-1.5 w-1.5 rounded-full bg-current"
      style={{ opacity: 0.3 }}
    />
  );
}

export function ChatTyping({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Typing"
      className={`inline-flex items-center gap-1 ${className ?? ""}`}
    >
      <TypingDot delay={0} />
      <TypingDot delay={200} />
      <TypingDot delay={400} />
    </span>
  );
}
