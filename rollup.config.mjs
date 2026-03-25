import esbuild from "rollup-plugin-esbuild";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import alias from "@rollup/plugin-alias";
import json from "@rollup/plugin-json";
import copy from "rollup-plugin-copy";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const production = process.env.NODE_ENV === "production";

/** @type {import("rollup").RollupOptions} */
export default {
  input: "src/insight-card.ts",

  output: {
    file: "dist/insight-card.js",
    format: "es",
    sourcemap: !production,
  },

  plugins: [
    json(),
    copy({ targets: [{ src: "src/images/*", dest: "dist/images" }] }),
    alias({
      entries: [
        {
          find: "@insight-chart/core",
          replacement: resolve(__dirname, "packages/core/src/index.ts"),
        },
      ],
    }),
    nodeResolve({
      browser: true,
      exportConditions: ["browser", "module", "import", "default"],
      extensions: [".ts", ".js"],
    }),
    esbuild({
      target: "es2020",
      tsconfig: resolve(__dirname, "tsconfig.json"),
    }),
    terser({
      compress: {
        // Remove console.debug and console.log — keep console.info (version banner)
        pure_funcs: ["console.debug", "console.log", "console.warn"],
        passes: 1,
      },
      mangle: false,
      format: { comments: false, beautify: false },
    }),
  ].filter(Boolean),

  onwarn(warning, warn) {
    if (warning.code === "CIRCULAR_DEPENDENCY") return;
    warn(warning);
  },
};
