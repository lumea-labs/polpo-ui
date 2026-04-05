import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { highlight } from "sugar-high";
import { PreviewTabs } from "./preview-tabs";

// Static registry — Turbopack doesn't support dynamic template literal imports
import ChatExample from "@polpo-ai/examples/src/chat";
import ChatInputExample from "@polpo-ai/examples/src/chat-input";
import ChatMessageExample from "@polpo-ai/examples/src/chat-message";
import ChatSkeletonExample from "@polpo-ai/examples/src/chat-skeleton";
import ChatTypingExample from "@polpo-ai/examples/src/chat-typing";
import ChatScrollButtonExample from "@polpo-ai/examples/src/chat-scroll-button";
import ChatSuggestionsExample from "@polpo-ai/examples/src/chat-suggestions";
import ChatSessionListExample from "@polpo-ai/examples/src/chat-session-list";
import ChatSessionsByAgentExample from "@polpo-ai/examples/src/chat-sessions-by-agent";
import ChatAgentSelectorExample from "@polpo-ai/examples/src/chat-agent-selector";
import ChatAskUserExample from "@polpo-ai/examples/src/chat-ask-user";
import ToolCallShellExample from "@polpo-ai/examples/src/tool-call-shell";
import ChatMessagesExample from "@polpo-ai/examples/src/chat-messages";
import ChatProviderExample from "@polpo-ai/examples/src/chat-provider";
import ChatLandingExample from "@polpo-ai/examples/src/chat-landing";
import ExamplesChatExample from "@polpo-ai/examples/src/examples-chat";
import ExamplesChatWidgetExample from "@polpo-ai/examples/src/examples-chat-widget";
import ExamplesMultiAgentExample from "@polpo-ai/examples/src/examples-multi-agent";

const registry: Record<string, React.ComponentType> = {
  chat: ChatExample,
  "chat-input": ChatInputExample,
  "chat-message": ChatMessageExample,
  "chat-messages": ChatMessagesExample,
  "chat-provider": ChatProviderExample,
  "chat-landing": ChatLandingExample,
  "chat-skeleton": ChatSkeletonExample,
  "chat-typing": ChatTypingExample,
  "chat-scroll-button": ChatScrollButtonExample,
  "chat-suggestions": ChatSuggestionsExample,
  "chat-session-list": ChatSessionListExample,
  "chat-sessions-by-agent": ChatSessionsByAgentExample,
  "chat-agent-selector": ChatAgentSelectorExample,
  "chat-ask-user": ChatAskUserExample,
  "tool-call-shell": ToolCallShellExample,
  "examples-chat": ExamplesChatExample,
  "examples-chat-widget": ExamplesChatWidgetExample,
  "examples-multi-agent": ExamplesMultiAgentExample,
};

interface PreviewProps {
  path: string;
  className?: string;
}

export async function Preview({ path, className }: PreviewProps) {
  const code = await readFile(
    join(process.cwd(), "..", "..", "packages", "examples", "src", `${path}.tsx`),
    "utf8",
  );

  const Component = registry[path];
  if (!Component) {
    return <div className="p-4 text-sm text-fd-muted-foreground">Example not found: {path}</div>;
  }

  const highlighted = highlight(code);

  return (
    <PreviewTabs
      preview={<Component />}
      code={highlighted}
      rawCode={code}
      className={className}
    />
  );
}
