// Pure pitch helpers (no DOM) so they can be unit-tested in Node.
export const STRINGS = [
  { s: 6, name: "E2", midi: 40 }, { s: 5, name: "A2", midi: 45 }, { s: 4, name: "D3", midi: 50 },
  { s: 3, name: "G3", midi: 55 }, { s: 2, name: "B3", midi: 59 }, { s: 1, name: "E4", midi: 64 },
];
const NAMES = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"];
export function midiToFreq(m, a4 = 440) { return a4 * Math.pow(2, (m - 69) / 12); }
export function freqToMidi(f, a4 = 440) { return 69 + 12 * Math.log2(f / a4); }
export function noteInfo(freq, a4 = 440) {
  const m = freqToMidi(freq, a4), n = Math.round(m);
  return { midi: n, name: NAMES[((n % 12) + 12) % 12], octave: Math.floor(n / 12) - 1, cents: (m - n) * 100 };
}
export function nearestString(freq, a4 = 440) {
  const m = freqToMidi(freq, a4);
  let best = STRINGS[0];
  for (const s of STRINGS) if (Math.abs(s.midi - m) < Math.abs(best.midi - m)) best = s;
  return { ...best, cents: (m - best.midi) * 100 };
}
/** YIN pitch detector. Returns { freq, clarity } or null for silence/noise. */
export function yin(buf, sampleRate, { threshold = 0.12, minFreq = 60, maxFreq = 1200 } = {}) {
  const n = buf.length;
  let rms = 0;
  for (let i = 0; i < n; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / n);
  if (rms < 0.008) return null;
  const maxTau = Math.min(Math.floor(sampleRate / minFreq), Math.floor(n / 2));
  const minTau = Math.max(2, Math.floor(sampleRate / maxFreq));
  const W = n - maxTau;
  const d = new Float32Array(maxTau + 1);
  for (let tau = 1; tau <= maxTau; tau++) {
    let sum = 0;
    for (let i = 0; i < W; i++) { const x = buf[i] - buf[i + tau]; sum += x * x; }
    d[tau] = sum;
  }
  // cumulative mean normalized difference
  const c = new Float32Array(maxTau + 1); c[0] = 1;
  let run = 0;
  for (let tau = 1; tau <= maxTau; tau++) { run += d[tau]; c[tau] = run ? d[tau] * tau / run : 1; }
  let tau = -1;
  for (let t = minTau; t <= maxTau; t++) {
    if (c[t] < threshold) { while (t + 1 <= maxTau && c[t + 1] < c[t]) t++; tau = t; break; }
  }
  if (tau < 0) {
    let bt = minTau; for (let t = minTau; t <= maxTau; t++) if (c[t] < c[bt]) bt = t;
    if (c[bt] > 0.35) return null;
    tau = bt;
  }
  // parabolic interpolation
  let better = tau;
  if (tau > 1 && tau < maxTau) {
    const a = c[tau - 1], b = c[tau], g = c[tau + 1], den = a + g - 2 * b;
    if (den) better = tau + (a - g) / (2 * den);
  }
  return { freq: sampleRate / better, clarity: 1 - c[tau] };
}
