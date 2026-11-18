import React from "react";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { COLORS, SCENE_TIMING } from "./theme";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Remotion3D } from "./scenes/Scene2Remotion3D";
import { Scene3InfoGap } from "./scenes/Scene3InfoGap";

const BedAudio: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const bedVolume = interpolate(
    frame,
    [0, 15, durationInFrames - 25, durationInFrames],
    [0, 0.14, 0.14, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <Audio src={staticFile("audio/intro-remotion/bed.wav")} volume={bedVolume} />
  );
};

const CinemaProgressLine: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progressPct = interpolate(
    frame,
    [0, Math.max(1, durationInFrames - 1)],
    [0, 100],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 4,
        backgroundColor: "rgba(128, 128, 128, 0.18)",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: `${progressPct}%`,
          height: "100%",
          backgroundColor: COLORS.accent,
        }}
      />
    </div>
  );
};

/**
 * Total duration math:
 * 232 + 218 + 214 - 12 - 12 = 640 frames (21.33s @ 30fps)
 */
export const MainVideo: React.FC = () => {
  const transition1Frame =
    SCENE_TIMING.scene1Frames - SCENE_TIMING.transitionFrames;
  const transition2Frame =
    SCENE_TIMING.scene1Frames +
    SCENE_TIMING.scene2Frames -
    SCENE_TIMING.transitionFrames * 2;

  return (
    <AbsoluteFill>
      {/* Subtle rhythmic ambient pulse bed underneath voiceover */}
      <BedAudio />

      {/* Transition impact SFX synced to exact scene cut seams */}
      <Audio
        from={transition1Frame}
        src={staticFile("audio/sfx/whoosh.wav")}
        volume={0.4}
      />
      <Audio
        from={transition2Frame}
        src={staticFile("audio/sfx/whip.wav")}
        volume={0.45}
      />

      <TransitionSeries>
        <TransitionSeries.Sequence
          name="Scene 1: Hook"
          durationInFrames={SCENE_TIMING.scene1Frames}
        >
          <Scene1Hook />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({
            durationInFrames: SCENE_TIMING.transitionFrames,
          })}
        />

        <TransitionSeries.Sequence
          name="Scene 2: Exploded 3D"
          durationInFrames={SCENE_TIMING.scene2Frames}
        >
          <Scene2Remotion3D />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({
            durationInFrames: SCENE_TIMING.transitionFrames,
          })}
        />

        <TransitionSeries.Sequence
          name="Scene 3: Information Gap"
          durationInFrames={SCENE_TIMING.scene3Frames}
        >
          <Scene3InfoGap />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <CinemaProgressLine />
    </AbsoluteFill>
  );
};
