import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

type GridBackgroundProps = {
  glowColor?: string;
  secondaryGlowColor?: string;
  gridSize?: number;
};

/**
 * Dark-mode technical grid background with deterministic frame-driven drift and radial glow.
 */
export const GridBackground: React.FC<GridBackgroundProps> = ({
  glowColor = COLORS.accentIndigo,
  secondaryGlowColor = COLORS.accentCyan,
  gridSize = 64,
}) => {
  const frame = useCurrentFrame();

  const offsetY = (frame * 0.7) % gridSize;
  const offsetX = (frame * 0.35) % gridSize;

  const primaryPulse = interpolate(
    Math.sin(frame * 0.045),
    [-1, 1],
    [0.2, 0.34],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const secondaryPulse = interpolate(
    Math.cos(frame * 0.035),
    [-1, 1],
    [0.12, 0.24],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const orbShiftY = Math.sin(frame * 0.025) * 40;
  const orbShiftX = Math.cos(frame * 0.02) * 35;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      {/* Subtle drifting grid */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.045) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.045) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
          backgroundPosition: `${offsetX}px ${offsetY}px`,
        }}
      />

      {/* Primary radial glow */}
      <div
        style={{
          position: "absolute",
          top: 220 + orbShiftY,
          left: "50%",
          width: 960,
          height: 960,
          marginLeft: -480 + orbShiftX,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 68%)`,
          opacity: primaryPulse,
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* Secondary lower glow */}
      <div
        style={{
          position: "absolute",
          bottom: 140 - orbShiftY * 0.6,
          left: "50%",
          width: 820,
          height: 820,
          marginLeft: -410 - orbShiftX * 0.8,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${secondaryGlowColor} 0%, transparent 70%)`,
          opacity: secondaryPulse,
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      {/* Edge vignette for crisp foreground contrast */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(9, 9, 11, 0.82) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
