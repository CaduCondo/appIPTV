---
titulo: Arquitetura segura: banco, login e RLS no Supabase
labels: tipo:infra, prioridade:p1, estado:bloqueado, area:seguranca
---
## Contexto
Para ter usuários, planos, aparelhos, perfis e favoritos em qualquer aparelho precisamos de banco e login de verdade. O Cadu usa Supabase mas já tem 2 projetos e talvez não possa criar mais.

**Bloqueada:** decisão do Cadu sobre onde hospedar o banco (nova conta/e-mail no Supabase, ou outra ferramenta). Até lá o app usa dados de teste por trás de uma camada (`js/auth.js`) que troca para o banco sem mexer nas telas.

## Tarefas
- [ ] Decidir conta/projeto (Supabase em outra conta, ou alternativa).
- [ ] Modelar tabelas (`docs/ARQUITETURA.md`) e criar com migrações versionadas.
- [ ] **RLS ligado em todas as tabelas** com política por tabela; só o servidor usa a chave de serviço.
- [ ] Login pelo Supabase Auth (usuário numérico mapeado para uma conta interna); senha só como hash.
- [ ] Papel `admin` verificado no servidor.
- [ ] Ambientes separados: teste e produção.

## Critérios de aceitação (BDD)
- **Dado** um usuário comum logado, **quando** tenta ler os dados de outro usuário, **então** o banco recusa.
- **Dado** uma chamada sem login, **quando** acessa qualquer rota de API, **então** recebe "não autorizado".
- **Dado** o banco de teste, **quando** rodam as migrações, **então** todas as tabelas têm RLS ligado.
