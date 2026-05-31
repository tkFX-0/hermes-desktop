# Jarvis 型ロードマップ Phase A–D（G / H 表記）

Date: 2026-05-31  
Owner decision: **Hermes バックエンドは当面なし**（追加課金回避）  
表記: **G** = 人間 GO（実行・本番化可） / **H** = HOLD（設計・dry-run・読取のみ）

参照: `FULL_AUTONOMY_PHASE_E_ROADMAP.md`, `AGENT_BACKEND_REGISTRY_2026-05-29.md`, `STACKCHAN_HOLD_2026-05-30.md`

---

## 設計原則（品質低下への対策）

自律化を広げても、次は **常に H または cap 付き** で維持する。

| 懸念 | 対策（コード／運用） |
|------|---------------------|
| 自律開発の推論低下 | `governanceVersion: reasoning-v1` — しきしま deep→Claude、しずめ critical→Claude、quick のみ Groq 軽量 |
| ポートフォリオ品質低下 | つむぎ経路は **WSL dev pipeline** + `SHIKISHIMA_SUBSCRIPTION_ONLY`；マージ前 **vitest zone**；本番 `execution=disabled` |
| 課金膨張 | Hermes バックエンド **OFF**；`SHIKISHIMA_ALLOW_PAID_API=0`；agent-team は **local-only** 既定 |
| 金銭・安全 | FX/MT5/EA・自動売買・口座・本番 Discord 送信・憲法 execute → **Phase D まで原則 H** |
| 外部送信 | 段階的 G（読取→下書き→限定送信）；失敗時はカーソル前進のみ（バックログ返信防止） |

肩乗りハードウェア・Hermes 常駐への全面委任は **スコープ外**。

---

## エージェント自律マトリクス（目標）

| エージェント | 役割 | A | B | C | D |
|-------------|------|---|---|---|---|
| しきしま | 管制・整理 | 読取+下書き | +開発ナレーション素材 | 生活読取 | — |
| しずめ | 安全 | 常時 critical | 同左 | 送信前再判定 | 金融は **H** |
| つむぎ | 実装 | dry-run 計画 | **G** 後 capped dev tick | 同左 | EA は **H** |
| はじめ | 調査 | 読取要約 | dev pipeline 補助 | 同左 | — |
| しるべ | 記録 | governance 自動 | 同左 | Obsidian **G** 後書込 | — |
| ちはや | 市場 | 読取・HOLD 通知 | x_search **H** | 同左 | FX 執行 **H** |

「およそ全エージェント自律」= **各エージェントが cap 付き tick で役割を実行**し、危険境界だけ H。

---

## Phase A — 秘書の「口」の準備（身体は帰宅後 G）

**目的**: StackChan 発話・開発状況の **読取専用** ブリーフ。送信・執行はしない。

| 項目 | 状態 | G/H |
|------|------|-----|
| 開発状況ブリーフ（redacted） | code v1 `dev-status-briefing.ts` | 実装可（読取のみ） |
| 秘書フレーズ allowlist | E1 既存 | 発話は **H**（帰宅目視後 G） |
| StackChan 音声・Discord VOICEVOX | resume 済みコード | **H**（帰宅目視 **G**） |
| Discord 読取 | executor v1 | **G**（人間 GO 済み運用） |
| Discord 送信 | — | **H** |
| Hermes バックエンド | — | **H**（当面なし） |

帰宅後チェック（目視 **G**）:

```powershell
node scripts/shikishima-process-preflight.mjs
npx tsx scripts/shikishima-dev-status-briefing.ts
# 短い発話テスト後にのみ:
# node scripts/shikishima-stackchan-resume.mjs --restart-bot  # 既に resume 済みなら聴感のみ
```

---

## Phase B — 開発レーン自律（サブスク CLI・品質ゲート）

**目的**: つむぎ／はじめが **subscription_only** で開発補助。成果はリポ＋記録。

| 項目 | G/H |
|------|-----|
| `wsl-dev-runner`（claude / codex） | 単発タスク **G**、常時ループ **H** |
| agent-team tick | local-only **G**；`--live-api` **H**（ALLOW_PAID_API なし） |
| orchestrator 30分 maintenance | **G**（ack 済み前提） |
| vitest `tests/hermes/zone/full-autonomy` | 自律 tick 前の **必須ゲート** |
| git push | **H** |
| Hermes バックエンド | **H** |

---

## Phase C — 生活秘書（ナルエビ的・送信は段階）

**目的**: 予定・メモ・経費の **読む・提案**。書込・X 投稿は別 G。

| 項目 | G/H |
|------|-----|
| Obsidian dry-run | **G** |
| Obsidian 実書き込み | **G**（スコープ別・しずめ後） |
| Discord 限定送信（DIS-03） | **G**（憲法＋phase-go） |
| X / 外部 SNS 自動投稿 | **H** |
| 肩乗り・追加ガジェット | 不要（スコープ外） |

---

## Phase D — 金融・EA・高リスク（原則 H）

| 項目 | G/H |
|------|-----|
| MT5 / 既存 EA 変更 | **H**（保護領域） |
| Skills で EA 生成・自動売買 | **H**（別憲法・別監査が必要） |
| 口座・送金・個人情報 | **H** |
| Hermes 常駐・全ツール委任 | **H** |
| `constitutional-go-execute` / execution 有効 | **H** |

ツールと外部送信は **C までで段階 G**。金銭・安全は **D を開けない** 方針で合意。

---

## 現在の即時アクション（Composer）

1. Phase A: `dev-status-briefing` + CLI + vitest（本レスポンスで実施）
2. `IMPLEMENTATION_HANDOFF.md` / `MEMORY.md` 追記
3. StackChan 聴感: ユーザー帰宅 **G** まで **H**
4. Phase B 以降: 本 doc の G/H に従い `phase-go ack` をスコープ単位で追加

---

## コマンド早見

```powershell
npx vitest run tests/hermes/zone/full-autonomy
npx tsx scripts/shikishima-dev-status-briefing.ts
node scripts/shikishima-run-ordered-tasks.mjs   # 人間 G 後の保守セット
node scripts/shikishima-human-go-readiness.mjs
```
