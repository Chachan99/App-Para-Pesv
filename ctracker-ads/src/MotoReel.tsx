import React from "react";
import { AbsoluteFill, Easing, interpolate, Series, useCurrentFrame, useVideoConfig } from "remotion";
import { AlertCard, Chip, CityMap, Headline, NightBg, ROUTE_C, ScanLine, VehicleIcon, Vignette, useFadeInOut } from "./kit";
import { S4Control, S7Brand, S8Cta } from "./MainReel";
import { COLORS } from "./theme";

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const Fade: React.FC<{ d: number; children: React.ReactNode }> = ({ d, children }) => (
  <AbsoluteFill style={{ opacity: useFadeInOut(d, 5) }}>{children}</AbsoluteFill>
);

const MotoScene: React.FC<{ moving?: boolean; alert?: boolean; title: string }> = ({ moving, alert, title }) => {
  const frame = useCurrentFrame();
  const personX = interpolate(frame, [0, 50], [1200, 700], { extrapolateRight: "clamp", easing: ease });
  const motoX = moving ? interpolate(frame, [0, 90], [0, -420], { easing: Easing.in(Easing.quad) }) : 0;
  return (
    <AbsoluteFill>
      <NightBg tint={COLORS.alert} />
      <div style={{ position: "absolute", top: 780, left: 100, translate: `${motoX}px 0px` }}>
        <VehicleIcon type="moto" size={880} color={COLORS.white} />
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <g transform={`translate(${personX},1030)`} fill="#02060c" stroke={COLORS.alert} strokeWidth={3}>
          <circle cx={0} cy={-170} r={34} />
          <path d="M-52 -128 Q0 -150 52 -128 L66 40 L28 40 L10 -40 L-10 40 L-48 40 Z" />
        </g>
      </svg>
      <AbsoluteFill style={{ background: COLORS.alert, opacity: Math.abs(Math.sin(frame / 4.5)) * (alert ? 0.2 : 0.1) }} />
      {alert ? (
        <div style={{ position: "absolute", top: 1380, left: 60, right: 60 }}>
          <AlertCard title="CTrackerGPS" body="Encendido no autorizado" icon="!" delay={10} />
        </div>
      ) : null}
      <Headline top={150} size={112}>{title}</Headline>
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
      <Series.Sequence name="2 Alerta" durationInFrames={90} premountFor={fps}><Fade d={90}><MotoScene moving alert title="Pero tú te enteras al instante" /></Fade></Series.Sequence>
      <Series.Sequence name="3 Mapa" durationInFrames={150} premountFor={fps}><Fade d={150}><MotoMap /></Fade></Series.Sequence>
      <Series.Sequence name="4 Control" durationInFrames={120} premountFor={fps}><Fade d={120}><S4Control /></Fade></Series.Sequence>
      <Series.Sequence name="5 Marca" durationInFrames={120} premountFor={fps}><Fade d={120}><S7Brand /></Fade></Series.Sequence>
      <Series.Sequence name="6 CTA" durationInFrames={90} premountFor={fps}><Fade d={90}><S8Cta /></Fade></Series.Sequence>
    </Series>
  );
};
