# Shikishima Autonomous Self-Run Operations

# しきしま完全自律 — Cursor 自走運用設計書

Date: 2026-05-28  
Audience: Cursor Composer / Claude agents / Human oversight  
Purpose: **実装前に固定する** — 設計書から完全完成まで自走する手順・停止条件・環境

---

## 0. この文書の位置づけ

| 文書 | 役割 |
|------|------|
| `SHIKISHIMA_FULL_AUTONOMOUS_OPERATION_DESIGN.md` | **何を作るか**（最終ゴール・アーキテクチャ） |
| **本書** | **どう自走するか**（Cursor が止まらず／止まるべき所まで進める） |
| `FULL_AUTONOMY_GOAL_DEFINITION.md` | `/goal` の書き方・完了定義テンプレ |
| `AUTONOMY_GOAL_LEDGER.md` | 進捗の単一ソース |

```text
StackChan単体自律 ✗
しきしま司令塔 + StackChan身体 + しずめ安全 ✓
```

---

## 1. 自走の定義（Cursor 内）

「完全自律フローまで自走」とは、**ゴール単位**で完走すること（設計書のセクション完走ではない）。

```text
1. 設計書・/goalmacro を読む
2. FULL_AUTONOMY_GOAL_REGISTRY.md にゴールを登録する
3. サブゴールを Done Criteria まで実行（docs → types → tests → impl → evidence）
4. 親ゴールは子がすべて COMPLETED のときのみ COMPLETED
5. typecheck / test を実行し、結果を正直に記録する
6. 人間目視・高リスクは HOLD/STOP（§7）
7. 次ゴールへ（Phase 飛ばし禁止）
```

**禁止:** 「§3 まで書いたので親ゴール COMPLETED」— **子ゴールと evidence が足りない場合は IN_PROGRESS のまま**。

**自走してはいけないこと（常時禁止）**

```text
- しずめ HOLD の上書き
- productionReady: true / execution: enabled
- raw SSID/IP/token/device/private URL の evidence 記録
- 失敗後の自動 retry loop（device / voice / motion / Discord）
- git push（明示 GO なし）
- 人間目視が必要なのに PASS と記録する
- Display-only 100% と Full Autonomy の混同
```

---

## 2. Human GO ポリシー（2026-05-28 以降）

| 範囲 | ポリシー |
|------|----------|
| `/goal` 定義まで | **全 GO** — 個別許可不要 |
| Level 4 ローカル作業 | docs / types / tests / typecheck / evidence — 自走可 |
| Level 5 外部効果 one-shot | **別 macro + 時間窓 GO** 必須 |
| 人間目視 | 観測結果が来るまで **STOP または HOLD** |
| git push | **明示 push GO** のみ |

---

## 3. ゴールライフサイクル（状態機械）

```text
                    ┌─────────────┐
    設計書受領 ────►│ GO_DEFINED  │
                    └──────┬──────┘
                           │ plan rallies
                           ▼
                    ┌─────────────┐
              ┌────►│ IN_PROGRESS │◄────┐
              │     └──────┬──────┘     │
              │            │ step       │ next rally
              │            ▼            │
              │     ┌─────────────┐    │
              │     │  VERIFYING  │────┘
              │     └──────┬──────┘
              │            │
       HOLD/STOP          │ pass
              │            ▼
              │     ┌─────────────┐
              └─────│  COMPLETED  │
                    └─────────────┘
```

### 3.1 GO_DEFINED

- `FULL_AUTONOMY_GOAL_DEFINITION.md` に従い `/goal` ブロックを書く
- `AUTONOMY_GOAL_LEDGER.md` の Active Goal を更新
- 触るファイル範囲・禁止領域を列挙

### 3.2 IN_PROGRESS

- 1 Rally = 1 つの外部効果クラスまで
- 実装順: **spec/boundary → types → tests → minimal code → evidence**
- コミット: ユーザーが push GO を出すまで **ローカル commit は macro 内で明示されたときのみ**

### 3.3 VERIFYING

```powershell
npm run typecheck:web
npm run typecheck:node
npm test
```

Pilot 系 env をクリアしてから full test:

```powershell
Remove-Item Env:STACKCHAN_DISPLAY_PILOT_SEND,Env:STACKCHAN_MOTION_PILOT_SEND,Env:STACKCHAN_VOICE_PILOT_SEND -ErrorAction SilentlyContinue
```

### 3.4 HOLD / STOP

| 判定 | 意味 | Cursor の行動 |
|------|------|----------------|
| **HOLD** | 環境・GO・目視待ち | evidence 更新、次マクロ案を提示、**送信しない** |
| **STOP** | 安全違反・曖昧・raw 漏洩危険 | 作業中断、理由列挙、人間へ |

### 3.5 COMPLETED

- 完了定義チェックリスト全て true
- 日本語変更レポート（しきしま必須フォーマット）
- `IMPLEMENTATION_HANDOFF.md` 更新（該当範囲のみ）

---

## 4. Rally テンプレート（自走用）

各 Rally は以下を **必ず** 持つ。

```markdown
## Rally ID
shikishima.<phase>.<name>

## Autonomy Level
0–8（FULL_AUTONOMY_LEVEL_MATRIX 参照）

## Allowed
- （ファイルパス glob）
- （コマンド）

## Forbidden
- （明示）

## Entry criteria
- （前提）

## Done criteria
- [ ] evidence ファイル
- [ ] tests pass
- [ ] ledger 更新
- [ ] safety flags 不変

## STOP if
- （列挙）
```

---

## 5. 出力先ルーティング（Unified Output の種）

同じ「状態」を出すとき、自走中は **次の優先** で書き分ける。

| 状態 | StackChan | Discord | Electron | Evidence |
|------|-----------|---------|----------|----------|
| NEEDS_HUMAN | 短い声/表情案 | draft のみ | 詳細パネル | 完全 |
| HOLD | hold 表情 | なし | HOLD 理由 | 完全 |
| PASS step | 任意（GO 時） | 任意 | サマリー | 完全 |
| STOP | panic_stop 相当 | なし | STOP | 完全 |

**自走フェーズ（Level 2–4）では StackChan 実送信は通常しない。**

---

## 6. ファイルシステム規約（Cursor 作業範囲）

### 6.1 自律作業で常に触ってよい

```text
docs/shikishima/**
docs/ichikishima/**（handoff 更新時）
src/shared/stackchan-*（新規 route / preview）
src/main/stackchan-*-route/**
src/main/ichikishima/autonomy-zone/**
tests/hermes/zone/**
tests/ichikishima/**
```

### 6.2 明示 GO なしで触らない

```text
src/main/stackchan-local-service.ts（既存 unguarded 経路）
src/renderer/**（UI）
src/main/index.ts / preload（IPC）
.env*
EA / MT5
git push
```

### 6.3 evidence 命名

```text
docs/shikishima/<TOPIC>_EVIDENCE.md
docs/shikishima/<TOPIC>_GO_DRAFT.md
docs/shikishima/<TOPIC>_READINESS_CHECK_EVIDENCE.md
```

---

## 7. 人間目視・実機・VOICEVOX ゲート

以下は **自動 PASS 禁止**。Operator がテンプレを返すまで HOLD。

| ゲート | テンプレ返却フィールド |
|--------|------------------------|
| Display 目視 | `displayed_state_visible`, `expected_state_matched` |
| Motion 目視 | `motion_human_visual`, `motion_visible`, `expected_motion_matched` |
| Voice 目視 | `voice_audible`, `expected_phrase_matched` |
| Discord 目視 | `message_content_approved` |

Cursor は **「目視環境整ってます GO」** を、目視 PASS の代わりに使わない（Display Attempt 4 教訓: 短い GO は送信 GO と目視 GO を分けて記録）。

---

## 8. Phase 1 直近キュー（自走開始点）

`FULL_AUTONOMY_ROADMAP.md` Phase 1 に従う。**設計パッケージ完了後** の順序:

| Order | Macro | Level | 自走可 |
|------:|-------|-------|--------|
| 1 | `shikishima.voicevox-readiness-evidence-commit` | 4 | docs commit |
| 2 | `shikishima.stackchan-voice-one-shot-pilot-retry` | 5 | 時間窓 GO + 1 send |
| 3 | `shikishima.stackchan-voice-pilot-acceptance` | 5 | 目視後 |

**今回の unified design package は Order 0 — docs only。**

---

## 9. 環境チェックリスト（自走開始前）

Cursor は新セッション開始時に以下を確認し、1 行で記録する。

```text
[ ] origin/main rev-parse
[ ] AUTONOMY_GOAL_LEDGER active_goal
[ ] productionReady false / execution disabled（docs 不変）
[ ] pilot env vars 未設定
[ ] Display-only ACCEPTED @ fb86fee 混同なし
[ ] 未コミット VOICEVOX readiness docs の有無
```

---

## 10. 完了レポート（毎 Rally 必須）

`AGENTS.md` / `ichikishima-report` 準拠の日本語レポート + 次マクロ 1 件。

必須フレーズ: **「この範囲では問題を検出していません」**  
禁止: **「問題ありません」**

---

## 11. 関連マクロ（登録済み）

```text
/goalmacro shikishima.full-autonomy-unified-design-package  → DONE（本パッケージ）
/goalmacro shikishima.stackchan-voicevox-readiness-check    → PASS（local evidence）
/goalmacro shikishima.stackchan-voice-one-shot-pilot-retry    → 次（時間窓 GO）
```

---

## 12. 最終判断

```text
自走の主語: Cursor + しきしま docs/型/テスト
安全の主語: しずめ（仕様） + Human（高リスク・目視）
身体: StackChan（guarded routes のみ）
次に読む: FULL_AUTONOMY_GOAL_DEFINITION.md → FULL_AUTONOMY_ROADMAP.md Phase 1
```
