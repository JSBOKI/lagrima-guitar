// Chord library: every chord shape used anywhere in the app, with left-hand fingering and a short lesson.
// frets: string 6 → 1 ("x" = muted / not played). fingers: same order, 0 = open or muted.
// barre: { fret, from, to } (from = lowest-pitched string, to = highest) is held by finger 1 unless finger is given.
// Fingerings match the tab in course-data.js (tests check this).

export const CHORD_LIB = {
  Em: { name: "E minor", short: "Em", tuning: "standard", frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0],
    order: ["Finger 2 on the 5th string, fret 2.", "Finger 3 on the 4th string, fret 2, right beside it.", "Strum or pluck all six strings — four of them are open."],
    mistakes: ["Fingers lying flat and touching the open 3rd string — come down on the very tips.", "Pressing in the middle of the fret instead of just behind the fret wire."] },
  E: { name: "E major", short: "E", tuning: "standard", frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0],
    order: ["Finger 1 on the 3rd string, fret 1 (G♯ — the note that makes it major).", "Finger 2 on the 5th string, fret 2.", "Finger 3 on the 4th string, fret 2."],
    mistakes: ["Finger 1 leaning on the open 2nd string and choking it — arch the knuckle.", "Forgetting finger 1: without the G♯ it is E minor."] },
  Am: { name: "A minor", short: "Am", tuning: "standard", frets: ["x", 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0],
    order: ["Finger 1 on the 2nd string, fret 1.", "Finger 2 on the 4th string, fret 2.", "Finger 3 on the 3rd string, fret 2.", "Pluck from the open 5th string — skip the low E."],
    mistakes: ["Playing the open 6th string: it is an E under the chord and sounds muddy in an alternating bass.", "Finger 3 touching the open 1st string."] },
  A: { name: "A major", short: "A", tuning: "standard", frets: ["x", 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0],
    order: ["Fingers 1 · 2 · 3 in a row on the 4th, 3rd and 2nd strings, all at fret 2.", "Angle the fingers slightly so finger 3 doesn’t smother the open 1st string."],
    mistakes: ["Three fingers crammed into one fret can’t all sit behind the wire — stagger them (1 furthest back, 3 nearest the fret).", "Open 1st string muted by finger 3."] },
  C: { name: "C major", short: "C", tuning: "standard", frets: ["x", 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0],
    order: ["Finger 1 on the 2nd string, fret 1.", "Finger 2 on the 4th string, fret 2.", "Finger 3 on the 5th string, fret 3 (the root C).", "For the alternating bass add finger 4 on the 6th string, fret 3 (low G)."],
    mistakes: ["Finger 1 lying flat and muting the open 1st string.", "Hitting the open 6th string (E) instead of the fretted G for the bass."] },
  G: { name: "G major", short: "G", tuning: "standard", frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 4],
    order: ["Finger 2 on the 6th string, fret 3 (root).", "Finger 1 on the 5th string, fret 2.", "Finger 4 on the 1st string, fret 3 (finger 3 also works; the course uses 4 so 3 stays free for C).", "Strings 4, 3 and 2 ring open."],
    mistakes: ["Finger 1 touching the open 4th string — that open D is the alternating-bass fifth.", "Collapsing the wrist: keep the thumb behind the neck so finger 4 can reach the 1st string."] },
  D: { name: "D major", short: "D", tuning: "standard", frets: ["x", "x", 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2],
    order: ["Finger 1 on the 3rd string, fret 2.", "Finger 2 on the 1st string, fret 2.", "Finger 3 on the 2nd string, fret 3 — the three fingertips make a small triangle.", "Bass is the open 4th (root) and open 5th (fifth); keep the 6th string quiet."],
    mistakes: ["Strumming/plucking the 6th string — E under a D chord.", "Finger 3 too far from the fret, giving a buzzy D on the 2nd string."] },
  Dm: { name: "D minor", short: "Dm", tuning: "standard", frets: ["x", "x", 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1],
    order: ["Finger 1 on the 1st string, fret 1 (F — the minor third).", "Finger 2 on the 3rd string, fret 2.", "Finger 3 on the 2nd string, fret 3."],
    mistakes: ["Finger 1 flattening onto the 2nd string.", "Thinking of it as a moved D shape and grabbing fret 2 on the 1st string — that is D major."] },
  F: { name: "F major (full barre)", short: "F", tuning: "standard", frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], barre: { fret: 1, from: 6, to: 1 },
    order: ["Lay finger 1 across all six strings at fret 1, rolled slightly onto its bony (thumb-side) edge, right behind the fret wire.", "Finger 2 on the 3rd string, fret 2.", "Finger 3 on the 5th string, fret 3; finger 4 on the 4th string, fret 3.", "Thumb low behind the neck, roughly opposite finger 2; pull back with the arm weight rather than squeezing."],
    mistakes: ["Squeezing with the thumb until it hurts — use arm weight, and only press as hard as the buzz requires.", "Barre falling into the finger creases on strings 2–3: shift finger 1 up or down a few millimetres until a hard part sits on them.", "Can’t do it yet? Play the small F (xx3211: finger 1 barres strings 1–2 at fret 1, 2 on the 3rd string, 3 on the 4th string fret 3)."] },
  Ddrop: { name: "D major in drop D", short: "D (drop D)", tuning: "dropd", frets: [0, 0, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2],
    order: ["The normal D triangle: finger 1 on 3rd string fret 2, finger 3 on 2nd string fret 3, finger 2 on 1st string fret 2.", "The low 6th string, tuned down to D, is now the root — play it open."],
    mistakes: ["Forgetting to retune: check the open 6th against the open 4th — an octave apart."] },
  Gopen: { name: "G major in open G", short: "G (open G)", tuning: "openg", frets: [0, 0, 0, 0, 0, 0], fingers: [0, 0, 0, 0, 0, 0],
    order: ["No fingers — the open strings are the chord (D G D G B D).", "Rest the left hand lightly on the neck if you need to damp it."],
    mistakes: ["Tuning drift: re-check string 5 against string 3 (an octave)."] },
  Copeng: { name: "C major in open G (barre V)", short: "C (open G)", tuning: "openg", frets: [5, 5, 5, 5, 5, 5], fingers: [1, 1, 1, 1, 1, 1], barre: { fret: 5, from: 6, to: 1 },
    order: ["Finger 1 straight across all six strings at fret 5, just behind the wire.", "Thumb behind the neck under finger 1; let the arm’s weight pull the barre in."],
    mistakes: ["Barre slanted so the 1st string buzzes — keep the finger parallel to the fret.", "Pressing too hard: a one-finger barre needs only enough pressure to stop the buzz."] },
  Dopeng: { name: "D major in open G (barre VII)", short: "D (open G)", tuning: "openg", frets: [7, 7, 7, 7, 7, 7], fingers: [1, 1, 1, 1, 1, 1], barre: { fret: 7, from: 6, to: 1 },
    order: ["The same one-finger barre, moved two frets up to fret 7 (the double dot is at 12, single at 7)."],
    mistakes: ["Lifting the barre completely between C and D — slide it with light contact instead."] },
  Dopend: { name: "D major in open D", short: "D (open D)", tuning: "opend", frets: [0, 0, 0, 0, 0, 0], fingers: [0, 0, 0, 0, 0, 0],
    order: ["No fingers — the open strings are D A D F♯ A D."], mistakes: ["Tuning drift on the 3rd string (F♯): check it against the 4th string, fret 4."] },
  Aopend: { name: "A major in open D (barre VII)", short: "A (open D)", tuning: "opend", frets: [7, 7, 7, 7, 7, 7], fingers: [1, 1, 1, 1, 1, 1], barre: { fret: 7, from: 6, to: 1 },
    order: ["Finger 1 across all six strings at fret 7."], mistakes: ["Barre too far from the fret wire — buzz on the treble strings."] },
  // Every Breath You Take: stretched add9 grips (original key A♭, no capo).
  Abadd9: { name: "A♭ add9", short: "A♭add9", tuning: "standard", frets: [4, 6, 8, 5, "x", "x"], fingers: [1, 3, 4, 2, 0, 0],
    order: ["Finger 1 on the 6th string, fret 4 (A♭, root).", "Finger 2 on the 3rd string, fret 5 (C, third).", "Finger 3 on the 5th string, fret 6 (E♭, fifth).", "Finger 4 stretches to the 4th string, fret 8 (B♭, the 9th). Drop the thumb low behind the neck and bring the elbow in to open the hand.", "Mute the 2nd and 1st strings by letting the underside of finger 2/3 touch them lightly."],
    mistakes: ["Skipping the 9th because of the stretch — practise the shape at frets 7–11 first, then move it down.", "Finger 2 arching over and muting the 4th string — come down on the tip."] },
  Fmadd9: { flats: true, name: "F minor add9", short: "Fm(add9)", tuning: "standard", frets: [1, 3, 5, 1, "x", "x"], fingers: [1, 3, 4, 1, 0, 0], barre: { fret: 1, from: 6, to: 3, partial: true },
    order: ["The A♭add9 grip slid down three frets.", "Finger 1 now covers the 6th string AND the 3rd string at fret 1 (a light partial barre — the 5th and 4th are fretted higher, so only those two need pressure).", "Finger 3 on 5th string fret 3, finger 4 on 4th string fret 5."],
    mistakes: ["Finger 1 not flat enough to reach the 3rd string — roll it slightly onto its side.", "Re-forming the chord from scratch instead of sliding the frozen shape."] },
  Dbadd9: { name: "D♭ add9", short: "D♭add9", tuning: "standard", frets: ["x", 4, 6, 8, 6, "x"], fingers: [0, 1, 3, 4, 2, 0],
    order: ["The same grip moved over one string set: finger 1 on the 5th string fret 4 (root).", "Finger 3 on the 4th string fret 6, finger 4 on the 3rd string fret 8 (9th), finger 2 on the 2nd string fret 6 (third).", "Tip of finger 1 touches the 6th string to keep it silent."],
    mistakes: ["The 6th string ringing under the chord — mute it with the fingertip of 1 or the thumb."] },
  Ebadd9: { name: "E♭ add9", short: "E♭add9", tuning: "standard", frets: ["x", 6, 8, 10, 8, "x"], fingers: [0, 1, 3, 4, 2, 0],
    order: ["D♭add9 slid up two frets: finger 1 on 5th string fret 6.", "Finger 3 on 4th string fret 8, finger 4 on 3rd string fret 10, finger 2 on 2nd string fret 8."],
    mistakes: ["Over-shooting the slide — look at the 7th-fret dot: finger 1 lands one fret before it."] },
  Gbadd9: { name: "G♭ add9", short: "G♭add9", tuning: "standard", frets: [2, 4, 6, 3, "x", "x"], fingers: [1, 3, 4, 2, 0, 0],
    order: ["The A♭add9 grip two frets lower: finger 1 on 6th string fret 2, finger 2 on 3rd string fret 3, finger 3 on 5th string fret 4, finger 4 on 4th string fret 6."],
    mistakes: ["The stretch is wider down here — keep the thumb low and the wrist forward."] },
  Fbadd9: { name: "F♭ add9 (sounds as E add9)", short: "F♭add9", tuning: "standard", frets: [0, 2, 4, 1, "x", "x"], fingers: [0, 2, 4, 1, 0, 0],
    order: ["The 6th string is open (E = F♭).", "Finger 1 on the 3rd string fret 1, finger 2 on the 5th string fret 2, finger 4 on the 4th string fret 4."],
    mistakes: ["Crossed fingers (2 on fret 1, 1 on fret 2) — keep one finger per fret: 1 on fret 1, 2 on fret 2."] },
  Gadd9: { name: "G add9 (open)", short: "Gadd9", tuning: "standard", frets: [3, "x", 0, 2, 0, "x"], fingers: [3, 0, 0, 2, 0, 0],
    order: ["Finger 3 on the 6th string fret 3; let its pad touch the 5th string to mute it.", "Finger 2 on the 3rd string fret 2 (A, the 9th).", "4th and 2nd strings open."],
    mistakes: ["5th string ringing — lean finger 3 onto it."] },
  Emadd9: { name: "E minor add9 (open)", short: "Em(add9)", tuning: "standard", frets: [0, 2, 4, 0, "x", "x"], fingers: [0, 2, 4, 0, 0, 0],
    order: ["Finger 2 on the 5th string fret 2.", "Finger 4 on the 4th string fret 4 (F♯, the 9th).", "6th and 3rd strings open."],
    mistakes: ["Finger 4 collapsing — keep it curved so the open 3rd string rings."] },
  Cadd9: { name: "C add9 (open)", short: "Cadd9", tuning: "standard", frets: ["x", 3, 2, 0, 3, "x"], fingers: [0, 3, 2, 0, 4, 0],
    order: ["Finger 3 on 5th string fret 3, finger 2 on 4th string fret 2.", "Finger 4 on the 2nd string fret 3 (D, the 9th).", "Open 3rd string in the middle."],
    mistakes: ["Muting the open 3rd string with finger 2 — arch it."] },
  Dadd9: { name: "D add9 (open)", short: "Dadd9", tuning: "standard", frets: ["x", 5, 4, 2, 3, 0], fingers: [0, 4, 3, 1, 2, 0],
    order: ["Finger 1 on the 3rd string fret 2 (A).", "Finger 2 on the 2nd string fret 3 (D).", "Finger 3 on the 4th string fret 4 (F♯, the third).", "Finger 4 on the 5th string fret 5 (D, root). The open 1st string (E) is the 9th.", "One finger per fret, frets 2–5: a small stretch, thumb low."],
    mistakes: ["Calling x x 0 2 3 0 “Dadd9” — that has no F♯, so it is Dsus2.", "Finger 1 leaning on the open 1st string."] },
  // Asturias (Segovia, E minor).
  BVII: { name: "B major at VII (Asturias)", short: "B (VII)", tuning: "standard", frets: [7, 9, 9, 8, 7, 7], fingers: [1, 3, 4, 2, 1, 1], barre: { fret: 7, from: 6, to: 1 },
    order: ["Finger 1 barres all six strings at fret 7.", "Finger 2 on the 3rd string fret 8.", "Finger 3 on the 5th string fret 9, finger 4 on the 4th string fret 9.", "It is the E-major barre shape with the barre at the 7th fret (B)."],
    mistakes: ["Barre too heavy: at the 7th fret strings are low — light pressure is enough.", "Finger 2 muting the 2nd string — arch it."] },
  BII: { name: "B major at II (Asturias copla)", short: "B (II)", tuning: "standard", frets: ["x", 2, 4, 4, 4, 2], fingers: [0, 1, 2, 3, 4, 1], barre: { fret: 2, from: 5, to: 1 },
    order: ["Finger 1 barres strings 5–1 at fret 2 (its tip mutes the 6th string).", "Fingers 2 · 3 · 4 on the 4th, 3rd and 2nd strings at fret 4, staggered so each is close to the wire."],
    mistakes: ["Finger 4 touching the 1st string so the high F♯ dies.", "Easier version: one finger 3 barring strings 4–2 at fret 4 (lift the joint off the 1st string)."] },
  GIII: { name: "G major at III (Asturias copla)", short: "G (III)", tuning: "standard", frets: [3, 5, 5, 4, 3, "x"], fingers: [1, 3, 4, 2, 1, 0], barre: { fret: 3, from: 6, to: 2 },
    order: ["Finger 1 barres strings 6–2 at fret 3.", "Finger 2 on the 3rd string fret 4.", "Finger 3 on the 5th string fret 5, finger 4 on the 4th string fret 5.", "The E-shape barre again, at fret 3."],
    mistakes: ["Using finger 3 twice (on 5th and 3rd strings) — it can’t be in two places; finger 2 takes fret 4."] },
};

/** Chords that each lesson uses (explicit list for lessons whose chords are plucked inside the tab). */
export const LESSON_SHAPES = {
  "ast-tremolo": ["BVII"],
  "ast-copla": ["BII", "GIII"],
  "ast-rasgueado": ["Em", "BVII"],
};

/** Chord ids used by a lesson, in order of first appearance. */
export function chordsOf(lesson) {
  const list = [].concat(lesson.chords || [], LESSON_SHAPES[lesson.id] || []);
  return [...new Set(list)].filter((c) => CHORD_LIB[c]);
}

/** Distinct chord sequence (for transition drills). */
export function chordSequence(lesson) {
  const list = [].concat(lesson.chords || [], LESSON_SHAPES[lesson.id] || []).filter((c) => CHORD_LIB[c]);
  return list.filter((c, i) => i === 0 || c !== list[i - 1]);
}

/** Notes held by fingers: [{s, f, finger}] for a chord. */
export function heldNotes(ch) {
  const out = [];
  ch.frets.forEach((f, i) => { const s = 6 - i; if (f !== "x" && f > 0) out.push({ s, f, finger: ch.fingers[i] }); });
  return out;
}

/** How to change from chord a to chord b: anchors (stay down), guides (slide along a string), and the rest. */
export function transition(aId, bId) {
  const a = CHORD_LIB[aId], b = CHORD_LIB[bId];
  const A = heldNotes(a), B = heldNotes(b);
  const anchors = [], guides = [], moves = [];
  for (const n of B) {
    const same = A.find((m) => m.finger === n.finger && m.s === n.s && m.f === n.f);
    const slide = A.find((m) => m.finger === n.finger && m.s === n.s && m.f !== n.f);
    if (same) anchors.push(n); else if (slide) guides.push({ ...n, from: slide.f }); else moves.push(n);
  }
  const allSlide = A.length && A.length === B.length && B.every((n) => A.some((m) => m.finger === n.finger && m.s === n.s)) && new Set(B.map((n) => n.f - A.find((m) => m.finger === n.finger && m.s === n.s).f)).size === 1;
  return { anchors, guides, moves, allSlide };
}
