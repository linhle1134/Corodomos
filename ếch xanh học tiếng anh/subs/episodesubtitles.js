// subs/episodesubtitles.js
// Loader phụ đề theo tập (S01E01..S01E05) + chuẩn hoá dữ liệu
(function () {
  const MAP = {
    "S01E01": "subs/suite-life_s01e01_complete.json",
    "S01E02": "subs/suite-life_s01e02_complete.json",
    "S01E03": "subs/suite-life_s01e03_complete.json",
    "S01E04": "subs/suite-life_s01e04_complete.json",
    "S01E05": "subs/suite-life_s01e05_complete.json",
  };

  // --- Helpers ---
  function timeToSec(t) {
    if (!t) return 0;
    const s = String(t).trim().replace(",", ".");
    const parts = s.split(":").map(Number);
    if (parts.length === 3) return parts[0]*3600 + parts[1]*60 + parts[2];
    if (parts.length === 2) return parts[0]*60 + parts[1];
    return Number(s) || 0;
  }

  // Chuyển nhiều dạng về {start, end, en, vi}
  function normalizeLine(line) {
    // JSON tối giản: {start,end,text}
    if ("start" in line && "end" in line) {
      return {
        start: +line.start,
        end: +line.end,
        en: line.text || line.en || "",
        vi: line.vi || ""
      };
    }
    // Dạng có time string: {time:"00:03 -> 00:07", en, vi}
    if ("time" in line) {
      const [a, b] = String(line.time).split(/\s*->\s*/);
      return { start: timeToSec(a), end: timeToSec(b), en: line.en || "", vi: line.vi || "" };
    }
    return null;
  }

  // Cache đơn giản để không fetch lại
  const cache = new Map();

  async function loadEpisodeSubtitles(key) {
    if (cache.has(key)) return cache.get(key);
    const url = MAP[key];
    if (!url) throw new Error("Unknown episode key: " + key);

    const resp = await fetch(url);
    if (!resp.ok) throw new Error("Cannot load subtitles: " + url);
    const raw = await resp.json();

    // raw có thể là array lines hoặc wrapper {lines:[...]}
    const arr = Array.isArray(raw) ? raw : (raw.lines || []);
    const norm = arr.map(normalizeLine).filter(Boolean);

    cache.set(key, norm);
    return norm;
  }

  // Xuất ra global
  window.SubLoader = { loadEpisodeSubtitles };
})();

// ---- THÊM VÀO episodesubtitles.js ----
(function(){
  function srtTimeToSec(t){
    const s = String(t).trim().replace(',', '.');
    const p = s.split(':').map(Number);
    if (p.length === 3) return p[0]*3600 + p[1]*60 + p[2];
    if (p.length === 2) return p[0]*60 + p[1];
    return Number(s)||0;
  }
  function parseSrt(srt, {keepTags=false}={}){
    const blocks = srt.replace(/\r\n?/g,'\n').trim().split(/\n{2,}/);
    const out = [];
    for (let b of blocks){
      let lines = b.split('\n').map(x=>x.trim()).filter(Boolean);
      if (!lines.length) continue;
      if (/^\d+$/.test(lines[0])) lines = lines.slice(1);     // bỏ chỉ số
      const m = lines[0].match(/(\d{2}:\d{2}:\d{2}[,.]\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}[,.]\d{3})/);
      if (!m) continue;
      const start = srtTimeToSec(m[1]);
      const end   = srtTimeToSec(m[2]);
      const textLines = lines.slice(1);
      const text = textLines
        .map(x => keepTags ? x : x.replace(/<[^>]+>/g,''))
        .join(' ')
        .replace(/\s+/g,' ')
        .trim();
      if (text) out.push({ start, end, en: text });
    }
    return out;
  }
  async function loadSRT(url){
    const srt = await fetch(url).then(r=>r.text());
    return parseSrt(srt);
  }
  // public API:
  window.SubLoader.loadSRT = loadSRT;
})();
