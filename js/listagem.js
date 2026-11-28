/**
 * CineHomeTV — LÓGICA DAS LISTAGENS (Filmes, Séries, TV ao Vivo).
 *
 * Módulo puro (sem navegador): busca, ordenação, ordem das categorias, menu
 * de botões com contagens. A tela (js/listing.js) só chama estas funções.
 * Regras em linguagem simples: docs/REGRAS_DE_NEGOCIO.md (seção Listagens).
 */
(function (root) {
  'use strict';

  var LIMITE_LISTA = 100; // "Adicionados recentemente" e cada ano mostram no máximo 100 títulos
  var MIN_LETRAS_BUSCA = 3;

  /** Minúsculas e sem acento: "Ação" e "acao" são iguais na busca e na ordem. */
  function normalizarTexto(s) {
    return String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  }

  /**
   * Busca: só filtra a partir da terceira letra e procura em QUALQUER parte do nome.
   * Devolve { ativo, itens } — `ativo:false` quer dizer "ainda não filtrou" (menos de 3 letras).
   */
  function filtrarPorBusca(itens, termo) {
    var t = normalizarTexto(termo);
    if (t.length < MIN_LETRAS_BUSCA) return { ativo: false, itens: itens };
    return { ativo: true, itens: itens.filter(function (x) { return normalizarTexto(x.n).indexOf(t) >= 0; }) };
  }

  function porNome(a, b) { return normalizarTexto(a.n).localeCompare(normalizarTexto(b.n), 'pt-BR'); }
  /** Compara números deixando "sem valor" por último; `desc` = do maior para o menor. */
  function porNumero(campo, desc) {
    return function (a, b) {
      var x = a[campo], y = b[campo];
      if (x == null && y == null) return porNome(a, b);
      if (x == null) return 1;
      if (y == null) return -1;
      return (desc ? y - x : x - y) || porNome(a, b);
    };
  }

  /** Ordena SEM alterar a lista original. criterio: az | za | lancamento | nota | recentes */
  function ordenar(itens, criterio) {
    var copia = itens.slice();
    switch (criterio) {
      case 'za': return copia.sort(function (a, b) { return porNome(b, a); });
      case 'lancamento': return copia.sort(porNumero('y', true));
      case 'nota': return copia.sort(porNumero('r', true));
      case 'recentes': return copia.sort(porNumero('a', true));
      default: return copia.sort(porNome);
    }
  }

  /** Tira o prefixo "Filmes - ", "Series | " etc. do nome da categoria do provedor. */
  function limparNomeCategoria(nome) {
    return String(nome || '').replace(/^\s*(filmes?|s[ée]ries?|movies?|vod|canais?)\s*[-–|:]\s*/i, '').trim();
  }

  var STREAMINGS = [/netflix/, /disney/, /amazon/, /prime\s*video/, /hbo/, /\bmax\b/, /apple/, /globoplay/, /paramount/, /star\s*\+|starplus|\bstar\b/, /\bamc\b/, /discovery/, /telecine/, /claro\s*video/, /crunchyroll/, /hulu/, /peacock/, /mubi/, /looke/, /pluto/, /tubi/, /youtube/, /play\s*plus|playplus/, /rakuten/, /univer/];

  /** Categoria de streaming (Netflix, Disney+...) em vez de gênero (Ação, Drama...). */
  function ehStreaming(nome) {
    var n = normalizarTexto(limparNomeCategoria(nome));
    return STREAMINGS.some(function (re) { return re.test(n); });
  }

  /** Gêneros em ordem alfabética e, depois, os streamings também em ordem alfabética. */
  function ordenarCategorias(cats) {
    var cmp = function (a, b) { return normalizarTexto(limparNomeCategoria(a.name)).localeCompare(normalizarTexto(limparNomeCategoria(b.name)), 'pt-BR'); };
    var generos = cats.filter(function (c) { return !ehStreaming(c.name); }).sort(cmp);
    var streamings = cats.filter(function (c) { return ehStreaming(c.name); }).sort(cmp);
    return generos.concat(streamings);
  }

  function recentes(itens) { return ordenar(itens, 'recentes'); }

  /**
   * Itens de um botão do menu.
   * ids: cont | fav | new | all | ano:AAAA | c:ID
   * ctx: { itens, favoritos[ids], historico[ids em ordem], anoAtual }
   */
  function itensDoMenu(id, ctx) {
    var itens = ctx.itens;
    if (id === 'all') return itens;
    if (id === 'new') return recentes(itens).slice(0, LIMITE_LISTA);
    if (id === 'fav') return itens.filter(function (x) { return (ctx.favoritos || []).indexOf(x.id) >= 0; });
    if (id === 'cont') {
      var por = {}; itens.forEach(function (x) { por[x.id] = x; });
      return (ctx.historico || []).map(function (i) { return por[i]; }).filter(Boolean);
    }
    if (id.indexOf('ano:') === 0) {
      var ano = Number(id.slice(4));
      return recentes(itens.filter(function (x) { return x.y === ano; })).slice(0, LIMITE_LISTA);
    }
    if (id.indexOf('c:') === 0) { var c = id.slice(2); return itens.filter(function (x) { return x.c === c; }); }
    return itens;
  }

  /**
   * Menu da esquerda, na ordem pedida pelo Cadu:
   * Continuar assistindo, Favoritos, Adicionados recentemente, Todos, ano atual, ano anterior,
   * gêneros (A–Z) e streamings (A–Z). Cada botão traz a contagem `n`.
   * ctx: { itens, categorias, favoritos, historico, anoAtual, semAnos }
   */
  function montarMenu(ctx) {
    var item = function (id, rotulo) { return { id: id, rotulo: rotulo, n: itensDoMenu(id, ctx).length }; };
    var menu = [item('cont', 'Continuar assistindo'), item('fav', 'Favoritos'), item('new', 'Adicionados recentemente'), item('all', 'Todos')];
    if (!ctx.semAnos) {
      [ctx.anoAtual, ctx.anoAtual - 1].forEach(function (a) {
        var m = item('ano:' + a, String(a));
        if (m.n > 0) menu.push(m);
      });
    }
    ordenarCategorias(ctx.categorias || []).forEach(function (c) {
      var m = item('c:' + c.id, limparNomeCategoria(c.name));
      if (m.n > 0) menu.push(m);
    });
    return menu;
  }

  var API = {
    LIMITE_LISTA: LIMITE_LISTA, MIN_LETRAS_BUSCA: MIN_LETRAS_BUSCA,
    normalizarTexto: normalizarTexto, filtrarPorBusca: filtrarPorBusca, ordenar: ordenar,
    limparNomeCategoria: limparNomeCategoria, ehStreaming: ehStreaming, ordenarCategorias: ordenarCategorias,
    itensDoMenu: itensDoMenu, montarMenu: montarMenu
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.CLListagem = API;
})(typeof window !== 'undefined' ? window : globalThis);
