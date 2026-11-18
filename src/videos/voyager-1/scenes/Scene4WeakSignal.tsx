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
import { WordCaptions } from "../../../shared/components/WordCaptions";
import { VOYAGER_AUDIO_DATA } from "../subtitles";
import { COLORS, FONTS, SPRING_CONFIGS, VOYAGER_TIMING } from "../theme";

const VO_OFFSET = VOYAGER_TIMING.scene4VoOffset;

// Deterministic binary telemetry stream
const BIT_STREAM = ["1", "0", "1", "1", "0", "0", "1", "0", "1", "1", "0", "1"];

export const Scene4WeakSignal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.smooth,
  });

  // Beat timings (+10 offset):
  // f0..215: "pemancar Voyager dayanya cuma sekitar dua puluh watt. Sama kayak lampu kulkas di rumah lu."
  // f215..312: "Waktu nyampe Bumi, sinyalnya udah super lemah."
  // f312..494: "Makanya datanya dikirim pelan-pelan, ratusan bit per detik aja biar nggak rusak di jalan."
  const bulbGlowSpring = spring({
    frame: Math.max(0, frame - 146),
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  const equalsSpring = spring({
    frame: Math.max(0, frame - 166),
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  // Signal attenuation phase (f215..312)
  const weakCardSpring = spring({
    frame: Math.max(0, frame - 220),
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const signalDecay = interpolate(frame, [225, 290], [1, 0.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Slow bitrate telemetry card (f315..494)
  const bitrateCardSpring = spring({
    frame: Math.max(0, frame - 318),
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const activeBitIndex = Math.floor(Math.max(0, frame - 320) / 10) % BIT_STREAM.length;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      <Audio
        from={VO_OFFSET}
        src={staticFile("audio/voyager-1/vo/vo-scene4.mp3")}
      />
      <Audio
        from={104}
        src={staticFile("audio/sfx/mouse-click.wav")}
        volume={0.3}
      />
      <Audio
        from={158}
        src={staticFile("audio/sfx/ding.wav")}
        volume={0.28}
      />
      <Audio
        from={255}
        src={staticFile("audio/sfx/switch.wav")}
        volume={0.28}
      />
      <Audio
        from={368}
        src={staticFile("audio/sfx/whoosh.wav")}
        volume={0.22}
      />

      {/* Ambient radial lighting */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 42%, rgba(245, 158, 11, 0.09) 0%, rgba(56, 189, 248, 0.05) 45%, transparent 74%)",
        }}
      />

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
            04
          </div>

          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 20,
              letterSpacing: "0.14em",
              color: COLORS.accentAmber,
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            04 · DAYA MINI, SINYAL SUPER TIPIS
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
            Cuma{" "}
            <span
              style={{
                fontFamily: FONTS.serif,
                fontStyle: "italic",
                fontWeight: 400,
                color: COLORS.accentAmber,
              }}
            >
              20 Watt!
            </span>
          </div>
          <div
            style={{
              marginTop: 10,
              fontFamily: FONTS.sans,
              fontSize: 27,
              color: COLORS.textSecondary,
            }}
          >
            Setara lampu kulkas, menembus 24 miliar km
          </div>
        </div>

        {/* Center Comparison & Bitrate Modules */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
            marginTop: "auto",
            marginBottom: "auto",
          }}
        >
          {/* Module 1: 20W Voyager vs 20W Fridge Light Bulb */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              alignItems: "center",
              gap: 14,
            }}
          >
            {/* Voyager Transmitter Card */}
            <div
              style={{
                backgroundColor: "rgba(20, 22, 30, 0.92)",
                border: "1px solid rgba(56, 189, 248, 0.35)",
                borderRadius: 24,
                padding: "24px 20px",
                textAlign: "center",
              }}
            >
              <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                style={{ margin: "0 auto 12px", display: "block" }}
              >
                <path
                  d="M14 40 C22 22, 42 22, 50 40 Z"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="3"
                />
                <line
                  x1="32"
                  y1="26"
                  x2="32"
                  y2="14"
                  stroke="#F5F5F7"
                  strokeWidth="2.5"
                />
                <circle cx="32" cy="14" r="4" fill="#38BDF8" />
                <path
                  d="M22 10 Q32 2 42 10"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="2"
                  opacity="0.7"
                />
              </svg>
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 38,
                  fontWeight: 800,
                  color: COLORS.signalCyan,
                }}
              >
                20 W
              </div>
              <div
                style={{
                  marginTop: 6,
                  fontFamily: FONTS.sans,
                  fontSize: 21,
                  fontWeight: 600,
                  color: COLORS.textPrimary,
                }}
              >
                Pemancar Voyager
              </div>
            </div>

            {/* Equals Badge */}
            <div
              style={{
                opacity: equalsSpring,
                scale: `${equalsSpring}`,
                width: 48,
                height: 48,
                borderRadius: 999,
                backgroundColor: COLORS.accentAmber,
                color: "#0B0B0D",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONTS.mono,
                fontSize: 28,
                fontWeight: 900,
              }}
            >
              =
            </div>

            {/* Fridge Bulb Card */}
            <div
              style={{
                backgroundColor: "rgba(20, 22, 30, 0.92)",
                border: `1px solid ${
                  bulbGlowSpring > 0.2
                    ? "rgba(245, 158, 11, 0.55)"
                    : "rgba(255, 255, 255, 0.14)"
                }`,
                borderRadius: 24,
                padding: "24px 20px",
                textAlign: "center",
                boxShadow:
                  bulbGlowSpring > 0.2
                    ? "0 0 36px rgba(245, 158, 11, 0.16)"
                    : "none",
              }}
            >
              <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                style={{ margin: "0 auto 12px", display: "block" }}
              >
                <circle
                  cx="32"
                  cy="26"
                  r="14"
                  fill={bulbGlowSpring > 0.2 ? "#F59E0B" : "#334155"}
                  opacity={0.25 + bulbGlowSpring * 0.65}
                />
                <path
                  d="M22 28 C22 18, 42 18, 42 28 C42 35, 37 37, 37 42 L27 42 C27 37, 22 35, 22 28 Z"
                  fill="none"
                  stroke={bulbGlowSpring > 0.2 ? "#FBBF24" : "#94A3B8"}
                  strokeWidth="3"
                />
                <rect x="27" y="45" width="10" height="6" rx="2" fill="#94A3B8" />
              </svg>
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 38,
                  fontWeight: 800,
                  color: COLORS.accentAmber,
                }}
              >
                20 W
              </div>
              <div
                style={{
                  marginTop: 6,
                  fontFamily: FONTS.sans,
                  fontSize: 21,
                  fontWeight: 600,
                  color: COLORS.textPrimary,
                }}
              >
                Lampu Kulkas
              </div>
            </div>
          </div>

          {/* Module 2: Signal Attenuation at Earth */}
          <div
            style={{
              opacity: weakCardSpring,
              translate: `0px ${interpolate(
                weakCardSpring,
                [0, 1],
                [24, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              )}px`,
              backgroundColor: "rgba(18, 20, 28, 0.9)",
              border: "1px solid rgba(255, 255, 255, 0.14)",
              borderRadius: 24,
              padding: "22px 26px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 17,
                  color: COLORS.textSecondary,
                  letterSpacing: "0.08em",
                }}
              >
                KEKUATAN SINYAL SAAT NYAMPE BUMI
              </span>
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 18,
                  fontWeight: 700,
                  color: COLORS.accentOrange,
                }}
              >
                SUPER LEMAH
              </span>
            </div>
            <div
              style={{
                height: 12,
                borderRadius: 999,
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${signalDecay * 100}%`,
                  height: "100%",
                  borderRadius: 999,
                  backgroundColor:
                    signalDecay > 0.3 ? COLORS.signalCyan : COLORS.accentOrange,
                }}
              />
            </div>
            <div
              style={{
                marginTop: 10,
                fontFamily: FONTS.mono,
                fontSize: 20,
                color: COLORS.textSecondary,
              }}
            >
              ~0,0000000000000001 Watt tertangkap piringan 70m
            </div>
          </div>

          {/* Module 3: 160 bps vs Home Wi-Fi Comparison */}
          <div
            style={{
              opacity: bitrateCardSpring,
              translate: `0px ${interpolate(
                bitrateCardSpring,
                [0, 1],
                [26, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              )}px`,
              backgroundColor: "rgba(18, 20, 28, 0.94)",
              border: "1px solid rgba(52, 211, 153, 0.32)",
              borderRadius: 24,
              padding: "24px 26px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 14,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 16,
                    color: COLORS.signalMint,
                    letterSpacing: "0.1em",
                  }}
                >
                  KECEPATAN KIRIM DATA VOYAGER 1
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontFamily: FONTS.mono,
                    fontSize: 42,
                    fontWeight: 800,
                    color: COLORS.textPrimary,
                  }}
                >
                  ~160 bit / detik
                </div>
              </div>
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 17,
                  color: COLORS.textSecondary,
                }}
              >
                ANTI ERROR ✓
              </div>
            </div>

            {/* Individual slow bit stream pills */}
            <div style={{ display: "flex", gap: 8 }}>
              {BIT_STREAM.map((bit, idx) => {
                const isActive = idx === activeBitIndex;
                return (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      height: 38,
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: FONTS.mono,
                      fontSize: 20,
                      fontWeight: 700,
                      backgroundColor: isActive
                        ? COLORS.signalMint
                        : "rgba(255, 255, 255, 0.06)",
                      color: isActive ? "#0B0B0D" : COLORS.textSecondary,
                      border: isActive
                        ? `1px solid ${COLORS.signalMint}`
                        : "1px solid rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    {bit}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </SafeArea>

      <WordCaptions
        words={VOYAGER_AUDIO_DATA["vo-scene4"].words}
        voOffset={VO_OFFSET}
        accentColor={COLORS.accentAmber}
        bottom={82}
      />

      <FilmGrain opacity={0.055} />
    </AbsoluteFill>
  );
};
