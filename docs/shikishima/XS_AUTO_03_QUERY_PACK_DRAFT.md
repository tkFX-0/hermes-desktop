# XS-AUTO-03 Query Pack Draft

gate: XS-AUTO-03
status: DRAFT — human GO required before execution
x_oauth_required: false
xacc_status: HOLD

## 重要: XS-AUTO と XACC の区別

このクエリパックは XS-AUTO (read-only 調査) 専用。
X アカウント OAuth / API は不要。XACC-01 は HOLD 維持。

ユーザー提供テキスト・公開 URL であれば OAuth なしで調査可能。

## Query Themes

### Theme 1: StackChan Voice Integration
| 項目 | 内容 |
|---|---|
| query | "StackChan voice" OR "StackChan TTS" OR "StackChan 音声" |
| purpose | SC-AI-00/01 voice route の実装事例調査 |
| expected source | GitHub / Zenn / Qiita / ユーザー提供 X テキスト |
| risk | LOW — 公開情報のみ |
| X OAuth needed | false |
| recommended first | YES |

### Theme 2: StackChan Speech Push API
| 項目 | 内容 |
|---|---|
| query | "StackChan speech" OR "StackChan push API" OR "VOICEVOX StackChan" |
| purpose | 音声プッシュ API の実装方法調査 |
| expected source | GitHub README / 公式ドキュメント |
| risk | LOW |
| X OAuth needed | false |

### Theme 3: StackChan Discord Bot Integration
| 項目 | 内容 |
|---|---|
| query | "StackChan Discord" OR "StackChan Bot" |
| purpose | Discord Bot と StackChan を連携する先行事例調査 |
| expected source | GitHub / ユーザー提供 X テキスト |
| risk | LOW |
| X OAuth needed | false |

### Theme 4: StackChan TTS / VOICEVOX
| 項目 | 内容 |
|---|---|
| query | "StackChan VOICEVOX" OR "StackChan TTS integration" |
| purpose | VOICEVOX を使った TTS 実装の調査 |
| expected source | GitHub / Zenn |
| risk | LOW |
| X OAuth needed | false |

### Theme 5: StackChan Camera / Monitoring
| 項目 | 内容 |
|---|---|
| query | "StackChan camera" OR "StackChan monitoring camera" OR "CoreS3 camera" |
| purpose | SC-CAM-00/01 実装事例調査 |
| expected source | GitHub / 公式ドキュメント |
| risk | LOW |
| X OAuth needed | false |

### Theme 6: Shikishima Autonomous Operation Safety
| 項目 | 内容 |
|---|---|
| query | "AI agent safety" OR "autonomous agent gate" OR "human-in-the-loop AI" |
| purpose | しきしま Level 5 安全設計の参考事例収集 |
| expected source | 公開記事 / 研究論文 / ブログ |
| risk | LOW |
| X OAuth needed | false |

## Execution Rules

- 1 クエリにつき 1 run のみ
- source が login 要求 → 即停止
- write アクション誘発 → 即停止
- 結果は evidence file に保存
- gate を HOLD に復帰

## Note

X OAuth は不要。
ユーザーが提供した X 投稿テキストは MANUAL_REPORTED として扱う。
XACC-01 (X Account OAuth) は HOLD 維持。

_Created: 2026-05-21_
