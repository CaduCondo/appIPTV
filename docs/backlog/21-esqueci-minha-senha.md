---
titulo: Esqueci minha senha: código por e-mail e redefinição pelo administrador
labels: tipo:feature, prioridade:p1, estado:backlog, area:login
---
## Contexto
Método escolhido pelo Claude: código de 6 números enviado por e-mail (vale 10 minutos, uso único, 5 tentativas), resposta igual exista ou não o usuário. Quem não tem e-mail pede ao administrador uma senha nova.

## Critérios de aceitação (BDD)
- **Dado** um usuário inexistente, **quando** peço recuperação, **então** vejo a mesma mensagem de um usuário que existe.
- **Dado** um código correto, **quando** defino uma senha nova, **então** consigo entrar com ela e os aparelhos antigos saem.
- **Dado** um código usado ou vencido, **quando** tento de novo, **então** é recusado.
- **Dado** 5 códigos errados, **quando** tento um sexto, **então** o pedido é bloqueado.
