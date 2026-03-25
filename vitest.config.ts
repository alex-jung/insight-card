import { defineConfig } from "vitest/config";

export default defineConfig({
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
