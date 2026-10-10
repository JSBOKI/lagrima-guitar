// Parse the lesson shorthand and build alphaTex for the same alphaTab engine Lágrima uses.
// Token: [p|i|m|a|x]{string}.{fret}[:leftFinger][@role][h][/duration][~]
//   duration: e eighth (default), q quarter, qd dotted quarter, h half, hd dotted half, w whole
//   ~ = brush down. (a+b)/q = chord. r/q = rest. h = hammer-on or pull-off slur starts here.
//   roles: R exact root, 5 exact fifth, c chord tone, m melody (may be a non-chord tone)

import { TUNINGS, midiOf, pcOf, spell } from "./notes.js";
import { CHORDS, LESSONS } from "./course-data.js";

const DUR = { e: 1, q: 2, qd: 3, h: 4, hd: 6, w: 8 };
const RF = { p: 1, i: 2, m: 3, a: 4 };
const BASE = { 1: ["8", ""], 2: ["4", ""], 3: ["4", "d"], 4: ["2", ""], 6: ["2", "d"], 8: ["1", ""] };

export function eighthsInBar(meter) {
  return meter[0] * 8 / meter[1];
}

function parseFlags(rest) {
  let role = null, hammer = false, s = rest || "";
  if (s.includes("h")) { hammer = true; s = s.replace(/h/g, ""); }
  if (s.startsWith("@")) {
    role = s.slice(1);
    s = "";
    if (!"R5cm".includes(role) || role.length !== 1) throw new Error("bad role @" + role);
  }
  if (s) throw new Error("bad flags " + rest);
  return { role, hammer };
}

function parseNote(body) {
  const m = body.match(/^([pimax])([1-6])\.(\d{1,2})(?::([1-4]))?(.*)$/);
  if (!m) throw new Error("bad note " + body);
  const fret = +m[3];
  if (fret > 15) throw new Error("fret " + fret);
  const flags = parseFlags(m[5]);
  return { rf: m[1], s: +m[2], f: fret, lf: m[4] ? +m[4] : 0, role: flags.role, h: flags.hammer };
}

export function parseToken(raw) {
  let brush = false, s = raw.trim();
  if (!s) throw new Error("empty token");
  if (s.includes("~")) { brush = true; s = s.replace("~", ""); }
  let dur = 1;
  const slash = s.lastIndexOf("/");
  if (slash >= 0) {
    const key = s.slice(slash + 1);
    if (!DUR[key]) throw new Error("bad duration /" + key + " in " + raw);
    dur = DUR[key];
    s = s.slice(0, slash);
  }
  if (s === "r") return { rest: true, dur, notes: [], brush: false };
  let notes;
  if (s.startsWith("(")) {
    if (!s.endsWith(")")) throw new Error("bad chord " + raw);
    notes = s.slice(1, -1).split("+").filter(Boolean).map(parseNote);
  } else notes = [parseNote(s)];
  return { rest: false, dur, notes, brush };
}

export function parseVoice(src) {
  return String(src).split("|").map((b) => b.trim()).filter(Boolean).map((bar) => {
    const toks = bar.split(/\s+/).filter(Boolean);
    if (!toks.length) throw new Error("empty bar");
    return toks.map(parseToken);
  });
}

export function parseLesson(lesson) {
  const v1 = parseVoice(lesson.v1);
  const v2 = lesson.v2 ? parseVoice(lesson.v2) : null;
  if (v2 && v2.length !== v1.length) throw new Error("voices have " + v1.length + " and " + v2.length + " bars");
  return { v1, v2 };
}

function durTok(eighths, extra) {
  const row = BASE[eighths];
  if (!row) throw new Error("duration " + eighths);
  const fx = [...extra];
  if (row[1]) fx.push(row[1]);
  return "." + row[0] + (fx.length ? "{" + fx.join(" ") + "}" : "");
}

function noteTok(n) {
  const fx = [];
  if (n.lf > 0) fx.push("lf " + (n.lf + 1));
  if (n.rf && n.rf !== "x" && RF[n.rf]) fx.push("rf " + RF[n.rf]);
  if (n.h) fx.push("h");
  return n.f + "." + n.s + (fx.length ? "{" + fx.join(" ") + "}" : "");
}

function voiceTex(bars) {
  return bars.map((bar) => bar.map((ev) => {
    if (ev.rest) return "r" + durTok(ev.dur, []);
    const fx = [];
    if (ev.brush) fx.push("bd");
    const body = ev.notes.length === 1 ? noteTok(ev.notes[0]) : "(" + ev.notes.map(noteTok).join(" ") + ")";
    return body + durTok(ev.dur, fx);
  }).join(" ")).join(" |\n");
}

export function lessonTex(lesson) {
  const parsed = parseLesson(lesson);
  const tuning = TUNINGS[lesson.tuning] || TUNINGS.standard;
  const head = [
    `\\title "${lesson.title.replace(/"/g, "")}"`,
    `\\subtitle "${lesson.credit || lesson.fingers || ""}"`,
    `\\artist "${lesson.credit ? "Traditional · original arrangement" : "Fingerpicking course"}"`,
    `\\tempo 60`,
    `\\track "Guitar"`,
    `\\staff {score tabs}`,
    `\\instrument acousticguitarsteel`,
    `\\tuning (${tuning.alpha})`,
    "",
  ].join("\n");
  const meta = `\\ts (${lesson.meter[0]} ${lesson.meter[1]}) \\ks ${lesson.key} `;
  const v1 = voiceTex(parsed.v1);
  let body = "\\voice\n" + meta + v1 + "\n";
  if (parsed.v2) body += "\\voice\n" + voiceTex(parsed.v2) + "\n";
  return head + body;
}

function chordAt(lesson, index) {
  if (!lesson.chords) return null;
  return typeof lesson.chords === "string" ? lesson.chords : lesson.chords[index];
}

function spans(bar) {
  const out = []; let t = 0;
  for (const ev of bar) {
    if (!ev.rest) {
      const seen = new Set();
      for (const n of ev.notes) {
        if (seen.has(n.s)) return { error: "two notes on string " + n.s + " at the same time" };
        seen.add(n.s);
        out.push({ t, end: t + ev.dur, s: n.s, f: n.f });
      }
    }
    t += ev.dur;
  }
  return out;
}

function rootPc(ch) { return pcOf(midiOf(ch.tuning || "standard", ch.rootAt.s, ch.rootAt.f)); }
function fifthPc(ch) { return pcOf(midiOf(ch.tuning || "standard", ch.fifthAt.s, ch.fifthAt.f)); }

export function validateAll() {
  const errors = [];
  for (const [id, ch] of Object.entries(CHORDS)) {
    const tuning = ch.tuning || "standard";
    if (!TUNINGS[tuning]) errors.push("chord " + id + " bad tuning");
    const rpc = rootPc(ch), fpc = fifthPc(ch);
    if ((rpc + 7) % 12 !== fpc) errors.push(`${id}: fifth is not a perfect fifth above the root`);
    if (!ch.tones.includes(rpc) || !ch.tones.includes(fpc)) errors.push(`${id}: tones missing root or fifth`);
    for (const [s, f] of Object.entries(ch.shape || {})) {
      const pc = pcOf(midiOf(tuning, +s, f));
      if (!ch.tones.includes(pc)) errors.push(`${id}: shape ${s}.${f} is ${spell(midiOf(tuning, +s, f)).name}, not a chord tone`);
    }
  }
  const ids = new Set();
  for (const lesson of LESSONS) {
    if (ids.has(lesson.id)) errors.push("duplicate " + lesson.id);
    ids.add(lesson.id);
    if (!TUNINGS[lesson.tuning]) errors.push(lesson.id + " bad tuning");
    const eighths = eighthsInBar(lesson.meter);
    if (!Number.isInteger(eighths)) errors.push(lesson.id + " bad meter");
    let parsed;
    try { parsed = parseLesson(lesson); }
    catch (e) { errors.push(lesson.id + ": " + e.message); continue; }
    const voices = [["v1", parsed.v1]];
    if (parsed.v2) voices.push(["v2", parsed.v2]);
    voices.forEach(([label, bars]) => {
      bars.forEach((bar, bi) => {
        const sum = bar.reduce((a, ev) => a + ev.dur, 0);
        if (sum !== eighths) errors.push(`${lesson.id} ${label} bar ${bi + 1} is ${sum} eighths, wanted ${eighths}`);
        const cid = chordAt(lesson, bi);
        const ch = cid ? CHORDS[cid] : null;
        if (cid && !ch) errors.push(`${lesson.id} unknown chord ${cid}`);
        if (ch && (ch.tuning || "standard") !== lesson.tuning) errors.push(`${lesson.id} bar ${bi + 1} chord ${cid} is ${ch.tuning} but lesson is ${lesson.tuning}`);
        for (const ev of bar) {
          if (ev.rest) continue;
          for (const n of ev.notes) {
            if (n.s < 1 || n.s > 6 || n.f < 0 || n.f > 15) errors.push(`${lesson.id} bad fret ${n.s}.${n.f}`);
            if (lesson.strictBass && n.rf === "p" && n.role !== "R" && n.role !== "5") errors.push(`${lesson.id} bar ${bi + 1} thumb ${n.s}.${n.f} is not tagged root or fifth`);
            if (!ch || !n.role) continue;
            const pc = pcOf(midiOf(lesson.tuning, n.s, n.f));
            if (n.role === "R" && (n.s !== ch.rootAt.s || n.f !== ch.rootAt.f)) errors.push(`${lesson.id} bar ${bi + 1} @R is ${n.s}.${n.f}, ${cid} root is ${ch.rootAt.s}.${ch.rootAt.f}`);
            if (n.role === "5" && (n.s !== ch.fifthAt.s || n.f !== ch.fifthAt.f)) errors.push(`${lesson.id} bar ${bi + 1} @5 is ${n.s}.${n.f}, ${cid} fifth is ${ch.fifthAt.s}.${ch.fifthAt.f}`);
            if (n.role === "c" && !ch.tones.includes(pc)) errors.push(`${lesson.id} bar ${bi + 1} ${n.s}.${n.f} ${spell(midiOf(lesson.tuning, n.s, n.f)).label} is not a ${cid} chord tone`);
          }
        }
        for (let ei = 0; ei < bar.length; ei++) {
          const ev = bar[ei];
          if (!ev.rest) for (const n of ev.notes) if (n.h) {
            let dest = null;
            for (let ej = ei + 1; ej < bar.length && !dest; ej++) {
              const ev2 = bar[ej];
              if (!ev2.rest) dest = ev2.notes.find((x) => x.s === n.s) || null;
            }
            if (!dest) errors.push(`${lesson.id} bar ${bi + 1} slur from ${n.s}.${n.f} has no landing`);
            else if (lesson.slur === "hammer" && dest.f <= n.f) errors.push(`${lesson.id} hammer should rise (${n.s}.${n.f} → ${dest.f})`);
            else if (lesson.slur === "pull" && dest.f >= n.f) errors.push(`${lesson.id} pull-off should fall (${n.s}.${n.f} → ${dest.f})`);
            else if (dest.f === n.f) errors.push(`${lesson.id} slur stays on the same fret`);
          }
        }
      });
    });
    if (parsed.v2) {
      parsed.v1.forEach((bar, bi) => {
        const a = spans(bar), b = spans(parsed.v2[bi]);
        if (a.error) errors.push(`${lesson.id} bar ${bi + 1} ${a.error}`);
        if (b.error) errors.push(`${lesson.id} bar ${bi + 1} ${b.error}`);
        if (!a.error && !b.error) {
          for (const x of a) for (const y of b) {
            if (x.s === y.s && x.t < y.end && y.t < x.end) errors.push(`${lesson.id} bar ${bi + 1} both voices use string ${x.s}`);
          }
        }
      });
    }
  }
  return errors;
}

/** Flat list of sounded note names for tests and the finger guide. */
export function soundedNotes(lesson, voice = "v1") {
  const parsed = parseLesson(lesson);
  const bars = voice === "v2" ? parsed.v2 : parsed.v1;
  if (!bars) return [];
  const out = [];
  bars.forEach((bar, bi) => {
    for (const ev of bar) {
      if (ev.rest) continue;
      for (const n of ev.notes) {
        if (n.rf === "x") continue;
        const midi = midiOf(lesson.tuning, n.s, n.f);
        out.push({ bar: bi + 1, s: n.s, f: n.f, rf: n.rf, role: n.role, midi, ...spell(midi) });
      }
    }
  });
  return out;
}
