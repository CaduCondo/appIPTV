---
titulo: Base de catálogo (TMDB): elenco com foto, prints de episódio, sinopses e tela de ator real
labels: tipo:feature, prioridade:p2, estado:bloqueado, area:catalogo
---
## Contexto
A lista do provedor só traz o nome do elenco (sem foto nem personagem), poucas imagens de episódio e quase nenhuma sinopse de episódio. O Cadu pediu tudo isso (detalhe com elenco, personagens, print real do episódio, sinopse, e a tela de ator com a filmografia). Isso vem de uma base de catálogo (ex.: TMDB, que dá chave gratuita para uso pessoal, com exigência de créditos).

**Bloqueada:** precisa que o Cadu crie a conta e a chave gratuita (passo a passo será escrito aqui).

## Tarefas
- [ ] Passo a passo para criar a chave e onde guardá-la (no navegador, nunca no repositório).
- [ ] Buscar o título pelo nome e ano e casar com a lista.
- [ ] Elenco com foto e personagem; classificação etária; sinopse e print por episódio; nota.
- [ ] Tela de ator real (foto, biografia, filmografia que existe na lista).
- [ ] Mostrar o crédito da fonte.

## Critérios de aceitação (BDD)
- **Dado** uma série da lista, **quando** abro o detalhe, **então** vejo o elenco com foto e personagem.
- **Dado** um episódio, **quando** olho o cartão, **então** vejo o print do episódio e uma sinopse curta.
- **Dado** um ator, **quando** toco nele, **então** vejo os filmes dele que existem na minha lista.
- **Dado** que não há chave configurada, **quando** abro um detalhe, **então** o app mostra o que a lista trouxe, sem erro.
