import type { ControlCenterAppSnapshot } from "../main/ichikishima/control-center/control-center-app-snapshot";
import { ipcRenderer } from "electron";

import { CONTROL_CENTER_READONLY_GET_APP_SNAPSHOT_IPC_CHANNEL } from "../shared/ichikishima/control-center-readonly-ipc-channel";

/** `window.ichikishimaControlCenter` に載せるメソッド名（契約テスト用） */
export const ICHIKISHIMA_CONTROL_CENTER_PRELOAD_PUBLIC_METHODS = [
  "getAppSnapshot",
] as const;

export interface IchikishimaControlCenterPreloadApi {
  readonly getAppSnapshot: () => Promise<ControlCenterAppSnapshot>;
}

export function createIchikishimaControlCenterPreloadApi(): IchikishimaControlCenterPreloadApi {
  return {
    getAppSnapshot: () =>
      ipcRenderer.invoke(CONTROL_CENTER_READONLY_GET_APP_SNAPSHOT_IPC_CHANNEL),
  };
}
