import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { DOC_COLORS, FONTS, SPRING_CONFIGS } from "./docTheme";

type DocCalloutProps = {
  readonly title: string;
  readonly subtitle?: string;
  readonly source?: string;
  readonly x: number;
  readonly y: number;
  readonly targetX?: number;
  readonly targetY?: number;
  readonly enterFrame?: number;
  readonly exitFrame?: number;
  readonly accentColor?: string;
  readonly badgeText?: string;
  readonly maxWidth?: number;
};

/**
 * "@ngulikin"-style paper info card with hairline connector pin & source attribution.
 */
export const DocCallout: React.FC<DocCalloutProps> = ({
  title,
  subtitle,
  source,
  x,
  y,
  targetX,
  targetY,
  enterFrame = 0,
  exitFrame,
  accentColor = DOC_COLORS.highlightOrange,
  badgeText,
  maxWidth = 460,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < enterFrame) return null;

  const enter = spring({
    frame: Math.max(0, frame - enterFrame),
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const exitOpacity =
    exitFrame !== undefined
      ? interpolate(frame, [exitFrame - 6, exitFrame], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  const opacity = Math.min(enter, exitOpacity);
  if (opacity <= 0.01) return null;

  const cardYOffset = interpolate(enter, [0, 1], [14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const hasConnector = targetX !== undefined && targetY !== undefined;
  const anchorX = x + 36;
  const anchorY = y + 48;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 25,
        opacity,
      }}
    >
      {/* Thin dark hairline connector + target pin circle */}
      {hasConnector && (
        <svg
          width="1080"
          height="1920"
          viewBox="0 0 1080 1920"
          style={{ position: "absolute", inset: 0 }}
        >
          <line
            x1={anchorX}
            y1={anchorY}
            x2={targetX}
            y2={targetY}
            stroke={DOC_COLORS.ink}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          <circle
            cx={targetX}
            cy={targetY}
            r={9}
            fill={DOC_COLORS.paperCard}
            stroke={DOC_COLORS.ink}
            strokeWidth={3}
          />
          <circle cx={targetX} cy={targetY} r={4} fill={accentColor} />
        </svg>
      )}

      {/* White paper documentary tag */}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          maxWidth,
          translate: `0px ${cardYOffset}px`,
          backgroundColor: DOC_COLORS.paperCard,
          border: `2px solid ${DOC_COLORS.ink}`,
          borderRadius: 12,
          padding: "14px 20px",
          boxShadow: `0 10px 28px ${DOC_COLORS.paperShadow}`,
        }}
      >
        {badgeText && (
          <div
            style={{
              display: "inline-block",
              marginBottom: 6,
              padding: "3px 10px",
              borderRadius: 6,
              backgroundColor: accentColor,
              color: "#FFFFFF",
              fontFamily: FONTS.mono,
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {badgeText}
          </div>
        )}
        <div
          style={{
            fontFamily: FONTS.sans,
            fontSize: 27,
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            color: DOC_COLORS.ink,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              marginTop: 5,
              fontFamily: FONTS.sans,
              fontSize: 20,
              fontWeight: 500,
              lineHeight: 1.3,
              color: DOC_COLORS.inkMuted,
            }}
          >
            {subtitle}
          </div>
        )}
        {source && (
          <div
            style={{
              marginTop: 8,
              paddingTop: 6,
              borderTop: "1px solid rgba(26, 29, 36, 0.14)",
              fontFamily: FONTS.mono,
              fontSize: 15,
              color: DOC_COLORS.inkMuted,
            }}
          >
            sumber: {source}
          </div>
        )}
      </div>
    </div>
  );
};
