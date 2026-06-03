# Visualization V1 — 実装 SPEC（メタモデルのみ）

**状態**: **`buildVisualizationV1ReadonlyModel` 到達**。**レイアウトエンジン・Electron・HTTP 無し**。

---

## 1. 目的

Control Center と Agent Team の **状態をノード／エッジの短文ラベル**で表現し、将来的にグラフ UI へ載せられる **安全な入力**だけを用意する。

---

## 2. 含めない

- stdout/stderr/payload/process handle/secrets/raw path 列挙/API 一覧

---

## 3. 正

| 関数 | 役割 |
|------|------|
| `buildVisualizationV1ReadonlyModel` | 集約 read-only メタのみ |
| `buildAgentTeamVisualizationNodes` | エージェント節点ラベルのみ |

---

## 4. pending

| 項目 | status |
|------|--------|
| 座標レイアウト | deferred |
| ライブストリーム | STOP GATE |

関連: `AGENT_TEAM_FOUNDATION_SPEC.md`、`AGENT_VISUALIZATION_IMPLEMENTATION_PLAN.md`
