# Agent Directory Dashboard
date_updated: 2026-05-15
status: canonical_v2

---

## Purpose

The Agent Directory dashboard lists しきしま canonical agent roles and current
permission boundaries using safe display-only fields.

---

## Canonical Agent Structure

```text
Hermes Core (心臓・脳)
  └─ 全エージェントの共通エンジン

しきしま (顔・管制塔)    ← supervisor
いちきしま (審判)         ← ichikishima_reviewer
しずめ (ブレーキ)         ← approval_guardian + suppressive_agent
しるべ (記録と道標)       ← audit_keeper + visualization_observer
むすび (接続と編成)       ← execution_planner + research_agent
つむぐ (記憶と文脈)       ← memory_curator
```

---

## Agent Rows (Canonical View)

| canonical | role | status | can execute | approval required | notes |
|---|---|---|---|---|---|
| Hermes Core | 共通エンジン | HOLD | no | yes | all agents built on this |
| しきしま / しき | orchestrator / 管制塔 | HOLD | no | yes for execution-related | organizes and summarizes |
| いちきしま | 判定・審査 | HOLD | no | yes for high-risk review | reviews proposals |
| しずめ | safety gate / ブレーキ | HOLD | no | yes for high-risk GO | blocks, classifies, escalates |
| しるべ | records / 道標 | HOLD | no | yes for direct write | redacted-only logging |
| むすび | 接続・編成 | HOLD | no | yes before implementation | connects tasks and research |
| つむぐ | 記憶・文脈 | HOLD | no | yes for memory write | extracts learning candidates |

---

## Technical ID Cross-Reference

| technical_id | canonical | description |
|---|---|---|
| hermes_worker | Hermes Core | shared work engine |
| supervisor | しきしま | main orchestrator |
| ichikishima_reviewer | いちきしま | safety reviewer |
| approval_guardian | しずめ | approval gate |
| suppressive_agent | しずめ | suppression / emergency stop |
| audit_keeper | しるべ | audit log keeper |
| visualization_observer | しるべ | visualization observer |
| execution_planner | むすび | execution plan designer |
| research_agent | むすび | research and connection |
| memory_curator | つむぐ | memory context curator |

---

## Legacy Name Index

| old_name | canonical | status |
|---|---|---|
| つむぎ | つむぐ | deprecated |
| はじめ | むすび | deprecated |
| イツキシマ表記 | いちきしま | deprecated |

---

## Safe Display Rules

- Show canonical names in UI and docs.
- Keep technical IDs in source code.
- Do not display raw values or local-only configuration.
- Do not add execution actions.

---

この範囲では問題を検出していません
