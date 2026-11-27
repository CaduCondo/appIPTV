"""Servidor local do CineHomeTV.

Serve os arquivos desta pasta em http://localhost:8080 e oferece /proxy?url=...,
que busca a lista do provedor por você (o navegador sozinho costuma ser bloqueado
por CORS). Só aceita conexões do próprio computador.
"""
import http.server
import os
import re
import socketserver
import sys
import urllib.parse
import urllib.request

PORT = int(os.environ.get("PORT", "8080"))
ROOT = os.path.dirname(os.path.abspath(__file__))
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) CinemaLivre/1.0"


def absolutize(base, line):
    return urllib.parse.urljoin(base, line)


def rewrite_m3u8(text, base):
    out = []
    for line in text.splitlines():
        s = line.strip()
        if not s:
            out.append(line)
        elif s.startswith("#"):
            out.append(re.sub(r'URI="([^"]+)"', lambda m: 'URI="/proxy?url=%s"' % urllib.parse.quote(absolutize(base, m.group(1)), safe=""), line))
        else:
            out.append("/proxy?url=" + urllib.parse.quote(absolutize(base, s), safe=""))
    return "\n".join(out) + "\n"


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=ROOT, **k)

    def log_message(self, fmt, *args):
        pass

    def do_GET(self):
        p = urllib.parse.urlparse(self.path)
        if p.path == "/proxy":
            return self.proxy(urllib.parse.parse_qs(p.query))
        return super().do_GET()

    def proxy(self, q):
        if "ping" in q:
            return self.reply(200, b"ok", "text/plain")
        url = (q.get("url") or [""])[0]
        if not re.match(r"^https?://", url, re.I):
            return self.reply(400, b"url invalida", "text/plain")
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
            with urllib.request.urlopen(req, timeout=90) as r:
                ctype = r.headers.get("Content-Type", "application/octet-stream")
                data = r.read()
        except urllib.error.HTTPError as e:
            return self.reply(e.code, str(e).encode(), "text/plain")
        except Exception as e:
            return self.reply(502, str(e).encode(), "text/plain")
        if url.split("?")[0].lower().endswith(".m3u8") or (b"#EXTM3U" in data[:20] and b"#EXT-X-" in data[:4000]):
            data = rewrite_m3u8(data.decode("utf-8", "replace"), url).encode()
            ctype = "application/vnd.apple.mpegurl"
        self.reply(200, data, ctype)

    def reply(self, code, body, ctype):
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        try:
            self.wfile.write(body)
        except (BrokenPipeError, ConnectionResetError):
            pass


class Server(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True


if __name__ == "__main__":
    srv = Server(("127.0.0.1", PORT), Handler)
    print("CineHomeTV rodando em http://localhost:%d  (Ctrl+C para parar)" % PORT)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        sys.exit(0)
