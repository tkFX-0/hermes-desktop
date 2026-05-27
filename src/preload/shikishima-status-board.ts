import { ipcRenderer } from "electron";
import type { RuntimeReadonlyStatusBoardIpcResult } from "../shared/runtime-readonly-status-board/runtime-readonly-status-board-types";
import {
  RUNTIME_READONLY_STATUS_BOARD_IPC_CHANNEL,
  RUNTIME_READONLY_STATUS_BOARD_PRELOAD_PUBLIC_METHODS
} from "../shared/runtime-readonly-status-board/runtime-readonly-status-board-ipc";

export { RUNTIME_READONLY_STATUS_BOARD_PRELOAD_PUBLIC_METHODS };

export type ShikishimaStatusBoardPreloadApi = {
  getSnapshot: () => Promise<RuntimeReadonlyStatusBoardIpcResult>;
};

export function createShikishimaStatusBoardPreloadApi(): ShikishimaStatusBoardPreloadApi {
  return {
    getSnapshot: () => ipcRenderer.invoke(RUNTIME_READONLY_STATUS_BOARD_IPC_CHANNEL)
  };
}
