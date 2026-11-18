import React, { useMemo } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../theme";

export type CaptionWord = {
  readonly text: string;
  readonly startFrame: number;
  readonly endFrame: number;
};

type CaptionPhrase = {
  readonly words: readonly CaptionWord[];
  readonly startFrame: number;
  readonly endFrame: number;
};

type WordCaptionsProps = {
  readonly words: readonly CaptionWord[];
  readonly voOffset?: number;
  readonly accentColor?: string;
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
      const endsClause = /[.,?!]$/.test(prev.text);

      if (
        current.length >= maxWordsPerPhrase ||
        pauseGap > 10 ||
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
      : last.endFrame + 18;
    const endFrame = Math.min(last.endFrame + 14, nextStart);

    return {
      words: group,
      startFrame: Math.max(0, first.startFrame - 2),
      endFrame: Math.max(last.endFrame, endFrame),
    };
  });
};

export const WordCaptions: React.FC<WordCaptionsProps> = ({
  words,
  voOffset = 0,
  accentColor = "#FF5A26",
  bottom = 104,
  maxWordsPerPhrase = 4,
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

  const enterProgress = interpolate(
    localFrame,
    [activePhrase.startFrame, activePhrase.startFrame + 5],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );

  const exitProgress = interpolate(
    localFrame,
    [activePhrase.endFrame - 2, activePhrase.endFrame],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const pillOpacity = Math.min(enterProgress, exitProgress);
  const pillScale = interpolate(enterProgress, [0, 1], [0.94, 1], {
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
        paddingLeft: 48,
        paddingRight: 48,
        pointerEvents: "none",
        zIndex: 40,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "6px 12px",
          padding: "13px 26px",
          borderRadius: 999,
          backgroundColor: "rgba(12, 13, 18, 0.9)",
          border: "1px solid rgba(255, 255, 255, 0.16)",
          boxShadow: "0 14px 36px rgba(0, 0, 0, 0.45)",
          opacity: pillOpacity,
          scale: `${pillScale}`,
        }}
      >
        {activePhrase.words.map((word, idx) => {
          const isCurrent =
            localFrame >= word.startFrame && localFrame <= word.endFrame;
          const isSpoken = localFrame > word.endFrame;

          const wordScale = isCurrent
            ? interpolate(
                localFrame,
                [word.startFrame, word.startFrame + 3],
                [1, 1.07],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              )
            : 1;

          return (
            <span
              key={`${word.startFrame}-${idx}`}
              style={{
                fontFamily: FONTS.sans,
                fontSize: 32,
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                fontWeight: isCurrent ? 800 : 700,
                color: isCurrent
                  ? accentColor
                  : isSpoken
                    ? COLORS.textPrimary
                    : "rgba(245, 245, 247, 0.62)",
                scale: `${wordScale}`,
                display: "inline-block",
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
