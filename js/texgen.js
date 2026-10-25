import { isLele, lagKeyName } from "./instrument.js";
// Build alphaTex (alphaTab text notation) from the measure data.
const DUR = { 1: ".8", 2: ".4", 3: ".4{d}", 4: ".2", 6: ".2{d}" };
const RF = { p: 1, i: 2, m: 3, a: 4 };

function restTokens(start, len) {
  // split a rest so that it respects beat boundaries (8th slots, quarter = 2 slots)
  const out = []; let t = start, left = len;
  while (left > 0) {
    if (t % 2 === 1 || left === 1) { out.push("r.8"); t += 1; left -= 1; }
    else if (left >= 4 && t === 0) { out.push(left >= 6 ? "r.2{d}" : "r.2"); const u = left >= 6 ? 6 : 4; t += u; left -= u; }
    else { out.push("r.4"); t += 2; left -= 2; }
  }
  return out;
}

function noteTok(nt, opts) {
  const [slot, v, s, f, lf, rf, d, ex = {}] = nt;
  const fx = [];
  if (opts.lf && lf > 0) fx.push("lf " + (lf + 1));
  if (opts.rf && rf) fx.push("rf " + RF[rf]);
  if (ex.h) fx.push("h");
  if (ex.sl) fx.push("ss");
  if (ex.t) fx.push("t");
  return f + "." + s + (fx.length ? "{" + fx.join(" ") + "}" : "");
}

function voiceBar(M, voice, opts) {
  let text = voice !== 1 ? "" : opts.repeats ? (M.n === 8 ? "Fine" : M.n === 16 ? "D.C. al Fine" : "") : opts.barNums ? `m. ${M.n}` : "";
  const notes = M.notes.filter((n) => n[1] === voice);
  const bySlot = new Map();
  for (const n of notes) { if (!bySlot.has(n[0])) bySlot.set(n[0], []); bySlot.get(n[0]).push(n); }
  const toks = []; let t = 0;
  const slots = [...bySlot.keys()].sort((a, b) => a - b);
  for (const sl of slots) {
    if (sl > t) { toks.push(...restTokens(t, sl - t)); t = sl; }
    const grp = bySlot.get(sl); const d = Math.min(...grp.map((n) => n[6]));
    const beatFx = [];
    const b = (M.barres || []).find((x) => x.from === sl && voice === 2) || (M.barres || []).find((x) => x.from === sl && voice === 1 && !M.notes.some((n) => n[1] === 2 && n[0] === sl));
    if (text) { beatFx.push(`txt "${text}"`); text = ""; }
    if (opts.barre && b) beatFx.push("barre (" + b.fret + (b.s2 - b.s1 >= 4 ? " full" : " half") + ")");
    const body = grp.length === 1 ? noteTok(grp[0], opts) : "(" + grp.map((n) => noteTok(n, opts)).join(" ") + ")";
    let dur = DUR[d];
    if (beatFx.length) dur = dur.includes("{") ? dur.replace("{", "{" + beatFx.join(" ") + " ") : dur + "{" + beatFx.join(" ") + "}";
    toks.push(body + dur); t += d;
  }
  if (t < 6) toks.push(...restTokens(t, 6 - t));
  return toks.join(" ");
}

/** opts: { from, to, repeats (bool: write repeats + D.C. al Fine), lf, rf, barre, tempo } */
export function buildTex(MEASURES, PIECE, opts = {}) {
  const o = Object.assign({ from: 1, to: 16, repeats: false, lf: true, rf: true, barre: true, tempo: PIECE.tempo }, opts);
  const ms = MEASURES.filter((m) => m.n >= o.from && m.n <= o.to);
  const head = [
    `\\title "${PIECE.title}"`, `\\subtitle "${PIECE.subtitle}"`, `\\artist "Francisco Tárrega"`,
    `\\tempo ${o.tempo}`, isLele() ? `\\track "Guitarlele"` : `\\track "Guitar"`, `\\staff {score tabs}`, `\\instrument acousticguitarnylon`,
    isLele() ? `\\tuning (A4 E4 C4 G3 D3 A2)` : `\\tuning (E4 B3 G3 D3 A2 E2)`, ""
  ].join("\n");
  const bars = (voice) => ms.map((M, i) => {
    const meta = [];
    if (voice === 1) {
      if (i === 0) meta.push("\\ts (3 4)");
      if (i === 0 || M.key !== ms[i - 1].key) meta.push("\\ks " + lagKeyName(M.key));
      if (o.repeats && (M.n === 1 || M.n === 9)) meta.push("\\ro");
      if (o.repeats && (M.n === 8 || M.n === 16)) meta.push("\\rc 2");
      // Fine / D.C. shown as text; the app performs the Da Capo itself (alphaTab would jump before taking the B repeat)

      if (i === 0 || M.sec !== ms[i - 1].sec) meta.push(`\\section "${M.sec === "A" ? "A · E major" : "B · E minor"}"`);
    }
    return (meta.length ? meta.join(" ") + " " : "") + voiceBar(M, voice, o);
  }).join(" |\n");
  return head + "\\voice\n" + bars(1) + "\n\\voice\n" + bars(2) + "\n";
}
