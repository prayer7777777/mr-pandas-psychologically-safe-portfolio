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
import { SoftShadows } from "@react-three/drei";

const Scene = () => {
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
      </Suspense>
    </>
  );
};

export default Scene;
