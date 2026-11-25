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

Que estou na tela de login
    App.Abrir Pagina    /login.html

Que entrei com a lista de teste e o perfil "${nome}"
    App.Abrir Pagina    /login.html
    ${srv}=    App.Provedor Url
    App.Preencher Campo    0    ${srv}
    App.Preencher Campo    1    test
    App.Preencher Campo    2    123
    App.Clicar No Botao    Entrar
    App.Esperar Pagina    perfis.html
    App.Preencher Campo    0    ${nome}
    App.Clicar No Botao    Salvar
    App.Esperar Pagina    home.html

Que entrei pela demonstração com o perfil "${nome}"
    App.Abrir Pagina    /login.html
    App.Clicar No Botao    Ver demonstração
    App.Esperar Pagina    perfis.html
    App.Preencher Campo    0    ${nome}
    App.Clicar No Botao    Salvar
    App.Esperar Pagina    home.html

# ---------- Quando ----------
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
