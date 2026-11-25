# Pedidos e decisões do Cadu

Registro do que foi pedido e decidido, em ordem. O Claude atualiza este arquivo sempre que o Cadu pedir ou decidir algo novo.

## 25/nov/2026 — começo do projeto

- **Objetivo:** app de filmes e séries a partir de uma lista, que depois será alimentada por uma lista de IPTV assinada (provedor ainda não escolhido). Primeira ideia foi só conteúdo gratuito e legal; depois ficou "deixar pronto para importar a lista e tudo funcionar". O app é um player genérico; nenhuma lista entra no repositório.
- **Referências de layout:** prints de apps de TV (Zuxo, Cortex Player, Funplay) e das telas de listagem, detalhe e ator. O Cadu pode mandar mais telas; **primeiro o esqueleto, depois o refinamento**.
- **Dados reais no demo:** pode usar pôsteres, fotos e notas reais só para demonstração; depois a carga de uma lista traz tudo.

### Telas pedidas

1. **Login / importar lista:** login, senha, algum código, algum jeito de importar a lista. Depois de entrar, o usuário já tem todo o conteúdo da lista. *(feito: usuário e senha, link M3U, arquivo, demonstração; "código" ainda não — issue no backlog)*
2. **Perfis:** o usuário cria o próprio perfil, com favoritos e configurações só dele (referência: tela "Quem está assistindo?" do Zuxo). *(feito: criar, editar, excluir, cor; favoritos e histórico por perfil)*
3. **Home (hub):** botões de TV ao Vivo, Filmes, Séries, Configurações e Conta. Gosta de ter **mais informação**: jogos do dia (decidir o que acontece ao clicar depois), últimos filmes/séries assistidos, últimos incluídos na lista. *(feito: continuar assistindo, adicionados recentemente, tiles com contagem; jogos do dia é só um espaço "em breve")*
4. **Listagem de Filmes e Séries:** categorias (filtros pré-definidos) em botões à esquerda; à direita os títulos da categoria. Cada título mostra o **pôster oficial**, nome embaixo e **a nota no canto superior esquerdo**. Séries é igual a Filmes. *(feito)*
5. **Detalhe do título:** imagem, nome, dados (data, nota, faixa etária, categorias), sinopse, fotos dos atores com o nome do personagem; em série: botões de temporadas e, abaixo, os episódios com **print real do episódio**, "Temporada 02 - Episódio 05" e uma pequena sinopse. *(feito com o que a lista traz; elenco com foto, print real e sinopse de episódio dependem de uma base de catálogo — issue no backlog)*
6. **Detalhe do ator:** informações do ator e, abaixo, os filmes em que atuou. *(só o modelo estático; depende da base de catálogo)*

### Decisões de processo

- O Claude desenvolve o ciclo todo: issue no GitHub, kanban, código, testes unitários e funcionais (Robot Framework com Python), CI no GitHub Actions, análise do resultado, issue para defeito do sistema com gravidade, backlog ordenado por importância e risco, e recomeça com a próxima issue. Tudo documentado.
- O Cadu não é programador: tudo explicado em linguagem simples.
- Links de referência que o Cadu achou: megacubo.tv (guia de lista IPTV), noticiasdoes.com.br, dicas.zone, lumi.new (IA que gera players IPTV). Lista a assinar: growthtech.com.br (depois do app pronto).

## 25/nov/2026 — navegar na demonstração

- Cadu quer abrir e navegar pelo app, mesmo com conteúdo mockado, para ir ajustando o visual. Decisão: demonstração publicada no GitHub Pages (https://caducondo.github.io/appIPTV/) e catálogo de exemplo maior (issue #17).
- Cadu quer respostas curtas e diretas, só com o importante e as decisões dele (issue #16, regra no `CLAUDE.md`).
