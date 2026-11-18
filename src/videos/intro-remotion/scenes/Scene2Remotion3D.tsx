import React from "react";
import { Audio } from "@remotion/media";
import { ThreeCanvas } from "@remotion/three";
import "@react-three/fiber";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FilmGrain } from "../../../shared/components/FilmGrain";
import { SafeArea } from "../../../shared/components/SafeArea";
import { COLORS, FONTS, SPRING_CONFIGS } from "../theme";

const VO_OFFSET = 10;

/**
 * Story-driven 3D Device & Exploded UI Layers:
 * Starts as a sleek vertical 9:16 monolith, then explodes along Z-depth into
 * 3 physical React / Motion / 3D planes when "Mau tiga dimensi?" is spoken.
 */
const Exploded3DDevice: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.smooth,
  });

  // Spoken cue "Mau tiga dimensi?" starts at ~frame 77 (VO_OFFSET + 67)
  const explodeSpring = spring({
    frame: Math.max(0, frame - 74),
    fps,
    config: { damping: 18, stiffness: 90, mass: 0.9 },
  });

  // Camera/object orbit: starts almost front-facing, swings into isometric 3/4 view as layers separate
  const rotY =
    interpolate(enter, [0, 1], [-0.45, -0.12], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) +
    interpolate(explodeSpring, [0, 1], [0, -0.52], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) +
    Math.sin(frame * 0.025) * 0.06;

  const rotX =
    interpolate(explodeSpring, [0, 1], [0.06, 0.22], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) +
    Math.cos(frame * 0.02) * 0.04;

  const floatY = -0.08 + Math.sin(frame * 0.045) * 0.08;
  const scale = interpolate(enter, [0, 1], [0.82, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Exploded layer spacing along Z axis
  const layerGap = interpolate(explodeSpring, [0, 1], [0.02, 0.68], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <group
      position={[0, floatY, 0]}
      rotation={[rotX, rotY, -0.04]}
      scale={[scale, scale, scale]}
    >
      {/* Layer 0: Matte Titanium Smartphone Chassis */}
      <group position={[0, 0, -0.14 - layerGap * 1.1]}>
        <mesh>
          <boxGeometry args={[1.92, 3.36, 0.14]} />
          <meshStandardMaterial
            color="#202026"
            metalness={0.82}
            roughness={0.28}
          />
        </mesh>
        {/* Inner recessed matte display backplane */}
        <mesh position={[0, 0, 0.075]}>
          <boxGeometry args={[1.74, 3.16, 0.02]} />
          <meshStandardMaterial
            color="#0B0B0E"
            metalness={0.2}
            roughness={0.65}
          />
        </mesh>
      </group>

      {/* Layer 1: Code / Structure Grid Slab */}
      <group position={[0, 0, 0]}>
        <mesh>
          <boxGeometry args={[1.66, 2.98, 0.03]} />
          <meshStandardMaterial
            color="#18181D"
            metalness={0.45}
            roughness={0.25}
            transparent
            opacity={0.9}
          />
        </mesh>
        {/* Minimal wireframe structure */}
        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[1.68, 3.0, 0.032]} />
          <meshStandardMaterial color="#52525B" wireframe />
        </mesh>
      </group>

      {/* Layer 2: Kinetic Accent Frame */}
      <group position={[0, 0, 0.06 + layerGap]}>
        {/* Top vermilion editorial hero bar */}
        <mesh position={[-0.18, 0.82, 0]}>
          <boxGeometry args={[1.1, 0.34, 0.05]} />
          <meshStandardMaterial
            color="#FF3B30"
            emissive="#FF3B30"
            emissiveIntensity={0.35}
            metalness={0.25}
            roughness={0.3}
          />
        </mesh>
        {/* Clean white content bars */}
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[1.42, 0.14, 0.04]} />
          <meshStandardMaterial color="#F5F5F7" roughness={0.3} />
        </mesh>
        <mesh position={[-0.22, -0.02, 0]}>
          <boxGeometry args={[0.98, 0.14, 0.04]} />
          <meshStandardMaterial color="#A1A1AA" roughness={0.35} />
        </mesh>
      </group>

      {/* Layer 3: Foreground 3D Focal Element (Floating sculpted prism) */}
      <group position={[0.1, -0.68, 0.56 + layerGap * 1.4]}>
        <mesh rotation={[frame * 0.018, frame * 0.024, 0]}>
          <octahedronGeometry args={[0.42, 0]} />
          <meshStandardMaterial
            color="#F5F5F7"
            metalness={0.75}
            roughness={0.18}
          />
        </mesh>
        <mesh rotation={[frame * 0.018, frame * 0.024, 0]}>
          <octahedronGeometry args={[0.48, 0]} />
          <meshStandardMaterial
            color="#FF3B30"
            emissive="#FF3B30"
            emissiveIntensity={0.4}
            wireframe
          />
        </mesh>
      </group>
    </group>
  );
};

export const Scene2Remotion3D: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();

  const cameraDrift = interpolate(frame, [0, durationInFrames], [1, 1.03], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 1 headline: "Cukup tulis komponen React." (f10..f76)
  // Phase 2 headline: "Tambah Three.js." (f77+)
  const isPhase2 = frame >= 76;

  const phase2Progress = spring({
    frame: Math.max(0, frame - 76),
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const bottomOpacity = interpolate(frame, [120, 134], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      {/* Audio: VO + 3D explosion whoosh + chime */}
      <Audio
        from={VO_OFFSET}
        src={staticFile("audio/intro-remotion/vo/vo-scene2.mp3")}
      />
      <Audio
        from={74}
        src={staticFile("audio/sfx/whoosh.wav")}
        volume={0.42}
      />
      <Audio
        from={152}
        src={staticFile("audio/sfx/ding.wav")}
        volume={0.22}
      />

      {/* Subtle studio key backdrop light */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 48%, rgba(255, 255, 255, 0.05) 0%, transparent 56%)",
          pointerEvents: "none",
        }}
      />

      {/* Fullscreen Three.js 3D Stage */}
      <AbsoluteFill>
        <ThreeCanvas
          width={width}
          height={height}
          camera={{ position: [0, 0, 7.8], fov: 38 }}
        >
          <ambientLight intensity={0.85} />
          <directionalLight
            position={[5, 6, 6]}
            intensity={2.4}
            color="#FFF7ED"
          />
          <directionalLight
            position={[-6, -2, 3]}
            intensity={1.35}
            color="#E2E8F0"
          />
          <pointLight
            position={[2.5, -2.5, 4]}
            intensity={14}
            distance={12}
            color="#FF3B30"
          />
          <Exploded3DDevice />
        </ThreeCanvas>
      </AbsoluteFill>

      {/* Safe-Zone Editorial Typography Overlay */}
      <AbsoluteFill style={{ transform: `scale(${cameraDrift})` }}>
        <SafeArea style={{ justifyContent: "space-between" }}>
          {/* TOP ZONE */}
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: `1px solid ${COLORS.border}`,
                paddingBottom: 22,
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 22,
                  color: COLORS.textSecondary,
                  letterSpacing: "0.12em",
                }}
              >
                02 / ARSITEKTUR
              </span>
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 22,
                  color: isPhase2 ? COLORS.accent : COLORS.textMuted,
                  letterSpacing: "0.08em",
                }}
              >
                {isPhase2 ? "Z-DEPTH EXPLODED" : "REACT CANVAS"}
              </span>
            </div>

            {!isPhase2 ? (
              <div
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 74,
                  fontWeight: 800,
                  lineHeight: 1.06,
                  letterSpacing: "-0.035em",
                  color: COLORS.textPrimary,
                  opacity: interpolate(frame, [10, 20], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              >
                Cukup tulis
                <br />
                komponen{" "}
                <span
                  style={{
                    fontFamily: FONTS.serif,
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: 92,
                    color: COLORS.accent,
                  }}
                >
                  React.
                </span>
              </div>
            ) : (
              <div
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 74,
                  fontWeight: 800,
                  lineHeight: 1.06,
                  letterSpacing: "-0.035em",
                  color: COLORS.textPrimary,
                  transform: `translateY(${interpolate(phase2Progress, [0, 1], [28, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
                  opacity: interpolate(frame, [76, 86], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              >
                Mau tiga dimensi?
                <br />
                Masukin{" "}
                <span
                  style={{
                    fontFamily: FONTS.serif,
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: 94,
                    color: COLORS.accent,
                  }}
                >
                  Three.js.
                </span>
              </div>
            )}
          </div>

          {/* BOTTOM ZONE: Clean Editorial Caption in Open Space */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              opacity: bottomOpacity,
              borderTop: `1px solid ${COLORS.border}`,
              paddingTop: 26,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: FONTS.mono,
                fontSize: 22,
                color: COLORS.accent,
                letterSpacing: "0.1em",
              }}
            >
              <span>01 CHASSIS</span>
              <span>02 UI SLAB</span>
              <span>03 3D MESH</span>
            </div>
            <div
              style={{
                fontFamily: FONTS.sans,
                fontSize: 44,
                fontWeight: 500,
                lineHeight: 1.28,
                color: COLORS.textSecondary,
              }}
            >
              Kamera, cahaya, dan layer 3D ikut{" "}
              <span style={{ color: COLORS.textPrimary, fontWeight: 700 }}>
                frame.
              </span>
            </div>
          </div>
        </SafeArea>
      </AbsoluteFill>

      <FilmGrain />
    </AbsoluteFill>
  );
};
