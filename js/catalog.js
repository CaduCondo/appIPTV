/* Cinema Livre — leitura e normalização de listas (sem navegador: testável no Node). */
(function (root) {
  function yearOf(s) { var m = /[\(\[](19\d\d|20\d\d)[\)\]]/.exec(s || ''); return m ? Number(m[1]) : null; }
  function cleanName(s) { return String(s || '').replace(/\s*[\(\[](19\d\d|20\d\d)[\)\]]\s*$/, '').trim(); }
  function rate(r, r5) {
    var v = parseFloat(r);
    if (!(v > 0 && v <= 10)) { v = parseFloat(r5); v = v > 0 ? v * 2 : null; }
    return v ? Math.round(v * 10) / 10 : null;
  }
  function normServer(s) {
    s = String(s || '').trim().replace(/\/+$/, '');
    if (!/^https?:\/\//i.test(s)) s = 'http://' + s;
    return s;
  }

  /* raw: respostas do painel Xtream já em JSON */
  function normalizeXtream(raw) {
    var ui = raw.userInfo || {};
    function arr(a) { return Array.isArray(a) ? a : []; }
    function cats(a) { return arr(a).map(function (c) { return { id: String(c.category_id), name: c.category_name }; }); }
    var movie = arr(raw.vod).map(function (x) {
      return { id: String(x.stream_id), n: cleanName(x.name), y: yearOf(x.name) || (parseInt(x.year, 10) || null), r: rate(x.rating, x.rating_5based), p: x.stream_icon || '', c: String(x.category_id || ''), a: Number(x.added) || 0, e: x.container_extension || 'mp4' };
    });
    var series = arr(raw.series).map(function (x) {
      return { id: String(x.series_id), n: cleanName(x.name), y: yearOf(x.name) || yearOf(x.releaseDate) || (parseInt(String(x.releaseDate || x.release_date || '').slice(0, 4), 10) || null), r: rate(x.rating, x.rating_5based), p: x.cover || '', c: String(x.category_id || ''), a: Number(x.last_modified) || 0 };
    });
    var live = arr(raw.live).map(function (x) {
      return { id: String(x.stream_id), n: x.name, p: x.stream_icon || '', c: String(x.category_id || ''), a: Number(x.added) || 0 };
    });
    return {
      meta: { kind: 'xtream', server: raw.server, user: raw.user, pass: raw.pass, name: raw.user, status: ui.status === 'Active' ? 'Ativa' : ui.status === 'Expired' ? 'Vencida' : (ui.status || ''), exp: Number(ui.exp_date) || 0 },
      movie: movie, series: series, live: live,
      cats: { movie: cats(raw.catMovie), series: cats(raw.catSeries), live: cats(raw.catLive) }
    };
  }

  function parseM3U(text, name) {
    var lines = String(text).split(/\r?\n/), movie = [], tv = [], shows = {}, cats = { movie: {}, series: {}, live: {} };
    var cur = null, n = 0;
    function attr(s, k) { var m = new RegExp(k + '="([^"]*)"', 'i').exec(s); return m ? m[1] : ''; }
    function cat(type, g) { g = g || 'Sem categoria'; cats[type][g] = true; return g; }
    for (var i = 0; i < lines.length; i++) {
      var l = lines[i].trim();
      if (!l) continue;
      if (l.indexOf('#EXTINF') === 0) {
        var comma = l.lastIndexOf(',');
        cur = { name: (comma >= 0 ? l.slice(comma + 1) : '').trim() || attr(l, 'tvg-name'), logo: attr(l, 'tvg-logo'), group: attr(l, 'group-title') };
      } else if (l.charAt(0) !== '#' && cur) {
        var url = l, g = cur.group, gl = g.toLowerCase(), type;
        if (/\/series\//i.test(url) || /s[ée]rie|temporada/i.test(gl)) type = 'series';
        else if (/\/movie\//i.test(url) || /film|movie|vod|cinema/i.test(gl) || /\.(mp4|mkv|avi)(\?|$)/i.test(url)) type = 'movie';
        else type = 'live';
        n++;
        if (type === 'series') {
          var m = /^(.*?)[\s._-]*S(\d{1,2})\s*E(\d{1,3})/i.exec(cur.name);
          var show = m ? m[1].trim() : cur.name, season = m ? String(parseInt(m[2], 10)) : '1', ep = m ? parseInt(m[3], 10) : 1;
          var key = (g + '|' + show).toLowerCase();
          if (!shows[key]) shows[key] = { id: 'm' + n, n: cleanName(show), y: yearOf(show), r: null, p: cur.logo, c: cat('series', g), a: n, eps: {} };
          (shows[key].eps[season] = shows[key].eps[season] || []).push({ id: 'e' + n, num: ep, title: cur.name, u: url, img: cur.logo });
        } else if (type === 'movie') {
          movie.push({ id: 'm' + n, n: cleanName(cur.name), y: yearOf(cur.name), r: null, p: cur.logo, c: cat('movie', g), a: n, u: url });
        } else {
          tv.push({ id: 'l' + n, n: cur.name, p: cur.logo, c: cat('live', g), a: n, u: url });
        }
        cur = null;
      }
    }
    function toCats(o) { return Object.keys(o).map(function (k) { return { id: k, name: k }; }); }
    return {
      meta: { kind: 'm3u', name: name || 'Lista M3U', status: '', exp: 0 },
      movie: movie, series: Object.keys(shows).map(function (k) { return shows[k]; }), live: tv,
      cats: { movie: toCats(cats.movie), series: toCats(cats.series), live: toCats(cats.live) }
    };
  }

  var K = { yearOf: yearOf, cleanName: cleanName, rate: rate, normServer: normServer, normalizeXtream: normalizeXtream, parseM3U: parseM3U };
  if (typeof module !== 'undefined' && module.exports) module.exports = K; else root.CLCatalog = K;
})(typeof window !== 'undefined' ? window : globalThis);
