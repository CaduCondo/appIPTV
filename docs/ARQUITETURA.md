# Arquitetura

## Visão geral (alvo)

```
 TV / celular / navegador            Vercel                    Supabase
 ┌────────────────────┐   HTTPS   ┌───────────────┐   ┌───────────────────────────┐
 │ App (HTML/JS/React)│──────────▶│ Site + funções│──▶│ Auth (login, senha com hash)│
 │ dados locais:      │           │ (proxy de     │   │ Postgres + RLS              │
 │  lista do provedor │◀──────────│  lista, API)  │   │ Edge Functions (admin,      │
 └────────────────────┘           └───────────────┘   │  heartbeat, webhooks Pix)   │
        │                                              └───────────────────────────┘
        └─────────────▶ servidor do provedor da lista (vídeo/lista) — direto do aparelho
```

- **Vercel** = onde o site fica publicado e a lógica de servidor roda (ela publica sozinha a cada versão aprovada). Em uma frase: "a hospedagem do site".
- **Supabase** = banco de dados + login + regras de quem vê o quê (RLS) + funções de servidor.
- **GitHub** = código, fila de trabalho (issues), testes automáticos (Actions) e a trava de qualidade.
- **A lista do provedor e a senha dela ficam no aparelho do usuário**, nunca no nosso banco.

## Dados (Supabase) — tabelas principais

`usuarios` (usuário numérico único, papel, e-mail opcional) · `planos_usuario` (plano, telas, início, fim; empilha) · `aparelhos` (código do aparelho, último sinal) · `perfis` · `favoritos` (por perfil: tv/filme/série) · `historico` · `eventos_seguranca`.
**Toda tabela com RLS ligado.** Regras em `docs/SEGURANCA.md`; regras de negócio em `docs/REGRAS_DE_NEGOCIO.md`.

## Código (hoje)

- **Páginas** (`*.html`) + React local; `js/bundle.js` (componentes), `js/app.js` (núcleo, `window.CL`), `js/catalog.js` (leitura de listas, testável no Node), `js/listing.js`, `js/demo.js`, `servidor.py` (proxy local).
- **Alvo de organização (orientado a objeto, reuso, comentado):** `js/rules.js` (regras de negócio puras: planos, telas, senhas, bloqueio — **sem** navegador, testadas no Node) · `js/auth.js` (serviço de login, hoje com dados de teste; troca para Supabase sem mexer nas telas) · `js/services/*` (acesso ao banco).
- **Testes:** `tests/unit` (regras), `tests/robot` (BDD com **Page Objects**), `tests/security` (RLS/API/ZAP), `tests/load` (k6).

## Decisões em aberto

Ver issues `area:infra` (conta/projeto do Supabase, hospedagem, Pix).
