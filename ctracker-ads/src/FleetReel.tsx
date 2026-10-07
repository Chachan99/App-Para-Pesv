import React from "react";
import { AbsoluteFill, Easing, interpolate, Series, useCurrentFrame, useVideoConfig } from "remotion";
import { AlertCard, Chip, CityMap, GEOZONE, Headline, NightBg, ROUTE_A, ROUTE_B, ROUTE_C, ScanLine, Vignette, useFadeInOut } from "./kit";
import { S7Brand, S8Cta } from "./MainReel";
import { COLORS, FEATURES, FONT } from "./theme";

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const Fade: React.FC<{ d: number; children: React.ReactNode }> = ({ d, children }) => (
  <AbsoluteFill style={{ opacity: useFadeInOut(d, 5) }}>{children}</AbsoluteFill>
);

const FleetMap: React.FC<{ labels?: boolean; geofence?: boolean; scale?: number }> = ({ labels, geofence, scale = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <CityMap
      scale={scale}
      polygon={geofence ? { pts: GEOZONE, color: COLORS.cyan } : undefined}
      routes={[
        { pts: ROUTE_A, t: 0.1 + frame * 0.004, color: COLORS.cyan, label: labels ? "Unidad 01" : undefined },
        { pts: ROUTE_B, t: 0.12 + frame * 0.0045, color: COLORS.ok, label: labels ? "Unidad 02" : undefined },
        { pts: ROUTE_C, t: 0.08 + frame * 0.0042, color: COLORS.amber, label: labels ? "Unidad 03" : undefined },
      ]}
    />
  );
};

const F1Hook: React.FC = () => (
  <AbsoluteFill>
    <FleetMap scale={1.3} />
    <AbsoluteFill style={{ background: "#050b14cc" }} />
    <Headline top={620} size={96}>¿Sabes qué están haciendo tus vehículos ahora mismo?</Headline>
    <Vignette />
  </AbsoluteFill>
);

const F2Map: React.FC = () => (
  <AbsoluteFill>
    <FleetMap labels />
    <Vignette />
    <ScanLine />
    <Headline top={150} size={96}>Toda tu flota en un solo mapa</Headline>
  </AbsoluteFill>
);

const Kpi: React.FC<{ label: string; value: string; delay: number; color?: string }> = ({ label, value, delay, color = COLORS.cyan }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [delay, delay + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  return (
    <div style={{ fontFamily: FONT, opacity: o, translate: `${(1 - o) * 80}px 0px`, background: "#0d1b2eee", border: `2px solid ${color}77`, borderRadius: 32, padding: "34px 44px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 46, color: COLORS.muted, fontWeight: 700 }}>{label}</span>
      <span style={{ fontSize: 76, color, fontWeight: 900 }}>{value}</span>
    </div>
  );
};

/* Valores ilustrativos de ejemplo, no son datos reales. */
const F3Data: React.FC = () => (
  <AbsoluteFill>
    <NightBg />
    <div style={{ position: "absolute", top: 480, left: 80, right: 80, display: "flex", flexDirection: "column", gap: 28 }}>
      {FEATURES.speedAlerts ? <Kpi label="Velocidad actual" value="62 km/h" delay={8} /> : null}
      {FEATURES.history ? <Kpi label="Recorrido de hoy" value="148 km" delay={24} color={COLORS.ok} /> : null}
      {FEATURES.fleetReports ? <Kpi label="Reporte semanal" value="Listo" delay={40} color={COLORS.amber} /> : null}
    </div>
    <Headline top={150} size={96}>Velocidad, rutas y kilometraje</Headline>
    <div style={{ position: "absolute", bottom: 150, width: "100%", textAlign: "center", fontFamily: FONT, fontSize: 32, color: COLORS.muted }}>Datos de ejemplo</div>
    <Vignette />
  </AbsoluteFill>
);

const F4Geo: React.FC = () => (
  <AbsoluteFill>
    <FleetMap geofence={FEATURES.geofences} scale={1.15} />
    <div style={{ position: "absolute", top: 1180, left: 60, right: 60 }}>
      {FEATURES.geofences ? (
        <AlertCard title="Salió de zona autorizada" body="Unidad 02 · Geocerca: Bodega" icon="◎" color={COLORS.amber} delay={30} />
      ) : (
        <AlertCard title="Exceso de velocidad" body="Unidad 02 · 92 km/h" icon="▲" color={COLORS.alert} delay={30} />
      )}
    </div>
    <Headline top={150} size={96}>{FEATURES.geofences ? "Geocercas y alertas" : "Alertas inteligentes"}</Headline>
    <Vignette />
  </AbsoluteFill>
);

const F5Pillars: React.FC = () => (
  <AbsoluteFill>
    <NightBg />
    <Headline top={560} size={130}>Ahorro</Headline>
    <Headline top={780} size={130} color={COLORS.cyan} delay={14}>Seguridad</Headline>
    <Headline top={1000} size={130} delay={28}>Control</Headline>
    <div style={{ position: "absolute", bottom: 240, width: "100%", textAlign: "center" }}><Chip>CONTROL OPERACIONAL</Chip></div>
    <Vignette />
  </AbsoluteFill>
);

export const FleetReel: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <Series>
      <Series.Sequence name="1 Gancho" durationInFrames={90} premountFor={fps}><Fade d={90}><F1Hook /></Fade></Series.Sequence>
      <Series.Sequence name="2 Mapa" durationInFrames={150} premountFor={fps}><Fade d={150}><F2Map /></Fade></Series.Sequence>
      <Series.Sequence name="3 Datos" durationInFrames={150} premountFor={fps}><Fade d={150}><F3Data /></Fade></Series.Sequence>
      <Series.Sequence name="4 Geocercas" durationInFrames={120} premountFor={fps}><Fade d={120}><F4Geo /></Fade></Series.Sequence>
      <Series.Sequence name="5 Pilares" durationInFrames={120} premountFor={fps}><Fade d={120}><F5Pillars /></Fade></Series.Sequence>
      <Series.Sequence name="6 Marca" durationInFrames={90} premountFor={fps}><Fade d={90}><S7Brand /></Fade></Series.Sequence>
      <Series.Sequence name="7 CTA" durationInFrames={90} premountFor={fps}><Fade d={90}><S8Cta /></Fade></Series.Sequence>
    </Series>
  );
};
