import React from "react";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { DocCaptions, DocSplitScreen } from "../../../shared/docStyle";
import { PEARL_HARBOR_AUDIO_DATA } from "../subtitles";
import { FONTS, PEARL_HARBOR_TIMING, PH_COLORS, SPRING_CONFIGS } from "../theme";

const VO_OFFSET = PEARL_HARBOR_TIMING.scene8VoOffset;

const CarrierIconSvg: React.FC = () => (
  <svg width="110" height="44" viewBox="0 0 110 44">
    <path
      d="M8 22 L92 22 L104 34 L14 34 Z"
      fill="#64748B"
      stroke={PH_COLORS.ink}
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <rect
      x="12"
      y="14"
      width="86"
      height="9"
      rx="2"
      fill="#B89058"
      stroke={PH_COLORS.ink}
      strokeWidth="2.5"
    />
    <rect
      x="60"
      y="4"
      width="16"
      height="11"
      rx="2"
      fill="#475569"
      stroke={PH_COLORS.ink}
      strokeWidth="2.2"
    />
  </svg>
);

const OilTankSvg: React.FC<{ readonly label?: string }> = ({ label }) => (
  <svg width="108" height="104" viewBox="0 0 108 104">
    <ellipse
      cx="54"
      cy="84"
      rx="40"
      ry="11"
      fill="#D97706"
      stroke={PH_COLORS.ink}
      strokeWidth="2.5"
    />
    <rect
      x="14"
      y="26"
      width="80"
      height="58"
      fill="#F59E0B"
      stroke={PH_COLORS.ink}
      strokeWidth="2.5"
    />
    <ellipse
      cx="54"
      cy="26"
      rx="40"
      ry="11"
      fill="#FBBF24"
      stroke={PH_COLORS.ink}
      strokeWidth="2.5"
    />
    {label && (
      <text
        x="54"
        y="60"
        textAnchor="middle"
        fill={PH_COLORS.ink}
        fontFamily={FONTS.mono}
        fontSize="13"
        fontWeight="800"
      >
        {label}
      </text>
    )}
  </svg>
);

export const Scene8MissedTargets: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerEnter = spring({
    frame: Math.max(0, frame - 4),
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  // Left half: Empty Carrier Berths highlight when "Tiga kapal induk..." starts (~f94)
  const leftFocus = spring({
    frame: Math.max(0, frame - 94),
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const carrierSailX = interpolate(frame, [92, 215], [0, 34], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const zeroStamp = spring({
    frame: Math.max(0, frame - 135),
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  // Right half: Oil Tanks + Drydock Crane highlight when "ditambah tangki minyak..." starts (~f202)
  const rightFocus = spring({
    frame: Math.max(0, frame - 202),
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const craneSwing = Math.sin(frame * 0.08) * 3;
  const intactStamp = spring({
    frame: Math.max(0, frame - 246),
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  // Opening "CELAH FATAL" center pill (f10..94)
  const fatalPillOpacity = interpolate(frame, [10, 20, 82, 94], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const carriers = ["USS ENTERPRISE", "USS LEXINGTON", "USS SARATOGA"] as const;

  const leftContent = (
    <AbsoluteFill style={{ backgroundColor: "#DFECF5" }}>
      <div
        style={{
          position: "absolute",
          top: 215,
          left: 36,
          width: 470,
          display: "flex",
          flexDirection: "column",
          gap: 18,
          opacity: 0.45 + 0.55 * leftFocus,
          transform: `scale(${0.96 + 0.04 * leftFocus})`,
        }}
      >
        {/* Left Panel Title Pill */}
        <div
          style={{
            backgroundColor: PH_COLORS.paperCard,
            border: `2.5px solid ${PH_COLORS.ink}`,
            borderRadius: 14,
            padding: "14px 18px",
            boxShadow: "4px 4px 0px #1A1D24",
          }}
        >
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 18,
              fontWeight: 800,
              color: PH_COLORS.oceanBlue,
              letterSpacing: "0.06em",
              marginBottom: 4,
            }}
          >
            DERMAGA KAPAL INDUK
          </div>
          <div
            style={{
              fontFamily: FONTS.sans,
              fontSize: 30,
              fontWeight: 900,
              color: PH_COLORS.ink,
              lineHeight: 1.15,
            }}
          >
            3 Kapal Induk AS Kosong
          </div>
        </div>

        {/* 3 Dashed Empty Berths + Sailing Away Silhouettes */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 10 }}>
          {carriers.map((name, idx) => (
            <div
              key={name}
              style={{
                backgroundColor: "rgba(255,255,255,0.6)",
                border: `2.5px dashed ${PH_COLORS.oceanDeep}`,
                borderRadius: 14,
                padding: "14px 16px",
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
                    fontWeight: 800,
                    color: PH_COLORS.ink,
                  }}
                >
                  {name}
                </div>
                <div
                  style={{
                    fontFamily: FONTS.sans,
                    fontSize: 18,
                    fontWeight: 700,
                    color: PH_COLORS.oceanBlue,
                    marginTop: 2,
                  }}
                >
                  Di laut lepas →
                </div>
              </div>
              <div
                style={{
                  transform: `translateX(${carrierSailX * (0.85 + idx * 0.12)}px)`,
                }}
              >
                <CarrierIconSvg />
              </div>
            </div>
          ))}
        </div>

        {/* Big Stamp: 0 HANCUR */}
        {frame >= 135 && (
          <div
            style={{
              alignSelf: "center",
              marginTop: 14,
              transform: `scale(${zeroStamp}) rotate(-4deg)`,
              backgroundColor: "#16A34A",
              color: "#FFFFFF",
              border: `3px solid ${PH_COLORS.ink}`,
              borderRadius: 14,
              padding: "12px 24px",
              fontFamily: FONTS.sans,
              fontSize: 28,
              fontWeight: 900,
              boxShadow: "5px 5px 0px #1A1D24",
            }}
          >
            0 KAPAL INDUK HANCUR
          </div>
        )}

        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 16,
            color: PH_COLORS.inkMuted,
            textAlign: "center",
            marginTop: 6,
          }}
        >
          sumber: Naval History &amp; Heritage Command
        </div>
      </div>
    </AbsoluteFill>
  );

  const rightContent = (
    <AbsoluteFill style={{ backgroundColor: "#F4EDE0" }}>
      <div
        style={{
          position: "absolute",
          top: 215,
          left: 574,
          width: 470,
          display: "flex",
          flexDirection: "column",
          gap: 18,
          opacity: 0.45 + 0.55 * rightFocus,
          transform: `scale(${0.96 + 0.04 * rightFocus})`,
        }}
      >
        {/* Right Panel Title Pill */}
        <div
          style={{
            backgroundColor: PH_COLORS.paperCard,
            border: `2.5px solid ${PH_COLORS.ink}`,
            borderRadius: 14,
            padding: "14px 18px",
            boxShadow: "4px 4px 0px #1A1D24",
          }}
        >
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 18,
              fontWeight: 800,
              color: PH_COLORS.highlightOrange,
              letterSpacing: "0.06em",
              marginBottom: 4,
            }}
          >
            INFRASTRUKTUR VITAL
          </div>
          <div
            style={{
              fontFamily: FONTS.sans,
              fontSize: 30,
              fontWeight: 900,
              color: PH_COLORS.ink,
              lineHeight: 1.15,
            }}
          >
            Tangki Minyak &amp; Galangan
          </div>
        </div>

        {/* Intact Fuel Oil Tanks Cluster + Repair Crane */}
        <div
          style={{
            backgroundColor: PH_COLORS.paperCard,
            border: `2.5px solid ${PH_COLORS.ink}`,
            borderRadius: 16,
            padding: "20px 18px",
            boxShadow: "4px 4px 0px #1A1D24",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <OilTankSvg label="FUEL" />
            <OilTankSvg label="FUEL" />
            <OilTankSvg label="OIL" />
          </div>

          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 20,
              fontWeight: 800,
              color: PH_COLORS.ink,
              backgroundColor: "#FEF3C7",
              border: `2px solid ${PH_COLORS.ink}`,
              borderRadius: 8,
              padding: "6px 14px",
            }}
          >
            4,5 JUTA BAREL BBM UTUH
          </div>

          {/* Repair Drydock Crane Illustration */}
          <svg
            width="360"
            height="140"
            viewBox="0 0 360 140"
            style={{ marginTop: 4 }}
          >
            {/* Concrete dock floor */}
            <rect
              x="16"
              y="110"
              width="328"
              height="20"
              rx="4"
              fill="#94A3B8"
              stroke={PH_COLORS.ink}
              strokeWidth="2.5"
            />
            {/* Crane tower */}
            <rect
              x="72"
              y="38"
              width="24"
              height="72"
              fill="#475569"
              stroke={PH_COLORS.ink}
              strokeWidth="2.5"
            />
            {/* Animated crane boom */}
            <g transform={`rotate(${craneSwing} 84 44)`}>
              <polygon
                points="68,40 270,18 274,30 74,52"
                fill="#E84D28"
                stroke={PH_COLORS.ink}
                strokeWidth="2.5"
              />
              <line
                x1="248"
                y1="28"
                x2="248"
                y2="78"
                stroke={PH_COLORS.ink}
                strokeWidth="2.5"
              />
              <rect
                x="232"
                y="76"
                width="32"
                height="20"
                rx="3"
                fill="#D97706"
                stroke={PH_COLORS.ink}
                strokeWidth="2.2"
              />
            </g>
            {/* Drydock Ship Repair Label */}
            <text
              x="195"
              y="124"
              textAnchor="middle"
              fill="#FFFFFF"
              fontFamily={FONTS.mono}
              fontSize="13"
              fontWeight="800"
            >
              GALANGAN PERBAIKAN SIAP PAKAI
            </text>
          </svg>
        </div>

        {/* Big Stamp: LUPUT DIHANCURKAN */}
        {frame >= 246 && (
          <div
            style={{
              alignSelf: "center",
              marginTop: 6,
              transform: `scale(${intactStamp}) rotate(3deg)`,
              backgroundColor: PH_COLORS.highlightOrange,
              color: "#FFFFFF",
              border: `3px solid ${PH_COLORS.ink}`,
              borderRadius: 14,
              padding: "12px 24px",
              fontFamily: FONTS.sans,
              fontSize: 28,
              fontWeight: 900,
              boxShadow: "5px 5px 0px #1A1D24",
            }}
          >
            LUPUT DIHANCURKAN!
          </div>
        )}

        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 16,
            color: PH_COLORS.inkMuted,
            textAlign: "center",
          }}
        >
          sumber: Pearl Harbor Naval Shipyard
        </div>
      </div>
    </AbsoluteFill>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: PH_COLORS.paper }}>
      <Sequence from={VO_OFFSET}>
        <Audio src={staticFile("audio/pearl-harbor/vo/vo-scene8.mp3")} volume={1} />
      </Sequence>

      <Sequence from={94} durationInFrames={45}>
        <Audio src={staticFile("audio/pearl-harbor/sfx/typewriter.wav")} volume={0.28} />
      </Sequence>
      <Sequence from={202} durationInFrames={45}>
        <Audio src={staticFile("audio/pearl-harbor/sfx/typewriter.wav")} volume={0.28} />
      </Sequence>

      {/* Torn Paper Jagged Split Screen */}
      <DocSplitScreen
        leftContent={leftContent}
        rightContent={rightContent}
        splitRatio={0.5}
        enterFrame={0}
      />

      {/* Top Chapter Tag */}
      <div
        style={{
          position: "absolute",
          top: 86,
          left: 56,
          zIndex: 25,
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
          CELAH FATAL SERANGAN JEPANG
        </span>
      </div>

      {/* Opening Dramatic Center Pill over the Seam */}
      {fatalPillOpacity > 0.01 && (
        <div
          style={{
            position: "absolute",
            top: 820,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            zIndex: 30,
            opacity: fatalPillOpacity,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              backgroundColor: PH_COLORS.alertRed,
              color: "#FFFFFF",
              border: `3.5px solid ${PH_COLORS.ink}`,
              borderRadius: 18,
              padding: "18px 34px",
              fontFamily: FONTS.sans,
              fontSize: 44,
              fontWeight: 900,
              letterSpacing: "0.03em",
              boxShadow: "7px 7px 0px #1A1D24",
            }}
          >
            1 CELAH FATAL
          </div>
        </div>
      )}

      <DocCaptions
        words={PEARL_HARBOR_AUDIO_DATA["vo-scene8"].words}
        voOffset={VO_OFFSET}
        highlightColor={PH_COLORS.highlightOrange}
        bottom={290}
      />
    </AbsoluteFill>
  );
};
