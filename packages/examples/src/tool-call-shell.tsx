"use client";

import { ToolCallShell, ToolCallChip } from "@polpo-ai/chat";
import { Terminal } from "lucide-react";

const toolBash = {
  id: "tb", name: "bash", state: "completed" as const,
  arguments: { command: "npm test -- --coverage" },
  result: "PASS  src/__tests__/todos.test.ts\n  ✓ GET /api/todos (12ms)\n  ✓ POST /api/todos (8ms)\n\nTests: 2 passed, 2 total\nCoverage: 94%",
} as any;

const toolWrite = {
  id: "tw", name: "write", state: "completed" as const,
  arguments: { path: "src/routes/todos.ts", content: "import { Router } from 'express';\n\nconst router = Router();\n\nrouter.get('/', async (req, res) => {\n  const todos = await db.todo.findMany();\n  res.json(todos);\n});\n\nexport default router;" },
  result: "File written successfully",
} as any;

const toolRead = {
  id: "tr", name: "read", state: "completed" as const,
  arguments: { path: "src/config.ts" },
  result: "export const config = {\n  port: 3000,\n  jwtSecret: process.env.JWT_SECRET,\n  database: process.env.DATABASE_URL,\n  corsOrigin: ['http://localhost:3000'],\n};",
} as any;

const toolSearch = {
  id: "ts", name: "grep", state: "completed" as const,
  arguments: { pattern: "TODO", path: "src/" },
  result: "src/routes/auth.ts:12:  // TODO: add rate limiting\nsrc/routes/users.ts:45:  // TODO: validate email format\nsrc/middleware/cors.ts:8:  // TODO: restrict origins in production",
} as any;

const toolHttp = {
  id: "th", name: "http_fetch", state: "completed" as const,
  arguments: { url: "https://api.github.com/repos/polpo-ai/chat", method: "GET" },
  result: '{"name":"chat","full_name":"polpo-ai/chat","description":"Composable chat UI","stargazers_count":142}',
} as any;

const toolEmail = {
  id: "tem", name: "email_send", state: "completed" as const,
  arguments: { to: "team@acme.com", subject: "Weekly Sprint Report", body: "Hi team,\n\nHere's the sprint summary:\n- 12 tasks completed\n- 3 bugs fixed\n- 2 features shipped\n\nBest,\nAI Assistant" },
} as any;

const toolPending = {
  id: "tp", name: "search_web", state: "calling" as const,
  arguments: { query: "express rate limiting best practices" },
} as any;

const toolError = {
  id: "te", name: "bash", state: "error" as const,
  arguments: { command: "npm run deploy" },
  result: "Error: EACCES permission denied\n  at Object.openSync (fs.js:498:3)",
} as any;

export default function ToolCallShellExample() {
  return (
    <div className="space-y-8 max-w-lg">
      {/* ToolCallChip — auto-dispatching */}
      <div>
        <p className="text-xs font-medium text-gray-400 mb-3">
          ToolCallChip — auto-dispatches to specialized renderers
        </p>
        <div className="flex flex-col gap-1.5">
          <ToolCallChip tool={toolBash} />
          <ToolCallChip tool={toolWrite} />
          <ToolCallChip tool={toolRead} />
          <ToolCallChip tool={toolSearch} />
          <ToolCallChip tool={toolHttp} />
          <ToolCallChip tool={toolEmail} />
          <ToolCallChip tool={toolPending} />
          <ToolCallChip tool={toolError} />
        </div>
      </div>

      {/* ToolCallShell — custom usage */}
      <div>
        <p className="text-xs font-medium text-gray-400 mb-3">
          ToolCallShell — custom icon, label, and children
        </p>
        <ToolCallShell
          tool={toolBash}
          icon={Terminal}
          label="Run Tests"
          summary="npm test -- --coverage"
        />
      </div>
    </div>
  );
}
