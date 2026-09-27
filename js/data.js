// Lágrima (Preludio) – Francisco Tárrega (1852–1909). Public domain.
// PITCHES: cross-checked note-for-note against (1) Mutopia-2016/01/24-2103 (J. J. Olson, typeset from
// Madrid: Ildefonso Alier, plate I. 5230 A, IMSLP #292928) and (2) the independent MIDI by P. Perol-Schneider (IMSLP #200467).
// LEFT-HAND FINGERING: read from the Alier edition scan (IMSLP #292928) wherever printed. Notes marked s:1 have no
// printed finger in Alier; their fingering is a standard/suggested one. RIGHT-HAND fingering is not printed in Alier:
// ALL p-i-m-a marks are suggested (standard classical practice).
//
// Note tuple: [slot, voice, string, fret, lf, rf, dur, extra]
//   slot = 8th-note position in the 3/4 bar (0..5); voice 1 = upper/long notes, 2 = arpeggio/bass line
//   string 1 = high E ... 6 = low E; fret 0 = open; lf = left finger (0 open, 1-4); rf = p|i|m|a ("" = not plucked)
//   dur in 8ths (1 = eighth, 2 = quarter, 4 = half, 6 = dotted half)
//   extra: s = LH fingering suggested (not printed in source), h = hammer-on/pull-off starts here,
//          sl = slide (glissando) starts here, t = tied from previous note (not re-plucked), rs = rest stroke suggested

const S = { s: 1 };

export const PIECE = {
  title: "Lágrima", subtitle: "Preludio", composer: "Francisco Tárrega (1852–1909)",
  tempo: 60, timeSig: "3/4",
  form: "A (bars 1–8, E major) repeated · B (bars 9–16, E minor) repeated · D.C. al Fine (A again, end at bar 8)",
};

export const MEASURES = [
  { n: 1, sec: "A", key: "E", pos: "II → IV", barres: [],
    lh: "Start in 2nd position: finger 1 on the 4th string (fret 2) and finger 3 on the 1st string (fret 4). Beat 2: move up to 4th position – let finger 1 glide along the 4th string from fret 2 to fret 4 (guide finger). Beat 3: fingers 3 (4th string, fret 6) and 4 (1st string, fret 7).",
    rh: "Each beat: thumb (p) and a together – bass + melody – then m plays the open B very softly. The melody (top note) should sing; the open B is just a soft echo.",
    notes: [[0,2,4,2,1,"p",1],[0,1,1,4,3,"a",2],[1,2,2,0,0,"m",1],[2,2,4,4,1,"p",1],[2,1,1,5,2,"a",2],[3,2,2,0,0,"m",1],[4,2,4,6,3,"p",1],[4,1,1,7,4,"a",2],[5,2,2,0,0,"m",1]] },
  { n: 2, sec: "A", key: "E", pos: "I (B7 shape)", barres: [],
    lh: "B7 chord shape. Beat 1: finger 1 on D♯ (4th string, fret 1) and finger 4 on F♯ (1st string, fret 2). Then 3 on A (3rd string, fret 2) and 2 on the bass B (5th string, fret 2). Keep the F♯ ringing for the whole bar.",
    rh: "p + a together on beat 1, then m (open B), i (A on the 3rd string), m, p (bass B), m. Keep the inner notes quieter than the long melody note.",
    notes: [[0,2,4,1,1,"p",1],[0,1,1,2,4,"a",6],[1,2,2,0,0,"m",1],[2,2,3,2,3,"i",1],[3,2,2,0,0,"m",1],[4,2,5,2,2,"p",1,S],[5,2,2,0,0,"m",1]] },
  { n: 3, sec: "A", key: "E", pos: "II → IV", barres: [], same: 1,
    lh: "Same as bar 1 (the edition only prints the fingering once).", rh: "Same as bar 1. Try a slightly different colour the second time – maybe a little softer.",
    notes: [[0,2,4,2,1,"p",1],[0,1,1,4,3,"a",2],[1,2,2,0,0,"m",1],[2,2,4,4,1,"p",1],[2,1,1,5,2,"a",2],[3,2,2,0,0,"m",1],[4,2,4,6,3,"p",1],[4,1,1,7,4,"a",2],[5,2,2,0,0,"m",1]] },
  { n: 4, sec: "A", key: "E", pos: "I (B7 shape)", barres: [], same: 2,
    lh: "Same as bar 2. Use the long F♯ to get ready for the jump up to the 9th fret in bar 5.", rh: "Same as bar 2.",
    notes: [[0,2,4,1,1,"p",1],[0,1,1,2,4,"a",6],[1,2,2,0,0,"m",1],[2,2,3,2,3,"i",1],[3,2,2,0,0,"m",1],[4,2,5,2,2,"p",1,S],[5,2,2,0,0,"m",1]] },
  { n: 5, sec: "A", key: "E", pos: "IX → VII (half barres)",
    barres: [{ from: 0, to: 3, fret: 9, s1: 1, s2: 4, label: "Half barre IX (C. 9ª)" }, { from: 4, to: 5, fret: 7, s1: 1, s2: 4, label: "Half barre VII (C. 7ª)" }],
    lh: "The big shift! Half barre at fret 9 (finger 1 flat across strings 1–4). Finger 4 plays E (1st string, fret 12) and then slides down to D♯ (fret 11) – keep it touching the string as a guide. Finger 3 on C♯ (4th string, fret 11). Beat 3: move the half barre to fret 7; finger 3 on C♯ (1st string, fret 9).",
    rh: "Melody with a, inner E with i, bass with p. Practise the move from fret 9 to fret 7 slowly, keeping the beat steady.",
    notes: [[0,1,1,12,4,"a",2],[0,2,4,11,3,"p",1],[1,2,3,9,1,"i",1],[2,1,1,11,4,"a",2],[2,2,4,9,1,"p",1],[3,2,3,9,1,"i",1],[4,1,1,9,3,"a",2],[4,2,4,7,1,"p",1],[5,2,2,7,1,"m",1]] },
  { n: 6, sec: "A", key: "E", pos: "VII → X", barres: [],
    lh: "Beat 1: finger 1 on B (1st string, fret 7), 2 on the bass B (4th string, fret 9), 3 on G♯ (2nd string, fret 9). Beat 2: shift up – 2 on C♯ (4th string, fret 11), then open high E, 3 on F♯ (3rd string, fret 11) and 1 on A (2nd string, fret 10).",
    rh: "a on the melody B, p on the bass. For the arpeggio: p (C♯), a (open E), i (F♯), m (A). Let the C♯ ring for two beats.",
    notes: [[0,1,1,7,1,"a",2],[0,2,4,9,2,"p",1],[1,2,2,9,3,"m",1],[2,1,4,11,2,"p",4],[3,2,1,0,0,"a",1],[4,2,3,11,3,"i",1],[5,2,2,10,1,"m",1]] },
  { n: 7, sec: "A", key: "E", pos: "I–II → barre II",
    barres: [{ from: 2, to: 5, fret: 2, s1: 1, s2: 5, label: "Barre II (C. 2ª)" }],
    lh: "Beat 1: open B + finger 3 on G♯ (1st string, fret 4), then open E. Beats 2–3: barre at fret 2 (C. 2ª) – finger 2 on A♯ (3rd string, fret 3); the barre holds C♯, F♯, the bass B and A; finger 4 adds D♯ (2nd string, fret 4).",
    rh: "i on the open B with a on G♯, then m on the open E. Beat 2: i + m together (A♯ + C♯), a (F♯, let it ring), p (bass B), i + m (A + D♯).",
    flag: "The edition prints a circled ③ (3rd string) beside the G♯ on beat 1, which cannot be right at this pitch. We use the 1st string, fret 4, finger 3 (same as bar 1).",
    notes: [[0,2,2,0,0,"i",1],[0,1,1,4,3,"a",2],[1,2,1,0,0,"m",1],[2,2,3,3,2,"i",1,S],[2,2,2,2,1,"m",1,S],[3,2,1,2,1,"a",1,S],[4,2,5,2,1,"p",1,S],[4,2,1,2,1,"",1,{s:1,t:1}],[5,2,3,2,1,"i",1,S],[5,2,2,4,4,"m",1,S]] },
  { n: 8, sec: "A", key: "E", pos: "I", barres: [], fine: 1,
    lh: "E major ending: finger 1 on G♯ (3rd string, fret 1), 2 on E (4th string, fret 2), then the open low E. This bar is marked FIN (Fine): after the Da Capo the piece ends here.",
    rh: "p on the bass E with i and a together (G♯ + high E), then p on the open low E.",
    notes: [[0,1,1,0,0,"a",4],[0,1,3,1,1,"i",4,S],[0,2,4,2,2,"p",2,S],[2,2,6,0,0,"p",2]] },
  { n: 9, sec: "B", key: "Em", pos: "I → VIII → barre II",
    barres: [{ from: 4, to: 5, fret: 2, s1: 1, s2: 5, label: "Barre II (C. 2ª)" }],
    lh: "E minor section. Finger 2 plays G (1st string, fret 3) and slides up the string to C (fret 8) – a Romantic portamento. Then finger 1 on B (fret 7) and the open E. Beat 3: barre at fret 2 for the B7 chord (finger 4 on D♯), then finger 2 on G (1st string, fret 3).",
    rh: "p (low E) + m (open B) + a (G) together; slide, then m on C, a on B, m on the open E. Beat 3: p i m a together for the B7 chord, then m on G.",
    flag: "Slide: the edition shows a portamento line from G to a small guide note C. We play it as a slide with finger 2 and pluck the C.",
    notes: [[0,2,6,0,0,"p",4],[0,2,2,0,0,"m",4],[0,1,1,3,2,"a",1,{sl:1}],[1,1,1,8,2,"m",1],[2,1,1,7,1,"a",1],[3,1,1,0,0,"m",1],[4,2,5,2,1,"p",2,S],[4,2,3,2,1,"i",2,S],[4,2,2,4,4,"m",2,S],[4,1,1,2,1,"a",1,S],[5,1,1,3,2,"m",1]] },
  { n: 10, sec: "B", key: "Em", pos: "V → II (3rd–4th strings)", barres: [],
    lh: "Falling thirds on strings 3 and 4 while the open high E rings: (1 on 3rd string fret 5 + 3 on 4th string fret 7) → (1 fret 4 + 2 fret 5) → (1 fret 2 + 3 fret 4) → (open G + 1 on 4th string fret 2) → (1 fret 2 + 3 fret 4).",
    rh: "a on the high E together with p on the low E. Then each third: p on the 4th string + i on the 3rd string. Keep the thirds soft – the long high E is the melody.",
    notes: [[0,1,1,0,0,"a",6],[0,2,6,0,0,"p",1],[1,2,3,5,1,"i",1],[1,2,4,7,3,"p",1],[2,2,3,4,1,"i",1],[2,2,4,5,2,"p",1],[3,2,3,2,1,"i",1],[3,2,4,4,3,"p",1],[4,2,3,0,0,"i",1],[4,2,4,2,1,"p",1],[5,2,3,2,1,"i",1,S],[5,2,4,4,3,"p",1,S]] },
  { n: 11, sec: "B", key: "Em", pos: "open → IX → VII", barres: [],
    lh: "Beat 1 is all open strings (E minor). Melody on the off-beats: finger 4 on E (1st string, fret 12). Beat 2: 1 on A (4th string, fret 7), then 2 on C (1st string, fret 8). Beat 3: 3 on F♯ (5th string, fret 9), then 4 on A (2nd string, fret 10).",
    rh: "p i m together on the open chord, then a on the high E. p on each bass, a/m on the melody. The melody notes fall between the beats – let each one ring.",
    notes: [[0,2,6,0,0,"p",2],[0,2,3,0,0,"i",2],[0,2,2,0,0,"m",2],[1,1,1,12,4,"a",1,{rs:1}],[2,2,4,7,1,"p",2],[3,1,1,8,2,"a",1,{rs:1}],[4,2,5,9,3,"p",2],[5,1,2,10,4,"m",1]] },
  { n: 12, sec: "B", key: "Em", pos: "barre VII → I",
    barres: [{ from: 0, to: 3, fret: 7, s1: 2, s2: 6, label: "Full barre VII (C. 7ª)" }],
    lh: "Full barre at fret 7: the barre holds the low B (6th string) and F♯ (2nd string); finger 2 on D♯ (3rd string, fret 8). Then 3 on B (4th string, fret 9), hammer finger 4 onto C (fret 10), and play B again with 3. Beat 3: let go of the barre – open B – then finger 2 on F♯ (1st string, fret 2). Keep finger 2 on the string: it slides up to G in the next bar (guide finger).",
    rh: "p (low B) + i m (D♯, F♯) together; p on the B, the C is a hammer-on (no pluck), p on B, m on the open B, a on F♯.",
    flag: "The edition slurs B→C (hammer-on); the Mutopia duo arrangement slurs C→B instead. Both work.",
    notes: [[0,1,2,7,1,"m",4],[0,1,3,8,2,"i",4,S],[0,2,6,7,1,"p",1],[1,2,4,9,3,"p",1,{h:1}],[2,2,4,10,4,"",1],[3,2,4,9,3,"p",1,S],[4,2,2,0,0,"m",2],[5,1,1,2,2,"a",1]] },
  { n: 13, sec: "B", key: "Em", pos: "II → IV → V", barres: [],
    lh: "Like bar 1, but in E minor: (1 on 4th string fret 2 + 2 on 1st string fret 3) → (1 fret 4 + 2 fret 5) → (1 on 4th string fret 5 + 3 on 1st string fret 7). Finger 2 arrives from the F♯ of bar 12 by sliding.",
    rh: "Same pattern as bar 1: p + a together, m on the open B. Let the melody grow (crescendo) towards the top.",
    notes: [[0,2,4,2,1,"p",1],[0,1,1,3,2,"a",2],[1,2,2,0,0,"m",1],[2,2,4,4,1,"p",1],[2,1,1,5,2,"a",2],[3,2,2,0,0,"m",1],[4,2,4,5,1,"p",1],[4,1,1,7,3,"a",2],[5,2,2,0,0,"m",1]] },
  { n: 14, sec: "B", key: "Em", pos: "VII", barres: [],
    lh: "7th-position scale: 4 on D (1st string, fret 10), pull-off to 2 on C (fret 8), 1 on B (fret 7); then 4 on A (2nd string, fret 10), 2 on G (fret 8), 1 on F♯ (fret 7). The open A bass rings underneath.",
    rh: "p on the open A together with m on D (C is a pull-off, not plucked), then alternate i-m-i-m. A good place for rest strokes on the melody.",
    notes: [[0,2,5,0,0,"p",6,S],[0,1,1,10,4,"m",1,{h:1,rs:1}],[1,1,1,8,2,"",1],[2,1,1,7,1,"i",1,{rs:1}],[3,1,2,10,4,"m",1,{rs:1}],[4,1,2,8,2,"i",1,{rs:1}],[5,1,2,7,1,"m",1,{rs:1}]] },
  { n: 15, sec: "B", key: "Em", pos: "I", barres: [],
    lh: "Open E, then open G + B. Beat 2: 4 on F♯ (1st string, fret 2), then 2 on C (2nd string, fret 1) + 3 on A (3rd string, fret 2). Beat 3: 2 on the bass B (5th string, fret 2) with the open B, then 1 on D♯ (4th string, fret 1) – keep 3 on the A.",
    rh: "a (open E), i + m (G + B); a (F♯), i + m (A + C); p + m (bass B + open B), p + i (D♯ + A). Slow down a little (rit.).",
    notes: [[0,1,1,0,0,"a",2],[1,2,3,0,0,"i",1],[1,2,2,0,0,"m",1],[2,1,1,2,4,"a",2],[3,2,3,2,3,"i",1],[3,2,2,1,2,"m",1],[4,1,2,0,0,"m",2],[4,2,5,2,2,"p",1],[5,2,4,1,1,"p",1],[5,2,3,2,3,"i",1]] },
  { n: 16, sec: "B", key: "Em", pos: "I", barres: [], dc: 1,
    lh: "E minor ending: finger 2 on E (4th string, fret 2) with the open G and high E, then the open low E. Then D.C. al Fine: go back to bar 1 and end at bar 8.",
    rh: "p + i + a together, then p on the open low E.",
    notes: [[0,1,1,0,0,"a",4],[0,1,3,0,0,"i",4],[0,2,4,2,2,"p",2,S],[2,2,6,0,0,"p",2]] },
];
