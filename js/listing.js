/**
 * Listagem: título e ordenação no topo, menu de botões à esquerda e títulos à direita.
 * Usada por filmes.html, series.html e tv.html (window.KIND = movie | series | live).
 * A lógica (busca, ordem, menu, contagens) está em js/listagem.js, testada no Node.
 * Regras: docs/REGRAS_DE_NEGOCIO.md (seção Listagens).
 */
(function () {
  if (!CL.guard(true)) return;
  var h = React.createElement, C = window.CinemaLivre, L = window.CLListagem, KIND = window.KIND;
  var TITLE = { movie: 'FILMES', series: 'SÉRIES', live: 'TV AO VIVO' }[KIND];
  var UNIT = { movie: 'títulos', series: 'séries', live: 'canais' }[KIND];
  var PAGE = 40;
  var ORDENS = [
    { value: 'az', label: 'De A até Z' },
    { value: 'za', label: 'De Z até A' },
    { value: 'lancamento', label: 'Data de lançamento' },
    { value: 'nota', label: 'Melhor nota' },
    { value: 'recentes', label: 'Adicionados recentemente' }
  ];

  function open(x) {
    if (KIND === 'live') {
      var u = CL.streamUrl('live', x);
      if (!u) return alert('Este é um canal de exemplo e não tem transmissão. Os canais de teste da categoria "Canais de teste" tocam de verdade.');
      location.href = 'player.html?' + new URLSearchParams({ u: u, title: x.n, p: x.p || '', t: 'live', id: x.id, key: 'live:' + x.id });
    } else location.href = 'detalhe.html?t=' + KIND + '&id=' + encodeURIComponent(x.id);
  }

  function App() {
    var s = React.useState({ items: null, cats: [], cat: CL.q('c') || CL.get('cat.' + KIND, 'all'), q: '', ordem: '', limit: PAGE });
    var st = s[0];
    function set(p) { s[1](function (o) { return Object.assign({}, o, p); }); }
    var sentinel = React.useRef(null);
    var regime = C.useRegime();
    var menuAberto = React.useState(false), aberto = menuAberto[0], setAberto = menuAberto[1];

    React.useEffect(function () {
      Promise.all([CL.loadKind(KIND), CL.loadCats()]).then(function (r) { set({ items: r[0], cats: r[1][KIND] || [] }); });
    }, []);

    /* menu e contagens (Continuar assistindo, Favoritos, Recentes, Todos, anos, gêneros, streamings) */
    var ctx = React.useMemo(function () {
      if (!st.items) return null;
      return {
        itens: st.items, categorias: st.cats,
        favoritos: CL.favs().filter(function (k) { return k.indexOf(KIND + ':') === 0; }).map(function (k) { return k.slice(KIND.length + 1); }),
        historico: CL.history().filter(function (e) { return e.t === KIND; }).map(function (e) { return e.id; }),
        anoAtual: new Date().getFullYear(), semAnos: KIND === 'live'
      };
    }, [st.items, st.cats]);
    var menu = React.useMemo(function () { return ctx ? L.montarMenu(ctx) : []; }, [ctx]);

    var catEf = menu.some(function (m) { return m.id === st.cat; }) ? st.cat : 'all';
    var busca = ctx ? L.filtrarPorBusca(st.items, st.q) : { ativo: false, itens: [] };
    var ordemEf = st.ordem || (catEf === 'new' ? 'recentes' : 'az');
    var list = React.useMemo(function () {
      if (!ctx) return [];
      return L.ordenar(busca.ativo ? busca.itens : L.itensDoMenu(catEf, ctx), ordemEf);
    }, [ctx, catEf, st.q, ordemEf]);

    React.useEffect(function () {
      if (!sentinel.current || typeof IntersectionObserver === 'undefined') return;
      var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) set({ limit: st.limit + PAGE }); }, { rootMargin: '600px' });
      io.observe(sentinel.current);
      return function () { io.disconnect(); };
    }, [list, st.limit]);

    if (!ctx) return h('div', { className: 'msg' }, 'Carregando…');
    var shown = list.slice(0, st.limit);
    var ativo = menu.filter(function (m) { return m.id === catEf; })[0];
    var rotuloAtivo = busca.ativo ? 'Busca: "' + st.q.trim() + '"' : (ativo ? ativo.rotulo : 'Todos');
    var curto = busca.ativo ? 'Busca' : rotuloAtivo;
    var tocouPouco = st.q.trim().length > 0 && !busca.ativo;

    return h('div', null,
      h('div', { className: 'topbar' },
        h('h1', { className: 'h-title' }, TITLE),
        h('div', { className: 'topbar__tools' },
          h(C.Select, { label: 'Ordenar', value: ordemEf, options: ORDENS, onChange: function (v) { set({ ordem: v, limit: PAGE }); } }),
          h(C.ActionButton, { icon: 'home', onClick: function () { location.href = 'home.html'; } }, 'Início'))),
      h('div', { className: 'list' },
        h('div', { className: 'list__side' },
          h(C.Field, { label: 'Buscar', value: st.q, placeholder: 'Digite 3 letras ou mais…', onChange: function (v) { set({ q: v, limit: PAGE }); }, hint: tocouPouco ? 'Digite pelo menos 3 letras para filtrar.' : undefined }),
          regime !== 'tv' && h(C.ActionButton, { icon: 'film', onClick: function () { setAberto(!aberto); } }, 'Categorias · ' + curto),
          regime === 'tv' || aberto
            ? h(C.CategoryMenu, {
              items: menu.map(function (m) { return { id: m.id, label: m.rotulo, n: m.n }; }), active: busca.ativo ? '' : catEf,
              onSelect: function (id) { CL.set('cat.' + KIND, id); set({ cat: id, q: '', ordem: '', limit: PAGE }); setAberto(false); window.scrollTo(0, 0); }
            })
            : null),
        h('div', null,
          h('div', { className: 'sec-label', style: { marginTop: 0 } }, rotuloAtivo + ' · ' + CL.num(list.length) + ' ' + UNIT),
          list.length === 0
            ? h('div', { className: 'msg' }, catEf === 'cont' && !busca.ativo ? 'Você ainda não começou nada aqui.' : catEf === 'fav' && !busca.ativo ? 'Nenhum favorito ainda. Abra um título e use o botão Favorito.' : 'Nada encontrado.')
            : h('div', { className: 'grid5' + (KIND === 'live' ? ' live' : '') }, shown.map(function (x) {
              return h(C.PosterCard, { key: x.id, title: x.n, year: KIND === 'live' ? undefined : x.y || undefined, rating: x.r || undefined, src: x.p, ratio: KIND === 'live' ? '1/1' : undefined, fit: KIND === 'live' ? 'contain' : undefined, onClick: function () { open(x); } });
            })),
          h('div', { ref: sentinel, className: 'more muted' }, shown.length < list.length ? 'Carregando mais…' : ''))));
  }
  ReactDOM.createRoot(document.getElementById('root')).render(h(App));
  CL.initNav();
})();
