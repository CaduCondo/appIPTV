Language: pt-BR

*** Settings ***
Documentation     Funcionalidade: filmes, séries, busca e favoritos.
Resource          ../resources/passos.resource
Suite Setup       Preparar Ambiente
Suite Teardown    Desligar Ambiente
Test Setup        Abrir Aparelho Novo
Test Teardown     Fechar Aparelho
Force Tags        catalogo

*** Test Cases ***
Cenário: Filmes lista os pôsteres e a categoria muda a lista
    Dado que entrei com a lista de teste e o perfil "CaDu"
    Quando abro a seção "Filmes"
    Então vejo o texto "Todos · 300 títulos"
    Quando escolho a categoria "Drama"
    Então vejo o texto "Drama ·"
    E a página não tem erros de script

Cenário: A busca encontra o título pelo nome
    Dado que entrei com a lista de teste e o perfil "CaDu"
    Quando abro a seção "Filmes"
    E busco por "Título Único"
    Então vejo 1 pôsteres

Cenário: Favoritar um filme coloca ele em Favoritos
    Dado que entrei com a lista de teste e o perfil "CaDu"
    Quando abro a seção "Filmes"
    E busco por "Título Único"
    E abro o primeiro título
    E toco em "Favorito"
    Então vejo o texto "Nos favoritos"
    Quando abro a página "/favoritos.html"
    Então vejo o texto "Título Único"

Cenário: A série mostra temporadas e episódios
    Dado que entrei com a lista de teste e o perfil "CaDu"
    Quando abro a seção "Séries"
    E abro o primeiro título
    Então vejo o texto "Temporada 01"
    E vejo 6 episódios
    Quando escolho a temporada "Temporada 02"
    Então vejo 3 episódios

Cenário: TV ao Vivo lista os canais
    Dado que entrei com a lista de teste e o perfil "CaDu"
    Quando abro a seção "TV ao Vivo"
    Então vejo o texto "Todos · 20 canais"
