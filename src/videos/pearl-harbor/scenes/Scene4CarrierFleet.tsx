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

const VO_OFFSET = PEARL_HARBOR_TIMING.scene4VoOffset;

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

type CarrierSpec = {
  readonly name: string;
  readonly x: number;
  readonly z: number;
  readonly phase: number;
  readonly isLead?: boolean;
};

// 6 Kido Butai Aircraft Carriers in staggered 2x3 tactical columns
const CARRIERS: readonly CarrierSpec[] = [
  { name: "Akagi", x: 0.0, z: -0.78, phase: 0.0, isLead: true },
  { name: "Kaga", x: -0.66, z: -0.2, phase: 0.9 },
  { name: "Soryu", x: 0.66, z: -0.15, phase: 1.7 },
  { name: "Hiryu", x: -0.58, z: 0.62, phase: 2.5 },
  { name: "Shokaku", x: 0.6, z: 0.66, phase: 3.3 },
  { name: "Zuikaku", x: 0.02, z: 1.28, phase: 4.1 },
];

const AircraftCarrierModel: React.FC<{
  readonly position: [number, number, number];
  readonly bob: number;
  readonly pitch: number;
  readonly isLead?: boolean;
  readonly muteProgress?: number;
  readonly radioMuted?: boolean;
  readonly pulsePhase?: number;
}> = ({
  position,
  bob,
  pitch,
  isLead = false,
  muteProgress = 0,
  radioMuted = false,
  pulsePhase = 0,
}) => {
  return (
    <group
      position={[position[0], position[1] + bob, position[2]]}
      rotation={[pitch, 0, 0]}
    >
      {/* White sea foam wake behind stern (+Z is stern, -Z is bow) */}
      <mesh position={[0, -0.02, 0.56]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.16, 0.44]} />
        <meshBasicMaterial color="#E2EDF7" transparent opacity={0.78} />
      </mesh>
      {/* Steel Hull */}
      <ToonBox args={[0.2, 0.09, 0.84]} color="#475569" position={[0, 0.04, 0]} />
      {/* Dark-red waterline stripe */}
      <ToonBox args={[0.205, 0.025, 0.82]} color="#991B1B" position={[0, 0.0, 0]} />

      {/* Wooden Flight Deck */}
      <ToonBox args={[0.24, 0.028, 0.9]} color="#B89058" position={[0, 0.095, 0]} />
      {/* Center runway white stripe */}
      <mesh position={[0, 0.112, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.016, 0.78]} />
        <meshBasicMaterial color="#FAF9F5" />
      </mesh>
      {/* Red Hinomaru bow deck circle */}
      <mesh position={[0, 0.113, -0.32]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.045, 16]} />
        <meshBasicMaterial color={PH_COLORS.alertRed} />
      </mesh>

      {/* Parked Zero planes on rear deck */}
      {[-0.045, 0.045].map((px, i) => (
        <group key={i} position={[px, 0.122, 0.24]}>
          <ToonBox args={[0.022, 0.016, 0.055]} color="#6E7866" />
          <ToonBox args={[0.065, 0.008, 0.02]} color="#7D8775" position={[0, 0, -0.008]} />
        </group>
      ))}

      {/* Island Command Bridge & Tall Radio Mast */}
      <group position={[0.09, 0.16, -0.06]}>
        <ToonBox args={[0.055, 0.11, 0.16]} color="#64748B" />
        {/* Funnel stack */}
        <ToonCylinder
          args={[0.018, 0.022, 0.09, 10]}
          color="#334155"
          position={[0.01, 0.05, 0.04]}
          rotation={[0, 0, -0.3]}
        />
        {/* Radio Antenna Mast */}
        <ToonCylinder
          args={[0.006, 0.009, 0.22, 8]}
          color={PH_COLORS.ink}
          position={[0, 0.16, -0.03]}
        />
        <ToonBox args={[0.08, 0.01, 0.01]} color={PH_COLORS.ink} position={[0, 0.23, -0.03]} />

        {/* Radio Silence Indicator hovering cleanly above Akagi's mast */}
        {isLead && (
          <group position={[0, 0.42, -0.03]}>
            {/* Faint pre-mute wave pulse before f255 */}
            {!radioMuted && (
              <mesh scale={0.7 + (pulsePhase % 1) * 0.9}>
                <ringGeometry args={[0.14, 0.165, 24]} />
                <meshBasicMaterial
                  color={PH_COLORS.xrayCyan}
                  transparent
                  opacity={1 - (pulsePhase % 1)}
                />
              </mesh>
            )}
            {/* Bold Red Radio Silence Prohibition Circle + Slash */}
            {radioMuted && (
              <group scale={muteProgress}>
                <ToonCylinder
                  args={[0.17, 0.17, 0.04, 24]}
                  color={PH_COLORS.paperCard}
                  rotation={[Math.PI / 2, 0, 0]}
                />
                <mesh position={[0, 0, 0.024]}>
                  <ringGeometry args={[0.115, 0.155, 28]} />
                  <meshBasicMaterial color={PH_COLORS.alertRed} />
                </mesh>
                <ToonBox
                  args={[0.28, 0.038, 0.05]}
                  color={PH_COLORS.alertRed}
                  position={[0, 0, 0.01]}
                  rotation={[0, 0, Math.PI / 4]}
                />
              </group>
            )}
          </group>
        )}
      </group>
    </group>
  );
};

const CarrierFleetDiorama: React.FC<{ readonly frame: number; readonly fps: number }> = ({
  frame,
  fps,
}) => {
  // Subtle forward glide & descent toward Akagi's radio mast during Beat 2
  const camX = interpolate(
    frame,
    [0, 125, 195, 318],
    [0.05, -0.05, 0.18, 0.22],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) },
  );
  const camY = interpolate(
    frame,
    [0, 125, 195, 318],
    [2.65, 2.35, 1.32, 1.18],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) },
  );
  const camZ = interpolate(
    frame,
    [0, 125, 195, 318],
    [3.85, 3.25, 1.65, 1.48],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) },
  );

  const lookX = interpolate(frame, [0, 125, 195], [0.0, 0.0, 0.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lookY = interpolate(frame, [0, 125, 195], [0.05, 0.1, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lookZ = interpolate(frame, [0, 125, 195], [0.1, -0.25, -0.78], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Radio Silence triggers right around "semua sinyal radio dimatiin" (~f198)
  const radioMuted = frame >= 198;
  const muteSpring = spring({
    frame: Math.max(0, frame - 198),
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  // Continuous northward sail drift on waves
  const waveScroll = interpolate(frame, [0, 318], [0, 2.4]);
  const fogDrift = interpolate(frame, [0, 318], [-0.45, 0.5]);

  return (
    <>
      <CameraRig position={[camX, camY, camZ]} lookAt={[lookX, lookY, lookZ]} />
      <DocLightRig ambient={0.9} keyPosition={[5, 8, 3]} keyIntensity={1.05} />

      {/* Cool Stormy North Pacific Sky Backdrop Plane */}
      <mesh position={[0, 1.4, -5.5]}>
        <planeGeometry args={[18, 8]} />
        <meshBasicMaterial color="#BACAD9" />
      </mesh>

      {/* North Pacific Deep Ocean Base */}
      <ToonBox args={[14, 0.4, 14]} color={PH_COLORS.oceanDeep} position={[0, -0.2, 0]} />

      {/* Scrolling Cel-Shaded Whitecap Swell Bands */}
      {[-3.2, -1.8, -0.4, 1.0, 2.4].map((baseZ, i) => {
        const z = ((baseZ + waveScroll + 4) % 7) - 3.5;
        return (
          <ToonBox
            key={i}
            args={[2.4 + (i % 2) * 0.9, 0.03, 0.12]}
            color="#295B8D"
            position={[(i % 2 === 0 ? -1 : 1) * 0.75, 0.01, z]}
          />
        );
      })}

      {/* 6 Aircraft Carriers Sailing North */}
      {CARRIERS.map((ship) => {
        const bob = Math.sin(frame * 0.12 + ship.phase) * 0.022;
        const pitch = Math.cos(frame * 0.1 + ship.phase) * 0.022;
        return (
          <AircraftCarrierModel
            key={ship.name}
            position={[ship.x, 0.02, ship.z]}
            bob={bob}
            pitch={pitch}
            isLead={ship.isLead}
            radioMuted={radioMuted}
            muteProgress={muteSpring}
            pulsePhase={frame * 0.04}
          />
        );
      })}

      {/* Drifting North Pacific Fog Clouds */}
      <group position={[fogDrift - 0.9, 1.05, -1.6]}>
        <ToonSphere radius={0.22} color="#E8EEF3" scale={[1.8, 0.6, 1.0]} />
        <ToonSphere
          radius={0.17}
          color="#E8EEF3"
          position={[0.28, -0.02, 0.06]}
          scale={[1.4, 0.55, 0.9]}
        />
      </group>
      <group position={[-fogDrift + 1.05, 0.92, -0.9]}>
        <ToonSphere radius={0.2} color="#E8EEF3" scale={[1.7, 0.55, 0.95]} />
      </group>
    </>
  );
};

export const Scene4CarrierFleet: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const headerEnter = spring({
    frame: Math.max(0, frame - 4),
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#BACAD9" }}>
      <Sequence from={VO_OFFSET}>
        <Audio src={staticFile("audio/pearl-harbor/vo/vo-scene4.mp3")} volume={1} />
      </Sequence>

      <Sequence from={16} durationInFrames={90}>
        <Audio src={staticFile("audio/pearl-harbor/sfx/splash.wav")} volume={0.22} />
      </Sequence>
      <Sequence from={44} durationInFrames={45}>
        <Audio src={staticFile("audio/pearl-harbor/sfx/typewriter.wav")} volume={0.28} />
      </Sequence>
      <Sequence from={198} durationInFrames={45}>
        <Audio src={staticFile("audio/pearl-harbor/sfx/typewriter.wav")} volume={0.3} />
      </Sequence>

      <AbsoluteFill>
        <ThreeCanvas
          width={width}
          height={height}
          camera={{ position: [0.05, 2.65, 3.85], fov: 46 }}
          shadows
        >
          <CarrierFleetDiorama frame={frame} fps={fps} />
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
            backgroundColor: frame >= 198 ? PH_COLORS.alertRed : PH_COLORS.xrayCyan,
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
          26 NOVEMBER 1941 · PASIFIK UTARA
        </span>
      </div>

      {/* Callout #1: 6 Carriers Fleet */}
      <DocCallout
        x={56}
        y={178}
        targetX={540}
        targetY={720}
        enterFrame={42}
        exitFrame={165}
        badgeText="KIDO BUTAI"
        title="6 Kapal Induk Berlayar Senyap"
        subtitle="Akagi, Kaga, Soryu, Hiryu, Shokaku, dan Zuikaku lewat jalur utara."
        source="Combined Fleet Action Reports"
        accentColor={PH_COLORS.xrayCyan}
        maxWidth={510}
      />

      {/* Callout #2: Total Radio Silence */}
      <DocCallout
        x={490}
        y={184}
        targetX={560}
        targetY={770}
        enterFrame={200}
        exitFrame={310}
        badgeText="RADIO SILENCE"
        title="Nol Sinyal Radio 11 Hari"
        subtitle="Semua pemancar disegel total agar tidak terdeteksi sekutu."
        source="Naval History & Heritage Command"
        accentColor={PH_COLORS.alertRed}
        maxWidth={515}
      />

      <DocCaptions
        words={PEARL_HARBOR_AUDIO_DATA["vo-scene4"].words}
        voOffset={VO_OFFSET}
        highlightColor={PH_COLORS.highlightOrange}
        bottom={290}
      />
    </AbsoluteFill>
  );
};
