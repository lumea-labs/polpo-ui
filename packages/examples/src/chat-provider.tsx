"use client";

export default function ChatProviderExample() {
  return (
    <div className="rounded-xl border border-gray-200 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
          <svg className="size-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">ChatProvider</p>
          <p className="text-xs text-gray-400">Context provider — wraps useChat + useFiles</p>
        </div>
      </div>
      <div className="font-mono text-xs text-gray-500 bg-gray-100 rounded-lg p-4 space-y-1">
        <p><span className="text-blue-500">messages</span>: ChatMessage[]</p>
        <p><span className="text-blue-500">sendMessage</span>: (content) → Promise</p>
        <p><span className="text-blue-500">isStreaming</span>: boolean</p>
        <p><span className="text-blue-500">abort</span>: () → void</p>
        <p><span className="text-blue-500">uploadFile</span>: (dest, file, name) → Promise</p>
        <p><span className="text-blue-500">pendingToolCall</span>: ToolCallEvent | null</p>
        <p><span className="text-blue-500">sendToolResult</span>: (id, result) → void</p>
      </div>
    </div>
  );
}
