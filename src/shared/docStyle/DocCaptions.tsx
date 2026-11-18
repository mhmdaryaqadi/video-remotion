import React, { useMemo } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { DOC_COLORS, FONTS } from "./docTheme";
import type { CaptionWord } from "../components/WordCaptions";

type CaptionPhrase = {
  readonly words: readonly CaptionWord[];
  readonly startFrame: number;
  readonly endFrame: number;
};

type DocCaptionsProps = {
  readonly words: readonly CaptionWord[];
  readonly voOffset?: number;
  readonly highlightColor?: string;
  readonly bottom?: number;
  readonly maxWordsPerPhrase?: number;
};

const groupWordsIntoPhrases = (
  words: readonly CaptionWord[],
  maxWordsPerPhrase: number,
): CaptionPhrase[] => {
  if (words.length === 0) return [];

  const rawGroups: CaptionWord[][] = [];
  let current: CaptionWord[] = [];

  for (const word of words) {
    if (current.length > 0) {
      const prev = current[current.length - 1];
      const pauseGap = word.startFrame - prev.endFrame;
      const endsClause = /[.,?!:]$/.test(prev.text);

      if (
        current.length >= maxWordsPerPhrase ||
        pauseGap > 9 ||
        endsClause
      ) {
        rawGroups.push(current);
        current = [];
      }
    }
    current.push(word);
  }
  if (current.length > 0) {
    rawGroups.push(current);
  }

  return rawGroups.map((group, idx) => {
    const first = group[0];
    const last = group[group.length - 1];
    const nextGroup = rawGroups[idx + 1];
    const nextStart = nextGroup
      ? nextGroup[0].startFrame - 2
      : last.endFrame + 16;
    const endFrame = Math.min(last.endFrame + 12, nextStart);

    return {
      words: group,
      startFrame: Math.max(0, first.startFrame - 2),
      endFrame: Math.max(last.endFrame, endFrame),
    };
  });
};

/**
 * "@ngulikin"-style documentary captions:
 * Crisp bold white text with dark ink outline over any background,
 * with the active spoken word highlighted inside a solid vermilion-orange pill.
 */
export const DocCaptions: React.FC<DocCaptionsProps> = ({
  words,
  voOffset = 0,
  highlightColor = DOC_COLORS.highlightOrange,
  bottom = 290,
  maxWordsPerPhrase = 3,
}) => {
  const frame = useCurrentFrame();

  const phrases = useMemo(
    () => groupWordsIntoPhrases(words, maxWordsPerPhrase),
    [words, maxWordsPerPhrase],
  );

  const localFrame = frame - voOffset;
  const activePhrase = phrases.find(
    (phrase) => localFrame >= phrase.startFrame && localFrame <= phrase.endFrame,
  );

  if (!activePhrase) {
    return null;
  }

  const enter = interpolate(
    localFrame,
    [activePhrase.startFrame, activePhrase.startFrame + 4],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );
  const exit = interpolate(
    localFrame,
    [activePhrase.endFrame - 2, activePhrase.endFrame],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const opacity = Math.min(enter, exit);
  const scale = interpolate(enter, [0, 1], [0.95, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom,
        display: "flex",
        justifyContent: "center",
        paddingLeft: 70,
        paddingRight: 70,
        pointerEvents: "none",
        zIndex: 45,
        opacity,
        scale: `${scale}`,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px 12px",
          textAlign: "center",
        }}
      >
        {activePhrase.words.map((word, idx) => {
          const isCurrent =
            localFrame >= word.startFrame && localFrame <= word.endFrame;

          const wordScale = isCurrent
            ? interpolate(
                localFrame,
                [word.startFrame, word.startFrame + 3],
                [0.98, 1.05],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              )
            : 1;

          return (
            <span
              key={`${word.startFrame}-${idx}`}
              style={{
                fontFamily: FONTS.sans,
                fontSize: 44,
                lineHeight: 1.18,
                fontWeight: 800,
                letterSpacing: "-0.025em",
                color: "#FFFFFF",
                padding: isCurrent ? "3px 14px 5px" : "3px 2px 5px",
                borderRadius: 10,
                backgroundColor: isCurrent ? highlightColor : "transparent",
                boxShadow: isCurrent
                  ? "0 6px 18px rgba(0, 0, 0, 0.28)"
                  : "none",
                textShadow: isCurrent
                  ? "0 2px 4px rgba(0, 0, 0, 0.35)"
                  : "-2px -2px 0 #1A1D24, 2px -2px 0 #1A1D24, -2px 2px 0 #1A1D24, 2px 2px 0 #1A1D24, 0 4px 10px rgba(0, 0, 0, 0.55)",
                display: "inline-block",
                scale: `${wordScale}`,
              }}
            >
              {word.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
