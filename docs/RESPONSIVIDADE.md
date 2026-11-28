# Responsividade (TV, tablet e celular)

O app roda em TVs de vários tamanhos (720p, 1080p, 4K), em tablets e em celulares (em pé e deitados). Nenhuma tela pode ter barra de rolagem lateral nem conteúdo passando da largura da tela.

## Os três regimes

A página escolhe sozinha (`CL.layout` em `js/app.js`, regra `regimeDeTela` em `js/rules.js`) e marca `<html data-layout="...">`:

| Regime | Quando | Como se comporta |
|---|---|---|
| **tv** | largura ≥ 1000 px e altura ≥ 500 px (TV, computador) | Desenho de 1280 px **ampliado** para a tela (1920 → 1,5x, 4K → 3x). Categorias ao lado, 5 colunas de pôsteres |
| **tablet** | 600 a 999 px (ou celular deitado, ou TV com 960 px de CSS) | Layout fluido: 3 colunas de pôsteres, categorias viram o botão "Categorias" |
| **phone** | abaixo de 600 px | Layout fluido: 2 colunas, botões grandes (44 px ou mais), carrosséis com 1 a 2 itens por vez, tela de entrar em uma coluna |

## Regras para quem mexe no código

- Nunca fixar largura em px num bloco que precisa caber no celular: use `width: 100%` + `max-width`.
- Regras só de um regime ficam em `css/app.css`, no fim, com `html[data-layout="phone"]` etc. Fora da TV, todo botão tem pelo menos 44 px de altura.
- Carrossel: `perPage` é o valor da TV (ex.: 6); nos outros regimes diminui sozinho (`itensPorPagina`). Pode passar `{ tv, tablet, phone }`. No celular o carrossel avança com o **deslize do dedo**.
- Listagens: fora da TV, as categorias ficam atrás do botão **Categorias**.

## Como testamos

`tests/robot/features/09_responsivo.robot` (tag `responsivo`) percorre todas as telas em 7 tamanhos (celular 360x740, 390x844, 844x390; tablet 768x1024; TV 1280x720, 1920x1080, 3840x2160) e confere que nada passa da largura, o texto não fica menor que 12 px, a grade tem o número certo de colunas e o carrossel desliza com o dedo.
