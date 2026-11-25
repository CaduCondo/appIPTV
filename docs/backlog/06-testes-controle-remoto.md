---
titulo: Testes da navegação por controle remoto (setas, Enter, Esc)
labels: tipo:teste, prioridade:p2, estado:backlog, area:catalogo
---
## Contexto
O app foi feito para TV, mas só há um teste manual de setas. Qualquer mudança de layout pode quebrar o foco sem ninguém perceber.

## Tarefas
- [ ] Cenários BDD que usam só o teclado: da home entrar em Filmes, escolher categoria, abrir título, voltar com Esc.
- [ ] Conferir que sempre existe um item focado e visível (anel de foco).

## Critérios de aceitação (BDD)
- **Dado** a home, **quando** aperto → e Enter, **então** abre a seção ao lado do item focado.
- **Dado** a tela de detalhe, **quando** aperto Esc, **então** volto para a listagem.
- **Dado** qualquer tela, **quando** aperto uma seta, **então** o foco aparece em um item visível.
