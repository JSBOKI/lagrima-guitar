import { LH_COLORS, RH_COLORS } from "./fretboard.js";
import { BEAT_LABEL } from "./events.js";

/** Tab strip for one bar. mode "lh" colours by left finger, "rh" by right finger. */
export function tabstripSVG(M, curSlot, mode, events) {
  const W = 400, H = 176, left = 34, top = 34, gap = 18, cw = (W - left - 8) / 6;
  const y = (s) => top + (s - 1) * gap;
  const cx = (slot) => left + (slot + 0.5) * cw;
  const o = [`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Tab for bar ${M.n}">`];
  o.push(`<text x="4" y="14" font-size="11" font-weight="700" fill="#5b4636">Bar ${M.n} · TAB (1st string on top)</text>`);
  const evSlots = new Set(events.filter((e) => e.n === M.n).map((e) => e.slot));
  for (let sl = 0; sl < 6; sl++) {
    const on = sl === curSlot;
    o.push(`<g class="col" data-slot="${sl}">`);
    o.push(`<rect x="${left + sl * cw + 2}" y="${top - 16}" width="${cw - 4}" height="${gap * 5 + 52}" rx="8" fill="${on ? "#fde7d4" : evSlots.has(sl) ? "#fbf7f2" : "transparent"}" stroke="${on ? "#ea580c" : "none"}" stroke-width="1.5"/>`);
    o.push(`<text x="${cx(sl)}" y="${top - 5}" font-size="10" fill="#7a6d62" text-anchor="middle">${BEAT_LABEL[sl]}</text>`);
    o.push("</g>");
  }
  for (let s = 1; s <= 6; s++) {
    o.push(`<line x1="${left}" x2="${W - 8}" y1="${y(s)}" y2="${y(s)}" stroke="#cbbfb2" stroke-width="1"/>`);
    o.push(`<text x="${left - 6}" y="${y(s) + 4}" font-size="10" fill="#7a6d62" text-anchor="end">${"eBGDAE"[s - 1]}</text>`);
  }
  for (const t of M.notes) {
    const [slot, v, s, f, lf, rf, d, ex = {}] = t;
    const col = mode === "rh" ? (rf ? RH_COLORS[rf] : "#9ca3af") : (LH_COLORS[lf] || "#444");
    const label = ex.t ? `(${f})` : String(f);
    const X = cx(slot), Y = y(s);
    o.push(`<rect x="${X - 11}" y="${Y - 8}" width="22" height="16" rx="5" fill="#fff"/>`);
    o.push(`<text x="${X - (mode === "rh" || lf > 0 ? 4 : 0)}" y="${Y + 5}" font-size="14" font-weight="800" text-anchor="middle" fill="${col}" pointer-events="none">${label}</text>`);
    if (mode === "rh" && rf) o.push(`<text x="${X + 9}" y="${Y + 5}" font-size="10" font-weight="800" fill="${col}" pointer-events="none">${rf}</text>`);
    if (mode !== "rh" && lf > 0) o.push(`<text x="${X + 9}" y="${Y + 5}" font-size="10" font-weight="800" fill="${col}" pointer-events="none">${lf}</text>`);
    if (ex.rs && mode === "rh") o.push(`<text x="${X}" y="${Y - 9}" font-size="8" font-weight="800" text-anchor="middle" fill="#92400e" pointer-events="none">R</text>`);
    if (ex.h) o.push(`<path d="M${X + 4},${Y - 10} Q${X + cw / 2},${Y - 22} ${X + cw - 4},${Y - 10}" stroke="#9d174d" fill="none" stroke-width="1.4"/>`);
    if (ex.sl) o.push(`<path d="M${X + 12},${Y + 3} L${X + cw - 12},${Y - 3}" stroke="#047857" fill="none" stroke-width="1.6"/>`);
  }
  const yb = top + gap * 5 + 26;
  for (const b of M.barres || []) {
    o.push(`<line x1="${left + b.from * cw + 6}" x2="${left + (b.to + 1) * cw - 6}" y1="${yb}" y2="${yb}" stroke="#3730a3" stroke-width="2" stroke-dasharray="5 3"/>`);
    o.push(`<text x="${left + b.from * cw + 6}" y="${yb + 13}" font-size="10" font-weight="700" fill="#3730a3">${b.label}</text>`);
  }
  o.push("</svg>");
  return o.join("");
}
