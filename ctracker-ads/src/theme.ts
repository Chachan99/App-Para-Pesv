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
  whatsapp: "WhatsApp: [TU NÚMERO]",
  city: "Ocaña, Norte de Santander",
  tagline: "Tecnología que protege lo que se mueve contigo.",
} as const;

/**
 * Funciones NO verificadas: no se pudo leer ctrackergps.com ni Instagram
 * desde el entorno de desarrollo (bloqueado por el proxy). Las de abajo (false)
 * no se muestran mientras no se confirmen. Cámbialas a `true` solo si la empresa
 * realmente ofrece el servicio.
 */
export const FEATURES = {
  // Funciones estándar del rastreo GPS (CONFIRMAR con la empresa):
  geofences: true,
  speedAlerts: true,
  history: true,
  fleetReports: true,
  remoteCut: false, // apagado remoto
  whatsappAlerts: false, // alertas por WhatsApp
  monitoring247: false, // central de monitoreo 24/7
  sicov: false, // soporte SICOV
} as const;
