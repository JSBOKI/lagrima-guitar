# Guitarlele roll-out plan

Guitarlele = A D G C E A (guitar with a capo at fret 5; same fret = a 4th higher).
Infrastructure (done 2026-10-25): global Guitar | Guitarlele toggle (header + every song/lesson page, saved in
localStorage), per-song sub-toggle **Play guitar shapes (sounds a 4th higher)** / **Match original key**,
guitarlele tuning in notes.js, guitarlele chord entries (`gls_*` same shapes, `glk_*` original key), tuner link,
verification script `test/glcheck.mjs`. Songs not yet arranged show “Guitarlele version coming soon”.

To add a song: arrange it in `js/instrument.js` (add it to `SONGS`, map its lessons in `songOfLesson`,
add chord shapes for both modes), extend `test/glcheck.mjs`, bump the cache name in `sw.js`.

## Songs first (≈2 per day, unit order)

| Day | Date | Songs | Notes |
|---|---|---|---|
| 1 | 2026-10-25 | ✅ Lágrima · ✅ Every Breath You Take (6 lessons) | done |
| 2 | 2026-10-26 | Creek Road (u4) · Cabin Lamp (u6) | bass-string melodies: check range below A2 |
| 3 | 2026-10-27 | Porch Rail (u6) · Wildwood Flower (u9) | |
| 4 | 2026-10-28 | Yard Limit (u9) · Shady Grove (u9) | |
| 5 | 2026-10-29 | Cripple Creek (u9) · Shenandoah (u9) | |
| 6 | 2026-10-30 | Man of Constant Sorrow (u9) · Asturias 1–2 (u11) | |
| 7 | 2026-10-31 | Asturias 3–6 (u11) | low-B/low-E bass passages need octave-up or simplified versions |

## Then exercises (≈4 lessons per day, unit order)

| Day | Date | Lessons |
|---|---|---|
| 8 | 2026-11-01 | u1-names · u1-arpeggio · u1-thumb · u2-em |
| 9 | 2026-11-02 | u2-g · u2-c · u2-am · u2-d |
| 10 | 2026-11-03 | u2-e · u2-changes · u2-cycle · u3-pinch |
| 11 | 2026-11-04 | u3-slow · u4-brush · u5-roll · u5-bumditty |
| 12 | 2026-11-05 | u5-arpeggio · u7-hammer · u7-pull · u7-both |
| 13 | 2026-11-06 | u8-dropd · u8-openg · u8-opend (alternate tunings — retuning a guitarlele needs its own approach) |
| 14 | 2026-11-07 | Rest of the chord library (18 remaining guitar chords) in both guitarlele modes |
