import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

/**
 * Tactile analog film-grain texture shifted deterministically every 2 frames.
 */
export const FilmGrain: React.FC<{ opacity?: number }> = ({
  opacity = 0.055,
}) => {
  const frame = useCurrentFrame();
  const step = Math.floor(frame / 2);
  const shiftX = (step * 43) % 180;
  const shiftY = (step * 71) % 180;

  return (
    <AbsoluteFill
      style={{
        opacity,
        mixBlendMode: "overlay",
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <svg
        width={1260}
        height={2100}
        style={{
          transform: `translate(${-shiftX}px, ${-shiftY}px)`,
        }}
      >
        <defs>
          <filter id="film-grain-filter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.82"
              numOctaves={2}
              stitchTiles="stitch"
            />
          </filter>
          <pattern
            id="film-grain-tile"
            width={180}
            height={180}
            patternUnits="userSpaceOnUse"
          >
            <rect
              width={180}
              height={180}
              filter="url(#film-grain-filter)"
              opacity={0.5}
            />
          </pattern>
        </defs>
        <rect width={1260} height={2100} fill="url(#film-grain-tile)" />
      </svg>
    </AbsoluteFill>
  );
};
