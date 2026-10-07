import React from "react";
import { AbsoluteFill, Easing, interpolate, Series, useCurrentFrame, useVideoConfig } from "remotion";
import { AlertCard, Chip, CityMap, Footage, Headline, NightRoad, ROUTE_C, ScanLine, Vignette, useFadeInOut } from "./kit";
import { S4Control, S7Brand, S8Cta } from "./MainReel";
import { COLORS } from "./theme";

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const Fade: React.FC<{ d: number; children: React.ReactNode }> = ({ d, children }) => (
  <AbsoluteFill style={{ opacity: useFadeInOut(d, 5) }}>{children}</AbsoluteFill>
);

const MotoScene: React.FC<{ alert?: boolean; title: string }> = ({ alert, title }) => {
  const frame = useCurrentFrame();
  const pulse = Math.abs(Math.sin(frame / 4.5));
  const shake = alert && frame > 12 && frame < 50 ? Math.sin(frame * 2.9) * 8 : 0;
  return (
    <AbsoluteFill>
      <Footage name={alert ? "moto-alerta" : "moto-gancho"}>
        <NightRoad speed={alert ? 1.4 : 0.5} />
      </Footage>
      <AbsoluteFill style={{ background: COLORS.alert, opacity: pulse * (alert ? 0.2 : 0.1), mixBlendMode: "screen" }} />
      {alert ? (
        <div style={{ position: "absolute", top: 760, left: 60, right: 60, translate: `${shake}px 0px` }}>
          <AlertCard title="Encendido no autorizado" body="Tu moto arrancó fuera de horario" icon="!" delay={8} />
        </div>
      ) : null}
      <Headline top={alert ? 150 : 640} size={alert ? 104 : 120}>{title}</Headline>
      <Vignette />
    </AbsoluteFill>
  );
};

const MotoMap: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <CityMap routes={[{ pts: ROUTE_C, t: 0.1 + frame * 0.0055, color: COLORS.cyan, label: "Tu moto" }]} scale={interpolate(frame, [0, 150], [1.3, 1.05], { easing: ease })} originX={400} originY={1000} />
      <Vignette />
      <ScanLine />
      <div style={{ position: "absolute", top: 160, width: "100%", textAlign: "center" }}><Chip>● UBICACIÓN GPS</Chip></div>
      <Headline bottom={200} size={96}>Sabes dónde está, en segundos</Headline>
    </AbsoluteFill>
  );
};

export const MotoReel: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <Series>
      <Series.Sequence name="1 Gancho" durationInFrames={90} premountFor={fps}><Fade d={90}><MotoScene title="Una moto puede desaparecer en segundos" /></Fade></Series.Sequence>
      <Series.Sequence name="2 Alerta" durationInFrames={90} premountFor={fps}><Fade d={90}><MotoScene alert title="Pero tú te enteras al instante" /></Fade></Series.Sequence>
      <Series.Sequence name="3 Mapa" durationInFrames={150} premountFor={fps}><Fade d={150}><MotoMap /></Fade></Series.Sequence>
      <Series.Sequence name="4 Control" durationInFrames={120} premountFor={fps}><Fade d={120}><S4Control /></Fade></Series.Sequence>
      <Series.Sequence name="5 Marca" durationInFrames={120} premountFor={fps}><Fade d={120}><S7Brand /></Fade></Series.Sequence>
      <Series.Sequence name="6 CTA" durationInFrames={90} premountFor={fps}><Fade d={90}><S8Cta /></Fade></Series.Sequence>
    </Series>
  );
};
