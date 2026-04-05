import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { highlight } from "sugar-high";
import { PreviewTabs } from "./preview-tabs";

interface IframePreviewProps {
  /** URL for the iframe preview */
  iframeSrc: string;
  /** Path to the real example source file to show in Code tab */
  codePath: string;
  /** Height of the iframe preview */
  height?: number;
}

export async function IframePreview({ iframeSrc, codePath, height = 680 }: IframePreviewProps) {
  const code = await readFile(
    join(process.cwd(), "..", "..", codePath),
    "utf8",
  );

  const highlighted = highlight(code);

  return (
    <PreviewTabs
      preview={null}
      code={highlighted}
      rawCode={code}
      iframeSrc={iframeSrc}
      iframeHeight={height}
    />
  );
}
