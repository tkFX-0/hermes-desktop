import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  RUNTIME_READONLY_STATUS_BOARD_IPC_CHANNEL,
  RUNTIME_READONLY_STATUS_BOARD_PRELOAD_PUBLIC_METHODS
} from "./runtime-readonly-status-board-ipc";
import { createShikishimaStatusBoardPreloadApi } from "../../preload/shikishima-status-board";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projRoot = join(__dirname, "..", "..", "..");

describe("runtime readonly status board ipc contract", () => {
  it("defines getSnapshot channel only", () => {
    expect(RUNTIME_READONLY_STATUS_BOARD_IPC_CHANNEL).toBe(
      "runtimeReadonlyStatusBoard.getSnapshot"
    );
    expect(RUNTIME_READONLY_STATUS_BOARD_PRELOAD_PUBLIC_METHODS).toEqual(["getSnapshot"]);
  });

  it("preload factory exposes getSnapshot only", () => {
    const api = createShikishimaStatusBoardPreloadApi();
    expect(Object.keys(api).sort()).toEqual(["getSnapshot"]);
  });

  it("preload module avoids forbidden API names", () => {
    const src = readFileSync(join(projRoot, "src/preload/shikishima-status-board.ts"), "utf8");
    expect(src).toContain("RUNTIME_READONLY_STATUS_BOARD_IPC_CHANNEL");
    expect(src).not.toMatch(/\bsendMessage\b/);
    expect(src).not.toMatch(/\bexecute\b/);
    expect(src).not.toMatch(/\bmutate\b/);
  });

  it("preload index exposes shikishimaStatusBoard", () => {
    const src = readFileSync(join(projRoot, "src/preload/index.ts"), "utf8");
    expect(src).toContain("shikishimaStatusBoard");
    expect(src).toContain("exposeInMainWorld");
  });
});
