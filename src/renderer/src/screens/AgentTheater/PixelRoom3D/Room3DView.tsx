/**
 * Room3DView — R3F Canvas wrapper for the 3D isometric room.
 * Uses Canvas orthographic + camera prop for stable isometric setup.
 * ErrorBoundary prevents crashes from propagating to the whole app.
 * Display-only. No execution. No IPC. PXR-05.
 */

import { Component, Suspense } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import type { AgentPoseMap } from "../../../types/agent-theater-types";
import { Room3DScene } from "./Room3DScene";
import { CAM_POSITION, CAM_ZOOM } from "./room3d-constants";

/* ── Simple class-based ErrorBoundary ── */
interface EBState { hasError: boolean; message: string }

class Room3DErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, message: "" };
  }
  static getDerivedStateFromError(error: Error): EBState {
    return { hasError: true, message: error.message };
  }
  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[Room3DView] Three.js error:", error, info);
  }
  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", height: 460, background: "#0d1117",
          gap: 8,
        }}>
          <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: "#f85149" }}>
            3D RENDER ERROR
          </span>
          <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, color: "#484f58", maxWidth: 320, textAlign: "center" }}>
            {this.state.message || "WebGL context failed. Try the CSS 部屋 tab."}
          </span>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ── Derive poses from decision ── */
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
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      height: 460, background: "#050810",
      fontFamily: '"IBM Plex Mono", monospace', fontSize: 11,
      color: "#484f58", letterSpacing: 2,
    }}>
      LOADING 3D...
    </div>
  );
}

export function Room3DView({ decision = "HOLD", poses, lang = "ja" }: Room3DViewProps): React.JSX.Element {
  const agentPoses = poses ?? derivePoses(decision);

  return (
    <div style={{
      background: "#050810", borderRadius: 8,
      border: "1px solid #21262d", overflow: "hidden",
      display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px 14px", borderBottom: "1px solid #1c2333",
        flexShrink: 0, flexWrap: "wrap", gap: 6,
      }}>
        <span style={{
          fontFamily: '"IBM Plex Mono", monospace', fontSize: 11,
          letterSpacing: 1.8, color: "#58a6ff", textTransform: "uppercase",
        }}>
          {lang === "ja" ? "🌐 3D ROOM · 管制室" : "🌐 3D ROOM · COMMAND"}
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          {["PXR-05", "Three.js r184", "display-only"].map((label) => (
            <span key={label} style={{
              fontFamily: '"IBM Plex Mono", monospace', fontSize: 9,
              color: "#6e7681", border: "1px solid #21262d",
              borderRadius: 2, padding: "1px 5px",
            }}>{label}</span>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div style={{ height: 460, position: "relative" }}>
        <Room3DErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <Canvas
              orthographic
              camera={{
                position: CAM_POSITION,
                zoom: CAM_ZOOM,
                near: 0.1,
                far: 200,
              }}
              shadows
              style={{ background: "#050810" }}
              gl={{ antialias: true, alpha: false }}
            >
              <Room3DScene decision={decision} poses={agentPoses} />
            </Canvas>
          </Suspense>
        </Room3DErrorBoundary>
      </div>
    </div>
  );
}
