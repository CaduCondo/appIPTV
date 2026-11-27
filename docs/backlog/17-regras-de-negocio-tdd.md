---
titulo: Regras de negócio puras (planos, telas, senhas, bloqueio) com TDD
labels: tipo:feature, prioridade:p1, estado:todo, area:login
---
## Contexto
As regras de planos, telas simultâneas, empilhamento de planos, geração de usuário/senha e bloqueio por tentativas precisam existir em um módulo puro (`js/rules.js`), testado no Node, que depois serve tanto o app quanto o servidor.

## Tarefas
- [ ] Testes primeiro (TDD), depois `js/rules.js` orientado a objeto e comentado.
- [ ] Documentar em `docs/REGRAS_DE_NEGOCIO.md`.

## Critérios de aceitação (BDD)
- **Dado** que faltam 2 meses do plano atual, **quando** contrata 1 ano, **então** o novo plano começa ao fim do atual e o total é 1 ano e 2 meses.
- **Dado** um plano com 2 telas, **quando** um terceiro aparelho tenta ficar online, **então** é recusado.
- **Dado** a criação automática, **quando** gera usuário e senha, **então** cada um tem 6 números e o usuário é único.
- **Dado** 5 senhas erradas seguidas, **quando** tenta de novo, **então** está bloqueado por alguns minutos.
