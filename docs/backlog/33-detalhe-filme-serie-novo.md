---
titulo: Detalhe do filme/série: player pequeno ao fundo, botões-filtro, Assistir/Voltar a assistir, Favorito
labels: tipo:feature, prioridade:p1, estado:todo, area:player
---
## Contexto
Pedido do Cadu (28/nov/2026). A tela é **a mesma para filme e série**; a série tem **um bloco a mais** (temporadas e episódios) abaixo do elenco, que **não pode ser alterado** pelas mudanças abaixo.
- Tirar a imagem (pôster) do topo esquerdo e alinhar o texto à esquerda. A imagem do título vira **plano de fundo mais transparente** (textos nunca transparentes).
- **Janela de player pequena** no topo direito, que **começa sozinha** do começo ou de onde a pessoa parou; clicar nela leva para a **tela cheia** (com transição).
- Faixa de progresso embaixo da janela do player.
- Botões abaixo do título são **filtros**: gênero (ex.: Crime) abre a lista com esse gênero; data no formato **DD-MM-AAAA** abre a lista do **ano**; nota **⭐ X,XX** (sem a palavra Nota) abre os títulos com o **primeiro dígito** igual (8,75 → todos os 8).
- Botão **Assistir** (nunca começou) / **Voltar a assistir** (começou e não acabou; abre uma dica com **Voltar a assistir** e **Começar novamente**) / **Assistir novamente** (já terminou). Só grava progresso em **tela cheia**.
- **Favorito**: ao clicar inverte as cores, coração vermelho e texto **Desfavoritar**.
- Botão **Filme**/**Série** abre a lista com o menu de categorias (inclui Favoritos).
- Tirar os botões Relacionadas e Ouvir.

## Critérios de aceitação (BDD)
- **Dado** um filme, **quando** abro o detalhe, **então** a janela do player começa sozinha e não há pôster no topo esquerdo.
- **Dado** um filme que parei aos 54:37, **quando** abro o detalhe, **então** o botão é "Voltar a assistir" e a janela retoma de 54:37.
- **Dado** o botão "Voltar a assistir", **quando** toco, **então** vejo "Voltar a assistir" e "Começar novamente".
- **Dado** um filme com gênero Crime, **quando** toco no botão Crime, **então** abre a lista de filmes com Crime.
- **Dado** a nota 8,75, **quando** toco no botão da nota, **então** a lista mostra títulos com nota de 8,00 a 8,99.
- **Dado** o botão Favorito, **quando** toco, **então** ele vira "Desfavoritar" com coração vermelho.
- **Dado** uma série, **quando** abro o detalhe, **então** o bloco de temporadas e episódios continua igual.
