/**
 * Room3DView — R3F Canvas wrapper for the 3D pixel room.
 * Fixed isometric OrthographicCamera. No user interaction.
 * Display-only. No execution. No IPC.
 * PXR-05B/C/D.
 */

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import type { AgentPoseMap } from "../../../types/agent-theater-types";
import { Room3DScene } from "./Room3DScene";

/* PXR-05D: decision → per-agent poses */
function derivePoses(decision: string): AgentPoseMap {
  switch (decision) {
    case "STOP":
      return { shikishima: "hold_stop_blocked", shizume: "hold_stop_blocked", hajime: "hold_stop_blocked", tsumugi: "hold_stop_blocked", shirube: "hold_stop_blocked" };
    case "PASS":
    case "PASS_WITH_CAVEAT":
      return { shikishima: "handoff_receive", shizume: "pass", hajime: "pass", tsumugi: "working", shirube: "working" };
    case "GO_READY":
      return { shikishima: "waiting_human_go", shizume: "working", hajime: "thinking", tsumugi: "working", shirube: "working" };
    default:
      return { shikishima: "waiting_human_go", shizume: "hold_stop_blocked", hajime: "idle", tsumugi: "idle", shirube: "idle" };
  }
}

export interface Room3DViewProps {
  readonly decision?: string;
  readonly poses?: AgentPoseMap;
  readonly lang?: "ja" | "en";
}

function LoadingFallback(): React.JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        background: "#0d1117",
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: 11,
        color: "#484f58",
        letterSpacing: 2,
      }}
    >
      LOADING 3D...
    </div>
  );
}

export function Room3DView({ decision = "HOLD", poses, lang = "ja" }: Room3DViewProps): React.JSX.Element {
  const agentPoses = poses ?? derivePoses(decision);

  return (
    <div
      style={{
        background: "#050810",
        borderRadius: 8,
        border: "1px solid #21262d",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 14px",
          borderBottom: "1px solid #1c2333",
          flexShrink: 0,
          flexWrap: "wrap",
          gap: 6,
        }}
      >
        <span
          style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 11,
            letterSpacing: 1.8,
            color: "#58a6ff",
            textTransform: "uppercase",
          }}
        >
          {lang === "ja" ? "🌐 3D ROOM · 管制室" : "🌐 3D ROOM · COMMAND"}
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, color: "#6e7681", border: "1px solid #21262d", borderRadius: 2, padding: "1px 5px" }}>PXR-05</span>
          <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, color: "#6e7681", border: "1px solid #21262d", borderRadius: 2, padding: "1px 5px" }}>Three.js r184</span>
          <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, color: "#6e7681", border: "1px solid #21262d", borderRadius: 2, padding: "1px 5px" }}>display-only</span>
        </div>
      </div>

      {/* R3F Canvas */}
      <div style={{ height: 460, position: "relative" }}>
        <Suspense fallback={<LoadingFallback />}>
          <Canvas
            shadows
            style={{ background: "#050810" }}
            gl={{ antialias: true, alpha: false }}
            onCreated={({ camera }) => {
              camera.lookAt(0, 0, 0);
            }}
          >
            <Room3DScene decision={decision} poses={agentPoses} />
          </Canvas>
        </Suspense>
      </div>
    </div>
  );
}
