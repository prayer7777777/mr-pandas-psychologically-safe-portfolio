import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useKTX2Texture } from "../utils/ktxLoader";

export default function Model(props) {
  const { nodes, materials } = useGLTF("/models/Moving_Extras.glb");

  const material = useKTX2Texture("/textures/Moving_extras.ktx2");

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Camel_Body.geometry}
        material={material}
        position={[8.226, 2.754, -1.394]}
        rotation={[Math.PI / 2, 0.013, 0]}
        scale={0.849}
      />
      <mesh
        geometry={nodes.front_right_camel.geometry}
        material={material}
        position={[8.434, 2.572, -1.392]}
        rotation={[Math.PI / 2, -0.054, 0]}
      />
      <mesh
        geometry={nodes.back_right_camel.geometry}
        material={material}
        position={[7.97, 2.547, -1.392]}
        rotation={[Math.PI / 2, -0.054, 0]}
      />
      <mesh
        geometry={nodes.front_left_camel.geometry}
        material={material}
        position={[8.392, 2.703, -1.426]}
        rotation={[Math.PI / 2, -0.054, 0]}
      />
      <mesh
        geometry={nodes.back_left_camel.geometry}
        material={material}
        position={[7.97, 2.609, -1.426]}
        rotation={[Math.PI / 2, -0.054, 0]}
      />
      <mesh
        geometry={nodes.Bike_Pedal_Holder.geometry}
        material={material}
        position={[-20.535, 0.616, -1.381]}
        rotation={[-Math.PI / 2, 0, -Math.PI]}
      />
      <mesh
        geometry={nodes.Bike_Stick.geometry}
        material={material}
        position={[-20.497, 0.378, -1.48]}
        rotation={[Math.PI, 0, Math.PI]}
        scale={[1.523, 1, 1.523]}
      />
      <mesh
        geometry={nodes.Bike_Body.geometry}
        material={material}
        position={[-20.607, 0.901, -1.391]}
        rotation={[-Math.PI / 2, 0, -Math.PI]}
      />
      <mesh
        geometry={nodes.Bike_Bake_Wheel.geometry}
        material={material}
        position={[-20.918, 0.666, -1.392]}
        rotation={[Math.PI / 2, -0.242, 0]}
      />
      <mesh
        geometry={nodes.Bike_Front_Wheel.geometry}
        material={material}
        position={[-19.978, 0.664, -1.395]}
        rotation={[Math.PI / 2, -0.242, 0]}
      />
      <mesh
        geometry={nodes.Plane107.geometry}
        material={material}
        position={[-20.537, 0.615, -1.385]}
        rotation={[-Math.PI / 2, 0, -Math.PI]}
      />
      <mesh
        geometry={nodes.Bike_Pedal.geometry}
        material={material}
        position={[-20.397, 0.618, -1.376]}
        rotation={[-Math.PI / 2, 0, -Math.PI]}
      />
      <mesh
        geometry={nodes.Actual_Plane.geometry}
        material={material}
        position={[-20.812, 8.181, -1.406]}
        rotation={[Math.PI / 2, -0.029, 0]}
      />
      <mesh
        geometry={nodes.Skeleton_Stick.geometry}
        material={material}
        position={[15.013, 1.303, -1.48]}
        rotation={[Math.PI, 0, Math.PI]}
        scale={[1.523, 1, 1.523]}
      />
      <mesh
        geometry={nodes.Camel_Stick.geometry}
        material={material}
        position={[8.138, 1.997, -1.48]}
        rotation={[Math.PI, 0, Math.PI]}
        scale={[1.523, 1, 1.523]}
      />
      <mesh
        geometry={nodes.Ship_Stick.geometry}
        material={material}
        position={[-2.512, 0.41, -1.48]}
        rotation={[Math.PI, 0, Math.PI]}
        scale={[1.523, 1, 1.523]}
      />
    </group>
  );
}

useGLTF.preload("/models/Moving_Extras.glb");
