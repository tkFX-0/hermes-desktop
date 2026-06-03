# Codex 修正依頼 — StackChan Discord 読み上げ（3事象）

Date: 2026-05-31  
依頼元: しきしま運用（Cursor 調査済み）  
対象リポ: `hermes-desktop`  
憲法: `decision=HOLD` / `execution=disabled` — **本番 execute 解禁・git push は別 GO**

---

## 目的

Discord 返信の VOICEVOX 読み上げ（L1 legacy 経路）について、次の **3 つの残事象** を修正する。  
単発の `batch ok` は確認済みだが、**モーション干渉・順序・割り込み優先** は未解消または再発あり。

---

## 症状サマリー

| # | 症状 | ユーザー体感 |
|---|------|----------------|
| **A** | モーション動作時に読み上げが途切れる | サーボ・表情・ダンスのタイミングで PCM がプツッと切れる |
| **B** | 溜まったメッセージを順番に読めない | 1→2→3 の順ではなく、飛ぶ・最後だけ・ばらばら |
| **C** | 読み上げ中に新規受信が優先される | 途中まで読んでいた文のあとに、後から来た通知／返信が割り込む |

---

## 関連コード（正本）

| 役割 | パス |
|------|------|
| Discord 読み上げ判定・チャンク分割 | `scripts/lib/stackchan-discord-voice.mjs` |
| env（HOLD / `STACKCHAN_DISCORD_VOICE`） | `scripts/lib/stackchan-voice-config.mjs` |
| PCM / WS / グローバル発話キュー | `scripts/shikishima-stackchan.mjs` |
| Bot ポール・キュー flush | `scripts/shikishima-bot.mjs`（`poll` / `maybeEnqueueDiscordVoice`） |
| オペレーター通知発話 | `scripts/lib/stackchan-operator-notify.mjs` |
| 設計メモ | `docs/shikishima/STACKCHAN_DISCORD_VOICE_UNIFICATION.md` |
| StackChan 専用 Skill | `skills/shikishima-stackchan-specialist/SKILL.md`（`.agents/skills/` 同期） |
| Skill 取り込み証跡 | `docs/shikishima/STACKCHAN_GITHUB_SKILL_INTAKE_2026-05-31.md` |

**実装ステータス（2026-05-31）**: Codex 音声修正（`stackchanSayPreparedBatchItems`・`voice_busy` 拡張・poll バッチ）は **コード反映済み**。実機・聴感の 3 手動テストは **未実施（pending real-device test）**。StackChan GitHub Skill は同日取り込み。

---

## 既に入っている対策（Codex は上書き前に確認）

| 対策 | 内容 | 限界 |
|------|------|------|
| 単一 WS バッチ | `stackchanSayPreparedChunks` — 1 返信 = 1 接続でチャンク連続 | 返信**間**は別ジョブ |
| チャンク 96 字 | `VOICE_CHUNK_CHARS` 48→96 | 文途中分割はまだあり得る |
| ポール内順序キュー | `pendingDiscordVoiceQueue` + `awaitPlayback: true` | **同一 poll 内**のみ保証 |
| `voice_busy` | `stackchanFace` / `stackchanMove` が `_voicePlaybackBusy` 中は skip | **未カバー経路あり**（下記） |
| `play_done` 未受信 | フォールバック待ち ×1.12 | ファームが `audio.state` を返さない場合の推定待ち |

**確認ログ（PASS 例）**

```text
[StackChanVoice] batch ok (discord:discord_full_read:4)
[StackChan] Discord batch done: 4 utterance(s) from 4 chunk(s)
```

---

## 事象 A — モーション動作で読み上げが途切れる

### 再現条件（目安）

- VOICEVOX 起動・StackChan 接続済み
- 司令部で長文返信 → 読み上げ開始
- その前後に表情変更・サーボ・`playAnimation`・Secretary Event Bridge・`stackchanSayAsAgent`（モーション付き）が走る

### 想定根本原因

1. **別 WebSocket の同時操作**  
   - 読み上げ: `playPreparedUtteranceOnSocket` → `streamPcmToDevice`  
   - モーション: `stackchanFace` / `stackchanMove` / `stackchanAnimateSequence` は **別接続**を開いて `face_mode` / `move` を送り `sock.destroy()`  
   - ファーム側 `pcmBuf`（最大約 12s）と非同期 `playRaw` が **上書き・リセット**される可能性（`docs/firmware` の PCM cap 参照）

2. **`voice_busy` の抜け道**  
   - ガードあり: `stackchanFace` / `stackchanMove`（`_voicePlaybackBusy \|\| _globalSpeechPending > 0`）  
   - **ガードなし**: `stackchanAnimateSequence`（`playAnimation`）、`fireSecretaryEvent` 内の `stackchanLed`、一部 hook（`hookOnTaskDone` 等）、`stackchanSayAsAgent`（**同一ソケット内で move → PCM** — Discord 経路は `skipMotion` だが他経路は干渉しうる）

3. **Bot 側の表情**  
   - `poll` 内: `voiceDecision?.speak` のときは `stackchanFace` を送らない設計  
   - 非同期コールバック（`playAnimation("thinking")`、`fireSecretaryEvent`）は読み上げジョブと **グローバルキューで競合**

### 受け入れ基準（A）

- [ ] Discord 読み上げバッチ中（`_voicePlaybackBusy === true`）に、**いかなる経路でも**別 WS の `face_mode` / `move` / `dance` / LED が送られない  
- [ ] またはデバイス側で「発話中はモーションをキューし PCM 終了後に実行」する統一ポリシー  
- [ ] 長文 1 返信の聴感で、モーション目視時も **明らかな途切れ・欠落がない**

### 修正方針案（Codex）

- `stackchanAnimateSequence` / `stackchanLed` に `voice_busy` 同等ガード  
- 「Discord 読み上げセッション」トークンを導入し、セッション中は `enqueueGlobalSpeech` の **非 discord ラベルを保留**（defer キュー）  
- モーション必須なら **同一 WS・PCM 完了後** にまとめて送る（`stackchanSayAsAgent` の quirk/move を Discord バッチと分離）

---

## 事象 B — 溜まったメッセージを順番に読めない

### 再現条件（目安）

- Bot 停止中または遅延中に Discord へ **2〜5 通** 連続投稿
- 起動／ポール復帰後、テキスト返信は複数来るが、**読み上げが 1→2→3 の順にならない**

### 想定根本原因

1. **順序保証のスコープが狭い**  
   - `pendingDiscordVoiceQueue` は **1 回の `poll` で取得した `newMsgs` 配列**に対してのみ順序 flush  
   - メッセージ A が poll#1、B が poll#2 だと、理論上は FIFO だが **その間に別発話が割り込む**（事象 C）

2. **過去の暫定対策の名残**  
   - 調査時: 「最後の 1 件だけ読む」実装で H6 を抑えたが、ユーザー要件は **捨てず順番に全部**  
   - 現在は `awaitPlayback` で順次化済みだが **グローバルキュー全体**とは未統合

3. **テキストと音声の非同期**  
   - ループ内で Discord **送信は即時**、音声はポール末尾で一括 → ユーザーは「返信は全部見えたのに声は順不同」と感じやすい

### 受け入れ基準（B）

- [ ] バックログ N 通について、**読み上げ順 = メッセージ受信（処理）順**（1/N → N/N）  
- [ ] コンソールに `ordered 1/N starting` … `ordered 1/N done` が **欠けず N 回**  
- [ ] 1 通だけのときは従来どおり 1 回 `batch ok`

### 修正方針案（Codex）

- **永続キュー**（例: `.shikishima-memory/discord-voice-queue.json`）に `{ messageId, chunks, enqueuedAt }` を pushし、単一ワーカーが digest  
- または `enqueueGlobalSpeech` に **優先度**: `discord_ordered` > `notify` > その他  
- ポール中はテキスト送信後すぐ音声 1 件ずつ（`awaitPlayback`）にし、末尾一括 flush と **挙動を揃える**か、設計を明示ドキュメント化

---

## 事象 C — 途中受信が優先される（割り込み）

### 再現条件（目安）

- 長い読み上げ（複数 chunk / 複数返信）の **途中**で  
  - 新しい Discord メッセージ  
  - `speakOperatorNotify`（例: `cursor_answer_complete`）  
  - ワークフロー human 通知  
  が発生

### 想定根本原因

1. **グローバル FIFO は「種別を区別しない」**  
   - `enqueueGlobalSpeech`（`shikishima-stackchan.mjs`）は label 付きだが **discord 専用セマンティクスなし**  
   - `speakOperatorNotify` → `stackchanSay(..., queueLabel: notify:*)` が、  
     `ordered 2/3` の **ジョブ 1 とジョブ 2 の間**に割り込みうる

2. **非 await の発話**  
   - STT 経路・`!なかよし` 等: `maybeEnqueueDiscordVoice` が `awaitPlayback: false`（fire-and-forget）  
   - ポール順序 flush と **並行でキューに入る**

3. **ポールロックとキューのギャップ**  
   - `_pollInFlight` 中は次ポールは来ないが、**同一プロセス内の他タイマー／フック**は動く  
   - Cursor stop hook → `speakOperatorNotify` が Discord 順序キューより先に `enqueue` されると **聴感上「新しい方が優先」**

### 受け入れ基準（C）

- [ ] Discord 順序キュー digest 中は `notify:*` / milestone / 任意 `stackchanSay` を **defer**（digest 完了後に 1 回だけまとめてよい）  
- [ ] または operator notify に **低優先度**を付与し、進行中 `discord:batch` / `ordered */*` ラベルが空になるまで待機  
- [ ] 読み上げ中に新規ユーザー発話が来た場合: **現在の batch 完了後**に新メッセージを処理（先読み合成しない）

### 修正方針案（Codex）

```text
[提案アーキテクチャ]

discordVoiceController
  ├─ orderedQueue: DiscordVoiceItem[]  // cross-poll
  ├─ isDigesting: boolean
  ├─ enqueueItem(item)                 // poll / STT 共通入口
  └─ digestLoop()                      // 1 item = 1 stackchanSayPreparedChunks (await)

globalSpeech
  ├─ priority: discord_digest > default > notify_deferred
  └─ deferNonDiscordWhile(isDigesting)
```

---

## 調査時ログ・エビデンス（2026-05-31）

| 観測 | 内容 |
|------|------|
| H1 | 長文 261 字 → **9 チャンク**（48 字時代）→ 途切れ。96 字 + 単一 WS で改善 |
| H4 | `heardPlayDone: false` — ファーム `audio.state: play_done` 未着。フォールバック待ち依存 |
| H6 | 同一 poll で `decideDiscordVoiceSpeak` **5 回** — 複数返信が同時計画 |
| ユーザー PASS | `batch ok` + `Discord batch done: 4 utterance(s)`（短い 1 返信） |

---

## テスト・検証（Codex 実装後）

```powershell
Set-Location "C:\Users\81903\Desktop\プロジェクトファイル\hermes-desktop"
npm run test -- tests/hermes/zone/full-autonomy/stackchan-discord-voice.test.ts
node scripts/shikishima-process-preflight.mjs --clean --restart-dev
```

**手動（司令部）**

1. 3 通連続投稿 → `ordered 1/3` … `3/3` と聴感順序一致  
2. 長文 1 通 → モーション誘発コマンド（`!sc nod` 等）を読み上げ中に実行 → **途切れない**  
3. 読み上げ中に Cursor 完了通知（operator notify）→ **現在の読み上げ完了後**に鳴る

**報告文言**: 「この範囲では問題を検出していません」（禁止: 「問題ありません」）

---

## スコープ外（触らない）

- 憲法 `execution=enabled`  
- git push  
- CHI-C / MT5 本番  
- L2 guarded bridge の本番配線（`SHIKISHIMA_DISCORD_VOICE_BRIDGE`）  
- 常時発話ループ（別 Human GO）

---

## 引き継ぎチェックリスト

- [x] Codex 音声修正コード反映（2026-05-31）
- [x] Phase 1: digest 中 operator notify defer（`SHIKISHIMA_OPERATOR_NOTIFY_DEFER_DURING_DISCORD` 既定 ON）
- [x] vitest: `stackchan-discord-voice` / `stackchan-pcm-limits` / `stackchan-operator-notify-defer` / `discord-voice-playback-queue` / `full-autonomy-workflow-handoff-env`（2026-05-31 Cursor A1–B3: **31/31 pass**）

### 実機 PASS（司令部・人間の耳）

| # | 手順 | コンソール期待 | 聴感 | 状態 |
|---|------|----------------|------|------|
| 1 | 1 通短文 | `batch ok` · 途切れなし | 1 本で聞こえる | **PASS**（ユーザー報告 2026-05-31） |
| 2 | 3 通連続 | `playing in order` · `ordered 1/3`…`3/3` | 1→2→3 | **PASS**（人間完遂 2026-05-31） |
| 3 | 読み上げ中 `!sc nod` | `voice_busy` · 声は切れない | モーションのみスキップ | **PASS**（人間完遂 2026-05-31） |

- [x] Bot 再起動後テスト 2・3 完了 — 上表すべて PASS（人間 GO 2026-05-31）
- [x] `STACKCHAN_DISCORD_VOICE_UNIFICATION.md` chunk 96 へ更新（2026-05-31）
- [x] コンソールログ: `playing in order` / `ordered i/N` / `Discord batch done` 実装済み

---

## ChatGPT / 人間への確認事項（任意）

- operator notify（Cursor 完了音）を **完全 OFF** にする運用トグルで事象 C を緩和するか  
- バックログ時「最新 1 件だけ読む」節電モードを env で切り替えるか（既定: 順番に全部）
