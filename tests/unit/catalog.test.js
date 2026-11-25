// Testes de lógica: leitura de listas (M3U e painel Xtream). Rodar: npm run test:unit
const test = require('node:test');
const assert = require('node:assert/strict');
const K = require('../../js/catalog.js');

test('yearOf e cleanName entendem o ano entre parênteses ou colchetes', () => {
  assert.equal(K.yearOf('Filme Bom (2019)'), 2019);
  assert.equal(K.yearOf('Filme Bom [1999]'), 1999);
  assert.equal(K.yearOf('Sem ano'), null);
  assert.equal(K.cleanName('Filme Bom (2019)'), 'Filme Bom');
  assert.equal(K.cleanName('2001: Uma Odisseia'), '2001: Uma Odisseia');
});

test('rate usa a nota de 0 a 10 e converte a de 0 a 5', () => {
  assert.equal(K.rate('7.46', 0), 7.5);
  assert.equal(K.rate('', 4), 8);
  assert.equal(K.rate('0', '0'), null);
  assert.equal(K.rate('11', '3'), 6);
});

test('normServer completa o http e tira a barra final', () => {
  assert.equal(K.normServer('servidor.com:8080/'), 'http://servidor.com:8080');
  assert.equal(K.normServer(' https://x.com// '), 'https://x.com');
});

const M3U = `#EXTM3U
#EXTINF:-1 tvg-logo="http://i/a.jpg" group-title="Filmes",Filme A (2001)
http://s/movie/u/p/1.mp4
#EXTINF:-1 group-title="Séries",Minha Série S01E01
http://s/series/u/p/10.mp4
#EXTINF:-1 group-title="Séries",Minha Série S01E02
http://s/series/u/p/11.mp4
#EXTINF:-1 group-title="Séries",Minha Série S02E01
http://s/series/u/p/12.mp4
#EXTINF:-1 group-title="Notícias",Canal 1
http://s/live/u/p/5.m3u8
`;

test('parseM3U separa filmes, séries e canais', () => {
  const d = K.parseM3U(M3U, 'Teste');
  assert.equal(d.movie.length, 1);
  assert.equal(d.series.length, 1);
  assert.equal(d.live.length, 1);
  assert.equal(d.movie[0].n, 'Filme A');
  assert.equal(d.movie[0].y, 2001);
  assert.equal(d.movie[0].p, 'http://i/a.jpg');
  assert.equal(d.live[0].u, 'http://s/live/u/p/5.m3u8');
});

test('parseM3U agrupa episódios por série e temporada', () => {
  const s = K.parseM3U(M3U).series[0];
  assert.equal(s.n, 'Minha Série');
  assert.deepEqual(Object.keys(s.eps), ['1', '2']);
  assert.equal(s.eps['1'].length, 2);
  assert.equal(s.eps['1'][1].num, 2);
  assert.equal(s.eps['2'][0].u, 'http://s/series/u/p/12.mp4');
});

test('parseM3U cria categorias a partir de group-title', () => {
  const c = K.parseM3U(M3U).cats;
  assert.deepEqual(c.movie.map((x) => x.name), ['Filmes']);
  assert.deepEqual(c.live.map((x) => x.name), ['Notícias']);
});

test('parseM3U ignora texto que não é lista', () => {
  const d = K.parseM3U('<html>erro</html>');
  assert.equal(d.movie.length + d.series.length + d.live.length, 0);
});

test('normalizeXtream monta o catálogo e traduz a situação da conta', () => {
  const d = K.normalizeXtream({
    userInfo: { auth: 1, status: 'Active', exp_date: '1900000000' },
    server: 'http://s', user: 'u', pass: 'p',
    vod: [{ stream_id: 7, name: 'Bom Filme (2020)', rating: '8.1', stream_icon: 'http://i/1.jpg', category_id: 3, added: '100', container_extension: 'mkv' }],
    series: [{ series_id: 9, name: 'Boa Série', cover: 'http://i/2.jpg', rating_5based: 4, releaseDate: '2018-02-03', category_id: 20, last_modified: '5' }],
    live: [{ stream_id: 11, name: 'Canal', category_id: 40 }],
    catMovie: [{ category_id: 3, category_name: 'Drama' }], catSeries: [], catLive: []
  });
  assert.equal(d.meta.status, 'Ativa');
  assert.equal(d.meta.exp, 1900000000);
  assert.deepEqual(d.movie[0], { id: '7', n: 'Bom Filme', y: 2020, r: 8.1, p: 'http://i/1.jpg', c: '3', a: 100, e: 'mkv' });
  assert.equal(d.series[0].y, 2018);
  assert.equal(d.series[0].r, 8);
  assert.equal(d.cats.movie[0].name, 'Drama');
});

test('normalizeXtream aguenta respostas vazias ou quebradas', () => {
  const d = K.normalizeXtream({ userInfo: {}, server: 'http://s', user: 'u', pass: 'p', vod: null, series: 'erro', live: undefined });
  assert.equal(d.movie.length + d.series.length + d.live.length, 0);
});
