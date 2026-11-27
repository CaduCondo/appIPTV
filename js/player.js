/**
 * CineHomeTV — REPRODUTOR (player).
 *
 * Classe `Reprodutor`: toca filme, episódio e canal ao vivo (HLS); mostra
 * mensagens claras por tipo de erro com "Tentar de novo"; retoma de onde
 * parou; troca de canal pelas setas ↑ ↓ (ao vivo).
 * As decisões (qual erro é qual, quando retomar, qual o próximo canal) vêm de
 * js/rules.js, testadas no Node. Aqui só ficam as ligações com a tela.
 */
(function () {
  'use strict';
  var R = window.CLRules;

  /** Lê os parâmetros da URL; se vier só `key`, busca no histórico do perfil. */
  function lerParametros() {
    var q = new URLSearchParams(location.search);
    if (q.get('key') && !q.get('u')) {
      var e = CL.history().filter(function (x) { return x.key === q.get('key'); })[0];
      if (e) q = new URLSearchParams({ u: e.u || '', title: e.title, p: e.p || '', t: e.t, id: e.id, key: e.key, resume: q.get('resume') || '', s: e.ep ? e.ep.s : '', n: e.ep ? e.ep.n : '', eid: e.ep ? e.ep.eid : '' });
    }
    return q;
  }

  class Reprodutor {
    constructor(el) {
      this.v = el.video; this.ov = el.overlay; this.st = el.status;
      this.q = lerParametros();
      this.url = this.q.get('u'); this.titulo = this.q.get('title') || '';
      this.tipo = this.q.get('t') || 'movie'; this.key = this.q.get('key');
      this.hls = null; this.ultimoSalvo = 0; this.lista = [];
    }

    iniciar() {
      var self = this;
      document.getElementById('ttl').textContent = this.titulo;
      document.title = this.titulo + ' · CineHomeTV';
      document.getElementById('back').onclick = function () { self.voltar(); };
      if (this.tipo === 'live') this._prepararTroca();
      this.v.addEventListener('error', function () { self._erro({ tipo: 'html5', codigo: self.v.error ? self.v.error.code : 0 }); });
      this.v.addEventListener('loadedmetadata', function () { self._retomar(); });
      this.v.addEventListener('timeupdate', function () { var n = Date.now(); if (n - self.ultimoSalvo > 5000) { self.ultimoSalvo = n; self._salvar(); } });
      this.v.addEventListener('pause', function () { self._salvar(); });
      window.addEventListener('pagehide', function () { self._salvar(); });
      this._teclas(); this._despertar();
      if (!this.url) return this._mostrar('Este título é só demonstração e não tem vídeo. Os da categoria "Cinema livre" e os canais de teste tocam de verdade.', false);
      CL.ready.then(function () { self._carregar(); });
    }

    /** Liga o vídeo à fonte (arquivo direto ou HLS). Usado também por "Tentar de novo". */
    _carregar() {
      this._limpar();
      var isHls = /\.m3u8(\?|$)/i.test(this.url), self = this;
      if (this.hls) { this.hls.destroy(); this.hls = null; }
      if (isHls && window.Hls && Hls.isSupported()) {
        var src = CL.hasProxy ? '/proxy?url=' + encodeURIComponent(this.url) : this.url;
        this.hls = new Hls({ maxBufferLength: 30 });
        this.hls.on(Hls.Events.ERROR, function (ev, d) {
          if (d.fatal) self._erro({ tipo: 'hls', hlsTipo: d.type, status: d.response ? d.response.code : 0 });
        });
        this.hls.loadSource(src); this.hls.attachMedia(this.v);
      } else {
        this.v.src = this.url;
      }
      this.v.play().catch(function () { /* o navegador pode exigir toque para começar; os controles aparecem */ });
    }

    _erro(info) {
      var codigo = R.classificarErroDeMidia(info);
      if (codigo === 'abortado') return;
      this._mostrar(R.mensagemDeErro(codigo), true);
    }

    _mostrar(texto, comBotao) {
      this.st.innerHTML = '';
      var caixa = document.createElement('div'); caixa.className = 'msg err'; caixa.setAttribute('role', 'alert'); caixa.textContent = texto;
      this.st.appendChild(caixa);
      if (comBotao) {
        var self = this, b = document.createElement('button');
        b.type = 'button'; b.className = 'cl-btn'; b.id = 'retry'; b.style.marginTop = '12px'; b.textContent = 'Tentar de novo';
        b.onclick = function () { self._carregar(); };
        this.st.appendChild(b); b.focus();
      }
    }
    _limpar() { this.st.innerHTML = ''; }

    /** Retoma de onde parou (se o endereço pediu e a regra permitir). */
    _retomar() {
      if (!this.q.get('resume') || this.tipo === 'live') return;
      var h = CL.get('p.' + (CL.profile() || {}).id + '.hist', {})[this.key];
      var pos = R.posicaoParaRetomar(h);
      if (pos) this.v.currentTime = pos;
    }

    _salvar() {
      if (!this.key) return;
      var base = { key: this.key, t: this.tipo, id: this.q.get('id'), title: this.titulo, p: this.q.get('p'), u: this.url };
      if (this.tipo === 'live') return CL.saveProgress(Object.assign(base, { pos: 0, dur: 0 }));
      if (!(this.v.duration > 0)) return;
      CL.saveProgress(Object.assign(base, { pos: this.v.currentTime, dur: this.v.duration, ep: this.q.get('eid') ? { s: this.q.get('s'), n: this.q.get('n'), eid: this.q.get('eid') } : undefined }));
    }

    /** Ao vivo: lista os canais da mesma categoria para trocar com ↑ ↓. */
    _prepararTroca() {
      var self = this;
      CL.loadKind('live').then(function (todos) {
        var atual = todos.filter(function (c) { return c.id === self.q.get('id'); })[0];
        self.lista = atual ? todos.filter(function (c) { return c.c === atual.c; }) : [];
        if (self.lista.length > 1) document.getElementById('dica').textContent = '↑ ↓ trocam de canal';
      });
    }

    zapear(direcao) {
      var prox = R.canalVizinho(this.lista, this.q.get('id'), direcao);
      if (!prox) return;
      var u = CL.streamUrl('live', prox);
      location.replace('player.html?' + new URLSearchParams({ u: u, title: prox.n, p: prox.p || '', t: 'live', id: prox.id, key: 'live:' + prox.id }));
    }

    voltar() { history.length > 1 ? history.back() : (location.href = 'home.html'); }

    _teclas() {
      var self = this;
      document.addEventListener('keydown', function (e) {
        var foco = document.activeElement;
        if (e.key === 'Escape' || e.key === 'Backspace') return self.voltar();
        if (foco && foco.tagName === 'BUTTON' && (e.key === 'Enter' || e.key === ' ')) return;
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); self.v.paused ? self.v.play() : self.v.pause(); }
        if (self.tipo === 'live') {
          if (e.key === 'ArrowUp') { e.preventDefault(); self.zapear(-1); }
          if (e.key === 'ArrowDown') { e.preventDefault(); self.zapear(1); }
        } else {
          if (e.key === 'ArrowRight') self.v.currentTime += 10;
          if (e.key === 'ArrowLeft') self.v.currentTime -= 10;
        }
      });
    }

    /** Some o cabeçalho depois de 3 s sem mexer. */
    _despertar() {
      var self = this, tm;
      function acordar() { self.ov.classList.remove('fade'); clearTimeout(tm); tm = setTimeout(function () { if (!self.v.paused) self.ov.classList.add('fade'); }, 3000); }
      ['mousemove', 'keydown', 'click'].forEach(function (e) { document.addEventListener(e, acordar); });
      acordar();
    }
  }

  window.Reprodutor = Reprodutor;
})();
