# Ichikishima Control Center — アーキテクチャ（V0 / 文書のみ）

**前提**: 中核は **hermes-desktop と独立した Windows アプリ**。hermes-desktop は **参考** に留め、**依存・取り込み・設計コピー禁止**（`CONTROL_CENTER_SPEC.md`）。

**App Management Foundation（read-only・参照実装）**: `control-center-app-snapshot.ts` / `control-center-readonly-ipc.ts`。**preload 恒久配線・実 Hermes 起動無し**。詳細 **`CONTROL_CENTER_APP_MANAGEMENT_FOUNDATION_SPEC.md`**。

---

## 1. レイヤ構成

```text
+-------------------+
|   Presentation    |  ← 将来: Electron / Tauri / WebView2 / ブラウザ
|   (V0: 未定)      |
+-------------------+
         │ HTTP/IPC (将来)
+-------------------+
|   Application      |  ← ユースケース: Pilot 実行要求、レポート生成要求
|   (将来)           |
+-------------------+
         │
+-------------------+
|   Domain Adapters  |  ← Zone / Approval / Audit / Review / Memory
|   (Hermes+Ichi     |    （論理インタフェースのみ V0）
|    プロジェクト側  |
|    のAPIに接続）   |
+-------------------+
```

- **フロントエンドとバックエンドを分離**する。最初期はバックエンドを **単一プロセス（例: FastAPI または同等）** とし、フロントはその API / WebSocket にだけ依存する形を推奨候補とする。
- **main process が UI と一体**になる Electron 単体案もありうるが、長期的には「表示」と「処理」を split した方が承認・監査境界の説明がしやすい。
- **hermes-desktop には `control-center-status.ts`** があり、`ControlCenterReadonlyStatusModel` と `ICHIKISHIMA_READONLY_DOC_PATHS` で **読取専用スナップショット契約**を別アプリ実装の参照にできる（リポ間の npm 依存は不要）。

---

## 2. フロントエンド候補の比較（V0 は比較のみ）

| 候補 | 実装しやすさ | Windows 相性 | ローカルファイル | 将来可視化 | セキュリティ | 依存の重さ | 備考 |
|------|-------------|--------------|------------------|------------|--------------|------------|------|
| Electron + React | 高い | 高い | 高い（main で fs も触れやすいが **危険**なので封印） | R3F/Flow と相性良 | attack surface 大／更新責務重い | **重い** | 開発体験は良い。**raw fs は renderer に渡さない**設計が必須 |
| Tauri + React | 中〜高 | 高い | 中（Rust 側に寄せる） | 可 | 比較的小さめ | **軽め** | Windows ビルドは要検証 |
| WebView2 + ローカル FastAPI | 中 | 高い（Win ネイティブ） | 中（API 経由） | 可 | OS 更新に追従 | 中 | 企業内/個人向けに素直 |
| FastAPI + ブラウザ UI | 高い | 高い | 中 | 可 | ローカルホスト閉域前提 | **軽い** | いちばん早い V1 プロト候補 |

**V0 の方針**: 上表を前提に、**実装時（V1）に再選定**。個人利用・ローカルファースト・承認境界の説明のしやすさを重視する。

---

## 3. バックエンド構成（論理モジュール）

バックエンドは **1 サービスにまとめる**想定（マイクロ分割は V2 以降で可）。

| 論理 API 名 | 役割 |
|-------------|------|
| `ZoneApi` | `readZoneFile` / `writeZoneFile` 等。**raw `fs` 禁止** |
| `ApprovalQueueApi` | キュー一覧、項目詳細（マスク済み）、状態遷移リクエスト（将来・承認後も実行は別） |
| `AuditLogApi` | マスク済みイベント列、日付別ファイルメタ、要約 |
| `ReviewModeApi` | Hermes レポート文字列/構造化入力の審査結果 |
| `MemoryCandidateApi` | 候補抽出結果の表示。**DB 永続化なし** |
| `LocalPilotRunnerApi` | Sandbox 限定の dummy タスク実行（将来） |
| `HermesBridgePilotApi` | 実 Hermes 接続後の限定パス（**V0/V1 では未接続**） |
| `StatusApi` | Readiness バッジ用の集約ステータス |
| `StopAllApi` | 論理エージェント・runner の停止要求（**シグキル等の危険な汎用 kill は設計に含めない**。あくまで「許可された runner の停止」） |

既存の **Ichikishima / Hermes コア**は **別リポジトリまたは別パッケージ**として、このバックエンドから **公式に許可された境界**越しにだけ呼ぶ。

---

## 4. データフロー（概念）

1. **Hermes 出力**（レポート）→ Review Mode → Approval Report / Queue 候補  
2. **Zone 操作** → Audit 事件（マスク）  
3. **Memory** → 候補のみ表示、昇格は別プロセス  
4. **Control Center** は上記を **表示と「安全な要求」のパス**に限定

---

## 5. 配置と hermes-desktop の関係

| 関係 | 説明 |
|------|------|
| 参考 | 部屋概念、エージェント稼働感、レポートの見せ方 |
| 禁止 | リポジトリ依存、コードコピー、同一 main プロセスへの合体 |

---

## 6. セキュリティ境界（再掲）

- Presentation 層に **シークレット・生パス・生コマンド**を渡さない。
- すべて **バックエンドがマスク・ACL・Zone 検証**した結果だけを返す。

---

## 関連文書

- `CONTROL_CENTER_SPEC.md`
- `CONTROL_CENTER_ROOMS.md`
- `CONTROL_CENTER_PIPELINES.md`
- `CONTROL_CENTER_IMPLEMENTATION_PLAN.md`
