---
titulo: Publicar na Vercel (homologação e produção) só se o CI passar
labels: tipo:infra, prioridade:p1, estado:backlog, area:infra
---
## Contexto
Cada Pull Request gera um ambiente de homologação; a produção só publica a partir da `main` com o CI verde. Resolve também a issue #1 (como a TV acessa o app) e o link da demonstração.

## Critérios de aceitação (BDD)
- **Dado** um Pull Request, **quando** o CI passa, **então** há um endereço de homologação para testar.
- **Dado** um CI vermelho, **quando** tento publicar na produção, **então** a publicação não acontece.
