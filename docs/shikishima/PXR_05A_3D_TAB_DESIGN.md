# PXR-05A — 3D タブ追加 設計書

**Prepared:** 2026-05-20
**Worker:** ClaudeCode (docs-only)
**Status:** Design — PXR-05B 実装前の設計書

---

## 概要

Claw3D 参照アーキテクチャをもとに、しきしま管制室に **Three.js / React Three Fiber** による
本格 3D ビューを追加する。  
既存 CSS ROOM タブは安全な fallback として残す。

```
管制室タブ構成 (PXR-05 以降)
  └── [CSS 部屋]   既存 PixelRoomView  ← fallback / 軽量
  └── [3D 部屋]    新規 R3F Scene      ← PXR-05A〜D で実装
```

---

## 決定事項

```yaml
approach:         A — 新規タブ追加 (CSS 部屋は残す)
camera:           fixed OrthographicCamera, 45° isometric
free_camera:      deferred to PXR-06
display_only:     true
new_ipc:          false
productionReady:  false
execution:        disabled
```

---

## 依存追加計画 (PXR-05B GO 後に実施)

### 追加パッケージ

| パッケージ | バージョン | 用途 | サイズ概算 |
|---|---|---|---|
| `three` | `^0.177` | WebGL 3D エンジン本体 | ~600KB gzip |
| `@react-three/fiber` | `^9` | React バインディング | ~140KB gzip |
| `@react-three/drei` | `^10` | Camera / Html / helpers | ~180KB gzip |

### devDependencies

| パッケージ | バージョン | 用途 |
|---|---|---|
| `@types/three` | `^0.177` | TypeScript 型定義 |

### package.json diff (概要)

```diff
 "dependencies": {
+  "three": "^0.177.0",
+  "@react-three/fiber": "^9.0.0",
+  "@react-three/drei": "^10.0.0"
 },
 "devDependencies": {
+  "@types/three": "^0.177.0"
 }
```

### インストールコマンド (PXR-05B GO 後)

```powershell
npm install three @react-three/fiber @react-three/drei
npm install --save-dev @types/three
```

**重要: 人間 GO なしにこのコマンドを実行しない。**

---

## コンポーネント構成

```
src/renderer/src/screens/AgentTheater/PixelRoom3D/
  Room3DView.tsx          ← R3F Canvas + シーン全体
  Room3DScene.tsx         ← useFrame なし静的シーン
  IsoCamera.tsx           ← OrthographicCamera 固定設定
  RoomGeometry.tsx        ← 床・壁・天井メッシュ
  DeskMesh.tsx            ← デスク1個分のメッシュ
  AgentMesh.tsx           ← エージェント1体分 (Sprite/Billboard)
  Room3DHUD.tsx           ← <Html> overlay 安全HUD
  room3d-constants.ts     ← 座標・色・寸法定数
```

---

## 3D シーン設計

### 座標系

```
  Y
  │
  │         Z (上)
  │        /
  └──── X

等角投影: X=右奥, Y=左奥, Z=上
部屋サイズ: 10×8×3 units
```

### カメラ設定

```ts
// IsoCamera.tsx
<OrthographicCamera
  makeDefault
  position={[8, 8, 8]}    // 45° isometric
  zoom={55}               // 画面に収まるズーム
  near={0.1}
  far={100}
/>
// lookAt(0, 0, 0)
// rotation は固定 — PXR-06 まで変更不可
```

### 部屋レイアウト (3D 座標)

```
Agent        3D position     Desk size
──────────── ────────────── ──────────────
むすび       [0, 3, 0]      1.2 × 0.1 × 0.7
しずめ       [-3, 0, 0]     1.0 × 0.1 × 0.6
★しきしま   [0, 0, 0.4]    1.5 × 0.1 × 0.9  (+台座)
つむぐ       [3, 0, 0]      1.2 × 0.1 × 0.7
しるべ       [0, -3, 0]     1.0 × 0.1 × 0.6
```

台座 (しきしま): `[0, 0, 0]`, サイズ `2.0 × 0.4 × 1.4`, 高さ +0.4

### ライティング

```ts
<ambientLight intensity={0.4} />
<pointLight position={[0, 6, 4]}  intensity={1.2} color="#58a6ff" />
<pointLight position={[-4, -4, 3]} intensity={0.6} color="#f0883e" />
```

### マテリアル & カラー

| 要素 | カラー | マテリアル |
|---|---|---|
| 床 | `#0d1117` | MeshStandardMaterial + grid texture |
| 奥壁 | `#080d18` | MeshStandardMaterial |
| 左壁 | `#080c14` | MeshStandardMaterial |
| デスク (共通) | `#161b22` | MeshStandardMaterial |
| しきしま台座 | `#1d3557` | MeshStandardMaterial emissive #58a6ff 0.1 |
| エージェント | PNG Billboard | SpriteMaterial (GhostSvg → PNG export) |

---

## タブ統合設計

### AgentTheaterPage の変更

```tsx
type TheaterView = "card" | "room" | "3d";   // "3d" 追加

// タブボタン
[部屋] [3D] [カード]

// 条件表示
{view === "room" && <PixelRoomView ... />}
{view === "3d"   && <Room3DView   ... />}
{view === "card" && <div>...</div>}
```

デフォルト: `"room"` (既存維持)

### Layout.tsx の変更

`controlCenter` ブロックの統合ビューに `Room3DView` を条件追加:

```tsx
// 統合 body 内 (Room3DView は今のところ tab 切り替えのみ)
// PXR-05D で直接埋め込みを検討
```

---

## Safety 設計

```
display-only:         3D シーンに実行ボタンなし
Safety HUD overlay:   <Html> で 2D HUD を 3D 空間に重ね表示
                      execution/productionReady/Gate 常時表示
no IPC:               3D ビューは新しい IPC を追加しない
no runtime action:    カメラ固定、クリック動作なし
```

---

## PXR-05 完了条件 (全フェーズ)

```
PXR-05A [ ] 設計書完成 (本ファイル)
PXR-05A [ ] 依存計画完成
PXR-05B [ ] 人間 GO → npm install 実施
PXR-05B [ ] R3F 最小 Canvas (Canvas + 床のみ) が表示される
PXR-05C [ ] 床・壁・5デスク・台座が表示される
PXR-05C [ ] 5エージェント (Sprite/Billboard) が配置される
PXR-05D [ ] Safety HUD overlay 表示
PXR-05D [ ] decision 変化 → エージェント色/状態反映
PXR-05D [ ] typecheck PASS
PXR-05D [ ] display-only 確認
```

---

## PXR-06 (将来)

```
自由視点 (OrbitControls)
カメラプリセット (しきしま視点 / 俯瞰 / etc.)
注意: 安全ラベルの視認性確保が条件
```

---

## 実装順序

```
PXR-05A ← 今ここ (docs)
PXR-05B ← 人間 GO 待ち (package install)
PXR-05C ← PXR-05B 完了後
PXR-05D ← PXR-05C 完了後
PXR-06  ← PXR-05D + 人間判断後
```
