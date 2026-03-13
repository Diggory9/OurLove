export interface ThemePreset {
  name: string;
  label: string;
  primary: string;
  accent: string;
  vibe: string;
}

export const themePresets: ThemePreset[] = [
  { name: "rose", label: "Rose", primary: "#f43f5e", accent: "#f59e0b", vibe: "Hồng ấm áp" },
  { name: "sunset", label: "Sunset", primary: "#f97316", accent: "#ec4899", vibe: "Hoàng hôn" },
  { name: "cherry-blossom", label: "Cherry Blossom", primary: "#ec4899", accent: "#f9a8d4", vibe: "Hoa anh đào" },
  { name: "ocean", label: "Ocean", primary: "#0ea5e9", accent: "#06b6d4", vibe: "Biển xanh" },
  { name: "lavender", label: "Lavender", primary: "#8b5cf6", accent: "#a78bfa", vibe: "Oải hương" },
  { name: "starry-night", label: "Starry Night", primary: "#6366f1", accent: "#818cf8", vibe: "Đêm sao" },
];

function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) return { h: 0, s: 0, l };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;

  return { h: h * 360, s, l };
}

function hslToHex(h: number, s: number, l: number): string {
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  if (s === 0) {
    const v = Math.round(l * 255);
    return `#${v.toString(16).padStart(2, "0")}${v.toString(16).padStart(2, "0")}${v.toString(16).padStart(2, "0")}`;
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hNorm = h / 360;

  const r = Math.round(hue2rgb(p, q, hNorm + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, hNorm) * 255);
  const b = Math.round(hue2rgb(p, q, hNorm - 1 / 3) * 255);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export function generateColorScale(hex: string): Record<string, string> {
  const { h, s } = hexToHSL(hex);
  return {
    "50": hslToHex(h, s, 0.97),
    "100": hslToHex(h, s, 0.93),
    "200": hslToHex(h, s, 0.86),
    "300": hslToHex(h, s, 0.76),
    "400": hslToHex(h, s, 0.64),
    "500": hex,
    "600": hslToHex(h, s, 0.42),
    "700": hslToHex(h, s, 0.35),
    "800": hslToHex(h, s, 0.28),
    "900": hslToHex(h, s, 0.22),
  };
}

export function generateThemeCSS(primaryColor: string, accentColor: string): string {
  const primary = generateColorScale(primaryColor);
  const accent = generateColorScale(accentColor);

  const vars: string[] = [];
  for (const [shade, color] of Object.entries(primary)) {
    vars.push(`--color-primary-${shade}: ${color}`);
  }
  for (const [shade, color] of Object.entries(accent)) {
    vars.push(`--color-accent-${shade}: ${color}`);
  }
  return vars.join("; ");
}
