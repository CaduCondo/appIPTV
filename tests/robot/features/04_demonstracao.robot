Language: pt-BR

*** Settings ***
Documentation     Funcionalidade: a demonstração (conteúdo de exemplo) permite navegar por todo o app.
Resource          ../resources/passos.resource
Suite Setup       Preparar Ambiente
Suite Teardown    Desligar Ambiente
Test Setup        Abrir Aparelho Novo
Test Teardown     Fechar Aparelho
Force Tags        demonstracao

*** Test Cases ***
Cenário: A home da demonstração mostra continuar assistindo e jogos de exemplo
    Dado que entrei pela demonstração com o perfil "CaDu"
    Então vejo o texto "Continuar assistindo"
    E vejo o texto "Últimos adicionados"
    E vejo o texto "Jogos do dia"
    E vejo o texto "Atlético Norte"
    E a página não tem erros de script

Cenário: Filmes da demonstração têm várias categorias com vários títulos
    Dado que entrei pela demonstração com o perfil "CaDu"
    Quando abro a seção "Filmes"
    E escolho a categoria "Ação"
    Então vejo pelo menos 5 pôsteres

Cenário: A série da demonstração tem temporadas e episódios
    Dado que entrei pela demonstração com o perfil "CaDu"
    Quando abro a seção "Séries"
    E busco por "Terra da Máfia"
    E abro o primeiro título
    Então vejo o texto "Temporada 02"
    E vejo 10 episódios
    Quando escolho a temporada "Temporada 02"
    Então vejo 9 episódios

Cenário: Título de exemplo sem vídeo avisa em vez de quebrar
    Dado que entrei pela demonstração com o perfil "CaDu"
    Quando abro a seção "Filmes"
    E busco por "A Casa do Lago Seco"
    E abro o primeiro título
    E toco em "Assistir"
    Então vejo o texto "só uma vitrine de demonstração"
