/**
 * Main / preload で同一文字列を参照するための read-only IPC チャンネル定数。
 * preload から src/main を直接 import しないための共有層。
 */
export const MOBILE_CONSOLE_READONLY_GET_SNAPSHOT_IPC_CHANNEL =
  "mobileConsole.readonly.getRedactedSnapshot" as const;
