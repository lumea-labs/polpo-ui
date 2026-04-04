"use client";

import { ChatSuggestions } from "@polpo-ai/chat";
import type { ChatSuggestion } from "@polpo-ai/chat";
import { ArrowUp, Zap, FileBarChart, ListTodo, UserPlus } from "lucide-react";

const suggestions: ChatSuggestion[] = [
  { icon: <Zap size={14} />, text: "Automate a workflow" },
  { icon: <FileBarChart size={14} />, text: "Generate a report" },
  { icon: <ListTodo size={14} />, text: "Plan a sprint" },
  { icon: <UserPlus size={14} />, text: "Create an agent" },
];

export default function ChatLandingExample() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <h1 className="text-3xl font-bold tracking-tight mb-2">How can I help?</h1>
      <p className="text-sm text-gray-400 mb-8">Your AI team is ready.</p>

      {/* Mock input */}
      <div className="w-full max-w-lg">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 shadow-sm">
          <div className="px-5 pt-4 pb-2">
            <p className="text-sm text-gray-400">Describe what you need...</p>
          </div>
          <div className="flex items-center justify-between px-3 pb-3">
            <div />
            <button className="flex items-center justify-center size-8 rounded-lg bg-gray-900 text-white">
              <ArrowUp className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <ChatSuggestions
        suggestions={suggestions}
        onSelect={() => {}}
        columns={2}
        className="mt-5 max-w-md w-full"
      />
    </div>
  );
}
