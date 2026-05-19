/**
 * room3d-constants — PXR-05 3D scene layout constants.
 * All units in Three.js world-space. Room: 10×8×3.
 * Display-only. No execution. No IPC.
 */

import type { AgentId } from "../../../types/agent-theater-types";

/** Camera */
export const CAM_POSITION: [number, number, number] = [9, 9, 9];
export const CAM_ZOOM = 52;

/** Room dimensions */
export const ROOM_W = 10;
export const ROOM_D = 8;
export const ROOM_H = 3;

/** Agent station positions [x, y, z] and desk sizes */
export interface StationConfig {
  id: AgentId;
  nameJa: string;
  roleJa: string;
  pos: [number, number, number];
  deskSize: [number, number, number];
  platformH?: number;
  accentColor: string;
}

export const STATIONS: StationConfig[] = [
  {
    id: "hajime",
    nameJa: "むすび",
    roleJa: "計画デスク",
    pos: [0, 3, 0],
    deskSize: [1.4, 0.1, 0.8],
    accentColor: "#3fb950",
  },
  {
    id: "shizume",
    nameJa: "しずめ",
    roleJa: "安全ゲート",
    pos: [-3.2, 0, 0],
    deskSize: [1.2, 0.1, 0.7],
    accentColor: "#f85149",
  },
  {
    id: "shikishima",
    nameJa: "しきしま",
    roleJa: "★ 司令席",
    pos: [0, 0, 0],
    deskSize: [1.8, 0.1, 1.1],
    platformH: 0.35,
    accentColor: "#58a6ff",
  },
  {
    id: "tsumugi",
    nameJa: "つむぐ",
    roleJa: "開発ベンチ",
    pos: [3.2, 0, 0],
    deskSize: [1.4, 0.1, 0.8],
    accentColor: "#f0883e",
  },
  {
    id: "shirube",
    nameJa: "しるべ",
    roleJa: "記録棚",
    pos: [0, -3, 0],
    deskSize: [1.2, 0.1, 0.7],
    accentColor: "#a371f7",
  },
];

/** Colors */
export const COLOR_FLOOR    = "#0a0f1a";
export const COLOR_WALL     = "#080d18";
export const COLOR_DESK     = "#161b22";
export const COLOR_PLATFORM = "#1d3557";
export const COLOR_GRID     = "#1c2333";
export const COLOR_FOG      = "#050810";
