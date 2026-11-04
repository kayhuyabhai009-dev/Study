/* charts.js — dependency-free SVG charts with native tooltips. */
const CHART_COLORS = ["#B98A2F", "#1F6F5B", "#3E6B8E", "#7A4E6D", "#C26A2E"];
function barRows(el, rows, maxLabel) {
  const max = Math.max(...rows.map(r => r.value), 1);
  el.innerHTML = rows.map((r, i) => {
    const w = (100 * r.value / max).toFixed(1);
    const cls = ["", " t2", " t3", " t4", " t5"][i % 5];
    return '<div class="bar-row"><span>' + esc(r.label) + '</span>' +
      '<div class="bar-track"><div class="bar-fill' + cls + '" style="width:' + w + '%" title="' +
      esc(r.label) + ': ' + fmt(r.value) + (r.share != null ? ' (' + r.share + ')' : '') + '"></div></div>' +
      '<span class="num" style="text-align:right">' + fmt(r.value) + '</span></div>';
  }).join("");
}
function donut(el, parts, total) {
  let off = 25, out = "";
  parts.forEach((p, i) => {
    const frac = total ? p.value / total : 0;
    const len = frac * 100;
    out += '<circle cx="42" cy="42" r="15.915" fill="none" stroke="' + CHART_COLORS[i % 5] +
      '" stroke-width="6" stroke-dasharray="' + len.toFixed(1) + ' 100" stroke-dashoffset="' + off.toFixed(1) +
      '" transform="rotate(-90 42 42)"><title>' + esc(p.label) + ': ' + fmt(p.value) + '</title></circle>';
    off -= len;
  });
  el.innerHTML = '<svg viewBox="0 0 84 84" width="150" height="150">' + out +
    '<text x="42" y="40" text-anchor="middle" font-size="13" font-weight="600" fill="var(--ink)">' + fmt(total) + '</text>' +
    '<text x="42" y="53" text-anchor="middle" font-size="8" fill="var(--muted)">records</text></svg>' +
    '<div style="font-size:13px">' + parts.map((p, i) =>
      '<div><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:' +
      CHART_COLORS[i % 5] + '"></span> ' + esc(p.label) + ' — ' + fmt(p.value) + '</div>').join("") + '</div>';
  el.style.display = "flex"; el.style.alignItems = "center"; el.style.gap = "16px";
}
function sparkline(el, values, labels) {
  const w = 260, h = 64, max = Math.max(...values, 1), min = Math.min(...values, 0);
  const pts = values.map((v, i) => {
    const x = (i / Math.max(values.length - 1, 1)) * (w - 8) + 4;
    const y = h - 6 - ((v - min) / (max - min || 1)) * (h - 14);
    return x.toFixed(1) + "," + y.toFixed(1);
  }).join(" ");
  el.innerHTML = '<svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" style="display:block">' +
    '<polyline points="' + pts + '" fill="none" stroke="#B98A2F" stroke-width="2" stroke-linejoin="round"/>' +
    values.map((v, i) => {
      const x = (i / Math.max(values.length - 1, 1)) * (w - 8) + 4;
      const y = h - 6 - ((v - min) / (max - min || 1)) * (h - 14);
      return '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="3" fill="#1F6F5B"><title>' +
        esc(labels[i]) + ': ' + fmt(v) + '</title></circle>';
    }).join("") + '</svg>';
}
