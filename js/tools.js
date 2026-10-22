// Practice tools: chromatic tuner (mic + YIN) and a standalone metronome.
import { STRINGS, midiToFreq, noteInfo, nearestString, yin } from "./pitch.js";

const $ = (id) => document.getElementById(id);
const TKEY = "guitar.tuner.v1", MKEY = "guitar.metro.v1";
function loadJ(k, d) { try { return Object.assign(d, JSON.parse(localStorage.getItem(k) || "{}")); } catch { return d; } }
function saveJ(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }

let ctx = null;
function audio() {
  if (!ctx) { const AC = window.AudioContext || window.webkitAudioContext; ctx = new AC(); }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

/* ---------------- Tuner ---------------- */
const tset = loadJ(TKEY, { a4: 440, target: "auto" });
const tl = { stream: null, src: null, an: null, buf: null, raf: 0, on: false, hist: [], tone: null, toneTimer: 0 };

function tunerHTML() {
  return `<div class="card">
    <h2>Tuner</h2>
    <p class="small muted">Chromatic tuner using your microphone. Standard tuning E A D G B E. Nothing is recorded or sent anywhere.</p>
    <div class="row gap wrap"><button class="btn primary" type="button" id="tunerStart">🎤 Start tuner</button>
    <label class="custom">A4 = <input type="number" id="tunerA4" min="415" max="466" step="1" value="${tset.a4}" style="width:4.5em;font:inherit;padding:6px;border-radius:10px;border:1px solid var(--line)"> Hz</label></div>
    <p class="flag" id="tunerMsg" hidden></p>
  </div>
  <div class="card tuner-face">
    <div class="tuner-note"><span id="tunerNote">–</span><small id="tunerOct"></small></div>
    <div class="tuner-freq small muted" id="tunerFreq">Tap Start, then play one string.</div>
    <div class="meter" aria-hidden="true">
      <div class="meter-zone"></div>
      ${[-50, -25, 0, 25, 50].map((c) => `<span class="tick" style="left:${50 + c}%"><i>${c > 0 ? "+" + c : c}</i></span>`).join("")}
      <div class="needle" id="tunerNeedle"></div>
    </div>
    <div class="tuner-cents" id="tunerCents" role="status" aria-live="polite">&nbsp;</div>
  </div>
  <div class="card">
    <h3>String</h3>
    <div class="row gap wrap" id="tunerStrings">
      <button class="chip" type="button" data-target="auto">Auto</button>
      ${STRINGS.map((s) => `<button class="chip" type="button" data-target="${s.s}">${s.s} · ${s.name}</button>`).join("")}
    </div>
    <h3 style="margin-top:12px">Reference tone</h3>
    <div class="row gap wrap" id="tunerTones">
      ${STRINGS.map((s) => `<button class="chip" type="button" data-tone="${s.s}">🔊 ${s.name}</button>`).join("")}
    </div>
    <p class="small muted">Tap a tone to hear the target pitch for 3 seconds (tap again to stop). The tone pauses the mic so it isn’t measured.</p>
  </div>`;
}

function syncTargets() {
  document.querySelectorAll("#tunerStrings [data-target]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.target === String(tset.target))));
}
function msg(t) { $("tunerMsg").hidden = !t; $("tunerMsg").textContent = t || ""; }

async function startMic() {
  if (tl.on) { stopMic(); return; }
  if (!window.isSecureContext || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    msg("The microphone needs a secure (https) page and a browser that supports it. Open the app at https://jsboki.github.io/lagrima-guitar/."); return;
  }
  const ac = audio(); // created inside the tap, required on iPhone Safari
  try {
    tl.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
  } catch (e) {
    const denied = e && (e.name === "NotAllowedError" || e.name === "SecurityError");
    msg(denied ? "Microphone access was blocked. On iPhone: Settings › Safari › Microphone (or the “aA” menu › Website Settings) and allow it, then tap Start again. You can still use the reference tones."
      : "Couldn’t open a microphone (" + (e && e.name || "error") + "). Check that no other app is using it.");
    return;
  }
  if (ac.state === "suspended") await ac.resume();
  tl.src = ac.createMediaStreamSource(tl.stream);
  tl.an = ac.createAnalyser(); tl.an.fftSize = 4096;
  tl.src.connect(tl.an);
  tl.buf = new Float32Array(tl.an.fftSize);
  tl.on = true; tl.hist = [];
  msg("");
  $("tunerStart").textContent = "⏹ Stop tuner";
  loop();
}
function stopMic() {
  tl.on = false; cancelAnimationFrame(tl.raf);
  if (tl.src) try { tl.src.disconnect(); } catch {}
  if (tl.stream) tl.stream.getTracks().forEach((t) => t.stop());
  tl.stream = tl.src = tl.an = null;
  if ($("tunerStart")) $("tunerStart").textContent = "🎤 Start tuner";
}
function show(freq) {
  if (!freq) { $("tunerNeedle").style.opacity = ".25"; return; }
  const a4 = tset.a4;
  let label, cents, sub;
  if (tset.target === "auto") {
    const n = noteInfo(freq, a4), ns = nearestString(freq, a4);
    label = n.name; sub = String(n.octave); cents = n.cents;
    $("tunerFreq").textContent = `${freq.toFixed(1)} Hz · nearest string ${ns.s} (${ns.name}) ${ns.cents >= 0 ? "+" : ""}${Math.round(ns.cents)}¢`;
    document.querySelectorAll("#tunerStrings [data-target]").forEach((b) => b.classList.toggle("near", b.dataset.target === String(ns.s)));
  } else {
    const s = STRINGS.find((x) => String(x.s) === String(tset.target));
    cents = 1200 * Math.log2(freq / midiToFreq(s.midi, a4));
    label = s.name.slice(0, 1); sub = s.name.slice(1);
    $("tunerFreq").textContent = `${freq.toFixed(1)} Hz · target ${s.name} ${midiToFreq(s.midi, a4).toFixed(2)} Hz`;
  }
  const inTune = Math.abs(cents) <= 5;
  $("tunerNote").textContent = label; $("tunerOct").textContent = sub;
  const c = Math.max(-50, Math.min(50, cents));
  const n = $("tunerNeedle"); n.style.opacity = "1"; n.style.left = (50 + c) + "%";
  n.classList.toggle("ok", inTune);
  $("tunerNote").parentElement.classList.toggle("ok", inTune);
  $("tunerCents").textContent = Math.abs(cents) > 600 ? "Way off – pick the right string or use Auto" : inTune ? `✓ In tune (${cents >= 0 ? "+" : ""}${cents.toFixed(0)}¢)` : `${cents > 0 ? "♯ Sharp – tune down" : "♭ Flat – tune up"} ${Math.abs(cents).toFixed(0)}¢`;
}
function loop() {
  if (!tl.on) return;
  tl.an.getFloatTimeDomainData(tl.buf);
  const r = tl.tone ? null : yin(tl.buf, ctx.sampleRate);
  if (r && r.clarity > 0.8) {
    tl.hist.push(r.freq); if (tl.hist.length > 5) tl.hist.shift();
    const sorted = [...tl.hist].sort((a, b) => a - b);
    show(sorted[Math.floor(sorted.length / 2)]); // median smooths octave glitches
  } else { if (tl.hist.length) tl.hist.shift(); if (!tl.hist.length) show(null); }
  tl.raf = requestAnimationFrame(loop);
}
function stopTone() {
  clearTimeout(tl.toneTimer);
  if (tl.tone) { const { osc, g } = tl.tone; const t = ctx.currentTime; g.gain.cancelScheduledValues(t); g.gain.setTargetAtTime(0, t, 0.05); osc.stop(t + 0.3); tl.tone = null; }
  document.querySelectorAll("#tunerTones [data-tone]").forEach((b) => b.setAttribute("aria-pressed", "false"));
}
function playTone(sNum) {
  const was = tl.tone && tl.tone.s === sNum;
  stopTone(); if (was) return;
  const ac = audio(), s = STRINGS.find((x) => x.s === sNum);
  const osc = ac.createOscillator(), g = ac.createGain();
  osc.type = "triangle"; osc.frequency.value = midiToFreq(s.midi, tset.a4);
  g.gain.value = 0; g.gain.setTargetAtTime(0.25, ac.currentTime, 0.02);
  osc.connect(g).connect(ac.destination); osc.start();
  tl.tone = { osc, g, s: sNum };
  document.querySelector(`#tunerTones [data-tone="${sNum}"]`).setAttribute("aria-pressed", "true");
  tl.toneTimer = setTimeout(stopTone, 3000);
}

/* ---------------- Metronome ---------------- */
const mset = loadJ(MKEY, { bpm: 80, beats: 4, accent: true, sub: 1 });
const ml = { on: false, next: 0, beat: 0, timer: 0 };
function metroHTML() {
  return `<div class="card">
    <h2>Metronome</h2>
    <p class="small muted">Works on its own. The lessons and Lágrima also have their own Click button synced to the music.</p>
    <div class="metro-bpm"><button class="icon" type="button" data-bpm="-5">−5</button><button class="icon" type="button" data-bpm="-1">−1</button>
      <span><b id="metroBpm">${mset.bpm}</b> bpm</span><button class="icon" type="button" data-bpm="1">+1</button><button class="icon" type="button" data-bpm="5">+5</button></div>
    <input type="range" id="metroRange" min="30" max="220" value="${mset.bpm}" style="width:100%;accent-color:var(--wood)">
    <div class="metro-dots" id="metroDots"></div>
    <div class="row gap wrap">
      <button class="btn primary" type="button" id="metroStart">▶ Start</button>
      <label class="custom">Beats <select id="metroBeats">${[2, 3, 4, 5, 6].map((b) => `<option ${b === mset.beats ? "selected" : ""}>${b}</option>`).join("")}</select></label>
      <label class="custom">Clicks per beat <select id="metroSub">${[1, 2, 3, 4].map((b) => `<option value="${b}" ${b === mset.sub ? "selected" : ""}>${["♩", "♪♪ eighths", "triplets", "16ths"][b - 1]}</option>`).join("")}</select></label>
      <button class="chip" type="button" id="metroAccent" aria-pressed="${mset.accent}">Accent beat 1</button>
    </div>
    <div class="row gap wrap" style="margin-top:8px">${[60, 80, 100, 117, 120].map((b) => `<button class="chip" type="button" data-preset="${b}">${b}</button>`).join("")}</div>
  </div>`;
}
function dots() { $("metroDots").innerHTML = Array.from({ length: mset.beats }, (_, i) => `<i data-dot="${i}"></i>`).join(""); }
function setBpm(b) { mset.bpm = Math.max(30, Math.min(220, Math.round(b))); $("metroBpm").textContent = mset.bpm; $("metroRange").value = mset.bpm; saveJ(MKEY, mset); }
function click(t, strong, weak) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.frequency.value = strong ? 1600 : weak ? 800 : 1100;
  g.gain.setValueAtTime(weak ? 0.25 : 0.6, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
  o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.06);
}
function sched() {
  const per = 60 / mset.bpm / mset.sub;
  while (ml.next < ctx.currentTime + 0.12) {
    const total = mset.beats * mset.sub, idx = ml.beat % total, onBeat = idx % mset.sub === 0, bi = idx / mset.sub | 0;
    click(ml.next, mset.accent && idx === 0, !onBeat);
    if (onBeat) { const at = ml.next; setTimeout(() => { document.querySelectorAll("#metroDots i").forEach((d) => d.classList.toggle("on", +d.dataset.dot === bi)); }, Math.max(0, (at - ctx.currentTime) * 1000)); }
    ml.next += per; ml.beat++;
  }
}
function metroToggle() {
  if (ml.on) { ml.on = false; clearInterval(ml.timer); $("metroStart").textContent = "▶ Start"; document.querySelectorAll("#metroDots i").forEach((d) => d.classList.remove("on")); return; }
  audio(); ml.on = true; ml.beat = 0; ml.next = ctx.currentTime + 0.08;
  ml.timer = setInterval(sched, 25); sched();
  $("metroStart").textContent = "⏹ Stop";
}

/* ---------------- Wiring ---------------- */
export function initTools() {
  $("tunerRoot").innerHTML = tunerHTML();
  $("metroRoot").innerHTML = metroHTML();
  syncTargets(); dots();
  $("tunerStart").addEventListener("click", startMic);
  $("tunerA4").addEventListener("change", () => { const v = +$("tunerA4").value; tset.a4 = v >= 415 && v <= 466 ? v : 440; $("tunerA4").value = tset.a4; saveJ(TKEY, tset); });
  $("tunerStrings").addEventListener("click", (e) => { const b = e.target.closest("[data-target]"); if (!b) return; tset.target = b.dataset.target; saveJ(TKEY, tset); syncTargets(); });
  $("tunerTones").addEventListener("click", (e) => { const b = e.target.closest("[data-tone]"); if (b) playTone(+b.dataset.tone); });
  $("metroRoot").addEventListener("click", (e) => {
    const b = e.target.closest("[data-bpm]"); if (b) setBpm(mset.bpm + +b.dataset.bpm);
    const p = e.target.closest("[data-preset]"); if (p) setBpm(+p.dataset.preset);
  });
  $("metroRange").addEventListener("input", () => setBpm(+$("metroRange").value));
  $("metroStart").addEventListener("click", metroToggle);
  $("metroBeats").addEventListener("change", () => { mset.beats = +$("metroBeats").value; saveJ(MKEY, mset); dots(); });
  $("metroSub").addEventListener("change", () => { mset.sub = +$("metroSub").value; saveJ(MKEY, mset); });
  $("metroAccent").addEventListener("click", () => { mset.accent = !mset.accent; saveJ(MKEY, mset); $("metroAccent").setAttribute("aria-pressed", String(mset.accent)); });
  document.addEventListener("visibilitychange", () => { if (document.hidden) { stopMic(); stopTone(); } });
}
export function leftTuner() { stopMic(); stopTone(); }
export function leftMetro() { if (ml.on) metroToggle(); }
