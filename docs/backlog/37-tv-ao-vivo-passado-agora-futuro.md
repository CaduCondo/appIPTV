---
titulo: TV ao Vivo: ver programa passado (até 7 dias), barra do programa ao vivo e agendar futuro
labels: tipo:feature, prioridade:p2, estado:backlog, area:player
---
## Contexto
- Programa de **horário passado** (até 7 dias atrás): dá para assistir.
- Programa **ao vivo**: toca ao vivo; a seta ↓ mostra no rodapé as informações do canal, título e sinopse do programa, início e fim, **barra de porcentagem** entre início e fim e o botão **Favoritar/Desfavoritar** (muda conforme o canal esteja ou não nos favoritos).
- Programa de **horário futuro**: ao tocar, **agenda** o programa (aparece na lista de Agendados).

## Critérios de aceitação (BDD)
- **Dado** um programa de ontem, **quando** toco nele, **então** ele toca.
- **Dado** o canal ao vivo, **quando** aperto ↓, **então** vejo título, sinopse, início, fim, a barra de porcentagem e o botão Favoritar.
- **Dado** um canal favorito, **quando** aperto ↓, **então** o botão é Desfavoritar e, ao tocar, o canal sai dos Favoritos.
- **Dado** um programa de amanhã, **quando** toco nele, **então** ele entra em Agendados.
