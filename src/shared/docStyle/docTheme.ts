import { FONTS, SAFE_ZONE, SPRING_CONFIGS } from "../theme";

export { FONTS, SAFE_ZONE, SPRING_CONFIGS };

/**
 * Shared "@ngulikin"-inspired Cel-Shaded Documentary Design System.
 * Reusable across all future documentary topics in this repository.
 */
export const DOC_COLORS = {
  // Paper & Wall Backgrounds
  paper: "#F5F3EC",
  paperCard: "#FAF9F5",
  paperShadow: "rgba(22, 24, 30, 0.16)",
  wallWarm: "#E8E4DA",
  wallCool: "#DCE2E8",
  deskDark: "#4B4E46",
  deskWood: "#7C624A",

  // Ink & Outlines
  ink: "#1A1D24",
  inkMuted: "#545863",
  outline: "#1A1D24",

  // Documentary Accents
  highlightOrange: "#E84D28",
  alertRed: "#DC2626",
  radarGreen: "#22C55E",
  radarDark: "#0F291E",

  // Environment / Sea / Sky
  skyDay: "#CBDCEB",
  oceanBlue: "#1E5B94",
  oceanDeep: "#143C66",
  landGreen: "#6E9E58",
  landSand: "#D6C59C",
  xrayCyan: "#38BDF8",
  smokeWhite: "#F1F5F9",
} as const;
