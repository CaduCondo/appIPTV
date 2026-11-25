/* Catálogo de demonstração: filmes abertos da Blender com vídeo de verdade + vitrine com pôsteres reais + títulos de exemplo. */
CL.demoCatalog = function () {
  var A = 'assets/Demo/', G = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/', P = 'assets/Pessoas/';
  var CATS = [['free', 'Cinema livre (com vídeo)'], ['lanc', 'Lançamentos'], ['acao', 'Ação'], ['comedia', 'Comédia'], ['drama', 'Drama'], ['ficcao', 'Ficção científica'], ['terror', 'Terror'], ['doc', 'Documentários']];
  var GENRE = { free: 'Animação', lanc: 'Drama', acao: 'Ação, Aventura', comedia: 'Comédia', drama: 'Drama', ficcao: 'Ficção científica', terror: 'Terror, Suspense', doc: 'Documentário' };
  var CAST = ['Ana Souza', 'Bruno Lima', 'Clara Reis', 'Diego Rocha', 'Elisa Prado', 'Fábio Dias', 'Gabriela Melo', 'Hugo Neves'];
  var n = 100;
  function cast(k) { return [0, 1, 2, 3].map(function (i) { return { name: CAST[(k + i) % CAST.length], character: '', img: '' }; }); }
  function mock(title, year, rating, cat) {
    n--;
    return { id: 'x' + n, n: title, y: year, r: rating, p: '', c: cat, a: n, info: { plot: 'Sinopse de exemplo de "' + title + '". Em uma lista real, este texto vem do provedor ou do catálogo.', genre: GENRE[cat], cast: cast(n) } };
  }
  function real(id, title, year, rating, poster, cat, order) {
    return { id: id, n: title, y: year, r: rating, p: A + poster, c: cat, a: order, info: { plot: 'Sinopse de exemplo de "' + title + '". Este título é só uma vitrine, sem vídeo.', genre: GENRE[cat], cast: cast(order) } };
  }
  var movie = [
    { id: 'd1', n: 'Big Buck Bunny', y: 2008, r: 7.2, p: A + 'big-buck-bunny.jpg', c: 'free', a: 99, u: G + 'BigBuckBunny.mp4', info: { plot: 'Um coelho gigante e gentil enfrenta três roedores que decidem atormentar a floresta. Curta de animação aberto da Blender Foundation.', genre: 'Animação, Comédia', cast: [] } },
    { id: 'd2', n: 'Sintel', y: 2010, r: 7.5, p: A + 'sintel.jpg', c: 'free', a: 98, u: G + 'Sintel.mp4', info: { plot: 'Uma jovem guerreira parte em busca de um dragão que ela criou e perdeu. Curta aberto da Blender Foundation.', genre: 'Animação, Fantasia', cast: [] } },
    { id: 'd3', n: 'Tears of Steel', y: 2012, r: 6.5, p: A + 'tears-of-steel.png', c: 'free', a: 97, u: G + 'TearsOfSteel.mp4', info: { plot: 'Um grupo de guerreiros e cientistas tenta salvar o mundo de robôs na Amsterdã do futuro. Curta aberto da Blender Foundation.', genre: 'Ficção científica', cast: [] } },
    { id: 'd4', n: "Elephant's Dream", y: 2006, r: 6.2, p: A + 'elephants-dream.jpg', c: 'free', a: 96, u: G + 'ElephantsDream.mp4', info: { plot: 'Dois personagens exploram uma máquina gigantesca e misteriosa. Primeiro curta aberto da Blender Foundation.', genre: 'Animação', cast: [] } },
    real('v1', 'A Origem', 2010, 8.8, 'inception.jpg', 'ficcao', 95),
    real('v2', 'Batman: O Cavaleiro das Trevas Ressurge', 2012, 8.4, 'batman-cavaleiro-das-trevas-ressurge.jpg', 'acao', 94),
    real('v3', 'Mad Max: Estrada da Fúria', 2015, 8.1, 'mad-max-estrada-da-furia.jpg', 'acao', 93),
    real('v4', 'O Regresso', 2015, 8.0, 'o-regresso.jpg', 'drama', 92),
    real('v5', 'Dunkirk', 2017, 7.8, 'dunkirk.jpg', 'drama', 91),
    real('v6', 'Venom', 2018, 6.6, 'venom.png', 'acao', 90),
    real('v7', 'Homem-Aranha: Sem Volta para Casa', 2021, 8.2, 'homem-aranha-sem-volta-para-casa.jpg', 'acao', 89)
  ];
  [
    ['A Casa do Lago Seco', 2025, 7.1, 'lanc'], ['Rota 66 Norte', 2025, 6.4, 'lanc'], ['O Último Trem', 2024, 7.9, 'lanc'], ['Nuvens de Agosto', 2025, 6.8, 'lanc'],
    ['Cidade em Chamas', 2023, 6.9, 'acao'], ['Operação Farol', 2022, 7.3, 'acao'], ['Fúria no Deserto', 2021, 6.2, 'acao'], ['Ponto de Ruptura', 2020, 7.0, 'acao'],
    ['Domingo em Família', 2024, 7.4, 'comedia'], ['Os Vizinhos do 12', 2022, 6.7, 'comedia'], ['Casamento por Engano', 2021, 6.1, 'comedia'], ['Férias Perfeitas', 2019, 7.2, 'comedia'],
    ['Cartas para Ninguém', 2023, 8.1, 'drama'], ['A Margem do Rio', 2022, 7.7, 'drama'], ['Silêncio de Inverno', 2020, 8.3, 'drama'], ['O Peso do Nome', 2018, 7.5, 'drama'],
    ['Órbita Zero', 2024, 7.6, 'ficcao'], ['Planeta Esquecido', 2021, 6.9, 'ficcao'], ['Código Delta', 2019, 7.2, 'ficcao'],
    ['A Casa dos Ecos', 2023, 6.5, 'terror'], ['Noite sem Fim', 2022, 6.0, 'terror'], ['O Porão', 2020, 6.8, 'terror'],
    ['Planeta Azul Profundo', 2022, 8.0, 'doc'], ['Vozes da Floresta', 2021, 7.8, 'doc'], ['Cidades Invisíveis', 2019, 7.4, 'doc']
  ].forEach(function (m) { movie.push(mock(m[0], m[1], m[2], m[3])); });

  /* séries */
  function episodes(seasons, base) {
    var eps = {};
    seasons.forEach(function (count, si) {
      eps[String(si + 1)] = [];
      for (var i = 1; i <= count; i++) eps[String(si + 1)].push({ id: base + 's' + (si + 1) + 'e' + i, num: i, title: 'Episódio ' + i, plot: 'Sinopse curta de exemplo do episódio ' + i + '.' });
    });
    return eps;
  }
  var mafia = {
    id: 'sd1', n: 'Terra da Máfia', y: 2025, r: 8.0, p: A + 'terra-da-mafia.jpg', c: 'drama', a: 99, eps: episodes([10, 9], 'mf'),
    info: {
      plot: 'O poder está em disputa quando duas famílias do crime se chocam numa batalha que ameaça derrubar impérios e arruinar vidas. No meio está Harry Da Souza, um "resolvedor de problemas" que sabe bem onde a lealdade está quando as forças opostas colidem.', genre: 'Crime, Drama',
      cast: [
        { name: 'Tom Hardy', character: 'Harry Da Souza', img: P + 'tom-hardy.jpg' }, { name: 'Pierce Brosnan', character: 'Conrad Harrigan', img: P + 'pierce-brosnan.jpg' },
        { name: 'Helen Mirren', character: 'Maeve Harrigan', img: P + 'helen-mirren.jpg' }, { name: 'Paddy Considine', character: 'Kevin Harrigan', img: P + 'paddy-considine.jpg' },
        { name: 'Joanne Froggatt', character: 'Jan Da Souza', img: P + 'joanne-froggatt.jpg' }, { name: 'Lara Pulver', character: '', img: P + 'lara-pulver.jpg' },
        { name: 'Anson Boon', character: '', img: P + 'anson-boon.jpg' }, { name: 'Jasmine Jobson', character: '', img: P + 'jasmine-jobson.jpg' }
      ]
    }
  };
  /* os episódios da Terra da Máfia usam os títulos do print do Cadu na temporada 2 */
  ['Retorno', 'Novas regras', 'O preço', 'Fronteira', 'Birdland', 'A Different Corner', 'Ace of Spades', "We Don't Talk Anymore", 'Nervous Breakdown'].forEach(function (t, i) { mafia.eps['2'][i].title = t; });
  var series = [mafia];
  [
    ['Farol do Sul', 2021, 7.8, 'drama', [8, 8]], ['Noite no Mercado', 2019, 8.2, 'drama', [10, 10, 8]], ['Rio Acima', 2023, 6.9, 'drama', [6]],
    ['Linha de Frente', 2022, 7.5, 'crime', [8, 8]], ['Fronteira Fria', 2020, 8.0, 'crime', [10, 6]], ['Casa de Vidro', 2016, 8.4, 'crime', [10, 10, 10]],
    ['Vizinhos', 2018, 7.0, 'comedia', [12, 12]], ['O Escritório do Zé', 2017, 7.3, 'comedia', [10, 8]],
    ['Mundo Selvagem', 2022, 8.3, 'doc', [6, 6]]
  ].forEach(function (s, i) {
    n--;
    series.push({ id: 'sx' + n, n: s[0], y: s[1], r: s[2], p: '', c: s[3], a: 90 - i, eps: episodes(s[4], 'x' + n), info: { plot: 'Sinopse de exemplo de "' + s[0] + '". Em uma lista real, este texto vem do provedor ou do catálogo.', genre: s[3] === 'crime' ? 'Crime, Drama' : s[3] === 'doc' ? 'Documentário' : s[3] === 'comedia' ? 'Comédia' : 'Drama', cast: cast(n) } });
  });

  /* canais */
  var live = [
    { id: 'l1', n: 'Canal de teste (HLS 1)', p: '', c: 'test', a: 50, u: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
    { id: 'l2', n: 'Canal de teste (HLS 2)', p: '', c: 'test', a: 49, u: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_4x3/bipbop_4x3_variant.m3u8' }
  ];
  [['Canal Aberto 1', 'abertos'], ['Canal Aberto 2', 'abertos'], ['Canal Aberto 3', 'abertos'], ['Notícias 24h', 'noticias'], ['Jornal Hoje', 'noticias'], ['Esporte Total', 'esportes'], ['Futebol Ao Vivo', 'esportes'], ['Arena Esportes', 'esportes'], ['Cine Clássicos', 'filmes'], ['Cine Ação', 'filmes'], ['Mundo Kids', 'infantil'], ['Desenhos 24h', 'infantil']].forEach(function (c, i) {
    live.push({ id: 'lx' + i, n: c[0], p: '', c: c[1], a: 40 - i });
  });

  return {
    meta: { kind: 'demo', name: 'Demonstração', status: 'Ativa', exp: 0 },
    movie: movie, series: series, live: live,
    cats: {
      movie: CATS.map(function (c) { return { id: c[0], name: c[1] }; }),
      series: [{ id: 'drama', name: 'Drama' }, { id: 'crime', name: 'Crime' }, { id: 'comedia', name: 'Comédia' }, { id: 'doc', name: 'Documentários' }],
      live: [{ id: 'test', name: 'Canais de teste (tocam)' }, { id: 'abertos', name: 'Abertos' }, { id: 'noticias', name: 'Notícias' }, { id: 'esportes', name: 'Esportes' }, { id: 'filmes', name: 'Filmes' }, { id: 'infantil', name: 'Infantil' }]
    }
  };
};

/* Histórico de exemplo para a home da demonstração (só se o perfil ainda não assistiu nada) */
CL.seedDemoHistory = function () {
  var p = CL.profile();
  if (!p || CL.get('seeded.' + p.id) || CL.history().length) return;
  CL.set('seeded.' + p.id, true);
  var A = 'assets/Demo/', G = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/';
  CL.saveProgress({ key: 'series:sd1:mfs2e8', t: 'series', id: 'sd1', title: 'Terra da Máfia · T2 E8', p: A + 'terra-da-mafia.jpg', u: '', pos: 20, dur: 100, ep: { s: '2', n: 8, eid: 'mfs2e8' } });
  CL.saveProgress({ key: 'movie:d2', t: 'movie', id: 'd2', title: 'Sintel', p: A + 'sintel.jpg', u: G + 'Sintel.mp4', pos: 300, dur: 888 });
  CL.saveProgress({ key: 'movie:v1', t: 'movie', id: 'v1', title: 'A Origem', p: A + 'inception.jpg', u: '', pos: 45, dur: 148 });
  CL.saveProgress({ key: 'movie:d1', t: 'movie', id: 'd1', title: 'Big Buck Bunny', p: A + 'big-buck-bunny.jpg', u: G + 'BigBuckBunny.mp4', pos: 120, dur: 596 });
};
