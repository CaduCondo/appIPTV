---
titulo: Player em tela cheia: barra de tempo com prévia, menu pela seta para baixo, áudio e legendas
labels: tipo:feature, prioridade:p1, estado:backlog, area:player
---
## Contexto
Pedido do Cadu (28/nov/2026), com prints de referência: ao apertar a seta ↓ aparece a barra de tempo com tempo atual e total, título e atalhos (Sair, Reproduzir/Pausar, Voltar, Acelerar, Info). Ao avançar mostra uma **prévia da cena** do momento perto da barra. Menu de **configurações de reprodução**: áudio (se houver outro idioma), legenda (ligar/desligar e idioma), tempo da legenda, tamanho (Normal/Grande/Pequeno) e estilo.

## Critérios de aceitação (BDD)
- **Dado** o filme em tela cheia, **quando** aperto ↓, **então** vejo a barra de tempo, o título e as opções.
- **Dado** a barra, **quando** arrasto para 45:00, **então** vejo a prévia da cena e o tempo 45:00.
- **Dado** um filme com duas faixas de áudio, **quando** escolho a segunda, **então** o áudio muda.
- **Dado** a legenda, **quando** escolho tamanho Grande, **então** ela aparece maior.
