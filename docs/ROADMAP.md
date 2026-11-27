# Roadmap e fila de prioridade

A fila de verdade são as issues do GitHub (ordem: P0 > P1 > P2 > P3, e a ordem abaixo dentro de cada nível). Este arquivo guarda a **ordem e o porquê**; o Claude atualiza quando a fila muda.

## Pronto (esqueleto)

Login/importar lista · Perfis · Home · Filmes · Séries · TV ao Vivo · Detalhe · Player básico · Favoritos/Histórico · Contas · Testes (unit + BDD) · CI.

## Fila (ordem dentro de cada prioridade)

Fundação (sem isso nada do resto é seguro): arquitetura segura (Supabase + RLS), regras de negócio testadas, login, usuários/planos, aparelhos/telas, recuperar senha, home nova, perfil/plano, segurança nos testes, carga/estresse, deploy com trava de CI.

A fila de verdade é o quadro do GitHub (`node tools/kanban.js fila`). Ordem: **P0 > P1 > P2 > P3**; dentro do nível, a ordem de criação das issues.
