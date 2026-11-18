import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONTS, SAFE_ZONE } from "../theme";

type ProgressBarProps = {
  labels?: readonly string[];
  accentColor?: string;
};

/**
 * Bottom safe-zone progress indicator synchronized with the composition frame count.
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  labels = ["01 HOOK", "02 ENGINE 3D", "03 INFO GAP"],
  accentColor = COLORS.accentCyan,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const progressRatio = interpolate(
    frame,
    [0, Math.max(1, durationInFrames - 1)],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const activeStep = Math.min(
    labels.length - 1,
    Math.floor(progressRatio * labels.length),
  );

  const currentSec = (frame / fps).toFixed(1);
  const totalSec = (durationInFrames / fps).toFixed(0);

  return (
    <div
      style={{
        position: "absolute",
        left: SAFE_ZONE.paddingHorizontal,
        right: SAFE_ZONE.paddingHorizontal,
        bottom: 92,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: FONTS.mono,
          fontSize: 22,
          letterSpacing: "0.06em",
        }}
      >
        <div style={{ display: "flex", gap: 20 }}>
          {labels.map((label, idx) => {
            const isActive = idx === activeStep;
            return (
              <span
                key={label}
                style={{
                  color: isActive ? COLORS.textPrimary : COLORS.textMuted,
                  fontWeight: isActive ? 700 : 400,
                }}
              >
                {label}
              </span>
            );
          })}
        </div>
        <span style={{ color: COLORS.textSecondary, fontWeight: 500 }}>
          {currentSec}s / {totalSec}s
        </span>
      </div>

      {/* Track */}
      <div
        style={{
          width: "100%",
          height: 6,
          borderRadius: 999,
          backgroundColor: "rgba(255, 255, 255, 0.12)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progressRatio * 100}%`,
            height: "100%",
            borderRadius: 999,
            background: `linear-gradient(90deg, ${COLORS.accentIndigo}, ${accentColor})`,
          }}
        />
      </div>
    </div>
  );
};
