Language: pt-BR

*** Settings ***
Documentation     Funcionalidade: login do app (usuário e senha numéricos, teclado para controle remoto).
...               Contas de TESTE: administrador 010101/123456, cliente 111111/222222, vencido 333333/444444, tela em uso 555555/666666.
Resource          ../resources/passos.resource
Suite Setup       Preparar Ambiente
Suite Teardown    Desligar Ambiente
Test Setup        Abrir Aparelho Novo
Test Teardown     Fechar Aparelho
Force Tags        login

*** Test Cases ***
Cenário: Entrar com usuário e senha certos leva à escolha de perfil
    [Tags]    smoke
    Dado que estou na tela de entrar
    Quando entro com o usuário "111111" e a senha "222222"
    Então estou na página "perfis.html"

Cenário: Digitar pelo teclado da tela, como no controle remoto
    Dado que estou na tela de entrar
    Quando toco nas teclas "111111"
    E toco no botão do teclado "Próximo"
    E toco nas teclas "222222"
    Então estou na página "perfis.html"

Cenário: Senha errada mostra a mensagem única
    Dado que estou na tela de entrar
    Quando entro com o usuário "111111" e a senha "000000"
    Então vejo o texto "Usuário ou senha incorretos."
    E estou na página "entrar.html"

Cenário: Usuário que não existe mostra a MESMA mensagem
    Dado que estou na tela de entrar
    Quando entro com o usuário "999999" e a senha "000000"
    Então vejo o texto "Usuário ou senha incorretos."
    E não vejo o texto "não existe"

Cenário: Cinco erros seguidos bloqueiam por alguns minutos
    Dado que estou na tela de entrar
    Quando entro com o usuário "111111" e a senha "000000"
    E digito a senha "000001"
    E digito a senha "000002"
    E digito a senha "000003"
    E digito a senha "000004"
    E digito a senha "222222"
    Então vejo o texto "Muitas tentativas"
    E estou na página "entrar.html"

Cenário: Plano vencido avisa depois de acertar a senha
    Dado que estou na tela de entrar
    Quando entro com o usuário "333333" e a senha "444444"
    Então vejo o texto "Seu plano venceu"

Cenário: Tela do plano já em uso por outro aparelho
    Dado que estou na tela de entrar
    Quando entro com o usuário "555555" e a senha "666666"
    Então vejo o texto "1 tela(s) ao mesmo tempo"

Cenário: Esqueci minha senha responde igual para usuário que existe e que não existe
    Dado que estou na tela de entrar
    Quando toco em "Esqueci minha senha"
    E peço a recuperação para o usuário "999999"
    Então vejo o texto "Se houver um cadastro, enviamos um código"
    Quando peço a recuperação para o usuário "111111"
    Então vejo o texto "Se houver um cadastro, enviamos um código"

Cenário: Cliente sai da conta e volta para entrar
    Dado que entrei como cliente com o perfil "Ana"
    Quando abro a página "/contas.html"
    E toco em "Sair da conta"
    Então estou na página "entrar.html"
