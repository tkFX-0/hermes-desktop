/**
 * Hermes 本体接続前の「橋」契約レイヤー。
 * 危険な操作は実行せず、許可候補／境界ブロック／絶対禁止を分類する。
 */

export interface HermesBridgeTaskDescriptor {
  taskId: string;
  title: string;
  description: string;
  requestedOperations: HermesBridgeOperation[];
}

export type HermesBridgeOperation =
  | { kind: "zone_read"; requestedPath: string }
  | { kind: "zone_write"; requestedPath: string; content: string }
  | { kind: "zone_delete"; requestedPath: string }
  | {
      kind: "execute_shell";
      command: string;
      args?: readonly string[];
    }
  | { kind: "network_http"; url: string }
  | { kind: "git_operation"; operation: string }
  /** `disposition` 省略時は承認キューへ。`policy_blocked` は境界で拒否のみ。 */
  | {
      kind: "dependency_install";
      disposition?: "approval_queue" | "policy_blocked";
      detail?: string;
    }
  /** クラウドLLM/API へのエスカレーション — 自動実行せず承認キューのみ */
  | { kind: "external_ai_escalation"; detail?: string }
  | { kind: "raw_fs"; detail?: string }
  | { kind: "raw_child_process"; detail?: string }
  | { kind: "raw_network"; detail?: string }
  | { kind: "raw_git"; detail?: string }
  | { kind: "memory_db_access"; detail?: string }
  | { kind: "mt5_ea_access"; detail?: string }
  | { kind: "env_secret_read"; detail?: string }
  | { kind: "production_config_write"; detail?: string };

export type HermesBridgeRouteTier =
  | {
      tier: "allowed_zone_candidate";
      op: Extract<HermesBridgeOperation, { kind: "zone_read" | "zone_write" }>;
    }
  | {
      tier: "blocked_zone_sensitive";
      op: Extract<
        HermesBridgeOperation,
        | { kind: "zone_delete" }
        | { kind: "execute_shell" }
        | { kind: "network_http" }
        | { kind: "git_operation" }
      >;
    }
  /**
   * 危険操作スタブ経由ではなく、Bridge が **承認キュー専用**として受理する種別。
   * （自動 npm / 外部AI 呼び出しは行わない）
   */
  | {
      tier: "bridge_requires_approval";
      op: Extract<
        HermesBridgeOperation,
        { kind: "dependency_install" } | { kind: "external_ai_escalation" }
      >;
    }
  | {
      tier: "forbidden_boundary";
      op: HermesBridgeOperation;
      reasonCode: string;
    };

export interface HermesBridgeReport {
  taskId: string;
  title: string;
  tierLabels: string[];
  notes: string[];
  requiresUserApproval: true;
}

export function createHermesBridgeTask(
  input: Omit<HermesBridgeTaskDescriptor, "requestedOperations"> & {
    requestedOperations?: HermesBridgeOperation[];
  },
): HermesBridgeTaskDescriptor {
  return {
    taskId: input.taskId,
    title: input.title,
    description: input.description,
    requestedOperations: input.requestedOperations ?? [],
  };
}

export function validateHermesBridgeOperation(
  operation: HermesBridgeOperation,
): HermesBridgeRouteTier {
  switch (operation.kind) {
    case "zone_read":
      return { tier: "allowed_zone_candidate", op: operation };
    case "zone_write":
      return { tier: "allowed_zone_candidate", op: operation };
    case "zone_delete":
      return { tier: "blocked_zone_sensitive", op: operation };
    case "execute_shell":
      return { tier: "blocked_zone_sensitive", op: operation };
    case "network_http":
      return { tier: "blocked_zone_sensitive", op: operation };
    case "git_operation":
      return { tier: "blocked_zone_sensitive", op: operation };
    case "dependency_install": {
      if (operation.disposition === "policy_blocked") {
        return {
          tier: "forbidden_boundary",
          op: operation,
          reasonCode: "DEPENDENCY_INSTALL_POLICY_BLOCKED",
        };
      }
      return { tier: "bridge_requires_approval", op: operation };
    }
    case "external_ai_escalation":
      return { tier: "bridge_requires_approval", op: operation };
    case "raw_fs":
      return {
        tier: "forbidden_boundary",
        op: operation,
        reasonCode: "RAW_FS_FORBIDDEN",
      };
    case "raw_child_process":
      return {
        tier: "forbidden_boundary",
        op: operation,
        reasonCode: "RAW_CHILD_PROCESS_FORBIDDEN",
      };
    case "raw_network":
      return {
        tier: "forbidden_boundary",
        op: operation,
        reasonCode: "RAW_NETWORK_FORBIDDEN",
      };
    case "raw_git":
      return {
        tier: "forbidden_boundary",
        op: operation,
        reasonCode: "RAW_GIT_FORBIDDEN",
      };
    case "memory_db_access":
      return {
        tier: "forbidden_boundary",
        op: operation,
        reasonCode: "MEMORY_DB_FORBIDDEN",
      };
    case "mt5_ea_access":
      return {
        tier: "forbidden_boundary",
        op: operation,
        reasonCode: "MT5_EA_FORBIDDEN",
      };
    case "env_secret_read":
      return {
        tier: "forbidden_boundary",
        op: operation,
        reasonCode: "ENV_SECRETS_FORBIDDEN",
      };
    case "production_config_write":
      return {
        tier: "forbidden_boundary",
        op: operation,
        reasonCode: "PRODUCTION_CONFIG_FORBIDDEN",
      };
  }
}

/** `validateHermesBridgeOperation` と同じ分類（Hermes 側の route 呼び出し名用）。 */
export function routeHermesOperation(
  operation: HermesBridgeOperation,
): HermesBridgeRouteTier {
  return validateHermesBridgeOperation(operation);
}

export function createHermesBridgeReport(
  descriptor: HermesBridgeTaskDescriptor,
): HermesBridgeReport {
  const tiers: string[] = [];
  const notes: string[] = [];

  for (const operation of descriptor.requestedOperations) {
    const routed = routeHermesOperation(operation);
    if (routed.tier === "allowed_zone_candidate") {
      tiers.push(`allowed:${operation.kind}`);
      notes.push(`${operation.kind} は autonomy zone 境界API経由の候補です`);
    } else if (routed.tier === "blocked_zone_sensitive") {
      tiers.push(`blocked_sensitive:${operation.kind}`);
      notes.push(`${operation.kind} は明示ブロックAPIへルーティングされます`);
    } else if (routed.tier === "bridge_requires_approval") {
      tiers.push(`approval_queue:${routed.op.kind}`);
      notes.push(
        `${routed.op.kind} は実行せず承認キュー候補として受理されます`,
      );
    } else {
      tiers.push(`forbidden:${routed.reasonCode}`);
      notes.push(`${routed.reasonCode}`);
    }
  }

  return {
    taskId: descriptor.taskId,
    title: descriptor.title,
    tierLabels: tiers,
    notes,
    requiresUserApproval: true,
  };
}
