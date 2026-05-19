/**
 * IsoCamera — fixed isometric camera setup hook.
 * Uses useThree to call lookAt(0,0,0) after mount.
 * PXR-05. No user interaction.
 */

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

export function IsoCamera(): null {
  const { camera } = useThree();

  useEffect(() => {
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
}
