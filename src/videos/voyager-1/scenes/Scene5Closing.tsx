import React from "react";
import { Audio } from "@remotion/media";
import { ThreeCanvas } from "@remotion/three";
import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FilmGrain } from "../../../shared/components/FilmGrain";
import { SafeArea } from "../../../shared/components/SafeArea";
import { WordCaptions } from "../../../shared/components/WordCaptions";
import { VoyagerModel } from "../components3d/VoyagerModel";
import { VOYAGER_AUDIO_DATA } from "../subtitles";
import { COLORS, FONTS, SPRING_CONFIGS, VOYAGER_TIMING } from "../theme";

const VO_OFFSET = VOYAGER_TIMING.scene5VoOffset;

export const Scene5Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();

  const enterSpring = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.smooth,
  });

  // Gradual poetic pull-away into interstellar space
  const voyagerScale = interpolate(frame, [0, durationInFrames], [0.74, 0.52], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const voyagerRotY = interpolate(frame, [0, durationInFrames], [-1.24, -1.56], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const voyagerZ = interpolate(frame, [0, durationInFrames], [0, -1.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const timelineProgress = interpolate(frame, [20, 145], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      <Audio
        from={VO_OFFSET}
        src={staticFile("audio/voyager-1/vo/vo-scene5.mp3")}
      />
      <Audio
        from={132}
        src={staticFile("audio/sfx/ding.wav")}
        volume={0.28}
      />

      {/* Deep interstellar glow */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 48%, rgba(56, 189, 248, 0.11) 0%, rgba(229, 169, 60, 0.06) 36%, transparent 72%)",
        }}
      />

      {/* 3D Voyager drifting cleanly further into outer space */}
      <AbsoluteFill style={{ opacity: enterSpring }}>
        <ThreeCanvas
          width={width}
          height={height}
          camera={{ position: [0, 0.14, 7.6], fov: 38 }}
        >
          <ambientLight intensity={0.44} />
          <directionalLight position={[4.5, 6, 5]} intensity={2.3} color="#FFF8EE" />
          <directionalLight position={[-5, -2, -4]} intensity={1.05} color="#38BDF8" />
          <pointLight position={[1.8, -0.8, 2.2]} intensity={1.1} color="#E5A93C" />
          <VoyagerModel
            position={[0.1, -0.04, voyagerZ]}
            scale={voyagerScale}
            rotation={[0.24, voyagerRotY, -0.1]}
            signalPulse
            showStars
          />
        </ThreeCanvas>
      </AbsoluteFill>

      <SafeArea
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Top Editorial Header */}
        <div style={{ position: "relative", opacity: enterSpring }}>
          <div
            style={{
              position: "absolute",
              top: -28,
              right: -6,
              fontFamily: FONTS.sans,
              fontSize: 150,
              fontWeight: 800,
              lineHeight: 0.9,
              letterSpacing: "-0.06em",
              color: "transparent",
              WebkitTextStroke: "1.5px rgba(255, 255, 255, 0.14)",
              userSelect: "none",
            }}
          >
            05
          </div>

          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 20,
              letterSpacing: "0.14em",
              color: COLORS.gold,
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            05 · 1977 — SEKARANG
          </div>

          <div
            style={{
              fontFamily: FONTS.sans,
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.035em",
              color: COLORS.textPrimary,
            }}
          >
            Masih{" "}
            <span
              style={{
                fontFamily: FONTS.serif,
                fontStyle: "italic",
                fontWeight: 400,
                color: COLORS.gold,
              }}
            >
              Setia
            </span>{" "}
            Ngabarin.
          </div>
          <div
            style={{
              marginTop: 10,
              fontFamily: FONTS.sans,
              fontSize: 27,
              color: COLORS.textSecondary,
            }}
          >
            Terbang jauh di luar tata surya sejak 1977
          </div>
        </div>

        {/* Bottom Legacy Mission Card */}
        <div
          style={{
            opacity: enterSpring,
            backgroundColor: "rgba(14, 16, 23, 0.88)",
            border: "1px solid rgba(229, 169, 60, 0.38)",
            borderRadius: 24,
            padding: "24px 28px",
            marginBottom: 46,
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 18,
                color: COLORS.textSecondary,
                letterSpacing: "0.1em",
              }}
            >
              STATUS MISI ANTARBINTANG
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontFamily: FONTS.mono,
                fontSize: 18,
                fontWeight: 700,
                color: COLORS.signalMint,
              }}
            >
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 999,
                  backgroundColor: COLORS.signalMint,
                  boxShadow: `0 0 10px ${COLORS.signalMint}`,
                }}
              />
              ONLINE · AKTIF
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 26,
                fontWeight: 700,
                color: COLORS.gold,
              }}
            >
              1977
            </span>
            <div
              style={{
                flex: 1,
                height: 8,
                borderRadius: 999,
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${timelineProgress}%`,
                  height: "100%",
                  borderRadius: 999,
                  background:
                    "linear-gradient(90deg, #E5A93C 0%, #38BDF8 65%, #34D399 100%)",
                }}
              />
            </div>
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 26,
                fontWeight: 700,
                color: COLORS.signalCyan,
              }}
            >
              HARI INI
            </span>
          </div>
        </div>
      </SafeArea>

      <WordCaptions
        words={VOYAGER_AUDIO_DATA["vo-scene5"].words}
        voOffset={VO_OFFSET}
        accentColor={COLORS.gold}
        bottom={82}
      />

      <FilmGrain opacity={0.055} />
    </AbsoluteFill>
  );
};
