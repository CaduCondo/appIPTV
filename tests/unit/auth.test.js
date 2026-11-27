// Testes (escritos ANTES do código — TDD) do serviço de login e de criação de usuário.
// O serviço usa dados de TESTE em memória; depois troca para o Supabase sem mudar as telas.
const test = require('node:test');
const assert = require('node:assert/strict');
const { ServicoAuth, CONTAS_DE_TESTE } = require('../../js/auth.js');
const R = require('../../js/rules.js');

/** Armazenamento em memória e relógio controlado, para o teste não depender do navegador. */
function criar(agoraInicial = Date.parse('2026-11-27T12:00:00Z')) {
  const mem = {};
  const storage = { getItem: (k) => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); }, removeItem: (k) => { delete mem[k]; } };
  const relogio = { agora: agoraInicial };
  const s = new ServicoAuth({ storage, relogio: () => relogio.agora });
  return { s, relogio, storage };
}
const ADM = CONTAS_DE_TESTE.admin, CLI = CONTAS_DE_TESTE.cliente, VEN = CONTAS_DE_TESTE.vencido, LOT = CONTAS_DE_TESTE.lotado;

test('entra com usuário e senha certos', async () => {
  const { s } = criar();
  const r = await s.entrar(CLI.usuario, CLI.senha, 'aparelho-1');
  assert.equal(r.ok, true);
  assert.equal(s.sessao().usuario, CLI.usuario);
  assert.equal(s.sessao().papel, 'cliente');
});

test('senha errada e usuário inexistente dão EXATAMENTE a mesma resposta', async () => {
  const { s } = criar();
  const a = await s.entrar(CLI.usuario, '000000', 'a');
  const b = await s.entrar('999999', '000000', 'a');
  assert.deepEqual(a, b);
  assert.equal(R.mensagemDeErro(a.codigo), 'Usuário ou senha incorretos.');
});

test('5 erros bloqueiam; o bloqueio vale também para usuário que não existe e solta com o tempo', async () => {
  const { s, relogio } = criar();
  for (let i = 0; i < 5; i++) await s.entrar('999999', 'x', 'a');
  assert.equal((await s.entrar('999999', 'x', 'a')).codigo, 'bloqueado');
  // mesmo com a senha certa, enquanto bloqueado, não entra
  for (let i = 0; i < 5; i++) await s.entrar(CLI.usuario, 'x', 'b');
  assert.equal((await s.entrar(CLI.usuario, CLI.senha, 'b')).codigo, 'bloqueado');
  relogio.agora += 6 * 60000;
  assert.equal((await s.entrar(CLI.usuario, CLI.senha, 'b')).ok, true);
});

test('plano vencido não entra (só depois de acertar a senha)', async () => {
  const { s } = criar();
  assert.equal((await s.entrar(VEN.usuario, VEN.senha, 'a')).codigo, 'plano_vencido');
  assert.equal((await s.entrar(VEN.usuario, 'errada', 'a')).codigo, 'credenciais');
});

test('limite de telas: com a tela do plano já em uso por outro aparelho, não entra', async () => {
  const { s } = criar();
  const r = await s.entrar(LOT.usuario, LOT.senha, 'meu-aparelho');
  assert.equal(r.ok, false);
  assert.equal(r.codigo, 'limite_telas');
  assert.equal(r.telas, 1);
});

test('cliente com 2 telas aceita 2 aparelhos e recusa o 3º', async () => {
  const { s } = criar();
  assert.equal((await s.entrar(CLI.usuario, CLI.senha, 'a1')).ok, true);
  assert.equal((await s.entrar(CLI.usuario, CLI.senha, 'a2')).ok, true);
  assert.equal((await s.entrar(CLI.usuario, CLI.senha, 'a3')).codigo, 'limite_telas');
});

test('sem sinal por mais de 2 minutos, o aparelho libera a tela', async () => {
  const { s, relogio } = criar();
  await s.entrar(LOT.usuario, LOT.senha, 'x').catch(() => {});
  const { s: s2, relogio: r2 } = criar();
  await s2.entrar(CLI.usuario, CLI.senha, 'a1');
  await s2.entrar(CLI.usuario, CLI.senha, 'a2');
  r2.agora += 3 * 60000;
  assert.equal((await s2.entrar(CLI.usuario, CLI.senha, 'a3')).ok, true);
});

test('administrador entra em vários aparelhos', async () => {
  const { s } = criar();
  for (const d of ['a', 'b', 'c', 'd']) assert.equal((await s.entrar(ADM.usuario, ADM.senha, d)).ok, true);
});

test('sair derruba a sessão e libera a tela', async () => {
  const { s } = criar();
  await s.entrar(CLI.usuario, CLI.senha, 'a1');
  await s.sair();
  assert.equal(s.sessao(), null);
});

test('batimento mantém o aparelho online; aparelho derrubado é avisado', async () => {
  const { s } = criar();
  await s.entrar(CLI.usuario, CLI.senha, 'a1');
  assert.equal(s.batimento(), true);
  s.derrubarAparelho(CLI.usuario, 'a1');
  assert.equal(s.batimento(), false);
});

// ---------- criar usuário (só administrador) ----------
test('administrador cria usuário automático com 6 números e senha de 6 números', async () => {
  const { s } = criar();
  await s.entrar(ADM.usuario, ADM.senha, 'a');
  const r = await s.criarUsuario({ modo: 'auto', plano: 'mensal', telas: 2 });
  assert.equal(r.ok, true);
  assert.match(r.usuario, /^\d{6}$/);
  assert.match(r.senha, /^\d{6}$/);
  // o usuário criado consegue entrar
  const { s: s2 } = [{ s }][0];
  const e = await s.entrar(r.usuario, r.senha, 'novo');
  assert.equal(e.ok, true);
});

test('criação manual exige 11 números e recusa usuário repetido', async () => {
  const { s } = criar();
  await s.entrar(ADM.usuario, ADM.senha, 'a');
  assert.equal((await s.criarUsuario({ modo: 'manual', usuario: '123', plano: 'mensal', telas: 1 })).codigo, 'usuario_invalido');
  const ok = await s.criarUsuario({ modo: 'manual', usuario: '11999998888', plano: 'mensal', telas: 1 });
  assert.equal(ok.ok, true);
  assert.equal((await s.criarUsuario({ modo: 'manual', usuario: '11999998888', plano: 'mensal', telas: 1 })).codigo, 'usuario_existente');
});

test('degustação cria usuário com 1 tela e 2 horas', async () => {
  const { s } = criar();
  await s.entrar(ADM.usuario, ADM.senha, 'a');
  const r = await s.criarUsuario({ modo: 'auto', plano: 'degustacao' });
  assert.equal(r.ok, true);
  assert.equal(r.periodo.telas, 1);
  assert.equal(r.periodo.fim.getTime() - r.periodo.inicio.getTime(), 2 * 3600 * 1000);
});

test('quem não é administrador não cria usuário (o servidor confere, não a tela)', async () => {
  const { s } = criar();
  await s.entrar(CLI.usuario, CLI.senha, 'a');
  assert.equal((await s.criarUsuario({ modo: 'auto', plano: 'gratis', telas: 1 })).codigo, 'nao_autorizado');
});

test('sem login ninguém cria usuário', async () => {
  const { s } = criar();
  assert.equal((await s.criarUsuario({ modo: 'auto', plano: 'mensal', telas: 1 })).codigo, 'nao_autorizado');
});

test('senhas não ficam guardadas em texto', async () => {
  const { storage } = criar();
  const { s } = { s: new ServicoAuth({ storage, relogio: () => 1 }) };
  await s.entrar(CLI.usuario, CLI.senha, 'a');
  assert.ok(!storage.getItem('cl.mock.db').includes(CLI.senha));
});

// ---------- recuperar senha ----------
test('pedir recuperação responde igual para usuário que existe e que não existe', async () => {
  const { s } = criar();
  assert.deepEqual(await s.pedirRecuperacao(CLI.usuario), await s.pedirRecuperacao('999999'));
});

// ---------- contratar (empilha) ----------
test('contratar um plano com outro ativo empilha e mantém as telas atuais até o fim', async () => {
  const { s, relogio } = criar();
  await s.entrar(CLI.usuario, CLI.senha, 'a1');
  const antes = s.planoAtual();
  const r = await s.contratar({ plano: 'anual', telas: 1 });
  assert.equal(r.ok, true);
  assert.equal(r.periodo.inicio.getTime(), antes.fim.getTime());
  assert.equal(s.planoAtual().telas, 2);
});

test('cliente não pode contratar Grátis nem Degustação', async () => {
  const { s } = criar();
  await s.entrar(CLI.usuario, CLI.senha, 'a1');
  assert.equal((await s.contratar({ plano: 'gratis', telas: 1 })).codigo, 'plano_nao_permitido');
  assert.equal((await s.contratar({ plano: 'degustacao', telas: 1 })).codigo, 'plano_nao_permitido');
});
