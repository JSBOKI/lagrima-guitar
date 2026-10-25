import { ROMAN } from "./events.js";
import { strLetters } from "./instrument.js";
export const LH_COLORS = { 0: "#6b7280", 1: "#2563eb", 2: "#16a34a", 3: "#ea580c", 4: "#dc2626" };
export const RH_COLORS = { p: "#7c3aed", i: "#0891b2", m: "#db2777", a: "#b45309" };


/** Horizontal fretboard, frets 0..12. flip=false: player’s view (6th string on top). flip=true: tab view (1st on top). */
export function fretboardSVG(ev, mot, flip) {
  const W = 400, H = 212, nut = 58, frets = 12, fw = (W - nut - 8) / frets, top = 34, gap = 25;
  const y = (s) => (flip ? top + (s - 1) * gap : top + (6 - s) * gap);
  const x = (f) => nut + (f - 0.5) * fw;
  const fx = (f) => nut + f * fw;
  const o = [];
  o.push(`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Fretboard showing left-hand fingers">`);
  o.push(`<defs><linearGradient id="wood" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#5a3620"/><stop offset="1" stop-color="#3f2515"/></linearGradient>`);
  o.push(`<marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#047857"/></marker></defs>`);
  o.push(`<text x="4" y="14" font-size="10" fill="#7a6d62">◀ headstock</text><text x="${W - 4}" y="14" font-size="10" fill="#7a6d62" text-anchor="end">body / soundhole ▶</text>`);
  o.push(`<rect x="${nut}" y="${top - 12}" width="${W - nut - 8}" height="${gap * 5 + 24}" rx="4" fill="url(#wood)"/>`);
  for (const m of [3, 5, 7, 9]) o.push(`<circle cx="${x(m)}" cy="${top + gap * 2.5}" r="4.5" fill="#d9c7a8" opacity=".75"/>`);
  o.push(`<circle cx="${x(12)}" cy="${top + gap * 1.5}" r="4.5" fill="#d9c7a8" opacity=".75"/><circle cx="${x(12)}" cy="${top + gap * 3.5}" r="4.5" fill="#d9c7a8" opacity=".75"/>`);
  for (let f = 1; f <= frets; f++) o.push(`<line x1="${fx(f)}" x2="${fx(f)}" y1="${top - 12}" y2="${top + gap * 5 + 12}" stroke="#c9c9c9" stroke-width="2"/>`);
  o.push(`<rect x="${nut - 5}" y="${top - 12}" width="6" height="${gap * 5 + 24}" fill="#f5f0e6"/>`);
  o.push(`<text x="${nut - 2}" y="${top - 16}" font-size="10" font-weight="700" fill="#5b4636" text-anchor="middle">NUT</text>`);
  const used = new Set(ev ? ev.sounding.map((n) => n.s) : []);
  for (let s = 1; s <= 6; s++) {
    const w = 0.8 + (s - 1) * 0.42;
    o.push(`<line x1="${nut - 2}" x2="${W - 8}" y1="${y(s)}" y2="${y(s)}" stroke="${s >= 4 ? "#d6b48a" : "#eeeeee"}" stroke-width="${w}"/>`);
    o.push(`<text x="4" y="${y(s) + 4}" font-size="11" font-weight="${used.has(s) ? 700 : 400}" fill="${used.has(s) ? "#2a211b" : "#a89a8c"}">${s} ${strLetters()[s - 1]}</text>`);
  }
  for (let f = 1; f <= frets; f++) o.push(`<text x="${x(f)}" y="${H - 8}" font-size="10" fill="#7a6d62" text-anchor="middle">${f}</text>`);
  if (!ev) { o.push("</svg>"); return o.join(""); }
  if (ev.barre) {
    const b = ev.barre; const y1 = Math.min(y(b.s1), y(b.s2)) - 11, y2 = Math.max(y(b.s1), y(b.s2)) + 11;
    o.push(`<rect x="${x(b.fret) - 9}" y="${y1}" width="18" height="${y2 - y1}" rx="9" fill="${LH_COLORS[1]}" opacity=".45" stroke="#fff" stroke-width="1.5"/>`);
    o.push(`<text x="${x(b.fret)}" y="${y1 - 3}" font-size="10" font-weight="700" fill="${LH_COLORS[1]}" text-anchor="middle">barre ${ROMAN[b.fret]}</text>`);
  }
  for (const g of mot.guides) {
    const yy = y(g.s) - 13;
    o.push(`<path d="M${x(g.from)},${yy} L${x(g.to) + (g.to > g.from ? -9 : 9)},${yy}" stroke="#047857" stroke-width="2.5" stroke-dasharray="4 3" fill="none" marker-end="url(#arr)"/>`);
    o.push(`<circle cx="${x(g.from)}" cy="${y(g.s)}" r="9" fill="none" stroke="#047857" stroke-width="1.5" stroke-dasharray="3 2"/>`);
  }
  const onsetSet = new Set(ev.onsets);
  for (const n of ev.sounding) {
    const isOn = onsetSet.has(n);
    if (n.f === 0) {
      o.push(`<circle cx="${nut - 18}" cy="${y(n.s)}" r="9" fill="${isOn ? "#fff" : "#f3f4f6"}" stroke="${isOn ? "#2a211b" : "#9ca3af"}" stroke-width="${isOn ? 2.2 : 1.2}"/>`);
      o.push(`<text x="${nut - 18}" y="${y(n.s) + 4}" font-size="11" font-weight="700" text-anchor="middle" fill="${isOn ? "#2a211b" : "#9ca3af"}">0</text>`);
      continue;
    }
    const col = LH_COLORS[n.lf] || "#444";
    const onBarre = ev.barre && n.lf === 1 && n.f === ev.barre.fret;
    o.push(`<circle cx="${x(n.f)}" cy="${y(n.s)}" r="${isOn ? 12.5 : 11}" fill="${col}" opacity="${isOn ? 1 : 0.45}" stroke="${isOn ? "#fff" : "none"}" stroke-width="2"/>`);
    o.push(`<text x="${x(n.f)}" y="${y(n.s) + 4.5}" font-size="14" font-weight="800" text-anchor="middle" fill="#fff">${onBarre ? "1" : n.lf}</text>`);
    if (n.ex.s && isOn) o.push(`<text x="${x(n.f) + 11}" y="${y(n.s) - 7}" font-size="8" fill="#6b7280">s</text>`);
  }
  o.push("</svg>");
  return o.join("");
}
