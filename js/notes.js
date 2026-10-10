// Shared pitch math for standard and the alternate tunings used in the folk course.
// String numbers follow the tab: 1 = highest sounding, 6 = lowest sounding.
// MIDI: C4 = 60 (middle C). Open high E in standard tuning is E4 = 64.

export const SHARP = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
export const FLAT = ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"];
export const NATURAL_PCS = new Set([0, 2, 4, 5, 7, 9, 11]);

/** open[string] = MIDI of the open string. alpha = alphaTex tuning, string 1 first. */
export const TUNINGS = {
  standard: { id: "standard", name: "Standard", label: "E A D G B E", open: { 1: 64, 2: 59, 3: 55, 4: 50, 5: 45, 6: 40 }, alpha: "E4 B3 G3 D3 A2 E2" },
  dropd: { id: "dropd", name: "Drop D", label: "D A D G B E", open: { 1: 64, 2: 59, 3: 55, 4: 50, 5: 45, 6: 38 }, alpha: "E4 B3 G3 D3 A2 D2" },
  openg: { id: "openg", name: "Open G", label: "D G D G B D", open: { 1: 62, 2: 59, 3: 55, 4: 50, 5: 43, 6: 38 }, alpha: "D4 B3 G3 D3 G2 D2" },
  opend: { id: "opend", name: "Open D", label: "D A D F♯ A D", open: { 1: 62, 2: 57, 3: 54, 4: 50, 5: 45, 6: 38 }, alpha: "D4 A3 F#3 D3 A2 D2" },
};

export const POSITIONS = [
  { id: "all", name: "All positions", from: 0, to: 99 },
  { id: "I", name: "Position I", from: 1, to: 4 },
  { id: "V", name: "Position V", from: 5, to: 8 },
  { id: "VII", name: "Position VII", from: 7, to: 10 },
];

export function tuningOf(id) { return TUNINGS[id] || TUNINGS.standard; }

export function midiOf(tuning, string, fret) {
  const t = typeof tuning === "string" ? tuningOf(tuning) : tuning;
  return t.open[string] + fret;
}

export function pcOf(midi) { return ((midi % 12) + 12) % 12; }

export function spell(midi, flats = false) {
  const pc = pcOf(midi);
  const oct = Math.floor(midi / 12) - 1;
  const name = (flats ? FLAT : SHARP)[pc];
  return { pc, oct, name, label: name + oct };
}

/** Other places the same pitch class sits an octave (or two) away, inside the fret window. */
export function octaveCells(tuning, string, fret, maxFret = 12) {
  const t = tuningOf(tuning);
  const src = midiOf(t, string, fret);
  const out = [];
  for (let s = 1; s <= 6; s++) {
    for (let f = 0; f <= maxFret; f++) {
      if (s === string && f === fret) continue;
      const m = midiOf(t, s, f);
      const d = Math.abs(m - src);
      if (d > 0 && d % 12 === 0) out.push({ s, f, midi: m });
    }
  }
  return out;
}
