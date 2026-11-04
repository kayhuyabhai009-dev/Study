/* learn.js — Chapter -> Topic (sub-topic) -> Concept, with explanation, steps,
   fast method and every question from that concept-tag.
   Explanations come from the hierarchy (definition + Hindi + prerequisites +
   formulas); questions come from the tag rows. The two concept systems are
   labelled, never conflated: hierarchy concepts explain, record concept-tags
   carry the questions. */
let LEARN_TOPICS = [], LEARN_FORMULAS = [], LEARN_FILE = null, LEARN_CONF = "all", LEARN_PAGE = 1;
const LEARN_PER = 50;
let LEARN_CHAPTER = null, LEARN_SUB = null, LEARN_TAG = null;
function learnQRow(q) {
  const ans = q.k === "present"
    ? '<button class="mark-btn" data-ans="' + esc(q.a) + '" onclick="this.textContent=this.dataset.ans;this.disabled=true">Show</button>'
    : '<span class="muted">—</span>';
  return '<tr><td><a href="paper.html?id=' + encodeURIComponent(q.p) + '">' + esc(q.p) + '</a></td>' +
    '<td class="n">' + q.n + ' <span class="muted small">' + (q.c ? 'C' : 'U') + '</span></td>' +
    '<td class="small">' + esc(q.ty || "—") + (q.m ? '<br><span class="muted">' + esc(q.m) + '</span>' : '') + '</td>' +
    '<td><span class="badge">' + esc(q.d) + '</span>' +
    (q.tr ? '<br><span class="small muted">' + esc(q.tr) + '</span>' : '') + '</td>' +
    '<td>' + esc(q.k) + '</td><td>' + ans + '</td></tr>';
}
function learnRenderQuestions() {
  const out = document.getElementById("learnQuestions");
  const pager = document.getElementById("learnPager");
  if (!LEARN_FILE || !LEARN_SUB) { out.innerHTML = ""; pager.innerHTML = ""; return; }
  let rows = LEARN_FILE.questions.filter(q => q.s === LEARN_SUB);
  if (LEARN_TAG) rows = rows.filter(q => (q.t || []).includes(LEARN_TAG));
  if (LEARN_CONF === "certain") rows = rows.filter(q => q.c === 1);
  if (LEARN_CONF === "uncertain") rows = rows.filter(q => q.c === 0);
  const pages = Math.max(1, Math.ceil(rows.length / LEARN_PER));
  if (LEARN_PAGE > pages) LEARN_PAGE = pages;
  const slice = rows.slice((LEARN_PAGE - 1) * LEARN_PER, LEARN_PAGE * LEARN_PER);
  document.getElementById("learnQCount").innerHTML = "<strong>" + fmt(rows.length) + " questions</strong>" +
    (LEARN_TAG ? " from concept-tag <strong>" + esc(LEARN_TAG) + "</strong>" : " in this topic") +
    " · C = certain, U = uncertain";
  out.innerHTML = slice.length ?
    '<div class="table-wrap"><table><thead><tr><th>Paper</th><th class="n">Q</th><th>Type / Model</th>' +
    '<th>Difficulty</th><th>Key</th><th>Answer</th></tr></thead><tbody>' +
    slice.map(learnQRow).join("") + '</tbody></table></div>'
    : '<div class="empty"><strong>No questions in this view.</strong></div>';
  pager.innerHTML = '<button ' + (LEARN_PAGE <= 1 ? "disabled" : "") + ' data-pg="-1">← Previous</button>' +
    '<span class="small">Page ' + LEARN_PAGE + ' of ' + pages + '</span>' +
    '<button ' + (LEARN_PAGE >= pages ? "disabled" : "") + ' data-pg="1">Next →</button>';
  pager.querySelectorAll("button[data-pg]").forEach(b => b.addEventListener("click", () => {
    LEARN_PAGE += Number(b.dataset.pg);
    learnRenderQuestions();
  }));
}
async function initLearn() {
  const wrap = document.getElementById("learnWrap");
  if (!wrap) return;
  [LEARN_TOPICS, LEARN_FORMULAS] = await Promise.all([
    loadJSON("data/topics.json"), loadJSON("data/hierarchy_formulas.json")]);
  const byId = {};
  LEARN_TOPICS.forEach(t => t.sub_topics.forEach(s => s.concepts.forEach(c => byId[c.id] = c)));
  const slugOf = name => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const chaptersEl = document.getElementById("learnChapters");
  chaptersEl.innerHTML = LEARN_TOPICS.map(t =>
    '<button class="chip" data-chapter="' + esc(t.name) + '" style="display:block;width:100%;text-align:left;margin-bottom:6px;padding:9px 12px">' +
    esc(t.name) + ' <span class="muted">(' + fmt(t.certain) + ' certain' +
    (t.certain === 0 ? ' · out of scope' : '') + ')</span></button>').join("");
  const showChapter = async (name) => {
    LEARN_CHAPTER = name;
    chaptersEl.querySelectorAll("[data-chapter]").forEach(b =>
      b.classList.toggle("on", b.dataset.chapter === name));
    const t = LEARN_TOPICS.find(x => x.name === name);
    LEARN_FILE = null;
    try { LEARN_FILE = await loadJSON("data/questions_by_topic/" + slugOf(name) + ".json"); }
    catch (e) { LEARN_FILE = null; }
    document.getElementById("learnTopics").innerHTML =
      '<h3>' + esc(t.name) + ' — topics inside this chapter</h3>' +
      (t.certain === 0 ? '<div class="callout unavail">No PYQ records for this chapter in the frozen corpus — it is out of scope, not dead. Its hierarchy concepts are still listed below for study structure.</div>' : '') +
      '<div class="chip-row">' + t.sub_topics.map(s =>
        '<button class="chip" data-sub="' + esc(s.name) + '">' + esc(s.name) +
        ' (' + fmt(s.certain) + ')</button>').join("") + '</div>' +
      '<p class="small muted" style="margin-top:8px">Counts are certain records. Click a topic to see its concepts, steps, fast method and questions.</p>';
    document.getElementById("learnDetail").innerHTML = '<p class="muted">Select a topic above.</p>';
    document.getElementById("learnQuestions").innerHTML = "";
    document.getElementById("learnQCount").innerHTML = "";
    document.getElementById("learnPager").innerHTML = "";
    document.querySelectorAll("#learnTopics [data-sub]").forEach(b =>
      b.addEventListener("click", () => showSub(t, b.dataset.sub)));
  };
  const showSub = (t, subName) => {
    LEARN_SUB = subName; LEARN_TAG = null; LEARN_PAGE = 1;
    document.querySelectorAll("#learnTopics [data-sub]").forEach(x =>
      x.classList.toggle("on", x.dataset.sub === subName));
    const s = t.sub_topics.find(x => x.name === subName);
    const conceptsHtml = s.concepts.map(c => {
      const fms = LEARN_FORMULAS.filter(f => f.topic === t.name && f.concept === c.name);
      const prereq = (c.prerequisites || []).map(id => byId[id] ? esc(byId[id].name) : esc(id)).join(" → ");
      return '<details class="accordion"><summary>' + esc(c.name) +
        ' <span class="badge">' + esc(c.difficulty) + '</span></summary>' +
        '<p><strong>Step 1 — Pehle ye seekho (prerequisites):</strong> ' + (prereq || "koi nahi — yehi se shuru karo") + '</p>' +
        '<p><strong>Step 2 — Definition (English):</strong> ' + esc(c.definition_en) + '</p>' +
        '<p><strong>Step 3 — Hindi samajh:</strong> ' + esc(c.explanation_hi) + '</p>' +
        (fms.length ? '<p><strong>Step 4 — Formulas (fast tools):</strong><br>' +
          fms.map(f => '<span class="mono" style="font-size:13px">' + esc(f.formula) + '</span>').join("<br>") + '</p>' : '') +
        '<p class="small muted">Exam mapping: ' + esc(c.exam_mapping) + '</p></details>';
    }).join("");
    let tricksHtml = "", tagsHtml = "";
    if (LEARN_FILE) {
      const rows = LEARN_FILE.questions.filter(q => q.s === subName);
      const trickCounts = {};
      const tagCounts = {};
      rows.forEach(q => {
        if (q.tr) trickCounts[q.tr] = (trickCounts[q.tr] || 0) + 1;
        (q.t || []).forEach(tag => tagCounts[tag] = (tagCounts[tag] || 0) + 1);
      });
      const topTricks = Object.entries(trickCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);
      tricksHtml = '<div class="callout"><strong>Fast method — is topic ke PYQs me dikhe shortcut labels:</strong><br>' +
        (topTricks.length ? topTricks.map(([tr, c]) => esc(tr) + ' (' + fmt(c) + ')').join(" · ")
          : 'Is topic ke questions me koi shortcut label tagged nahi hai.') +
        '<br><span class="small muted">Ye labels wahi hain jo tagging me mile — inhe concept ke formulas ke saath practice karo.</span></div>';
      tagsHtml = '<h3>Is topic se questions kis concept-tag se aaye</h3><div class="chip-row">' +
        Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).map(([tag, c]) =>
          '<button class="chip" data-tag="' + esc(tag) + '">' + esc(tag) + ' (' + fmt(c) + ')</button>').join("") + '</div>' +
        '<p class="small muted" style="margin-top:8px">Kisi tag par tap karo — us tag ke saare questions neeche dikhenge.</p>';
    } else {
      tagsHtml = '<div class="callout unavail">Is chapter ke liye koi PYQ file nahi hai — questions dikhane ke liye records chahiye, jo frozen corpus me is chapter ke liye nahi hain.</div>';
    }
    document.getElementById("learnDetail").innerHTML =
      '<p class="eyebrow">' + esc(t.name) + ' → ' + esc(subName) + '</p>' +
      '<h3>Concepts — explanation, steps, formulas</h3>' + (conceptsHtml || '<p class="muted">Is topic ke neeche hierarchy me koi concept listed nahi hai.</p>') +
      tricksHtml + tagsHtml;
    document.querySelectorAll("#learnDetail [data-tag]").forEach(b =>
      b.addEventListener("click", () => {
        document.querySelectorAll("#learnDetail [data-tag]").forEach(x => x.classList.toggle("on", x === b));
        LEARN_TAG = b.dataset.tag; LEARN_PAGE = 1;
        learnRenderQuestions();
      }));
    if (LEARN_FILE) learnRenderQuestions();
  };
  chaptersEl.querySelectorAll("[data-chapter]").forEach(b =>
    b.addEventListener("click", () => showChapter(b.dataset.chapter)));
  document.querySelectorAll("#learnConf .chip").forEach(b => b.addEventListener("click", () => {
    LEARN_CONF = b.dataset.conf;
    document.querySelectorAll("#learnConf .chip").forEach(x => x.classList.toggle("on", x === b));
    LEARN_PAGE = 1;
    learnRenderQuestions();
  }));
  /* डीप-लिंक: ?chapter=<topic name> — मुख्य website से सीधे किसी chapter पर आना */
  let first = LEARN_TOPICS[0].name;
  try {
    const want = new URLSearchParams(location.search).get("chapter");
    if (want && LEARN_TOPICS.some(t => t.name === want)) first = want;
  } catch (e) {}
  await showChapter(first);
}
document.addEventListener("DOMContentLoaded", initLearn);
