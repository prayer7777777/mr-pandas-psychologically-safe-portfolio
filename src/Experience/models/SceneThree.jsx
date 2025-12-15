import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useKTX2Texture } from "../utils/ktxLoader";

export default function Model(props) {
  const { nodes, materials } = useGLTF("/models/scene_3.glb");

  const pandaCorp = useRef();

  const scene_3 = useKTX2Texture("/textures/scene_3.ktx2");

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Plane072.geometry}
        material={scene_3}
        position={[13.378, 2.616, -2.127]}
        rotation={[Math.PI / 2, 0.026, 0]}
      />
      <mesh
        geometry={nodes.Plane073.geometry}
        material={scene_3}
        position={[9.987, 2.4, -2.5]}
        rotation={[Math.PI / 2, -0.051, 0]}
      />
      <mesh
        geometry={nodes.Plane095.geometry}
        material={scene_3}
        position={[11.683, 2.326, -2.296]}
        rotation={[Math.PI / 2, -0.072, 0]}
      />
      <mesh
        geometry={nodes.Plane096.geometry}
        material={scene_3}
        position={[12.548, 2.414, -2.296]}
        rotation={[Math.PI / 2, 0.023, 0]}
      />
      <mesh
        geometry={nodes.Plane111.geometry}
        material={scene_3}
        position={[10.511, 2.48, -2.362]}
        rotation={[Math.PI / 2, 0.023, 0]}
      />
      <mesh
        geometry={nodes.Plane112.geometry}
        material={scene_3}
        position={[8.405, 4.947, -2.744]}
        rotation={[Math.PI / 2, 0.023, 0]}
      />
      <mesh
        ref={pandaCorp}
        geometry={nodes.Plane113.geometry}
        material={scene_3}
        position={[8.363, 3.436, -2.754]}
        rotation={[Math.PI / 2, 0.073, 0]}
      />
      <mesh
        geometry={nodes.Plane114.geometry}
        material={scene_3}
        position={[10.062, 3.516, -2.754]}
        rotation={[Math.PI / 2, -0.127, 0]}
      />
      <mesh
        geometry={nodes.Plane115.geometry}
        material={scene_3}
        position={[10.712, 2.177, -0.262]}
      />
      <mesh
        geometry={nodes.Plane117.geometry}
        material={scene_3}
        position={[-20.599, 4.634, -2.755]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={nodes.Plane118.geometry}
        material={scene_3}
        position={[12.525, 2.178, -1.07]}
      />
      <mesh
        geometry={nodes.Pyramid_Door.geometry}
        material={scene_3}
        position={[12.525, 3.03, 0.011]}
      />
      <mesh
        geometry={nodes.Camel_Stick.geometry}
        material={scene_3}
        position={[8.138, 1.997, -1.48]}
        rotation={[Math.PI, 0, Math.PI]}
        scale={[1.523, 1, 1.523]}
      />
    </group>
  );
}

useGLTF.preload("/models/scene_3.glb");
