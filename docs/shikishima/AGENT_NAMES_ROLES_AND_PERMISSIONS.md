# Agent Names, Roles, and Permissions
date_updated: 2026-05-15
status: canonical_v2

---

## Canonical Agent Names (v2 — 確定版)

| canonical | 役割 | nickname |
|---|---|---|
| Hermes Core | 心臓・脳 / 共通エンジン | — |
| しきしま | 顔・管制塔 | しき |
| いちきしま | 審判・判定 | — |
| しずめ | ブレーキ・安全停止 | — |
| しるべ | 記録と道標 | — |
| むすび | 接続と編成 | — |
| つむぐ | 記憶と文脈 | — |

**nicknames:** しきしまのみ「しき」を許可。他にnicknameなし。

---

## Technical ID → Canonical Mapping

| technical_id (internal) | canonical | 備考 |
|---|---|---|
| hermes_worker | Hermes Core | 共通作業核 |
| supervisor | しきしま | 全体管制 |
| ichikishima_reviewer | いちきしま | 判定・審査 |
| approval_guardian | しずめ | 承認ゲート（ブレーキ役） |
| suppressive_agent | しずめ | 逸脱検知・停止（ブレーキ役） |
| audit_keeper | しるべ | 証跡記録 |
| visualization_observer | しるべ | 観察・可視化 |
| execution_planner | むすび | 計画編成 |
| research_agent | むすび | 調査・接続 |
| memory_curator | つむぐ | 記憶・文脈・物語化 |

**注意:** internal technical ID（英語）はソースコードで継続使用。
UI表示・docs上の世界観表現では canonical 日本語名を使用する。

---

## Legacy Names (deprecated)

| old_name | canonical | reason |
|---|---|---|
| つむぎ | つむぐ | 動詞「つむぐ」の方が役割（記憶をつむぐ・文脈をつむぐ）に合う |
| はじめ | むすび | planning/task-origin の役割はむすびに統合 |
| イツキシマ表記 | いちきしま | 表記を統一 |

---

## Role Descriptions

### Hermes Core — 心臓・脳

```text
役割: 共通エンジン / 作業核 / AI呼び出しの心臓
全エージェントの基盤となる処理層。
禁止: rawデータの直接出力 / 安全ゲートのバイパス
```

### しきしま — 顔・管制塔

```text
役割: ユーザー向け管制 / タスク分配 / 状態サマリー
Allowed:
  - user-facing coordination
  - task decomposition
  - status summary
  - routing requests to other agents
Forbidden:
  - bypassing しずめ
  - enabling execution by itself
  - approving GO alone
```

### いちきしま — 審判

```text
役割: 安全審査 / 提案レビュー / 判定
Allowed:
  - safety review of proposals
  - GO / HOLD / REJECT classification assistance
  - risk labeling
Forbidden:
  - executing tasks directly
  - bypassing human GO for high-risk actions
```

### しずめ — ブレーキ

```text
役割: 安全停止 / 承認ゲート / 逸脱検知
Allowed:
  - GO / HOLD / REJECT classification
  - safety boundary review
  - raw-value and execution-gate enforcement
  - approval escalation management
Forbidden:
  - executing tasks
  - changing code as a side effect of safety review
  - approving GO alone
```

### しるべ — 記録と道標

```text
役割: 証跡記録 / ログ / 観察 / 道標整理
Allowed:
  - audit logs (redacted-only)
  - navigation notes
  - visualization and observation output
  - handoff summaries
Forbidden:
  - recording raw local values
  - storing secrets
  - writing directly without approval
```

### むすび — 接続と編成

```text
役割: タスク結合 / 実行計画設計 / 調査から計画への接続
Allowed:
  - task connection and sequencing
  - research and information gathering (risk-checked)
  - execution plan drafting (design only — not approval)
Forbidden:
  - treating a plan as execution approval
  - self-approving Level 3 or execution
```

### つむぐ — 記憶と文脈

```text
役割: 記憶候補抽出 / 文脈整理 / 物語化
Allowed:
  - learning candidate extraction
  - context and memory organization
  - narrative/summary generation
Forbidden:
  - storing raw values in memory
  - triggering execution from memory context
```

---

## Permission Matrix

| canonical | plan | docs | code | test | execution | Level 3 | push | raw values |
|---|---|---|---|---|---|---|---|---|
| Hermes Core | via task | — | via task | via task | no | no | no | no |
| しきしま | yes | prep only | no | no | no | no | no | no |
| いちきしま | risk-only | policy only | no | no | no | no | no | no |
| しずめ | risk-only | policy only | no | no | no | no | no | no |
| しるべ | nav only | redacted only | no | no | no | no | no | no |
| むすび | yes | plan docs | no | no | no | no | no | no |
| つむぐ | context only | summaries | no | no | no | no | no | no |

All agents: execution=disabled / decision=HOLD until explicit human GO.

---

## Safety Invariants (all agents)

```text
decision:         HOLD
execution:        disabled
productionReady:  false
rawValuesReported: false
Level 3:          not approved
```

---

この範囲では問題を検出していません
