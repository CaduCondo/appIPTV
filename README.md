# Cinema Livre

App para assistir **filmes, séries e TV ao vivo** a partir de uma lista que você importa (usuário e senha do provedor, link M3U ou arquivo `.m3u`). Pensado para TV (controle remoto) e funciona no navegador.

> Os pôsteres e fotos da pasta `assets/` são só de demonstração. Nenhuma lista, usuário ou senha de provedor deve ser colocado neste repositório.

## Como rodar (Windows)

1. Instale o Python (https://www.python.org/downloads/, marcando **Add python.exe to PATH**).
2. Dê dois cliques em `iniciar.bat`. O app abre em http://localhost:8080.
3. Na primeira tela, importe a lista (ou use **Ver demonstração**).

Passo a passo completo, com como atualizar a pasta: [`docs/COMECAR_AQUI.md`](docs/COMECAR_AQUI.md).

## Telas

Login/importar lista · Perfis · Home · Filmes · Séries · TV ao Vivo · Detalhe (elenco, temporadas, episódios) · Player · Favoritos/Histórico · Contas. A tela de ator ainda é só um modelo (`modelo-ator.html`).

## Testes

```
npm run test:unit   # lógica (leitura das listas)
npm run test:bdd    # cenários em português (Robot Framework) contra o app e um provedor falso
```

Detalhes em [`docs/TESTES.md`](docs/TESTES.md). Os testes rodam sozinhos no GitHub Actions em todo push e Pull Request.

## Como trabalhamos

[`CLAUDE.md`](CLAUDE.md) (regras para o Claude) · [`docs/PROCESSO.md`](docs/PROCESSO.md) · [`docs/KANBAN.md`](docs/KANBAN.md) · [`docs/ROADMAP.md`](docs/ROADMAP.md) · [`docs/PEDIDOS-E-DECISOES.md`](docs/PEDIDOS-E-DECISOES.md) · [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md)
