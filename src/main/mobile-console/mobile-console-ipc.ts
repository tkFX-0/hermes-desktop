/**
 * Read-only IPC handler registration for MobileConsole — no execution, no mutation.
 * Follows the same DI/IpcMainLike pattern as control-center-readonly-ipc.ts.
 */
import { MOBILE_CONSOLE_READONLY_GET_SNAPSHOT_IPC_CHANNEL } from "../../shared/mobile-console";
import { buildLiveMobileConsoleSnapshot } from "./mobile-console-snapshot-service";
import type { ControlCenterDataProviderParams } from "../ichikishima/control-center/control-center-data-provider";

/** テスト用 `ipcMain` 互換最小面（control-center と同じ型） */
export interface IpcMainLike {
  handle(
    channel: string,
    listener: (
      event: unknown,
      ...args: unknown[]
    ) => unknown | Promise<unknown>,
  ): void;
}

export interface MobileConsoleIpcRegisterOptions {
  getParams: () => ControlCenterDataProviderParams;
}

const CHANNEL = MOBILE_CONSOLE_READONLY_GET_SNAPSHOT_IPC_CHANNEL;

function assertReadonlyChannelName(channel: string): void {
  if (!channel.startsWith("mobileConsole.readonly.")) {
    throw new Error(`ipc:channel_namespace_invalid:${channel}`);
  }
  const forbidden =
    /execute|\.run\.|rawFs|rawShell|rawNetwork|rawGit|push|approve|mutate/i;
  if (forbidden.test(channel)) {
    throw new Error(`ipc:channel_forbidden_pattern:${channel}`);
  }
}

export function registerMobileConsoleIpcHandler(
  ipcMainLike: IpcMainLike,
  opts: MobileConsoleIpcRegisterOptions,
): void {
  assertReadonlyChannelName(CHANNEL);
  ipcMainLike.handle(CHANNEL, () => {
    return buildLiveMobileConsoleSnapshot({
      controlCenterParams: opts.getParams(),
    });
  });
}
