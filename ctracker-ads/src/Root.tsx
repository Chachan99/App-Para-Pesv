import { Composition, Folder } from "remotion";
import { FleetReel } from "./FleetReel";
import { MainReel } from "./MainReel";
import { MotoReel } from "./MotoReel";

export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="CTrackerGPS">
      <Composition id="Reel-Principal" component={MainReel} durationInFrames={900} fps={30} width={1080} height={1920} />
      <Composition id="Reel-Flotas" component={FleetReel} durationInFrames={810} fps={30} width={1080} height={1920} />
      <Composition id="Reel-Motos" component={MotoReel} durationInFrames={660} fps={30} width={1080} height={1920} />
    </Folder>
  );
};
