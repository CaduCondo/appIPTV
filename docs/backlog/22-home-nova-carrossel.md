---
titulo: Home nova: foco em TV, Filmes e Séries, carrosséis, Últimos adicionados e Jogos do dia
labels: tipo:feature, prioridade:p1, estado:todo, area:home
---
## Contexto
Home simples e bonita, sem barra de rolagem lateral (carrossel), com as 3 funções em destaque, botão Perfil, bloco Últimos adicionados (etiqueta Filme/Série no topo esquerdo e nota X,XX no topo direito) e Jogos do dia (leva ao canal; antes do início mostra o horário).

## Critérios de aceitação (BDD)
- **Dado** a home, **quando** olho a tela, **então** não há barra de rolagem lateral em nenhum bloco.
- **Dado** o carrossel de Últimos adicionados, **quando** aperto → além do último item visível, **então** o carrossel avança.
- **Dado** um jogo que ainda não começou, **quando** toco nele, **então** vejo "O jogo começa às HH:MM".
- **Dado** um jogo em andamento, **quando** toco nele, **então** abre o canal.
