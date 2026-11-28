Language: pt-BR

*** Settings ***
Documentation     Funcionalidade: listagens de Filmes/Séries (título, ordenação, busca, menu com contagens, links da home).
Resource          ../resources/passos.resource
Suite Setup       Preparar Ambiente
Suite Teardown    Desligar Ambiente
Test Setup        Abrir Aparelho Novo
Test Teardown     Fechar Aparelho
Force Tags        listagem

*** Test Cases ***
Cenário: A tela mostra o título em maiúsculas e o combo de ordenação
    Dado que entrei pela demonstração com o perfil "CaDu"
    Quando abro a seção "Filmes"
    Então vejo o texto "FILMES"
    E vejo o texto "Ordenar"

Cenário: O combo ordena de A até Z e de Z até A
    Dado que entrei pela demonstração com o perfil "CaDu"
    Quando abro a seção "Filmes"
    E escolho a ordem "De Z até A"
    Então os títulos estão em ordem za
    Quando escolho a ordem "De A até Z"
    Então os títulos estão em ordem az

Cenário: A busca só filtra a partir da terceira letra
    Dado que entrei pela demonstração com o perfil "CaDu"
    Quando abro a seção "Filmes"
    E busco por "Ca"
    Então vejo pelo menos 10 pôsteres
    Quando busco por "Cas"
    Então vejo o texto "Casamento por Engano"
    E não vejo o texto "Dunkirk"

Cenário: A busca procura a palavra em qualquer parte do nome
    Dado que entrei pela demonstração com o perfil "CaDu"
    Quando abro a seção "Filmes"
    E busco por "asam"
    Então vejo o texto "Casamento por Engano"
    E vejo 1 pôsteres

Cenário: O menu tem a ordem pedida e a contagem em cada botão
    Dado que entrei pela demonstração com o perfil "CaDu"
    Quando abro a seção "Filmes"
    Então o menu segue a ordem pedida
    E vejo o texto "Todos ("

Cenário: O menu não tem barra de rolagem própria
    Dado que entrei pela demonstração com o perfil "CaDu"
    Quando abro a seção "Séries"
    Então o menu não tem barra de rolagem própria

Cenário: O título do carrossel de filmes da home leva aos adicionados recentemente
    Dado que entrei pela demonstração com o perfil "CaDu"
    Quando toco no título "Últimos filmes adicionados"
    Então estou na página "filmes.html"
    E o botão selecionado do menu é "Adicionados recentemente"

Cenário: O título do carrossel de séries da home leva aos adicionados recentemente
    Dado que entrei pela demonstração com o perfil "CaDu"
    Quando toco no título "Últimas séries adicionadas"
    Então estou na página "series.html"
    E o botão selecionado do menu é "Adicionados recentemente"
