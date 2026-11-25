Language: pt-BR

*** Settings ***
Documentation     Funcionalidade: perfis e a tela inicial (home).
Resource          ../resources/passos.resource
Suite Setup       Preparar Ambiente
Suite Teardown    Desligar Ambiente
Test Setup        Abrir Aparelho Novo
Test Teardown     Fechar Aparelho
Force Tags        perfis    home

*** Test Cases ***
Cenário: Criar o primeiro perfil abre a home com saudação
    [Tags]    smoke
    Dado que entrei com a lista de teste e o perfil "CaDu"
    Então vejo o texto "CaDu!"
    E vejo o texto "Escolha uma seção para começar a assistir"
    E a página não tem erros de script

Cenário: A home mostra as seções com a contagem da lista
    Dado que entrei com a lista de teste e o perfil "CaDu"
    Então vejo o texto "300 títulos"
    E vejo o texto "40 séries"
    E vejo o texto "20 canais"
    E vejo o texto "Favoritos"

Cenário: Sem escolher perfil a home volta para a escolha de perfil
    Dado que entrei com a lista de teste e o perfil "CaDu"
    Quando abro a página "/perfis.html"
    E abro a página "/home.html"
    Então estou na página "home.html"
