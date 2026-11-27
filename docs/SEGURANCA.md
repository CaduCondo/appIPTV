# Segurança

Meta: o sistema **não pode ser invadido**. Nenhum sistema é 100% invulnerável; o que fazemos é reduzir ao máximo a chance e o estrago, em camadas, e **testar de forma contínua** (inclusive tentando invadir).

## O que protegemos (e de quem)

| O que | Risco | Defesa |
|---|---|---|
| Usuários e senhas do app | Vazar banco; adivinhar senha de 6 números | Senha guardada só como hash forte (nunca texto), limite de tentativas e bloqueio, mensagem igual para qualquer erro |
| Lista do provedor (usuário/senha do IPTV) | Vazar para quem não é dono | Fica só no aparelho do usuário; nunca no repositório, nunca em URL, nunca em log |
| Painel do administrador (criar usuário, liberar telas) | Alguém se passar por admin | Papel `admin` verificado **no servidor** em toda chamada, nunca só na tela |
| Dados de um usuário vistos por outro | Falha de permissão | **RLS** (regras de linha) em todas as tabelas: cada um só enxerga o que é seu |
| API | Chamada sem login, abuso, força bruta | Toda rota exige login (JWT), valida entrada, limita chamadas por usuário/IP |
| Navegador (site) | XSS, clique forjado | Sem HTML vindo de fora na tela, política de segurança de conteúdo (CSP), cabeçalhos de segurança |
| Pagamentos (futuro) | Pagamento falso | Só o aviso assinado do banco/provedor libera plano (webhook com assinatura) |

## Regras de ouro

1. **Nada de segredo no repositório** (senha do admin, chaves, tokens). Ficam em variáveis seguras (Vercel/Supabase/GitHub Secrets).
2. **O servidor decide, a tela só mostra.** Esconder botão não é segurança.
3. **Menor permissão possível:** a chave pública do Supabase só faz o que o RLS permite; a chave de serviço só roda no servidor.
4. **Senha:** hash com bcrypt/argon2 (o Supabase Auth já faz); troca de senha invalida as sessões.
5. **Mensagem de erro igual** para usuário inexistente e senha errada; tempo de resposta parecido.
6. **Limite de tentativas** por usuário e por IP; bloqueio temporário crescente.
7. **Sessão por aparelho** com expiração; o administrador pode derrubar um aparelho.
8. **Registro (log) de eventos sensíveis**: login, falha, criação de usuário, troca de plano, derrubada de aparelho (sem gravar senhas).
9. **Dependências atualizadas** (Dependabot) e varredura de segredos no GitHub ligada.

## Testes de segurança (rodam no CI)

- **RLS:** testes que tentam ler/alterar dado de outro usuário e **devem falhar**.
- **API:** testes sem login, com login errado, com papel errado, com entrada maliciosa (SQL injection, XSS) — **devem ser recusados**.
- **Força bruta:** muitas senhas erradas → bloqueio.
- **Varredura automática** (OWASP ZAP) contra o ambiente de teste em todo Pull Request.
- **Pentest (teste de intrusão):** roteiro manual+automático antes de cada publicação grande, com relatório e issues para o que achar.

## Quando acharem um problema

Issue `tipo:bug` com `prioridade:p0` se expõe senha/dado de usuário; correção + teste que garante que **nunca mais volte**.
