/* important.js — Topic -> Concept -> every question from that concept.
   Question lists come from data/questions_by_topic/<slug>.json (tag rows only:
   paper + question number + tags + type + difficulty + key status + bare answer).
   No question wording is reproduced anywhere on this site. */
let IMP_IDX = [], IMP_FILE = null, IMP_TAG = null, IMP_CONF = "all", IMP_PAGE = 1;
const IMP_PER = 50;
function qRow(q) {
  const ans = q.k === "present"
    ? '<button class="mark-btn" data-ans="' + esc(q.a) + '" onclick="this.textContent=this.dataset.ans;this.disabled=true">Show</button>'
    : '<span class="muted">—</span>';
  return '<tr><td><a href="paper.html?id=' + encodeURIComponent(q.p) + '">' + esc(q.p) + '</a></td>' +
    '<td class="n">' + q.n + ' <span class="muted small">' + (q.c ? 'C' : 'U') + '</span></td>' +
    '<td>' + esc(q.s) + '</td><td class="small">' + esc(q.ty || "—") +
    (q.m ? '<br><span class="muted">' + esc(q.m) + '</span>' : '') + '</td>' +
    '<td><span class="badge">' + esc(q.d) + '</span>' +
    (q.tr ? '<br><span class="small muted">' + esc(q.tr) + '</span>' : '') + '</td>' +
    '<td>' + esc(q.k) + '</td><td>' + ans + '</td></tr>';
}
function qTable(rows, pageEl, pagerEl) {
  const pages = Math.max(1, Math.ceil(rows.length / IMP_PER));
  if (IMP_PAGE > pages) IMP_PAGE = pages;
  const slice = rows.slice((IMP_PAGE - 1) * IMP_PER, IMP_PAGE * IMP_PER);
  pageEl.innerHTML = slice.length ?
    '<div class="table-wrap"><table><thead><tr><th>Paper</th><th class="n">Q</th><th>Sub-topic</th>' +
    '<th>Type / Model</th><th>Difficulty</th><th>Key</th><th>Answer</th></tr></thead><tbody>' +
    slice.map(qRow).join("") + '</tbody></table></div>' +
    '<p class="small muted">Showing ' + slice.length + ' of ' + fmt(rows.length) +
    ' questions · C = certain, U = uncertain · answers are bare values from the paper\u2019s own key, behind a toggle.</p>'
    : '<div class="empty"><strong>No questions in this view.</strong></div>';
  pagerEl.innerHTML = '<button ' + (IMP_PAGE <= 1 ? "disabled" : "") + ' data-pg="-1">← Previous</button>' +
    '<span class="small">Page ' + IMP_PAGE + ' of ' + pages + '</span>' +
    '<button ' + (IMP_PAGE >= pages ? "disabled" : "") + ' data-pg="1">Next →</button>';
  pagerEl.querySelectorAll("button[data-pg]").forEach(b => b.addEventListener("click", () => {
    IMP_PAGE += Number(b.dataset.pg);
    renderImpQuestions();
  }));
}
function impFiltered() {
  if (!IMP_FILE) return [];
  let rows = IMP_FILE.questions;
  if (IMP_TAG) rows = rows.filter(q => (q.t || []).includes(IMP_TAG));
  if (IMP_CONF === "certain") rows = rows.filter(q => q.c === 1);
  if (IMP_CONF === "uncertain") rows = rows.filter(q => q.c === 0);
  return rows;
}
function renderImpQuestions() {
  const rows = impFiltered();
  document.getElementById("impCount").innerHTML =
    "<strong>" + fmt(rows.length) + " questions</strong>" +
    (IMP_TAG ? " from concept <strong>" + esc(IMP_TAG) + "</strong>" : " in this topic") +
    (IMP_CONF !== "all" ? " (" + IMP_CONF + " only)" : "");
  qTable(rows, document.getElementById("impQuestions"), document.getElementById("impPager"));
}
async function initImportant() {
  const wrap = document.getElementById("impWrap");
  if (!wrap) return;
  IMP_IDX = await loadJSON("data/important_index.json");
  const sel = document.getElementById("impTopic");
  sel.innerHTML = IMP_IDX.map(t => '<option value="' + esc(t.slug) + '">' + esc(t.topic) +
    ' — ' + fmt(t.total) + ' questions</option>').join("");
  /* डीप-लिंक: ?topic=<slug> — मुख्य website से सीधे किसी topic पर आना */
  try {
    const want = new URLSearchParams(location.search).get("topic");
    if (want && IMP_IDX.some(x => x.slug === want)) sel.value = want;
  } catch (e) {}
  const showTopic = async () => {
    const t = IMP_IDX.find(x => x.slug === sel.value);
    IMP_FILE = null; IMP_TAG = null; IMP_PAGE = 1;
    document.getElementById("impTags").innerHTML =
      '<h3>' + esc(t.topic) + '</h3><p class="small muted">' + fmt(t.total) + ' tag rows · ' +
      fmt(t.certain) + ' certain · ' + t.tags.length + ' concept tags · ' +
      'every record in this topic carries concept tags.</p>' +
      '<div class="chip-row">' +
      '<button class="chip on" data-tag="">All questions</button>' +
      t.tags.map(([tag, c]) => '<button class="chip" data-tag="' + esc(tag) + '">' + esc(tag) +
        ' (' + fmt(c) + ')</button>').join("") + '</div>' +
      '<p class="small muted" style="margin-top:8px">Tag counts count tag occurrences — one question can carry more than one tag, so tag counts can sum above the question total.</p>';
    document.getElementById("impTags").querySelectorAll("[data-tag]").forEach(b =>
      b.addEventListener("click", async () => {
        document.querySelectorAll("#impTags [data-tag]").forEach(x => x.classList.toggle("on", x === b));
        IMP_TAG = b.dataset.tag || null; IMP_PAGE = 1;
        if (!IMP_FILE) IMP_FILE = await loadJSON("data/questions_by_topic/" + t.slug + ".json");
        renderImpQuestions();
      }));
    document.getElementById("impCount").innerHTML = '<p class="muted">Select a concept above to see its questions, or "All questions" for the whole topic.</p>';
    document.getElementById("impQuestions").innerHTML = "";
    document.getElementById("impPager").innerHTML = "";
  };
  sel.addEventListener("change", showTopic);
  document.querySelectorAll("#impConf .chip").forEach(b => b.addEventListener("click", () => {
    IMP_CONF = b.dataset.conf;
    document.querySelectorAll("#impConf .chip").forEach(x => x.classList.toggle("on", x === b));
    IMP_PAGE = 1;
    if (IMP_FILE) renderImpQuestions();
  }));
  await showTopic();
}
document.addEventListener("DOMContentLoaded", initImportant);
