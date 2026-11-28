# Regras de negócio

Fonte da verdade do que o sistema deve fazer, em linguagem simples. Mudou uma regra? Atualiza aqui no mesmo Pull Request e ajusta os cenários BDD.

## 1. Usuários

- O acesso é por **usuário e senha numéricos**. O usuário é **chave única** (não existem dois iguais).
- **Criação automática:** usuário de **6 números** aleatórios e senha de **6 números** aleatórios. Se o usuário sorteado já existir, sorteia outro.
- **Criação manual:** o administrador digita o usuário, que deve ter **11 números** (o telefone da pessoa, com DDD). A senha é sempre gerada automaticamente (6 números).
- O administrador é o usuário `010101`, plano **Grátis**, **sem limite de dispositivos**. A senha dele **nunca** fica no código nem no repositório.
- Só o administrador vê o botão **Criar usuário** na home.

## 2. Planos (tempo de acesso)

| Plano | Duração | Quem pode escolher |
|---|---|---|
| Grátis | para sempre | só o administrador |
| Degustação | 2 horas | só o administrador (1 tela, sem escolher telas) |
| Mensal | 1 mês | todos |
| Trimestral | 3 meses | todos |
| Semestral | 6 meses | todos |
| Anual | 1 ano | todos |
| 2 Anos | 2 anos | todos |
| 3 Anos | 3 anos | todos |

## 3. Telas (dispositivos online ao mesmo tempo)

- Cada plano vem com **1 a 5 telas**: é quantos aparelhos podem estar **online ao mesmo tempo**. Degustação é sempre 1 tela.
- Um aparelho está **online** enquanto o app avisa o sistema que está aberto (a cada ~30 segundos). Sem aviso por ~2 minutos, o aparelho sai de online.
- Se o usuário tentar abrir o app com o limite de telas cheio, o app **não entra** e mostra: "Seu plano permite N tela(s) ao mesmo tempo e já estão em uso." O administrador pode liberar mais telas.
- O sistema identifica o aparelho por um **código do aparelho** gerado na instalação (não é possível ler o MAC em navegador nem em Android atual). Esse código não aparece na tela de login.

## 4. Renovação e troca de plano (empilha)

- Quem contrata um plano **enquanto ainda tem outro ativo** não perde o que sobrou: o novo plano **começa quando o atual termina**. Ex.: faltam 2 meses e compra 1 ano → fica com 1 ano e 2 meses.
- Durante o plano atual vale a quantidade de telas **dele**. A quantidade de telas do plano novo só vale quando ele começa.
- O Grátis e a Degustação não entram nessa conta (só o administrador os escolhe).

## 5. Login e mensagens

- Usuário ou senha errados: **sempre a mesma mensagem**: "Usuário ou senha incorretos." Nunca dizer qual dos dois errou.
- Muitas tentativas erradas: bloqueio temporário com a mensagem "Muitas tentativas. Tente novamente em alguns minutos." (também igual para usuário que não existe).
- Plano vencido: "Seu plano venceu. Escolha um plano para continuar."
- Sem internet / servidor fora: "Não consegui conectar. Verifique a internet e tente de novo."

## 6. Esqueci minha senha

- Se o usuário cadastrou um **e-mail**, recebe um **código de 6 números** (vale 10 minutos, uso único, 5 tentativas). Com o código ele define uma senha nova.
- A resposta na tela é **a mesma** exista ou não o usuário: "Se houver um cadastro, enviamos um código para o e-mail dele."
- Quem não tem e-mail pede ao administrador, que gera uma senha nova.

## 7. Perfis

- Perfis servem para **separar o que é salvo**: favoritos de TV ao Vivo, de Filmes e de Séries (e o "continuar assistindo"). Ficam guardados no banco, ligados ao usuário e ao perfil, e valem em qualquer aparelho.

## 8. Home

- Três funções em destaque: **TV ao Vivo, Filmes, Séries**.
- **Últimos adicionados:** carrossel de 10 a 20 títulos (filmes e séries misturados); etiqueta "Filme" ou "Série" no canto superior esquerdo da capa e a **nota "X,XX"** no canto superior direito.
- **Jogos do dia:** cada jogo leva ao canal que transmite. Antes do início, mostra "O jogo começa às HH:MM"; depois do início, abre o canal direto.
- **Perfil:** Trocar perfil, Configurações, Ajustes e Plano.
- **Plano:** à esquerda o plano atual; à direita os planos disponíveis (sem Grátis e Degustação, que só o administrador vê).
- Nunca usar barra de rolagem lateral: onde houver lista que não cabe, usa **carrossel**.

## 9. Pagamento (futuro)

- O usuário escolhe plano e telas, o sistema gera um **Pix**, confirma o pagamento sozinho e libera o plano. O administrador é avisado de cada geração e confirmação.

## 10. Player

- **Filme, episódio e canal ao vivo** tocam na própria tela do app. Canais ao vivo usam HLS (`.m3u8`).
- **Erros sempre com mensagem clara e o que fazer:** formato que o aparelho não toca (ex.: `.mkv`, `.avi`), falha de conexão, arquivo com problema e **canal fora do ar**. Toda mensagem de erro vem com o botão **Tentar de novo**.
- **Retomar:** filme e episódio voltam de onde pararam, só se já passou de 2 segundos e não está nos últimos 10 segundos. O botão vira **Continuar**.
- **Ao vivo:** as setas ↑ ↓ trocam de canal dentro da mesma categoria, dando a volta nas pontas.
- No player: ← → pulam 10 s, espaço/Enter pausa, Esc/Voltar sai. O cabeçalho some depois de 3 s e volta ao mexer no mouse ou apertar uma tecla.

## 11. Listagens (Filmes, Séries, TV ao Vivo) — pronto

- Título em maiúsculas no topo esquerdo (**FILMES**, **SÉRIES**, **TV AO VIVO**) e, no topo direito, o combo **Ordenar**: De A até Z, De Z até A, Data de lançamento (mais novo primeiro; sem data por último), Melhor nota, Adicionados recentemente. Vale para todas as listas.
- **Uma barra de rolagem só:** o menu da esquerda e os títulos da direita rolam juntos; quando uma coluna termina, a outra continua.
- **Buscar:** só filtra a partir da **3ª letra** e procura em **qualquer parte do nome**, sem ligar para acento ou maiúscula ("amo" acha "Amor te amo", "amorzinho", "eu falei amor").
- **Menu, nesta ordem, cada botão com a contagem "(N)":** Continuar assistindo · Favoritos · Adicionados recentemente (os últimos 100) · Todos · ano atual (até 100) · ano anterior (até 100) · gêneros em ordem alfabética · streamings em ordem alfabética (AMC+, Apple TV+, Disney+, Netflix...). Botão sem título dentro não aparece.
- Um título com mais de um gênero aparece em todos (depende da base de catálogo, issue #7; a lista do provedor traz uma categoria só).

## 12. Home — pronto

- Sem botão **Criar usuário** (fica em Perfil, só administrador).
- Carrosséis **Últimos filmes adicionados** e **Últimas séries adicionadas** (até 20 títulos): o título é um link para a lista com **Adicionados recentemente** selecionado.

## 13. Detalhe do filme/série — a fazer (issue #47)

- A tela é **a mesma para filme e série**; a série tem **um bloco a mais** (temporadas e episódios) que não muda com as regras abaixo.
- Sem pôster no topo esquerdo (a imagem vira fundo transparente; textos nunca transparentes). **Janela de player** no topo direito que começa sozinha (do começo ou de onde parou); tocar nela abre a **tela cheia**; faixa de progresso embaixo.
- Botões abaixo do título são **filtros**: gênero → lista do gênero; data **DD-MM-AAAA** → lista do ano; nota **⭐ X,XX** → títulos com o mesmo primeiro dígito da nota.
- **Assistir** (nunca começou) · **Voltar a assistir** (começou: abre dica com "Voltar a assistir" e "Começar novamente") · **Assistir novamente** (terminou). O progresso só é gravado em **tela cheia**.
- **Favorito** vira **Desfavoritar** com coração vermelho. Sem Relacionadas e sem Ouvir.

## 14. Player em tela cheia — a fazer (issue #48)

- Seta ↓ mostra a barra de tempo (atual e total), título e opções; ao avançar mostra **prévia da cena**. Configurações: áudio, legenda (ligar/desligar, idioma, tempo, tamanho Normal/Grande/Pequeno, estilo).

## 15. Avaliação no fim do filme — a fazer (issue #49)

- No fim aparece uma telinha pequena: **"Qual sua nota?"** com 10 estrelas (setas, mouse ou toque; cada estrela sobe e fica amarela). A nota entra na conta da nota do título.

## 16. TV ao Vivo nova — a fazer (issues #50, #51, #52)

- Colunas que abrem para a direita conforme o foco: tipos de canal → canais → programação do canal → dias (7 atrás a 7 à frente) → horários do dia (início, fim, título, sinopse). Busca que filtra a cada letra, lista de favoritos e de agendados.
- Programa passado (até 7 dias): dá para assistir. Ao vivo: ↓ mostra título, sinopse, início/fim, barra de porcentagem e Favoritar/Desfavoritar. Futuro: agenda.
- **Qualidade:** em Configurações o usuário escolhe **Automático** (sempre a melhor que não trava, baixando sozinho se a internet não aguentar) ou **Manual** (↓ mostra as qualidades: SD, HD, FHD, 4K, 8K...).
