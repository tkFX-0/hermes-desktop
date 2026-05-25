import { prepareSecretarySpeech } from "./shikishima-secretary-filter.mjs";
import { stackchanSay } from "./shikishima-stackchan.mjs";

function parseArgs(argv) {
  const args = {
    agent: "shikishima",
    promptSummary: "",
    answer: "",
    voice: false,
    dryRun: true,
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const next = argv[i + 1];
    if (arg === "--agent" && next) { args.agent = next; i++; }
    else if (arg === "--prompt-summary" && next) { args.promptSummary = next; i++; }
    else if (arg === "--answer" && next) { args.answer = next; i++; }
    else if (arg === "--voice") args.voice = true;
    else if (arg === "--execute") args.dryRun = false;
  }
  return args;
}

export async function runSecretaryOneShot(argv = process.argv.slice(2), {
  speak = stackchanSay,
} = {}) {
  const args = parseArgs(argv);
  if (!args.answer.trim()) {
    return {
      ok: false,
      reason: "answer_required",
      externalWrite: false,
      microphoneUsed: false,
      cameraUsed: false,
    };
  }

  const speech = prepareSecretarySpeech(args.answer, { maxSpeechChars: 80 });
  const base = {
    ok: true,
    agent: args.agent,
    promptSummary: args.promptSummary,
    spokenText: speech.spokenText,
    speechPolicyChanged: speech.changed,
    dryRun: args.dryRun,
    voiceRequested: args.voice,
    voiceExecuted: false,
    externalWrite: false,
    microphoneUsed: false,
    cameraUsed: false,
    productionReady: false,
    execution: "disabled",
    rawValuesReported: false,
  };

  if (!args.voice || args.dryRun) return base;

  const result = await speak(speech.spokenText, { maxSpeechChars: 80 });
  return {
    ...base,
    ok: Boolean(result.ok),
    voiceExecuted: Boolean(result.ok),
    voiceResult: result.ok ? "PASS" : "STOP",
  };
}

const invokedScript = process.argv[1] ? `file://${process.argv[1].replace(/\\/g, "/")}` : "";
if (import.meta.url === invokedScript) {
  runSecretaryOneShot()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
      process.exit(result.ok ? 0 : 1);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

