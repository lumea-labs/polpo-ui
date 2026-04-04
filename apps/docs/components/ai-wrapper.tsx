"use client";

import type { ReactNode } from "react";
import { AISearch, AISearchPanel, useAISearchContext } from "@/components/ai/search";

function AIContent({ children }: { children: ReactNode }) {
  const { open } = useAISearchContext();

  return (
    <>
      <AISearchPanel />
      <div
        className="transition-[margin] duration-200"
        style={{ marginRight: open ? "var(--ai-chat-width, 400px)" : 0 }}
      >
        {children}
      </div>
    </>
  );
}

export function AIWrapper({ children }: { children: ReactNode }) {
  return (
    <AISearch>
      <AIContent>{children}</AIContent>
    </AISearch>
  );
}
