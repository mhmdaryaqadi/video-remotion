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

const VO_OFFSET = PEARL_HARBOR_TIMING.scene9VoOffset;

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

const StudioDeskBackdrop: React.FC<{ readonly frame: number }> = ({ frame }) => {
  const camX = interpolate(frame, [0, 180, 334], [-0.25, 0.15, 0.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const camY = interpolate(frame, [0, 334], [1.45, 1.32]);

  return (
    <>
      <CameraRig position={[camX, camY, 3.85]} lookAt={[0, 0.3, -0.2]} />
      <DocLightRig ambient={0.94} keyPosition={[4, 7, 5]} keyIntensity={1.1} />

      {/* Warm Newsroom Wall & Baseboard */}
      <ToonBox args={[8, 5, 0.2]} color="#EAE3D2" position={[0, 1.3, -1.6]} />
      <ToonBox args={[8, 1.0, 0.22]} color="#C0B7A1" position={[0, -0.65, -1.58]} />

      {/* Wooden Broadcast Desk */}
      <ToonBox args={[5.5, 0.16, 2.4]} color={PH_COLORS.deskWood} position={[0, -0.45, 0]} />

      {/* Green Banker's Lamp on Upper-Left Corner */}
      <group position={[-1.05, -0.35, -0.55]}>
        <ToonCylinder args={[0.14, 0.18, 0.06, 16]} color={PH_COLORS.brass} position={[0, 0.03, 0]} />
        <ToonCylinder args={[0.025, 0.025, 0.48, 10]} color={PH_COLORS.brass} position={[0, 0.28, 0]} />
        <ToonBox
          args={[0.42, 0.14, 0.24]}
          color="#166534"
          position={[0.06, 0.54, 0.05]}
          rotation={[0.25, 0.2, 0]}
        />
      </group>

      {/* Vintage Brass Radio Microphone on Right Corner */}
      <group position={[1.05, -0.35, -0.35]}>
        <ToonCylinder args={[0.14, 0.16, 0.05, 16]} color="#334155" position={[0, 0.025, 0]} />
        <ToonCylinder args={[0.022, 0.026, 0.36, 10]} color={PH_COLORS.brass} position={[0, 0.2, 0]} />
        <ToonSphere radius={0.11} color="#94A3B8" position={[0, 0.44, 0]} scale={[1, 1.25, 0.78]} />
      </group>

      {/* Stacked Archival Newsprint Folders */}
      <ToonBox args={[0.95, 0.08, 0.7]} color={PH_COLORS.paperCard} position={[-0.65, -0.32, 0.2]} rotation={[0, 0.14, 0]} />
      <ToonBox args={[0.95, 0.08, 0.7]} color="#F0EAD8" position={[-0.62, -0.24, 0.22]} rotation={[0, -0.08, 0]} />
    </>
  );
};

export const Scene9NewspaperBoomerang: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const headerEnter = spring({
    frame: Math.max(0, frame - 4),
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  // Newspaper spins/drops in over f6..52
  const paperEnter = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const paperSpin = interpolate(paperEnter, [0, 1], [-18, -2]);
  const paperScale = interpolate(paperEnter, [0, 1], [0.45, 1.0]);
  const paperShiftY = interpolate(frame, [180, 215], [0, -165], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const paperScaleShrink = interpolate(frame, [180, 215], [1, 0.84], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Highlighter wipe under "DECLARES WAR" at f124..165 ("Amerika resmi mutusin perang")
  const highlightWidthPct = interpolate(frame, [124, 165], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Red "RESMI PERANG" stamp at f146
  const warStamp = spring({
    frame: Math.max(0, frame - 146),
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  // Boomerang Reversal panel at f184+
  const boomerangActive = frame >= 184;
  const boomEnter = spring({
    frame: Math.max(0, frame - 184),
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const boomFlip = spring({
    frame: Math.max(0, frame - 260),
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#EAE3D2" }}>
      <Sequence from={VO_OFFSET}>
        <Audio src={staticFile("audio/pearl-harbor/vo/vo-scene9.mp3")} volume={1} />
      </Sequence>

      <Sequence from={12} durationInFrames={45}>
        <Audio src={staticFile("audio/pearl-harbor/sfx/typewriter.wav")} volume={0.32} />
      </Sequence>
      <Sequence from={146} durationInFrames={50}>
        <Audio src={staticFile("audio/pearl-harbor/sfx/explosion-soft.wav")} volume={0.28} />
      </Sequence>
      <Sequence from={188} durationInFrames={45}>
        <Audio src={staticFile("audio/pearl-harbor/sfx/typewriter.wav")} volume={0.3} />
      </Sequence>

      {/* 3D Studio Newsroom Desk Backdrop */}
      <AbsoluteFill>
        <ThreeCanvas
          width={width}
          height={height}
          camera={{ position: [-0.25, 1.45, 3.85], fov: 46 }}
          shadows
        >
          <StudioDeskBackdrop frame={frame} />
        </ThreeCanvas>
      </AbsoluteFill>

      {/* Top Chapter Tag */}
      <div
        style={{
          position: "absolute",
          top: 86,
          left: 56,
          zIndex: 30,
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
          8 DESEMBER 1941 · WASHINGTON D.C.
        </span>
      </div>

      {/* Archival Newspaper Front Page */}
      <div
        style={{
          position: "absolute",
          top: 410,
          left: 84,
          right: 84,
          zIndex: 20,
          opacity: paperEnter,
          transform: `translateY(${paperShiftY}px) scale(${paperScale * paperScaleShrink}) rotate(${paperSpin}deg)`,
          backgroundColor: "#FAF7EE",
          border: `3.5px solid ${PH_COLORS.ink}`,
          borderRadius: 12,
          padding: "28px 34px 34px",
          boxShadow: "12px 14px 0px #1A1D24",
        }}
      >
        {/* Newspaper Masthead */}
        <div
          style={{
            borderBottom: `3px solid ${PH_COLORS.ink}`,
            paddingBottom: 10,
            marginBottom: 14,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <span
            style={{
              fontFamily: FONTS.serif,
              fontSize: 30,
              fontWeight: 800,
              color: PH_COLORS.ink,
              letterSpacing: "0.04em",
            }}
          >
            THE DAILY CHRONICLE
          </span>
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 18,
              fontWeight: 700,
              color: PH_COLORS.inkMuted,
            }}
          >
            8 DESEMBER 1941
          </span>
        </div>

        {/* Bold Newspaper Headline with animated yellow-orange highlighter */}
        <div
          style={{
            fontFamily: FONTS.sans,
            fontSize: 64,
            fontWeight: 900,
            lineHeight: 1.04,
            letterSpacing: "-0.03em",
            color: PH_COLORS.ink,
            textTransform: "uppercase",
            marginBottom: 18,
          }}
        >
          U.S.{" "}
          <span style={{ position: "relative", display: "inline-block", padding: "0 8px" }}>
            <span
              style={{
                position: "absolute",
                left: 0,
                top: 6,
                bottom: 4,
                width: `${highlightWidthPct}%`,
                backgroundColor: "#FDE047",
                zIndex: -1,
                borderRadius: 6,
              }}
            />
            DECLARES WAR
          </span>
          <br />
          ON JAPAN
        </div>

        {/* Newspaper Sub-columns mockup */}
        <div
          style={{
            display: "flex",
            gap: 24,
            borderTop: "2px solid rgba(26,29,36,0.22)",
            paddingTop: 16,
          }}
        >
          <div
            style={{
              flex: 1.2,
              backgroundColor: "#E2E8F0",
              border: `2px solid ${PH_COLORS.ink}`,
              borderRadius: 6,
              padding: 14,
              fontFamily: FONTS.serif,
              fontSize: 22,
              fontStyle: "italic",
              color: PH_COLORS.ink,
              lineHeight: 1.3,
            }}
          >
            &ldquo;December 7, 1941 — a date which will live in infamy.&rdquo;
            <div
              style={{
                fontFamily: FONTS.mono,
                fontStyle: "normal",
                fontSize: 15,
                marginTop: 8,
                color: PH_COLORS.inkMuted,
              }}
            >
              — Presiden F.D. Roosevelt
            </div>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 10,
            }}
          >
            {[95, 88, 92, 74].map((w, idx) => (
              <div
                key={idx}
                style={{
                  height: 12,
                  width: `${w}%`,
                  backgroundColor: "rgba(26, 29, 36, 0.16)",
                  borderRadius: 4,
                }}
              />
            ))}
          </div>
        </div>

        {/* Official Red Ink Stamp */}
        {frame >= 146 && (
          <div
            style={{
              position: "absolute",
              right: 34,
              bottom: 26,
              transform: `scale(${warStamp}) rotate(-10deg)`,
              border: `4px solid ${PH_COLORS.alertRed}`,
              backgroundColor: "rgba(255,255,255,0.92)",
              color: PH_COLORS.alertRed,
              borderRadius: 10,
              padding: "8px 18px",
              fontFamily: FONTS.mono,
              fontSize: 26,
              fontWeight: 900,
              letterSpacing: "0.08em",
            }}
          >
            RESMI PERANG!
          </div>
        )}
      </div>

      {/* Boomerang Reversal Panel (f242..424) */}
      {boomerangActive && (
        <div
          style={{
            position: "absolute",
            top: 790,
            left: 72,
            right: 72,
            zIndex: 24,
            opacity: boomEnter,
            transform: `translateY(${(1 - boomEnter) * 40}px)`,
            backgroundColor: PH_COLORS.paperCard,
            border: `3px solid ${PH_COLORS.ink}`,
            borderRadius: 18,
            padding: "24px 28px",
            boxShadow: "8px 8px 0px #1A1D24",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* Expectation vs Reality Flip */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#FEE2E2",
              border: `2px solid ${PH_COLORS.ink}`,
              borderRadius: 12,
              padding: "12px 18px",
            }}
          >
            <div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 16, fontWeight: 700, color: PH_COLORS.alertRed }}>
                NIAT AWAL JEPANG
              </div>
              <div
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 28,
                  fontWeight: 800,
                  color: PH_COLORS.ink,
                  textDecoration: "line-through",
                }}
              >
                Amerika Mundur &amp; Takut
              </div>
            </div>
            <div
              style={{
                fontFamily: FONTS.sans,
                fontSize: 34,
                fontWeight: 900,
                color: PH_COLORS.alertRed,
              }}
            >
              ✕
            </div>
          </div>

          {/* Backfire Boom Result */}
          <div
            style={{
              transform: `scale(${0.92 + 0.08 * boomFlip})`,
              backgroundColor: PH_COLORS.highlightOrange,
              border: `2.5px solid ${PH_COLORS.ink}`,
              borderRadius: 12,
              padding: "14px 20px",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "4px 4px 0px #1A1D24",
            }}
          >
            <div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 17, fontWeight: 800 }}>
                BUMERANG TERBESAR ↩
              </div>
              <div style={{ fontFamily: FONTS.sans, fontSize: 32, fontWeight: 900 }}>
                Mobilisasi Perang Penuh AS
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Callout on FDR Speech */}
      <DocCallout
        x={56}
        y={178}
        enterFrame={34}
        exitFrame={178}
        badgeText="KONGRES AMERIKA"
        title='Pidato "Day of Infamy"'
        subtitle="Sehari usai serangan, AS resmi masuk Perang Dunia II."
        source="Library of Congress Archives"
        accentColor={PH_COLORS.highlightOrange}
        maxWidth={510}
      />

      <DocCaptions
        words={PEARL_HARBOR_AUDIO_DATA["vo-scene9"].words}
        voOffset={VO_OFFSET}
        highlightColor={PH_COLORS.highlightOrange}
        bottom={290}
      />
    </AbsoluteFill>
  );
};
