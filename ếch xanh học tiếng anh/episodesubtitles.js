// subs/episodesubtitles.js
// Loader phụ đề theo tập (S01E01..S01E05) + chuẩn hoá dữ liệu
(function () {
  const MAP = {
    "S01E01": "subs/suite-life_s01e01.json",
    "S01E02": "subs/suite-life_s01e02.json",
    "S01E03": "subs/suite-life_s01e03.json",
    "S01E04": "subs/suite-life_s01e04.json",
    "S01E05": "subs/suite-life_s01e05.json"
  };

  function timeToSec(t) {
    if (!t) return 0;
    const s = String(t).trim().replace(",", ".");
    const parts = s.split(":").map(Number);
    if (parts.length === 3) return parts[0]*3600 + parts[1]*60 + parts[2];
    if (parts.length === 2) return parts[0]*60 + parts[1];
    return Number(s) || 0;
  }

  function normalizeLine(line) {
    if ("start" in line && "end" in line) {
      return { start:+line.start, end:+line.end, en: line.text || line.en || "", vi: line.vi || "" };
    }
    if ("time" in line) {
      const [a,b] = String(line.time).split(/\s*->\s*/);
      return { start: timeToSec(a), end: timeToSec(b), en: line.en || "", vi: line.vi || "" };
    }
    return null;
  }

  const cache = new Map();

  async function loadEpisodeSubtitles(key) {
    if (cache.has(key)) return cache.get(key);
    const url = MAP[key];
    if (!url) throw new Error("Unknown episode key: " + key);
    const resp = await fetch(url);
    if (!resp.ok) throw new Error("Cannot load subtitles: " + url);
    const raw = await resp.json();
    const arr = Array.isArray(raw) ? raw : (raw.lines || []);
    const norm = arr.map(normalizeLine).filter(Boolean);
    cache.set(key, norm);
    return norm;
  }

  window.SubLoader = { loadEpisodeSubtitles };
})();
