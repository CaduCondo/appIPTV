*** Settings ***
Documentation     Palavras-chave em português para os cenários BDD (Dado / Quando / Então / E).
Library           ../libs/AppLib.py    WITH NAME    App

*** Keywords ***
Preparar Ambiente
    App.Iniciar Ambiente

Desligar Ambiente
    App.Encerrar Ambiente

Abrir Aparelho Novo
    App.Abrir Contexto

Fechar Aparelho
    App.Fechar Contexto    ${TEST STATUS}    ${TEST NAME}

# ---------- Dado ----------
Que abri o app
    App.Abrir Pagina    /index.html

Que estou na tela de entrar
    App.Abrir Pagina    /entrar.html

Que entrei como administrador
    Entro com o usuário "010101" e a senha "123456"
    App.Esperar Pagina    perfis.html

Que entrei como cliente
    Entro com o usuário "111111" e a senha "222222"
    App.Esperar Pagina    perfis.html

Que estou na tela de importar a lista
    Que entrei como administrador
    App.Abrir Pagina    /lista.html?trocar=1

Que entrei com a lista de teste e o perfil "${nome}"
    Que estou na tela de importar a lista
    ${srv}=    App.Provedor Url
    App.Preencher Campo    0    ${srv}
    App.Preencher Campo    1    test
    App.Preencher Campo    2    123
    App.Clicar No Botao    Importar
    App.Esperar Pagina    perfis.html
    App.Preencher Campo    0    ${nome}
    App.Clicar No Botao    Salvar
    App.Esperar Pagina    home.html

Que entrei pela demonstração com o perfil "${nome}"
    Que entrei como administrador
    App.Preencher Campo    0    ${nome}
    App.Clicar No Botao    Salvar
    App.Esperar Pagina    home.html

Que entrei como cliente com o perfil "${nome}"
    Que entrei como cliente
    App.Preencher Campo    0    ${nome}
    App.Clicar No Botao    Salvar
    App.Esperar Pagina    home.html

Que estou na tela de criar usuário
    Que entrei como administrador
    App.Abrir Pagina    /criar-usuario.html

# ---------- Quando ----------
Toco em Próximos no carrossel "${titulo}"
    App.Clicar No Elemento    section[aria-label="${titulo}"] button[aria-label="Próximos"]

Toco no jogo que ainda não começou
    App.Clicar No Elemento    button.match:has-text("Começa às")

Toco no jogo em andamento
    App.Clicar No Elemento    button.match:has-text("Ao vivo")

Toco no meu perfil
    App.Clicar No Elemento    .cl-profile

Entro com o usuário "${usuario}" e a senha "${senha}"
    App.Abrir Pagina    /entrar.html
    App.Digitar    ${usuario}
    App.Pressionar    Enter
    App.Digitar    ${senha}

Digito a senha "${senha}"
    App.Digitar    ${senha}

Toco nas teclas "${digitos}"
    App.Tocar Teclas    ${digitos}

Toco no botão do teclado "${nome}"
    App.Tocar No Botao Do Teclado    ${nome}

Escolho "${texto}"
    App.Clicar No Elemento    .choice:has(b:text-is("${texto}"))

Toco exatamente em "${botao}"
    App.Clicar No Botao Exato    ${botao}

Digito o usuário "${digitos}" no campo manual
    App.Digitar    ${digitos}

Peço a recuperação para o usuário "${usuario}"
    App.Abrir Pagina    /recuperar.html
    App.Preencher Campo    0    ${usuario}
    App.Clicar No Botao    Enviar código

Preencho servidor, usuário "${usuario}" e senha "${senha}"
    ${srv}=    App.Provedor Url
    App.Preencher Campo    0    ${srv}
    App.Preencher Campo    1    ${usuario}
    App.Preencher Campo    2    ${senha}

Toco em "${botao}"
    App.Clicar No Botao    ${botao}

Escolho a aba "${aba}"
    App.Clicar No Botao    ${aba}

Colo o link da lista M3U
    ${srv}=    App.Provedor Url
    App.Preencher Campo    0    ${srv}/lista.m3u

Crio o perfil "${nome}"
    App.Preencher Campo    0    ${nome}
    App.Clicar No Botao    Salvar

Abro a seção "${secao}"
    App.Clicar No Elemento    .cl-hub:has-text("${secao}")

Escolho a categoria "${categoria}"
    App.Clicar No Elemento    .cl-cat:has-text("${categoria}")

Busco por "${texto}"
    App.Clicar No Botao    Buscar
    App.Preencher Campo    0    ${texto}

Abro o primeiro título
    App.Esperar Elementos    .cl-poster
    App.Clicar No Elemento    .cl-poster    0

Abro a página "${caminho}"
    App.Abrir Pagina    ${caminho}

Escolho a temporada "${nome}"
    App.Clicar No Elemento    .cl-season:has-text("${nome}")

# ---------- Então ----------
Nenhum bloco tem barra de rolagem lateral
    ${n}=    App.Rolagens Laterais
    Should Be Equal As Integers    ${n}    0

O carrossel "${titulo}" está na página ${n}
    ${p}=    App.Pagina Do Carrossel    ${titulo}
    Should Be Equal As Integers    ${p}    ${n}

As notas de "${titulo}" estão no formato X,XX
    ${notas}=    App.Textos    section[aria-label="${titulo}"] .cl-rating--right
    FOR    ${nota}    IN    @{notas}
        Should Match Regexp    ${nota}    ^\\d,\\d{2}$
    END

Vejo as etiquetas Filme e Série em "${titulo}"
    ${tags}=    App.Textos    section[aria-label="${titulo}"] .cl-flag
    Should Contain    ${tags}    Filme
    Should Contain    ${tags}    Série

O usuário criado tem ${n} números
    ${u}=    App.Ler Texto    \#res-usuario
    Should Match Regexp    ${u}    ^\\d{${n}}$
    Set Test Variable    ${USUARIO_CRIADO}    ${u}

A senha criada tem ${n} números
    ${s}=    App.Ler Texto    \#res-senha
    Should Match Regexp    ${s}    ^\\d{${n}}$
    Set Test Variable    ${SENHA_CRIADA}    ${s}

O usuário criado consegue entrar
    App.Abrir Pagina    /contas.html
    App.Clicar No Botao    Sair da conta
    App.Esperar Pagina    entrar.html
    Entro com o usuário "${USUARIO_CRIADO}" e a senha "${SENHA_CRIADA}"
    App.Esperar Pagina    perfis.html

Fico na mesma tela mesmo depois de ${n} tentativas
    No Operation

Estou na página "${nome}"
    App.Esperar Pagina    ${nome}

Vejo o texto "${texto}"
    App.Ver Texto    ${texto}

Não vejo o texto "${texto}"
    App.Nao Ver Texto    ${texto}

Vejo ${n} pôsteres
    ${c}=    App.Contar Elementos    .cl-poster
    Should Be Equal As Integers    ${c}    ${n}

Vejo pelo menos ${n} pôsteres
    App.Esperar Elementos    .cl-poster
    ${c}=    App.Contar Elementos    .cl-poster
    Should Be True    ${c} >= ${n}

Vejo ${n} episódios
    ${c}=    App.Contar Elementos    .cl-ep
    Should Be Equal As Integers    ${c}    ${n}

A página não tem erros de script
    ${erros}=    App.Erros De Script
    Should Be Empty    ${erros}
