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
