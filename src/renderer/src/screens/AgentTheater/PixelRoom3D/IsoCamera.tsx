/**
 * IsoCamera — fixed isometric OrthographicCamera.
 * Position: 45° overhead. No user interaction.
 * Free camera deferred to PXR-06.
 */

import { OrthographicCamera } from "@react-three/drei";
import { CAM_POSITION, CAM_ZOOM } from "./room3d-constants";

export function IsoCamera(): React.JSX.Element {
  return (
    <OrthographicCamera
      makeDefault
      position={CAM_POSITION}
      zoom={CAM_ZOOM}
      near={0.1}
      far={200}
    />
  );
}
