---
titulo: Perfil (Trocar perfil, Configurações, Ajustes) e tela de Plano
labels: tipo:feature, prioridade:p2, estado:todo, area:perfis
---
## Contexto
O botão Perfil abre: Trocar perfil, Configurações, Ajustes e Plano. Plano: atual à esquerda, planos disponíveis à direita (sem Grátis e Degustação, que só o administrador vê).

## Critérios de aceitação (BDD)
- **Dado** um usuário comum, **quando** abre Plano, **então** vê o plano atual e os planos Mensal a 3 Anos, sem Grátis nem Degustação.
- **Dado** o administrador, **quando** abre Plano, **então** também vê Grátis e Degustação.
