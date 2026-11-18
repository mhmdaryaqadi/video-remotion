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

const VO_OFFSET = PEARL_HARBOR_TIMING.scene2VoOffset;

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
  readonly position?: [number, number, number];
}> = ({ points, color, depth = 0.14, position = [0, 0, 0] }) => {
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
    <group position={position}>
      <mesh geometry={geom} castShadow receiveShadow>
        <meshToonMaterial color={color} gradientMap={gradientMap} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={PH_COLORS.outline} />
      </lineSegments>
    </group>
  );
};

const MiniOilTanker: React.FC<{
  readonly position: [number, number, number];
  readonly rotationY?: number;
  readonly bobOffset?: number;
}> = ({ position, rotationY = 0, bobOffset = 0 }) => {
  return (
    <group
      position={[position[0], position[1] + bobOffset, position[2]]}
      rotation={[0, rotationY, 0]}
      scale={0.82}
    >
      <ToonBox args={[0.32, 0.055, 0.11]} color={PH_COLORS.tankerRed} position={[0, 0.028, 0]} />
      <ToonBox args={[0.34, 0.035, 0.115]} color="#39414A" position={[0, 0.068, 0]} />
      <ToonCylinder
        args={[0.028, 0.028, 0.05, 10]}
        color={PH_COLORS.oilAmber}
        position={[-0.06, 0.1, 0]}
      />
      <ToonCylinder
        args={[0.028, 0.028, 0.05, 10]}
        color={PH_COLORS.oilAmber}
        position={[0.02, 0.1, 0]}
      />
      <ToonBox args={[0.08, 0.075, 0.095]} color={PH_COLORS.paperCard} position={[0.1, 0.115, 0]} />
      <ToonCylinder
        args={[0.018, 0.022, 0.06, 10]}
        color={PH_COLORS.ink}
        position={[0.11, 0.175, 0]}
      />
    </group>
  );
};

const OilBarrelStack: React.FC<{
  readonly position: [number, number, number];
  readonly scale?: number;
  readonly color?: string;
}> = ({ position, scale = 1, color = PH_COLORS.oilAmber }) => (
  <group position={position} scale={scale}>
    <ToonCylinder args={[0.045, 0.045, 0.11, 12]} color={color} position={[0, 0.055, 0]} />
    <ToonCylinder args={[0.045, 0.045, 0.11, 12]} color="#D97706" position={[0.095, 0.055, 0.025]} />
    <ToonCylinder args={[0.045, 0.045, 0.11, 12]} color={color} position={[0.045, 0.165, 0.012]} />
  </group>
);

// Compact 9:16 portrait coordinates so Japan (left) + Hawaii (south-center) + US (right) all stay inside frame!
const JAPAN_HONSHU: readonly [number, number][] = [
  [-1.08, -0.05],
  [-0.95, 0.12],
  [-0.84, 0.34],
  [-0.78, 0.56],
  [-0.7, 0.5],
  [-0.75, 0.24],
  [-0.88, 0.02],
  [-1.02, -0.1],
];
const JAPAN_HOKKAIDO: readonly [number, number][] = [
  [-0.82, 0.64],
  [-0.74, 0.82],
  [-0.62, 0.76],
  [-0.69, 0.6],
];
const JAPAN_KYUSHU: readonly [number, number][] = [
  [-1.18, -0.12],
  [-1.08, -0.06],
  [-1.06, -0.24],
  [-1.16, -0.28],
];
const ASIA_EDGE: readonly [number, number][] = [
  [-1.5, -0.45],
  [-1.5, 0.95],
  [-1.18, 0.92],
  [-1.12, 0.6],
  [-1.24, 0.28],
  [-1.18, 0.0],
  [-1.34, -0.45],
];
const US_WEST_COAST: readonly [number, number][] = [
  [0.78, 0.95],
  [1.52, 0.95],
  [1.52, -0.82],
  [1.08, -0.82],
  [0.98, -0.35],
  [0.86, 0.08],
  [0.78, 0.52],
];

const SHIPPING_NODES = 10;

const PacificMapDiorama: React.FC<{ readonly frame: number; readonly fps: number }> = ({
  frame,
  fps,
}) => {
  // Camera smoothly frames Japan closeup -> full Pacific route -> punch into Red X blockade
  const camX = interpolate(
    frame,
    [0, 70, 155, 200, 264],
    [-0.36, 0.0, 0.02, -0.02, -0.04],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) },
  );
  const camY = interpolate(
    frame,
    [0, 70, 155, 200, 264],
    [3.35, 3.95, 4.1, 3.35, 3.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) },
  );
  const camZ = interpolate(
    frame,
    [0, 70, 155, 200, 264],
    [3.25, 3.85, 3.95, 3.15, 2.98],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) },
  );

  const lookX = interpolate(frame, [0, 75, 165, 205], [-0.32, 0.0, 0.0, -0.04], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lookY = interpolate(frame, [0, 75, 205], [-0.08, -0.1, -0.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Embargo drop at frame 170 ("Amerika mutusin total pasokan minyak")
  const embargoActive = frame >= 170;
  const embargoDrop = spring({
    frame: Math.max(0, frame - 170),
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const barrierY = interpolate(embargoDrop, [0, 1], [1.75, 0.24], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shockScale = interpolate(embargoDrop, [0, 0.6, 1], [0.2, 1.32, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Oil route runs from USA (+0.76) to Japan (-0.74) along northern Pacific arc (z ~ -0.50)
  // Both tankers stay cleanly EAST of the Embargo X (-0.22) with zero geometry overlap!
  const effectiveSailFrame = Math.min(frame, 168);
  const tanker1T = interpolate(effectiveSailFrame, [0, 168], [0.2, 0.34], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tanker2T = interpolate(effectiveSailFrame, [0, 168], [0.04, 0.16], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const routePos = (t: number): [number, number, number] => {
    const x = interpolate(t, [0, 1], [0.76, -0.74]);
    const z = -0.18 - Math.sin(t * Math.PI) * 0.34;
    return [x, 0.06, z];
  };

  const cloudDrift = interpolate(frame, [0, 264], [-0.25, 0.25]);

  return (
    <>
      <CameraRig position={[camX, camY, camZ]} lookAt={[lookX, lookY, 0.05]} />
      <DocLightRig ambient={0.96} keyPosition={[5, 9, 4]} keyIntensity={1.15} />

      {/* Warm Documentary Studio Map Desk Surrounding the Relief Map */}
      <ToonBox args={[9.5, 0.2, 7.5]} color="#E6DFCF" position={[0, -0.44, 0]} />

      {/* Tabletop Documentary Map Base Slab */}
      <group>
        <ToonBox args={[3.42, 0.24, 2.38]} color="#D6C7AA" position={[0, -0.2, 0]} />
        <ToonBox args={[3.18, 0.14, 2.14]} color={PH_COLORS.oceanBlue} position={[0, -0.05, 0]} />

        {/* Stylized latitude/longitude grid hairlines */}
        {[-1.0, -0.5, 0.0, 0.5, 1.0].map((gx) => (
          <mesh key={`lon-${gx}`} position={[gx, 0.023, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.01, 2.1]} />
            <meshBasicMaterial color="#3B7BB8" />
          </mesh>
        ))}
        {[-0.6, 0.0, 0.6].map((gz) => (
          <mesh key={`lat-${gz}`} position={[0, 0.023, gz]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.14, 0.01]} />
            <meshBasicMaterial color="#3B7BB8" />
          </mesh>
        ))}
      </group>

      {/* Extruded Cel-Shaded Continents & Islands */}
      <group position={[0, 0.02, 0]}>
        <ToonLandmass points={ASIA_EDGE} color="#9BB57C" depth={0.11} />
        <ToonLandmass
          points={JAPAN_HONSHU}
          color={embargoActive ? "#E68A73" : PH_COLORS.landGreen}
          depth={0.14}
        />
        <ToonLandmass
          points={JAPAN_HOKKAIDO}
          color={embargoActive ? "#E68A73" : PH_COLORS.landGreen}
          depth={0.13}
        />
        <ToonLandmass
          points={JAPAN_KYUSHU}
          color={embargoActive ? "#E68A73" : PH_COLORS.landGreen}
          depth={0.13}
        />
        <ToonLandmass points={US_WEST_COAST} color={PH_COLORS.landSand} depth={0.15} />

        {/* Stylized Mt Fuji cone + Torii landmark on Japan */}
        <group position={[-0.84, 0.15, -0.18]}>
          <ToonCylinder args={[0.028, 0.11, 0.14, 10]} color="#4B5563" position={[0, 0.07, 0]} />
          <ToonCylinder args={[0.006, 0.044, 0.055, 10]} color="#FFFFFF" position={[0, 0.145, 0]} />
        </group>

        {/* Japan Fuel Tanks (shrink after embargo cutoff) */}
        <group position={[-0.98, 0.16, -0.45]}>
          <OilBarrelStack
            position={[0, 0, 0]}
            scale={embargoActive ? 0.52 : 0.88}
            color={embargoActive ? PH_COLORS.alertRed : PH_COLORS.oilAmber}
          />
        </group>

        {/* US Oil Derrick + Barrel Reserves on California Coast */}
        <group position={[1.0, 0.17, -0.22]}>
          <OilBarrelStack position={[0, 0, 0]} scale={0.95} />
          <ToonCylinder args={[0.016, 0.06, 0.24, 4]} color="#475569" position={[0.16, 0.12, -0.12]} />
        </group>

        {/* Hawaii Island Cluster in Southern-Central Pacific (far clear of shipping arc!) */}
        <group position={[-0.02, 0.04, 0.56]}>
          <ToonSphere radius={0.075} color={PH_COLORS.landGreen} scale={[1.45, 0.6, 0.9]} />
          <ToonSphere
            radius={0.045}
            color="#5C8D47"
            position={[-0.12, -0.01, -0.06]}
            scale={[1.2, 0.55, 0.85]}
          />
          <ToonCylinder args={[0.011, 0.011, 0.22, 8]} color={PH_COLORS.ink} position={[0, 0.12, 0]} />
          <ToonSphere radius={0.048} color={PH_COLORS.highlightOrange} position={[0, 0.24, 0]} />
        </group>
      </group>

      {/* Northern Pacific Oil Supply Route Arc Nodes */}
      {Array.from({ length: SHIPPING_NODES }).map((_, idx) => {
        const t = idx / (SHIPPING_NODES - 1);
        const pos = routePos(t);
        const westOfCut = pos[0] < -0.04;
        const nodeColor = embargoActive
          ? westOfCut
            ? "#64748B"
            : PH_COLORS.alertRed
          : PH_COLORS.oilAmber;
        return (
          <ToonCylinder
            key={idx}
            args={[0.026, 0.026, 0.022, 12]}
            color={nodeColor}
            position={[pos[0], 0.036, pos[2]]}
          />
        );
      })}

      {/* Animated Oil Tankers Steaming US -> Japan (halt cleanly EAST of the Red X) */}
      <MiniOilTanker
        position={routePos(tanker1T)}
        rotationY={-0.14}
        bobOffset={Math.sin(frame * 0.14) * 0.012}
      />
      <MiniOilTanker
        position={routePos(tanker2T)}
        rotationY={0.12}
        bobOffset={Math.cos(frame * 0.14) * 0.012}
      />

      {/* Giant 3D Red Embargo X Barrier Slamming Down over the Shipping Arc at f240 */}
      {embargoActive && (
        <group position={[-0.22, barrierY, -0.49]}>
          <ToonBox
            args={[0.68, 0.13, 0.1]}
            color={PH_COLORS.alertRed}
            rotation={[0, 0, Math.PI / 4]}
          />
          <ToonBox
            args={[0.68, 0.13, 0.1]}
            color={PH_COLORS.alertRed}
            rotation={[0, 0, -Math.PI / 4]}
          />
          <mesh
            position={[0, -0.18, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={[shockScale, shockScale, 1]}
          >
            <ringGeometry args={[0.28, 0.36, 28]} />
            <meshBasicMaterial color={PH_COLORS.alertRed} />
          </mesh>
        </group>
      )}

      {/* Drifting Stylized Cel-Shaded Clouds framing upper horizon */}
      <group position={[cloudDrift - 0.55, 0.72, -0.82]}>
        <ToonSphere radius={0.12} color="#FFFFFF" scale={[1.5, 0.7, 0.9]} />
        <ToonSphere
          radius={0.095}
          color="#FFFFFF"
          position={[0.14, -0.015, 0.03]}
          scale={[1.2, 0.65, 0.85]}
        />
      </group>
      <group position={[-cloudDrift + 0.65, 0.68, 0.52]}>
        <ToonSphere radius={0.105} color="#FFFFFF" scale={[1.4, 0.68, 0.88]} />
        <ToonSphere
          radius={0.08}
          color="#FFFFFF"
          position={[-0.12, -0.015, 0.025]}
          scale={[1.15, 0.6, 0.85]}
        />
      </group>
    </>
  );
};

export const Scene2PacificEmbargo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const headerEnter = spring({
    frame: Math.max(0, frame - 4),
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const routeBadgeOpacity = interpolate(frame, [55, 70, 260], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#DCE9F4" }}>
      <Sequence from={VO_OFFSET}>
        <Audio src={staticFile("audio/pearl-harbor/vo/vo-scene2.mp3")} volume={1} />
      </Sequence>

      <Sequence from={72} durationInFrames={45}>
        <Audio src={staticFile("audio/pearl-harbor/sfx/typewriter.wav")} volume={0.28} />
      </Sequence>
      <Sequence from={170} durationInFrames={65}>
        <Audio src={staticFile("audio/pearl-harbor/sfx/explosion-soft.wav")} volume={0.38} />
      </Sequence>
      <Sequence from={174} durationInFrames={45}>
        <Audio src={staticFile("audio/pearl-harbor/sfx/typewriter.wav")} volume={0.28} />
      </Sequence>

      <AbsoluteFill>
        <ThreeCanvas
          width={width}
          height={height}
          camera={{ position: [-0.36, 3.35, 3.25], fov: 46 }}
          shadows
        >
          <PacificMapDiorama frame={frame} fps={fps} />
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
            backgroundColor: frame >= 170 ? PH_COLORS.alertRed : PH_COLORS.oilAmber,
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
          JULI 1941 · SAMUDRA PASIFIK
        </span>
      </div>

      {/* Clear Country Labels pinned directly above the landmasses */}
      {routeBadgeOpacity > 0.01 && (
        <div
          style={{
            position: "absolute",
            top: 520,
            left: 52,
            right: 52,
            display: "flex",
            justifyContent: "space-between",
            pointerEvents: "none",
            zIndex: 18,
            opacity: routeBadgeOpacity,
          }}
        >
          <div
            style={{
              backgroundColor: PH_COLORS.paperCard,
              border: `2.5px solid ${PH_COLORS.ink}`,
              borderRadius: 10,
              padding: "6px 16px",
              fontFamily: FONTS.sans,
              fontSize: 22,
              fontWeight: 800,
              color: PH_COLORS.ink,
              boxShadow: "3px 3px 0px #1A1D24",
            }}
          >
            JEPANG
          </div>
          <div
            style={{
              backgroundColor: PH_COLORS.paperCard,
              border: `2.5px solid ${PH_COLORS.ink}`,
              borderRadius: 10,
              padding: "6px 16px",
              fontFamily: FONTS.sans,
              fontSize: 22,
              fontWeight: 800,
              color: PH_COLORS.ink,
              boxShadow: "3px 3px 0px #1A1D24",
            }}
          >
            AMERIKA AS
          </div>
        </div>
      )}

      {/* Callout #1: Points cleanly right at the oil tankers */}
      <DocCallout
        x={56}
        y={178}
        targetX={690}
        targetY={755}
        enterFrame={72}
        exitFrame={165}
        badgeText="PASOKAN ENERGI 1941"
        title="80% Minyak Jepang dari AS"
        subtitle="Kapal tanker melintasi Pasifik setiap minggu."
        source="US Department of State Archives"
        accentColor={PH_COLORS.oilAmber}
        maxWidth={510}
      />

      {/* Callout #2: Points cleanly right onto the Red X Embargo Barrier */}
      <DocCallout
        x={490}
        y={184}
        targetX={455}
        targetY={735}
        enterFrame={174}
        exitFrame={258}
        badgeText="TITIK BALIK"
        title="Embargo Minyak Total AS"
        subtitle="Aset Jepang dibekukan, keran bahan bakar ditutup."
        source="Franklin D. Roosevelt Library"
        accentColor={PH_COLORS.alertRed}
        maxWidth={515}
      />

      <DocCaptions
        words={PEARL_HARBOR_AUDIO_DATA["vo-scene2"].words}
        voOffset={VO_OFFSET}
        highlightColor={PH_COLORS.highlightOrange}
        bottom={290}
      />
    </AbsoluteFill>
  );
};
