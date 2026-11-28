---
titulo: Home: tirar Criar usuário e criar carrosséis Últimos filmes/séries adicionados (com link)
labels: tipo:feature, prioridade:p1, estado:wip, area:home
---
## Contexto
Pedido do Cadu (28/nov/2026): na home, retirar o botão "Criar usuário" (fica no menu Perfil, só para administrador); trocar "Últimos adicionados" por dois carrosséis de uns 20 títulos: **Últimos filmes adicionados** e **Últimas séries adicionadas**. O texto do título de cada carrossel é um **link** para a página de Filmes/Séries com o botão "Adicionados recentemente" já selecionado.

## Critérios de aceitação (BDD)
- **Dado** o administrador na home, **quando** olho a tela, **então** não vejo o botão Criar usuário (ele está em Perfil).
- **Dado** a home, **quando** olho os carrosséis, **então** vejo "Últimos filmes adicionados" e "Últimas séries adicionadas" com até 20 títulos cada.
- **Dado** a home, **quando** toco no título "Últimos filmes adicionados", **então** abre Filmes com "Adicionados recentemente" selecionado.
- **Dado** a home, **quando** toco no título "Últimas séries adicionadas", **então** abre Séries com "Adicionados recentemente" selecionado.
