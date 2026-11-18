import { loadFont as loadPlusJakartaSans } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInstrumentSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";
import type { SpringConfig } from "remotion";

const jakarta = loadPlusJakartaSans("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const instrumentItalic = loadInstrumentSerif("italic", {
  weights: ["400"],
  subsets: ["latin"],
});

const jetbrains = loadJetBrainsMono("normal", {
  weights: ["400", "500", "700"],
  subsets: ["latin"],
});

export const FONTS = {
  sans: jakarta.fontFamily,
  serif: instrumentItalic.fontFamily,
  mono: jetbrains.fontFamily,
} as const;

export const SAFE_ZONE = {
  paddingHorizontal: 80,
  paddingVertical: 160,
} as const;

/**
 * Editorial High-Contrast Palette:
 * Alternates deep matte obsidian and warm paper off-white with ONE sharp vermilion accent.
 */
export const COLORS = {
  bg: "#0B0B0D",
  surface: "#141418",
  surfaceElevated: "#1C1C22",
  paper: "#F3F1EC",
  paperElevated: "#EAE6DD",
  border: "rgba(255, 255, 255, 0.14)",
  borderLight: "rgba(17, 17, 19, 0.14)",
  textPrimary: "#F5F5F7",
  textSecondary: "#9E9EA7",
  textMuted: "#686870",
  inkPrimary: "#111113",
  inkSecondary: "#5A5A62",
  accent: "#FF3B30",
  accentSoft: "rgba(255, 59, 48, 0.14)",
  // Aliases kept so reusable components remain compatible
  accentIndigo: "#FF3B30",
  accentCyan: "#F5F5F7",
  accentRose: "#FF3B30",
  accentEmerald: "#10B981",
} as const;

export const SPRING_CONFIGS: Record<
  "snappy" | "smooth" | "bouncy",
  Partial<SpringConfig>
> = {
  snappy: {
    damping: 16,
    stiffness: 150,
    mass: 0.75,
  },
  smooth: {
    damping: 200,
    stiffness: 110,
    mass: 1,
  },
  bouncy: {
    damping: 11,
    stiffness: 170,
    mass: 0.7,
  },
};
