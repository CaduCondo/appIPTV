---
titulo: Listagem de Filmes/Séries: título, ordenação, busca, menus fixos, anos, gêneros e streamings
labels: tipo:feature, prioridade:p1, estado:wip, area:catalogo
---
## Contexto
Pedido do Cadu (28/nov/2026), tela de Filmes e de Séries (também vale para as outras listas):
- Título **FILMES** ou **SÉRIES** no topo esquerdo; **combo de ordenação** no topo direito: De A até Z, De Z até A, Data de lançamento (mais novo primeiro) e outras que façam sentido.
- Duas colunas (menu à esquerda, resultado à direita) com **uma barra de rolagem só**: quando uma coluna termina a outra continua rolando.
- Campo **Buscar**: o filtro começa na **terceira letra** e procura a palavra em **qualquer parte do nome** ("amo" acha "Amor te amo", "amorzinho", "eu falei amor").
- Menu, nesta ordem: Continuar assistindo (N), Favoritos (N), Adicionados recentemente (N, os últimos 100), Todos (N), ano atual (N, no máximo 100), ano anterior (N, no máximo 100), depois as categorias em ordem alfabética (Ação, Comédia, Drama...) e por último as categorias de **streamings** também em ordem alfabética (AMC+, Apple TV+, Disney+, Netflix...). Um título com mais de uma categoria aparece em todas (depende da base de catálogo, issue #7).

## Critérios de aceitação (BDD)
- **Dado** Filmes, **quando** abro a tela, **então** vejo o título FILMES e o combo de ordenação.
- **Dado** o combo, **quando** escolho "De Z até A", **então** a lista fica em ordem alfabética inversa.
- **Dado** a busca, **quando** digito 2 letras, **então** nada é filtrado; **quando** digito a terceira, **então** só ficam os títulos que têm essas letras em qualquer parte do nome.
- **Dado** o menu, **quando** olho a ordem, **então** vêm: Continuar assistindo, Favoritos, Adicionados recentemente, Todos, ano atual, ano anterior, gêneros A–Z, streamings A–Z, cada um com (N).
- **Dado** a tela, **quando** rolo a página, **então** as duas colunas rolam juntas, sem barra de rolagem própria no menu.
