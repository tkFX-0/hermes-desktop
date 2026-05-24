// Conversation Context — しきしまの会話記憶
// 問題: Discordの各メッセージが独立したクエリになり文脈が途切れる
// 解決: 直近N件の会話を保持し、全クエリのプレフィックスに含める

export interface ConversationTurn {
  userMessage: string;
  agentReply: string;
  agentId: string;
  timestamp: number;
}

const MAX_TURNS = 5;         // 保持する会話ターン数
const MAX_CHARS_PER_TURN = 200; // 各ターンの最大文字数

const _history: ConversationTurn[] = [];

export function addTurn(userMessage: string, agentReply: string, agentId: string): void {
  _history.push({
    userMessage: userMessage.slice(0, MAX_CHARS_PER_TURN),
    agentReply: agentReply.slice(0, MAX_CHARS_PER_TURN),
    agentId,
    timestamp: Date.now(),
  });
  // 古い履歴を削除
  while (_history.length > MAX_TURNS) _history.shift();
}

export function buildContextPrefix(): string {
  if (_history.length === 0) return "";

  const lines = ["[直前の会話]"];
  for (const turn of _history) {
    lines.push(`ユーザー: ${turn.userMessage}`);
    lines.push(`しきしま: ${turn.agentReply}`);
  }
  lines.push("[現在のメッセージ]");
  return lines.join("\n") + "\n";
}

export function clearHistory(): void {
  _history.length = 0;
}

export function getHistoryLength(): number {
  return _history.length;
}
