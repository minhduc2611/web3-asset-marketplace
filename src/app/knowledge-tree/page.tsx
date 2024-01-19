"use client";
import { OrbitControls, Stars, Stats } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Color } from "three";
import { Physics, useBox, usePlane } from "@react-three/cannon";

function Node(props) {
  // This reference will give us direct access to the mesh
  // const meshRef = useRef();
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  // useFrame((state, delta) => (meshRef.current.rotation.x += delta));
  // Return view, these are regular three.js elements expressed in JSX
  const [meshRef, api] = useBox(() => ({ mass: 1, position: [0, 10, 0] }));
  const jump = () => {
    api.velocity.set(0, 2, 0)
  }
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={(event) => jump()}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}
function Camera(props) {
  const ref = useRef();
  // const { setDefaultCamera } = useThree()
  // Make the camera known to the system
  // useEffect(() => void setDefaultCamera(ref.current), [])
  // Update it every frame
  useFrame(() => ref.current.updateMatrixWorld());
  return (
    <perspectiveCamera
      ref={ref}
      {...props}
      manual
      onUpdate={(c) => c.updateProjectionMatrix()}
    />
  );
}
function Plane() {
  // Register plane as a physics body with zero mass
  // const ref = useCannon({ mass: 0 }, body => {
  //  body.addShape(new CANNON.Plane())
  //  body.position.set(...position)
  // })
  const [meshRef] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0] }));
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry attach="geometry" args={[300, 300]} />
      <meshPhongMaterial attach="material" color="#272727" />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight />
      <spotLight position={[10, 15, 10]} angle={0.3}/>
      {/* <mesh rotation={[0, 10, 0]}>
        <boxGeometry attach="geometry" args={[1, 1, 1]} />
        <meshStandardMaterial attach="material" color={"#6be092"} />
      </mesh> */}
    </>
  );
}
export default function Home() {
  const [angle, setAngle] = useState("");
  const [penumbra, setPenumbra] = useState("");
  const [x, setX] = useState("");
  const bgColor = new Color(0x17171b);
  return (
    <main className="h-[100vh] min-w-screen p-10 md:p-24">
      <div className="controller">
        <div>
          <label>angle</label>
          <input
            type="range"
            value={angle}
            onChange={(e) => setAngle(e.target.value)}
          />
        </div>
        <div>
          <label>penumbra</label>
          <input
            type="range"
            value={penumbra}
            onChange={(e) => setPenumbra(e.target.value)}
          />
        </div>
        <div>
          <label>camera x</label>
          <input
            type="range"
            value={x}
            onChange={(e) => setX(e.target.value)}
          />
        </div>
      </div>
      <Canvas>
        <Stars />
        <Scene />
        <color attach="background" args={[bgColor.r, bgColor.g, bgColor.b]} />
        {/* <pointLight position={[10, 10, 10]} /> */}
        {/* <mesh>
          <sphereGeometry />
          <meshStandardMaterial color="hotpink" />
        </mesh> */}
        {/* <ambientLight intensity={Math.PI / 2} />
        <spotLight /> */}

        <Camera position={[Number(x), 9, 10]} />
        <OrbitControls />
        <Stats />
        <Physics>
          <Node position={[2, 2, 0]} />
          <Plane />
        </Physics>
        {/* 
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Node position={[-1.2, 0, 0]} />
        <Node position={[1.2, 0, 0]} /> */}
      </Canvas>
    </main>
  );
}

// https://www.spaceo.ca/blog/best-app-ideas/
