# Como trabalhamos neste projeto

Regras para manter o repositório organizado, documentado e testado. O Claude segue este processo em **todo** trabalho (ver também `CLAUDE.md`).

## O ciclo (sempre)

```
Issue → Analisar → Desenvolver → Testar → Commitar → Pull Request → Actions verde → Merge → Fechar → Documentar → Próxima issue
```

| Passo | O que acontece | Estado da issue |
|---|---|---|
| Escolher | O Claude escolhe a próxima da fila (valor, esforço, risco, urgência) | `estado:pronto` |
| Analisar | Completa contexto, causa raiz, tarefas e critérios BDD na própria issue | `estado:andamento` |
| Desenvolver | Mudança pequena na branch `tipo/N-assunto` | `estado:andamento` |
| Testar | `npm run test:unit` e `npm run test:bdd`; e abre o app de verdade no navegador | `estado:andamento` |
| Commitar | Um commit por assunto, `Refs #N`, e push | `estado:andamento` |
| Pull Request | O Actions roda unit → smoke → regressão | `estado:teste` |
| Merge e fechar | Só com tudo verde; comentário simples do que foi feito | `estado:feito` |
| Documentar | README, `docs/`, manual do Cadu, roadmap, cenários BDD | — |

Regra de ouro: **nada é "feito" sem teste verde.** Se o Actions falhar, a issue volta para `estado:andamento` com um comentário dizendo o que falhou.

## Defeito achado pelos testes

1. **Defeito do sistema:** o Claude abre uma issue (etiqueta `tipo:bug`) com contexto, causa, gravidade (P0–P3), cenários BDD e link do run/vídeo; entra na fila pela gravidade.
2. **Defeito do teste:** corrige o teste.
3. Depois de resolver, o Claude pergunta "por que o teste que existia não pegou?" e corrige a causa.

## Issues

- Uma issue = um assunto. Modelo em `.github/ISSUE_TEMPLATE/` (bug e tarefa).
- Toda issue tem `tipo:*`, `prioridade:*` e `estado:*`.
- Rascunhos em `docs/backlog/` (`node tools/criar_issues.js --apply` cria o que ainda não existe).
- Critérios de aceitação sempre em BDD: **Dado** (situação), **Quando** (ação), **Então** (resultado).

## Commits, branches, Pull Requests

- Um commit = uma ideia; código, teste e documentação dessa ideia juntos. Mensagem em português, no imperativo, até 72 caracteres; prefixo `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`; no fim `Refs #N` ou `Closes #N`.
- Branch por issue: `feat/12-ajustes`, `fix/7-player`. Nunca commitar direto na `main`.
- O PR descreve o que mudou, como foi testado e o que ficou de fora.

## Documentação acompanha o código

Mudou comportamento? Atualiza o README e o guia certo no mesmo PR. Decisão ou pedido do Cadu? Vai para `docs/PEDIDOS-E-DECISOES.md`. Mexeu em componente? Atualiza o design system.

## O que nunca entra no repositório

Listas, links de provedor, usuários, senhas, tokens, `config.local.js`, prints com dados de conta.
