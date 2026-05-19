/**
 * RoomGeometry — floor, back wall, left wall, grid lines.
 * Pure display geometry. No interaction.
 * PXR-05C.
 */

import { ROOM_W, ROOM_D, ROOM_H, COLOR_FLOOR, COLOR_WALL, COLOR_GRID } from "./room3d-constants";

/* ── Floor ── */
function Floor(): React.JSX.Element {
  return (
    <group>
      {/* Base floor plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[ROOM_W, ROOM_D]} />
        <meshStandardMaterial color={COLOR_FLOOR} roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Grid lines on floor */}
      <gridHelper
        args={[Math.max(ROOM_W, ROOM_D), 10, COLOR_GRID, COLOR_GRID]}
        position={[0, 0, 0]}
      />
    </group>
  );
}

/* ── Back wall (Y+) ── */
function BackWall(): React.JSX.Element {
  return (
    <mesh position={[0, ROOM_D / 2, ROOM_H / 2]} receiveShadow>
      <planeGeometry args={[ROOM_W, ROOM_H]} />
      <meshStandardMaterial color={COLOR_WALL} roughness={1} side={2} />
    </mesh>
  );
}

/* ── Left wall (X-) ── */
function LeftWall(): React.JSX.Element {
  return (
    <mesh
      position={[-ROOM_W / 2, 0, ROOM_H / 2]}
      rotation={[0, Math.PI / 2, 0]}
      receiveShadow
    >
      <planeGeometry args={[ROOM_D, ROOM_H]} />
      <meshStandardMaterial color={COLOR_WALL} roughness={1} side={2} />
    </mesh>
  );
}

/* ── Baseboard trim ── */
function Baseboard(): React.JSX.Element {
  return (
    <>
      {/* Back baseboard */}
      <mesh position={[0, ROOM_D / 2 - 0.02, 0.04]}>
        <boxGeometry args={[ROOM_W, 0.05, 0.08]} />
        <meshStandardMaterial color="#1c2333" />
      </mesh>
      {/* Left baseboard */}
      <mesh position={[-ROOM_W / 2 + 0.02, 0, 0.04]}>
        <boxGeometry args={[0.05, ROOM_D, 0.08]} />
        <meshStandardMaterial color="#1c2333" />
      </mesh>
    </>
  );
}

export function RoomGeometry(): React.JSX.Element {
  return (
    <group>
      <Floor />
      <BackWall />
      <LeftWall />
      <Baseboard />
    </group>
  );
}
