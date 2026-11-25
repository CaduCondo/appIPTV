---
titulo: Decidir e montar como a TV acessa o app (hospedagem + proxy)
labels: tipo:infra, prioridade:p1, estado:pronto, area:infra
---
## Contexto
Hoje o app só funciona no computador do Cadu: o `servidor.py` (Python) serve as telas e busca a lista do provedor (o navegador sozinho é bloqueado por CORS). A TV não roda Python. Sem resolver isso o objetivo (assistir na TV) não fecha.

## Tarefas
- [ ] Comparar caminhos: (a) hospedar o app e um proxy online (ex.: Vercel com função), (b) manter servidor no PC da casa acessado pela TV pela rede local, (c) empacotar como app de TV (ver issue de Android TV).
- [ ] Recomendar um (custo, risco, esforço) em linguagem simples e registrar em `docs/PEDIDOS-E-DECISOES.md` após o Cadu escolher.
- [ ] Implementar o escolhido, com proxy que não guarda credenciais e só aceita o que o app precisa.
- [ ] Atualizar `docs/COMECAR_AQUI.md` com o passo a passo.

## Critérios de aceitação (BDD)
- **Dado** o app publicado no caminho escolhido, **quando** abro o endereço na TV/celular, **então** vejo a tela de login.
- **Dado** uma lista válida, **quando** importo pela TV, **então** chego à tela de perfis sem usar o computador.
- **Dado** um endereço de provedor qualquer, **quando** o proxy recebe um pedido para um endereço interno da rede (ex.: 127.0.0.1), **então** ele recusa.
