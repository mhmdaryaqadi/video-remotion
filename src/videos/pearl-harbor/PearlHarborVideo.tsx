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
import { PEARL_HARBOR_TIMING, PH_COLORS } from "./theme";
import { Scene1RadarRoom } from "./scenes/Scene1RadarRoom";
import { Scene2PacificEmbargo } from "./scenes/Scene2PacificEmbargo";
import { Scene3OilCrisis } from "./scenes/Scene3OilCrisis";
import { Scene4CarrierFleet } from "./scenes/Scene4CarrierFleet";
import { Scene5TorpedoXray } from "./scenes/Scene5TorpedoXray";
import { Scene6ToraTakeoff } from "./scenes/Scene6ToraTakeoff";
import { Scene7BattleshipRow } from "./scenes/Scene7BattleshipRow";
import { Scene8MissedTargets } from "./scenes/Scene8MissedTargets";
import { Scene9NewspaperBoomerang } from "./scenes/Scene9NewspaperBoomerang";
import { Scene10ClosingGiant } from "./scenes/Scene10ClosingGiant";

const BedAudio: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const bedVolume = interpolate(
    frame,
    [0, 18, Math.max(24, durationInFrames - 36), durationInFrames],
    [0, 0.16, 0.16, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <Audio src={staticFile("audio/pearl-harbor/bed.wav")} volume={bedVolume} />
  );
};

const DocProgressLine: React.FC = () => {
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
        height: 5,
        backgroundColor: "rgba(26, 29, 36, 0.14)",
        zIndex: 50,
      }}
    >
      <div
        style={{
          width: `${progressPct}%`,
          height: "100%",
          backgroundColor: PH_COLORS.highlightOrange,
        }}
      />
    </div>
  );
};

export const PearlHarborVideo: React.FC = () => {
  const transition = linearTiming({
    durationInFrames: PEARL_HARBOR_TIMING.transitionFrames,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: PH_COLORS.paper }}>
      <BedAudio />

      <TransitionSeries>
        {/* Scene 1: Opana Point Radar Station (0..504) */}
        <TransitionSeries.Sequence durationInFrames={PEARL_HARBOR_TIMING.scene1Frames}>
          <Scene1RadarRoom />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={transition}
        />

        {/* Scene 2: Pacific Oil Embargo Map (492..822) */}
        <TransitionSeries.Sequence durationInFrames={PEARL_HARBOR_TIMING.scene2Frames}>
          <Scene2PacificEmbargo />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={transition}
        />

        {/* Scene 3: Oil Reserves Gauge & Tactical Strike Plan (810..1192) */}
        <TransitionSeries.Sequence durationInFrames={PEARL_HARBOR_TIMING.scene3Frames}>
          <Scene3OilCrisis />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={transition}
        />

        {/* Scene 4: 6 Carriers Radio Silence Fleet (1180..1574) */}
        <TransitionSeries.Sequence durationInFrames={PEARL_HARBOR_TIMING.scene4Frames}>
          <Scene4CarrierFleet />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={transition}
        />

        {/* Scene 5: Type 91 Torpedo X-Ray & Wooden Fins (1562..1988) */}
        <TransitionSeries.Sequence durationInFrames={PEARL_HARBOR_TIMING.scene5Frames}>
          <Scene5TorpedoXray />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={transition}
        />

        {/* Scene 6: Carrier Takeoff & Tora! Tora! Tora! (1976..2324) */}
        <TransitionSeries.Sequence durationInFrames={PEARL_HARBOR_TIMING.scene6Frames}>
          <Scene6ToraTakeoff />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={transition}
        />

        {/* Scene 7: Battleship Row & USS Arizona (2312..2678) */}
        <TransitionSeries.Sequence durationInFrames={PEARL_HARBOR_TIMING.scene7Frames}>
          <Scene7BattleshipRow />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={transition}
        />

        {/* Scene 8: Torn-Paper Split Screen — Missed Carriers & Fuel Tanks (2666..3040) */}
        <TransitionSeries.Sequence durationInFrames={PEARL_HARBOR_TIMING.scene8Frames}>
          <Scene8MissedTargets />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={transition}
        />

        {/* Scene 9: 8 Dec 1941 Newspaper & Boomerang Effect (3028..3452) */}
        <TransitionSeries.Sequence durationInFrames={PEARL_HARBOR_TIMING.scene9Frames}>
          <Scene9NewspaperBoomerang />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={transition}
        />

        {/* Scene 10: Closing — Awakening the Industrial Giant (3440..3682) */}
        <TransitionSeries.Sequence durationInFrames={PEARL_HARBOR_TIMING.scene10Frames}>
          <Scene10ClosingGiant />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <DocProgressLine />
    </AbsoluteFill>
  );
};
