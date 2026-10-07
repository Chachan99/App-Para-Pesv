import { continueRender, delayRender, staticFile } from "remotion";

export const COLORS = {
  bg: "#050b14",
  bg2: "#0a1626",
  panel: "#0d1b2e",
  cyan: "#27e3ff",
  cyanDeep: "#0aa7c4",
  white: "#f2f7fa",
  muted: "#8ea3b5",
  alert: "#ff3b4e",
  amber: "#ffb020",
  ok: "#2ee59d",
} as const;

// Montserrat (variable) servida desde public/fonts: no depende de internet al renderizar.
const fontHandle = delayRender("Cargando Montserrat");
new FontFace("Montserrat", `url(${staticFile("fonts/Montserrat-var.woff2")})`, { weight: "100 900" })
  .load()
  .then((face) => {
    document.fonts.add(face);
    continueRender(fontHandle);
  })
  .catch(() => continueRender(fontHandle));

export const FONT = `Montserrat, "Segoe UI", Helvetica, Arial, sans-serif`;

// Contacto: se muestra en el cierre. Reemplazar por el número real.
export const BRAND = {
  name: "CTrackerGPS",
  web: "ctrackergps.com",
  whatsapp: "WhatsApp +57 312 396 1706",
  city: "Los Seguros, Ocaña · Lun a vie 8 a.m. – 6 p.m.",
  tagline: "Tecnología que protege lo que se mueve contigo.",
} as const;

/**
 * Fuente: ctrackergps.com (capturas del 7/10/2026) e Instagram @ctrackergps.
 * true  = aparece publicado por la empresa.
 * false = NO aparece; no mostrar hasta confirmar.
 */
export const FEATURES = {
  history: true, // "Historial de recorridos"
  geofences: true, // "Geozonas"
  speedAlerts: true, // "Exceso de velocidad"
  ignitionAlert: true, // "Encendido no autorizado"
  batteryAlert: true, // "Desconexión de batería"
  whatsappAlerts: true, // "Las alertas llegan a tu WhatsApp"
  remoteCut: true, // "Apagado remoto del motor"
  panicButton: true, // "Botón de pánico"
  monitoring247: true, // "Central de monitoreo 24 h, todos los días"
  sicov: true, // "SICOV · Operador autorizado"
  fleetReports: true, // Instagram: "Reporte 24/7", "Memoria de reportes"
} as const;
