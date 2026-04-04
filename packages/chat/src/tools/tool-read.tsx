"use client";

import type { ToolCallEvent } from "@polpo-ai/sdk";
import { FileText } from "lucide-react";
import { ToolCallShell } from "./tool-call-shell";

/** Read tool — shows file path and truncated content with line numbers */
export function ToolRead({ tool }: { tool: ToolCallEvent }) {
  const path = (tool.arguments?.path || tool.arguments?.file_path) as string | undefined;
  const lines = tool.result?.split("\n") || [];
  const maxLines = 12;
  const truncated = lines.length > maxLines;

  return (
    <ToolCallShell tool={tool} icon={FileText} label="Read" summary={path}>
      {tool.result && (
        <div className="bg-gray-50 max-h-[220px] overflow-y-auto">
          <table className="w-full text-[11px] leading-relaxed font-mono border-collapse">
            <tbody>
              {lines.slice(0, maxLines).map((line, i) => (
                <tr key={i} className="hover:bg-gray-100/50">
                  <td className="text-right text-gray-400 select-none px-2.5 py-0 w-[1%] whitespace-nowrap">{i + 1}</td>
                  <td className="text-gray-600 px-2.5 py-0 whitespace-pre-wrap break-all">{line}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {truncated && (
            <div className="px-2.5 py-1 text-[10px] text-gray-400 border-t border-gray-200">
              +{lines.length - maxLines} more lines
            </div>
          )}
        </div>
      )}
    </ToolCallShell>
  );
}
