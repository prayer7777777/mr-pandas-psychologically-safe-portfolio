import { React, Suspense, useState } from "react";
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
import { cameraCurve, rotationTargets } from "./components/curve";

const Scene = ({
  cameraGroup,
  camera,
  scrollProgress,
  targetScrollProgress,
  lerpFactor,
  mousePositionOffset,
  mouseRotationOffset,
}) => {
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
      newProgress = 0;
      targetScrollProgress.current = 0;
    } else if (newProgress < 0) {
      newProgress = 1;
      targetScrollProgress.current = 1;
    }

    scrollProgress.current = newProgress;

    const basePoint = cameraCurve.getPoint(newProgress);

    console.log(camera.current.rotation);
    console.log(newProgress);

    //For testing
    // camera.current.position.x = THREE.MathUtils.lerp(
    //   camera.current.position.x,
    //   basePoint.x,
    //   0.1
    // );
    // camera.current.position.y = THREE.MathUtils.lerp(
    //   camera.current.position.y,
    //   basePoint.y,
    //   0.1
    // );
    // camera.current.position.z = THREE.MathUtils.lerp(
    //   camera.current.position.z,
    //   basePoint.z,
    //   0.1
    // );

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
