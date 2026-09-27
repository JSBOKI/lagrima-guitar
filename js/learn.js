// Every link/video below was fetched and checked (title + channel via YouTube oEmbed) on 27 Sep 2026.
const yt = (id) => "https://www.youtube.com/watch?v=" + id;
export const VIDEOS = [
  { id: "4y0IRxndBSg", title: "Lagrima Classical Guitar Lesson", by: "Classical Guitar Corner", why: "Thorough walk-through: fingering, guide fingers, voicing and phrasing." },
  { id: "CrjnGjtozgY", title: "Grade 4 Lesson: Lágrima, Preludio by Tárrega for Classical Guitar", by: "This is Classical Guitar (Bradford Werner)", why: "Melody first, then three ways to practise the tricky bars 5–7." },
  { id: "YZtAEF5JHEU", title: "Getting Started: Lagrima", by: "Classical Guitar Shed (Allen Mathews)", why: "Friendly first steps for adult learners." },
  { id: "wI6t829uDfo", title: "Francisco Tárrega’s “Lágrima” performed by Pepe Romero on an 1888 Antonio de Torres (ex F. Tárrega)", by: "Guitar Salon International", why: "A master plays it on Tárrega’s own guitar – listen for the singing melody." },
];
export const GROUPS = [
  { title: "More Lágrima lessons", items: [
    { url: yt("AzLfxG1YAl4"), title: "Why Lágrima is not a “beginner” piece", by: "Classical Guitar Corner · YouTube", why: "Voicing and expression – how to make it music, not just notes." },
    { url: "https://www.classicalguitarcorner.com/lagrima-study-guide/", title: "Lagrima Study Guide [Lesson + Download]", by: "Classical Guitar Corner · article + video", why: "Bar-by-bar notes on dynamics, syncopation (bars 7, 11), rest stroke on the D in bar 14." },
    { url: "https://www.classicalguitarcorner.com/lagrima-by-francisco-tarrega-classical-guitar-lesson/", title: "Lágrima Classical Guitar Lesson (page)", by: "Classical Guitar Corner", why: "Lesson page with the video and background on the piece." },
    { url: "https://www.thisisclassicalguitar.com/grade-4-lesson-lagrima-tarrega/", title: "Grade 4 Lesson: Lagrima by Tarrega", by: "This is Classical Guitar", why: "Written lesson notes that go with the video." },
    { url: yt("SF1PY3gOV1Y"), title: "LAGRIMA – Francisco Tarrega – Full Tutorial with TAB", by: "Robert Lunn · YouTube", why: "Slow, detailed left- and right-hand demonstration (explains guide fingers in bar 1)." },
    { url: "https://richterguitar.com/classical-guitar-sheet-music/tarrega-lagrima/", title: "Lágrima – free PDF + performance", by: "Jonathan Richter", why: "Another free fingered edition; explains the bar-9 slide." },
  ] },
  { title: "Performances to listen to", items: [
    { url: yt("cS_GCDAEdfI"), title: "LÁGRIMA – Original 19th Century Guitar", by: "Brandon Acker · YouTube", why: "Hear it on a period instrument, as in Tárrega’s time." },
    { url: yt("gBVXuh1W8n8"), title: "Irina Kulikova plays Lagrima on a 1958 Ignacio Fleta", by: "SiccasGuitars · YouTube", why: "Beautiful tone and rubato." },
    { url: yt("if9EEk3Dx1E"), title: "Lágrima – Grade 6 Repertoire for Classical Guitar", by: "Classical Guitar Corner · YouTube", why: "Clear, steady model performance." },
    { url: yt("5DmR9DG23R0"), title: "Unexpected Beauty: Playing “Lágrima” in the Wrong Key!", by: "Brandon Acker · YouTube", why: "Fun: major and minor sections swapped – great ear training once you know the piece." },
  ] },
  { title: "Posture & footstool", items: [
    { url: yt("dYC9awwT_YQ"), title: "Classical Guitar Position Lesson: How to Sit, Hold and Position a Classical Guitar", by: "This is Classical Guitar · YouTube", why: "Footstool, guitar angle, relaxed shoulders." },
    { url: "https://www.thisisclassicalguitar.com/basic-posture-and-sitting-position-guitar/", title: "Lesson: Sitting and Guitar Position for Classical Guitar", by: "This is Classical Guitar · article", why: "Step-by-step checklist with photos." },
    { url: yt("1e2ZWYyvcXs"), title: "Classical Guitar Lesson – Basic Posture", by: "Classical Guitar Corner · YouTube", why: "Short and clear." },
    { url: "https://www.classicalguitarcorner.com/footstool-vs-guitar-support/", title: "Footstool vs Guitar Support", by: "Classical Guitar Corner · article", why: "Pros/cons – supports can be kinder to your lower back." },
  ] },
  { title: "Left hand", items: [
    { url: "https://www.thisisclassicalguitar.com/left-hand-technique-and-position/", title: "Lesson: Left Hand Technique for Classical Guitar", by: "This is Classical Guitar · article + video", why: "Fingertips, curved fingers, knuckles parallel to the neck." },
    { url: "https://www.thisisclassicalguitar.com/lesson-left-hand-thumb-position/", title: "Left Hand Thumb Position While Playing Classical Guitar", by: "This is Classical Guitar · article + video", why: "Where the thumb goes and why it should stay relaxed." },
    { url: "https://www.thisisclassicalguitar.com/lesson-4th-finger-position-left-hand-alignment/", title: "Lesson: 4th Finger Position and Left Hand Alignment", by: "This is Classical Guitar · article + video", why: "Helpful for bars 1, 5 and 14 where finger 4 does a lot." },
  ] },
  { title: "Right hand: p i m a, free & rest stroke", items: [
    { url: "https://www.thisisclassicalguitar.com/lesson-rest-or-free-stroke/", title: "Lesson: Should Beginners Use Rest or Free Stroke?", by: "This is Classical Guitar · article + video", why: "When to use each stroke." },
    { url: "https://www.classicalguitarcorner.com/right-hand-arpeggios/", title: "Right Hand Arpeggios", by: "Classical Guitar Corner · article", why: "Default position p-4, i-3, m-2, a-1 and right-hand preparation." },
    { url: "https://www.classicalguitarcorner.com/l109-thumb-and-fingers-basic-arpeggios/", title: "Basic arpeggios for classical guitar", by: "Classical Guitar Corner · article", why: "Thumb + fingers exercises – ideal warm-up for Lágrima." },
    { url: "https://classicalguitarshed.com/rest-strokes/", title: "Why You Should Avoid Rest Strokes on Classical Guitar (for now)", by: "Classical Guitar Shed · article", why: "The case for mastering free stroke first – good advice for adult beginners." },
  ] },
  { title: "The score (public domain) & sources used in this app", items: [
    { url: "https://imslp.org/wiki/L%C3%A1grima_(T%C3%A1rrega,_Francisco)", title: "Lágrima – IMSLP page", by: "IMSLP", why: "Free scores incl. the Alier edition scan (#292928, public domain) used for this app’s fingering, and a manuscript copy (#200464)." },
    { url: "https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=2103", title: "Lágrima (guitar duo, public domain) – Mutopia Project", by: "Mutopia Project · J. J. Olson", why: "Typeset from the Alier edition; used to cross-check every note." },
  ] },
];

export function learnHTML() {
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const o = [];
  o.push(`<div class="card"><h3>Watch first</h3><p class="small muted">Tap a video to load it (saves data). Videos need an internet connection.</p>`);
  for (const v of VIDEOS) {
    o.push(`<div class="video"><button class="lite" data-yt="${v.id}" style="background-image:url(https://i.ytimg.com/vi/${v.id}/hqdefault.jpg)" aria-label="Play video: ${esc(v.title)}"><span>▶ Play</span></button></div>`);
    o.push(`<p><a href="${yt(v.id)}" target="_blank" rel="noopener"><b>${esc(v.title)}</b></a><br><span class="small muted">${esc(v.by)} – ${esc(v.why)}</span></p>`);
  }
  o.push("</div>");
  for (const g of GROUPS) {
    o.push(`<div class="card"><h3>${esc(g.title)}</h3><ul class="res">`);
    for (const it of g.items) o.push(`<li><a href="${it.url}" target="_blank" rel="noopener">${esc(it.title)}</a><span class="by">${esc(it.by)}</span><span class="why">${esc(it.why)}</span></li>`);
    o.push("</ul></div>");
  }
  o.push(`<div class="card small muted"><p>Accuracy notes: pitches were checked note-for-note against two independent sources (Mutopia edition from the Alier print, and the IMSLP MIDI #200467). Left-hand fingering follows the Alier edition where printed; <span class="sugg">s</span> marks suggested fingering. Right-hand fingering is suggested. Two spots are flagged in the app (bar 7 string marking, bar 12 slur direction).</p></div>`);
  return o.join("");
}

export function wireVideos(root) {
  root.addEventListener("click", (e) => {
    const b = e.target.closest("[data-yt]"); if (!b) return;
    const f = document.createElement("iframe");
    f.src = `https://www.youtube-nocookie.com/embed/${b.dataset.yt}?autoplay=1&playsinline=1&rel=0`;
    f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen"; f.allowFullscreen = true; f.title = "YouTube video";
    b.replaceWith(f);
  });
}
