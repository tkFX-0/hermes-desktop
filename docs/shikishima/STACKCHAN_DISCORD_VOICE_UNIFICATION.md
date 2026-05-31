# StackChan 実発話 × Discord 連携 — 統合方針

Date: 2026-05-30  
調査: つむぎ / 記録: しるべ

StackChan 専用 Skill（GitHub 調査取り込み）: `skills/shikishima-stackchan-specialist/SKILL.md` — 証跡 [STACKCHAN_GITHUB_SKILL_INTAKE_2026-05-31.md](./STACKCHAN_GITHUB_SKILL_INTAKE_2026-05-31.md)。Codex 3 事象修正依頼: [CODEX_STACKCHAN_DISCORD_VOICE_FIX_REQUEST_2026-05-31.md](./CODEX_STACKCHAN_DISCORD_VOICE_FIX_REQUEST_2026-05-31.md)。

## 経路一覧

| ID | 経路 | 実装 | Bot 配線 | 用途 |
|----|------|------|----------|------|
| L1 | Legacy VOICEVOX | [stackchan-discord-voice.mjs](../../scripts/lib/stackchan-discord-voice.mjs) → [shikishima-stackchan.mjs](../../scripts/shikishima-stackchan.mjs) | **あり** | Discord 返信の全文読み上げ |
| L2 | Guarded bridge | [discord-secretary-voice-bridge.ts](../../src/main/shikishima-full-autonomy/discord-secretary-voice-bridge.ts) | **なし** | allowlist・time window・pilot |
| L3 | Production speak | [stackchan-voice-production-speak.ts](../../src/main/stackchan-voice-route/stackchan-voice-production-speak.ts) | pilot のみ | 憲法 GO |

## env 単一参照

[stackchan-voice-config.mjs](../../scripts/lib/stackchan-voice-config.mjs)

| env | 既定 | 効果 |
|-----|------|------|
| `SHIKISHIMA_STACKCHAN_HOLD` | 0 | 1 で **全発話スキップ** |
| `STACKCHAN_DISCORD_VOICE` | ON | 0 で L1 OFF |
| `SHIKISHIMA_DISCORD_VOICE_BRIDGE` | OFF | 1 で L2 計画のみ（Bot 未配線） |

状態行: `formatStackchanDiscordVoiceStatusLine()`

## 機能動作（受け入れ基準）

- [x] ユーザー「テキストのみ」→ `user_declined_voice`
- [x] HOLD=1 → `bridge_disabled` / stackchanSay skipped
- [x] 長文 → chunk 分割（**96字** `VOICE_CHUNK_CHARS`）、テキスト欠落なし
- [x] 同一 poll / **poll 跨ぎ** 複数返信 → `discord-voice-playback-queue.mjs` + `stackchanSayPreparedBatchItems`（`global batch` / `ordered i/N`）
- [x] 全文読み上げ — `prepareDiscordVoiceSpeech`（**80字 limitSpeech なし**・旧 `prepareSecretarySpeech` 混用を解消）
- [x] digest 中 operator notify → defer（`SHIKISHIMA_OPERATOR_NOTIFY_DEFER_DURING_DISCORD` 既定 ON）
- [x] 読み上げ中 `!sc` モーション → `voice_busy`（PCM 切断防止）
- [ ] 人間: 聴感 PASS テスト 2・3（3 通連続順序 · 読み上げ中 nod）— 短文は PASS 報告済み

## 段階統合（SC-014c = H）

1. **現状維持**: L1 + env 整理（本リリース）
2. **将来**: 司令部のみ L2 試験（feature flag + しずめ GO）
3. **非目標**: L1 と L2 の二重発話

## チェックリスト（つむぎ）

1. PCM cap と chunk **96** — [stackchan-discord-voice.mjs](../../scripts/lib/stackchan-discord-voice.mjs) `VOICE_CHUNK_CHARS` · [shikishima-stackchan.mjs](../../scripts/shikishima-stackchan.mjs) `stackchanSayPreparedBatchItems`
2. `midNodTimer` 削除済み — SC-001 done
3. Secretary filter と全文読み上げ — `prepareSecretarySpeech` max 220/chunk
4. Bot 起動ログ — `formatStackchanDiscordVoiceStatusLine` 追記推奨
