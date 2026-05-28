# StackChan 実機GO — 2026-05-28

## 前提（運用者）

- PC: 有線 LAN
- StackChan: Wi‑Fi
- 同一ルーター配下で問題なし（「同じ Wi‑Fi」必須ではない）

## 原因（接続できなかった理由）

```text
TypeScript の stackchan-local-service.ts が import 時点の process.env のみ参照し、
.env.local の STACKCHAN_HOST を読んでいなかった → 127.0.0.1 へ WS 接続 → connected: false

Codex 時代の shikishima-stackchan.mjs は .env.local を直接読むため動いていた。
```

## 修正

- `stackchan-local-service.ts` → `resolveStackChanHost()` / `resolveStackChanToken()` 使用
- 接続確認: `npx tsx scripts/stackchan-connection-check.mjs`（IP は出力しない）

## 接続確認（修正後・redacted）

```json
connected: true
voicevoxReady: true
tcpPort8080: true
hostLooksLocalhost: false
hostLooksPrivateLan: true
```

## 実機送信（許可GO）

- コマンド: `node scripts/shikishima-voice-pilot-once.mjs "よろしく。実機GOのテストです。"`
- transport: `ok: true`（送信完了）
- **人間可聴判定: 初回 `silent` → 更新後送信で PASS（2回再生あり、PASS）**

## silent 後の追加確認

```text
tokenPresent: true
authProbe: accepted_or_no_error
VOICEVOX synthesized audio: non-silent / strong peak
```

## silent 後の修正

- PC側: WebSocket の device error frame を読むようにした。
  - `auth_required`
  - `audio_blocked`
  - `pcm_too_large`
- PC側: pilot の VOICEVOX 音量 floor を `1.6` にした。
- Firmware側（要フラッシュ）:
  - `audio_test` tone
  - `audio.state` (`armed` / `queued` / `play_start` / `play_done`)

## 次の判断

```text
次の音声再送は、新しい「許可GO」があるときだけ。
再送しても silent なら、ファームを実機へフラッシュして audio_test → PCM voice の順で切り分ける。
```

## Safety

```text
productionReady: false
execution: disabled
rawValuesReported: false
```
