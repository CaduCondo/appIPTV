# Pedidos e decisões do Cadu

Registro do que foi pedido e decidido, em ordem. O Claude atualiza este arquivo sempre que o Cadu pedir ou decidir algo novo.

## 25/nov/2026 — começo do projeto

- **Objetivo:** app de filmes e séries a partir de uma lista, que depois será alimentada por uma lista de IPTV assinada (provedor ainda não escolhido). Primeira ideia foi só conteúdo gratuito e legal; depois ficou "deixar pronto para importar a lista e tudo funcionar". O app é um player genérico; nenhuma lista entra no repositório.
- **Referências de layout:** prints de apps de TV (Zuxo, Cortex Player, Funplay) e das telas de listagem, detalhe e ator. O Cadu pode mandar mais telas; **primeiro o esqueleto, depois o refinamento**.
- **Dados reais no demo:** pode usar pôsteres, fotos e notas reais só para demonstração; depois a carga de uma lista traz tudo.

### Telas pedidas

1. **Login / importar lista:** login, senha, algum código, algum jeito de importar a lista. Depois de entrar, o usuário já tem todo o conteúdo da lista. *(feito: usuário e senha, link M3U, arquivo, demonstração; "código" ainda não — issue no backlog)*
2. **Perfis:** o usuário cria o próprio perfil, com favoritos e configurações só dele (referência: tela "Quem está assistindo?" do Zuxo). *(feito: criar, editar, excluir, cor; favoritos e histórico por perfil)*
3. **Home (hub):** botões de TV ao Vivo, Filmes, Séries, Configurações e Conta. Gosta de ter **mais informação**: jogos do dia (decidir o que acontece ao clicar depois), últimos filmes/séries assistidos, últimos incluídos na lista. *(feito: continuar assistindo, adicionados recentemente, tiles com contagem; jogos do dia é só um espaço "em breve")*
4. **Listagem de Filmes e Séries:** categorias (filtros pré-definidos) em botões à esquerda; à direita os títulos da categoria. Cada título mostra o **pôster oficial**, nome embaixo e **a nota no canto superior esquerdo**. Séries é igual a Filmes. *(feito)*
5. **Detalhe do título:** imagem, nome, dados (data, nota, faixa etária, categorias), sinopse, fotos dos atores com o nome do personagem; em série: botões de temporadas e, abaixo, os episódios com **print real do episódio**, "Temporada 02 - Episódio 05" e uma pequena sinopse. *(feito com o que a lista traz; elenco com foto, print real e sinopse de episódio dependem de uma base de catálogo — issue no backlog)*
6. **Detalhe do ator:** informações do ator e, abaixo, os filmes em que atuou. *(só o modelo estático; depende da base de catálogo)*

### Decisões de processo

- O Claude desenvolve o ciclo todo: issue no GitHub, kanban, código, testes unitários e funcionais (Robot Framework com Python), CI no GitHub Actions, análise do resultado, issue para defeito do sistema com gravidade, backlog ordenado por importância e risco, e recomeça com a próxima issue. Tudo documentado.
- O Cadu não é programador: tudo explicado em linguagem simples.
- Links de referência que o Cadu achou: megacubo.tv (guia de lista IPTV), noticiasdoes.com.br, dicas.zone, lumi.new (IA que gera players IPTV). Lista a assinar: growthtech.com.br (depois do app pronto).

## 25/nov/2026 — navegar na demonstração

- Cadu quer abrir e navegar pelo app, mesmo com conteúdo mockado, para ir ajustando o visual. Decisão: demonstração publicada no GitHub Pages (https://caducondo.github.io/appIPTV/) e catálogo de exemplo maior (issue #17).
- Cadu quer respostas curtas e diretas, só com o importante e as decisões dele (issue #16, regra no `CLAUDE.md`).

## 27/nov/2026 — processo, segurança e sistema de usuários

### Processo e engenharia (pedido)
- Processo de desenvolvimento "muito bem feito" com as melhores ferramentas; GitHub (código/issues/Actions), Supabase (banco; já tem 2 projetos, talvez não possa criar mais — pode usar outros e-mails/contas ou outra ferramenta), Vercel.
- Segurança forte: senhas criptografadas, rotas de API com autenticação, limite de tentativas de login, RLS nas tabelas. "Não pode ser invadido de jeito nenhum" → ver `docs/SEGURANCA.md`.
- Testes: unitários, funcionais, carga, estresse, pentest, em BDD, com Page Objects; TDD; código comentado, orientado a objeto, reuso e refatoração contínua; regras de negócio documentadas.
- Esteira da issue: **BACKLOG → TO-DO → WIP → WTT → DONE → IN (In Production)**. Só publica se o CI passar; erro vira issue e ganha teste para nunca voltar.

### Tela de login (pedido)
- Usuário e senha. Usuário automático de 6 números e senha de 6 números; manual com 11 números (telefone). Usuário é chave única.
- Controlar onde o app foi instalado e se está online (limite de telas ao mesmo tempo, que o administrador define). MAC não dá para ler: usar código do aparelho (ver `docs/REGRAS_DE_NEGOCIO.md`).
- Administrador: usuário `010101`, plano Grátis, sem limite de dispositivos, com botão **Criar usuário** na home. A senha dele **não** vai para o repositório.
- Criação de usuário: automático/manual → plano (Grátis, Degustação 2h, Mensal, Trimestral, Semestral, Anual, 2 Anos, 3 Anos) → telas (1 a 5; Degustação é 1) → Criar → **Compartilhar por WhatsApp** com mensagem pronta.
- Mensagens de erro de login sempre iguais (não dizer qual errou); tratar todas as possibilidades. Tem **Esqueci minha senha** (método escolhido: código por e-mail + redefinição pelo administrador).
- Futuro: usuário recarrega o plano sozinho com **Pix** automático; planos empilham (novo começa quando o atual acaba).

### Perfil e favoritos (pedido)
- Perfil só separa favoritos (TV ao Vivo, Filmes, Séries). Decisão do Claude: salvar **no banco**, ligado a usuário+perfil (vale em qualquer aparelho), com cópia local.

### Home (pedido)
- Juntar o melhor de vários apps em layout simples e bonito, com foco em **TV online, Filmes e Séries**.
- **Sem barra de rolagem lateral: usar carrossel.**
- Botão **Perfil** (Trocar perfil, Configurações, Ajustes, **Plano**: atual à esquerda, disponíveis à direita; sem Grátis/Degustação, só o administrador vê).
- Bloco **Últimos adicionados** (10–20 títulos, filmes e séries; etiqueta "Filme"/"Série" no topo esquerdo, nota "X,XX" no topo direito). Bloco **Jogos do dia** (leva ao canal; antes do início mostra o horário).

## 27/nov/2026 — respostas do Cadu (nome, TV, banco)

- **Nome do app: CineHomeTV** (antes "Cinema Livre"/"IPTVHome"). Issue #40.
- **TV:** TCL com Android TV (confirmar o modelo). Decisão: o destino é um **app de Android TV** (instalado na TV, sem depender de computador); o `iniciar.bat` serve de ponte para testar. Issues #1 e #9.
- **Banco:** conta nova no Supabase com outro e-mail do Cadu. A conta precisa ser criada por ele (confirmação por e-mail e aceite dos termos); depois conectamos. Issue #22.
- **Modelo da TV:** Smart TV TCL 55" QLED Mini LED 4K **C6K** (Google TV/Android TV). Base para o app de TV (issue #9).

## 28/nov/2026 — responsivo

- O app deve ser **totalmente responsivo**: TVs de vários tamanhos e celulares de vários tamanhos, se encaixando na tela, qualquer que seja o tamanho (issue #43, `docs/RESPONSIVIDADE.md`).
