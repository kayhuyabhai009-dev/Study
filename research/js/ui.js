/* ui.js — counters, reveal-on-scroll, tabs, command palette. */
function animateCounters(root) {
  (root || document).querySelectorAll("[data-count]").forEach(el => {
    const target = Number(el.dataset.count);
    if (!target) return;
    const t0 = performance.now(), dur = 900;
    (function tick(t) {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  });
}
function initReveal() {
  const reduce = typeof matchMedia === 'function' && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (typeof IntersectionObserver === 'undefined' || reduce) {
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.1 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
}
function initTabs(root) {
  (root || document).querySelectorAll("[data-tabs]").forEach(group => {
    const btns = group.querySelectorAll("[data-tab-btn]");
    const panes = group.querySelectorAll("[data-tab-pane]");
    btns.forEach(b => b.addEventListener("click", () => {
      btns.forEach(x => x.classList.toggle("on", x === b));
      panes.forEach(p => p.style.display = (p.dataset.tabPane === b.dataset.tabBtn) ? "" : "none");
    }));
  });
}
/* Command palette: Ctrl/Cmd+K jumps to pages, topics, exams, papers by id. */
let paletteData = null;
async function openPalette() {
  const box = document.getElementById("palette");
  if (!box) return;
  box.classList.add("open");
  const input = box.querySelector("input");
  input.value = "";
  input.focus();
  if (!paletteData) {
    try {
      const [idx, topics, exams] = await Promise.all([
        siteIndex(), loadJSON("data/topics.json"), loadJSON("data/exams.json")]);
      paletteData = [
        ...["Dashboard", "Examinations", "PYQ Library", "Hierarchy", "Patterns", "Formulas",
            "Compare Exams", "Calculation Skills", "Mistake Analytics", "CIS Explorer",
            "Mastery Tracker", "90-Day Challenge", "Methodology"].map((label, i) =>
          ({ label, href: ["index.html", "exams.html", "library.html", "hierarchy.html",
            "patterns.html", "formulas.html", "compare.html", "skills.html", "mistakes.html",
            "cis.html", "tracker.html", "calendar.html", "methodology.html"][i] })),
        ...topics.map(t => ({ label: "Topic: " + t.name, href: "hierarchy.html?topic=" + encodeURIComponent(t.name) })),
        ...exams.map(e => ({ label: "Exam: " + e.display, href: "exam.html?e=" + encodeURIComponent(e.code) })),
      ];
    } catch (e) { paletteData = []; }
  }
  renderPalette("");
  input.oninput = () => renderPalette(input.value.trim().toLowerCase());
}
function renderPalette(q) {
  const res = document.getElementById("paletteResults");
  if (!res) return;
  const hits = (paletteData || []).filter(x => !q || x.label.toLowerCase().includes(q)).slice(0, 12);
  res.innerHTML = hits.length ? hits.map(h => '<a href="' + h.href + '">' + esc(h.label) + '</a>').join("")
    : '<p class="muted" style="padding:14px 18px">No matches. Try a topic, exam or page name.</p>';
}
function initPalette() {
  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openPalette(); }
    if (e.key === "Escape") {
      const box = document.getElementById("palette");
      if (box) box.classList.remove("open");
    }
  });
  const box = document.getElementById("palette");
  if (box) box.addEventListener("click", e => { if (e.target === box) box.classList.remove("open"); });
}
document.addEventListener("DOMContentLoaded", () => {
  animateCounters();
  initReveal();
  initTabs();
  initPalette();
  const slash = document.querySelector("[data-global-search]");
  if (slash) document.addEventListener("keydown", e => {
    if (e.key === "/" && document.activeElement.tagName !== "INPUT") { e.preventDefault(); slash.focus(); }
  });
});
