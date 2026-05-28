# SHIKISHIMA FULL AUTONOMOUS OPERATION DESIGN

# しきしま完全自律運用 統一設計書

Date: 2026-05-28  
Status: **DESIGN FIXED** (docs-only baseline)

---

## 0. 結論

本設計書では、最終ゴールを `Shikishima Full Autonomous Operation` と定義する。

ここでいう「完全自律」は、StackChan が単体で勝手に動くことではない。

完全自律とは、しきしまが以下を統合して扱える状態を指す。

- 状態を観測する
- 文脈を理解する
- 次アクションを計画する
- 安全判定する
- 許可済み範囲は自律実行する
- 危険領域は Human GO を要求する
- StackChan / Discord / Electron / iPhone に適切に出力する
- すべてを証跡化する
- 失敗時に HOLD / STOP / Recovery へ戻る

StackChan は完全自律の「身体」または「家側AP」であり、しきしま本体の安全判断をバイパスしてはいけない。

### 役割の一行定義

```text
完全自律 = しきしま本体が自律判断・計画・安全判定・実行管理を担う
StackChan = しきしまの物理出力端末 / 会話端末 / 生活側AP
Discord = 外部操作面 / 遠隔指示面
Electron / iPhone = 管制・証跡・状態可視化
Human = 最終GO / 高リスク承認者
```

---

## 1. 現在地

```text
origin/main: b98d3e6

Display-only:
  status: ACCEPTED
  result: StackChan表示実運用100%

Motion:
  status: PASS
  result: one-shot motion send + human visual PASS

Voice:
  implementation: pushed
  readiness: PASS
  pilot: HOLD / retry待ち

Active Control:
  status: boundary/evaluation DONE
  actual_control: HOLD

Shikishima Core:
  safety_gate: IMPLEMENTED / expanded
  human_gate: IMPLEMENTED / expanded
  evidence/ledger: IMPLEMENTED / expanded
  external_action_guard: PARTIAL
  autonomous_execution: HOLD

Discord:
  read: conditional
  send: HOLD unless one-shot GO

Obsidian:
  local_write: HOLD

GitHub / git push:
  Human GO required

productionReady: false
execution: disabled
rawValuesReported: false
```

---

## 2. 完全自律の完成定義

`Shikishima Full Autonomous Operation` は、以下を満たした状態。

| 領域 | 完成条件 |
|------|----------|
| 状態観測 | repo / docs / queue / device / voice / Discord / local status を安全に読める |
| 文脈理解 | 今の目的、HOLD理由、次の安全な一手を説明できる |
| 計画 | Rally / Gate / Task / GO文面を自動生成できる |
| 安全判定 | しずめ系 Safety Governor が全 action を分類できる |
| 実行 | 許可済み low-risk action は自律実行できる |
| Human GO | high-risk action は必ず Human GO に戻せる |
| StackChan出力 | 表情・声・motionで状態や通知を出せる |
| Discord出力 | draft / review / one-shot send を分離して扱える |
| Electron/iPhone | Local Status Board / Safety Monitor として機能する |
| 記憶 | memory namespace を分離し、不要な記憶注入を防げる |
| 証跡 | action / decision / result / recovery を全て evidence 化できる |
| 復旧 | 失敗時に retry loop せず HOLD / STOP / manual recovery へ戻れる |
| 長時間運用 | limited burn-in を通過し、暴走・raw漏れ・無限実行がない |

---

## 3. 完全自律の主語と役割

### 3.1 しきしま

しきしまは管制塔。

```text
- ユーザー窓口
- 状態把握
- agent routing
- 最終応答生成
- GO / HOLD / STOP の文脈整理
- StackChan / Discord / UI への出力先選択
```

しきしまは便利な自動実行役ではなく、**自律運用の司令塔**。

### 3.2 しずめ

しずめは安全判定。

```text
- action risk classification
- external effect 判定
- Human GO 要否判定
- STOP condition 判定
- runaway prevention
- cooldown 管理
- raw value leak prevention
```

重要ルール: **しずめの HOLD を他 agent が上書きしてはいけない。**

### 3.3 つむぎ

つむぎは実装・Worker連携。禁止: Human GO なしの push / runtime / device execution。

### 3.4 はじめ

はじめは計画（roadmap, rally, gate, completion definition）。

### 3.5 しるべ

しるべは記録・証跡（evidence, ledger, handoff, changelog）。

### 3.6 ちはや

ちはやは市場・FX系専任。禁止: order placement, account operation, financial execution。

### 3.7 StackChan

StackChan はしきしまの身体・声・顔。単独で外部送信・git push・Discord・firmware・購入・autonomous retry をしてはいけない。

---

## 4. 統一アーキテクチャ

```text
Human → Command Surfaces (Discord, Electron, iPhone, StackChan)
  → Shikishima Orchestrator → Agent Router
  → Context / Memory Layer → Planner / Debate
  → Safety Governor → Action Router → Execution Adapter
  → Evidence / Ledger / Recovery → Output
```

詳細は `FULL_AUTONOMY_SAFETY_GOVERNOR_SPEC.md` および `SHIKISHIMA_AUTONOMOUS_SELF_RUN_OPERATIONS.md` を参照。

---

## 5–7. Autonomy Level / Phase

Level 定義: `FULL_AUTONOMY_LEVEL_MATRIX.md`  
Phase ロードマップ: `FULL_AUTONOMY_ROADMAP.md`

---

## 8. 残りRally見積もり

| Phase | 内容 | Rally目安 |
|-------|------|----------:|
| Phase 1 | Voice Completion | 3〜4 |
| Phase 2 | Unified State Snapshot | 4〜6 |
| Phase 3 | Unified Output Policy | 4〜6 |
| Phase 4 | Autonomous Proposal Engine | 5〜7 |
| Phase 5 | Controlled Local Autonomous Work | 6〜10 |
| Phase 6 | External Action Controlled Autonomy | 8〜12 |
| Phase 7 | StackChan Secretary Mode | 8〜12 |
| Phase 8 | Scheduler / Recovery | 6〜10 |
| Phase 9 | Burn-in | 5〜8 |
| Phase 10 | Final Acceptance | 3〜5 |

推定: 最短 52 / 標準 65〜75 / 堅牢 90+ Rally

現在進捗（概算）:

```text
Shikishima Full Autonomy: 25〜35%
Safety/Gate Architecture: 60〜70%
Physical StackChan I/O: 55〜65%
Agent Brain / Planning: 35〜45%
Controlled External Action: 25〜35%
Production-like Burn-in: 5〜10%
```

---

## 9. 完全自律でも最後まで守る原則

```text
productionReady true / execution enabled: 別承認
外部write / git push / Discord send / Obsidian write: 原則 Human GO
purchase / financial / firmware / mic always-on / camera: Human GO
raw値記録禁止 / retry loop禁止 / daemon化別承認 / STOP常に優先
```

完全自律 = 許可範囲では自分で動く。危険範囲では止まる。必要時は人間に聞く。結果を必ず残す。

---

## 10. 関連ドキュメント

```text
SHIKISHIMA_FULL_AUTONOMOUS_OPERATION_MASTER_DESIGN.md  ← 完全自律まで統合（精査用・2026-05-26）
SHIKISHIMA_AUTONOMOUS_SELF_RUN_OPERATIONS.md   ← Cursor自走運用（必読）
FULL_AUTONOMY_GOAL_DEFINITION.md               ← /goal 定義規約
FULL_AUTONOMY_LEVEL_MATRIX.md
FULL_AUTONOMY_ROADMAP.md
FULL_AUTONOMY_EXTERNAL_EFFECT_REGISTRY.md
FULL_AUTONOMY_SAFETY_GOVERNOR_SPEC.md
STACKCHAN_EMBODIMENT_INTERFACE_SPEC.md
FULL_AUTONOMY_ACCEPTANCE_MATRIX.md
```

---

## 11–13. 次アクション / マクロ / 最終判断

```text
goal: Shikishima Full Autonomous Operation
StackChan role: physical embodiment / home AP
current_nearest_blocker: Voice one-shot PASS
current_major_design_gap: unified autonomy design → FIXED by this package
safe_next_action: Phase 1 Voice Completion (separate macros)
goalmacro: shikishima.full-autonomy-unified-design-package (this commit)
```
