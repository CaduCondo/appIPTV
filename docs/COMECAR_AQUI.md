# Começar aqui (passo a passo para quem não programa)

## 0. Só quero navegar (sem instalar nada)

Abra https://caducondo.github.io/appIPTV/ no navegador (computador, celular ou TV) e toque em **Ver demonstração**. Tudo é conteúdo de exemplo. Perfis, favoritos e histórico ficam salvos naquele aparelho.

## 1. Rodar o app no seu computador (para importar uma lista de verdade)

1. Instale o **Python**: https://www.python.org/downloads/ → baixe, abra o instalador, **marque a caixinha "Add python.exe to PATH"** e clique em Install.
2. Abra a pasta `C:\Users\debor\Documents\automacao\projetoIPTV`.
3. Dê **dois cliques em `iniciar.bat`**. Abre uma janela preta (deixe aberta) e o navegador em `http://localhost:8080`.
4. Para parar: feche a janela preta.

Se aparecer "Python não encontrado", refaça o passo 1 (a caixinha do PATH é a que costuma faltar).

## 2. Entrar no app

Na primeira tela escolha como importar a lista:

- **Usuário e senha:** servidor (começa com `http://`), usuário e senha que o provedor te deu.
- **Link M3U:** cole o link da lista.
- **Arquivo:** escolha um arquivo `.m3u` baixado, ou cole o texto da lista.
- **Ver demonstração:** entra com um catálogo de exemplo (filmes abertos da Blender tocam de verdade).

Depois crie o seu perfil (nome e cor). Favoritos e "continuar assistindo" são de cada perfil.

Teclas: setas navegam, **Enter** abre, **Esc** volta. No player: setas ← → pulam 10 segundos, espaço pausa.

## 3. Atualizar a pasta com a versão mais nova (quando o Claude mexer no código pela nuvem)

O código novo vai para o GitHub. Para trazer para o seu computador:

**Primeira vez** (baixar o projeto): instale o **Git** (https://git-scm.com/download/win), abra o **Prompt de Comando** na pasta `C:\Users\debor\Documents\automacao` e digite:

```
git clone https://github.com/CaduCondo/appIPTV projetoIPTV-novo
```

Isso cria uma pasta nova com tudo. Use essa pasta daqui para frente (apague ou renomeie a antiga depois de conferir).

**Nas próximas vezes:** abra o Prompt de Comando dentro da pasta do projeto e digite:

```
git pull
```

> Se você abrir o projeto no **VS Code com o Claude Code** (como nos outros projetos), o Claude edita a pasta direto e você não precisa fazer `git pull`.

## 4. Se o app abrir "igual ao antigo"

- Apertou **Ctrl+F5** na página? (limpa o que o navegador guardou.)
- Os arquivos novos foram para a pasta certa? A pasta tem que ter `index.html`, `login.html`, `perfis.html`, `home.html`, `iniciar.bat` **na raiz** (não dentro de outra pasta `projetoIPTV`).
- Você abriu pelo `iniciar.bat` (endereço `localhost:8080`)? Abrir o arquivo direto pelo Windows usa outro "espaço" do navegador e pode mostrar dados antigos.

## 5. Ajuda

Algo não funcionou? Conte para o Claude o que apareceu na tela (de preferência com print). Ele abre uma issue no GitHub e trata na fila.
