"use client";

import type { ComponentType, HTMLAttributes } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/** Props that any code-block component must accept. */
export interface CodeBlockComponentProps {
  code: string;
  language: string;
  children?: React.ReactNode;
}

/** The shape returned by createStreamdownComponents / the default export. */
export interface StreamdownComponents {
  code: (
    props: HTMLAttributes<HTMLElement> & {
      node?: unknown;
      "data-block"?: string;
    },
  ) => React.ReactNode;
}

/* ------------------------------------------------------------------ */
/*  Fallback code block (simple <pre><code>)                           */
/* ------------------------------------------------------------------ */

function FallbackCodeBlock({ code, language }: CodeBlockComponentProps) {
  return (
    <pre
      data-language={language}
      className="border border-gray-200 bg-gray-100 text-gray-900"
      style={{
        margin: "0.75rem 0",
        padding: "0.875rem 1rem",
        borderRadius: "10px",
        overflowX: "auto",
        fontSize: "0.75rem",
        lineHeight: "1.625",
      }}
    >
      <code className={`language-${language}`}>{code}</code>
    </pre>
  );
}

/* ------------------------------------------------------------------ */
/*  Factory                                                            */
/* ------------------------------------------------------------------ */

/**
 * Create a `streamdownComponents` override object for Streamdown.
 *
 * Pass your own `CodeBlock` component to get syntax-highlighted fenced
 * code blocks. If omitted, a plain `<pre><code>` fallback is used.
 *
 * @example
 * ```tsx
 * import { CodeBlock } from "@/components/ai-elements/code-block";
 * import { createStreamdownComponents } from "@polpo-ai/chat";
 *
 * const streamdownComponents = createStreamdownComponents(CodeBlock);
 * ```
 */
export function createStreamdownComponents(
  CodeBlockComponent?: ComponentType<CodeBlockComponentProps>,
): StreamdownComponents {
  const Block = CodeBlockComponent ?? FallbackCodeBlock;

  function StreamdownCode(
    props: HTMLAttributes<HTMLElement> & {
      node?: unknown;
      "data-block"?: string;
    },
  ) {
    const {
      children,
      className,
      node: _,
      "data-block": dataBlock,
      ...rest
    } = props;

    // Fenced code blocks carry data-block; inline code does not.
    if (dataBlock !== undefined) {
      const match = /language-(\w+)/.exec(className || "");
      const lang = match?.[1] || "text";
      const code = String(children).replace(/\n$/, "");
      return <Block code={code} language={lang} />;
    }

    return (
      <code className={className} {...rest}>
        {children}
      </code>
    );
  }

  return { code: StreamdownCode };
}

/* ------------------------------------------------------------------ */
/*  Pre-built instance — uses the plain fallback                       */
/* ------------------------------------------------------------------ */

export const streamdownComponents: StreamdownComponents =
  createStreamdownComponents();
