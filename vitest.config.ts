import { defineConfig } from "vitest/config";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@insight-chart/core": resolve(__dirname, "packages/core/src/index.ts"),
    },
  },
  test: {
    // Default: node environment for pure unit tests.
    // Files with .dom.test.ts suffix run in happy-dom.
    environmentMatchGlobs: [
      ["**/*.dom.test.ts", "happy-dom"],
    ],
    globals: true,
    setupFiles: ["./vitest.setup.dom.ts"],
  },
});
