import { TUNINGS, POSITIONS, NATURAL_PCS, midiOf, spell, octaveCells, tuningOf } from "./notes.js";
import { pluck } from "./pluck.js";

const KEY = "guitar.trainer.v1";
const $ = (id) => document.getElementById(id);
const MODES = [
  { id: "explore", name: "Show notes" },
  { id: "find", name: "Find the note" },
  { id: "name", name: "Name the note" },
  { id: "octave", name: "Octaves" },
];

function blank() {
  return { correct: 0, wrong: 0, best: 0, streak: 0, weak: {}, lefty: false, flats: false, naturals: false, tuning: "standard", maxFret: 12, mode: "explore", string: 0, position: "all" };
}
function load() {
  try { return Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || "{}")); }
  catch { return blank(); }
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch {}
  window.dispatchEvent(new Event("guitar-progress"));
}
const saved = load();
const live = { targets: [], found: new Set(), hot: null, bad: null, hints: [], reveal: false, lockPc: null, timeLeft: 60, timing: false, timerId: null, tRight: 0, tWrong: 0, result: null, msg: "" };

export function stats() {
  const weak = topWeak(1)[0];
  return { correct: saved.correct, wrong: saved.wrong, best: saved.best, weak: weak ? spellName(weak.pc) : null, weakN: weak ? weak.n : 0 };
}
function spellName(pc) { return spell(pc, saved.flats).name; }
function topWeak(n) {
  return Object.entries(saved.weak).map(([pc, count]) => ({ pc: +pc, n: count })).filter((x) => x.n > 0).sort((a, b) => b.n - a.n).slice(0, n);
}
function posOf() { return POSITIONS.find((p) => p.id === saved.position) || POSITIONS[0]; }
function inFilter(s, f) {
  if (saved.string && s !== saved.string) return false;
  const p = posOf();
  if (saved.position !== "all" && (f < p.from || f > p.to)) return false;
  return f <= saved.maxFret;
}
function cell(s, f) {
  const midi = midiOf(saved.tuning, s, f);
  return { s, f, midi, ...spell(midi, saved.flats) };
}
function pool() {
  const out = [];
  for (let s = 6; s >= 1; s--) for (let f = 0; f <= saved.maxFret; f++) {
    if (!inFilter(s, f)) continue;
    const c = cell(s, f);
    if (saved.naturals && !NATURAL_PCS.has(c.pc)) continue;
    out.push(c);
  }
  return out;
}
function keyOf(s, f) { return s + ":" + f; }
function miss(pc) { saved.weak[pc] = (saved.weak[pc] || 0) + 1; saved.wrong++; saved.streak = 0; if (live.timing) live.tWrong++; }
function hit(pc) {
  saved.correct++; saved.streak++; if (saved.streak > saved.best) saved.best = saved.streak;
  if (saved.weak[pc]) saved.weak[pc] = Math.max(0, saved.weak[pc] - 1);
  if (live.timing) live.tRight++;
}

function newPrompt() {
  live.found = new Set(); live.bad = null; live.hints = []; live.reveal = false; live.targets = []; live.hot = null;
  if (saved.mode === "explore") { live.msg = "Tap any fret to hear it."; return; }
  const cells = pool();
  if (!cells.length) { live.msg = "Nothing to ask in this filter. Widen the frets or turn naturals off."; return; }
  if (saved.mode === "octave") {
    const options = cells.filter((c) => octaveCells(saved.tuning, c.s, c.f, saved.maxFret).length);
    if (!options.length) { live.msg = "No octaves fit on this fretboard. Show more frets."; return; }
    live.hot = options[Math.floor(Math.random() * options.length)];
    live.msg = "Tap any octave of the highlighted note — same name, higher or lower.";
    return;
  }
  let pcs = [...new Set(cells.map((c) => c.pc))];
  if (live.lockPc != null) pcs = pcs.filter((pc) => pc === live.lockPc);
  if (!pcs.length) { live.msg = "That note isn’t in this filter."; live.lockPc = null; pcs = [...new Set(cells.map((c) => c.pc))]; }
  const pc = pcs[Math.floor(Math.random() * pcs.length)];
  if (saved.mode === "find") {
    live.targets = cells.filter((c) => c.pc === pc);
    const where = saved.string ? ` on the ${ordinal(saved.string)} string` : saved.position !== "all" ? ` in position ${saved.position}` : "";
    live.msg = live.targets.length > 1 ? `Tap every ${spellName(pc)}${where}. ${live.targets.length} spots.` : `Tap ${spellName(pc)}${where}.`;
    return;
  }
  live.hot = cells[Math.floor(Math.random() * cells.length)];
  live.msg = "What note is highlighted?";
}
function ordinal(s) { return { 1: "1st", 2: "2nd", 3: "3rd", 4: "4th", 5: "5th", 6: "6th" }[s]; }

function armTimer(reset) {
  clearInterval(live.timerId);
  if (reset) { live.timeLeft = 60; live.tRight = 0; live.tWrong = 0; live.result = null; }
  live.timing = true;
  live.timerId = setInterval(() => {
    live.timeLeft--;
    const el = document.getElementById("trClock");
    if (el) el.textContent = clock();
    if (live.timeLeft <= 0) finishTimer();
  }, 1000);
}
function finishTimer() {
  clearInterval(live.timerId); live.timerId = null; live.timing = false;
  live.result = { right: live.tRight, wrong: live.tWrong };
  save(); render();
}
function clock() { return `0:${String(live.timeLeft).padStart(2, "0")}`; }

function render() {
  const root = $("trainerRoot"); if (!root) return;
  const sc = root.querySelector(".neck-scroll");
  const left = sc ? sc.scrollLeft : 0;
  const tune = tuningOf(saved.tuning);
  const modes = MODES.map((m) => `<button type="button" class="chip ${saved.mode === m.id ? "on" : ""}" data-mode="${m.id}" aria-pressed="${saved.mode === m.id}">${m.name}</button>`).join("");
  const tunings = Object.values(TUNINGS).map((t) => `<option value="${t.id}" ${t.id === saved.tuning ? "selected" : ""}>${t.name}</option>`).join("");
  const strings = [{ id: 0, name: "All strings" }, 6, 5, 4, 3, 2, 1].map((s) => {
    const id = s.id === 0 ? 0 : s;
    const name = id === 0 ? "All strings" : `${ordinal(id)} · ${spell(tune.open[id], saved.flats).name}`;
    return `<button type="button" class="chip ${saved.string === id ? "on" : ""}" data-string="${id}">${name}</button>`;
  }).join("");
  const positions = POSITIONS.map((p) => `<button type="button" class="chip ${saved.position === p.id ? "on" : ""}" data-pos="${p.id}">${p.name}</button>`).join("");
  const weak = topWeak(6).map((w) => `<button type="button" class="chip" data-weak="${w.pc}">${spellName(w.pc)} · ${w.n}</button>`).join("");
  const answers = saved.mode === "name" ? `<div class="namepad" id="namepad">${(saved.flats ? ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"] : ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"]).map((n, pc) => `<button type="button" class="btn namebtn ${live.reveal && live.hot && live.hot.pc === pc ? "primary" : ""}" data-pc="${pc}">${n}</button>`).join("")}</div>` : "";
  const result = live.result ? `<div class="card flag"><b>60 seconds.</b> ${live.result.right} right, ${live.result.wrong} misses. Streak best ${saved.best}. <button type="button" class="btn tiny" id="trDismiss">Continue</button></div>` : "";
  root.innerHTML = `${result}
    <div class="card tight">
      <div class="rangebar">${modes}</div>
      <div class="row gap wrap" style="margin-top:8px">
        <label class="seg"><span>Tuning</span><select id="trTuning">${tunings}</select></label>
        <button type="button" class="chip ${saved.naturals ? "on" : ""}" id="trNat" aria-pressed="${saved.naturals}">Naturals only</button>
        <button type="button" class="chip ${saved.flats ? "on" : ""}" id="trFlats" aria-pressed="${saved.flats}">${saved.flats ? "Flats" : "Sharps"}</button>
        <button type="button" class="chip ${saved.lefty ? "on" : ""}" id="trLefty" aria-pressed="${saved.lefty}">${saved.lefty ? "Left-handed" : "Right-handed"}</button>
        <button type="button" class="chip ${saved.maxFret > 12 ? "on" : ""}" id="trFrets">${saved.maxFret > 12 ? "Frets 0–15" : "Frets 0–12"}</button>
        <button type="button" class="chip ${live.timing ? "on" : ""}" id="trTimer" aria-pressed="${live.timing}">${live.timing ? "Stop timer" : "60s timer"}</button>
      </div>
    </div>
    <div class="card prompt-card">
      <div class="row between"><div><div class="prompt-note" id="trPromptNote">${promptNote()}</div><p id="trMsg">${esc(live.msg)}</p></div>
        <div class="scorebox"><b>${saved.correct}</b> right<br><b id="trStreak">${saved.streak}</b> streak · best ${saved.best}<br><span id="trClock">${live.timing ? clock() : saved.wrong + " misses"}</span></div></div>
      ${saved.mode === "octave" ? `<p class="small muted">Low strings: an octave is two strings higher and two frets up. From the D or G string, crossing the B string, it is two strings and three frets. The same fret an octave up the same string is 12 frets away.</p>` : ""}
      ${saved.mode !== "explore" ? `<button type="button" class="btn tiny" id="trSkip">Skip</button> <button type="button" class="btn tiny" id="trHear">Hear note</button>` : ""}
    </div>
    <p class="rotate-hint small muted">On a phone, turn sideways to see more of the neck. You can also scroll it. Low string is on top.</p>
    <div class="neck-scroll">${neckHtml()}</div>
    ${answers}
    <div class="card"><h3>String drill</h3><div class="rangebar">${strings}</div>
      <h3 style="margin-top:8px">Position drill</h3><p class="small muted">I is frets 1–4, V is 5–8, VII is 7–10.</p><div class="rangebar">${positions}</div></div>
    <div class="card"><h3>Weak notes</h3>${weak ? `<div class="rangebar">${weak}</div><p class="small muted">Tap one to drill it. Misses are remembered in this browser.</p>` : `<p class="muted">None yet. Miss a few in Find or Name and they’ll collect here.</p>`}
      ${live.lockPc != null ? `<button type="button" class="btn tiny" id="trUnlock">Stop drilling ${spellName(live.lockPc)}</button>` : ""}</div>`;
  const sc2 = root.querySelector(".neck-scroll");
  if (sc2) sc2.scrollLeft = left;
}
function esc(s) { return String(s == null ? "" : s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])); }
function promptNote() {
  if (saved.mode === "find" && live.targets.length) return esc(live.targets[0].name);
  if (live.hot && (saved.mode === "octave" || saved.mode === "name")) return saved.mode === "name" ? "?" : esc(live.hot.name);
  return tuningOf(saved.tuning).name;
}
function neckHtml() {
  const max = saved.maxFret;
  const dots = new Set([3, 5, 7, 9, 12, 15]);
  let h = `<div class="neck ${saved.lefty ? "lefty" : ""}" style="--n:${max + 1}">`;
  h += `<div class="neck-corner">${saved.lefty ? "← nut" : "nut →"}</div>`;
  for (let f = 0; f <= max; f++) {
    const mark = f === 12 || f === 15 ? "••" : dots.has(f) ? "•" : "";
    h += `<div class="fretno">${f === 0 ? "open" : f}<i>${mark}</i></div>`;
  }
  const tune = tuningOf(saved.tuning);
  for (let s = 6; s >= 1; s--) {
    h += `<div class="strlab"><b>${s}</b><small>${spell(tune.open[s], saved.flats).name}</small></div>`;
    for (let f = 0; f <= max; f++) {
      const c = cell(s, f);
      const id = keyOf(s, f);
      const show = saved.mode === "explore" && (!saved.naturals || NATURAL_PCS.has(c.pc));
      const dim = saved.mode !== "explore" && !inFilter(s, f);
      const cls = ["fretbtn", dim ? "dim" : "", live.hot && live.hot.s === s && live.hot.f === f ? "hot" : "", live.found.has(id) ? "got" : "", live.bad && live.bad.s === s && live.bad.f === f ? "bad" : "", live.hints.some((x) => x.s === s && x.f === f) ? "hint" : ""].filter(Boolean).join(" ");
      h += `<button type="button" class="${cls}" data-s="${s}" data-f="${f}" aria-label="String ${s}, fret ${f}, ${c.label}">${show ? esc(c.name) : ""}</button>`;
    }
  }
  h += `</div>`;
  return h;
}

function onFret(s, f) {
  const c = cell(s, f);
  pluck([c.midi]);
  if (saved.mode === "explore") { live.hot = c; live.msg = `${c.label} · ${ordinal(s)} string, ${f === 0 ? "open" : "fret " + f}`; render(); return; }
  if (!inFilter(s, f) && saved.mode !== "octave") {
    live.msg = saved.string ? `Stay on the ${ordinal(saved.string)} string.` : `Stay inside position ${saved.position}.`;
    render(); return;
  }
  if (saved.mode === "find") {
    const id = keyOf(s, f);
    const hitTarget = live.targets.some((t) => t.s === s && t.f === f);
    if (hitTarget && !live.found.has(id)) {
      live.found.add(id); hit(c.pc); live.bad = null;
      if (live.found.size === live.targets.length) { live.msg = `${c.name} — all of them.`; save(); setTimeout(() => { if (saved.mode === "find") { newPrompt(); render(); } }, 700); }
      else live.msg = `${live.found.size} of ${live.targets.length}. Keep going.`;
    } else if (!hitTarget) { live.bad = c; miss(live.targets[0] ? live.targets[0].pc : c.pc); live.msg = `That’s ${c.name}. Still looking for ${live.targets[0] ? live.targets[0].name : "the note"}.`; }
    save(); render(); return;
  }
  if (saved.mode === "octave") {
    if (!live.hot) return;
    if (s === live.hot.s && f === live.hot.f) { live.msg = "That’s the same spot. Find the same note an octave away."; render(); return; }
    const ok = Math.abs(c.midi - live.hot.midi) % 12 === 0;
    if (ok && !live.reveal) { hit(live.hot.pc); live.msg = `${c.label} is an octave of ${live.hot.label}.`; save(); setTimeout(() => { newPrompt(); render(); }, 700); render(); return; }
    if (ok && live.reveal) { newPrompt(); render(); return; }
    miss(live.hot.pc); live.reveal = true; live.bad = c;
    live.hints = octaveCells(saved.tuning, live.hot.s, live.hot.f, saved.maxFret).slice(0, 3);
    live.msg = `That’s ${c.name}. An octave is highlighted.`;
    save(); render(); return;
  }
}
function onName(pc) {
  if (!live.hot) return;
  pluck([live.hot.midi]);
  if (pc === live.hot.pc && !live.reveal) { hit(pc); live.msg = `Yes — ${spellName(pc)}.`; save(); setTimeout(() => { newPrompt(); render(); }, 500); render(); return; }
  if (pc === live.hot.pc && live.reveal) { newPrompt(); render(); return; }
  miss(live.hot.pc); live.reveal = true; live.msg = `It’s ${live.hot.name}, not ${spellName(pc)}. Tap the highlighted name.`;
  save(); render();
}

export function entered() {
  if (saved.mode === "find" && !live.targets.length) newPrompt();
  if ((saved.mode === "name" || saved.mode === "octave") && !live.hot) newPrompt();
  render();
  if (live.timing && !live.timerId && live.timeLeft > 0) armTimer(false);
}
export function left() { clearInterval(live.timerId); live.timerId = null; }

export function initTrainer() {
  newPrompt();
  const root = $("trainerRoot");
  root.addEventListener("click", (e) => {
    const mode = e.target.closest("[data-mode]");
    if (mode) { saved.mode = mode.dataset.mode; live.result = null; newPrompt(); save(); render(); return; }
    const st = e.target.closest("[data-string]");
    if (st) { saved.string = +st.dataset.string; if (saved.mode === "explore") saved.mode = "name"; newPrompt(); save(); render(); return; }
    const pos = e.target.closest("[data-pos]");
    if (pos) { saved.position = pos.dataset.pos; if (saved.mode === "explore") saved.mode = "name"; newPrompt(); save(); render(); return; }
    const weak = e.target.closest("[data-weak]");
    if (weak) { live.lockPc = +weak.dataset.weak; if (!NATURAL_PCS.has(live.lockPc)) saved.naturals = false; saved.mode = "find"; saved.string = 0; saved.position = "all"; newPrompt(); save(); render(); return; }
    const fret = e.target.closest("[data-s]");
    if (fret) { onFret(+fret.dataset.s, +fret.dataset.f); return; }
    const pc = e.target.closest("[data-pc]");
    if (pc) { onName(+pc.dataset.pc); return; }
    if (e.target.id === "trNat") { saved.naturals = !saved.naturals; newPrompt(); save(); render(); }
    else if (e.target.id === "trFlats") { saved.flats = !saved.flats; save(); render(); }
    else if (e.target.id === "trLefty") { saved.lefty = !saved.lefty; save(); render(); }
    else if (e.target.id === "trFrets") { saved.maxFret = saved.maxFret > 12 ? 12 : 15; newPrompt(); save(); render(); }
    else if (e.target.id === "trTimer") { if (live.timing) finishTimer(); else { if (saved.mode === "explore") { saved.mode = "name"; newPrompt(); } armTimer(true); save(); render(); } }
    else if (e.target.id === "trSkip") { newPrompt(); render(); }
    else if (e.target.id === "trHear") { const n = live.hot || live.targets[0]; if (n) pluck([n.midi]); }
    else if (e.target.id === "trDismiss") { live.result = null; render(); }
    else if (e.target.id === "trUnlock") { live.lockPc = null; newPrompt(); render(); }
  });
  root.addEventListener("change", (e) => {
    if (e.target.id === "trTuning") { saved.tuning = e.target.value; newPrompt(); save(); render(); }
  });
}
