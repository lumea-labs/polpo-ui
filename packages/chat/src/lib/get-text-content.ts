import type { ContentPart } from "@polpo-ai/sdk";

/** Extract the concatenated text from a message content value (string or ContentPart[]). */
export function getTextContent(content: string | ContentPart[]): string {
  if (typeof content === "string") return content;
  return content
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}
