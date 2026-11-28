---
titulo: Avaliação no fim do filme (10 estrelas) e cálculo da nota
labels: tipo:feature, prioridade:p2, estado:backlog, area:player
---
## Contexto
No final de cada filme/episódio aparece uma telinha pequena sobre o vídeo: **"Qual sua nota?"** com 10 estrelas sem cor; com setas, mouse ou toque a pessoa sobe as estrelas e cada uma fica amarela. A nota entra na conta da nota do título (a "X,XX" do pôster e do detalhe).

## Critérios de aceitação (BDD)
- **Dado** o fim do filme, **quando** a telinha aparece, **então** vejo "Qual sua nota?" e 10 estrelas vazias.
- **Dado** as estrelas, **quando** chego na 7ª, **então** 7 ficam amarelas.
- **Dado** uma nota dada, **quando** volto à lista, **então** a nota do título considera a minha.
