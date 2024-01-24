import { OrthographicCamera } from "@react-three/drei";

export function Cameras() {
  return (
    <OrthographicCamera
      position={[0, 100, 0]}
      rotation={[(-1 * Math.PI) / 2, 0, Math.PI]}
      zoom={15}
    />
  );
}
