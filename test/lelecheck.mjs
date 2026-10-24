// Guitarlele tuner: synthesize each string and check YIN + nearest-string detection.
import { yin, nearestString, midiToFreq, GUITARLELE } from "../js/pitch.js";
const sr = 48000, errors = [];
const EXPECT = { A2: 110.0, D3: 146.83, G3: 196.0, C4: 261.63, E4: 329.63, A4: 440.0 };
function sig(f, { n = 4096, noise = 0.02, decay = 0 } = {}) {
  const b = new Float32Array(n);
  for (let i = 0; i < n; i++) { const t = i / sr, e = Math.exp(-decay * t);
    b[i] = e * (0.4 * Math.sin(2 * Math.PI * f * t) + 0.35 * Math.sin(4 * Math.PI * f * t) + 0.2 * Math.sin(6 * Math.PI * f * t) + 0.1 * Math.sin(8 * Math.PI * f * t)) + noise * (Math.random() * 2 - 1); }
  return b;
}
const opts = { minFreq: 80, maxFreq: 1000 };
for (const s of GUITARLELE) {
  const f = midiToFreq(s.midi);
  if (Math.abs(f - EXPECT[s.name]) > 0.01) errors.push(`${s.name} target ${f}`);
  for (const [label, cfg, off] of [["clean", {}, 0], ["plucked", { decay: 3 }, 0], ["20c flat", {}, -20], ["12c sharp", {}, 12], ["3c sharp", {}, 3]]) {
    const r = yin(sig(f * Math.pow(2, off / 1200), cfg), sr, opts);
    if (!r) { errors.push(`${s.name} ${label}: no pitch`); continue; }
    const ns = nearestString(r.freq, 440, GUITARLELE);
    if (ns.name !== s.name) errors.push(`${s.name} ${label}: detected string ${ns.name}`);
    if (Math.abs(ns.cents - off) > 1.5) errors.push(`${s.name} ${label}: ${ns.cents.toFixed(2)}c (want ${off})`);
    const verdict = Math.abs(ns.cents) <= 5 ? "ok" : ns.cents < 0 ? "low" : "high";
    const want = Math.abs(off) <= 5 ? "ok" : off < 0 ? "low" : "high";
    if (verdict !== want) errors.push(`${s.name} ${label}: verdict ${verdict}`);
    console.log(`${s.name.padEnd(3)} ${label.padEnd(9)} ${r.freq.toFixed(2)} Hz → string ${ns.s} ${ns.name} ${ns.cents >= 0 ? "+" : ""}${ns.cents.toFixed(2)}c ${verdict}`);
  }
}
// A4 calibration 442: an A4 at 442 Hz reads in tune.
const r442 = yin(sig(442), sr, opts); const n442 = nearestString(r442.freq, 442, GUITARLELE);
if (n442.name !== "A4" || Math.abs(n442.cents) > 1.5) errors.push("A4=442 calibration");
if (yin(new Float32Array(4096), sr, opts) !== null) errors.push("silence should be null");
if (errors.length) { console.error("FAIL\n" + errors.join("\n")); process.exit(1); }
console.log("lelecheck ok");
