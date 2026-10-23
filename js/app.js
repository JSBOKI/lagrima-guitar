import { MEASURES, PIECE } from "./data.js";
import { buildTex } from "./texgen.js";
import { buildEvents, motion, measure, ROMAN, RH_NAME, BEAT_LABEL } from "./events.js";
import { fretboardSVG, LH_COLORS, RH_COLORS } from "./fretboard.js";
import { tabstripSVG } from "./tabstrip.js";
import { handSVG, strokeSVG } from "./hand.js";
import { learnHTML, wireVideos } from "./learn.js";
import * as plan from "./plan.js";
import { pluck, audioCtx } from "./pluck.js";
import * as course from "./course.js";
import * as tools from "./tools.js";
import { LESSONS, UNITS } from "./course-data.js";
import * as trainer from "./trainer.js";
import { renderChordLibrary } from "./chordpage.js";

const $ = (id) => document.getElementById(id);
const STRN = { 1: "1st", 2: "2nd", 3: "3rd", 4: "4th", 5: "5th", 6: "6th" };
const state = { from: 1, to: 16, full: true, events: [], cur: 0, view: "hub", colorMode: "lh", show: "both", flip: false,
  loop: true, metro: false, tempo: 60, playing: false, ready: false, beatMap: new Map(), api: null, stepSound: true };
window.__lagrima = state; // for testing/debugging

/* ---------------- Views & navigation ---------------- */
const LAGRIMA = new Set(["home", "score", "lh", "rh", "learn"]);
function chrome(view) {
  const map = {
    hub: ["Guitar Coach", "Lágrima · fingerpicking · notes", "Home"],
    home: ["Lágrima", "Tárrega · Preludio", "Plan"],
    score: ["Lágrima", "Tárrega · Preludio", "Score"],
    lh: ["Lágrima", "Tárrega · Preludio", "Left hand"],
    rh: ["Lágrima", "Tárrega · Preludio", "Right hand"],
    learn: ["Lágrima", "Tárrega · Preludio", "Learn"],
    course: ["Fingerpicking", "Folk & Appalachian", "Course"],
    trainer: ["Fretboard", "Notes on the neck", "Trainer"],
    songs: ["Songs", "Classical · Folk · Rock/Pop", "Songs"],
    technique: ["Learn", "Technique & courses", "Learn"],
    chords: ["Chord library", "Every chord in the app", "Chords"],
    tools: ["Practice tools", "Tuner · metronome · fretboard", "Tools"],
    tuner: ["Tuner", "Standard tuning · E A D G B E", "Tuner"],
    metronome: ["Metronome", "Keep time", "Metronome"],
  };
  const row = view === "course" ? [...course.brandFor(), "Course"] : map[view] || map.hub;
  $("brandTitle").textContent = row[0];
  $("brandSub").textContent = row[1];
  if (!["score", "lh", "rh"].includes(view)) $("whereLabel").textContent = row[2];
}
function renderHub() {
  const pst = plan.load();
  const pct = plan.progressPct(pst);
  const sk = plan.streak(pst);
  $("hubRingFg").style.strokeDashoffset = String(119.4 * (1 - pct / 100));
  $("hubRingText").textContent = pct + "%";
  $("hubLagrima").textContent = sk > 0 ? `Lágrima plan · ${pct}% learned · ${sk}-day streak` : `Lágrima plan · ${pct}% of the sections learned`;
  const cs = course.stats();
  $("hubCourse").textContent = cs.done ? `${cs.done} of ${cs.total} lessons complete` : "Start with right-hand posture";
  const ts = trainer.stats();
  $("hubTrainer").textContent = ts.correct ? `${ts.correct} right · best streak ${ts.best}${ts.weak ? " · shaky: " + ts.weak : ""}` : "Standard tuning · frets 0–12";
}
const SECTION = { hub: "hub", songs: "songs", technique: "technique", course: "technique", tools: "tools", tuner: "tools", metronome: "tools", trainer: "tools", chords: "tools" };
function goto(view) {
  if (!document.querySelector(`.view[data-view="${view}"]`)) view = "hub";
  state.view = view;
  document.querySelectorAll(".view").forEach((v) => v.classList.toggle("active", v.dataset.view === view));
  const lagrima = LAGRIMA.has(view);
  $("tabs").hidden = !lagrima;
  $("tabsApp").hidden = lagrima;
  document.querySelectorAll("#tabs button").forEach((b) => b.classList.toggle("active", b.dataset.goto === view));
  document.querySelectorAll("#tabsApp button").forEach((b) => b.classList.toggle("active", b.dataset.goto === (SECTION[view] || view)));
  const practice = ["score", "lh", "rh"].includes(view);
  document.body.classList.toggle("show-dock", practice);
  if (view !== "course") course.left();
  chrome(view);
  window.scrollTo(0, 0);
  if (view === "home") renderHome();
  if (view === "hub") renderHub();
  if (view === "course") course.entered();
  if (view === "songs") renderSongs();
  if (view === "technique") renderTech();
  if (view === "chords") renderChordLibrary($("chordsRoot"));
  if (view !== "tuner") tools.leftTuner();
  if (view !== "metronome") tools.leftMetro();
  if (view === "trainer") trainer.entered();
  else trainer.left();
  if (practice) renderCurrent();
  if (!practice && state.playing && state.api) state.api.pause();
}
document.addEventListener("click", (e) => { const g = e.target.closest("[data-goto]"); if (g) { e.preventDefault(); goto(g.dataset.goto); } });

/* ---------------- Songs & Learn hubs ---------------- */
// Genre for every song-like course lesson. Unit 9 tunes are folk; Unit 10 is a rock/pop song study.
const SONG_GROUPS = [
  { id: "classical", title: "Classical", items: [{ kind: "lagrima" }] },
  { id: "classical2", title: "", song: "Asturias (Leyenda)", sub: "Albéniz · Segovia’s guitar version in E minor · no capo", items: LESSONS.filter((l) => l.unit === "u11").map((l) => ({ kind: "lesson", id: l.id })) },
  { id: "folk", title: "Folk & Appalachian", items: LESSONS.filter((l) => l.unit === "u9").map((l) => ({ kind: "lesson", id: l.id })) },
  { id: "rock", title: "Rock / Pop", song: "Every Breath You Take", sub: "The Police · Sting · A♭ · ~117 bpm", items: LESSONS.filter((l) => l.unit === "u10").map((l) => ({ kind: "lesson", id: l.id })) },
];
const escH = (t) => String(t).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
function renderSongs() {
  const pct = plan.progressPct(plan.load());
  $("songsRoot").innerHTML = `<div class="card hero"><div><h2>Songs</h2><p class="muted">The pieces you’re learning, by genre. Technique units and drills live under <a href="#" data-goto="technique">Learn</a>.</p></div></div>` +
    SONG_GROUPS.map((g) => `${g.title ? `<div class="group-h">${escH(g.title)}</div>` : ""}<div class="card">${g.song ? `<h3>${escH(g.song)}</h3><p class="small muted">${escH(g.sub)} · ${g.items.length} lessons</p>` : ""}<ul class="song-list">${g.items.map((it) => {
      if (it.kind === "lagrima") return `<li><div><div class="t">Lágrima — Tárrega</div><div class="meta">Score · left hand · right hand · daily plan · ${pct}% learned</div></div><button class="btn tiny" type="button" data-goto="home">Open</button></li>`;
      const l = LESSONS.find((x) => x.id === it.id), st = course.lessonState(it.id);
      return `<li><div><div class="t">${escH(l.title)}</div><div class="meta">${st.done ? "✓ complete" : st.unlocked ? "ready" : "course unit not finished yet — open anyway"} · ${l.goals[0]}→${l.goals[l.goals.length - 1]} bpm</div></div><button class="btn tiny" type="button" data-song="${l.id}">Open</button></li>`;
    }).join("")}</ul></div>`).join("");
}
function renderTech() {
  const cs = course.stats();
  const techUnits = UNITS.filter((u) => !["u9", "u10", "u11"].includes(u.id));
  $("techRoot").innerHTML = `<div class="card hero"><div><h2>Learn</h2><p class="muted">Technique, courses and exercises. Songs are in <a href="#" data-goto="songs">Songs</a>; tuner, metronome and the fretboard trainer are in <a href="#" data-goto="tools">Tools</a>.</p></div></div>
    <div class="group-h">Fingerpicking course · steel string</div>
    <button class="card hub-card" type="button" data-goto="course"><div class="kicker">${cs.done} of ${cs.total} lessons · ${cs.units}/${cs.unitTotal} units</div><h2>🪕 Fingerpicking course</h2>
      <p>${techUnits.map((u, i) => `${i + 1}. ${escH(u.title)}`).join(" · ")}</p><p class="go">Open the course (units, progress, locks)</p></button>
    <div class="group-h">Chords</div>
    <button class="card hub-card" type="button" data-goto="chords"><div class="kicker">Diagrams · fingering · transitions</div><h2>🎼 Chord library</h2><p>Every chord used in the app with a diagram and a short how-to-play lesson.</p></button>
    <div class="group-h">Classical technique (from Lágrima)</div>
    <div class="card"><ul class="song-list">
      <li><div><div class="t">🤚 Left hand</div><div class="meta">Fretboard view per bar, finger tips, shifts, half barre</div></div><button class="btn tiny" type="button" data-goto="lh">Open</button></li>
      <li><div><div class="t">✋ Right hand</div><div class="meta">p·i·m·a, free vs rest stroke, voice balance</div></div><button class="btn tiny" type="button" data-goto="rh">Open</button></li>
      <li><div><div class="t">📚 Sources &amp; videos</div><div class="meta">Background, editions and recommended lessons</div></div><button class="btn tiny" type="button" data-goto="learn">Open</button></li>
    </ul></div>
    <div class="group-h">Song-specific drills</div>
    <div class="card"><p class="small">The “Every Breath You Take” add9 stretch and arpeggio drills are with the song under <a href="#" data-goto="songs">Songs › Rock / Pop</a>; the Asturias pedal, tremolo-style and rasgueado drills are under Songs › Classical.</p></div>`;
}
document.addEventListener("click", (e) => { const b = e.target.closest("[data-song]"); if (b) { goto("course"); course.openLesson(b.dataset.song, { force: true, back: "songs" }); } });
window.addEventListener("guitar-goto", (e) => goto(e.detail));

/* ---------------- Range / score loading ---------------- */
function renderRangeBar() {
  const bar = $("rangeBar"); const o = [];
  for (const s of plan.SECTIONS) {
    const on = s.from === state.from && s.to === state.to && !!s.full === state.full;
    o.push(`<button class="chip ${on ? "on" : ""}" data-range="${s.from}-${s.to}-${s.full ? 1 : 0}">${s.full ? "Whole piece" : "Bars " + s.from + "–" + s.to}</button>`);
  }
  const opt = (sel) => MEASURES.map((m) => `<option value="${m.n}" ${m.n === sel ? "selected" : ""}>${m.n}</option>`).join("");
  o.push(`<span class="custom">Bars <select id="rFrom" aria-label="From bar">${opt(state.from)}</select>–<select id="rTo" aria-label="To bar">${opt(state.to)}</select></span>`);
  bar.innerHTML = o.join("");
}
$("rangeBar").addEventListener("click", (e) => { const b = e.target.closest("[data-range]"); if (!b) return; const [f, t, full] = b.dataset.range.split("-").map(Number); setRange(f, t, !!full); });
$("rangeBar").addEventListener("change", () => { let f = +$("rFrom").value, t = +$("rTo").value; if (t < f) [f, t] = [t, f]; setRange(f, t, false); });

function setRange(from, to, full, keepEvent) {
  if (state.playing && state.api) state.api.stop();
  state.dcPass = false; if (state.api) { try { state.api.playbackRange = null; } catch {} }
  state.from = from; state.to = to; state.full = full && from === 1 && to === 16;
  state.events = buildEvents(from, to);
  state.cur = 0;
  if (keepEvent) { const i = state.events.findIndex((e) => e.key === keepEvent); if (i >= 0) state.cur = i; }
  renderRangeBar(); loadScore(); renderCurrent();
}

function currentTex() {
  const show = state.show;
  return buildTex(MEASURES, PIECE, { from: state.from, to: state.to, repeats: state.full, barNums: !state.full && state.from > 1, lf: show === "both" || show === "lh", rf: show === "both" || show === "rh" });
}
function loadScore() { if (!state.api) return; $("scoreLoading").hidden = false; const nums = state.full || state.from === 1; if (state.api.settings.notation.elements.get(alphaTab.NotationElement.BarNumber) !== nums) { state.api.settings.notation.elements.set(alphaTab.NotationElement.BarNumber, nums); state.api.updateSettings(); } state.api.tex(currentTex()); }

function applyColors(score) {
  const mode = state.colorMode; if (mode === "none") return;
  const M_ = alphaTab.model; const staff = score.tracks[0].staves[0];
  staff.bars.forEach((bar, bi) => {
    const M = measure(state.from + bi); if (!M) return;
    bar.voices.forEach((voice, vi) => voice.beats.forEach((beat) => {
      const slot = Math.round(beat.displayStart / 480);
      beat.notes.forEach((note) => {
        const s = 7 - note.string; const t = M.notes.find((x) => x[0] === slot && x[1] === vi + 1 && x[2] === s); if (!t) return;
        const hex = mode === "lh" ? LH_COLORS[t[4]] : (t[5] ? RH_COLORS[t[5]] : "#9ca3af");
        const c = M_.Color.fromJson(hex); const st = new M_.NoteStyle();
        st.colors.set(M_.NoteSubElement.StandardNotationNoteHead, c); st.colors.set(M_.NoteSubElement.GuitarTabFretNumber, c); st.colors.set(M_.NoteSubElement.Effects, c);
        note.style = st;
      });
    }));
  });
}
function indexBeats(score) {
  state.beatMap = new Map();
  const staff = score.tracks[0].staves[0];
  staff.bars.forEach((bar, bi) => bar.voices.forEach((voice) => voice.beats.forEach((beat) => {
    if (beat.isRest) return; const key = (state.from + bi) + ":" + Math.round(beat.displayStart / 480);
    if (!state.beatMap.has(key)) state.beatMap.set(key, []); state.beatMap.get(key).push(beat);
  })));
}
function beatKey(beat) { return (state.from + beat.voice.bar.index) + ":" + Math.round(beat.displayStart / 480); }
function tickFor(ev) {
  const beats = state.beatMap.get(ev.key); if (!beats || !beats.length) return null;
  const b = beats[0]; const tc = state.api && state.api.tickCache;
  try { return tc ? tc.getMasterBarStart(b.voice.bar.masterBar) + b.playbackStart : b.absolutePlaybackStart; } catch { return b.absolutePlaybackStart; }
}
function renderScoreLegend() {
  const L = state.colorMode === "lh" ? [0, 1, 2, 3, 4].map((f) => `<span><i style="background:${LH_COLORS[f]}"></i>${f === 0 ? "open" : "finger " + f}</span>`)
    : state.colorMode === "rh" ? Object.entries(RH_COLORS).map(([k, c]) => `<span><i style="background:${c}"></i>${k} = ${RH_NAME[k]}</span>`) : [];
  $("scoreLegend").innerHTML = L.join("") + (state.show !== "none" ? `<span>· numbers next to notes = LH fingers, p i m a = RH</span>` : "");
}

function initAlphaTab() {
  const base = new URL(".", location.href);
  const narrow = window.innerWidth < 560;
  const api = new alphaTab.AlphaTabApi($("alphaTab"), {
    core: { fontDirectory: new URL("vendor/alphatab/font/", base).href, scriptFile: new URL("vendor/alphatab/alphaTab.min.js", base).href },
    display: { layoutMode: "page", barsPerRow: narrow ? 2 : 4, scale: narrow ? 0.78 : 0.95, staveProfile: "scoretab" },
    notation: { elements: { scoreTitle: false, scoreSubTitle: false, scoreArtist: false, trackNames: false, scoreWordsAndMusic: false, guitarTuning: false, effectDynamics: false } },
    player: { playerMode: "enabledSynthesizer", soundFont: new URL("vendor/alphatab/soundfont/sonivox.sf2", base).href, enableCursor: true, enableAnimatedBeatCursor: true,
      enableElementHighlighting: true, enableUserInteraction: true, scrollOffsetY: -130, scrollMode: "continuous" },
  });
  state.api = api;
  api.scoreLoaded.on((score) => { applyColors(score); indexBeats(score); });
  api.renderFinished.on(() => { $("scoreLoading").hidden = true; });
  api.soundFontLoad.on((e) => { const p = e.total ? Math.round((e.loaded / e.total) * 100) : 0; setStatus(`Loading guitar sound… ${p}%`); });
  api.playerReady.on(() => { state.ready = true; applyPlayerSettings(); setStatus("Ready · ▶ plays · ◀ ▶ step note by note · iPhone: turn silent mode off"); });
  api.playerStateChanged.on((e) => { state.playing = e.state === 1; $("btnPlay").textContent = state.playing ? "❚❚" : "▶"; $("btnPlay").setAttribute("aria-label", state.playing ? "Pause" : "Play"); if (state.playing) setStatus(state.dcPass ? `D.C. al Fine: bars 1–8 to Fine at ${state.tempo}%` : `Playing bars ${state.from}–${state.to}${state.full ? " with repeats, then D.C. al Fine" : ""} at ${state.tempo}%${state.loop ? " · looping" : ""}`); });
  api.activeBeatsChanged.on((e) => {
    if (!state.playing || !e.activeBeats.length) return;
    let best = null; for (const b of e.activeBeats) { const k = beatKey(b); const [n, s] = k.split(":").map(Number); const v = n * 10 + s; if (!best || v > best.v) best = { v, k }; }
    let i = state.events.findIndex((ev) => ev.key === best.k);
    if (i < 0) { const target = best.v; for (let j = state.events.length - 1; j >= 0; j--) { const ev = state.events[j]; if (ev.n * 10 + ev.slot <= target) { i = j; break; } } }
    if (i >= 0 && i !== state.cur) { state.cur = i; renderCurrent(); }
  });
  api.playerFinished.on(() => {
    if (!state.full) return;
    const A_END = 8 * 3 * 960; // end of bar 8 on the first pass
    if (!state.dcPass) { state.dcPass = true; setTimeout(() => { api.playbackRange = { startTick: 0, endTick: A_END }; api.tickPosition = 0; api.play(); }, 60); }
    else { state.dcPass = false; setTimeout(() => { api.playbackRange = null; api.tickPosition = 0; if (state.loop) api.play(); else setStatus("Fine – the end. Bravo!"); }, 60); }
  });
  api.beatMouseDown.on((beat) => { const k = beatKey(beat); const i = state.events.findIndex((ev) => ev.key === k); if (i >= 0) step(i - state.cur, true); });
  api.error.on((err) => { console.error(err); setStatus("Notation/audio error: " + (err && err.message ? err.message : err)); });
  loadScore();
}
function applyPlayerSettings() {
  const api = state.api; if (!api) return;
  api.playbackSpeed = state.tempo / 100; api.isLooping = state.full ? false : state.loop; api.metronomeVolume = state.metro ? 1 : 0; api.countInVolume = 0;
}
function setStatus(t) { $("status").textContent = t; }

/* ---------------- Step mode ---------------- */
function step(delta, sound = true) {
  const n = state.events.length; if (!n) return;
  let i = state.cur + delta; if (i < 0) i = state.loop ? n - 1 : 0; if (i >= n) i = state.loop ? 0 : n - 1;
  state.cur = i; const ev = state.events[i];
  if (state.api && state.playing) state.api.pause();
  const tk = tickFor(ev); if (tk != null && state.api && state.ready) { try { state.api.tickPosition = tk; } catch {} }
  if (sound && state.stepSound) pluck(ev.onsets.map((x) => x.midi), { accent: ev.onsets.filter((x) => x.v === 1).map((x) => x.midi) });
  renderCurrent();
}
function stepBar(dir) {
  const ev = state.events[state.cur]; if (!ev) return;
  let target = ev.n + dir; if (target < state.from) target = state.to; if (target > state.to) target = state.from;
  const i = state.events.findIndex((e) => e.n === target); if (i >= 0) step(i - state.cur, true);
}

/* ---------------- Rendering current event ---------------- */
function describeNote(x) { return `${x.name} · ${STRN[x.s]} string, ${x.f === 0 ? "open" : "fret " + x.f}`; }
function renderCurrent() {
  const ev = state.events[state.cur]; if (!ev) return;
  const prev = state.cur > 0 ? state.events[state.cur - 1] : null;
  const mot = motion(prev && prev.n <= ev.n ? prev : null, ev);
  const M = ev.M;
  $("whereLabel").textContent = `Bar ${ev.n} · beat ${BEAT_LABEL[ev.slot] === "&" ? BEAT_LABEL[ev.slot - 1] + "&" : BEAT_LABEL[ev.slot]}`;
  // dock "now" strip
  $("nowStrip").innerHTML = ev.onsets.map((x) => `<span class="pill">${x.name}${x.lf > 0 ? ` <b style="background:${LH_COLORS[x.lf]}">${x.lf}</b>` : " <b style=\"background:#9ca3af\">0</b>"}${x.rf ? ` <b style="background:${RH_COLORS[x.rf]}">${x.rf}</b>` : ""}</span>`).join("") + `<span class="small muted">${state.cur + 1}/${state.events.length}</span>`;
  // LEFT HAND
  $("lhTitle").textContent = `Left hand · Bar ${ev.n}, beat ${BEAT_LABEL[ev.slot] === "&" ? BEAT_LABEL[ev.slot - 1] + "&" : BEAT_LABEL[ev.slot]}`;
  const badges = [`<span class="badge">Position ${ev.pos ? ROMAN[ev.pos] : "open"}</span>`];
  if (mot.shift) badges.push(`<span class="badge shift">Shift ${ROMAN[mot.shift.from]} → ${ROMAN[mot.shift.to]}</span>`);
  if (ev.barre) badges.push(`<span class="badge barre">${ev.barre.label}</span>`);
  for (const g of mot.guides) badges.push(`<span class="badge guide">${g.slide ? "Slide" : "Guide finger"} ${g.finger}: ${STRN[g.s]} string ${g.from} → ${g.to}</span>`);
  if (ev.onsets.some((x) => x.ex.h) || M.notes.some((t) => t[0] === ev.slot - 1 && t[7] && t[7].h)) badges.push(`<span class="badge slur">Slur (ligado)</span>`);
  if (ev.onsets.some((x) => x.ex.sl)) badges.push(`<span class="badge guide">Slide next ↗</span>`);
  if (ev.onsets.some((x) => x.ex.s)) badges.push(`<span class="badge">s = suggested fingering</span>`);
  $("lhBadges").innerHTML = badges.join("");
  $("fretboard").innerHTML = fretboardSVG(ev, mot, state.flip);
  $("boardCaption").textContent = state.flip ? "Tab view: 1st string (thin, high e) on top – matches the tab. Nut on the left." : "Player’s view (right-handed): looking down at your neck – 6th string (thick, low E) on top, 1st string (thin, high e) at the bottom. Nut/headstock on the left.";
  $("flipLabel").textContent = state.flip ? "Tab view" : "Player’s view";
  $("lhLegend").innerHTML = [1, 2, 3, 4].map((f) => `<span><i style="background:${LH_COLORS[f]}"></i>finger ${f}</span>`).join("") + `<span><i style="background:#fff;border:2px solid #2a211b"></i>0 = open string</span><span>faded = still holding</span>`;
  $("tabstripLH").innerHTML = tabstripSVG(M, ev.slot, "lh", state.events);
  $("lhTip").textContent = M.lh;
  $("lhFlag").hidden = !M.flag; $("lhFlag").textContent = M.flag ? "⚠︎ Source note: " + M.flag : "";
  // RIGHT HAND
  $("rhTitle").textContent = `Right hand · Bar ${ev.n}, beat ${BEAT_LABEL[ev.slot] === "&" ? BEAT_LABEL[ev.slot - 1] + "&" : BEAT_LABEL[ev.slot]}`;
  $("handDiagram").innerHTML = handSVG(ev);
  const now = ev.onsets.filter((x) => x.rf).map((x) => `<b style="color:${RH_COLORS[x.rf]}">${x.rf}</b> plays ${describeNote(x)}${x.ex.rs ? " (rest stroke OK)" : ""}`);
  const lig = ev.onsets.filter((x) => !x.rf).map((x) => `${x.name} sounds by left-hand slur – no pluck`);
  $("rhNow").innerHTML = "Now: " + [...now, ...lig].join(" · ");
  $("tabstripRH").innerHTML = tabstripSVG(M, ev.slot, "rh", state.events);
  $("rhLegend").innerHTML = Object.entries(RH_COLORS).map(([k, c]) => `<span><i style="background:${c}"></i>${k} = ${RH_NAME[k]}</span>`).join("") + `<span><span class="rs">R</span> rest stroke suggested</span>`;
  $("rhTip").textContent = M.rh + " (Right-hand fingering is suggested – the original edition prints none.)";
}

/* ---------------- Home / practice plan ---------------- */
function renderHome() {
  const st = plan.load(); const pct = plan.progressPct(st);
  $("ringFg").style.strokeDashoffset = String(119.4 * (1 - pct / 100)); $("ringText").textContent = pct + "%";
  const sk = plan.streak(st);
  $("streakText").textContent = sk > 0 ? `🔥 ${sk}-day practice streak. Keep it going!` : "Let’s learn Lágrima, one small section at a time.";
  const dp = plan.dailyPlan(st);
  $("todayDate").textContent = new Date().toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  $("todayPlan").innerHTML = dp.steps.map((s) => `<li>${s}</li>`).join("");
  $("todayStart").dataset.section = dp.focus.id; $("todayStart").dataset.tempo = dp.tempo;
  $("todayDone").textContent = st.days.includes(plan.today()) ? "✓ Done today – nice!" : "✓ I practised today";
  $("sectionList").innerHTML = plan.SECTIONS.map((s) => {
    const on = !!st.learned[s.id]; const c = st.count[s.id] || 0;
    return `<li><div><div class="t">${s.title}</div><div class="meta">${c ? `practised ${c}×` : "not started"}${st.last[s.id] ? " · last " + st.last[s.id] : ""}</div></div>
      <div class="acts"><button class="btn tiny" data-practise="${s.id}">Practise</button><label class="learned ${on ? "on" : ""}"><input type="checkbox" data-learned="${s.id}" ${on ? "checked" : ""}>Learned</label></div>
      <div class="d">${s.desc}</div></li>`;
  }).join("");
}
function practise(id, tempo) {
  const s = plan.SECTIONS.find((x) => x.id === id); if (!s) return;
  const st = plan.load(); st.count[id] = (st.count[id] || 0) + 1; st.last[id] = plan.today(); plan.save(st);
  if (tempo) { state.tempo = +tempo; $("tempo").value = state.tempo; updateTempoLabel(); applyPlayerSettings(); }
  state.loop = !s.full; syncToggles();
  setRange(s.from, s.to, !!s.full); goto("score");
}
$("sectionList").addEventListener("click", (e) => { const b = e.target.closest("[data-practise]"); if (b) practise(b.dataset.practise); });
$("sectionList").addEventListener("change", (e) => { const c = e.target.closest("[data-learned]"); if (!c) return; const st = plan.load(); st.learned[c.dataset.learned] = c.checked; plan.save(st); renderHome(); });
$("todayStart").addEventListener("click", () => practise($("todayStart").dataset.section, $("todayStart").dataset.tempo));
$("todayDone").addEventListener("click", () => { const st = plan.load(); if (!st.days.includes(plan.today())) st.days.push(plan.today()); plan.save(st); renderHome(); });

/* ---------------- Controls ---------------- */
function updateTempoLabel() { $("tempoVal").textContent = state.tempo + "%"; $("tempo").setAttribute("aria-valuetext", `${state.tempo}% (${Math.round(PIECE.tempo * state.tempo / 100)} beats per minute)`); }
function syncToggles() { $("btnLoop").setAttribute("aria-pressed", String(state.loop)); $("btnMetro").setAttribute("aria-pressed", String(state.metro)); applyPlayerSettings(); }
$("tempo").addEventListener("input", () => { state.tempo = +$("tempo").value; updateTempoLabel(); applyPlayerSettings(); });
$("btnLoop").addEventListener("click", () => { state.loop = !state.loop; syncToggles(); });
$("btnMetro").addEventListener("click", () => { state.metro = !state.metro; syncToggles(); });
$("btnPlay").addEventListener("click", () => {
  audioCtx();
  if (!state.api || !state.ready) { setStatus("Sound is still loading – one moment…"); return; }
  applyPlayerSettings(); state.api.playPause();
});
$("btnNext").addEventListener("click", () => step(1));
$("btnPrev").addEventListener("click", () => step(-1));
$("btnNextBar").addEventListener("click", () => stepBar(1));
$("btnPrevBar").addEventListener("click", () => stepBar(-1));
$("flipBoard").addEventListener("click", () => { state.flip = !state.flip; localStorage.setItem("lagrima.flip", state.flip ? "1" : "0"); renderCurrent(); });
$("colorMode").addEventListener("change", () => { state.colorMode = $("colorMode").value; renderScoreLegend(); loadScore(); });
$("showFingers").addEventListener("change", () => { state.show = $("showFingers").value; renderScoreLegend(); loadScore(); });
for (const id of ["tabstripLH", "tabstripRH"]) $(id).addEventListener("click", (e) => {
  const col = e.target.closest("[data-slot]"); const ev = state.events[state.cur]; if (!col || !ev) return;
  const i = state.events.findIndex((x) => x.n === ev.n && x.slot === +col.dataset.slot); if (i >= 0) step(i - state.cur, true);
});
document.addEventListener("keydown", (e) => {
  if (e.target.closest("input,select,textarea")) return;
  if (state.view === "course") { if (e.key === " " && !e.target.closest("button")) { e.preventDefault(); course.coursePlayClick(); } return; }
  if (!["score", "lh", "rh", "home"].includes(state.view)) return;
  if (e.key === "ArrowRight") step(1);
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === " ") { e.preventDefault(); $("btnPlay").click(); }
});

/* ---------------- Boot ---------------- */
state.flip = localStorage.getItem("lagrima.flip") === "1";
$("strokeDiagram").innerHTML = strokeSVG();
$("learnContent").innerHTML = learnHTML(); wireVideos($("learnContent"));
updateTempoLabel(); renderScoreLegend();
state.events = buildEvents(1, 16); renderRangeBar(); renderCurrent(); renderHome();
course.initCourse();
trainer.initTrainer();
window.addEventListener("guitar-progress", () => { if (state.view === "hub") renderHub(); });
tools.initTools();
goto("hub");
// Deep links: #lesson=<id> opens a course lesson; #view=<name> (or #tuner, #songs …) opens a screen.
function routeHash() {
  const h = location.hash;
  const deep = h.match(/^#lesson=([\w-]+)/);
  if (deep) {
    // Already on the course screen: open the lesson directly. Re-entering would re-render the old score while
    // the new one loads, which made alphaTab throw “Cannot read properties of undefined”.
    if (state.view !== "course") goto("course");
    course.openLesson(deep[1], { force: true });
    return;
  }
  const v = h.match(/^#(?:view=)?([a-z]+)$/);
  if (v && document.querySelector(`.view[data-view="${v[1]}"]`)) goto(v[1]);
}
routeHash();
window.addEventListener("hashchange", routeHash);
if (window.alphaTab) initAlphaTab(); else setStatus("Notation library failed to load.");
// Updates: the new service worker activates immediately (skipWaiting + clients.claim); when it takes over we
// reload straight away if nothing is playing, otherwise show a "new version" bar.
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  const hadController = !!navigator.serviceWorker.controller;
  let reloaded = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!hadController || reloaded) return;
    const busy = state.playing || document.body.classList.contains("show-course-dock") || state.view === "tuner" || state.view === "metronome";
    if (!busy) { reloaded = true; location.reload(); return; }
    if (document.getElementById("updateToast")) return;
    const t = document.createElement("div");
    t.className = "update-toast"; t.id = "updateToast";
    t.innerHTML = `<span>A new version of the app is ready.</span><button type="button">Reload</button>`;
    t.querySelector("button").addEventListener("click", () => { reloaded = true; location.reload(); });
    document.body.appendChild(t);
  });
  navigator.serviceWorker.register("sw.js", { updateViaCache: "none" }).then((reg) => {
    reg.update().catch(() => {});
    document.addEventListener("visibilitychange", () => { if (!document.hidden) reg.update().catch(() => {}); });
  }).catch(() => {});
}
