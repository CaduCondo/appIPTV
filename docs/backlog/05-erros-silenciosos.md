---
titulo: Não engolir erros em silêncio (mostrar mensagem e testar)
labels: tipo:bug, prioridade:p2, estado:backlog, area:catalogo
---
## Contexto
Em 25/nov/2026 uma troca de código quebrou o carregamento de detalhes de séries e **nada apareceu para o usuário**, porque o erro era engolido por um `catch` vazio (`fetchInfo(...).catch(function(){})`). Só o teste BDD pegou. Há outros pontos parecidos.

## Tarefas
- [ ] Achar todos os `catch` vazios em `js/` e `*.html`.
- [ ] Mostrar uma mensagem simples ("Não consegui carregar os detalhes") com botão para tentar de novo.
- [ ] Cenário BDD em que o provedor falha só no detalhe e o app avisa.

## Critérios de aceitação (BDD)
- **Dado** um provedor que responde erro na informação da série, **quando** abro a série, **então** vejo a mensagem de erro e continuo conseguindo voltar.
