// Testes (escritos ANTES do código — TDD) das regras de negócio: ver docs/REGRAS_DE_NEGOCIO.md
const test = require('node:test');
const assert = require('node:assert/strict');
const R = require('../../js/rules.js');

const D = (s) => new Date(s + 'T12:00:00Z'); // data fixa para os testes

// ---------- planos ----------
test('existem os 8 planos com a duração certa', () => {
  const ids = Object.keys(R.PLANOS);
  assert.deepEqual(ids, ['gratis', 'degustacao', 'mensal', 'trimestral', 'semestral', 'anual', '2anos', '3anos']);
  assert.equal(R.PLANOS.mensal.meses, 1);
  assert.equal(R.PLANOS.trimestral.meses, 3);
  assert.equal(R.PLANOS.semestral.meses, 6);
  assert.equal(R.PLANOS.anual.meses, 12);
  assert.equal(R.PLANOS['2anos'].meses, 24);
  assert.equal(R.PLANOS['3anos'].meses, 36);
  assert.equal(R.PLANOS.degustacao.horas, 2);
  assert.equal(R.PLANOS.gratis.permanente, true);
});

test('usuário comum não vê Grátis nem Degustação; administrador vê todos', () => {
  assert.deepEqual(R.planosDisponiveis('cliente').map((p) => p.id), ['mensal', 'trimestral', 'semestral', 'anual', '2anos', '3anos']);
  assert.equal(R.planosDisponiveis('admin').length, 8);
});

// ---------- datas ----------
test('adicionarMeses respeita o fim do mês', () => {
  assert.equal(R.adicionarMeses(D('2026-01-31'), 1).toISOString().slice(0, 10), '2026-02-28');
  assert.equal(R.adicionarMeses(D('2026-11-27'), 12).toISOString().slice(0, 10), '2027-11-27');
});

// ---------- períodos e empilhamento ----------
test('sem plano ativo, o novo plano começa agora', () => {
  const p = R.novoPeriodo([], 'mensal', 2, D('2026-11-27'));
  assert.equal(p.inicio.toISOString().slice(0, 10), '2026-11-27');
  assert.equal(p.fim.toISOString().slice(0, 10), '2026-12-27');
  assert.equal(p.telas, 2);
});

test('faltam 2 meses e contrata 1 ano: começa no fim do atual e dura 1 ano (total 1 ano e 2 meses)', () => {
  const atual = [{ plano: 'mensal', telas: 3, inicio: D('2026-10-27'), fim: D('2027-01-27') }];
  const p = R.novoPeriodo(atual, 'anual', 1, D('2026-11-27'));
  assert.equal(p.inicio.toISOString().slice(0, 10), '2027-01-27');
  assert.equal(p.fim.toISOString().slice(0, 10), '2028-01-27');
});

test('plano vencido não empilha: o novo começa agora', () => {
  const velho = [{ plano: 'mensal', telas: 1, inicio: D('2026-01-01'), fim: D('2026-02-01') }];
  assert.equal(R.novoPeriodo(velho, 'mensal', 1, D('2026-11-27')).inicio.toISOString().slice(0, 10), '2026-11-27');
});

test('as telas do plano novo só valem quando ele começa', () => {
  const atual = { plano: 'mensal', telas: 3, inicio: D('2026-11-01'), fim: D('2027-01-27') };
  const novo = R.novoPeriodo([atual], 'anual', 1, D('2026-11-27'));
  const lista = [atual, novo];
  assert.equal(R.telasPermitidas(lista, 'cliente', D('2026-12-01')), 3);
  assert.equal(R.telasPermitidas(lista, 'cliente', D('2027-02-01')), 1);
});

test('administrador não tem limite de telas', () => {
  assert.equal(R.telasPermitidas([], 'admin', D('2026-11-27')), Infinity);
});

test('sem plano ativo, o usuário comum tem 0 telas (plano vencido)', () => {
  assert.equal(R.telasPermitidas([], 'cliente', D('2026-11-27')), 0);
  assert.equal(R.planoAtivo([], D('2026-11-27')), null);
});

test('degustação dura 2 horas, tem 1 tela e ignora as telas pedidas', () => {
  const agora = new Date('2026-11-27T10:00:00Z');
  const p = R.novoPeriodo([], 'degustacao', 5, agora);
  assert.equal(p.telas, 1);
  assert.equal(p.fim.toISOString(), '2026-11-27T12:00:00.000Z');
});

test('grátis é para sempre', () => {
  const p = R.novoPeriodo([], 'gratis', 3, D('2026-11-27'));
  assert.equal(p.fim, null);
  assert.equal(R.planoAtivo([p], D('2099-01-01')).plano, 'gratis');
});

test('telas inválidas (0 ou 6) são recusadas', () => {
  assert.throws(() => R.novoPeriodo([], 'mensal', 0, D('2026-11-27')), /telas/i);
  assert.throws(() => R.novoPeriodo([], 'mensal', 6, D('2026-11-27')), /telas/i);
});

// ---------- credenciais ----------
test('senha automática tem 6 números', () => {
  for (let i = 0; i < 50; i++) assert.match(R.gerarSenha(), /^\d{6}$/);
});

test('usuário automático tem 6 números e é único', () => {
  const usados = new Set();
  for (let i = 0; i < 200; i++) {
    const u = R.gerarUsuarioAutomatico((x) => usados.has(x));
    assert.match(u, /^\d{6}$/);
    assert.ok(!usados.has(u));
    usados.add(u);
  }
});

test('usuário automático sorteia de novo quando já existe', () => {
  const seq = [0.1, 0.1, 0.5];
  let i = 0;
  const rng = () => seq[Math.min(i++, seq.length - 1)];
  const u = R.gerarUsuarioAutomatico((x) => x === '100000', rng);
  assert.notEqual(u, '100000');
});

test('usuário manual precisa ter exatamente 11 números', () => {
  assert.equal(R.validarUsuarioManual('11999998888').ok, true);
  assert.equal(R.validarUsuarioManual('1199999888').ok, false);
  assert.equal(R.validarUsuarioManual('119999988888').ok, false);
  assert.equal(R.validarUsuarioManual('1199999888a').ok, false);
  assert.equal(R.validarUsuarioManual('').ok, false);
  assert.match(R.validarUsuarioManual('123').erro, /11/);
});

// ---------- telas online ----------
test('aparelho novo entra se há vaga; sem vaga é recusado', () => {
  const agora = 1_000_000;
  const online = [{ id: 'a', ultimoSinal: agora - 10_000 }];
  assert.equal(R.podeEntrar(online, 'b', 1, agora).ok, false);
  assert.equal(R.podeEntrar(online, 'b', 2, agora).ok, true);
});

test('o mesmo aparelho pode voltar a entrar mesmo com o limite cheio', () => {
  const agora = 1_000_000;
  assert.equal(R.podeEntrar([{ id: 'a', ultimoSinal: agora - 10_000 }], 'a', 1, agora).ok, true);
});

test('aparelho sem sinal há mais de 2 minutos deixa de contar como online', () => {
  const agora = 1_000_000;
  const online = [{ id: 'a', ultimoSinal: agora - 121_000 }];
  assert.equal(R.podeEntrar(online, 'b', 1, agora).ok, true);
});

test('administrador entra sempre; limite 0 (plano vencido) nunca', () => {
  const agora = 1;
  assert.equal(R.podeEntrar([{ id: 'a', ultimoSinal: agora }, { id: 'b', ultimoSinal: agora }], 'c', Infinity, agora).ok, true);
  assert.equal(R.podeEntrar([], 'a', 0, agora).ok, false);
});

// ---------- bloqueio por tentativas ----------
test('bloqueia depois de 5 falhas e libera depois do tempo', () => {
  const b = new R.BloqueioTentativas();
  const t0 = 1_000_000;
  for (let i = 0; i < 4; i++) b.registrarFalha('u1', t0);
  assert.equal(b.estado('u1', t0).bloqueado, false);
  b.registrarFalha('u1', t0);
  assert.equal(b.estado('u1', t0 + 1000).bloqueado, true);
  assert.equal(b.estado('u1', t0 + 5 * 60_000 + 1).bloqueado, false);
});

test('o bloqueio cresce a cada nova rodada de falhas e o sucesso zera', () => {
  const b = new R.BloqueioTentativas();
  let t = 1_000_000;
  for (let i = 0; i < 5; i++) b.registrarFalha('u', t);
  t += 5 * 60_000 + 1;
  for (let i = 0; i < 5; i++) b.registrarFalha('u', t);
  assert.ok(b.estado('u', t + 1).restanteMs > 5 * 60_000);
  b.registrarSucesso('u');
  assert.equal(b.estado('u', t + 1).bloqueado, false);
});

test('o estado do bloqueio pode ser salvo e restaurado', () => {
  const b = new R.BloqueioTentativas();
  for (let i = 0; i < 5; i++) b.registrarFalha('u', 1000);
  const b2 = R.BloqueioTentativas.restaurar(JSON.parse(JSON.stringify(b.salvar())));
  assert.equal(b2.estado('u', 2000).bloqueado, true);
});

// ---------- mensagens ----------
test('qualquer erro de login mostra a mesma mensagem (não revela qual errou)', () => {
  const m = R.MENSAGENS;
  assert.equal(R.mensagemDeErro('usuario_inexistente'), m.credenciais);
  assert.equal(R.mensagemDeErro('senha_errada'), m.credenciais);
  assert.equal(m.credenciais, 'Usuário ou senha incorretos.');
});

test('as demais mensagens são claras', () => {
  assert.match(R.mensagemDeErro('bloqueado'), /Muitas tentativas/);
  assert.match(R.mensagemDeErro('plano_vencido'), /plano venceu/i);
  assert.match(R.mensagemDeErro('sem_rede'), /conectar/i);
  assert.match(R.mensagemDeErro('limite_telas', { telas: 2 }), /2 tela\(s\)/);
  assert.equal(R.mensagemDeErro('qualquer_coisa_nova'), R.MENSAGENS.generico);
});

// ---------- WhatsApp ----------
test('mensagem de degustação fala das 2 horas e inclui usuário e senha', () => {
  const t = R.textoBoasVindas({ app: 'CineHomeTV', plano: 'degustacao', usuario: '123456', senha: '654321' });
  assert.match(t, /Bem Vindo\(a\) a CineHomeTV/);
  assert.match(t, /2 horas/);
  assert.match(t, /Usuário: 123456/);
  assert.match(t, /Senha: 654321/);
});

test('mensagem de plano pago informa plano, telas e validade', () => {
  const t = R.textoBoasVindas({ app: 'CineHomeTV', plano: 'anual', telas: 2, ate: D('2027-11-27'), usuario: '11999998888', senha: '111222' });
  assert.match(t, /Plano Anual/);
  assert.match(t, /2 tela/);
  assert.match(t, /27\/11\/2027/);
});

test('link do WhatsApp usa o telefone quando o usuário é de 11 números', () => {
  assert.match(R.linkWhatsApp('11999998888', 'oi'), /^https:\/\/wa\.me\/5511999998888\?text=oi$/);
  assert.match(R.linkWhatsApp('123456', 'olá mundo'), /^https:\/\/wa\.me\/\?text=ol%C3%A1%20mundo$/);
});
