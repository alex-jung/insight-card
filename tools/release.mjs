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
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = join(ROOT, "dist");
const CARDS_DIR = join(ROOT, "packages", "cards");

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
// 2. Discover card packages
// ---------------------------------------------------------------------------

const cardDirs = readdirSync(CARDS_DIR).filter((name) => {
  const pkgJson = join(CARDS_DIR, name, "package.json");
  return existsSync(pkgJson);
});

if (cardDirs.length === 0) {
  log("No card packages found — nothing to build.");
  process.exit(0);
}

log(`\nBuilding ${cardDirs.length} card(s): ${cardDirs.join(", ")}\n`);

// ---------------------------------------------------------------------------
// 3. Build each card
// ---------------------------------------------------------------------------

const failed = [];

for (const cardName of cardDirs) {
  const cardDir = join(CARDS_DIR, cardName);
  const rollupConfig = join(cardDir, "rollup.config.mjs");

  if (!existsSync(rollupConfig)) {
    log(`  [skip] ${cardName} — no rollup.config.mjs found`);
    continue;
  }

  log(`Building ${cardName} …`);
  try {
    run(
      `node --experimental-vm-modules ../../node_modules/.bin/rollup -c rollup.config.mjs`,
      cardDir,
    );
    log(`  [ok] ${cardName}`);
  } catch {
    log(`  [FAIL] ${cardName}`);
    failed.push(cardName);
  }
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
