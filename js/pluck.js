// Tiny Karplus–Strong plucked-string synth for instant note previews in step mode.
let ctx = null; const cache = new Map();
export function audioCtx() { if (!ctx) { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; ctx = new AC(); } if (ctx.state === "suspended") ctx.resume(); return ctx; }
function buffer(midi) {
  if (cache.has(midi)) return cache.get(midi);
  const c = audioCtx(); const sr = c.sampleRate; const f = 440 * Math.pow(2, (midi - 69) / 12);
  const len = Math.floor(sr * 1.8); const N = Math.max(2, Math.round(sr / f));
  const buf = c.createBuffer(1, len, sr); const d = buf.getChannelData(0); const ring = new Float32Array(N);
  for (let i = 0; i < N; i++) ring[i] = (Math.random() * 2 - 1) * 0.5;
  let prev = 0; for (let i = 0; i < N; i++) { const v = 0.5 * ring[i] + 0.5 * prev; prev = ring[i]; ring[i] = v; }
  const damp = 0.996 - Math.min(0.01, (midi - 40) * 0.00012);
  let idx = 0; for (let i = 0; i < len; i++) { const a = ring[idx], b = ring[(idx + 1) % N]; const v = damp * 0.5 * (a + b); d[i] = a; ring[idx] = v; idx = (idx + 1) % N; }
  cache.set(midi, buf); return buf;
}
export function pluck(midis, opts = {}) {
  const c = audioCtx(); if (!c) return; const t0 = c.currentTime + 0.01;
  midis.forEach((m, k) => { const src = c.createBufferSource(); src.buffer = buffer(m); const g = c.createGain();
    const vol = (opts.accent && opts.accent.includes(m) ? 0.55 : 0.32); g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + 1.7);
    const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 3200;
    src.connect(lp).connect(g).connect(c.destination); src.start(t0 + k * 0.012); });
}
