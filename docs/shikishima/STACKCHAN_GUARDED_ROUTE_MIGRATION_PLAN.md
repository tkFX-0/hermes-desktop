# StackChan Guarded Route 移行計画（SC-013）

Date: 2026-05-30  
Status: **mitigated**（Phase 1 部分配線済 · Bot 本番 facade 統一は deferred）

### Phase 1 実装済み（2026-05-31 · SC-013 mitigated）

| 項目 | パス | 状態 |
|------|------|------|
| Discord 読み上げ FIFO（poll 跨ぎ） | `scripts/lib/discord-voice-playback-queue.mjs` | done |
| 読み上げ判定・チャンク | `scripts/lib/stackchan-discord-voice.mjs` | done |
| digest 中 operator notify defer | `scripts/lib/stackchan-operator-notify.mjs` | done |
| env 単一参照 | `scripts/lib/stackchan-voice-config.mjs` | done |
| TS guarded voice pilot | `sendStackChanVoiceOnce` | pilot のみ |

**未完了（deferred）**: Bot/Electron が unguarded `stackchanFaceLocal` / `stackchanSayLocal` を呼ばないよう guarded facade へ全面統一（段階 2–4）。

## 現状

| 経路 | 用途 |
|------|------|
| `scripts/shikishima-stackchan.mjs` | SideBot 本番（voice/face/motion） |
| `sendStackChanVoiceOnce` / Display / Motion | pilot・Phase 7 bridge |

## 目標

Bot / Electron が **unguarded** `stackchanFaceLocal` / `stackchanSayLocal` を呼ばず、guarded facade 経由に統一。

## 段階

1. 影響調査: `shikishima-bot.mjs` / `index.ts` の StackChan 呼び出し一覧
2. `stackchanSay` は当面 legacy 維持（pilot 実績）— guarded voice は新規経路のみ
3. Display: `fireSecretaryEvent` → `sendStackChanDisplayOnce` ラッパー
4. 憲法 GO: `stackchan_voice` scope 必須

## 非目標

- firmware flash
- STT 常時 ON
- 無人 voice ループ
