import React from "react";
import {
  AbsoluteFill,
  CanvasImage,
  Easing,
  getStaticFiles,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Video } from "@remotion/media";
import { COLORS, FONT } from "./theme";

type Pt = readonly [number, number];

/* ───────────── Textura de película y viñeta ───────────── */

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.07 }) => {
  const frame = useCurrentFrame();
  const k = frame % 6;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity,
        mixBlendMode: "overlay",
        backgroundImage: `url(${staticFile("grain.png")})`,
        backgroundPosition: `${k * 97}px ${k * 53}px`,
      }}
    />
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(95% 75% at 50% 50%, transparent 52%, #000b 100%)", pointerEvents: "none" }} />
);

export const ScanLine: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.05, background: "repeating-linear-gradient(0deg, #fff 0 1px, transparent 1px 4px)", translate: `0px ${frame % 4}px` }} />
  );
};

/* ───────────── Clips reales opcionales (public/clips/<nombre>.mp4) ───────────── */

export const Footage: React.FC<{ name: string; children: React.ReactNode }> = ({ name, children }) => {
  const exists = getStaticFiles().some((f) => f.name === `clips/${name}.mp4`);
  if (!exists) return <>{children}</>;
  return (
    <AbsoluteFill>
      <Video src={staticFile(`clips/${name}.mp4`)} muted objectFit="cover" style={{ position: "absolute", width: "100%", height: "100%" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #050b14aa 0%, #050b1400 35%, #050b1400 60%, #050b14cc 100%)" }} />
      <AbsoluteFill style={{ background: `${COLORS.cyan}10`, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};

/* ───────────── Fondos ───────────── */

export const NightBg: React.FC<{ tint?: string }> = ({ tint = COLORS.cyan }) => {
  const frame = useCurrentFrame();
  const bokeh = Array.from({ length: 10 }, (_, i) => {
    const x = (Math.sin(i * 12.9898) * 0.5 + 0.5) * 1080;
    const y = 1000 + (Math.cos(i * 78.233) * 0.5 + 0.5) * 760;
    return { x: x + Math.sin(frame / 90 + i) * 18, y, r: 46 + ((i * 37) % 80), c: i % 3 === 0 ? COLORS.amber : tint, o: 0.07 + (i % 3) * 0.03 };
  });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(130% 80% at 50% 105%, #12304d 0%, ${COLORS.bg2} 42%, ${COLORS.bg} 100%)` }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {bokeh.map((b, i) => (
          <circle key={i} cx={b.x} cy={b.y} r={b.r} fill={b.c} opacity={b.o} style={{ filter: "blur(22px)" }} />
        ))}
        <rect x={-100} y={960 + Math.sin(frame / 70) * 8} width={1280} height={3} fill={tint} opacity={0.35} style={{ filter: "blur(3px)" }} />
        <rect x={-100} y={1290} width={1280} height={2} fill={tint} opacity={0.18} style={{ filter: "blur(2px)" }} />
      </svg>
      <Grain />
    </AbsoluteFill>
  );
};

/** Carretera nocturna en perspectiva: líneas de carril que avanzan hacia la cámara. */
export const NightRoad: React.FC<{ speed?: number; tint?: string }> = ({ speed = 1, tint = COLORS.alert }) => {
  const frame = useCurrentFrame();
  const vp = { x: 540, y: 700 };
  const dashes = Array.from({ length: 9 }, (_, i) => {
    const t = (((i / 9) + (frame * 0.012 * speed)) % 1);
    const p = Math.pow(t, 2.2);
    const y = vp.y + (1920 - vp.y) * p;
    return { y, h: 8 + 150 * p, w: 4 + 26 * p, o: 0.2 + 0.7 * p };
  });
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, #03060b 0%, #071120 ${vp.y / 19.2}%, #02050a 100%)` }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <polygon points={`${vp.x - 4},${vp.y} ${vp.x + 4},${vp.y} 1500,1920 -420,1920`} fill="#0b1626" />
        <polygon points={`${vp.x - 4},${vp.y} ${vp.x + 4},${vp.y} 1500,1920 -420,1920`} fill={`url(#roadglow)`} opacity={0.5} />
        <defs>
          <radialGradient id="roadglow" cx="50%" cy="36%" r="60%">
            <stop offset="0%" stopColor={tint} stopOpacity="0.5" />
            <stop offset="100%" stopColor={tint} stopOpacity="0" />
          </radialGradient>
        </defs>
        {dashes.map((d, i) => (
          <rect key={i} x={540 - d.w / 2} y={d.y} width={d.w} height={d.h} fill="#cfe9f5" opacity={d.o} />
        ))}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const side = i % 2 === 0 ? -1 : 1;
          const t = (((i / 7) + frame * 0.006 * speed) % 1);
          const p = Math.pow(t, 1.8);
          const x = 540 + side * (60 + 640 * p);
          const y = vp.y - 40 + 500 * p;
          return <circle key={i} cx={x} cy={y} r={4 + 34 * p} fill={i % 3 === 0 ? COLORS.amber : "#fff5d6"} opacity={0.15 + 0.6 * p} style={{ filter: "blur(4px)" }} />;
        })}
        <ellipse cx={vp.x} cy={vp.y} rx={220} ry={26} fill={tint} opacity={0.35} style={{ filter: "blur(18px)" }} />
      </svg>
      <Grain />
    </AbsoluteFill>
  );
};

/* ───────────── Texto ───────────── */

export const Headline: React.FC<{
  children: React.ReactNode;
  top?: number;
  bottom?: number;
  size?: number;
  color?: string;
  sub?: string;
  delay?: number;
}> = ({ children, top, bottom, size = 100, color = COLORS.white, sub, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 150 } });
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top,
        bottom,
        textAlign: "center",
        fontFamily: FONT,
        opacity: interpolate(p, [0, 1], [0, 1]),
        translate: `0px ${interpolate(p, [0, 1], [36, 0])}px`,
        filter: `blur(${interpolate(p, [0, 1], [10, 0])}px)`,
      }}
    >
      <div
        style={{
          fontSize: size,
          lineHeight: 1.04,
          fontWeight: 900,
          letterSpacing: -1.5,
          color,
          textTransform: "uppercase",
          textShadow: `0 0 40px ${COLORS.cyan}44, 0 8px 28px #000d`,
        }}
      >
        {children}
      </div>
      {sub ? <div style={{ marginTop: 22, fontSize: 46, fontWeight: 600, color: COLORS.cyan }}>{sub}</div> : null}
    </div>
  );
};

export const Chip: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = COLORS.cyan }) => (
  <div
    style={{
      display: "inline-block",
      fontFamily: FONT,
      fontWeight: 800,
      fontSize: 38,
      letterSpacing: 5,
      color,
      border: `2px solid ${color}aa`,
      borderRadius: 999,
      padding: "14px 40px",
      background: "linear-gradient(180deg, #0d1b2eee, #050b14ee)",
      boxShadow: `0 0 30px ${color}33`,
    }}
  >
    {children}
  </div>
);

export const Logo: React.FC<{ width?: number }> = ({ width = 760 }) => (
  <CanvasImage
    src={staticFile("logo.png")}
    style={{ width, height: (width * 90) / 313, filter: `drop-shadow(0 0 28px ${COLORS.cyan}88)` }}
  />
);

export const ShieldIcon: React.FC<{ size?: number }> = ({ size = 84 }) => (
  <div
    style={{
      width: size,
      height: size,
      flexShrink: 0,
      borderRadius: size * 0.24,
      backgroundColor: "#07121e",
      backgroundImage: `url(${staticFile("logo.png")})`,
      backgroundSize: "auto 82%",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "6% 50%",
      border: `1.5px solid ${COLORS.cyan}66`,
    }}
  />
);

/* ───────────── Mapa ───────────── */

export const pointOnPath = (pts: readonly Pt[], t: number): Pt => {
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const total = seg.reduce((a, b) => a + b, 0);
  let d = Math.min(Math.max(t, 0), 1) * total;
  for (let i = 0; i < seg.length; i++) {
    if (d <= seg[i]) {
      const k = seg[i] === 0 ? 0 : d / seg[i];
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k];
    }
    d -= seg[i];
  }
  return pts[pts.length - 1];
};

export const ROUTE_A: readonly Pt[] = [[140, 1500], [140, 1180], [420, 1180], [420, 860], [760, 860], [760, 520], [960, 520]];
export const ROUTE_B: readonly Pt[] = [[940, 1560], [940, 1260], [640, 1260], [640, 980], [300, 980], [300, 640], [120, 640]];
export const ROUTE_C: readonly Pt[] = [[540, 1620], [540, 1380], [220, 1380], [220, 1040], [520, 1040], [520, 700], [880, 700]];
export const GEOZONE: readonly Pt[] = [[250, 520], [760, 380], [940, 900], [620, 1380], [300, 1100]];

const STREETS_H = ["Calle 8", "Calle 11", "Calle 14", "Calle 17", "Calle 20"];
const STREETS_V = ["Carrera 25", "Carrera 27", "Carrera 29", "Carrera 31"];

export const CityMap: React.FC<{
  routes?: { pts: readonly Pt[]; t: number; color: string; label?: string }[];
  scale?: number;
  originX?: number;
  originY?: number;
  polygon?: { pts: readonly Pt[]; color: string };
  width?: number;
  height?: number;
  texture?: boolean;
}> = ({ routes = [], scale = 1, originX = 540, originY = 960, polygon, width = 1080, height = 1920, texture = true }) => {
  const frame = useCurrentFrame();
  const roads: React.ReactNode[] = [];
  for (let i = 0; i < 12; i++) {
    const major = i % 4 === 0;
    const y = 180 + i * 150;
    roads.push(<line key={`hc${i}`} x1={-20} x2={1100} y1={y} y2={y + (i % 3) * 18} stroke="#04101a" strokeWidth={major ? 26 : 14} />);
    roads.push(<line key={`h${i}`} x1={-20} x2={1100} y1={y} y2={y + (i % 3) * 18} stroke={major ? "#2b6f93" : "#1c4560"} strokeWidth={major ? 14 : 6} opacity={major ? 0.95 : 0.8} />);
    const x = 60 + i * 100;
    const mv = i % 5 === 0;
    roads.push(<line key={`vc${i}`} y1={-20} y2={1940} x1={x} x2={x + (i % 2) * 24} stroke="#04101a" strokeWidth={mv ? 26 : 14} />);
    roads.push(<line key={`v${i}`} y1={-20} y2={1940} x1={x} x2={x + (i % 2) * 24} stroke={mv ? "#2b6f93" : "#1c4560"} strokeWidth={mv ? 14 : 6} opacity={mv ? 0.95 : 0.8} />);
  }
  return (
    <svg width={width} height={height} viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
      <g style={{ transformOrigin: `${originX}px ${originY}px`, transform: `scale(${scale})` }}>
        <rect width={1080} height={1920} fill="#08141f" />
        {texture ? <image href={staticFile("terrain.png")} width={1080} height={1920} preserveAspectRatio="none" /> : null}
        {texture
          ? Array.from({ length: 13 * 11 }, (_, k) => {
              const cx = k % 13;
              const cy = Math.floor(k / 13);
              const h = Math.sin(k * 12.9898) * 43758.5453;
              const r = h - Math.floor(h);
              if (r < 0.14) return null;
              const x = 60 + cx * 100 + 14;
              const y = 180 + cy * 150 + 16;
              return <rect key={k} x={x} y={y} width={72 - (r * 20) | 0} height={118 - ((r * 40) | 0)} rx={6} fill={r > 0.8 ? "#17506a" : "#12354b"} opacity={0.55} />;
            })
          : null}
        {roads}
        {texture
          ? STREETS_H.map((n, i) => (
              <text key={n} x={40} y={170 + i * 300} fill="#7fb6d0" opacity={0.55} fontFamily={FONT} fontSize={22} fontWeight={600} letterSpacing={2}>{n.toUpperCase()}</text>
            ))
          : null}
        {texture
          ? STREETS_V.map((n, i) => (
              <text key={n} transform={`translate(${96 + i * 300},120) rotate(90)`} fill="#7fb6d0" opacity={0.55} fontFamily={FONT} fontSize={22} fontWeight={600} letterSpacing={2}>{n.toUpperCase()}</text>
            ))
          : null}
        {polygon ? (
          <polygon points={polygon.pts.map((p) => p.join(",")).join(" ")} fill={`${polygon.color}22`} stroke={polygon.color} strokeWidth={5} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 12px ${polygon.color})` }} />
        ) : null}
        {routes.map((r, i) => {
          const head = pointOnPath(r.pts, r.t);
          const ahead = pointOnPath(r.pts, Math.min(r.t + 0.01, 1));
          const ang = (Math.atan2(ahead[1] - head[1], ahead[0] - head[0]) * 180) / Math.PI;
          const trail = [...r.pts.slice(0, Math.max(1, Math.ceil(r.t * (r.pts.length - 1)))), head];
          const pulse = (frame * 1.1 + i * 9) % 46;
          return (
            <g key={i}>
              <polyline points={trail.map((p) => p.join(",")).join(" ")} fill="none" stroke={r.color} strokeWidth={16} strokeLinejoin="round" strokeLinecap="round" opacity={0.25} />
              <polyline points={trail.map((p) => p.join(",")).join(" ")} fill="none" stroke={r.color} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${r.color})` }} />
              <circle cx={head[0]} cy={head[1]} r={24 + pulse} fill="none" stroke={r.color} strokeWidth={3} opacity={1 - pulse / 46} />
              <g transform={`translate(${head[0]},${head[1]})`}>
                <circle r={26} fill="#04101a" stroke="#fff" strokeWidth={4} style={{ filter: `drop-shadow(0 0 12px ${r.color})` }} />
                <polygon points="12,0 -8,-9 -4,0 -8,9" fill={r.color} transform={`rotate(${ang})`} />
              </g>
              {r.label ? (
                <g transform={`translate(${head[0] + 38},${head[1] - 60})`}>
                  <rect width={r.label.length * 17 + 44} height={50} rx={14} fill="#06121fee" stroke={r.color} strokeWidth={2} />
                  <text x={22} y={34} fill="#fff" fontFamily={FONT} fontWeight={700} fontSize={26}>{r.label}</text>
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

export const Phone: React.FC<{ children: React.ReactNode; width?: number; style?: React.CSSProperties; statusTime?: string }> = ({
  children,
  width = 640,
  style,
  statusTime = "2:47",
}) => (
  <div
    style={{
      position: "absolute",
      width,
      height: width * 2.05,
      left: (1080 - width) / 2,
      borderRadius: width * 0.14,
      background: "linear-gradient(145deg, #3a4a5e, #0b121b 40%, #1c2a3b)",
      padding: 11,
      boxShadow: `0 50px 140px #000d, 0 0 110px ${COLORS.cyan}2e, inset 0 0 0 2px #52667c55`,
      ...style,
    }}
  >
    <div style={{ position: "absolute", right: -5, top: width * 0.55, width: 6, height: width * 0.2, borderRadius: 3, background: "#26364a" }} />
    <div style={{ position: "absolute", left: -5, top: width * 0.4, width: 6, height: width * 0.12, borderRadius: 3, background: "#26364a" }} />
    <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: width * 0.125, overflow: "hidden", background: "#050b14" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #0c1a2b, #060d17)" }}>{children}</div>
      <div style={{ position: "absolute", top: 22, left: "50%", translate: "-50% 0", width: width * 0.24, height: 38, borderRadius: 22, background: "#000", zIndex: 6 }} />
      <div style={{ position: "absolute", top: 24, left: 38, fontFamily: FONT, fontSize: 28, fontWeight: 700, color: "#fff", zIndex: 6 }}>{statusTime}</div>
      <div style={{ position: "absolute", top: 24, right: 38, fontFamily: FONT, fontSize: 24, fontWeight: 700, color: "#fff", zIndex: 6 }}>5G ▮▮▮</div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, #ffffff14 0%, #ffffff00 28%)", pointerEvents: "none", zIndex: 7 }} />
    </div>
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
  const p = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 170 } });
  return (
    <div
      style={{
        fontFamily: FONT,
        display: "flex",
        gap: 22,
        alignItems: "center",
        padding: "22px 24px",
        borderRadius: 34,
        background: "linear-gradient(180deg, #1b2e46f2, #122238f2)",
        border: "1.5px solid #ffffff22",
        boxShadow: `0 18px 50px #000a, 0 0 36px ${color}33`,
        opacity: interpolate(p, [0, 1], [0, 1]),
        translate: `0px ${interpolate(p, [0, 1], [-70, 0])}px`,
        scale: interpolate(p, [0, 1], [0.92, 1], { output: "perceptual-scale" }),
      }}
    >
      <div style={{ position: "relative" }}>
        <ShieldIcon size={80} />
        <div style={{ position: "absolute", right: -10, bottom: -10, width: 38, height: 38, borderRadius: 19, background: color, border: "3px solid #122238", display: "grid", placeItems: "center", color: "#fff", fontSize: 22, fontWeight: 900 }}>{icon}</div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", color: COLORS.muted, fontSize: 22, fontWeight: 700, letterSpacing: 2 }}>
          <span>CTRACKERGPS</span>
          <span style={{ fontWeight: 500 }}>{time}</span>
        </div>
        <div style={{ color: COLORS.white, fontSize: 31, fontWeight: 800, marginTop: 2 }}>{title}</div>
        <div style={{ color: "#b7c8d6", fontSize: 26, fontWeight: 500, marginTop: 2 }}>{body}</div>
      </div>
    </div>
  );
};

/* ───────────── Tipografía cinética ───────────── */

export const KineticWord: React.FC<{ word: string; index: number; total: number }> = ({ word, index, total }) => {
  const fs = Math.min(190, 900 / (word.length * 0.78));
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 16, stiffness: 190 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: FONT, fontSize: fs, fontWeight: 900, letterSpacing: -4, color: "transparent", WebkitTextStroke: `4px ${COLORS.cyan}`, opacity: 0.22, position: "absolute", scale: 1.25 + (1 - p) * 0.2 }}>{word}</div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: fs,
          fontWeight: 900,
          letterSpacing: -4,
          color: COLORS.white,
          textShadow: `0 0 50px ${COLORS.cyan}66`,
          opacity: p,
          translate: `${(1 - p) * 180}px 0px`,
          filter: `blur(${(1 - p) * 14}px)`,
        }}
      >
        {word}
      </div>
      <div style={{ position: "absolute", bottom: 560, fontFamily: FONT, fontSize: 34, fontWeight: 700, color: COLORS.cyan, letterSpacing: 8 }}>
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── Interfaz de la plataforma ───────────── */

export const SearchBar: React.FC<{ label?: string }> = ({ label = "Buscar dispositivos" }) => (
  <div style={{ fontFamily: FONT, background: "#fff", color: "#6b7a89", fontSize: 28, fontWeight: 500, borderRadius: 18, padding: "20px 26px", display: "flex", justifyContent: "space-between", boxShadow: "0 8px 24px #0006" }}>
    <span>{label}</span>
    <span style={{ color: COLORS.cyanDeep }}>≡</span>
  </div>
);

export const DeviceRow: React.FC<{ name: string; sub: string }> = ({ name, sub }) => (
  <div style={{ fontFamily: FONT, background: "#fff", borderRadius: 18, padding: "18px 24px", display: "flex", gap: 20, alignItems: "center", boxShadow: "0 8px 24px #0006" }}>
    <div style={{ width: 54, height: 54, borderRadius: 27, background: "#d9e1e8", display: "grid", placeItems: "center", color: "#35506b", fontSize: 26 }}>●</div>
    <div>
      <div style={{ color: "#0d1b2e", fontSize: 30, fontWeight: 800 }}>{name}</div>
      <div style={{ color: "#6b7a89", fontSize: 24 }}>{sub}</div>
    </div>
  </div>
);

export const BottomNav: React.FC<{ active?: number }> = ({ active = 0 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 150, background: "#fff", display: "flex", justifyContent: "space-around", alignItems: "center", fontFamily: FONT, fontSize: 22, fontWeight: 600 }}>
    {["Mapa", "Reportes", "Ajustes", "Cerrar sesión"].map((l, i) => (
      <div key={l} style={{ textAlign: "center", color: i === active ? "#0d1b2e" : "#8a97a5" }}>
        <div style={{ fontSize: 38 }}>{["▣", "▤", "⚙", "⎋"][i]}</div>
        {l}
      </div>
    ))}
  </div>
);

/* ───────────── Utilidades ───────────── */

export const useFadeInOut = (durationInFrames: number, edge = 6) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [0, edge, durationInFrames - edge, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
};
