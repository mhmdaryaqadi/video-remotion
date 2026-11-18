import React, { useMemo } from "react";
import "@react-three/fiber";
import * as THREE from "three";
import { interpolate, useCurrentFrame } from "remotion";

export type DSNStationId = "usa" | "spain" | "australia";

type DSNStationConfig = {
  readonly id: DSNStationId;
  readonly label: string;
  readonly latDeg: number;
  readonly lonDeg: number;
  readonly accent: string;
};

export const DSN_STATIONS: readonly DSNStationConfig[] = [
  {
    id: "usa",
    label: "Goldstone · AS",
    latDeg: 35,
    lonDeg: -117,
    accent: "#38BDF8",
  },
  {
    id: "spain",
    label: "Madrid · Spanyol",
    latDeg: 40,
    lonDeg: -4,
    accent: "#FF5A26",
  },
  {
    id: "australia",
    label: "Canberra · Australia",
    latDeg: -35,
    lonDeg: 149,
    accent: "#34D399",
  },
];

type EarthDSNModelProps = {
  readonly earthRotY: number;
  readonly earthTiltX?: number;
  readonly scale?: number;
  readonly position?: [number, number, number];
  readonly forceHighlightStation?: DSNStationId | null;
  readonly showBeams?: boolean;
};

const EARTH_RADIUS = 1.24;

const latLonToVec3 = (latDeg: number, lonDeg: number, r: number): THREE.Vector3 => {
  const lat = (latDeg * Math.PI) / 180;
  const lon = (lonDeg * Math.PI) / 180;
  return new THREE.Vector3(
    r * Math.cos(lat) * Math.sin(lon),
    r * Math.sin(lat),
    r * Math.cos(lat) * Math.cos(lon),
  );
};

// Flush tectonic continent patches oriented cleanly tangent to the globe surface
const LAND_CLUSTERS: readonly {
  readonly lat: number;
  readonly lon: number;
  readonly width: number;
  readonly height: number;
  readonly sides: number;
}[] = [
  // North America
  { lat: 46, lon: -106, width: 0.42, height: 0.3, sides: 6 },
  { lat: 34, lon: -96, width: 0.34, height: 0.25, sides: 5 },
  { lat: 56, lon: -114, width: 0.36, height: 0.24, sides: 6 },
  // South America
  { lat: -8, lon: -60, width: 0.32, height: 0.34, sides: 6 },
  { lat: -26, lon: -63, width: 0.22, height: 0.28, sides: 5 },
  // Europe & Iberia
  { lat: 48, lon: 10, width: 0.28, height: 0.22, sides: 6 },
  { lat: 40, lon: -4, width: 0.2, height: 0.16, sides: 5 },
  // Africa
  { lat: 14, lon: 18, width: 0.38, height: 0.34, sides: 6 },
  { lat: -12, lon: 24, width: 0.28, height: 0.3, sides: 6 },
  // Asia / Nusantara
  { lat: 52, lon: 78, width: 0.48, height: 0.34, sides: 7 },
  { lat: 32, lon: 106, width: 0.38, height: 0.3, sides: 6 },
  { lat: -2, lon: 114, width: 0.24, height: 0.15, sides: 5 },
  // Australia
  { lat: -26, lon: 136, width: 0.32, height: 0.24, sides: 6 },
  // Polar ice caps
  { lat: 85, lon: 0, width: 0.4, height: 0.4, sides: 7 },
  { lat: -85, lon: 0, width: 0.44, height: 0.44, sides: 7 },
];

const seeded = (index: number, salt: number): number => {
  const x = Math.sin(index * 91.3 + salt * 217.9) * 43758.5453123;
  return x - Math.floor(x);
};

export const EarthDSNModel: React.FC<EarthDSNModelProps> = ({
  earthRotY,
  earthTiltX = 0.14,
  scale = 1,
  position = [0, 0, 0],
  forceHighlightStation = null,
  showBeams = true,
}) => {
  const frame = useCurrentFrame();

  const dishGeo = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    const rMax = 0.22;
    for (let i = 0; i <= 12; i++) {
      const t = i / 12;
      pts.push(new THREE.Vector2(t * rMax, 0.085 * t * t));
    }
    const geo = new THREE.LatheGeometry(pts, 20);
    geo.computeVertexNormals();
    return geo;
  }, []);

  const stars = useMemo(
    () =>
      Array.from({ length: 64 }, (_, i) => ({
        pos: [
          (seeded(i, 11) - 0.5) * 15,
          (seeded(i, 12) - 0.5) * 18,
          -3.2 - seeded(i, 13) * 7,
        ] as [number, number, number],
        size: 0.015 + seeded(i, 14) * 0.026,
      })),
    [],
  );

  const voyagerDir = useMemo(
    () => new THREE.Vector3(0.08, 0.08, 1.0).normalize(),
    [],
  );

  const globeQuat = useMemo(() => {
    const euler = new THREE.Euler(earthTiltX, earthRotY, -0.06, "XYZ");
    return new THREE.Quaternion().setFromEuler(euler);
  }, [earthTiltX, earthRotY]);

  return (
    <group>
      {/* Background stars */}
      {stars.map((star, idx) => (
        <mesh key={idx} position={star.pos}>
          <sphereGeometry args={[star.size, 6, 6]} />
          <meshBasicMaterial color="#CBD5E1" />
        </mesh>
      ))}

      <group
        position={position}
        quaternion={globeQuat}
        scale={[scale, scale, scale]}
      >
        {/* Ocean Core (crisp low-poly icosahedron) */}
        <mesh receiveShadow>
          <icosahedronGeometry args={[EARTH_RADIUS, 3]} />
          <meshStandardMaterial
            color="#10447E"
            roughness={0.55}
            metalness={0.14}
            flatShading
          />
        </mesh>

        {/* Flush Faceted Continents & Polar Caps hugging the sphere cleanly */}
        {LAND_CLUSTERS.map((land, idx) => {
          const normal = latLonToVec3(land.lat, land.lon, 1).normalize();
          const pos = normal.clone().multiplyScalar(EARTH_RADIUS - 0.012);
          const quat = new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            normal,
          );
          const isIce = Math.abs(land.lat) > 75;
          return (
            <mesh
              key={idx}
              position={[pos.x, pos.y, pos.z]}
              quaternion={quat}
              scale={[land.width, 0.055, land.height]}
            >
              <cylinderGeometry args={[0.92, 1.0, 1, land.sides]} />
              <meshStandardMaterial
                color={isIce ? "#E2E8F0" : "#3B8258"}
                roughness={0.78}
                metalness={0.05}
                flatShading
              />
            </mesh>
          );
        })}

        {/* Atmospheric Rim Glow Shell */}
        <mesh>
          <sphereGeometry args={[EARTH_RADIUS * 1.06, 32, 32]} />
          <meshBasicMaterial
            color="#60A5FA"
            transparent
            opacity={0.12}
            side={THREE.BackSide}
          />
        </mesh>

        {/* 3 Deep Space Network (DSN) 70m Parabolic Antenna Stations */}
        {DSN_STATIONS.map((station) => {
          const localNormal = latLonToVec3(station.latDeg, station.lonDeg, 1).normalize();
          const worldNormal = localNormal.clone().applyQuaternion(globeQuat);
          const alignment = worldNormal.dot(voyagerDir);
          const isActive =
            forceHighlightStation !== null
              ? forceHighlightStation === station.id
              : alignment > 0.24;

          const surfacePos = localNormal.clone().multiplyScalar(EARTH_RADIUS + 0.025);
          const alignQuat = new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            localNormal,
          );

          const pulseFactor = 0.75 + Math.sin(frame * 0.22) * 0.25;

          return (
            <group
              key={station.id}
              position={[surfacePos.x, surfacePos.y, surfacePos.z]}
              quaternion={alignQuat}
            >
              {/* Ground radar pad */}
              <mesh position={[0, 0.015, 0]}>
                <cylinderGeometry args={[0.12, 0.145, 0.04, 12]} />
                <meshStandardMaterial
                  color={isActive ? station.accent : "#475569"}
                  emissive={isActive ? station.accent : "#000000"}
                  emissiveIntensity={isActive ? 0.6 : 0}
                  roughness={0.4}
                />
              </mesh>

              {/* Antenna pedestal mast */}
              <mesh position={[0, 0.09, 0]}>
                <cylinderGeometry args={[0.04, 0.058, 0.13, 8]} />
                <meshStandardMaterial color="#CBD5E1" metalness={0.65} roughness={0.32} />
              </mesh>

              {/* 70m Parabolic Dish */}
              <mesh geometry={dishGeo} position={[0, 0.14, 0]}>
                <meshStandardMaterial
                  color="#F8FAFC"
                  roughness={0.35}
                  metalness={0.22}
                  side={THREE.DoubleSide}
                />
              </mesh>

              {/* Feed horn focal beacon */}
              <mesh position={[0, 0.26, 0]}>
                <sphereGeometry args={[0.045, 10, 10]} />
                <meshStandardMaterial
                  color={isActive ? station.accent : "#64748B"}
                  emissive={isActive ? station.accent : "#000000"}
                  emissiveIntensity={isActive ? 1.9 * pulseFactor : 0}
                />
              </mesh>

              {/* Animated radio uplink rings when locked onto Voyager */}
              {showBeams &&
                isActive &&
                [0, 1, 2].map((ringIdx) => {
                  const progress = ((frame + ringIdx * 12) % 36) / 36;
                  const dist = 0.3 + progress * 0.85;
                  const ringRadius = 0.08 + progress * 0.3;
                  const opacity = interpolate(
                    progress,
                    [0, 0.2, 0.85, 1],
                    [0, 0.88, 0.25, 0],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                  );
                  return (
                    <mesh
                      key={ringIdx}
                      position={[0, dist, 0]}
                      rotation={[Math.PI / 2, 0, 0]}
                    >
                      <torusGeometry args={[ringRadius, 0.015, 6, 22]} />
                      <meshBasicMaterial
                        color={station.accent}
                        transparent
                        opacity={opacity}
                      />
                    </mesh>
                  );
                })}
            </group>
          );
        })}
      </group>
    </group>
  );
};
