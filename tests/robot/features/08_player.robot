Language: pt-BR

*** Settings ***
Documentation     Funcionalidade: o player toca filmes e canais ao vivo, avisa quando não dá e retoma de onde parou.
...               Usa vídeos pequenos de teste servidos pelo provedor falso (tests/mock/media).
Resource          ../resources/passos.resource
Suite Setup       Preparar Ambiente
Suite Teardown    Desligar Ambiente
Test Setup        Abrir Aparelho Novo
Test Teardown     Fechar Aparelho
Force Tags        player

*** Test Cases ***
Cenário: O filme toca e o tempo avança
    Dado que entrei com a lista de teste e o perfil "CaDu"
    Quando abro a seção "Filmes"
    E busco por "Título Único"
    E abro o primeiro título
    E toco em "Assistir"
    Então estou na página "player.html"
    E o vídeo está tocando há 1 segundos

Cenário: Formato que o navegador não toca avisa e oferece tentar de novo
    Dado que entrei com a lista de teste e o perfil "CaDu"
    Quando abro a seção "Filmes"
    E busco por "Formato Estranho"
    E abro o primeiro título
    E toco em "Assistir"
    Então vejo o texto "formato que o aparelho não toca"
    E vejo o botão "Tentar de novo"

Cenário: Canal ao vivo (HLS) toca
    Dado que entrei com a lista de teste e o perfil "CaDu"
    Quando abro a seção "TV ao Vivo"
    E busco por "Canal 1 HD"
    E abro o primeiro título
    Então estou na página "player.html"
    E o vídeo está tocando há 1 segundos

Cenário: Canal fora do ar avisa em vez de ficar parado
    Dado que entrei com a lista de teste e o perfil "CaDu"
    Quando abro a seção "TV ao Vivo"
    E busco por "Canal Fora do Ar"
    E abro o primeiro título
    Então vejo o texto "fora do ar"
    E vejo o botão "Tentar de novo"

Cenário: Trocar de canal com as setas
    Dado que entrei com a lista de teste e o perfil "CaDu"
    Quando abro a seção "TV ao Vivo"
    E busco por "Canal 1 HD"
    E abro o primeiro título
    Então o vídeo está tocando há 1 segundos
    Quando pressiono a seta "ArrowDown"
    Então vejo o texto "fora do ar"
    Quando pressiono a seta "ArrowDown"
    Então o vídeo está tocando há 1 segundos

Cenário: Voltar ao filme retoma de onde parou
    Dado que entrei com a lista de teste e o perfil "CaDu"
    Quando abro a seção "Filmes"
    E busco por "Título Único"
    E abro o primeiro título
    E toco em "Assistir"
    Então o vídeo está tocando há 3 segundos
    Quando mexo o mouse
    E toco em "Voltar"
    Então vejo o botão "Continuar"
    Quando toco em "Continuar"
    Então o vídeo retomou em 2.5 segundos
