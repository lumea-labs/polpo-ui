"use client";

import { useState } from "react";
import { ChatSuggestions } from "@polpo-ai/chat";

const mockSuggestions = [
  { text: "Add a new API endpoint" },
  { text: "Write unit tests for the auth module" },
  { text: "Refactor the database layer" },
  { text: "Explain this error message" },
];

export default function ChatSuggestionsExample() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="p-4 max-w-lg mx-auto">
      <ChatSuggestions
        suggestions={mockSuggestions}
        onSelect={(text) => setSelected(text)}
        columns={2}
      />

      {selected && (
        <p className="mt-4 text-xs text-gray-500">
          Selected: <span className="font-medium text-gray-700">{selected}</span>
        </p>
      )}
    </div>
  );
}
