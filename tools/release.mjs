#!/usr/bin/env node
/**
 * release.mjs — Build all InsightChart cards and collect output bundles.
 *
 * Steps:
 *  1. Ensure the root dist/ directory exists (clean it first).
 *  2. For each card package, run `npm run build` via the package's own
 *     rollup.config.mjs, which writes into <root>/dist/.
 *  3. Print a summary of the resulting dist/ files.
 *
 * Usage:
 *   node tools/release.mjs
 *   node tools/release.mjs --no-clean   # Skip the dist clean step
 */

import { execSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
} from "node:fs";
// readdirSync still used for dist summary
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = join(ROOT, "dist");

// ---------------------------------------------------------------------------
// Flags
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const skipClean = args.includes("--no-clean");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function log(msg) {
  process.stdout.write(`${msg}\n`);
}

function run(cmd, cwd) {
  log(`  > ${cmd}`);
  execSync(cmd, { cwd, stdio: "inherit" });
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// ---------------------------------------------------------------------------
// 1. Clean / create dist/
// ---------------------------------------------------------------------------

if (!skipClean) {
  if (existsSync(DIST)) {
    log(`\nCleaning ${DIST} …`);
    rmSync(DIST, { recursive: true, force: true });
  }
}
mkdirSync(DIST, { recursive: true });

// ---------------------------------------------------------------------------
// 2. Build combined bundle
// ---------------------------------------------------------------------------

log(`\nBuilding combined bundle …\n`);

const failed = [];

try {
  run(
    `node ${JSON.stringify(join(ROOT, "node_modules", ".bin", "rollup"))} -c rollup.config.mjs`,
    ROOT,
  );
  log(`  [ok] insight-chart.js`);
} catch {
  log(`  [FAIL] insight-chart.js`);
  failed.push("insight-chart");
}

// ---------------------------------------------------------------------------
// 4. Summary
// ---------------------------------------------------------------------------

log("\n--- dist/ contents ---");
const distFiles = existsSync(DIST) ? readdirSync(DIST) : [];
if (distFiles.length === 0) {
  log("  (empty)");
} else {
  for (const file of distFiles.sort()) {
    const fullPath = join(DIST, file);
    const size = statSync(fullPath).size;
    log(`  ${file.padEnd(40)} ${formatBytes(size)}`);
  }
}

if (failed.length > 0) {
  log(`\nFailed builds: ${failed.join(", ")}`);
  process.exit(1);
}

log("\nBuild complete.");
