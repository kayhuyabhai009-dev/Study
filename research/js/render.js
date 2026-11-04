/* render.js — page renderers for the data-driven pages. */
function baseNote(text) {
  return '<p class="caption" style="margin-top:10px">' + esc(text) + '</p>';
}
function emptyState(title, why, next) {
  return '<div class="empty"><strong>' + esc(title) + '</strong><p>' + esc(why) + '</p><p>' + next + '</p></div>';
}
const TIER_MAP = { "Percentage": "A", "Ratio-Proportion": "A", "Simplification": "A", "Average": "A",
  "Profit-Loss": "A", "Number System": "A", "Algebra": "A", "Mensuration 3D": "A", "Time-Work": "A",
  "Time-Speed-Distance": "A", "Discount": "A", "Simple Interest": "A", "Data Interpretation": "A (SSC)",
  "HCF-LCM": "A", "Mensuration 2D": "A", "Geometry": "A", "Trigonometry": "A (SSC) / B (Railway)",
  "Compound Interest": "A", "Circles-Polygons": "A", "Ages": "B", "Elementary Statistics": "B",
  "Trains": "B", "Pipes-Cisterns": "B", "Sequences and Series": "C", "Mixture-Alligation": "C",
  "Boats-Streams": "C", "Coordinate Geometry": "C", "Set Theory": "D",
  "Permutation and Combination": "D", "Probability": "D", "Mixed / Composite": "artifact" };

async function renderHome() {
  const el = document.getElementById("homeWrap");
  if (!el) return;
  const [idx, agg, cis, lib] = await Promise.all([
    siteIndex(), loadJSON("data/aggregates.json"), loadJSON("data/cis.json"),
    loadJSON("data/papers_index.json")]);
  const t = agg.topics;
  const top10 = Object.entries(t).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const cisTop = Object.entries(cis.scores).slice(0, 10);
  const years = Object.entries(agg.held_year).sort();
  const ySum = years.reduce((s, [, v]) => s + v, 0);
  const daysDone = Object.values(getChallengeDays()).filter(Boolean).length;
  const mastery = getMastery();
  const l3 = Object.values(mastery).filter(v => v >= 3).length;
  const livePapers = lib.length;
  const liveTagged = lib.reduce((s, r) => s + r.n, 0);
  const liveCertain = lib.reduce((s, r) => s + r.c, 0);
  el.innerHTML =
    '<div class="hero-band reveal in"><p class="eyebrow">SSC + Railway · Mathematics PYQ Research</p>' +
    '<h1>Every question counted. Every topic weighed.</h1>' +
    '<p>' + fmt(liveTagged) + ' tagged questions from ' + fmt(livePapers) + ' papers across 19 named SSC and Railway examinations, ' +
    'classified into 35 topics, 154 sub-topics and 295 concepts — with honest limits: full question text + options ' +
    'render on paper pages only where extracted from that paper\u2019s own source PDF, and anything the data does not contain ' +
    'is marked unavailable, never invented.</p>' +
    '<div class="hero-counters">' +
    '<div><div class="stat-num" data-count="19">0</div><div class="stat-label">Named exams (18 record codes — see Methodology)</div></div>' +
    '<div><div class="stat-num" data-count="' + livePapers + '">0</div><div class="stat-label">Papers in the library</div></div>' +
    '<div><div class="stat-num" data-count="' + liveTagged + '">0</div><div class="stat-label">Tagged records</div></div>' +
    '<div><div class="stat-num" data-count="' + liveCertain + '">0</div><div class="stat-label">Certain records (weightage base)</div></div>' +
    '</div>' + baseNote(idx.bases.live_note) + '</div>' +
    '<div class="grid grid-2">' +
    '<div class="card reveal in"><h3>Top 10 topics by certain records</h3><div id="homeTopics"></div>' +
    baseNote("Certain records only, Nov 2 certain-base snapshot (34,942) — the live totals above are newer. Compare shares, not counts.") + '</div>' +
    '<div class="card reveal in"><h3>CIS top 10 — Concept Importance Scores</h3><div id="homeCis"></div>' +
    baseNote("CIS v1, user-set weights. DI ranks 13th (understated by the 2025 coverage anomaly).") + '</div></div>' +
    '<div class="grid grid-2" style="margin-top:20px">' +
    '<div class="card reveal in"><h3>Certain records by held year</h3><div id="homeYears"></div>' +
    baseNote("Shares are of dated certain records in the Nov 2 snapshot (base " + fmt(ySum) + "). Raw counts rise with collection coverage — compare shares, not counts.") + '</div>' +
    '<div class="card reveal in"><h3>Start here</h3>' +
    '<p><strong>Day 1 — Number System</strong> (1,821 records · L1 → L2 · LOW speed set). ' +
    'Open the <a href="calendar.html">90-day challenge</a> and check off Day 1 when done.</p>' +
    '<p>Your progress so far: <strong>' + daysDone + ' / 90</strong> challenge days done · <strong>' + l3 +
    '</strong> topics at L3 or above · <strong>' + countMarks() + '</strong> library marks saved · <strong>🔥 ' +
    getStreak().count + '</strong> day streak · <strong>⚡ ' + fmt(getXP()) + '</strong> XP.</p>' +
    '<p><a href="library.html">Browse the ' + fmt(livePapers) + '-paper library →</a> · ' +
    '<a href="exams.html">Explore the 19 exams →</a> · ' +
    '<a href="hierarchy.html">Walk the hierarchy →</a></p></div></div>';
  barRows(document.getElementById("homeTopics"),
    top10.map(([k, v]) => ({ label: k, value: v, share: (100 * v / 34942).toFixed(1) + "%" })));
  document.getElementById("homeCis").innerHTML = '<table><thead><tr><th class="n">#</th><th>Topic</th><th class="n">CIS</th></tr></thead><tbody>' +
    cisTop.map(([k, v], i) => '<tr><td class="n">' + (i + 1) + '</td><td>' + esc(k) + '</td><td class="n">' + v.toFixed(3) + '</td></tr>').join("") + '</tbody></table>';
  barRows(document.getElementById("homeYears"),
    years.map(([y, v]) => ({ label: y, value: v, share: (100 * v / ySum).toFixed(1) + "%" })));
  animateCounters(el);
}
async function renderExams() {
  const el = document.getElementById("examGrid");
  if (!el) return;
  const exams = await loadJSON("data/exams.json");
  const cards = exams.map(e =>
    '<div class="card"><p><span class="badge ' + (e.family === "SSC" ? "badge-ssc" : "badge-rail") + '">' + e.family + '</span></p>' +
    '<h3><a href="exam.html?e=' + encodeURIComponent(e.code) + '">' + esc(e.display) + '</a></h3>' +
    '<p class="small muted">' + e.papers + ' papers · ' + fmt(e.certain) + ' certain records · ' + e.topic_count + ' topics</p>' +
    '<p class="small">Top topic: <strong>' + esc(e.topics[0] ? e.topics[0][0] : "—") + '</strong>' +
    (e.topics[0] ? ' (' + fmt(e.topics[0][1]) + ')' : '') + '</p></div>').join("");
  el.innerHTML = '<div class="grid grid-3">' + cards +
    '<div class="card"><h3>NTPC Graduate + Undergraduate</h3>' +
    '<p class="small">The Master Report names NTPC Graduate and NTPC Undergraduate as two exams (19 named). ' +
    'Tagging records carry a single NTPC code (post/stream not recorded), so this site shows one NTPC ' +
    'page with cycle notes instead of two invented pages. The library\u2019s 20th grouping is the NTPC ' +
    '2020–21 combined cycle. See <a href="methodology.html">Methodology</a> for the full count story.</p></div></div>' +
    '<p class="caption" style="margin-top:10px">Counts note: per-exam papers, totals and certain counts were rebuilt from the live paper files in Nov 2026. ' +
    'Topic / year / shift / stage / difficulty splits on exam pages are the Nov 2 certain-base snapshot — ' +
    'they predate the Nov 2026 merges and additions, so compare shares within an exam, not fresh counts.</p>';
}
async function renderExamDetail() {
  const el = document.getElementById("examDetail");
  if (!el) return;
  const code = getParams().get("e") || "";
  const exams = await loadJSON("data/exams.json");
  const e = exams.find(x => x.code === code);
  if (!e) {
    el.innerHTML = emptyState("Exam not found.", "No record-code exam matches that link.",
      'See all exams on the <a href="exams.html">Examinations page</a>.');
    return;
  }
  const totalCertain = e.certain;
  el.innerHTML =
    '<div class="page-hero"><p class="eyebrow">' + e.family + ' Examination</p><h1>' + esc(e.display) + '</h1>' +
    '<p class="muted">' + e.papers + ' papers · ' + fmt(e.total) + ' tag rows · ' + fmt(e.certain) +
    ' certain records · ' + e.topic_count + ' topics with certain records</p></div>' +
    '<div class="grid grid-3">' +
    '<div class="card"><div class="stat-num">' + e.papers + '</div><div class="stat-label">Papers</div></div>' +
    '<div class="card"><div class="stat-num">' + fmt(e.certain) + '</div><div class="stat-label">Certain records</div></div>' +
    '<div class="card"><div class="stat-num">' + (e.topics[0] ? esc(e.topics[0][0]) : "—") + '</div><div class="stat-label">Top topic</div></div></div>' +
    '<div class="grid grid-2" style="margin-top:20px">' +
    '<div class="card"><h3>Topic mix (internal shares of certain records)</h3><div id="exTopics"></div>' +
    baseNote("Shares are within this exam\u2019s certain records. Certain-count modes are NOT section sizes.") + '</div>' +
    '<div class="card"><h3>Difficulty mix (certain records)</h3><div id="exDiff"></div>' +
    '<h3 style="margin-top:18px">Answer-key status (all tag rows)</h3>' +
    '<p class="small">Present: ' + fmt(e.key_present) + ' · Absent: ' + fmt(e.key_absent) +
    ' · Key unavailable: ' + fmt(e.key_unavailable) + '</p>' +
    '<h3 style="margin-top:18px">Stages</h3><p class="small">' +
    Object.entries(e.stages).map(([k, v]) => esc(k) + ": " + fmt(v)).join(" · ") + '</p>' +
    '<h3 style="margin-top:18px">Shifts (certain)</h3><p class="small">' +
    Object.entries(e.shifts).map(([k, v]) => esc(k) + ": " + fmt(v)).join(" · ") + '</p></div></div>' +
    '<div class="card" style="margin-top:20px"><h3>Year-wise certain records</h3><div id="exYears"></div>' +
    baseNote("Counts rise with collection coverage — compare shares within an exam, not raw counts across exams.") + '</div>' +
    '<p class="caption" style="margin-top:10px">Splits note: topic / year / shift / stage / difficulty splits above are the Nov 2 certain-base snapshot; ' +
    'papers, totals and certain counts in the header are the Nov 2026 live rebuild from the paper files.</p>' +
    '<p style="margin-top:16px"><a href="library.html?exam=' + encodeURIComponent(e.code) + '">See this exam\u2019s papers in the library →</a></p>';
  barRows(document.getElementById("exTopics"),
    e.topics.map(([k, v]) => ({ label: k, value: v, share: (100 * v / totalCertain).toFixed(1) + "%" })));
  const dEl = document.getElementById("exDiff");
  donut(dEl, [{ label: "Easy", value: e.easy }, { label: "Medium", value: e.medium }, { label: "Hard", value: e.hard }],
    e.easy + e.medium + e.hard);
  barRows(document.getElementById("exYears"),
    Object.entries(e.years).map(([y, v]) => ({ label: y, value: v })));
}
async function renderHierarchy() {
  const treeEl = document.getElementById("hierTree");
  if (!treeEl) return;
  const [topics, formulas] = await Promise.all([
    loadJSON("data/topics.json"), loadJSON("data/hierarchy_formulas.json")]);
  const params = getParams();
  const selTopic = params.get("topic") || "";
  const selConcept = params.get("concept") || "";
  const byId = {};
  topics.forEach(t => t.sub_topics.forEach(s => s.concepts.forEach(c => byId[c.id] = { c, topic: t.name, sub: s.name })));
  treeEl.innerHTML = topics.map(t =>
    '<details class="accordion"' + (selTopic === t.name ? ' open' : '') + '><summary>' + esc(t.name) +
    ' <span class="muted small">· ' + fmt(t.certain) + ' certain · ' + t.sub_topics.length + ' sub-topics</span></summary>' +
    t.sub_topics.map(s => '<div style="margin:10px 0 10px 12px"><strong>' + esc(s.name) + '</strong>' +
      '<div class="small">' + s.concepts.map(c =>
        '<a href="hierarchy.html?concept=' + encodeURIComponent(c.id) + '">' + esc(c.name) + '</a>').join(" · ") + '</div></div>').join("") +
    '<p><a href="library.html?topic=' + encodeURIComponent(t.name) + '">Papers containing ' + esc(t.name) + ' →</a></p></details>'
  ).join("");
  const pane = document.getElementById("hierDetail");
  if (!pane) return;
  if (selConcept && byId[selConcept]) {
    const { c, topic, sub } = byId[selConcept];
    const fms = formulas.filter(f => f.topic === topic && f.concept === c.name);
    const prereq = (c.prerequisites || []).map(id => byId[id] ? '<a href="hierarchy.html?concept=' + encodeURIComponent(id) + '">' + esc(byId[id].c.name) + '</a>' : esc(id)).join(" · ");
    pane.innerHTML = '<p class="eyebrow">' + esc(topic) + ' → ' + esc(sub) + '</p><h2>' + esc(c.name) + '</h2>' +
      '<p><span class="badge">Difficulty: ' + esc(c.difficulty) + '</span> <span class="badge">' + esc(c.exam_mapping) + '</span></p>' +
      '<h3>Definition (English)</h3><p>' + esc(c.definition_en) + '</p>' +
      '<h3>Hindi samajh</h3><p>' + esc(c.explanation_hi) + '</p>' +
      (prereq ? '<h3>Prerequisites</h3><p>' + prereq + '</p>' : '') +
      (fms.length ? '<h3>Formulas (from this concept)</h3>' + fms.map(f => '<p class="mono" style="font-size:14px">' + esc(f.formula) + '</p>').join("") : '') +
      '<p><a href="library.html?topic=' + encodeURIComponent(topic) + '">Papers containing ' + esc(topic) + ' →</a></p>' +
      '<div class="callout unavail">PYQ examples are not reproduced here (project copyright rule). ' +
      'Use the linked papers and their source PDFs for original wording.</div>';
  } else if (selTopic) {
    const t = topics.find(x => x.name === selTopic);
    pane.innerHTML = t ? '<p class="eyebrow">Topic</p><h2>' + esc(t.name) + '</h2>' +
      '<p>' + fmt(t.certain) + ' certain records · ' + fmt(t.total) + ' tag rows · ' + t.exams +
      ' exams · ' + t.sub_topics.length + ' sub-topics</p>' +
      '<h3>Sub-topics</h3><ul>' + t.sub_topics.map(s => '<li><strong>' + esc(s.name) + '</strong> — ' +
      fmt(s.certain) + ' certain · ' + s.concepts.length + ' concepts</li>').join("") + '</ul>' +
      '<p><a href="library.html?topic=' + encodeURIComponent(t.name) + '">Papers containing ' + esc(t.name) + ' →</a></p>'
      : emptyState("Topic not found.", "No hierarchy topic matches that link.", 'Browse the <a href="hierarchy.html">hierarchy</a>.');
  } else {
    pane.innerHTML = '<p class="muted">Select a topic on the left to see its sub-topics and counts, or open any ' +
      'concept for its definition, Hindi explanation, prerequisites and formulas. Hierarchy concepts (295) ' +
      'and record concept-tags (344 labels) are different sets and are never conflated on this site.</p>';
  }
  const search = document.getElementById("hierSearch");
  if (search) search.addEventListener("input", e => {
    const q = e.target.value.trim().toLowerCase();
    treeEl.querySelectorAll("details").forEach(d => {
      d.style.display = (!q || d.textContent.toLowerCase().includes(q)) ? "" : "none";
    });
  });
}
async function renderPatterns() {
  const el = document.getElementById("patternsWrap");
  if (!el) return;
  const [pat, topics] = await Promise.all([loadJSON("data/patterns.json"), loadJSON("data/topics.json")]);
  const sel = document.getElementById("patTopic");
  sel.innerHTML = topics.map(t => '<option value="' + esc(t.name) + '">' + esc(t.name) + '</option>').join("");
  const showModels = () => {
    const t = sel.value;
    const models = pat.model_by_topic[t] || [];
    document.getElementById("patModels").innerHTML = models.length ?
      '<table><thead><tr><th>Model label (as tagged)</th><th class="n">Records</th></tr></thead><tbody>' +
      models.map(([m, c]) => '<tr><td>' + esc(m) + '</td><td class="n">' + fmt(c) + '</td></tr>').join("") + '</tbody></table>' +
      baseNote(pat.models_note) : emptyState("No model labels for this topic.", "Some topics have no topic_question_type labels in the records.", "");
  };
  sel.addEventListener("change", showModels);
  showModels();
  barRows(document.getElementById("patTypes"),
    Object.entries(pat.question_types).sort((a, b) => b[1] - a[1])
      .map(([k, v]) => ({ label: k, value: v })));
  document.getElementById("patPairs").innerHTML = '<table><thead><tr><th>Pair (secondary topic)</th><th class="n">Records</th></tr></thead><tbody>' +
    pat.pairs.map(([pair, c]) => '<tr><td>' + esc(pair[0]) + ' ↔ ' + esc(pair[1]) + '</td><td class="n">' + fmt(c) + '</td></tr>').join("") + '</tbody></table>' +
    baseNote(pat.pairs_note);
  const trickList = document.getElementById("patTricks");
  const renderTricks = q => {
    const rows = pat.trick_top.filter(([t]) => !q || t.toLowerCase().includes(q));
    trickList.innerHTML = rows.length ? rows.map(([t, c]) => '<div class="bar-row"><span>' + esc(t) + '</span><span></span><span class="num" style="text-align:right">' + fmt(c) + '</span></div>').join("")
      : emptyState("No trick labels match.", "Try a shorter search.", "");
  };
  renderTricks("");
  document.getElementById("patTrickSearch").addEventListener("input", e => renderTricks(e.target.value.trim().toLowerCase()));
  document.getElementById("patTrickCount").textContent =
    "Top 40 of " + fmt(pat.trick_distinct) + " distinct shortcut labels in the records.";
}
async function renderFormulas() {
  const el = document.getElementById("formulaWrap");
  if (!el) return;
  const fms = await loadJSON("data/hierarchy_formulas.json");
  const topics = [...new Set(fms.map(f => f.topic))].sort();
  document.getElementById("fTopic").innerHTML = '<option value="">All topics</option>' +
    topics.map(t => '<option value="' + esc(t) + '">' + esc(t) + '</option>').join("");
  const render = () => {
    const q = (document.getElementById("fSearch").value || "").trim().toLowerCase();
    const t = document.getElementById("fTopic").value;
    const rows = fms.filter(f => (!t || f.topic === t) &&
      (!q || (f.formula + " " + f.concept + " " + f.topic).toLowerCase().includes(q)));
    el.innerHTML = '<p class="small muted">' + fmt(rows.length) + ' of ' + fmt(fms.length) +
      ' hierarchy formulas shown.</p>' + (rows.length ? rows.map(f =>
      '<div class="formula"><strong>' + esc(f.concept) + '</strong> <span class="badge">' + esc(f.topic) + '</span>' +
      '<div class="expr">' + esc(f.formula) + '</div></div>').join("")
      : emptyState("No formulas match.", "Loosen the search or topic filter.", ""));
  };
  document.getElementById("fSearch").addEventListener("input", render);
  document.getElementById("fTopic").addEventListener("change", render);
  render();
}
async function renderCompare() {
  const el = document.getElementById("compareWrap");
  if (!el) return;
  const [exams, maps] = await Promise.all([loadJSON("data/exams.json"), loadJSON("data/exams_topics.json")]);
  const box = document.getElementById("cmpSelect");
  box.innerHTML = exams.map(e => '<label style="display:block;margin:4px 0"><input type="checkbox" value="' + esc(e.code) + '"> ' +
    esc(e.display) + ' <span class="muted small">(' + e.family + ')</span></label>').join("");
  const render = () => {
    const sel = [...box.querySelectorAll("input:checked")].map(i => i.value);
    const out = document.getElementById("cmpOut");
    if (sel.length < 2) {
      out.innerHTML = emptyState("Select 2–4 exams.", "Comparison needs at least two exams.", "");
      return;
    }
    if (sel.length > 4) {
      out.innerHTML = emptyState("Too many exams selected.", "Uncheck one — comparison supports 2–4 exams at a time.", "");
      return;
    }
    const sets = sel.map(c => new Set(Object.keys(maps[c] || {})));
    const common = [...sets[0]].filter(t => sets.every(s => s.has(t)));
    const jaccard = (a, b) => {
      const inter = [...a].filter(x => b.has(x)).length;
      const uni = new Set([...a, ...b]).size;
      return uni ? (inter / uni).toFixed(2) : "—";
    };
    let mat = '<table><thead><tr><th>Overlap (Jaccard on PYQ topic sets)</th>' +
      sel.map(c => '<th>' + esc(EXAM_DISPLAY[c] || c) + '</th>').join("") + '</tr></thead><tbody>';
    sel.forEach((a, i) => {
      mat += '<tr><td><strong>' + esc(EXAM_DISPLAY[a] || a) + '</strong></td>' +
        sel.map((b, j) => '<td class="heat">' + (i === j ? "1.00" : jaccard(sets[i], sets[j])) + '</td>').join("") + '</tr>';
    });
    mat += '</tbody></table>' + baseNote("Jaccard = shared topics ÷ union of topics (certain records only). This is PYQ topic-set overlap — NOT a syllabus-overlap percentage (syllabus documents were never collected).");
    const uniq = sel.map((c, i) => {
      const others = new Set(sets.filter((_, j) => j !== i).flatMap(s => [...s]));
      return { code: c, uniq: [...sets[i]].filter(t => !others.has(t)) };
    });
    out.innerHTML = '<h3>Common topics (' + common.length + ')</h3><p>' + (common.length ? common.map(esc).join(" · ") : "None shared by all selected exams.") + '</p>' +
      '<h3>Pairwise overlap matrix</h3><div class="matrix">' + mat + '</div>' +
      '<h3>Topics unique to one selected exam</h3>' + uniq.map(u =>
        '<p><strong>' + esc(EXAM_DISPLAY[u.code] || u.code) + ':</strong> ' +
        (u.uniq.length ? u.uniq.map(esc).join(" · ") : "none") + '</p>').join("");
  };
  box.querySelectorAll("input").forEach(i => i.addEventListener("change", render));
  render();
}
async function renderCIS() {
  const el = document.getElementById("cisWrap");
  if (!el) return;
  const cis = await loadJSON("data/cis.json");
  const entries = Object.entries(cis.scores);
  document.getElementById("cisTable").innerHTML = '<table><thead><tr><th class="n">Rank</th><th>Topic</th><th class="n">CIS v1</th><th>Tier</th></tr></thead><tbody>' +
    entries.map(([k, v], i) => '<tr><td class="n">' + (i + 1) + '</td><td>' + esc(k) + '</td><td class="n">' + v.toFixed(3) + '</td><td><span class="badge badge-tier">' + esc(TIER_MAP[k] || "—") + '</span></td></tr>').join("") + '</tbody></table>' +
    '<p class="small muted">' + cis.notes.join(" ") + '</p>';
  const W = [["freq", "PYQ frequency", 25], ["recent", "Recent frequency", 15], ["examw", "Exam weightage", 15],
    ["dep_out", "Dependency (out-degree)", 10], ["models_norm", "Model diversity", 10], ["easy", "Scoring potential (easy share)", 10],
    ["exams", "Syllabus relevance (exams/18)", 10], ["trick", "Learning efficiency (trick share)", 5]];
  const sliders = document.getElementById("cisSliders");
  sliders.innerHTML = W.map(([k, label, dflt]) =>
    '<div class="filter-group"><label>' + label + ' — <span id="w_' + k + '">' + dflt + '%</span></label>' +
    '<input type="range" min="0" max="50" value="' + dflt + '" data-w="' + k + '" style="width:100%"></div>').join("");
  const recompute = () => {
    const weights = {};
    let sum = 0;
    sliders.querySelectorAll("input").forEach(s => {
      weights[s.dataset.w] = Number(s.value);
      sum += Number(s.value);
      document.getElementById("w_" + s.dataset.w).textContent = s.value + "%";
    });
    if (!sum) sum = 1;
    const keys = Object.keys(cis.inputs);
    const norm = {};
    W.forEach(([k]) => {
      const vals = keys.map(t => cis.inputs[t][k] == null ? 0 : cis.inputs[t][k]);
      const mn = Math.min(...vals), mx = Math.max(...vals);
      norm[k] = {};
      keys.forEach(t => norm[k][t] = (mx - mn) ? (cis.inputs[t][k] - mn) / (mx - mn) : 0);
    });
    const scored = keys.map(t => {
      let s = 0;
      W.forEach(([k]) => s += (weights[k] / sum) * (norm[k][t] || 0));
      return [t, s];
    }).sort((a, b) => b[1] - a[1]);
    document.getElementById("cisPlayOut").innerHTML = '<table><thead><tr><th class="n">Exploratory rank</th><th>Topic</th><th class="n">Exploratory score</th><th class="n">Published v1 rank</th></tr></thead><tbody>' +
      scored.slice(0, 15).map(([t, s], i) =>
        '<tr><td class="n">' + (i + 1) + '</td><td>' + esc(t) + '</td><td class="n">' + s.toFixed(3) + '</td><td class="n">' + (entries.findIndex(([k]) => k === t) + 1) + '</td></tr>').join("") + '</tbody></table>' +
      '<p class="small muted">Exploratory recomputation only: weighted sum of min-max normalised published inputs, weights renormalised to sum 100%. It is NOT CIS v1 and may differ from the published scores — v1\u2019s exact normalisation pipeline is not fully specified in the report. Use it to test sensitivity, not as a replacement ranking.</p>';
  };
  sliders.querySelectorAll("input").forEach(s => s.addEventListener("input", recompute));
  recompute();
}
document.addEventListener("DOMContentLoaded", () => {
  renderHome(); renderExams(); renderExamDetail(); renderHierarchy();
  renderPatterns(); renderFormulas(); renderCompare(); renderCIS();
});
