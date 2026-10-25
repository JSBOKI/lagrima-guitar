import * as inst from "./instrument.js";
import { LESSONS, UNITS } from "./course-data.js";
import { lessonTex, validateAll } from "./coursetex.js";
import { TUNINGS } from "./notes.js";
import { RH_COLORS } from "./fretboard.js";
import { handsHTML } from "./handguide.js";
import { CHORD_LIB } from "./chordlib.js";
import { ebytMediaHTML } from "./ebytmedia.js";

const KEY = "guitar.course.v1";
const $ = (id) => document.getElementById(id);

function load() {
  try { return Object.assign({ done: {}, goals: {} }, JSON.parse(localStorage.getItem(KEY) || "{}")); }
  catch { return { done: {}, goals: {} }; }
}
function save(st) {
  try { localStorage.setItem(KEY, JSON.stringify(st)); } catch {}
  window.dispatchEvent(new Event("guitar-progress"));
}
function lessonsIn(unitId) { return LESSONS.filter((l) => l.unit === unitId); }
function unitIndex(id) { return UNITS.findIndex((u) => u.id === id); }
export function unitUnlocked(unitId, st = load()) {
  const i = unitIndex(unitId);
  if (i <= 0 || UNITS[i].open) return true;
  return lessonsIn(UNITS[i - 1].id).every((l) => st.done[l.id]);
}
function lessonUnlocked(lesson, st = load()) { return lesson.id === ui.forced || unitUnlocked(lesson.unit, st); }
export function lessonState(id) { const l = LESSONS.find((x) => x.id === id); const st = load(); return l ? { done: !!st.done[id], unlocked: unitUnlocked(l.unit, st) } : null; }

export function stats() {
  const st = load();
  const done = LESSONS.filter((l) => st.done[l.id]).length;
  const units = UNITS.filter((u) => lessonsIn(u.id).every((l) => st.done[l.id])).length;
  return { done, total: LESSONS.length, units, unitTotal: UNITS.length };
}

const ui = { rendering: false, pendingTex: false, back: null, forced: null, lessonId: null, api: null, ready: false, playing: false, bpm: 60, loop: true, metro: false, countIn: true };

function esc(s) { return String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])); }

function renderList() {
  if (document.getElementById("brandTitle") && document.body.querySelector('.view.active[data-view="course"]')) { $("brandTitle").textContent = BRAND.default[0]; $("brandSub").textContent = BRAND.default[1]; }
  const st = load();
  const s = stats();
  const issues = validateAll();
  const units = UNITS.map((u, i) => {
    const open = unitUnlocked(u.id, st);
    const ls = lessonsIn(u.id);
    const n = ls.filter((l) => st.done[l.id]).length;
    const rows = ls.map((l) => {
      const on = !!st.done[l.id];
      return `<li class="${open ? "" : "locked"}">
        <div><div class="t">${esc(l.title)}</div><div class="meta">${on ? "complete" : open ? "ready" : "locked"} · ${l.goals[0]} then ${l.goals[l.goals.length - 1]} bpm</div></div>
        <div class="acts">${open ? `<button class="btn tiny" type="button" data-open="${l.id}">Open</button>` : `<button class="btn tiny" type="button" disabled>Locked</button>`}
          <label class="learned ${on ? "on" : ""}"><input type="checkbox" data-done="${l.id}" ${on ? "checked" : ""} ${open ? "" : "disabled"}>Done</label></div>
      </li>`;
    }).join("");
    return `<div class="card"><h3>${i + 1}. ${esc(u.title)} <span class="small muted">${n}/${ls.length}</span></h3>
      <p class="small muted">${esc(u.blurb)}</p>
      ${open ? "" : `<p class="flag">Finish unit ${i} to unlock this one. Already know it? Mark those lessons done.</p>`}
      <ul class="sections">${rows}</ul></div>`;
  }).join("");
  $("courseList").innerHTML = `<div class="card hero">
      <div class="ring"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="19" class="ring-bg"/><circle cx="22" cy="22" r="19" class="ring-fg" style="stroke-dashoffset:${119.4 * (1 - s.done / s.total)}"/></svg><span>${Math.round(100 * s.done / s.total)}%</span></div>
      <div><h2>Fingerpicking course</h2><p class="muted">${s.done} of ${s.total} lessons · ${s.units} of ${s.unitTotal} units complete. Progress stays in this browser.</p><p class="small muted">The tunes (Unit 9) and the song studies (Units 10–11) are also listed under <a href="#" data-goto="songs">Songs</a>.</p></div>
    </div>
    ${issues.length ? `<div class="card flag">${esc(issues.join(" "))}</div>` : ""}
    ${units}`;
}

function applyTransport() {
  const api = ui.api; if (!api) return;
  api.playbackSpeed = ui.bpm / 60;
  api.isLooping = ui.loop;
  api.metronomeVolume = ui.metro ? 1 : 0;
  api.countInVolume = ui.countIn ? 1 : 0;
}
function setStatus(t) { $("courseStatus").textContent = t; }

const BRAND = {
  u10: ["Every Breath You Take", "Rock / Pop · The Police · A♭"],
  u11: ["Asturias (Leyenda)", "Classical · Albéniz / Segovia · E minor"],
  u9: ["Fingerpicking", "Folk & Appalachian tunes"],
  default: ["Fingerpicking", "Folk & Appalachian"],
};
export function brandFor() { const l = LESSONS.find((x) => x.id === ui.lessonId); return l ? (BRAND[l.unit] || BRAND.default) : BRAND.default; }

function fillLesson() {
  const lesson = LESSONS.find((l) => l.id === ui.lessonId);
  if (!lesson) return;
  inst.setCurrentLesson(lesson.id);
  $("courseInst").innerHTML = inst.panelHTML(inst.songOfLesson(lesson));
  const st = load();
  const i = LESSONS.findIndex((l) => l.id === lesson.id);
  const unit = UNITS.find((u) => u.id === lesson.unit);
  $("courseTitle").textContent = lesson.title;
  $("courseKicker").textContent = `Unit ${unitIndex(lesson.unit) + 1} · ${unit.title} · ${i + 1} of ${LESSONS.length}`;
  $("courseExplain").textContent = lesson.explain;
  const brand = BRAND[lesson.unit] || BRAND.default;
  $("brandTitle").textContent = brand[0]; $("brandSub").textContent = brand[1];
  try { $("courseHands").innerHTML = handsHTML(lesson); } catch (err) { console.error(err); $("courseHands").innerHTML = ""; }
  $("courseFingers").textContent = lesson.fingers || "";
  try { $("courseMedia").innerHTML = ebytMediaHTML(lesson, CHORD_LIB); } catch (err) { console.error(err); $("courseMedia").innerHTML = ""; }
  $("courseCredit").textContent = lesson.credit || "";
  $("courseTips").hidden = !lesson.tips;
  $("courseTips").innerHTML = lesson.tips ? "<b>Common mistakes</b><ul>" + lesson.tips.map((t) => `<li>${esc(t)}</li>`).join("") + "</ul>" : "";
  $("courseVideo").hidden = !lesson.video;
  $("courseVideo").innerHTML = lesson.video ? `▶ Reference performance: <a href="${esc(lesson.video.url)}" target="_blank" rel="noopener">${esc(lesson.video.title)}</a>` : "";
  const tune = TUNINGS[lesson.tuning];
  $("courseRetune").hidden = !lesson.retune;
  $("courseRetune").textContent = lesson.retune ? `Tuning: ${tune.name} (${tune.label}). ${lesson.retune}` : "";
  ui.bpm = lesson.tempo || lesson.goals[0];
  $("courseTempo").value = String(ui.bpm);
  $("courseTempoVal").textContent = ui.bpm + " bpm";
  const goals = st.goals[lesson.id] || {};
  $("courseGoals").innerHTML = lesson.goals.map((bpm) => `<label class="learned ${goals[bpm] ? "on" : ""}"><input type="checkbox" data-goal="${bpm}" ${goals[bpm] ? "checked" : ""}>Clean at ${bpm} bpm</label>`).join("");
  const on = !!st.done[lesson.id];
  $("courseDone").textContent = on ? "✓ Completed · tap to undo" : "Mark complete";
  $("courseDone").classList.toggle("primary", !on);
  const prev = LESSONS[i - 1], next = LESSONS[i + 1];
  $("coursePrev").disabled = !prev;
  $("courseNext").disabled = !next || !lessonUnlocked(next, st);
  $("courseNext").textContent = next && !lessonUnlocked(next, st) ? "Next unit locked" : "Next";
  $("courseLegend").innerHTML = Object.entries(RH_COLORS).map(([k, c]) => `<span><i style="background:${c}"></i>${k}</span>`).join("") + " <span>letters on the tab are the right hand · numbers are left-hand fingers</span>";
}

function ensureApi() {
  if (ui.api || !window.alphaTab) { if (!window.alphaTab) setStatus("Notation library failed to load."); return; }
  const base = new URL(".", location.href);
  const narrow = window.innerWidth < 560;
  const api = new alphaTab.AlphaTabApi($("courseTab"), {
    core: { fontDirectory: new URL("vendor/alphatab/font/", base).href, scriptFile: new URL("vendor/alphatab/alphaTab.min.js", base).href },
    display: { layoutMode: "page", barsPerRow: narrow ? 2 : 4, scale: narrow ? 0.78 : 0.95, staveProfile: "scoretab" },
    notation: { elements: { scoreTitle: true, scoreSubTitle: true, scoreArtist: false, trackNames: false, scoreWordsAndMusic: false, guitarTuning: true } },
    player: { playerMode: "enabledSynthesizer", soundFont: new URL("vendor/alphatab/soundfont/sonivox.sf2", base).href, enableCursor: true, enableAnimatedBeatCursor: true, enableElementHighlighting: true, enableUserInteraction: true, scrollMode: "continuous" },
  });
  ui.api = api;
  api.soundFontLoad.on((e) => { const p = e.total ? Math.round((e.loaded / e.total) * 100) : 0; setStatus(`Loading guitar sound… ${p}%`); });
  api.playerReady.on(() => { ui.ready = true; applyTransport(); setStatus("Ready · count-in, then the lesson. Loop stays on until you turn it off."); });
  api.renderFinished.on(() => {
    ui.rendering = false;
    if (ui.pendingTex) { ui.pendingTex = false; loadTex(); return; }
    $("courseLoading").hidden = true;
  });
  api.playerStateChanged.on((e) => {
    ui.playing = e.state === 1;
    $("coursePlay").textContent = ui.playing ? "❚❚" : "▶";
    $("coursePlay").setAttribute("aria-label", ui.playing ? "Pause" : "Play");
    if (ui.playing) setStatus(`Playing at ${ui.bpm} bpm${ui.loop ? " · looping" : ""}${ui.metro ? " · click on" : ""}${ui.countIn ? " · count-in" : ""}`);
  });
  api.playerFinished.on(() => { if (!ui.loop) setStatus("End of the lesson. Loop is off."); });
  api.error.on((err) => { console.error(err); setStatus("Notation/audio error: " + (err && err.message ? err.message : err)); });
}

function loadTex() {
  const lesson = LESSONS.find((l) => l.id === ui.lessonId);
  if (!lesson || !ui.api) return;
  $("courseLoading").hidden = false;
  // alphaTab breaks (“Cannot read properties of undefined”) if a new score arrives while the previous one is
  // still rendering / building MIDI — queue it and load when the current render finishes.
  if (ui.rendering) { ui.pendingTex = true; return; }
  try { ui.api.stop(); } catch {}
  ui.rendering = true;
  try { ui.api.tex(lessonTex(lesson)); applyTransport(); }
  catch (err) { ui.rendering = false; console.error(err); setStatus(err.message); $("courseLoading").hidden = true; }
}

// opts.force: open even if its unit is still locked (Songs section, deep links). opts.back: view for the back button.
export function openLesson(id, opts = {}) {
  const lesson = LESSONS.find((l) => l.id === id);
  if (!lesson) return false;
  if (ui.lessonId === id && !$("courseStage").hidden) { fillLesson(); return true; }
  if (opts.force) ui.forced = id;
  if (!lessonUnlocked(lesson)) return false;
  ui.back = opts.back || null;
  $("courseBack").textContent = ui.back === "songs" ? "← Songs" : "← Lessons";
  ui.lessonId = id;
  $("courseList").hidden = true;
  $("courseStage").hidden = false;
  document.body.classList.add("show-course-dock");
  fillLesson();
  ensureApi();
  if (ui.api) loadTex();
  window.scrollTo(0, 0);
  return true;
}

function showList() {
  if (ui.back) { const v = ui.back; ui.back = null; if (ui.api && ui.playing) ui.api.pause(); ui.lessonId = null; $("courseStage").hidden = true; $("courseList").hidden = false; document.body.classList.remove("show-course-dock"); window.dispatchEvent(new CustomEvent("guitar-goto", { detail: v })); return; }
  if (ui.api && ui.playing) ui.api.pause();
  ui.lessonId = null;
  $("courseStage").hidden = true;
  $("courseList").hidden = false;
  document.body.classList.remove("show-course-dock");
  renderList();
  window.scrollTo(0, 0);
}

export function entered() {
  if (ui.lessonId) {
    $("courseList").hidden = true;
    $("courseStage").hidden = false;
    document.body.classList.add("show-course-dock");
    if (ui.api && !ui.rendering) { ui.rendering = true; try { ui.api.render(); } catch { ui.rendering = false; } }
  } else renderList();
}
export function left() {
  if (ui.api && ui.playing) ui.api.pause();
  document.body.classList.remove("show-course-dock");
}

function toggleDone(id, on) {
  const lesson = LESSONS.find((l) => l.id === id);
  if (!lesson || !lessonUnlocked(lesson)) return;
  const st = load();
  if (on) st.done[id] = true; else delete st.done[id];
  save(st);
}

export function initCourse() {
  renderList();
  $("courseList").addEventListener("click", (e) => {
    const b = e.target.closest("[data-open]");
    if (b) openLesson(b.dataset.open);
  });
  $("courseList").addEventListener("change", (e) => {
    const c = e.target.closest("[data-done]");
    if (!c) return;
    toggleDone(c.dataset.done, c.checked);
    renderList();
  });
  $("courseBack").addEventListener("click", showList);
  $("coursePrev").addEventListener("click", () => {
    const i = LESSONS.findIndex((l) => l.id === ui.lessonId);
    if (i > 0) openLesson(LESSONS[i - 1].id);
  });
  $("courseNext").addEventListener("click", () => {
    const i = LESSONS.findIndex((l) => l.id === ui.lessonId);
    if (i >= 0 && LESSONS[i + 1]) openLesson(LESSONS[i + 1].id);
  });
  $("courseDone").addEventListener("click", () => {
    const st = load();
    toggleDone(ui.lessonId, !st.done[ui.lessonId]);
    fillLesson();
  });
  $("courseGoals").addEventListener("change", (e) => {
    const c = e.target.closest("[data-goal]");
    if (!c || !ui.lessonId) return;
    const st = load();
    st.goals[ui.lessonId] = st.goals[ui.lessonId] || {};
    if (c.checked) st.goals[ui.lessonId][c.dataset.goal] = true;
    else delete st.goals[ui.lessonId][c.dataset.goal];
    save(st);
    fillLesson();
  });
  $("courseTempo").addEventListener("input", () => {
    ui.bpm = +$("courseTempo").value;
    $("courseTempoVal").textContent = ui.bpm + " bpm";
    applyTransport();
  });
  function sync() {
    $("courseLoop").setAttribute("aria-pressed", String(ui.loop));
    $("courseMetro").setAttribute("aria-pressed", String(ui.metro));
    $("courseCount").setAttribute("aria-pressed", String(ui.countIn));
    applyTransport();
  }
  $("courseLoop").addEventListener("click", () => { ui.loop = !ui.loop; sync(); });
  $("courseMetro").addEventListener("click", () => { ui.metro = !ui.metro; sync(); });
  $("courseCount").addEventListener("click", () => { ui.countIn = !ui.countIn; sync(); });
  sync();
  $("coursePlay").addEventListener("click", () => {
    if (!ui.api || !ui.ready) { setStatus("Sound is still loading – one moment…"); ensureApi(); return; }
    applyTransport();
    ui.api.playPause();
  });
  $("courseStop").addEventListener("click", () => {
    if (!ui.api) return;
    ui.api.stop();
    try { ui.api.tickPosition = 0; } catch {}
    setStatus("Back at the start.");
  });
}

export function coursePlayClick() { $("coursePlay").click(); }
