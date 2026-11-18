import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONTS, SPRING_CONFIGS } from "../theme";

type AnimatedTextProps = {
  text: string;
  delay?: number;
  mode?: "slide-up" | "scale-pop" | "word-stagger";
  staggerFrames?: number;
  font?: "sans" | "mono";
  color?: string;
  fontSize?: number;
  fontWeight?: number;
  lineHeight?: number;
  letterSpacing?: string;
  textAlign?: "left" | "center" | "right";
  highlightWord?: string;
  highlightColor?: string;
  style?: React.CSSProperties;
};

/**
 * Frame-deterministic kinetic typography component using spring() and interpolate().
 */
export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  delay = 0,
  mode = "slide-up",
  staggerFrames = 4,
  font = "sans",
  color = COLORS.textPrimary,
  fontSize = 72,
  fontWeight = 800,
  lineHeight = 1.08,
  letterSpacing = "-0.03em",
  textAlign = "left",
  highlightWord,
  highlightColor = COLORS.accentCyan,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const baseStyle: React.CSSProperties = {
    fontFamily: font === "mono" ? FONTS.mono : FONTS.sans,
    color,
    fontSize,
    fontWeight,
    lineHeight,
    letterSpacing,
    textAlign,
    margin: 0,
    ...style,
  };

  if (mode === "word-stagger") {
    const words = text.split(" ");
    const justifyContent =
      textAlign === "center"
        ? "center"
        : textAlign === "right"
          ? "flex-end"
          : "flex-start";

    return (
      <div
        style={{
          ...baseStyle,
          display: "flex",
          flexWrap: "wrap",
          columnGap: Math.round(fontSize * 0.24),
          rowGap: Math.round(fontSize * 0.08),
          justifyContent,
        }}
      >
        {words.map((word, index) => {
          const wordFrame = Math.max(0, frame - (delay + index * staggerFrames));
          const progress = spring({
            frame: wordFrame,
            fps,
            config: SPRING_CONFIGS.snappy,
          });
          const opacity = interpolate(wordFrame, [0, 7], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const translateY = interpolate(progress, [0, 1], [34, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const scale = interpolate(progress, [0, 1], [0.92, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const isHighlighted =
            highlightWord !== undefined &&
            word.toLowerCase().includes(highlightWord.toLowerCase());

          return (
            <span
              key={`${word}-${index}`}
              style={{
                display: "inline-block",
                opacity,
                color: isHighlighted ? highlightColor : color,
                transform: `translateY(${translateY}px) scale(${scale})`,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    );
  }

  const localFrame = Math.max(0, frame - delay);
  const progress = spring({
    frame: localFrame,
    fps,
    config:
      mode === "scale-pop" ? SPRING_CONFIGS.bouncy : SPRING_CONFIGS.snappy,
  });

  const opacity = interpolate(localFrame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const translateY =
    mode === "slide-up"
      ? interpolate(progress, [0, 1], [42, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  const scale =
    mode === "scale-pop"
      ? interpolate(progress, [0, 1], [0.78, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : interpolate(progress, [0, 1], [0.96, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  return (
    <div
      style={{
        ...baseStyle,
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
      }}
    >
      {text}
    </div>
  );
};
