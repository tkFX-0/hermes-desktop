# Human GO 境界一覧（しきしま完全自律）

Date: 2026-05-31  
Status: 運用正本 — **進捗 100% でもこれらは自動解除しない**

関連: [FULL_AUTONOMY_MASTER_DESIGN_2026-05-31.md](FULL_AUTONOMY_MASTER_DESIGN_2026-05-31.md) §5 · [AUTONOMY_55_TO_100_CURSOR_PLAYBOOK_2026-05-31.md](AUTONOMY_55_TO_100_CURSOR_PLAYBOOK_2026-05-31.md)

---

## 到達したら必ず停止して人間に確認

| ゲート | 内容 | 解除手段 |
|--------|------|----------|
| 憲法 execute | `execution=enabled` | 別 GO ファイル + 明示承認（SHI-A1） |
| git push | リモート反映 | 明示指示のみ |
| CHI-C | ウォレット・CKT・RPC 本番 | 質問票 C は方針のみ · 実装は別 GO |
| StackChan 常時発話 | 無制限 VOICEVOX / Discord 読み上げループ | `stackchan.voice` + 聴感 + ゲート |
| Obsidian 実書き込み | E3b live write | constitutional scope + 人間 |
| Portfolio→対話 自動転送 | `SHIKISHIMA_PORTFOLIO_DIALOGUE_G=1` | 司令部テスト GO 後のみ |
| 24h 無制限コーディング | キュー常時消化 | SHI-A4 · caps 維持 |
| W6 Jarvis C/D | 生活読取・金融執行 | deferred |

---

## 通常運用で許可（cap 付き）

- `decision=HOLD` のまま SideBot + orchestrator + workflow keepalive
- `!workflow done` / `!workflow continue`（人間 ack）
- WSL dev pipeline（subscription-first）単発タスク
- discord.read（送信なし）
- Obsidian dry-run
- agent-team local-only tick

---

## 日常確認

```powershell
node scripts/shikishima-autonomy-status.mjs
node scripts/shikishima-human-go-readiness.mjs
```

Discord: `!human-go` · `!autonomy progress`
