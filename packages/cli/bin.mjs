#!/usr/bin/env node

import { execSync } from "child_process";
import { createInterface } from "readline";

const REGISTRY = "https://unpkg.com/@polpo-ai/chat/registry";

const COMPONENTS = {
  chat: {
    file: "polpo-chat-all.json",
    desc: "Complete chat UI (messages, input, sessions, tools, ask-user)",
    all: true,
  },
  lib: {
    file: "polpo-chat-lib.json",
    desc: "Utility functions (relativeTime, getTextContent)",
  },
  hooks: {
    file: "polpo-chat-hooks.json",
    desc: "Hooks (useSubmitHandler, useDocumentDrag)",
  },
  tools: {
    file: "polpo-chat-tools.json",
    desc: "Tool call renderers (bash, read, write, search, etc.)",
  },
  message: {
    file: "polpo-chat-message.json",
    desc: "Message components (ChatMessage, ChatTyping)",
  },
  streamdown: {
    file: "polpo-chat-streamdown.json",
    desc: "Streamdown code block override",
  },
};

const args = process.argv.slice(2);
const cmd = args[0];
const overwrite = args.includes("--overwrite");
const allFlag = args.includes("--all");
const filteredArgs = args.slice(1).filter((n) => n !== "--overwrite" && n !== "--all");

// ── Help ──

if (!cmd || cmd === "--help" || cmd === "-h") {
  console.log(`
  \x1b[1m@polpo-ai/ui\x1b[0m — Add Polpo chat components to your project

  \x1b[1mUsage:\x1b[0m
    npx @polpo-ai/ui add                    # Interactive multi-select
    npx @polpo-ai/ui add --all              # Install everything
    npx @polpo-ai/ui add <component> [...]  # Install specific parts
    npx @polpo-ai/ui list

  \x1b[1mOptions:\x1b[0m
    --all              Install all components
    --overwrite        Overwrite existing files

  \x1b[1mComponents:\x1b[0m`);
  for (const [name, { desc }] of Object.entries(COMPONENTS)) {
    console.log(`    \x1b[36m${name.padEnd(12)}\x1b[0m ${desc}`);
  }
  console.log(`
  \x1b[1mInteractive:\x1b[0m
    npx @polpo-ai/ui add

  \x1b[1mNon-interactive (for CI / AI agents):\x1b[0m
    npx @polpo-ai/ui add --all
    npx @polpo-ai/ui add tools hooks --overwrite
  `);
  process.exit(0);
}

// ── List ──

if (cmd === "list" || cmd === "ls") {
  console.log("\n  Available components:\n");
  for (const [name, { desc }] of Object.entries(COMPONENTS)) {
    console.log(`  \x1b[36m${name.padEnd(12)}\x1b[0m ${desc}`);
  }
  console.log();
  process.exit(0);
}

// ── Add ──

if (cmd !== "add") {
  console.error(`Unknown command: ${cmd}. Use "add" or "list".`);
  process.exit(1);
}

let selected = [];

if (allFlag) {
  // --all flag: install everything
  selected = ["chat"];
} else if (filteredArgs.length > 0) {
  // Explicit component names passed
  for (const name of filteredArgs) {
    if (!COMPONENTS[name]) {
      console.error(`\x1b[31mUnknown component: "${name}"\x1b[0m`);
      console.error(`Available: ${Object.keys(COMPONENTS).join(", ")}`);
      process.exit(1);
    }
  }
  selected = filteredArgs;
} else {
  // Interactive multi-select
  selected = await interactiveSelect();
  if (selected.length === 0) {
    console.log("\n  Nothing selected.\n");
    process.exit(0);
  }
}

// ── Install ──

for (const name of selected) {
  const { file, desc } = COMPONENTS[name];
  const url = `${REGISTRY}/${file}`;
  console.log(`\n\x1b[1m▸ Adding ${name}\x1b[0m — ${desc}\n`);
  try {
    const flags = overwrite ? "--overwrite" : "";
    execSync(`npx shadcn@latest add "${url}" ${flags}`, { stdio: "inherit" });
  } catch {
    console.error(`\n\x1b[31mFailed to add "${name}". Make sure shadcn is initialized (npx shadcn init).\x1b[0m`);
    process.exit(1);
  }
}

console.log("\n\x1b[32m✓ Done!\x1b[0m\n");

// ── Interactive multi-select ──

async function interactiveSelect() {
  const keys = Object.keys(COMPONENTS);
  const checked = new Set();

  // Pre-select "chat" (all) by default
  checked.add("chat");

  let cursor = 0;

  const render = () => {
    // Move cursor up to redraw
    if (cursor >= 0) process.stdout.write(`\x1b[${keys.length + 3}A`);

    console.log(`\n  \x1b[1mSelect components to add:\x1b[0m  \x1b[90m(space to toggle, enter to confirm)\x1b[0m\n`);
    keys.forEach((name, i) => {
      const isChecked = checked.has(name);
      const isCursor = i === cursor;
      const checkbox = isChecked ? "\x1b[36m◉\x1b[0m" : "○";
      const label = isCursor ? `\x1b[1m${name}\x1b[0m` : name;
      const desc = `\x1b[90m${COMPONENTS[name].desc}\x1b[0m`;
      const pointer = isCursor ? "\x1b[36m❯\x1b[0m" : " ";
      console.log(`  ${pointer} ${checkbox} ${label.padEnd(isCursor ? 24 : 12)} ${desc}`);
    });
  };

  // Initial render
  console.log(`\n  \x1b[1mSelect components to add:\x1b[0m  \x1b[90m(space to toggle, enter to confirm)\x1b[0m\n`);
  keys.forEach((name, i) => {
    const isChecked = checked.has(name);
    const checkbox = isChecked ? "\x1b[36m◉\x1b[0m" : "○";
    const pointer = i === 0 ? "\x1b[36m❯\x1b[0m" : " ";
    const label = i === 0 ? `\x1b[1m${name}\x1b[0m` : name;
    const desc = `\x1b[90m${COMPONENTS[name].desc}\x1b[0m`;
    console.log(`  ${pointer} ${checkbox} ${label.padEnd(i === 0 ? 24 : 12)} ${desc}`);
  });

  return new Promise((resolve) => {
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    stdin.on("data", (key) => {
      if (key === "\u0003") {
        // Ctrl+C
        stdin.setRawMode(false);
        process.exit(0);
      }

      if (key === "\r" || key === "\n") {
        // Enter — confirm
        stdin.setRawMode(false);
        stdin.pause();
        console.log();
        resolve([...checked]);
        return;
      }

      if (key === " ") {
        // Space — toggle
        const name = keys[cursor];
        if (checked.has(name)) {
          checked.delete(name);
          // If unchecking "chat" (all), don't auto-select others
        } else {
          checked.add(name);
          // If checking "chat" (all), uncheck individual parts (they're included)
          if (name === "chat") {
            keys.forEach((k) => { if (k !== "chat") checked.delete(k); });
          } else {
            // If selecting individual, uncheck "chat" (all)
            checked.delete("chat");
          }
        }
        render();
        return;
      }

      if (key === "\x1b[A" || key === "k") {
        // Up
        cursor = (cursor - 1 + keys.length) % keys.length;
        render();
        return;
      }

      if (key === "\x1b[B" || key === "j") {
        // Down
        cursor = (cursor + 1) % keys.length;
        render();
        return;
      }
    });
  });
}
