import { COLORS as SHARED_COLORS, FONTS, SAFE_ZONE, SPRING_CONFIGS } from "../../shared/theme";

export { FONTS, SAFE_ZONE, SPRING_CONFIGS };

export const COLORS = {
  ...SHARED_COLORS,
  paperBg: "#F4F2ED",
  accentOrange: "#FF5A26",
  accentAmber: "#F59E0B",
  gold: "#E5A93C",
  signalCyan: "#38BDF8",
  signalCyanSoft: "rgba(56, 189, 248, 0.14)",
  signalMint: "#34D399",
  earthOcean: "#12427A",
  earthLand: "#3A7D58",
  earthAtmosphere: "#60A5FA",
} as const;

export const VOYAGER_TIMING = {
  transitionFrames: 12,
  scene1VoOffset: 6,
  scene1Frames: 407, // 6f pre + 385f VO + 16f tail
  scene2VoOffset: 10,
  scene2Frames: 587, // 10f pre + 561f VO + 16f tail
  scene3VoOffset: 10,
  scene3Frames: 420,
  scene4VoOffset: 10,
  scene4Frames: 494,
  scene5VoOffset: 8,
  scene5Frames: 234,
} as const;

export const VOYAGER_CONFIG = {
  id: "Voyager1",
  fps: 30,
  width: 1080,
  height: 1920,
  // 407 + 587 + 420 + 494 + 234 - 4 * 12 = 2094 frames (69.80s @ 30fps)
  durationInFrames:
    VOYAGER_TIMING.scene1Frames +
    VOYAGER_TIMING.scene2Frames +
    VOYAGER_TIMING.scene3Frames +
    VOYAGER_TIMING.scene4Frames +
    VOYAGER_TIMING.scene5Frames -
    VOYAGER_TIMING.transitionFrames * 4,
} as const;
