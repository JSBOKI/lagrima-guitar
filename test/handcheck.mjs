// Chord library + hand guides: pitches, fingerings vs. the tab, and every lesson renders.
import { CHORD_LIB, chordsOf, heldNotes } from "../js/chordlib.js";
import { CHORDS, LESSONS } from "../js/course-data.js";
import { parseLesson } from "../js/coursetex.js";
import { handsHTML } from "../js/handguide.js";
import { chordBoxSVG } from "../js/diagrams.js";
import { midiOf, pcOf } from "../js/notes.js";
const errors = [];
const EXPECT = { BVII: [11, 3, 6], BII: [11, 3, 6], GIII: [7, 11, 2] };
for (const [id, ch] of Object.entries(CHORD_LIB)) {
  if (ch.frets.length !== 6 || ch.fingers.length !== 6) errors.push(id + " needs 6 strings");
  const pcs = new Set(ch.frets.map((f, i) => (f === "x" ? null : pcOf(midiOf(ch.tuning, 6 - i, f)))).filter((x) => x !== null));
  const tones = CHORDS[id] ? CHORDS[id].tones : EXPECT[id];
  if (!tones) { errors.push("no expected tones for " + id); continue; }
  for (const p of pcs) if (!tones.includes(p)) errors.push(`${id}: pitch class ${p} not in chord ${tones}`);
  for (const t of tones) if (!pcs.has(t)) errors.push(`${id}: missing chord tone ${t}`);
  if (CHORDS[id] && CHORDS[id].shape) for (const [s, f] of Object.entries(CHORDS[id].shape)) { const lf = ch.frets[6 - s]; if (lf !== "x" && lf !== f) errors.push(`${id}: string ${s} fret ${lf} vs CHORDS ${f}`); }
  // each fretted note has a finger; one finger can't be on two frets; barre finger covers its frets
  const held = heldNotes(ch);
  for (const n of held) if (!n.finger) errors.push(`${id}: no finger on string ${n.s}`);
  const byF = {}; for (const n of held) (byF[n.finger] ||= new Set()).add(n.f);
  for (const [fg, set] of Object.entries(byF)) if (set.size > 1) errors.push(`${id}: finger ${fg} on two frets`);
  // finger order should follow fret order (no crossed fingers)
  for (const a of held) for (const b of held) if (a.finger < b.finger && a.f > b.f) errors.push(`${id}: finger ${a.finger} fret ${a.f} above finger ${b.finger} fret ${b.f}`);
  if (!chordBoxSVG(id).startsWith("<svg")) errors.push("svg " + id);
}
// Tab fingering matches the library for chord-shape notes.
for (const l of LESSONS) {
  const per = Array.isArray(l.chords) ? l.chords : null;
  const { v1, v2 } = parseLesson(l);
  [v1, v2].forEach((bars) => bars && bars.forEach((bar, bi) => {
    const cid = per ? per[bi] : l.chords;
    const ch = CHORD_LIB[cid]; if (!ch) return;
    for (const ev of bar) for (const n of ev.notes) {
      if (!n.lf || !n.f) continue;
      const k = 6 - n.s;
      if (ch.frets[k] === n.f && ch.fingers[k] !== n.lf) errors.push(`${l.id} bar ${bi + 1}: ${n.s}.${n.f} finger ${n.lf}, ${cid} chart says ${ch.fingers[k]}`);
    }
  }));
  try { const h = handsHTML(l); if (!h.includes("Left hand") || !h.includes("Right hand")) errors.push(l.id + " guide incomplete"); for (const c of chordsOf(l)) if (!h.includes(`${CHORD_LIB[c].name}`)) errors.push(l.id + " missing chord " + c); }
  catch (e) { errors.push(l.id + " guide threw " + e.message); }
}
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log("handcheck ok:", Object.keys(CHORD_LIB).length, "chords,", LESSONS.length, "lessons with hand guides");
