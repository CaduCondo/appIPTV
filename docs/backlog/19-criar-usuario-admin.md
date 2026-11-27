---
titulo: Criar usuário (administrador) com plano, telas e compartilhar por WhatsApp
labels: tipo:feature, prioridade:p1, estado:todo, area:login
---
## Contexto
O administrador (`010101`) cria usuários: automático (6 números) ou manual (11 números), escolhe o plano e as telas e compartilha usuário e senha por WhatsApp.

## Critérios de aceitação (BDD)
- **Dado** o administrador na home, **quando** toca em Criar usuário e escolhe automático, **então** vê um usuário e uma senha de 6 números.
- **Dado** o modo manual, **quando** digita um usuário com menos de 11 números, **então** vê o erro e não avança.
- **Dado** o plano Degustação, **quando** avança, **então** não precisa escolher telas (1 tela).
- **Dado** o usuário criado, **quando** toco em Compartilhar por WhatsApp, **então** abre o WhatsApp com a mensagem pronta.
- **Dado** um usuário comum, **quando** abre a home, **então** não vê o botão Criar usuário.
