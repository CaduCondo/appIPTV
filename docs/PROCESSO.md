# Como trabalhamos neste projeto

Regras para manter o repositório organizado, documentado e testado. O Claude segue este processo em **todo** trabalho (ver também `CLAUDE.md`).

## O ciclo (sempre)

```
Issue → Planejar → TDD (teste primeiro) → Código → Testes (unit → funcional → integração) → PR → CI verde → Merge → Produção → Conferir no ar → Documentar → Próxima issue
```

| Coluna | O que acontece |
|---|---|
| **BACKLOG** | Issue criada com o melhor conteúdo possível: cenário, resultado esperado, resultado obtido (se for bug), BDD |
| **TO-DO** | Priorizada (P0–P3 e risco) e com critérios claros; o Claude pega a primeira da fila |
| **WIP** | Branch `tipo/N-assunto`; **TDD**: escreve o teste que falha, escreve o código mínimo, refatora |
| **WTT** | Testes unitários, funcionais (BDD com Page Objects), integração, regressão, segurança; rodam local e no GitHub Actions |
| **DONE** | CI verde, Pull Request mergeado na `main` |
| **IN** | Publicado em produção (Vercel) e conferido no ar; issue fechada |

Regra de ouro: **só vai para produção se o CI passar.** Erro achado em qualquer fase vira issue, é corrigido e ganha um teste que garante que **nunca mais volte**; então o ciclo recomeça com a próxima issue.

## Tipos de teste (todos no CI quando possível)

Unitário · funcional (BDD) · integração · homologação (ambiente de teste na Vercel antes da produção) · **regressão** (todo o BDD, em todo PR) · segurança/pentest · carga · estresse. Detalhe em `docs/TESTES.md`.

## Qualidade do código

- **TDD:** teste antes do código.
- **Orientação a objetos e reuso:** regras de negócio em classes/módulos puros (`js/rules.js`), telas só chamam; nada de copiar e colar.
- **Comentários:** todo módulo, classe e função explica o porquê (em português), principalmente regras de negócio.
- **Refatorar sempre:** ao mexer numa área, deixa melhor do que achou; dívida pequena paga na hora, nunca acumula.
- **Documentar regras de negócio** em `docs/REGRAS_DE_NEGOCIO.md` junto com cada mudança.

## Defeito achado pelos testes

1. **Defeito do sistema:** o Claude abre uma issue (etiqueta `tipo:bug`) com contexto, causa, gravidade (P0–P3), cenários BDD e link do run/vídeo; entra na fila pela gravidade.
2. **Defeito do teste:** corrige o teste.
3. Depois de resolver, o Claude pergunta "por que o teste que existia não pegou?" e corrige a causa.

## Issues

- Uma issue = um assunto. Conteúdo: **cenário**, **teste**, **resultado esperado**, **resultado obtido** (bug) e **BDD**. Modelo em `.github/ISSUE_TEMPLATE/` (bug e tarefa).
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
