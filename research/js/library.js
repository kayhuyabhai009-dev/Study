/* library.js — paper library search/filters/pagination + paper detail + marks. */
function setParams(p) {
  history.replaceState(null, "", location.pathname + (p.toString() ? "?" + p.toString() : ""));
}
let LIB_ROWS = [];
async function initLibrary() {
  const listEl = document.getElementById("libResults");
  if (!listEl) return;
  await siteIndex();
  const [index, exams] = await Promise.all([loadJSON("data/papers_index.json"), loadJSON("data/exams.json")]);
  LIB_ROWS = index.map(decodePaper);
  const params = getParams();
  const state = {
    q: params.get("q") || "", exams: (params.get("exam") || "").split(",").filter(Boolean),
    year: params.get("year") || "", shift: params.get("shift") || "",
    topic: params.get("topic") || "", diff: params.get("diff") || "",
    type: params.get("type") || "", key: params.get("key") || "",
    sort: params.get("sort") || "date-desc", page: Math.max(1, Number(params.get("page") || 1)),
  };
  const years = [...new Set(LIB_ROWS.map(r => r.year))].sort().reverse();
  const filtersEl = document.getElementById("libFilters");
  filtersEl.innerHTML =
    '<div class="filter-group"><label>Search (paper id, exam, topic)</label>' +
    '<input type="search" id="fQ" placeholder="e.g. 2026-Tier1, CGL, Trigonometry" value="' + esc(state.q) + '"></div>' +
    '<div class="filter-group"><label>Exam</label><div class="chip-row" id="fExams">' +
    exams.map(e => '<button class="chip' + (state.exams.includes(e.code) ? ' on' : '') +
      '" data-exam="' + esc(e.code) + '">' + esc(e.display) + '</button>').join("") + '</div></div>' +
    '<div class="filter-group"><label>Year</label><select id="fYear"><option value="">All years</option>' +
    years.map(y => '<option value="' + y + '"' + (state.year === y ? ' selected' : '') + '>' + y + '</option>').join("") + '</select></div>' +
    '<div class="filter-group"><label>Shift</label><div class="chip-row" id="fShift">' +
    ["S1", "S2", "S3", "S4", "not recorded"].map(s => '<button class="chip' + (state.shift === s ? ' on' : '') +
      '" data-shift="' + s + '">' + s + '</button>').join("") + '</div></div>' +
    '<div class="filter-group"><label>Topic in paper</label><select id="fTopic"><option value="">Any topic</option>' +
    TOPIC_NAMES.map(t => '<option value="' + esc(t) + '"' + (state.topic === t ? ' selected' : '') + '>' + esc(t) + '</option>').join("") + '</select></div>' +
    '<div class="filter-group"><label>Difficulty present</label><div class="chip-row" id="fDiff">' +
    ["easy", "medium", "hard"].map(d => '<button class="chip' + (state.diff === d ? ' on' : '') +
      '" data-diff="' + d + '">' + d + '</button>').join("") + '</div></div>' +
    '<div class="filter-group"><label>Paper type</label><div class="chip-row" id="fType">' +
    ["official", "bilingual-official", "similar", "memory-based"].map(t => '<button class="chip' + (state.type === t ? ' on' : '') +
      '" data-type="' + t + '">' + t + '</button>').join("") + '</div></div>' +
    '<div class="filter-group"><label>Answer key</label><div class="chip-row" id="fKey">' +
    '<button class="chip' + (state.key === "present" ? ' on' : '') + '" data-key="present">Key present</button>' +
    '<button class="chip' + (state.key === "absent" ? ' on' : '') + '" data-key="absent">Key not present</button></div></div>' +
    '<div class="filter-group"><label>Sort</label><select id="fSort">' +
    [["date-desc", "Date (newest first)"], ["date-asc", "Date (oldest first)"],
     ["total-desc", "Most questions"], ["exam", "Exam A–Z"]].map(([v, l]) =>
      '<option value="' + v + '"' + (state.sort === v ? ' selected' : '') + '>' + l + '</option>').join("") + '</select></div>' +
    '<button class="chip" id="fClear" style="width:100%;padding:9px">Clear all filters</button>';
  let debounce;
  document.getElementById("fQ").setAttribute("data-global-search", "");
  const rerender = (resetPage) => {
    if (resetPage) state.page = 1;
    renderLibList(state);
    const p = new URLSearchParams();
    if (state.q) p.set("q", state.q);
    if (state.exams.length) p.set("exam", state.exams.join(","));
    ["year", "shift", "topic", "diff", "type", "key", "sort"].forEach(k => { if (state[k]) p.set(k, state[k]); });
    if (state.page > 1) p.set("page", state.page);
    setParams(p);
  };
  document.getElementById("fQ").addEventListener("input", e => {
    state.q = e.target.value.trim();
    clearTimeout(debounce);
    debounce = setTimeout(() => rerender(true), 150);
  });
  filtersEl.querySelectorAll("#fExams .chip").forEach(b => b.addEventListener("click", () => {
    const code = b.dataset.exam;
    state.exams = state.exams.includes(code) ? state.exams.filter(x => x !== code) : [...state.exams, code];
    b.classList.toggle("on");
    rerender(true);
  }));
  const chipGroup = (id, key) => filtersEl.querySelectorAll("#" + id + " .chip").forEach(b =>
    b.addEventListener("click", () => {
      state[key] = (state[key] === b.dataset[key]) ? "" : b.dataset[key];
      filtersEl.querySelectorAll("#" + id + " .chip").forEach(x => x.classList.toggle("on", state[key] === x.dataset[key]));
      rerender(true);
    }));
  chipGroup("fShift", "shift"); chipGroup("fDiff", "diff"); chipGroup("fType", "type"); chipGroup("fKey", "key");
  ["fYear", "fTopic", "fSort"].forEach(id => document.getElementById(id).addEventListener("change", e => {
    state[id === "fYear" ? "year" : id === "fTopic" ? "topic" : "sort"] = e.target.value;
    rerender(true);
  }));
  document.getElementById("fClear").addEventListener("click", () => {
    location.href = "library.html";
  });
  window.__libRerender = rerender;
  rerender(false);
}
function applyLibFilters(state) {
  let rows = LIB_ROWS.filter(r => {
    if (state.q) {
      const q = state.q.toLowerCase();
      const hay = (r.id + " " + r.examDisplay + " " + r.topics.map(t => t.name).join(" ")).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (state.exams.length && !state.exams.includes(r.exam)) return false;
    if (state.year && r.year !== state.year) return false;
    if (state.shift && r.shift !== state.shift) return false;
    if (state.topic && !r.topics.some(t => t.name === state.topic)) return false;
    if (state.diff && r[state.diff] <= 0) return false;
    if (state.type && r.type !== state.type) return false;
    if (state.key === "present" && r.keyPresent <= 0) return false;
    if (state.key === "absent" && r.keyPresent > 0) return false;
    return true;
  });
  if (state.sort === "date-desc") rows.sort((a, b) => (b.date === "unknown" ? "" : b.date).localeCompare(a.date === "unknown" ? "" : a.date));
  if (state.sort === "date-asc") rows.sort((a, b) => (a.date === "unknown" ? "9999" : a.date).localeCompare(b.date === "unknown" ? "9999" : b.date));
  if (state.sort === "total-desc") rows.sort((a, b) => b.total - a.total);
  if (state.sort === "exam") rows.sort((a, b) => a.examDisplay.localeCompare(b.examDisplay));
  return rows;
}
function renderLibList(state) {
  const rows = applyLibFilters(state);
  const per = 20, pages = Math.max(1, Math.ceil(rows.length / per));
  if (state.page > pages) state.page = pages;
  const slice = rows.slice((state.page - 1) * per, state.page * per);
  const certainSum = rows.reduce((s, r) => s + r.certain, 0);
  document.getElementById("libCount").innerHTML =
    "<strong>" + fmt(rows.length) + " papers</strong> · " + fmt(certainSum) +
    " certain records in this view · page " + state.page + " of " + pages;
  document.getElementById("libResults").innerHTML = slice.length ? slice.map(r =>
    '<div class="paper-row"><a href="paper.html?id=' + encodeURIComponent(r.id) + '"><strong>' + esc(r.id) + '</strong></a>' +
    ' <span class="badge ' + (r.family === "SSC" ? "badge-ssc" : "badge-rail") + '">' + esc(r.examDisplay) + '</span>' +
    ' <span class="badge">' + esc(r.type) + '</span>' +
    '<div class="muted small">' + esc(r.date) + ' · Shift ' + esc(r.shift) + ' · ' + esc(r.stage || "—") +
    ' · ' + r.total + ' questions · ' + r.certain + ' certain · key present on ' + r.keyPresent +
    ' · difficulty E' + r.easy + '/M' + r.medium + '/H' + r.hard + '</div>' +
    '<div class="small">Top topics: ' + r.topics.map(t => esc(t.name) + " (" + t.count + ")").join(" · ") + '</div></div>'
  ).join("") : '<div class="empty"><strong>No papers match.</strong><p>Loosen a filter, or clear all filters above.</p></div>';
  document.getElementById("libPager").innerHTML =
    '<button ' + (state.page <= 1 ? "disabled" : "") + ' data-pg="-1">← Previous</button>' +
    '<span class="small">Page ' + state.page + ' of ' + pages + '</span>' +
    '<button ' + (state.page >= pages ? "disabled" : "") + ' data-pg="1">Next →</button>';
  document.querySelectorAll("#libPager button[data-pg]").forEach(b => b.addEventListener("click", () => {
    state.page += Number(b.dataset.pg);
    window.__libRerender(false);
    document.getElementById("libResults").scrollIntoView({ behavior: "smooth" });
  }));
}
function qtNoteHTML(paper, qt) {
  const base = 'Answers in the tag table are bare values from the paper\u2019s own key, shown behind a toggle.';
  if (!qt) return 'Full question text is <strong>not available</strong> for this paper yet. ' + base;
  const qtWithText = (qt.questions || []).filter(q => q.text && q.text.trim()).length;
  if (qt.status !== "ok" && qtWithText) {
    return 'Full question text below is <strong>extracted from this paper\u2019s source PDF</strong>, but its alignment to tagged rows was <strong>not verified</strong> (file status: ' + esc(qt.status) + ') — question numbers follow the extracted file. Nothing was invented. ' + base;
  }
  if (qt.status !== "ok") {
    const why = qt.status === "no_text_layer" ? 'its source PDF has no text layer (scanned / image-only)' :
      qt.status === "alignment_failed" ? 'its questions could not be aligned to the tagged records reliably, so no mapping was guessed' :
      qt.status === "no_split" ? 'no question pattern matched its layout' : 'extraction produced no usable output';
    return 'Full question text is <strong>not recovered</strong> for this paper — ' + why + '. Nothing was invented for it. ' + base;
  }
  const qs = qt.questions || [];
  const withText = qs.filter(q => q.text && q.text.trim()).length;
  const real = qs.filter(q => q.options_source === "real").length;
  const added = qs.filter(q => q.options_source === "added").length;
  const missing = qs.filter(q => q.options_source === "missing").length;
  const image = qs.filter(q => q.image_only).length;
  const mapped = new Set(qs.map(q => q.n));
  const unmapped = paper.questions.filter(q => !mapped.has(q.n)).length;
  if (!withText) return 'Questions were located in the source PDF but <strong>all are image-based</strong> there — no wording could be extracted. Nothing was invented. ' + base;
  return 'Full question text + options below are <strong>extracted from this paper\u2019s source PDF</strong> ' +
    '(mode: ' + esc(qt.mode || "—") + '). ' + withText + '/' + paper.total + ' questions with text · ' +
    real + ' with real options · ' + added + ' with <strong>(+) options added by Muse</strong> · ' +
    missing + ' options not recovered · ' + image + ' image-only · ' + unmapped + ' not mapped. ' +
    'Options marked (+) are <strong>not from the paper</strong> — they were generated from the key value where the source had no usable options. ' + base;
}

/* v3.0: display is content-based, not status-gated. Any entry carrying text
   renders; entries without text show the image-only note. The answer line
   sits after the options: correct option highlighted + value where the key
   is available, "answer unavailable" (never guessed) where it is not. */
function normVal(s) { return String(s).toLowerCase().replace(/[^a-z0-9]/g, ""); }
function correctIdx(q) {
  if (q.key_answer == null || String(q.key_answer).trim() === "") return -1;
  const want = normVal(q.key_answer);
  const hits = (q.options || []).map((o, i) => normVal(o.text) === want ? i : -1).filter(i => i >= 0);
  return hits.length === 1 ? hits[0] : -1;
}
function answerLineHTML(q) {
  const kv = q.key_answer;
  if (kv == null || String(kv).trim() === "")
    return '<div class="answer-line unavail">Answer unavailable — not guessed.</div>';
  return '<div class="answer-line">✓ Answer: <strong>' + esc(String(kv)) + '</strong></div>';
}
function qtCardHTML(q) {
  const letters = ["A", "B", "C", "D"];
  const ci = correctIdx(q);
  const opts = (q.options || []).length && (q.options || []).some(o => o.text && o.text.trim())
    ? '<ol class="qopts">' + q.options.map((o, i) =>
      '<li' + (i === ci ? ' class="opt-correct"' : '') + '><span class="mono">' + letters[i] + '.</span> ' + esc(o.text) +
      (i === ci ? ' ✓' : '') +
      (o.added ? ' <span class="badge" title="Added by Muse, not from the paper">(+)</span>' : '') + '</li>').join("") + '</ol>'
    : '<p class="small muted">Options not recovered.</p>';
  const stem = (!q.text || !q.text.trim())
    ? '<p class="small muted">Image-based question — wording is in the source PDF, not in its text layer.</p>'
    : '<p>' + esc(q.text) + '</p>';
  const srcNote = q.options_source === "added" ? ' <span class="small muted">(options added by Muse from the key value)</span>'
    : q.options_source === "missing" ? ' <span class="small muted">(options not recovered)</span>' : '';
  return '<div class="card" style="margin-bottom:12px"><p><strong>Q' + q.n + '</strong> · ' +
    '<span class="topic-tag">' + esc(q.topic) + '</span> · ' + esc(q.sub) + srcNote + '</p>' + stem + opts +
    answerLineHTML(q) + '</div>';
}
function qtSectionHTML(paper, qt) {
  if (!qt || !qt.questions.length) return "";
  const entries = qt.questions.filter(q => q.text && q.text.trim());
  const mapped = new Set(qt.questions.map(q => Number(q.n)));
  const unmapped = paper.questions.filter(q => !mapped.has(Number(q.n))).map(q => q.n);
  const playable = entries.filter(q =>
    (q.options || []).length === 4 && q.options.every(o => o.text && o.text.trim()) && correctIdx(q) >= 0);
  let h = '<div style="margin-top:28px"><h3>Questions — full text + options (from source PDF)</h3>' +
    '<p class="small muted">Order follows the tagged question numbers. (+) marks options added by Muse, not from the paper. ' +
    'The answer line after each question shows the key value where available, and "answer unavailable" where the key is missing — never guessed.</p>';
  h += '<div id="playerWrap" style="display:none"></div><div id="staticWrap">';
  if (playable.length) {
    h += '<p><button class="btn-next" id="practiceBtn">▶ Practice this paper — ' + playable.length +
      ' playable question' + (playable.length === 1 ? '' : 's') + '</button></p>' +
      '<p class="small muted">Practice runs only on questions with all 4 options and a matched key. ' +
      (entries.length - playable.length) + ' shown question' + (entries.length - playable.length === 1 ? '' : 's') +
      ' below ' + (entries.length - playable.length === 1 ? 'is' : 'are') + ' excluded from practice (no key or incomplete options).</p>';
  } else if (entries.length) {
    h += '<p class="small muted">No question here is playable yet — practice needs all 4 options plus a matched key. The cards below still show every recovered stem and its answer line.</p>';
  }
  h += qt.questions.map(q => qtCardHTML(q)).join("");
  if (unmapped.length) h += '<p class="small muted">Text not recovered for Q' + unmapped.join(", Q") + ' — see the source PDF.</p>';
  h += '</div></div>';
  return h;
}
/* ---- v3.0 question player: vertical A–D buttons, lock + immediate marking,
   feedback banner + XP, explanation panel, Next. XP + streak live in the
   browser only (data.js). Practice never invents a key: the pool is rows
   with 4 options and exactly one option matching the key value. ---- */
let PLAY = null, PLAY_TIMER = null;
function refreshSidePills() {
  const pills = document.getElementById("sidePills");
  if (pills) {
    const st = getStreak();
    pills.innerHTML = '<span class="pill pill-streak">🔥 Streak: ' + st.count + ' din</span>' +
      '<span class="pill pill-xp">⚡ ' + fmt(getXP()) + ' XP</span>';
  }
}
function fmtTime(s) {
  return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
}
function startPractice() {
  const d = window.__paperDetail;
  if (!d || !d.qt) return;
  const pool = (d.qt.questions || []).filter(q =>
    q.text && q.text.trim() && (q.options || []).length === 4 &&
    q.options.every(o => o.text && o.text.trim()) && correctIdx(q) >= 0);
  if (!pool.length) return;
  PLAY = { pool, idx: 0, score: 0, xp: 0, elapsed: 0, locked: false, answered: false };
  document.getElementById("staticWrap").style.display = "none";
  const w = document.getElementById("playerWrap");
  w.style.display = "";
  clearInterval(PLAY_TIMER);
  PLAY_TIMER = setInterval(() => {
    if (!PLAY) return;
    PLAY.elapsed += 1;
    const t = document.getElementById("playTimer");
    if (t) t.textContent = fmtTime(PLAY.elapsed);
  }, 1000);
  renderPlayerQ();
}
function renderPlayerQ() {
  const w = document.getElementById("playerWrap");
  const q = PLAY.pool[PLAY.idx];
  const letters = ["A", "B", "C", "D"];
  w.innerHTML =
    '<div class="player-head"><span><strong>Question ' + (PLAY.idx + 1) + ' of ' + PLAY.pool.length +
    '</strong> · Score ' + PLAY.score + ' · ⏱ <span id="playTimer">' + fmtTime(PLAY.elapsed) + '</span></span>' +
    '<button class="mark-btn" id="exitPlayer">✕ Exit practice</button></div>' +
    '<div class="card"><p><span class="topic-tag">' + esc(q.topic) + '</span> · ' + esc(q.sub) + '</p>' +
    '<p style="font-size:17px"><strong>Q' + q.n + '.</strong> ' + esc(q.text) + '</p>' +
    '<div id="playOpts">' + q.options.map((o, i) =>
      '<button class="opt-btn" data-i="' + i + '"><span class="mono">' + letters[i] + '.</span> ' + esc(o.text) + '</button>').join("") +
    '</div><div id="playFeedback"></div><div id="playExplain"></div></div>';
  document.getElementById("exitPlayer").addEventListener("click", exitPlayer);
  w.querySelectorAll("#playOpts .opt-btn").forEach(b => b.addEventListener("click", () => answerPlayer(Number(b.dataset.i))));
}
function answerPlayer(i) {
  if (!PLAY || PLAY.locked) return;
  PLAY.locked = true;
  const q = PLAY.pool[PLAY.idx];
  const ci = correctIdx(q);
  const letters = ["A", "B", "C", "D"];
  if (!PLAY.answered) { touchStreak(); PLAY.answered = true; }
  const btns = document.querySelectorAll("#playOpts .opt-btn");
  btns.forEach((b, j) => {
    b.disabled = true;
    if (j === ci) b.classList.add("opt-correct");
    else if (j === i) b.classList.add("opt-wrong");
    else b.classList.add("opt-dim");
  });
  const fb = document.getElementById("playFeedback");
  const ex = document.getElementById("playExplain");
  if (i === ci) {
    PLAY.score += 1;
    PLAY.xp += 10;
    addXP(10);
    fb.innerHTML = '<div class="feedback good">✓ Sahi! +10 XP</div>';
  } else {
    fb.innerHTML = '<div class="feedback bad">✗ Galat — sahi answer: ' + letters[ci] + '. ' + esc(String(q.key_answer)) + '</div>';
  }
  ex.innerHTML = '<div class="callout"><strong>Answer: ' + letters[ci] + '. ' + esc(String(q.key_answer)) +
    '</strong> · Topic: ' + esc(q.topic) + ' · ' + esc(q.sub) +
    '<div style="margin-top:12px"><button class="btn-next" id="nextQ">' +
    (PLAY.idx + 1 >= PLAY.pool.length ? 'Finish — see summary' : 'Next question →') + '</button></div></div>';
  document.getElementById("nextQ").addEventListener("click", () => {
    if (PLAY.idx + 1 >= PLAY.pool.length) endPlayer();
    else { PLAY.idx += 1; PLAY.locked = false; renderPlayerQ(); }
  });
  refreshSidePills();
}
function endPlayer() {
  clearInterval(PLAY_TIMER);
  const acc = PLAY.pool.length ? Math.round(100 * PLAY.score / PLAY.pool.length) : 0;
  const w = document.getElementById("playerWrap");
  w.innerHTML = '<div class="card"><h3>🎉 Practice complete!</h3>' +
    '<div class="grid grid-4" style="margin-top:12px">' +
    '<div><div class="stat-num">' + PLAY.score + '/' + PLAY.pool.length + '</div><div class="stat-label">Score</div></div>' +
    '<div><div class="stat-num">' + acc + '%</div><div class="stat-label">Accuracy</div></div>' +
    '<div><div class="stat-num">+' + PLAY.xp + '</div><div class="stat-label">XP earned</div></div>' +
    '<div><div class="stat-num">' + fmtTime(PLAY.elapsed) + '</div><div class="stat-label">Time</div></div></div>' +
    '<p style="margin-top:16px"><button class="btn-next" id="backToCards">← Back to all questions</button></p></div>';
  document.getElementById("backToCards").addEventListener("click", exitPlayer);
  PLAY = null;
  refreshSidePills();
}
function exitPlayer() {
  clearInterval(PLAY_TIMER);
  PLAY = null;
  const w = document.getElementById("playerWrap");
  const s = document.getElementById("staticWrap");
  if (w) { w.style.display = "none"; w.innerHTML = ""; }
  if (s) s.style.display = "";
}

function ytSectionHTML(paper, yt) {
  if (!yt) return "";
  const qs = yt.questions || [];
  const letters = qs.filter(q => q.teacher_answer && String(q.teacher_answer).startsWith("(")).length;
  const identified = qs.filter(q => q.teacher_answer).length;
  const unc = (yt.alignment && yt.alignment.uncertain) || [];
  const channel = (yt.video && yt.video.channel) ? yt.video.channel : "Exam Crack By Sudhir Sir";
  let h = '<div style="margin-top:28px"><h3>YouTube video analysis (' + esc(channel) + ')</h3>' +
    '<p class="small muted">Analysis only — topic + teacher answer + timestamp per question. No question wording or option texts from the video are reproduced here. ' +
    'Video: <a href="' + esc(yt.video.url) + '" target="_blank" rel="noopener">' + esc(yt.video.title) + '</a> (' + esc(yt.video.duration) + '). ' +
    identified + '/' + qs.length + ' answers identified (' + letters + ' with letters) · topics: ' +
    (yt.alignment ? yt.alignment.exact + ' exact, ' + yt.alignment.compatible + ' compatible, ' + unc.length + ' uncertain' : '—') + '.</p>';
  h += qs.map(q => {
    const badge = q.topic_match === "exact" ? "" : q.topic_match === "skipped in video" ? ' <span class="badge">skipped in video</span>'
      : q.topic_match ? ' <span class="badge">' + esc(q.topic_match) + '</span>' : "";
    const ans = q.teacher_answer ? esc(String(q.teacher_answer)) : '<span class="muted">not identified — left blank, not guessed</span>';
    return '<div class="card" style="margin-bottom:8px"><p><strong>Q' + q.n + '</strong> · ' + esc(q.yt_topic || "—") + badge +
      '<br><span class="small">Teacher answer: ' + ans + (q.timestamp ? ' · ~' + esc(q.timestamp) : '') + '</span></p></div>';
  }).join("");
  if (unc.length) h += '<p class="small muted">Topic flags (tags NOT overwritten): ' +
    unc.map(u => 'Q' + u.n + ' video ' + esc(u.yt_topic) + ' vs tag ' + esc(u.tag_topic)).join("; ") + '.</p>';
  const uvq = yt.unmapped_video_questions || [];
  if (uvq.length) h += '<p class="small muted">Video questions NOT mapped to a paper row (left unmapped, not guessed): ' +
    uvq.map(u => 'video Q' + u.video_q + ' (' + esc(u.yt_topic || "—") + (u.teacher_answer ? ', answer ' + esc(String(u.teacher_answer)) : '') + (u.timestamp ? ', ~' + esc(u.timestamp) : '') + ')').join("; ") + '.</p>';
  if (yt.alignment && yt.alignment.note) h += '<p class="small muted">' + esc(yt.alignment.note) + '</p>';
  return h + '</div>';
}

async function initPaper() {
  const wrap = document.getElementById("paperDetail");
  if (!wrap) return;
  const id = getParams().get("id") || "";
  if (!id) { wrap.innerHTML = '<div class="empty">No paper selected. Go to the <a href="library.html">library</a>.</div>'; return; }
  try {
    const [paper, idx] = await Promise.all([
      loadJSON("data/papers/" + encodeURIComponent(id) + ".json"), siteIndex()]);
    let qt = null;
    try {
      const r = await fetch("data/questions_text/" + encodeURIComponent(id) + ".json");
      if (r.ok) qt = await r.json();
    } catch (e) { qt = null; }
    let yt = null;
    try {
      const r = await fetch("data/yt_analysis.json");
      if (r.ok) { const all = await r.json(); yt = all[id] || null; }
    } catch (e) { yt = null; }
    const marks = getMarks();
    const myMarks = marks[id] || {};
    const keyPresent = paper.questions.filter(q => q.key === "present").length;
    wrap.innerHTML =
      '<div class="page-hero"><p class="eyebrow">' + esc(paper.exam_display) + ' · ' + esc(paper.stage || "—") + '</p>' +
      '<h1 style="font-size:28px">' + esc(paper.id) + '</h1>' +
      '<p class="muted">' + esc(paper.date) + ' · Shift ' + esc(paper.shift) + ' · ' + esc(paper.type) +
      (paper.maths_section ? ' · Section: ' + esc(paper.maths_section) : '') +
      (paper.cycle_note ? ' · ' + esc(paper.cycle_note) : '') + '</p></div>' +
      '<div class="grid grid-4">' +
      '<div class="card"><div class="stat-num">' + paper.total + '</div><div class="stat-label">Maths questions tagged</div></div>' +
      '<div class="card"><div class="stat-num">' + paper.questions.filter(q => q.key === "present").length + '</div><div class="stat-label">With key present</div></div>' +
      '<div class="card"><div class="stat-num">' + Object.keys(myMarks).length + '</div><div class="stat-label">Your marked questions</div></div>' +
      '<div class="card"><div class="stat-num">' + esc(paper.type) + '</div><div class="stat-label">Paper type</div></div></div>' +
      '<div class="callout">' + qtNoteHTML(paper, qt) + '</div>' +
      '<div class="table-wrap"><table><thead><tr><th class="n">Q</th><th>Topic</th><th>Sub-topic</th>' +
      '<th>Concept tags</th><th>Type / Model</th><th>Difficulty</th><th>Key</th><th>Answer</th><th>Your marks</th></tr></thead><tbody>' +
      paper.questions.map(q => {
        const m = myMarks[q.n] || [];
        const btn = mark => '<button class="mark-btn' + (m.includes(mark) ? ' on' : '') +
          '" data-q="' + q.n + '" data-mark="' + mark + '">' + mark + '</button>';
        return '<tr><td class="n">' + q.n + '</td><td>' + esc(q.topic) + '</td><td>' + esc(q.sub) + '</td>' +
          '<td class="small">' + (q.tags || []).map(t => esc(t)).join(" · ") + '</td>' +
          '<td class="small">' + esc(q.type || "—") + (q.model ? '<br><span class="muted">' + esc(q.model) + '</span>' : '') + '</td>' +
          '<td><span class="badge">' + esc(q.diff) + '</span>' + (q.trick ? '<br><span class="small muted">' + esc(q.trick) + '</span>' : '') + '</td>' +
          '<td>' + esc(q.key) + '</td>' +
          '<td>' + (q.key === "present"
            ? '<button class="mark-btn" data-ans="' + esc(q.ans) + '" onclick="this.textContent=this.dataset.ans;this.disabled=true">Show</button>'
            : '<span class="muted">—</span>') + '</td>' +
          '<td>' + btn("bookmark") + btn("solved") + btn("incorrect") + btn("revision") + '</td></tr>';
      }).join("") + '</tbody></table></div>' +
      qtSectionHTML(paper, qt) +
      ytSectionHTML(paper, yt) +
      '<div id="paperRelated" style="margin-top:24px"></div>';
    window.__paperDetail = { paper, qt };
    const pb = document.getElementById("practiceBtn");
    if (pb) pb.addEventListener("click", startPractice);
    wrap.querySelectorAll("[data-mark]").forEach(b => b.addEventListener("click", () => {
      toggleMark(id, Number(b.dataset.q), b.dataset.mark);
      initPaper();
    }));
    const index = await loadJSON("data/papers_index.json");
    const mineRow = index.find(r => r.i === id);
    const mine = mineRow ? decodePaper(mineRow) : { topics: [] };
    const rel = index.map(decodePaper).filter(r => r.id !== id && r.exam === paper.exam)
      .map(r => ({ r, shared: r.topics.filter(t => (mine.topics || []).some(mt => mt.name === t.name)).length }))
      .filter(x => x.shared > 0).sort((a, b) => b.shared - a.shared).slice(0, 5);
    document.getElementById("paperRelated").innerHTML = rel.length ?
      '<h3>Related papers (same exam, shared top topics)</h3>' +
      rel.map(x => '<p><a href="paper.html?id=' + encodeURIComponent(x.r.id) + '">' + esc(x.r.id) + '</a>' +
        ' — ' + x.shared + ' shared top topics · ' + x.r.total + ' questions</p>').join("") : "";
  } catch (e) {
    wrap.innerHTML = '<div class="empty"><strong>Paper not found.</strong><p>' + esc(e.message) +
      '</p><p>Return to the <a href="library.html">library</a>.</p></div>';
  }
}
document.addEventListener("DOMContentLoaded", () => { initLibrary(); initPaper(); });
