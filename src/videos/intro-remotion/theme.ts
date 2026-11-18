export {
  COLORS,
  FONTS,
  SAFE_ZONE,
  SPRING_CONFIGS,
} from "../../shared/theme";

export const SCENE_TIMING = {
  transitionFrames: 12,
  scene1Frames: 232,
  scene2Frames: 218,
  scene3Frames: 214,
} as const;

export const VIDEO_CONFIG = {
  id: "MainVideo",
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames:
    SCENE_TIMING.scene1Frames +
    SCENE_TIMING.scene2Frames +
    SCENE_TIMING.scene3Frames -
    SCENE_TIMING.transitionFrames * 2, // 640 frames (21.33s)
} as const;
