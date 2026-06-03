# Agent Team — Scheduler 契約（**disabled 既定**）

**コード正**: `agent-scheduler-contract.ts`。

---

## 1. 不変条件

- `AGENT_TEAM_SCHEDULER_ENABLED === false`
- preload / renderer が **scheduler tick API** を公開しないこと（現在は **未定義のみ可**）。
- メインプロセスで **`setInterval` / `cron` / ワークスレッド起動による自律エージェント**を置かない（本 Goal）。

---

## 2. 解禁を検討する条件（すべて満たす別 Goal）

1. FINAL_READINESS_MATRIX で **Hermes Sandbox + Bridge Gate** が Go。  
2. Control Center IPC allowlist が監査済み。  
3. ユーザー文書による **自動 tick の目的・停止条件** が固定。  

---

## 3. STOP

「自律実行で queue を消化する」機能は **本契約のみでは許可しない**。

関連: `AGENT_TEAM_FOUNDATION_SPEC.md`
