---
titulo: Testes de carga e estresse (k6)
labels: tipo:teste, prioridade:p2, estado:backlog, area:infra
---
## Contexto
Medir quantos usuários o login e a importação aguentam, o que quebra primeiro e como o sistema se comporta sob estresse.

## Critérios de aceitação (BDD)
- **Dado** 200 usuários entrando em 1 minuto, **quando** o teste de carga roda, **então** 95% das respostas saem em menos de 1 segundo.
- **Dado** carga acima do limite, **quando** o estresse roda, **então** o sistema responde com erro controlado, sem cair.
