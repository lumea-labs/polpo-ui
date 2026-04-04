"use client";

import { useState } from "react";
import { ChatScrollButton } from "@polpo-ai/chat";

export default function ChatScrollButtonExample() {
  const [isAtBottom, setIsAtBottom] = useState(false);

  return (
    <div className="p-4">
      <p className="text-xs font-medium text-gray-500 mb-4">
        Click the button to toggle state. When at bottom, button hides.
      </p>

      <div className="relative h-48 rounded-xl border border-gray-200 bg-gray-100 overflow-hidden">
        <div className="p-4 text-sm text-gray-400">
          {isAtBottom
            ? "You are at the bottom. Button is hidden."
            : "Scroll content here... the button appears below."}
        </div>

        <ChatScrollButton
          isAtBottom={isAtBottom}
          showNewMessage={!isAtBottom}
          onClick={() => setIsAtBottom(true)}
        />
      </div>

      <button
        type="button"
        onClick={() => setIsAtBottom(!isAtBottom)}
        className="mt-3 text-xs text-gray-500 underline"
      >
        Toggle isAtBottom ({isAtBottom ? "true" : "false"})
      </button>
    </div>
  );
}
