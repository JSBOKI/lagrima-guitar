// Guitarlele tuner: mic + YIN, auto-detects the nearest of the six guitarlele strings, plus reference tones.
import { GUITARLELE, midiToFreq, nearestString, yin } from "./pitch.js";

const $ = (id) => document.getElementById(id);
const KEY = "guitar.lele.v1";
const set = (() => { const d = { a4: 440 }; try { return Object.assign(d, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch { return d; } })();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(set)); } catch {} };
const STR = [...GUITARLELE].sort((a, b) => b.s - a.s); // 6 → 1 (low to high)
const POS = { 6: "thickest", 5: "", 4: "", 3: "", 2: "", 1: "thinnest" };

let ctx = null;
function audio() {
  if (!ctx) { const AC = window.AudioContext || window.webkitAudioContext; ctx = new AC(); }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}
const L = { stream: null, src: null, an: null, buf: null, raf: 0, on: false, hist: [], tone: null, toneTimer: 0 };

function html() {
  return `<div class="card lele">
    <h2>Guitarlele tuner</h2>
    <p class="lele-lead">Tuning, low to high: <b>A D G C E A</b>. Nothing is recorded or sent anywhere.</p>
    <button class="btn primary lele-big" type="button" id="leleStart">🎤 Start tuner</button>
    <p class="flag lele-msg" id="leleMsg" hidden></p>
  </div>
  <div class="card tuner-face lele">
    <div class="lele-string" id="leleString">Play one string</div>
    <div class="tuner-note lele-note"><span id="leleNote">–</span><small id="leleOct"></small></div>
    <div class="meter lele-meter" aria-hidden="true">
      <div class="meter-zone"></div>
      ${[-50, -25, 0, 25, 50].map((c) => `<span class="tick" style="left:${50 + c}%"><i>${c > 0 ? "+" + c : c}</i></span>`).join("")}
      <div class="needle" id="leleNeedle"></div>
    </div>
    <div class="lele-verdict" id="leleVerdict" role="status" aria-live="polite">&nbsp;</div>
    <div class="small muted" id="leleFreq">Tap Start, then pluck one string and let it ring.</div>
  </div>
  <div class="card lele">
    <h3>Listen to a string</h3>
    <p class="small muted">Tap to hear the note for 4 seconds (tap again to stop) and tune by ear.</p>
    <div class="lele-grid" id="leleTones">
      ${STR.map((s) => `<button class="lele-tone" type="button" data-tone="${s.s}"><span class="n">String ${s.s}</span><b>${s.name.slice(0, -1)}</b><span class="n">${s.name} · ${midiToFreq(s.midi).toFixed(0)} Hz${POS[s.s] ? " · " + POS[s.s] : ""}</span></button>`).join("")}
    </div>
    <div class="row gap wrap lele-cal">
      <span>A4 =</span>
      <button class="icon lele-step" type="button" data-a4="-1" aria-label="Lower A4">−</button>
      <b id="leleA4">${set.a4}</b><span>Hz</span>
      <button class="icon lele-step" type="button" data-a4="1" aria-label="Raise A4">+</button>
      <button class="chip" type="button" data-a4="0">Reset to 440</button>
    </div>
  </div>
  <div class="card lele lele-help">
    <h3>How to tune</h3>
    <ol>
      <li>Tap <b>Start tuner</b> and allow the microphone.</li>
      <li>Pluck one string and let it ring. The tuner finds which string it is.</li>
      <li><b style="color:#2563eb">Too low</b> → tighten that string’s peg a little. <b style="color:#dc2626">Too high</b> → loosen it a little. <b style="color:#16a34a">Green</b> = in tune.</li>
      <li>Follow the string from the nut up to its own peg before turning, so you turn the right one.</li>
      <li>Best habit: if it’s high, go a little below the note, then <b>tune up to it</b>. The string holds its pitch better.</li>
      <li>Do all six strings, then check them once more – changing one pulls slightly on the others.</li>
    </ol>
    <h3>Playing guitar chords on it</h3>
    <p>A guitarlele is a guitar with a capo on the 5th fret. Every guitar chord shape works – it just sounds a 4th higher.
      An <b>Am</b> shape sounds as <b>Dm</b>, <b>E</b> → <b>A</b>, <b>G</b> → <b>C</b>, <b>C</b> → <b>F</b>, <b>D</b> → <b>G</b>.
      Playing alone? Just use your usual shapes and names.</p>
  </div>`;
}
function msg(t) { $("leleMsg").hidden = !t; $("leleMsg").textContent = t || ""; }

async function start() {
  if (L.on) { stop(); return; }
  if (!window.isSecureContext || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    msg("The microphone needs a secure (https) page and a browser that supports it. You can still tune by ear with the string buttons below."); return;
  }
  stopTone();
  const ac = audio(); // must be created inside the tap on iPhone Safari
  try {
    L.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
  } catch (e) {
    const denied = e && (e.name === "NotAllowedError" || e.name === "SecurityError");
    msg(denied ? "Microphone access was blocked. On iPhone: tap “aA” in the address bar › Website Settings › Microphone › Allow (or Settings › Safari › Microphone), then tap Start again. Meanwhile you can tune by ear with the string buttons below."
      : "Couldn’t open a microphone (" + ((e && e.name) || "error") + "). Check no other app is using it. You can still tune by ear below.");
    return;
  }
  if (ac.state === "suspended") await ac.resume();
  L.src = ac.createMediaStreamSource(L.stream);
  L.an = ac.createAnalyser(); L.an.fftSize = 4096;
  L.src.connect(L.an);
  L.buf = new Float32Array(L.an.fftSize);
  L.on = true; L.hist = [];
  msg("");
  $("leleStart").textContent = "⏹ Stop tuner";
  loop();
}
function stop() {
  L.on = false; cancelAnimationFrame(L.raf);
  if (L.src) try { L.src.disconnect(); } catch {}
  if (L.stream) L.stream.getTracks().forEach((t) => t.stop());
  L.stream = L.src = L.an = null;
  if ($("leleStart")) $("leleStart").textContent = "🎤 Start tuner";
}
function show(freq) {
  const face = $("leleVerdict");
  if (!freq) { $("leleNeedle").style.opacity = ".25"; return; }
  const ns = nearestString(freq, set.a4, GUITARLELE);
  const cents = ns.cents;
  $("leleString").textContent = `String ${ns.s}`;
  $("leleNote").textContent = ns.name.slice(0, -1); $("leleOct").textContent = ns.name.slice(-1);
  $("leleFreq").textContent = `${freq.toFixed(1)} Hz · target ${midiToFreq(ns.midi, set.a4).toFixed(2)} Hz · ${cents >= 0 ? "+" : ""}${cents.toFixed(0)} cents`;
  const c = Math.max(-50, Math.min(50, cents));
  const n = $("leleNeedle"); n.style.opacity = "1"; n.style.left = (50 + c) + "%";
  const state = Math.abs(cents) <= 5 ? "ok" : cents < 0 ? "low" : "high";
  n.classList.toggle("ok", state === "ok");
  face.className = "lele-verdict " + state;
  $("leleNote").parentElement.dataset.state = state;
  face.textContent = state === "ok" ? "✓ In tune" : state === "low" ? `▲ Too low – tighten (${Math.abs(cents).toFixed(0)}¢)` : `▼ Too high – loosen (${Math.abs(cents).toFixed(0)}¢)`;
  document.querySelectorAll("#leleTones [data-tone]").forEach((b) => b.classList.toggle("near", b.dataset.tone === String(ns.s)));
}
function loop() {
  if (!L.on) return;
  L.an.getFloatTimeDomainData(L.buf);
  const r = L.tone ? null : yin(L.buf, ctx.sampleRate, { minFreq: 80, maxFreq: 1000 });
  if (r && r.clarity > 0.8) {
    L.hist.push(r.freq); if (L.hist.length > 5) L.hist.shift();
    const s = [...L.hist].sort((a, b) => a - b);
    show(s[Math.floor(s.length / 2)]); // median smooths octave glitches
  } else { if (L.hist.length) L.hist.shift(); if (!L.hist.length) show(null); }
  L.raf = requestAnimationFrame(loop);
}
function stopTone() {
  clearTimeout(L.toneTimer);
  if (L.tone && ctx) { const { oscs, g } = L.tone, t = ctx.currentTime; g.gain.cancelScheduledValues(t); g.gain.setTargetAtTime(0, t, 0.05); oscs.forEach((o) => o.stop(t + 0.3)); }
  L.tone = null;
  document.querySelectorAll("#leleTones [data-tone]").forEach((b) => b.setAttribute("aria-pressed", "false"));
}
function playTone(num) {
  const was = L.tone && L.tone.s === num;
  stopTone(); if (was) return;
  const ac = audio(), s = GUITARLELE.find((x) => x.s === num), f = midiToFreq(s.midi, set.a4), t = ac.currentTime;
  // Plucked-ish attack that settles into a steady, soft string-like tone (fundamental + a few harmonics).
  const g = ac.createGain(), lp = ac.createBiquadFilter();
  lp.type = "lowpass"; lp.frequency.setValueAtTime(4000, t); lp.frequency.setTargetAtTime(1500, t, 0.3);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.4, t + 0.008); g.gain.setTargetAtTime(0.16, t + 0.01, 0.35);
  const oscs = [[1, 1], [2, 0.45], [3, 0.2], [4, 0.1]].map(([h, a]) => {
    const o = ac.createOscillator(), og = ac.createGain(); o.frequency.value = f * h; og.gain.value = a;
    o.connect(og).connect(lp); o.start(t); return o;
  });
  lp.connect(g).connect(ac.destination);
  L.tone = { oscs, g, s: num };
  document.querySelector(`#leleTones [data-tone="${num}"]`).setAttribute("aria-pressed", "true");
  L.toneTimer = setTimeout(stopTone, 4000);
}
export function initGuitarlele() {
  $("leleRoot").innerHTML = html();
  $("leleStart").addEventListener("click", start);
  $("leleTones").addEventListener("click", (e) => { const b = e.target.closest("[data-tone]"); if (b) playTone(+b.dataset.tone); });
  $("leleRoot").addEventListener("click", (e) => {
    const b = e.target.closest("[data-a4]"); if (!b) return;
    const d = +b.dataset.a4; set.a4 = d ? Math.max(415, Math.min(466, set.a4 + d)) : 440;
    $("leleA4").textContent = set.a4; save();
  });
  document.addEventListener("visibilitychange", () => { if (document.hidden) leftGuitarlele(); });
}
export function leftGuitarlele() { stop(); stopTone(); }
