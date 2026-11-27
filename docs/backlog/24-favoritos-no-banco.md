---
titulo: Favoritos por perfil (TV, Filmes, Séries) salvos no banco
labels: tipo:feature, prioridade:p2, estado:backlog, area:perfis
---
## Contexto
Decisão do Claude: favoritos ficam no banco, ligados ao usuário e ao perfil (valem em qualquer aparelho), com cópia local para abrir rápido. Depende da issue de arquitetura segura.

## Critérios de aceitação (BDD)
- **Dado** um favorito salvo no perfil A, **quando** entro no perfil B, **então** ele não aparece.
- **Dado** um favorito salvo em um aparelho, **quando** entro em outro aparelho com o mesmo usuário e perfil, **então** ele aparece.
