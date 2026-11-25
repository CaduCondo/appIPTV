# Quadro Kanban

A fila de trabalho são as **issues** de https://github.com/CaduCondo/appIPTV/issues, organizadas por etiquetas.

## Etiquetas

| Tipo | Etiquetas |
|---|---|
| Estado (coluna) | `estado:backlog` · `estado:pronto` · `estado:andamento` (no máximo 2) · `estado:teste` · `estado:feito` · `estado:bloqueado` |
| Tipo | `tipo:feature` · `tipo:bug` · `tipo:docs` · `tipo:infra` · `tipo:teste` |
| Prioridade | `prioridade:p0` (urgente) · `prioridade:p1` · `prioridade:p2` · `prioridade:p3` |
| Área | `area:login` · `area:perfis` · `area:home` · `area:catalogo` · `area:player` · `area:infra` |

## Como o Claude mexe

- `node tools/kanban.js estado <n> <estado>` troca o estado de uma issue.
- `node tools/kanban.js comentar <n> "texto"` comenta.
- `node tools/kanban.js fila` mostra a fila ordenada (P0 → P3).

(Usa a API REST do GitHub pelo `gh`; precisa do `gh` autenticado.)

## Quadro visual (GitHub Project) — passo único para o Cadu

O quadro de colunas do GitHub exige uma permissão que a sessão do Claude não tem. Para ter as colunas:

1. No GitHub: seu perfil → **Your projects** → **New project** → **Board**. Nome: `Cinema Livre`. Coloque as colunas Backlog, Pronto, Em andamento, Em teste, Feito, Bloqueado.
2. Em **Workflows** do projeto, ligue "Auto-add to project" para o repositório `appIPTV`.
3. Avise o Claude. Enquanto isso o quadro funciona pelas etiquetas `estado:*` (filtre as issues por etiqueta).

Nunca cole tokens no chat, em issue ou em arquivo do repositório.
