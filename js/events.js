import { MEASURES } from "./data.js";

const OPEN = { 1: 64, 2: 59, 3: 55, 4: 50, 5: 45, 6: 40 };
const NAMES = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
export const ROMAN = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII"];
export const RH_NAME = { p: "thumb (p)", i: "index (i)", m: "middle (m)", a: "ring (a)" };
export const BEAT_LABEL = ["1", "&", "2", "&", "3", "&"];

export function noteObj(t, M) {
  const [slot, v, s, f, lf, rf, d, ex = {}] = t;
  const midi = OPEN[s] + f;
  return { slot, v, s, f, lf, rf, d, ex, midi, name: NAMES[midi % 12] + (Math.floor(midi / 12) - 1), n: M.n };
}

export function measure(n) { return MEASURES.find((m) => m.n === n); }

/** All "events" (moments where at least one note is plucked or a slur/tie lands) in bars from..to */
export function buildEvents(from, to) {
  const ev = [];
  for (const M of MEASURES) {
    if (M.n < from || M.n > to) continue;
    const notes = M.notes.map((t) => noteObj(t, M));
    const slots = [...new Set(notes.map((x) => x.slot))].sort((a, b) => a - b);
    for (const slot of slots) {
      const onsets = notes.filter((x) => x.slot === slot && !x.ex.t);
      if (!onsets.length) continue;
      const sounding = notes.filter((x) => x.slot <= slot && slot < x.slot + x.d);
      const beat0 = slot - (slot % 2);
      for (const x of notes) if (x.f > 0 && x.slot >= beat0 && x.slot < slot && !sounding.some((y) => y.s === x.s)) sounding.push(x);
      const held = sounding.filter((x) => !onsets.includes(x));
      const barre = (M.barres || []).find((b) => b.from <= slot && slot <= b.to) || null;
      ev.push({ n: M.n, M, slot, onsets, held, sounding, barre, key: M.n + ":" + slot });
    }
  }
  ev.forEach((e, i) => { e.i = i; e.pos = handPosition(e); });
  return ev;
}

export function handPosition(e) {
  const fretted = e.sounding.filter((x) => x.f > 0 && x.lf > 0);
  if (e.barre) return e.barre.fret;
  if (!fretted.length) return 0;
  return Math.max(1, Math.min(...fretted.map((x) => x.f - x.lf + 1)));
}

/** Compare with previous event: shifts, guide fingers */
export function motion(prev, cur) {
  const out = { shift: null, guides: [] };
  if (!prev || !cur) return out;
  if (prev.pos && cur.pos && prev.pos !== cur.pos) out.shift = { from: prev.pos, to: cur.pos };
  for (const c of cur.onsets) {
    if (!(c.lf > 0)) continue;
    const p = prev.sounding.find((x) => x.lf === c.lf && x.s === c.s && x.f > 0 && x.f !== c.f);
    if (p) out.guides.push({ finger: c.lf, s: c.s, from: p.f, to: c.f, slide: !!p.ex.sl });
  }
  return out;
}
