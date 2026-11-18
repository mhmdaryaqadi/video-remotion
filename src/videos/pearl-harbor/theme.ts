import { DOC_COLORS, FONTS, SAFE_ZONE, SPRING_CONFIGS } from "../../shared/docStyle";

export { DOC_COLORS, FONTS, SAFE_ZONE, SPRING_CONFIGS };

export const PH_COLORS = {
  ...DOC_COLORS,
  creamWall: "#EDE7D8",
  wainscot: "#B8AE98",
  woodFloor: "#9A7B56",
  woodDark: "#5C4735",
  cabinetOlive: "#4B5749",
  cabinetSlate: "#37414A",
  brass: "#D9A441",
  japanCream: "#E9DFC8",
  oceanMid: "#2265A3",
  oceanShallow: "#4895CE",
  oilAmber: "#F59E0B",
  tankerRed: "#B9382C",
} as const;

export const PEARL_HARBOR_TIMING = {
  transitionFrames: 12,
  scene1VoOffset: 6,
  scene1Frames: 455, // 6f pre + 433f VO + 16f tail (15.17s)
  scene2VoOffset: 8,
  scene2Frames: 264, // 8f pre + 239f VO + 17f tail (8.80s)
  scene3VoOffset: 8,
  scene3Frames: 339, // 8f pre + 315f VO + 16f tail (11.30s)
  scene4VoOffset: 8,
  scene4Frames: 318, // 8f pre + 294f VO + 16f tail (10.60s)
  scene5VoOffset: 8,
  scene5Frames: 354, // 8f pre + 330f VO + 16f tail (11.80s)
  scene6VoOffset: 8,
  scene6Frames: 318, // 8f pre + 294f VO + 16f tail (10.60s)
  scene7VoOffset: 8,
  scene7Frames: 312, // 8f pre + 288f VO + 16f tail (10.40s)
  scene8VoOffset: 8,
  scene8Frames: 331, // 8f pre + 307f VO + 16f tail (11.03s)
  scene9VoOffset: 8,
  scene9Frames: 334, // 8f pre + 310f VO + 16f tail (11.13s)
  scene10VoOffset: 8,
  scene10Frames: 220, // 8f pre + 185f VO + 27f tail (7.33s)
} as const;

export const PEARL_HARBOR_CONFIG = {
  id: "PearlHarbor",
  fps: 30,
  width: 1080,
  height: 1920,
  // Full 10-scene snappy documentary: 3245 - 9 * 12 = 3137 frames (104.57s @ 30fps)
  durationInFrames:
    PEARL_HARBOR_TIMING.scene1Frames +
    PEARL_HARBOR_TIMING.scene2Frames +
    PEARL_HARBOR_TIMING.scene3Frames +
    PEARL_HARBOR_TIMING.scene4Frames +
    PEARL_HARBOR_TIMING.scene5Frames +
    PEARL_HARBOR_TIMING.scene6Frames +
    PEARL_HARBOR_TIMING.scene7Frames +
    PEARL_HARBOR_TIMING.scene8Frames +
    PEARL_HARBOR_TIMING.scene9Frames +
    PEARL_HARBOR_TIMING.scene10Frames -
    PEARL_HARBOR_TIMING.transitionFrames * 9,
} as const;
