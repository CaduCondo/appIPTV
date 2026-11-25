# Roadmap e fila de prioridade

A fila de verdade são as issues do GitHub (ordem: P0 > P1 > P2 > P3, e a ordem abaixo dentro de cada nível). Este arquivo guarda a **ordem e o porquê**; o Claude atualiza quando a fila muda.

## Pronto (esqueleto)

Login/importar lista · Perfis · Home · Filmes · Séries · TV ao Vivo · Detalhe · Player básico · Favoritos/Histórico · Contas · Testes (unit + BDD) · CI.

## Fila

| Ordem | Prior. | Assunto | Por que nessa posição |
|---|---|---|---|
| 1 | P1 | Como a TV acessa o app (hospedagem + proxy) | Sem isso o app só roda no computador com Python; é o maior risco do objetivo (assistir na TV) |
| 2 | P1 | Player: compatibilidade de formatos e canais HLS | É a função principal; `.mkv`/`.ts` não tocam no navegador |
| 3 | P1 | Desempenho com listas enormes (dezenas de milhares) | Lista real tem 40 mil+ itens; pode travar a TV |
| 4 | P2 | Esconder usuário e senha da lista (URL do player, histórico) | Risco de segurança em print/compartilhamento |
| 5 | P2 | Não engolir erros em silêncio | Um defeito já passou escondido por isso |
| 6 | P2 | Testes de navegação por controle remoto (setas/Enter/Esc) | A TV depende disso; hoje não há teste |
| 7 | P2 | Base de catálogo (TMDB): elenco com foto, prints, sinopses, tela de ator | O Cadu pediu; precisa de chave gratuita dele |
| 8 | P2 | Controle parental (PIN por perfil) | Perfis de criança |
| 9 | P2 | Empacotar para Android TV | Depende da decisão do item 1 |
| 10 | P2 | Novas telas (layouts que o Cadu vai mandar) | Bloqueado: aguardando os prints |
| 11 | P3 | Jogos do dia na home | Fonte de dados a decidir |
| 12 | P3 | Tela de Ajustes | Hoje é "em breve" |
| 13 | P3 | Código do aparelho / ativação pelo site | Precisa de servidor online |
| 14 | P3 | Guia de programação (EPG) | Depende da lista trazer EPG |
| 15 | P3 | Atualização automática da lista | Conforto |
