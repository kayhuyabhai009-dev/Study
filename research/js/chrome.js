/* chrome.js — shared shell: inline SVG sprite, sidebar, topbar, footer, theme.
   The icon sprite is inlined here (not a separate file) so the site also works
   when opened via file://, where external SVG <use> is blocked by some browsers. */
const ICONS = {
  home: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/>',
  book: '<path d="M4 5a3 3 0 0 1 3-3h13v18H7a3 3 0 0 0-3 3Z"/><path d="M4 5v12"/>',
  layers: '<path d="M12 3 21 9l-9 6-9-6Z"/><path d="M3 14l9 6 9-6"/>',
  branch: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M6 8.5V18h9.5"/>',
  sigma: '<path d="M18 4H8l6 8-6 8h10"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  calc: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 7h8M8 11h2M12 11h2M16 11h2M8 15h2M12 15h2M16 15h2M8 19h2M12 19h2"/>',
  alert: '<path d="M12 3 22 20H2Z"/><path d="M12 10v4"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-3-5.4 3 1.1-6L3.2 9.4l6.1-.8Z"/>',
  check: '<path d="M4 12.5 9.5 18 20 6.5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M8 14h2M12 14h2M16 14h2"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="7.5" r="0.5" fill="currentColor"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/>',
  moon: '<path d="M20 13A8 8 0 0 1 11 4a8 8 0 1 0 9 9Z"/>',
  download: '<path d="M12 4v11M7 11l5 5 5-5M4 20h16"/>',
  upload: '<path d="M12 15V4M7 9l5-5 5 5M4 20h16"/>',
  flag: '<path d="M5 21V4"/><path d="M5 4h13l-2.5 4L18 12H5"/>',
  cap: '<path d="M12 4 22 10l-10 6L2 10Z"/><path d="M6 12v5c0 1.5 12 1.5 12 0v-5"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>'
};
function icon(name) {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
}
const NAV = [
  { section: "Platform" },
  { label: "Dashboard", href: "index.html", icon: "home" },
  { label: "Examinations", href: "exams.html", icon: "book" },
  { label: "PYQ Library", href: "library.html", icon: "layers" },
  { label: "Important", href: "important.html", icon: "flag" },
  { label: "Hierarchy", href: "hierarchy.html", icon: "branch" },
  { label: "Patterns", href: "patterns.html", icon: "branch" },
  { label: "Formulas", href: "formulas.html", icon: "sigma" },
  { label: "Compare Exams", href: "compare.html", icon: "grid" },
  { section: "Preparation" },
  { label: "Learn", href: "learn.html", icon: "cap" },
  { label: "Calculation Skills", href: "skills.html", icon: "calc" },
  { label: "Mistake Analytics", href: "mistakes.html", icon: "alert" },
  { label: "CIS Explorer", href: "cis.html", icon: "star" },
  { label: "Mastery Tracker", href: "tracker.html", icon: "check" },
  { label: "60-Day Challenge", href: "calendar.html", icon: "calendar" },
  { label: "Methodology", href: "methodology.html", icon: "info" },
];
function currentPage() {
  const p = location.pathname.split("/").pop() || "index.html";
  return p.split("?")[0];
}
/* ---- Embedded mode (गणित गुरु के अंदर iframe में) ----
   जब यह research platform मुख्य website के अंदर iframe में खुलती है तो
   अपनी sidebar/topbar/footer नहीं दिखाती — navigation मुख्य site के
   research section के sub-tabs से होता है। Theme भी मुख्य site से लीती है। */
function isEmbedded() {
  try { return window.self !== window.top; } catch (e) { return true; }
}
function setupEmbedded() {
  document.body.classList.add("gems-embedded");
  const st = document.createElement("style");
  st.textContent =
    "body.gems-embedded .sidebar{display:none!important}" +
    "body.gems-embedded .shell{display:block}" +
    "body.gems-embedded .topbar{display:none!important}" +
    "body.gems-embedded .content{padding:18px 14px 36px;max-width:none}" +
    "body.gems-embedded .site-footer{display:none}" +
    "body.gems-embedded .page-hero h1{font-size:30px}" +
    "@media (max-width:900px){body.gems-embedded .topbar{display:none!important}}";
  document.head.appendChild(st);
  try {
    const t = parent.document.documentElement.getAttribute("data-theme");
    if (t) document.documentElement.setAttribute("data-theme", t);
  } catch (e) { /* cross-origin fallback: अपना theme रखें */ }
  window.addEventListener("message", ev => {
    if (ev.data && ev.data.gemsTheme) document.documentElement.setAttribute("data-theme", ev.data.gemsTheme);
  });
  /* मुख्य site को बताएँ कौन-सा page खुला है (sub-tab highlight के लिए) */
  try { parent.postMessage({ gemsResearchPage: currentPage() }, "*"); } catch (e) {}
}
function injectChrome() {
  if (isEmbedded()) { setupEmbedded(); return; }
  const sprite = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    Object.entries(ICONS).map(([k, v]) =>
      '<symbol id="i-' + k + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + v + '</symbol>').join('') +
    '</defs></svg>';
  document.body.insertAdjacentHTML("afterbegin", sprite);
  const cur = currentPage();
  const navHtml = NAV.map(n => n.section
    ? '<div class="nav-label">' + n.section + '</div>'
    : '<a href="' + n.href + '" class="' + (n.href === cur ? 'active' : '') + '">' +
      '<svg viewBox="0 0 24 24"><use href="#i-' + n.icon + '"/></svg>' + n.label + '</a>').join('');
  const side = document.querySelector(".sidebar");
  if (side) side.innerHTML =
    '<div class="brand"><div class="brand-mark" style="background:var(--brand-grad)">Σ</div><div><div class="brand-name">Gov Exam Maths</div>' +
    '<div class="brand-sub">Research Platform</div></div></div>' +
    '<div class="pill-row" id="sidePills"></div>' +
    '<nav class="nav">' + navHtml + '</nav>' +
    '<div style="margin-top:24px;padding:10px;border-top:1px solid var(--border)">' +
    '<button id="themeBtn" style="background:none;border:1px solid var(--border);border-radius:8px;padding:7px 12px;color:var(--ink);width:100%">🌗 Toggle dark mode</button>' +
    '<p class="caption" style="margin-top:10px">Press <span class="kbd">Ctrl</span>+<span class="kbd">K</span> to jump anywhere.</p></div>';
  const top = document.querySelector(".topbar");
  if (top) top.innerHTML =
    '<button id="menuBtn" aria-label="Open menu">☰ Menu</button>' +
    '<div class="brand-name">Gov Exam Maths</div>' +
    '<button id="themeBtn2" aria-label="Toggle dark mode">🌗</button>';
  const foot = document.querySelector(".site-footer");
  if (foot) foot.innerHTML =
    '<p class="caption">Live corpus (Nov 2026 rebuild): 1,687 papers · 42,634 tagged records · ' +
    '35,704 certain records. Full question text + options render on paper pages only where ' +
    'extracted from that paper\u2019s own source PDF; anything not recovered is marked unavailable, ' +
    'never invented. Options marked (+) were generated from the key value, not from the paper. ' +
    'See <a href="methodology.html">Methodology</a>.</p>';
  const pills = document.getElementById("sidePills");
  if (pills) {
    const st = getStreak();
    pills.innerHTML = '<span class="pill pill-streak">🔥 Streak: ' + st.count + ' din</span>' +
      '<span class="pill pill-xp">⚡ ' + fmt(getXP()) + ' XP</span>';
  }
  const applyTheme = () => {
    const t = localStorage.getItem("gems-theme") ||
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", t);
  };
  applyTheme();
  const toggle = () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem("gems-theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };
  document.querySelectorAll("#themeBtn,#themeBtn2").forEach(b => b.addEventListener("click", toggle));
  const menuBtn = document.getElementById("menuBtn");
  if (menuBtn && side) menuBtn.addEventListener("click", () => side.classList.toggle("open"));
  document.addEventListener("click", e => {
    if (side && side.classList.contains("open") && !side.contains(e.target) && e.target !== menuBtn)
      side.classList.remove("open");
  });
}
document.addEventListener("DOMContentLoaded", injectChrome);
