import React from "react";
import { Audio } from "@remotion/media";
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
import { COLORS, FONTS, SPRING_CONFIGS } from "../theme";

const VO_OFFSET = 10;

// 9 geometric slots: 8 filled obsidian blocks + 1 missing slot (index 5, right edge)
const PATTERN_INDICES = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;
const MISSING_INDEX = 5;

export const Scene3InfoGap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const cameraDrift = interpolate(frame, [0, durationInFrames], [1, 1.032], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Spoken cues (+ VO_OFFSET = 10):
  // "Rahasianya?" -> f13
  // "Information gap." -> f62
  // "Otak kita nggak suka lihat pola yang bolong." -> f117..170
  const headlineSpring = spring({
    frame: Math.max(0, frame - 58),
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const headlineY = interpolate(headlineSpring, [0, 1], [36, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headlineOpacity = interpolate(frame, [58, 68], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const missingPulse = interpolate(
    Math.sin(frame * 0.14),
    [-1, 1],
    [0.6, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const kickerSpring = spring({
    frame: Math.max(0, frame - 117),
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const kickerY = interpolate(kickerSpring, [0, 1], [32, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const kickerOpacity = interpolate(frame, [117, 128], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.paper,
        overflow: "hidden",
      }}
    >
      {/* Audio: VO + tactile pattern clicks */}
      <Audio
        from={VO_OFFSET}
        src={staticFile("audio/intro-remotion/vo/vo-scene3.mp3")}
      />
      <Audio
        from={58}
        src={staticFile("audio/sfx/switch.wav")}
        volume={0.3}
      />
      <Audio
        from={86}
        src={staticFile("audio/sfx/mouse-click.wav")}
        volume={0.28}
      />
      <Audio
        from={154}
        src={staticFile("audio/sfx/ding.wav")}
        volume={0.24}
      />

      <AbsoluteFill style={{ transform: `scale(${cameraDrift})` }}>
        <SafeArea style={{ justifyContent: "space-between" }}>
          {/* TOP ZONE: Polarity-shifted Ink on Warm Paper */}
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: `1px solid ${COLORS.borderLight}`,
                paddingBottom: 22,
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 22,
                  color: COLORS.inkSecondary,
                  letterSpacing: "0.12em",
                }}
              >
                03 / PSIKOLOGI
              </span>
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 22,
                  fontWeight: 700,
                  color: COLORS.accent,
                  letterSpacing: "0.08em",
                }}
              >
                RAHASIANYA?
              </span>
            </div>

            <div
              style={{
                opacity: headlineOpacity,
                transform: `translateY(${headlineY}px)`,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 94,
                  fontWeight: 800,
                  lineHeight: 0.98,
                  letterSpacing: "-0.045em",
                  color: COLORS.inkPrimary,
                }}
              >
                Information
              </span>
              <span
                style={{
                  fontFamily: FONTS.serif,
                  fontStyle: "italic",
                  fontSize: 138,
                  fontWeight: 400,
                  lineHeight: 0.88,
                  color: COLORS.accent,
                }}
              >
                gap.
              </span>
            </div>
          </div>

          {/* CENTER ZONE: 3x3 Editorial Pattern Matrix with 1 Glaring Missing Block */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px 0",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 180px)",
                gridTemplateRows: "repeat(3, 180px)",
                gap: 22,
              }}
            >
              {PATTERN_INDICES.map((idx) => {
                const isMissing = idx === MISSING_INDEX;
                const order = idx > MISSING_INDEX ? idx - 1 : idx;
                const tileDelay = 30 + order * 6;
                const tileSpring = spring({
                  frame: Math.max(0, frame - tileDelay),
                  fps,
                  config: SPRING_CONFIGS.snappy,
                });
                const tileScale = interpolate(tileSpring, [0, 1], [0.7, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
                const tileOpacity = interpolate(
                  Math.max(0, frame - tileDelay),
                  [0, 8],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                );

                if (isMissing) {
                  const gapAppear = interpolate(frame, [72, 86], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  });
                  return (
                    <div
                      key={idx}
                      style={{
                        borderRadius: 20,
                        border: `3px dashed ${COLORS.accent}`,
                        backgroundColor: "rgba(255, 59, 48, 0.08)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 4,
                        opacity: gapAppear * missingPulse,
                        transform: `scale(${interpolate(gapAppear, [0, 1], [0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: FONTS.serif,
                          fontStyle: "italic",
                          fontSize: 78,
                          lineHeight: 1,
                          color: COLORS.accent,
                        }}
                      >
                        ?
                      </span>
                      <span
                        style={{
                          fontFamily: FONTS.mono,
                          fontSize: 18,
                          fontWeight: 700,
                          color: COLORS.accent,
                          letterSpacing: "0.1em",
                        }}
                      >
                        BOLONG
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={idx}
                    style={{
                      borderRadius: 20,
                      backgroundColor: COLORS.inkPrimary,
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "space-between",
                      padding: 20,
                      opacity: tileOpacity,
                      transform: `scale(${tileScale})`,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: FONTS.mono,
                        fontSize: 20,
                        color: "rgba(243, 241, 236, 0.45)",
                      }}
                    >
                      0{idx + 1}
                    </span>
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 999,
                        backgroundColor: "rgba(243, 241, 236, 0.3)",
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* BOTTOM ZONE: Word-synced Takeaway directly on Warm Paper */}
          <div
            style={{
              opacity: kickerOpacity,
              transform: `translateY(${kickerY}px)`,
              borderTop: `1px solid ${COLORS.borderLight}`,
              paddingTop: 28,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div
              style={{
                fontFamily: FONTS.sans,
                fontSize: 52,
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: "-0.025em",
                color: COLORS.inkPrimary,
              }}
            >
              Otak kita nggak suka
              <br />
              lihat pola yang{" "}
              <span
                style={{
                  fontFamily: FONTS.serif,
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: 66,
                  color: COLORS.accent,
                }}
              >
                bolong.
              </span>
            </div>
          </div>
        </SafeArea>
      </AbsoluteFill>

      <FilmGrain opacity={0.045} />
    </AbsoluteFill>
  );
};
