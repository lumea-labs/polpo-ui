import { corsHeaders } from '../../../../data/loader';

const mockResponses: Record<string, { text: string; toolCalls?: any[] }> = {
  code: {
    text: "Done! I've updated the file and ran the tests. Everything passes.\n\n```ts\nexport function hello() {\n  return 'world';\n}\n```",
    toolCalls: [
      { id: "tc-w", name: "write", state: "completed", arguments: { path: "src/index.ts" } },
      { id: "tc-b", name: "bash", state: "completed", arguments: { command: "npm test" }, result: "All tests passed" },
    ],
  },
  help: {
    text: "I'd be happy to help! Here's how to get started:\n\n1. **Install the SDK** — `npm install @polpo-ai/chat`\n2. **Wrap your app** with `<PolpoProvider>`\n3. **Add `<Chat>`** anywhere in your app\n\nWould you like me to walk through any of these steps?",
  },
  default: {
    text: "I'll help you with that. Let me look into it and get back to you with a solution.\n\nHere's what I found — the approach looks solid. I've made the changes and verified everything works correctly.",
    toolCalls: [
      { id: "tc-r", name: "read", state: "completed", arguments: { path: "src/main.ts" } },
    ],
  },
};

function pickResponse(userText: string) {
  const lower = userText.toLowerCase();
  if (lower.includes("code") || lower.includes("file") || lower.includes("write") || lower.includes("test") || lower.includes("add") || lower.includes("fix") || lower.includes("debug")) {
    return mockResponses.code;
  }
  if (lower.includes("help") || lower.includes("started") || lower.includes("how") || lower.includes("what")) {
    return mockResponses.help;
  }
  return mockResponses.default;
}

export async function POST(req: Request) {
  const body = await req.json();
  const messages = body.messages || [];
  const lastUser = [...messages].reverse().find((m: any) => m.role === "user");
  const userText = typeof lastUser?.content === "string" ? lastUser.content : "hello";
  const sessionId = body.sessionId || `mock-${Date.now()}`;

  const response = pickResponse(userText);
  const words = response.text.split(" ");

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Stream text first, then tool calls
      for (let i = 0; i < words.length; i++) {
        const word = words[i] + (i < words.length - 1 ? " " : "");
        const chunk = JSON.stringify({ choices: [{ delta: { content: word }, index: 0 }] });
        controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
        await sleep(40);
      }

      // Stream tool calls after text
      if (response.toolCalls) {
        for (const tc of response.toolCalls) {
          const chunk = JSON.stringify({ choices: [{ delta: {}, tool_call: tc, index: 0 }] });
          controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
          await sleep(100);
        }
      }

      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "x-session-id": sessionId,
      ...corsHeaders,
    },
  });
}

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
