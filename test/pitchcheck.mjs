import { yin, noteInfo, nearestString, midiToFreq, STRINGS } from "../js/pitch.js";
const errors = [];
const sr = 48000;
function tone(f, n = 4096, noise = 0.02) { const b = new Float32Array(n); for (let i = 0; i < n; i++) { const t = i / sr; b[i] = 0.5 * Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(4 * Math.PI * f * t) + 0.2 * Math.sin(6 * Math.PI * f * t) + noise * (Math.random() * 2 - 1); } return b; }
for (const s of STRINGS) {
  const f = midiToFreq(s.midi);
  const r = yin(tone(f), sr);
  if (!r) { errors.push("no pitch for " + s.name); continue; }
  const cents = 1200 * Math.log2(r.freq / f);
  if (Math.abs(cents) > 2) errors.push(`${s.name}: ${cents.toFixed(1)} cents off`);
  if (nearestString(r.freq).name !== s.name) errors.push(`${s.name}: nearest string ${nearestString(r.freq).name}`);
}
const flat = yin(tone(midiToFreq(45) * Math.pow(2, -20 / 1200)), sr);
if (Math.abs(noteInfo(flat.freq).cents + 20) > 2) errors.push("20c flat A read " + noteInfo(flat.freq).cents);
if (yin(new Float32Array(4096), sr) !== null) errors.push("silence should be null");
if (Math.abs(midiToFreq(69, 442) - 442) > 1e-9) errors.push("A4 calibration");
if (noteInfo(440).name !== "A" || noteInfo(440).octave !== 4) errors.push("A4 name");
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log("pitchcheck ok");
