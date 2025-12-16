import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useKTX2Texture } from "../utils/ktxLoader";
import { useScrollCurve } from "../hooks/useScrollCurve";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  initialPandaPoints,
  PANDA_SHIFT_X_AMOUNT,
  pandaCurve,
} from "../components/curve";

export default function Model({ scrollProgress, cameraScrollCurve, ...props }) {
  const { nodes, materials } = useGLTF("/models/Panda.glb");
  const material = useKTX2Texture("/textures/Moving_extras.ktx2");
  const pandaRef = useRef();

  const pandaScrollCurve = useScrollCurve(
    pandaCurve,
    initialPandaPoints,
    PANDA_SHIFT_X_AMOUNT
  );

  useFrame(() => {
    if (pandaRef.current && scrollProgress && cameraScrollCurve) {
      let currentProgress = scrollProgress.current;
      if (
        cameraScrollCurve.transitionCurveActive.current !==
        pandaScrollCurve.transitionCurveActive.current
      ) {
        pandaScrollCurve.transitionCurveActive.current =
          cameraScrollCurve.transitionCurveActive.current;

        if (cameraScrollCurve.transitionCurveActive.current) {
          pandaScrollCurve.loopCounter.current =
            cameraScrollCurve.loopCounter.current;
          pandaScrollCurve.initiateTransitionCurve();
        } else {
          const direction =
            cameraScrollCurve.loopCounter.current >
            pandaScrollCurve.loopCounter.current
              ? "forward"
              : "backward";

          pandaScrollCurve.shiftCurvePoints(direction);
          pandaScrollCurve.loopCounter.current =
            cameraScrollCurve.loopCounter.current;
        }
      }

      const pandaPoint = pandaScrollCurve.getCurrentPoint(currentProgress);

      pandaRef.current.position.x = THREE.MathUtils.lerp(
        pandaRef.current.position.x,
        pandaPoint.x,
        0.1
      );
      pandaRef.current.position.y = THREE.MathUtils.lerp(
        pandaRef.current.position.y,
        pandaPoint.y,
        0.1
      );
      pandaRef.current.position.z = THREE.MathUtils.lerp(
        pandaRef.current.position.z,
        pandaPoint.z,
        0.1
      );
    }
  });

  return (
    <group {...props} dispose={null}>
      <mesh
        ref={pandaRef}
        geometry={nodes.Mr_Panda.geometry}
        material={material}
        position={[-20.662, -4.833, -1.454]}
        rotation={[Math.PI, 0, Math.PI]}
        scale={[1.523, 1, 1.523]}
      />
    </group>
  );
}

useGLTF.preload("/models/Panda.glb");
