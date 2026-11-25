"""Provedor de lista FALSO (painel Xtream + M3U) usado só nos testes.

Uso: python tests/mock/xtream_mock.py PORTA
Usuário "test", senha "123". Nenhum dado real.
"""
import http.server
import json
import os
import random
import socketserver
import sys
import time
import urllib.parse

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 9100
BASE = f"http://127.0.0.1:{PORT}"
IMG = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "assets", "Demo") + os.sep
POSTERS = ["inception.jpg", "batman-cavaleiro-das-trevas-ressurge.jpg", "mad-max-estrada-da-furia.jpg", "o-regresso.jpg", "dunkirk.jpg", "terra-da-mafia.jpg", "sintel.jpg", "elephants-dream.jpg", "big-buck-bunny.jpg"]
W = ["Noite", "Rio", "Cidade", "Último", "Verão", "Sombras", "Ponte", "Casa", "Farol", "Cartas", "Maré", "Fronteira", "Vale", "Ouro", "Segredo"]

random.seed(7)
vcats = [{"category_id": str(i), "category_name": n} for i, n in enumerate(["Ação", "Comédia", "Drama", "Terror", "Ficção científica", "Lançamentos 2025", "Clássicos"], 1)]
scats = [{"category_id": str(i), "category_name": n} for i, n in enumerate(["Drama", "Crime", "Comédia", "Documentário"], 20)]
lcats = [{"category_id": str(i), "category_name": n} for i, n in enumerate(["Abertos", "Esportes", "Notícias"], 40)]


def nome():
    return " ".join(random.sample(W, 2))


VOD = [{"stream_id": 1000 + i, "name": f"{nome()} ({random.randint(1995, 2025)})", "stream_icon": f"{BASE}/img/{random.choice(POSTERS)}", "rating": str(round(random.uniform(4, 9.4), 1)), "rating_5based": 3, "added": str(1700000000 + i * 1000), "category_id": str(random.randint(1, 7)), "container_extension": "mp4"} for i in range(300)]
SER = [{"series_id": 5000 + i, "name": f"{nome()} ({random.randint(2005, 2025)})", "cover": f"{BASE}/img/{random.choice(POSTERS)}", "rating": str(round(random.uniform(5, 9.2), 1)), "last_modified": str(1700000000 + i * 5000), "category_id": str(random.randint(20, 23)), "releaseDate": "2021-05-01"} for i in range(40)]
LIVE = [{"stream_id": 9000 + i, "name": f"Canal {i + 1} HD", "stream_icon": "", "category_id": str(random.randint(40, 42)), "added": "1700000000"} for i in range(20)]
# títulos fixos para os cenários procurarem
VOD[0]["name"] = "Título Único (1996)"
VOD[0]["category_id"] = "1"


def info_serie():
    ep1 = [{"id": str(70000 + i), "episode_num": i, "title": f"Episódio {i}", "container_extension": "mp4", "info": {"plot": "Resumo do episódio.", "movie_image": f"{BASE}/img/{POSTERS[i % 9]}"}} for i in range(1, 7)]
    ep2 = [{"id": str(70100 + i), "episode_num": i, "title": f"Ep {i} da T2", "container_extension": "mp4", "info": {}} for i in range(1, 4)]
    return {"info": {"plot": "Sinopse da série vinda do provedor.", "cast": "Diego Rocha, Elisa Prado", "genre": "Crime, Drama", "rating": "8.1"}, "episodes": {"1": ep1, "2": ep2}}


class H(http.server.BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def _send(self, body, ctype="application/json", code=200):
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        p = urllib.parse.urlparse(self.path)
        q = urllib.parse.parse_qs(p.query)
        if p.path.startswith("/img/"):
            f = IMG + os.path.basename(p.path)
            if os.path.exists(f):
                return self._send(open(f, "rb").read(), "image/jpeg")
        if p.path == "/player_api.php":
            if q.get("username", [""])[0] != "test" or q.get("password", [""])[0] != "123":
                return self._send(json.dumps({"user_info": {"auth": 0}}).encode())
            a = q.get("action", [""])[0]
            out = {"get_vod_categories": vcats, "get_series_categories": scats, "get_live_categories": lcats, "get_vod_streams": VOD, "get_series": SER, "get_live_streams": LIVE}.get(a)
            if a == "":
                out = {"user_info": {"auth": 1, "status": "Active", "exp_date": str(int(time.time()) + 86400 * 200)}, "server_info": {}}
            if a == "get_vod_info":
                out = {"info": {"plot": "Sinopse do filme vinda do provedor.", "cast": "Ana Souza, Bruno Lima, Clara Reis", "genre": "Ação, Drama", "rating": "7.4"}}
            if a == "get_series_info":
                out = info_serie()
            return self._send(json.dumps(out).encode())
        if p.path == "/lista.m3u":
            t = "#EXTM3U\n"
            t += "".join(f'#EXTINF:-1 tvg-logo="" group-title="Filmes",Filme {i} ({2000 + i})\n{BASE}/movie/x/y/{i}.mp4\n' for i in range(5))
            t += "".join(f'#EXTINF:-1 group-title="Séries",Minha Série S01E0{e}\n{BASE}/series/x/y/{e}.mp4\n' for e in range(1, 4))
            t += f'#EXTINF:-1 group-title="Canais",Canal Teste\n{BASE}/live/x/y/1.m3u8\n'
            return self._send(t.encode(), "text/plain")
        self._send(b"", "text/plain", 404)


class S(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True


if __name__ == "__main__":
    S(("127.0.0.1", PORT), H).serve_forever()
