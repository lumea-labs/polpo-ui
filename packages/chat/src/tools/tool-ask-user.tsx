"use client";

import type { ToolCallEvent } from "@polpo-ai/sdk";
import { MessageSquareMore, Check } from "lucide-react";
import { ToolCallShell } from "./tool-call-shell";

interface AskUserQuestion {
  id: string;
  question: string;
  header?: string;
  options?: { label: string; description?: string }[];
}

/** Ask user question tool — shows the questions and answers after completion */
export function ToolAskUser({ tool }: { tool: ToolCallEvent }) {
  const questions = (tool.arguments?.questions || []) as AskUserQuestion[];
  const isAnswered = tool.state === "completed" || tool.state === "interrupted";

  // Try to parse the result as answers
  let answers: { questionId: string; selected: string[] }[] = [];
  if (tool.result) {
    try {
      const parsed = JSON.parse(tool.result);
      answers = parsed.answers || [];
    } catch {
      // result might be plain text — not structured
    }
  }

  return (
    <ToolCallShell
      tool={tool}
      icon={MessageSquareMore}
      label="Question"
      summary={isAnswered ? `${questions.length} answered` : `${questions.length} question${questions.length > 1 ? "s" : ""}`}
    >
      <div className="bg-p-bg px-3 py-2 text-xs space-y-2">
        {questions.map((q) => {
          const answer = answers.find((a) => a.questionId === q.id);
          return (
            <div key={q.id} className="flex items-start gap-2">
              {isAnswered ? (
                <Check size={12} className="text-p-green shrink-0 mt-0.5" />
              ) : (
                <MessageSquareMore size={12} className="text-p-accent shrink-0 mt-0.5" />
              )}
              <div className="min-w-0">
                <p className="text-p-ink font-medium">{q.question}</p>
                {answer && answer.selected.length > 0 && (
                  <p className="text-p-ink-3 mt-0.5">{answer.selected.join(", ")}</p>
                )}
                {!answer && isAnswered && (
                  <p className="text-p-ink-3/50 italic mt-0.5">Skipped</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ToolCallShell>
  );
}
