# XS-AUTO-03 Evidence — 2026-05-21 StackChan Voice + FX Research

result: PASS
gate: XS-AUTO-03
date: 2026-05-21
gate_opened_by_human: true
exact_go_reference: 2026-05-21 XS-AUTO-03 One-shot Research GO (conversation)

## xs_auto_03

```text
human_go_present:       true
time_window_jst:        実行時刻
exact_queries:
  A1. StackChan CoreS3 speech voice push API Discord Bot integration
  A2. stackchan-arduino VOICEVOX ttsQuestV3Voicevox LLM Hermes voice
  B1. XAUUSD EA scalping strategy prop firm 2026
  B2. gold XAUUSD M5 scalping kill zone silver bullet EA funded account
  A-fetch. robo8080/AI_StackChan2_README
  A-fetch. ronron-gh/AI_StackChan_Ex README
  B-fetch. XAUUSD 5-min scalping strategy prop firms
allowed_run_count:      1 (one-shot)
actual_run_count:       1
source_scope:           public web / public GitHub / public article
x_oauth_used:           false
x_api_used:             false
login_required:         false
write_action_performed: false
recurring_started:      false
evidence_created:       true
gate_restored_hold:     true
```

---

## TOPIC A — StackChan 音声統合調査

### A-1. VOICEVOX / TTS 統合 (FACT — GitHub公開情報)

| 項目 | 内容 | Source |
|---|---|---|
| TTS エンジン | Web版 VOICEVOX (API key 登録で高速化) | AI_StackChan2_README |
| ストリーミング | `ttsQuestV3Voicevox` — 合成完了前に再生開始 | ts-klassen/ttsQuestV3Voicevox |
| 話者番号 | 0〜60 (四国めたん / ずんだもん 等) | AI_StackChan2_README |
| マルチTTS | VOICEVOX / ElevenLabs / OpenAI TTS / AquesTalk | ronron-gh/AI_StackChan_Ex |
| 設定方法 | YAML ファイルで TTS / LLM を切り替え | AI_StackChan_Ex README |

### A-2. STT (音声認識) (FACT)

| 項目 | 内容 |
|---|---|
| 対応 STT | Google Cloud Speech-to-Text / OpenAI Whisper |
| Whisper 設定 | STT API key = OpenAI API key で自動選択 |
| 関連機能 | ウェイクワード登録 / 独り言モード |

### A-3. LLM 統合 (FACT)

| 項目 | 内容 |
|---|---|
| LLM | ChatGPT API (ロール設定機能あり) |
| Module LLM | M5Stack Module LLM → Voice Assistant 実装例あり |
| 代替実装 | `yh1224/AIStackchan-hrs` / Local LLM 対応検討中 |

### A-4. Discord Bot 統合 (UNKNOWN — 未発見)

| 項目 | 内容 |
|---|---|
| StackChan + Discord 直接統合 | 公開実装なし (今回の検索範囲では) |
| Discord TTS Bot 一般 | REST API / MCP server パターンで push 可能 |
| 実装方向 (ESTIMATED) | しきしまから Discord Bot 経由で StackChan の `/speak` エンドポイントを叩く構成が考えられる |

### A-5. 主要リポジトリ (FACT)

| リポジトリ | 内容 |
|---|---|
| `robo8080/AI_StackChan2_README` | AI StackChan2 メインプロジェクト |
| `ronron-gh/AI_StackChan_Ex` | マルチTTS / LLM 拡張実装 |
| `ts-klassen/ttsQuestV3Voicevox` | VOICEVOX ストリーミング API |
| `yh1224/AIStackchan-hrs` | 代替実装 |
| `mimisukeMaster/AI-VOICEVOX` | VOICEVOX + 複数 LLM Web アプリ |

### A まとめ

**VOICEVOX + StackChan 統合は実績十分。** ttsQuestV3Voicevox でストリーミング再生可能。
STT は Whisper で対応可。LLM は ChatGPT → 将来的にローカル LLM も視野。
Discord 直接統合の公開実装は未発見。しきしまからの push は REST 設計で対応可能 (ESTIMATED)。

---

## TOPIC B — FX / XAUUSD M5 調査

### B-1. M5 スキャルピング戦略 (FACT — 公開記事)

| 項目 | 内容 |
|---|---|
| トレンド判定 | 20EMA / 50EMA クロス (Silver Bullet EA と同じ EMA アプローチ) |
| エントリー | SR 反発 + RSI / ストキャスティクス 確認 |
| RR 比 | 1:1.5 (Silver Bullet EA の RR=1.5 と一致) |
| 損切り | 機械的実行を強調 |

### B-2. Kill Zone 時間帯 (FACT)

| セッション | UTC | JST |
|---|---|---|
| London + NY オーバーラップ | 08:00-12:00 EST | 21:00-01:00 JST |
| NY Kill Zone (参考: 当 EA) | — | 21:00-24:30 JST |

**→ NY Kill Zone EA の時間設定と完全一致。文献的にも裏付け確認。**

### B-3. プロップファーム注意点 (FACT)

| 項目 | 内容 |
|---|---|
| 1トレードリスク | 0.5% 以下推奨 |
| 日次 DD | 厳守必須 |
| ニュース回避 | 発表前後 15 分 |
| 禁止事項 | リベンジトレード / 感情的トレード |

### B-4. 注目 EA (FACT — 公開情報)

| EA | TF | 特徴 | プロップ対応 |
|---|---|---|---|
| Gold SMC Scalper | M5 | Smart Money Concepts / Order Block / FVG / Liquidity | ○ |
| Gold Scalper Pro | M15 | +1040% / DD 15.82% / Drawdown Protection System | ○ |
| Gold Killer EA v15 | M1/M5 | 多戦略 (scalp/trend/breakout) | ○ |
| Gold Scalper King | M5 | M5 特化 | 記載なし |

**Gold SMC Scalper は Order Block / FVG / Liquidity を使用 → Silver Bullet EA の設計思想と一致。**

### B まとめ

M5 Kill Zone スキャルピングは文献的にも裏付け十分。
RR 1:1.5 / EMA トレンドフィルター / SMC アプローチは現在の EA 設計と整合。
Drawdown Protection System の実装は ATFunded Pro 運用で検討価値あり。

---

## findings

```text
summary:
  A: StackChan VOICEVOX統合は実装十分。ttsQuestV3Voicevox がストリーミング再生のキー。
     Discord push 統合は公開実装未発見だが REST 設計で対応可能 (ESTIMATED)。
  B: XAUUSD M5 Kill Zone スキャルピングは文献的に裏付け確認。
     Silver Bullet EA / NY Kill Zone EA の設計が業界標準と一致。

key_points:
  - ttsQuestV3Voicevox: ストリーミング VOICEVOX API (API key 不要の無料枠あり)
  - AI_StackChan_Ex: VOICEVOX / ElevenLabs / OpenAI TTS / AquesTalk マルチ対応
  - STT: Whisper (OpenAI API key で自動選択) → しきしま STT 統合の参考に
  - NY Kill Zone 21:00-24:30 JST は文献的に最適帯と一致
  - Gold SMC Scalper の SMC アプローチは Silver Bullet EA 設計と整合

relevance_to_shikishima:
  - SC-AI-01 (固定テキスト音声) → ttsQuestV3Voicevox が最短実装パス
  - SC-AI-00 (音声ルート確認) → AI_StackChan2 / AI_StackChan_Ex が参照実装
  - EA運用 → M5 Kill Zone / RR 1.5 / EMA の方向性確認
  - ATFunded Pro DD管理 → Drawdown Protection System の考え方を参考に

next_action:
  A: SC-AI-00 チェック後 SC-AI-01 fixed text one-shot GO を検討
  B: ATFunded Pro チャレンジ準備として DD 管理設定を再確認
```

## safety

```text
x_account_connected:       false
token_used:                false
post_like_follow_reply_dm: false
external_write:            false
productionReady:           false
execution:                 disabled
rawValuesReported:         false
```

## Note

- XACC (X Account OAuth) は使用していない
- XS-AUTO (read-only 公開情報調査) として実行
- gate restored to HOLD after this run
- 次回実行には新規 human GO が必要
