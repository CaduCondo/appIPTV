Language: pt-BR

*** Settings ***
Documentation     Funcionalidade: o app se encaixa em qualquer tamanho de tela (TV 720p/1080p/4K, tablet, celular em pé e deitado).
...               Regimes: tv (desenho de 1280 ampliado), tablet e celular (layout fluido). Ver docs/RESPONSIVIDADE.md.
Resource          ../resources/passos.resource
Suite Setup       Preparar Ambiente
Suite Teardown    Desligar Ambiente
Test Setup        Abrir Aparelho Novo
Test Teardown     Fechar Aparelho
Force Tags        responsivo

*** Test Cases ***
Cenário: Celular pequeno em pé (360x740) — nada passa da largura
    Dado que estou num celular de 360x740
    Então percorro todas as telas e nada passa da largura

Cenário: Celular em pé (390x844) — nada passa da largura
    [Tags]    smoke
    Dado que estou num celular de 390x844
    Então percorro todas as telas e nada passa da largura

Cenário: Celular deitado (844x390) — nada passa da largura
    Dado que estou num celular de 844x390
    Então percorro todas as telas e nada passa da largura

Cenário: Tablet em pé (768x1024) — nada passa da largura
    Dado que estou num aparelho de 768x1024
    Então percorro todas as telas e nada passa da largura

Cenário: TV 720p (1280x720) — nada passa da largura
    Dado que estou num aparelho de 1280x720
    Então percorro todas as telas e nada passa da largura

Cenário: TV Full HD (1920x1080) — nada passa da largura
    Dado que estou num aparelho de 1920x1080
    Então percorro todas as telas e nada passa da largura

Cenário: TV 4K (3840x2160) — nada passa da largura
    Dado que estou num aparelho de 3840x2160
    Então percorro todas as telas e nada passa da largura

Cenário: No celular o texto fica legível
    Dado que estou num celular de 390x844
    Quando entro com o usuário "111111" e a senha "222222"
    E crio o perfil "Ana"
    Então estou na página "home.html"
    E o texto não é menor que 12 pixels

Cenário: No celular as categorias viram um botão e a grade tem 2 colunas
    Dado que estou num celular de 390x844
    E que entrei como cliente com o perfil "Ana"
    Quando abro a seção "Filmes"
    Então vejo o botão "Categorias"
    E a grade mostra 2 colunas

Cenário: Na TV Full HD as categorias ficam ao lado e a grade tem 5 colunas
    Dado que estou num aparelho de 1920x1080
    E que entrei como cliente com o perfil "Ana"
    Quando abro a seção "Filmes"
    Então não vejo o texto "Categorias ·"
    E a grade mostra 5 colunas

Cenário: No celular o carrossel mostra poucos itens e desliza com o dedo
    Dado que estou num celular de 390x844
    E que entrei como cliente com o perfil "Ana"
    Então o carrossel "Últimos filmes adicionados" mostra 2 itens por vez
    E o carrossel "Últimos filmes adicionados" está na página 1
    Quando deslizo o dedo no carrossel "Últimos filmes adicionados"
    Então o carrossel "Últimos filmes adicionados" está na página 2

Cenário: Na TV 4K o conteúdo ocupa a tela toda
    Dado que estou num aparelho de 3840x2160
    E que entrei como cliente com o perfil "Ana"
    Então o conteúdo ocupa a largura toda da tela
