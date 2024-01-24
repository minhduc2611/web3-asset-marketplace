// This demo is also playable without installation here:
// https://codesandbox.io/s/basic-demo-forked-ebr0x

import type {
  CylinderArgs,
  CylinderProps,
  PlaneProps,
} from "@react-three/cannon";
import { Debug, Physics, useCylinder, usePlane } from "@react-three/cannon";
import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import type { Group, Mesh } from "three";

import Vehicle from "./Vehicle";
import React from "react";
import { useToggledControl } from "./hooks/use-toggled-control";
import { Cameras } from "./Cameras";

function Plane(props: PlaneProps) {
  const [ref] = usePlane(
    () => ({ material: "ground", type: "Static", ...props }),
    useRef<Group>(null)
  );
  return (
    <group ref={ref}>
      <mesh receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#303030" />
      </mesh>
    </group>
  );
}

function Pillar(props: CylinderProps) {
  const args: CylinderArgs = [0.7, 0.7, 5, 16];
  const [ref] = useCylinder(
    () => ({
      args,
      mass: 10,
      ...props,
    }),
    useRef<Mesh>(null)
  );
  return (
    <mesh ref={ref} castShadow>
      <cylinderGeometry args={args} />
      <meshNormalMaterial />
    </mesh>
  );
}

const style = {
  color: "white",
  fontSize: "1.2em",
  left: 50,
  position: "absolute",
  top: 20,
} as const;

const VehicleScene = () => {
  const ToggledDebug = useToggledControl(Debug, "?");

  return (
    <>
      {/* camera={{ fov: 50, position: [0, 5, 15] }} */}
      <Canvas
        shadows
        gl={{
          // todo: stop using legacy lights
          useLegacyLights: true,
        }}
      >
        {/* <fog attach="fog" args={["#171720", 10, 50]} /> */}
        {/* <color attach="background" args={["#171720"]} /> */}
        {/* <Cameras /> */}
        <PerspectiveCamera makeDefault={true} fov={75} position={[0, 20, 20]} />
        <ambientLight intensity={1} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.5}
          intensity={1}
          castShadow
          penumbra={1}
        />
        <Physics
          broadphase="SAP"
          defaultContactMaterial={{
            contactEquationRelaxation: 4,
            friction: 1e-3,
          }}
          allowSleep
        >
          <ToggledDebug>
            <Plane rotation={[-Math.PI / 2, 0, 0]} userData={{ id: "floor" }} />
            <Vehicle
              position={[0, 2, 0]}
              rotation={[0, -Math.PI / 4, 0]}
              angularVelocity={[0, 0.5, 0]}
            />
            <Pillar position={[-5, 2.5, -5]} userData={{ id: "pillar-1" }} />
            <Pillar position={[0, 2.5, -5]} userData={{ id: "pillar-2" }} />
            <Pillar position={[5, 2.5, -5]} userData={{ id: "pillar-3" }} />
          </ToggledDebug>
        </Physics>
        <Environment files="textures/dikhololo_night_1k.hdr" />
        <Suspense fallback={null}>
          <Environment preset="city" />
        </Suspense>
        <OrbitControls />
      </Canvas>
      <div style={style}>
        <pre>
          * WASD to drive, space to brake
          <br />r to reset
          <br />? to debug
        </pre>
      </div>
    </>
  );
};

export default VehicleScene;
