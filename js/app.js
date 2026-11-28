/* CineHomeTV — núcleo do app: armazenamento, importação de listas, perfis, histórico, navegação. */
(function () {
  var CL = (window.CL = {});
  var LS = window.localStorage;

  /* ---------- armazenamento pequeno (localStorage) ---------- */
  CL.get = function (k, d) {
    try { var v = LS.getItem('cl.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; }
  };
  CL.set = function (k, v) { try { LS.setItem('cl.' + k, JSON.stringify(v)); } catch (e) {} };
  CL.del = function (k) { try { LS.removeItem('cl.' + k); } catch (e) {} };
  CL.uid = function () { return Math.random().toString(36).slice(2, 10); };
  CL.deviceCode = function () {
    var c = CL.get('device');
    if (!c) { c = String(Math.floor(100000 + Math.random() * 900000)); CL.set('device', c); }
    return c;
  };

  /* ---------- catálogo grande (IndexedDB) ---------- */
  var dbp;
  function db() {
    if (dbp) return dbp;
    dbp = new Promise(function (res, rej) {
      var r = indexedDB.open('cinemalivre', 1);
      r.onupgradeneeded = function () { r.result.createObjectStore('kv'); };
      r.onsuccess = function () { res(r.result); };
      r.onerror = function () { rej(r.error); };
    });
    return dbp;
  }
  function tx(mode, fn) {
    return db().then(function (d) {
      return new Promise(function (res, rej) {
        var t = d.transaction('kv', mode), store = t.objectStore('kv'), out = fn(store);
        t.oncomplete = function () { res(out && out.result); };
        t.onerror = function () { rej(t.error); };
      });
    });
  }
  CL.idbGet = function (k) { return tx('readonly', function (s) { return s.get(k); }); };
  CL.idbSet = function (k, v) { return tx('readwrite', function (s) { return s.put(v, k); }); };
  CL.idbClear = function () { return tx('readwrite', function (s) { return s.clear(); }); };

  /* ---------- rede (proxy local quando existir) ---------- */
  CL.served = location.protocol.indexOf('http') === 0;
  CL.hasProxy = false;
  CL.ready = CL.served
    ? fetch('/proxy?ping=1').then(function (r) { return r.text(); }).then(function (t) { CL.hasProxy = t === 'ok'; }).catch(function () {})
    : Promise.resolve();

  function getText(url) {
    return CL.ready.then(function () {
      var target = CL.hasProxy ? '/proxy?url=' + encodeURIComponent(url) : url;
      return fetch(target).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
      });
    });
  }
  function getJson(url) {
    return getText(url).then(function (t) {
      try { return JSON.parse(t); } catch (e) { throw new Error('Resposta inválida do servidor.'); }
    });
  }
  CL.netError = function (e) {
    var m = (e && e.message) || '';
    if (/HTTP 4(01|03)/.test(m)) return 'O servidor recusou o acesso. Confira usuário e senha.';
    if (/HTTP/.test(m)) return 'O servidor respondeu com erro (' + m + ').';
    if (/inválida/.test(m)) return m.replace(/^inválida:\s*/, '');
    if (!CL.hasProxy) return 'O navegador bloqueou o acesso ao servidor da lista. Abra o app pelo iniciar.bat (servidor local) ou importe um arquivo .m3u.';
    return 'Não consegui falar com o servidor. Confira o endereço e a internet.';
  };

  /* ---------- utilidades de catálogo ---------- */
  function enc(s) { return encodeURIComponent(s); }
  var K = window.CLCatalog;
  var normServer = K.normServer;
  function byAddedDesc(a, b) { return (b.a || 0) - (a.a || 0); }
  CL.cleanName = K.cleanName;

  /* ---------- importar: Xtream ---------- */
  CL.importXtream = function (server, user, pass, progress) {
    server = normServer(server);
    var base = server + '/player_api.php?username=' + enc(user) + '&password=' + enc(pass);
    var say = progress || function () {};
    function api(a) { return getJson(base + '&action=' + a).catch(function () { return []; }); }
    say('Verificando usuário e senha…');
    return getJson(base).then(function (auth) {
      var ui = auth && auth.user_info;
      if (!ui || ui.auth === 0 || ui.auth === '0') throw new Error('inválida: Usuário ou senha incorretos.');
      say('Baixando categorias…');
      return Promise.all([api('get_vod_categories'), api('get_series_categories'), api('get_live_categories')]).then(function (c) {
        say('Baixando filmes…');
        return api('get_vod_streams').then(function (vod) {
          say('Baixando séries…');
          return api('get_series').then(function (ser) {
            say('Baixando canais…');
            return api('get_live_streams').then(function (live) {
              say('Organizando…');
              return K.normalizeXtream({ userInfo: ui, server: server, user: user, pass: pass, vod: vod, series: ser, live: live, catMovie: c[0], catSeries: c[1], catLive: c[2] });
            });
          });
        });
      });
    });
  };

  /* ---------- importar: M3U (texto) ---------- */
  CL.parseM3U = K.parseM3U;

  /* Aceita link M3U: se for get.php com usuário e senha, usa o fluxo Xtream (mais completo). */
  CL.importUrl = function (url, progress) {
    url = String(url || '').trim();
    var m = /^(https?:\/\/[^\/]+)\/(?:get|player_api)\.php\?(.*)$/i.exec(url);
    if (m) {
      var q = new URLSearchParams(m[2]), u = q.get('username'), p = q.get('password');
      if (u && p) return CL.importXtream(m[1], u, p, progress);
    }
    if (progress) progress('Baixando a lista…');
    return getText(url).then(function (t) {
      if (t.indexOf('#EXTM3U') < 0 && t.indexOf('#EXTINF') < 0) throw new Error('inválida: O link não devolveu uma lista M3U.');
      return K.parseM3U(t, 'Lista M3U');
    });
  };

  /* Grava o catálogo importado. */
  CL.saveCatalog = function (data) {
    data.meta.updated = Date.now();
    data.meta.counts = { movie: data.movie.length, series: data.series.length, live: data.live.length };
    data.meta.recent = {
      movie: data.movie.slice().sort(byAddedDesc).slice(0, 24),
      series: data.series.slice().sort(byAddedDesc).slice(0, 24).map(function (s) { var o = {}; for (var k in s) if (k !== 'eps') o[k] = s[k]; return o; })
    };
    return CL.idbClear().then(function () {
      return Promise.all([CL.idbSet('movie', data.movie), CL.idbSet('series', data.series), CL.idbSet('live', data.live), CL.idbSet('cats', data.cats)]);
    }).then(function () { CL.set('meta', data.meta); CL.set('detail', {}); });
  };
  CL.meta = function () { return CL.get('meta', null); };
  CL.hasList = function () { return !!CL.meta(); };
  CL.loadKind = function (kind) { return CL.idbGet(kind).then(function (v) { return v || []; }); };
  CL.loadCats = function () { return CL.idbGet('cats').then(function (v) { return v || { movie: [], series: [], live: [] }; }); };
  CL.reload = function (progress) {
    var m = CL.meta();
    if (!m) return Promise.reject(new Error('inválida: Nenhuma lista importada.'));
    if (m.kind === 'xtream') return CL.importXtream(m.server, m.user, m.pass, progress).then(CL.saveCatalog);
    return Promise.reject(new Error('inválida: Listas de arquivo precisam ser importadas de novo.'));
  };
  CL.signOut = function () { CL.del('meta'); CL.del('detail'); return CL.idbClear(); };

  /* URL de reprodução */
  CL.streamUrl = function (type, item, ep) {
    var m = CL.meta() || {};
    if (ep && ep.u) return ep.u;
    if (item && item.u) return item.u;
    if (m.kind !== 'xtream') return '';
    var b = m.server + '/', cred = enc(m.user) + '/' + enc(m.pass) + '/';
    if (type === 'movie') return b + 'movie/' + cred + item.id + '.' + (item.e || 'mp4');
    if (type === 'live') return b + 'live/' + cred + item.id + '.m3u8';
    if (type === 'series' && ep) return b + 'series/' + cred + ep.id + '.' + (ep.ext || 'mp4');
    return '';
  };

  /* Detalhes (plot, elenco, episódios) — Xtream sob demanda; cache simples */
  CL.fetchInfo = function (type, item) {
    var m = CL.meta();
    if (!m || m.kind !== 'xtream') return Promise.resolve(null);
    var cache = CL.get('detail', {}), key = type + ':' + item.id;
    if (cache[key]) return Promise.resolve(cache[key]);
    var base = m.server + '/player_api.php?username=' + enc(m.user) + '&password=' + enc(m.pass);
    var url = type === 'movie' ? base + '&action=get_vod_info&vod_id=' + item.id : base + '&action=get_series_info&series_id=' + item.id;
    return getJson(url).then(function (d) {
      var info = d.info || {}, out = {
        plot: info.plot || info.description || '', cast: info.cast || info.actors || '', genre: info.genre || '',
        director: info.director || '', date: info.releasedate || info.releaseDate || '', backdrop: (info.backdrop_path && info.backdrop_path[0]) || '',
        r: K.rate(info.rating, info.rating_5based), duration: info.duration || ''
      };
      if (type === 'series') {
        var seasons = {};
        var eps = d.episodes || {};
        Object.keys(eps).forEach(function (s) {
          seasons[s] = (eps[s] || []).map(function (e) {
            return { id: String(e.id), num: Number(e.episode_num) || 0, title: e.title || ('Episódio ' + e.episode_num), ext: e.container_extension || 'mp4', img: (e.info && e.info.movie_image) || '', plot: (e.info && e.info.plot) || '' };
          });
        });
        out.eps = seasons;
      }
      cache[key] = out;
      var keys = Object.keys(cache);
      if (keys.length > 40) delete cache[keys[0]];
      CL.set('detail', cache);
      return out;
    });
  };

  /* ---------- conta (login) ---------- */
  CL.auth = new window.CLAuth.ServicoAuth({ storage: LS });
  /** Código do aparelho: gerado na instalação (o MAC não pode ser lido por navegador nem pelo Android atual). */
  CL.deviceId = function () {
    var d = CL.get('deviceid');
    if (!d) { d = 'ap-' + CL.uid() + CL.uid(); CL.set('deviceid', d); }
    return d;
  };
  CL.isAdmin = function () { var s = CL.auth.sessao(); return !!s && s.papel === 'admin'; };
  CL.usuario = function () { var s = CL.auth.sessao(); return s ? s.usuario : null; };
  /** Mantém o aparelho "online" (batimento a cada 30 s). Se foi derrubado, volta ao login. */
  CL.startHeartbeat = function () {
    if (CL._hb) return;
    CL._hb = setInterval(function () {
      if (!CL.auth.batimento()) { clearInterval(CL._hb); CL.auth.sair().then(function () { location.replace('entrar.html?derrubado=1'); }); }
    }, 30000);
  };
  CL.logout = function () { return CL.auth.sair().then(function () { location.href = 'entrar.html'; }); };

  /* ---------- perfis (guardados por usuário) ---------- */
  function uk(s) { return 'u.' + (CL.usuario() || 'x') + '.' + s; }
  CL.profiles = function () { return CL.get(uk('profiles'), []); };
  CL.addProfile = function (name, color) {
    var l = CL.profiles(), p = { id: CL.uid(), name: name, color: color || 'brand' };
    l.push(p); CL.set(uk('profiles'), l); return p;
  };
  CL.updateProfile = function (id, name, color) {
    CL.set(uk('profiles'), CL.profiles().map(function (p) { return p.id === id ? { id: id, name: name, color: color } : p; }));
  };
  CL.removeProfile = function (id) {
    CL.set(uk('profiles'), CL.profiles().filter(function (p) { return p.id !== id; }));
    CL.del('p.' + id + '.fav'); CL.del('p.' + id + '.hist');
    if (CL.activeId() === id) CL.del(uk('active'));
  };
  CL.activeId = function () { return CL.get(uk('active')); };
  CL.setActive = function (id) { CL.set(uk('active'), id); };
  CL.profile = function () {
    var id = CL.activeId(); return CL.profiles().filter(function (p) { return p.id === id; })[0] || null;
  };

  /* favoritos e histórico são do perfil ativo */
  function pk(s) { var p = CL.profile(); return 'p.' + (p ? p.id : 'x') + '.' + s; }
  CL.favs = function () { return CL.get(pk('fav'), []); };
  CL.isFav = function (t, id) { return CL.favs().indexOf(t + ':' + id) >= 0; };
  CL.toggleFav = function (t, id) {
    var f = CL.favs(), k = t + ':' + id, i = f.indexOf(k);
    if (i >= 0) f.splice(i, 1); else f.push(k);
    CL.set(pk('fav'), f); return i < 0;
  };
  CL.history = function () {
    var h = CL.get(pk('hist'), {});
    return Object.keys(h).map(function (k) { return h[k]; }).sort(function (a, b) { return b.at - a.at; });
  };
  /* e: {key, t, id, title, p, pos, dur, ep:{s,n}} */
  CL.saveProgress = function (e) {
    var h = CL.get(pk('hist'), {});
    e.at = Date.now(); h[e.key] = e;
    var keys = Object.keys(h);
    if (keys.length > 60) {
      keys.sort(function (a, b) { return h[a].at - h[b].at; });
      keys.slice(0, keys.length - 60).forEach(function (k) { delete h[k]; });
    }
    CL.set(pk('hist'), h);
  };
  CL.progressOf = function (key) {
    var e = CL.get(pk('hist'), {})[key];
    return e && e.dur ? Math.min(100, Math.round((e.pos / e.dur) * 100)) : 0;
  };

  /* ---------- páginas ---------- */
  CL.q = function (k) { return new URLSearchParams(location.search).get(k); };
  CL.go = function (page) { location.href = page; };
  /**
   * Protege a página: exige login, lista carregada e (opcionalmente) perfil escolhido.
   * A conferência de verdade é do servidor; aqui é só para levar a pessoa ao lugar certo.
   */
  CL.guard = function (needProfile) {
    if (!CL.auth.sessao()) { location.replace('entrar.html'); return false; }
    if (!CL.hasList()) { location.replace(CL.isAdmin() ? 'lista.html' : 'entrar.html'); return false; }
    if (needProfile && !CL.profile()) { location.replace('perfis.html'); return false; }
    CL.startHeartbeat();
    return true;
  };
  /**
   * Responsividade: escolhe o regime da tela (tv | tablet | phone, ver CLRules.regimeDeTela),
   * marca em <html data-layout="..."> (o CSS usa isso) e, só na TV, amplia o desenho de 1280 px.
   */
  CL.layout = function () {
    var R = window.CLRules, w = window.innerWidth, hgt = window.innerHeight;
    var regime = R.regimeDeTela(w, hgt), z = regime === 'tv' ? R.fatorDeZoom(w) : 1;
    var antes = document.documentElement.getAttribute('data-layout');
    document.documentElement.setAttribute('data-layout', regime);
    document.documentElement.style.setProperty('--z', z);
    var els = document.querySelectorAll('.page');
    for (var i = 0; i < els.length; i++) {
      els[i].style.zoom = regime === 'tv' ? z : '';
      els[i].style.minHeight = (hgt / z) + 'px';
    }
    if (antes !== regime) window.dispatchEvent(new Event('cl-layout'));
  };
  CL.fit = CL.layout;
  CL.layout();
  window.addEventListener('resize', CL.layout);
  window.addEventListener('orientationchange', CL.layout);
  document.addEventListener('DOMContentLoaded', CL.layout);
  window.addEventListener('load', CL.layout);

  CL.greeting = function () {
    var h = new Date().getHours();
    return h < 5 ? 'Boa noite' : h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
  };
  CL.fmtDate = function (ts) {
    return ts ? new Date(ts * 1000).toLocaleDateString('pt-BR') : '';
  };
  CL.num = function (n) { return Number(n || 0).toLocaleString('pt-BR'); };

  /* ---------- navegação por setas (controle remoto) ---------- */
  function focusable() {
    return [].slice.call(document.querySelectorAll('button:not([disabled]),[tabindex="0"],input,a[href]')).filter(function (el) {
      var r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && r.bottom > -2000;
    });
  }
  CL.initNav = function () {
    document.addEventListener('keydown', function (e) {
      var a = document.activeElement, k = e.key, isInput = a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName);
      if (k === 'Enter') {
        if (a && a.getAttribute && a.getAttribute('role') === 'button' && a.tagName !== 'BUTTON') { e.preventDefault(); a.click(); }
        return;
      }
      if ((k === 'Escape' || k === 'BrowserBack' || (k === 'Backspace' && !isInput)) && history.length > 1) { history.back(); return; }
      var dir = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[k];
      if (!dir) return;
      if (isInput && dir[0] !== 0) return;
      var els = focusable();
      if (!a || a === document.body || els.indexOf(a) < 0) { if (els[0]) { els[0].focus(); e.preventDefault(); } return; }
      var r = a.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, best = null, bd = 1e9;
      els.forEach(function (el) {
        if (el === a) return;
        var b = el.getBoundingClientRect(), bx = b.left + b.width / 2, by = b.top + b.height / 2, dx = bx - cx, dy = by - cy;
        var along = dir[0] ? dx * dir[0] : dy * dir[1];
        if (along <= 4) return;
        var across = dir[0] ? Math.abs(dy) : Math.abs(dx);
        var d = along + across * 2.2;
        if (d < bd) { bd = d; best = el; }
      });
      if (best) { best.focus(); best.scrollIntoView({ block: 'nearest', inline: 'nearest' }); e.preventDefault(); }
    });
  };
})();
