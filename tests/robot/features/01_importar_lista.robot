Language: pt-BR

*** Settings ***
Documentation     Funcionalidade: o administrador importa a lista do provedor (só ele vê esta tela).
Resource          ../resources/passos.resource
Suite Setup       Preparar Ambiente
Suite Teardown    Desligar Ambiente
Test Setup        Abrir Aparelho Novo
Test Teardown     Fechar Aparelho
Force Tags        lista

*** Test Cases ***
Cenário: Quem ainda não entrou cai na tela de entrar
    [Tags]    smoke
    Dado que abri o app
    Então estou na página "entrar.html"
    E vejo o texto "Esqueci minha senha"

Cenário: Importar a demonstração leva à criação do perfil
    Dado que estou na tela de importar a lista
    Quando toco em "Usar demonstração"
    Então estou na página "perfis.html"
    E vejo o texto "Novo perfil"

Cenário: Senha errada do provedor mostra a mensagem e não importa
    Dado que estou na tela de importar a lista
    Quando preencho servidor, usuário "test" e senha "errada"
    E toco em "Importar"
    Então vejo o texto "Usuário ou senha incorretos"
    E estou na página "lista.html"

Cenário: Importar com usuário e senha do provedor leva à criação do perfil
    Dado que estou na tela de importar a lista
    Quando preencho servidor, usuário "test" e senha "123"
    E toco em "Importar"
    Então estou na página "perfis.html"

Cenário: Importar a lista por link M3U
    Dado que estou na tela de importar a lista
    Quando escolho a aba "Link M3U"
    E colo o link da lista M3U
    E toco em "Importar"
    Então estou na página "perfis.html"

Cenário: Cliente não consegue abrir a importação de lista
    Dado que entrei como cliente com o perfil "Ana"
    Quando abro a página "/lista.html"
    Então estou na página "home.html"
