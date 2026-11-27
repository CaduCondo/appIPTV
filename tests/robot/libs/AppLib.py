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

    def abrir_contexto(self, largura=1280, altura=720):
        """Navegador limpo (sem lista, sem perfil), como um aparelho novo."""
        self._videos = os.path.join(RAIZ, 'results', 'videos-tmp')
        tamanho = {'width': int(largura), 'height': int(altura)}
        try:
            if os.environ.get('APP_SEM_VIDEO'):
                raise RuntimeError('sem video')
            self._ctx = self._browser.new_context(viewport=tamanho, record_video_dir=self._videos)
            self.page = self._ctx.new_page()
        except Exception:
            # sem o ffmpeg do Playwright não dá para gravar vídeo: segue só com print
            if self._ctx:
                self._ctx.close()
            self._ctx = self._browser.new_context(viewport=tamanho)
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
