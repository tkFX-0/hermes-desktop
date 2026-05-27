import type { IpcMain } from "electron";
import { RUNTIME_READONLY_STATUS_BOARD_IPC_CHANNEL } from "../../shared/runtime-readonly-status-board/runtime-readonly-status-board-ipc";
import { getRuntimeReadonlyStatusBoardSnapshotResult } from "./runtime-readonly-status-board-provider";

function assertReadOnlyStatusBoardChannel(channel: string): void {
  if (channel !== RUNTIME_READONLY_STATUS_BOARD_IPC_CHANNEL) {
    throw new Error("ipc:status_board_channel_invalid");
  }
  const forbidden =
    /execute|send|mutate|update|run|start|token|webhook|gateway|raw/i;
  if (forbidden.test(channel.replace(RUNTIME_READONLY_STATUS_BOARD_IPC_CHANNEL, ""))) {
    throw new Error("ipc:status_board_channel_forbidden_pattern");
  }
}

export function registerRuntimeReadonlyStatusBoardIpcHandlers(ipcMain: IpcMain): void {
  assertReadOnlyStatusBoardChannel(RUNTIME_READONLY_STATUS_BOARD_IPC_CHANNEL);

  ipcMain.handle(RUNTIME_READONLY_STATUS_BOARD_IPC_CHANNEL, async () =>
    getRuntimeReadonlyStatusBoardSnapshotResult()
  );
}

export function getRuntimeReadonlyStatusBoardIpcChannels(): readonly string[] {
  return [RUNTIME_READONLY_STATUS_BOARD_IPC_CHANNEL];
}
