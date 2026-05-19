/**
 * Room3DScene — static isometric 3D scene.
 * Floor + walls + 5 desks + 5 agents + Safety HUD.
 * No user interaction. Display-only.
 * PXR-05C/D.
 */

import type { AgentPoseMap } from "../../../types/agent-theater-types";
import { STATIONS } from "./room3d-constants";
import { IsoCamera } from "./IsoCamera";
import { RoomGeometry } from "./RoomGeometry";
import { DeskMesh } from "./DeskMesh";
import { AgentMesh } from "./AgentMesh";
import { Room3DHUD } from "./Room3DHUD";

interface Room3DSceneProps {
  readonly decision?: string;
  readonly poses?: AgentPoseMap;
}

export function Room3DScene({ decision = "HOLD", poses }: Room3DSceneProps): React.JSX.Element {
  return (
    <>
      <IsoCamera />

      {/* Lighting */}
      <ambientLight intensity={0.35} />
      <pointLight position={[0, 6, 5]}   intensity={1.2} color="#58a6ff" castShadow />
      <pointLight position={[-4, -4, 4]} intensity={0.7} color="#f0883e" />
      <pointLight position={[4,  4, 2]}  intensity={0.4} color="#ffffff" />

      {/* Fog */}
      <fog attach="fog" args={["#050810", 18, 40]} />

      {/* Room structure */}
      <RoomGeometry />

      {/* Agent stations */}
      {STATIONS.map((station) => (
        <group key={station.id}>
          <DeskMesh station={station} />
          <AgentMesh
            station={station}
            pose={poses?.[station.id]}
          />
        </group>
      ))}

      {/* Safety HUD overlay */}
      <Room3DHUD decision={decision} />
    </>
  );
}
