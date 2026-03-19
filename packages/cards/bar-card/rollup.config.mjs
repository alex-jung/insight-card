import esbuild from "rollup-plugin-esbuild";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import alias from "@rollup/plugin-alias";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const production = process.env.NODE_ENV === "production";

/** @type {import("rollup").RollupOptions} */
export default {
  input: "src/insight-bar-card.ts",
  output: {
    file: "../../../dist/insight-bar-card.js",
    format: "es",
    sourcemap: !production,
  },
  plugins: [
    alias({
      entries: [
        { find: "@insight-chart/core", replacement: resolve(__dirname, "../../core/src/index.ts") },
      ],
    }),
    nodeResolve({ browser: true, exportConditions: ["browser", "module", "import", "default"], extensions: [".ts", ".js"] }),
    esbuild({
      target: "es2020",
      tsconfig: resolve(__dirname, "../../../tsconfig.json"),
    }),
    production && terser({ format: { comments: false } }),
  ].filter(Boolean),
  onwarn(warning, warn) {
    if (warning.code === "CIRCULAR_DEPENDENCY") return;
    warn(warning);
  },
};
