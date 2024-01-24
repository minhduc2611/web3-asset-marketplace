import type { CylinderProps } from "@react-three/cannon";
import { useCompoundBody } from "@react-three/cannon";
import { useGLTF } from "@react-three/drei";
import { forwardRef } from "react";
import type { Group, Material, Mesh } from "three";
import { type GLTF } from "three-stdlib";

// import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

useGLTF.preload("/wheel.glb");

// Initially Auto-generated by: https://github.com/pmndrs/gltfjsx

type WheelGLTF = GLTF & {
  materials: Record<"mt_PalleteBR", Material>;
  nodes: Record<"Car03_1_WhFR002", Mesh>;
};

type WheelProps = CylinderProps & {
  leftSide?: boolean;
  radius: number;
};

// eslint-disable-next-line react/display-name
export const Wheel = forwardRef<Group, WheelProps>(
  ({ leftSide, radius = 0.7, ...props }, ref) => {
    const { materials, nodes } = useGLTF("/Tire-transformed.glb") as WheelGLTF;

    useCompoundBody(
      () => ({
        collisionFilterGroup: 0,
        mass: 1,
        material: "wheel",
        shapes: [
          {
            args: [radius, radius, 0.5, 16],
            rotation: [0, 0, -Math.PI / 2],
            type: "Cylinder",
          },
        ],
        type: "Kinematic",
        ...props,
      }),
      ref
    );

    return (
      <group ref={ref}>
        <mesh
          geometry={nodes.Car03_1_WhFR002.geometry}
          material={materials.mt_PalleteBR}
          position={[0, 0, 0]}
        />
      </group>
    );
  }
);