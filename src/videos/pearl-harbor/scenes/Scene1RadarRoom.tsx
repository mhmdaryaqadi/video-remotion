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

const VO_OFFSET = PEARL_HARBOR_TIMING.scene1VoOffset;

type BlipSpec = {
  readonly id: number;
  readonly x: number;
  readonly y: number;
  readonly size: number;
  readonly delay: number;
};

// Deterministic incoming wave cluster (183 aircraft represented as dense blips from North)
const WAVE_BLIPS: readonly BlipSpec[] = [
  { id: 1, x: 0.02, y: 0.28, size: 0.026, delay: 0 },
  { id: 2, x: -0.06, y: 0.25, size: 0.024, delay: 3 },
  { id: 3, x: 0.09, y: 0.24, size: 0.024, delay: 5 },
  { id: 4, x: -0.12, y: 0.21, size: 0.022, delay: 8 },
  { id: 5, x: 0.0, y: 0.21, size: 0.028, delay: 9 },
  { id: 6, x: 0.14, y: 0.19, size: 0.022, delay: 11 },
  { id: 7, x: -0.05, y: 0.17, size: 0.025, delay: 13 },
  { id: 8, x: 0.07, y: 0.16, size: 0.025, delay: 14 },
  { id: 9, x: -0.17, y: 0.16, size: 0.02, delay: 16 },
  { id: 10, x: 0.19, y: 0.14, size: 0.021, delay: 18 },
  { id: 11, x: -0.09, y: 0.13, size: 0.023, delay: 20 },
  { id: 12, x: 0.03, y: 0.12, size: 0.026, delay: 22 },
  { id: 13, x: 0.12, y: 0.11, size: 0.022, delay: 24 },
  { id: 14, x: -0.02, y: 0.08, size: 0.024, delay: 26 },
  { id: 15, x: -0.14, y: 0.11, size: 0.02, delay: 27 },
  { id: 16, x: 0.08, y: 0.07, size: 0.021, delay: 29 },
  { id: 17, x: -0.07, y: 0.05, size: 0.022, delay: 31 },
  { id: 18, x: 0.01, y: 0.04, size: 0.025, delay: 33 },
];

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

const OutlinedRing: React.FC<{
  readonly innerRadius: number;
  readonly outerRadius: number;
  readonly color: string;
  readonly position?: [number, number, number];
}> = ({ innerRadius, outerRadius, color, position = [0, 0, 0] }) => {
  return (
    <mesh position={position}>
      <ringGeometry args={[innerRadius, outerRadius, 40]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
};

const MiniZeroSilhouette: React.FC<{
  readonly position: [number, number, number];
  readonly scale?: number;
}> = ({ position, scale = 1 }) => {
  return (
    <group position={position} scale={scale} rotation={[0.08, -0.35, -0.12]}>
      <ToonBox args={[0.14, 0.026, 0.032]} color="#5A6356" />
      <ToonBox
        args={[0.038, 0.01, 0.16]}
        color="#6D7667"
        position={[0.01, 0, 0]}
      />
      <ToonBox
        args={[0.026, 0.024, 0.01]}
        color="#5A6356"
        position={[-0.06, 0.016, 0]}
      />
      <ToonCylinder
        args={[0.014, 0.014, 0.01, 10]}
        color={PH_COLORS.alertRed}
        position={[0.01, 0.007, 0.045]}
      />
      <ToonCylinder
        args={[0.014, 0.014, 0.01, 10]}
        color={PH_COLORS.alertRed}
        position={[0.01, 0.007, -0.045]}
      />
    </group>
  );
};

const RadarStationDiorama: React.FC<{ readonly frame: number; readonly fps: number }> = ({
  frame,
  fps,
}) => {
  const gradientMap = useToonGradientMap();

  // Radar phosphor sweep rotation (~0.075 rad/frame)
  const sweepAngle = -frame * 0.078;

  // Story phase timings synced with snappy VO (VO_OFFSET = 6):
  // f54-125: "layar radar ini tiba-tiba penuh sama titik pesawat"
  // f140-275: "Eh, petugasnya malah nyuruh santai, dikira itu rombongan pesawat Amerika sendiri"
  // f290-439: "Padahal aslinya, itu gelombang pertama 183 pesawat tempur Jepang"
  const isAlert = frame >= 288;
  const alertPulse = isAlert ? 0.5 + 0.5 * Math.sin((frame - 288) * 0.35) : 0;

  const sweepColor = isAlert ? PH_COLORS.alertRed : PH_COLORS.radarGreen;
  const scopeTint = isAlert ? "#2B1114" : PH_COLORS.radarDark;
  const blipBaseColor = isAlert
    ? PH_COLORS.highlightOrange
    : frame >= 140
      ? "#4ADE80"
      : "#86EFAC";

  // Sweeping beam sector mesh geometry
  const sweepGeo = useMemo(() => {
    return new THREE.CircleGeometry(0.35, 24, 0, 0.52);
  }, []);

  // Subtle camera pan & dolly inside Opana Point room
  const camX = interpolate(
    frame,
    [0, 68, 145, 275, 325, 455],
    [-0.32, -0.08, 0.06, 0.14, 0.02, -0.04],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) },
  );
  const camY = interpolate(
    frame,
    [0, 68, 145, 275, 325, 455],
    [1.18, 0.92, 0.68, 0.64, 0.56, 0.52],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) },
  );
  const camZ = interpolate(
    frame,
    [0, 68, 145, 275, 325, 455],
    [5.85, 4.7, 3.65, 3.85, 3.15, 2.95],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) },
  );

  const lookX = interpolate(frame, [0, 75, 290], [-0.08, 0.0, 0.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lookY = interpolate(frame, [0, 75, 290], [0.58, 0.44, 0.42], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Zero squadron passing outside the right window when alert triggers (f285..445)
  const planeProgress = interpolate(frame, [285, 445], [-0.65, 0.72], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      <CameraRig position={[camX, camY, camZ]} lookAt={[lookX, lookY, 0.1]} />
      <DocLightRig ambient={0.95} keyPosition={[4, 7, 5]} keyIntensity={1.15} />

      {/* Back & Left Diorama Room Walls */}
      <group>
        {/* Floor planks */}
        <ToonBox
          args={[6.2, 0.16, 4.6]}
          color={PH_COLORS.woodFloor}
          position={[0, -1.35, -0.1]}
        />
        {/* Floor plank seam strips */}
        {[-1.2, -0.4, 0.4, 1.2].map((zPos) => (
          <mesh key={zPos} position={[0, -1.268, zPos]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[6.0, 0.018]} />
            <meshBasicMaterial color={PH_COLORS.woodDark} />
          </mesh>
        ))}

        {/* Back upper wall (split around window cutout area using solid backdrop) */}
        <ToonBox
          args={[6.2, 3.8, 0.16]}
          color={PH_COLORS.creamWall}
          position={[0, 1.35, -1.45]}
        />
        {/* Back lower wainscoting */}
        <ToonBox
          args={[6.2, 1.15, 0.19]}
          color={PH_COLORS.wainscot}
          position={[0, -0.7, -1.43]}
        />
        {/* Dado trim rail */}
        <ToonBox
          args={[6.2, 0.08, 0.22]}
          color={PH_COLORS.woodDark}
          position={[0, -0.12, -1.41]}
        />

        {/* Left return corner wall */}
        <ToonBox
          args={[0.16, 4.6, 4.6]}
          color="#E2DAC8"
          position={[-2.15, 0.9, -0.1]}
        />
        <ToonBox
          args={[0.19, 1.15, 4.6]}
          color="#ADA38D"
          position={[-2.13, -0.7, -0.1]}
        />
      </group>

      {/* Window on upper-right wall showing Oahu hills, palms & sky */}
      <group position={[1.05, 1.18, -1.33]}>
        {/* Sky vista box inside window */}
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[1.18, 1.05]} />
          <meshBasicMaterial color="#9FD0EE" />
        </mesh>
        {/* Distant tropical mountain ridge */}
        <ToonBox
          args={[0.7, 0.36, 0.03]}
          color={PH_COLORS.landGreen}
          position={[-0.18, -0.34, 0.025]}
          rotation={[0, 0, 0.24]}
        />
        <ToonBox
          args={[0.65, 0.3, 0.03]}
          color="#5C8A47"
          position={[0.25, -0.36, 0.03]}
          rotation={[0, 0, -0.2]}
        />
        {/* Stylised Hawaii Palm Tree silhouette */}
        <ToonCylinder
          args={[0.022, 0.034, 0.42, 8]}
          color={PH_COLORS.woodDark}
          position={[-0.36, -0.22, 0.05]}
          rotation={[0, 0, -0.14]}
        />
        <ToonSphere
          radius={0.14}
          color="#4D7C3C"
          position={[-0.34, -0.02, 0.055]}
          scale={[1.4, 0.55, 0.5]}
        />
        {/* Drifting clouds */}
        <ToonSphere
          radius={0.11}
          color="#FFFFFF"
          position={[0.24, 0.28, 0.04]}
          scale={[1.5, 0.75, 0.4]}
        />
        {/* Japanese Zero wave silhouette passing window after f320 */}
        {frame >= 315 && (
          <group position={[planeProgress, 0.26, 0.06]}>
            <MiniZeroSilhouette position={[0, 0.08, 0]} scale={0.95} />
            <MiniZeroSilhouette position={[-0.26, -0.05, 0]} scale={0.85} />
            <MiniZeroSilhouette position={[0.22, -0.08, 0]} scale={0.8} />
          </group>
        )}
        {/* Dark wood window frame + mullions */}
        <ToonBox args={[1.32, 0.09, 0.08]} color={PH_COLORS.woodDark} position={[0, 0.54, 0.07]} />
        <ToonBox args={[1.32, 0.1, 0.12]} color={PH_COLORS.woodDark} position={[0, -0.54, 0.08]} />
        <ToonBox args={[0.09, 1.15, 0.08]} color={PH_COLORS.woodDark} position={[-0.62, 0, 0.07]} />
        <ToonBox args={[0.09, 1.15, 0.08]} color={PH_COLORS.woodDark} position={[0.62, 0, 0.07]} />
        <ToonBox args={[0.04, 1.05, 0.06]} color={PH_COLORS.woodDark} position={[0, 0, 0.075]} />
        <ToonBox args={[1.18, 0.04, 0.06]} color={PH_COLORS.woodDark} position={[0, 0.04, 0.075]} />
      </group>

      {/* Analog Wall Clock showing 07:02 */}
      <group position={[-0.95, 1.48, -1.32]}>
        <ToonCylinder
          args={[0.27, 0.27, 0.07, 24]}
          color={PH_COLORS.woodDark}
          rotation={[Math.PI / 2, 0, 0]}
        />
        <mesh position={[0, 0, 0.038]}>
          <circleGeometry args={[0.225, 24]} />
          <meshBasicMaterial color={PH_COLORS.paperCard} />
        </mesh>
        {/* Hour marks */}
        {[0, 1, 2, 3].map((idx) => (
          <mesh
            key={idx}
            position={[
              Math.sin((idx * Math.PI) / 2) * 0.175,
              Math.cos((idx * Math.PI) / 2) * 0.175,
              0.041,
            ]}
          >
            <boxGeometry args={[0.02, 0.032, 0.004]} />
            <meshBasicMaterial color={PH_COLORS.ink} />
          </mesh>
        ))}
        {/* Hour hand (~7 o'clock) */}
        <mesh position={[-0.045, -0.075, 0.045]} rotation={[0, 0, 2.62]}>
          <boxGeometry args={[0.022, 0.13, 0.005]} />
          <meshBasicMaterial color={PH_COLORS.ink} />
        </mesh>
        {/* Minute hand (~2 minutes past) */}
        <mesh position={[0.015, 0.08, 0.048]} rotation={[0, 0, -0.21]}>
          <boxGeometry args={[0.014, 0.175, 0.005]} />
          <meshBasicMaterial color={PH_COLORS.alertRed} />
        </mesh>
        <mesh position={[0, 0, 0.052]}>
          <circleGeometry args={[0.02, 12]} />
          <meshBasicMaterial color={PH_COLORS.ink} />
        </mesh>
      </group>

      {/* Tear-off Wall Calendar Block (7 DES) */}
      <group position={[-0.28, 1.45, -1.33]}>
        <ToonBox args={[0.36, 0.44, 0.04]} color={PH_COLORS.paperCard} />
        <ToonBox
          args={[0.36, 0.11, 0.046]}
          color={PH_COLORS.alertRed}
          position={[0, 0.165, 0.003]}
        />
        {/* Large blocky "7" in 3D ink */}
        <ToonBox args={[0.14, 0.032, 0.015]} color={PH_COLORS.ink} position={[0, 0.04, 0.025]} />
        <ToonBox
          args={[0.036, 0.19, 0.015]}
          color={PH_COLORS.ink}
          position={[0.015, -0.045, 0.025]}
          rotation={[0, 0, -0.35]}
        />
      </group>

      {/* Operator Wooden Desk */}
      <group position={[0, -0.42, 0.05]}>
        {/* Desktop surface */}
        <ToonBox args={[2.55, 0.1, 1.35]} color={PH_COLORS.deskWood} position={[0, 0, 0]} />
        {/* Desk drawers left & right */}
        <ToonBox args={[0.62, 0.78, 1.12]} color={PH_COLORS.woodDark} position={[-0.86, -0.44, -0.02]} />
        <ToonBox args={[0.62, 0.78, 1.12]} color={PH_COLORS.woodDark} position={[0.86, -0.44, -0.02]} />
        {/* Drawer handles */}
        <ToonBox args={[0.18, 0.03, 0.04]} color={PH_COLORS.brass} position={[-0.86, -0.25, 0.56]} />
        <ToonBox args={[0.18, 0.03, 0.04]} color={PH_COLORS.brass} position={[-0.86, -0.55, 0.56]} />
        <ToonBox args={[0.18, 0.03, 0.04]} color={PH_COLORS.brass} position={[0.86, -0.25, 0.56]} />
        <ToonBox args={[0.18, 0.03, 0.04]} color={PH_COLORS.brass} position={[0.86, -0.55, 0.56]} />
      </group>

      {/* Desk Props: Clipboard, Coffee Mug & Radio Headset */}
      <group position={[0, -0.36, 0.2]}>
        {/* Coffee mug on left */}
        <ToonCylinder
          args={[0.07, 0.065, 0.14, 14]}
          color={PH_COLORS.paperCard}
          position={[-0.95, 0.07, 0.25]}
        />
        {/* Logbook / Clipboard on right */}
        <ToonBox
          args={[0.34, 0.025, 0.44]}
          color="#C29B6B"
          position={[0.85, 0.018, 0.2]}
          rotation={[0, -0.18, 0]}
        />
        <ToonBox
          args={[0.28, 0.012, 0.36]}
          color={PH_COLORS.paperCard}
          position={[0.85, 0.034, 0.21]}
          rotation={[0, -0.18, 0]}
        />
        {/* Radio headset resting beside console */}
        <ToonCylinder
          args={[0.075, 0.075, 0.045, 16]}
          color="#2B3038"
          position={[-0.78, 0.03, -0.02]}
          rotation={[0, 0, Math.PI / 2]}
        />
        <ToonCylinder
          args={[0.075, 0.075, 0.045, 16]}
          color="#2B3038"
          position={[-0.64, 0.03, 0.05]}
          rotation={[0, 0, Math.PI / 2]}
        />
      </group>

      {/* Main SCR-270 Radar Console Box */}
      <group position={[0, 0.24, -0.05]}>
        {/* Olive drab steel chassis */}
        <ToonBox args={[1.28, 1.22, 0.86]} color={PH_COLORS.cabinetOlive} />
        {/* Beveled top overhang hood */}
        <ToonBox
          args={[1.34, 0.12, 0.94]}
          color={PH_COLORS.cabinetSlate}
          position={[0, 0.62, 0.04]}
        />
        {/* Lower control strip with dials & warning lamp */}
        <ToonBox
          args={[1.18, 0.24, 0.08]}
          color="#2B322C"
          position={[0, -0.44, 0.44]}
        />
        {[-0.4, -0.18, 0.18, 0.4].map((xDial) => (
          <ToonCylinder
            key={xDial}
            args={[0.055, 0.06, 0.06, 14]}
            color="#D6D3C9"
            position={[xDial, -0.44, 0.49]}
            rotation={[Math.PI / 2, 0, 0]}
          />
        ))}
        {/* Alert pilot lamp in center */}
        <ToonSphere
          radius={0.045}
          color={isAlert ? PH_COLORS.alertRed : "#FACC15"}
          position={[0, -0.44, 0.5]}
          scale={[1, 1, 0.7]}
        />

        {/* Side Radio Receiver Stack */}
        <ToonBox
          args={[0.42, 0.54, 0.68]}
          color={PH_COLORS.cabinetSlate}
          position={[0.88, -0.34, -0.04]}
        />
        <ToonBox
          args={[0.3, 0.16, 0.04]}
          color="#1E2429"
          position={[0.88, -0.22, 0.31]}
        />
        <ToonCylinder
          args={[0.045, 0.045, 0.04, 12]}
          color={PH_COLORS.brass}
          position={[0.8, -0.44, 0.31]}
          rotation={[Math.PI / 2, 0, 0]}
        />
        <ToonCylinder
          args={[0.045, 0.045, 0.04, 12]}
          color={PH_COLORS.brass}
          position={[0.96, -0.44, 0.31]}
          rotation={[Math.PI / 2, 0, 0]}
        />

        {/* Circular CRT Radar Scope Assembly */}
        <group position={[0, 0.14, 0.44]}>
          {/* Outer heavy steel ring bezel */}
          <ToonCylinder
            args={[0.44, 0.46, 0.12, 32]}
            color={PH_COLORS.cabinetSlate}
            rotation={[Math.PI / 2, 0, 0]}
          />
          {/* Deep CRT phosphor face */}
          <mesh position={[0, 0, 0.063]}>
            <circleGeometry args={[0.37, 36]} />
            <meshBasicMaterial color={scopeTint} />
          </mesh>

          {/* Concentric range rings */}
          <OutlinedRing
            innerRadius={0.12}
            outerRadius={0.128}
            color={isAlert ? "#7F1D1D" : "#166534"}
            position={[0, 0, 0.066]}
          />
          <OutlinedRing
            innerRadius={0.24}
            outerRadius={0.248}
            color={isAlert ? "#991B1B" : "#15803D"}
            position={[0, 0, 0.066]}
          />
          <OutlinedRing
            innerRadius={0.345}
            outerRadius={0.355}
            color={sweepColor}
            position={[0, 0, 0.066]}
          />
          {/* Crosshairs */}
          <mesh position={[0, 0, 0.066]}>
            <boxGeometry args={[0.7, 0.008, 0.002]} />
            <meshBasicMaterial color={isAlert ? "#7F1D1D" : "#166534"} />
          </mesh>
          <mesh position={[0, 0, 0.066]}>
            <boxGeometry args={[0.008, 0.7, 0.002]} />
            <meshBasicMaterial color={isAlert ? "#7F1D1D" : "#166534"} />
          </mesh>

          {/* Rotating Phosphor Sweep Pie + Bright Leading Line */}
          <group position={[0, 0, 0.068]} rotation={[0, 0, sweepAngle]}>
            <mesh geometry={sweepGeo}>
              <meshBasicMaterial
                color={sweepColor}
                transparent
                opacity={isAlert ? 0.28 : 0.24}
              />
            </mesh>
            <mesh position={[0.175, 0, 0.002]}>
              <boxGeometry args={[0.35, 0.012, 0.002]} />
              <meshBasicMaterial color={sweepColor} />
            </mesh>
          </group>

          {/* Routine lone blip before f65 */}
          <mesh position={[-0.14, -0.09, 0.071]}>
            <circleGeometry args={[0.015, 12]} />
            <meshBasicMaterial color="#4ADE80" />
          </mesh>

          {/* Massive 183-aircraft incoming radar blip wave from f54 onwards */}
          {WAVE_BLIPS.map((b) => {
            const appear = spring({
              frame: Math.max(0, frame - (54 + b.delay)),
              fps,
              config: SPRING_CONFIGS.bouncy,
            });
            if (appear <= 0.02) return null;
            const pulseSize = isAlert ? 1 + 0.28 * alertPulse : 1;
            return (
              <group
                key={b.id}
                position={[b.x, b.y, 0.072]}
                scale={appear * pulseSize}
              >
                <mesh>
                  <circleGeometry args={[b.size, 14]} />
                  <meshBasicMaterial color={blipBaseColor} />
                </mesh>
                {isAlert && b.id % 3 === 1 && (
                  <mesh position={[0, 0, 0.001]}>
                    <ringGeometry args={[b.size * 1.4, b.size * 1.75, 16]} />
                    <meshBasicMaterial color={PH_COLORS.alertRed} />
                  </mesh>
                )}
              </group>
            );
          })}
        </group>

        {/* Subtle cel-shaded highlight rim top face */}
        <mesh position={[0, 0.682, 0.04]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.22, 0.78]} />
          <meshToonMaterial color="#4D5762" gradientMap={gradientMap} />
        </mesh>
      </group>
    </>
  );
};

export const Scene1RadarRoom: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Gentle screen tint when 183-plane truth hits at f288
  const alertGlowOpacity = interpolate(frame, [288, 304, 438], [0, 0.14, 0.09], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Top chapter pill entrance
  const tagEnter = spring({
    frame: Math.max(0, frame - 4),
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: PH_COLORS.creamWall }}>
      {/* VO Audio synced with Scene 1 */}
      <Sequence from={VO_OFFSET}>
        <Audio src={staticFile("audio/pearl-harbor/vo/vo-scene1.mp3")} volume={1} />
      </Sequence>

      {/* Radar Ping SFX synced with sweep & blip explosion */}
      <Sequence from={54} durationInFrames={60}>
        <Audio src={staticFile("audio/pearl-harbor/sfx/radar-ping.wav")} volume={0.34} />
      </Sequence>
      <Sequence from={102} durationInFrames={60}>
        <Audio src={staticFile("audio/pearl-harbor/sfx/radar-ping.wav")} volume={0.36} />
      </Sequence>
      <Sequence from={290} durationInFrames={60}>
        <Audio src={staticFile("audio/pearl-harbor/sfx/radar-ping.wav")} volume={0.44} />
      </Sequence>

      {/* Subtle Paper/Typewriter SFX on callout pins */}
      <Sequence from={16} durationInFrames={45}>
        <Audio src={staticFile("audio/pearl-harbor/sfx/typewriter.wav")} volume={0.28} />
      </Sequence>
      <Sequence from={296} durationInFrames={45}>
        <Audio src={staticFile("audio/pearl-harbor/sfx/typewriter.wav")} volume={0.32} />
      </Sequence>

      {/* Full 3D Cel-Shaded Documentary Diorama */}
      <AbsoluteFill>
        <ThreeCanvas
          width={width}
          height={height}
          camera={{ position: [-0.32, 1.18, 5.85], fov: 46 }}
          shadows
        >
          <RadarStationDiorama frame={frame} fps={fps} />
        </ThreeCanvas>
      </AbsoluteFill>

      {/* Subtle urgent red border vignette when alert triggers */}
      {alertGlowOpacity > 0.01 && (
        <AbsoluteFill
          style={{
            pointerEvents: "none",
            boxShadow: `inset 0 0 180px rgba(220, 38, 38, ${alertGlowOpacity})`,
          }}
        />
      )}

      {/* Clean Minimal Timestamp Header inside TikTok Top Safe Zone */}
      <div
        style={{
          position: "absolute",
          top: 86,
          left: 56,
          zIndex: 20,
          opacity: tagEnter,
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
            backgroundColor: frame >= 288 ? PH_COLORS.alertRed : PH_COLORS.radarGreen,
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
          7 DESEMBER 1941 · 07:02 PAGI
        </span>
      </div>

      {/* Callout #1: Opana Point Radar Station */}
      <DocCallout
        x={56}
        y={176}
        targetX={208}
        targetY={578}
        enterFrame={16}
        exitFrame={115}
        badgeText="OAHU, HAWAII"
        title="Pos Radar Opana Point"
        subtitle="Deteksi gelombang pesawat besar dari arah utara."
        source="National Park Service (NPS)"
        accentColor={PH_COLORS.radarGreen}
        maxWidth={470}
      />

      {/* Callout #2: 183 Japanese Aircraft Alert */}
      <DocCallout
        x={490}
        y={194}
        targetX={550}
        targetY={770}
        enterFrame={296}
        exitFrame={446}
        badgeText="GELOMBANG PERTAMA"
        title="183 Pesawat Tempur Jepang"
        subtitle="Dikira B-17 Amerika sendiri, ternyata serangan mendadak."
        source="Naval History & Heritage Command"
        accentColor={PH_COLORS.alertRed}
        maxWidth={515}
      />

      {/* Synchronized Word-by-Word Documentary Captions */}
      <DocCaptions
        words={PEARL_HARBOR_AUDIO_DATA["vo-scene1"].words}
        voOffset={VO_OFFSET}
        highlightColor={PH_COLORS.highlightOrange}
        bottom={290}
      />
    </AbsoluteFill>
  );
};
