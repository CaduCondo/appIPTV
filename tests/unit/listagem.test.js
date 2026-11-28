// Testes (escritos ANTES do código — TDD) da lógica das listagens de Filmes/Séries/TV (issue #46).
const test = require('node:test');
const assert = require('node:assert/strict');
const L = require('../../js/listagem.js');

const it = (id, n, extra) => Object.assign({ id: String(id), n: n, y: null, r: null, a: 0, c: '1' }, extra || {});

test('normalizar texto: minúsculas e sem acento', () => {
  assert.equal(L.normalizarTexto('  Ação Épica  '), 'acao epica');
});

test('busca só filtra a partir da terceira letra e procura em qualquer parte do nome', () => {
  const lista = [it(1, 'Amor te amo'), it(2, 'amo esperar'), it(3, 'Amorzinho'), it(4, 'Eu falei amor'), it(5, 'Esse amor verdadeiro'), it(6, 'Guerra')];
  assert.equal(L.filtrarPorBusca(lista, 'am').ativo, false);
  assert.equal(L.filtrarPorBusca(lista, 'am').itens.length, 6);
  const r = L.filtrarPorBusca(lista, 'amo');
  assert.equal(r.ativo, true);
  assert.deepEqual(r.itens.map((x) => x.id), ['1', '2', '3', '4', '5']);
  assert.deepEqual(L.filtrarPorBusca(lista, 'AMOR').itens.map((x) => x.id), ['1', '3', '4', '5']);
  assert.deepEqual(L.filtrarPorBusca(lista, 'ação').itens, []);
});

test('busca ignora acentos', () => {
  assert.equal(L.filtrarPorBusca([it(1, 'Ação Total')], 'acao').itens.length, 1);
});

test('ordenar: A–Z, Z–A, lançamento, nota e recentes', () => {
  const lista = [it(1, 'Bravo', { y: 2020, r: 7, a: 5 }), it(2, 'alfa', { y: 2024, r: 9, a: 1 }), it(3, 'Charlie', { y: null, r: null, a: 9 }), it(4, 'Álamo', { y: 2024, r: 8, a: 3 })];
  const nomes = (c) => L.ordenar(lista, c).map((x) => x.n);
  assert.deepEqual(nomes('az'), ['Álamo', 'alfa', 'Bravo', 'Charlie']);
  assert.deepEqual(nomes('za'), ['Charlie', 'Bravo', 'alfa', 'Álamo']);
  assert.deepEqual(nomes('lancamento'), ['Álamo', 'alfa', 'Bravo', 'Charlie']); // 2024, 2024 (empate: por nome), 2020, sem ano por último
  assert.deepEqual(nomes('nota'), ['alfa', 'Álamo', 'Bravo', 'Charlie']);
  assert.deepEqual(nomes('recentes'), ['Charlie', 'Bravo', 'Álamo', 'alfa']);
});

test('ordenar não altera a lista original', () => {
  const lista = [it(1, 'B'), it(2, 'A')];
  L.ordenar(lista, 'az');
  assert.equal(lista[0].n, 'B');
});

test('limpar o nome da categoria tira o prefixo Filmes/Séries', () => {
  assert.equal(L.limparNomeCategoria('Series - Netflix'), 'Netflix');
  assert.equal(L.limparNomeCategoria('FILMES | Ação'), 'Ação');
  assert.equal(L.limparNomeCategoria('Drama'), 'Drama');
});

test('streamings são reconhecidos pelo nome', () => {
  ['Netflix', 'Series - Disney+', 'Apple TV+', 'AMC+', 'Prime Video', 'HBO Max', 'Max', 'Globoplay', 'Paramount+'].forEach((n) =>
    assert.equal(L.ehStreaming(n), true, n));
  ['Ação', 'Comédia', 'Drama', 'Maximum Fear', 'Lançamentos'].forEach((n) => assert.equal(L.ehStreaming(n), false, n));
});

test('categorias: gêneros A–Z e depois streamings A–Z', () => {
  const cats = [{ id: '1', name: 'Series - Netflix' }, { id: '2', name: 'Drama' }, { id: '3', name: 'Apple TV+' }, { id: '4', name: 'Ação' }, { id: '5', name: 'Comédia' }, { id: '6', name: 'AMC+' }];
  assert.deepEqual(L.ordenarCategorias(cats).map((c) => c.name), ['Ação', 'Comédia', 'Drama', 'AMC+', 'Apple TV+', 'Series - Netflix']);
});

function base() {
  const itens = [];
  for (let i = 0; i < 130; i++) itens.push(it(i, 'Filme ' + i, { y: 2026, a: i, c: '1' }));
  itens.push(it(500, 'Velho', { y: 2025, a: 1, c: '2' }), it(501, 'Velho 2', { y: 2024, a: 2, c: '2' }), it(502, 'Netflix 1', { y: 2023, a: 3, c: '3' }));
  return { itens, categorias: [{ id: '1', name: 'Ação' }, { id: '2', name: 'Drama' }, { id: '3', name: 'Series - Netflix' }, { id: '9', name: 'Vazia' }], favoritos: ['1', '2'], historico: ['7'], anoAtual: 2026 };
}

test('menu: ordem fixa, contagens e limites de 100', () => {
  const m = L.montarMenu(base());
  assert.deepEqual(m.map((x) => x.id), ['cont', 'fav', 'new', 'all', 'ano:2026', 'ano:2025', 'c:1', 'c:2', 'c:3']);
  const n = (id) => m.find((x) => x.id === id).n;
  assert.equal(n('cont'), 1);
  assert.equal(n('fav'), 2);
  assert.equal(n('new'), 100);
  assert.equal(n('all'), 133);
  assert.equal(n('ano:2026'), 100);
  assert.equal(n('ano:2025'), 1);
  assert.equal(n('c:3'), 1);
  assert.equal(m.find((x) => x.id === 'c:3').rotulo, 'Netflix');
});

test('menu sem anos (TV ao Vivo) e categorias vazias não aparecem', () => {
  const m = L.montarMenu(Object.assign(base(), { semAnos: true }));
  assert.ok(!m.some((x) => x.id.indexOf('ano:') === 0));
  assert.ok(!m.some((x) => x.id === 'c:9'));
});

test('itens de cada botão do menu', () => {
  const b = base();
  assert.deepEqual(L.itensDoMenu('fav', b).map((x) => x.id), ['1', '2']);
  assert.deepEqual(L.itensDoMenu('cont', b).map((x) => x.id), ['7']);
  assert.equal(L.itensDoMenu('new', b).length, 100);
  assert.equal(L.itensDoMenu('all', b).length, 133);
  assert.equal(L.itensDoMenu('ano:2026', b).length, 100);
  assert.deepEqual(L.itensDoMenu('c:2', b).map((x) => x.id).sort(), ['500', '501']);
});

test('"Adicionados recentemente" traz os mais novos primeiro', () => {
  const b = base();
  assert.equal(L.itensDoMenu('new', b)[0].a, 129);
});
