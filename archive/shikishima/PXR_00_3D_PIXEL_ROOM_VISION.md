# PXR-00 — しきしま 3D Pixel Room Vision

**Prepared:** 2026-05-19
**Worker:** ClaudeCode (docs-only)
**Status:** Vision / Design phase

---

## コンセプト

現在の Agent Theater は「情報として正しい安全管制パネル」。
次に作るのは「**生きている3Dピクセル管制室**」。

```
現在: 安全状態・Gate・Worker状態を見る「管制パネル」
PXR:  3D pixel room上で、しきしま達の状態が見える「生きてる管制室」
```

---

## ビジョン

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│    [はじめ/計画デスク]                                    │
│       地図・ボード前で考える                              │
│                                                         │
│ [しずめ]         [★ しきしま]          [つむぎ]          │
│  安全ゲート前     司令席・中央           開発ベンチ        │
│  HOLD札 / 赤ランプ  GO待ちで中央点滅    キーボード操作中  │
│                                                         │
│                 [しるべ/記録棚]                          │
│                  ノートを書く/evidence                   │
│                                                         │
│  ══════════════════════════════════  ← 安全ラインHUD    │
│  execution:disabled  productionReady:false  Gate:HOLD  │
└─────────────────────────────────────────────────────────┘
```

---

## 各エージェントの座席と役割感

| エージェント | 座席 | 雰囲気 | HOLDへの反応 |
|---|---|---|---|
| しきしま | 中央司令席 | 全体を見渡す / 待機・判断中 | 中央でゆっくり点滅 |
| しずめ | 左・安全ゲート前 | 番人 / 見張り | 赤ランプ + HOLD 札 |
| はじめ | 上・計画デスク | ボード前で考える | 地図を見つめ停止 |
| つむぎ | 右・開発ベンチ | キーボード・工具 | 手を止めて待機 |
| しるべ | 下・記録棚 | ノート・ログ | ペンを置いて待機 |

---

## 安全ガードとの融合

3D 部屋ビューは **表示層** であり、安全ガードは **HUD 層** として常時表示。

```
3D pixel room (上層/前景)
  └─ エージェント座席・アニメーション・状態表示
HUD safety strip (下部固定)
  └─ execution:disabled / productionReady:false / Gate:HOLD / Level 5
```

現在の Gate Dashboard / Worker Status / Runaway Guard は:
- サイドパネル または
- 部屋の「モニター」として部屋内に統合

どちらにするかは PXR-01 で決定。

---

## 実装フェーズ概要

| Phase | 内容 | 技術 | 状態 |
|---|---|---|---|
| **PXR-01** | CSS isometric 静的部屋 | React + CSS only | 次に実装 |
| **PXR-02** | エージェント配置 + idle アニメ | CSS animation | PXR-01 後 |
| **PXR-03** | 状態連動モーション | React state → CSS class | PXR-02 後 |
| **PXR-04** | Sprite asset gate | 画像/ライセンス確認後 | 別 Gate |
| **PXR-05** | Three.js / WebGL 拡張検討 | optional | FUTURE |

---

## 安全原則

```
display-only:          部屋の中に実行ボタンなし
safety HUD 常時表示:   execution/productionReady/Level 5 は常に見える
no IPC:                部屋ビューは新しい IPC を追加しない
no external call:      部屋はローカル state のみで動く
no asset gate skip:    画像は PXR-04 gate 後のみ
```

---

> しきしま計画の「最終視覚ゴール」はここ。
> 安全ゲート付きの3Dピクセル管制室。
