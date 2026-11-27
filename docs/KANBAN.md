# Quadro Kanban

A fila de trabalho são as **issues** de https://github.com/CaduCondo/appIPTV/issues, organizadas por etiquetas.

## Colunas (esteira)

```
BACKLOG → TO-DO → WIP → WTT → DONE → IN
```

| Coluna | Etiqueta | Significa |
|---|---|---|
| **BACKLOG** | `estado:backlog` | Registrada, ainda sem prioridade/preparo |
| **TO-DO** | `estado:todo` | Entendida, com critérios BDD, pronta para pegar |
| **WIP** (Working In Progress) | `estado:wip` | Em desenvolvimento (TDD). No máximo 2 |
| **WTT** (Working on The Tests) | `estado:wtt` | Código pronto; testes unitários, funcionais, regressão e CI rodando |
| **DONE** | `estado:done` | Testes verdes no CI, Pull Request aprovado e mergeado na `main` |
| **IN** (In Production) | `estado:in-production` | Publicada em produção e conferida no ar. **Aqui a issue fecha** |
| Bloqueada | `estado:bloqueado` | Depende de algo de fora (decisão, conta, chave) |

Regra: só avança de coluna com a evidência da coluna (código, testes verdes, merge, conferido no ar). Se um teste falhar em qualquer ponto, a issue **volta** para WIP com um comentário e, se for defeito novo, nasce outra issue.

## Etiquetas

| Tipo | Etiquetas |
|---|---|
| Tipo | `tipo:feature` · `tipo:bug` · `tipo:docs` · `tipo:infra` · `tipo:teste` |
| Prioridade | `prioridade:p0` (urgente) · `prioridade:p1` · `prioridade:p2` · `prioridade:p3` |
| Área | `area:login` · `area:perfis` · `area:home` · `area:catalogo` · `area:player` · `area:infra` · `area:seguranca` |

## Como o Claude mexe

- `node tools/kanban.js estado <n> <backlog|todo|wip|wtt|done|in-production|bloqueado>` troca a coluna (e fecha a issue em `in-production`).
- `node tools/kanban.js comentar <n> "texto"` comenta.
- `node tools/kanban.js fila` mostra a fila ordenada (P0 → P3).

(Usa a API REST do GitHub pelo `gh`; precisa do `gh` autenticado.)

## Quadro visual (GitHub Project) — passo único para o Cadu

O quadro de colunas do GitHub exige uma permissão que a sessão do Claude não tem. Para ter as colunas:

1. No GitHub: seu perfil → **Your projects** → **New project** → **Board**. Nome: `Cinema Livre`. Coloque as colunas Backlog, Pronto, Em andamento, Em teste, Feito, Bloqueado.
2. Em **Workflows** do projeto, ligue "Auto-add to project" para o repositório `appIPTV`.
3. Avise o Claude. Enquanto isso o quadro funciona pelas etiquetas `estado:*` (filtre as issues por etiqueta).

Nunca cole tokens no chat, em issue ou em arquivo do repositório.
