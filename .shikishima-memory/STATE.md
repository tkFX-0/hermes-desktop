# STATE.md — しきしまプロジェクト現在状態

このファイルは、しきしまプロジェクトの現在の実装状態を記録する core memory です。
SOUL.md / USER.md と同じく tk 承認制で、通常会話・Dreaming・recall・自動抽出では書き換えません。
過去会話や recall と現在状態が矛盾する場合は、この STATE.md と現在会話を優先します。

## 完了済み

- Phase 0-2: 完了。

## Phase 3 実装済み

- core記憶: SOUL.md / USER.md の常時ロード。
- Dreaming: propose-only 実装済み。候補は提案のみで、USER.md 反映は tk 承認後。
- recall: Discord thread store から read-only で過去文脈を検索。過去文脈は historical reference として扱う。
- SOUL安全ガードレール: 実装済み。安全境界・HOLD/GO/STOP・人格境界は自動学習で上書きしない。
- engine-fallback: 実装済み。枠切れ・一時失敗時に別エンジンへフォールバックする。
- operator-engine-select: 実装済み。tk のエンジン選択は許可し、人格・安全境界の変更は拒否する。
- report-mobile: 実装済み。/goal 完了レポートをモバイル向けに要約し、必要に応じて redacted attachment を使う。
- TokenTracker proactive fallback: 実装済み。allowlist された集計ファイルだけを read-only で参照する。

## Phase 3 残り

- T3-2: 会話引き継ぎ品質の強化。
- T3-4: しずめの構造化レビュー強化。
- Dreaming定期実行: 未実装。現時点ではオンデマンド review / propose-only。

## §7 封印中

- StackChan: HOLD。明示的な解除GOまで、音声・STT・物理操作・モニターは封印。
- FX/MT5: HOLD。自動売買・相場論評・MT5連携は封印。
