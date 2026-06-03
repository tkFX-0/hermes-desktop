# Shikishima App Independence Architecture
date: 2026-05-15
status: design_draft — direction confirmed, implementation not approved

---

## 1. Current State

```text
hermes-desktop (one Electron app)
  ├─ Hermes Core / shared engine
  ├─ Existing Hermes features (Chat, Sessions, Agents, Skills, etc.)
  └─ しきしま Control Center — currently being added as an extension
```

しきしまは現在、Hermes Agentアプリの「増築」として存在している。
将来は、この関係を逆転させる。

---

## 2. Target Architecture (将来)

```text
しきしま Desktop App
  ├─ 顔・管制塔 (Control Center)
  ├─ iPhone Private Console
  ├─ GO / HOLD / STOP UI
  ├─ 証跡・セッション管理
  ├─ エージェントダッシュボード
  └─ Hermes Core を心臓・脳として使う

Hermes Core (共通エンジン)
  ├─ 共通思考・状態管理
  ├─ Agent基盤
  ├─ 安全ゲート (しずめ層)
  └─ 各Appへのアダプタ提供

Hermes Worker (作業エンジン)
  ├─ Codex / ClaudeCode 連携
  ├─ 実装作業支援
  └─ タスク実行補助
```

**世界観の整理:**
- `Hermes Core` = 心臓・脳・共通エンジン
- `しきしま` = 顔・管制塔・操作UI（上位の管制アプリ）
- `Hermes Worker` = 作業者・実装エンジン

しきしまの下にHermes Coreがいる、という関係が最終形。

---

## 3. Migration Phases

### Phase A — 現状維持しながら分離準備（現在進行中）

```text
hermes-desktop (現状のまま)
  src/shared/mobile-console/     ← 既に実施済み
  src/shared/shikishima/         ← 今後ここに寄せる
  src/main/mobile-console/       ← 既に実施済み (独立モジュール)
  src/renderer/screens/
    ├─ ControlCenterAppShell/    ← しきしま管制UI
    └─ MobileConsole/            ← しきしまモバイルUI
```

**Phase A でやること:**
- `src/shared/mobile-console/` に型・snapshot・redaction を集める（済）
- `src/main/mobile-console/` を独立モジュールとして維持（済）
- UIを `ControlCenter/` と `MobileConsole/` に閉じる（済）
- エージェント定義を canonical 名でdocsに明記（済）
- 将来独立予定であることをdocsに明文化（このファイル）

**Phase A でやらないこと:**
- repo分割
- package分割
- electron-builder大改造
- app名・起動経路の変更
- Hermes既存機能の削除

### Phase B — Coreを共通パッケージ化（将来）

```text
packages/
  ├─ hermes-core/          ← Hermes Coreを切り出す
  ├─ shikishima-core/      ← しきしま固有のビジネスロジック
  ├─ shikishima-agent-model/  ← canonical agent定義
  └─ shikishima-safety/    ← しずめ / 安全ゲート
```

Hermes CoreをElectronアプリ本体から切り離し、共通エンジンとして扱う。

### Phase C — しきしまAppを独立（将来）

```text
apps/
  ├─ shikishima-desktop/        ← しきしまメインApp
  ├─ shikishima-mobile-console/ ← iPhone PWA
  └─ hermes-worker/             ← 実装・作業エンジン
```

この段階で初めて「しきしまは独立App、HermesはCore/Engine」という形になる。

---

## 4. Design Separation Principles (今すぐ適用)

### しきしまUIを明確に分離

```text
OK now:
  src/shared/mobile-console/     しきしまスナップショット型
  src/shared/shikishima/         将来: canonical agent型・safety型
  src/main/mobile-console/       独立モジュール
  src/renderer/screens/ControlCenterAppShell/
  src/renderer/screens/MobileConsole/

NG now:
  Hermes既存screens/コンポーネントへの混在
  package.json の大規模変更
  repo分割
```

### main processの分離方針

```text
src/main/
  ├─ index.ts                    Electron起動・IPC登録の中心
  ├─ mobile-console/             しきしま専用: IPC + localhost server
  ├─ ichikishima/                しきしま専用: agent / control center
  └─ (hermes/ etc.)              既存Hermes機能
```

### shared層への集約

```text
src/shared/
  ├─ mobile-console/             モバイルConsole型・snapshot・redaction
  ├─ ichikishima/                Control Center IPC contract
  └─ i18n/                       多言語
```

---

## 5. Technical ID vs Canonical Name Separation

内部実装はtechnical IDを維持する。
UI・docs・世界観表現ではcanonical名を使う。

```text
technical_id (source)   canonical (UI/docs)
──────────────────────────────────────────
hermes_worker           Hermes Core
supervisor              しきしま
ichikishima_reviewer    いちきしま
approval_guardian       しずめ
suppressive_agent       しずめ
audit_keeper            しるべ
visualization_observer  しるべ
execution_planner       むすび
research_agent          むすび
memory_curator          つむぐ
```

---

## 6. Independence Prerequisites (独立前に必要なもの)

Phase C（独立）に入る前に必要な条件:

```
[ ] shared/mobile-console/ に全型が集約済み
[ ] shared/shikishima/ にcanonical agent型が集約済み
[ ] main/mobile-console/ が完全独立モジュール
[ ] Control Center / Mobile Console が他機能と依存なし
[ ] Hermes既存機能との interface が明確に分離済み
[ ] Phase 2C same-LAN iPhone確認完了
[ ] B3 5/5 + Level 3 GO取得済み
[ ] 人間が独立アーキテクチャGOを明示発行
```

---

## 7. Docs Update Plan

Independence archが進む都度、以下を更新する:

```
docs/shikishima/SHIKISHIMA_OVERALL_DESIGN.md
docs/shikishima/ROADMAP_CHANGELOG.md
docs/shikishima/DEVELOPMENT_TEMPO_DASHBOARD.md
```

---

## 8. Safety Invariants (independence architecture に関わらず不変)

```text
decision:         HOLD
execution:        disabled
productionReady:  false
rawValuesReported: false
Level 3:          not approved
```

これらは独立アーキテクチャへの移行中も絶対に変わらない。

---

この範囲では問題を検出していません
