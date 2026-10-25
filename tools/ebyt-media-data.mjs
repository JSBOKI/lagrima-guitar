// Dump the exact chord grips + riff tokens used by Unit 10 for one instrument mode (single source of truth for media/ebyt videos).
// usage: node tools/ebyt-media-data.mjs guitar|shapes|key
const mode = process.argv[2] || "guitar";
const store = { "gc-instrument": mode === "guitar" ? "guitar" : "guitarlele", "gc-lele-mode-ebyt": mode === "key" ? "key" : "shapes" };
globalThis.localStorage = { getItem: (k) => store[k] ?? null, setItem: () => {} };
const { CHORD_LIB } = await import("../js/chordlib.js");
const { LESSONS } = await import("../js/course-data.js");
const inst = await import("../js/instrument.js");
const IDS = ["Abadd9", "Fmadd9", "Dbadd9", "Ebadd9", "Gbadd9", "Fbadd9"];
const pre = mode === "guitar" ? "" : mode === "shapes" ? "gls_" : "glk_";
const chords = IDS.map((id) => { const c = CHORD_LIB[pre + id]; return { id, libId: pre + id, short: c.short, gshort: CHORD_LIB[id].short, frets: c.frets, fingers: c.fingers, barre: c.barre || null }; });
const intro = LESSONS.find((l) => l.id === "ebyt-intro");
const bar2 = intro.v1.split("|")[1];
const riff = [...bar2.matchAll(/([pimax])([1-6])\.(\d{1,2})(?::([1-4]))?@?(\S*)/g)].map((m) => ({ rh: m[1], s: +m[2], f: +m[3], lf: m[4] ? +m[4] : 0, deg: m[5].split("/")[0] }));
const letters = mode === "guitar" ? ["e", "B", "G", "D", "A", "E"] : ["A", "E", "C", "G", "D", "A"];
console.log(JSON.stringify({ mode, letters, chords, riff, introChord: intro.chords }, null, 1));
