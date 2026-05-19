/**
 * DeskMesh — desk + optional raised platform for an agent station.
 * PXR-05C.
 */

import type { StationConfig } from "./room3d-constants";
import { COLOR_DESK, COLOR_PLATFORM } from "./room3d-constants";

interface DeskMeshProps {
  readonly station: StationConfig;
}

export function DeskMesh({ station }: DeskMeshProps): React.JSX.Element {
  const [x, y, z] = station.pos;
  const [dw, , dd] = station.deskSize;
  const platformH = station.platformH ?? 0;
  const isCommand = station.id === "shikishima";

  return (
    <group position={[x, y, z]}>
      {/* Raised platform for shikishima */}
      {platformH > 0 && (
        <mesh position={[0, 0, platformH / 2]} castShadow receiveShadow>
          <boxGeometry args={[dw + 0.4, dd + 0.4, platformH]} />
          <meshStandardMaterial
            color={COLOR_PLATFORM}
            emissive={isCommand ? "#58a6ff" : "#000000"}
            emissiveIntensity={isCommand ? 0.08 : 0}
            roughness={0.7}
            metalness={0.2}
          />
        </mesh>
      )}

      {/* Desk surface */}
      <mesh position={[0, 0, platformH + 0.05]} castShadow receiveShadow>
        <boxGeometry args={[...station.deskSize]} />
        <meshStandardMaterial
          color={COLOR_DESK}
          roughness={0.8}
          metalness={0.15}
        />
      </mesh>

      {/* Desk legs (4 corners) */}
      {[[-dw / 2 + 0.1, -dd / 2 + 0.1], [dw / 2 - 0.1, -dd / 2 + 0.1],
        [-dw / 2 + 0.1,  dd / 2 - 0.1], [dw / 2 - 0.1,  dd / 2 - 0.1]
      ].map(([lx, ly], i) => (
        <mesh key={i} position={[lx, ly, platformH / 2 + 0.05]} castShadow>
          <boxGeometry args={[0.05, 0.05, platformH + 0.08]} />
          <meshStandardMaterial color="#0d1117" roughness={0.9} />
        </mesh>
      ))}

      {/* Accent glow strip on desk edge */}
      <mesh position={[0, -dd / 2, platformH + 0.11]}>
        <boxGeometry args={[dw * 0.8, 0.02, 0.02]} />
        <meshStandardMaterial
          color={station.accentColor}
          emissive={station.accentColor}
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  );
}
