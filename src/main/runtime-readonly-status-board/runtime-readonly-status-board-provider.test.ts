import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { RUNTIME_READONLY_STATUS_BOARD_IPC_CHANNEL } from "../../shared/runtime-readonly-status-board/runtime-readonly-status-board-ipc";
import { getRuntimeReadonlyStatusBoardIpcChannels } from "./runtime-readonly-status-board-ipc";
import { getRuntimeReadonlyStatusBoardSnapshotResult } from "./runtime-readonly-status-board-provider";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("runtime readonly status board main provider", () => {
  it("exposes getSnapshot IPC channel only", () => {
    expect(getRuntimeReadonlyStatusBoardIpcChannels()).toEqual([
      RUNTIME_READONLY_STATUS_BOARD_IPC_CHANNEL
    ]);
    expect(RUNTIME_READONLY_STATUS_BOARD_IPC_CHANNEL).toBe(
      "runtimeReadonlyStatusBoard.getSnapshot"
    );
  });

  it("returns readonly snapshot with safety invariants", () => {
    const result = getRuntimeReadonlyStatusBoardSnapshotResult();

    expect(result.ok).toBe(true);
    expect(result.snapshot.readonlyOnly).toBe(true);
    expect(result.snapshot.safety.productionReady).toBe(false);
    expect(result.snapshot.safety.execution).toBe("disabled");
    expect(result.snapshot.safety.actualDiscordSend).toBe(false);
    expect(result.snapshot.safety.runtimeStarted).toBe(false);
    expect(result.snapshot.sections.find((s) => s.id === "runtime")?.status).toBe("HOLD");
  });

  it("ipc registration module does not import fs", () => {
    const source = readFileSync(join(__dirname, "runtime-readonly-status-board-ipc.ts"), "utf8");
    expect(source).not.toMatch(/from\s+["']node:fs["']/);
  });
});
