# Agent Team Foundation — SPEC（dry-run only）

**正**: `src/main/ichikishima/agent-team/`。**実行・常駐・scheduler tick 無し**。

---

## 1. 原則

| フラグ | 値 |
|--------|-----|
| `schedulerEnabled` | **常時 false**（コード定数） |
| agent `enabled` registry | **常時 false** |
| `autoRun` / `autoApprove`（snapshot） | **常時 false** |
| dryRunOnly | **true** |

---

## 2. 禁止 Capability（名前空間から排除）

execute_shell / run_wsl / run_hermes / git_push / raw_network — **capability 文字列にも載せない**。

---

## 3. モジュール

| TS | 役割 |
|----|------|
| `agent-registry.ts` | ID 一覧 |
| `agent-capability-matrix.ts` | 読取 stub 語彙のみ |
| `agent-task-queue.ts` | ephemeral stub ID |
| `agent-message-contract.ts` | envelope 形状 stub |
| `agent-scheduler-contract.ts` | 常時 disabled |
| `agent-handoff.ts` | empty ledger stub |
| `agent-escalation.ts` | blocked stub |
| `agent-supervisor.ts` | 集約 Snapshot |

---

## 4. pending

自律 tick／外部 LLM メッシュ／キュー実行はすべて **別承認**。この SPEC だけでは進めない。

関連: `AGENT_SCHEDULER_CONTRACT.md`（論理契約文言）、`AGENT_TEAM_ARCHITECTURE.md`
