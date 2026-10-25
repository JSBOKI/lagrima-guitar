// Chord library page: every chord used in the app, grouped by where it appears.
import { CHORD_LIB, chordsOf } from "./chordlib.js";
import { chordTeachHTML } from "./handguide.js";
import { LESSONS, UNITS } from "./course-data.js";
import "./instrument.js"; // registers the guitarlele chord entries

const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
const GROUPS = [
  { title: "Open chords (standard tuning)", ids: ["Em", "E", "Am", "A", "C", "G", "D", "Dm", "F"] },
  { title: "Alternate tunings (drop D, open G, open D)", ids: ["Ddrop", "Gopen", "Copeng", "Dopeng", "Dopend", "Aopend"] },
  { title: "Every Breath You Take — add9 grips (A♭, no capo)", ids: ["Abadd9", "Fmadd9", "Dbadd9", "Ebadd9", "Gbadd9", "Fbadd9"] },
  { title: "Every Breath You Take — beginner open add9 shapes (G)", ids: ["Gadd9", "Emadd9", "Cadd9", "Dadd9"] },
  { title: "Asturias — barre chords", ids: ["BVII", "BII", "GIII"] },
  { title: "Guitarlele (A D G C E A) · Every Breath You Take — match original key (A♭)", ids: ["Abadd9", "Fmadd9", "Dbadd9", "Ebadd9", "Gbadd9", "Fbadd9"].map((i) => "glk_" + i) },
  { title: "Guitarlele · Every Breath You Take beginner (G) — match key", ids: ["Gadd9", "Emadd9", "Cadd9", "Dadd9"].map((i) => "glk_" + i) },
  { title: "Guitarlele · guitar shapes as-is (sound a 4th higher)", ids: ["Abadd9", "Fmadd9", "Dbadd9", "Ebadd9", "Gbadd9", "Fbadd9", "Gadd9", "Emadd9", "Cadd9", "Dadd9"].map((i) => "gls_" + i) },
];
export function usedIn(id) { return LESSONS.filter((l) => chordsOf(l).includes(id)); }
export function renderChordLibrary(root) {
  const nav = GROUPS.map((g) => `<div class="chip-row">${g.ids.map((id) => `<a class="chip" href="#chord-${id}">${esc(CHORD_LIB[id].short)}</a>`).join("")}</div>`).join("");
  root.innerHTML = `<div class="card hero"><div><h2>Chord library</h2><p class="muted">Every chord used in the songs and lessons. Numbers in the dots are left-hand fingers (1 index · 2 middle · 3 ring · 4 little); ○ open, × don’t play; a bar = barre with finger 1.</p></div></div>
    <div class="card">${nav}</div>` + GROUPS.map((g) => `<div class="group-h">${esc(g.title)}</div>` + g.ids.map((id) => {
    const used = usedIn(id);
    return `<div class="card" id="chord-${id}">${chordTeachHTML(id)}${used.length ? `<p class="small muted">Used in: ${used.map((l) => `<a href="#lesson=${l.id}">${esc(l.title)}</a>`).join(" · ")}</p>` : ""}</div>`;
  }).join("")).join("");
  root.querySelectorAll('a[href^="#chord-"]').forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); document.getElementById(a.getAttribute("href").slice(1))?.scrollIntoView({ behavior: "smooth" }); }));
}
