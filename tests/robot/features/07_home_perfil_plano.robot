Language: pt-BR

*** Settings ***
Documentation     Funcionalidade: home nova (carrosséis), menu Perfil e tela de Plano.
Resource          ../resources/passos.resource
Suite Setup       Preparar Ambiente
Suite Teardown    Desligar Ambiente
Test Setup        Abrir Aparelho Novo
Test Teardown     Fechar Aparelho
Force Tags        home    plano

*** Test Cases ***
Cenário: A home destaca TV ao Vivo, Filmes e Séries
    Dado que entrei como cliente com o perfil "Ana"
    Então vejo o texto "TV ao Vivo"
    E vejo o texto "Filmes"
    E vejo o texto "Séries"

Cenário: A home não tem barra de rolagem lateral
    Dado que entrei como cliente com o perfil "Ana"
    Então vejo o texto "Últimos adicionados"
    E nenhum bloco tem barra de rolagem lateral

Cenário: Últimos adicionados mostra a etiqueta Filme ou Série e a nota X,XX
    Dado que entrei como cliente com o perfil "Ana"
    Então vejo as etiquetas Filme e Série em "Últimos adicionados"
    E as notas de "Últimos adicionados" estão no formato X,XX

Cenário: O carrossel avança de página
    Dado que entrei como cliente com o perfil "Ana"
    Então o carrossel "Últimos adicionados" está na página 1
    Quando toco em Próximos no carrossel "Últimos adicionados"
    Então o carrossel "Últimos adicionados" está na página 2

Cenário: Jogo que ainda não começou mostra o horário
    Dado que entrei como cliente com o perfil "Ana"
    Quando toco no jogo que ainda não começou
    Então vejo o texto "começa às"
    E estou na página "home.html"

Cenário: Jogo em andamento abre o canal
    Dado que entrei como cliente com o perfil "Ana"
    Quando toco no jogo em andamento
    Então estou na página "player.html"

Cenário: O botão Perfil leva às opções do usuário
    Dado que entrei como cliente com o perfil "Ana"
    Quando toco no meu perfil
    Então estou na página "perfil.html"
    E vejo o texto "Trocar perfil"
    E vejo o texto "Configurações"
    E vejo o texto "Ajustes"
    E vejo o texto "Plano"

Cenário: Cliente vê o plano atual e só os planos para contratar
    Dado que entrei como cliente com o perfil "Ana"
    Quando abro a página "/plano.html"
    Então vejo o texto "Seu plano atual"
    E vejo o texto "Planos disponíveis"
    E vejo o texto "Trimestral"
    E não vejo o texto "Degustação"
    E não vejo o texto "Grátis"

Cenário: Administrador também vê Grátis e Degustação
    Dado que entrei pela demonstração com o perfil "Admin"
    Quando abro a página "/plano.html"
    Então vejo o texto "Degustação"
    E vejo o texto "Grátis"

Cenário: Contratar com plano ativo empilha para depois do atual
    Dado que entrei como cliente com o perfil "Ana"
    Quando abro a página "/plano.html"
    E escolho "Anual"
    E escolho "1 Tela"
    E toco em "Contratar"
    Então vejo o texto "Próximos planos"

Cenário: Detalhe e demais telas também não têm barra de rolagem lateral
    Dado que entrei pela demonstração com o perfil "Admin"
    Quando abro a seção "Séries"
    E busco por "Terra da Máfia"
    E abro o primeiro título
    Então vejo o texto "Temporada 02"
    E nenhum bloco tem barra de rolagem lateral
