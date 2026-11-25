# Arquitetura (resumo)

- **Páginas** (`*.html`): uma por tela, cada uma carrega React local, `js/bundle.js` (componentes) e `js/app.js` (núcleo).
- **`js/catalog.js`**: lê listas (M3U e painel Xtream) e normaliza para filmes, séries, canais e categorias. Não depende do navegador (testado no Node).
- **`js/app.js`** (`window.CL`): rede (com proxy), importação, armazenamento, perfis, favoritos, histórico, URLs de reprodução, navegação por setas.
- **`js/listing.js`**: tela de listagem usada por Filmes, Séries e TV ao Vivo.
- **`js/demo.js`**: catálogo de demonstração.
- **`servidor.py`**: serve os arquivos e oferece `/proxy?url=` (busca a lista do provedor pelo computador, evitando o bloqueio CORS do navegador; reescreve playlists HLS).
- **Dados no navegador:** `localStorage` (lista ativa, perfis, favoritos, histórico) e `IndexedDB` (o catálogo grande).
- **Design system:** tokens e componentes em `css/tokens.css`, `css/bundle.css`, `js/bundle.js`, espelhados no artefato do Claude (link no `CLAUDE.md`).

Limites conhecidos: ver as issues abertas (`tipo:bug` e `tipo:feature`) e `docs/ROADMAP.md`.
