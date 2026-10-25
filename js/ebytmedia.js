// Unit 10 demo videos (media/ebyt/*.mp4, rendered by tools/ebyt_videos.py from CHORD_LIB / instrument.js data).
// Picks the set matching the current Guitar | Guitarlele (shapes / original key) choice. Videos stream (not precached).
const IDS = ["Abadd9", "Fmadd9", "Dbadd9", "Ebadd9", "Gbadd9", "Fbadd9"];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
export function ebytMediaHTML(lesson, CHORD_LIB) {
  if (!lesson || lesson.unit !== "u10") return "";
  const pre = lesson.glMode === "key" ? "lk" : lesson.glMode === "shapes" ? "ls" : "g";
  const lib = lesson.glMode === "key" ? "glk_" : lesson.glMode === "shapes" ? "gls_" : "";
  const ids = [...new Set([].concat(lesson.chords).map((c) => c.replace(/^gl[sk]_/, "")))].filter((c) => IDS.includes(c));
  const who = pre === "g" ? "guitar" : pre === "lk" ? "guitarlele · original key" : "guitarlele · guitar shapes";
  const card = (file, cap, loop) => `<figure class="ebv"><video controls playsinline preload="none" ${loop ? "loop " : ""}poster="media/ebyt/${file}.jpg" src="media/ebyt/${file}.mp4" aria-label="${esc(cap)}"></video><figcaption>${esc(cap)}</figcaption></figure>`;
  const cards = ids.map((id) => card(`${pre}-${id}`, `Left hand: ${(CHORD_LIB[lib + id] || CHORD_LIB[id]).short} — fingers 1·2·3·4 one by one`, false));
  const intro = (CHORD_LIB[lib + "Abadd9"] || CHORD_LIB.Abadd9).short;
  cards.push(card(`${pre}-picking`, `Right hand: picking pattern on ${intro} · 60 bpm with click${lesson.id === "ebyt-easy" ? " (same pattern for the easy chords)" : ""}`, true));
  return `<div class="ebv-head"><b>Demo videos</b> <span class="muted">(${who}) · tap to play</span></div><div class="ebv-grid">${cards.join("")}</div>`;
}
