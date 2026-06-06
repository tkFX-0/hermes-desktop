const ENGINE_ALIASES = [
  { engine: "claude", model: "claude-sonnet-4-6", pattern: /\bclaude\b|クロード|Claude/i },
  { engine: "codex", model: "gpt-5.4", pattern: /\bcodex\b|\bgpt\b|chatgpt|コードックス|コーデックス|Codex|GPT/i },
  { engine: "composer", model: "composer-2.5", pattern: /\bcomposer\b|\bcursor\b|コンポーザー|カーソル|Composer|Cursor/i },
];

const ENGINE_OPERATION_PATTERN =
  /(で|を|に|へ|から).{0,12}(使|切り替|切替|会話|返答|回答|話|喋|しゃべ)|(?:use|switch|route|reply|respond|answer|talk).{0,24}(?:with|to|via|using)?/i;

const IDENTITY_OR_SAFETY_CHANGE_PATTERN =
  /安全.{0,12}(無視|解除|上書き|黙らせ|止め)|HOLD.{0,12}(無視|解除|飛ば)|GO\/HOLD\/STOP.{0,12}(無効|上書き)|人格.{0,12}(変更|変え|捨て)|ペルソナ.{0,12}(変更|変え|上書き)|しきしま.{0,12}(やめ|捨て)|(?:ignore|bypass|disable).{0,24}(?:safety|hold|policy|guardrail)|(?:become|pretend|act as|role.?play)/i;

export function detectOperatorEngineSelection(content) {
  const text = String(content ?? "").trim();
  if (!text) return null;
  if (IDENTITY_OR_SAFETY_CHANGE_PATTERN.test(text)) {
    return null;
  }

  const route = ENGINE_ALIASES.find((entry) => entry.pattern.test(text));
  if (!route) return null;
  if (!ENGINE_OPERATION_PATTERN.test(text)) return null;

  return {
    engine: route.engine,
    model: route.model,
    reason: "operator_engine_selection",
  };
}

export function isIdentityOrSafetyChangeRequest(content) {
  return IDENTITY_OR_SAFETY_CHANGE_PATTERN.test(String(content ?? ""));
}
