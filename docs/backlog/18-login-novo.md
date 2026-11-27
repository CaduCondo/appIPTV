---
titulo: Login novo: teclado numérico para controle remoto, mensagens iguais e limite de tentativas
labels: tipo:feature, prioridade:p1, estado:todo, area:login
---
## Contexto
Tela de login com usuário e senha numéricos, pensada para controle remoto, com layout novo. Erro de usuário ou senha **sempre com a mesma mensagem**. Bloqueio por tentativas. Sem mostrar o código do aparelho.

## Tarefas
- [ ] Layout novo com teclado numérico navegável por setas (e teclado normal).
- [ ] Mensagens: login/senha errados (igual), bloqueio, plano vencido, sem internet, limite de telas.
- [ ] Botão Esqueci minha senha.

## Critérios de aceitação (BDD)
- **Dado** um usuário que não existe, **quando** tento entrar, **então** vejo "Usuário ou senha incorretos."
- **Dado** um usuário que existe com senha errada, **quando** tento entrar, **então** vejo exatamente a mesma mensagem.
- **Dado** 5 tentativas erradas, **quando** tento de novo, **então** vejo a mensagem de bloqueio, igual para usuário que existe ou não.
- **Dado** um usuário com plano vencido, **quando** entro com a senha certa, **então** vejo "Seu plano venceu".
