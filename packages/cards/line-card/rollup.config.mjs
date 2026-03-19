import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  readFileSync(resolve(__dirname, "package.json"), "utf-8"),
);

const production = process.env.NODE_ENV === "production";

/** @type {import("rollup").RollupOptions} */
export default {
  input: "src/insight-line-card.ts",

  output: {
    file: "../../../dist/insight-line-card.js",
    format: "iife",
    name: "InsightLineCard",
    sourcemap: !production,
  },

  plugins: [
    nodeResolve({
      browser: true,
      exportConditions: ["browser", "module", "import", "default"],
    }),
    typescript({
      tsconfig: resolve(__dirname, "../../../tsconfig.json"),
      compilerOptions: {
        // Override noEmit for the build step
        noEmit: false,
        outDir: undefined,
        declaration: false,
        declarationMap: false,
      },
    }),
    production && terser({ format: { comments: false } }),
  ].filter(Boolean),

  // Lit is provided by Home Assistant at runtime — do NOT bundle it.
  external: ["lit", "lit/decorators.js", "lit/directives/repeat.js"],

  onwarn(warning, warn) {
    // Suppress circular-dependency noise from uplot
    if (warning.code === "CIRCULAR_DEPENDENCY") return;
    warn(warning);
  },
};
