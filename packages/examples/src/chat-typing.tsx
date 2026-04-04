"use client";

import { ChatTyping } from "@polpo-ai/chat";

export default function ChatTypingExample() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <p className="text-xs font-medium text-gray-500 mb-2">
          Default typing indicator
        </p>
        <ChatTyping className="text-gray-400" />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 mb-2">
          With custom className
        </p>
        <ChatTyping className="text-blue-500" />
      </div>
    </div>
  );
}
