---
titulo: TV ao Vivo nova: colunas de filtros, canais, programação, dias e horários; busca; favoritos; agendados
labels: tipo:feature, prioridade:p1, estado:backlog, area:catalogo
---
## Contexto
Pedido do Cadu (28/nov/2026). Tela em colunas que se abrem para a direita conforme o foco:
1. **Botão Pesquisar:** filtra os canais a cada letra digitada.
2. Listas fixas: canais **Favoritos** e canais **Agendados**.
3. **Tipos de canal** (filtros): ao focar um filtro abre à direita a lista de canais dele.
4. **Canais:** ao focar um canal abre à direita o conteúdo dele: horário de início e fim do programa e a sinopse.
5. **Programação por data:** de 7 dias atrás a 7 dias à frente.
6. **Programação por horário** da data escolhida (ordem crescente): início, fim, título e sinopse.
Depende de o provedor oferecer o guia de programação (EPG) e, para ver o passado, o arquivo de programas (até 7 dias).

## Critérios de aceitação (BDD)
- **Dado** a TV ao Vivo, **quando** digito "esp", **então** só ficam os canais cujo nome tem "esp", atualizando a cada letra.
- **Dado** um filtro de tipo, **quando** o foco chega nele, **então** abre à direita a lista de canais dele sem precisar tocar.
- **Dado** um canal em foco, **quando** olho à direita, **então** vejo o programa de agora com início, fim e sinopse.
- **Dado** o canal escolhido, **quando** abro a programação, **então** vejo 15 dias (7 atrás, hoje, 7 à frente) e, no dia escolhido, os programas em ordem de horário.
