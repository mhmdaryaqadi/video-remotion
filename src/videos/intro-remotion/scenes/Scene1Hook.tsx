import React from "react";
import { Audio } from "@remotion/media";
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

const VO_OFFSET = 4;

const CODE_TOKENS = [
  "const frame = useCurrentFrame();",
  "const scale = spring({ frame, fps });",
  "<ThreeCanvas><ExplodedLayers /></ThreeCanvas>",
] as const;

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Continuous subtle push-in so the frame always breathes
  const cameraScale = interpolate(frame, [0, durationInFrames], [1, 1.045], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Beat timings locked to edge-tts word boundaries (+ VO_OFFSET)
  // Beat 1 (0..92): "Video kayak gini lagi ramai di TikTok sampai YouTube"
  // Beat 2 (93..154): "Bukan diedit manual."
  // Beat 3 (155..232): "Semua ini kodingan."
  const isBeat1 = frame < 93;
  const isBeat2 = frame >= 93 && frame < 155;
  const isBeat3 = frame >= 155;

  // Beat 1 rapid platform stamp cuts: "TikTok" at f46, "IG Reels" at f55, "YouTube" at f64
  const platformStage =
    frame < 44 ? 0 : frame < 55 ? 1 : frame < 64 ? 2 : 3;

  const beat1TextOpacity = interpolate(frame, [2, 10, 86, 93], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Beat 2: "BUKAN DIEDIT MANUAL" + red strike slash at f122
  const beat2Spring = spring({
    frame: Math.max(0, frame - 93),
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const beat2Scale = interpolate(beat2Spring, [0, 1], [1.14, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const strikeProgress = interpolate(frame, [120, 134], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Beat 3: "Semua ini kodingan." impact reveal
  const beat3Frame = Math.max(0, frame - 155);
  const beat3Spring = spring({
    frame: beat3Frame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const beat3Y = interpolate(beat3Spring, [0, 1], [44, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle 4-frame flash invert right on beat 3 impact (frame 155-158)
  const impactFlash = interpolate(frame, [155, 157, 162], [0, 0.14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const activeTokenIdx = Math.min(
    CODE_TOKENS.length - 1,
    Math.floor(Math.max(0, frame - 165) / 18),
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      {/* Audio: VO + crisp beat-locked SFX */}
      <Audio
        from={VO_OFFSET}
        src={staticFile("audio/intro-remotion/vo/vo-scene1.mp3")}
      />
      <Audio
        from={46}
        src={staticFile("audio/sfx/mouse-click.wav")}
        volume={0.32}
      />
      <Audio
        from={64}
        src={staticFile("audio/sfx/switch.wav")}
        volume={0.28}
      />
      <Audio
        from={120}
        src={staticFile("audio/sfx/whip.wav")}
        volume={0.38}
      />
      <Audio
        from={155}
        src={staticFile("audio/sfx/ding.wav")}
        volume={0.22}
      />

      {/* Subtle top-left editorial light falloff (single warm-neutral vignette) */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 22% 18%, rgba(255, 59, 48, 0.08) 0%, transparent 52%)",
          pointerEvents: "none",
        }}
      />

      <AbsoluteFill style={{ transform: `scale(${cameraScale})` }}>
        <SafeArea style={{ justifyContent: "space-between" }}>
          {/* Minimal Editorial Header Marker */}
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
              01 / DEKONSTRUKSI
            </span>
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 22,
                color: COLORS.accent,
                letterSpacing: "0.08em",
              }}
            >
              REC · 30FPS
            </span>
          </div>

          {/* CENTER EDITORIAL STAGE */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {isBeat1 && (
              <div
                style={{
                  opacity: beat1TextOpacity,
                  display: "flex",
                  flexDirection: "column",
                  gap: 32,
                }}
              >
                <div
                  style={{
                    fontFamily: FONTS.sans,
                    fontSize: 72,
                    fontWeight: 700,
                    lineHeight: 1.08,
                    letterSpacing: "-0.03em",
                    color: COLORS.textSecondary,
                  }}
                >
                  Video kayak gini
                  <br />
                  lagi ramai di
                </div>

                {/* Rapid-cut giant platform word */}
                <div
                  style={{
                    fontFamily: FONTS.sans,
                    fontSize: 136,
                    fontWeight: 800,
                    lineHeight: 0.94,
                    letterSpacing: "-0.045em",
                    color:
                      platformStage === 0
                        ? COLORS.textMuted
                        : platformStage === 3
                          ? COLORS.accent
                          : COLORS.textPrimary,
                  }}
                >
                  {platformStage === 0
                    ? "SOSMED."
                    : platformStage === 1
                      ? "TIKTOK."
                      : platformStage === 2
                        ? "REELS."
                        : "YOUTUBE."}
                </div>
              </div>
            )}

            {isBeat2 && (
              <div
                style={{
                  transform: `scale(${beat2Scale})`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <span
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 26,
                    color: COLORS.accent,
                    letterSpacing: "0.14em",
                  }}
                >
                  PLOT TWIST
                </span>

                <div style={{ position: "relative", alignSelf: "flex-start" }}>
                  <div
                    style={{
                      fontFamily: FONTS.sans,
                      fontSize: 112,
                      fontWeight: 800,
                      lineHeight: 0.96,
                      letterSpacing: "-0.045em",
                      color: COLORS.textPrimary,
                      opacity: interpolate(frame, [122, 138], [1, 0.35], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      }),
                    }}
                  >
                    BUKAN
                    <br />
                    DIEDIT
                    <br />
                    MANUAL.
                  </div>

                  {/* Razor-sharp editorial strike bar */}
                  <div
                    style={{
                      position: "absolute",
                      left: -12,
                      top: "48%",
                      width: `${strikeProgress * 104}%`,
                      height: 14,
                      backgroundColor: COLORS.accent,
                      transform: "rotate(-4deg)",
                    }}
                  />
                </div>
              </div>
            )}

            {isBeat3 && (
              <div
                style={{
                  transform: `translateY(${beat3Y}px)`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 28,
                }}
              >
                <div
                  style={{
                    fontFamily: FONTS.sans,
                    fontSize: 88,
                    fontWeight: 800,
                    lineHeight: 1.0,
                    letterSpacing: "-0.04em",
                    color: COLORS.textPrimary,
                  }}
                >
                  SEMUA INI
                </div>
                <div
                  style={{
                    fontFamily: FONTS.serif,
                    fontStyle: "italic",
                    fontSize: 168,
                    fontWeight: 400,
                    lineHeight: 0.88,
                    letterSpacing: "-0.02em",
                    color: COLORS.accent,
                  }}
                >
                  kodingan.
                </div>

                {/* Hairline live-code strip (no boxy dashboard card) */}
                <div
                  style={{
                    marginTop: 28,
                    paddingTop: 24,
                    borderTop: `1px solid ${COLORS.border}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 999,
                      backgroundColor: COLORS.accent,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: FONTS.mono,
                      fontSize: 25,
                      color: COLORS.textSecondary,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                    }}
                  >
                    {CODE_TOKENS[activeTokenIdx]}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Minimal Editorial Footer Note */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontFamily: FONTS.mono,
              fontSize: 20,
              color: COLORS.textMuted,
              letterSpacing: "0.08em",
            }}
          >
            <span>REACT + REMOTION</span>
            <span>FRAME #{String(frame).padStart(3, "0")}</span>
          </div>
        </SafeArea>
      </AbsoluteFill>

      {/* Brief editorial impact flash */}
      {impactFlash > 0 && (
        <AbsoluteFill
          style={{
            backgroundColor: COLORS.paper,
            opacity: impactFlash,
            pointerEvents: "none",
          }}
        />
      )}

      <FilmGrain />
    </AbsoluteFill>
  );
};
