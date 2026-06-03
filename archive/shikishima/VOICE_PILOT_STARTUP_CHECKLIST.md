# Voice Pilot Startup Checklist

Date: 2026-05-26  
Status: OPERATOR (read before next 許可GO send)

---

## Hermes 起動は必要か？

```text
音声合成そのもの: 不要（VOICEVOX localhost + StackChan WS 直送）
Discord / STT / 起動挨拶: Hermes Desktop + SideBot 経路（現状 SideBot は HOLD）
Electron UI の stackchan-say IPC: 実行せず（NEEDS_HUMAN ドラフトのみ）
```

**結論**: まず **StackChan に WS で届くこと** を直す。Hermes 起動だけでは音は流れない。

---

## 起動順（推奨）

| Step | 作業 | 合格目安 |
|------|------|----------|
| 1 | VOICEVOX 起動 | `localhost:50021` 応答 |
| 2 | StackChan 電源 ON・同一 LAN | ping/画面オン |
| 3 | `.env.local` の `STACKCHAN_HOST`（または IP）が実機と一致 | redacted |
| 4 | 接続確認（下記コマンド） | `connected: true` |
| 5 | 許可GO + one-shot 送信 | 人間可聴 |

---

## 接続確認（送信なし）

```powershell
cd hermes-desktop
npx tsx -e "import { bootstrapStackChanEnvFromLocalFile } from './src/main/stackchan-voice-route/stackchan-env-bootstrap.ts'; import { checkStackchanLocalStatus } from './src/main/stackchan-local-service.ts'; bootstrapStackChanEnvFromLocalFile(); checkStackchanLocalStatus().then(s => console.log(JSON.stringify({ connected: s.connected, voicevoxReady: s.voicevoxReady, stackchanIp: s.stackchanIp })))"
```

2026-05-26 実測例: `connected: false`, `voicevoxReady: true` → **送信しても本体スピーカーには流れない状態**

---

## Hermes Desktop を起動する場合

```powershell
npm run dev
```

注意:

```text
SHIKISHIMA_SHADOW_MODE = true  → StackChan STT/イベントサーバは起動しない
SIDEBOT_HOLD = true            → shikishima-bot.mjs は自動起動しない
```

本番と同じ Discord 発話を試す場合は **別ターミナル**で:

```powershell
node scripts/shikishima-bot.mjs
# または
node scripts/shikishima-voice-pilot-once.mjs "よろしく。"
```

---

## ファームウェア

`pcmBuf.clear()` on speaking は `docs/firmware/shikishima_cores3` に反映済み。**実機フラッシュ**しないと FW 修正は効かない。

---

## Safety

```text
connected: false のときは one-shot 送信しない（無駄 + 誤判定）
人間可聴でのみ phase1 PASS
```
