"use client";

import { ArrowUp, Plus } from "lucide-react";

/**
 * This preview shows the visual layout.
 */

export default function ChatInputExample() {
  return (
    <div className="p-4">

      <div className="w-full px-6 py-3">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-gray-200 shadow-sm focus-within:border-blue-400 focus-within:shadow-md transition-all bg-gray-50">
            <textarea
              placeholder="Type a message..."
              rows={1}
              className="w-full resize-none bg-transparent px-5 pt-4 pb-2 text-sm outline-none placeholder:text-gray-400"
            />
            <div className="flex items-center justify-between px-3 pb-3">
              <button
                type="button"
                className="flex items-center justify-center size-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Attach file"
              >
                <Plus className="size-4" />
              </button>
              <button
                type="button"
                className="flex items-center justify-center size-8 rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors"
                aria-label="Send"
              >
                <ArrowUp className="size-4" />
              </button>
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">
            AI can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}
