# Hermes Desktop / しきしま — 永久記憶（運用者向け）

最終更新: 2026-05-31

## 運用者プロフィール

- ユーザーは **バイブコーダー**（コーディングは主に AI に任せる）
- 実機作業は **電源・Wi‑Fi・許可GO・耳での判定・チャット報告** が中心
- 詳細手順: `docs/shikishima/STACKCHAN_REAL_DEVICE_GO_OPERATOR_GUIDE.md`

## StackChan 実機GO（要約）

| 段階 | 誰 | 内容 |
|------|-----|------|
| 準備 | 人間 | VOICEVOX 起動、StackChan 電源、同じ家の LAN（有線 PC + Wi‑Fi StackChan 可） |
| 設定 | AI | `.env.local` の `STACKCHAN_HOST` が実機 IP と一致（値はチャットに出さない） |
| 確認 | AI | 接続チェックのみ → **`connected: true` になるまで送信しない** |
| 送信 | 人間+AI | チャットで **「許可GO」** → voice one-shot **1回だけ** |
| 判定 | 人間 | `audible_clear` / `still_faint` / `silent` を報告。**送れた≠合格** |

## 有線 PC + Wi‑Fi StackChan（2026-05-28）

- **同じ Wi‑Fi である必要はない**。同じルーターの LAN（有線↔Wi‑Fi）なら通常つながる
- 2026-05-28: `connected: false` の主因は **TypeScript 側が `.env.local` の IP を読めず 127.0.0.1 固定**だった（Codex 用 `.mjs` は直接読んでいた）。`stackchan-local-service.ts` を `resolveStackChanHost()` に修正後 `connected: true`

## 24h サイクル（2026-05-31）

- **夜の整理モード**（`evening`）: **JST 03:00–07:00**（`scripts/shikishima-goals.mjs`）。21–24 時は `night`
- ポーリング: `night` / `evening` は 60 秒、他は 10 秒

## 人間GO完遂（2026-05-31）

- **StackChan 実機 2・3**: PASS（人間判断 · CODEX doc 更新済み）
- **Obsidian 実書き**: 許可実行済み
  - vault 相対: `しきしま/inbox/2026-05-31-人間GO後次ステップ-2026-05-31.md`
  - vault 相対: `しきしま/Daily/2026-05-31.md`（追記）
  - 証跡庫: `30_Evidence/2026-05-31-14-46-31_next-go-verify.md`（shikishima-library）
- **進捗**: 77% · INVENTORY **75%**（SC 12/14）· readiness 56% · openGaps=0
- **preflight / resume**: `stackchan-resume --restart-bot`（HOLD=0 · SideBot 再起動）
- **Obsidian 続き**: プレイブック inbox ミラー · dev-status-briefing OK
- **次**: [POST_HUMAN_GO_NEXT_STEPS_2026-05-31.md](../docs/shikishima/POST_HUMAN_GO_NEXT_STEPS_2026-05-31.md) — 日次ルーティン · execution=enabled は別 GO · W6 deferred

## 完全自律ロードマップ A1–B3（2026-05-31）

- **進捗**: autonomy-status **76%→77%**（INVENTORY 70%→73% · SC-013 mitigated）· openGaps=0 · GO_PREPARED
- **A1**: SC-013 `mitigated` — `discord-voice-playback-queue` · guarded route Phase1
- **A2**: SHI-010 — `agent login` 人間作業 · WSL dev 可
- **A3**: gap-tasks 5/5 OK
- **A4**: agent_team / orchestrator capped 稼働中（PLAYBOOK 追記）
- **B1**: vitest 31/31 · 実機 2・3 は **要確認**
- **B2**: obsidian dry-run のみ（`wouldWrite=true` だがスクリプトは audit のみ · 実書きなし）
- **B3**: `SHIKISHIMA_WORKFLOW_HANDOFF_DISABLE=1` · `!workflow enqueue` 必要時のみ
- Doc: `AUTONOMY_55_TO_100_CURSOR_PLAYBOOK_2026-05-31.md` · `DESIGN_INVENTORY_2026-05-30.md`

## StackChan voice（2026-05-31 本線）

- Discord L1: chunk **96** · **global voice queue**（poll 跨ぎ FIFO）· `prepareDiscordVoiceSpeech`（80字切り廃止）· digest 中 notify defer
- 実機: 司令部 **1 通短文 + 3 通連続 + 読み上げ中 `!sc nod` すべて PASS**（人間 GO 2026-05-31）
- Doc: `CODEX_STACKCHAN_DISCORD_VOICE_FIX_REQUEST_2026-05-31.md` · Skill `shikishima-stackchan-specialist`

## StackChan voice（2026-05-30 更新）

- **2026-05-30 audible_clear**: VOICEVOX 再配置後、短い発話テストで人間確認 PASS。ガガガ音は VOICEVOX 側の可能性が高い。
- **Jarvis Phase A–D (2026-05-31)**: `JARVIS_PHASE_A_D_ROADMAP_2026-05-31.md` — G/H、Hermes backend なし、品質ゲート（reasoning-v1・subscription_only・vitest）。Phase A `dev-status-briefing.ts`。StackChan 発話は帰宅目視 G まで H。
- **人間 GO 順次タスク (2026-05-31)**: `shikishima-run-ordered-tasks.mjs` 完了。discord.read 10件・obsidian dry-run・agent-team local-only（課金なし）・StackChan resume。`node scripts/shikishima-run-ordered-tasks.mjs` で再実行可。
- **人間 GO (2026-05-31)**: `phase-go ack` agent_team_tick / autonomous_orchestrator。`decision=HOLD` 不変。
- **StackChan HOLD (2026-05-30 夜)**: `SHIKISHIMA_STACKCHAN_HOLD=1` — 発話・Discord VOICEVOX OFF。再開は `docs/shikishima/STACKCHAN_HOLD_2026-05-30.md`。
- **Chisiki 調査 (2026-05-30)**: R0 完了。平易 brief + gasvault 採用 **当面 A のみ**（オンチェーン・CKT 本番は H）。質問票 `HUMAN_GO_QUESTIONNAIRE_2026-05-30.md`。
- **完全自律マスタ設計 (2026-05-31)**: `FULL_AUTONOMY_MASTER_DESIGN_2026-05-31.md` — 目標定義・W1–W6・human GO 行列。再起動後 **55%**（CLI）。human 段は `!workflow done` のみ done（tick 自動完了禁止）。`POST_RESTART_CHECKLIST_2026-05-31.md`。
- **55→100 Cursor プレイブック (2026-05-31)**: `AUTONOMY_55_TO_100_CURSOR_PLAYBOOK_2026-05-31.md` — 55%の意味・Cursor/Discord/WSL 分担・M-07・runKaihatuDev 失敗原因。Obsidian: `node scripts/shikishima-autonomy-playbook-obsidian.mjs`。`!autonomy` に dev-pipeline 停止ヒント追加。
- **SC-014 統合 (2026-05-30)**: `stackchan-voice-config.mjs` + `STACKCHAN_DISCORD_VOICE_UNIFICATION.md`。Waves `FULL_AUTONOMY_IMPLEMENTATION_WAVES_2026-05-30.md`。
- **意図別 StackChan 通知 (2026-05-30)**: Cursor 完了・プラン選択・判断・質問・WF・kaihatu で別発話。`STACKCHAN_OPERATOR_NOTIFY_2026-05-30.md`。質問票: Chisiki=C（実装は H）、StackChan=今すぐ。
- **Human GO 自律前進 (2026-05-31)**: `wf-mpsjl3fk` done。`shikishima-human-go-advance.mjs`。進捗 **58%**。SideBot 再起動済み。正本 `FULL_AUTONOMY_MASTER_DESIGN_2026-05-31.md`。
- **Discord→StackChan 音声 (一時停止)**: 実装済み（PCM cap・グローバルキュー）だが HOLD 中は使わない。
- **Cursor 変更許可 (2026-05-30)**: StackChan コード・診断修正は Cursor 可。FW フラッシュ・本番自動発話は別 GO。
- **Phase 1 voice pilot: PASS**（2026-05-28 時点。上記 HOLD は再検証待ち）
- `stackchan_resume` ゲート: **完了**（pilot 範囲）
- 接続: `connected: true`
- 本番自動発話・Discord 経路: **まだ HOLD**（別 GO）
- Burn-in 順序（人間判断）: **15分 smoke → 2時間**
- 現状レベル（コード評価）: **Level 6**（Limited Autonomous Exec）。Level 8（完全自律運用）は **未達**
- 解除ロードマップ: `docs/shikishima/FULL_AUTONOMY_ENABLEMENT_ROADMAP_2026-05-28.md`（Track A→D、各段階の許可GO文言）
- Track A1 15m smoke Burn-in: **PASS** (2026-05-28)
- Track B1 Discord→StackChan voice 1回: **PASS** + 人間聴取 **PASS** (`B1PASS` 2026-05-28)
- Track A2 2h Burn-in: **PASS** (2026-05-28, 120 ticks)
- FA-11 Burn-in: **PASS**
- **Level 8 宣言** (pilot scope, A4): **DONE** 2026-05-28
- Track B2 secretary bounded loop: **PASS** (2026-05-28, 3 cycles)
- Track B3 StackChan voice bounded loop: **PASS** (2026-05-28, 3 cycles)
- Track C2 Hermes shadow 1回: **PASS** (2026-05-28)
- Track C3 Hermes shadow bounded loop: **PASS** (2026-05-28)
- **PASS ledger**: `FULL_AUTONOMY_PILOT_PASS_LEDGER_2026-05-28.md`（A–C 全 PASS・人間確認バッチ）
- Track D + ops: execution/productionReady ON, **sidebotHoldReleased**, **hermesDaemonPilotEnabled**（local json）
- Status: `npx tsx scripts/shikishima-operational-status.mjs`
- **Constitutional 全てGO (2026-05-28)**: `.shikishima-memory/constitutional-go.local.json` or `SHIKISHIMA_CONSTITUTIONAL_ALL_GO=1`. `CONSTITUTIONAL_GO_ALL_2026-05-28.md`, `shikishima-constitutional-go-activate.mjs`. E3b–E8 executors wired; git push **not** automated.
- 完全自律 Phase 2–10 コードは進んだが **Level 8 / 声の章は実機合格まで未完了**
- `FULL_AUTONOMY_STACKCHAN_DEFERRED.md` 参照

## Discord 会話・Runtime Skills (2026-05-30)

- 会話ログ確認済み4 Skills: `skills/shikishima-{code-reviewer,multi-agent,kaizen-rca,github-analyzer}`（Cursor `.agents/skills` にもコピー）
- Bot 注入: `scripts/lib/shikishima-runtime-skills.mjs`（境界文で MT5/EA スキル取り違え防止）
- スレッド記憶: `.shikishima-memory/discord-threads/`、`!部屋状況`、`rebuildPerAgentThreadsFromShared`
- 審査: `docs/shikishima/CONVERSATION_BEHAVIOR_AUDIT_2026-05-30.md`、`node scripts/shikishima-conversation-audit.mjs`
- アバター: `assets/discord-agents/*.png` → エージェント別 Webhook（`shiki-agent-*`）に PNG 設定。同期 `!avatars-sync` / `node scripts/shikishima-discord-avatars-sync.mjs`。再起動 `!tnt`（司令部）
- **実行スコープ GO (2026-05-30)**: MT5 BT + 自律開発ループ G（本番/ライブ売買/git push は H）。`!workflow enqueue` / `!execution-scope`。Doc `EXECUTION_SCOPE_GO_2026-05-30.md`
- **設計棚卸 (2026-05-30)**: `DESIGN_INVENTORY_2026-05-30.md`、SC-001 midNod、5体テスト、autonomy-gap-tasks 5/5
- **しるべ Obsidian (2026-05-30)**: Vault 既定 `Obsidian Vault`、Daily/inbox 書き込み、Cursor stop→StackChan「回答完了」。Doc `OBSIDIAN_SHIRUBE_FIX_2026-05-30.md`
- **WF 空回し修正 (2026-05-30)**: HOLD→human、GO_PREPARED のみ auto-loop、tick lock、Discord マイルストーン通知、`!workflow pause/settle`、起動時 heal。Doc `WORKFLOW_BACKLOG_FIX_2026-05-30.md`

## 不変条件（触らない）

```text
decision = HOLD
execution = disabled
productionReady = false
rawValuesReported = false
humanGoApprovalRequired = true
```

## 許可GO

- 人間が **「許可GO」** と言ったときのみ、承認された one-shot を即実行（時間窓宣言不要）
- 人間の **可聴確認** がない限り phase1 voice は PASS にしない

## 実機GO 再開ゲート（stackchan_resume）

1. `connected: true`
2. 許可GO + one-shot + 人間が `audible_clear`
3. その後 doc / マトリクスで phase1 を再開検討（自動本番化なし）

## コード入口（AI 用・運用者は実行不要）

- パイプライン: `runFullAutonomyPipeline({ stackchanDeferred: true })`
- 手順書: `STACKCHAN_REAL_DEVICE_GO_OPERATOR_GUIDE.md`

## nextRequiredHumanAction

- 通常: `human_review_go_policy_prerequisites`
- StackChan 再開時: 上記実機GO手順書のステップ 1 から
