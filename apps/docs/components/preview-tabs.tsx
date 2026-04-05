"use client";

import { useState, useCallback, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";

interface PreviewTabsProps {
  preview: ReactNode;
  code: string;
  rawCode: string;
  className?: string;
  /** Use iframe for CSS isolation — pass the src URL */
  iframeSrc?: string;
  /** iframe height (default: 680px) */
  iframeHeight?: number;
}

export function PreviewTabs({ preview, code, rawCode, className, iframeSrc, iframeHeight = 680 }: PreviewTabsProps) {
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(rawCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [rawCode]);

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-fd-border">
      {/* Tab header */}
      <div className="flex items-center border-b border-fd-border bg-fd-muted/30">
        <button
          type="button"
          onClick={() => setTab("preview")}
          className={`relative px-4 py-2 text-sm font-medium transition-colors ${
            tab === "preview"
              ? "text-fd-foreground"
              : "text-fd-muted-foreground hover:text-fd-foreground"
          }`}
        >
          Preview
          {tab === "preview" && (
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-fd-primary" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setTab("code")}
          className={`relative px-4 py-2 text-sm font-medium transition-colors ${
            tab === "code"
              ? "text-fd-foreground"
              : "text-fd-muted-foreground hover:text-fd-foreground"
          }`}
        >
          Code
          {tab === "code" && (
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-fd-primary" />
          )}
        </button>

        {/* Copy button */}
        <button
          type="button"
          onClick={copyCode}
          className="ml-auto mr-2 flex items-center justify-center size-7 rounded-md text-fd-muted-foreground hover:text-fd-foreground transition-colors"
          aria-label="Copy code"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        </button>
      </div>

      {/* Content */}
      {tab === "preview" ? (
        iframeSrc ? (
          <iframe
            src={iframeSrc}
            className="w-full border-0"
            style={{ height: iframeHeight }}
            loading="lazy"
          />
        ) : (
          <div className={className || "p-6 min-h-[200px]"}>
            {preview}
          </div>
        )
      ) : (
        <div className="max-h-[600px] overflow-y-auto">
          <pre data-preview-code="" className="m-0 p-4 text-[13px] leading-relaxed overflow-x-auto font-mono">
            <code dangerouslySetInnerHTML={{ __html: code }} />
          </pre>
        </div>
      )}
    </div>
  );
}
