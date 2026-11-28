/**
 * CineHomeTV — REGRAS DE NEGÓCIO (módulo puro, sem navegador e sem banco).
 *
 * Aqui ficam planos, telas simultâneas, empilhamento de planos, geração de
 * usuário/senha, bloqueio por tentativas, mensagens e texto do WhatsApp.
 * As telas e o servidor só CHAMAM estas funções: assim a regra existe em um
 * lugar só e é testada no Node (tests/unit/rules.test.js).
 *
 * Documentação em linguagem simples: docs/REGRAS_DE_NEGOCIO.md
 */
(function (root) {
  'use strict';

  /* =====================================================================
   * PLANOS
   * ===================================================================== */

  /** Os 8 planos. `soAdmin`: só o administrador pode escolher. */
  var PLANOS = {
    gratis: { nome: 'Grátis', permanente: true, soAdmin: true },
    degustacao: { nome: 'Degustação', horas: 2, soAdmin: true, telasFixas: 1 },
    mensal: { nome: 'Mensal', meses: 1 },
    trimestral: { nome: 'Trimestral', meses: 3 },
    semestral: { nome: 'Semestral', meses: 6 },
    anual: { nome: 'Anual', meses: 12 },
    '2anos': { nome: '2 Anos', meses: 24 },
    '3anos': { nome: '3 Anos', meses: 36 }
  };

  var TELAS_MIN = 1;
  var TELAS_MAX = 5;

  /** Planos que o papel informado pode ver/escolher (cliente não vê Grátis nem Degustação). */
  function planosDisponiveis(papel) {
    return Object.keys(PLANOS)
      .filter(function (id) { return papel === 'admin' || !PLANOS[id].soAdmin; })
      .map(function (id) { return Object.assign({ id: id }, PLANOS[id]); });
  }

  /* =====================================================================
   * DATAS
   * ===================================================================== */

  /** Soma meses de calendário (UTC). 31/jan + 1 mês = 28/fev (respeita o fim do mês). */
  function adicionarMeses(data, meses) {
    var d = new Date(data.getTime());
    var dia = d.getUTCDate();
    d.setUTCDate(1);
    d.setUTCMonth(d.getUTCMonth() + meses);
    var ultimo = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
    d.setUTCDate(Math.min(dia, ultimo));
    return d;
  }

  /* =====================================================================
   * PERÍODOS (assinaturas que se empilham)
   * Um período é { plano, telas, inicio: Date, fim: Date|null }  (fim null = para sempre)
   * ===================================================================== */

  function validarTelas(telas) {
    if (!Number.isInteger(telas) || telas < TELAS_MIN || telas > TELAS_MAX) {
      throw new Error('Número de telas inválido: use de ' + TELAS_MIN + ' a ' + TELAS_MAX + ' telas.');
    }
  }

  /**
   * Cria o período de um plano novo.
   * Regra: se já existe plano ativo, o novo COMEÇA QUANDO O ATUAL TERMINA
   * (ex.: faltam 2 meses e contrata 1 ano => fica com 1 ano e 2 meses).
   * Degustação e Grátis não empilham e são só do administrador (quem chama decide).
   */
  function novoPeriodo(periodos, planoId, telas, agora) {
    var plano = PLANOS[planoId];
    if (!plano) throw new Error('Plano desconhecido: ' + planoId);

    if (plano.permanente) {
      validarTelas(telas);
      return { plano: planoId, telas: telas, inicio: agora, fim: null };
    }
    if (plano.horas) {
      return { plano: planoId, telas: plano.telasFixas, inicio: agora, fim: new Date(agora.getTime() + plano.horas * 3600 * 1000) };
    }

    validarTelas(telas);
    // início = fim do último plano ainda não vencido; senão, agora
    var inicio = agora;
    (periodos || []).forEach(function (p) {
      if (p.fim && p.fim.getTime() > inicio.getTime()) inicio = p.fim;
    });
    return { plano: planoId, telas: telas, inicio: inicio, fim: adicionarMeses(inicio, plano.meses) };
  }

  /** Período que vale neste instante (ou null se não há plano ativo). */
  function planoAtivo(periodos, agora) {
    var t = agora.getTime();
    var achado = null;
    (periodos || []).forEach(function (p) {
      if (p.inicio.getTime() <= t && (p.fim === null || t < p.fim.getTime())) achado = p;
    });
    return achado;
  }

  /**
   * Quantas telas (aparelhos online ao mesmo tempo) o usuário pode usar agora.
   * Administrador: sem limite. Sem plano ativo: 0 (plano vencido).
   * As telas do plano NOVO só valem quando ele começa.
   */
  function telasPermitidas(periodos, papel, agora) {
    if (papel === 'admin') return Infinity;
    var p = planoAtivo(periodos, agora);
    return p ? p.telas : 0;
  }

  /* =====================================================================
   * CREDENCIAIS
   * ===================================================================== */

  /** Número aleatório em [0,1) criptograficamente seguro (usado por padrão). */
  function rngSeguro() {
    var c = root.crypto || (typeof require === 'function' ? require('node:crypto').webcrypto : null);
    var a = new Uint32Array(1);
    c.getRandomValues(a);
    return a[0] / 4294967296;
  }

  function seisNumeros(rng) {
    var n = Math.floor(rng() * 1000000);
    return String(n).padStart(6, '0');
  }

  /** Senha automática: 6 números. */
  function gerarSenha(rng) {
    return seisNumeros(rng || rngSeguro);
  }

  /**
   * Usuário automático: 6 números, único (chave única).
   * `existe(usuario)` diz se já está em uso; sorteia de novo até achar um livre.
   */
  function gerarUsuarioAutomatico(existe, rng) {
    var sorteio = rng || rngSeguro;
    for (var i = 0; i < 1000; i++) {
      var u = seisNumeros(sorteio);
      if (!existe(u)) return u;
    }
    throw new Error('Não foi possível gerar um usuário livre.');
  }

  /** Usuário manual: exatamente 11 números (telefone com DDD). */
  function validarUsuarioManual(usuario) {
    if (/^\d{11}$/.test(String(usuario || ''))) return { ok: true };
    return { ok: false, erro: 'O usuário precisa ter 11 números (telefone com DDD).' };
  }

  /* =====================================================================
   * TELAS ONLINE AO MESMO TEMPO
   * ===================================================================== */

  /** Sem sinal por mais que isso => o aparelho deixa de contar como online. */
  var JANELA_ONLINE_MS = 120000;

  /**
   * Decide se o aparelho pode entrar.
   * @param {Array} online lista de { id, ultimoSinal(ms) } do usuário
   * @param {string} aparelhoId código do aparelho que quer entrar
   * @param {number} limite telas permitidas (Infinity = admin; 0 = plano vencido)
   * @param {number} agora instante em ms
   */
  function podeEntrar(online, aparelhoId, limite, agora) {
    if (limite === Infinity) return { ok: true };
    if (limite <= 0) return { ok: false, motivo: 'plano_vencido' };
    var ativos = (online || []).filter(function (a) { return agora - a.ultimoSinal <= JANELA_ONLINE_MS; });
    var ja = ativos.some(function (a) { return a.id === aparelhoId; });
    if (ja || ativos.length < limite) return { ok: true };
    return { ok: false, motivo: 'limite_telas', telas: limite };
  }

  /* =====================================================================
   * BLOQUEIO POR TENTATIVAS (contra força bruta)
   * 5 falhas => bloqueia 5 min; cada nova rodada dobra (até 60 min). Sucesso zera.
   * ===================================================================== */
  function BloqueioTentativas(opcoes) {
    opcoes = opcoes || {};
    this.max = opcoes.max || 5;
    this.baseMs = opcoes.baseMs || 5 * 60000;
    this.tetoMs = opcoes.tetoMs || 60 * 60000;
    this.mapa = {};
  }

  BloqueioTentativas.prototype._get = function (chave) {
    return this.mapa[chave] || (this.mapa[chave] = { falhas: 0, rodadas: 0, ate: 0 });
  };

  /** Anota uma falha. Falhas durante um bloqueio não somam. */
  BloqueioTentativas.prototype.registrarFalha = function (chave, agora) {
    var s = this._get(chave);
    if (s.ate > agora) return;
    s.falhas += 1;
    if (s.falhas >= this.max) {
      s.rodadas += 1;
      s.falhas = 0;
      s.ate = agora + Math.min(this.baseMs * Math.pow(2, s.rodadas - 1), this.tetoMs);
    }
  };

  BloqueioTentativas.prototype.registrarSucesso = function (chave) {
    delete this.mapa[chave];
  };

  /** { bloqueado, restanteMs } */
  BloqueioTentativas.prototype.estado = function (chave, agora) {
    var s = this.mapa[chave];
    if (!s || s.ate <= agora) return { bloqueado: false, restanteMs: 0 };
    return { bloqueado: true, restanteMs: s.ate - agora };
  };

  /** Estado simples para guardar (localStorage/banco). */
  BloqueioTentativas.prototype.salvar = function () {
    return { max: this.max, baseMs: this.baseMs, tetoMs: this.tetoMs, mapa: this.mapa };
  };

  BloqueioTentativas.restaurar = function (obj) {
    var b = new BloqueioTentativas({ max: obj.max, baseMs: obj.baseMs, tetoMs: obj.tetoMs });
    b.mapa = obj.mapa || {};
    return b;
  };

  /* =====================================================================
   * MENSAGENS
   * Erro de usuário e erro de senha SEMPRE têm a mesma mensagem: nunca
   * revelar qual dos dois errou (segurança — docs/SEGURANCA.md).
   * ===================================================================== */
  var MENSAGENS = {
    credenciais: 'Usuário ou senha incorretos.',
    bloqueio: 'Muitas tentativas. Tente novamente em alguns minutos.',
    planoVencido: 'Seu plano venceu. Escolha um plano para continuar.',
    semRede: 'Não consegui conectar. Verifique a internet e tente de novo.',
    generico: 'Algo deu errado. Tente de novo.'
  };

  function mensagemDeErro(codigo, dados) {
    switch (codigo) {
      case 'credenciais':
      case 'usuario_inexistente':
      case 'senha_errada':
        return MENSAGENS.credenciais;
      case 'bloqueado':
        return MENSAGENS.bloqueio;
      case 'plano_vencido':
        return MENSAGENS.planoVencido;
      case 'sem_rede':
        return MENSAGENS.semRede;
      case 'formato_nao_suportado':
        return 'Este vídeo está em um formato que o aparelho não toca (por exemplo .mkv ou .avi). Tente outro título.';
      case 'rede_falhou':
        return 'A conexão com o servidor falhou. Verifique a internet e tente de novo.';
      case 'canal_fora_do_ar':
        return 'Este canal está fora do ar no momento. Tente outro canal.';
      case 'decodificacao':
        return 'Não foi possível reproduzir este vídeo (arquivo com problema). Tente de novo ou escolha outro.';
      case 'limite_telas':
        return 'Seu plano permite ' + ((dados && dados.telas) || 1) + ' tela(s) ao mesmo tempo e já estão em uso.';
      default:
        return MENSAGENS.generico;
    }
  }

  /* =====================================================================
   * WHATSAPP (boas-vindas ao criar usuário)
   * ===================================================================== */

  function dataBR(d) {
    var p = function (n) { return String(n).padStart(2, '0'); };
    return p(d.getUTCDate()) + '/' + p(d.getUTCMonth() + 1) + '/' + d.getUTCFullYear();
  }

  function textoBoasVindas(d) {
    var linhas = ['Bem Vindo(a) a ' + d.app + ' !'];
    if (d.plano === 'degustacao') {
      linhas.push(
        'Você terá 2 horas para testar nosso sistema.',
        'Caso goste e queira fechar um dos nossos planos, clique no botão Perfil na Home e em seguida em Plano.',
        'Você verá todos os planos disponíveis, então é só escolher e clicar nele.',
        'Será gerado um pix e após a confirmação do pagamento seu plano estará valendo automaticamente.'
      );
    } else if (d.plano === 'gratis') {
      linhas.push('Seu acesso é gratuito.');
    } else {
      var nome = (PLANOS[d.plano] || {}).nome || d.plano;
      linhas.push('Seu plano: Plano ' + nome + ', ' + d.telas + ' tela(s) ao mesmo tempo' + (d.ate ? ', válido até ' + dataBR(d.ate) : '') + '.');
      linhas.push('Para renovar ou trocar de plano, clique no botão Perfil na Home e em seguida em Plano.');
    }
    linhas.push(
      'Muito obrigado por escolher nosso App !!',
      'Abaixo estão seus dados para acessar nossa plataforma de qualquer lugar.',
      'Usuário: ' + d.usuario,
      'Senha: ' + d.senha
    );
    return linhas.join('\n');
  }

  /** Link do WhatsApp: com telefone (usuário de 11 números, Brasil +55) ou sem. */
  function linkWhatsApp(usuario, texto) {
    var t = encodeURIComponent(texto);
    return /^\d{11}$/.test(usuario) ? 'https://wa.me/55' + usuario + '?text=' + t : 'https://wa.me/?text=' + t;
  }

  /* =====================================================================
   * PLAYER
   * ===================================================================== */

  /**
   * Transforma um erro do player em um código de mensagem.
   * html5: erro do <video> (codigo 1..4). hls: erro do hls.js (hlsTipo + status HTTP).
   */
  function classificarErroDeMidia(e) {
    if (e.tipo === 'html5') {
      return { 1: 'abortado', 2: 'rede_falhou', 3: 'decodificacao', 4: 'formato_nao_suportado' }[e.codigo] || 'generico';
    }
    if (e.tipo === 'hls') {
      if (e.hlsTipo === 'networkError') return e.status === 404 || e.status === 403 ? 'canal_fora_do_ar' : 'rede_falhou';
      if (e.hlsTipo === 'mediaError') return 'decodificacao';
    }
    return 'generico';
  }

  /** Canal anterior (-1) ou próximo (+1) na lista; dá a volta nas pontas; null se não achar. */
  function canalVizinho(lista, idAtual, direcao) {
    var i = (lista || []).findIndex(function (c) { return c.id === idAtual; });
    if (i < 0) return null;
    return lista[(i + direcao + lista.length) % lista.length];
  }

  /** Posição (s) para retomar um vídeo: só se passou de 2 s e não está nos últimos 10 s. */
  function posicaoParaRetomar(h) {
    if (!h || !h.dur || h.pos <= 2 || h.pos >= h.dur - 10) return 0;
    return h.pos;
  }

  /* =====================================================================
   * RESPONSIVIDADE (TV de vários tamanhos, tablet, celular)
   * ===================================================================== */

  /**
   * Qual "regime" de layout usar:
   *  - tv: tela grande (>= 1000 px de largura e >= 500 de altura): desenho de 1280 px ampliado para a tela;
   *  - tablet: de 600 a 999 px (ou celular deitado): layout fluido com mais colunas;
   *  - phone: abaixo de 600 px: layout fluido de uma/duas colunas.
   */
  function regimeDeTela(largura, altura) {
    if (largura >= 1000 && altura >= 500) return 'tv';
    return largura >= 600 ? 'tablet' : 'phone';
  }

  /** Quanto ampliar o desenho de 1280 px na TV (1 = tamanho original; teto 3x para 4K). */
  function fatorDeZoom(largura) {
    return Math.min(largura / 1280, 3);
  }

  /**
   * Itens por página de um carrossel. `perPage` pode ser um número (valor da TV, reduzido
   * automaticamente nos outros regimes) ou { tv, tablet, phone }.
   */
  function itensPorPagina(perPage, regime) {
    if (typeof perPage === 'object' && perPage) return perPage[regime] != null ? perPage[regime] : perPage.tv;
    if (regime === 'tablet') return Math.max(2, Math.round(perPage * 0.65));
    if (regime === 'phone') return Math.max(1, Math.round(perPage * 0.4));
    return perPage;
  }

  var API = {
    regimeDeTela: regimeDeTela, fatorDeZoom: fatorDeZoom, itensPorPagina: itensPorPagina,
    classificarErroDeMidia: classificarErroDeMidia, canalVizinho: canalVizinho, posicaoParaRetomar: posicaoParaRetomar,
    PLANOS: PLANOS, TELAS_MIN: TELAS_MIN, TELAS_MAX: TELAS_MAX, JANELA_ONLINE_MS: JANELA_ONLINE_MS, MENSAGENS: MENSAGENS,
    planosDisponiveis: planosDisponiveis, adicionarMeses: adicionarMeses, novoPeriodo: novoPeriodo, planoAtivo: planoAtivo,
    telasPermitidas: telasPermitidas, gerarSenha: gerarSenha, gerarUsuarioAutomatico: gerarUsuarioAutomatico,
    validarUsuarioManual: validarUsuarioManual, podeEntrar: podeEntrar, BloqueioTentativas: BloqueioTentativas,
    mensagemDeErro: mensagemDeErro, textoBoasVindas: textoBoasVindas, linkWhatsApp: linkWhatsApp, dataBR: dataBR
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.CLRules = API;
})(typeof window !== 'undefined' ? window : globalThis);
