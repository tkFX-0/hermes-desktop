/**
 * Main / preload で **同一文字列**を参照するための read-only IPC チャンネル定数。
 * preload から `src/main/ichikishima/**` を import しないための共有層。
 */
export const CONTROL_CENTER_READONLY_GET_APP_SNAPSHOT_IPC_CHANNEL =
  "controlCenter.readonly.getAppSnapshot" as const;
