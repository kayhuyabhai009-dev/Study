/* tracker.js — mastery tracker + 30-day calendar (localStorage). */
const PRIORITY = [
  { label: "Number System", topics: ["Number System"], tier: "A" },
  { label: "HCF-LCM", topics: ["HCF-LCM"], tier: "A" },
  { label: "Simplification", topics: ["Simplification"], tier: "A" },
  { label: "Percentage", topics: ["Percentage"], tier: "A" },
  { label: "Ratio-Proportion", topics: ["Ratio-Proportion"], tier: "A" },
  { label: "Algebra", topics: ["Algebra"], tier: "A" },
  { label: "Average", topics: ["Average"], tier: "A" },
  { label: "Profit-Loss", topics: ["Profit-Loss"], tier: "A" },
  { label: "Discount", topics: ["Discount"], tier: "A" },
  { label: "Simple Interest", topics: ["Simple Interest"], tier: "A" },
  { label: "Compound Interest", topics: ["Compound Interest"], tier: "A" },
  { label: "Time-Speed-Distance", topics: ["Time-Speed-Distance"], tier: "A" },
  { label: "Trains + Boats-Streams", topics: ["Trains", "Boats-Streams"], tier: "B / C" },
  { label: "Time-Work", topics: ["Time-Work"], tier: "A" },
  { label: "Pipes-Cisterns", topics: ["Pipes-Cisterns"], tier: "B" },
  { label: "Ages", topics: ["Ages"], tier: "B" },
  { label: "Mixture-Alligation", topics: ["Mixture-Alligation"], tier: "C" },
  { label: "Geometry", topics: ["Geometry"], tier: "A" },
  { label: "Circles-Polygons", topics: ["Circles-Polygons"], tier: "A" },
  { label: "Mensuration 2D", topics: ["Mensuration 2D"], tier: "A" },
  { label: "Mensuration 3D", topics: ["Mensuration 3D"], tier: "A" },
  { label: "Trigonometry", topics: ["Trigonometry"], tier: "A (SSC) / B (Railway)" },
  { label: "Coordinate Geometry", topics: ["Coordinate Geometry"], tier: "C" },
  { label: "Data Interpretation", topics: ["Data Interpretation"], tier: "A (SSC)" },
  { label: "Elementary Statistics", topics: ["Elementary Statistics"], tier: "B" },
  { label: "Sequences and Series", topics: ["Sequences and Series"], tier: "C" },
  { label: "Set Theory / Probability / P&C", topics: ["Set Theory", "Probability", "Permutation and Combination"], tier: "D" },
];
const LEVELS = ["Not started", "L1 Recall", "L2 Single-step", "L3 Multi-step", "L4 Mixed/timed", "L5 Error-proof"];
async function initTracker() {
  const wrap = document.getElementById("trackerTable");
  if (!wrap) return;
  const cis = await loadJSON("data/cis.json");
  const ranks = Object.keys(cis.scores);
  const mastery = getMastery();
  const rows = PRIORITY.map((row, i) => {
    const primary = row.topics[0];
    const rank = ranks.indexOf(primary) + 1;
    const cur = mastery[row.label] == null ? 0 : mastery[row.label];
    return '<tr><td class="n">' + (i + 1) + '</td><td><strong>' + esc(row.label) + '</strong></td>' +
      '<td><span class="badge badge-tier">Tier ' + esc(row.tier) + '</span></td>' +
      '<td class="n">' + (rank ? "#" + rank + ' · ' + cis.scores[primary].toFixed(3) : "—") + '</td>' +
      '<td><select data-topic="' + esc(row.label) + '">' +
      LEVELS.map((l, v) => '<option value="' + v + '"' + (cur === v ? ' selected' : '') + '>' + l + '</option>').join("") +
      '</select></td></tr>';
  }).join("");
  wrap.innerHTML = '<table><thead><tr><th class="n">#</th><th>Priority topic</th><th>Tier</th><th class="n">CIS</th><th>Your level</th></tr></thead><tbody>' + rows + '</tbody></table>';
  wrap.querySelectorAll("select").forEach(sel => sel.addEventListener("change", () => {
    const m = getMastery();
    m[sel.dataset.topic] = Number(sel.value);
    storeSet("gems-mastery-v1", m);
    renderTrackerSummary();
  }));
  renderTrackerSummary();
}
function renderTrackerSummary() {
  const el = document.getElementById("trackerSummary");
  if (!el) return;
  const m = getMastery();
  const vals = PRIORITY.map(r => m[r.label] || 0);
  const l3 = vals.filter(v => v >= 3).length;
  const avg = vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : "0.0";
  const days = Object.values(getChallengeDays()).filter(Boolean).length;
  el.innerHTML = '<div class="grid grid-4">' +
    '<div class="card"><div class="stat-num">' + l3 + ' / ' + PRIORITY.length + '</div><div class="stat-label">Topics at L3 or above</div></div>' +
    '<div class="card"><div class="stat-num">' + avg + '</div><div class="stat-label">Average mastery level</div></div>' +
    '<div class="card"><div class="stat-num">' + days + ' / 60</div><div class="stat-label">Challenge days done</div></div>' +
    '<div class="card"><div class="stat-num">' + countMarks() + '</div><div class="stat-label">Library marks saved</div></div></div>';
}
/* v3.1 60-day challenge: days 1–30 fold in the original 30-day calendar;
   31–60 are revision passes, mocks and weak-topic repair. Progress (days,
   XP, streak) lives in the browser only. Milestones at 15/30/40/48/56/60. */
function shortTopic(t) {
  return t.replace(" (dobara)", "").replace("Mixed mock — ", "Mock ").replace("Mixed (sab topics)", "Mixed");
}
async function initCalendar() {
  const wrap = document.getElementById("calendarWrap");
  if (!wrap) return;
  const cal = await loadJSON("data/challenge.json");
  const render = () => {
    const done = getChallengeDays();
    const doneN = Object.values(done).filter(Boolean).length;
    const cur = cal.days.find(d => !done[d.day]) || cal.days[cal.days.length - 1];
    const st = getStreak();
    const prog = document.getElementById("calProgress");
    if (prog) prog.innerHTML =
      '<div class="grid grid-4">' +
      '<div class="card"><div class="stat-num">Day ' + cur.day + '</div><div class="stat-label">Current day · Goal: 60 din, poora syllabus</div></div>' +
      '<div class="card"><div class="stat-num">⚡ ' + fmt(getXP()) + '</div><div class="stat-label">XP earned</div></div>' +
      '<div class="card"><div class="stat-num">' + countSolvedMarks() + '</div><div class="stat-label">Questions marked solved</div></div>' +
      '<div class="card"><div class="stat-num">🔥 ' + st.count + '</div><div class="stat-label">Streak (din)</div></div></div>' +
      '<div style="margin-top:14px"><div class="bar-track"><div class="bar-fill" style="width:' + (100 * doneN / 60) + '%"></div></div>' +
      '<p class="small">' + doneN + ' / 60 days done · ' + (60 - doneN) + ' baaki</p></div>';
    const topicLink = cur.topic.replace(" (dobara)", "");
    const libHref = (cur.phase === "Mocks" || cur.phase === "Final repair")
      ? "library.html" : "library.html?topic=" + encodeURIComponent(topicLink);
    let h = '<h2>🎯 Aaj ka checklist — Day ' + cur.day + '</h2>' +
      '<div class="card"><p><strong>' + esc(cur.topic) + '</strong> · ' + esc(cur.phase) + ' · ' + esc(cur.target) + '</p>' +
      '<p>Task: ' + esc(cur.task) + ' · Drill: ' + esc(cur.drill) + '</p>' +
      '<p class="small muted">Traps: ' + esc(cur.traps) + '</p>' +
      '<p><a href="' + libHref + '">Practice PYQs →</a> · ' +
      '<a href="tracker.html">Mastery tracker →</a></p></div>';
    for (let w = 0; w < 13; w++) {
      const ds = cal.days.slice(w * 7, w * 7 + 7);
      if (!ds.length) break;
      h += '<h3 style="margin-top:28px">Week ' + (w + 1) + ' — Day ' + ds[0].day + '–' + ds[ds.length - 1].day + '</h3>' +
        '<div class="day-grid">' + ds.map(d => {
          const ms = cal.milestones[d.day];
          return '<div class="day-cell' + (done[d.day] ? ' done' : '') +
            (d.day === cur.day ? ' today' : '') + (ms ? ' milestone' : '') +
            '" data-day="' + d.day + '" title="' + esc(d.topic) + (ms ? ' · 🏆 ' + esc(ms) : '') + '">' +
            '<div class="dnum">' + d.day + (done[d.day] ? ' ✓' : '') + '</div>' +
            '<div class="small">' + esc(shortTopic(d.topic)) + '</div>' +
            (ms ? '<div class="small">🏆</div>' : '') + '</div>';
        }).join("") + '</div>';
    }
    wrap.innerHTML = h;
    wrap.querySelectorAll(".day-cell").forEach(cell => cell.addEventListener("click", () => {
      const day = Number(cell.dataset.day);
      const now = !getChallengeDays()[day];
      setChallengeDay(day, now);
      render();
      renderTrackerSummary();
    }));
  };
  render();
  const note = document.getElementById("calNotes");
  if (note) note.innerHTML = '<div class="callout">' + esc(cal.order_note) + '</div>' +
    '<h3>Milestones</h3><ul>' +
    Object.entries(cal.milestones).map(([d, m]) => '<li><strong>Day ' + d + ':</strong> ' + esc(m) + '</li>').join("") + '</ul>' +
    '<h3>Exam-family variants (swap rules, not a second calendar)</h3>' +
    '<ul><li><strong>SSC (CGL/CHSL/CPO):</strong> move Trigonometry (Day 24) to right after Day 8 (Algebra), and Data Interpretation (Day 26) to right after Day 9 (Average); move Trains/Boats and Pipes to the Day 27–28 tail.</li>' +
    '<li><strong>Railway (NTPC/Group D/ALP/Technician):</strong> keep base order; for NTPC, move P&amp;C before Sequences; de-prioritise Trigonometry and Coordinate Geometry to the tail.</li>' +
    '<li><strong>GD/MTS/RPF:</strong> move Profit-Loss and Average to the top of the commercial block; move Trigonometry, DI and Coordinate Geometry to the tail.</li></ul>';
}
function initProgressButtons() {
  document.querySelectorAll("[data-export-progress]").forEach(b => b.addEventListener("click", exportProgress));
  document.querySelectorAll("[data-import-progress]").forEach(inp => inp.addEventListener("change", () => {
    if (inp.files[0]) importProgressFile(inp.files[0], ok => {
      alert(ok ? "Progress imported. Reloading." : "Could not read that file.");
      if (ok) location.reload();
    });
  }));
}
document.addEventListener("DOMContentLoaded", () => { initTracker(); initCalendar(); initProgressButtons(); });
