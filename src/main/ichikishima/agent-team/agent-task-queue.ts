/** 実行キュー論理モデル。**dispatch しない**。 */
export interface AgentTaskStub {
  readonly taskId: string;
  readonly kind: string;
  readonly dispatched: false;
}

let stubSeq = 0;

export function enqueueAgentTaskStub(kind: string): AgentTaskStub {
  stubSeq += 1;
  return {
    taskId: `dry_run_stub_${stubSeq}:${kind}`,
    kind,
    dispatched: false,
  };
}

/** 論理のみ（恒久的なキュー状態は保存しない）。 */
export function peekAgentDryRunStubSeq(): number {
  return stubSeq;
}
