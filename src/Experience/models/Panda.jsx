import React, { useRef, useState } from "react";
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

  // Random movement state
  const [randomOffset] = useState(() => ({
    position: new THREE.Vector3(),
    rotation: new THREE.Euler(),
    time: 0,
  }));

  const pandaScrollCurve = useScrollCurve(
    pandaCurve,
    initialPandaPoints,
    PANDA_SHIFT_X_AMOUNT
  );

  useFrame((state, delta) => {
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

      randomOffset.time += delta;

      const positionAmplitude = 0.05;
      const rotationAmplitude = 0.02;

      randomOffset.position.x =
        Math.sin(randomOffset.time * 3 + 0.5) * positionAmplitude;
      randomOffset.position.y =
        Math.sin(randomOffset.time * 3 + 1.2) * positionAmplitude;
      randomOffset.position.z =
        Math.sin(randomOffset.time * 1.1 + 2.1) * positionAmplitude * 0;

      randomOffset.rotation.x =
        Math.sin(randomOffset.time * 2 + 0.8) * rotationAmplitude * 0.2;
      randomOffset.rotation.y =
        Math.sin(randomOffset.time * 0.9 + 1.5) * rotationAmplitude;
      randomOffset.rotation.z =
        Math.sin(randomOffset.time * 0.6 + 2.3) * rotationAmplitude;

      pandaRef.current.position.x = THREE.MathUtils.lerp(
        pandaRef.current.position.x,
        pandaPoint.x + randomOffset.position.x,
        0.1
      );
      pandaRef.current.position.y = THREE.MathUtils.lerp(
        pandaRef.current.position.y,
        pandaPoint.y + randomOffset.position.y,
        0.1
      );
      pandaRef.current.position.z = THREE.MathUtils.lerp(
        pandaRef.current.position.z,
        pandaPoint.z + randomOffset.position.z,
        0.1
      );

      // Apply random rotation on top of base rotation
      pandaRef.current.rotation.x = Math.PI + randomOffset.rotation.x;
      pandaRef.current.rotation.y = 0 + randomOffset.rotation.y;
      pandaRef.current.rotation.z = Math.PI + randomOffset.rotation.z;
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
