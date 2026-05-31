import { describe, expect, it } from "vitest";
import {
  getCurrentModeForJstHour,
  getJstHour,
} from "../../../scripts/shikishima-goals.mjs";

describe("shikishima-goals 24h cycle (JST)", () => {
  it("夜の整理モードは 03:00–06:59 JST", () => {
    expect(getCurrentModeForJstHour(2)).toBe("night");
    expect(getCurrentModeForJstHour(3)).toBe("evening");
    expect(getCurrentModeForJstHour(6)).toBe("evening");
    expect(getCurrentModeForJstHour(7)).toBe("morning_prep");
  });

  it("21:00以降は night（旧 夜の整理 帯を night に移行）", () => {
    expect(getCurrentModeForJstHour(20)).toBe("active");
    expect(getCurrentModeForJstHour(21)).toBe("night");
    expect(getCurrentModeForJstHour(23)).toBe("night");
  });

  it("getJstHour は UTC+9 相当", () => {
    const utcNoon = new Date("2026-05-31T03:00:00.000Z");
    expect(getJstHour(utcNoon)).toBe(12);
  });
});
