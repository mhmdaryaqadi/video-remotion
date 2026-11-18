import React from "react";
import { Audio } from "@remotion/media";
import { ThreeCanvas } from "@remotion/three";
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
import { WordCaptions } from "../../../shared/components/WordCaptions";
import {
  DSNStationId,
  EarthDSNModel,
} from "../components3d/EarthDSNModel";
import { VOYAGER_AUDIO_DATA } from "../subtitles";
import { COLORS, FONTS, SPRING_CONFIGS, VOYAGER_TIMING } from "../theme";

const VO_OFFSET = VOYAGER_TIMING.scene2VoOffset;

const STATION_CARDS: readonly {
  readonly id: DSNStationId;
  readonly country: string;
  readonly site: string;
  readonly appearFrame: number;
  readonly accent: string;
}[] = [
  {
    id: "usa",
    country: "Amerika",
    site: "Goldstone 70m",
    appearFrame: 204,
    accent: "#38BDF8",
  },
  {
    id: "spain",
    country: "Spanyol",
    site: "Madrid 70m",
    appearFrame: 230,
    accent: "#FF5A26",
  },
  {
    id: "australia",
    country: "Australia",
    site: "Canberra 70m",
    appearFrame: 262,
    accent: "#34D399",
  },
];

// Normalize angle modulo 2*PI into [-PI, PI]
const shortestAngleAbs = (a: number, b: number): number => {
  const diff = ((a - b + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
  return Math.abs(diff);
};

export const Scene2DSN: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Phase 1 (f0..136): "Caranya gimana? NASA nggak pakai Wi-Fi atau satelit biasa."
  // Phase 2 (f136..298): "Mereka pakai tiga antena parabola raksasa di Amerika, Spanyol, dan Australia."
  // Phase 3 (f298..587): "Kenapa harus tiga? Karena Bumi itu muter... gantian nangkap."
  const isPhase1 = frame < 136;
  const isPhase3 = frame >= 302;

  const phase1Opacity = interpolate(frame, [4, 14, 124, 136], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Strikethrough timings matched to VO: "Wi-Fi" (f84), "satelit biasa" (f101)
  const wifiStrike = interpolate(frame, [82, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const satelitStrike = interpolate(frame, [100, 114], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // 3D Earth enters softly from f130 onward
  const earthOpacity = interpolate(frame, [130, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const earthEnterSpring = spring({
    frame: Math.max(0, frame - 132),
    fps,
    config: SPRING_CONFIGS.smooth,
  });
  const earthScale = interpolate(earthEnterSpring, [0, 1], [0.7, 0.88], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Choreograph globe rotation:
  // Target rotY so station faces camera (+Z): ry = -lonRad
  // USA (-117 deg = +2.04 rad), Spain (-4 deg = +0.07 rad), Australia (+149 deg = -2.60 rad)
  // Then from f310..587: steady West-to-East Earth spin (+rotY) demonstrating live handoff!
  const rotTour = interpolate(
    frame,
    [136, 196, 220, 234, 248, 266, 298],
    [2.5, 2.04, 2.04, 0.07, 0.07, -2.6, -2.6],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    },
  );
  const rotSpinOffset = interpolate(frame, [298, 587], [0, 4.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const earthRotY = rotTour + rotSpinOffset;

  // Determine which station is forced during the 3-country rollcall, then auto-detect by facing angle during spin
  let activeStation: DSNStationId = "usa";
  let forcedHighlight: DSNStationId | null = null;

  if (frame >= 180 && frame < 228) {
    forcedHighlight = "usa";
    activeStation = "usa";
  } else if (frame >= 228 && frame < 258) {
    forcedHighlight = "spain";
    activeStation = "spain";
  } else if (frame >= 258 && frame < 306) {
    forcedHighlight = "australia";
    activeStation = "australia";
  } else if (frame >= 306) {
    // Match whichever station's target camera-facing angle (-lonRad) is closest to current earthRotY
    const dUsa = shortestAngleAbs(earthRotY, 2.04);
    const dSpain = shortestAngleAbs(earthRotY, 0.07);
    const dAus = shortestAngleAbs(earthRotY, -2.6);
    if (dUsa <= dSpain && dUsa <= dAus) activeStation = "usa";
    else if (dSpain <= dAus) activeStation = "spain";
    else activeStation = "australia";
  }

  const activeConfig =
    STATION_CARDS.find((s) => s.id === activeStation) ?? STATION_CARDS[0];

  // Header reveal for Phase 2 & Phase 3
  const header2Opacity = interpolate(frame, [136, 152], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const telemetryOpacity = interpolate(frame, [300, 316], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      {/* Voiceover & SFX */}
      <Audio
        from={VO_OFFSET}
        src={staticFile("audio/voyager-1/vo/vo-scene2.mp3")}
      />
      <Audio
        from={84}
        src={staticFile("audio/sfx/switch.wav")}
        volume={0.28}
      />
      <Audio
        from={101}
        src={staticFile("audio/sfx/switch.wav")}
        volume={0.28}
      />
      <Audio
        from={140}
        src={staticFile("audio/sfx/whoosh.wav")}
        volume={0.25}
      />
      <Audio
        from={206}
        src={staticFile("audio/sfx/mouse-click.wav")}
        volume={0.3}
      />
      <Audio
        from={232}
        src={staticFile("audio/sfx/mouse-click.wav")}
        volume={0.3}
      />
      <Audio
        from={264}
        src={staticFile("audio/sfx/mouse-click.wav")}
        volume={0.3}
      />
      <Audio
        from={512}
        src={staticFile("audio/sfx/ding.wav")}
        volume={0.26}
      />

      {/* Deep Space Radial Halo behind Globe */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 54%, rgba(56, 189, 248, 0.14) 0%, rgba(16, 68, 126, 0.12) 34%, transparent 68%)",
        }}
      />

      {/* 3D Rotating Earth + 3 DSN Antennas */}
      {frame >= 126 && (
        <AbsoluteFill style={{ opacity: earthOpacity }}>
          <ThreeCanvas
            width={width}
            height={height}
            camera={{ position: [0, 0.12, 7.2], fov: 38 }}
            shadows
          >
            <ambientLight intensity={0.46} />
            <directionalLight
              position={[5, 4, 6]}
              intensity={2.2}
              color="#FFF9F0"
            />
            <directionalLight
              position={[-5, -2, -4]}
              intensity={1.0}
              color="#60A5FA"
            />
            <EarthDSNModel
              earthRotY={earthRotY}
              earthTiltX={0.14}
              scale={earthScale}
              position={[0, -0.04, 0]}
              forceHighlightStation={forcedHighlight}
              showBeams
            />
          </ThreeCanvas>
        </AbsoluteFill>
      )}

      <SafeArea
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Top Header */}
        <div style={{ position: "relative" }}>
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
            02
          </div>

          {isPhase1 ? (
            <div style={{ opacity: phase1Opacity }}>
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 20,
                  letterSpacing: "0.14em",
                  color: COLORS.signalCyan,
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                02 · CARA KOMUNIKASI
              </div>
              <div
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 64,
                  fontWeight: 800,
                  lineHeight: 1.08,
                  letterSpacing: "-0.035em",
                  color: COLORS.textPrimary,
                }}
              >
                Caranya{" "}
                <span
                  style={{
                    fontFamily: FONTS.serif,
                    fontStyle: "italic",
                    fontWeight: 400,
                    color: COLORS.accentOrange,
                  }}
                >
                  Gimana?
                </span>
              </div>
            </div>
          ) : (
            <div style={{ opacity: header2Opacity }}>
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 20,
                  letterSpacing: "0.14em",
                  color: isPhase3 ? COLORS.signalMint : COLORS.signalCyan,
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                {isPhase3
                  ? "ROTASI BUMI · TERPISAH ~120°"
                  : "DEEP SPACE NETWORK · NASA"}
              </div>
              <div
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 58,
                  fontWeight: 800,
                  lineHeight: 1.06,
                  letterSpacing: "-0.035em",
                  color: COLORS.textPrimary,
                }}
              >
                {isPhase3 ? (
                  <>
                    Estafet{" "}
                    <span
                      style={{
                        fontFamily: FONTS.serif,
                        fontStyle: "italic",
                        fontWeight: 400,
                        color: COLORS.signalMint,
                      }}
                    >
                      3 Sisi
                    </span>{" "}
                    Bumi
                  </>
                ) : (
                  <>
                    3 Antena{" "}
                    <span
                      style={{
                        fontFamily: FONTS.serif,
                        fontStyle: "italic",
                        fontWeight: 400,
                        color: COLORS.accentOrange,
                      }}
                    >
                      Raksasa
                    </span>
                  </>
                )}
              </div>

              {/* 3-Station Rollcall Strip right under Header */}
              <div
                style={{
                  marginTop: 22,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 12,
                }}
              >
                {STATION_CARDS.map((st) => {
                  const hasAppeared = frame >= st.appearFrame;
                  const isCurrent = activeStation === st.id && frame >= 180;
                  const cardSpring = spring({
                    frame: Math.max(0, frame - st.appearFrame),
                    fps,
                    config: SPRING_CONFIGS.snappy,
                  });
                  return (
                    <div
                      key={st.id}
                      style={{
                        opacity: hasAppeared ? Math.max(0.48, cardSpring) : 0.34,
                        backgroundColor: isCurrent
                          ? "rgba(255, 255, 255, 0.09)"
                          : "rgba(18, 20, 28, 0.78)",
                        border: `1.5px solid ${
                          isCurrent ? st.accent : "rgba(255, 255, 255, 0.12)"
                        }`,
                        borderRadius: 16,
                        padding: "14px 14px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 6,
                        }}
                      >
                        <span
                          style={{
                            width: 9,
                            height: 9,
                            borderRadius: 999,
                            backgroundColor: isCurrent
                              ? st.accent
                              : "rgba(255,255,255,0.28)",
                          }}
                        />
                        <span
                          style={{
                            fontFamily: FONTS.sans,
                            fontSize: 23,
                            fontWeight: 700,
                            color: isCurrent
                              ? COLORS.textPrimary
                              : COLORS.textSecondary,
                          }}
                        >
                          {st.country}
                        </span>
                      </div>
                      <div
                        style={{
                          fontFamily: FONTS.mono,
                          fontSize: 15,
                          color: isCurrent ? st.accent : COLORS.textMuted,
                        }}
                      >
                        {st.site}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Center Myth-Busting Strike Cards (Phase 1 only) */}
        {isPhase1 && (
          <div
            style={{
              opacity: phase1Opacity,
              display: "flex",
              flexDirection: "column",
              gap: 24,
              marginTop: "auto",
              marginBottom: "auto",
            }}
          >
            {[
              {
                label: "Wi-Fi Biasa",
                sub: "Jangkauan cuma puluhan meter",
                strike: wifiStrike,
                appear: 58,
              },
              {
                label: "Satelit Reguler",
                sub: "Cuma mengorbit di sekitar Bumi",
                strike: satelitStrike,
                appear: 82,
              },
            ].map((item, idx) => {
              const cardEnter = spring({
                frame: Math.max(0, frame - item.appear),
                fps,
                config: SPRING_CONFIGS.snappy,
              });
              return (
                <div
                  key={idx}
                  style={{
                    opacity: cardEnter,
                    backgroundColor: "rgba(22, 24, 32, 0.9)",
                    border: "1px solid rgba(255, 255, 255, 0.14)",
                    borderRadius: 26,
                    padding: "28px 32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        fontFamily: FONTS.sans,
                        fontSize: 44,
                        fontWeight: 800,
                        color:
                          item.strike > 0.3
                            ? "rgba(245, 245, 247, 0.45)"
                            : COLORS.textPrimary,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        marginTop: 6,
                        fontFamily: FONTS.sans,
                        fontSize: 22,
                        color: COLORS.textSecondary,
                      }}
                    >
                      {item.sub}
                    </div>
                    {/* Animated red strikethrough bar */}
                    <div
                      style={{
                        position: "absolute",
                        left: -4,
                        top: 26,
                        height: 6,
                        width: `${item.strike * 104}%`,
                        backgroundColor: COLORS.accent,
                        borderRadius: 999,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontFamily: FONTS.mono,
                      fontSize: 22,
                      fontWeight: 700,
                      padding: "10px 18px",
                      borderRadius: 12,
                      backgroundColor: "rgba(255, 59, 48, 0.16)",
                      color: COLORS.accent,
                      border: "1px solid rgba(255, 59, 48, 0.4)",
                      opacity: interpolate(item.strike, [0.2, 0.8], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      }),
                    }}
                  >
                    TIDAK CUKUP
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Handoff Telemetry Card (Phase 3) */}
        {frame >= 298 ? (
          <div
            style={{
              opacity: telemetryOpacity,
              backgroundColor: "rgba(14, 16, 23, 0.88)",
              border: `1px solid ${activeConfig.accent}55`,
              borderRadius: 24,
              padding: "22px 26px",
              marginBottom: 46,
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 17,
                  letterSpacing: "0.12em",
                  color: COLORS.textSecondary,
                  marginBottom: 6,
                }}
              >
                STASIUN YANG SEDANG NANGKAP SINYAL
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 999,
                    backgroundColor: activeConfig.accent,
                    boxShadow: `0 0 12px ${activeConfig.accent}`,
                  }}
                />
                <span
                  style={{
                    fontFamily: FONTS.sans,
                    fontSize: 34,
                    fontWeight: 800,
                    color: COLORS.textPrimary,
                  }}
                >
                  {activeConfig.country} · {activeConfig.site}
                </span>
              </div>
            </div>
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 18,
                fontWeight: 700,
                padding: "10px 16px",
                borderRadius: 14,
                backgroundColor: "rgba(52, 211, 153, 0.14)",
                color: COLORS.signalMint,
                border: "1px solid rgba(52, 211, 153, 0.35)",
              }}
            >
              ESTAFET 24/7
            </div>
          </div>
        ) : (
          <div />
        )}
      </SafeArea>

      {/* Bottom Synced Word Captions */}
      <WordCaptions
        words={VOYAGER_AUDIO_DATA["vo-scene2"].words}
        voOffset={VO_OFFSET}
        accentColor={COLORS.accentOrange}
        bottom={82}
      />

      <FilmGrain opacity={0.055} />
    </AbsoluteFill>
  );
};
