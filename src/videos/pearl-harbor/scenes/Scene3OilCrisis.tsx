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

const VO_OFFSET = PEARL_HARBOR_TIMING.scene3VoOffset;

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

const MiniTacticalShip: React.FC<{
  readonly position: [number, number, number];
  readonly color?: string;
  readonly rotationY?: number;
}> = ({ position, color = "#64748B", rotationY = 0 }) => (
  <group position={position} rotation={[0, rotationY, 0]}>
    <ToonBox args={[0.26, 0.04, 0.07]} color={color} position={[0, 0.02, 0]} />
    <ToonBox args={[0.1, 0.045, 0.05]} color="#475569" position={[-0.02, 0.06, 0]} />
    <ToonCylinder args={[0.01, 0.01, 0.05, 8]} color="#1E293B" position={[0.02, 0.095, 0]} />
  </group>
);

const OilCrisisDiorama: React.FC<{ readonly frame: number; readonly fps: number }> = ({
  frame,
  fps,
}) => {
  // Phase 1 (f0..146): Oil reserves gauge drops to red E, war engine stalls
  // Phase 2 (f146..339): Tactical Pearl Harbor strike map on war room table
  const fuelLevel = interpolate(frame, [8, 92], [0.85, 0.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  // Positive Z rotation = CCW toward LEFT red zone; Negative Z = CW toward RIGHT green zone
  const needleAngle = interpolate(fuelLevel, [0, 1], [1.18, -1.15]);

  // Miniature Zero propeller spins fast at start, sputters and stalls as fuel runs dry
  const propSpin = interpolate(frame, [0, 58, 110, 339], [0, 26, 36, 36], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Tactical strike arrow & Pearl Harbor target reveal at f150+ ("Pilihannya cuma mundur...")
  const strikeProgress = spring({
    frame: Math.max(0, frame - 152),
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const targetDrop = spring({
    frame: Math.max(0, frame - 210),
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  // Camera pans from left fuel gauge + stalled machine -> right tactical map table
  const camX = interpolate(
    frame,
    [0, 120, 185, 339],
    [-0.45, -0.35, 0.42, 0.36],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) },
  );
  const camY = interpolate(
    frame,
    [0, 120, 185, 339],
    [1.35, 1.25, 1.72, 1.52],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) },
  );
  const camZ = interpolate(
    frame,
    [0, 120, 185, 339],
    [3.85, 3.45, 3.65, 3.3],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) },
  );
  const lookX = interpolate(frame, [0, 120, 185, 339], [-0.4, -0.35, 0.35, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lookY = interpolate(frame, [0, 120, 185, 339], [0.42, 0.4, 0.16, 0.14], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isCriticalFuel = frame >= 78;
  const flashPulse = isCriticalFuel ? 0.5 + 0.5 * Math.sin(frame * 0.35) : 0;

  return (
    <>
      <CameraRig position={[camX, camY, camZ]} lookAt={[lookX, lookY, 0.0]} />
      <DocLightRig ambient={0.94} keyPosition={[4, 7, 5]} keyIntensity={1.15} />

      {/* Warm Command Room Backdrop Walls & Oak Floor */}
      <ToonBox args={[7.2, 4.4, 0.16]} color="#E6DFCF" position={[0, 1.1, -1.65]} />
      <ToonBox args={[7.2, 1.1, 0.19]} color="#B6AD97" position={[0, -0.75, -1.63]} />
      <ToonBox args={[7.2, 0.08, 0.22]} color={PH_COLORS.woodDark} position={[0, -0.2, -1.61]} />
      <ToonBox args={[7.2, 0.16, 4.6]} color={PH_COLORS.woodFloor} position={[0, -1.35, -0.1]} />

      {/* Large Wooden Strategy & Engineering Table */}
      <group position={[0, -0.35, 0]}>
        <ToonBox args={[3.4, 0.12, 1.75]} color={PH_COLORS.deskWood} position={[0, 0, 0]} />
        <ToonBox args={[0.16, 0.96, 0.16]} color={PH_COLORS.woodDark} position={[-1.45, -0.52, 0.68]} />
        <ToonBox args={[0.16, 0.96, 0.16]} color={PH_COLORS.woodDark} position={[1.45, -0.52, 0.68]} />
        <ToonBox args={[0.16, 0.96, 0.16]} color={PH_COLORS.woodDark} position={[-1.45, -0.52, -0.68]} />
        <ToonBox args={[0.16, 0.96, 0.16]} color={PH_COLORS.woodDark} position={[1.45, -0.52, -0.68]} />
      </group>

      {/* LEFT SIDE OF TABLE: Analog Fuel Pressure Meter & Oil Drum Reserve */}
      <group position={[-0.65, -0.28, -0.1]}>
        {/* Heavy slate industrial pedestal */}
        <ToonBox args={[0.92, 0.2, 0.56]} color={PH_COLORS.cabinetSlate} position={[0, 0.1, 0]} />

        {/* Circular Analog Fuel Gauge Housing */}
        <group position={[0, 0.68, 0.02]}>
          <ToonCylinder
            args={[0.48, 0.5, 0.14, 28]}
            color={PH_COLORS.cabinetOlive}
            rotation={[Math.PI / 2, 0, 0]}
          />
          <mesh position={[0, 0, 0.074]}>
            <circleGeometry args={[0.4, 32]} />
            <meshBasicMaterial color={PH_COLORS.paperCard} />
          </mesh>
          {/* Red Empty danger zone arc (left lower wedge) */}
          <mesh position={[0, 0, 0.076]} rotation={[0, 0, Math.PI * 0.72]}>
            <ringGeometry args={[0.25, 0.36, 20, 1, 0, Math.PI * 0.42]} />
            <meshBasicMaterial color={PH_COLORS.alertRed} />
          </mesh>
          {/* Amber caution arc */}
          <mesh position={[0, 0, 0.076]} rotation={[0, 0, Math.PI * 0.35]}>
            <ringGeometry args={[0.25, 0.36, 20, 1, 0, Math.PI * 0.36]} />
            <meshBasicMaterial color={PH_COLORS.oilAmber} />
          </mesh>
          {/* Green safe arc */}
          <mesh position={[0, 0, 0.076]} rotation={[0, 0, -Math.PI * 0.08]}>
            <ringGeometry args={[0.25, 0.36, 20, 1, 0, Math.PI * 0.42]} />
            <meshBasicMaterial color={PH_COLORS.radarGreen} />
          </mesh>
          {/* Gauge Needle */}
          <group position={[0, -0.04, 0.082]} rotation={[0, 0, needleAngle]}>
            <mesh position={[0, 0.14, 0]}>
              <boxGeometry args={[0.028, 0.29, 0.01]} />
              <meshBasicMaterial color={PH_COLORS.ink} />
            </mesh>
          </group>
          <mesh position={[0, -0.04, 0.088]}>
            <circleGeometry args={[0.042, 14]} />
            <meshBasicMaterial color={PH_COLORS.highlightOrange} />
          </mesh>
          {/* Warning Beacon Lamp on Top */}
          <ToonSphere
            radius={0.07}
            color={isCriticalFuel ? PH_COLORS.alertRed : "#94A3B8"}
            position={[0, 0.54, 0]}
            scale={[1, 1 + flashPulse * 0.14, 1]}
          />
        </group>

        {/* Empty / Critical Oil Barrels beside Gauge */}
        <ToonCylinder
          args={[0.095, 0.095, 0.24, 14]}
          color={isCriticalFuel ? PH_COLORS.alertRed : PH_COLORS.oilAmber}
          position={[-0.62, 0.12, 0.24]}
        />
        <ToonCylinder
          args={[0.095, 0.095, 0.24, 14]}
          color="#64748B"
          position={[-0.4, 0.095, 0.34]}
          rotation={[0, 0.3, Math.PI / 2]}
        />

        {/* Stalled Miniature Zero Fighter on Stand beside Meter */}
        <group position={[-0.48, 0.44, -0.06]} rotation={[0.1, 0.45, -0.08]}>
          <ToonBox args={[0.36, 0.07, 0.08]} color="#6E7866" />
          <ToonBox args={[0.1, 0.02, 0.42]} color="#7D8775" position={[0.03, -0.01, 0]} />
          <group position={[0.2, 0, 0]} rotation={[propSpin, 0, 0]}>
            <ToonBox args={[0.012, 0.16, 0.02]} color={PH_COLORS.ink} />
          </group>
        </group>
      </group>

      {/* RIGHT SIDE OF TABLE: Tactical Pearl Harbor Blueprint Map Board */}
      <group position={[0.52, -0.28, 0.05]}>
        {/* Parchment map sheet pinned on table */}
        <ToonBox args={[1.38, 0.025, 1.15]} color={PH_COLORS.paperCard} position={[0, 0.012, 0]} />
        {/* Pearl Harbor blue inlet lagoon silhouette */}
        <mesh position={[0.18, 0.028, -0.04]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.38, 22]} />
          <meshBasicMaterial color={PH_COLORS.oceanShallow} />
        </mesh>
        {/* Oahu green coastline rim */}
        <ToonBox args={[0.22, 0.04, 0.35]} color={PH_COLORS.landGreen} position={[0.52, 0.035, 0.18]} />
        <ToonBox args={[0.28, 0.04, 0.2]} color={PH_COLORS.landGreen} position={[0.34, 0.035, -0.4]} />

        {/* Anchored US Pacific Fleet Miniatures */}
        <MiniTacticalShip position={[0.12, 0.03, -0.14]} rotationY={0.4} />
        <MiniTacticalShip position={[0.24, 0.03, 0.02]} rotationY={0.35} />
        <MiniTacticalShip position={[0.06, 0.03, 0.14]} rotationY={0.42} />

        {/* Dynamic Red Strike Arrow from West -> Pearl Harbor (f150+) */}
        {frame >= 150 && (
          <group position={[-0.25, 0.055, -0.02]}>
            <ToonBox
              args={[0.54 * strikeProgress, 0.03, 0.08]}
              color={PH_COLORS.alertRed}
              position={[-0.27 * (1 - strikeProgress), 0, 0]}
            />
            {strikeProgress > 0.65 && (
              <ToonCylinder
                args={[0.01, 0.095, 0.15, 3]}
                color={PH_COLORS.alertRed}
                position={[0.28, 0.01, 0]}
                rotation={[0, 0, -Math.PI / 2]}
              />
            )}
          </group>
        )}

        {/* Pulsing Red Target Ring over Pearl Harbor Fleet (f208+) */}
        {frame >= 208 && (
          <group position={[0.16, 0.042, 0.0]} scale={targetDrop}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.24, 0.29, 28]} />
              <meshBasicMaterial color={PH_COLORS.alertRed} />
            </mesh>
            <ToonCylinder
              args={[0.012, 0.012, 0.32, 8]}
              color={PH_COLORS.ink}
              position={[0.16, 0.16, -0.1]}
            />
            <ToonSphere
              radius={0.055}
              color={PH_COLORS.alertRed}
              position={[0.16, 0.33, -0.1]}
            />
          </group>
        )}
      </group>
    </>
  );
};

export const Scene3OilCrisis: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const headerEnter = spring({
    frame: Math.max(0, frame - 4),
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#E6DFCF" }}>
      <Sequence from={VO_OFFSET}>
        <Audio src={staticFile("audio/pearl-harbor/vo/vo-scene3.mp3")} volume={1} />
      </Sequence>

      <Sequence from={20} durationInFrames={45}>
        <Audio src={staticFile("audio/pearl-harbor/sfx/typewriter.wav")} volume={0.28} />
      </Sequence>
      <Sequence from={156} durationInFrames={45}>
        <Audio src={staticFile("audio/pearl-harbor/sfx/typewriter.wav")} volume={0.28} />
      </Sequence>
      <Sequence from={285} durationInFrames={50}>
        <Audio src={staticFile("audio/pearl-harbor/sfx/explosion-soft.wav")} volume={0.34} />
      </Sequence>

      <AbsoluteFill>
        <ThreeCanvas
          width={width}
          height={height}
          camera={{ position: [-0.45, 1.35, 3.85], fov: 46 }}
          shadows
        >
          <OilCrisisDiorama frame={frame} fps={fps} />
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
            backgroundColor: frame >= 150 ? PH_COLORS.alertRed : PH_COLORS.oilAmber,
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
          KRISIS ENERGI · RENCANA SERANGAN
        </span>
      </div>

      {/* Callout #1: Fuel Gauge Critical */}
      <DocCallout
        x={56}
        y={178}
        targetX={295}
        targetY={985}
        enterFrame={20}
        exitFrame={146}
        badgeText="CADANGAN MENIPIS"
        title="Stok Minyak Maksimal 2 Tahun"
        subtitle="Mesin kapal & pesawat tempur terancam lumpuh total."
        source="IJN Naval General Staff Records"
        accentColor={PH_COLORS.oilAmber}
        maxWidth={510}
      />

      {/* Callout #2: Pearl Harbor Strike Plan */}
      <DocCallout
        x={490}
        y={184}
        targetX={640}
        targetY={1145}
        enterFrame={156}
        exitFrame={332}
        badgeText="OPERASI AI"
        title="Pukulan Dadakan Pearl Harbor"
        subtitle="Rencana Laksamana Yamamoto melumpuhkan armada AS."
        source="Imperial General Headquarters"
        accentColor={PH_COLORS.alertRed}
        maxWidth={515}
      />

      <DocCaptions
        words={PEARL_HARBOR_AUDIO_DATA["vo-scene3"].words}
        voOffset={VO_OFFSET}
        highlightColor={PH_COLORS.highlightOrange}
        bottom={290}
      />
    </AbsoluteFill>
  );
};
