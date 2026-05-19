/**
 * AgentMesh — 3D agent representation as a glowing capsule + billboard label.
 * Uses Html from drei for name label (always faces camera).
 * No sprite assets needed (PXR-04 gate). Display-only.
 * PXR-05C / PXR-05D.
 */

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Mesh } from "three";
import type { StationConfig } from "./room3d-constants";
import type { PoseState } from "../../../types/agent-theater-types";

interface AgentMeshProps {
  readonly station: StationConfig;
  readonly pose?: PoseState;
}

/* PXR-05D: pose → body emissive color + intensity */
function poseToEmissive(pose: PoseState | undefined, accent: string): { color: string; intensity: number } {
  switch (pose) {
    case "hold_stop_blocked": return { color: "#f85149", intensity: 0.6 };
    case "waiting_human_go":  return { color: accent,    intensity: 0.35 };
    case "working":           return { color: "#3fb950", intensity: 0.5 };
    case "pass":              return { color: "#3fb950", intensity: 0.4 };
    case "thinking":          return { color: "#58a6ff", intensity: 0.5 };
    default:                  return { color: accent,    intensity: 0.2 };
  }
}

function poseToStatusText(pose: PoseState | undefined): string {
  switch (pose) {
    case "hold_stop_blocked": return "HOLD";
    case "waiting_human_go":  return "GO待ち";
    case "working":           return "作業中";
    case "pass":              return "PASS";
    case "thinking":          return "判断中";
    case "handoff_send":      return "引き渡し";
    case "handoff_receive":   return "受け取り";
    default:                  return "idle";
  }
}

export function AgentMesh({ station, pose }: AgentMeshProps): React.JSX.Element {
  const bodyRef = useRef<Mesh>(null!);
  const [x, y] = station.pos;
  const platformH = station.platformH ?? 0;
  const bodyZ = platformH + 0.15 + 0.4; // sit above desk
  const isCommand = station.id === "shikishima";
  const bodyH = isCommand ? 0.7 : 0.55;
  const bodyR = isCommand ? 0.18 : 0.15;

  const { color: emissiveColor, intensity: emissiveIntensity } = poseToEmissive(pose, station.accentColor);
  const statusText = poseToStatusText(pose);

  /* Gentle float animation */
  useFrame(({ clock }) => {
    if (bodyRef.current) {
      const t = clock.getElapsedTime();
      const seed = station.pos[0] * 0.3 + station.pos[1] * 0.5;
      bodyRef.current.position.z = bodyZ + Math.sin(t * 1.2 + seed) * 0.04;
    }
  });

  return (
    <group position={[x, y, 0]}>
      {/* Agent body — capsule-like stack */}
      <mesh ref={bodyRef} position={[0, 0, bodyZ]} castShadow>
        <capsuleGeometry args={[bodyR, bodyH, 6, 12]} />
        <meshStandardMaterial
          color="#0d1117"
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>

      {/* Eye glow */}
      <mesh position={[bodyR * 0.5, -bodyR * 0.3, bodyZ + bodyH * 0.35]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial
          color={station.accentColor}
          emissive={station.accentColor}
          emissiveIntensity={1.2}
        />
      </mesh>
      <mesh position={[-bodyR * 0.5, -bodyR * 0.3, bodyZ + bodyH * 0.35]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial
          color={station.accentColor}
          emissive={station.accentColor}
          emissiveIntensity={1.2}
        />
      </mesh>

      {/* Billboard label */}
      <Html
        position={[0, 0, bodyZ + bodyH * 0.7]}
        center
        distanceFactor={8}
        style={{ pointerEvents: "none" }}
      >
        <div
          style={{
            fontFamily: '"IBM Plex Mono", monospace',
            background: "rgba(13,17,23,0.88)",
            border: `1px solid ${station.accentColor}`,
            borderRadius: 3,
            padding: "2px 6px",
            whiteSpace: "nowrap",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <span style={{ fontSize: 9, color: station.accentColor, letterSpacing: 1 }}>
            {station.nameJa}
          </span>
          <span style={{ fontSize: 7, color: "#6e7681", letterSpacing: 0.5 }}>
            {statusText}
          </span>
        </div>
      </Html>
    </group>
  );
}
