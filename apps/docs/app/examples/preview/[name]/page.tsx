"use client";

import { use } from "react";
import ExamplesChat from "@polpo-ai/examples/src/examples-chat";
import ExamplesChatWidget from "@polpo-ai/examples/src/examples-chat-widget";
import ExamplesMultiAgent from "@polpo-ai/examples/src/examples-multi-agent";

const registry: Record<string, React.ComponentType> = {
  "examples-chat": ExamplesChat,
  "examples-chat-widget": ExamplesChatWidget,
  "examples-multi-agent": ExamplesMultiAgent,
};

export default function PreviewPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = use(params);
  const Component = registry[name];

  if (!Component) {
    return <div className="flex items-center justify-center h-screen text-sm text-gray-400">Example not found: {name}</div>;
  }

  return <Component />;
}
