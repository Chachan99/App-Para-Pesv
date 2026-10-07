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

export const FONT =
  'Inter, "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif';

// Contacto: se muestra en el cierre. Reemplazar por el número real.
export const BRAND = {
  name: "CTrackerGPS",
  web: "ctrackergps.com",
  whatsapp: "WhatsApp 312 396 1706",
  city: "Cra. 28A No. 88-17, Sesquicentenario · Ocaña",
  tagline: "Tecnología que protege lo que se mueve contigo.",
} as const;

/**
 * Fuente: capturas del Instagram @ctrackergps (publicaciones de mayo-junio 2025 y bio).
 * true  = aparece en sus publicaciones o bio.
 * false = NO aparece en lo revisado; no mostrar hasta confirmar con la empresa.
 */
export const FEATURES = {
  history: true, // "Históricos" (post FMC920)
  fleetReports: true, // "Reporte 24/7", "Memoria de reportes" (post FMC920)
  speedAlerts: true, // "ubicación y velocidad en tiempo real", "alertas inteligentes"
  monitoring247: true, // bio: "Monitoreo satelital 24/7"
  geofences: false, // no aparece en lo revisado
  remoteCut: false, // apagado remoto: no aparece
  whatsappAlerts: false, // alertas por WhatsApp: no aparece
  sicov: false, // SICOV: no aparece
} as const;
