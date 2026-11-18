import React, { useMemo } from "react";
import "@react-three/fiber";
import * as THREE from "three";
import { DOC_COLORS } from "./docTheme";

/**
 * Creates a crisp 3-step cel-shading gradient DataTexture (shadow, midtone, lit)
 * using NearestFilter so Three.js MeshToonMaterial produces clean illustrated bands.
 */
export const useToonGradientMap = (): THREE.DataTexture => {
  return useMemo(() => {
    const shades = new Uint8Array([118, 188, 255]);
    const tex = new THREE.DataTexture(shades, 3, 1, THREE.RedFormat);
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.generateMipmaps = false;
    tex.needsUpdate = true;
    return tex;
  }, []);
};

type ToonBoxProps = {
  readonly args: [number, number, number];
  readonly color: string;
  readonly position?: [number, number, number];
  readonly rotation?: [number, number, number];
  readonly scale?: [number, number, number];
  readonly outlineColor?: string;
  readonly outlineThreshold?: number;
  readonly opacity?: number;
  readonly transparent?: boolean;
  readonly emissive?: string;
  readonly emissiveIntensity?: number;
};

export const ToonBox: React.FC<ToonBoxProps> = ({
  args,
  color,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  outlineColor = DOC_COLORS.outline,
  outlineThreshold = 20,
  opacity = 1,
  transparent = false,
  emissive = "#000000",
  emissiveIntensity = 0,
}) => {
  const gradientMap = useToonGradientMap();

  const edgesGeo = useMemo(() => {
    const box = new THREE.BoxGeometry(...args);
    const edges = new THREE.EdgesGeometry(box, outlineThreshold);
    box.dispose();
    return edges;
  }, [args, outlineThreshold]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={args} />
        <meshToonMaterial
          color={color}
          gradientMap={gradientMap}
          opacity={opacity}
          transparent={transparent}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      <lineSegments geometry={edgesGeo}>
        <lineBasicMaterial
          color={outlineColor}
          transparent={transparent}
          opacity={opacity}
        />
      </lineSegments>
    </group>
  );
};

type ToonCylinderProps = {
  readonly args: [number, number, number, number?];
  readonly color: string;
  readonly position?: [number, number, number];
  readonly rotation?: [number, number, number];
  readonly scale?: [number, number, number];
  readonly outlineColor?: string;
  readonly outlineThreshold?: number;
  readonly opacity?: number;
  readonly transparent?: boolean;
  readonly emissive?: string;
  readonly emissiveIntensity?: number;
};

export const ToonCylinder: React.FC<ToonCylinderProps> = ({
  args,
  color,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  outlineColor = DOC_COLORS.outline,
  outlineThreshold = 24,
  opacity = 1,
  transparent = false,
  emissive = "#000000",
  emissiveIntensity = 0,
}) => {
  const gradientMap = useToonGradientMap();
  const [rt, rb, h, seg = 20] = args;

  const edgesGeo = useMemo(() => {
    const cyl = new THREE.CylinderGeometry(rt, rb, h, seg);
    const edges = new THREE.EdgesGeometry(cyl, outlineThreshold);
    cyl.dispose();
    return edges;
  }, [rt, rb, h, seg, outlineThreshold]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[rt, rb, h, seg]} />
        <meshToonMaterial
          color={color}
          gradientMap={gradientMap}
          opacity={opacity}
          transparent={transparent}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      <lineSegments geometry={edgesGeo}>
        <lineBasicMaterial
          color={outlineColor}
          transparent={transparent}
          opacity={opacity}
        />
      </lineSegments>
    </group>
  );
};

type ToonSphereProps = {
  readonly radius: number;
  readonly color: string;
  readonly position?: [number, number, number];
  readonly scale?: [number, number, number];
  readonly outlineScale?: number;
  readonly outlineColor?: string;
  readonly segments?: number;
};

export const ToonSphere: React.FC<ToonSphereProps> = ({
  radius,
  color,
  position = [0, 0, 0],
  scale = [1, 1, 1],
  outlineScale = 1.035,
  outlineColor = DOC_COLORS.outline,
  segments = 20,
}) => {
  const gradientMap = useToonGradientMap();

  return (
    <group position={position} scale={scale}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[radius, segments, segments]} />
        <meshToonMaterial color={color} gradientMap={gradientMap} />
      </mesh>
      {/* Inverted-hull dark outline for curved toon spheres/clouds */}
      <mesh scale={[outlineScale, outlineScale, outlineScale]}>
        <sphereGeometry args={[radius, segments, segments]} />
        <meshBasicMaterial color={outlineColor} side={THREE.BackSide} />
      </mesh>
    </group>
  );
};

/**
 * Standard bright flat documentary light rig for @ngulikin style scenes.
 */
export const DocLightRig: React.FC<{
  readonly ambient?: number;
  readonly keyPosition?: [number, number, number];
  readonly keyIntensity?: number;
}> = ({ ambient = 0.92, keyPosition = [5, 8, 6], keyIntensity = 1.25 }) => {
  return (
    <>
      <ambientLight intensity={ambient} color="#FFFDF7" />
      <directionalLight
        position={keyPosition}
        intensity={keyIntensity}
        color="#FFF9EB"
        castShadow
      />
      <directionalLight
        position={[-6, 3, 4]}
        intensity={0.35}
        color="#DDE8F5"
      />
    </>
  );
};
