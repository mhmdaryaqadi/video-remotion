import React, { useMemo } from "react";
import "@react-three/fiber";
import * as THREE from "three";
import { interpolate, useCurrentFrame } from "remotion";

type VoyagerModelProps = {
  readonly scale?: number;
  readonly position?: [number, number, number];
  readonly rotation?: [number, number, number];
  readonly signalPulse?: boolean;
  readonly showStars?: boolean;
};

const seeded = (index: number, salt: number): number => {
  const x = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453123;
  return x - Math.floor(x);
};

export const VoyagerModel: React.FC<VoyagerModelProps> = ({
  scale = 1,
  position = [0, 0, 0],
  rotation = [0.28, -0.98, -0.1],
  signalPulse = true,
  showStars = true,
}) => {
  const frame = useCurrentFrame();

  // Smooth parabolic 3.7m High-Gain Antenna dish without stepped shadow artifacts
  const dishGeometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    const radius = 1.38;
    const steps = 28;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const r = t * radius;
      const y = 0.27 * t * t;
      points.push(new THREE.Vector2(r, y));
    }
    const geo = new THREE.LatheGeometry(points, 48);
    geo.computeVertexNormals();
    return geo;
  }, []);

  const stars = useMemo(() => {
    if (!showStars) return [];
    return Array.from({ length: 80 }, (_, i) => ({
      pos: [
        (seeded(i, 1) - 0.5) * 16,
        (seeded(i, 2) - 0.5) * 20,
        -3.0 - seeded(i, 3) * 8,
      ] as [number, number, number],
      size: 0.015 + seeded(i, 4) * 0.032,
      color:
        i % 9 === 0 ? "#93C5FD" : i % 13 === 0 ? "#FDE68A" : "#E2E8F0",
    }));
  }, [showStars]);

  const floatY = Math.sin(frame * 0.035) * 0.06;
  const driftRotY = rotation[1] + Math.sin(frame * 0.022) * 0.07;
  const driftRotX = rotation[0] + Math.cos(frame * 0.018) * 0.035;

  const strutAngles = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3];

  return (
    <group>
      {/* Deterministic deep space starfield */}
      {stars.map((star, idx) => (
        <mesh key={idx} position={star.pos}>
          <sphereGeometry args={[star.size, 6, 6]} />
          <meshBasicMaterial color={star.color} />
        </mesh>
      ))}

      {/* Main Voyager 1 Spacecraft Assembly (dish axis points +Z) */}
      <group
        position={[position[0], position[1] + floatY, position[2]]}
        rotation={[driftRotX, driftRotY, rotation[2]]}
        scale={[scale, scale, scale]}
      >
        {/* 1. 3.7m Parabolic High-Gain Dish */}
        <mesh geometry={dishGeometry} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <meshStandardMaterial
            color="#EFF2F7"
            roughness={0.44}
            metalness={0.14}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Dish backing hub & radial support ring */}
        <mesh position={[0, 0, -0.02]}>
          <torusGeometry args={[0.68, 0.025, 10, 32]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.65} roughness={0.32} />
        </mesh>

        {/* Crisp outer dish lip ring */}
        <mesh position={[0, 0, 0.268]}>
          <torusGeometry args={[1.38, 0.026, 12, 44]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.35} roughness={0.4} />
        </mesh>

        {/* 2. Feed Horn & Tripod Struts (+Z focal point) */}
        <group position={[0, 0, 0.7]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.14, 0.11, 0.14, 16]} />
            <meshStandardMaterial color="#1E293B" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.09]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.1, 0.08, 12]} />
            <meshStandardMaterial color="#E5A93C" metalness={0.85} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0, 0.14]}>
            <sphereGeometry args={[0.048, 12, 12]} />
            <meshStandardMaterial
              color="#38BDF8"
              emissive="#38BDF8"
              emissiveIntensity={signalPulse ? 2.0 : 0.4}
            />
          </mesh>
        </group>

        {strutAngles.map((angle, idx) => {
          const rStart = 1.02;
          const xStart = Math.cos(angle) * rStart;
          const yStart = Math.sin(angle) * rStart;
          const zStart = 0.14;
          const startVec = new THREE.Vector3(xStart, yStart, zStart);
          const endVec = new THREE.Vector3(0, 0, 0.7);
          const midVec = startVec.clone().lerp(endVec, 0.5);
          const dir = endVec.clone().sub(startVec);
          const len = dir.length();
          const quat = new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            dir.normalize(),
          );
          return (
            <mesh
              key={idx}
              position={[midVec.x, midVec.y, midVec.z]}
              quaternion={quat}
            >
              <cylinderGeometry args={[0.022, 0.022, len, 8]} />
              <meshStandardMaterial color="#334155" metalness={0.65} roughness={0.35} />
            </mesh>
          );
        })}

        {/* 3. Decagonal Main Bus (Gold Kapton foil & thermal louvers) */}
        <group position={[0, 0, -0.26]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.56, 0.56, 0.42, 10]} />
            <meshStandardMaterial
              color="#E5A93C"
              metalness={0.84}
              roughness={0.3}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.02]}>
            <cylinderGeometry args={[0.575, 0.575, 0.19, 10]} />
            <meshStandardMaterial color="#181A20" metalness={0.5} roughness={0.5} />
          </mesh>
          {/* Iconic Golden Record mounted prominently on outward side of bus */}
          <group position={[0.56, 0.05, -0.02]} rotation={[0, Math.PI / 2, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.17, 0.17, 0.032, 24]} />
              <meshStandardMaterial
                color="#FBBF24"
                metalness={0.94}
                roughness={0.16}
                emissive="#92400E"
                emissiveIntensity={0.18}
              />
            </mesh>
            <mesh position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.09, 0.008, 6, 22]} />
              <meshStandardMaterial color="#78350F" metalness={0.7} roughness={0.3} />
            </mesh>
          </group>
        </group>

        {/* 4. RTG Nuclear Power Boom (lower-back, clearly visible in 3/4 view) */}
        <group position={[-0.36, -0.34, -0.32]} rotation={[0.12, -0.25, 0.62]}>
          <mesh position={[-0.65, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.03, 0.038, 1.38, 8]} />
            <meshStandardMaterial color="#64748B" metalness={0.7} roughness={0.35} />
          </mesh>
          {[-1.02, -1.28, -1.54].map((xOffset, idx) => (
            <group key={idx} position={[xOffset, 0, 0]}>
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.105, 0.105, 0.24, 10]} />
                <meshStandardMaterial color="#1E2028" metalness={0.62} roughness={0.38} />
              </mesh>
              <mesh>
                <boxGeometry args={[0.18, 0.27, 0.05]} />
                <meshStandardMaterial color="#475569" metalness={0.65} roughness={0.35} />
              </mesh>
              <mesh position={[0, 0, 0.05]}>
                <boxGeometry args={[0.08, 0.04, 0.04]} />
                <meshStandardMaterial
                  color="#FF5A26"
                  emissive="#FF5A26"
                  emissiveIntensity={0.65}
                />
              </mesh>
            </group>
          ))}
        </group>

        {/* 5. Science Scan Platform Boom (extending cleanly to side-right) */}
        <group position={[0.42, 0.18, -0.28]} rotation={[0.06, -0.22, -0.22]}>
          <mesh position={[0.62, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.026, 0.034, 1.26, 8]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.75} roughness={0.3} />
          </mesh>
          <group position={[1.28, 0.04, 0]}>
            <mesh>
              <boxGeometry args={[0.38, 0.28, 0.28]} />
              <meshStandardMaterial color="#1E293B" metalness={0.65} roughness={0.35} />
            </mesh>
            <mesh position={[0.16, 0.06, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.072, 0.082, 0.18, 14]} />
              <meshStandardMaterial color="#E5A93C" metalness={0.85} roughness={0.28} />
            </mesh>
            <mesh position={[0.16, 0.06, 0.25]}>
              <sphereGeometry args={[0.058, 12, 12]} />
              <meshStandardMaterial
                color="#38BDF8"
                emissive="#0EA5E9"
                emissiveIntensity={0.5}
                metalness={0.9}
                roughness={0.12}
              />
            </mesh>
          </group>
        </group>

        {/* 6. Long 13m Magnetometer Boom (angled horizontally back-left so it clears header UI) */}
        <group position={[-0.25, -0.05, -0.45]} rotation={[0.08, -0.45, -0.22]}>
          <mesh position={[-1.25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.018, 0.026, 2.5, 6]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.72} roughness={0.35} />
          </mesh>
          <mesh position={[-2.5, 0, 0]}>
            <boxGeometry args={[0.14, 0.1, 0.1]} />
            <meshStandardMaterial color="#E5A93C" metalness={0.82} roughness={0.24} />
          </mesh>
        </group>

        {/* 7. Dual Planetary Radio Astronomy Whip Antennas */}
        <group position={[0, -0.18, -0.4]} rotation={[-0.32, 0, 0]}>
          <mesh position={[0.68, -0.78, -0.35]} rotation={[0.32, 0, -0.66]}>
            <cylinderGeometry args={[0.012, 0.016, 1.9, 6]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.85} roughness={0.22} />
          </mesh>
          <mesh position={[-0.68, -0.78, -0.35]} rotation={[0.32, 0, 0.66]}>
            <cylinderGeometry args={[0.012, 0.016, 1.9, 6]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.85} roughness={0.22} />
          </mesh>
        </group>

        {/* 8. Animated Concentric Telemetry Radio Waves (+Z forward from feed) */}
        {signalPulse &&
          [0, 1, 2].map((waveIdx) => {
            const cycle = ((frame + waveIdx * 16) % 48) / 48;
            const zDist = 1.0 + cycle * 2.0;
            const ringScale = 0.25 + cycle * 1.05;
            const opacity = interpolate(cycle, [0, 0.2, 0.85, 1], [0, 0.72, 0.22, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <mesh
                key={waveIdx}
                position={[0, 0, zDist]}
                scale={[ringScale, ringScale, 1]}
              >
                <torusGeometry args={[0.68, 0.018, 8, 36]} />
                <meshBasicMaterial
                  color={waveIdx % 2 === 0 ? "#38BDF8" : "#FF5A26"}
                  transparent
                  opacity={opacity}
                />
              </mesh>
            );
          })}
      </group>
    </group>
  );
};
