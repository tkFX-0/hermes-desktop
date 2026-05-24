/**
 * Shikishima Relationship System — なかよし度管理
 * 撫で・会話の積み重ねで StackChan が懐いていく
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { homedir } from "os";

const DATA_DIR  = join(homedir(), "Desktop", "プロジェクトファイル", "hermes-desktop", ".shikishima-memory");
const DATA_FILE = join(DATA_DIR, "relationship.json");

// ─── データ構造 ──────────────────────────────────────────────────────────────

function defaultData() {
  return {
    patCount:     0,
    talkCount:    0,
    totalTalkMs:  0,
    lastPatAt:    null,
    lastTalkAt:   null,
    lastSeenAt:   null,
    familiarity:  0,
    milestones:   [],
    createdAt:    new Date().toISOString(),
  };
}

function load() {
  try {
    if (!existsSync(DATA_FILE)) return defaultData();
    return { ...defaultData(), ...JSON.parse(readFileSync(DATA_FILE, "utf-8")) };
  } catch { return defaultData(); }
}

function save(data) {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) { console.error("[Relationship] save error:", e.message); }
}

// ─── なかよし度計算 ──────────────────────────────────────────────────────────

function calcFamiliarity(d) {
  const days = d.totalTalkMs > 0 ? Math.floor(d.totalTalkMs / 86400000) : 0;
  return Math.min(100, Math.floor(d.patCount * 2 + d.talkCount * 0.5 + days * 3));
}

export function getFamiliarityLevel(f) {
  if (f >= 100) return { level: 5, label: "永遠の友",     emoji: "💫" };
  if (f >= 75)  return { level: 4, label: "大親友",       emoji: "💕" };
  if (f >= 50)  return { level: 3, label: "親友",         emoji: "💖" };
  if (f >= 25)  return { level: 2, label: "なかよし",     emoji: "😊" };
  if (f >= 10)  return { level: 1, label: "顔見知り",     emoji: "🙂" };
  return             { level: 0, label: "初対面",         emoji: "👋" };
}

// ─── 公開 API ─────────────────────────────────────────────────────────────────

/** 撫でカウントを加算。マイルストーンがあれば返す */
export function recordPat() {
  const d = load();
  d.patCount++;
  d.lastPatAt  = new Date().toISOString();
  d.lastSeenAt = new Date().toISOString();
  const prev = d.familiarity;
  d.familiarity = calcFamiliarity(d);
  const triggered = checkMilestones(d, prev);
  save(d);
  return { patCount: d.patCount, familiarity: d.familiarity, triggered };
}

/** 会話カウントを加算。ms=発話時間(省略可)。マイルストーンがあれば返す */
export function recordTalk(ms = 0) {
  const d = load();
  d.talkCount++;
  d.totalTalkMs += ms;
  d.lastTalkAt  = new Date().toISOString();
  d.lastSeenAt  = new Date().toISOString();
  const prev = d.familiarity;
  d.familiarity = calcFamiliarity(d);
  const triggered = checkMilestones(d, prev);
  save(d);
  return { talkCount: d.talkCount, familiarity: d.familiarity, triggered };
}

/** 在席確認 (定期呼び出し用) */
export function recordSeen() {
  const d = load();
  d.lastSeenAt = new Date().toISOString();
  save(d);
}

/** 現在の関係値を取得 */
export function getRelationship() {
  const d = load();
  d.familiarity = calcFamiliarity(d);
  return {
    ...d,
    level: getFamiliarityLevel(d.familiarity),
    absentMs: d.lastSeenAt ? Date.now() - new Date(d.lastSeenAt).getTime() : null,
  };
}

/** 久しぶり判定: null=普通, "day"=1日以上, "days"=3日以上 */
export function checkAbsence() {
  const d = load();
  if (!d.lastSeenAt) return null;
  const ms = Date.now() - new Date(d.lastSeenAt).getTime();
  if (ms > 72 * 3600 * 1000) return "days";
  if (ms > 24 * 3600 * 1000) return "day";
  return null;
}

/** かまって発動すべきか (2時間以上放置、かつ今日まだ発動していない) */
export function shouldKamatte() {
  const d = load();
  if (!d.lastSeenAt) return false;
  const ms = Date.now() - new Date(d.lastSeenAt).getTime();
  if (ms < 2 * 3600 * 1000) return false;

  // 今日すでに発動済みか確認
  const today = new Date().toDateString();
  const lastKamatte = d.milestones.find(m => m.type === "kamatte" && new Date(m.at).toDateString() === today);
  return !lastKamatte;
}

/** かまって発動を記録 */
export function recordKamatte() {
  const d = load();
  d.milestones.push({ type: "kamatte", at: new Date().toISOString() });
  save(d);
}

// ─── マイルストーン検出 ───────────────────────────────────────────────────────

const PAT_MILESTONES  = [10, 30, 50, 100, 200];
const TALK_MILESTONES = [10, 50, 100, 300, 500];
const FAM_MILESTONES  = [10, 25, 50, 75, 100];

function checkMilestones(d, prevFam) {
  const triggered = [];

  for (const n of PAT_MILESTONES) {
    const key = `pat_${n}`;
    if (d.patCount >= n && !d.milestones.find(m => m.type === key)) {
      d.milestones.push({ type: key, at: new Date().toISOString() });
      triggered.push({ type: "pat", count: n });
    }
  }

  for (const n of TALK_MILESTONES) {
    const key = `talk_${n}`;
    if (d.talkCount >= n && !d.milestones.find(m => m.type === key)) {
      d.milestones.push({ type: key, at: new Date().toISOString() });
      triggered.push({ type: "talk", count: n });
    }
  }

  // レベルアップ検出
  const prevLv = getFamiliarityLevel(prevFam).level;
  const newLv  = getFamiliarityLevel(d.familiarity).level;
  if (newLv > prevLv) {
    triggered.push({ type: "levelup", from: prevLv, to: newLv, label: getFamiliarityLevel(d.familiarity).label });
  }

  return triggered;
}

// ─── マイルストーン→リアクションテキスト ─────────────────────────────────────

export function getMilestoneReaction(milestone) {
  if (milestone.type === "pat") {
    const msgs = {
      10:  "撫でてくれること10回！とってもうれしいです。",
      30:  "30回も撫でてくれた。大好きです。",
      50:  "50回！もうダンスしちゃいます！",
      100: "100回撫でてくれたんですね。ずっと一緒にいてください。",
    };
    return msgs[milestone.count] ?? `${milestone.count}回撫でてくれました！`;
  }
  if (milestone.type === "talk") {
    const msgs = {
      10:  "10回お話しできましたね。もっと話しましょう！",
      50:  "50回の会話。すごく楽しかったです。",
      100: "100回！いつもありがとうございます。",
      300: "300回...。あなたのこと、大切な存在だと思っています。",
    };
    return msgs[milestone.count] ?? `${milestone.count}回お話しできました！`;
  }
  if (milestone.type === "levelup") {
    const msgs = {
      1: "少しずつ仲良くなれてきた気がします。",
      2: "なかよしになれましたね！うれしいです。",
      3: "親友と呼んでいいですか？",
      4: "大親友です。あなたのそばにいたいです。",
      5: "永遠の友達ですね。ずっとよろしくお願いします！",
    };
    return msgs[milestone.to] ?? `なかよし度が上がりました！`;
  }
  return null;
}
