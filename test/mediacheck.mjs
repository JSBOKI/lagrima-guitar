// Unit 10 demo videos: the dots/riff baked into media/ebyt/*.mp4 (manifest.json, written by tools/ebyt_videos.py)
// must equal the current chord-box data (CHORD_LIB via instrument.js) and lesson tab. Run: node test/mediacheck.mjs
import { execFileSync } from "node:child_process";
import { readFileSync, statSync, readdirSync } from "node:fs";
const root = new URL("..", import.meta.url);
const man = JSON.parse(readFileSync(new URL("media/ebyt/manifest.json", root)));
let bad = 0; const fail = (m) => { bad++; console.error("FAIL", m); };
const pre = { guitar: "g", key: "lk", shapes: "ls" };
for (const mode of Object.keys(pre)) {
  const d = JSON.parse(execFileSync(process.execPath, [new URL("tools/ebyt-media-data.mjs", root).pathname, mode]).toString());
  for (const c of d.chords) {
    const m = man.find((x) => x.file === `${pre[mode]}-${c.id}.mp4`);
    if (!m) { fail(`missing video ${pre[mode]}-${c.id}`); continue; }
    const want = c.frets.map((f, i) => (c.fingers[i] ? `${c.fingers[i]}@${6 - i}.${f}` : null)).filter(Boolean).sort().join(" ");
    const got = m.dots.map((x) => `${x.finger}@${x.string}.${x.fret}`).sort().join(" ");
    if (want !== got || JSON.stringify(m.frets) !== JSON.stringify(c.frets)) fail(`${m.file}: video ${got} ≠ chord box ${want}`);
  }
  const r = man.find((x) => x.file === `${pre[mode]}-picking.mp4`);
  if (!r || JSON.stringify(r.riff) !== JSON.stringify(d.riff)) fail(`${pre[mode]}-picking riff differs from lesson tab`);
}
let total = 0;
for (const f of readdirSync(new URL("media/ebyt/", root))) total += statSync(new URL("media/ebyt/" + f, root)).size;
for (const m of man) { statSync(new URL("media/ebyt/" + m.file, root)); statSync(new URL("media/ebyt/" + m.poster, root)); if (m.seconds < 10 || m.seconds > 30) fail(`${m.file} ${m.seconds}s`); }
if (total > 40e6) fail(`media/ebyt is ${(total / 1e6).toFixed(1)} MB`);
console.log(bad ? `${bad} failures` : `mediacheck ok: ${man.length} videos, ${(total / 1e6).toFixed(1)} MB, dots = chord boxes`);
process.exit(bad ? 1 : 0);
