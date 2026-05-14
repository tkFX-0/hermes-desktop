export default {
  title: "ツール",
  web: {
    label: "Web検索",
    description: "Webを検索してURLからコンテンツを取得",
  },
  browser: {
    label: "ブラウザー",
    description: "Webページのナビゲート、クリック、入力、操作",
  },
  terminal: {
    label: "ターミナル",
    description: "シェルコマンドとスクリプトを実行",
  },
  file: {
    label: "ファイル操作",
    description: "ファイルの読み書き、検索、管理",
  },
  code_execution: {
    label: "コード実行",
    description: "PythonとシェルコードをAIが直接実行",
  },
  vision: { label: "ビジョン", description: "画像と視覚的コンテンツを分析" },
  image_gen: {
    label: "画像生成",
    description: "DALL-Eなどで画像を生成",
  },
  tts: { label: "テキスト読み上げ", description: "テキストを音声に変換" },
  skills: {
    label: "スキル",
    description: "再利用可能なスキルの作成・管理・実行",
  },
  memory: {
    label: "メモリー",
    description: "永続的な知識を保存・呼び出し",
  },
  session_search: {
    label: "セッション検索",
    description: "過去の会話を横断検索",
  },
  clarify: {
    label: "確認質問",
    description: "必要に応じてユーザーに確認",
  },
  delegation: {
    label: "委任",
    description: "並列タスク用のサブエージェントを生成",
  },
  cronjob: {
    label: "Cronジョブ",
    description: "スケジュールタスクの作成と管理",
  },
  moa: {
    label: "エージェント混合",
    description: "複数のAIモデルを連携",
  },
  todo: {
    label: "タスク管理",
    description: "複雑なタスク用のToDoリストを作成・管理",
  },
  mcpServers: "MCPサーバー",
  mcpDescription: "config.yamlで設定されたModel Context Protocolサーバー。ターミナルで<code>hermes mcp add/remove</code>で管理。",
  http: "HTTP",
  stdio: "stdio",
  disabled: "無効",
} as const;
