# PXR — エージェント モーション & ステート 設計

**Prepared:** 2026-05-19
**Worker:** ClaudeCode (docs-only)
**Status:** Design — PXR-02 / PXR-03 実装前の設計書

---

## 概要

各エージェントは **Agent State** に応じて **Pose (姿勢)** と **Motion (CSS アニメーション)** が変化する。
PXR-01 では static 表示のみ。PXR-02 以降で順次実装。

---

## エージェント状態マトリクス

| State | 意味 | Pose | Motion | Color Hint |
|---|---|---|---|---|
| `IDLE` | 待機中 | 正面・静止 | gentle float (y ±2px, 4s) | normal |
| `ACTIVE` | 作業中 | やや前傾 | quick pulse (scale 1→1.03, 1s) | `#3fb950` (green) |
| `THINKING` | 判断中 | 頭部回転 | slow spin (90deg, 3s loop) | `#58a6ff` (blue) |
| `HOLD` | ゲート停止 | 手を上げる | freeze + red glow | `#f85149` (red) |
| `COOLDOWN` | クールダウン | やや後退 | slow fade (opacity 0.6→1, 2s) | `#d29922` (yellow) |
| `BLOCKED` | ブロック済み | X ポーズ | none | `#8b949e` (gray) |
| `NEEDS_HUMAN` | 人間待ち | 手を振る | wave (rotate ±10deg, 1s loop) | `#a371f7` (purple) |

---

## エージェント別デフォルト Pose (IDLE 時)

| エージェント | 座席 | IDLE 姿勢 | 特徴モーション |
|---|---|---|---|
| **しきしま** | 中央司令席 | 正面・腕組み | 全体をスキャンするように左右に微回転 |
| **しずめ** | 左・安全ゲート前 | 番人立ち | ゲート方向を向き静止 / HOLD 時は赤ランプ点滅 |
| **むすび** | 上・計画デスク | デスク向き | 地図を見るように前傾 |
| **つむぐ** | 右・開発ベンチ | キーボード前 | 軽いタイピングモーション (loop) |
| **しるべ** | 下・記録棚 | ノート前 | ペン動作 (loop) |

> 注意: はじめ → むすび / つむぎ → つむぐ に名称変更済み (2026-05-19 確定)

---

## CSS アニメーション設計

### IDLE float (全エージェント共通)
```css
@keyframes iso-float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-2px); }
}
.agent-idle { animation: iso-float 4s ease-in-out infinite; }
```

### ACTIVE pulse
```css
@keyframes iso-pulse {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.03); }
}
.agent-active { animation: iso-pulse 1s ease-in-out infinite; }
```

### HOLD freeze + glow
```css
.agent-hold {
  animation: none;
  filter: drop-shadow(0 0 6px #f85149);
  opacity: 0.85;
}
```

### NEEDS_HUMAN wave
```css
@keyframes iso-wave {
  0%, 100% { transform: rotate(0deg); }
  25%       { transform: rotate(-10deg); }
  75%       { transform: rotate(10deg); }
}
.agent-needs-human { animation: iso-wave 1s ease-in-out infinite; }
```

---

## 状態 → CSS クラス マッピング

```ts
// PXR-03 実装時に使用予定
const AGENT_STATE_CLASS: Record<AgentWorkerState, string> = {
  IDLE:        "agent-idle",
  ACTIVE:      "agent-active",
  THINKING:    "agent-thinking",
  HOLD:        "agent-hold",
  COOLDOWN:    "agent-cooldown",
  BLOCKED:     "agent-blocked",
  NEEDS_HUMAN: "agent-needs-human",
};
```

---

## PXR フェーズ別実装スコープ

| Phase | モーション実装内容 |
|---|---|
| PXR-01 | static 表示のみ (クラス = `agent-idle`、アニメなし) |
| PXR-02 | idle アニメーション実装 (float, typing loop) |
| PXR-03 | state → CSS class マッピング (React state 連動) |
| PXR-04 | sprite asset 差し替え (アセット Gate 後) |

---

## 安全原則

```
- モーションは display-only: 実行ボタン・状態変更なし
- state は React state → CSS class のみで IPC 追加しない
- HOLD 表示は安全の「見える化」であり、Gate 判断は人間
```
