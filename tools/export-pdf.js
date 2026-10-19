/* ---------------------------------------------------------------------------
   Exporta uma apresentação em PDF, um slide por página.

       node tools/export-pdf.js                     → a primeira do decks.js
       node tools/export-pdf.js instalacao-de-estruturas

   O PDF sai em export/. Serve para revisar conteúdo e mandar para outras
   pessoas — não substitui a apresentação, que continua sendo o HTML.

   Como funciona: sobe o servidor numa porta própria, abre a apresentação em
   `?export` (que empilha os slides como páginas) no Chrome sem interface e
   manda imprimir. Nenhuma dependência: usa o Chrome já instalado.
   --------------------------------------------------------------------------- */

const { spawn, execFile } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');

const ROOT = path.resolve(__dirname, '..');

/* Porta própria, para não brigar com o servidor que pode estar no ar. */
const PORT = 4399;

/* Caminhos usuais do Chrome. CHROME_PATH tem prioridade, para quem instalou
   em outro lugar. */
const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  process.env.LOCALAPPDATA + '/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium'
].filter(Boolean);

function findChrome() {
  for (const p of CHROME_CANDIDATES) {
    try { if (fs.existsSync(p)) return p; } catch { /* segue */ }
  }
  return null;
}

/* Lê decks/decks.js sem precisar de navegador. */
function listDecks() {
  const src = fs.readFileSync(path.join(ROOT, 'decks', 'decks.js'), 'utf8');
  const sandbox = {};
  new Function('window', src)(sandbox);
  return sandbox.DECKS || [];
}

function waitForServer(port, tries = 40) {
  return new Promise((resolve, reject) => {
    const attempt = (left) => {
      const req = http.get({ host: '127.0.0.1', port, path: '/' }, (res) => {
        res.resume();
        resolve();
      });
      req.on('error', () => {
        if (left <= 0) return reject(new Error('o servidor não respondeu'));
        setTimeout(() => attempt(left - 1), 250);
      });
    };
    attempt(tries);
  });
}

/* Gera o PDF e devolve onde ele ficou. Usada pela linha de comando abaixo e
   também pelo botão Exportar do menu, através de tools/serve.js. */
async function exportDeck(id, onStep) {
  const step = onStep || (() => {});

  const chrome = findChrome();
  if (!chrome) {
    throw new Error('Chrome ou Edge não encontrado. Informe o caminho em CHROME_PATH.');
  }

  const decks = listDecks();
  id = id || decks[0];

  if (!id) throw new Error('Nenhuma apresentação registrada em decks/decks.js.');

  if (!fs.existsSync(path.join(ROOT, 'decks', id, 'index.html'))) {
    throw new Error('Não achei decks/' + id + '/index.html (registradas: ' + decks.join(', ') + ')');
  }

  /* Nome do arquivo: o título do deck, sem acento nem pontuação. */
  const deckSrc = fs.readFileSync(path.join(ROOT, 'decks', id, 'deck.js'), 'utf8');
  const sandbox = {};
  new Function('window', deckSrc)(sandbox);

  const title = (sandbox.DECK && sandbox.DECK.title) || id;
  const slides = sandbox.DECK ? sandbox.DECK.slides.length : 0;
  const fileName = title.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w\s-]/g, '').trim() + '.pdf';

  const outDir = path.join(ROOT, 'export');
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, fileName);

  step('Abrindo a apresentação');

  /* Servidor próprio numa porta reservada: assim a exportação não depende do
     servidor da live estar no ar, nem atrapalha quem estiver assistindo. */
  const server = spawn(process.execPath, [path.join(__dirname, 'serve.js'), String(PORT)], {
    cwd: ROOT,
    stdio: 'ignore'
  });

  const profile = path.join(os.tmpdir(), 'lesco-export-profile');
  fs.rmSync(profile, { recursive: true, force: true });

  try {
    await waitForServer(PORT);
    step('Renderizando ' + slides + ' slides');

    await new Promise((resolve, reject) => {
      execFile(chrome, [
        '--headless=new',
        '--disable-gpu',
        '--no-sandbox',
        '--user-data-dir=' + profile,
        '--no-pdf-header-footer',
        /* Tempo de sobra para as fotos chegarem antes de imprimir. */
        '--virtual-time-budget=240000',
        '--print-to-pdf=' + outFile,
        'http://127.0.0.1:' + PORT + '/decks/' + id + '/index.html?export'
      ], { maxBuffer: 1 << 24 }, (err) => (err ? reject(err) : resolve()));
    });

    return { file: outFile, fileName, title, slides, bytes: fs.statSync(outFile).size };
  } finally {
    server.kill();
    fs.rmSync(profile, { recursive: true, force: true });
  }
}

async function main() {
  try {
    console.log('');
    const r = await exportDeck(process.argv[2], (s) => console.log('  ' + s + '...'));
    console.log('\n  Pronto:  export/' + r.fileName + '  (' + (r.bytes / 1048576).toFixed(1) + ' MB)\n');
  } catch (e) {
    console.error('\n  Falhou: ' + e.message + '\n');
    process.exitCode = 1;
  }
}

module.exports = { exportDeck, listDecks, findChrome };

if (require.main === module) main();
