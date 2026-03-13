"use client";

import { useRef, useEffect, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import NeuronCloud from "./NeuronCloud";
import BrainRegionHitZones from "./BrainRegionHitZones";
import { useStore } from "@/store/useStore";

export default function BrainNetwork() {
  const groupRef = useRef<THREE.Group>(null);
  const { isZoomed } = useStore();
  const { gl } = useThree();

  // Drag state
  const isDragging = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const userRotation = useRef({ x: 0, y: 0 });
  const lastInteraction = useRef(0);

  const onPointerDown = useCallback(
    (e: PointerEvent) => {
      isDragging.current = true;
      previousMouse.current = { x: e.clientX, y: e.clientY };
      velocity.current = { x: 0, y: 0 };
      gl.domElement.style.cursor = "grabbing";
    },
    [gl]
  );

  const onPointerMove = useCallback((e: PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - previousMouse.current.x;
    const dy = e.clientY - previousMouse.current.y;

    const sensitivity = 0.005;
    velocity.current = { x: dy * sensitivity, y: dx * sensitivity };
    userRotation.current.x += dy * sensitivity;
    userRotation.current.y += dx * sensitivity;

    previousMouse.current = { x: e.clientX, y: e.clientY };
    lastInteraction.current = performance.now();
  }, []);

  const onPointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    gl.domElement.style.cursor = "grab";
    lastInteraction.current = performance.now();
  }, [gl]);

  // Attach all pointer events to the canvas DOM element + window
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    canvas.style.cursor = "grab";
    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      canvas.style.cursor = "";
    };
  }, [gl, onPointerDown, onPointerMove, onPointerUp]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const timeSinceInteraction =
      (performance.now() - lastInteraction.current) / 1000;

    // Apply momentum decay when not dragging
    if (!isDragging.current) {
      const friction = 0.95;
      velocity.current.x *= friction;
      velocity.current.y *= friction;
      userRotation.current.x += velocity.current.x;
      userRotation.current.y += velocity.current.y;
    }

    // Blend: 1 = full user control, 0 = full auto-rotation
    // Fade back to auto after 3s of no interaction over 2s
    const fadeDelay = 3;
    const fadeDuration = 2;
    const hasInteracted = lastInteraction.current > 0;
    const userBlend = hasInteracted
      ? 1 -
        Math.min(
          1,
          Math.max(0, (timeSinceInteraction - fadeDelay) / fadeDuration)
        )
      : 0;

    // Ease user rotation back toward zero as auto-rotation takes over
    if (userBlend < 1 && hasInteracted) {
      const easeBack = 0.02 * (1 - userBlend);
      userRotation.current.x *= 1 - easeBack;
      userRotation.current.y *= 1 - easeBack;
    }

    // Auto-rotation
    const speed = isZoomed ? 0.05 : 0.12;
    const autoY = Math.sin(state.clock.elapsedTime * speed) * 0.25;
    const autoX = Math.sin(state.clock.elapsedTime * speed * 0.7) * 0.08;

    // Blend between user rotation and auto-rotation
    groupRef.current.rotation.y =
      userRotation.current.y * userBlend + autoY * (1 - userBlend);
    groupRef.current.rotation.x =
      userRotation.current.x * userBlend + autoX * (1 - userBlend);
  });

  return (
    <group ref={groupRef}>
      <NeuronCloud />
      <BrainRegionHitZones />
    </group>
  );
}
