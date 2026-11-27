---
titulo: Controle de aparelhos e de telas online ao mesmo tempo
labels: tipo:feature, prioridade:p1, estado:backlog, area:seguranca
---
## Contexto
Cada usuário só pode ter N aparelhos online ao mesmo tempo (as telas do plano). O app avisa o sistema que está aberto (batimento). **MAC não pode ser lido** por navegador nem pelo Android atual: usamos um código do aparelho gerado na instalação.

## Critérios de aceitação (BDD)
- **Dado** um plano de 1 tela com um aparelho online, **quando** outro aparelho tenta entrar, **então** vê a mensagem de limite de telas.
- **Dado** um aparelho sem sinal há mais de 2 minutos, **quando** outro tenta entrar, **então** entra.
- **Dado** o administrador, **quando** entra em vários aparelhos, **então** não há limite.
