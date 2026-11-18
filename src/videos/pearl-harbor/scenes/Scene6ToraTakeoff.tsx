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
  interpolateColors,
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

const VO_OFFSET = PEARL_HARBOR_TIMING.scene6VoOffset;

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

const ZeroFighterModel: React.FC<{
  readonly position: [number, number, number];
  readonly rotation?: [number, number, number];
  readonly scale?: number;
  readonly propAngle?: number;
}> = ({ position, rotation = [0, 0, 0], scale = 1, propAngle = 0 }) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Main fuselage (nose along -Z toward horizon) */}
      <ToonBox args={[0.11, 0.11, 0.52]} color="#6E7866" position={[0, 0, 0]} />
      {/* Cowling nose engine */}
      <ToonCylinder
        args={[0.056, 0.062, 0.11, 12]}
        color="#272B30"
        position={[0, 0, -0.29]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      {/* Greenhouse cockpit canopy */}
      <ToonBox args={[0.075, 0.065, 0.18]} color="#A5D8F3" position={[0, 0.075, -0.02]} />

      {/* Main low wings */}
      <ToonBox args={[0.72, 0.024, 0.17]} color="#7A8471" position={[0, -0.02, -0.06]} />
      {/* Red Hinomaru roundels on both wings */}
      <ToonCylinder
        args={[0.052, 0.052, 0.028, 16]}
        color={PH_COLORS.alertRed}
        position={[-0.22, -0.018, -0.06]}
      />
      <ToonCylinder
        args={[0.052, 0.052, 0.028, 16]}
        color={PH_COLORS.alertRed}
        position={[0.22, -0.018, -0.06]}
      />

      {/* Tail fin & horizontal stabilizers */}
      <ToonBox args={[0.024, 0.13, 0.1]} color="#6E7866" position={[0, 0.08, 0.22]} />
      <ToonBox args={[0.26, 0.018, 0.08]} color="#7A8471" position={[0, 0.02, 0.22]} />

      {/* Spinning propeller blades + motion blur disc */}
      <group position={[0, 0, -0.36]} rotation={[0, 0, propAngle]}>
        <ToonBox args={[0.26, 0.024, 0.012]} color={PH_COLORS.ink} />
        <ToonBox args={[0.024, 0.26, 0.012]} color={PH_COLORS.ink} />
        <mesh>
          <circleGeometry args={[0.13, 18]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.22} />
        </mesh>
      </group>
    </group>
  );
};

type EscortPlane = {
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly scale: number;
  readonly delay: number;
};

const SQUADRON_FORMATION: readonly EscortPlane[] = [
  { x: -0.58, y: 0.42, z: -0.55, scale: 0.72, delay: 0 },
  { x: 0.56, y: 0.48, z: -0.62, scale: 0.74, delay: 3 },
  { x: -0.95, y: 0.72, z: -1.15, scale: 0.62, delay: 6 },
  { x: 0.92, y: 0.76, z: -1.25, scale: 0.62, delay: 9 },
  { x: -0.32, y: 0.94, z: -1.55, scale: 0.58, delay: 12 },
  { x: 0.34, y: 0.98, z: -1.65, scale: 0.58, delay: 15 },
  { x: 0.0, y: 1.18, z: -2.05, scale: 0.52, delay: 18 },
  { x: -0.72, y: 1.16, z: -2.2, scale: 0.48, delay: 20 },
];

const ToraTakeoffDiorama: React.FC<{ readonly frame: number; readonly fps: number }> = ({
  frame,
  fps,
}) => {
  // Lead Hero Zero climbs off carrier deck (f0..82) then banks smoothly toward Pearl Harbor
  const climbT = interpolate(frame, [0, 82], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const heroY = interpolate(climbT, [0, 0.45, 1], [0.18, 0.24, 0.95]);
  const heroZ = interpolate(frame, [0, 82, 318], [0.65, -0.35, -1.85]);
  const heroPitch = interpolate(climbT, [0, 0.4, 0.8, 1], [0.02, 0.16, 0.24, 0.08]);
  const heroBank = interpolate(frame, [82, 195, 318], [0, -0.22, -0.14], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Camera tracks alongside & behind hero plane ascending from deck into dark-cloud sky
  const camX = interpolate(frame, [0, 82, 200, 318], [0.52, 0.28, -0.45, -0.38], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const camY = interpolate(frame, [0, 82, 200, 318], [0.58, 1.12, 1.38, 1.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const camZ = interpolate(frame, [0, 82, 200, 318], [2.15, 1.45, 0.45, -0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Dramatic sky darkening when "langit Hawaii langsung digelapin" hits (~f86..135)
  const skyColor = interpolateColors(
    frame,
    [0, 80, 130, 318],
    ["#B8D9EE", "#99BDD9", "#5E728A", "#4A5C73"],
  );

  // Carrier deck drops away behind as plane climbs; Oahu shoreline glides in ahead below clouds
  const deckScroll = interpolate(frame, [0, 96], [0, 2.2]);

  return (
    <>
      <CameraRig
        position={[camX, camY, camZ]}
        lookAt={[0, heroY + 0.08, heroZ - 0.55]}
      />
      <DocLightRig ambient={0.92} keyPosition={[5, 8, 4]} keyIntensity={1.1} />

      {/* Dynamic Sky Backdrop Wall */}
      <mesh position={[0, 1.8, -7.5]}>
        <planeGeometry args={[24, 14]} />
        <meshBasicMaterial color={skyColor} />
      </mesh>

      {/* Ocean Sea Level */}
      <ToonBox args={[18, 0.3, 18]} color={PH_COLORS.oceanDeep} position={[0, -0.35, -2]} />

      {/* Akagi Aircraft Carrier Flight Deck during Takeoff (f0..138) */}
      {frame < 138 && (
        <group position={[0, 0, deckScroll]}>
          <ToonBox args={[0.92, 0.16, 4.2]} color="#B89058" position={[0, -0.05, 0.2]} />
          <ToonBox args={[0.88, 0.12, 4.15]} color="#475569" position={[0, -0.18, 0.2]} />
          {/* White center guide dashes */}
          {[-1.2, -0.4, 0.4, 1.2].map((dz) => (
            <mesh key={dz} position={[0, 0.034, dz]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.045, 0.42]} />
              <meshBasicMaterial color="#FAF9F5" />
            </mesh>
          ))}
          {/* Island tower edge on right */}
          <ToonBox args={[0.2, 0.55, 0.65]} color="#64748B" position={[0.52, 0.25, -0.4]} />
        </group>
      )}

      {/* Green Oahu Coastal Mountains below horizon ahead */}
      <group position={[0.1, -0.1, -5.2]}>
        <ToonBox
          args={[3.2, 0.65, 1.2]}
          color={PH_COLORS.landGreen}
          position={[-0.6, 0.15, 0]}
          rotation={[0, 0.15, 0]}
        />
        <ToonBox
          args={[2.4, 0.5, 1.0]}
          color="#588545"
          position={[0.95, 0.08, 0.2]}
          rotation={[0, -0.18, 0]}
        />
      </group>

      {/* Fluffy Cel-Shaded Hawaiian Morning Clouds */}
      <group position={[-0.95, 0.48, -2.5]}>
        <ToonSphere radius={0.26} color="#F8FAFC" scale={[1.8, 0.62, 1.0]} />
      </group>
      <group position={[0.95, 0.54, -2.9]}>
        <ToonSphere radius={0.28} color="#F8FAFC" scale={[1.9, 0.65, 1.0]} />
      </group>

      {/* Hero Lead A6M Zero Fighter */}
      <ZeroFighterModel
        position={[0, heroY, heroZ]}
        rotation={[heroPitch, 0, heroBank]}
        scale={1.08}
        propAngle={frame * 0.85}
      />

      {/* Squadron Waves Flying Across & Darkening the Sky (f88+) */}
      {SQUADRON_FORMATION.map((plane, idx) => {
        const enter = spring({
          frame: Math.max(0, frame - (86 + plane.delay)),
          fps,
          config: SPRING_CONFIGS.snappy,
        });
        if (enter <= 0.02) return null;
        return (
          <ZeroFighterModel
            key={idx}
            position={[plane.x, plane.y, heroZ + plane.z]}
            rotation={[0.06, 0, -0.12]}
            scale={plane.scale * enter}
            propAngle={frame * 0.9 + idx}
          />
        );
      })}
    </>
  );
};

export const Scene6ToraTakeoff: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const headerEnter = spring({
    frame: Math.max(0, frame - 4),
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  // Exact VO frames in vo-scene6 (offset +8):
  // Tora #1: 228+8=236 | Tora #2: 251+8=259 | Tora #3: 276+8=284
  const toraStamps = [
    { label: "TORA!", at: 236, bg: PH_COLORS.highlightOrange },
    { label: "TORA!", at: 259, bg: PH_COLORS.alertRed },
    { label: "TORA!", at: 284, bg: PH_COLORS.ink },
  ] as const;

  return (
    <AbsoluteFill style={{ backgroundColor: "#B8D9EE" }}>
      <Sequence from={VO_OFFSET}>
        <Audio src={staticFile("audio/pearl-harbor/vo/vo-scene6.mp3")} volume={1} />
      </Sequence>

      <Sequence from={6} durationInFrames={195}>
        <Audio src={staticFile("audio/pearl-harbor/sfx/propeller.wav")} volume={0.28} />
      </Sequence>
      <Sequence from={172} durationInFrames={45}>
        <Audio src={staticFile("audio/pearl-harbor/sfx/typewriter.wav")} volume={0.28} />
      </Sequence>
      <Sequence from={236} durationInFrames={22}>
        <Audio src={staticFile("audio/pearl-harbor/sfx/radar-ping.wav")} volume={0.28} />
      </Sequence>
      <Sequence from={259} durationInFrames={22}>
        <Audio src={staticFile("audio/pearl-harbor/sfx/radar-ping.wav")} volume={0.28} />
      </Sequence>
      <Sequence from={284} durationInFrames={28}>
        <Audio src={staticFile("audio/pearl-harbor/sfx/radar-ping.wav")} volume={0.34} />
      </Sequence>

      <AbsoluteFill>
        <ThreeCanvas
          width={width}
          height={height}
          camera={{ position: [0.52, 0.58, 2.15], fov: 46 }}
          shadows
        >
          <ToraTakeoffDiorama frame={frame} fps={fps} />
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
            backgroundColor: PH_COLORS.alertRed,
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
          07:55 PAGI · SERANGAN DIMULAI
        </span>
      </div>

      {/* Synchronized "TORA! TORA! TORA!" Punch Stamps */}
      <div
        style={{
          position: "absolute",
          top: 485,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 18,
          pointerEvents: "none",
          zIndex: 22,
        }}
      >
        {toraStamps.map((stamp, idx) => {
          if (frame < stamp.at) return null;
          const pop = spring({
            frame: Math.max(0, frame - stamp.at),
            fps,
            config: SPRING_CONFIGS.bouncy,
          });
          return (
            <div
              key={idx}
              style={{
                transform: `scale(${pop}) rotate(${(idx - 1) * 3}deg)`,
                backgroundColor: stamp.bg,
                color: "#FFFFFF",
                border: `3px solid ${PH_COLORS.ink}`,
                borderRadius: 14,
                padding: "12px 24px",
                fontFamily: FONTS.sans,
                fontSize: 40,
                fontWeight: 900,
                letterSpacing: "0.04em",
                boxShadow: "5px 5px 0px #1A1D24",
              }}
            >
              {stamp.label}
            </div>
          );
        })}
      </div>

      {/* Callout: Tora Tora Tora Radio Code */}
      <DocCallout
        x={56}
        y={178}
        targetX={168}
        targetY={860}
        enterFrame={172}
        exitFrame={312}
        badgeText="SANDI RADIO FUCHIDA"
        title='Kode "Tora! Tora! Tora!"'
        subtitle="Menandakan serangan kejutan total telah berhasil dicapai."
        source="Catatan Penerbangan Mitsuo Fuchida"
        accentColor={PH_COLORS.alertRed}
        maxWidth={520}
      />

      <DocCaptions
        words={PEARL_HARBOR_AUDIO_DATA["vo-scene6"].words}
        voOffset={VO_OFFSET}
        highlightColor={PH_COLORS.highlightOrange}
        bottom={290}
      />
    </AbsoluteFill>
  );
};
