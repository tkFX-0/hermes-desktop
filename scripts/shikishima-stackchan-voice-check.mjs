#!/usr/bin/env node
/**
 * StackChan 音声モジュール診断（VOICEVOX + WebSocket）— 発話は短いテスト1回のみ
 *
 *   node scripts/shikishima-stackchan-voice-check.mjs
 *   node scripts/shikishima-stackchan-voice-check.mjs --speak   # 「音声テストです」と1回発話
 */

import { checkStackchanStatus, stackchanSay } from "./shikishima-stackchan.mjs";

const doSpeak = process.argv.includes("--speak");
const phrase = process.argv.find((a) => a.startsWith("--text="))?.slice(7) ?? "音声テストです。聞こえますか。";

const status = await checkStackchanStatus();
const report = {
  at: new Date().toISOString(),
  voicevoxReady: status.voicevoxReady,
  connected: status.connected,
  speakerId: status.speakerId,
  speed: status.speed,
  envVolume: process.env.STACKCHAN_VOICEVOX_VOLUME ?? process.env.VOICEVOX_VOLUME ?? "(default)",
  speakTest: null,
  hints: [],
};

if (!report.voicevoxReady) {
  report.hints.push("VOICEVOX を起動 (通常 http://localhost:50021)");
}
if (!report.connected) {
  report.hints.push("StackChan pet-fw WebSocket (ws://127.0.0.1:8080 等) を確認");
}
if (Number(report.envVolume) > 1.3) {
  report.hints.push("がさがさ・割れ音 → STACKCHAN_VOICEVOX_VOLUME を 1.0〜1.2 に下げる (.env.local)");
}
if (report.speed > 1.15) {
  report.hints.push("速すぎると聞き取りづらい → STACKCHAN_SPEECH_SPEED を 1.0 前後に");
}

if (doSpeak) {
  report.speakTest = await stackchanSay(phrase, { skipMotion: true, maxSpeechChars: 40 });
}

console.log(JSON.stringify(report, null, 2));
process.exit(report.voicevoxReady && report.connected ? 0 : 1);
