import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Series,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  AlertCard,
  Chip,
  CityMap,
  Headline,
  Logo,
  NightBg,
  Phone,
  ROUTE_A,
  ROUTE_B,
  ROUTE_C,
  ScanLine,
  VehicleIcon,
  Vignette,
  useFadeInOut,
} from "./kit";
import { BRAND, COLORS, FEATURES, FONT } from "./theme";

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const Fade: React.FC<{ d: number; children: React.ReactNode }> = ({ d, children }) => {
  const o = useFadeInOut(d, 5);
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

/* ── Escena 1 · Gancho (0–3 s) ── */
export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = Math.abs(Math.sin(frame / 4.5));
  const personX = interpolate(frame, [0, 60], [1200, 960], { extrapolateRight: "clamp", easing: ease });
  const carX = interpolate(frame, [55, 90], [0, -260], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  return (
    <AbsoluteFill>
      <NightBg tint={COLORS.alert} />
      <div style={{ position: "absolute", top: 760, left: 270, translate: `${carX}px 0px`, scale: interpolate(frame, [0, 90], [1, 1.08]) }}>
        <VehicleIcon type="car" size={760} color={COLORS.white} />
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <g transform={`translate(${personX},1010)`} fill="#02060c" stroke={COLORS.alert} strokeWidth={3} opacity={0.95}>
          <circle cx={0} cy={-170} r={34} />
          <path d="M-52 -128 Q0 -150 52 -128 L66 40 L28 40 L10 -40 L-10 40 L-48 40 Z" />
        </g>
      </svg>
      <AbsoluteFill style={{ background: COLORS.alert, opacity: pulse * 0.18 }} />
      <Phone width={520} style={{ top: 1280, rotate: "-4deg" }}>
        <div style={{ padding: "90px 30px" }}>
          <AlertCard title="CTrackerGPS" body="Encendido no autorizado" icon="!" delay={12} />
        </div>
      </Phone>
      <Headline top={150} size={112}>¿Y si tu vehículo se mueve sin ti?</Headline>
      <Vignette />
    </AbsoluteFill>
  );
};

/* ── Escena 2 · Mapa en tiempo real ── */
export const S2Map: React.FC = () => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 118], [0.05, 0.9], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <CityMap
        routes={[{ pts: ROUTE_A, t, color: COLORS.cyan, label: "En vivo" }]}
        scale={interpolate(frame, [0, 120], [1.25, 1], { easing: ease })}
        originX={300}
        originY={1100}
      />
      <Vignette />
      <ScanLine />
      <div style={{ position: "absolute", top: 160, width: "100%", textAlign: "center" }}>
        <Chip>● EN VIVO</Chip>
      </div>
      <Headline bottom={190} size={96}>Ubicación en tiempo real</Headline>
    </AbsoluteFill>
  );
};

/* ── Escena 3 · Alertas al celular ── */
export const S3Alerts: React.FC = () => {
  const whats = FEATURES.whatsappAlerts;
  const green = "#25d366";
  return (
    <AbsoluteFill>
      <NightBg />
      <Phone width={700} style={{ top: 330 }}>
        <div style={{ padding: "110px 28px", display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ fontFamily: FONT, color: COLORS.muted, fontSize: 36, textAlign: "center", fontWeight: 700 }}>
            {whats ? "WhatsApp · CTrackerGPS" : "Notificaciones"}
          </div>
          {FEATURES.ignitionAlert ? <AlertCard title="Encendido no autorizado" body="Motor en marcha fuera de horario" icon="!" delay={6} color={whats ? green : COLORS.alert} /> : null}
          {FEATURES.batteryAlert ? <AlertCard title="Desconexión de batería" body="Alguien intentó desconectar el equipo" icon="⚡" delay={26} color={COLORS.amber} /> : null}
          {FEATURES.geofences ? <AlertCard title="Salió de la geozona" body="Tu vehículo salió del área" icon="◎" delay={46} color={COLORS.cyan} /> : null}
          {FEATURES.speedAlerts ? <AlertCard title="Exceso de velocidad" body="92 km/h" icon="▲" delay={66} color={COLORS.alert} /> : null}
        </div>
      </Phone>
      <Headline top={130} size={92}>Alertas directas a tu celular</Headline>
      <Vignette />
    </AbsoluteFill>
  );
};

/* ── Escena 4 · Toma el control ── */
export const S4Control: React.FC = () => {
  const frame = useCurrentFrame();
  const confirm = interpolate(frame, [50, 62], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const Btn: React.FC<{ label: string; active?: boolean; color?: string }> = ({ label, active, color = COLORS.cyan }) => (
    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: active ? "#001018" : COLORS.white, background: active ? color : "#13243a", border: `2px solid ${color}88`, borderRadius: 28, padding: "30px 34px", textAlign: "center" }}>{label}</div>
  );
  return (
    <AbsoluteFill>
      <NightBg />
      <Phone width={700} style={{ top: 360 }}>
        <div style={{ padding: "120px 34px", display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontFamily: FONT, color: COLORS.white, fontSize: 46, fontWeight: 900 }}>Mi vehículo</div>
          <Btn label="Ver ubicación" active />
          {FEATURES.history ? <Btn label="Historial de recorridos" /> : null}
          {FEATURES.geofences ? <Btn label="Geozonas" /> : null}
          <div style={{ position: "relative", height: 290, borderRadius: 28, overflow: "hidden", border: `2px solid ${COLORS.cyan}55` }}>
            <CityMap width={620} height={290} scale={2.2} originX={540} originY={960} routes={[{ pts: ROUTE_A, t: 0.1 + frame * 0.004, color: COLORS.cyan }]} />
          </div>
          {FEATURES.remoteCut ? <Btn label="Apagado remoto del motor" color={COLORS.alert} active={frame > 40} /> : null}
        </div>
        {FEATURES.remoteCut ? (
          <div style={{ position: "absolute", left: 40, right: 40, bottom: 60, opacity: confirm, scale: 0.9 + confirm * 0.1, fontFamily: FONT, background: "#0d1b2e", border: `3px solid ${COLORS.alert}`, borderRadius: 32, padding: 34, textAlign: "center", color: COLORS.white, fontSize: 36, fontWeight: 700 }}>
            Corte enviado · no vuelve a encender hasta que lo habilites
          </div>
        ) : null}
      </Phone>
      <Headline top={150} size={110}>Toma el control</Headline>
      <Vignette />
    </AbsoluteFill>
  );
};

/* ── Escena 5 · Plataforma de monitoreo ── */
export const S5Monitor: React.FC = () => {
  const frame = useCurrentFrame();
  const routes = [ROUTE_A, ROUTE_B, ROUTE_C];
  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <div style={{ position: "absolute", top: 480, left: 60, right: 60, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ position: "relative", height: 340, borderRadius: 24, overflow: "hidden", border: `2px solid ${COLORS.cyan}55`, boxShadow: `0 0 40px ${COLORS.cyan}22` }}>
            <CityMap
              width={480}
              height={340}
              scale={1.8}
              originX={540}
              originY={960}
              routes={[{ pts: routes[i % 3], t: (0.1 + ((frame * 0.006 + i * 0.17) % 0.85)), color: i % 2 ? COLORS.cyan : COLORS.ok }]}
            />
          </div>
        ))}
      </div>
      <Vignette />
      <ScanLine />
      <Headline top={150} size={104}>{FEATURES.monitoring247 ? "Monitoreo 24/7" : "Monitoreo en vivo"}</Headline>
      <div style={{ position: "absolute", bottom: 200, width: "100%", textAlign: "center" }}>
        <Chip>CENTRAL ACTIVA · TODOS LOS DÍAS</Chip>
      </div>
    </AbsoluteFill>
  );
};

/* ── Escena 6 · Todo tipo de vehículo ── */
export const S6Vehicles: React.FC = () => {
  const frame = useCurrentFrame();
  const types = ["moto", "car", "pickup", "truck", "bus"] as const;
  const idx = Math.min(Math.floor(frame / 20), 5);
  const local = frame % 20;
  const x = interpolate(local, [0, 6], [140, 0], { extrapolateRight: "clamp", easing: ease });
  return (
    <AbsoluteFill>
      <NightBg />
      <div style={{ position: "absolute", top: 640, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: interpolate(local, [0, 4], [0, 1]), translate: `${x}px 0px` }}>
        {idx < 5 ? (
          <VehicleIcon type={types[idx]} size={940} />
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", width: 960 }}>
            {types.map((t) => (
              <VehicleIcon key={t} type={t} size={440} />
            ))}
          </div>
        )}
      </div>
      <Headline top={190} size={96}>Para cada necesidad</Headline>
      <div style={{ position: "absolute", bottom: 220, width: "100%", textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 60, color: COLORS.cyan, letterSpacing: 2 }}>
        MOTOS • CARROS • EMPRESAS • FLOTAS
      </div>
      <Vignette />
    </AbsoluteFill>
  );
};

/* ── Escena 7 · Plataforma + logo ── */
export const S7Brand: React.FC = () => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [50, 72], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  return (
    <AbsoluteFill>
      <CityMap
        scale={interpolate(frame, [0, 120], [1.1, 0.95])}
        routes={[
          { pts: ROUTE_A, t: 0.2 + frame * 0.005, color: COLORS.cyan },
          { pts: ROUTE_B, t: 0.15 + frame * 0.006, color: COLORS.ok },
          { pts: ROUTE_C, t: 0.1 + frame * 0.0055, color: COLORS.amber },
        ]}
      />
      <AbsoluteFill style={{ background: COLORS.bg, opacity: reveal * 0.88 }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: reveal, scale: 0.9 + reveal * 0.1 }}>
        <Logo width={900} />
        <div style={{ marginTop: 70, fontFamily: FONT, fontWeight: 900, fontSize: 96, color: COLORS.white, letterSpacing: 6 }}>CTRACKERGPS</div>
        <div style={{ marginTop: 24, padding: "0 90px", textAlign: "center", fontFamily: FONT, fontWeight: 600, fontSize: 52, color: COLORS.cyan }}>{BRAND.tagline}</div>
      </AbsoluteFill>
      <Vignette />
    </AbsoluteFill>
  );
};

/* ── Escena 8 · Cierre / CTA ── */
export const S8Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 5) * 0.025;
  return (
    <AbsoluteFill>
      <NightBg />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 56 }}>
        <Logo width={820} />
        <Headline top={540} size={116}>Protege tu vehículo hoy</Headline>
        <div style={{ position: "absolute", top: 1180, scale: pulse, fontFamily: FONT, fontWeight: 900, fontSize: 56, color: "#04140b", background: "#25d366", borderRadius: 999, padding: "34px 70px" }}>
          {BRAND.whatsapp}
        </div>
        {FEATURES.sicov ? (
          <div style={{ position: "absolute", top: 1330, fontFamily: FONT, fontWeight: 800, fontSize: 38, color: COLORS.cyan, border: `3px solid ${COLORS.cyan}`, borderRadius: 999, padding: "8px 30px" }}>SICOV · Operador autorizado</div>
        ) : null}
        <div style={{ position: "absolute", top: 1420, fontFamily: FONT, fontWeight: 800, fontSize: 60, color: COLORS.white }}>{BRAND.web}</div>
        <div style={{ position: "absolute", top: 1520, fontFamily: FONT, fontWeight: 600, fontSize: 34, color: COLORS.muted }}>{BRAND.city}</div>
      </AbsoluteFill>
      <Vignette />
    </AbsoluteFill>
  );
};

/* ── Composición principal: 30 s a 30 fps ── */
export const MainReel: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <Series>
      <Series.Sequence name="1 Gancho" durationInFrames={90} premountFor={fps}><Fade d={90}><S1Hook /></Fade></Series.Sequence>
      <Series.Sequence name="2 Mapa" durationInFrames={120} premountFor={fps}><Fade d={120}><S2Map /></Fade></Series.Sequence>
      <Series.Sequence name="3 Alertas" durationInFrames={120} premountFor={fps}><Fade d={120}><S3Alerts /></Fade></Series.Sequence>
      <Series.Sequence name="4 Control" durationInFrames={120} premountFor={fps}><Fade d={120}><S4Control /></Fade></Series.Sequence>
      <Series.Sequence name="5 Monitoreo" durationInFrames={120} premountFor={fps}><Fade d={120}><S5Monitor /></Fade></Series.Sequence>
      <Series.Sequence name="6 Vehiculos" durationInFrames={120} premountFor={fps}><Fade d={120}><S6Vehicles /></Fade></Series.Sequence>
      <Series.Sequence name="7 Marca" durationInFrames={120} premountFor={fps}><Fade d={120}><S7Brand /></Fade></Series.Sequence>
      <Series.Sequence name="8 CTA" durationInFrames={90} premountFor={fps}><Fade d={90}><S8Cta /></Fade></Series.Sequence>
    </Series>
  );
};
