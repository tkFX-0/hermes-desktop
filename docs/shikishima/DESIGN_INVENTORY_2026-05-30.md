# しきしま / StackChan 設計棚卸し INVENTORY

Date: 2026-05-30  
Baseline: Phase 0 計測 + 計画 Phase 0–7 統合

## 使い方

| 列 | 意味 |
|----|------|
| G/H | G=コード/検証可、H=人間GO要 |
| Status | open / mitigated / done / deferred |
| Phase | 計画フェーズ |

## Phase 0 ベースライン（記録）

| 項目 | 結果 | 時刻 |
|------|------|------|
| vitest `tests/hermes/zone/full-autonomy` | zone pass（Chisiki/SC-014 追加分含む） | 2026-05-30 |
| `wsl-dev-preflight` | `.shikishima-memory/wsl-dev-preflight-snapshot.json` | 2026-05-30 |
| Windows `agent` CLI | 未導入 / 未 login | snapshot |
| WSL `claude` login | 未 | snapshot |
| WSL `codex` | present, loggedIn | snapshot |

---

## StackChan（SC-###）

| ID | 種別 | 内容 | G/H | Phase | Status | 検証 |
|----|------|------|-----|-------|--------|------|
| SC-001 | コード欠陥 | `midNodTimer is not defined` in `stackchanSayInternal` | G | 1 | done | 行削除 |
| SC-002 | 運用 | voice pilot once 可聴 | H | 1 | done | 2026-05-31 voice-check · speak · pilot · 聴感確認 |
| SC-003 | 運用 | Discord 読み上げ経路 | H | 1 | done | 司令部短返信 + StackChan 読み上げ（運用確認） |
| SC-004 | docずれ | HOLD vs ORDERED resume 矛盾 | G | 1 | done | STACKCHAN_HOLD 注記 |
| SC-005 | 意図的HOLD | `SHIKISHIMA_STACKCHAN_HOLD=1` 解除 | H | 1 | done | 2026-05-31 `stackchan-resume` + preflight restart · 実機 2・3 PASS（人間GO） |
| SC-006 | 運用 | Bot 再起動 + 聴感 | H | 1 | done | preflight restart-dev + 聴感 2026-05-31 |
| SC-007 | 運用 | Cursor/判断/質問/プラン別 StackChan 通知 | G | 1 | done | operator-notify + hooks |
| SC-010 | docずれ | GATE_MATRIX voice 列 stale | G | 5 | done | 本ファイル参照 |
| SC-011 | 設計穴 | Display pilot 未実施 | H | 5 | deferred | time-window GO |
| SC-012 | 設計穴 | SC-FACE-04 320×240 asset | H | 5 | deferred | 人手 asset |
| SC-013 | 設計穴 | guarded route Bot facade | G | 5 | done | Phase1 queue · Phase2 `stackchan-guarded-facade.mjs` + Bot（2026-06-01）· Electron local は残 |
| SC-014a | 設計 | Discord voice 統合 doc + env ヘルパ | G | 5 | done | STACKCHAN_DISCORD_VOICE_UNIFICATION |
| SC-014b | コード | `stackchan-voice-config.mjs` | G | 5 | done | vitest voice-config |
| SC-014c | 設計穴 | 司令部 guarded bridge 試験 | H | 5 | deferred | Bot 未配線 |
| SC-015 | 設計穴 | STT firmware POST `/audio` | H | 5 | deferred | MIC plan |
| SC-016 | 設計穴 | `STT_SERVER_HOLD` / shadow STT | H | 5 | deferred | 憲法 GO |
| SC-017 | 設計穴 | SC-ROUTINE-CHECKIN-DRY-RUN | G | 5 | deferred | residual list |

### StackChan 横断

- **Legacy**: `scripts/shikishima-stackchan.mjs`（Bot 本番）
- **Guarded**: `sendStackChanVoiceOnce` / Display / Motion（pilot）
- **ACTIVE HOLD**: 音声・Discord VOICEVOX 読み上げ停止（自律実装優先）
- **env 単一参照**: `scripts/lib/stackchan-voice-config.mjs`

---

## Chisiki（CHI-###）— 調査のみ・オンチェーン H

| ID | 種別 | 内容 | G/H | Status | 参照 |
|----|------|------|-----|--------|------|
| CHI-001 | 調査 | 平易説明 brief | G | done | research/CHISIKI_PLAIN_LANGUAGE_BRIEF_2026-05-30.md |
| CHI-002 | 調査 | gasvault 採用候補（A/B/C） | G | done | CHISIKI_GASVAULT_ADOPTION_CANDIDATES |
| CHI-003 | 安全 | しずめ A/B/C 判定（推奨 A） | G | done | CHISIKI_SHIZUME_SAFETY_GATE |
| CHI-004 | 設計 | はじめ Jarvis マップ | G | done | CHISIKI_HAJIME_JARVIS_MAP |
| CHI-005 | 設計 | billing クォータ vault パターン（A） | G | done | BILLING_QUOTA_VAULT_PATTERN |
| CHI-C | 実装 | CKT・ウォレット・RPC 本番 | **H** | deferred | 人間 GO 質問票 C |

---

## しきしま（SHI-###）

| ID | 種別 | 内容 | G/H | Phase | Status | 検証 |
|----|------|------|-----|-------|--------|------|
| SHI-001 | 運用未検証 | SideBot preflight 再起動 | G | 2 | done | 2026-05-31: `--json` ok · `--clean --restart-dev` 手順確立 |
| SHI-002 | 運用 | workflow 空回し修正反映 | G | 2 | mitigated | `!workflow status` |
| SHI-003 | 運用 | しるべ Obsidian Vault 書き込み | G | 2 | done | vault-check + **live write 2026-05-31**（`obsidian-write-go` · しきしま/inbox · Daily） |
| SHI-004 | 運用 | 重複 Bot PID | G | 2 | done | `--clean` + vitest `full-autonomy-process-preflight` |
| SHI-005 | 運用 | `DISCORD_OPERATOR_USER_ID` | H | 2 | done | [DIS_05](DIS_05_DISCORD_MULTI_ROOM_DESIGN.md) — patch + `!multi-room-test` OK（対話6・通知送信）2026-05-31 |
| SHI-006 | doc | orchestratorRelaxed 監査 | G | 2 | done | 2026-05-31 `orchestrator-gates-audit` 緩和ON · loop可 · voice BLOCK |
| SHI-010 | 環境 | Windows `agent` CLI | H | 3 | partial | CLI あり · **`agent login` 人間作業** · WSL dev 可 · Phase B WF pilot `wf-mptwxo7l` done 2026-06-01（login 未実施のため partial 維持） |
| SHI-011 | 環境 | `.env.local` dev pipeline | G | 3 | done | `DEV_PIPELINE_ENABLED=1` |
| SHI-012 | 環境 | WSL `claude login` | H | 3 | done | preflight `wsl_claude_session_ok` |
| SHI-013 | 運用 | `!dev-pipeline` チェーン | G | 3 | done | Discord + WF dev ok 実績 |
| SHI-014 | 運用 | `!kaihatu-test` | G | 3 | done | zone vitest + 司令部可 |
| SHI-A1 | 意図的HOLD | 憲法 execution=enabled | H | 4 | deferred | Task1 報告のみ |
| SHI-A2 | 意図的HOLD | 本番 Discord 送信ループ | H | 4 | deferred | ORDERED gaps |
| SHI-A3 | 意図的HOLD | FX/EA 自動売買 | H | 4 | deferred | safety |
| SHI-A4 | 意図的HOLD | 無制限 24h コーディング | H | 4 | deferred | caps |

---

## 横断（X-###）

| ID | 種別 | 内容 | 対応 |
|----|------|------|------|
| X-001 | docずれ | MASTER_SPEC §1 全面 HOLD vs Phase E GO | §0 注記追加 |
| X-002 | 設計穴 | `productionReady` 二重定義（global vs Track D） | INVENTORY 注記 |
| X-003 | 設計穴 | gap-tracker CLOSED ≠ 本番安全 | G1–G8 対応表 |
| X-004 | docずれ | ちはや廃止後テスト/レジストリ 6体 | 5体化修正 |
| X-005 | docずれ | DEV_PIPELINE「agent login 済み」 | preflight で要再検証 |

---

## gap-tracker G1–G8 対応

| Gap | タイトル | INVENTORY |
|-----|----------|-----------|
| G1 | Voice / StackChan | SC-001–007, SC-005 HOLD |
| G2 | Phase 8–9 burn-in | deferred |
| G3 | Real execution / Track D | SHI-A1, X-002 |
| G4 | SideBot HOLD | SHI-001 |
| G5 | Obsidian write | SHI-003 |
| G6 | Governor caps | SHI-006, mitigated |
| G7 | Firmware pcmBuf | deferred |
| G8 | Hermes subprocess / STT | SC-015–016 |

---

## Phase 7 長期 deferred

- Control Center AT-10〜14
- Level 3 前提 11 件
- Ichikishima 実 Hermes / packaged smoke
- Grok x_search 本番

---

## 完了チェック（棚卸しプロジェクト）

- [x] INVENTORY 初版（本ファイル）
- [x] SC-001 midNodTimer 修正
- [x] SC-004 / SC-010 doc
- [x] X-004 テスト 5体化
- [x] Phase 0.3 vitest 全 pass
- [x] SC-005?006 部分完了: resume + preflight restart-dev (2026-05-31)
- [x] SHI-001–004 / 006 運用検証ログ追記（2026-05-31）
- [x] SHI-005 `DISCORD_OPERATOR_USER_ID` + `!multi-room-test` OK（2026-05-31）

### SHI-001 / SHI-004 運用メモ（2026-05-31）

```powershell
# 診断のみ（SideBot 停止しない）
node scripts/shikishima-process-preflight.mjs --json

# 重複解消 + 再起動（人間テスト GO 後）
node scripts/shikishima-process-preflight.mjs --clean --restart-dev
```

- `--restart-dev` は `--clean` 必須。electron-vite 稼働中は **standalone** `shikishima-bot.mjs` を起動（`botCount=0` 回避）。
- Discord からの同等経路: `scripts/lib/discord-bot-restart.mjs` → 上記 argv。
