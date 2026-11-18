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
import { COLORS, VOYAGER_TIMING } from "./theme";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2DSN } from "./scenes/Scene2DSN";
import { Scene3LightSpeed } from "./scenes/Scene3LightSpeed";
import { Scene4WeakSignal } from "./scenes/Scene4WeakSignal";
import { Scene5Closing } from "./scenes/Scene5Closing";

const BedAudio: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const bedVolume = interpolate(
    frame,
    [0, 18, durationInFrames - 30, durationInFrames],
    [0, 0.14, 0.14, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <Audio src={staticFile("audio/voyager-1/bed.wav")} volume={bedVolume} />
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
        zIndex: 50,
      }}
    >
      <div
        style={{
          width: `${progressPct}%`,
          height: "100%",
          backgroundColor: COLORS.accentOrange,
        }}
      />
    </div>
  );
};

/**
 * Total duration math:
 * 407 + 587 + 420 + 494 + 234 - 4 * 12 = 2094 frames (69.80s @ 30fps)
 */
export const VoyagerVideo: React.FC = () => {
  const t1 = VOYAGER_TIMING.scene1Frames - VOYAGER_TIMING.transitionFrames;
  const t2 = t1 + VOYAGER_TIMING.scene2Frames - VOYAGER_TIMING.transitionFrames;
  const t3 = t2 + VOYAGER_TIMING.scene3Frames - VOYAGER_TIMING.transitionFrames;
  const t4 = t3 + VOYAGER_TIMING.scene4Frames - VOYAGER_TIMING.transitionFrames;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <BedAudio />

      {[t1, t2, t3, t4].map((tFrame, idx) => (
        <Audio
          key={idx}
          from={tFrame - 2}
          src={staticFile("audio/sfx/whip.wav")}
          volume={0.22}
        />
      ))}

      <TransitionSeries>
        <TransitionSeries.Sequence
          durationInFrames={VOYAGER_TIMING.scene1Frames}
        >
          <Scene1Hook />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({
            durationInFrames: VOYAGER_TIMING.transitionFrames,
          })}
        />

        <TransitionSeries.Sequence
          durationInFrames={VOYAGER_TIMING.scene2Frames}
        >
          <Scene2DSN />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={linearTiming({
            durationInFrames: VOYAGER_TIMING.transitionFrames,
          })}
        />

        <TransitionSeries.Sequence
          durationInFrames={VOYAGER_TIMING.scene3Frames}
        >
          <Scene3LightSpeed />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({
            durationInFrames: VOYAGER_TIMING.transitionFrames,
          })}
        />

        <TransitionSeries.Sequence
          durationInFrames={VOYAGER_TIMING.scene4Frames}
        >
          <Scene4WeakSignal />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({
            durationInFrames: VOYAGER_TIMING.transitionFrames,
          })}
        />

        <TransitionSeries.Sequence
          durationInFrames={VOYAGER_TIMING.scene5Frames}
        >
          <Scene5Closing />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <CinemaProgressLine />
    </AbsoluteFill>
  );
};
