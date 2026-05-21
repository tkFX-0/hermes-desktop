# Ichikishima Control Center — Room 構成（V0 / 文書のみ）

**機械モデル（2026-05-03）**: `src/main/ichikishima/control-center/control-center-rooms.ts` の `ControlCenterRoomId` / `buildControlCenterRoomsSnapshot`。本文の論理名と **可能な限り一致**；文言の正は **`disabledReason` プレフィックス**をコードで確認。

各 Room は **ナビゲーションの単位**であり、V0 では画面は存在しない。将来の UI で **タブまたはサイドバー**に対応させる。

---

## Hermes Room（作業工房）

**目的**: Hermes 側の「今何をしているか」を非エンジニアにも分かる語彙で示す。

| 表示要素 | 内容 |
|----------|------|
| Hermes 状態 | idle / running / blocked / error（説明は短文） |
| Local Pilot 状態 | 未接続 / ready / running / completed |
| Bridge Pilot 状態 | 将来: `HERMES_BRIDGE_PILOT_READY` まで。V0 は「未実装」 |
| 現在タスク | タイトル、経過時間、関連 readiness |
| read/write 件数 | Zone 内の成功回数（**本文は出さない**） |
| blocked 操作 | delete / execute / network / git の **件数のみ**。参考実装: `blockedOperationApproxCount`（Local Pilot の要約ベース近似） |
| latest report | 最新 Hermes 風変更レポートの **要約1行 + リンク先パス概念** |
| Start / Stop | **許可された runner のみ**。危険操作の開始ボタンは置かない |

**禁止**: 「Execute」「Delete」「Network」「Git」「MT5」を直接起こすボタン。

---

## Ichikishima Room（審査・沈黙・寄り添い）

**目的**: イツキシマのモードと **発話しない**原則を可視化。

| 表示要素 | 内容 |
|----------|------|
| Shadow Mode | 準備済み／限定動作など |
| Review Mode | 直近判定、risk、missing checks |
| Speak Value | スコア或いは区分（詳細仕様は既存 SPEC へリンク） |
| Silence Gate | 発話可否の論理状態 |
| `shouldSpeak:false` | **明示表示**（自動発話は禁止のまま） |
| Review 結果 | 短文サマリー、推奨アクション語（approve/hold/reject は **ユーザー決定**） |
| Memory candidate | **候補数とカテゴリ**のみ。本文は別モーダルでもマスク済みのみ |

---

## Approval Room（承認の待合室）

| 状態 | UI メッセージの例 |
|------|-------------------|
| pending | 判断待ち |
| held | 保留 |
| rejected | 却下済み記録 |
| approved | **実行許可の記録のみ** |
| approved not executed | **明示**: まだ実行エンジンに渡していない |

| 機能（将来） |
|--------------|
| approval report viewer（Markdown / JSON は **マスク済み描画**） |
| approve / reject / hold は **状態遷移要求**としてのみ（実行は別 Goal） |

---

## Audit Room（監査タイムライン）

| 表示 | ルール |
|------|--------|
| タイムライン | `kind`、時刻、`riskLevel`、短文 reason（マスク済み） |
| risk events | 高リスクのフィルタ |
| blocked ops | execute/network/git/delete blocked |
| read/write events | メタのみ（サイズやパスはマスクパス表示） |
| approval events | `approval_queue_*` など |
| masking status | 「本文なし」「マスク済み」のバッジ |

**禁止**: 生ログ全文、環境依存絶対パスの羅列、トークン列。

---

## Memory Room（候補のみ）

| 表示 | 内容 |
|------|------|
| memory candidates | 件数・カテゴリ |
| project_memory 候補 | 一覧（要約のみ） |
| long-term profile 候補 | 同上 |
| safety policy 候補 | 同上 |
| forbidden / rejected | 件数のみ推奨（内容は最小限か伏せる） |

**禁止**: 「DB に保存」「自動昇格」ボタン（V6 より前）。

---

## Visualization Room（将来）

| 項目 | 方針 |
|------|------|
| Hermes Flow | React Flow 候補。タスク/ファイル/失敗ノード |
| Ichikishima Ambient | R3F / Three.js 候補。沈黙・寄り添いの比喩 |
| Agent status | 各論理エージェントの health |

**V0**: 仕様のみ。資産・ライブラリ選定は Implementation Plan で段階化。

---

## Escalation Room（方針表示のみ）

| 表示 | 内容 |
|------|------|
| ローカル / クラウド | **方針の説明文**のみ（既存 LOCAL_CLOUD_ESCALATION_POLICY との整合） |
| Cursor / GPT / Claude | **候補**として列挙。ワンクリック送信はしない |
| 渡してよい情報 | メタ・アウトライン・マスク済み |
| 渡してはいけない情報 | secrets、生ログ、個人情報、取引履歴 |

**V0**: **外部送信なし**。説明用テキストのみ。

---

## 関連文書

- `CONTROL_CENTER_SPEC.md`
- `CONTROL_CENTER_ARCHITECTURE.md`
- `CONTROL_CENTER_PIPELINES.md`
- `CONTROL_CENTER_IMPLEMENTATION_PLAN.md`
