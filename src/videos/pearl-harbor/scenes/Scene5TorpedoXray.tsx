import React, { useLayoutEffect } from "react";
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
import {
  DocCallout,
  DocCaptions,
  DocLightRig,
  ToonBox,
  ToonCylinder,
  ToonSphere,
} from "../../../shared/docStyle";
import { PEARL_HARBOR_AUDIO_DATA } from "../subtitles";
import { FONTS, PEARL_HARBOR_TIMING, PH_COLORS, SPRING_CONFIGS } from "../theme";

const VO_OFFSET = PEARL_HARBOR_TIMING.scene5VoOffset;

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

const TorpedoModel: React.FC<{
  readonly position: [number, number, number];
  readonly rotationZ?: number;
  readonly scale?: number;
  readonly xrayMode?: boolean;
  readonly woodFinProgress?: number;
}> = ({
  position,
  rotationZ = 0,
  scale = 1,
  xrayMode = false,
  woodFinProgress = 0,
}) => {
  const bodyColor = xrayMode ? "#38BDF8" : "#475569";
  const noseColor = xrayMode ? PH_COLORS.highlightOrange : "#DC2626";
  const opacity = xrayMode ? 0.42 : 1;

  return (
    <group position={position} rotation={[0, 0, rotationZ]} scale={scale}>
      {/* Main cylindrical torpedo hull (oriented along +X axis -> nose on right) */}
      <ToonCylinder
        args={[0.065, 0.065, 0.56, 16]}
        color={bodyColor}
        rotation={[0, 0, Math.PI / 2]}
        transparent={xrayMode}
        opacity={opacity}
      />
      {/* Nose warhead cone */}
      <ToonSphere
        radius={0.066}
        color={noseColor}
        position={[0.28, 0, 0]}
        scale={[1.35, 0.98, 0.98]}
      />
      {/* Internal X-Ray Gyroscope & Engine Core visible when xrayMode=true */}
      {xrayMode && (
        <group>
          <ToonCylinder
            args={[0.036, 0.036, 0.24, 12]}
            color="#F59E0B"
            position={[-0.04, 0, 0]}
            rotation={[0, 0, Math.PI / 2]}
          />
          <ToonBox args={[0.09, 0.07, 0.07]} color="#FACC15" position={[0.14, 0, 0]} />
        </group>
      )}
      {/* Tail propeller cone */}
      <ToonCylinder
        args={[0.042, 0.064, 0.1, 14]}
        color="#334155"
        position={[-0.31, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      />
      {/* Standard metal tail stabilizer fins */}
      <ToonBox args={[0.08, 0.17, 0.014]} color="#1E293B" position={[-0.32, 0, 0]} />
      <ToonBox args={[0.08, 0.014, 0.17]} color="#1E293B" position={[-0.32, 0, 0]} />

      {/* Warm Wooden Anti-Dive Extension Fins ("Sirip Kayu") */}
      {woodFinProgress > 0.02 && (
        <group
          position={[
            -0.37 - (1 - woodFinProgress) * 0.26,
            (1 - woodFinProgress) * 0.16,
            0,
          ]}
          scale={woodFinProgress}
        >
          {/* Distinct wooden box extensions */}
          <ToonBox
            args={[0.16, 0.21, 0.024]}
            color="#D29552"
            position={[0, 0, 0]}
          />
          <ToonBox
            args={[0.16, 0.024, 0.21]}
            color="#BA7E3E"
            position={[0, 0, 0]}
          />
          {/* Wood collar clamp */}
          <ToonCylinder
            args={[0.052, 0.052, 0.06, 12]}
            color="#8B5A2B"
            position={[0.05, 0, 0]}
            rotation={[0, 0, Math.PI / 2]}
          />
        </group>
      )}
    </group>
  );
};

const TorpedoXrayDiorama: React.FC<{ readonly frame: number; readonly fps: number }> = ({
  frame,
  fps,
}) => {
  // Phase 1 (f0..172): Old torpedo drops and plunges deep, getting stuck in 12m harbor mud!
  const oldDropT = interpolate(frame, [16, 78], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  const oldX = interpolate(oldDropT, [0, 1], [-0.95, -0.22]);
  const oldY = interpolate(oldDropT, [0, 0.3, 1], [0.88, 0.35, -0.78]);
  const oldRot = interpolate(oldDropT, [0, 0.6, 1], [-0.28, -0.72, -0.82]);

  // Phase 2A (f172..262): Camera zooms to X-Ray blueprint Type 91 torpedo + Wooden Fins snap on!
  // Phase 2B (f260..354): Modified Type 91 drops into water, skims shallow ABOVE mud & strikes battleship keel!
  const isXrayShowcase = frame >= 172 && frame < 262;
  const woodFinSnap = spring({
    frame: Math.max(0, frame - 208),
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  const shallowT = interpolate(frame, [260, 336], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const shallowX = interpolate(shallowT, [0, 0.32, 1], [-1.05, -0.45, 0.65]);
  const shallowY = interpolate(shallowT, [0, 0.25, 0.45, 1], [0.92, 0.1, 0.22, 0.26]);
  const shallowRot = interpolate(shallowT, [0, 0.28, 0.45, 1], [-0.36, -0.18, 0.04, 0.02]);

  // Camera choreography: aquarium wide -> zoom X-ray cutaway -> aquarium shallow skim
  const camX = interpolate(
    frame,
    [0, 165, 192, 250, 276, 354],
    [0.0, -0.05, -0.04, -0.04, 0.05, 0.14],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) },
  );
  const camY = interpolate(
    frame,
    [0, 165, 192, 250, 276, 354],
    [0.12, -0.06, 0.26, 0.26, 0.14, 0.16],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) },
  );
  const camZ = interpolate(
    frame,
    [0, 165, 192, 250, 276, 354],
    [4.15, 3.85, 3.22, 3.22, 3.85, 3.65],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) },
  );

  // Impact splash burst when modified torpedo hits ship keel at f330+
  const hitSpring = spring({
    frame: Math.max(0, frame - 330),
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  // Mud impact puff at f77
  const mudPuff = spring({
    frame: Math.max(0, frame - 77),
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  return (
    <>
      <CameraRig position={[camX, camY, camZ]} lookAt={[camX, camY - 0.06, 0]} />
      <DocLightRig ambient={0.96} keyPosition={[4, 7, 5]} keyIntensity={1.15} />

      {/* Warm Documentary Blueprint Studio Backdrop */}
      <ToonBox args={[8.5, 6.5, 0.2]} color="#EDF4FA" position={[0, 0.2, -1.35]} />

      {/* Cutaway Harbor Water & Mud Cross-Section Tank */}
      <group position={[0, -0.1, 0]}>
        {/* Bright daytime sky strip above water */}
        <mesh position={[0, 0.85, -0.6]}>
          <planeGeometry args={[3.4, 0.9]} />
          <meshBasicMaterial color="#CBE2F5" />
        </mesh>

        {/* Cross-section water volume (translucent teal-blue) */}
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[2.95, 1.38, 0.85]} />
          <meshToonMaterial color="#3B9AD9" transparent opacity={0.44} />
        </mesh>
        {/* Top water surface highlight plane */}
        <ToonBox
          args={[2.95, 0.04, 0.86]}
          color="#67C2F5"
          position={[0, 0.58, 0]}
          transparent
          opacity={0.78}
        />

        {/* Muddy 12m Seabed Floor Slab */}
        <ToonBox args={[3.0, 0.34, 0.92]} color="#78573B" position={[0, -0.96, 0]} />
        <ToonBox args={[2.96, 0.06, 0.9]} color="#5C412A" position={[0, -0.79, 0]} />

        {/* Depth Ruler Markers along left tank wall (0m -> 12m) */}
        <ToonBox args={[0.04, 1.4, 0.04]} color={PH_COLORS.ink} position={[-1.44, -0.1, 0.44]} />
        {[0.56, 0.22, -0.12, -0.46, -0.78].map((tickY, idx) => (
          <ToonBox
            key={idx}
            args={[0.12, 0.025, 0.04]}
            color={idx === 4 ? PH_COLORS.alertRed : PH_COLORS.ink}
            position={[-1.38, tickY, 0.44]}
          />
        ))}

        {/* US Battleship Hull Target floating on right water surface (keel at y=+0.22) */}
        <group position={[0.96, 0.58, 0]}>
          {/* Lower red anti-fouling hull below waterline */}
          <ToonBox args={[0.72, 0.26, 0.42]} color="#B9382C" position={[0, -0.14, 0]} />
          {/* Grey armored upper hull & deck */}
          <ToonBox args={[0.76, 0.14, 0.44]} color="#64748B" position={[0, 0.06, 0]} />
          {/* Superstructure tower & turret */}
          <ToonBox args={[0.28, 0.22, 0.26]} color="#475569" position={[0.12, 0.24, 0]} />
          <ToonBox args={[0.16, 0.08, 0.16]} color="#475569" position={[-0.18, 0.17, 0]} />
          <ToonCylinder
            args={[0.015, 0.015, 0.2, 8]}
            color={PH_COLORS.ink}
            position={[-0.28, 0.18, 0]}
            rotation={[0, 0, Math.PI / 2]}
          />
        </group>
      </group>

      {/* Standard Torpedo stuck nose-first in harbor mud (visible in Phase 1 & still stuck in background later!) */}
      <TorpedoModel
        position={[oldX, oldY, 0.06]}
        rotationZ={oldRot}
        scale={0.85}
        xrayMode={false}
      />

      {/* Mud splash clumps around stuck torpedo */}
      {frame >= 76 && (
        <group position={[-0.08, -0.84, 0.16]} scale={mudPuff}>
          <ToonSphere radius={0.07} color="#5C412A" position={[-0.08, 0.02, 0.04]} />
          <ToonSphere radius={0.055} color="#78573B" position={[0.1, 0.04, 0.02]} />
          <ToonSphere radius={0.045} color="#5C412A" position={[0.02, 0.08, 0.05]} />
        </group>
      )}

      {/* Hero X-Ray Blueprint Showcase of Type 91 Torpedo + Wooden Fins (f172..262) */}
      {isXrayShowcase && (
        <group position={[-0.04, 0.24, 0.65]}>
          {/* Dark blueprint framing card behind X-ray specimen */}
          <ToonBox args={[2.1, 0.88, 0.04]} color="#0F293A" position={[0, 0, -0.22]} />
          <TorpedoModel
            position={[0.04, 0, 0.08]}
            rotationZ={0.04}
            scale={1.12}
            xrayMode={true}
            woodFinProgress={woodFinSnap}
          />
        </group>
      )}

      {/* Active Type 91 Torpedo with Wooden Fins skimming shallow above the 12m mud (f260+) */}
      {frame >= 260 && (
        <TorpedoModel
          position={[shallowX, shallowY, 0.12]}
          rotationZ={shallowRot}
          scale={0.88}
          xrayMode={false}
          woodFinProgress={1}
        />
      )}

      {/* Cel-shaded Water & Impact Plume when Type 91 reaches ship keel (f330+) */}
      {frame >= 330 && (
        <group position={[0.64, 0.34, 0.24]} scale={hitSpring}>
          <ToonSphere radius={0.14} color={PH_COLORS.highlightOrange} />
          <ToonSphere radius={0.11} color="#FACC15" position={[-0.06, 0.12, 0.04]} />
          <ToonSphere radius={0.1} color="#FFFFFF" position={[0.04, 0.22, 0.02]} />
        </group>
      )}
    </>
  );
};

export const Scene5TorpedoXray: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const headerEnter = spring({
    frame: Math.max(0, frame - 4),
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#EDF4FA" }}>
      <Sequence from={VO_OFFSET}>
        <Audio src={staticFile("audio/pearl-harbor/vo/vo-scene5.mp3")} volume={1} />
      </Sequence>

      <Sequence from={32} durationInFrames={55}>
        <Audio src={staticFile("audio/pearl-harbor/sfx/splash.wav")} volume={0.32} />
      </Sequence>
      <Sequence from={70} durationInFrames={45}>
        <Audio src={staticFile("audio/pearl-harbor/sfx/typewriter.wav")} volume={0.28} />
      </Sequence>
      <Sequence from={208} durationInFrames={45}>
        <Audio src={staticFile("audio/pearl-harbor/sfx/typewriter.wav")} volume={0.3} />
      </Sequence>
      <Sequence from={268} durationInFrames={55}>
        <Audio src={staticFile("audio/pearl-harbor/sfx/splash.wav")} volume={0.34} />
      </Sequence>
      <Sequence from={328} durationInFrames={26}>
        <Audio src={staticFile("audio/pearl-harbor/sfx/explosion-soft.wav")} volume={0.36} />
      </Sequence>

      <AbsoluteFill>
        <ThreeCanvas
          width={width}
          height={height}
          camera={{ position: [0.0, 0.12, 4.15], fov: 46 }}
          shadows
        >
          <TorpedoXrayDiorama frame={frame} fps={fps} />
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
            backgroundColor: frame >= 172 ? PH_COLORS.xrayCyan : PH_COLORS.highlightOrange,
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
          X-RAY TEKNOLOGI · TORPEDO TYPE 91
        </span>
      </div>

      {/* Depth 12M visual indicator pill */}
      {frame >= 32 && frame < 174 && (
        <div
          style={{
            position: "absolute",
            top: 1125,
            left: 72,
            zIndex: 18,
            backgroundColor: PH_COLORS.alertRed,
            color: "#FFFFFF",
            border: `2.5px solid ${PH_COLORS.ink}`,
            borderRadius: 8,
            padding: "6px 14px",
            fontFamily: FONTS.mono,
            fontSize: 22,
            fontWeight: 800,
            boxShadow: "3px 3px 0px #1A1D24",
          }}
        >
          KEDALAMAN: 12 METER
        </div>
      )}

      {/* Callout #1: Stuck in 12m mud */}
      <DocCallout
        x={56}
        y={178}
        targetX={445}
        targetY={1315}
        enterFrame={70}
        exitFrame={170}
        badgeText="KELEMAHAN TORPEDO LAMA"
        title="Nyangkut di Lumpur 12 Meter"
        subtitle="Torpedo standar menyelam terlalu dalam sebelum naik ke permukaan."
        source="US Navy Bureau of Ordnance"
        accentColor={PH_COLORS.alertRed}
        maxWidth={510}
      />

      {/* Callout #2: Wooden Fin Type 91 Modification */}
      <DocCallout
        x={490}
        y={184}
        targetX={295}
        targetY={945}
        enterFrame={208}
        exitFrame={272}
        badgeText="MODIFIKASI SIRIP KAYU"
        title="Sirip Ekor Kayu Type 91"
        subtitle="Menahan torpedo agar meluncur dangkal di kedalaman aman."
        source="IJN Technical & Torpedo Monograph"
        accentColor={PH_COLORS.xrayCyan}
        maxWidth={515}
      />

      <DocCaptions
        words={PEARL_HARBOR_AUDIO_DATA["vo-scene5"].words}
        voOffset={VO_OFFSET}
        highlightColor={PH_COLORS.highlightOrange}
        bottom={290}
      />
    </AbsoluteFill>
  );
};
