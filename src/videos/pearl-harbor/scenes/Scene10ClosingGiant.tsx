import React, { useLayoutEffect, useMemo } from "react";
import "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import { Audio } from "@remotion/media";
import { ThreeCanvas } from "@remotion/three";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import * as THREE from "three";
import {
  DocCallout,
  DocCaptions,
  DocLightRig,
  ToonBox,
  ToonCylinder,
  ToonSphere,
  useToonGradientMap,
} from "../../../shared/docStyle";
import { PEARL_HARBOR_AUDIO_DATA } from "../subtitles";
import { FONTS, PEARL_HARBOR_TIMING, PH_COLORS, SPRING_CONFIGS } from "../theme";

const VO_OFFSET = PEARL_HARBOR_TIMING.scene10VoOffset;

const CameraRig: React.FC<{
  readonly position: [number, number, number];
  readonly lookAt: [number, number, number];
}> = ({ position, lookAt }) => {
  const { camera } = useThree();
  const [px, py, pz] = position;
  const [lx, ly, lz] = lookAt;

  useLayoutEffect(() => {
    camera.position.set(px, py, pz);
    camera.lookAt(lx, ly, lz);
    camera.updateProjectionMatrix();
  }, [camera, px, py, pz, lx, ly, lz]);

  return null;
};

const ToonLandmass: React.FC<{
  readonly points: readonly [number, number][];
  readonly color: string;
  readonly depth?: number;
}> = ({ points, color, depth = 0.14 }) => {
  const gradientMap = useToonGradientMap();

  const { geom, edges } = useMemo(() => {
    const shape = new THREE.Shape();
    points.forEach(([x, y], i) => {
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    });
    shape.closePath();

    const extruded = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.018,
      bevelSize: 0.018,
      bevelSegments: 1,
    });
    extruded.rotateX(-Math.PI / 2);
    const edgeGeo = new THREE.EdgesGeometry(extruded, 26);
    return { geom: extruded, edges: edgeGeo };
  }, [points, depth]);

  return (
    <group>
      <mesh geometry={geom} castShadow receiveShadow>
        <meshToonMaterial color={color} gradientMap={gradientMap} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={PH_COLORS.outline} />
      </lineSegments>
    </group>
  );
};

const JAPAN_ARC: readonly [number, number][] = [
  [-1.12, -0.15],
  [-0.96, 0.08],
  [-0.82, 0.36],
  [-0.72, 0.56],
  [-0.64, 0.46],
  [-0.76, 0.14],
  [-0.95, -0.2],
];

const US_COAST: readonly [number, number][] = [
  [0.72, 0.92],
  [1.48, 0.92],
  [1.48, -0.82],
  [1.04, -0.82],
  [0.92, -0.35],
  [0.8, 0.1],
  [0.72, 0.52],
];

const AlliedMiniFleetShip: React.FC<{
  readonly position: [number, number, number];
}> = ({ position }) => (
  <group position={position}>
    <ToonBox args={[0.24, 0.045, 0.08]} color="#334155" position={[0, 0.02, 0]} />
    <ToonBox args={[0.08, 0.045, 0.05]} color="#475569" position={[0.03, 0.06, 0]} />
    <ToonCylinder
      args={[0.012, 0.014, 0.06, 8]}
      color={PH_COLORS.highlightOrange}
      position={[-0.04, 0.06, 0]}
    />
  </group>
);

const ClosingGiantDiorama: React.FC<{ readonly frame: number; readonly fps: number }> = ({
  frame,
  fps,
}) => {
  // Phase 1 (f0..85): Zoomed near US industrial West Coast factories waking up
  // Phase 2 (f85..220): Wide majestic pull-back watching Allied fleets & reversal arrow sweep West!
  const camX = interpolate(frame, [0, 85, 210], [0.42, 0.12, 0.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const camY = interpolate(frame, [0, 85, 210], [2.45, 3.35, 3.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const camZ = interpolate(frame, [0, 85, 210], [2.75, 3.55, 3.98], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const factoryAwake = spring({
    frame: Math.max(0, frame - 14),
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  const tideT = interpolate(frame, [78, 200], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const steamLoop1 = (frame * 0.025) % 1;
  const steamLoop2 = (frame * 0.025 + 0.5) % 1;

  return (
    <>
      <CameraRig position={[camX, camY, camZ]} lookAt={[camX * 0.4, -0.05, 0]} />
      <DocLightRig ambient={0.96} keyPosition={[5, 9, 4]} keyIntensity={1.15} />

      {/* Studio Tabletop Surface */}
      <ToonBox args={[9.5, 0.2, 7.5]} color="#E6DFCF" position={[0, -0.44, 0]} />

      {/* Pacific Map Relief Board */}
      <group>
        <ToonBox args={[3.42, 0.24, 2.38]} color="#D6C7AA" position={[0, -0.2, 0]} />
        <ToonBox args={[3.18, 0.14, 2.14]} color={PH_COLORS.oceanBlue} position={[0, -0.05, 0]} />
        {[-1.0, -0.5, 0.0, 0.5, 1.0].map((gx) => (
          <mesh key={gx} position={[gx, 0.023, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.01, 2.1]} />
            <meshBasicMaterial color="#3B7BB8" />
          </mesh>
        ))}
      </group>

      {/* Continents */}
      <group position={[0, 0.02, 0]}>
        <ToonLandmass points={JAPAN_ARC} color={PH_COLORS.landGreen} depth={0.14} />
        <ToonLandmass points={US_COAST} color={PH_COLORS.landSand} depth={0.15} />

        {/* US Industrial Arsenal Factories on California Coast */}
        <group position={[1.05, 0.16, -0.08]} scale={[1, 0.75 + 0.25 * factoryAwake, 1]}>
          {/* Factory hall 1 & 2 */}
          <ToonBox args={[0.32, 0.16, 0.28]} color="#475569" position={[0, 0.08, 0]} />
          <ToonBox args={[0.26, 0.14, 0.24]} color="#64748B" position={[0.08, 0.07, 0.34]} />
          {/* Smokestacks */}
          <ToonCylinder args={[0.032, 0.04, 0.26, 10]} color={PH_COLORS.highlightOrange} position={[-0.08, 0.22, -0.05]} />
          <ToonCylinder args={[0.032, 0.04, 0.26, 10]} color={PH_COLORS.highlightOrange} position={[0.04, 0.22, -0.05]} />

          {/* Cheerful Cel-Shaded White Industrial Steam Puffs */}
          <ToonSphere
            radius={0.05 + steamLoop1 * 0.04}
            color="#FFFFFF"
            position={[-0.08, 0.36 + steamLoop1 * 0.38, -0.05]}
          />
          <ToonSphere
            radius={0.045 + steamLoop2 * 0.04}
            color="#FFFFFF"
            position={[0.04, 0.36 + steamLoop2 * 0.38, -0.05]}
          />
        </group>

        {/* Hawaii Midway Pin */}
        <group position={[-0.02, 0.04, 0.42]}>
          <ToonSphere radius={0.065} color={PH_COLORS.landGreen} scale={[1.4, 0.6, 0.9]} />
        </group>
      </group>

      {/* Reversing Allied Fleet Wave Marching West across Pacific (f72+) */}
      {frame >= 72 && (
        <group>
          <AlliedMiniFleetShip
            position={[interpolate(tideT, [0, 1], [0.68, -0.26]), 0.04, -0.35]}
          />
          <AlliedMiniFleetShip
            position={[interpolate(tideT, [0, 1], [0.8, -0.14]), 0.04, 0.02]}
          />
          <AlliedMiniFleetShip
            position={[interpolate(tideT, [0, 1], [0.74, -0.2]), 0.04, 0.18]}
          />

          {/* Bold Orange Reversal Sweep Arrow Westward */}
          <group position={[0.16, 0.14, -0.16]}>
            <ToonBox
              args={[1.15 * tideT, 0.04, 0.12]}
              color={PH_COLORS.highlightOrange}
              position={[0.575 * (1 - tideT), 0, 0]}
            />
            {tideT > 0.35 && (
              <ToonCylinder
                args={[0.01, 0.14, 0.22, 3]}
                color={PH_COLORS.highlightOrange}
                position={[0.575 - 1.15 * tideT, 0.01, 0]}
                rotation={[0, 0, Math.PI / 2]}
              />
            )}
          </group>
        </group>
      )}
    </>
  );
};

export const Scene10ClosingGiant: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const headerEnter = spring({
    frame: Math.max(0, frame - 4),
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const endBadgeEnter = spring({
    frame: Math.max(0, frame - 122),
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#DCE9F4" }}>
      <Sequence from={VO_OFFSET}>
        <Audio src={staticFile("audio/pearl-harbor/vo/vo-scene10.mp3")} volume={1} />
      </Sequence>

      <Sequence from={26} durationInFrames={45}>
        <Audio src={staticFile("audio/pearl-harbor/sfx/typewriter.wav")} volume={0.28} />
      </Sequence>

      <AbsoluteFill>
        <ThreeCanvas
          width={width}
          height={height}
          camera={{ position: [0.42, 2.45, 2.75], fov: 46 }}
          shadows
        >
          <ClosingGiantDiorama frame={frame} fps={fps} />
        </ThreeCanvas>
      </AbsoluteFill>

      {/* Top Chapter Tag */}
      <div
        style={{
          position: "absolute",
          top: 86,
          left: 56,
          zIndex: 20,
          opacity: headerEnter,
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          backgroundColor: PH_COLORS.paperCard,
          border: `2.5px solid ${PH_COLORS.ink}`,
          borderRadius: 12,
          padding: "10px 20px",
          boxShadow: "4px 4px 0px #1A1D24",
        }}
      >
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: 999,
            backgroundColor: PH_COLORS.highlightOrange,
            border: `2px solid ${PH_COLORS.ink}`,
          }}
        />
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.06em",
            color: PH_COLORS.ink,
          }}
        >
          1941 — 1945 · TITIK BALIK PERANG DUNIA II
        </span>
      </div>

      {/* Callout: US War Production Surge */}
      <DocCallout
        x={56}
        y={178}
        targetX={965}
        targetY={835}
        enterFrame={26}
        exitFrame={118}
        badgeText="ARSENAL DEMOKRASI"
        title="Raksasa Industri AS Bangkit"
        subtitle="Pabrik AS memproduksi puluhan kapal induk & ribuan pesawat."
        source="The National WWII Museum"
        accentColor={PH_COLORS.highlightOrange}
        maxWidth={510}
      />

      {/* Clean Editorial End Card Pill at Finale */}
      {frame >= 122 && (
        <div
          style={{
            position: "absolute",
            top: 235,
            left: 56,
            right: 56,
            zIndex: 24,
            opacity: endBadgeEnter,
            transform: `translateY(${(1 - endBadgeEnter) * 18}px)`,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              backgroundColor: PH_COLORS.paperCard,
              border: `3px solid ${PH_COLORS.ink}`,
              borderRadius: 16,
              padding: "18px 28px",
              boxShadow: "6px 6px 0px #1A1D24",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 18,
                fontWeight: 800,
                color: PH_COLORS.highlightOrange,
                letterSpacing: "0.1em",
              }}
            >
              SEJARAH PEARL HARBOR · 7 DESEMBER 1941
            </div>
            <div
              style={{
                fontFamily: FONTS.sans,
                fontSize: 32,
                fontWeight: 900,
                color: PH_COLORS.ink,
                marginTop: 6,
              }}
            >
              Serangan Mendadak yang Mengubah Sejarah Dunia
            </div>
          </div>
        </div>
      )}

      <DocCaptions
        words={PEARL_HARBOR_AUDIO_DATA["vo-scene10"].words}
        voOffset={VO_OFFSET}
        highlightColor={PH_COLORS.highlightOrange}
        bottom={290}
      />
    </AbsoluteFill>
  );
};
