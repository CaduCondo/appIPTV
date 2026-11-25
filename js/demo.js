/* Catálogo de demonstração: filmes de licença aberta (Blender) com vídeo de verdade + vitrine com pôsteres reais. */
CL.demoCatalog = function () {
  var A = 'assets/Demo/', G = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/';
  var movie = [
    { id: 'd1', n: 'Big Buck Bunny', y: 2008, r: 7.2, p: A + 'big-buck-bunny.jpg', c: 'free', a: 9, u: G + 'BigBuckBunny.mp4', info: { plot: 'Um coelho gigante e gentil enfrenta três roedores que decidem atormentar a floresta. Curta de animação aberto da Blender Foundation.', genre: 'Animação, Comédia', cast: [] } },
    { id: 'd2', n: 'Sintel', y: 2010, r: 7.5, p: A + 'sintel.jpg', c: 'free', a: 8, u: G + 'Sintel.mp4', info: { plot: 'Uma jovem guerreira parte em busca de um dragão que ela criou e perdeu. Curta aberto da Blender Foundation.', genre: 'Animação, Fantasia', cast: [] } },
    { id: 'd3', n: 'Tears of Steel', y: 2012, r: 6.5, p: A + 'tears-of-steel.png', c: 'free', a: 7, u: G + 'TearsOfSteel.mp4', info: { plot: 'Um grupo de guerreiros e cientistas tenta salvar o mundo de robôs na Amsterdã do futuro. Curta aberto da Blender Foundation.', genre: 'Ficção científica', cast: [] } },
    { id: 'd4', n: "Elephant's Dream", y: 2006, r: 6.2, p: A + 'elephants-dream.jpg', c: 'free', a: 6, u: G + 'ElephantsDream.mp4', info: { plot: 'Dois personagens exploram uma máquina gigantesca e misteriosa. Primeiro curta aberto da Blender Foundation.', genre: 'Animação', cast: [] } },
    { id: 'v1', n: 'A Origem', y: 2010, r: 8.8, p: A + 'inception.jpg', c: 'demo', a: 5 },
    { id: 'v2', n: 'Batman: O Cavaleiro das Trevas Ressurge', y: 2012, r: 8.4, p: A + 'batman-cavaleiro-das-trevas-ressurge.jpg', c: 'demo', a: 4 },
    { id: 'v3', n: 'Mad Max: Estrada da Fúria', y: 2015, r: 8.1, p: A + 'mad-max-estrada-da-furia.jpg', c: 'demo', a: 3 },
    { id: 'v4', n: 'O Regresso', y: 2015, r: 8.0, p: A + 'o-regresso.jpg', c: 'demo', a: 2 },
    { id: 'v5', n: 'Dunkirk', y: 2017, r: 7.8, p: A + 'dunkirk.jpg', c: 'demo', a: 1 },
    { id: 'v6', n: 'Venom', y: 2018, r: 6.6, p: A + 'venom.png', c: 'demo', a: 1 },
    { id: 'v7', n: 'Homem-Aranha: Sem Volta para Casa', y: 2021, r: 8.2, p: A + 'homem-aranha-sem-volta-para-casa.jpg', c: 'demo', a: 1 }
  ];
  var P = 'assets/Pessoas/';
  var eps = { '1': [], '2': [] };
  var t1 = ['Piloto', 'Lealdade', 'Fogo cruzado', 'O acordo', 'Sangue e tinta', 'Maré baixa', 'Duas famílias', 'Ponto cego', 'Terra queimada', 'Final'];
  var t2 = ['Retorno', 'Novas regras', 'O preço', 'Fronteira', 'Birdland', 'A Different Corner', 'Ace of Spades', "We Don't Talk Anymore", 'Nervous Breakdown'];
  t1.forEach(function (t, i) { eps['1'].push({ id: 's1e' + (i + 1), num: i + 1, title: t, plot: '' }); });
  t2.forEach(function (t, i) { eps['2'].push({ id: 's2e' + (i + 1), num: i + 1, title: t, plot: '' }); });
  var series = [{
    id: 'sd1', n: 'Terra da Máfia', y: 2025, r: 8.0, p: A + 'terra-da-mafia.jpg', c: 'drama', a: 10, eps: eps,
    info: {
      plot: 'O poder está em disputa quando duas famílias do crime se chocam numa batalha que ameaça derrubar impérios e arruinar vidas. No meio está Harry Da Souza, um "resolvedor de problemas" que sabe bem onde a lealdade está quando as forças opostas colidem.',
      genre: 'Crime, Drama',
      cast: [
        { name: 'Tom Hardy', character: 'Harry Da Souza', img: P + 'tom-hardy.jpg' },
        { name: 'Pierce Brosnan', character: 'Conrad Harrigan', img: P + 'pierce-brosnan.jpg' },
        { name: 'Helen Mirren', character: 'Maeve Harrigan', img: P + 'helen-mirren.jpg' },
        { name: 'Paddy Considine', character: 'Kevin Harrigan', img: P + 'paddy-considine.jpg' },
        { name: 'Joanne Froggatt', character: 'Jan Da Souza', img: P + 'joanne-froggatt.jpg' },
        { name: 'Lara Pulver', character: '', img: P + 'lara-pulver.jpg' },
        { name: 'Anson Boon', character: '', img: P + 'anson-boon.jpg' },
        { name: 'Jasmine Jobson', character: '', img: P + 'jasmine-jobson.jpg' }
      ]
    }
  }];
  var live = [
    { id: 'l1', n: 'Canal de teste (HLS 1)', p: '', c: 'test', a: 2, u: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
    { id: 'l2', n: 'Canal de teste (HLS 2)', p: '', c: 'test', a: 1, u: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_4x3/bipbop_4x3_variant.m3u8' }
  ];
  return {
    meta: { kind: 'demo', name: 'Demonstração', status: 'Active', exp: 0 },
    movie: movie, series: series, live: live,
    cats: {
      movie: [{ id: 'free', name: 'Cinema livre (com vídeo)' }, { id: 'demo', name: 'Vitrine (só pôsteres)' }],
      series: [{ id: 'drama', name: 'Drama' }],
      live: [{ id: 'test', name: 'Canais de teste' }]
    }
  };
};
