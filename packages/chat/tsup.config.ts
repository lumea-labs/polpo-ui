import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "tools/index": "src/tools/index.tsx",
    "hooks/index": "src/hooks/index.ts",
  },
  format: ["esm"],
  dts: {
    compilerOptions: {
      ignoreDeprecations: "6.0",
    },
  },
  external: [
    "react",
    "react-dom",
    "@polpo-ai/sdk",
    "@polpo-ai/react",
    "react-virtuoso",
    "lucide-react",
    "streamdown",
  ],
  clean: true,
  sourcemap: true,
});
