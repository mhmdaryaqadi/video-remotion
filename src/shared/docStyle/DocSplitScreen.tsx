import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { DOC_COLORS, SPRING_CONFIGS } from "./docTheme";

type DocSplitScreenProps = {
  readonly leftContent: React.ReactNode;
  readonly rightContent: React.ReactNode;
  readonly splitRatio?: number;
  readonly enterFrame?: number;
};

/**
 * "@ngulikin"-style vertical jagged paper-tear split screen comparison.
 */
export const DocSplitScreen: React.FC<DocSplitScreenProps> = ({
  leftContent,
  rightContent,
  splitRatio = 0.5,
  enterFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tearSpring = spring({
    frame: Math.max(0, frame - enterFrame),
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const splitX = 1080 * splitRatio;
  const slideOffset = interpolate(tearSpring, [0, 1], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Deterministic paper-tear zigzag path along vertical seam
  const seamPoints = useMemo(() => {
    const pts: Array<[number, number]> = [];
    const steps = 48;
    for (let i = 0; i <= steps; i++) {
      const y = (i / steps) * 1920;
      const jitter = Math.sin(i * 2.7) * 11 + Math.cos(i * 4.3) * 6;
      pts.push([splitX + jitter, y]);
    }
    return pts;
  }, [splitX]);

  const leftPolygon = useMemo(() => {
    const edge = seamPoints.map(([x, y]) => `${x}px ${y}px`).join(", ");
    return `polygon(0px 0px, ${edge}, 0px 1920px)`;
  }, [seamPoints]);

  const rightPolygon = useMemo(() => {
    const edge = seamPoints.map(([x, y]) => `${x}px ${y}px`).join(", ");
    return `polygon(1080px 0px, ${edge}, 1080px 1920px)`;
  }, [seamPoints]);

  const seamPolyline = useMemo(
    () => seamPoints.map(([x, y]) => `${x},${y}`).join(" "),
    [seamPoints],
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ clipPath: leftPolygon, translate: `-${slideOffset}px 0px` }}>
        {leftContent}
      </AbsoluteFill>
      <AbsoluteFill style={{ clipPath: rightPolygon, translate: `${slideOffset}px 0px` }}>
        {rightContent}
      </AbsoluteFill>
      {/* Crisp torn paper edge border */}
      <svg
        width="1080"
        height="1920"
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 15 }}
      >
        <polyline
          points={seamPolyline}
          fill="none"
          stroke="#FAF8F2"
          strokeWidth={10}
          strokeLinejoin="round"
        />
        <polyline
          points={seamPolyline}
          fill="none"
          stroke={DOC_COLORS.ink}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
      </svg>
    </AbsoluteFill>
  );
};
