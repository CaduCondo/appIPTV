---
titulo: Desempenho com listas enormes (dezenas de milhares de itens)
labels: tipo:bug, prioridade:p1, estado:pronto, area:catalogo
---
## Contexto
Listas reais têm algo como 44 mil filmes e 9 mil séries. Cada tela lê o catálogo inteiro do navegador e a importação baixa tudo de uma vez, sem barra de progresso real. Na TV isso pode travar ou demorar muito. Ainda não foi medido com volume real.

## Tarefas
- [ ] Gerar no provedor falso uma lista de 50 mil filmes e 10 mil séries e **medir**: tempo de importar, de abrir Filmes, de trocar de categoria, memória.
- [ ] Guardar um índice por categoria e carregar só o que aparece (paginação no armazenamento).
- [ ] Mostrar progresso real na importação (itens baixados).
- [ ] Cenário BDD com a lista grande e limite de tempo.

## Critérios de aceitação (BDD)
- **Dado** uma lista com 50 mil filmes importada, **quando** abro Filmes, **então** os primeiros pôsteres aparecem em até 3 segundos.
- **Dado** a mesma lista, **quando** troco de categoria, **então** a grade atualiza em até 1 segundo.
- **Dado** uma importação em andamento, **quando** olho a tela, **então** vejo quantos itens já foram baixados.
