---
titulo: Esconder usuário e senha da lista (URL do player, histórico)
labels: tipo:bug, prioridade:p2, estado:backlog, area:player
---
## Contexto
O endereço do vídeo (que inclui usuário e senha do provedor) vai na URL da página do player e é guardado no histórico do perfil. Um print da tela ou da barra de endereço, ou um backup do navegador, pode expor a senha da lista.

## Tarefas
- [ ] O player receber só o identificador do item e montar o endereço por dentro.
- [ ] Histórico guardar só o identificador, não o endereço com credenciais.
- [ ] Cenário BDD que confere que a URL do player e o histórico não contêm a senha.

## Critérios de aceitação (BDD)
- **Dado** que toquei um filme de uma lista com senha, **quando** olho o endereço da página do player, **então** a senha não aparece.
- **Dado** o mesmo filme, **quando** olho os dados salvos do histórico, **então** a senha não aparece.
