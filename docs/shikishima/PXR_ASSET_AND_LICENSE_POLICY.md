# PXR — アセット & ライセンス ポリシー

**Prepared:** 2026-05-19
**Worker:** ClaudeCode (docs-only)
**Status:** Policy — PXR-04 実装前のアセット Gate 判断ガイド

---

## 概要

PXR-01〜03 は画像アセットを使わない (CSS + SVG + emoji のみ)。
PXR-04 以降でスプライト画像を導入する場合、このポリシーに従う。

---

## アセット Gate — PXR-04

PXR-04 は独立した Gate。以下の全条件を満たした場合のみ人間が GO を出す。

```yaml
pxr_04_asset_gate:
  gate_id:    PXR-04
  gate_name:  Sprite Asset Gate
  status:     HOLD
  conditions:
    - [ ] ライセンス確認済み (CC0 / OFL / 自作 のいずれか)
    - [ ] アセット出所明記 (URL または自作証跡)
    - [ ] 商用利用可確認 (もし商用展開する場合)
    - [ ] ファイルサイズ確認 (< 200KB / sprite sheet)
    - [ ] 人間 visual 確認 PASS
    - [ ] 人間 GO 明示
```

---

## 現在の代替手段 (PXR-01〜03)

| 要素 | 実装方法 | 理由 |
|---|---|---|
| エージェント本体 | `GhostSvg` 既存 SVG コンポーネント | ライセンスフリー・既存資産 |
| 家具・装飾 | CSS の `::before` / `::after` + `div` | 画像不要 |
| ランプ・インジケーター | CSS `border-radius` + `box-shadow` | 画像不要 |
| 文字ラベル | IBM Plex Mono (Google Fonts OFL) | ライセンス確認済み |
| アイコン | `lucide-react` (既存 import) | MIT ライセンス済み |

---

## 将来アセット候補 (参考)

以下は候補であり、Gate GO まで実装しない。

| カテゴリ | 候補 | ライセンス | 確認状態 |
|---|---|---|---|
| ピクセルキャラクター | 自作 (Aseprite 等) | 自作 | 未作成 |
| ピクセルキャラクター | itch.io フリー素材 | 要確認 | 未確認 |
| 背景タイル | Kenney.nl (CC0) | CC0 | 候補のみ |
| フォント (ピクセル系) | Press Start 2P (Google Fonts) | OFL | 候補のみ |

> **重要:** 上記は候補リストであり、PXR-04 Gate GO の承認なしに実装してはならない。

---

## ファイル管理ルール

```
src/renderer/src/assets/pxr/     ← PXR-04 以降のアセットのみ格納
  sprites/                       ← スプライト画像
  tiles/                         ← 床・壁タイル
  LICENSE.txt                    ← 各ファイルのライセンス出所明記必須
```

PXR-04 Gate GO までこのディレクトリは作成しない。

---

## ライセンス確認チェックリスト (PXR-04 実施時)

```
[ ] アセット名:
[ ] 出所 URL:
[ ] ライセンス種別: CC0 / CC-BY / OFL / MIT / 自作
[ ] 帰属表記要否: 要 / 不要
[ ] 商用利用可否: 可 / 不可 / 要確認
[ ] 改変可否: 可 / 不可
[ ] 確認日:
[ ] 確認者:
```

---

## 安全原則

```
- PXR-01〜03 は画像アセットゼロで実装する
- 外部フォント追加は package 変更になるため Level 4 扱い
- アセット追加は PXR-04 Gate 承認後のみ
- ライセンス未確認のアセットは使わない
- "見た目のため" にライセンス確認を省略しない
```
