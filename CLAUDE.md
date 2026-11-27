# Contexto do projeto — leia sempre ao entrar neste repositório

## Sobre o usuário

- Cadu — trabalha como QA, **não é desenvolvedor**. Precisa de explicações simples, passo a passo, sem pular etapas e sem "tecnês". Se precisar citar algo técnico, traduzir o impacto em termos do dia a dia do app.
- Esse padrão de trabalho é o mesmo dos outros projetos dele (Sistema D'Uvo Enterprise, Dashboard Auto Casa, Projeto Orçamento). Este arquivo foi montado a partir deles.

## Como responder ao Cadu (regra dele, 25/nov/2026 — vale sempre)

- **Resposta curta e direta.** Só o mais importante: o que ficou pronto e como ele abre/vê, e **principalmente** as dúvidas ou decisões que dependem dele (em uma pergunta objetiva cada).
- Sem relatório longo: nada de listar tudo que foi feito, tabelas, histórico de tentativas ou explicações que ele não pediu. Se ele quiser detalhe, pede.
- Explicar o que vai mudar ANTES só quando houver risco ou decisão; o resto vai direto ao resultado.
- Passo a passo só quando ele precisar executar algo, e curto.
- O detalhe completo fica nos lugares certos (issue, PR, `docs/`), não na resposta.

## O projeto

- **Cinema Livre**: app para assistir filmes, séries e TV ao vivo a partir de uma **lista** que o usuário importa (painel Xtream com usuário e senha, link M3U ou arquivo .m3u). Feito primeiro para TV (controle remoto), mas funciona no navegador.
- Telas prontas: entrar (usuário e senha numéricos, teclado para controle remoto), criar usuário (só administrador), esqueci minha senha, importar lista (só administrador), perfis, home (hub), listagem de Filmes/Séries/TV ao Vivo (categorias à esquerda, pôsteres à direita), detalhe de filme/série (elenco, temporadas, episódios), player, favoritos/histórico, contas. A tela de ator é só um modelo estático (`modelo-ator.html`).
- Stack hoje: HTML + JavaScript puro + React (arquivos locais em `js/`, sem build), componentes em `js/bundle.js`/`css/bundle.css` (design system "Cinema Livre"), dados no navegador (localStorage + IndexedDB). `servidor.py` serve o app e faz o proxy `/proxy?url=` (evita o bloqueio CORS dos provedores).
- Design system: https://claude.ai/artifact/L9nrpLdS1CPqMBYFFa9MDV (tokens, componentes, 3 telas de exemplo). O que mudar em `js/bundle.js` ou `css/bundle.css` deve ser refletido lá.
- Repositório: https://github.com/CaduCondo/appIPTV

## Visão de engenharia (pedido do Cadu, 27/nov/2026)

Processo de desenvolvimento muito bem feito, com as melhores ferramentas. Detalhe em `docs/PROCESSO.md`, `docs/SEGURANCA.md`, `docs/ARQUITETURA.md`, `docs/REGRAS_DE_NEGOCIO.md`, `docs/TESTES.md`.

- **Ferramentas:** GitHub (código, issues, Actions), Supabase (banco, login, RLS, funções), Vercel (hospedagem do site e funções; publica sozinha a versão aprovada). O Cadu já tem 2 projetos no Supabase e talvez não possa criar mais: se faltar, propor outra conta/e-mail ou outra ferramenta (decisão dele).
- **Segurança em primeiro lugar** ("não pode ser invadido"): senhas só como hash, rotas de API com login, limite de tentativas, **RLS em toda tabela**, mensagem de erro de login **sempre igual** (nunca dizer se errou usuário ou senha), nenhum segredo no repositório (a senha do admin não entra em código, docs ou testes). Honestidade: nenhum sistema é 100% invulnerável; reduzimos risco em camadas e testamos sempre.
- **Testes:** unitários, funcionais, integração, homologação, **regressão**, segurança/pentest, carga e estresse, sempre escritos em **BDD**, com **Page Objects** nos testes de tela. A regressão roda no CI e **só vai para produção se o CI passar**.
- **TDD:** escrever o teste antes do código.
- **Código:** sempre **comentado** (em português, explicando o porquê), o mais **orientado a objeto** possível, **reusando** o máximo e **refatorando** sempre (nunca acumular dívida até a refatoração ficar inviável). Regras de negócio em módulos puros (`js/rules.js`), telas só chamam.
- **Documentação:** toda regra de negócio nova ou alterada vai para `docs/REGRAS_DE_NEGOCIO.md` no mesmo PR.
- **Esteira da issue (colunas do quadro):** `BACKLOG → TO-DO → WIP → WTT → DONE → IN`. WIP = desenvolvendo; WTT = Working on The Tests; DONE = CI verde e mergeado; IN = em produção e conferido (**aí a issue fecha**). Só avança com a evidência da coluna; teste que falha volta a issue para WIP.
- **Issue com o melhor conteúdo:** cenário, teste, resultado esperado, resultado obtido (bug), BDD, tudo ligado. Erro achado vira issue com gravidade e um teste que o impede de voltar.

## Regras de interface (pedido do Cadu)

- **Nunca barra de rolagem lateral:** onde a lista não cabe, usar **carrossel** (componente `Carousel`).
- Layout simples, bonito e fácil de entender, juntando as melhores ideias de vários apps; foco nas 3 funções principais: **TV ao Vivo, Filmes, Séries**.
- Nota sempre no formato "X,XX" (duas casas, vírgula).

## Regra de conteúdo (importante)

- O app é um **player genérico**. Nunca colocar no repositório: links, usuários, senhas ou listas de provedores, nem conteúdo de vídeo. Listas e credenciais ficam só no navegador do usuário.
- Cadu pretende assinar uma lista de terceiros. O Claude não consegue verificar a procedência dela; se surgir dúvida sobre licenciamento, avisar em uma linha e seguir construindo o player genérico.
- Pôsteres e fotos em `assets/` (Wikipedia/Wikimedia) são só para demonstração e teste.

## Ambiente do usuário

- Pasta local: `C:\Users\debor\Documents\automacao\projetoIPTV` (Windows). Para rodar: duplo clique em `iniciar.bat` (precisa do Python) e abrir http://localhost:8080.
- Cadu usa o Claude Code no VS Code nos outros projetos. Quando a sessão é **local** (pasta aberta no VS Code), o Claude lê e escreve a pasta direto e Cadu não precisa de `git pull`. Quando a sessão é na **nuvem** (claude.ai), o Claude **não** enxerga a pasta do computador: o código vai pelo GitHub e Cadu atualiza a pasta com `git pull` (passo a passo em `docs/COMECAR_AQUI.md`).
- Sessão na nuvem: o `gh` só funciona pela **API REST** (`gh api repos/CaduCondo/appIPTV/...`); o GraphQL (`gh issue`, `gh label`, `gh pr` direto) é bloqueado. Criar PR: `gh api repos/CaduCondo/appIPTV/pulls -f title=... -f head=BRANCH -f base=main -f body=...`.

## Acessos do Claude

| Onde | Situação |
|---|---|
| GitHub: código, issues, PRs, Actions | CaduCondo/appIPTV — push, issues e PRs pela API REST |
| GitHub Project (quadro) | Precisa do segredo `PROJECT_TOKEN` (ver `docs/KANBAN.md`). Enquanto não existir, o quadro vive nas etiquetas `estado:*` das issues |
| Pasta local do Cadu | Só em sessão local (VS Code) |

Se um acesso falhar, avisar o Cadu em uma linha dizendo qual permissão falta, sem tentar contornar.

## Autonomia (vale sempre, não precisa perguntar de novo)

- Pode alterar código, testes, documentação e configuração de Git, criar branches, issues, PRs e etiquetas.
- **Commit:** sempre e sozinho, um commit por assunto, avisando em uma linha. Antes de terminar qualquer resposta, conferir `git status`; se houver arquivo modificado, commitar.
- **Push:** liberado, na branch da issue. **Nunca commitar direto na `main`** (a exceção foi o commit inicial do projeto).
- **Merge na `main`:** só por Pull Request com o GitHub Actions **verde**; o Claude pode fazer o merge quando estiver verde. Cadu pode mudar essa regra a qualquer momento.
- Antes de dizer "está no ar/entregue", conferir no GitHub que o commit e o Actions realmente chegaram lá.
- Nunca commitar segredos (tokens, senhas, listas). `.gitignore` já protege `results/` e `config.local.js`.

## Ciclo de trabalho contínuo — Claude é o dono do backlog

O Cadu não vai ficar pedindo passo a passo. O Claude toca o backlog do início ao fim, item por item, sem pular passos:

1. **Escolher o próximo item** do backlog (issues abertas), combinando valor, esforço, risco e urgência — não só a ordem em que o Cadu foi citando.
2. **Todo trabalho nasce como issue** (com etiqueta e, quando o quadro existir, no Project) **antes** de mexer no código. Uma issue = um assunto.
3. **Preencher a issue enquanto analisa:** contexto, causa raiz, impacto, tarefas e **critérios de aceitação em BDD** (Dado/Quando/Então).
4. **Implementar** numa branch `tipo/N-assunto` (ex.: `fix/12-player-mkv`), marcando a issue como `estado:wip` (no máximo 2 ao mesmo tempo).
5. **Testar localmente:** `npm run test:unit` e `npm run test:bdd` (Robot Framework). Cenário novo para o que foi feito; bug corrigido ganha cenário que o teria pego.
6. **Commitar** (um commit por assunto, mensagem em português, `Refs #N`) e **dar push**.
7. **Abrir o Pull Request** e mover a issue para `estado:wtt`. Conferir o **GitHub Actions** (unit → smoke → regressão). Não segue com vermelho.
8. **Se o Actions achar defeito do SISTEMA:** criar issue nova (contexto, causa, gravidade, BDD, link do run/vídeo), colocar na fila pela gravidade (dinheiro/dado perdido/entrada no app quebrada no topo). **Defeito do TESTE:** corrigir o teste.
9. **Merge** com tudo verde, `estado:done`; depois de publicado e conferido no ar, `estado:in-production` e **fechar a issue** com um comentário simples do que foi feito.
10. **Checar documentação e testes — sempre, sem exceção:** README/`docs/` desatualizados? documento duplicado? manual passo a passo do Cadu (`docs/COMECAR_AQUI.md`) reflete a tela de verdade? cenário BDD cobre o que mudou? Se um teste já existia e não pegou o bug, descobrir por quê e corrigir a causa.
11. **Escolher e sinalizar o próximo item** e recomeçar — sem esperar o Cadu perguntar "qual o próximo?".

### Backlog sempre priorizado

- Toda issue aberta tem etiqueta `prioridade:*` e `estado:*` (`backlog`, `todo`, `wip`, `wtt`, `done`, `in-production`, `bloqueado`). A ordem da fila é **P0 > P1 > P2 > P3** e, dentro de cada uma, o número de ordem em `docs/ROADMAP.md`.
- Item novo (bug achado, pedido do Cadu, falha do Actions) entra reavaliando a fila inteira, não só no fim.
- `docs/PEDIDOS-E-DECISOES.md` guarda tudo que o Cadu pediu e decidiu (telas, regras). Atualizar sempre que ele pedir ou decidir algo novo.

### Gravidade (para priorizar bugs)

- **P0:** não consegue entrar/usar o app, perde dado do usuário ou vaza senha da lista.
- **P1:** função principal quebrada (importar, listar, tocar) ou risco de segurança.
- **P2:** função secundária quebrada ou melhoria importante.
- **P3:** acabamento, ideia futura.

## Testes automáticos

- **Lógica (unit):** `node --test` em `tests/unit/` — leitura de listas M3U/Xtream.
- **Funcional/integração/regressão (BDD):** Robot Framework + Python/Playwright em `tests/robot/features/*.robot`, em português (Dado/Quando/Então), contra o app de verdade e um provedor de lista **falso** (`tests/mock/xtream_mock.py`).
  - Tag **`smoke`** = rápido e crítico (entrar, criar perfil, home). Roda primeiro. Poucos cenários.
  - Sem tag `smoke` = **regressão**: todo o resto. Só roda depois do smoke passar (`needs`).
  - Tag por tela (`lista`, `login`, `usuarios`, `perfis`, `home`, `catalogo`, `demonstracao`) para rodar só uma: `python -m robot --include login tests/robot/features`.
- **Meta: 100% verde.** Todo vermelho tem causa medida (log, print, vídeo) — nunca "corrigir por dedução".
- **Evidência:** cenário que passa guarda **print**; cenário que falha guarda **vídeo** e print em `results/` (o Actions anexa a pasta no relatório).
- **GitHub Actions** (`.github/workflows/ci.yml`) roda tudo em todo push e Pull Request. Depois de cada push: conferir o resultado, comparar com o anterior e agir sozinho.
- Além do Actions, **testar de verdade** a mudança no navegador (subir `servidor.py`, abrir a tela) antes de dar por concluído. Uma regressão já foi pega assim: erro engolido por `.catch` vazio escondeu um defeito.

## Regras de código

- Mudanças pequenas e fáceis de revisar. Português nas mensagens ao usuário e nos commits.
- Não deixar erro engolido em silêncio: se algo falha, mostrar mensagem clara ao usuário (e o teste deve cobrir).
- Navegação por controle remoto: todo item interativo é focável, com anel de foco visível (`focus`), e funciona com setas/Enter/Esc (`CL.initNav`).
- Componentes novos vão para o design system (README + preview) e para `js/bundle.js`/`css/bundle.css`.

## Documentação (sempre atualizada)

`README.md` (visão geral) · `docs/COMECAR_AQUI.md` (passo a passo do Cadu) · `docs/PROCESSO.md` (como trabalhamos) · `docs/KANBAN.md` · `docs/TESTES.md` · `docs/ROADMAP.md` · `docs/PEDIDOS-E-DECISOES.md` · `docs/ARQUITETURA.md`. Rascunhos de issues em `docs/backlog/`.
