import {
  buildRuntimeReadonlyStatusBoardFixtureInput,
  createRuntimeReadonlyStatusBoardHoldFallbackSnapshot,
  createRuntimeReadonlyStatusBoardSnapshot
} from "../../shared/runtime-readonly-status-board/runtime-readonly-status-board";
import type {
  RuntimeReadonlyStatusBoardIpcResult,
  RuntimeReadonlyStatusBoardSnapshot
} from "../../shared/runtime-readonly-status-board/runtime-readonly-status-board-types";

export function getRuntimeReadonlyStatusBoardSnapshot(): RuntimeReadonlyStatusBoardSnapshot {
  const input = buildRuntimeReadonlyStatusBoardFixtureInput({
    generatedAtLabel: new Date().toISOString().slice(0, 10)
  });
  const snapshot = createRuntimeReadonlyStatusBoardSnapshot(input);
  return {
    ...snapshot,
    safety: {
      ...snapshot.safety,
      ipcConnected: true,
      preloadExposed: true,
      rendererWired: true,
      reactUiImplemented: true
    }
  };
}

export function getRuntimeReadonlyStatusBoardSnapshotResult(): RuntimeReadonlyStatusBoardIpcResult {
  try {
    return {
      ok: true,
      snapshot: getRuntimeReadonlyStatusBoardSnapshot()
    };
  } catch {
    return {
      ok: false,
      snapshot: createRuntimeReadonlyStatusBoardHoldFallbackSnapshot({
        ipcConnected: true,
        preloadExposed: true,
        rendererWired: false
      }),
      errorKind: "REDACTED_STATUS_BOARD_PROVIDER_ERROR"
    };
  }
}
