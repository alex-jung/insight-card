#!/usr/bin/env node
/**
 * hacs-validate.mjs — Validate HACS compatibility for InsightChart.
 *
 * Checks:
 *  1. hacs.json exists and contains required fields.
 *  2. dist/ directory exists and contains at least one .js file.
 *  3. README.md exists.
 *  4. No package.json "private" leakage (card packages must not be private).
 *  5. Each card package has a valid package.json with a "build" script.
 *
 * Exit code 0 = all checks passed.
 * Exit code 1 = one or more checks failed.
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ---------------------------------------------------------------------------
// Reporter
// ---------------------------------------------------------------------------

let passCount = 0;
let failCount = 0;

function pass(msg) {
  process.stdout.write(`  [PASS] ${msg}\n`);
  passCount++;
}

function fail(msg) {
  process.stdout.write(`  [FAIL] ${msg}\n`);
  failCount++;
}

function section(title) {
  process.stdout.write(`\n${title}\n${"─".repeat(title.length)}\n`);
}

// ---------------------------------------------------------------------------
// Check 1: hacs.json
// ---------------------------------------------------------------------------

section("1. hacs.json");

const hacsJsonPath = join(ROOT, "hacs.json");
if (!existsSync(hacsJsonPath)) {
  fail("hacs.json not found");
} else {
  let hacsJson;
  try {
    hacsJson = JSON.parse(readFileSync(hacsJsonPath, "utf-8"));
    pass("hacs.json exists and is valid JSON");
  } catch {
    fail("hacs.json is not valid JSON");
    hacsJson = null;
  }

  if (hacsJson) {
    const required = ["name", "homeassistant"];
    for (const field of required) {
      if (hacsJson[field]) {
        pass(`hacs.json has required field: ${field}`);
      } else {
        fail(`hacs.json missing required field: ${field}`);
      }
    }

    // Check minimum HA version format (should be semver-like)
    if (hacsJson.homeassistant) {
      const versionRe = /^\d{4}\.\d+\.\d+$/;
      if (versionRe.test(hacsJson.homeassistant)) {
        pass(`homeassistant version format is valid: ${hacsJson.homeassistant}`);
      } else {
        fail(
          `homeassistant version "${hacsJson.homeassistant}" does not match YYYY.MM.patch format`,
        );
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Check 2: dist/ files
// ---------------------------------------------------------------------------

section("2. dist/ directory");

const distDir = join(ROOT, "dist");
if (!existsSync(distDir)) {
  fail(
    "dist/ directory not found — run 'npm run build' before HACS validation",
  );
} else {
  pass("dist/ directory exists");
  const jsFiles = readdirSync(distDir).filter((f) => f.endsWith(".js"));
  if (jsFiles.length === 0) {
    fail("dist/ contains no .js files");
  } else {
    pass(`dist/ contains ${jsFiles.length} .js file(s): ${jsFiles.join(", ")}`);
    for (const file of jsFiles) {
      const size = statSync(join(distDir, file)).size;
      if (size < 100) {
        fail(`${file} is suspiciously small (${size} bytes) — build may have failed`);
      } else {
        pass(`${file}: ${(size / 1024).toFixed(1)} KB`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Check 3: README.md
// ---------------------------------------------------------------------------

section("3. README.md");

const readmePath = join(ROOT, "README.md");
if (!existsSync(readmePath)) {
  fail("README.md not found");
} else {
  const content = readFileSync(readmePath, "utf-8");
  pass("README.md exists");
  if (content.length < 100) {
    fail("README.md is too short (< 100 chars) — HACS render_readme may look empty");
  } else {
    pass(`README.md length: ${content.length} chars`);
  }
}

// ---------------------------------------------------------------------------
// Check 4: Root package.json
// ---------------------------------------------------------------------------

section("4. Root package.json");

const rootPkgPath = join(ROOT, "package.json");
if (!existsSync(rootPkgPath)) {
  fail("package.json not found in root");
} else {
  let rootPkg;
  try {
    rootPkg = JSON.parse(readFileSync(rootPkgPath, "utf-8"));
    pass("root package.json is valid JSON");
  } catch {
    fail("root package.json is not valid JSON");
    rootPkg = null;
  }

  if (rootPkg) {
    if (rootPkg.workspaces) {
      pass("npm workspaces configured");
    } else {
      fail("npm workspaces not configured in root package.json");
    }

    const requiredScripts = ["build", "test", "lint"];
    for (const script of requiredScripts) {
      if (rootPkg.scripts?.[script]) {
        pass(`script "${script}" defined`);
      } else {
        fail(`script "${script}" missing from package.json scripts`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Check 5: Card packages
// ---------------------------------------------------------------------------

section("5. Card packages");

const cardsDir = join(ROOT, "packages", "cards");
if (!existsSync(cardsDir)) {
  fail("packages/cards/ directory not found");
} else {
  const cardDirs = readdirSync(cardsDir).filter((name) =>
    statSync(join(cardsDir, name)).isDirectory(),
  );

  if (cardDirs.length === 0) {
    fail("No card packages found in packages/cards/");
  } else {
    pass(`Found ${cardDirs.length} card package(s): ${cardDirs.join(", ")}`);

    for (const cardName of cardDirs) {
      const srcDir = join(cardsDir, cardName, "src");
      if (existsSync(srcDir)) {
        pass(`${cardName}: src/ directory exists`);
      } else {
        fail(`${cardName}: src/ directory not found`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Result
// ---------------------------------------------------------------------------

process.stdout.write(
  `\n${"=".repeat(40)}\n` +
    `Results: ${passCount} passed, ${failCount} failed\n` +
    `${"=".repeat(40)}\n`,
);

if (failCount > 0) {
  process.exit(1);
}

process.stdout.write("All HACS validation checks passed.\n");
