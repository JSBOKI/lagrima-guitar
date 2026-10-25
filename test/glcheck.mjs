// Guitarlele verification: computes every sounded pitch from tuning + fret and compares with the guitar original.
// Run: node test/glcheck.mjs   (spawns one process per instrument/mode so the start-up transform runs fresh)
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const here = fileURLToPath(import.meta.url);

if (process.env.GL_CHILD) {
  const store = new Map(Object.entries(JSON.parse(process.env.GL_CHILD)));
  globalThis.localStorage = { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, v) };
  const { MEASURES } = await import("../js/data.js");
  const { LESSONS } = await import("../js/course-data.js");
  const ct = await import("../js/coursetex.js");
  await import("../js/instrument.js");
  const lag = MEASURES.map((M) => ({ n: M.n, notes: M.notes.map((t) => [t[0], t[2], t[3], t[6], t[7] && t[7].t ? 1 : 0]), barres: M.barres || [] }));
  const ebyt = LESSONS.filter((l) => l.unit === "u10").map((l) => ({ id: l.id, tuning: l.tuning, notes: ct.soundedNotes(l).map((n) => n.midi), shapes: ct.parseLesson(l).v1.map((b) => b.flatMap((e) => e.notes.map((n) => n.s + "." + n.f))) }));
  console.log(JSON.stringify({ lag, ebyt, errs: ct.validateAll() }));
  process.exit(0);
}

const run = (ls) => JSON.parse(execFileSync(process.execPath, [here], { env: { ...process.env, GL_CHILD: JSON.stringify(ls) } }).toString());
const G = { 1: 64, 2: 59, 3: 55, 4: 50, 5: 45, 6: 40 }, L = { 1: 69, 2: 64, 3: 60, 4: 55, 5: 50, 6: 45 };
const errors = [];
const counts = { chords: 0, lagShapes: 0, lagKey: 0, lagKeyOct: 0, ebytShapes: 0, ebytKey: 0, ebytKeyOct: {} };

// 1. Chord shapes
globalThis.localStorage = { getItem: () => null, setItem() {} };
const { CHORD_LIB } = await import("../js/chordlib.js");
const { CHORDS } = await import("../js/course-data.js");
const inst = await import("../js/instrument.js");
for (const id of inst.GL_CHORD_IDS) {
  const c = CHORD_LIB[id], src = CHORDS[c.from];
  const want = new Set(id.startsWith("gls_") ? src.tones.map((t) => (t + 5) % 12) : src.tones);
  const got = new Set(c.frets.map((f, i) => (f === "x" ? null : (L[6 - i] + f) % 12)).filter((x) => x != null));
  const same = got.size === want.size && [...got].every((x) => want.has(x));
  if (!same) errors.push(`${id}: sounds ${[...got]} want ${[...want]}`);
  const sh = CHORDS[id].shape; const fromLib = {}; c.frets.forEach((f, i) => { if (f !== "x") fromLib[6 - i] = f; });
  if (JSON.stringify(sh) !== JSON.stringify(Object.fromEntries(Object.entries(fromLib).sort()))) {
    const a = JSON.stringify(Object.entries(sh).sort()), b = JSON.stringify(Object.entries(fromLib).sort()); if (a !== b) errors.push(`${id}: library frets ≠ lesson shape`);
  }
  const fr = c.frets.filter((f) => f !== "x" && f > 0); if (fr.length && Math.max(...fr) - Math.min(...fr) > 4) errors.push(`${id}: stretch > 5 frets`);
  if (same) counts.chords++;
}

// 2. Tabs
const g = run({}), ls = run({ "gc-instrument": "guitarlele", "gc-lele-mode-lagrima": "shapes", "gc-lele-mode-ebyt": "shapes" }),
  lk = run({ "gc-instrument": "guitarlele", "gc-lele-mode-lagrima": "key", "gc-lele-mode-ebyt": "key" });
for (const r of [g, ls, lk]) if (r.errs.length) errors.push("validateAll: " + r.errs.join("; "));
g.lag.forEach((M, i) => {
  const S = ls.lag[i], K = lk.lag[i];
  M.notes.forEach((n, j) => {
    const gm = G[n[1]] + n[2];
    const sm = L[S.notes[j][1]] + S.notes[j][2];
    if (sm - gm !== 5) errors.push(`Lágrima shapes bar ${M.n} note ${j}: ${sm} vs ${gm}`); else counts.lagShapes++;
    const km = L[K.notes[j][1]] + K.notes[j][2];
    const want = gm < 45 ? gm + 12 : gm;
    if (km !== want) errors.push(`Lágrima key bar ${M.n} note ${j}: ${km} vs ${want}`); else { counts.lagKey++; if (gm < 45) counts.lagKeyOct++; }
    if (K.notes[j][2] < 0 || K.notes[j][2] > 12) errors.push(`Lágrima key bar ${M.n}: fret ${K.notes[j][2]}`);
  });
  // simultaneous notes never share a string (key mode re-stringing)
  for (const a of K.notes) for (const b of K.notes) if (a !== b && a[1] === b[1] && a[0] === b[0] && a[2] !== b[2]) errors.push(`Lágrima key bar ${M.n}: two notes on string ${a[1]} at slot ${a[0]}`);
});
g.ebyt.forEach((l, i) => {
  const S = ls.ebyt[i], K = lk.ebyt[i];
  if (S.tuning !== "guitarlele" || K.tuning !== "guitarlele") errors.push(l.id + " tuning");
  l.notes.forEach((m, j) => {
    if (S.notes[j] - m !== 5) errors.push(`${l.id} shapes note ${j}`); else counts.ebytShapes++;
    const d = K.notes[j] - m;
    if (((d % 12) + 12) % 12) errors.push(`${l.id} key note ${j}: diff ${d}`); else { counts.ebytKey++; counts.ebytKeyOct[d] = (counts.ebytKeyOct[d] || 0) + 1; }
  });
  if (JSON.stringify(S.shapes) !== JSON.stringify(l.shapes)) errors.push(l.id + ": shapes mode must keep guitar frets");
});
console.log(JSON.stringify(counts));
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log("glcheck OK");
