---
titulo: Qualidade do canal ao vivo: automática (sem travar) ou manual
labels: tipo:feature, prioridade:p2, estado:backlog, area:player
---
## Contexto
Canais ao vivo têm várias qualidades (SD, HD, FHD, 4K, 8K). O sistema deve **tocar sempre a melhor qualidade sem travar por falta de buffer**, baixando a qualidade quando a internet não aguenta. Isso é uma escolha do usuário em **Configurações**: **Automático** ou **Manual**; no manual, ao apertar ↓ aparecem as opções de qualidade do canal.

## Critérios de aceitação (BDD)
- **Dado** Configurações em Automático e internet lenta, **quando** o canal começa a travar, **então** a qualidade cai sozinha.
- **Dado** Configurações em Manual, **quando** aperto ↓ no canal, **então** vejo as qualidades disponíveis e escolho uma.
- **Dado** a escolha manual, **quando** volto ao canal depois, **então** a qualidade escolhida é mantida.
