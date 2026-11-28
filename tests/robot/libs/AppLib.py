"""Biblioteca de apoio dos testes Robot: sobe o app e o provedor de lista falso e controla o navegador."""
import os
import socket
import subprocess
import sys
import time
import urllib.request

from playwright.sync_api import sync_playwright

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))


def _porta_livre():
    with socket.socket() as s:
        s.bind(('127.0.0.1', 0))
        return s.getsockname()[1]


def _esperar(url, tentativas=60):
    for _ in range(tentativas):
        try:
            urllib.request.urlopen(url, timeout=1).read(10)
            return
        except Exception:
            time.sleep(0.2)
    raise RuntimeError(f'Não respondeu: {url}')


class AppLib:
    ROBOT_LIBRARY_SCOPE = 'SUITE'

    def __init__(self):
        self._procs = []
        self._pw = None
        self._browser = None
        self._ctx = None
        self.page = None
        self._erros = []
        self.app = ''
        self.provedor = ''

    # ---------- ambiente ----------
    def iniciar_ambiente(self):
        """Sobe o app (servidor.py) e o provedor falso em portas livres e abre o Chromium."""
        pa, pm = _porta_livre(), _porta_livre()
        self._procs.append(subprocess.Popen([sys.executable, os.path.join(RAIZ, 'servidor.py')], env=dict(os.environ, PORT=str(pa)), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, cwd=RAIZ))
        self._procs.append(subprocess.Popen([sys.executable, os.path.join(RAIZ, 'tests', 'mock', 'xtream_mock.py'), str(pm)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL))
        self.app, self.provedor = f'http://127.0.0.1:{pa}', f'http://127.0.0.1:{pm}'
        _esperar(self.app + '/index.html')
        _esperar(self.provedor + '/lista.m3u')
        self._pw = sync_playwright().start()
        exe = os.environ.get('CHROMIUM_PATH') or None
        self._browser = self._pw.chromium.launch(headless=True, executable_path=exe, args=['--no-sandbox'])
        return self.provedor

    def encerrar_ambiente(self):
        if self._browser:
            self._browser.close()
        if self._pw:
            self._pw.stop()
        for p in self._procs:
            p.terminate()
        for p in self._procs:
            try:
                p.wait(timeout=5)
            except Exception:
                p.kill()
        self._procs = []

    def abrir_contexto(self, largura=1280, altura=720, celular=False):
        """Navegador limpo (sem login, sem lista), como um aparelho novo. `celular` liga toque e tela de celular."""
        if self._ctx:  # trocou de aparelho no meio do cenário: fecha o anterior sem guardar evidência
            try:
                self._ctx.close()
            except Exception:
                pass
        self._videos = os.path.join(RAIZ, 'results', 'videos-tmp')
        tamanho = {'width': int(largura), 'height': int(altura)}
        extra = {'has_touch': True, 'is_mobile': True, 'device_scale_factor': 2} if celular else {}
        try:
            if os.environ.get('APP_SEM_VIDEO'):
                raise RuntimeError('sem video')
            self._ctx = self._browser.new_context(viewport=tamanho, record_video_dir=self._videos, **extra)
            self.page = self._ctx.new_page()
        except Exception:
            # sem o ffmpeg do Playwright não dá para gravar vídeo: segue só com print
            if self._ctx:
                self._ctx.close()
            self._ctx = self._browser.new_context(viewport=tamanho, **extra)
            self.page = self._ctx.new_page()
        self._erros = []
        self.page.on('pageerror', lambda e: self._erros.append(str(e)))
        self.page.set_default_timeout(15000)

    def fechar_contexto(self, status='PASS', nome='cenario'):
        """Fecha o navegador. Passou: guarda o print do último passo. Falhou: guarda print e vídeo."""
        slug = ''.join(c if c.isalnum() else '_' for c in nome)[:80]
        video = None
        if self._ctx:
            try:
                video = self.page.video if os.path.isdir(self._videos) else None
                prints = os.path.join(RAIZ, 'results', 'prints')
                os.makedirs(prints, exist_ok=True)
                self.page.screenshot(path=os.path.join(prints, ('OK-' if status == 'PASS' else 'FALHOU-') + slug + '.png'))
            except Exception:
                pass
            self._ctx.close()
        self._ctx = None
        if video:
            try:
                caminho = video.path()
                if status == 'PASS':
                    os.remove(caminho)
                else:
                    destino = os.path.join(RAIZ, 'results', 'videos')
                    os.makedirs(destino, exist_ok=True)
                    os.replace(caminho, os.path.join(destino, 'FALHOU-' + slug + '.webm'))
            except Exception:
                pass

    def tirar_print(self, nome):
        os.makedirs(os.path.join(RAIZ, 'results', 'prints'), exist_ok=True)
        self.page.screenshot(path=os.path.join(RAIZ, 'results', 'prints', nome + '.png'))

    # ---------- ações ----------
    def abrir_pagina(self, caminho):
        self.page.goto(self.app + caminho)

    def clicar_no_botao(self, texto):
        self.page.locator('button', has_text=texto).first.click()

    def clicar_no_elemento(self, seletor, indice=0):
        self.page.locator(seletor).nth(int(indice)).click()

    def clicar_no_texto(self, texto):
        self.page.get_by_text(texto, exact=False).first.click()

    def preencher_campo(self, indice, valor):
        self.page.locator('.cl-field__input').nth(int(indice)).fill(valor)

    def clicar_no_botao_exato(self, texto):
        self.page.get_by_role('button', name=texto, exact=True).first.click()

    def digitar(self, texto):
        """Digita números como no teclado do computador/controle."""
        self.page.keyboard.type(texto, delay=20)

    def pressionar(self, tecla):
        self.page.keyboard.press(tecla)

    def tocar_teclas(self, digitos):
        """Toca nas teclas do teclado numérico da tela, uma a uma."""
        for d in digitos:
            self.page.locator(f'button[aria-label="{d}"]').first.click()

    def tocar_no_botao_do_teclado(self, nome):
        self.page.locator(f'button[aria-label="{nome}"]').first.click()

    def ler_texto(self, seletor):
        self.page.wait_for_selector(seletor)
        return self.page.inner_text(seletor).strip()

    def rolagens_laterais(self):
        """Quantos blocos têm barra de rolagem lateral (deve ser 0: o app usa carrossel)."""
        return self.page.evaluate("""() => [...document.querySelectorAll('*')].filter(e => {
            const o = getComputedStyle(e).overflowX;
            return (o === 'auto' || o === 'scroll') && e.scrollWidth > e.clientWidth + 1;
        }).length""")

    def textos(self, seletor):
        self.page.wait_for_selector(seletor)
        return [t.strip() for t in self.page.locator(seletor).all_inner_texts()]

    def pagina_do_carrossel(self, titulo):
        """Número (1, 2, ...) da página mostrada no carrossel."""
        return self.page.evaluate("""(t) => {
            const dots = [...document.querySelectorAll(`section[aria-label="${t}"] .cl-carousel__dots i`)];
            return dots.findIndex(d => d.classList.contains('on')) + 1;
        }""", titulo)

    def esperar_video_tocando(self, segundos=1):
        """Espera o vídeo estar de fato tocando: o tempo passa de `segundos` e ele não está pausado."""
        self.page.wait_for_function(
            "(s) => { const v = document.querySelector('video'); return v && !v.paused && v.currentTime >= s; }",
            arg=float(segundos), timeout=20000)

    def esperar_video_comecar_em(self, segundos):
        """Prova que o vídeo RETOMOU: dentro de 1,5 s depois de pronto, o tempo já está em `segundos` ou mais
        (se começasse do zero, levaria `segundos` para chegar lá)."""
        self.page.wait_for_function("() => { const v = document.querySelector('video'); return v && v.readyState >= 1; }", timeout=20000)
        self.page.wait_for_function(
            "(s) => document.querySelector('video').currentTime >= s", arg=float(segundos), timeout=1500)

    def mexer_o_mouse(self):
        """Mexe o mouse (no player, isso faz o cabeçalho com o botão Voltar reaparecer)."""
        self.page.mouse.move(300, 300)
        self.page.mouse.move(340, 320)

    # ---------- responsividade ----------
    def conferir_sem_estouro(self):
        """A página não pode ser mais larga que a tela (sem barra de rolagem lateral)."""
        self.page.wait_for_timeout(400)
        r = self.page.evaluate("() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth, url: location.pathname })")
        if r['sw'] > r['iw'] + 1:
            raise AssertionError(f"{r['url']}: conteúdo com {r['sw']}px passa da tela de {r['iw']}px")

    def colunas_da_grade(self):
        """Quantas colunas de pôsteres a grade mostra."""
        self.page.wait_for_selector('.grid5 .cl-poster')
        self.page.wait_for_timeout(300)
        return self.page.evaluate("() => new Set([...document.querySelectorAll('.grid5 .cl-poster')].map(e => Math.round(e.getBoundingClientRect().left))).size")

    def itens_visiveis_no_carrossel(self, titulo):
        """Quantos itens do carrossel aparecem inteiros dentro da vista."""
        self.page.wait_for_selector(f'section[aria-label="{titulo}"]')
        self.page.wait_for_timeout(400)
        return self.page.evaluate("""(t) => {
            const vp = document.querySelector(`section[aria-label="${t}"] .cl-carousel__viewport`).getBoundingClientRect();
            return [...document.querySelectorAll(`section[aria-label="${t}"] .cl-carousel__track > *`)]
              .filter(e => { const r = e.getBoundingClientRect(); return r.left >= vp.left - 8 && r.right <= vp.right + 8; }).length;
        }""", titulo)

    def deslizar_carrossel(self, titulo, dx=-200):
        """Desliza o dedo sobre o carrossel (toque de verdade, sem usar a seta)."""
        self.page.evaluate("""([t, dx]) => {
            const el = document.querySelector(`section[aria-label="${t}"] .cl-carousel__viewport`);
            const mk = (x) => new Touch({ identifier: 1, target: el, clientX: x, clientY: 300 });
            el.dispatchEvent(new TouchEvent('touchstart', { touches: [mk(300)], changedTouches: [mk(300)], bubbles: true }));
            el.dispatchEvent(new TouchEvent('touchend', { touches: [], changedTouches: [mk(300 + dx)], bubbles: true }));
        }""", [titulo, int(dx)])

    def conteudo_ocupa_a_largura(self):
        """Percentual da largura da tela que o conteúdo ocupa (na TV 4K deve ser ~100%)."""
        self.page.wait_for_selector('.page')
        self.page.wait_for_timeout(300)
        return self.page.evaluate("() => document.querySelector('.page').getBoundingClientRect().width / window.innerWidth * 100")

    def menor_texto(self):
        """Menor tamanho de letra (px) entre os textos visíveis (vale para celular/tablet, sem ampliação)."""
        self.page.wait_for_timeout(300)
        return self.page.evaluate("""() => {
            let min = 999;
            for (const e of document.querySelectorAll('body *')) {
                const tem = [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
                const r = e.getBoundingClientRect();
                if (!tem || r.width === 0 || r.height === 0 || getComputedStyle(e).visibility === 'hidden') continue;
                min = Math.min(min, parseFloat(getComputedStyle(e).fontSize));
            }
            return min;
        }""")

    def provedor_url(self):
        return self.provedor

    # ---------- conferências ----------
    def esperar_pagina(self, nome):
        self.page.wait_for_url(f'**/{nome}*', timeout=60000)

    def pagina_atual(self):
        return self.page.url.split('/')[-1].split('?')[0]

    def ver_texto(self, texto):
        self.page.get_by_text(texto, exact=False).first.wait_for(state='visible', timeout=15000)

    def nao_ver_texto(self, texto):
        if self.page.get_by_text(texto, exact=False).count() > 0:
            raise AssertionError(f'O texto "{texto}" não deveria aparecer')

    def esperar_elementos(self, seletor):
        self.page.wait_for_selector(seletor)

    def contar_elementos(self, seletor):
        self.page.wait_for_timeout(300)
        return self.page.locator(seletor).count()

    def erros_de_script(self):
        return list(self._erros)
