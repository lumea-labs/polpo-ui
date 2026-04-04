#!/usr/bin/env node

import { execSync, spawnSync } from "child_process";
import { existsSync, writeFileSync, readFileSync } from "fs";
import { resolve, basename } from "path";
import { createInterface } from "readline";

const REPO = "lumea-labs/polpo-ui";
const BRANCH = "main";
const TEMPLATES = {
  chat: {
    desc: "Full-page chat with sidebar, sessions, and dark/light mode",
    path: "examples/chat",
  },
  "chat-widget": {
    desc: "Floating/embedded support widget with multiple variants",
    path: "examples/chat-widget",
  },
  "multi-agent": {
    desc: "Multi-agent workspace with grouped sessions (Conductor-style)",
    path: "examples/multi-agent",
  },
};

// ── Prompt helper ──

function prompt(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((res) => rl.question(question, (answer) => { rl.close(); res(answer.trim()); }));
}

// ── Parse args ──

const args = process.argv.slice(2);
const yes = args.includes("-y") || args.includes("--yes");

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
  \x1b[1mcreate-polpo-app\x1b[0m — Create Polpo AI applications from starter templates

  \x1b[1mUsage:\x1b[0m
    npx create-polpo-app [project-name] [options]

  \x1b[1mOptions:\x1b[0m
    -t, --template <name>   Template to use (default: chat)
    -y, --yes               Skip prompts, use defaults
    --skip-install           Skip dependency installation
    --list                  List available templates
    -h, --help              Show this help

  \x1b[1mTemplates:\x1b[0m`);
  for (const [name, { desc }] of Object.entries(TEMPLATES)) {
    console.log(`    \x1b[36m${name.padEnd(16)}\x1b[0m ${desc}`);
  }
  console.log(`
  \x1b[1mInteractive:\x1b[0m
    npx create-polpo-app

  \x1b[1mNon-interactive (for CI / AI agents):\x1b[0m
    npx create-polpo-app my-chat -t chat -y
    npx create-polpo-app my-widget -t chat-widget -y --skip-install
  `);
  process.exit(0);
}

if (args.includes("--list") || args.includes("ls")) {
  console.log("\n  Available templates:\n");
  for (const [name, { desc }] of Object.entries(TEMPLATES)) {
    console.log(`  \x1b[36m${name.padEnd(16)}\x1b[0m ${desc}`);
  }
  console.log();
  process.exit(0);
}

// ── Extract flags ──

let projectName = null;
let template = null;
const skipInstall = args.includes("--skip-install");

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--template" || args[i] === "-t") {
    template = args[++i];
  } else if (!args[i].startsWith("-")) {
    projectName = args[i];
  }
}

// ── Interactive mode (when args missing) ──

if (!projectName) {
  if (yes) {
    console.error("\x1b[31mError: --yes requires a project name.\x1b[0m");
    process.exit(1);
  }
  console.log();
  console.log("  \x1b[1mcreate-polpo-app\x1b[0m");
  console.log();
  projectName = await prompt("  Project name: ");
  if (!projectName) {
    console.error("\x1b[31mProject name is required.\x1b[0m");
    process.exit(1);
  }
}

if (!template) {
  if (yes) {
    template = "chat";
  } else {
    console.log();
    console.log("  \x1b[1mSelect a template:\x1b[0m");
    const keys = Object.keys(TEMPLATES);
    keys.forEach((name, i) => {
      console.log(`    \x1b[36m${i + 1})\x1b[0m ${name.padEnd(16)} ${TEMPLATES[name].desc}`);
    });
    console.log();
    const choice = await prompt(`  Template [1-${keys.length}] (default: 1): `);
    const idx = (parseInt(choice) || 1) - 1;
    template = keys[Math.min(Math.max(idx, 0), keys.length - 1)];
  }
}

// ── Validate ──

if (!TEMPLATES[template]) {
  console.error(`\x1b[31mError: Unknown template "${template}".\x1b[0m`);
  console.error(`Available: ${Object.keys(TEMPLATES).join(", ")}`);
  process.exit(1);
}

const targetDir = resolve(process.cwd(), projectName);

if (existsSync(targetDir)) {
  console.error(`\x1b[31mError: Directory "${projectName}" already exists.\x1b[0m`);
  process.exit(1);
}

const { path: templatePath, desc } = TEMPLATES[template];

// ── Download template ──

console.log();
console.log(`  \x1b[1m▸ Creating ${projectName}\x1b[0m`);
console.log(`  \x1b[90mTemplate: ${template} — ${desc}\x1b[0m`);
console.log();

const degitUrl = `${REPO}/${templatePath}#${BRANCH}`;

try {
  execSync(`npx --yes degit "${degitUrl}" "${targetDir}"`, { stdio: "inherit" });
} catch {
  console.log("  \x1b[90mFalling back to git clone...\x1b[0m");
  const tmpDir = `${targetDir}__tmp`;
  try {
    execSync(
      `git clone --depth 1 --filter=blob:none --sparse https://github.com/${REPO}.git "${tmpDir}"`,
      { stdio: "pipe" },
    );
    execSync(`git sparse-checkout set "${templatePath}"`, { cwd: tmpDir, stdio: "pipe" });
    execSync(`mv "${tmpDir}/${templatePath}" "${targetDir}"`, { stdio: "pipe" });
    execSync(`rm -rf "${tmpDir}"`, { stdio: "pipe" });
  } catch {
    console.error("\x1b[31mFailed to download template.\x1b[0m");
    try { execSync(`rm -rf "${tmpDir}"`, { stdio: "pipe" }); } catch {}
    process.exit(1);
  }
}

// ── Update package.json name ──

try {
  const pkgPath = resolve(targetDir, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  pkg.name = basename(projectName);
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
} catch {}

// ── Create .env.local ──

const envPath = resolve(targetDir, ".env.local");
if (!existsSync(envPath)) {
  writeFileSync(envPath, `# Polpo API key — get yours at https://polpo.sh\nNEXT_PUBLIC_POLPO_API_KEY=\n`);
}

// ── Install deps ──

const pm = detectPackageManager();

if (!skipInstall) {
  console.log();
  console.log("  \x1b[1m▸ Installing dependencies...\x1b[0m");
  console.log();
  spawnSync(pm, ["install"], { cwd: targetDir, stdio: "inherit" });
}

// ── Done ──

console.log();
console.log(`  \x1b[32m✓ Done!\x1b[0m`);
console.log();
console.log(`  \x1b[1mNext steps:\x1b[0m`);
console.log();
console.log(`    cd ${projectName}`);
console.log(`    # Add your Polpo API key to .env.local`);
if (skipInstall) console.log(`    ${pm} install`);
console.log(`    ${pm === "npm" ? "npm run" : pm} dev`);
console.log();

function detectPackageManager() {
  const ua = process.env.npm_config_user_agent || "";
  if (ua.includes("pnpm")) return "pnpm";
  if (ua.includes("yarn")) return "yarn";
  if (ua.includes("bun")) return "bun";
  return "npm";
}
