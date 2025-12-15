import { React, Suspense, useState, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { PostProcessingPass } from "./components/PostProcessingPass";
import MovingObjects from "./models/Moving_Objects";
import SceneOne from "./models/SceneOne";
import SceneTwo from "./models/SceneTwo";
import SceneThree from "./models/SceneThree";
import SceneFour from "./models/SceneFour";
import SingleSheet from "./models/SingleSheet";
import { SoftShadows } from "@react-three/drei";
import {
  cameraCurve as initialCameraCurve,
  initialCameraPoints,
  SHIFT_X_AMOUNT,
  rotationTargets,
} from "./components/curve";
import { transition } from "three/examples/jsm/tsl/display/TransitionNode.js";

const POINTS_COUNT = initialCameraPoints.length;
const SEGMENTS_COUNT = POINTS_COUNT - 1;
const PROGRESS_RESET_AMOUNT = 1 / SEGMENTS_COUNT;
const SHIFT_TRIGGER = 1 - 2 * PROGRESS_RESET_AMOUNT;

const transitionCurvePoints = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, 0, 0),
];

const Scene = ({
  cameraGroup,
  camera,
  scrollProgress,
  targetScrollProgress,
  lerpFactor,
  mousePositionOffset,
  mouseRotationOffset,
}) => {
  const curveRef = useRef(initialCameraCurve);
  const curvePointsRef = useRef([...initialCameraPoints]);
  const initialCurvePointsRef = useRef(
    initialCameraPoints.map((v) => v.clone())
  );

  curveRef.current.points = curvePointsRef.current;
  let loopCounter = useRef(1);

  const transitionCurvePointsRef = useRef(transitionCurvePoints);
  const transitionCurveActive = useRef(false);

  const initiateTransitionCurve = (direction = "forward") => {
    console.log("transition intiated");
    console.log(loopCounter.current);
    if (direction === "forward") {
      transitionCurvePointsRef.current = [
        initialCurvePointsRef.current[initialCurvePointsRef.current.length - 1]
          .clone()
          .add(
            new THREE.Vector3(SHIFT_X_AMOUNT * (loopCounter.current - 1), 0, 0)
          ),

        initialCurvePointsRef.current[0]
          .clone()
          .add(new THREE.Vector3(SHIFT_X_AMOUNT * loopCounter.current, 0, 0)),
      ];
    } else {
      transitionCurvePointsRef.current = [
        initialCurvePointsRef.current[initialCurvePointsRef.current.length - 1]
          .clone()
          .sub(
            new THREE.Vector3(SHIFT_X_AMOUNT * (loopCounter.current + 1), 0, 0)
          ),
        initialCurvePointsRef.current[0].clone(),
      ];
    }

    console.log(transitionCurvePointsRef.current);

    curvePointsRef.current = transitionCurvePointsRef.current;
    curveRef.current.points = transitionCurvePointsRef.current;
    curveRef.current.needsUpdate = true;
  };

  const shiftCurvePoints = (direction = "forward") => {
    console.log("shifting intiated");
    console.log(loopCounter.current);

    let shiftedCameraPoints = [];
    if (direction === "forward") {
      shiftedCameraPoints = initialCurvePointsRef.current.map((point) =>
        point
          .clone()
          .add(new THREE.Vector3(SHIFT_X_AMOUNT * loopCounter.current, 0, 0))
      );
    } else {
      shiftedCameraPoints = initialCurvePointsRef.current.map((point) =>
        point
          .clone()
          .sub(
            new THREE.Vector3(SHIFT_X_AMOUNT * (loopCounter.current - 1), 0, 0)
          )
      );
    }

    console.log(shiftedCameraPoints);

    curvePointsRef.current = shiftedCameraPoints;
    curveRef.current.points = shiftedCameraPoints;
    curveRef.current.needsUpdate = true;
  };

  const [rotationBufferQuat] = useState(
    new THREE.Quaternion().setFromEuler(rotationTargets[0].rotation)
  );

  const getLerpedRotation = (progress) => {
    for (let i = 0; i < rotationTargets.length - 1; i++) {
      const start = rotationTargets[i];
      const end = rotationTargets[i + 1];
      if (progress >= start.progress && progress <= end.progress) {
        const lerpFactor =
          (progress - start.progress) / (end.progress - start.progress);

        const startQuaternion = new THREE.Quaternion().setFromEuler(
          start.rotation
        );
        const endQuaternion = new THREE.Quaternion().setFromEuler(end.rotation);

        const lerpingQuaternion = new THREE.Quaternion();
        lerpingQuaternion.slerpQuaternions(
          startQuaternion,
          endQuaternion,
          lerpFactor
        );

        return lerpingQuaternion;
      }
    }

    return new THREE.Quaternion().setFromEuler(
      rotationTargets[rotationTargets.length - 1].rotation
    );
  };

  useFrame(() => {
    let newProgress = THREE.MathUtils.lerp(
      scrollProgress.current,
      targetScrollProgress.current,
      lerpFactor
    );

    if (newProgress >= 1) {
      if (transitionCurveActive.current) {
        transitionCurveActive.current = false;
        shiftCurvePoints("forward");
        loopCounter.current++;
      } else {
        transitionCurveActive.current = true;
        initiateTransitionCurve("forward");
      }

      scrollProgress.current -= 1;
      targetScrollProgress.current -= 1;
      newProgress -= 1;
      newProgress = THREE.MathUtils.lerp(
        scrollProgress.current,
        targetScrollProgress.current,
        lerpFactor
      );
    } else if (newProgress < 0) {
      if (transitionCurveActive.current) {
        transitionCurveActive.current = false;
        shiftCurvePoints("backward");
      } else {
        loopCounter.current--;
        transitionCurveActive.current = true;
        initiateTransitionCurve("backward");
      }

      scrollProgress.current += 1;
      targetScrollProgress.current += 1;
      newProgress += 1;
      newProgress = THREE.MathUtils.lerp(
        scrollProgress.current,
        targetScrollProgress.current,
        lerpFactor
      );
    }

    scrollProgress.current = newProgress;

    const basePoint = curveRef.current.getPoint(newProgress);

    // console.log(camera.current.rotation);
    // console.log(newProgress);

    cameraGroup.current.position.x = THREE.MathUtils.lerp(
      cameraGroup.current.position.x,
      basePoint.x,
      0.1
    );
    cameraGroup.current.position.y = THREE.MathUtils.lerp(
      cameraGroup.current.position.y,
      basePoint.y,
      0.1
    );
    cameraGroup.current.position.z = THREE.MathUtils.lerp(
      cameraGroup.current.position.z,
      basePoint.z,
      0.1
    );

    camera.current.position.x = THREE.MathUtils.lerp(
      camera.current.position.x,
      mousePositionOffset.current.x,
      0.1
    );
    camera.current.position.y = THREE.MathUtils.lerp(
      camera.current.position.y,
      -mousePositionOffset.current.y,
      0.1
    );
    camera.current.position.z = 0;

    const targetRotation = getLerpedRotation(newProgress);
    rotationBufferQuat.slerp(targetRotation, 0.05);
    cameraGroup.current.quaternion.copy(rotationBufferQuat);

    camera.current.rotation.x = THREE.MathUtils.lerp(
      camera.current.rotation.x,
      -mouseRotationOffset.current.x,
      0.1
    );
    camera.current.rotation.y = THREE.MathUtils.lerp(
      camera.current.rotation.y,
      -mouseRotationOffset.current.y,
      0.1
    );
  });
  return (
    <>
      {/* <ambientLight intensity={1} /> */}
      {/* <directionalLight position={[3.3, 1.0, 4.4]} castShadow intensity={4} /> */}

      <Suspense fallback={null}>
        <MovingObjects />
        <SceneOne />
        <SceneTwo />
        <SceneThree />
        <SceneFour />
        {/* <PostProcessingPass /> */}
        <SingleSheet />
      </Suspense>
    </>
  );
};

export default Scene;
