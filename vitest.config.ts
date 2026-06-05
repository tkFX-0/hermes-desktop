import { resolve, join } from "path";
import { defineConfig } from "vitest/config";

const cwd = process.cwd();

export default defineConfig({
  root: cwd,
  resolve: {
    alias: {
      "@renderer": join(cwd, "src/renderer/src"),
      "@shared": join(cwd, "src/shared"),
    },
    preserveSymlinks: true,
  },
  test: {
    root: cwd,
    environment: "jsdom",
    globals: true,
    passWithNoTests: true,
    setupFiles: [join(cwd, "src/renderer/src/test/setup.ts")],
    include: ["src/**/*.test.ts", "src/**/*.test.tsx", "tests/**/*.test.ts"],
    environmentMatchGlobs: [
      ["tests/**", "node"],
    ],
  },
});
