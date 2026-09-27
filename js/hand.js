import { RH_COLORS } from "./fretboard.js";

/** Schematic right hand seen from above (player looking down over the strings). */
export function handSVG(ev) {
  const W = 400, H = 280, sTop = 150, gap = 22;
  const y = (s) => sTop + (6 - s) * gap; // 6th string on top, like looking down
  const HOME = { p: 5, i: 3, m: 2, a: 1 };
  const X = { p: 118, i: 205, m: 250, a: 293 };
  const used = {};
  if (ev) for (const n of ev.onsets) if (n.rf) (used[n.rf] ||= []).push(n.s);
  const tipS = (f) => (used[f] ? Math.min(...used[f]) : HOME[f]);
  const o = [`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Right hand diagram with p i m a">`];
  o.push(`<rect x="60" y="${sTop - 16}" width="${W - 70}" height="${gap * 5 + 32}" rx="10" fill="#f6ead9"/>`);
  o.push(`<ellipse cx="60" cy="${sTop + gap * 2.5}" rx="38" ry="${gap * 2.6}" fill="#3b2415" opacity=".85"/>`);
  o.push(`<text x="60" y="${sTop + gap * 2.5 + 4}" font-size="9" fill="#f6ead9" text-anchor="middle">sound-</text><text x="60" y="${sTop + gap * 2.5 + 14}" font-size="9" fill="#f6ead9" text-anchor="middle">hole</text>`);
  for (let s = 1; s <= 6; s++) {
    o.push(`<line x1="40" x2="${W - 14}" y1="${y(s)}" y2="${y(s)}" stroke="${s >= 4 ? "#b08a5a" : "#9ca3af"}" stroke-width="${0.9 + (s - 1) * 0.45}"/>`);
    o.push(`<text x="${W - 4}" y="${y(s) + 4}" font-size="11" text-anchor="end" fill="#5b4636">${s}</text>`);
  }
  o.push(`<text x="${W - 4}" y="${sTop - 22}" font-size="10" text-anchor="end" fill="#7a6d62">string</text>`);
  // palm
  o.push(`<path d="M170,20 C150,40 160,95 190,110 L305,110 C330,95 335,40 315,18 Z" fill="#f2c9a5" stroke="#c98f63" stroke-width="2"/>`);
  o.push(`<text x="245" y="62" font-size="12" fill="#8a5a3a" text-anchor="middle">right hand (palm down)</text>`);
  const finger = (f, x0, y0) => {
    const s = tipS(f), tx = X[f], ty = y(s);
    const active = !!used[f];
    const col = RH_COLORS[f];
    o.push(`<path d="M${x0},${y0} Q${(x0 + tx) / 2 + (f === "p" ? -10 : 0)},${(y0 + ty) / 2} ${tx},${ty - 10}" stroke="#f2c9a5" stroke-width="${f === "p" ? 26 : 22}" stroke-linecap="round" fill="none"/>`);
    o.push(`<path d="M${x0},${y0} Q${(x0 + tx) / 2 + (f === "p" ? -10 : 0)},${(y0 + ty) / 2} ${tx},${ty - 10}" stroke="${active ? col : "#c98f63"}" stroke-width="${active ? 3 : 1.5}" stroke-linecap="round" fill="none" opacity="${active ? 1 : 0.6}"/>`);
    o.push(`<circle cx="${tx}" cy="${ty}" r="${active ? 13 : 11}" fill="${col}" opacity="${ev && !active ? 0.35 : 1}" stroke="#fff" stroke-width="2"/>`);
    o.push(`<text x="${tx}" y="${ty + 5}" font-size="14" font-weight="800" fill="#fff" text-anchor="middle">${f}</text>`);
    if (active && used[f].length > 1) for (const s2 of used[f].slice(1)) o.push(`<circle cx="${tx}" cy="${y(s2)}" r="7" fill="${col}"/>`);
  };
  finger("p", 180, 95); finger("i", 210, 108); finger("m", 250, 110); finger("a", 292, 106);
  o.push(`<path d="M95,${y(6) - 2} L88,${y(6) - 2} L88,${y(4) + 2} L95,${y(4) + 2}" stroke="${RH_COLORS.p}" stroke-width="2" fill="none"/>`);
  o.push(`<text x="84" y="${y(5) + 4}" font-size="10" font-weight="700" fill="${RH_COLORS.p}" text-anchor="end">p: 4–6</text>`);
  o.push(`<text x="${W / 2}" y="${H - 4}" font-size="10" fill="#7a6d62" text-anchor="middle">Home: p → strings 4–6 · i → 3 · m → 2 · a → 1 (little finger not used)</text>`);
  o.push("</svg>");
  return o.join("");
}

export function strokeSVG() {
  const o = [`<svg viewBox="0 0 400 150" role="img" aria-label="Free stroke and rest stroke">`];
  const panel = (x0, title, rest) => {
    o.push(`<text x="${x0 + 90}" y="16" font-size="13" font-weight="700" text-anchor="middle" fill="#2a211b">${title}</text>`);
    o.push(`<line x1="${x0 + 5}" x2="${x0 + 175}" y1="110" y2="110" stroke="#cbbfb2"/>`);
    o.push(`<circle cx="${x0 + 70}" cy="104" r="6" fill="#9ca3af"/><text x="${x0 + 70}" y="128" font-size="10" text-anchor="middle" fill="#7a6d62">string 1</text>`);
    o.push(`<circle cx="${x0 + 120}" cy="104" r="7" fill="#9ca3af"/><text x="${x0 + 120}" y="128" font-size="10" text-anchor="middle" fill="#7a6d62">string 2</text>`);
    o.push(`<circle cx="${x0 + 40}" cy="92" r="9" fill="#f2c9a5" stroke="#c98f63"/>`);
    if (rest) o.push(`<path d="M${x0 + 48},96 Q${x0 + 80},112 ${x0 + 108},98" stroke="#b45309" stroke-width="3" fill="none" marker-end="url(#ah)"/><circle cx="${x0 + 118}" cy="90" r="9" fill="#f2c9a5" stroke="#b45309" stroke-width="2"/><text x="${x0 + 118}" y="72" font-size="10" text-anchor="middle" fill="#b45309">rests here</text>`);
    else o.push(`<path d="M${x0 + 48},96 Q${x0 + 80},108 ${x0 + 92},60" stroke="#0891b2" stroke-width="3" fill="none" marker-end="url(#ah2)"/><text x="${x0 + 118}" y="52" font-size="10" text-anchor="middle" fill="#0891b2">up into the palm</text>`);
  };
  o.push(`<defs><marker id="ah" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#b45309"/></marker><marker id="ah2" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#0891b2"/></marker></defs>`);
  panel(10, "Free stroke (tirando)", false);
  panel(210, "Rest stroke (apoyando)", true);
  o.push(`<text x="200" y="146" font-size="10" text-anchor="middle" fill="#7a6d62">Side view: the fingertip plucks string 1</text>`);
  o.push("</svg>");
  return o.join("");
}
