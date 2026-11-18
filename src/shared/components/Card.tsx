import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, SPRING_CONFIGS } from "../theme";

type CardProps = {
  children: React.ReactNode;
  delay?: number;
  accentColor?: string;
  padding?: number;
  borderRadius?: number;
  style?: React.CSSProperties;
};

/**
 * Reusable dark-glass UI card with deterministic spring entrance.
 */
export const Card: React.FC<CardProps> = ({
  children,
  delay = 0,
  accentColor,
  padding = 32,
  borderRadius = 28,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(0, frame - delay);
  const progress = spring({
    frame: localFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const opacity = interpolate(localFrame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(progress, [0, 1], [44, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = interpolate(progress, [0, 1], [0.94, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "relative",
        backgroundColor: COLORS.surface,
        border: `1.5px solid ${accentColor ?? COLORS.border}`,
        borderRadius,
        padding,
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        boxShadow: accentColor
          ? `0 24px 60px rgba(0, 0, 0, 0.55), 0 0 40px ${accentColor}28`
          : "0 24px 60px rgba(0, 0, 0, 0.55)",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Subtle top edge highlight */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 24,
          right: 24,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)",
          pointerEvents: "none",
        }}
      />
      {children}
    </div>
  );
};
