#!/usr/bin/env python3
"""Render Unit 10 (Every Breath You Take) instructional videos from the app's own chord data.
Data comes from `node tools/ebyt-media-data.mjs <mode>` (CHORD_LIB / instrument.js / course-data.js), never hand-typed here.
usage: python3 tools/ebyt_videos.py [outdir]   -> media/ebyt/*.mp4 + *.jpg + manifest.json"""
import json, math, os, subprocess, sys, wave, struct
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "media", "ebyt")
W, H, FPS = 1280, 720, 24
FB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
F = lambda s, b=True: ImageFont.truetype(FB if b else FR, s)
BG = (14, 16, 22); WOOD = (58, 38, 26); WOOD2 = (72, 48, 32); FRET = (215, 215, 220); WHITE = (255, 255, 255); YEL = (255, 214, 10); GREY = (150, 156, 170)
FCOL = {1: (64, 170, 255), 2: (60, 220, 130), 3: (255, 160, 50), 4: (255, 92, 205)}
RHCOL = {"p": (167, 139, 250), "i": (34, 211, 238), "m": (244, 114, 182), "a": (251, 191, 36)}
ORD = {1: "1st", 2: "2nd", 3: "3rd", 4: "4th", 5: "5th", 6: "6th"}
MODES = {"guitar": ("GUITAR", "standard tuning  E A D G B E"), "key": ("GUITARLELE", "A D G C E A · match original key"),
         "shapes": ("GUITARLELE", "A D G C E A · guitar shapes (sounds a 4th higher)")}
NX0, NX1 = 200, 1230          # neck x-range
SY0, SGAP = 200, 54           # string 1 y, gap
SY = lambda s: SY0 + (s - 1) * SGAP
NY0, NY1 = SY(1) - 34, SY(6) + 34

def ease(t): t = max(0.0, min(1.0, t)); return 1 - (1 - t) ** 3
def dot_sprite(r, col, num, ring=WHITE, scale=4):
    S = r * 2 + 8
    im = Image.new("RGBA", (S * scale, S * scale), (0, 0, 0, 0)); d = ImageDraw.Draw(im); c = S * scale / 2
    d.ellipse([c - (r + 3) * scale, c - (r + 3) * scale, c + (r + 3) * scale, c + (r + 3) * scale], fill=ring)
    d.ellipse([c - r * scale, c - r * scale, c + r * scale, c + r * scale], fill=col)
    im = im.resize((S, S), Image.LANCZOS); d = ImageDraw.Draw(im)
    if num != "": d.text((S / 2, S / 2 + 1), str(num), font=F(int(r * 1.25)), fill=(0, 0, 0), anchor="mm")
    return im
def paste_c(img, spr, x, y, alpha=1.0):
    if alpha < 1: a = spr.getchannel("A").point(lambda v: int(v * alpha)); spr = spr.copy(); spr.putalpha(a)
    img.alpha_composite(spr, (int(x - spr.width / 2), int(y - spr.height / 2)))
def text(d, xy, s, size, fill=WHITE, anchor="la", bold=True, stroke=0):
    d.text(xy, s, font=F(size, bold), fill=fill, anchor=anchor, stroke_width=stroke, stroke_fill=(0, 0, 0))

class Neck:
    def __init__(self, frets, letters, x0=NX0, x1=NX1, minspan=5):
        fr = [f for f in frets if f != "x" and f > 0]
        self.lo = max(0, min(fr) - 1) if fr else 0
        self.hi = max(self.lo + minspan, (max(fr) if fr else 0) + 1)
        self.x0, self.x1, self.letters = x0, x1, letters
        d = lambda n: 1 - 2 ** (-n / 12)
        a, b = d(self.lo), d(self.hi)
        self.wire = {n: x0 + (d(n) - a) / (b - a) * (x1 - x0) for n in range(self.lo, self.hi + 1)}
    def fx(self, f): return self.wire[f - 1] + 0.62 * (self.wire[f] - self.wire[f - 1])
    def mid(self, f): return (self.wire[f - 1] + self.wire[f]) / 2
    def draw(self, img, glow=None, extend=0):
        d = ImageDraw.Draw(img)
        d.rounded_rectangle([self.x0 - 6, NY0, self.x1 + extend, NY1], 10, fill=WOOD)
        for n in range(self.lo + 1, self.hi + 1):
            if n in (3, 5, 7, 9, 15, 17): d.ellipse([self.mid(n) - 11, (NY0 + NY1) / 2 - 11, self.mid(n) + 11, (NY0 + NY1) / 2 + 11], fill=WOOD2)
            if n == 12:
                for yy in (SY(2) + SGAP / 2, SY(4) + SGAP / 2): d.ellipse([self.mid(n) - 11, yy - 11, self.mid(n) + 11, yy + 11], fill=WOOD2)
        for n, x in self.wire.items():
            if n == 0: d.rectangle([x - 9, NY0, x + 3, NY1], fill=(240, 235, 215))
            else: d.rectangle([x - 2, NY0, x + 2, NY1], fill=FRET)
        for s in range(1, 7):
            w = 1 + s * 0.8; y = SY(s); col = (205, 205, 212) if s < 4 else (205, 170, 110)
            if glow and s in glow:
                g = glow[s]; d.rectangle([self.x0 - 6, y - 9, self.x1 + extend, y + 9], fill=tuple(int(c * g * 0.55) + int(WOOD[i] * (1 - g * 0.55)) for i, c in enumerate(YEL)))
                col = tuple(int(col[i] + (YEL[i] - col[i]) * g) for i in range(3))
            d.rectangle([self.x0 - 6, y - w / 2, self.x1 + extend, y + w / 2], fill=col)
            text(d, (24, y), f"{ORD[s]}", 26, GREY, "lm"); text(d, (118, y), self.letters[s - 1], 30, WHITE, "lm")
        for n in range(self.lo + 1, self.hi + 1): text(d, (self.mid(n), NY1 + 26), str(n), 30, YEL if False else (230, 230, 230), "mm")
        text(d, (60, NY1 + 26), "fret", 24, GREY, "mm", bold=False)
    def marks(self, img, frets):
        d = ImageDraw.Draw(img)
        for i, f in enumerate(frets):
            s = 6 - i; y = SY(s); x = self.x0 - 30
            if f == "x": text(d, (x, y), "×", 40, (255, 90, 90), "mm")
            elif f == 0: d.ellipse([x - 14, y - 14, x + 14, y + 14], outline=(120, 255, 160), width=4)

class Enc:
    def __init__(self, path, audio=None):
        cmd = ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-"]
        if audio: cmd += ["-i", audio, "-c:a", "aac", "-b:a", "48k", "-shortest"]
        cmd += ["-c:v", "libx264", "-preset", "slow", "-crf", "30", "-tune", "animation", "-pix_fmt", "yuv420p", "-movflags", "+faststart", path]
        self.p = subprocess.Popen(cmd, stdin=subprocess.PIPE); self.n = 0
    def add(self, img): self.p.stdin.write(img.convert("RGB").tobytes()); self.n += 1
    def close(self): self.p.stdin.close(); assert self.p.wait() == 0

def header(d, title, sub, mode):
    m = MODES[mode]
    text(d, (30, 22), title, 50); text(d, (30, 84), sub, 26, GREY, bold=False)
    bw = d.textlength(m[0], font=F(26)) + 30
    d.rounded_rectangle([W - 30 - bw, 22, W - 30, 62], 8, fill=(64, 170, 255) if mode == "guitar" else (60, 220, 130))
    text(d, (W - 30 - bw / 2, 42), m[0], 26, (0, 0, 0), "mm"); text(d, (W - 30, 84), m[1], 22, GREY, "ra", bold=False)
def caption(d, main, second="", col=WHITE):
    d.rectangle([0, 556, W, H], fill=(0, 0, 0))
    text(d, (W / 2, 606), main, 46, col, "mm")
    if second: text(d, (W / 2, 670), second, 32, YEL, "mm", bold=False)

def strings_list(frets): return [6 - i for i, f in enumerate(frets) if f != "x"]

def left_video(ch, mode, letters, path):
    frets, fingers = ch["frets"], ch["fingers"]
    nk = Neck(frets, letters)
    title = ch["short"] + ("" if mode != "shapes" else f"  (guitar {ch['gshort']} grip)")
    sub = "LEFT HAND · thin 1st string on top, like the tab"
    by = {}
    for i, (f, g) in enumerate(zip(frets, fingers)):
        if g: by.setdefault(g, []).append((6 - i, f))
    steps = []
    for g in sorted(by):
        locs = by[g]
        if len(locs) == 1:
            s, f = locs[0]; steps.append((g, locs, f"Finger {g}: {ORD[s]} string ({letters[s-1]}), fret {f}", ""))
        else:
            ss = " AND ".join(f"{ORD[s]}" for s, _ in locs)
            steps.append((g, locs, f"Finger {g} flat: {ss} string, fret {locs[0][1]}", "a light partial barre — only those two strings need pressure"))
    opens = [6 - i for i, f in enumerate(frets) if f == 0]
    muted = [6 - i for i, f in enumerate(frets) if f == "x"]
    play = strings_list(frets)
    f1 = min(f for s, f in by[1]); f4 = by[4][0][1]
    spr = {g: dot_sprite(25, FCOL[g], g) for g in FCOL}
    T = [("intro", 2.5)] + [("step", 3.2)] * len(steps) + [("stretch", 3.5), ("tip", 4.0), ("hold", 3.5)]
    total = sum(t for _, t in T)
    enc = Enc(path); placed = []
    pos = lambda s, f: (nk.fx(f), SY(s))
    shape_txt = " · ".join("×" if f == "x" else str(f) for f in frets)
    fing_txt = " · ".join(str(g) if g else ("○" if f == 0 else "×") for f, g in zip(frets, fingers))
    t0 = 0; dots = {}; posters = {}
    for kind, dur in T:
        idx = sum(1 for k, _ in T[:T.index((kind, dur))] if k == "step") if kind == "step" else None
        nframes = int(dur * FPS)
        if kind == "step": step = steps[len([1 for x in placed])]; placed.append(step)
        for fi in range(nframes):
            t = fi / FPS
            img = Image.new("RGBA", (W, H), BG + (255,)); d = ImageDraw.Draw(img)
            header(d, title, sub, mode)
            glow = {}
            if kind == "step":
                for s, _ in step[1]: glow[s] = max(0, 1 - abs(t - 0.7) / 0.9) * 0.9
            nk.draw(img, glow); nk.marks(img, frets); d = ImageDraw.Draw(img)
            # barre bar (from data)
            if ch["barre"] and any(p[0] == 1 for p in placed):
                b = ch["barre"]; x = nk.fx(b["fret"]); col = FCOL[1]
                d.rounded_rectangle([x - 13, SY(b["to"]) - 13, x + 13, SY(b["from"]) + 13], 13, fill=tuple(int(c * 0.6) for c in col))
            for p in placed[:-1] if kind == "step" else placed:
                for s, f in p[1]: paste_c(img, spr[p[0]], *pos(s, f))
            if kind == "step":
                e = ease(t / 0.7)
                for s, f in step[1]:
                    x, y = pos(s, f); paste_c(img, spr[step[0]], x, -40 + (y + 40) * e)
                    if t > 0.7:
                        r = 25 + (t - 0.7) * 30; a = max(0, 1 - (t - 0.7) / 0.9)
                        if a > 0: d.ellipse([x - r, y - r, x + r, y + r], outline=tuple(int(c * a) for c in YEL), width=4)
                caption(d, step[2], step[3] or f"press just behind the fret wire, on the fingertip", FCOL[step[0]])
            elif kind == "intro":
                caption(d, f"Play strings {play[0]}–{play[-1]}" + (f" · {', '.join(map(str, muted))} = × don't play" if muted else ""),
                        ("○ = open string, no finger" if opens else "fingers go on one at a time: 1, 2, 3, 4"))
            elif kind == "stretch":
                xa, xb = nk.mid(f1), nk.mid(f4); y = NY0 - 22; a = 0.5 + 0.5 * math.sin(t * 5)
                col = tuple(int(YEL[i] * (0.6 + 0.4 * a)) for i in range(3))
                d.line([xa, y, xb, y], fill=col, width=6)
                for x in (xa, xb): d.line([x, y - 14, x, y + 14], fill=col, width=6)
                text(d, ((xa + xb) / 2, y - 8), f"stretch {f4 - f1} frets", 26, col, "mb")
                caption(d, f"The stretch: finger 1 fret {f1} → finger 4 fret {f4}", "spread from the knuckles — don't skip the pinky note (the 9th)")
            elif kind == "tip":
                # labelled hand-shape callouts on the anchor and reach fingers
                s1, _ = by[1][0]; x1, y1 = pos(s1, by[1][0][1]); s4, _ = by[4][0]; x4, y4 = pos(s4, f4)
                for (x, y, lab) in ((x1, y1, "anchor"), (x4, y4, "reach: pinky on its tip")):
                    ty = NY1 + 4 if y > (NY0 + NY1) / 2 else NY0 - 4
                d.rounded_rectangle([NX0 + 10, NY0 - 50, NX0 + 10 + d.textlength("Thumb LOW behind the neck", font=F(26)) + 20, NY0 - 12], 8, fill=(40, 44, 58))
                text(d, (NX0 + 20, NY0 - 31), "Thumb LOW behind the neck", 26, YEL, "lm")
                tip2 = "roll finger 1 slightly onto its side" if ch["barre"] else (f"tip of finger 1 touches the {ORD[muted[0]]} string to mute it" if 6 in muted else "elbow in, wrist forward, fingertips arched")
                caption(d, "Hand shape: thumb low · elbow in · arched", tip2)
            elif kind == "hold":
                caption(d, f"{ch['short']}:  {shape_txt}", f"fingers  {fing_txt}   (6th → 1st string)")
            for p in (placed if kind != "step" else placed):
                pass
            enc.add(img)
            if kind == "hold" and fi == 0: posters["hold"] = img.copy()
            if kind == "stretch" and fi == int(1.2 * FPS): posters["stretch"] = img.copy()
        t0 += dur
    enc.close()
    posters["hold"].convert("RGB").save(path[:-4] + ".jpg", quality=80)
    posters["stretch"].convert("RGB").save(path[:-4] + "-stretch.jpg", quality=80)
    dotpos = [{"finger": g, "string": s, "fret": f} for g, locs, *_ in steps for s, f in locs]
    return {"file": os.path.basename(path), "poster": os.path.basename(path)[:-4] + ".jpg", "kind": "left", "mode": mode, "chord": ch["libId"], "short": ch["short"],
            "seconds": round(enc.n / FPS, 1), "dots": dotpos, "frets": frets, "fingers": fingers}

DEG = ["R", "5", "9", "5", "3", "5", "9", "5"]
def click_wav(path, bpm, beats, lead):
    sr = 22050; n = int(sr * (lead + beats * 60 / bpm + 1)); buf = [0.0] * n
    for b in range(beats):
        st = int(sr * (lead + b * 60 / bpm)); f = 1500 if b % 4 == 0 else 1000; amp = 0.22 if b % 4 == 0 else 0.13
        for k in range(int(sr * 0.03)):
            if st + k < n: buf[st + k] += amp * math.sin(2 * math.pi * f * k / sr) * math.exp(-k / (sr * 0.006))
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(b"".join(struct.pack("<h", int(max(-1, min(1, v)) * 32767)) for v in buf))

def right_video(data, mode, path):
    riff = data["riff"]; ch = next(c for c in data["chords"] if c["libId"] == data["introChord"]); letters = data["letters"]
    assert len(riff) == 8 and all(r["f"] == ch["frets"][6 - r["s"]] for r in riff), "riff notes must be in the chord grip"
    nk = Neck(ch["frets"], letters, NX0, 760, 5)
    bpm, bars, lead = 60, 4, 4.0
    wav = path[:-4] + ".wav"; click_wav(wav, bpm, bars * 4, lead)
    enc = Enc(path, wav); total = lead + bars * 4 * 60 / bpm + 1.5
    rh_strings = {}
    for r in riff: rh_strings.setdefault(r["rh"], set()).add(r["s"])
    names = {"p": "thumb (p)", "i": "index (i)", "m": "middle (m)"}
    assign = " · ".join(f"{names[k]}: string {' & '.join(map(str, sorted(v, reverse=True)))}" for k, v in rh_strings.items())
    spr = {g: dot_sprite(20, FCOL[g], g) for g in FCOL}; rspr = {k: dot_sprite(30, c, k) for k, c in RHCOL.items()}
    title = f"Right-hand pattern on {ch['short']}" + ("" if mode != "shapes" else f" (guitar {ch['gshort']} grip)")
    sub = "RIGHT HAND · steady eighths · let it ring · 60 bpm"
    PX = 1010; poster = None
    for fi in range(int(total * FPS)):
        t = fi / FPS; tb = t - lead; e8 = int(tb / 0.5) if tb >= 0 else -1; i8 = e8 % 8 if 0 <= e8 < bars * 8 else -1
        ph = (tb % 0.5) / 0.5 if tb >= 0 else 0
        img = Image.new("RGBA", (W, H), BG + (255,)); d = ImageDraw.Draw(img); header(d, title, sub, mode)
        glow = {riff[i8]["s"]: max(0, 1 - ph * 1.3)} if i8 >= 0 else {}
        nk.draw(img, glow, extend=W - 50 - 760); nk.marks(img, ch["frets"]); d = ImageDraw.Draw(img)
        d.ellipse([PX - 150, (NY0 + NY1) / 2 - 150, PX + 150, (NY0 + NY1) / 2 + 150], outline=(30, 20, 14), width=0)
        text(d, (PX, NY0 - 18), "pick / pluck here", 22, GREY, "mm", bold=False)
        for i, (f, g) in enumerate(zip(ch["frets"], ch["fingers"])):
            if g: paste_c(img, spr[g], nk.fx(f), SY(6 - i))
        # resting positions of the right-hand fingers, active one moves to its string
        lane = {"p": -80, "i": 0, "m": 80, "a": 160}
        home = {}
        for rr in riff: home.setdefault(rr["rh"], rr["s"])
        act = riff[i8] if i8 >= 0 else None
        for k, hs in home.items():
            if act and k == act["rh"]: continue
            paste_c(img, rspr[k], PX + lane[k], SY(hs), 0.4)
        if act:
            ys = SY(act["s"]); x = PX + lane[act["rh"]] + 10 * math.sin(min(1, ph * 3) * math.pi)
            paste_c(img, rspr[act["rh"]], x, ys)
            text(d, (PX + 175, ys), "↓" if i8 % 2 == 0 else "↑", 44, WHITE, "mm")
        d.rectangle([0, 556, W, H], fill=(0, 0, 0))
        if tb < 0:
            text(d, (W / 2, 598), "Pattern: root – 5 – 9 – 5 – 3 – 5 – 9 – 5", 42, WHITE, "mm")
            text(d, (W / 2, 646), assign, 30, YEL, "mm", bold=False)
            cnt = 4 - int(t); text(d, (W / 2, 690), f"with a pick instead: ↓ down, ↑ up, alternating  ·  starts in {max(1, cnt)}", 26, GREY, "mm", bold=False)
        else:
            cw = 140; x0 = W / 2 - cw * 4 + cw / 2
            for k in range(8):
                x = x0 + k * cw; on = k == i8; r = riff[k]
                if on: d.rounded_rectangle([x - cw / 2 + 6, 562, x + cw / 2 - 6, 714], 12, fill=(48, 52, 66))
                text(d, (x, 598), ["1", "&", "2", "&", "3", "&", "4", "&"][k], 48 if on else 40, YEL if on else (170, 170, 170), "mm")
                text(d, (x, 644), DEG[k] + f" · s{r['s']}", 28, WHITE if on else GREY, "mm")
                text(d, (x, 688), f"{r['rh']} {'↓' if k % 2 == 0 else '↑'}", 30, RHCOL[r["rh"]] if on else GREY, "mm")
            if tb > bars * 4: text(d, (PX, NY1 + 26), "Loop it: four clean passes, then 80 bpm", 30, YEL, "mm")
            else: text(d, (PX, NY1 + 26), f"bar {int(tb // 4) + 1} of {bars}", 26, GREY, "mm", bold=False)
        enc.add(img)
        if tb >= 0 and e8 == 4 and poster is None and ph > 0.05: poster = img.copy()
    enc.close(); os.remove(wav)
    poster.convert("RGB").save(path[:-4] + ".jpg", quality=80)
    return {"file": os.path.basename(path), "poster": os.path.basename(path)[:-4] + ".jpg", "kind": "right", "mode": mode, "chord": ch["libId"], "short": ch["short"],
            "seconds": round(enc.n / FPS, 1), "riff": riff}

def main():
    os.makedirs(OUT, exist_ok=True); man = []
    only = os.environ.get("ONLY")
    for mode in ("guitar", "key", "shapes"):
        data = json.loads(subprocess.check_output(["node", os.path.join(ROOT, "tools", "ebyt-media-data.mjs"), mode]))
        pre = {"guitar": "g", "key": "lk", "shapes": "ls"}[mode]
        for ch in data["chords"]:
            name = f"{pre}-{ch['id']}"
            if only and only not in name: continue
            man.append(left_video(ch, mode, data["letters"], os.path.join(OUT, name + ".mp4"))); print("ok", name, flush=True)
        name = f"{pre}-picking"
        if not only or only in name:
            man.append(right_video(data, mode, os.path.join(OUT, name + ".mp4"))); print("ok", name, flush=True)
    if not only:
        with open(os.path.join(OUT, "manifest.json"), "w") as f: json.dump(man, f, ensure_ascii=False, indent=1)
main()
