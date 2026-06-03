# TTS / カスタム声ロードマップ（VOICEVOX → 将来）

Date: 2026-05-30  
調査: ユーザー共有（honoka-tts / Voicebox）+ しきしま現行実装

## 現状（StackChan 本番経路）

| 項目 | 内容 |
|------|------|
| パイプライン | テキスト → **VOICEVOX** `:50021` → 16kHz PCM → StackChan WebSocket |
| コード | [shikishima-stackchan.mjs](../../scripts/shikishima-stackchan.mjs) `voicevoxSynthesize` |
| ボイス | `speaker` ID 固定（カスタム声は未対応） |
| 遅延 | 合成 + PCM 分割 + **グローバル直列キュー** → Discord 全文読み上げは **リアルタイム困難** |
| 聴感 GO | **後追い**（PASS イベント・回答完了時に都度確認で可） |

## honoka-tts 採用可否（2026-05-29 時点情報）

| 判定 | 理由 |
|------|------|
| **現時点: 不可** | 非公開・API なし・統合契約なし |
| **将来: 要再評価** | 公開・ライセンス・ローカル API が出た時点で再調査 |
| **しきしま向け強み** | 自然さ・速度・低 VRAM（主張） |
| **弱み** | クローンなし・UI なし・StackChan への PCM ブリッジ未整備 |

**結論**: Voicebox / honoka-tts どちらも **今すぐ VOICEVOX 差し替えはしない**。公開待ち + アダプタ設計のみ。

## Voicebox 採用可否

| 判定 | 理由 |
|------|------|
| **技術的: 有望（中期）** | オープン・API・複数エンジン・クローン |
| **短期: 追加調査** | StackChan が要する **16kHz PCM / レイテンシ** と API 出力形式の突合が未実施 |
| **推奨** | ローカルで Voicebox + Qwen3-TTS を試し、**1 フレーズの合成時間**を計測してからアダプタ設計 |

## レスポンス（リアルタイム）の整理

| ボトルネック | 対策案（優先度） |
|--------------|------------------|
| VOICEVOX HTTP 往復 | TTS アダプタ抽象化 + より高速エンジン |
| 長文 Discord 読み上げ | 既存 chunk 48 · 要約読み上げモード（env） |
| グローバル直列キュー | 通知系は短フレーズ優先キュー（operator-notify は既に短文化） |
| PCM / firmware cap | 分割発話（実装済み） |

**目標**: 「返信と同時に全部読む」ではなく **短い通知 + 詳細は Discord テキスト**（意図別 operator-notify と整合）。

## 推奨フェーズ（コード変更は段階 GO）

| Phase | 内容 | G/H |
|-------|------|-----|
| T0 | 本 doc + `TtsBackend` インターフェース案（VOICEVOX 実装のみ） | G |
| T1 | Voicebox ローカル試験・レイテンシ計測ログ | H |
| T2 | `STACKCHAN_TTS_BACKEND=voicevox\|voicebox` アダプタ | H |
| T3 | カスタム声（クローン）・話者 ID 設定 | H |
| T4 | honoka-tts — **公開後**のみ | H |

## あなたの方針との対応

> 今後は Voicevox ではなくカスタマイズした好きな声に

- **方向性**: 賛成（Voicebox 系クローンが現実的な第一候補）
- **当面**: VOICEVOX 維持 + HOLD/聴感はイベント都度
- **Chisiki C（質問票）**: オンチェーン TTS とは無関係 — **別 GO のまま**

参考: ユーザー調査 Voicebox https://voicebox.sh/ · honoka 投稿（非公開）
