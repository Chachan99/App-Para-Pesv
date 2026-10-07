import React from "react";
import {
  AbsoluteFill,
  CanvasImage,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT } from "./theme";

/* ───────────── Fondo nocturno con bokeh ───────────── */

export const NightBg: React.FC<{ tint?: string }> = ({
  tint = COLORS.cyan,
}) => {
  const frame = useCurrentFrame();
  const lights = Array.from({ length: 16 }, (_, i) => {
    const x = (Math.sin(i * 12.9898) * 0.5 + 0.5) * 1080;
    const y = 900 + (Math.cos(i * 78.233) * 0.5 + 0.5) * 700;
    const r = 30 + ((i * 37) % 70);
    const hue = i % 3 === 0 ? COLORS.amber : i % 3 === 1 ? tint : COLORS.alert;
    return { x: x + Math.sin(frame / 60 + i) * 14, y, r, hue, o: 0.1 + (i % 4) * 0.04 };
  });
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 70% at 50% 100%, #0f2740 0%, ${COLORS.bg2} 45%, ${COLORS.bg} 100%)`,
      }}
    >
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {lights.map((l, i) => (
          <circle key={i} cx={l.x} cy={l.y} r={l.r} fill={l.hue} opacity={l.o} style={{ filter: "blur(14px)" }} />
        ))}
        <rect x={0} y={1500} width={1080} height={420} fill="#02060c" opacity={0.7} />
      </svg>
    </AbsoluteFill>
  );
};

/* ───────────── Texto de impacto ───────────── */

export const Headline: React.FC<{
  children: React.ReactNode;
  top?: number;
  bottom?: number;
  size?: number;
  color?: string;
  sub?: string;
  delay?: number;
}> = ({ children, top, bottom, size = 104, color = COLORS.white, sub, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 160 } });
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        top,
        bottom,
        textAlign: "center",
        fontFamily: FONT,
        opacity: interpolate(p, [0, 1], [0, 1]),
        translate: `0px ${interpolate(p, [0, 1], [40, 0])}px`,
        scale: interpolate(p, [0, 1], [0.92, 1], { output: "perceptual-scale" }),
      }}
    >
      <div
        style={{
          fontSize: size,
          lineHeight: 1.05,
          fontWeight: 900,
          letterSpacing: -2,
          color,
          textTransform: "uppercase",
          textShadow: `0 0 36px ${COLORS.cyan}55, 0 6px 24px #000c`,
        }}
      >
        {children}
      </div>
      {sub ? (
        <div style={{ marginTop: 22, fontSize: 48, fontWeight: 600, color: COLORS.cyan }}>{sub}</div>
      ) : null}
    </div>
  );
};

export const Chip: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = COLORS.cyan,
}) => (
  <div
    style={{
      display: "inline-block",
      fontFamily: FONT,
      fontWeight: 800,
      fontSize: 44,
      letterSpacing: 4,
      color,
      border: `3px solid ${color}`,
      borderRadius: 999,
      padding: "10px 34px",
      background: "#00000066",
    }}
  >
    {children}
  </div>
);

/* ───────────── Logo ───────────── */

export const Logo: React.FC<{ width?: number }> = ({ width = 760 }) => (
  <CanvasImage
    src={staticFile("logo.png")}
    style={{ width, height: (width * 90) / 313, filter: `drop-shadow(0 0 28px ${COLORS.cyan}88)` }}
  />
);

/* ───────────── Mapa estilizado ───────────── */

type Pt = readonly [number, number];

export const pointOnPath = (pts: readonly Pt[], t: number): Pt & { angle?: number } => {
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const total = seg.reduce((a, b) => a + b, 0);
  let d = Math.min(Math.max(t, 0), 1) * total;
  for (let i = 0; i < seg.length; i++) {
    if (d <= seg[i]) {
      const k = seg[i] === 0 ? 0 : d / seg[i];
      return [
        pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k,
        pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k,
      ] as unknown as Pt & { angle?: number };
    }
    d -= seg[i];
  }
  return pts[pts.length - 1] as Pt & { angle?: number };
};

export const ROUTE_A: readonly Pt[] = [
  [140, 1500], [140, 1180], [420, 1180], [420, 860], [760, 860], [760, 520], [960, 520],
];
export const ROUTE_B: readonly Pt[] = [
  [940, 1560], [940, 1260], [640, 1260], [640, 980], [300, 980], [300, 640], [120, 640],
];
export const ROUTE_C: readonly Pt[] = [
  [540, 1620], [540, 1380], [220, 1380], [220, 1040], [520, 1040], [520, 700], [880, 700],
];

export const CityMap: React.FC<{
  routes?: { pts: readonly Pt[]; t: number; color: string; label?: string }[];
  scale?: number;
  originX?: number;
  originY?: number;
  geofence?: { x: number; y: number; r: number; color: string };
  width?: number;
  height?: number;
}> = ({ routes = [], scale = 1, originX = 540, originY = 960, geofence, width = 1080, height = 1920 }) => {
  const frame = useCurrentFrame();
  const roads: React.ReactNode[] = [];
  for (let i = 0; i < 12; i++) {
    roads.push(<line key={`h${i}`} x1={0} x2={1080} y1={180 + i * 150} y2={180 + i * 150 + (i % 3) * 18} stroke="#17314d" strokeWidth={i % 4 === 0 ? 16 : 7} />);
    roads.push(<line key={`v${i}`} y1={0} y2={1920} x1={60 + i * 100} x2={60 + i * 100 + (i % 2) * 24} stroke="#17314d" strokeWidth={i % 5 === 0 ? 16 : 7} />);
  }
  return (
    <svg width={width} height={height} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
      <g style={{ transformOrigin: `${originX}px ${originY}px`, transform: `scale(${scale})` }}>
        <rect width={1080} height={1920} fill="#08121f" />
        {[...Array(14)].map((_, i) => (
          <rect key={i} x={(i * 211) % 980} y={(i * 337) % 1800} width={120 + (i % 3) * 40} height={90 + (i % 4) * 30} fill="#0b1c30" rx={8} />
        ))}
        {roads}
        {geofence ? (
          <g>
            <circle cx={geofence.x} cy={geofence.y} r={geofence.r} fill={`${geofence.color}22`} stroke={geofence.color} strokeWidth={6} strokeDasharray="22 14" />
          </g>
        ) : null}
        {routes.map((r, i) => {
          const head = pointOnPath(r.pts, r.t);
          const trail = [...r.pts.slice(0, Math.max(1, Math.ceil(r.t * (r.pts.length - 1)))), head];
          return (
            <g key={i}>
              <polyline points={trail.map((p) => p.join(",")).join(" ")} fill="none" stroke={r.color} strokeWidth={9} strokeLinejoin="round" strokeLinecap="round" opacity={0.85} style={{ filter: `drop-shadow(0 0 10px ${r.color})` }} />
              <circle cx={head[0]} cy={head[1]} r={26 + ((frame * 1.2 + i * 9) % 40)} fill="none" stroke={r.color} strokeWidth={4} opacity={1 - ((frame * 1.2 + i * 9) % 40) / 40} />
              <circle cx={head[0]} cy={head[1]} r={20} fill={r.color} stroke="#fff" strokeWidth={5} />
              {r.label ? (
                <g transform={`translate(${head[0] + 36},${head[1] - 52})`}>
                  <rect width={190} height={52} rx={26} fill="#000a" stroke={r.color} strokeWidth={3} />
                  <text x={95} y={36} textAnchor="middle" fill="#fff" fontFamily={FONT} fontWeight={800} fontSize={28}>{r.label}</text>
                </g>
              ) : null}
            </g>
          );
        })}
      </g>
    </svg>
  );
};

/* ───────────── Celular ───────────── */

export const Phone: React.FC<{ children: React.ReactNode; width?: number; style?: React.CSSProperties }> = ({
  children,
  width = 640,
  style,
}) => (
  <div
    style={{
      position: "absolute",
      width,
      height: width * 2.05,
      left: (1080 - width) / 2,
      borderRadius: 84,
      background: "#04070c",
      border: "10px solid #1b2a3c",
      boxShadow: `0 40px 120px #000c, 0 0 90px ${COLORS.cyan}33`,
      overflow: "hidden",
      ...style,
    }}
  >
    <div style={{ position: "absolute", top: 18, left: "50%", translate: "-50% 0", width: 170, height: 40, borderRadius: 24, background: "#000", zIndex: 5 }} />
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, #0c1a2b, #060d17)` }}>{children}</div>
  </div>
);

export const AlertCard: React.FC<{
  title: string;
  body: string;
  time?: string;
  color?: string;
  icon?: string;
  delay?: number;
}> = ({ title, body, time = "ahora", color = COLORS.alert, icon = "!", delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 180 } });
  return (
    <div
      style={{
        fontFamily: FONT,
        display: "flex",
        gap: 24,
        alignItems: "center",
        padding: "26px 28px",
        borderRadius: 34,
        background: "#13243aee",
        border: `2px solid ${color}88`,
        boxShadow: `0 0 40px ${color}33`,
        opacity: interpolate(p, [0, 1], [0, 1]),
        translate: `0px ${interpolate(p, [0, 1], [-60, 0])}px`,
        scale: interpolate(p, [0, 1], [0.9, 1], { output: "perceptual-scale" }),
      }}
    >
      <div style={{ width: 84, height: 84, flexShrink: 0, borderRadius: 24, background: color, display: "grid", placeItems: "center", color: "#fff", fontSize: 52, fontWeight: 900 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", color: COLORS.white, fontSize: 34, fontWeight: 800 }}>
          <span>{title}</span>
          <span style={{ fontSize: 26, color: COLORS.muted, fontWeight: 600 }}>{time}</span>
        </div>
        <div style={{ color: COLORS.muted, fontSize: 32, fontWeight: 500, marginTop: 4 }}>{body}</div>
      </div>
    </div>
  );
};

/* ───────────── Siluetas de vehículos (línea tecnológica) ───────────── */

type VType = "car" | "moto" | "pickup" | "truck" | "bus";

export const VehicleIcon: React.FC<{ type: VType; size?: number; color?: string }> = ({
  type,
  size = 560,
  color = COLORS.cyan,
}) => {
  const s = { stroke: color, strokeWidth: 6, fill: "none", strokeLinejoin: "round", strokeLinecap: "round" } as const;
  const glow = { filter: `drop-shadow(0 0 14px ${color})` };
  const wheel = (cx: number, cy = 150, r = 26) => (
    <g>
      <circle cx={cx} cy={cy} r={r} {...s} fill="#050b14" />
      <circle cx={cx} cy={cy} r={8} {...s} />
    </g>
  );
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 400 200" style={glow}>
      {type === "car" && (
        <>
          <path d="M20 150 L30 112 Q40 98 70 94 L120 52 Q135 40 160 40 L250 40 Q272 42 290 62 L322 94 Q372 100 382 124 L382 150 Z" {...s} />
          <path d="M138 94 L172 56 L236 56 L268 94 Z" {...s} />
          {wheel(100)}
          {wheel(300)}
        </>
      )}
      {type === "pickup" && (
        <>
          <path d="M16 150 L16 108 L150 108 L176 54 Q184 44 200 44 L262 44 L290 108 L384 108 L384 150 Z" {...s} />
          <path d="M190 108 L204 62 L254 62 L272 108 Z" {...s} />
          {wheel(92)}
          {wheel(312)}
        </>
      )}
      {type === "moto" && (
        <>
          <circle cx={90} cy={140} r={44} {...s} />
          <circle cx={310} cy={140} r={44} {...s} />
          <path d="M90 140 L150 84 L240 84 L280 100 L310 140 M150 84 L132 60 L178 56 M240 84 L270 52 L312 52 M170 118 L226 118 L240 84" {...s} />
          <circle cx={198} cy={118} r={18} {...s} />
        </>
      )}
      {type === "truck" && (
        <>
          <path d="M14 150 L14 36 L236 36 L236 150 Z" {...s} />
          <path d="M236 150 L236 70 L304 70 L356 112 L388 118 L388 150 Z" {...s} />
          <path d="M254 82 L298 82 L336 112 L254 112 Z" {...s} />
          {wheel(70)}
          {wheel(172)}
          {wheel(322)}
        </>
      )}
      {type === "bus" && (
        <>
          <path d="M14 150 L14 50 Q14 34 34 34 L350 34 Q380 40 386 92 L388 150 Z" {...s} />
          {[34, 100, 166, 232].map((x) => (
            <rect key={x} x={x} y={52} width={52} height={40} rx={6} {...s} />
          ))}
          <path d="M296 52 L350 52 Q368 62 372 92 L296 92 Z" {...s} />
          {wheel(84)}
          {wheel(312)}
        </>
      )}
    </svg>
  );
};

/* ───────────── Utilidades de animación ───────────── */

export const useFadeInOut = (durationInFrames: number, edge = 6) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [0, edge, durationInFrames - edge, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
};

export const Vignette: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(90% 70% at 50% 50%, transparent 55%, #000a 100%)", pointerEvents: "none" }} />
);

export const ScanLine: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.08, background: "repeating-linear-gradient(0deg, #fff 0 1px, transparent 1px 4px)", translate: `0px ${frame % 4}px` }} />
  );
};
