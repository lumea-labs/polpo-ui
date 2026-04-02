export interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  agent?: string;
  timestamp?: string;
  toolCalls?: {
    id: string;
    name: string;
    state: string;
    arguments?: Record<string, unknown>;
    result?: string;
  }[];
  isStreaming?: boolean;
}

export interface ChatInputProps {
  onSubmit: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export interface ChatThreadProps {
  /** Polpo API base URL */
  baseUrl?: string;
  /** API key for authentication */
  apiKey?: string;
  /** Agent name to chat with */
  agent: string;
  /** Session ID for conversation continuity */
  sessionId?: string;
  /** Custom class name */
  className?: string;
  /** Whether to stream responses */
  stream?: boolean;
}
