/**
 * Cinema Livre — SERVIÇO DE LOGIN E USUÁRIOS.
 *
 * HOJE usa dados de TESTE guardados no navegador (para o Cadu navegar e para os
 * testes rodarem sem banco). DEPOIS troca para o Supabase (issue #22) sem mudar
 * as telas: elas só chamam os métodos desta classe.
 *
 * Princípios de segurança já valendo aqui (docs/SEGURANCA.md):
 *  - senha só como hash (nunca texto);
 *  - erro de usuário e de senha dão a MESMA resposta;
 *  - bloqueio por tentativas (também para usuário que não existe);
 *  - quem pode criar usuário é conferido NO SERVIÇO (o "servidor"), não na tela;
 *  - limite de telas online ao mesmo tempo e batimento do aparelho.
 *
 * Regras de negócio em js/rules.js e docs/REGRAS_DE_NEGOCIO.md.
 */
(function (root) {
  'use strict';

  var R = root.CLRules || (typeof require === 'function' ? require('./rules.js') : null);
  var DIA = 86400000;
  var CHAVE_DB = 'cl.mock.db';
  var CHAVE_SESSAO = 'cl.sessao';
  var CHAVE_BLOQUEIO = 'cl.mock.bloqueio';

  /**
   * Contas de TESTE (só existem neste modo de teste; NÃO são as contas reais).
   * A senha do administrador de verdade nunca entra no código.
   */
  var CONTAS_DE_TESTE = {
    admin: { usuario: '010101', senha: '123456', papel: 'admin', descricao: 'Administrador de teste (plano Grátis, sem limite de telas)' },
    cliente: { usuario: '111111', senha: '222222', papel: 'cliente', descricao: 'Cliente de teste (plano Mensal, 2 telas)' },
    vencido: { usuario: '333333', senha: '444444', papel: 'cliente', descricao: 'Cliente de teste com plano vencido' },
    lotado: { usuario: '555555', senha: '666666', papel: 'cliente', descricao: 'Cliente de teste (1 tela) com a tela em uso por outro aparelho' }
  };

  /** Hash SHA-256 com sal (no navegador e no Node). Em contexto sem SubtleCrypto cai num hash simples (só no modo de teste). */
  function hash(texto) {
    var c = root.crypto || (typeof require === 'function' ? require('node:crypto').webcrypto : null);
    if (c && c.subtle) {
      return c.subtle.digest('SHA-256', new TextEncoder().encode(texto)).then(function (buf) {
        return Array.prototype.map.call(new Uint8Array(buf), function (b) { return b.toString(16).padStart(2, '0'); }).join('');
      });
    }
    var h = 5381;
    for (var i = 0; i < texto.length; i++) h = ((h << 5) + h + texto.charCodeAt(i)) >>> 0;
    return Promise.resolve('x' + h.toString(16));
  }

  function ServicoAuth(opcoes) {
    this.storage = opcoes.storage;
    this.agora = opcoes.relogio || function () { return Date.now(); };
    this.modo = 'teste';
    this.MSG_RECUPERACAO = 'Se houver um cadastro, enviamos um código para o e-mail dele.';
  }

  /* ---------- armazenamento (troca para o Supabase depois) ---------- */

  ServicoAuth.prototype._ler = function (chave, padrao) {
    var v = this.storage.getItem(chave);
    return v ? JSON.parse(v) : padrao;
  };
  ServicoAuth.prototype._gravar = function (chave, valor) {
    this.storage.setItem(chave, JSON.stringify(valor));
  };

  /** Banco de teste: cria as contas de teste na primeira vez. */
  ServicoAuth.prototype._db = function () {
    var db = this._ler(CHAVE_DB, null);
    if (db) return Promise.resolve(db);
    var self = this, agora = this.agora();
    db = { usuarios: {}, aparelhos: {} };
    var criar = function (c, periodo) {
      var sal = 's' + c.usuario;
      return hash(sal + ':' + c.senha).then(function (h) {
        db.usuarios[c.usuario] = { usuario: c.usuario, papel: c.papel, sal: sal, senhaHash: h, email: null, periodos: [periodo] };
      });
    };
    return Promise.all([
      criar(CONTAS_DE_TESTE.admin, { plano: 'gratis', telas: 1, inicio: agora - DIA, fim: null }),
      criar(CONTAS_DE_TESTE.cliente, { plano: 'mensal', telas: 2, inicio: agora - 5 * DIA, fim: agora + 25 * DIA }),
      criar(CONTAS_DE_TESTE.vencido, { plano: 'mensal', telas: 1, inicio: agora - 40 * DIA, fim: agora - DIA }),
      criar(CONTAS_DE_TESTE.lotado, { plano: 'mensal', telas: 1, inicio: agora - 5 * DIA, fim: agora + 25 * DIA })
    ]).then(function () {
      // aparelho "fixo": simula outro aparelho sempre online na conta lotada
      db.aparelhos[CONTAS_DE_TESTE.lotado.usuario] = [{ id: 'outro-aparelho', ultimoSinal: agora, fixo: true }];
      self._gravar(CHAVE_DB, db);
      return db;
    });
  };
  ServicoAuth.prototype._salvarDb = function (db) { this._gravar(CHAVE_DB, db); };

  /** Períodos do usuário como objetos com Date (o que o módulo de regras espera). */
  function periodosComoDatas(u) {
    return (u.periodos || []).map(function (p) {
      return { plano: p.plano, telas: p.telas, inicio: new Date(p.inicio), fim: p.fim === null ? null : new Date(p.fim) };
    });
  }
  function periodoParaGravar(p) {
    return { plano: p.plano, telas: p.telas, inicio: p.inicio.getTime(), fim: p.fim === null ? null : p.fim.getTime() };
  }

  ServicoAuth.prototype._bloqueio = function () {
    var o = this._ler(CHAVE_BLOQUEIO, null);
    return o ? R.BloqueioTentativas.restaurar(o) : new R.BloqueioTentativas();
  };

  /* ---------- login ---------- */

  /**
   * Tenta entrar. Resultados: { ok:true } ou { ok:false, codigo } com codigo em
   * credenciais | bloqueado | plano_vencido | limite_telas (+ telas).
   * Use R.mensagemDeErro(codigo) para o texto.
   */
  ServicoAuth.prototype.entrar = function (usuario, senha, aparelhoId) {
    var self = this, agora = this.agora();
    usuario = String(usuario || '');
    var bloq = this._bloqueio();
    var chaves = ['u:' + usuario, 'd:' + aparelhoId];
    var salvarBloqueio = function () { self._gravar(CHAVE_BLOQUEIO, bloq.salvar()); };

    if (chaves.some(function (k) { return bloq.estado(k, agora).bloqueado; })) {
      return Promise.resolve({ ok: false, codigo: 'bloqueado' });
    }
    return this._db().then(function (db) {
      var u = db.usuarios[usuario];
      // calcula o hash mesmo quando o usuário não existe (tempo parecido, não vaza se existe)
      return hash((u ? u.sal : 'sx') + ':' + String(senha || '')).then(function (h) {
        if (!u || h !== u.senhaHash) {
          chaves.forEach(function (k) { bloq.registrarFalha(k, agora); });
          salvarBloqueio();
          return { ok: false, codigo: 'credenciais' };
        }
        chaves.forEach(function (k) { bloq.registrarSucesso(k); });
        salvarBloqueio();

        var periodos = periodosComoDatas(u);
        var limite = R.telasPermitidas(periodos, u.papel, new Date(agora));
        var lista = (db.aparelhos[usuario] || []).map(function (a) { return { id: a.id, ultimoSinal: a.fixo ? agora : a.ultimoSinal }; });
        var d = R.podeEntrar(lista, aparelhoId, limite, agora);
        if (!d.ok) return d.motivo === 'plano_vencido' ? { ok: false, codigo: 'plano_vencido' } : { ok: false, codigo: 'limite_telas', telas: d.telas };

        var aps = (db.aparelhos[usuario] || []).filter(function (a) { return a.id !== aparelhoId; });
        aps.push({ id: aparelhoId, ultimoSinal: agora });
        db.aparelhos[usuario] = aps;
        self._salvarDb(db);
        self._gravar(CHAVE_SESSAO, { usuario: usuario, papel: u.papel, aparelhoId: aparelhoId, entrouEm: agora });
        return { ok: true, papel: u.papel };
      });
    });
  };

  /** Sessão atual ({usuario, papel, aparelhoId}) ou null. */
  ServicoAuth.prototype.sessao = function () { return this._ler(CHAVE_SESSAO, null); };

  /** Sai e libera a tela do aparelho. */
  ServicoAuth.prototype.sair = function () {
    var s = this.sessao(), self = this;
    this.storage.removeItem(CHAVE_SESSAO);
    return this._db().then(function (db) {
      if (s && db.aparelhos[s.usuario]) {
        db.aparelhos[s.usuario] = db.aparelhos[s.usuario].filter(function (a) { return a.id !== s.aparelhoId; });
        self._salvarDb(db);
      }
    });
  };

  /**
   * Batimento: o app chama a cada ~30 s para dizer "estou aberto".
   * Devolve false se o aparelho foi derrubado (aí o app deve sair).
   */
  ServicoAuth.prototype.batimento = function () {
    var s = this.sessao();
    if (!s) return false;
    var db = this._ler(CHAVE_DB, null);
    if (!db) return false;
    var aps = db.aparelhos[s.usuario] || [], achou = false;
    for (var i = 0; i < aps.length; i++) if (aps[i].id === s.aparelhoId) { aps[i].ultimoSinal = this.agora(); achou = true; }
    if (!achou) return false;
    this._salvarDb(db);
    return true;
  };

  /** (Administrador/teste) tira um aparelho de online. */
  ServicoAuth.prototype.derrubarAparelho = function (usuario, aparelhoId) {
    var db = this._ler(CHAVE_DB, null);
    if (!db) return;
    db.aparelhos[usuario] = (db.aparelhos[usuario] || []).filter(function (a) { return a.id !== aparelhoId; });
    this._salvarDb(db);
  };

  /* ---------- planos ---------- */

  /** Período ativo do usuário logado (com Date) ou null. */
  ServicoAuth.prototype.planoAtual = function () {
    var s = this.sessao(), db = this._ler(CHAVE_DB, null);
    if (!s || !db || !db.usuarios[s.usuario]) return null;
    return R.planoAtivo(periodosComoDatas(db.usuarios[s.usuario]), new Date(this.agora()));
  };

  /** Todos os períodos (atual e futuros) do usuário logado. */
  ServicoAuth.prototype.periodos = function () {
    var s = this.sessao(), db = this._ler(CHAVE_DB, null);
    if (!s || !db || !db.usuarios[s.usuario]) return [];
    return periodosComoDatas(db.usuarios[s.usuario]);
  };

  /** Contrata um plano para o usuário logado (empilha). Cliente não escolhe Grátis nem Degustação. */
  ServicoAuth.prototype.contratar = function (dados) {
    var s = this.sessao(), self = this;
    if (!s) return Promise.resolve({ ok: false, codigo: 'nao_autorizado' });
    return this._db().then(function (db) {
      var u = db.usuarios[s.usuario];
      var plano = R.PLANOS[dados.plano];
      if (!u || !plano) return { ok: false, codigo: 'plano_nao_permitido' };
      if (plano.soAdmin && u.papel !== 'admin') return { ok: false, codigo: 'plano_nao_permitido' };
      var p;
      try { p = R.novoPeriodo(periodosComoDatas(u), dados.plano, dados.telas, new Date(self.agora())); } catch (e) { return { ok: false, codigo: 'telas_invalidas' }; }
      u.periodos.push(periodoParaGravar(p));
      self._salvarDb(db);
      return { ok: true, periodo: p };
    });
  };

  /* ---------- administrador: criar usuário ---------- */

  /**
   * Cria usuário. SÓ administrador (conferido aqui, não na tela).
   * dados: { modo:'auto'|'manual', usuario (manual), plano, telas }
   * Resultado: { ok:true, usuario, senha, periodo } ou { ok:false, codigo }
   */
  ServicoAuth.prototype.criarUsuario = function (dados) {
    var s = this.sessao(), self = this;
    if (!s) return Promise.resolve({ ok: false, codigo: 'nao_autorizado' });
    return this._db().then(function (db) {
      var adm = db.usuarios[s.usuario];
      if (!adm || adm.papel !== 'admin') return { ok: false, codigo: 'nao_autorizado' };
      if (!R.PLANOS[dados.plano]) return { ok: false, codigo: 'plano_invalido' };

      var usuario;
      if (dados.modo === 'manual') {
        var v = R.validarUsuarioManual(dados.usuario);
        if (!v.ok) return { ok: false, codigo: 'usuario_invalido', erro: v.erro };
        if (db.usuarios[dados.usuario]) return { ok: false, codigo: 'usuario_existente' };
        usuario = dados.usuario;
      } else {
        usuario = R.gerarUsuarioAutomatico(function (x) { return !!db.usuarios[x]; });
      }
      var periodo;
      try { periodo = R.novoPeriodo([], dados.plano, dados.telas, new Date(self.agora())); } catch (e) { return { ok: false, codigo: 'telas_invalidas' }; }

      var senha = R.gerarSenha(), sal = 's' + usuario + Math.floor(Math.random() * 1e6);
      return hash(sal + ':' + senha).then(function (h) {
        db.usuarios[usuario] = { usuario: usuario, papel: 'cliente', sal: sal, senhaHash: h, email: null, periodos: [periodoParaGravar(periodo)], criadoPor: s.usuario };
        self._salvarDb(db);
        return { ok: true, usuario: usuario, senha: senha, periodo: periodo };
      });
    });
  };

  /* ---------- esqueci minha senha ---------- */

  /** Sempre a mesma resposta, exista ou não o usuário (não revela cadastros). */
  ServicoAuth.prototype.pedirRecuperacao = function (usuario) {
    return Promise.resolve({ ok: true, mensagem: this.MSG_RECUPERACAO });
  };

  var API = { ServicoAuth: ServicoAuth, CONTAS_DE_TESTE: CONTAS_DE_TESTE };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.CLAuth = API;
})(typeof window !== 'undefined' ? window : globalThis);
