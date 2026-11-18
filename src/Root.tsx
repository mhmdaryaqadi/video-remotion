import "./index.css";
import { Composition, Folder } from "remotion";
import { MainVideo } from "./videos/intro-remotion/MainVideo";
import { VIDEO_CONFIG as INTRO_CONFIG } from "./videos/intro-remotion/theme";
import { VoyagerVideo } from "./videos/voyager-1/VoyagerVideo";
import { VOYAGER_CONFIG } from "./videos/voyager-1/theme";
import { PearlHarborVideo } from "./videos/pearl-harbor/PearlHarborVideo";
import { PEARL_HARBOR_CONFIG } from "./videos/pearl-harbor/theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="intro-remotion">
        <Composition
          id={INTRO_CONFIG.id}
          component={MainVideo}
          durationInFrames={INTRO_CONFIG.durationInFrames}
          fps={INTRO_CONFIG.fps}
          width={INTRO_CONFIG.width}
          height={INTRO_CONFIG.height}
        />
      </Folder>
      <Folder name="voyager-1">
        <Composition
          id={VOYAGER_CONFIG.id}
          component={VoyagerVideo}
          durationInFrames={VOYAGER_CONFIG.durationInFrames}
          fps={VOYAGER_CONFIG.fps}
          width={VOYAGER_CONFIG.width}
          height={VOYAGER_CONFIG.height}
        />
      </Folder>
      <Folder name="pearl-harbor">
        <Composition
          id={PEARL_HARBOR_CONFIG.id}
          component={PearlHarborVideo}
          durationInFrames={PEARL_HARBOR_CONFIG.durationInFrames}
          fps={PEARL_HARBOR_CONFIG.fps}
          width={PEARL_HARBOR_CONFIG.width}
          height={PEARL_HARBOR_CONFIG.height}
        />
      </Folder>
    </>
  );
};
