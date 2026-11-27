---
titulo: Player: tocar mais formatos e canais ao vivo (HLS) com segurança
labels: tipo:feature, prioridade:p1, estado:todo, area:player
---
## Contexto
O player usa o `<video>` do navegador. Arquivos `.mkv` e fluxos `.ts` muitas vezes não tocam, e canais ao vivo (`.m3u8`) dependem de CORS. Hoje só há uma mensagem de erro e não há teste que prove que o vídeo toca.

## Tarefas
- [ ] Teste BDD que toca um vídeo `mp4` pequeno do provedor falso e confere que o tempo avança.
- [ ] Teste de canal HLS (playlist falsa) passando pelo proxy.
- [ ] Mensagem clara por tipo de erro (formato, acesso negado, canal fora do ar) e botão "Tentar de novo".
- [ ] Avaliar conversão/transmux de `.ts`/`.mkv` e registrar a decisão.
- [ ] Trocar de canal sem voltar à lista (setas ↑↓ no player ao vivo).

## Critérios de aceitação (BDD)
- **Dado** um filme `mp4` do provedor, **quando** toco em Assistir, **então** o vídeo começa e o tempo avança.
- **Dado** um canal com playlist HLS, **quando** abro o canal, **então** a imagem começa a tocar.
- **Dado** um formato que o navegador não toca, **quando** abro o título, **então** vejo uma mensagem que explica o motivo e o que fazer.
- **Dado** que assisti 20% de um filme, **quando** volto e toco em Continuar, **então** ele retoma de onde parou.
