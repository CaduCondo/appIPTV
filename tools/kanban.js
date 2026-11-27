// Ferramenta do quadro: node tools/kanban.js estado <n> <estado> | comentar <n> "texto" | fila
const { execFileSync } = require('node:child_process');
const REPO = 'CaduCondo/appIPTV';
const ESTADOS = ['backlog', 'todo', 'wip', 'wtt', 'done', 'in-production', 'bloqueado'];

function gh(args, input) {
  return execFileSync('gh', args, { encoding: 'utf8', input });
}
function api(path, campos = []) {
  const args = ['api', `repos/${REPO}/${path}`];
  campos.forEach(([k, v]) => args.push('-f', `${k}=${v}`));
  return JSON.parse(gh(args) || 'null');
}

const [cmd, n, ...resto] = process.argv.slice(2);
if (cmd === 'estado') {
  const novo = resto[0];
  if (!ESTADOS.includes(novo)) throw new Error('Estado inválido. Use: ' + ESTADOS.join(', '));
  const atual = api(`issues/${n}`).labels.map((l) => l.name).filter((l) => l.startsWith('estado:'));
  atual.forEach((l) => { try { gh(['api', '-X', 'DELETE', `repos/${REPO}/issues/${n}/labels/${encodeURIComponent(l)}`]); } catch (e) { /* já não tinha */ } });
  gh(['api', `repos/${REPO}/issues/${n}/labels`, '-f', `labels[]=estado:${novo}`]);
  if (novo === 'in-production') gh(['api', '-X', 'PATCH', `repos/${REPO}/issues/${n}`, '-f', 'state=closed']);
  console.log(`#${n} -> estado:${novo}`);
} else if (cmd === 'comentar') {
  api(`issues/${n}/comments`, [['body', resto.join(' ')]]);
  console.log(`comentário em #${n}`);
} else if (cmd === 'fila') {
  const issues = api('issues?state=open&per_page=100').filter((i) => !i.pull_request);
  const peso = (i) => { const p = i.labels.map((l) => l.name).find((l) => l.startsWith('prioridade:')); return p ? Number(p.slice(-1)) : 9; };
  issues.sort((a, b) => peso(a) - peso(b) || a.number - b.number)
    .forEach((i) => console.log(`#${i.number} [${i.labels.map((l) => l.name).filter((l) => /^(prioridade|estado):/.test(l)).join(' ')}] ${i.title}`));
} else {
  console.log('Uso: node tools/kanban.js estado <n> <estado> | comentar <n> "texto" | fila');
}
