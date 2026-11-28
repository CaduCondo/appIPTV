/* Listagem: categorias à esquerda, pôsteres à direita. Usada por filmes.html, series.html e tv.html (window.KIND). */
(function () {
  if (!CL.guard(true)) return;
  var h = React.createElement, C = window.CinemaLivre, KIND = window.KIND;
  var TITLE = { movie: 'Filmes', series: 'Séries', live: 'TV ao Vivo' }[KIND];
  var UNIT = { movie: 'títulos', series: 'séries', live: 'canais' }[KIND];
  var PAGE = 40;

  function open(x) {
    if (KIND === 'live') {
      var u = CL.streamUrl('live', x);
      if (!u) return alert('Este é um canal de exemplo e não tem transmissão. Os canais de teste da categoria "Canais de teste" tocam de verdade.');
      location.href = 'player.html?' + new URLSearchParams({ u: u, title: x.n, p: x.p || '', t: 'live', id: x.id, key: 'live:' + x.id });
    } else location.href = 'detalhe.html?t=' + KIND + '&id=' + encodeURIComponent(x.id);
  }

  function App() {
    var s = React.useState({ items: null, cats: [], cat: CL.get('cat.' + KIND, 'all'), q: '', search: false, limit: PAGE });
    var st = s[0];
    function set(p) { s[1](function (o) { return Object.assign({}, o, p); }); }
    var sentinel = React.useRef(null);
    var regime = C.useRegime();
    var menuAberto = React.useState(false), aberto = menuAberto[0], setAberto = menuAberto[1];

    React.useEffect(function () {
      Promise.all([CL.loadKind(KIND), CL.loadCats()]).then(function (r) { set({ items: r[0], cats: r[1][KIND] || [] }); });
    }, []);

    var derived = React.useMemo(function () {
      if (!st.items) return null;
      var counts = {}, byId = {};
      st.items.forEach(function (x) { counts[x.c] = (counts[x.c] || 0) + 1; byId[x.id] = x; });
      var favs = CL.favs().filter(function (k) { return k.indexOf(KIND + ':') === 0; }).map(function (k) { return k.slice(KIND.length + 1); });
      var hist = CL.history().filter(function (e) { return e.t === KIND; });
      var menu = [
        { id: 'cont', label: 'Continuar assistindo', count: hist.length + ' itens' },
        { id: 'fav', label: 'Favoritos', count: favs.length + ' itens' },
        { id: 'new', label: 'Recém chegados', count: Math.min(100, st.items.length) + ' ' + UNIT },
        { id: 'all', label: 'Todos', count: CL.num(st.items.length) + ' ' + UNIT }
      ].concat(st.cats.filter(function (c) { return counts[c.id]; }).map(function (c) { return { id: 'c:' + c.id, label: c.name, count: CL.num(counts[c.id]) + ' ' + UNIT }; }));
      return { menu: menu, byId: byId, favs: favs, hist: hist };
    }, [st.items, st.cats]);

    var list = React.useMemo(function () {
      if (!derived) return [];
      var q = st.q.trim().toLowerCase();
      if (q) return st.items.filter(function (x) { return x.n && x.n.toLowerCase().indexOf(q) >= 0; });
      if (st.cat === 'cont') return derived.hist.map(function (e) { return derived.byId[e.id] || { id: e.id, n: e.title, p: e.p }; });
      if (st.cat === 'fav') return derived.favs.map(function (id) { return derived.byId[id]; }).filter(Boolean);
      if (st.cat === 'new') return st.items.slice().sort(function (a, b) { return (b.a || 0) - (a.a || 0); }).slice(0, 100);
      if (st.cat.indexOf('c:') === 0) { var id = st.cat.slice(2); return st.items.filter(function (x) { return x.c === id; }); }
      return st.items;
    }, [derived, st.cat, st.q]);

    React.useEffect(function () {
      if (!sentinel.current || typeof IntersectionObserver === 'undefined') return;
      var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) set({ limit: st.limit + PAGE }); }, { rootMargin: '600px' });
      io.observe(sentinel.current);
      return function () { io.disconnect(); };
    }, [list, st.limit]);

    if (!derived) return h('div', { className: 'msg' }, 'Carregando…');
    var shown = list.slice(0, st.limit);
    var activeLabel = st.q ? 'Busca: "' + st.q + '"' : (derived.menu.filter(function (m) { return m.id === st.cat; })[0] || derived.menu[3]).label;

    return h('div', null,
      h('div', { className: 'topbar' },
        h('h1', { className: 'h-title' }, TITLE),
        h('div', { className: 'btns' },
          h(C.ActionButton, { icon: 'home', onClick: function () { location.href = 'home.html'; } }, 'Início'))),
      h('div', { className: 'list' },
        h('div', { className: 'list__side' },
          regime !== 'tv' && h(C.ActionButton, { icon: 'film', onClick: function () { setAberto(!aberto); } }, 'Categorias · ' + activeLabel.replace(/^Busca: .*/, 'Busca')),
          st.search
            ? h(C.Field, { label: 'Buscar', value: st.q, placeholder: 'Nome…', autoFocus: true, onChange: function (v) { set({ q: v, limit: PAGE }); }, onKeyDown: function (e) { if (e.key === 'Escape') set({ search: false, q: '' }); } })
            : h(C.ActionButton, { icon: 'search', onClick: function () { set({ search: true }); } }, 'Buscar'),
          regime === 'tv' || aberto
            ? h(C.CategoryMenu, { items: derived.menu, active: st.q ? '' : st.cat, onSelect: function (id) { CL.set('cat.' + KIND, id); set({ cat: id, q: '', limit: PAGE }); setAberto(false); window.scrollTo(0, 0); } })
            : null),
        h('div', null,
          h('div', { className: 'sec-label', style: { marginTop: 0 } }, activeLabel + ' · ' + CL.num(list.length) + ' ' + UNIT),
          list.length === 0
            ? h('div', { className: 'msg' }, st.cat === 'cont' ? 'Você ainda não começou nada aqui.' : st.cat === 'fav' ? 'Nenhum favorito ainda. Abra um título e use o botão Favorito.' : 'Nada encontrado.')
            : h('div', { className: 'grid5' + (KIND === 'live' ? ' live' : '') }, shown.map(function (x) {
              return h(C.PosterCard, { key: x.id, title: x.n, year: KIND === 'live' ? undefined : x.y || undefined, rating: x.r || undefined, src: x.p, ratio: KIND === 'live' ? '1/1' : undefined, fit: KIND === 'live' ? 'contain' : undefined, onClick: function () { open(x); } });
            })),
          h('div', { ref: sentinel, className: 'more muted' }, shown.length < list.length ? 'Carregando mais…' : ''))));
  }
  ReactDOM.createRoot(document.getElementById('root')).render(h(App));
  CL.initNav();
})();
