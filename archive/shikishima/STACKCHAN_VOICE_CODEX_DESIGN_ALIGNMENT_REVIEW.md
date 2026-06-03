# StackChan Voice — Codex Design vs Implementation Alignment Review

Date: 2026-05-26  
Reviewer: Cursor (read-only doc + code cross-check)  
Human status: **HOLD** (faint/muffled; VOICEVOX path not intelligible on device)

---

## 1. 結論（3行）

```text
1. 全面やり直しは不要 — Codex 設計（身体直送）と legacy stackchanSay はそのまま使える。
2. 2026-05-26: guarded 送信を stackchanSay 同等プロトコル (stackchan-voice-production-speak) に切替；FW は speaking 時 pcmBuf.clear() を追加（要フラッシュ）。
3. Phase 1 合格は依然人間可聴 — 再パイロット後の目視のみ。
```

---

## 2. 設計ドキュメント階層（Codex）

| 層 | ドキュメント | 要点 |
|----|-------------|------|
| ビジョン | `SHIKISHIMA_STACKCHAN_ASSISTANT_VISION.md` | StackChan = 身体、しきしま = 判断 |
| 安全 | `STACKCHAN_SAFETY_BOUNDARY.md` | voice HOLD が既定；GO で one-shot |
| 音声アーキ | `STACKCHAN_VOICE_OUTPUT_ARCHITECTURE.md` | **身体直送**が正；Hermes TTS は採用しない |
| 章設計 | `STACKCHAN_VOICE_CHAPTER_DESIGN.md` | display と voice 分離；guarded transport |
| 会話 | `SC_AI_02_TEXT_DIALOGUE_FIRST_ARCHITECTURE.md` | テキスト対話が先、発話は SC-AI-01 後 |
| Discord 将来 | `SHIKISHIMA_DISCORD_STACKCHAN_VOICE_FUTURE_DESIGN.md` | legacy 厚い / guarded 薄い → parity 要 |
| 全体タイミング | `docs/STACKCHAN_DESIGN.md` F5 | motion→face→speaking→subtitle→PCM→idle |

**注意**: `SC_AI_00_VOICE_CAPABILITY_CHECK.md` は 2026-05-21 時点の HOLD 記録。Route B はその後 `stackchanSay` / guarded で進んでいるため、**履歴として読む**（現状と矛盾する箇所あり）。

---

## 3. ファームウェア（`shikishima_cores3.ino`）

```text
ENABLE_PCM_AUDIO = true
WS :8080
PCM: 16 kHz mono int16, chunk upload while audioUploadArmed
Playback: state=idle 受信後、pcmBuf 一括 playRaw (volume 220)
Auth: authorizeControl(token) — PC 側 STACKCHAN_CONTROL_TOKEN と対応
```

### 設計上の重要挙動

1. `state=speaking` でアップロード武装（15 s 窓）  
2. バイナリフレームは **武装中のみ** 受理  
3. `state=idle` で再生開始（全チャンク揃った後）  
4. **`state=speaking` 時に pcmBuf を clear しない** — 異常終了後の残留と新 PCM が混ざるとかすれの原因になりうる（要 Codex/人間確認）

---

## 4. PC 側実装マップ

| 経路 | 場所 | guarded | 用途 |
|------|------|---------|------|
| Legacy 本番 | `scripts/shikishima-stackchan.mjs` `stackchanSay` | なし | Discord bot, STT, 秘書フック |
| Legacy TS | `src/main/stackchan-local-service.ts` | なし | Electron 等 |
| Guarded pilot | `src/main/stackchan-voice-route/*` | あり | Phase 1 one-shot |
| Display / Motion | `stackchan-display-route`, `stackchan-motion-route` | あり | 別 GO（混在禁止） |

---

## 5. 現象と設計の対応

| 人間観測 | 設計解釈 |
|----------|----------|
| 口パク | `state=speaking` + 顔モード JSON は到達 |
| かすれ音 | PCM 一部到達 or バッファ混在 or リサンプル品質 |
| VOICEVOX として聞き取れない | 端末スピーカー経路の intelligibility 未達（PC スピーカー再生とは別） |

---

## 6. 推奨確認順（Codex デバッグプラン拡張）

```text
1. [人間] VOICEVOX アプリ単体で「よろしく。」プレビュー — PC から明瞭か
2. [人間] Discord !sc say よろしく。 — legacy 経路の明瞭さ
3. [人間] guarded one-shot（許可GO）— legacy と同程度か
4. [read-only] FW シリアルに pcm_too_large / auth_required が出ていないか（値は redacted）
5. [FW GO 別途] speaking 開始時 pcmBuf.clear() の要否を Codex 設計者と合意
```

---

## 7. しきしま Full Autonomy との関係

```text
Phase 1: voice acceptance — BLOCKED (human HOLD)
Phase 7: Discord → voice — guarded + parity 完了後
設計パッケージ (Phases 2–7 コード) は司令塔・ゲート用；音声品質とは独立
```

---

## 8. 関連ファイル

- `STACKCHAN_VOICE_AUDIO_PATH_DEBUG_PLAN.md`（parity 表追記済み）
- `STACKCHAN_VOICE_PILOT_HUMAN_HOLD_2026-05-26.md`
- `EXPLICIT_PERMITTED_GO_POLICY.md`
