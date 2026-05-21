# Speak Value Score Spec

## 1. 目的

「話す価値がある時だけ話すAI」を実装可能なスコアリングに落とす。

初期実装では、スコアが高くても自動発話しない。Shadow Modeの判断ログと発話候補作成に限定する。

## 2. スコア項目

- `urgency`: 今伝える必要性。
- `lossPrevention`: 損失や事故の予防価値。
- `deadlineRelevance`: 締切との関係。
- `userWaiting`: ユーザーが明示的に待っているか。
- `interruptionCost`: 作業中断コスト。
- `evidenceStrength`: 根拠の強さ。
- `repetitionPenalty`: 最近同じ内容を出したか。
- `timeSensitivity`: 時間経過で価値が落ちるか。
- `safetyRisk`: 安全リスク。
- `emotionalSupportNeed`: 寄り添いの必要性。
- `marketOrTradeRisk`: 市場/取引リスク。ただし売買判断はしない。
- `projectProgressImpact`: プロジェクト進行への影響。

## 3. 初期方針

- `shouldSpeak:false` を基本にする。
- 自動発話しない。
- 通知しない。
- scoreが高くてもSpeakCandidateだけ生成する。
- 介入判断はユーザー承認前提。
- Shadow Modeログ用に使う。

## 4. 戻り値

```ts
interface SpeakValueResult {
  shouldSpeak: false;
  score: number;
  reasonCode: string;
  reason: string;
  suggestedTiming: "now" | "later" | "never" | "needs_review";
  speakCandidate: SpeakCandidate | null;
}
```

## 5. 禁止事項

- 自動発話。
- 音声出力。
- 通知。
- memory DB更新。
- 外部通信。
- MT5/EA判断。
- 取引判断。
