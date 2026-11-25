// Cria no GitHub as issues dos rascunhos em docs/backlog/*.md que ainda não existem.
// Uso: node tools/criar_issues.js            (só mostra)
//      node tools/criar_issues.js --apply    (cria)
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const REPO = 'CaduCondo/appIPTV';
const apply = process.argv.includes('--apply');
const dir = path.join(__dirname, '..', 'docs', 'backlog');
const gh = (args) => execFileSync('gh', args, { encoding: 'utf8' });

const existentes = JSON.parse(gh(['api', `repos/${REPO}/issues?state=all&per_page=100`])).map((i) => i.title);
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.md')).sort()) {
  const txt = fs.readFileSync(path.join(dir, f), 'utf8');
  const m = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(txt);
  if (!m) continue;
  const meta = Object.fromEntries(m[1].split('\n').map((l) => l.split(/:\s*(.*)/).slice(0, 2)));
  const labels = (meta.labels || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (existentes.includes(meta.titulo)) { console.log('já existe:', meta.titulo); continue; }
  console.log((apply ? 'criando: ' : 'criaria:  ') + meta.titulo + '  [' + labels.join(', ') + ']');
  if (apply) {
    const args = ['api', `repos/${REPO}/issues`, '-f', `title=${meta.titulo}`, '-f', `body=${m[2].trim()}`];
    labels.forEach((l) => args.push('-f', `labels[]=${l}`));
    console.log('  ->', JSON.parse(gh(args)).html_url);
  }
}
