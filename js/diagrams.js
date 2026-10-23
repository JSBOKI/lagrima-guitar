// Reusable SVG diagrams: vertical chord box, horizontal neck (single-note positions), right-hand pattern.
import { TUNINGS, midiOf, spell } from "./notes.js";
import { LH_COLORS, RH_COLORS } from "./fretboard.js";
import { CHORD_LIB } from "./chordlib.js";

const ROM = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/** Vertical chord box. Strings 6 → 1 left to right, nut at top. Dots carry the left-hand finger number. */
export function chordBoxSVG(id, opts = {}) {
  const ch = typeof id === "string" ? CHORD_LIB[id] : id;
  if (!ch) return "";
  const fretted = ch.frets.filter((f) => f !== "x" && f > 0);
  const max = fretted.length ? Math.max(...fretted) : 0, min = fretted.length ? Math.min(...fretted) : 0;
  const base = max <= 5 ? 1 : min; // first fret shown
  const rows = Math.max(4, max - base + 1);
  const W = 162, gx = 22, left = 32, top = 44, gy = 26, H = top + rows * gy + 34;
  const x = (s) => left + (6 - s) * gx;
  const y = (f) => top + (f - base + 0.5) * gy;
  const t = TUNINGS[ch.tuning] || TUNINGS.standard;
  const o = [`<svg class="chordbox" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(ch.name)} chord diagram">`];
  o.push(`<text x="${left + 2.5 * gx}" y="13" font-size="14" font-weight="800" text-anchor="middle" fill="#2a211b">${esc(opts.title || ch.short)}</text>`);
  if (base === 1) o.push(`<rect x="${left - 1}" y="${top - 5}" width="${5 * gx + 2}" height="6" fill="#2a211b"/>`);
  for (let r = 0; r <= rows; r++) o.push(`<line x1="${left}" x2="${left + 5 * gx}" y1="${top + r * gy}" y2="${top + r * gy}" stroke="#9a8b7c" stroke-width="${r === 0 ? 1.5 : 1}"/>`);
  for (let s = 1; s <= 6; s++) o.push(`<line x1="${x(s)}" x2="${x(s)}" y1="${top}" y2="${top + rows * gy}" stroke="#6b5a4b" stroke-width="${0.8 + (s - 1) * 0.25}"/>`);
  for (let r = 0; r < rows; r++) o.push(`<text x="${left + 5 * gx + 8}" y="${top + (r + 0.5) * gy + 4}" font-size="10" fill="#7a6d62">${base + r}</text>`);
  if (base > 1) o.push(`<text x="${left - 6}" y="${top + 0.5 * gy + 4}" font-size="11" font-weight="700" text-anchor="end" fill="#2a211b">${base}fr</text>`);
  if (ch.barre) {
    const b = ch.barre, x1 = x(b.from), x2 = x(b.to);
    o.push(`<rect x="${Math.min(x1, x2) - 9}" y="${y(b.fret) - 9}" width="${Math.abs(x2 - x1) + 18}" height="18" rx="9" fill="${LH_COLORS[1]}" opacity="${b.partial ? 0.55 : 0.85}"/>`);
  }
  ch.frets.forEach((f, i) => {
    const s = 6 - i, cx = x(s);
    if (f === "x") o.push(`<text x="${cx}" y="${top - 12}" font-size="13" font-weight="700" text-anchor="middle" fill="#b91c1c">×</text>`);
    else if (f === 0) o.push(`<circle cx="${cx}" cy="${top - 16}" r="5" fill="none" stroke="#2a211b" stroke-width="1.6"/>`);
    else {
      const fg = ch.fingers[i];
      o.push(`<circle cx="${cx}" cy="${y(f)}" r="9.5" fill="${LH_COLORS[fg] || "#444"}" stroke="#fff" stroke-width="1.5"/>`);
      o.push(`<text x="${cx}" y="${y(f) + 4.5}" font-size="12" font-weight="800" text-anchor="middle" fill="#fff">${fg || ""}</text>`);
    }
    if (f !== "x") o.push(`<text x="${cx}" y="${top + rows * gy + 14}" font-size="9" text-anchor="middle" fill="#7a6d62">${spell(midiOf(t, s, f), ch.flats || /♭/.test(ch.short)).name}</text>`);
  });
  o.push(`<text x="${left + 2.5 * gx}" y="${H - 4}" font-size="9" text-anchor="middle" fill="#7a6d62">6 5 4 3 2 1 · ${ch.frets.join(" ")}</text>`);
  o.push("</svg>");
  return o.join("");
}

/**
 * Horizontal neck for single-note fingerings. notes: [{s, f, lf, label?}]. String 1 on top (same as tab).
 * Frets shown cover the notes (at least 5). Open strings are drawn left of the nut.
 */
export function neckSVG(notes, opts = {}) {
  const tuning = TUNINGS[opts.tuning] || TUNINGS.standard;
  const fr = notes.filter((n) => n.f > 0).map((n) => n.f);
  let lo = fr.length ? Math.min(...fr) : 1, hi = fr.length ? Math.max(...fr) : 4;
  lo = lo <= 3 ? 1 : lo - 1; hi = Math.max(hi + 1, lo + 4);
  const n = hi - lo + 1, W = 40 + n * 46 + 16, gap = 20, top = 22, H = top + gap * 5 + 34;
  const x0 = 40, fw = 46;
  const x = (f) => x0 + (f - lo + 0.5) * fw, y = (s) => top + (s - 1) * gap;
  const o = [`<svg class="neck" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opts.label || "Neck diagram")}">`];
  o.push(`<rect x="${x0}" y="${top - 8}" width="${n * fw}" height="${gap * 5 + 16}" rx="3" fill="#5a3620"/>`);
  for (const m of [3, 5, 7, 9, 15]) if (m >= lo && m <= hi) o.push(`<circle cx="${x(m)}" cy="${top + gap * 2.5}" r="4" fill="#d9c7a8" opacity=".7"/>`);
  if (12 >= lo && 12 <= hi) o.push(`<circle cx="${x(12)}" cy="${top + gap * 1.5}" r="4" fill="#d9c7a8" opacity=".7"/><circle cx="${x(12)}" cy="${top + gap * 3.5}" r="4" fill="#d9c7a8" opacity=".7"/>`);
  for (let k = 0; k <= n; k++) o.push(`<line x1="${x0 + k * fw}" x2="${x0 + k * fw}" y1="${top - 8}" y2="${top + gap * 5 + 8}" stroke="${k === 0 && lo === 1 ? "#f5f0e6" : "#c9c9c9"}" stroke-width="${k === 0 && lo === 1 ? 5 : 2}"/>`);
  for (let s = 1; s <= 6; s++) {
    o.push(`<line x1="${x0 - 6}" x2="${x0 + n * fw}" y1="${y(s)}" y2="${y(s)}" stroke="${s >= 4 ? "#d6b48a" : "#eee"}" stroke-width="${0.8 + (s - 1) * 0.4}"/>`);
    o.push(`<text x="4" y="${y(s) + 4}" font-size="10" fill="#7a6d62">${s} ${spell(tuning.open[s]).name}</text>`);
  }
  for (let f = lo; f <= hi; f++) o.push(`<text x="${x(f)}" y="${H - 6}" font-size="10" text-anchor="middle" fill="${[3, 5, 7, 9, 12].includes(f) ? "#2a211b" : "#7a6d62"}" font-weight="${[5, 7, 12].includes(f) ? 700 : 400}">${f}</text>`);
  if (lo > 1) o.push(`<text x="${x0 - 4}" y="${H - 6}" font-size="9" text-anchor="end" fill="#7a6d62">fret</text>`);
  const seen = new Set();
  for (const nn of notes) {
    const k = nn.s + "." + nn.f + "." + nn.lf; if (seen.has(k)) continue; seen.add(k);
    if (nn.f === 0) { o.push(`<circle cx="${x0 - 14}" cy="${y(nn.s)}" r="7" fill="#fff" stroke="#2a211b" stroke-width="1.5"/>`); continue; }
    const col = LH_COLORS[nn.lf] || "#6b7280";
    o.push(`<circle cx="${x(nn.f)}" cy="${y(nn.s)}" r="9" fill="${col}" stroke="#fff" stroke-width="1.5"/>`);
    o.push(`<text x="${x(nn.f)}" y="${y(nn.s) + 4}" font-size="11" font-weight="800" text-anchor="middle" fill="#fff">${nn.lf || "?"}</text>`);
    o.push(`<text x="${x(nn.f) + 12}" y="${y(nn.s) - 6}" font-size="8" fill="#f5e6d3">${spell(midiOf(tuning, nn.s, nn.f)).name}</text>`);
  }
  o.push("</svg>");
  return o.join("");
}

/**
 * Right-hand pattern: one column per attack, string 1 on top. steps: [{notes:[{s, rf}], brush, stroke}].
 * opts.pick: label columns with ↓ / ↑ pick strokes instead of finger letters.
 */
export function rhPatternSVG(steps, opts = {}) {
  const n = steps.length, cw = Math.max(26, Math.min(40, 340 / Math.max(n, 1))), left = 36, top = 34, gap = 18;
  const W = Math.max(250, left + n * cw + 10), H = top + gap * 5 + 40;
  const y = (s) => top + (s - 1) * gap;
  const o = [`<svg class="rhpat" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Right-hand picking pattern">`];
  o.push(`<text x="4" y="14" font-size="10" fill="#7a6d62">${opts.pick ? "pick strokes (↓ down · ↑ up)" : "order of attacks → (string 1 on top, like tab)"}</text>`);
  for (let s = 1; s <= 6; s++) {
    o.push(`<line x1="${left - 4}" x2="${W - 6}" y1="${y(s)}" y2="${y(s)}" stroke="${s >= 4 ? "#b08a5a" : "#9ca3af"}" stroke-width="${0.8 + (s - 1) * 0.35}"/>`);
    o.push(`<text x="4" y="${y(s) + 4}" font-size="10" fill="#5b4636">${s}</text>`);
  }
  steps.forEach((st, k) => {
    const cx = left + (k + 0.5) * cw;
    if (st.beat) o.push(`<text x="${cx}" y="${top + gap * 5 + 20}" font-size="10" text-anchor="middle" fill="#2a211b" font-weight="700">${st.beat}</text>`);
    if (st.brush) {
      const ss = st.notes.map((x) => x.s), s1 = Math.max(...ss), s2 = Math.min(...ss);
      const col = st.flick ? "#b45309" : RH_COLORS.i;
      o.push(`<path d="M${cx},${y(s1) + 6} L${cx},${y(s2) - 4}" stroke="${col}" stroke-width="3" marker-end="url(#rhArr)"/>`);
      o.push(`<text x="${cx}" y="${top + gap * 5 + 32}" font-size="9" text-anchor="middle" fill="${col}">${st.flick ? "a-m-i" : "i ↓"}</text>`);
      return;
    }
    for (const nt of st.notes) {
      const col = opts.pick ? (st.stroke === "↑" ? "#0f766e" : "#7c2d12") : RH_COLORS[nt.rf] || "#444";
      o.push(`<circle cx="${cx}" cy="${y(nt.s)}" r="8" fill="${col}" stroke="#fff" stroke-width="1.2"/>`);
      o.push(`<text x="${cx}" y="${y(nt.s) + 3.5}" font-size="10" font-weight="800" text-anchor="middle" fill="#fff">${opts.pick ? st.stroke : nt.rf}</text>`);
    }
    if (st.notes.length > 1) o.push(`<line x1="${cx}" x2="${cx}" y1="${y(Math.min(...st.notes.map((q) => q.s)))}" y2="${y(Math.max(...st.notes.map((q) => q.s)))}" stroke="#6b7280" stroke-width="1" stroke-dasharray="2 2"/>`);
  });
  o.push(`<defs><marker id="rhArr" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="12" refX="6" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="#b45309"/></marker></defs>`);
  o.push(`<text x="${W - 6}" y="${H - 2}" font-size="9" text-anchor="end" fill="#7a6d62">numbers under = beat</text>`);
  o.push("</svg>");
  return o.join("");
}
