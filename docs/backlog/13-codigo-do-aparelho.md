---
titulo: Código do aparelho: ativar a lista pelo site
labels: tipo:feature, prioridade:p3, estado:backlog, area:login
---
## Contexto
Nos apps de referência (Funplay) a TV mostra um código e a lista é cadastrada por um site, para não digitar com o controle remoto. Hoje o app só mostra um código sem função. Exige um servidor online.

## Tarefas
- [ ] Desenhar o fluxo (TV mostra código, site recebe a lista, TV baixa) e o custo.

## Critérios de aceitação (BDD)
- **Dado** o código da TV, **quando** cadastro uma lista no site com ele, **então** a TV entra sem eu digitar usuário e senha nela.
