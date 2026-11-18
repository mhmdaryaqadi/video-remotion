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

const VO_OFFSET = PEARL_HARBOR_TIMING.scene7VoOffset;

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

const BattleshipModel: React.FC<{
  readonly position: [number, number, number];
  readonly sinkDepth?: number;
  readonly listRoll?: number;
  readonly pitchTilt?: number;
  readonly scorched?: boolean;
}> = ({
  position,
  sinkDepth = 0,
  listRoll = 0,
  pitchTilt = 0,
  scorched = false,
}) => {
  const hullColor = scorched ? "#334155" : "#64748B";
  const deckColor = scorched ? "#475569" : "#C5A880";

  return (
    <group
      position={[position[0], position[1] - sinkDepth, position[2]]}
      rotation={[pitchTilt, 0, listRoll]}
    >
      {/* Red waterline lower hull */}
      <ToonBox args={[0.24, 0.06, 1.05]} color="#991B1B" position={[0, 0.0, 0]} />
      {/* Main grey armored hull */}
      <ToonBox args={[0.26, 0.08, 1.12]} color={hullColor} position={[0, 0.065, 0]} />
      {/* Wooden teak main deck */}
      <ToonBox args={[0.23, 0.018, 1.06]} color={deckColor} position={[0, 0.11, 0]} />

      {/* Forward & aft main gun turrets */}
      <ToonBox args={[0.12, 0.06, 0.14]} color="#475569" position={[0, 0.145, -0.32]} />
      <ToonCylinder
        args={[0.01, 0.01, 0.14, 8]}
        color={PH_COLORS.ink}
        position={[-0.025, 0.15, -0.44]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <ToonCylinder
        args={[0.01, 0.01, 0.14, 8]}
        color={PH_COLORS.ink}
        position={[0.025, 0.15, -0.44]}
        rotation={[Math.PI / 2, 0, 0]}
      />

      {/* Midship cage mast & armored conning tower */}
      <ToonBox args={[0.14, 0.16, 0.24]} color="#475569" position={[0, 0.195, -0.04]} />
      <ToonCylinder
        args={[0.014, 0.026, 0.22, 10]}
        color="#334155"
        position={[0, 0.34, -0.06]}
      />
      <ToonCylinder
        args={[0.024, 0.03, 0.12, 10]}
        color="#1E293B"
        position={[0, 0.28, 0.1]}
      />

      {/* Aft turret */}
      <ToonBox args={[0.12, 0.06, 0.14]} color="#475569" position={[0, 0.145, 0.32]} />
    </group>
  );
};

const DivingZeroPlane: React.FC<{
  readonly position: [number, number, number];
  readonly rotation?: [number, number, number];
  readonly scale?: number;
}> = ({ position, rotation = [0.35, 0.2, -0.25], scale = 0.72 }) => (
  <group position={position} rotation={rotation} scale={scale}>
    <ToonBox args={[0.08, 0.08, 0.38]} color="#6E7866" />
    <ToonBox args={[0.52, 0.02, 0.13]} color="#7A8471" position={[0, -0.015, -0.04]} />
    <ToonCylinder
      args={[0.038, 0.038, 0.024, 12]}
      color={PH_COLORS.alertRed}
      position={[-0.16, -0.012, -0.04]}
    />
    <ToonCylinder
      args={[0.038, 0.038, 0.024, 12]}
      color={PH_COLORS.alertRed}
      position={[0.16, -0.012, -0.04]}
    />
  </group>
);

const BattleshipRowDiorama: React.FC<{ readonly frame: number; readonly fps: number }> = ({
  frame,
  fps,
}) => {
  // Arizona explodes right at f192 ("kapal perang Arizona meledak dan tenggelam")
  const explosionActive = frame >= 192;
  const blastSpring = spring({
    frame: Math.max(0, frame - 192),
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  // Arizona sinks and lists after f204
  const sinkT = interpolate(frame, [204, 298], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const arizonaSink = sinkT * 0.11;
  const arizonaRoll = sinkT * 0.16;
  const arizonaPitch = sinkT * 0.08;

  // Billowing cel-shaded smoke plume rising from Arizona
  const smokeRise = interpolate(frame, [192, 312], [0, 0.75], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Diving attackers sweep across Ford Island sky (f8..196)
  const diveT = interpolate(frame, [8, 196], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Camera glides from wide overview of parked Battleship Row -> dramatic punch toward Arizona
  const camX = interpolate(frame, [0, 135, 208, 312], [0.85, 0.55, 0.08, 0.04], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const camY = interpolate(frame, [0, 135, 208, 312], [2.45, 2.05, 1.45, 1.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const camZ = interpolate(frame, [0, 135, 208, 312], [3.25, 2.75, 2.15, 1.98], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const lookX = interpolate(frame, [0, 138, 212], [-0.08, -0.08, -0.24], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lookY = interpolate(frame, [0, 138, 212], [0.1, 0.15, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lookZ = interpolate(frame, [0, 138, 212], [0.05, 0.12, 0.28], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      <CameraRig position={[camX, camY, camZ]} lookAt={[lookX, lookY, lookZ]} />
      <DocLightRig ambient={0.92} keyPosition={[5, 8, 5]} keyIntensity={1.15} />

      {/* Sky backdrop */}
      <mesh position={[0, 2.2, -5.5]}>
        <planeGeometry args={[18, 9]} />
        <meshBasicMaterial color="#BFD7EA" />
      </mesh>

      {/* Pearl Harbor water surface */}
      <ToonBox args={[14, 0.3, 14]} color={PH_COLORS.oceanShallow} position={[0, -0.15, 0]} />

      {/* Ford Island Quay & Mooring Piers along the LEFT edge */}
      <group position={[-0.95, 0.02, 0]}>
        <ToonBox args={[0.9, 0.16, 4.8]} color={PH_COLORS.landGreen} position={[-0.3, 0.06, 0]} />
        <ToonBox args={[0.25, 0.12, 4.4]} color="#C8B99D" position={[0.2, 0.04, 0]} />
        {/* Wooden pier mooring docks */}
        {[-0.85, -0.25, 0.35, 0.95].map((pz) => (
          <ToonBox
            key={pz}
            args={[0.26, 0.05, 0.14]}
            color={PH_COLORS.deskWood}
            position={[0.38, 0.04, pz]}
          />
        ))}
      </group>

      {/* 4 Parked Battleships moored neatly along Ford Island ("Battleship Row") */}
      {/* Ship 1 (North Inner): USS California */}
      <BattleshipModel position={[-0.38, 0.02, -0.78]} />
      {/* Ship 2 (North Outer): USS West Virginia */}
      <BattleshipModel position={[0.04, 0.02, -0.78]} />
      {/* Ship 3 (South Inner - Hero): USS Arizona (explodes & sinks at f212!) */}
      <BattleshipModel
        position={[-0.34, 0.02, 0.45]}
        sinkDepth={arizonaSink}
        listRoll={arizonaRoll}
        pitchTilt={arizonaPitch}
        scorched={explosionActive}
      />
      {/* Ship 4 (South Outer): USS Nevada */}
      <BattleshipModel position={[0.1, 0.02, 0.45]} />

      {/* Diving Japanese bombers sweeping overhead (f10..215) */}
      <DivingZeroPlane
        position={[
          interpolate(diveT, [0, 1], [-1.1, 1.35]),
          interpolate(diveT, [0, 0.65, 1], [1.45, 0.72, 1.15]),
          interpolate(diveT, [0, 1], [-1.4, 1.2]),
        ]}
        rotation={[0.28, -0.65, -0.22]}
      />
      <DivingZeroPlane
        position={[
          interpolate(diveT, [0, 1], [-1.45, 0.95]),
          interpolate(diveT, [0, 0.6, 1], [1.62, 0.85, 1.3]),
          interpolate(diveT, [0, 1], [-1.05, 1.45]),
        ]}
        rotation={[0.25, -0.55, -0.18]}
        scale={0.62}
      />

      {/* Dramatic Cel-Shaded Explosion & Rising Smoke Column over USS Arizona */}
      {explosionActive && (
        <group position={[-0.34, 0.22, 0.4]}>
          {/* Bright Fireball Core */}
          <ToonSphere
            radius={0.14}
            color="#FACC15"
            position={[0, 0.04, 0]}
            scale={[blastSpring, blastSpring * 1.1, blastSpring]}
          />
          <ToonSphere
            radius={0.17}
            color={PH_COLORS.highlightOrange}
            position={[-0.06, 0.1, 0.05]}
            scale={[blastSpring * 0.9, blastSpring, blastSpring * 0.9]}
          />
          <ToonSphere
            radius={0.13}
            color={PH_COLORS.alertRed}
            position={[0.07, 0.09, -0.04]}
            scale={[blastSpring, blastSpring, blastSpring]}
          />

          {/* Rising Smoke Cloud Plume */}
          <group position={[0, 0.22 + smokeRise * 0.45, 0]}>
            <ToonSphere radius={0.15} color="#475569" position={[-0.05, 0.06, 0]} />
            <ToonSphere radius={0.17} color="#334155" position={[0.06, 0.18, -0.03]} />
            <ToonSphere radius={0.13} color="#64748B" position={[-0.03, 0.31, 0.04]} />
          </group>
        </group>
      )}
    </>
  );
};

export const Scene7BattleshipRow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const headerEnter = spring({
    frame: Math.max(0, frame - 4),
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#BFD7EA" }}>
      <Sequence from={VO_OFFSET}>
        <Audio src={staticFile("audio/pearl-harbor/vo/vo-scene7.mp3")} volume={1} />
      </Sequence>

      <Sequence from={10} durationInFrames={140}>
        <Audio src={staticFile("audio/pearl-harbor/sfx/propeller.wav")} volume={0.24} />
      </Sequence>
      <Sequence from={24} durationInFrames={45}>
        <Audio src={staticFile("audio/pearl-harbor/sfx/typewriter.wav")} volume={0.28} />
      </Sequence>
      <Sequence from={192} durationInFrames={70}>
        <Audio src={staticFile("audio/pearl-harbor/sfx/explosion-soft.wav")} volume={0.44} />
      </Sequence>
      <Sequence from={206} durationInFrames={65}>
        <Audio src={staticFile("audio/pearl-harbor/sfx/splash.wav")} volume={0.32} />
      </Sequence>
      <Sequence from={210} durationInFrames={45}>
        <Audio src={staticFile("audio/pearl-harbor/sfx/typewriter.wav")} volume={0.28} />
      </Sequence>

      <AbsoluteFill>
        <ThreeCanvas
          width={width}
          height={height}
          camera={{ position: [0.85, 2.45, 3.25], fov: 46 }}
          shadows
        >
          <BattleshipRowDiorama frame={frame} fps={fps} />
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
          BATTLESHIP ROW · FORD ISLAND
        </span>
      </div>

      {/* Callout #1: Moored Battleships sitting duck */}
      <DocCallout
        x={56}
        y={178}
        targetX={520}
        targetY={860}
        enterFrame={24}
        exitFrame={175}
        badgeText="SASARAN EMPUK"
        title="Deretan 8 Kapal Perang AS"
        subtitle="Diparkir rapat berjajar, tak sempat bermanuver menghindar."
        source="Naval History & Heritage Command"
        accentColor={PH_COLORS.highlightOrange}
        maxWidth={510}
      />

      {/* Callout #2: USS Arizona Sinks */}
      <DocCallout
        x={490}
        y={184}
        targetX={485}
        targetY={860}
        enterFrame={208}
        exitFrame={306}
        badgeText="USS ARIZONA (BB-39)"
        title="Meledak · 1.177 Awak Gugur"
        subtitle="Bom menembus gudang mesiu, kapal tenggelam dalam menit."
        source="USS Arizona Memorial (NPS)"
        accentColor={PH_COLORS.alertRed}
        maxWidth={515}
      />

      <DocCaptions
        words={PEARL_HARBOR_AUDIO_DATA["vo-scene7"].words}
        voOffset={VO_OFFSET}
        highlightColor={PH_COLORS.highlightOrange}
        bottom={290}
      />
    </AbsoluteFill>
  );
};
