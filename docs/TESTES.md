# Testes

## Estratégia (pirâmide)

| Tipo | Ferramenta | Onde | Roda |
|---|---|---|---|
| Unitário (regras de negócio) | `node --test` | `tests/unit` | todo push/PR |
| Funcional / regressão (BDD) | Robot Framework + Playwright (Python), **Page Objects** | `tests/robot` | todo push/PR |
| Integração (app + banco com RLS) | Robot/pytest contra Supabase de teste | `tests/integration` | PR |
| Segurança / pentest | testes de RLS e API que devem falhar, OWASP ZAP | `tests/security` | PR + antes de publicar |
| Carga e estresse | k6 | `tests/load` | manual/agendado + antes de publicar |
| Homologação | ambiente de prévia na Vercel | — | todo PR |

Escrita dos cenários sempre em **BDD** (Dado/Quando/Então). Page Objects: cada tela tem uma classe com seus elementos e ações; os cenários só falam a linguagem do negócio.

## Rodar tudo

```
npm run test:unit    # lógica: leitura de listas M3U e Xtream (Node, 1 segundo)
npm run test:bdd     # funcional/regressão: Robot Framework + Python/Playwright
```

Para o BDD, uma vez: `pip install -r tests/robot/requirements.txt` e `python -m playwright install chromium`.

## Vídeos de teste

`tests/mock/media/` tem um filme de 30 s (`video.mp4`) e um canal ao vivo de 12 s (HLS), gerados com ffmpeg e servidos pelo provedor falso. O provedor falso também tem um filme `.avi` (formato que não toca) e um canal fora do ar, para os cenários de erro do player.

## Como o BDD funciona

- Cenários em português em `tests/robot/features/*.robot` (Dado / Quando / Então / E).
- As frases ficam em `tests/robot/resources/passos.resource`; a parte que controla o navegador fica em `tests/robot/libs/AppLib.py`.
- Cada rodada sobe o app (`servidor.py`) e um **provedor de lista falso** (`tests/mock/xtream_mock.py`: usuário `test`, senha `123`, 300 filmes, 40 séries, 20 canais). Nada acessa provedor real.
- Cada cenário começa com um "aparelho novo" (sem lista, sem perfil).

## Tags

| Tag | O que é |
|---|---|
| `smoke` | Poucos cenários rápidos e críticos (cai no login, entra com usuário e senha, cria perfil e vê a home). Roda primeiro. |
| (sem `smoke`) | **Regressão**: o resto. Só roda se o smoke passar. |
| `listagem`, `responsivo`, `player`, `lista`, `login`, `usuarios`, `perfis`, `home`, `catalogo`, `demonstracao` | Uma tag por assunto/tela. Ex.: `python -m robot --include catalogo tests/robot/features` |

Cenário novo: exatamente uma rodada (smoke ou regressão) e a tag da tela. Vira `smoke` só se for rápido, confiável, criar o próprio dado e for crítico.

## Evidência

Em `results/` (o Actions anexa a pasta no relatório):

- `results/prints/OK-*.png`: print do último passo de cada cenário que passou.
- `results/prints/FALHOU-*.png` e `results/videos/FALHOU-*.webm`: print e vídeo (quando o gravador de vídeo está instalado) de cada cenário que falhou.
- `results/**/report.html` e `log.html`: relatório do Robot.

## GitHub Actions

`.github/workflows/ci.yml`: **lógica → smoke → regressão**, em todo push na `main`, em todo Pull Request e manualmente (aba Actions → Testes → Run workflow). Pull Request vermelho não entra.

## Meta

100% verde. Todo vermelho tem causa medida (log, print, vídeo): nunca "corrigir por dedução".
