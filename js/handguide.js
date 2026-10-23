// Per-lesson "Left hand" and "Right hand" sections, generated from the lesson tab (so they always match it)
// plus hand-written technique notes per unit / lesson.
import { parseLesson } from "./coursetex.js";
import { TUNINGS, midiOf, spell } from "./notes.js";
import { CHORD_LIB, chordsOf, chordSequence, transition } from "./chordlib.js";
import { chordBoxSVG, neckSVG, rhPatternSVG } from "./diagrams.js";
import { handSVG } from "./hand.js";

const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
const ROM = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];
const ORD = { 1: "1st", 2: "2nd", 3: "3rd", 4: "4th", 5: "5th", 6: "6th" };
const FNAME = { 1: "index (1)", 2: "middle (2)", 3: "ring (3)", 4: "little (4)" };
const RNAME = { p: "thumb (p)", i: "index (i)", m: "middle (m)", a: "ring (a)" };

const STEEL_LH = [
  "Thumb behind the neck, roughly opposite finger 2, pad on the back of the neck — not hooked over the top while you are learning these shapes.",
  "Fingertips land just behind the fret wire (not on top of it, not in the middle of the fret). Close to the wire = less pressure and no buzz.",
  "Arch every finger from the big knuckle so the tip comes straight down and the open strings next to it can ring.",
  "Hold chord fingers down for the whole bar — the bass and treble notes are meant to overlap and ring.",
];
const UNIT_LH = {
  u1: ["All open strings: the left hand is not needed. Rest it lightly on the neck around the 5th fret (don’t press) or keep it relaxed in your lap so the shoulders stay level."],
  u2: ["Put the whole chord down before the bar starts, even notes you don’t pluck — the thumb needs the root and the fifth fretted in advance.", "Change chords on the last eighth of the bar: lift, keep the fingers in the shape in the air, and land them together."],
  u3: ["Pinches make two notes speak at once — both must be fretted cleanly at the same moment, so place the chord a beat early."],
  u4: ["The brush hits strings 1–3 every time: check that the top three strings ring through the chord before adding the bass melody.", "Melody on the bass strings: fingers 2 and 3 move inside the chord — only lift the finger that has to move."],
  u5: ["Rolls and arpeggios let every note ring. Keep the chord fingers planted until the next chord change."],
  u6: ["The melody fingers come and go while the bass fingers stay put — practise lifting only the melody finger (e.g. finger 4 on the high G) while 1–3 keep holding."],
  u7: ["Hammer-on: bring the finger down from about 1 cm, hard and fast, right behind the fret — the hammer is the pluck.", "Pull-off: pull the string slightly sideways (toward the floor) as you lift so it is plucked, not just released. Keep the lower finger already in place."],
  u8: ["Retune first, then check: alternate tunings make familiar shapes useless, so look at each fret number fresh.", "One-finger barres: finger 1 straight across, rolled onto its bony edge, close to the fret."],
  u9: ["Learn the chord shapes for the tune first (diagrams below), then the melody notes that sit inside them — most melody notes are already under a finger."],
  u10: ["Thumb low behind the neck (behind finger 2/3) and the elbow tucked in — that opens the hand for the 4-fret stretch.", "Freeze the shape and slide it as one unit between chords; don’t rebuild it finger by finger.", "Let the underside of the fingers touch the strings you don’t play so they stay quiet."],
  u11: ["Position playing: the hand sits in one position (finger 1 at the position fret) and fingers 2–4 take the next frets — one finger per fret. Shifts are marked below.", "Classical posture: footstool or support, guitar neck at about 45°, thumb behind the neck opposite finger 2, wrist straight-ish and forward.", "Keep fingers hovering low (5 mm) over the strings so the next note is ready; let each thumb note ring until the next one."],
};
const UNIT_RH = {
  u1: { stroke: "Free stroke (tirando) for i, m, a: the finger plucks and follows through into the air above the next string. The thumb plays a light rest stroke: it pushes through and comes to rest on the next string down.", tips: ["Plant: touch the string with the fingertip (and nail, if you use nails) before you pluck — prepare, then push.", "Pluck from the big knuckle, not the fingertip joint; the hand stays still above the strings."] },
  u2: { stroke: "Thumb: downward light rest stroke (or free stroke) on the bass; i and m: free stroke upward into the palm. Steel string: use the flesh plus a little nail, or a thumb pick.", tips: ["The thumb never stops: root – fifth – root – fifth on every beat. Fingers fit into the off-beats.", "Palm-mute the bass very lightly with the heel of the hand near the bridge for the classic Travis thump (optional)."] },
  u3: { stroke: "A pinch is p and a finger plucking at the same instant, squeezing towards each other like picking up a coin. Both free stroke.", tips: ["Thumb and finger must land exactly together — listen for one sound, not a flam.", "Don’t lift the hand to pinch: the motion is in the thumb and finger only."] },
  u4: { stroke: "Boom: thumb rest stroke on the bass. Chuck: the back of the index nail brushes down (toward the floor) across strings 1–3 — a flick from the finger, not the wrist.", tips: ["Keep the brush light and short — only the top three strings.", "On the melody-in-bass tunes the thumb plays every melody note; i brushes in between."] },
  u5: { stroke: "Free strokes throughout. Forward roll p–i–m, clawhammer-style ‘bum-ditty’: brush down with the back of the nail, then thumb.", tips: ["Rolls: every finger the same volume — count the roll out loud.", "Bum-ditty brush is a downward flick of the index nail (frailing motion), the thumb then catches the next note."] },
  u6: { stroke: "Thumb keeps a steady alternating bass (rest or free stroke); the melody finger (usually i or m, a on the 1st string) plays slightly louder.", tips: ["Melody louder than the accompaniment: dig the melody finger in a little more.", "When the melody lands on the beat it pinches with the thumb."] },
  u7: { stroke: "Same alternating thumb; the slurred note gets no right-hand pluck — the left hand makes it.", tips: ["Don’t pluck the hammered or pulled note — let the left hand do it.", "Keep the thumb steady through the slur; the slur fits in the eighth between thumb notes."] },
  u8: { stroke: "Thumb alternates root and fifth on the two lowest open strings; brushes with i downward.", tips: ["Retuned low strings are slacker — use a lighter thumb so they don’t flap or buzz."] },
  u9: { stroke: "Alternating-bass thumb with melody pinched on top; melody finger free stroke, a little louder than the bass.", tips: ["Play the melody alone with the fingers first, then the bass alone with the thumb, then together slowly."] },
  u10: { stroke: "Either a flatpick with strict alternate picking (down on the beat, up on the ‘and’), or fingers: p on the root and fifth, i and m on the higher notes — both shown below.", tips: ["Pick: tiny motions, from the wrist, pick nearly parallel to the strings; the palm rests lightly on strings 6–5 by the bridge.", "Fingers: p plays the 6th/5th string notes, i the 9th, m the 3rd. Free stroke, light and even.", "Let every note ring — no accents except a soft lean on beat 1."] },
  u11: { stroke: "Classical technique with nails. Thumb: rest stroke (apoyando) on the melody where you can, so it sings; i and m: free stroke (tirando) on the open B, strictly alternating.", tips: ["Plant the next finger on the B string while the other plucks — the pedal becomes a small, even motion.", "Keep the hand still; the thumb moves from the big joint at the wrist, fingers from the big knuckles.", "Nails: shaped and polished, play on the left side of the nail (for right-handed players) for a round tone."] },
};
const LESSON_RH = {
  "ast-rasgueado": { stroke: "Rasgueado: curl a, m, i into the palm with the thumb resting on the 6th string (or the soundboard), then flick them out one after another — a, m, i — each fingernail striking down across the strings. The wrist stays still; only the fingers open.", tips: ["Start with i alone (a single down-flick), then a-m-i slowly so you hear three separate strikes, then speed them into a ripple.", "Aim to start on the 6th string so the bass (E or B) sounds first.", "Strike with the nail backs, moving the fingers from the middle knuckle."], flick: true },
  "ast-tremolo": { stroke: "Strict i–m alternation on the open B, free stroke, small motions from the big knuckle. The thumb, when it returns, plays rest stroke.", tips: ["Start with the metronome on every note; volume identical for i and m.", "Practise m–i too, so neither finger becomes the ‘strong’ one."] },
  "u4-brush": { stroke: "Boom (thumb rest stroke on the bass) then chuck (the back of the index nail brushes down across strings 1–3).", tips: ["The brush is a flick of the index finger outward — don’t move the wrist."] },
};

function stepsOf(lesson) {
  const { v1, v2 } = parseLesson(lesson);
  return v1.map((bar, bi) => {
    const at = new Map();
    const add = (voice) => { let t = 0; for (const ev of voice) { if (!ev.rest) { const k = Math.round(t * 2); const cur = at.get(k) || { t, notes: [], brush: false }; cur.notes.push(...ev.notes); cur.brush = cur.brush || ev.brush; at.set(k, cur); } t += ev.dur; } };
    add(bar); if (v2 && v2[bi]) add(v2[bi]);
    return [...at.values()].sort((a, b) => a.t - b.t);
  });
}
function beatLabel(t) {
  const beat = Math.floor(t / 2) + 1, r = t - (beat - 1) * 2;
  if (Math.abs(r) < 1e-6) return String(beat);
  if (Math.abs(r - 1) < 1e-6) return "&";
  if (Math.abs(r - 0.5) < 1e-6) return "e";
  if (Math.abs(r - 1.5) < 1e-6) return "a";
  return "";
}
function pickBar(bars) {
  let best = 0, score = -1;
  bars.forEach((b, i) => { const s = new Set(b.flatMap((st) => st.notes.map((n) => n.rf))).size * 10 + b.length; if (s > score) { score = s; best = i; } });
  return best;
}

function fretted(lesson) {
  const { v1, v2 } = parseLesson(lesson);
  const out = [];
  [v1, v2].forEach((bars) => bars && bars.forEach((bar, bi) => bar.forEach((ev) => { if (!ev.rest) for (const n of ev.notes) out.push({ ...n, bar: bi + 1, chord: ev.notes.length > 2 }); })));
  return out;
}

function positions(lesson, notes) {
  const seq = notes.filter((n) => n.f > 0 && n.lf > 0).sort((a, b) => a.bar - b.bar);
  const lines = [];
  let prev = null;
  for (const n of seq) {
    const pos = n.f - n.lf + 1;
    if (prev && pos !== prev.pos && Math.abs(pos - prev.pos) >= 2) {
      const guide = prev.n.lf === n.lf && prev.n.s === n.s ? ` — slide finger ${n.lf} along the ${ORD[n.s]} string as a guide finger` : n.f === 0 ? "" : ` — land finger ${n.lf} on the ${ORD[n.s]} string, fret ${n.f}`;
      lines.push(`Bar ${n.bar}: shift from position ${ROM[Math.max(prev.pos, 1)]} to ${ROM[Math.max(pos, 1)]}${guide}.`);
    }
    prev = { pos, n };
  }
  const ps = [...new Set(seq.map((n) => Math.max(1, n.f - n.lf + 1)))];
  return { lines: [...new Set(lines)].slice(0, 8), main: ps };
}

function barTable(lesson, notes) {
  const t = TUNINGS[lesson.tuning] || TUNINGS.standard;
  const byBar = new Map();
  for (const n of notes) { if (n.rf === "x") continue; const k = n.bar; const arr = byBar.get(k) || []; const key = `${n.s}.${n.f}`; if (!arr.some((q) => q.key === key)) arr.push({ ...n, key }); byBar.set(k, arr); }
  return [...byBar.entries()].sort((a, b) => a[0] - b[0]).map(([bar, arr]) => `<li><b>Bar ${bar}:</b> ${arr.map((n) => {
    const nm = spell(midiOf(t, n.s, n.f)).name;
    return n.f === 0 ? `${nm} open ${ORD[n.s]}` : `${nm} = ${ORD[n.s]} str. fret ${n.f}, ${n.lf ? "finger " + n.lf : "any finger"}`;
  }).join(" · ")}</li>`).join("");
}

export function chordTeachHTML(id, neighbours = []) {
  const ch = CHORD_LIB[id];
  if (!ch) return "";
  const drills = neighbours.filter((b) => b && b !== id && CHORD_LIB[b]).map((b) => {
    const tr = transition(id, b), nb = CHORD_LIB[b];
    const bits = [];
    if (tr.allSlide) bits.push(`same grip — slide the whole frozen shape ${heldDir(id, b)}`);
    else {
      if (tr.anchors.length) bits.push(`keep ${[...new Set(tr.anchors.map((a) => "finger " + a.finger))].join(" and ")} down (anchor)`);
      if (tr.guides.length) bits.push(tr.guides.map((g) => `slide finger ${g.finger} along the ${ORD[g.s]} string from fret ${g.from} to ${g.f}`).join("; "));
      if (tr.moves.length) bits.push(`move ${[...new Set(tr.moves.map((m) => m.finger))].sort().map((f) => "finger " + f).join(", ")} together as one shape`);
    }
    return `<li><b>${esc(ch.short)} → ${esc(nb.short)}:</b> ${bits.join("; ") || "lift and land all fingers together"}. Drill: 4 beats on ${esc(ch.short)}, change on the last “&”, 4 beats on ${esc(nb.short)}, and back — 1 minute, count clean changes, beat it tomorrow.</li>`;
  }).join("");
  return `<div class="chord-teach"><div class="chord-fig">${chordBoxSVG(id)}</div><div class="chord-text">
    <b>How to play ${esc(ch.name)}</b><ol>${ch.order.map((o) => `<li>${esc(o)}</li>`).join("")}</ol>
    ${ch.mistakes && ch.mistakes.length ? `<b>Common mistakes</b><ul>${ch.mistakes.map((m) => `<li>${esc(m)}</li>`).join("")}</ul>` : ""}
    ${drills ? `<b>Transition drill</b><ul>${drills}</ul>` : ""}</div></div>`;
}
function heldDir(a, b) {
  const A = CHORD_LIB[a], B = CHORD_LIB[b];
  const fa = A.frets.find((f) => f !== "x" && f > 0), fb = B.frets.find((f) => f !== "x" && f > 0);
  const d = fb - fa;
  return d > 0 ? `${d} fret${d > 1 ? "s" : ""} up (toward the body)` : `${-d} fret${d < -1 ? "s" : ""} down (toward the headstock)`;
}

export function handsHTML(lesson) {
  const notes = fretted(lesson);
  const chords = chordsOf(lesson), seq = chordSequence(lesson);
  const fing = notes.filter((n) => n.f >= 0 && n.rf !== "x");
  const single = fing.filter((n) => !n.chord);
  const pos = positions(lesson, notes);
  const lhTips = [...(UNIT_LH[lesson.unit] || []), ...(lesson.lhTips || []), ...(lesson.unit === "u11" ? [] : STEEL_LH)];
  const onlyOpen = !notes.some((n) => n.f > 0);
  const chordHTML = chords.map((c) => { const i = seq.indexOf(c); return chordTeachHTML(c, [seq[i - 1], seq[i + 1]].filter(Boolean)); }).join("");
  const lh = `<details class="hands" open><summary><h3>🤚 Left hand</h3></summary>
    ${onlyOpen ? `<p class="small">Open strings only — no left-hand fingers in this lesson.</p>` : `
    <p class="small muted">Dots = where each fingertip goes; the number is the left-hand finger (1 index · 2 middle · 3 ring · 4 little). ○ = open string, × = don’t play it.</p>
    ${chords.length ? `<h4>Chords in this lesson</h4>${chordHTML}` : ""}
    ${single.some((n) => n.f > 0) ? `<h4>Single notes on the neck</h4><div class="diag-scroll">${neckSVG(single, { tuning: lesson.tuning, label: "Notes in this lesson with finger numbers" })}</div>
    <p class="small muted">Tab view: string 1 (high e) on top. Each dot is a note in the lesson, with its finger.</p>` : ""}
    ${pos.main.length ? `<p class="small"><b>Position${pos.main.length > 1 ? "s" : ""}:</b> ${pos.main.map((p) => ROM[p]).join(", ")} (position = the fret under finger 1).</p>` : ""}
    ${pos.lines.length ? `<b class="small">Shifts</b><ul class="small">${pos.lines.map((l) => `<li>${esc(l)}</li>`).join("")}</ul>` : ""}
    <details class="small"><summary>Note-by-note fingering, bar by bar</summary><ul class="small">${barTable(lesson, fing)}</ul></details>`}
    <b class="small">Technique</b><ul class="small">${lhTips.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></details>`;

  const bars = stepsOf(lesson);
  const bi = pickBar(bars);
  const rhInfo = LESSON_RH[lesson.id] || UNIT_RH[lesson.unit] || UNIT_RH.u1;
  const steps = bars[bi].map((st) => ({ ...st, beat: beatLabel(st.t), flick: rhInfo.flick && st.brush }));
  const uses = {};
  for (const n of notes) if (n.rf && n.rf !== "x") (uses[n.rf] ||= new Set()).add(n.s);
  const assign = ["p", "i", "m", "a"].filter((f) => uses[f]).map((f) => `<li><b style="color:var(--${f})">${RNAME[f]}</b> → string${uses[f].size > 1 ? "s" : ""} ${[...uses[f]].sort((a, b) => b - a).join(", ")}</li>`).join("");
  const handEv = { onsets: Object.entries(uses).flatMap(([rf, ss]) => [...ss].map((s) => ({ rf, s }))) };
  const pick = lesson.unit === "u10";
  const pickSteps = pick ? steps.map((st) => ({ ...st, stroke: Math.abs(st.t % 2) < 1e-6 ? "↓" : "↑" })) : null;
  const seqTxt = steps.map((st) => st.brush ? (st.flick ? "rasg." : "brush") : st.notes.map((n) => n.rf).join("+")).join(" ");
  const rh = `<details class="hands" open><summary><h3>✋ Right hand</h3></summary>
    <div class="hand-grid"><div class="diag">${handSVG(handEv)}</div><div><b class="small">Which finger plays which string</b><ul class="small">${rhInfo.flick ? `<li>Rasgueado: <b>a, m, i</b> fingernails flick out across all six strings, starting from the 6th; thumb anchored on the 6th string or the top.</li>` : assign}</ul></div></div>
    <h4>Pattern (bar ${bi + 1})</h4><div class="diag-scroll">${rhPatternSVG(steps)}</div>
    <p class="small"><b>Sequence:</b> ${esc(seqTxt)}</p>
    ${pick ? `<h4>Same bar with a pick</h4><div class="diag-scroll">${rhPatternSVG(pickSteps, { pick: true })}</div><p class="small muted">Strict alternate picking: down on every beat, up on every “&”, even when crossing strings.</p>` : ""}
    <p class="small"><b>Stroke:</b> ${esc(rhInfo.stroke)}</p>
    <ul class="small">${rhInfo.tips.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></details>`;
  return lh + rh;
}
