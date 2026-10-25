// Instrument switch: Guitar | Guitarlele (A D G C E A = guitar with a capo at fret 5, sounds a 4th higher).
// The choice lives in localStorage. Toggling reloads the page; this module runs before the rest of the app and
// rewrites the song data in place, so every view (score, tab, diagrams, note names, text) follows automatically.
// Guitarlele arrangements roll out song by song — see PLAN-guitarlele.md. Songs not yet arranged show
// “Guitarlele version coming soon” and keep the guitar version.
import { TUNINGS, SHARP, FLAT } from "./notes.js";
import { MEASURES } from "./data.js";
import { CHORDS, LESSONS } from "./course-data.js";
import { CHORD_LIB } from "./chordlib.js";

export const KEY_INST = "gc-instrument";
const KEY_MODE = "gc-lele-mode-";
const ls = () => { try { return globalThis.localStorage || null; } catch { return null; } };
const get = (k) => { try { return ls() ? ls().getItem(k) : null; } catch { return null; } };
const set = (k, v) => { try { ls() && ls().setItem(k, v); } catch {} };

TUNINGS.guitarlele = { id: "guitarlele", name: "Guitarlele", label: "A D G C E A", open: { 1: 69, 2: 64, 3: 60, 4: 55, 5: 50, 6: 45 }, alpha: "A4 E4 C4 G3 D3 A2" };
export const G_OPEN = { ...TUNINGS.standard.open };
export const L_OPEN = { ...TUNINGS.guitarlele.open };

/** Songs with a guitarlele arrangement so far, and the mode that keeps each one musically correct. */
export const SONGS = {
  lagrima: { title: "Lágrima", def: "shapes", why: "Lágrima’s open-string bass (low E, the open B drone) only works with the guitar fingering, so the default keeps the guitar shapes and the piece sounds a 4th higher, in A major / A minor. “Match original key” keeps E major / E minor, but the low bass notes go up an octave and the fingering changes." },
  ebyt: { title: "Every Breath You Take", def: "key", why: "This is a play-along song, so the default matches the record’s key (A♭). The grips are the same stretched add9 shapes you know from guitar, moved to other strings/frets." },
};
export function songOfLesson(l) { return l && l.unit === "u10" ? "ebyt" : null; }

export const instrument = () => (get(KEY_INST) === "guitarlele" ? "guitarlele" : "guitar");
export const isLele = () => instrument() === "guitarlele";
export const modeOf = (song) => { const v = get(KEY_MODE + song); return v === "shapes" || v === "key" ? v : SONGS[song] ? SONGS[song].def : "shapes"; };
export function setInstrument(v) { set(KEY_INST, v === "guitarlele" ? "guitarlele" : "guitar"); }
export function setMode(song, m) { set(KEY_MODE + song, m === "key" ? "key" : "shapes"); }

/** Open-string MIDI and string letters for the Lágrima views. */
export const lagOpen = () => (isLele() ? L_OPEN : G_OPEN);
export const strLetters = () => (isLele() ? ["A", "E", "C", "G", "D", "A"] : ["e", "B", "G", "D", "A", "E"]); // string 1..6

/* ---------------- Text transposition (note names move with the instrument) ---------------- */
// Note names followed by chord-quality text or punctuation. Bare “A” before a lower-case word is an article
// unless that word is string/major/minor/chord/shape/bass/note (then it is a note name).
const NOTE_RE = /(^|[^A-Za-z])([A-G])([♯♭#]?)(?!(?!add|m)[A-Za-z])/g;
const LETTER_PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
export function transposeName(letter, acc, semis, flats = false) {
  let pc = LETTER_PC[letter] + (acc === "♯" || acc === "#" ? 1 : acc === "♭" ? -1 : 0);
  pc = (((pc + semis) % 12) + 12) % 12;
  if (!flats && acc !== "♭" && (pc === 10 || pc === 3)) return FLAT[pc]; // B♭/E♭ read better than A♯/D♯ here
  return (flats || acc === "♭" ? FLAT : SHARP)[pc];
}
export function transposeText(s, semis, flats = false) {
  if (!s || !semis) return s;
  return s.replace(NOTE_RE, (all, pre, L, acc, off, str) => {
    const before = str.slice(0, off + pre.length), after = str.slice(off + all.length);
    if (L === "A" && !acc && /^ [a-z]/.test(after) && !/^ (string|major|minor|chord|shape|bass|note|add9|on the)/.test(after)) return all; // article
    if (L === "A" && !acc && /^ section/.test(after)) return all;
    if (/^\.[A-Z]\./.test(after) || /D\.$/.test(before)) return all; // D.C.
    return pre + transposeName(L, acc, semis, flats);
  });
}

/* ---------------- Lágrima ---------------- */
export const LAG_FLAGS = []; // human-readable list of simplifications (key mode)
function lagShapes() {
  // Same frets, guitarlele strings: every note sounds exactly 5 semitones higher. Text note names follow.
  for (const M of MEASURES) {
    M.key = M.key; // key letter is transposed by texgen/ui via lagKeyName()
    M.lh = transposeText(M.lh, 5); M.rh = transposeText(M.rh, 5);
    if (M.flag) M.flag = transposeText(M.flag, 5);
  }
}
/** Same pitch on guitarlele: re-string each note (fret − 5 on the same string where possible). Notes below the
 *  guitarlele’s low A2 go up an octave and are flagged. Notes sounding together never share a string. */
function lagKey() {
  const ring = []; // {s, until, n}
  for (const M of MEASURES) {
    const flags = [];
    const out = [];
    const slots = [...new Set(M.notes.map((t) => t[0]))].sort((a, b) => a - b);
    const prevAssign = new Map(); // original "s.f" -> new [s,f] for ties
    for (const slot of slots) {
      const grp = M.notes.filter((t) => t[0] === slot);
      const busy = new Set(ring.filter((r) => r.m === M.n && r.start < slot && r.until > slot).map((r) => r.s));
      const cands = grp.map((t) => {
        let midi = G_OPEN[t[2]] + t[3], oct = false;
        if (midi < 45) { midi += 12; oct = true; }
        const opts = [];
        for (let s = 1; s <= 6; s++) { const f = midi - L_OPEN[s]; if (f >= 0 && f <= 12) opts.push({ s, f, cost: (s === t[2] ? 0 : 2) + (f > 7 ? f - 7 : 0) + Math.abs(s - t[2]) * 0.5 }); }
        const tie = t[7] && t[7].t ? prevAssign.get(t[2] + "." + t[3]) : null;
        return { t, midi, oct, opts: tie ? opts.filter((o) => o.s === tie[0]) : opts };
      });
      let best = null;
      const rec = (i, used, acc, cost) => {
        if (best && cost >= best.cost) return;
        if (i === cands.length) { best = { cost, acc: acc.slice() }; return; }
        for (const o of cands[i].opts) { if (used.has(o.s)) continue; used.add(o.s); acc.push(o); rec(i + 1, used, acc, cost + o.cost); acc.pop(); used.delete(o.s); }
      };
      rec(0, busy, [], 0);
      if (!best) { rec(0, new Set(), [], 0); flags.push(`beat slot ${slot}: a held note is cut short`); }
      cands.forEach((c, i) => {
        const o = best.acc[i]; const t = c.t; const ex = { ...(t[7] || {}) };
        let lf = o.f === 0 ? 0 : o.s === t[2] && t[4] > 0 ? t[4] : Math.max(1, Math.min(4, o.f <= 4 ? o.f : ((o.f - 1) % 4) + 1));
        if (!(o.s === t[2] && t[4] > 0) && o.f > 0) ex.s = 1;
        if (c.oct) { flags.push(`${spellPc(c.midi)} bass (guitar ${t[2] === 6 ? "low E string" : "string " + t[2]}${t[3] ? " fret " + t[3] : " open"}) is below the guitarlele’s range — played an octave higher`); ex.s = 1; }
        prevAssign.set(t[2] + "." + t[3], [o.s, o.f]);
        out.push([t[0], t[1], o.s, o.f, lf, t[5], t[6], ex, c.midi, c.oct]);
        ring.push({ m: M.n, s: o.s, start: t[0], until: t[0] + t[6] });
      });
    }
    // Slurs/slides only survive if both notes stay on one string.
    for (const n of out) {
      if (n[7].h || n[7].sl) {
        const nxt = out.find((q) => q[0] > n[0] && q[1] === n[1]);
        if (!nxt || nxt[2] !== n[2]) { delete n[7].h; delete n[7].sl; flags.push("a slur/slide is plucked instead (the notes are on different strings)"); }
      }
    }
    M.glCheck = out.map((n) => ({ midi: n[8], oct: n[9] }));
    M.notes = out.map((n) => (Object.keys(n[7]).length ? n.slice(0, 8) : n.slice(0, 7)));
    if (M.barres && M.barres.length) { M.barres = []; flags.push("the guitar barre does not apply — follow the tab"); }
    const uniq = [...new Set(flags)];
    if (uniq.length) LAG_FLAGS.push({ n: M.n, flags: uniq });
    const desc = M.notes.map((t) => `${spellPc(L_OPEN[t[2]] + t[3])} ${t[3] === 0 ? "open " + t[2] : "str " + t[2] + " fret " + t[3]}`);
    M.lh = `Guitarlele, original key: ${[...new Set(desc)].join(" · ")}. Fingering here is a computer-suggested re-fingering (marked s) — the guitar edition’s fingering does not transfer.` + (uniq.length ? " Simplified: " + uniq.join("; ") + "." : "");
    M.rh = M.rh.replace(/open B/g, "B (now fretted: 4th string, fret 4)") + " On guitarlele the strings differ from guitar — follow the tab for which string each finger plucks.";
    M.flag = M.flag || null;
  }
}
const spellPc = (m) => SHARP[((m % 12) + 12) % 12];
export function lagKeyName(k) { return isLele() && modeOf("lagrima") === "shapes" ? (k === "E" ? "A" : "aminor") : (k === "E" ? "E" : "eminor"); }
export function lagKeyLabel() { return isLele() && modeOf("lagrima") === "shapes" ? "sounds in A major / A minor (a 4th higher)" : "E major / E minor"; }

/* ---------------- Every Breath You Take ---------------- */
// Guitarlele chord shapes. frets: low string (6) → high string (1), same as the guitar library.
// gls_* = guitar grip as-is on guitarlele (sounds a 4th higher). glk_* = sounds in the original key.
const GL_SRC = ["Abadd9", "Fmadd9", "Dbadd9", "Ebadd9", "Gbadd9", "Fbadd9", "Gadd9", "Emadd9", "Cadd9", "Dadd9"];
const KEY_SHAPES = {
  // id: [frets 6..1, fingers 6..1, rootAt, fifthAt, guitar grip it copies, note]
  Abadd9: [["x", 6, 8, 10, 8, "x"], [0, 1, 3, 4, 2, 0], { s: 5, f: 6 }, { s: 4, f: 8 }, "the guitar E♭add9 grip", "Root A♭ on the 5th string (D) at fret 6 — the bass is an octave above the record because the guitarlele has no low A♭."],
  Fmadd9: [["x", 3, 5, 7, 4, "x"], [0, 1, 3, 4, 2, 0], { s: 5, f: 3 }, { s: 4, f: 5 }, "the guitar Cm(add9) grip", "Root F on the 5th string fret 3; the A♭ (minor 3rd) is the 2nd string fret 4. Bass an octave above the record."],
  Dbadd9: [[4, 6, 8, 5, "x", "x"], [1, 3, 4, 2, 0, 0], { s: 6, f: 4 }, { s: 5, f: 6 }, "the guitar A♭add9 grip", "Exactly the guitar A♭add9 grip — on guitarlele it sounds D♭, in the same octave as the record."],
  Ebadd9: [[6, 8, 10, 7, "x", "x"], [1, 3, 4, 2, 0, 0], { s: 6, f: 6 }, { s: 5, f: 8 }, "the guitar B♭add9 grip", "The same 6th-string grip two frets higher than D♭add9. Same octave as the record."],
  Gbadd9: [["x", 4, 6, 8, 6, "x"], [0, 1, 3, 4, 2, 0], { s: 5, f: 4 }, { s: 4, f: 6 }, "the guitar D♭add9 grip", "5th-string grip at fret 4. Bass an octave above the record."],
  Fbadd9: [["x", 2, 4, 6, 4, "x"], [0, 1, 3, 4, 2, 0], { s: 5, f: 2 }, { s: 4, f: 4 }, "the guitar Badd9 grip", "Sounds F♭ (= E) add9; 5th-string grip at fret 2. Bass an octave above the record."],
  Gadd9: [["x", "x", 0, 2, 5, 2], [0, 0, 0, 1, 4, 2], { s: 4, f: 0 }, { s: 3, f: 2 }, "a D-shape-style grip", "Open G string is the root; the whole beginner riff sits an octave above the guitar version."],
  Emadd9: [["x", 2, 4, 6, 3, "x"], [0, 1, 3, 4, 2, 0], { s: 5, f: 2 }, { s: 4, f: 4 }, "the guitar Bm(add9) grip — the same stretch as A♭add9", "Root E on the 5th string fret 2. Same 1-3-4-2 stretch as the guitar Em(add9)."],
  Cadd9: [[3, "x", 0, 2, 0, "x"], [3, 0, 0, 2, 0, 0], { s: 6, f: 3 }, { s: 4, f: 0 }, "the guitar Gadd9 grip", "Exactly the guitar Gadd9 grip; on guitarlele it sounds Cadd9."],
  Dadd9: [["x", 0, 2, 4, 2, "x"], [0, 0, 1, 3, 2, 0], { s: 5, f: 0 }, { s: 4, f: 2 }, "the guitar Aadd9 grip", "Open D string is the root."],
};
export const GL_CHORD_IDS = [];
function pcs(frets, open) { return frets.map((f, i) => (f === "x" ? null : (open[6 - i] + f) % 12)).filter((x) => x != null); }
function shapeObj(frets) { const o = {}; frets.forEach((f, i) => { if (f !== "x") o[6 - i] = f; }); return o; }
function buildGlChords() {
  for (const id of GL_SRC) {
    const g = CHORD_LIB[id], c = CHORDS[id];
    if (!g || !c) continue;
    // (a) same shapes: every pitch +5
    const sName = transposeText(g.short, 5);
    CHORD_LIB["gls_" + id] = { ...g, tuning: "guitarlele", flats: true, short: sName, name: `${sName} — guitar ${g.short} shape on guitarlele`, gl: "shapes", from: id,
      order: [`Use the guitar ${g.short} grip exactly as on guitar (same strings, same frets).`, `On guitarlele it sounds ${sName} — a 4th higher.`, ...g.order],
      mistakes: g.mistakes };
    CHORDS["gls_" + id] = { ...c, tuning: "guitarlele", tones: c.tones.map((t) => (t + 5) % 12) };
    // (b) original key
    const k = KEY_SHAPES[id];
    const kName = g.short;
    const tones = c.tones;
    CHORD_LIB["glk_" + id] = { name: `${kName} on guitarlele (original key)`, short: kName, tuning: "guitarlele", flats: g.flats || /♭/.test(kName), frets: k[0], fingers: k[1], gl: "key", from: id,
      order: [`This is ${k[4]} — on guitarlele it sounds ${kName}.`, ...k[0].map((f, i) => (f === "x" ? null : f === 0 ? `${6 - i}${["th", "th", "th", "rd", "nd", "st"][i]} string open` : `${6 - i}${["th", "th", "th", "rd", "nd", "st"][i]} string fret ${f}, finger ${k[1][i]}`)).filter(Boolean), k[5]],
      mistakes: ["Letting unused strings (marked ×) ring — pick only the strings in the pattern."] };
    CHORDS["glk_" + id] = { tuning: "guitarlele", rootAt: k[2], fifthAt: k[3], tones, shape: shapeObj(k[0]) };
    GL_CHORD_IDS.push("gls_" + id, "glk_" + id);
  }
}
buildGlChords();

/** Map one EBYT guitar tab token to the original-key guitarlele grip: k-th lowest string of the guitar grip →
 *  k-th lowest string of the guitarlele grip. Returns null if the note isn’t in the chord shape. */
function mapNote(chordId, s, f) {
  const g = CHORDS[chordId].shape, k = CHORDS["glk_" + chordId].shape;
  const gs = Object.keys(g).map(Number).sort((a, b) => b - a), ks = Object.keys(k).map(Number).sort((a, b) => b - a);
  const i = gs.indexOf(s);
  if (i < 0 || g[s] !== f) return null;
  // Beginner G shapes don’t have the same string count — map by pitch class within the guitarlele grip instead.
  const pc = (G_OPEN[s] + f) % 12;
  const byPc = ks.filter((q) => (L_OPEN[q] + k[q]) % 12 === pc);
  if (gs.length === ks.length && (L_OPEN[ks[i]] + k[ks[i]]) % 12 === pc) return [ks[i], k[ks[i]]];
  return byPc.length ? [byPc[0], k[byPc[0]]] : null;
}
export function retabKey(lesson) {
  const bars = lesson.v1.split("|");
  const chordAt = (i) => (typeof lesson.chords === "string" ? lesson.chords : lesson.chords[i]);
  return bars.map((bar, i) => bar.replace(/([pimax])([1-6])\.(\d{1,2})(?::([1-4]))?/g, (all, rf, s, f) => {
    const m = mapNote(chordAt(i), +s, +f);
    if (!m) throw new Error(`${lesson.id} bar ${i + 1}: ${s}.${f} not in ${chordAt(i)}`);
    const lf = CHORD_LIB["glk_" + chordAt(i)].fingers[6 - m[0]];
    return `${rf}${m[0]}.${m[1]}${lf ? ":" + lf : ""}`;
  })).join("|");
}

const EBYT_KEY_TEXT = {
  "ebyt-intro": { explain: "Guitarlele, original key (A♭). The guitarlele has no low A♭, so the A♭add9 grip moves over one string: it is your guitar E♭add9 grip — finger 1 on the 5th string (D) fret 6 (A♭, root), finger 3 on the 4th string (G) fret 8 (E♭, fifth), finger 4 on the 3rd string (C) fret 10 (B♭, the 9th), finger 2 on the 2nd string (E) fret 8 (C, the third). Same 4-fret stretch, same riff: root–5–9–5–3–5–9–5. It sounds in the record’s key, one octave higher than the guitar part (a higher, chimier version). Start at 60 bpm; the record is about 117.", fingers: "A♭add9 on guitarlele (5th→2nd string): 6 · 8 · 10 · 8, fingers 1 · 3 · 4 · 2. Mute the 6th string (A) with the tip of finger 1." },
  "ebyt-vi": { explain: "Guitarlele, original key. Fm(add9) is a 5th-string grip at the 3rd fret: finger 1 on the 5th string fret 3 (F), finger 3 on the 4th string fret 5 (C), finger 4 on the 3rd string fret 7 (G, the 9th), finger 2 on the 2nd string fret 4 (A♭, the minor third). From A♭add9 the hand slides down three frets and finger 2 drops one more fret. Same right-hand pattern; two bars each, looping.", fingers: "Fm(add9): x · 3 · 5 · 7 · 4 · x (fingers 1 · 3 · 4 · 2)." },
  "ebyt-IV-V": { explain: "Guitarlele, original key. Here the guitarlele is easy: D♭add9 is literally your guitar A♭add9 grip — finger 1 on the 6th string (A) fret 4, finger 3 on the 5th string fret 6, finger 4 on the 4th string fret 8, finger 2 on the 3rd string fret 5. On guitarlele it sounds D♭add9 in the same octave as the record. E♭add9 is the same grip two frets higher (6 · 8 · 10 · 7). Pattern unchanged: root–5–9–5–3–5–9–5.", fingers: "D♭add9: 4 · 6 · 8 · 5 · x · x. E♭add9: 6 · 8 · 10 · 7 · x · x. Fingers 1 · 3 · 4 · 2." },
  "ebyt-verse": { explain: "Guitarlele, original key: the full verse loop in A♭ — two bars A♭add9 (5th-string grip, fret 6), two bars Fm(add9) (5th-string grip, fret 3), one bar D♭add9 (6th-string grip, fret 4), one bar E♭add9 (6th-string grip, fret 6), two bars A♭add9. I–vi–IV–V–I. Practise 60 → 80 → 100 → 117 bpm with Loop and Click, only moving up after four clean passes.", fingers: "A♭: x 6 8 10 8 x · Fm: x 3 5 7 4 x · D♭: 4 6 8 5 x x · E♭: 6 8 10 7 x x." },
  "ebyt-bridge": { explain: "Guitarlele, original key. The middle eight: ♭VI (F♭, fingered like E) – ♭VII (G♭) – I (A♭), then the turn to V (E♭). F♭add9 is a 5th-string grip at fret 2 (x 2 4 6 4), G♭add9 the same grip at fret 4 (x 4 6 8 6), A♭add9 at fret 6 (x 6 8 10 8) — one grip climbing two frets at a time, which is easier than on guitar. E♭add9 is the 6th-string grip at fret 6.", fingers: "F♭(E): x 2 4 6 4 x · G♭: x 4 6 8 6 x · A♭: x 6 8 10 8 x · E♭: 6 8 10 7 x x." },
  "ebyt-easy": { explain: "Guitarlele, beginner version in G (a half step below the record, like the guitar beginner version). The guitarlele’s open G and D strings make this very friendly: Gadd9 uses the open G string as its root, Em(add9) is the same 1-3-4-2 stretch at fret 2, Cadd9 is your guitar Gadd9 grip, and Dadd9 is your guitar Aadd9 grip. The voicing sits an octave above the guitar beginner version. Same eighth-note feel, same let-ring rule.", fingers: "Gadd9: x x 0 2 5 2 · Em(add9): x 2 4 6 3 x · Cadd9: 3 x 0 2 0 x · Dadd9: x 0 2 4 2 x." },
};

function arrangeEbyt(mode) {
  for (const l of LESSONS) {
    if (l.unit !== "u10") continue;
    l.glOrig = { v1: l.v1, chords: l.chords, tuning: l.tuning, key: l.key };
    if (mode === "shapes") {
      l.tuning = "guitarlele";
      const ids = [...new Set([].concat(l.chords))];
      l.chords = typeof l.chords === "string" ? "gls_" + l.chords : l.chords.map((c) => "gls_" + c);
      l.key = { abmajor: "dbmajor", gmajor: "cmajor" }[l.key] || l.key;
      const map = ids.map((c) => `${CHORD_LIB[c].short} → ${CHORD_LIB["gls_" + c].short}`).join(", ");
      l.title = l.title + " — guitar shapes on guitarlele";
      l.explain = `Guitarlele, guitar shapes: play exactly the guitar fingering described below — same strings, same frets, same fingers. On guitarlele everything sounds a 4th higher, so the chord names in the guitar text are not what you hear. You hear: ${map}${l.key === "dbmajor" ? " — the song in D♭, which won’t match the record; tap “Match original key” to play along in A♭" : " — the beginner riff in C"}. The diagrams and tab show the sounding names. Guitar text: ` + l.explain;
      l.fingers = "Guitar fingering (unchanged): " + l.fingers + ` · Sounds: ${map}.`;
    } else {
      l.v1 = retabKey(l);
      l.tuning = "guitarlele";
      l.chords = typeof l.chords === "string" ? "glk_" + l.chords : l.chords.map((c) => "glk_" + c);
      Object.assign(l, EBYT_KEY_TEXT[l.id] || {});
      l.title = l.title + " (guitarlele)";
    }
    l.glMode = mode;
  }
}

/* ---------------- Apply at startup ---------------- */
export const ACTIVE = { lagrima: null, ebyt: null };
if (isLele()) {
  ACTIVE.lagrima = modeOf("lagrima");
  if (ACTIVE.lagrima === "shapes") lagShapes(); else lagKey();
  ACTIVE.ebyt = modeOf("ebyt");
  arrangeEbyt(ACTIVE.ebyt);
}

/* ---------------- UI ---------------- */
let currentLesson = null;
export function setCurrentLesson(id) { currentLesson = id; }
export function toggleHTML() {
  const g = !isLele();
  return `<div class="inst-toggle" role="group" aria-label="Instrument"><button type="button" data-inst="guitar" class="${g ? "on" : ""}" aria-pressed="${g}">${g ? "✓ " : ""}🎸 Guitar</button><button type="button" data-inst="guitarlele" class="${g ? "" : "on"}" aria-pressed="${!g}">${g ? "" : "✓ "}🪕 Guitarlele</button></div>`;
}
/** Big panel for a song page. song = "lagrima" | "ebyt" | null (not arranged yet). */
export function panelHTML(song) {
  let h = `<div class="inst-panel"><div class="inst-row"><b>Instrument</b>${toggleHTML()}</div>`;
  if (isLele()) {
    if (song && SONGS[song]) {
      const m = modeOf(song);
      h += `<div class="inst-modes" role="group" aria-label="Guitarlele mode"><button type="button" data-glmode="shapes" data-glsong="${song}" class="${m === "shapes" ? "on" : ""}">Play guitar shapes<br><small>sounds a 4th higher</small></button><button type="button" data-glmode="key" data-glsong="${song}" class="${m === "key" ? "on" : ""}">Match original key<br><small>re-fingered for guitarlele</small></button></div>`;
      h += `<p class="inst-note">${m === SONGS[song].def ? "✓ Recommended for this song. " : ""}${SONGS[song].why}</p>`;
      h += `<p><a class="btn primary big" href="#guitarlele">🎵 Tune first: guitarlele tuner (A D G C E A)</a></p>`;
      if (song === "lagrima" && m === "key" && LAG_FLAGS.length) h += `<p class="inst-note warn">⚠︎ Simplified for guitarlele range in bars ${LAG_FLAGS.map((f) => f.n).join(", ")} — notes below the guitarlele’s low A go up an octave; see “This bar” on the Left hand page.</p>`;
    } else {
      h += `<p class="inst-note warn">Guitarlele version coming soon — showing the guitar version for now. (Lágrima and Every Breath You Take are ready.)</p>`;
    }
  }
  return h + "</div>";
}
function reloadHere() {
  const v = document.querySelector(".view.active");
  const view = v ? v.dataset.view : "hub";
  if (view === "course" && currentLesson && document.body.classList.contains("show-course-dock")) location.hash = "#lesson=" + currentLesson;
  else location.hash = "#view=" + view;
  location.reload();
}
export function initInstrumentUI() {
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-inst],[data-glmode]");
    if (!b) return;
    e.preventDefault();
    if (b.dataset.inst) { if (b.dataset.inst === instrument()) return; setInstrument(b.dataset.inst); }
    else { if (b.dataset.glmode === modeOf(b.dataset.glsong)) return; setMode(b.dataset.glsong, b.dataset.glmode); }
    reloadHere();
  });
  document.body.classList.toggle("lele", isLele());
}
