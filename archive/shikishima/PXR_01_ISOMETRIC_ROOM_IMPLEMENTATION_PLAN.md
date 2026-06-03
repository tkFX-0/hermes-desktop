# PXR-01 — Isometric Room 実装計画

**Prepared:** 2026-05-19
**Worker:** ClaudeCode (docs-only)
**Next:** PXR-01 実装 (Level 4 / ClaudeCode 担当)

---

## PXR-01 ゴール

CSS のみで isometric / 2.5D 風の部屋を作る。
画像アセットなし。Three.js なし。Runtime start なし。

**完成イメージ:**
- 等角投影 (isometric) 風の床・壁・家具を CSS で描画
- 5 エージェントが部屋の各座席に「置かれた」状態で表示
- 全て display-only / CSS animation のみ

---

## 技術アプローチ

### Option A: CSS transform isometric (推奨)

```css
/* isometric 変換の基本 */
.iso-tile {
  transform: rotateX(60deg) rotateZ(-45deg);
  transform-style: preserve-3d;
}

/* 床タイル */
.floor-tile {
  width: 64px; height: 64px;
  background: #0d1117;
  border: 1px solid #21262d;
  transform: rotateX(60deg) rotateZ(-45deg);
}

/* 壁面 */
.wall-left  { transform: rotateX(60deg) rotateZ(-45deg) rotateY(-90deg); }
.wall-right { transform: rotateX(60deg) rotateZ(-45deg) rotateY(90deg); }
```

利点:
- 純 CSS / React
- 軽量
- アニメーションと相性良し
- package 追加不要

### Option B: SVG isometric grid (代替)

```
SVG で等角グリッドを描き、その上に React コンポーネントを配置
より精密な座標管理が可能
```

**推奨: Option A (CSS transform)** から始め、必要に応じて SVG に移行。

---

## 部屋レイアウト設計

```
isometric 座標系 (x=右奥, y=左奥, z=上):

              [はじめ / Plan Desk]
              奥壁・ホワイトボード前
       ↙                           ↘
[しずめ / Safety Gate]    [つむぎ / Dev Bench]
左壁・ゲート                      右壁・ベンチ
       ↘                           ↙
              [★ しきしま / Command]
              中央・司令デスク (最も高い台座)
       ↙                           ↘
[左床角]                          [右床角]
              [しるべ / Record]
              手前中央・記録棚
```

CSS grid で近似:
```
grid-template-areas:
  ". hajime ."
  "shizume center tsumugi"
  ". shikishima ."
  ". shirube ."
```

---

## 実装ファイル (PXR-01 実装時)

```
src/renderer/src/screens/AgentTheater/
  PixelRoom/
    PixelRoomView.tsx          ← 部屋全体コンテナ
    IsoFloor.tsx               ← 等角床タイル
    IsoWall.tsx                ← 壁面
    AgentStation.tsx           ← エージェント座席カード
    RoomHUD.tsx                ← 安全ステータス HUD
    pixel-room.css             ← isometric CSS
```

---

## 既存 Agent Theater との統合方法

```
Option 1: タブ切り替え (推奨)
  Agent Theater Tabs に「部屋 / ROOM」タブを追加
  既存カードUIと3D部屋ビューを並立

Option 2: トグル
  ControlRoomLayout の上部に「カードモード / 部屋モード」切り替え

Option 3: 置き換え
  ControlRoomLayout を部屋ビューに完全置き換え
  既存カードは別ページへ
```

**推奨: Option 1** — 既存安全UIを壊さず、新しいビューを追加。

---

## PXR-01 実装スコープ (完全 display-only)

**含む:**
- 部屋の床・壁・家具を CSS で描く
- 5 エージェントを座席に配置 (GhostSvg 既存利用可)
- idle 状態の static 表示

**含まない:**
- モーション連動 (PXR-02 で)
- 状態反映 (PXR-03 で)
- 画像アセット (PXR-04 で)
- IPC 追加なし
- package 変更なし

---

## PXR-01 完了条件

```
[ ] 部屋が CSS isometric で描画される
[ ] 5 エージェントが座席に配置される
[ ] 安全 HUD が常時表示される
[ ] typecheck PASS
[ ] 実行ボタンなし
[ ] package 変更なし
[ ] display-only 確認
```
