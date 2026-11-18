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
import { VoyagerModel } from "../components3d/VoyagerModel";
import { VOYAGER_AUDIO_DATA } from "../subtitles";
import { COLORS, FONTS, SPRING_CONFIGS, VOYAGER_TIMING } from "../theme";

const VO_OFFSET = VOYAGER_TIMING.scene1VoOffset;

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Phase 1: Chat delay metaphor (f0..136)
  // Phase 2: Voyager 1 3D probe + 24B km counter (f128..407)
  const chatOpacity = interpolate(frame, [4, 14, 122, 136], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const chatScale = interpolate(frame, [122, 136], [1, 0.92], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Bubble 1 enters right as VO starts "Bayangin lu ngirim chat"
  const b1Spring = spring({
    frame: Math.max(0, frame - 14),
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const b1Y = interpolate(b1Spring, [0, 1], [32, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Waiting progress bar across 45 hours (f36..88)
  const waitOpacity = interpolate(frame, [34, 44, 122, 134], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const waitHours = Math.round(
    interpolate(frame, [38, 88], [1, 45], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.quad),
    }),
  );

  // Bubble 2 pops in at f90 ("dua hari kemudian")
  const b2Spring = spring({
    frame: Math.max(0, frame - 88),
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const b2Y = interpolate(b2Spring, [0, 1], [36, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 2: Voyager 1 3D reveal (starts f128)
  const voyagerEnter = spring({
    frame: Math.max(0, frame - 128),
    fps,
    config: SPRING_CONFIGS.smooth,
  });
  const voyagerOpacity = interpolate(frame, [126, 144], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const voyagerScale = interpolate(voyagerEnter, [0, 1], [0.58, 0.72], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const voyagerRotY = interpolate(frame, [128, 407], [-1.08, -1.44], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Header transition between Beat 1 and Beat 2
  const headerBeat2 = spring({
    frame: Math.max(0, frame - 134),
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const headerBeat2Y = interpolate(headerBeat2, [0, 1], [28, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Distance counter syncing to "dua puluh empat miliar kilometer" (f296..346)
  const distCardOpacity = interpolate(frame, [238, 254], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const distCardY = interpolate(frame, [238, 258], [32, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const distanceKm = interpolate(frame, [246, 338], [0.4, 24.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const formattedKm = `${Math.floor(distanceKm * 1_000_000_000).toLocaleString("id-ID")} KM`;

  // Animated typing dot state
  const activeDot = Math.floor(frame / 7) % 3;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      {/* Voiceover & SFX */}
      <Audio
        from={VO_OFFSET}
        src={staticFile("audio/voyager-1/vo/vo-scene1.mp3")}
      />
      <Audio
        from={16}
        src={staticFile("audio/sfx/mouse-click.wav")}
        volume={0.34}
      />
      <Audio
        from={90}
        src={staticFile("audio/sfx/ding.wav")}
        volume={0.28}
      />
      <Audio
        from={132}
        src={staticFile("audio/sfx/whoosh.wav")}
        volume={0.26}
      />
      <Audio
        from={312}
        src={staticFile("audio/sfx/switch.wav")}
        volume={0.3}
      />

      {/* Deep space subtle atmospheric glow */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 48%, rgba(56, 189, 248, 0.10) 0%, rgba(255, 90, 38, 0.04) 40%, transparent 72%)",
        }}
      />

      {/* 3D Canvas layer for Voyager 1 */}
      {frame >= 122 && (
        <AbsoluteFill style={{ opacity: voyagerOpacity }}>
          <ThreeCanvas
            width={width}
            height={height}
            camera={{ position: [0, 0.12, 7.6], fov: 38 }}
            shadows
          >
            <ambientLight intensity={0.44} />
            <directionalLight
              position={[4.5, 6, 5]}
              intensity={2.3}
              color="#FFF8EE"
            />
            <directionalLight
              position={[-5, -2, -4]}
              intensity={1.05}
              color="#38BDF8"
            />
            <pointLight position={[1.8, -0.8, 2.2]} intensity={1.1} color="#E5A93C" />
            <VoyagerModel
              position={[0.14, -0.06, 0]}
              scale={voyagerScale}
              rotation={[0.26, voyagerRotY, -0.1]}
              signalPulse
              showStars
            />
          </ThreeCanvas>
        </AbsoluteFill>
      )}

      {/* Editorial Foreground UI inside SafeArea */}
      <SafeArea
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Top Header */}
        <div style={{ position: "relative" }}>
          {/* Outlined editorial section numeral */}
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
            01
          </div>

          {frame < 134 ? (
            <div style={{ opacity: chatOpacity }}>
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 20,
                  letterSpacing: "0.14em",
                  color: COLORS.accentOrange,
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                01 · DELAY KOMUNIKASI
              </div>
              <div
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 64,
                  fontWeight: 800,
                  lineHeight: 1.04,
                  letterSpacing: "-0.035em",
                  color: COLORS.textPrimary,
                }}
              >
                Chat Terkirim,
                <br />
                <span
                  style={{
                    fontFamily: FONTS.serif,
                    fontStyle: "italic",
                    fontWeight: 400,
                    color: COLORS.accentOrange,
                  }}
                >
                  2 Hari
                </span>{" "}
                Baru Dibaca.
              </div>
            </div>
          ) : (
            <div
              style={{
                opacity: headerBeat2,
                translate: `0px ${headerBeat2Y}px`,
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 14,
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    backgroundColor: COLORS.signalCyan,
                    boxShadow: `0 0 12px ${COLORS.signalCyan}`,
                  }}
                />
                <span
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 20,
                    letterSpacing: "0.14em",
                    color: COLORS.signalCyan,
                    textTransform: "uppercase",
                  }}
                >
                  NASA · DILUNCURKAN 1977
                </span>
              </div>
              <div
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 78,
                  fontWeight: 800,
                  lineHeight: 1.0,
                  letterSpacing: "-0.04em",
                  color: COLORS.textPrimary,
                }}
              >
                Voyager{" "}
                <span
                  style={{
                    fontFamily: FONTS.serif,
                    fontStyle: "italic",
                    fontWeight: 400,
                    color: COLORS.gold,
                  }}
                >
                  1
                </span>
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontFamily: FONTS.sans,
                  fontSize: 28,
                  fontWeight: 500,
                  color: COLORS.textSecondary,
                }}
              >
                Benda buatan manusia paling jauh di tata surya
              </div>
            </div>
          )}
        </div>

        {/* Center Chat UI Metaphor (Phase 1) */}
        {frame < 138 && (
          <div
            style={{
              opacity: chatOpacity,
              scale: `${chatScale}`,
              backgroundColor: "rgba(20, 22, 30, 0.92)",
              border: "1px solid rgba(255, 255, 255, 0.14)",
              borderRadius: 32,
              padding: "32px 30px",
              boxShadow: "0 30px 70px rgba(0, 0, 0, 0.55)",
              display: "flex",
              flexDirection: "column",
              gap: 24,
              marginTop: "auto",
              marginBottom: "auto",
            }}
          >
            {/* Chat Contact Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: 20,
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 999,
                    background:
                      "linear-gradient(135deg, #E5A93C 0%, #FF5A26 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: FONTS.mono,
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#0B0B0D",
                  }}
                >
                  V1
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: FONTS.sans,
                      fontSize: 28,
                      fontWeight: 700,
                      color: COLORS.textPrimary,
                    }}
                  >
                    Voyager 1 · Deep Space
                  </div>
                  <div
                    style={{
                      fontFamily: FONTS.mono,
                      fontSize: 18,
                      color: COLORS.signalCyan,
                    }}
                  >
                    RUANG ANTARBINTANG
                  </div>
                </div>
              </div>
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 18,
                  padding: "8px 14px",
                  borderRadius: 999,
                  backgroundColor: "rgba(255, 90, 38, 0.14)",
                  color: COLORS.accentOrange,
                  border: "1px solid rgba(255, 90, 38, 0.35)",
                }}
              >
                PING ~45 JAM
              </div>
            </div>

            {/* Outgoing Chat Bubble */}
            <div
              style={{
                alignSelf: "flex-end",
                maxWidth: "82%",
                opacity: b1Spring,
                translate: `0px ${b1Y}px`,
              }}
            >
              <div
                style={{
                  backgroundColor: "#0A84FF",
                  color: "#FFFFFF",
                  padding: "20px 26px",
                  borderRadius: "24px 24px 6px 24px",
                  fontFamily: FONTS.sans,
                  fontSize: 30,
                  fontWeight: 600,
                  lineHeight: 1.3,
                }}
              >
                Bro, cek sistem aman di sana?
              </div>
              <div
                style={{
                  marginTop: 8,
                  textAlign: "right",
                  fontFamily: FONTS.mono,
                  fontSize: 17,
                  color: COLORS.textSecondary,
                }}
              >
                Terkirim · Hari ke-0 (09:00)
              </div>
            </div>

            {/* Wait Timer Pill */}
            <div
              style={{
                opacity: waitOpacity,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 22px",
                borderRadius: 18,
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                border: "1px dashed rgba(255, 255, 255, 0.18)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {[0, 1, 2].map((dotIdx) => (
                  <span
                    key={dotIdx}
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 999,
                      backgroundColor:
                        dotIdx === activeDot
                          ? COLORS.accentOrange
                          : "rgba(255,255,255,0.25)",
                    }}
                  />
                ))}
                <span
                  style={{
                    fontFamily: FONTS.sans,
                    fontSize: 22,
                    color: COLORS.textSecondary,
                    marginLeft: 6,
                  }}
                >
                  Menunggu sinyal melaju...
                </span>
              </div>
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 22,
                  fontWeight: 700,
                  color: COLORS.accentAmber,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                +{waitHours} JAM
              </span>
            </div>

            {/* Delayed Incoming Reply Bubble */}
            <div
              style={{
                alignSelf: "flex-start",
                maxWidth: "86%",
                opacity: b2Spring,
                translate: `0px ${b2Y}px`,
              }}
            >
              <div
                style={{
                  backgroundColor: "#242733",
                  color: COLORS.textPrimary,
                  border: "1px solid rgba(255, 90, 38, 0.45)",
                  padding: "20px 26px",
                  borderRadius: "24px 24px 24px 6px",
                  fontFamily: FONTS.sans,
                  fontSize: 30,
                  fontWeight: 600,
                  lineHeight: 1.3,
                }}
              >
                Aman cuy, gelap banget di sini.
              </div>
              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontFamily: FONTS.mono,
                  fontSize: 17,
                  color: COLORS.accentOrange,
                }}
              >
                <span>✓✓ DITERIMA 2 HARI KEMUDIAN</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Telemetry Distance Card (Phase 2) */}
        {frame >= 235 && (
          <div
            style={{
              opacity: distCardOpacity,
              translate: `0px ${distCardY}px`,
              backgroundColor: "rgba(14, 16, 23, 0.88)",
              border: "1px solid rgba(255, 255, 255, 0.16)",
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
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 18,
                  letterSpacing: "0.12em",
                  color: COLORS.textSecondary,
                }}
              >
                JARAK DARI BUMI SAAT INI
              </span>
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 18,
                  color: COLORS.accentOrange,
                  fontWeight: 700,
                }}
              >
                LIVE TELEMETRY
              </span>
            </div>
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 48,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: COLORS.textPrimary,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {formattedKm}
            </div>
            <div
              style={{
                marginTop: 14,
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 16,
                  color: COLORS.signalCyan,
                }}
              >
                BUMI
              </span>
              <div
                style={{
                  flex: 1,
                  height: 6,
                  borderRadius: 999,
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${interpolate(frame, [246, 338], [10, 96], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: Easing.out(Easing.cubic),
                    })}%`,
                    height: "100%",
                    background:
                      "linear-gradient(90deg, #38BDF8 0%, #FF5A26 100%)",
                    borderRadius: 999,
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 16,
                  color: COLORS.gold,
                }}
              >
                VOYAGER 1
              </span>
            </div>
          </div>
        )}
      </SafeArea>

      {/* Bottom Synced Word Captions */}
      <WordCaptions
        words={VOYAGER_AUDIO_DATA["vo-scene1"].words}
        voOffset={VO_OFFSET}
        accentColor={COLORS.accentOrange}
        bottom={82}
      />

      <FilmGrain opacity={0.055} />
    </AbsoluteFill>
  );
};
