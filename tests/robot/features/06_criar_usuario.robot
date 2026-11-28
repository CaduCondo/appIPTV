Language: pt-BR

*** Settings ***
Documentation     Funcionalidade: o administrador cria usuários com plano e telas (e compartilha por WhatsApp).
Resource          ../resources/passos.resource
Suite Setup       Preparar Ambiente
Suite Teardown    Desligar Ambiente
Test Setup        Abrir Aparelho Novo
Test Teardown     Fechar Aparelho
Force Tags        usuarios

*** Test Cases ***
Cenário: Criar usuário automático com plano e telas
    Dado que estou na tela de criar usuário
    Quando escolho "Criar usuário automaticamente"
    E escolho "Mensal"
    E escolho "2 Telas"
    E toco exatamente em "Criar usuário"
    Então o usuário criado tem 6 números
    E a senha criada tem 6 números
    E vejo o texto "Compartilhar por WhatsApp"

Cenário: O usuário criado consegue entrar
    Dado que estou na tela de criar usuário
    Quando escolho "Criar usuário automaticamente"
    E escolho "Anual"
    E escolho "1 Tela"
    E toco exatamente em "Criar usuário"
    Então o usuário criado tem 6 números
    E a senha criada tem 6 números
    E o usuário criado consegue entrar

Cenário: Degustação não pede a quantidade de telas
    Dado que estou na tela de criar usuário
    Quando escolho "Criar usuário automaticamente"
    E escolho "Degustação"
    Então não vejo o texto "Quantas telas ao mesmo tempo"
    Quando toco exatamente em "Criar usuário"
    Então vejo o texto "1 tela(s)"

Cenário: Usuário manual com menos de 11 números é recusado
    Dado que estou na tela de criar usuário
    Quando escolho "Criar usuário manualmente"
    E digito o usuário "123" no campo manual
    E toco no botão do teclado "Continuar"
    Então vejo o texto "11 números"
    E não vejo o texto "Quanto tempo de acesso"

Cenário: Usuário manual com 11 números segue e é criado
    Dado que estou na tela de criar usuário
    Quando escolho "Criar usuário manualmente"
    E digito o usuário "11999998888" no campo manual
    E toco no botão do teclado "Continuar"
    E escolho "Semestral"
    E escolho "3 Telas"
    E toco exatamente em "Criar usuário"
    Então vejo o texto "11999998888"
    E a senha criada tem 6 números

Cenário: Cliente não vê o botão Criar usuário e não abre a tela
    Dado que entrei como cliente com o perfil "Ana"
    Então não vejo o texto "Criar usuário"
    Quando abro a página "/criar-usuario.html"
    Então estou na página "home.html"

Cenário: A home não tem o botão Criar usuário; o administrador o encontra no Perfil
    Dado que entrei pela demonstração com o perfil "Admin"
    Então não vejo o texto "Criar usuário"
    Quando toco no meu perfil
    Então vejo o texto "Criar usuário"
