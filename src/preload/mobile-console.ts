import { ipcRenderer } from "electron";
import type { MobileConsoleSnapshot } from "../shared/mobile-console";
import { MOBILE_CONSOLE_READONLY_GET_SNAPSHOT_IPC_CHANNEL } from "../shared/mobile-console";

export const MOBILE_CONSOLE_PRELOAD_PUBLIC_METHODS = [
  "getRedactedSnapshot",
] as const;

export interface MobileConsolePreloadApi {
  /** Read-only redacted snapshot. No execution, no mutation. */
  readonly getRedactedSnapshot: () => Promise<MobileConsoleSnapshot>;
}

export function createMobileConsolePreloadApi(): MobileConsolePreloadApi {
  return {
    getRedactedSnapshot: () =>
      ipcRenderer.invoke(
        MOBILE_CONSOLE_READONLY_GET_SNAPSHOT_IPC_CHANNEL,
      ) as Promise<MobileConsoleSnapshot>,
  };
}
