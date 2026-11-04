/* data.js — loading, decoding, formatting, localStorage stores. */
const cache = {};
/* fetch न हो (file:// या परीक्षा-वातावरण) तो भी page crash न हो —
   नीचे showLoadError() बैनर दिखता है और unhandled rejection रोक दी जाती है। */
if (typeof window !== 'undefined' && window.addEventListener) {
  window.addEventListener('unhandledrejection', ev => {
    if (ev && typeof ev.preventDefault === 'function') ev.preventDefault();
  });
}
async function loadJSON(path) {
  if (cache[path]) return cache[path];
  let r;
  try {
    r = await fetch(path);
  } catch (e) {
    showLoadError();
    throw new Error("Could not load " + path + " (network blocked)");
  }
  if (!r.ok) {
    showLoadError();
    throw new Error("Could not load " + path + " (" + r.status + ")");
  }
  const j = await r.json();
  cache[path] = j;
  return j;
}
/* If data cannot load (most often: the site was opened via file://, where browsers
   block JSON fetch), say so plainly instead of leaving skeleton rows forever. */
function showLoadError() {
  if (document.getElementById("loadErrorBanner")) return;
  const div = document.createElement("div");
  div.id = "loadErrorBanner";
  div.style.cssText = "background:#F6E2DC;border-bottom:2px solid #B3402A;padding:12px 16px;font-size:14px;position:sticky;top:0;z-index:200";
  if (location.protocol === "file:") {
    div.innerHTML = "<strong>Data load nahi hua — file ko double-click se khola gaya hai.</strong> " +
      "Is site ka data JSON files se load hota hai, jo file:// par browsers block kar dete hain. " +
      "Server se chalao: <span class=\"mono\">cd website && python3 -m http.server 8000</span>, phir " +
      "<span class=\"mono\">http://localhost:8000</span> kholo. Wahan sab kuch chalega.";
  } else {
    div.innerHTML = "<strong>Data load nahi hua.</strong> Page reload karo; agar baar-baar fail ho to server check karo.";
  }
  document.body.prepend(div);
}
const fmt = n => (n == null ? "—" : Number(n).toLocaleString("en-IN"));
function getParams() { return new URLSearchParams(location.search); }
const pct = (a, b) => (b ? (100 * a / b).toFixed(1) + "%" : "—");
const EXAM_DISPLAY = { CGL: "CGL", CHSL: "CHSL", CPO: "CPO", MTS: "MTS", GD: "GD Constable",
  SP: "Selection Post", HC: "Delhi Police HC", DPC: "Delhi Police Constable", NTPC: "NTPC",
  GroupD: "Group D", ALP: "ALP", Technician: "Technician", "RPF-Constable": "RPF Constable",
  "RPF-SI": "RPF SI", JE: "JE", "MI-NonTranslator": "MI Non-Translator",
  "MI-Translator": "MI Translator", Paramedical: "Paramedical" };
const FAMILY = { CGL: "SSC", CHSL: "SSC", CPO: "SSC", MTS: "SSC", GD: "SSC", SP: "SSC",
  HC: "SSC", DPC: "SSC", NTPC: "Railway", GroupD: "Railway", ALP: "Railway",
  Technician: "Railway", "RPF-Constable": "Railway", "RPF-SI": "Railway", JE: "Railway",
  "MI-NonTranslator": "Railway", "MI-Translator": "Railway", Paramedical: "Railway" };
let TOPIC_NAMES = [];
async function siteIndex() {
  const idx = await loadJSON("data/index.json");
  TOPIC_NAMES = idx.topic_ids;
  return idx;
}
function decodePaper(row) {
  return { id: row.i, exam: row.e, examDisplay: EXAM_DISPLAY[row.e] || row.e,
    family: FAMILY[row.e] || "", date: row.d,
    year: row.d === "unknown" ? "unknown" : row.d.slice(0, 4),
    shift: row.s, stage: row.t, type: row.y, total: row.n, certain: row.c,
    easy: row.df[0], medium: row.df[1], hard: row.df[2], keyPresent: row.k,
    topics: (row.tp || []).map(([tid, c]) => ({ name: TOPIC_NAMES[tid] || ("Topic " + tid), count: c })) };
}
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
/* ---- localStorage stores (progress lives in the browser only) ---- */
function storeGet(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; }
  catch (e) { return fallback; }
}
function storeSet(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
function getMarks() { return storeGet("gems-marks-v1", {}); }
function toggleMark(paperId, qn, mark) {
  const m = getMarks();
  m[paperId] = m[paperId] || {};
  m[paperId][qn] = m[paperId][qn] || [];
  const arr = m[paperId][qn];
  const i = arr.indexOf(mark);
  if (i >= 0) arr.splice(i, 1); else arr.push(mark);
  if (!arr.length) delete m[paperId][qn];
  storeSet("gems-marks-v1", m);
  return m;
}
function countMarks() {
  const m = getMarks();
  let n = 0;
  Object.values(m).forEach(qs => Object.values(qs).forEach(a => n += a.length));
  return n;
}
function getMastery() { return storeGet("gems-mastery-v1", {}); }
function getDays() { return storeGet("gems-days-v1", {}); }
/* v3.0 gamified progress: XP + daily streak, stored in the browser only. */
function getXP() { return storeGet("gems-xp-v1", 0) || 0; }
function addXP(n) {
  const v = getXP() + n;
  storeSet("gems-xp-v1", v);
  return v;
}
function getStreak() { return storeGet("gems-streak-v1", { count: 0, last: "" }); }
function todayKey() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function touchStreak() {
  const s = getStreak();
  const t = todayKey();
  if (s.last === t) return s;
  const y = new Date(Date.now() - 86400000);
  const yk = y.getFullYear() + "-" + String(y.getMonth() + 1).padStart(2, "0") + "-" + String(y.getDate()).padStart(2, "0");
  s.count = (s.last === yk) ? s.count + 1 : 1;
  s.last = t;
  storeSet("gems-streak-v1", s);
  return s;
}
function getChallengeDays() {
  const c = storeGet("gems-challenge-v1", null);
  if (c) return c;
  const old = getDays();
  const seeded = {};
  Object.keys(old).forEach(k => { if (Number(k) >= 1 && Number(k) <= 30) seeded[k] = old[k]; });
  return seeded;
}
function setChallengeDay(day, done) {
  const c = getChallengeDays();
  c[day] = !!done;
  storeSet("gems-challenge-v1", c);
  return c;
}
function countSolvedMarks() {
  const m = getMarks();
  let n = 0;
  Object.values(m).forEach(qs => Object.values(qs).forEach(a => { if (a.includes("solved")) n += 1; }));
  return n;
}
function exportProgress() {
  const blob = new Blob([JSON.stringify({ marks: getMarks(), mastery: getMastery(), days: getDays(),
    challengeDays: getChallengeDays(), xp: getXP(), streak: getStreak() }, null, 1)],
    { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "gov-exam-maths-progress.json";
  a.click();
  URL.revokeObjectURL(a.href);
}
function importProgressFile(file, done) {
  const rd = new FileReader();
  rd.onload = () => {
    try {
      const j = JSON.parse(rd.result);
      if (j.marks) storeSet("gems-marks-v1", j.marks);
      if (j.mastery) storeSet("gems-mastery-v1", j.mastery);
      if (j.days) storeSet("gems-days-v1", j.days);
      if (j.challengeDays) storeSet("gems-challenge-v1", j.challengeDays);
      if (j.xp != null) storeSet("gems-xp-v1", j.xp);
      if (j.streak) storeSet("gems-streak-v1", j.streak);
      done(true);
    } catch (e) { done(false); }
  };
  rd.readAsText(file);
}
