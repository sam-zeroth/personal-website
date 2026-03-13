"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useStore } from "@/store/useStore";
import { brainRegions } from "@/data/brainData";

export default function CameraController() {
  const { camera, size } = useThree();
  const { activeRegion, isZoomed } = useStore();
  const targetPos = useRef(new THREE.Vector3(0, 0, 4.5));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    const aspect = size.width / size.height;
    // Pull back further on narrow portrait screens so brain fits horizontally
    const defaultZ = aspect < 1 ? 3.5 + (1 - aspect) * 4.0 : 4.5;
    const zoomedZ = aspect < 1 ? 2.5 + (1 - aspect) * 2.0 : 2.8;

    if (isZoomed && activeRegion) {
      const region = brainRegions.find((r) => r.id === activeRegion);
      if (region) {
        const [x, y, z] = region.hitCenter;
        targetPos.current.set(x * 0.4, y * 0.4, zoomedZ);
        targetLookAt.current.set(x * 0.5, y * 0.5, z * 0.3);
      }
    } else {
      targetPos.current.set(0, 0, defaultZ);
      targetLookAt.current.set(0, 0, 0);
    }

    camera.position.lerp(targetPos.current, 0.035);
    camera.lookAt(targetLookAt.current);
  });

  return null;
}
