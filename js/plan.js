const KEY = "lagrima.progress.v1";
export const SECTIONS = [
  { id: "s1", from: 1, to: 4, title: "Bars 1–4 · Opening (E major)", desc: "Melody on the 1st string over bass + open B. The B7 shape in bar 2.", hard: 1, goal: 70 },
  { id: "s2", from: 5, to: 8, title: "Bars 5–8 · High shift & barre II", desc: "Half barre IX → VII (bar 5), the shift up in bar 6, barre II in bar 7.", hard: 5, goal: 70 },
  { id: "s3", from: 9, to: 12, title: "Bars 9–12 · E minor: slide, thirds, barre VII", desc: "Portamento G→C, falling thirds, off-beat melody, full barre VII + hammer-on.", hard: 12, goal: 70 },
  { id: "s4", from: 13, to: 16, title: "Bars 13–16 · Minor melody & ending", desc: "Like bar 1 in minor, the 7th-position run, the gentle ending.", hard: 14, goal: 70 },
  { id: "s5", from: 1, to: 8, title: "Section A (bars 1–8) joined up", desc: "Play A without stopping; shape the melody.", hard: 5, goal: 80 },
  { id: "s6", from: 9, to: 16, title: "Section B (bars 9–16) joined up", desc: "Play B without stopping; keep the thirds soft.", hard: 12, goal: 80 },
  { id: "s7", from: 1, to: 16, full: true, title: "Whole piece with repeats & D.C.", desc: "A A B B A – about 2 minutes. Performance time!", hard: 5, goal: 100 },
];
const WARMUPS = [
  "Open-string arpeggio p-i-m-a (p on 4, i on 3, m on 2, a on 1), 20× slowly and evenly.",
  "Thumb + a together on strings 4 and 1, then m alone on string 2 – the Lágrima pattern on open strings, 16×.",
  "i-m alternation (free stroke) on the 1st string, then the 2nd, 1 minute each. Never repeat a finger.",
  "Left hand: fingers 1-2-3-4 on the 1st string at frets 5-6-7-8, fingertips close to the frets, thumb relaxed.",
  "Half barre: lay finger 1 across strings 1–4 at fret 9, play each string, release, repeat 5×. No thumb squeezing!",
  "Shift drill: finger 4 on the 1st string, slide 12 → 11 → 9 (bar 5 melody) keeping light contact. 10×.",
  "Guide finger drill: finger 1 on the 4th string, slide 2 → 4 → 5 (bar 1 / bar 13 bass). 10×.",
];
export function load() { try { return Object.assign({ learned: {}, count: {}, last: {}, days: [] }, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch { return { learned: {}, count: {}, last: {}, days: [] }; } }
export function save(st) { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch {} }
export const today = () => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
export function progressPct(st) { return Math.round((SECTIONS.filter((s) => st.learned[s.id]).length / SECTIONS.length) * 100); }
export function streak(st) {
  const set = new Set(st.days); let n = 0; const d = new Date();
  if (!set.has(today())) d.setDate(d.getDate() - 1);
  for (;;) { const k = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); if (set.has(k)) { n++; d.setDate(d.getDate() - 1); } else break; }
  return n;
}
export function dailyPlan(st) {
  const dayNum = Math.floor(Date.now() / 86400000);
  const focus = SECTIONS.find((s) => !st.learned[s.id]) || SECTIONS[SECTIONS.length - 1];
  const learned = SECTIONS.filter((s) => st.learned[s.id] && s !== focus);
  const review = learned.length ? learned[dayNum % learned.length] : null;
  const times = st.count[focus.id] || 0;
  const tempo = times < 3 ? 50 : times < 7 ? 60 : Math.min(focus.goal, 70 + (times - 7) * 5);
  const steps = [
    `<b>Warm-up (3 min):</b> ${WARMUPS[dayNum % WARMUPS.length]}`,
    `<b>Focus (10 min): ${focus.title}.</b> Loop it at <b>${tempo}%</b>. Use step mode (◀ ▶) first to check both hands, then play along.`,
    `<b>Hard spot (3 min):</b> loop <b>bar ${focus.hard}</b> alone – slowly, then 2 bars around it.`,
    review ? `<b>Review (3 min):</b> ${review.title} once or twice at a comfortable speed.` : `<b>Listen (2 min):</b> play the whole piece at 100% (Score tab) or watch a performance in Learn.`,
    `<b>Finish:</b> play the melody alone (top notes only) and sing along – it builds phrasing.`,
  ];
  return { focus, review, tempo, steps };
}
