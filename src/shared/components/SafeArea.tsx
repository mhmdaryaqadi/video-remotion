import React from "react";
import { AbsoluteFill } from "remotion";
import { SAFE_ZONE } from "../theme";

type SafeAreaProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
};

/**
 * Constrains foreground content within the 9:16 TikTok/Reels/Shorts safe zone.
 */
export const SafeArea: React.FC<SafeAreaProps> = ({ children, style }) => {
  return (
    <AbsoluteFill
      style={{
        paddingLeft: SAFE_ZONE.paddingHorizontal,
        paddingRight: SAFE_ZONE.paddingHorizontal,
        paddingTop: SAFE_ZONE.paddingVertical,
        paddingBottom: SAFE_ZONE.paddingVertical,
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
