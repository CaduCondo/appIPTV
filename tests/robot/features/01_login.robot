Language: pt-BR

*** Settings ***
Documentation     Funcionalidade: entrar no app importando a lista.
Resource          ../resources/passos.resource
Suite Setup       Preparar Ambiente
Suite Teardown    Desligar Ambiente
Test Setup        Abrir Aparelho Novo
Test Teardown     Fechar Aparelho
Force Tags        login

*** Test Cases ***
Cenário: Quem ainda não importou uma lista cai na tela de login
    [Tags]    smoke
    Dado que abri o app
    Então estou na página "login.html"
    E vejo o texto "Importe a sua lista"

Cenário: Entrar pela demonstração leva à criação do perfil
    Dado que estou na tela de login
    Quando toco em "Ver demonstração"
    Então estou na página "perfis.html"
    E vejo o texto "Novo perfil"

Cenário: Senha errada mostra a mensagem e não entra
    Dado que estou na tela de login
    Quando preencho servidor, usuário "test" e senha "errada"
    E toco em "Entrar"
    Então vejo o texto "Usuário ou senha incorretos"
    E estou na página "login.html"

Cenário: Entrar com usuário e senha do provedor leva à criação do perfil
    [Tags]    smoke
    Dado que estou na tela de login
    Quando preencho servidor, usuário "test" e senha "123"
    E toco em "Entrar"
    Então estou na página "perfis.html"

Cenário: Importar a lista por link M3U
    Dado que estou na tela de login
    Quando escolho a aba "Link M3U"
    E colo o link da lista M3U
    E toco em "Entrar"
    Então estou na página "perfis.html"
