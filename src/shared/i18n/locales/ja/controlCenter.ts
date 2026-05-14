export default {
  shell: {
    title: "管制センター（読み取り専用）",
    subtitle:
      "しきしまダッシュボード（表示のみ）。この画面からアクションは実行されません。",
    mainLandmarkLabel: "管制センター 読み取り専用ダッシュボード",
    loading: "スナップショット読み込み中…",
    refresh: "スナップショットを更新（読み取り専用）",
    refreshAria: "読み取り専用IPCでスナップショットを更新",
    unavailable: "管制センタースナップショットが利用できません。",
    readOnlyIpcFailed: "読み取り専用IPCが失敗しました。",
    noActionsExecuted: "アクションは実行されていません。",
    productionNotReady: "本番準備未完了（読み取り専用基盤）。",
    emptyState: "スナップショットデータがありません。",
    parseError: "スナップショット検証に失敗しました。",
    rooms: "ルーム一覧",
    roomActions: "操作（すべて無効）",
    global: "概要",
    statusAtAGlance: "ステータス一覧",
    blockersShort: "ブロッカー",
    warningsShort: "警告",
    nextRecommendedGoalShort: "次の推奨ゴール",
    operationalHints:
      "運用ヒント（読み取り専用・ライブ実行ステータスではありません）",
    readinessSafetyBanner:
      "表示のみ — 準備状態ラベルは非実行レビュー状態です。READY_* の値は実行・GO・productionReady を承認しません。判定: HOLD（decision）/ 実行状態: disabled（execution）/ 本番準備: false（productionReady）",
    bridgeReadinessHint: "非実行設計ラベル — GOまたは実行承認ではありません",
    scenarioSuiteHint: "非実行ラベル — productionReadyではありません",
    pilotMetaHint: "実行承認ではありません — HOLDが現在の状態です",
    controlledPilotLabel: "コントロールパイロット",
    controlledPilotHint:
      "設定値/プリフライト待ち — ライブパイロット実行ではありません — 実行承認ではありません",
    realHermesLabel: "実Hermesプロセス",
    realHermesHint: "未起動 — 読み取り専用UIにライブHermesはありません",
    wslWrapperLabel: "WSL2ラッパー",
    wslWrapperHint: "設計/パス保留中 — wsl.exeはここでは実行されません",
    schedulerHint: "スケジューラーはドライランポリシーで停止中",
    manualRefreshOnly: "手動更新のみ。自動ポーリングなし。",
    blockers: "ブロッカー",
    warnings: "警告",
    nextGoal: "次の推奨ゴール",
    agentTeam: "エージェントチーム（ドライラン）",
    scheduler: "スケジューラー",
    schedulerOff: "無効",
    schedulerUnexpected: "予期しない状態",
    visualization: "可視化（メタ）",
    approvalAudit: "承認 / 監査（サマリー）",
    memory: "メモリー候補（サマリー）",
    hints: "ステータスヒント",
    counts: "概算カウント",
    errorTitle: "管制センターを読み込めませんでした",
    packagingNote:
      "パッケージ化されたprojectRootが確認されるまで、スナップショットソースは開発向けです。productionReadyはfalseのままです。",
    snapshotSource: {
      title: "スナップショット情報（読み取り専用）",
      runtimeMode: "ランタイムモード",
      sourceLabel: "ソースラベル",
      pathStatus: "パス解決状態",
      pendingPackaging: "パッケージ化パス解決保留中",
      linesTitle: "安全なシグナル（絶対パスなし）",
      runtimeDev: "開発モード（未パッケージレイアウト）",
      runtimePackagedPending: "パッケージ化済み（パス解決保留中）",
      labels: {
        development_snapshot_dev_only_source:
          "開発スナップショット / 開発専用ソース",
        packaged_snapshot_path_resolution_pending:
          "パッケージ化スナップショット — パス解決保留中",
      },
      pathStatusLabels: {
        dev_repo_layout_ok: "開発リポジトリレイアウトを検出",
        dev_repo_layout_marker_missing: "docs/ichikishimaマーカーがありません",
        packaged_unverified_fallback_layout:
          "パッケージ化フォールバックレイアウト（未検証）",
        zone_outside_project_warning:
          "ゾーンパスがprojectRoot内に修正されました",
      },
    },
  },
} as const;
