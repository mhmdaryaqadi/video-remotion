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

const VO_OFFSET = VOYAGER_TIMING.scene3VoOffset;

export const Scene3LightSpeed: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.smooth,
  });

  // Beat 1: Speed of light counter "300.000 km/detik" (f64..115)
  const speedBadgeSpring = spring({
    frame: Math.max(0, frame - 66),
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const lightSpeedKms = Math.round(
    interpolate(frame, [66, 108], [0, 300000], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }),
  );

  // Beat 2: 1-Way Uplink travel (Bumi -> Voyager 1, 22.5 jam) across f175..262
  const uplinkProgress = interpolate(frame, [176, 254], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const uplinkHours = interpolate(uplinkProgress, [0, 1], [0, 22.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Beat 3: Return trip Downlink (Voyager -> Bumi, +22.5 jam = 45 jam / Lusa) across f285..382
  const downlinkCardSpring = spring({
    frame: Math.max(0, frame - 284),
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const downlinkProgress = interpolate(frame, [292, 368], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const totalHours = interpolate(downlinkProgress, [0, 1], [22.5, 45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const roundTripBadgeSpring = spring({
    frame: Math.max(0, frame - 356),
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  return (
    <AbsoluteFill
      style={{ backgroundColor: COLORS.paperBg, overflow: "hidden" }}
    >
      {/* Voiceover & crisp editorial SFX */}
      <Audio
        from={VO_OFFSET}
        src={staticFile("audio/voyager-1/vo/vo-scene3.mp3")}
      />
      <Audio
        from={68}
        src={staticFile("audio/sfx/switch.wav")}
        volume={0.28}
      />
      <Audio
        from={178}
        src={staticFile("audio/sfx/whoosh.wav")}
        volume={0.24}
      />
      <Audio
        from={250}
        src={staticFile("audio/sfx/mouse-click.wav")}
        volume={0.3}
      />
      <Audio
        from={362}
        src={staticFile("audio/sfx/ding.wav")}
        volume={0.3}
      />

      {/* Subtle warm editorial paper grid lines */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 80% 18%, rgba(255, 90, 38, 0.08) 0%, transparent 52%)",
        }}
      />

      <SafeArea
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Top Header */}
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
              WebkitTextStroke: "1.5px rgba(17, 17, 19, 0.14)",
              userSelect: "none",
            }}
          >
            03
          </div>

          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 20,
              letterSpacing: "0.14em",
              color: COLORS.accentOrange,
              fontWeight: 700,
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            03 · SECEPAT CAHAYA, TETAP LAMA
          </div>

          <div
            style={{
              fontFamily: FONTS.sans,
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.035em",
              color: COLORS.inkPrimary,
            }}
          >
            Melesat Secepat{" "}
            <span
              style={{
                fontFamily: FONTS.serif,
                fontStyle: "italic",
                fontWeight: 400,
                color: COLORS.accentOrange,
              }}
            >
              Cahaya
            </span>
          </div>

          {/* Speed of Light Pill Counter */}
          <div
            style={{
              marginTop: 22,
              display: "inline-flex",
              alignItems: "center",
              gap: 14,
              padding: "12px 22px",
              borderRadius: 16,
              backgroundColor: "#FFFFFF",
              border: "1px solid rgba(17, 17, 19, 0.12)",
              boxShadow: "0 10px 26px rgba(17, 17, 19, 0.06)",
              opacity: speedBadgeSpring,
              scale: `${interpolate(speedBadgeSpring, [0, 1], [0.92, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}`,
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                backgroundColor: COLORS.accentOrange,
              }}
            />
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 30,
                fontWeight: 700,
                color: COLORS.inkPrimary,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {lightSpeedKms.toLocaleString("id-ID")} km/detik
            </span>
          </div>
        </div>

        {/* Center Editorial Timeline Visualization */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            marginTop: "auto",
            marginBottom: "auto",
          }}
        >
          {/* Leg 1: Uplink Bumi -> Voyager 1 (22,5 jam) */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid rgba(17, 17, 19, 0.12)",
              borderRadius: 28,
              padding: "28px 30px",
              boxShadow: "0 18px 44px rgba(17, 17, 19, 0.07)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 18,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 17,
                    letterSpacing: "0.1em",
                    color: COLORS.inkSecondary,
                  }}
                >
                  PESAN BERANGKAT · HARI INI
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontFamily: FONTS.sans,
                    fontSize: 30,
                    fontWeight: 800,
                    color: COLORS.inkPrimary,
                  }}
                >
                  Bumi ──▶ Voyager 1
                </div>
              </div>
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 32,
                  fontWeight: 800,
                  color: COLORS.accentOrange,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {uplinkHours.toFixed(1).replace(".", ",")} JAM
              </div>
            </div>

            {/* Photon Track */}
            <div
              style={{
                position: "relative",
                height: 16,
                borderRadius: 999,
                backgroundColor: "#ECE8DF",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${uplinkProgress * 100}%`,
                  height: "100%",
                  borderRadius: 999,
                  background:
                    "linear-gradient(90deg, #38BDF8 0%, #FF5A26 100%)",
                }}
              />
            </div>

            <div
              style={{
                marginTop: 12,
                display: "flex",
                justifyContent: "space-between",
                fontFamily: FONTS.mono,
                fontSize: 16,
                color: COLORS.inkSecondary,
              }}
            >
              <span>BUMI · 00:00</span>
              <span>
                {uplinkProgress > 0.96
                  ? "SAMPAI DI VOYAGER ✓"
                  : "SINYAL MELAJU 24 MILIAR KM..."}
              </span>
            </div>
          </div>

          {/* Leg 2: Downlink Reply Voyager -> Bumi (+22,5 jam = 45 jam / Lusa) */}
          <div
            style={{
              opacity: downlinkCardSpring,
              translate: `0px ${interpolate(
                downlinkCardSpring,
                [0, 1],
                [26, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              )}px`,
              backgroundColor: "#14161D",
              border: "1px solid rgba(255, 90, 38, 0.35)",
              borderRadius: 28,
              padding: "28px 30px",
              boxShadow: "0 22px 52px rgba(17, 17, 19, 0.16)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 18,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 17,
                    letterSpacing: "0.1em",
                    color: COLORS.textSecondary,
                  }}
                >
                  BALASAN PULANG · BARU SAMPAI
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontFamily: FONTS.sans,
                    fontSize: 30,
                    fontWeight: 800,
                    color: COLORS.textPrimary,
                  }}
                >
                  Voyager 1 ──▶ Bumi
                </div>
              </div>
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 32,
                  fontWeight: 800,
                  color: COLORS.signalCyan,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {totalHours.toFixed(1).replace(".", ",")} JAM
              </div>
            </div>

            <div
              style={{
                position: "relative",
                height: 16,
                borderRadius: 999,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${downlinkProgress * 100}%`,
                  height: "100%",
                  borderRadius: 999,
                  background:
                    "linear-gradient(90deg, #FF5A26 0%, #34D399 100%)",
                }}
              />
            </div>

            <div
              style={{
                marginTop: 18,
                padding: "14px 18px",
                borderRadius: 16,
                backgroundColor: "rgba(255, 90, 38, 0.14)",
                border: "1px solid rgba(255, 90, 38, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                opacity: roundTripBadgeSpring,
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 23,
                  fontWeight: 700,
                  color: COLORS.textPrimary,
                }}
              >
                Tanya Hari Ini ➔ Jawabannya
              </span>
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 22,
                  fontWeight: 800,
                  color: COLORS.accentOrange,
                }}
              >
                LUSA (~45 JAM)
              </span>
            </div>
          </div>
        </div>
      </SafeArea>

      <WordCaptions
        words={VOYAGER_AUDIO_DATA["vo-scene3"].words}
        voOffset={VO_OFFSET}
        accentColor={COLORS.accentOrange}
        bottom={82}
      />

      <FilmGrain opacity={0.04} />
    </AbsoluteFill>
  );
};
