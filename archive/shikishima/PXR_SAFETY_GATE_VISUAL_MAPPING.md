# PXR — 安全ゲート ビジュアルマッピング

**Prepared:** 2026-05-19
**Worker:** ClaudeCode (docs-only)
**Status:** Design — PXR-03 実装前の設計書

---

## 概要

既存の安全ゲート状態を 3D ピクセル部屋の **視覚的要素** にどう反映するかを定義する。
安全ガードは HUD 層として常時表示し、3D 部屋の「雰囲気」にも反映される。

---

## レイヤー構造

```
┌─────────────────────────────────┐
│  3D Pixel Room (上層/前景)       │
│    エージェント座席              │
│    家具・ライティング             │
│    ゲート状態反映ビジュアル       │
├─────────────────────────────────┤
│  Safety HUD Strip (下部固定)     │
│    execution:disabled           │
│    productionReady:false        │
│    Gate:HOLD / Level 5          │
└─────────────────────────────────┘
```

---

## ゲート状態 → ビジュアル要素 マッピング

### しきしま全体ゲート (execution / productionReady)

| 状態 | 部屋ビジュアル | HUD 表示 |
|---|---|---|
| `execution: disabled` | 部屋照明: 暗め / 青白いアンビエント | `execution:disabled` 常時表示 |
| `execution: enabled` | 部屋照明: 明るい / 暖色 | `execution:enabled` 常時表示 |
| `productionReady: false` | 全体に薄い青フィルタ | `productionReady:false` 常時表示 |
| `productionReady: true` | フィルタなし | `productionReady:true` 常時表示 |

### しずめ — 安全ゲート (Gate HOLD/GO)

| 状態 | 座席ビジュアル | ランプ | HOLD 札 |
|---|---|---|---|
| `Gate: HOLD` | しずめが腕を広げてブロック | 赤ランプ点滅 | `HOLD` 赤札 表示 |
| `Gate: GO` | しずめが横に退いた姿勢 | 緑ランプ点灯 | 非表示 |
| `Gate: UNKNOWN` | しずめが首をかしげる | 黄ランプ点滅 | `WAIT` 黄札 |

### しきしま — 司令ゲート (Level 5 / Human GO)

| 状態 | 座席ビジュアル | 中央ライト |
|---|---|---|
| Human GO 待ち | ゆっくり点滅 / 待機姿勢 | 青白い点滅 |
| Human GO 承認済み | 起立・前傾姿勢 | 緑点灯 |
| HOLD 中 | 座ったまま静止 | 赤 glow |

### むすび — 計画ゲート (Plan reviewed / not reviewed)

| 状態 | 座席ビジュアル |
|---|---|
| Plan not reviewed | デスクを見つめて停止 |
| Plan in review | 地図の上で動作中 |
| Plan approved | デスクから立ち上がった姿勢 |

### つむぐ — 開発ゲート (code safe / unsafe)

| 状態 | 座席ビジュアル |
|---|---|
| Code safe | 通常タイピング |
| Code warning | 手を止めた姿勢 + 黄色ランプ |
| Code blocked | 椅子を引いた姿勢 + 赤ランプ |

### しるべ — 記録ゲート (evidence complete / incomplete)

| 状態 | 座席ビジュアル |
|---|---|
| Evidence complete | ノートを閉じた姿勢 |
| Evidence pending | ペンを走らせる姿勢 |
| Evidence missing | 棚の前で停止 |

---

## HUD Safety Strip 設計

```
┌────────────────────────────────────────────────────────┐
│ ██ execution:disabled  ██ productionReady:false        │
│ ██ Gate:HOLD           ██ Level 5: human GO required   │
└────────────────────────────────────────────────────────┘
```

- 常時表示: `position: fixed; bottom: 0;`
- 背景: `rgba(13,17,23,0.92)` + `border-top: 1px solid #f85149`
- フォント: IBM Plex Mono 11px
- 色: `#f85149` (red) for HOLD/disabled, `#3fb950` (green) for GO/enabled

---

## PXR フェーズ別実装スコープ

| Phase | 安全ビジュアル実装内容 |
|---|---|
| PXR-01 | HUD strip static 表示 (`execution:disabled` / `productionReady:false` ハードコード) |
| PXR-02 | エージェント HOLD/GO 初期姿勢を CSS クラスで表現 |
| PXR-03 | React state → Gate 状態 → CSS クラス + HUD 動的更新 |
| PXR-04 | sprite 差し替えで HOLD/GO 表情 変化 |

---

## 安全原則

```
- HUD layer は 3D 部屋の上に常時オーバーレイ
- ゲート状態は display-only: 3D 部屋から Gate を変更できない
- Gate GO/HOLD の判断は必ず人間: UI は「現在の状態を見せる」だけ
- productionReady/execution の表示は消去・隠蔽しない
```
