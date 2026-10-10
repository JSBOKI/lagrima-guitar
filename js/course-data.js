// Folk & Appalachian fingerpicking course.
// Melodies marked traditional are public domain. Every fingerstyle setting here is original.
// Elizabeth Cotten’s “Freight Train” is still in copyright, so that tune is not included —
// “Yard Limit” is a new alternating-bass study instead.
//
// Music shorthand is documented in coursetex.js. chords: one name, or one name per bar.

export const CHORDS = {
  // rootAt / fifthAt are the bass strings the alternating thumb must hit.
  G: { tuning: "standard", rootAt: { s: 6, f: 3 }, fifthAt: { s: 4, f: 0 }, tones: [7, 11, 2], shape: { 6: 3, 5: 2, 4: 0, 3: 0, 2: 0, 1: 3 } },
  C: { tuning: "standard", rootAt: { s: 5, f: 3 }, fifthAt: { s: 6, f: 3 }, tones: [0, 4, 7], shape: { 6: 3, 5: 3, 4: 2, 3: 0, 2: 1, 1: 0 } },
  Am: { tuning: "standard", rootAt: { s: 5, f: 0 }, fifthAt: { s: 4, f: 2 }, tones: [9, 0, 4], shape: { 5: 0, 4: 2, 3: 2, 2: 1, 1: 0 } },
  D: { tuning: "standard", rootAt: { s: 4, f: 0 }, fifthAt: { s: 5, f: 0 }, tones: [2, 6, 9], shape: { 5: 0, 4: 0, 3: 2, 2: 3, 1: 2 } },
  E: { tuning: "standard", rootAt: { s: 6, f: 0 }, fifthAt: { s: 5, f: 2 }, tones: [4, 8, 11], shape: { 6: 0, 5: 2, 4: 2, 3: 1, 2: 0, 1: 0 } },
  Em: { tuning: "standard", rootAt: { s: 6, f: 0 }, fifthAt: { s: 5, f: 2 }, tones: [4, 7, 11], shape: { 6: 0, 5: 2, 4: 2, 3: 0, 2: 0, 1: 0 } },
  A: { tuning: "standard", rootAt: { s: 5, f: 0 }, fifthAt: { s: 4, f: 2 }, tones: [9, 1, 4], shape: { 5: 0, 4: 2, 3: 2, 2: 2, 1: 0 } },
  Dm: { tuning: "standard", rootAt: { s: 4, f: 0 }, fifthAt: { s: 5, f: 0 }, tones: [2, 5, 9], shape: { 5: 0, 4: 0, 3: 2, 2: 3, 1: 1 } },
  F: { tuning: "standard", rootAt: { s: 6, f: 1 }, fifthAt: { s: 5, f: 3 }, tones: [5, 9, 0], shape: { 6: 1, 5: 3, 4: 3, 3: 2, 2: 1, 1: 1 } },
  Ddrop: { tuning: "dropd", rootAt: { s: 6, f: 0 }, fifthAt: { s: 5, f: 0 }, tones: [2, 6, 9], shape: { 6: 0, 5: 0, 4: 0, 3: 2, 2: 3, 1: 2 } },
  Gopen: { tuning: "openg", rootAt: { s: 5, f: 0 }, fifthAt: { s: 4, f: 0 }, tones: [7, 11, 2], shape: { 6: 0, 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } },
  Copeng: { tuning: "openg", rootAt: { s: 5, f: 5 }, fifthAt: { s: 4, f: 5 }, tones: [0, 4, 7], shape: { 6: 5, 5: 5, 4: 5, 3: 5, 2: 5, 1: 5 } },
  Dopeng: { tuning: "openg", rootAt: { s: 5, f: 7 }, fifthAt: { s: 4, f: 7 }, tones: [2, 6, 9], shape: { 6: 7, 5: 7, 4: 7, 3: 7, 2: 7, 1: 7 } },
  Dopend: { tuning: "opend", rootAt: { s: 6, f: 0 }, fifthAt: { s: 5, f: 0 }, tones: [2, 6, 9], shape: { 6: 0, 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } },
  Aopend: { tuning: "opend", rootAt: { s: 6, f: 7 }, fifthAt: { s: 5, f: 7 }, tones: [9, 1, 4], shape: { 6: 7, 5: 7, 4: 7, 3: 7, 2: 7, 1: 7 } },
};

export const UNITS = [
  { id: "u1", title: "Right hand on a steel string", blurb: "Same p-i-m-a you use for Lágrima, with the arm resting and the thumb doing more of the work." },
  { id: "u2", title: "Alternating-thumb bass", blurb: "Travis picking, built up on C, G, Am, D and E. The thumb alternates the root and the fifth — not the octave." },
  { id: "u3", title: "Pinches", blurb: "Thumb and a finger together, then the pattern keeps walking." },
  { id: "u4", title: "Carter Family style", blurb: "Thumb on the beat, index brushes the higher strings. Then a melody on the bass strings." },
  { id: "u5", title: "Appalachian patterns", blurb: "A forward roll, a clawhammer-style bum-ditty, and the p-i-m-a arpeggio on folk chords." },
  { id: "u6", title: "Melody over alternating bass", blurb: "The thumb keeps the root–fifth bass going while the fingers sing." },
  { id: "u7", title: "Hammer-ons and pull-offs", blurb: "Left-hand slurs that don’t stop the thumb." },
  { id: "u8", title: "Drop D, open G, open D", blurb: "Retune, check the open strings, then a simple alternating bass in each tuning." },
  { id: "u9", title: "Tunes", blurb: "Short original settings of public-domain melodies, plus one original study in place of Freight Train." },
];

const Gpat = "p6.3:2@R i3.0@c p4.0@5 m2.0@c p6.3:2@R i3.0@c p4.0@5 m1.3:4@c";
const Cpat = "p5.3:3@R i3.0@c p6.3:4@5 m2.1:1@c p5.3:3@R i3.0@c p6.3:4@5 m1.0@c";
const Ampat = "p5.0@R i3.2:3@c p4.2:2@5 m2.1:1@c p5.0@R i3.2:3@c p4.2:2@5 m1.0@c";
const Dpat = "p4.0@R i3.2:1@c p5.0@5 m2.3:3@c p4.0@R i3.2:1@c p5.0@5 m1.2:2@c";
const Epat = "p6.0@R i3.1:1@c p5.2:2@5 m2.0@c p6.0@R i3.1:1@c p5.2:2@5 m1.0@c";
const Gbass = "p6.3:2@R/q p4.0@5/q p6.3:2@R/q p4.0@5/q";
const Abass = "p5.0@R/q p4.2:2@5/q p5.0@R/q p4.2:2@5/q";

export const LESSONS = [
  { id: "u1-names", unit: "u1", title: "p · i · m · a, steel-string posture",
    explain: "Rest the forearm lightly on the upper bout so the wrist can hang. The thumb (p) sits a little more to the side than in classical position and covers strings 6, 5 and 4. Index (i) lives near string 3, middle (m) near string 2, ring (a) near string 1. Flesh or nails both work — pick one and stay even. Play each finger on its home string, free stroke, and listen for the same volume.",
    fingers: "p thumb · i index · m middle · a ring. One finger per bar, all open strings.",
    goals: [60, 80], tempo: 60, meter: [4, 4], tuning: "standard", key: "cmajor",
    v1: `p6.0/q p6.0/q p5.0/q p4.0/q |
i3.0/q i3.0/q i3.0/q i3.0/q |
m2.0/q m2.0/q m2.0/q m2.0/q |
a1.0/q a1.0/q a1.0/q a1.0/q` },

  { id: "u1-arpeggio", unit: "u1", title: "Open-string p-i-m-a walk",
    explain: "Now the four fingers take turns, one sound at a time. Keep the thumb on the bass string of the bar and let i, m and a walk up strings 3, 2 and 1. The click should land on every thumb note. If a finger rushes, go back to the previous lesson’s tempo.",
    fingers: "Each group is p i m a. Thumb string changes; i m a stay on 3, 2 and 1.",
    goals: [60, 80], tempo: 60, meter: [4, 4], tuning: "standard", key: "cmajor",
    v1: `p6.0 i3.0 m2.0 a1.0 p6.0 i3.0 m2.0 a1.0 |
p5.0 i3.0 m2.0 a1.0 p5.0 i3.0 m2.0 a1.0 |
p4.0 i3.0 m2.0 a1.0 p4.0 i3.0 m2.0 a1.0 |
p4.0 i3.0 m2.0 a1.0 p4.0 i3.0 m2.0 a1.0` },

  { id: "u1-thumb", unit: "u1", title: "A steady thumb",
    explain: "Folk fingerstyle stands or falls on the thumb. Plant p, pluck downward (toward the floor) and let it come to rest against the next string — a light rest stroke is welcome on bass notes. Quarters first, then eighths. The other fingers stay quiet and curved, just off the treble strings.",
    fingers: "Thumb only. Strings 6, 5 and 4, open.",
    goals: [60, 90], tempo: 60, meter: [4, 4], tuning: "standard", key: "cmajor",
    v1: `p6.0/q p5.0/q p4.0/q p5.0/q |
p6.0/q p5.0/q p4.0/q p5.0/q |
p6.0 p5.0 p4.0 p5.0 p6.0 p5.0 p4.0 p5.0 |
p6.0 p4.0 p6.0 p4.0 p5.0 p4.0 p5.0 p4.0` },

  { id: "u2-em", unit: "u2", title: "Em: root then fifth",
    explain: "Alternating bass means the thumb swaps two different chord notes: the root, then the fifth. On Em the root is the open 6th string (E) and the fifth is B, 5th string fret 2 — already under finger 2. It is not the octave E on the 4th string. Bars 1–2 are the bass alone. Bar 3 leaves a hole on every off-beat. Bar 4 fills those holes with i and m.",
    fingers: "p = E then B. i on the open G, m on the open B and the open high E. Hold finger 2 (and finger 3 on the 4th string, fret 2) the whole time.",
    goals: [60, 80], tempo: 60, meter: [4, 4], tuning: "standard", key: "eminor", chords: "Em", strictBass: true,
    v1: `p6.0@R/q p5.2:2@5/q p6.0@R/q p5.2:2@5/q |
p6.0@R/q p5.2:2@5/q p6.0@R/q p5.2:2@5/q |
p6.0@R r p5.2:2@5 r p6.0@R r p5.2:2@5 r |
p6.0@R i3.0@c p5.2:2@5 m2.0@c p6.0@R i3.0@c p5.2:2@5 m1.0@c` },

  { id: "u2-g", unit: "u2", title: "G: skip to the open D",
    explain: "G’s root is the 6th string, fret 3 (finger 2). Its fifth is D — the open 4th string — so the thumb jumps over the 5th string. Finger 1 can stay on the 5th string, fret 2 (B) even when you don’t pluck it; it keeps the chord standing. Same build-up: bass, bass with holes, then i and m on the off-beats. The last note of bar 4 is the high G, finger 4.",
    fingers: "p alternates G (6th fret 3) and D (4th open). i and m play G, B and the high G — all chord tones.",
    goals: [60, 80], tempo: 60, meter: [4, 4], tuning: "standard", key: "gmajor", chords: "G", strictBass: true,
    v1: `p6.3:2@R/q p4.0@5/q p6.3:2@R/q p4.0@5/q |
p6.3:2@R/q p4.0@5/q p6.3:2@R/q p4.0@5/q |
p6.3:2@R r p4.0@5 r p6.3:2@R r p4.0@5 r |
${Gpat} |
p6.3:2@R i3.0@c p4.0@5 m1.3:4@c p6.3:2@R i2.0@c p4.0@5 m2.0@c` },

  { id: "u2-c", unit: "u2", title: "C: the fifth sits below the root",
    explain: "C’s root is the 5th string, fret 3 (finger 3). The fifth is G. In this open shape the bass G is not on the 4th string (that fret is E, the third). It is the 6th string, fret 3 — a step below the root. Use finger 4 there, or lay finger 3 across both the 6th and 5th strings at fret 3. The thumb plays C, then reaches outward to G.",
    fingers: "p = C then low G. i plays the open G string, m plays C (2nd string, finger 1) or the open high E.",
    goals: [60, 80], tempo: 60, meter: [4, 4], tuning: "standard", key: "cmajor", chords: "C", strictBass: true,
    v1: `p5.3:3@R/q p6.3:4@5/q p5.3:3@R/q p6.3:4@5/q |
p5.3:3@R/q p6.3:4@5/q p5.3:3@R/q p6.3:4@5/q |
p5.3:3@R r p6.3:4@5 r p5.3:3@R r p6.3:4@5 r |
${Cpat} |
p5.3:3@R i2.1:1@c p6.3:4@5 m3.0@c p5.3:3@R i1.0@c p6.3:4@5 m2.1:1@c` },

  { id: "u2-am", unit: "u2", title: "Am: root open, fifth inside the chord",
    explain: "Am’s root is the open 5th string. The fifth is E, and the one inside the chord is the 4th string, fret 2 (finger 2) — not the open 6th string, which is a lower E and makes the chord muddy. Finger 3 holds the 3rd string, fret 2, and finger 1 holds the 2nd string, fret 1. Those are the notes i and m pluck.",
    fingers: "p = open A, then E on the 4th string. i = A (finger 3). m = C (finger 1) or the open high E.",
    goals: [60, 80], tempo: 60, meter: [4, 4], tuning: "standard", key: "aminor", chords: "Am", strictBass: true,
    v1: `p5.0@R/q p4.2:2@5/q p5.0@R/q p4.2:2@5/q |
p5.0@R/q p4.2:2@5/q p5.0@R/q p4.2:2@5/q |
p5.0@R r p4.2:2@5 r p5.0@R r p4.2:2@5 r |
${Ampat}` },

  { id: "u2-d", unit: "u2", title: "D: the fifth is the open A",
    explain: "The little D triangle lives on strings 1–3, so the bass has to step outside it. The root is the open 4th string (D). The fifth is A, the open 5th string. Mute the 6th string with the side of the thumb so it doesn’t ring. Finger 1 is on the 3rd string, finger 3 on the 2nd, finger 2 on the 1st — the same D shape you already know.",
    fingers: "p = open D, then open A. i = A (3rd string, finger 1). m = D (finger 3) or F♯ (finger 2).",
    goals: [60, 80], tempo: 60, meter: [4, 4], tuning: "standard", key: "dmajor", chords: "D", strictBass: true,
    v1: `p4.0@R/q p5.0@5/q p4.0@R/q p5.0@5/q |
p4.0@R/q p5.0@5/q p4.0@R/q p5.0@5/q |
p4.0@R r p5.0@5 r p4.0@R r p5.0@5 r |
${Dpat}` },

  { id: "u2-e", unit: "u2", title: "E: fifth, not the octave",
    explain: "Both the 6th string and the 4th string, fret 2, are E. Alternating those two is root and octave — the same note twice. The fifth is B, 5th string, fret 2, with finger 2. Leave finger 3 on the 4th string so the chord stays complete, and let i take the G♯ (3rd string, fret 1, finger 1). m takes the open B or the open high E.",
    fingers: "p = open low E, then B. Do not use the 4th-string E as the alternating bass.",
    goals: [60, 80], tempo: 60, meter: [4, 4], tuning: "standard", key: "emajor", chords: "E", strictBass: true,
    v1: `p6.0@R/q p5.2:2@5/q p6.0@R/q p5.2:2@5/q |
p6.0@R/q p5.2:2@5/q p6.0@R/q p5.2:2@5/q |
p6.0@R r p5.2:2@5 r p6.0@R r p5.2:2@5 r |
${Epat}` },

  { id: "u2-changes", unit: "u2", title: "Changing G, C and D",
    explain: "Keep the thumb pattern identical while the left hand moves. Look at the next bass fret before you leave the chord. G to C: finger 2 leaves the 6th string and the low G becomes finger 4, while finger 3 takes the 5th string. C back to G is the reverse. D drops the 6th string entirely — thumb on 4 then 5. Loop this until the changes don’t break the click.",
    fingers: "One bar of the full pattern on each chord: G, C, G, D.",
    goals: [60, 80], tempo: 60, meter: [4, 4], tuning: "standard", key: "gmajor", chords: ["G", "C", "G", "D"], strictBass: true,
    v1: `${Gpat} |
${Cpat} |
${Gpat} |
${Dpat}` },

  { id: "u2-cycle", unit: "u2", title: "C, G, Am and E in a row",
    explain: "A second change-up, using the two chords that weren’t in the previous lesson together. Am to E is a one-fret slide: the fingers on frets 2 move from strings 4 and 3 onto strings 5 and 4, and finger 1 hops from the 2nd string to the 3rd. Say the bass notes out loud once — C, G, G, D, A, E, E, B — before you add the fingers.",
    fingers: "Full pattern, one bar each: C, G, Am, E.",
    goals: [60, 80], tempo: 60, meter: [4, 4], tuning: "standard", key: "cmajor", chords: ["C", "G", "Am", "E"], strictBass: true,
    v1: `${Cpat} |
${Gpat} |
${Ampat} |
${Epat}` },

  { id: "u3-pinch", unit: "u3", title: "Pinch, then walk",
    explain: "A pinch is the thumb and one finger sounding together. The outside pinch pairs p with a (bass string and 1st string). The inside pinch pairs p with m or i, on strings that sit closer together. Pinch on beat 1, let i answer, thumb the fifth on beat 2, then m. The pinch is the loudest sound; the single notes stay lighter.",
    fingers: "Bars 1–2 are G (outside pinch with a, then an inside pinch with m). Bars 3–4 are the same idea on C.",
    goals: [60, 80], tempo: 60, meter: [4, 4], tuning: "standard", key: "gmajor", chords: ["G", "G", "C", "C"], strictBass: true,
    v1: `(p6.3:2@R+a1.3:4@c) i3.0@c p4.0@5 m2.0@c (p6.3:2@R+a1.3:4@c) i3.0@c p4.0@5 m2.0@c |
(p6.3:2@R+m2.0@c) i3.0@c p4.0@5 a1.3:4@c (p6.3:2@R+m2.0@c) i3.0@c p4.0@5 a1.3:4@c |
(p5.3:3@R+a1.0@c) i3.0@c p6.3:4@5 m2.1:1@c (p5.3:3@R+a1.0@c) i3.0@c p6.3:4@5 m2.1:1@c |
(p5.3:3@R+m2.1:1@c) i3.0@c p6.3:4@5 a1.0@c (p5.3:3@R+m2.1:1@c) i3.0@c p6.3:4@5 a1.0@c` },

  { id: "u3-slow", unit: "u3", title: "Slow pinches on the beat",
    explain: "Same two chords, now with the pinch held for a whole quarter so you can hear the two notes start together. If one of them is late, stop and pluck the pair ten times with no pattern at all. Then put the fifth back in on beats 2 and 4.",
    fingers: "Quarter-note pinch on beats 1 and 3, lone thumb on the fifth for beats 2 and 4.",
    goals: [50, 70], tempo: 50, meter: [4, 4], tuning: "standard", key: "gmajor", chords: ["G", "C"], strictBass: true,
    v1: `(p6.3:2@R+a1.3:4@c)/q p4.0@5/q (p6.3:2@R+m2.0@c)/q p4.0@5/q |
(p5.3:3@R+a1.0@c)/q p6.3:4@5/q (p5.3:3@R+m2.1:1@c)/q p6.3:4@5/q` },

  { id: "u4-brush", unit: "u4", title: "Boom-chuck: thumb then brush",
    explain: "Carter-style rhythm is the opposite accent of a classical arpeggio. The thumb plays one bass note on the beat — root, fifth, root, fifth — and the index finger brushes down across the higher strings on the off-beat. One motion, from string 3 toward the floor, not three separate plucks. Keep the brush short and quiet so the bass note still owns the beat.",
    fingers: "p on the beat. The brushed chord is marked as a down-brush: on G, strings 3–1; on C, strings 3–1 of the C shape.",
    goals: [60, 84], tempo: 60, meter: [4, 4], tuning: "standard", key: "gmajor", chords: ["G", "G", "C", "C"], strictBass: true,
    v1: `p6.3:2@R (i3.0@c+i2.0@c+i1.3:4@c)~ p4.0@5 (i3.0@c+i2.0@c+i1.3:4@c)~ p6.3:2@R (i3.0@c+i2.0@c+i1.3:4@c)~ p4.0@5 (i3.0@c+i2.0@c+i1.3:4@c)~ |
p6.3:2@R (i3.0@c+i2.0@c+i1.3:4@c)~ p4.0@5 (i3.0@c+i2.0@c+i1.3:4@c)~ p6.3:2@R (i3.0@c+i2.0@c+i1.3:4@c)~ p4.0@5 (i3.0@c+i2.0@c+i1.3:4@c)~ |
p5.3:3@R (i3.0@c+i2.1:1@c+i1.0@c)~ p6.3:4@5 (i3.0@c+i2.1:1@c+i1.0@c)~ p5.3:3@R (i3.0@c+i2.1:1@c+i1.0@c)~ p6.3:4@5 (i3.0@c+i2.1:1@c+i1.0@c)~ |
p5.3:3@R (i3.0@c+i2.1:1@c+i1.0@c)~ p6.3:4@5 (i3.0@c+i2.1:1@c+i1.0@c)~ p5.3:3@R (i3.0@c+i2.1:1@c+i1.0@c)~ p6.3:4@5 (i3.0@c+i2.1:1@c+i1.0@c)~` },

  { id: "u4-creek", unit: "u4", title: "Creek Road — melody on the bass strings",
    explain: "An original four-bar phrase in G, in the Carter habit: the thumb sings the tune on the lower strings and the index brushes on the off-beat. When the melody is on string 3 or 2, the brush skips that string so it doesn’t chop the note off. Bar 2’s A and E are stepping tones — they are not part of the G chord, and that’s allowed in a melody. Hold the last G and let the brush die away.",
    fingers: "Thumb melody: G, B, D, B / A, G, E, D / B, G, A, B / G. Brushes are the unmarked off-beats.",
    goals: [60, 80], tempo: 60, meter: [4, 4], tuning: "standard", key: "gmajor", chords: "G",
    v1: `p6.3:2@R (i3.0@c+i2.0@c+i1.3:4@c)~ p5.2:1@c (i3.0@c+i2.0@c+i1.3:4@c)~ p4.0@5 (i3.0@c+i2.0@c+i1.3:4@c)~ p5.2:1@c (i3.0@c+i2.0@c+i1.3:4@c)~ |
p3.2:1@m (i2.0@c+i1.3:4@c)~ p3.0@c (i2.0@c+i1.3:4@c)~ p4.2:1@m (i2.0@c+i1.3:4@c)~ p4.0@5 (i2.0@c+i1.3:4@c)~ |
p5.2:1@c (i3.0@c+i2.0@c+i1.3:4@c)~ p6.3:2@R (i3.0@c+i2.0@c+i1.3:4@c)~ p3.2:1@m (i2.0@c+i1.3:4@c)~ p2.0@c (i3.0@c+i1.3:4@c)~ |
p6.3:2@R (i3.0@c+i2.0@c+i1.3:4@c)~ r/q r/h` },

  { id: "u5-roll", unit: "u5", title: "Forward roll",
    explain: "A guitar version of the old-time forward roll: thumb, index, middle, index, and the thumb has moved to the fifth by the time it comes back. It feels like a banjo roll but the bass still spells root then fifth. Keep every note the same length — the roll falls apart when m is louder than i. G for two bars, then C.",
    fingers: "p i m i, twice per bar. On G the thumb is string 6 then string 4. On C it is string 5 then string 6.",
    goals: [60, 88], tempo: 60, meter: [4, 4], tuning: "standard", key: "gmajor", chords: ["G", "G", "C", "C"], strictBass: true,
    v1: `p6.3:2@R i3.0@c m2.0@c i1.3:4@c p4.0@5 i3.0@c m2.0@c i1.3:4@c |
p6.3:2@R i3.0@c m1.3:4@c i2.0@c p4.0@5 i3.0@c m2.0@c i1.3:4@c |
p5.3:3@R i3.0@c m2.1:1@c i1.0@c p6.3:4@5 i3.0@c m2.1:1@c i1.0@c |
p5.3:3@R i2.1:1@c m1.0@c i3.0@c p6.3:4@5 i2.1:1@c m1.0@c i3.0@c` },

  { id: "u5-bumditty", unit: "u5", title: "Bum-ditty: brush, then thumb",
    explain: "Clawhammer guitar flips the Carter pattern around. The “bum” is a down-brush on the beat; the “ditty” is the thumb answering on the off-beat. The thumb still alternates root and fifth, it just sits in the holes instead of on the beat. On a steel string, brush with the back of the index nail or the pad — short, like you’re flicking a crumb off the strings.",
    fingers: "Brush on the beat, p on the &. Two bars of G, two of C. The thumb notes are still the root and the fifth.",
    goals: [56, 76], tempo: 56, meter: [4, 4], tuning: "standard", key: "gmajor", chords: ["G", "G", "C", "C"], strictBass: true,
    v1: `(i3.0@c+i2.0@c+i1.3:4@c)~ p6.3:2@R (i3.0@c+i2.0@c+i1.3:4@c)~ p4.0@5 (i3.0@c+i2.0@c+i1.3:4@c)~ p6.3:2@R (i3.0@c+i2.0@c+i1.3:4@c)~ p4.0@5 |
(i3.0@c+i2.0@c+i1.3:4@c)~ p6.3:2@R (i3.0@c+i2.0@c+i1.3:4@c)~ p4.0@5 (i3.0@c+i2.0@c+i1.3:4@c)~ p6.3:2@R (i3.0@c+i2.0@c+i1.3:4@c)~ p4.0@5 |
(i3.0@c+i2.1:1@c+i1.0@c)~ p5.3:3@R (i3.0@c+i2.1:1@c+i1.0@c)~ p6.3:4@5 (i3.0@c+i2.1:1@c+i1.0@c)~ p5.3:3@R (i3.0@c+i2.1:1@c+i1.0@c)~ p6.3:4@5 |
(i3.0@c+i2.1:1@c+i1.0@c)~ p5.3:3@R (i3.0@c+i2.1:1@c+i1.0@c)~ p6.3:4@5 (i3.0@c+i2.1:1@c+i1.0@c)~ p5.3:3@R (i3.0@c+i2.1:1@c+i1.0@c)~ p6.3:4@5` },

  { id: "u5-arpeggio", unit: "u5", title: "p-i-m-a on folk chords",
    explain: "This is the classical arpeggio you already practise, parked on the folk shapes. p still takes the root and then the fifth, and i m a climb the chord. Nothing new in the right hand — the work is keeping a full chord under the fingers while the thumb moves. Useful as a warm-up before the tunes.",
    fingers: "p i m a, twice in each bar. Chords: C, G, Am, Em.",
    goals: [60, 90], tempo: 60, meter: [4, 4], tuning: "standard", key: "cmajor", chords: ["C", "G", "Am", "Em"], strictBass: true,
    v1: `p5.3:3@R i3.0@c m2.1:1@c a1.0@c p6.3:4@5 i3.0@c m2.1:1@c a1.0@c |
p6.3:2@R i3.0@c m2.0@c a1.3:4@c p4.0@5 i3.0@c m2.0@c a1.3:4@c |
p5.0@R i3.2:3@c m2.1:1@c a1.0@c p4.2:2@5 i3.2:3@c m2.1:1@c a1.0@c |
p6.0@R i3.0@c m2.0@c a1.0@c p5.2:2@5 i3.0@c m2.0@c a1.0@c` },

  { id: "u6-cabin", unit: "u6", title: "Cabin Lamp — pinched melody",
    explain: "An original tune in G. The top staff is the melody; the bottom staff is the alternating bass you already know, root then fifth, the whole way. Wherever a melody note lands on a thumb note, you are pinching. The A in bars 2 and 3 is a passing tone — finger 1 on the 3rd string, fret 2, while finger 2 stays on the low G. Sing the tune once before you play it.",
    fingers: "Melody in quarters (m and i). Bass: p on G and D. Last bar holds the high G over a last root and fifth.",
    goals: [60, 80], tempo: 60, meter: [4, 4], tuning: "standard", key: "gmajor", chords: "G", strictBass: true,
    v1: `m2.0@c/q i2.3:3@c/q m2.0@c/q i3.0@c/q |
i3.2:1@m/q m2.0@c/q i2.3:3@c/h |
m2.0@c/q i3.2:1@m/q i3.0@c/q i3.2:1@m/q |
a1.3:4@c/w`,
    v2: `${Gbass} |
${Gbass} |
${Gbass} |
p6.3:2@R/q p4.0@5/q p6.3:2@R/h` },

  { id: "u6-porch", unit: "u6", title: "Porch Rail — melody on the off-beat",
    explain: "Another original G tune. Here the thumb keeps the beat (root, fifth, root, fifth) and the melody notes all sit on the “&”, so nothing is pinched. Count “1 & 2 &” out loud and put the tune only on the &. If the thumb waits for the melody, you’re late — the bass has to feel boring before the tune will swing.",
    fingers: "p on the numbered beats. i, m or a on the off-beats. Bar 2’s A is the only note outside the G chord.",
    goals: [60, 84], tempo: 60, meter: [4, 4], tuning: "standard", key: "gmajor", chords: "G", strictBass: true,
    v1: `p6.3:2@R m2.0@c p4.0@5 i2.3:3@c p6.3:2@R m2.0@c p4.0@5 i3.0@c |
p6.3:2@R i3.2:1@m p4.0@5 m2.0@c p6.3:2@R i3.0@c p4.0@5 a1.3:4@c |
p6.3:2@R m1.3:4@c p4.0@5 i2.0@c p6.3:2@R m2.3:3@c p4.0@5 i3.0@c |
p6.3:2@R m2.0@c p4.0@5 i3.0@c p6.3:2@R a1.3:4@c p4.0@5 m2.0@c` },

  { id: "u7-hammer", unit: "u7", title: "Hammer-ons that keep the thumb going",
    explain: "A hammer-on is a left-hand slur: pluck the first note, then snap a fretting finger down for the second. The right hand does not play the second note. On C, pluck the open 2nd string and hammer finger 1 at fret 1 — B up to C, the classic Carter hammer. On G, hammer finger 3 from the open B up to D at fret 3. The thumb must not pause to watch the hammer.",
    fingers: "The slur arc in the score is the hammer. “x” in the pattern means the right hand is silent. Two bars of C, two of G.",
    goals: [56, 76], tempo: 56, meter: [4, 4], tuning: "standard", key: "cmajor", chords: ["C", "C", "G", "G"], strictBass: true, slur: "hammer",
    v1: `p5.3:3@R i2.0h x2.1:1@c m3.0@c p6.3:4@5 i1.0@c p5.3:3@R m3.0@c |
p5.3:3@R i2.0h x2.1:1@c i3.0@c p6.3:4@5 m2.1:1@c p5.3:3@R i1.0@c |
p6.3:2@R i2.0h@c x2.3:3@c m3.0@c p4.0@5 i3.0@c p6.3:2@R m1.3:4@c |
p6.3:2@R i2.0h@c x2.3:3@c i1.3:4@c p4.0@5 m2.0@c p6.3:2@R i3.0@c` },

  { id: "u7-pull", unit: "u7", title: "Pull-offs",
    explain: "A pull-off is the hammer in reverse. Fret the higher note, pluck it, then pull that finger slightly down (toward the floor) as you lift, so the lower note sounds. On C and Am the move is finger 1 on the 2nd string, fret 1, pulling off to the open B. Don’t yank the string sideways — a small pluck is enough. The thumb’s root and fifth stay in time underneath.",
    fingers: "Slur from fret 1 down to open on the 2nd string. Two bars of C, two of Am.",
    goals: [56, 76], tempo: 56, meter: [4, 4], tuning: "standard", key: "aminor", chords: ["C", "C", "Am", "Am"], strictBass: true, slur: "pull",
    v1: `p5.3:3@R m2.1:1h@c x2.0 i3.0@c p6.3:4@5 m1.0@c p5.3:3@R i3.0@c |
p5.3:3@R m2.1:1h@c x2.0 m3.0@c p6.3:4@5 i1.0@c p5.3:3@R m2.1:1@c |
p5.0@R m2.1:1h@c x2.0 i3.2:3@c p4.2:2@5 m1.0@c p5.0@R i3.2:3@c |
p5.0@R m2.1:1h@c x2.0 i1.0@c p4.2:2@5 m3.2:3@c p5.0@R i2.1:1@c` },

  { id: "u7-both", unit: "u7", title: "Hammer and pull in one phrase",
    explain: "Bar 1 hammers B up to C. Bar 2 pulls that C back off to B. Same left-hand finger, same string, thumb never dropping the C bass. When both slurs are clean at the slower goal, join the two bars without a breath and bring the tempo up.",
    fingers: "C chord throughout. Hammer first bar, pull-off second bar.",
    goals: [60, 80], tempo: 60, meter: [4, 4], tuning: "standard", key: "cmajor", chords: "C", strictBass: true, slur: "mixed",
    v1: `p5.3:3@R i2.0h x2.1:1@c m3.0@c p6.3:4@5 i1.0@c p5.3:3@R m3.0@c |
p5.3:3@R m2.1:1h@c x2.0 i3.0@c p6.3:4@5 m1.0@c p5.3:3@R i3.0@c` },

  { id: "u8-dropd", unit: "u8", title: "Drop D: tune, check, alternate",
    explain: "Lower only the 6th string, a whole step, from E down to D. It should match the open 4th string one octave lower — that’s bar 1. Bar 2 checks the fifth: fret 7 on the 6th string is A, the same pitch as the open 5th string. The D chord is now 0 0 0 2 3 2. Root and fifth are both open: 6th string D, 5th string A. The treble fingers are the ordinary D shape.",
    fingers: "After the two checks, p alternates open D and open A. i m a play the D chord on top.",
    goals: [60, 80], tempo: 60, meter: [4, 4], tuning: "dropd", key: "dmajor", chords: "Ddrop",
    retune: "String 6: E → D. Leave the others alone.",
    v1: `p4.0@c/h p6.0@R/h |
p6.7@c/h p5.0@5/h |
p6.0@R/q p5.0@5/q p6.0@R/q p5.0@5/q |
p6.0@R r p5.0@5 r p6.0@R r p5.0@5 r |
p6.0@R i3.2:1@c p5.0@5 m2.3:3@c p6.0@R i3.2:1@c p5.0@5 m1.2:2@c` },

  { id: "u8-openg", unit: "u8", title: "Open G: one-finger chords",
    explain: "From standard, lower string 6 a whole step (E→D), string 5 a whole step (A→G) and string 1 a whole step (E→D). The open strings are a G chord: D G D G B D. Check by ear: string 6 matches string 4 an octave down, string 5 matches string 3 an octave down, and string 1 matches string 4 at the unison. A barre at fret 5 is C. A barre at fret 7 is D. The alternating bass stays on strings 5 and 4 — root G, fifth D — both open.",
    fingers: "Bar 1 is the thumb pattern. Bars 2–4 are slow brushes: open G, barre 5 (C), barre 7 (D). Finger 1 is the whole barre.",
    goals: [60, 76], tempo: 60, meter: [4, 4], tuning: "openg", key: "gmajor", chords: ["Gopen", "Gopen", "Copeng", "Dopeng"], strictBass: true,
    retune: "String 6 E→D, string 5 A→G, string 1 E→D.",
    v1: `p5.0@R/q p4.0@5/q p5.0@R/q p4.0@5/q |
(i6.0@c+i5.0@R+i4.0@5+i3.0@c+i2.0@c+i1.0@c)~/w |
(i6.5:1@c+i5.5:1@R+i4.5:1@5+i3.5:1@c+i2.5:1@c+i1.5:1@c)~/w |
(i6.7:1@c+i5.7:1@R+i4.7:1@5+i3.7:1@c+i2.7:1@c+i1.7:1@c)~/w` },

  { id: "u8-opend", unit: "u8", title: "Open D: root and fifth on the bottom",
    explain: "From standard: string 6 down to D, string 3 down to F♯, string 2 down to A, string 1 down to D. Open strings spell D A D F♯ A D — a D major chord. String 6 open is the root and string 5 open is the fifth, so the alternating thumb is the easiest one in the course. A barre at fret 7 is A major, and the same two strings, now fretted by the barre, are still root and fifth.",
    fingers: "Thumb on 6 then 5. The whole-note brushes are the open D chord and the fret-7 A barre. Finger 1 bars all six strings for the A.",
    goals: [60, 76], tempo: 60, meter: [4, 4], tuning: "opend", key: "dmajor", chords: ["Dopend", "Dopend", "Aopend", "Dopend"], strictBass: true,
    retune: "String 6 E→D, string 3 G→F♯, string 2 B→A, string 1 E→D.",
    v1: `p6.0@R/q p5.0@5/q p6.0@R/q p5.0@5/q |
(i6.0@R+i5.0@5+i4.0@c+i3.0@c+i2.0@c+i1.0@c)~/w |
(i6.7:1@R+i5.7:1@5+i4.7:1@c+i3.7:1@c+i2.7:1@c+i1.7:1@c)~/w |
p6.0@R/q p5.0@5/q (i6.0@R+i5.0@5+i4.0@c+i3.0@c+i2.0@c+i1.0@c)~/h` },

  { id: "u9-wildwood", unit: "u9", title: "Wildwood Flower",
    explain: "The melody is Joseph Philbrick Webster’s “I’ll Twine ’Mid the Ringlets” (1860), the parlour song that became Wildwood Flower. This fingerstyle setting is original — it is not Maybelle Carter’s arrangement. It’s written in C, an octave lower than the sheet-music vocal line, so it sits on strings 4, 3, 2 and 1. The thumb plays root and fifth under it. Bar 2 is an F: finger 1 on the 6th string, fret 1, while the melody walks E–F–E on the 4th string.",
    fingers: "Melody on top, bass underneath. Chords C, F, G, C, then the same again.",
    credit: "Melody: Webster, 1860 (public domain). Arrangement original.",
    goals: [60, 80], tempo: 60, meter: [2, 4], tuning: "standard", key: "cmajor",
    chords: ["C", "F", "G", "C", "C", "F", "G", "C"], strictBass: true,
    v1: `i3.0@m/q i3.2:2@m i2.1:1@m |
i4.2:2@m/q m4.3:4@m i4.2:2@m |
i2.3:3@m/q a1.0@m i2.3:3@m |
i3.0@m/h |
i3.0@m/q i3.2:2@m i2.1:1@m |
i4.2:2@m/q m4.3:4@m i4.2:2@m |
i2.3:3@m/q a1.0@m i2.3:3@m |
i3.0@m/h`,
    v2: `p5.3:3@R/q p6.3:4@5/q |
p6.1:1@R/q p5.3:3@5/q |
p6.3:2@R/q p4.0@5/q |
p5.3:3@R/h |
p5.3:3@R/q p6.3:4@5/q |
p6.1:1@R/q p5.3:3@5/q |
p6.3:2@R/q p4.0@5/q |
p5.3:3@R/h` },

  { id: "u9-yard", unit: "u9", title: "Yard Limit — an original Travis study",
    explain: "Elizabeth Cotten’s “Freight Train” is still in copyright, so it isn’t in this course. Yard Limit is a new tune in G that trains the same skill: a steady root–fifth thumb with a simple melody pinched on top. The contour is different on purpose (it starts G–B–D, not the Cotten riff). Keep the bass boring and let the melody lean on beats 1 and 3.",
    fingers: "Top voice melody, bottom voice the G alternating bass from Unit 2. The E and the A are passing tones.",
    credit: "Original exercise. Not “Freight Train”.",
    goals: [60, 84], tempo: 60, meter: [4, 4], tuning: "standard", key: "gmajor", chords: "G", strictBass: true,
    v1: `i3.0@c/q m2.0@c/q i2.3:3@c/q i3.0@c/q |
a1.0@m/q i2.3:3@c/q m2.0@c/q i2.3:3@c/q |
i3.0@c/q i3.2:1@m/q m2.0@c/q i2.3:3@c/q |
m2.0@c/h a1.3:4@c/h`,
    v2: `${Gbass} |
${Gbass} |
${Gbass} |
p6.3:2@R/h p4.0@5/h` },

  { id: "u9-shady", unit: "u9", title: "Shady Grove",
    explain: "A simple setting of the traditional Appalachian song (public domain — the tune was already in print by 1915, and many melodic variants exist). This one is in A dorian, played over Am: the bass alternates open A and the E on the 4th string, fret 2. Finger 3 holds the melody A on the 3rd string so finger 2 can keep the fifth. The second half climbs to the open high E. Not Jean Ritchie’s arrangement — a plain teaching version.",
    fingers: "Melody in eighths on top. Bass in quarters: A, E, A, E.",
    credit: "Traditional Appalachian melody (public domain). Arrangement original.",
    goals: [60, 80], tempo: 60, meter: [4, 4], tuning: "standard", key: "aminor", chords: "Am", strictBass: true,
    v1: `i3.2:3@m i3.2:3@m i3.2:3@m m2.0@m i2.1:1@m m2.0@m i3.2:3@m i3.0@m |
i3.2:3@m i3.2:3@m i3.2:3@m m2.0@m i2.1:1@m m2.0@m i3.2:3@m/q |
a1.0@m a1.0@m a1.0@m a1.0@m m2.3:3@m m2.0@m i3.2:3@m i3.0@m |
m2.0@m i2.3:3@m m2.0@m i3.2:3@m i3.2:3@m/h`,
    v2: `${Abass} |
${Abass} |
${Abass} |
p5.0@R/q p4.2:2@5/q p5.0@R/h` },

  { id: "u9-cripple", unit: "u9", title: "Cripple Creek",
    explain: "The old-time breakdown, A part only, in G. Melody in the low octave so it stays in open position: three Gs, then G–A, then B–A–G–E (that E is up on the open 1st string so the bass can keep the open D). The E and the A are melody notes, not bass notes — the thumb still plays only G and D. Carter players often pick this tune with the thumb; here the fingers take the melody and the thumb takes the alternating bass, which is the skill from Unit 6.",
    fingers: "Top: the fiddle tune. Bottom: G root and fifth, the whole way.",
    credit: "Traditional old-time melody (public domain). Arrangement original.",
    goals: [66, 92], tempo: 66, meter: [4, 4], tuning: "standard", key: "gmajor", chords: "G", strictBass: true,
    v1: `i3.0@c/q i3.0@c/q i3.0@c/q i3.0@c i3.2:1@m |
m2.0@c/q i3.2:1@m/q i3.0@c/q a1.0@m/q |
i3.0@c/q i3.0@c/q i3.0@c/q i3.0@c i3.2:1@m |
m2.0@c/q i3.2:1@m/q i3.0@c/h`,
    v2: `${Gbass} |
${Gbass} |
${Gbass} |
p6.3:2@R/q p4.0@5/q p6.3:2@R/h` },

  { id: "u9-shen", unit: "u9", title: "Shenandoah",
    explain: "The river shanty, first phrase, in D. It’s slow on purpose. The melody climbs to A (1st string, fret 5, finger 4) and B (fret 7, finger 3) — slide the hand up rather than stretching from first position, then come back for the F♯. Under the D bars the thumb alternates open D and open A. Under the A bar (the “rolling river”) the root is the open 5th string and the fifth is E, 4th string, fret 2. Let the last D ring.",
    fingers: "Melody on top. Bass: D’s root and fifth, then A’s root and fifth, then a held D.",
    credit: "Traditional American shanty (public domain). Arrangement original.",
    goals: [52, 68], tempo: 52, meter: [4, 4], tuning: "standard", key: "dmajor", chords: ["D", "D", "A", "D"], strictBass: true,
    v1: `i2.3:3@c/q i2.3:3@c/q m1.2:2@c/q a1.5:4@c/q |
a1.7:3@m/q a1.5:1@c/q m1.2:2@c/q i2.3:3@c/q |
a1.0@c/q m1.2:2@m/q i1.3:3@m/q a1.0@c/q |
i2.3:3@c/w`,
    v2: `p4.0@R/q p5.0@5/q p4.0@R/q p5.0@5/q |
p4.0@R/q p5.0@5/q p4.0@R/q p5.0@5/q |
p5.0@R/q p4.2:1@5/q p5.0@R/q p4.2:1@5/q |
p4.0@R/w` },

  { id: "u9-sorrow", unit: "u9", title: "Man of Constant Sorrow",
    explain: "This is the older dorian air (the song was in print by 1913), not the later bluegrass melody from the Stanley Brothers or O Brother. No sharps: F is natural. The verse sits on Dm, with one bar of C for the climb up to the high C (1st string, fret 8). On that C bar the bass is root then fifth and then a held root, so finger 4 is free for the high C. Dm’s alternating bass is the open 4th string (D, the root) and the open 5th string (A, the fifth) — the same pair as the D major pattern, now under a minor melody.",
    fingers: "Melody on top, mostly 1st and 2nd strings. Bass: Dm root/fifth, then C root/fifth, then Dm again.",
    credit: "Traditional melody (public domain, published by 1913). Not the O Brother arrangement.",
    goals: [56, 72], tempo: 56, meter: [4, 4], tuning: "standard", key: "aminor", chords: ["Dm", "C", "Dm", "Dm"], strictBass: true,
    v1: `i2.3:3@c/h i2.3:3@c a1.0@m i2.3:3@c i2.1:1@m |
a1.0@c/q a1.3:3@c/q a1.3:4@c a1.3:4@c a1.8:4@c a1.7:1@m |
a1.5:4@c/h a1.5:4@c a1.3:3@m i1.1:1@c a1.0@m |
i2.3:3@c/w`,
    v2: `p4.0@R/q p5.0@5/q p4.0@R/q p5.0@5/q |
p5.3:3@R/q p6.3:4@5/q p5.3:3@R/h |
p4.0@R/q p5.0@5/q p4.0@R/q p5.0@5/q |
p4.0@R/w` },
];
